<template>
  <div>
      <el-form ref="deviceForm" label-width="110px" class="typt-add-dialog" style="width: 100%;" :rules="rules" :model="form">
        <!--<el-form-item label="升级包：" prop="fileUrl">
          <el-upload
            class="upload-demo"
            :limit="limitNum"
            :action="baseUrl+'/web-td/file/'"
            :data = "params"
            accept="zip"
            :before-upload = "beforeUpload"
            :on-remove="handleRemove"
            :on-success = "uploadFile"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>-->
        <el-form-item label="选择升级包：" prop="zipUrl" style="width: 98%;height: 300px">
          <zip-manage ref="zipManage"></zip-manage>
        </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-tdms-footer">
      <el-button @click="cancelDeviceUpdate">取 消</el-button>
      <el-button type="primary" @click="deviceUpdate">确 认</el-button>
    </div>
  </div>
</template>

<script>
import ZipManage from './Zip'
import { MsgShow } from '../../assets/tdms/js/Message'
export default {
  name: 'device-update-pims',
  components: { ZipManage },
  props: {
    deviceModel: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      rules: {
        zipUrl: [
          { required: true, message: '请选择升级包', trigger: 'change' }
        ],
        fileUrl: [
          { required: true, message: '还未成功上传升级包', trigger: 'change' }
        ]
      },
      baseUrl: '',
      limitNum: 1,
      params: {
        fileName: ''
      },
      form: {
        fileUrl: '',
        zipUrl: '1'
      },
      fileList: []
    }
  },
  created () {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'debug') {
      this.baseUrl = '/api'
    } else if (process.env.NODE_ENV === 'production') {
      this.baseUrl = '/tdms'
    }
  },
  methods: {
    cancelDeviceUpdate () {
      this.$emit('cancelDeviceUpdate')
    },
    deviceUpdate () {
      this.$refs['deviceForm'].validate((valid) => {
        if (valid) {
          let zipInfo = this.$refs.zipManage.currentRow
          this.form.fileUrl = zipInfo.packageUrl || ''
          if (this.form.fileUrl === '') {
            MsgShow('warning', '请选择升级包', 3000)
            return false
          }
          this.$emit('deviceUpdate')
        }
      })
    },
    beforeUpload (file) {
      let arr = file.name.split('.')
      let type = arr[arr.length - 1]
      const testmsg = /^zip$/.test(type)
      if (!testmsg) {
        this.$message.error('请上传文件zip格式!')
        return false
      }
      this.params.fileName = file.name
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
        this.form.fileUrl = response.data
      } else {
        this.$message.error(desc)
      }
    }
  }
}
</script>

<style scoped>
.btnDiv{
  margin-top: 30px;
  text-align: right;
}
</style>
