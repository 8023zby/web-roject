<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item label="科室">
          <TreeSelect placeholder="请选择" v-model="search_form.deptId" :multiple="false" :options="tree_nurse_data" :defaultExpandLevel="9" appendToBody noOptionsText="无可选项" noChildrenText="无子节点" noResultsText="无匹配结果" :clearable="false" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchForm()" v-uni="'qiehuanshezhi_search'">搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table ref="table" :data="switch_data" stripe highlight-current-row @selection-change="handleTableSelectionChange" height="100%">
        <el-table-column prop="devName" label="设备名称" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="devIp" label="设备IP" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="touchMode" label="看板类型" min-width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.touchMode === 1 ? '护理智能看板（触屏版）' : ''}}
            {{scope.row.touchMode === 0 ? '护理智能看板（遥控器版）' : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="templateName" label="模板名称" min-width="100" align="center">
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="handlerSetting(scope.row)" type="text" size="small" v-uni="'qiehuanshezhi_edit'">
              设置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page_current" :page-size="search_form.size" layout="total, sizes, prev, pager, next, jumper" :total="page_total">
      </el-pagination>
    </div>

    <template>
      <el-dialog title="设置" class="setting-dialog" :visible.sync="settingFormVisible" width="630px" :show-close="false">
        <el-form label-width="140px" label-suffix=":" ref="settingForm" :model="settingForm" :rules="settingFormRule">
          <!--<el-form-item label="类型设置">-->
          <!--<el-radio-group v-model="settingForm.touchMode" @change="handlerTouch">-->
          <!--<el-radio :label="1">护理智能看板（触屏版）</el-radio>-->
          <!--<el-radio :label="0">护理智能看板（遥控器版）</el-radio>-->
          <!--</el-radio-group>-->
          <!--</el-form-item>-->
          <el-form-item label="选择模板" prop="templateId">
            <el-select v-model="settingForm.templateId" @change="handlerTemplate" placeholder="请选择" autocomplete="off" style="width: 300px;">
              <el-option v-for="(item, key) in models" :label="item.templateName" :value="item.templateId" :key="key"></el-option>
            </el-select>
          </el-form-item>

          <template v-if="settingForm.touchMode === 1">
            <el-form-item label="切换时间">
              <el-radio v-model="settingForm.isSwitch" :label="0" @change="() => $refs.settingForm.clearValidate()">
                不切换
              </el-radio>
            </el-form-item>
            <el-form-item label="" prop="switchSeconds" key="chuping">
              <el-col :span="5">
                <el-radio v-model="settingForm.isSwitch" :label="1">无操作时</el-radio>
              </el-col>
              <el-col :span="19">
                <el-input style="width: 178px" v-model="settingForm.switchSeconds" placeholder="" autocapitalize="off" maxlength="5" :disabled="!(settingForm.isSwitch === 1)" required></el-input>
                <span style="margin-left: 8px;">秒</span>
              </el-col>
              <div class="info" style="margin-left: 24px">
                <div>
                  触屏版终端，无操作时，根据设置的切换时间返回第一页。
                </div>
              </div>
            </el-form-item>

            <el-form-item label="" prop="shiftDuration" key="chupinsgift">
              <el-col :span="12">
                <el-radio v-model="settingForm.isSwitch" :label="2">自动切换，切换间隔时间:</el-radio>
              </el-col>
              <el-col :span="12">
                <el-input style="width: 130px" v-model="settingForm.shiftDuration" placeholder="" autocapitalize="off" maxlength="5" :disabled="!(settingForm.isSwitch === 2)" required></el-input>
                <span style="margin-left: 8px;">秒</span>
              </el-col>
            </el-form-item>

            <el-form-item label="密码验证" prop="allowPwd">
              <el-switch v-model="settingForm.allowPwd" :active-value="1" :inactive-value="0" @change="openVerifyForm">
              </el-switch>
            </el-form-item>
            <el-form-item label="" prop="pageIds" v-show="settingForm.allowPwd === 1&&settingForm.pages.length!==0">
              <el-checkbox-group v-model="settingForm.pageIds">
                <template v-for="(v,index) in settingForm.pages">
                  <el-checkbox v-if="index===0" :label="v.pageId" :key="v.id" disabled>{{v.menuName}}
                  </el-checkbox>
                  <el-checkbox v-else :label="v.pageId" :key="v.id">{{v.menuName}}
                  </el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="密码验证有效时长" prop="effectiveTimes" v-show="settingForm.allowPwd === 1">
              <el-col style="width: 257px;">
                <el-input v-model="settingForm.effectiveTimes" placeholder="请输入"></el-input>
              </el-col>
              <el-col style="width: 40px;margin-left: 8px;">
                &nbsp;分钟
              </el-col>
              <el-col :span="24" v-show="settingForm.allowPwd === 1">
                <span style="color: #999" v-show="settingForm.effectiveTimes">*密码验证后 {{settingForm.effectiveTimes}} 分钟内不需要再次输入密码验证</span>
                <span style="color: #999" v-show="!settingForm.effectiveTimes">*不填时间默认每次都需要验证</span>
              </el-col>
            </el-form-item>
          </template>

          <template v-if="settingForm.touchMode === 0">
            <el-form-item label="切换时间" prop="switchSeconds" key="yaokongqi">
              <el-input style="width: 272px" v-model="settingForm.switchSeconds" placeholder="" autocapitalize="off" maxlength="5"></el-input>
              <span style="margin-left: 8px;">秒</span>
              <div class="info">
                <div>根据设置的切换时间，进行页面循环切换。</div>
              </div>
            </el-form-item>

            <el-form-item label="床位一览切换时间" prop="bedSwitchSeconds">
              <el-input style="width: 272px" v-model="settingForm.bedSwitchSeconds" placeholder="" autocapitalize="off" maxlength="5" required></el-input>
              <span style="margin-left: 8px;">秒</span>
              <div class="info">
                <div>床位一览页面根据床位一览切换时间进行切换。</div>
              </div>
            </el-form-item>

            <el-form-item label="定时重启">
              <el-col>
                <el-switch v-model="settingForm.ifRestart" @change="changeRadio" :active-value="1" :inactive-value="0">
                </el-switch>
              </el-col>

              <el-col v-if="settingForm.ifRestart === 1">
                <span>每天 </span>
                <el-time-picker v-model="settingForm.restartDuration" :clearable="false" value-format="HH:mm" format="HH:mm" placeholder="请选择时间" style="width: 110px">
                </el-time-picker>
                <span> 重启</span>
              </el-col>
            </el-form-item>
            <el-form-item label="定时息屏时间设置">
              <el-col>
                <el-switch v-model="settingForm.isCloseScreen" :active-value="1" :inactive-value="0">
                </el-switch>
                <span style="color:red;margin-left:10px">建议6小时以上且仅针对已开放系统权限的电视操作系统</span>
              </el-col>

              <el-col v-if="settingForm.isCloseScreen === 1">
                <el-time-picker v-model="settingForm.closeScreenTime.beginTime" :clearable="false" value-format="HH:mm" format="HH:mm" placeholder="请选择时间" style="width: 110px">
                </el-time-picker>
                <span> - </span>
                <el-time-picker v-model="settingForm.closeScreenTime.endTime" :clearable="false" value-format="HH:mm" format="HH:mm" placeholder="请选择时间" style="width: 110px">
                </el-time-picker>
              </el-col>
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel" v-uni="'qiehuanshezhi_cancel'">取消</el-button>
          <el-button type="primary" @click="save" v-uni="'qiehuanshezhi_save'">确认</el-button>
        </div>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import moment from "moment";
import layout from "../../../../components/bnms/layout/list";
import {
  ApiKanbanSwitch,
  ApiKanbanPasswordSetting,
  ApiDept,
} from "../../../../api/bnms/index";
import deptMixins from "@/assets/bnms/js/deptMixins.js";
export default {
  name: "nursing_kanban_switch",
  mixins: [deptMixins],
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 0,
      switch_data: [],
      tree_nurse_data: [],
      // 搜索表单
      search_form: {
        deptId: null,
        size: 10,
        page: 1,
      },
      curRow: {},
      curModel: {},
      models: [], // 模板
      settingFormVisible: false,
      settingForm: {
        touchMode: 1,
        templateId: "",
        templateName: "",
        isSwitch: 0,
        switchSeconds: 60,
        shiftDuration: 300,
        // bedMode: 2,
        bedSwitchSeconds: 30,
        allowPwd: 0,
        pages: [],
        effectiveTimes: "",
        pageIds: [],
        restartDuration: moment().format("23:00"),
        ifRestart: 0,
        isCloseScreen: 0,
        closeScreenTime: {}
      },
      settingFormRule: {
        templateId: [
          { required: true, message: "请选择模板！", trigger: "blur" },
        ],
        switchSeconds: [
          { required: true, message: "请输入切换时间！", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (this.settingForm.isSwitch == 1) {
                if (
                  (this.settingForm.touchMode == 1 ||
                    this.settingForm.touchMode == 0) &&
                  !/^\d*$/.test(value)
                ) {
                  callback(new Error("切换时间必须为60~99999的数字！"));
                } else if (
                  (this.settingForm.touchMode == 1 ||
                    this.settingForm.touchMode == 0) &&
                  value > 99999
                ) {
                  callback(new Error("切换时间必须为60~99999的数字！"));
                } else if (
                  (this.settingForm.touchMode == 1 ||
                    this.settingForm.touchMode == 0) &&
                  value < 60
                ) {
                  callback(new Error("切换时间最小为60秒！"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        shiftDuration: [
          { required: true, message: "请输入切换时间！", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (this.settingForm.isSwitch == 2) {
                if (
                  (this.settingForm.touchMode == 1 ||
                    this.settingForm.touchMode == 0) &&
                  !/^\d*$/.test(value)
                ) {
                  callback(new Error("切换时间必须为60~99999的数字！"));
                } else if (
                  (this.settingForm.touchMode == 1 ||
                    this.settingForm.touchMode == 0) &&
                  value > 99999
                ) {
                  callback(new Error("切换时间必须为60~99999的数字！"));
                } else if (
                  (this.settingForm.touchMode == 1 ||
                    this.settingForm.touchMode == 0) &&
                  value < 60
                ) {
                  callback(new Error("切换时间最小为60秒！"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        bedSwitchSeconds: [
          { required: true, message: "请输入切换时间！", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入切换时间！"));
              } else if (!/^\d*$/.test(value)) {
                callback(new Error("切换时间必须为30~99999的数字！"));
              } else if (value > 99999) {
                callback(new Error("切换时间必须为30~99999的数字！"));
              } else if (value < 30) {
                callback(new Error("切换时间最小为30秒！"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        effectiveTimes: {
          validator: (rule, value, callback) => {
            if (value !== "" && !/^[1-9]\d*$/.test(value)) {
              callback(new Error("只能输入正整数！"));
            } else if (value.length > 5) {
              callback(new Error("最多可输入5位数字！"));
            } else {
              callback();
            }
          },
          trigger: "blur",
        },
      },
      // table多选结果
      multipleSelection: [],
    };
  },
  created () {
    this.getDeptData();
  },
  activated () {
    this.getDeptData();
  },
  methods: {
    changeRadio () {
      this.settingForm.restartDuration = moment().format("23:00");
    },
    getDeptData () {
      ApiDept.select().then((res) => {
        let data = res.data ? res.data.list : [];
        let temp = JSON.stringify(data);
        temp = temp
          .replace(/deptId/g, "id")
          .replace(/deptName/g, "label")
          .replace(/,"children":null/g, "")
          .replace(/,"children":\[\]/g, "");
        this.tree_nurse_data = JSON.parse(temp);
        // const local = localStorage.getItem('selectDeptInfo') || ''
        // this.search_form.deptId = local ? (JSON.parse(local).deptId || '') : ''
        this.search_form.deptId =
          this.getDefaultDeptInfo() || this.tree_nurse_data[0].id;
        this.getData();
      });
    },
    getData () {
      this.loading = true;
      ApiKanbanSwitch.select(this.search_form)
        .then((res) => {
          this.switch_data = res.data.list || [];
          this.page_total = res.data.total || 0;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.message);
        });
    },
    handlerSetting (row) {
      this.initData(row);

      Object.assign(this.settingForm, row);
      // 备份当前模板的切换时间以及是否开启密码信息
      this.curModel.isSwitch = row.isSwitch;
      this.curModel.switchSeconds = row.switchSeconds;
      this.curModel.bedSwitchSeconds = row.bedSwitchSeconds;
      this.curModel.touchMode = row.touchMode;
      this.curModel.templateId = row.templateId;
      this.curModel.templateName = row.templateName;
      this.curModel.allowPwd = row.allowPwd;
      this.curModel.effectiveTimes = row.effectiveTimes;
      this.curModel.pageIds = row.pageIds;
      if (row.restartDuration) {
        this.curModel.restartDuration = row.restartDuration;
      } else {
        this.curModel.restartDuration = moment().format("23:00");
      }

      this.settingFormVisible = true;
    },
    handlerTouch (val) {
      this.settingForm.pageIds = [];
      if (this.curModel.touchMode !== val) {
        this.settingForm.templateId = "";
      } else {
        this.settingForm.templateId = this.curModel.templateId;
      }
      if (this.settingForm.touchMode === 1) {
        this.settingForm.isSwitch = 0;
        this.settingForm.switchSeconds = 600;
        this.settingForm.shiftDuration = 300;
      } else {
        this.settingForm.isSwitch = 1;
        this.settingForm.switchSeconds = 60;
        this.settingForm.bedSwitchSeconds = 30;
      }
      // 获取模板
      this.getModelData();
    },
    handlerTemplate () {
      this.getPagesData();
    },
    // 获取模板
    getModelData () {
      this.loading = true;
      ApiKanbanPasswordSetting.selectModel({
        templateType: this.settingForm.touchMode,
      })
        .then((res) => {
          let modelData = res.data || [];
          this.models = modelData;
          // 需保证系统中存在不可编辑与删除的默认模板在
          this.settingForm.templateId =
            this.settingForm.templateId && this.settingForm.templateId !== ""
              ? this.settingForm.templateId
              : this.models[0].templateId; // 设置下拉模板默认选中项
          this.getPagesData();
        })
        .catch((err) => {
          this.$message.error(err.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取模板关联页面接口
    // 触屏需要查询模板关联页面展示出来
    getPagesData () {
      this.loading = true;
      ApiKanbanPasswordSetting.selectModelDetail(this.settingForm.templateId)
        .then((res) => {
          let passData = res.data || {};
          passData.pageIds = [];
          Object.assign(this.settingForm, passData);
          // 将该设备上一次选择的信息返显
          if (this.settingForm.templateId === this.curModel.templateId) {
            this.settingForm.isSwitch = this.curModel.isSwitch;
            this.settingForm.switchSeconds = this.curModel.switchSeconds;
            this.settingForm.bedSwitchSeconds = this.curModel.bedSwitchSeconds;
            this.settingForm.allowPwd = this.curModel.allowPwd;
            this.settingForm.effectiveTimes = this.curModel.effectiveTimes;
            this.settingForm.pageIds = this.curModel.pageIds;
            if (this.curModel.restartDuration) {
              this.settingForm.restartDuration = this.curModel.restartDuration;
            }
          } else {
            this.resetContent();
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    initData (row) {
      if (row.touchMode == 1) {
        row.isSwitch = row.isSwitch === null ? 0 : row.isSwitch;
        row.switchSeconds = row.switchSeconds === null ? 60 : row.switchSeconds;
        row.shiftDuration =
          row.shiftDuration == null || row.shiftDuration == ""
            ? 300
            : row.shiftDuration;
        this.settingForm.touchMode = 1;
      } else {
        this.settingForm.touchMode = 0;
        row.touchMode = 0; // 和产品确认，当不知道是触屏还是非触屏时，默认非触屏
        row.isSwitch = 1;
        row.switchSeconds = row.switchSeconds === null ? 60 : row.switchSeconds;
        row.bedSwitchSeconds =
          row.bedSwitchSeconds === null ? 30 : row.bedSwitchSeconds;
      }
      row.touchMode = row.touchMode == 0 ? row.touchMode : 1;
      row.templateId = row.templateId || "";
      row.templateName = row.templateName || "";
      row.allowPwd = row.allowPwd === 1 ? row.allowPwd : 0;
      row.effectiveTimes = row.effectiveTimes || "";
      row.pageIds = row.pageIds || [];
      // 给息屏时间设置默认值
      if (!row.closeScreenTime) {
        row.closeScreenTime = { beginTime: "23:00", endTime: "05:00" }
      }
      // 点击设置弹窗 先获取一遍模板信息
      this.getModelData();
    },
    modelIdToName (curModelId = "") {
      for (let i = 0; i < this.models.length; i++) {
        let modelId = this.models[i].templateId;
        if (curModelId === modelId) {
          return this.models[i].templateName ? this.models[i].templateName : "";
        } else {
          continue;
        }
      }
    },
    save () {
      this.$refs.settingForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // 后台需要将模板名称传递
          this.settingForm.templateName = this.modelIdToName(
            this.settingForm.templateId
          );
          ApiKanbanSwitch.save(this.settingForm)
            .then(() => {
              this.getData();
              this.settingFormVisible = false;
              this.loading = false;
            })
            .catch((res) => {
              this.loading = false;
              this.$message.error(res.message);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel () {
      this.resetContent();
      this.settingFormVisible = false;
    },
    searchForm () {
      this.handleCurrentChange(1);
    },
    openVerifyForm (val) {
      if (val === 1) {
        this.settingForm.allowPwd = 1;
      } else {
        this.settingForm.allowPwd = 0;
        this.settingForm.effectiveTimes = "";
        this.settingForm.pageIds = [];
      }
    },
    // 重置字段内容
    resetContent () {
      this.settingForm.allowPwd = 0;
      this.settingForm.effectiveTimes = "";
      this.settingForm.pageIds = [];
      this.getData();
    },
    handleSizeChange (val) {
      this.search_form.size = val;
      this.getData();
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val;
      this.getData();
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val;
    },
  },
  components: {
    layout,
    TreeSelect,
  },
  watch: {
    settingFormVisible (val) {
      if (!val) {
        this.$refs.settingForm.clearValidate();
      }
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";

.setting-dialog {
  /deep/ .el-dialog {
    .el-form-item__label {
      font-weight: bold;
      height: 34px;
      line-height: 34px;
    }

    .el-form-item__content {
      line-height: 34px;
    }

    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
  }

  .info {
    color: #999999;
    .content {
      padding-left: 35px;
    }
  }
}
</style>
