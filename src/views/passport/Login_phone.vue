<template>
  <el-container class="passport-login-div">
    <el-header>
      <img src="/static/passport/img/tit_yarward.png" class="passport-login-tit-logo"/>
      <div class="passport-login-tit">{{globalConfig.systemName}}</div>
    </el-header>
    <el-main class="passport-login-main-div">
      <el-container class="passport-login-form-div" v-if="isShow">
        <el-aside class="passport-login-form-img">
          <img :src="globalConfig.leftImg"/>
        </el-aside>
        <el-main class="passport-login-form-main">
          <el-form ref="loginForm" :rules="rules" :model="loginFormFields" class="passport-login-pl">
            <el-row>
              <el-col :span="24">
                <el-form-item class="passport-login-form-tit">手机号登录</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="loginName" class="passport-login-userName">
                  <img src="/static/passport/img/userName.png" class="passport-login-user-img"/>
                  <el-input class="passport-login-input" v-model="loginFormFields.loginName" placeholder="请输入手机号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item prop="photoCode">
                <el-col :span="16">
                  <el-input class="passport-login-input passport-login-code" v-model="loginFormFields.photoCode" type="text" placeholder="请输入验证码"></el-input>
                </el-col>
                <el-col :span="8">
                  <img  @click="clickCode" :src="photoCdDt" class="passport-code">
                </el-col>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item prop="loginPassword" class="passport-login-userName">
                <el-col :span="12">
                  <el-input class="passport-login-input passport-phone-code" v-model="loginFormFields.loginPassword" placeholder="请输入短信验证码"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-button style="float: right;margin-top: 10px;" type="primary" :disabled="disabled_login" @click="sendCode_login" :loading="codeFlag_login">{{btnText_login}}</el-button>
                </el-col>
              </el-form-item>
              <el-form-item class="passport-forgetPassword" v-if="showPassVis">
                <span @click="forgetPass">忘记密码？</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-button @click="submitForm()" class="passport-submit" type="primary" :loading="logining">登&nbsp;录</el-button>
              </el-col>
            </el-row>
            <el-row class="passport-register">
              <el-col :span="24">
                <div @click="toRegister" ><span style="border-bottom: 1px solid #409EFF;font-size: 14px;">还没有账号？免费注册</span></div>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div class="passport-login-form-bottom-first" v-if="isShow">
        <div class="passport-login-form-bottom-second"></div>
      </div>
    </el-main>
    <el-footer class="passport-login-footer">
      版权所有&nbsp;©&nbsp;2019&nbsp;山东亚华电子股份有限公司
    </el-footer>
    <el-dialog title="选择科室" :visible.sync="showUnitVis" @close="cancelMod" width="400px" :close-on-click-modal="false">
      <el-form :rules="rules_unit" :model="unitData" label-width="80px" ref="unitSelect" class="typt-add-dialog">
        <el-form-item label="科室" prop="unitId">
          <el-select v-model="unitData.deptId"  placeholder="请选择科室" clearable>
            <el-option v-for="(item,index) in dataDeptInfoList" :key="index" :label="item.deptName" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goLogin()" :loading="logining">确 认</el-button>
      </div>
    </el-dialog>
    <!--注册-->
    <div v-if="isShowRegister" class="registerInfo">
      <el-dialog title="账号注册" :visible.sync="isShowRegister" :show-close="isShowBtn" :close-on-click-modal="isShowBtn" :close-on-press-escape="isShowBtn">
        <el-form :model="formRegister" :rules="ruleRegister" ref="formRegister" label-width="124px" class="registerStyle" autocomplete="off">
          <el-form-item label="请输入用户名：" prop="userName">
            <el-input type="text" v-model="formRegister.userName" @blur.prevent="checkUserName"></el-input>
          </el-form-item>
          <el-form-item label="设置登录密码：" prop="userPassword">
            <el-input type="password" v-model="formRegister.userPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认登录密码：" prop="checkPass">
            <el-input type="password" v-model="formRegister.checkPass"></el-input>
          </el-form-item>
          <el-form-item v-if="globalConfig.systemId==='pims'||globalConfig.systemId==='poms'"  label="请输入手机号：" prop="userTelephone">
            <el-input type="text" v-model="formRegister.userTelephone" @blur.prevent="checkTelName" ></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="photoCode">
            <el-input type="text" v-model="formRegister.photoCode" style="width: 90px;"></el-input>
            <img class="verificationImg" :src="photoCdDt" alt="" />
            <span @click="clickCode" class="verificationText">换一张</span>
          </el-form-item>
          <el-form-item v-if="globalConfig.systemId==='pims'||globalConfig.systemId==='poms'"  label="动态密码：" prop="smsCode">
            <el-input type="text" v-model="formRegister.smsCode"></el-input>
            <el-button :disabled="disabled" @click="sendCode" class="smsBtn" :loading="codeFlag">{{btnText}}</el-button>
          </el-form-item>
          <el-form-item prop="resource" class="passport-login-btn">
            <el-radio v-model="formRegister.resource" label="1">我已阅读并同意云平台用户协议</el-radio>
          </el-form-item>
          <el-form-item class="passport-login-btn">
            <el-button class="agreeBtn" @click="registerUser('formRegister')">同意并注册</el-button>
          </el-form-item>
          <el-form-item class="passport-login-btn">
            <span class="toLogin" @click="toLogin">去登录</span>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </el-container>
</template>
<script>
// 接口调用
import { postLoginPhone, getPhotoCode, checkLoginGet, getTelCode, regPost, saveUnit } from '../../api/passport/login'
import { isvalidPhone, isvalUserName } from '../../assets/passport/js/validate.js'
import { MsgShow, ResultMsg } from '../../assets/passport/js/Message'
var that = null
export default {
  name: 'Login',
  data () {
    // 验证用户名
    let validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (!isvalUserName(value)) {
        callback(new Error('请输入2-20位，必须包含字母、数字组成，不能包含空格'))
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
      globalConfig: {
        systemId: window.GLOBAL_CONFIG.SYSTEM_ID || 'common',
        isVerifyUnit: window.GLOBAL_CONFIG.IS_VERIFY_UNIT || 1,
        orgType: window.GLOBAL_CONFIG.ORG_TYPE || 2,
        systemName: window.GLOBAL_CONFIG.SYSTEM_NAME || '亚华智慧医院系统',
        leftImg: window.GLOBAL_CONFIG.LOGIN_BG || '/static/passport/img/leftImg.png'
      },
      showUnitVis: false,
      unitData: {
        deptId: ''
      },
      showPassVis: false,
      // 表单字段
      loginFormFields: {
        loginName: '',
        loginPassword: '',
        photoCode: '',
        verifyStr: ''
      },
      photoCdDt: '',
      identifyNum: '',
      // 注册相关--------
      isShowRegister: false,
      isShowBtn: false,
      isShow: true,
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
      codeFlag: false,
      disabled: false,
      btnText: '获取短信验证码',
      setTelTime: 60,
      loading: false,
      logining: false,
      closeFlag: false,
      dataDeptInfoList: [],
      setTelTime_login: 60,
      closeFlag_login: false,
      disabled_login: false,
      btnText_login: '获取短信验证码',
      codeFlag_login: false,
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
      },
      // ------------end---------
      rules_unit: {
        deptId: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ]
      },
      // 验证规则
      rules: {
        loginName: [
          { required: true, validator: validPhone, trigger: 'blur' }
        ],
        loginPassword: [
          {
            required: true,
            message: '请输入短信验证码',
            trigger: 'blur'
          }
        ],
        photoCode: [
          {
            required: true,
            message: '请输入验证码'
          }
        ]
      }
    }
  },
  mounted () {
    that = this
    window.onkeydown = function () {
      if (event.keyCode === 13) {
        that.submitForm()
      }
    }
    if (this.globalConfig.systemId === 'pims' || this.globalConfig.systemId === 'poms') {
      this.formRegister.orgLevel = ''
      this.showPassVis = true
    }
    this.getCode()
  },
  methods: {
    // 取消修改密码
    cancelMod () {
      this.showUnitVis = false
      let pimsEntryData = localStorage.getItem('pimsEntryData')
      localStorage.clear()
      localStorage.setItem('pimsEntryData', pimsEntryData)
      this.getCode()
    },
    // 选择科室后登录
    goLogin () {
      saveUnit(this.dataDeptInfoList[this.unitData.deptId].deptId).then(res => {
        let status = res.status || ''
        let desc = res.desc || ''
        if (status === 200) {
          localStorage.setItem('selectDeptInfo', JSON.stringify(this.dataDeptInfoList[this.unitData.deptId]))
          localStorage.setItem('selectDeptId', this.unitData.deptId)
          this.$router.push({ path: '/main' })
        } else if (desc !== '') {
          MsgShow('error', desc, 3000)
          return false
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
    // 去登录 显示登录页面，隐藏注册页面
    toLogin () {
      this.isShowRegister = false
      this.isShow = true
      this.closeFlag = true
      this.getCode()
    },
    // 去注册
    toRegister () {
      this.getCode()
      this.formRegister = {
        userName: '',
        userPassword: '',
        repactPassword: '',
        userTelephone: '',
        photoCode: '',
        verifyStr: '',
        smsCode: '',
        resource: '1',
        orgLevel: 2
      }
      if (this.globalConfig.systemId === 'pims' || this.globalConfig.systemId === 'poms') {
        this.formRegister.orgLevel = ''
      }
      this.isShowRegister = true
      this.isShow = false
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
              MsgShow('error', response.desc, 3000)
            }
          }, response => {
            loading.close()
            MsgShow('error', '注册失败！', 3000)
            this.getCode()
          })
        }
      })
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
          MsgShow('error', response.desc, 3000)
        }
      }, response => {
        MsgShow('error', '检验用户名失败！')
      })
    },
    // 获取手机验证码
    sendCode () {
      this.closeFlag = false
      let tel = this.formRegister.userTelephone
      let photoCode = this.formRegister.photoCode
      if (tel === '') {
        MsgShow('warning', '请输入手机号码', 3000)
      } else if (!isvalidPhone(tel)) {
        MsgShow('warning', '请输入正确的手机号', 3000)
      } else if (photoCode === '') {
        MsgShow('warning', '请输入验证码', 3000)
      } else {
        this.codeFlag = true
        getTelCode(this.formRegister.userTelephone).then(res => {
          if (res.status === 200) {
            this.timer()
            MsgShow('success', '验证码已发送')
          } else {
            this.codeFlag = false
            MsgShow('error', '验证码获取失败', 3000)
          }
        })
      }
    },
    // 获取手机验证码
    sendCode_login () {
      this.closeFlag_login = false
      let tel = this.loginFormFields.loginName
      let photoCode = this.loginFormFields.photoCode
      if (tel === '') {
        MsgShow('warning', '请输入手机号码', 3000)
      } else if (!isvalidPhone(tel)) {
        MsgShow('warning', '请输入正确的手机号', 3000)
      } else if (photoCode === '') {
        MsgShow('warning', '请输入验证码', 3000)
      } else {
        this.closeFlag_login = true
        getTelCode(this.loginFormFields.loginName).then(res => {
          if (res.status === 200) {
            this.timer_login()
            MsgShow('success', '验证码已发送')
          } else {
            this.closeFlag_login = false
            MsgShow('error', '验证码获取失败', 3000)
          }
        })
      }
    },
    timer_login () {
      this.codeFlag_login = false
      this.disabled_login = true
      if (this.setTelTime_login === 0) {
        this.btnText_login = '获取短信验证码'
        this.disabled_login = false
        this.setTelTime_login = 60
      } else {
        this.btnText_login = this.setTelTime_login + 's后重新获取验证码'
        this.setTelTime_login--
        if (this.codeFlag_login) {
          this.btnText_login = '获取短信验证码'
          this.disabled_login = false
          this.setTelTime_login = 60
        } else {
          setTimeout(function () { that.timer_login() }, 1000)
        }
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
          setTimeout(function () { that.timer() }, 1000)
        }
      }
    },
    // 点击更换
    clickCode () {
      this.getCode()
    },
    // 忘记密码
    forgetPass () {
      this.$router.push({ path: '/changePassword' })
    },
    getCode () {
      // 获取验证码
      let _this = this
      getPhotoCode().then((response) => {
        if (response.status === 200) {
          _this.photoCdDt = 'data:image/png;base64,' + response.data.base64Str
          _this.identifyNum = response.data.verifyStr
          _this.loginFormFields.verifyStr = response.data.verifyStr
          _this.formRegister.verifyStr = response.data.verifyStr
        } else {
          _this.$message({ type: 'error', message: '获取失败' })
        }
      }).catch(() => {
        _this.$message.error('服务器错误')
      })
    },
    // 提交表单
    submitForm () {
      let _this = this
      // 表单验证
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.logining = true
          postLoginPhone({
            loginPhone: this.loginFormFields.loginName,
            loginCode: this.loginFormFields.loginPassword,
            photoCode: this.loginFormFields.photoCode,
            verifyStr: this.loginFormFields.verifyStr,
            orgLevel: this.globalConfig.orgType
          }).then((res) => {
            this.logining = false
            if (res.status === 200) {
              let empInfo = res.data.empInfo || {}
              let deptInfo = res.data.deptInfo || {}
              let orgInfo = res.data.orgInfo || {}
              let jobInfo = res.data.jobInfo || {}
              let token = res.data.token || ''
              let dataDeptInfoList = res.data.dataDeptInfoList || []
              let authorityList = res.data.authorityList || []
              let orgStatus = orgInfo.orgStatus
              let orgId = orgInfo.orgId || ''
              let orgLevel = orgInfo.orgLevel
              let isAdmin = res.data.isAdmin
              // 修改密码操作
              let resetPassword = res.data.resetPassword
              if (typeof resetPassword === 'undefined' || resetPassword === null) {
                resetPassword = ''
              }
              if (typeof isAdmin === 'undefined' || isAdmin === null) {
                isAdmin = false
              }
              if (typeof orgStatus === 'undefined' || orgStatus === null) {
                orgStatus = ''
              }
              if (typeof orgLevel === 'undefined' || orgLevel === null) {
                orgLevel = ''
              }
              // 测试提示
              if (orgStatus === '') {
                console.warn('orgStatus是空的！！！')
              }
              if (typeof empInfo.empName === 'undefined' || empInfo.empName === null) {
                empInfo.empName = this.loginFormFields.loginName
              }
              // 存储范围赋值
              this.dataDeptInfoList = dataDeptInfoList
              localStorage.setItem('userId', this.loginFormFields.loginName)
              localStorage.setItem('empInfo', JSON.stringify(empInfo))
              localStorage.setItem('token', token)
              localStorage.setItem('deptInfo', JSON.stringify(deptInfo))
              localStorage.setItem('orgInfo', JSON.stringify(orgInfo))
              localStorage.setItem('jobInfo', JSON.stringify(jobInfo))
              localStorage.setItem('dataDeptInfoList', JSON.stringify(dataDeptInfoList))
              localStorage.setItem('authorityList', JSON.stringify(authorityList))
              localStorage.setItem('resetPassword', resetPassword)
              localStorage.setItem('hasShowModPas', 'true')
              // 增加养老的跳转
              if (window.GLOBAL_CONFIG.SYSTEM_ID === 'pims' || window.GLOBAL_CONFIG.SYSTEM_ID === 'poms') {
                // 存储养老登录信息
                let pimsOrginfo = {
                  orgLevel: orgLevel,
                  orgStatus: orgStatus,
                  ipAddress: res.data.ipAddress || '',
                  lastLoginTime: res.data.lastLoginTime || '',
                  loginTime: res.data.loginTime || ''
                }
                localStorage.setItem('pimsOrginfo', JSON.stringify(pimsOrginfo))
                if (orgLevel) {
                  if (orgStatus === 0) {
                    const param = {
                      id: orgId,
                      orgStatus: orgStatus
                    }
                    this.$router.push({ path: '/organizationRegister', query: { orgInfo: JSON.stringify(param) } })
                  } else if (orgStatus === 2) {
                    const param = {
                      id: orgId,
                      orgStatus: orgStatus,
                      rejectReason: orgInfo.rejectReason || ''
                    }
                    this.$router.push({ path: '/organizationRegister', query: { orgInfo: JSON.stringify(param) } })
                  } else if (orgStatus === 1) {
                    localStorage.setItem('permissionRuter', JSON.stringify(authorityList))
                    if (this.globalConfig.isVerifyUnit === 1) {
                      if (dataDeptInfoList.length === 0) {
                        this.$router.push({ path: '/main' })
                        return false
                      } else {
                        this.unitData.deptId = 0
                        this.goLogin()
                      }
                    } else {
                      this.$router.push({ path: '/main' })
                    }
                  }
                } else {
                  this.$router.push({ path: '/organizationRegister', query: { id: orgId } })
                }
              } else {
                if (orgLevel === '' || (orgLevel === 2 && orgStatus !== 1)) {
                  this.$router.push('/org_reg')
                  return false
                }
                if (this.globalConfig.isVerifyUnit === 1) {
                  if (orgLevel === 4) {
                    this.$router.push({ path: '/main' })
                  } else if (this.globalConfig.orgType === 2) {
                    localStorage.setItem('unitVersion', 'yes')
                    if (dataDeptInfoList.length > 1) {
                      this.showUnitVis = true
                    } else if (dataDeptInfoList.length === 0) {
                      if (isAdmin === true || isAdmin === 'true') {
                        this.$router.push({ path: '/main' })
                      } else {
                        _this.$message.error('数据存储范围为空，请联系管理员！')
                      }
                      return false
                    } else {
                      this.unitData.deptId = 0
                      this.goLogin()
                    }
                  }
                } else {
                  this.$router.push({ path: '/main' })
                }
              }
            } else {
              _this.$message.error(res.desc)
              _this.getCode()
              this.closeFlag_login = true
            }
          }).catch(() => {
            _this.getCode()
            _this.$message.error('请求失败')
          })
        } else {
          return false
        }
      })
    }
  }

}
</script>
<style lang="scss">
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #fff inset;/*内阴影遮盖背景*/
  }
  .passport-login-div{
    width: 100%;
    height: 100%;
    .passport-login-btn{
      .el-form-item__content{
        margin-left: 0px !important;
        text-align: center !important;
      }
    }
    .passport-login-main-div{
      padding: 0px !important;
      background: #1e87f0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .el-header{
      display: flex;
      align-items: center;
      height: 80px !important;
    }
    .passport-login-tit{
      margin-left: 20px;
      font-size: 24px;
      color: #333333;
    }
    .passport-login-tit-logo{
      height: 40px;
    }
    .passport-login-form-div{
      width: 1170px;
      height: 560px;
      flex: 0 0 auto;
      background: #ffffff !important;
    }
    .passport-login-form-img{
      height: 560px !important;
      width: 700px !important;
      overflow: hidden !important;
    }
    .passport-login-form-bottom-first{
      width: 1120px;
      height: 16px;
      background: rgba(255,255,255,0.8);
    }
    .passport-login-form-bottom-second{
      width: 1080px;
      height: 32px;
      margin-left: auto;
      margin-right: auto;
      background: rgba(255,255,255,0.6);
    }
    .passport-login-form-tit .el-form-item__content{
      text-align: center;
      font-size: 24px !important;
      color: #333333 !important;
      height: 80px;
      line-height: 100px;
    }
    .el-form-item{
      margin-bottom: 40px;
    }
    .passport-login-pl{
      width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    .passport-login-input .el-input__inner{
      height: 50px;
      line-height: 50px;
      text-indent: 30px;
    }
    .passport-login-userName{
      position: relative;
    }
    .passport-login-user-img{
      position: absolute;
      top:15px;
      z-index: 999;
      left: 15px;
    }
    .passport-login-code .el-input__inner{
      background: url("/static/passport/img/password.png") no-repeat;
      background-position:5% 50%;
    }
    .passport-phone-code .el-input__inner{
      background: url("/static/passport/img/rightCode.png") no-repeat;
      background-position:5% 50%;
    }
    .passport-code{
      float:right;
      margin-top:4px;
      height: 40px;
      border: 1px solid #e6e6e6;
    }
    .passport-submit{
      width: 100%;
      height: 50px;
      font-size: 22px !important;
      margin-top: 20px;
      background: #1E87F0;
    }
    .passport-login-footer{
      text-align: center;
      line-height: 60px;
      color: #999999;
    }
    .passport-forgetPassword{
      margin-bottom: 0px !important;
    }
    .passport-forgetPassword .el-form-item__content{
      margin-top: -30px;
      font-size: 15px;
      text-align: left;
      color: #abccf9;
      cursor: pointer;
    }
    .passport-register{
      color: #409EFF;
      font-size: 16px;
      cursor: pointer;
      text-align: center;
      width: 100%;
      padding-top: 20px;
    }
    .registerInfo .el-dialog__header {
      padding: 36px 20px 10px;
      text-align: center;
      .el-dialog__title{
        font-size: 24px !important;
      }
    }
    .registerInfo .el-dialog{
      width: 650px;
      height: 730px;
      position: absolute;
      margin: 0 auto 0;
      top: 50%;
      left: 50%;
      margin-left: -325px;
      margin-top: -365px !important;
    }
    .registerInfo .el-form-item {
      margin-bottom: 32px;
    }
    .registerInfo .el-input{
      width: 260px;
      font-size: 16px;
    }
    .registerInfo .el-form-item__content{
      text-align: left;
      line-height: 34px;
    }
    .registerInfo .el-form-item__label{
      padding: 0 0 0 0;
    }
    .registerInfo .el-dialog__body{
      padding: 38px 0 0;
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
      width: 386px;
      margin: 0 auto;
    }
    .registerStyle .el-form-item:nth-child(6) .el-form-item__content{
      text-align: left;
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
    .registerStyle .el-radio__inner{
      width: 16px;
      height: 16px;
    }
    .registerStyle .el-dialog__title{
      font-size: 24px;
      color: #333;
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
      position: absolute;
      top: -6px;
      right: 55px;
    }
    .verificationText{
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      color: #333;
      font-size: 14px;
    }
  }
  @media screen and (max-width: 1440px) and (max-height: 900px){
    .passport-login-div{
      .passport-login-form-div{
        width: 1000px;
        height: 478px !important;
      }
      .el-header{
        height: 60px !important;
      }
      .passport-login-footer{
        height: 40px !important;
        line-height: 40px;
      }
      .passport-login-tit{
        font-size: 22px;
      }
      .passport-login-tit-logo{
        height: 30px;
      }
      .passport-login-form-img{
        width: 598px !important;
        height: 478px !important;
      }
      .passport-login-pl{
        width: 340px !important;
      }
      .passport-login-form-img img{
        width: 100%;
        height: 100%;
      }
      .passport-login-form-bottom-first{
        width: 870px;
        height: 16px;
        background: rgba(255,255,255,0.8);
      }
      .passport-login-form-bottom-second{
        width: 830px;
      }
      .el-form-item {
        margin-bottom: 20px;
      }
      .passport-forgetPassword{
        padding-top: 10px;
      }
      .registerInfo .el-dialog{
        height: 600px;
        margin-top: -300px !important;
      }
    }
  }
</style>
