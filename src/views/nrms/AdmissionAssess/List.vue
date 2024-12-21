<template>
  <layout>
    <div slot="aside" v-if="!isPreview">
      <patient-list
          @initPatient="initPatient"
          initRowType="in"
          initRowIndex="0"
      />
    </div>
    <div slot="main">
      <div  class="record-edit" v-show="formShow && riskShow" style="height: 100%;position: relative;width: 100%;">
        <div class="print" style="text-align: right;padding: 10px;" v-if="!isPreview">
          <el-button
              class="print-btn"
              type="success"
              size="mini"
              @click="clickPrintFn"
          >打印</el-button
          >
        </div>
        <div class="typt-add-container" style="position: absolute;height: calc(100% - 110px);">
          <div class="typt-add-form" id="printHtml" style="width: 1050px;padding: 40px 0;margin: 0 auto">
            <formHeader :autoHead="autoHead"></formHeader>
            <!-- 自动表单 -->
            <div>
              <auto-form class="zhongxin-assess" v-if="update" :data="data" :valueData="valueData" :isEdit="isEdit" :patient="patient" :tempList="tempList"></auto-form>
            </div>
            <div class="spacer"></div>
          </div>
        </div>
        <div class="typt-add-footer" v-if="!isPreview">
          <el-button type="primary" @click="saveData" :disabled="patient.patientType != EPatientType.in && patient.outHospitalFlag != EOutHospitalFlag.return">保存</el-button>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import layout from '../../../components/nrms/layout/aside'
import listLayout from '../../../components/nrms/layout/list'
import AutoForm from '../../../assets/nrms/mixins/AutoForm'

import { zhongxinRuyuanAssess } from '../FormManageData/zhongxin_ruyuan_assess_data'
import PatientList from '../../../components/nrms/PatientList'
import { ApiAssManage } from '../../../api/nrms/index'
import { EOutHospitalFlag, EPatientType } from '../../../assets/nrms/enum/patient'
const moment = require('moment')

export default {
  name: 'admission_assess',
  props: ['previewItem', 'isPreview'],
  mixins: [AutoForm],
  components: {
    PatientList,
    layout,
    listLayout,
    formHeader: () => import('../../../components/nrms/autoForm/header'),
    AutoForm: () => import('../../../components/nrms/autoForm/autoForm')
  },
  data () {
    return {
      data: {},
      valueData: [],
      row: null,
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {},
        hospitalLogo: ''
      },
      update: true,
      patient: {},
      saveDataFlag: false,
      managerListParams: {
        assClass: 9,
        page: 1,
        size: 10
      },
      searchObj: {
        patientId: '',
        recordType: '',
        assClass: '9',
        sort: {
          formCode: 1
        }
      },
      temp: {},
      tempList:[],//风险评估列表
      riskShow:false,
      formShow: false,
      moduleJson: {},
      current_account: {},
      EPatientType,
      EOutHospitalFlag,
      modifyData: {},
      isEdit: false
    }
  },
  async created () {
    // 初始化
    // 当预览的时候
    if (this.isPreview) {
      this.data = JSON.parse(JSON.stringify(this.previewItem.moduleJson))
      this.autoHead.moduleId = this.previewItem.moduleId
      this.autoHead.tplHtml = this.previewItem.assStyle
      this.autoHead.formName = this.previewItem.assName
      this.autoHead.tplId = this.previewItem.assCode
      this.operatorFormData()

      this.riskShow = true
      this.formShow = true
    } else {
      await this.getManagerList()
      await this.getRiskmentList()
    }
    // this.getElementsKey()
    // console.log(JSON.stringify(this.data), '=================')
    // await this.getData()
  },
  activated () {
  },
  mounted () {
  },
  methods: {
    /* 获取风险评估表单列表 */
    async getRiskmentList () {
      let managerListParams = {
        assClass: 10
      }
      try {
        let res = await ApiAssManage.assMangerList(managerListParams)
        this.tempList = res.data || []
        this.riskShow = true
        // this.changeAssId(this.tempList[0])
      } catch (error) {}
    },
    /* 获取表单列表 */
    async getManagerList () {
      try {
        let res = await ApiAssManage.assMangerList(this.managerListParams)
        if (!res.data || !res.data.list || res.data.list.length <= 0) {
          this.$message({
            type: 'error',
            message: '请先配置表单样式'
          })
          return
        }
        res.data.list.map(item => {
          this.autoHead.moduleId = item.moduleId
          this.autoHead.tplHtml = item.assStyle
          this.autoHead.formName = item.assName
          this.autoHead.tplId = item.assCode
          this.temp = { ...item }
        })
        this.moduleJson = JSON.parse(JSON.stringify(res.data.list[0].moduleJson))
        this.formShow = true
      } catch (error) {}
    },
    initPatient (patient, type = 0) {
      this.patient = patient
      localStorage.setItem('formPatientId', patient.patientId)
      this.$set(this.patient, 'patientType', type)
      let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
      this.current_account.empName = empInfo.empName
      console.log(this.patient)
      if (this.patient && this.patient.patientId) {
        this.autoHead.tplData = this.patient
      }
      this.getData()
      this.$set(this.patient, 'patientType', type)
    },
    async getData () {
      this.loading = true
      try {
        this.searchObj.patientId = this.patient.patientId
        let res = await ApiAssManage.getList(this.searchObj)
        this.modifyData = {}
        this.data = JSON.parse(JSON.stringify(this.temp.moduleJson))
        if (res.data && res.data.length > 0) {
          let last = res.data[res.data.length - 1]
          this.modifyData = last
          this.valueData = []
          this.operatorFormData()
          let valueData = JSON.parse(last.module_value)
          this.valueData.map(item => {
            valueData.map(v => {
              if (item.key === v.key) {
                item.value = v.value
              }
            })
          })
          this.isEdit = true
          this.update = false
          this.$nextTick(() => {
            this.update = true
          })
        } else {
          this.isEdit = false
          this.valueData = []
          this.operatorFormData()
          this.update = false
          this.$nextTick(() => {
            this.update = true
          })
        }
        this.valueData.map((item) => {
          switch (item.key) {
            case '1617169577000_84803':
              if (!item.value) {
                item.value = this.current_account.empName
              }
              break
            case '1617169577000_42874':
              if (!item.value) {
                item.value = this.patient.diagnose
              }
              break
            case '1617169577000_17551':
              if (!item.value) {
                item.value = this.patient.diagnose
              }
              break
          }
        })
      } catch (error) {}
      this.loading = false
    },
    async saveData () {
      const columnValue = []
      this.valueData.map(async (item, index) => {
        switch (item.key) {
          case '1617169577000_17551':
            // 日期
            if (!item.value) {
              item.value = moment().format('YYYY-MM-DD hh:mm')
            }
            if (item.value) {
              columnValue.push({
                key: 'formCode',
                value: item.value
              })
            }
            break
          default:
            break
        }
      })
      let params = {
        assId: this.temp.assId, // 评估单ID
        moduleId: this.temp.moduleId, // 模板ID
        moduleValue: this.valueData, // 评估值
        haveRecordRate: 0, // 是否多次记录
        patientId: this.patient.patientId, // 患者ID
        columnValue: columnValue
      }
      // params.columnValue =
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
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
/deep/ .assSelect {
  .el-input__inner {
    height: 34px;
    width: 300px;
  }
}
.zhongxin-assess {
  /deep/input.el-input__inner {
    padding: 0 1px;
  }
  /deep/input.el-input__inner {
    padding: 0 1px;
  }
  /deep/.el-date-editor .el-input__inner {
    padding: 0 0 0 30px;
  }
}
@media screen and (max-height: 840px) {
  .typt-add-container {
    max-height: calc(100% - 110px);
  }
}
@media screen and (max-height: 950px) {
  .typt-add-container {
    max-height: calc(100% - 110px);
  }
}
.typt-add-footer {
  padding: 8px 0;
  position: absolute;
  bottom: 0px;
  text-align: center;
  border-top: 1px solid #eee;
  width: 100%;
  background: #fff;
}
.spacer {
  height: 50px;
  width: 100%;
}

</style>
