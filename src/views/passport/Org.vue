<template>
  <div class="passport-org-container">
    <div class="passport-org-main">
      <div class="typt-tit-cls">
        <div class="typt-tit-logo"></div>
        <div class="typt-tit-content">机构注册</div>
      </div>
      <el-form v-if="orgStatus===''" :rules="rules"  ref="addFormData" label-width="100px" :model="addFormData">
        <el-form-item label="机构名称：" prop="orgName">
          <el-input placeholder="请输入机构名称" v-model="addFormData.orgName" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="passport-reg" v-else>
        {{msg}}
      </div>
      <div class="typt-add-footer">
        <el-button v-if="orgStatus===''" type="primary" @click="saveData()" :loading="addVis">保存</el-button>
        <el-button v-else type="primary" @click="goLogin()" >去登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { AxiosJsonApi } from '../../api/passport/http'
import { ResultMsg } from '../../assets/passport/js/Message'
export default {
  name: 'org_reg',
  data () {
    return {
      addVis: false,
      orgStatus: '',
      msg: '已经收到您提交的机构注册审核信息，' +
        '        请耐心等待审核人员进行审核，' +
        '        请及时登录系统查看审核情况。',
      addFormData: {
        orgId: '',
        orgName: ''
      },
      rules: {
        orgName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let str = localStorage.getItem('orgInfo')
    if (str !== null && str !== '') {
      let obj = JSON.parse(str)
      this.addFormData.orgId = obj.orgId
      if (typeof (obj.orgStatus) !== 'undefined' && obj.orgStatus !== null && obj.orgStatus !== '') {
        this.orgStatus = obj.orgStatus
        if (this.orgStatus === 2) {
          this.msg = '对不起，您提交的机构注册审核未通过，理由：' + obj.rejectReason === null ? '' : obj.rejectReason
        } else if (this.orgStatus === 1) {
          this.msg = '恭喜！您的机构注册审核信息已通过，请您重新登录。'
        }
      }
    }
  },
  methods: {
    // 注册
    saveData () {
      this.$refs['addFormData'].validate((valid) => {
        if (valid) {
          this.addVis = true
          AxiosJsonApi('/passport/web-rbac/medical', this.addFormData).then(res => {
            ResultMsg(res, '保存', this.modStatus)
            if (res.status !== 200) {
              this.addVis = false
            }
          })
        }
      })
    },
    // 修改状态数据
    modStatus () {
      this.addVis = false
      this.orgStatus = 0
    },
    // 去登录
    goLogin () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
  .passport-org-container{
    width: 100%;
    height: 100%;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
    .passport-org-main{
      width: 800px;
      background: #ffffff;
      height: 90%;
      box-shadow: 2px 2px 10px #cccccc;
    }
    .el-form{
      margin-top: 100px;
      width: 60%;
      margin-left: auto;
      margin-right: auto;
    }
    .passport-reg{
      margin-top: 100px;
      width: 60%;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      line-height: 30px;
      color: #1ABCB6;
    }
  }
</style>
