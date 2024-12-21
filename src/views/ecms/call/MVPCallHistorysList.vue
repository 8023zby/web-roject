<!--
 * @Author: 刘慧
 * @Owner: 刘慧
 * @Date: 2022-08-18 18:09:25
 * @LastEditTime: 2022-10-18 17:31:59
 * @LastEditors: 王纪祥
 * @Description:
 * @FilePath: \yarward-ecms-frontend\src\views\ecms\call\MVPCallHistorysList.vue
-->
<template>
  <div class="typt-list-container">
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="发起设备类型：">
        <el-select v-model="formData.callerType" placeholder="全部" size="small">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in deviceTypes" :key="index" :label="item.desc" :value="item.deviceType"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发起设备：">
        <el-input v-model="formData.callerName" placeholder="" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否接通：">
        <el-select v-model="formData.answerStatus" placeholder="全部" size="small">
          <el-option label="全部" value=""></el-option>
          <el-option label="已接通" value="已接通"></el-option>
          <el-option label="未接通" value="未接通"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker align="center" v-model="formData.callTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" size="small" icon="el-icon-search" @click="btnSearch">搜索</el-button>
          <el-button type="text" @click="btnReset">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr />
    <PaginationTable v-loading="loading" :tableData="tableData" :tableColumn="tableColumn" :pagination='paginations' @onPaginationChange='onPaginationChange'>
      <template v-slot:operation="slotData">
        <span v-if="slotData.data.row.answerStatus === '未接通' || (slotData.data.row.answerStatus === '已接通'  && (!slotData.data.row.videoAudioRecordAddr || !slotData.data.row.callDuration ))">-</span>
        <el-button v-else-if="slotData.data.row.transcodeStatus==='未转码' " size="small" type="text" v-uni="uniKey+'zhuanma'" :key="`zhuanma-${slotData.data.$index}`" @click="transcode(slotData.data.row)">转码
        </el-button>
        <div v-else-if="slotData.data.row.transcodeStatus==='转码成功'">
          <el-button size="small" type="text" v-uni="uniKey+'chakan'" :key="`chakan-${slotData.data.$index}`" @click="showDetail(slotData.data.row)">查看</el-button>
          <el-button size="small" type="text" v-uni="uniKey+'daochu'" :key="`daochu-${slotData.data.$index}`" @click="exportFile(slotData.data.row)">导出</el-button>
        </div>
        <el-button v-else size="small" type="text" v-uni="uniKey+'zhuanmazhuangtai'" disabled>{{ slotData.data.row.transcodeStatus }}</el-button>
      </template>
    </PaginationTable>
    <el-dialog title="查看" :visible.sync="detailVisible" width="580px" :close-on-click-modal="false">
      <!-- 1、nodownload: 不要下载按钮 2、nofullscreen: 不要全屏按钮 3、noremoteplayback: 不要远程回放 4、disablePictureInPicture 不要画中画 按钮 5、noplaybackrate 不要播放速度按钮 -->
      <video v-if="detailVisible" style="margin: 0 0 30px 20px" :src="videoSrc" controls="controls" controlslist="nodownload noremoteplayback noplaybackrate" disablepictureinpicture width="500" height="300"></video>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/ecms/paginations/pagination';
import PaginationTable from '../../../components/ecms/PaginationTable.vue';
import { AxiosJsonApi } from '../../../api/ecms/http';
const moment = require('moment')

const selectDeptInfo = JSON.parse(localStorage.getItem('selectDeptInfo'));
export default {
  name: 'callHistorysList',
  components: { Pagination, PaginationTable },
  data () {
    // 这里存放数据
    return {
      uniKey: 'hujiaojilu_',
      deviceTypes: [
        { deviceType: 'HOST', desc: '医护主机' },
        { deviceType: 'BED', desc: '床头分机' },
        { deviceType: 'BEDSIDE', desc: '床旁分机' },
        { deviceType: 'ROOM', desc: '门口分机' },
        { deviceType: 'DUTY', desc: '值班室分机' },
        { deviceType: 'GUARD', desc: '门禁分机' },
        { deviceType: 'VISIT', desc: '探视分机' },
        { deviceType: 'W101', desc: 'W101手持设备' },
        { deviceType: 'REMOTE_VISIT', desc: '远程探视' },
        { deviceType: 'SOS', desc: '卫生间分机' }
      ],
      tableData: [],
      tableColumn: [
        { label: '是否接通', prop: 'answerStatus', minWidth: 100, width: 120 },
        { label: '发起设备', prop: 'callerName' },
        { label: '接收设备', prop: 'calleeName' },
        { label: '处理方式', prop: 'dealWay', minWidth: 100, width: 120 },
        { label: '呼叫时间', prop: 'callTime', minWidth: 100, width: 160 },
        { label: '处理时间', prop: 'dealTime', minWidth: 100, width: 160 },
        { label: '通话时长', prop: 'callDuration', width: 100 },
        { label: '转码进度', prop: 'transcodeProgress' },
        { label: '操作', fixed: 'right', type: 'slot', slotName: 'operation', width: 150 }
      ],
      paginations: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      connectResultList: [
        { value: '', label: '不限' },
        { value: '已接通', label: '已接通' },
        { value: '未接通', label: '未接通' }
      ],
      formData: this.getFormData(),
      lastFormData: this.getFormData(),
      deptList: [],
      detailVisible: false,
      videoSrc: '',
      downLoadVisible: false,
      loading: false
    };
  },
  computed: {},
  mounted () {
    this.requestTableData();
  },
  // 方法集合
  methods: {
    getFormData () {
      const selectDeptInfo = JSON.parse(localStorage.getItem('selectDeptInfo'));
      return {
        callerType: '',
        deptId: selectDeptInfo.deptId,
        callerName: '',
        answerStatus: '',
        callTime: [moment().subtract(1, 'days').startOf('day').toDate(), moment().endOf('day').toDate()]
      };
    },
    dateFormat (dateStr) {
      const myDate = new Date(dateStr);
      const year = myDate.getFullYear();
      const month = myDate.getMonth() + 1;
      const date = myDate.getDate();
      const hour = myDate.getHours();
      const minute = myDate.getMinutes();
      const second = myDate.getSeconds();
      return year +
        '-' +
        `${month}`.padStart(2, '0') +
        '-' +
        `${date}`.padStart(2, '0') +
        ' ' +
        `${hour}`.padStart(2, '0') +
        ':' +
        `${minute}`.padStart(2, '0') +
        ':' +
        `${second}`.padStart(2, '0');
    },
    btnSearch () {
      const needReset = Object.keys(this.formData).some(item => this.lastFormData[item] !== this.formData[item]);
      if (needReset) { // 查询条件的值发生变更时重置查询条件
        this.paginations.pageIndex = 1;
      }
      this.lastFormData = Object.assign({}, this.formData);
      this.requestTableData();
    },
    btnReset () {
      this.paginations.pageIndex = 1;
      this.formData = this.lastFormData = this.getFormData();
      this.requestTableData();
    },
    onPaginationChange (pageIndex, pageSize) {
      this.paginations.pageIndex = pageIndex;
      this.paginations.pageSize = pageSize;
      this.requestTableData();
    },
    requestTableData () {
      this.loading = true;

      const { callerName, callTime, answerStatus, deptId, callerType } = this.formData;
      AxiosJsonApi('/avcs/mvp/callRecord/common', {
        callStartTime: callTime ? this.dateFormat(callTime[0]) : '',
        callEndTime: callTime ? this.dateFormat(callTime[1]) : '',
        pageNum: this.paginations.pageIndex,
        pageSize: this.paginations.pageSize,
        answerStatus: answerStatus,
        callerName,
        deptId,
        orgId: selectDeptInfo.orgId,
        callerTypes: callerType ? [callerType] : [] // 远程探视
      }).then((res) => {
        const { data, status, desc } = res;
        if (status == 200) {
          const { total, list } = data;
          this.paginations.total = total;
          this.tableData = list;
        } else {
          this.$message.error(desc);
        }
      }).catch((error) => {
        this.$message.error('请求异常');
        console.error(error);
      }).finally(() => {
        this.loading = false;
      });
    },
    showDetail (row) {
      this.detailVisible = true;
      this.videoSrc = row.videoAudioTranscodeAddr;
    },
    exportFile (row) {
      let filePath = row.videoAudioTranscodeAddr;
      let file = filePath.split('.');
      let filename = `${row.callerName}-${row.callTime}`;
      fetch(filePath, {
        method: 'GET',
        mode: 'no-cors'
      })
        .then(async (res) => {
          if (res.status === 200 || res.status === 304) {
            const response = await res.blob();
            return response;
          } else {
            throw res;
          }
        }).then((blob) => {
          const a = document.createElement('a');
          a.style.display = 'none';
          // 使用获取到的blob对象创建的url
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          // 指定下载的文件名
          a.download = filename + '.' + file[file.length - 1];
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // 移除blob对象的url
          window.URL.revokeObjectURL(url);
        }).catch((data) => {
          console.log('导出出， ', data)
          const { status, statusText } = data || {};
          this.$message.error(`${status} - ${statusText}`); //弹出错误提示
        });
    },
    transcode (record) {
      AxiosJsonApi('/mvp/req_transcoding', {
        record_id: record.recordId
      }).then(() => {
        this.$message.success('转码申请受理成功');
        this.requestTableData();
      }).catch(() => {
        this.$message.error('转码申请受理失败');
      });
    }
  },
}
</script>
<style scoped>
.two-row-show{
  display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden;
}
</style>
