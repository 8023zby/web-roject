<template>
  <div class="tdms-update-div">
    <el-form ref="deviceForm" label-width="110px" class="typt-add-dialog" :rules="rules" :model="form">
      <el-form-item label="科室：" prop="deptId" v-if="landingEndCode === 'OPEX'" class="deptAddCls">
        <treeselect placeholder="请选择" v-model="params.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptData" noChildrenText="无子节点"/>
      </el-form-item>
      <el-form-item label="模板下载：">
       <a style="color: #1e87f0;" href="/static/tdms/watch.xls" download="导入模板.xls">导入模板</a>
      </el-form-item>
      <el-form-item label="上传文件：" prop="fileUrl">
        <el-upload
          class="upload-demo"
          accept="zip"
          action="/tdms/web-td/device/watch/import"
          :data = "params"
          :on-change="handleChange"
          :before-upload = "beforeUpload"
          :on-remove="handleRemove"
          :on-success = "uploadFile"
          :file-list="fileList">
          <el-button size="small" type="primary" style="height: 28px;padding:0 !important;width: 80px;border-radius: 2px !important;">上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-tdms-footer"></div>
  </div>
</template>

<script>
import { MsgShow } from '../../assets/tdms/js/Message'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'import-excel',
  components: {
    Treeselect
  },
  props: {
    deviceType: {
      type: String,
      require: true
    },
    deptId: {
      type: String,
      require: true
    },
    deptData: {
      type: Array,
      require: true
    }
  },
  data () {
    return {
      rules: {
        fileUrl: [
          { required: true, message: '还未成功上传升级包', trigger: 'change' }
        ],
        deptId: [
          { required: true, message: '请选择科室', trigger: 'change' }
        ]
      },
      baseUrl: '',
      limitNum: 1,
      params: {
        fileName: '',
        deptId: ''
      },
      form: {
        fileUrl: '',
        deviceType: ''
      },
      fileList: [],
      landingEndCode: ''
    }
  },
  created () {
    this.params.deptId = this.deptId
    this.getLandingEndCode()
  },
  methods: {
    // 获取登录端标识
    getLandingEndCode () {
      let codeStr = localStorage.getItem('selectLandingEndInfo')
      if (codeStr !== '' && codeStr !== null) {
        let tempInfo = JSON.parse(codeStr)
        this.landingEndCode = tempInfo.landingEndCode
      }
    },
    handleChange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    cancelDeviceUpdate () {
      this.$emit('cancelImport')
    },
    deviceUpdate () {
      this.$refs['deviceForm'].validate((valid) => {
        if (valid) {
          this.$emit('doImport')
        }
      })
    },
    beforeUpload (file) {
      let arr = file.name.split('.')
      let type = arr[arr.length - 1]
      const testmsg = /^xls|xlsx$/.test(type)
      if (!testmsg) {
        this.$message.error('请上传xls或者xlsx格式文件!')
        return false
      }
      if (this.params.deptId === null || !this.params.deptId) {
        this.$message.error('请选择科室!')
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
        MsgShow('success', '导入成功', 1000)
        setTimeout(() => {
          this.cancelDeviceUpdate()
        }, 1200)
      } else {
        this.$message.error(desc)
      }
    }
  }
}
</script>
