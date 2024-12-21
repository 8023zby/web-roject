<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form class="demo-form-inline" :inline="true" :model="formSearchData" ref="formSearch">
        <el-form-item label="所属分类：">
          <el-select v-model="formSearchData.parentId" v-uni="'jiaodianmuban_search_suoshufenlei'" placeholder="请选择" clearable size="small" @change="changeSunClassify()">
            <el-option v-for="(item, index) in classifyData" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="焦点分类：">
          <el-select v-model="formSearchData.typeId" v-uni="'jiaodianmuban_search_jiaodianfenlei'" placeholder="请选择" clearable size="small">
            <el-option v-for="(item, index) in typeData" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="焦点名称：">
          <el-input size="small" v-model="formSearchData.focusName" v-uni="'jiaodianmuban_search_jiaodianmingcheng'" placeholder="请输入焦点名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="焦点内容：">
          <el-input size="small" v-model="formSearchData.info" v-uni="'jiaodianmuban_search_jiaodianneirong'" placeholder="请输入焦点内容" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-uni="'jiaodianmuban_search'" icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
          <el-button type="text" v-uni="'jiaodianmuban_reset'" @click="reloadList">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" v-uni="'jiaodianmuban_add'" @click="$emit('option-changed', 'add')" icon="el-icon-plus">添加</el-button>
      <!--<div class="action_div">
        <el-button type="primary" size="small" @click="$emit('option-changed', 'classify')">焦点分类管理</el-button>
      </div>-->
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table ref="table" :data="tableData" stripe highlight-current-row v-loading="loading" height="100%">
        <!-- <el-table-column
        type="index"
        align="center"
        width="120"
        label="序号">
        <template scope="scope">
          <span>{{(pageInfo.currentPage - 1) * pageInfo.size + (scope.$index + 1)}}</span>
        </template>
      </el-table-column> -->
        <el-table-column prop="parentName" align="center" :show-overflow-tooltip="true" label="所属分类">
        </el-table-column>
        <el-table-column align="center" prop="typeName" :show-overflow-tooltip="true" label="焦点分类">
        </el-table-column>
        <el-table-column align="center" prop="focusName" :show-overflow-tooltip="true" label="焦点名称">
        </el-table-column>
        <el-table-column prop="info" :formatter="formatterFocusContent" :show-overflow-tooltip="true" label="焦点内容">
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.deptId !== deptId" v-uni:[scope.row.focusId]="'jiaodianmuban_edit'" type="text" @click="$emit('option-changed', 'add', {}, scope.row)" disabled>编辑</el-button>
            <el-button v-if="scope.row.deptId !== deptId" v-uni:[scope.row.focusId]="'jiaodianmuban_delete'" type="textred" @click="del(scope.row)" disabled>删除</el-button>
            <el-button v-if="scope.row.deptId === deptId" v-uni:[scope.row.focusId]="'jiaodianmuban_edit'" type="text" @click="$emit('option-changed', 'add', {}, scope.row)">编辑</el-button>
            <el-button v-if="scope.row.deptId === deptId" v-uni:[scope.row.focusId]="'jiaodianmuban_delete'" type="textred" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageInfo.currentPage" :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total" v-uni="'jiaodianmuban_pagination'">
      </el-pagination>
    </div>
  </layout>
</template>

<script>
import layout from "../../../components/nrms/layout/list";
import BaseManage from "../../../assets/nrms/mixins/BaseManage";
import { AxiosApi } from "../../../api/nrms/http/index";
export default {
  name: "NurseFocus",
  components: { layout },
  mixins: [BaseManage],
  props: ["params"],
  data() {
    return {
      classifyData: [],
      typeData: [],
      deptId: "",
      modelName: "护理焦点",
      formSearchData: {
        parentId: "",
        typeId: "",
        focusName: "",
        info: "",
      },
      url: "/nrms/web-nr/focus",
    };
  },
  created() {
    let obj = JSON.parse(localStorage.getItem("selectDeptInfo")) || {};
    this.deptId = obj.deptId || "";
    this.getPidData();
    this.getClassifyData();
    this.getData();
  },
  methods: {
    // 重置
    reloadList() {
      this.getClassifyData();
      this.reload();
    },
    // 改变子分类
    changeSunClassify() {
      this.formSearchData.typeId = "";
      this.getClassifyData(this.formSearchData.parentId);
    },
    // 请求分类
    getClassifyData(typeId = "") {
      AxiosApi("/nrms/web-nr/focus-type/get-children-type", {}, "GET", {
        typeId: typeId,
      }).then((res) => {
        this.typeData = res.data || [];
      });
    },
    // 请求父类
    getPidData() {
      AxiosApi("/nrms/web-nr/focus-type/get-type-list", {}, "GET").then(
        (res) => {
          this.classifyData = res.data || [];
        }
      );
    },
    // 格式化数据
    formatterFocusContent(row) {
      let basisStr = "依据D：";
      let measuresStr = "措施A：";
      let missionStr = "宣教T：";
      let evaluateStr = "评价R：";
      if (row.basis === null || row.basis === "") {
        row.basis = "[]";
      }
      if (row.measures === null || row.measures === "") {
        row.measures = "[]";
      }
      if (row.mission === null || row.mission === "") {
        row.mission = "[]";
      }
      if (row.evaluate === null || row.evaluate === "") {
        row.evaluate = "[]";
      }
      let basis = JSON.parse(row.basis);
      let measures = JSON.parse(row.measures);
      let mission = JSON.parse(row.mission);
      let evaluate = JSON.parse(row.evaluate);
      basis.forEach((item, index) => {
        if (item.value === "") return;
        basisStr += item.value + ",";
      });
      measures.forEach((item) => {
        if (item.value === "") return;
        measuresStr += item.value + ",";
      });
      mission.forEach((item) => {
        if (item.value === "") return;
        missionStr += item.value + ",";
      });
      evaluate.forEach((item) => {
        if (item.value === "") return;
        evaluateStr += item.value + ",";
      });
      if (basisStr === "依据D：") {
        basisStr = "";
      }
      if (measuresStr === "措施A：") {
        measuresStr = "";
      }
      if (missionStr === "宣教T：") {
        missionStr = "";
      }
      if (evaluateStr === "评价R：") {
        evaluateStr = "";
      }
      return `${basisStr.substr(0, basisStr.length - 1)}
              ${measuresStr.substr(0, measuresStr.length - 1)}
              ${missionStr.substr(0, missionStr.length - 1)}
              ${evaluateStr.substr(0, evaluateStr.length - 1)}`;
    },
    // 选择页面查询,调用父级方法刷新列表
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.onSearchSubmit("page");
    },
    // 查询上一页，调用父级方法刷新列表
    handleSizeChange(val) {
      this.pageInfo.size = val;
      this.onSearchSubmit("page");
    },
  },
};
</script>
<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
</style>
