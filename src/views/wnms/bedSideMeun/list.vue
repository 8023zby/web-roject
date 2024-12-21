<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true">
        <!--   查询条件 -->
        <el-form-item>
          <!--   按钮查询 -->
          <div class="typt-search-btn"></div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <el-button
          type="warning"
          icon="el-icon-plus"
          @click="$emit('option-changed','add',{type:'add'})"
        >添加</el-button>
        <!-- 添加 ,排序 按钮  -->
        <div class="action_div">
          <!-- 右侧排序  -->
        </div>
      </div>
      <!--列表-->
      <!-- table -->
      <el-table :data="tableData" height="756" style="width: 100%;height:95%;" row-key="id">
        <el-table-column prop="menuName" label="菜单名称" align="center"></el-table-column>
        <el-table-column prop="menuCode" label="菜单标识" align="center"></el-table-column>
        <el-table-column prop="status" :formatter="isState" label="是否显示" align="center"></el-table-column>
        <el-table-column prop="icon" label="菜单Icon" align="center">
          <template slot-scope="scope">
            <img
              :src="iconParse(scope.row.icon,0)"
              v-if="iconParse(scope.row.icon,0)"
              width="40"
              height="40"
            />
            <img
              :src="iconParse(scope.row.icon,1)"
              v-if="iconParse(scope.row.icon,1)"
              width="40"
              height="40"
            />
          </template>
        </el-table-column>
        <el-table-column prop="pageUrl" label="请求地址" align="center"></el-table-column>
        <el-table-column prop="pageUrl" label="选中项" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isFisrtShow"
              v-if="isSwitch(scope.row.menuCode)"
              inactive-color="#999"
              :active-value="1"
              :inactive-value="0"
              @change="chang($event,scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="cmenuenter"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.level!==2"
              size="mini"
              @click="handle (scope, 'tadd')"
            >添加</el-button>
            <el-button type="text" size="mini" @click="handle (scope, 'edit')">编辑</el-button>
            <el-button type="text" v-if="false" size="mini" @click="handle (scope, 'del')">删除</el-button>

            <span class="el-button-text-color" type="text" @click="upDo(scope.row)">上移</span>
            <span class="el-text-danger" @click="downDo(scope.row)">下移</span>
          </template>
        </el-table-column>
      </el-table>

      <!--组件页码显示-->
      <!-- 分页码 -->
    </div>
    <!--新增房间对话框-->
  </div>
</template>
<script>
import * as api from '../../../api/wnms/bedSideMeun/index'
import { deepMerge } from '@/assets/wnms/utils'
import BaseQueryPageForm from '../common/BaseQueryPageForm'
import Pagination from '@/components/wnms/paginations/pagination'

export default {
  mixins: [BaseQueryPageForm],
  data () {
    let search = this.initQueryCriteria()
    return {
      search: search,
      tableData: [],
      isSwitchData: [],
      menuFrom: this.$route.params.type || 'bedSide'
    }
  },
  mounted () {
    this.executeQueryPage()
  },

  methods: {


    // 上移
    upDo (item) {
      let children = this.getParentData(item.parentId, item.level)
      debugger
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
            if (val.id === pid) {
              data = { ...val }
            }
          })
        })
      } else if (level === 4) {
        this.tableData.forEach((item) => {
          item.child.forEach((val) => {
            val.child.forEach((value) => {
              if (value.id === pid) {
                data = { ...value }
              }
            })
          })
        })
      } else {
        data = this.tableData.find((item) => {
          return item.id === pid
        })
      }
      if (!data) data = {}
      return data.children || []
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

      data.forEach((item, index) => {
        this.finalData.push({
          id: item.id,
          sort: index + 1
        })
      })

      console.log(this.finalData)
      debugger

      api.MenuSort(this.finalData).then(data => {
        if (data.status == 200) {

        }
      }).finally(() => {
        // 提交时加载
        this.btnLoading = false
      })
      // AxiosJsonApi('/passport/web-rbac/authoritys/sort', { sorts: this.finalData }, 'PUT').then(res => {
      //   if (res.status !== 200) {
      //     ResultMsg(res, '排序', this.getData)
      //   }
      // })
    },


    isSwitch (code) {
      return this.isSwitchData.includes(code)
    },

    //更改当前默认值
    chang (e, row) {
      api.Edit({ id: row.id, isFisrtShow: e, menuCode: row.menuCode, menuFrom: this.menuFrom }).then((res) => {
        if (res.data === 1) {
          this.$message({
            message: '设置成功!',
            type: 'success'
          })
        } else if (res.data === 0) {
          this.$message({
            message: '已存在首先展示的信息，不能再次设置!',
            type: 'error'
          })

        }
        this.executeQueryPage()
      })
    },

    isState (row, column) {
      switch (row.status) {
        case 1:
          return '是'
        case 2:
          return '否'
        default:
          return '其他'
      }
    },
    iconParse (value, T) {
      if (value) {
        let json = JSON.parse(value)
        return json[T].path
      }

    },
    handle (scope, T) {
      if (T === 'tadd') {
        this.$emit('option-changed', 'add', { type: 'tadd', row: scope.row })
      } else if (T === 'edit') {
        this.$emit('option-changed', 'add', { type: 'edit', row: scope.row })
      } else if (T === 'del') {
        this.delHandler(scope.$index, scope.row)
      }
    },

    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        menuFrom: this.$route.params.type || 'bedSide'
      })
    },
    getedu (value) {
      if (value) {
        let t = value.filter((item, index, value) => {
          if (item.menuCode === 'edu') {
            return item
          }
        })
        if (t.length > 0) {
          this.isSwitchData = t[0].children.map((item, index, t) => {
            return item.menuCode
          })
        }
      }
    },
    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      api.getInfo(this.createQueryParams(false)).then(data => {
        if (this.stateDetect(data)) {
          if (data.data === null) {
            this.tableData = []
          } else {
            this.tableData = data.data
          }
          this.getedu(this.tableData)
        }
      }).finally(() => {
        this.yh_loading = false
      })
    },

    /* 列表删除 */
    customDelHandler (index, row) {
      api.Delete(row.id).then(res => {
        this.IsSuccess(res)
        this.executeQueryPage()
      })
    },

    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.queryHandler()
    }
  },
}
</script>
