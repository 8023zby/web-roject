<template>
  <div class="nrms-pad-container" style="height: 100%;width: 100%">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%;height: 100%">
      <el-tab-pane label="检查报告" name="first" style="width: 100%;height: 100%">
        <inspection-report :patientId="patientId" v-if="activeName==='first'"></inspection-report>
      </el-tab-pane>
      <el-tab-pane label="检验结果" name="second">
        <examine-report :patientId="patientId" v-if="activeName==='second'"></examine-report>
      </el-tab-pane>
      <el-tab-pane label="体况列表" name="third">
        <body-condition :patientData="patientData" entryType="doctor" v-if="activeName==='third'" />
      </el-tab-pane>
      <el-tab-pane label="体征录入" name="four">
        <sign-input :patient="patientData" v-if="activeName==='four'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'pad_side_main',
  data () {
    return {
      activeName: 'first',
      patientData: {},
      patientId: ''
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
      this.patientId = this.patientData.patientId
      if (window.androida10 && window.androida10.getAndroidData) {
        let str = window.androida10.getAndroidData()
        let obj = JSON.parse(str)
        this.patientData = obj
        this.patientId = this.patientData.patientId
      }
    }
  },
  components: {
    'inspection-report': () => import('./views/inspectionReport/Main'),
    'examine-report': () => import('./views/examineReport/Main'),
    'sign-input': () => import('./views/SignInput/Main'),
    'body-condition': () => import('../Pad/views/BodyCondition/Main')
  }
}
</script>

<style lang="scss">
  @import "../../../assets/nrms/css/blood/padCss.scss";
</style>
