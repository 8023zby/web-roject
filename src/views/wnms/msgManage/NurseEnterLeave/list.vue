
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form ref="search"
             :inline="true"
             :model="search"
             class="typt-list-search">
      <el-form-item label="日期:">
        <el-date-picker v-model="search.beginTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="开始时间" />至
        <el-date-picker v-model="search.endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="结束时间" />
      </el-form-item>
      <el-form-item label="房间:">
        <el-select v-model="search.roomName"
                   size="small"
                   placeholder="请选择">
          <el-option value
                     label="全部"></el-option>
          <el-option v-for="item in roomList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.label">{{ item.label }}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="类型:">
        <el-select v-model="search.type"
                   size="small"
                   placeholder="请选择">
          <el-option value
                     label="全部"></el-option>
          <el-option v-for="item in nuresType"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">{{ item.name }}</el-option>
        </el-select>
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

    <!--表格主体 ==== START-->
    <el-table :data="pagination.list"
              height="100%"
              stripe
              v-loading="yh_loading">
      <el-table-column prop="sortIndex"
                       align="center"
                       label="序号"
                       width="150">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间"
                       prop="time"
                       align="center">
      </el-table-column>
      <el-table-column label="房间"
                       :show-overflow-tooltip="true"
                       prop="roomName"
                       align="center"
                       width="350">
      </el-table-column>

      <el-table-column label="护士"
                       :show-overflow-tooltip="true"
                       prop="nurseName"
                       align="center"
                       width="350"></el-table-column>

      <el-table-column label="类型"
                       :show-overflow-tooltip="true"
                       prop="type"
                       align="center">
        <template slot-scope="scope">
          <span>
            <el-tag :type="scope.row.type==0?'danger':'success'">{{scope.row.type == 0 ? '护士离开' : '护士进入'}}</el-tag>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--表格主体 ==== END-->

    <!--分页条-->
    <pagination :pagination="pagination"
                @page-size-changed="pageSizeChangeHandler"
                @page-changed="pageChangeHandler" />
  </div>
</template>

<script>
import { deepMerge } from '@/assets/wnms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as Api from '@/api/wnms/msgManage/NurseEnterLeave.js'
import Pagination from '@/components/wnms/paginations/pagination'

import { getOneDate, dateFormat } from '@/assets/wnms/utils/dateFormat'

import { parseTime } from '@/assets/wnms/utils/index.js'

import mixins from './mixins'

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

    return {
      yh_loading: false,
      tableSortData: {},
      search: search,
      redDialogVisible: false,
      nuresType: [{ id: 1, name: '护士进入' }, { id: 0, name: '护士离开' }] //测试提出问题要进入放第一个，后台设计又是离开id是0
    }
  },

  mounted () {
    this.executeQueryPage()
  },
  methods: {

    /* 查询条件 */
    initQueryCriteria (form = {}) {
      let s = parseTime(new Date(), "{y}-{m}-{d}") + " 00:00:00"
      let e = parseTime(new Date(), "{y}-{m}-{d}") + " 23:59:59"
      return deepMerge(form, {
        deptId: this.selectDeptInfo(),
        beginTime: s,
        endTime: e,
        type: '',
        roomName: ''
      })
    },

    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      Api.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      }).finally(() => {
        this.yh_loading = false
      })
    },

    /* 列表删除 */
    customDelHandler (index, row) {
      Api.Delete(row.messageId).then(res => {
        this.IsSuccess(res)
        this.executeQueryPage()
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

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.Nursing_cls {
  margin: 2rem 0 2rem 0;
}
.dialog_tag {
  zoom: 1.4;
  margin: 5px;
}
.dialog_div {
  border: 1px solid #ccc;
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  margin: 2vh 0 2vh 0;
}
.dialog_title {
  display: block;
  margin-bottom: 1vh;
}
</style>
<style lang='scss' >
.wnms_div_dialog {
  .el-dialog__body {
    overflow-y: auto;
    height: 400px;
  }
}
</style>
