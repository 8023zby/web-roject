<!--
  文件描述：基于新UI的list页面--审核记录
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
  <el-container class="list-page-new">
    <el-header height="auto" class="header-hastitle">
      <!--有标题的话，header的class = header-hastitle-->
      <div class="title">
        <slot name="title">
          审核记录
        </slot>
      </div>
      <!--查询条件模块 === START-->
      <div class="">
        <div class="query-items-container" ref="query_form">
          <slot name="query">
          </slot>
        </div>
      </div>
      <!--查询条件模块 === END-->
      <hr style="background-color: #E4E7ED; margin: 0; height: 1px;" v-if="$slots.query && ($slots.left_btn || $slots.right_btn)"/>
      <div class="tool-container">
        <div class="left">
          <!--左边按钮-->
          <slot name="left_btn">

          </slot>
        </div>
        <div class="right">
          <!--右边按钮-->
          <slot name="right_btn">
            <el-button
                       type="primary"
                       size="mini"
                       @click="backHandler">返回</el-button>
          </slot>
        </div>
      </div>
    </el-header>
    <div class="hastitle-elform">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="审核结果：">
          <el-select v-model="search.auditState" filterable placeholder="全部" @change="getIsState" size="mini">
            <el-option value>全部</el-option>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-main>
      <!--主体列表-->
      <slot name="main">
        <el-table :data="pagination.list" style="width: 100%" select-all stripe>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="审核人" prop="userName" align="center" />
          <el-table-column label="审核结果" prop="auditState" :formatter="stateFormatter" align="center" />
          <el-table-column label="提交时间" prop="applyTime" align="center" />
          <el-table-column label="审核时间" prop="auditTime" align="center" />
          <el-table-column label="备注" prop="remark" align="center" />
        </el-table>
      </slot>
    </el-main>

    <el-footer height="auto">
      <!--分页条-->
      <slot name="footer">
        <pagination
          :pagination="pagination"
          @page-size-changed="pageSizeChangeHandler"
          @page-changed="pageChangeHandler"
        />
      </slot>
    </el-footer>
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>

    </slot>
  </el-container>
</template>

<script>
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as wareManageApi from '@/api/smms/shopingMall/wareManage'
import Pagination from '@/components/smms/paginations/pagination'
import { deepMerge } from '@/assets/smms/utils'
export default {
  mixins: [BaseQueryPageForm],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    const search = this.initQueryCriteria()
    return {
      search: search,
      options: [
        {
          value: 1,
          label: '审核通过'
        },
        {
          value: 2,
          label: '审核未过'
        }
      ]
    }
  },
  mounted () {
    this.executeQueryPage()
  },
  components: {
    Pagination
  },
  methods: {
    backHandler (data) {
      this.$emit('option-changed', 'list')
    },
    // 对照
    stateFormatter (row, c) {
      const culabel = this.options.find(item => item.value === row.auditState)
      return culabel.label || ''
    },
    getIsState () {
      this.queryHandler()
    },
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        auditState: '',
        wareId: this.detail.row.id
      })
    },
    executeQueryPage () {
      wareManageApi.wareAuditLog(this.createQueryParams()).then(res => {
        this.queryResultHandler(res)
      })
    }
  }
}
</script>

<style lang='scss'>
  @import '@/assets/smms/css/self_common.scss';
</style>
