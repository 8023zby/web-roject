<template>
  <div>
    <el-upload
      ref="fileUpload"
      class="upload-demo"
      :action="action"
      :on-change="handleChange"
      :file-list="filelist"
      :accept="accept"
      :before-upload="beforeAvatarUpload"
      :limit="limits"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :auto-upload="false"
    >
    <div class="upload-panel">
      <div class="uploadIcon-panel">
        <img :src="uploadIcon">
      </div>
      <div>选择上传文件</div>
    </div>
    </el-upload>
  </div>
</template>
<script>

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
    fileSize: {
      type: Number,
      default: () => {
        return 200
      }
    },
    filelist: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
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
      cuType: '',
      uploadIcon: require('@/assets/msms/img/uploadIcon.png')
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log('文件删除时的狗子', file, fileList)
      this.handleAudioRemove()
      this.uploadFliedsChange(file, fileList, 'del')
    },
    // 附件改变的钩子
    uploadFliedsChange (file, fileList, type) {
      this.$emit('uploadFliedsChange', {
        name: this.dataName,
        file,
        fileList,
        type
      })
    },
    // 文件上传成功时的钩子
    handleSuccess (res) {
      const _this = this

      if (res.status === 200) {
        this.$emit('uploadFlieds', {
          name: _this.dataName,
          cuType: _this.cuType, // 视频(0)还是音频(1)格式
          data: JSON.stringify({
            name: res.data.sourceFileName,
            url: res.data.urlPath,
            formatDuration: res.data.formatDuration
          })
        })
        this.handleAudioRemove()
      } else {
        this.$message.error('上传失败')
      }
    },
    handleAudioRemove (file) {
      this.fileList = []
    },
    beforeAvatarUpload (file) {
      console.log('上传文件之前的钩子:', file)
      var filename = file.name.substring(file.name.lastIndexOf('.'))
      const accept = this.accept.split(',')
      // 传给父组件文件大小
      this.$emit('getFilePara', (file.size / 1024 / 1024).toFixed(1))
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!accept.includes(filename)) {
        // 选择的不是当前格式
        this.$message.warning(`请上传 ${this.accept} 文件!`)
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 100M!',
          type: 'warning'
        })
        return false
      }
      // 判断一下当前是什么类型的音视频文件
      this.cuType = this.typeFormat(filename)
      this.param = new FormData()
      this.param.append('file', file, file.name)
      // this.submit()
    },
    handleChange (file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      console.log('文件改变时的钩子：\n', 'file:' + JSON.stringify(file), '\nfileList:' + JSON.stringify(fileList), '\n======================================')
      // 判断大小
      const isLt2M = file.size / 1024 / 1024 < this.fileSize
      if (!isLt2M) {
        this.$message.error(`上传文件大小不能超过 ${this.fileSize}MB!`)
        this.$refs.fileUpload.clearFiles()
        return
      }

      this.handleAudioRemove()
      this.fileList = fileList
      this.uploadFliedsChange(file, fileList, 'change')
    },
    // 文件超出个数限制时的钩子
    handleExceed (files, fileList) {
      console.log('超出数量提示', files, fileList)
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      this.$refs['fileUpload'].clearFiles() // 清除文件
      this.$refs['fileUpload'].handleStart(files[0]) // 选择文件后的赋值方法
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
      console.log('异步上传：', JSON.stringify(this.fileList))
      if (!this.fileList || this.fileList.length === 0) {
        this.$message.warning(
          `请上传附件`
        )
      } else {
        if (this.fileList[0] && this.fileList[0]['status'] === 'success') {
          this.$emit('uploadFlieds', {
            name: _this.dataName,
            cuType: this.typeFormat(this.fileList[0]['name']), // 视频(0)还是音频(1)格式
            data: JSON.stringify({
              name: this.fileList[0]['response']['data']['sourceFileName'],
              url: this.fileList[0]['response']['data']['urlPath'],
              formatDuration: this.fileList[0]['response']['data']['formatDuration']
            })
          })
          // this.handleAudioRemove()
        } else {
          _this.$refs.fileUpload.submit()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.uploadIcon-panel {
  width: 20px;
  height:18px;
  margin-right:10px ;
  position: relative;
  img{
    position: absolute;
    left: 2px;
  }
}
.upload-panel{
  display: flex;
  height: 40px;
  padding: 0 10px;
  align-items: center;
  border: 1px dashed#DCDFE6;
}
img{
  width:100%;
  height: 100%;
}
</style>
