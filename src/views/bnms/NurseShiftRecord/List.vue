<template>
  <layout v-loading="loading">

    <!--查询-->
    <div slot="query"
         class="query-items">
      <el-form class="demo-form-inline"
               :inline="true"
               :model="searchObj"
               ref="formSearch">
        <el-form-item :label="'时间：'">
          <el-date-picker v-model="searchObj.date"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary"
                       class="el-button-radius"
                       icon="el-icon-search"
                       @click="handleCurrentChange(1)"
                       size="small">搜索
            </el-button>
            <el-button type="text"
                       @click="resetSearchObj">重置
            </el-button>
            <el-button type="success"
                       class="el-button-radius"
                       style="margin-left: 20px;"
                       @click="handleCurrentChange(1)"
                       size="small">导出
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--end-->

    <!-- 表格 -->
    <div slot="main"
         class="main-list">
      <el-table ref="table"
                :data="nurseShiftRecordData"
                row-key="shiftId"
                stripe
                highlight-current-row
                height="100%">
        <el-table-column type="index"
                         label="序号"
                         width="120"
                         fixed="left"
                         align="center">
          <template scope="scope">
            <span>{{(page - 1) * size + (scope.$index + 1)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deptId"
                         label="护理单元"
                         min-width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="roomName"
                         label="房间"
                         min-width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="nurseName"
                         label="护士"
                         min-width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="shiftTime"
                         min-width="100"
                         label="时间"
                         show-overflow-tooltip
                         header-align="center">
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div slot="footer"
         class="page-bar">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="page_current"
                     :page-sizes="[10, 30, 50, 100]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page_total">
      </el-pagination>
    </div>

  </layout>
</template>

<script>
import layout from '../../../components/bnms/layout/list'

export default {
  name: 'NurseShiftRecordList',
  props: ['tab'],
  components: { layout },
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 0,
      page: 1,
      size: 10,
      searchObj: {
        // beginTime: '',
        // endTime: '',
        date: ''
      },
      nurseShiftRecordData: []
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.getPassYearFormatDate()
  },
  activated () {

  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // num 就是传获取前天前的日期
    getPassYearFormatDate (num) {
      num = num || 6
      let nowDate = new Date()
      let date = new Date(nowDate)
      date.setDate(date.getDate() - num)
      let seperator1 = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let formatDate = year + seperator1 + month + seperator1 + strDate
      this.getNowFormatDate(formatDate)
    },
    // 获取现在时间，并接受过去时间的值
    getNowFormatDate (formatDate) {
      let date = new Date()
      let seperator1 = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let nowData = year + seperator1 + month + seperator1 + strDate
      this.searchObj.date = [formatDate, nowData]
    },
    init () {
      this.getPassYearFormatDate()
      this.getData()
    },
    resetSearchObj () {
      this.searchObj.date = []
      this.handleCurrentChange(1)
    },
    handleSizeChange (val) {
      this.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page_current = this.page = val
      this.getData()
    },
    getData () {
      // this.loading = true
      let param = {
        beginTime: this.searchObj.date[0],
        endTime: this.searchObj.date[1],
        size: this.size,
        page: this.page,
        log: '获取列表'
      }
      console.log(param)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
</style>
