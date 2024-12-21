<template>
  <layout_aside v-loading="loading">
    <div slot="aside">
      <nurse-list initRowIndex="0" @reset-nurse="resetNurseId" :params="params" ref="nurseList"/>
    </div>
    <div slot="main" class="typt-list-container">
      <el-form :inline="true">
        <el-form-item class="riqi">日期:</el-form-item>
        <el-form-item>
          <el-radio-group v-model="formSearchData.dateType" v-uni="'qingjiaguanli_changeDate'" @change="radioChange">
            <el-radio :label="0">最近三个月</el-radio>
            <el-radio :label="1">最近半年</el-radio>
            <el-radio :label="2">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            style="width: 182px;height: 34px;"
            v-model="formSearchData.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            placeholder="请选择" :disabled="timerDisabled" :picker-options="expireTimeOption">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="zhi">至</el-form-item>
        <el-form-item>
          <el-date-picker
            style="width: 182px;height: 34px;"
            v-model="formSearchData.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            placeholder="请选择" :disabled="timerDisabled">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary" class="el-button-radius"
                       icon="el-icon-search" v-uni="'qingjiaguanli_search'" @click="getData" size="small">搜索
            </el-button>
            <el-button type="text" @click="resetFormCondition" v-uni="'qingjiaguanli_reset'">重置</el-button>
          </div>
        </el-form-item>
      </el-form>

      <hr/>
      <div class="typt-list-add-div">
        <el-button type="warning" size="small"
                   @click="AddHolidayData()"
                   icon="el-icon-plus" v-uni="'qingjiaguanli_add'">添加
        </el-button>
      </div>

      <el-table
        :data="holidayDataList"
        :stripe="true"
        v-loading="listLoading"
        height="80%"
      >
        <!-- <el-table-column type="index" align="center" label="序号" width="90">
          <template scope="scope">
            <span>{{(formSearchData.page - 1) * formSearchData.size + scope.$index + 1}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="holidayClass"
          align="center"
          width="160"
          show-overflow-tooltip
          label="请假类型">
        </el-table-column>
        <el-table-column
          align="center"
          label="开始时间"
        >
          <template slot-scope="scope">
            <div>{{scope.row.startDate|formatDateTimeYMD}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="结束时间">
          <template slot-scope="scope">
            <div>{{scope.row.endDate|formatDateTimeYMD}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="leaveWorkDays"
          label="请假天数">

        </el-table-column>
        <el-table-column
          align="center"
          prop="leaveWorkReason"
          label="请假理由"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
        >
          <template slot-scope="scope">
            <div>{{scope.row.createDate|formatDateTimeYMDHM}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="$emit('option-changed', 'add', scope.row)" v-uni[scope.row.accountId]="'qingjiaguanli_edit'" :key="'qingjiaguanli_edit' + scope.row.accountId">
              编辑
            </el-button>
            <el-button type="text" @click="del(scope.row)" style="color: #f56c6c" v-uni[scope.row.accountId]="'qingjiaguanli_delete'" :key="'qingjiaguanli_delete' + scope.row.accountId">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="paginationDiv">
        <!--组件页码显示-->
        <div class="block pagination paginationDiv_inner">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            :current-page="formSearchData.page"
            :page-size="formSearchData.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page_total">
          </el-pagination>
        </div>
      </div>
    </div>

  </layout_aside>
</template>

<script>
import PageInfo from '../../../components/hsms/PageInfoCommon'
import layoutAside from '../../../components/hsms/layout/aside'
import layoutList from '../../../components/hsms/layout/list'
import nurseList from './NurseNameList'
import { ApiHolidayData } from '../../../api/hsms'
import moment from 'moment'

export default {
  name: 'List',
  props: ['params'],
  components: { nurseList, 'layout_aside': layoutAside, layoutList, PageInfo },
  data () {
    return {
      loading: false,
      listLoading: false,
      beginDateT: null,
      endDateT: null,
      formSearchData: {
        dateType: 0,
        accountType: 2,
        accountId: '',
        startDate: moment().subtract(3, 'month').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        page: 1,
        size: 10
      },
      holidayDataList: [],
      page_total: 1,
      timerDisabled: true,
      expireTimeOption: {
        disabledDate (date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() < moment().startOf('year')
        }
      }
    }
  },
  filters: {
    formatDateTimeYMD (time) {
      if (time == null) {
        return
      }
      return moment(time).format('YYYY-MM-DD')
    },
    formatDateTimeYMDHM (time) {
      if (time == null) {
        return
      }
      return moment(time).format('YYYY-MM-DD HH:mm')
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    resetNurseId (row) {
      this.formSearchData.accountId = row.accountId
      // this.formSearchData.accountType = row.accountType
      this.getData()
    },
    getData () {
      this.listLoading = true
      if (this.formSearchData.endDate < this.formSearchData.startDate) {
        this.$message.error('开始时间不能大于结束时间！')
        this.listLoading = false
        return
      }
      ApiHolidayData.get(this.formSearchData).then(res => {
        this.holidayDataList = res.data.list || []
        this.page_total = res.data.total
      })
      this.listLoading = false
    },
    AddHolidayData () {
      if (this.formSearchData.accountId) {
        this.$emit('option-changed', 'add', {
          accountId: this.formSearchData.accountId,
          accountType: this.formSearchData.accountType
        })
      } else {
        this.$message.warning('请先选择护士！')
      }
    },
    radioChange (val) {
      if (val == 0) {
        this.formSearchData.startDate = moment().subtract(3, 'month').format('YYYY-MM-DD')
        this.formSearchData.endDate = moment().format('YYYY-MM-DD')
        this.timerDisabled = true
      } else if (val === 1) {
        this.formSearchData.startDate = moment().subtract(6, 'month').format('YYYY-MM-DD')
        this.formSearchData.endDate = moment().format('YYYY-MM-DD')
        this.timerDisabled = true
      } else {
        let dtEnd = moment().format('YYYY-MM-DD')
        let dtStart = moment().subtract(1, 'month').format('YYYY-MM-DD')
        if (moment().format('YYYY') !== moment().subtract(1, 'month').format('YYYY')) {
          dtStart = moment().startOf('year').format('YYYY-MM-DD')
        }
        this.formSearchData.endDate = dtEnd
        this.formSearchData.startDate = dtStart
        this.timerDisabled = false
      }
    },
    resetFormCondition () {
      this.formSearchData.dateType = 0
      this.radioChange(0)
      this.getData()
    },
    del (row) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiHolidayData.delete(row).then(() => {
          this.getData()
          this.$refs.nurseList.getData()
          this.$message.success('删除成功！')
        }).catch(res => {
          this.$message.error(res.message)
        })
      })
    },

    handleCurrentChange (val) {
      this.formSearchData.page = val
      this.getData()
    },
    // 查询上一页，调用父级方法刷新列表
    handleSizeChange (val) {
      this.formSearchData.size = val
      this.formSearchData.page = 1
      this.getData()
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ .el-radio {
    color: #333333;
  }

  /deep/ .el-form-item {
    margin-right: 22px;
  }

  /deep/ .el-icon-date:before {
    content: "\E71F";
  }

  .riqi {
    margin-right: 10px;
  }

  .zhi {
    margin-right: 2px;
    margin-left: -20px;
  }

  hr {
    margin-top: 22px;
  }

  .paginationDiv_inner {
    /deep/ .el-input__inner {
      color: #717171;
    }
  }
</style>
