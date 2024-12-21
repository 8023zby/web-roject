<template>
  <el-container>
    <el-header>
      <h1>产品审核列表</h1>
    </el-header>
    <el-main>
      <div class="orderList">
        <div class="btn-group">
          <el-form :inline="true" class="demo-form-inline query-area">
            <el-form-item label="商品名称：">
              <el-input v-model="wareName" placeholder="请输入商品名称" />
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="auditState" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryList">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="商品名称" prop="wareName" sortable />
          <el-table-column label="审核状态" prop="auditState" sortable>
            <template slot-scope="scope">
              <div v-if="scope.row.auditState=='0'">
                等待审核
              </div>
              <div v-else-if="scope.row.auditState=='1'">
                审核通过
              </div>
              <div v-else-if="scope.row.auditState=='2'">
                审核不通过
              </div>
            </template>
          </el-table-column>
          <el-table-column label="审核人" prop="userName" sortable />
          <el-table-column label="提交时间" prop="applyTime" sortable />
          <el-table-column label="审核时间" prop="auditTime" sortable />
          <el-table-column label="备注" prop="remark" sortable />
        </el-table>
        <!--分页插件-->
        <div style="padding:10px 0">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="currentPage"
            :page-sizes="[10, 50, 100, 200]"
            :total="dataTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import {
  queryList
} from '../../../api/smms/shopingMall/wareCheckList'
export default {
  name: 'WareCheckList',
  data() {
    return {
      tableData: [],
      wareName: '',
      auditState: '',
      currentPage: 1,
      sizeNum: 10,
      dataTotal: 0,
      options: [
        {
          value: '',
          label: '请选择'
        }, {
          value: '0',
          label: '等待审核'
        },
        {
          value: '1',
          label: '审核通过'
        },
        {
          value: '2',
          label: '审核不通过'
        }
      ]
    }
  },
  mounted: function() {
    this.queryList()
  },
  methods: {
    queryList() {
      queryList({
        wareName: this.wareName,
        auditState: this.auditState,
        size: this.sizeNum,
        page: this.currentPage,
        pageHelper: '1'
      })
        .then(res => {
          this.tableData = res.data.list
          this.dataTotal = res.data.total
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
    },
    handleSizeChange(size) {
      this.sizeNum = size
      this.queryList()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.queryList()
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.btn-area {
  padding: 20px 0px 10px 0px;
}
.query-area > div {
  margin-right: 50px;
}
</style>
