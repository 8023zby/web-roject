<!--
  文件描述：消息推送
      主样式class：edit-page-new
  创建时间：2021/05/20 11:31
  创建人：Administrator
-->

<template>
  <el-container class="edit-page-new">
    <el-header :height="'48px'">
      <!--标题-->
      <div class="title">
        <slot name="title">消息推送</slot>
      </div>
      <!--头部右侧按钮-->
      <div class="right-btn">
        <slot name="right_btn"></slot>
      </div>
    </el-header>
    <el-main>
      <!--主内容-->
      <slot name="main">
        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="150px">
          <el-form-item label="患者提醒方式:"
                        prop="msgResource">
            <el-radio-group v-model="form.patientRreminder"
                            @change="clearFormValidate">
              <el-radio :label="'Compulsory'">强提醒</el-radio>
              <el-radio :label="'not-disturb'">免打扰提醒</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="通知内容:"
                        v-if="form.msgResource === 'MANUAL-DEPT-MSG'"
                        prop="notifyType">
            <!--展示类型 0-文字 2-音频 3-视频-->
            <el-radio-group v-model="form.notifyType"
                            @change="isNotifType">
              <el-radio :label="0">文字</el-radio>
              <el-radio :label="2">音视频</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="公告内容:"
                        v-if="form.msgResource === 'MANUAL-DEPT-NOTICE' "
                        prop="content">
            <el-input placeholder="请输入"
                      v-model.trim="form.content"
                      class="elinput-400"
                      type="textarea"
                      :rows="8"
                      maxlength="200"
                      show-word-limit />
          </el-form-item>

          <el-form-item label="输入文字:"
                        v-if="form.notifyType === 0 && form.msgResource === 'MANUAL-DEPT-MSG'"
                        prop="content">
            <el-input placeholder="请输入"
                      v-model.trim="form.content"
                      class="elinput-400"
                      type="textarea"
                      :rows="9"
                      maxlength="200"
                      show-word-limit />
            <el-button style="position: absolute;margin-left: 16px;"
                       type="primary"
                       @click="getTemplate"
                       size="mini">导入消息模板</el-button>
          </el-form-item>

          <el-form-item label="文字转语音:"
                        v-if="form.notifyType!==2">
            <el-switch v-model="form.isGenerateAudio"
                       active-color="#13ce66"
                       :active-value="1"
                       :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="音视频文件:"
                        v-if="form.notifyType === 2 &&form.msgResource!='MANUAL-DEPT-NOTICE'"
                        prop="content">
            <upload-flied ref="uploadVideoFile"
                          :data-name="video.dataName"
                          :accept="video.accept"
                          :limits="video.limit"
                          :filelist="video.fileList"
                          :Iscallback="video.Iscallback"
                          @uploadFlieds="uploadFlieds" />
            <el-link type="info"
                     disabled>
              音频支持格式:mp3,wav,wma；视频支持格式
              mp4,avi,3gp,rmvb,wmv,mkv,mov,flv；
            </el-link>
          </el-form-item>
          <el-form-item label="接收设备:"
                        prop="bedDivice">
            <el-checkbox-group v-model="form.bedDivice"
                               @change="handleChangeDivice">
              <el-checkbox class="elcheckbox"
                           style="width:120px"
                           v-for="(item,index) in device[form.msgResource==='MANUAL-DEPT-MSG'?'Bedhead':'Bedside']"
                           :key="index"
                           :label="item.key"
                           :value="item.key">{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <template>
            <div v-for="(item,indexs) in form.bedDivice"
                 :key="indexs">
              <el-form-item :label="deviceTypeName[item] == 'PDA'? '医护人员' : deviceTypeName[item]">
                <div class="divcheck">
                  <el-button class="checkbtn"
                             @click="check_All_Change(item)">全选</el-button>
                  <el-button class="checkbtn"
                             @click="check_Null_Change(item)">反选</el-button>
                </div>
                <div class="checkboxbor">
                  <el-checkbox-group v-model="form.bedIdArr"
                                     @change="handleCheckedDebChange(item)">
                    <el-checkbox class="elcheckbox"
                                 :label="item+'_'+data.id"
                                 v-for="(data,i) in checkData.bedList[item]"
                                 :value="data.id"
                                 :key="i">{{ data.name }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-form-item>
            </div>
          </template>

          <el-form-item label="推送方式"
                        prop="resource">
            <el-radio-group v-model="form.pushType"
                            @change="changeType">
              <el-radio :label="0">立即推送</el-radio>
              <el-radio :label="1">定时推送</el-radio>
              <el-date-picker v-model="form.pushTime"
                              :disabled="form.pushType===0"
                              value-format="yyyy-MM-dd HH:mm"
                              format="yyyy-MM-dd HH:mm "
                              type="datetime" />
            </el-radio-group>
          </el-form-item>
        </el-form>
      </slot>
      <!--底部按钮组-->
      <div class="footer-btn">
        <slot name="footer_btn">
          <el-button @click="backHandler">取消</el-button>
          <el-button type="primary"
                     :loading="btnLoading"
                     @click="Save('form')">保存</el-button>
        </slot>
      </div>
    </el-main>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <el-drawer title="消息模板(点击选中后在左侧内容展示)"
                 :visible.sync="table"
                 direction="rtl"
                 size="40%">
        <el-table :data="gridTemplist"
                  height="800"
                  @row-click="rowclicks">
          <el-table-column property="templateName"
                           label="模板名称"
                           width="200"
                           align="center" />
          <el-table-column property="templateContent"
                           label="模板内容"
                           align="center" />
        </el-table>
      </el-drawer>
    </slot>
  </el-container>
</template>
<script>
    import BaseEditForm from '../../common/BaseEditForm'
    import { deepMergeLeft, parseTime } from '@/assets/wnms/utils'
    import * as msgPushApi from '@/api/wnms/msgManage/msgPush'
    import mixins from '../msgPush/mixins.js'
    import uploadFlied from '../../../../components/wnms/Upload/uploadFlied'

    export default {
        components: { uploadFlied },
        mixins: [BaseEditForm, mixins],
        props: {
            detail: {
                required: false,
                type: Object,
                default: () => { }
            }
        },
        data () {
            const form = this.initForm()
            const rules = this.initRules()
            const checkData = this.initCheck()
            const video = this.initVideo()
            return {
                btnLoading: false,
                // 床位
                checkData: checkData,
                form: form,
                rules: rules,
                video: video,
                table: false, // 标签弹窗
                device: {
                    Bedside: [
                        { key: 'bedSide', value: '床旁分机' },
                        { key: 'bedHead', value: '床头分机' },
                        // { key: 'room', value: '门口分机' },
                        // { key: 'corridor', value: '走廊显示屏' },
                        { key: 'touchScreen', value: '触屏护理信息看板' },
                        { key: 'PDA', value: '医护人员' }
                        // { key: 'webs', value: 'web端' }
                    ],
                    Bedhead: [
                        { key: 'bedSide', value: '床旁分机' },
                        { key: 'bedHead', value: '床头分机' }
                    ]
                },
                deviceType: {
                    voice: 'wnMedicalAudioAssistant',
                    PDA: 'bnPDA',
                    corridor: 'wnCorridorScreen',
                    touchScreen: 'bnNursingTV',
                    room: 'wnDoorWayExtension',
                    bedHead: 'wnBedHeadExtension',
                    bedSide: 'wnBedSideExtension',
                    webs: 'webs'
                },
                isAll: {} // 全选
            }
        },
        created () {
            // 获取床位
            // this.getBedList()
        },
        mounted () {
            this.$nextTick(() => {
                this.$refs['form'].clearValidate()
            })
        },
        methods: {
            isNotifType () {
                if (this.form.notifyType === 0) {
                    this.form.content = ''
                } else if (this.form.notifyType === 2) {
                    this.form.isGenerateAudio = 0
                }
            },
            joinBed (T, data) {
                let _this = this
                for (let o of data) {
                    switch (T) {
                        case 'bedHead':
                            _this.form.bedIdArr.push(T + '_' + o.patientId)
                            break
                        case 'bedSide':
                            _this.form.bedIdArr.push(T + '_' + o.patientId)
                            break
                        case 'room':
                            _this.form.bedIdArr.push(T + '_' + o.roomId)
                            break
                        case 'voice':
                            _this.form.bedIdArr.push(T + '_' + o.empId)
                            break
                        case 'PDA':
                            _this.form.bedIdArr.push(T + '_' + o.empId)
                            break
                        case 'touchScreen':
                            _this.form.bedIdArr.push(T + '_' + o.deviceId)
                            break
                        case 'corridor':
                            _this.form.bedIdArr.push(T + '_' + o.deviceId)
                            break
                        case 'webs':
                            _this.form.bedIdArr.push(T + '_' + o.empId)
                            break
                    }
                }
            },

            // 全选
            check_All_Change (item) {
                if (this.isAll[item] === 1) {
                    return false
                }
                this.isAll[item] = 1
                let arr = this.checkData.bedList[item].map(res => {
                    return item + '_' + res.id
                })
                this.form.bedIdArr = this.form.bedIdArr.concat(arr)
            },

            // 反选
            check_Null_Change (item) {
                this.isAll[item] = 0
                let idArr = this.delBed(this.form.bedIdArr, item)

                this.form.bedIdArr = idArr
            },
            // 接收设备删除
            //  arr 数组
            //  delVal 等于的值或者不等于的值
            delBed (arr, delVal) {
                let _del = []
                let _addVal = []
                let array = new Set(arr)

                _addVal = new Set(_addVal)

                for (let one of this.checkData.bedList[delVal]) {
                    for (let item of array) {
                        let sp = item.split('_')

                        if (item.indexOf(delVal) > -1) {
                            if (sp[1] === one.id) {
                                _del.push(item)
                            } else {
                                _addVal.add(delVal + '_' + one.id)
                            }
                        }
                    }
                }

                for (let item of _addVal) {
                    array.add(item)
                }
                for (let item of array) {
                    for (let one of _del) {
                        if (item === one) {
                            array.delete(item)
                        }
                    }
                }

                return [...array]
            },
            // 文件上传
            uploadFlieds (data) {
                let _this = this
                // 0 视频 1 音频
                if (data.cuType === '0') {
                    _this.form.viewType = 3
                } else if (data.cuType === '1') {
                    _this.form.viewType = 2
                }
                let jsonData = JSON.parse(data.data)

                _this.form.secondsDuration = jsonData.secondDuration || 0 // 文件播放时间秒数
                _this.form.secondsDurationFormat = jsonData.formatDuration || 0 // 文件播放时间格式化字符串
                _this.form.content = data.data
                this.$refs.uploadVideoFile.clearValidate() // 关闭校验
            },

            // 改变推送方式
            changeType (val) {
                if (val === 0) {
                    this.form.pushTime = ''
                } else {
                    this.form.pushTime = parseTime(Date.parse(new Date()))
                }
            },

            judgeDate (tomodifyDate) {
                const s = Date.parse(new Date()) / 1000
                const e = new Date(tomodifyDate).getTime() / 1000
                return s - e
            },

            // 提交表单
            Save (form) {
                if (this.judgeDate(this.form.pushTime) > 0 && this.form.pushType === 1) {
                    this.$message({
                        type: 'info',
                        message: '定时推送时间必须大于当前时间'
                    })
                    return
                }
                // 通知内容
                if (this.form.notifyType === 0) {
                    this.form.viewType = 0
                }

                let diviceArr = []
                for (let k of this.form.bedDivice) {
                    diviceArr.push(this.deviceType[k])
                }
                // 接收设备
                let d = [...diviceArr]
                const index = d.findIndex(item => item === 'webs')
                if (d[index] && d[index] == 'webs') {
                    d.splice(index, 1, 'WEB')
                }
                if (d.indexOf('bnPDA') >= 0 && d.indexOf('wnMedicalAudioAssistant') < 0) d.push('wnMedicalAudioAssistant')
                this.form.receiveDevice = d.toString()
                if (this.form.bedIdArr.length > 0) {
                    this.form.voices = []
                    this.form.pdaUsers = []
                    this.form.touchScreenDevices = []
                    this.form.corridorDevices = []
                    this.form.bedHeadDevices = []
                    this.form.bedSideDevices = []
                    this.form.webs = []
                    this.mergeDevices()
                }
                //  时间不足补零
                if (this.form.pushType === 1) {
                    this.form.pushTime = this.form.pushTime + ':00'
                }

                switch (this.form.msgResource) {
                    case 'MANUAL-DEPT-MSG':
                        this.form.msgType = '病区消息'
                        break
                    case 'MANUAL-DEPT-NOTICE':
                        this.form.msgType = '病区公告'
                        break
                }

                if (this.isAddDevice(d) !== false) {
                    this.submitHandler(form)
                }
            },
            // 判断选择了设备有没有选择分机
            isAddDevice (d) {
                let _this = this
                for (let i = 0; i < d.length; i++) {
                    switch (d[i]) {
                        case 'wnBedHeadExtension':
                            if (_this.form.bedHeadDevices.length <= 0) {
                                this.$message({ type: 'error', message: '请选择设备' })
                                return false
                            }
                            break
                        case 'wnBedSideExtension':
                            if (_this.form.bedSideDevices.length <= 0) {
                                this.$message({ type: 'error', message: '请选择设备' })
                                return false
                            }
                            break
                        case 'wnMedicalAudioAssistant':
                            if (_this.form.voices.length <= 0) {
                                this.$message({ type: 'error', message: '请选择设备' })
                                return false
                            }
                            break
                        case 'bnPDA':
                            if (_this.form.pdaUsers.length <= 0) {
                                this.$message({ type: 'error', message: '请选择设备' })
                                return false
                            }
                            break

                        case 'wnCorridorScreen':
                            if (_this.form.corridorDevices.length <= 0) {
                                this.$message({ type: 'error', message: '请选择设备' })
                                return false
                            }
                            break
                        case 'bnNursingTV':
                            if (_this.form.touchScreenDevices.length <= 0) {
                                this.$message({ type: 'error', message: '请选择设备' })
                                return false
                            }
                            break
                        case 'wnDoorWayExtension':
                            if (_this.form.roomGateDevices.length <= 0) {
                                this.$message({ type: 'error', message: '请选择设备' })
                                return false
                            }
                            break
                        case 'webs':
                            if (_this.form.webs.length <= 0) {
                                this.$message({ type: 'error', message: '请选择设备' })
                                return false
                            }
                            break
                    }
                }
            },
            // 合并设备
            mergeDevices () {
                for (let o of this.form.bedIdArr) {
                    let key = o.split('_')
                    for (let b of this.checkData.bedData[key[0]]) {
                        switch (key[0]) {
                            case 'bedHead': // 门口机设备
                                if (b.patientId === key[1]) {
                                    this.form.bedHeadDevices.push({
                                        bedId: b.bedId,
                                        bedName: b.bedName,
                                        deviceId: b.deviceId,
                                        patientId: b.patientId
                                    })
                                }
                                break
                            case 'bedSide': // 门口机设备
                                if (b.patientId === key[1]) {
                                    this.form.bedSideDevices.push({
                                        bedId: b.bedId,
                                        bedName: b.bedName,
                                        deviceId: b.deviceId,
                                        patientId: b.patientId
                                    })
                                }
                                break

                            case 'room': // 门口机设备
                                if (b.roomId === key[1]) {
                                    this.form.roomGateDevices.push({
                                        deviceId: b.deviceId,
                                        roomId: b.roomId,
                                        roomName: b.roomName
                                    })
                                }
                                break
                            // case 'voice': // 医生助手设备
                            //   if (b.empId === key[1]) {

                            //   }
                            //   break
                            case 'PDA': // PDA设备
                                if (b.empId === key[1]) {
                                    this.form.pdaUsers.push({
                                        empId: b.empId,
                                        empName: b.empName
                                    })
                                    this.form.voices.push({
                                        empId: b.empId,
                                        empName: b.empName
                                    })
                                }
                                break
                            case 'touchScreen': // 触摸屏设备
                                if (b.deviceId === key[1]) {
                                    this.form.touchScreenDevices.push({
                                        deviceId: b.deviceId,
                                        deviceName: b.deviceName
                                    })
                                }
                                break
                            case 'corridor': // 走廊显示屏
                                if (b.deviceId === key[1]) {
                                    this.form.corridorDevices.push({
                                        deviceId: b.deviceId,
                                        deviceName: b.deviceName
                                    })
                                }
                                break
                            case 'webs': // webs
                                if (b.empId === key[1]) {
                                    this.form.webs.push({
                                        empId: b.empId,
                                        empName: b.empName
                                    })
                                }
                                break
                        }
                    }
                }
            },

            // 点击导入模板查看模板信息
            getTemplate () {
                // 展示 模板Table
                this.table = true
                // 获取模板信息
                this.getTemplateList(this.form.deptId)
                // 清空 checkData 数据
                // this.checkData.isIndeterminate = false
                // this.checkData.checkAll = false
                // this.form.bedIdArr = []
                // 获取当前选中的 护理单元名字
                // this.form.deptName = selectname.label
            },

            // 点击右侧导入模板后数据填写到内容区域
            rowclicks (val) {
                this.form.content = val.templateContent
            },

            // 保存数据
            customSubmitHandler () {
                // 提交时加载
                this.btnLoading = true
                if (this.detail.type === 'add') {
                    msgPushApi
                        .Add(this.form)
                        .then(data => {
                            this.submitSuccessHandler(data)
                        })
                        .finally(() => {
                            // 提交时加载
                            this.btnLoading = false
                        })
                } else {
                    msgPushApi
                        .Edit(this.form)
                        .then(data => {
                            // 提交时加载
                            this.submitSuccessHandler(data)
                        })
                        .finally(() => {
                            // 提交时加载
                            this.btnLoading = false
                        })
                }
            },

            // 设备选择
            handleChangeDivice (v) {
                let arr = []
                if (this.form.bedIdArr.length > 0) {
                    for (let item of v) {
                        for (let one of this.form.bedIdArr) {
                            if (one.indexOf(item) > -1) {
                                arr.push(one)
                            }
                        }
                    }
                }

                this.form.bedIdArr = arr
            },

            // 床位单选
            handleCheckedDebChange (T) { },
            // 清空
            clearFormValidate () {
                this.form.bedDivice = []
                if (this.form.msgResource === 'MANUAL-DEPT-NOTICE') {
                    this.form.content = ''
                    this.form.notifyType = 0
                }
                this.$nextTick(() => {
                    this.$refs['form'].clearValidate()
                })
            }
        }
    }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  //@import url(); 引入公共css类
  @import '@/assets/wnms/css/self_common.scss';

  // 多选框的容器样式
  .checkbox-demo-mngBroadcast {
    width: 94%;
    max-height: 190px;
    border: 1px solid #ebe7e9;
    padding: 6px 10px;
    overflow-y: scroll;
    margin-top: 15px;
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    height: 3px !important;
    width: 3px !important;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    background: #bababa;
  }
  .btn-demo-mngBroadcast {
    .el-button--primary,
    .el-button--primary:focus,
    .el-button--primary:visited,
    .el-button--primary:hover {
      background-color: #ecf5ff !important;
      border-color: #1e87f0 !important;
      color: #409eff;
    }
  }
  .checkboxbor {
    border: 1px solid #ccc;
    height: 25vh;
    overflow-y: auto;
    padding: 20px;
    width: 85%;
  }
  .divcheck {
    width: 500px;
    height: 50px;
  }
  .checkbtn {
    border: 1px solid #409eff;
    width: 70px;
    text-align: center;
  }
  .elcheckbox {
    width: 110px;
    /deep/.el-checkbox__label {
      width: 80px;
      overflow: hidden; /*溢出隐藏*/
      text-overflow: ellipsis; /*以省略号...显示*/
      white-space: nowrap; /*强制不换行*/
      position: relative;
      top: 6px;
    }
  }
</style>
