<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}机构</div>
    </div>
    <div class="typt-add-container">
        <div class="typt-add-form">
            <el-form  :rules="rules"  ref="addFormData" class="from" label-width="150px" :model="addFormData">
              <el-form-item v-if="!addFormData.orgId" label="用户名：" prop="userName">
                <el-input v-model="addFormData.userName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item v-if="!addFormData.orgId" label="密码：" prop="userPassword">
                <el-input v-model="addFormData.userPassword" type="password" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="机构名称：" prop="orgName">
                <el-input v-model="addFormData.orgName" placeholder="请输入"></el-input>
              </el-form-item>
              <!--<el-form-item label="机构类型：" prop="orgLevel">
                <el-radio v-model="addFormData.orgLevel" :label="2">医疗</el-radio>
                <el-radio v-model="addFormData.orgLevel" :label="3">养老</el-radio>
              </el-form-item>-->
            </el-form>
        </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="reloadUrl">取消</el-button>
      <el-button type="primary" @click="onSubmit('addFormData')" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../assets/passport/mixins/BaseManage'
export default {
  props: ['params'],
  mixins: [BaseManage],
  data () {
    return {
      addFormData: {
        userName: '',
        userPassword: '',
        orgName: '',
        orgLevel: 2
      },
      globalConfig: {
        systemId: window.GLOBAL_CONFIG.SYSTEM_ID || 'common'
      },
      titMsg: '添加',
      modelName: '机构',
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名长度为2-20位！', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度为6-20位！', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { min: 2, max: 20, message: '机构名称长度为2-20位！', trigger: 'blur' }
        ]
      },
      url: '/passport/web-rbac/org'
    }
  },
  mounted () {
    this.addFormData.orgId = this.params.orgId
    if (this.addFormData.orgId) {
      this.titMsg = '编辑'
      this.addFormData.orgName = this.params.orgName
      // this.detail(this.addFormData.orgId)
    }
    if (this.globalConfig.systemId === 'pims' || this.globalConfig.systemId === 'poms') {
      this.addFormData.orgLevel = 3
    }
  },
  methods: {
    onSubmit (addFormData) {
      this.$refs[addFormData].validate((valid) => {
        if (valid) {
          if (this.addFormData.orgId != null) {
            // 修改机构
            this.edit({
              orgId: this.addFormData.orgId,
              orgName: this.addFormData.orgName
            })
          } else {
            // 添加机构
            this.add(this.addFormData)
          }
        }
      })
    }
  }
}
</script>
