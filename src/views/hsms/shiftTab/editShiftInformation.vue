<template>
  <!--护士医生-排班流水-本周排班-->
  <div class="typt-list-container" v-loading="loading">
    <!--查询-->
    <el-form :inline="true"
             v-show="false"
             :model="formSearchData"
             class="demo-form-inline"
             ref="formSearch">
      <el-form-item label="查询类型：">
        <el-select v-model="searchType"
                   style="width: 182px;height: 34px;"
                   placeholder="请选择查询类型" size="small">
          <el-option label="按周查询" value="week"/>
          <el-option label="按天查询" value="day"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" v-if="searchType=='week'">
        <el-button class="shift-search" v-uni="'yszhoupaiban_shangyizhou'" type="success" @click="weekSearch('last')" size="small">上一周</el-button>
        <el-button class="shift-search" v-uni="'yszhoupaiban_benzhou'" type="success" @click="weekSearch('cur')" size="small">本周</el-button>
        <el-button class="shift-search" v-uni="'yszhoupaiban_xiayizhou'" type="success" @click="weekSearch('next')" size="small">下一周</el-button>
        <el-button class="shift-button" v-uni="'yszhoupaiban_edit'" type="primary" size="small" @click="setDuty()">编辑排班</el-button>
      </el-form-item>
      <el-form-item label-width="0" v-if="searchType=='day'">
        <el-date-picker
          v-model="searchDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" class="el-button-radius shift-search"
                     icon="el-icon-search" @click="onSearchSubmit" v-uni="'yszhoupaiban_search'" size="small">搜索
          </el-button>
          <el-button type="text"  v-uni="'yszhoupaiban_reset'" @click="refresh">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table
      style="border-top: 1px solid #EBEEF5;"
      :data="tableData"
      :stripe="CONFIG.table.stripe"
      v-loading="loading"
      height="70%"
      :cell-style="cellStyle"
      v-if="tableVis"
    >
      <el-table-column
        align="center"
        prop="empKey"
        label="工号"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="accountName"
        label="姓名"
      >
      </el-table-column>
      <el-table-column v-for="(item,index) in weekData"
                       :key="index"
                       :render-header="renderHeader"
                       align="center"
                       :prop="item.id"
                       :label="item.name">
        <template slot-scope="scope">
          <shift-manage @dealSelData="dealSelData"
                        @dealSelFocus="dealSelFocus"
                        :ref="index + '-' + scope.$index"
                        :id="index + '-' + scope.$index"
                        :srcData="scope.row"
                        :col="index"
                        :row="scope.$index"
                        :dataId="item.id"
                        :flag="selectShow"
                        :dutyData="dutyData"
                        :dutyColor="dutyColor"
                        :color="colorCal(scope.row, scope, index, scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 10px"></div>
    <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv" style="height: 50px;">
      <el-button v-uni="'yszhoupaiban_cancel'" @click="refresh" style="width: 70px;height: 40px;">取消</el-button>
      <el-button v-uni="'yszhoupaiban_save'" type="primary" @click="saveData" :loading="addVis" style="width: 70px;height: 40px;">保存</el-button>
    </div>
    <!--导入-->
    <el-dialog :title="exportData.exportType == 'export'?'导出':'打印'"
               :visible.sync="exportData.exportFlag" width="400px"
               :close-on-click-modal="false">
      <el-form label-width="0px">
        <el-form-item v-if="formSearchData.businessType == 'NURSE'">
          <el-radio v-model="exportData.exportSelect"
                    label="SHIFT_BED_NOTE">{{'班次+'+exportData.export_tit+'+备注'}}
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-if="formSearchData.businessType == 'NURSE'"
                    v-model="exportData.exportSelect" label="SHIFT_BED">
            {{'班次+'+exportData.export_tit}}
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="exportData.exportSelect" label="SHIFT_NOTE">班次+备注</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="exportData.exportSelect" label="SHIFT">班次</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="height: 50px;">
        <el-button v-uni="'yszhoupaiban_export_cancel'" @click="cancelPrintAdd" style="width: 70px;height: 40px;">取消</el-button>
        <el-button v-uni="'yszhoupaiban_export_save'" type="primary" @click="printDo" style="width: 70px;height: 40px;">保存</el-button>
      </div>
      <div style="height: 20px;"></div>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
import ShiftInformation from '../../../assets/hsms/mixins/ShiftInformation'
import ShiftManage from '../../../components/hsms/ShiftManager'
import SetConfig from '../../../components/hsms/SetConfig'
import UserSort from '../../../components/hsms/UserSort'
import DutyTypeSet from '../../../assets/hsms/mixins/DutyTypeSet'
import { DateFormate, filterData } from '../../../assets/hsms/unitils/unitils'
import { GetDuty, GetNurseUser, GetRemark, GetBed, GetRoom, GetModelType, AxiosJsonApi } from '../../../api/hsms'
import { ResultMsg } from '../../../assets/hsms/js/Message'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseShiftInformation',
  components: {
    'shift-manage': ShiftManage,
    'user-sort': UserSort,
    'set-config': SetConfig
  },
  // inject: ['tabRefresh', 'getBusinessType'],
  mixins: [ShiftInformation, DutyTypeSet, config],
  data () {
    return {
      businessType: '',
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
      url: '/hsms/web-hs/schedule',
      select: {
        id: ''
      }
    }
  },
  props: ['detail'],
  // 初始化
  created () {
    // console.log(this.detail);
    this.formSearchData = this.detail.formSearchData
    this.searchType = this.detail.searchType
    this.searchDate = this.detail.searchDate
    this.weekVal = this.detail.weekVal
    this.businessType = this.$route.params.businessType || 'NURSE'
    this.formSearchData.businessType = this.getBusinessType() || this.businessType
    this.getNurseUser()
    this.getDuty()
    this.getModel()
    // this.onSearchSubmit();
    this.selectShow = true
    setTimeout(function () {
      this.selectShow = true
    }, 0)
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
      // let header = document.getElementsByClassName('has-gutter')[0];
      let header = $('.has-gutter')
      let header_offset = header.offset() || null
      if (header_offset === null) {
        return false
      }
      let header_top = +header_offset.top + 50
      if (this.select === undefined || this.select === null || this.select === '') {
        return false
      }
      let ref = this.$refs[this.select.id][0] || null
      $('.el-select-dropdown').each(function (e) {
        if ($(this).css('display') === 'none') {

        } else {
          let el_select_dropdown = this
          let el_select_dropdown_offset_top = el_select_dropdown.offsetTop
          if (+el_select_dropdown_offset_top <= +header_top) {
            console.log('小于了')
            ref && ref.blur()
            // $(this).css('display', 'none');
            // ref.$refs.input.blur();
          }
        }
      })
    },
    getBusinessType () {
      return this.businessType
    },
    colorCal (row, scope, _col, _row, _id) {
      let columnIndex = _col
      if (columnIndex === 0 || columnIndex === 1) {}
      let rowIndex = _row// row.rowIndex
      let date = this.weekData[columnIndex].id
      let shiftId = _id || this.tableData[rowIndex][`${date}__shiftId`]
      // console.log(this.dutyColor[shiftId])
      if (shiftId === '' || !this.dutyColor[shiftId]) {
        return {
          background: '',
          color: ''
        }
      } else {
        // return `background: ${this.dutyColor[shiftId].backgroundColor}; color:${this.dutyColor[shiftId].foregroundColor};`
        return {
          background: this.dutyColor[shiftId].backgroundColor,
          color: this.dutyColor[shiftId].foregroundColor
        }
      }
    },
    cellStyle (row) {
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
        // return `background: ${this.dutyColor[shiftId].backgroundColor}; color:${this.dutyColor[shiftId].foregroundColor};`
        return ''
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
    // 护士排序
    sortData () {
      this.userVisible = true
    },
    // 刷新页面
    refresh () {
      // this.tabRefresh('second', this.setParam.setFormData.scheduleMode)
      this.reloadUrl1()
    },
    // 返回
    reloadUrl1 () {
      // let businessType = this.businessType || this.formSearchData.businessType
      // this.$emit('option-changed', 'list', { businessType: businessType })
      let detail = {
        activeName: 'second',
        formSearchData: this.formSearchData
      }
      this.$emit('changed', 'list', detail)
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
          date: d.getDate() + '/' + (d.getMonth() + 1),
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
      this.saveDataDo1({ data: this.selectedData }, 'add', params, false)
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
      this.exportData.exportFlag = true
      this.exportData.exportSelect = 'SHIFT_NOTE'
      this.exportData.typeStr = 'export'
    },
    // 导出
    exportDo () {
      this.cancelPrintAdd()
      let week = ''
      let month
      if (this.searchType === 'day') {
        week = ''
        month = parseInt(this.curTime.substr(5, 2))
      } else {
        week = DateFormate.getWeekOfYear(this.curTime)
        month = ''
      }
      window.open(`http://${window.location.host}/hsms/web-hs/schedule/${this.formSearchData.businessType}/export?businessType=${this.formSearchData.businessType}&exportKey=${this.exportData.exportSelect}&year=${this.curTime.substr(0, 4)}&week=${week}&month=${month}`)
    },
    // 查询
    onSearchSubmit () {
      // this.selectShow = false
      this.selectShow = true
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
    },
    dealSelFocus (id) {
      this.select.id = id
    }
  }
}
</script>

<style scoped lang="scss">
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
</style>
