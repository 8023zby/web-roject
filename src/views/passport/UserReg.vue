<template>
  <div class="passport-system-apply-container">
    <div class="passport-system-apply-main">
      <div class="passport-system-apply-tit">
        <img src="/static/passport/img/yarward_red.png" />
        <div class="system-apply-tit">用户注册</div>
        <div class="system-apply-return" @click="$router.push('/login')">返回</div>
      </div>
      <div class="passport-system-apply-org">
        <el-form :model="formRegister" :rules="ruleRegister" ref="formRegister" label-width="150px" class="registerStyle">
          <el-form-item label="请输入用户名：" prop="userName">
            <el-input autocomplete="off" type="text" v-model="formRegister.userName" @blur.prevent="checkUserName"></el-input>
          </el-form-item>
          <el-form-item label="设置登录密码：" prop="userPassword">
            <el-input autocomplete="new-password" type="password" v-model="formRegister.userPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认登录密码：" prop="checkPass">
            <el-input autocomplete="off" type="password" v-model="formRegister.checkPass"></el-input>
          </el-form-item>
          <el-form-item label="请输入手机号：" prop="userTelephone">
            <el-input autocomplete="off" type="text" v-model="formRegister.userTelephone" @blur.prevent="checkTelName" ></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="photoCode">
            <el-input autocomplete="off" type="text" v-model="formRegister.photoCode" style="width: 90px;"></el-input>
            <img class="verificationImg" :src="photoCdDt" alt="" />
            <span @click="clickCode" class="verificationText">换一张</span>
          </el-form-item>
          <el-form-item label="动态密码：" prop="smsCode">
            <el-input type="text" v-model="formRegister.smsCode"></el-input>
            <el-button :disabled="disabled" @click="sendCode" class="smsBtn" :loading="codeFlag">{{btnText}}</el-button>
          </el-form-item>
          <!--<el-form-item prop="resource" class="passport-login-btn">
            <el-radio v-model="formRegister.resource" label="1">我已阅读并同意云平台用户协议</el-radio>
          </el-form-item>-->
          <el-form-item class="passport-login-btn">
            <el-button class="agreeBtn" v-if="formRegister.userName === '' || formRegister.userPassword === ''|| formRegister.checkPass === ''|| formRegister.userTelephone === ''|| formRegister.photoCode === ''|| formRegister.smsCode === ''" type="primary" disabled @click="registerUser('formRegister')">同意并注册</el-button>
            <el-button v-else class="agreeBtn" @click="registerUser('formRegister')">同意并注册</el-button>
          </el-form-item>
          <el-form-item class="passport-login-btn">
            <span class="toLogin" @click="$router.push('/login')">去登录</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { MsgShow, ResultMsg } from '../../assets/passport/js/Message'
import { isvalidPhone, isvalUserName } from '../../assets/passport/js/validate'
import { checkLoginGet, getPhotoCode, getTelCode, regPost } from '../../api/passport/login'
var that = null
export default {
  name: 'user_reg',
  data () {
    // 验证用户名
    let validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (!isvalUserName(value)) {
        callback(new Error('请输入6-20位英文或数字，区分英文大小写'))
      } else {
        callback()
      }
    }
    // 验证手机号
    let validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formRegister.checkPass !== '') {
          this.$refs.formRegister.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formRegister.userPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      photoCdDt: '',
      addVis: false,
      formRegister: {
        userName: '',
        userPassword: '',
        repactPassword: '',
        userTelephone: '',
        photoCode: '',
        verifyStr: '',
        smsCode: '',
        resource: '1',
        orgLevel: 2
      },
      timerController: null,
      btnText: '获取短信验证码',
      codeFlag: false,
      setTelTime: 60,
      ruleRegister: {
        userName: [
          { required: true, validator: validName, trigger: 'blur' }
        ],
        userPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        userTelephone: [
          { required: true, validator: validPhone, trigger: 'blur' }
          // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        photoCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
          // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        smsCode: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' }
        ],
        resource: [
          { required: true, message: '请先阅读云平台用户协议', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    that = this
    this.getCode()
    if (this.$route.query.phone !== undefined) {
      this.formRegister.userTelephone = this.$route.query.phone
    }
  },
  destroyed () {
    clearTimeout(this.timerController)
  },
  methods: {
    // 获取手机验证码
    sendCode () {
      this.closeFlag = false
      let tel = this.formRegister.userTelephone
      let photoCode = this.formRegister.photoCode
      if (tel === '') {
        MsgShow('warning', '请输入手机号码')
      } else if (!isvalidPhone(tel)) {
        MsgShow('warning', '请输入正确的手机号')
      } else if (photoCode === '') {
        MsgShow('warning', '请输入验证码')
      } else {
        this.codeFlag = true
        getTelCode(this.formRegister.userTelephone).then(res => {
          if (res.status === 200) {
            this.timer()
            MsgShow('success', '验证码已发送')
          } else {
            this.codeFlag = false
            MsgShow('error', '验证码获取失败')
          }
        })
      }
    },
    timer () {
      this.codeFlag = false
      this.disabled = true
      if (this.setTelTime === 0) {
        this.btnText = '获取短信验证码'
        this.disabled = false
        this.setTelTime = 60
      } else {
        this.btnText = this.setTelTime + 's后重新获取验证码'
        this.setTelTime--
        if (this.closeFlag) {
          this.btnText = '获取短信验证码'
          this.disabled = false
          this.setTelTime = 60
        } else {
          this.timerController = setTimeout(function () { that.timer() }, 1000)
        }
      }
    },
    // 点击更换
    clickCode () {
      this.getCode()
    },
    getCode () {
      // 获取验证码
      let _this = this
      getPhotoCode().then((response) => {
        if (response.status === 200) {
          _this.photoCdDt = 'data:image/png;base64,' + response.data.base64Str
          _this.formRegister.verifyStr = response.data.verifyStr
        } else {
          _this.$message({ type: 'error', message: '获取失败' })
        }
      })
    },
    // 验证用户名是否被占用
    checkUserName () {
      if (this.formRegister.userName) {
        let param = {
          loginName: this.formRegister.userName
        }
        this.checkName(param)
      }
    },
    // 验证手机号是否被占用
    checkTelName () {
      if (this.formRegister.userTelephone) {
        let param = {
          loginName: this.formRegister.userTelephone
        }
        this.checkName(param)
      }
    },
    // 验证用户名或账户是否被占用
    checkName (id) {
      checkLoginGet(id).then(response => {
        if (response.status === 200) {
        } else {
          MsgShow('error', response.desc)
        }
      }, response => {
        MsgShow('error', '检验用户名失败！')
      })
    },
    // 登录
    toLogin () {
      this.$router.push('/login')
    },
    // 用户注册
    registerUser (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = this.formRegister
          const loading = this.$loading({
            lock: true,
            background: 'rgba(255, 255, 255, 0.7)'
          })
          regPost(param).then(response => {
            loading.close()
            if (response.status === 200) {
              this.getCode()
              ResultMsg(response, '注册', this.toLogin)
            } else {
              this.getCode()
              MsgShow('error', response.desc)
            }
          }, response => {
            loading.close()
            MsgShow('error', '注册失败！')
            this.getCode()
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
        .registerStyle .el-form-item {
          margin-bottom: 22px;
        }
        .registerStyle .el-input{
          width: 260px;
          font-size: 16px;
        }
        .registerInfo .el-form-item__label,.registerInfo .el-input__inner{
          height: 34px;
          line-height: 34px;
          font-size: 16px;
        }
        .registerInfo .el-form-item__label{
          color: #666;
        }
        .registerStyle{
          width: 500px;
          margin: 0 auto;
        }
        .registerStyle .el-form-item:nth-child(6) .el-form-item__content .el-input,.registerStyle .el-form-item:nth-child(5) .el-form-item__content .el-input  {
          width: 98px;
          text-align: left;
        }
        .registerStyle .el-form-item:nth-child(7) .el-form-item__content,.registerStyle .el-form-item:nth-child(8) .el-form-item__content,.registerStyle .el-form-item:nth-child(9) .el-form-item__content{
          margin-left: 0 !important;
          text-align: center;
        }
        .registerStyle .el-form-item:nth-child(7){
          height: 18px;
          line-height: 18px;
        }
        .registerStyle .el-form-item:nth-child(7) .el-form-item__content{
          height: 18px;
          line-height: 18px;
        }
        .registerStyle .el-form-item:nth-child(7) .el-form-item__content .el-form-item__error{
          left: 106px;
        }
        .registerStyle .el-form-item:nth-child(8){
          margin: 60px 0 36px;
        }
        .registerStyle .el-button{
          height: 34px;
          color: #fff;
          background:#1e87f0;
          padding: 0 0 !important;
        }
        .registerStyle .smsBtn{
          width: 151px;
          margin-left: 8px;
        }
        .registerStyle .agreeBtn{
          font-size: 16px !important;
          width: 260px;
          box-sizing: content-box;
          -moz-box-sizing: content-box;
          -webkit-box-sizing: content-box;
        }
        .registerStyle .toLogin{
          color: #1e87f0;
          font-size: 16px;
          cursor: pointer;
          border-bottom: 1px solid #1e87f0;
        }
        .verificationImg{
          width: 100px;
          height: 40px;
          vertical-align: middle;
          margin-left: 20px;
        }
        .verificationText{
          cursor: pointer;
          color: #333;
          font-size: 14px;
          margin-left: 20px;
        }
        .el-form{
          margin-top: 40px;
          padding-bottom: 10px;
        }
      }
    }
  }
</style>
