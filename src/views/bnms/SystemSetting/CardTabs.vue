<template>
  <div class="container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="护理级别" name="first" >
        <nurseLevel v-if="activeName === 'first'" v-on="$listeners"></nurseLevel>
      </el-tab-pane>

      <el-tab-pane label="医嘱字段" name="fourth" >
        <doctorFields v-if="activeName === 'fourth'" v-on="$listeners"></doctorFields>
      </el-tab-pane>

      <el-tab-pane label="腕带配置" name="second" >
        <wristbandSetting v-if="activeName === 'second'" v-on="$listeners"></wristbandSetting>
      </el-tab-pane>

      <el-tab-pane label="其他设置" name="third" >
        <nurseShiftSetting v-if="activeName === 'third'" v-on="$listeners"></nurseShiftSetting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import nurseLevel from './list'
import wristbandSetting from './WristbandSetting'
import nurseShiftSetting from './NurseShiftSetting'
import doctorFields from './doctorFields'

export default {
  name: 'card_tabs',
  props: ['actName'],
  inject: ['checkAuthority'],
  components: {
    nurseLevel,
    wristbandSetting,
    nurseShiftSetting,
    doctorFields
  },
  data () {
    return {
      activeName: 'first',
      nurseLevelFlag: '',
      wristbandSettingFlag: '',
      doctorFieldsFlag: '',
      nurseShiftSettingFlag: ''
    }
  },
  created () {
    this.checkAu()
    this.activeName = this.actName
  },
  methods: {
    checkAu () {
      this.nurseLevelFlag = this.checkAuthority('nurseLevel')
      this.wristbandSettingFlag = this.checkAuthority('wristbandSetting')
      this.doctorFieldsFlag = this.checkAuthority('doctorFields')
      this.nurseShiftSettingFlag = this.checkAuthority('nurseShiftSetting')

      if (this.nurseLevelFlag) {
        this.activeName = 'first'
      } else if (this.doctorFieldsFlag) {
        this.activeName = 'fourth'
      } else if (this.wristbandSettingFlag) {
        this.activeName = 'second'
      } else {
        this.activeName = 'third'
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";

  .container {
    height: 100%
  }

  .container /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }

  .container /deep/ .el-tabs__content {
    position: absolute;
    top: 55px;
    left: 0;
    right: 0;
    bottom: 0;
    // padding: 12px;

    > div {
      height: 100%;
      margin: 0;
      padding: 0;
    }
  }
</style>
