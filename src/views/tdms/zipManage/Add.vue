<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}安装包</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form :rules="rules"  ref="addFormData" class="from" label-width="130px" :model="addFormData">
          <el-form-item label="安装包名称：" prop="packageName">
            <el-input v-uni="actFormKey + 'anzhuangbaomingcheng'" v-model="addFormData.packageName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="说明：" prop="packageDesc">
            <el-input v-uni="actFormKey + 'shuoming'" v-model="addFormData.packageDesc" placeholder="请输入"></el-input>
          </el-form-item>
          <div v-if="!addFormData.packageId">
            <el-form-item label="安装包：" prop="packageUrl">
              <el-upload
                v-uni="actKey + 'upload'"
                class="upload-demo"
                :limit="limitNum"
                accept="zip"
                action="/tdms/web-td/file/"
                :data = "uploadParams"
                :before-upload = "beforeUpload"
                :on-remove="handleRemove"
                :on-success = "uploadFile"
                :file-list="fileList">
                <el-button size="small" type="primary">上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="大小：" class="tdms-zip-font-color">
              {{packageSizeUnit}}
            </el-form-item>
            <el-form-item label="版本：" class="tdms-zip-font-color">
              {{addFormData.packageVersion}}
            </el-form-item>
            <el-form-item label="终端类型：" class="tdms-zip-font-color">
              {{typeObj[addFormData.deviceType]}}
            </el-form-item>
            <el-form-item label="终端型号：" class="tdms-zip-font-color">
              {{addFormData.deviceModel}}
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button v-uni="actKey + 'cancel'" @click="reloadUrl">取消</el-button>
      <el-button v-uni="actKey + 'save'" type="primary" @click="onSubmit('addFormData')" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../assets/tdms/mixins/BaseManage'
import { PatientDictionary } from '../../../assets/tdms/js/DictionaryA10'
import { AxiosApi } from '../../../api/tdms/http'
export default {
  props: ['params'],
  mixins: [BaseManage],
  data () {
    return {
      packageSizeUnit: '0M',
      deviceType: 'zip',
      addFormData: {
        packageId: '',
        packageDesc: '',
        deviceType: '',
        deviceModel: '',
        packageUrl: '',
        packageSize: '',
        packageName: '',
        packageVersion: ''
      },
      fileList: [],
      limitNum: 1,
      uploadParams: {
        fileName: ''
      },
      titMsg: '添加',
      modelName: '安装包',
      typeObj: {},
      currentSize: '',
      rules: {
        packageName: [
          { required: true, message: '安装包名称不可为空！', trigger: 'blur' },
          { min: 1, max: 10, message: '安装包名称不可超过10个字符', trigger: 'blur' }
        ],
        packageUrl: [
          { required: true, message: '请上传安装包！', trigger: 'change' }
        ],
        packageDesc: [
          { min: 0, max: 20, message: '说明不可超过20个字符', trigger: 'blur' }
        ]
      },
      url: '/tdms/web-td/device/package',
      actKey: 'anzhuangbaoguanlitianjia_',
      actFormKey: 'anzhuangbaoguanlitianjia__'
    }
  },
  created () {
    this.getCurrentSize()
    this.typeObj = PatientDictionary
    this.addFormData.packageId = this.params.id || ''
    if (this.addFormData.packageId) {
      this.titMsg = '编辑'
      this.actKey = 'anzhuangbaoguanlibianji_'
      this.actFormKey = 'anzhuangbaoguanlibianji__'
      this.detail(this.addFormData.packageId)
    }
  },
  methods: {
    // 查询当前可用大小
    getCurrentSize () {
      AxiosApi('/tdms/web-td/device/package/sumSize', {}, 'GET').then(res => {
        if (res.status === 200) {
          this.currentSize = res.data
        }
      })
    },
    onSubmit (addFormData) {
      this.$refs[addFormData].validate((valid) => {
        if (valid) {
          if (this.addFormData.packageId) {
            this.url = `${this.url}/${this.addFormData.packageId}`
            // 修改安装包
            this.saveDataDo({
              packageDesc: this.addFormData.packageDesc,
              packageName: this.addFormData.packageName
            }, 'modify')
          } else {
            // 添加安装包
            this.saveDataDo(this.addFormData)
          }
        }
      })
    },
    // 查看详情
    detail (id) {
      AxiosApi(`${this.url}/${id}`, {}, 'GET').then(res => {
        Object.assign(this.addFormData, res.data)
      })
    },
    beforeUpload (file) {
      let arr = file.name.split('.')
      let type = arr[arr.length - 1]
      const testmsg = /^zip$/.test(type)
      if (file.size > (1024 * 1024 * 1024 * 5 - parseInt(this.currentSize))) {
        this.$message.error('内存不足，请及时清理安装包!')
        return false
      }
      if (!testmsg) {
        this.$message.error('请上传文件zip格式!')
        return false
      }
      this.uploadParams.fileName = file.name
    },
    handleRemove (file, fileList) {
      this.fileList = []
      this.addFormData.packageUrl = ''
      this.addFormData.packageVersion = ''
      this.addFormData.packageSize = ''
      this.addFormData.deviceModel = ''
      this.addFormData.deviceType = ''
      this.packageSizeUnit = '0M'
    },
    // 上传成功之后
    uploadFile (response, file) {
      let status = response.status
      let desc = response.desc
      if (status === 200) {
        this.addFormData.packageUrl = response.data
        this.$refs.addFormData.validateField('packageUrl')
        let tempName = file.name.replace('.zip', '')
        let strArr = tempName.split('_')
        this.packageSizeUnit = this.renderSize(file.size)
        this.addFormData.packageSize = file.size
        if (strArr[0] === 'OTA') {
          this.addFormData.deviceModel = strArr[1] || ''
          this.addFormData.packageVersion = strArr[2] || ''
        } else {
          this.addFormData.deviceType = strArr[0] || ''
          this.addFormData.packageVersion = strArr[1] || ''
        }
      } else {
        this.$message.error(desc)
      }
    },
    // 格式化文件大小
    renderSize (bytes) {
      if (bytes == null || bytes === '') {
        return '0M'
      }
      let k = 1024
      let sizes = ['B', 'KB', 'M', 'G', 'T', 'PB', 'EB', 'ZB', 'YB']
      let i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
    }
  }
}
</script>
<style scoped>
  .tdms-zip-font-color{
    color: #666666;
  }
</style>
