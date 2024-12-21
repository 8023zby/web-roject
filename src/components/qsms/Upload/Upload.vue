<template>
  <div class="custom-upload">
    <el-dialog
      title="上传图片"
      :visible.sync="showCropper"
      top="6vh"
      width="50%"
      height="600"
      class="cropper-dialog"
      center
      append-to-body
    >
      <div class="main-content">
        <vue-cropper
          v-if="showCropper"
          id="corpper"
          ref="cropper"
          :class="{'corpper-warp':showCropper}"
          v-bind="cropper"
          @realTime="realTime"
        />
        <div style="float:right:20px;">
          <div
            class="show-preview"
            :style="{ 'height': cropper.autoCropHeight,'width': cropper.autoCropWidth,
            'overflow': 'hidden', 'margin': '5px'}"
          >
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img" />
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 15px 0;">提示：滚动鼠标滚轮可缩放图片。可拖拽截取框选取图片。</div>
      <div v-if="showCropper" class="cropper-button">
        <el-button class="cancel-btn" size="small" @click.native="showCropper=false">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" @click="upimage">完成</el-button>
      </div>
    </el-dialog>
    <input
      :id="id"
      type="file"
      style="display: none"
      name="single"
      accept="image/*"
      @change="onChange($event)"
    />
    <div v-if="imageUrl===''" class="add" @click="handleOpenFile"></div>
    <img v-else :src="imageUrl" class="upImages" @click="handleOpenFile" />
    <div v-if="tips" class="tips clear-margin-top">{{ tips }}</div>
  </div>
</template>

<script>
// 上传文件组件
import { VueCropper } from 'vue-cropper'
import {
  isImageFile,
  isMaxFileSize,
  readFile
} from '@/assets/qsms/utils/upload'
import { Uploads } from '@/api/qsms/qiniu'

export default {
  components: {
    VueCropper
  },
  props: {
    // 最大上传文件的大小
    maxFileSize: {
      type: Number,
      default: 2 // （MB)
    },
    // 按钮文字
    buttonName: {
      type: String,
      default: '添加图片'
    },
    // 提示内容
    tips: {
      type: String
    },
    // 图片裁剪比列
    fixedNumber: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 图片文件分辨率的宽度
    width: {
      type: Number,
      default: 300
    },
    // 图片文件分辨率的高度
    height: {
      type: Number,
      default: 300
    },
    value: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
      id: 'cropper-input-' + +new Date(),
      loading: false,
      showCropper: false,
      imageUrl: this.value,
      // 插件的配置
      cropper: {
        img: '', // 裁剪图片的地址
        info: false, // 裁剪框的大小信息
        size: 0.9, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        full: true,
        responsive: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.width, // 默认生成截图框宽度
        autoCropHeight: this.height, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小
        // 开启宽度和高度比例
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: this.fixedNumber, // 截图框的宽高比例
        original: false,
        canMoveBox: true,
        canMove: false
      },
      previews: {},
      fileName: '',
      param: ''
    }
  },
  watch: {
    value (val) {
      this.imageUrl = this.value
    }
  },

  methods: {
    // 实时预览函数
    realTime (data) {
      this.previews = data
    },
    // 打开文件
    handleOpenFile () {
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
        return this.$message.error('选择图片失败')
      }
      // 验证文件类型
      if (!isImageFile(file)) {
        return
      }
      try {
        // 读取文件
        this.fileName = file.name
        const src = await readFile(file)
        this.showCropper = true
        this.cropper.img = src
      } catch (error) {
        console.log(error)
      }
    },
    // 上传图片
    upimage (f, fl) {
      this.$refs.cropper.getCropBlob(data => {
        // 文件大小限制
        if (!isMaxFileSize(data, this.maxFileSize)) {
          return
        }
        let img = window.URL.createObjectURL(data)
        this.imageUrl = img
        this.param = new FormData()
        this.param.append('file', data, this.fileName)
        this.submit()
      })
    },
    // 提交数据
    submit () {
      var _this = this
      Uploads(this.param).then(res => {
        if (res.status === 200) {
          this.$emit('subUploadSucceed', {
            name: _this.fileName,
            url: res.data.urlPath
          })
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.loading = false
          this.showCropper = false
        } else {
          this.$message.error('上传失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  border: 1px solid;
  width: 178px;
  height: 178px;
  color: #ccc;
  transition: color 0.25s;
  position: relative;
}

.add::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 80px;
  margin-left: -40px;
  margin-top: -5px;
  border-top: 10px solid;
}
.add::after {
  content: '';
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

.upImages {
  width: 178px;
  height: 178px;
  color: red;
  border: 1 slateblue solid;
}
.main-content {
  display: flex;
  justify-content: flex-end;
}
#corpper {
  width: 60%;
  height: 400px;
  background-image: none;
  background: #fff;
  z-index: 1002;
  display: flex;
  justify-content: flex-end;
}
.cropper-dialog {
  height: 800px;
  text-align: center;
  .el-dialog__header {
    padding-top: 15px;
  }
  .el-dialog--center .el-dialog__body {
    padding-top: 0;
    padding-bottom: 15px;
  }
  .el-dialog {
    text-align: center;
  }
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
.cropper-modal {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
.custom-upload {
  .tips {
    margin-top: 10px;
    color: red;
    font-size: 12px;
  }
  .clear-margin-top {
    margin-top: 0;
  }
}
</style>
