/**
 * 通用的增删改查用到的方法和变量
 */
import { _delete, _get, _post, _put } from '../../../api/bnms/http'
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
      authorityArr: []
    }
  },
  methods: {
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
      const pageParam = {
        size: this.pageInfo.size,
        page: this.pageInfo.currentPage
      }
      // 查询条件过滤 空的不传
      const params = Object.assign(pageParam, this.filterData(this.formSearchData), (this.formSearchDataStatic || {}))
      _get({
        url: this.url,
        data: params
      }).then(res => {
        this.loading = false
        if (res.status === 200) {
          const { data } = res
          const { list, total } = data
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
        _delete({
          url: url,
          data: data
        }).then(res => {
          // 删除的返回代码是500，被拦截
          ResultMsg(res, `删除${this.modelName}`, this.reloadDel)
        }).catch((error) => {
          ResultMsg(error, `删除${this.modelName}`, this.reloadDel)
        })
      }).catch(() => { })
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
    async detail (id, params = {}) {
      await _get({
        url: `${this.url}/${id}`,
        data: params
      }).then(res => {
        Object.assign(this.addFormData, res.data)
      })
    },
    // 保存数据
    add (data, params = {}, url) {
      if (!url) {
        url = this.url
      }
      const actMsg = '添加'
      const addData = this.filterData(data)

      this.addVis = true
      _post({
        url: url,
        data: addData
      }).then(res => {
        ResultMsg(res, actMsg + this.modelName, this.reloadAdd)
        if (res.status !== 200) {
          this.addVis = false
        }
      }).catch((res) => {
        this.addVis = false
        ResultMsg(res, actMsg + this.modelName, this.reloadAdd)
      })
    },
    // 修改数据
    edit (data, params = '', url) {
      if (!url) {
        url = this.url
      }

      const actMsg = '修改'
      if (params !== '') {
        url = `${url}/${params}`
      }
      this.addVis = true
      _put({
        url: url,
        data: data
      }).then(res => {
        ResultMsg(res, actMsg + this.modelName, this.reloadUrl)
        if (res.status !== 200) {
          this.addVis = false
        }
      }).catch((error) => {
        ResultMsg(error, actMsg + this.modelName, this.reloadUrl)
      })
    },
    // 清空值
    clearObj (data) {
      const temp = {}
      for (const p in data) {
        if (p !== 'sortValue') {
          temp[p] = ''
        } else {
          temp[p] = 'updateTime desc'
        }
      }
      return temp
    },
    // 过滤空值
    filterData (data) {
      const temp = {}
      for (const p in data) {
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
      const arr = []
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
      const arr = this.multipleSelectionArr
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex === arr[i]) {
          return 'typt-row-color'
        }
      }
    }
  }
}
