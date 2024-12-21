<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_from" ref="search_form">
        <el-form-item label="科室" prop="deptId">
          <TreeSelect
            placeholder="全部"
            v-model="search_from.deptId"
            :multiple="false"
            :options="tree_nurse_data"
            noChildrenText="无子节点"
            appendToBody
            :defaultExpandLevel="9"
          />
        </el-form-item>
        <el-form-item prop="labelName" label="标签名称">
          <el-input
            v-model="search_from.labelName"
            placeholder=""
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
          >搜索
          </el-button>
          <el-button type="text" @click="resetForm()"
          >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" icon="el-icon-plus" @click="labelAdd(null)"
      >添加
      </el-button>
    </div>
    <div slot="right_btn" class="tool-bar">
      <el-button type="primary" @click="labelMultiUse(null)"
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
          width="100"
        ></el-table-column>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column
          prop="labelName"
          label="标签名称"
          min-width="80"
          align="center"
        ></el-table-column>
        <el-table-column prop="inputType" align="center" label="手工输入" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.inputType === 1 ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="relationWarn"
          label="关联消息分类"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="labelSql"
          label="脚本内容"
          min-width="80"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="labelUse(scope.row)" type="text"
            >应用
            </el-button>
            <el-button @click="labelAdd(scope.row)" type="text"
            >编辑
            </el-button>
            <el-button type="textred" @click="labelDelete(scope.row)"
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
        :page-size="search_from.size"
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
            <div>该标签已应用在以下科室，无法进行删除：</div>
            <div>
              <div>xxxx科室</div>
              <div>xxxx科室</div>
              <div>xxxx科室</div>
              <div>xxxx科室</div>
            </div>
            <div>请先取消标签在科室应用，再进删除操作！</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="delete_visible = false">关闭</el-button>
        </div>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Label2Nurse from '../Label2Nurse'
import layout from '../../../../components/bnms/layout/list'
import item_config from '../../../../assets/bnms/common/item_config'
import { ApiPatientManage, ApiDept } from '../../../../api/bnms/index'

export default {
  name: 'remind_list',
  data () {
    return {
      item_config,
      loading: false,
      page_current: 1,
      page_total: 0,
      label_data: [],
      delete_visible: false,
      // 标签应用
      label2nurse_visible: false,
      label2nurse_data: [],
      current_labelcode: [],
      nurse_data: [],
      tree_nurse_data: [],
      // 搜索表单
      search_from: {
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
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptId = deptInfo.deptId || ''
    // //1 获取护理单元
    // this.getDeptData();
    // //2 获取标签
    // this.getLabelData();
  },
  activated () {
    // 1 获取护理单元
    this.getDeptData()
    // 2 获取标签
    this.getLabelData()
  },
  methods: {
    getLabelData () {
      this.loading = true
      ApiPatientManage.select(this.search_from)
        .then(res => {
          res.data = res.data || { list: [], total: 0 }
          this.label_data = res.data.list.map(v => {
            if (v.labelShowInfo) {
              let info = JSON.parse(v.labelShowInfo)
              v.labelDisplayType = info.style
              v.labelDisplayTypeValue = this.item_config.labelDisplayType[
                info.style
              ]
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
      if (this.multipleSelection.length == 0) {
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
      this.labelDelete(row)
    },
    labelDeletConfirm (row) {
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.labelDeletDo(row)
      })
    },
    labelDeletDo (row) {
      ApiPatientManage.delete({ labelId: row.labelId })
        .then(res => {
          if (res.data == 1) {
            this.labelDeletConfirm(row)
          } else {
            this.$message.success('删除成功！')
            this.getLabelData()
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
      this.search_from.size = val
      this.getLabelData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_from.page = val
      this.getLabelData()
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
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
