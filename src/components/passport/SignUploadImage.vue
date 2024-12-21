<template>
  <div class="passport-imgUpload-sign">
    <el-upload :class="{ 'avatar-uploader': true, 'passport-uploader-img': imageObj.imageUrl}" :on-success="uploadImage" :action="'/bmms/web-bm/file/scale'" :data="param" :show-file-list="false" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/jpg,image/png,image/x-icon">
    <template v-if="imageObj.imageUrl">
      <div @mouseenter="seen = true" @mouseleave="seen = false" :class="imageObj.avatar">
        <img :src="imageObj.imageUrl" class="showImg">
        <div class="showBtn">
          <div v-show="seen">
            <p class="ImgBtn" @click.stop="dialogVisible = true">查看</p>
            <p class="ImgBtn">修改</p>
          </div>
        </div>
        <div class="closeBtn" v-show="seen">
          <p class="el-icon-close" @click.stop="delImage"></p>
        </div>
        <!--<div class="showBtn" v-show="seen">
          <div class="img-cz">
            <p style="border-right: 1px solid rgba(255,255,255,0.5)" class="ImgBtn" @click.stop="dialogVisible = true">
              <i class="el-icon-search" style="color: rgba(255,255,255,1); font-size: 18px;"></i>
            </p>
            <p class="ImgBtn" @click.stop="delImage">
              <i class="el-icon-delete" style="color: rgba(255,255,255,1); font-size: 18px;"></i>
            </p>
          </div>
        </div>-->
      </div>
    </template>
    <div v-else class="passport-add-img">
      上传图片
    </div>
  </el-upload>
  <el-dialog width="580px" :visible.sync="dialogVisible" class="passport-imgDialog">
    <img :src="imageObj.imageUrl" style="max-width: 100%;max-height: 600px; padding-bottom: 20px;">
  </el-dialog>
  </div>
</template>

<script>
import UserSign from '../../assets/passport/mixins/UserSign'
import { MsgShow } from '../../assets/passport/js/Message'
export default {
  mixins: [UserSign],
  name: 'user-sign',
  props: {
    imageObj: {
      type: Object,
      required: true
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
      this.$confirm('是否将此图片删除?', '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        if (this.imageObj.fromWhere && this.imageObj.fromWhere === 'sign') {
          this.deleteFaceData()
        } else {
          this.imageObj.imageUrl = ''
        }
      })
    },
    beforeAvatarUpload (file) {
      let data = {
        picRoute: this.imageObj.picRoute,
        imgType: this.imageObj.imgType
      }
      // 图片不能大于500k
      // let isLt500K = file.size / 1024 < 500
      let isLt500K = true
      const testmsg = /^image\/(jpeg|png|jpg|x-icon)$/.test(file.type)
      /* if (!this.imageObj.fileSize) {
        if (!isLt500K) {
          this.$message.error('上传图片大小不能超过500kb!')
        }
      } else {
        isLt500K = true
      } */
      if (!testmsg) {
        this.$message.error('请上传文件jpeg、jpg、png、ico格式!')
        return false
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
        if (this.imageObj.fromWhere && this.imageObj.fromWhere === 'sign') {
          if (this.biometricId !== '') {
            this.updateFaceData(response.data.urlPath)
          } else {
            this.saveFaceData(response.data.urlPath)
          }
        } else {
          this.imageObj.imageUrl = response.data.urlPath
        }
      } else {
        MsgShow('error', '上传失败！')
      }
    }
  }
}
</script>
<style lang="scss">
  .passport-imgUpload-sign{
    .avatar-uploader{
      width: 110px;
      height: 110px;
    }
    .passport-uploader-img{
      border: 1px solid #DCDFE6;
    }
    .avatar-uploader .el-upload {
      cursor: pointer;
      position: relative;
      overflow: hidden;
      color: #CDD0D5;
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
      bottom: 0px;
      left: 0;
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      border-radius:0 0 2px 2px;
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
      background:rgba(51,51,51,0.3);
    }
    .closeBtn{
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      color: #999999;
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
  .passport-add-img {
    border: 1px dashed #DCDFE6;
    width: 108px;
    height: 108px;
    line-height: 164px;
    text-align: center;
    color: #cccece;
    position: relative;
    cursor: pointer;
    border-radius: 0;
  }
  .passport-add-img::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 36%;
    width: 25px;
    margin-left: -11px;
    border-top: 3px solid #b7b7b7;
  }
  .passport-add-img::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 36%;
    height: 25px;
    margin-top: -11px;
    border-left: 3px solid #b7b7b7;
  }
  .passport-add-img:hover,.passport-add-img:focus{
    border: 1px dashed #1e87f0;
  }
  .passport-uploader-img:hover,.passport-uploader-img:focus {
    border: 1px solid #1e87f0;
  }
</style>
