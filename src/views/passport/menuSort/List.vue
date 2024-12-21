<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <div class="typt-list-add-div" v-if="authorityObj['clearCache']">
        <div class="action_div">
          <el-button v-uni="actKey + 'clearCache'" type="danger" @click="delCache()">清除菜单相关缓存</el-button>
        </div>
      </div>
      <!--列表-->
      <el-table
        :data="tableData"
        row-key="authorityId"
        :tree-props="{children: 'child'}"
        v-loading="loading"
        height="95%"
      >
        <el-table-column prop="authorityName" label="菜单名称"></el-table-column>
<!--        <el-table-column prop="sort" label="菜单顺序"></el-table-column>-->
        <el-table-column align="center" label="操作" width="350">
          <template slot-scope="scope">
            <span v-uni="actKey + 'up-' + scope.row.authorityId" class="el-button-text-color" type="text" @click="upDo(scope.row)">上移</span>
            <span v-uni="actKey + 'down-' + scope.row.authorityId" class="el-text-danger" @click="downDo(scope.row)">下移</span>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../assets/passport/mixins/BaseManage'
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http/index'
import { ResultMsg } from '../../../assets/passport/js/Message'
export default {
  inject: ['checkMoreAuthority'],
  props: ['params', 'landingEndId'],
  mixins: [BaseManage],
  data () {
    return {
      props: {
        id: 'authorityId',
        label: 'authorityName',
        children: 'child'
      },
      finalData: [],
      defaultExpandAll: false,
      pageInfo: {
        currentPage: 1,
        size: 999
      },
      formSearchDataStatic: {
        tree: 1,
        orgLevel: 3,
        landingEndId: ''
      },
      modelName: '菜单',
      url: '/passport/web-rbac/authoritys',
      authorityObj: {},
      authorityArr: ['menu_sort', 'clearCache'],
      actKey: 'caidanpeizhi_'
    }
  },
  activated () {
    // 判断是否有动作权限
    this.getListAuthority()
    this.formSearchDataStatic.landingEndId = this.landingEndId
    this.onSearchSubmit()
  },
  methods: {
    // 清除缓存
    delCache () {
      AxiosApi(`/passport/web-rbac/roles/cache`, {}, 'DELETE').then(res => {
        ResultMsg(res, '清除', () => {})
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
      AxiosApi('/passport/web-rbac/roles/authoritys', {}, 'GET', params).then(res => {
        this.loading = false
        let { data } = res
        this.tableData = data
      })
    },
    // 上移
    upDo (item) {
      let children = this.getParentData(item.parentId, item.level)
      let index = this.getDataIndex(item, children)
      let num = index - 1
      if (num < 0) {
        this.$message.warning('已经是第一位了！')
        return false
      }
      this.updateData(item, index, num, children)
    },
    // 下移
    downDo (item) {
      let children = this.getParentData(item.parentId, item.level)
      let index = this.getDataIndex(item, children)
      let num = index + 1
      if (num >= children.length) {
        this.$message.warning('已经是最后一位了！')
        return false
      }
      this.updateData(item, index, num, children)
    },
    // 重新设置数据
    updateData (item, oldVal, newVal, data) {
      data.splice(oldVal, 1)
      data.splice(newVal, 0, item)
      this.saveData(data)
    },
    // 查找上级并且返回数据
    getParentData (pid, level) {
      if (pid === '' || pid === '0' || pid === null) {
        return this.tableData
      }
      let data = null
      if (level === 3) {
        this.tableData.forEach((item) => {
          item.child.forEach((val) => {
            if (val.authorityId === pid) {
              data = { ...val }
            }
          })
        })
      } else if (level === 4) {
        this.tableData.forEach((item) => {
          item.child.forEach((val) => {
            val.child.forEach((value) => {
              if (value.authorityId === pid) {
                data = { ...value }
              }
            })
          })
        })
      } else {
        data = this.tableData.find((item) => {
          return item.authorityId === pid
        })
      }
      if (!data) data = {}
      return data.child || []
    },
    // 查找元素在当前数据的index
    getDataIndex (item, data) {
      let index = -1
      data.forEach((v, i) => {
        if (v === item) {
          index = i
        }
      })
      return index
    },
    // 保存数据
    saveData (data) {
      this.finalData = []
      // this.getChild(this.tableData)
      data.forEach((item, index) => {
        this.finalData.push({
          authorityId: item.authorityId,
          sort: index + 1
        })
      })
      AxiosJsonApi('/passport/web-rbac/authoritys/sort', { sorts: this.finalData }, 'PUT').then(res => {
        if (res.status !== 200) {
          ResultMsg(res, '排序', this.getData)
        }
      })
    },
    // 查找子集
    getChild (data) {
      data.forEach((item, index) => {
        this.finalData.push({
          authorityId: item.authorityId,
          sort: index + 1
        })
        if (item.children && item.children.length > 0) {
          this.getChild(item.children)
        }
      })
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
