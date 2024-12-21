/**
 * 通用的增删改查用到的方法和变量
 */
import {AxiosApi, GetDuty} from '../../../api/hsms'
import BaseManage from './BaseManage'

export default {
    extends: BaseManage,
    methods: {
        // 请求列表
        getData() {
            this.loading = true
            GetDuty().then(dutyData => {
                AxiosApi(this.url, {}, 'GET', this.formSearchData).then(res => {
                    this.loading = false
                    let {data} = res
                    this.dealData(data, dutyData)
                })
            })
        },
        // 数据处理
        dealData(data, dutyData) {
            let tbData = []
            let temp = {}
            let itemData = {}
            data.forEach((item, index) => {
                if (item.shiftCoefficient === '0') {
                    item.shiftCoefficient = ''
                }
                temp[item.shiftId] = {
                    shiftCoefficient: item.shiftCoefficient,
                    coefficientId: item.coefficientId
                }
            })
            dutyData.forEach((item, index) => {
                itemData = {}
                itemData['shiftName'] = item.shiftName
                itemData['shiftId'] = item.shiftId
                itemData['shiftCoefficient'] = temp[item.shiftId] ? temp[item.shiftId].shiftCoefficient : ''
                itemData['coefficientId'] = temp[item.shiftId] ? temp[item.shiftId].coefficientId : ''
                tbData.push(itemData)
            })
            this.tableData = tbData
            this.selectData = [...tbData]
        }
    }
}
