<!--
 * @Author: 刘慧
 * @Owner: 刘慧
 * @Date: 2022-05-21 16:22:22
 * @LastEditTime: 2023-04-15 10:00:00
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \yarward-vims-frontEnd\src\views\vims\visitRecord\index.vue
-->
<template>
  <div class="typt-list-main">
    <div class="typt-list-container" style="height: 100%;display: flex;flex-direction: column;">
      <el-form class="demo-form-inline" :inline="true" :model="formData">
        <!-- <el-form-item label="科室：">
          <treeselect :v-uni="uniKey+'keshi'" placeholder="请选择" v-model="formData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptList" :clearable="false" />
        </el-form-item> -->
        <el-form-item label='床号：'>
          <el-input clearable class="ipt" v-model="formData.bedNo" placeholder="请输入床号" v-uni="uniKey+'chuanghao'"></el-input>
        </el-form-item>
        <el-form-item label='是否接通：'>
          <el-select v-model="formData.answerStatus" v-uni="uniKey+'shifoujietong'">
            <el-option v-for="item in connectResultList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="呼叫时间：">
          <el-date-picker v-uni="uniKey+'hujiaoshijian'" align="center" v-model="formData.callTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="typt-search-btn">
          <el-button type="primary" size="small" icon="el-icon-search" @click="btnSearch" v-uni="uniKey+'search'">搜索</el-button>
          <el-button type="text" @click="btnReset" v-uni="uniKey+'reset'">重置</el-button>
        </el-form-item>
      </el-form>
      <PaginationTable :tableData="tableData" :tableColumn="tableColumn" :pagination='paginations' @onPaginationChange='onPaginationChange' v-loading="loading">
        <template v-slot:operation="slotData">
          <span v-if="slotData.data.row.answerStatus === '未接通' || (slotData.data.row.answerStatus === '已接通'  && (!slotData.data.row.videoAudioRecordAddr || !slotData.data.row.callDuration ))">-</span>
          <el-button v-else-if="slotData.data.row.transcodeStatus==='未转码' " size="small" type="text" v-uni="uniKey+'zhuanma'" :key="`zhuanma-${slotData.data.$index}`" @click="transcode(slotData.data.row)">转码
          </el-button>
          <div v-else-if="slotData.data.row.transcodeStatus==='转码成功'">
            <el-button size="small" type="text" v-uni="uniKey+'chakan'" :key="`chakan-${slotData.data.$index}`" @click="showDetail(slotData.data.row)">查看</el-button>
            <el-button size="small" type="text" v-uni="uniKey+'daochu'" :key="`daochu-${slotData.data.$index}`" @click="exportData(slotData.data.row)">导出</el-button>
          </div>
          <el-button v-else size="small" type="text" v-uni="uniKey+'zhuanmazhuangtai'" disabled>{{ slotData.data.row.transcodeStatus }}</el-button>
        </template>
      </PaginationTable>
    </div>
    <el-dialog title="查看" :visible.sync="detailVisible" width="580px" :close-on-click-modal="false">
      <!-- 1、nodownload: 不要下载按钮 2、nofullscreen: 不要全屏按钮 3、noremoteplayback: 不要远程回放 4、disablePictureInPicture 不要画中画 按钮 5、noplaybackrate 不要播放速度按钮 -->
      <video v-if="detailVisible" style="margin: 0 0 30px 20px" :src="videoSrc" controls="controls" controlslist="nodownload noremoteplayback noplaybackrate" disablepictureinpicture width="500" height="300"></video>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="downLoadVisible" width="400px" :close-on-click-modal="false">
      <div style="height: 80px;display: flex;padding-top:30px;justify-content: center;font-size: 16px">正在准备视频资源，请稍后。。。</div>
    </el-dialog>
  </div>
</template>
<script>
// import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import PaginationTable from '../../../components/vims/PaginationTable';
import api from '../../../api/vims/api';
let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {};
export default {
  data () {
    return {
      uniKey: 'tanshijilu_',
      tableData: [],
      tableColumn: [
        { label: '序号', type: 'index', width: 80 },
        { label: '发起方', prop: 'callerName' },
        { label: '接收方', prop: 'calleeName' },
        { label: '是否接通', prop: 'answerStatus', minWidth: 100, width: 120 },
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
  components: {
    PaginationTable
    // Treeselect
  },
  mounted () {
    // this.getDeptList();
    this.requestTableData();
  },
  methods: {
    // 获取科室列表
    // getDeptList () {
    //   api.getDeptList().then((data) => {
    //     let temp = JSON.stringify(data.list);
    //     temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '');
    //     this.deptList = JSON.parse(temp);
    //   }).catch((err) => {
    //     console.error('getDeptList error: ', err);
    //   });
    // },
    getFormData () {
      const selectDeptInfo = JSON.parse(localStorage.getItem('selectDeptInfo'));
      return {
        deptId: selectDeptInfo.deptId,
        bedNo: '',
        answerStatus: '',
        callTime: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()]
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
      const { bedNo, callTime, answerStatus, deptId } = this.formData;
      api.getVisitRecordList({
        bedNo,
        callStartTime: callTime ? this.dateFormat(callTime[0]) : '',
        callEndTime: callTime ? this.dateFormat(callTime[1]) : '',
        pageNum: this.paginations.pageIndex,
        pageSize: this.paginations.pageSize,
        answerStatus,
        deptId,
        orgId: deptInfo.orgId,
        callerTypes: ['REMOTE_VISIT'] // 远程探视
      }).then((res) => {
        const { total, list } = res;
        this.paginations.total = total;
        this.tableData = list;
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.loading = false;
      });
    },
    showDetail (row) {
      this.detailVisible = true;
      this.videoSrc = row.videoAudioTranscodeAddr;
    },
    exportData (row) {
      this.downLoadVisible = true;
      fetch(`${row.videoAudioTranscodeAddr}`).then(async (res) => {
        const response = await res.blob();
        if (response.type === 'application/json') {
          throw response;
        }
        return response;
      }).then((blob) => {
        const a = document.createElement('a');
        a.style.display = 'none';
        // 使用获取到的blob对象创建的url
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        // 指定下载的文件名
        a.download = `${row.bedNo}床探视视频-${row.callTime}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // 移除blob对象的url
        window.URL.revokeObjectURL(url);
      }).catch((data) => {
        console.error(data, '导出报错');
        const reader = new FileReader(); // 创建一个FileReader实例
        reader.readAsText(data, 'utf-8'); // 读取文件,结果用字符串形式表示
        reader.onload = () => { // 读取完成后,**获取reader.result**
          console.error('错误内容: ', reader.result);
          const { msg, status, error } = JSON.parse(reader.result);
          this.$message.error(msg || `${status} - ${error}`); // 弹出错误提示
        };
      }).finally(() => {
        this.downLoadVisible = false;
      });
    },
    transcode (record) {
      api.videoTranscode({ record_id: record.recordId }).then(() => {
        this.$message.success('转码申请受理成功');
        this.requestTableData();
      }).catch(() => {
        this.$message.error('转码申请受理失败');
      });
    }
  }
};
</script>
<style lang="">

</style>
