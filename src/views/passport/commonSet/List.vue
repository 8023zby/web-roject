<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">通用设置</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 600px;">
        <el-form  :rules="rules"  ref="addFormData" class="from" label-width="130px" :model="addFormData">
          <el-form-item label="登录限制：" prop="unFrozenTimeConfig">
            <el-input v-uni="actFormKey + 'dengluxianzhi'" style="width: 150px;" v-model="addFormData.unFrozenTimeConfig" clearable></el-input>&emsp;分钟自动解除登录限制
          </el-form-item>
          <el-form-item label="验证码限制：" prop="photoCodeConfig">
            <el-switch
              v-uni="actFormKey + 'yanzhengmaxianzhi'"
              v-model="addFormData.photoCodeConfig"
              :active-value="0"
              :inactive-value="1"
              active-color="#1D86EF"
              inactive-color="#EDEDED">
            </el-switch>
          </el-form-item>
          <el-form-item label="系统着陆页：" prop="loginPageConfig">
            <span>{{hostUrl}}/#</span>&emsp;<el-input v-uni="actFormKey + 'xitongzhuoluye'" v-model="addFormData.loginPageConfig" placeholder="请输入系统着陆页" clearable></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="2">
              <el-form-item label="登录时效限制：" prop="tokenTimeOutSet">
                <el-switch
                  v-uni="actFormKey + 'denglushixiaoxianzhi'"
                  style="width: 100px"
                  @change="changeData"
                  v-model="addFormData.tokenTimeOutSet"
                  :active-value="0"
                  :inactive-value="1"
                  active-color="#1D86EF"
                  inactive-color="#EDEDED">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item prop="tokenTimeOut" v-if="addFormData.tokenTimeOutSet===0">
                <span>&emsp;系统无操作&emsp;<el-input v-uni="actFormKey + 'caozuoshijian'" style="width: 100px;" v-model="addFormData.tokenTimeOut" clearable></el-input>&emsp;分钟后自动退出登录</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="密码规则：" prop="pwdConfig">
            <el-radio v-uni="actFormKey + 'mimaguize-0'" v-model="addFormData.pwdConfig" :label="0">6-20位字母+数字，区分大小写</el-radio><br/>
            <el-radio v-uni="actFormKey + 'mimaguize-1'" v-model="addFormData.pwdConfig" :label="1">1-20位</el-radio>
          </el-form-item>
          <el-form-item label="上传图片大小：" prop="imgSize">
            <el-input v-uni="actFormKey + 'shangchantupiandaxiao'" v-model="addFormData.imgSize" clearable></el-input>&nbsp;KB
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button v-uni="actKey + 'save'" type="primary" @click="onSubmit()" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http'
import { ResultMsg } from '../../../assets/passport/js/Message'
export default {
  data () {
    let validateCount = (rule, value, callback) => {
      let reg = /(^[1-9]\d*$)/
      if (!reg.test(value)) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) < 3) {
        callback(new Error('登录限制不能低于3分钟！'))
      } else if (parseInt(value) > 1440) {
        callback(new Error('登录限制不能高于1440分钟！'))
      } else {
        callback()
      }
    }
    let validateCount2 = (rule, value, callback) => {
      let reg = /(^[1-9]\d*$)/
      if (!reg.test(value)) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) < 5) {
        callback(new Error('登录时效限制不能低于5分钟！'))
      } else if (parseInt(value) > 1440) {
        callback(new Error('登录时效限制不能高于1440分钟！'))
      } else {
        callback()
      }
    }
    let validateImgSize = (rule, value, callback) => {
      let reg = /(^[1-9]\d*$)/
      if (!reg.test(value)) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) < 1) {
        callback(new Error('上传图片大小不能小于1KB！'))
      } else if (parseInt(value) > 1000) {
        callback(new Error('上传图片大小不能大于1000KB！'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      addVis: false,
      addFormData: {
        unFrozenTimeConfig: '',
        photoCodeConfig: 0,
        loginPageConfig: '',
        tokenTimeOutSet: 0,
        tokenTimeOut: 30,
        pwdConfig: 0,
        imgSize: 300
      },
      modelName: '通用设置',
      rules: {
        unFrozenTimeConfig: [
          { required: true, message: '请输入登录限制', trigger: 'blur' },
          { validator: validateCount, trigger: 'blur' }
        ],
        tokenTimeOut: [
          { required: true, message: '请输入登录时效限制值', trigger: 'blur' },
          { validator: validateCount2, trigger: 'blur' }
        ],
        tokenTimeOutSet: [
          { required: true, message: '请选择登录时效限制', trigger: 'change' }
        ],
        photoCodeConfig: [
          { required: true, message: '请选择验证码限制', trigger: 'change' }
        ],
        loginPageConfig: [
          { max: 100, message: '系统着陆页不能超过100个字符', trigger: 'blur' }
        ],
        pwdConfig: [
          { required: true, message: '请选择密码规则', trigger: 'change' }
        ],
        imgSize: [
          { required: true, message: '请设置上传图片大小', trigger: 'blur' },
          { validator: validateImgSize, trigger: 'blur' }
        ]
      },
      url: '/passport/web-rbac/systemConfigs',
      hostUrl: '',
      actFormKey: 'tongyongshezhi__',
      actKey: 'tongyongshezhi_'
    }
  },
  mounted () {
    this.hostUrl = window.location.host
    this.getSetData()
  },
  methods: {
    // 切换开关
    changeData () {
      if (this.addFormData.tokenTimeOutSet === 1) {
        this.addFormData.tokenTimeOut = 30
      }
    },
    // 保存设置
    onSubmit () {
      this.$refs['addFormData'].validate((valid) => {
        if (valid) {
          let methodType = 'PUT'
          AxiosJsonApi(this.url, this.addFormData, methodType).then(res => {
            ResultMsg(res, this.modelName, this.getSetData)
            if (res.status !== 200) {
              this.addVis = false
            }
          })
        }
      })
    },
    // 获取数据
    getSetData () {
      this.loading = true
      AxiosApi(this.url, {}, 'GET').then(res => {
        this.loading = false
        if (res.status === 200) {
          let data = res.data
          this.addFormData = { ...this.addFormData, ...data }
        }
      })
    }
  }
}
</script>
