<template>
  <el-container style="height: 100%" v-loading="yh_loading">
    <el-main>
      <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" :anchorList="[]" :disabled="deptDisabled"></deptInsideMenu>
      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
        <!-- 定时息屏时间 -->
        <div>
          <el-form-item label="定时息屏时间">
            <el-switch v-model="configContent.iscloseScreenDutyRoom" :active-color="switchActiveColor" />
          </el-form-item>

          <el-form-item>
            <el-time-picker v-model="configContent.closeScreenDutyRoom.startTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenDutyRoom" />-
            <el-time-picker v-model="configContent.closeScreenDutyRoom.endTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenDutyRoom" />
          </el-form-item>

          <el-form-item prop="brightViewDutyRoom" :rules="[{ validator: brightViewDutyRoom, trigger: 'blur' }]">
            点亮屏幕
            <el-input v-model.trim="configContent.brightViewDutyRoom" type="text" maxlength="3" class="w60" :disabled="!configContent.iscloseScreenDutyRoom" />秒后自动息屏
          </el-form-item>
        </div>

        <!-- 定时启动屏保时间 -->
        <!-- <el-form-item label="定时启用屏保时间">
          <el-switch v-model="configContent.iscloseScreenDutyHost" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item>
          <el-time-picker
            v-model="configContent.closeScreenDutyrHost.startTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="选择开始时间"
            :clearable="false"
            :disabled="!configContent.iscloseScreenDutyHost"
          />-
          <el-time-picker
            v-model="configContent.closeScreenDutyrHost.endTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="选择开始时间"
            :clearable="false"
            :disabled="!configContent.iscloseScreenDutyHost"
          />
        </el-form-item>

        <el-form-item prop="brightViewDutyHost">
          点亮屏幕
          <el-input
            v-model.trim="configContent.brightViewDutyHost"
            type="text"
            maxlength="4"
            class="w60"
            :disabled="!configContent.iscloseScreenDutyHost"
          />秒后自动显示屏保
        </el-form-item> -->

        <!-- 终端音量 -->
        <el-form-item label="终端音量" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.volumeDutyRoom[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }" :clearable="false" placeholder="选择时间" style="width: 100%" />
                <el-select class="volume-select" v-model="configContent.volumeDutyRoom[index].Vol" placeholder="请选择音量" style="width: 100%; margin-top: 10px">
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
                <el-time-picker v-model="configContent.lightDutyRoom[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }" :clearable="false" placeholder="选择时间" style="width: 100%" />
                <el-select class="light-select" v-model="configContent.lightDutyRoom[index].Light" placeholder="请选择亮度" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 重启终端 -->
        <el-form-item label="重启终端" prop="name">
          <el-button round type="primary" size="mini" @click="rebootEC(deviceType.ecDutyExtension)">重启</el-button>
        </el-form-item>

        <!-- 定时重启 -->
        <el-form-item label="定时重启" prop="name">
          <el-switch v-model="configContent.autoRestarDutyRoom.state" :active-color="switchActiveColor" />每天
          <el-time-picker v-model="configContent.autoRestarDutyRoom.time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" :disabled="!configContent.autoRestarDutyRoom.state" class="w120" />时间，自动重启
        </el-form-item>

        <!-- 终端设置 -->
        <el-form-item label="终端设置">
          <el-switch v-model="configContent.deviceSettingDutyRoom" :active-color="switchActiveColor" />
        </el-form-item>

        <!-- 呼叫屏蔽 -->
        <el-form-item label="呼叫屏蔽" v-if="false">
          <el-checkbox-group v-model="configContent.CallScreening">
            <el-checkbox label="床头分机"></el-checkbox>
            <el-checkbox label="门口分机"></el-checkbox>
            <el-checkbox label="床旁分机"></el-checkbox>
            <el-checkbox label="卫生间分机"></el-checkbox>
            <el-checkbox label="医护主机"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="值班室屏蔽卫生间呼叫" prop="name">
          <el-switch v-model="configContent.toiletCallScreening" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item label="屏蔽患者呼叫" prop="stopBedHeadCall">
          <el-switch v-model="configContent.stopBedHeadCall" :active-color="switchActiveColor" :active-value="true" :inactive-value="false" />
        </el-form-item>

        <!-- <el-form-item label="屏蔽床旁呼叫" prop="stopBedSideCall">
					<el-switch
            v-model="configContent.stopBedSideCall"
            :active-color="switchActiveColor"
            :active-value="true"
            :inactive-value="false"
          />
				</el-form-item> -->

        <el-form-item label="屏蔽增援呼叫" prop="stopReinforceCall">
          <el-switch v-model="configContent.stopReinforceCall" :active-color="switchActiveColor" :active-value="true" :inactive-value="false" />
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
import deptInsideMenu from "@/components/wnms/deptInsideMenu/deptInsideMenu";

export default {
  name: "DutyRoomDeviceConfig",
  mixins: [configMixin],
  components: { deptInsideMenu },
  watch: {
    "configContent.stopBedHeadCall": {
      handler(newVal, oldVal) {
        this.configContent.stopBedSideCall = newVal;
      },
      immediate: true
    }
  },
  data() {
    var brightViewDutyRoom = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error("自动息屏时间不能为空!"));
      }

      if (/^(?:[1-9]\d*)$/.test(value) === false) {
        callback(new Error("请输入正整数"));
      }

      if (value < 5) {
        callback(new Error("息屏时间不能小于5s"));
      } else {
        callback();
      }
    };
    return {
      // 配置页面名称
      deviceConfigName: "dutyRoom",
      brightViewDutyRoom: brightViewDutyRoom,
      // 配置内容
      configContent: {
        iscloseScreenDutyHost: false, // 值班室分机 是否开启屏保
        brightViewDutyHost: "30", // 值班室分机 点亮几秒后启动屏保
        closeScreenDutyrHost: {
          // 值班室分机 屏保开始时间结束时间
          startTime: "20:00:00",
          endTime: "06:00:00"
        },
        toiletCallScreening: false,
        iscloseScreenDutyRoom: true,
        closeScreenDutyRoom: {
          startTime: "20:00:00",
          endTime: "06:00:00"
        },
        brightViewDutyRoom: "15",
        volumeDutyRoom: [
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
        lightDutyRoom: [
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
        autoRestarDutyRoom: {
          state: false,
          time: "08:00:00"
        },
        deviceSettingDutyRoom: false,
        CallScreening: [], // 呼叫屏蔽
        stopBedHeadCall: false,
        // stopBedSideCall: false,
        stopReinforceCall: false
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
