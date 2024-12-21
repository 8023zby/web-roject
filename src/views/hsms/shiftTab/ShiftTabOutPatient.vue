<template>
  <div class="typt-list-container" style="overflow: hidden">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card" style="height: 100%;" class="hsms-shift-tab">
      <el-tab-pane label="排班规则" name="first">
        <router-view v-if="firstFlag" :name="weekOrMonthRule"></router-view>
      </el-tab-pane>
      <el-tab-pane label="排班流水" name="second">
        <router-view v-if="secondFlag" :name="weekOrMonth"></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { GetModelType } from '../../../api/hsms'

  export default {
    name: 'NurseShiftTabOutPatient',
    provide () {
      return {
        tabRefresh: this.reload,
        getBusinessType: this.getBusinessType
      }
    },
    data () {
      return {
        businessType: '',
        scheduleMode: 'WEEK',
        activeName: 'first',
        weekOrMonth: 'nurseShiftInformation',
        weekOrMonthRule: 'nurseShiftInformationRule',
        firstFlag: true,
        secondFlag: false
      }
    },
    created () {
      let businessType = this.$route.params.businessType || 'NURSE'
      this.businessType = businessType
      this.getModelType()
    },
    methods: {
      reload (act, scheduleMode = 'WEEK') {
        this.scheduleMode = scheduleMode
        if (act === 'first') {
          if (this.businessType === 'DOCTOR') {
            if (scheduleMode === 'WEEK') {
              this.weekOrMonthRule = 'nurseShiftInformationRule'
            } else if (scheduleMode === 'MONTH') {
              this.weekOrMonthRule = 'nurseMonthShiftInformationRule'
            }
          }
          this.firstFlag = false
          this.$nextTick(function () {
            this.firstFlag = true
          })
        } else if (act === 'second') {
          if (this.businessType === 'DOCTOR') {
            if (scheduleMode === 'WEEK') {
              this.weekOrMonth = 'nurseShiftInformation'
            } else if (scheduleMode === 'MONTH') {
              this.weekOrMonth = 'nurseMonthShiftInformation'
            }
          }
          this.secondFlag = false
          this.$nextTick(function () {
            this.secondFlag = true
          })
        }
      },
      // 获取类型
      getBusinessType () {
        return this.businessType
      },
      // 获取模式
      getModelType () {
        GetModelType().then(res => {
          if (res) {
            let scheduleMode = res.scheduleMode || 'WEEK'
            this.scheduleMode = scheduleMode
            if (this.businessType === 'DOCTOR') {
              if (scheduleMode === 'WEEK') {
                this.weekOrMonth = 'nurseShiftInformation'
                this.weekOrMonthRule = 'nurseShiftInformationRule'
              } else if (scheduleMode === 'MONTH') {
                this.weekOrMonth = 'nurseMonthShiftInformation'
                this.weekOrMonthRule = 'nurseMonthShiftInformationRule'
              }
            }
          }
        })
      },
      // 点击事件
      handleClick (tab) {
        this.reload(tab.name, this.scheduleMode)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .hsms-shift-tab {
    .el-tab-pane {
      height: 90%;
      overflow: auto;
    }

    .el-tabs__content {
      height: 100%;
      overflow: auto;
    }
  }
</style>
