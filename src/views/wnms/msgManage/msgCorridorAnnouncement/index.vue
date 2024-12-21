<!--
  文件描述：走廊公告
  创建时间：2021/10/6 9:00
  创建人：pcl
-->
<template>
  <div class="typt-list-main tab-bussiness-message">
    <el-tabs v-model="activeName" @tab-click="handleClickTab" type="card" class="typt-list-container" ref="tabs">

      <template v-for="(item,index) in list">
        <el-tab-pane :label="item.name" :name="item.type" :key="index" v-if="item.isShow">
          <component :is="optionType" @transfer="transfer"></component>
        </el-tab-pane>
      </template>
      <!-- <el-tab-pane label="液晶显示屏公告" name="0" v-if="showLcdTable">
        <led-table ref="reflcdTab" @transfer="transfer" />
      </el-tab-pane>
      <el-tab-pane label="点阵显示屏公告" name="1" v-if="showLedTable">
        <lattice-table ref="refledTab" @transfer="transfer" />
      </el-tab-pane>
      <el-tab-pane label="分机公告" name="2" ref="refannouncementTab">
        <extension-addorEdit></extension-addorEdit>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import ledTable from "./led-table";
import latticeTable from "./lattice-table";
import extensionAddorEdit from "./extension-addorEdit";
import * as csmsManageApi from "@/api/wnms/msgManage/csmsManage";
import { selectDeptInfo } from "@/assets/wnms/utils/common";

export default {
  name: "index",
  // import引入的组件需要注入到对象中才能使用
  components: {
    ledTable,
    latticeTable,
    extensionAddorEdit
  },
  // 混入
  mixins: [],
  // 传参
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data() {
    // 这里存放数据
    return {
      optionType: "",
      // tab 激活项
      activeName: "",
      // 按钮是否禁用
      isBtnDisabled: false,
      // 对话框是否显示
      isDialogVisible: false,
      showLcdTable: false, // 是否显示液晶显示公告
      showLedTable: false, // 是否显示点阵屏示公告
      selectDeptId: selectDeptInfo(), // 当前护理单元
      list: []
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 方法集合
  methods: {
    // 转接员（父子组件）
    transfer(optionType, detail) {
      detail.activeName = this.activeName;
      this.$emit("option-changed", optionType, detail);
    },
    // 切换 tab
    handleClickTab(tab, event) {
      this.$nextTick(() => {
        this.optionType = tab.$options.propsData.name;
        // this.$refs.refDcTable.showVisible = true;
      });
    },
    showTabs(value) {
      this.$nextTick(() => {
        if (this.detail && this.detail.activeName) {
          this.activeName = this.detail.activeName;
        } else this.activeName = value;
      });
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    let _this = this;
    csmsManageApi
      .getDeviceType({ deptId: this.selectDeptId })
      .then(res => {
        if (res.status === 200 && res.data) {
          if (res.status === 200 && res.data) {
            let { LedCount, LcdCount } = res.data;

            this.list = [];
            // 点阵是LED 液晶显示屏LCD
            if (LedCount == 0 && LcdCount == 0) {
              _this.$router.push({ path: "/noDevice" });
            } else {
              if (LcdCount > 0) {
                _this.list.push({
                  key: "0",
                  name: "液晶显示屏公告",
                  isShow: true,
                  type: "ledTable"
                });
              }
              if (LedCount > 0) {
                _this.list.push({
                  key: "1",
                  name: "点阵显示屏公告",
                  isShow: true,
                  type: "latticeTable"
                });
              }
              this.$nextTick(() => {
                if (this.list.length > 0) {
                  _this.activeName = this.list[0].type;
                  _this.optionType = this.list[0].type;
                }
              });
            }
          }
        }
      })
      .catch(e => {});
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang="scss">
//@import url(); 引入公共css类
.tab-bussiness-message {
  overflow: hidden;
  .el-tabs__header {
    margin-top: 15px;
    .el-tabs__nav-wrap {
      margin-left: 18px;
    }
  }
  .el-tabs__content {
    height: 96%;
    overflow: hidden;
    .el-tab-pane {
      height: 99%;
      overflow: hidden;
    }
  }
}
</style>
