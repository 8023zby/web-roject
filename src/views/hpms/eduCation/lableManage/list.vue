<!--
  文件描述：左侧树，右侧表格的页面实例----宣教-标签管理
  主样式class：typt-list-container
    使用的中台统一样式
  创建时间：2020/4/29 10:44
  更改时间：2020-10-15
  创建人：Administrator

  主体样式需引入：class = page-aside-main
-->
<template>
  <el-container class="page-aside-main">
    <!--左侧部分内容 ============ START-->
    <el-aside style="width:20%;">
      <slot name="aside">
        <div class="left-aside">
          <div class="l-title">标签分类</div>
          <!--<div class="l-action">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addLableShow"
              size="mini"
            >添加</el-button>
          </div>-->
          <div class="l-content">
            <new-tree
              @refreshList="refreshList"
              ref="Ttree"
              class="Ltree"
              :setTree="treeData"
              :saveFirstIds="saveFirstIds"
              :highlight-current="true"
              :default-props="defaultProps"
              :is-click="isClick"
              :defaultkeys="defaultkeys"
              :filter-text="filterText"
              @listClickNodeId="listClickNodeId"
              @getLablelist="getLablelist"
            />
          </div>
        </div>
      </slot>
    </el-aside>
    <!--左侧部分内容 ============ END-->
    <!--右侧部分内容 ============ START-->
    <div class="typt-list-container">
      <!--查询条件模块 === START-->
      <el-form ref="search" :inline="true" :model="search" class="typt-list-search">
        <el-form-item label="标签名称:">
          <el-input v-model="search.tagName" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <!-- 查询按钮 -->
          <div class="typt-search-btn">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="queryHandler"
            >搜索</el-button>
            <el-button type="text" @click="clsHandler">重置</el-button>
          </div>
        </el-form-item>
      </el-form>

      <!--查询条件模块 === END-->
      <hr />

      <!--左右按钮 === START-->
      <div class="typt-list-add-div">
        <el-button type="warning" size="small" icon="el-icon-plus" @click="addLableShow">添加</el-button>
        <!--右侧区域按钮-->
        <div class="action_div">
        </div>
      </div>
      <!--左右按钮 === END-->

      <!--表格主体 ==== START-->
      <el-table
        :data="pagination.list"
        style="width: 100%"
        height="100%"
        select-all
        stripe
        v-loading="yh_loading"
      >
        <!-- <el-table-column prop="sortIndex" align="center" label="序号" width="150">
          <template slot-scope="scope">
            <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="标签名称" prop="tagName" align="center" />
        <el-table-column label="所属分类" prop="categoryName" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
                    <span
                      class="el-button-text-color"
                      @click="deitlableShow(scope.$index, scope.row)"
                    >编辑</span>
            <span class="el-text-danger" @click="delHandler(scope.$index, scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!--表格主体 ==== END-->

      <!--分页条-->
      <pagination
        :pagination="pagination"
        @page-size-changed="pageSizeChangeHandler"
        @page-changed="pageChangeHandler"
      />
    </div>
    <!--右侧部分内容 ============ END-->

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <!--添加或者编辑-->
      <el-dialog
        :title="form.id == '' ? '添加' : '修改'"
        :visible.sync="dialogFormVisible"
        width="40%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="form"
          :model="form"
          style="text-align: center;height:60vh;overflow: auto;"
          :rules="rulesForm"
        >
          <el-form-item label="标签名称:" label-width="100px" prop="tagName">
            <el-input v-model="form.tagName" placeholder="请输入标签名称" />
          </el-form-item>
          <el-form-item label="标签分类:" label-width="100px" prop="categoryId">
            <tree
              ref="trees"
              v-model="form.categoryId"
              :tdata="treeData"
              :default-props="defaultProps"
              :defaultkeys="defaultkeys"
              :showchek="true"
              :chekekeys="chekekeys"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
      </el-dialog>
    </slot>
  </el-container>
</template>

<script>
import { deepMerge } from '@/assets/hpms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as lableManageApi from '@/api/hpms/eduCation/lableManage'
import Pagination from '@/components/hpms/paginations/pagination'
import Tree from '@/components/hpms/Tree/index1'
import newTree from '@/components/hpms/Tree/index'
import { formatter } from '@/assets/hpms/utils/common'

export default {
  components: { Pagination, Tree, newTree },
  mixins: [BaseQueryPageForm],
  data () {
    const search = this.initQueryCriteria()
    return {
      yh_loading: false,
      defaultProps: {
        children: 'childsList',
        label: 'categoryName',
        id: 'id'
      },
      treeData: [],
      saveFirstIds: [],
      form: { categoryId: '', tagName: '', id: '' },
      treeForm: { categoryName: '', parentId: '', id: '' },
      filterText: '',
      dialogFormVisible: false,
      dialogSortVisible: false,
      dialogFormTreeVisible: false,
      chekekeys: [],
      search: search,
      selected: null,
      isClick: true, // 树自定义属性
      roles: {},
      solutionTreeList: [], // 结构树
      lableType: true, // 如果左侧点击的是4级就不显示分类标签
      defaultkeys: [], // 默认展开
      /* 新建标签分类校验 */
      /* 新建标签校验 */
      rulesForm: {
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选标签分类', trigger: 'blur' }
        ]
      },
      cuTreeTitle: '' // 记录当前添加的数据
    }
  },
  created () {
    // 获取树的结构
    this.getLablelist()
    // this.solutionTree()
  },
  mounted () {
    this.executeQueryPage()
  },
  methods: {
    refreshList () {
      this.listClickNodeId({ parentId: 0 })
    },
    labelTagClear (formRule) {
      this.treeForm = {
        categoryName: '',
        parentId: '',
        id: ''
      }
      this.$refs.Ttree.nodeId = null
      this.dialogFormTreeVisible = false
    },
    /* 首先结构树 然后把树对照给列表分类 */
    fromatTree (row, c) {
      return formatter(this.solutionTreeList, row.categoryId, {
        value: 'id', // 需要比对的值
        label: 'categoryName' // 需要比对的返回值
      })
    },
    /*  点击左侧树获取ID刷新列表 */
    listClickNodeId (item = null) {
      if (item !== null) {
        // 只要点击了左侧一直带着这个Id 分页下一层用
        if (item.parentId === '0') {
          this.search.categoryId = ''
        } else {
          this.search.categoryId = item.id
        }
        this.initPagination(this.pagination)
        lableManageApi
          .getInfo(
            deepMerge(this.createQueryParams(), {
              categoryId: this.search.categoryId
            })
          )
          .then(data => {
            this.queryResultHandler(data)
          })
      }
      item = null
    },
    /* 结构树 */
    solutionTree () {
      this.solutionTreeList = []
      lableManageApi.LableInfo({ IsPage: 0 }).then(res => {
        this.IsSuccessCommon(res, () => {
          for (let i = 0; i < res.data.length; i++) {
            let value = res.data[i]
            const item = {
              id: value.id,
              categoryName: value.categoryName,
              categoryId: value.parentId
            }
            this.solutionTreeList.push(item)
          }
        }, false)
      })
    },
    /* 获取树结构 */
    getLablelist (isformshow = false) {
      lableManageApi.getLableInfo().then(res => {
        this.IsSuccessCommon(res, () => {
          for (let v of res.data) {
            this.saveFirstIds.push(v.id)
          }
          this.treeData = [...res.data]
          this.defaultkeys = []
          //  获取第一个 为了展开树
          for (let v1 of res.data.values()) {
            v1.disabled = true
            if (v1.id) this.defaultkeys.push(v1.id)
            if (!v1 || !v1.childsList || v1.childsList === null || v1.childsList.length === 0) continue
            for (let i = 0; i < v1.childsList.length; i++) {
              let v2 = v1.childsList[i]
              if (v2 && v2.id) this.defaultkeys.push(v2.id)
              if (!v2 || !v2.childsList || v2.childsList === null || v2.childsList.length === 0) continue
              for (let i2 = 0; i2 < v2.childsList.length; i2++) {
                let v3 = v2.childsList[i2]
                if (v3 && v3.id) this.defaultkeys.push(v3.id)
                if (!v3 || !v3.childsList || v3.childsList === null || v3.childsList.length === 0) continue
                for (let i3 = 0; i3 < v3.childsList.length; i3++) {
                  let v4 = v3.childsList[i3]
                  if (v4 && v4.id) this.defaultkeys.push(v4.id)
                }
              }
            }
          }

          if (isformshow) {
            this.dialogFormVisible = true
            this.form.id = ''
            this.$nextTick(function () {
              this.$refs.form.resetFields()
              this.$refs.trees.reset()
            })
          }
        }, false)
      })
    },
    /* 添加弹窗 */
    addLableShow () {
      this.getLablelist(true)
    },
    deitlableShow (index, row = null) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.chekekeys = []
        if (row !== null) {
          this.form = { ...row }
          this.chekekeys.push(row.categoryId)
          this.$refs['form'].clearValidate()
        }
      })
    },
    /*   提交数据 */
    submitForm (formName) {
      if (this.$refs.trees.editCheckId !== '') {
        this.form.categoryId = this.$refs.trees.editCheckId
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          /*  添加 */
          if (this.form.id === '') {
            lableManageApi.Add(this.form).then(data => {
              this.IsSuccess(data)
              this.dialogFormVisible = false
            })
          } else {
            /* 编辑 */
            lableManageApi.Edit(this.form).then(data => {
              this.IsSuccess(data)
              this.dialogFormVisible = false
            })
          }
        }
      })
    },
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        title: '',
        categoryId: ''
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      lableManageApi.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      }).finally(() => {
        this.yh_loading = false
      })
    },
    /* 列表删除 */
    customDelHandler (index, row) {
      lableManageApi.Del(row.id).then(res => {
        this.IsSuccess(res)
        this.executeQueryPage()
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.queryHandler()
    }
  }
}
</script>
<style lang='scss'>
@import '@/assets/hpms/css/self_common.scss';
</style>
