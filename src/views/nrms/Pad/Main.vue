<template>
  <div class="nrms-pad-container">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%">
      <el-tab-pane label="体温单" name="first">
        <TemperatureSheet :patientData="patientData" entryType="nurse" v-if="activeName==='first'" />
      </el-tab-pane>
      <el-tab-pane label="血糖单" name="second">
        <blood-sugar :patientData="patientData" v-if="activeName==='second'" />
      </el-tab-pane>
      <el-tab-pane label="出入量记录单" name="third">
        <in-out :patientData="patientData" v-if="activeName==='third'"/>
      </el-tab-pane>
      <el-tab-pane label="体况列表" name="four">
        <body-condition :patientData="patientData" entryType="nurse" v-if="activeName==='four'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'pad_main',
  data () {
    return {
      activeName: 'first',
      patientData: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleClick () {

    },
    // 调用安卓方法
    getData () {
      // type 1为医生 2 为护士
      let str = '{"orgId":"11c91f1a78c14018b4a3b7df3fe351e4","deptId":"71a618d1fd294244b0fee625cdcd1a89","nurseName":"张三","nurseId":"123","partId":"111","deptName":"内科","bedName":"1床","intoTime":"2019-08-07",' +
        '"patientId":"3232121","patientName":"陈文宗","patientSex":"男","patientAge":"18","intoNo":"13133112313","type":"2"}'
      let obj = JSON.parse(str)
      this.patientData = obj
      if (window.androida10 && window.androida10.getAndroidData) {
        let str = window.androida10.getAndroidData()
        let obj = JSON.parse(str)
        this.patientData = obj
      }
    }
  },
  components: {
    'blood-sugar': () => import('./views/BloodSugar/Main'),
    'in-out': () => import('./views/InOut/Main'),
    'TemperatureSheet': () => import('./views/TemperatureSheet/Main'),
    'body-condition': () => import('./views/BodyCondition/Main')
  }
}
</script>

<style lang="scss">
  @import "../../../assets/nrms/css/blood/padCss.scss";
</style>
