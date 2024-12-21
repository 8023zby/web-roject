<template>
  <el-pagination
    background
    :current-page="pagination.page"
    :page-size="pagination.pageSize"
    :total="pagination.total"
    :page-sizes="pageSizes"
    :pager-count="pagerCount"
    :layout="layout"
    @size-change="pageSizeChangeHandler"
    @current-change="pageChangeHandler"
    class="qsms-pager"
  />
</template>

<script>
export default {
  props: {
    pagination: {
      required: true,
      type: Object
    },
    pageSizes: {
      required: false,
      type: Array,
      default: () => [10, 20, 30, 50, 100]
    },
    pagerCount: {
      required: false,
      type: Number,
      default: 5
    },
    layout: {
      required: false,
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  methods: {
    pageSizeChangeHandler (pageSize) {
      this.$emit('page-size-changed', pageSize)
    },
    pageChangeHandler (page) {
      this.$emit('page-changed', page)
    }
  }
}
</script>

<style lang="scss">
  .qsms-pager{
    padding-top: 10px;
    .el-pager{
      // margin-top: 0 !important;
    }
    .btn-prev,.btn-next{
      margin-top: 4px !important;
    }
    .btn-next{

    }
  }
</style>
