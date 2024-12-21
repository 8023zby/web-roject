<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="用户名：">
        <el-input v-uni="actFormKey + 'yonghuming'" v-model="formSearchData.userName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="科室：" class="deptCls" v-if="landingEndCode === 'OPEX'">
        <el-select v-uni="actFormKey + 'keshi'" v-model="formSearchData.deptName" placeholder="请选择" filterable  allow-create>
          <el-option v-for="item in deptData" :label="item.deptName" :value="item.deptName" :key="item.deptId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门：" v-else-if="orgLevel!==2" >
        <el-select v-uni="actFormKey + 'bumen'" v-model="formSearchData.deptName" placeholder="请选择" filterable>
          <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptName" :key="item.deptId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-uni="actFormKey + 'shoujihao'" v-model="formSearchData.userPhone" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-uni="actFormKey + 'xingming'" v-model="formSearchData.empName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色：">
        <el-select v-uni="actFormKey + 'juese'" v-model="formSearchData.roleName" placeholder="请选择" filterable>
          <el-option v-for="item in roleData" :label="item.name" :value="item.name" :key="item.roleId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作终端：">
        <el-select v-uni="actFormKey + 'caozuozhongduan'" v-model="formSearchData.source" placeholder="请选择" filterable>
          <el-option v-for="(item, index) in sourceList" :label="item.label" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型：">
        <el-input v-uni="actFormKey + 'caozuoleixing'" v-model="formSearchData.method" placeholder="请输入" filterable></el-input>
      </el-form-item>
      <el-form-item label="IP地址：">
        <el-input v-uni="actFormKey + 'ipdizhi'" v-model="formSearchData.ipAddress" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作时间：">
        <el-date-picker
          v-uni="actFormKey + 'caozuoshijian'"
          @change="changeDate"
          v-model="searchTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button v-uni="actKey + 'search'" type="primary"  icon="el-icon-search" @click="onSearchSubmit">搜索</el-button>
          <el-button v-uni="actKey + 'reset'" type="text"  @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr v-if="authorityObj['czrzdc']" />
    <div class="typt-list-add-div" v-if="authorityObj['czrzdc']">
      <div class="action_div">
        <el-button v-uni="actKey + 'export'" v-if="multipleSelection.length===0" type="info" @click="exportData()" disabled>导出</el-button>
        <el-button v-uni="actKey + 'export'" v-else type="primary" size="small" @click="exportData()">导出</el-button>
      </div>
    </div>
    <!--end-->
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="76%"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      :row-key="getRowKey"
      v-if="tableVis"
      >
      <el-table-column type="selection" width="55"
                       align="center"
                       :reserve-selection = "true"></el-table-column>
      <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
      <el-table-column prop="deptName" label="部门" align="center"></el-table-column>
      <el-table-column prop="userPhone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
      <el-table-column prop="empName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
      <el-table-column prop="ipAddress" label="IP地址" align="center"></el-table-column>
      <el-table-column prop="module" label="功能模块" align="center" :formatter="formatModule"></el-table-column>
      <el-table-column prop="source" label="操作终端" align="center"></el-table-column>
      <el-table-column prop="method" label="操作类型" align="center"></el-table-column>
      <el-table-column prop="remark" label="操作记录" align="center"></el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <!--组件页码显示-->
    <page-info :pageInfo="pageInfo"></page-info>
    <!--end-->
  </div>
</template>

<script>
import { AxiosApi, AxiosJsonApi } from '../../../../api/passport/http'
import { MsgShow } from '../../../../assets/passport/js/Message'
import PageInfo from '../../../../components/passport/PageInfo'
import BaseManage from '../../../../assets/passport/mixins/BaseManage'
export default {
  components: {
    PageInfo
  },
  inject: ['checkMoreAuthority'],
  mixins: [BaseManage],
  data () {
    return {
      searchTime: '',
      dataDeptInfoList: [],
      modelName: '日志',
      orgLevel: '',
      tableVis: true,
      multipleSelection: [],
      formSearchData: {
        userName: '',
        userPhone: '',
        roleName: '',
        deptName: '',
        startDate: '',
        ipAddress: '',
        endDate: '',
        source: '',
        method: ''
      },
      deptData: [],
      roleData: [],
      sourceList: [{
        id: '管理后台',
        label: '管理后台'
      }],
      methodList: [{
        id: 'GET',
        label: ''
      },
      {
        id: 'POST',
        label: 'POST'
      },
      {
        id: 'DELETE',
        label: 'DELETE'
      },
      {
        id: 'UPDATE',
        label: 'UPDATE'
      }],
      url: '/passport/web-rbac/systemLogs',
      authorityArr: ['czrzdc'],
      actKey: 'caozuorizhi_',
      actFormKey: 'caozuorizhi__'
    }
  },
  created () {
    // 判断登录应用
    this.getLandingEndCode()
    // 查询登录终端
    // this.getDeviceType()
    // 判断是否有动作权限
    this.getListAuthority()
    let dataDeptInfoList = JSON.parse(localStorage.getItem('dataDeptInfoList')) || []
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.orgLevel = orgInfo.orgLevel
    this.dataDeptInfoList = dataDeptInfoList
    this.getDeptList()
    this.getRoleList()
    this.onSearchSubmit()
  },
  methods: {
    // 查询登录终端
    getDeviceType () {
      AxiosApi(
        `/tdms/web-td/device/list/getDeviceType`,
        {},
        'GET'
      ).then(res => {
        if (res.status === 200) {
          let temp = []
          res.data.forEach(item => {
            temp.push({
              id: item.deviceTypeName,
              label: item.deviceTypeName
            })
          })
          this.sourceList = [...this.sourceList, ...temp]
        }
      })
    },
    // 显示模块
    formatModule (row) {
      return row.module === null ? '' : row.module.toString()
    },
    // 查询部门
    getDeptList () {
      let orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
      let orgId = orgInfo.orgId
      if (this.landingEndCode === 'OPEX') {
        AxiosApi(
          `/ifms/web-org/depts/${orgId}/list`,
          {},
          'GET'
        ).then(res => {
          if (res.status === 200) {
            this.deptData = res.data
          }
        })
      }
    },
    // 获取row-key
    getRowKey (row) {
      return row.id
    },
    // 导出
    exportData () {
      if (this.multipleSelection.length < 1) {
        MsgShow('warning', '请选择至少一条日志信息！')
        return false
      }
      let ids = []
      this.multipleSelection.forEach((item) => {
        ids.push(item.id)
      })
      AxiosJsonApi('/passport/web-rbac/systemLogs/export', ids).then(res => {
        if (res.status === 200) {
          const a = document.createElement('a')
          a.setAttribute('download', '日志.xls')
          a.setAttribute('href', res.data)
          a.click()
        } else {
          MsgShow('error', res.desc, 3000)
        }
      }).catch(() => {
        MsgShow('error', '导出接口异常，请联系管理员', 3000)
      })
    },
    // 请求角色
    getRoleList () {
      AxiosApi(
        '/passport/web-rbac/roles',
        {},
        'GET',
        { page: 1, size: 999 }
      ).then(res => {
        if (res.status === 200) {
          let data = res.data.list || []
          this.roleData = data
        }
      })
    },
    // 刷新页面
    reload () {
      this.formSearchData = this.clearObj(this.formSearchData)
      this.searchTime = ''
      this.pageInfo.currentPage = 1
      this.multipleSelection = []
      this.tableVis = false
      this.$nextTick(() => {
        this.tableVis = true
      })
      this.getData()
    },
    // 改变时间
    changeDate () {
      if (this.searchTime === null) {
        this.formSearchData.startDate = ''
        this.formSearchData.endDate = ''
      } else {
        this.formSearchData.startDate = this.searchTime[0]
        this.formSearchData.endDate = this.searchTime[1]
      }
    }
  }
}
</script>
