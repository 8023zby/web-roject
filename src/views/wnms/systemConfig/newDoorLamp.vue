<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">门灯管理</div>
    </div>
    <div class="typt-add-container">
      <div class="content-main">
        <div class="depart">
          <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" loadData :disabled="deptDisabled"></deptInsideMenu>
        </div>

        <div class="doorLamp-main">
          <div class="doorColor">
            门灯颜色
          </div>

          <div class="list-main" v-for="(item,index ) in  config.doorLampList" :key="index">
            <span class="list-name">
              {{ item.name }}
            </span>
            <div class="item">
              <el-radio class="myradio" v-model="item.radioValue" label="1">统一颜色</el-radio>
              <el-radio class="
                        myradio" v-model="item.radioValue" label="2">分段颜色</el-radio>

            </div>

            <div class="item">
              <div class="part" v-if="item.radioValue =='1'">
                <el-color-picker popper-class="theme-color-popper" :predefine="predefineColors" v-model="item.backgroundColor"></el-color-picker>
              </div>
              <div class="part" v-else v-for="(p,i) in item.partColor" :key="i">
                <span>{{p.name}}</span>
                <el-color-picker popper-class="theme-color-popper" :predefine="predefineColors" v-model="p.value"></el-color-picker>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="black">返回</el-button>
      <el-button type="primary" @click="onSave" :loading="saveLoading">保存</el-button>
    </div>
  </div>
</template>

<script>
import * as api from "../../../api/wnms/msgManage/systemConfig.js";
import deptInsideMenu from "@/components/wnms/deptInsideMenu/deptInsideMenu";
import {
  deepClone,
  getRouterQuery,
  deepMergeLeft,
  deepMerge
} from "../../../assets/wnms/utils/index";
export default {
  name: "newDoorLamp",
  components: { deptInsideMenu },
  data() {
    let { deviceId, deptId } = this.getDevice();
    const selectDeptInfo =
      JSON.parse(localStorage.getItem("selectDeptInfo")) || {};
    return {
      config: {
        doorLampList: []
      },
      deepList: [],
      selectDeptInfo: selectDeptInfo,
      deptDisabled: !!deviceId, // 科室选择禁用
      deviceId: deviceId || "",
      saveLoading: false, //按钮保存
      deptId: deptId || selectDeptInfo.deptId,
      nurseUnitId: deptId || selectDeptInfo.deptId,
      predefineColors: [
        "#FF0000", // 红色
        "#00FF00", // 绿色
        "#0000FF", // 蓝色
        "#FFFF00", // 黄色
        "#00FFFF", // 青色
        "#FF00FF", // 紫色
        "#FFFFFF" // 白色
      ]
    };
  },
  mounted() {},
  methods: {
    getData() {
      let params = {
        orgId: this.selectDeptInfo.orgId,
        nurseUnitId: this.deptId,
        deviceId: this.deviceId
      };
      api.getDoorLampList(params).then(res => {
        if (res.data && res.data.doorLampList) {
          let list = res.data.doorLampList.reduce((pre, cur) => {
            let target = pre.find(ee => ee.name == cur.name);
            if (target) {
              Object.assign(target, cur);
            }
            return pre;
          }, this.config.doorLampList);
          this.config.doorLampList = list;
        }
      });
    },

    mMerge(target, source) {},
    // 获取当前url
    getDevice() {
      return getRouterQuery(this);
    },

    //护理单元进行查询
    reLoadData(deptId) {
      this.deptId = deptId;
      this.nurseUnitId = deptId;

      api.nursingLevel({ deptId }).then(res => {
        this.assembleData(res.data);
      });
    },

    // 返回父级
    goParent() {
      let deviceType = this.$route.query.deviceType;
      let path = "";
      if (this.nurseUnitId) {
        path = `/deveiceA10/${deviceType}?deptId=${this.nurseUnitId}`;
      } else {
        path = `/deveiceA10/${deviceType}`;
      }
      this.$router.push({
        path: path
      });
    },
    // 返回
    black() {
      this.$router.go(-1);
    },

    //数据保存
    onSave() {
      this.saveLoading = true;

      let params = {
        nurseUnitId: this.nurseUnitId,
        config: JSON.stringify(this.config),
        deviceId: this.deviceId || ""
      };

      api
        .SaveDoorLamp(params)
        .then(res => {
          console.log(res);
        })
        .finally(() => {
          this.saveLoading = false;
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.goParent();
        });
    },

    //数据组合
    assembleData(data) {
      let arr = [
        { nurseLevelName: "护士进入" },
        { nurseLevelName: "卫生间呼叫" }
      ];
      let customizeColor = this.createColor(arr);
      let nurseLeveColor = this.createColor(data);

      this.config.doorLampList = [...customizeColor, ...nurseLeveColor];
      this.getData();
    },

    //创建颜色
    createColor(arr) {
      let list = [];
      for (let [index, item] of arr.entries()) {
        list.push({
          name: item.nurseLevelName || "",
          backgroundColor: "#FFFFFF", //统一颜色
          radioValue: "1", //radio
          partColor: [
            {
              name: "上段",
              value: "#FFFFFF"
            },
            {
              name: "中段",
              value: "#FFFFFF"
            },
            {
              name: "下段",
              value: "#FFFFFF"
            }
          ]
        });
      }
      return list;
    }
  }
};
</script>

<style scoped lang="scss">
.content-main {
  margin-left: 2rem;
  .depart {
  }
  .doorLamp-main {
    .doorColor {
      font-size: 18px;
    }
    .list-main {
      display: flex;
      align-items: center;
      margin: 1rem;
      .list-name {
        width: 6rem;
      }
      span {
        font-size: 14px;
        padding: 0 1rem 0 1rem;
        color: #606266;
      }
      .item {
        /deep/.el-color-dropdown__main-wrapper,
        /deep/.el-color-alpha-slider {
          display: none;
        }
        display: flex;
        align-items: center;
        .myradio {
          margin-left: 1rem;
        }

        .part {
          margin-left: 1rem;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.theme-color-popper {
  .el-color-dropdown__main-wrapper {
    display: none;
  }
}
</style>
