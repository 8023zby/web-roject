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
          <div class="table-list">
            <el-table :data="list" highlight-current-row height="100%">
              <el-table-column prop="assDate" label="日期" align="center"> </el-table-column>
              <el-table-column prop="assTime" label="时间" align="center"> </el-table-column>
              <el-table-column label="翻身" align="center">
                <el-table-column label="左" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.left"></i>
                  </template>
                </el-table-column>
                <el-table-column label="中" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.center"></i>
                  </template>
                </el-table-column>
                <el-table-column label="右" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.right"></i>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="特殊情况" align="center">
                <el-table-column label="强迫体位" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.force"></i>
                  </template>
                </el-table-column>
                <el-table-column label="拒绝翻身" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.refuse"></i>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="签名" prop="autograph" width="80" align="center">
              </el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <template>
                    <el-button
                      @click="edit(scope.row)"
                      type="text"
                      :disabled="patientType != 0 && patient.outHospitalFlag != 1"
                     >编辑</el-button>
                    <el-button type="textred" @click="delRecord(scope.row)" :disabled="patientType != 0 && patient.outHospitalFlag != 1">删除</el-button>
                  </template>
                  </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="height: 0;overflow: hidden;">
            <div style="width: 1050px" :id="'pressureTable' + formCode">
              <div style="page-break-after:always;padding-top: 30px" v-for="(item,index) in printList" :key="index">
                <formHeader :autoHead="autoHead"></formHeader>
                <div class="table-box" style="display: flex;padding-right: 15px;width: 100%;justify-content: center;">
                  <table border="0" cellspacing="0" cellpadding="0" align="center" style="width: 50%">
                    <thead>
                      <tr>
                        <th rowspan="2">日期</th>
                        <th rowspan="2">时间</th>
                        <th colspan="3">翻身</th>
                        <th colspan="2">特殊情况</th>
                        <th rowspan="2">签名</th>
                      </tr>
                      <tr>
                        <th>左</th>
                        <th>中</th>
                        <th>右</th>
                        <th>强迫体位</th>
                        <th>拒绝翻身</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(v,i) in item[0]" :key="i">
                        <td>
                          {{v.assDate}}
                        </td>
                        <td>
                          {{v.assTime}}
                        </td>
                        <td>
                          <template v-if="v.left">
                            √
                          </template>
                        </td>
                        <td>
                          <template v-if="v.center">
                            √
                          </template>
                        </td>
                        <td>
                          <template v-if="v.right">
                            √
                          </template>
                        </td>
                        <td>
                          <template v-if="v.force">
                            √
                          </template>
                        </td>
                        <td>
                          <template v-if="v.refuse">
                            √
                          </template>
                        </td>
                        <td>{{v.autograph}}</td>
                      </tr>
                    </tbody>
                  </table>
                  <table border="0" cellspacing="0" cellpadding="0" align="center" style="width: 50%">
                    <thead>
                      <tr>
                        <th rowspan="2">日期</th>
                        <th rowspan="2">时间</th>
                        <th colspan="3">翻身</th>
                        <th colspan="2">特殊情况</th>
                        <th rowspan="2">签名</th>
                      </tr>
                      <tr>
                        <th>左</th>
                        <th>中</th>
                        <th>右</th>
                        <th>强迫体位</th>
                        <th>拒绝翻身</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(v,i) in item[1]" :key="i">
                        <td>
                          {{v.assDate}}
                        </td>
                        <td>
                          {{v.assTime}}
                        </td>
                        <td>
                          <template v-if="v.left">
                            √
                          </template>
                        </td>
                        <td>
                          <template v-if="v.center">
                            √
                          </template>
                        </td>
                        <td>
                          <template v-if="v.right">
                            √
                          </template>
                        </td>
                        <td>
                          <template v-if="v.force">
                            √
                          </template>
                        </td>
                        <td>
                          <template v-if="v.refuse">
                            √
                          </template>
                        </td>
                        <td>{{v.autograph}}</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="page-bar" v-if="!isPreview">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="searchParams.page"
            :page-size="searchParams.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </layout-list>
      <div class="table" style="height: 100%" v-if="!isPreview"></div>
    </div>
    <div class="right" v-if="!isPreview">
      <div style="padding: 10px 20px">
        <span style="font-weight: bold">{{
          assRecordId ? "编辑" : "添加"
        }}</span>
      </div>
      <auto-form ref="formCommon" v-if="update" :data="data" :valueData="valueData"></auto-form>
      <div style="display: flex; justify-content: center" v-if="!isPreview">
        <el-button type="primary" @click="save" :disabled="patientType != 0 && patient.outHospitalFlag != 1">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { ApiAssManage } from '../../../api/nrms/index'
import printJS from 'print-js'
const moment = require('moment')
const valueMap = new Map([
  ['1603097492000_15437', 'assDate'],
  ['1603097492000_44756', 'assTime'],
  ['1603097492000_86803', 'turnOver'],
  ['1603097492000_49234', 'specialCase']
])
const valueChange = new Map([
  [
    'turnOver',
    (val, item) => {
      try {
        let arr = JSON.parse(val)
        if (!arr || !(arr instanceof Array)) {
          return
        }
        arr.map((v) => {
          switch (v) {
            case '1603097492000_86803-1':
              item.left = true
              break
            case '1603097492000_86803-2':
              item.center = true
              break
            case '1603097492000_86803-3':
              item.right = true
              break
          }
        })
      } catch (error) {}
    }
  ],
  [
    'specialCase',
    (val, item) => {
      try {
        let arr = JSON.parse(val)
        if (!arr || !(arr instanceof Array)) {
          return
        }
        arr.map((v) => {
          switch (v) {
            case '1603097492000_49234-1':
              item.force = true
              break
            case '1603097492000_49234-2':
              item.refuse = true
              break
          }
        })
      } catch (error) {}
    }
  ]
])
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
        size: 10,
        assClass: '3',
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
      columnPrint: 20,
      rowPrint: 7,
      printColumnNum: 0,
      printList: [],
      printPageList: [],
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      }
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
      handler (newValue, oldValue) {
        this.autoHead.tplData = newValue
        this.reset()
      }
    }
  },
  async created () {
    this.autoHead.tplHtml = this.formStyle
    this.autoHead.formName = this.formName
    this.searchParams.condition = [{
      key: 'formCode',
      value: this.formCode
    }]
    if (this.printSet == 1) {
      this.printColumnNum = this.columnPrint
    } else {
      this.printColumnNum = this.rowPrint
    }
    if ((this.patient && this.patient.id) || this.isPreview) {
      this.autoHead.tplData = this.patient
      await this.reset()
    }
  },
  methods: {
    async getTemp () {
      try {
        let res = await ApiAssManage.assMangerList({
          assClass: '3'
        })
        res.data.map((item) => {
          if (item.moduleId == '10016') {
            this.data = JSON.parse(JSON.stringify(item.moduleJson))
            this.assTemp = item
          }
        })
        this.valueData = []
        await this.operatorFormData()
        this.valueData.map(item => {
          if (item.key == '1603097492000_15437') {
            item.value = moment().format('YYYY-MM-DD')
          }
          if (item.key == '1603097492000_44756') {
            item.value = moment().format('HH:mm:ss')
          }
        })
        this.update = false
        this.$nextTick(() => {
          this.update = true
        })
      } catch (error) {}
    },
    // 格式化打印方式
    formatPrintSet (_printSet) {
      switch (_printSet) {
        case 1:
          return 'portrait'
        case 2:
          return 'landscape'
        default:
          return 'portrait'
      }
    },
    async getList () {
      try {
        this.searchParams.patientId = this.patient.patientId
        // this.searchParams.patientId = '2222'
        let res = await ApiAssManage.getList(this.searchParams)
        this.total = res.data.total
        this.list = res.data.list.map((item) => {
          Object.keys(item).map((key) => {
            let fn = valueChange.get(key)
            if (fn && fn instanceof Function) {
              fn.call(this, item[key], item)
            }
          })
          return item
        })
      } catch (error) {}
    },
    async reset () {
      await Promise.all([await this.getList(), await this.getTemp()])
      this.assRecordId = ''
      await this.getPrintList()
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
      this.getList()
    },
    // 分页当前页码变化
    handleCurrentChange (val) {
      this.searchParams.page = val
      this.getList()
    },
    addNote () {
      this.reset()
    },
    cancel () {
      this.reset()
    },
    async getPrintList () {
      let params = {
        ...this.searchParams,
        page: '',
        size: ''
      }
      try {
        let res = await ApiAssManage.getList(params)
        let list = res.data.map((item) => {
          Object.keys(item).map((key) => {
            let fn = valueChange.get(key)
            if (fn && fn instanceof Function) {
              fn.call(this, item[key], item)
            }
          })
          return item
        })
        if (!list || !list.length) {
          this.printList = [[[...Array(this.printColumnNum)].map((_) => {
            return {}
          }), [...Array(this.printColumnNum)].map((_) => {
            return {}
          })]]
          return
        }
        var result = []
        for (var i = 0, len = list.length; i < len; i += this.printColumnNum) {
          result.push(list.slice(i, i + this.printColumnNum))
        }
        let a = new Array(
          result.length % 2 == 0 ? result.length : result.length + 1
        )
        const printList = []
        for (let index = 0; index < a.length; index++) {
          let arr = [...Array(this.printColumnNum)].map((_) => {
            return {}
          })
          if (result[index] && result[index].length) {
            arr.splice(0, result[index].length, ...result[index])
          }
          printList.push(arr)
        }
        let printList2 = []
        for (var i = 0, len = printList.length; i < len; i += 2) {
          printList2.push(printList.slice(i, i + 2))
        }
        this.printList = printList2
      } catch (error) {
      }
    },
    async printPreview () {
      printJS({
        printable: `pressureTable${this.formCode}`,
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
          font-size: 12px
        }
        .table-box th {
          padding: 10px
        }
        .table-box td {
          padding: 10px;
          height: 37px;
          text-align: center;
        }
        `,
        scanStyles: false
      })
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
        if (item.key == '1603097492000_15437') {
          if (!item.value) {
            item.value = moment().format('YYYY-MM-DD')
          }
        }
        if (item.key == '1603097492000_44756') {
          if (!item.value) {
            item.value = moment().format('HH:mm:ss')
          }
        }
        if (valueMap.get(item.key)) {
          columnValue.push({
            key: valueMap.get(item.key),
            value:
              typeof item.value === 'object'
                ? JSON.stringify(item.value)
                : item.value
          })
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
@import "../../../assets/nrms/css/self_common.scss";
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
  }
}
</style>
