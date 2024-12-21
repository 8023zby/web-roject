/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi, AxiosJsonApi } from '../../../api/hsms'
import { MsgShow } from '../js/Message'
import BaseManage from './BaseManage'
import { filterData } from '../../../assets/hsms/unitils/unitils'

export default {
  extends: BaseManage,
  data () {
    return {
      selectShow: false,
      dutyData: [],
      selectedData: [],
      userData: [],
      exportDesc: false,
      delKey: {},
      tableVis: false,
      flag: true
    }
  },
  methods: {
    // 请求列表
    async getData () {
      this.loading = true
      await AxiosApi(this.url + '/' + this.formSearchData.businessType, {}, 'GET', this.formSearchData).then(async res => {
        this.loading = false
        let { data, desc } = res
        let flag = data.flag || 'false'
        if (res.data.flag === 'false') {
          this.flag = false
        } else {
          this.flag = true
        }
        if (desc === 'true') {
          this.exportDesc = true
        } else {
          this.exportDesc = false
        }
        // 排班流水的多返回了一层，做下特殊处理
        if (this.url === '/hsms/web-hs/schedule') {
          data = data.data
        }
        this.dealData(data || [])
        // 如是从排班流水中获取的数据，把查询的数据保存下
        if (flag === 'true' && data && data.length > 0) {
          await this.saveDataList()
        }
      })
    },
    // 复制排班
    copyData () {
      AxiosApi('/hsms/web-hs/schedule/' + this.formSearchData.businessType + '/copy', {
        beginDate: this.formSearchData.beginDate,
        endDate: this.formSearchData.endDate
      }).then(res => {
        this.loading = false
        let { data, desc, status } = res
        if (status !== 200) {
          MsgShow('warning', desc)
          return
        }
        this.dealData(data || [])
      })
    },
    // 编辑排班规则
    setDuty () {
      this.selectShow = true
    },
    // 数据处理
    dealData (data) {
      let dutyObj = {}
      let curWeek = this.weekData
      let userData = this.userData
      let tbData = []
      let itemData = {}
      data.forEach((item, index) => {
        if (this.typeStr === 'rule') {
          dutyObj[item.accountId + item.dutyWeek] = {
            // deptId: item.deptId ||'',
            shiftId: item.shiftId || '',
            shiftName: item.shiftName || ''
          }
        } else {
          dutyObj[item.accountId + item.dutyDate] = {
            // deptId: item.deptId ||'',
            shiftId: item.shiftId || '',
            bedList: item.relationList || [],
            shiftName: item.shiftName || ''
          }
        }
      })
      userData.forEach((item, index) => {
        itemData = {}
        if (this.delKey[item.empId]) {
          return true
        }
        itemData['empKey'] = item.empKey
        itemData['accountName'] = item.empName
        itemData['accountId'] = item.empId
        for (let i = 0; i < curWeek.length; i++) {
          itemData[curWeek[i].id] = dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].shiftName : ''
          itemData[curWeek[i].id + '__shiftId'] = dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].shiftId : ''
          itemData[curWeek[i].id + '__bedList'] = dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].bedList : []
          if (this.typeStr === 'rule') {
            this.selectedData.push({
              // deptId: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].deptId : '',
              accountId: item.empId,
              dutyWeek: curWeek[i].id,
              empKey: item.empKey,
              accountName: item.empName,
              shiftId: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].shiftId : '',
              shiftName: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].shiftName : '',
              sort: i + 1
            })
          } else {
            this.selectedData.push({
              // deptId: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].deptId : '',
              accountId: item.empId,
              dutyDate: curWeek[i].id,
              empKey: item.empKey,
              accountName: item.empName,
              shiftId: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].shiftId : '',
              shiftName: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].shiftName : '',
              sort: i + 1
            })
          }
        }
        tbData.push(itemData)
      })
      this.tableData = tbData
      this.tableVis = true
    },
    // 保存
    async saveDataList () {
      let params = {}
      params = {
        beginDate: this.formSearchData.beginDate,
        endDate: this.formSearchData.endDate
      }
      await this.saveDataDo1({ data: this.selectedData }, 'add', params)
    },
    // 保存数据
    async saveDataDo1 (data, act, params = {}) {
      let methodType = 'POST'
      let actMsg = '添加'
      let addData = filterData(data)
      await AxiosJsonApi(this.url + '/' + this.formSearchData.businessType, addData, methodType, params).then(res => {
        if (res.status === 200) {
          console.log(actMsg + this.modelName + '成功')
        } else {
          console.log(actMsg + this.modelName + '失败')
        }
      })
    }
  }
}
