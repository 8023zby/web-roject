<template>
  <div class="container">
    <div class="rightBtn">
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <el-tabs :value="activeName" @tab-click="handleClick" type="card" style="width: 100%">
      <el-tab-pane label="体温" name="first" lazy>
        <temperature_chart v-bind="$attrs" v-on="$listeners" ref="temperature_chart"/>
      </el-tab-pane>
      <el-tab-pane label="脉搏" name="second" style="overflow: auto" lazy>
        <pulse_chart v-bind="$attrs" v-on="$listeners"  ref="pluse"/>
      </el-tab-pane>
      <el-tab-pane label="呼吸" name="third" style="overflow: auto" lazy>
        <breath_chart v-bind="$attrs" v-on="$listeners" />
      </el-tab-pane>
      <el-tab-pane label="血压" name="fourth" lazy>
        <blood_chart v-bind="$attrs" v-on="$listeners" />
      </el-tab-pane>
      <el-tab-pane label="疼痛" name="five" lazy>
        <tengtong_chart v-bind="$attrs" v-on="$listeners" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'charts',
    data () {
      return {
        activeName: "first",
        patient: {},
        patientType: 0
      }
    },
    components: {
      'temperature_chart': () => import("./temperature_chart"),
      'pulse_chart': () => import("./pulse_chart"),
      'breath_chart': () => import("./breath_chart"),
      'blood_chart': () => import("./blood_chart"),
      'tengtong_chart': () => import("./tengtong_chart")
    },
    methods:{
      handleClick(tab) {
      },
      back(){
        this.$emit('option-changed', 'list')
      }
    },
  }
</script>

<style  lang="scss" type="text/scss" scoped>
  .container {
    height: 100%;
    position:relative;
  }
.rightBtn{
  position: absolute;
  top: 12px;
  right: 20px;
  width: auto;
  z-index:1000;
  /deep/.el-button--primary{
    border-radius: 2px !important;
    min-width: 78px;
  }
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
    > div {
      height: 100%;
      margin: 0;
      padding: 0;
    }
  }
</style>
