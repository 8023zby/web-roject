<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form v-uni="'weijizhishezhi_searchform'" :inline="true" :model="search_form" ref="search_form" label-suffix="：">
        <el-form-item prop="inspectName" label="检查项目">
          <el-input
                  v-uni="'weijizhishezhi_jianchaxiangmu'"
            clearable
            v-model="search_form.inspectName"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="criticalValue" label="危急值">
          <el-input
                  v-uni="'weijizhishezhi_weijizhi'"
            clearable
            v-model="search_form.criticalValue"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="enable" label="启用状态">
          <el-select v-uni="'weijizhishezhi_qiyongzhuangtai'" v-model="search_form.enable" filterable clearable placeholder="全部">
            <el-option
              label="停用"
              :value="false">
            </el-option>
            <el-option
              label="启用"
              :value="true">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
                  v-uni="'weijizhishezhi_jianchasearch'"
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
          >搜索
          </el-button
          >
          <el-button type="text" @click="resetForm()"
          v-uni="'weijizhishezhi_jianchareset'"
          >重置
          </el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <el-button v-uni="'weijizhishezhi_jianchaadd'" type="warning" icon="el-icon-plus" @click="inspectAdd(null)" v-checkAuth="'addInspect'"
      >添加
      </el-button
      >
    </div>

    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        ref="table"
        :data="table_data"
        stripe
        highlight-current-row
        @selection-change="handleTableSelectionChange"
        height="100%"
      >
        <el-table-column type="selection" align="center" width="70"></el-table-column>
        <!-- <el-table-column type="index" align="center" label="序号" width="90">
          <template scope="scope">
            <span>{{(search_form.page - 1) * search_form.size + (scope.$index + 1)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="inspectName" label="检查项目" align="center">
        </el-table-column>
        <el-table-column prop="criticalValue" label="危急值" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.criticalValue | criticalValue}}
          </template>
        </el-table-column>
        <el-table-column prop="inspectMeasures" label="临床意义及措施" align="center" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.inspectMeasures.length > 500 ? (scope.row.inspectMeasures.substr(0, 500) + '...') :
            scope.row.inspectMeasures}}
          </template>
        </el-table-column>
        <el-table-column prop="isEnable" label="启用状态" min-width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.isEnable == 1 ? '启用' : '停用' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center" v-if="checkAuth('addInspect,editInspect,deleteInspect')">
          <template slot-scope="scope">
            <el-button @click="inspectAdd(scope.row)" type="text" size="small" v-checkAuth="'editInspect'"
              v-uni:[scope.row.inspectSetId]="'weijizhishezhi_jianchaedit'"
              :key="'edit' + scope.row.inspectSetId"
            >编辑
            </el-button
            >
            <el-button
              v-checkAuth="'deleteInspect'"
              type="textred"
              size="small"
              v-uni:[scope.row.inspectSetId]="'weijizhishezhi_jianchadelete'"
              :key="'delete' + scope.row.inspectSetId"
              @click="inspectDelete(scope.row)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
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
import moduleMixin from '../../../assets/nrms/mixins/moduleMixin'
import layout from '../../../components/nrms/layout/list'
import { ApiCriticalValueInspect } from '../../../api/nrms/index'

export default {
  name: 'critical_value_inspect_list',
  mixins: [moduleMixin],
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 0,
      table_data: [],
      // 搜索表单
      search_form: {
        deptId: null,
        criticalValue: '',
        inspectName: '',
        enable: null,
        size: 10,
        page: 1
      },
      // table多选结果
      multipleSelection: []
    }
  },
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptId = deptInfo.deptId || ''
     this.getData()
  },
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      ApiCriticalValueInspect.select(this.search_form)
        .then(res => {
          res.data = res.data || { list: [], total: 0 }

          let _data = res.data.list || []

          this.table_data = _data
          this.page_total = res.data.total || 0
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    searchForm () {
      this.handleCurrentChange(1)
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    inspectAdd (row) {
      this.$emit('changed', 'add1', row)
    },
    inspectDelete (row) {
      this.$confirm('确认要删除该数据？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiCriticalValueInspect.delete({ setId: row.inspectSetId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    getRowKeys (row) {
      return row.inspectSetId
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getData()
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  components: {
    layout
  },
  filters: {
    criticalValue (val = []) {
      let arr = []
      for (let i = 0; i < val.length; i++) {
        arr.push(val[i].value)
      }
      const str = arr.join(',')
      return str.length > 500 ? (str.split(0, 500) + '...') : str
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    @import "../../../assets/nrms/css/self_common";
</style>
