<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content"> {{ detail.type==="add"?"添加模板":'修改模板' }}</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form passport-user-modify" style="width: 600px">
        <el-form :rules="rules" ref="form" class="from" label-width="130px" :model="form">
          <el-form-item label="模板名称:" prop="templateName">
            <el-input v-model.trim="form.templateName" class="elinput-300" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="内容方式:" prop="type">
            <!--展示类型 0-文字 2-音频 3-视频-->
            <el-radio-group v-model="form.type" @change="changeType">
              <el-radio :label="EMessageViewType.text">文字</el-radio>
              <el-radio :label="EMessageViewType.audio">音频</el-radio>
              <el-radio :label="EMessageViewType.video">视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="模板内容:" prop="templateContent" v-if="form.type === EMessageViewType.text">
            <el-input v-model.trim="form.templateContent" type="textarea" placeholder="请输入" rows="4" class="elinput-300" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item :label="EMessageViewTypeText[form.type] + '文件:'" v-else-if="isMediaType(form.type)" prop="fileUrl2">
            <upload-flied ref="uploadVideoFile" :data-name="getMediaInfo({messageType: form.type}).dataName" :accept="getMediaInfo({messageType: form.type}).accept" :limit="1" :filelist="getMediaInfo({messageType: form.type}).fileList" :Iscallback="getMediaInfo({messageType: form.type}).Iscallback" @uploadFlieds="uploadFlieds" @uploadFliedsChange="uploadFliedsChange" />
            <el-link type="info" disabled>
              <span v-show="form.type === EMessageViewType.audio">音频支持格式:mp3,wav,wma；</span>
              <span v-show="form.type === EMessageViewType.video">视频支持格式:mp4,avi,3gp,rmvb,wmv,mkv,mov,flv；</span>
            </el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="backHandler">取消</el-button>
      <el-button type="primary" @click="
          detail.type === 'edit' ? editHandler(detail.row.id) : addHandler()
        ">保存</el-button>
    </div>
  </div>

</template>

<script>
import BaseEditForm from '../../common/BaseEditForm';
import { deepMergeLeft } from '@/assets/wnms/utils';
import * as msgTemplateApi from '@/api/wnms//msgManage/msgTemplate';
import mixins from './mixins';
import uploadFlied from '@/components/wnms/Upload/uploadFileNew';

export default {
  components: { uploadFlied },
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
    const rules = this.initRules();
    return {
      form: form,
      rules: rules,
      getMediaInfo: this.getMedia(),
      isFileChange: false // 上传的附件是否有更改
    };
  },
  mounted () {
    // 点击的时候是add
    if (this.detail.type === 'add') {
      deepMergeLeft(this.form, this.initForm());
    } else {
      // 点击的时候是edit
      msgTemplateApi.Details(this.detail.row.templateId).then(res => {
        if (res.status === 200) {
          deepMergeLeft(this.form, res.data);
          if (this.isMediaType(res.data.type) && res.data.templateContent) {
            this.getMediaInfo({ fileList: [JSON.parse(res.data.templateContent)] });
            this.form.fileUrl2 = 1;
          }
        }
      });
    }

    this.$nextTick(() => {
      this.$refs['form'].clearValidate();
    });
  },
  methods: {
    changeType (v) {
      this.form.templateContent = '';
      this.form.fileUrl2 = '';
      this.getMediaInfo({ fileList: [] });
      this.$refs['form'].clearValidate(['fileUrl2', 'templateContent']);
      this.$forceUpdate();
    },
    // 附件改变时，回调
    uploadFliedsChange (res) {
      console.log("===cc");
      const _this = this;
      _this.isFileChange = true;
      if (res.type === 'del') {
        _this.form.templateContent = '';
        _this.form.fileUrl2 = '';
      } else if (res.type === 'change') {
        // 清除上传组件验证结果
        _this.$refs['form'].clearValidate(['fileUrl2']);
        _this.form.fileUrl2 = '1';
      }
    },
    // 文件上传
    uploadFlieds (res) {
      if (res.status !== 200) {
        return;
      }
      let _this = this;

      if (res.data === '') {
        _this.form.templateContent = '';
      } else {
        let R = {
          secondDuration: res.data.secondDuration,
          name: res.data.sourceFileName,
          url: res.data.urlPath,
          formatDuration: res.data.formatDuration,
          fileSizeB: res.data.fileSizeB
        };
        _this.form.templateContent = JSON.stringify(R);
        if (this.detail.type === 'edit') {
          setTimeout(() => {
            this.editSave();
          }, 500);
        } else {
          msgTemplateApi.Add(this.form).then(data => {
            this.submitSuccessHandler(data);
          }).catch(error => {
            console.log('添加失败！', error);
          });
        }
      }
    },
    // 获取护理单元的名字
    selectDeptName (id) {
      const selectname = this.nurseUnitId.find(item => {
        return item.value === id;
      });
      this.form.deptName = selectname.label;
    },
    /**
       * @添加
       */
    addHandler () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isMediaType(this.form.type)) {
            this.$refs.uploadVideoFile.submit();
          } else {
            msgTemplateApi.Add(this.form).then(data => {
              this.submitSuccessHandler(data);
            }).catch(error => {
              console.log('添加失败！', error);
            });
          }
        } else {
          return false;
        }
      });
    },
    /**
       * @编辑
       */
    editHandler (param) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 1、只改了名称
          if (!this.isFileChange) {
            this.editSave();
          } else if (this.isFileChange) {
            this.$refs.uploadVideoFile.submit();
          }
        } else {
          return false;
        }
      });
    },
    // 编辑保存
    editSave () {
      console.log('编辑保存：\n', this.isFileChange, JSON.stringify(this.form));
      msgTemplateApi.Edit(this.form).then(data => {
        this.submitSuccessHandler(data);
      });
    },
    customSubmitHandler () {
      if (this.detail.type === 'add') {
        msgTemplateApi.Add(this.form).then(data => {
          this.submitSuccessHandler(data);
        });
      } else {
        msgTemplateApi.Edit(this.form).then(data => {
          this.submitSuccessHandler(data);
        });
      }
    }
  }
}
</script>
