<template>
  <div class="container">
    <el-tabs
      :value="activeName"
      @tab-click="handleClick"
      type="card"
      style="width: 100%"
    >
      <el-tab-pane :label="item.assName" :name="item.assId" :key="item.assId" v-for="item in tabList">
        <template v-if="activeName == item.assId">
          <checkList />
        </template>
        <template v-else>
          <inspectionList />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkList from './checkList.vue'
import inspectionList from './inspectionList.vue'

export default {
  name: 'tabs',
  async created () {
    try {
      this.activeName = this.tabList[0].assId
    } catch (error) {
    }
  },
  data () {
    return {
      activeName: '',
      tabList: [{
        assId: '0',
        assName: '检查'
      }, {
        assId: '1',
        assName: '检验'
      }]
    }
  },
  components: {
    checkList,
    inspectionList
  },
  methods: {
    handleClick (tab) {
    }
  }
}
</script>

<style  lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
.container {
  height: 100%;
  box-sizing: border-box;
}
</style>
<style lang="scss">
.right .el-tabs__content {
  top: 57px !important;
}
</style>
