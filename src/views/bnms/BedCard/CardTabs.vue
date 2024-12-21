<template>
  <div class="container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="患者详情" name="first">
        <card_detail v-if="activeName == 'first'" v-uni="'huanzhexiangqing_close'" :patientDetail="patientDetail" @close="close"/>
      </el-tab-pane>
      <el-tab-pane label="患者动态" name="second">
        <patient_dynamics v-if="activeName=='second'" v-uni="'huanzhedongtai_close'"  :patientDetail="patientDetail" @close="close"></patient_dynamics>
      </el-tab-pane>
      <el-tab-pane label="腕带打印" name="third">
        <wristband_printing v-if="activeName=='third'" :patientDetail="patientDetail" @close="close"  v-uni="'wandaidayin_close'"/>
      </el-tab-pane>
    </el-tabs>
    <div class="tool-bar">
      <el-button type="primary" v-uni="'chuangweiyilan_tabs_fanhui'" @click="close">返回</el-button>
    </div>
  </div>
</template>

<script>
import WristbandPrinting from './WristbandPrinting.vue'
export default {
  name: 'card_tabs',
  data () {
    return {
      activeName: 'first'
    }
  },
  props: ['patientDetail'],
  components: {
    'card_detail': () => import('./CardDetail.vue'),
    'patient_dynamics': () => import('./PatientDynamics.vue'),
    'wristband_printing': WristbandPrinting
  },
  methods: {
    close () {
      this.$emit('changed', 'list')
    }
  }
}
</script>

<style  lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
  .container {
    height: 100%;
    position: relative;
  }
.tool-bar{
  display: inline-block;
  position: absolute;
  top: 9px;
  right: 12px;
  padding: 0;
}
  .container /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }
  .container /deep/ .el-tabs__content {
    position: absolute;
    top: 60px;
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
