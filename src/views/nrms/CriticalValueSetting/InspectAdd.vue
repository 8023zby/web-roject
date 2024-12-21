<template>
    <layout v-loading="loading">
        <div slot="title">
            {{ form_type_text }}危急值
        </div>
        <div slot="main" class="add-from">
            <el-form
                    v-uni="'weijizhishezhi_jianchaform'"
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    class="form-main-center"
                    label-suffix="："
                    label-width="180px"
            >
                <el-form-item label="检查项目" prop="inspectId">
                    <el-select v-uni="'weijizhishezhi_jianchaxiangmu'" v-model="ruleForm.inspectId" filterable clearable placeholder="请选择" @change="setInspectName">
                        <el-option
                                v-for="item in item_data"
                                :key="item.crisisDictId"
                                :label="item.crisisName"
                                :value="item.crisisDictId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用状态" prop="isEnable">
                    <el-switch v-uni="'weijizhishezhi_qiyongzhuangtai'" v-model="ruleForm.isEnable">
                    </el-switch>
                </el-form-item>
                <el-form-item label="危急值" prop="criticalValue" class="items">
                    <div>
                        <i class="el-icon-circle-plus-outline iconAddCls" style="font-size: 20px; color: #1e87f0; margin-top: 8px" @click.prevent="addValue" />
                    </div>
                    <div class="box">
                        <el-form-item
                                v-for="(item, index) in ruleForm.criticalValue"
                                :label="'关键词'+ (index + 1)"
                                :key="item.key"
                                :prop="'criticalValue.' + index + '.value'"
                                :rules="[{
                                    validator: valueRule(),
                                    trigger: 'blur'
                                }, {

                                }]"
                                label-width="90px">
                            <el-input v-uni:[index]="'weijizhishezhi_guanjianci'" v-model="item.value" placeholder="请输入" maxlength="20"></el-input>
                            <i class="el-icon-remove-outline iconDelCls"  @click.prevent="removeValue(index)" v-show="ruleForm.criticalValue.length > 1" />
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="临床意义及措施" prop="inspectMeasures">
                    <el-input
                            v-uni="'weijizhishezhi_linchuangyiyi'"
                            type="textarea"
                            :rows="6"
                            style="width:93%"
                            maxlength="1000"
                            show-word-limit
                            v-model="ruleForm.inspectMeasures"
                            placeholder="请输入"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer_btn">
            <el-button size="small" @click="close" v-uni="'weijizhishezhi_jianchacancel'">
                取消
            </el-button>
            <el-button type="primary" size="small" @click="submitForm" v-uni="'weijizhishezhi_jianchasave'">
                保存
            </el-button>
        </div>
    </layout>
</template>

<script>
import { ApiCriticalValueInspect } from '../../../api/nrms/index'
import layout from '../../../components/nrms/layout/edit'

export default {
  name: 'critical_value_inspect_add',
  components: { layout },
  data () {
    return {
      loading: false,
      form_type_text: '',
      item_data: [],
      ruleForm: {
        inspectId: '',
        inspectName: '',
        isEnable: true,
        inspectMeasures: '',
        criticalValue: [{ value: '' }, { value: '' }, { value: '' }]
      },
      rules: {
        inspectId: [
          { required: true, message: '请选择检查项目！', trigger: 'change' }
        ],
        isEnable: [],
        criticalValue: [
          { required: true, message: '请填写危急值！', trigger: 'blur' }
        ],
        inspectMeasures: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 1000) {
                callback(new Error('临床意义及措施不能超过1000个字符！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: ['detail'],
  created () {
    let params = this.detail || {}
    this.form_type_text = params['inspectId'] ? '编辑' : '添加'
    Object.assign(this.ruleForm, params)
    this.getItemData()
  },
  methods: {
    getItemData () {
      ApiCriticalValueInspect.selectItem({ crisisType: 1 })
        .then(res => {
          this.item_data = res.data || []
        })
        .catch(res => {
          console.log(res)
        })
    },
    valueRule () {
      return (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入关键词！'))
        } else if (value.length > 20) {
          callback(new Error('最多20个字符！'))
        } else {
          callback()
        }
      }
    },
    addValue () {
      if (this.ruleForm.criticalValue.length >= 10) {
        this.$message.error('每个项目最多支持添加10个关键词')
        return
      }
       this.ruleForm.criticalValue.push({ value: '' })
    },
    removeValue (index) {
      this.ruleForm.criticalValue.splice(index, 1)
    },
    setInspectName (id) {
      let name = ''
      for (let i = 0; i < this.item_data.length; i++) {
        if (this.item_data[i].crisisDictId === id) {
          name = this.item_data[i].crisisName
          break
        }
      }
      this.ruleForm.inspectName = name
    },
    submitForm () {
      let _formData = JSON.parse(JSON.stringify(this.ruleForm))

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiCriticalValueInspect.save(_formData)
            .then(() => {
              this.$message.success('保存正确！')
              this.close()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单 & 关闭窗体
    close () {
      this.$emit('changed', 'tabs')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    @import "../../../assets/nrms/css/self_common";

    .form-main-center {
        max-width: initial;
    }

    .items {
        > /deep/.el-form-item__content {

            .box {
                overflow: hidden;
                width: 93%;
                border: 1px solid #EBEEF5;
                padding: 5px 0;
            }

            .el-form-item {
                width: 450px;
                float: left;
                margin: 10px 0;
            }
        }

        i.iconDelCls {
            font-size: 20px;
            color: #F56C6C;
            /*margin-top: 8px; */
            margin-left: 12px
        }
    }
</style>
