<!--
  文件描述：左侧表格，右侧表格的页面实例----宣教-病区宣教
  主样式class：typt-list-container
    使用的中台统一样式
  创建时间：2020/4/29 16:44
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
          <div class="l-title">宣教分类</div>
          <div class="l-action">
            <el-button type="primary" @click="addShow(null,'AssortForm.Tform')">添加分类</el-button>

            <el-button type="primary" @click="toSort(false)" :disabled="AssortForm.listData.length<=0" style="float: right;">排序</el-button>
          </div>
          <div class="l-content">
            <div class="ward-left-tree">
              <section
                v-for="(item,index) in AssortForm.listData"
                @click="changeFenlei(item)"
                :key="index"
                :style="item.isChecked?'background-color:rgba(30,135,240,.1);':''"
              >
                <el-row>
                  <el-col :span="20">
                    <div class="ct-name">{{item.categoryName}}</div>
                  </el-col>
                  <el-col :span="2">
                    <i
                      class="el-icon-edit-outline"
                      style="color:#1E87F0;font-size: 15px;"
                      @click="addShow(item,'AssortForm.Tform')"
                    ></i>
                  </el-col>
                  <el-col :span="2">
                    <i
                      style="color:#1E87F0;font-size: 15px;"
                      class="el-icon-delete"
                      @click="delHandler(index, item,'assort')"
                    ></i>
                  </el-col>
                </el-row>
              </section>
            </div>
          </div>
        </div>
      </slot>
    </el-aside>
    <!--左侧部分内容 ============ END-->
    <!--右侧部分内容 ============ START-->
    <div class="typt-list-container">
      <!--查询条件模块 === START-->
      <el-form ref="search" :inline="true" :model="search" class="typt-list-search">
        <el-form-item label="标题:">
          <el-input v-model="search.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="文章分类" v-if="false">
          <el-select v-model="search.categoryId" placeholder="请选择">
            <el-option value>请选择</el-option>
            <el-option
              v-for="item in Category"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态:">
          <el-select v-model="search.isEnable" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option value="1" label="启用">启用</el-option>
            <el-option value="0" label="停用">停用</el-option>
          </el-select>
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
        <el-button
          type="warning"
          icon="el-icon-plus"
          size="small"
          @click="$emit('option-changed','add',
                        {Category:Category, isWard:detail.isWard, categoryId: search.categoryId})"
        >添加</el-button>
        <!--右侧区域按钮-->
        <div class="action_div">
          <el-button
            type="primary"
            @click="toSort(true)"
            size="small"
            :disabled="search.categoryId===''"
          >排序</el-button>
          <el-button
            type="primary"
            @click="handlerBtn('1')"
            size="small"
            :disabled="useOrNot || pagination.list.length <=0"
          >启用</el-button>
          <el-button
            type="primary"
            @click="handlerBtn('0')"
            size="small"
            :disabled="useOrNot || pagination.list.length <=0"
          >停用</el-button>
        </div>
      </div>
      <!--左右按钮 === END-->

      <!--表格主体 ==== START-->
      <el-table
        v-loading="yh_loading"
        :data="pagination.list"
        style="width: 100%"
        height="100%"
        stripe
        @select="handleSelect"
        @select-all="handleALL"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="序号" type="index" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index+( pagination.page - 1) *pagination.size + 1 }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="所属分类"
          :formatter="contCategory"
          prop="categoryId"
          align="center"
        />
        <el-table-column label="标题" prop="title" align="center" width="250" />
        <!--<el-table-column label="摘要" prop="summary" align="center" width="200" :show-overflow-tooltip="true"/>-->
        <el-table-column label="状态" :formatter="isEnable" prop="isEnable" align="center" />

        <el-table-column label="阅读量" prop="readCount" align="center" />

        <el-table-column label="创建时间" prop="createTime" align="center" width="160" />
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">

            <el-button
              type="text"
              size="small"
              @click="editFun(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="color:#F56C6C;"
              @click="delHandler(scope.$index, scope.row,'article','此操作将永久删除，且该文章关联的宣教记录也将被删除，是否继续?')"
            >删除</el-button>
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
      <!-- 其他无固定位置元素 如弹窗等 -->
    </div>
    <!--右侧部分内容 ============ END-->

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <!--排序对话框-->
      <el-dialog
        :visible.sync="dialogSortVisible"
        width="800px"
        class="clsStor"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
      >
        <div slot="title" class="header-title">
          <span class="storTitle">分类排序</span>
        </div>
        <el-table
          ref="dragTable"
          :data="tableSortData"
          style="width: 100%;"
          row-key="id"
          border
          fit
          highlight-current-row
          max-height="500"
        >
          <!-- <el-table-column label="序号" type="index" width="150" /> -->
          <el-table-column v-if="toSortFlag" label="名称" prop="title" />
          <el-table-column v-else label="名称" prop="categoryName" />
          <el-table-column label="操作" align="center" width="400">
            <template slot-scope="scope">
              <el-button type="text" @click="moveUp(scope.$index, scope.row)">上移</el-button>
              <el-button
                type="text"
                @click="moveDown(scope.$index, scope.row)"
                style="color:#f56f6c"
              >下移</el-button>
              <el-button type="text" @click="moveTop(scope.$index, scope.row)">置顶</el-button>
              <el-button
                type="text"
                @click="moveBottom(scope.$index, scope.row)"
                style="color:#f56f6c"
              >置底</el-button>
              <el-button type="text" @click="customDo(scope.$index, scope.row)">指定位置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSortVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSortSubmit()">确 定</el-button>
        </div>
      </el-dialog>

      <!--添加或者编辑-->

      <el-dialog
        :title="AssortForm.Tform.title"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="AssortForm.dialogFormVisible"
        width="30%"
      >
        <el-form
          ref="AssortForm.Tform"
          :model="AssortForm.Tform"
          :rules="AssortForm.roles"
        >
          <el-form-item label="分类名称" label-width="100px" prop="categoryName">
            <el-input v-model.trim="AssortForm.Tform.categoryName" placeholder="请输入分类名称" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="reset('AssortForm.Tform')">取 消</el-button>
          <el-button type="primary" @click="submitForm('AssortForm.Tform')">确 认</el-button>
        </div>
      </el-dialog>
    </slot>
  </el-container>
</template>

<script>
import { deepMerge } from '@/assets/hpms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as wardApi from '@/api/hpms/eduCation/ward'
// import Sortable from 'sortablejs'
import Pagination from '@/components/hpms/paginations/pagination'
import tableSort from '@/components/hpms/tableSort/tableSort.js'
import mains from './main'
import { DeleteFileds } from '@/api/hpms/qiniu'
import qs from 'qs'
import {
  selectDeptInfo,
  newGetSelectData,
  selectDeptInfoData,
  formatter
} from '@/assets/hpms/utils/common'

export default {
  components: { Pagination },
  mixins: [BaseQueryPageForm, mains],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  data () {
    const search = this.initQueryCriteria()
    const AssortForm = this.initAssortform()
    return {
      yh_loading: false,
      useOrNot: true, // 启用、停用按钮的可操作状态
      tableSortData: {},
      sortable: null,
      oldList: [],
      newList: [],
      dialogSortVisible: false,
      selectID: [],
      search: search,
      Category: [],
      AssortForm: AssortForm,
      toSortFlag: true // 排序用了一个窗口 判断是分类还是内容的排序
    }
  },
  created () {
    this.getAssortList()
    this.getBedSideInfo()
  },
  mounted () {
    this.getCategory()
    this.executeQueryPage()
  },
  methods: {
    // 编辑
    editFun (row) {
      this.$emit('option-changed', 'edit', { row: row, Category: this.Category, isWard: this.detail.isWard })
      return
      this.$confirm('编辑之后将重置患者阅读状态，您确定编辑吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('option-changed', 'edit', { row: row, Category: this.Category, isWard: this.detail.isWard })
      }).catch((e) => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 更新宣教分类
    changeFenlei (row) {
      for (let v of this.AssortForm.listData.values()) {
        v.isChecked = false
        if (v.id === row.id) v.isChecked = true
      }
      this.useOrNot = true
      this.search.categoryId = row.id

      this.pagination.size = 10
      this.pagination.page = 1
      this.executeQueryPage()
    },
    // 获取护理单元ID
    selectDeptInfo () {
      return this.detail.isWard === 0 ? 0 : selectDeptInfo()
    },
    /* 全选 */
    handleALL (val) {
      this.handleSelect(val)
    },
    /*  获取当前选中的数据 */
    handleSelect (row) {
      this.selectID = []
      if (row.length > 0) {
        row.forEach((value, index) => {
          this.selectID.push(value.id)
        })
        this.useOrNot = false
      } else {
        this.useOrNot = true
      }
    },
    /* 启用停用 */
    handlerBtn (state) {
      // state 0: '停用',
      // state1: '启用'
      if (this.selectID.length === 0) {
        this.$message({ type: 'info', message: '请选择要操作的列表' })
        return
      }
      wardApi.updateState({ ids: this.selectID, state: state }).then(res => {
        this.IsSuccess(res)
        this.selectID = []
        this.useOrNot = true
      })
    },
    /* 对照 */
    formatDept (row, c) {
      return formatter(selectDeptInfoData(), null, {
        label: 'deptName',
        flag: false
      })
    },
    /*  文章分类列表对照 */
    contCategory (row, c) {
      return formatter(this.Category, row.categoryId, {
        value: 'value',
        label: 'label'
      })
    },
    /*  状态对照 */
    isEnable (row, c) {
      const Ctype = {
        0: '停用',
        1: '启用'
      }
      return Ctype[row.isEnable]
    },
    /* 获取分类 */
    getCategory () {
      wardApi
        .getTypeList({
          nurseUnitId: this.selectDeptInfo(),
          isPage: 0
        })
        .then(res => {
          if (res.status === 200) {
            this.Category = newGetSelectData({
              data: res.data,
              params: {
                value: 'id',
                label: 'categoryName',
                type: 'nurseUnitId'
              }
            })
          }
        })
    },
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        title: '', // 标题
        isEnable: '', // 状态
        categoryId: '', // 分类
        nurseUnitId: this.detail.isWard === 0 ? 0 : selectDeptInfo(),
        isWard: this.detail.isWard // 区分是全院还是病区 0是全院 1病区
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      // 如果是病区的话那么就组织一下护理单元传给后台
      // 通常使用 this.createQueryParams() 就可以
      wardApi.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      }).finally(() => {
        this.yh_loading = false
      })
    },
    // 删除服务器上的文件
    delFileds (d) {
      DeleteFileds(qs.parse({ filePath: d[0].url })).then(r => {
      })
    },
    /* 列表删除 */
    customDelHandler (index, row, T) {
      console.log('删除：', index, row, T)
      if (T === 'article') {
        // 先验证是否在门口机使用
        wardApi.checkDelete(row.id).then(res => {
          console.log(res)
          if (!res.data) {
            // 删除音频
            if (row.contentFile !== '') {
              this.delFileds([JSON.parse(row.contentFile)])
            }
            // 删除文档
            if (row.uploadFile !== '') {
              this.delFileds([JSON.parse(row.uploadFile)])
            }

            wardApi.Delete(row.id).then(res => {
              this.IsSuccess(res)
              this.executeQueryPage()
            })
          } else {
            this.$message({
              type: 'error',
              message: '该宣教正在门口机使用，禁止删除！'
            })
          }
        }).catch(e => {
          console.log('验证在门口机使用，删除失败！', e)
        })
      } else if (T === 'assort') {
        // 删除分类
        wardApi.DelType(row.id).then(res => {
          this.IsSuccess(res)
          this.getAssortList()
          this.getCategory()
        })
      }
    },
    moveUp (index, row) {
      tableSort.moveUp(index, row, this.tableSortData, this)
    },
    // 下移
    moveDown (index, row) {
      tableSort.moveDown(index, row, this.tableSortData, this)
    },
    // 置顶
    moveTop (index, row) {
      tableSort.moveTop(index, row, this.tableSortData, this)
    },
    // 置底
    moveBottom (index, row) {
      tableSort.moveBottom(index, row, this.tableSortData, this)
    },
    // 指定位置
    customDo (index, row) {
      tableSort.customDo(index, row, this.tableSortData, this)
    },
    /* 商品排序保存 */
    onSortSubmit () {
      // var list = []
      // this.newList.forEach((value, index) => {
      //   list.push(index + 1)
      // })
      let sortList = []
      let sortNum = []
      sortList = this.tableSortData.map(v => v.id)
      sortList.forEach((value, index) => {
        sortNum.push(index + 1)
      })
      this.newList = sortList.slice()
      let t = 'Sort'
      if (this.toSortFlag) {
        t = 'Sort'
      } else {
        t = 'SortType'
      }
      wardApi[t]({ ids: this.newList.toString(), sortIndexs: sortNum.toString() })
        .then(res => {
          if (this.toSortFlag) {
            this.IsSuccess(res)
          } else {
            this.getAssortList()
          }
          this.dialogSortVisible = false
        })
    },
    // /* 商品排序实现 */
    // setSort () {
    //   const el = this.$refs.dragTable.$el.querySelectorAll(
    //     '.el-table__body-wrapper > table > tbody'
    //   )[0]
    //   this.sortable = Sortable.create(el, {
    //     ghostClass: 'sortable-ghost',
    //     setData: function (dataTransfer) {
    //       dataTransfer.setData('Text', '')
    //     },
    //     onEnd: evt => {
    //       const targetRow = this.tableSortData.splice(evt.oldIndex, 1)[0]
    //       this.tableSortData.splice(evt.newIndex, 0, targetRow)
    //       const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
    //       this.newList.splice(evt.newIndex, 0, tempIndex)
    //     }
    //   })
    // },
    /* 排序 */
    toSort (T) {
      /* 两个对象合并生成一个新的对象 */
      const serch = { nurseUnitId: this.selectDeptInfo(), isPage: 0, categoryId: this.search.categoryId }
      let s = 'getInfo'
      if (T) {
        s = 'getInfo'
        this.toSortFlag = true
      } else {
        s = 'getTypeList'
        this.toSortFlag = false
      }
      wardApi[s](serch).then(res => {
        if (res.status === 200) {
          // res.data.length

          this.tableSortData = res.data
          this.dialogSortVisible = true
          this.oldList = this.tableSortData.map(v => v.id)
          this.newList = this.oldList.slice()
          this.$nextTick(() => {
            this.setSort()
          })
        } else {
          this.$message('获取数据失败')
        }
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      for (let v of this.AssortForm.listData.values()) {
        v.isChecked = false
      }
      this.search = this.initQueryCriteria()
      this.queryHandler()
    },
    /* 宣教==========================分类 */
    /* 获取分类列表 */
    getAssortList () {
      var _this = this
      wardApi.getTypeList({ IsPage: 0, nurseUnitId: this.selectDeptInfo() }).then(data => {
        if (_this.stateDetect(data)) {
          for (let v of data.data.values()) {
            v.isChecked = false
          }
          _this.AssortForm.listData = data.data
        } else {

        }
      })
    },
    /* 添加编辑弹窗 */
    addShow (row = null, formName) {
      // 清空
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
      if (row !== null) {
        wardApi.DetailType(row.id).then(res => {
          if (res.status === 200) {
            this.AssortForm.Tform = res.data
            this.AssortForm.Tform.title = '修改'
          }
        })
      } else {
        this.AssortForm.Tform.id = ''
        this.AssortForm.Tform.title = '添加'
      }

      this.AssortForm.dialogFormVisible = true
    },
    /*   提交数据 */
    submitForm (formName) {
      const _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          /*  添加 */
          if (_this.AssortForm.Tform.id === '') {
            wardApi.AddType(_this.AssortForm.Tform).then(data => {
              _this.IsSuccess(data)
              _this.AssortForm.dialogFormVisible = false
              _this.getAssortList()
              _this.getCategory()
            })
          } else {
            /* 编辑 */
            wardApi.EditType(_this.AssortForm.Tform).then(data => {
              _this.IsSuccess(data)
              _this.AssortForm.dialogFormVisible = false
              _this.getAssortList()
              _this.getCategory()
            })
          }
        }
      })
    },
    // 重置表单
    reset (formName) {
      this.AssortForm.dialogFormVisible = false
      if (this.$refs[formName]) this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang='scss'>
@import '@/assets/hpms/css/self_common.scss';
</style>
