<template>
  <el-form :inline="true" class="search-form" :v-model="form">
    <el-form-item label="科室:">
      <div style="width: 200px">
        <treeselect v-model="selectDeptId" :multiple="false" :options="dataTree2" @select="onSelect" :normalizer="normalizer" :default-expand-level="2" :clearable="false" placeholder="请选择科室" />
      </div>
    </el-form-item>
    <el-form-item label="姓名:">
      <el-input v-model="form.name" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="通讯录权限:">
      <div style="width: 200px">
        <treeselect v-model="form.selectedAddress" :multiple="false" :options="dataTree" :normalizer="normalizer" @select="AddressOnSelect" :clearable="true" :default-expand-level="2" placeholder="请选择" @input="inputChange" />
      </div>
    </el-form-item>
    <el-form-item>
      <div class="typt-search-btn">
        <el-button @click="search" type="primary" icon="el-icon-search" size="small">搜索</el-button>
        <el-button type="text" @click="reSearch">重置</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>
<script>
import { queryDeptTree } from "@/api/wnms/addressList/index.js";
import * as msgWarnApi from "@/api/wnms//msgManage/msgWarn";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import deptMixins from "@/assets/wnms/js/deptMixins.js";
export default {
  props: {},
  components: {
    Treeselect,
  },
  mixins: [deptMixins],
  data() {
    return {
      selectDeptId: null,
      dataTree: [],
      dataTree2: [],
      form: {
        name: "",
        deptId: "",
        liaisonAuth: "",
        selectedNode: "",
        selectedAddress: null,
      },
      addressList: [
        {
          name: "区域一",
          value: "1",
        },
        {
          name: "区域二",
          value: "2",
        },
        {
          name: "区域一",
          value: "3",
        },
      ],
      editIcon: require("@/assets/wnms/img/addressList/icon_search.png"),
      dataTree: [],
      defaultProps: {
        children: "children",
        label: "deptName",
      },
      selectNode: "",
    };
  },
  computed: {},
  mounted() {
    // 获取通讯录权限下拉框
    this.getTreeData();
    this.getdepts();
  },
  methods: {
    inputChange() {
      if (typeof this.form.selectedAddress == "undefined") {
        this.form.selectedAddress = null;
      }
    },
    /*获取护理单元*/
    async getdepts() {
      let res = await msgWarnApi.getdepts();
      if (res.status === 200 && res.data !== null) {
        this.dataTree2 = res.data.list;
        this.selectDeptId =
          this.getDefaultDeptInfo() || this.dataTree2[0].deptId;
        this.form.deptId = this.selectDeptId;
        console.log(this.selectDeptId);
        this.$emit("listSearch", this.form);
      }
    },
    AddressOnSelect(node, ins) {
      this.form.selectedAddress = node.deptName;
      this.form.liaisonAuth = node.id;
    },

    onSelect(node, ins) {
      this.selectDeptId = node.deptId;
      this.form.deptId = this.selectDeptId;
    },
    normalizer(node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined,
      };
    },
    getTreeData(para) {
      queryDeptTree(para)
        .then((res) => {
          if (res.status === 200) {
            this.dataTree = res.data;
          }
        })
        .catch((error) => {
          this.$message.error(JSON.stringify(error));
        });
    },
    // 搜索
    search() {
      this.form.liaisonAuth = this.form.selectedAddress;
      this.$emit("listSearch", this.form);
    },
    // 重置搜索
    reSearch() {
      this.form.name = "";
      this.form.selectedAddress = null;
      this.form.selectedNode = "";
      this.selectDeptId = this.dataTree2[0].deptId;
      this.form.deptId = this.selectDeptId;
      this.$emit("listSearch", { type: "reSearch", deptId: this.selectDeptId });
    },
    // handleNodeClickTree (ojb, node, ele) {
    //   this.form.selectedNode = ojb.deptName
    //   this.form.deptId = ojb.deptId
    // },
    handleNodeAddress(obj, node, ele) {
      this.form.selectedAddress = obj.deptName;
      this.form.liaisonAuth = obj.id;
    },
  },
};
</script>
<style lang="scss">
.address-search-tree {
  .el-tree-node {
    .el-tree-node__label {
      font-weight: normal;
    }
  }
}
</style>
<style scoped >
.search-form {
}
.resset-btn {
  display: inline-block;
  margin-left: 20px;
  border: none;
  color: #409eff;
  border-radius: 2px;
}
.el-input__inner {
  height: 35px !important;
  line-height: 35px !important;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #ffffff;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #ffffff !important;
}
</style>
