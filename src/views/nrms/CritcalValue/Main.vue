<template>
  <layout>
    <div slot="main" class="right" style="position:relative;">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="/tabs/">
          <component
            :is="name"
            :patientType="patientType"
            :patient="patient"
            @option-changed="changedOptionType"
            @batch-sign="batchSignJump"
          />
        </keep-alive>
      </transition>
      <router-view />
    </div>
  </layout>
</template>

<script>
import layout from '../../../components/nrms/layout/aside'
import list from './tabs'
// import add from './TemperatureSheet/BatchSign'
export default {
  name: 'sign_manage',
  data () {
    return {
      name: 'list',
      activeName: 'first',
      patient: {},
      patientType: 0,
      nodeData: {}
    }
  },
  methods: {
    changedOptionType (name = 'list', data = {}) {
      this.nodeData = data
      this.name = name
    },
    // 体征批量录入页面跳转
    batchSignJump (data) {
      this.$emit('main-option-changed', data)
    }
  },
  components: {
    layout,
    list
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
