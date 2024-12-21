<template>
  <div class="typt-list-main tab-bussiness-message">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClickTab"
      type="card"
      class="typt-list-container"
    >
      <el-tab-pane label="餐厅食堂" name="0">
        <dc-table v-if="activeTabIndex==0" ref="refDcTable" @transfer="transfer" />
      </el-tab-pane>
      <el-tab-pane label="商超便利" name="1">
        <dc-table v-if="activeTabIndex==1" ref="refDcTable" @transfer="transfer" />
      </el-tab-pane>
      <el-tab-pane label="护工中心" name="2">
        <dc-table v-if="activeTabIndex==2" ref="refDcTable" @transfer="transfer" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DcTable from './table'

export default {
  components: {
    'dc-table': DcTable
  },
  data () {
    return {
      // tab 激活项
      activeTabIndex: '0',
      activeName: '0',
      // 按钮是否禁用
      isBtnDisabled: false,
      // 对话框是否显示
      isDialogVisible: false
    }
  },
  methods: {
    // 转接员（父子组件）
    transfer (optionType, detail) {
      this.$emit('option-changed', optionType, detail)
    },
    // 切换 tab
    handleClickTab (tab, event) {
      this.activeTabIndex = tab.index
      this.$nextTick(() => {
        this.$refs.refDcTable.tabIndex = this.activeTabIndex
        this.$refs.refDcTable.showVisible = true
      })
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="scss">
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
