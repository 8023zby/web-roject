/*
 * @Author: 杨星波
 * @Owner:
 * @Date: 2021-11-09 08:43:19
 * @LastEditTime: 2021-12-16 14:24:32
 * @LastEditors: 杨星波
 * @Description:
 * @FilePath: \develop_sams\src\assets\hsms\mixins\ShiftMerits.js
 */
/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi } from '../../../api/hsms'
import BaseManage from './BaseManage'

export default {
  extends: BaseManage,
  methods: {
    // 请求列表
    getData () {
      this.loading = true
      AxiosApi(this.url + '/' + this.formSearchData.businessType, {}, 'GET', this.formSearchData).then(res => {
        this.loading = false
        let data = res.data || []
        this.banData = data
        this.dealData(data)
      })
    },
    // 数据处理
    dealData (data) {
      let titData = this.titData
      let userData = this.userData
      let tbData = []
      let itemData = {}
      let temp = {}
      let dataItem = []
      data.forEach((item, index) => {
        dataItem = item.shiftList
        dataItem.forEach((val, key) => {
          temp[item.accountId + '__' + val.shiftId] = val.dutyAssessment
          temp[item.accountId + '__hierarchyCoefficient'] = item.hierarchy.hierarchyCoefficient
          temp[item.accountId + '__qcCoefficient'] = item.hierarchy.qcCoefficient
          temp[item.accountId + '__teachingCoefficient'] = item.hierarchy.teachingCoefficient
          temp[item.accountId + '__assessmentTotal'] = item.assessmentTotal
          temp[item.accountId + '__attendanceCount'] = item.attendanceCount
        })
      })
      userData.forEach((item, index) => {
        itemData = {}
        itemData['accountId'] = item.empId
        itemData['accountName'] = item.empName
        titData.forEach((value, key) => {
          itemData[value.shiftId] = temp[item.empId + '__' + value.shiftId] ? temp[item.empId + '__' + value.shiftId] : ''
        })
        tbData.push(itemData)
      })
      this.tableData = tbData
    }
  }
}
