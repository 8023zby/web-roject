<!--
  文件描述：账单详情列表
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
          <el-button
            type="primary"
            size="small"
            @click="$emit('backList', 'list')"
            >返回</el-button
          >
        </div>
      </div>
      <!--列表-->
      <!-- table -->
      <el-table
        :data="pagination.list"
        height="80%"
        align="center"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" align="center" width="55" />
        <el-table-column label="订单编号" prop="id" align="center" />
        <el-table-column label="完成时间" prop="endTime" align="center" />
        <el-table-column
          label="商品（元）"
          prop="waresTotalAmount"
          align="center"
        />
        <el-table-column
          label="包装费（元）"
          prop="packingFee"
          align="center"
        />
        <el-table-column
          label="配送费（元）"
          prop="deliveryFee"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span
              class="el-button-text-color"
              @click="eventDetails(scope.$index, scope.row)"
              >订单详情</span
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
    <!--新增房间对话框-->
    <!--订单详情-->
    <el-dialog title="订单详情" :visible.sync="formVisible" width="40%">
      <el-form>
        <el-form-item label="订单编号：" :label-width="formLabelWidth">
          <label>{{ dialogDet.id }}</label>
        </el-form-item>
        <el-form-item label="支付时间：" :label-width="formLabelWidth">
          <label>{{ dialogDet.payTime }}</label>
        </el-form-item>
        <el-form-item label="完成时间：" :label-width="formLabelWidth">
          <label>{{ dialogDet.endTime }}</label>
        </el-form-item>
        <el-form-item label="商品金额：" :label-width="formLabelWidth">
          <label>{{ dialogDet.waresTotalAmount }}</label>
        </el-form-item>
        <el-form-item label="包装费：" :label-width="formLabelWidth">
          <label>{{ dialogDet.packingFee }}</label>
        </el-form-item>
        <el-form-item label="配送费：" :label-width="formLabelWidth">
          <label>{{ dialogDet.deliveryFee }}</label>
        </el-form-item>
        <el-form-item label="共计：" :label-width="formLabelWidth">
          <label>{{ dialogDet.totalAmount }}</label>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="formVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { billDetails } from '../../../../api/smms/shopingMall/billCheck'
import Pagination from '@/components/smms/paginations/pagination'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'

export default {
  name: 'BillDetails',
  mixins: [BaseQueryPageForm],
  components: { Pagination },
  props: {
    rowDetails: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      page: 1,
      size: 10,
      total: 0,
      tableData: [{
        settleDate: '',
        state: 1,
        settleAmount: '',
        settledTime: ''
      }],
      dialogDet: {
        id: '', // 订单编号
        payTime: '', // 支付时间
        endTime: '', // 完成时间
        waresTotalAmount: '', // 商品总金额
        packingFee: '', // 包装费
        deliveryFee: '', // 配送费
        totalAmount: '' // 总金额
      },
      formVisible: false,
      formLabelWidth: '120px',
      shopId: ''
    }
  },
  mounted: function () {
    this.executeQueryPage()
    console.log(this.rowDetails)
  },
  methods: {
    eventDetails (index, row) {
      this.formVisible = true
      this.dialogDet.id = row.id
      this.dialogDet.payTime = row.payTime
      this.dialogDet.endTime = row.endTime
      this.dialogDet.waresTotalAmount = row.waresTotalAmount
      this.dialogDet.packingFee = row.packingFee
      this.dialogDet.deliveryFee = row.deliveryFee
      this.dialogDet.totalAmount = row.totalAmount
    },
    // 查看账单
    executeQueryPage () {
      billDetails({
        beginTime: this.rowDetails.settleDate,
        endTime: this.rowDetails.settleDate.substring(0, 11) + '23:59:59',
        shopId: this.rowDetails.shopId,
        isPage: 1,
        size: this.pagination.size,
        page: this.pagination.page
      })
        .then(res => {
          this.queryResultHandler(res)
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
    },
    // 分页方法
    handleSizeChange (val) {
      this.size = val
      this.executeQueryPage()
    },
    handleCurrentChange (val) {
      this.page = val
      this.executeQueryPage()
    }
  }
}
</script>

<style lang='scss'>
@import '@/assets/smms/css/self_common.scss';
</style>
