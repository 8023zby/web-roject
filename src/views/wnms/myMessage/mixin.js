import * as api from "@/api/wnms/msgManage/patientMsg";
import Bus from "@/assets/wnms/utils/self";
// 防抖函数
const debounce = (fun, delay) => {
  let Timer = null;
  return args => {
    let _args = args;
    if (Timer) {
      clearTimeout(Timer);
    }
    Timer = setTimeout(() => {
      fun.call(this, _args);
    }, delay);
  };
};
export default {
  data () {
    return {
      messageInstance: null, // 消息实例
      messageContentList: [], // 消息列表
      messageDebounce: null
    };
  },
  mounted () {
    this.messageDebounce = debounce(this.messageShow, 3000);
  },
  methods: {
    getNumBer (userid, number) {
      let deptId = localStorage.getItem('selectDeptId');
      api
        .getWebCount({
          referenceId: userid,
          deptId: deptId
        })
        .then(res => {
          console.log(res, '===后台查询出的值2');
          debugger;
          let obj = {};
          let noticeMsgCount = 0;
          let patientMsgCount = 0;
          for (let d of res.data) {
            let { onlyFlag, counts } = d;
            obj[onlyFlag] = counts >= 99 ? '99+' : counts;
          }

          // 判断类型 求和
          const objNum = Object.values(obj).map(value => {
            return typeof value === 'number' ? value : parseInt(value);
          });

          const count = objNum.reduce((tole, value) => {
            return tole + value;
          });

          console.log('count===>' + count);

          // 总数
          obj['wnms'] = count >= 99 ? '99+' : count;
          // 医护公告
          obj['myCareNoticeMsg'] = obj['MANUAL-NOTICE'] >= 99 ? '99+' : obj['MANUAL-NOTICE'];
          // 患者留言板
          obj['patientMsg14'] = obj['14'] >= 99 ? '99+' : obj['14'];
          // 系统消息
          let systemMsgCount = 0;
          let systemMsgFlg = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
          for (let d in res.data) {
            if (systemMsgFlg.indexOf(parseInt(res.data[d].onlyFlag)) >= 0 && res.data[d].counts > 0) {
              console.log(res.data[d].counts);
              systemMsgCount += res.data[d].counts;
            }
          }

          obj['mySystemMsg'] = systemMsgCount >= 99 ? '99+' : systemMsgCount;
          console.log('获得结果显示中台中====' + JSON.stringify(obj));
          // 获取socket连接
          // 参数： 1用户id, 2科室id / user / 1
          // 显示到中台中
          // number 1 更新数据 2 点击未读后重新查询，3连接成功

          Bus.$emit('updateMsage', obj);

          // 如果是打开了当前页面则发送消息更新列表
          if (number !== 2) {
            if (this.$route.name === 'patientMsg') {
              Bus.$emit('webmsg');
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    messageShow () {
      const h = this.$createElement;
      if (this.messageInstance) {
        this.messageInstance.close();
      }
      if (!this.messageContentList && !this.messageDebounce.length) {
        return;
      }
      let msgContent = "";
      if (this.messageContentList.length > 1) {
        msgContent = "收到多条留言信息，请在留言板中查看";
      } else {
        msgContent = this.messageContentList[0];
      }
      // 留言消息时弹窗提示
      this.messageInstance = this.$message({
        message: h(
          "p",
          {
            on: {
              click: this.clickLeaveMsg
            },
            style:
              "cursor:pointer;min-width:600px;font-size:15px;padding-right:30px"
          },
          `${msgContent}`
        ),
        showClose: true,
        type: ""
      });
      this.messageContentList = [];
    },
    getLeaveMsgContent (content) {
      this.messageContentList.push(content);
      this.messageDebounce();
    },
    clickLeaveMsg () {
      console.log("留言消息点击事件");
    }
  }
};
