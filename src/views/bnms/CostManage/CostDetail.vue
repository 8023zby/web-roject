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
          <el-button type="primary" v-uni="'feiyongguanli_feiyongmingxi_search'" @click="searchForm()" icon="el-icon-search">搜索</el-button>
          <el-button type="text" v-uni="'feiyongguanli_feiyongmingxi_reset'" @click="resetForm()" style="margin-left: 0"
          >重置
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
              height="100%"
              stripe
      >
        <!-- <el-table-column type="index" fixed="left" label="序号" width="120" align="center">
          <template scope="scope">
            <span>{{(search_form.page - 1) * search_form.size + scope.$index + 1}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
                prop="costMode"
                label="费用类别"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="costItemName"
                label="项目名称"
                align="center"
                min-width="200"
        ></el-table-column>
        <el-table-column
                prop="costItemSpecs"
                label="规格"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="costItemPrice"
                label="单价"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="costItemCount"
                label="数量"
                align="center"
                min-width="60"
        ></el-table-column>
        <el-table-column
                prop="costItemUnit"
                label="单位"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="costItemTotal"
                label="总金额"
                align="center"
                min-width="100"
        ></el-table-column>
        <el-table-column
                prop="chargeTime"
                label="收费时间"
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
import { ApiCostDetail } from '../../../api/bnms/index'
export default {
  name: 'CostDetail',
  props: ['patient'],
  components: { layout },
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 1,
      search_form: {
        patientId: '',
        beginTime: moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().subtract(0, 'days').format('YYYY-MM-DD 23:59:59'),
        page: 1,
        size: 10
      },
      table_data: []
    }
  },
  created () {
    // this.getCostDetailList()
  },
  watch: {
    patient (patient) {
      this.search_form.patientId = patient.patientId
      this.search_form.page = 1
      this.getCostDetailList()
    }
  },
  methods: {
    searchForm () {
      this.handleCurrentChange(1)
    },
    getCostDetailList () {
      this.table_data = []
      this.loading = true
      ApiCostDetail.select(this.search_form)
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
      this.getCostDetailList()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getCostDetailList()
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
