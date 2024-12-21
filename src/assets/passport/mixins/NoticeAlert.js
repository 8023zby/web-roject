export default {
  data () {
    return {
      chromeAlert: false
    }
  },
  methods: {
    // 检测是否是谷歌浏览器
    checkBrowser () {
      let userAgent = navigator.userAgent
      if (userAgent.indexOf('Chrome') === -1) {
        this.chromeAlert = true
        localStorage.setItem('alertStatus', '1')
      }
    }
  }
}
