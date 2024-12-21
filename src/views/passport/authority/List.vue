<template>
  <div class="typt-list-container">
    <div class="typt-list-add-div">
      <el-button type="warning" @click="handleAdd('root')" icon="el-icon-plus">添加</el-button>
      <div class="action_div">
        <el-button type="primary" @click="exportVis = true">导出</el-button>
        <!--<el-button type="primary" @click="expandTree">展开/收起菜单</el-button>-->
      </div>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      row-key="apiId"
      :tree-props="{children: 'child'}"
      v-loading="loading"
      height="80%"
    >
      <el-table-column prop="apiName" label="权限名称"></el-table-column>
      <el-table-column prop="apiCode" label="权限标识"></el-table-column>
      <el-table-column prop="method" label="请求方式"></el-table-column>
      <el-table-column prop="url" label="请求地址"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column  align="center" label="操作" width="300">
        <template slot-scope="scope">
          <!--<el-button v-if="scope.row.level === 1" type="text" @click="exportData(scope.row)">导出</el-button>-->
          <el-button v-if="scope.row.level<4" type="text" @click="handleAdd(scope.row)">添加</el-button>
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--导出-->
    <div class="passport-export">
      <el-dialog title="导出" :visible.sync="exportVis" width="600px" :close-on-click-modal="false">
        <el-form label-width="130px" class="typt-add-dialog">
          <el-tree
            :props="props"
            :data="tableData"
            node-key="apiId"
            show-checkbox
            @check="getCheckedKeys">
          </el-tree>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="exportVis = false;addVis = false">取 消</el-button>
          <el-button type="primary" @click="exportData()" :loading="addVis">确 认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../assets/passport/mixins/BaseManage'
import { AxiosApi } from '../../../api/passport/http/index'
export default {
  props: ['params'],
  mixins: [BaseManage],
  data () {
    return {
      props: {
        id: 'apiId',
        label: 'apiName',
        children: 'child'
      },
      exportVis: false,
      exportForm: {
        apiId: ''
      },
      defaultExpandAll: false,
      pageInfo: {
        currentPage: 1,
        size: 999
      },
      formSearchDataStatic: {
        tree: 1
      },
      modelName: '权限',
      url: '/passport/web-rbac/systems',
      url_models: '/passport/web-rbac/models',
      url_apis: '/passport/web-rbac/apis'
    }
  },
  activated () {
    this.onSearchSubmit()
  },
  methods: {
    // 节点选择
    getCheckedKeys (node, keys) {
      let checkedKeys = keys.checkedKeys
      let halfChecked = keys.halfCheckedKeys
      let checkArr = checkedKeys.concat(halfChecked)
      this.exportForm.apiId = checkArr.join(',')
    },
    getCurTime () {
      let d = new Date()
      let year = d.getFullYear()
      let month = change(d.getMonth() + 1)
      let day = change(d.getDate())
      let hour = change(d.getHours())
      let minute = change(d.getMinutes())
      let second = change(d.getSeconds())
      function change (t) {
        if (t < 10) {
          return '0' + t
        } else {
          return t
        }
      }
      let time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      return time
    },
    // 导出
    exportData (row = '') {
      if (this.exportForm.apiId === '') {
        this.$message.warning('请至少选择一条记录')
        return false
      }
      let url = '/passport/web-rbac/systems/export'
      AxiosApi(url, { apiIds: this.exportForm.apiId }).then(data => {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', `权限数据_${this.getCurTime()}.sql`)

        document.body.appendChild(link)
        link.click()
        this.exportVis = false
      })
    },
    getData () {
      this.loading = true
      let pageParam = {
        size: this.pageInfo.size,
        page: this.pageInfo.currentPage
      }
      // 查询条件过滤 空的不传
      let params = Object.assign(pageParam, (this.formSearchDataStatic || {}))
      AxiosApi(this.url, {}, 'GET', params).then(res => {
        this.loading = false
        let { data } = res
        this.tableData = data
      })
    },
    // 修改权限
    handleEdit (row) {
      this.$emit('option-changed', 'add', { act: 'modify' }, row)
    },
    // 添加权限
    handleAdd (row) {
      if (row === 'root') {
        row = {
          apiId: 'root'
        }
      }
      this.$emit('option-changed', 'add', { act: 'add' }, row)
    },
    // 删除权限
    handleDelete (row) {
      let level = row.level
      let url = this.url
      if (level === 2 || level === 3) {
        url = this.url_models
      }
      if (level === 4) {
        url = this.url_apis
      }
      this.del(`${url}/${row.apiId}`)
    }
  }
}
</script>
<style lang="scss">
  .passport-export{
    .el-dialog__body{
      max-height: 600px;
      overflow: auto;
    }
  }
</style>
