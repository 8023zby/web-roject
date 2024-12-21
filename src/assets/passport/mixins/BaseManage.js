/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http'
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
      tableData: [],
      // 多选集合
      multipleSelectionArr: [],
      multipleSelection: [],
      // 主键id
      primaryId: 'id',
      authorityObj: {},
      authorityArr: [],
      landingEndCode: ''
    }
  },
  methods: {
    // 获取登录应用标识
    getLandingEndCode () {
      let codeStr = localStorage.getItem('selectLandingEndInfo')
      if (codeStr !== '' && codeStr !== null) {
        let tempInfo = JSON.parse(codeStr)
        this.landingEndCode = tempInfo.landingEndCode
      }
    },
    // 请求列表中动作权限
    getListAuthority () {
      this.authorityObj = this.checkMoreAuthority(this.authorityArr)
    },
    // 排序查询查询
    queryByOrder (val) {
      this.formSearchDataStatic.orderBy = val
      this.onSearchSubmit()
    },
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
      // 查询条件过滤 空的不传
      let params = Object.assign(pageParam, this.filterData(this.formSearchData), (this.formSearchDataStatic || {}))
      AxiosApi(this.url, {}, 'GET', params).then(res => {
        this.loading = false
        if (res.status === 200) {
          let { data } = res
          let { list, total } = data
          this.tableData = list
          this.pageInfo.total = total
          if (this.subAssemblyShow !== 'NONE') {
            this.subAssemblyShow = true
          }
        }
      })
    },
    // 删除
    del (url, data = {}) {
      if (!url) {
        url = this.url
      }
      this.$confirm(`确定要删除此${this.modelName}?`, '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        AxiosApi(url, data, 'DELETE').then(res => {
          ResultMsg(res, `删除${this.modelName}`, this.reloadDel)
        })
      }).catch(() => {})
    },
    // 删除时候判断是否需要重新分页
    reloadDel () {
      // 如果是最后一页最后一条 跳转上一页
      if ((this.pageInfo.total - (this.pageInfo.currentPage - 1) * this.pageInfo.size) === 1) {
        this.pageInfo.currentPage--
      }
      if (this.pageInfo.currentPage < 1) {
        this.pageInfo.currentPage = 1
      }
      this.onSearchSubmit('page')
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
        ResultMsg(res, actMsg + this.modelName, this.reloadAdd)
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
        temp[p] = data[p]
      }
      return temp
    },
    // 刷新页面
    reload () {
      this.formSearchData = this.clearObj(this.formSearchData)
      this.onSearchSubmit()
    },
    // 返回
    reloadUrl () {
      if (this.editBackList) {
        this.editBackList()
      } else {
        this.$emit('option-changed', 'list')
      }
    },
    // 添加会列表跳首页
    reloadAdd () {
      this.$emit('option-changed', 'list', { fromAdd: true })
    },
    // 页面整体刷新
    reloadMain () {
      this.$emit('main-reload')
    },
    // 分页序号显示问题
    indexMethod (index) {
      index = (index + 1) + (this.pageInfo.currentPage - 1) * this.pageInfo.size
      return index
    },
    // 通用表格点击样式处理
    handleSelectionChange (val) {
      this.multipleSelection = val
      let arr = []
      val.forEach((val) => {
        this.tableData.forEach((v, i) => {
          // id 是每一行的数据id
          if (val[this.primaryId] === v[this.primaryId]) {
            arr.push(i)
          }
        })
      })
      this.multipleSelectionArr = arr
    },
    tableRowClassName ({ row, rowIndex }) {
      let arr = this.multipleSelectionArr
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex === arr[i]) {
          return 'typt-row-color'
        }
      }
    }
  }
}
