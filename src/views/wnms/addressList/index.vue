<!--通讯录
主样式class：typt-list-container
    使用的中台统一样式
    更改时间：2020-10-13

    数据返回id类型：5f0e439c3b2e4873a62146d2d71aa62c,患者
    拼接“,患者”是因为有些用户既是医生，又是护士，他们的id是一样的，需要区分开
-->
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <search-bar @listSearch="listSearch"></search-bar>

    <!--查询条件模块 === END-->
    <hr />
    <!--表格主体 ==== START-->
    <el-table :data="pagination.list" :header-cell-style="{'background': '#f9f9f9'}" height="100%" stripe>
      <!-- <el-table-column label="序号" type="index" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+( pagination.page - 1) *pagination.size + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column property="username" label="用户名" width="200" align="center"></el-table-column>
      <el-table-column property="userFullName" label="姓名" width="200" align="center"></el-table-column>
      <el-table-column property="liaisonAuth" label="通讯录权限" align="center">
        <template slot-scope="scope">
          <span
            style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;"
            :title="scope.row.liaisonAuth"
          >{{scope.row.liaisonAuth}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span style="color:#409EFF;padding:10px 10px;cursor: pointer" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</span>
        </template>
      </el-table-column>
    </el-table>
    <!--表格主体 ==== END-->

    <!--分页条-->
    <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <el-dialog
        title="编辑通讯录"
        :visible.sync="dialogSortVisible"
        width="600px"
        v-if="dialogSortVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div style="overflow: hidden;height: 520px">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <div style="height: 470px;overflow: auto;margin-top: 20px;">
            <el-tree
              class="filter-tree"
              node-key="ids"
              show-checkbox
              :data="dataTree"
              default-expand-all
              :props="defaultProps"
              :filter-node-method="filterNode"
              :default-checked-keys="checkedNodeId"
              ref="tree"
              @check="getChecked"
            ></el-tree>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSortVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit()">确 定</el-button>
        </div>
      </el-dialog>
    </slot>
  </div>
</template>
<script>
import { deepMerge } from '@/assets/wnms/utils'
import { queryList, queryAddTree, saveAddTree, queryFilter } from '@/api/wnms/addressList/index.js'
import searchBar from '@/components/wnms/addressList/searchBar'
import Pagination from '@/components/wnms/paginations/pagination'
import BaseQueryPageForm from '../common/BaseQueryPageForm'

export default {
  components: {
    'search-bar': searchBar,
    Pagination
  },
  mixins: [BaseQueryPageForm],
  data () {
    const search = this.initQueryCriteria()
    return {
      tableData: [],
      // 分页参数
      dialogSortVisible: false,
      tableTotal: 0,
      filterText: '',
      dataTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checkedNode: [],
      rowData: [],
      iIndex: 0,
      checkedNodeId: [],
      search: search
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  computed: {},
  mounted () {
    // this.executeQueryPage()
  },
  methods: {
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        username: '', //
        liaisonAuth: '' // 通讯录权限
      })
    },

    parseTreeJson (array) {
      if (!array) {
        return
      }
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        if (element.children && typeof element.children === 'object') {
          this.parseTreeJson(element.children)
        } else {
          if (element.isCheck) {
            this.checkedNodeId.push(element.id)
          }
        }
      }
    },
    executeQueryPage () {
      queryFilter(this.createQueryParams())
        .then(res => {
          this.queryResultHandler(res)
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error))
        })
    },
    getTreeData (para) {
      queryAddTree({
        id: para
      })
        .then(res => {
          if (res.status === 200) {
            this.dialogSortVisible = true
            this.checkedNodeId = []
            // 格式化treeData
            for (let v of res.data) {
              this.switchData(v, v.name)
              if (v.children !== null && v.children.length > 0) {
                for (let v1 of v.children) {
                  this.switchData(v1, v1.name + v.name)
                  if (v1.children !== null && v1.children.length > 0) {
                    for (let v2 of v1.children) {
                      this.switchData(v2, v2.name + v1.name + v.name)
                      if (v2.children !== null && v2.children.length > 0) {
                        for (let v3 of v2.children) {
                          this.switchData(v3, v3.name + v2.name + v1.name + v.name)
                          if (v3.children !== null && v3.children.length > 0) {
                            for (let v4 of v3.children) {
                              this.switchData(v4, v4.name, v3.name + v2.name + v1.name + v.name)
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            this.dataTree = [
              {
                flText: '全部',
                name: '全部',
                children: res.data
              }
            ]
          }
        })
        .catch(error => {
          this.dialogSortVisible = false

          this.$message.error(JSON.stringify(error))
        })
    },
    // 转换为可用的tree数据
    switchData (v, text) {
      if (v.name === '高艳群') console.log(v, text)
      v.ids = v.id + '-' + v.type
      if (v.isCheck === true) {
        this.checkedNodeId.push(v.ids)
      }
      v.flText = text
    },
    // 监听子组件搜索事件
    listSearch (para) {
      this.initPagination(this.pagination)
      this.username = para.name
      this.liaisonAuth = para.selectedAddress === '全部' ? '' : para.liaisonAuth
      this.search = this.initQueryCriteria()
      this.search.deptId = para.deptId
      if (para.type === 'reSearch') {
        // 重置
        this.search.deptId = para.deptId
        this.initPagination(this.pagination)
        this.executeQueryPage()
      } else {
        this.search.username = para.name
        this.search.liaisonAuth = para.selectedAddress === '全部' ? '' : para.liaisonAuth
        this.executeQueryPage()
      }
    },
    // 编辑
    handleEdit (index, row) {
      this.filterText = ''
      this.rowData = row
      this.getTreeData(row.id)
    },
    getChecked (data, checkedNode) {
      this.checkedNode = checkedNode.checkedNodes
      if (this.checkedNode.length > 0) {
      }
    },
    editSubmit () {
      this.checkedNode = this.$refs.tree.getCheckedNodes()
      if (this.checkedNode.length === 0) {
        this.$message({
          message: '请选择通讯录权限',
          type: 'warning'
        })
        return
      }

      let submitData = {
        deptId: this.rowData.deptId,
        deptName: this.rowData.deptName,
        username: this.rowData.username,
        id: this.rowData.id,
        userFullName: this.rowData.userFullName,
        liaisons: []
      }
      for (let i of this.checkedNode) {
        if (!i.flText || i.flText === '全部') continue
        if (i.flText.includes(this.filterText)) {
          // 医生或者护士
          /* if (i.type === 'DOCTOR' ||
            i.type === 'NURSE' ||
            i.type === 'PATIENT' ||
            i.type === 'PATIENTS' ||
            i.type === 'NURSESTATION' ||
            i.type === 'DUTYMAINFRAME' ||
            i.type === 'ENTRANCEGUARD'
          ) {
            submitData.liaisons.push({
              'rid': i.id,
              'deptId': i.parentId,
              'liaison': i.name,
              'deptName': i.parentName,
              'liaisonType': i.type
            })
          } else if (i.type === 'DEPT') {
            submitData.liaisons.push({
              'rid': i.id,
              'deptId': i.id,
              'liaison': i.name,
              'deptName': i.deptName,
              'liaisonType': i.type
            })
          } */
          // "DOCTOR", "NURSE", "PATIENT", "WNMEDICALMAINFRAME", "WNDUTYMAINFRAME", "WNENTRANCEGUARD", "RESPONSIBILITYGROUP", "ORNURSESTATIONMAINFRAME", "OREXTENSION", "ORCOORDINATIONEXTENSION", "WNMEDICALAUDIOASSISTANT","DEPT"
          if (
            !i.id.includes('NURSE') &&
            !i.id.includes('PATIENT') &&
            !i.id.includes('PATIENTS') &&
            !i.id.includes('NURSESTATION') &&
            !i.id.includes('DUTYMAINFRAME') &&
            !i.id.includes('ENTRANCEGUARD') &&
            !i.id.includes('ORNURSESTATIONMAINFRAME') &&
            !i.id.includes('ORCOORDINATIONEXTENSION') &&
            !i.id.includes('WNMEDICALAUDIOASSISTANT') &&
            !i.id.includes('OREXTENSION') &&
            !i.id.includes('DOCTOR') &&
            !i.id.includes('DEPT') &&
            !i.id.includes('WNMEDICALMAINFRAME') &&
            !i.id.includes('WNDUTYMAINFRAME') &&
            !i.id.includes('WNENTRANCEGUARD') &&
            !i.id.includes('RESPONSIBILITYGROUP')
          ) {
            // 为了区分id拼接上用户类型名称，保存的时候需要去掉
            if (i.id.includes(','))i.id = i.id.split(',')[0]
            submitData.liaisons.push({
              rid: i.id,
              deptId: i.parentId,
              liaison: i.name,
              deptName: i.parentName,
              liaisonType: i.type
            })
          }
        }
      }

      saveAddTree(submitData)
        .then(res => {
          if (res.status === 200) {
            this.dialogSortVisible = false
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.executeQueryPage()
          }
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      // 提交数据
    },
    filterNode (value, data, node) {
      if (!value) return true
      return data.flText !== undefined && data.flText.indexOf(value) !== -1
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/wnms/css/self_common.scss';
</style>
