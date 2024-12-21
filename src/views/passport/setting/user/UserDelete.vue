<template>
  <div class="typt-list-container">
    <div class="typt-tit-cls" style="position: relative">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">批量导入</div>
      <el-button @click="$emit('option-changed', 'list')" class="el-small-btn" style="position: absolute;right: 20px" type="primary">返回</el-button>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form ref="addForm" label-width="100px" :rules="rules" :model="form">
          <el-form-item label="模板下载：">
            <a href="/static/passport/ygdr.xls" download="模板样例.xls">模板样例</a>
          </el-form-item>
          <el-form-item label="上传文件：" prop="fileUrl" class="up-item">
            <el-upload
              accept="xls,xlsl"
              action="/passport/web-bm/push/deleteUser"
              :on-change="handleChange"
              :before-upload = "beforeUpload"
              :on-remove="handleRemove"
              :on-success = "uploadFile"
              :file-list="fileList">
              <el-button size="small" type="primary">上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { MsgShow } from '../../../../assets/passport/js/Message'

export default {
  props: ['params'],
  data () {
    return {
      rules: {
        fileUrl: [
          { required: true, message: '还未成功上传文件', trigger: 'change' }
        ]
      },
      form: {
        fileUrl: ''
      },
      limitNum: 1,
      fileList: []
    }
  },
  methods: {
    handleChange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    beforeUpload (file) {
      let arr = file.name.split('.')
      let type = arr[arr.length - 1]
      const testmsg = /^xls|xlsx$/.test(type)
      if (!testmsg) {
        this.$message.error('请上传xls或者xlsx格式文件!')
        return false
      }
    },
    handleRemove (file, fileList) {
      this.fileList = []
      this.form.fileUrl = ''
    },
    // 上传成功之后
    uploadFile (response, file) {
      let status = response.status
      let desc = response.desc
      if (status === 200) {
        MsgShow('success', desc, 3000)
        setTimeout(() => {
          this.$emit('option-changed', 'list')
        }, 3500)
      } else {
        MsgShow('error', desc, 3000)
      }
    }
  }
}
</script>
