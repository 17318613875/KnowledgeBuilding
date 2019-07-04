
/**
 * 姓名检验 由2-10位汉字组成
 */
export function userName() {
    const reg = /^[\u4e00-\u9fa5]{2, 10}/;
    return [reg.test(str), '姓名检验 由2-10位汉字组成'];
}
