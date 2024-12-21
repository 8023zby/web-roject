<!--
  文件描述：基于新UI的list页面-音频广播-音频管理列表
    主样式class：typt-list-container
    使用的中台统一样式
  创建时间：2020/9/21 02:19
  更改时间：2020-10-13
  创建人：Administrator

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form ref="search" :inline="true" :model="search" :rules="rules" class="typt-list-search">
      <el-form-item label="音频名称">
        <el-input v-model="search.broadcastName" placeholder="请输入音频名称" prefix-icon="el-icon-search" maxlength="16" />
      </el-form-item>
      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button type="primary" icon="el-icon-search" size="small" @click="serachHandler">搜索</el-button>
          <el-button type="text" @click="resetHandler">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--查询条件模块 === END-->
    <hr />

    <!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button type="warning" size="small" icon="el-icon-plus" @click="addClock">添加</el-button>
      <span class="disk-space">磁盘空间{{parserUnit(diskSpace.total)}}M，当前可用{{parserUnit(diskSpace.surplus)}}M</span>
      <!--右侧区域按钮-->
      <div class="action_div">
      </div>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <el-table
      v-loading="yh_loading"
      :data="pagination.list"
      :header-cell-style="{'background': '#f9f9f9'}"
      select-all
      height="100%"
      stripe
    >
      <!-- <el-table-column type="index" label="序号" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+( pagination.page - 1) *pagination.size + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="`音频名称`" prop="audioName" align="center" />
      <el-table-column
        label="时长"
        prop="audioDuration"
        align="center"
      />
      <el-table-column label="大小" align="center">
        <template slot-scope="scope">
          {{scope.row.audioSize + 'M'}}
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        prop="updateTime"
        align="center"
      />
      <el-table-column label="操作" fixed="right" width="280" align="center">
        <template slot-scope="scope">
          <!-- <audio :id="scope.row.id" ref="aduio" :src="scope.row.fileUrl" /> -->
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.deptId==='0'"
            @click="editClock(scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.deptId==='0'"
            style="color:#F56C6C;"
            @click="delHandler(scope.row)"
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
import mixin from '../mngClock/mixin'
import Pagination from '@/components/wnms/paginations/pagination'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import Add from './add'

import {
  getBroadCastManage,
  delBroadCastManage,
  getBroadCastManageDiskSpace
} from '@/api/wnms//msgManage/mngAudio'

export default {
  name: 'ondemand',
  mixins: [mixin, BaseQueryPageForm],
  components: { Pagination, Add },
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      yh_loading: false,
      addVisiable: false, // 添加弹窗组件
      // 播放状态
      isPlay: false,
      // 表格数据
      tableData: {},
      // 查询参数
      search: {
        broadcastName: '',
      },
      diskSpace: {
        total: '0',
        surplus: '0',
      },
    }
  },
  mounted () {
    // 设置默认类型
    // this.search.deptIds = ''
    // 获取音频列表
    this.executeQueryPage()
    this.getMaterialManageDiskSpace()
  },
  methods: {
    closeAdd (type) {
      this.addVisiable = false
      if (type && type === 'refresh') this.executeQueryPage()
    },
    /**
     * 添加铃声
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
     * @获取音频列表
     */
    executeQueryPage () {
      this.yh_loading = true
      getBroadCastManage({
        size: this.pagination.size,
        page: this.pagination.page,
        ...this.search
      }).then(response => {
        // console.log('音频列表：',response)
        this.queryResultHandler(response)
      }).finally(() => {
        this.yh_loading = false
      })
    },

    /**
     * @删除音频
     */
    delHandler (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBroadCastManage(row.broadcastId).then(response => {
          if (response.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            // 刷新列表
            this.executeQueryPage()
            this.getMaterialManageDiskSpace()
          } else {
            this.$message({
              type: 'error',
              message: response.desc
            })
          }
        })
      }).catch(() => {
      })
    },

    // 搜索
    serachHandler () {
      this.pagination.page = 1
      this.executeQueryPage()
    },

    // 清楚查询条件
    resetHandler () {
      this.pagination.page = 1
      this.pagination.size = 10
      this.search.broadcastName = ''
      this.executeQueryPage()
    },

    getDuration () {
      // console.log(this.$refs.audio) // 此时可以获取到duration
    },
    async getMaterialManageDiskSpace () {
      getBroadCastManageDiskSpace()
        .then(res => {
          this.diskSpace = res.data;
        });
    },
    parserUnit (num) {
      const res = parseFloat((+num).toFixed(2));
      return res >= 0 ? res : 0;
    },
  }
}
</script>
<style lang="scss">
  .header-hastitle{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7f7f7;
    color: #333;
    font-size: 14px;
    padding: 10px 0 0 28px;
    margin-bottom: 20px;
    // 标题
    .title {
      position: relative;
      min-height: 35px !important;
      &:before {
        content: ' ';
        width: 4px;
        height: 15px;
        border-radius: 2px;
        background-color: #13ce66;
        position: absolute;
        left: -12px;
        top: 4px;
      }
      .span-right-btn{
        float: right;
      }
    }
    .tool-container{
      margin: 0 10px;
      margin-top: -10px;
      line-height: 30px;
      .right{

      }
    }
  }
.disk-space {
  margin-left: 20px;
  color: #666;
}
</style>
