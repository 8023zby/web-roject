export default {
  data () {
    return {
      pageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      // 加载项
      loading: false,
      // 表格数据
      tableData: [],
      // 表格复选结果
      multipleSelection: []
    }
  },
  methods: {
    searchSubmit () {
      !this.loadData && console.error('loadData 方法不存在')
      this.loadData && this.loadData()
    },
    searchReset () {
      this.$refs.searchForm.resetFields()
      !this.loadData && console.error('loadData 方法不存在')
      this.loadData && this.loadData()
    },
    getRowKeys (row) {
      !this.rowKey && console.error('rowKey 参数不存在')
      return row[this.rowKey]
    },
    handleSizeChange (val) {
      this.pageInfo.size = val
      Object.assign(this.searchForm, this.pageInfo)
      this.loadData && this.loadData()
    },
    handleCurrentChange (val) {
      this.pageInfo.page = val
      Object.assign(this.searchForm, this.pageInfo)
      this.loadData && this.loadData()
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
