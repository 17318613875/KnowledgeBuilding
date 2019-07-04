
/**
 * Currying 柯里化封装函数
 */
import * as Currying from './currying'
export const currying = Currying;

/**
 * Validates 数值验证 柯里化
 * @param {String} key 验证名称
 * @param {String} msg 提示信息
 * @see
 */
import * as Validates from './validates'
export const validateCurrying = (key, msg) => {
    return (rule, value, cb) => {
        let result_ = Validates[key](value);
        if (result_[0]) {
            cb()
        } else {
            cb(new Error(msg || result_[1]))
        }
    }
}