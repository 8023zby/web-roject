<template>
  <el-container style="height: 100%" v-loading="yh_loading">
    <el-main>
      <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" :anchorList="[]" :disabled="deptDisabled"></deptInsideMenu>

      <el-form ref="configContent" :model="configContent" label-width="160px" :rules="rules">
        <!-- 最大报号次数 -->
        <!-- <el-form-item label="最大报号次数" prop="name">
          <el-radio v-model="configContent.maxReportingNumMainHost" label="1">1次</el-radio>
          <el-radio v-model="configContent.maxReportingNumMainHost" label="2">2次</el-radio>
          <el-radio v-model="configContent.maxReportingNumMainHost" label="3">3次</el-radio>
          <el-radio v-model="configContent.maxReportingNumMainHost" label="4">4次</el-radio>
          <el-radio v-model="configContent.maxReportingNumMainHost" label="5">5次</el-radio>
        </el-form-item> -->
        <!-- <el-form-item label="最大报号次数" prop="name">
          <el-select v-model="configContent.maxReportingNumMainHost" placeholder="请选择" style="width:100px;">
            <el-option v-for="index of 20" :key="index" :label="index" :value="index">
            </el-option>
          </el-select>次
        </el-form-item> -->
        <!-- 床位一览扩展字段 -->
        <el-form-item label="床位一览扩展字段">
          <el-radio-group v-model="configContent.mainHostlistBed">
            <el-radio label="0">不显示</el-radio>
            <el-radio label="1">病情</el-radio>
            <el-radio label="2">手术状态</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 终端音量 -->
        <el-form-item label="终端音量" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.volumeMainHost[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }" placeholder="选择时间" style="width: 100%" />
                <el-select class="volume-select" v-model="configContent.volumeMainHost[index].Vol" placeholder="请选择音量" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 终端亮度 -->
        <el-form-item label="终端亮度" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.lightMainHost[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }" :clearable="false" placeholder="选择时间" style="width: 100%" />
                <el-select class="light-select" v-model="configContent.lightMainHost[index].Light" placeholder="请选择亮度" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 定时启动屏保时间 -->
        <el-form-item label="定时启用屏保时间">
          <el-switch v-model="configContent.iscloseScreenMainHost" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item>
          <el-time-picker v-model="configContent.closeScreenMainHost.startTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenMainHost" />-
          <el-time-picker v-model="configContent.closeScreenMainHost.endTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenMainHost" />
        </el-form-item>

        <el-form-item prop="brightViewMainHost">
          点亮屏幕
          <el-input v-model.trim="configContent.brightViewMainHost" type="text" maxlength="4" class="w60" :disabled="!configContent.iscloseScreenMainHost" />秒后自动显示屏保
        </el-form-item>

        <!-- 重启终端 -->
        <el-form-item label="重启终端" prop="name">
          <el-button round type="primary" size="mini" @click="rebootEC(deviceType.ecMedicalMainframe)">重启</el-button>
        </el-form-item>

        <!-- 定时重启 -->
        <el-form-item label="定时重启" prop="name">
          <el-switch v-model="configContent.autoRestarMainHost.state" :active-color="switchActiveColor" />每天
          <el-time-picker v-model="configContent.autoRestarMainHost.time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" :disabled="!configContent.autoRestarMainHost.state" class="w120" />时间，自动重启
        </el-form-item>

        <!-- 终端设置 -->
        <el-form-item label="终端设置">
          <el-switch v-model="configContent.deviceSettingMainHost" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item label="不显示本病区值班室" prop="name">
          <el-switch v-model="configContent.mainCallScreening" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item label="门禁一键控制按钮" prop="name">
          <el-switch v-model="configContent.oneKeyToOpenTheDoor" :active-color="switchActiveColor" />
          <span style="color:#888;padding:0 10px;">仅针对继电器控制方式下使用</span>
        </el-form-item>

        <el-form-item label="门禁体温预警" prop="bodyTmperature" class="yh_hosts_form">
          当体温超过
          <el-input v-model.trim="configContent.bodyTmperature" type="text" maxlength="4" class="w60" />时进行预警，预警颜色设置

          <el-color-picker popper-class="yh-Host-picker" style="vertical-align: middle;" v-model="configContent.warningColor" :predefine="predefineColors" />

        </el-form-item>

        <!-- 宕机呼叫主机IP -->
        <!-- <el-form-item label="宕机呼叫主机IP">
          <el-input type="text" style="width:300px;" v-model="configContent.offlineIp" />
        </el-form-item>-->
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
import deptInsideMenu from "@/components/wnms/deptInsideMenu/deptInsideMenu";
export default {
  name: "HostDeviceConfig",
  mixins: [configMixin],
  components: { deptInsideMenu },
  data() {
    return {
      // 配置页面名称
      deviceConfigName: "host",
      // 配置内容
      configContent: {
        iscloseScreenMainHost: true, // 是否开启医护主机屏保
        brightViewMainHost: "30", // 医护主机 点亮几秒后启动屏保
        closeScreenMainHost: {
          // 医护主机 屏保开始时间结束时间
          startTime: "23:00:00",
          endTime: "05:00:00"
        },
        bodyTmperature: "37.5",
        warningColor: "#FF0000",
        mainHostlistBed: "0",
        oneKeyToOpenTheDoor: false,
        mainCallScreening: false,
        // maxReportingNumMainHost: "5",
        volumeMainHost: [
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
        lightMainHost: [
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
        autoRestarMainHost: {
          state: false,
          time: "08:00:00"
        },
        deviceSettingMainHost: false
      }
    };
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
</style>
<style lang="scss">
.yh-Host-picker {
  .el-color-dropdown__btns {
    .el-color-dropdown__link-btn {
      display: none;
    }
  }
}
</style>
