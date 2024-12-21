<!--
 * @Author: 翟冲
 * @Owner:
 * @Date: 2021-06-16 09:15:52
 * @LastEditTime: 2023-03-09 13:59:29
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \yarward-wnms-frontEnd\src\components\wnms\Message\A10Common.vue
-->
<template>
  <div></div>
</template>
<script>
import {
  selectDeptInfo,
  getUser,
  getDeptInfo
} from "@/assets/wnms/utils/common";
import Bus from "@/assets/wnms/utils/self";
import mixin from "../../../views/wnms/msgManage/patientMsg/mixin";
// import socketApi from "../../../assets/wnms/utils/webSocket";
import WebSocketService from "../../../assets/wnms/utils/WebSocketService";
import * as api from "@/api/wnms/msgManage/patientMsg";
export default {
  name: "A10",

  data() {
    let userid = getUser(); // 获取当前用户
    let deptid = getDeptInfo().deptId; // 获取所属护理单元
    return {
      i: 10,
      userid: userid,
      deptid: deptid,
      //  wsUrl: " ws://172.16.10.140:8088/ws",//定义socket连接地址
      wsType: "CONNECT"
    };
  },
  mixins: [mixin],
  created() {
    // let sever = 'msbm.yarward.com:8304'//'msbm.yarward.com'
    let sever = document.location.host + "/msbmWs";
    const wsUrl = `ws://${sever}/websocket/${this.userid}/${this.deptid}`;
    WebSocketService.create(wsUrl, this.getConfigResult).init();
  },
  mounted() {
    // 监控web消息
    Bus.$on("updateMsage", (res) => {
      this.getSoket(res);
    });
  },

  methods: {
    // 接收socket回调函数返回数据的方法
    getConfigResult(res) {
      console.log("接收socket回调函数返回数据的方法", res);
      // 退出登录时断开websocket
      let token = localStorage.getItem("token");
      if (!token) {
        WebSocketService.dispose()
        return;
      }
      if (res.status === 200) {
        this.getNumBer(this.userid, 1);
        if (res.message !== "连接成功") {
          try {
            let message = JSON.parse(res.message);
            let content = message.data[0].content.content;
            if (content.indexOf("留言") > -1) {
              api
                .getDeptInfo(message.data[0].resourceInfo[0].deptId)
                .then((res) => {
                  if (res.status === 200) {
                    this.getLeaveMsgContent(res.data.deptName + content);
                  } else {
                    this.getLeaveMsgContent(content);
                  }
                })
                .catch(() => {
                  this.getLeaveMsgContent(content);
                });
            }
          } catch (e) {
            console.log("error", e);
          }
        }
        // 节后到消息后
      } else if (res.status === 200 && res.message === "连接成功") {
        // 连接成功后请求数据
        this.getNumBer(this.userid, 3);
      }
    },
    getSoket(res) {
      this.$emit("resetMessage", res);
    }
    // websocketSend(data) {
    //   socketApi.sendSock(data, this.getConfigResult);
    // }
  }
};
</script>
