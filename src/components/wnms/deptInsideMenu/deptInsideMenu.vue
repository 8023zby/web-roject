<!--
    部门选择与内部锚点菜单
    主要用于各终端配置内
 -->
<template>
  <div class="deptinsidemenu-view" v-if="!disabled || anchorList.length > 0">
    <div class="deptinsidemenu-item-select" v-if="!disabled">
      <div class="deptinsidemenu-item-select-view">
        <div class="deptinsidemenu-item-select-title">科室：</div>
        <treeselect :clearable="false" v-model="value" :multiple="false" :options="options" :normalizer="normalizer" @select="onSelect" :default-expand-level="2" :disabled="disabled" placeholder="请选择科室" />
      </div>
      <div class="deptinsidemenu-item-select-desc">当前页如有更改，请保存后再切换科室</div>
    </div>
    <div class="deptinsidemenu-item-view" v-if="anchorList.length > 0">
      <div class="deptinsidemenu-item" v-for="(item, index) in anchorList" :key="index" @click="onAnchor(item.src)">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as API from "@/api/wnms/msgManage/msgWarn.js";
import deptMixins from "@/assets/wnms/js/deptMixins.js";

export default {
  data() {
    return {
      value: null,
      options: [],
    };
  },
  mixins: [deptMixins],
  components: { Treeselect },
  computed: {},
  watch: {},
  props: {
    anchorList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    deptId: {
      type: String,
      default: "",
    },
    loadData: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    normalizer(node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined,
      };
    },
    onSelect(node, ins) {
      this.$emit("dataInit", node.deptId);
    },
    onAnchor(id) {
      document.querySelector(`#${id}`).scrollIntoView(true);
      document.querySelector(
        `#${id}`
      ).parentElement.parentElement.parentElement.parentElement.scrollTop =
        document.querySelector(`#${id}`).parentElement.parentElement
          .parentElement.parentElement.scrollTop - 90;
    },
  },
  created() {},
  async mounted() {
    let res = await API.getdepts();
    if (res.status == 200) {
      this.options = res.data.list;
      // this.value =
      //   this.getDefaultDeptInfo({ follow: true }) == "default"
      //     ? this.getDefaultDeptInfo() || this.deptData[0].id
      //     : this.getDefaultDeptInfo({ follow: true }) || this.deptData[0].id;
      console.log( this.getDefaultDeptInfo({ follow: true, notdefault: true }))
      this.value =
        this.getDefaultDeptInfo({ follow: true, notdefault: true }) ||
        this.options[0].deptId;

      if (this.loadData) this.$emit("dataInit", this.value);
    }
  },
};
</script>
<style lang='scss' scoped>
.deptinsidemenu-view {
  display: flex;
  position: sticky;
  top: -20px;
  z-index: 10;
  background-color: #fff;
  padding: 15px 0;
}

.deptinsidemenu-item-view {
  border: 1px solid #409eff;
  border-radius: 4px;
  display: flex;
  background-color: #fff;
  height: 33px;
}

.deptinsidemenu-item {
  padding: 6px 15px;
  color: #409eff;
  border-right: 1px solid #409eff;
  cursor: pointer;
}

.deptinsidemenu-item:last-child {
  border: none !important;
}
.deptinsidemenu-item-select {
  width: 330px;
  padding: 0 10px 0 0;
}
.deptinsidemenu-item-select-view {
  display: flex;
}
.deptinsidemenu-item-select-title {
  width: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.deptinsidemenu-item-select-desc {
  font-size: 14px;
  color: #888;
  padding: 5px 0 0 50px;
}
</style>
