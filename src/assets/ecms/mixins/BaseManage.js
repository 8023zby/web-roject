/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi, AxiosJsonApi } from '../../../api/ecms/http'
import { ResultMsg } from '../js/Message'
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
      // 添加加载项
      addVis: false,
      // 表格数据
      tableData: []
    }
  },
  methods: {
    // 查询
    onSearchSubmit () {
      this.pageInfo.currentPage = 1
      this.getData()
    },
    getDeviceType () {
      AxiosApi(this.urlDevice, {}, 'GET', {}).then(res => {
        if (res.status === 200) this.deviceType = res.data
      })
    },
    clsHandler () {
      this.formSearchData = {}
      this.refreshDate()
      this.onSearchSubmit()
    },
    // 请求列表
    getData (params, callback) {
      let selectDeptInfo = JSON.parse(localStorage.getItem('selectDeptInfo'))
      // 用于子组件的更新
      if (this.subAssemblyShow !== 'NONE') {
        this.subAssemblyShow = false
      }
      this.loading = true
      /* let pageParam = {
        size: this.pageInfo.size,
        page: this.pageInfo.currentPage,
        deviceType: '',
        deptId: selectDeptInfo.deptId || ''
      } */
      // 查询条件过滤 空的不传
      // let params = Object.assign(pageParam, this.filterData(this.formSearchData), (this.formSearchDataStatic || {}))
      AxiosApi(this.url, {}, 'GET', params).then(res => {
        this.loading = false
        if (callback)callback(res)
        if (this.subAssemblyShow !== 'NONE') {
          this.subAssemblyShow = true
        }
      })
    },
    // 删除
    del (url, data = {}) {
      if (!url) {
        url = this.url
      }
      this.$confirm(`确定要删除此${this.modelName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        AxiosApi(url, data, 'DELETE').then(res => {
          ResultMsg(res, `删除${this.modelName}`, this.reload)
        })
      })
    },
    // 查看详情
    detail (id, params = {}) {
      AxiosApi(`${this.url}/${id}`, {}, 'GET', params).then(res => {
        Object.assign(this.addFormData, res.data)
      })
    },
    // 保存数据
    add (data, params = {}, url) {
      if (!url) {
        url = this.url
      }
      let methodType = 'POST'
      let actMsg = '添加'
      let addData = this.filterData(data)
      this.addVis = true
      AxiosJsonApi(url, addData, methodType, params).then(res => {
        ResultMsg(res, actMsg + this.modelName, this.reloadUrl)
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
    // 修改数据
    edit (data, params = '', url) {
      if (!url) {
        url = this.url
      }
      let methodType = 'PUT'
      let actMsg = '修改'
      if (params !== '') {
        url = `${url}/${params}`
      }
      this.addVis = true
      AxiosJsonApi(url, data, methodType).then(res => {
        ResultMsg(res, actMsg + this.modelName, this.reloadUrl)
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
    // 清空值
    clearObj (data) {
      let temp = {}
      for (let p in data) {
        temp[p] = ''
      }
      return temp
    },
    // 过滤空值
    filterData (data) {
      let temp = {}
      for (let p in data) {
        if (data[p] === '') {
          continue
        }
        if (p === 'answerStatus') {
          temp[p] = data[p] === 1
        } else {
          temp[p] = data[p]
        }
        console.log(p)
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
      if (this.editBackList) {
        this.editBackList()
      } else {
        this.$emit('option-changed', 'list')
      }
    },
    // 页面整体刷新
    reloadMain () {
      this.$emit('main-reload')
    }
  }
}
