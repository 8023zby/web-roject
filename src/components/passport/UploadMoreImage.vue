<template>
  <div class="passport-imgUpload-more">
    <el-upload v-for="(item, index) in list" :key="index"
               :class="{ 'avatar-uploader': true, 'passport-uploader-img': item.imageUrl}"
               :on-success="uploadImage"
               :action="'/bmms/web-bm/file/scale'"
               :data="param"
               :show-file-list="false"
               :before-upload="(file, fileList) => {beforeAvatarUpload(file, fileList, index)}"
               accept="image/jpeg,image/jpg,image/png,image/x-icon">
    <template>
      <div @mouseenter="showThis(index)" @mouseleave="hidThis(index)" :class="imageObj.avatar">
        <img :src="item.imageUrl" class="showImg">
        <div class="showBtn" :ref="'czBtn'+index" style="display: none;">
          <div>
            <p class="ImgBtn" @click.stop="showPic(item.imageUrl)">查看</p>
            <p class="ImgBtn">修改</p>
          </div>
        </div>
        <div class="closeBtn" :ref="'closeBtn'+index" style="display: none;">
          <p class="el-icon-close" @click.stop="delImage(index)"></p>
        </div>
        <div class="passport-wfsb" v-show="item.status===2">
          <img src="/static/passport/img/icon_wfsb.png">
        </div>
      </div>
    </template>
  </el-upload>
  <el-upload v-show="list.length < 3"
             :class="{ 'avatar-uploader': true}"
             :on-success="uploadImage"
             :action="'/bmms/web-bm/file/scale'"
             :data="param"
             :show-file-list="false"
             :before-upload="(file, fileList) => {beforeAvatarUpload(file, fileList, '')}"
             accept="image/jpeg,image/jpg,image/png,image/x-icon">
    <div class="passport-add-img">
      上传图片
    </div>
  </el-upload>
  <el-dialog width="580px" :visible.sync="dialogVisible" class="passport-imgDialog">
    <img :src="imageUrl" style="max-width: 100%;max-height: 600px; padding-bottom: 20px;">
  </el-dialog>
  </div>
</template>

<script>
import { MsgShow } from '../../assets/passport/js/Message'
import UserFace from '../../assets/passport/mixins/UserFace'
export default {
  mixins: [UserFace],
  name: 'LookImg',
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
      baseUrl: '',
      imageUrl: '',
      imgIndex: '',
      list: []
    }
  },
  methods: {
    // 显示操作
    showThis (index) {
      this.$refs['closeBtn' + index][0].style.display = 'block'
      this.$refs['czBtn' + index][0].style.display = 'block'
    },
    // 隐藏操作
    hidThis (index) {
      this.$refs['closeBtn' + index][0].style.display = 'none'
      this.$refs['czBtn' + index][0].style.display = 'none'
    },
    delImage (index) {
      this.$confirm('是否将此图片删除?', '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        if (this.imageObj.fromWhere && this.imageObj.fromWhere === 'face') {
          this.deleteFaceData(index)
        } else {
          this.list.splice(index, 1)
        }
      })
    },
    // 查看图片
    showPic (data) {
      this.imageUrl = data
      this.dialogVisible = true
    },
    beforeAvatarUpload (file, fileList, index) {
      this.imgIndex = index
      let data = {
        picRoute: this.imageObj.picRoute,
        imgType: this.imageObj.imgType
      }
      // 图片不能大于500k
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
        if (this.imageObj.fromWhere && this.imageObj.fromWhere === 'face') {
          if (this.imgIndex === '') {
            this.saveFaceData(response.data.urlPath)
          } else {
            this.updateFaceData(response.data.urlPath)
          }
        } else {
          if (this.imgIndex === '') {
            this.list.push({
              imageUrl: response.data.urlPath
            })
          } else {
            this.list.splice(this.imgIndex, 1, {
              imageUrl: response.data.urlPath
            })
          }
        }
      } else {
        MsgShow('error', '上传失败！')
      }
    }
  }
}
</script>
<style lang="scss">
  .passport-imgUpload-more{
    .avatar-uploader{
      width: 110px;
      height: 110px;
      float: left;
      margin-left: 20px;
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
  .passport-wfsb {
    position: absolute;
    width: 80px;
    height: 70px;
    top: 20px;
    right: 20px;
  }
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
