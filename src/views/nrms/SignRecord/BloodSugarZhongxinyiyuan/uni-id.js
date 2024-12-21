const setId = (el, binding, vnode) => {
  console.log(el, binding, vnode)
  const objectId = binding.arg
  const content = binding.value
  const dataUniStr = objectId ? `${content}-${objectId}` : content
  el.setAttribute('data-uni', dataUniStr)
  const tag = vnode.componentOptions ? vnode.componentOptions.tag.replace(/[-]/g, '') : vnode.tag
  let key = ''
  if (!String.isNullOrEmpty(`${vnode.key}`)) {
    const arr = `${vnode.key}`.split('-')
    key = arr[arr.length - 1]
  }
  const id = key ? `${tag}_${content}-${key}` : `${tag}_${content}`
  el.id = id
}

if (!String.isNullOrEmpty) {
  String.isNullOrEmpty = function (v) {
    if (v === undefined || v === null || v === 'undefined') return true
    return (typeof (v) === 'string' && v.length === 0)
  }
}

export default {
  bind: function (el, binding, vnode) {
    setId(el, binding, vnode)
  },
  update (el, binding, vnode) {
    if (binding.oldValue !== binding.value) {
      setId(el, binding, vnode)
    }
  }
}
