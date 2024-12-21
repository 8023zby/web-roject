/**
 * 适用于一个一个查询对象+一个分页结果集展示的简单组件
 * 约束：
 * 寄主对象中应具有：
 * --this.queryCriteria : 表单查询对象封装
 * --this.initQueryCriteria() : 表单查询对象初始化函数
 * --this.executeQueryPage : 分页表单查询接口
 */

import {
  deepMerge
} from '../../../assets/wnms/utils'

export default {
  data () {
    const pagination = this.initPagination()
    return {
      autoRefresh: true,
      pagination: pagination
    }
  },
  activated () {
    if (this.autoRefresh) {
      this.executeQueryPage()
    }
  },
  methods: {
    stateDetect (result) {
      if (result.status === 200) {
        return true
      } else if (result.status === 200) {
        return false
      }
    },
    initPagination (pagination = {}) {
      return deepMerge(pagination, {
        total: 0,
        size: 10,
        page: 1,
        list: []
      })
    },
    resetHandler () {
      this.initQueryCriteria(this.queryCriteria)
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },
    queryHandler () {
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },
    createQueryParams (isPage = true) {
      if (isPage) {
        this.search.size = this.pagination.size
        this.search.page = this.pagination.page
      }

      var sh = {}
      for (const [key, val] of Object.entries(this.search)) {
        if (val !== '') {
          sh[key] = val
        }
      }
      return sh
    },
    queryResultHandler (result) {
      if (this.stateDetect(result)) {
        const res = result.data
        if (res == null) {
          this.$message({
            type: 'error',
            message: '后台返回数为NULL,请联系开发人员！'
          })
          return false
        }
        res.size = result.data.pageSize
        let d = deepMerge(this.pagination, result.data)
        return d
      } else {
        this.$message({
          type: 'error',
          message: '获取数据失败'
        })
      }
    },
    pageSizeChangeHandler (pageSize) {
      this.pagination.size = pageSize
      this.pagination.page = 1
      this.executeQueryPage()
    },
    pageChangeHandler (page) {
      this.pagination.page = page
      this.executeQueryPage()
    },
    sortChangeHandler ({
      column,
      prop,
      order
    }) {
      // ElementUI 目前并不支持远端多字段排序
      // sorts数组设计的目的是为了支持ElementUI后续拓展

      this.pagination.sorts = []
      // sorts = [type: 'ORDER_BY_DESC', field: ['name']]
      if (column) {
        this.pagination.sorts.push({
          field: [prop],
          type: order === 'descending' ? 'ORDER_BY_DESC' : 'ORDER_BY_ASC'
        })
      }
      this.pagination.page = 1
      this.executeQueryPage()
    },
    delHandler (index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        if (this.customDelHandler) {
          this.customDelHandler(index, row)
        } else {
          this.$message({
            type: 'info',
            message: '您未定义删除逻辑处理方法customDelHandler'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitData (T, msg = '确定要保存吗?') {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.handlerBtn(T)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 使用场景  后台返回数据后 判断是否成功 成功后重新请求一次最新列表数据
    // 可以用于 添加  修改  删除
    IsSuccess (data, callback) {
      if (data.status === 200) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        if (callback) {
          callback()
        } else {
          this.executeQueryPage()
        }
      } else {
        this.$message({
          type: 'error',
          message: '操作失败'
        })
      }
    },
    // 重置列表
    resetListHandler () {
      this.search = this.initQueryCriteria()
      this.initPagination()
      this.queryHandler()
    }

  }
}
