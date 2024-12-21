<template>
  <div class="container">
    <el-tabs
      :value="activeName"
      @tab-click="handleClick"
      type="card"
      style="width: 100%"
    >
      <template v-for="(item, index) in sign_tab">
        <el-tab-pane
          :label="item.signItemShowName"
          :name="'active' + index"
          :key="index"
          v-if="item.signItemShowName && (item.syncA10 || item.syncSignDevice)"
        >
          <SignItem
            v-bind="$attrs"
            v-on="$listeners"
            :signItem="item"
            :key="index"
            :ref="`active${index}`"
          ></SignItem>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { ApiSignBodyItem } from '../../../api/nrms/index'
export default {
  name: 'tabs',
  data () {
    return {
      activeName: 'active0',
      sign_tab: [],
      search_form: {
        displayInBodyConditionWeb: 1,
        deptId: ''
      }
    }
  },
  components: {
    SignItem: () => import('./List')
  },
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.search_form.deptId = deptInfo.deptId || ''
    this.getSignTabs() // 获取tab
  },
  methods: {
    handleClick (tab) {
      this.activeName = tab.name
      this.$refs[`active${tab.index}`][0].reLayout()
    },
    getSignTabs () { // 获取tabs内容
      ApiSignBodyItem.selectTh(this.search_form)
        .then((res) => {
          let data = res.data || []
          this.sign_tab = data
          console.log('sign_tab', this.sign_tab)
        })
        .catch((res) => {
          this.$message.error(res.message)
        })
    }
  }
}
</script>

<style  lang="scss" type="text/scss" scoped>
.container {
  height: 100%;
}

.container /deep/ .el-tabs {
  height: 100%;
  position: relative;
}
.container /deep/ .el-tabs__content {
  > div {
    height: 100%;
    margin: 0;
    padding: 0;
  }
}
</style>
