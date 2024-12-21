/**
 * 通用的入口文件
 */
export default {
  data () {
    return {
      optionType: 'list',
      isRouterAlive: true,
      params: {
        businessType: 'NURSE'
      },
      modifyData: {}
    }
  },
  created () {
    let businessType = this.$route.params.businessType || 'NURSE'
    this.params.businessType = businessType
  },
  methods: {
    // 页面跳转
    optionChangeHandler (optionType = 'list', params = { businessType: 'NURSE' }, modifyData = {}) {
      this.modifyData = modifyData
      this.optionType = optionType
      this.params = params
    },
    // 页面刷新
    mainReload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    mainClose () {
      // this.isRouterAlive = false;
      // console.log('mainClose');
      this.$emit('co-close');
    }
  }
}
