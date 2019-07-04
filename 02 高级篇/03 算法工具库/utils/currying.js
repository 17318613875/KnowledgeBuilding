/**
 * 柯里化
 * @param {Function} fn 需要柯里化的函数
 * @returns {Function} fn(arg1)(arg2)(...arg)()
 */
export function oneByOne(fn, ...arg) {
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