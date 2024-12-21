<template>
  <div class="container">
    <layout-list>
      <!-- 顶部查询 -->
      <div slot="query" class="tool-bar">
        <heads :searchParams="searchParams" @setupColm="setupColm" @selectData="getCheckList" :title="title"></heads>
      </div>
      <!-- 列表 -->
      <div slot="main" class="main-list" style="overflow: auto">
        <div class="table-list" style="height: 100%">
          <el-table :data="tableList" highlight-current-row height="100%" :cell-style="cellStyle" v-if="tableShow">
            <!-- <el-table-column show-overflow-tooltip type="index" align="center" label="序号" width="60" :index="indexMethod"></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="bedName" label="床号" align="center" width="100">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="patientName" label="姓名" align="center">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="sex" label="性别" align="center" v-if="columnCheckedList.indexOf('sex') >= 0">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="age" label="年龄" align="center" v-if="columnCheckedList.indexOf('age') >= 0">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="inspectName"
              label="检查项目"
              align="center"
              v-if="columnCheckedList.indexOf('inspectName') >= 0">
              <template scope="scope">
                {{scope.row.inspectName | formatVlaue}}
              </template>
            </el-table-column>
            <el-table-column
              prop="projectResult"
              label="检查结果"
              align="center"
              class="dddd"
              show-overflow-tooltip
              v-if="columnCheckedList.indexOf('projectResult') >= 0"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="criticalValue" label="危急值" align="center" v-if="columnCheckedList.indexOf('criticalValue') >= 0">
              <template scope="scope">
                {{scope.row.criticalValue | formatVlaue}}
              </template>
            </el-table-column>
            <el-table-column
              prop="inspectMeasures"
              label="临床意义及措施"
              width="140"
              align="center"
              show-overflow-tooltip
              v-if="columnCheckedList.indexOf('inspectMeasures') >= 0"
            >
              <template scope="scope">
                {{scope.row.inspectMeasures | formatVlaue}}
              </template>
            </el-table-column>
            <el-table-column
              prop="reportUser"
              label="报告人"
              align="center"
              v-if="columnCheckedList.indexOf('reportUser') >= 0"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="reportDate" label="报告时间" align="center" v-if="columnCheckedList.indexOf('reportDate') >= 0">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="receiveUser"
              label="接收人"
              align="center"
              v-if="columnCheckedList.indexOf('receiveUser') >= 0"
            >
              <template scope="scope">
                {{scope.row.receiveUser | formatVlaue}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="receiveDate" label="接收时间" align="center" v-if="columnCheckedList.indexOf('receiveDate') >= 0">
              <template scope="scope">
                {{scope.row.receiveDate | formatVlaue}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="remark" label="备注" align="center" v-if="columnCheckedList.indexOf('remark') >= 0">
              <template scope="scope">
                {{scope.row.remark | formatVlaue}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="baogao" label="报告" align="center">
              <template slot-scope="scope">
                <el-button v-uni:[scope.$index]="'weijizhi_chakan'" @click="showDetail(scope.row)" type="text">
                  查看
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-uni:[scope.$index]="'weijizhi_jieshou'" v-if="scope.row.status == 0" @click="receive(scope.row)" type="text">
                  接收
                </el-button>
                <el-button v-else style="color:#ccc" type="text" >
                  已接收
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 分页 -->
      <div slot="footer" class="page-bar">
        <el-pagination
          :current-page.sync="searchParams.page"
          :page-size="searchParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange_examine"
          @current-change="handleCurrentChange_examine"
        />
      </div>
    </layout-list>
    <!-------- 列设置 start -------->
    <el-dialog title="列设置" :visible.sync="columnVisible" width="490px">
      <div style="padding-bottom: 25px">
        <p style="margin-bottom:18px;">在表单中显示列:</p>
        <el-checkbox-group
          v-uni="'weijizhi_lieshezhi_dialog'"
          v-model="columnCheckedList">
          <el-checkbox
            :label="item.id"
            v-for="(item, index) in columnCheckboxList"
            :key="item.id"
            class="column-checkbox-item"
            ><span class="column-checkbox-lable">{{
              item.label
            }}</span></el-checkbox
          >
        </el-checkbox-group>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'weijizhi_lieshezhi_dialog_cancel'" @click="cancel">取消</el-button>
        <el-button v-uni="'weijizhi_lieshezhi_dialog_confirm'" type="primary" @click="onColumnSettingConfirm"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-------- 列设置 end -------->
    <!-- 接收 -->
    <receive :dialogVisible="dialogVisible" :reportId="reportId" @getCheckList="getCheckList"></receive>
  </div>
</template>

<script>
import heads from './heads.vue'
import receive from './receive.vue'
import { ApiWarningList } from '@/api/nrms/index.js'
const columnCheckboxList = [
  {
    label: '性别',
    id: 'sex'
  },
  {
    label: '年龄',
    id: 'age'
  },
  {
    label: '检查项目',
    id: 'inspectName'
  },
  {
    label: '检查结果',
    id: 'projectResult'
  },
  {
    label: '危急值',
    id: 'criticalValue'
  },
  {
    label: '临床意义及措施',
    id: 'inspectMeasures'
  },
  {
    label: '报告人',
    id: 'reportUser'
  },
  {
    label: '报告时间',
    id: 'reportDate'
  },
  {
    label: '接收人',
    id: 'receiveUser'
  },
  {
    label: '接收时间',
    id: 'receiveDate'
  },
  {
    label: '备注',
    id: 'remark'
  }
]
let deptInfo
export default {
  data () {
    return {
      tableShow: true,
      title: '检查项目:',
      tableList: [],
      searchParams: {
        deptId: null,
        recordType: '1',
        beginDate: this.getDay(-6) + ' 00:00:00',
        endDate: this.getDay(0) + ' 23:59:59',
        bedName: null,
        projectContent: null,
        receiveUser: null,
        page: 1,
        size: 10
      },
      total: 0,
      columnVisible: false,
      columnCheckboxList,
      columnCheckedList: [ // 选中的列设置
        'sex',
        'age',
        'inspectName',
        'projectResult',
        'criticalValue',
        'inspectMeasures',
        'reportUser',
        'reportDate',
        'receiveUser',
        'receiveDate',
        'remark'
      ],
      dialogVisible: false,
      reportId: null
    }
  },
  components: {
    heads,
    receive,
    LayoutList: () => import('../../../components/nrms/layout/list.vue')
  },
  filters: {
    formatVlaue (val) {
      if (val === '' || val === null || val === undefined) {
        return '-'
      } else {
        return val
      }
    }
  },
  created () {
    deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.searchParams.deptId = deptInfo.deptId || ''
    this.getCheckList()
  },
  async mounted () {
    try {
      let columnCheckedList = localStorage.getItem('checkList')
      if (columnCheckedList) {
        this.columnCheckedList = JSON.parse(columnCheckedList)
      }
    } catch (error) {
    }
  },
  methods: {
    // /**
    //  * @description: 序号
    //  * @param {*} index
    //  * @return {*}
    //  */
    // indexMethod (index) {
    //   return (this.searchParams.page - 1) * this.searchParams.size + index + 1
    // },
    /**
     * @description: 列设置确认
     * @param {*}
     * @return {*}
     */
    onColumnSettingConfirm () {
      localStorage.setItem(
        'checkList',
        JSON.stringify(this.columnCheckedList)
      )
      this.columnVisible = false
    },
    cancel () {
      this.tableShow = false
      this.columnCheckedList = this.oldColumn
      this.columnVisible = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    setupColm () {
      this.columnVisible = true
      this.oldColumn = JSON.parse(JSON.stringify(this.columnCheckedList))
    },
    getCheckList (item = null) {
      this.searchParams.recordType = 1
      // if (item === '11') this.searchParams.endDate = this.searchParams.endDate + ' 23:59:59'
      ApiWarningList.getWarningList(this.searchParams).then(res => {
        this.tableList = this.dataDealWith(res.data.list)
        this.total = res.data.total
      })
    },
    // 数据处理 将危急值用，相连
    dataDealWith (data) {
      data.forEach(element => {
        const d = []
        if (element.criticalValue && element.criticalValue !== null && element.criticalValue !== '' && element.criticalValue !== undefined) {
          for (const item of element.criticalValue) {
            d.push(item.value)
          }
          element.criticalValue = d.join()
        }
      })
      return data
    },
    receive (item) {
      this.reportId = item.reportId
      this.dialogVisible = true
    },
    cellStyle (row, column, rowIndex, columnIndex) {
      if (row.column.label === '检查结果') {
        return 'color:red'
      }
    },
    showDetail (row) {
      if (row.reportUrl == null) {
        this.$message.warning('没有报告内容！')
        return false
      } else {
        let name = ''
        let query = null
        name = 'checkValue-details'
        query = { pdfPath: row.reportUrl, title: '检查报告详情' }

        this.$router.push({
          name: name,
          query: query
        })
      }
    },
    handleSizeChange_examine (val) {
      this.searchParams.size = val
      this.getCheckList()
    },
    handleCurrentChange_examine (val) {
      this.searchParams.page = val
      this.getCheckList()
    },
    getDay (day) {
      var today = new Date()

      const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day

      today.setTime(targetday_milliseconds) // 注意，这行是关键代码

      var tYear = today.getFullYear()

      var tMonth = today.getMonth()

      var tDate = today.getDate()

      tMonth = this.doHandleMonth(tMonth + 1)

      tDate = this.doHandleMonth(tDate)

      return tYear + '-' + tMonth + '-' + tDate
    },

    doHandleMonth (month) {
      var m = month
      if (month.toString().length == 1) {
        m = '0' + month
      }
      return m
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/nrms/css/self_common";
.column-checkbox-item{
  margin-bottom: 18px;
  width: 122px;
  margin-right: 20px;
}
</style>
