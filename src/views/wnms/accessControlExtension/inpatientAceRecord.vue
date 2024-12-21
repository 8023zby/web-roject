<!--
 * @Author: 范博
 * @Owner: 
 * @Date: 2022-05-12 13:43:09
 * @LastEditTime: 2022-08-24 13:58:38
 * @LastEditors: 范博
 * @Description: 
 * @FilePath: \yarward-wnms-frontEnd\src\views\wnms\accessControlExtension\inpatientAceRecord.vue
-->
<template>
  <div class="typt-list-container">
    <el-form :inline="true" :model="queryForm" ref="queryForm">
      <el-form-item label="姓名">
        <el-input placeholder="请输入" v-model="queryForm.empName" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item label="开门时间">
        <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryForm.startTime">
        </el-date-picker>-
        <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryForm.endTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="门禁名称">
        <treeselect style="width:200px" v-model="queryForm.deviceId" :default-expand-level="Infinity" :multiple="false" :options="deptDeviceList" :normalizer="normalizerDevice" @select="onSelectDeptDeviceList" :clearable="true" placeholder="全部">
        </treeselect>
      </el-form-item>
      <el-form-item label="是否开门">
        <el-select placeholder="请输入" v-model="queryForm.openState">
          <el-option value="" label="全部">全部</el-option>
          <el-option v-for="item in openStats" :value="item.value" :key="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="executeQueryPage()" icon="el-icon-search">搜索</el-button>
        <el-button type="text" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <el-table :data="pagination.list" height="100%" stripe highlight-current-row v-loading="yh_loading">
      <el-table-column label="" prop="" width="20px" />
      <el-table-column label="用户名" prop="userAccount" show-overflow-tooltip />
      <el-table-column label="姓名" prop="userName" show-overflow-tooltip />
      <el-table-column label="开门时间" prop="time" show-overflow-tooltip />
      <el-table-column label="开门方式" prop="openType" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.openType==1001 ?'人脸识别开门' : 
          scope.row.openType==1002 ?'请求开门' :
           scope.row.openType==1003  ?'主机开门' :
            scope.row.openType==1004  ?'密码开门' :
             scope.row.openType==1005 ?'刷卡开门' :
              scope.row.openType==1006 ?'身份证开门' :
               scope.row.openType==1007 ?'腕带开门' :  '未知动作'
          }}
        </template>
      </el-table-column>
      <el-table-column label="门禁名称" prop="deviceName" show-overflow-tooltip />
      <el-table-column label="是否开门" prop="openState" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.openState==0?'否' :'是'}}
        </template>
      </el-table-column>
      <el-table-column label="体温" prop="temperature" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.temperature=='0..0' ? '--' : scope.row.temperature}}℃
        </template>
      </el-table-column>
      <el-table-column label="照片">
        <template slot-scope="scope">
          <el-button type="text" @click="goAddOrEdit( scope.row)" size="mini" :disabled="loadDisplay(scope.row.openType)">查看 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    <el-dialog title="查看照片" :visible.sync="displayImgdialogVisible" width="40%">
      <span>
        <el-image :src="displayImgUrl"></el-image>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="displayImgdialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import moment from 'moment';
import { selectDeptInfo } from '@/assets/wnms/utils/common';
import BaseQueryPageForm from '../common/BaseQueryPageForm';
import Pagination from '@/components/wnms/paginations/pagination';
import { ListInpatientAceRecord, ListEntranceGuardDeviceInfo } from '@/api/wnms/accessControlExtension/aceRole.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: "callRNFieldList",
  mixins: [BaseQueryPageForm],
  components: {
    Pagination, Treeselect
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
      displayImgdialogVisible: false,
      saveBtnLoading: false,
      openTime: [],
      search: {
        size: 10,
        page: 1
      },
      yh_loading: false,
      displayImgUrl: '',
      deptDeviceList: [],
      openStats: [
        { label: '开', value: 1 },
        { label: '关', value: 0 }
      ],
      queryForm: {
        empName: '',
        deviceId: null,
        deviceName: '',
        openState: '',
        startTime: moment().add(-7, 'd').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      defaultDeptDeviceData: {
        deptId: '',
        deptName: '全部',
        child: []
      },
      disabledOpenTypes: [
        1001, //?'人脸识别开门' : 
        1006 //?'身份证开门' :
      ]
    };
  },
  created () {

  },
  mounted () {
    this.executeQueryPage();
    this.initDeptDeviceTree();
  },
  methods: {
    executeQueryPage () {
      this.yh_loading = true;
      let params = this.createQueryParams();
      params.userName = this.queryForm.empName;
      params.startTime = this.queryForm.startTime;
      params.endTime = this.queryForm.endTime;
      params.deviceId = this.queryForm.deviceId == null ? '' : this.queryForm.deviceId;
      params.openState = this.queryForm.openState;
      ListInpatientAceRecord(params).then(res => {
        if (res.status == 200) {
          this.queryResultHandler(res);
        } else {
          this.$message(res.desc);
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.yh_loading = false;
      });
    },
    initDeptDeviceTree () {
      ListEntranceGuardDeviceInfo({
        deviceType: 'wnEntranceGuard',
        deptId: selectDeptInfo(),
        allDept: 0
      }).then(res => {
        if (res.status == 200) {
          this.$nextTick(() => {
            this.deptDeviceList = [this.defaultDeptDeviceData, ...res.data];
            console.log(this.deptDeviceList);
          });
        }
      }).catch(err => {
      });
    },
    onSelectDeptDeviceList (node, ins) {
      this.queryForm.deviceId = node.deviceId;
    },
    resetForm () {
      this.queryForm.empName = '';
      this.queryForm.deviceId = null;
      this.queryForm.openState = '';
      this.queryForm.startTime = moment().add(-7, 'd').format('YYYY-MM-DD HH:mm:ss');
      this.queryForm.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
      this.executeQueryPage();
    },
    normalizerDevice (node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.child && node.child.length > 0 ? node.child : undefined
      };
    },
    goAddOrEdit (row) {
      let path = row.image;
      this.displayImgUrl = path;//'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg';
      this.displayImgdialogVisible = true;
    },
    loadDisplay (type) {
      if (this.disabledOpenTypes.includes(type)) {
        return false;
      } else
        return true;
    }
  }

}
</script>

<style scoped>
/deep/.el-dialog__footer{
  padding: 85px 20px 20px 20px;
}
  .typt-list-container .el-form {
    margin-bottom: 20px;
  }

</style>
