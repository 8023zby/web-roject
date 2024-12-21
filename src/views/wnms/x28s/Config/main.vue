<template>
  <el-container>
    <el-main>
      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
        <el-form-item label="科室:" style="width:30%">
          <treeselect v-model="selectDeptId" :multiple="false" :options="dataTree" :normalizer="normalizer" @select="onSelect" :default-expand-level="2" :clearable="false" placeholder="请选择科室" />
        </el-form-item>
        <el-form-item label="机构名称:" style="width:30%">
          <el-input type="text" disabled :value="orgInfo.orgName"></el-input>
        </el-form-item>
        <el-form-item label="默认提示语" prop="defaultPrompt">
          <el-input v-model.trim="configContent.defaultPrompt" type="text" maxlength="20" :show-word-limit="true" class="w740" />
        </el-form-item>
        <!-- TODO: 固定 正方形 -->
        <el-form-item label="LOGO">
          <template>
            <my-upload ref="myupload" v-model="ImageShow" field="file" :width="300" :height="300" :url="uploadFile()" img-format="jpg" :accept="jpg" :lang-ext="langExt" @crop-success="cropSuccess" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail" />
            <div v-if="imgDataUrl === ''" class="add" @click="ImageShow = true" />
            <img v-else :src="imgDataUrl" class="upImages" @click="ImageShow = true" />
            <div>
              <el-link type="info" disabled>支持格式 jpg,bmp,png,webp,pic,ico,gif；</el-link>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="语音播报" prop="name">
          <el-switch v-model="configContent.voiceBroadcastBoolean" :active-color="switchActiveColor" />
          <!-- <el-checkbox :indeterminate="isIndeterminate"
                       v-model="checkAll"
                       @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="configContent.voiceBroadcast"
                             @change="handleCheckedChange">>
            <el-checkbox v-for="item in voiceBroadcastList"
                         :label="item"
                         :key="item">{{ item }}</el-checkbox>
          </el-checkbox-group>-->
        </el-form-item>
        <el-form-item label="轮播时间">
          <div v-for="(item, index) in playTime" :key="index">
            <el-time-picker class="dc-time-picker" v-model="playTime[index][0]" value-format="HH:mm:ss" :clearable="false" placeholder="开始时间" :picker-options="pickerOptionsStart(index)" />
            <el-time-picker class="dc-time-picker" v-model="playTime[index][1]" value-format="HH:mm:ss" :clearable="false" placeholder="结束时间" :picker-options="pickerOptionsEnd(index)" />
            <el-button v-if="index >= 1" class="delete-question" icon="el-icon-delete" @click="delOption(item)" />
            <div v-if="playTime.length < 3 && index === playTime.length - 1" class="add-question" @click="addOption">
              <i class="el-icon-plus" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="播放音量" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <el-time-picker v-model="configContent.volume[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" style="width:100%" />
                <el-select v-model="configContent.volume[index].Vol" placeholder="请选择音量" style="width:100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="亮度设置" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <el-time-picker v-model="configContent.luminance[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" style="width:100%" />
                <el-select v-model="configContent.luminance[index].Light" placeholder="请选择亮度" style="width:100%; margin-top: 10px">
                  <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- bug 812 -->
        <!-- <el-form-item label="展示模板" prop="name">
          <el-button round size="mini" @click="dialogVisible = true">选择模板</el-button>
          <el-row style="margin-top: 20px;">
            <el-col v-for="(o, index) in cardTemplateList.length" :key="o" style="width: 350px">
              <el-card v-if="
                  cardTemplateList[index].imgId === configContent.cardTemplate
                " :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <div style="text-align: center">
                  <img :src="cardTemplateList[index].imgUrl[0]" class="image" />
                  呼叫响应
                </div>
                <div style="text-align: center">
                  <img :src="cardTemplateList[index].imgUrl[1]" class="image" />
                  展示内容
                </div>
                <div style="margin-top: 10px; text-align: center; font-weight: bold">{{ cardTemplateList[index].imgId }}</div>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item> -->
        <el-form-item label="重启显示屏" prop="name">
          <el-button round type="primary" size="mini" @click="rebootEC()">重启</el-button>
        </el-form-item>
        <el-form-item label="定时重启" prop="name">
          <el-switch v-model="configContent.loopRestart" :active-color="switchActiveColor" :active-value="1" :inactive-value="0" />每天
          <el-time-picker v-model="configContent.restartTime" format="HH:mm" value-format="HH:mm" :clearable="false" :disabled="!configContent.loopRestart" class="w120" />时间，自动重启
        </el-form-item>
      </el-form>
      <el-row class="top-24" style="text-align: center">
        <el-button type="primary" @click.prevent.stop="saveConfig()">保存</el-button>
      </el-row>
      <el-dialog title="选择模板" :visible.sync="dialogVisible" width="70%">
        <div class="bedCardTemp">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in cardTemplateList.length" :key="o" :xs="24" :sm="12" :md="12" :lg="8" :xl="8" style="margin-bottom: 10px">
              <el-radio v-model="configContent.cardTemplate" :label="cardTemplateList[index].imgId">
                <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                  <div>
                    <img :src="cardTemplateList[index].imgUrl[0]" class="image" />
                  </div>
                  <div>
                    <img :src="cardTemplateList[index].imgUrl[1]" class="image" />
                  </div>
                  <div style="margin-top: 10px; text-align: center; font-weight: bold">{{ cardTemplateList[index].imgId }}</div>
                </el-card>
              </el-radio>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import "./main.css";
import configMixin from "./mixin";
import myUpload from "vue-image-crop-upload";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { selectDeptInfo, getDeptInfo } from "@/assets/wnms/utils/common";

export default {
  mixins: [configMixin],
  components: {
    "my-upload": myUpload,
    Treeselect,
  },
  data() {
    return {
      DeptInfo: {}, // 护理单元信息
      dataTree: [],

      jpg: ".jpg",
      langExt: {
        preview: "预览",
      },
      // 是否显示
      ImageShow: false,
      // logo Url
      imgDataUrl: "",
      // 弹窗是否显示
      dialogVisible: false,
      // 是否全选
      checkAll: false,
      // 全选状态
      isIndeterminate: true,
      // 时间框组件
      playTime: [["", ""]],
      // 配置内容
      configContent: {
        deptId: "",
        defaultPrompt: "请保持安静",
        logoUrl: "",
        voiceBroadcastBoolean: false,
        loopTime: [["", ""]],
        volume: [
          {
            Time: "08:00:00",
            Vol: "10",
          },
          {
            Time: "12:00:00",
            Vol: "8",
          },
          {
            Time: "14:00:00",
            Vol: "10",
          },
          {
            Time: "18:00:00",
            Vol: "6",
          },
        ],
        luminance: [
          {
            Time: "08:00:00",
            Light: "50",
          },
          {
            Time: "12:00:00",
            Light: "50",
          },
          {
            Time: "14:00:00",
            Light: "50",
          },
          {
            Time: "18:00:00",
            Light: "50",
          },
        ],
        cardTemplate: "1",
        loopRestart: 0,
        restartTime: "08:00",
      },
      orgInfo: {},
    };
  },
  mounted() {
    // 插件中无法支持类型选择。只能通过此方法
    this.$nextTick(() => {
      this.$refs.myupload.$refs.fileinput.accept =
        ".jpg,.bmp,.png,.webp,.pic,.ico,.gif";
    });
    this.getOrg();
  },
  methods: {
    async getOrg() {
      let res = await this.getIconConfig();
      // 获取机构名称和id
      this.orgInfo = res.status == 200 ? res.data : {};
    },
    onSelect(node, ins) {
      this.selectDeptId = node.deptId;
      this.getData();
      this.QuerycardTemplateList();
      this.QueryVoiceBroadcastList();
    },
    normalizer(node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined,
      };
    },
    /* 上传文件地址 */
    uploadFile() {
      return "/bmms/web-bm/file";
    },
    // 图片转Base64
    cropSuccess(imgDataUrl, field) {
      this.imgDataUrl = imgDataUrl;
    },

    /* 上传图片成功 */
    cropUploadSuccess(jsonData, field) {
      if (jsonData.status === 200) {
        this.configContent.logoUrl = jsonData.data.urlPath;
      }
    },

    /* 上传图片失败 */
    cropUploadFail(status, field) {
      if (status !== 200) {
        this.imgDataUrl = "";
        this.configContent.logoUrl = "";
        this.$message({
          type: "error",
          $message: "上传失败",
        });
      }
    },

    // 添加选项
    addOption() {
      // 增加数据
      this.playTime.push(["", ""]);
    },

    // 删除选项
    delOption(item) {
      var index = this.playTime.indexOf(item);
      if (index !== -1) {
        this.playTime.splice(index, 1);
      }
    },

    // 时间范围组件联动限制
    pickerOptionsStart(index) {
      return {
        selectableRange:
          (index !== 0
            ? this.playTime[index - 1][1] === ""
              ? this.playTime[0][1]
              : this.playTime[index - 1][1]
            : "00:00:00") +
          " - " +
          (this.playTime[index][1] === ""
            ? "23:59:59"
            : this.playTime[index][1]),
      };
    },
    pickerOptionsEnd(index) {
      return {
        selectableRange:
          (index !== 0
            ? this.playTime[index][0] === ""
              ? this.playTime[index - 1][1]
              : this.playTime[index][0]
            : this.playTime[index][0] === ""
            ? "00:00:00"
            : this.playTime[index][0]) +
          " - " +
          "23:59:59",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.bedCardTemp .el-radio {
  .el-radio__input {
    display: none;
  }

  &.is-checked .el-card {
    border: 1px solid blue;
  }
}

.el-form-item-left {
  .el-form-item {
    display: inline-flex;

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}

.add {
  border: 1px solid;
  width: 178px;
  height: 178px;
  color: #ccc;
  transition: color 0.25s;
  position: relative;
}

.add::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 80px;
  margin-left: -40px;
  margin-top: -5px;
  border-top: 10px solid;
}

.add::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  height: 80px;
  margin-left: -5px;
  margin-top: -40px;
  border-left: 10px solid;
}

.add:hover {
  color: #1890ff;
}
.delete-question {
  vertical-align: bottom;
}
.add-question {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 1.5em;
  padding: 0;
  color: #c4c4c4;
  text-align: center;
  vertical-align: bottom;
  border: 1px dashed #ddd;
  cursor: pointer;
}
.dc-time-picker {
  width: 190px;
}
.dc-time-picker input[type="text"] {
  width: 220px !important;
}
.upImages {
  width: 180px;
  height: 180px;
}
</style>
