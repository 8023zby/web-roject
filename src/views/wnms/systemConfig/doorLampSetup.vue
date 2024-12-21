<!-- 门灯配置 -->
<template>
  <div class="doorlamp-main-view">
    <div class="list">
      <div class="item" v-for="item in levelList" :key="item.nurseLevelId">
        <div class="item-title">{{ item.nurseLevelName }}</div>
        <el-color-picker
          v-model="item.color"
          :predefine="predefineColors"
        ></el-color-picker>
      </div>
      <div class="item">
        <div class="item-title">护士进入</div>
        <el-color-picker
          v-model="colorNurseGate"
          :predefine="predefineColors"
        ></el-color-picker>
      </div>
       <div class="item">
        <div class="item-title">卫生间呼叫</div>
        <el-color-picker
          v-model="colorToiletGate"
          :predefine="predefineColors"
        ></el-color-picker>
      </div>
    </div>

    <div class="control-btns">
      <el-button @click="goParent">返回</el-button>
      <el-button type="primary" @click="onSave" :loading="saveLoading"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import "./systemConfig.css";
import * as doorAPI from "@/api/wnms/msgManage/doorLamp";
import * as API from "@/api/wnms/msgManage/systemConfig";
export default {
  data() {
    return {
      levelList: [],
      colorList: [], //颜色数据列表
      saveLoading: false, //按钮保存
      // 预定颜色
      predefineColors: [
        "#FF0000", // 红色
        "#00FF00", // 绿色
        "#0000FF", // 蓝色
        "#FFFF00", // 黄色
        "#00FFFF", // 青色
        "#FF00FF", // 紫色
        "#FFFFFF", // 白色
      ],
      colorToiletGate: "",
      colorNurseGate: "",
    };
  },
  async mounted() {
    let deptInfo = JSON.parse(window.localStorage.getItem("deptInfo"));
    deptInfo.deptId = this.$route.query.deptId || deptInfo.deptId
    let list = [];

    //护理级别列表
    let levelRes = await API.nursingLevel({ nurseUnitId: deptInfo.deptId });
    console.log(levelRes);
    if (levelRes.status == 200) {
      list = levelRes.data;
    }

    let selectDept = JSON.parse(localStorage.getItem('orgInfo'))
    let doorRes = await doorAPI.doorLight(deptInfo.deptId, selectDept.orgId);
    console.log(doorRes);
    if (doorRes.status == 200) {
      this.colorList = doorRes.data.ywhColorLevelGate;
      this.colorToiletGate = doorRes.data.ywhColorToiletGate;
      this.colorNurseGate = doorRes.data.ywhColorNurseGate;
    }

    list.forEach((item) => {
      item.color = this.onGetColorByLevelId(item.nurseLevelId);
    });

    this.levelList = list;
  },
  components: {},
  methods: {
    onNavBack() {
      this.$router.go(-1);
    },
    //保存
    async onSave() {
      this.saveLoading = true;
      let deptInfo = JSON.parse(window.localStorage.getItem("deptInfo"));
      deptInfo.deptId = this.$route.query.deptId || deptInfo.deptId
      let saveData = {
        ywhColorToiletGate:this.colorToiletGate,
        ywhColorNurseGate:this.colorNurseGate,
        ywhColorLevelGate:this.levelList
      }
      let res = await doorAPI.saveDoorLight({
        nurseUnitId: deptInfo.deptId, // 护理单元ID
        config: JSON.stringify(saveData), // 配置内容
      });
      this.$message({
        message: "保存成功！",
        type: "success",
      });
      this.saveLoading = false;
    },
    //根据级别id获取对应颜色
    onGetColorByLevelId(levelId) {
      let res = "";
      this.colorList.forEach((item) => {
        if (item.nurseLevelId == levelId) res = item.color ? item.color : '#ffffff';
      });
      return res;
    },
    // 返回父级
    goParent () {
      let deptInfo = JSON.parse(window.localStorage.getItem("deptInfo"));
      deptInfo.deptId = this.$route.query.deptId || deptInfo.deptId
      this.$router.push({ name: this.$route.query.parentName, params: { deptId: deptInfo.deptId } })
    },
  },
};
</script>
<style lang='scss' scoped>
.doorlamp-main-view {
  padding: 10px;
  box-sizing: border-box;
  min-height: 500px;

  .list {
    .item {
      padding: 10px;
      display: flex;
      align-items: center;

      .item-title {
        width: 200px;
        text-align: right;
        padding-right: 20px;
      }
    }
  }

  .control-btns {
    display: flex;
    padding: 30px 0;
    justify-content: center;
  }
}
</style>