<template>
  <layout v-loading="loading">
    <!--      查询条件-->
    <div class="query-items" slot="query">
      <div class="split">&nbsp;</div>
    </div>
    <div class="main-list" slot="main">
      <el-table
              ref="table"
              class="table"
              :data="table_data"
              highlight-current-row
              height="100%"
              stripe
      >
        <!-- <el-table-column type="index" fixed="left" label="序号" width="120" align="center">
          <template scope="scope">
            <span>{{(search_form.page - 1) * search_form.size + scope.$index + 1}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
                prop="advanceAmount"
                label="预交金"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="amountTotal"
                label="总金额"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="ownExpenseAmount"
                label="自费"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="returnAmount"
                label="返还金额"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="supplementAmount"
                label="补收金额"
                align="center"
                min-width="95"
        ></el-table-column>
        <el-table-column
                prop="settlementStatus"
                label="结算状态"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="settlementTime"
                label="结算时间"
                align="center"
                min-width="100"
        ></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page_current"
              :page-sizes="[10, 30, 50, 100]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page_total"
      >
      </el-pagination>
    </div>
  </layout>
</template>

<script>
import layout from '../../../components/bnms/layout/list'
import moment from 'moment'
import { ApiCostInformation } from '../../../api/bnms/index'
export default {
  name: 'CostInformation',
  props: ['patient'],
  components: { layout },
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 1,
      search_form: {
        patientId: '',
        // beginTime: moment().subtract(1, 'days').format("YYYY-MM-DD 00:00:00"),
        // endTime:moment().subtract(-1, 'days').format("YYYY-MM-DD 23:59:59"),
        page: 1,
        size: 10
      },
      table_data: []
    }
  },
  created () {
    // this.getCostInformationList()
  },
  watch: {
    patient (patient) {
      this.search_form.patientId = patient.patientId
      this.search_form.page = 1
      this.getCostInformationList()
    }
  },
  methods: {
    searchForm () {
      this.handleCurrentChange(1)
    },
    getCostInformationList () {
      this.table_data = []
      this.loading = true
      ApiCostInformation.select(this.search_form)
        .then(res => {
          console.log(res)
          this.table_data = res.data.list
          this.page_total = res.data.total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getCostInformationList()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getCostInformationList()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
  .split{
    width: 100%;
    height: 39px;
  }
</style>
