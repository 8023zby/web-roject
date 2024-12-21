<template>
  <div class="typt-list-container">
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="推送时间">
        <el-date-picker type="daterange" v-model="queryForm.pushDate" value-format="yyyy-MM-dd HH:ss:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="executeQueryPage">搜索</el-button>
        <el-button type="text" @click="resetQuery()">重置</el-button>
      </el-form-item>

    </el-form>
    <hr>

    <div class="typt-list-add-div">
      <el-button type="warning" icon="el-icon-plus" @click="goPushMsg()">推送公告
      </el-button>
      <!--右侧区域按钮-->
      <div class="action_div"></div>
    </div>

    <el-table :data="pagination.list" height="100%" stripe highlight-current-row v-loading="yh_loading">
      <!--<el-table-column align="center"-->
      <!--type="index"-->
      <!--width="100"-->
      <!--label="序号">-->
      <!--</el-table-column>-->
      <el-table-column label="推送时间" prop="pushTime" align="center">
      </el-table-column>

      <el-table-column label="公告内容" prop="content" show-overflow-tooltip align="center" />

      <el-table-column label="接收护理单元" prop="pushDeptStr" show-overflow-tooltip align="center" />

      <el-table-column label="接收人" prop="reviceList" show-overflow-tooltip align="center" />

      <el-table-column label="显示在信息看板" prop="displayIsbnNursingTVRevice" align="center" />
      <el-table-column label="生效状态" prop="messageStatus" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.messageStatus" :active-value="1" :inactive-value="0" @change="operateStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- 是否可以编辑删除 由生效状态控制 去掉消息已推送无法编辑删除逻辑 -->
          <el-button type="text" :disabled="scope.row.messageStatus==1 ? true : false" @click="editInfo(scope.$index, scope.row)" size="mini">编辑
          </el-button>
          <el-button type="text" :disabled="scope.row.messageStatus==1 ? true : false" @click="delInfo(scope.$index, scope.row)" size="mini" :style="{'color':scope.row.messageStatus==1?'':'#F56C6C'}">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />

  </div>
</template>


<script>

import { selectDeptInfo, getUser } from '@/assets/wnms/utils/common';
import { deepMerge } from '@/assets/wnms/utils';
import BaseQueryPageForm from '../../common/BaseQueryPageForm';
import Pagination from '@/components/wnms/paginations/pagination';
import { patientMsgListApi, Delete, operateStatusApi } from '@/api/wnms/msgManage/patientMsg';


export default {
  name: 'cardNotice',
  mixins: [BaseQueryPageForm],
  components: {
    Pagination,
  },
  props: {},
  data () {
    return {
      search: {
        size: 10,
        page: 1
      },
      yh_loading: false,
      queryForm: {
        pushDate: [],
      },
    };
  },
  mounted () {
    this.executeQueryPage();
  },
  methods: {
    operateStatus (row) {
      let params = { "messageStatus": row.messageStatus, "messageId": row.messageId }
      operateStatusApi(params).then(res => {
        if (res.status == 200) {
         this.$message.success('操作成功')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    resetQuery () {
      this.queryForm.pushDate = '';
      this.executeQueryPage();
    },
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        deptId: this.selectDeptInfo(), // 护理单元ID
        templateName: '' //  模板名称
      });
    },

    executeQueryPage () {
      let params = this.createQueryParams();
      // params.deptId = selectDeptInfo()
      params.msgResourceList = "MANUAL-NOTICE";

      if (this.queryForm.pushDate != null) {
        if (this.queryForm.pushDate.length > 1) {
          params.startDate = this.queryForm.pushDate[0];
          params.endDate = this.queryForm.pushDate[1];
        }
      }

      this.yh_loading = true;
      patientMsgListApi(params).then(res => {
        if (res.status == 200) {
          res.data.list.forEach(item => {
            item.displayIsbnNursingTVRevice = item.isbnNursingTVRevice == 1 ? "是" : "否";
          });
          this.queryResultHandler(res);
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.yh_loading = false;
      });
    },
    editInfo (index, row) {
      this.$router.push({ path: "/pushCareNotice", query: { type: "edit", para: row } });
    },
    delInfo (index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.yh_loading = true;
        Delete(row.messageId).then(res => {
          if (res.status == 200) {
            this.$message("删除成功");
            this.executeQueryPage();
          } else {
            this.$message("删除失败");
          }
        }).catch(err => {
          console.log(err);
        }).finally(() => {
          this.yh_loading = false;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    goPushMsg () {
      this.$router.push({ path: "/pushCareNotice", query: { type: "add" } });
    },


  }
}

</script>
