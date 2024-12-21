<template>
  <div v-loading="saveloading" class="operation-add">
    <div class="typt-tit-cls" v-if="!isPreview">
      <div class="typt-tit-logo" />
      <div class="typt-tit-content">{{ titMsg }}{{ recordObj.recordType }}</div>
    </div>
    <!-- <el-button type="primary" @click="clickPrint">打印</el-button> -->
    <div class="operation-add-content">
      <!-- <div class="print">
        <el-button
          class="print-btn"
          type="success"
          size="small"
          @click="clickPrintFn"
          >打印</el-button
        >
      </div> -->
      <div v-if="!isPreview"
        style="display: flex; justify-content: flex-end;height: 54px;align-items: center;padding-right: 20px"
      >
        <div class="btn-group">
          <el-button
            class="btn"
            type="primary"
            size="small"
            :disabled="!pagination.prev"
            @click="getList(pagination.prev)"
          >上一页</el-button>
          <el-button
            class="btn"
            type="primary"
            size="small"
            :disabled="!pagination.next"
            @click="getList(pagination.next)"
          >下一页</el-button>
        </div>
      </div>
			<div v-loading="tableLoading"  style="width:100%;height:100%;" :class="{'formTable':hiddenFooter}">
				<div style="width: 1050px; margin: 0 auto" id="printHtml" ref="autoFormDom" :class="{'visibility' : tableLoading}">
					<!-- 表头 -->
					<formHeader :autoHead="autoHead"></formHeader>
					<!-- 自动表单 -->
					<auto-form
						v-if="update"
						class="zhongxin-style"
						:class="{isOneLine: isOneLine}"
						:data="data"
						:valueData="valueData"
						:isEdit="row"
						:assId="temp.assId"
						:firstLineAssTime="firstLineAssTime"
            :patient="patient"
						@colValueChange="colValueChange"
						@tableLoadingFun="tableLoadingFun"
					></auto-form>
				</div>
			</div>
    </div>

    <div class="typt-add-footer" v-if="!hiddenFooter && !isPreview">
      <el-button @click="reloadUrl">取消</el-button>
      <el-button type="primary" :disabled="patient.patientType == EPatientType.out && patient.outHospitalFlag != EOutHospitalFlag.return" @click="saveData">保存</el-button>
    </div>
  </div>
</template>

<script>
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { ApiAssManage, ApiNurseUploadLogo } from '../../../api/nrms'
import { zhongxinGSCData } from '../FormManageData/zhongxin_GSC_data'
import { getColumnData } from './valueDataMap'
import { EOutHospitalFlag, EPatientType } from '../../../assets/nrms/enum/patient'
const moment = require('moment')

export default {
  name: 'PartrolRecord',
  props: ['modifyData', 'params', 'hiddenFooter', 'isPreview', 'previewItem'],
  components: {
    formHeader: () => import('../../../components/nrms/autoForm/header'),
    AutoForm: () => import('../../../components/nrms/autoForm/autoForm')
  },
  mixins: [AutoForm],
  data () {
    return {
      saveloading: false,
      titMsg: '添加',
      patient: {},
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
      pagination: {
        prev: '',
        next: ''
      },
      assenssmentRecordsId: [],
      temperatureList: [],
      isOneLine: false,
      firstLineAssTime: 0, // 判断第一列的assTimes是几
      EPatientType: EPatientType,
      EOutHospitalFlag: EOutHospitalFlag,
      tableLoading: true,
      saveList: []
    }
  },
  async created () {
    if (this.isPreview) this.params.temp = this.previewItem
    // this.params.temp = this.previewItem
    this.recordObj = { ...this.modifyData }
    this.temp = { ...this.params.temp }
    this.tempId = this.temp.moduleId
    this.assId = this.temp.assId
    this.patient = { ...this.params.patient }
    if (this.isPreview) localStorage.setItem('formPatientId', this.patient.patientId)
    if (this.params.row) this.row = { ...this.params.row }

    this.autoHead.moduleId = this.temp.moduleId
    this.autoHead.tplHtml = this.temp.assStyle
    this.autoHead.formName = this.temp.assName
    this.autoHead.tplId = this.temp.assCode
    if (this.patient && this.patient.patientId) {
      this.autoHead.tplData = this.patient
    }

    await this.initData()
    if (this.isPreview) return false
    this.setColor()
  },
  methods: {
    async initData () {
      // this.data = JSON.parse(JSON.stringify(zhongxinGSCData))
      this.data = JSON.parse(JSON.stringify(this.temp.moduleJson))
      // this.temp.moduleJson
      // this.getElementsKey()
      // console.log(JSON.stringify(this.data))
      // if (!this.row) {
      //   // 添加
      //   this.getColumnsTableValueData()
      // } else {
      //   // 编辑
      //   await this.getList()
      // }
      await this.getList()
    },
    /**
     * @description: 获取列表
     * @param {*}
     * @return {*}
     */
    async getList (pagination) {
      this.tableLoading = true
      this.assenssmentRecordsId = []
      this.getColumnsTableValueData()
      if (this.isPreview) this.assessDiabled()
      try {
        const res = await ApiAssManage.getQueryLoop({
          assId: this.temp.assId,
          patientId: this.patient.patientId,
          assTimes: this.row && this.row.ass_times ? this.row.ass_times : -1,
          pagination: pagination || this.pagination
        })

        // 计算第一列的assTime是几
        const prev = res.data.pageUp
        if (!prev) {
          this.firstLineAssTime = 0
        } else {
          this.firstLineAssTime = prev.split(',')[1] - 0 + 1
        }

        // 计算结束

        this.editNumber = res.data.assenssmentRecords.length
        this.pagination = {
          prev: res.data.pageUp,
          next: res.data.pageDown
        }
        if (this.editNumber > 0 && this.editNumber <= 5) {
          this.valueData.splice(0, this.editNumber)
          const array = []
          this.assenssmentRecordsId = res.data.assenssmentRecords.map(
            (item) => {
              array.push(item.moduleValue)
              return item.assRecordId
            }
          )
          this.valueData = array.concat(this.valueData)
        }
        this.update = false
        this.$nextTick(() => {
          this.update = true
        })
      } catch (error) {
        console.log(error)
      }
    },
    setColor () {
      if (!this.row || !this.row.ass_times || this.row.ass_times < 0) {
        return
      }
      const assIndex = (this.row.ass_times - 1) % 5
      const Timer = setInterval(() => {
        const tbodyBox = this.$refs['autoFormDom'].querySelectorAll('.tbody-box')
        if (tbodyBox && tbodyBox.length) {
          clearInterval(Timer)
          for (let index = 0; index < tbodyBox.length; index++) {
            const tbodyBoxItem = tbodyBox[index]
            const tbodyList = tbodyBoxItem.querySelectorAll('.tbodyItem')
            tbodyList[assIndex].style.background = '#FFF8EE'
          }
        }
      }, 100)
    },
    colValueChange (e) {
      this.saveList.push(e)
      const tbodyBox = this.$refs['autoFormDom'].querySelectorAll('.tbody-box')
      for (let index = 0; index < tbodyBox.length; index++) {
        const tbodyBoxItem = tbodyBox[index]
        const tbodyList = tbodyBoxItem.querySelectorAll('.tbodyItem')
        for (let i = 0; i < tbodyList.length; i++) {
          const tbodyItem = tbodyList[i]
          if (tbodyItem.style.background != 'rgb(255, 248, 238)') {
            tbodyItem.style.background = ''
          }
        }
        if (!tbodyList[e].style.background) {
          tbodyList[e].style.background = '#F2FFE8'
        }
      }
    },
    reloadUrl () {
      this.$emit('option-changed', 'list', this.patient)
    },
    async clickPrintFn () {
      if (!this.modifyData.ass_record_id && this.tempId == '10015') {
      } else {
        this.clickPrint()
      }
    },
    async saveData () {
      const arr = Array.from(new Set(this.saveList))
      const assenssmentRecords = []
      const recordList = []
      if (this.valueData.every(item => JSON.stringify(this.initValueData) == JSON.stringify(item))) {
        this.$message.warning('请填写患者风险评估单信息！')
        return
      }
      this.saveloading = true
      await Promise.all(
        this.valueData.map(async (item, index) => {
          // 如果没有修改就跳过
          if (JSON.stringify(this.initValueData) == JSON.stringify(item)) {
            return
          }
          const params = {
            assId: this.temp.assId, // 评估单ID
            moduleId: this.temp.moduleId, // 模板ID
            moduleValue: item, // 评估值
            haveRecordRate: 1, // 是否多次记录
            patientId: this.patient.patientId, // 患者ID
            assRecordId: this.assenssmentRecordsId[index]
          }
          params.columnValue = getColumnData(item, index, arr).columnValue
          params.assDate = getColumnData(item, index, arr).assDate
          assenssmentRecords.push(params)
        })
      )
      try {
        const res = await ApiAssManage.addLoop(assenssmentRecords)
        this.saveloading = false
        this.$message.success('添加成功')
        this.$emit('option-changed', 'list', this.patient)
        this.$emit('reloadUrl',true)
      } catch (error) {
        this.saveloading = false
        this.$message.error(error.message)
      }
    },
    tableLoadingFun () {
      this.tableLoading = false
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
.formTable{
  margin-bottom: 20px;
}
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
//.typt-add-footer {
//  height: 56px;
//  line-height: 56px;
//  box-shadow: 0px 0px 6px 1px rgba(114, 114, 114, 0.3);
//  margin-bottom: 13px;
//}
.hidden {
  display: none;
}
.zhongxin-style {
  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #333;
  }
  /deep/input.el-input__inner {
    padding: 0 1px;
  }
  /deep/.el-date-editor .el-input__inner {
    padding: 0 0 0 30px;
  }
  /deep/.el-checkbox {
    width: 100%;
    margin-right: 0;
    align-items: flex-start;
    padding: 5px 0;
  }
  /deep/.el-checkbox__label {
    display: block;
    padding: 0 5px;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    .checkLabel {
      // white-space: nowrap;
    }
  }
  /deep/ .el-checkbox__inner {
    border-color: #555;
    top: 2.5px;
  }
  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
    border-color: #1e87f0;
  }
  /deep/ .checkLabel {
    white-space: pre-wrap;
  }
  &.isOneLine {
    /deep/ .form-common {
      width: 100%;
    }
    /deep/ .el-checkbox-group {
      width: 100%;
    }
    /deep/.el-checkbox__label {
      .checkLabel {
        white-space: nowrap;
      }
    }
  }
}
.btn-group {
  display: flex;
  .btn {
    width: 80px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    font-size: 14px;
  }
}
.visibility {
  height: 0!important;
  overflow: hidden!important;
}
/deep/.el-loading-mask {
    background-color: rgba(255,255,255,1)
}
</style>
