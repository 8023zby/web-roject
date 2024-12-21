<template>
  <!--护士排班-排床管理-->
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true"
             :model="formSearchData"
             class="demo-form-inline"
             ref="formSearch">
      <el-form-item label="查询日期:">
        <el-date-picker style="width: 182px;height: 34px;"
                        size="small"
                        v-model="formSearchData.targetDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary"
                     class="el-button-radius"
                     id="onSearchSubmit"
                     ref="onSearchSubmit"
                     icon="el-icon-search"
                     @click="onSearchSubmit"
                     size="small">搜索
          </el-button>
          <el-button type="text"
                     @click="reload">重置
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr/>
    <div class="typt-list-add-div">
      <div class="action_div">
        <el-button type="success" size="small"
                   @click="printData()" style="width: 80px;">打印</el-button>
        <el-button type="primary" size="small"  @click="exportDo()" style="width: 80px;"
                   v-if="flag === 'false'">导出</el-button>
      </div>
    </div>
    <!--列表-->
    <el-table :data="tableData"
              :stripe="CONFIG.table.stripe"
              v-loading="loading"
              height="50%">
      <el-table-column prop="accountId"
                       :formatter="formatKey"
                       align="center"
                       label="工号">
      </el-table-column>
      <el-table-column align="center"
                       prop="accountName"
                       label="姓名">
      </el-table-column>
      <el-table-column align="center"
                       prop="shiftName"
                       show-overflow-tooltip
                       label="班次名称">
      </el-table-column>
      <el-table-column align="center"
                       prop="shiftSpanList"
                       label="工作时间">
        <template slot-scope="scope">
          <!--work-time :srcData="scope.row.shiftSpanList"/>-->
          {{formateSpanList(scope.row.shiftSpanList)}}
        </template>
      </el-table-column>
      <el-table-column prop="bedOrRoomList"
                       :show-overflow-tooltip="false"
                       :label="bedOrRoomName">
        <!--template slot-scope="scope">
            {{ scope.row | formatBedOrRoomfilters}}
        </template-->
        <!--:formatter="formatBedOrRoom"-->
        <template slot-scope="scope">
          {{formatBedOrRoom(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text"
                    :key="'paichuangguanlixuanze' + scope.$index"
                     @click="setBed(scope.row)" size="mini"
                     v-if="flag === 'false'">
            <span style="font-size: 14px;">选择{{bedOrRoomName}}</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--选择床位-->
    <el-dialog class="iframe"
               :title="'选择'+bedOrRoomName"
               :show-close="false"
               :visible.sync="setBedVisible"
               width="800px"
               :close-on-click-modal="false"
               @close="reload">
      <bed-select :srcData="bedOrRoomList"
                  :selectedOldBeds="selectedOldBeds"
                  @dealSelData="dealSelData"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSetAdd">取消</el-button>
        <el-button type="primary" @click="saveSetData">确认</el-button>
      </div>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
import DutyBed from '../../../assets/hsms/mixins/DutyBed'
import BedSelect from '../../../components/hsms/BedSelect'
import { DateFormate } from '../../../assets/hsms/unitils/unitils'
import { GetNurseUser, GetBed, GetModelType, GetRoom } from '../../../api/hsms'
// import WorkTime from '../../../components/hsms/WorkTime'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseDutyBed',
  components: {
    'bed-select': BedSelect
    // 'work-time': WorkTime
  },
  mixins: [DutyBed, config],
  inject: ['tabRefresh'],
  data () {
    return {
      setBedVisible: false,
      nurseMode: 'BED',
      bedOrRoomList: [],
      BedOrRoomList: [],
      bedOrRoomName: '床位',
      selectedBeds: [],
      selectedOldBeds: '',
      itemData: {},
      bedOrRoomObj: {},
      userObj: {},
      modelName: '排床',
      formSearchData: {
        businessType: 'NURSE',
        targetDate: DateFormate.getNowFormatDate(new Date())
      },
      url: '/hsms/web-hs/schedule/NURSE/day',
      flag: 'true'
    }
  },
  created () {
    this.getModelType()
    this.getUser()
  },
  methods: {
    formateSpanList (val) {
      if (val === null || val === undefined || val === '') {
        return ''
      }
      if (typeof (val) === 'string') {
        val = JSON.parse(val)
      }
      let str = ''
      for (let i = 0; i < val.length; i++) {
        let item = val[i]
        str += item.beginTime + '-' + item.endTime + '，'
      }
      return str.substr(0, str.length - 1)
    },
    // 格式化工号
    formatKey (d) {
      let accountId = d.accountId
      return this.userObj[accountId] || ''
    },
    // 格式化床位或者房间
    formatBedOrRoom (d) {
      let data = d.relationList ? d.relationList : []
      let str = ''
      let _objList = []
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          let objId = item.objId
          if (this.nurseMode === 'BED') {
            for (let j = 0; j < this.BedOrRoomList.length; j++) {
              if (objId === this.BedOrRoomList[j].bedId) {
                _objList.push(this.BedOrRoomList[j])
              }
            }
          } else {
            for (let j = 0; j < this.BedOrRoomList.length; j++) {
              if (objId === this.BedOrRoomList[j].roomId) {
                _objList.push(this.BedOrRoomList[j])
              }
            }
          }
        }
        _objList.sort(function (a, b) {
          if (a.sort === null || b.sort === null) {
            return false
          } else {
            if (a.sort < b.sort) {
              return -1
            } else if (a.sort === b.sort) {
              return 0
            } else {
              return 1
            }
          }
        })
        for (let m = 0; m < _objList.length; m++) {
          if (this.nurseMode === 'BED') {
            str += _objList[m].bedName + ','
          } else {
            str += _objList[m].roomName + ','
          }
        }
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    // 排床
    setBed (item) {
      this.selectedOldBeds = ''
      let bedOrRoomList = item.relationList ? item.relationList : []
      this.setBedVisible = true
      this.itemData = item
      this.selectedBeds = bedOrRoomList
      bedOrRoomList.forEach((val, key) => {
        this.selectedOldBeds += ',' + val.objId
      })
      this.selectedOldBeds += ','
    },
    // 设置保存
    saveSetData () {
      this.saveData({ data: this.selectedBeds }, this.itemData.scheduleId)
    },
    // 取消
    cancelSetAdd () {
      this.setBedVisible = false
    },
    // 刷新
    refresh () {
      this.tabRefresh('third')
    },
    // 处理打印数据
    printData () {
      let obj = {}
      let thead = [{
        name: '工号'
      }, {
        name: '姓名'
      }, {
        name: '班次名称'
      }, {
        name: '工作时间'
      }, {
        name: this.nurseMode === 'BED' ? '床位' : '房间'
      }]
      let tbody = []
      let shiftSpanStr = ''
      let bedOrRoomStr = ''
      let relationList = []
      let shiftSpanList = []
      this.tableData.forEach((item, index) => {
        relationList = item.relationList
        bedOrRoomStr = ''
        if (relationList !== null && relationList.length > 0) {
          relationList.forEach((item, index) => {
            if (this.bedOrRoomObj[item.objId]) {
              bedOrRoomStr += this.bedOrRoomObj[item.objId] + ','
            }
          })
          bedOrRoomStr = bedOrRoomStr.substring(0, bedOrRoomStr.length - 1)
        }
        shiftSpanList = item.shiftSpanList
        shiftSpanStr = ''
        if (shiftSpanList.length > 0) {
          shiftSpanList.forEach((item, index) => {
            shiftSpanStr += item.beginTime + '-' + item.endTime + ','
          })
          shiftSpanStr = shiftSpanStr.substring(0, shiftSpanStr.length - 1)
        }
        tbody.push({
          accountId: this.formatKey(item),
          accountName: item.accountName,
          shiftName: item.shiftName,
          shiftSpanList: shiftSpanStr,
          bedOrRoomStr: bedOrRoomStr
        })
      })
      obj['thead'] = thead
      obj['tbody'] = tbody
      localStorage.setItem('tableDataBed', JSON.stringify(obj))
      window.open(`${window.location.origin}/#/shiftInformationBedPrint`)
    },
    // 导出
    exportDo () {
      window.open(`http://${window.location.host}/hsms/web-hs/schedule/${this.formSearchData.businessType}/day/export?businessType=${this.formSearchData.businessType}&targetDate=${this.formSearchData.targetDate}`)
    },
    // 获取用户
    getUser () {
      GetNurseUser(this.formSearchData.businessType).then(res => {
        res.forEach((item, key) => {
          this.userObj[item.empId] = item.empKey
        })
      })
    },
    // 获取床位
    getBed () {
      GetBed().then(res => {
        res.forEach((item, index) => {
          this.bedOrRoomObj[item.bedId] = item.bedName
          this.bedOrRoomList.push({
            objId: item.bedId,
            objName: item.bedName
          })
        })
        this.BedOrRoomList = res
      })
    },
    // 获取房间
    getRoom () {
      GetRoom().then(res => {
        res.forEach((item, index) => {
          this.bedOrRoomObj[item.roomId] = item.roomName
          this.bedOrRoomList.push({
            objId: item.roomId,
            objName: item.roomName
          })
        })
        this.BedOrRoomList = res
      })
    },
    // 获取模式
    getModelType () {
      GetModelType('NURSE').then(res => {
        let type = 'BED'
        if (res) {
          type = res.nurseMode
        }
        this.nurseMode = type
        if (type === 'ROOM') {
          this.bedOrRoomName = '房间'
          this.modelName = '排房'
          this.getRoom()
          this.getData()
        } else {
          this.getBed()
          this.getData()
        }
      })
    },
    // 处理选择数据
    dealSelData (item) {
      this.selectedBeds = []
      for (let p in item) {
        this.selectedBeds.push({
          scheduleId: this.itemData.scheduleId,
          nurseMode: this.nurseMode,
          dutyDate: this.itemData.dutyDate,
          objId: item[p].objId
        })
      }
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

  .dialog-footer .el-button--small {
    padding: 12px 20px !important;
  }

  /deep/ .el-table__body-wrapper {
    overflow: auto !important;
  }
</style>
