<!--
  文件描述：基于新UI的list页面-消息提醒-自动提醒\提醒应用
    根据pageFrom这个参数判断：msgWarnUse是提醒应用，msgWarn是自动提醒

    主样式class：list-page-new
  创建时间：2020/05/09 11:19
  创建人：Administrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
  关于主体查询方法，方法名为：executeQueryPage
  表格数据变量为：pagination.list

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form ref="search" :inline="true" :model="search" class="typt-list-search">
      <el-form-item label="科室:" v-if="deptShow">
        <treeselect v-model="selectDeptId" :multiple="false" :options="dataTree" :normalizer="normalizer" @select="onSelect" :default-expand-level="2" :clearable="false" placeholder="请选择科室" />
      </el-form-item>
      <el-form-item label="消息类型:">
        <el-select v-model="search.msgType" size="small" placeholder="请选择">
          <el-option value label="全部"></el-option>
          <el-option v-for="item in eventTypeList" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息名称:">
        <el-input v-model="search.msgName" placeholder="请输入" size="small" />
      </el-form-item>
      <el-form-item label="接收者:">
        <el-select v-model="search.recipient" size="small" placeholder="请选择">
          <el-option value label="全部"></el-option>
          <el-option v-for="item in resourceInfoList" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button type="primary" icon="el-icon-search" size="small" @click="queryHandler">搜索</el-button>
          <el-button type="text" @click="clsHandler">重置</el-button>
        </div>
      </el-form-item>
      <el-form-item />
    </el-form>

    <!--查询条件模块 === END-->
    <hr />

    <!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button v-if="pageFrom === 'msgWarn'" type="warning" icon="el-icon-plus" size="small" @click="$emit('option-changed', 'addOrModify', { type: 'add' })">添加</el-button>
      <!--右侧区域按钮-->
      <div class="action_div"></div>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <el-table v-loading="yh_loading" :data="pagination.list" :header-cell-style="{ background: '#f9f9f9' }" height="100%" stripe>
      <!-- <el-table-column label="序号" type="index" width="140" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.$index + (pagination.page - 1) * pagination.size + 1
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="消息类型" prop="msgType" align="center" />
      <el-table-column label="消息名称" prop="msgName" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="触发时刻" align="center" width="180">
        <!--任务定时类型（IMMEDIATE：即时，ABSOLUTE：绝对定时，RELATIVE：相对定时）-->
        <template slot-scope="scope">
          <div style="width: 100%; white-space: nowrap">
            {{ dealtimeType(scope.row.timeType) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="显示图标" prop="icon" align="center" />
      <el-table-column label="接收者" align="center">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.pushMsgInfo" :key="index" class="table-lbinfo">
            {{ item.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="接收终端" prop="pushMsgInfo" align="center" width="300" :show-overflow-tooltip="true" class="content-left">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.pushMsgInfo" :key="index" class="table-lbinfo">
            {{ item.deviceName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="消息格式" prop="viewType" align="center">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.pushMsgInfo" :key="index" class="table-lbinfo">
            {{ item.ViewTypeName }}消息
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <span v-if="pageFrom === 'msgWarn'" class="el-button-text-color" @click="shouUseDialog(scope.$index, scope.row)">应用</span>
          <span class="el-button-text-color" @click="
              $emit('option-changed', 'addOrModify', {
                type: 'edit',
                row: scope.row,
                selectDeptId,
                search: JSON.stringify(search)
              })
            ">编辑</span>

          <span class="el-text-danger" @click="delHandler(scope.$index, scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!--表格主体 ==== END-->

    <!--分页条-->
    <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <!--应用弹窗-->
      <el-dialog :visible.sync="dialogSortVisible" title="应用" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" width="500px">
        <div style="height: 500px; overflow-y: auto">
          <el-container>
            <el-main class="dialog-from-main">
              <div style="width: 100%; min-height: 300px; text-align: center">
                <el-tree :data="dataTree" show-checkbox default-expand-all node-key="deptId" ref="ref_usetree" highlight-current check-strictly :props="defaultProps"></el-tree>
              </div>
            </el-main>
          </el-container>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSortVisible = false">取消</el-button>
          <el-button type="primary" @click="useMsg">确认</el-button>
        </div>
      </el-dialog>
    </slot>
  </div>
</template>

<script>
import { deepMerge } from "@/assets/wnms/utils";
import BaseQueryPageForm from "../../common/BaseQueryPageForm";
import * as msgWarnApi from "@/api/wnms//msgManage/msgWarn";
import Pagination from "@/components/wnms/paginations/pagination";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import deptMixins from "@/assets/wnms/js/deptMixins.js";

export default {
  components: { Pagination, Treeselect },
  mixins: [BaseQueryPageForm, deptMixins],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {},
    },
    pageFrom: {
      type: String,
      default: () => {
        return "msgWarn";
      },
    },
  },
  data() {
    const search = this.initQueryCriteria();
    return {
      deptShow: false,
      selectDeptId: null,
      yh_loading: false,
      dataFrom: 1,
      DeptInfo: {}, // 护理单元信息
      // 应用到护理单元的数据
      useDeptInfo: {
        deptIds: "", // 护理单元id，多个逗号隔开--设置护理单元时使用
        eventId: "",
      },
      dataTree: [],
      defaultProps: {
        children: "children",
        label: "deptName",
      },
      dialogSortVisible: false, // 应用
      viewTypeDic: {
        TEXT: "文字",
        IMAGE: "图片",
        AUDIO: "音频",
        VIDEO: "视频",
      },
      deviceNameDic: [
        {
          id: "wnBedSideExtension",
          deviceName: "床旁分机",
          permissions: "PATIENT,NURSE,NURSE_HEAD,DOCTOR", // 展示权限
          isCheckbox: false,
          url: "",
        },
        {
          id: "wnBedHeadExtension",
          deviceName: "床头分机",
          permissions: "PATIENT", // 展示权限
          isCheckbox: false,
          url: "",
        },
        {
          id: "bnPDA",
          deviceName: "PDA",
          permissions: "NURSE,NURSE_HEAD", // 展示权限
          isCheckbox: false,
          url: "",
        },
        {
          id: "wnMedicalAudioAssistant",
          deviceName: "W101",
          permissions: "NURSE,NURSE_HEAD,DOCTOR", // 展示权限
          isCheckbox: false,
          url: "",
        },
        {
          id: "bnNursingTV",
          deviceName: "触屏看板",
          permissions: "NURSE,NURSE_HEAD", // 展示权限
          isCheckbox: false,
          url: "",
        },
        {
          id: "WEB",
          deviceName: "web",
          permissions: "NURSE,NURSE_HEAD,DOCTOR", // 展示权限
          isCheckbox: false,
          url: "",
        },
      ],
      eventTypeList: [], // 消息类型字典
      resourceInfoList: [
        { id: "PATIENT", name: "患者" },
        { id: "NURSE", name: "护士" },
        { id: "NURSE_HEAD", name: "护士长" },
        { id: "DOCTOR", name: "医生" },
      ],
      tableSortData: {},
      search: search,
    };
  },
  created() {
    // 获取消息类型
    msgWarnApi.getConfigType().then((res) => {
      if (res.status === 200 && res.data !== null) {
        this.eventTypeList = res.data;
      }
    });
  },
  mounted() {
    if (this.pageFrom === "msgWarnUse") this.dataFrom = "";
    this.DeptInfo = JSON.parse(localStorage.getItem("selectDeptInfo"));

    // this.search.dataFrom = this.dataFrom
    this.getdepts();
    // this.executeQueryPage();
    // 获取护理单元--自动提醒里面，应用的时候使用
    if (this.pageFrom == "msgWarnUse") {
      this.deptShow = true;
    }
  },
  methods: {
    onSelect(node, ins) {
      this.selectDeptId = node.deptId;
      this.search.deptIds = this.selectDeptId;
    },
    normalizer(node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined,
      };
    },
    /* 获取护理单元 */
    async getdepts() {
      let res = await msgWarnApi.getdepts();
      if (res.status === 200 && res.data !== null) {
        this.dataTree = res.data.list;
        // 设置默认为当前科室
        this.selectDeptId =
          this.getDefaultDeptInfo() || this.dataTree[0].deptId;
        if (this.detail.selectDeptId)
          this.selectDeptId = this.detail.selectDeptId;
        if (this.pageFrom == "msgWarnUse")
          this.search.deptIds = this.selectDeptId;
        else this.search.deptIds = "";
        console.log("getDepts", this.search);
      }
      this.executeQueryPage();
    },
    /* 触发时刻 */
    dealtimeType(t) {
      // 任务定时类型（IMMEDIATE：即时，ABSOLUTE：绝对定时，RELATIVE：相对定时）
      let ty = [];
      if (t.indexOf("IMMEDIATE") > -1) {
        ty.push("实时");
      }
      if (t.indexOf("ABSOLUTE") > -1) {
        ty.push("绝对时间");
      }
      if (t.indexOf("RELATIVE") > -1) {
        ty.push("相对时间");
      }
      return ty.join("、");
    },
    /* 消息格式 */
    dealviewType(t) {
      // （TEXT-文字,IMAGE-图片,AUDIO-音频，VIDEO-视频)
      if (t === "TEXT") {
        return "文字消息";
      } else if (t === "IMAGE") {
        return "图片消息";
      } else if (t === "AUDIO") {
        return "音频消息";
      } else if (t === "VIDEO") {
        return "视频消息";
      }
    },
    /* 应用弹窗 */
    shouUseDialog(index, row) {
      let _this = this;
      // 先清理数据
      _this.useDeptInfo.deptIds = "";
      _this.useDeptInfo.eventId = row.eventId;

      _this.dialogSortVisible = true;
      this.$nextTick(() => {
        if (row.deptIds && row.deptIds !== "") {
          _this.$refs.ref_usetree.setCheckedKeys(row.deptIds.split(","));
        } else {
          _this.$refs.ref_usetree.setCheckedKeys([]);
        }
      });
    },
    /* 应用提醒 */
    useMsg() {
      let _this = this;
      let depts = [];
      let res = this.$refs.ref_usetree.getCheckedNodes();
      for (let v of res.values()) {
        depts.push(v.deptId);
      }
      _this.useDeptInfo.deptIds = depts.join(",");

      msgWarnApi.Edit(_this.useDeptInfo).then((data) => {
        if (data.status === 200) {
          this.$message({
            type: "success",
            message: "应用成功",
          });
          _this.dialogSortVisible = false;
          _this.executeQueryPage();
        } else {
          this.$message({
            type: "danger",
            message: data.desc,
          });
        }
      });
    },
    // 立即提醒对照
    isPromptlymatter(v) {
      return v.isPromptly === 0 ? "否" : "是";
    },

    /* 查询条件 */
    initQueryCriteria(form = {}) {
      if (this.dataTree) this.selectDeptId = this.dataTree[0].deptId;
      if (this.detail.selectDeptId)
        this.selectDeptId = this.detail.selectDeptId;
      if (this.detail.search) form = JSON.parse(this.detail.search);
      console.log("初始化查询条件form:", form);
      return deepMerge(
        {
          msgType: "", // 消息类型
          msgName: "", // 消息名称
          recipient: "", // 接收者
          deptIds: this.pageFrom === "msgWarnUse" ? this.selectDeptId : "",
          dataFrom: this.pageFrom === "msgWarnUse" ? "" : 1,
        },
        form
      );
    },

    /* 获取列表 */
    executeQueryPage() {
      this.yh_loading = true;
      msgWarnApi
        .getInfo(this.createQueryParams())
        .then((data) => {
          try {
            for (let v of data.data.list.values()) {
              if (v.pushMsgInfo && v.pushMsgInfo !== null) {
                console.log(v.msgType);
                let obj = eval("(" + v.pushMsgInfo + ")");
                let pushMsgInfo = [];

                for (let key in obj) {
                  let nt = this.resourceInfoList.find((val, index) => {
                    return val.id === key;
                  });
                  obj[key].name = nt.name;
                  obj[key].ViewTypeName =
                    this.viewTypeDic[obj[key]["viewType"]];
                  // 处理显示终端
                  if (obj[key] && obj[key].resourceInfo) {
                    let resourceInfo = obj[key].resourceInfo;
                    if (typeof resourceInfo === "string")
                      resourceInfo = JSON.parse(resourceInfo);
                    let devicName = [];
                    for (let v3 of resourceInfo.values()) {
                      let dv = this.deviceNameDic.find((val3, index3) => {
                        return val3.id === v3.deviceName;
                      });
                      if (dv) devicName.push(dv.deviceName);
                    }
                    obj[key]["deviceName"] = devicName.join("、");
                  }

                  pushMsgInfo.push(obj[key]);
                }
                v.pushMsgInfo = pushMsgInfo;

                let msgType = this.eventTypeList.find((vv, ii) => {
                  return vv.id === v.msgType;
                });
                if (msgType) v.msgType = msgType.name;
              }
            }
            this.queryResultHandler(data);
          } catch (e) {
            console.log("列表处理报错：", e);
            for (let v of data.data.list.values()) {
              v.pushMsgInfo = [];
            }
            this.queryResultHandler(data);
          }
        })
        .finally(() => {
          this.yh_loading = false;
        });
    },

    /* 列表删除 */
    customDelHandler(index, row) {
      let dept = 0;
      if (this.pageFrom === "msgWarnUse") dept = row.deptIds;

      msgWarnApi.Delete(row.eventId, dept).then((res) => {
        this.IsSuccess(res);
        this.executeQueryPage();
      });
    },

    /* 清楚查询条件 */
    clsHandler() {
      this.detail.search = null;
      this.detail.selectDeptId = null;
      this.search = this.initQueryCriteria();
      this.queryHandler();
    },
  },
};
</script>
