<template>
  <layout v-loading="loading">
    <!-- 查询条件 -->
    <div slot="query" class="query-items">
      <el-form ref="search_form" :inline="true" :model="search_form">
        <el-form-item label="时间:" prop="beginTime">
          <el-col :span="11">
            <el-date-picker v-model="search_form.beginTime" type="datetime" :clearable="false" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择日期" />
          </el-col>
        </el-form-item>
        <span class="to">至</span>
        <el-form-item prop="endTime">
          <el-col :span="11">
            <el-date-picker v-model="search_form.endTime" type="datetime" :clearable="false" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择日期" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchForm()">搜索</el-button>
          <el-button type="text" @click="resetForm('search_form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table ref="table" :data="table_data" :row-key="getRowKeys" highlight-current-row height="100%">
        <!-- <el-table-column type="index" label="序号" width="120" align="center">
          <template scope="scope">
            <span>{{ (search_form.page - 1) * search_form.size + (scope.$index + 1) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="caseName" label="病历名称" show-overflow-tooltip align="center" />
        <el-table-column prop="caseTime" label="记录时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.caseTime ? scope.row.caseTime.split(" ")[0] : ""
            }}<br />
            {{ scope.row.caseTime ? formatTime(scope.row.caseTime) : "" }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="130" align="center">
          <template slot-scope="scope">
            <el-image :ref="'preview' + scope.row.caseId" :src="url" style="width: 0px; height: 0px" :preview-src-list="images" />
            <el-button type="text" :disabled="
                (reportType === 'pdf' &&
                  (scope.row.caseUrl == '' || scope.row.caseUrl == null)) ||
                ((reportType === 'html' ||
                  reportType === 'text' ||
                  reportType === 'images') &&
                  (scope.row.caseContent == '' ||
                    scope.row.caseContent == null))
              " @click="showDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination :current-page.sync="page_current" :page-size="search_form.size" layout="total, sizes, prev, pager, next, jumper" :total="page_total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </layout>
</template>

<script>
import layout from "../../../components/bnms/layout/list";
import { ApiCaseHistory } from "../../../api/bnms/index";
import { ApiClinicalReport } from "../../../api/nrms";
import moment from "moment";

export default {
  name: "List",
  components: { layout },
  props: ["patient", "patientType"],
  data() {
    return {
      url: "",
      images: [],
      loading: false,
      page_current: 1,
      page_total: 1,
      table_data: [],
      // 查询表单
      search_form: {
        patientId: "",
        beginTime: moment().subtract(6, "days").format("YYYY-MM-DD 00:00"),
        endTime: moment().subtract(0, "days").format("YYYY-MM-DD 23:59"),
        page: 1,
        size: 10,
      },
      reportType: "",
    };
  },
  watch: {
    patient(patient) {
      this.search_form.patientId = patient.patientId;
      this.search_form.page = 1;
      this.getData();
    },
  },
  created() {
    this.getReportType();
  },
  activated() {
    this.$nextTick(function () {
      this.$refs.table.doLayout();
    });
  },
  updated() {
    this.$nextTick(function () {
      this.$refs.table.doLayout();
    });
  },
  methods: {
    getData() {
      if (this.search_form.patientId == "") return;
      this.loading = true;
      this.table_data = [];
      ApiCaseHistory.select(this.search_form)
        .then((res) => {
          this.table_data = res.data.list || [];
          this.page_total = res.data.total;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.message);
        });
    },
    searchForm() {
      if (!this.hasPatient()) {
        return false;
      }
      this.handleCurrentChange(1);
    },
    resetForm() {
      this.$refs.search_form.resetFields();
      this.handleCurrentChange(1);
    },
    getRowKeys(row) {
      return row.caseId;
    },
    handleSizeChange(val) {
      this.search_form.size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page_current = this.search_form.page = val;
      this.getData();
    },
    hasPatient() {
      if (!this.patient.patientId) {
        this.$message.warning("请先选择患者！");
        return false;
      }
      return true;
    },
    getReportType() {
      // 获取报告类型
      ApiClinicalReport.getReportType()
        .then((res) => {
          const { caseFile = "pdf" } = res.data || {};
          this.reportType = caseFile; // 报告格式类型
        })
        .catch((err) => {
          this.$toast(err.message);
        });
    },
    showDetail(row) {
      const type = this.reportType;

      let name = "";
      let query = null;
      switch (type) {
        case "html":
        case "text":
          name = "inspection-html";
          query = { html: row.caseContent || "", title: "病历详情" };
          break;
        case "pdf":
          name = "case-details";

          query = { pdfPath: row.caseUrl, title: "病历详情" };
          break;
        case "images":
          this.images = JSON.parse(row.caseContent) || [];

          this.$refs["preview" + row.caseId].showViewer = true;
          break;
      }

      if (type !== "images") {
        this.$router.push({
          name: name,
          query: query,
        });
      }
    },
    formatTime(value) {
      return moment(value).format("HH:mm");
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/bnms/css/self_common";
.query-items {
  .to {
    display: inline-block;
    line-height: 32px;
    margin: 12px 0;
  }
}
</style>
