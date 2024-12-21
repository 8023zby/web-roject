<!--
  文件描述：商家管理-列表
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
        <el-form-item label="商家名称：">
          <el-input v-model="search.shopName" placeholder="请输入商家名称" prefix-icon="el-icon-search" size="small" />
        </el-form-item>
        <el-form-item label="商家状态：">
          <el-select v-model="search.isEnable" placeholder="请选择商家状态" size="small">
            <el-option v-for="item in businessState" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="上架审核：">
          <el-select v-model="search.auditByHospital" placeholder="请选上架审核" size="small">
            <el-option v-for="item in businessAudit" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--   按钮查询 -->
          <div class="typt-search-btn">
            <el-button type="primary" icon="el-icon-search" class="el-button-radius" @click="query" size="small">搜索</el-button>
            <el-button type="text" @click="handleReset" size="small">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <!-- 添加 ,排序 按钮  -->
        <el-button type="warning" size="small" icon="el-icon-plus" @click="$emit('transfer', 'add')">添加</el-button>

        <div class="action_div">
          <!-- 右侧排序  -->
          <el-button type="primary" size="small" :disabled="pagination.list && pagination.list.length <= 0" @click="toSort()">排序</el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="pagination.list && pagination.list.length <= 0"
            @click="handlerButtons('Enable')"
          >启用</el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="pagination.list && pagination.list.length <= 0"
            @click="handlerButtons('Disable')"
          >停用</el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="pagination.list && pagination.list.length <= 0"
            @click="handlerButtons('unlock')"
          >解锁</el-button>
        </div>
      </div>
      <!--列表-->
      <!-- table -->
      <el-table
        v-loading="yh_loading"
        :data="pagination.list"
        style="width: 100%"
        select-all
        stripe
        height="80%"
        @select="handleSelect"
        @select-all="handleALL"
        v-if="showTableVisable"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>
              {{
              scope.$index + (pagination.page - 1) * pagination.size + 1
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="商家名称" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isFrozen === 1" style="color: red">
              {{
              scope.row.shopName
              }}
            </span>
            <span v-else>{{ scope.row.shopName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="landPhone" align="center" />
        <el-table-column label="商家状态" prop="isEnable" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isEnable"
              :active-color="activeColor"
              :active-value="1"
              :inactive-value="2"
              @change="UpdateStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="200" align="center">
          <template slot-scope="scope">
            {{
            scope.row.createTime.substring(0, scope.row.createTime.length - 3)
            }}
          </template>
        </el-table-column>
        <el-table-column label="上架审核" prop="auditByHospital" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.auditByHospital"
              :active-color="activeColor"
              :active-value="1"
              :inactive-value="0"
              @change="isAuditByHospital(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="$emit('transfer', 'edit', scope.row)" size="small">编辑</el-button>
            <!-- <el-button type="danger"
                         size="small"
            @click="delHandler(scope.$index, scope.row)">删除</el-button>-->
            <el-button type="text" @click="resetPassword(scope.row)" size="small">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--组件页码显示-->
      <!-- 分页码 -->
      <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    </div>

    <!----排序------>
    <el-dialog
      custom-class="businessDialog"
      title="排序"
      :visible.sync="dialogSortVisible"
      width="780px"
      :close-on-click-modal="false"
      v-if="dialogSortVisible"
      @close="executeQueryPage"
    >
      <table-sort filedName="shopName" T="business" tit="商家名称" :tabIndex="this.tabIndex"></table-sort>
    </el-dialog>
  </div>
</template>

<script>
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as businessManageApi from '../../../../api/smms/shopingMall/businessManage'
import mains from './mains'
import Pagination from '@/components/smms/paginations/pagination'

import tableSort from '@/components/smms/tableSort'

export default {
  components: {
    Pagination,
    tableSort
  },
  mixins: [BaseQueryPageForm, mains],
  props: {},
  data() {
    return {
      yh_loading: false,
      showVisible: false,
      showTableVisable: false,
      tabIndex: 0,
      isFrozenStatus: [], // 商户锁定状态
      dialogSortVisible: false,
      // 表格数据
      pagination: {},
      // 排序数据
      sortData: {},
      // 按钮是否禁用
      isBtnDisabled: false,
      selectID: [],
      search: {
        shopName: '',
        shopType: 0,
        isEnable: '',
        auditByHospital: ''
      },
      businessState: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '启用',
          value: 1
        },
        {
          label: '停用',
          value: 2
        }
      ],
      businessAudit: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      sortable: null,
      oldList: [],
      newList: []
    }
  },
  mounted() {
    // 获取所有商户的锁定状态
    this.getLockStatus(() => {
      this.init()
    })
  },
  methods: {
    init() {
      let _this = this
      _this.showVisible = true
      _this.showTableVisable = false
      _this.$nextTick(() => {
        _this.search.shopName = ''
        _this.search.shopType = this.tabIndex === '' ? '0' : this.tabIndex
        _this.search.isEnable = ''
        _this.search.auditByHospital = ''
        _this.initPagination(this.pagination)
        _this.executeQueryPage()
      })
    },
    // 搜索
    query() {
      this.initPagination(this.pagination)
      this.getLockStatus(() => {
        this.executeQueryPage()
      })
    },
    /* 清楚查询条件 */
    handleReset() {
      this.search = {
        shopName: '',
        isEnable: '',
        auditByHospital: '',
        shopType: this.tabIndex === '' ? '0' : this.tabIndex
      }
      this.initPagination(this.pagination)
      this.getLockStatus(() => {
        this.queryHandler()
      })
    },
    /* 列表删除 */
    customDelHandler(index, row) {
      businessManageApi.DeleteBase(row.id).then(() => {
        businessManageApi.Delete(row.id).then(res => {
          this.IsSuccess(res)
        })
      })
    },
    // 启用停用开关
    UpdateStatus(row) {
      businessManageApi
        .UpdateStatusBase({
          ids: row.id,
          status: row.isEnable
        })
        .then(res => {
          if (res.status === 200) {
            businessManageApi
              .UpdateStatus({
                ids: row.id,
                status: row.isEnable
              })
              .then(res => {
                this.IsSuccess(res)
                row.isEnable = !row.isEnable
              })
          } else {
            this.IsSuccess(res)
          }
        })
        .catch(() => {
          // 回滚状态
          row.isEnable = row.isEnable === 1 ? 2 : 1
        })
    },
    // 上架审核开关
    isAuditByHospital(row) {
      businessManageApi
        .isAuditByHospital(row)
        .then(res => {
          this.createQueryParams()
          this.IsSuccess(res)
        })
        .catch(() => {
          // 回滚状态
          row.auditByHospital = !row.auditByHospital
        })
    },
    // 重置密码
    resetPassword(row) {
      this.$confirm('确定要重置密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          businessManageApi.resetPassword(row.id).then(res => {
            this.IsSuccess(res)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    /* 全选 */
    handleALL(val) {
      this.handleSelect(val)
    },
    // 获取当前选中的数据
    handleSelect(row) {
      this.selectID = []
      if (row.length > 0) {
        row.forEach((value, index) => {
          this.selectID.push(value.id)
        })
      }
    },
    /* 按钮入口 */
    handlerButtons(T) {
      if (this.selectID.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择要操作的列表'
        })
        return
      }
      this.submitData(T)
    },
    //  启用,停用,重置密码,解锁
    handlerBtn(T) {
      switch (T) {
        case 'Enable': // 启用
          businessManageApi
            .UpdateStatusBase({
              ids: this.selectID,
              status: 1
            })
            .then(res => {
              if (res.status === 200) {
                businessManageApi
                  .UpdateStatus({
                    ids: this.selectID,
                    status: 1
                  })
                  .then(res => {
                    this.IsSuccess(res)
                  })
              } else {
                this.IsSuccess(res)
              }
            })
          break
        case 'Disable': // 停用
          businessManageApi
            .UpdateStatusBase({
              ids: this.selectID,
              status: 2
            })
            .then(res => {
              if (res.status === 200) {
                businessManageApi
                  .UpdateStatus({
                    ids: this.selectID,
                    status: 2
                  })
                  .then(res => {
                    this.IsSuccess(res)
                  })
              } else {
                this.IsSuccess(res)
              }
            })
          break
        case 'resetPassword': // 重置密码
          businessManageApi
            .resetPassword({
              ids: this.selectID,
              status: 2
            })
            .then(res => {
              this.IsSuccess(res)
            })
          break
        case 'unlock': // 解锁
          businessManageApi
            .unlock({
              ids: this.selectID
            })
            .then(res => {
              this.selectID = [] // 清空
              if (res.status === 200) {
                this.$message({
                  type: 'success',
                  message: '解锁成功'
                })
                this.getLockStatus(() => {
                  this.init()
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '解锁失败'
                })
              }
            })
          break
      }
    },
    // 弹出排序
    toSort() {
      this.dialogSortVisible = true
    }
  }
}
</script>
<style lang='scss'>
@import '@/assets/smms/css/self_common.scss';
.list-page-new {
  .el-main {
    .el-table {
      height: 100% !important;
    }
  }
  @media screen and (max-height: 768px) {
    .el-main {
      .el-table {
        height: 90% !important;
      }
    }
    .el-footer {
      margin-bottom: 20px;
    }
  }
}
.businessDialog {
  .el-dialog__body {
    height: 500px;
  }
}
</style>
