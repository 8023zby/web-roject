<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}岗位</div>
    </div>
    <div class="typt-add-container">
        <div class="typt-add-form" v-loading="loading"  >
            <el-form  :rules="rules"  ref="addFormData" class="from" label-width="130px" :model="addFormData">
                <el-form-item label="岗位名称：" prop="jobName">
                    <el-input v-uni="actFormKey + 'gangweimingcheng'" v-model="addFormData.jobName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="岗位类型：" prop="jobTypeCode">
                    <el-select v-uni="actFormKey + 'gangweileixing'" v-model="addFormData.jobTypeCode" placeholder="请选择">
                        <el-option  v-for="item in jobData" :key="item.jobTypeCode" :label="item.jobTypeName" :value="item.jobTypeCode">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
     </div>
    <div class="typt-add-footer">
      <el-button v-uni="actKey + 'cancel'" @click="reloadUrl">取消</el-button>
      <el-button v-uni="actKey + 'save'" type="primary" @click="onSubmit('addFormData')" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../../assets/passport/mixins/BaseManage'
export default {
  props: ['params'],
  mixins: [BaseManage],
  data () {
    return {
      jobData: [],
      jobTypeObj: {},
      addFormData: {
        jobTypeCode: '',
        jobName: '',
        jobTypeName: ''
      },
      titMsg: '添加',
      modelName: '岗位',
      rules: {
        jobName: [
          { required: true, message: '岗位名称不可为空！', trigger: 'blur' },
          { message: '岗位名称不可超过10个字符，只能输入汉字或数字！', trigger: 'blur', pattern: /^([\u4e00-\u9fa5]|[\d]){1,10}$/ }
        ],
        jobTypeCode: [
          { required: true, message: '请选择岗位类型！', trigger: 'change' }
        ]
      },
      url: '/ifms/web-org/job',
      actFormKey:  'gangweitianjia__',
      actKey: 'gangweitianjia_'
    }
  },
  mounted () {
    this.loading = false
    this.addFormData.jobId = this.params.id
    if (this.addFormData.jobId) {
      this.titMsg = '编辑'
      this.actFormKey = 'gangweibianji__'
      this.actKey = 'gangweibianji_'
      this.detail(this.addFormData.jobId)
    }

    // 获取岗位类型
    this.getTypeList()
  },
  methods: {
    // 获取岗位类型
    getTypeList () {
      window.jobTypeList.forEach((item, index) => {
        this.jobTypeObj[item.jobTypeCode] = item.jobTypeName
      })
      this.jobData = window.jobTypeList
    },
    onSubmit (addFormData) {
      this.$refs[addFormData].validate((valid) => {
        this.addFormData.jobTypeName = this.jobTypeObj[this.addFormData.jobTypeCode]
        if (valid) {
          if (this.addFormData.jobId != null) {
            // 修改岗位
            this.edit(this.addFormData)
          } else {
            // 添加岗位
            this.add(this.addFormData)
          }
        }
      })
    }
  }
}
</script>
