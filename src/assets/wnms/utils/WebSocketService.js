class WebSocketService {
  constructor() {
    this.webSocket = null;
    this.timeout = 10000;// 每次心跳
    this.timeoutObj = null; //心跳倒计时
    this.serverTimeoutObj = null; // 心跳倒计时
    this.timeoutnum = null; //断开重连倒计时
    this.lockReconnect = false; //是否真正建立连接
  }
  static instance () {
    if (!WebSocketService.singleton) WebSocketService.singleton = new WebSocketService();
    return WebSocketService.singleton;
  }
  create (url, fn) {
    this.url = url;
    this.callback = fn;
    return this;
  }
  init () {
    if ("WebSocket" in window) {
      this.webSocket = new WebSocket(this.url);//创建socket对象
      console.log("我创建完成webSocket连接=======", this.webSocket);
    } else {
      alert("该浏览器不支持websocket!");
    }
    //打开
    this.webSocket.onopen = () => {
      this.webSocketOpen();
    };
    //收信
    this.webSocket.onmessage = (e) => {
      this.webSocketOnMessage(e);
    };
    //关闭
    this.webSocket.onclose = (data) => {
      this.webSocketClose(data);
    };
    //连接发生错误的回调方法
    this.webSocket.onerror = () => {
      this.webSocketOnerror();
    };
  }
  webSocketOpen () {
    this.restTimeout();
    this.timeoutObj = setTimeout(() => {
      if (this.webSocket.readyState === 1) {
        this.webSocketSend('heartbeat');
      } else {
        // 否则重新连接
        this.reconnect();
      }
      //超时关闭
      // this.serverTimeoutObj = setTimeout(() => {
      //   this.dispose();
      // }, this.timeout);
    }, this.timeout);
  }

  webSocketOnMessage (e) {
    let code = this.getLandingEndCode();
    if (code != 'WEB') {
      this.dispose();
      return;
    }
    switch (e.data) {
      case 'heartbeat':
        console.log("收到服务器信息，心跳重置");
        this.reset();
        break;
      default:
        this.webSocketSendMessage(e.data);
        break;
    }
  }
  webSocketSendMessage (data) {
    this.callback(JSON.parse(data));
  }
  webSocketClose (data) {
    console.log("WebSocket连接关闭   " + "状态码" + this.webSocket.readyState);
    this.reconnect();
  }
  webSocketOnerror () {
    this.reconnect();
    console.log("WebSocket连接发生错误 " + "状态码" + this.webSocket.readyState);
  }
  // 发送数据
  webSocketSend (msg) {
    console.log("开始发送", msg);
    this.webSocket.send(msg);
  }
  restTimeout () {
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
  }
  //重置心跳
  reset () {
    this.restTimeout();
    this.webSocketOpen();
  }
  //重新连接
  reconnect () {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    this.timeoutnum && clearTimeout(this.timeoutnum);
    this.timeoutnum = setTimeout(() => {
      this.init();
      this.lockReconnect = false;
    }, 5000);
  }
  dispose () {
    this.restTimeout();
    //手动关闭
    this.webSocket.onclose = null;
    this.webSocket.close();
  }
  // 获取登录应用标识
  getLandingEndCode () {
    let codeStr = localStorage.getItem("selectLandingEndInfo");
    if (codeStr !== "" && codeStr !== null) {
      let tempInfo = JSON.parse(codeStr);
      return tempInfo.landingEndCode;
    }
  }
}

export default WebSocketService.instance();