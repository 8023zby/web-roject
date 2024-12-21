<template>
  <div class="typt-list-container">
    <el-form :inline="true" :model="queryForm" ref="queryForm">
      <el-form-item label="科室">
        <treeSelect style="width: 200px" :clearable=isClear :options="deptsList" :multiple="false" :normalizer="normalizer" :default-expand-level="2" placeholder="请选择科室" v-model="checkDepts" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryConfig" icon="el-icon-search">搜索</el-button>
        <el-button type="text" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <el-tabs @tab-click="menuChange()" class="myTabs" v-model="activeName" :tab-position="tabPosition">
      <template v-for="menu in callRNMenu">
        <el-tab-pane :label="menu.value" :name="menu.key" :key="menu.key">
        </el-tab-pane>
      </template>
    </el-tabs>
    <div class="menu-content" id="box">
      <el-form>
        <template v-for="item in callRNMenu">
          <div class="item-title" :id="item.key">{{item.value}}</div>
          <div class="form-content">
            <template v-for="field in item.config">
              <template v-if="field.type==='switch'">
                <el-form-item :label="`${field.label}：`" label-width="120px" :style="`display:${field.display}`">
                  <el-switch v-model="field.val" active-value="1" inactive-value="0" :name="field.fieldName"></el-switch>
                </el-form-item>
              </template>
              <template v-else-if="field.type==='radio'">
                <el-form-item :label="`${field.label}：`" label-width="120px" :style="`display:${field.display}`">
                  <el-radio-group v-model="field.val">
                    <template v-for="fItem in field.items">
                      <el-radio :label="fItem.key">{{fItem.value}}</el-radio>
                    </template>
                  </el-radio-group>
                </el-form-item>
              </template>
              <template v-else-if="field.type==='select'">
                <el-form-item :label="`${field.label}：`" label-width="120px" :style="`display:${field.display}`">
                  <el-select v-model="field.val">
                    <template v-for="fItem in field.items">
                      <el-option :label="fItem.key" :value="fItem.value" :key="fItem.value">{{fItem.value}}</el-option>
                    </template>
                  </el-select>
                </el-form-item>
              </template>
            </template>
          </div>
        </template>
        <div class="save-bottom">
          <el-form-item style="text-align: center;">
            <el-button type="primary" @click="saveInfo(0)">本科室保存</el-button>
            <el-button type="primary" @click="saveDeptsDialogVisible=true">科室批量保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog title="科室批量保存" :visible.sync="saveDeptsDialogVisible" width="40%">
      <span>
        <el-tree v-model="checkDepts" :data="deptsList" show-checkbox default-expand-all node-key="id" ref="deptTree" highlight-current :props="defaultProps">
        </el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveDeptsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveInfo(1)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import treeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { selectDeptInfo, getDeptInfo } from "@/assets/wnms/utils/common";
import BaseQueryPageForm from "../common/BaseQueryPageForm";
import {
  AddRNConfigInfo,
  QueryRNConfig,
} from "@/api/wnms/callReportNumber/callRNField.js";
import { getDeptsList } from "@/api/wnms/msgManage/patientMsg";
import deptMixins from "@/assets/wnms/js/deptMixins.js";

export default {
  name: "callRNConfig",
  mixins: [BaseQueryPageForm, deptMixins],
  components: { treeSelect },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "deptName",
      },
      saveDeptsDialogVisible: false,
      isClear: false,
      queryForm: {},
      deptsList: [],
      checkDepts: [],
      testV: true,
      activeName: "bedDevice",
      tabPosition: "top",
      gDeptId: "",
      gOrgId: "",
      callRNMenu: [
        {
          value: "床头/床旁呼叫",
          key: "bdbhCall",
          mainValue: "床头/床旁",
        },
        {
          value: "床头/床旁增援",
          key: "bdbhReinforce",
          mainValue: "床头/床旁",
        },
        {
          value: "床头/床旁换药",
          key: "bdbhChangeMdt",
          mainValue: "床头/床旁",
        },
        {
          key: "wc",
          value: "卫生间呼叫",
        },
        {
          key: "door",
          value: "门口呼叫",
        },
        {
          key: "dutyRoom",
          value: "值班室呼叫",
        },
        {
          key: "inpatient",
          value: "病区门禁呼叫",
        },
        {
          key: "host",
          value: "主机呼叫",
        },
        {
          key: "visit",
          value: "探视呼叫",
        },
        {
          key: "mobileDevice",
          value: "移动通讯终端呼叫",
        },
        {
          key: "infusionDevice",
          value: "输液夹断器呼叫",
        },
      ],
    };
  },
  created() {
    // this.gDeptId = this.getDefaultDeptInfo();
    this.gOrgId = getDeptInfo().orgId;
    this.initFormFields();
  },
  mounted() {
    this.initDepts();
  },
  methods: {
    saveInfo(f) {
      let nurseUnitIdList = [];
      if (f == 1) {
        let res = this.$refs.deptTree.getCheckedNodes();
        console.log(res);
        let deptIds = [];
        res.forEach((item) => {
          deptIds.push(item.deptId);
        });
        if (deptIds.length == 0) {
          this.$message("请选择至少一个科室");
          return;
        }
        nurseUnitIdList = deptIds;
      } else {
        nurseUnitIdList.push(this.checkDepts);
      }
      AddRNConfigInfo({
        config: JSON.stringify(this.callRNMenu),
        nurseUnitIdList: nurseUnitIdList,
      })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.$message({
              message: "保存成功！",
              type: "success",
            });
          } else {
            this.$message("保存失败:" + res.desc);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initDepts() {
      getDeptsList()
        .then((res) => {
          if (res.status == 200) {
            this.$nextTick(() => {
              this.deptsList = res.data.list;
              this.checkDepts =
                this.getDefaultDeptInfo() || this.deptsList[0].deptId;
              this.queryConfig();
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    initFormFields() {
      this.callRNMenu.forEach((item) => {
        let key = item.key;
        let obj = [
          {
            label: "播报叮咚",
            fieldName: "dingDongVoice",
            type: "switch",
            val: "0",
            display: this.isDisplay("dingDongVoice", item.key),
          },
          {
            label: "播报房间号",
            fieldName: "roomNumberVoice",
            type: "switch",
            val: "0",
            display: this.isDisplay("roomNumberVoice", item.key),
          },
          {
            label: "房间号后缀",
            fieldName: "roomNumberFix",
            type: "radio",
            val: "0",
            display: this.isDisplay("roomNumberFix", item.key),
            items: [
              {
                key: "0",
                value: "房间",
              },
              {
                key: "1",
                value: "室",
              },
            ],
          },
          {
            label: "播报护理级别",
            fieldName: "nurseLevVoice",
            type: "switch",
            val: "0",
            display: this.isDisplay("nurseLevVoice", item.key),
          },
          {
            label: "播报类型",
            fieldName: "broadcastType",
            type: "radio",
            val: "1",
            display: this.isDisplay("broadcastType", item.key),
            items: [
              {
                key: "0",
                value: "数字串",
              },
              {
                key: "1",
                value: "智能播报",
              },
            ],
          },
          {
            label: "播报次数",
            fieldName: "broadcaseCount",
            type: "select",
            val: "5",
            display: this.isDisplay("broadcaseCount", item.key),
            items: this.initCallReportCount(),
          },
        ];
        item.config = obj;
        this.$set(this.callRNMenu, item.config, obj);
      });
      console.log(this.callRNMenu);
    },
    menuChange() {
      console.log(this.activeName);
      let dom = document.getElementById(this.activeName);
      let box = document.getElementById("box");
      let domTopHeight = dom.offsetTop;
      console.log(domTopHeight);
      box.scrollTop = domTopHeight - 249;
    },

    isDisplay(field, type) {
      let isDisplay = "block";
      switch (type) {
        case "bdbhCall":
        case "bdbhReinforce":
        case "bdbhChangeMdt":
          if (field == "roomNumberVoice") isDisplay = "none";
          else if (field == "roomNumberFix") isDisplay = "none";
          else if (field == "nurseLevVoice") isDisplay = "none";
          break;
        case "wc":
          if (field == "broadcaseCount") isDisplay = "none";
          else if (field == "roomNumberVoice") isDisplay = "none";
          else if (field == "roomNumberFix") isDisplay = "none";
          else if (field == "nurseLevVoice") isDisplay = "none";
          break;

        case "door":
          if (field == "roomNumberVoice") isDisplay = "none";
          else if (field == "nurseLevVoice") isDisplay = "none";
          else if (field == "roomNumberVoice") isDisplay = "none";
          else if (field == "roomNumberFix") isDisplay = "none";
          else if (field == "nurseLevVoice") isDisplay = "none";
          break;
        case "dutyRoom":
        case "inpatient":
        case "host":
        case "visit":
        case "mobileDevice":
        case "infusionDevice":
          if (field == "roomNumberVoice") isDisplay = "none";
          else if (field == "nurseLevVoice") isDisplay = "none";
          else if (field == "roomNumberFix") isDisplay = "none";
          break;
      }
      return isDisplay;
    },
    queryConfig() {
      QueryRNConfig(this.checkDepts.toString())
        .then((res) => {
          if (res.status == 200) {
            if (res.data) {
              let dataConfig = res.data.config;
              this.callRNMenu = JSON.parse(dataConfig);
              this.$message({
                message: "查询成功！",
                type: "success",
              });
            } else {
              this.initFormFields();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetForm() {
      this.checkDepts = this.gDeptId;
      this.queryConfig();
    },
    normalizer(node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined,
      };
    },
    initCallReportCount() {
      let rnCount = [];
      for (let i = 1; i <= 20; i++) {
        rnCount.push({
          key: i,
          value: i,
        });
      }
      return rnCount;
    },
  },
};
</script>

<style scoped>
.myTabs {
  width: 95%;
  margin: 0 auto;
  margin-top: 5px;
}

/deep/ .el-tabs__nav-scroll {
  background: #f7f7f7;
}

/deep/ .el-tabs__nav-wrap::after {
  position: relative;
}

/deep/ .el-tabs__item.is-active {
  color: #333333;
  font-weight: bold;
}

/deep/ .form-content {
  width: 95%;
  border: 1px solid #ebeef5;
}

.item-title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
  line-height: 21px;
  width: 95%;
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 5px;
}

.menu-content {
  overflow: hidden;
  overflow: scroll;
}

.save-bottom {
  position: sticky;
  bottom: -20px;
  padding: 20px 0;
  z-index: 20;
}
</style>
