<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form class="typt-list-search" :inline="true">
      <el-form-item label="科室：" class="deptCls">
        <treeselect v-uni="actKey + '_keshi'" placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptData" noChildrenText="无子节点"/>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button v-uni="actKey + 'search'" type="primary"  icon="el-icon-search" @click="getData" size="small">搜索</el-button>
          <el-button v-uni="actKey + 'reset'" type="text" @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="500"
      >
      <el-table-column
        label="顺序"
        align="center"
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        :prop="filedName"
        :label="tit"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="400">
        <template slot-scope="scope">
          <el-button v-uni="actKey + 'up-' + (scope.row.bedId? scope.row.bedId : scope.row.roomId)" type="text" @click="upDo(scope.row, scope.$index)">上移</el-button>
          <el-button v-uni="actKey + 'down-' + (scope.row.bedId? scope.row.bedId : scope.row.roomId)" type="text" @click="downDo(scope.row, scope.$index)" style="color: #F56C6C">下移</el-button>
          <el-button v-uni="actKey + 'head-' + (scope.row.bedId? scope.row.bedId : scope.row.roomId)" type="text" @click="topDo(scope.row, scope.$index)">置顶</el-button>
          <el-button v-uni="actKey + 'bottom-' + (scope.row.bedId? scope.row.bedId : scope.row.roomId)" type="text" @click="btmDo(scope.row, scope.$index)" style="color: #F56C6C">置尾</el-button>
          <el-button v-uni="actKey + 'custom-' + (scope.row.bedId? scope.row.bedId : scope.row.roomId)" type="text" @click="customDo(scope.row, scope.$index)">指定位置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ResultMsg } from '../../assets/passport/js/Message'
import { AxiosJsonApi, AxiosApi } from '../../api/passport/http'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'sort',
  components: {
    Treeselect
  },
  props: ['typeStr', 'deptId'],
  data () {
    return {
      loading: false,
      tableData: [],
      filedName: 'bedName',
      tit: '床位',
      deptData: [],
      formSearchData: {
        deptId: null
      },
      actKey: 'chuangweipaixu_'
    }
  },
  // 初始化
  created () {
    this.getDeptList()
  },
  methods: {
    // 上移
    upDo (item, index) {
      let num = index - 1
      if (num < 0) {
        this.$message.warning('已经是第一位了！')
        return
      }
      this.updateData(item, index, num)
    },
    // 查询部门
    getDeptList () {
      AxiosApi(
        '/ifms/web-org/depts',
        {},
        'GET'
      ).then(res => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list)
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
          this.deptData = JSON.parse(temp)
          if (this.deptId) {
            this.formSearchData.deptId = this.deptId
          }
          this.getData()
        }
      })
    },
    // 重置
    reload () {
      this.formSearchData.deptId = null
      this.getData()
    },
    // 下移
    downDo (item, index) {
      let num = index + 1
      if (num >= this.tableData.length) {
        this.$message.warning('已经是最后一位了！')
        return
      }
      this.updateData(item, index, num)
    },
    // 置顶
    topDo (item, index) {
      if (index === 0) {
        this.$message.warning('已经是第一位了！')
        return
      }
      this.updateData(item, index, 0)
    },
    // 置尾
    btmDo (item, index) {
      if (index === this.tableData.length - 1) {
        this.$message.warning('已经是最后一位了！')
        return
      }
      this.updateData(item, index, this.tableData.length - 1)
    },
    // 指定
    customDo (item, index) {
      this.$prompt('位置序号：', '指定位置', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        customClass: 'ifms-confirm',
        inputErrorMessage: `请填写正确的位置(1-${this.tableData.length})`,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let value = instance.inputValue
            if (parseInt(value) > this.tableData.length) {
              this.$message.warning(`指定位置不能超过${this.tableData.length}！`)
            } else {
              this.updateData(item, index, value - 1)
              done()
            }
          } else {
            done()
          }
        }
      }).then(({ value }) => {})
    },
    // 重新设置数据
    updateData (item, oldVal, newVal) {
      this.tableData.splice(oldVal, 1)
      this.tableData.splice(newVal, 0, item)
      this.saveData()
    },
    // 保存数据
    saveData () {
      let saveData = []
      let url = '/ifms/web-org/beds/sort'
      if (this.typeStr === 'room') {
        url = '/ifms/web-org/rooms/sort'
        this.tableData.forEach((item, index) => {
          saveData.push({
            roomId: item.roomId,
            sort: index + 1
          })
        })
      } else {
        this.tableData.forEach((item, index) => {
          saveData.push({
            bedId: item.bedId,
            sort: index + 1
          })
        })
      }
      AxiosJsonApi(url, { sorts: saveData }, 'PUT', {}, 'ifms').then(res => {
        if (res.status !== 200) {
          ResultMsg(res, '排序', this.getData)
        }
      })
    },
    // 获取用户
    getData () {
      if (this.typeStr === 'room') {
        this.tit = '房间'
        this.actKey = 'fangjianpaixu_'
        this.filedName = 'roomName'
        this.getRoom()
      } else {
        this.actKey = 'chuangweipaixu_'
        this.tit = '床位'
        this.filedName = 'bedName'
        this.getBed()
      }
    },
    // 获取房间数据
    getRoom () {
      AxiosApi('/ifms/web-org/rooms', {}, 'GET', { pageHelper: 2, deptId: this.formSearchData.deptId }).then(res => {
        if (res.status === 200) {
          let { data } = res
          this.tableData = data
        }
      })
    },
    // 获取房间数据
    getBed () {
      AxiosApi('/ifms/web-org/beds', {}, 'GET', { pageHelper: 2, deptId: this.formSearchData.deptId }).then(res => {
        if (res.status === 200) {
          let { data } = res
          this.tableData = data
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .ifms-confirm{
    .el-message-box__container{
      margin-right: 12px;
    }
    .el-message-box__message{
      width: 100% ;
      p{
        width: 100%;
        text-align: right;
      }
    }
  }
</style>
