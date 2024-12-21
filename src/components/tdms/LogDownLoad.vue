<template>
  <div style="width: 100%;height: 100%">
    <el-form class="typt-add-dialog" ref="logForm" label-width="90px" :rules="rules" :model="form">
      <el-form-item label="日志日期：">
        <el-col :span="11">
          <el-form-item prop="startTime" style="margin-bottom: 0 !important;">
            <el-date-picker class="smallInput" v-model="form.startTime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">&emsp;-</el-col>
        <el-col :span="11">
          <el-form-item prop="endTime" style="margin-bottom: 0 !important;">
            <el-date-picker class="smallInput" v-model="form.endTime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="日志类型：" prop="deviceModel">
        <el-radio v-model="form.logType" label="0">错误日志</el-radio>
        <el-radio v-model="form.logType" label="1">运行日志</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-tdms-footer">
      <el-button @click="cancelLogDown">取 消</el-button>
      <el-button type="primary" :loading="loadingLog" @click="logDown">确 认</el-button>
    </div>
  </div>
</template>

<script>
import { MsgShow } from "../../assets/tdms/js/Message";

export default {
  name: "log-down-load",
  props: {
    deviceId: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      rules: {
        startTime: [
          { required: true, trigger: "blur", message: "请选择开始时间" },
        ],
        endTime: [
          { required: true, trigger: "blur", message: "请选择结束时间" },
        ],
      },
      form: {
        startTime: "",
        endTime: "",
        logType: "0",
        deviceId: "",
      },
      loadingLog: false,
    };
  },
  watch: {
    deviceId() {
      this.form.deviceId = this.deviceId;
    },
  },
  created() {
    this.getNowTime();
    this.form.deviceId = this.deviceId;
  },
  methods: {
    getNowTime() {
      debugger;
      let now = new Date();
      let year = now.getFullYear(); // 得到年份
      let month = now.getMonth(); // 得到月份
      let date = now.getDate(); // 得到日期
      month = month + 1;
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      let defaultDate = `${year}-${month}-${date}`;

      this.$set(this.form, "startTime", defaultDate);
      this.$set(this.form, "endTime", defaultDate);
    },
    cancelLogDown() {
      this.$emit("cancelLogDown");
    },
    logDown() {
      this.$refs["logForm"].validate((valid) => {
        if (valid) {
          this.loadingLog = true;
          if (this.form.endTime < this.form.startTime) {
            this.loadingLog = false;
            MsgShow("warning", "日志开始日期不能大于结束日期", 3000);
            return;
          }
          MsgShow("success", "系统已发送下载日志请求，请耐心等待", 3000);
          this.$emit("logDown");
        }
      });
    },
  },
};
</script>

<style scoped>
.btnDiv {
  margin-top: 30px;
  text-align: right;
}
</style>
