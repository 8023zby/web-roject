
<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true">
        <!--   查询条件 -->
        <el-form-item label="商家名称：">
          <el-select v-model="shopId" placeholder="请选择">
            <el-option label="全部" value />
            <el-option
              v-for="item in shopNames"
              :key="item.shopId"
              :label="item.shopName"
              :value="item.shopId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-input v-model="wareName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="auditState" placeholder="请选择">
            <el-option label="全部" value />
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--   按钮查询 -->
          <div class="typt-search-btn">
            <el-button
              type="primary"
              @click="queryList()"
              class="el-button-radius"
              icon="el-icon-search"
            >搜索</el-button>
            <el-button type="text" @click="reset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <!-- 添加 ,排序 按钮  -->
        <div class="action_div">
          <el-button type="primary" @click="checkPL()" :disabled="shopTotal == 0">批量审核</el-button>
        </div>
      </div>
      <!--列表-->
      <!-- table -->
      <el-table
        v-loading="yh_loading"
        :data="pagination.list"
        style="width: 100%"
        height="80%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          sortable
          align="center"
          :selectable="isCanCheck"
        />
        <el-table-column label="商家名称" prop="shopName" align="center" />
        <el-table-column label="商品名称" prop="title" align="center" />
        <el-table-column label="审核状态" prop="auditState" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.auditState == '0'">等待审核</div>
            <div v-else-if="scope.row.auditState == '1'">审核通过</div>
            <div v-else-if="scope.row.auditState == '2'">审核未过</div>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" prop="auditTime" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$emit('option-changed', 'detail', { row: scope.row })"
            >商品详情</el-button>
            <el-button
              type="text"
              @click="$emit('option-changed', 'wareOnshelfListLog', {  row: scope.row})"
            >审核记录</el-button>
            <el-button
              type="text"
              :disabled="scope.row.auditState !== 0"
              @click="toCheck(scope.row.id)"
            >审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--组件页码显示-->
      <!-- 分页码 -->
      <pagination
        :pagination="pagination"
        @page-size-changed="pageSizeChangeHandler"
        @page-changed="pageChangeHandler"
      />
    </div>
    <!--新增房间对话框-->
    <el-dialog
      title="审核"
      :visible.sync="showCheckVisiblewin"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="btn-group">
        <el-form :inline="true" label-width="100px" class="typt-add-dialog">
          <el-form-item label="审核结果：">
            <el-select v-model="form.state" placeholder="请选择" style="width: 300px">
              <el-option label="通过" value="1" />
              <el-option label="不通过" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="form.remark" placeholder="请输入" style="width: 300px" size="small" maxlength="200" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCheckVisiblewin = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryList, updateCheck, getBusinessInfo
} from '../../../../api/smms/shopingMall/wareOnshelfList'
import Pagination from '@/components/smms/paginations/pagination'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'

export default {
  name: 'WareCheckList',
  mixins: [BaseQueryPageForm],
  components: { Pagination },
  data () {
    return {
      yh_loading: false,
      tableData: [],
      checkLogData: [],
      shopName: '',
      wareName: '',
      auditState: '',
      auditStateLog: '',
      shopId: '',
      allWare: '',
      currentPage: 1,
      sizeNum: 10,
      dataTotal: 0,
      logCurrentPage: 1,
      logSizeNum: 10,
      logDataTotal: 0,
      showDialogTitle: '商品详情',
      showCheckVisiblewin: false,
      multipleSelection: [],
      form: {
        title: '',
        categoryName: '',
        mainImage: '',
        waredesc: '',
        showGG: '',
        showSX: '',
        shelfState: '',
        remark: '',
        ids: '',
        state: ''
      },
      options: [
        { value: '0', label: '等待审核' },
        { value: '1', label: '审核通过' },
        { value: '2', label: '审核未过' }
      ],
      logOptions: [
        { value: '1', label: '审核通过' },
        { value: '2', label: '审核未过' }
      ],
      shopNames: [],
      role: '',
      queryFirst: true,
      wareId: '',
      shopTotal: 0
    }
  },
  mounted: function () {
    // this.role = String(getStorageUser('orgInfo').orgLevel) === '4' ? 1 : 0
    this.queryShop()
    this.executeQueryPage()
  },
  methods: {
    isCanCheck (row, index) {
      if (row.auditState !== 0) {
        return 0
      } else {
        return 1
      }
    },
    // 查询商家
    queryShop () {
      getBusinessInfo({ shopType: '', isPage: 0 }).then(res => {
        if (this.queryFirst) {
          const shopOjb = {}
          for (const i of res.data) {
            shopOjb[i.id] = i.shopName
          }
          this.shopNames = []
          for (const i in shopOjb) {
            this.shopNames.push(
              { 'shopId': i, 'shopName': shopOjb[i] })
          }
          this.queryFirst = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    reset () {
      this.shopId = ''
      this.title = ''
      this.auditState = ''
      this.wareName = ''
      this.sizeNum = 10
      this.currentPage = 1
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },
    queryList () {
      this.sizeNum = 10
      this.currentPage = 1
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },
    executeQueryPage () {
      this.yh_loading = true
      queryList({
        roleType: this.role,
        shopId: this.shopId,
        title: this.wareName,
        auditState: this.auditState,
        size: this.pagination.size,
        page: this.pagination.page,
        pageHelper: '1'
      })
        .then(res => {
          this.IsSuccess(res, () => {
            this.shopTotal = res.data.total
            this.queryResultHandler(res)
          }, false)
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        }).finally(() => {
          this.yh_loading = false
        })
    },
    toCheck (id) {
      this.showCheckVisiblewin = true
      // this.allWare = title
      this.form.ids = id
      this.form.state = '1'
      this.form.remark = ''
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      const idarr = []
      const titlearr = []
      this.multipleSelection.forEach((item) => {
        idarr.push(item.id)
        titlearr.push(item.title)
      })
      this.form.ids = idarr.join(',')
      this.allWare = titlearr.join(',')
    },
    checkPL () {
      if (this.multipleSelection.length !== 0) {
        this.showCheckVisiblewin = true
        this.form.state = '1'
        this.form.remark = ''
      } else {
        this.$message('请先选择要审核的商品')
      }
    },
    // 提交表单
    onSubmit (form) {
      updateCheck(this.form.ids, this.form.state, this.form.remark === '' ? this.form.remark = null : this.form.remark)
        .then(res => {
          if (res.status === 200) {
            this.showCheckVisiblewin = false
            this.queryList()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '' + res.desc,
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.log(error)
          // this.$message.error(JSON.stringify(error) + '添加失败')
        })
    }
  }
}
</script>
<style lang='scss'>
@import '@/assets/smms/css/self_common.scss';
.list-page-new
  .el-main
  .el-table
  .el-table__header
  /deep/
  th
  > .cell:first-child {
  padding-left: 14px;
}
</style>
