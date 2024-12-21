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
            this.formSearchData.businessType = this.formSearchData.businessType ? this.formSearchData.businessType : 'NURSE';
            AxiosApi(this.url + '/' + this.formSearchData.businessType, {}, 'GET').then(res => {
                this.loading = false
                let {data} = res
                this.dealData(data)
            })
        },
        // 数据处理
        dealData(data) {
            let levelObj = {}
            let userData = this.userData
            let tbData = []
            let itemData = {}
            data.forEach((item, index) => {
                levelObj[item.accountId] = {
                    hierarchyDescribe: item.hierarchyDescribe || '',
                    hierarchyId: item.hierarchyId || '',
                    hierarchyCoefficient: item.hierarchyCoefficient || '',
                    hierarchyName: item.hierarchyName || '',
                    postId: item.postId || '',
                    postCoefficient: item.postCoefficient || '',
                    postName: item.postName || '',
                    qcCoefficient: item.qcCoefficient || '',
                    teachingCoefficient: item.teachingCoefficient || ''
                }
            })
            userData.forEach((item, index) => {
                itemData = {}
                itemData['accountId'] = item.empId
                itemData['accountName'] = item.empName
                itemData['hierarchyDescribe'] = levelObj[item.empId] ? levelObj[item.empId].hierarchyDescribe : ''
                itemData['hierarchyName'] = levelObj[item.empId] ? levelObj[item.empId].hierarchyName : ''
                itemData['hierarchyId'] = levelObj[item.empId] ? levelObj[item.empId].hierarchyId : ''
                itemData['hierarchyCoefficient'] = levelObj[item.empId] ? levelObj[item.empId].hierarchyCoefficient : ''
                itemData['postId'] = levelObj[item.empId] ? levelObj[item.empId].postId : ''
                itemData['postName'] = levelObj[item.empId] ? levelObj[item.empId].postName : ''
                itemData['postCoefficient'] = levelObj[item.empId] ? levelObj[item.empId].postCoefficient : ''
                itemData['qcCoefficient'] = levelObj[item.empId] ? levelObj[item.empId].qcCoefficient : ''
                itemData['teachingCoefficient'] = levelObj[item.empId] ? levelObj[item.empId].teachingCoefficient : ''
                tbData.push(itemData)
            })
            this.tableData = tbData
            this.selectedData = [...tbData]
        }
    }
}
