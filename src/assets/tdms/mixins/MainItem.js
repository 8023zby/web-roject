/**
 * 通用的入口文件
 */
export default {
  data () {
    return {
      optionType: 'list',
      isRouterAlive: true,
      params: {
        deviceType: ''
      },
      modifyData: {},
      includeList: ''
    }
  },
  created () {
    let deviceType = this.$route.params.deviceType || ''
    this.params.deviceType = deviceType
  },
  methods: {
    // 页面跳转
    optionChangeHandler (optionType = 'list', params = {}, modifyData = {}) {
      this.modifyData = modifyData
      this.optionType = optionType
      this.params = params
      if (params && params.fromAdd) {
        this.includeList = ''
      } else {
        this.includeList = 'list'
      }
    },
    // 页面刷新
    mainReload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
