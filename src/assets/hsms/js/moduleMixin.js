/**
 * 本模块内公用mixin
 */
export default {
  directives: {
    /**
     * 验证权限指令
     * v-checkAuth="'permissions,xxx,xxx'"
     */
    'checkAuth': {
      has: false,
      bind (el, binding) {
      },
      update (el, binding) {
        const permissions = localStorage.getItem('authorityMethods') || ''
        const auths = binding.value ? binding.value.split(',') : []
        let isOk = true
        if (permissions) {
          auths.forEach(auth => {
            if (permissions.indexOf(`"authorityCode":"${auth}",`) === -1) {
              isOk = false
            }
          })
        } else {
          isOk = false
        }

        if (!isOk) {
          el.remove()
        }
      }
    }
  }
}
