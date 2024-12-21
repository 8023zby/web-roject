<!--
  文件描述：商品分类管理列表页
    主样式class：list-page-new
  创建时间：2020/4/15 13:19
  创建人：Administrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
-->
<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true">
        <el-form-item label="分类名称：">
          <el-input
            v-model="search.categoryName"
            placeholder="请输入分类名称"
          />
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button
              type="primary"
              @click="queryHandler"
              size="small"
              icon="el-icon-search"
              >搜索</el-button
            >
            <el-button type="text" @click="clsHandler">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <el-button
          type="warning"
          icon="el-icon-plus"
          @click="addWareCategory('add')"
          >添加</el-button
        >
        <div class="action_div">
          <el-button type="primary" @click="toSort()">排序</el-button>
        </div>
      </div>
      <!--列表-->
      <el-table :data="pagination.list" height="80%">
        <el-table-column label="序号" type="index" width="150" align="center">
          <template slot-scope="scope">
            <span
              >{{ scope.$index + (pagination.page - 1) * pagination.size + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="categoryName" align="center" />
        <el-table-column label="包含商品数" prop="wareCounts" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span
              class="el-button-text-color"
              @click="editWareCategory(scope.$index, scope.row, 'edit')"
              >编辑</span
            >
            <span
              class="el-text-danger"
              @click="delHandler(scope.$index, scope.row)"
              >删除</span
            >
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
      <!--分页-->
      <!--组件页码显示-->
      <pagination
        :pagination="pagination"
        @page-size-changed="pageSizeChangeHandler"
        @page-changed="pageChangeHandler"
      />
    </div>
    <!--新增床位对话框-->
    <!--新增对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      width="600px"
      v-if="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form ref="form" :model="form" :rules="rules" class="typt-add-dialog">
        <el-form-item
          label="名称："
          :label-width="formLabelWidth"
          prop="categoryName"
        >
          <el-input v-model="form.categoryName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确 认</el-button>
      </div>
    </el-dialog>

    <!----排序------>
    <el-dialog
      custom-class="bedDialog"
      title="排序"
      :visible.sync="dialogSortVisible"
      width="780px"
      :close-on-click-modal="false"
      v-if="dialogSortVisible"
      @close="executeQueryPage"
    >
      <table-sort
        filedName="categoryName"
        T="shopingT"
        tit="分类名称"
      ></table-sort>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWareCategory,
  addWareCategory,
  delWareCategory,
  editWareCategory,
  getWareCategoryEx
} from '@/api/smms/shopingMall/wareCategory'

import Pagination from '@/components/smms/paginations/pagination'
import BaseQueryPageForm from '../common/BaseQueryPageForm'
import { deepMerge } from '@/assets/smms/utils'

import tableSort from '@/components/smms/tableSort'

export default {
  name: 'WareCategoryList',
  components: { Pagination, tableSort },
  mixins: [BaseQueryPageForm],
  data () {
    const search = this.initQueryCriteria()
    return {
      search: search,
      list: null,
      tableData: [],
      value: '',
      dialogFormVisible: false,
      dialogSortVisible: false,
      form: {
        categoryName: '',
        id: ''
      },
      formLabelWidth: '100px',
      dataTree: [],
      categoryName: '',
      currentPage: 1,
      sizeNum: 10,
      dataTotal: 0,
      dialogTitle: '新建分类',
      sortDialogTitle: '排序',
      sortable: null,
      oldList: [],
      newList: [],
      rules: {
        categoryName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          /* { pattern: /^[\u4e00-\u9fa5]+$/, message: '仅支持汉字字符' } */
        ]
      }
    }
  },
  inject: ['routerTo'],
  mounted: function () {
    // 判断店铺具备完整信息是否
    this.isCompleteInfo(true)
  },
  methods: {
    // 判断是否需要完善店铺信息
    isCompleteInfo (t) {
      const _this = this
      let shopImg = localStorage.getItem('shopInfo.img')
      if (shopImg === '' || shopImg === null || shopImg === undefined || shopImg === 'null') {
        if (t) {
          _this.isWholeInfo((res) => {
            _this.isCompleteInfo(false)
          })
        } else {
          this.$alert('店铺信息缺失，请点击左侧店铺信息菜单，完善信息。', '', {
            confirmButtonText: '确定',
            callback: action => {
              this.routerTo('/shop')
            }
          })
        }
      } else {
        _this.executeQueryPage()
      }
    },

    executeQueryPage () {
      getWareCategory(this.createQueryParams()).then(res => {
        this.IsSuccess(res, () => {
          this.queryResultHandler(res)
        }, false)
      })
    },

    // 新增
    addWareCategory () {
      this.dialogFormVisible = true
      this.form.categoryName = ''
      this.form.id = ''
      this.dialogTitle = '新增分类'
    },
    // 编辑
    editWareCategory (index, row, e) {
      if (e === 'edit') {
        this.dialogTitle = '编辑分类'
      }
      getWareCategoryEx(row.id).then(res => {
        this.dialogFormVisible = true
        this.form = { ...res.data }
      })
    },
    toSort () {
      this.dialogSortVisible = true
    },
    // 删除
    customDelHandler (index, row) {
      delWareCategory(row.id).then(res => {
        this.IsSuccess(res)
        this.executeQueryPage()
      })
    },
    // 提交表单
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.id === '') {
            addWareCategory({
              categoryName: this.form.categoryName
            })
              .then(res => {
                if (res.status === 200) {
                  // 新增成功
                  this.dialogFormVisible = false
                  this.executeQueryPage()
                } else {
                  this.$message({
                    message: '' + res.desc,
                    type: 'error'
                  })
                }
              })
          } else if (this.form.id !== '') {
            editWareCategory({
              categoryName: this.form.categoryName,
              id: this.form.id
            })
              .then(res => {
                console.log(res)
                if (res.status === 200) {
                  // 修改成功
                  this.dialogFormVisible = false
                  this.executeQueryPage()
                } else {
                  this.$message({
                    message: '' + res.desc,
                    type: 'error'
                  })
                }
              })
              .catch(error => {
                this.$message.error(JSON.stringify(error) + '修改失败')
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        categoryName: '',
        id: ''
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.executeQueryPage()
    }

  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>
@import '@/assets/smms/css/self_common.scss';
.bedDialog {
  .el-dialog__body {
    height: 500px;
  }
}
</style>
