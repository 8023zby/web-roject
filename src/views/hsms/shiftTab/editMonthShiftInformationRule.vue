<template>
  <!--医护排班-排班规则-月-->
  <div class="typt-list-container" v-loading="loading">
    <!--列表-->
    <div style="overflow: scroll;">
    <table cellpadding="0" cellspacing="0" border="0" class="table-class">
      <tr>
        <td v-for="(item, index) in weekData" :key="index" class="tit_th">{{item}}</td>
      </tr>
      <tr v-for="(item, index) in tableData" :key="index" :class="{'tit_striped': index%2 === 0}">
        <td v-for="(v, k) in item" :key="k"
            :class="{'tit_th' : (v.id + '').indexOf('month') > -1, 'tit_td' : (v.id + '').indexOf('month') == -1}">
          <month-shift :lastDay="lastDay"
                       :firstDay="firstDay"
                       @dealSelData="dealSelData"
                       @dealSelFocus="dealSelFocus"
                       :data="v"
                       :flag="selectShow"
                       :row="index"
                       :col="k"
                       :ref="k + '-' + index"
                       :id="k + '-' + index"
                       :userData="userData" />
        </td>
      </tr>
    </table>
    </div>

    <div style="height: 10px"></div>
    <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv" style="height: 50px;">
      <el-button v-uni="'ysyuepaibanguize_edit_cancel'" @click="refresh" style="width: 70px;height: 40px;">取消</el-button>
      <el-button v-uni="'ysyuepaibanguize_edit_save'" type="primary" @click="saveData" :loading="addVis" style="width: 70px;height: 40px;">保存</el-button>
    </div>
    <div style="height: 20px;"></div>
    <!--end-->
  </div>
</template>

<script>
import MonthShiftInformation from '../../../assets/hsms/mixins/MonthShiftInformation'
import MonthShift from '../../../components/hsms/MonthShift'
import SetConfig from '../../../components/hsms/SetConfig'
import DutyTypeSet from '../../../assets/hsms/mixins/DutyTypeSet'
import { DateFormate, filterData } from '../../../assets/hsms/unitils/unitils'
import { AxiosJsonApi, GetDuty, GetNurseUser } from '../../../api/hsms'
import { ResultMsg } from '../../../assets/hsms/js/Message'

export default {
  name: 'NurseMonthShiftInformationRule',
  components: {
    'month-shift': MonthShift,
    'set-config': SetConfig
  },
  // inject: ['tabRefresh', 'getBusinessType'],
  mixins: [MonthShiftInformation, DutyTypeSet],
  data () {
    return {
      businessType: '',
      firstDay: 0,
      lastDay: 0,
      searchDate: new Date(),
      userData: [],
      modelName: '排班',
      monthData: [],
      dutyData: [],
      typeStr: 'rule',
      formSearchData: {
        beginDate: '',
        endDate: '',
        businessType: 'DOCTOR'
      },
      url: '/hsms/web-hs/rule',
      weekData: ['星期', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      select: {
        id: ''
      }
    }
  },
  // 初始化
  created () {
    this.businessType = this.$route.params.businessType || 'DOCTOR'
    this.formSearchData.businessType = this.getBusinessType()
    this.getNurseUser()
    this.getDuty()
    this.selectShow = true
  },
  mounted () {
    console.log('mounted')
    let that = this
    window.addEventListener('scroll', function (e) {
      that.scrollFunc()
    }, true)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollFunc)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollFunc)
  },
  methods: {
    scrollFunc () {
      let headerTop = 140
      if (this.select === undefined || this.select === null || this.select === '') {
        return false
      }
      let ref = this.$refs[this.select.id][0] || null
      console.log(ref)
      $('.el-select-dropdown').each(function (e) {
        if ($(this).css('display') === 'none') {
        } else {
          let elSelectDropdown = this
          let elSelectDropdownOffsetTop = elSelectDropdown.offsetTop
          if (+elSelectDropdownOffsetTop <= +headerTop) {
            console.log('小于了')
            ref && ref.blur()
          }
        }
      })
    },
    getBusinessType () {
      return this.businessType
    },
    // 处理时间数据
    initMonth () {
      let curTime = DateFormate.getNowFormatDate(new Date())
      // 本月天数
      let monthDays = DateFormate.getMonDays(curTime)
      let year = curTime.substr(0, 4)
      let month = curTime.substr(5, 2)
      // 本月第一天是周几
      let firstDay = DateFormate.getFirstDay(year, month)
      if (firstDay === 0) {
        firstDay = 7
      }
      let temp = []
      let data = []
      let monStart = []
      let monEnd = []
      // 计算该月常规数据
      for (let i = firstDay; i < monthDays + firstDay; i++) {
        let day = (i + 1) - firstDay
        if (day < 10) {
          day = '0' + day
        }
        temp.push({
          id: 'month-' + (i + 1 - firstDay),
          val: i, // (i + 1) - firstDay, // `${month}-${day}`,//(i + 1) - firstDay,
          title: `${month}-${day}`,
          dateId: +day,
          dateId1: i,
          name: i // `${year}-${month}-${day}`
        })
        if (i % 7 === 0) {
          data.push(temp)
          temp = []
        }
        if (i === monthDays + firstDay - 1 && temp.length > 0) {
          data.push(temp)
        }
      }
      if (firstDay !== 0) {
        // 月头补齐
        for (let i = 1; i < firstDay; i++) {
          monStart.push({
            id: 'month-' + i,
            dateId: i,
            dateId1: i,
            val: '',
            name: 'YH_EMPTY'
          })
        }
        // 月末补齐
        for (let i = data[data.length - 1].length; i < 7; i++) {
          monEnd.push({
            id: 'month-' + (monthDays + (i + 1) - firstDay),
            val: '',
            dateId1: (monthDays + (i + 1) - firstDay),
            dateId: (monthDays + (i + 1) - firstDay),
            name: 'YH_EMPTY'
          })
        }
        data[0] = [...monStart, ...data[0]]
        data[data.length - 1] = [...data[data.length - 1], ...monEnd]
      }
      this.monthData = data
      this.firstDay = firstDay
      this.lastDay = monthDays + firstDay - 1
      console.log(this.firstDay, this.lastDay)
      this.getData()
    },
    // 刷新页面
    refresh () {
      // this.tabRefresh('first', this.setParam.setFormData.scheduleMode)
      this.reloadUrl1()
    },
    // 形成日期数据
    initWeekData () {
      let curTime = DateFormate.getNowFormatDate(this.searchDate)
      this.formSearchData.beginDate = DateFormate.getSunDay(0, curTime)
      this.formSearchData.endDate = DateFormate.getSunDay(6, curTime)
      this.initMonth()
    },
    // 保存
    saveData () {
      let tempData = this.selectedData
      let saveData = []
      let shiftId = ''
      let shiftName = ''
      tempData.forEach((item) => {
        for (let i = 0; i < item.length; i++) {
          if (i === 0) {
            shiftId = item[i].name
            shiftName = item[i].val
          }
          item[i].id = item[i].id + ''
          if (item[i].id.indexOf('month') > -1 || item[i].id.indexOf('tit') > -1 || item[i].id.indexOf('YH_EMPTY') > -1 || item[i].name === '') {
            continue
          }

          item[i].id = +item[i].id - +this.firstDay + 1
          // console.log(item[i].id);
          saveData.push({
            accountId: item[i].name,
            dutyWeek: item[i].dateId,
            accountName: item[i].val,
            shiftId: shiftId,
            shiftName: shiftName,
            sort: item[i].sort
          })
        }
      })
      this.saveDataDo1({ data: saveData }, 'add', {}, false)
    },
    // 保存数据
    saveDataDo1 (data, act, params = {}, isOne = true) {
      let methodType = 'POST'
      let actMsg = '添加'
      let addData
      if (!act) {
        act = 'add'
      }
      if (act === 'add') {
        addData = filterData(data)
      } else if (act === 'modify') {
        methodType = 'PUT'
        actMsg = '修改'
        addData = data
      }
      this.addVis = true
      AxiosJsonApi(this.url + '/' + this.formSearchData.businessType, addData, methodType, params).then(res => {
        if (isOne) {
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl1)
        } else {
          // ResultMsg(res, actMsg + this.modelName, this.refresh)
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl1)
        }
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
    // 返回
    reloadUrl1 () {
      // let businessType = this.businessType || this.formSearchData.businessType
      // this.$emit('option-changed', 'list', { businessType: businessType })
      this.$emit('changed', 'list')
    },
    // 查询
    onSearchSubmit () {
      this.selectShow = false
      this.initWeekData()
    },
    // 获取班次
    getDuty () {
      GetDuty(this.formSearchData.businessType).then(res => {
        this.dutyData = res
        this.initMonth()
      })
    },
    // 获取用户
    getNurseUser () {
      GetNurseUser(this.formSearchData.businessType).then(res => {
        this.userData = res
      })
    },
    // 处理选择数据
    dealSelData (item, row, col) {
      this.selectedData[row][col].val = item.empName
      this.selectedData[row][col].name = item.empId
    },
    dealSelFocus (id) {
      this.select.id = id
    }
  }
}
</script>

<style scoped lang="scss">
  .shift-button {
    width: 80px;
    height: 28px;
    text-align: center;
    padding: 6px 0 !important;
    border-radius: 2px !important;
  }

  /deep/.el-dialog__wrapper .el-dialog__footer .el-button--default,
  .el-dialog__wrapper .el-dialog__footer .el-button--primary {
    border-radius: 0 !important;
  }

  .typt-list-container .el-button--small {
    padding: 12px 20px !important;
  }

  .btnDiv {
    text-align: center;
    margin: 10px;
  }

  .table-class {
    width: 100%;

    .tit_striped td {
      background: #FAFAFA;
    }

    .tit_th {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #333333;
      background: #F8F8F8;
      font-size: 16px;
      font-family: 'MicrosoftYaHei';
      border-top: 1px solid #EBEBEB;
    }

    .tit_td {
      text-align: center;
      height: 50px;
      line-height: 50px;
      width: 12%;
      font-size: 16px;
      color: #666666;
      background: #ffffff;
      font-family: 'MicrosoftYaHei';
      border-top: 1px solid #EBEBEB;
    }
  }

  .action_div {
    text-align: right;
    position: relative;
    padding-right: 20px;

    .model_cls {
      position: absolute;
      right: 240px;
      font-size: 14px;
      width: 150px;
      color: #666666;
      top: 5px;
    }
  }
</style>
