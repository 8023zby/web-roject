<template>
  <div class="passport-imgUpload">
    <el-upload class="avatar-uploader" :on-success="uploadImage" :action="'/bmms/web-bm/file'" :data="param" :show-file-list="false" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/jpg,image/png,image/x-icon">
    <template v-if="imageObj.imageUrl">
      <div @mouseenter="seen = true" @mouseleave="seen = false" :class="imageObj.avatar">
        <img :src="imageObj.imageUrl" class="showImg">
        <div class="showBtn" v-show="seen">
          <div class="img-cz">
            <p style="border-right: 1px solid rgba(255,255,255,0.5)" class="ImgBtn" @click.stop="dialogVisible = true">
              <i class="el-icon-search" style="color: rgba(255,255,255,1); font-size: 18px;"></i>
            </p>
            <p class="ImgBtn" @click.stop="delImage">
              <i class="el-icon-delete" style="color: rgba(255,255,255,1); font-size: 18px;"></i>
            </p>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </template>
  </el-upload>
  <el-dialog :visible.sync="dialogVisible" class="passport-imgDialog" :modal="false" title="原图">
    <img :src="imageObj.imageUrl" style="max-width: 100%;max-height: 100%">
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LookImg',
  props: {
    imageObj: {
      type: Object,
      required: true
    },
    imgSize: { // 默认限制上传图片大小500kb
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      dialogVisible: false,
      seen: false,
      param: {},
      baseUrl: ''
    }
  },
  methods: {
    delImage () {
      this.imageObj.imageUrl = ''

      this.$emit('delImage')
    },
    beforeAvatarUpload (file) {
      let data = {
        picRoute: this.imageObj.picRoute,
        imgType: this.imageObj.imgType
      }

      let size = ''
      if (this.imgSize < 0.1) { // 如果小于0.1KB转化成B
        size = this.imgSize + 'B'
      } else if (this.imgSize < 0.1 * 1024) { // 如果小于0.1MB转化成KB
        size = this.imgSize + 'KB'
      } else if (this.imgSize < 0.1 * 1024 * 1024) { // 如果小于0.1GB转化成MB
        size = this.imgSize / (1024) + 'MB'
      } else { // 其他转化成GB
        size = this.imgSize / (1024 * 1024) + 'GB'
      }

      // 图片不能大于500k
      const isLt500K = file.size / 1024 < this.imgSize
      const testmsg = /^image\/(jpeg|png|jpg|x-icon)$/.test(file.type)
      if (!testmsg) {
        this.$message.error('请上传文件jpeg、jpg、png、ico格式!')
        return false
      }
      if (!isLt500K) {
        this.$message.error('上传图片大小不能超过' + size)
      }
      if (testmsg && isLt500K) {
        this.param.picRoute = data.picRoute
      }
      return testmsg && isLt500K
    },
    // 上传成功后
    uploadImage (response, file) {
      let status = response.status

      if (status === 200) {
        this.imageObj.imageUrl = response.data.urlPath
        this.$emit('callBackInfo')
      } else {
        this.$message.error('上传失败！')
      }
    }
  }
}
</script>
<style lang="scss">
  .passport-imgUpload{
    .avatar-uploader .el-upload {
      border: 1px dashed #CDD0D5;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      color: #CDD0D5;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
      color: #409EFF !important;
    }
    .avatar-uploader-icon {
      font-size: 24px;
      width: 110px;
      height: 110px;
      line-height: 110px;
      text-align: center;
    }
    .avatar {
      width: 110px;
      height: 110px;
      display: block;
    }
    .avatar_menu,.avatar_menu .showImg{
      width: 110px;
      height: 110px;
      border-radius:2px;
      background: #1e87f0;
    }
    .imgContent, .imgContent .showImg,.avatar,.avatar .showImg{
      width: 110px;
      height: 110px;
      border-radius:2px;
    }
    .showBtn{
      position: absolute;
      height: 100%;
      background:rgba(51,51,51,0.3);
      border-radius:2px;
      top: 0;
      width: 100%;
    }
    .img-cz{
      position: absolute;
      height: 30px;
      border-top: 1px solid rgba(255,255,255,0.5);
      width: 100%;
      bottom: 0;
      display: flex;
    }
    .ImgBtn{
      float: left;
      width: 50%;
    }
    .closeBtn{
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
    }
    .passport-imgDialog{
      .el-dialog__body{
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
<style scoped>

</style>
