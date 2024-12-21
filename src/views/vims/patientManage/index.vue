<!--
 * @Author: 刘慧
 * @Owner: 刘慧
 * @Date: 2022-05-23 13:47:54
 * @LastEditTime: 2022-08-04 14:22:21
 * @LastEditors: 刘慧
 * @Description:
 * @FilePath: \yarward-vims-frontEnd\src\views\vims\patientManage\index.vue
-->
<template>
  <div class="typt-list-main">
    <div class="typt-list-container" style="height: 100%;display: flex;flex-direction: column;">
      <el-form class="demo-form-inline" :inline="true" :model="formData">
        <!-- <el-form-item label="科室：">
          <treeselect :v-uni="uniKey+'keshi'" :clearable="false" placeholder="请选择" v-model="formData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptList" />
        </el-form-item> -->
        <el-form-item label='床号：'>
          <el-input v-uni="uniKey+'chuanghao'" clearable class="ipt" v-model="formData.bedNo" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label='患者姓名：'>
          <el-input v-uni="uniKey+'huanzhexingming'" clearable class="ipt" v-model="formData.patientName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label='探视码：'>
          <el-input v-uni="uniKey+'tanshima'" clearable class="ipt" v-model="formData.visitCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label='家属：'>
          <el-input v-uni="uniKey+'jiashu'" clearable class="ipt" v-model="formData.relativePhone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="typt-search-btn">
          <el-button type="primary" size="small" icon="el-icon-search" @click="btnSearch" v-uni="uniKey+'search'">搜索</el-button>
          <el-button type="text" @click="btnReset" v-uni="uniKey+'reset'">重置</el-button>
        </el-form-item>
      </el-form>
      <PaginationTable :tableData="tableData" :tableColumn="tableColumn" v-loading="loading" :pagination='paginations' @onPaginationChange='onPaginationChange'>
        <template v-slot:operation="slotData">
          <el-button size="small" type="text" v-uni="uniKey+`bianji-${slotData.data.$index}`" :key="`bianji-${slotData.data.$index}`" @click="showDetail(slotData.data.row)">编辑</el-button>
        </template>
      </PaginationTable>
    </div>
    <el-dialog title="编辑" :visible.sync="detailVisible" width="580px" :close-on-click-modal="false">
      <el-form label-width="100px" class="edit-dialog">
        <el-form-item label="床号：">
          <div class="dialog-form-value">{{ patientInfo.bedNo }}</div>
        </el-form-item>
        <el-form-item label="姓名：">
          <div class="dialog-form-value">{{ patientInfo.patientName }}</div>
        </el-form-item>
        <el-form-item label="探视码：">
          <div class="dialog-form-value">{{ patientInfo.visitCode }}</div>
        </el-form-item>
        <el-form-item label="亲属关系：">
          <div class="dialog-relation-div">
            <div v-for="(item, index) in patientInfo.relationList" :key="index" class="relation-info">
              <div class="left">{{item.relationName}}：{{item.relativePhone}}</div>&emsp;
              <span class="right" @click="delRelation(item, index)" v-uni="uniKey+`jiechuguanxi-${index}`">解除关系</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
// import Treeselect from '@riophae/vue-treeselect';
import PaginationTable from '../../../components/vims/PaginationTable';
import api from '../../../api/vims/api';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {};
export default {
  data () {
    return {
      uniKey: 'qinyouguanli_',
      tableData: [],
      tableColumn: [
        { label: '科室名称', prop: 'deptName' },
        { label: '床号', prop: 'bedNo' },
        { label: '患者姓名', prop: 'patientName' },
        { label: '探视码', prop: 'visitCode' },
        { label: '亲属关系', prop: 'sliceRelation', width: 500 },
        { label: '操作', fixed: 'right', type: 'slot', slotName: 'operation' }
      ],
      paginations: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      // deptList: [],
      formData: this.getFormData(),
      loading: false,
      detailVisible: false,
      patientInfo: {}
    };
  },
  components: {
    PaginationTable
    // Treeselect
  },
  mounted () {
    const orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {};
    this.orgId = orgInfo.orgId;
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
        patientName: '',
        relativePhone: '',
        visitCode: ''
      };
    },
    btnSearch () {
      this.paginations.pageIndex = 1;
      this.requestTableData();
    },
    btnReset () {
      this.paginations.pageIndex = 1;
      this.formData = this.getFormData();
      this.requestTableData();
    },
    onPaginationChange (pageIndex, pageSize) {
      this.paginations.pageIndex = pageIndex;
      this.paginations.pageSize = pageSize;
      this.requestTableData();
    },
    requestTableData () {
      this.loading = true;
      const { bedNo, patientName, visitCode, relativePhone, deptId } = this.formData;

      api.getPatientList({
        bedNo,
        patientName,
        relativePhone,
        visitCode,
        orgId: deptInfo.orgId,
        deptId,
        pageNum: this.paginations.pageIndex,
        pageSize: this.paginations.pageSize
      }).then((res) => {
        this.tableData = res.list.length ? res.list.map((item) => {
          item.sliceRelation = '';
          if (item.relation) {
            const arr = item.relation.split(',');
            item.sliceRelation = arr.slice(0, 3).join(',');
            if (arr.length > 3) {
              item.sliceRelation += ' ...';
            }
            item.relationList = [];
            arr.forEach((relationItemStr) => {
              const a = relationItemStr.split(':');
              item.relationList.push({
                relationName: a[0],
                relativePhone: a[1]
              });
            });
          }
          return item;
        }) : [];
        this.paginations.total = res.total;
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.loading = false;
      });
    },
    showDetail (info) {
      this.detailVisible = true;
      this.patientInfo = info;
    },
    delRelation (info, index) {
      const { relationName, relativePhone } = info;
      const { patientName, bedNo, visitCode } = this.patientInfo;
      this.$confirm(`您确定要解除"${relationName}"与${bedNo}床"${patientName}"的亲属关系吗？`, '提示', {
        showClose: false
      }).then(() => {
        api.unbindRelation({
          nickName: relationName,
          phone: relativePhone,
          visitCode,
          orgId: deptInfo.orgId,
          deptId: deptInfo.deptId
        }).then((res) => {
          this.$message({ message: '解除关系成功', type: 'success', duration: 1000 });
          this.patientInfo.relationList.splice(index, 1);
          this.requestTableData(this.pageIndex);
        });
      });
    }
  }
};
</script>
<style scoped lang="scss">
  .edit-dialog{
    height: 500px;
    .relation-info{
      display: flex;
      .left{
        width: 245px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #333333;
      }
      .right{
        color: #f56c6c;
        cursor: pointer;
      }
    }

    /deep/ .el-form-item{
      margin-bottom: 25px !important;
    }

    /deep/ .el-form-item__label{
      color: #666666;
      font-size: 14px;
      padding-right: 8px !important;
      height: 46px;
      line-height: 46px;
    }
    .dialog-form-value{
      background: #f5f5f5 !important;
      height: 46px !important;
      line-height: 46px !important;
      width: 360px;
      font-size: 14px;
      color: #333333;
      padding: 0 15px;
      box-sizing: border-box;
      cursor:not-allowed;
    }
    .dialog-relation-div{
      width: 360px;
      border: 1px solid #e3e3e3;
      height: 200px;
      overflow: auto;
      padding-top: 7px;
      padding-left: 10px;
      padding-right: 24px;
      box-sizing: border-box;
    }
    // 滚动条的宽度
    ::-webkit-scrollbar {
      width: 5px; // 横向滚动条
      height: 5px; // 纵向滚动条 必写
    }
    // 滚动条的滑块
    ::-webkit-scrollbar-thumb {
      background-color: #ddd;
      border-radius: 3px;
    }
  }
</style>
