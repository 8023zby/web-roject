<template>
  <!--护士排班-班次统计-->
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true"
             :model="formSearchData"
             class="demo-form-inline"
             ref="formSearch">

      <el-form-item label="护士姓名：">
        <el-select size="small"
                   v-model="userArr"
                   placeholder="请选择"
                   multiple>
          <el-option v-for="(item, index) in userData"
                     :key="index" :label="item.empName"
                     :value="item.empId"/>
        </el-select>
      </el-form-item>

      <el-form-item label="班次：">
        <el-select v-model="shiftArr"
                   placeholder="请选择"
                   size="small" multiple>
          <el-option v-for="(item, index) in dutyData"
                     :key="index" :label="item.shiftName"
                     :value="item.shiftId"/>
        </el-select>
      </el-form-item>

      <el-form-item label="查询类型：">
        <el-select v-model="searchType"
                   placeholder="请选择" @change="changeSearchType()">
          <el-option label="按周查询" value="week"/>
          <el-option label="按日期查询" value="day"/>
        </el-select>
      </el-form-item>

      <el-form-item label-width="0" v-if="searchType=='week'">
        <el-button type="primary"
                   @click="weekSearch('last')" size="small"
                   class="week-item week-item-first">上一周
        </el-button>
        <el-button type="primary" @click="weekSearch('cur')" size="small" class="week-item">本周</el-button>
        <el-button type="primary" @click="weekSearch('next')" size="small" class="week-item">下一周</el-button>
      </el-form-item>

      <el-form-item label-width="0"
                    v-if="searchType=='day'">
        <el-date-picker style="width: 182px;"
                        size="small"
                        v-model="searchDate"
                        type="month"
                        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <div class="typt-search-btn"
             style="margin-left: 14px;">
          <el-button type="primary"
                     class="el-button-radius"
                     style="padding: 6px 16px 6px 12px;width: 80px;"
                     icon="el-icon-search"
                     @click="onSearchSubmit" size="small">搜索
          </el-button>
          <el-button type="text" @click="reloadMain">重置</el-button>
        </div>
      </el-form-item>

    </el-form>
    <!--end-->
    <!--列表-->
    <el-table :data="tableData"
              :stripe="CONFIG.table.stripe"
              v-loading="loading"
              height="85%">
      <el-table-column align="center"
                       prop="accountName"
                       label="姓名">
      </el-table-column>
      <el-table-column v-for="(item,index) in titData"
                       :key="index"
                       align="center"
                       :render-header="renderHeader"
                       :min-width="item.shiftName.length * 28"
                       :prop="item.shiftId"
                       :label="item.shiftName">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import ShiftStatistics from '../../../assets/hsms/mixins/ShiftStatistics'
import { DateFormate } from '../../../assets/hsms/unitils/unitils'
import { ResultMsg } from '../../../assets/hsms/js/Message'
import { AxiosApi, GetDuty, GetNurseUser, GetModelType } from '../../../api/hsms'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseShiftStatistics',
  mixins: [ShiftStatistics, config],
  data () {
    return {
      searchType: 'week',
      searchDate: new Date(),
      titData: [],
      weekVal: new Date().getTime(),
      dutyData: [],
      userArr: [],
      shiftArr: [],
      modelName: '排班统计',
      userData: [],
      formSearchData: {
        year: '',
        month: '',
        week: '',
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/shift/NURSE/statistics'
    }
  },
  // 初始化
  created () {
    this.getUser()
    this.getModelType()
  },
  methods: {
    // 标题头样式
    renderHeader (h, { column }) {
      let v = column.label
      // let width = v.length * 20// width: ' + width + 'px
      return h('div', { style: 'line-height:20px;white-space: nowrap;;text-align: center;' }, [
        v
      ])
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
    // 切换查询类型
    changeSearchType () {
      this.initTit()
      this.onSearchSubmit()
    },
    // 形成标题
    initTit () {
      let shiftId = this.shiftArr.join(',')
      let obj = []
      this.dutyData.forEach((item, index) => {
        if (shiftId !== '' && shiftId.indexOf(item.shiftId) === -1) {

        } else {
          obj.push({
            shiftId: item.shiftId,
            shiftName: item.shiftName
          })
        }
      })
      if (this.searchType === 'week') {
        this.titData = obj.concat([{
          shiftId: 'allCount',
          shiftName: '周总小时数'
        }, {
          shiftId: 'weekNightCount',
          shiftName: '周夜小时数'
        }])
      } else {
        this.titData = obj.concat([{
          shiftId: 'restCount',
          shiftName: '休班工时'
        }, {
          shiftId: 'leaveCount',
          shiftName: '请假工时'
        }, {
          shiftId: 'weekNightCount',
          shiftName: '夜班工时'
        }, {
          shiftId: 'workCount',
          shiftName: '加班工时'
        }, {
          shiftId: 'allCount',
          shiftName: '总工时'
        }])
      }
    },
    // 保存
    saveData () {
      AxiosApi('/nurse/shift/coefficient', {}).then(res => {
        ResultMsg(res.data, '设置', this.reload, this)
      })
    },
    // 查询
    onSearchSubmit () {
      this.initTit()
      let curTime = ''
      if (this.searchType === 'day') {
        curTime = DateFormate.getNowFormatDate(this.searchDate)
        this.formSearchData.week = ''
        this.formSearchData.month = parseInt(curTime.substr(5, 2))
      } else {
        curTime = DateFormate.getNowFormatDate(new Date(this.weekVal))
        this.formSearchData.week = DateFormate.getWeekOfYear(curTime)
        this.formSearchData.month = ''
      }
      this.formSearchData.year = parseInt(curTime.substr(0, 4))
      this.tableData = []
      this.getData()
    },
    // 获取班次
    getDuty () {
      let weekCount = [{
        shiftId: 'allCount',
        shiftName: '周总小时数'
      }, {
        shiftId: 'weekNightCount',
        shiftName: '周夜小时数'
      }]
      GetDuty(this.formSearchData.businessType).then(res => {
        this.dutyData = res
        this.titData = [...this.dutyData, ...weekCount]
        this.onSearchSubmit()
      })
    },
    // 获取用户
    getUser () {
      GetNurseUser(this.formSearchData.businessType).then(res => {
        this.userData = res
        this.getDuty()
      })
    },
    // 获取加班工时时间
    getModelType () {
      GetModelType(this.formSearchData.businessType).then(res => {
        this.weekStandard = res.weekStandard || 1000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/hsms/css/self_common";

  .btnDiv {
    text-align: center;
    margin-top: 10px;
  }

  .el-button--small {
    padding: 6px 16px !important;
    border-radius: 2px !important;
  }

  /deep/ .el-input--small .el-input__inner {
    width: 182px;
    height: 34px;
  }

  /deep/ .typt-list-container .el-button--small {

  }

  .week-item {
    background: #ffffff !important;
    color: #333333 !important;
    border: none;
    text-decoration: underline;
    min-width: 50px !important;
    font-weight: 300;
    margin-right: 24px;
    padding: 0 !important;
  }

  .week-item-first {
    margin-left: 22px;
  }

  .week-item:hover {
    color: #1b7ad8 !important;
  }

  /deep/ .el-form-item {
    height: auto;
    min-height: 58px;
  }
</style>
