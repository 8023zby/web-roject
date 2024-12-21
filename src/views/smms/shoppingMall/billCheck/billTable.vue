<!--
  文件描述：账目查看列表页
    主样式class：list-page-new
  创建时间：2020/4/15 13:19
  创建人：Adsmallstrator

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
        <el-form-item label="账单状态：">
          <el-select v-model="form.state" placeholder="活动区域" size="small">
            <el-option label="全部" value="null" />
            <el-option label="待结算" value="0" />
            <el-option label="已结算" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="账单时间：">
          <el-date-picker @change="changeDate()" v-model="createTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择" end-placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary" @click="onSubmit" class="el-button-radius" icon="el-icon-search" size="small">搜索</el-button>
            <el-button type="text" @click="reSearch" size="small">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item style="float:right;">
          <!--   按钮查询 -->
          <div class="typt-search-btn">
            <el-button @click="exportExcel" size="small" style="background-color: #01c3a3; color: #fff">导出对账单</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <!-- 添加 ,排序 按钮  -->
      </div>
      <!--列表-->
      <!-- table -->
      <el-table v-loading="yh_loading" :data="pagination.list" height="100%">
        <el-table-column label="序号" type="index" width="155" align="center">
          <template slot-scope="scope">
            <span>
              {{
              scope.$index + (pagination.page - 1) * pagination.size + 1
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="账单时间" width align="center">
          <template slot-scope="scope">
            {{
            scope.row.settleDate.replace(' 00:00:00', '')
            }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width align="center">
          <template slot-scope="scope">
            {{
            scope.row.state == 0 ? '待结算' : '已结算'
            }}
          </template>
        </el-table-column>
        <el-table-column label="结算金额（元）" width prop="settleAmount" align="center" />
        <el-table-column label="结算时间" width prop="settledTime" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state !== 0">
              {{
              scope.row.settledTime
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="el-button-text-color" @click="$emit('billDetails', scope.$index, scope.row)">查看详情</span>
          </template>
        </el-table-column>
      </el-table>
      <!--组件页码显示-->
      <!-- 分页码 -->
      <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    </div>
    <!--新增房间对话框-->
  </div>
</template>
<script>
import { queryBill } from '../../../../api/smms/shopingMall/billCheck'
import dateFormat from '../../../../assets/smms/utils/dateFormat'
import { exportExecl } from '../../../../assets/smms/utils/exportExcel'
import getStorageUser from '../../../../assets/smms/utils/storageUser'
import Pagination from '@/components/smms/paginations/pagination'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'

export default {
  name: 'BillTable',
  mixins: [BaseQueryPageForm],
  components: { Pagination },
  data () {
    return {
      evaluationSynthesis: null,
      yh_loading: false,
      page: 1,
      size: 10,
      total: 0,
      form: {
        state: 'null',
        beginTime: '',
        endTime: ''
      },
      data: '',
      tableData: [
        {
          settleDate: '',
          state: 1,
          settleAmount: '',
          settledTime: ''
        }
      ],
      roleType: '',
      createTime: []
    }
  },
  inject: ['routerTo'],
  mounted: function () {
    const endDate = dateFormat(new Date(), 'yyyy-MM-dd')
    const beginDate = this.nDay(-29)
    this.createTime.push(beginDate)
    this.createTime.push(endDate)
    this.form.beginTime = this.createTime[0]
    this.form.endTime = this.createTime[1]

    this.isCompleteInfo(true)
  },
  methods: {
    changeDate () {
      if (this.createTime) {
        this.form.beginTime = this.createTime[0]
        this.form.endTime = this.createTime[1]
      } else {
        this.form.beginTime = ''
        this.form.endTime = ''
      }
    },
    // 判断是否需要完善店铺信息
    isCompleteInfo (t) {
      const _this = this
      let shopImg = localStorage.getItem('shopInfo.img')
      if (
        shopImg === '' ||
        shopImg === null ||
        shopImg === undefined ||
        shopImg === 'null'
      ) {
        if (t) {
          _this.isWholeInfo(res => {
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
        this.executeQueryPage()
      }
    },
    // 查询
    onSubmit () {
      this.page = 1
      this.size = 10
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },
    //  清空筛选条件
    reSearch () {
      const endDate = dateFormat(new Date(), 'yyyy-MM-dd')
      const beginDate = this.nDay(-29)
      this.createTime = []
      this.createTime.push(beginDate)
      this.createTime.push(endDate)
      this.form.beginTime = beginDate
      this.form.endTime = endDate

      this.form.state = 'null'
      this.page = 1
      this.size = 10
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },
    // 获取n天之后的日期
    nDay (day) {
      const today = new Date()
      const milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(milliseconds)
      const tYear = today.getFullYear()
      let tMonth = today.getMonth()
      let tDate = today.getDate()
      tMonth = this.doHandleMonth(tMonth + 1)
      tDate = this.doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate
    },
    doHandleMonth (month) {
      let m = month
      if (month.toString().length === 1) {
        m = '0' + month
      }
      return m
    },
    // 查看账单
    executeQueryPage () {
      if (this.form.beginTime === '' || this.form.endTime === '') {
        this.$message({
          message: '请选择账单时间',
          type: 'warning'
        })
        return
      }

      this.yh_loading = true
      let y = this.CompareBeginEndTime(this.form.beginTime, this.form.endTime)
      if (y === 'n') {
        this.yh_loading = false
        return
      }

      queryBill({
        beginTime:
          this.form.beginTime === null || this.form.beginTime === ''
            ? ''
            : this.form.beginTime + ' 00:00:00',
        endTime:
          this.form.endTime === null || this.form.endTime === ''
            ? ''
            : this.form.endTime + ' 23:59:59',
        state: this.form.state === 'null' ? '' : Number(this.form.state),
        roleType: 1,
        isPage: 1,
        /* page: this.page,
        size: this.size */
        size: this.pagination.size,
        page: this.pagination.page
      })
        .then(res => {
          this.IsSuccess(
            res,
            () => {
              this.queryResultHandler(res)
            },
            false
          )
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
        .finally(() => {
          this.yh_loading = false
        })
    },
    // 查看账单详情
    billDetails (index, row) {
      this.tableShow = false
    },
    // 分页方法
    handleSizeChange (val) {
      this.size = val
      this.executeQueryPage()
    },
    handleCurrentChange (val) {
      this.page = val
      this.executeQueryPage()
    },
    // 导出表格
    exportExcel () {
      if (this.form.beginTime === null || this.form.endTime === null) {
        this.$message.error('请选择起止时间！')
        return
      }
      let fileName = this.form.beginTime + '至' + this.form.endTime + '对账单'

      // 导出表格
      const param = {
        page: this.page,
        size: this.size,
        beginTime: this.form.beginTime + ' 00:00:00',
        endTime: this.form.endTime + ' 23:59:59',
        state: this.form.state === 'null' ? '' : Number(this.form.state),
        shopId: getStorageUser(`orgInfo`).orgId,
        shopName: getStorageUser(`orgInfo`).orgName
      }
      exportExecl('/smms/web-sm/shopAccounts/exportExecl', param, fileName)
    }
  }
}
</script>

<style lang='scss'>
@import "@/assets/smms/css/self_common.scss";
</style>
