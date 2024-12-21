<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component :is="name" :classify="classify" :rowData="rowData" @option-changed="changedOptionType" @refreshData="refresh" :ref="name"/>
    </keep-alive>
  </transition>
</template>

<script>
import list from './SignItem'
import sign_item_add from './SignItemAdd'
export default {
  name: 'sign_manage',
  data () {
    return {
      name: 'list',
      classify: [], // 体征分类
      rowData: {} // 体征row数据
    }
  },

  methods: {
    changedOptionType (name = 'list', classify = [], rowData = {}) {
      this.name = name
      this.classify = classify
      this.rowData = rowData
    },
    refresh () {
      this.$refs.list.getSignItemData()
    }

  },
  components: {
    sign_item_add, list
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/nrms/css/self_common";
  .right /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }
  .right /deep/ .el-tabs__content {
    position: absolute;
    top: 47px;
    left: 0;
    right: 0;
    bottom: 0;
    > div {
      height: 100%;
    }
  }
</style>
