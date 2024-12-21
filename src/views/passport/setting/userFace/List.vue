<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form :inline="true" class="typt-list-search">
        <el-form-item label="用户名：">
          <el-input v-uni="actFormKey + 'yonghuming'" v-model="formSearchData.userName" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item label="姓名：">
          <el-input v-uni="actFormKey + 'xingming'" v-model="formSearchData.empName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptCls">
          <treeselect v-uni="actFormKey + 'keshi'" placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptData" noChildrenText="无子节点"/>
        </el-form-item>
        <el-form-item v-else-if="orgLevel!==2" label="部门：">
          <el-select v-uni="actFormKey + 'bumen'" v-model="formSearchData.deptId" placeholder="请选择" filterable clearable>
            <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别：">
          <el-select v-uni="actFormKey + 'xingbie'" v-model="formSearchData.sex" placeholder="全部" clearable>
            <el-option v-for="item in sexData" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-uni="actFormKey + 'zhuangtai'" v-model="formSearchData.userStatus" placeholder="请选择" clearable>
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button v-uni="actKey + 'search'" type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
            <el-button v-uni="actKey + 'cancel'" type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <div class="action_div">
          <sort-type v-uni="actFormKey + 'sortType'" :orderBy="orderBy" @query="queryByOrder" style="float: left;" />
          <el-button v-uni="actFormKey + 'uploadFace'" v-if="authorityObj['pltjrl']" type="primary" size="small" @click="$emit('option-changed', 'upload', { type: 1 })">批量添加人脸</el-button>
          <el-button v-uni="actFormKey + 'uploadSign'" v-if="authorityObj['pltjqm']" type="primary" size="small" @click="$emit('option-changed', 'upload', { type: 2 })">批量添加签名</el-button>
        </div>
      </div>
      <!--列表-->
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        height="80%"
        ref="multipleTable"
      >
<!--        <el-table-column type="index" width="100" prop="roleid" label="序号" align="center" :index="indexMethod">
        </el-table-column>-->
        <el-table-column prop="userName" label="用户名" align="center">
        </el-table-column>
        <el-table-column prop="empName" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="deptName" label="部门" align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center">
          <template slot-scope="scope">
            {{scope.row.sex === 1?'男':scope.row.sex === 2?'女':''}}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="userStatus" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.userStatus === 2 ? 'danger' : 'success'"
              disable-transitions
            >{{scope.row.userStatus === 2?'禁用':'启用'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="authorityObj['swsbckxq']" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <span v-uni="actKey + 'detail-' + scope.row.userId" class="el-button-text-color" @click="showDetail(scope.row)">查看详情</span>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
      <!--分页-->
      <div class="paginationDiv">
        <!--组件页码显示-->
        <page-info :pageInfo="pageInfo"></page-info>
      </div>
      <!--end-->
    </div>
  </div>
</template>

<script>
import PageInfo from '../../../../components/passport/PageInfo'
import SortType from '../../../../components/passport/SortType'
import User from '../../../../assets/passport/mixins/User'
import { AxiosApi } from '../../../../api/passport/http'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    PageInfo, SortType, Treeselect
  },
  mixins: [User],
  inject: ['checkMoreAuthority'],
  data () {
    return {
      deptData: [],
      dataDeptInfoList: [],
      orgLevel: '',
      sexData: [
        {
          id: '',
          label: '全部'
        },
        {
          id: 2,
          label: '女'
        },
        {
          id: 1,
          label: '男'
        }
      ],
      orderBy: [{
        id: 'emp.createTime desc',
        label: '创建时间降序'
      },
      {
        id: 'emp.createTime asc',
        label: '创建时间升序'
      }],
      userOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '启用'
        },
        {
          value: '2',
          label: '禁用'
        }
      ],
      modelName: '生物识别',
      formSearchDataStatic: {
        orderBy: ''
      },
      formSearchData: {
        userName: '',
        empName: '',
        sex: '',
        userStatus: '',
        deptId: null
      },
      url: '/passport/web-rbac/biometric',
      authorityArr: ['pltjrl', 'swsbckxq', 'pltjqm'],
      actFormKey:  'shengwushibie__',
      actKey: 'shengwushibie_'
    }
  },
  activated () {
    // 判断登录应用
    this.getLandingEndCode()
    this.getDeptList()
    // 判断是否有动作权限
    this.getListAuthority()
    this.primaryId = 'userId'
    let dataDeptInfoList = JSON.parse(localStorage.getItem('dataDeptInfoList')) || []
    this.dataDeptInfoList = dataDeptInfoList
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.orgLevel = orgInfo.orgLevel
    this.onSearchSubmit('page')
  },
  methods: {
    // 查看详情
    showDetail (row) {
      this.$emit('option-changed', 'add', { id: row.userId })
    },
    // 查询部门
    getDeptList () {
      if (this.landingEndCode === 'OPEX') {
        AxiosApi(
          '/ifms/web-org/depts',
          {},
          'GET'
        ).then(res => {
          if (res.status === 200) {
            let temp = JSON.stringify(res.data.list)
            temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
            this.deptData = JSON.parse(temp)
          }
        })
      }
    }
  }
}
</script>
<style scoped></style>
