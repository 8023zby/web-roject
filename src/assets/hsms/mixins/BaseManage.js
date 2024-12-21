/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi, AxiosJsonApi } from '../../../api/hsms'
import { ResultMsg } from '../js/Message'
import { filterData } from '../unitils/unitils'

export default {
  data () {
    return {
      // 分页需要参数
      pageInfo: {
        currentPage: 1,
        size: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50]
      },
      // 加载项
      loading: false,
      // 是否分页
      isPage: true,
      // 添加加载项
      addVis: false,
      // 表格数据
      tableData: []
    }
  },
  methods: {
    // 查询
    onSearchSubmit (act = '') {
      if (act !== 'page') {
        this.pageInfo.currentPage = 1
      }
      this.getData()
    },
    // 请求列表
    getData () {
      // 用于子组件的更新
      if (this.subAssemblyShow !== 'NONE') {
        this.subAssemblyShow = false
      }
      this.loading = true
      let pageParam = {
        size: this.pageInfo.size,
        page: this.pageInfo.currentPage
      }
      let params = {}
      // 查询条件过滤 空的不传
      if (this.isPage) {
        params = Object.assign(pageParam, filterData(this.formSearchData))
      } else {
        params = filterData(this.formSearchData)
      }
      this.formSearchData.businessType = this.formSearchData.businessType ? this.formSearchData.businessType : 'NURSE'
      AxiosApi(this.url + '/' + this.formSearchData.businessType, {}, 'GET', params).then(res => {
        this.loading = false
        if (res.status === 200) {
          let { data } = res
          let list = []
          let total = 0
          if (this.isPage) {
            total = data.total
            list = data.list
          } else {
            list = data
            total = data.length
          }
          this.tableData = list
          this.pageInfo.total = total
          if (this.subAssemblyShow !== 'NONE') {
            this.subAssemblyShow = true
          }
        }
      })
    },
    // 保存数据
    saveData () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.saveDataDo(this.addFormData, this.actFlag)
        }
      })
    },
    // 删除
    del (data) {
      let businessType = this.businessType || this.formSearchData.businessType
      this.$confirm(`确认要删除此${this.modelName}?`, '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        AxiosApi(this.url + '/' + businessType, data, 'DELETE').then(res => {
          ResultMsg(res, `删除${this.modelName}`, this.reload)
        })
      })
    },
    // 保存数据
    saveDataDo (data, act, params = {}, isOne = true) {
      let businessType = this.businessType || this.formSearchData.businessType
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
      AxiosJsonApi(this.url + '/' + businessType, addData, methodType, params).then(res => {
        if (isOne) {
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl)
        } else {
          ResultMsg(res, actMsg + this.modelName, this.refresh)
        }
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
    // 清空值
    clearObj (data) {
      let temp = {}
      for (let p in data) {
        if (p === 'businessType') {
          temp[p] = this.formSearchData.businessType
        } else {
          temp[p] = ''
        }
      }
      return temp
    },
    // 刷新页面
    reload () {
      this.formSearchData = this.clearObj(this.formSearchData)
      this.getData()
    },
    // 返回
    reloadUrl () {
      let businessType = this.businessType || this.formSearchData.businessType
      this.$emit('option-changed', 'list', { businessType: businessType })
    },
    // 页面整体刷新
    reloadMain () {
      this.$emit('main-reload')
    }
  }
}
