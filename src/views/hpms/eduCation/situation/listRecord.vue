<template>
  <div class="typt-list-container">
    <!--查询+表格-->
    <div class="QueryList">
      <!-- 查询条件 -->
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="文章标题">
            <el-input v-model="search.title" placeholder="请输入文章标题" />
          </el-form-item>
          <el-form-item label="文章状态">
            <el-select v-model="search.readState" placeholder="请选择文章状态">
              <el-option value>请选择</el-option>
              <el-option value="未读" label="未读">未读</el-option>
              <el-option value="已读" label="已读">已读</el-option>
              <el-option value="已了解" label="已了解">已了解</el-option>
              <el-option value="未了解" label="未了解">未了解</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="typt-search-btn">
              <el-button
                type="primary"
                @click="queryHandler"
                class="el-button-radius"
                icon="el-icon-search"
              >搜索</el-button>
              <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
            </div>
          </el-form-item>
          <el-form-item />
        </el-form>
        <hr />
        <div class="typt-list-add-div"></div>
      </div>
      <!-- 表格 -->
      <el-table :data="pagination.list" style="width: 100%" select-all stripe>
        <el-table-column prop="sortIndex" align="center" label="序号" width="60">
          <template slot-scope="scope">
            <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="categoryName" align="center" />
        <el-table-column label="文章标题" prop="title" align="center" />
        <el-table-column label="观看次数" prop="viewCount" align="center" />
        <el-table-column
          label="观看总时长"
          :formatter="viewTotalSeconds"
          prop="viewTotalSeconds"
          align="center"
        />
        <el-table-column label="状态" prop="readState" align="center" />
      </el-table>
      <div class="paginationDiv">
        <pagination
          :pagination="pagination"
          @page-size-changed="pageSizeChangeHandler"
          @page-changed="pageChangeHandler"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { deepMerge } from '@/assets/hpms/utils'
import Pagination from '@/components/hpms/paginations/pagination'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as wardApi from '@/api/hpms/eduCation/situation'
export default {
  name: 'QueryList',
  components: { Pagination },
  mixins: [BaseQueryPageForm],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    },
    patientInfo: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    const search = this.initQueryCriteria()
    return {
      tableSortData: {},
      sortable: null,
      search: search,
      beds: []
    }
  },
  mounted () {
  },
  methods: {
    queryHandler () {
      // 判断是否有patientId
      if (this.patientInfo.patientId === '' || this.patientInfo.patientId === null || this.patientInfo.patientId === undefined) {
        this.$message({
          message: '请先从左侧患者一览中选择要查看的患者',
          type: 'warning'
        })
      } else {
        this.initPagination(this.pagination)
        this.executeQueryPage()
      }
    },
    viewTotalSeconds (row, c) {
      let secondTime = parseInt(row.viewTotalSeconds)
      let minuteTime = 0
      if (secondTime > 60) {
        minuteTime = parseInt(secondTime / 60)
        secondTime = parseInt(secondTime % 60)
      }
      let result = ''
      if (secondTime > 0) {
        result = '' + parseInt(secondTime) + '秒'
      }

      if (minuteTime > 0) {
        result = '' + parseInt(minuteTime) + '分' + result
      }
      return result
    },
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        title: '', // 标题
        readState: '', // 状态
        nurseUnitCode: '',
        isWard: 0,
        page: 1,
        size: 10
        // patientId: ''
      })
    },
    /* 列表初始化查询条件 */
    searchList () {
      let searchs
      console.log(this.detail)
      this.search.patientId = this.patientInfo.patientId
      if (this.detail.type === 1) {
        searchs = deepMerge(this.createQueryParams(), {
          nurseUnitCode: this.patientInfo.deptId,
          isWard: 1
        })
      } else if (this.detail.type === 0) {
        searchs = deepMerge(this.createQueryParams(), {
          nurseUnitCode: 0,
          isWard: 0
        })
        searchs = this.createQueryParams()
      }
      return searchs
    },
    /* 获取列表 */
    executeQueryPage () {
      wardApi.getInfo(this.searchList()).then(data => {
        this.queryResultHandler(data)
      })
    },
    /* 重置 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },
    clearData () {
      this.initPagination(this.pagination)
      this.pagination.list = []
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
.clsStor {
  height: 85%;
}
.storTitle {
  color: red;
  font-size: 1em;
}
</style>
