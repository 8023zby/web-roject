/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosJsonApi, GetModelType } from '../../../api/hsms'
import { ResultMsg } from '../js/Message'

export default {
  data () {
    return {
      setParam: {
        setFormVisible: false,
        setFormData: {
          scheduleMode: ''
        },
        getSetData: {
          scheduleMode: ''
        },
        modelType: 'MONTH',
        modelObj: {
          'WEEK': '按周排班',
          'MONTH': '按月排班'
        }
      }
    }
  },
  created () {
    this.formSearchData.businessType = this.getBusinessType()
    this.getModelType()
  },
  methods: {
    // 设置保存
    saveSetData () {
      let method = 'POST'
      let dpId = this.setParam.getSetData.deptId || ''
      if (dpId !== '') {
        method = 'PUT'
      }
      this.addVis = true
      this.formSearchData.businessType = this.formSearchData.businessType ? this.formSearchData.businessType : 'NURSE'
      AxiosJsonApi(
        '/hsms/web-hs/dept/config/' + this.formSearchData.businessType,
        this.setParam.setFormData,
        method
      ).then(res => {
        ResultMsg(res, '设置', this.refresh)
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
    // 取消
    cancelSetAdd () {
      this.addVis = false
      this.setParam.setFormVisible = false
    },
    // 设置
    showSet () {
      this.setParam.setFormData = { ...this.setParam.getSetData }
      this.setParam.setFormVisible = true
    },
    // 处理数据
    dealSetData (val) {
      this.setParam.setFormData.scheduleMode = val
    },
    // 获取模式
    getModelType () {
      this.formSearchData.businessType = this.formSearchData.businessType ? this.formSearchData.businessType : 'NURSE'
      GetModelType(this.formSearchData.businessType).then(res => {
        if (res) {
          this.setParam.modelType = res.scheduleMode || 'WEEK'
          this.setParam.getSetData = res
          this.setParam.setFormData = res
        }
      })
    }
  }
}
