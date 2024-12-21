/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi } from '../../../api/hsms'
import { MsgShow } from '../js/Message'
import BaseManage from './BaseManage'

export default {
  extends: BaseManage,
  data () {
    return {
      selectShow: false,
      exportDesc: false
    }
  },
  methods: {
    // 请求列表
    getData () {
      this.loading = true
      AxiosApi(this.url + '/' + this.formSearchData.businessType, {}, 'GET', this.formSearchData).then(res => {
        this.loading = false
        let { data, desc, status } = res
        if (desc === true) {
          this.exportDesc = desc
        }
        if (status !== 200) {
          MsgShow('warning', desc)
          return
        }
        // 排班流水的多返回了一层，做下特殊处理
        if (this.url === '/hsms/web-hs/schedule') {
          data = data.data
        }
        this.dealData(data || [])
      })
    },
    // 复制排班
    copyData () {
      AxiosApi('/hsms/web-hs/schedule/' + this.formSearchData.businessType + '/copy', {
        beginDate: this.formSearchData.beginDate,
        endDate: this.formSearchData.endDate
      }).then(res => {
        this.loading = false
        let { data } = res
        this.dealData(data)
      })
    },
    // 编辑排班规则
    setDuty () {
      this.selectShow = true
    },
    // 数据处理
    dealData (data) {
      let dutyObj = {}
      let monthData = this.monthData
      let dutyData = this.dutyData
      let tbData = []
      let itemData = []
      data.forEach((item, index) => {
        if (this.typeStr === 'rule') {
          dutyObj[item.shiftId + item.dutyWeek] = {
            accountId: item.accountId || '',
            accountName: item.accountName || ''
          }
        } else {
          dutyObj[item.shiftId + item.dutyDate] = {
            accountId: item.accountId || '',
            accountName: item.accountName || ''
          }
        }
      })
      monthData.forEach((item, index) => {
        tbData.push([...[{ id: 'month-tit', val: '日期', name: '' }], ...item])
        dutyData.forEach((val, key) => {
          itemData.push({
            id: 'tit' + val.shiftId,
            val: val.shiftName,
            dateId: '',
            name: val.shiftId
          })
          item.forEach((v, k) => {
            let obj = {
              id: v.name,
              dateId: v.dateId,
              dateId1: v.dateId1,
              sort: parseInt(v.dateId) - this.firstDay + 1
            }
            if (this.typeStr === 'rule') {
              obj['val'] = v.name !== 'YH_EMPTY' && dutyObj[val.shiftId + v.dateId] ? dutyObj[val.shiftId + v.dateId].accountName : ''
              obj['name'] = v.name !== 'YH_EMPTY' && dutyObj[val.shiftId + v.dateId] ? dutyObj[val.shiftId + v.dateId].accountId : ''
            } else {
              obj['val'] = v.name !== 'YH_EMPTY' && dutyObj[val.shiftId + v.name] ? dutyObj[val.shiftId + v.name].accountName : ''
              obj['name'] = v.name !== 'YH_EMPTY' && dutyObj[val.shiftId + v.name] ? dutyObj[val.shiftId + v.name].accountId : ''
            }
            itemData.push(obj)
          })
          tbData.push(itemData)
          itemData = []
        })
      })
      this.selectedData = tbData
      this.tableData = tbData
    }
  }
}
