<template>
  <div class="paginationDiv">
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
    />
  </div>
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
