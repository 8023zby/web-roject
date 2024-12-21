<template>
    <div class="typt-list-container" style="overflow: hidden;">
        <el-tabs v-model="activeName"
                 class="hsms-shift-tab"
                 @tab-click="handleClick"
                 type="card"
                 style="height: 100%;">
            <el-tab-pane label="排班规则" name="first">
                <!--router-view v-if="firstFlag" :name="weekOrMonthRule" /-->
                <component :is="weekOrMonthRule" v-if="firstFlag" v-on="$listeners"/>
            </el-tab-pane>
            <el-tab-pane :label="secondLabel" name="second"><!--排班流水-->
                <!--router-view v-if="secondFlag" :name="weekOrMonth" /-->
                <component v-if="secondFlag" :is="weekOrMonth" v-on="$listeners"/>
            </el-tab-pane>
            <el-tab-pane v-if="businessType === 'NURSE'"
                         :label="bedOrRoom" name="third">
                <!--router-view v-if="thirdFlag" name="nurseDutyBed" /-->
                <component v-if="thirdFlag" is="nurseDutyBed" v-on="$listeners"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { GetModelType } from '../../../api/hsms'
import nurseShiftInformationRule from '../shiftInformationRule/ShiftInformationRule'
import nurseMonthShiftInformationRule from '../shiftInformationRule/MonthShiftInformationRule'
import nurseShiftInformation from '../shiftInformation/ShiftInformation'
import nurseMonthShiftInformation from '../shiftInformation/MonthShiftInformation'
import nurseDutyBed from '../dutyBed/DutyBed'

export default {
  name: 'NurseShiftTab',
  provide () {
    return {
      tabRefresh: this.reload,
      getBusinessType: this.getBusinessType
    }
  },
  components: {
    nurseShiftInformationRule, // : () => import('/shiftInformationRule/ShiftInformationRule.vue'),
    nurseMonthShiftInformationRule, // : () => import('/shiftInformationRule/MonthShiftInformationRule.vue'),
    nurseShiftInformation, // : () => import('/shiftInformation/ShiftInformation.vue'),
    nurseMonthShiftInformation, // : () => import('/hsms/shiftInformation/MonthShiftInformation.vue')
    nurseDutyBed // : () => import('../../views/hsms/dutyBed/DutyBed.vue'),
  },
  props: ['detail'],
  data () {
    return {
      bedOrRoom: '排床管理',
      businessType: '',
      scheduleMode: 'WEEK',
      activeName: 'first',
      weekOrMonth: 'nurseShiftInformation',
      weekOrMonthRule: 'nurseShiftInformationRule',
      firstFlag: true,
      secondFlag: false,
      thirdFlag: false,
      secondLabel: '本周排班'
    }
  },
  created () {
    if (this.detail === null) {

    } else {
      this.firstFlag = false
      this.secondFlag = true
      this.activeName = this.detail.activeName
    }
    this.businessType = this.$route.params.businessType || 'NURSE'
    this.getModelType()
  },
  methods: {
    reload (act, scheduleMode = 'WEEK') {
      this.scheduleMode = scheduleMode
      if (act === 'first') {
        if (this.businessType === 'DOCTOR') {
          if (scheduleMode === 'WEEK') {
            this.weekOrMonthRule = 'nurseShiftInformationRule'
            this.secondLabel = '本周排班'
          } else if (scheduleMode === 'MONTH') {
            this.weekOrMonthRule = 'nurseMonthShiftInformationRule'
            this.secondLabel = '本月排班'
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
            this.secondLabel = '本周排班'
          } else if (scheduleMode === 'MONTH') {
            this.weekOrMonth = 'nurseMonthShiftInformation'
            this.secondLabel = '本月排班'
          }
        }
        this.secondFlag = false
        this.$nextTick(function () {
          this.secondFlag = true
        })
      } else if (act === 'third') {
        this.thirdFlag = false
        this.$nextTick(function () {
          this.thirdFlag = true
        })
      }
    },
    /** 获取类型 */
    getBusinessType () {
      return this.businessType
    },
    /** 获取模式 */
    getModelType () {
      GetModelType(this.businessType).then(res => {
        if (res) {
          let type = res.nurseMode || 'BED'
          let scheduleMode = res.scheduleMode || 'WEEK'
          this.scheduleMode = scheduleMode
          if (this.businessType === 'DOCTOR') {
            if (scheduleMode === 'WEEK') {
              this.weekOrMonth = 'nurseShiftInformation'
              this.weekOrMonthRule = 'nurseShiftInformationRule'
              this.secondLabel = '本周排班'
            } else if (scheduleMode === 'MONTH') {
              this.weekOrMonth = 'nurseMonthShiftInformation'
              this.weekOrMonthRule = 'nurseMonthShiftInformationRule'
              this.secondLabel = '本月排班'
            }
          }
          if (type === 'ROOM') {
            this.bedOrRoom = '排房管理'
          } else {
            this.bedOrRoom = '排床管理'
          }
        }
      })
    },
    /** 点击事件 */
    handleClick (tab) {
      this.reload(tab.name, this.scheduleMode)
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "../../../assets/hsms/css/self_common";

    .hsms-shift-tab {
      display: flex;
      flex-direction: column;

        .el-tab-pane {
            height: 100%;
            overflow: auto;
        }

        /deep/ .el-tabs__content {
            height: 100%;
            overflow: auto;
          flex: 1;
        }

        /deep/ .el-tabs__header {
            margin: 0;
        }

        /deep/ .el-tabs__item {
            width: 160px;
            height: 36px;
            text-align: center;
            line-height: 36px;
        }

        /deep/ .el-tabs__nav {
            border-radius: 2px 2px 0 0 !important;
        }

    }
</style>
