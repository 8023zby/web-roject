<template>
  <div class="container">
    <el-tabs :value="activeName" @tab-click="handleClick" type="card" style="width: 100%">
      <el-tab-pane label="体征项字典" name="first">
        <SignItem v-bind="$attrs" v-on="$listeners" ref="sign_item_ref"></SignItem>
      </el-tab-pane>
      <el-tab-pane label="体征项分类" name="second" style="overflow: auto">
        <SignClassify v-bind="$attrs" v-on="$listeners" ref="sign_classify_ref" ></SignClassify>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data () {
    return {
      activeName: 'first',
      patient: {},
      patientType: 0
    }
  },
  components: {
    SignItem: () => import('./SignItem'),
    SignClassify: () => import('./SettingItem')
  },
  activated () {
    this.reLayoutSign()
    this.reLayoutClassify()
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'first') {
        this.reLayoutSign()
      } else {
        this.reLayoutClassify()
      }
    },
    reLayoutSign () {
      this.$nextTick(function () {
        this.$refs.sign_item_ref && this.$refs.sign_item_ref.reload()
        this.$refs.sign_item_ref && this.$refs.sign_item_ref.getSignItemData()
      })
    },
    reLayoutClassify () {
      this.$nextTick(function () {
        this.$refs.sign_classify_ref && this.$refs.sign_classify_ref.reload()
      })
    }
  }
}
</script>

<style  lang="scss" type="text/scss" scoped>
  .container {
    height: 100%
  }

  .container /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }
  .container /deep/ .el-tabs__content {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    bottom: 0;
    > div {
      height: 100%;
      margin: 0;
      padding: 0;
    }
  }
</style>
