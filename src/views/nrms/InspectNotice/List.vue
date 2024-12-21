<template>
  <layout>
    <div slot="aside">
      <!-- 患者列表 -->
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0" />
    </div>
    <div slot="main" class="main-list">
      <listLayout>
        <div slot="right_btn" class="tool-bar">
          <el-button type="success" size="small" @click="printDo">打印</el-button>
        </div>
        <div slot="main" class="main-list">
          <formHeader :autoHead="autoHead"></formHeader>
          <el-table :data="inspectTemplate.list" stripe highlight-current-row border>
            <el-table-column
              prop="date"
              label="日期"
              align="left"
              width="180"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-date-picker
                  style="width: 150px"
                  :disabled="inspectValue[scope.row.id].isConfirm"
                  v-model="inspectValue[scope.row.id].date"
                  type="date"
                  placeholder="选择检查日期">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="inspect"
              label="检查项目"
              align="left"
              width="200"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-checkbox-group v-model="inspectValue[scope.row.id].inspects" :disabled="inspectValue[scope.row.id].isConfirm" >
                  <el-checkbox :label="item" :key="index" v-for="(item, index) in scope.row.inspects"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="检查时间"
              align="left"
              width="180"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-time-picker
                  style="width: 150px"
                  v-model="inspectValue[scope.row.id].time"
                  placeholder="选择检查时间"
                  :disabled="inspectValue[scope.row.id].isConfirm"
                  format="HH:mm"
                >
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column header-align="center" prop="places" label="地点" align="center" width="200">
              <template slot-scope="scope">
                <div v-html="scope.row.places" style="white-space: pre-wrap;"></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="attention"
              label="注意事项"
              align="left"
              width="200"
              header-align="center"
            >
              <template slot-scope="scope">
                <div v-html="scope.row.attention" style="white-space: pre-wrap;"></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              align="left"
              width="200"
              header-align="center"
            >
              <template slot-scope="scope">
                <div v-html="scope.row.remark" style="white-space: pre-wrap;"></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="signature"
              label="护士/家属签名"
              align="left"
              header-align="center"
            >
              <template slot-scope="scope">
                <span v-if="inspectValue[scope.row.id].isConfirm">已确认</span>
                <span v-if="inspectValue[scope.row.id].inspects && inspectValue[scope.row.id].inspects.length && !inspectValue[scope.row.id].isConfirm" style="color: #f56c6c">未确认</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="describe" v-if="inspectTemplate.describe">
            <div style="width: 680px;margin: 0 auto">
                <div v-html="inspectTemplate.describe" style="white-space: pre-wrap;"></div>
            </div>
          </div>
          <div style="display: none">
            <print ref="print" :autoHead="autoHead" :inspectTemplate="inspectTemplate" :inspectValue="inspectValue" :printSet="printSet"></print>
          </div>
        </div>
        <div slot="footer" class="footer" v-if="patient && patient.patientType != EPatientType.out">
          <!-- <el-button @click="cancel">取消</el-button> -->
          <el-button type="primary" @click="confirm">保存</el-button>
        </div>
      </listLayout>
    </div>
  </layout>
</template>
<script>
import PatientList from '../../../components/nrms/PatientList'
import layout from '../../../components/nrms/layout/aside'
import formHeader from '../../../components/nrms/autoForm/header'
import { ApiAutoForm, ApiInspectionTemp, ApiInspectionValue } from '../../../api/nrms/index'
import { EFormType } from '../../../assets/nrms/enum/formManage'
import { EPatientType } from '../../../assets/nrms/enum/patient'
import listLayout from '../../../components/nrms/layout/list'
import print from './Print'

export default {
  data () {
    return {
      autoHead: {
        // 自动表头
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      formInfo: null, // 表单信息
      inspectTemplate: {},
      inspectValue: {},
      inspectValueItem: {
        date: '',
        time: '',
        inspects: [],
        isConfirm: false
      },
      oldInspectValue: {},
      isEdit: false,
      templateValueId: '',
      printSet: '',
      EPatientType
    }
  },
  async mounted () {
  },
  async activated () {
  },
  methods: {
    /**
    * ------------------------------------------------------------------
    * 初始化函数
    * ------------------------------------------------------------------
    */
    async initPatient (patient, type = 0) {
      this.patient = patient
      this.$set(this.patient, 'patientType', type)
      // 获取检查单模板和数据
      this.autoHead.tplData = this.patient
      await this.getFormInfo()
      this.autoHead.tplHtml = this.formInfo.formStyle
      this.autoHead.formName = this.formInfo.formName
      await this.getTemplate()
    },
    /**
    * ------------------------------------------------------------------
    * 获取检查单模板
    * ------------------------------------------------------------------
    */
    /**
     * @description: 获取检查单模板，先判断当前用户是不是已经出院的，如果是已经出院的，则用当前患者的模板
     * @param {*}
     * @return {*}
     */
    async getTemplate () {
      // if (!this.formInfo) {
      //   return
      // }
      try {
        let res = await ApiInspectionValue.get({
          patientId: this.patient.patientId
        })
        res.data = res.data ? res.data : {}
        let patientInspectTemplate = res.data.inspectionTemplate
        let inspectValue = res.data.inspectionValue
        this.templateValueId = res.data.templateValueId
        if (inspectValue) {
          this.isEdit = true
        } else {
          this.isEdit = false
          inspectValue = {}
        }
        if (!patientInspectTemplate || this.patient.patientType != EPatientType.out) {
          // let res2 = await ApiInspectionTemp.get(this.formInfo.formId)
          let res2 = await ApiInspectionTemp.get({
            formId: this.formInfo.formId
          })
          if (!res2.data || !res2.data.inspectionTemplate) {
            this.$message.error('请先配置检查单模板')
            return
          }
          let inspectTemplate = res2.data.inspectionTemplate
          this.inspectTemplate = inspectTemplate
        } else {
          this.inspectTemplate = patientInspectTemplate
        }
        if (!this.inspectTemplate) {
          this.$message.error('没有匹配到检查单模板')
          return
        }

        /* 获取出用户的值 */
        let list = this.inspectTemplate.list
        list.map(item => {
          if (inspectValue[item.id]) {
            this.$set(this.inspectValue, item.id, inspectValue[item.id])
            // this.inspectValue[item.id] = inspectValue[item.id]
          } else {
            this.$set(this.inspectValue, item.id, JSON.parse(JSON.stringify(this.inspectValueItem)))
            // this.inspectValue[item.id] = JSON.parse(JSON.stringify(this.inspectValueItem))
          }
        })
        this.oldInspectValue = JSON.parse(JSON.stringify(this.inspectValue))
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * @description: 获取当前表单
     * @param {*}
     * @return {*}
     */
    async getFormInfo () {
      try {
        let res = await ApiAutoForm.getFormDictByType({ formType: EFormType.inspectNotice })
        if (!res.data) {
          return this.$message.error('请先配置检查单')
        }
        this.formInfo = res.data
        this.printSet = this.formatPrintSet(this.formInfo.printSet ? this.formInfo.printSet : 1)// 默认纵向打印
      } catch (error) {
      }
    },
    // 格式化打印方式
    formatPrintSet (_printSet) {
      let a = ''
      switch (_printSet) {
        case 1:
          a = 'portrait'
          break
        case 2:
          a = 'landscape'
          break
        default:
          a = 'portrait'
          break
      }
      return a
    },
    /**
    * ------------------------------------------------------------------
    * 保存取消操作
    * ------------------------------------------------------------------
    */
    cancel () {
      this.inspectValue = JSON.parse(JSON.stringify(this.oldInspectValue))
    },
    async confirm () {
      // 首先再获取一遍value，判断患者端是否已经操作，如果已经操作，则提示重新刷新
      let res
      try {
        res = await ApiInspectionValue.get({ patientId: this.patient.patientId })
      } catch (error) {
      }
      if (!res.data) {
        res.data = {}
      }
      let inspectValue = res.data.inspectValue || {}
      let isUpdate = false
      Object.keys(this.inspectValue).map(key => {
        if (!inspectValue[key]) {
          return
        }
        if (this.inspectValue[key].isConfirm != inspectValue[key].isConfirm) {
          isUpdate = true
        }
      })
      if (isUpdate) {
        this.$confirm('患者端已进行签名操作，请刷新页面', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning'
        }).then(async () => {
          this.getTemplate()
        })
        return
      }
      try {
        if (!this.isEdit) {
          // 添加
          ApiInspectionValue.add({
            inspectionTemplate: this.inspectTemplate,
            inspectionValue: this.inspectValue,
            patientId: this.patient.patientId
          })
        } else {
          ApiInspectionValue.update({
            templateValueId: this.templateValueId,
            inspectionTemplate: this.inspectTemplate,
            inspectionValue: this.inspectValue,
            patientId: this.patient.patientId
          })
        }
        this.$message.success('操作成功')
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    /**
    * ------------------------------------------------------------------
    * 打印操作
    * ------------------------------------------------------------------
    */
    printDo () {
      this.$refs.print.print()
    }

  },
  components: {
    PatientList,
    layout,
    formHeader,
    listLayout,
    print
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/nrms/css/self_common";
.main-list {
  overflow: auto;
}
/deep/ .el-checkbox {
  width: 100%;
}
/deep/ .el-checkbox .el-checkbox__label {
  white-space: normal;
  vertical-align: middle;
}
.describe {
  min-height: 100px;
  border-bottom: 1px solid #EBEEF5;
  box-sizing: border-box;
  padding: 20px;
  cursor: pointer;
}
.footer {
  padding: 8px 0 7px;
  box-shadow: 0px 0px 6px 1px rgba(114, 114, 114, 0.3);
}
/deep/ .el-footer {
  padding: 0;
}
</style>
