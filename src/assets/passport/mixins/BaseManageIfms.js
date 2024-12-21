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
      // 添加时的加载项
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
        // this.landingEndCode = 'OPEX'
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
      let params = Object.assign(pageParam, this.filterData(this.formSearchData), this.formSearchDataStatic)
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
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        AxiosApi(url, data, 'DELETE').then(res => {
          ResultMsg(res, `删除${this.modelName}`, this.reloadDel)
        }).catch(() => {})
      })
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
    // 保存数据
    saveDataDo (data, act, params = {}, isOne = true) {
      let methodType = 'POST'
      let actMsg = '添加'
      let addData
      if (!act) {
        act = 'add'
      }
      if (act === 'add') {
        addData = this.filterData(data)
      } else if (act === 'modify' || act.indexOf('sort') > -1) {
        methodType = 'PUT'
        actMsg = '修改'
        addData = data
      }
      let msg = actMsg + this.modelName
      if (act === 'sort') {
        msg = '排序'
      } else if (act === 'sortDelete') {
        msg = '删除'
      }
      this.addVis = true
      AxiosJsonApi(this.url, addData, methodType, params).then(res => {
        if (isOne) {
          ResultMsg(res, msg, this.reloadUrl)
        } else {
          ResultMsg(res, msg, this.reloadMain)
        }
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
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
    // 清空值
    clearObj (data) {
      let temp = {}
      for (let p in data) {
        temp[p] = ''
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
      this.$emit('option-changed', 'list')
    },
    // 页面整体刷新
    reloadMain () {
      this.$emit('main-reload')
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
