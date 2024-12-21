<template>
  <div class="paginationDiv">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="pageInfo.currentPage"
      :page-size="pageInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'page-info',
  props: ['pageInfo'],
  methods: {
    // 选择页面查询,调用父级方法刷新列表
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      this.$parent.onSearchSubmit('page')
    },
    // 查询上一页，调用父级方法刷新列表
    handleSizeChange (val) {
      this.pageInfo.size = val
      this.pageInfo.currentPage = 1
      this.$parent.onSearchSubmit('page')
    }
  }
}
</script>
