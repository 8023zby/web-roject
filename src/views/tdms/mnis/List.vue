<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="demo-form-inline" :inline="true">
        <!--运维端-->

        <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptAddCls">
          <treeselect v-uni="actFormKey + 'keshi'" placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptData" noChildrenText="无子节点" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-uni="actFormKey + 'zhuangtai'" size="small" placeholder="请选择" v-model="formSearchData.onLineStatus" clearable>
            <el-option v-for="item in queryOnlineList" :label="item.label" :value="item.key" :key="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button v-uni="actKey + 'search'" type="primary" icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
            <el-button v-uni="actKey + 'reset'" type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <div class="action_div">
          <el-button v-uni="actKey + 'updateStatus'" type="primary" size="small" @click="updateDeviceStatus">更新状态</el-button>
          <el-button v-uni="actKey + 'update'" type="primary" size="small" @click="showDeviceUpdate">终端升级</el-button>
          <sort-type @query="queryByOrder" style="float: left" />
        </div>
      </div>
      <!--列表-->
      <el-table :data="tableData" stripe v-loading="loading" height="80%" :highlight-current-row="true" @selection-change="handleSelectionChange">
        <!--<el-table-column label="序号" width="100" type="index" align="center"></el-table-column>-->
        <el-table-column type="selection" width="50" align="center"></el-table-column>

        <el-table-column prop="deviceNum" label="设备号" align="center"></el-table-column>
        <el-table-column prop="deviceName" label="终端名称" align="center"></el-table-column>
        <el-table-column prop="deptName" label="护理单元" align="center" :formatter="formatDept"></el-table-column>
        <el-table-column prop="ip" label="IP地址" align="center"></el-table-column>
        <el-table-column width="150" prop="status" align="center" :formatter="formatStatus">
          <template slot="header">
            <div style="display: flex; justify-content: center; align-items: center;">
              <div style="margin-right: 5px">状态</div>
              <el-tooltip class="item" effect="dark" content="设备更新状态为3分钟一次" placement="bottom">
                <img ref="statusImg" @mouseenter="changeImgEnter" @mouseleave="changeImgLeave" class="img-cls" src="/static/tdms/img/icon_explain_default.png" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column v-if="authorityObj[`mod_${formSearchData.deviceType}`] ||
                               authorityObj[`del_${formSearchData.deviceType}`] ||
                               authorityObj[`detail_${formSearchData.deviceType}`] ||
                               authorityObj[`log_${formSearchData.deviceType}`] ||
                               authorityObj[`control_${formSearchData.deviceType}`]" label="操作" width="420" align="center">
          <template slot-scope="scope">
            <span v-uni="actKey + 'edit-' + scope.row.deviceId" v-if="authorityObj[`mod_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 10px" @click="editInfo(scope.row)">编辑</span>
            <span v-uni="actKey + 'delete-' + scope.row.deviceId" v-if="authorityObj[`del_${formSearchData.deviceType}`]" class="el-text-danger" style="margin: 0 10px" @click="delDo(scope.row)">删除</span>
            <span v-uni="actKey + 'version-' + scope.row.deviceId" v-if="authorityObj[`detail_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 10px" @click="watchVersion(scope.row)">查看版本</span>
            <span v-uni="actKey + 'log-' + scope.row.deviceId" v-if="authorityObj[`log_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 10px" @click="downloadLog(scope.row)">下载日志</span>
            <span v-uni="actKey + 'watch-' + scope.row.deviceId" v-if="authorityObj[`control_{formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 10px" @click="watchTer(scope.row)">终端监控</span>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
      <!--分页-->
      <div class="paginationDiv">
        <!--组件页码显示-->
        <page-info :pageInfo="pageInfo"></page-info>
      </div>
      <!--end-->
    </div>
    <!--end-->
    <!--设备升级-->
    <el-dialog title="下载日志" :visible.sync="logParam.logFormVisible" width="680px" :show-close="false" :close-on-click-modal="false">
      <log-down-load @cancelLogDown="cancelLogDown" @logDown="logDown" :deviceId="deviceId" ref="log_down" v-if="logParam.logFormVisible"></log-down-load>
    </el-dialog>
    <!--end-->
    <!--终端监控-->
    <el-dialog custom-class="zdjk" center title="终端监控" :visible.sync="terminal.visible" width="490px" :show-close="false" :close-on-click-modal="false">
      <el-form label-width="130px">
        <el-form-item label="信息获取时间：">
          <span class="spanColor">{{terminal.dataInfo.localTime}}</span>
        </el-form-item>
        <el-form-item label="网络延迟监测：">
          <span class="spanColor">{{terminal.dataInfo.netTime}}</span>
        </el-form-item>
        <el-form-item label="设备内存：">
          <span class="spanColor">{{terminal.dataInfo.totalMemorySize}}</span>
        </el-form-item>
        <el-form-item label="已使用内存：">
          <span class="spanColor">{{terminal.dataInfo.usedMemorySize}}</span>
        </el-form-item>
        <el-form-item label="终端截图：">
          <img :src="terminal.dataInfo.screenShot" style="width: 200px;height: 100px;">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button type="primary" @click="terminal.visible = false">确 认</el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!--查看版本-->
    <el-dialog center title="查看版本" :visible.sync="branchVis" width="490px" :show-close="false" :close-on-click-modal="false">
      <el-form label-width="130px">
        <el-form-item label="主程序版本：">
          {{branchData.appVersion}}
        </el-form-item>
        <el-form-item label="安卓中台：">
          {{branchData.upbsVersion}}
        </el-form-item>
        <el-form-item label="终端硬件：">
          {{branchData.hardwareVersion}}
        </el-form-item>
        <el-form-item label="操作系统：">
          {{branchData.systemVersion}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button type="primary" @click="branchVis = false">确 认</el-button>
      </div>
    </el-dialog>
    <!--loading-->
    <el-dialog top="15%" center title="提示" :visible.sync="watchLoading" width="400px" :show-close="watchClose" :close-on-click-modal="false">
      <div style="height: 60px; text-align: center">{{msgContent}}</div>
    </el-dialog>
    <!--设备升级-->
    <el-dialog title="终端升级" :visible.sync="deviceParam.deviceFormVisible" :show-close="false" width="780px" :close-on-click-modal="false">
      <device-update :deviceModel="formSearchData.deviceType" @cancelDeviceUpdate="cancelDeviceUpdate" @deviceUpdate="deviceUpdate" :deptId="formSearchData.deptId" :deptData="deptData" :deptList="deptList" ref="device_update" v-if="deviceParam.deviceFormVisible"></device-update>
    </el-dialog>
  </div>
</template>

<script>
import PageInfo from "../../../components/tdms/PageInfo";
import LogDownLoad from "../../../components/tdms/LogDownLoad";
import SortType from "../../../components/tdms/SortType";
import WWebSocket from "../../../assets/tdms/js/websocket.js";
import BaseManage from "../../../assets/tdms/mixins/BaseManage";
import { PatientDictionary } from "../../../assets/tdms/js/Dictionary.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { AxiosApi, AxiosJsonApi } from "../../../api/tdms/http";
import DeviceUpdate from "../../../components/tdms/DeviceUpdateA10";
import { ResultMsg, MsgShow } from "../../../assets/tdms/js/Message";
export default {
  mixins: [BaseManage],
  props: ["params"],
  components: {
    PageInfo,
    LogDownLoad,
    Treeselect,
    SortType,
    DeviceUpdate,
  },
  inject: ["checkMoreAuthority"],
  data() {
    return {
      // 分页需要参数
      pageInfo: {
        currentPage: 1,
        size: 100,
        total: 0,
        pageSizes: [100, 500, 1000],
      },
      multipleSelection: [],
      deptList: [],
      orgLevel: "",
      orgId: "",
      branchVis: false,
      branchData: {
        appVersion: "",
        systemVersion: "",
        upbsVersion: "",
        hardwareVersion: "",
      },
      terminal: {
        visible: false,
        dataInfo: {},
      },
      deviceParam: {
        deviceFormVisible: false,
      },
      logParam: {
        logFormVisible: false,
      },
      formSearchData: {
        deviceType: "",
        onLineStatus: "",
        deptId: null,
      },
      formSearchDataStatic: {
        orderBy: "createTime asc",
      },
      deviceId: "",
      modelName: "",
      queryOnlineList: [
        { key: "1", label: "在线" },
        { key: "0", label: "离线" },
      ],
      gWebSocket: null,
      url: "/tdms/web-td/device/list",
      authorityArr: [],
      watchLoading: false,
      msgContent: "正在收集终端数据，请稍后...",
      watchClose: false,
      deptData: [],
      firstFlag: true,
      actKey: "zhongduanguanli_",
      actFormKey: "zhongduanguanli__",
    };
  },
  created() {
    this.formSearchData.deviceType = this.params.deviceType;
    // 判断登录端
    this.getLandingEndCode();
  },
  activated() {
    let orgInfo = JSON.parse(localStorage.getItem("orgInfo")) || {};
    let orgId = orgInfo.orgId || "";
    this.orgId = orgId;
    this.formSearchData.deviceType = this.params.deviceType;
    this.modelName = PatientDictionary[this.params.deviceType];
    this.authorityArr = [
      "update_" + this.formSearchData.deviceType,
      "mod_" + this.formSearchData.deviceType,
      "del_" + this.formSearchData.deviceType,
      "set_" + this.formSearchData.deviceType,
      "control_" + this.formSearchData.deviceType,
      "log_" + this.formSearchData.deviceType,
      "reload_" + this.formSearchData.deviceType,
      "detail_" + this.formSearchData.deviceType,
    ]; // 终端升级 编辑 删除 终端配置 终端监控 下载日志 终端重启 查看版本
    if (this.firstFlag) {
      this.getDeptListAndSearch("device");
    } else {
      this.onSearchSubmit("page");
    }
    // 延迟加载
    this.$nextTick(() => {
      // 判断是否有动作权限
      this.getListAuthority();
    });
  },
  methods: {
    // 设备升级
    deviceUpdate() {
      let data = this.$refs.device_update.form;
      // data.deptId = data.deptId.join(',')
      let str = "";
      this.multipleSelection.forEach((item) => {
        str += item.deviceId + ",";
      });
      data.deviceId = str.substring(0, str.length - 1);
      data.deviceType = this.formSearchData.deviceType;
      data.orgId = this.orgId;
      AxiosJsonApi("/tdms/web-td/device/promote", data).then((res) => {
        if (res.status === 200) {
          ResultMsg(res, "设备升级请求已经发送", this.cancelDeviceUpdate);
        } else {
          MsgShow("error", res.desc, 3000);
        }
      });
    },
    showDeviceUpdate() {
      if (this.multipleSelection.length < 1) {
        MsgShow("warning", "请选择至少一条终端信息！");
        return false;
      }
      this.deviceParam.deviceFormVisible = true;
    },
    // 更新设备状态
    updateDeviceStatus() {
      AxiosApi("/tdms/web-td/device/updateDeviceStatus", {}, "GET").then(
        (res) => {
          ResultMsg(res, "操作", () => {
            this.onSearchSubmit("page");
          });
        }
      );
    },
    // 切换图片
    changeImgLeave() {
      this.$refs.statusImg.src = "/static/tdms/img/icon_explain_default.png";
    },
    // 查询
    onSearchSubmit(act = "") {
      if (act !== "page") {
        this.pageInfo.currentPage = 1;
      }
      localStorage.setItem("tdms_searchDept", this.formSearchData.deptId);
      this.getData();
    },
    // 刷新页面
    reload() {
      this.pageInfo.currentPage = 1;
      this.formSearchData = this.clearObj(this.formSearchData);
      // 兼容运维端
      if (this.landingEndCode === "OPEX") {
        let deptId = localStorage.getItem("selectDeptId");
        if (deptId === "null") {
          deptId = "";
        }
        this.formSearchData.deptId = deptId;
      } else {
        this.formSearchData.deptId = null;
      }
      this.getData();
    },
    // 切换图片
    changeImgEnter() {
      this.$refs.statusImg.src = "/static/tdms/img/icon_explain_slip.png";
    },
    formatDept(row) {
      return row.deptName === null ? "" : row.deptName;
    },
    // 状态
    formatStatus(row) {
      if (row.status === null) {
        return "";
      } else {
        let obj = JSON.parse(row.status);
        let status = obj.onLineStatus;
        if (status === "0" || status === 0) {
          return "离线";
        }
        if (status === "1" || status === 1) {
          return "在线";
        }
      }
    },
    cancelDeviceUpdate() {
      this.deviceParam.deviceFormVisible = false;
    },
    // 日志下载
    logDown() {
      let data = this.$refs.log_down.form;
      data.deviceType = this.formSearchData.deviceType;
      let type = location.protocol;
      let _linkUrl = `ws://${window.location.host}/tdmsWs/web-td/websocket`;
      if (type === "https:") {
        _linkUrl = `wss://${window.location.host}/wss/web-td/websocket`;
      }
      // let _linkUrl = `ws://192.168.18.114:8182/web-td/logWebsocket/${data.startTime}/${data.endTime}/${data.logType}/${data.deviceId}`
      let para = {
        linkUrl: _linkUrl,
        deviceId: this.deviceId,
        startTime: data.startTime,
        endTime: data.endTime,
        logType: data.logType,
        reqType: 2,
        orgId: this.orgId,
        deviceType: this.params.deviceType,
      };
      WWebSocket.conn(para, this.gWebSocket, this);
    },
    cancelLogDown() {
      this.logParam.logFormVisible = false;
    },
    // 删除
    delDo(row) {
      this.del(`/tdms/web-td/device/${row.deviceId}`);
    },
    // 修改
    editInfo(rowData) {
      this.$emit(
        "option-changed",
        "add",
        { deviceType: this.formSearchData.deviceType },
        rowData
      );
    },
    // 查看版本
    watchVersion(rowData) {
      this.branchData = {
        appVersion: "",
        systemVersion: "",
        upbsVersion: "",
        hardwareVersion: "",
      };
      if (typeof rowData.versions === "string") {
        rowData.versions = JSON.parse(rowData.versions);
      } else if (rowData.versions === null) {
        rowData.versions = {};
      }
      // 软件版本
      let _appVersion =
        rowData.versions.appVersion === undefined
          ? "无"
          : rowData.versions.appVersion;
      // 系统版本
      let _systemVersion =
        rowData.versions.systemVersion === undefined
          ? "无"
          : rowData.versions.systemVersion;
      // 软件版本
      let upbsVersion =
        rowData.versions.upbsVersion === undefined
          ? "无"
          : rowData.versions.upbsVersion;
      // 系统版本
      let hardwareVersion =
        rowData.versions.hardwareVersion === undefined
          ? "无"
          : rowData.versions.hardwareVersion;

      this.branchData = {
        appVersion: _appVersion,
        systemVersion: _systemVersion,
        upbsVersion: upbsVersion,
        hardwareVersion: hardwareVersion,
      };
      this.branchVis = true;
    },
    // 下载日志
    downloadLog(rowData) {
      this.logParam.logFormVisible = true;
      this.deviceId = rowData.deviceId;
    },
    // 终端监控
    watchTer(rowData) {
      this.watchLoading = true;
      this.watchClose = false;
      this.msgContent = "正在收集终端数据，请稍后...";
      let _linkUrl = `ws://${window.location.host}/tdmsWs/web-td/websocket`;
      let type = location.protocol;
      if (type === "https:") {
        _linkUrl = `wss://${window.location.host}/wss/web-td/websocket`;
      }
      let para = {
        linkUrl: _linkUrl,
        deviceId: rowData.deviceId,
        reqType: 1,
        orgId: this.orgId,
        deviceType: this.params.deviceType,
      };
      WWebSocket.conn(para, this.gWebSocket, this);
      setTimeout(() => {
        if (this.watchLoading) {
          this.watchClose = true;
          let status = rowData.status;
          if (status === null) {
            status = 0;
          } else {
            let obj = JSON.parse(status);
            status = obj.onLineStatus;
          }
          if (status === "0" || status === 0) {
            this.msgContent = "终端已经离线，无法收集终端数据，请检查设备状态";
          } else {
            this.msgContent = "终端监控失败，请重新尝试";
          }
        }
      }, 20 * 1000);
    },
  },
};
</script>

<style lang="scss">
.zdjk {
  .el-dialog__body {
    height: 300px;
    overflow: auto;
  }
}
</style>
