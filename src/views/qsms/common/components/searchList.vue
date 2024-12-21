<template>
  <!-- 查询条件 -->
  <div class="btn-group">
    <el-form :inline="true" class="demo-form-inline query-area">
       <el-form-item label="护理单元:" v-if="shownurseUnitId">
        <el-select
          :multiple="multiple"
          v-model="search.nurseUnitId"
          :collapse-tags="true"
          :placeholder="tabtype==='选项统计'?'全部':'请选择'"
        >
          <el-option v-if="showQuanBu" value="">全部</el-option>
          <el-option
            v-for="item in nurseUnitList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="tabtype==='每月对比'" label="统计时间:">
        <el-date-picker
          v-model="MonthTime"
          type="monthrange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          :clearable="false"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item :label="title" v-else>
        <el-date-picker
          v-model="search.rangeTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button

            type="primary"
            @click="queryHandler"
            class="el-button-radius"
            icon="el-icon-search"
          >搜索</el-button>
          <el-button type="text"  class="el-button-radius" @click="clsHandler">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getOneDate, msToDate } from '@/assets/qsms/utils/dateFormat'
// import { selectDeptInfo } from '@/assets/qsms/utils/common'
import { deepMerge } from '@/assets/qsms/utils'
import getStorageUser from '@/assets/qsms/utils/storageUser'

export default {
  components: {},
  props: {
    nums: {
      type: Number,
      default: 1
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showQuanBu: {
      type: Boolean,
      default: true
    },

    title: {
      type: String,
      default: () => {
        return '统计时间'
      }
    },
    tabtype: {
      type: String,
      default: () => {
        return ''
      }
    },
    defaultTime: {
      type: Boolean,
      default: true
    },
    shownurseUnitId: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    const search = this.initQueryCriteria()
    return {
      endTimeOptions: {},
      MonthTime: [], // 选择月份的时间字段
      search: search,
      userDataDepts: [],
      nurseUnitList: [],
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick (picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: '今年至今',
          onClick (picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 5)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },

  mounted () {
    this.nurseUnitList = getStorageUser('dataDeptInfoList')
    if (this.nurseUnitList === null) this.nurseUnitList = []
    if (this.tabtype === '每月对比') {
      let selectDeptInfo = getStorageUser('selectDeptInfo')
      if (selectDeptInfo !== null) this.search.nurseUnitId = selectDeptInfo.deptId

      // 统计时间”时间选择项（精确到月，默认半年）
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 5)
      this.MonthTime = [start, end]
    } else if (this.tabtype === '全院对比') {
      if (this.nurseUnitList.length > 0) {
        for (let v of this.nurseUnitList.values()) {
          this.search.nurseUnitId.push(v.deptId)
        }
      }
    }

    this.queryHandler()
  },
  methods: {
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      let [beginTime, endTime] = this.defaultTime === true ? getOneDate('month', this.nums) : []

      return deepMerge(form, {
        rangeTime: [beginTime, endTime],
        nurseUnitId: ''
      })
    },
    queryHandler () {
      if (this.tabtype === '每月对比') {
        if (this.MonthTime && this.MonthTime[0]) {
          this.search.beginTime = msToDate(this.MonthTime[0]).withoutTime
          this.search.endTime = msToDate(this.MonthTime[1]).withoutTime
        }
      }
      if (this.search.beginTime === null || this.search.endTime === null || this.search.beginTime === '' || this.search.endTime === '') {
        this.$message({
          type: 'info',
          message: '统计时间不能为空!'
        })
        return false
      } else {
        /* this.search.beginTime = this.search.beginTime.substr(0, 7)
        this.search.endTime = this.search.endTime.substr(0, 7) */
      }

      let _search = {
        beginTime: this.search.rangeTime[0],
        endTime: this.search.rangeTime[1],
        nurseUnitId: this.search.nurseUnitId
      }

      this.$emit('unitSearch', _search)
    },
    clsHandler () {
      this.search = this.initQueryCriteria()

      if (this.tabtype === '每月对比') {
        let selectDeptInfo = getStorageUser('selectDeptInfo')
        if (selectDeptInfo !== null) this.search.nurseUnitId = selectDeptInfo.deptId

        // 统计时间”时间选择项（精确到月，默认半年）
        const end = new Date()
        const start = new Date()
        start.setMonth(start.getMonth() - 5)

        this.MonthTime = [start, end]
      } else if (this.tabtype === '全院对比') {
        this.search.nurseUnitId = []
        if (this.nurseUnitList.length > 0) {
          for (let v of this.nurseUnitList.values()) {
            this.search.nurseUnitId.push(v.deptId)
          }
        }
      }
      this.queryHandler()
    }
  }
}
</script>
<style lang='scss'>
  .query-area{
    .el-select .el-tag{
      max-width: 70%;
    }
    .el-select .el-tag__close.el-icon-close{
      display: none;
    }
  }
</style>
<style scoped lang='scss'>
.el-select-dropdown__item{
  width: 260px;
}

.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  right: 10px;
}
</style>
