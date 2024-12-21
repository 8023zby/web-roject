<template>
  <!-- i系列分机床头配置 -->
  <el-container style="height: 100%" v-loading="yh_loading">
    <el-main>
      <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" :anchorList="anchorList" loadData :disabled="deptDisabled"></deptInsideMenu>
      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
        <el-divider>
          <h2 id="divider1">页面设置</h2>
        </el-divider>

        <!-- 床头卡患者姓名保护 -->
        <el-form-item label="开启隐私保护" prop="name">
          <el-switch v-model="configContent.isFilterName" :active-color="switchActiveColor" active-value="1" inactive-value="0" />
        </el-form-item>

        <!-- 定时息屏时间 -->
        <div>
          <!-- <el-form-item label="定时息屏时间">
            <el-switch
              v-model="configContent.iscloseScreenTime"
              :active-color="switchActiveColor"
            />
          </el-form-item> -->
          <el-form-item label="定时启用息屏时间">
            <el-switch v-model="configContent.closeScreenTime.closeScreenOpen" :active-color="switchActiveColor" active-value="1" inactive-value="0" />
          </el-form-item>

          <el-form-item>
            <el-time-picker v-model="configContent.closeScreenTime.startTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="configContent.closeScreenTime.closeScreenOpen === '0'" />-
            <el-time-picker v-model="configContent.closeScreenTime.stopTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="configContent.closeScreenTime.closeScreenOpen === '0'" />
          </el-form-item>

          <el-form-item prop="brightViewSeconds">
            点亮屏幕
            <el-input v-model.trim="configContent.brightViewSeconds" type="text" maxlength="3" class="w60" />秒后自动息屏
          </el-form-item>

          <el-form-item label="呼叫转移">
            <el-switch v-model="configContent.callTransferOpen" :active-color="switchActiveColor" active-value="1" inactive-value="0" />
          </el-form-item>
        </div>

        <el-divider>
          <h2 id="divider2">模板配置</h2>
        </el-divider>

        <el-form-item label="模板配置" prop="template">
          <div style="display: flex; align-item: center">
            <el-input v-model="selectedTemplate.templateName" placeholder="请选择模板" style="width: 250px;margin-right: 20px" :readonly="true"></el-input>
            <el-button size="small" type="primary" @click="selectTemplateVisible = true">选择模板</el-button>
            <el-button size="small" type="primary" @click="setMaterialDept">下发素材</el-button>
          </div>
        </el-form-item>

        <el-divider>
          <h2 id="divider3">硬件控制</h2>
        </el-divider>

        <div>
          <el-form-item label="语音报号">
            <el-switch v-model="configContent.voice.voiceOpen" :active-color="switchActiveColor" active-value="1" inactive-value="0" />
          </el-form-item>

          <el-form-item>
            <el-time-picker v-model="configContent.voice.startTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="configContent.voice.voiceOpen === '0'" />-
            <el-time-picker v-model="configContent.voice.stopTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择结束时间" :clearable="false" :disabled="configContent.voice.voiceOpen === '0'" />
          </el-form-item>

        </div>

        <!-- 终端音量 -->
        <el-form-item label="终端音量" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <el-time-picker v-model="configContent.volume[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }" :clearable="false" placeholder="选择时间" style="width:100%" />
                <el-select class="volume-select" v-model="configContent.volume[index].Vol" placeholder="请选择音量" style="width:100%; margin-top: 10px">
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
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <el-time-picker v-model="configContent.light[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }" :clearable="false" placeholder="选择时间" style="width:100%" />
                <el-select class="light-select" v-model="configContent.light[index].Light" placeholder="请选择亮度" style="width:100%; margin-top: 10px">
                  <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

      </el-form>

      <!-- 保存 -->
      <el-row class="top-24 save-view" style="text-align: center">
        <el-button @click="goParent">取消</el-button>
        <el-button type="primary" @click.prevent.stop="saveConfig()">保存</el-button>
      </el-row>
    </el-main>
    <el-dialog :visible.sync="selectTemplateVisible" title="选择模板" width="800px">
      <div style="max-height: 400px;overflow: auto;">
        <el-table :data="templateList" style="width: 100%">
          <el-table-column prop="sortIndex" align="center" label="序号" width="150">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceModel" align="center" label="设备型号"></el-table-column>
          <el-table-column prop="templateName" align="center" label="模板名称"></el-table-column>
          <el-table-column prop="isUsed" align="center" label="是否使用"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="setTemplate(scope.row)">下发模板</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectTemplateVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import "./systemConfig.css";
import configMixin from "./mixin";
import axios from "axios";
import * as API from "@/api/wnms/msgManage/systemConfig";
import { newGetSelectData } from "../../../assets/wnms/utils/common";
import getStorageUser from "@/assets/wnms/utils/storageUser";

import deptInsideMenu from "@/components/wnms/deptInsideMenu/deptInsideMenu";
import {
  getTemplateByDeptId,
  getTemplateByDeviceId
} from "../../../api/wnms/msgManage/systemConfig";
const ESetTemplateType = Object.freeze({
  TEMPLATE: "模板",
  MATERIAL: "素材",
  UPDATEPACKAGE: "升级包"
});
export default {
  name: "BedHeadDeviceConfig",
  mixins: [configMixin],
  components: { deptInsideMenu },
  data() {
    return {
      anchorList: [
        {
          src: "divider1",
          title: "页面设置"
        },
        {
          src: "divider2",
          title: "模板设置"
        },
        {
          src: "divider3",
          title: "硬件控制"
        }
      ],
      // 配置页面名称
      deviceConfigName: "iBedHeadExtension",
      // 配置内容
      configContent: {
        isFilterName: "1",
        closeScreenTime: {
          closeScreenOpen: "0",
          startTime: "20:00:00",
          stopTime: "06:00:00"
        },
        brightViewSeconds: "15", // 1-100
        volume: [
          {
            Time: "08:00:00",
            Vol: "5"
          },
          {
            Time: "12:00:00",
            Vol: "3"
          },
          {
            Time: "14:00:00",
            Vol: "5"
          },
          {
            Time: "18:00:00",
            Vol: "1"
          }
        ],
        light: [
          {
            Time: "08:00:00",
            Light: "5"
          },
          {
            Time: "12:00:00",
            Light: "2"
          },
          {
            Time: "14:00:00",
            Light: "5"
          },
          {
            Time: "18:00:00",
            Light: "1"
          }
        ],
        callTransferOpen: "0",
        voice: {
          voiceOpen: "0",
          startTime: "06:00:00",
          stopTime: "21:00:00"
        }
      },
      volumeOptionsList: [
        {
          value: "0",
          label: "0"
        },
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        },
        {
          value: "5",
          label: "5"
        },
        {
          value: "6",
          label: "6"
        }
      ],
      // 亮度列表
      lightOptionsList: [
        {
          value: "0",
          label: "0"
        },
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        },
        {
          value: "5",
          label: "5"
        },
        {
          value: "6",
          label: "6"
        },
        {
          value: "7",
          label: "7"
        },
        {
          value: "8",
          label: "8"
        },
        {
          value: "9",
          label: "9"
        }
      ],
      menuArrayList: [],
      yh_loading: false,
      templateTitle: "",
      selectTemplateVisible: false,
      templateList: [],
      selectedTemplate: {},
      deviceModel: "YH-6297i"
    };
  },
  mounted() {
    this.addRules();
    this.getTemplateList();
  },
  methods: {
    /**
     * @description: 获取配置
     * @param {*} deviceType
     * @return {*}
     */
    async getData(deviceType) {
      this.orgId = getStorageUser("orgInfo").orgId; //处理orgId获取不到的问题
      try {
        this.getTemplate();
        let res = await API.fetchDeviceConfig(deviceType, {
          orgId: this.orgId, // 机构ID
          nurseUnitId: this.nurseUnitId, // 护理单元ID
          deviceId: this.deviceId //  设备ID
        });
        if (res.data) {
          Object.keys(this.configContent).map((key) => {
            if (res.data[key]) {
              this.configContent[key] = res.data[key];
            }
          });
        }
      } catch (error) {}
    },

    /**
     * @description: 保存配置
     * @param {*} deviceConfigName
     * @return {*}
     */
    async saveConfig() {
      this.$refs["configContent"].validate(async (valid) => {
        if (valid) {
          const addConfig = {
            nurseUnitId: this.nurseUnitId,
            config: JSON.stringify(this.configContent),
            deviceId: this.deviceId
          };
          try {
            let res = await API.addDeviceConfig(
              addConfig,
              this.deviceConfigName
            );
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              // 返回父级菜单
              this.goParent();
            } else {
              this.$message({
                type: "error",
                message: res.desc
              });
              this.getData(this.deviceConfigName);
            }
          } catch (error) {
            // this.$message.error(error.message || error)
          }
        } else {
          return false;
        }
      });
    },

    /**
     * @description: 添加rule
     * @param {*}
     * @return {*}
     */
    addRules() {
      this.rules = {
        ...this.rules,
        brightViewSeconds: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("不能为空"));
              }
              if (!/^[0-9]+$/.test(value)) {
                return callback(new Error("输入类型为数字"));
              }
              if (parseInt(value) < 5 || parseInt(value) > 120) {
                return callback(new Error("息屏时间应该在5-120秒之内"));
              }
              return callback();
            },
            trigger: "blur"
          }
        ]
      };
    },
    uploadSuccess(res) {
      this.templateTitle = res.data;
    },
    uploadError() {
      this.$message.error("上传失败，请重新上传");
    },
    // 下发
    async setTemplate(row) {
      try {
        let res = await API.setTemplate({
          deptId: this.nurseUnitId,
          deviceIds: this.deviceId,
          deviceModel: row.deviceModel,
          deviceType: row.deviceType,
          templateId: row.templateId
        });
        if (typeof res.data === "string") {
          switch (res.data.toUpperCase()) {
            case "TEMPLATE":
            case "MATERIAL":
            case "UPDATEPACKAGE":
              this.$message.warning(
                `正在发送${ESetTemplateType[res.data.toUpperCase()]},请稍后重试`
              );
              return;
              break;
          }
          this.$message.success("发送中，无需等待");
          this.getTemplateList();
          await this.getTemplate();
        }
      } catch (error) {
        if (
          error.code === "ECONNABORTED" &&
          error.message.indexOf("timeout") !== -1
        ) {
          this.$message.success("发送中，无需等待");
          this.getTemplateList();
          await this.getTemplate();
        } else {
          // 针对500的错误，在request中已经做处理了，无需再处理了
          // this.$message.error(error.message || error)
          console.log("下发模板error:", error);
        }
      }
    },
    async getTemplate() {
      try {
        if (this.deviceId) {
          let res = await getTemplateByDeviceId({
            deviceId: this.deviceId,
            deptId: this.nurseUnitId,
            deviceType: this.deviceConfigName
          });
          this.selectedTemplate = res.data || {};
        } else {
          let res = await getTemplateByDeptId({
            deptId: this.nurseUnitId,
            deviceType: this.deviceConfigName
          });
          this.selectedTemplate = res.data || {};
        }
      } catch (error) {
        console.log(error);
      }
    },
    goParent() {
      let path = "";
      if (this.deptId) {
        path = `/deveiceA10IXL/iBedHeadExtension?deptId=${this.deptId}`;
      } else {
        path = `/deveiceA10IXL/iBedHeadExtension`;
      }
      this.$router.push({
        path: path
      });
    },
    async getTemplateList() {
      try {
        const res = await API.getTemplateList({
          deviceType: "iBedHeadExtension",
          deviceModel: "",
          deptId: this.nurseUnitId,
          deviceIds: this.deviceId
        });
        this.templateList = res.data;
      } catch (error) {}
    },
    /**
     * @description: 下发素材
     * @param {*}
     * @return {*}
     */
    async setMaterialDept() {
      try {
        let res = await API.setMaterialDept({
          deptId: this.nurseUnitId,
          deviceIds: this.deviceId,
          deviceModel: this.deviceModel,
          deviceType: this.deviceConfigName
        });
        if (typeof res.data === "string") {
          switch (res.data.toUpperCase()) {
            case "TEMPLATE":
            case "MATERIAL":
            case "UPDATEPACKAGE":
              this.$message.warning(
                `正在发送${ESetTemplateType[res.data.toUpperCase()]},请稍后重试`
              );
              return;
              break;
          }
          this.$message.success("发送中，无需等待");
        }
      } catch (error) {
        if (
          error.code === "ECONNABORTED" &&
          error.message.indexOf("timeout") !== -1
        ) {
          this.$message.success("发送中，无需等待");
        } else {
          this.$message.error(error.message || error);
        }
      }
    }
  }
};
</script>
<style lang="scss">
.bedCardTemp .el-radio {
  .el-radio__input {
    display: none;
  }

  &.is-checked .el-card {
    border: 1px solid blue;
  }
}

.bedCardTemp {
  .el-row {
    .el-col {
      display: inline-block;
      float: none;
    }
  }
}

#QRCodeImg {
  display: inline-block;
  margin-top: 1rem;
  padding: 10px;
  border: 1px solid #dcdfe6;
}

.callcenter-tree-view {
  height: 500px;
  overflow: auto;
}
.QRCode-field-selection {
  .el-dialog {
    .el-dialog__body {
      div {
        min-height: 200px;
        section {
          display: inline-block;
          margin: 10px;
          width: 20%;
        }
      }
    }
  }
}
.save-view {
  background-color: #fff;
  position: sticky;
  bottom: -20px;
  padding: 20px 0;
  z-index: 20;
}
</style>
