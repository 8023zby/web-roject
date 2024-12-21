<template>
  <div class="typt-list-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="商品名称：">
        <el-input v-model="search.title" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="商品分类：">
        <el-select v-model="search.categoryId" placeholder="全部">
          <el-option value>全部</el-option>
          <el-option
            v-for="item in wareType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品状态：">
        <el-select v-model="search.shelfState" placeholder="全部">
          <el-option value>全部</el-option>
          <el-option
            v-for="item in wareState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <div class="typt-search-btn">
          <el-button
            type="primary"
            class="el-button-radius"
            icon="el-icon-search"
            @click="queryHandler"
          >搜索</el-button>
          <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr />
    <div class="typt-list-add-div">
      <el-button
        type="warning"
        icon="el-icon-plus"
        @click="$emit('option-changed','add',{wareType:wareType})"
      >新建</el-button>
      <div class="action_div">
        <el-button type="primary" :disabled="pagination.list.length <=0" @click="toSort()">商品排序</el-button>
        <el-button type="primary" @click="handlerButtons('Full')">置满</el-button>
        <el-button type="primary" @click="handlerButtons('Clear')">沽清</el-button>
        <el-button type="primary" @click="handlerButtons('Top')">上架</el-button>
        <el-button type="primary" @click="handlerButtons('Down')">下架</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="pagination.list"
      style="width: 100%"
      select-all
      height="80%"
      stripe
      @select="handleSelect"
      @select-all="handleALL"
    >
      <el-table-column type="selection" width="55" sortable />
      <el-table-column prop="sortIndex" align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="title" align="center" />
      <el-table-column
        label="商品分类"
        prop="categoryId"
        :formatter="wareTypeFormatter"
        align="center"
      />
      <el-table-column label="价格" prop="listprice" align="center" />
      <el-table-column label="商品状态" prop="shelfState" :formatter="shelfStateType" align="center" />
      <el-table-column label="审核状态" prop="auditState" :formatter="auditStateType" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span
            class="el-button-text-color"
            @click="$emit('option-changed','check',{row:scope.row})"
          >审核记录</span>
          <span
            class="el-button-text-color"
            @click="$emit('option-changed','edit',{wareType:wareType,row:scope.row})"
          >编辑</span>
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
      <div slot="title">
        <span class="storTitle">操作方式：鼠标拖拽所需项至相应位置以完成排序</span>
      </div>
      <el-table
        class="ifms-add-dialog"
        ref="dragTable"
        :data="tableSortData"
        style="width: 100%"
        row-key="id"
        border
        fit
        highlight-current-row
        max-height="500"
      >
        <el-table-column label="序号" type="index" width="150" align="center" />
        <el-table-column label="名称" prop="title" align="center" />
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button type="text" @click="moveUp(scope.$index, scope.row)">上移</el-button>
            <el-button type="text" @click="moveDown(scope.$index, scope.row)" style="color:#f56f6c">下移</el-button>
            <el-button type="text" @click="moveTop(scope.$index, scope.row)">置顶</el-button>
            <el-button type="text" @click="moveBottom(scope.$index, scope.row)" style="color:#f56f6c">置底</el-button>
            <el-button type="text" @click="customDo(scope.$index, scope.row)">指定位置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSortVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSortSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepMerge } from '@/assets/smms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as wareManageApi from '@/api/smms/shopingMall/wareManage'
import Sortable from 'sortablejs'
import Pagination from '@/components/smms/paginations/pagination'
import tableSort from '../../../../assets/smms/utils/tableSort/tableSort'

export default {
  components: { Pagination },
  mixins: [BaseQueryPageForm],
  inject: ['routerTo'],
  data () {
    const search = this.initQueryCriteria()
    return {
      tableSortData: {},
      sortable: null,
      oldList: [],
      newList: [],
      dialogSortVisible: false,
      selectID: [],
      search: search,
      selected: null,
      wareType: [],

      wareState: [
        {
          value: '1',
          label: '上架'
        },
        {
          value: '0',
          label: '下架'
        }
      ]
    }
  },
  mounted () {
    // // 判断店铺具备完整信息是否
    let shopImg = localStorage.getItem('shopInfo.img')
    if (
      shopImg === '' ||
      shopImg === null ||
      shopImg === undefined ||
      shopImg === 'null'
    ) {
      this.$alert('店铺信息缺失，请点击左侧店铺信息菜单，完善信息。', '', {
        confirmButtonText: '确定',
        callback: action => {
          this.routerTo('/shop')
        }
      })
    } else {
      this.executeQueryPage()
      this.getCategory()
      this.getWareTypeList()
    }
  },
  methods: {
    /* 商家类型对照 */
    wareTypeFormatter (row, c) {
      for (let i = 0; i < this.wareType.length; i++) {
        if (Object.is(this.wareType[i].value, row.categoryId)) {
          return this.wareType[i].label
        }
      }
    },
    getWareTypeList () {
      wareManageApi.getInfo({ isPage: 0, roleType: 1 }).then(res => {
        if (res.status === 200) {
          this.tableSortData = res.data
        } else {
          this.$message('获取数据失败')
        }
      })
    },
    /*  状态对照 */
    auditStateType (row, c) {
      const Ctype = {
        '-1': '未发起审核',
        '0': '等待审核',
        '1': '审核通过',
        '2': '审核未过'
      }
      return Ctype[row.auditState]
    },
    /*  状态对照 */
    shelfStateType (row, c) {
      const Ctype = { 1: '上架', 0: '下架' }
      return Ctype[row.shelfState]
    },
    /* 获取分类 */
    getCategory () {
      wareManageApi
        .getCategoryList()
        .then(res => {
          if (res.status === 200) {
            res.data.forEach((value, index) => {
              this.wareType.push({
                value: value.id,
                label: value.categoryName
              })
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取失败'
          })
        })
    },
    /* 商品改下列表 */
    onSortSubmit () {
      this.oldList = this.tableSortData.map(v => v.id)
      this.newList = this.oldList.slice()
      var list = []
      this.newList.forEach((value, index) => {
        list.push(index + 1)
      })
      wareManageApi.Sort({ ids: this.newList, sortIndexs: list }).then(res => {
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
    // 统一平台排序新加
    // 上移
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
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        roleType: 1,
        title: '',
        shelfState: '',
        categoryId: ''
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      wareManageApi.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      })
    },
    /* 列表删除 */
    customDelHandler (index, row) {
      wareManageApi.Delete(row.id).then(res => {
        this.IsSuccess(res)
        this.executeQueryPage()
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.executeQueryPage()
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
    /*  清楚查询条件 */
    handlerClear () {
      this.$router.push('wareFrom')
    },
    /* 商品排序 */
    toSort () {
      this.dialogSortVisible = true
      this.oldList = this.tableSortData.map(v => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    /* 按钮入口 */
    handlerButtons (T) {
      if (this.selectID.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择要操作的列表'
        })
        return
      }
      this.submitData(T)
    },
    //  按钮,置满,沽清,上架,下架
    handlerBtn (T) {
      switch (T) {
        case 'Full': // 置满
          wareManageApi.getFul(this.selectID).then(res => {
            this.selectID = []
            this.IsSuccess(res)
          })
          break
        case 'Clear': // 洁清
          wareManageApi.getEmpty(this.selectID).then(res => {
            this.selectID = []
            this.IsSuccess(res)
          })
          break
        case 'Top': // 上架
          wareManageApi
            .UpdateSort({
              ids: this.selectID,
              state: 1
            })
            .then(res => {
              this.selectID = []
              this.IsSuccess(res)
            })
          break
        case 'Down': // 下架
          wareManageApi
            .UpdateSort({
              ids: this.selectID,
              state: 0
            })
            .then(res => {
              this.selectID = []
              this.IsSuccess(res)
            })
          break
      }
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
.storTitle {
  color: red;
  font-size: 1em;
}
.addbtn {
  float: right;
}
</style>
