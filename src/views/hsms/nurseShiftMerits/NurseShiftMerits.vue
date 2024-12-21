<template>
  <!--护士排班-绩效考核-->
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" :model="formSearchData" class="demo-form-inline" ref="formSearch">
      <el-form-item label="月份:">
        <el-date-picker style="width: 182px;height: 34px;" prefix-icon="" @change="calMonth" clear-icon="el-icon-circle-close" size="small" v-model="searchDate" type="month" :clearable="false" value-format="yyyy-MM" placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" class="el-button-radius" icon="el-icon-search" @click="onSearchSubmit" size="small">搜索
          </el-button>
          <el-button type="text" @click="reloadMain">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr />
    <div class="typt-list-add-div">
      <div class="action_div">
        <span style="color: #333333;font-size: 14px;">当前月份:</span>
        <span style="color: #333333;font-size: 14px;">{{nowMonth}}</span>
        <span style="color: #333333;font-size: 14px;">月</span>
        <el-button type="primary" style="width: 110px;padding: 6px 0 !important;" size="small" @click="setDutyCoefficient()">班次系数设置
        </el-button>
        <el-button type="primary" size="small" @click="exportData()" style="width: 80px;">导出</el-button>
        <el-button type="success" size="small" @click="printData()" style="width: 80px;">打印</el-button>
      </div>
    </div>
    <!--end-->
    <!--列表-->
    <el-table :data="tableData" :stripe="CONFIG.table.stripe" v-loading="loading" height="80%">
      <el-table-column align="center" prop="accountName" label="姓名">
      </el-table-column>
      <el-table-column v-for="(item,index) in titData" :key="index" align="center" :render-header="renderHeader" :min-width="item.shiftName.length * 28" :prop="item.shiftId" show-overflow-tooltip :label="item.shiftName">
      </el-table-column>
    </el-table>
    <!----班次系数------>
    <el-dialog class="iframe" title="班次系数设置" :show-close="false" :visible.sync="coefficientVisible" width="800px" :close-on-click-modal="false" @close="reloadMain">
      <coefficient-set style="height: 565px;" v-if="viewFlag" @co-close="coClose" />
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import ShiftMerits from '../../../assets/hsms/mixins/ShiftMerits'
import { DateFormate } from '../../../assets/hsms/unitils/unitils'
import { GetDuty, GetNurseUser } from '../../../api/hsms'
import CoefficientSet from '../dutyCoefficient/Main'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseShiftMerits',
  mixins: [ShiftMerits, config],
  components: {
    CoefficientSet
  },
  provide () {
    return {
      viewRefresh: this.viewRefresh
    }
  },
  data () {
    return {
      banData: [],
      searchDate: new Date(),
      viewFlag: true,
      coefficientVisible: false,
      dutyData: [],
      modelName: '绩效核算',
      titData: [],
      userData: [],
      formSearchData: {
        year: '',
        month: '',
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/assessment',
      nowMonth: moment(this.searchDate).format('M')
    }
  },
  // 初始化
  created () {
    this.getUser()
  },
  methods: {
    // 标题头样式
    renderHeader (h, { column }) {
      let v = column.label
      // let width = v.length * 20// width: ' + width + 'px;
      return h('div', { style: 'line-height:20px;white-space: nowrap;' }, [
        v
      ])
    },
    viewRefresh () {
      this.viewFlag = false
      this.$nextTick(function () {
        this.viewFlag = true
      })
    },
    calMonth () {
      this.nowMonth = moment(this.searchDate).format('M')
    },
    // 形成日期数据
    initWeekData () {
      let curTime = this.searchDate
      if (typeof (this.searchDate) === 'object') {
        curTime = DateFormate.getNowFormatDate(this.searchDate)
      }
      this.formSearchData.month = curTime.substr(5, 2)
      this.formSearchData.year = curTime.substr(0, 4)
    },
    // 打印
    printData () {
      let obj = {}
      let thead = [{
        name: '序号'
      }, {
        name: '姓名'
      }]
      let tbody = []
      let temp = []
      this.titData.forEach((item, index) => {
        thead.push({
          name: item.shiftName
        })
      })
      this.tableData.forEach((val, key) => {
        temp.push({
          name: key + 1
        })
        temp.push({
          name: val.accountName
        })
        this.titData.forEach((item, index) => {
          temp.push({
            name: val[item.shiftId]
          })
        })
        tbody.push(temp)
        temp = []
      })
      obj['thead'] = thead
      obj['tbody'] = tbody
      localStorage.setItem('tableDataMerits', JSON.stringify(obj))
      localStorage.setItem('printFrom', 'merits')
      window.open(`${window.location.origin}/#/shiftMeritsPrint`)
    },
    // 导出
    exportData () {
      if (this.banData.length > 0) {
        window.open(`http://${window.location.host}/hsms/web-hs/assessment/${this.formSearchData.businessType}/export?businessType=NURSE&year=${this.formSearchData.year}&month=${this.formSearchData.month}`)
      } else {
        this.$message.warning('暂无数据，无需导出')
      }
    },
    // 查询
    onSearchSubmit () {
      this.initWeekData()
      this.tableData = []
      this.getData()
    },
    coClose () {
      console.log('coClose')
      this.coefficientVisible = false
    },
    // 刷新
    reload () {
      // console.log('router');
      this.$router.push('/nurseShiftMerits')
    },
    // 获取班次
    getDuty () {
      GetDuty(this.formSearchData.businessType).then(res => {
        this.dutyData = res
        let countArr = [{
          shiftId: 'hierarchyCoefficient',
          shiftName: '层级系数'
        }, {
          shiftId: 'qcCoefficient',
          shiftName: '质控'
        }, {
          shiftId: 'teachingCoefficient',
          shiftName: '带教'
        }, {
          shiftId: 'assessmentTotal',
          shiftName: '总分'
        }, {
          shiftId: 'attendanceCount',
          shiftName: '出勤天数'
        }, {
          shiftId: 'dutyState',
          shiftName: '出勤情况'
        }]
        this.titData = [...this.dutyData, ...countArr]
        this.onSearchSubmit()
      })
    },
    // 设置班次系数
    setDutyCoefficient () {
      this.coefficientVisible = true
    },
    // 获取用户
    getUser () {
      GetNurseUser(this.formSearchData.businessType).then(res => {
        this.userData = res
        this.getDuty()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/hsms/css/self_common";

.el-button--small {
  padding: 6px 16px !important;
  border-radius: 2px !important;
}

/deep/ .el-input--small .el-input__inner {
  /*width: 182px;*/
  /*height: 34px;*/
}

/deep/ .el-dialog__body {
  padding: 0 !important;
}

/deep/ .el-dialog__header {
  border-bottom: none !important;
}
</style>
