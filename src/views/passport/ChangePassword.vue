<template>
  <div class="passport-forgetPass passport-stepStyle">
    <div class="contant">
      <el-steps :space="326" :active="active"  align-center>
        <el-step title="填写账户"></el-step>
        <el-step title="验证身份"></el-step>
        <el-step title="设置新密码"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div v-if="active===0" class="userPage">
        <el-form :model="formUser" :rules="ruleUser" ref="formUser" label-width="120px" class="user-ruleForm">
          <el-form-item label="用户名：" prop="loginName">
            <el-input v-model="formUser.loginName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="photoCode" class="checkCode">
            <el-input v-model="formUser.photoCode" placeholder="请输入验证码"></el-input>
            <img class="checkImg" :src="codeSrc" alt="" style="height:32px; width:120px; border: 1px solid #e6e6e6"/>
            <span class="changeBtn" @click="changeImg">换一张</span>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="active ===1" class="checkTelPage">
        <el-form :model="formTel" :rules="ruleTel" ref="formTel" label-width="140px" class="user-ruleForm" v-if="isFirst">
          <el-form-item label="已验证手机号：" prop="userTelephone">
            <el-input disabled v-model="formTel.phoneNum"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="photoCodes" class="checkCode">
            <el-input v-model="formTel.photoCodes" placeholder="请输入验证码" ></el-input>
            <img class="checkImg" :src="codeSrc" alt="" style="height:44px; width:120px;"/>
            <span class="changeBtn" @click="changeImg">换一张</span>
          </el-form-item>
          <el-form-item label="手机动态码：" prop="smsCode" class="checkTel">
            <el-input v-model="formTel.smsCode" placeholder="请输入手机动态码"></el-input>
            <el-button class="checkTelBtn" :disabled="disabled" @click="sendCode">{{btnText}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="active ===2" class="passwordPage">
        <el-form :model="formPassword" :rules="rulePassword" ref="formPassword" label-width="138px" class="user-ruleForm">
          <el-form-item label="设置新密码：" prop="userPassword">
            <el-input type="password" v-model="formPassword.userPassword" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="验证新密码：" prop="checkPass">
            <el-input type="password" v-model="formPassword.checkPass" placeholder="请输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else >
        <span class="stepEnd">恭喜！密码重置成功</span>
      </div>
      <el-button v-show="isBack && btnName!=='登录'" @click="back">上一步</el-button>
      <el-button v-show="isNext" @click="next">{{btnName}}</el-button>
      <span v-show="btnName!=='登录'" class="passport-toLogin" @click="toLogin">返回登录</span>
    </div>
  </div>
</template>

<script>
import { getPhotoCode, getTelCode, checkUserGet, checkTelGet, setPasswordGet } from '../../api/passport/login.js'
import { validTel, isvalidPhone } from '../../assets/passport/js/validate.js'
import { MsgShow } from '../../assets/passport/js/Message'
var that = null
export default {
  name: 'changePassword',
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formPassword.checkPass !== '') {
          this.$refs.formPassword.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formPassword.userPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      timeOut: null,
      active: 0,
      btnName: '下一步',
      btnText: '获取短信验证码',
      codeSrc: '',
      disabled: false,
      formDate: {},
      isFirst: true,
      isSecond: false,
      isThree: false,
      isFour: false,
      isNext: true,
      isBack: false,
      setTelTime: 60,
      formUser: {
        loginName: '',
        photoCode: '',
        verifyStr: ''
      },
      formTel: {
        phoneNum: '',
        photoCode: '',
        photoCodes: '',
        smsCode: '',
        verifyStr: ''
      },
      formPassword: {
        userPassword: '',
        checkPass: '',
        userId: '',
        phoneNum: ''
      },
      ruleUser: {
        loginName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
          // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        photoCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      ruleTel: {
        phoneNum: [
          { required: true, validator: validTel(), trigger: 'blur' }
          // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        photoCodes: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
          // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        smsCode: [
          { required: true, message: '请输入手机动态码', trigger: 'blur' }
        ]
      },
      rulePassword: {
        userPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
        checkPass: [{ required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    that = this
    this.getCode()
  },
  beforeDestroy () {
    clearTimeout(this.timeOut)
  },
  methods: {
    toLogin () {
      this.$router.push('/login')
    },
    // 获取验证码
    getCode () {
      getPhotoCode().then(response => {
        if (response.status === 200) {
          this.codeSrc = 'data:image/png;base64,' + response.data.base64Str
          this.formUser.verifyStr = response.data.verifyStr
          this.formTel.verifyStr = response.data.verifyStr
        } else {
          MsgShow('error', response.desc)
        }
      }, response => {
        MsgShow('error', '获取验证码失败！')
      })
    },
    // 点击验证码图片换图片内容
    changeImg () {
      this.getCode()
    },
    // 获取手机验证码
    sendCode () {
      let tel = this.formTel.phoneNum
      let photoCode = this.formTel.photoCodes
      if (tel === '') {
        MsgShow('warning', '请输入手机号码')
      } else if (!isvalidPhone(tel)) {
        MsgShow('warning', '请输入正确的手机号')
      } else if (photoCode === '') {
        MsgShow('warning', '请输入验证码')
      } else {
        getTelCode(this.formTel.phoneNum).then(res => {
          if (res.status === 200) {
            this.timer()
            MsgShow('success', '验证码已发送')
          } else {
            MsgShow('error', '验证码获取失败')
          }
        })
      }
    },
    timer () {
      this.disabled = true
      if (this.setTelTime === 0) {
        this.btnText = '获取短信验证码'
        this.disabled = false
        this.setTelTime = 60
      } else {
        this.btnText = this.setTelTime + 's后重新获取验证码'
        this.setTelTime--
        this.timeOut = setTimeout(function () { that.timer() }, 1000)
      }
    },
    // 上一步
    back () {
      if (this.active-- === 0) this.active = 0
      if (this.active === 3) {
        this.btnName = '登录'
      } else if (this.active === 2) {
        // 移除表单项的校验结果
        this.btnName = '保存'
      } else if (this.active === 1) {
        this.getCode()
        this.btnName = '下一步'
        this.$refs['formPassword'].clearValidate()
      } else if (this.active === 0) {
        this.getCode()
        this.btnName = '下一步'
        this.isBack = false
        this.$refs['formTel'].clearValidate()
      }
      if (this.active === 0) {
        this.isBack = false
      } else {
        this.isBack = true
      }
    },
    validateInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.active === 0) {
            this.checkUserForget()
            this.$refs['formUser'].clearValidate()
          } else if (this.active === 1) {
            this.checkTelForget()
            this.$refs['formTel'].clearValidate()
          } else if (this.active === 2) {
            this.checkPassForget()
          }
          if (this.active === 3) {
            this.btnName = '登录'
          }
        } else {
        }
      })
    },
    next () {
      this.isBack = true
      let formName = ''
      if (this.active === 0) {
        this.isBack = false
        formName = 'formUser'
        this.validateInfo(formName)
      } else if (this.active === 1) {
        this.getCode()
        formName = 'formTel'
        this.validateInfo(formName)
        // this.$refs["ruleTel"].clearValidate();
      } else if (this.active === 2) {
        formName = 'formPassword'
        this.validateInfo(formName)
      } else if (this.active === 3) {
        this.btnName = '登录'
        this.$router.push('/login')
      } else if (this.active++ === 3) {
        this.active = 3
      }
    },
    // 验证用户名和验证码
    checkUserForget () {
      let param = this.formUser
      const loading = this.$loading({
        lock: true,
        background: 'rgba(255, 255, 255, 0.7)'
      })
      checkUserGet(param).then(response => {
        loading.close()
        if (response.status === 200) {
          if (response.data) {
            this.active = 1
            this.isBack = true
            this.formTel.phoneNum = response.data
          }
        } else {
          this.active = 0
          this.isBack = false
          MsgShow('error', response.desc)
        }
        this.formUser.photoCode = ''
        this.getCode()
      }, response => {
        MsgShow('error', '获取数据失败！')
      })
    },
    // 验证手机号和验证码
    checkTelForget () {
      this.formTel.photoCode = this.formTel.photoCodes
      const param = this.formTel
      const loading = this.$loading({
        lock: true,
        background: 'rgba(255, 255, 255, 0.7)'
      })
      checkTelGet(param).then(response => {
        loading.close()
        if (response.status === 200) {
          if (response.data !== undefined || response.data != null) {
            this.formPassword.userId = response.data
            this.active = 2
          } else {
            this.active = 1
          }
        } else {
          this.active = 1
          MsgShow('error', response.desc)
        }
        this.formTel.photoCode = ''
        this.formTel.photoCodes = ''
        this.getCode()
      }, response => {
        loading.close()
        MsgShow('error', '获取数据失败！')
      })
    },
    // 修改密码
    checkPassForget () {
      this.formPassword.phoneNum = this.formTel.phoneNum
      let param = this.formPassword
      const loading = this.$loading({
        lock: true,
        background: 'rgba(255, 255, 255, 0.7)'
      })
      setPasswordGet(param).then(response => {
        loading.close()
        if (response.status === 200) {
          this.active = 3
          this.btnName = '登录'
        } else {
          this.active = 2
          MsgShow('error', response.desc)
        }
      }, response => {
        loading.close()
        MsgShow('error', '获取数据失败！')
      })
    }
  }
}
</script>
<style lang="scss">
  .passport-stepStyle{
    .el-input--small .el-input__inner {
      height: 34px !important;
      line-height: 34px !important;
    }
  }
  .passport-stepStyle .el-steps--horizontal {
    margin: 0 auto 60px;
    padding-top: 59px;
    width: 1304px;
    height: 100%;
  }
  .passport-stepStyle .el-step__icon.is-text {
    border: 5px solid;
    border-color: #eee;
  }
  .passport-stepStyle .el-step__icon{
    width: 66px;
    height: 66px;
    font-size: 28px;
    background: #ddd;
    color: #fff;
  }
  .passport-stepStyle .el-step__icon-inner{
    font-weight: 500;
  }
  .passport-stepStyle .el-step.is-horizontal .el-step__line{
    height: 5px;
    top: 33px;
    background: #ddd;
  }
  .passport-stepStyle .el-step__title.is-process{
    color: #1e87f0;
    font-size: 18px;
    font-weight: 500;
  }
  .passport-stepStyle .el-step__title.is-wait{
    color: #999;
    font-size: 18px;
    font-weight: 500;
  }
  .passport-stepStyle .user-ruleForm .el-form-item__content{
    width: 288px;
    height: 30px;
  }
  .passport-stepStyle .user-ruleForm .el-form-item__content .el-input__inner{
    height: 32px;
    line-height: 32px;
  }
  .passport-stepStyle .user-ruleForm .el-form-item__label{
    font-size: 18px;
    padding: 0 0 0 0;
    color: #333;
    line-height: 32px;
    height: 32px;
  }
  .passport-stepStyle .el-step__head.is-finish .el-step__icon, .passport-stepStyle .el-step__head.is-process .el-step__icon.is-text{
    background: #1e87f0;
  }
  .passport-stepStyle .el-step__head.is-finish .el-step__line, .passport-stepStyle .el-step__head.is-process .el-step__line{
    height: 5px;
    top: 33px;
    background: #1e87f0;
  }
  .passport-stepStyle .el-step__title.is-finish{
    font-size: 18px;
    color: #1e87f0;
  }
  .passport-stepStyle .userPage .el-form .el-form-item:nth-child(2) .el-form-item__content,.passport-stepStyle .checkTelPage .el-form .el-form-item:nth-child(2) .el-form-item__content{
    width: 158px;
  }
  .passport-stepStyle .checkTelPage .el-form .el-form-item:nth-child(3) .el-form-item__content{
    width: 158px;
  }
  .passport-forgetPass .el-button{
    background: #1e87f0;
    color: #fff;
    width: 90px;
    height: 32px;
    padding: 0 0;
    margin: 74px  auto 0;
  }
  .passport-forgetPass .el-form-item__error{
    top: 128%;
  }
  .passport-forgetPass .el-form-item{
    margin-bottom: 30px;
  }
  .passport-forgetPass .el-button+.el-button {
    margin-left: 70px;
  }
</style>
<style scoped>
  .passport-forgetPass{
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  .passport-forgetPass .contant{
    background: #fff;
    margin: 0 auto;
    text-align: center;
    font-size: 18px;
    /*height: 100%;*/
  }
  .user-ruleForm{
    width: 478px;
    margin: 0 auto;
  }
  .checkCode{
    position: relative;
  }
  .checkTel{
    position: relative;
  }

  .checkCode .checkImg{
    position: absolute;
    top: 0px;
    left: 174px;
  }
  .checkCode .changeBtn{
    position: absolute;
    top: 0;
    width: 50px;
    left: 300px;
    cursor: pointer;
    font-size: 16px;
  }
  .checkTel .checkTelBtn{
    position: absolute;
    left: 168px;
    top: 3px;
    margin: 0 0 0;
    width: 200px;
    font-size: 17px;
  }
  .stepEnd{
    color: #1e87f0;
    font-size: 26px;
  }
  .passport-toLogin{
    font-size: 16px;
    margin-left: 30px;
    color: #1E87F0;
    cursor: pointer;
  }
</style>
