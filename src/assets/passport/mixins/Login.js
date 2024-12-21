// 接口调用
import {
  postLogin,
  getPhotoCode,
  checkLoginGet,
  getTelCode,
  regPost,
  saveUnit,
  getCodeCheck,
  getLastDept,
  getLastLandingEndId,
  searchAuth,
  loginDevice
} from '../../../api/passport/login';
import { isvalidPhone, isvalUserName, isvalUserPwd, isvalUserPwdLen } from '../js/validate.js';
import { MsgShow, ResultMsg } from '../js/Message';
import { AxiosApi } from '../../../api/passport/http';

let that = null;
let Base64 = require('js-base64').Base64;
export default {
  data () {
    // 验证用户名
    let validName = (rule, value, callback) => {
      that.regStatus.userName = false;
      if (!value) {
        callback();
      } else if (!isvalUserName(value)) {
        callback(new Error('用户名输入格式不正确，请重新输入'));
      } else {
        that.regStatus.userName = true;
        callback();
      }
    };
    // 验证手机号
    let validPhone = (rule, value, callback) => {
      that.regStatus.userTelephone = false;
      if (!value) {
        callback();
      } else if (!isvalidPhone(value)) {
        callback(new Error('手机号输入格式不正确，请重新输入'));
      } else {
        that.regStatus.userTelephone = true;
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      that.regStatus.userPassword = false;
      if (value === '') {
        callback();
      } else if (this.pwdType === 0 && !isvalUserPwd(value)) {
        callback(new Error('密码输入格式不正确，请重新输入'));
      } else if (this.pwdType !== 0 && !isvalUserPwdLen(value)) {
        callback(new Error('密码输入格式不正确，请重新输入'));
      } else {
        that.regStatus.userPassword = true;
        callback();
      }
    };
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
        deptId: '',
        landingEndId: ''
      },
      showPassVis: false,
      // 表单字段
      loginFormFields: {
        loginName: '',
        loginPassword: '',
        photoCode: '',
        verifyStr: '',
        orgType: window.GLOBAL_CONFIG.ORG_TYPE || 2
      },
      photoCdDt: '',
      identifyNum: '',
      // 注册相关--------
      isShowRegister: false,
      isShowBtn: false,
      regStatus: {
        userName: false,
        userPassword: false,
        userTelephone: false
      },
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
      // 是否开启验证码
      isCheckCode: false,
      // 是否可以获取验证码
      phoneFlag: true,
      // 密码检测类型
      pwdType: 0,
      errorMsg: '输入6-20位字母+数字组合，区分英文大小写',
      ruleRegister: {
        userName: [
          { required: true, validator: validName, trigger: 'blur' }
        ],
        userPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        userTelephone: [
          { required: true, validator: validPhone, trigger: 'blur' }
          // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ]
      },
      // ------------end---------
      rules_unit: {
        deptId: [
          { required: true, message: '请选择科室', trigger: 'change' }
        ],
        landingEndId: [
          { required: true, message: '请选择登录应用', trigger: 'change' }
        ]
      },
      placeholderMsg: '请输入用户名',
      recordNumDesc: '',
      recordNum: 0,
      // 验证规则
      rules: {
        loginName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          { min: 2, max: 20, message: '用户名格式不正确，请重新输入', trigger: 'blur' }
        ],
        loginPassword: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          { min: 1, max: 20, message: '密码格式不正确，请重新输入', trigger: 'blur' }
        ],
        photoCode: [
          {
            required: true,
            message: '请输入验证码'
          }
        ]
      },
      userDel: false,
      focusFlag: false,
      userShow: false,
      userInfoList: [],
      searchInfoList: [],
      passwordList: [],
      cursorStart: 0,
      cursorEnd: 0,
      isAuth: 0,
      mesVis: false,
      landingEndList: [],
      pimsUrl: '',
      inputClickFlag: false, // 判断输入框方法是否执行过
      logInfo: {
        userId: '',
        deptName: '',
        landingName: ''
      },
      landingEndCode: ''
    };
  },
  created () {
    that = this;
    let host = window.location.host;
    if (host === 'www.yahuayun.cn' || host === ' www.yahuayun.com') {
      window.GLOBAL_CONFIG.SYSTEM_ID = 'common';
      window.GLOBAL_CONFIG.SYSTEM_ID = 'common';
      window.GLOBAL_CONFIG.SYSTEM_NAME = '亚华智慧医院系统';
      this.globalConfig.orgType = 2;
      this.globalConfig.systemId = 'common';
      this.globalConfig.systemName = '亚华智慧医院系统';
      this.loginFormFields.orgType = 2;
    }
    window.onkeydown = function () {
      if (event.keyCode === 13) {
        if (!that.logining) {
          that.submitForm();
        }
      }
    };
    if (this.globalConfig.systemId === 'pims' || this.globalConfig.systemId === 'poms') {
      localStorage.removeItem('alertStatus');
      // 显示浏览器兼容性
      this.checkBrowser();
      this.formRegister.orgLevel = '';
      this.showPassVis = true;
      this.placeholderMsg = '请输入用户名或者手机号';
      this.rules.loginName[0].message = '请输入用户名或者手机号';
      this.rules.loginName[1].message = '用户名或者手机号格式不正确，请重新输入';
      if (this.$route.query.phone !== undefined) {
        this.toRegister(this.$route.query.phone);
      }
      // 查询密码配置
      this.queryPass();
    } else {
      // 初始化记录账号
      this.initSaveUserInfo();
      // 监控点击事件
      this.bindEvent();
      // 是否显示系统授权
      this.searchAuth();
    }
    this.getCode();
    this.getCodeFlag();
    // 设置标题和ico
    this.loadTitle();
    this.loadFav();
    this.getFooterContent();
  },
  mounted () {
    // 从url带入用户名登录
    console.log(this.$route.query);
    let loginName = this.$route.query.uid || '';
    if (loginName === '' || loginName === null || loginName === undefined) {

    } else {
      this.getLoginPassword(loginName);
      // this.loginFormFields.loginName = loginName
      // this.loginFormFields.loginPassword = loginPassword
    }
  },
  destroyed () {
    window.removeEventListener('click', () => { });
    document.onkeydown = function (event) { };
    document.oncontextmenu = function () { };
  },
  methods: {
    // 切换登录应用
    changeDevice () {
      // 如果是运维端隐藏部门
      let temp = this.landingEndList.find(item => {
        return item.landingEndId === this.unitData.landingEndId;
      });
      this.landingEndCode = temp.landingEndCode;
    },
    // 登录日志
    saveLog () {
      AxiosApi('/omms/web-rbac/logins/checkDeptLanding', {}, 'GET', {
        userId: this.logInfo.userId,
        deptName: this.logInfo.deptName,
        landingName: this.logInfo.landingName
      }).then(res => { });
    },
    // 查询用户
    searchUser () {
      if (this.loginFormFields.loginName !== '') {
        this.userDel = true;
        this.searchInfoList = [];
        this.userInfoList.forEach((item) => {
          if (item.indexOf(this.loginFormFields.loginName) > -1) {
            this.searchInfoList.push(item);
          }
        });
        if (this.searchInfoList.length === 0) {
          this.userShow = false;
        } else {
          this.userShow = true;
        }
      } else {
        this.userShow = true;
        this.searchInfoList = [...this.userInfoList];
      }
    },
    // 首次授权查询
    searchAuth () {
      searchAuth().then(res => {
        if (res.status === 200) {
          this.isAuth = res.data;
        } else {
          this.isAuth = 1;
        }
      });
    },
    // 选择框点击空白隐藏
    bindEvent () {
      window.addEventListener('click', (e) => {
        let obj = e.target || e.srcElement;
        let name = obj.getAttribute('name');
        if (name === 'userName') {

        } else if (name === 'userNameDel') {
          this.delInfo();
        } else {
          this.userDel = false;
          this.userShow = false;
        }
      });
      // 禁用右键
      document.oncontextmenu = function () {
        return false;
      };
      document.onkeydown = function (event) {
        if (event.ctrlKey === true && event.keyCode === 90) { // Ctrl+Z
          return false;
        }
        if (event.ctrlKey && event.keyCode === 65) { // 禁用ctrl + a 功能
          return false;
        }

        if (event.ctrlKey && window.event.keyCode === 67) { // 禁用ctrl + c 功能
          return false;
        }

        if (event.ctrlKey && window.event.keyCode === 86) { // 禁用ctrl + v 功能
          return false;
        }
        if (event.ctrlKey === true && event.keyCode === 88) { // Ctrl+X
          return false;
        }
      };
    },
    // 选中选项
    selectItem (key) {
      this.loginFormFields.loginName = key;
      this.userShow = false;
      this.userDel = false;
    },
    // 初始化记录账号
    initSaveUserInfo () {
      let listStr = localStorage.getItem('yhUserInfoList');
      if (listStr === null || listStr === 'null') return false;
      if (listStr) {
        let type = typeof (JSON.parse(listStr));
        if (type === 'string') {
          this.userInfoList = JSON.parse(JSON.parse(listStr));
        } else {
          this.userInfoList = JSON.parse(listStr);
        }
        this.searchInfoList = [...this.userInfoList];
        if (this.searchInfoList.length > 0) {
          this.loginFormFields.loginName = this.searchInfoList[0];
        }
      }
    },
    // 将账户记录到缓存
    saveUserInfo () {
      this.userInfoList = [];
      let userInfo = {};
      let str = localStorage.getItem('yhUserInfo');
      let listStr = localStorage.getItem('yhUserInfoList');
      if (str === null || str === 'null') {
        userInfo = {};
      } else if (str) {
        let type = typeof (JSON.parse(str));
        if (type === 'string') {
          userInfo = JSON.parse(JSON.parse(str));
        } else {
          userInfo = JSON.parse(str);
        }
      }
      if (listStr === null || listStr === 'null') {
        this.userInfoList = [];
      } else if (listStr) {
        let type = typeof (JSON.parse(listStr));
        if (type === 'string') {
          this.userInfoList = JSON.parse(JSON.parse(listStr));
        } else {
          this.userInfoList = JSON.parse(listStr);
        }
      }
      if (!userInfo[this.loginFormFields.loginName]) {
        this.userInfoList.unshift(this.loginFormFields.loginName);
      } else {
        let index = this.userInfoList.findIndex(item => {
          return item === this.loginFormFields.loginName;
        });
        // 将最近一次登录的账号放到第一位
        this.userInfoList.splice(index, 1);
        this.userInfoList.unshift(this.loginFormFields.loginName);
      }
      userInfo[this.loginFormFields.loginName] = this.loginFormFields.loginName;
      localStorage.setItem('yhUserInfo', JSON.stringify(userInfo));
      localStorage.setItem('yhUserInfoList', JSON.stringify(this.userInfoList));
    },
    // 删除缓存数据
    delUserItem (key) {
      this.userShow = false;
      this.$confirm(`即将删除的用户名：${key}，您确认删除以下账号的登录信息吗?删除后系统登录页中将不再含有该账号的信息。`, '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        this.doDelUserItem(key);
      });
    },
    // 删除缓存数据
    doDelUserItem (key) {
      this.userInfoList = [];
      let userInfo = {};
      let str = localStorage.getItem('yhUserInfo');
      if (str) {
        let type = typeof (JSON.parse(str));
        if (type === 'string') {
          userInfo = JSON.parse(JSON.parse(str));
        } else {
          userInfo = JSON.parse(str);
        }
      }
      delete userInfo[key];
      for (let p in userInfo) {
        this.userInfoList.push(p);
      }
      if (this.userInfoList.length === 0) {
        this.userShow = false;
      }
      let listIndex = this.searchInfoList.findIndex(item => {
        return item === key;
      });
      if (listIndex !== undefined) {
        this.searchInfoList.splice(listIndex, 1);
      }
      if (this.searchInfoList.length === 0) {
        this.userShow = false;
      }
      localStorage.setItem('yhUserInfo', JSON.stringify(userInfo));
      localStorage.setItem('yhUserInfoList', JSON.stringify(this.userInfoList));
    },
    // 显示用户
    showSelectUser () {
      this.userShow = !this.userShow;
      if (this.userShow) {
        document.getElementById('userId').focus();
      } else {
        this.userDel = false;
      }
    },
    // 显示用户名删除按钮
    showIcon () {
      this.userShow = true;
      this.searchInfoList = [...this.userInfoList];
      if (this.loginFormFields.loginName !== '') { this.userDel = true; }
    },
    // 删除用户名信息
    delInfo () {
      this.loginFormFields.loginName = '';
    },
    // 获取input光标位置
    getInputPosition (obj) {
      let selectionStart = -1;
      if (obj.selectionStart !== undefined) { // 非IE浏览器
        selectionStart = obj.selectionStart;
      } else { // IE
        let rngSel = document.selection.createRange();// 建立选择域
        let rngTxt = obj.createTextRange();// 建立文本域
        let flag = rngSel.getBookmark();// 用选择域建立书签
        rngTxt.collapse();// 瓦解文本域到开始位,以便使标志位移动
        rngTxt.moveToBookmark(flag);// 使文本域移动到书签位
        rngTxt.moveStart('character', -obj.value.length);// 获得文本域左侧文本
        selectionStart = rngTxt.text.replace(/\r\n/g, '').length;// 替换回车换行符
      }
      return selectionStart;
    },
    // 光标位置定位
    changeText (event) {
      if (this.inputClickFlag && (this.cursorStart !== this.cursorEnd)) return false;
      let obj = this.$refs.userPass.$el.children[0];
      this.cursorStart = obj.selectionStart;
      this.cursorEnd = obj.selectionEnd;
      // 记录方法是否执行过(加锁)
      this.inputClickFlag = true;
    },
    // 切换密码类型
    changeType () {
      let arr = this.loginFormFields.loginPassword.split('');
      let str = '';
      let obj = this.$refs.userPass.$el.children[0];
      let start = obj.selectionStart;
      // let selectionStart = this.getInputPosition(obj)
      let length = Math.abs(this.cursorEnd - this.cursorStart);
      if (length === 0) {
        if (arr.length < this.passwordList.length) {
          console.log('单个删除');
          this.passwordList.splice(start, 1);
        } else {
          console.log('添加');
          // 兼容中文输入法
          let str = this.loginFormFields.loginPassword.replace(/•/g, '');
          if (str.length > 1) {
            let arr = str.split('');
            arr.forEach((item) => {
              this.passwordList.splice(this.cursorStart, 0, item);
            });
          } else {
            this.passwordList.splice(this.cursorStart, 0, this.loginFormFields.loginPassword.substr(start - 1, 1));
          }
        }
      } else {
        if (arr.length < this.passwordList.length && this.cursorStart === start) {
          this.passwordList.splice(start, length);
          console.log('选中删除');
        } else {
          console.log('替换');
          this.passwordList.splice(this.cursorStart, length, arr.slice(this.cursorStart, start).join(''));
          // 兼容中文输入法
          let str = this.loginFormFields.loginPassword.replace(/•/g, '');
          if (str.length > 1) {
            let temp = [];
            this.passwordList.forEach(item => {
              let t = item.split('');
              t.forEach(val => {
                temp.push(val);
              });
            });
            this.passwordList = temp;
          }
        }
      }
      // console.log(this.passwordList)
      arr.forEach((item) => {
        str += '•';
      });
      this.loginFormFields.loginPassword = str;
      this.$nextTick(() => {
        obj.selectionStart = start;
        obj.selectionEnd = start;
        // 记录方法是否执行过(解锁)
        this.inputClickFlag = false;
      });
    },
    // 显示配置
    getFooterContent () {
      AxiosApi('/passport/web-rbac/systemConfigs/recordNumConfig', {}, 'GET').then(res => {
        if (res.status === 200) {
          let data = res.data;
          if (data !== null) {
            this.recordNum = data.recordNum === null ? 1 : data.recordNum;
            this.recordNumDesc = data.recordNumDesc === null ? '' : data.recordNumDesc;
          }
        } else {
          this.recordNum = 1;
          this.recordNumDesc = '';
        }
      });
    },
    openAddress () {
      window.open('http://beian.miit.gov.cn');
    },
    // 查询密码配置
    queryPass () {
      AxiosApi('/passport/web-rbac/systemConfigs/pwdConfig', {}, 'GET').then(res => {
        if (res.status === 200) {
          let data = res.data;
          if (data !== null) {
            this.pwdType = data;
            if (this.pwdType === 1) {
              this.errorMsg = '输入1-20位';
            }
          }
        }
      });
    },
    // 设置标题
    loadTitle: function () {
      document.title = window.GLOBAL_CONFIG.SYSTEM_NAME || '亚华智慧医院系统';
    },
    // 设置ICON
    loadFav: function () {
      document.getElementById('icon_yarward').href = window.GLOBAL_CONFIG.FAV_ICON || './static/passport/img/favicon.ico';
    },
    // 系统授权
    toSystemApply () {
      this.$router.push('/passport_systemApply');
    },
    // 获取是否显示验证码
    getCodeFlag () {
      getCodeCheck().then(res => {
        if (res.status === 200) {
          if (res.data === 1) {
            this.isCheckCode = false;
          } else {
            this.isCheckCode = true;
            this.getCode();
          }
        } else {
          this.isCheckCode = true;
          this.getCode();
        }
      });
    },
    // 取消修改密码
    cancelMod () {
      this.mesVis = false;
      this.showUnitVis = false;
      this.logining = false;
      let pimsEntryData = localStorage.getItem('pimsEntryData');
      let userInfo = localStorage.getItem('yhUserInfo');
      let userInfoList = localStorage.getItem('yhUserInfoList');
      localStorage.clear();
      localStorage.setItem('pimsEntryData', pimsEntryData);
      localStorage.setItem('yhUserInfo', userInfo);
      localStorage.setItem('yhUserInfoList', userInfoList);
      this.getCode();
    },
    // 选择科室后登录
    goLogin () {
      if (this.showUnitVis) {
        this.$refs['unitSelect'].validate((valid) => {
          if (valid) {
            this.saveLogin();
          }
        });
      } else {
        this.saveLogin();
      }
    },
    // 保存科室登录
    saveLogin () {
      // 如果是超管,或者不验证多个科室，且没有存储范围不走保存科室接口
      if (this.dataDeptInfoList.length === 0) {
        this.loginDevice();
      } else {
        saveUnit(this.unitData.deptId).then(res => {
          let status = res.status || '';
          let desc = res.desc || '';
          let temp = this.dataDeptInfoList.find(item => {
            return item.deptId === this.unitData.deptId;
          });
          this.logInfo.deptName = temp.deptName;
          if (status === 200) {
            localStorage.setItem('selectDeptInfo', JSON.stringify(temp));
            localStorage.setItem('selectDeptId', this.unitData.deptId);
            this.loginDevice();
          } else if (desc !== '') {
            this.logining = false;
            MsgShow('error', desc, 3000);
            return false;
          }
        });
      }
    },
    // 登录登录应用
    loginDevice () {
      loginDevice(this.unitData.landingEndId).then(res => {
        let status = res.status || '';
        let desc = res.desc || '';
        let data = res.data;
        let temp = this.landingEndList.find(item => {
          return item.landingEndId === this.unitData.landingEndId;
        });
        this.logInfo.landingName = temp.landingEndName;
        // 登录日志
        this.saveLog();
        if (status === 200) {
          localStorage.setItem('selectLandingEndId', this.unitData.landingEndId);
          localStorage.setItem('selectLandingEndInfo', JSON.stringify(temp));
          localStorage.setItem('authorityList', JSON.stringify(data));
          if (window.GLOBAL_CONFIG.SYSTEM_ID === 'pims' || window.GLOBAL_CONFIG.SYSTEM_ID === 'poms') {
            localStorage.setItem('permissionRuter', JSON.stringify(data));
          }
          this.saveUserInfo();
          if (this.pimsUrl && (this.globalConfig.systemId === 'pims' || this.globalConfig.systemId === 'poms')) {
            this.$router.push(this.pimsUrl);
          } else {
            this.$router.push({ path: '/main' });
          }
        } else if (desc !== '') {
          this.logining = false;
          MsgShow('error', desc, 3000);
          return false;
        }
      });
    },
    // 验证用户名是否被占用
    checkUserName () {
      if (this.formRegister.userName) {
        let param = {
          loginName: this.formRegister.userName
        };
        this.checkName(param);
      }
    },
    // 去登录 显示登录页面，隐藏注册页面
    toLogin () {
      this.loginFormFields.loginName = '';
      this.loginFormFields.photoCode = '';
      this.loginFormFields.loginPassword = '';
      this.isShowRegister = false;
      this.closeFlag = true;
      this.getCode();
    },
    // 去注册
    toRegister (phone = '') {
      this.getCode();
      this.regStatus = {
        userName: false,
        userPassword: false,
        userTelephone: false
      };
      this.formRegister = {
        userName: '',
        userPassword: '',
        repactPassword: '',
        userTelephone: phone,
        photoCode: '',
        verifyStr: '',
        smsCode: '',
        resource: '1',
        orgLevel: 2
      };
      if (this.globalConfig.systemId === 'pims' || this.globalConfig.systemId === 'poms') {
        this.formRegister.orgLevel = '';
      }
      this.disabled = false;
      this.isShowRegister = true;
    },
    // 用户注册
    registerUser (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = this.formRegister;
          const loading = this.$loading({
            lock: true,
            background: 'rgba(255, 255, 255, 0.7)'
          });
          regPost(param).then(response => {
            loading.close();
            if (response.status === 200) {
              this.getCode();
              ResultMsg(response, '注册', this.toLogin);
            } else {
              this.getCode();
              MsgShow('error', response.desc);
            }
          }, response => {
            loading.close();
            MsgShow('error', '注册失败！');
            this.getCode();
          });
        }
      });
    },
    // 验证手机号是否被占用
    checkTelName () {
      if (this.formRegister.userTelephone) {
        let param = {
          loginName: this.formRegister.userTelephone
        };
        this.checkName(param, 'phone');
      }
    },
    // 验证用户名或账户是否被占用
    checkName (id, act = '') {
      checkLoginGet(id).then(response => {
        if (response.status === 200) {
          if (act === 'phone') {
            this.phoneFlag = false;
          }
        } else {
          if (act === 'phone') {
            this.phoneFlag = true;
          }
          MsgShow('error', response.desc, 3000);
        }
      }, response => {
        MsgShow('error', '检验用户名失败！', 3000);
      });
    },
    // 获取手机验证码
    sendCode () {
      this.closeFlag = false;
      let tel = this.formRegister.userTelephone;
      if (tel === '') {
        this.$refs.formRegister.validateField('userTelephone');
      } else if (!isvalidPhone(tel)) {
        this.$refs.formRegister.validateField('userTelephone');
      } else {
        this.codeFlag = true;
        getTelCode(this.formRegister.userTelephone).then(res => {
          if (res.status === 200) {
            this.timer();
            MsgShow('success', '验证码已发送');
          } else {
            this.codeFlag = false;
            MsgShow('error', res.desc);
          }
        });
      }
    },
    timer () {
      this.codeFlag = false;
      this.disabled = true;
      if (this.setTelTime === 0) {
        this.btnText = '获取短信验证码';
        this.disabled = false;
        this.setTelTime = 60;
      } else {
        this.btnText = '重新获取(' + this.setTelTime + 'S)';
        this.setTelTime--;
        if (this.closeFlag) {
          this.btnText = '获取短信验证码';
          this.disabled = false;
          this.setTelTime = 60;
        } else {
          setTimeout(function () { that.timer(); }, 1000);
        }
      }
    },
    // 点击更换
    clickCode () {
      this.getCode();
    },
    // 忘记密码
    forgetPass () {
      this.$router.push({ path: '/changePassword' });
    },
    getCode () {
      // 获取验证码
      let _this = this;
      getPhotoCode().then((response) => {
        if (response.status === 200) {
          _this.photoCdDt = 'data:image/png;base64,' + response.data.base64Str;
          _this.identifyNum = response.data.verifyStr;
          _this.loginFormFields.verifyStr = response.data.verifyStr;
          _this.formRegister.verifyStr = response.data.verifyStr;
        } else {
          _this.$message({ type: 'error', message: '获取失败' });
        }
      }).catch(() => {
        _this.$message.error('服务器错误');
      });
    },

    // 登陆陆时候，清空缓存数据
    clearStorage () {
      let pimsEntryData = localStorage.getItem('pimsEntryData');
      let userInfo = localStorage.getItem('yhUserInfo');
      let userInfoList = localStorage.getItem('yhUserInfoList');
      localStorage.clear();
      localStorage.setItem('pimsEntryData', pimsEntryData);
      localStorage.setItem('yhUserInfo', userInfo);
      localStorage.setItem('yhUserInfoList', userInfoList);
    },

    // 登录逻辑单独处理
    async doLogin (data) {
      let _this = this;
      // 先登录
      const res = await postLogin(data);
      if (res.status === 200) {
        let empInfo = res.data.empInfo || {};
        let deptInfo = res.data.deptInfo || {};
        let orgInfo = res.data.orgInfo || {};
        let jobInfo = res.data.jobInfo || {};
        let token = res.data.token || '';
        let dataDeptInfoList = res.data.dataDeptInfoList || [];
        // let authorityList = res.data.authorityList || []
        // 登录应用列表
        let landingEndList = res.data.landingEndList || [];
        let orgStatus = orgInfo.orgStatus;
        let orgId = orgInfo.orgId || '';
        let orgLevel = orgInfo.orgLevel;
        let isAdmin = res.data.isAdmin;
        // 日志相关参数
        this.logInfo.userId = empInfo.empId;
        // 修改密码操作
        let resetPassword = res.data.resetPassword;
        if (typeof resetPassword === 'undefined' || resetPassword === null) {
          resetPassword = '';
        }
        if (typeof isAdmin === 'undefined' || isAdmin === null) {
          isAdmin = false;
        }
        if (typeof orgStatus === 'undefined' || orgStatus === null) {
          orgStatus = '';
        }
        if (typeof orgLevel === 'undefined' || orgLevel === null) {
          orgLevel = '';
        }
        // 测试提示
        if (orgStatus === '') {
          console.warn('orgStatus是空的！！！');
        }
        if (typeof empInfo.empName === 'undefined' || empInfo.empName === null) {
          empInfo.empName = this.loginFormFields.loginName;
        }
        // 存储范围赋值
        this.dataDeptInfoList = dataDeptInfoList;
        // 登录应用
        this.landingEndList = landingEndList;
        _this.clearStorage();
        localStorage.setItem('userId', this.loginFormFields.loginName);
        localStorage.setItem('empInfo', JSON.stringify(empInfo));
        localStorage.setItem('token', token);
        localStorage.setItem('deptInfo', JSON.stringify(deptInfo));
        localStorage.setItem('orgInfo', JSON.stringify(orgInfo));
        localStorage.setItem('jobInfo', JSON.stringify(jobInfo));
        localStorage.setItem('dataDeptInfoList', JSON.stringify(dataDeptInfoList));
        localStorage.setItem('landingEndList', JSON.stringify(landingEndList));
        // localStorage.setItem('authorityList', JSON.stringify(authorityList))
        localStorage.setItem('resetPassword', resetPassword);
        localStorage.setItem('hasShowModPas', 'true');
        localStorage.setItem('isFirstLogin', 'true');
        // 增加养老的跳转
        if (window.GLOBAL_CONFIG.SYSTEM_ID === 'pims' || window.GLOBAL_CONFIG.SYSTEM_ID === 'poms') {
          // 存储养老登录信息
          let pimsOrginfo = {
            orgLevel: orgLevel,
            orgStatus: orgStatus,
            ipAddress: res.data.ipAddress || '',
            lastLoginTime: res.data.lastLoginTime || '',
            loginTime: res.data.loginTime || ''
          };
          localStorage.setItem('pimsOrginfo', JSON.stringify(pimsOrginfo));
          if (orgLevel) {
            if (orgStatus === 0) {
              const param = {
                id: orgId,
                orgStatus: orgStatus
              };
              // 写个假数据 前端路由通行
              let list = [{
                authorityName: '机构注册',
                authorityId: 'regCode'
              }];
              localStorage.setItem('authorityList', JSON.stringify(list));
              this.pimsUrl = { path: '/organizationRegister', query: { orgInfo: JSON.stringify(param) } };
              this.$router.push(this.pimsUrl);
            } else if (orgStatus === 2) {
              const param = {
                id: orgId,
                orgStatus: orgStatus,
                rejectReason: orgInfo.rejectReason || ''
              };
              // 写个假数据 前端路由通行
              let list = [{
                authorityName: '机构注册',
                authorityId: 'regCode'
              }];
              localStorage.setItem('authorityList', JSON.stringify(list));
              this.pimsUrl = { path: '/organizationRegister', query: { orgInfo: JSON.stringify(param) } };
              this.$router.push(this.pimsUrl);
            } else if (orgStatus === 1) {
              if (landingEndList.length === 0) {
                _this.$message.error('此账号无登录权限，请联系管理员！');
                return false;
              } else {
                this.unitData.landingEndId = landingEndList[0].landingEndId;
              }
              // localStorage.setItem('permissionRuter', JSON.stringify(authorityList))
              if (this.globalConfig.isVerifyUnit === 1) {
                // 如果部门有多个选择第一个
                if (dataDeptInfoList.length > 0) {
                  this.unitData.deptId = dataDeptInfoList[0].deptId;
                }
                if (landingEndList.length > 1) {
                  this.showUnitVis = true;
                } else {
                  this.unitData.landingEndId = landingEndList[0].landingEndId;
                  this.goLogin();
                }
              } else {
                if (landingEndList.length === 0) {
                  _this.$message.error('此账号无登录权限，请联系管理员！');
                  return false;
                } else if (landingEndList.length > 1) {
                  this.showUnitVis = true;
                } else {
                  this.unitData.landingEndId = landingEndList[0].landingEndId;
                  this.loginDevice();
                }
              }
            }
          } else {
            // 写个假数据 前端路由通行
            let list = [{
              authorityName: '机构注册',
              authorityId: 'regCode'
            }];
            localStorage.setItem('authorityList', JSON.stringify(list));
            this.$router.push({ path: '/organizationRegister', query: { id: orgId } });
          }
        } else {
          if (this.globalConfig.isVerifyUnit === 1) {
            if (orgLevel === 4) {
              if (landingEndList.length === 0) {
                _this.$message.error('此账号无登录权限，请联系管理员！');
                this.logining = false;
              } else {
                this.unitData.landingEndId = landingEndList[0].landingEndId;
                this.loginDevice();
              }
              return false;
            } else if (this.globalConfig.orgType === 2) {
              localStorage.setItem('unitVersion', 'yes');
              if (landingEndList.length === 0) {
                _this.$message.error('此账号无登录权限，请联系管理员！');
                this.logining = false;
                return false;
              } else if (landingEndList.length > 1) {
                // 多个登录应用选择上次登录的
                const resEnd = await getLastLandingEndId();
                if (resEnd.status === 200) {
                  let str = JSON.stringify(landingEndList);
                  if (resEnd.data !== null && str.indexOf(resEnd.data) > -1) {
                    this.unitData.landingEndId = resEnd.data;
                  } else {
                    this.unitData.landingEndId = landingEndList[0].landingEndId;
                  }
                }
              } else {
                this.unitData.landingEndId = landingEndList[0].landingEndId;
              }

              if (dataDeptInfoList.length > 1) {
                let resDept = await getLastDept();
                if (resDept.status === 200) {
                  let str = JSON.stringify(dataDeptInfoList);
                  if (resDept.data === '') {
                    this.unitData.deptId = dataDeptInfoList[0].deptId;
                  } else if (str.indexOf(resDept.data) > -1) {
                    this.unitData.deptId = resDept.data;
                  } else {
                    this.unitData.deptId = dataDeptInfoList[0].deptId;
                  }
                }
              } else if (dataDeptInfoList.length === 0) {
                if (isAdmin === true || isAdmin === 'true') {
                  //  登录应用或者科室多个弹窗选择
                  if (landingEndList.length > 1) {
                    this.showUnitVis = true;
                  } else {
                    this.unitData.landingEndId = landingEndList[0].landingEndId;
                    this.loginDevice();
                  }
                  return false;
                } else {
                  _this.$message.error('数据存储范围为空，请联系管理员！');
                  this.logining = false;
                }
                return false;
              } else {
                this.unitData.deptId = dataDeptInfoList[0].deptId;
              }

              // 登录应用为运维端隐藏选择科室
              this.changeDevice();
              // 登录应用或者科室多个弹窗选择
              // 登录应用为运维端单独判断
              if (this.landingEndCode === 'OPEX') {
                // 如果部门多个不弹窗 登录端多个才弹窗
                if (landingEndList.length > 1) {
                  this.showUnitVis = true;
                } else {
                  this.goLogin();
                }
              } else {
                if (dataDeptInfoList.length > 1 || landingEndList.length > 1) {
                  this.showUnitVis = true;
                } else {
                  this.goLogin();
                }
              }
            }
          } else {
            // 登录应用为运维端隐藏选择科室
            this.changeDevice();

            //  登录应用或者科室多个弹窗选择
            if (landingEndList.length > 1) {
              this.showUnitVis = true;
            } else {
              this.unitData.landingEndId = landingEndList[0].landingEndId;
              this.loginDevice();
            }
          }
        }
      } else {
        this.logining = false;
        if (res.status === 400 && res.desc.includes('系统尚未进行授权')) {
          this.goApply();
        } else {
          _this.$message.error(res.desc);
        }
        _this.getCode();
      }
    },
    // 授权异常增加授权入口
    goApply () {
      this.$alert('系统授权异常，请重新授权', '授权提醒', {
        confirmButtonText: '重新授权',
        showCancelButton: true,
        showClose: false,
        callback: action => {
          this.$router.push('/passport_systemApply');
        }
      });
    },
    // 提交表单
    submitForm () {
      let _this = this;
      // 表单验证
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          if (this.isAuth === 1) {
            this.mesVis = true;
            return false;
          }
          this.logining = true;
          let data = { ..._this.loginFormFields };
          let passwordStr = '';
          // 医疗机构虚拟密码输入框
          if (this.passwordList.length > 0) {
            this.passwordList.forEach((item) => {
              passwordStr += item;
            });
            data.loginPassword = passwordStr;
          }
          data.loginPassword = Base64.encode(data.loginPassword);
          this.doLogin(data);
        } else {
          return false;
        }
      });
    },
    // 获取密码跳登录
    getLoginPassword (userName) {
      AxiosApi('/sso/login?userName=' + userName, {}, 'GET').then(res => {
        if (res.status === 200) {
          this.loginFormFields.loginName = res.data.userName || '';
          this.loginFormFields.loginPassword = '••••••';
          this.passwordList = res.data.userPassword.split('');
          if (this.loginFormFields.loginName === '' || this.loginFormFields.loginPassword === '') {

          } else {
            this.submitForm();
          }
        }
      });
    }
  }
};
