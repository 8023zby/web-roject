<template>
  <div class="typt-list-main">
    <div class="typt-list-container tdms-container">
      <!--查询-->
      <el-form class="demo-form-inline" :inline="true">
        <!--运维端-start-->
        <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptAddCls">
          <treeselect placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptData" noChildrenText="无子节点" />
        </el-form-item>
        <!--运维端-end-->
        <!-- LED  LCD 走廊显示屏 隐藏状态 -->
        <el-form-item label="状态：" v-if="formSearchData.deviceType !== 'wnCorridorLatticeScreen' && formSearchData.deviceType !== 'wnCorridorScreen'">
          <el-select style="width: 182px" size="small" placeholder="请选择" v-model="formSearchData.onLineStatus" clearable>
            <el-option v-for="item in queryOnlineList" :label="item.label" :value="item.key" :key="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端型号：" v-if="deviceModelList && deviceModelList.length">
          <el-select style="width: 182px" size="small" placeholder="请选择" v-model="formSearchData.deviceModel" clearable>
            <el-option v-for="item in deviceModelList" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="最后升级状态：">
          <el-select size="small" placeholder="请选择" v-model="formSearchData.lastUpStatus" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="最后升级时间：" class="tdms-time-search">
          <el-date-picker @change="changeDate" v-model="searchTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="请选择" end-placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary" class="el-button-tdms-search" icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
            <el-button type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->

      <!--delFun.join(',').indexOf(formSearchData.deviceType) == -1 && (authorityObj[`setA10_${formSearchData.deviceType}`] || authorityObj[upStr])-->
      <template>
        <hr />
      </template>

      <!--v-if="delFun.join(',').indexOf(formSearchData.deviceType) == -1 &&
        (authorityObj[`setA10_${formSearchData.deviceType}`] || authorityObj[upStr])"-->
      <template>
        <div class="typt-list-add-div">
          <div class="action_div">
            <!--<sort-type :orderBy="orderBy" @query="queryByOrder" style="float: left"/>-->
            <!--<el-button type="primary" size="small" @click="showDeviceFun">终端功能</el-button>-->

            <!--            <el-button type="primary" size="small" @click="showInspection">批量巡检</el-button>
            <el-button type="primary" size="small" @click="showCheckTime">批量校时</el-button>-->

            <el-button type="primary" size="small" @click="showDeviceRestart">终端重启</el-button>

            <template v-if="false">
              <el-button type="primary" size="small" @click="updateDeviceStatus">更新状态</el-button>
            </template>
            <template>
              <el-button v-if="deviceSetObj[formSearchData.deviceType]" :disabled="formSearchData.deptId === undefined || formSearchData.deptId === null || formSearchData.deptId === ''|| formSearchData.deptId === 'default'" type="primary" size="small" @click="showDeviceSet('',0)">批量配置</el-button>
            </template>

            <!--authorityObj[upStr]-->
            <template>
              <el-button type="primary" size="small" @click="showDeviceUpdate">终端升级</el-button>
            </template>
          </div>
        </div>
      </template>

      <!--列表-->
      <el-table :data="tableData" v-loading="loading" height="80%" stripe :highlight-current-row="true" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <!--<el-table-column label="序号" width="55" type="index" align="center" :index="indexMethod"></el-table-column>-->
        <el-table-column prop="deptName" label="护理单元" align="center" :formatter="formatDept"></el-table-column>
        <el-table-column v-if="roomShow.join(',').indexOf(formSearchData.deviceType)>-1" prop="roomName" label="房间" align="center"></el-table-column>
        <el-table-column v-if="bedShow.join(',').indexOf(formSearchData.deviceType)>-1" prop="bedName" label="床位" align="center"></el-table-column>
        <el-table-column prop="deviceModel" label="终端型号" align="center"></el-table-column>
        <el-table-column prop="deviceNum" label="终端号" align="center"></el-table-column>
        <el-table-column width="130" v-if="formSearchData.deviceType !== 'wnToiletExtension'" prop="ip" label="IP地址" align="center"></el-table-column>
        <el-table-column width="120" label="是否为广播机" align="center">
          <template slot-scope="scope">
            <el-switch @change="changeBroadcast(scope.row)" v-model="scope.row.broadcast" :active-value="1" :inactive-value="0" active-color="#1D86EF" inactive-color="#EDEDED">
            </el-switch>
          </template>
        </el-table-column>
        <!-- LED LCD 走廊显示屏 隐藏状态 -->
        <el-table-column width="100" v-if="formSearchData.deviceType !== 'wnToiletExtension' && formSearchData.deviceType !== 'wnCorridorLatticeScreen' && formSearchData.deviceType !== 'wnCorridorScreen'" prop="status" align="center" :formatter="formatStatus">
          <template slot="header">
            <div style="display: flex; justify-content: center; align-items: center;">
              <div style="margin-right: 5px">状态</div>
              <el-tooltip class="item" effect="dark" content="实时更新" placement="bottom">
                <img ref="statusImg" @mouseenter="changeImgEnter" @mouseleave="changeImgLeave" class="img-cls" src="/static/tdms/img/icon_explain_default.png" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="版本信息" prop="versions" width="350">
          <template slot-scope="scope">
            <div v-if="typeof scope.row.versions === 'string'">
              <div>
                <div>主程序：{{JSON.parse(scope.row.versions).appVersion}}</div>
                <div>模板版本：{{JSON.parse(scope.row.versions).templateVersion}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <template v-if="false">
          <el-table-column width="120" v-if="delFun.join(',').indexOf(formSearchData.deviceType) == -1" prop="lastUpTime" label="最后升级时间" align="center"></el-table-column>
        </template>

        <template v-if="false">
          <el-table-column width="120" v-if="delFun.join(',').indexOf(formSearchData.deviceType) == -1" prop="lastUpStatus" label="最后升级状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.lastUpStatus === null"></span>
              <el-tag v-else :type="scope.row.lastUpStatus === 0 ? 'danger' : 'success'" disable-transitions>{{scope.row.lastUpStatus === 0?'失败':'成功'}}</el-tag>
            </template>
          </el-table-column>
        </template>

        <el-table-column width="90" prop="singleStatus" label="单个配置" align="center">
          <template slot-scope="scope">
            <el-switch @change="changeSet(scope.row.singleStatus, scope.row.deviceId)" v-model="scope.row.singleStatus" :active-value="1" :inactive-value="0" active-color="#1D86EF" inactive-color="#EDEDED">
            </el-switch>
          </template>
        </el-table-column>

        <template>
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <span class="el-button-text-color" style="margin: 0 5px" @click="editInfo(scope.row)">编辑</span>
              <span class="el-text-danger" style="margin: 0 5px" @click="delDo(scope.row)">删除</span>
              <!--              <span class="el-button-text-color" style="margin: 0 5px" @click="watchTer(scope.row)">终端监控</span>
              <span class="el-button-text-color" style="margin: 0 5px" @click="downloadLog(scope.row)">下载日志</span>-->
              <span class="el-button-text-color" style="margin: 0 5px;" @click="showDeviceSet(scope.row.deviceId,scope.row.singleStatus)">终端配置</span>
            </template>
          </el-table-column>
        </template>

        <template v-if="false">
          <el-table-column v-if="delFun.join(',').indexOf(formSearchData.deviceType) > -1 && authorityObj[`delA10_${formSearchData.deviceType}`]" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <span class="el-text-danger" style="margin: 0 10px" @click="delDo(scope.row)">删除</span>
            </template>
          </el-table-column>

          <el-table-column v-else-if="czHidden.join(',').indexOf(formSearchData.deviceType)===-1
        && (authorityObj[`modA10_${formSearchData.deviceType}`] || authorityObj[`delA10_${formSearchData.deviceType}`]
        || (noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[conStr])
        || (noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`logA10_${formSearchData.deviceType}`]))" label="操作" width="300" align="center">
            <template slot-scope="scope">
              <span v-if="authorityObj[`modA10_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 5px" @click="editInfo(scope.row)">编辑</span>
              <span v-if="authorityObj[`delA10_${formSearchData.deviceType}`]" class="el-text-danger" style="margin: 0 5px" @click="delDo(scope.row)">删除</span>
              <span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[conStr]" class="el-button-text-color" style="margin: 0 5px" @click="watchTer(scope.row)">终端监控</span>
              <span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`logA10_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 5px" @click="downloadLog(scope.row)">下载日志</span>
              <span v-if="deviceSetObj[formSearchData.deviceType] && authorityObj[`oneA10_${formSearchData.deviceType}`]">
                <span v-if="formSearchData.deptId === undefined || formSearchData.deptId === null || formSearchData.deptId === ''" class="el-button-text-color" style="margin: 0 5px; color: #B5B5B5">终端配置</span>
                <span v-else class="el-button-text-color" style="margin: 0 5px;" @click="showDeviceSet(scope.row.deviceId,scope.row.singleStatus)">终端配置</span>
              </span>
            </template>
          </el-table-column>
        </template>

      </el-table>
      <!--end-->
      <!--分页-->
      <page-info :pageInfo="pageInfo"></page-info>
      <!--end-->
    </div>
    <!--设备升级-->
    <el-dialog title="终端升级" :visible.sync="deviceParam.deviceFormVisible" :show-close="false" width="780px" :close-on-click-modal="false">
      <device-update :deviceModel="formSearchData.deviceType" @cancelDeviceUpdate="cancelDeviceUpdate" @deviceUpdate="deviceUpdate" :deptId="formSearchData.deptId" :deptData="deptData" :deptList="deptList" ref="device_update" v-if="deviceParam.deviceFormVisible"></device-update>
    </el-dialog>
    <!--end-->
    <!--下载日志-->
    <el-dialog title="下载日志" :visible.sync="logParam.logFormVisible" :show-close="false" width="580px" :close-on-click-modal="false">
      <log-down-load @cancelLogDown="cancelLogDown" @logDown="logDown" :deviceId="deviceId" ref="logA10_down" v-if="logParam.logFormVisible"></log-down-load>
    </el-dialog>
    <!--end-->
    <!--终端监控-->
    <el-dialog custom-class="zdjk" center title="终端监控" :visible.sync="terminal.visible" width="490px" :close-on-click-modal="false">
      <el-form label-width="130px">
        <el-form-item label="信息获取时间：">
          <span class="spanColor">{{terminal.dataInfo.localTime}}</span>
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
        <el-form-item label="版本信息：">
          <div>
            <div class="versionDiv">主程序：{{terminal.dataInfo.appVersion}}</div>
            <div class="versionDiv">模板版本：{{terminal.dataInfo.templateVersion}}</div>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--end-->
    <!--终端重启-->
    <el-dialog center title="重启终端" :visible.sync="rebootDevice.visible" width="490px" :close-on-click-modal="false">
      <el-form ref="rebootDevice" label-width="130px" :rules="rules" :model="rebootDevice.form">
        <el-form-item label="重启类型：" prop="rebootType">
          <el-radio-group v-model="rebootDevice.form.rebootType">
            <el-radio :label=1>立刻重启</el-radio>
            <el-radio :label=2>定时重启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="rebootDevice.form.rebootType===2" label="选择时间：" prop="time">
          <el-date-picker v-model="rebootDevice.form.time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择重启时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button type="primary" @click="reloadDevice">确 认</el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!--终端功能-->
    <el-dialog title="终端功能" :visible.sync="deceiveFun" width="490px" :close-on-click-modal="false">
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button @click="deceiveFun = false">取 消</el-button>
        <el-button type="primary" @click="deviceFun">确 认</el-button>
      </div>
    </el-dialog>
    <!--loading-->
    <el-dialog top="15%" center title="提示" :visible.sync="watchLoading" width="400px" :show-close="watchClose" :close-on-click-modal="false">
      <div style="height: 60px; text-align: center">{{msgContent}}</div>
    </el-dialog>
    <!--批量终端重启巡检校时-start-->
    <el-dialog :title="inspectionCheckTimeReset.title" :visible.sync="inspectionCheckTimeReset.visible" :show-close="false" width="490px" :close-on-click-modal="false">
      <el-form ref="inspectionCheckTimeResetForm" label-width="120px" class="typt-add-dialog" style="width: 100%;" :rules="inspectionCheckTimeReset.rules" :model="inspectionCheckTimeReset.form">
        <el-form-item label="科室：" class="deptAddCls" prop="deptId">
          <treeselect placeholder="请选择" v-model="inspectionCheckTimeReset.form.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptData" noChildrenText="无子节点" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button @click="cancelInspectionCheckTimeReset">取 消</el-button>
        <el-button type="primary" @click="submitInspectionCheckTimeReset">确 认</el-button>
      </div>
    </el-dialog>
    <!--批量终端重启巡检校时-end-->
  </div>
</template>

<script>
// http://192.168.30.168:8090/pages/viewpage.action?pageId=39587336
import {
  $getDepartTree,
  GetBed,
  GetRoom,
} from "../../../api/tdms/departmentApi";
import PageInfo from "../../../components/tdms/PageInfoA10";
import DeviceUpdate from "../../../components/tdms/DeviceUpdateA10IXL";
import LogDownLoad from "../../../components/tdms/LogDownLoadA10";
import WWebSocket from "../../../assets/tdms/js/websocketIXL.js";
import BaseManage from "../../../assets/tdms/mixins/BaseManage";
import { PatientDictionary } from "../../../assets/tdms/js/DictionaryA10.js";
import { AxiosApi, AxiosJsonApi } from "../../../api/tdms/http";
import { ResultMsg, MsgShow } from "../../../assets/tdms/js/Message";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import deptMixins from "@/assets/tdms/js/deptMixins.js";

const EIDoorWayDeviceModel = Object({
  "YH-A26i": "YH-A26i",
  "YH-6267i": "YH-6267i",
});
const EIBedHeadDeviceModel = Object({
  "YH-6297i": "YH-6297i",
  "YH-5110i": "YH-5110i",
});
export default {
  mixins: [BaseManage, deptMixins],
  props: ["params"],
  components: { PageInfo, DeviceUpdate, LogDownLoad, Treeselect },
  inject: ["checkMoreAuthority"],
  data() {
    return {
      loading: false,
      searchTime: "",
      deceiveFun: false,
      deceiveSet: false,
      orgLevel: "",
      typeObj: {},
      orgId: "",
      branchVis: false,
      terminal: { visible: false, dataInfo: {} },
      rebootDevice: {
        visible: false,
        form: { time: "", rebootType: 1 },
      },
      statusOptions: [
        { value: "", label: "全部" },
        { value: 0, label: "失败" },
        { value: 1, label: "成功" },
      ],
      regionObj: {},
      deptObj: {},
      deviceParam: { deviceFormVisible: false },
      logParam: { logFormVisible: false },
      formSearchData: {
        startTime: "",
        endTime: "",
        deviceType: "",
        deptId: null,
        onLineStatus: "",
        orderBy: "",
        contain: 1,
        lastUpStatus: "",
        deviceModel: "",
      },
      // 是否没有删除按钮
      delFun: ["wnToiletExtension", "wnCorridorLatticeScreen"],
      // 是否没有操作列
      noneFun: ["bnPDA", "wnToiletExtension", "wnCorridorLatticeScreen"],
      // 是否有房间
      roomShow: [
        "wnBedHeadExtension",
        "wnBedSideExtension",
        "wnDoorWayExtension",
        "wnToiletExtension",
        "iBedHeadExtension",
        "iDoorWayExtension",
      ],
      // 是否有床位
      bedShow: [
        "wnBedHeadExtension",
        "wnBedSideExtension",
        "iBedHeadExtension",
      ],
      czHidden: [],
      // 终端配置页面地址，根据终端类型找地址
      deviceSetObj: {
        iBedHeadExtension:
          "/deveiceA10IXL/iBedHeadExtension/i_bedHeadConfig_fakeRouter", // 床头
        iDoorWayExtension:
          "/deveiceA10IXL/iDoorWayExtension/i_gateConfig_fakeRouter", // 门口
      },
      deviceId: "",
      modelName: "",
      queryOnlineList: [
        { key: "1", label: "在线" },
        { key: "0", label: "离线" },
      ],
      deptList: [],
      rules: {
        time: [{ required: true, trigger: "blur", message: "请选择重启时间" }],
      },
      gWebSocket: null,
      // url: '/tdms/web-td/device/list',
      url: "/tdms/mqtt/list",
      multipleSelection: [],
      roomObj: {},
      bedObj: {},
      setUrl: "",
      authorityObj: {},
      authorityArr: [],
      upStr: "",
      conStr: "",
      watchLoading: false,
      msgContent: "正在收集终端数据，请稍后...",
      watchClose: false,
      firstFlag: true,
      inspectionCheckTimeReset: {
        form: {
          deptId: null,
        },
        rules: {
          deptId: [
            { required: true, message: "请选择科室", trigger: "change" },
          ],
        },
        title: "",
        visible: false,
        type: 0, // 0巡检 1校时 2终端重启
      },
      iDoorWayExtensionModelList: Object.keys(EIDoorWayDeviceModel).map(
        (key) => ({ label: key, value: EIDoorWayDeviceModel[key] })
      ),
      iBedHeadExtensionModelList: Object.keys(EIBedHeadDeviceModel).map(
        (key) => ({ label: key, value: EIBedHeadDeviceModel[key] })
      ),
      deviceModelList: [],
    };
  },
  created() {
    this.pageInfo.pageSizes = [100, 500, 1000];
    this.pageInfo.size = 100;
    this.formSearchData.deviceType = this.params.deviceType;
    // 判断登录端
    this.getLandingEndCode();
  },
  activated() {
    this.primaryId = "deviceId";
    let orgInfo = JSON.parse(localStorage.getItem("orgInfo")) || {};
    let orgId = orgInfo.orgId || "";
    this.orgId = orgId;
    this.orgLevel = orgInfo.orgLevel;
    this.formSearchData.deviceType = this.params.deviceType;
    this.deviceModelList = this[`${this.params.deviceType}ModelList`] || [];
    console.log(`${this.params.deviceType}ModelList`, "zzzzzzzzzzzzzc");
    this.modelName = PatientDictionary[this.params.deviceType];
    this.typeObj = PatientDictionary;
    this.upStr = "updateA10_" + this.formSearchData.deviceType;
    this.conStr = "controlA10_" + this.formSearchData.deviceType;
    // 医生助手标识过长 兼容一下
    if (this.formSearchData.deviceType === "wnMedicalAudioAssistant") {
      this.upStr = "upA10_" + this.formSearchData.deviceType;
      this.conStr = "conA10_" + this.formSearchData.deviceType;
    }
    // 终端升级 编辑 删除 批量配置 终端监控 下载日志 终端重启 终端配置
    this.authorityArr = [
      this.upStr,
      "modA10_" + this.formSearchData.deviceType,
      "delA10_" + this.formSearchData.deviceType,
      "setA10_" + this.formSearchData.deviceType,
      this.conStr,
      "logA10_" + this.formSearchData.deviceType,
      "reloadA10_" + this.formSearchData.deviceType,
      "oneA10_" + this.formSearchData.deviceType,
    ];
    if (this.firstFlag) {
      this.queryDeptList();
    } else {
      this.onSearchSubmit("page");
    }
    /* if (this.roomShow.join(',').indexOf(this.formSearchData.deviceType) > -1 || this.bedShow.join(',').indexOf(this.formSearchData.deviceType) > -1) {
      this.getRooms()
    } else {
      this.onSearchSubmit('page')
    } */
    // 延迟加载
    this.$nextTick(() => {
      // 判断是否有动作权限
      this.getListAuthority();
    });
    console.log(localStorage.getItem("selectDeptId"));
  },
  methods: {
    changeBroadcast(row) {
      AxiosApi("/tdms/web-td/device/updateBroadcastStatus", {}, "PUT", {
        deviceId: row.deviceId,
        deviceType: row.deviceType,
        broadcast: row.broadcast,
      }).then((res) => {
        ResultMsg(res, "设置", () => {
          this.onSearchSubmit("page");
        });
      });
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
    // 配置更改
    changeSet(status, deviceId) {
      AxiosApi("/tdms/mqtt/updateSingleStatus", {}, "PUT", {
        deviceId: deviceId,
        singleStatus: status,
      }).then((res) => {
        ResultMsg(res, "设置", () => {
          this.onSearchSubmit("page");
        });
      });
    },
    // 查询
    onSearchSubmit(act = "") {
      if (act !== "page") {
        this.pageInfo.currentPage = 1;
      }
      localStorage.setItem("tdms_searchDept", this.formSearchData.deptId);
      this.getData();
    },
    // 处理房间数据
    formatRoom(row) {
      if (row.positions !== null) {
        let data = JSON.parse(row.positions);
        return this.roomObj[data.roomId] || data.roomName;
      }
      return "";
    },
    // 改变时间
    changeDate() {
      if (this.searchTime === null) {
        this.formSearchData.startTime = "";
        this.formSearchData.endTime = "";
      } else {
        this.formSearchData.startTime = this.searchTime[0];
        this.formSearchData.endTime = this.searchTime[1];
      }
    },
    // 保存终端功能 一个空方法
    deviceFun() {},
    // 请求房间
    getRooms(deptId) {
      GetRoom({
        page: 1,
        size: 1000,
        deptId: deptId,
      }).then((res) => {
        if (res.status === 200) {
          let d = res.data.list === null ? [] : res.data.list;
          d.forEach((item) => {
            this.roomObj[item.roomId] = item.roomName;
          });
        }
        this.getBeds();
      });
    },
    // 请求床位
    getBeds() {
      GetBed({
        page: 1,
        size: 1000,
      }).then((res) => {
        if (res.status === 200) {
          let d = res.data.list === null ? [] : res.data.list;
          d.forEach((item) => {
            this.bedObj[item.bedId] = item.bedName;
          });
        }
        this.onSearchSubmit("page");
      });
    },
    // 终端功能
    showDeviceFun() {
      if (this.multipleSelection.length < 1) {
        MsgShow("warning", "请选择至少一条终端信息！");
        return false;
      }
      this.deceiveFun = true;
    },
    // 终端配置 不需要了
    showDeviceSet(deviceId, singleStatus) {
      /* if (this.multipleSelection.length < 1) {
       MsgShow('warning', '请选择至少一条终端信息！')
       return false
     }
      let str = ''
      this.multipleSelection.forEach((item) => {
        str += item.deviceId + ','
      })
      str = str.substr(0, str.length - 1)
      localStorage.setItem('deviceId', str) */
      this.setUrl = this.deviceSetObj[this.formSearchData.deviceType];
      if (deviceId !== "") {
        let routeUrl = this.$router.resolve({
          path: this.setUrl,
          query: {
            deviceType: this.formSearchData.deviceType,
            deviceId: deviceId,
            deptId: this.formSearchData.deptId,
            singleStatus: singleStatus,
          },
        });
        window.open(routeUrl.href, "_blank");
        return;
      }
      this.$router.push({
        path: this.setUrl,
        query: {
          deviceType: this.formSearchData.deviceType,
          deviceId: deviceId,
          deptId: this.formSearchData.deptId,
          singleStatus: singleStatus,
        },
      });
      // this.deceiveSet = true
    },
    // 终端升级
    showDeviceUpdate() {
      if (this.multipleSelection.length < 1) {
        MsgShow("warning", "请选择至少一条终端信息！");
        return false;
      }
      this.deviceParam.deviceFormVisible = true;
    },
    // 终端重启
    showDeviceRestart() {
      if (this.multipleSelection.length < 1) {
        MsgShow("warning", "请选择至少一条终端信息！");
        return false;
      }

      this.$confirm(`确定要重启终端?`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: false,
        type: "warning",
      })
        .then(() => {
          this.inspectionCheckTimeReset.form.deptId =
            this.formSearchData.deptId;
          this.inspectionCheckTimeReset.title = "终端重启";
          this.inspectionCheckTimeReset.type = 2; // 0巡检 1校时 2终端重启
          this.deviceReload();
        })
        .catch(() => {
          this.cancelInspectionCheckTimeReset();
        });
    },
    // 批量巡检
    showInspection() {
      this.inspectionCheckTimeReset.form.deptId = this.formSearchData.deptId;
      this.inspectionCheckTimeReset.title = "批量巡检";
      this.inspectionCheckTimeReset.visible = true;
      this.inspectionCheckTimeReset.type = 0; // 0巡检 1校时 2终端重启
    },
    // 批量校时
    showCheckTime() {
      this.inspectionCheckTimeReset.form.deptId = this.formSearchData.deptId;
      this.inspectionCheckTimeReset.title = "批量校时";
      this.inspectionCheckTimeReset.visible = true;
      this.inspectionCheckTimeReset.type = 1; // 0巡检 1校时 2终端重启
    },
    // 重启终端
    deviceReload() {
      let that = this;
      let url = "/tdms/mqtt/reboot";
      let data = {
        deviceType: that.formSearchData.deviceType,
        deptId: that.inspectionCheckTimeReset.form.deptId,
      };
      let str = "";
      that.multipleSelection.forEach((item) => {
        str += item.deviceId + ",";
      });
      data.deviceId = str.substring(0, str.length - 1);

      AxiosJsonApi(url, data).then((res) => {
        if (res.status === 200) {
          that.cancelInspectionCheckTimeReset();
          MsgShow(
            "success",
            res.data || that.inspectionCheckTimeReset.title + "成功",
            3000
          );
        } else {
          MsgShow("error", res.desc, 3000);
        }
      });
    },
    submitInspectionCheckTimeReset() {
      let that = this;
      this.$refs["inspectionCheckTimeResetForm"].validate((valid) => {
        if (valid) {
          let url = "";
          let data = {
            deviceType: that.formSearchData.deviceType,
            deptId: that.inspectionCheckTimeReset.form.deptId,
          };
          // 0巡检 1校时 2终端重启
          switch (that.inspectionCheckTimeReset.type) {
            case 0:
              url = "/tdms/mqtt/inspection";
              break;
            case 1:
              url = "/tdms/mqtt/time";
              break;
            case 2:
              url = "/tdms/mqtt/reboot";
              let str = "";
              that.multipleSelection.forEach((item) => {
                str += item.deviceId + ",";
              });
              data.deviceId = str.substring(0, str.length - 1);
              break;
          }
          AxiosJsonApi(url, data).then((res) => {
            if (res.status === 200) {
              /* ResultMsg(
                res,
                res.data || that.inspectionCheckTimeReset.title + '成功',
                that.cancelInspectionCheckTimeReset
              ) */
              that.cancelInspectionCheckTimeReset();
              MsgShow(
                "success",
                res.data || that.inspectionCheckTimeReset.title + "成功",
                3000
              );
            } else {
              MsgShow("error", res.desc, 3000);
            }
          });
        }
      });
    },
    cancelInspectionCheckTimeReset() {
      this.inspectionCheckTimeReset.title = "";
      this.inspectionCheckTimeReset.visible = false;
      this.inspectionCheckTimeReset.type = "";
      this.inspectionCheckTimeReset.form.deptId = null;
    },
    // 处理床位数据
    formatBed(row) {
      if (row.positions !== null) {
        let data = JSON.parse(row.positions);
        return this.bedObj[data.bedId] || data.bedName;
      }
      return "";
    },
    // 切换图片
    changeImgLeave() {
      this.$refs.statusImg.src = "/static/tdms/img/icon_explain_default.png";
    },
    // 切换图片
    changeImgEnter() {
      this.$refs.statusImg.src = "/static/tdms/img/icon_explain_slip.png";
    },
    // 护理单元格式化
    formatDept(row) {
      return row.deptName === null ? "" : row.deptName;
    },
    // 状态格式化
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
      // let url = '/tdms/web-td/device/promote'
      let url = "/tdms/mqtt/promote";
      // console.log(data)
      // return false
      AxiosJsonApi(url, data).then((res) => {
        if (res.status === 200) {
          if (res.data === "UpdatePackage") {
            MsgShow("error", "当前系统正在发送升级包 请稍后再试", 10000);
          } else {
            ResultMsg(res, "设备升级请求已经发送", this.cancelDeviceUpdate);
          }
        } else {
          MsgShow("error", res.desc, 3000);
        }
      });
    },
    // 取消设备升级
    cancelDeviceUpdate() {
      this.deviceParam.deviceFormVisible = false;
    },
    // 日志下载
    logDown() {
      let data = this.$refs.logA10_down.form;
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
        orgCode: JSON.parse(localStorage.getItem("orgInfo")).orgCode,
        deviceType: this.params.deviceType,
      };
      console.log("日志下载传参");
      console.log(para);
      WWebSocket.conn(para, this.gWebSocket, this);
    },
    // 取消日志下载
    cancelLogDown() {
      this.logParam.logFormVisible = false;
    },
    // 获取科室列表
    queryDeptList() {
      $getDepartTree({
        size: "999999",
        page: "1",
      }).then((res) => {
        if (res.status === 200) {
          this.firstFlag = false;
          let t = res.data.list || [];
          t.unshift({
            id: "default",
            label: "无科室",
          });
          let temp = JSON.stringify(t);
          temp = temp
            .replace(/deptId/g, "id")
            .replace(/deptName/g, "label")
            .replace(/,"children":null/g, "")
            .replace(/,"children":\[\]/g, "");
          this.deptList = JSON.parse(temp);
          this.deptData = JSON.parse(temp);
          // 判断为运维管理
          if (this.landingEndCode === "OPEX") {
            // 获取地址中参数
            let oldDept = localStorage.getItem("tdms_searchDept");
            let deptId = this.$route.query.deptId;
            if (
              oldDept !== "undefined" &&
              oldDept !== null &&
              oldDept !== "null" &&
              oldDept !== ""
            ) {
              this.formSearchData.deptId = oldDept;
            } else if (deptId !== undefined) {
              this.formSearchData.deptId = deptId;
            } else {
              let deptId = this.getDefaultDeptInfo() || this.deptData[0].id; // localStorage.getItem("selectDeptId");
              if (deptId === "null") {
                deptId = "";
              }
              this.formSearchData.deptId = deptId;
            }
          }
          this.onSearchSubmit("page");
        }
      });
    },
    reload() {
      this.searchTime = "";
      this.formSearchData.lastUpStatus = "";
      this.formSearchData.startTime = "";
      this.formSearchData.endTime = "";
      this.pageInfo.currentPage = 1;
      // 兼容运维端
      // 判断为运维管理
      if (this.landingEndCode === "OPEX") {
        let deptId = localStorage.getItem("selectDeptId");
        if (deptId === "null") {
          deptId = "";
        }
        this.formSearchData.deptId = deptId;
      } else {
        this.formSearchData.deptId = null;
      }
      this.formSearchData.onLineStatus = "";
      this.formSearchData.deviceModel = "";
      this.getData();
    },
    // 删除
    delDo(row) {
      // this.del(`/tdms/web-td/device/${row.deviceId}`)
      this.del(`/tdms/mqtt/remove/`, {
        deviceId: row.deviceId,
      });
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
    // 下载日志
    downloadLog(rowData) {
      this.logParam.logFormVisible = true;
      this.deviceId = rowData.deviceId;
    },
    showDevice(rowData) {
      this.rebootDevice.visible = true;
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
        orgCode: JSON.parse(localStorage.getItem("orgInfo")).orgCode,
        deviceType: this.params.deviceType,
      };
      console.log("终端监控传参");
      console.log(para);
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
    // 重启终端
    reloadDevice() {
      let _linkUrl = `ws://${window.location.host}/tdmsWs/web-td/websocket`;
      let type = location.protocol;
      if (type === "https:") {
        _linkUrl = `wss://${window.location.host}/wss/web-td/websocket`;
      }
      let para = {
        linkUrl: _linkUrl,
        deviceId: this.deviceId,
        reqType: 3,
        orgId: this.orgId,
        rebootType: this.rebootDevice.form.rebootType,
        time: this.rebootDevice.form.time,
        deviceType: this.params.deviceType,
      };
      WWebSocket.conn(para, this.gWebSocket, this);
      MsgShow("success", "系统已发送重启请求，请等待设备重启", 3000);
    },
  },
};
</script>

<style scoped>
.versionDiv {
  min-height: 20px;
  line-height: 20px;
}
</style>
<style lang="scss">
.zdjk {
  .el-dialog__body {
    height: 500px;
    overflow: auto;
  }
}
.zdpz {
  .el-dialog__body {
    height: 600px;
    overflow: auto;
  }
}
</style>
