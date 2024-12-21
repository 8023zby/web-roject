<template>
    <layout v-loading="loading">
        <div slot="title">
            <div class="title">{{form_type_text}}检验子项目</div>
        </div>
        <div slot="main" class="add-from" >
            <el-form v-uni="'jianyanzixiangmu_addForm'" :model="ruleForm" :rules="rules" label-suffix=":" ref="ruleForm" label-width="160px" class="form">
               <el-row>
                   <el-col :lg="12" :xl="8">
                       <el-form-item label="检验类型" prop="crisisClassId">
                           <el-select
                                   v-uni="'jianchaxiangmu_jianyanleixing'"
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
                   </el-col>
                   <el-col :lg="12" :xl="8">
                       <el-form-item label="检验子项目代码" prop="crisisChildCode" v-if="rowData&&rowData['crisisChildDictId'] ">
                           <el-input v-uni="'jianyanzixiangmu_daima'" v-model="ruleForm.crisisChildCode" disabled></el-input>
                       </el-form-item>
                   </el-col>
                   <el-col :lg="12" :xl="8">
                       <el-form-item label="检验子项目名称" prop="crisisChildName">
                           <el-input v-uni="'jianyanzixiangmu_mingcheng'" v-model="ruleForm.crisisChildName" placeholder="请输入"></el-input>
                       </el-form-item>
                   </el-col>
                   <el-col :lg="12" :xl="8">
                       <el-form-item label="显示名称" prop="crisisChildShowName">
                           <el-input v-uni="'jianyanzixiangmu_xianshimingcheng'" v-model="ruleForm.crisisChildShowName" placeholder="请输入"></el-input>
                       </el-form-item>
                   </el-col>
                   <el-col :lg="12" :xl="8">
                       <el-form-item label="英文缩写" prop="crisisChildEnName">
                           <el-input  v-uni="'jianyanzixiangmu_suoxie'" v-model="ruleForm.crisisChildEnName" placeholder="请输入"></el-input>
                       </el-form-item>
                   </el-col>
                   <el-col :lg="12" :xl="8">
                       <el-form-item label="LOINC代码" prop="crisisChildLoinc">
                           <el-input  v-uni="'jianyanzixiangmu_loinc'" v-model="ruleForm.crisisChildLoinc" placeholder="请输入"></el-input>
                       </el-form-item>
                   </el-col>
                       <el-col :lg="12" :xl="8">
                       <el-form-item label="单位" prop="crisisChildUnit">
                           <el-select
                                   v-uni="'jianyanzixiangmu_danwei'"
                                   v-model="ruleForm.crisisChildUnit"
                                   placeholder="请选择"
                                   autocomplete="off"
                                   clearable
                           >
                               <el-option
                                       v-for="(item, key) in childExamineUnit"
                                       :label="item"
                                       :value="item"
                                       :key="key"
                               ></el-option>
                           </el-select>
                       </el-form-item>
                   </el-col>
               </el-row>
                <el-row>
                    <el-col :span="24">
                <el-form-item label="项目备注" prop="crisisChildNote" class="textarea">
                    <el-input
                            v-uni="'jianyanzixiangmu_xiangmubeizhu'"
                            type="textarea"
                            :rows="5"
                            v-model="ruleForm.crisisChildNote"
                            maxlength="100"
                            show-word-limit
                            placeholder="请输入"
                    ></el-input>
                </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer_btn">
            <el-button v-uni="'jianyanzixiangmu_cancel'" @click="close">取消</el-button>
            <el-button v-uni="'jianyanzixiangmu_save'" type="primary" @click="submitForm">保存</el-button>
        </div>
    </layout>
</template>

<script>
import { ApiDangerClassify, ApiChildDangerDictionary } from '../../../api/nrms'
import layout from '../../../components/nrms/layout/edit'
const childExamineUnit = {
  0: '%',
  1: '10⁹/L ',
  2: '10¹²/L',
  3: 'pg',
  4: 'mm/h',
  5: 'mg/24h',
  6: 'mg/2h',
  7: 'mmol/24h',
  8: 'mL/min',
  9: '个/μL',
  10: '个/HPF',
  11: 'mg/dL',
  12: 'μmol/L ',
  13: 'mL',
  14: 'fL',
  15: 'g/L',
  16: 'mg/L',
  17: 'μg/L',
  18: 'ng/L',
  19: 'pg/mL',
  20: 'mmol/L',
  21: 'μmol/L',
  22: 'nmol/L',
  23: 'pmol/L',
  24: 'U/L',
  25: 'mU/L',
  26: 'μIU/mL',
  27: 'mOsm/Kg.H₂O',
  28: 'copies/mL',
  39: 'U/gHb',
  30: 's',
  31: 'mPa.s'
}
export default {
  name: 'Add',
  props: {
    rowData: {
      type: Object,
      default: {
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
      classfyData: [], // 检验分类数组
      ruleForm: {
        crisisClassId: '',
        crisisChildName: '',
        crisisChildShowName: '',
        crisisChildEnName: '',
        crisisChildLoinc: '',
        crisisChildUnit: '',
        crisisChildNote: '',
        crisisChildDictIds: '',
        crisisChildCode: ''
      },
      count: '',
      rules: {
        crisisClassId: [
          { required: true, message: '请输入检验类型！', trigger: 'change' }
        ],
        crisisChildName: [
          { required: true, message: '请输入检验子项目名称！', trigger: 'blur' },
          { min: 1, max: 20, message: '长度不超过20个字符!', trigger: 'blur' }
        ],
        crisisChildShowName: [
          { required: true, message: '请输入显示名称！', trigger: 'change' },
          { min: 1, max: 20, message: '长度不超过20个字符!', trigger: 'blur' }
        ],
        crisisChildEnName: [
          { min: 0, max: 5, message: '长度不超过5个字符!', trigger: 'blur' }
        ],
        crisisChildLoinc: [
          { min: 0, max: 10, message: '长度不超过10个字符!', trigger: 'blur' }
        ]
      },
      childExamineUnit
    }
  },
  created () {
    let params = this.rowData

    this.form_type_text = params && params['crisisChildDictId'] ? '编辑' : '添加'
    if (params) {
      this.ruleForm = JSON.parse(JSON.stringify(params))
    }
    this.getClassifyData()
  },
  methods: {
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiChildDangerDictionary.save(this.ruleForm)
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
      ApiDangerClassify.select({ classValue: '', classType: 2 }).then(res => {
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
    .form{
        width: 95%;
        margin: 0 auto;
    }
    .add-from{
        .textarea{
            width: 100%;
            /deep/.el-form-item__content{
                width: 85%;
                .el-textarea{
                    width: 100%;
                }
            }
        }
    }
</style>