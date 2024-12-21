<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form ref="search_form" :inline="true" :model="search_form" label-suffix=":">
        <el-form-item prop="signItemName" label="体征项名称">
          <el-input
            v-model="search_form.signItemName"
            placeholder="请输入"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            style="margin-top: 12px"
            @click="searchForm()"
          >
            搜索
          </el-button>
          <el-button type="text" @click="resetForm()">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        ref="table"
        :data="tableData"
        :row-key="getRowKeys"
        stripe
        highlight-current-row
        height="100%"
        @selection-change="handleTableSelectionChange"
      >
        <el-table-column type="selection" :selectable="handleSelectable" align="center" reserve-selection width="50" />
        <!-- <el-table-column type="index" align="center" label="序号" width="60">
          <template slot-scope="scope">
            <span>{{ (search_form.page - 1) * search_form.size + (scope.$index + 1) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="signClassifyName" label="所属分类" min-width="90" align="center" />
        <el-table-column prop="signItemName" align="center" label="体征项名称" min-width="100" />
        <el-table-column prop="signItemShowName" align="center" label="显示名称" min-width="90" />
        <el-table-column prop="signItemUnit" align="center" label="体征项单位" min-width="100" />
        <el-table-column prop="signItemFieldName" align="center" label="字段名称" min-width="90" />
        <el-table-column prop="signItemFieldType" align="center" label="字段类型" min-width="100">
          <template slot-scope="scope">
            {{ signConfig.sign_item_field_type[scope.row.signItemFieldType] || "" }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" align="center" show-overflow-tooltip label="备注" min-width="60" />
        <!--<el-table-column prop="labelSql" align="center" label="备注" min-width="200" show-overflow-tooltip>-->
        <!--</el-table-column>-->
      </el-table>

    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination
        style="text-align:center;"
        :current-page.sync="page_current"
        :page-size="search_form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- <template slot /> -->
  </layout>
</template>

<script>
import { sign as signConfig } from '../../../assets/nrms/common/item_config'
import layout from '../../../components/nrms/layout/list'
import { ApiTemperatureItemSetting, ApiSignItem } from '../../../api/nrms/index'
import { temperatureInitItem } from './temperatureConfig'
import { EFormType } from '../../../assets/nrms/enum/formManage'

export default {
  name: 'ImportItem',
  components: {
    layout
  },
  props: ['detail', 'selectedIds'],
  data () {
    return {
      signConfig,
      loading: false,
      page_current: 1,
      page_total: 0,
      tableData: [],
      formType: '',
      // 搜索表单
      search_form: {
        deptId: null,
        signItemName: '',
        size: 10,
        page: 1
      },
      temperatureInitItem,
      // table多选结果
      multipleSelection: [],
      importParams: {
        formType: this.detail.formType,
        formId: this.detail.formId,
        addSignIds: [],
        subSignIds: []
      }
    }
  },
  created () {
    this.formType = this.detail.formType
    const deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptId = deptInfo.deptId || ''
    this.getData()
  },
  mounted () {
    // 挂载页面后先加载table复选框值
    for (let i = 0; i < this.selectedIds.length; i++) {
      const _d = this.selectedIds[i]
      this.$refs.table.toggleRowSelection({ signId: _d }, true)
    }
  },
  methods: {
    getData () {
      this.loading = true
      let http = null
      if (this.formType == EFormType.bodyCondition) {
        this.search_form.signClassifyId = 5
        http = ApiSignItem.select(this.search_form)
      } else if (this.formType == EFormType.inOut) {
        this.search_form.signClassifyId = 3
        http = ApiSignItem.select(this.search_form)
      } else {
        http = ApiTemperatureItemSetting.selectItem(this.search_form)
      }
      http
        .then(res => {
          const _data = res.data || { list: [], total: 0 }
          this.tableData = _data.list
          this.page_total = _data.total || 0
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    import () {
      const multiIds = [] // 本次选中的
      const addIds = [] // 本次新增
      const subIds = [] // 上次导入，这次不在本次选中结果集中的
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const row = this.multipleSelection[i]
        multiIds.push(row.signId)
        if (!this.selectedIds.includes(row.signId)) {
          addIds.push(row.signId)
        }
      }
      for (let i = 0; i < this.selectedIds.length; i++) {
        const id = this.selectedIds[i]
        if (!multiIds.includes(id)) {
          subIds.push(id)
        }
      }
      // this.importParams.addSignIds = addIds
      this.importParams.subSignIds = subIds

      // 增加对于体围单单次导入数量的限制==限制20条
      if (this.formType == EFormType.bodyCondition) {
        if (addIds.length <= 20) {
          this.importParams.addSignIds = addIds
        } else {
          this.$message.warning('一次最多导入20个体征数据！')
          return false
        }
      } else {
        this.importParams.addSignIds = addIds
      }

      this.loading = true
      ApiTemperatureItemSetting.importItem(this.importParams)
        .then(() => {
          this.$emit('refresh')
          this.$message.success('导入成功！')
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
    getRowKeys (row) {
      return row.signId
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
    },
    handleSelectable (row) {
      // 体温 脉搏 心率 疼痛等级 呼吸 血压 收缩压 舒张压 是默认初始化项，不能取消复选
      const initItem = this.temperatureInitItem[this.detail.formRelationStyle] || []
      return !initItem.includes(row['signItemFieldName'])
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
  /deep/.el-pagination .el-select .el-input {
    width: 100px !important;
  }
</style>
