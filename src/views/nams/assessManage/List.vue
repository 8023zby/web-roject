<template>

  <layout>

    <!-- 搜索条件 -start-->
    <div slot="query"
         class="query-items">
      <el-form :inline="true"
               :model="search_from"
               ref="search_form">

        <el-form-item label="评估名称:"
                      prop="assName">
          <el-input v-model="search_from.assName"
                    placeholder="请输入"
                    clearable/>
        </el-form-item>

        &nbsp;&nbsp;

        <el-form-item label="应用病区:"
                      prop="depId">
          <TreeSelect
            placeholder="全部"
            v-model="search_from.depId"
            :multiple="false"
            :options="tree_nurse_data"
            noChildrenText="无子节点"
            appendToBody
            :defaultExpandLevel="9"/>
        </el-form-item>

        <el-form-item>
          <div class="typt-search-btn"
               style="margin-left: 30px;">
            <el-button type="primary"
                       class="el-button-radius"
                       icon="el-icon-search"
                       @click="searchForm"
                       size="small">搜索
            </el-button>
            <el-button type="text"
                       @click="resetForm">重置
            </el-button>
          </div>
        </el-form-item>

      </el-form>
    </div>
    <!-- 搜索条件 -end-->

    <!-- 操作按钮 -start-->
    <div slot="left_btn" class="tool-bar">

      <el-button type="warning"
                 size="small"
                 @click="add(null)"
                 icon="el-icon-plus">添加
      </el-button>

    </div>

    <div slot="right_btn" class="tool-bar">

      <el-button type="primary"
                 size="small"
                 @click="getOrder">排序
      </el-button>
      <el-button type="primary"
                 size="small"
                 @click="labelMultiUse">批量应用
      </el-button>

    </div>
    <!-- 操作按钮 -end-->

    <!-- 表格 -start-->
    <div slot="main" class="main-list">

      <el-table
        :data="tableData"
        :stripe="true"
        v-loading="loading"
        height="100%"
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
      >
        <el-table-column type="selection"
                         width="60"
                         reserve-selection
                         align="center"/>
        <el-table-column width="100" prop="userName" label="序号" align="center">
          <template slot-scope="scope">
            <span>{{(pageInfo.page_current - 1) * pageInfo.page_size + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="assCode" label="表单编号" align="center"/>
        <el-table-column prop="assName" label="评估名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="tl">{{scope.row.assName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="assRemarks" label="简介" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="tl">{{scope.row.assRemarks}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="empName" label="操作" align="center">

          <template slot-scope="scope">
            <!--<el-button-->
              <!--@click="previewData(scope.row)"-->
              <!--type="text"-->
              <!--size="medium"-->
            <!--&gt;预览-->
            <!--</el-button>-->
            &nbsp;&nbsp;
            <el-button
              @click="editData(scope.row)"
              type="text"
              size="medium"
            >编辑
            </el-button>
            &nbsp;&nbsp;
            <el-button
              @click="deleteData(scope.row)"
              type="textred"
              size="medium"
            >删除
            </el-button>
          </template>

        </el-table-column>

      </el-table>

    </div>
    <!-- 表格 -end-->

    <!-- 分页 -start-->
    <div slot="footer" class="page-bar">

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageInfo.page_current"
        :page-sizes="pageInfo.page_sizes"
        :page-size="pageInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.page_total"
      >
      </el-pagination>

    </div>
    <!-- 分页 -end-->

    <template solt>

      <!-- 批量应用 -start-->
      <Label2Nurse
        ref="label2nurse"
        @option-changed="optionChangeHandler"
        :visible.sync="label2nurse_visible"
        :init_checked="label2nurse_data"
        :nurse_data="nurse_data"
        :label_ids="current_labelcode"/>
      <!-- 批量应用 -end-->

      <!-- 排序 -start-->
      <el-dialog class="iframe"
                 title="排序"
                 :visible.sync="isShowSort"
                 width="800px"
                 :close-on-click-modal="false"
                 @close="refresh">

        <div class="typt-list-container">
          <!--列表-->
          <el-table
            :data="sortData"
            :stripe="false"
            v-loading="loading"
            height="100%">
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="100">
            </el-table-column>
            <el-table-column
              align="center"
              prop="assName"
              label="评估名称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="400">
              <template slot-scope="scope">
                <el-button type="text" @click="topDo(scope.row, scope.$index)">置顶</el-button>
                <el-button type="text" @click="upDo(scope.row, scope.$index)">上移</el-button>
                <el-button type="text" @click="downDo(scope.row, scope.$index)">下移</el-button><!--color: #F56C6C-->
                <el-button type="text" @click="btmDo(scope.row, scope.$index)">置底</el-button>
                <el-button type="text" @click="customDo(scope.row, scope.$index)">指定位置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-dialog>
      <!-- 排序 -end-->

    </template>

  </layout>

</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Label2Nurse from './Label2Nurse'
import layout from '../../../components/nams/layout/list'
import { ApiAssessManage, ApiDept } from '../../../api/nams/index'

export default {
  name: 'list',
  components: {
    Label2Nurse,
    TreeSelect,
    layout
  },
  data () {
    return {
      loading: false,
      pageInfo: {
        page_current: 1,
        page_total: 0,
        page_sizes: [10, 30, 50, 100],
        page_size: 10
      },
      // 表格数据
      tableData: [],
      // 排序数据
      sortData: [],
      // 是否展示排序
      isShowSort: false,
      search_from: {
        assName: '',
        depId: null,
        size: 10,
        page: 1
      },
      // 多选结果
      multipleSelection: [],
      // 标签应用
      label2nurse_visible: false,
      label2nurse_data: [],
      current_labelcode: [],
      nurse_data: [],
      tree_nurse_data: []
    }
  },
  created () {
    this.getList()
    this.getDeptData()
  },
  activated () {

  },
  methods: {
    optionChangeHandler () {
      this.handleCurrentChange(1)
    },
    // 查询
    getList () {
      this.loading = true
      this.search_from.isMenus = '0,2,4'
      ApiAssessManage.select(this.search_from)
        .then(res => {
          if (res.status === 200) {
            let { data } = res
            let { list, total } = data
            this.tableData = list
            this.pageInfo.page_total = total
          }
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 获取科室
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
    // 搜索
    searchForm () {
      this.handleCurrentChange(1)
    },
    // 重置
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    //
    handleSizeChange (val) {
      this.pageInfo.page_size = this.search_from.size = val
      this.getList()
      // console.log(this.multipleSelection)
    },
    //
    handleCurrentChange (val) {
      this.pageInfo.page_current = this.search_from.page = val
      this.getList()
      // console.log(this.multipleSelection)
    },
    // 添加评估
    add (row) {
      this.$emit('changed', 'add2', row)
    },
    // 排序
    getOrder () {
      this.loading = true
      let param = {
        isMenus: '0,2,4'
      }
      ApiAssessManage.select(param)
        .then(res => {
          if (res.status === 200) {
            this.sortData = res.data
          }
          this.loading = false
          this.isShowSort = true
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 批量应用
    labelMultiUse () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择标签！')
        return false
      }
      this.label2nurse_data = []
      this.$confirm('批量应用需要更多的时间！需要您耐心等待~', '批量应用', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'yh-message-box'
      }).then(() => {
        this.current_labelcode = []
        this.multipleSelection.forEach(v => {
          // console.log(v);
          this.current_labelcode.push(v.assId)
        })
        this.label2nurse_visible = true
      })
    },
    // 获取row-key
    getRowKey (row) {
      return row.assId
    },
    // 多选赋值
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 预览
    previewData () {

    },
    // 编辑
    editData (row) {
      // console.log(row)
      if (row.deptId === '' || row.deptId === null || row.deptId === undefined) {

      } else {
        // this.$message.warning("已经应用到病区的评估单无法编辑！");
        // return false;
      }
      this.$emit('changed', 'add2', '', row)
    },
    // 删除
    deleteData (row) {
      if (row.deptId === '' || row.deptId === null || row.deptId === undefined) {

      } else {
        this.$message.warning('已经应用到病区的评估单无法删除！')
        return false
      }
      this.$confirm('是否确认删除？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        ApiAssessManage.delete({ assId: row.assId })
          .then((res) => {
            this.$message.success(res.desc)
            this.getList()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },

    /** ** 排序-start ****/
    // 上移
    upDo (item, index) {
      let num = index - 1
      if (num < 0) {
        this.$message.warning('已经是第一位了！')
        return
      }
      this.updateData(item, index, num)
    },
    // 下移
    downDo (item, index) {
      let num = index + 1
      if (num >= this.sortData.length) {
        this.$message.warning('已经是最后一位了！')
        return
      }
      this.updateData(item, index, num)
    },
    // 置顶
    topDo (item, index) {
      if (index === 0) {
        this.$message.warning('已经是第一位了！')
        return
      }
      this.updateData(item, index, 0)
    },
    // 置尾
    btmDo (item, index) {
      if (index === this.sortData.length - 1) {
        this.$message.warning('已经是最后一位了！')
        return
      }
      this.updateData(item, index, this.sortData.length - 1)
    },
    // 指定
    customDo (item, index) {
      this.$prompt('跳转至:', '指定位置', {
        showClose: false,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: `请填写正确的位置(1-${this.sortData.length})`
      }).then(({ value }) => {
        if (parseInt(value) > this.sortData.length) {
          value = this.sortData.length
        }
        this.updateData(item, index, value - 1)
      })
    },
    // 重新设置数据
    updateData (item, oldVal, newVal) {
      this.sortData.splice(oldVal, 1)
      this.sortData.splice(newVal, 0, item)
      this.saveData()
    },
    // 保存数据
    saveData () {
      this.loading = true

      let saveData = []
      this.sortData.forEach((item, index) => {
        saveData.push({
          assId: item.assId,
          sort: index + 1
        })
      })

      ApiAssessManage.sort(saveData)
        .then(res => {
          if (res.status === 200) {
            this.$message.success(res.desc)
          }
          this.loading = false

          this.getOrder()
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    /** ** 排序-end ****/

    refresh () {
      this.getList()
    }

  }
}
</script>

<style>
  .el-tooltip__popper {
    max-width: 500px !important;
  }
</style>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nams/css/self_common";

  .iframe {
    /deep/ .el-dialog__body {
      padding: 0 !important;
    }
  }

  /deep/ .tl {
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /deep/ .el-tooltip__popper {
    /*max-width: 500px !important;
    word-wrap: break-word;
    border: 1px solid red;*/
  }

  /deep/ .el-dialog .el-dialog__body {
    height: 560px;
  }

  /* 排序 */
  .typt-list-container {
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  /deep/ .el-message-box__wrapper .el-message-box .el-message-box__btns .el-button--default,
  .el-message-box__wrapper .el-message-box .el-message-box__btns .el-button--primary {
    padding: 12px 20px !important;
    border-radius: 0 !important;
  }

  /deep/ .el-table::before {
    height: 0 !important;
  }
</style>
