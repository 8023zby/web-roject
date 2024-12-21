/**
 * webSocket
 */

export default {
  data () {
    return {
      ws: null, // websocket连接
      noticeVis: false,
      noticeData: '',
      webSocketParams: {},
      menuNum: {}
    }
  },
  methods: {
    // 关闭弹窗
    closeWin (fun) {
      this.noticeVis = false
      fun && fun.call()
    },
    // 养老开启websocket
    openWebsocket (fun) {
      this.$refs.pimsMes.webSocketInit()
      fun && fun.call()
    },
    // 养老关闭websocket
    closeWebsocket (fun) {
      this.$refs.pimsMes.closeSocket()
      fun && fun.call()
    },
    // 养老新的消息提醒
    initPimsMessage (data) {
      this.webSocketParams.router = data.router
      this.noticeData = data.data
      if (this.noticeData !== '') {
        this.noticeVis = true
      }
    },
    // 外部调用
    showNotice (params) {
      this.webSocketParams = params
      this.webSocketInit(params)
    },
    // 关闭提醒
    closeNotice () {
      // 养老消息弹窗关闭
      this.noticeVis = false
      // 关闭声音提示
      if (this.$refs.pimsMes.closeSpeak) {
        this.$refs.pimsMes.closeSpeak()
      }
    },
    // A10消息提醒更新数字
    initMessageNum (data) {
      this.menuNum = data
      this.thatObj = this.$refs.passportMain
    },
    // 消息提醒赋值
    initNotice (data) {
      if (this.webSocketParams.fun) {
        this.noticeData = this.webSocketParams.fun.call(null, data)
      } else {
        this.noticeData = data
      }
      if (this.noticeData !== '') {
        this.noticeVis = true
      }
    },
    // 消息立即查看
    detailNotice () {
      // 关闭声音提示
      if (this.$refs.pimsMes.closeSpeak) {
        this.$refs.pimsMes.closeSpeak()
      }
      this.noticeVis = false
      this.routerToFirst(this.webSocketParams.router)
    },
    // 关闭socket
    closeSocket (params = {}) {
      if (this.ws != null) {
        this.ws.close()
      }
      if (params.fun) {
        params.fun.call()
      }
    },
    webSocketInit (params) {
      let that = this
      // 创建一个WebSocket连接
      if ('WebSocket' in window) {
        this.ws = new WebSocket(params.url)
      } else {
        console.log('WebSocket__当前浏览器不支持WebSocket')
      }

      // 连接发生错误的回调方法
      this.ws.onerror = function () {
        console.log('WebSocket__onerror')
      }

      // 连接成功建立的回调方法
      this.ws.onopen = function () {
        console.log('已经建立连接')
      }

      // 接收到消息的回调方法，此处添加处理接收消息方法，当前是将接收到的信息显示在网页上
      this.ws.onmessage = function (event) {
        console.log(event.data)
        that.initNotice(event.data)
      }

      // 连接关闭的回调方法
      this.ws.onclose = function () {
        console.log('WebSocket__onclose')
        if (this.ws != null) {
          this.ws.close()
          console.info('close socket end!')
        }
      }
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function () {
        this.ws.close()
      }
    }
  }
}
