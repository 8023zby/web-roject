<!--
  文件描述：基于新UI的list页面-消息提醒-自动提醒\提醒应用
  主样式class：typt-list-container
    使用的中台统一样式
  创建时间：2020/05/20 10:00
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
      <el-form-item label="通知类型:">
        <el-select v-model="msgResourceList" placeholder="全部">
          <el-option value>全部</el-option>
          <el-option
            v-for="item in notifyTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >{{ item.name }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推送时间:">
        <el-date-picker
          v-model="search.startDate"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="开始时间"
        />至
        <el-date-picker
          v-model="search.endDate"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button @click="queryHandler" type="primary" icon="el-icon-search" size="small">搜索</el-button>
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
      <div class="action_div"></div>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <el-table :data="pagination.list" height="100%" stripe v-loading="yh_loading">
      <!-- <el-table-column prop="sortIndex" align="center" label="序号" width="100">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="通知类型" prop="msgResource" align="center" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.msgResource==='MANUAL-DEPT-MSG'?'病区消息':'病区公告'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送人" prop="createUser" align="center" width="200" />
      <el-table-column label="推送时间" prop="pushTime" align="center" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.pushState!==0" style="color:red">{{ scope.row.pushTime }}</span>
          <span v-else>{{ scope.row.pushTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="通知内容"
        :show-overflow-tooltip="true"
        prop="content"
        align="center"
        width="350"
      >
        <template slot-scope="scope">
          <span>
            {{
            scope.row.viewType===0?scope.row.content:
            scope.row.viewType===2?'音频消息':'视频消息'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="接收设备"
        :show-overflow-tooltip="true"
        prop="receiveDeviceStr"
        align="center"
        min-width="150"
      />
      <el-table-column label="操作" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            :disabled="scope.row.pushState===1"
            @click="listCheckeState(scope.$index, scope.row, 'Push')"
            size="mini"
          >推送情况</el-button>
          <el-button
            type="text"
            :disabled="scope.row.pushState===0"
            @click="listCheckeState(scope.$index, scope.row, 'edit')"
            size="mini"
          >编辑</el-button>

          <el-button
            type="text"
            :disabled="scope.row.pushState===0"
            @click="listCheckeState(scope.$index, scope.row, 'del')"
            :style="scope.row.pushState===0?'':'color:#fa3e57;'"
            size="mini"
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
      <el-dialog
        v-if="true"
        title="阅读情况"
        :visible.sync="redDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <span>未读床位:{{ readSituation.unRead.toString() }}</span>
        <el-divider />
        <span>已读床位: {{ readSituation.markRead.toString() }}</span>
      </el-dialog>
      <div class="message_dialog">
        <el-dialog
          title="推送情况"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :visible.sync="dialog.dialogVisible"
        >
          <div>
            <span class="dialog_title">{{dialog.title}}</span>
            <div v-for="(item,index) in  dialog.data" :key="index">
              <span>{{deviceTypeName[index]}}:</span>
              <div class="dialog_div">
                <el-tag
                  size="medium"
                  v-for="(v,i) in item"
                  :key="i"
                  class="dialog_tag"
                  :type="IsState(v.isReceive,v.isRead)"
                >{{v.referenceName}}</el-tag>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </slot>
  </div>
</template>

<script>
import { deepMerge } from '@/assets/wnms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as msgPushApi from '@/api/wnms//msgManage/msgPush'
import Pagination from '@/components/wnms/paginations/pagination'
import mixins from './mixins'
import { getOneDate } from '@/assets/wnms/utils/dateFormat'

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
  watch: {

  },
  data () {
    const search = this.initQueryCriteria()
    return {
      msgResourceList: '',
      yh_loading: false,
      notifyTypeList: [
        { id: 'MANUAL-DEPT-MSG', name: '病区消息' },
        { id: 'MANUAL-DEPT-NOTICE', name: '病区公告' }
      ],
      tableSortData: {},
      search: search,
      redDialogVisible: false,
      readSituation: {
        unRead: [],
        markRead: []
      },
      dialog: {
        dialogVisible: false,
        title: '',
        data: {}
      },
      NursingList: '' // 列表护理单元
    }
  },
  mounted () {
    this.executeQueryPage()
  },
  methods: {

    IsState (isReceive, isRead) {
      //  isReceive  0-未收到 1-已收到
      //  isRead 0 未读 1已读
      if (isReceive === 0) {
        return 'danger'
      } else {
        if (isRead === 1 && isReceive === 1) {
          return 'success'
        } else {
          return 'info'
        }
      }
    },
    /*  检查状态 */
    listCheckeState (index, row, type) {
      if (type === 'edit') {
        // 如果是状态0 并且是点击的修改 这个时候的编辑和删除是不禁用的 可以直接打开编辑
        msgPushApi.IsEdit(row.messageId).then((res) => {
          if (res.status === 200 && res.desc === '1') {
            this.$message({
              type: 'info',
              message: '消息已推送！'
            })
            this.executeQueryPage()
            return false
          } else {
            this.$emit('option-changed', 'addOrModify', {
              row: row,
              type: 'edit'
            })
          }
        })
      } else if (type === 'del') {
        // 如果是状态0 并且是点击的修改 这个时候的编辑和删除是不禁用的 可以直接执行删除
        this.delHandler(index, row)
      } else if (type === 'red') {
        // 如果是状态1 并且是阅读情况那么就需要把数据组装起来进行展示
        this.readHandler(index, row)
      } else if (type === 'Push') {
        this.readHandler(index, row)
      }

      /* msgPushApi.Details(row.messageId).then(res => {
        if (res.status === 200) {
          // 推送状态 0 未推送 1 推送成功 2 推送失败
          switch (res.data.pushState) {
            case 0:
              if (type === 'red') {
                // 如果是状态0 并且是阅读情况 那么就重新查询一下

                this.$message({
                  type: 'info',
                  message: '消息尚未推送,无床位阅读'
                })

                this.executeQueryPage()
              } else if (type === 'edit') {
                // 如果是状态0 并且是点击的修改 这个时候的编辑和删除是不禁用的 可以直接打开编辑

                this.$emit('option-changed', 'addOrModify', {
                  row: row,
                  type: 'edit'
                })
              } else if (type === 'del') {
                // 如果是状态0 并且是点击的修改 这个时候的编辑和删除是不禁用的 可以直接执行删除

                this.delHandler(index, row)
              }
              break
            case 1:
              if (type === 'red') {
                // 如果是状态1 并且是阅读情况那么就需要把数据组装起来进行展示

                this.readHandler(index, row)
              } else if (type === 'edit') {
                // 如果是状态1 并且是阅读情况和删除 那么就重新查询一下

                this.$message({
                  type: 'info',
                  message: '消息已推送完成,无法编辑'
                })

                this.executeQueryPage()
              } else if (type === 'del') {
                // 如果是状态1 并且是阅读情况和删除 那么就重新查询一下

                this.$message({
                  type: 'info',
                  message: '消息已推送完成,无法删除'
                })

                this.executeQueryPage()
              }
              break
          }
        }
      }) */
    },

    /* 阅读情况 */
    readHandler (index, row) {
      this.dialog.title = row.msgResource === 'MANUAL-DEPT-MSG' ? `灰色表示成功,红色表示失败，绿色表示已读` : `灰色表示成功,红色表示失败，绿色表示已读`

      msgPushApi.getStatus({
        messageId: row.messageId,
        msgResourceList: row.msgResource,
        deptId: this.selectDeptInfo()
      }).then(res => {
        if (res.status === 200) {
          this.dialog.data = res.data
          this.dialog.dialogVisible = true
        }
      })
    },

    /* 查询条件 */
    initQueryCriteria (form = {}) {
      const [beginTime, endTime] = getOneDate('week', 1) || []
      let s = beginTime + ' 00:00:00'
      let e = endTime + ' 23:59:59'
      return deepMerge(form, {
        deptId: this.selectDeptInfo(),
        startDate: s,
        endDate: e,
        msgResourceList: 'MANUAL-DEPT-MSG,MANUAL-DEPT-NOTICE'

      })
    },

    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true

      if (this.msgResourceList !== '') {
        this.search.msgResourceList = this.msgResourceList
      } else {
        this.search.msgResourceList = 'MANUAL-DEPT-MSG,MANUAL-DEPT-NOTICE'
      }

      msgPushApi.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      }).finally(() => {
        this.yh_loading = false
      })
    },

    /* 列表删除 */
    customDelHandler (index, row) {
      msgPushApi.Delete(row.messageId).then(res => {
        this.IsSuccess(res)
        this.executeQueryPage()
      })
    },

    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.msgResourceList = ''
      this.queryHandler()
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss' >
@import '@/assets/wnms/css/self_common.scss';

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
.message_dialog {
  .el-dialog__body {
    height: 600px;
    overflow-y: auto;
    border: 1px solid;
  }
}
</style>
