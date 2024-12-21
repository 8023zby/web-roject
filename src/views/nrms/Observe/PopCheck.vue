<template>
  <div class="container">
    <div class="left">
      <layout-list>
        <div slot="right_btn" class="tool-bar" v-if="!isPreview">
          <el-button type="success" @click="printPreview" size="small">打印</el-button>
        </div>
        <div slot="main" class="main-list">
          <formHeader :autoHead="autoHead"></formHeader>
          <div class="table-list">
            <el-table :data="list" highlight-current-row height="100%">
              <!-- <el-table-column
                type="index"
                align="center"
                width="100"
                label="序号"
              >
                <template slot-scope="scope">
                  <span>{{(searchParams.page - 1) * searchParams.size + (scope.$index + 1)}}</span>
                </template>
              </el-table-column> -->

              <template v-for="(item,index) in titData">
                <el-table-column :prop="item['fild']" :label="item['lableName']" align="center" :key="index" min-width="120"> </el-table-column>
              </template>

              <el-table-column label="护士签名" prop="autograph" width="90" align="center">
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
          <!-- 打印 -->
          <div style="height: 0;overflow: hidden;">
            <div style="width: 1000px" :id="'pressureTable' + formCode">
              <div style="page-break-after:always;padding-top: 30px" v-for="(item,index) in printList" :key="index">
                <formHeader :autoHead="autoHead"></formHeader>
                <div class="table-box" style="display: flex;width: 100%;justify-content: center;">
                  <table border="0" cellspacing="0" cellpadding="0" align="center" style="width: 100%">
                    <thead>
                      <tr>
                        <th v-for="(item,index) in titData" :key="index">{{ item['lableName'] }}</th>
                        <th rowspan="2">护士签名</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(v,i) in item" :key="i">
                        <td>{{ v.time }}</td>
                        <td>{{ v.hour }}</td>
                        <td>{{ v.popType }}</td>
                        <td>{{ v.popPosition }}</td>
                        <td>{{ v.color }}</td>
                        <td>{{ v.popMethod }}</td>
                        <td>{{ v.setEffect }}</td>
                        <td>{{ v.quality }}</td>
                        <td>{{ v.amount }}</td>
                        <td>{{ v.popLen }}</td>
                        <td>{{ v.thing }}</td>
                        <td>{{ v.autograph }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style="position: relative;bottom: -20px;text-align: center;">第{{ index + 1 }}页</div>
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
    <div class="right" style="overflow: auto;" v-if="!isPreview">
      <div style="padding: 10px 20px">
        <span style="font-weight: bold">{{
          assRecordId ? "编辑" : "添加"
        }}</span>
      </div>
      <auto-form ref="formCommon" v-if="update" :data="data" :valueData="valueData"></auto-form>
      <div style="display: flex; justify-content: center;margin-bottom: 10px;" v-if="!isPreview">
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

export default {
  mixins: [AutoForm],
  data () {
    return {
      titData: [
        {
          lableName: '日期',
          fieldName: '1603097492000_15437',
          fild: 'time'
        },
        {
          lableName: '时间',
          fieldName: '1603097492000_44756',
          fild: 'hour'
        },
        {
          lableName: '管道类型',
          fieldName: '1603160240000_92957',
          fild: 'popType'
        },
        {
          lableName: '置管部位',
          fieldName: '1603160240000_92958',
          fild: 'popPosition'
        },
        {
          lableName: '固定方法',
          fieldName: '1603160240000_92959',
          fild: 'popMethod'
        },
        {
          lableName: '颜色',
          fieldName: '1603160240000_92960',
          fild: 'color'
        },
        {
          lableName: '固定效果',
          fieldName: '1603160240000_92961',
          fild: 'setEffect'
        },
        {
          lableName: '性质',
          fieldName: '1603160240000_92962',
          fild: 'quality'
        },
        {
          lableName: '量(ml)',
          fieldName: '1601365086000_51169',
          fild: 'amount'
        },
        {
          lableName: '置管长度(cm)',
          fieldName: '1601365086000_51170',
          fild: 'popLen'
        },
        {
          lableName: '敷料',
          fieldName: '1603160240000_92963',
          fild: 'thing'
        }
      ],
      data: [],
      valueData: [],
      row: {},
      assTemp: {},
      searchParams: {
        page: 1,
        size: 10,
        assClass: '6',
        patientId: '',
        sort: {
          time: 1,
          hour: 1
        }
      },
      list: [],
      total: 0,
      assRecordId: '',
      update: true,
      columnPrint: 20,
      rowPrint: 9,
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

    if (this.printSet === 1) {
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
    nextFocus (e) { // 回车跳到下一个可获得焦点的元素
      const keyCode = e.keyCode || e.which || e.charCode

      let root = null
      const classList = e.target.classList
      // 输入框或者下拉
      if (classList.contains('el-input__inner')) {
        const pClassList = e.target.parentNode.parentNode.classList
        // 下拉
        if (pClassList.contains('el-select')) {
          root = e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        } else {
          // 输入框
          root = e.target.parentNode.parentNode.parentNode.parentNode
        }
      } else if (classList.contains('el-radio__original')) { // 单选
        root = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      } else if (classList.contains('el-checkbox__original')) { // 复选
        root = e.target.parentNode.parentNode.parentNode.parentNode.parentNode
      }

      let focusParent = null
      // 回车 13 下 40 左 37 右 39 上 38
      if (keyCode === 13 || keyCode === 39 || keyCode === 40) { // 回车 右 下
        focusParent = root.nextElementSibling
      } else if (keyCode === 37 || keyCode === 38) { // 上 左
        focusParent = root.previousElementSibling
      }

      let focusE = null
      if (focusParent) {
        if (focusParent.querySelector('input')) {
          focusE = focusParent.querySelector('input')
        } else if (focusParent.querySelector('checkbox')) {
          focusE = focusParent.querySelector('checkbox')
        } else if (focusParent.querySelector('radio')) {
          focusE = focusParent.querySelector('radio')
        } else if (focusParent.querySelector('.el-button--primary')) {
          // 直接触发保存按钮事件去保存数据
          focusE = focusParent.querySelector('.el-button--primary')
        }
        console.log('root --- ', root)
        console.log('focusParent -- ', focusParent, focusE)
        // e.target.blur()
        focusE && focusE.focus()
      }
    },
    async getTemp () {
      try {
        let res = await ApiAssManage.assMangerList({
          assClass: '6'
        })

        res.data.map((item) => {
          if (item.moduleId === '10022') {
            this.data = JSON.parse(JSON.stringify(item.moduleJson))

            this.data[0].columns[0].children.map((v) => {
              if (v.key === '1603097492000_15437') { // 日期
                v.value = moment().format('YYYY-MM-DD')
              } else if (v.key === '1603097492000_44756') { // 时间
                v.value = moment().format('HH:mm:ss')
              }
            })
            this.assTemp = item
          }
        })
        this.valueData = []
        await this.operatorFormData()

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

        let res = await ApiAssManage.getList(this.searchParams)

        this.total = res.data.total
        this.list = res.data.list
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
          await ApiAssManage.delete(row.ass_record_id)
        } catch (error) {
          this.$message.error(error.message)
          return
        }
        if (this.page_total % 10 === 1 && this.searchObj.page > 1) {
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

        // 对data进行处理 data 的长度是 printColumnNum的整数倍，不需要处理，否则得补全
        let _num = Math.ceil(res.data.length / this.printColumnNum)
        let _newArr = []

        _newArr = this.formatArr(res.data, _num * this.printColumnNum)

        let _a = []
        _a = this.chunk(_newArr, this.printColumnNum)
        this.printList = _a
      } catch (error) {
      }
    },
    formatArr (arr, n) {
      let len = arr.length
      if (n <= arr.length) {
        return arr.slice(0, n)
      }
      return arr.concat(new Array(n - len).fill({ recordDate: '', signList: [{ signId: 'bloodVal', signValue: '' }] })) // 可填充所需数据类型
    },
    chunk (arr, size) {
      var arr2 = []
      for (var i = 0; i < arr.length; i = i + size) {
        arr2.push(arr.slice(i, i + size))
      }
      return arr2
    },
    group (array, subGroupLength) { // 将一个数组按长度分成两个数组
      let index = 0
      let newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength))
      }
      return newArray
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
          height:36px;
        }
        .table-box th {
          padding: 10px
        }
        .table-box td {
          padding: 10px;
          text-align: center;
          height:36px;
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
      let date = ''
      let hour = ''
      const columnValue = []
      this.valueData.map((item) => {
        if (item.key === '1603097492000_15437') { // 日期
          if (!item.value) {
            item.value = moment().format('YYYY-MM-DD')
          }
        } else if (item.key === '1603097492000_44756') { // 时间
          if (!item.value) {
            item.value = moment().format('HH:mm:ss')
          }
        }
        this.titData.map((v) => {
          if (v.fieldName === item.key) {
            if (item.key == '1603097492000_15437') {
              date = item.value
            }
            if (item.key == '1603097492000_44756') {
              hour = item.value
            }
            // 处理下拉可手输的显示
            if (item.type === 'select') {
              this.operatorFormData((w) => {
                if (w.key === v.fieldName) {
                  let _flag = false
                  w.options.map((k) => {
                    if (k.id === item.value) {
                      _flag = true
                      columnValue.push({
                        key: v.fild,
                        value: k.label
                      })
                    }
                  })

                  if (!_flag) {
                    columnValue.push({
                      key: v.fild,
                      value: item.value
                    })
                  }
                }
              })
            } else {
              columnValue.push({
                key: v.fild,
                value: item.value
              })
            }
          }
        })
      })
      // formCode设置值
      columnValue.push({
        key: 'formCode',
        value: this.formCode
      })

      let empInfo = JSON.parse(localStorage.getItem('empInfo'))
      // 护士签名
      columnValue.push({
        key: 'autograph',
        value: empInfo.empName
      })
      params.columnValue = columnValue
      params.assDate = moment(`${date} ${hour}`).format('YYYY-MM-DD HH:mm:ss')
      // 校验输入的数据是否全为空
      let _flag = false
      params.moduleValue.map((v) => {
        if (v.type !== 'date' && v.value !== '') {
          _flag = true
        }
      })

      if (!_flag) {
        this.$message.warning('请输入管道观察数据！')
        return false
      }

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
