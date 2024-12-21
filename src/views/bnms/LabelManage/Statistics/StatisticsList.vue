<template>
  <layout-aside>
    <div slot="aside">
      <class-tree @changed="setClassId"></class-tree>
    </div>
    <layout slot="main" v-loading="loading">
      <!-- 搜索条件 -->
      <div slot="query" class="query-items">
        <el-form v-uni="'tongjibiaoqianshaixuanbiaodan'" :inline="true" :model="search_form" ref="search_form" label-suffix=":">
          <el-form-item label="已应用科室" prop="deptId">
            <TreeSelect
              placeholder="请选择"
              v-model="search_form.deptId"
              :multiple="false"
              :options="tree_nurse_data"
              :defaultExpandLevel="9"
              appendToBody
              noOptionsText="无可选项"
              noChildrenText="无子节点"
              noResultsText="无匹配结果"
            />
          </el-form-item>
          <el-form-item prop="labelName" label="标签名称">
            <el-input
              v-model="search_form.labelName"
              placeholder="请输入"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchForm()"
              v-uni="'tongjibiaoqian_search'"
            >
              搜索
            </el-button>
            <el-button v-uni="'tongjibiaoqian_reset'" type="text" @click="resetForm()">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 操作按钮 -->
      <div slot="left_btn" class="tool-bar">
        <el-button v-uni="'tongjibiaoqian_add'" type="warning" icon="el-icon-plus" @click="labelAdd(null)" v-checkAuth="'addStatisticsLabel'">
          添加
        </el-button>
      </div>
      <div slot="right_btn" class="tool-bar">
        <el-button  v-uni="'tongjibiaoqian_someUse'" type="primary" @click="labelMultiUse(null)" v-checkAuth="'multiUsedStatisticsLabel'">
          批量应用
        </el-button>
      </div>

      <!-- 表格 -->
      <div slot="main" class="main-list">
        <el-table
          ref="table"
          :data="label_data"
          :row-key="getRowKeys"
          stripe
          highlight-current-row
          @selection-change="handleTableSelectionChange"
          height="100%"
          v-uni="'tongjibiaoqianliebiao'"
        >
          <el-table-column type="selection" align="center" reserve-selection width="70">
          </el-table-column>
          <!-- <el-table-column type="index" align="center" label="序号" width="90">
            <template slot-scope="scope">
              <span>{{(search_form.page - 1) * search_form.size + (scope.$index + 1)}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="className" label="标签分类" min-width="100" align="center">
          </el-table-column>
          <el-table-column prop="labelName" align="center" label="标签名称" min-width="200">
          </el-table-column>
          <el-table-column prop="labelSql" align="center" label="字段/脚本" min-width="300" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200" v-if="checkAuth('editStatisticsLabel,usdStatisticsLabel,deleteStatisticsLabel')">
            <template slot-scope="scope">
              <el-button @click="labelUse(scope.row)" type="text" size="small"
                         v-checkAuth="'usdStatisticsLabel'"
                         v-uni:[scope.row.labelId]="'tongjibiaoqian_using'"
                         :key="'using' + scope.row.labelId"
              >应用
              </el-button
              >
              <el-button @click="labelAdd(scope.row)" type="text" size="small"
                         v-checkAuth="'editStatisticsLabel'"
                         v-uni:[scope.row.labelId]="'tongjibiaoqian_edit'"
                         :key="'edit' + scope.row.labelId"
              >编辑
              </el-button
              >
              <el-button
                type="textred"
                size="small"
                @click="labelDelete(scope.row)"
                :disabled="scope.row.isInitialize === 1 ? true : false"
                v-checkAuth="'deleteStatisticsLabel'"
                v-uni:[scope.row.labelId]="'tongjibiaoqian_delete'"
                :key="'delete' + scope.row.labelId"
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

      <template slot>
        <!-- 标签应用到科室 -->
        <Label2Nurse
          ref="label2nurse"
          :visible.sync="label2nurse_visible"
          :init_checked="label2nurse_data"
          :nurse_data="nurse_data"
          :label_ids="current_labelcode"
        ></Label2Nurse>

        <el-dialog
          title="删除"
          :visible="delete_visible"
          :close-on-click-modal="false"
          :show-close="false"
          width="500px"
        >
          <div style="text-align: center">
            <div style="display: inline-block; text-align: left">
              <div>该标签已应用在以下科室，无法进行删除:</div>
              <div style="margin: 10px 0">
                <div v-for="name in delete_used_depts" :key="name">{{name}}</div>
              </div>
              <div>请先取消标签在科室应用，再进删除操作！</div>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button v-uni="'tongjibiaoqian_delete_cancel'" type="primary" @click="delete_visible = false">关闭</el-button>
          </div>
        </el-dialog>
      </template>
    </layout>
  </layout-aside>
</template>

<script>
import moduleMixin from '../../../../assets/bnms/mixins/moduleMixin'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Label2Nurse from '../Label2Nurse'
import classTree from './ClassTree'
import layoutAside from '../../../../components/bnms/layout/aside'
import layout from '../../../../components/bnms/layout/list'
import { ApiStatisticsManage, ApiDept, ApiClassifyManage } from '../../../../api/bnms'

export default {
  name: 'statistics_list',
  mixins: [moduleMixin],
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 0,
      label_data: [],
      delete_visible: false,
      delete_used_depts: [],
      curDeleteRow: {},
      // 标签应用
      label2nurse_visible: false,
      label2nurse_data: [],
      current_labelcode: [],
      nurse_data: [],
      tree_nurse_data: [],
      // 搜索表单
      search_form: {
        labelType: '101',
        deptId: null,
        labelName: '',
        classId: '',
        size: 10,
        page: 1
      },
      classify_data: [],
      // table多选结果
      multipleSelection: []
    }
  },
  created () {
    this.loading = true
    this.getClassify()
    this.getDeptData()
  },
  activated () {
    this.getLabelData()
  },
  methods: {
    getClassify () {
      Promise.all([ApiClassifyManage.select({ labelType: 101 }), this.ApiLabelData()])
        .then(res => {
          // 标识分类
          const classify = res[0].data || []
          let cObj = {}
          for (let i = 0; i < classify.length; i++) {
            cObj[classify[i].classId] = classify[i].className
          }
          this.classify_data = cObj

          this.parseLabelData(res[1])
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    setClassId (classId) {
      this.search_form.classId = classId || ''
      this.getLabelData()
    },
    ApiLabelData () {
      return ApiStatisticsManage.select(this.search_form)
    },
    getLabelData () {
      this.loading = true
      this.ApiLabelData()
        .then(res => {
          this.parseLabelData(res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    parseLabelData (res) {
      res.data = res.data || { list: [], total: 0 }
      let _data = res.data.list || []
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].classId) {
          let classIds = _data[i].classId.split(',')
          let classNames = []
          for (let z = 0; z < classIds.length; z++) {
            if (this.classify_data[classIds[z]]) classNames.push(this.classify_data[classIds[z]])
          }
          _data[i].className = classNames.join(',')
        }
      }

      this.label_data = _data

      this.page_total = res.data.total
    },
    getDeptData () {
      this.nurse_data = []
      ApiDept.select().then(res => {
        this.nurse_data = res.data.list
        let dept = res.data.list
        this.nurse_data = dept// this.getNurseDataDept(dept);
        let temp = JSON.stringify(res.data.list)
        temp = temp.replace(/deptId/g, 'id')
          .replace(/deptName/g, 'label')
          .replace(/,"children":null/g, '')
          .replace(/,"children":\[\]/g, '')
        this.tree_nurse_data = JSON.parse(temp)
      })
    },
    // 获取所有科室的deptId
    getNurseDataDept (data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        let _d = data[i]
        arr.push({
          deptId: _d['deptId'],
          deptName: _d['deptName']
        })
        if (data[i].children) {
          let a = this.getNurseDataDept(data[i].children)
          arr.push(...a)
        }
      }
      return arr
    },
    searchForm () {
      this.handleCurrentChange(1)
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    labelMultiUse () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择标签！')
        return false
      }
      this.label2nurse_data = []
      this.$confirm('批量应用需要更多的时间！需要您耐心等待~', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.label2nurse_data = []
        this.current_labelcode = []
        this.multipleSelection.forEach(v => {
          this.current_labelcode.push(v.labelId)
        })
        this.label2nurse_visible = true
      })
    },
    labelUse (row) {
      ApiStatisticsManage.selectApplyDept({ labelId: row.labelId }).then(
        res => {
          this.label2nurse_data = res.data
          this.current_labelcode = [row.labelId]
          this.label2nurse_visible = true
        }
      )
    },
    labelAdd (row) {
      this.$emit('changed', 'add', row)
    },
    labelDelete (row) {
      this.curDeleteRow = row
      this.labelDeleteBefore()
    },
    labelDeleteDo () {
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiStatisticsManage.delete({ labelId: this.curDeleteRow.labelId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getLabelData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    labelDeleteBefore () {
      ApiStatisticsManage.deleteBefore({ labelId: this.curDeleteRow.labelId })
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.delete_visible = true
            this.delete_used_depts = res.data
          } else {
            this.labelDeleteDo()
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    getRowKeys (row) {
      return row.labelId
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getLabelData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getLabelData()
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  components: {
    Label2Nurse,
    TreeSelect,
    layout,
    'layout-aside': layoutAside,
    'class-tree': classTree
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/bnms/css/self_common";
</style>
