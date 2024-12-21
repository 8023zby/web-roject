<template>
  <el-container>
    <el-aside width="250px">
      <slot name="aside">
        <el-header height="auto">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label>
              <div class="lableDivs">
              <span>分类管理</span>
            </div>
            </el-form-item>
          </el-form>
            <div class="tool-container">
                <div class="left">
                  <!--左边按钮-->
                  <slot name="left_btn">
                   <el-button type="primary"   @click="addShow(null,'AssortForm.Tform')">添加分类</el-button>
                  </slot>
                </div>
                <div class="right">
                  <!--右边按钮-->
                  <slot name="right_btn">
                   <div class="action_div">
                      <el-button type="primary" :disabled="pagination.list.length <=0" @click="toSort(false)">排序</el-button>
                    </div>
                  </slot>
                </div>
              </div>
        </el-header>
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
      </slot>
    </el-aside>
    <el-main>
      <slot name="main"></slot>
    </el-main>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot></slot>
  </el-container>
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

<style lang="scss" type="text/scss" scoped>
  .el-container {
    height: 100%;
  }
  .el-aside {
    overflow: visible;

    /deep/ > div {
      height: 100%;
    }
  }
  .el-main {
    padding: 0;
    margin: 12px;
    box-shadow: 0 0 3px #cccccc;

    /deep/ > div {
      height: 100%;
    }
  }
</style>
