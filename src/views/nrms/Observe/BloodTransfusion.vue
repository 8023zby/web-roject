<template>
  <div class="container">
    <div class="left">
      <layout-list>
        <div slot="right_btn" class="tool-bar" v-if="!isPreview">
          <el-button type="success" size="small" @click="printPreview" class="print-btn">打印</el-button>
          <el-button size="small" v-if="!btn_disable" class="form_show_btn" style="margin-left: 0;min-width: 0" @click="formShowHide">
            <i :class="form_show_hide ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
          </el-button>
        </div>
        <div slot="main" class="main-list">
          <!-- <formHeader :autoHead="autoHead"></formHeader> -->
          <formHeader :autoHead="autoHead"></formHeader>
          <div class="header-checkbox">
            <label for="">
              <span class="label">ABO血型:</span>
              <el-checkbox-group v-model="assValue.ABOxuexing" disabled>
                <el-checkbox label="1611220411000_62574-0">A</el-checkbox>
                <el-checkbox label="1611220411000_62574-1">B</el-checkbox>
                <el-checkbox label="1611220411000_62574-3">AB</el-checkbox>
                <el-checkbox label="1611220411000_62574-2">O</el-checkbox>
              </el-checkbox-group>
            </label>
            <label for="">
              <span class="label" style="width: 80px">RH:</span>
              <el-checkbox-group v-model="assValue.RHxuexing" disabled>
                <el-checkbox label="1611220411000_54980-0">+</el-checkbox>
                <el-checkbox label="1611220411000_54980-1">-</el-checkbox>
              </el-checkbox-group>
            </label>
            <label for="">
              <span class="label" style="width: 80px">输血史:</span>
              <el-checkbox-group v-model="assValue.shuxueshi" disabled>
                <el-checkbox label="1611220411000_657-1">有</el-checkbox>
                <el-checkbox label="1611220411000_657-0">无</el-checkbox>
              </el-checkbox-group>
            </label>
          </div>
          <div class="header-checkbox">
            <label for="">
              <span class="label">输血不良反应史:</span>
              <el-checkbox-group v-model="assValue.fanyingshi" disabled>
                <el-checkbox label="1611220411000_34672-1" style="margin-right: 10px">有</el-checkbox>
                <span style="margin-right: 10px">(</span>
                <el-checkbox label="1611220411000_69952-0">发热反应</el-checkbox>
                <el-checkbox label="1611220411000_69952-1">过敏反应</el-checkbox>
                <el-checkbox label="1611220411000_69952-2">溶血反应</el-checkbox>
                <el-checkbox label="1611220411000_69952-3" style="margin-right: 10px">其他反应</el-checkbox>
                <span>)</span>
                <el-checkbox label="1611220411000_34672-0" style="margin-left: 10px">无</el-checkbox>
              </el-checkbox-group>
            </label>
          </div>
          <div class="table-list">
              <blood-transfusion-table :list="list" @edit="edit" @del="delRecord"></blood-transfusion-table>
          </div>
          <!-- 打印 -->
          <div style="height: 0;overflow: hidden">
            <print ref="print" :patientId="patient.patientId" :autoHead="autoHead" :assValue="assValue"></print>
          </div>
        </div>
        <div slot="footer" class="page-bar" v-if="!isPreview">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="searchParams.page"
            :page-size="searchParams.size"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </layout-list>
      <div class="table" style="height: 100%" v-if="!isPreview"></div>
    </div>
    <template>
      <div v-if="!isPreview"  class="right" :style="{width: form_show_hide ? '437px' : 0}" id="add_form" style="padding-left: 0px;overflow: auto;">
        <auto-form ref="formCommon" v-if="update" :data="data" :valueData="valueData"></auto-form>
        <div class="save-btn">
          <el-button type="primary" @click="save" :disabled="patientType != 0 && patient.outHospitalFlag != 1">保存</el-button>
          <el-button @click="reset">取消</el-button>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { ApiAssManage } from '../../../api/nrms/index'
const moment = require('moment')

export default {
  mixins: [AutoForm],
  data () {
    return {
      data: [],
      valueData: [],
      assTemp: {},
      form_show_hide: true,
      searchParams: {
        page: 1,
        size: 6,
        assClass: '7',
        patientId: '',
        sort: {
          date: 1
        }
      },
      list: [],
      total: 0,
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      update: true,
      assValue: {
        ABOxuexing: [],
        RHxuexing: [],
        shuxueshi: [],
        fanyingshi: [],
        buliangfanying2: []
      },
      assValueData: {

      },
      allList: [],
      assTempDate: '',
      resetValueData: []
    }
  },
  props: ['patient', 'patientType', 'printSet', 'formStyle', 'formName', 'formCode', 'isPreview'],
  components: {
    AutoForm: () => import('../../../components/nrms/autoForm/autoForm'),
    LayoutList: () => import('../../../components/nrms/layout/list.vue'),
    formHeader: () => import('../../../components/nrms/autoForm/header'),
    BloodTransfusionTable: () => import('./BloodTransfusionTable.vue'),
    Print: () => import('./BloodTransfusionPrint.vue')
  },
  computed: {
    btn_disable: function () {
      // 出院&&非出院召回 || 转科
      if ((this.patientType === 2 && this.patient.outHospitalFlag !== 1) || this.patientType === 1) {
        return true
      }
      return false
    }
  },
  watch: {
    patient: {
      handler (newValue, oldValue) {
        this.autoHead.tplData = newValue
        this.reset()
      }
    },
    valueData: {
      handler (newValue, oldValue) {
        let newDate = ''
        if (newValue) {
          newValue.map(item => {
            if (item.his_id == 'date') {
              newDate = item.value
            }
          })
        }
        if (newDate != this.assTempDate) {
          this.assTempDate = newDate
          let data = this.allList.filter(item => item.date == this.assTempDate)
          if (data[0]) {
            this.assRecordId = data[0].ass_record_id
            this.valueData = JSON.parse(data[0].module_value)
            this.update = false
            this.$nextTick(() => {
              this.update = true
            })
            this.valueData.map(item => {
              Object.keys(this.assValueData.assValue).map(v => {
                if (v == item.his_id) {
                  item.value = this.assValueData.assValue[v]
                }
              })
            })
          } else {
            this.resetTemp(newDate || moment().format('YYYY-MM-DD'))
          }
        }
      },
      deep: true
    }
  },
  async created () {
    this.autoHead.tplHtml = this.formStyle
    this.autoHead.formName = this.formName
    this.searchParams.condition = [{
      key: 'formCode',
      value: this.formCode
    }]
    if (this.printSet === 1) {
      this.printColumnNum = this.columnPrint
    } else {
      this.printColumnNum = this.rowPrint
    }
    if (this.patient && this.patient.id) {
      this.autoHead.tplData = this.patient
      await this.reset()
    }
  },
  methods: {
    async getTemp () {
      try {
        let res = await ApiAssManage.assMangerList({
          assClass: '7'
        })

        res.data.map((item) => {
          if (item.moduleId === '10023') {
            this.data = JSON.parse(JSON.stringify(item.moduleJson))
            this.assTemp = item
          }
        })
        console.log(this.data)
        this.valueData = []
        this.resetValueData = []
        this.operatorFormData()
        this.resetValueData = JSON.parse(JSON.stringify(this.valueData))
        this.valueData.map(item => {
          if (item.key == '1611220411000_75740') {
            item.value = moment().format('YYYY-MM-DD')
          }
        })
        this.update = false
        this.$nextTick(() => {
          this.update = true
        })
      } catch (error) {}
    },
    resetTemp (date) {
      this.assRecordId = ''
      this.valueData = JSON.parse(JSON.stringify(this.resetValueData))
      this.valueData.map(item => {
        if (item.key == '1611220411000_75740') {
          item.value = date
        }
      })
      if (!this.assValueData || !this.assValueData.assValue) {
        this.update = false
        this.$nextTick(() => {
          this.update = true
        })
        return
      }
      this.valueData.map(item => {
        Object.keys(this.assValueData.assValue).map(v => {
          if (v == item.his_id) {
            item.value = this.assValueData.assValue[v]
          }
        })
      })
      this.update = false
      this.$nextTick(() => {
        this.update = true
      })
    },
    /**
     * @description: 获取全部数据
     * @param {*}
     * @return {*}
     */
    async getAllData () {
      let searchParams = {
        ...this.searchParams
      }
      delete searchParams.page
      delete searchParams.size
      try {
        let res = await ApiAssManage.getList(searchParams)
        this.allList = res.data
        this.assTempDate = moment().format('YYYY-MM-DD')
        let data = this.allList.filter(item => item.date == this.assTempDate)
        if (data[0]) {
          this.assRecordId = data[0].ass_record_id
          this.valueData = JSON.parse(data[0].module_value)
          this.valueData.map(item => {
            Object.keys(this.assValueData.assValue).map(v => {
              if (v == item.his_id) {
                item.value = this.assValueData.assValue[v]
              }
            })
          })
          this.update = false
          this.$nextTick(() => {
            this.update = true
          })
        } else {
          this.resetTemp(this.assTempDate)
        }
      } catch (error) {
      }
    },
    formShowHide () {
      this.form_show_hide = !this.form_show_hide
    },
    async getList () {
      try {
        this.searchParams.patientId = this.patient.patientId
        let res = await ApiAssManage.getList(this.searchParams)
        this.total = res.data.total
        this.list = res.data.list
      } catch (error) {
      }
    },
    async reset () {
      await Promise.all([await this.getList(), await this.getTemp()])
      await this.getPatientRecord()
      await this.getAllData()
    },
    edit (row) {
      this.assRecordId = row.ass_record_id
      this.valueData = JSON.parse(row.module_value)
      this.update = false
      this.$nextTick(() => {
        this.update = true
      })
    },
    delRecord (row) {
      this.$confirm('是否确认删除？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(async () => {
        try {
          let res = await ApiAssManage.delete(row.ass_record_id)
          this.$message.success('删除成功！')
          if (this.total % 6 == 1 && this.searchParams.page > 1) {
            this.searchParams.page--
          }
          await this.reset()
        } catch (error) {
          this.$message.error(error.message)
        }
      })
    },
    /**
     * @description: 获取当前病人的血型都信息
     * @param {*}
     * @return {*}
     */
    async getPatientRecord () {
      Object.keys(this.assValue).map(item => {
        this.assValue[item] = []
      })
      try {
        let res = await ApiAssManage.getPatientRecord({ assId: this.assTemp.assId, patientId: this.patient.patientId })
        this.assValueData = res.data
        if (!this.assValueData || !this.assValueData.assValue) {
          return
        }
        this.assValue.ABOxuexing = [this.assValueData.assValue.ABOxuexing]
        this.assValue.RHxuexing = [this.assValueData.assValue.RHxuexing]
        this.assValue.shuxueshi = [this.assValueData.assValue.shuxueshi]
        this.assValue.fanyingshi.push(this.assValueData.assValue.fanyingshi)
        this.assValue.fanyingshi.push(this.assValueData.assValue.buliangfanying2)
        this.valueData.map(item => {
          Object.keys(this.assValueData.assValue).map(v => {
            if (v == item.his_id) {
              item.value = this.assValueData.assValue[v]
            }
          })
        })
        this.update = false
        this.$nextTick(() => {
          this.update = true
        })
      } catch (error) {
      }
    },
    // 处理size变化
    handleSizeChange (val) {
      this.searchParams.size = val
      this.getList()
    },
    // 分页当前页码变化
    handleCurrentChange (val) {
      this.searchParams.page = val
      this.getList()
    },
    cancel () {
      this.reset()
    },
    /**
     * @description: 打印
     * @param {*}
     * @return {*}
     */
    printPreview () {
      this.$refs.print.print()
    },
    async save () {
      let isSave = false
      this.valueData.map(item => {
        if (item.his_id != 'date' && item.value) {
          isSave = true
        }
      })
      if (!isSave) {
        this.$message.error('未填写内容')
        return
      }
      let params = {
        assId: this.assTemp.assId, // 评估单ID
        moduleId: this.assTemp.moduleId, // 模板ID
        moduleValue: this.valueData, // 评估值
        haveRecordRate: 0, // 是否多次记录
        patientId: this.patient.patientId // 患者ID
      }
      let columnValue = []
      let assValue = {
        ABOxuexing: '',
        RHxuexing: '',
        shuxueshi: '',
        fanyingshi: '',
        buliangfanying2: ''
      }
      let keys1 = ['date', 'time1', 'maibo1', 'huxi1', 'qitatujing', 'hongxibao', 'xuexiaoban', 'xuejiang', 'qitazhonglei', 'zhixingzhe', 'heduizhe', 'time2', 'maibo2', 'huxi2', 'time3', 'maibo3', 'huxi3', 'shuxueshijian1', 'shuxueshijian2']
      let keys2 = ['tiwen1', 'tiwen2', 'tiwen3', 'gangzhen', 'zhiliuzhen', 'daoguan']
      let keys3 = ['ABOxuexing', 'RHxuexing', 'shuxueshi', 'fanyingshi', 'buliangfanying2']
      let keys4 = ['shuzhangya1', 'shuzhangya2', 'shuzhangya3', 'shousuoya1', 'shousuoya2', 'shousuoya3']
      let xueyaObj = {
        shuzhangya1: '',
        shousuoya1: '',
        shuzhangya2: '',
        shousuoya2: '',
        shuzhangya3: '',
        shousuoya3: ''
      }
      this.valueData.map(item => {
        if (keys1.indexOf(item.his_id) >= 0) {
          columnValue.push({
            key: item.his_id,
            value: item.value
          })
        }
        if (keys2.indexOf(item.his_id) >= 0) {
          let hasOption = false
          this.operatorFormData(v => {
            if (v.key == item.key) {
              let value = ''
              v.options.map(optionItem => {
                if (optionItem.id == v.value) {
                  hasOption = true
                  value = optionItem.label
                  columnValue.push({
                    key: item.his_id,
                    value: value
                  })
                }
              })
            }
          })
          if (!hasOption) {
            columnValue.push({
              key: item.his_id,
              value: item.value
            })
          }
        }
        if (keys3.indexOf(item.his_id) >= 0) {
          assValue[item.his_id] = item.value
        }
        if (keys4.indexOf(item.his_id) >= 0) {
          xueyaObj[item.his_id] = item.value
        }
        if (item.his_id == 'buliangfanying') {
          if (item.value == '1611220411000_11847-1') {
            this.valueData.map(v => {
              if (v.his_id == 'fashengshijian') {
                columnValue.push({
                  key: 'fashengshijian',
                  value: v.value
                })
              }
              if (v.his_id == 'buliangfanyingleixing') {
                switch (v.value) {
                  case '1611220411000_36255-0':
                    columnValue.push({
                      key: 'guominfanying',
                      value: 'true'
                    })
                    break
                  case '1611220411000_36255-1':
                    columnValue.push({
                      key: 'farefanying',
                      value: 'true'
                    })
                    break
                  case '1611220411000_36255-2':
                    columnValue.push({
                      key: 'rongxuefanying',
                      value: 'true'
                    })
                    break
                  case '1611220411000_36255-3':
                    this.valueData.map(a => {
                      if (a.his_id == 'qitafanying') {
                        columnValue.push({
                          key: 'qitafanying',
                          value: a.value
                        })
                      }
                    })
                    break
                  default:
                    break
                }
              }
            })
          } else if (item.value == '1611220411000_11847-0') {
            columnValue.push({
              key: 'wu',
              value: 'true'
            })
          }
        }
      })
      if (xueyaObj.shousuoya1 || xueyaObj.shuzhangya1) {
        columnValue.push({
          key: 'xueya1',
          value: `${xueyaObj.shousuoya1}/${xueyaObj.shuzhangya1}`
        })
      }
      if (xueyaObj.shousuoya2 || xueyaObj.shuzhangya2) {
        columnValue.push({
          key: 'xueya2',
          value: `${xueyaObj.shousuoya2}/${xueyaObj.shuzhangya2}`
        })
      }
      if (xueyaObj.shousuoya3 || xueyaObj.shuzhangya3) {
        columnValue.push({
          key: 'xueya3',
          value: `${xueyaObj.shousuoya3}/${xueyaObj.shuzhangya3}`
        })
      }
      if (assValue.fanyingshi == '1611220411000_34672-0') {
        assValue.buliangfanying2 = ''
      }
      let empInfo = JSON.parse(localStorage.getItem('empInfo'))
      columnValue.push({
        key: 'signature',
        value: empInfo.empName
      })
      columnValue.push({
        key: 'formCode',
        value: this.formCode
      })
      params.columnValue = columnValue
      try {
        await ApiAssManage.addPatientRecord({
          patientId: this.patient.patientId,
          assId: this.assTemp.assId,
          assenssmentPatientId: this.assValueData ? this.assValueData.assenssmentPatientId : '',
          assValue
        })
        if (this.assRecordId) {
          params.assRecordId = this.assRecordId
          await ApiAssManage.edit(params)
          this.$message.success('编辑成功')
        } else {
          await ApiAssManage.add(params)
          this.$message.success('添加成功')
        }
        await this.reset()
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/nrms/css/self_common.scss";
.print-btn {
  width: 80px;
  height: 28px;
}
.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .left {
    width: 0;
    flex: 1;
    /deep/ .main-list {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      height: 100%;

      .table-list {
        flex: 1;
        height: 0;
        overflow: hidden;
        td {
          position: relative !important;
        }
      }
    }
  }
  .right {
    width: 437px;
    box-sizing: border-box;
    position: relative;
    transition: width 0.25s;
    border-left: 1px solid #e6e6e6;
  }
  .form_show_btn {
    position: absolute;
    top: 80px;
    right: 0;
    padding: 7px 3px !important;
    background-color: #fff;
    z-index: 9;
    color: #1E87F0;
    border: 1px solid;
    border-color: #1E87F0;
    border-radius: 0 !important;
    border-right: none;
    display: inline-block !important;
  }
}
.header-checkbox {
  display: flex;
  padding-left: 30px;
  margin-bottom: 12px;
  label {
    white-space: nowrap;
  }
  .label {
    width: 120px;
    text-align: right;
    display: inline-block;
    margin-right: 12px;
  }
  /deep/ .el-checkbox-group {
    display: inline-block;
  }
  /deep/ .el-checkbox {
    margin-right: 24px;
  }
  /deep/.el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #FFF;
    border-color: #DCDFE6;
  }
  /deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #1e87f0;
    border-color: #1e87f0;
  }
  /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #333;
  }
  /deep/ .is-checked .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #1E87F0;
  }
  /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }
}
.save-btn {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
  position: sticky;
  bottom: 0;
}
</style>
