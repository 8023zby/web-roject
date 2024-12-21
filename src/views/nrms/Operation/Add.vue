<template>
  <div class="operation-add">
    <div class="typt-tit-cls" v-if="!isPreview">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{operationTmp.assName}}</div>
    </div>
    <div class="operation-add-content">
      <div class="print" v-if="!isPreview">
        <el-button class="print-btn" type="success" size="small" @click="clickPrint">打印</el-button>
      </div>
      <div style="width: 1050px;margin: 0 auto" id="printHtml">
        <!-- 表头 -->
        <formHeader :autoHead="autoHead"></formHeader>
        <div class="spacer" style="height: 20px"></div>
        <!-- 自动表单 -->
        <auto-form v-if="update" :data="data" :valueData="valueData" :isEdit="row"></auto-form>
      </div>
    </div>

    <div class="typt-add-footer" v-if="!isPreview">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { ApiAssManage } from '../../../api/nrms/index'
export default {
  props: ['modifyData', 'params', 'isPreview', 'previewItem'],
  mixins: [AutoForm],
  components: {
    formHeader: () => import('../../../components/nrms/autoForm/header'),
    AutoForm: () => import('../../../components/nrms/autoForm/autoForm')
  },
  data () {
    return {
      data: {}, // 表单模板
      valueData: [],
      patient: {}, // 患者
      operatorType: '', // 手术评估模板类型
      operationTmp: {}, // 手术评估模板
      row: null, // 编辑
      update: false,
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      }
    }
  },
  created () {
    if (this.isPreview) this.params.operation = this.previewItem
    const { operation, patient, row } = this.params
    this.patient = patient
    this.operationTmp = operation
    this.autoHead.tplHtml = this.operationTmp.assStyle
    this.autoHead.formName = this.operationTmp.assName
    if (this.patient && this.patient.id) {
      this.autoHead.tplData = this.patient
    }
    if (!this.isPreview) {
      localStorage.setItem('formPatientId', this.patient.patientId)
      localStorage.setItem('formSaveDataFlag', true)
    }

    this.getFormTmp()
    this.row = row
    // 如果不是编辑就递归拿去数据
    if (row && row.moduleValue && row.moduleValue.length) {
      this.valueData = row.moduleValue
    } else {
      this.operatorFormData()
    }
    if (this.isPreview) {
      this.update = true
      this.assessDiabled()
      return false
    }
    this.showName()
    this.diagnose()
  },
  mounted () { },
  methods: {
    // 返显诊断
    diagnose () {
      if (this.row) {
        return
      }
      switch (this.operationTmp.moduleId) {
        case '10011':
          this.valueData.map(item => {
            if (item.key == '1599800846000_81805' && !item.value) {
              item.value = this.patient.diagnose
            }
          })
          break
        case '10013':
          this.valueData.map(item => {
            if (item.key == '1600073159000_85425' && !item.value) {
              item.value = this.patient.diagnose
            }
          })
          break
        default:

          break
      }
    },
    // 返显手术名称
    async showName () {
      if (this.row) {
        this.update = true
        return
      }
      switch (this.operationTmp.moduleId) {
        case '10011':
          await Promise.all(this.valueData.map(async item => {
            if (item.key == '1599800884000_80243' && !item.value) {
              await this.getLastName(item)
            }
          }))
          break
        case '10012':
          await Promise.all(this.valueData.map(async item => {
            if (item.key == '1600047090000_85508' && !item.value) {
              await this.getLastName(item)
            }
          }))
          break
        case '10013':
          await Promise.all(this.valueData.map(async item => {
            if (item.key == '1600073159000_59449' && !item.value) {
              await this.getLastName(item)
            }
          }))
          break
        case '10019':
          await Promise.all(this.valueData.map(async item => {
            if (item.key == '1600073159000_59449' && !item.value) {
              await this.getLastName(item)
            }
          }))
          break
        case '10020':
          await Promise.all(this.valueData.map(async item => {
            if (item.key == '1600073159000_59449' && !item.value) {
              await this.getLastName(item)
            }
          }))
          break
        default:

          break
      }
      this.update = true
    },
    async getLastName (newItem) {
      try {
        let res = await ApiAssManage.list({
          patientId: this.patient.patientId,
          assClass: '1'
        })
        if (!res.data || !res.data.length) {
          return
        }
        let last = res.data[res.data.length - 1]
        let valueData = JSON.parse(JSON.stringify(last.moduleValue))
        switch (last.moduleId) {
          case '10011':
            valueData.map(item => {
              if (item.key == '1599800884000_80243') {
                newItem.value = item.value
              }
            })
            break
          case '10012':
            valueData.map(item => {
              if (item.key == '1600047090000_85508') {
                newItem.value = item.value
              }
            })
            break
          case '10013':
            valueData.map(item => {
              if (item.key == '1600073159000_59449') {
                newItem.value = item.value
              }
            })
            break
          case '10019':
            valueData.map(item => {
              if (item.key == '1600073159000_59449') {
                newItem.value = item.value
              }
            })
            break
          case '10020':
            valueData.map(item => {
              if (item.key == '1600073159000_59449') {
                newItem.value = item.value
              }
            })
            break
          default:
            break
        }
      } catch (error) {
      }
    },
    // 获取模板
    getFormTmp () {
      this.data = JSON.parse(JSON.stringify(this.operationTmp.moduleJson))
    },
    // 取消
    cancel () {
      this.$emit('option-changed', 'list', this.patient)
    },
    // 保存
    async save () {
      let params = {
        assId: this.operationTmp.assId, // 评估单ID
        moduleId: this.operationTmp.moduleId, // 模板ID
        moduleValue: this.valueData, // 评估值
        haveRecordRate: 0, // 是否多次记录
        assTimes: 1, // 评估次数
        patientId: this.patient.patientId, // 患者ID
        columnValue: []
      }
      if (this.row) {
        params.assRecordId = this.row.assRecordId
        delete params.haveRecordRate
      }
      try {
        if (this.row) {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.operation-add {
  height: 100%;
  .operation-add-content {
    width: 100%;
    height: calc(100% - 75px - 48px);
    overflow: auto;
    .print {
      display: flex;
      justify-content: flex-end;
      padding-right: 20px;
      padding-top: 13px;
      .print-btn {
        min-width: 78px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2px !important;
        font-size: 14px !important;
        padding: 6px 12px !important;
        border: none;
      }
    }
  }
  .typt-add-footer {
    padding: 8px 0 7px;
    box-shadow: 0px 0px 6px 1px rgba(114, 114, 114, 0.3);
  }
}
</style>
