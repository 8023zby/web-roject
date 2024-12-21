<template>
  <div>
    <el-upload class="upload-demo" :action="action" :file-list="fileList" :accept="accept" :on-change="handleChange" :on-remove="handleRemove" :limit="limits" :on-exceed="handleExceed" :auto-upload="false">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>
import { Uploads } from '../../api/qiniu'

export default {
  props: {
    accept: {
      type: String,
      default: () => { }
    },
    action: {
      type: String,
      default: () => {
        return '/bmms/web-bm/file'
      }
    },
    limits: {
      type: Number,
      default: res => { }
    },
    dataName: {
      type: String,
      default: () => { }
    },
    fileList: {
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
      percentageLength: 0,
      form: {
        file: ''
      },
      param: '',// 表单要的参数
    }
  },
  methods: {
    handleRemove(){
       this.$emit('uploadFlieds',null)
    },
    handleChange (file) {
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
      //将文件转成二进制编码file类型 
      this.$emit('uploadFlieds',file.raw)
    },
    handleExceed (files, fileList) {
      // 超出数量提示
      this.$message.warning(
        `当前限制选择 ${this.limits} 个文件，已超出个数限制!`
      )
    }
  }
}
</script>
