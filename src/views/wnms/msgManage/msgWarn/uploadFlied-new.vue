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
      :show-file-list="showFileList"
      ref="ref_UploadFiles"
    >
      <el-button size="small" type="primary">{{btnName}}</el-button>
    </el-upload>
    <div v-if="showFileView" class="show-file-view">
      <div v-if="showFileType==='IMAGE' && imgsrc !==''" class="show-image">
        <img :src="imgsrc" alt="">
        <el-button
          type="danger"
          icon="el-icon-close"
          title="移除"
          circle
          @click="removeFile"
          size="mini"
          class="button-model-remove"
        />
      </div>
      <div v-if="showFileType==='AUDIO' && audioSrc !==''" class="show-audio">
        <audio :src="audioSrc" controls="controls"></audio>
        <el-button
          type="danger"
          icon="el-icon-close"
          title="移除"
          circle
          @click="removeFile"
          size="mini"
          class="button-model-remove"
        />
      </div>
      <div v-if="showFileType==='VIDEO' && videoSrc !==''" class="show-video">
        <video width="500" height="320" controls>
          <source :src="videoSrc" type="video/mp4">
          <source :src="videoSrc" type="video/ogg">
        </video>
        <el-button
          type="danger"
          icon="el-icon-close"
          title="移除"
          circle
          @click="removeFile"
          size="mini"
          class="button-model-remove"
        />
      </div>

    </div>
  </div>
</template>
<script>
import { Uploads } from '@/api/wnms/qiniu'

export default {
  props: {
    // 编辑的时候，传过来的附件路径
    filePath: {
      type: String,
      default: () => {
        return ''
      }
    },
    // 编辑回显附件名称
    fileName: {
      type: String,
      default: () => {
        return ''
      }
    },

    //附件限制大小
    fileSize: {
      type: Number,
      default: () => {
        return 1024
      }
    },
    //展示文件类型
    showFileType: {
      type: String,
      default: () => {
      }
    },
    //是否展示文件上传列表
    showFileList: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    //是否展示文件
    showFileView: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    btnName: {
      type: String,
      default: () => {
        return '点击上传'
      }
    },
    changeData: {
      type: String,
      default: () => {}
    },

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
      // ipServer: 'http://192.168.30.191',
      ipServer: '',
      imgsrc: '',
      audioSrc: '',
      videoSrc: '',
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
  created() {
    console.log('编辑附件名和附件路径：', this.filePath, this.fileName)
    if (this.filePath !== '' && this.fileName !== '') {
      this.filelist[0] = {
        name: this.fileName,
        url: this.filePath
      }
    }
  },
  mounted() {
    if (this.showFileType === 'icon') {
      if (this.filelist.length > 0) {
        if (!this.filelist[0].url || this.filelist[0].url === '') { this.$refs.ref_UploadFiles.clearFiles() }
      }
    }

    /*if(this.filePath !==''){
      this.showThostFile(this.filePath)
    }*/
  },
  methods: {
    removeFile() {
      const _this = this
      this.$confirm('是否删除上传的附件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        //展示图片
        if (_this.showFileType === 'IMAGE') {
          _this.imgsrc = ''
        }

        _this.$emit('uploadFlieds', 'clear', _this.changeData)
        _this.$refs.ref_UploadFiles.clearFiles();//调用element官方的方法-清空上传的附件
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleRemove (file, fileList) {
      const _this = this

      _this.$emit('uploadFlieds', {
        name: _this.dataName,
        data: 'remove'
      }, _this.changeData, file.status)
    },
    handleAudioRemove (file) {
      this.fileList = []
    },
    beforeAvatarUpload (file) {
      var filename = file.name.substring(file.name.lastIndexOf('.'))
      const accept = this.accept.split(',')
      const isLt2M = file.size / 1024 / 1024 < this.fileSize
      if (!accept.includes(filename)) {
        // 选择的不是当前格式
        this.$message.warning(`请上传 ${this.accept} 文件!`)
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 ' + this.fileSize + ' M!',
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
    // 系统内文件上传都是单个，所以在第二次上传文件时，直接覆盖之前上传的文件！！！！！
    handleExceed (files, fileList) {
      console.log('超出数量提示', files, fileList)
      this.$set(fileList[0], "raw", files[0]);
      this.$set(fileList[0], "name", files[0].name);
      this.$refs["ref_UploadFiles"].clearFiles(); //清除文件
      this.$refs["ref_UploadFiles"].handleStart(files[0]); //选择文件后的赋值方法
      this.beforeAvatarUpload(files[0])
      return
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
    showThostFile(url) {
      const _this = this
      if (_this.showFileView) {
        //展示图片
        if (_this.showFileType === 'IMAGE') {
          _this.imgsrc = _this.ipServer + url
        }
        //展示音频
        if (_this.showFileType === 'AUDIO') {
          _this.audioSrc = _this.ipServer + url
        }
        //展示视频
        if (_this.showFileType === 'VIDEO') {
          _this.videoSrc = _this.ipServer + url
        }
      }
    },
    submit () {
      var _this = this
      Uploads(this.param).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.$emit('uploadFlieds', {
            name: _this.dataName,
            cuType: _this.cuType, // 视频(0)还是音频(1)格式
            data: JSON.stringify({
              name: res.data.sourceFileName,
              url: res.data.urlPath,
              secondsDuration: res.data.secondDuration,
              secondsDurationFormat: res.data.formatDuration
            })
          }, _this.changeData)
          this.handleAudioRemove()
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          // 展示相关附件：
          _this.showThostFile(res.data.urlPath)
        } else {
          this.$message.error('上传失败')
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .show-file-view{
    width: 300px;
    margin-top: 15px;
    .show-image{
      img{
        width: 250px;
      }
    }
    >div{
      .button-model-remove{
        background-color: #fff !important;
        border: 2px solid #50b6ff;
        padding: 4px !important;
        top: 36px;
        position: absolute;
        margin-left: 10px;
        i{
          color: #ff010d !important;
          font-weight: bolder;
        }
      }
    }
    .show-video{
      .button-model-remove{
        left: 520px;
      }
    }
  }
</style>
