<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="科室：" class="deptCls">
        <el-select v-uni="actFormKey + 'keshi'" v-model="formSearchData.deptName" placeholder="请选择" filterable  allow-create>
          <el-option v-for="item in deptData" :label="item.deptName" :value="item.deptName" :key="item.deptId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-uni="actFormKey + 'xingming'" v-model="formSearchData.empName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="登录应用：">
        <el-select v-uni="actFormKey + 'dengluyingyong'" v-model="formSearchData.loginApp" placeholder="请选择" filterable>
          <el-option v-for="item in deviceList" :label="item.landingEndName" :value="item.landingEndName" :key="item.landingEndId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登录终端：" style="margin-right: 100px">
        <el-select v-uni="actFormKey + 'dengluzhongduan'" v-model="formSearchData.loginTerminal" placeholder="请选择" filterable>
          <el-option v-for="(item, index) in sourceList" :label="item.label" :value="item.id" :key="index"></el-option>
        </el-select>
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
    <hr v-if="authorityObj['dlrzdc']" />
    <div class="typt-list-add-div" v-if="authorityObj['dlrzdc']">
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
      <el-table-column prop="deptName" label="科室" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
      <el-table-column prop="empName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="loginTime" label="登录时间" align="center"></el-table-column>
      <el-table-column prop="ipAddr" label="IP地址" align="center"></el-table-column>
      <el-table-column prop="loginApp" label="登录应用" align="center"></el-table-column>
      <el-table-column prop="loginTerminal" label="登录终端" align="center"></el-table-column>
      <el-table-column prop="loginStatus" label="认证结果" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.loginStatus === '成功'" style="color: #10CE65;">成功</span>
          <span v-else style="color: #f56c6c;">{{scope.row.loginStatus}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <!--组件页码显示-->
    <page-info :pageInfo="pageInfo"></page-info>
    <!--end-->
  </div>
</template>

<script>
import { MsgShow } from '../../../../assets/passport/js/Message'
import PageInfo from '../../../../components/passport/PageInfo'
import BaseManage from '../../../../assets/passport/mixins/BaseManage'
import { AxiosApi, AxiosJsonApi } from '../../../../api/passport/http'
export default {
  components: {
    PageInfo
  },
  inject: ['checkMoreAuthority'],
  mixins: [BaseManage],
  data () {
    return {
      searchTime: '',
      modelName: '日志',
      tableVis: true,
      multipleSelection: [],
      formSearchData: {
        empName: '',
        deptName: '',
        startDate: '',
        endDate: '',
        loginTerminal: '',
        loginApp: ''
      },
      deviceList: [],
      url: '/omms/web-rbac/login/logs',
      authorityArr: ['czrzdc'],
      deptData: [],
      sourceList: [{
        id: '管理后台',
        label: '管理后台'
      },{
        id: '床旁分机',
        label: '床旁分机'
      }],
      actKey: 'denglurizhi_',
      actFormKey: 'denglurizhi__'
    }
  },
  created () {
    // 判断是否有动作权限
    this.getListAuthority()
    // 查询登录终端
    this.getDeviceType()
    // 查询登录应用
    this.getDevice()
    this.getDeptList()
    this.onSearchSubmit()
  },
  methods: {
    // 查询登录终端
    getDeviceType () {
      AxiosApi(
        `/tdms/web-td/device/list/getDeviceType`,
        {},
        'GET',
        {
          hasLogin: 1
        }
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
    // 获取row-key
    getRowKey (row) {
      return row.id
    },
    // 查询部门
    getDeptList () {
      let orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
      let orgId = orgInfo.orgId
      AxiosApi(
        `/ifms/web-org/depts/${orgId}/list`,
        {},
        'GET'
      ).then(res => {
        if (res.status === 200) {
          this.deptData = res.data
        }
      })
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
      AxiosJsonApi('/omms/web-rbac/login/logs/export', ids).then(res => {
        if (res.status === 200) {
          const a = document.createElement('a')
          a.setAttribute('download', '登录日志.xls')
          a.setAttribute('href', res.data)
          a.click()
        } else {
          MsgShow('error', res.desc, 3000)
        }
      }).catch(() => {
        MsgShow('error', '导出接口异常，请联系管理员', 3000)
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
    },
    // 获取登录应用
    getDevice () {
      AxiosApi('/omms/web-rbac/authoritys/landingEnd/list', {}, 'GET').then(res => {
        if (res.status === 200) {
          this.deviceList = res.data
          if (this.deviceList.length === 0) {
            MsgShow('error', '无登录应用数据', 3000)
            return false
          }
        } else {
          MsgShow('error', res.desc, 3000)
        }
      }).catch(() => {
        MsgShow('error', '获取登录应用接口异常，请联系管理员', 3000)
      })
    }
  }
}
</script>
