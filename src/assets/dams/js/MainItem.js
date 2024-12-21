export default {
  data () {
    return {
      optionType: 'Tab',
      params: {},
      tab: {
        activeName: 'frequency'
      }
    }
  },
  methods: {
    // 页面跳转
    optionChangeHandler (optionType = 'Tab', params = {}, tab = {}) {
      this.optionType = optionType
      this.params = params
      this.tab = tab
    }
  }
}
