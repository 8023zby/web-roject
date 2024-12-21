<!--
  文件描述：基于新UI的list页面-消息提醒-消息模板

     主样式class：typt-list-container
    使用的中台统一样式

  创建人：Administrator
  创建时间：2020/05/20 14:00
   更改时间：2020-10-13
  创建人：Administrator

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form ref="search" :inline="true" :model="search" class="typt-list-search">
      <el-form-item label="模板名称:">
        <el-input v-model="search.templateName" placeholder="请输入" elearable />
      </el-form-item>
      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button
            @click="queryHandler"
            type="primary"
            icon="el-icon-search"
            size="small"
          >搜索</el-button>
          <el-button type="text" @click="clsHandler">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--查询条件模块 === END-->
    <hr />

    <!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button
        type="warning"
        icon="el-icon-plus"
        @click="$emit('option-changed','addOrModify',{type:'add'})"
      >添加</el-button>
      <!--右侧区域按钮-->
      <div class="action_div">
      </div>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <el-table :data="pagination.list" height="100%" v-loading="yh_loading" select-all stripe>
      <!-- <el-table-column prop="sortIndex" align="center" label="序号" width="150">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="模板名称"
        :show-overflow-tooltip="true"
        prop="templateName"
        align="center"
        width="400"
      />
      <el-table-column
        label="模板内容"
        :show-overflow-tooltip="true"
        prop="templateContent"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="isMediaType(scope.row.type)">
            {{!scope.row.templateContent?'':JSON.parse(scope.row.templateContent).name}}
          </span>
          <span v-else>{{scope.row.templateContent}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
              <span
                class="el-button-text-color"
                @click="$emit('option-changed','msgPush', {row:scope.row,backType: 'list'})"
              >推送消息</span>
              <span
                class="el-button-text-color"
                @click="$emit('option-changed','addOrModify', {type:'edit',row:scope.row})"
              >编辑</span>
          <span class="el-text-danger" @click="delHandler(scope.$index, scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!--表格主体 ==== END-->

    <!--分页条-->
    <pagination
      :pagination="pagination"
      @page-size-changed="pageSizeChangeHandler"
      @page-changed="pageChangeHandler"
    />
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
    </slot>
  </div>
</template>

<script>
import { deepMerge } from '@/assets/wnms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as msgTemplateApi from '@/api/wnms//msgManage/msgTemplate'
import Pagination from '@/components/wnms/paginations/pagination'
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
      search: search
    }
  },
  mounted () {
    this.executeQueryPage()
  },
  methods: {
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        deptId: this.selectDeptInfo(), // 护理单元ID
        templateName: '' //  模板名称
      })
    },

    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      msgTemplateApi.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      }).finally(() => {
        this.yh_loading = false
      })
    },

    /* 列表删除 */
    customDelHandler (index, row) {
      msgTemplateApi.Delete(row.templateId).then(res => {
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
