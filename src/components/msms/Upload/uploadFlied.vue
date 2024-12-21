<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="action"
      :on-change="handleChange"
      :file-list="filelist"
      :accept="accept"
      :before-upload="beforeAvatarUpload"
      :limit="limits"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>
import { Uploads } from '@/api/smms/qiniu'

export default {
  props: {
    accept: {
      type: String,
      default: () => {}
    },
    action: {
      type: String,
      default: () => {
        return '/bmms/web-bm/file'
      }
    },
    limits: {
      type: Number,
      default: res => {}
    },
    dataName: {
      type: String,
      default: () => {}
    },
    filelist: {
      type: Array,
      default: () => []
    }
    // handleRemove: {
    //   type: Function,
    //   default: () => []
    // }
  },
  data () {
    return {
      form: {
        file: ''
      },
      Audio: ['.mp3', '.wav', '.wma'], // 当前音频1
      video: [
        '.mp4',
        '.avi',
        '.3gp',
        '.rmvb',
        '.wmv',
        '.mkv',
        '.mov',
        '.flv',
        '.mkv',
        '.mov'
      ], // 当前视频0
      param: '', // 表单要的参数
      cuType: ''
    }
  },
  methods: {
    handleRemove (file, fileList) {
      this.$emit('uploadFlieds', {
        name: this.dataName,
        data: ''
      })
    },
    handleAudioRemove (file) {
      this.fileList = []
    },
    beforeAvatarUpload (file) {
      var filename = file.name.substring(file.name.lastIndexOf('.'))
      const accept = this.accept.split(',')
      const isLt2M = file.size / 1024 / 1024 < 1024
      if (!accept.includes(filename)) {
        // 选择的不是当前格式
        this.$message.warning(`请上传 ${this.accept} 文件!`)
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 1G!',
          type: 'warning'
        })
        return false
      }
      // 判断一下当前是什么类型的音视频文件
      this.cuType = this.typeFormat(filename)
      this.param = new FormData()
      this.param.append('file', file, file.name)
      this.submit()
    },
    handleChange (file, fileList) {
      this.handleAudioRemove()
      this.fileList = fileList
    },
    handleExceed (files, fileList) {
      // 超出数量提示
      this.$message.warning(
        `当前限制选择 ${this.limits} 个文件，已超出个数限制!`
      )
    },
    // 判断当前上传的音视频文件是什么类型
    typeFormat (value) {
      let v = ''
      if (this.dataName === 'video') {
        if (this.Audio.includes(value)) {
          v = '1'
        } else if (this.video.includes(value)) {
          v = '0'
        }
      }
      return v
    },

    submit () {
      var _this = this
      Uploads(this.param).then(res => {
        if (res.status === 200) {
          this.$emit('uploadFlieds', {
            name: _this.dataName,
            cuType: _this.cuType, // 视频(0)还是音频(1)格式
            data: JSON.stringify({
              name: res.data.sourceFileName,
              url: res.data.urlPath
            })
          })
          this.handleAudioRemove()
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        } else {
          this.$message.error('上传失败')
        }
      })
    }
  }
}
</script>
