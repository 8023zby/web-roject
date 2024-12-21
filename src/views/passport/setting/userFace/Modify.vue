<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls" style="position: relative">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">查看详情</div>
      <el-button v-uni="actKey + 'cancel'" @click="$emit('option-changed', 'list')" class="el-small-btn" style="position: absolute;right: 20px" type="primary">返回</el-button>
    </div>
    <div class="typt-add-container" style="height: 100%;">
      <div class="typt-add-form" style="width: 100%; height: 100%; padding-top: 30px;">
        <table class="passport-detail-table" cellpadding="0" cellspacing="0">
          <tr>
            <td rowspan="5" width="15%">
              <div class="passport-circle-dive">
                <img v-if="addFormData.workingPicture!==''&&addFormData.workingPicture!==null" :src="addFormData.workingPicture" onerror="javascript:this.src='/static/passport/img/icon_head.png';"/>
                <img v-else src='/static/passport/img/icon_head.png'/>
              </div>
            </td>
            <td class="td-bg">姓名</td>
            <td>{{addFormData.empName}}</td>
            <td class="td-bg">用户名</td>
            <td>{{addFormData.userName}}</td>
          </tr>
          <tr>
            <td class="td-bg">性别</td>
            <td>{{dealVal(addFormData.sex, 'sex')}}</td>
            <td class="td-bg">手机号</td>
            <td>{{addFormData.phoneNum}}</td>
          </tr>
          <tr>
            <td class="td-bg">状态</td>
            <td>{{dealVal(addFormData.userStatus, 'userStatus')}}</td>
            <td class="td-bg">部门</td>
            <td>{{dealVal(addFormData.deptId, 'deptId')}}</td>
          </tr>
          <tr>
            <td class="td-bg">工号</td>
            <td>{{addFormData.empKey}}</td>
            <td class="td-bg">角色</td>
            <td>{{dealVal(addFormData.roleIds, 'roleId')}}</td>
          </tr>
          <tr>
            <td class="td-bg">岗位</td>
            <td>{{addFormData.jobName}}</td>
            <td class="td-bg"></td>
            <td></td>
          </tr>
        </table>
        <div class="passport-user-tab">
          <el-tabs v-model="activeName" type="card" class="nrms-focus-div">
            <el-tab-pane label="人脸管理" name="first">
              <upload-more-image v-uni="actKey + 'uploadFace'" :imageObj="imageMoreObj" ref="faceDiv"></upload-more-image>
            </el-tab-pane>
            <el-tab-pane label="电子签名" name="second">
              <upload-image v-uni="actKey + 'uploadSign'" :imageObj="imageSignObj" ref="signDiv"></upload-image>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
     </div>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import User from '../../../../assets/passport/mixins/User'
import UploadImage from '../../../../components/passport/CropperUploadImg.vue'
import UploadMoreImage from '../../../../components/passport/CropperMoreUploadImg.vue'
import { AxiosApi } from '../../../../api/passport/http'
export default {
  props: ['params'],
  mixins: [User],
  components: {
    UploadImage, UploadMoreImage
  },
  data () {
    return {
      imageObj: {},
      activeName: 'first',
      imageSignObj: {
        avatar: 'avatar',
        imageUrl: '',
        fromWhere: 'sign',
        userId: ''
      },
      imageMoreObj: {
        avatar: 'avatar',
        imageUrl: '',
        fromWhere: 'face',
        userId: ''
      },
      roleObj: {},
      deptObj: {},
      titMsg: '添加',
      addFormData: {
        userName: '',
        roleId: '',
        userStatus: 1,
        roleIds: '',
        // 员工信息
        empId: '',
        empKey: '',
        empName: '',
        sex: 2,
        userTelephone: '',
        phoneNum: '',
        cordNum: '',
        jobName: '',
        deptId: '',
        workingPicture: ''
      },
      userFlag: false,
      modelName: '用户',
      url: '/passport/web-rbac/users',
      actKey: 'shengwushibiexiangqing_'
    }
  },
  created () {
    this.addFormData.userId = this.params ? (this.params.id || '') : ''
    this.imageSignObj.userId = this.params ? (this.params.id || '') : ''
    this.imageMoreObj.userId = this.params ? (this.params.id || '') : ''
    /* 获取角色信息 */
    this.getRoleList()
  },
  methods: {
    // 处理数据
    dealVal (data, key = '') {
      if (data === null || data === '') {
        return ''
      } else if (key === 'sex') {
        return data === 1 ? '男' : '女'
      } else if (key === 'userStatus') {
        return data === 2 ? '停用' : '启用'
      } else if (key === 'roleId') {
        let str = ''
        data.forEach((item) => {
          str += (this.roleObj[item] || '') + ','
        })
        return str.substr(0, str.length - 1)
      } else if (key === 'deptId') {
        return this.deptObj[data] || ''
      }
    },
    // 返回列表
    returnList () {
      this.$router.push('/user')
    },
    // 查询角色
    getRoleList () {
      AxiosApi(
        '/passport/web-rbac/roles',
        {},
        'GET',
        { page: 1, size: 999 }
      ).then(res => {
        if (res.status === 200) {
          let data = res.data.list || []
          data.forEach((item) => {
            this.roleObj[item.roleId] = item.name
          })
        }
        /* 获取部门信息 */
        this.getDeptList()
      })
    },
    // 查询部门
    getDeptList () {
      let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
      let orgId = orgInfo.orgId || ''
      AxiosApi(
        `/ifms/web-org/depts/${orgId}/list`,
        {},
        'GET',
        { page: 1, size: 1000 }
      ).then(res => {
        if (res.status === 200) {
          let data = res.data || []
          data.forEach((item) => {
            this.deptObj[item.deptId] = item.deptName
          })
        }
        this.detail(this.addFormData.userId)
      })
    }
  }
}
</script>
<style lang="scss">
  .passport-user-tab{
    margin-top: 1%;
    height: 56%;
    overflow: hidden;
    .el-tabs__content{
      height: 200px;
      overflow: auto;
      .el-tab-pane{
        height: 100%;
        overflow: auto;
        padding-left: 20px;
      }
    }
  }
</style>
<style scoped lang="scss">
  .passport-detail-table{
    width: 98%;
    height: 40%;
    margin-left: auto;
    margin-right: auto;
  }
  .passport-detail-table td{
    border-top: 1px solid #E7E7E7;
    border-left: 1px solid #E7E7E7;
    text-align: center;
    width: 20%;
    color: #333333;
  }
  .passport-detail-table tr:last-child td{
    border-bottom: 1px solid #E7E7E7;
  }
  .passport-detail-table tr:first-child td:first-child{
    border-bottom: 1px solid #E7E7E7;
  }
  .passport-detail-table tr td:last-child{
    border-right: 1px solid #E7E7E7;
  }
  .td-bg{
    background-color: #F8F8F8;
  }
  .passport-circle-dive{
    width: 88px;
    height: 88px;
    border-radius: 100%;
    margin-left: auto;
    margin-right: auto;
    img{
      width: 100%;
      height: 100%;
      border-radius: 100%;
    }
  }
</style>
