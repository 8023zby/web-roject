<template>
  <layout v-loading="loading">
    <div slot="query" class="query-items">
      <!-- 查询条件 -->
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item label="科室">
          <TreeSelect placeholder="请选择" v-model="search_form.deptId" :multiple="false" :options="tree_nurse_data" :defaultExpandLevel="9" appendToBody noChildrenText="无子节点" :clearable="false" v-uni="'tizhengshezhi_keshi_tree'" />
        </el-form-item>
        <el-form-item label="所属分类" prop="signClassifyId">
          <el-select v-model="search_form.signClassifyId" placeholder="全部" clearable autocomplete="off" v-uni="'tizhengshezhi_suoshufenlei'">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key) in sign_config_classify" :label="item.signClassifyName" :value="item.signClassifyId" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体征项名称" prop="signItemName">
          <el-input clearable v-model="search_form.signItemName" placeholder="请输入" autocomplete="off" v-uni="'tizhengshezhi_tizhengmingcheng'" />
        </el-form-item>
        <el-form-item label="同步体温单数据" prop="syncTemperature">
          <el-select v-model="search_form.syncTemperature" placeholder="全部" clearable autocomplete="off" v-uni="'tizhengshezhi_tongbutiwendanshuju'">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="A10患者端录入" prop="syncA10">
          <el-select v-model="search_form.syncA10" placeholder="全部" clearable autocomplete="off" v-uni="'tizhengshezhi_a10huanzheduanluru'">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同步体征设备数据" prop="syncSignDevice">
          <el-select v-model="search_form.syncSignDevice" placeholder="全部" clearable autocomplete="off" v-uni="'tizhengshezhi_tongbutizhengshebeishuju'">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 18px;">
          <el-button type="primary" icon="el-icon-search" @click="searchForm()" v-uni="'tizhengshezhi_search'">搜索
          </el-button>
          <el-button v-uni="'tizhengshezhi_reset'" type="text" @click="resetForm()" style="margin-left: 0">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="main" class="main-list">
      <el-table :data="item_data" :row-key="getRowKeys" highlight-current-row stripe style="width: 100%" height="100%" ref="table">
        <!-- <el-table-column type="index" label="序号" width="120" align="center">
          <template slot-scope="scope">
            <span>{{(search_form.page - 1) * search_form.size + (scope.$index + 1)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="signClassifyName" label="所属分类" width="100" align="center"></el-table-column>
        <el-table-column prop="signItemName" label="体征项名称" width="120" align="center"></el-table-column>
        <el-table-column prop="signItemShowName" label="显示名称" width="120" align="center"></el-table-column>
        <el-table-column prop="signItemUnit" label="体征项单位" width="100" align="center"></el-table-column>
        <el-table-column prop="relationFormNames" label="关联表单" min-width="180" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="syncTemperature" show-overflow-tooltip width="220" align="center">
          <template slot="header">
            是否从体温单同步数据
            <el-tooltip class="item" effect="dark" placement="bottom" v-uni="'tizhengshezhi_shifoucongtiwendantongbushuju'">
              <div slot="content">只有当该体征项同时在体温单和护理记录单应用才可执行同步数据<br>
                若体征项仅在体温单或护理记录单应用，则无法同步数据</div>
              <img style="margin-bottom: 3px;" src="../../../assets/nrms/images/wenhao.png">
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-switch v-uni="'tizhengshezhi_shifoudakaitiwendantongbu'" v-model="scope.row.syncTemperature" @change="switchChange($event,'syncTemperature',scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="syncA10" label="A10患者端录入" show-overflow-tooltip width="140" align="center">
          <template slot-scope="scope">
            <el-switch v-uni="'tizhengshezhi_a10huanzheduanluru_switch'" v-model="scope.row.syncA10" @change="switchChange($event,'syncA10',scope.row)" v-if="scope.row.defaultInFromSetting && scope.row.defaultInFromSetting.syncA10AndSyncSignDeviceSwitch && scope.row.defaultInFromSetting.syncA10AndSyncSignDeviceSwitch===1">
            </el-switch>
            <el-switch v-uni="'tizhengshezhi_a10huanzheduanluru_switch'" v-model="scope.row.syncA10" v-else disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="syncSignDevice" label="体征设备采集" show-overflow-tooltip width="140" align="center">
          <template slot-scope="scope">
            <el-switch v-uni="'tizhengshezhi_tizhengshebeicaiji_switch'" v-model="scope.row.syncSignDevice" @change="switchChange($event,'syncSignDevice',scope.row)" v-if="scope.row.defaultInFromSetting && scope.row.defaultInFromSetting.syncA10AndSyncSignDeviceSwitch && scope.row.defaultInFromSetting.syncA10AndSyncSignDeviceSwitch===1">
            </el-switch>
            <el-switch v-uni="'tizhengshezhi_tizhengshebeicaiji_switch'" v-model="scope.row.syncSignDevice" v-else disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="体况数据同步表单" width="150" align="center">
          <template slot-scope="scope">
            <el-button v-uni="'tizhengshezhi_tikuangshujutongbubiaodan_shezhi'" @click="itemSetting(scope.row)" type="text" v-if="scope.row.formIdText!==''">设置
            </el-button>
            <el-button v-uni="'tizhengshezhi_tikuangshujutongbubiaodan_shezhi'" @click="itemSetting(scope.row)" type="text" v-else disabled>设置
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="a10ChartShow" label="A10患者端显示趋势图" width="200" align="center">
          <template slot-scope="scope">
            <el-switch v-uni="'tizhengshezhi_a10huanzheduanxianshiqushitu'" v-model="scope.row.a10ChartShow" @change="switchChange($event,'a10ChartShow',scope.row)" v-if="scope.row.signItemFieldName === 'tiwen'||scope.row.signItemFieldName === 'maibo'||scope.row.signItemFieldName === 'huxi'||scope.row.signItemFieldName === 'xueya'||scope.row.signItemFieldName === 'tengtongdengji'||scope.row.signItemFieldName === 'xuetang'">
            </el-switch>
            <el-switch v-uni="'tizhengshezhi_a10huanzheduanxianshiqushitu'" v-model="scope.row.a10ChartShow" disabled v-else>
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page_current" :page-size="search_form.size" layout="total, sizes, prev, pager, next, jumper" :total="page_total" v-uni="'tizhengshezhi_pagination'">
      </el-pagination>
    </div>
    <template>
      <!--体况数据同步表单对话框-->

      <el-dialog title="体况数据同步表单设置" :visible.sync="signBodySetDialog" width="490px" custom-class="bodyDialogCss" :show-close="false">
        <div class="alert_content">
          <div style="margin-bottom: 10px;">请选择体况数据要同步的表单:</div>
          <el-checkbox-group v-model="bodyFormIdArr" v-uni="'tizhengshezhi_xuanzetikuangshujuyaotongbubiaodan'">
            <el-checkbox v-for="(item,index) in relationForm" :label="item.formId" :key="index">{{item.formName}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="signBodySetDialog = false" v-uni="'tizhengshezhi_tikuangshujutongbucancel'">取消</el-button>
          <el-button type="primary" @click="editData" v-uni="'tizhengshezhi_tikuangshujutongbuconfirm'">确认</el-button>
        </span>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import layout from "../../../components/nrms/layout/list";
import { sign as sign_config } from "../../../assets/nrms/common/item_config";
import {
  ApiSignManage,
  ApiSignClassify,
  ApiSignManageEdit,
  ApiDept,
} from "../../../api/nrms/index";

import deptMixins from "@/assets/nrms/js/deptMixins.js";

export default {
  name: "sign_item_list",
  mixins: [deptMixins],
  data() {
    return {
      sign_config,
      loading: false,
      signBodySetDialog: false, // 体况数据同步表单设置dialog
      page_current: 1,
      page_total: 0,
      item_data: [],
      sign_config_classify: [], // 体征项分类
      relationFormName: [], // 关联表单名
      relationForm: [], // 关联表单name+id
      bodyFormIdArr: [], // 体况数据同步表单id
      search_form: {
        deptId: null,
        signClassifyId: "",
        signItemName: "",
        syncTemperature: "",
        syncA10: "",
        syncSignDevice: "",
        a10ChartShow: "",
        size: 10,
        page: 1,
      },
      tree_nurse_data: [],
      // 编辑表单
      edit_form: {
        signId: "",
        signApplyId: "",
        syncTemperature: "",
        syncA10: "",
        syncSignDevice: "",
        a10ChartShow: "",
        bodyFormIdText: "",
      },
    };
  },
  created() {
    this.getDeptData();
    // 获取体征项分类
    this.getSignClassifyData();
  },
  methods: {
    reload() {
      this.$nextTick(function () {
        this.$refs.table.doLayout();
      });
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
          .replace(/,"children":null/g, "");
        this.tree_nurse_data = JSON.parse(temp);
        // this.tree_nurse_data.length > 0 && (this.search_form.deptId = this.tree_nurse_data[0].id)
        if (this.tree_nurse_data.length > 0) {
          this.search_form.deptId =
            this.getDefaultDeptInfo() || this.tree_nurse_data[0].id;
        }
        // 获取数据
        this.getSignManageData();
      });
    },
    getSignManageData() {
      this.loading = true;
      ApiSignManage.select(this.search_form)
        .then((res) => {
          let list = res.data.list || [];
          this.item_data = [];
          for (let i = 0; i < list.length; i++) {
            // 循环最外层
            let nList = list[i];
            this.relationFormName = [];
            let item = {};
            item = { ...nList };
            item["body_form_id_arr"] = nList["bodyFormIdText"]
              ? nList["bodyFormIdText"].split(",")
              : [];
            let nListForm = nList["formIdWithOtherSelectReturnDtoList"] || [];
            for (let j = 0; j < nListForm.length; j++) {
              let formNameItem = nListForm[j]["formName"];
              this.relationFormName.push(formNameItem);
            }
            let nitem = this.relationFormName.join(",");
            if (nitem.endsWith(",")) {
              item["relationFormNames"] = nitem.substring(0, nitem.length - 1);
            } else {
              item["relationFormNames"] = nitem;
            }
            this.item_data.push(item);
          }
          this.page_total = res.data.total;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.message);
        });
    },
    // 获取体征项分类
    getSignClassifyData() {
      ApiSignClassify.select().then((res) => {
        this.sign_config_classify = res.data || [];
      });
    },
    searchForm() {
      this.handleCurrentChange(1);
    },
    resetForm() {
      this.$refs.search_form.resetFields();
      this.handleCurrentChange(1);
    },
    itemSetting(row) {
      this.edit_form.signId = row.signId;
      this.edit_form.signApplyId = row.signApplyId;
      this.edit_form.syncTemperature = row.syncTemperature;
      this.edit_form.syncA10 = row.syncA10;
      this.edit_form.syncSignDevice = row.syncSignDevice;
      this.edit_form.a10ChartShow = row.a10ChartShow;
      this.bodyFormIdArr = row.body_form_id_arr;
      this.relationForm = row.formIdWithOtherSelectReturnDtoList || [];
      this.signBodySetDialog = true;
    },
    editData() {
      this.edit_form.bodyFormIdText = this.bodyFormIdArr.join(",");
      ApiSignManageEdit.save(this.edit_form)
        .then(() => {
          this.$message.success("保存正确！");
          this.signBodySetDialog = false;
          this.getSignManageData();
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    switchChange($event, type, row) {
      let status = $event;
      if (type === "syncTemperature") {
        this.edit_form.syncTemperature = status;
        this.edit_form.signId = row.signId;
        this.edit_form.signApplyId = row.signApplyId;
        this.edit_form.syncA10 = row.syncA10;
        this.edit_form.syncSignDevice = row.syncSignDevice;
        this.edit_form.a10ChartShow = row.a10ChartShow;
        this.bodyFormIdArr = row.body_form_id_arr;
        this.edit_form.bodyFormIdText = this.bodyFormIdArr.join(",");
        ApiSignManageEdit.save(this.edit_form)
          .then(() => {
            this.getSignManageData(); // 是否从体温单同步数据和a10患者录入和体征设备采集需刷新数据重新获取
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      } else if (type === "syncA10") {
        this.edit_form.signId = row.signId;
        this.edit_form.syncTemperature = row.syncTemperature;
        this.edit_form.signApplyId = row.signApplyId;
        this.edit_form.syncA10 = status;
        this.edit_form.syncSignDevice = row.syncSignDevice;
        this.edit_form.a10ChartShow = row.a10ChartShow;
        this.bodyFormIdArr = row.body_form_id_arr;
        this.edit_form.bodyFormIdText = this.bodyFormIdArr.join(",");
        ApiSignManageEdit.save(this.edit_form)
          .then(() => {
            this.getSignManageData(); // 是否从体温单同步数据和a10患者录入和体征设备采集需刷新数据重新获取
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      } else if (type === "syncSignDevice") {
        this.edit_form.syncTemperature = row.syncTemperature;
        this.edit_form.signId = row.signId;
        this.edit_form.signApplyId = row.signApplyId;
        this.edit_form.syncA10 = row.syncA10;
        this.edit_form.syncSignDevice = status;
        this.edit_form.a10ChartShow = row.a10ChartShow;
        this.bodyFormIdArr = row.body_form_id_arr;
        this.edit_form.bodyFormIdText = this.bodyFormIdArr.join(",");
        ApiSignManageEdit.save(this.edit_form)
          .then(() => {
            this.getSignManageData(); // 是否从体温单同步数据和a10患者录入和体征设备采集需刷新数据重新获取
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      } else if (type === "a10ChartShow") {
        this.edit_form.syncTemperature = row.syncTemperature;
        this.edit_form.signId = row.signId;
        this.edit_form.signApplyId = row.signApplyId;
        this.edit_form.syncA10 = row.syncA10;
        this.edit_form.syncSignDevice = row.syncSignDevice;
        this.edit_form.a10ChartShow = status;
        this.bodyFormIdArr = row.body_form_id_arr;
        this.edit_form.bodyFormIdText = this.bodyFormIdArr.join(",");
        ApiSignManageEdit.save(this.edit_form)
          .then(() => {
            // this.getSignManageData()
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      }
    },
    getRowKeys(row) {
      return row.signApplyId;
    },
    handleSizeChange(val) {
      this.search_form.size = val;
      this.getSignManageData();
    },
    handleCurrentChange(val) {
      this.page_current = this.search_form.page = val;
      this.getSignManageData();
    },
  },
  components: {
    layout,
    TreeSelect,
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
/deep/.el-form--inline .el-form-item {
  margin-right: 24px;
}
</style>
<style lang="scss" type="text/scss">
.bodyDialogCss {
  .alert_content {
    width: 50%;
    margin: 0 auto;
    .el-checkbox {
      padding: 10px 0;
      display: block;
    }
  }
  .el-dialog__footer {
    padding: 25px 20px 20px 20px;
  }
}
</style>
