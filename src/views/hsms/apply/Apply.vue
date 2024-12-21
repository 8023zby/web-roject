<template>
  <!--护士排班-排班申请-->
  <div class="typt-list-container">
    <!--查询-->
    <el-form class="demo-form-inline" :inline="true" :model="formSearchData" ref="formSearch">
      <el-form-item label="查询日期：">
        <el-date-picker style="width: 182px;height: 34px;" v-model="formSearchData.searchDate" type="date" value-format="yyyy-MM-dd" size="small" placeholder="请选择">
        </el-date-picker>
      </el-form-item>

      <el-form-item :label="''+typeName+'姓名：'">
        <el-select v-model="formSearchData.accountId" style="width: 182px;height: 34px;" :placeholder="'请选择'" size="small">
          <!--el-option label="请选择" value=""></el-option-->
          <el-option v-for="(item, index) in nurseData" :key="index" :label="item.empName" :value="item.empId" />
        </el-select>
      </el-form-item>

      <el-form-item label="班次：">
        <el-select v-model="formSearchData.shiftId" style="width: 182px;height: 34px;" placeholder="请选择" size="small">
          <!--el-option label="请选择" value=""></el-option-->
          <el-option v-for="(item, index) in dutyData" :key="index" :label="item.shiftName" :value="item.shiftId" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" class="el-button-radius" icon="el-icon-search" @click="onSearchSubmit" size="small">搜索
          </el-button>
          <el-button type="text" @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--end-->
    <hr />
    <div class="typt-list-add-div">
      <el-button type="warning" size="small" @click="$emit('option-changed', 'add', { businessType: formSearchData.businessType })" icon="el-icon-plus">添加
      </el-button>
    </div>
    <!--列表-->
    <el-table :data="tableData" :stripe="CONFIG.table.stripe" v-loading="loading" height="80%">
      <el-table-column prop="empName" align="center" width="160" show-overflow-tooltip :label="typeName+'姓名'">
      </el-table-column>
      <el-table-column align="center" prop="beginDate" label="开始时间">
      </el-table-column>
      <el-table-column align="center" prop="endDate" label="结束时间">
      </el-table-column>
      <el-table-column align="center" prop="shiftName" show-overflow-tooltip label="申请班次">
      </el-table-column>
      <el-table-column align="center" prop="applyDescribe" label="申请原因" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="$emit('option-changed', 'add', { businessType: formSearchData.businessType }, scope.row)">
            编辑
          </el-button>
          <el-button type="text" @click="del(scope.row)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <div class="paginationDiv">
      <!--组件页码显示-->
      <page-info :pageInfo="pageInfo"></page-info>
    </div>
    <!--end-->
  </div>
</template>

<script>
import BaseManage from "../../../assets/hsms/mixins/BaseManage";
import PageInfo from "../../../components/hsms/PageInfoCommon";
import { GetDuty, GetNurseUser } from "../../../api/hsms";
import config from "../../../assets/hsms/mixins/config";

export default {
  name: "NurseApply",
  components: { PageInfo },
  mixins: [BaseManage, config],
  props: ["params"],
  data() {
    return {
      nurseData: [],
      dutyData: [],
      nurseObj: {},
      modelName: "排班申请",
      typeName: "护士",
      formSearchData: {
        searchDate: "",
        shiftId: "",
        accountId: "",
        businessType: "NURSE",
      },
      url: "/hsms/web-hs/apply",
    };
  },
  created() {
    this.formSearchData.businessType = this.params.businessType;
    if (this.params.businessType === "DOCTOR") {
      this.typeName = "医生";
    }
    this.getDutyData();
    this.getNurseData();
  },
  methods: {
    // 护士姓名对照
    formatName(row) {
      return this.nurseObj[row.accountId] || "";
    },
    // 请求护士
    getNurseData() {
      GetNurseUser(this.formSearchData.businessType).then((res) => {
        this.nurseData = res;
        res.forEach((item) => {
          this.nurseObj[item.empId] = item.empName;
        });
        this.getData();
      });
    },
    // 请求班次
    getDutyData() {
      GetDuty(this.formSearchData.businessType).then((res) => {
        this.dutyData = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/hsms/css/self_common";

.el-button--small {
  padding: 6px 16px !important;
  border-radius: 2px !important;
}
</style>
