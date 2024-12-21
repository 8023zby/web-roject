/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi, AxiosJsonApi } from '../../../api/hsms'
import { ResultMsg } from '../js/Message'
import BaseManage from './BaseManage'
import { DateFormate } from '../unitils/unitils'

export default {
  data () {
    return {
      isLimit: false
    }
  },
  extends: BaseManage,
  methods: {
    // 请求列表
    getData () {
      this.loading = true
      AxiosApi(this.url, {}, 'GET', this.formSearchData).then(res => {
        this.loading = false
        let { data, desc } = res
        if (desc === 'true' || desc === true) {
          this.tableData = []
        } else {
          if (this.url === '/hsms/web-hs/schedule/NURSE/day') {
            data = data.data || []
            this.flag = res.data.flag || 'true'// false的时候，才可以选择操作和导出操作
          }
          this.tableData = data || []
        }
      })
    },
    // 保存数据
    saveData (data, scheduleId) {
      if (this.isLimit) {
        return
      }
      this.isLimit = true
      AxiosJsonApi('/hsms/web-hs/schedule/NURSE/put?scheduleId=' + scheduleId, data).then(res => {
        ResultMsg(res, this.modelName, this.refresh)
        this.isLimit = false
      }).catch(() => {
        this.isLimit = false
      })
    },
    // 清空值
    clearObj (data) {
      let temp = {}
      for (let p in data) {
        if (p === 'businessType') {
          temp[p] = this.formSearchData.businessType
        } else if (p === 'targetDate') {
          temp[p] = DateFormate.getNowFormatDate(new Date())
        } else {

        }
      }
      return temp
    },
    // 刷新页面
    reload () {
      this.formSearchData = this.clearObj(this.formSearchData)
      this.getData()
    },
    // 刷新页面
    refresh () {
      this.getData()
    }
  }
}
