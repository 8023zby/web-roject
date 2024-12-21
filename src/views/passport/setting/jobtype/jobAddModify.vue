<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}岗位类型</div>
    </div>
    <div class="typt-add-container">
        <div class="typt-add-form">
            <el-form  :rules="rules"  ref="addFormData" class="from" label-width="150px" :model="addFormData">
              <el-form-item label="岗位类型名称：" prop="jobTypeCode">
                <el-select v-model="addFormData.jobTypeCode"  placeholder="请选择岗位类型名称" @change="changeData" ref="selectJob">
                  <el-option v-for="(item, index) in jobTypeData"
                             :key="index"
                             :label="item.jobTypeName"
                             :value="item.jobTypeCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
        </div>
    </div>
    <div class="typt-add-footer">
      <el-button type="primary" @click="onSubmit('addFormData')" :loading="addVis">保存</el-button>
      <el-button @click="reloadUrl">取消</el-button>
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
      addFormData: {
        jobTypeId: null,
        jobTypeName: null,
        jobTypeCode: ''
      },
      jobTypeData: [{
        jobTypeCode: 'DOCTOR',
        jobTypeName: '医生'
      }, {
        jobTypeCode: 'NURSE',
        jobTypeName: '护士'
      }],
      titMsg: '添加',
      modelName: '岗位类型',
      rules: {
        jobTypeCode: [
          { required: true, message: '岗位类型名称', trigger: 'blur' }
        ]
      },
      url: '/ifms/web-org/jobType'
    }
  },
  mounted () {
    this.addFormData.jobTypeId = this.params.id
    if (this.addFormData.jobTypeId) {
      this.titMsg = '编辑'
      this.detail(this.addFormData.jobTypeId)
    }
  },
  methods: {
    onSubmit (addFormData) {
      this.$refs[addFormData].validate((valid) => {
        if (valid) {
          if (this.addFormData.jobTypeId != null) {
            // 修改岗位类型
            this.edit(this.addFormData)
          } else {
            // 添加岗位类型
            this.add(this.addFormData)
          }
        }
      })
    },
    // 选择切换值
    changeData (val) {
      let obj = this.jobTypeData.find((item) => {
        return item.jobTypeCode === val
      })
      if (!obj) obj = {}
      this.addFormData.jobTypeName = obj.jobTypeName || ''
    }
  }
}
</script>
