<template>
  <layout v-loading="loading">
    <!-- 查询条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item label="计划执行日期">
          <el-date-picker
            v-uni="'yizhuxinxi_jihuazhixingriqi'"
            v-model="search_form.planExecuteDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            :clearable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="类型">
          <el-select
            v-uni="'yizhuxinxi_leixing'"
            v-model="search_form.typeId "
            placeholder="全部"
            clearable
            autocomplete="off"
          >
            <!-- <el-option label="全部" value=""></el-option> -->
            <el-option v-for="(item,index) in janeTypeData" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类">
          <el-select
            v-uni="'yizhuxinxi_fenlei'"
            v-model="search_form.classifyId"
            placeholder="全部"
            clearable
            autocomplete="off"
          >
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in janeClassificationData" :key="index" :label="item.classifyName" :value="item.classifyId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-uni="'yizhuxinxi_zhuangtai'"
            v-model="search_form.executeStatus"
            placeholder="全部"
            clearable
            autocomplete="off"
          >
            <el-option label="全部" :value="null"></el-option>
            <el-option label="未执行" :value="0"></el-option>
            <el-option label="已执行" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-uni="'yizhuxinxi_search'" type="primary" icon="el-icon-search" @click="searchForm()">搜索</el-button>
          <el-button v-uni="'yizhuxinxi_reset'" type="text" @click="resetForm()" style="margin-left: 0;">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        ref="table"
        :data="table_data"
        :row-key="getRowKeys"
        stripe
        highlight-current-row
        height="100%"
      >
        <template v-for="(item,index) in fieldsList">
          <el-table-column
          :key="index"
          :prop="item.field"
          :label="item.fieldName"
          v-if="item.ifShow === 1"
          align="center"
          :width="item.columnWidth"
          :fixed="item.field === 'field20' ? 'right' : false"
          >
            <template slot-scope="scope" >
              <template v-if="item.field === 'field20'">
                <el-button @click="adviceToCancelDo(scope.row)" type="text" :disabled="btn_disable" v-if="scope.row.field20 === 1 || scope.row.field20 === '1'">取消执行</el-button>

                <el-button @click="adviceToCancelDo(scope.row)" type="text" :disabled="btn_disable" v-else>执行</el-button>
              </template>
              <template v-else>
                {{ scope.row[item.field] }}
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page_current"
        :page-size="search_form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
      >
      </el-pagination>
    </div>
  </layout>
</template>

<script>

import moment from 'moment'
import { janeDoctorsAdvice } from '../../../api/dams/index'
import layout from '../../../components/dams/layout/list'

export default {
  name: 'janeVsersionList',
  components: { layout },
  data () {
    return {
      fieldsList: [],
      janeTypeData: [],
      janeClassificationData: [],
      loading: false,
      pages: 1,
      page_current: 1,
      page_total: 1,
      table_data: [],
      // 查询表单
      search_form: {
        patientId: '',
        planExecuteDate: moment().format('YYYY-MM-DD HH:mm:ss'), // [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        typeId: '5',
        classifyId: '',
        executeStatus: null,
        page: 1,
        size: 10
      }
    }
  },
  props: ['patient', 'patientType'],
  computed: {
    btn_disable: function () {
      // 出院 || 转科
      if ((this.patientType === 2) || this.patientType === 1) {
        return true
      }
      return false
    }
  },
  created () {
    this.getFields()
    this.getType()
    this.getClassification()
  },
  activated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })

    this.getFields()
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()

      // 隐藏不能操作的checkbox
      let checkbox = this.$refs.table.$el.querySelectorAll('td.el-table-column--selection .el-checkbox.is-disabled')
      for (let i = 0; i < checkbox.length; i++) {
        checkbox[i].style.display = 'none'
      }
    })
  },
  methods: {
    getType () { // 获取类型
      janeDoctorsAdvice.janeType().then(res => {
        const data = res.data || []
        this.janeTypeData = data
        this.janeTypeData.unshift({
          typeName: '全部',
          typeId: '5'
        })
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    getClassification () { // 获取分类
      janeDoctorsAdvice.janeClassification().then(res => {
        const data = res.data || []
        this.janeClassificationData = data
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    getFields () { // 获取医嘱字段
      janeDoctorsAdvice.janeFieldsList().then(res => {
        const data = res.data || []
        this.fieldsList = data
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    getData () { // 获取医嘱列表
      this.loading = true
      const search_form = JSON.parse(JSON.stringify(this.search_form))

      janeDoctorsAdvice.janeList(search_form).then(res => {
        const data = res.data || []

        this.table_data = data.list
        this.page_total = data.total
        this.loading = false
      }).catch(res => {
        this.$message.error(res.message)
        this.loading = false
      })
    },
    searchForm () {
      if (!this.hasPatient()) {
        return false
      }
      this.getData()
    },
    resetForm () {
      if (!this.hasPatient()) {
        return false
      }
      // this.$refs.search_form.resetFields()
      this.search_form = {
        patientId: this.patient.patientId,
        planExecuteDate: moment().format('YYYY-MM-DD HH:mm:ss'), // [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        typeId: '',
        classifyId: '',
        executeStatus: '',
        page: 1,
        size: 10
      }

      this.handleCurrentChange(1)
    },
    adviceToCancelDo (row) { // 取消执行或者执行
      let _status = 0
      let _showName = ''
      if (row.field20 === 1 || row.field20 === '1') {
        _status = 0
        _showName = '取消执行'
      } else {
        _status = 1
        _showName = '执行'
      }

      let _con = {
        id: row.id,
        executeStatus: _status
      }
      this.$confirm('确认' + _showName + '？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        janeDoctorsAdvice.cancelToDo(_con)
          .then(() => {
            this.$message.success(_showName + '成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    getRowKeys (row) {
      return row.id
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getData()
    },
    hasPatient () {
      if (!this.patient.patientId) {
        this.$message.warning('请先选择患者！')
        return false
      }
      return true
    }
  },
  watch: {
    patient (val) {
      this.search_form.patientId = this.patient.patientId

      this.getFields()
      this.handleCurrentChange(1)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";

  .query-items{
    .to{
      display: inline-block;
      line-height: 32px;
      margin: 12px 0;
    }
  }
  .noDataStyle{
    background: #b5b5b5 !important;
    border-color: #b5b5b5 !important;
  }
  /deep/.medicalItemName {
    padding: 0 !important;
    .cell {
      height: 100%;
      overflow: auto;
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 20px;
    }
  }
  .top_line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 50%;
    width: 8px;
    border-left: 1px solid #E8E8E8;
    border-top: 1px solid #E8E8E8;
  }
  .middle_line {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 8px;
    border-left: 1px solid #E8E8E8;
  }
  .bottom_line {
    position: absolute;
    top: 0;
    left: 0;
    height: 50%;
    width: 8px;
    border-left: 1px solid #E8E8E8;
    border-bottom: 1px solid #E8E8E8;
  }
</style>
