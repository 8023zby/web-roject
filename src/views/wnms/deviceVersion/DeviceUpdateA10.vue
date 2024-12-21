<template>
  <div class="tdms-update-div">
    <el-form ref="deviceForm" label-width="120px" class="typt-add-dialog" style="width: 100%;" :rules="rules" :model="form">
      <!--<el-form-item label="终端型号：" prop="deviceModel">
          <el-select style="width: 300px" v-model="form.deviceModel" placeholder="请选择">
            <el-option v-for="item in deviceModelData" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>-->
      <!--<el-form-item label="升级包：" prop="fileUrl">
          <el-upload
            class="upload-demo"
            :limit="limitNum"
            accept="zip"
            :action="baseUrl+'/web-td/file/'"
            :data = "params"
            :before-upload = "beforeUpload"
            :on-remove="handleRemove"
            :on-success = "uploadFile"
            :file-list="fileList">
            <el-button size="small" type="primary" style="height: 28px;padding:0 !important;width: 80px;border-radius: 2px !important;">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptCls tdms-update" prop="deptId">
          <treeselect style="width: 300px;" placeholder="请选择" v-model="form.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptData" noChildrenText="无子节点"/>
        </el-form-item>-->
      <el-form-item label="升级时间：">
        <el-date-picker style="width: 300px" v-model="form.updateTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择升级包：" prop="zipUrl" style="width: 98%;height: 300px">
        <zip-manage ref="zipManage"></zip-manage>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-tdms-footer">
      <el-button @click="cancelDeviceUpdate">取 消</el-button>
      <el-button type="primary" @click="deviceUpdate">确 认</el-button>
    </div>
  </div>
</template>

<script>
import ZipManage from "../../../components/wnms/Upload/Zip.vue";

export default {
  name: "device-update",
  components: { ZipManage },
  props: {
    deptList: {
      type: Array,
      require: true
    },
    deviceModel: {
      type: String,
      require: true
    },
    deptId: {
      type: String,
      require: true
    },
    deptData: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      rules: {
        zipUrl: [
          { required: true, message: "请选择升级包", trigger: "change" }
        ],
        deviceModel: [
          { required: true, message: "请选择终端型号", trigger: "change" }
        ],
        deptId: [{ required: true, message: "请选择科室", trigger: "change" }],
        fileUrl: [
          { required: true, message: "还未成功上传升级包", trigger: "change" }
        ]
      },
      baseUrl: "",
      limitNum: 1,
      params: {
        fileName: ""
      },
      form: {
        deviceModel: "",
        fileUrl: "",
        updateTime: "",
        deviceType: "",
        zipUrl: "1",
        deptId: null
      },
      fileList: [],
      landingEndCode: ""
    };
  },
  created() {
    this.form.deptId = this.deptId;
  },
  methods: {
    // 获取登录端标识
    getLandingEndCode() {
      let codeStr = localStorage.getItem("selectLandingEndInfo");
      if (codeStr !== "" && codeStr !== null) {
        let tempInfo = JSON.parse(codeStr);
        this.landingEndCode = tempInfo.landingEndCode;
      }
    },

    cancelDeviceUpdate() {
      this.$emit("cancelDeviceUpdate");
    },
    deviceUpdate() {
      this.$refs["deviceForm"].validate((valid) => {
        if (valid) {
          let zipInfo = this.$refs.zipManage.currentRow;
          this.form.fileUrl = zipInfo.packageUrl || "";
          this.form.deviceModel = zipInfo.deviceModel || "";
          if (this.form.fileUrl === "") {
            this.$message({ type: "warning", message: "请选择升级包" });
            return false;
          }
          this.$emit("deviceUpdate");
        }
      });
    },
    beforeUpload(file) {
      let arr = file.name.split(".");
      let type = arr[arr.length - 1];
      const testmsg = /^zip$/.test(type);
      if (!testmsg) {
        this.$message.error("请上传文件zip格式!");
        return false;
      }
      this.params.fileName = file.name;
    },
    handleRemove(file, fileList) {
      this.fileList = [];
      this.form.fileUrl = "";
    },
    // 上传成功之后
    uploadFile(response, file) {
      let status = response.status;
      let desc = response.desc;
      if (status === 200) {
        this.form.fileUrl = response.data;
      } else {
        this.$message.error(desc);
      }
    },
    destroyed() {}
  }
};
</script>

<style scoped>
.btnDiv {
  margin-top: 30px;
  text-align: right;
}
</style>
<style lang="scss">
.tdms-update-div {
  .el-form-item {
    margin-bottom: 30px !important;
  }
  .vue-treeselect__multi-value {
    line-height: 30px;
  }
  /*.vue-treeselect__control{
      width: 300px;
    }*/
}
</style>
