<!-- 门灯管理 -->
<template>
  <div class="typt-list-main" v-loading="isLoading">
    <div v-if="!loadErr" class="typt-list-container device-main-view">
      <el-form class="typt-list-search" :inline="true">
        <el-form-item label="科室:">
          <treeselect v-uni="actFormKey + 'keshi'" v-model="selectDeptId" :multiple="false" :options="dataTree" @select="onSelect" :default-expand-level="2" :clearable="false" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="终端类型:">
          <el-select v-uni="actFormKey + 'zhongduanleixing'" size="small" placeholder="请选择" v-model="deviceType" @change="onSelect">
            <el-option v-for="item in deviceTypeData" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="ip-div">科室ip号段：{{ipStr}}</div>
      <el-row :gutter="20">
        <el-col v-for="item in dataList" :key="item.id" :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
          <div class="item">
            <div class="item-room">
              <i class="el-icon-s-home"></i>
              <span class="door-no">{{ item.name }}</span>
            </div>
            <div class="item-num">
              <div class="item-num-title">终端号：</div>
              <el-input v-uni="actFormKey + 'zhongduanhao'" @blur="changeVal(item)" class="item-num-input" v-model="item.deviceNum" placeholder="请填写终端号(注：终端号必须为正整数)"></el-input>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="typt-add-footer btn-view" v-if="!isLoading">
        <el-button v-uni="actKey + 'save'" type="primary" v-if="dataList && dataList.length > 0" @click="onSave">保存</el-button>
        <div v-else style="color: #ccc;margin-top:50px;font-size:16px">暂无数据</div>
      </div>
    </div>
    <div class="error-view" v-else>
      <i class="el-icon-bangzhu"></i>
      <div>数据加载错误...</div>
    </div>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { $getDepartTree } from "../../../api/tdms/departmentApi";
import { AxiosApi } from "../../../api/passport/http";
import { AxiosJsonApi } from "../../../api/tdms/http";
import { MsgShow, ResultMsg } from "../../../assets/tdms/js/Message";

import deptMixins from "@/assets/tdms/js/deptMixins.js";

export default {
  mixins: [deptMixins],
  components: { Treeselect },
  data() {
    return {
      isLoading: true,
      loadErr: false, // 加载出错
      dataList: [], // 房间列表，主要展示列表
      deviceList: [], // 对应注册数据列表
      selectDeptId: "",
      dataTree: [],
      deviceType: "wnBedHeadExtension",
      deviceTypeData: [
        {
          id: "wnBedHeadExtension",
          label: "床头分机",
        },
        {
          id: "wnBedSideExtension",
          label: "床旁分机",
        },
        {
          id: "wnDoorWayExtension",
          label: "门口分机",
        },
      ],
      ipStr: "",
      actKey: "zhongduanshehao_",
      actFormKey: "zhongduanshehao__",
    };
  },
  mounted() {
    // 请求部门数据
    this.getDept();
  },
  methods: {
    // 检测数值是否为正整数
    changeVal(item) {
      if (!/^[1-9]\d*$/.test(item.deviceNum)) {
        item.deviceNum = "";
      }
    },
    // 保存数据
    onSave() {
      this.isLoading = true;
      // 未填终端号的数据要过滤掉
      let saveList = [];
      this.dataList.forEach((item) => {
        if (item.deviceNum) {
          if (this.deviceType === "wnDoorWayExtension") {
            saveList.push({
              roomId: item.id,
              deviceNum: item.deviceNum,
              deptId: this.selectDeptId,
              deviceType: this.deviceType,
            });
          } else {
            saveList.push({
              bedId: item.id,
              deviceNum: item.deviceNum,
              deptId: this.selectDeptId,
              deviceType: this.deviceType,
            });
          }
        }
      });
      if (saveList.length === 0) {
        MsgShow("warning", "请至少填写一个终端号", 3000);
        this.isLoading = false;
        return;
      }
      let flag = false;
      for (let i = 0; i < saveList.length; i++) {
        for (let j = i + 1; j < saveList.length; j++) {
          if (saveList[i].deviceNum === saveList[j].deviceNum) {
            flag = true;
            break;
          }
        }
      }
      if (flag) {
        MsgShow("warning", "存在重复的终端号，请检查后再提交", 3000);
        this.isLoading = false;
        return;
      }
      AxiosJsonApi("/tdms/web-td/device/deviceRegNum", saveList, "PUT").then(
        (rs) => {
          if (rs.status === 200) {
            ResultMsg(rs, "注册设号", () => {
              this.queryHandler();
            });
          } else {
            MsgShow("error", "注册设号失败", 3000);
          }
          this.isLoading = false;
        }
      );
    },
    // 获取对应的设号数据
    getDeviceData(val, key) {
      let res = {};
      this.deviceList.forEach((item) => {
        if (item[key] === val) {
          res = item;
          return false;
        }
      });
      return res || {};
    },
    async queryHandler() {
      try {
        let list = []; // 房间数据列表，查询的数据先在此筛选合并
        let listRes = {};
        if (this.deviceType === "wnDoorWayExtension") {
          // 房间列表
          listRes = await AxiosApi("/ifms/web-org/rooms", {}, "GET", {
            page: 1,
            size: 1000,
            deptId: this.selectDeptId,
          });
        } else {
          // 床位列表
          listRes = await AxiosApi("/ifms/web-org/beds", {}, "GET", {
            page: 1,
            size: 1000,
            deptId: this.selectDeptId,
          });
        }
        if (listRes.status === 200) {
          // 绑定房间列表
          list = listRes.data.list;
        }

        // 将终端设号的数据赋值
        let res = await AxiosApi(
          "/tdms/web-td/device/deviceRegNum",
          {},
          "GET",
          {
            deptId: this.selectDeptId,
            deviceType: this.deviceType,
          }
        );
        if (res.status === 200) {
          let ipNum = res.data.ipNum === null ? "" : res.data.ipNum;
          if (ipNum === "") {
            this.ipStr = "无";
          } else {
            let obj = JSON.parse(res.data.ipNum);
            let str = "";
            obj.forEach((item) => {
              str += item.startIp + "~" + item.endIp + ",";
            });
            str = str.substr(0, str.length - 1);
            this.ipStr = str;
          }
          // 终端设号数据
          this.deviceList = res.data.listData === null ? [] : res.data.listData;
        }
        // 将终端号绑定到对应的房间或者床位
        list.forEach((item) => {
          if (this.deviceType === "wnDoorWayExtension") {
            let temp = this.getDeviceData(item.roomId, "roomId");
            item.id = item.roomId;
            item.name = item.roomName;
            item.deviceNum =
              temp.deviceNum ||
              (!/^[1-9]\d*$/.test(item.roomName) ? "" : item.roomName);
          } else {
            let temp = this.getDeviceData(item.bedId, "bedId");
            item.id = item.bedId;
            item.name = item.bedName;
            item.deviceNum =
              temp.deviceNum ||
              (!/^[1-9]\d*$/.test(item.bedName) ? "" : item.bedName);
          }
        });
        // 将处理好的数据交给vue
        this.dataList = list;
      } catch (e) {
        console.error("数据加载错误:", e);
        this.loadErr = true;
      } finally {
        this.isLoading = false; // 数据加载完成
      }
    },
    /* 获取护理单元 */
    getDept() {
      $getDepartTree({ size: "999999", page: "1" }).then((res) => {
        if (res.status === 200 && res.data !== null) {
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
          this.dataTree = JSON.parse(temp);
          this.selectDeptId =
            this.getDefaultDeptInfo({ follow: true }) || this.dataTree[0].id;
          // // 如果其他模块选择了部门 默认带过来
          // let oldDept = localStorage.getItem('tdms_searchDept')
          // let deptId = localStorage.getItem('selectDeptId')
          // if (oldDept !== 'undefined' && oldDept !== null && oldDept !== 'null' && oldDept !== '') {
          //   this.selectDeptId = oldDept
          // } else if (deptId) {
          //   this.selectDeptId = deptId
          // } else {
          //   this.selectDeptId = this.dataTree[0].deptId
          // }
          this.queryHandler();
        }
      });
    },
    // 部门切换
    onSelect() {
      this.$nextTick(() => {
        localStorage.setItem("tdms_searchDept", this.selectDeptId);
        this.queryHandler();
      });
    },
  },
};
</script>
<style lang='scss' scoped>
div,
span {
  font-size: 14px;
}

.ip-div {
  padding: 10px 0 10px 0;
}

.device-main-view {
  padding: 10px 20px;
  box-sizing: border-box;
  min-height: 500px;
  overflow: auto;

  .item {
    display: flex;
    flex: 1;
    margin: 10px 0;
    box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.1);
    border-radius: 7px;

    .item-room {
      width: 130px;
      height: 50px;
      display: flex;
      align-items: center;

      i {
        width: 50px;
        height: 50px;
        font-size: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #409eff;
      }
      .door-no {
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .item-num {
      display: flex;
      align-items: center;
      flex: 1;
      padding-right: 10px;
      margin-left: 5px;
      box-sizing: border-box;

      .item-num-title {
        min-width: 50px;
        color: #888;
      }

      .item-num-input {
        flex: 1;
      }
    }
  }

  .btn-view {
    display: flex;
    justify-content: center;
    margin-bottom: 80px;
  }
}

.error-view {
  padding: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  i {
    font-size: 50px;
    color: #409eff;
  }

  div {
    color: #888;
    margin-top: 20px;
  }
}
/deep/.device-main-view .el-form-item {
  margin-bottom: 0;
}
/deep/.device-main-view .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0;
}
/deep/.device-main-view .el-form-item__content {
  width: 182px;
}
</style>
