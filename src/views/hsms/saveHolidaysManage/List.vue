<template>
  <layout_aside v-loading="loading">
    <div slot="aside">
      <save_record @initAccount="initAccount" ref="saveRecord" />
    </div>
    <div slot="main">
      <layout_list>
        <div slot="query" class="query-items">
          <el-form ref="search_form" :inline="true" :model="search_form" label-suffix=":">
            <el-form-item label="生效日期" prop="dateType">
              <el-radio-group v-model="search_form.dateType" v-uni="'cunjiaguanli_changeDateType'" @change="dateTypeChange">
                <el-radio :label="1">最近三个月</el-radio>
                <el-radio :label="2">最近半年</el-radio>
                <el-radio :label="3">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="startDate">
              <el-col :span="11">
                <el-date-picker v-model="search_form.startDate" type="date" value-format="yyyy-MM-dd" :clearable="false" placeholder="选择日期" :picker-options="pickerBeginOptions" :disabled="(search_form.dateType===1)||(search_form.dateType===2)">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <span class="to">至</span>
            <el-form-item prop="endDate">
              <el-col :span="11">
                <el-date-picker v-model="search_form.endDate" type="date" value-format="yyyy-MM-dd" :clearable="false" placeholder="选择日期" :picker-options="pickerEndOptions" :disabled="(search_form.dateType===1)||(search_form.dateType===2)">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="el-button-radius btn-position" icon="el-icon-search" @click="getData()" size="small" v-uni="'cunjiaguanli_search'">搜索
              </el-button>

              <el-button type="text" @click="reset" v-uni="'cunjiaguanli_reset'">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div slot="left_btn" class="tool-bar">
          <el-button type="warning" icon="el-icon-plus" @click="itemAdd(null)" v-uni="'cunjiaguanli_add'">添加
          </el-button>
        </div>
        <div slot="main" class="main-list">
          <el-table ref="table" highlight-current-row :data="tableData" height="100%" :row-style="{height:'48px'}" stripe>
            <!-- <el-table-column type="index" label="序号" align="center" width="120">
              <template slot-scope="scope">
                {{(search_form.page - 1) * search_form.size +
                scope.$index + 1}}
              </template>
            </el-table-column> -->
            <el-table-column align="center" prop="effectiveDate" label="生效日期" min-width="100px">
              <template slot-scope="scope">
                {{formatTime(scope.row.effectiveDate,'YYYY-MM-DD')}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="holidayValueStr" label="加扣数值" min-width="150px">
              <template slot-scope="scope">
                <span :style="{'color':(scope.row.holidayType===1?'#13CE66':'#F56C6C')}">{{scope.row.holidayValueStr}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="holidayBalanceValueStr" label="存假余额" min-width="150px">
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip min-width="200px">
              <template slot="header" slot-scope="scope">备注</template>
              <template slot-scope="scope">
                {{scope.row.remark?scope.row.remark:''}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="operatorName" label="操作人" min-width="150px">
            </el-table-column>
            <el-table-column align="center" prop="operatorDate" label="操作时间" min-width="200px">
              <template slot-scope="scope">
                {{formatTime(scope.row.operatorDate,'YYYY-MM-DD HH:mm')}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.inputType ===1">
                  <el-button type="text" disabled>编辑
                  </el-button>
                  <el-button type="text" disabled>删除
                  </el-button>
                </template>
                <template v-else>
                  <el-button v-uni:[scope.row.id]="'cunjiaguanli_edit'" :key="'cunjiaguanli_edit' + scope.row.id" @click="itemAdd(scope.row)" type="text">编辑
                  </el-button>
                  <el-button v-uni:[scope.row.id]="'cunjiaguanli_delete'" :key="'cunjiaguanli_delete' + scope.row.id" type="textred" @click="itemDelete(scope.row)">删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div slot="footer" class="page-bar">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page_current" :page-sizes="[10,20, 30, 40,50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="page_total">
          </el-pagination>
        </div>
      </layout_list>
    </div>
    <!--添加弹窗-->
    <template>
      <el-dialog :title="form_type_text" :visible.sync="addHolidaysDialogVisible" width="490px" :show-close="false" :close-on-click-modal="false" custom-class="holidaysDialogStyle">

        <el-form :model="save_holidays_form" :rules="rules" ref="save_holidays_form" label-width="100px" label-suffix=":">
          <el-form-item label="类型" prop="holidayType" class="firstFormItem">
            <el-radio-group v-model="save_holidays_form.holidayType">
              <el-radio :label="1">增加存假</el-radio>
              <el-radio :label="2">扣除存假</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="addOrReduceTime">
            <el-form-item prop="holidayDay">
              <div style="line-height: 46px;">{{addOrReduceHolidays}}</div>
              <el-input v-model="save_holidays_form.holidayDay" clearable placeholder="请输入" autocomplete="off" maxlength="3"></el-input>
              <div style="line-height: 46px;">天</div>
            </el-form-item>
            <el-form-item prop="holidayHour">
              <el-input v-model="save_holidays_form.holidayHour" clearable placeholder="请输入" autocomplete="off" maxlength="3"></el-input>
              <div style="line-height: 46px;">小时</div>
            </el-form-item>
          </div>
          <el-form-item label="生效日期" prop="effectiveDate" class="inputW">
            <el-date-picker v-model="save_holidays_form.effectiveDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" :clearable="false" :picker-options="pickerBeginValueOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="remark" class="inputW">
            <el-input type="textarea" :rows="5" v-model="save_holidays_form.remark" maxlength="100" show-word-limit placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'cunjiaguanli_dialog_cancel'" @click="close">取消</el-button>
          <el-button v-uni="'cunjiaguanli_dialog_save'" type="primary" @click="addHoliday">确认</el-button>
        </span>
      </el-dialog>
    </template>
  </layout_aside>
</template>

<script>
import layout_aside from "../../../components/hsms/layout/aside";
import layout_list from "../../../components/hsms/layout/list";
import save_record from "./saveRecord";
import { ApiStorgeHolidays } from "../../../api/hsms";
import moment from "moment";
export default {
  name: "List",
  data() {
    var validateHolidayDay = (rule, value, callback) => {
      if (!value && !this.save_holidays_form.holidayHour) {
        callback(new Error("请输入天/效时！"));
      } else if (parseFloat(value) > 100) {
        callback(new Error("可输入最大数值为100"));
      } else {
        callback();
      }
    };
    var validateHolidayHour = (rule, value, callback) => {
      if (parseFloat(value) > 100) {
        callback(new Error("可输入最大数值为100"));
      } else {
        callback();
      }
    };
    return {
      pickerBeginOptions: {
        disabledDate(time) {
          // 1-1 时间戳
          const year = new Date().getFullYear();
          const now = new Date(year + "-01-01 00:00:00").getTime();
          return time.getTime() < now;
        },
      },
      pickerEndOptions: {
        disabledDate(time) {
          // 1-1 时间戳
          const year = new Date().getFullYear();
          const now = new Date(year + "-01-01 00:00:00").getTime();
          return time.getTime() < now;
        },
      },
      pickerBeginValueOptions: {
        disabledDate(time) {
          const year = new Date().getFullYear(); // 获取当前日期年月日中的年
          const month = new Date().getMonth(); // 获取当前日期年月日中的月
          const now = new Date(year + "-" + month + "-01 00:00:00").getTime();
          return time.getTime() < now;
        },
      },
      loading: false,
      tableData: [],
      account: {},
      form_type_text: "",
      // 添加存假信息
      save_holidays_form: {
        accountId: "",
        accountType: 2,
        holidayType: 1,
        holidayDay: "",
        holidayHour: "",
        holidayValueStr: "0,0",
        effectiveDate: moment().format("YYYY-MM-DD"),
        remark: "",
      },
      save_holidays_form_catch: {
        accountId: "",
        accountType: 2,
        holidayType: 1,
        holidayDay: "",
        holidayHour: "",
        holidayValueStr: "0,0",
        effectiveDate: moment().format("YYYY-MM-DD"),
        remark: "",
      },
      addOrReduceHolidays: "增加存假",
      // 查询表单
      search_form: {
        dateType: 1,
        accountId: "",
        startDate: null,
        endDate: null,
        size: 10,
        page: 1,
      },
      page_current: 1,
      page_total: 1,
      addHolidaysDialogVisible: false,
      rules: {
        holidayDay: [{ validator: validateHolidayDay, trigger: "blur" }],
        holidayHour: [{ validator: validateHolidayHour, trigger: "blur" }],
      },
    };
  },
  watch: {
    "search_form.accountId": {
      handler(val) {
        this.search_form.page = 1;
        val && this.getData();
      },
      immediate: true,
    },
    "save_holidays_form.holidayType": {
      handler(val) {
        this.holidaysTypeChange(val);
      },
      immediate: true,
    },
  },
  created() {
    this.dateTypeChange(1);
  },
  methods: {
    // 日期选择change
    dateTypeChange(val) {
      const curYear = new Date().getFullYear();
      let paramYear;
      switch (val) {
        case 1:
          paramYear = moment().subtract(1, "quarters").format("YYYY");
          // 产品规划:跨年的需要从当前年01-01开始展示查询，不展示上一年的查询日期
          this.search_form.startDate =
            parseInt(paramYear - curYear) < 0
              ? moment().format("YYYY") + "-01-01"
              : moment().subtract(1, "quarters").format("YYYY-MM-DD");
          this.search_form.endDate = moment().format("YYYY-MM-DD"); // 结束时间（当前系统的时间）
          break;
        case 2:
          paramYear = moment().subtract(6, "months").format("YYYY");
          this.search_form.startDate =
            parseInt(paramYear - curYear) < 0
              ? moment().format("YYYY") + "-01-01"
              : moment().subtract(6, "months").format("YYYY-MM-DD"); // 当前时间往前推六个月的时间
          this.search_form.endDate = moment().format("YYYY-MM-DD"); // 结束时间（当前系统的时间）
          break;
        case 3:
          paramYear = moment().subtract(1, "months").format("YYYY");
          this.search_form.startDate =
            parseInt(paramYear - curYear) < 0
              ? moment().format("YYYY") + "-01-01"
              : moment().subtract(1, "months").format("YYYY-MM-DD"); // 当前时间往前推一个月的时间
          this.search_form.endDate = moment().format("YYYY-MM-DD"); // 结束时间（当前系统的时间）
          break;
        default:
          // 结束时间（当前系统的时间）
          paramYear = moment().subtract(1, "quarters").format("YYYY");
          // 产品规划:跨年的需要从当前年01-01开始展示查询，不展示上一年的查询日期
          this.search_form.startDate =
            parseInt(paramYear - curYear) < 0
              ? moment().format("YYYY") + "-01-01"
              : moment().subtract(1, "quarters").format("YYYY-MM-DD");
          this.search_form.endDate = moment().format("YYYY-MM-DD");
          break;
      }
    },
    // 增加、扣除存假选择
    holidaysTypeChange(val) {
      switch (val) {
        case 1:
          this.addOrReduceHolidays = "增加存假";
          break;
        case 2:
          this.addOrReduceHolidays = "扣除存假";
          break;
        default:
          this.addOrReduceHolidays = "增加存假";
          break;
      }
    },
    // 获取左侧传过来的账户信息
    initAccount(account) {
      if (account.accountId) {
        this.account = account;
        this.search_form.accountId = account.accountId;
      } else {
        this.$message.warning("请先选择护士！");
      }
    },
    itemAdd(row = null) {
      // 清空
      this.save_holidays_form = JSON.parse(
        JSON.stringify(this.save_holidays_form_catch)
      );
      this.save_holidays_form.accountId = this.account.accountId;
      this.form_type_text = row && row["id"] ? "编辑" : "添加";
      if (row && row["id"]) {
        this.save_holidays_form.id = row.id;
        this.save_holidays_form.accountId = row.accountId;
        this.save_holidays_form.holidayType = row.holidayType;
        this.save_holidays_form.remark = row.remark;
        this.save_holidays_form.effectiveDate = moment(
          row.effectiveDate
        ).format("YYYY-MM-DD");
        // 将天和小时数值拆分出来
        this.save_holidays_form.holidayDay = row.holidayValueStr
          ? row.holidayValueStr.split("天")[0]
          : "";
        this.save_holidays_form.holidayHour = row.holidayValueStr
          ? row.holidayValueStr.split("天")[1].split("小时")[0]
          : "";
      }
      this.addHolidaysDialogVisible = true;
    },
    addHoliday() {
      this.$refs.save_holidays_form.validate((valid) => {
        if (valid) {
          this.save_holidays_form.effectiveDate =
            this.save_holidays_form.effectiveDate +
            " " +
            moment().format("HH:mm:ss"); // 将时间带上当前时分秒传递给后台
          this.save_holidays_form.holidayValueStr =
            (this.save_holidays_form.holidayDay
              ? this.save_holidays_form.holidayDay
              : 0) +
            "," +
            (this.save_holidays_form.holidayHour
              ? this.save_holidays_form.holidayHour
              : 0);
          ApiStorgeHolidays.save(this.save_holidays_form)
            .then(() => {
              this.$message.success("保存正确！");
              this.addHolidaysDialogVisible = false;
              this.getData(); // 更新右侧列表
              this.$refs["saveRecord"].getData(); // 更新左侧该患者信息
            })
            .catch((res) => {
              this.addHolidaysDialogVisible = false;
              this.$message.error(res.message);
            });
        } else {
          return false;
        }
      });
    },
    getData() {
      ApiStorgeHolidays.selectQueryPage(this.search_form).then((res) => {
        this.tableData = res.data.list || [];
        this.page_total = res.data.total;
      });
    },
    // 删除项目
    itemDelete(row) {
      let _row = JSON.parse(JSON.stringify(row));
      this.$confirm("确认要进行删除吗？", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
        closeOnClickModal: false,
      }).then(() => {
        ApiStorgeHolidays.delete({ id: _row.id })
          .then(() => {
            this.$message.success("删除成功！");
            this.getData();
            this.$refs["saveRecord"].getData(); // 更新左侧该患者信息
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      });
    },
    formatTime(time, type) {
      if (!time) {
        return "";
      }
      return moment(time).format(type);
    },
    handleSizeChange(val) {
      this.search_form.size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page_current = this.search_form.page = val;
      this.getData();
    },
    reset() {
      this.$refs.search_form.resetFields();
      this.handleCurrentChange(1);
    },
    close() {
      this.$refs.save_holidays_form.resetFields();
      this.addHolidaysDialogVisible = false;
    },
  },
  components: {
    save_record,
    layout_aside,
    layout_list,
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/hsms/css/self_common";
.query-items {
  .to {
    display: inline-block;
    line-height: 32px;
    margin: 12px 0;
  }
}
</style>
<style lang="scss" type="text/scss">
.holidaysDialogStyle {
  .firstFormItem {
    margin-bottom: 7px !important;
    .el-form-item__content {
      line-height: 46px;
    }
  }
  .inputW {
    .el-form-item__content {
      width: 300px;
    }
  }
  .addOrReduceTime {
    display: flex;
    padding-left: 124px;
    .el-form-item__content {
      display: flex;
      margin-left: 0 !important;
      .el-input {
        width: 70px;
        margin: 0 8px;
        .el-input__inner {
          padding: 0 10px;
        }
      }
    }
  }
}
</style>
