<template>
  <layout v-loading="loading">
    <!--      查询条件-->
    <div class="query-items" slot="query">
      <el-form :inline="true" :model="search_form" ref="search_form" class="demo-form-inline">
        <el-form-item label="开始时间:" prop="beginTime">
          <el-col :span="11">
            <el-date-picker
                    v-model="search_form.beginTime"
                    type="datetime"
                    :clearable="false"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间:" prop="endTime">
          <el-col :span="11">
            <el-date-picker
                    v-model="search_form.endTime"
                    type="datetime"
                    :clearable="false"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item style="margin-left: 18px;">
          <el-button type="primary" @click="searchForm()" v-uni="'feiyongguanli_yujiaojin_search'" icon="el-icon-search">搜索</el-button>
          <el-button type="text" @click="resetForm()" style="margin-left: 0"
          v-uni="'feiyongguanli_yujiaojin_rese'">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-list" slot="main">
      <el-table
              ref="table"
              class="table"
              :data="table_data"
              highlight-current-row
              show-summary
              :summary-method="getSummaries"
              height="100%"
              stripe
      >
        <!-- <el-table-column type="index" label="序号" width="120" align="center">
          <template scope="scope">
            <span>{{(search_form.page - 1) * search_form.size + scope.$index + 1}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
                prop="paymentNegotiable"
                label="票据号"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="advanceAmount"
                label="预交金额"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="paymentMode"
                label="支付方式"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="operatorName"
                label="操作员"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="operationTime"
                label="操作日期"
                align="center"
                min-width="95"
        ></el-table-column>
        <el-table-column
                prop="deptName"
                label="所在科室"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="settlementStatus"
                label="结算状态"
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
import { ApiAdvanceAmount } from '../../../api/bnms/index'
export default {
  name: 'main',
  components: { layout },
  props: ['patient'],
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 1,
      search_form: {
        patientId: '',
        beginTime: moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'), // 2020.06.08 修诗统一定为 web pda pad都是查询昨天与今天数据
        endTime: moment().subtract(0, 'days').format('YYYY-MM-DD 23:59:59'),
        page: 1,
        size: 10
      },
      table_data: []
    }
  },
  created () {
    this.getAdvanceAmountList()
  },
  watch: {
    patient (patient) {
      this.search_form.patientId = patient.patientId
      this.search_form.page = 1
      this.getAdvanceAmountList()
    }
  },
  methods: {
    searchForm () {
      this.handleCurrentChange(1)
    },
    getAdvanceAmountList () {
      this.table_data = []
      this.loading = true
      ApiAdvanceAmount.select(this.search_form)
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
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          // sums[index] += ' 元';
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getAdvanceAmountList()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getAdvanceAmountList()
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
</style>
