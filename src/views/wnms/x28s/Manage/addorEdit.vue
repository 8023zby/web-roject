
<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content"> {{ detail.type==="add"?"新建素材":'修改素材' }}</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 90%">
        <el-form ref="form" :model="form" :rules="rules" label-width="125px">
          <el-form-item label="素材名称" prop="materialName">
            <el-input v-model.trim="form.materialName" placeholder="请输入素材名称" class="elinput-300" />
          </el-form-item>
          <el-form-item label="是否轮播">
            <el-switch :active-value="1" :inactive-value="0" v-model="form.isLoop"></el-switch>
          </el-form-item>

          <el-form-item class="form_item_x28s" label="定时播放时间" v-for="(item, index) in form.playTime" :key="'playTime-'+index" :prop="'playTime.' + index + '.playTime'" :rules="rules.playTime">
            <el-time-picker placeholder="任意时间点" value-format="HH:mm" v-model="item.playTime" format="HH:mm" class="elinput-300"></el-time-picker>

            <el-button type="primary" style="margin-left:20px" class="btn_add" icon="el-icon-plus" title="添加" circle @click="addptime" />
            <el-button class="btn_del" type="danger" v-if="index>0" icon="el-icon-minus" title="删除" circle @click="delptime(item, index)" />
          </el-form-item>

          <el-form-item label="素材类型">
            <el-radio-group v-model="form.materialType" @change="changeMateriaType">
              <el-radio :label="0">图文</el-radio>
              <el-radio :label="1">视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="素材视频" v-if="cutype.video" prop="materialContent">
            <upload-flied ref="uploadVideoFile" :data-name="video.dataName" :accept="video.accept" :limits="video.limit" :filelist="video.fileList" @uploadFlieds="uploadFlieds" />
            <el-link type="info" disabled>视频支持格式 mp4,avi,3gp,rmvb,wmv,mkv,mov,flv；</el-link>
          </el-form-item>
          <el-form-item label="素材正文" prop="materialContent" v-if="cutype.content">
            <Editor ref="editor" v-model="form.materialContent" style="height:28rem" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="backHandler">取消</el-button>
      <el-button type="primary" @click="submit('form')">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseEditForm from "../../common/BaseEditForm";
import { deepMergeLeft } from "@/assets/wnms/utils";
import * as csmsManageApi from "../api/csmsManage";
import Editor from "../components/QuillEditor/Editor";
import uploadFlied from "../components/Upload/uploadFlied";

import mixins from "./mixins";

export default {
  components: { Editor, uploadFlied },
  mixins: [BaseEditForm, mixins],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },

  data() {
    const form = this.initForm();
    const rules = this.initRules();
    const video = this.initVideo();
    return {
      video: video,
      form: form,
      rules: rules,
      cutype: {
        video: false,
        content: true
      },
      cudeptid: ""
    };
  },

  mounted() {
    // 点击的时候是add
    if (this.detail.type === "add") {
      deepMergeLeft(this.form, this.initForm());
      this.form.deptId = this.detail.selectDeptId;
      this.cudeptid = this.detail.selectDeptId;
    } else {
      // 点击的时候是edit
      csmsManageApi.Details(this.detail.row.screenId).then((res) => {
        if (res.status === 200) {
          let data = {
            screenId: res.data.screenId,
            materialName: res.data.materialName,
            materialType: res.data.materialType,
            deptId: res.data.deptId,
            playTime: res.data.playTime || [{ playTime: "" }],
            isLoop: res.data.isLoop,
            materialContent: res.data.materialContent,
            materialPort: res.data.materialPort
          };

          if (res.data.materialType === 1 && res.data.materialContent !== "") {
            this.video.fileList = [JSON.parse(res.data.materialContent)] || [];
          }
          this.changeMateriaType(res.data.materialType, "1");

          // 获取deptid
          this.cudeptid = data.deptId;
          deepMergeLeft(this.form, data);
        }
      });
    }
    this.$nextTick(() => {
      this.$refs["form"].clearValidate();
    });
  },
  methods: {
    ClearForm(fields) {
      let _field = this.$refs["form"].fields;
      _field.map((i) => {
        if (i.prop === fields) {
          i.resetField();
          return false;
        }
      });
    },
    changeMateriaType(v, t = 0) {
      switch (v) {
        case 0:
          this.cutype.video = false;
          this.cutype.content = true;
          if (t === 0) {
            this.ClearForm("materialContent");
          }
          break;
        case 1:
          this.cutype.video = true;
          this.cutype.content = false;
          if (t === 0) {
            this.ClearForm("materialContent");
          }
          break;
      }
      this.form.materialContent = "";
    },
    // 上传回调
    uploadFlieds(data) {
      if (data.data === "") {
        console.log(this.form.materialContent);
        let filed = JSON.parse(this.form.materialContent);
        // 调用删除接口
        csmsManageApi.Del({ path: filed.url }).then((res) => {
          if (res.status === 200) {
          }
        });
      }
      this.form.materialContent = data.data;
    },
    submit(formName) {
      let pysize = new Set(this.form.playTime.map((i) => i.playTime)).size;
      let pylength = this.form.playTime.length;
      if (pysize !== pylength) {
        this.$message({
          type: "info",
          message: "定时播放时间不允许有重复时间！"
        });
        return false;
      }
      this.submitHandler(formName);
    },
    addptime() {
      if (this.form.playTime.length === 3) {
        this.$message({
          type: "info",
          message: "最多只能添加3组！"
        });
        return false;
      }
      this.form.playTime.push({
        playTime: ""
      });
    },
    delptime(item, index) {
      this.form.playTime.splice(index, 1);
    },
    // 获取护理单元的名字
    selectDeptName(id) {
      const selectname = this.nurseUnitId.find((item) => {
        return item.value === id;
      });
      this.form.deptName = selectname.label;
    },
    customSubmitHandler() {
      if (this.detail.type === "add") {
        csmsManageApi.Add(this.form).then((data) => {
          this.submitSuccessHandler(data);
        });
      } else {
        csmsManageApi.Edit(this.form).then((data) => {
          this.submitSuccessHandler(data);
        });
      }
    },
    submitSuccessHandler(data) {
      if (data.status === 200) {
        this.optionSuccessHandler();
        if (this.cudeptid == "") {
          this.optionSuccessHandler("error", "无法获取科室！！！！");
        }
        this.backHandler();
      }
    },
    backHandler() {
      let data = { deptId: this.cudeptid, type: "list" };
      this.$emit("option-changed", "list", data);
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/wnms/css/self_common.scss";
</style>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.btn_add,
.btn_del {
  font-size: 14px;
  height: 2.1rem;
  min-width: 0px;
}

.btn-area {
  padding: 20px 0px 10px 0px;
}
.query-area > div {
  margin-right: 50px;
}

.inputwidth {
  width: 30rem;
}
.textarea {
  width: 30rem;
}
</style>
