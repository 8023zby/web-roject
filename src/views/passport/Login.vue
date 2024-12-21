<template>
  <el-container class="passport-login-div" v-if="isHospital">
    <notice-alert v-if="chromeAlert"></notice-alert>
    <el-header>
      <img src="/static/passport/img/tit_yarward.png" class="passport-login-tit-logo"/>
      <div class="passport-login-tit">{{globalConfig.systemName}}</div>
    </el-header>
    <el-main class="passport-login-main-div">
      <el-container class="passport-login-form-div">
        <el-aside class="passport-login-form-img">
          <img :src="globalConfig.leftImg"/>
        </el-aside>
        <el-main class="passport-login-form-main">
          <div v-if="isShowRegister">
            <el-popover
              ref="userName"
              placement="bottom-start"
              title=""
              popper-class="userName-popover"
              trigger="focus"
              content="输入6-20位英文或数字，区分英文大小写">
            </el-popover>
            <el-popover
              ref="userPassword"
              placement="top-start"
              title=""
              popper-class="userName-popover"
              trigger="focus"
              :content="errorMsg">
            </el-popover>
            <el-popover
              ref="userTelephone"
              placement="bottom-start"
              title=""
              popper-class="userName-popover"
              trigger="focus"
              content="输入11位数字">
            </el-popover>
            <div class="passport-reg-tit">账号注册</div>
            <el-form :model="formRegister" :rules="ruleRegister" ref="formRegister" class="regStyle">
              <el-form-item prop="userName" style="position: relative;">
                <img v-if="regStatus.userName" src="/static/passport/img/icon_fk.png" class="passport-img-input"/>
                <el-input v-popover:userName placeholder="用户名" autocomplete="off" type="text" v-model="formRegister.userName" @blur.prevent="checkUserName"></el-input>
              </el-form-item>
              <el-form-item prop="userPassword" style="position: relative;">
                <img v-if="regStatus.userPassword" src="/static/passport/img/icon_fk.png" class="passport-img-input"/>
                <el-input v-popover:userPassword placeholder="登录密码" autocomplete="new-password" type="password" v-model="formRegister.userPassword"></el-input>
              </el-form-item>
              <el-form-item prop="userTelephone" style="position: relative;">
                <img v-if="regStatus.userTelephone" src="/static/passport/img/icon_fk.png" class="passport-img-input"/>
                <el-input v-popover:userTelephone placeholder="手机号" autocomplete="off" type="text" v-model="formRegister.userTelephone" @blur.prevent="checkTelName" ></el-input>
              </el-form-item>
              <el-form-item prop="photoCode" class="passport-small-input">
                <el-input placeholder="图片验证码" autocomplete="off" type="text" v-model="formRegister.photoCode"></el-input>
                <img @click="clickCode" class="passport-verificationImg" :src="photoCdDt" alt="" />
              </el-form-item>
              <el-form-item prop="smsCode" class="passport-small-input">
                <el-input class="passport-small-input" placeholder="短信验证码" type="text" v-model="formRegister.smsCode"></el-input>
                <el-button :disabled="disabled || formRegister.userTelephone ==='' || phoneFlag" @click="sendCode" class="smsBtn" :loading="codeFlag">{{btnText}}</el-button>
              </el-form-item>
              <el-form-item class="passport-btn-item">
                <el-button class="passport-agreeBtn" v-if="formRegister.userName === '' || formRegister.userPassword === ''|| formRegister.checkPass === ''|| formRegister.userTelephone === ''|| formRegister.photoCode === ''|| formRegister.smsCode === ''" type="primary" disabled @click="registerUser('formRegister')">同意并注册</el-button>
                <el-button v-else class="passport-agreeBtn" @click="registerUser('formRegister')">同意并注册</el-button>
              </el-form-item>
              <el-form-item class="passport-login-btn" style="margin-bottom: 0px !important;">
                <span class="toLogin" @click="toLogin">去登录</span>
              </el-form-item>
            </el-form>
          </div>
          <el-form v-else ref="loginForm" :rules="rules" :model="loginFormFields" :class="{'passport-login-pl':true,'passport-no-code':!isCheckCode}">
            <el-row>
              <el-col :span="24">
                <el-form-item class="passport-login-form-tit">账号密码登录</el-form-item>
              </el-col>
            </el-row>
            <div v-if="globalConfig.orgType === 2">
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="loginName" class="passport-login-userName">
                    <i class="upbsFont icondenglukuangyonghuming passport-login-user-img"></i>
                    <!--<img src="/static/passport/img/userName.png" class="passport-login-user-img"/>-->
                    <el-input v-if="userInfoList.length === 0" class="passport-login-input" v-model="loginFormFields.loginName" :placeholder="placeholderMsg"></el-input>
                    <div name="userName" v-else :class="{'passport-login-input-new': true, 'el-input': true, 'el-input--suffix': true, 'passport-is-focus': userShow}">
                      <input @input="searchUser" name="userName" id="userId" v-model="loginFormFields.loginName" @focus="showIcon" type="text" autocomplete="off" placeholder="请输入账号" class="el-input__inner">
                      <span name="userName" class="el-input__suffix">
                        <span name="userName" class="el-input__suffix-inner">
                          <i name="userNameDel" v-if="userDel && loginFormFields.loginName !== ''" @click.stop="delInfo" class="el-icon-error passport-del-right"></i>
                          <i name="userName" style="cursor: pointer;"
                             @click="showSelectUser"
                             :class="{'is-reverse': userShow,'el-select__caret': true, 'el-input__icon': true, 'el-icon-arrow-up': userShow, 'el-icon-arrow-down': !userShow}"></i>
                        </span>
                      </span>
                    </div>
                    <!--记住账户-->
                    <div name="userName" v-if="userShow" class="passport-user-name el-select-dropdown el-popper" x-placement="bottom-start">
                      <div name="userName" class="el-scrollbar" style="">
                        <div name="userName" class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -8px; margin-right: -8px;">
                          <ul name="userName" class="el-scrollbar__view el-select-dropdown__list">
                            <!---->
                            <li name="userName" @click="selectItem(item)" v-for="(item, index) in searchInfoList" :key="index" class="el-select-dropdown__item">
                              <span name="userName">{{item}}</span>
                              <i name="userName" @click.stop="delUserItem(item)" class="el-icon-error passport-del-cls"></i>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <!---->
                      <div name="userName" x-arrow="" class="popper__arrow" style="left: 35px;"></div>
                    </div>
                    <!--end-->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item prop="loginPassword" class="passport-login-userName">
                  <i class="upbsFont icondenglukuangmima passport-login-user-img passport-login-pwd-img"></i>
                  <!--<img src="/static/passport/img/password.png" class="passport-login-user-img"/>-->
                  <el-input ref="userPass" @input="changeType" @keydown.native="changeText" class="passport-login-input" v-model="loginFormFields.loginPassword" type="text" placeholder="请输入密码"></el-input>                </el-form-item>
              </el-row>
            </div>
            <div v-else>
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="loginName" class="passport-login-userName">
                    <i class="upbsFont icondenglukuangyonghuming passport-login-user-img"></i>
                    <!--<img src="/static/passport/img/userName.png" class="passport-login-user-img"/>-->
                    <el-input class="passport-login-input" v-model="loginFormFields.loginName" :placeholder="placeholderMsg"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item prop="loginPassword" class="passport-login-userName">
                  <i class="upbsFont icondenglukuangmima passport-login-user-img passport-login-pwd-img"></i>
                  <!--<img src="/static/passport/img/password.png" class="passport-login-user-img"/>-->
                  <el-input class="passport-login-input" v-model="loginFormFields.loginPassword" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
              </el-row>
            </div>
            <el-row>
              <el-form-item prop="photoCode" v-if="isCheckCode">
                <el-col :span="16">
                  <i class="upbsFont icondenglukuangyanzhengma passport-login-user-img passport-login-code-img"></i>
                  <el-input class="passport-login-input" v-model="loginFormFields.photoCode" type="text" placeholder="请输入验证码"></el-input>
                </el-col>
                <el-col :span="8">
                  <img @click="clickCode" :src="photoCdDt" class="passport-code">
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
                <div>
                  <span v-if="globalConfig.orgType === 2">
                    <span @click="toSystemApply" style="border-bottom: 1px solid #409EFF;font-size: 14px;" v-if="isAuth === 1">系统授权</span>
                  </span>
                  <span v-else style="font-size: 15px; color: #999999;">
                    <span style="cursor: default;">还没有账号？</span>
                    <span @click="toRegister('')" style="color: #1E87F0; cursor: pointer"> 免费注册</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div class="passport-login-form-bottom-first">
        <div class="passport-login-form-bottom-second"></div>
      </div>
    </el-main>
    <el-footer class="passport-login-footer">
      <span v-if="recordNum === 0"></span>
      <span v-else-if="recordNumDesc === ''">
        <span class="spanLine" @click="openAddress">版权所有&nbsp;©&nbsp;2019&nbsp;YARWARD &nbsp;备案号：鲁ICP备17056434号</span>
      </span>
      <span v-else>
        <span class="spanLine" @click="openAddress">{{recordNumDesc}}</span>
      </span>
    </el-footer>
    <el-dialog title="请选择" :visible.sync="showUnitVis" :show-close="false" width="490px" :close-on-click-modal="false">
      <el-form :rules="rules_unit" :model="unitData" label-width="110px" ref="unitSelect" class="typt-add-dialog">
        <el-form-item v-if="landingEndList.length > 1" label=" 登录应用：" prop="landingEndId">
          <el-select filterable v-model="unitData.landingEndId"  placeholder="请选择" clearable @change="changeDevice">
            <el-option v-for="(item,index) in landingEndList" :key="index" :label="item.landingEndName" :value="item.landingEndId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataDeptInfoList.length > 1 && globalConfig.orgType === 2 && landingEndCode !== 'OPEX'" label="科室：" prop="deptId">
          <el-select filterable v-model="unitData.deptId"  placeholder="请选择" clearable>
            <el-option v-for="(item,index) in dataDeptInfoList" :key="index" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMod">取 消</el-button>
        <el-button type="primary" @click="goLogin()">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="温馨提示" :visible.sync="mesVis" :show-close="false" width="490px" :close-on-click-modal="false">
      <div>很遗憾，需要向您说一声对不起</div>
      <div>您的系统授权时间已经到了，导致您无法继续使用我们的产品</div>
      <div>您可以联系我们的管理人员或再次进行授权</div>
      <div>最后祝您使用愉快!</div>
      <div style="height: 20px;"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMod">取 消</el-button>
        <el-button type="primary" @click="toSystemApply()">去授权</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>

import NoticeAlert from '../../components/passport/NoticeAlert'
import NoticeAlertJs from '../../assets/passport/mixins/NoticeAlert'
import Login from '../../assets/passport/mixins/Login'

export default {
  name: 'Login',
  mixins: [NoticeAlertJs, Login],
  components: { NoticeAlert },
  data () {
    return {
      isHospital: false
    }
  },
  created () {
    if (this.globalConfig.systemId === 'pims' || this.globalConfig.systemId === 'poms') {
      this.$router.push('/loginNew')
    } else {
      this.isHospital = true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/passport/font/iconfont.css";
</style>
<style lang="scss">
  @import '../../assets/passport/css/reg.scss';
  .passport-del-right{
    position: absolute;
    top: 17px;
    right: 30px;
    color: #C8CBD4;
    cursor: pointer;
  }
  .passport-is-focus{
    .el-input__inner{
      border-color: #409EFF;
    }
  }
  .passport-user-name{
    width: 100%;
    position: absolute;
    z-index: 99999;
    min-height: 34px;
    max-height: 180px;
    overflow: auto;
    border-radius: 2px;
    box-shadow: 0px 0px 5px 1px rgba(194, 194, 194, 0.59);
    .el-select-dropdown__item{
      position: relative;
      height: 34px;
      line-height: 34px;
    }
    .passport-del-cls{
      position: absolute;
      color: #C8CBD4;
      top: 10px;
      right: 13px;
    }
    .el-select-dropdown__item:hover{
      transform: translate3d(0, 0, 0);
      box-shadow: 0px 0px 6px 0px rgba(124,124,124,0.3);
      background-color: #ffffff;
      color: #333333;
    }
  }
  .spanLine{
    cursor: pointer;
  }
  .spanLine:hover{
    text-decoration: underline;
    color: #1E87F0;
  }
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
    .passport-login-input .el-input__inner, .passport-login-input-new .el-input__inner{
      height: 50px;
      line-height: 50px;
      text-indent: 30px;
    }
    .passport-login-input-new .el-input__inner{
      padding-right: 50px;
    }
    .passport-login-userName{
      position: relative;
    }
    .passport-login-user-img{
      position: absolute;
      font-size: 22px;
      top:10px;
      color: #666666;
      z-index: 999;
      left: 15px;
    }
    .passport-login-pwd-img{
      top: 8px;
      font-size: 26px;
    }
    .passport-login-code-img{
      top: 9px;
      font-size: 24px;
    }
    .passport-login-code .el-input__inner{
      background: url("/static/passport/img/rightCode.png") no-repeat;
      background-position:5% 50%;
    }
    .passport-code{
      float:right;
      height: 48px;
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
    .passport-no-code {
      .el-form-item{
        margin-bottom: 50px;
      }
    }
    .passport-forgetPassword{
      margin-bottom: 0px !important;
    }
    .passport-forgetPassword .el-form-item__content{
      margin-top: -50px;
      font-size: 12px;
      text-align: right;
      color: #999999;
      cursor: pointer;
    }
    .passport-forgetPassword .el-form-item__content:hover{
      color: #1E87F0;
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
      width: 700px;
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
      vertical-align: middle;
      margin-left: 20px;
    }
    .verificationText{
      cursor: pointer;
      color: #333;
      font-size: 14px;
      margin-left: 20px;
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
      .passport-login-form-tit .el-form-item__content{
        height: 60px;
        line-height: 80px;
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
        margin-bottom: 20px !important;
      }
      .passport-forgetPassword{
        padding-top: 10px;
      }
      .registerInfo .el-dialog{
        height: 600px;
        margin-top: -300px !important;
      }
      .registerInfo .el-form-item {
        margin-bottom: 20px !important;
      }
    }
  }
</style>
