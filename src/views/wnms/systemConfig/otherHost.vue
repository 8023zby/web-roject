<template>
  <el-container style="height: 100%" v-loading="yh_loading">
    <el-main>
      <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" :anchorList="[]" :disabled="deptDisabled" :loadData="true"></deptInsideMenu>
      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
        <el-form-item label="呼叫超时时长" prop="callTimeoutDurationMainHost">
          <el-input style="width: 130px;" v-model="configContent.callTimeoutDurationMainHost" type="number" placeholder="请输入内容"></el-input>秒
        </el-form-item>

        <el-form-item label="宕机呼叫主机">
          <el-select v-model="configContent.offlineIp" placeholder="请选择" @change="onOfflineIpChange">
            <el-option v-for="item in medicalMainframeList" :key="item.deviceId" :label="item.deviceName+'（'+item.deviceModel+'）'" :value="item.ip"></el-option>
          </el-select>
        </el-form-item>

        <!-- 人脸识别注册 -->
        <el-form-item label="人脸识别注册">
          <el-form-item label-width="60px" label="key">
            <el-input type="text" v-model="configContent.faceKey" style="width: 400px" />
          </el-form-item>
          <el-form-item label-width="60px" label="session">
            <el-input type="text" v-model="configContent.faceSession" style="width: 400px" />
          </el-form-item>
        </el-form-item>

        <el-form-item label="呼叫信息转发">
          <span style="margin-right: 10px">
            主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：
            <el-select v-model="configContent.msgForwardDeviceId" placeholder="请选择" @change="onMsgForwardChange">
              <el-option v-for="item in medicalMainframeList" :key="item.deviceId" :label="item.deviceName+'（'+item.deviceModel+'）'" :value="item.deviceId"></el-option>
            </el-select>
          </span>
          <div style="padding: 10px 0">
            <span>接口地址：</span>
            <el-input type="text" v-model="configContent.msgForwardApi" style="width: 500px" />
            <span style="color:red">
              配置时须替换IP地址与端口号，若转发给第三方看板，须完整填写第三方的接口地址
            </span>
          </div>
        </el-form-item>
        <!-- 主机呼叫患者 -->
        <el-form-item label="终端呼叫患者" prop="name">
          <el-radio v-model="configContent.callPatientMainHost" label="1">呼叫床头分机</el-radio>
          <el-radio v-model="configContent.callPatientMainHost" label="0">呼叫床旁分机</el-radio>
        </el-form-item>
        <el-form-item label="呼叫转移">
          <el-switch v-model="configContent.callForwarding" :active-color="switchActiveColor" />
        </el-form-item>
        <!-- 通用版现在只有简版医嘱，去掉此配置开关 20220425 yxb -->
        <!-- <el-form-item label="启用简版医嘱">
          <el-switch v-model="configContent.SimMedAdvice" :active-color="switchActiveColor" />
          <span style="color:red;">控制床旁近日安排与床头护理任务的数据来源</span>
        </el-form-item> -->

        <!-- 房间后缀显示 -->
        <el-form-item label="房间后缀显示">
          <el-input v-model.trim="configContent.suffixCog" maxlength="5" type="text" style="width: 30%; margin-right: 1rem" />
        </el-form-item>

        <el-form-item label="门口分机清除呼叫">
          <el-switch v-model="configContent.callClear" :active-color="switchActiveColor" />
        </el-form-item>
        <el-form-item label="远程开门后挂断门禁呼叫" label-width="200px">
          <el-switch v-model="configContent.hangUpCall" :active-color="switchActiveColor" />
        </el-form-item>
        <div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="院内地图图片" prop="content">
                <div class="imageDiv">
                  <v-upload-image :imageObj="imageObj.horizontal" ref="imghz"></v-upload-image>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="" prop="content" class="imgvc">
                <div class="imageDiv">
                  <v-upload-image :imageObj="imageObj.vertical" ref="imgvc"></v-upload-image>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item label="保存录音录像文件" v-if="false">
          <el-switch v-model="configContent.saveAudioAndVideoFiles" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item label="问卷二维码地址前缀">
          <el-input type="text" v-model="configContent.questionQrcodeHost" style="width: 400px" />
        </el-form-item>
        <el-form-item label="支付模式">
          <el-radio-group v-model="configContent.paymentMode">
            <el-radio label="NotDockedMode">未对接模式</el-radio>
            <el-radio label="ZBZXYYMode">淄博市中心医院模式</el-radio>
            <el-radio label="CDJDFYYMode">成都京东方医院模式</el-radio>
            <el-radio label="SHPDXQYYMode">上海市浦东新区公利医院</el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="el-form-item-left">
          <el-form-item label="录音录像">
            <el-switch v-model="configContent.isAudioAndVideoRecordingsOther" :active-color="switchActiveColor" @change="onAudioChange" />
          </el-form-item>
          <el-form-item label prop="audioAndVideoRecordingsOtherPath" :rules="[
              {
                required: configContent.isAudioAndVideoRecordingsOther,
                message: '不能为空',
                trigger: 'blur',
              },
            ]">
            <span>路径地址：</span>
            <el-input type="text" v-model="configContent.audioAndVideoRecordingsOtherPath" :disabled="!configContent.isAudioAndVideoRecordingsOther" style="width: 500px" />
          </el-form-item>
          <el-form-item label="音视频通话方案" prop="audioAndVideoCallSolution">
            <el-radio-group v-model="audioAndVideoCallSolution" @change="onAudioAndVideoCallSolutionChange">
              <el-radio :label="'videoPaas'">音视频平台方案</el-radio>
              <el-radio :label="'sip'">SIP通话方案</el-radio>
            </el-radio-group>
            <span style="color:red;margin-left:20px">
              仅科室中有i系列分机时选择SIP通话方案
            </span>
          </el-form-item>
          <el-form-item label="高级中断低级开关" prop="nurseLevelInterrupt">
            <el-switch v-model="configContent.nurseLevelInterrupt" :active-color="switchActiveColor" active-value="1" inactive-value="0" />
          </el-form-item>
        </div>
        <!--终端广播时显示悬浮窗-->
        <!-- https://project.feishu.cn/inpatient_ward_test/bfcsbug/detail/4686196 测试题bug去除 -->
        <!-- <el-form-item label="终端广播时显示悬浮窗" prop="name">
          <el-switch v-model="configContent.broadCastShowFloat" :active-color="switchActiveColor" />
        </el-form-item> -->
        <!-- 物联网体征采集是否需要身份确认 -->
        <el-form-item label="物联网体征身份确认" prop="name">
          <el-switch v-model="configContent.IDconfirmationIoTPhysical" :active-color="switchActiveColor" />
        </el-form-item>

        <!-- 未处理呼叫提醒 -->
        <el-form-item label="未处理呼叫提醒" prop="name">
          <el-radio v-model="configContent.unCallReminderMainHost" label="1">持续提示</el-radio>
          <el-radio v-model="configContent.unCallReminderMainHost" label="0">间隔提示</el-radio>
        </el-form-item>

        <!-- 值班室可接收门禁呼叫 -->
        <el-form-item label="多终端接受门禁请求">
          <el-checkbox-group v-model="configContent.mulAcceptRequestsDevices" style="display: inline-block;">
            <el-checkbox label="wnDutyMainframe">值班室分机</el-checkbox>
            <el-checkbox label="wnMedicalAudioAssistant">w101</el-checkbox>
          </el-checkbox-group>
          <span style="color:#888;margin-left:10px">选择后，医护主机、值班室分机、w101分机以双向视频的形式处理门禁请求</span>
        </el-form-item>

        <el-form-item label="开启时间" v-if="configContent.mulAcceptRequestsDevices && configContent.mulAcceptRequestsDevices.length !== 0">
          <el-button round type="primary" size="mini" @click="onAddFirstunlockDutyRoomOpenTime" v-if="configContent.mulAcceptRequestsDevices && configContent.unlockDutyRoomOpenTime.length === 0">添加</el-button>
          <section v-else>
            <div v-for="(businessHour, hourIndex) in configContent.unlockDutyRoomOpenTime" :key="hourIndex">
              <div style="white-space: nowrap;padding-bottom: 15px;">
                {{`时间${(hourIndex + 1)}：`}}
                <el-time-picker v-model="configContent.unlockDutyRoomOpenTime[hourIndex]['start']" value-format="HH:mm:ss" placeholder="开始时间">
                </el-time-picker>
                至
                <el-time-picker v-model="configContent.unlockDutyRoomOpenTime[hourIndex]['end']" value-format="HH:mm:ss" placeholder="结束时间">
                </el-time-picker>
                <div class="item-title" style="display: inline-block;margin: 0 5px;" @click="addunlockDutyRoomOpenTime">
                  <i class="el-icon-circle-plus-outline" style="cursor: pointer" />
                </div>
                <div v-if="hourIndex!==0" class="item-title" style="display: inline-block;margin: 0 5px;" @click="removeUnlockDutyRoomOpenTime(hourIndex)">
                  <i class="el-icon-remove-outline" style="cursor: pointer" />
                </div>
              </div>
            </div>
          </section>
        </el-form-item>

        <!-- 未处理呼叫提醒 -->
        <el-form-item label="呼叫振铃方式" prop="name">
          <el-radio v-model="configContent.callBellingMethod" :label="0">共振</el-radio>
          <el-radio v-model="configContent.callBellingMethod" :label="1">顺振</el-radio>
        </el-form-item>

        <el-row class="top-24 save-view" style="text-align: center">
          <el-button v-if="false" @click="goParent">取消</el-button>
          <el-button type="primary" @click.prevent.stop="saveConfig(deviceConfigName)">保存</el-button>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import "./systemConfig.css";
import configMixin from "./mixin";
import * as API from "@/api/wnms/msgManage/systemConfig";
import vUploadImage from "@/components/wnms/Upload/UploadImage.vue";
import deptInsideMenu from "@/components/wnms/deptInsideMenu/deptInsideMenu";

export default {
  name: "other",
  mixins: [configMixin],
  components: { deptInsideMenu, vUploadImage },
  data() {
    return {
      imageObj: {
        horizontal: {
          imglable: "横屏",
          picRoute: "6",
          avatar: "avatar",
          imgType: "oldman",
          imageUrl: ""
        },
        vertical: {
          imglable: "竖屏",
          picRoute: "6",
          avatar: "avatar",
          imgType: "oldman",
          imageUrl: ""
        }
      },
      // 配置页面名称
      deviceConfigName: "other",
      configContentJSON:
        '{"callPatientMainHost": "0","questionQrcodeHost":"","suffixCog": "","callTimeoutDurationMainHost":"30","paymentMode":"NotDockedMode","saveAudioAndVideoFiles":false,"offlineIp":"","offLineDeptId":"","offLineDeviceName":"","faceKey":"","faceSession":"","msgForwardApi":"http://服务器IP/nmbm/app-nm/call/no-convert","msgForwardDeviceId":"","msgForwardDeviceName":"","callForwarding":false,"SimMedAdvice":true,"callClear":false,"horizontalImage":"","verticalImage":"","hangUpCall":false, "audioAndVideoCallSolution": "videoPaas", "nurseLevelInterrupt": "0","IDconfirmationIoTPhysical":true, "unCallReminderMainHost": "0", "mulAcceptRequestsDevices": [], "unlockDutyRoomOpenTime": [{ "start": "00:00:00", "end": "23:59:59" }], "callBellingMethod": 0, "downtimeCallIp": "", "downtimeCallId": ""}',
      // 配置内容
      configContent: {
        // msgForwardApi: "http://IP/nmbm/app-nm/call/no-convert"
        mulAcceptRequestsDevices: [],
        unlockDutyRoomOpenTime: [{ start: "00:00:00", end: "23:59:59" }] // 开启时间
      },
      audioAndVideoCallSolution: "videoPaas",
      medicalMainframeList: [],
      defaultaudioAndVideoRecordingsOtherPath: "/resource/mango" // 录音录像路径默认地址
    };
  },
  mounted() {},
  watch: {
    "configContent.offlineIp": function (newVal, oldVal) {
      this.configContent.downtimeCallIp = newVal;
    },
    "configContent.downtimeCallIp": function (newVal, oldVal) {
      if (!newVal) {
        this.configContent.downtimeCallId = "";
        return;
      }
      const device = this.medicalMainframeList.find(
        (item) => item.ip === newVal
      );
      if (device) {
        this.configContent.downtimeCallId = device.deviceId;
      }
    }
  },

  methods: {
    onAddFirstunlockDutyRoomOpenTime() {
      this.configContent.unlockDutyRoomOpenTime.push({ start: "", end: "" });
    },
    async onGetMedicalList(deptId) {
      this.medicalMainframeList = [];
      this.configContent.msgForwardDeviceId = "";
      let res = await API.getMedicalListByDeptId(deptId);
      if (res.status == 200) {
        console.log(res);
        this.$nextTick(() => {
          this.medicalMainframeList = res.data.list || [];
          const device = this.medicalMainframeList.find(
            (item) => item.ip === this.configContent.downtimeCallIp
          );
          if (device) {
            this.configContent.downtimeCallId = device.deviceId;
          }
        });
        this.getData(this.deviceConfigName);
      }
    },
    onOfflineIpChange(e) {
      for (let i = 0; i < this.medicalMainframeList.length; i++) {
        if (i < this.medicalMainframeList[i].deviceId == e) {
          this.configContent.offLineDeptId =
            this.medicalMainframeList[i].deptId;
          this.configContent.offLineDeviceName =
            this.medicalMainframeList[i].deviceName;
          break;
        }
      }
    },
    onMsgForwardChange(e) {
      for (let i = 0; i < this.medicalMainframeList.length; i++) {
        if (i < this.medicalMainframeList[i].deviceId == e) {
          this.configContent.msgForwardDeviceName =
            this.medicalMainframeList[i].deviceName;
          break;
        }
      }
    },
    onAudioChange(e) {
      if (!e) {
        this.configContent.audioAndVideoRecordingsOtherPath =
          this.defaultaudioAndVideoRecordingsOtherPath;
      }
    },
    onAudioAndVideoCallSolutionChange(value) {
      this.$confirm("更改后会影响系统呼叫通话，确定更改吗？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.configContent.audioAndVideoCallSolution = value;
        })
        .catch(() => {
          this.audioAndVideoCallSolution =
            this.configContent.audioAndVideoCallSolution;
        });
    },
    addunlockDutyRoomOpenTime() {
      if (this.configContent.unlockDutyRoomOpenTime.length >= 3) {
        this.$message.error("最多可以有三条数据");
        return;
      }
      this.configContent.unlockDutyRoomOpenTime.push({ start: "", end: "" });
    },
    removeUnlockDutyRoomOpenTime(timeIndex) {
      this.configContent.unlockDutyRoomOpenTime.splice(timeIndex, 1);
    }
  }
};
</script>
<style scoped lang="scss">
.save-view {
  background-color: #fff;
  position: sticky;
  bottom: -20px;
  padding: 20px 0;
  z-index: 20;
}
.device-list {
  display: flex;
  flex-direction: column;
}
.device-radio-item {
  padding: 5px 0;
}
.imageDiv {
  width: 50%;
}

.imageSpan {
  width: 25%;
  text-align: right;
}
.imgvc /deep/.el-form-item__content {
  margin-left: 0px !important;
}
</style>
