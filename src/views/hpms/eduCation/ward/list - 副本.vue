<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <div class="left-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label>
           <div class="lableDivs">
          <span>分类管理</span>
        </div>
        </el-form-item>
      </el-form>
      <hr />
      <div class="typt-list-add-div">
        <el-button type="primary"   @click="addShow(null,'AssortForm.Tform')">添加分类</el-button>
        <div class="action_div">
          <el-button type="primary" :disabled="pagination.list.length <=0" @click="toSort(false)">排序</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <el-table :data="AssortForm.listData" style="width: 100%" height="80%" stripe>
        <el-table-column label="分类名称" prop="categoryName" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span  style="margin:0 10px 0 0;cursor:pointer">
            <i class="el-icon-edit" @click="addShow(scope.row,'AssortForm.Tform')"></i>
            </span>
            <span style="margin:0 10px 0 0;cursor:pointer">
                <i class=" el-icon-delete"  @click="delHandler(scope.$index, scope.row,'assort')"></i>
            </span>
          </template>
        </el-table-column>
      </el-table>

      </div>
      <div class="right-container">
        <el-container class="list-page-new">
            <el-header height="auto">
              <!--查询条件模块 === START-->
              <div class="">
                <div class="query-items-container" ref="query_form">
                  <slot name="query">
                      <!-- 查询条件 -->
                    <el-form :inline="true" class="demo-form-inline">
                      <el-form-item label="标题">
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
                      <el-form-item label="状态">
                        <el-select v-model="search.isEnable" placeholder="全部">
                          <el-option value>全部</el-option>
                          <el-option value="1" label="启用">启用</el-option>
                          <el-option value="0" label="停用">停用</el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <div class="typt-search-btn">
                          <el-button
                            type="primary"
                            @click="queryHandler"
                            class="el-button-radius"
                            icon="el-icon-search"
                          >搜索</el-button>
                          <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </slot>
                </div>
              </div>
              <!--查询条件模块 === END-->
              <hr style="background-color: #E4E7ED; margin: 0; height: 1px;" v-if="$slots.query && ($slots.left_btn || $slots.right_btn)"/>
              <div class="tool-container line">
                <div class="left">
                  <!--左边按钮-->
                  <slot name="left_btn">
                      <el-button
                        type="warning"
                        icon="el-icon-plus"
                        @click="$emit('option-changed','add',
                        {Category:Category, isWard:detail.isWard})"
                      >添加</el-button>
                  </slot>
                </div>
                <div class="right">
                  <!--右边按钮-->
                  <slot name="right_btn">
                      <el-button type="primary" :disabled="pagination.list.length <=0" @click="toSort(true)">文章排序</el-button>
                      <el-button type="primary" @click="handlerBtn('1')">启用</el-button>
                      <el-button type="primary" @click="handlerBtn('0')">停用</el-button>
                  </slot>
                </div>
              </div>
            </el-header>
            <el-main>
              <!--主体列表-->
              <slot name="main">
                   <!-- 表格 -->
                  <el-table
                    :data="pagination.list"
                    style="width: 100%"
                    height="80%"
                    stripe
                    @select="handleSelect"
                    @select-all="handleALL"
                  >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="所属分类" :formatter="contCategory" prop="categoryId" align="center" />
                    <el-table-column label="标题" prop="title" align="center" />
                    <el-table-column label="摘要" prop="summary" align="center" />
                    <el-table-column label="状态" :formatter="isEnable" prop="isEnable" align="center" />

                    <el-table-column label="阅读量" prop="readCount" align="center" />

                    <el-table-column label="创建时间" prop="createTime" align="center" />
                    <el-table-column label="操作" width="250" align="center">
                      <template slot-scope="scope">
                        <span
                          class="el-button-text-color"
                          @click="$emit('option-changed','edit',{row:scope.row,Category:Category, isWard:detail.isWard})"
                        >编辑</span>
                        <span class="el-text-danger" @click="delHandler(scope.$index, scope.row,'article')">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>
              </slot>
            </el-main>

            <el-footer height="auto" class="page-bar">
              <!--分页条-->
              <slot name="footer">
                <pagination
                  :pagination="pagination"
                  @page-size-changed="pageSizeChangeHandler"
                  @page-changed="pageChangeHandler"
                />
              </slot>
            </el-footer>
            <!-- 其他无固定位置元素 如弹窗等 -->
            <slot>
              <!--排序对话框-->
              <el-dialog :visible.sync="dialogSortVisible" width="500px" class="clsStor">
                <div slot="title" class="header-title">
                  <span class="storTitle">操作方式：鼠标拖拽所需项至相应位置以完成排序</span>
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
                  <el-table-column label="序号" type="index" width="150" />
                  <el-table-column  v-if="toSortFlag" label="名称" prop="title" />
                  <el-table-column  v-else label="名称" prop="categoryName" />
                </el-table>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogSortVisible = false">取 消</el-button>
                  <el-button type="primary" @click="onSortSubmit()">确 定</el-button>
                </div>
              </el-dialog>

                   <!--添加或者编辑-->

              <el-dialog
                :title="AssortForm.Tform.title"
                :visible.sync="AssortForm.dialogFormVisible"
                width="30%"
              >
              <el-form ref="AssortForm.Tform" :model="AssortForm.Tform" :rules="AssortForm.roles" :role="AssortForm.roles">
                <el-form-item label="分类名称" label-width="100px" prop="categoryName">
                  <el-input v-model.trim="AssortForm.Tform.categoryName" placeholder="请输入分类名称" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="reset('AssortForm.Tform')">取 消</el-button>
                <el-button type="primary" @click="submitForm('AssortForm.Tform')">确 定</el-button>
              </div>
            </el-dialog>
            </slot>
          </el-container>
      </div>
    </div>
  </div>
</template>

<script>
import { deepMerge } from '@/assets/hpms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as wardApi from '@/api/hpms/eduCation/ward'
import Sortable from 'sortablejs'
import Pagination from '@/components/hpms/paginations/pagination'
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
      default: () => {}
    }
  },
  data () {
    const search = this.initQueryCriteria()
    const AssortForm = this.initAssortform()
    return {
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
      // 如果是病区的话那么就组织一下护理单元传给后台
      // 通常使用 this.createQueryParams() 就可以
      wardApi.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      })
    },
    // 删除服务器上的文件
    delFileds (d) {
      DeleteFileds(qs.parse({ filePath: d[0].url })).then(r => {
        console.log(r)
      })
    },
    /* 列表删除 */
    customDelHandler (index, row, T) {
      if (T === 'article') {
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
      } else if (T === 'assort') {
        wardApi.DelType(row.id).then(res => {
          this.IsSuccess(res)
          this.getAssortList()
          this.getCategory()
        })
      }
    },
    /* 商品排序保存 */
    onSortSubmit () {
      var list = []
      this.newList.forEach((value, index) => {
        list.push(index + 1)
      })
      let t = 'Sort'
      if (this.toSortFlag) {
        t = 'Sort'
      } else {
        t = 'SortType'
      }
      wardApi[t]({ ids: this.newList.toString(), sortIndexs: list.toString() })
        .then(res => {
          if (this.toSortFlag) {
            this.IsSuccess(res)
          } else {
            this.getAssortList()
          }
          this.dialogSortVisible = false
        })
    },
    /* 商品排序实现 */
    setSort () {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tableSortData.splice(evt.oldIndex, 1)[0]
          this.tableSortData.splice(evt.newIndex, 0, targetRow)
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    /* 商品排序 */
    toSort (T) {
      /* 两个对象合并生成一个新的对象 */
      const serch = { nurseUnitId: this.selectDeptInfo(), isPage: 0 }
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
      this.search = this.initQueryCriteria()
      this.queryHandler()
    },
    /* 宣教==========================分类 */
    /* 获取分类列表 */
    getAssortList () {
      var _this = this
      wardApi.getTypeList({ IsPage: 0, nurseUnitId: this.selectDeptInfo() }).then(data => {
        if (_this.stateDetect(data)) {
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

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

.line{
  margin-top:20px ;
  border-top:1px solid rgba(239,239,239,1);;
}

.left-container{
 float: left;
  width: 18%;
  border-right: 1px #e6e6e6 solid;
  height: 100%;
}
.right-container{
  float: right;
  height: 100%;
  width: 81%;
}

.btn-area {
  padding: 20px 0px 10px 0px;
}
.query-area > div {
  margin-right: 50px;
}

.clsStor {
  height: 85%;
}
.storTitle {
  color: red;
  font-size: 1em;
}

.lableDivs {
  height: 50px;
  display: flex;
  align-items: center;
  margin-left: 10px;
  color: #298ae7
}
</style>
