<!--LED液晶显示屏公告-->
<template>
  <div class="typt-list-main" v-loading.fullscreen.lock="loading" :element-loading-text="form.materialType===1&&'文件上传中（'+percentProgress+'%)'" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content"> {{ detail.type==="add"?"添加":'修改' }}</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form passport-user-modify">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-form-item label="公告名称" prop="materialName">
            <el-input v-model.trim="form.materialName" placeholder="请输入公告名称" class="elinput-300" />
          </el-form-item>
          <el-form-item label="播放方式">
            <el-radio-group v-model="form.isLoop">
              <el-radio :label="1">轮播</el-radio>
              <el-radio :label="0">定时播放</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="form.isLoop === 0">
            <el-form-item class="form_item_x28s" label="定时播放时间" v-for="(item, index) in form.playTime" :key="'playTime-'+index" :prop="'playTime.' + index + '.playTime'" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
              <el-time-picker placeholder="任意时间点" value-format="HH:mm" v-model="item.playTime" format="HH:mm" class="elinput-300"></el-time-picker>
              <el-button type="primary" style="margin-left:20px" class="btn_add" icon="el-icon-plus" title="添加" circle @click="addptime" />
              <el-button class="btn_del" type="danger" v-if="index>0" icon="el-icon-minus" title="删除" circle @click="delptime(item, index)" />
            </el-form-item>
          </div>

          <el-form-item label="公告类型">
            <el-radio-group v-model="form.materialType" @change="changeMateriaType">
              <el-radio :label="0">图文</el-radio>
              <el-radio :label="1">视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="starStyle">
            <el-form-item label="公告视频" v-if="cutype.video" prop="materialContent">
              <upload-flied ref="uploadVideoFile" action="#" :data-name="video.dataName" :accept="video.accept" :limits="video.limit" :file-list="video.fileList" @uploadFlieds="uploadFlieds" />
              <el-link type="info" disabled>视频支持格式 mp4,avi,3gp,rmvb,wmv,mkv,mov,flv；</el-link>
            </el-form-item>
            <el-form-item label="公告内容" prop="materialContent" v-if="cutype.content">
              <Editor ref="editor" v-model="form.materialContent" style="height:28rem" />
            </el-form-item>
          </div>
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
import * as csmsManageApi from "@/api/wnms/msgManage/csmsManage";
import Editor from "@/views/wnms/x28s/components/QuillEditor/Editor";
import uploadFlied from "@/views/wnms/x28s/components/Upload/uploadFlied";

import mixins from "@/views/wnms/x28s/Manage/mixins";
let timer = null, formData = null
export default {
  components: { Editor, uploadFlied },
  mixins: [BaseEditForm, mixins],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },

  data () {
    const form = this.initForm();
    const rules = this.initRules('公告名称');
    const video = this.initVideo();
    return {
      video: video,
      form: form,
      rules: rules,
      cutype: {
        video: false,
        content: true
      },
      cudeptid: "",
      percentProgress: 0,
      loading: false
    };
  },

  mounted () {
    // 点击的时候是add
    if (this.detail.type === "add") {
      deepMergeLeft(this.form, this.initForm());
      this.form.deptId = this.detail.selectDeptId;
      this.cudeptid = this.detail.selectDeptId;
    } else {
      // 点击的时候是edit
      csmsManageApi.Details(this.detail.row.screenId).then(res => {
        if (res.status === 200) {
          let data = {
            screenId: res.data.screenId,
            materialName: res.data.materialName,
            materialType: res.data.materialType,
            deptId: res.data.deptId,
            playTime: res.data.playTime || [{ playTime: "" }],
            isLoop: res.data.isLoop,
            materialContent: res.data.materialContent,
            materialPort: res.data.materialPort,
            multipartFile: res.data.materialContent //编辑的时候，multipartFile默认随意赋值，只有点击了删除才会放新上传的file文件
          };

          if (res.data.materialType === 1 && res.data.materialContent !== "") {
            this.video.fileList = [JSON.parse(res.data.materialContent)] || [];
          }
          this.changeMateriaType(res.data.materialType, "1");

          // 获取deptid
          this.cudeptid = data.deptId;
          deepMergeLeft(this.form, data);
          //编辑时默认视频文件无须新上传，只有点击了上传操作，才会修正为新上传
          this.form.isNew = 0
        }
      });
    }
    this.$nextTick(() => {
      this.$refs["form"].clearValidate();
    });
  },
  methods: {
    ClearForm (fields) {
      let _field = this.$refs["form"].fields;
      _field.map(i => {
        if (i.prop === fields) {
          i.resetField();
        }
      });
    },
    changeMateriaType (v, t = 0) {
      switch (v) {
        case 0:
          this.cutype.video = false;
          this.cutype.content = true;
          if (t === 0) {
            this.ClearForm("materialContent");
            this.form.multipartFile = null
          }
          break;
        case 1:
          this.cutype.video = true;
          this.cutype.content = false;
          if (t === 0) {
            this.ClearForm("materialContent");
            this.form.multipartFile = null
          }
          break;
      }
    },
    // 更新数据
    uploadFlieds (data) {
      console.log('2321312', data)
      this.form.multipartFile = data
      this.form.isNew = 1
    },
    async submit (formName) {
      let pysize = new Set(this.form.playTime.map(i => i.playTime)).size;
      let pylength = this.form.playTime.length;
      if (pysize !== pylength) {
        this.$message({
          type: "warning",
          message: "定时播放时间不允许有重复时间！"
        });
        return false;
      }
      if (this.form.materialType === 1 && this.form.multipartFile === null) {
        this.$message({
          type: "warning",
          message: "请上传公告视频！"
        });
        return false;
      }
      this.submitHandler(formName);
    },
    addptime () {
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
    delptime (item, index) {
      this.form.playTime.splice(index, 1);
    },
    // 获取护理单元的名字
    selectDeptName (id) {
      const selectname = this.nurseUnitId.find(item => {
        return item.value === id;
      });
      this.form.deptName = selectname.label;
    },
     async customSubmitHandler () {
      // 表单验证通过之后，后端统一进行文件上传,前端开始加载
      this.loading = true
      let _uuid = new Date().getTime() + Math.floor(Math.random() * 10) // 生成一个随机数
      // 将form数据转化为formdata类型
      this.parseFormToFormData()
      if (this.detail.type === "add") {
        csmsManageApi.Add({ 'formData': formData, 'uuid': _uuid }).then(data => {
          this.submitSuccessHandler(data);
        }).finally(res => {
          this.loading = false
          this.clearTimer()
        });
      } else {
        csmsManageApi.Edit({ 'formData': formData, 'uuid': _uuid }).then(data => {
          this.submitSuccessHandler(data);
        }).finally(res => {
          this.loading = false
          this.clearTimer()
        });
      }
      //上传视频进度查询
      timer = setInterval(() => {
        this.searchProgess(_uuid)
      }, 1000)
    },
    parseFormToFormData () {
      formData = new window.FormData()
      let keys = Object.keys(this.form)
      keys.map(key => {
        if (key === 'playTime') {
          formData.append(key, JSON.stringify(this.form[key]))
        } else {
          formData.append(key, this.form[key])
        }
        console.log('formData[' + key + ']', formData.get(key))
      })
    },
     searchProgess (_uuid) {
      csmsManageApi.searchProgess({ uuid: _uuid }).then((res) => {
        this.percentProgress = res.data
        if (this.percentProgress === 100) {
          this.clearTimer()
        }
      })
    },
    submitSuccessHandler (data) {
      if (data.status === 200) {
        this.optionSuccessHandler();
        this.backHandler();
      }
    },
    backHandler () {
      this.$emit("option-changed", "index", this.detail);
    },
    //清除计时器
    clearTimer () {
      if (!timer) return
      clearInterval(timer)
      timer = null
    },
     async tempNameIsRepeat (rule, value, callback) {
      let flag = null // null代表接口异常
      await csmsManageApi.selectContentName({ deptId: this.form.deptId, materialName: value, screenId: this.form.screenId }).then(res => {
        flag = res.data // true 代表不重复可以保存   false代表重复
      }).catch(() => {
        flag = null
      })
      if (flag === null) {
        callback(new Error('接口异常'));
      } else if (flag === false) {
        callback(new Error('公告名称不允许重复'));
      } else {
        callback()
      }
    }
  },
  destroyed () {
    this.clearTimer()
  }
};
</script>
<style lang="scss">
</style>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.starStyle {
  position: relative;
  &::before {
    content: "*";
    color: #f56c6c;
    position: absolute;
    top: 10px;
    left: 57px;
  }
}
.typt-add-form {
  padding-right: 20px;
}
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
