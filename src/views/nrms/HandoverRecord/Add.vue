<template>
  <div  class="record-edit">
    <div class="typt-tit-cls" v-if="!isPreview">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{ titMsg }}{{ recordObj.recordType }}</div>
    </div>
    <div class="typt-add-container">
      <div class="print" v-if="!isPreview">
        <el-button
          class="print-btn"
          type="primary"
          size="mini"
          @click="clickPrintFn"
          >打印</el-button
        >
      </div>
      <div class="typt-add-form" id="printHtml" style="width: 1050px;padding: 40px 0">
        <formHeader :autoHead="autoHead"></formHeader>
        <div class="spicer" style="height: 10px"></div>
        <!-- 自动表单 -->
        <div :class="{'operation-style': tempId == '10014','xinjiang-style': tempId == '10018',
        'zhongxin-style': tempId == '10025'||tempId == '10026' || tempId == '10043'}">
          <auto-form v-if="update" :data="data" :valueData="valueData" :isEdit="row"></auto-form>
        </div>
        <div class="hidden" v-if="tempId == '10018' && !isPreview" style="text-align: right;margin-top: 20px">
          第1页
        </div>
      </div>
    </div>
    <div class="typt-add-footer" v-if="!isPreview">
      <el-button @click="reloadUrl">取消</el-button>
      <el-button type="primary" @click="saveData" :disabled="saveDataFlag"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { ApiAssManage, ApiNurseUploadLogo } from '../../../api/nrms'
import { DisabledData, DisabledData2, DisabledData3 } from './disabled-data.js'

export default {
  name: 'partrol_Record',
  props: ['modifyData', 'params', 'isPreview', 'previewItem'],
  mixins: [AutoForm],
  components: {
    formHeader: () => import('../../../components/nrms/autoForm/header'),
    AutoForm: () => import('../../../components/nrms/autoForm/autoForm')
  },
  data () {
    return {
      titMsg: '添加',
      patient: {},
      current_account: {},
      formData: {},
      recordObj: {},
      infoObjFlag: false,
      receiveObjFlag: true,
      infoObj: {},
      receiveObj: {},
      saveDataFlag: false,
      data: {},
      valueData: [],
      row: null,
      // 查询交接单模板列表参数
      tempId: '',
      temp: {},
      assId: '',
      update: true,
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {},
        hospitalLogo: ''
      },
      printStyle: `
        .operation-style .prefix,.xinjiang-style .prefix {
          font-size: 18px;
        }
        .operation-style .suffix,.xinjiang-style .suffix {
          font-size: 18px;
        }
        .operation-style .text-form-label, .xinjiang-style .text-form-label {
          font-size: 18px;
        }
        .operation-style .el-input__inner, .xinjiang-style .el-input__inner {
          font-size: 18px;
        }
        .operation-style .el-checkbox__label, .xinjiang-style .el-checkbox__label {
          font-size: 18px;
        }
        .operation-style .el-checkbox__inner {
          width: 18px;
          height: 18px;
        }
        .xinjiang-style .el-checkbox__inner {
          width: 18px;
          height: 18px;
          border-color: #000;
        }
        .xinjiang-style .el-checkbox__input.is-checked .el-checkbox__inner {
          border-color: #000;
        }
        .operation-style .el-checkbox__inner::after, .xinjiang-style .el-checkbox__inner::after {
          border-width: 3px;
          height: 11px;
          left: 5px;
          top: 0px;
          width: 4px;
          border-left: 0;
          border-top: 0;
          border-color: #000;
        }
        .operation-style .el-checkbox {
          color: #333;
        }
        .xinjiang-style .el-checkbox {
          color: #000;
        }
        .operation-style .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #333;
        }
        .xinjiang-style .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #000;
        }
        .operation-style .el-textarea__inner {
          font-size: 18px;
        }
        .xinjiang-style input.el-input__inner {
          border: none;
        }
        .xinjiang-style .el-textarea__inner {
          color: #333;
          resize:none;
          font-size: 18px;
          padding: 0;
          border: none;
          font-family: Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif;
        }
        /** 中心医院转科交接单 **/
        .zhongxin-style .el-input__inner {
          border-radius: 0;
          border-color: #333!important;
        }
        .zhongxin-style .el-input.is-disabled .el-input__inner {
          border-radius: 0;
          background: white;
          border-color: #333!important;
        }
        .zhongxin-style .el-checkbox__input.is-disabled .el-checkbox__inner {
          background: white;
        }
        .zhongxin-style .el-checkbox__input.is-disabled + span.el-checkbox__label{
          color:#333;
        }
        .zhongxin-style .el-radio__label{
          color:#333;
          font-size: 18px;
        }
        .zhongxin-style .el-radio__inner {
          border-radius: 2px !important;
          background-color: white;
          border-color: #000;
        }
        .zhongxin-style  .el-radio__input.is-disabled + span.el-radio__label {
          color: #333
        }
        .zhongxin-style  .el-radio__input.is-checked + .el-radio__label{
          color: #333;
        }
        .zhongxin-style .el-radio__input.is-checked .el-radio__inner{
          border-color: black;
        }
        .zhongxin-style .el-radio__input.is-checked .el-radio__inner::after {
          left:0;
          top: 0;
          width: 100%;
          height: 50%;
          border: 3px solid black;
          border-radius: 1px;
          border-top: none;
          border-right: none;
          background: transparent;
          transform: rotate(-45deg);
        }
        .zhongxin-style .el-checkbox__label {
          font-size: 18px;
          color:#333;
        }
        .zhongxin-style .el-checkbox__inner {
          background-color: white;
          border-color: #000;
        }
        .zhongxin-style .el-checkbox is-checked {
          color: #333
        }
        .zhongxin-style .el-checkbox__input.is-disabled .el-checkbox__inner {
          border-color: #000;
          background-color: #fff;
        }
        .zhongxin-style .grid-columns {
          border-color: #000!important;
        }
        .zhongxin-style .grid {
          border-color: #000!important;
        }
        .zhongxin-style .borderStyle {
          border-color: #000!important;
        }
        .zhongxin-style .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #333!important;
        }
        .zhongxin-style .el-checkbox__input.is-checked .el-checkbox__inner {
          border-color: #333!important;
        }
        .zhongxin-style .el-textarea__inner {
          border-color: #333!important;
        }
        .zhongxin-style .el-textarea {
          font-size: 18px;
        }
        .zhongxin-style .el-checkbox__inner::after {
          border-width: 3px;
          height: 11px;
          left: 5px;
          top: 0px;
          width: 4px;
          border-left: 0;
          border-top: 0;
          border-color: #000;
        }
        .zhongxin-style .el-checkbox__inner {
          width: 18px;
          height: 18px;
          border-color: #000;
        }

      `
    }
  },
  async created () {
    if (this.isPreview) this.params.temp = this.previewItem
    this.recordObj = { ...this.modifyData }
    this.temp = { ...this.params.temp }
    this.tempId = this.temp.moduleId
    this.assId = this.temp.assId
    this.patient = { ...this.params.patient }

    this.autoHead.moduleId = this.temp.moduleId
    this.autoHead.tplHtml = this.temp.assStyle
    this.autoHead.formName = this.temp.assName
    this.autoHead.tplId = this.temp.assCode
    if (this.patient && this.patient.patientId) {
      this.autoHead.tplData = this.patient
    }

    await this.initData()
  },
  methods: {
    async initData () {
      this.data = JSON.parse(JSON.stringify(this.temp.moduleJson))
      if (this.isPreview) return false
      // console.log(TransferData, 'TransferData')
      // this.data = JSON.parse(JSON.stringify(TransferData))
      // 初始化
      let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
      let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
      let userId = localStorage.getItem('userId') || ''
      this.current_account.deptId = deptInfo.deptId
      this.current_account.id = empInfo.empId
      this.current_account.account = userId
      this.current_account.empName = empInfo.empName
      this.current_account.deptName = deptInfo.deptName

      let key = this.modifyData.ass_record_id || ''
      if (key == '') {
        this.operatorFormData()
        this.recordObj.patientId = this.patient.patientId || ''
        if (this.tempId == '10014') {
          return
        }
        // console.log('走进来了==========')
        this.valueData.map((item) => {
          switch (item.key) {
            case '1601364493000_61933':
              item.value = this.current_account.deptName
              break
            case '1601364493000_35518':
              item.value = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
              break
            case '1601364493000_365518':
              item.value = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
              break
            case '1601364493000_9461':
              item.value = this.current_account.empName
              break
            case '1606284173000_40649':
              item.value = this.patient.patientName
              break
            case '1606284173000_37945':
              item.value = this.patient.patientAge
              break
            case '1606284173000_35253':
              item.value = this.patient.sex
              break
            case '1606284173000_32570':
              item.value = this.patient.diagnose
              break
          }
        })
      } else {
        this.valueData = JSON.parse(this.modifyData.module_value)
        this.titMsg = '编辑'
        if (this.tempId == '10014' || this.tempId == '10026' || this.tempId == '10043') {
          if (
            (this.patient.patientType == 2 && this.patient.outHospitalFlag != 1)
          ) {
            this.saveDataFlag = true
          }
          return
        }
        if (this.recordObj.turnOutDeptId != this.current_account.deptId) {
          // 根据PRD，如果当前登陆帐号部门名与转出科室不相同，禁止修改转入资料
          this.infoObjFlag = true
          this.receiveObjFlag = false
          if (!this.recordObj.turnInDeptId) {
            this.valueData.map((item) => {
              switch (item.key) {
                case '1601364493000_60472':
                  item.value = this.current_account.deptName
                  break
                case '1601364493000_76883':
                  item.value = this.formatDate(
                    new Date(),
                    'yyyy-MM-dd hh:mm:ss'
                  )
                  break
                case '1601364493000_44735':
                  item.value = this.current_account.empName
                  break
                case '1616038293000_88864':
                  item.value = this.current_account.deptName
                  break
                case '1616038293000_2902':
                  item.value = this.formatDate(
                    new Date(),
                    'yyyy-MM-dd hh:mm:ss'
                  )
                  break
                case '1616038293000_10899':
                  item.value = this.current_account.empName
                  break
              }
            })
          }
        }
      }
      if (this.infoObjFlag) {
        if (this.tempId !== '10025' || this.temp.authControl) {
          this.operatorFormData((item) => {
            if (DisabledData.indexOf(item.key) >= 0) {
              item.config.disabled = true
              item.config.keyDisabled = ''
            }
          })
        }
      }

      if (this.receiveObjFlag && this.tempId) {
        if (this.tempId !== '10025' || this.temp.authControl) {
          this.operatorFormData((item) => {
            if (DisabledData2.indexOf(item.key) >= 0) {
              item.config.disabled = true
              item.config.keyDisabled = ''
            }
          })
        }
      }

      if (
        this.patient.outHospitalFlag != undefined &&
        this.patient.outHospitalFlag != 1
      ) {
        this.saveDataFlag = false
      }

      if (
        (this.infoObjFlag == true && this.receiveObjFlag == true) ||
        (this.patient.patientType == 2 && this.patient.outHospitalFlag != 1)
      ) {
        this.infoObjFlag = false
        this.receiveObjFlag = false
        this.saveDataFlag = true
      }
    },
    reloadUrl () {
      this.$emit('option-changed', 'list', this.patient)
    },
    async clickPrintFn () {
      if (!this.modifyData.ass_record_id && this.tempId == '10015') {
        const obj = {}
        this.valueData.map((item) => {
          switch (item.key) {
            case '1601364493000_61933':
              obj.deptName = item.value
              break
            case '1601364493000_35518':
              obj.date = item.value
              break
            case '1601364493000_9461':
              obj.empName = item.value
          }
        })
        this.valueData.map((item) => {
          switch (item.key) {
            case '1601364493000_61933':
              item.value = ''
              break
            case '1601364493000_35518':
              item.value = ''
              break
            case '1601364493000_9461':
              item.value = ''
          }
        })
        this.update = false
        await new Promise((resolve) => {
          this.$nextTick(() => {
            this.update = true
            resolve()
          })
        })
        this.clickPrint()
        this.valueData.map((item) => {
          switch (item.key) {
            case '1601364493000_61933':
              item.value = obj.deptName
              break
            case '1601364493000_35518':
              item.value = obj.date
              break
            case '1601364493000_9461':
              item.value = obj.empName
          }
        })
        this.update = false
        this.$nextTick(() => {
          this.update = true
        })
      } else {
        this.clickPrint()
      }
    },
    async saveData () {
      let params = {
        assId: this.assId, // 评估单ID
        moduleId: this.tempId, // 模板ID
        moduleValue: this.valueData, // 评估值
        haveRecordRate: 0, // 是否多次记录
        patientId: this.patient.patientId // 患者ID
      }
      const condition = []
      condition.push({
        key: 'recordType',
        value: this.temp.assName
      })
      switch (this.tempId) {
        case '10014':
          condition.push({
            key: 'turnOutDeptId',
            value: this.recordObj.turnOutDeptId || this.current_account.deptId
          })
          if (this.modifyData.ass_record_id && this.recordObj.turnOutDeptId != this.current_account.deptId) {
            condition.push({
              key: 'turnInDeptId',
              value: this.current_account.deptId
            })
          }
          break
        case '10015':
          if (!this.modifyData.ass_record_id || this.recordObj.turnOutDeptId == this.current_account.deptId) {
            condition.push({
              key: 'turnOutDeptId',
              value: this.current_account.deptId
            })
            // 转出科室
            this.valueData.map((item) => {
              switch (item.key) {
                case '1601364493000_61933':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutDeptName',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_35518':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutTime',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_9461':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutUser',
                      value: item.value
                    })
                  }
                  break
              }
            })
          } else {
            condition.push({
              key: 'turnInDeptId',
              value: this.current_account.deptId
            })
            condition.push({
              key: 'turnOutDeptId',
              value: this.recordObj.turnOutDeptId
            })
            // 转出科室
            this.valueData.map((item) => {
              switch (item.key) {
                case '1601364493000_61933':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutDeptName',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_35518':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutTime',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_9461':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutUser',
                      value: item.value
                    })
                  }
                  break
              }
            })
            // 转入科室
            this.valueData.map((item) => {
              switch (item.key) {
                case '1601364493000_60472':
                  if (item.value) {
                    condition.push({
                      key: 'turnInDeptName',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_76883':
                  if (item.value) {
                    condition.push({
                      key: 'turnInTime',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_44735':
                  if (item.value) {
                    condition.push({
                      key: 'turnInUser',
                      value: item.value
                    })
                  }
                  break
              }
            })
          }
          break

        case '10018':
          condition.push({
            key: 'turnOutDeptId',
            value: this.recordObj.turnOutDeptId || this.current_account.deptId
          })
          if (this.modifyData.ass_record_id && this.recordObj.turnOutDeptId != this.current_account.deptId) {
            condition.push({
              key: 'turnInDeptId',
              value: this.current_account.deptId
            })
          }
          let time = ''
          this.valueData.map(item => {
            switch (item.key) {
              case '1606284173000_82773':
                if (item.value) {
                  condition.push({
                    key: 'turnOutDeptName',
                    value: item.value
                  })
                }
                break
              case '1606284173000_48413':
                if (item.value) {
                  condition.push({
                    key: 'turnInDeptName',
                    value: item.value
                  })
                }
                break
              case '1606284173000_65688':
                if (item.value) {
                  time += item.value
                }
                break
              case '1606284173000_24606':
                if (time && item.value) {
                  time += ' ' + item.value
                }
                break
              case '1606284173000_66152':
                if (item.value) {
                  condition.push({
                    key: 'turnOutUser',
                    value: item.value
                  })
                }
                break
              case '1606284173000_66774':
                if (item.value) {
                  condition.push({
                    key: 'turnInUser',
                    value: item.value
                  })
                }
                break
              default:
                break
            }
          })
          if (time) {
            condition.push({
              key: 'turnOutTime',
              value: time
            })
            condition.push({
              key: 'turnInTime',
              value: time
            })
          }
          break
        case '10025':
          if (!this.modifyData.ass_record_id || this.recordObj.turnOutDeptId == this.current_account.deptId) {
            condition.push({
              key: 'turnOutDeptId',
              value: this.current_account.deptId
            })
            // 转出科室
            this.valueData.map((item) => {
              switch (item.key) {
                case '1601364493000_61933':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutDeptName',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_35518':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutTime',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_9461':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutUser',
                      value: item.value
                    })
                  }
                  break
              }
            })
          } else {
            condition.push({
              key: 'turnInDeptId',
              value: this.current_account.deptId
            })
            condition.push({
              key: 'turnOutDeptId',
              value: this.recordObj.turnOutDeptId
            })
            // 转出科室
            this.valueData.map((item) => {
              switch (item.key) {
                case '1601364493000_61933':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutDeptName',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_35518':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutTime',
                      value: item.value
                    })
                  }
                  break
                case '1601364493000_9461':
                  if (item.value) {
                    condition.push({
                      key: 'turnOutUser',
                      value: item.value
                    })
                  }
                  break
              }
            })
            // 转入科室
            this.valueData.map((item) => {
              switch (item.key) {
                case '1616038293000_88864':
                  if (item.value) {
                    condition.push({
                      key: 'turnInDeptName',
                      value: item.value
                    })
                  }
                  break
                case '1616038293000_2902':
                  if (item.value) {
                    condition.push({
                      key: 'turnInTime',
                      value: item.value
                    })
                  }
                  break
                case '1616038293000_10899':
                  if (item.value) {
                    condition.push({
                      key: 'turnInUser',
                      value: item.value
                    })
                  }
                  break
              }
            })
          }
          break
        case '10026':
        case '10043':
          condition.push({
            key: 'turnOutDeptId',
            value: this.recordObj.turnOutDeptId || this.current_account.deptId
          })
          condition.push({
            key: 'turnOutDeptName',
            value: this.recordObj.turnOutDeptName || this.current_account.deptName
          })
          let turnInUser = '' // 如果用icu护士就用icu，没有就用pacu
          let turnInTime = '' // 同理
          // 转出科室
          this.valueData.map((item) => {
            switch (item.key) {
              case '1601364493000_35518':
                if (item.value) {
                  condition.push({
                    key: 'turnOutTime',
                    value: item.value
                  })
                }
                break
              case '1601364493000_9461':
                if (item.value) {
                  condition.push({
                    key: 'turnOutUser',
                    value: item.value
                  })
                }
                break
            }
          })
          // 转入科室
          this.valueData.map((item) => {
            switch (item.key) {
              // 转入
              case '1615966742000_20211':
                // pacu护士
                if (item.value) {
                  turnInUser = item.value
                }
                break
              case '1615966742000_8221':
                // 交接时间
                if (item.value) {
                  turnInTime = item.value
                }
                break
              case '1615966742000_79523':
                if (item.value) {
                  turnInUser = item.value
                }
                break
              case '1615966742000_45968':
                if (item.value) {
                  turnInTime = item.value
                }
                break
            }
          })
          if (turnInTime) {
            condition.push({
              key: 'turnInTime',
              value: turnInTime
            })
          }
          if (turnInUser) {
            condition.push({
              key: 'turnInUser',
              value: turnInUser
            })
          }
          break
      }
      params.columnValue = condition
      try {
        if (this.modifyData.ass_record_id) {
          params.assRecordId = this.modifyData.ass_record_id
          delete params.haveRecordRate
          let res = await ApiAssManage.edit(params)
          this.$message.success('编辑成功')
          this.$emit('option-changed', 'list', this.patient)
        } else {
          let res = await ApiAssManage.add(params)
          this.$message.success('添加成功')
          this.$emit('option-changed', 'list', this.patient)
        }
      } catch (error) {
        this.$message.error(error.message)
        return false
      }
    },
    formatDate (date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length)
          )
        }
      }
      return fmt
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
/* 覆盖element css */
.record-edit {
  height: 100%;
}

.record-edit .el-form-item {
  height: 22px;
  padding-top: 0px;
}
#printHtml {
  width: 1000px;
  margin: 0px auto;
  padding-top: 20px;
  position: relative;
}
.printButton {
  position: absolute;
  top: 40px;
  right: 0px;
}
.orgName {
  width: 100%;
  font-size: 24px;
  line-height: 150%;
  display: block;
  text-align: center;
  margin-top: -10px;
}
.formTit {
  width: 100%;
  font-size: 32px;
  display: block;
  line-height: 150%;
  text-align: center;
}
#printHtml ul {
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  text-align: center;
}
#printHtml ul li {
  display: inline-block;
  list-style: none;
  padding: 5px 10px;
}
.tCenter {
  text-align: center;
}
.typt-add-container {
  max-height: 1000px;
}
@media screen and (max-height: 950px) {
  .typt-add-container {
    max-height: 1000px;
  }
}
.print {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  padding-top: 13px;
  .print-btn {
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    height: 28px;
  }
}
.typt-add-footer {
  height: 56px;
  line-height: 56px;
  box-shadow: 0px 0px 6px 1px rgba(114, 114, 114, 0.3);
  margin-bottom: 13px;
}
/deep/ .operation-style, /deep/ .xinjiang-style {
  .prefix {
    font-size: 18px;
  }
  .suffix {
    font-size: 18px;
  }
  .text-form-label {
    font-size: 18px;
  }
  .el-input__inner {
    font-size: 18px;
  }
  .el-checkbox__label {
    font-size: 18px;
  }
  .el-checkbox__inner {
    width: 18px;
    height: 18px;
  }
  .el-checkbox {
    color: #333;
  }
  .el-checkbox__inner::after {
    border: 3px solid #FFF;
    height: 11px;
    left: 5px;
    top: 0px;
    width: 4px;
    border-left: 0;
    border-top: 0;
  }
  .el-textarea__inner {
    font-size: 18px;
  }
}
  /deep/ .xinjiang-style .el-textarea__inner {
    padding: 0;
  }
  .hidden {
    display: none;
  }
  .zhongxin-style {
    /deep/ .grid-columns {
      border-color: #000!important;
    }
    /deep/ .grid {
      border-color: #000!important;
    }
    /deep/ .borderStyle {
      border-color: #000!important;
    }
    /deep/ .el-radio__label {
      color: #333;
    }
    /deep/ .el-textarea {
      font-size: 18px;
    }
    /deep/ .el-radio__input.is-checked .el-radio__inner::after {
      left:0;
      top: -2px;
      width: 100%;
      height: 50%;
      border: 3px solid #FFF;
      border-radius: 1px;
      border-top: none;
      border-right: none;
      background: transparent;
      transform: rotate(-45deg);
    }
    /deep/.el-checkbox__inner::after {
      border: 3px solid #FFF;
      height: 11px;
      left: 3px;
      top: -3px;
      width: 4px;
      border-left: 0;
      border-top: 0;
    }
    /deep/.prefix {
      font-size: 18px;
    }
    /deep/.suffix {
      font-size: 18px;
    }
    /deep/.text-form-label {
      font-size: 18px;
    }
    /deep/.el-input__inner {
      font-size: 18px;
    }
    /deep/.el-checkbox__label {
      font-size: 18px;
    }
    /deep/ .el-radio__label {
      font-size: 18px;
    }
    /deep/ input.el-input__inner {
      padding: 0 1px;
      border-color: #333;
    }
    /deep/.el-date-editor .el-input__inner {
      padding: 0 0 0 30px;
    }
    /deep/ .is-disabled input.el-input__inner {
      border: none;
    }
    /deep/ .el-textarea__inner {
      border-color: #333;
    }
  }
</style>
