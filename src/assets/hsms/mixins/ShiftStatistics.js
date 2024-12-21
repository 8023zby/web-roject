/**
 * 通用的增删改查用到的方法和变量
 */
import {AxiosApi} from '../../../api/hsms'
import BaseManage from './BaseManage'

export default {
    extends: BaseManage,
    methods: {
        // 请求列表
        getData() {
            this.loading = true
            AxiosApi(this.url, {}, 'GET', this.formSearchData).then(res => {
                this.loading = false
                let data = res.data || []
                this.dealData(data)
            })
        },
        // 数据处理
        dealData(data) {
            let temp = {}
            let dutyData = this.dutyData
            let userData = this.userData
            let tbData = []
            let itemData = {}
            let dataItem = []
            let empId = this.userArr.join(',')
            let shiftId = this.shiftArr.join(',')
            data.forEach((item, index) => {
                dataItem = item.shiftList
                dataItem.forEach((val, key) => {
                    if (shiftId !== '' && shiftId.indexOf(val.shiftId) === -1) {

                    } else {
                        temp[item.accountId + '__' + val.shiftId] = val.dutyCount
                        if (!temp[item.accountId + '__allCount']) {
                            temp[item.accountId + '__allCount'] = 0
                        }
                        // 白班
                        if (val.shiftType === 'DAY') {
                            if (!temp[item.accountId + '__weekDayCount']) {
                                temp[item.accountId + '__weekDayCount'] = 0
                            }
                            temp[item.accountId + '__weekDayCount'] += parseFloat(val.dutyCount) * parseFloat(val.workHours)
                            temp[item.accountId + '__allCount'] += parseFloat(val.dutyCount) * parseFloat(val.workHours)
                        } else if (val.shiftType === 'NIGHT') {
                            if (!temp[item.accountId + '__weekNightCount']) { // 夜班
                                temp[item.accountId + '__weekNightCount'] = 0
                            }
                            temp[item.accountId + '__weekNightCount'] += parseFloat(val.dutyCount) * parseFloat(val.workHours)
                            temp[item.accountId + '__allCount'] += parseFloat(val.dutyCount) * parseFloat(val.workHours)
                        } else if (val.shiftType === 'LEAVE') { // 请假
                            if (!temp[item.accountId + '__leaveCount']) {
                                temp[item.accountId + '__leaveCount'] = 0
                            }
                            temp[item.accountId + '__leaveCount'] += parseFloat(val.dutyCount) * parseFloat(val.workHours)
                        } else if (val.shiftType === 'REST') { // 休班
                            if (!temp[item.accountId + '__restCount']) {
                                temp[item.accountId + '__restCount'] = 0
                            }
                            temp[item.accountId + '__restCount'] += parseFloat(val.dutyCount) * parseFloat(val.workHours)
                            temp[item.accountId + '__allCount'] += parseFloat(val.dutyCount) * parseFloat(val.workHours)
                        }
                        if ((temp[item.accountId + '__allCount'] - (temp[item.accountId + '__restCount'] || 0)) > 4 * this.weekStandard) {
                            if (!temp[item.accountId + '__workCount']) {
                                temp[item.accountId + '__workCount'] = 0
                            }
                            temp[item.accountId + '__workCount'] = temp[item.accountId + '__allCount'] - 4 * this.weekStandard - (temp[item.accountId + '__restCount'] || 0)
                        }
                    }
                })
            })
            userData.forEach((item, index) => {
                itemData = {}
                if (empId !== '' && empId.indexOf(item.empId) === -1) {

                } else {
                    itemData['accountName'] = item.empName
                    dutyData.forEach((value, key) => {
                        itemData[value.shiftId] = temp[item.empId + '__' + value.shiftId] ? temp[item.empId + '__' + value.shiftId] : ''
                    })
                    itemData['weekDayCount'] = temp[item.empId + '__weekDayCount'] ? temp[item.empId + '__weekDayCount'].toFixed(2) : ''
                    itemData['weekNightCount'] = temp[item.empId + '__weekNightCount'] ? temp[item.empId + '__weekNightCount'].toFixed(2) : ''
                    itemData['leaveCount'] = temp[item.empId + '__leaveCount'] ? temp[item.empId + '__leaveCount'].toFixed(2) : ''
                    itemData['restCount'] = temp[item.empId + '__restCount'] ? temp[item.empId + '__restCount'].toFixed(2) : ''
                    itemData['workCount'] = temp[item.empId + '__workCount'] ? temp[item.empId + '__workCount'].toFixed(2) : ''
                    itemData['allCount'] = temp[item.empId + '__allCount'] ? temp[item.empId + '__allCount'].toFixed(2) : ''
                    tbData.push(itemData)
                }
            })
            this.tableData = tbData
        }
    }
}
