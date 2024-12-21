<template>
  <div >
      <el-upload
       ref="fileUpload"
       class="upload-demo"
       :action="action"
       :data="data"
       :headers="headers"
       :multiple="false"
       :accept="accept"
       :file-list="fileLists"
       :on-change="handleChange"
       :on-remove="beforeRemove"
       :auto-upload="false"
       :on-success="handleSuc"
       :on-error="handleError"
       :on-exceed="handleExceed">
      <el-button size="small" type="primary">点击上传</el-button>
       </el-upload>
      <el-button v-if="false" type="primary" @click="submit()">确 定</el-button>
  </div>
</template>
<script>

import { DeleteFileds } from '@/api/hpms/qiniu'
import qs from 'qs'
export default {
  name: 'FileUpload',
  watch: {
    filelist: function () {
      this.fileLists = this.filelist
    }
  },
  props: {
    accept: {
      type: String,
      default: () => {}
    },
    dataName: {
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
    data: {// 请求的额外参数
      type: Object
    },
    filelist: {
      type: Array,
      default: () => []
    },
    Iscallback: {
      type: Boolean,
      default: res => {
        return false
      }
    }
  },
  data () {
    return {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      fileLists: [],
      loading: false,
      FormatType: '',
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
      saveData: [] // 存储当前返回的值执行的值
    }
  },
  methods: {
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange (files, filel) {
      // 获取最后一次得到的文件
      const F = filel[filel.length - 1]
      // 覆盖上一次的文件
      this.fileLists = []
      this.fileLists.push(F)
      // 检测一下有没有上传文件
      if (this.Iscallback) { }
      if (this.$refs.fileUpload.uploadFiles.length > 0) {
        let FT = this.$refs.fileUpload.uploadFiles[0].name // 获取文件名称
        this.isCheckUpload(FT, true)
      }
    },

    isCheckUpload (FT, value) {
      let suffix = FT.substring(FT.lastIndexOf('.')) // 获取文件的后缀
      let T = this.format(suffix)
      this.$emit('isUploadFiedsFlag', { type: T, isFlag: value })
    },

    // 文件超出个数限制时的钩子
    handleExceed (files, fileList) {
      this.$message.warning({
        title: '提示',
        message: '上传文件已存在,替换请先移除！',
        duration: 2000
      })
    },

    // 因为el-upload中已经设置了accept的文件格式，:auto-upload="false" 将自动上传的功能关闭，所以下面的方法省略……
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
    handleBeforeUpoad (file) {
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
      this.FormatType = this.format(filename)
    },

    // 判断当前上传的音视频文件是什么类型
    format (value) {
      // 0:视频,1:音频 2:pdf
      let v = ''
      if (this.dataName === 'video') {
        if (this.Audio.includes(value)) {
          v = '1' // 视频(0)还是音频(1)格式
        } else if (this.video.includes(value)) {
          v = '0'
        }
      } else if (value === '.pdf') {
        v = '2'
      }
      return v
    },

    beforeRemove (file, fileList) {
      // 清空已上传的文件列表（该方法不支持在 before-upload 中调用）
      this.$refs.fileUpload.clearFiles()
      this.fileLists = []
      if (this.Iscallback) { }
      //  点击删除的时候需要把传到父组件的值清空
      this.isCheckUpload(file.name, false)
      this.clear()
    },
    // 清空只限于点击删除的时候清空
    clear () {
      this.$emit('uploadFlieds', {
        name: this.dataName,
        data: ''
      })
    },
    // 删除
    delete (d) {
      if (d.url !== '') {
        DeleteFileds(qs.parse({ filePath: d.url })).then(r => {
          console.log(r)
        }).catch(errors => {
          this.$message.error('文件删除失败!')
        })
      }
    },

    // 再次提交
    submit () {
      if (this.$refs.fileUpload.fileList.length > 0) {
        this.$refs.fileUpload.submit()
      } else {
        this.$emit('uploadFlieds', {
          name: 'null'
        })
      }
    },
    // 提交给父组件
    emitForm (sourceFileName, urlPath) {
      this.$emit('uploadFlieds', {
        name: this.dataName || '',
        cuType: this.FormatType || '', // 视频(0)还是音频(1)格式
        data: JSON.stringify({
          name: sourceFileName,
          url: urlPath
        }) || ''
      })
    },
    // 文件上传成功时的钩子
    handleSuc (res, file, fileList) {
      // 上传成功处理
      if (res.status === 200) {
        // 上传完成以后，调用父组件的方法进行表单的提交
        this.emitForm(
          res.data.sourceFileName,
          res.data.urlPath
        )
      } else {
        // 上传失败处理
        this.$message.error('上传失败')
      }
    },
    handleError (errs, file, fileList) {
      this.$message.error('上传失败')
    }
  }
}
</script>
