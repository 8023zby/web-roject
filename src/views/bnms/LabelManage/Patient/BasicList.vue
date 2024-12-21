<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form v-uni="'huanzhebiaoqianshaixuanbiaodan'" :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item label="已应用科室" prop="deptId">
          <TreeSelect
            placeholder="请选择"
            v-model="search_form.deptId"
            :multiple="false"
            :options="tree_nurse_data"
            noOptionsText="无可选项"
            noChildrenText="无子节点"
            noResultsText="无匹配结果"
            appendToBody
            :defaultExpandLevel="9"
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
            v-uni="'huanzhebiaoqian_search'"
          >搜索
          </el-button>
          <el-button type="text" v-uni="'huanzhebiaoqian_reset'" @click="resetForm()"
          >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" icon="el-icon-plus"  v-uni="'huanzhebiaoqian_add'" @click="labelAdd(null)" v-checkAuth="'add'"
      >添加
      </el-button>
    </div>
    <div slot="right_btn" class="tool-bar">
      <el-button type="primary" v-uni="'huanzhebiaoqian_someUse'" @click="labelMultiUse(null)" v-checkAuth="'multi_userd'"
      >批量应用
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
      >
        <el-table-column
          type="selection"
          reserve-selection
          align="center"
          width="54"
        ></el-table-column>
        <!-- <el-table-column type="index" label="序号" width="100">
          <template scope="scope">
            <span>{{(search_form.page - 1) * search_form.size + (scope.$index + 1)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="labelName"
          label="标签名称"
          min-width="100"
        ></el-table-column>
        <el-table-column prop="inputType" label="手工输入" width="100">
          <template slot-scope="scope">
            {{ scope.row.inputType === 1 ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="labelSql"
          label="字段名称"
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="labelDisplayTypeValue"
          label="字段类型"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="labelShowInfo"
          label="配置项"
          min-width="100"
        >
          <template slot-scope="scope">
            <span v-html="configItem(scope.row.labelShowInfo)"></span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="220" v-if="checkAuth('edit,delete,userd')">
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.labelId]="'huanzhebiaoqian_using'" :key="'using' + scope.row.labelId" @click="labelUse(scope.row)" type="text" v-checkAuth="'userd'"
            >应用
            </el-button>
            <el-button v-uni:[scope.row.labelId]="'huanzhebiaoqian_edit'" :key="'edit' + scope.row.labelId" @click="labelAdd(scope.row)" type="text" v-checkAuth="'edit'"
            >编辑
            </el-button>
            <el-button v-uni:[scope.row.labelId]="'huanzhebiaoqian_delete'" :key="'delete' + scope.row.labelId" type="textred" @click="labelDelete(scope.row)" v-checkAuth="'delete'" :disabled="scope.row.isInitialize === 1 ? true : false"
            >删除
            </el-button>
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
    <template solt>
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
              <div v-for="(name,index) in delete_used_depts" :key="index">{{name}}</div>
            </div>
            <div>请先取消标签在科室应用，再进删除操作！</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button v-uni="'huanzhebiaoqiantanchuang_cancel'" type="primary" @click="delete_visible = false">关闭</el-button>
        </div>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import moduleMixin from '../../../../assets/bnms/mixins/moduleMixin'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Label2Nurse from '../Label2Nurse'
import layout from '../../../../components/bnms/layout/list'
import item_config from '../../../../assets/bnms/common/item_config'
import { ApiPatientManage, ApiDept } from '../../../../api/bnms'

export default {
  name: 'basic_list',
  mixins: [moduleMixin],
  data () {
    return {
      item_config,
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
        labelType: '301',
        deptId: null,
        labelName: '',
        size: 10,
        page: 1
      },
      // table多选结果
      multipleSelection: []
    }
  },
  created () {
    this.loading = true
    this.getDeptData()
  },
  activated () {
    this.getLabelData()
  },
  methods: {
    getLabelData () {
      ApiPatientManage.select(this.search_form)
        .then(res => {
          res.data = res.data || { list: [], total: 0 }
          this.label_data = res.data.list.map(v => {
            if (v.labelShowInfo) {
              let info = JSON.parse(v.labelShowInfo)
              v.labelDisplayType = info.style
              v.labelDisplayTypeValue = this.item_config.labelDisplayType[info.style]
              v.labelShowInfo =
                  info.item && info.item.length > 0
                    ? JSON.stringify(info.item)
                    : ''
            }
            return v
          })
          this.page_total = res.data.total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    getDeptData () {
      this.nurse_data = []
      ApiDept.select().then(res => {
        this.nurse_data = res.data.list
        let dept = res.data.list
        this.nurse_data = dept // this.getNurseDataDept(dept);
        let temp = JSON.stringify(res.data.list)
        temp = temp
          .replace(/deptId/g, 'id')
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
        showClose: false,
        customClass: 'yh-message-box'
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
      ApiPatientManage.selectApplyDept({ labelId: row.labelId }).then(res => {
        this.label2nurse_data = res.data
        this.current_labelcode = [row.labelId]
        this.label2nurse_visible = true
      })
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
        ApiPatientManage.delete({ labelId: this.curDeleteRow.labelId })
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
      ApiPatientManage.deleteBefore({ labelId: this.curDeleteRow.labelId })
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
    },
    configItem: function (labelShowInfo) {
      const info = labelShowInfo ? JSON.parse(labelShowInfo) : null
      if (!info || !info[0].config) return ''

      let html = ''
      for (let i = 0; i < info.length; i++) {
        let _d = info[i]
        html += "<span style='display:inline-block; padding:0 2px; margin:2px 5px; color:" + (_d.config['fontColor'] || '#000') + '; background-color: ' + (_d.config['backGroundColor'] || 'transparent') + "'>" + (_d.name || '/') + '</span>'
      }

      return html
    }
  },
  components: {
    Label2Nurse,
    TreeSelect,
    layout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/bnms/css/self_common";
</style>
