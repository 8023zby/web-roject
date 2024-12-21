<template>
  <div style="height: calc(100% - 90px);">
    <div class="query-items">
      <el-button type="warning" icon="el-icon-plus" @click="addLayout({})" v-uni="'yemianshezhi_layout_add'">添加</el-button>
    </div>
    <div class="add-from main-list">
      <el-table
        ref="table"
        :data="table_data"
        highlight-current-row
        height="calc(100% - 50px - 101px)"
        @current-change="curChange"
      >
        <el-table-column type="index" label="序号" width="60">
          <template scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="layoutName" label="布局名称" show-overflow-tooltip min-width="100" />
        <el-table-column prop="remark" show-overflow-tooltip label="备注" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.layoutName === '默认布局'" @click="addLayout(scope.row)" v-uni:[scope.row.id]="'yemianshezhi_layout_edit_edit'" :key="'using' + scope.row.id">编辑</el-button>
            <el-button type="textred" :disabled="scope.row.checked === 1 || scope.row.layoutName === '默认布局'" @click="layoutDelete(scope.row)" v-uni:[scope.row.id]="'yemianshezhi_layout_edit_delete'" :key="'delete' + scope.row.id">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="btnStyle">
      <el-button size="small" @click="close()" v-uni="'yemianshezhi_layout_cancel'">取消</el-button>
      <el-button type="primary" size="small" @click="submitForm" v-uni="'yemianshezhi_layout_save'">保存</el-button>
    </div>
  </div>
</template>

<script>

import { LayoutApi } from '../../../../api/bnms/index'

export default {
  name: 'FirstLayout',
  components: {

  },
  props: {
    curRow: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      hei: 'calc(100% - 150px)',
      loading: false,
      table_data: [],
      setLayout: [],
      checkedRow: []
    }
  },
  watch: {

  },
  created () {
    this.getData()
  },
  methods: {
    addLayout (row) {
      this.$emit('openDialog', row)
    },
    layoutMod () {

    },
    curChange (row) {
      this.setLayout = []

      if (row) {
        this.setLayout.push({ 'id': row.id, 'pageId': row.pageId, 'checked': 1 })
      }
    },
    getData () {
      this.loading = true
      this.table_data = []

      LayoutApi.listLayout({ pageId: this.curRow.pageId }).then(res => {
        this.table_data = res.data || []
        this.getOldChecked()
        this.loading = false
      }).catch(res => {
        this.loading = false
        this.$message.error(res.message)
      })
    },
    getOldChecked () { // 获取已经保存的样式
      this.checkedRow = this.table_data.filter((item, index) => {
        return item.checked === 1
      })

      // 设置选中行
      this.$refs.table.setCurrentRow(this.checkedRow[0])
    },
    layoutDelete (row) { // 删除
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        LayoutApi.delLayout({ id: row.id }).then((res) => {
          if (res.status === 200) {
            this.$message.success(res.desc)
            this.getData()
          } else {
            this.$message.warning(res.desc)
          }
        })
      }).catch(action => {

      })
    },
    submitForm () {
      if (this.checkedRow.length > 0 && this.checkedRow[0].id !== this.setLayout[0].id) {
        this.setLayout.push({ 'id': this.checkedRow[0].id, 'pageId': this.checkedRow[0].pageId, 'checked': 0 })
      }

      LayoutApi.updatePageLayout(this.setLayout).then(() => {
        this.$message.success('保存成功！')
        this.close()
      }).catch((res) => {
        this.$message.error(res.message)
      })
    },
    // 返回
    close () {
      this.$emit('closeDrawer')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";

.btnStyle{
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: 0px;
  background: #FFFFFF;
  box-shadow: 0px 0px 6px 0px rgba(113, 113, 113, 0.3);
  height: 79px;
  line-height: 79px;
}

.add-from {
  height: 100%;
  padding: 0px 30px 0 30px;
}

.el-table::before {
  height: 0;
  width: 0;
}

/deep/.el-table__fixed-right::before {
  height: 0;
  width: 0;
}

/deep/.el-table--fit {
  border: 1px solid #eee;
  border-top: none;
}

/deep/.el-table th {
  background-color: #f7f7f7;
  color: #333333;
  font-size: 16px;
  font-weight: normal;
}
.query-items {
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 30px;
}
.main-list [class*=el-button--text] {
  margin: 0 5px;
}

</style>
