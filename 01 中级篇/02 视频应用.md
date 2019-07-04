# 视频

## Video DOM

```HTML
<video controls>
    <source src="myVideo.mp4" type="video/mp4">
    <source src="myVideo.webm" type="video/webm">
    <p>Your browser doesn't support HTML5 video. Here isa <a href="myVideo.mp4">link to the video</a> instead.</p>
</video>
```

属性        |属性值     |描述
------------|-----------|----
src         |URL        |要嵌到页面的视频的URL。可选；你也可以使用video块内的 \<source\> 元素来指定需要嵌到页面的视频
controls    |"无"       |加上这个属性，Gecko 会提供用户控制，允许用户控制视频的播放，包括音量，跨帧，暂停/恢复播放
autoplay    |Boolean    |指 "true" ，视频会马上自动开始播放
buffered    |Boolean    |指 "true" ，视频会自动开始缓存，即使没有设置自动播放，该属性适用于视频被认为可能会播放
height      ||视频展示区域的高度，单位是CSS像素
width       ||视频展示区域的宽度，单位是CSS像素
poster      |URL        |一个海报帧的URL，用于在用户播放或者跳帧之前展示
crossorigin |1. anonymous<br/>2. use-credentials|该枚举属性指明抓取相关图片是否必须用到CORS（跨域资源共享）:<br/>1. 跨域请求会被执行，但是不发送凭证<br/>2. 跨域请求会被执行，且发送凭证
loop        |Boolean    |指 "true" ，会在视频结尾的地方，自动返回视频开始的地方
muted       |Boolean    |指 "true" ，音频会初始化为静音，默认是 "false"
preload     |1. none<br/>2. metadata<br/>3. auto<br/>4. 空字符串|该枚举属性旨在告诉浏览器作者认为达到最佳的用户体验的方式是什么:<br/>1. 提示作者认为用户不需要查看该视频，服务器也想要最小化访问流量<br/>2. 提示尽管作者认为用户不需要查看该视频，不过抓取元数据（比如：长度）还是很合理的<br/>3. 用户需要这个视频优先加载；换句话说就是提示：如果需要的话，可以下载整个视频，即使用户并不一定会用它<br/>4. 也就代指 auto 值

## 画中画

画中画功能是chrome70+的新功能，视频窗口能够从浏览器独立出来播放视频，看起来像是一个本地应用。

Vido相关API             |使用           |描述
------------------------|--------------|-----------
requestPictureInPicture |pipWindow = **await** video.requestPictureInPicture()|请求让该 video 元素进入画中画模式，返回一个 promise，如果没有异常，这个 promise 包的值会是一个 PictureInPictureWindow对象
disablePictureInPicture |\<video src="..." disablePictureInPicture\>|该属性可以禁用 video 元素的画中画特性，右键菜单中的“画中画”选项会被禁用
enterpictureinpicture   |video.addEventListener('enterpictureinpicture', function(pipWindow) {<br/>  // 进入了画中画模式，可以拿到 pipWindow 对象<br/>})|进入画中画模式，可以拿到pipWindow对象
leavepictureinpicture   |video.addEventListener('leavepictureinpicture', function(pipWindow) {<br/>  // 进入了画中画模式<br/>})|退出画中画模式

document 相关API        |使用           |描述
------------------------|--------------|-----------
exitPictureInPicture    |document.exitPictureInPicture()|一个页面只能打开一个 PiP 窗口，所以让 video 元素退出画中画模式的方法不在 video 元素自己身上，而在 document 上
pictureInPictureElement |document.pictureInPictureElement|会返回当前页面中处于画中画模式的 video 元素，如果没有的话，返回 null
pictureInPictureEnabled |document.pictureInPictureEnabled|上面已经提到过了，在当前页面不支持或被禁用画中画模式的情况下会返回 false，否则返回 true

```HTML
    <button id="togglePipButton">画中画</button>
    <video id="video" controls src="https://storage.googleapis.com/media-session/caminandes/short.mp4" poster="https://storage.googleapis.com/media-session/caminandes/artwork-512.png"></video>
    <script type="text/javascript">
        let pipWindow;
        let togglePipButton = document.getElementById('togglePipButton');
        togglePipButton.addEventListener('click', async function(event) {
            console.log('Toggling Picture-in-Picture...');
            togglePipButton.disabled = true;
            try {

                if (video !== document.pictureInPictureElement)
                    await video.requestPictureInPicture();
                else
                    await document.exitPictureInPicture();

            } catch(error) {
                console.log(`> Argh! ${error}`);
            } finally {
                togglePipButton.disabled = false;
            }
        });

        // Note that this can happen if user clicked the "Toggle Picture-in-Picture"
        // button but also if user clicked some browser context menu or if
        // Picture-in-Picture was triggered automatically for instance.
        video.addEventListener('enterpictureinpicture', function(event) {
            console.log('> Video entered Picture-in-Picture');

            pipWindow = event.pictureInPictureWindow;
            console.log(`> Window size is ${pipWindow.width}x${pipWindow.height}`);

            pipWindow.addEventListener('resize', onPipWindowResize);
        });

        video.addEventListener('leavepictureinpicture', function(event) {
            console.log('> Video left Picture-in-Picture');

            pipWindow.removeEventListener('resize', onPipWindowResize);
        });

        function onPipWindowResize(event) {
            console.log(`> Window size changed to ${pipWindow.width}x${pipWindow.height}`);
        }

        /* Feature support */

        if ('pictureInPictureEnabled' in document) {
            // Set button ability depending on whether Picture-in-Picture can be used.
            setPipButton();
            video.addEventListener('loadedmetadata', setPipButton);
            video.addEventListener('emptied', setPipButton);
        } else {
            // Hide button if Picture-in-Picture is not supported.
            togglePipButton.hidden = true;
        }

        function setPipButton() {
            togglePipButton.disabled = (video.readyState === 0) ||
                                        !document.pictureInPictureEnabled ||
                                        video.disablePictureInPicture;
        }

    </script>
```

## 第三方插件

### video.js

video.js是一款基于HTML5的网络视频播放器。它支持HTML5和Flash视频，以及YouTube和Vimeo（通过插件）

**快速开始**:

```HTML
    <link href="video-js.min.css" rel="stylesheet">
    <script>window.HELP_IMPROVE_VIDEOJS = false;</script>
    <script src="video.min.js"></script>
    ...
    ...
    <video
        id="my-player"
        class="video-js"
        controls
        preload="auto"
        poster="//vjs.zencdn.net/v/oceans.png"
        data-setup='{}'>
    <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source>
    <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>
    <source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source>
    <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a href="http://videojs.com/html5-video-support/" target="_blank">
        supports HTML5 video
        </a>
    </p>
    </video>
```

**播放控制**:

项目            |操作
----------------|--------------------
播放按钮居中    |\<video class="video-js vjs-big-play-centered"\>
禁止在iPhone safari中自动全屏|\<video playsinline \>\</video\>
暂停时显示播放按钮|.vjs-paused .vjs-big-play-button,<br/>.vjs-paused.vjs-has-started .vjs-big-play-button {<br/>    display: block;<br/>}
点击屏幕播放/暂停|.video-js.vjs-playing .vjs-tech {<br/>    pointer-events: auto;<br/>}
重载视频文件    |video.pause();<br/>source.setAttribute('src', '*.mp4');<br/>video.load();<br/>video.play();
进度显示当前播放时间|.video-js .vjs-time-control{display:block;}<br/>.video-js .vjs-remaining-time{display: none;}
全屏时隐藏控制栏    |.vjs-fullscreen.vjs-user-inactive {<br/>cursor: none;<br/>}

### Flash
