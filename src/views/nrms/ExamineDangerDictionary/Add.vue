<template>
    <layout v-loading="loading">
        <div slot="title">
            <div class="title">{{form_type_text}}检验项目</div>
        </div>
        <div slot="main" class="add-from" >
            <el-form v-uni="'jianyanxiangmu_form'" :model="ruleForm" :inline="true" :rules="rules" label-suffix=":" ref="ruleForm" label-width="120px" class="form">
                <el-row>
                    <el-col :lg="12" :xl="8">
                        <el-form-item label="检验项目代码" prop="crisisCode" v-if="rowData&&rowData['crisisDictId'] ">
                            <el-input v-uni="'jianyanxiangmu_jianyanxiangmudaima'" v-model="ruleForm.crisisCode" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :xl="8">
                        <el-form-item label="检验项目名称" prop="crisisName">
                            <el-input v-uni="'jianyanxiangmu_jianyanxiangmumingcheng'" v-model="ruleForm.crisisName" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :xl="8">
                        <el-form-item label="显示名称" prop="crisisShowName">
                            <el-input v-uni="'jianyanxiangmu_xianshimingcheng'" v-model="ruleForm.crisisShowName" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="min-height: 200px;">
                    <el-col :span="24">
                        <el-form-item label="关联检验子项目" class="childTable">
                            <el-button v-uni="'jianyanxiangmu_guanlianzixiang'" type="warning" class="buttonStyle" @click="openChildExamine">添加</el-button> <br>
<childExamine :crisisChildData="crisisChildData" @reload="reload"></childExamine>
                        </el-form-item>
                    </el-col>
                </el-row>
               <el-row>
                   <el-col :span="24">
                       <el-form-item label="项目备注" prop="crisisNote" class="textarea">
                           <el-input
                                   v-uni="'jianyanxiangmu_remark'"
                                   type="textarea"
                                   :rows="5"
                                   v-model="ruleForm.crisisNote"
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
            <el-button v-uni="'jianyanxiangmu_cancel'" @click="close">取消</el-button>
            <el-button  v-uni="'jianyanxiangmu_save'" type="primary" @click="submitForm">保存</el-button>
        </div>
        <template>
            <el-dialog
                    title="添加关联检验子项目"
                    :visible="childExamineDialog"
                    :close-on-click-modal="false"
                    :show-close="false"
                    width="780px"
                    class="import-item-dialog"
            >
                <import-item ref="importItem" :selected-ids="selectedIds" @option-changed="confirmChildExamine" />
                <div slot="footer">
                    <el-button v-uni="'jianyanxiangmu_cancel'" size="small" @click="childExamineDialog = false">取消</el-button>
                    <el-button v-uni="'jianyanxiangmu_confirm'" type="primary" size="small" @click="confirm()">
                        确认
                    </el-button>
                </div>
            </el-dialog>
        </template>
    </layout>
</template>

<script>
import { ApiDangerClassify, ApiDangerDictionary } from '../../../api/nrms'
import layout from '../../../components/nrms/layout/edit'
import childExamine from './childExamine'
import importItem from './importItem'
export default {
  name: 'Add',
  props: {
    rowData: {
      type: Object,
      default: {
      }
    }
  },
  components: { layout, childExamine, importItem },
  data () {
    return {
      loading: false,
      form_type_text: '',
      classfyData: [], // 检查分类数组
      ruleForm: {
        crisisType: 2,
        crisisName: '',
        crisisShowName: '',
        crisisNote: '',
        crisisChildDictIds: '',
        crisisCode: ''
      },
      count: '',
      rules: {
        crisisName: [
          { required: true, message: '请输入检查项目名称！', trigger: 'blur' },
          { min: 1, max: 20, message: '长度不超过20个字符!', trigger: 'blur' }
        ],
        crisisShowName: [
          { required: true, message: '请输入显示名称！', trigger: 'change' },
          { min: 1, max: 20, message: '长度不超过20个字符!', trigger: 'blur' }
        ]
      },
      childExamineDialog: false,
      selectedIds: [], // 已导入的子项目ids
      crisisChildData: []// 关联检验子项目
    }
  },
  created () {
    let params = this.rowData

    this.form_type_text = params && params['crisisDictId'] ? '编辑' : '添加'
    if (params) {
      this.ruleForm = JSON.parse(JSON.stringify(params))
    }
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
    // 重置表单 & 关闭窗体
    close () {
      this.$emit('option-changed', 'list')
    },
    // 添加检验子项目
    openChildExamine () {
      this.selectedIds = this.rowData && this.rowData.crisisChildDictIds ? this.rowData.crisisChildDictIds.split(',') : []
      this.childExamineDialog = true
    },
    confirmChildExamine (multiIds) {
      console.log('multiIds', multiIds)
      this.ruleForm.crisisChildDictIds = multiIds
      this.childExamineDialog = false
    },
    confirm () {
      this.$refs.importItem.import()
    },
    // 查询关联检验子项目
    getRelationChildExamine () {
      this.loading = true
      ApiDangerDictionary.selectChild({ ids: this.ruleForm.crisisChildDictIds }).then(res => {
        this.crisisChildData = res.data || []
        this.loading = false
      }).catch(res => {
        this.loading = false
        this.$message.error(res.message)
      })
    },
    reload (deleteId) {
      let arr = this.ruleForm.crisisChildDictIds.split(',')
      let index = arr.indexOf(deleteId)
      arr.splice(index, 1)
      this.ruleForm.crisisChildDictIds = arr.join(',')
    }
  },
  watch: {
    'ruleForm.crisisChildDictIds': {
      handler () {
        this.getRelationChildExamine()
      },
      immediate: true
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
        .buttonStyle{
            min-width: 80px;
            border-radius: 2px !important;
            font-size: 14px !important;
            padding: 6px 12px !important;
            border: none;
            margin-bottom: 12px;
        }
        .childTable{
            width: 100%;
            /deep/.el-form-item__content{
                width: 90%;
                .main-list{
                    border-left: 1px solid #E6E6E6 ;
                    border-right: 1px solid #E6E6E6 ;
                }
            }
        }
        .textarea{
            width: 100%;
            /deep/.el-form-item__content{
                width: 90%;
                .el-textarea{
                    width: 100%;
                }
            }
        }
    }
    .import-item-dialog {
        /deep/ .el-dialog {
            padding: 0;
            height: 900px;
        }

        /deep/ .el-form {
            .el-form-item__label{
                height: 32px;
                line-height: 32px;
            }
            .el-input {
                /*width: 182px !important;*/
            }

            .el-input__inner {
                width: 100%;
                height: 32px;
            }
        }

        /deep/ .el-select {
            width: 100px;
        }
        /deep/ .main-list{
            border-left: 1px solid #E6E6E6 ;
            border-right: 1px solid #E6E6E6 ;
        }
    }
</style>
