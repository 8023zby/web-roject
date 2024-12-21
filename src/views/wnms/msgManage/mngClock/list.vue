<!--
  文件描述：基于新UI的list页面-闹钟管理
    主样式class：typt-list-container
    使用的中台统一样式
  创建时间：2020/4/21 12:19
  创建人：Administrator

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form ref="search" :inline="true" :model="search" :rules="rules" class="typt-list-search">
      <el-form-item label="类型名称">
        <el-input
          v-model="search.toneName"
          placeholder="请输入类型名称"
          prefix-icon="el-icon-search"
          size="small"
          maxlength="16"
        />
      </el-form-item>
      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="serachHandler"
          >搜索</el-button>
          <el-button type="text" @click="resetHandler">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--查询条件模块 === END-->
    <hr />

    <!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button type="warning" size="small" icon="el-icon-plus" @click="addClock">添加</el-button>
      <!--右侧区域按钮-->
      <div class="action_div">
        <el-button
        type="primary"
        size="small"
        @click="$emit('option-changed', 'mngBells', {audioType: 'alarm'})"
        >{{ isAudioType }}管理</el-button>
      </div>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <el-table
      :data="pagination.list"
      v-loading="yh_loading"
      :header-cell-style="{'background': '#f9f9f9'}"
      height="100%"
      stripe
    >
      <!-- <el-table-column label="序号" type="index" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+( pagination.page - 1) *pagination.size + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="类型名称" prop="toneName" align="center" />
      <el-table-column label="时长" prop="timing" align="center" />
      <el-table-column label="使用铃声" prop="audioName" align="center" />
      <el-table-column label="操作" fixed="right" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="editClock(scope.row)"
            style="color:#1E87F0"
          >编辑</el-button>
          <el-button
            type="text"
            size="small"
            @click="delHandler(scope.row.id)"
            style="color:#F56C6C;"
          >删除</el-button>
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
      <!--添加/编辑弹窗-->
      <add v-if="addVisiable" ref="ref_add" @closeAdd="closeAdd"></add>
    </slot>
  </div>
</template>

<script>
import './mngClock.scss'
import mixin from './mixin'
import Pagination from '@/components/wnms/paginations/pagination'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import Add from './add'

import {
  queryListApi,
  delApi
} from '@/api/wnms//msgManage/mngClock'

export default {
  name: 'MngAudio',
  mixins: [mixin, BaseQueryPageForm],
  components: { Pagination, Add },
  data () {
    return {
      yh_loading: false,
      addVisiable: false, // 添加弹窗组件
      detail: {
        audioType: 'alarm'
      },
      // 表格数据
      tableData: {},
      // 查询参数
      search: {
        deptIds: this.selectDeptInfo(),
        toneName: ''
      }
    }
  },
  mounted () {
    // this.search.deptIds = ''
    // 获取闹钟列表
    this.executeQueryPage()
  },
  methods: {
    closeAdd (type) {
      this.addVisiable = false
      if (type && type === 'refresh') this.executeQueryPage()
    },
    /**
     * 添加闹钟
     * */
    addClock () {
      this.addVisiable = true
      this.$nextTick(() => {
        this.$refs.ref_add.detail.type = 'add'
        this.$refs.ref_add.init()
      })
    },
    /**
     * 编辑
     * */
    editClock (row) {
      this.addVisiable = true
      this.$nextTick(() => {
        this.$refs.ref_add.detail.type = 'edit'
        this.$refs.ref_add.detail.row = row
        this.$refs.ref_add.init()
      })
    },
    /**
     * @获取闹钟列表
     */
    executeQueryPage () {
      this.yh_loading = true
      queryListApi({
        size: this.pagination.size,
        page: this.pagination.page,
        ...this.search
      }).then(response => {
        // this.tableData = response.data
        this.queryResultHandler(response)
      }).finally(() => {
        this.yh_loading = false
      })
    },

    /**
     * @删除闹钟
     */
    delHandler (param) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        delApi(param).then(response => {
          this.tableData = response.data

          // 刷新列表
          this.executeQueryPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 搜索
    serachHandler () {
      this.page = 1
      this.currPage = 1
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },

    // 清楚查询条件
    resetHandler () {
      this.page = 1
      this.size = 10
      this.currPage = 1
      this.search.toneName = ''
      this.initPagination(this.pagination)
      this.executeQueryPage()
    }
  }
}
</script>
