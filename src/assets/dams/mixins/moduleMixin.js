/**
 * 本模块内公用mixin
 */
export default {
  methods: {
    /**
     * 权限验证方法
     * @param auths permissions,xxx,xxx
     * @returns {boolean}
     */
    checkAuth (auths, el) {
      if (!auths) {
        console.error('checkAuth 缺少入参！')
        return false
      }
      let _auths = auths ? auths.split(',') : []
      let isOk = false
      const permissions = localStorage.getItem('authorityMethods') || ''
      if (permissions) {
        _auths.forEach(auth => {
          if (permissions.indexOf(`"authorityCode":"${auth.trim()}",`) !== -1) {
            isOk = true
          } else {
            el && console.warn(`AuthKey值: ${auth}, 按钮: [${el.innerText}]没有权限！`)
          }
        })
      }
      return isOk
    }
  },
  directives: {
    /**
     * 验证权限指令
     * v-checkAuth="'permissions,xxx,xxx'"
     */
    'checkAuth': {
      bind (el, binding) {
      },
      inserted (el, binding) {
        const permissions = localStorage.getItem('authorityMethods') || ''
        const auths = binding.value ? binding.value.split(',') : []
        const log = binding.modifiers.log || false
        let isOk = false

        if (permissions) {
          auths.forEach(auth => {
            if (permissions.indexOf(`"authorityCode":"${auth.trim()}",`) !== -1) {
              isOk = true
            } else {
              console.warn(`AuthKey值: ${auth}, 按钮: [${el.innerText}]没有权限！`)
            }
          })
        }

        // 开启log
        if (log) {
          console.log('/----------------------------/')
          console.log(auths)
          console.log(el)
          console.log(el.innerText)
          console.log('/----------------------------/')
        }

        if (!isOk) {
          el.remove()
        }
      }
    }
  }
}
