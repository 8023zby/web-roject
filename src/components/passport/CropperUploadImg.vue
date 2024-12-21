<template>
  <div class="passport-crop-img">
    <el-dialog
      title="上传图片"
      :visible.sync="showCropper"
      class="cropper-dialog passport-cropper-dialog"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="main-content">
        <vue-cropper
          v-if="showCropper"
          id="passport-corpper"
          ref="cropper"
          :class="{'corpper-warp':showCropper}"
          v-bind="option"
          :can-move="option.canMove"
          :outputSize="option.size"
          :original="option.original"
          @realTime="realTime"
        />
       <div class="passport-tool-div">
         <div class="passport-tool-div-item">
           <i class="el-icon-zoom-in iconSize" @click="changeScale(1)"></i>
         </div>
         <div class="passport-tool-div-item">
           <i class="el-icon-zoom-out iconSize" @click="changeScale(-1)"></i>
         </div>
         <div class="passport-tool-div-item">
           <i class="el-icon-refresh-right iconSize" @click="turnRight"></i>
         </div>
         <div class="passport-tool-div-item">
           <i class="el-icon-refresh-left iconSize" @click="turnLeft"></i>
         </div>
       </div>
        <div class="passport-tool-size-div">
          <div class="passport-tool-select">
            <div class="passport-tool-title">固定尺寸</div>
            <div>
              <el-select class="size-select" @change="changeImgSize" v-model="imgSize">
                <el-option v-for="item in sizeData" :label="item.label" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="passport-tool-width">
            <div class="passport-tool-title">宽度</div>
            <div>
              <el-input @blur="changeSize" :disabled="imgDisabled" style="width: 72px" v-model="imgWidth" autocomplete="off"></el-input>&nbsp;px
            </div>
          </div>
          <div class="passport-tool-height">
            <div class="passport-tool-title">高度</div>
            <div>
              <el-input @blur="changeSize" :disabled="imgDisabled" style="width: 72px" v-model="imgHeight" autocomplete="off"></el-input>&nbsp;px
            </div>
          </div>
          <div class="passport-tool-default">
            <span @click="goDefault">恢复默认</span>
          </div>
          <el-button class="passport-tool-btn" size="small" type="primary" :loading="addVis" @click="configImage">完成</el-button>
        </div>
      </div>
      <!--<span slot="footer" class="dialog-footer">
          <el-button class="cancel-btn" size="small" @click.native="showCropper=false">取消</el-button>
          <el-button size="small" type="primary" :loading="addVis" @click="configImage">确认</el-button>
        </span>-->
    </el-dialog>
    <input
      :id="id"
      type="file"
      style="display: none"
      name="single"
      accept="image/*"
      @change="onChange($event)"
    />
    <div class="passport-uploader-img" v-if="imageObj.imageUrl&&imageObj.imageUrl!==null">
      <template >
        <div @mouseenter="seen = true" @mouseleave="seen = false" class="passport-up-img">
          <img :src="imageObj.imageUrl" class="showImg">
          <div class="showBtn">
            <div v-show="seen">
              <p class="ImgBtn" @click.stop="dialogVisible = true">查看</p>
              <p class="ImgBtn" @click="handleOpenFile">修改</p>
            </div>
          </div>
          <div class="closeBtn" v-show="seen">
            <p title="删除" style="cursor: pointer;" class="el-icon-close" @click="delImage"></p>
          </div>
          <el-dialog width="580px" :visible.sync="dialogVisible" class="passport-look-imgDialog" append-to-body>
            <img style="max-width: 60%;max-height: 60%" :src="imageObj.imageUrl" alt="">
          </el-dialog>
        </div>
      </template>
    </div>
    <div v-else class="passport-add-img" @click="handleOpenFile">
      上传图片
    </div>
  </div>
</template>

<script>
// 上传文件组件
import { VueCropper } from 'vue-cropper'
import { readFile } from '../../assets/passport/js/upload'
import { MsgShow } from '../../assets/passport/js/Message'
import UserSign from '../../assets/passport/mixins/UserSign'
import axios from 'axios'
import { AxiosApi } from '../../api/passport/http'
export default {
  components: {
    VueCropper
  },
  mixins: [UserSign],
  props: {
    imageObj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      isCompress: true, // 是否压缩
      compress: 0.7, // 压缩率
      addVis: false,
      valueSlider: 1,
      dialogVisible: false,
      seen: false,
      option: {
        img: '', // 裁剪图片的地址  (默认：空)
        info: false, // 裁剪框的大小信息
        canScale: true, // 图片是否允许滚轮缩放
        outputSize: 1, // 裁剪生成图片的质量  (默认:1)
        full: true, // 是否输出原图比例的截图 选true生成的图片会非常大  (默认:false)
        outputType: 'jpeg', // 裁剪生成图片的格式  (默认:jpg)
        canMove: true, // 上传图片是否可以移动  (默认:true)
        original: false, // 上传图片按照原始比例渲染  (默认:false)
        canMoveBox: true, // 截图框能否拖动  (默认:true)
        autoCrop: true, // 是否默认生成截图框  (默认:false)
        autoCropWidth: 150, // 默认生成截图框宽度  (默认:80%)
        autoCropHeight: 150, // 默认生成截图框高度  (默认:80%)
        fixedBox: false, // 固定截图框大小 不允许改变  (默认:false)
        fixed: false, // 是否开启截图框宽高固定比例  (默认:true)
        fixedNumber: [1, 1], // 截图框比例  (默认:[1:1])
        enlarge: 1
      },
      id: 'cropper-input-' + +new Date(),
      loading: false,
      showCropper: false,
      fileName: '',
      fileNames: null,
      previews: {},
      sizeData: [{
        id: 0,
        label: '无'
      },
      {
        id: 1,
        label: '一寸'
      },
      {
        id: 2,
        label: '两寸'
      },
      {
        id: 3,
        label: 'i系列专用'
      }],
      imgSize: 0,
      imgWidth: 150,
      imgHeight: 150,
      imgDisabled: false
    }
  },
  watch: {
    // 滑块
    valueSlider (newVal, oldVal) {
      if (newVal > oldVal) {
        this.changeScale(1)
      } else {
        this.changeScale(-1)
      }
    }
  },

  methods: {
    // 初始化值
    initValue () {
      this.imgSize = 0
      this.imgDisabled = false
      this.option.autoCropWidth = 150
      this.option.autoCropHeight = 150
      this.imgWidth = 150
      this.imgHeight = 150
    },
    // 切换尺寸
    changeSize () {
      if (!(/(^[1-9]\d*$)/.test(this.imgWidth))) {
        MsgShow('error', '宽度必须为正整数!', 3000)
        this.imgWidth = 150
        return
      }
      if (!(/(^[1-9]\d*$)/.test(this.imgHeight))) {
        MsgShow('error', '高度必须为正整数!', 3000)
        this.imgHeight = 150
        return
      }
      if (this.imgWidth > 480) {
        MsgShow('error', '宽度不能超过480px!', 3000)
        this.imgWidth = 480
      }
      if (this.imgHeight > 220) {
        MsgShow('error', '高度不能超过220px!', 3000)
        this.imgHeight = 220
      }
      this.option.autoCropWidth = this.imgWidth
      this.option.autoCropHeight = this.imgHeight
    },
    // 切换尺寸
    changeImgSize () {
      if (this.imgSize === 1) {
        this.imgWidth = 98
        this.imgHeight = 137
        this.option.autoCropWidth = 98
        this.option.autoCropHeight = 137
        this.imgDisabled = true
      } else if (this.imgSize === 2) {
        this.imgWidth = 135
        this.imgHeight = 200
        this.option.autoCropWidth = 135
        this.option.autoCropHeight = 200
        this.imgDisabled = true
      } else if (this.imgSize === 3) {
        this.imgWidth = 155
        this.imgHeight = 211
        this.option.autoCropWidth = 155
        this.option.autoCropHeight = 211
        this.imgDisabled = true
      } else {
        this.imgDisabled = false
        this.imgWidth = 150
        this.imgHeight = 150
        this.option.autoCropWidth = 150
        this.option.autoCropHeight = 150
      }
    },
    // 恢复默认
    goDefault () {
      this.initValue()
      this.$refs.cropper.refresh()
    },
    // 旋转
    turnRight () {
      this.$refs.cropper.rotateRight()
    },
    // 旋转
    turnLeft () {
      this.$refs.cropper.rotateLeft()
    },
    // 实时预览函数
    realTime (data) {
      this.previews = data
    },
    changeScale (num) {
      // 图片缩放
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 打开文件
    handleOpenFile () {
      this.addVis = false
      const input = document.getElementById(this.id)
      // 解决同一个文件不能监听的问题
      input.addEventListener(
        'click',
        function () {
          this.value = ''
        },
        false
      )
      // 点击input
      input.click()
    },
    // 裁剪input 监听
    async onChange (e) {
      const file = e.target.files[0]
      if (!file) {
        return
      }
      let testmsg = ''
      if (this.imageObj.fromWhere === 'apply') {
        const types = [
          'image/png',
          'image/gif',
          'image/jpeg',
          'image/jpg',
          'image/bmp',
          'image/x-icon'
        ]
        testmsg = types.includes(file.type)
        if (!testmsg) {
          MsgShow('error', '请上传正确格式的图片!', 3000)
          return false
        }
      } else {
        const types = [
          'image/png',
          'image/jpeg',
          'image/jpg'
        ]
        testmsg = types.includes(file.type)
        if (!testmsg) {
          MsgShow('error', '请上传jpg、png格式的图片!', 3000)
          return false
        }
      }
      if (testmsg) {
        try {
          let fileType = file.name.substr(file.name.lastIndexOf('.') + 1)
          this.option.outputType = fileType
          if (fileType === 'png') {
            this.option.outputType = 'png'
          } else {
            this.option.outputType = 'jpeg'
          }
          console.log(fileType)
          console.log('我处理了')
          // 读取文件
          this.fileName = file.name
          const src = await readFile(file)
          this.showCropper = true
          // 初始化值
          this.initValue()
          this.option.img = src
        } catch (error) {
        }
      }
    },
    // 删除图片
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
    // 处理图片，压缩，转换file
    configImage () {
      this.$refs.cropper.getCropBlob(data => {
        this.addVis = true
        if (data === null) {
          MsgShow('warning', '图片缩放太小无法裁剪上传', 3000)
          this.addVis = false
          return false
        }
        let isLt500K = data.size / 1024 / 1024 < 2
        if (this.imageObj.fromWhere === 'apply') {
          isLt500K = data.size / 1024 < 500
        }
        if (!isLt500K) {
          // 压缩
          this.isCompress = true
          this.addVis = false
          // return;
        } else {
          this.isCompress = false
        }
        this.$refs.cropper.getCropData(data => {
          if (this.isCompress) { // 是否压缩
            let img = new Image()
            img.src = data
            img.onload = () => {
              let _data = this.onImgCompression(img)
              let userAgent = navigator.userAgent
              if (!!window.ActiveXObject || 'ActiveXObject' in window || userAgent.indexOf('Edge') > -1) {
                AxiosApi('/bmms/web-bm/file/stream', { imgStream: _data }).then(res => {
                  if (res.status === 200) {
                    this.uploadImgIe(res.data)
                  } else {
                    MsgShow('error', res.desc, 3000)
                  }
                })
              } else {
                let file = this.dataURLtoFile(_data, this.fileName)
                // console.log('图片大小-压缩过:', (file.size / 1024).toFixed(2), 'kb，', '压缩率：', this.compress)
                this.uploadImg(file)
              }
            }
          } else {
            let userAgent = navigator.userAgent
            if (!!window.ActiveXObject || 'ActiveXObject' in window || userAgent.indexOf('Edge') > -1) {
              AxiosApi('/bmms/web-bm/file/stream', { imgStream: data }).then(res => {
                if (res.status === 200) {
                  this.uploadImgIe(res.data)
                } else {
                  MsgShow('error', res.desc, 3000)
                }
              })
            } else {
              let file = this.dataURLtoFile(data, this.fileName)
              // console.log('图片大小-未压缩:', (file.size / 1024).toFixed(2), 'kb')
              this.uploadImg(file)
            }
          }
        })
      })
    },
    // IE上传
    uploadImgIe (data) {
      if (this.imageObj.fromWhere === 'apply') {
        const isLt500K = data.fileSizeB / 1024 < 500
        if (!isLt500K) {
          MsgShow('error', '上传图片大小不能超过500KB!', 3000)
          return
        }
      } else {
        const isLt500K = data.fileSizeB / 1024 / 1024 < 2
        if (!isLt500K) {
          MsgShow('error', '上传图片大小不能超过2MB!', 3000)
          return
        }
      }
      // 头像
      this.showCropper = false
      if (this.imageObj.fromWhere && this.imageObj.fromWhere === 'sign') {
        if (this.biometricId !== '') {
          this.updateFaceData(data.urlPath)
        } else {
          this.saveFaceData(data.urlPath)
        }
      } else {
        this.imageObj.imageUrl = data.urlPath
      }
    },
    // 上传图片
    uploadImg (file) {
      if (this.imageObj.fromWhere === 'apply') {
        const isLt500K = file.size / 1024 < 500
        if (!isLt500K) {
          MsgShow('error', '上传图片大小不能超过500KB!', 3000)
          return
        }
      } else {
        const isLt500K = file.size / 1024 / 1024 < 2
        if (!isLt500K) {
          MsgShow('error', '上传图片大小不能超过2MB!', 3000)
          return
        }
      }
      var param = new FormData() // FormData 对象
      param.append('file', file) // 文件对象
      param.append('isCut', this.imageObj.isCut || 'no')
      axios({
        method: 'POST',
        url: '/bmms/web-bm/file/scale',
        data: param
      }).then(res => {
        if (res.data.status === 200) {
          // 头像
          this.showCropper = false
          if (this.imageObj.fromWhere && this.imageObj.fromWhere === 'sign') {
            if (this.biometricId !== '') {
              this.updateFaceData(res.data.data.urlPath)
            } else {
              this.saveFaceData(res.data.data.urlPath)
            }
          } else {
            this.imageObj.imageUrl = res.data.data.urlPath
          }
        } else {
          MsgShow('error', res.data.desc, 3000)
          this.addVis = false
        }
      })
    },
    // 将裁剪base64的图片转换为file文件
    dataURLtoFile (dataurl, filename) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 压缩图片
    onImgCompression (img) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let width = img.width
      let height = img.height
      canvas.width = width
      canvas.height = height
      // 铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, width, height)
      // 进行压缩
      let compress = this.compress || 0.8 // 压缩率
      if (this.option.outputType === 'png') {
        return canvas.toDataURL('image/png', compress)
      }
      return canvas.toDataURL('image/jpeg', compress)
    }
  }
}
</script>
<style lang="scss">
  .passport-tool-select{
     .el-select{
       width: 72px;
     }
    .el-icon-circle-check {
      display: none;
    }
    .size-select{
      width: 120px;
    }
  }
  .passport-look-imgDialog{
    .el-dialog__body{
      text-align: center;
      padding-bottom: 20px;
    }
  }
  .passport-cropper-dialog {
    top: 12vh;
    text-align: center;
    .el-dialog__header {
      padding-top: 0;
    }
    .el-dialog--center .el-dialog__body {
      padding: 22px 0 30px;
    }
    .el-dialog {
      text-align: center;
      height: 445px;
      width: 580px;
    }
  }
  .passport-cropper-dialog{
    box-sizing: border-box;
    .el-slider{
      width: 160px;
      float: left;
    }
    .el-slider__button {
      width: 12px;
      height: 12px;
      border: 0px solid #1e87f0;
      background-color: #1e87f0;
      border-radius: 50%;
    }
    .el-slider__runway {
      height: 4px;
      margin: 6px 0;
      background-color: #ebebeb;
      border-radius: 3px;
      cursor: pointer;
    }
    .el-slider8__button-wrapper {
      top: -12px;
    }
    .el-dialog--center .el-dialog__footer {
      text-align: right;
    }
    .cropper-view-box{
      display: block;
      overflow: hidden;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
       outline: 0px solid #1e87f0;
      border: 2px solid #1e87f0;
       /*outline-color: rgba(51, 153, 255, 0.75); */
      user-select: none;
    }
    .cropper-modal{
      background: rgba(0, 0, 0, 0.15);
    }
     .avatar-uploader .el-upload:focus,  .avatar-uploader .el-upload:hover {
      border-color: #1e87f0;
    }
  }
</style>
<style lang="scss" scoped>
  .passport-tool-width{
    margin-left: 20px;
  }
  .passport-tool-height{
    margin-left: 20px;
  }
  .passport-tool-default{
    margin-left: 20px;
    color: #1E87F0;
    line-height: 70px;
    span{
      cursor: pointer;
    }
  }
  .passport-tool-btn{
    margin-left: 20px;
    width: 70px;
    font-size: 16px;
    height: 40px;
    border-radius: 2px;
    padding: 0 !important;
    margin-top: 12px;
  }
  .passport-tool-size-div{
    padding: 26px;
    display: flex;
  }
  .passport-tool-title{
    color: #999999;
    font-size: 14px;
  }
  .passport-tool-div-item{
    width: 25%;
    text-align: center;
  }
  .iconSize{
    font-size: 24px;
    color: #999999;
    cursor: pointer;
    &:hover{
      color: #1E87F0;
    }
  }
  .passport-tool-div{
    width: 217px;
    height: 38px;
    background: #EFEFEF;
    border-radius: 20px;
    display: flex;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
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
  .main-content {
    display: flex;
    flex-flow: column;
  }
  #passport-corpper {
    width: 480px;
    height: 220px;
    background-image: none;
    background: #fff;
    z-index: 1002;
    margin: 0 auto;
  }

  .cropper-button {
    z-index: 1003;
    text-align: center;
    margin-top: 20px;
    .el-button {
      font-size: 16px;
      cursor: pointer;
      text-align: center;
    }
    .cancel-btn {
      color: #373737;
    }
    .el-button:last-child {
      margin-left: 100px;
    }
  }
  .passport-uploader-img{
    width: 110px;
    height: 110px;
    border: 1px solid #DCDFE6;
    border-radius:2px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .imgContent{
    width: 110px;
    height: 110px;
    border-radius:2px;
  }
  .widthSmall{
    width: 110px;
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
  .ImgBtn{
    float: left;
    width: 50%;
    background:rgba(51,51,51,0.3);
  }
  .passport-up-img {
    position: relative;
    display: flex;
    vertical-align: middle;
    text-align: center;
    width: 108px;
    height: 108px;
    border-radius: 2px;
    .showImg{
      width: 108px;
      height: 108px;
      object-fit: scale-down;
    }
  }
  .closeBtn{
    position: absolute;
    top: 0px;
    right: 0;
    width: 20px;
    height: 20px;
  }
</style>
