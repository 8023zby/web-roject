<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label></el-form-item>
      </el-form>
      <hr />
      <div class="typt-list-add-div">
        <el-button type="warning" icon="el-icon-plus" @click="addShow">新建</el-button>
        <div class="action_div">
          <el-button type="primary" :disabled="pagination.list.length <=0" @click="toSort">排序</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <el-table :data="pagination.list" style="width: 100%" height="80%" stripe>
        <el-table-column label="序号" type="index" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="categoryName" align="center" />
        <el-table-column label="包含文章" prop="articleTitles" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="el-button-text-color" @click="addShow(scope.row)">编辑</span>
            <span class="el-text-danger" @click="delHandler(scope.$index, scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationDiv">
        <pagination
          :pagination="pagination"
          @page-size-changed="pageSizeChangeHandler"
          @page-changed="pageChangeHandler"
        />
      </div>
      <!--排序对话框-->
      <el-dialog :visible.sync="dialogSortVisible" width="500px"
                 :close-on-click-modal=false
                 :close-on-press-escape=false
      >
        <div slot="title" class="header-title">
          <span style="color:red">操作方式：鼠标拖拽所需项至相应位置以完成排序</span>
        </div>
        <el-table
          ref="dragTable"
          :data="tableSortData"
          style="width: 100%"
          max-height="500"
          row-key="id"
          fit
          highlight-current-row
        >
          <el-table-column label="序号" type="index" width="150" />
          <el-table-column label="名称" prop="categoryName" />
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onSortSubmit()">确 定</el-button>
          <el-button @click="dialogSortVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <!--添加或者编辑-->
      <el-dialog
        :title="Tform.id==''?'添加':'修改'"
        :visible.sync="dialogFormVisible"
        width="30%"
        @close="reset('Tform')"
        :close-on-click-modal=false
        :close-on-press-escape=false
      >
        <el-form ref="Tform" :model="Tform" :rules="roles" :role="roles">
          <el-form-item label="分类名称" label-width="100px" prop="categoryName">
            <el-input v-model.trim="Tform.categoryName" placeholder="请输入分类名称" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="reset('Tform')">取 消</el-button>
          <el-button type="primary" @click="submitForm('Tform')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deepMerge } from '@/assets/hpms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as wardApi from '@/api/hpms/eduCation/ward'
import Sortable from 'sortablejs'
import Pagination from '@/components/hpms/paginations/pagination'
import { selectDeptInfo } from '@/assets/hpms/utils/common'
export default {
  components: { Pagination },
  mixins: [BaseQueryPageForm],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    const search = this.initQueryCriteria()
    const deptid = this.selectDeptInfo()
    console.log(deptid)
    return {
      Tform: {
        categoryName: '',
        nurseUnitId: deptid
      },
      tableSortData: {},
      sortable: null,
      oldList: [],
      newList: [],
      dialogFormVisible: false, // 添加编辑
      dialogSortVisible: false, // 排序编辑
      search: search,
      roles: {
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10个字符',
            trigger: 'blur'
          }
        ],
        nurseUnitId: [
          { required: true, message: '请选择护理单元', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.executeQueryPage()
  },
  methods: {
    // 获取护理单元ID
    selectDeptInfo () {
      return this.detail.isWard === 0 ? 0 : selectDeptInfo()
    },
    // 重置表单
    reset (formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    /* 添加编辑弹窗 */
    addShow (row = null) {
      if (row.id !== undefined) {
        wardApi.DetailType(row.id).then(res => {
          if (res.status === 200) {
            this.Tform = res.data
          }
        })
      } else {
        this.Tform = this.initQueryCriteria()
      }
      this.dialogFormVisible = true
    },
    /*   提交数据 */
    submitForm (formName) {
      const _this = this
      if (this.detail.isWard === 0) {
        this.Tform.nurseUnitId = 0
      }
      _this.$refs[formName].validate(valid => {
        if (valid) {
          /*  添加 */
          if (_this.Tform.id === '') {
            wardApi.AddType(_this.Tform).then(data => {
              _this.IsSuccess(data)
              _this.dialogFormVisible = false
            })
          } else {
            /* 编辑 */
            wardApi.EditType(_this.Tform).then(data => {
              _this.IsSuccess(data)
              _this.dialogFormVisible = false
            })
          }
        }
      })
    },

    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        categoryName: '',
        nurseUnitId: this.detail.isWard === 0 ? 0 : selectDeptInfo(),
        id: '',
        isWard: this.detail.isWard
      })
    },

    /* 获取列表 */
    executeQueryPage () {
      wardApi.getTypeList(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      })
    },
    /* 列表删除 */
    customDelHandler (index, row) {
      wardApi.DelType(row.id).then(res => {
        this.IsSuccess(res)
        this.executeQueryPage()
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.executeQueryPage()
    },
    /* 排序 */
    onSortSubmit () {
      var list = []
      this.newList.forEach((value, index) => {
        list.push(index + 1)
      })
      wardApi.SortType({ ids: this.newList, sortIndexs: list }).then(res => {
        this.IsSuccess(res)
        this.dialogSortVisible = false
      })
    },
    /* 商品排序 */
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
    toSort () {
      wardApi
        .getTypeList({
          isPage: 0,
          nurseUnitId: this.Tform.nurseUnitId
        })
        .then(res => {
          if (res.status === 200) {
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
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.btn-area {
  padding: 20px 0px 10px 0px;
}
.query-area > div {
  margin-right: 50px;
}

.addbtn {
  float: right;
}
</style>
