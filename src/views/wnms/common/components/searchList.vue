<template>
  <!-- 查询条件 -->
  <div class="btn-group">
    <el-form :inline="true" class="demo-form-inline query-area">
      <!-- <el-form-item label="护理单元:">
        <el-select
          :multiple="multiple"
          v-model="search.nurseUnitId"
          :collapse-tags="true"
          placeholder="全部"
        >
          <el-option v-if="!multiple" value>全部</el-option>
          <el-option
            v-for="item in nurseUnit"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>-->
      <el-form-item :label="title">
        <el-date-picker
          v-model="search.beginTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="开始日期"
        ></el-date-picker>
        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
        <el-date-picker
          v-model="search.endTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="结束日期"
        ></el-date-picker>
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
          <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getOneDate } from '@/assets/wnms/utils/dateFormat'
import { selectDeptInfo } from '@/assets/wnms/utils/common'
import { deepMerge } from '@/assets/wnms/utils'
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
    title: {
      type: String,
      default: () => {
        return '统计时间'
      }
    },
    defaultTime: {
      type: Boolean,
      default: true
    }
  },
  data () {
    const search = this.initQueryCriteria()
    return {
      search: search,
      userDataDepts: []
    }
  },

  mounted () {
    this.queryHandler()
  },
  methods: {
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      const [beginTime, endTime] =
        this.defaultTime === true ? getOneDate('month', this.nums) : []
      return deepMerge(form, {
        beginTime: beginTime,
        endTime: endTime,
        nurseUnitId: selectDeptInfo()
      })
    },
    queryHandler () {
      if (this.search.beginTime === null || this.search.endTime === null) {
        this.$message({
          type: 'info',
          message: '统计时间不能为空!'
        })
        return false
      }

      this.$emit('unitSearch', this.search)
    },
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.queryHandler()
    }
  }
}
</script>
