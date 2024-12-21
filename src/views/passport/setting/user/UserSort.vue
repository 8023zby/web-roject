<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form class="typt-list-search" :inline="true">
      <el-form-item v-if="orgLevel!==2" class="deptCls" label="部门：">
        <el-select v-uni="actFormKey + 'bumen'" v-model="formSearchData.deptId" placeholder="请选择所属部门" filterable>
          <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else label="科室：" class="deptCls">
        <treeselect v-uni="actFormKey + 'keshi'" placeholder="请选择" :clearable="false" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptData" noChildrenText="无子节点"/>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button v-uni="actKey + 'search'" type="primary"  icon="el-icon-search" @click="getUser" size="small">搜索</el-button>
          <el-button v-uni="actKey + 'reset'" type="text" @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr />
    <div class="typt-list-add-div">
      <div class="action_div">
        <el-button v-uni="actKey + 'cancel'" type="primary" size="small" @click="$emit('option-changed', 'list')">返回</el-button>
      </div>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="90%"
      >
      <el-table-column
        label="顺序"
        align="center"
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userName"
        label="用户名"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="empName"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1?'男':scope.row.sex === 2?'女':''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userTelephone"
        width="120"
        label="手机号码"
        align="center">
      </el-table-column>
      <el-table-column
        align="center"
        prop="deptName"
        label="部门">
      </el-table-column>
      <el-table-column
        align="center"
        prop="jobName"
        label="岗位"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="400">
        <template slot-scope="scope">
          <el-button v-uni="actKey + 'up-' + scope.row.userId" type="text" @click="upDo(scope.row, scope.$index)">上移</el-button>
          <el-button v-uni="actKey + 'down-' + scope.row.userId" type="text" @click="downDo(scope.row, scope.$index)" style="color: #F56C6C">下移</el-button>
          <el-button v-uni="actKey + 'head-' + scope.row.userId" type="text" @click="topDo(scope.row, scope.$index)">置顶</el-button>
          <el-button v-uni="actKey + 'bottom-' + scope.row.userId" type="text" @click="btmDo(scope.row, scope.$index)" style="color: #F56C6C">置尾</el-button>
          <el-button v-uni="actKey + 'custom-' + scope.row.userId" type="text" @click="customDo(scope.row, scope.$index)">指定位置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ResultMsg } from '../../../../assets/passport/js/Message'
import { AxiosJsonApi, AxiosApi } from '../../../../api/passport/http'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'user-sort',
  components: {
    Treeselect
  },
  props: ['params'],
  data () {
    return {
      actKey: 'yonghuzhanghaopaixu_',
      actFormKey: 'yonghuzhanghaopaixu__',
      loading: false,
      tableData: [],
      deptData: '',
      orgLevel: '',
      dataDeptInfoList: [],
      formSearchData: {
        deptId: null
      }
    }
  },
  // 初始化
  created () {
    let dataDeptInfoList = JSON.parse(localStorage.getItem('dataDeptInfoList')) || []
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.orgLevel = orgInfo.orgLevel
    this.dataDeptInfoList = dataDeptInfoList
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
          if (this.params.deptId) {
            this.formSearchData.deptId = this.params.deptId
          }
          // 如果传过来的部门为空 设置为当前所选部门
          let deptId = localStorage.getItem('selectDeptId')
          if (this.formSearchData.deptId === null || this.formSearchData.deptId === '') {
            this.formSearchData.deptId = deptId
          }
          this.getUser()
        }
      })
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
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        showClose: false,
        customClass: 'ifms-confirm',
        inputErrorMessage: `请填写正确的位置(1-${this.tableData.length})`,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let value = instance.inputValue
            if (parseInt(value) > this.tableData.length) {
              this.$message.warning(`位置序号不能超过${this.tableData.length}！`)
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
      this.tableData.forEach((item, index) => {
        saveData.push({
          userId: item.userId,
          sort: index + 1
        })
      })
      AxiosJsonApi('/passport/web-rbac/users/sort', {
        sorts: saveData,
        deptId: this.formSearchData.deptId
      }).then(res => {
        if (res.status !== 200) {
          ResultMsg(res, '排序', this.getUser)
        }
      })
    },
    // 获取用户
    getUser () {
      AxiosApi(`/passport/web-rbac/users`, {}, 'GET', {
        page: 1,
        size: 1000,
        deptId: this.formSearchData.deptId
      }).then(res => {
        this.loading = false
        if (res.status === 200) {
          this.tableData = res.data.list
        }
      })
    },
    // 重置
    reload () {
      if (this.params.deptId) {
        this.formSearchData.deptId = this.params.deptId
      }
      // 如果传过来的部门为空 设置为当前所选部门
      let deptId = localStorage.getItem('selectDeptId')
      if (this.params.deptId === null || this.params.deptId === '') {
        this.formSearchData.deptId = deptId
      }
      this.getUser()
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
