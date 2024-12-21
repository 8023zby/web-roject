<!--
  文件描述：商家账单
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
        <el-form-item label="账单时间：">
          <el-date-picker v-model="search.beginTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label=" 至 ">
          <el-date-picker v-model="search.endTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="商家名称：">
          <el-input v-model="search.shopName" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="search.state" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--   按钮查询 -->
          <div class="typt-search-btn">
            <el-button type="primary" class="el-button-radius" icon="el-icon-search" @click="queryHandler" size="small">搜索</el-button>
            <el-button type="text" @click="clsHandler">重置</el-button>
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
      <el-table v-loading="yh_loading" :data="pagination.list" stripe height="80%">
        <!-- <el-table-column label="序号" type="index" width="150" align="center" /> -->
        <el-table-column label="商家名称" prop="shopName" align="center" />
        <el-table-column label="账单日期" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.settleDate !== null"></span>
            {{ scope.row.settleDate.replace(' 00:00:00', '') }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state" :formatter="StateType" align="center" />
        <el-table-column label="结算金额(元)" prop="settleAmount" align="center" />
        <el-table-column label="结算时间" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.settledTime !== null">
              {{
              scope.row.settledTime.substring(0, 16)
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="el-button-text-color" @click="$emit('option-changed', 'detail', { row: scope.row })">查看详情</span>
            <span v-show="scope.row.state != 1" class="el-button-text-color" @click="pleaseHandler(scope.$index, scope.row)">结算</span>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
      <!--组件页码显示-->
      <!-- 分页码 -->
      <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    </div>
    <!--对话框-->
    <el-dialog :visible.sync="dialogSortVisible" title="结算" width="580px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="结算用户密码" prop="pass" label-width="120px">
          <el-input v-model="form.pass" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSortVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPass('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import { deepMerge } from '../../../../assets/smms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as wareBillApi from '../../../../api/smms/shopingMall/wareBill'
import Pagination from '../../../../components/smms/paginations/pagination'

import { getOneDate } from '../../../../assets/smms/utils/dateFormat.js'

export default {
  components: { Pagination },
  mixins: [BaseQueryPageForm],
  data () {
    const search = this.initQueryCriteria()

    return {
      yh_loading: false,
      dialogSortVisible: false,
      selectID: [],
      search: search,
      form: {
        pass: '',
        cuid: '',
        state: ''
      },
      options: [
        {
          value: '0',
          label: '待结算'
        },
        {
          value: '1',
          label: '已结算'
        }
      ],
      restaurants: [],
      rules: {
        pass: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.getShoplist()
  },
  methods: {
    /* 获取商家列表 */
    getShoplist () {
      wareBillApi.shopList().then(res => {
        this.IsSuccess(
          res,
          () => {
            this.restaurants = res.data
          },
          false
        )
      })
    },
    /*  状态对照 */
    StateType (row, c) {
      const Ctype = {
        0: '待结算',
        1: '已结算'
      }
      return Ctype[row.state]
    },

    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.shopName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        )
      }
    },

    /* 结算 */
    shopAccounts () {
      wareBillApi
        .shopAccounts({ id: this.form.cuid, state: this.form.state })
        .then(res => {
          this.IsSuccess(res)
          this.form = { pass: '', cuid: '', state: '' }
          this.dialogSortVisible = false
        })
    },
    /* 密码校验   等接口 */
    submitPass (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          /*  密码修改完成后清空 */
          const data = qs.stringify({
            id: this.form.cuid,
            userPassword: this.form.pass
          })
          wareBillApi.Pass(data).then(res => {
            if (res.status === 200 && res.data === true) {
              this.shopAccounts()
            } else {
              this.$message({
                type: 'error',
                message: '验证失败'
              })
            }
          })
        }
      })
    },
    /* 弹窗密码框 */
    pleaseHandler (index, row) {
      this.form.pass = ''
      this.dialogSortVisible = true
      this.form.cuid = row.id
      this.form.state = 1
    },
    /* 列表查询条件 */
    initQueryCriteria (form = {}) {
      const [beginTime, endTime] = getOneDate()
      return deepMerge(form, {
        state: '',
        shopName: '',
        endTime: endTime,
        beginTime: beginTime,
        roleType: 0
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      if (
        this.search.beginTime !== null &&
        this.search.beginTime !== '' &&
        this.search.beginTime.length === 10
      ) {
        this.search.beginTime += ' 00:00:00'
      }
      if (
        this.search.endTime !== null &&
        this.search.endTime !== '' &&
        this.search.endTime.length === 10
      ) {
        this.search.endTime += ' 23:59:59'
      }
      let y = this.CompareBeginEndTime(
        this.search.beginTime,
        this.search.endTime
      )
      if (y === 'n') {
        this.yh_loading = false
        return
      }
      wareBillApi
        .getshopAccounts(this.createQueryParams())
        .then(data => {
          this.IsSuccess(
            data,
            () => {
              this.queryResultHandler(data)
            },
            false
          )
        })
        .finally(() => {
          this.yh_loading = false
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
    }
  }
}
</script>

<style lang='scss'>
@import "@/assets/smms/css/self_common.scss";
</style>
