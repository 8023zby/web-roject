<template>

  <el-container class="edit-page-new">
    <el-header :height="'48px'">
      <!--标题-->
      <div class="title">
        <slot name="title">
          菜单管理
        </slot>
      </div>
      <!--头部右侧按钮-->
      <div class="right-btn">
        <slot name="right_btn">
        </slot>
      </div>
    </el-header>
    <el-main>
      <!--主内容-->
      <slot name="main">
        <el-form ref="form" :model="form" :rules="rules" label-width="125px" class="from" label-position="right">
          <el-form-item label="上级菜单名称" v-if="(detail.type=='tadd')">
            <el-input class="elinput-300" v-model="form.parentName" disabled></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menuName">
            <el-input class="elinput-300" v-model="form.menuName"></el-input>
          </el-form-item>

          <el-form-item label="菜单标识" prop="menuCode">
            <el-input class="elinput-300" v-model="form.menuCode"></el-input>
          </el-form-item>
          <el-form-item label="菜单Icon" class="icon_main" prop="icon" v-if="(detail.type==='add' )||(detail.type==='edit' &&detail.row.level===1)">
            <el-col :span="3">
              <div class="upload_zm">
                <el-upload class="avatar-uploader" :action="images.actionUrl" :show-file-list="false" :on-success="beforeConfirmUpload" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
                  <img v-if="images.imageUrlConfirm" :src="images.imageUrlConfirm" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>选中</span>
              </div>
            </el-col>

            <el-col :span="6" v-if="form.menuFrom !== 'bedHead'">
              <div class="upload_zm">
                <el-upload class="avatar-uploader" :action="images.actionUrl" :show-file-list="false" :on-success="beforeCancelUpload" :before-upload="beforeAvatarUpload">
                  <img v-if="images.imageUrlCancel" :src="images.imageUrlCancel" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>取消</span>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input class="elinput-300" v-model="form.sort" type="Number" max="10" min="1"></el-input>
          </el-form-item>
          <el-form-item label="是否显示" prop="status">
            <el-radio v-model="form.status" :label="1">显示</el-radio>
            <el-radio v-model="form.status" :label="2">隐藏</el-radio>
          </el-form-item>

          <el-form-item label="跳转地址" :prop="form.menuFrom === 'bedHead'?'':
            detail.type==='add'?'pageUrl':detail.type=='tadd'?'':
            detail.type=='edit'&&detail.row.level==1?'pageUrl':''">
            <el-input v-model="form.pageUrl" class="elinput-300"></el-input>
          </el-form-item>

          <el-form-item label="备注">
            <el-input type="textarea" class="elinput-300" :rows="6" placeholder="请输入内容" v-model="form.remark" maxlength="200"></el-input>
          </el-form-item>
        </el-form>
      </slot>

      <!--底部按钮组-->
      <div class="footer-btn">
        <slot name="footer_btn">
          <el-button @click="backHandler">取消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="Save('form')">保存</el-button>
        </slot>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import BaseEditForm from "../common/BaseEditForm";
import * as api from "../../../api/wnms/bedSideMeun/index";
import mixins from "./mixins.js";

export default {
  mixins: [BaseEditForm, mixins],

  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data() {
    let form = this.initForm();
    let rules = this.initRules();
    let images = this.initImage();
    return {
      images: images,
      btnLoading: false,
      form: form,
      rules: rules
    };
  },

  mounted() {
    if (this.detail.type === "edit") {
      Object.assign(this.form, this.detail.row);

      let icon = JSON.parse(this.detail.row.icon);
      this.images.imageUrlConfirm = icon[0].path || "";
      this.images.imageUrlCancel = icon[1].path || "";

      this.images.imageUrlConfirmUrl = icon[0] || "";
      this.images.imageUrlCancelUrl = icon[1] || "";
      this.form.parentName = this.detail.row.menuName;
    } else if (this.detail.type === "tadd") {
      this.form.parentId = this.detail.row.id;
      this.form.parentName = this.detail.row.menuName;
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    upImageFun(data) {
      if (data.status === 200) {
        let { sourceFileName, urlPath } = data.data;
        return { sourceFileName, urlPath };
      }
    },

    // 选中
    beforeConfirmUpload(res, file) {
      this.images.imageUrlConfirm = URL.createObjectURL(file.raw);
      let { sourceFileName, urlPath } = this.upImageFun(res);
      this.images.imageUrlConfirmUrl = { name: sourceFileName, path: urlPath };
    },

    // 取消
    beforeCancelUpload(res, file) {
      this.images.imageUrlCancel = URL.createObjectURL(file.raw);
      let { sourceFileName, urlPath } = this.upImageFun(res);
      this.images.imageUrlCancelUrl = { name: sourceFileName, path: urlPath };
    },

    // 图片类型
    beforeAvatarUpload(file) {
      const isPng = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPng) {
        this.$message.error("上传图片只能是 png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isPng && isLt2M;
    },
    // 提交表单
    Save(form) {
      let arr = [];
      arr.push(this.images.imageUrlConfirmUrl);
      arr.push(this.images.imageUrlCancelUrl);

      this.form.icon = JSON.stringify(arr);

      // 提交保存
      this.submitHandler(form);
    },
    customSubmitHandler() {
      this.btnLoading = true;
      if (this.detail.type === "add" || this.detail.type === "tadd") {
        api
          .Add(this.form)
          .then(data => {
            this.submitSuccessHandler(data);
          })
          .finally(() => {
            // 提交时加载
            this.btnLoading = false;
          });
      } else {
        api
          .Edit(this.form)
          .then(data => {
            // 提交时加载
            this.submitSuccessHandler(data);
          })
          .finally(() => {
            // 提交时加载
            this.btnLoading = false;
          });
      }
    }
  }
};
</script>
<style     lang="scss">
@import "@/assets/wnms/css/self_common.scss";

.icon_main {
  .el-col {
    height: 8rem;
  }
  .upload_zm {
    text-align: center;
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 5rem;
      height: 5rem;
      line-height: 5rem;
      text-align: center;
    }
    .avatar {
      width: 5rem;
      height: 5rem;
      display: block;
    }
    span {
      display: inline-block;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
