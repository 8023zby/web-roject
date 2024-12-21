
<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true">
        <!--   查询条件 -->
        <el-form-item label="审核状态：">
          <el-select v-model="search.auditState" placeholder="请选择">
            <el-option label="全部" value />
            <el-option
              v-for="item in logOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--   按钮查询 -->
          <div class="typt-search-btn">
            <el-button type="primary" @click="queryHandler" icon="el-icon-search">搜索</el-button>
            <el-button type="text" @click="clsHandler">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <!-- 添加 ,排序 按钮  -->
        <div class="action_div">
          <!-- 右侧排序  -->
          <el-button type="primary" @click="backHandler">返回</el-button>
        </div>
      </div>
      <!--列表-->
      <!-- table -->
      <!--组件页码显示-->
      <el-table v-loading="yh_loading" :data="pagination.list" style="width: 100%" height="80%">
        <el-table-column label="序号" type="index" width="155" align="center" />
        <el-table-column label="审核人" prop="userName" align="center" />
        <el-table-column label="审核结果" prop="auditState" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.auditState=='0'">等待审核</div>
            <div v-else-if="scope.row.auditState=='1'">审核通过</div>
            <div v-else-if="scope.row.auditState=='2'">审核未过</div>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" prop="applyTime" align="center" />
        <el-table-column label="审核时间" prop="auditTime" align="center" />
        <el-table-column label="备注" prop="remark" width="400" align="center">
          <template slot-scope="scope">
            <div
              style="width: 100%;text-align: left;-webkit-line-clamp:1;"
              class="div-word-ellipsis"
            >{{scope.row.remark===null?'':scope.row.remark}}</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页码 -->
      <pagination
        :pagination="pagination"
        @page-size-changed="pageSizeChangeHandler"
        @page-changed="pageChangeHandler"
      />
    </div>
    <!--新增房间对话框-->
  </div>
</template>

<script>
import { queryLogList } from '@/api/smms/shopingMall/wareOnshelfList'
import Pagination from '@/components/smms/paginations/pagination'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import { deepMerge } from '@/assets/smms/utils'
export default {
  name: 'wareOnshelfListLog',
  // import引入的组件需要注入到对象中才能使用
  mixins: [BaseQueryPageForm],
  components: { Pagination },
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  data () {
    // 这里存放数据
    const search = this.initQueryCriteria()
    return {
      search: search,
      yh_loading: false,
      logOptions: [
        { value: '1', label: '审核通过' },
        { value: '2', label: '审核未过' }
      ]
    }
  },
  mounted () {
    this.executeQueryPage()
  },
  // 方法集合
  methods: {
    backHandler (data) {
      this.$emit('option-changed', 'wareOnshelfList')
    },

    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        wareId: this.detail.row.id,
        auditState: this.auditState,
      })
    },

    executeQueryPage () {
      this.yh_loading = true
      console.log(this.detail.row.id)
      queryLogList(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      }).finally(() => {
        this.yh_loading = false
      })
    },
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.executeQueryPage()
    },

  },
}
</script>

<style lang='scss'>
@import '@/assets/smms/css/self_common.scss';
.wareOnshelfListLog-elform {
  padding: 0 15px;
  .el-form-item {
    margin-bottom: 2px;
  }
}
</style>
