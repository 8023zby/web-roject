<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form v-uni="'jianyanxiangmu_importform'" ref="search_form" :inline="true" :model="search_form">
        <el-form-item label="检验类型:" prop="crisisClassId" style="margin-left:0px">
          <el-select
                  v-uni="'jianyanxiangmu_jianyanleixing'"
                  v-model="search_form.crisisClassId"
                  placeholder="请选择"
                  autocomplete="off"
                  clearable
          >
            <el-option
                    v-for="(item, key) in examineType"
                    :label="item.classValue"
                    :value="item.crisisClassId"
                    :key="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="crisisChildName" label="检验子项目名称:" style="margin-left:0px">
          <el-input
                  v-uni="'jianyanxiangmu_jianyanzixiangmumingcheng'"
            v-model="search_form.crisisChildName"
            placeholder="请输入"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item style="margin-left:0px">
          <el-button
                  v-uni="'jianyanxiangmu_search'"
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
          >
            搜索
          </el-button>
          <el-button v-uni="'jianyanxiangmu_reset'" type="text" @click="resetForm()">
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
        <el-table-column type="selection" align="center" reserve-selection width="50" />
        <el-table-column type="index" align="center" label="序号" width="60">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="classValue" label="检验类型" min-width="90" align="center" />
        <el-table-column prop="crisisChildName" align="center" label="项目名称" min-width="100" />
        <el-table-column prop="crisisChildEnName" align="center" label="英文缩写" min-width="90" />
        <el-table-column prop="crisisChildShowName" align="center" label="显示名称" min-width="100" />
        <el-table-column prop="crisisChildUnit" align="center" label="单位" min-width="90" />
      </el-table>

    </div>

    <!-- <template slot /> -->
  </layout>
</template>

<script>
import layout from '../../../components/nrms/layout/list'
import { ApiChildDangerDictionary, ApiDangerClassify } from '../../../api/nrms/index'

export default {
  name: 'ImportItem',
  components: {
    layout
  },
  props: ['selectedIds'],
  data () {
    return {
      loading: false,
      tableData: [],
      formType: '',
      // 搜索表单
      search_form: {
        crisisChildCode: '',
        crisisChildName: '',
        crisisClassId: ''
      },
      examineType: [],
      // temperatureInitItem,
      // table多选结果
      multipleSelection: [],
      importParams: {
        addSignIds: [],
        subSignIds: []
      }
    }
  },
  created () {
    this.getData()
    this.getExamineTypeData()
  },
  mounted () {
    // 挂载页面后先加载table复选框值
    for (let i = 0; i < this.selectedIds.length; i++) {
      const _d = this.selectedIds[i]
      this.$refs.table.toggleRowSelection({ crisisChildDictId: _d }, true)
    }
  },
  methods: {
    // 获取检验类型
    getExamineTypeData () {
      ApiDangerClassify.select({ classValue: '', classType: 2 }).then(res => {
        this.examineType = res.data || []
      })
    },
    getData () {
      this.loading = true
      ApiChildDangerDictionary.select(this.search_form).then(res => {
        const _data = res.data || []
        this.tableData = _data
        this.loading = false
      })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    import () {
      const multiIds = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const row = this.multipleSelection[i]
        multiIds.push(row.crisisChildDictId)
      }
      this.$emit('option-changed', multiIds.join(','))
    },
    searchForm () {
      this.getData()
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.getData()
    },
    getRowKeys (row) {
      return row.crisisChildDictId
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
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
