# 函数应用

## 函数柯里化

问：假如一个函数只能收一个参数，那么这个函数怎么实现加法呢？
答：写一个只有一个参数的函数，而这个函数返回一个带参数的函数，这样就实现了能写两个参数的函数了。只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数

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

## 偏函数

