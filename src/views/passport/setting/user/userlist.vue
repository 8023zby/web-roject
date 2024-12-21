<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="用户名：">
        <el-input v-uni="actFormKey + 'yonghuming'" v-model="formSearchData.userName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色名称：">
        <el-select v-uni="actFormKey + 'juesemingcheng'" v-model="formSearchData.roleId" placeholder="请选择" clearable>
          <el-option v-for="(item,index) in roleData" :key="index" :label="item.name" :value="item.roleId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-uni="actFormKey + 'zhuangtai'" v-model="formSearchData.userStatus" placeholder="请选择" clearable>
          <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-uni="actFormKey + 'xingming'" v-model="formSearchData.empName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别：">
        <el-select v-uni="actFormKey + 'xingbie'" v-model="formSearchData.sex" placeholder="请选择" clearable>
          <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-uni="actFormKey + 'shoujihao'" v-model="formSearchData.userTelephone" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="科室：" class="deptCls">
        <treeselect v-uni="actFormKey + 'keshi'" placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptData" />
      </el-form-item>
      <el-form-item label="岗位：">
        <el-select v-uni="actFormKey + 'gangwei'" v-model="formSearchData.jobId"  placeholder="请选择" clearable>
          <el-option v-for="item in jobData" :key="item.jobId" :label="item.jobName" :value="item.jobId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否冻结：">
        <el-select v-uni="actFormKey + 'shifoudongjie'" v-model="formSearchData.isFrozen" placeholder="请选择" clearable>
          <el-option v-for="item in frozenOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          @change="changeDate('createTime')"
          v-uni="actFormKey + 'chuangjianshijian'"
          v-model="createTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="请选择"
          end-placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="最后登录时间：">
        <el-date-picker
            v-uni="actFormKey + 'zuihoudenglushijian'"
          @change="changeDate('lastLoginTime')"
          v-model="lastLoginTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="请选择"
          end-placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" v-uni="actKey + 'search'"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
          <el-button type="text" v-uni="actKey + 'reset'" @click="reload">重置</el-button>
        </div>
      </el-form-item>

    </el-form>
    <!--end-->
    <hr />
    <div class="typt-list-add-div">
      <el-button v-uni="actKey + 'add'" v-if="authorityObj['saveUser']" type="warning" size="small" @click="handleAdd" icon="el-icon-plus">添加</el-button>
      <div class="action_div">
        <sort-type v-uni="actKey + 'sortType'" :orderBy="orderBy" @query="queryByOrder" style="float: left;" />
        <el-button v-uni="actKey + 'sort'" v-if="authorityObj['user-sort']" type="primary" size="small" @click="$emit('option-changed', 'sort', { deptId: formSearchData.deptId })">排序</el-button>
        <el-button v-uni="actKey + 'import'" v-if="authorityObj['user-import']" type="primary" size="small" @click="$emit('option-changed', 'importUser', { deptId: formSearchData.deptId })">批量导入</el-button>
        <el-button v-uni="actKey + 'export'" v-if="authorityObj['user-delete']" type="danger" size="small" @click="$emit('option-changed', 'deleteUser', { deptId: formSearchData.deptId })">批量删除</el-button>
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
      <!--<el-table-column type="index" width="100" prop="roleid" label="序号" align="center" :index="indexMethod">
      </el-table-column>-->
      <el-table-column prop="userName" label="用户名" align="center">
      </el-table-column>
      <el-table-column prop="roleNames" label="角色" align="center">
      </el-table-column>
      <el-table-column prop="userStatus" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isAdmin">-</span>
          <el-switch v-else v-model="scope.row.userStatus" v-uni="actKey + 'switch-' + scope.row.userId"  :active-value="1" :inactive-value="2"
                     @change="changeStatus(scope.row)" >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="empName" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="sex" label="性别" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1?'男':scope.row.sex === 2?'女':''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userTelephone" width="120" label="手机号码" align="center">
      </el-table-column>
      <el-table-column prop="deptName" label="部门" align="center">
      </el-table-column>
      <el-table-column prop="jobName" label="岗位" align="center">
      </el-table-column>
      <el-table-column label="是否冻结" prop="isFrozen" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isAdmin">-</span>
          <el-tag v-else
                  :type="scope.row.isFrozen === 1 ? 'danger' : 'success'"
                  disable-transitions
          >{{scope.row.isFrozen === 1?'是':'否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userLastLoginTime" label="最后登录时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.userLastLoginTime === null"></span>
          <span v-else>
            {{scope.row.userLastLoginTime === null?'':scope.row.userLastLoginTime.substr(0,10)}}
            <br/>
            {{scope.row.userLastLoginTime.substr(10,scope.row.userLastLoginTime.length - 1)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isAdmin">-</span>
          <span v-else-if="scope.row.createTime === null"></span>
          <span v-else>
            <span>
            {{scope.row.createTime === null?'':scope.row.createTime.substr(0,10)}}
            <br/>
            {{scope.row.createTime.substr(10,scope.row.createTime.length - 1)}}
          </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="authorityObj['resetFrozen'] || authorityObj['modifyPass']
                       || authorityObj['updateUser'] || authorityObj['deleteUser']" label="操作" width="350" align="center">
        <template slot-scope="scope">
          <span>
            <span v-uni="actKey + 'resetFrozen-' + scope.row.userId" v-if="scope.row.isFrozen === 1 && authorityObj['resetFrozen']" class="el-button-text-color" @click="resetFrozen(scope.row)">解除冻结</span>
            <span v-uni="actKey + 'modifyPassword-' + scope.row.userId" v-if="authorityObj['modifyPass']" class="el-button-text-color" @click="modifyPass(scope.row)">修改密码</span>
            <!--<span class="el-button-text-color" @click="resetPass(scope.row)">重置密码</span>-->
            <span v-uni="actKey + 'edit-' + scope.row.userId" v-if="authorityObj['updateUser']" class="el-button-text-color" @click="handleEdit(scope.row)">编辑</span>
            <span v-uni="actKey + 'delete-' + scope.row.userId" v-if="!scope.row.isAdmin && authorityObj['deleteUser']" class="el-text-danger" @click="handleDelete(scope.row)">删除</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <!--组件页码显示-->
    <page-info :pageInfo="pageInfo"></page-info>
    <!--end-->
    <!--修改密码-->
    <el-dialog title="修改密码" :visible.sync="passwordVis" :show-close="false" width="500px" :close-on-click-modal="false">
      <el-form :model="passSetForm" :rules="rules_type" label-width="100px"  class="typt-add-dialog">
        <el-form-item label="修改方式：" prop="modifyType">
          <el-radio-group v-model="passSetForm.modifyType" v-uni="actFormKey + 'xiugaifangshi'">
            <el-radio :label="0">直接修改</el-radio>
            <el-radio :label="1">初始化密码</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="actKey + 'modifyPassSelect_cancel'" @click="passwordVis = false;">取 消</el-button>
        <el-button v-uni="actKey + 'modifyPassSelect_save'" type="primary" @click="showModify()">确 认</el-button>
      </div>
    </el-dialog>
    <!--修改密码-->
    <el-dialog title="修改密码" :visible.sync="passVis" width="580px" :close-on-click-modal="false">
      <el-form v-if="passVis" :rules="rules" :model="modifyPassForm" label-width="110px" ref="modifyPassForm" class="typt-add-dialog">
        <el-form-item label="新密码：" prop="userPassword">
          <el-input v-uni="actFormKey + 'xinmima'" type="password" v-model="modifyPassForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="checkPass">
          <el-input v-uni="actFormKey + 'querenxinmima'" type="password" v-model="modifyPassForm.checkPass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="actKey + 'modifyPass_cancel'" @click="passVis = false;">取 消</el-button>
        <el-button v-uni="actKey + 'modifyPass_save'" type="primary" @click="doModify()">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageInfo from '../../../../components/passport/PageInfo'
import SortType from '../../../../components/passport/SortType'
import User from '../../../../assets/passport/mixins/User'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { AxiosApi, AxiosJsonApi } from '../../../../api/passport/http'
import { MsgShow, ResultMsg } from '../../../../assets/passport/js/Message'
import { isvalUserPwd, isvalUserPwdLen } from '../../../../assets/passport/js/validate'

export default {
  components: {
    PageInfo, SortType, Treeselect
  },
  mixins: [User],
  inject: ['checkMoreAuthority'],
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (this.pwdType === 0 && !isvalUserPwd(value)) {
        callback(new Error('请输入6-20位字母+数字，区分大小写'))
      } else if (this.pwdType !== 0 && !isvalUserPwdLen(value)) {
        callback(new Error('密码长度为1-20位'))
      } else {
        if (this.modifyPassForm.checkPass !== '') {
          this.$refs.modifyPassForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      } else if (this.pwdType === 0 && !isvalUserPwd(value)) {
        callback(new Error('请输入6-20位字母+数字，区分大小写'))
      } else if (this.pwdType !== 0 && !isvalUserPwdLen(value)) {
        callback(new Error('密码长度为1-20位'))
      } else if (value !== this.modifyPassForm.userPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      actKey: 'yonghuzhuanghao_',
      actFormKey: 'yonghuzhuanghao__',
      passwordVis: false,
      passSetForm: {
        modifyType: 0
      },
      modifyPassForm: {
        userPassword: '',
        checkPass: ''
      },
      orderBy: [{
        id: 'createTime desc',
        label: '创建时间降序'
      },
      {
        id: 'createTime asc',
        label: '创建时间升序'
      },
      {
        id: 'userName desc',
        label: '用户名降序'
      }, {
        id: 'userName asc',
        label: '用户名升序'
      }],
      frozenOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '冻结'
        },
        {
          value: '0',
          label: '正常'
        }
      ],
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
      sexOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '男'
        },
        {
          value: '2',
          label: '女'
        }
      ],
      modelName: '用户',
      formSearchDataStatic: {
        orderBy: ''
      },
      formSearchData: {
        userName: '',
        roleId: '',
        userStatus: '',
        empName: '',
        sex: '',
        userTelephone: '',
        deptId: null,
        jobId: '',
        isFrozen: '',
        createStartTime: '',
        createEndTime: '',
        loginStartTime: '',
        loginEndTime: ''
      },
      roleData: [],
      url: '/passport/web-rbac/users',
      rules_type: {
        modifyType: [
          { required: true, message: '请选择修改方式', trigger: 'change' }
        ]
      },
      rules: {
        userPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      passVis: false,
      modifyId: '',
      pwdType: 0,
      authorityArr: ['saveUser', 'deleteUser', 'updateUser', 'user-sort', 'resetFrozen', 'modifyPass', 'user-import', 'user-delete'],
      deptData: [],
      jobData: [],
      createTime: '',
      lastLoginTime: ''
    }
  },
  created () {
    // 判断是否有动作权限
    this.getListAuthority()
    this.getDeptList()
    this.getRoleList()
    this.getPostList()
  },
  activated () {
    this.onSearchSubmit('page')
  },
  methods: {
    // 查询密码配置
    modifyPass (row) {
      AxiosApi('/passport/web-rbac/systemConfigs/pwdConfig', {}, 'GET').then(res => {
        if (res.status === 200) {
          let data = res.data
          if (data !== null) {
            this.pwdType = data
          }
        }
        this.showModifyPass(row)
      })
    },
    // 改变时间
    changeDate (act = 'createTime') {
      if (act === 'createTime') {
        if (this.createTime === null) {
          this.formSearchData.createStartTime = ''
          this.formSearchData.createEndTime = ''
        } else {
          this.formSearchData.createStartTime = this.createTime[0]
          this.formSearchData.createEndTime = this.createTime[1]
        }
      } else {
        if (this.lastLoginTime === null) {
          this.formSearchData.loginStartTime = ''
          this.formSearchData.loginEndTime = ''
        } else {
          this.formSearchData.loginStartTime = this.lastLoginTime[0]
          this.formSearchData.loginEndTime = this.lastLoginTime[1]
        }
      }
    },
    // 查询岗位
    getPostList () {
      AxiosApi(
        '/ifms/web-org/job',
        {},
        'GET',
        { page: 1, size: 999 }
      ).then(res => {
        if (res.status === 200) {
          let data = res.data.list || []
          this.jobData = data
        }
      })
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
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '').replace(/,"children":\[\]/g, '')
          this.deptData = JSON.parse(temp)
        }
      })
    },
    // 选择修改方式
    showModify () {
      if (this.passSetForm.modifyType === 0) {
        this.passVis = true
        this.modifyPassForm = {
          userPassword: '',
          checkPass: ''
        }
      } else {
        this.resetPass(this.modifyId)
      }
    },
    // 修改密码
    showModifyPass (row) {
      this.passwordVis = true
      this.modifyPassForm = {
        userPassword: '',
        checkPass: '',
        oldPass: ''
      }
      this.passSetForm.modifyType = 0
      this.modifyId = row
    },
    // 密码修改
    doModify () {
      this.$refs['modifyPassForm'].validate((valid) => {
        if (valid) {
          AxiosJsonApi(`/passport/web-rbac/users/${this.modifyId.userId}/userPwd`, {
            newPwd: this.modifyPassForm.userPassword
          }, 'PUT').then(response => {
            if (response.status === 200) {
              MsgShow('success', `修改密码成功！`)
              this.passwordVis = false
              this.passVis = false
              this.onSearchSubmit('page')
            } else {
              MsgShow('error', response.desc, 3000)
            }
          })
        }
      })
    },
    // 解除冻结
    resetFrozen (row) {
      AxiosApi(
        `${this.url}/${row.userId}/frozen`,
        {},
        'PUT'
      ).then(res => {
        ResultMsg(res, `解除冻结`, () => {
          this.onSearchSubmit('page')
        })
      })
    },
    // 查询角色
    getRoleList () {
      AxiosApi(
        '/passport/web-rbac/roles',
        {},
        'GET',
        { page: 1, size: 9999 }
      ).then(res => {
        let data = res.data.list || []
        this.roleData = data
      })
    },
    // 修改用户
    handleEdit (row) {
      this.$emit('option-changed', 'add', { id: row.userId, flag: 'edit' })
    },
    // 添加用户
    handleAdd () {
      this.$emit('option-changed', 'add', { flag: 'add' })
    },
    // 删除用户
    handleDelete (row) {
      this.del(this.url, {
        userIds: row.userId
      })
    }
  }
}
</script>
<style scoped></style>
