<template>
  <!--护士医生-排班流水-本月排班-->
  <div class="typt-list-container" v-loading="loading">
    <!--查询-->
    <el-form  :inline="true" :model="formSearchData" class="demo-form-inline" ref="formSearch">
      <el-form-item label="查询日期：">
        <el-date-picker
          style="width: 182px;height: 34px;"
          size="small"
          v-model="searchDate"
          type="date"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" class="el-button-radius shift-search" v-uni="'ysyuepaiban_search'"
                     icon="el-icon-search" @click="onSearchSubmit" size="small">搜索
          </el-button>
          <el-button type="text" @click="reloadMain" v-uni="'ysyuepaiban_reset'">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr/>
    <div class="typt-list-add-div" style="padding-bottom: 13px;">
      <div class="action_div">
        <el-button-group>
          <el-button class="shift-search"
          v-uni="'ysyuepaiban_setting'"
                     v-if="formSearchData.businessType == 'DOCTOR'"
                     type="primary" size="small" @click="showSet()">设置
          </el-button>
          <el-button class="shift-button" type="primary" v-uni="'ysyuepaiban_edit'" size="small" @click="showSetMonth()">编辑排班</el-button>
          <!--<el-button type="primary" size="small" @click="printData()">打印</el-button>-->
          <el-button v-uni="'ysyuepaiban_export'" class="shift-button" v-if="exportDesc" type="primary" size="small" @click="exportDo()" disabled>导出</el-button>
          <el-button v-uni="'ysyuepaiban_export2'" class="shift-button" v-if="!exportDesc" type="primary" size="small" @click="exportDo()">导出</el-button>
        </el-button-group>
        <div class="model_cls"
             v-if="formSearchData.businessType=='DOCTOR'">当前模式：<span>{{setParam.modelObj[setParam.modelType]}}</span>
        </div>
      </div>
    </div>
    <!--end-->
    <hr/>

    <!--列表-->
    <div style="overflow: scroll;">
    <table cellpadding="0" cellspacing="0" border="0" style="overflow: scroll;" class="table-class">
      <tr>
        <td v-for="(item, index) in weekData" :key="index" class="tit_th">{{item}}</td>
      </tr>
      <tr v-for="(item, index) in tableData" :key="index" :class="{'tit_striped': index%2 === 0}">
        <td v-for="(v, k) in item" :key="k"
            :class="{'tit_th' : (v.id + '').indexOf('month') > -1, 'tit_td' : (v.id + '').indexOf('month') == -1}">
          <month-shift :lastDay="lastDay"
                       :firstDay="firstDay"
                       @dealSelData="dealSelData"
                       :data="v"
                       :flag="selectShow"
                       :row="index"
                       :col="k"
                       :userData="userData" />
        </td>
      </tr>
    </table>
    </div>

    <div style="height: 10px"></div>
    <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv">
      <el-button v-uni="'ysyuepaiban_cancel'" @click="refresh">取消</el-button>
      <el-button v-uni="'ysyuepaiban_save'" type="primary" @click="saveData">确认</el-button>
    </div>
    <div style="height: 20px;"></div>
    <!--end-->
    <!--设置-->
    <el-dialog title="设置" :visible.sync="setParam.setFormVisible"
               :show-close="false" width="460px"
               :close-on-click-modal="false">
      <set-config :data="setParam.getSetData.scheduleMode" @dealSetData="dealSetData" />
      <div slot="footer" class="dialog-footer"
           style="margin-top: -15px;padding-bottom: 5px;padding-top: 0;">
        <el-button @click="cancelSetAdd" v-uni="'ysyuepaiban_setting_cancel'">取消</el-button>
        <el-button type="primary" @click="saveSetData"  v-uni="'ysyuepaiban_setting_save'" :loading="addVis">确认</el-button>
      </div>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
import MonthShiftInformation from '../../../assets/hsms/mixins/MonthShiftInformation'
import MonthShift from '../../../components/hsms/MonthShift'
import SetConfig from '../../../components/hsms/SetConfig'
import DutyTypeSet from '../../../assets/hsms/mixins/DutyTypeSet'
import { DateFormate } from '../../../assets/hsms/unitils/unitils'
import { GetDuty, GetNurseUser, GetRemark } from '../../../api/hsms'

export default {
  name: 'NurseMonthShiftInformation',
  components: {
    'month-shift': MonthShift,
    'set-config': SetConfig
  },
  inject: ['tabRefresh', 'getBusinessType'],
  mixins: [MonthShiftInformation, DutyTypeSet],
  data () {
    return {
      lastDay: 0,
      searchDate: new Date(),
      remarkData: [],
      weekData: ['星期', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      userData: [],
      modelName: '排班',
      monthData: [],
      dutyData: [],
      firstDay: 0,
      formSearchData: {
        beginDate: '',
        endDate: '',
        businessType: 'DOCTOR'
      },
      url: '/hsms/web-hs/schedule'
    }
  },
  // 初始化
  created () {
    this.formSearchData.businessType = this.getBusinessType()
    this.getNurseUser()
    this.getDuty()
    // this.onSearchSubmit()
  },
  methods: {
    // 编辑跳全页
    showSetMonth () {
      // console.log(this.searchDate);
      let detail = {
        searchDate: this.searchDate
      }
      this.$emit('changed', 'addMonth', detail)
    },
    // 处理时间数据
    initMonth () {
      let curTime = DateFormate.getNowFormatDate(this.searchDate)
      let monthDays = DateFormate.getMonDays(curTime)
      let year = curTime.substr(0, 4)
      let month = curTime.substr(5, 2)
      let firstDay = DateFormate.getFirstDay(year, month)
      let temp = []
      let data = []
      let monStart = []
      let monEnd = []
      if (firstDay === 0) {
        firstDay = 7
      }
      // 计算该月常规数据
      for (let i = firstDay; i < monthDays + firstDay; i++) {
        let day = (i + 1) - firstDay
        if (day < 10) {
          day = '0' + day
        }
        temp.push({
          id: 'month-' + (i + 1 - firstDay),
          val: (i + 1) - firstDay,
          title: `${month}-${day}`,
          dateId: i,
          name: `${year}-${month}-${day}`
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
            val: '',
            name: 'YH_EMPTY'
          })
        }
        // 月末补齐
        for (let i = data[data.length - 1].length; i < 7; i++) {
          monEnd.push({
            id: 'month-' + (monthDays + (i + 1) - firstDay),
            val: '',
            dateId: (monthDays + (i + 1) - firstDay),
            name: 'YH_EMPTY'
          })
        }
        data[0] = [...monStart, ...data[0]]
        data[data.length - 1] = [...data[data.length - 1], ...monEnd]
      }
      this.tableData = []
      this.firstDay = firstDay
      this.lastDay = monthDays + firstDay - 1
      this.monthData = data
      this.getData()
    },
    // 请求备注信息
    getRemark () {
      let curTime = DateFormate.getNowFormatDate(this.searchDate)
      GetRemark({
        businessType: this.formSearchData.businessType,
        year: curTime.substr(0, 4),
        month: parseInt(curTime.substr(5, 2))
      }).then(res => {
        this.remarkData = res
      })
    },
    // 刷新页面
    refresh () {
      this.tabRefresh('second', this.setParam.setFormData.scheduleMode)
    },
    // 形成日期数据
    initWeekData () {
      // console.log(this.searchDate);
      let curTime = DateFormate.getNowFormatDate(this.searchDate)
      this.formSearchData.beginDate = curTime.substr(0, 7) + '-01'
      this.formSearchData.endDate = curTime.substr(0, 7) + '-' + DateFormate.getMonDays(curTime)
      this.initMonth()
    },
    // 保存
    saveData () {
      let params = {
        beginDate: this.formSearchData.beginDate,
        endDate: this.formSearchData.endDate
      }
      let tempData = this.selectedData
      let saveData = []
      let shiftId = ''
      let shiftName = ''
      tempData.forEach((item, index) => {
        for (let i = 0; i < item.length; i++) {
          if (i === 0) {
            shiftId = item[i].name
            shiftName = item[i].val
          }
          if (item[i].id.indexOf('month') > -1 || item[i].id.indexOf('tit') > -1 || item[i].id.indexOf('YH_EMPTY') > -1 || item[i].name === '') {
            continue
          }
          saveData.push({
            accountId: item[i].name,
            dutyDate: item[i].id,
            accountName: item[i].val,
            shiftId: shiftId,
            shiftName: shiftName,
            sort: item[i].sort
          })
        }
      })
      this.saveDataDo({ data: saveData }, 'add', params, false)
    },
    // 打印
    printData () {
      this.exportData.exportFlag = true
      this.exportData.exportSelect = 'SHIFT_NOTE'
    },
    // 处理打印数据
    printDo () {
      let obj = {}
      let thead = [{
        name: '序号'
      }, {
        name: '姓名'
      }]
      let tbody = []
      let temp = []
      let bedList = []
      let bedStr = ''
      this.weekData.forEach((item, index) => {
        thead.push({
          name: item.date,
          week: item.week.replace('星期', '')
        })
      })
      this.tableData.forEach((val, key) => {
        temp.push({
          name: key + 1
        })
        temp.push({
          name: val.accountName,
          remark: '',
          level: ''
        })
        this.weekData.forEach((item, index) => {
          bedList = val[item.id + '__bedList'] || []
          bedStr = ''
          bedList.forEach((v, i) => {
            if (this.bedObj[v.objId]) {
              bedStr += this.bedObj[v.objId] + ','
            }
          })
          temp.push({
            name: val[item.id],
            bedNoList: bedStr.substr(0, bedStr.length - 1)
          })
        })
        tbody.push(temp)
        temp = []
      })
      obj['thead'] = thead
      obj['tbody'] = tbody
      obj['remarkData'] = this.remarkData
      localStorage.setItem('printType', this.exportData.exportSelect)
      localStorage.setItem('tableData', JSON.stringify(obj))
      window.open(`${window.location.origin}/#/shiftInformationPrint`)
    },
    // 导出
    exportDo () {
      let curTime = DateFormate.getNowFormatDate(this.searchDate)
      let month = parseInt(curTime.substr(5, 2))
      let year = parseInt(curTime.substr(0, 4))
      window.open(`http://${window.location.host}/hsms/web-hs/schedule/${this.formSearchData.businessType}/export?businessType=${this.formSearchData.businessType}&exportKey=SHIFT&year=${year}&month=${month}`)
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
        this.initWeekData()
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
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../../assets/hsms/css/self_common";

  .shift-button {
    width: 80px;
    height: 28px;
    text-align: center;
    padding: 6px 0 !important;
    margin-left: 20px !important;
    border-radius: 2px !important;
  }

  .shift-search {
    width: 80px;
    height: 28px;
    text-align: center;
    padding: 6px 0 !important;
    border-radius: 2px !important;
  }

  .btnDiv {
    text-align: center;
    margin-top: 10px;
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
      font-size: 14px;
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
      right: 320px;
      width: 150px;
      font-size: 14px;
      color: #666666;
      top: 5px;
    }
  }

  /deep/.el-dialog__wrapper .el-dialog__footer .el-button--default,
  .el-dialog__wrapper .el-dialog__footer .el-button--primary {
    border-radius: 0 !important;
  }

  .dialog-footer .el-button--small {
    padding: 12px 20px !important;
  }
</style>
