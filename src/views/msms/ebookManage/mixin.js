import { geteEbooksType, getEbooksList } from '@/api/msms/ebooks/index.js'
const mixin = {
  data () {
    return {
      ebookType: [],
      tableData: [],
      tableSortData: [],
      tableTotal: 0,
      typeTotal: 0
    }
  },
  methods: {
    // 获取电子书分类
    getebooksType () {
      geteEbooksType({
      }).then(res => {
        if (res.status === 200) {
          this.ebookType = res.data
        }
      }).catch(error => {
        this.$message.error(JSON.stringify(error) + '数据获取失败')
      })
    },
    // 获取电子书列表
    getEbooksList (data) {
      getEbooksList(data).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.tableTotal = res.data.total
        }
      }).catch(error => {
        this.$message.error(JSON.stringify(error) + '数据获取失败')
      })
    },
    getSortList (data) {
      getEbooksList(data).then(res => {
        if (res.status === 200) {
          // 电子书列表排序数据
          this.tableSortData = res.data
        }
      }).catch(error => {
        this.$message.error(JSON.stringify(error) + '数据获取失败')
      })
    },
    // 获取电子书分类顺序
    getTypeSort (data) {
      geteEbooksType(data).then(res => {
        if (res.status === 200) {
          // 电子书分类数据
          this.tableSortType = res.data
        }
      }).catch(error => {
        this.$message.error(JSON.stringify(error) + '数据获取失败')
      })
    }
  }
}
export default mixin
