<template>
  <div style="height: 100%">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="焦点内容" name="first">
        <list v-if="activeName==='first'" v-on="$listeners"></list>
      </el-tab-pane>
      <el-tab-pane label="焦点分类" name="second">
        <classify v-if="activeName==='second'"></classify>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import list from './List'
  import classify from './ClassifyList'
  export default {
    components: { list, classify },
    data () {
      return {
        activeName: 'first'
      }
    },
    methods: {

    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }

  /deep/ .el-tabs__content {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    bottom: 0;

    > div {
      height: 100%
    }
  }
</style>
