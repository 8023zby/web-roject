<template>
  <div class="typt-list-container">
    <el-form class="demo-form-inline" :inline="true">
      <!--运维端-->
      <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptAddCls">
        <treeselect v-uni="actFormKey + 'keshi'" placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptData" noChildrenText="无子节点" />
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button v-uni="actKey + 'search'" type="primary" class="el-button-tdms-search" icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
          <el-button v-uni="actKey + 'reset'" type="text" @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr />
    <div v-if="authorityObj[`add_${formSearchDataStatic.deviceType}`] || authorityObj[`import_${formSearchDataStatic.deviceType}`]" class="typt-list-add-div">
      <el-button v-uni="actKey + 'add'" v-if="authorityObj[`add_${formSearchDataStatic.deviceType}`]" class="el-button-tdms-search" type="warning" size="small" @click="$emit('option-changed', 'add',{ deviceType: formSearchDataStatic.deviceType })" icon="el-icon-plus">添加</el-button>
      <div v-if="authorityObj[`import_${formSearchDataStatic.deviceType}`]" class="action_div">
        <el-button v-uni="actKey + 'import'" class="el-button-tdms-search" type="primary" size="small" @click="importExcel">批量导入</el-button>
      </div>
    </div>
    <!--end-->
    <!--列表-->
    <el-table :data="tableData" stripe v-loading="loading" height="80%">
      <el-table-column prop="deptName" label="护理单元" align="center"></el-table-column>
      <el-table-column prop="deviceModel" label="终端型号" align="center"></el-table-column>
      <el-table-column prop="macAddress" label="蓝牙MAC地址/序列号" align="center"></el-table-column>
      <el-table-column prop="icCardNum" label="IC卡号" align="center"></el-table-column>
      <el-table-column v-if="authorityObj[`mod_${formSearchDataStatic.deviceType}`] || authorityObj[`del_${formSearchDataStatic.deviceType}`]" label="操作" width="260" align="center">
        <template slot-scope="scope">
          <span v-uni="actKey + 'edit-' + scope.row.deviceId" v-if="authorityObj[`mod_${formSearchDataStatic.deviceType}`]" class="el-button-text-color" @click="$emit('option-changed', 'add',{ deviceType: formSearchDataStatic.deviceType }, scope.row)">编辑</span>
          <span v-uni="actKey + 'delete-' + scope.row.deviceId" v-if="authorityObj[`del_${formSearchDataStatic.deviceType}`]" @click="handleDelete(scope.row)" class="el-text-danger">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <page-info :pageInfo="pageInfo"></page-info>
    <!--end-->
    <!--导入-->
    <el-dialog title="批量导入" :visible.sync="importVisible" width="500px" :close-on-click-modal="false" @close="onSearchSubmit">
      <import-excel v-if="importVisible" :deptId="formSearchData.deptId" :deptData="deptData" :deviceType="formSearchDataStatic.deviceType" @cancelImport="cancelImport" />
    </el-dialog>
  </div>
</template>

<script>
import PageInfo from "../../../components/tdms/PageInfoA10";
import BaseManage from "../../../assets/tdms/mixins/BaseManage";
import ImportExcel from "../../../components/tdms/ImportExcel";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: ["params"],
  components: {
    ImportExcel,
    PageInfo,
    Treeselect,
  },
  mixins: [BaseManage],
  inject: ["checkMoreAuthority"],
  data() {
    return {
      importVisible: false,
      modelName: "体征设备",
      formSearchDataStatic: {
        deviceType: "",
      },
      formSearchData: {
        deptId: null,
      },
      url: "/tdms/web-td/device/sign",
      authorityArr: [],
      firstFlag: true,
      actKey: "tizhengshebei_",
      actFormKey: "tizhengshebei__",
    };
  },
  activated() {
    this.formSearchDataStatic.deviceType = this.params.deviceType;
    this.authorityArr = [
      "add_" + this.formSearchDataStatic.deviceType,
      "mod_" + this.formSearchDataStatic.deviceType,
      "del_" + this.formSearchDataStatic.deviceType,
      "import_" + this.formSearchDataStatic.deviceType,
    ];
    // 判断登录端
    this.getLandingEndCode();
    if (this.firstFlag) {
      this.getDeptListAndSearch();
    } else {
      this.onSearchSubmit("page");
    }
    // 判断是否有动作权限
    this.getListAuthority();
  },
  methods: {
    cancelImport() {
      this.importVisible = false;
      this.reload();
    },
    // 查询
    onSearchSubmit(act = "") {
      if (act !== "page") {
        this.pageInfo.currentPage = 1;
        localStorage.setItem("tdms_searchDept", this.formSearchData.deptId);
      }
      this.getData();
    },
    // 批量导入
    importExcel() {
      this.importVisible = true;
    },
    // 删除
    handleDelete(row) {
      this.del(`${this.url}/${row.deviceId}`);
    },
    reload() {
      this.pageInfo.currentPage = 1;
      this.formSearchData = this.clearObj(this.formSearchData);
      // 兼容运维端
      if (this.landingEndCode === "OPEX") {
        let deptId = localStorage.getItem("selectDeptId");
        if (deptId === "null") {
          deptId = "";
        }
        this.formSearchData.deptId = deptId;
      } else {
        this.formSearchData.deptId = null;
      }
      this.getData();
    },
  },
};
</script>

<style lang="scss">
.zdpz {
  .el-dialog__body {
    height: 600px;
    overflow: auto;
  }
}
</style>
