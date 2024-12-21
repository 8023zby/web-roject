<template>
  <div class="container">
    <div class="left">
      <layout-list>
        <div slot="left_btn" class="tool-bar">
          <!-- <el-button
            type="warning"
            icon="el-icon-plus"
            @click="addNote"
            size="small"
            :disabled="patientType != 0 && patient.outHospitalFlag != 1"
            >添加
          </el-button> -->
        </div>
        <div slot="right_btn" class="tool-bar" v-if="!isPreview">
          <el-button type="success" @click="printPreview" size="small"
            >打印
          </el-button>
        </div>
        <div slot="main" class="main-list">
            <formHeader :autoHead="autoHead"></formHeader>
            <div style="display: flex;justify-content: center;width: 100%;overflow: auto;height:100%">
              <div class="table-list" style="height: auto;flex: none;max-width: 100%;">
                <el-table
                  :data="list"
                  :span-method="merge"
                  border
                  height="100%"
                  :show-header="false"
                >
                  <el-table-column
                    prop="name1"
                    align="center"
                    class-name="bgcolordeep"
                    width="120"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="name2"
                    align="center"
                    class-name="bgcolordeep"
                    width="120"
                  >
                  </el-table-column>
                  <template v-for="(item, index) in tableList">
                    <el-table-column :key="index" width="70" align="center">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.list[index]"></span>
                        <span v-else-if="scope.row.list[index].key == 'operator'">
                          <el-button
                            @click="edit(scope.row.list[index].value)"
                            type="text"
                            :disabled="patientType != 0 && patient.outHospitalFlag != 1"
                            >编辑</el-button
                          >
                          <el-button
                            type="textred"
                            @click="delRecord(scope.row.list[index].value)"
                            :disabled="patientType != 0 && patient.outHospitalFlag != 1"
                            >删除</el-button
                          >
                        </span>
                        <span
                          v-else-if="typeof scope.row.list[index].value == 'string'"
                        >
                          {{ scope.row.list[index].value }}
                        </span>
                        <span
                          v-else-if="
                            typeof scope.row.list[index].value == 'boolean'
                          "
                        >
                          <i
                            class="el-icon-check"
                            v-if="scope.row.list[index].value"
                          ></i>
                        </span>
                      </template>
                    </el-table-column>
                  </template>
                </el-table>
              </div>
            </div>
            <div style="text-align: center;padding: 20px">
              备注：发生深静脉血栓时，使用此表
            </div>
        </div>
        <div slot="footer" class="page-bar" v-if="!isPreview">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="searchParams.page"
            :page-size="searchParams.size"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </layout-list>
    </div>
    <div class="right" v-if="!isPreview">
      <div style="padding: 10px 20px">
        <span style="font-weight: bold">{{
          assRecordId ? "编辑" : "添加"
        }}</span>
      </div>
      <auto-form v-if="update" :data="data" :valueData="valueData"></auto-form>
      <div style="display: flex; justify-content: center; padding: 30px 0" v-if="!isPreview">
        <el-button type="primary" @click="save" :disabled="patientType != 0 && patient.outHospitalFlag != 1">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
    <div style="position: absolute; height: 0; overflow: hidden">
      <div style="width: 1080px" :id="'deepVeinTable' + formCode">
        <div
          v-for="(item, index) in printList"
          :key="index"
          style="page-break-after: always;padding-top: 30px"
        >
          <formHeader :autoHead="autoHead"></formHeader>
          <div style="padding-right: 15px" class="table-box">
            <table border="0" cellspacing="0" cellpadding="0" align="center" style="width: 100%">
              <tbody>
                <tr v-for="(v,i) in item" :key="i">

                  <template
                    v-if="
                      v.name1Key == 'assDate' ||
                      v.name1Key == 'assTime' ||
                      v.name1Key == 'assProject' ||
                      v.name1Key == 'position' ||
                      v.name1Key == 'pain' ||
                      v.name1Key == 'shank' ||
                      v.name1Key == 'operator' ||
                      v.name1Key == 'autograph'"
                  >
                    <td colspan = "2">
                      {{v.name1}}
                    </td>
                  </template>
                  <template v-else-if="v.name1Key == 'popliteal'">
                    <template v-if="v.name2Key == '1'">
                      <td rowspan="3">{{v.name1}}</td>
                    </template>
                    <template v-else>
                    </template>
                  </template>
                  <template v-else-if="v.name1Key == 'acrotarsium'">
                    <template v-if="v.name2Key == '1'">
                      <td rowspan="3">{{v.name1}}</td>
                    </template>
                    <template v-else>
                    </template>
                  </template>
                  <template v-else-if="v.name1Key == 'leg'">
                    <template v-if="v.name2Key == '1'">
                      <td rowspan="4">{{v.name1}}</td>
                    </template>
                    <template v-else>
                    </template>
                  </template>
                  <template v-else-if="v.name1Key == 'homan'">
                    <template v-if="v.name2Key == '1'">
                      <td rowspan="2">{{v.name1}}</td>
                    </template>
                    <template v-else>
                    </template>
                  </template>
                  <template v-else-if="v.name1Key == 'swelling'">
                    <template v-if="v.name2Key == '1'">
                      <td rowspan="4">{{v.name1}}</td>
                    </template>
                    <template v-else>
                    </template>
                  </template>
                  <template v-else-if="v.name1Key == 'skin'">
                    <template v-if="v.name2Key == '1'">
                      <td rowspan="2">{{v.name1}}</td>
                    </template>
                    <template v-else>
                    </template>
                  </template>
                  <template v-else-if="v.name1Key == 'paralysis'">
                    <template v-if="v.name2Key == '1'">
                      <td rowspan="2">{{v.name1}}</td>
                    </template>
                    <template v-else>
                    </template>
                  </template>
                  <template v-else-if="
                      v.name1Key == 'problem' ||
                      v.name1Key == 'assenssment' ||
                      v.name1Key == 'measures'
                  ">
                    <template v-if="v.name1Key == 'problem'">
                      <td rowspan="3">{{v.name1}}</td>
                    </template>
                    <template v-else>
                    </template>
                  </template>
                  <template v-else>
                    <td>{{v.name1}}</td>
                  </template>

                  <template
                    v-if="
                      v.name1Key == 'assDate' ||
                      v.name1Key == 'assTime' ||
                      v.name1Key == 'assProject' ||
                      v.name1Key == 'position' ||
                      v.name1Key == 'pain' ||
                      v.name1Key == 'shank' ||
                      v.name1Key == 'operator' ||
                      v.name1Key == 'autograph'"
                  >

                  </template>
                  <template v-else>
                    <td>{{v.name2}}</td>
                  </template>

                  <template v-for="(tableItem,tableIndex) in tableList">
                    <template v-if="
                      v.name1Key == 'assDate' ||
                      v.name1Key == 'assTime' ||
                      v.name1Key == 'autograph'
                    ">
                      <template v-if="tableIndex % 2 == 0">
                        <td :key="tableIndex" width="60" colspan="2" style="max-width: 60px;word-wrap:break-word;">
                          <span v-if="!v.list[tableIndex]"></span>
                          <span
                            v-else-if="typeof v.list[tableIndex].value == 'string'"
                          >
                            {{ v.list[tableIndex].value }}
                          </span>
                          <span
                            v-else-if="typeof v.list[tableIndex].value == 'boolean'"
                          >
                            <span
                              v-if="v.list[tableIndex].value"
                            >
                            √
                            </span>
                          </span>
                        </td>
                      </template>
                    </template>
                    <template v-else>
                      <td :key="tableIndex" width="60" style="max-width: 60px;word-wrap:break-word; ">
                        <span v-if="!v.list[tableIndex]"></span>
                        <span
                          v-else-if="typeof v.list[tableIndex].value == 'string'"
                        >
                          {{ v.list[tableIndex].value }}
                        </span>
                        <span
                          v-else-if="typeof v.list[tableIndex].value == 'boolean'"
                        >
                          <span
                            v-if="v.list[tableIndex].value"
                          >
                          √
                          </span>
                        </span>
                      </td>
                    </template>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="text-align: center;padding: 20px">
              备注：发生深静脉血栓时，使用此表
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { ApiAssManage } from '../../../api/nrms/index'
import { valueMap, tableList, valueChange, defaultValue } from './valueMap.js'
import printJS from 'print-js'
const moment = require('moment')
export default {
  mixins: [AutoForm],
  data () {
    return {
      data: [],
      valueData: [],
      row: {},
      assTemp: {},
      searchParams: {
        page: 1,
        size: 5,
        assClass: '4',
        patientId: '',
        sort: {
          assDate: 1,
          assTime: 1
        }
      },
      list: [],
      total: 0,
      assRecordId: '',
      update: true,
      tableList: new Array(10),
      dataList: [],
      printList: [],
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      tableTmp: []
    }
  },
  props: ['patient', 'patientType', 'printSet', 'formStyle', 'formName', 'formCode', 'isPreview'],
  components: {
    AutoForm: () => import('../../../components/nrms/autoForm/autoForm'),
    LayoutList: () => import('../../../components/nrms/layout/list.vue'),
    formHeader: () => import('../../../components/nrms/autoForm/header')
  },
  watch: {
    patient: {
      async handler (newValue, oldValue) {
        this.autoHead.tplData = newValue
        await this.reset()
      }
    }
  },
  async created () {
    this.autoHead.tplHtml = this.formStyle
    this.autoHead.formName = this.formName
    this.tableTmp = JSON.parse(JSON.stringify(tableList))
    this.searchParams.condition = [{
      key: 'formCode',
      value: this.formCode
    }]
    if ((this.patient && this.patient.id) || this.isPreview) {
      this.autoHead.tplData = this.patient
      await this.reset()
    }
  },
  methods: {
    async getTemp () {
      try {
        let res = await ApiAssManage.assMangerList({
          assClass: '4'
        })
        res.data.map((item) => {
          if (item.moduleId == '10017') {
            this.data = JSON.parse(JSON.stringify(item.moduleJson))
            this.assTemp = item
          }
        })
        this.valueData = []
        await this.operatorFormData()
        this.valueData.map(item => {
          if (item.key == '1603160240000_48222') {
            item.value = moment().format('YYYY-MM-DD')
          }
          if (item.key == '1603160240000_2013') {
            item.value = moment().format('HH:mm:ss')
          }
        })
        this.update = false
        this.$nextTick(() => {
          this.update = true
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getList () {
      try {
        if (!this.isPreview) {
          // 如果不是预览功能，只是正常的表单
          this.searchParams.patientId = this.patient.patientId
          let res = await ApiAssManage.getList(this.searchParams)
          this.total = res.data.total
          this.dataList = res.data.list
        } else {
          this.total = 0
          this.dataList = []
        }
        this.dataList.map((item, index) => {
          const dataValue = {
            ...JSON.parse(JSON.stringify(defaultValue)),
            ...item
          }
          Object.keys(dataValue).map((key) => {
            this.tableTmp.map((tableItem) => {
              if (tableItem.name1Key == key) {
                let fn = valueChange.get(key)
                if (fn && fn instanceof Function) {
                  fn.call(this, tableItem, dataValue[key], key)
                }
              }
            })
          })
          this.tableTmp.map((item) => {
            if (item.name1Key == 'operator') {
              item.list.push({
                key: 'operator',
                value: index
              })
              item.list.push({
                key: 'operator',
                value: index
              })
            }
          })
        })
        this.list = JSON.parse(JSON.stringify(this.tableTmp))
      } catch (error) {}
    },
    async reset () {
      this.tableTmp.map((item) => {
        item.list = []
      })
      await Promise.all([await this.getList(), await this.getTemp()])
      this.assRecordId = ''
      await this.getPrintList()
    },
    edit (index) {
      let row = this.dataList[index]
      this.assRecordId = row.ass_record_id
      this.valueData = JSON.parse(row.module_value)
      this.update = false
      this.$nextTick(() => {
        this.update = true
      })
    },
    delRecord (index) {
      let row = this.dataList[index]
      this.$confirm('是否确认删除？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(async () => {
        try {
          let res = await ApiAssManage.delete(row.ass_record_id)
        } catch (error) {
          this.$message.error(error.message)
          return
        }
        if (this.page_total % 10 == 1 && this.searchObj.page > 1) {
          this.searchObj.page--
        }
        this.$message.success('删除成功！')
        await this.reset()
      })
    },
    // 处理size变化
    handleSizeChange (val) {
      this.searchParams.size = val
      this.reset()
    },
    // 分页当前页码变化
    handleCurrentChange (val) {
      this.searchParams.page = val
      this.reset()
    },
    async addNote () {
      await this.getTemp()
    },
    cancel () {
      this.reset()
    },
    async getPrintList () {
      const tableListData = JSON.parse(JSON.stringify(this.tableTmp))
      let params = {
        ...this.searchParams,
        page: '',
        size: ''
      }
      try {
        let res = await ApiAssManage.getList(params)
        let list = res.data
        if (!list || !list.length) {
          tableListData.map((item) => {
            item.list = [{}, {}, {}, {}, {}]
          })
          tableListData.splice(
            list.findIndex((item) => item.name1Key == 'operator'),
            1
          )
          const printList = [JSON.parse(JSON.stringify(tableListData))]
          this.printList = printList
          return
        }
        // 将数组分为每5个一组
        var result = []
        for (var i = 0, len = list.length; i < len; i += 5) {
          result.push(list.slice(i, i + 5))
        }
        const printList = []
        result.map((v) => {
          tableListData.map((item) => {
            item.list = []
          })
          let list = []
          v.map((item, index) => {
            const dataValue = {
              ...JSON.parse(JSON.stringify(defaultValue)),
              ...item
            }
            Object.keys(dataValue).map((key) => {
              tableListData.map((tableItem) => {
                if (tableItem.name1Key == key) {
                  let fn = valueChange.get(key)
                  if (fn && fn instanceof Function) {
                    fn.call(this, tableItem, dataValue[key], key)
                  }
                }
              })
            })
            tableListData.map((item) => {
              if (item.name1Key == 'operator') {
                item.list.push({
                  key: 'operator',
                  value: index
                })
                item.list.push({
                  key: 'operator',
                  value: index
                })
              }
            })
          })
          list = JSON.parse(JSON.stringify(tableListData))
          list.splice(
            list.findIndex((item) => item.name1Key == 'operator'),
            1
          )
          printList.push(list)
        })
        this.printList = printList
      } catch (error) {
      }
    },
    // 格式化打印方式
    formatPrintSet (_printSet) {
      switch (_printSet) {
        case 1:
          return 'portrait'
          break
        case 2:
          return 'landscape'
          break
        default:
          return 'portrait'
          break
      }
    },
    printPreview () {
      printJS({
        printable: `deepVeinTable${this.formCode}`,
        type: 'html',
        style: `
        @page { size: ${this.formatPrintSet(this.printSet)};margin:0 auto; }
        li {
          font-size: 12px
        }
        .table-box table{
          border: 1px solid #333;
        }
        .table-box th, .table-box td {
          border: 1px solid #333;
          font-size: 14px
        }
        .table-box td {
          padding: 5px 10px;
          height: 30px;
          text-align: center;
        }
        .numstyle {
          position:relative;
          top:5px;
        }
        `,
        scanStyles: false
      })
    },
    merge ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        if (
          row.name1Key == 'assDate' ||
          row.name1Key == 'assTime' ||
          row.name1Key == 'assProject' ||
          row.name1Key == 'position' ||
          row.name1Key == 'pain' ||
          row.name1Key == 'shank' ||
          row.name1Key == 'operator' ||
          row.name1Key == 'autograph'
        ) {
          return [1, 2]
        }
        if (row.name1Key == 'popliteal') {
          if (row.name2Key == '1') {
            return [3, 1]
          } else {
            return [0, 0]
          }
        }
        if (row.name1Key == 'acrotarsium') {
          if (row.name2Key == '1') {
            return [3, 1]
          } else {
            return [0, 0]
          }
        }
        if (row.name1Key == 'leg') {
          if (row.name2Key == '1') {
            return [4, 1]
          } else {
            return [0, 0]
          }
        }
        if (row.name1Key == 'homan') {
          if (row.name2Key == '1') {
            return [2, 1]
          } else {
            return [0, 0]
          }
        }
        if (row.name1Key == 'swelling') {
          if (row.name2Key == '1') {
            return [4, 1]
          } else {
            return [0, 0]
          }
        }
        if (row.name1Key == 'skin') {
          if (row.name2Key == '1') {
            return [2, 1]
          } else {
            return [0, 0]
          }
        }
        if (row.name1Key == 'paralysis') {
          if (row.name2Key == '1') {
            return [2, 1]
          } else {
            return [0, 0]
          }
        }
        if (
          row.name1Key == 'problem' ||
          row.name1Key == 'assenssment' ||
          row.name1Key == 'measures'
        ) {
          if (row.name1Key == 'problem') {
            return [3, 1]
          } else {
            return [0, 0]
          }
        }
      }
      if (columnIndex == 1) {
        if (
          row.name1Key == 'assDate' ||
          row.name1Key == 'assTime' ||
          row.name1Key == 'assProject' ||
          row.name1Key == 'position' ||
          row.name1Key == 'pain' ||
          row.name1Key == 'shank' ||
          row.name1Key == 'operator' ||
          row.name1Key == 'autograph'
        ) {
          return [0, 0]
        }
      }
      if (columnIndex % 2 == 0) {
        if (
          row.name1Key == 'assDate' ||
          row.name1Key == 'assTime' ||
          row.name1Key == 'operator' ||
          row.name1Key == 'autograph'
        ) {
          return [1, 2]
        }
      } else {
        if (
          row.name1Key == 'assDate' ||
          row.name1Key == 'assTime' ||
          row.name1Key == 'operator' ||
          row.name1Key == 'autograph'
        ) {
          return [0, 0]
        }
      }
      return [1, 1]
    },
    async save () {
      let params = {
        assId: this.assTemp.assId, // 评估单ID
        moduleId: this.assTemp.moduleId, // 模板ID
        moduleValue: this.valueData, // 评估值
        haveRecordRate: 0, // 是否多次记录
        patientId: this.patient.patientId // 患者ID
      }
      const columnValue = []
      this.valueData.map((item) => {
        if (item.key == '1603160240000_48222') {
          if (!item.value) {
            item.value = moment().format('YYYY-MM-DD')
          }
        }
        if (item.key == '1603160240000_2013') {
          if (!item.value) {
            item.value = moment().format('HH:mm:ss')
          }
        }
        let fn = valueMap.get(item.key)
        if (fn && fn instanceof Function) {
          fn.call(this, columnValue, item.value)
        }
      })
      columnValue.push({
        key: 'formCode',
        value: this.formCode
      })
      let empInfo = JSON.parse(localStorage.getItem('empInfo'))
      columnValue.push({
        key: 'autograph',
        value: empInfo.empName
      })
      columnValue.map((item) => {
        item.value =
          typeof item.value === 'object'
            ? JSON.stringify(item.value)
            : item.value
      })
      params.columnValue = columnValue
      try {
        if (this.assRecordId) {
          params.assRecordId = this.assRecordId
          await ApiAssManage.edit(params)
          this.$message.success('编辑成功')
          await this.reset()
        } else {
          await ApiAssManage.add(params)
          this.$message.success('添加成功')
          await this.reset()
        }
      } catch (error) {}
    }
  }
}
</script>
<style lang="scss" scoped>
.tool-bar {
  padding: 13px 20px 13px 14px;
  button {
    min-width: 78px;
  }
  /deep/ .el-button {
    border-radius: 2px !important;
    font-size: 14px !important;
    padding: 6px 12px !important;
    border: none;
  }
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
    width: 350px;
    box-sizing: border-box;
    position: relative;
    transition: width 0.25s;
    border-left: 1px solid #e6e6e6;
    overflow: auto;
  }
}
/deep/ .bgcolordeep {
  background: #f7f7f7;
}
</style>
