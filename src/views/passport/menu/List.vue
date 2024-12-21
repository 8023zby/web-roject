<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <div class="typt-list-add-div">
        <el-button type="warning" @click="handleAdd('root')" icon="el-icon-plus">添加</el-button>
        <div class="action_div">
          <el-button type="primary" @click="exportMenu()">菜单导出</el-button>
          <el-button type="primary" @click="exportMenu('apis')">菜单权限关联关系导出</el-button>
        </div>
      </div>
      <!--列表-->
      <el-table
        :data="tableData"
        row-key="authorityId"
        :tree-props="{children: 'child'}"
        v-loading="loading"
        height="80%"
      >
        <el-table-column prop="authorityName" label="菜单名称"></el-table-column>
        <el-table-column prop="authorityCode" label="菜单标识"></el-table-column>
        <el-table-column prop="pageUrl" label="请求地址"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column  align="center" label="操作" width="350">
          <template slot-scope="scope">
            <!--<span class="primary_span" v-if="scope.row.level === 1" type="text" @click="exportData('apis', scope.row)">菜单权限关联关系导出</span>
            <span class="primary_span" v-if="scope.row.level === 1" type="text" @click="exportData('', scope.row)">导出</span>-->
            <span class="primary_span" v-if="scope.row.level<4" type="text" @click="handleAdd(scope.row)">添加</span>
            <span class="primary_span" type="text" @click="handleEdit(scope.row)">编辑</span>
            <span type="text" @click="handleDelete(scope.row)" class="danger_span">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
    </div>
    <!--导出-->
    <div class="passport-export">
      <el-dialog title="导出" :visible.sync="exportVis" width="600px" :close-on-click-modal="false">
        <el-form label-width="130px" class="typt-add-dialog">
          <el-tree
            :props="props"
            :data="tableData"
            node-key="authorityId"
            show-checkbox
            @check="getCheckedKeys">
          </el-tree>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="exportVis = false;addVis = false">取 消</el-button>
          <el-button type="primary" @click="exportMenuDo()" :loading="addVis">确 认</el-button>
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
        id: 'authorityId',
        label: 'authorityName',
        children: 'child'
      },
      exportVis: false,
      exportForm: {
        authorityId: ''
      },
      exportType: '',
      defaultExpandAll: false,
      pageInfo: {
        currentPage: 1,
        size: 999
      },
      formSearchDataStatic: {
        tree: 1
      },
      modelName: '菜单',
      url: '/passport/web-rbac/authoritys'
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
      this.exportForm.authorityId = checkArr.join(',')
    },
    exportMenu (act = '') {
      this.exportVis = true
      if (act === 'apis') {
        this.exportType = 'apis'
      } else {
        this.exportType = ''
      }
    },
    // 导出
    exportMenuDo () {
      if (this.exportForm.authorityId === '') {
        this.$message.warning('请至少选择一个菜单')
        return false
      }
      let url = '/passport/web-rbac/authoritys/export'
      if (this.exportType === 'apis') {
        url = '/passport/web-rbac/authoritys/export/apis'
      }
      AxiosApi(url, { authorityIds: this.exportForm.authorityId }).then(data => {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        let fileName = ''
        link.style.display = 'none'
        link.href = url
        if (this.exportType === 'apis') {
          fileName = `菜单关联权限数据_${this.getCurTime()}.sql`
        } else {
          fileName = `菜单数据_${this.getCurTime()}.sql`
        }
        link.setAttribute('download', fileName)

        document.body.appendChild(link)
        link.click()
        this.exportVis = false
      })
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
    exportData (act = '', row = '') {
      let url = 'http://passport.yarward.com/passport/web-rbac/authoritys/export'
      if (act === 'apis') {
        url = 'http://passport.yarward.com/passport/web-rbac/authoritys/export/apis'
      }
      if (row !== '') {
        url = url + '?authorityId=' + row.authorityId
      }
      window.open(url)
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
    // 修改菜单
    handleEdit (row) {
      this.$emit('option-changed', 'add', { act: 'modify' }, row)
    },
    // 添加菜单
    handleAdd (row) {
      if (row === 'root') {
        row = {
          authorityId: 'root'
        }
      }
      this.$emit('option-changed', 'add', { act: 'add' }, row)
    },
    // 删除菜单
    handleDelete (row) {
      this.del(`${this.url}/${row.authorityId}`)
    }
  }
}
</script>
<style scoped>
  .primary_span{
    cursor:pointer;
    color: #409EFF;
    margin-right: 10px;
  }
  .danger_span{
    color: #f56c6c;
    cursor:pointer;
  }
</style>
<style lang="scss">
  .passport-export{
    .el-dialog__body{
      max-height: 600px;
      overflow: auto;
    }
  }
</style>
