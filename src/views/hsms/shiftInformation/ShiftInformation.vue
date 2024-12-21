<template>
  <!--护士医生-排班流水-本周排班-->
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" :model="formSearchData" class="demo-form-inline" ref="formSearch">
      <el-form-item label="查询类型:">
        <el-select v-model="searchType" @change="selectChanged" style="width: 182px;height: 34px;" placeholder="请选择查询类型" size="small">
          <el-option label="按周查询" value="week" />
          <el-option label="按天查询" value="day" />
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" v-if="searchType === 'week'">
        <el-button v-uni="'yspaibanliushui_shangyizhou'" class="shift-search" type="success" @click="weekSearch('last')" size="small">上一周</el-button>
        <el-button v-uni="'yspaibanliushui_benzhou'" class="shift-search" type="success" @click="weekSearch('cur')" size="small">本周</el-button>
        <el-button v-uni="'yspaibanliushui_xiayizhou'" class="shift-search" type="success" @click="weekSearch('next')" size="small">下一周</el-button>
      </el-form-item>
      <el-form-item label-width="0" v-if="searchType === 'day'">
        <el-date-picker v-model="searchDate" type="date" :clearable="false" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" class="el-button-radius shift-search" icon="el-icon-search" @click="onSearchSubmit" size="small" v-uni="'yspaibanliushui_search'">搜索
          </el-button>
          <el-button v-uni="'yspaibanliushui_reset'" type="text" @click="refresh">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr />
    <div class="typt-list-add-div" style="padding-top: 13px;">
      <div class="action_div">
        <el-button-group>
          <el-button class="shift-search" v-if="formSearchData.businessType == 'DOCTOR'" type="primary" size="small" v-uni="'yspaibanliushui_setting'" @click="showSet()">设置
          </el-button>
          <el-button v-uni="'yspaibanliushui_userOrder'" class="shift-button" type="primary" size="small" @click="sortData()">用户排序</el-button>
          <el-button v-uni="'yspaibanliushui_copy'" class="shift-button" type="primary" size="small" @click="copyData()">复制排班</el-button>
          <el-button v-uni="'yspaibanliushui_edit'" class="shift-button" type="primary" size="small" @click="setDutyWeek()">编辑排班</el-button>
          <el-button class="shift-button" type="success" size="small" v-uni="'yspaibanliushui_print'" @click="printData()">打印</el-button>
          <el-button class="shift-button" v-uni="'yspaibanliushui_export'" v-if="exportDesc" type="primary" size="small" @click="exportShow()" disabled>
            导出
          </el-button>
          <el-button v-uni="'yspaibanliushui_export2'" class="shift-button" v-if="!exportDesc" type="primary" size="small" @click="exportShow()">导出
          </el-button>
        </el-button-group>
        <div class="model_cls" v-if="formSearchData.businessType === 'DOCTOR'">当前模式:<span>{{setParam.modelObj[setParam.modelType]}}</span>
        </div>
      </div>
    </div>
    <!--end-->
    <!--列表-->
    <el-table style="border-top: 1px solid #EBEEF5;" :data="tableData" :stripe="CONFIG.table.stripe" v-loading="loading" height="100%" :cell-style="cellStyle" v-if="tableVis">
      <el-table-column align="center" prop="empKey" show-overflow-tooltip label="工号" />
      <el-table-column align="center" prop="accountName" show-overflow-tooltip label="姓名" />
      <el-table-column v-for="(item,index) in weekData" :key="index" :render-header="renderHeader" align="center" :prop="item.id" :label="item.name">
        <template slot-scope="scope">
          <shift-manage @dealSelData="dealSelData" :srcData="scope.row" :col="index" :row="scope.$index" :dutyColor="dutyColor" :dataId="item.id" :flag="selectShow" :dutyData="dutyData" />
        </template>
      </el-table-column>
    </el-table>
    <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv">
      <el-button v-uni="'yspaibanliushui_cancel'" @click="refresh">取消</el-button>
      <el-button v-uni="'yspaibanliushui_save'" type="primary" @click="saveData" :loading="addVis">保存</el-button>
    </div>
    <!--导入-->
    <el-dialog :title="exportData.typeStr === 'export' ? '导出' : '打印'" :visible.sync="exportData.exportFlag" width="400px" :show-close="false" :close-on-click-modal="false">
      <el-form label-width="0px">
        <el-form-item v-if="formSearchData.businessType === 'NURSE'">
          <el-radio v-model="exportData.exportSelect" label="SHIFT_BED_NOTE">{{'班次+' + exportData.export_tit + '+备注'}}
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-if="formSearchData.businessType === 'NURSE'" v-model="exportData.exportSelect" label="SHIFT_BED">
            {{'班次+' + exportData.export_tit}}
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="exportData.exportSelect" label="SHIFT_NOTE">班次+备注</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="exportData.exportSelect" label="SHIFT">班次</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'yspaibanliushui_export_cancel'" @click="cancelPrintAdd">取消</el-button>
        <el-button v-uni="'yspaibanliushui_export_save'" type="primary" @click="printDo">确认</el-button>
      </div>
      <div style="height: 20px;"></div>
    </el-dialog>
    <!--end-->
    <!--设置-->
    <el-dialog title="设置" :visible.sync="setParam.setFormVisible" :show-close="false" width="460px" :close-on-click-modal="false">
      <set-config :data="setParam.getSetData.scheduleMode" @dealSetData="dealSetData" />
      <div slot="footer" class="dialog-footer" style="margin-top: -15px;padding-bottom: 5px;">
        <el-button v-uni="'yspaibanliushui_setting_cancel'" @click="cancelSetAdd">取消</el-button>
        <el-button v-uni="'yspaibanliushui_setting_save'" type="primary" @click="saveSetData" :loading="addVis">确认</el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!----用户排序------>
    <el-dialog class="iframe" title="排序" :visible.sync="userVisible" width="800px" height="480px" :close-on-click-modal="false" @close="refresh">
      <user-sort :typeStr="formSearchData.businessType" />
    </el-dialog>
  </div>
</template>

<script>
import ShiftInformation from '../../../assets/hsms/mixins/ShiftInformation'
import ShiftManage from '../../../components/hsms/ShiftManager'
import SetConfig from '../../../components/hsms/SetConfig'
import UserSort from '../../../components/hsms/UserSort'
import DutyTypeSet from '../../../assets/hsms/mixins/DutyTypeSet'
import { DateFormate } from '../../../assets/hsms/unitils/unitils'
import { GetDuty, GetNurseUser, GetRemark, GetBed, GetRoom, GetModelType,ExportSchedule } from '../../../api/hsms'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseShiftInformation',
  components: {
    'shift-manage': ShiftManage,
    'user-sort': UserSort,
    'set-config': SetConfig
  },
  inject: ['tabRefresh', 'getBusinessType'],
  mixins: [ShiftInformation, DutyTypeSet, config],
  data () {
    return {
      userVisible: false,
      exportData: {
        exportFlag: false,
        exportType: 'export',
        exportSelect: 'SHIFT_NOTE',
        exportTypeObj: {},
        typeStr: '',
        export_tit: '床位号'
      },
      bedObj: {},
      roomObj: {},
      searchType: 'week',
      curTime: '',
      searchDate: '',
      dutyColor: {},
      remarkData: [],
      weekVal: new Date().getTime(),
      modelName: '排班',
      weekData: [],
      modelType: 'BED',
      formSearchData: {
        beginDate: '',
        endDate: '',
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/schedule'
    }
  },
  // 初始化
  created () {
    this.formSearchData.businessType = this.getBusinessType()
    this.getNurseUser()
    this.getDuty()
    this.getModel()
    // this.onSearchSubmit();
  },
  methods: {
    // 编辑跳全页
    setDutyWeek () {
      let detail = {
        formSearchData: this.formSearchData,
        searchType: this.searchType,
        searchDate: this.searchDate,
        weekVal: this.weekVal

      }
      this.$emit('changed', 'addWeek', detail)
    },
    // 设置单元格样式
    cellStyle (row) {
      // console.log(row);
      let columnIndex = row.columnIndex
      if (columnIndex === 0 || columnIndex === 1) {
        return ''
      }
      let rowIndex = row.rowIndex
      // let date = this.weekData[columnIndex - 1].id
      let date = this.weekData[columnIndex - 2].id
      let shiftId = this.tableData[rowIndex][`${date}__shiftId`]
      if (shiftId === '' || !this.dutyColor[shiftId]) {
        return ''
      } else {
        return `background: ${this.dutyColor[shiftId].backgroundColor}; color:${this.dutyColor[shiftId].foregroundColor};`
      }
    },
    // 请求备注信息
    getRemark () {
      let week = ''
      let month = ''
      if (this.searchType === 'day') {
        week = ''
        month = parseInt(this.curTime.substr(5, 2))
      } else {
        week = DateFormate.getWeekOfYear(this.curTime)
        month = ''
      }
      let param = {
        businessType: this.formSearchData.businessType,
        year: this.curTime.substr(0, 4),
        month: month,
        week: week
      }
      GetRemark(param, this.formSearchData.businessType).then(res => {
        this.remarkData = res
      })
    },
    selectChanged (val) {
      // console.log(this.weekVal)
      // console.log(DateFormate.getNowFormatDate(new Date(this.weekVal)))
      if (val === 'day') {
        this.searchDate = DateFormate.getNowFormatDate(new Date(this.weekVal))// moment().format('YYYY-MM-DD')
      }
    },
    // 护士排序
    sortData () {
      this.userVisible = true
    },
    // 刷新页面
    refresh () {
      this.tabRefresh('second', this.setParam.setFormData.scheduleMode)
    },
    // 标题头样式
    renderHeader (h, { column }) {
      let v = column.label
      let arr = v.split('<br/>')
      return h('div', { style: 'line-height:20px;' }, [
        h('span', arr[0]),
        h('br'),
        h('span', arr[1])
      ])
    },
    // 返回周一到周日
    getCurWeek (time) {
      let d = DateFormate.getMonDate(time)
      let arr = []
      for (let i = 0; i < 7; i++) {
        let Y = d.getFullYear()
        let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1)
        let D = (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
        arr.push({
          id: Y + '-' + M + '-' + D,
          // name: Y + '年' + M + '月' + D + '日 <br/>（' + DateFormate.getDayName(d.getDay()) + '）',
          name: M + '-' + D + ' <br/>' + DateFormate.getDayName(d.getDay()) + '',
          date: (d.getMonth() + 1) + '-' + d.getDate(),
          week: DateFormate.getDayName(d.getDay())
        })
        d.setDate(d.getDate() + 1)
      }
      return arr
    },
    // 形成日期数据
    initWeekData () {
      let curTime = ''
      if (this.searchType === 'day') {
        curTime = this.searchDate
      } else {
        curTime = DateFormate.getNowFormatDate(new Date(this.weekVal))
      }
      // console.log(curTime);
      this.curTime = curTime
      this.formSearchData.beginDate = DateFormate.getSunDay(0, curTime)
      this.formSearchData.endDate = DateFormate.getSunDay(6, curTime)
      this.weekData = this.getCurWeek(curTime)
      // console.log(this.weekData);
    },
    // 取消打印
    cancelPrintAdd () {
      this.exportData.exportFlag = false
    },
    // 按周查询
    weekSearch (type) {
      switch (type) {
        case 'last' :
          this.weekVal = this.weekVal - 7 * 24 * 60 * 60 * 1000
          break
        case 'cur' :
          this.weekVal = new Date().getTime()
          break
        case 'next' :
          this.weekVal = this.weekVal + 7 * 24 * 60 * 60 * 1000
          break
      }
      this.onSearchSubmit()
    },
    // 保存
    saveData () {
      let params = {}
      params = {
        beginDate: this.formSearchData.beginDate,
        endDate: this.formSearchData.endDate
      }
      // console.log(JSON.stringify(this.selectedData))
      this.saveDataDo({ data: this.selectedData }, 'add', params, false)
    },
    // 获取床位
    getBed () {
      GetBed().then(res => {
        res.forEach((item, index) => {
          this.bedObj[item.bedId] = item.bedName
        })
      })
    },
    // 获取房间
    getRoom () {
      GetRoom().then(res => {
        res.forEach((item, index) => {
          this.roomObj[item.roomId] = item.roomName
        })
      })
    },
    // 获取模式
    getModel () {
      GetModelType(this.formSearchData.businessType).then(res => {
        let type = 'BED'
        if (res) {
          type = res.nurseMode
        }
        this.modelType = type
        if (type === 'ROOM') {
          this.exportData.export_tit = '房间号'
          this.getRoom()
        } else {
          this.getBed()
        }
      })
    },
    // 打印
    printData () {
      if (this.flag === true) {
        this.$message.error('请先对本周排班进行编辑保存，再进行打印操作。')
        return
      }
      this.exportData.exportFlag = true
      this.exportData.exportSelect = 'SHIFT_NOTE'
      this.exportData.typeStr = 'print'
    },
    // 处理打印数据
    printDo () {
      if (this.exportData.typeStr === 'export') {
        this.exportDo()
        return
      }
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
          week: item.week
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
          if (this.modelType === 'BED') {
            bedList.forEach((v, i) => {
              if (this.bedObj[v.objId]) {
                bedStr += this.bedObj[v.objId] + ','
              }
            })
          } else {
            bedList.forEach((v, i) => {
              if (this.roomObj[v.objId]) {
                bedStr += this.roomObj[v.objId] + ','
              }
            })
          }
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
    exportShow () {
      if (this.flag === true) {
        this.$message.error('请先对本周排班进行编辑保存，再进行导出操作。')
        return
      }
      this.exportData.exportFlag = true
      this.exportData.exportSelect = 'SHIFT_NOTE'
      this.exportData.typeStr = 'export'
    },
    // 导出
    async  exportDo () {
      this.cancelPrintAdd()
      let week = ''
      let month
      if (this.searchType === 'day') {
        week = DateFormate.getWeekOfYear(this.curTime)
        month = ''
      } else {
        week = DateFormate.getWeekOfYear(this.curTime)
        month = ''
      }
      try {
        let res = await ExportSchedule(this.formSearchData.businessType, this.exportData.exportSelect, this.curTime.substr(0, 4), week, month, '')
        if (res.status == '500') {
          return this.$message.error(res.desc)
        }
      } catch (error) {
      }
      window.open(`http://${window.location.host}/hsms/web-hs/schedule/${this.formSearchData.businessType}/export?businessType=${this.formSearchData.businessType}&exportKey=${this.exportData.exportSelect}&year=${this.curTime.substr(0, 4)}&week=${week}&month=${month}`)
    },
    // 查询
    onSearchSubmit () {
      this.selectShow = false
      this.initWeekData()
      this.tableData = []
      this.selectedData = []
      this.getData()
      this.getRemark()
    },
    // 获取班次
    getDuty () {
      GetDuty(this.formSearchData.businessType).then(res => {
        this.dutyData = res
        res.forEach((item, index) => {
          this.dutyColor[item.shiftId] = {
            foregroundColor: item.foregroundColor,
            backgroundColor: item.backgroundColor
          }
        })
      })
    },
    // 获取用户
    getNurseUser () {
      GetNurseUser(this.formSearchData.businessType).then(res => {
        this.userData = res
        this.onSearchSubmit()
      })
    },
    // 处理选择数据
    dealSelData (item, index) {
      this.selectedData[index] = item
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/hsms/css/self_common";

.btnDiv {
  text-align: center;
  margin-top: 10px;
}

.action_div {
  text-align: right;
  position: relative;
  padding-right: 20px;

  .model_cls {
    position: absolute;
    right: 610px;
    font-size: 14px;
    top: 5px;
    width: 150px;
  }
}

.shift-search {
  width: 80px;
  height: 28px;
  text-align: center;
  padding: 6px 0 !important;
  border-radius: 2px !important;
}

.shift-button {
  width: 80px;
  height: 28px;
  text-align: center;
  padding: 6px 0 !important;
  margin-left: 20px !important;
  border-radius: 2px !important;
}

/deep/ .el-dialog__wrapper .el-dialog__footer .el-button--default,
.el-dialog__wrapper .el-dialog__footer .el-button--primary {
  border-radius: 0 !important;
}

.dialog-footer .el-button--small {
  padding: 12px 20px !important;
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #e6e6e6 !important;
}

/deep/ .iframe .el-dialog__body {
  padding: 0 !important;
}

/deep/ .el-table__header {
  border-top: none;
}
</style>
