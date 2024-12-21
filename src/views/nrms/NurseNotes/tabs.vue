<template>
  <div class="container">
    <layout-aside v-loading="loading">
      <div slot="aside">
        <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0"/>
      </div>
      <div slot="main" class="right note_list">
        <el-tabs :value="activeName" @tab-click="handleClick" type="card" style="height: 100%; ">
          <template v-for="(item,index) in formListObj">
            <el-tab-pane :label="item.formName" :name="item.formName" :key="index" lazy>
              <!-- 脉氧仪测验单====单独走组件 -->
             <MaiyangList v-if="item.formCode === 'H-000010-WHJ-0022'" :patient="patient" :formId="formListObj[item.formName].formId" :formCode="formListObj[item.formName].formCode" v-on="$listeners" :ref="`active${item.formName}`"></MaiyangList>
             <FormList :patient="patient" :formId="formListObj[item.formName].formId" :formCode="formListObj[item.formName].formCode" :remarks="formListObj[item.formName].remarks" v-on="$listeners" :ref="`active${item.formName}`"></FormList>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </layout-aside>
  </div>
</template>

<script>
import layoutAside from '../../../components/nrms/layout/aside'
import PatientList from '../../../components/nrms/PatientList'
import { ApiAutoForm } from '../../../api/nrms'
export default {
  name: 'tabs',
  data () {
    return {
      loading: false,
      activeName: '', // 默认一般护理记录单
      patient: {},
      patientType: 0,
      // 表头id与表类别
      formObj: {
        formType: 1
      },
      formListObj: {}
    }
  },
  components: {
    PatientList,
    layoutAside,
    FormList: () => import('./List'),
    MaiyangList: () => import('./MaiyangList/List')
  },
  created () {
    this.getFormInfo()
  },
  activated () {
  },
  methods: {
    initPatient (patient, type) {
      this.patient = patient
      this.$set(this.patient, 'patientType', type)
    },
    getFormInfo () {
      ApiAutoForm.getFormDictByType({ formType: this.formObj.formType }).then((res) => {
        if (res.data == null || res.data.length === 0) {
          this.$message.error('请先配置以及应用表单')
        } else {
          let list = res.data
          this.formListObj = {}
          list.map(item => {
            this.formListObj[item.formName] = item
          })
          console.log(this.formListObj)
          this.activeName = res.data[0].formName || ''
        }
      })
    },
    handleClick (tab) {
      this.activeName = tab.name
      // this.$nextTick(function () {
      //   this.$refs['active' + tab.name][0].reLayout()
      // })
    }
  }
}
</script>

<style  lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
  .container {
    height: 100%
  }
  .note_list /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }

  .note_list /deep/ .el-tabs__content {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    bottom: 0;

    > div {
      height: 100%;
    }
  }
</style>
