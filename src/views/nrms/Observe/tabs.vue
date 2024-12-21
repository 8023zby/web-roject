<template>
  <div class="container">
    <el-tabs
      :value="activeName"
      @tab-click="handleClick"
      type="card"
      style="width: 100%"
    >
      <el-tab-pane :label="item.assName" :name="item.assId" :key="item.assId" v-for="item in tabList">
        <template v-if="item.moduleId == '10016' || item.moduleId == '10022'">
          <pop-check v-if="item.moduleId == '10022'" :patient="patient" :patientType="patientType" :printSet="item.printType" :formStyle="item.assStyle" :formName="item.assName" :formCode="item.assCode"></pop-check>
          <pressure-score v-else :patient="patient" :patientType="patientType" :printSet="item.printType" :formStyle="item.assStyle" :formName="item.assName" :formCode="item.assCode"></pressure-score>
        </template>
        <template v-if="item.moduleId == '10017'">
          <deep-vein :patient="patient" :patientType="patientType" :printSet="item.printType" :formStyle="item.assStyle" :formName="item.assName" :formCode="item.assCode"></deep-vein>
        </template>
        <template v-if="item.moduleId == '10021'">
          <pain :patient="patient" :patientType="patientType" :printSet="item.printType" :formStyle="item.assStyle" :formName="item.assName" :formCode="item.assCode"></pain>
        </template>
        <template v-if="item.moduleId == '10023'">
          <blood-transfusion :patient="patient" :patientType="patientType" :printSet="item.printType" :formStyle="item.assStyle" :formName="item.assName" :formCode="item.assCode"></blood-transfusion>
        </template>
        <template v-if="item.moduleId == EModuleId.observeZhongxinYachuang || item.moduleId == EModuleId.observeZhongxinPiyan">
          <zhongxin :patient="patient" :patientType="patientType" :printSet="item.printType" :formStyle="item.assStyle" :formName="item.assName" :formCode="item.assCode"></zhongxin>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ApiAssManage } from '../../../api/nrms/index'
import { EAssClass, EModuleId } from '../../../assets/nrms/enum/formManage'
export default {
  name: 'tabs',
  props: ['patient', 'patientType'],
  async created () {
    try {
      let list = []
      await Promise.all(this.tabFormTypeList.map(async type => {
        let res = await ApiAssManage.assMangerList({
          assClass: type
        })
        list = list.concat(res.data)
      }))
      // let res = await ApiAutoForm.getFormDictByType({ formType: '5' })
      if (!list || !list.length) {
        this.$message.error('请先配置以及应用表单')
        return
      }
      this.tabList = list.sort((a, b) => new Date(a.createTime) - new Date(b.createTime))
      this.activeName = this.tabList[0].assId
    } catch (error) {
    }
  },
  data () {
    return {
      activeName: '',
      tabList: [],
      tabFormTypeList: ['3', '4', '5', '6', '7', EAssClass.observeZhongxin],
      EAssClass,
      EModuleId
    }
  },
  components: {
    PressureScore: () => import('./PressureScore.vue'),
    PopCheck: () => import('./PopCheck.vue'),
    DeepVein: () => import('./DeepVein.vue'),
    Pain: () => import('./Pain.vue'),
    BloodTransfusion: () => import('./BloodTransfusion.vue'),
    Zhongxin: () => import('./Zhongxin.vue')
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
