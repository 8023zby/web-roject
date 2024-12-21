<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form ref="search"
             :inline="true"
             class="typt-list-search">
      <el-form-item label="留言类型:">
        <el-input v-model="search.name"></el-input>
      </el-form-item>

      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button @click="queryHandler"
                     type="primary"
                     icon="el-icon-search"
                     size="small">搜索</el-button>
          <el-button type="text"
                     @click="clsHandler">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--查询条件模块 === END-->
    <hr />

    <!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button type="warning"
                 icon="el-icon-plus"
                 @click="$emit('option-changed','addEdit',{type:'add'})"
      >添加</el-button>
      <!--右侧区域按钮-->
      <div class="action_div"></div>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <el-table :data="pagination.list"
              height="100%"
              stripe
              highlight-current-row
              v-loading="yh_loading">
      <!-- <el-table-column prop="sortIndex"
                       align="center"
                       label="序号"
                       width="100">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="留言类型"
                       prop="name"
                       align="center"
                       width="500"></el-table-column>
      <el-table-column label="描述"
                       prop="remark"
                       :show-overflow-tooltip = "true"
                       align="center" />

      <el-table-column label="操作"
                       align="center"
                       width="360">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="$emit('option-changed','addEdit',{type:'edit',row : scope.row})"
                     size="mini">编辑</el-button>

          <el-button type="text"
                     @click="customDelHandler(scope.$index, scope.row, 'del')"
                     size="mini"
                     style="color:#F56C6C">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--表格主体 ==== END-->

    <!--分页条-->
    <pagination :pagination="pagination"
                @page-size-changed="pageSizeChangeHandler"
                @page-changed="pageChangeHandler" />
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <div class="message_dialog">
      </div>
    </slot>
  </div>
</template>

<script>
import { deepMerge } from '@/assets/wnms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as API from '@/api/wnms//msgManage/leaveMsg'
import Pagination from '@/components/wnms/paginations/pagination'
import mixins from './mixin'
import { selectDeptInfo } from '@/assets/wnms/utils/common'
export default {
  components: { Pagination },
  mixins: [BaseQueryPageForm, mixins],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },

  data () {
    const search = this.initQueryCriteria()
    const form = this.initForm()
    const rulesForm = this.initRules()
    return {
      yh_loading: false,
      search: search,
      form: form,
      rulesForm: rulesForm,
      submitLoading: false, // 提交loading
      inputLimitShow: false, // 名称最大长度显示
      textLimitShow: false // 留言最大长度显示
    }
  },
  mounted () {
    this.executeQueryPage()
  },
  methods: {
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        groupName: 'LeaveMessage',
        name: '',
        deptId: selectDeptInfo()
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      let params = this.createQueryParams()
      params.deptId = selectDeptInfo()
      API.getInfo(params).then(data => {
        this.queryResultHandler(data)
      }).finally(() => {
        this.yh_loading = false
      })
    },
    /* 列表删除 */
    customDelHandler (index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        API.Delete(row.id).then(res => {
          this.IsSuccess(res)
          // this.executeQueryPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.queryHandler()
    }
  }
}
</script>
<style lang='scss' >
@import '@/assets/wnms/css/self_common.scss';

  .el-tooltip__popper{
    width: 20vw;
  }
</style>
