<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <div class="typt-list-search">
          <div class="deptinsidemenu-item-select-view">
            <div class="deptinsidemenu-item-select-title keshi">科室：</div>
            <treeselect
              v-model="search_form.deptId"
              :multiple="false"
              :options="options"
              @select="onSelect"
              :normalizer="normalizer"
              :default-expand-level="2"
              placeholder="请选择科室" />
          </div>
          <div class="deptinsidemenu-item-select-view">
            <div class="deptinsidemenu-item-select-title">终端名称：</div>
            <el-input v-model="search_form.name"></el-input>
          </div>
          <div class="button">
            <el-button type="primary" @click="getList" icon="el-icon-search">搜索</el-button>
            <el-button type="text" @click="reset">重置</el-button>
          </div>
        </div>
      <hr />
      <el-table :data="tableData" >
        <el-table-column prop="deptName" label="护理单元" align="center"></el-table-column>
        <el-table-column prop="roomName" label="房间" align="center"></el-table-column>
        <el-table-column prop="deviceCode" label="设备编号" align="center"></el-table-column>
        <el-table-column prop="deviceNo" label="终端号" align="center"></el-table-column>
        <el-table-column prop="deviceName" label="终端名称" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="mini">编辑</el-button>
            <el-button @click="delInfo(scope.row)" type="text" style="color:#f56c6c" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page_current"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import * as API from '@/api/wnms/msgManage/msgWarn.js'
import { getHomeConList, deleteDevices } from '@/api/wnms/furnitureControl/furnitureControl.js'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'
export default {
  components: { Treeselect },
  data () {
    return {
      tableData: [],
      options: [],
      page_current: 1,
      page_total: 1,
      search_form: {
        deptId: '',
        name: '',
        page: 1,
        size: 10
      }
    }
  },
  async created () {
    await this.getDept()
  },
  mounted () { },
  methods: {
    async getDept () {
      API.getdepts().then(res => {
        console.log(res, '获取科室列表')
        if (res.status === 200) {
          this.options = res.data.list
          this.search_form.deptId = this.options[0].deptId // 设置选中科室为传入的值或是默认选中第一项
          this.getList()
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    getList () {
      getHomeConList(this.search_form).then(res => {
        console.log(res, '获取设备列表')
        this.tableData = res.data.list
        this.page_total = res.data.total
        this.page_current = res.data.pageNum
      })
        .catch(err => {
          console.log(err)
        })
    },
    reset () {
      this.search_form.name = ''
      this.search_form.page = 1
      this.search_form.size = 10
      this.getList()
    },
    edit (row) {
      this.$emit('option-changed', 'edit', { row: row, deptList: this.options })
    },
    delInfo (row) {
      this.$confirm(`确定要删除此设备?`, '确认提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        deleteDevices({ deviceId: row.deviceId }).then(res => {
          console.log(res, '删除反馈')
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch((error) => {
          this.$message.warning(error.desc)
        })
      }).catch(() => { })
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getList()
    },
    onSelect (node, ins) {
      this.search_form.deptId = node.deptId
    },
    normalizer (node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children && node.children.length > 0 ? node.children : undefined
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.typt-list-search {
  display: flex;
  padding: 15px 15px 15px 0;
  align-items: center;
}

.deptinsidemenu-item-select-view {
  display: flex;
}

.button {
  padding-left: 20px;
}

.deptinsidemenu-item-select-title {
  // width: 90px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
}

.keshi {
  width: 50px;
}

/**** 分页 ****/
.page-bar {
  padding: 11px 0;

  /* 页码 */
  /deep/ .el-pager li {
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
    margin: 0 8px;
    border-radius: 2px;
    color: #666;
    font-size: 12px;
    font-weight: normal;

    &.active {
      color: #fff;
      background-color: #1e87f0;
    }
  }

  /* 左右翻页按钮 */
  /deep/ .el-pagination button {
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
    margin: 0 8px;
    border-radius: 2px;
    padding: 0;
    color: #FFF;
    background-color: #C0C4CC;
  }

  /deep/ .el-pagination button:disabled {
    background-color: #e9e9e9;
  }

  /* 定位保持上下居中*/
  /deep/ .el-pager, /deep/ .el-pagination button {
    margin-top: 4px;
  }

  /* 输入框和下拉框高度 */
  /deep/ .el-pagination .el-select .el-input .el-input__inner {
    height: 20px;
  }

  /* 页码宽高 -*/
  /deep/ .el-pagination__editor.el-input .el-input__inner {
    width: 20px;
    height: 20px;
  }
}
</style>
