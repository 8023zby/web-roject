<template>
  <el-container>
  <el-aside width="auto" style="background: #fff;overflow: visible">
    <patient-list @initPatient="getPatInfo" :initRowIndex="0"></patient-list>
  </el-aside>
  <div class="typt-list-container">
    <div class="tabspane">
      <el-tabs v-model="activeName"  @tab-click="clickTab">
        <el-tab-pane label="全院宣教" name="first">
          <component
            v-if="activeName==='first'"
            :is="optionType"
            :detail="isWard"
            :patientInfo="patInfo"
            ref="childList"
          />
        </el-tab-pane>
        <el-tab-pane label="病区宣教" name="second">
          <component
            v-if="activeName==='second'"
            :is="optionType"
            :detail="isWard"
            :patientInfo="patInfo"
            ref="childList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  </el-container>
</template>
<script>
import list from './listRecord.vue'
import PatientList from '../../advices/PatientList'
export default {
  components: {
    list,
    'patient-list': PatientList
  },
  data () {
    return {
      activeName: 'first',
      optionType: 'list',
      patientId: '',
      isWard: { type: 0 },
      patInfo: {}
    }
  },
  methods: {
    // 获取患者id
    getPatInfo (row, type) {
      console.log(row)
      // 判断是否为切换tab动作，或者无相关(在院、转科、出院)患者
      if (row === null || row === '' || row === undefined || row === 'null') {
        this.patInfo['patientId'] = ''
        this.$refs.childList.clearData()
      } else if (this.patInfo['patientId'] !== row.patientId) {
        this.patInfo['patientId'] = row.patientId
        this.patInfo['deptId'] = row.deptId
        this.$refs.childList.executeQueryPage()
      }
    },
    clickGetList (val) {
      this.$nextTick(() => {
        this.isWard.type = val
        this.$refs.childList.executeQueryPage()
      })
    },
    clickTab (tab) {
      if (tab.index === '0') {
        this.isWard.type = 0
        if (this.patInfo['patientId'] === '' || this.patInfo['patientId'] === null || this.patInfo['patientId'] === undefined) {
          this.$message({
            message: '请先从左侧患者一览中选择要查看的患者',
            type: 'warning'
          })
        } else {
          // 调用子组件查询
          this.clickGetList(0)
        }
      } else if (tab.index === '1') {
        this.isWard.type = 1
        if (this.patInfo['patientId'] === '' || this.patInfo['patientId'] === null || this.patInfo['patientId'] === undefined) {
          this.$message({
            message: '请先从左侧患者一览中选择要查看的患者',
            type: 'warning'
          })
        } else {
          // 调用子组件查询
          this.clickGetList(1)
        }
      }
    }
  }
}
</script>
<style scoped>
.tabspane {
  margin: 10px;
}
</style>
