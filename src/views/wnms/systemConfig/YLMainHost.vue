<template>
  <el-container>
    <el-main>
      <el-form
        ref="configContent"
        :model="configContent"
        :rules="rules"
        label-width="160px"
      >
        <el-form-item label="最大报号次数" prop="name">
          <el-radio v-model="configContent.maxReportingNumMainHost" label="1"
            >1次</el-radio
          >
          <el-radio v-model="configContent.maxReportingNumMainHost" label="2"
            >2次</el-radio
          >
          <el-radio v-model="configContent.maxReportingNumMainHost" label="3"
            >3次</el-radio
          >
          <el-radio v-model="configContent.maxReportingNumMainHost" label="4"
            >4次</el-radio
          >
          <el-radio v-model="configContent.maxReportingNumMainHost" label="5"
            >5次</el-radio
          >
        </el-form-item>
        <el-form-item label="未处理呼叫提醒" prop="name">
          <el-radio v-model="configContent.unCallReminderMainHost" label="1"
            >单次提醒</el-radio
          >
          <el-radio v-model="configContent.unCallReminderMainHost" label="0"
            >无限循环</el-radio
          >
        </el-form-item>
        <el-form-item label="主机音量" prop="name">
          <el-row :gutter="10">
            <el-col
              v-for="(o, index) in 4"
              :key="o"
              :xs="12"
              :sm="6"
              :md="5"
              :lg="5"
              :xl="4"
              style="margin-bottom: 10px"
            >
              <el-card
                :body-style="{ padding: '0px' }"
                shadow="never"
                style="padding: 10px;"
              >
                <el-time-picker
                  v-model="configContent.volumeMainHost[index].Time"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  placeholder="选择时间"
                  style="width:100%"
                />
                <el-select
                  v-model="configContent.volumeMainHost[index].Vol"
                  placeholder="请选择音量"
                  style="width:100%; margin-top: 10px"
                >
                  <el-option
                    v-for="item in volumeOptionsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="主机亮度" prop="name">
          <el-row :gutter="10">
            <el-col
              v-for="(o, index) in 4"
              :key="o"
              :xs="12"
              :sm="6"
              :md="5"
              :lg="5"
              :xl="4"
              style="margin-bottom: 10px"
            >
              <el-card
                :body-style="{ padding: '0px' }"
                shadow="never"
                style="padding: 10px;"
              >
                <el-time-picker
                  v-model="configContent.lightMainHost[index].Time"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  :clearable="false"
                  placeholder="选择时间"
                  style="width:100%"
                />
                <el-select
                  v-model="configContent.lightMainHost[index].Light"
                  placeholder="请选择亮度"
                  style="width:100%; margin-top: 10px"
                >
                  <el-option
                    v-for="item in lightOptionsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="定时重启" prop="name">
          <el-switch
            v-model="configContent.autoRestarMainHost.state"
            :active-color="switchActiveColor"
          />
          每天
          <el-time-picker
            v-model="configContent.autoRestarMainHost.time"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            :clearable="false"
            :disabled="!configContent.autoRestarMainHost.state"
            class="w120"
          />
          时间，自动重启
        </el-form-item>
      </el-form>
      <el-row class="top-24" style="text-align: center">
        <el-button
          type="primary"
          @click.prevent.stop="saveConfig(deviceConfigName)"
          >保存</el-button
        >
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import "./systemConfig.css";
import configMixin from "./mixin";

export default {
  name: "YLMainConfig",
  mixins: [configMixin],
  data() {
    return {
      // 配置页面名称
      deviceConfigName: "YLMainConfig",
      // 配置内容
      configContent: {
        maxReportingNumMainHost: "3",
        unCallReminderMainHost: "0",
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
        }
      }
    };
  }
};
</script>
