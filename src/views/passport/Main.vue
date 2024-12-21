<template>
  <div class="passport_main">
    <notice-alert v-if="chromeAlert"></notice-alert>
    <notice v-if="noticeVis" :noticeData="noticeData" @closeNotice="closeNotice" @detailNotice="detailNotice"></notice>
    <el-container :class="dataTheme">
      <el-header>
        <div v-if="unitVis" class="passport_unitClass">
          <el-select filterable v-model="unitData.deptId"  placeholder="请选择科室" @change="changeUnit">
            <el-option v-for="(item,index) in dataDeptInfoList" :key="index" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </div>
        <div class="passport_logo"><img class="passport_logoImg" :src="mainIcon" /></div>
        <div class="passport_header_right">{{mainName}}</div>
        <div class="passport_header_userInfo">
          <div class="passport_header_emp">
            <!--养老项目个人中心及版本弹框-->
            <div class="userinfo pims-userInfos" v-if="pimsOrginfo.orgLevel===3&&pimsOrginfo.orgStatus===1">
              <el-popover
                popper-class="pims-elPopover"
                placement="bottom"
                width="400"
                trigger="hover">
                <div>
                  <p class="pims-userInfo">账户信息</p>
                  <div class="pims-userLogin">
                    <p>本次登录：<span>{{pimsOrginfo.loginTime}}</span></p>
                    <p>登录IP：<span>{{pimsOrginfo.ipAddress}}</span></p>
                    <p>上次登录：<span>{{pimsOrginfo.lastLoginTime}}</span></p>
                  </div>
                </div>
                <div v-show="pimsorgLog.isShow===0">
                  <div class="pims-logInfos pims-clearFix">
                    <p class="pims-logInfo">版本更新记录</p>
                    <p class="pims-logBtn" @click="lookLogPims">查看</p>
                  </div>
                  <div>
                    <div class="pims-userLogin pims-clearFix">
                      <span class="pims-logTitle">{{pimsorgLog.title}}</span>
                      <span class="pims-logTime">{{pimsorgLog.releaseDate}}</span>
                    </div>
                    <div class="pims-logContent">
                      <pre>{{pimsorgLog.content}}</pre>
                      <p>... ...</p>
                    </div>
                  </div>
                </div>
                <div class="passport_header_circle" slot="reference">
                  <img :src="userIcon" onerror="javascript:this.src='/static/passport/img/noUser.png';" height="30" width="30"/>
                </div>
              </el-popover>
              <el-dialog
                title="版本更新记录"
                :visible.sync="pimsDialog"
                class="pims-versionDialog"
                width="31%">
                <div>
                  <div class="pims-clearFix">
                    <span style="color:#1e87f0;" class="pims-logTitle">ㆍ {{pimsorgLog.title}}</span>
                    <span class="pims-logTime">{{pimsorgLog.releaseDate}}</span>
                  </div>
                  <div class="pims-dialogContent">
                    <pre>{{pimsorgLog.content}}</pre>
                    <p>... ...</p>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                      <el-button @click="pimsDialog = false">取 消</el-button>
                      <el-button type="primary" @click="lookLogPims">查看</el-button>
                    </span>
              </el-dialog>
            </div>
            <!--养老亚华后台-->
            <div class="userinfo pims-userInfos" v-else-if="pimsOrginfo.orgLevel===1">
              <el-popover
                popper-class="pims-elPopover"
                placement="bottom"
                width="400"
                trigger="hover">
                <div>
                  <p class="pims-userInfo">账户信息</p>
                  <div class="pims-userLogin">
                    <p>本次登录：<span>{{pimsOrginfo.loginTime}}</span></p>
                    <p>登录IP：<span>{{pimsOrginfo.ipAddress}}</span></p>
                    <p>上次登录：<span>{{pimsOrginfo.lastLoginTime}}</span></p>
                  </div>
                </div>
                <div class="passport_header_circle" slot="reference">
                  <img :src="userIcon" onerror="javascript:this.src='/static/passport/img/noUser.png';" height="30" width="30"/>
                </div>
              </el-popover>
            </div>
            <div class="passport_header_circle" v-else>
              <img :src="userIcon" style="vertical-align: inherit" onerror="javascript:this.src='/static/passport/img/noUser.png';" height="30" width="30"/>
            </div>
            <div class="passport_header_userName">
              <div class="passport-user-div">你好，{{userName}}</div>
              <div class="passport-dept-div">{{deptName}}</div>
            </div>
          </div>
          <i class="el-icon-lock passport-pass" title="密码修改" @click="modifyPass"></i>
          <i class="el-icon-switch-button passport-pass" style="margin-right: 0" title="注销" @click="logout()"></i>
        </div>
      </el-header>
      <el-container style="height: 90%">
        <el-aside>
          <div v-show="menuShow" class="passport_first_menu" @mouseenter="showScroll" @mouseleave="hideScroll">
            <div class="passport-first-div">
              <vuescroll :ops="ops" style="height: 100%">
                <nav-menu-first :authorityTree="authorityTree" @secondClick="secondClick" ref="nav_menu" :menuNum="menuNum"></nav-menu-first>
              </vuescroll>
              <div v-if="recordNew" class="passport-bottom-new-div" @click="showRecordList()">
                <img class="passport-new-img" src="/static/passport/img/newMes.png" />
              </div>
              <div v-if="deviceData.length>1 && recordNew" class="passport-bottom-line"></div>
              <div v-if="deviceData.length>1" name="changeDevice" :class="{'passport-bottom-change-div':true, 'change-color': deviceVis}" @click="changeDevice">
                <i name="changeDevice" class="upbsFont iconqiehuan passport-btm-check"></i>
              </div>
            </div>
            <!----切换登录应用----->
            <div name="deviceName" class="passport-device-div" v-if="deviceVis">
              <div name="deviceName" v-for="(item, index) in deviceData" :key="index">
                <div name="deviceName" @click="doChangeDevice(item.landingEndId)" :class="{'passport-device-div-item':true,'passport-device-first':item.landingEndId===currentDevice}">{{item.landingEndName}}</div>
              </div>
            </div>
            <div class="passport-mes-show" v-if="newMesShow">
              <div class="passport-mes-show-item">
                系统功能更新啦～
                <i @click="closeNewMes()" class="el-icon-close passport-del-cls"></i>
              </div>
              <div class="passport-mes-show-item">欢迎来Get新功能！</div>
              <div class="passport-mes-show-btn">
                <el-button type="primary" @click="showNewMesDetail()">查看详情</el-button>
              </div>
            </div>
          </div>
          <div class="passport_second_menu">
            <nav-menu v-if="secondShow" :menuNum="menuNum" :authorityTree="authorityTree" :defaultActive="defaultActive" :dataKey="dataKey" :firstName="firstName" @checkMenu="checkMenu"></nav-menu>
          </div>
        </el-aside>
        <el-container>
          <el-footer>
            <div class="passport_main_router_left"></div>
            <div class="passport_main_router_right" v-if="welcomeFlag">
              <i class="upbsFont iconweizhidian passport-router"></i>
              <!--<img src="/static/passport/img/router.png"/>-->
              <span>&nbsp;&nbsp;&emsp;{{menuSelected.selectedMenu.secondMenu}}</span>
              <span style="font-size: 18px;">&nbsp;>&nbsp;</span>
              <span style="color: #333333">{{menuSelected.selectedMenu.thirdMenu}}</span>
            </div>
            <div class="passport_main_router_right" v-else>
              <i class="upbsFont iconweizhidian passport-router"></i>
              <!--<img src="/static/passport/img/router.png"/>-->
              <span>&nbsp;&nbsp;&emsp;{{menuSelected.selectedMenu.firstMenu}}</span>
              <span style="font-size: 18px;">&nbsp;>&nbsp;</span>
              <span v-if="menuSelected.selectedMenu.secondMenu!==''">&nbsp;{{menuSelected.selectedMenu.secondMenu}}</span>
              <span v-if="menuSelected.selectedMenu.secondMenu!==''" style="font-size: 18px;">&nbsp;>&nbsp;</span>
              <span style="color: #333333">{{menuSelected.selectedMenu.thirdMenu}}</span>
            </div>
          </el-footer>
          <el-main v-if="welcomeFlag" class="passport_welcome">
            <div >
              <img class="icon" src='/static/passport/img/welcome-icon.png' />
              <img class="text" src='/static/passport/img/welcome-text.png' />
            </div>
          </el-main>
          <el-main :class="{'passport-full-screen':$route.meta.isFullScreen}" :style="IEStyle" v-if="!welcomeFlag">
            <div class="passport_view">
              <router-view v-if="isRouterAlive" />
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <!--修改密码-->
    <div v-if="modPassVis">
      <el-dialog title="密码修改" :visible.sync="modPassVis" :show-close="false" width="490px" :close-on-click-modal="false">
        <el-form @submit.native.prevent :rules="rules_pass" :model="modPassData" label-width="90px" ref="modPass" class="typt-add-dialog">
          <el-form-item label="密码：" prop="userPassword">
            <el-input type="password" v-model="modPassData.userPassword" autocomplete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelMod">取 消</el-button>
          <el-button type="primary" @click="modPass()" :loading="addVis">确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--A10项目消息提醒组件-->
    <A10 v-if="A10Show" @resetMessage = "initMessageNum"/>
    <!--养老项目消息提醒组件-->
    <pims ref="pimsMes" v-if="pimsShow" @resetMessage = "initPimsMessage" @closeWin="closeWin"/>

    <!--YH803项目消息提醒组件-->
    <YH803 v-if="YH803Show" ref="passportMain" @resetMessage = "initMessageNum"/>

    <!--修改密码-->
    <el-dialog title="修改密码" :visible.sync="passVis" width="580px" :show-close="false" :close-on-click-modal="false">
      <el-form v-if="passVis" :rules="rules" :model="modifyPassForm" label-width="120px" ref="modifyPassForm" class="typt-add-dialog">
        <el-form-item label="旧密码：" prop="oldPass">
          <el-input type="password" v-model="modifyPassForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="userPassword">
          <el-input type="password" v-model="modifyPassForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="checkPass">
          <el-input type="password" v-model="modifyPassForm.checkPass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passVis = false;">取 消</el-button>
        <el-button type="primary" @click="doModify()">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vuescroll from 'vuescroll'
import Menu from '../../components/passport/Menu.vue'
import Notice from '../../components/passport/Notice.vue'
import NoticeAlert from '../../components/passport/NoticeAlert.vue'
import MenuFirst from '../../components/passport/MenuFirst.vue'
import { AxiosApi, AxiosJsonApi } from '../../api/passport/http'
import WebsocetInit from '../../assets/passport/mixins/WebsocetInit'
import { setPassword, saveUnit, getAuthorityMethod, getWarning, loginDevice } from '../../api/passport/login'
import { MsgShow } from '../../assets/passport/js/Message'
import { isvalUserPwd, isvalUserPwdLen } from '../../assets/passport/js/validate'
import NoticeAlertJs from '../../assets/passport/mixins/NoticeAlert'
import MainPims from '../../assets/passport/mixins/MainPims'
var that = null
export default {
  name: 'Main',
  mixins: [WebsocetInit, NoticeAlertJs, MainPims],
  components: {
    'notice-alert': NoticeAlert,
    Notice,
    vuescroll,
    'nav-menu': Menu,
    'nav-menu-first': MenuFirst
  },
  provide () {
    return {
      routerTo: this.routerTo,
      checkAuthority: this.checkAuthority, // 判断是否有权限
      routerToFirst: this.routerToFirst,
      closeNotice: this.closeNotice,
      showNotice: this.showNotice,
      openWebsocket: this.openWebsocket, // 开启组件websocket
      closeWebsocket: this.closeWebsocket, // 关闭组件websocket
      closeWin: this.closeWin, // 关闭弹窗
      closeSocket: this.closeSocket,
      checkMoreAuthority: this.checkMoreAuthority, // 判断多个值是否有权限
      changeTheme: this.changeTheme // 切换主题
    }
  },
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (this.pwdType === 0 && !isvalUserPwd(value)) {
        callback(new Error('请输入6-20位字母+数字，区分大小写'))
      } else if (this.pwdType !== 0 && !isvalUserPwdLen(value)) {
        callback(new Error('密码长度为1-20位'))
      } else {
        if (this.modifyPassForm.checkPass !== '') {
          this.$refs.modifyPassForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      } else if (this.pwdType === 0 && !isvalUserPwd(value)) {
        callback(new Error('请输入6-20位字母+数字，区分大小写'))
      } else if (this.pwdType !== 0 && !isvalUserPwdLen(value)) {
        callback(new Error('密码长度为1-20位'))
      } else if (value !== this.modifyPassForm.userPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    let validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (this.pwdType === 0 && !isvalUserPwd(value)) {
        callback(new Error('请输入6-20位字母+数字，区分大小写'))
      } else if (this.pwdType !== 0 && !isvalUserPwdLen(value)) {
        callback(new Error('密码长度为1-20位'))
      } else {
        callback()
      }
    }
    return {
      pwdType: 0,
      mainName: '',
      mainIcon: '',
      authorityMethods: '',
      unitVis: false,
      unitData: {
        deptId: ''
      },
      dataDeptInfoList: [],
      firstName: '',
      token: '',
      addVis: false,
      modPassVis: false,
      modPassData: {
        userPassword: '',
        userId: ''
      },
      rules_pass: {
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass3, trigger: 'blur' }
        ]
      },
      // 滚动条配置参数
      ops: {
        // 滚动条滚动的地方
        rail: {
          background: '#ffffff',
          opacity: 0,
          size: '8px',
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: '0',
          keepShow: false
        },
        bar: {
          showDelay: 1000,
          size: '8px',
          specifyBorderRadius: false,
          /** 是否只在滚动的时候现实滚动条 */
          onlyShowBarOnScroll: true,
          /** 是否保持显示 */
          keepShow: true,
          /** 滚动条颜色, default -> #00a650 */
          background: '#ffffff',
          /** 滚动条透明度, default -> 1  */
          opacity: 0
        }
      },
      isCollapse: false,
      uniqueOpened: true,
      opened: [],
      dataKey: 0,
      userName: '',
      menuSelected: {
        mainShow: false,
        selectedMenu: {
          firstMenu: '',
          secondMenu: '首页',
          thirdMenu: '欢迎页'
        }
      },
      defaultActive: '', // 默认选中的菜单
      authorityTree: [],
      userIcon: '',
      welcomeImg: window.GLOBAL_CONFIG.WELCOME_BG,
      welcomeFlag: false,
      secondShow: true,
      menuKey: {},
      urlFirst: {},
      hasClick: false,
      A10Show: false, // A10消息提醒组件是否加载
      passVis: false,
      modifyPassForm: {
        userPassword: '',
        checkPass: '',
        oldPass: ''
      },
      rules: {
        oldPass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      IEStyle: 'background: #FAFAFA;',
      pimsShow: false, // 养老消息提醒组件是否加载
      isRouterAlive: true, // 点击菜单时通过隐藏和显示router-view 让他重新请求数据
      pimsOrginfo: {}, // 养老项目机构信息
      pimsorgLog: {}, // 养老项目版本信息
      pimsDialog: false, // 养老项目弹框
      dataTheme: '',
      menuShow: false,
      deptName: '', // 用户所在部门
      newMesShow: false, // 新消息
      deviceVis: false,
      currentDevice: '',
      deviceData: [],
      recordNew: false,
      landingEndCode: '',
      YH803Show: false,
      thatObj: null
    }
  },
  created () {
    that = this
    let host = window.location.host
    if (host === 'www.yahuayun.cn' || host === ' www.yahuayun.com') {
      window.GLOBAL_CONFIG.WELCOME_BG = '/static/passport/img/welcome_org.jpg'
      this.welcomeImg = '/static/passport/img/welcome_org.jpg'
    }
    // 判断登录应用
    this.getLandingEndCode()
    this.initUserInfo()
    let str = localStorage.getItem('dataDeptInfoList')
    this.dataDeptInfoList = JSON.parse(str)
    let unitVersion = localStorage.getItem('unitVersion')
    if (unitVersion === 'yes') {
      if (this.dataDeptInfoList.length > 1) {
        if (this.landingEndCode !== 'OPEX') {
          this.unitVis = true
        }
        let selectDeptId = localStorage.getItem('selectDeptId')
        this.unitData.deptId = selectDeptId
      }
    }
    // 配置内页icon 名称
    this.getSystemConfig()
    // 兼容ie浏览器
    this.checkBrowserByMain()
    this.currentDevice = localStorage.getItem('selectLandingEndId')
  },
  watch: {
    $route () {
      // 更换用户名
      let empInfoStr = localStorage.getItem('empInfo')
      let token = localStorage.getItem('token')
      if (empInfoStr !== '') {
        let empInfo = JSON.parse(localStorage.getItem('empInfo'))
        if (this.userName !== empInfo.empName || token !== this.token) {
          this.initUserInfo('reload')
        }
      }
      if (this.hasClick) {
        this.hasClick = false
      } else {
        let key = this.$route.path
        if (key.indexOf('_fakeRouter') > -1) {
          let arr = key.split('_fakeRouter')
          let index = arr[0].lastIndexOf('/')
          key = arr[0].substring(0, index)
        }
        let toIndex = this.urlFirst[key]
        if (key === '/main') {
          location.reload()
          return
        } else {
          this.welcomeFlag = false
        }
        if (this.dataKey === toIndex) {
          this.initMenuData()
        } else {
          if (typeof toIndex === 'undefined') {
            toIndex = this.dataKey
          }
          this.$refs.nav_menu.changeMenu(toIndex, true)
          setTimeout(() => {
            this.initMenuData()
          }, 200)
        }
      }
    }
  },
  mounted () {
    // 修改密码操作
    let resetPassword = localStorage.getItem('resetPassword')
    let empInfoStr = localStorage.getItem('empInfo')
    let orgInfoStr = localStorage.getItem('orgInfo')
    let hasShowModPas = localStorage.getItem('hasShowModPas')
    let isFirstLogin = localStorage.getItem('isFirstLogin')
    let deptInfoStr = localStorage.getItem('deptInfo')
    let empId = ''
    if (empInfoStr !== '') {
      let empInfo = JSON.parse(localStorage.getItem('empInfo'))
      empId = empInfo.empId
    }
    let orgLevel = null
    if (orgInfoStr !== '') {
      let orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
      orgLevel = orgInfo.orgLevel
    }
    if (deptInfoStr !== '') {
      let deptInfo = JSON.parse(deptInfoStr)
      this.deptName = deptInfo.deptName
    }
    if (typeof orgLevel === 'undefined' || orgLevel === null) {
      orgLevel = ''
    }
    if (orgLevel === 3) {
      this.getSystemColor()
      let state = localStorage.getItem('alertStatus')
      if (state && state === '1') {
        this.chromeAlert = true
      }
      this.recordNew = false
    } else {
      if (orgLevel === 1) {
        this.recordNew = false
      } else {
        this.recordNew = true
      }
      this.dataTheme = 'data-theme-blue'
      this.menuShow = true
    }
    if (resetPassword === 'true' && hasShowModPas === 'true') {
      this.initFirstPass(empId)
      // return false
    } else {
      this.modPassVis = false
    }
    let toPath = localStorage.getItem('toPath')
    let toQuery = localStorage.getItem('toQuery')
    if (toPath !== '') {
      if (toPath.indexOf('_fakeRouter') > -1) {
        let arr = toPath.split('_fakeRouter')
        let index = arr[0].lastIndexOf('/')
        let key = arr[0].substring(0, index)
        this.routerToFirst(key, '', '', '', toPath, '', JSON.parse(toQuery), 'fresh')
      } else if (toPath.indexOf('_welcomePage') > -1) {
        this.$router.push(toPath)
      } else {
        this.routerToFirst(toPath, '', '', '', '', '', JSON.parse(toQuery), 'fresh')
      }
    } else {
      if (orgLevel === 4) {
        this.routerToFirst('/shop')
        return false
      }
    }
    if (isFirstLogin === 'true') {
      this.pageTo()
    } else {
      let path = this.$route.path
      // 控制欢迎页显示
      if (path !== '/main') {
        this.welcomeFlag = false
      } else {
        this.welcomeFlag = true
      }
    }
    // 医疗的时候进行授权检测
    if (orgLevel === 2) {
      this.checkWarning()
      // 检测是否有新的版本记录
      this.getVersion()
    }
    // 查询登录应用数据
    this.getDeviceData()
  },
  methods: {
    // 判断A10菜单权限
    getA10Show () {
      // 判断是否有A10消息提醒菜单
      if (this.checkA10Authority('wnms') && this.checkA10Authority('patientmsg')) {
        this.A10Show = true
      } else {
        this.A10Show = false
      }
      // 判断是否有YH03消息提醒菜单
      if ((this.checkA10Authority('tongxingms') && this.checkA10Authority('gatepeihushenhe')) ||
        (this.checkA10Authority('hesuanms') && this.checkA10Authority('hesuanfucetixing'))) {
        this.thatObj = this.$refs.passportMain
        this.YH803Show = true
      } else {
        this.YH803Show = false
      }
    },
    // 判断是否有权限
    checkA10Authority (code) {
      const d = localStorage.getItem('authorityList')
      if (d.indexOf(`"authorityCode":"${code}",`) > -1) {
        return true
      }
      return false
    },
    // 获取登录应用标识
    getLandingEndCode () {
      let codeStr = localStorage.getItem('selectLandingEndInfo')
      if (codeStr !== '' && codeStr !== null) {
        let tempInfo = JSON.parse(codeStr)
        this.landingEndCode = tempInfo.landingEndCode
      }
    },
    // 查询登录应用数据
    getDeviceData () {
      let landingEndListStr = localStorage.getItem('landingEndList')
      if (landingEndListStr !== '') {
        this.deviceData = JSON.parse(landingEndListStr)
        if (this.deviceData.length > 1) {
          // 监听点击空白方法
          this.bindListener()
        }
      }
    },
    // 检测是否有新的版本记录
    getVersion () {
      AxiosApi('/omms/web-rbac/versions/read', {}, 'GET').then(res => {
        if (res.status === 200) {
          this.newMesShow = res.data === 0
        }
      })
    },
    // 监听点击空白方法
    bindListener () {
      window.addEventListener('click', (e) => {
        let obj = e.target || e.srcElement
        let name = obj.getAttribute('name')
        if (name !== 'deviceName' && name !== 'changeDevice') {
          this.deviceVis = false
        }
      })
    },
    // 点击切换登录应用
    doChangeDevice: function (id) {
      this.currentDevice = id
      this.deviceVis = false
      loginDevice(id).then(res => {
        let status = res.status || ''
        let desc = res.desc || ''
        let data = res.data
        if (status === 200) {
          // 当前登录应用信息进行修改
          let landingEndListStr = localStorage.getItem('landingEndList')
          let landingEndCode = ''
          if (landingEndListStr !== '' && landingEndListStr !== null) {
            let landingEndList = JSON.parse(landingEndListStr)
            landingEndList.forEach(item => {
              if (id === item.landingEndId) {
                localStorage.setItem('selectLandingEndInfo', JSON.stringify(item))
                landingEndCode = item.landingEndCode
              }
            })
          }

          // 是否显示部门
          if (landingEndCode === 'OPEX') {
            this.unitVis = false
          } else {
            if (this.dataDeptInfoList.length > 1) {
              this.unitVis = true
            }
          }

          localStorage.setItem('selectLandingEndId', id)
          localStorage.setItem('authorityList', JSON.stringify(data))
          localStorage.removeItem('authPageUrl')
          if (window.GLOBAL_CONFIG.SYSTEM_ID === 'pims' || window.GLOBAL_CONFIG.SYSTEM_ID === 'poms') {
            localStorage.setItem('permissionRuter', JSON.stringify(data))
          }
          // 刷新页面
          this.initUserInfo('reload2')
          // window.location.reload()
        } else if (desc !== '') {
          this.logining = false
          MsgShow('error', desc, 3000)
          return false
        }
      })
    },
    // 切换登录应用
    changeDevice () {
      this.deviceVis = !this.deviceVis
    },
    // 关闭新信息框
    closeNewMes () {
      this.newMesShow = false
    },
    // 查看详情
    showNewMesDetail () {
      AxiosApi('/omms/web-rbac/versions/read').then(res => {
        if (res.status === 200) {
          this.showRecordList()
        } else {
          MsgShow('error', res.desc, 3000)
        }
      })
    },
    // 跳转到升级记录页面
    showRecordList () {
      this.newMesShow = false
      this.$router.push({ path: '/versionLog_noneRouter' })
    },
    // 换肤
    changeTheme (className) {
      this.dataTheme = className
    },
    // 兼容IE浏览器
    checkBrowserByMain () {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        let width = window.screen.width
        let mainWidth = width - 210
        this.IEStyle = `background: #FAFAFA;width:${mainWidth}px;`
        document.getElementsByTagName('body')[0].style.setProperty('--IeBrower', '#f5f7fa')
      }
      let userAgent = navigator.userAgent
      if (userAgent.indexOf('Edge') > -1) {
        document.getElementsByTagName('body')[0].style.setProperty('--IeBrower', '#f5f7fa')
      }
    },
    // 初始化密码
    initFirstPass (empId) {
      AxiosApi('/passport/web-rbac/systemConfigs/pwdConfig', {}, 'GET').then(res => {
        if (res.status === 200) {
          let data = res.data
          if (data !== null) {
            this.pwdType = data
          }
        }
        this.modPassVis = true
        this.modPassData.userPassword = ''
        this.modPassData.userId = empId
        window.onkeydown = function (event) {
          if (event.keyCode === 13) {
            if (that.modPassVis && !that.addVis) {
              that.modPass()
            }
          }
        }
        localStorage.setItem('hasShowModPas', 'false')
      })
    },
    // 查询密码配置
    modifyPass () {
      AxiosApi('/passport/web-rbac/systemConfigs/pwdConfig', {}, 'GET').then(res => {
        if (res.status === 200) {
          let data = res.data
          if (data !== null) {
            this.pwdType = data
          }
        }
        this.showModifyPass()
      })
    },
    // 查询后台配置
    getSystemConfig () {
      AxiosApi('/passport/web-rbac/systemConfigs/iconConfig', {}, 'GET').then(res => {
        if (res.status === 200) {
          let data = res.data
          if (data.windowIcon === null)data.windowIcon = ''
          if (data.windowName === null)data.windowName = ''
          if (data.systemIcon === null)data.systemIcon = ''
          if (data.systemName === null)data.systemName = ''
          this.mainName = data.systemName || '山东亚华电子股份有限公司'
          this.mainIcon = data.systemIcon || '/static/passport/img/yarward.png'
          this.mainIcon = this.mainIcon + '?time=' + new Date().getTime()
          this.loadFav(data.windowIcon)
          this.loadTitle(data.windowName)
        } else {
          this.mainName = '山东亚华电子股份有限公司'
          this.mainIcon = '/static/passport/img/yarward.png?time=' + new Date().getTime()
          this.loadTitle()
          this.loadFav()
        }
      })
    },
    // 设置标题
    loadTitle (tit) {
      if (tit) {
        document.title = tit
      } else {
        document.title = window.GLOBAL_CONFIG.SYSTEM_NAME || '亚华智慧医院系统'
      }
    },
    // 设置ICON
    loadFav (icon) {
      if (icon) {
        document.getElementById('icon_yarward').href = icon
      } else {
        document.getElementById('icon_yarward').href = window.GLOBAL_CONFIG.FAV_ICON || './static/passport/img/favicon.ico'
      }
    },
    // 检测是否到期
    checkWarning () {
      getWarning().then(res => {
        if (res.status === 200) {
          if (res.data === true) {
            this.$alert('授权日期临近，请尽快延长授权，否则将影响您的正常使用', '授权提醒', {
              confirmButtonText: '延长授权',
              showCancelButton: true,
              showClose: false,
              callback: action => {
                this.routerToFirst('/systemLicense')
              }
            })
          }
        }
      })
    },
    // 修改密码
    showModifyPass (row) {
      this.passVis = true
      this.modifyPassForm = {
        userPassword: '',
        checkPass: '',
        oldPass: ''
      }
    },
    // 修改密码
    doModify () {
      let empInfo = JSON.parse(localStorage.getItem('empInfo'))
      let empId = empInfo.empId
      this.$refs['modifyPassForm'].validate((valid) => {
        if (valid) {
          AxiosJsonApi(
            `/passport/web-rbac/logins/userPwd`,
            {
              userId: empId,
              oldPwd: this.modifyPassForm.oldPass,
              newPwd: this.modifyPassForm.userPassword
            },
            'PUT'
          ).then(res => {
            if (res.status === 200) {
              MsgShow('success', `修改密码成功,请重新登录！`)
              let pimsEntryData = localStorage.getItem('pimsEntryData')
              let userInfo = localStorage.getItem('yhUserInfo')
              let userInfoList = localStorage.getItem('yhUserInfoList')
              localStorage.clear()
              localStorage.setItem('pimsEntryData', pimsEntryData)
              localStorage.setItem('yhUserInfo', userInfo)
              localStorage.setItem('yhUserInfoList', userInfoList)
              setTimeout(() => {
                this.$router.push('/login')
              }, 1500)
            } else {
              MsgShow('error', res.desc, 3000)
            }
          })
        }
      })
    },
    // 获取所有动作权限
    loadAuthorityMethod () {
      getAuthorityMethod().then(res => {
        if (res.status === 200) {
          this.authorityMethods = JSON.stringify(res.data)
          localStorage.setItem('authorityMethods', this.authorityMethods)
          this.getA10Show()
        }
      })
    },
    // 判断是否有权限
    checkAuthority (code) {
      let d = this.authorityMethods
      if (d === '') {
        d = localStorage.getItem('authorityMethods')
      }
      if (d.indexOf(`"authorityCode":"${code}",`) > -1) {
        return true
      }
      return false
    },
    // 判断多个值是否有权限
    checkMoreAuthority (code) {
      let d = this.authorityMethods
      if (d === '') {
        d = localStorage.getItem('authorityMethods')
      }
      let temp = {}
      code.forEach((item) => {
        let flag = false
        if (d.indexOf(`"authorityCode":"${item}",`) > -1) {
          flag = true
        }
        temp[item] = flag
        // temp[item] = false
      })
      return temp
    },
    // 跳转到配置首页
    pageTo () {
      localStorage.setItem('isFirstLogin', 'false')
      AxiosApi('/passport/web-rbac/systemConfigs/loginPageConfig', {}, 'GET').then(res => {
        if (res.status === 200) {
          if (res.data !== '' && res.data !== null) {
            if (res.data.indexOf('_welcomePage') > -1) {
              this.$router.push(res.data)
            } else if (this.urlFirst[res.data] !== undefined) {
              this.routerToFirst(res.data)
            } else {
              this.$router.push(res.data)
            }
            if (res.data === '/main') {
              this.welcomeFlag = true
            } else {
              localStorage.setItem('firstUrl', res.data)
            }
            localStorage.setItem('welcomeRouter', res.data)
          } else {
            this.welcomeFlag = true
          }
        } else {
          this.welcomeFlag = true
        }
      })
    },
    // 切换科室
    changeUnit () {
      saveUnit(this.unitData.deptId).then(res => {
        let status = res.status || ''
        let desc = res.desc || ''
        if (status === 200) {
          let temp = this.dataDeptInfoList.find(item => {
            return item.deptId === this.unitData.deptId
          })
          localStorage.setItem('selectDeptInfo', JSON.stringify(temp))
          localStorage.setItem('selectDeptId', this.unitData.deptId)
          window.location.reload()
        } else if (desc !== '') {
          MsgShow('error', desc, 3000)
          return false
        }
      })
    },
    // 取消修改密码
    cancelMod () {
      this.modPassVis = false
      window.onkeydown = function (event) {}
    },
    // 密码修改
    modPass () {
      this.$refs['modPass'].validate((valid) => {
        if (valid) {
          this.addVis = true
          setPassword(this.modPassData).then(response => {
            if (response.status === 200) {
              let pimsEntryData = localStorage.getItem('pimsEntryData')
              let userInfo = localStorage.getItem('yhUserInfo')
              let userInfoList = localStorage.getItem('yhUserInfoList')
              localStorage.clear()
              localStorage.setItem('pimsEntryData', pimsEntryData)
              localStorage.setItem('yhUserInfo', userInfo)
              localStorage.setItem('yhUserInfoList', userInfoList)
              MsgShow('success', `修改密码成功,请重新登录！`)
              setTimeout(() => {
                this.addVis = false
                this.$router.push('/login')
              }, 1500)
            } else {
              this.addVis = false
              MsgShow('error', response.desc, 3000)
            }
          })
        }
      })
    },
    // 初始化用户信息
    initUserInfo (act = '') {
      let path = this.$route.path
      let str = localStorage.getItem('authorityList')
      if (str !== '') {
        let authorityList = JSON.parse(localStorage.getItem('authorityList'))
        this.authorityTree = authorityList
        this.urlFirst = {}
        this.menuKey = {}
        this.getChild(authorityList, 'first')
        authorityList.forEach((item, index) => {
          this.menuKey[item.authorityCode] = index
        })
        if (path === '/errorInfo') {
          this.menuSelected.selectedMenu.firstMenu = '首页'
          this.menuSelected.selectedMenu.secondMenu = ''
          this.menuSelected.selectedMenu.thirdMenu = '404'
        } else if (path.indexOf('_welcomePage') > -1) {
          this.menuSelected.selectedMenu.firstMenu = '首页'
          this.menuSelected.selectedMenu.secondMenu = ''
          this.menuSelected.selectedMenu.thirdMenu = '欢迎页'
        } else if (path.indexOf('_noneRouter') > -1) {
          this.menuSelected.selectedMenu.firstMenu = '首页'
          this.menuSelected.selectedMenu.secondMenu = ''
          this.menuSelected.selectedMenu.thirdMenu = '版本更新记录'
        } else {
          this.menuSelected.selectedMenu.firstMenu = this.authorityTree[0].authorityName || ''
          this.firstName = this.authorityTree[0].authorityName || ''
        }
      }
      let empInfoStr = localStorage.getItem('empInfo')
      let token = localStorage.getItem('token')
      this.token = token
      if (empInfoStr !== '') {
        let empInfo = JSON.parse(localStorage.getItem('empInfo'))
        this.userName = empInfo.empName || ''
        this.userIcon = empInfo.workingPicture || '/static/passport/img/noUser.png'
      }
      // 养老专属
      if (window.GLOBAL_CONFIG.SYSTEM_ID === 'pims' || window.GLOBAL_CONFIG.SYSTEM_ID === 'poms') {
        // 消息提醒
        this.pimsShow = true
        // 养老项目登录弹框
        let pimsOrg = localStorage.getItem('pimsOrginfo')
        if (pimsOrg !== '' && pimsOrg !== null) {
          this.pimsOrginfo = JSON.parse(localStorage.getItem('pimsOrginfo'))
          if (this.pimsOrginfo.orgLevel === 3) {
            this.getPimsLog()
          }
        }
      }
      // 重新请求动作按钮权限
      this.loadAuthorityMethod()

      // 针对登录端切换单独判断
      if (act === 'reload2') {
        let firstUrl = localStorage.getItem('firstUrl')
        let toUrl = path
        if (firstUrl && firstUrl !== null) {
          toUrl = firstUrl
        }
        if (this.urlFirst[toUrl] === undefined) {
          this.secondShow = false
          this.$nextTick(() => {
            this.$router.push('/main')
            this.secondShow = true
          })
        } else {
          this.secondShow = false
          this.$nextTick(() => {
            this.secondShow = true
            this.routerToFirst(toUrl)
          })
        }
      }

      // 判断是否要刷新页面 并定位当前菜单
      if (act === 'reload') {
        if (this.urlFirst[path] === undefined) {
          this.secondShow = false
          this.$nextTick(() => {
            this.$router.push('/main')
            this.secondShow = true
          })
        } else {
          this.routerToFirst(path)
        }
      }
    },
    // 赋值
    initMenuData () {
      let key = this.$route.path
      if (key.indexOf('_fakeRouter') > -1) {
        let arr = key.split('_fakeRouter')
        let index = arr[0].lastIndexOf('/')
        key = arr[0].substring(0, index)
      }
      let dom = document.querySelector(`span[url='${key}']`)
      if (dom) {
        this.welcomeFlag = false
        let curName = dom.innerText
        let pName = dom.getAttribute('pName')
        let firstName = dom.getAttribute('fName')
        this.defaultActive = key
        this.menuSelected.selectedMenu.firstMenu = firstName
        this.firstName = firstName
        this.menuSelected.selectedMenu.secondMenu = pName
        this.menuSelected.selectedMenu.thirdMenu = curName
        this.secondShow = false
        this.$nextTick(() => {
          this.secondShow = true
        })
      }
      if (key.indexOf('_welcomePage') > -1) {
        this.menuSelected.selectedMenu.firstMenu = '首页'
        this.menuSelected.selectedMenu.secondMenu = ''
        this.menuSelected.selectedMenu.thirdMenu = '欢迎页'
      }
    },
    // 递归划分菜单
    getChild (data, key) {
      data.forEach((item, index) => {
        if (item.pageUrl !== null) {
          item.pageUrl = item.pageUrl.replace('http://www.yarward.com', '')
        }
        if (item.child && item.child.length > 0) {
          if (item.pageUrl !== '' && item.pageUrl !== null) {
            this.urlFirst[item.pageUrl] = key
          }
          if (key === 'first') {
            this.getChild(item.child, index)
          } else {
            this.getChild(item.child, key)
          }
        } else {
          if (item.pageUrl !== '' && item.pageUrl !== null) {
            this.urlFirst[item.pageUrl] = key
          }
        }
      })
    },
    // 显示滚动条轨道
    showScroll () {
      let dom = document.getElementsByClassName('__rail-is-vertical')
      let bar = document.getElementsByClassName('__bar-is-vertical')
      if (dom.length > 0) {
        dom[0].style.background = 'rgba(255,255,255,0.5)'
        bar[0].style.opacity = '0.8'
      }
    },
    // 隐藏滚动条
    hideScroll () {
      let dom = document.getElementsByClassName('__rail-is-vertical')
      let bar = document.getElementsByClassName('__bar-is-vertical')
      if (dom.length > 0) {
        dom[0].style.background = 'rgba(255,255,255,0)'
        bar[0].style.opacity = '0'
      }
    },
    // 注销
    logout () {
      this.$confirm(`确定要注销吗？`, '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        AxiosApi('/passport/web-rbac/logins/loginOut', {}, 'GET').then(res => {
          let { status } = res
          if (status === 200) {
            let pimsEntryData = localStorage.getItem('pimsEntryData')
            let userInfo = localStorage.getItem('yhUserInfo')
            let userInfoList = localStorage.getItem('yhUserInfoList')
            localStorage.clear()
            localStorage.setItem('pimsEntryData', pimsEntryData)
            localStorage.setItem('yhUserInfo', userInfo)
            localStorage.setItem('yhUserInfoList', userInfoList)
            this.closeSocket()
            this.$message({
              message: '注销成功',
              type: 'success',
              duration: 900
            })
            setTimeout(() => {
              this.$router.push('/login')
            }, 1000)
          } else {
            this.$message.warning('注销失败!')
          }
        })
      })
    },
    // 切换二级菜单数据
    secondClick (key, isReload = true) {
      if (key === this.dataKey) return false
      this.secondShow = false
      this.$nextTick(() => {
        this.secondShow = true
      })
      this.dataKey = key
      this.firstName = this.authorityTree[key].authorityName || ''
      // 刷新页面不需要再进行选中第一个菜单操作
      if (!isReload) {
        // 1.7需求 点击一级菜单默认选中二级或三级第一个
        let menuData = this.authorityTree[key].child
        let toRouter = ''
        let curName = ''
        let pName = ''
        if (menuData.length > 0) {
          let thirdData = menuData[0].child
          if (thirdData.length === 0) {
            curName = menuData[0].authorityName
            toRouter = menuData[0].pageUrl
          } else {
            pName = menuData[0].authorityName
            curName = thirdData[0].authorityName
            toRouter = thirdData[0].pageUrl
          }
          this.checkMenu(toRouter, curName, pName, '', this.firstName, {}, 'fresh')
        }
      }
    },
    // 点击菜单
    checkMenu (key, curName, pName, realKey = '', firstName = '', toQuery = {}, isReload = '') {
      this.hasClick = true
      this.welcomeFlag = false
      this.menuSelected.mainShow = true
      this.menuSelected.selectedMenu.firstMenu = firstName
      this.firstName = firstName
      this.menuSelected.selectedMenu.secondMenu = pName
      this.menuSelected.selectedMenu.thirdMenu = curName
      this.defaultActive = key
      if (isReload === 'fresh') {
        if (realKey === '') {
          this.$router.push({ path: `${key}`, query: toQuery })
        } else {
          this.$router.push({ path: `${realKey}`, query: toQuery })
        }
      } else {
        this.isRouterAlive = false
        if (realKey === '') {
          this.$router.push({ path: `${key}`, query: toQuery })
        } else {
          this.$router.push({ path: `${realKey}`, query: toQuery })
        }
        setTimeout(() => {
          this.isRouterAlive = true
        }, 200)
      }
    },
    // 同级跳转改变菜单用
    routerTo (key, curName = '', pName = '', realKey = '', firstName = '', toQuery = {}, isReload) {
      if (curName === '') {
        let dom = document.querySelector(`span[url='${key}']`)
        curName = dom.innerText
        pName = dom.getAttribute('pName')
        firstName = dom.getAttribute('fName')
      }
      this.defaultActive = key
      this.secondShow = false
      this.$nextTick(() => {
        this.secondShow = true
      })
      this.checkMenu(key, curName, pName, realKey, firstName, toQuery, isReload)
    },
    // 跳转一级改变菜单用
    routerToFirst (key, curName = '', pName = '', firstCode = '', realKey = '', firstName = '', toQuery = {}, isReload = true) {
      if (firstCode === '') {
        this.$refs.nav_menu.changeMenu(this.urlFirst[key], isReload)
      } else {
        this.$refs.nav_menu.changeMenu(this.menuKey[firstCode], isReload)
      }
      setTimeout(() => {
        this.routerTo(key, curName, pName, realKey, firstName, toQuery, isReload)
      }, 200)
    },
    // 获取养老机构版本更新记录
    getPimsLog () {
      AxiosApi('/pims/web-org/versionRecord/isShow', {}, 'GET').then(res => {
        let { status } = res
        if (status === 200) {
          if (res.data) {
            this.pimsorgLog = res.data
            if (this.pimsorgLog.isShow === 0 && this.pimsorgLog.isLook === 0) {
              this.pimsDialog = true
            }
          }
        }
      })
    },
    // 查看养老机构版本更新记录
    lookLogPims () {
      AxiosApi(`/pims/web-org/versionRecord/${this.pimsorgLog.recordId}`, {}, 'PUT').then(res => {
        let { status } = res
        if (status === 200) {
          this.pimsDialog = false
          // this.routerToFirst('/home', '', '', '','/versionsLog');
          this.$router.push({ path: '/versionsLog' })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.pims-elPopover{
  padding: 0!important;
  padding-bottom: 20px!important;
  width: 470px!important;
}
.passport_unitClass{
  .el-input__inner{
    border: none;
    color: #3C9EFD;
    font-size: 18px;
  }
  .el-input__icon{
    line-height: 50px;
  }
  .el-icon-arrow-up{
    color: #3C9EFD !important;
    font-size: 18px !important;
  }
}
.passport-mes-show-btn{
  padding-top: 20px;
  .el-button{
    width: 80px;
    height: 28px;
    padding: 0;
    line-height: 28px;
  }
}
</style>
<style lang="scss" scoped>
@import "../../assets/passport/font/iconfont.css";
.passport-device-div{
  position: absolute;
  width: 182px;
  background: #FFFFFF;
  box-shadow: 0px 0px 6px 0px rgba(125, 125, 125, 0.3);
  bottom: 55px;
  z-index: 99999;
  border-radius: 2px;
  left: 45px;
  max-height: 170px;
  overflow: auto;
}
.passport-device-div-item{
  width: 182px;
  height: 34px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  padding-left: 24px;
  box-sizing: border-box;
  color: #333333;
  line-height: 34px;
  font-size: 14px;
  cursor: pointer;
  &:hover{
    background-color: #ecf5ff;;
  }
}
.passport-device-first{
  color: #1E87F0;
  background: #E4F1FF;
}
.passport-mes-show{
  padding-top: 18px;
  width: 190px;
  height: 125px;
  background: #303133;
  border-radius: 4px;
  position: absolute;
  left: 75px;
  bottom: 25px;
  z-index: 99999;
  flex-flow: column;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  &:before{
    content: "";
    position: absolute;
    left: -10px;
    top: 53px;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-right: 10px solid #303133;
    border-bottom: 5px solid transparent;
  }
}
.passport-mes-show-item{
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  position: relative;
}
.passport-del-cls{
  position: absolute;
  right: -35px;
  top:-25px;
  color: #C6C6C6;
  cursor: pointer;
}
.passport-first-div{
  display: flex;
  flex-flow: column;
  height: 100%;
}
.passport-bottom-new-div{
  flex: 0 0 70px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  /*&:after{
    content: "";
    position: absolute;
    width: 60%;
    height: 2px;
    background-color: #83B9EE;
    bottom: 0;
  }*/
}
.passport-bottom-line{
  width: 60%;
  height: 2px;
  margin: 0 auto;
  background-color: #83B9EE;
}
.passport-bottom-change-div{
  flex: 0 0 60px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.change-color{
  background-color: #1D80D3;
}
.passport-btm-check{
  font-size: 38px;
  color: #C5E0FB;
}
.passport-router{
  position: absolute;
  top: 2px;
  color: #1E87F0;
}
.passport-pass{
  font-size: 21px;
  color: #1e87f0;
  margin-top: 15px;
  float: left;
  margin-right: 10px;
  cursor: pointer;
}
.passport-pass:hover{
  color: #1a72ba;
}
.el-select-dropdown__item /deep/{
  font-size: 16px;
  font-weight:500;
}
.passport-full-screen{
  padding: 0px !important;
}
.passport_main{
  width: 100%;
  height: 100%;
  position: relative;
  .passport_unitClass{
    position: absolute;
    width: 200px;
    left: 48%;
    .el-input__inner{
      border: none !important;
    }
  }
  .passport_header_right{
    float: left;
    padding-left:20px ;
  }
  .passport_logo{
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    float: left;
  }
  .passport_logoImg{
    width: 56px;
    height: 15px;
  }
  .passport_header_userInfo{
    float: right;
  }
  .passport_header_emp{
    float:left;
    margin-right: 28px;
    display: flex;
  }
  .passport_header_circle{
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin-top: 10px;
    overflow: hidden;
  }
  .passport_header_userName{
    color: #666666;
    margin-left: 13px;
    height: 50px;
    box-sizing: border-box;
    .passport-user-div{
      height: 25px;
      display: flex;
      align-items: flex-end;
      box-sizing: border-box;
      line-height: 1;
      font-size: 14px;
      color: #333333;
    }
    .passport-dept-div{
      height: 25px;
      display: flex;
      line-height: 1;
      padding-top: 5px;
      box-sizing: border-box;
      font-size: 14px;
      color: #999999;
    }
  }
  .el-container{
    height: 100%;
  }
  .el-main{
    height: 600px;
  }
  .passport_view{
    background: #ffffff;
    width: 100%;
    height: 100%;
    box-shadow: 2px 2px 10px #cccccc;
    overflow: auto;
  }
  .el-header{
    background-color: #FFFFFF;
    color: #666666;
    padding-left: 0px;
    line-height: 50px;
    height: 50px !important;
    font-size: 14px;
    box-shadow: 5px 2px 10px #cccccc;
  }
  .el-footer{
    padding: 0px !important;
    height: 42px !important;
    line-height: 40px;
    border-bottom: 1px solid #EBEEED;
    display: flex;
  }
  .passport_main_router_left{
    width: 5px;
    background: #1D87EF;
  }
  .passport_main_router_right{
    padding-left: 10px;
    color: #666666;
    font-size: 14px;
    position: relative;
  }
  .passport_main_router_right img{
    position: absolute;
    top:14px;
  }
  .el-aside {
    color: #ffffff;
    text-align: left;
    overflow: hidden;
    width: 210px !important;
    height: 100%;
    display: flex;
    border-right: 1px solid #cccccc;
  }
  .passport_first_menu{
    width: 60px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    flex:0 0 auto;
  }
  .passport_second_menu{
    width: 150px;
    height: 100%;
    padding-top: 4px;
  }
  .passport_welcome{
    padding: 0px !important;
    overflow: hidden;
    div {
      background-image: url('/static/passport/img/welcome-bg.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
    }
    .icon {
      width: 450px;
    }
    .text {
      width: 740px;
      margin-bottom: 10%;
      margin-top: 60px;
    }
  }
}
/*养老项目个人中心及弹框样式*/
.pims-userInfo,.pims-logInfos,.pims-userLogin{
  width: 100%;
  color: #666;
  box-sizing: border-box;
}
.pims-userInfo,.pims-logInfos{
  border-bottom: 2px solid #ececec;
  height: 50px;
  line-height: 50px;
  font-size: 17px;
  padding:0 32px 0 27px;

}
.pims-userLogin{
  font-size: 16px;
  padding: 18px 32px 8px 27px;
  p{
    line-height: 42px;
    span{
      color: #333;
    }
  }
}
.pims-logTitle,.pims-logInfo{
  float: left;
}
.pims-logTime,.pims-logBtn{
  float: right;
}
.pims-clearFix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.pims-logBtn{
  color: #1e87f0;
  cursor: pointer;
}
.pims-dialogContent pre, .pims-logContent pre{
  white-space: pre-wrap;
  word-wrap: break-word;
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 42px;
  color: #333;
  font-family: Arial;
  text-overflow:ellipsis;
  overflow: hidden;
}
.pims-logContent{
  font-size: 14px;
  padding:0 32px 0 27px;
  pre{
    max-height: 89px;
  }
}
.pims-dialogContent{
  pre{
    max-height: 135px;
    padding-left: 35px;
  }
  p{
    padding-left: 35px;
  }
}
/*养老项目弹框样式结束*/
</style>
