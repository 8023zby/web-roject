<template>
  <!--护士医生-排班流水-本周排班-->
  <div class="typt-list-container">
    <!--查询-->
    <el-form
      :inline="true"
      :model="formSearchData"
      class="demo-form-inline"
      ref="formSearch"
    >
      <el-form-item label="查询类型:">
        <el-select
          v-model="searchType"
          @change="selectChanged"
          style="width: 182px; height: 34px"
          placeholder="请选择查询类型"
          size="small"
          v-uni="'hushibenzhoupaiban_changetype'"
        >
          <el-option label="按周查询" value="week" />
          <el-option label="按天查询" value="day" />
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" v-if="searchType === 'week'">
        <el-button
          class="shift-search"
          type="text"
          @click="weekSearch('last')"
          size="small"
          v-uni="'hushibenzhoupaiban_shangyizhou'"
          >上一周</el-button
        >
        <el-button
          class="shift-search"
          style="margin-left: 24px"
          type="text"
          @click="weekSearch('cur')"
          v-uni="'hushibenzhoupaiban_benzhou'"
          size="small"
          >本周</el-button
        >
        <el-button
          class="shift-search"
          style="margin-left: 24px"
          type="text"
          @click="weekSearch('next')"
          v-uni="'hushibenzhoupaiban_xiayizhou'"
          size="small"
          >下一周</el-button
        >
      </el-form-item>
      <el-form-item label-width="0" v-if="searchType === 'day'">
        <el-date-picker
          v-model="searchDate"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn" style="margin-left: 14px">
          <el-button
            type="primary"
            class="el-button-radius shift-search"
            icon="el-icon-search"
            @click="onSearchSubmit"
            style="width: 80px"
            size="small"
            v-uni="'hushibenzhoupaiban_search'"
            >搜索
          </el-button>
          <el-button
            type="text"
            @click="refresh"
            style="margin-left: 26px; padding: 0"
            v-uni="'hushibenzhoupaiban_reset'"
            >重置</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <hr />
    <div class="typt-list-add-div" style="padding-top: 13px">
      <div class="action_div">
        <el-button-group>
          <el-button
            class="shift-search"
            v-if="formSearchData.businessType == 'DOCTOR'"
            type="primary"
            size="small"
            v-uni="'hushibenzhoupaiban_setting'"
            @click="showSet()"
            >设置
          </el-button>
          <el-button
            class="shift-button"
            type="primary"
            size="small"
            @click="sortData()"
            v-uni="'hushibenzhoupaiban_userOrder'"
            >用户排序</el-button
          >
          <el-button
            class="shift-button"
            type="primary"
            size="small"
            @click="copyData()"
            v-uni="'hushibenzhoupaiban_copy'"
            >复制排班</el-button
          >
          <el-button
            class="shift-button"
            type="primary"
            size="small"
            @click="setDutyWeek()"
            v-uni="'hushibenzhoupaiban_edit'"
            >编辑排班</el-button
          >
          <el-button
            class="shift-button"
            type="primary"
            size="small"
            @click="columnVisible = true"
            v-uni="'hushibenzhoupaiban_lieshezhi'"
            >列设置</el-button
          >
          <el-button
            class="shift-button"
            type="success"
            size="small"
            @click="importVisible = true"
            v-uni="'hushibenzhoupaiban_import'"
            >导入
          </el-button>
          <el-button
            class="shift-button"
            type="success"
            size="small"
            @click="exportShow()"
            v-uni="'hushibenzhoupaiban_export'"
          >
            导出
          </el-button>
          <el-button
            class="shift-button"
            type="success"
            size="small"
            @click="printData()"
            v-uni="'hushibenzhoupaiban_print'"
            >打印</el-button
          >
        </el-button-group>
        <div class="model_cls" v-if="formSearchData.businessType === 'DOCTOR'">
          当前模式:<span>{{ setParam.modelObj[setParam.modelType] }}</span>
        </div>
      </div>
    </div>
    <!--end-->
    <!--列表-->
    <el-table
      style="border-top: 1px solid #ebeef5"
      :data="tableData"
      :stripe="CONFIG.table.stripe"
      v-loading="loading"
      height="70%"
      class="shift-table"
      v-if="tableVis"
    >
      <!-- <el-table-column
        align="center"
        type="index"
        show-overflow-tooltip
        width="70"
        label="序号"
      /> -->
      <el-table-column
        align="center"
        prop="accountName"
        show-overflow-tooltip
        label="姓名"
      />
      <el-table-column
        align="center"
        prop="level"
        show-overflow-tooltip
        v-if="columnCheckedList.indexOf('level') >= 0"
        label="护士层级"
      />
      <el-table-column
        v-for="(item, index) in weekData"
        :key="index"
        :render-header="renderHeader"
        align="center"
        :width="screenWidth > 1440 ? 150 : 90"
        :prop="item.id"
        :label="item.name"
      >
        <template slot-scope="scope">
          <shift-manage
            @dealSelData="dealSelData"
            :srcData="scope.row"
            :col="index"
            :row="scope.$index"
            :dutyColor="dutyColor"
            :dataId="item.id"
            :flag="selectShow"
            :dutyData="dutyData"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="weekWorkHour"
        width="80"
        show-overflow-tooltip
        label="本周工时"
        v-if="columnCheckedList.indexOf('weekWorkHour') >= 0"
      />
      <el-table-column
        align="center"
        prop="arrearsHour"
        show-overflow-tooltip
        label="欠休"
        v-if="columnCheckedList.indexOf('arrearsHour') >= 0"
      />
      <el-table-column label="年休" align="center" v-if="columnCheckedList.indexOf('annualLeave') >= 0 || columnCheckedList.indexOf('annualCount') >= 0">
        <el-table-column
          align="center"
          prop="annualLeave"
          show-overflow-tooltip
          label="天数"
          v-if="columnCheckedList.indexOf('annualLeave') >= 0"
        />
        <el-table-column
          align="center"
          prop="annualCount"
          show-overflow-tooltip
          label="未休"
          v-if="columnCheckedList.indexOf('annualCount') >= 0"
        />
      </el-table-column>
    </el-table>
    <div style="height: 10px"></div>
    <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv">
      <el-button v-uni="'hushibenzhoupaiban_cancel'" @click="refresh">取消</el-button>
      <el-button v-uni="'hushibenzhoupaiban_save'" type="primary" @click="saveData" :loading="addVis"
        >保存</el-button
      >
    </div>
    <!--导出-->
    <el-dialog
      :title="exportData.typeStr === 'export' ? '导出' : '打印'"
      :visible.sync="exportData.exportFlag"
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form label-width="0px">
        <el-form-item v-if="formSearchData.businessType === 'NURSE'">
          <el-radio v-model="exportData.exportSelect" label="SHIFT_BED_NOTE"
          >{{ "班次+床位号+房间号+备注" }}
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio
            v-if="formSearchData.businessType === 'NURSE'"
            v-model="exportData.exportSelect"
            label="SHIFT_BED"
          >
            {{ "班次+床位号+房间号" }}
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="exportData.exportSelect" label="SHIFT_NOTE"
            >班次+备注</el-radio
          >
        </el-form-item>
        <el-form-item>
          <el-radio v-model="exportData.exportSelect" label="SHIFT"
            >班次</el-radio
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'hushibenzhoupaiban_export_cancel'" @click="cancelPrintAdd">取消</el-button>
        <el-button v-uni="'hushibenzhoupaiban_export_save'" type="primary" @click="printDo">确认</el-button>
      </div>
      <div style="height: 20px"></div>
    </el-dialog>
    <!--end-->
    <!--设置-->
    <el-dialog
      title="设置"
      :visible.sync="setParam.setFormVisible"
      :show-close="false"
      width="460px"
      :close-on-click-modal="false"
    >
      <set-config
        :data="setParam.getSetData.scheduleMode"
        @dealSetData="dealSetData"
      />
      <div
        slot="footer"
        class="dialog-footer"
        style="margin-top: -15px; padding-bottom: 5px"
      >
        <el-button v-uni="'hushibenzhoupaiban_setting_cancel'" @click="cancelSetAdd">取消</el-button>
        <el-button v-uni="'hushibenzhoupaiban_setting_save'" type="primary" @click="saveSetData" :loading="addVis"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!--end-->
    <!----用户排序------>
    <el-dialog
      class="iframe"
      title="排序"
      :visible.sync="userVisible"
      width="800px"
      height="480px"
      :close-on-click-modal="false"
      @close="refresh"
    >
      <user-sort :typeStr="formSearchData.businessType" />
    </el-dialog>

    <!-------- 列设置 start -------->
    <el-dialog title="列设置" :visible.sync="columnVisible" width="580px">
      <div style="padding-bottom: 25px">
        <p>在表单中显示列:</p>
        <el-checkbox-group v-model="columnCheckedList">
          <el-checkbox
            :label="item.id"
            v-for="(item, index) in columnCheckboxList"
            :key="item.id"
            class="column-checkbox-item"
            ><span class="column-checkbox-lable">{{
              item.label
            }}</span></el-checkbox
          >
        </el-checkbox-group>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'hushibenzhoupaiban_lieshezhi_cancel'" @click="columnVisible = false">取消</el-button>
        <el-button v-uni="'hushibenzhoupaiban_lieshezhi_save'" type="primary" @click="onColumnSettingConfirm"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-------- 列设置 end -------->

    <!-------- 导入功能 start -------->
    <!-- 导入dialog -->
    <el-dialog title="导入" :visible.sync="importVisible" width="490px" @close="importVisibleClose">
      <div style="padding-bottom: 24px" class="import-dialog">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="false"
          :file-list="fileList"
          accept=".xls,.xlsx"
          :multiple="false"
          :on-change="handleChange"
          :auto-upload="false"
        >
          <div class="import-dialog-upload">
            <span style="margin-right: 12px">文件:</span>
            <el-input
              size="small"
              style="width: 300px; height: 34px"
              :value="fileList[0] ? fileList[0].name : ''"
              placeholder=""
              readonly
            ></el-input>
            <el-button v-uni="'hushibenzhoupaiban_import_choose_file'" class="shift-button" type="primary" size="small"
              >选择文件</el-button
            >
          </div>
        </el-upload>
        <p
          style="
            font-size: 12px;
            margin-left: 55px;
            margin-top: 15px;
            color: #8e8e8e;
          "
        >
          支持格式EXCEL，文件不能超过5MB。<a
            href="/hsms/web-hs/schedule/NURSE/exportTemplate"
            style="color: #1e87f0"
            >下载导入模板</a
          >
        </p>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'hushibenzhoupaiban_import_cancel'" @click="importVisible = false">取消</el-button>
        <el-button v-uni="'hushibenzhoupaiban_import_save'" type="primary" @click="onImportConfirm">导入</el-button>
      </div>
    </el-dialog>
    <!-- 导入dialog结束 -->
    <!-- 导入提示 -->
    <el-dialog title="导入提示" :visible.sync="importWarnVisible" width="490px">
      <div style="padding-bottom: 30">
        {{ uploadMsg }}
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'hushibenzhoupaiban_import_message_cancel'" @click="importWarnVisible = false">取消</el-button>
        <el-button v-uni="'hushibenzhoupaiban_import_message_save'" type="primary" @click="onImportWarnConfirm">继续</el-button>
      </div>
    </el-dialog>
    <!-- 导入提示结束 -->
    <!-- 导入失败 -->
    <el-dialog
      title="导入失败"
      :visible.sync="importErrorVisible"
      width="490px"
    >
      <div style="padding-bottom: 30px">
        {{ uploadMsg }}
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'hushibenzhoupaiban_import_fail_cancel'" type="primary" @click="importErrorVisible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
    <!-- 导入失败结束 -->
    <!-------- 导入功能 end -------->
  </div>
</template>

<script>
import ShiftInformation from '../../../assets/hsms/mixins/NurseShiftInformation'
import ShiftManage from '../../../components/hsms/NurseShiftManager'
import SetConfig from '../../../components/hsms/SetConfig'
import UserSort from '../../../components/hsms/UserSort'
import DutyTypeSet from '../../../assets/hsms/mixins/DutyTypeSet'
import { DateFormate } from '../../../assets/hsms/unitils/unitils'

import {
  GetDuty,
  GetNurseUser,
  GetRemark,
  GetBed,
  GetRoom,
  GetModelType,
  ImportSchedule,
  GetRelation,
  ApiStorgeHolidays,
  ApiAnnualHolidays,
  ExportSchedule
} from '../../../api/hsms'
import config from '../../../assets/hsms/mixins/config'
const moment = require('moment')

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
      // 显示用户排序
      userVisible: false,
      exportData: {
        exportFlag: false,
        exportType: 'export',
        exportSelect: 'SHIFT_NOTE',
        exportTypeObj: {},
        typeStr: '',
        export_tit: '床位号'
      },
      // 组织机构床位数据
      bedObj: {},
      // 组织机构房间数据
      roomObj: {},
      searchType: 'week',
      curTime: '',
      searchDate: '',
      dutyColor: {},
      remarkData: [],
      weekVal: new Date().getTime(),
      modelName: '排班',
      weekData: [],
      // modelType: 'BED',
      formSearchData: {
        beginDate: '',
        endDate: '',
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/schedule',

      /**
       * ------------------------------------------------------------------
       * 列设置
       * ------------------------------------------------------------------
       */
      columnVisible: false, // 列设置模态框
      columnCheckboxList: [
        {
          label: '护士层级',
          id: 'level'
        },
        {
          label: '本周工时',
          id: 'weekWorkHour'
        },
        {
          label: '欠休',
          id: 'arrearsHour'
        },
        {
          label: '年休-天数',
          id: 'annualLeave'
        },
        {
          label: '年休-未休',
          id: 'annualCount'
        }
      ], // 列设置checkbox
      columnCheckedList: ['level', 'weekWorkHour', 'arrearsHour', 'annualCount', 'annualLeave'], // 选中的列设置

      /**
       * ------------------------------------------------------------------
       * 导入功能
       * ------------------------------------------------------------------
       */
      importVisible: false, // 导入模态框
      importWarnVisible: false, // 确认导入提示框
      importErrorVisible: false, // 导入错误提示框
      importExcel: '', // 导入文件（Excel）
      fileList: [], // 导入文件列表
      uploadMsg: '', // 提示信息
      isContinue: false,
      /**
      * ------------------------------------------------------------------
      * 获取全部员工的年假，层级，存假
      * ------------------------------------------------------------------
      */
      otherColumn: {
        annual: [],
        level: [],
        holiday: []
      },
      screenWidth: window.outerWidth
    }
  },
  // 初始化
  created () {
    try {
      let columnCheckedList = localStorage.getItem('nurseShiftColumnCheckedList')
      if (columnCheckedList) {
        this.columnCheckedList = JSON.parse(columnCheckedList)
      }
    } catch (error) {
    }
    // 12版本起 都走BED(床位模式)
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
      GetRemark(param, this.formSearchData.businessType).then((res) => {
        this.remarkData = res
      })
    },
    selectChanged (val) {
      // console.log(this.weekVal)
      // console.log(DateFormate.getNowFormatDate(new Date(this.weekVal)))
      if (val === 'day') {
        this.searchDate = DateFormate.getNowFormatDate(new Date(this.weekVal)) // moment().format('YYYY-MM-DD')
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
        let M =
          d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
        let D = d.getDate() > 9 ? d.getDate() : '0' + d.getDate()
        arr.push({
          id: Y + '-' + M + '-' + D,
          // name: Y + '年' + M + '月' + D + '日 <br/>（' + DateFormate.getDayName(d.getDay()) + '）',
          name:
            M + '-' + D + ' <br/>' + DateFormate.getDayName(d.getDay()) + '',
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
        case 'last':
          this.weekVal = this.weekVal - 7 * 24 * 60 * 60 * 1000
          break
        case 'cur':
          this.weekVal = new Date().getTime()
          break
        case 'next':
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
      GetBed().then((res) => {
        res.forEach((item, index) => {
          this.bedObj[item.bedId] = item.bedName
        })
      })
    },
    // 获取房间
    getRoom () {
      GetRoom().then((res) => {
        res.forEach((item, index) => {
          this.roomObj[item.roomId] = item.roomName
        })
      })
    },
    // 获取模式
    getModel () {
      this.getRoom()
      this.getBed()
      // 去掉床和房的限制
      // GetModelType(this.formSearchData.businessType).then((res) => {
      //   let type = 'BED'
      //   if (res) {
      //     type = res.nurseMode
      //   }
      //   this.modelType = type

      //   // if (type === 'ROOM') {
      //   //   this.exportData.export_tit = '房间号'
      //   //   this.getRoom()
      //   // } else {
      //   //   this.getBed()
      //   // }
      // })
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
    printDo (typeStr) {
      if (this.exportData.typeStr === 'export') {
        this.exportDo()
        return
      }
      let obj = {}
      let thead = [
        // {
        //   name: '序号',
        //   key: 'index'
        // },
        {
          name: '姓名',
          key: 'name'
        }
      ]
      if (this.columnCheckedList.indexOf('level') >= 0) {
        thead.push({
          name: '护士层级',
          key: 'level'
        })
      }
      let tbody = []
      let temp = []
      this.weekData.forEach((item, index) => {
        thead.push({
          name: moment(item.id).format('MM-DD'),
          // week: item.week.replace('星期', ''),
          week: item.week,
          key: 'date'
        })
      })
      if (this.columnCheckedList.indexOf('weekWorkHour') >= 0) {
        thead.push({
          name: '本周工时',
          key: 'weekWorkHour'
        })
      }
      if (this.columnCheckedList.indexOf('arrearsHour') >= 0) {
        thead.push({
          name: '欠休',
          key: 'arrearsHour'
        })
      }
      if (this.columnCheckedList.indexOf('annualCount') >= 0) {
        thead.push({
          name: '天数',
          key: 'annualCount'
        })
      }
      if (this.columnCheckedList.indexOf('annualLeave') >= 0) {
        thead.push({
          name: '未休',
          key: 'annualLeave'
        })
      }
      this.tableData.forEach((val, key) => {
        // temp.push({
        //   name: key + 1,
        //   key: 'index'
        // })
        temp.push({
          name: val.accountName,
          remark: '',
          level: '',
          key: 'name'
        })
        if (this.columnCheckedList.indexOf('level') >= 0) {
          temp.push({
            name: val.level || '',
            key: 'index'
          })
        }
        this.weekData.forEach((item, index) => {
          let bedOrRoomArr = val[item.id]
          let printBedOrRoom = [] // 存储今日的床位和房间号

          // 循环这一天的数据
          for (let itemDate of bedOrRoomArr) {
            // 循环这一天的床位和房间的数据
            let itemObj = {
              roomList: '',
              bedList: ''
            }
            for (let itemLevel of itemDate.bedLevelList) {
              if (itemLevel.dataType === 'ROOM') {
                itemObj.roomList += itemLevel.objName + ','
              }
              if (itemLevel.dataType === 'BED') {
                itemObj.bedList += itemLevel.objName + ','
              }
            }
            itemObj = {
              bedList: itemObj.bedList.substr(0, itemObj.bedList.length - 1),
              roomList: itemObj.roomList.substr(0, itemObj.roomList.length - 1)
            }
            printBedOrRoom.push(itemObj)
          }
          temp.push({
            name: val[item.id],
            printBedOrRoom: printBedOrRoom,
            key: 'date'
          })
        })

        if (this.columnCheckedList.indexOf('weekWorkHour') >= 0) {
          temp.push({
            name: val.weekWorkHour || '',
            key: 'weekWorkHour'
          })
        }
        if (this.columnCheckedList.indexOf('arrearsHour') >= 0) {
          temp.push({
            name: val.arrearsHour || '',
            key: 'arrearsHour'
          })
        }
        if (this.columnCheckedList.indexOf('annualCount') >= 0) {
          temp.push({
            name: val.annualCount || '',
            key: 'annualCount'
          })
        }
        if (this.columnCheckedList.indexOf('annualLeave') >= 0) {
          temp.push({
            name: val.annualLeave || '',
            key: 'annualLeave'
          })
        }
        tbody.push(temp)
        temp = []
      })
      obj['thead'] = thead
      obj['tbody'] = tbody
      obj['remarkData'] = this.remarkData
      localStorage.setItem('printType', this.exportData.exportSelect)
      localStorage.setItem('tableData', JSON.stringify(obj))
      window.open(`${window.location.origin}/#/nurseShiftInformationPrint`)
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
    async exportDo () {
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
      let column = []
      if (this.columnCheckedList.indexOf('level') >= 0) {
        column.push(1)
      }
      if (this.columnCheckedList.indexOf('weekWorkHour') >= 0) {
        column.push(2)
      }
      if (this.columnCheckedList.indexOf('arrearsHour') >= 0) {
        column.push(3)
      }
      if (this.columnCheckedList.indexOf('annualCount') >= 0) {
        column.push(4)
      }
      if (this.columnCheckedList.indexOf('annualLeave') >= 0) {
        column.push(5)
      }
      let columnStr = column.join(',')
      try {
        let res = await ExportSchedule(this.formSearchData.businessType, this.exportData.exportSelect, this.curTime.substr(0, 4), week, month, columnStr)
        if (res.status == '500') {
          return this.$message.error(res.desc)
        }
      } catch (error) {
      }
      window.open(
        `http://${window.location.host}/hsms/web-hs/schedule/${
          this.formSearchData.businessType
        }/export?businessType=${this.formSearchData.businessType}&exportKey=${
          this.exportData.exportSelect
        }&year=${this.curTime.substr(0, 4)}&week=${week}&month=${month}&columnStr=${columnStr}`
      )
    },
    // 查询
    async onSearchSubmit () {
      this.selectShow = false
      this.initWeekData()
      this.tableData = []
      this.selectedData = []
      await this.getOtherData()
      this.getData()
      this.getRemark()
    },
    // 获取班次
    getDuty () {
      GetDuty(this.formSearchData.businessType).then((res) => {
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
      GetNurseUser(this.formSearchData.businessType).then((res) => {
        this.userData = res
        this.onSearchSubmit()
      })
    },
    // 处理选择数据
    dealSelData (item, index) {
      this.selectedData[index] = item
    },

    /**
     * ------------------------------------------------------------------
     * 列设置相关
     * ------------------------------------------------------------------
     */

    /**
     * @description: 列设置确认
     * @param {*}
     * @return {*}
     */
    onColumnSettingConfirm () {
      localStorage.setItem('nurseShiftColumnCheckedList', JSON.stringify(this.columnCheckedList))
      this.columnVisible = false
    },

    /**
     * ------------------------------------------------------------------
     * 导入功能相关
     * ------------------------------------------------------------------
     */
    /**
     * @description: 导入框确认
     * @param {*}
     * @return {*}
     */
    async onImportConfirm () {
      if (!this.fileList || !this.fileList.length) {
        this.$message.error('请上传排班excel')
        return
      }
      const loading = this.$loading({
        lock: true,
        background: 'rgba(255, 255, 255, 0.7)'
      })
      this.isContinue = false
      try {
        let formData = new FormData()
        this.fileList.map((item) => {
          formData.append('file', item.raw)
        })
        let res = await ImportSchedule(this.isContinue, formData)
        this.uploadSuccess(res)
      } catch (error) {}
      loading.close()
    },
    /**
     * @description: 导入框弹出确认导入提示后确定
     * @param {*}
     * @return {*}
     */
    async onImportWarnConfirm () {
      const loading = this.$loading({
        lock: true,
        background: 'rgba(255, 255, 255, 0.7)'
      })
      this.isContinue = true
      try {
        let formData = new FormData()
        this.fileList.map((item) => {
          formData.append('file', item.raw)
        })
        let res = await ImportSchedule(this.isContinue, formData)
        this.uploadSuccess(res)
      } catch (error) {}
      loading.close()
    },
    // 上传文件让第二次覆盖第一的文件
    handleChange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    uploadSuccess (res) {
      if (res.status == 500) {
        this.$message.error('请上传正确格式文件')
        return
      }
      const data = res.data
      let type = data[0].type
      let msg = data[0].msg
      if (this.isContinue == false) {
        this.uploadMsg = msg
        switch (type) {
          case '0':
            this.$message.success(msg)
            this.importVisible = false
            this.tableData = []
            this.getData()
            break
          case '1':
            this.importErrorVisible = true
            break
          case '2':
            this.importErrorVisible = true
            break
          case '3':
            this.importWarnVisible = true
            break
          default:
            break
        }
      } else {
        switch (type) {
          case '0':
            this.$message.success(msg)
            this.importVisible = false
            this.importWarnVisible = false
            this.tableData = []
            this.getData()
            break
        }
      }
    },
    uploadError () {
      this.$message.error('导入失败')
    },
    /**
     * @description: 关闭导入弹窗回调，将fileList置空
     * @param {*}
     * @return {*}
     */
    importVisibleClose () {
      this.fileList = []
    },

    /**
    * ------------------------------------------------------------------
    * 获取存假，年假，以及层级
    * ------------------------------------------------------------------
    */
    async getOtherData () {
      try {
        let res = await GetRelation()
        let res2 = await ApiStorgeHolidays.selectStorageSum({ accountType: 2 })
        let res3 = await ApiAnnualHolidays.selectAnnualSum({ accountType: 2 })
        this.otherColumn = {
          level: res.data,
          holiday: res2.data,
          annual: res3.data
        }
      } catch (error) {
        console.log(error)
      }
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

/deep/ .el-table .cell {
  padding-left: 5px;
}

/deep/ .el-table__body-wrapper {
  height: calc(100% - 62px) !important;
}

/**
  * ------------------------------------------------------------------
  * 列设置
  * ------------------------------------------------------------------
  */
.column-checkbox-item {
  margin-right: 60px;
  margin-top: 20px;
  &:nth-child(4n) {
    margin-right: 0;
  }
  .column-checkbox-lable {
    display: inline-block;
    width: 56px;
  }
}

/**
  * ------------------------------------------------------------------
  * 导入功能相关
  * ------------------------------------------------------------------
  */
.import-dialog {
  .import-dialog-upload {
    display: flex;
    align-items: center;
    .shift-button {
      margin-left: 12px !important;
    }
  }
  /deep/ .el-input--small .el-input__inner {
    height: 32px;
  }
}
.shift-table {
  /deep/ tr td {
    padding: 0 !important;
    height: auto;
  }
}
/deep/ .el-upload-list {
  display: none;
}
</style>
