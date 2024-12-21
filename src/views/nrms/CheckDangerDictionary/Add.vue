<template>
    <layout v-loading="loading">
        <div slot="title">
            <div class="title">{{form_type_text}}检查项目</div>
        </div>
        <div slot="main" class="add-from" >
            <el-form v-uni="'jianchaxiangmu_addForm'" :model="ruleForm" :rules="rules" label-suffix="：" ref="ruleForm" label-width="130px">
                <el-form-item label="检查类型" prop="crisisClassId">
                    <el-select
                            v-uni="'jianchaxiangmu_jianchaleixing'"
                            v-model="ruleForm.crisisClassId"
                            placeholder="请选择"
                            autocomplete="off"
                            clearable
                    >
                        <el-option
                                v-for="(item, key) in classfyData"
                                :label="item.classValue"
                                :value="item.crisisClassId"
                                :key="key"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="检查项目代码" prop="crisisCode" v-if="rowData&&rowData['crisisDictId'] ">
                    <el-input v-uni="'jianchaxiangmu_daima'" v-model="ruleForm.crisisCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="检查项目名称" prop="crisisName">
                    <el-input v-uni="'jianchaxiangmu_mingcheng'" v-model="ruleForm.crisisName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="显示名称" prop="crisisShowName">
                    <el-input v-uni="'jianchaxiangmu_xianshimingcheng'" v-model="ruleForm.crisisShowName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="项目备注" prop="crisisNote">
                    <el-input
                            v-uni="'jianchaxiangmu_xiangmubeizhu'"
                            type="textarea"
                            :rows="5"
                            v-model="ruleForm.crisisNote"
                            maxlength="100"
                            show-word-limit
                            placeholder="请输入"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer_btn">
            <el-button v-uni="'jianchaxiangmu_cancel'" @click="close">取消</el-button>
            <el-button v-uni="'jianchaxiangmu_save'" type="primary" @click="submitForm">保存</el-button>
        </div>
    </layout>
</template>

<script>
import { ApiDangerClassify, ApiDangerDictionary } from '../../../api/nrms'
import layout from '../../../components/nrms/layout/edit'
export default {
  name: 'Add',
  props: {
    rowData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    clissfyItem: {
      type: Object,
      default: function () {
        return { crisisClassId: '' }
      }
    }
  },
  components: { layout },
  data () {
    return {
      loading: false,
      form_type_text: '',
      classfyData: [], // 检查分类数组
      ruleForm: {
        crisisType: 1,
        crisisClassId: '',
        crisisName: '',
        crisisShowName: '',
        crisisNote: '',
        crisisChildDictIds: '',
        crisisCode: ''
      },
      count: '',
      rules: {
        crisisClassId: [
          { required: true, message: '请输入检查类型！', trigger: 'blur' }
        ],
        crisisName: [
          { required: true, message: '请输入检查项目名称！', trigger: 'blur' },
          { min: 1, max: 20, message: '长度不超过20个字符!', trigger: 'blur' }
        ],
        crisisShowName: [
          { required: true, message: '请输入显示名称！', trigger: 'change' },
          { min: 1, max: 20, message: '长度不超过20个字符!', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let params = this.rowData

    this.form_type_text = params && params['crisisDictId'] ? '编辑' : '添加'
    if (params) {
      this.ruleForm = JSON.parse(JSON.stringify(params))
    }
    this.getClassifyData()
  },
  methods: {
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiDangerDictionary.save(this.ruleForm)
            .then(() => {
              this.$message.success('保存正确！')
              this.close()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        } else {
          return false
        }
      })
    },
    // 获取全部分类数据
    getClassifyData () {
      ApiDangerClassify.select({ classValue: '', classType: '1' }).then(res => {
        this.classfyData = res.data || []
        if (!this.rowData && this.clissfyItem.crisisClassId) {
          this.ruleForm.crisisClassId = this.clissfyItem.crisisClassId
        }
      })
    },
    // 重置表单 & 关闭窗体
    close () {
      this.$emit('option-changed', 'list')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    @import "../../../assets/nrms/css/self_common";
</style>
