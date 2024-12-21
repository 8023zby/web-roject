
<template>
  <div style="height: 100%;display: flex;flex-direction: column;">
    <el-table ref="elTable" :id="tableId" height="100%" style="flex:1 56px" :data="tableData" stripe @selection-change="handleSelectionChange" v-bind="$attrs">
      <template v-for="(column, index) in tableColumn">
        <el-table-column v-if="column.type === 'selection'" type='selection' :key="'tableColumn-selection' + index" :fixed="column.fixed" :label="column.label" :width="column.width" :min-width="column.minWidth" />
        <!-- 插槽 支持用户传入自定义内容 -->
        <el-table-column v-if="column.type === 'slot'" :key="'tableColumn' + index" :fixed="column.fixed" :label="column.label" :width="column.width" :min-width="column.minWidth" align="center">
          <template slot-scope="scope">
            <slot :name="column.slotName" :data="scope" />
          </template>
        </el-table-column>
        <el-table-column v-else-if="column.type==='index'" :key="'tableColumn-index'+index" :prop="column.prop" :fixed="column.fixed" :label="column.label" :width="column.width || '100'" :min-width="column.minWidth" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <!-- 所有的列超出点点点 -->
        <el-table-column v-else :key="'tableColumn' + index" :prop="column.prop" :fixed="column.fixed" :label="column.label" :width="column.width" :min-width="column.minWidth" align="center">
          <template slot-scope="scope">
            <span class="ellipsis">
              {{ scope.row[column.prop] ? scope.row[column.prop] : '-' }}
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="paginationDiv">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginations.pageIndex" :page-sizes="paginations.pageSizes" :page-size="paginations.pageSize" :layout="paginations.layout" :total="paginations.total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import $ from 'jquery';
const defaultPageSize = 10;

export default {
  name: 'PaginationTable',
  props: {
    tableData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    tableHeight: {
      // eslint-disable-next-line
      type: Number | String,
      default: '260px'
    },
    tableColumn: {
      type: Array,
      default: function () {
        return [];
      }
    },
    tableId: {
      type: String,
      default: 'elTable'
    },
    pagination: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data () {
    return {
      paginations: {
        pageIndex: 1, // 当前页
        pageSize: defaultPageSize, // 一页显示多少
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper'
      }
    };
  },
  created () {
    this.paginations = Object.assign(this.paginations, this.pagination);
  },
  methods: {
    handleSelectionChange (selection) {
      this.$emit('handleSelectionChange', selection);
    },
    onPaginationChange (pageIndex, pageSize) {
      this.$emit('onPaginationChange', pageIndex, pageSize);
      this.handleTableScroll();
    },
    handleTableScroll () {
      var domname = `#${this.tableId} div.el-table__body-wrapper`;
      $(domname)[0].scrollTo(0, 0);
    },
    // 改变每页大小
    handleSizeChange (pageSize) {
      this.paginations.pageSize = pageSize;
      this.paginations.pageIndex = 1;
      this.onPaginationChange(this.paginations.pageIndex, pageSize);
    },
    // 改变当前页
    handleCurrentChange (pageIndex) {
      this.paginations.pageIndex = pageIndex;
      this.onPaginationChange(pageIndex, this.paginations.pageSize);
    },
    resetPagination () {
      this.paginations.pageSize = defaultPageSize;
      this.paginations.pageIndex = 1;
    }
  },
  watch: {
    pagination: {
      // 深度监听，可监听到对象、数组的变化
      handler (newV, oldV) {
        this.paginations = Object.assign(this.paginations, newV);
      },
      deep: true
    }
  }
};
</script>
