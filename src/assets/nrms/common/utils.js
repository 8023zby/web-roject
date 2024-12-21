/**
 * @param target
 * @param source
 * @returns 合并对象属性，将source合并给target，若source为数组，则返回source的数组新副本
 */
export function deepMerge (target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice() // slice产生数组新副本
  }
  if (source === null || source === undefined) {
    return source
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = deepMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}
