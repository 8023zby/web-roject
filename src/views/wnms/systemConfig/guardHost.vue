<template>
  <el-container style="height: 100%" v-loading="yh_loading">
    <el-main>
      <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" :anchorList="anchorList" :disabled="deptDisabled"></deptInsideMenu>
      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
        <el-divider>
          <h2 id="divider1">页面设置</h2>
        </el-divider>
        <!-- 终端设置 -->
        <el-form-item label="首页提示语">
          <el-input type="textarea" v-model="configContent.homePageTips" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="人脸识别时测温">
          <el-switch v-model="configContent.isTestTept" :active-color="switchActiveColor" />
        </el-form-item>
        <el-form-item label="测温范围">
          <template>
            <div style="display:grid;grid-template-columns:70% 30%">
              <div>
                <el-slider @change="sChange()" @input="sInput()" v-model="configContent.testTeptRange" range :show-tooltip="true" :step="0.1" :min="35" :max="42" :marks="testTeptRangeMarks" style="width:90%;margin-left: 10px;">
                </el-slider>
              </div>
              <div>
                测温补偿：<el-input type="number" step="0.1" @keyup.native="numberValidate(configContent.testTeptCompensate)" min="-10" max="10" style="width:80px" v-model="configContent.testTeptCompensate"></el-input>摄氏度
              </div>
            </div>
          </template>
        </el-form-item>

        <el-form-item label="终端设置">
          <el-switch v-model="configContent.deviceSettingGuard" :active-color="switchActiveColor" />
        </el-form-item>

        <el-divider>
          <h2 id="divider2">门禁设置</h2>
        </el-divider>

        <!-- 开门方式 -->
        <el-form-item label="开门方式">
          <el-checkbox-group v-model="configContent.doorOpenType">
            <el-checkbox label="card">医护刷卡</el-checkbox>
            <el-checkbox label="pwd">手输密码</el-checkbox>
            <el-checkbox label="face">人脸识别</el-checkbox>
            <el-checkbox label="idNumber">患者身份证</el-checkbox>
            <el-checkbox label="wristbandCode">腕带码</el-checkbox>
            <span style="color: #606266; font-size: 14px; margin: 0 10px 0 25px">门禁密码</span>
            <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model.trim="configContent.doorGuardPasswordGuard" type="text" maxlength="7" class="w100" />
          </el-checkbox-group>
        </el-form-item>

        <!-- 门禁密码 -->
        <!-- <el-form-item label="门禁密码">
          <el-input
            v-model.trim="configContent.doorGuardPasswordGuard"
            type="text"
            maxlength="7"
            class="w100"
          />
        </el-form-item>-->

        <!-- 常开时间 -->

        <!-- 无常开时间时显示 -->
        <el-form-item label="常开时间" v-if="configContent.normalOpenTimeGuard.length <= 0">
          <el-button round type="primary" size="mini" @click="onAddFirstOpenTime">添加</el-button>
        </el-form-item>

        <el-row v-for="(businessHour, hourIndex) in configContent.normalOpenTimeGuard" :key="hourIndex">
          <el-form-item :key="hourIndex" :label="'常开时间' + (hourIndex + 1)" label-width="160px" :prop="'normalOpenTimeGuard[' + hourIndex + '][0]'" :rules="[
              {
                required: false,
                message: '常开时间不能为空',
                trigger: 'blur',
              },
            ]">
            <el-time-picker v-model="configContent.normalOpenTimeGuard[hourIndex]" value-format="HH:mm:ss" is-range :clearable="false" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
            <div class="item-title" style="display: inline-block" @click="addOpenTime">
              &nbsp;
              <i class="el-icon-circle-plus-outline" style="cursor: pointer" />
            </div>
            <div class="item-title" style="display: inline-block" @click="removeOpenTime(timeIndex)">
              &nbsp;
              <i class="el-icon-remove-outline" style="cursor: pointer" />
            </div>

            <div v-if="!timePickerRange">
              <small style="color: red">时间不可交叉!</small>
            </div>
          </el-form-item>
        </el-row>

        <div class="xlk-split-text" v-if="configContent.normalOpenTimeGuard.length > 0">如果开始时间不可选，请先设置结束时间后再设置开始时间</div>

        <!-- 控制方式 -->
        <el-form-item label="控制方式">
          <el-radio-group v-model="configContent.controlType">
            <el-radio label="0">继电器</el-radio>
            <el-radio label="1">韦根26</el-radio>
            <el-radio label="2">韦根34</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="margin-left-80" prop="controlTypeCardNumber" label="备用卡号" v-if="
                configContent.controlType == '1' ||
                configContent.controlType == '2'
              ">
          <el-input style="width: 200px" v-model="configContent.controlTypeCardNumber" />
        </el-form-item>
        <el-form-item class="margin-left-80" label="韦根设置" v-if="
                configContent.controlType == '1' ||
                configContent.controlType == '2'
              ">
          <el-select v-model="configContent.WegingCode" placeholder="请选择">
            <el-option label="阴极" :value="11"></el-option>
            <el-option label="阳极" :value="22"></el-option>
          </el-select>
        </el-form-item>
        <!-- 卡号传输顺序 -->
        <el-form-item class="margin-left-80" label="卡号传输顺序" v-if="
                configContent.controlType == '1' ||
                configContent.controlType == '2'
              ">
          <el-radio-group v-model="configContent.cardTransmissionOrder">
            <el-radio label="asc">正序</el-radio>
            <el-radio label="desc">倒序</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 卡号传输进制 -->
        <el-form-item class="margin-left-80" label="卡号传输进制" v-if="
                configContent.controlType == '1' ||
                configContent.controlType == '2'
              ">
          <el-radio-group v-model="configContent.cardTransmissionHex">
            <el-radio label="0">二进制</el-radio>
            <el-radio label="1">八进制</el-radio>
            <el-radio label="2">十进制</el-radio>
            <el-radio label="3">十六进制</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 自动锁门时间 -->
        <el-form-item label="自动锁门时间">
          打开门禁后
          <el-select v-model="configContent.autoCloseDoorTimeGuard" class="w80">
            <el-option v-for="item in 10" :key="item" :label="item" :value="item" />
          </el-select>秒后自动锁门
        </el-form-item>

        <!-- 自动返回主页面 -->
        <el-form-item label="自动返回主页面">
          <el-switch v-model="configContent.autoGoIndex" :active-color="switchActiveColor" />

          <el-select style="margin-left: 20px" v-model="configContent.autoGoIndexTime" class="w80">
            <el-option v-for="item in 60" :key="item" :label="item" :value="item" />
          </el-select>秒后自动返回主页面
        </el-form-item>

        <el-divider>
          <h2 id="divider3">硬件控制</h2>
        </el-divider>

        <el-form-item label="防拆报警">
          <el-switch v-model="configContent.preventRemoveWarning" :active-color="switchActiveColor"></el-switch>
        </el-form-item>
        <!-- 终端音量 -->
        <el-form-item label="终端音量">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.volumeGuard[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }" :clearable="false" placeholder="选择时间" style="width: 100%" />
                <el-select class="volume-select" v-model="configContent.volumeGuard[index].Vol" placeholder="请选择音量" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 终端亮度 -->
        <el-form-item label="终端亮度">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.lightGuard[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }" :clearable="false" placeholder="选择时间" style="width: 100%" />
                <el-select class="light-select" v-model="configContent.lightGuard[index].Light" placeholder="请选择亮度" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 重启终端 -->
        <el-form-item label="重启终端">
          <el-button round type="primary" size="mini" :loading="loadingState" @click="rebootEC(deviceType.ecDoorAccessExtension)">重启</el-button>
        </el-form-item>

        <!-- 定时重启 -->
        <el-form-item label="定时重启">
          <el-switch v-model="configContent.autoRestarGuard.state" :active-color="switchActiveColor" />每天
          <el-time-picker v-model="configContent.autoRestarGuard.time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" :disabled="!configContent.autoRestarGuard.state" class="w120" />时间，自动重启
        </el-form-item>
      </el-form>

      <el-row class="top-24 save-view" style="text-align: center">
        <el-button @click="goParent">取消</el-button>
        <el-button type="primary" @click.prevent.stop="saveConfig(deviceConfigName)">保存</el-button>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import "./systemConfig.css";
import configMixin from "./mixin";
import deptInsideMenu from '@/components/wnms/deptInsideMenu/deptInsideMenu';

export default {
  name: "AccessControlDeviceConfig",
  mixins: [configMixin],
  components: { deptInsideMenu },
  data () {
    return {
      //锚点列表
      anchorList: [
        {
          src: "divider1",
          title: "页面设置"
        },
        {
          src: "divider2",
          title: "门禁设置"
        },
        {
          src: "divider3",
          title: "硬件控制"
        }
      ],
      // 配置页面名称
      deviceConfigName: "accessControl",
      // 时间选择器数量
      timeIndex: 0,
      // 时间范围验证
      timePickerRange: false,
      configContentJSON: '{ "WegingCode": 11, "doorOpenType": [], "controlType": "", "controlTypeCardNumber": "", "cardTransmissionOrder": "", "cardTransmissionHex": "", "autoGoIndex": false, "autoGoIndexTime": 15, "doorGuardPasswordGuard": "3585668", "normalOpenTimeGuard": [], "autoCloseDoorTimeGuard": 5, "volumeGuard": [ { "Vol": "10", "Time": "08:00:00" }, { "Vol": "8", "Time": "12:00:00" }, { "Vol": "10", "Time": "14:00:00" }, { "Vol": "6", "Time": "18:00:00" } ], "lightGuard": [ { "Light": "50", "Time": "08:00:00" }, { "Light": "50", "Time": "12:00:00" }, { "Light": "50", "Time": "14:00:00" }, { "Light": "50", "Time": "18:00:00" } ], "autoRestarGuard": { "time": "08:00:00", "state": false }, "deviceSettingGuard": false }',
      // 配置内容

      testTeptRangeMarks: {
        35: '35°C',
        // 37.5: '37°C',
        // 41: '41°C',
        42: '42°C'
      },
      configContent: {
        homePageTips: '请靠近自动识别人脸后开门',//首页提示语
        isTestTept: true,//人脸识别时测温
        testTeptRange: [35, 42],//测温范围
        testTeptCompensate: 0.0,//测温补偿
        preventRemoveWarning: false,//防拆报警
        WegingCode: 11,
        doorOpenType: [], //开门方式
        controlType: "", //控制方式
        controlTypeCardNumber: "", //控制方式备用卡号，韦根26和韦根34时必填
        cardTransmissionOrder: "", //卡号传输顺序
        cardTransmissionHex: "", //卡号传输进制
        autoGoIndex: false, //是否自动返回首页
        autoGoIndexTime: 15, //自动返回首页延迟时间
        doorGuardPasswordGuard: "3585668",
        normalOpenTimeGuard: [],
        autoCloseDoorTimeGuard: 5,
        mulAcceptRequestsDevices: [], // 多终端接受门禁请求，选择设备
        unlockDutyRoomOpenTime: [{ start: "00:00:00", end: "23:59:59" }], // 开启时间
        volumeGuard: [
          {
            Time: "08:00:00",
            Vol: "10"
          },
          {
            Time: "12:00:00",
            Vol: "8"
          },
          {
            Time: "14:00:00",
            Vol: "10"
          },
          {
            Time: "18:00:00",
            Vol: "6"
          }
        ],
        lightGuard: [
          {
            Time: "08:00:00",
            Light: "50"
          },
          {
            Time: "12:00:00",
            Light: "50"
          },
          {
            Time: "14:00:00",
            Light: "50"
          },
          {
            Time: "18:00:00",
            Light: "50"
          }
        ],
        autoRestarGuard: {
          state: false,
          time: "08:00:00"
        },
        deviceSettingGuard: false
      }
    };
  },
  watch: {
    "configContent.normalOpenTimeGuard" (t) {
      let num = t.length;
      if (num === 1) {
        this.timePickerRange = true;
      }

      if (num === 2) {
        if (t[num - 1][0] < t[num - 2][1]) {
          this.timePickerRange = false;
        } else {
          this.timePickerRange = true;
        }
      }

      if (num === 3) {
        if (t[num - 2][0] < t[num - 3][1] || t[num - 1][0] < t[num - 2][1]) {
          this.timePickerRange = false;
        } else {
          this.timePickerRange = true;
        }
      }
    }
  },
  methods: {
    sChange () {
    },
    sInput () {
    },
    //锚点定位
    onAnchor (id) {
      document.querySelector(`#${id}`).scrollIntoView(true);
    },
    //添加第一条常开时间
    onAddFirstOpenTime () {
      this.configContent.normalOpenTimeGuard.push(["08:00:00", "09:00:00"]);
    },
    //添加第一条门禁开启时间
    onAddFirstunlockDutyRoomOpenTime () {
      this.configContent.unlockDutyRoomOpenTime.push({ start: '', end: '' });
    },
    addOpenTime () {
      if (this.configContent.normalOpenTimeGuard.length >= 3) {
        this.$message.error("最多可以有三条数据");
        return;
      }

      this.timeIndex += 1;

      let _time = "08:00:00";
      //如果已有一条常开时间，则自动产生新的时间范围
      if (this.configContent.normalOpenTimeGuard.length > 0) {
        _time = this.configContent.normalOpenTimeGuard[
          this.configContent.normalOpenTimeGuard.length - 1
        ][1];
      }

      this.configContent.normalOpenTimeGuard.push([_time, _time]);
    },
    addunlockDutyRoomOpenTime () {
      if (this.configContent.unlockDutyRoomOpenTime.length >= 3) {
        this.$message.error("最多可以有三条数据");
        return;
      }
      this.configContent.unlockDutyRoomOpenTime.push({ start: '', end: '' });
    },

    removeOpenTime (timeIndex) {
      this.timeIndex--;
      this.configContent.normalOpenTimeGuard.splice(timeIndex, 1);

      // if (timeIndex === 0) {
      //   this.$message({
      //     message: "常开时间为必填项",
      //     type: "warning",
      //   });
      // } else {
      //   this.timeIndex--;
      //   this.configContent.normalOpenTimeGuard.splice(timeIndex, 1);
      // }
    },
    removeUnlockDutyRoomOpenTime (timeIndex) {
      this.configContent.unlockDutyRoomOpenTime.splice(timeIndex, 1);
    },
    numberValidate (e) {
      this.configContent.testTeptCompensate = e.replace(/^\D*([0-9]\d*\.?\d{0,1})?.*$/, '$1');
    }
  }
};
</script>
<style scoped>
.margin-left-80 {
  margin-left: 80px;
}
.xlk-split-text {
  font-size: 14px;
  padding-bottom: 20px;
  padding-left: 150px;
  color: #888;
}

.top-view {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
}

.anchor-view {
  border: 1px solid #409eff;
  border-radius: 4px;
  display: flex;
  background-color: #fff;
}

.anchor-view div {
  padding: 6px 15px;
  color: #409eff;
  border-right: 1px solid #409eff;
  cursor: pointer;
}

.anchor-view div:last-child {
  border: none !important;
}
.save-view {
  background-color: #fff;
  position: sticky;
  bottom: -20px;
  padding: 20px 0;
  z-index: 20;
}
</style>
