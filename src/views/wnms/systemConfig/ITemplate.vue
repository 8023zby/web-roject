<template>
  <div class="typt-list-container">
    <!-- 查询条件 -->
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="分机类型:">
          <el-select v-model="search.deviceType" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option v-for="item in deviceTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分机型号:">
          <el-select v-model="search.deviceModel" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option v-for="item in deviceModelList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="模板名称:">
          <el-input v-model="search.templateName"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 查询按钮 -->
          <div class="typt-search-btn">
            <el-button type="primary" @click="queryHandler" class="el-button-radius" icon="el-icon-search">搜索</el-button>
            <el-button type="text" class="el-button-radius" @click="onResetSearch">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <hr />
      <div class="typt-list-add-div">
        <el-button type="warning" icon="el-icon-upload" @click="uploadVisible = true">上传</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" height="80%">
      <el-table-column prop="sortIndex" align="center" label="序号" width="150">
        <template slot-scope="scope">
          <span>{{scope.$index + pagination.size * (pagination.page - 1) + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分机类型">
        <template slot-scope="scope">
          <span>{{getDeviceName(scope.row.deviceType)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deviceModel" align="center" label="分机型号"></el-table-column>
      <el-table-column prop="templateName" align="center" label="模板名称"></el-table-column>
      <el-table-column label="是否使用" align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.isUsed === '正在使用'" :content="scope.row.deptName" placement="top">
            <span style="color: #1e87f0">使用中</span>
          </el-tooltip>
          <span v-else>{{scope.row.isUsed}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="el-text-danger" @click="onDelTemplate(scope.row.templateId)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationDiv">
      <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    </div>
    <!--排序对话框-->
    <el-dialog :visible.sync="uploadVisible" @close="resetUploadForm()" title="上传模板" width="800px">
      <div>
        <el-form :model="uploadForm" ref="uploadForm" label-width="100px" :rules="uploadFormRules">
          <el-form-item label="分机类型:" prop="deviceType">
            <el-select v-model="uploadForm.deviceType" placeholder="全部" @change="onDeviceTypeChange">
              <el-option v-for="item in deviceTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分机型号:" prop="deviceModel">
            <!-- <el-input v-model="uploadForm.deviceModel" placeholder="请选择分机类型" readonly="" style="width: 215px"></el-input> -->
            <el-select v-model="uploadForm.deviceModel" placeholder="请选择">
              <el-option v-for="(item, index) in devicesMap[uploadForm.deviceType]" :key="index" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板文件" prop="templateName">
            <div style="display: flex; align-item: center">
              <el-input v-model="uploadForm.templateName" placeholder="请选择模板文件" style="width: 215px;margin-right: 20px" :readonly="true"></el-input>
              <el-upload class="upload-demo" action="/" :multiple="false" :on-change="fileChange" :show-file-list="false" :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" style="margin-right: 20px">上传模板</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onUploadSubmit()">确 定</el-button>
        <el-button @click="uploadVisible = false;resetUploadForm()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/wnms/paginations/pagination";
import BaseQueryPageForm from "../common/BaseQueryPageForm";
import * as API from "@/api/wnms/msgManage/systemConfig";
import { debounce } from "@/assets/wnms/utils";
const devicesMap = Object.freeze({
  iBedHeadExtension: ["YH-6297i", "YH-5110i"],
  iDoorWayExtension: ["YH-6267i", "YH-A26i"],
});
export default {
  components: { Pagination },
  mixins: [BaseQueryPageForm],
  data() {
    return {
      /**
       * 通用参数
       * ------------------------------------------------------------------
       */
      deviceTypeList: [
        { value: "iBedHeadExtension", label: "床头分机" },
        { value: "iDoorWayExtension", label: "门口分机" },
      ],
      deviceModelList: [
        { value: "YH-6297i", label: "YH-6297i" },
        { value: "YH-6267i", label: "YH-6267i" },
        { value: "YH-A26i", label: "YH-A26i" },
        { value: "YH-5110i", label: "YH-5110i" },
      ],
      /**
       * 搜索
       * ------------------------------------------------------------------
       */
      // 搜索参数
      search: {
        deviceType: "",
        deviceModel: "",
        templateName: "",
      },
      /**
       * 列表
       * ------------------------------------------------------------------
       */
      // 表格数据
      tableData: [],
      /**
       * 上传弹框
       * ------------------------------------------------------------------
       */
      // 上传弹框是否显示
      uploadVisible: false,
      uploadForm: {
        deviceType: "",
        deviceModel: "",
        templateName: "",
        file: null,
      },
      uploadFormRules: {
        deviceType: {
          required: true,
          message: "请选择分机类型",
          trigger: "blur",
        },
        deviceModel: {
          required: true,
          message: "请选择分机型号",
          trigger: "blur",
        },
        templateName: {
          required: true,
          message: "请上传模板",
          trigger: "blue",
        },
      },
      hasUploaded: false,
      devicesMap,
    };
  },
  created() {
    this.executeQueryPage();
  },
  methods: {
    debounce,
    /**
     * ------------------------------------------------------------------
     * 搜索
     * ------------------------------------------------------------------
     */
    /**
     * @description: 重置搜索参数
     * @param {*}
     * @return {*}
     */
    onResetSearch() {
      this.search = {
        deviceType: "",
        deviceModel: "",
        templateName: "",
      };
      this.queryHandler();
    },
    /**
     * ------------------------------------------------------------------
     * 列表
     * ------------------------------------------------------------------
     */
    /**
     * @description: 获取列表
     * @param {*}
     * @return {*}
     */
    async executeQueryPage() {
      try {
        const res = await API.getTemplateList({
          ...this.search,
          ...this.pagination,
        });
        this.tableData = res.data.list;
        this.pagination.total = res.data.total;
      } catch (error) {}
    },
    getDeviceName(deviceType) {
      return (
        (this.deviceTypeList.find((item) => item.value === deviceType) &&
          this.deviceTypeList.find((item) => item.value === deviceType)
            .label) ||
        ""
      );
    },
    async onDelTemplate(templateId) {
      this.$confirm(
        '<div style="height: 80px;line-height: 80px">此操作将删除该模板，是否继续？</div>',
        "提示",
        {
          dangerouslyUseHTMLString: true,
          type: "warning",
        }
      )
        .then(async () => {
          try {
            const res = await API.removeTemplate(templateId);
            this.$message.success("删除成功");
            await this.executeQueryPage();
          } catch (error) {}
        })
        .catch(() => {});
    },
    /**
     * ------------------------------------------------------------------
     * 上传弹框
     * ------------------------------------------------------------------
     */
    /**
     * @description: 上传弹框确认
     * @param {*}
     * @return {*}
     */
    async onUploadSubmit() {
      this.$refs["uploadForm"].validate(async (valid) => {
        if (valid) {
          if (this.hasUploaded) {
            return;
          }
          this.hasUploaded = true;
          let Loading = null;
          try {
            let data = new FormData();
            data.append("file", this.uploadForm.file);
            data.append("deviceType", this.uploadForm.deviceType);
            data.append("deviceModel", this.uploadForm.deviceModel);
            Loading = this.$loading({
              fullscreen: true,
              lock: true,
              text: "正在上传中，请稍后",
            });
            const res = await API.uploadTemplate(data);
            this.$message.success("上传成功");
            await this.executeQueryPage();
            this.resetUploadForm();
            this.uploadVisible = false;
            this.hasUploaded = false;
          } catch (error) {
            this.$message({
              type: "error",
              message: error.message || error.desc || error,
            });
            this.hasUploaded = false;
          }
          Loading && Loading.close();
        } else {
          return false;
        }
      });
    },
    fileChange(file) {
      this.uploadForm.templateName = file.name;
      this.uploadForm.file = file.raw;
    },
    resetUploadForm() {
      this.uploadForm = {
        deviceType: "",
        deviceModel: "",
        templateName: "",
        file: null,
      };
      this.$refs["uploadForm"].resetFields();
    },
    onDeviceTypeChange(value) {
      this.uploadForm.deviceModel = devicesMap[value][0];
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
