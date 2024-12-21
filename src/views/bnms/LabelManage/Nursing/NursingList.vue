<template>
  <layout-aside>
    <div slot="aside">
      <class-tree @changed="setClassId" @refresh="getClassify"></class-tree>
    </div>
    <layout slot="main" v-loading="loading">
      <!-- 搜索条件 -->
      <div slot="query" class="query-items">
        <el-form :inline="true" v-uni="'hulibiaoqiansousuobiaodan'" :model="search_form" ref="search_form" label-suffix=":">
          <el-form-item label="已应用科室" prop="deptId">
            <TreeSelect placeholder="请选择" v-model="search_form.deptId" :multiple="false" :options="tree_nurse_data" :defaultExpandLevel="9" appendToBody noOptionsText="无可选项" noChildrenText="无子节点" noResultsText="无匹配结果" />
          </el-form-item>
          <!--<el-form-item prop="classId" label="标签分类">-->
          <!--<el-select v-model="search_form.classId" filterable clearable placeholder="请选择">-->
          <!--<el-option-->
          <!--v-for="(name, id) in classify_data"-->
          <!--:key="id"-->
          <!--:label="name"-->
          <!--:value="id">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item prop="labelName" label="标签名称">
            <el-input v-model="search_form.labelName" placeholder="请输入" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchForm()" v-uni="'hulibiaoqian_search'">搜索
            </el-button>
            <el-button type="text" @click="resetForm()" v-uni="'hulibiaoqian_reset'">重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 操作按钮 -->
      <div slot="left_btn" class="tool-bar">
        <el-button type="warning" v-uni="'hulibiaoqian_add'" icon="el-icon-plus" @click="labelAdd(null)" v-checkAuth="'addLabel'">添加
        </el-button>
      </div>
      <div slot="right_btn" class="tool-bar">
        <el-button v-uni="'hulibiaoqian_xianshibiaoshi'" type="primary" @click="$emit('changed', 'list2')" v-checkAuth="'identify'">显示标识
        </el-button>
        <el-button v-uni="'hulibiaoqian_someUse'" type="primary" @click="labelMultiUse(null)" v-checkAuth="'multiUsedLabel'">批量应用
        </el-button>
      </div>

      <!-- 表格 -->
      <div slot="main" class="main-list">
        <el-table v-uni="'hulibiaoqianliebiao'" ref="table" :data="label_data" :row-key="getRowKeys" stripe highlight-current-row @selection-change="handleTableSelectionChange" height="100%">
          <el-table-column type="selection" align="center" reserve-selection width="70"></el-table-column>
          <!-- <el-table-column type="index" align="center" label="序号" width="90">
            <template scope="scope">
              <span>{{(search_form.page - 1) * search_form.size + (scope.$index + 1)}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="className" label="标签分类" min-width="100" align="center">
          </el-table-column>
          <el-table-column prop="labelName" label="标签名称" align="center" min-width="80">
          </el-table-column>
          <el-table-column prop="inputType" label="手工输入" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.inputType == 1 ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column prop="identifyId" label="显示标识" min-width="100" align="center">
            <template slot-scope="scope">
              {{identify_data[scope.row.identifyId] ? identify_data[scope.row.identifyId]['identifyName'] : ''}}
              <!--<span v-if="identify_data[scope.row.identifyId]">-->
              <!--&lt;!&ndash; 床位一览 &ndash;&gt;-->
              <!--<span v-if="scope.row.bedListIdentifyType==2" :style="{color:scope.row.bedListIdentifyInfo[1]}">-->
              <!--{{scope.row.bedListIdentifyInfo[0]}}-->
              <!--</span>-->
              <!--<span v-if="scope.row.bedListIdentifyType==3">-->
              <!--<ShapeSvg :shape="scope.row.bedListIdentifyInfo[0]" :color="scope.row.bedListIdentifyInfo[1]"/>-->
              <!--</span>-->
              <!--<span v-if="scope.row.bedListIdentifyType==4" :style="{color:scope.row.bedListIdentifyInfo[1]}">-->
              <!--<img :src="scope.row.bedListIdentifyInfo[0]"/>-->
              <!--</span>-->
              <!--&lt;!&ndash; 床头卡 &ndash;&gt;-->
              <!--<span v-if="scope.row.bedCardIdentifyType==2" :style="{color:scope.row.bedCardIdentifyInfo[1]}">-->
              <!--{{scope.row.bedCardIdentifyInfo[0]}}-->
              <!--</span>-->
              <!--<span v-if="scope.row.bedCardIdentifyType==3">-->
              <!--<ShapeSvg :shape="scope.row.bedCardIdentifyInfo[0]" :color="scope.row.bedCardIdentifyInfo[1]"/>-->
              <!--</span>-->
              <!--<span v-if="scope.row.bedCardIdentifyType==4" :style="{color:scope.row.bedCardIdentifyInfo[1]}">-->
              <!--<img :src="scope.row.bedCardIdentifyInfo[0]"/>-->
              <!--</span>-->
              <!--</span>-->
            </template>
          </el-table-column>
          <el-table-column label="关联患者字段" min-width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.dataSources === 1">
                {{patient_data[scope.row.relationField] ? patient_data[scope.row.relationField]['labelName'] : ''}}
                {{scope.row.relationField ? scope.row.relationValue : ''}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="风险评估级别" min-width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.dataSources === 2">
                {{assess_data[scope.row.relationField] ? assess_data[scope.row.relationField] : ''}}
                {{scope.row.relationField ? scope.row.relationValue : ''}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="labelSql" label="字段/脚本" min-width="100" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.dataSources === 3 || scope.row.dataSources === 4">
                {{scope.row.labelSql}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center" v-if="checkAuth('userdLabel,editLabel,deleteLabel')">
            <template slot-scope="scope">
              <el-button @click="labelUse(scope.row)" v-uni:[scope.row.labelId]="'hulibiaoqian_using'" :key="'using' + scope.row.labelId" type="text" size="small" v-checkAuth="'userdLabel'">应用
              </el-button>
              <el-button @click="labelAdd(scope.row)" v-uni:[scope.row.labelId]="'hulibiaoqian_edit'" :key="'edit' + scope.row.labelId" type="text" size="small" v-checkAuth="'editLabel'">编辑
              </el-button>
              <el-button type="textred" size="small" :disabled="scope.row.isInitialize === 1 ? true : false" @click="labelDelete(scope.row)" v-checkAuth="'deleteLabel'" v-uni:[scope.row.labelId]="'hulibiaoqian_delete'" :key="'delete' + scope.row.labelId">删除
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
      <!-- other -->
      <template slot>
        <!-- 标签应用到科室 -->
        <Label2Nurse ref="label2nurse" :visible.sync="label2nurse_visible" :init_checked="label2nurse_data" :nurse_data="nurse_data" :label_ids="current_labelcode"></Label2Nurse>

        <el-dialog title="删除" :visible="delete_visible" :close-on-click-modal="false" :show-close="false" width="500px">
          <div style="text-align: center">
            <div style="display: inline-block; text-align: left">
              <div>该标签已应用在以下科室，无法进行删除:</div>
              <div style="margin: 10px 0">
                <div v-for="name in delete_used_depts" :key="name">{{name}}</div>
              </div>
              <div>请先取消标签在科室应用，再进删除操作！</div>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" v-uni="'hulibiaoqianyingyong_cancel'" @click="delete_visible = false">关闭</el-button>
          </div>
        </el-dialog>
      </template>
    </layout>
  </layout-aside>
</template>

<script>
import moduleMixin from "../../../../assets/bnms/mixins/moduleMixin";
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Label2Nurse from "../Label2Nurse";
import classTree from "./ClassTree";
import layoutAside from "../../../../components/bnms/layout/aside";
import layout from "../../../../components/bnms/layout/list";
import {
  ApiNursingManage,
  ApiDept,
  ApiClassifyManage,
  ApiNursingIdentifyManage,
  ApiPatientManage,
} from "../../../../api/bnms";
const sleep = (time) => {
  const t1 = new Date().getTime();
  while (true) {
    const t2 = new Date().getTime();
    if (t2 - t1 >= time) {
      break;
    }
  }
};

export default {
  name: "nursing_list",
  mixins: [moduleMixin],
  data() {
    return {
      loading: false,
      page_current: 1,
      page_total: 0,
      label_data: [],
      delete_visible: false,
      delete_used_depts: [],
      curDeleteRow: {},
      // 标签应用
      label2nurse_visible: false,
      label2nurse_data: [],
      current_labelcode: [],
      nurse_data: [],
      tree_nurse_data: [],
      // 搜索表单
      search_form: {
        labelType: "201",
        deptId: null,
        labelName: "",
        classId: "",
        size: 10,
        page: 1,
      },
      // table多选结果
      multipleSelection: [],
      classify_data: {},
      identify_data: {},
      patient_data: {},
      assess_data: {
        1: "未知评估-api",
      },
    };
  },
  created() {
    this.loading = true;
  },
  activated() {
    this.getClassify();
    this.getDeptData();
  },
  methods: {
    getClassify() {
      Promise.all([
        ApiClassifyManage.select({ labelType: 201 }),
        ApiNursingIdentifyManage.selectAll(),
        ApiPatientManage.select({ labelType: 301 }),
        this.ApiLabelData(),
      ])
        .then((res) => {
          // 标识分类
          const classify = res[0].data || [];
          let cObj = {};
          for (let i = 0; i < classify.length; i++) {
            cObj[classify[i].classId] = classify[i].className;
          }
          this.classify_data = cObj;

          // 处理显示标识
          const identify = res[1].data || [];
          let iObj = {};
          for (let i = 0; i < identify.length; i++) {
            if (identify[i].bedListIdentifyInfo) {
              identify[i].bedListIdentifyInfo =
                identify[i].bedListIdentifyInfo.split("|");
            }
            if (identify[i].bedCardIdentifyInfo) {
              identify[i].bedCardIdentifyInfo =
                identify[i].bedCardIdentifyInfo.split("|");
            }
            if (identify[i].padPatientIdentifyInfo) {
              identify[i].padPatientIdentifyInfo =
                identify[i].padPatientIdentifyInfo.split("|");
            }
            iObj[identify[i]["identifyId"]] = identify[i];
          }
          this.identify_data = iObj;

          // 处理患者标签
          const patient = res[2].data || [];
          let pObj = {};
          for (let i = 0; i < patient.length; i++) {
            patient[i]["labelShowInfo"] = patient[i]["labelShowInfo"]
              ? JSON.parse(patient[i]["labelShowInfo"])
              : {};
            pObj[patient[i]["labelSql"]] = patient[i];
          }
          this.patient_data = pObj;

          this.parseLabelData(res[3]);
        })
        .catch((err) => {
          this.$message.error(err.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setClassId(classId) {
      this.search_form.classId = classId || "";
      this.getLabelData();
    },
    ApiLabelData() {
      return ApiNursingManage.select(this.search_form);
    },
    getLabelData() {
      this.loading = true;
      this.ApiLabelData()
        .then((res) => {
          this.parseLabelData(res);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    parseLabelData(res) {
      res.data = res.data || { list: [], total: 0 };

      let _data = res.data.list || [];
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].classId) {
          let classIds = _data[i].classId.split(",");
          let classNames = [];
          for (let z = 0; z < classIds.length; z++) {
            if (this.classify_data[classIds[z]])
              classNames.push(this.classify_data[classIds[z]]);
          }
          _data[i].className = classNames.join(",");
        }
      }

      this.label_data = _data;
      this.page_total = res.data.total || 0;
    },
    getDeptData() {
      this.nurse_data = [];
      ApiDept.select().then((res) => {
        this.nurse_data = res.data.list;
        let dept = res.data.list;
        this.nurse_data = dept; // this.getNurseDataDept(dept);
        let temp = JSON.stringify(res.data.list);
        temp = temp
          .replace(/deptId/g, "id")
          .replace(/deptName/g, "label")
          .replace(/,"children":null/g, "")
          .replace(/,"children":\[\]/g, "");
        this.tree_nurse_data = JSON.parse(temp);
      });
    },
    // 获取所有科室的deptId
    getNurseDataDept(data) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        let _d = data[i];
        arr.push({
          deptId: _d["deptId"],
          deptName: _d["deptName"],
        });
        if (data[i].children) {
          let a = this.getNurseDataDept(data[i].children);
          arr.push(...a);
        }
      }
      return arr;
    },
    searchForm() {
      this.handleCurrentChange(1);
    },
    resetForm() {
      this.$refs.search_form.resetFields();
      this.handleCurrentChange(1);
    },
    labelMultiUse() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请先选择标签！");
        return false;
      }
      this.$confirm("批量应用需要更多的时间！需要您耐心等待~", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      }).then(() => {
        this.label2nurse_data = [];
        this.current_labelcode = [];
        this.multipleSelection.forEach((v) => {
          this.current_labelcode.push(v.labelId);
        });
        this.label2nurse_visible = true;
      });
    },
    labelUse(row) {
      ApiNursingManage.selectApplyDept({ labelId: row.labelId }).then((res) => {
        this.label2nurse_data = res.data;
        this.current_labelcode = [row.labelId];
        this.label2nurse_visible = true;
      });
    },
    labelAdd(row) {
      this.$emit("changed", "add1", row);
    },
    labelDelete(row) {
      this.curDeleteRow = row;
      this.labelDeleteBefore();
    },
    labelDeleteDo() {
      this.$confirm("确认要删除该数据？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      }).then(() => {
        ApiNursingManage.delete({ labelId: this.curDeleteRow.labelId })
          .then(() => {
            this.$message.success("删除成功！");
            this.getLabelData();
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      });
    },
    labelDeleteBefore() {
      ApiNursingManage.deleteBefore({ labelId: this.curDeleteRow.labelId })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            this.delete_visible = true;
            this.delete_used_depts = res.data;
          } else {
            this.labelDeleteDo();
          }
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    getRowKeys(row) {
      return row.labelId;
    },
    handleSizeChange(val) {
      this.search_form.size = val;
      this.getLabelData();
    },
    handleCurrentChange(val) {
      this.page_current = this.search_form.page = val;
      this.getLabelData();
    },
    handleTableSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  components: {
    Label2Nurse,
    TreeSelect,
    layout,
    "layout-aside": layoutAside,
    "class-tree": classTree,
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";
</style>
