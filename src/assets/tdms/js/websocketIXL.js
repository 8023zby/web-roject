let WWebSocket = {

  conn (params, mWebSocket, self) {
    // 创建一个WebSocket连接
    if ('WebSocket' in window) {
      let token = localStorage.getItem('token')
      mWebSocket = new WebSocket(`${params.linkUrl}/${token}`)
    } else {
      console.log('WebSocket__当前浏览器不支持WebSocket')
    }

    // 连接发生错误的回调方法
    mWebSocket.onerror = function () {
      console.log('WebSocket__onerror')
    }

    // 连接成功建立的回调方法
    mWebSocket.onopen = function () {
      console.log('WebSocket__onopen_Send1_' + params.deviceId)
      let data = {}
      if (params.reqType === 1) {
        data = {
          type: 'Device_Monitor_Request',
          deviceId: params.deviceId,
          orgId: params.orgId,
          orgCode: params.orgCode,
          deviceType: params.deviceType
        }
      } else if (params.reqType === 2) {
        data = {
          type: 'Device_Log_Request',
          deviceId: params.deviceId,
          startTime: params.startTime,
          endTime: params.endTime,
          logType: params.logType,
          orgId: params.orgId,
          orgCode: params.orgCode,
          deviceType: params.deviceType
        }
      } else if (params.reqType === 3) {
        data = {
          type: 'Device_Reboot',
          deviceId: params.deviceId,
          rebootType: params.rebootType,
          orgId: params.orgId,
          time: params.time,
          deviceType: params.deviceType
        }
      }
      mWebSocket.send(JSON.stringify(data))
      console.log('WebSocket__onopen_Send2_' + params.deviceId)
    }

    // 接收到消息的回调方法，此处添加处理接收消息方法，当前是将接收到的信息显示在网页上
    mWebSocket.onmessage = function (event) {
      console.log('WebSocket__onmessage')
      console.log(event.data)

      if (event.data == null || event.data === undefined) {
        if (mWebSocket != null) {
          mWebSocket.close()
          console.info('close socket end!')
        }
        return false
      }

      // 终端监控
      if (params.reqType === 1) {
        let dataInfo = JSON.parse(event.data)
        self.terminal.dataInfo = dataInfo
        self.terminal.visible = true
        self.watchLoading = false
        if (mWebSocket != null) {
          mWebSocket.close()
          console.info('close socket end!')
        }
      } else if (params.reqType === 2) {
        console.log('日志下载')
        console.log(event.data)

        let dataInfo = JSON.parse(event.data)
        let downLoadUrl = dataInfo.logFileUrl

        window.open(downLoadUrl)
        self.logParam.logFormVisible = false
        if (mWebSocket != null) {
          mWebSocket.close()
          console.info('close socket end!')
        }
      } else if (params.reqType === 3) {
        console.log('终端重启')
        console.log(event.data)
        self.rebootDevice.visible = false

        if (mWebSocket != null) {
          mWebSocket.close()
          console.info('close socket end!')
        }
      }
    }

    // 连接关闭的回调方法
    mWebSocket.onclose = function () {
      console.log('WebSocket__onclose')
      if (mWebSocket != null) {
        mWebSocket.close()
        console.info('close socket end!')
      }
    }
  }
}

export default WWebSocket
