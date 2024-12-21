<!--
 * @author: DingChun
 * @date: 2020-06-28 17:57
 * @update: When you update it
 * @description: 医声助手
-->
<template>
  <el-container style="height: 100%">
    <el-main>
      <el-form
        ref="configContent"
        :model="configContent"
        :rules="rules"
        label-width="160px"
      >
        <el-form-item label="终端音量">
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
                  v-model="configContent.volumeGuard[index].Time"
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
                  class="volume-select"
                  v-model="configContent.volumeGuard[index].Vol"
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
        <el-form-item label="终端亮度">
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
                  v-model="configContent.lightGuard[index].Time"
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
                  class="light-select"
                  v-model="configContent.lightGuard[index].Light"
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
        <el-form-item label="重启终端">
          <el-button
            round
            type="primary"
            size="mini"
            :loading="loadingState"
            @click="rebootEC(deviceType.ecDoctorAssistantDevice)"
            >重启</el-button
          >
        </el-form-item>
        <el-form-item label="定时重启">
          <el-switch
            v-model="configContent.autoRestarGuard.state"
            :active-color="switchActiveColor"
          />
          每天
          <el-time-picker
            v-model="configContent.autoRestarGuard.time"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            :clearable="false"
            :disabled="!configContent.autoRestarGuard.state"
            class="w120"
          />
          时间，自动重启
        </el-form-item>
      </el-form>
      <el-row class="top-24" style="text-align: center">
        <el-button @click="goParent">取消</el-button>
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
  name: "YSAssistantDeviceConfig",
  mixins: [configMixin],
  data() {
    return {
      // 配置页面名称
      deviceConfigName: "doctorAssistant",
      // 配置内容
      configContent: {
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
        }
      }
    };
  }
};
</script>
