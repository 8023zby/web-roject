<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">服务器设置</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="padding-top: 20px">
        <el-form :rules="rules" ref="addFormData" class="from" label-width="130px" :model="addFormData">
          <div>
            <div class="typt-tit-cls" style="background: none;">
              <div class="typt-tit-logo"></div>
              <div class="typt-tit-content">
                <el-form-item label="是否强制更新配置" prop="forceUpdate" class="forceUpdate">
                  <el-switch v-model="addFormData.forceUpdate" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </div>
            </div>
            <div class="typt-tit-cls" style="background: none;height: 60px;">
              <div class="typt-tit-logo"></div>
              <div class="typt-tit-content">音频服务器</div>
            </div>
            <el-form-item label="服务器IP：" prop="voiceHost">
              <el-input v-uni="actFormKey + 'voiceHost'" placeholder="请输入" v-model="addFormData.voiceHost" clearable></el-input>
            </el-form-item>
            <el-form-item label="端口：" prop="voicePort">
              <el-input v-uni="actFormKey + 'voicePort'" placeholder="请输入" v-model="addFormData.voicePort" clearable></el-input>
            </el-form-item>
          </div>
          <div class="typt-tit-cls" style="background: none;">
            <div class="typt-tit-logo"></div>
            <div class="typt-tit-content">视频直播服务器</div>
          </div>
          <el-form-item label="服务器IP：" prop="hptvHost">
            <el-input v-uni="actFormKey + 'hptvip'" placeholder="请输入" v-model="addFormData.hptvHost" clearable></el-input>
          </el-form-item>
          <el-form-item label="端口：" prop="hptvPort">
            <el-input v-uni="actFormKey + 'hptvport'" placeholder="请输入" v-model="addFormData.hptvPort" clearable></el-input>
          </el-form-item>
          <div>
            <div class="typt-tit-cls" style="background: none;">
              <div class="typt-tit-logo"></div>
              <div class="typt-tit-content">A10消息服务器</div>
            </div>
            <el-form-item label="服务器IP：" prop="socketHost">
              <el-input v-uni="actFormKey + 'socketHost'" placeholder="请输入" v-model="addFormData.socketHost" clearable></el-input>
            </el-form-item>
            <el-form-item label="端口：" prop="socketPort">
              <el-input v-uni="actFormKey + 'socketPort'" placeholder="请输入" v-model="addFormData.socketPort" clearable></el-input>
            </el-form-item>
          </div>
          <div class="typt-tit-cls" style="background: none;">
            <div class="typt-tit-logo"></div>
            <div class="typt-tit-content">时钟服务器</div>
          </div>
          <el-form-item label="服务器IP：" prop="ntpHost">
            <el-input v-uni="actFormKey + 'ntpHost'" placeholder="请输入" v-model="addFormData.ntpHost" clearable></el-input>
          </el-form-item>
          <el-form-item label="端口：" prop="ntpPort">
            <el-input v-uni="actFormKey + 'ntpPort'" placeholder="请输入" v-model="addFormData.ntpPort" clearable></el-input>
          </el-form-item>
          <el-form-item label="时区" prop="timeZone">
            <el-select placeholder="请选择" v-model="addFormData.timeZone">
              <el-option :label="item.label" :value="item.id" v-for="item in timeZoneList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <div>
            <div class="typt-tit-cls" style="background: none;">
              <div class="typt-tit-logo"></div>
              <div class="typt-tit-content">护理消息服务器</div>
            </div>
            <el-form-item label="服务器IP：" prop="wssHost">
              <el-input v-uni="actFormKey + 'wssHost'" placeholder="请输入" v-model="addFormData.wssHost" clearable></el-input>
            </el-form-item>
            <el-form-item label="端口：" prop="wssPort">
              <el-input v-uni="actFormKey + 'wssPort'" placeholder="请输入" v-model="addFormData.wssPort" clearable></el-input>
            </el-form-item>
            <div class="typt-tit-cls" style="background: none;">
              <div class="typt-tit-logo"></div>
              <div class="typt-tit-content">呼叫组服务器</div>
            </div>
            <el-form-item label="服务器IP：" prop="mangoRTCHost">
              <el-input v-uni="actFormKey + 'mangoRTCHost'" placeholder="请输入" v-model="addFormData.mangoRTCHost" clearable></el-input>
            </el-form-item>
            <el-form-item label="端口：" prop="mangoRTCPort">
              <el-input v-uni="actFormKey + 'mangoRTCPort'" placeholder="请输入" v-model="addFormData.mangoRTCPort" clearable></el-input>
            </el-form-item>
          </div>
          <div class="typt-tit-cls" style="background: none;">
            <div class="typt-tit-logo"></div>
            <div class="typt-tit-content">广播服务器</div>
          </div>
          <el-form-item label="服务器IP：" prop="janusHost">
            <el-input v-uni="actFormKey + 'janusHost'" placeholder="请输入" v-model="addFormData.janusHost" clearable></el-input>
          </el-form-item>
          <el-form-item label="加密传输：">
            <el-switch v-uni="actFormKey + 'jiamichuanshu'" v-model="encryption" @change="saveSwitch" active-color="#1D86EF" inactive-color="#EDEDED">
            </el-switch>
          </el-form-item>
          <el-form-item label="端口：" prop="janusPort">
            <el-input :disabled="true" v-uni="actFormKey + 'janusPort'" placeholder="请输入" v-model="addFormData.janusPort" clearable></el-input>
          </el-form-item>
          <div class="typt-tit-cls" style="background: none;">
            <div class="typt-tit-logo"></div>
            <div class="typt-tit-content">
              注册服务器
              <el-tooltip class="item" effect="dark" content="批量更改系统内所有终端的服务器IP" placement="bottom">
                <img ref="statusImg" @mouseenter="changeImgEnter" @mouseleave="changeImgLeave" class="img-cls" src="/static/tdms/img/icon_explain_default.png" />
              </el-tooltip>
            </div>
          </div>
          <el-form-item label="服务器IP：" prop="serverIp">
            <el-input v-uni="actFormKey + 'serverIp'" placeholder="请输入" v-model="addFormData.serverIp" clearable></el-input>
          </el-form-item>
          <el-form-item label="端口：" prop="serverPort">
            <el-input v-uni="actFormKey + 'serverPort'" placeholder="请输入" v-model="addFormData.serverPort" clearable></el-input>
          </el-form-item>
          <div class="typt-tit-cls" style="background: none;">
            <div class="typt-tit-logo"></div>
            <div class="typt-tit-content">中台消息服务器</div>
          </div>
          <el-form-item label="服务器IP：" prop="mqHost">
            <el-input v-uni="actFormKey + 'mqHost'" placeholder="请输入" v-model="addFormData.mqHost" clearable></el-input>
          </el-form-item>
          <el-form-item label="端口：" prop="mqPort">
            <el-input v-uni="actFormKey + 'mqPort'" placeholder="请输入" v-model="addFormData.mqPort" clearable></el-input>
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
import { TimeZone } from './timeZone.js'
export default {
  data () {
    // 验证IP
    let validIpVoiceHost = (rule, value, callback) => {
      let reg =
        /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (value === '' || value === null) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('音频服务器IP设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证端口号
    let validPortVoiceHost = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error('音频服务器端口设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证IP
    let validIpHptvHost = (rule, value, callback) => {
      let reg =
        /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (value === '' || value === null) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('视频直播服务器IP设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证端口号
    let validPortHptvHost = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error('视频直播服务器端口设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证IP
    let validIpSocketHost = (rule, value, callback) => {
      let reg =
        /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (value === '' || value === null) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('A10消息服务器IP设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证端口号
    let validPortSocketHost = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error('A10消息服务器端口设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证IP
    let validIpNtpHost = (rule, value, callback) => {
      let reg =
        /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (value === '' || value === null) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('时钟服务器IP设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证端口号
    let validPortNtpHost = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error('时钟服务器端口设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证IP
    let validIpWssHost = (rule, value, callback) => {
      let reg =
        /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (value === '' || value === null) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('护理消息服务器IP设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证端口号
    let validPortWssHost = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error('护理消息服务器端口设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证IP
    let validIpMangoRTCHost = (rule, value, callback) => {
      let reg =
        /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (value === '' || value === null) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('呼叫组服务器IP设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证端口号
    let validPortMangoRTCPort = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error('呼叫组服务器端口设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证IP
    let validIpJanusHost = (rule, value, callback) => {
      let reg =
        /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (value === '' || value === null) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('广播服务器IP设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证端口号
    let validPortJanusPort = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error('广播服务器端口设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证IP
    let validIpServerIp = (rule, value, callback) => {
      let reg =
        /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (value === '' || value === null) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('注册服务器IP设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证端口号
    let validPortServerPort = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error('注册服务器端口设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证IP
    let validIpmqHost = (rule, value, callback) => {
      let reg =
        /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (value === '' || value === null) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('中台消息服务器IP设置不符合规范'))
      } else {
        callback()
      }
    }
    // 验证端口号
    let validPortmqPort = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback(new Error('中台消息服务器端口设置不符合规范'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      addVis: false,
      addFormData: {
        forceUpdate: 0,//是否强制更新，默认关闭,开启后下发消息
        voiceHost: null, // 音频
        voicePort: null,
        hptvHost: null, // 视频
        hptvPort: null,
        socketHost: null, // socket
        socketPort: null,
        ntpHost: null, // ntp
        ntpPort: null,
        wssHost: null,
        wssPort: null,
        mangoRTCHost: null,
        mangoRTCPort: null,
        janusHost: null,
        janusPort: null,
        serverIp: null,
        serverPort: null,
        mqHost: null,
        mqPort: null,
        timeZone: '0'
      },
      modelName: '服务器设置',
      rules: {
        voiceHost: [
          { validator: validIpVoiceHost, trigger: 'blur' },
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        voicePort: [
          { validator: validPortVoiceHost, trigger: 'blur' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        hptvHost: [
          { validator: validIpHptvHost, trigger: 'blur' },
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        hptvPort: [
          { validator: validPortHptvHost, trigger: 'blur' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        socketHost: [
          { validator: validIpSocketHost, trigger: 'blur' },
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        socketPort: [
          { validator: validPortSocketHost, trigger: 'blur' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        ntpHost: [
          { validator: validIpNtpHost, trigger: 'blur' },
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        ntpPort: [
          { validator: validPortNtpHost, trigger: 'blur' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        wssHost: [
          { validator: validIpWssHost, trigger: 'blur' },
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        wssPort: [
          { validator: validPortWssHost, trigger: 'blur' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        mangoRTCHost: [
          { validator: validIpMangoRTCHost, trigger: 'blur' },
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        mangoRTCPort: [
          { validator: validPortMangoRTCPort, trigger: 'blur' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        janusHost: [
          { validator: validIpJanusHost, trigger: 'blur' },
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        janusPort: [
          { validator: validPortJanusPort, trigger: 'blur' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        serverIp: [
          { validator: validIpServerIp, trigger: 'blur' },
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        serverPort: [
          { validator: validPortServerPort, trigger: 'blur' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        mqHost: [
          { validator: validIpmqHost, trigger: 'blur' },
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        mqPort: [
          { validator: validPortmqPort, trigger: 'blur' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ]
      },
      url: '/passport/web-rbac/serverConfigs',
      landingEndCode: '',
      encryption: true,
      actKey: 'fuwuqishezhi_',
      actFormKey: 'fuwuqishezhi__',
      orgId: '',
      oldEncryption: true,
      timeZoneList: TimeZone
    }
  },
  created () {
    let str = localStorage.getItem('orgInfo')
    let orgInfo = JSON.parse(str)
    this.orgId = orgInfo.orgId
    this.getLandingEndCode()
    this.getSetData()
    this.getSwitch()
  },
  methods: {
    // 切换图片
    changeImgLeave () {
      this.$refs.statusImg.src = '/static/tdms/img/icon_explain_default.png'
    },
    // 切换图片
    changeImgEnter () {
      this.$refs.statusImg.src = '/static/tdms/img/icon_explain_slip.png'
    },
    getSwitch () {
      AxiosApi('/tdms/web-wn/systemConfig/whole', {}, 'GET', {
        orgId: this.orgId
      }).then((res) => {
        if (res.status === 200) {
          this.encryption = res.data.broadcastEncryption
          this.oldEncryption = res.data.broadcastEncryption
        }
      })
    },
    saveSwitch () {
      if (this.encryption) {
        this.addFormData.janusPort = '8989'
      } else {
        this.addFormData.janusPort = '8188'
      }
    },
    // 获取登录应用标识
    getLandingEndCode () {
      let codeStr = localStorage.getItem('selectLandingEndInfo')
      if (codeStr !== '' && codeStr !== null) {
        let tempInfo = JSON.parse(codeStr)
        this.landingEndCode = tempInfo.landingEndCode
      }
    },
    // 保存设置
    onSubmit () {
      this.$refs['addFormData'].validate((valid) => {
        if (valid) {
          let methodType = 'PUT'
          let flag = true
          // 区分登录应用保存
          let obj = { ...this.addFormData }
          /* if (this.landingEndCode === 'OPEX') {
            const temp = {
              hptvHost: obj.hptvHost, // 视频
              hptvPort: obj.hptvPort,
              ntpHost: obj.ntpHost, // ntp
              ntpPort: obj.ntpPort,
              janusPort: obj.janusPort,
              serverIp: obj.serverIp,
              serverPort: obj.serverPort
            }
            obj = temp
          } */
          for (let p in obj) {
            if (obj[p] !== '' && obj[p] !== null) {
              flag = false
              break
            }
          }
          if (flag) {
            this.$message.warning('请至少填写一条记录！')
            return false
          }

          if (this.oldEncryption !== this.encryption) {
            this.$confirm(
              `加密传输为全院配置，请确认广播服务器的端口号已修改，否则会导致话筒广播、音频广播无法使用！`,
              '提示',
              {
                confirmButtonText: '确 认',
                cancelButtonText: '取消',
                showClose: false,
                type: 'warning'
              }
            )
              .then(() => {
                let dataObj = {
                  broadcastEncryption: this.encryption,
                  menuArrayList: []
                }
                AxiosJsonApi('/tdms/web-wn/systemConfig/whole', {
                  orgId: this.orgId,
                  deviceId: null,
                  config: JSON.stringify(dataObj)
                }).then((res) => {
                  if (res.status === 200) {
                    AxiosJsonApi(this.url, obj, methodType).then((res) => {
                      ResultMsg(res, this.modelName, this.getSetData)
                      if (res.status !== 200) {
                        this.addVis = false
                      }
                    })
                  } else {
                    this.$message.error('设置失败')
                  }
                })
              })
              .catch(() => { })
          } else {
            AxiosJsonApi(this.url, obj, methodType).then((res) => {
              ResultMsg(res, this.modelName, this.getSetData)
              if (res.status !== 200) {
                this.addVis = false
              }
            })
          }
        }
      })
    },
    // 获取数据
    getSetData () {
      this.loading = true
      AxiosApi(this.url, {}, 'GET').then((res) => {
        this.loading = false
        if (res.status === 200) {
          let data = res.data
          delete data['mqUsername']
          delete data['mqPassword']
          this.addFormData = { ...this.addFormData, ...data }
          //保存完成后设置为默认不强制更新配置
          this.addFormData.forceUpdate = 0
          // 设置默认端口
          this.initDefaultPort()
        }
      })
    },
    // 设置默认端口
    initDefaultPort () {
      let orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
      let orgLevel = orgInfo.orgLevel
      let temp = this.addFormData
      if (orgLevel === 2) {
        // 音频
        if (temp.voicePort === '' || temp.voicePort === null) {
          this.addFormData.voicePort = 8080
        }
        // 视频
        if (temp.hptvPort === '' || temp.hptvPort === null) {
          this.addFormData.hptvPort = 80
        }
        // socket
        if (temp.socketPort === '' || temp.socketPort === null) {
          this.addFormData.socketPort = 8001
        }
        // ntp
        if (temp.ntpPort === '' || temp.ntpPort === null) {
          this.addFormData.ntpPort = 1233
        }
        // wss
        if (temp.wssPort === '' || temp.wssPort === null) {
          this.addFormData.wssPort = 8088
        }
        // mangoRTC
        if (temp.mangoRTCPort === '' || temp.mangoRTCPort === null) {
          this.addFormData.mangoRTCPort = 8308
        }
        // janus
        if (temp.janusPort === '' || temp.janusPort === null) {
          this.addFormData.janusPort = 8188
        }
      }
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
.forceUpdate {
  margin-bottom: 0 !important;
  line-height: 48px;
  /deep/.el-form-item__label {
    text-align: left;
    color: #333;
  }
}
</style>