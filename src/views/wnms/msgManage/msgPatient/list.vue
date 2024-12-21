<template>
  <div class="typt-list-container">
    <el-form :inline="true" :model="queryForm" ref="queryForm">
      <el-form-item label="内容方式">
        <el-select clearable v-model="queryForm.viewTypeValue">
          <el-option v-for="item in queryForm.viewType" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="患者提醒方式">
        <el-select clearable v-model="queryForm.reminTypeValue">
          <el-option v-for="item in queryForm.remindType" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推送时间">
        <el-date-picker value-format="yyyy-MM-dd HH:ss:mm" v-model="queryForm.pushDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="executeQueryPage">搜索</el-button>
        <el-button type="text" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <div class="typt-list-add-div">
      <el-button type="warning" icon="el-icon-plus" @click="goPushMsg()">推送消息
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
      <el-table-column label="内容方式" align="center">
        <template slot-scope="scope">
          <span>{{EMessageViewTypeText[scope.row.viewType]}}</span>
        </template>
      </el-table-column>

      <el-table-column label="患者提醒方式" prop="msgResourceDisplay" align="center" />

      <el-table-column label="推送人" prop="createUser" align="center" />

      <el-table-column label="推送时间" prop="pushTime" align="center" />

      <el-table-column label="消息内容" show-overflow-tooltip prop="content" align="center">
        <template slot-scope="scope">
          <span v-if="isMediaType(scope.row.viewType)">
            {{!scope.row.content?'':JSON.parse(scope.row.content).name}}
          </span>
          <span v-else>{{scope.row.content}}</span>
        </template>
      </el-table-column>

      <el-table-column label="接收床位" show-overflow-tooltip prop="reviceList" align="center" />

      <el-table-column label="操作" align="center">

        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.pushState==0 ? true : false" @click="editInfo(scope.$index, scope.row)" size="mini">编辑
          </el-button>
          <el-button type="text" :disabled="scope.row.pushState==0 ? true : false" @click="delInfo(scope.$index, scope.row)" size="mini" style="color:#F56C6C">删除
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
import { patientMsgListApi, Delete } from '@/api/wnms/msgManage/patientMsg';
import { EMessageViewType, EMessageViewTypeText } from '@/assets/wnms/utils/enums';

export default {
  name: 'listNews',
  mixins: [BaseQueryPageForm],
  components: {
    Pagination,
  },
  computed: {
    EMessageViewType () {
      return EMessageViewType;
    },
    EMessageViewTypeText () {
      return EMessageViewTypeText;
    }
  },
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      search: {
        size: 10,
        page: 1
      },
      yh_loading: false,
      queryForm: {
        pushDate: [],
        viewTypeValue: '',
        viewType: [
          { "id": EMessageViewType.text, "value": EMessageViewTypeText[EMessageViewType.text] },
          { "id": EMessageViewType.audio, "value": EMessageViewTypeText[EMessageViewType.audio] },
          { "id": EMessageViewType.video, "value": EMessageViewTypeText[EMessageViewType.video] }
        ],
        reminTypeValue: '',
        remindType: [
          { "id": "MANUAL-DEPT-MSG", "value": "强提醒" },
          { "id": "MANUAL-DEPT-NOTICE", "value": "免打扰提醒" },
        ]
      },
    };
  },
  mounted () {
    this.executeQueryPage();
  },
  methods: {
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        deptId: selectDeptInfo(), // 护理单元ID
        templateName: '' //  模板名称
      });
    },
    executeQueryPage () {
      this.yh_loading = true;
      let params = this.createQueryParams();
      params.deptId = selectDeptInfo();
      params.msgResourceList = this.queryForm.reminTypeValue == '' ?
        "MANUAL-DEPT-MSG,MANUAL-DEPT-NOTICE" : this.queryForm.reminTypeValue;

      console.log(this.queryForm.viewTypeValue);
      params.viewType = this.queryForm.viewTypeValue;

      if (this.queryForm.pushDate != null) {
        if (this.queryForm.pushDate.length > 1)
          params.startDate = this.queryForm.pushDate[0];
        params.endDate = this.queryForm.pushDate[1];
      }

      patientMsgListApi(params).then(res => {
        if (res.status == 200) {
          res.data.list.forEach((item => {
            if (item.msgResource == "MANUAL-DEPT-NOTICE") {
              item.msgResourceDisplay = "免打扰";
            }
            else {
              item.msgResourceDisplay = "强提醒";
            }
          }));
        }
        this.queryResultHandler(res);
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.yh_loading = false;
      });
    },
    goPushMsg () {
      this.$router.push({ path: "/pushMessage", query: { type: 'add' } });
    },
    editInfo (index, row) {
      this.$router.push({ path: "/pushMessage", query: { type: 'edit', msgObj: row } });
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
    resetForm () {
      this.queryForm.viewTypeValue = '';
      this.queryForm.reminTypeValue = '';
      this.queryForm.pushDate = [];
      this.executeQueryPage();
    },
    // 判断是否是媒体文件
    isMediaType (type) {
      return type === EMessageViewType.audio || type === EMessageViewType.video;
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
