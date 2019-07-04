# 函数应用

## 函数柯里化

柯里化是固定部分参数，返回一个接受剩余参数的函数，也称为部分计算函数，目的是为了缩小适用范围，创建一个针对性更强的函数。核心思想是把多参数传入的函数拆成单参数（或部分）函数，内部再返回调用下一个单参数（或部分）函数，依次处理剩余的参数。

```javascript
    const curry = (fn, ...arg)=> {
        let all = arg || [];
        let length = fn.length;
        return (...rest) => {
            let _args = all.slice(0);
            _args.push(...rest);
            if (_args.length === 0) {
                return curry.call(this, fn, ..._args);
            } else {
                return fn.apply(this, _args);
            }
        }
    }
```

## 反柯里化

从字面讲，意义和用法跟函数柯里化相比正好相反，扩大适用范围，创建一个应用范围更广的函数。使本来只有特定对象才适用的方法，扩展到更多的对象。

```javascript
    // ES5 方式
    Function.prototype.unCurrying = function() {
        var self = this
        return function() {
            var rest = Array.prototype.slice.call(arguments)
            return Function.prototype.call.apply(self, rest)
        }
    }

    // ES6 方式
    Function.prototype.unCurrying = function() {
        const self = this
        return function(...rest) {
            return Function.prototype.call.apply(self, rest)
        }
    }
```

## 偏函数

是创建一个调用另外一个部分（参数或变量已预制的函数）的函数，函数可以根据传入的参数来生成一个真正执行的函数。其本身不包括我们真正需要的逻辑代码，只是根据传入的参数返回其他的函数，返回的函数中才有真正的处理逻辑比如：

```javascript
    var isType = function(type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) === `[object ${type}]`
        }
    }

    var isString = isType('String')
    var isFunction = isType('Function')
```

## 偏函数Def柯里化

区别:

1. **柯里化**是把一个接受 n 个参数的函数，由原本的一次性传递所有参数并执行变成了可以分多次接受参数再执行，例如："add = (x, y, z) => x + y + z" => "curryAdd = x => y => z => x + y + z";
2. **偏函数**固定了函数的某个部分，通过传入的参数或者方法返回一个新的函数来接受剩余的参数，数量可能是一个也可能是多个；
