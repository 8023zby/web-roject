<!--
   文件描述：基于新UI的list页面-铃声管理页面
    主样式class：typt-list-container
    使用的中台统一样式
  创建时间：2020/4/21 12:19
  修改时间：2020-10-13
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
  <div class="typt-list-container">
    <div height="auto" class="header-hastitle">
      <!--有标题的话，header的class = header-hastitle-->
      <div class="title">
        <slot name="title">{{ isAudioType }}管理</slot>
      </div>

      <div class="tool-container">
        <div class="left">
          <!--左边按钮-->
          <slot name="left_btn"></slot>
        </div>
        <div class="right">
          <!--右边按钮-->
          <slot name="right_btn">
            <el-button
              type="primary"
              size="small"
              @click="$emit('option-changed', 'list', {audioType: detail.audioType})"
            >返回</el-button>
          </slot>
        </div>
      </div>
    </div>
    <!--查询条件模块 === START-->
    <!--查询条件模块 === END-->

    <!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button type="warning" size="small" icon="el-icon-plus" @click="addClock">添加</el-button>
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
      <el-table-column :label="`${ isAudioType }名称`" prop="audioName" align="center" />
      <el-table-column
        label="时长"
        v-if="detail.audioType === 'broadcast'"
        prop="audioDuration"
        align="center"
      />
      <el-table-column
        label="上传时间"
        v-if="detail.audioType === 'broadcast'"
        prop="creatTime"
        align="center"
      />
      <el-table-column label="操作" fixed="right" width="280" align="center">
        <template slot-scope="scope">
          <audio :id="scope.row.id" ref="aduio" :src="scope.row.fileUrl" />
          <!--<el-button
            ref="playBtn"
            v-if="detail.audioType === 'alarm'"
            type="text"
            size="small"
            class="playBtn"
            @click="audioPlay(scope.row.id, $event)"
          >{{ isPlay ? '暂停' : '播放' }}</el-button>-->
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
      <add v-if="addVisiable" :bellList="pagination.list" ref="ref_add" @closeAdd="closeAdd"></add>
    </slot>
  </div>
</template>

<script>
import './mngClock.scss'
import mixin from './mixin'
import Pagination from '@/components/wnms/paginations/pagination'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import Add from './addBell'

import {
  queryListApi,
  delApi
} from '@/api/wnms//msgManage/mngAudio'

export default {
  name: 'MngBells',
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
        deptIds: this.selectDeptInfo() + ',0',
        audioName: '',
        audioType: ''
      }
    }
  },
  mounted () {
    // 设置默认类型
    this.search.audioType = this.detail.audioType
    // this.search.deptIds = ''
    // 获取音频列表
    this.executeQueryPage()
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
        this.$refs.ref_add.detail.audioType = this.detail.audioType
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
        this.$refs.ref_add.detail.audioType = this.detail.audioType
        this.$refs.ref_add.detail.row = row
        this.$refs.ref_add.init()
      })
    },
    /**
     * @获取音频列表
     */
    executeQueryPage () {
      this.yh_loading = true
      queryListApi({
        size: this.pagination.size,
        page: this.pagination.page,
        ...this.search
      }).then(response => {
        this.queryResultHandler(response)
      }).finally(() => {
        this.yh_loading = false
      })
    },

    /**
     * @删除音频
     */
    delHandler (param) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
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
      this.executeQueryPage()
    },

    // 清楚查询条件
    resetHandler () {
      this.page = 1
      this.size = 10
      this.currPage = 1
      this.search.audioName = ''
      this.executeQueryPage()
    },

    getDuration () {
      console.log(this.$refs.audio) // 此时可以获取到duration
    },

    // 控制音频播放暂停
    audioPlay (param, event) {
      // 播放音频
      const thisAudio = document.getElementById(param)
      // this.$refs.playBtn.innerHTML = '播放'

      if (thisAudio !== null) {
        if (thisAudio.paused) {
          thisAudio.play()
          event.currentTarget.innerText = '暂停'
        } else {
          thisAudio.pause()
          event.currentTarget.innerText = '播放'
        }
      }

      this.pauseAll()
    },

    // 暂停全部
    pauseAll () {
      const audios = document.getElementsByTagName('audio')

      function _PauseAll () {
        var self = this;
        [].forEach.call(audios, function (i) {
          // 将audios中其他的audio全部暂停
          i !== self && i.pause()
        })
      }

      [].forEach.call(audios, function (i) {
        i.addEventListener('play', _PauseAll.bind(i))
      })
    }
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
</style>
