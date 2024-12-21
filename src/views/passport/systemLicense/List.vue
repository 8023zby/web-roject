<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">授权信息</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 550px;">
        <el-form  :rules="rules"  ref="addFormData" class="from" label-width="160px" :model="addFormData">
          <el-form-item label="下载授权申请文件：" prop="downLoadFile">
            <el-button v-uni="actKey + 'downLoad'" size="small" type="primary" @click="downLoadFile">下载文件</el-button>
          </el-form-item>
          <el-form-item label="上传授权文件：" prop="uploadFile">
            <el-upload
              v-uni="actKey + 'uoload'"
              class="upload-demo"
              :limit="limitNum"
              action="/bmms/web-bm/file"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :on-success = "uploadFile"
              :file-list="fileList">
              <el-button size="small" type="primary">上传文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--<div class="typt-add-footer">
      <el-button type="primary" @click="onSubmit()" :loading="addVis">保存</el-button>
    </div>-->
  </div>
</template>

<script>
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http'
import { MsgShow, ResultMsg } from '../../../assets/passport/js/Message'
export default {
  data () {
    return {
      loading: false,
      addVis: false,
      limitNum: 1,
      fileList: [],
      addFormData: {
        downLoadFile: '1',
        uploadFile: '1',
        licenseFilePath: ''
      },
      modelName: '授权',
      rules: {
        downLoadFile: [
          { required: true, message: '请下载授权申请文件', trigger: 'blur' }
        ],
        uploadFile: [
          { required: true, message: '请上传授权文件', trigger: 'blur' }
        ]
      },
      url: '/passport/web-rbac/systemConfigs',
      actKey: 'shouquanguanli_'
    }
  },
  methods: {
    handleRemove (file, fileList) {
      this.fileList = []
      this.addFormData.licenseFilePath = ''
    },
    // 删除提醒
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {

      })
    },
    // 上传成功之后
    uploadFile (response, file) {
      let status = response.status
      let desc = response.desc
      if (status === 200) {
        this.addFormData.licenseFilePath = response.data.urlPath
        this.$message.success('上传成功,系统授权十分钟后生效！')
      } else {
        this.$message.error(desc)
      }
    },
    // 下载授权文件
    downLoadFile () {
      AxiosApi('/passport/web-rbac/logins/register/auth', {}, 'GET').then(data => {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        let fileName = 'apply.data'
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)

        document.body.appendChild(link)
        link.click()
      })
    },
    // 保存设置
    onSubmit () {
      this.$refs['addFormData'].validate((valid) => {
        if (valid) {
          if (!this.addFormData.licenseFilePath) {
            MsgShow('warning', '请上传授权文件', 3000)
            return false
          }
          this.addVis = true
          AxiosJsonApi('/passport/web-rbac/logins/register/auth', {
            licenseFilePath: this.addFormData.licenseFilePath
          }).then(res => {
            ResultMsg(res, '保存', this.goLogin)
            if (res.status !== 200) {
              this.addVis = false
            }
          })
        }
      })
    }
  }
}
</script>
