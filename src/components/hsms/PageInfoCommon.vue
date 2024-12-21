<template>
    <div class="block pagination">
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
            handleCurrentChange(val) {
                this.pageInfo.currentPage = val;
                this.$parent.onSearchSubmit('page');
            },
            // 查询上一页，调用父级方法刷新列表
            handleSizeChange(val) {
                this.pageInfo.size = val;
                this.pageInfo.currentPage = 1;
                this.$parent.onSearchSubmit('page');
            }
        }
    }
</script>

<style lang="scss">
    .paginationDiv {
        .el-pagination {
            padding-right: 52px;
        }

        /deep/ .el-pagination.is-background .btn-prev {
            background: #C0C4CC !important;
            color: #ffffff !important;
            height: 20px;
            margin: 5px 5px;
            min-width: 20px;
        }

        /deep/ .el-pagination.is-background .btn-next {
          background: #C0C4CC !important;
          color: #ffffff !important;
          height: 20px;
          margin: 5px 5px;
          min-width: 20px;
        }

        .el-pagination.is-background .btn-prev:disabled,
        .el-pagination.is-background .btn-next:disabled {
          background: #E7E7E7 !important;
        }

        .el-pagination.is-background .el-pager li:not(.disabled).active {
            /*color: #409EFF !important;*/
        }

        .el-pagination span:not([class*=suffix]) {
            font-size: 12px;
        }

        .el-input--mini .el-input__inner {
            height: 22px;
            line-height: 22px;
            color: #d1d2d3;
            font-size: 12px !important;
        }

        .el-icon-arrow-up {
            color: #d1d2d3 !important;
        }

        .el-pagination__jump {
            margin-left: 40px;
        }

        .el-input--mini .el-input__icon {
            line-height: 22px;
        }

        .el-pagination__editor.el-input .el-input__inner {
            height: 20px;
            font-size: 12px !important;
        }

        .el-pagination__sizes {
            margin: 0 43px 0 0;
        }

        .el-pagination.is-background .el-pager li {
            background: none !important;
            color: #666666 !important;
            line-height: 30px !important;
            font-size: 12px;
        }

        .el-pagination__editor {
            height: 22px !important;
        }

        .el-pagination__editor.el-input {
            width: 30px;
        }

    }
</style>
