<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" :model="formSearchData" class="demo-form-inline" ref="formSearch">
      <el-form-item label="查询类型：">
        <el-select size="small" v-model="searchType" placeholder="请选择查询类型">
          <el-option label="按周查询" value="week"></el-option>
          <el-option label="按天查询" value="day"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" v-if="searchType=='week'">
        <el-button type="success" @click="weekSearch('last')" size="small">上一周</el-button>
        <el-button type="success" @click="weekSearch('cur')" size="small">本周</el-button>
        <el-button type="success" @click="weekSearch('next')" size="small">下一周</el-button>
      </el-form-item>
      <el-form-item label-width="0" v-if="searchType=='day'">
        <el-date-picker
          size="small"
          v-model="searchDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" class="el-button-radius" icon="el-icon-search" @click="onSearchSubmit" size="small">
            搜索
          </el-button>
          <el-button type="text" @click="refresh">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="typt-list-add-div">
      <div class="action_div">
        <el-button-group>
          <el-button v-if="formSearchData.businessType == 'DOCTOR'" type="primary" size="small" @click="showSet()">设置
          </el-button>
          <el-button type="primary" size="small" @click="setDuty()">编辑排班</el-button>
          <el-button type="primary" size="small" @click="printData()">打印</el-button>
          <el-button type="primary" size="small" @click="exportShow()">导出</el-button>
        </el-button-group>
        <div class="model_cls"
             v-if="formSearchData.businessType=='DOCTOR'">当前模式：<span>{{setParam.modelObj[setParam.modelType]}}</span>
        </div>
      </div>
    </div>
    <!--end-->
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="70%"
      border
      :cell-style="cellStyle"
      v-if="tableVis"
    >
      <el-table-column
        align="center"
        prop="accountName"
        label="姓名"
      >
      </el-table-column>
      <el-table-column v-for="(item,index) in weekData" :key="index"
                       :render-header="renderHeader"
                       align="center"
                       :prop="item.id"
                       :label="item.name">
        <template slot-scope="scope">
          <shift-manage @dealSelData="dealSelData" :srcData="scope.row" :col="index" :row="scope.$index"
                        :dataId="item.id" :flag="selectShow" :dutyData="dutyData"></shift-manage>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="del(scope.row)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 10px"></div>
    <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv">
      <el-button @click="refresh">取消</el-button>
      <el-button type="primary" @click="saveData" :loading="addVis">提 交</el-button>
    </div>
    <div style="height: 20px;"></div>
    <!--导入-->
    <el-dialog :title="exportData.exportType == 'export'?'导出':'打印'" :visible.sync="exportData.exportFlag" width="400px"
               :close-on-click-modal="false">
      <el-form label-width="0px">
        <el-form-item>
          <el-radio v-model="exportData.exportSelect" label="SHIFT_NOTE">班次+备注</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="exportData.exportSelect" label="SHIFT">班次</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPrintAdd">取消</el-button>
        <el-button type="primary" @click="printDo">确认</el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!--设置-->
    <el-dialog title="设置" :visible.sync="setParam.setFormVisible" width="500px" :close-on-click-modal="false">
      <set-config :data="setParam.getSetData.scheduleMode" @dealSetData="dealSetData"></set-config>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSetAdd">取消</el-button>
        <el-button type="primary" @click="saveSetData" :loading="addVis">确认</el-button>
      </div>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
  import ShiftInformation from '../../../assets/hsms/mixins/ShiftInformation'
  import ShiftManage from '../../../components/hsms/ShiftManager'
  import SetConfig from '../../../components/hsms/SetConfig'
  import DutyTypeSet from '../../../assets/hsms/mixins/DutyTypeSet'
  import { DateFormate } from '../../../assets/hsms/unitils/unitils'
  import { ResultMsg } from '../../../assets/hsms/js/Message'
  import { GetDuty, GetNurseUser, GetRemark, AxiosJsonApi, AxiosApi } from '../../../api/hsms'

  export default {
    name: 'NurseShiftInformationOutPatient',
    components: {
      'shift-manage': ShiftManage,
      'set-config': SetConfig
    },
    inject: ['tabRefresh'],
    mixins: [ShiftInformation, DutyTypeSet],
    data () {
      return {
        exportData: {
          exportFlag: false,
          exportType: 'export',
          exportSelect: 'SHIFT_NOTE',
          exportTypeObj: {},
          typeStr: ''
        },
        bedObj: {},
        searchType: 'week',
        searchDate: '',
        dutyColor: {},
        remarkData: [],
        weekVal: new Date().getTime(),
        year: '',
        month: '',
        week: '',
        modelName: '排班',
        weekData: [],
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
      this.getNurseUser()
      this.getDuty()
    },
    methods: {
      // 删除
      del (row) {
        AxiosJsonApi('/hsms/web-hs/account/config', {
          accountId: row.accountId,
          accountName: row.accountName,
          year: this.year,
          month: this.month,
          week: this.week
        }).then(res => {
          ResultMsg(res, '删除', this.refresh)
        })
      },
      // 删除
      getDelAccount () {
        AxiosApi('/hsms/web-hs/account/config', {}, 'GET', {
          businessType: this.formSearchData.businessType,
          year: this.year,
          month: this.month,
          week: this.week
        }).then(res => {
          let data = res.data || []
          data.forEach((item, index) => {
            this.delKey[item.accountId] = 'yes'
          })
          this.getData()
        })
      },
      // 设置单元格样式
      cellStyle (row) {
        let columnIndex = row.columnIndex
        if (columnIndex === 0 || columnIndex === 8) {
          return ''
        }
        let rowIndex = row.rowIndex
        let date = this.weekData[columnIndex - 1].id
        let shiftId = this.tableData[rowIndex][`${date}__shiftId`]
        if (shiftId === '' || !this.dutyColor[shiftId]) {
          return ''
        } else {
          return `background: ${this.dutyColor[shiftId].backgroundColor}; color:${this.dutyColor[shiftId].foregroundColor};`
        }
      },
      // 请求备注信息
      getRemark () {
        GetRemark({
          businessType: this.formSearchData.businessType,
          year: this.year,
          month: this.month,
          week: this.week
        }).then(res => {
          this.remarkData = res
        })
      },
      // 刷新页面
      refresh () {
        this.tabRefresh('second', this.setParam.setFormData.scheduleMode)
      },
      // 编辑排班
      setDuty () {
        this.selectShow = true
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
      // 形成日期数据
      initWeekData () {
        let curTime = ''
        let week = ''
        let month = ''
        if (this.searchType === 'day') {
          curTime = this.searchDate
          week = ''
          month = parseInt(curTime.substr(5, 2))
        } else {
          curTime = DateFormate.getNowFormatDate(new Date(this.weekVal))
          week = DateFormate.getWeekOfYear(curTime)
          month = ''
        }
        this.year = parseInt(curTime.substr(0, 4))
        this.month = month
        this.week = week
        this.formSearchData.beginDate = DateFormate.getSunDay(0, curTime)
        this.formSearchData.endDate = DateFormate.getSunDay(6, curTime)
        this.weekData = DateFormate.getCurWeek(curTime)
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
      exportShow () {
        this.exportData.exportFlag = true
        this.exportData.exportSelect = 'SHIFT_NOTE'
        this.exportData.typeStr = 'export'
      },
      // 导出
      exportDo () {
        this.cancelPrintAdd()
        window.open(`http://${window.location.host}/hsms/web-hs/schedule/export?businessType=${this.formSearchData.businessType}&exportKey=${this.exportData.exportSelect}&year=${this.year}&week=${this.week}&month=${this.month}`)
      },
      // 查询
      onSearchSubmit () {
        this.initWeekData()
        this.tableData = []
        this.selectedData = []
        this.getDelAccount()
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
      right: 340px;
      width: 150px;
      font-size: 14px;
      color: #666666;
      top: 5px;
    }
  }
</style>
