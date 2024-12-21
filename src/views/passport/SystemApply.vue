<template>
  <div class="passport-system-apply-container">
    <div class="passport-system-apply-main">
      <div class="passport-system-apply-tit">
        <img src="/static/passport/img/yarward_red.png" />
        <div class="system-apply-tit">系统授权</div>
        <div class="system-apply-return" @click="$router.push('/login')">返回</div>
      </div>
      <div class="passport-system-apply-org">
        <div class="passport-system-apply-org-tit">
          <div class="typt-tit-logo"></div>
          <div class="typt-tit-content">机构信息</div>
        </div>
        <el-form :rules="rules"  ref="addFormData" label-width="150px" :model="addFormData">
          <el-form-item label="机构名称：" prop="orgName">
            <el-input :disabled="valDisabled" placeholder="请输入机构名称" v-model="addFormData.orgName" clearable></el-input>
          </el-form-item>
          <el-form-item label="机构logo：" prop="logo" class="imgUpload">
            <img v-if="valDisabled" :src="addFormData.orgImage" class="passport-org-img" />
            <!--上传图片组件-->
            <v-upload-image v-else :imageObj="imageObj" ref="imgDiv"></v-upload-image>
          </el-form-item>
          <el-form-item label="用户名：" prop="userName">
            <el-input :disabled="valDisabled" placeholder="请输入用户名" v-model="addFormData.userName" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="userPassword" style="padding-bottom: 10px;">
            <el-input disabled v-model="addFormData.userPassword"></el-input>
          </el-form-item>
          <div class="marginCls"></div>
          <div class="passport-system-apply-org-tit" style="margin-bottom: 20px;">
            <div class="typt-tit-logo"></div>
            <div class="typt-tit-content">授权信息</div>
          </div>
          <el-form-item label="下载授权申请文件：" prop="downLoadFile">
            <el-button size="small" type="primary" @click="downLoadFile">下载文件</el-button>
          </el-form-item>
          <el-form-item label="上传授权文件：" prop="uploadFile">
            <el-upload
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
      <div class="typt-add-footer">
        <el-button type="primary" @click="saveData()" :loading="addVis">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { AxiosJsonApi, AxiosApi } from '../../api/passport/http'
import { ResultMsg, MsgShow } from '../../assets/passport/js/Message'
import vUploadImage from '../../components/passport/CropperUploadImg.vue'
export default {
  name: 'system_apply',
  components: {
    vUploadImage
  },
  data () {
    return {
      fileList: [],
      limitNum: 1,
      imageObj: {
        picRoute: '',
        avatar: 'avatar',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: '',
        fromWhere: 'apply'
      },
      addVis: false,
      addFormData: {
        userName: '',
        orgName: '',
        userPassword: 'Yahua@3585668',
        logo: '1',
        downLoadFile: '1',
        uploadFile: '1',
        licenseFilePath: '',
        orgImage: ''
      },
      valDisabled: false,
      rules: {
        orgName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { min: 1, max: 20, message: '机构名称长度不能超过20位！', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名长度为2-20位！', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        downLoadFile: [
          { required: true, message: '请下载授权申请文件', trigger: 'blur' }
        ],
        uploadFile: [
          { required: true, message: '请上传授权文件', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getLastMes()
  },
  methods: {
    // 获取上一次授权信息
    getLastMes () {
      AxiosApi('/passport/web-rbac/logins/register/first', {}, 'GET').then(res => {
        if (res.status === 200) {
          if (res.data !== null) {
            Object.assign(this.addFormData, res.data)
            this.valDisabled = true
          }
        }
      })
    },
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
        this.$message.success('上传成功')
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
    goLogin () {
      this.$router.push({ path: '/login' })
    },
    // 注册
    saveData () {
      if (this.valDisabled) {
        this.goLogin()
        return false
      }
      this.$refs['addFormData'].validate((valid) => {
        if (valid) {
          let logo = this.$refs.imgDiv.imageObj.imageUrl
          if (!logo) {
            MsgShow('warning', '请上传机构logo', 3000)
            return false
          }
          if (!this.addFormData.licenseFilePath) {
            MsgShow('warning', '请上传授权文件', 3000)
            return false
          }
          this.addVis = true
          AxiosJsonApi('/passport/web-rbac/logins/register/auth', {
            orgName: this.addFormData.orgName,
            orgImage: logo,
            licenseFilePath: this.addFormData.licenseFilePath,
            userName: this.addFormData.userName,
            userPassword: this.addFormData.userPassword
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

<style lang="scss">
  .passport-system-apply-container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .imgUpload .passport-add-img{
      background-color: #FFFFFF;
    }
    .passport-org-img{
      width: 110px;
      height: 110px;
    }
    .passport-system-apply-main{
      width: 75%;
      height: 90%;
      .passport-system-apply-tit{
        width: 100%;
        border-bottom: 1px solid #dadada;
        margin-bottom: 40px;
        height: 40px;
        img{
          float: left;
        }
        .system-apply-tit{
          float: left;
          height: 30px;
          line-height: 30px;
          margin-left: 10px;
          border-left: 1px solid #dadada;
          margin-bottom: 10px;
          padding-left: 10px;
          font-size: 20px;
          color: #333333;
          font-weight: 600;
        }
        .system-apply-return{
          float: right;
          cursor: pointer;
          color: #1e87f0;
          font-size: 14px;
          line-height: 50px;
          margin-right: 5px;
        }
      }
      .passport-system-apply-org{
        width: 100%;
        background: #fafafa;
        display: flex;
        flex-direction: column;
        .passport-system-apply-org-tit{
          display: flex;
          align-items: center;
          margin-top: 20px;
          margin-left: 20px;
        }
        .el-form{
          margin-top: 20px;
          padding-bottom: 10px;
          .el-form-item{
            width: 450px;
            margin-left: auto;
            margin-right: auto;
          }
          .el-input{
            width: 300px;
          }
          .el-upload{
            background: #ffffff;
          }
        }
      }
      .marginCls{
        width: 100%;
        height: 20px;
        background: #ffffff;
      }
    }
  }
</style>
