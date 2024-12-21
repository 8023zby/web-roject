<template>
  <!--医护排班-排班规则-周编辑-->
  <div class="typt-list-container">
    <!--列表-->
    <el-table
      v-uni="'bianjiyuepaibanguizeliebiao'"
      style="border-top: 1px solid #EBEEF5;"
      :data="tableData"
      :stripe="CONFIG.table.stripe"
      v-loading="loading"
      class="editShiftTable"
      height="80%"><!--border-->
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
                       :render-header="renderHeader"
                       :key="item.id"
                       :width="screenWidth > 1440 ? 150 : 90"
                       align="center"
                       :prop="item.id"
                       :label="item.name">
        <template slot-scope="scope">
          <shift-manage :type="'rule'"
                        :ref="index + '-' + scope.$index"
                        :id="index + '-' + scope.$index"
                        @dealSelData="dealSelData"
                        @dealSelFocus="dealSelFocus"
                        @clickShiftItem="clickShiftItem"
                        @dutyDataChange="dutyDataChange"
                        @changeCompose="changeCompose"
                        :dialogOpen="isShowDialog"
                        :srcData="scope.row"
                        :col="index"
                        :row="scope.$index"
                        :dataId="item.id"
                        :flag="selectShow"
                        :showDialog="shiftDialogItem.row == scope.$index && shiftDialogItem.col == index?true: false"
                        :dutyData="dutyData"/>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv" style="height: 50px;">
      <el-button v-uni="'hushiyuepaibanguizequxiao'" @click="refresh" style="width: 70px;height: 40px;">取消</el-button>
      <el-button v-uni="'hushiyuepaibanguizebaocun'" type="primary" @click="saveData" :loading="addVis" style="width: 70px;height: 40px;">保存</el-button>
    </div>
  </div>
</template>

<script>
import ShiftInformation from '../../../assets/hsms/mixins/NurseShiftInformation'
import ShiftManage from '../../../components/hsms/NurseShiftManager'
import SetConfig from '../../../components/hsms/SetConfig'
import DutyTypeSet from '../../../assets/hsms/mixins/DutyTypeSet'
import { AxiosJsonApi, GetDuty, GetNurseUser, GetComposeDuty } from '../../../api/hsms'
import { DateFormate, filterData } from '../../../assets/hsms/unitils/unitils'
import { ResultMsg } from '../../../assets/hsms/js/Message'
import config from '../../../assets/hsms/mixins/config'
import $ from 'jquery'
const moment = require('moment')

export default {
  name: 'NurseShiftInformationRule',
  components: {
    'shift-manage': ShiftManage,
    'set-config': SetConfig
  },
  mixins: [ShiftInformation, DutyTypeSet, config],
  // provide () {
  //   return {
  //     tabRefresh: this.reload,
  //     getBusinessType: this.getBusinessType
  //   }
  // },
  // inject: ['tabRefresh', 'getBusinessType'],
  data () {
    return {
      businessType: '',
      typeStr: 'rule',
      weekData: [],
      modelName: '排班规则',
      formSearchData: {
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/rule',
      select: {
        id: ''
      },
      /**
      * ------------------------------------------------------------------
      * 班次设置修改
      * ------------------------------------------------------------------
      */
      isShowDialog: false,
      shiftDialogItem: {},
      composeId: '', // 组合班次记录值，composeId
      screenWidth: window.outerWidth
    }
  },
  // 初始化
  created () {
    this.businessType = this.$route.params.businessType || 'NURSE'
    this.formSearchData.businessType = this.getBusinessType()
    this.initWeekData()
    this.getNurseUser()
    this.getDuty()
    this.selectShow = true
  },
  methods: {
    getBusinessType () {
      return this.businessType
    },
    // 标题头样式
    renderHeader (h, { column }) {
      let v = column.label
      return h('div', { style: 'line-height:20px;' }, [
        h('span', v)
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
          name: DateFormate.getDayName(d.getDay()) + '',
          date: d.getDate() + '/' + (d.getMonth() + 1),
          week: DateFormate.getDayName(d.getDay())
        })
        d.setDate(d.getDate() + 1)
      }
      return arr
    },
    initWeekData () {
      let curTime = DateFormate.getNowFormatDate(new Date(new Date().getTime()))
      this.weekData = this.getCurWeek(curTime)
      this.formSearchData.beginDate = DateFormate.getSunDay(0, curTime)
      this.formSearchData.endDate = DateFormate.getSunDay(6, curTime)
    },
    // 刷新页面
    refresh () {
      // this.tabRefresh('first', this.setParam.setFormData.scheduleMode)
      this.reloadUrl1()
    },
    // 保存
    saveData () {
      const selectData = this.selectedData.map(item => {
        item.dutyWeek = item.sort.toString()
        return item
      })
      this.saveDataDo1({ data: selectData }, 'add', {}, false)
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
    // 获取班次
    async getDuty () {
      try {
        let res1 = await GetDuty() // 获取普通排班
        let res2 = await GetComposeDuty() // 获取组合排班
        const resArr = [
          {
            shiftType: 'DAY',
            shiftTypeName: '白班:',
            list: [],
            checked: []
          },
          {
            shiftType: 'NIGHT',
            shiftTypeName: '夜班:',
            list: [],
            checked: []
          },
          {
            shiftType: 'REST',
            shiftTypeName: '休息:',
            list: [],
            checked: []
          },
          {
            shiftType: 'LEAVE',
            shiftTypeName: '请假:',
            list: [],
            checked: []
          },
          {
            shiftType: 'compose',
            shiftTypeName: '组合班次:',
            list: [],
            checked: []
          }
        ]
        res1.map(item => {
          resArr.map(v => {
            if (item.shiftType === v.shiftType) {
              v.list.push(item)
            }
          })
        })
        resArr.map(v => {
          if (v.shiftType === 'compose') {
            // 如果是组合班次的话把班次重新排序一下
            v.list = res2.data
            for (let itemSort of v.list) {
              itemSort.composeInfo.sort(function (x, y) {
                return x['sort'] - y['sort']
              })
            }
          }
        })
        this.dutyData = resArr
      } catch (error) {
      }
    },
    // 处理选择数据
    dealSelData (item, index) {
      this.selectedData[index] = item
    },
    dealSelFocus (id) {
      this.select.id = id
    },
    // 获取用户
    getNurseUser () {
      GetNurseUser(this.formSearchData.businessType).then(res => {
        this.userData = res
        this.onSearchSubmit()
      })
    },
    /**
    * ------------------------------------------------------------------
    * 打开班次库设置
    * ------------------------------------------------------------------
    */
    /**
     * @description: 点击单元格，打开班次库设置
     * @param {*} shiftDialogItem row,col获取定位
     * @return {*}
     */
    clickShiftItem (shiftDialogItem) {
      this.isShowDialog = false
      this.shiftDialogItem = shiftDialogItem
      setTimeout(() => {
        let dialog = $('.dialog-box')
        let td = dialog.closest('td')
        let table = $('.el-table__body-wrapper')
        let tableBody = $('.el-table__body')
        if (tableBody[0].offsetWidth !== table[0].scrollWidth) {
          let left = table[0].scrollWidth - tableBody[0].offsetWidth
          $('.duty-dialog').css({ left: `-${left}px` })
          $('.duty-dialog .arrow').css({ left: `${20 + left}px` })
        }
        let top = td[0].offsetTop
        let left = td[0].offsetLeft
        let height = top + dialog.innerHeight()
        let width = left + dialog.innerWidth()
        if (height > table.innerHeight() && width > table.innerWidth()) {
          table.animate({
            scrollTop: top + 'px',
            scrollLeft: left + 'px'
          }, 500)
          return
        }
        if (height > table.innerHeight()) {
          table.animate({
            scrollTop: top + 'px'
          }, 500)
        }
        if (width > table.innerWidth()) {
          table.animate({
            scrollLeft: left + 'px'
          }, 500)
        }
      })
    },
    /**
     * @description: 点击班次设置的checkbox（普通）
     * @param {*} shiftList 将要保存的数据
     * @param {*} position 定位到当前的位置
     * @return {*}
     */
    dutyDataChange (shiftList, position) {
      let selectedData = this.selectedData.filter(item => {
        if (
          item.sort === position.sort && item.accountId === position.accountId &&
          (item.dutyDate === position.dutyDate || item.dutyWeek === position.dutyWeek)
        ) {
          return false
        } else {
          return true
        }
      })
      this.selectedData = selectedData.concat(shiftList)
    },
    changeCompose (composeId, position) {
      let flag = 'add'
      if (!composeId) {
        if (!this.composeId) {
          return
        }
        composeId = this.composeId
        flag = 'del'
      }
      this.composeId = composeId
      let compose = null
      // 根据组合id找到组合班次
      this.dutyData.map(item => {
        if (item.shiftType === 'compose') {
          item.list.map(v => {
            if (v.composeId === composeId) {
              compose = v
            }
          })
        }
      })
      // 如果点击组合班次并且延续到下一周了,则停止时间要加上天数
      let diffDay = compose.composeInfo.length + position.sort - 1 - 7
      if (diffDay >= 1) {
        this.formSearchData.endDate = moment(this.formSearchData.endDate).add(diffDay, 'days').format('YYYY-MM-DD')
      }
      if (flag === 'del') {
        this.formSearchData.endDate = moment(this.formSearchData.beginDate).add(6, 'days').format('YYYY-MM-DD')
      }
      // 组合班次每一项匹配 只筛选状态不为0的
      compose.composeInfo.filter(x => x.status).map((shiftItem, shiftIndex) => {
        // 将所有的表格展示
        // 是否当前项是否在本周内
        let isInThisWeek = false
        if (position.sort + shiftIndex <= 7) {
          isInThisWeek = true
        }

        let shiftItemDetail = null
        this.dutyData.map(item => {
          if (item.shiftType !== 'compose') {
            if (flag === 'del') {
              if (shiftIndex === 0) {
                item.checked = item.checked.filter(v => v !== shiftItem.shiftId)
              }
              return
            }
            if (shiftIndex === 0) {
              item.checked = []
            }
            item.list.map(v => {
              if (v.shiftId === shiftItem.shiftId) {
                shiftItemDetail = v
                if (shiftIndex === 0) {
                  item.checked.push(v.shiftId)
                }
              }
            })
          }
        })
        let shiftList = []
        if (flag === 'add') {
          shiftList = [{ shiftSort: 1, shiftDetail: shiftItemDetail }]
          if (isInThisWeek) {
            this.$refs[`${position.col + shiftIndex}-${position.row}`][0].shiftList = shiftList
          }
        } else {
          if (isInThisWeek) {
            let shiftList = this.$refs[`${position.col + shiftIndex}-${position.row}`][0].shiftList
            shiftList = shiftList.filter((item, index) => {
              if (item.shiftDetail.shiftId === shiftItem.shiftId) {
                return false
              } else {
                return true
              }
            }).map((item, index) => {
              item.shiftSort = index + 1
              return item
            })
            this.$refs[`${position.col + shiftIndex}-${position.row}`][0].shiftList = shiftList
          }
        }
        // 排班规则中使用组合排班 如果超过本周的截断忽略掉
        if (!isInThisWeek) return false
        // 本周的继续执行，解析成为接口需要的格式插入集合
        let shiftDataArr = []
        let sort = (position.sort + shiftIndex) % 7 === 0 ? 7 : (position.sort + shiftIndex) % 7
        let dutyDate = moment(this.formSearchData.beginDate).add(position.sort + shiftIndex - 1, 'days').format('YYYY-MM-DD')
        shiftList.map((item, index) => {
          shiftDataArr.push({
            accountId: position.accountId,
            accountName: position.accountName,
            shiftId: item.shiftDetail.shiftId,
            shiftName: item.shiftDetail.shiftName,
            sort,
            shiftSort: item.shiftSort || index + 1,
            dutyDate,
            dutyWeek: dutyDate
          })
        })
        // 保存到 selectedData
        this.dutyDataChange(shiftDataArr, {
          sort,
          accountId: position.accountId,
          dutyDate,
          dutyWeek: dutyDate
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .shift-button {
    width: 80px;
    height: 28px;
    /*line-height: 14px;*/
    text-align: center;
    /*padding: 6px 0 !important;*/
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
    margin-top: 10px;
  }

  .action_div {
    text-align: right;
    position: relative;
    height: 30px;

    .model_cls {
      position: absolute;
      right: 240px;
      font-size: 14px;
      width: 150px;
      top: 5px;
    }
  }

  /deep/ el-table {
    border-top: 1px solid #EBEEF5;
  }
  /**
  * ------------------------------------------------------------------
  * 表格样式
  * ------------------------------------------------------------------
  */
  .editShiftTable {
    // td边框去掉
    /deep/ tr td {
      padding: 0!important;
      height: auto;
    }
  }
  .header {
    height: 54px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 18px;
  }

  /deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #fff;
  }
  /deep/ .el-table__body-wrapper {
    overflow: auto;
  }
  /deep/ .el-table__body-wrapper {
    height: calc(100% - 50px) !important;
  }
  /**
  * ------------------------------------------------------------------
  * 班次库设置
  * ------------------------------------------------------------------
  */
  .duty-dialog {
    position: fixed;
    background: #fff;
  }
  /deep/ .editShiftTable tr:hover {
    transform: none;
    box-shadow: none;
  }
  /deep/ .el-table .cell {
    overflow: initial;
    padding-left: 5px;
    padding-right: 5px;
  }
</style>
