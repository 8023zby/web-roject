<!--
  文件描述：商家账单详情列表
    主样式class：list-page-new
  创建时间：2020/4/15 13:19
  创建人：Administrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
  关于主体查询方法，方法名为：executeQueryPage
  表格数据变量为：pagination.list

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->

<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true">
        <!--   查询条件 -->
        <el-form-item>
          <!--   按钮查询 -->
          <div class="typt-search-btn"></div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <!-- 添加 ,排序 按钮  -->
        <div class="action_div">
          <!-- 右侧排序  -->
          <el-button type="primary" size="small" @click="backHandler"
            >返回</el-button
          >
        </div>
      </div>
      <!--列表-->
      <!-- table -->
      <el-table :data="pagination.list" height="100%" stripe>
        <el-table-column label="序号" type="index" width="150" align="center" />
        <el-table-column label="订单编号" prop="id" align="center" />
        <el-table-column label="完成时间" prop="endTime" align="center" />
        <el-table-column
          label="商品(元)"
          prop="waresTotalAmount"
          align="center"
        />
        <el-table-column label="包装费(元)" prop="packingFee" align="center" />
        <el-table-column label="配送费(元)" prop="deliveryFee" align="center" />
        <!--<el-table-column label="共计(元)" prop="totalAmount" align="center" />-->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span
              class="el-button-text-color"
              size="mini"
              @click="billHandler(scope.$index, scope.row)"
              >查看详情</span
            >
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
    <!--账单详情-->
    <el-dialog :visible.sync="dialogSortVisible" width="500px" title="订单详情">
      <el-form label-width="100px" class="ifms-add-dialog">
        <el-form-item label="订单编号:">
          <span>{{ form.id }}</span>
        </el-form-item>
        <el-form-item label="支付时间:">
          <span>{{ form.title }}</span>
        </el-form-item>
        <el-form-item label="完成时间:">
          <span>{{ form.endTime }}</span>
        </el-form-item>
        <el-form-item label="商品总额:">
          <span>{{ form.waresTotalAmount }}</span>
        </el-form-item>
        <el-form-item label="包装费:">
          <span>{{ form.packingFee }}</span>
        </el-form-item>
        <el-form-item label="配送费:">
          <span>{{ form.deliveryFee }}</span>
        </el-form-item>
        <el-form-item label="共计:" prop="cuPass">
          <span>{{
            form.deliveryFee + form.packingFee + form.waresTotalAmount
          }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { deepMerge } from '../../../../assets/smms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as wareBillApi from '../../../../api/smms/shopingMall/wareBill'
import Pagination from '../../../../components/smms/paginations/pagination'

export default {
  components: { Pagination },
  mixins: [BaseQueryPageForm],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  data () {
    const search = this.initQueryCriteria()
    return {
      dialogSortVisible: false,
      selectID: [],
      search: search,
      cuPass: '',
      form: {}
    }
  },
  mounted () { },
  methods: {
    /* 账单查看弹窗 */
    billHandler (index, row) {
      this.dialogSortVisible = true
      this.form = row
    },
    /* 密码校验   等接口 */
    submitPass () {
      wareBillApi.Pass().then(res => {
        this.IsSuccess(res)
      })
    },
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        title: '',
        shelfState: '',
        auditSate: ''
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      this.search = {
        beginTime: this.detail.row.settleDate,
        endTime: this.detail.row.settleDate.substring(0, 11) + '23:59:59',
        shopId: this.detail.row.shopId,
        states: '4'
      }

      wareBillApi.getInfo(this.createQueryParams()).then(res => {
        this.queryResultHandler(res)
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = {
        title: '',
        shelfState: '',
        auditSate: ''
      }
    },
    /* 全选 */
    handleALL (val) {
      this.handleSelect(val)
    },
    // 获取当前选中的数据
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
    backHandler (data) {
      this.$emit('option-changed', 'list')
    }
  }
}
</script>

<style lang='scss'>
@import '@/assets/smms/css/self_common.scss';
.ifms-add-dialog {
  .el-form-item {
    margin-bottom: 1px;
  }
}
</style>
