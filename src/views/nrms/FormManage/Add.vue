<template>
    <layout>
        <div slot="title">
            {{operateType}}{{formPara.formTitle}}
        </div>

        <div slot="main"
             class="add-from">
            <el-form :model="formObj"
                     :rules="rules"
                     ref="ruleForm">
                <el-form-item v-if="opType === 'edit'"
                              :label="formPara.formTitle+'编号:'"
                              label-width="180px">
                    <el-input v-model.trim="formObj.formCode"
                              placeholder="" disabled></el-input>
                </el-form-item>
                <el-form-item :label="formPara.formTitle+'名称:'"
                              v-if="formPara.formType != EFormType.bodyCondition"
                              label-width="180px"
                              prop="formName">
                    <el-input v-model.trim="formObj.formName"
                              maxlength="20"
                              placeholder=""></el-input>
                </el-form-item>

                <el-form-item :label="formPara.formTitle+'名称:'"
                              v-else
                              label-width="180px"
                              prop="formName"
                >
                    <el-input v-model.trim="formObj.formName"
                              show-word-limit
                              maxlength="20"
                              placeholder=""></el-input>
                </el-form-item>
                <el-form-item :label="formTypeMap.label + '样式:'" label-width="180px" prop="formRelationStyle"
                              v-if="formTypeMap">
                    <!--体温单、血糖单编辑不能更改样式-->
                    <el-select v-model="formObj.formRelationStyle"
                               @change="(val) => SelectChange(val)"
                               filterable clearable placeholder="请选择"
                    :disabled="opType === 'edit'&&(formPara.formType==EFormType.bloodSugar||formPara.formType==EFormType.temperature)">
                        <el-option
                                v-for="item in formTypeMap.styleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="formPara.formTitle+'表头样式:'"
                              label-width="180px">
                    <el-button
                            type="primary"
                            plain
                            style="color: #1e87f0"
                            @click="initTplHtml"
                    >
                        导入默认表头
                    </el-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button
                            type="primary"
                            plain
                            style="color: #1e87f0"
                            @click="viewHead"
                    >
                        在预览窗口编辑
                    </el-button>
                </el-form-item>
                <el-form-item label=""
                              label-width="180px"
                              prop="formStyle">
                    <el-input type="textarea"
                              maxlength="2000"
                              style="width: 1200px"
                              class="auto-header-textarea"
                              v-model="formObj.formStyle"
                              :placeholder="'请输入'+formPara.formTitle+'表头样式:'"
                              clearable
                              resize="none"
                              ref="formStyleContainer"
                              show-word-limit></el-input>
                </el-form-item>
                <el-form-item :label="'打印设置:'"
                              label-width="180px"
                              prop="printSet"
                              v-if="formObj.formType != EFormType.temperature && formObj.formType != EFormType.bodyCondition&&formObj.formType != EFormType.shiftReport&&formObj.formType != EFormType.shiftRecord">
                    <el-select v-model="formObj.printSet"
                               placeholder="请选择">
                        <el-option v-for="item in printSet"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'交接权限控制:'"
                              label-width="180px"
                              prop="permissions"
                              v-if="formObj.formType != EFormType.temperature && formObj.formType != EFormType.bodyCondition && switchShow">
                    <el-switch
                            @change="(val) => switchChange(val)"
                            v-model="permissions"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                    <div>
                        若开启，则根据转出、转入进行编辑权限控制
                    </div>

                </el-form-item>

                <el-form-item :label="'读取体征按钮:'"
                              v-if="formObj.formType == EFormType.nurseNote"
                              label-width="180px"
                              prop="signIsShow">
                    <el-select v-model="formObj.signIsShow"
                               placeholder="请选择">
                        <el-option v-for="item in signIsShow"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'是否分页按钮:'"
                              v-if="formObj.formType == EFormType.nurseNote"
                              label-width="180px"
                              prop="pageSetShow">
                    <el-select v-model="formObj.pageSetShow"
                               placeholder="请选择">
                        <el-option v-for="item in pageSetShow"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'是否显示血糖仪编号:'"
                              v-if="formObj.formType == EFormType.bloodSugar"
                              label-width="180px"
                              prop="remarks.glucoseMeter">
                    <el-select v-model="formObj.remarks.glucoseMeter"
                               placeholder="请选择">
                        <el-option v-for="item in signIsShow"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="formTitle+'简介:'"
                              label-width="180px">
                    <el-input type="textarea"
                              maxlength="100"
                              style="width: 1200px"
                              class="introduction"
                              v-model="formObj.formSynopsis"
                              :placeholder="'请输入'+formPara.formTitle+'简介'"
                              clearable
                              resize="none"
                              show-word-limit></el-input>
                </el-form-item>

                <div v-if="formObj.formType == EFormType.nurseNote || (formObj.formType == EFormType.bloodSugar && formObj.formRelationStyle == EBloodSugarRelationStyle.shengli)">
                    <el-form-item :label="formPara.formTitle + '项目配置:'"
                                  label-width="180px">

                        <i @click.prevent="addItem()"
                           class="el-icon-circle-plus-outline iconAddCls"></i>

                        <template v-for="(formItem, index) in formObj.formDictExtendDoList">
                            <div class="hljl-container"
                                 :key="formItem.id">
                                <div class="hljl-main">
                                    <div class="hljl-title">
                                        配置{{index+1}}
                                    </div>
                                    <div class="hljl-item">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-form-item :label="'项目名称:'"
                                                              label-width="90px"
                                                              :rules="rules.projectName"
                                                              :prop="'formDictExtendDoList.'+index+'.projectName'">
                                                    <el-input v-model.trim="formItem.projectName"
                                                              type="text"
                                                              :clearable="true"
                                                              maxlength="20"
                                                              placeholder="请输入"/>
                                                    <!--@blur="isRepeat(formItem, index, 'projectName')"-->
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item :label="'字段名称:'"
                                                              label-width="90px"
                                                              :rules="rules.fieldName"
                                                              :prop="'formDictExtendDoList.'+index+'.fieldName'">
                                                    <el-input v-model.trim="formItem.fieldName"
                                                              type="text"
                                                              :clearable="true"
                                                              maxLength="100"
                                                              placeholder="请输入"/>
                                                    <!--@blur="isRepeat(formItem, index, 'fieldName')"-->
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item :label="'字段类型:'"
                                                              label-width="90px"
                                                              :rules="rules.type"
                                                              :prop="'formDictExtendDoList.'+index+'.type'">
                                                    <el-select v-model="formItem.type"
                                                               :clearable="false"
                                                               @change="(val) => itemSelectChange(val, formItem)"
                                                               placeholder="请选择">
                                                        <el-option v-for="hljlItem in hljlType"
                                                                   :key="hljlItem.value"
                                                                   :label="hljlItem.label"
                                                                   :value="hljlItem.value">
                                                        </el-option>
                                                    </el-select>
                                                    <i @click.prevent="addChild(formItem)"
                                                       v-if="formItem.type === 2"
                                                       class="el-icon-circle-plus-outline iconAddCls-item"></i>
                                                </el-form-item>
                                            </el-col>
                                            <template v-for="(child, index1) in formItem.item"
                                                      v-show="formItem.type === 2">
                                                <el-col :span="8" :key="child.id">
                                                    <el-form-item :label="'选项' + (index1+1) + ':'"
                                                                  label-width="90px"
                                                                  :rules="rules.value"
                                                                  :prop="'formDictExtendDoList.'+index+'.item.'+index1+'.value'">
                                                        <el-input v-model.trim="child.value"
                                                                  @input="forceUpdate"
                                                                  @change="forceUpdate"
                                                                  @blur="forceUpdate"
                                                                  @focus="forceUpdate"
                                                                  :clearable="true"
                                                                  type="text"
                                                                  maxlength="20"
                                                                  placeholder="请输入"/>
                                                        <i @click.prevent="delChild(child, formItem)"
                                                           class="el-icon-remove-outline iconDelCls-item"></i>
                                                    </el-form-item>
                                                </el-col>
                                            </template>
                                            <el-col :span="8"
                                                    v-if="formItem.type !== 2">
                                                <el-form-item :label="'字段长度:'"
                                                              label-width="90px"
                                                              :rules="rules.fieldLength"
                                                              :prop="'formDictExtendDoList.'+index+'.fieldLength'">
                                                    <el-input v-model.trim="formItem.fieldLength"
                                                              type="number"
                                                              :clearable="true"
                                                              oninput="if(value.length>4)value=value.slice(0, 4)"
                                                              maxlength="4"
                                                              placeholder="请输入"/>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8"
                                                    v-if="formItem.type === 3 && formPara.formType != EFormType.bloodSugar">
                                                <el-form-item :label="'引用焦点:'"
                                                              label-width="90px"
                                                              :rules="rules.focus"
                                                              :prop="'formDictExtendDoList.'+index+'.focus'">
                                                    <el-radio-group v-model="formItem.focus"
                                                                    @change="(val) => itemRadioChange(val, formItem)">
                                                        <el-radio :label="0">否</el-radio>
                                                        <el-radio :label="1">是</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </div>
                            <div class="hljl-func"
                                 :key="'hljl-func-' + formItem.id + ''">
                                <i @click.prevent="removeItem(formItem)"
                                   class="el-icon-remove-outline iconDelCls"></i>
                            </div>
                            <div class="clear-both"
                                 :key="'clear-both-' + formItem.id + ''"></div>
                        </template>
                    </el-form-item>
                </div>

            </el-form>
        </div>
        <div slot="footer_btn">
            <el-button size="small"
                       @click="close">
                取消
            </el-button>
            <el-button type="primary"
                       ref="submitButton"
                       size="small"
                       :loading="loadingBtn"
                       @click="submitForm">
                保存
            </el-button>
        </div>
        <el-dialog :title="formPara.formTitle+'表头样式可视化编辑:'"
                   :visible.sync="showDialog"
                   width="1200px"
                   height="800px"
                   :close-on-click-modal="false">
            <div class="pcListContainer">
                <div class="headShow"
                     style="height:180px;overflow:auto;margin-bottom:20px;">
                    <formHeader v-if="showDialog"
                                :autoHead="autoHead"></formHeader>
                </div>
                <el-link type="primary"
                         :underline="false"
                         @click="updataHeadHtml">更新预览
                </el-link>
                <div class="headCode"
                     style="height:350px;">
                    <el-input type="textarea"
                              maxlength="2000"
                              v-model="autoHead.tplHtml"
                              :placeholder="'请输入'+formPara.formTitle+'表头样式:'"
                              clearable
                              :autosize="{ minRows: 6,maxRows:16}"
                              resize="none"
                              show-word-limit
                              @change="updataHeadHtml"></el-input>
                </div>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="resetDialog">取消</el-button>
                <el-button type="primary" @click="setContant">确认</el-button>
            </div>
        </el-dialog>
    </layout>
</template>

<script>
import layout from '../../../components/nrms/layout/edit'
import { ApiAutoForm, ApiFormMange } from '../../../api/nrms'
import formHeader from '../../../components/nrms/autoForm/header'
import {
  temperatureStyle,
  observeNoteStyle,
  operateStyle,
  jiaoJieStyle,
  AutoFormType,
  ModuleIdToAssClass,
  FormTypeMap,
  ModuleIdToModuleJson,
  AssHaveRateList,
  AssRateMap,
  AssColumnMap
} from './temperatureConfig'
import { EFormType, EFormTypeText, EBloodSugarRelationStyle } from '../../../assets/nrms/enum/formManage'

let _THAT
export default {
  name: 'formMangeAdd',
  components: { layout, formHeader },
  props: ['detail', 'opType', 'formPara'],
  data () {
    return {
      initFormHead: `
               <div style="100%">
              <table width="1000" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td width="33%">
                   <div v-if="baseObj.hospitalLogo" style="width:151px;height:40px;padding:5px; border-radius: 5px;position:relative;"><img style="position: absolute;top: 20px;left: 0;" :src="baseObj.hospitalLogo" /></div>
                  </td>
                  <td width="33%">
                    <div style="font-size:18px;text-align:center;margin-bottom:5px;">
                        <img src="./static/nams/unit_logo/logo.png" style="max-width: 398px;  margin: 10px auto;">
                      </div>
                      <div style="font-size:24px;text-align:center;">
                        {{baseObj.formName}}
                      </div>
                  </td>
                  <td width="33%">
                    <div style="display:none;text-align:right;">
                        编号：{{dataObj.tplId}}
                      </div>
                  </td>
                </tr>
              </table>
              <ul :style="styleObj.ulStyle">
                <li :style="styleObj.liStyle">姓名：{{dataObj.tplData.patientName}}</li>
                <li :style="styleObj.liStyle">性别：{{dataObj.tplData.sex}}</li>
                <li :style="styleObj.liStyle">年龄：{{dataObj.tplData.patientAge}}</li>
                <li :style="styleObj.liStyle">护理级别：{{dataObj.tplData.nurseLevel}}</li>
                <li :style="styleObj.liStyle" >科室：{{dataObj.tplData.deptName}}</li>
                <li :style="styleObj.liStyle" >住院号：{{dataObj.tplData.inpNo}}</li>
                <li :style="styleObj.liStyle" >床号：{{dataObj.tplData.bedName}}</li>
              </ul>
              </div>
         `,
      initShiftReportFormHead: `
               <div style="100%">
              <table width="1000" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td width="33%">
                   <div v-if="baseObj.hospitalLogo" style="width:151px;height:40px;padding:5px; border-radius: 5px;position:relative;"><img style="position: absolute;top: 20px;left: 0;" :src="baseObj.hospitalLogo" /></div>
                  </td>
                  <td width="33%">
                    <div style="font-size:18px;text-align:center;margin-bottom:5px;">
                        <img src="./static/nams/unit_logo/logo.png" style="max-width: 398px;  margin: 10px auto;">
                      </div>
                      <div style="font-size:24px;text-align:center;">
                        {{baseObj.formName}}
                      </div>
                  </td>
                  <td width="33%">
                    <div style="display:none;text-align:right;">
                        编号：{{dataObj.tplId}}
                      </div>
                  </td>
                </tr>
              </table>
              <ul :style="styleObj.ulStyle">
                <li :style="styleObj.liStyle">科室：{{dataObj.tplData.deptName}}</li>
                <li :style="styleObj.liStyle">日期：{{dataObj.tplData.shiftTime}}</li>
              </ul>
              </div>
         `,
      showDialog: false,
      loading: false,
      loadingBtn: false,
      EBloodSugarRelationStyle,
      formTitle: '',
      formObj: {
        formId: '',
        formCode: '',
        formName: '',
        formStyle: '',
        formVersion: '',
        formStructure: '',
        formSynopsis: '',
        printSet: '',
        signIsShow: '',
        pageSetShow: '',
        formRelationStyle: '', // 体温单样式
        formType: '',
        authControl: '0', // 中心医院权限开关 0未开启 1开启
        remarks: {
          // glucoseMeter: ''// 血糖单是否显示血糖仪编号字段
        },
        formDictExtendDoList: []
      },
      permissions: false,
      switchShow: false, // 权限开关显示
      temperatureStyle,
      observeNoteStyle,
      operateStyle,
      jiaoJieStyle,
      printSet: [
        {
          value: 1,
          label: '纵向'
        },
        {
          value: 2,
          label: '横向'
        }
      ],
      signIsShow: [
        {
          value: 0,
          label: '不显示'
        },
        {
          value: 1,
          label: '显示'
        }
      ],
      pageSetShow: [
        {
          value: 0,
          label: '不显示'
        },
        {
          value: 1,
          label: '显示'
        }
      ],
      rules: {
        formName: [
          { required: true, message: '请输入' + this.formPara.formTitle + '名称', trigger: 'blur' }
        ],
        formStyle: [
          { required: true, message: this.formPara.formTitle + '表头样式不可为空', trigger: 'blur' }
        ],
        formRelationStyle: [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                if (this.formPara.formType === EFormType.bloodSugar) {
                  return callback(new Error(EFormTypeText[EFormType.bloodSugar] + '样式不可为空!'))
                } else if (this.formPara.formType === EFormType.inOut) {
                  return callback(new Error(EFormTypeText[EFormType.inOut] + '样式不可为空!'))
                } else if (this.formPara.formType === EFormType.observe) {
                  return callback(new Error(EFormTypeText[EFormType.observe] + '样式不可为空!'))
                } else if (this.formPara.formType === EFormType.temperature) {
                  return callback(new Error(EFormTypeText[EFormType.temperature] + '样式不可为空!'))
                } else if (this.formPara.formType === EFormType.operation) {
                  return callback(new Error(EFormTypeText[EFormType.operation] + '样式不可为空!'))
                } else if (this.formPara.formType === EFormType.handover) {
                  return callback(new Error(EFormTypeText[EFormType.handover] + '样式不可为空!'))
                } else if (this.formPara.formType === EFormType.intoAssess) {
                  return callback(new Error(EFormTypeText[EFormType.intoAssess] + '样式不可为空!'))
                } else if (this.formPara.formType === EFormType.admissionAssess) {
                  return callback(new Error(EFormTypeText[EFormType.admissionAssess] + '样式不可为空!'))
                } else if (this.formPara.formType === EFormType.riskAssessment) {
                  return callback(new Error(EFormTypeText[EFormType.riskAssessment] + '样式不可为空!'))
                }
              } else {
                return callback()
              }
            },
            trigger: 'blur'
          }
        ],
        formStructure: [
          { required: true, message: this.formPara.formTitle + '表头字段不可为空', trigger: 'blur' }
        ],
        printSet: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        signIsShow: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        pageSetShow: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        'remarks.glucoseMeter': [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: this.itemValidator, trigger: 'blur' }
        ],
        fieldName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: this.itemValidator, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        fieldLength: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback()
              } else {
                if (!/^[1-9]\d*$/.test(value)) {
                  callback(new Error('只能输入正整数'))
                } else {
                  if (value <= 0 || value > 5000) {
                    callback(new Error('只能输入1到5000之间的数字'))
                  } else {
                    callback()
                  }
                }
              }
            },
            trigger: 'blur'
          }
        ],
        value: [
          {
            validator: (rule, value, callback) => {
              // I'm a genius.
              let that = _THAT
              that.forceUpdate()
              let field = rule.field
              let arr = field.split('.')
              let index = +arr[1]
              let index1 = +arr[3]
              let _value = that.formObj.formDictExtendDoList[index].item[index1].value
              if (_value === '' || _value === null || _value === undefined) {
                callback(new Error('请输入'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      dialogHeadCode: '',
      // 自动表头所用
      autoHead: {
        tplId: 'XXXX-XXXXX',
        formName: '',
        tplHtml: ''
      },
      params: {},
      EFormType
    }
  },
  computed: {
    operateType () {
      return this.detail && this.detail.formId ? '编辑' : '添加'
    },
    // formtype对应的参数字段
    formTypeMap () {
      return FormTypeMap.get(this.formPara.formType)
    },
    // 是否是自动表单出来的
    isAutoForm () {
      return AutoFormType.indexOf(this.formPara.formType) >= 0
    },
    hljlType () {
      let hljlType = [
        {
          label: '文本框',
          value: 0
        },
        {
          label: '数字',
          value: 1
        },
        {
          label: '下拉选项',
          value: 2
        },
        {
          label: '文本域',
          value: 3
        }
      ]
      if (this.formObj.formType == EFormType.bloodSugar && this.formObj.formRelationStyle == EBloodSugarRelationStyle.shengli) {
        hljlType = hljlType.filter(item => item.value != 2)
      }
      return hljlType
    }
  },
  beforeCreate () {
    _THAT = this
  },
  created () {
    this.formTitle = this.formPara.formTitle
    this.init()
    console.log(this.detail, this.opType, this.formPara, '0=====================')
    // this.autoHead.formName = this.formTitle;
  },
  methods: {
    init () {
      // 如果是血糖单，初始化血糖仪编号是否显示字段
      if (this.formPara.formType === EFormType.bloodSugar) {
        this.$set(this.formObj.remarks, 'glucoseMeter', '')
      }
      if (this.opType === 'edit') {
        this.formObj = this.detail
        if (this.formObj.moduleId == '10025') {
          if (this.formObj.authControl == '1') {
            this.permissions = true
          } else {
            this.permissions = false
          }
          this.switchShow = true
        }
      } else {
        // this.formObj.formCode = this.getAddFormCode();
        this.formObj.formType = this.formPara.formType
      }

      if (this.formObj.formType == EFormType.nurseNote) {
        if (this.detail && this.detail.formId) {
          this.formObj.formDictExtendDoList = this.formObj.formDictExtendDoList || []
        }
      }
      this.loading = false
    },
    /**
             * 重复性判断
             **/
    itemValidator: (rule, value, callback) => {
      let that = _THAT
      that.forceUpdate()
      let field = rule.field
      let ruleArr = field.split('.')
      let index = +ruleArr[1]
      let type = ruleArr[2]
      if (type === 'fieldName') {
        if (value === '') {
          callback()
          return false
        }
      } else {
        if (value === '') {
          callback()
          return false
        }
      }
      let arr = []
      for (let i = 0; i < that.formObj.formDictExtendDoList.length; i++) {
        let formDictExtendDoListItem = that.formObj.formDictExtendDoList[i]
        let formDictExtendDoListFieldName = formDictExtendDoListItem.fieldName
        let formDictExtendDoListProjectName = formDictExtendDoListItem.projectName
        if (index !== i) {
          if (type === 'fieldName') {
            if (formDictExtendDoListFieldName !== '') {
              if (formDictExtendDoListFieldName === value) {
                arr.push(i)
              }
            }
          } else {
            if (formDictExtendDoListProjectName !== '') {
              if (formDictExtendDoListProjectName === value) {
                arr.push(i)
              }
            }
          }
        }
      }
      if (arr.length !== 0) {
        if (type === 'fieldName') {
          callback(new Error('与配置' + (+arr[0] + 1) + '的字段名称重复'))
          setTimeout(function () {
            that.formObj.formDictExtendDoList[index].fieldName = ''
          }, 500)
        } else {
          callback(new Error('与配置' + (+arr[0] + 1) + '的项目名称重复'))
          setTimeout(function () {
            that.formObj.formDictExtendDoList[index].projectName = ''
          }, 500)
        }
      } else {
        callback()
      }
    },
    getAddFormCode () {
      ApiAutoForm.getNextFormCode({ formType: this.formPara.formType }).then(res => {
        if (res.desc === '操作成功') {
          this.formObj.formId = res.data.formId
          this.formObj.formCode = res.data.formCode
        }
      })
    },
    initTplHtml () {
        // 交班报告默认表头单独样式
      this.formObj.formStyle = this.formPara.formType === '12' ? this.initShiftReportFormHead : this.initFormHead
    },
    viewHead () {
      if (this.formObj.formStyle === '') {
        this.$message.warning('请选录入或导入模板内容')
        this.$refs.formStyleContainer.focus()
      } else {
        this.autoHead.tplId = this.formObj.formCode || 'XXXX-XXXX'
        this.autoHead.tplHtml = this.formObj.formStyle
        this.autoHead.formName = this.formObj.formName
        this.showDialog = true
      }
    },
    updataHeadHtml () {
      // this.autoHead.tplHtml = this.dialogHeadCode;
    },
    resetDialog () {
      this.showDialog = false
    },
    setContant () {
      this.formObj.formStyle = this.autoHead.tplHtml
      this.autoHead.tplHtml = ''
      this.showDialog = false
    },
    submitForm () {
      let _this = this
      _this.loadingBtn = true

      _this.$refs.ruleForm.validate(async valid => {
        console.log(this.formObj, '33333333')
        if (valid) {
          /** *******************护理记录配置-start*********************/
          if (this.formObj.formType == EFormType.nurseNote || this.formObj.formType == EFormType.bloodSugar) {
            /* for (let i = 0; i < this.formObj.formDictExtendDoList.length; i++) {
                                                let item = this.formObj.formDictExtendDoList[i]
                                                let fieldLength = item.fieldLength
                                                let fieldName = item.fieldName
                                                let projectName = item.projectName
                                                let type = item.type
                                                let _item = item.item

                                                if (projectName === '') {
                                                  this.$message.error('配置' + (i + 1) + '的项目名称不能为空')
                                                  return false
                                                }
                                                if (fieldName === '') {
                                                  this.$message.error('配置' + (i + 1) + '的字段名称不能为空')
                                                  return false
                                                }

                                                if (type === 0) { // 文本框0，数字1，下拉2，文本域3
                                                  if (fieldLength === '') {
                                                    this.$message.error('配置' + (i + 1) + '的字段长度不能为空')
                                                    return false
                                                  }
                                                } else if (type === 1) {
                                                  if (fieldLength === '') {
                                                    this.$message.error('配置' + (i + 1) + '的字段长度不能为空')
                                                    return false
                                                  }
                                                } else if (type === 3) {
                                                  if (fieldLength === '') {
                                                    this.$message.error('配置' + (i + 1) + '的字段长度不能为空')
                                                    return false
                                                  }
                                                } else {
                                                  for (let j = 0; j < _item.length; j++) {
                                                    let child = _item[j]
                                                    let value = child.value
                                                    if (value === '') {
                                                      this.$message.error('配置' + (i + 1) + '的选项内容不能为空')
                                                      return false
                                                    }
                                                  }
                                                }
                                              } */
            for (let p = 0; p < this.formObj.formDictExtendDoList.length; p++) {
              let item = this.formObj.formDictExtendDoList[p]
              let type = item.type
              if (type === 2) {
                this.formObj.formDictExtendDoList[p].fieldLength = 0
              }
              this.formObj.formDictExtendDoList[p].sort = p // 增加排序
            }
          }
          /** *******************护理记录配置-end*********************/

          /** **************************************自动表单保存start****************************************/
          if (this.isAutoForm) {
            console.log(ModuleIdToModuleJson, 'ModuleIdToModuleJson')
            const AssFormObj = {
              'assName': _this.formObj.formName,
              'assType': _this.formTypeMap.assType,
              'assClass': ModuleIdToAssClass.get(_this.formObj.formRelationStyle), // 1 手术评估 2 交接单 3 压疮风险患者翻身记录单 4静脉血栓观察护理记录单
              'haveRecordRate': AssHaveRateList.indexOf(_this.formObj.formRelationStyle) >= 0 ? 1 : 0,
              'moduleId': _this.formObj.formRelationStyle,
              'moduleJson': JSON.parse(JSON.stringify(ModuleIdToModuleJson.get(_this.formObj.formRelationStyle))),
              'printType': _this.formObj.printSet,
              'assStyle': _this.formObj.formStyle,
              'remark': _this.formObj.formSynopsis,
              'assRate': AssRateMap.get(_this.formObj.formRelationStyle),
              'authControl': _this.formObj.authControl
            }

            if (_this.opType === 'edit') {
              AssFormObj.assId = _this.formObj.formId
              try {
                const res = await ApiFormMange.edit(AssFormObj)
                _this.$message.success('保存正确！')
                _this.loadingBtn = false
                _this.close()
              } catch (error) {
                _this.loadingBtn = false
                _this.$message.error(error.message)
              }
            } else {
              try {
                AssFormObj.columns = AssColumnMap.get(_this.formObj.formRelationStyle)
                const res = await ApiFormMange.add(AssFormObj)
                _this.$message.success('保存正确！')
                _this.loadingBtn = false
                _this.close()
              } catch (error) {
                _this.loadingBtn = false
                _this.$message.error(error.message)
              }
            }
            return
          }
          /** **************************************自动表单保存end****************************************/
          if (!_this.formObj.formRelationStyle) {
            _this.formObj.formRelationStyle = '-1'
          }
          if (_this.opType === 'edit') {
            ApiAutoForm.putForm(_this.formObj)
              .then(res => {
                if (res.status === '200' || res.status === 200) {
                  _this.$message.success('保存正确！')
                  _this.loadingBtn = false
                  _this.close()
                }
              })
              .catch(res => {
                _this.loadingBtn = false
                _this.$message.error(res.message)
              })
          } else {
            ApiAutoForm.postForm(_this.formObj)
              .then(res => {
                if (res.status === '200' || res.status === 200) {
                  _this.$message.success('保存正确！')
                  _this.loadingBtn = false
                  _this.close()
                }
              })
              .catch(res => {
                _this.$message.error(res.message)
                _this.loadingBtn = false
              })
          }
        } else {
          _this.loadingBtn = false
        }
      })
    },
    // 重置表单 & 关闭窗体
    close () {
      // this.autoHead.tplHtml = this.formObj.formStyle;
      this.formObj = {
        formCode: '',
        formType: '',
        formName: '',
        formStyle: '',
        formVersion: '',
        formStructure: '',
        formSynopsis: '',
        formDictExtendDoList: []
      }
      this.$emit('changed', 'list')
    },
    /** ***************************护理记录配置-start********************************/
    // 添加项目
    addItem () {
      if (this.formObj.formDictExtendDoList.length >= 10) {
        this.$message.error('最多配置10个项目!')
        return false
      }
      this.formObj.formDictExtendDoList.push({
        id: (this.formObj.formId || '').substring(0, 4) + '_' + Date.now(),
        formId: this.formObj.formId || '',
        type: 0, // 文本框0，数字1，下拉2
        fieldName: '', // 字段名称
        fieldLength: '', // 字段长度
        projectName: '', // 项目名称
        focus: 0// 是否引用焦点 否0，是1
      })

      this.forceUpdate()
    },
    // 删除项目
    removeItem (item) {
      let that = this
      let index = this.formObj.formDictExtendDoList.indexOf(item)
      this.$confirm('确认要删除 配置' + (index + 1) + ' 吗?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        if (index !== -1
        ) {
          that.formObj.formDictExtendDoList.splice(index, 1)
        }
        that.$message.success('删除成功!')
        that.forceUpdate()
      }).catch(() => {

      })
    },
    // 增加选项
    addChild (item) {
      let id = item.id
      let param = {
        id: (this.formObj.formId || '').substring(0, 4) + '_item_' + Date.now(),
        value: ''
      }
      for (let i = 0; i < this.formObj.formDictExtendDoList.length; i++) {
        let contentItem = this.formObj.formDictExtendDoList[i]
        let contentItemId = contentItem.id
        if (id === contentItemId) {
          let contentItemItem = contentItem.item || []
          if (contentItemItem.length >= 10) {
            this.$message.error('最多配置10个选项!')
            return false
          } else {
            this.formObj.formDictExtendDoList[i].item.push(param)
            this.forceUpdate()
          }
        }
      }
    },
    // 删除选项
    delChild (child, parent) {
      let parentId = parent.id
      for (let i = 0; i < this.formObj.formDictExtendDoList.length; i++) {
        let contentItem = this.formObj.formDictExtendDoList[i]
        let contentItemId = contentItem.id
        if (parentId === contentItemId) {
          let index = this.formObj.formDictExtendDoList[i].item.indexOf(child)
          if (index !== -1

          ) {
            if (this.formObj.formDictExtendDoList[i].item.length <= 1) {
              this.$message.warning('需至少保留一个选项!')
            } else {
              this.formObj.formDictExtendDoList[i].item.splice(index, 1)
              this.$message.success('删除成功!')
              this.forceUpdate()
            }
          }
        }
      }
    },
    // 下拉选项修改时
    itemSelectChange (val, item) {
      let id = item.id
      if (val !== 2) { // 不为下拉时 // 文本框0，数字1，下拉2，框3
        for (let i = 0; i < this.formObj.formDictExtendDoList.length; i++) {
          let contentItem = this.formObj.formDictExtendDoList[i]
          let contentItemId = contentItem.id
          if (id === contentItemId) {
            this.formObj.formDictExtendDoList[i].item = []
            this.formObj.formDictExtendDoList[i].focus = 0 // 切换的时候要让焦点默认为0不引用
            this.forceUpdate()
          }
        }
      } else { // 为下拉2时
        for (let i = 0; i < this.formObj.formDictExtendDoList.length; i++) {
          let contentItem = this.formObj.formDictExtendDoList[i]
          let contentItemId = contentItem.id
          if (id === contentItemId) {
            this.formObj.formDictExtendDoList[i].item = [
              { id: (this.formObj.formId || '').substring(0, 4) + '_item_' + Date.now(), value: '' },
              {
                id: (this.formObj.formId || '').substring(0, 4) + '_item_' + (+Date.now() + 1),
                value: ''
              },
              {
                id: (this.formObj.formId || '').substring(0, 4) + '_item_' + (+Date.now() + 2),
                value: ''
              }
            ]
            this.formObj.formDictExtendDoList[i].focus = 0 // 切换的时候要让焦点默认为0不引用
            this.forceUpdate()
          }
        }
      }
    },
    // 单选修改时
    itemRadioChange (val, item) {
      let id = item.id
      if (val === 1 || val === '1') {
        let arr = []
        for (let i = 0; i < this.formObj.formDictExtendDoList.length; i++) {
          let contentItem = this.formObj.formDictExtendDoList[i]
          let contentItemFocus = contentItem.focus
          if (contentItemFocus === 1 || contentItemFocus === '1') {
            arr.push(1)
          }
        }
        if (arr.length >= 2) {
          this.$message.error('有且仅有一个引用焦点为“是”')
          for (let i = 0; i < this.formObj.formDictExtendDoList.length; i++) {
            let contentItem = this.formObj.formDictExtendDoList[i]
            let contentItemId = contentItem.id
            if (id === contentItemId) {
              this.formObj.formDictExtendDoList[i].focus = 0
              this.forceUpdate()
            }
          }
        }
      }
    },
    // 检测是否重复
    isRepeat (formItem, index, type) {
      let that = this
      let id = formItem.id
      let fieldName = formItem.fieldName
      let projectName = formItem.projectName
      if (type === 'fieldName') {
        if (fieldName === '') {
          return false
        }
      } else {
        if (projectName === '') {
          return false
        }
      }
      let arr = []
      for (let i = 0; i < this.formObj.formDictExtendDoList.length; i++) {
        let formDictExtendDoListItem = this.formObj.formDictExtendDoList[i]
        let formDictExtendDoListFieldId = formDictExtendDoListItem.id
        let formDictExtendDoListFieldName = formDictExtendDoListItem.fieldName
        let formDictExtendDoListProjectName = formDictExtendDoListItem.projectName
        if (formDictExtendDoListFieldId !== id) {
          if (type === 'fieldName') {
            if (formDictExtendDoListFieldName !== '') {
              if (formDictExtendDoListFieldName === fieldName) {
                arr.push(i)
              }
            }
          } else {
            if (formDictExtendDoListProjectName !== '') {
              if (formDictExtendDoListProjectName === projectName) {
                arr.push(i)
              }
            }
          }
        }
      }
      if (arr.length !== 0) {
        if (type === 'fieldName') {
          this.$message.error('配置' + (index + 1) + '与配置' + (+arr[0] + 1) + '的字段名称重复')
          setTimeout(function () {
            that.formObj.formDictExtendDoList[index].fieldName = ''
          }, 500)
        } else {
          this.$message.error('配置' + (index + 1) + '与配置' + (+arr[0] + 1) + '的项目名称重复')
          setTimeout(function () {
            that.formObj.formDictExtendDoList[index].projectName = ''
          }, 500)
        }
      }
    },
    // 添加中心医院转科单开关权限
    SelectChange (val) {
      if (val == '10025') {
        this.switchShow = true
      }
    },
    // 权限开关
    switchChange (val) {
      this.permissions = val
      if (val) {
        this.formObj.authControl = '1'
      } else {
        this.formObj.authControl = '0'
      }
    },
    /** ***************************护理记录配置-end********************************/
    forceUpdate () {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    @import "../../../assets/nrms/css/self_common";

    .alignCenter {
        /*width: 800px;*/
        margin: 20px auto;
    }

    .w-800 {
        width: 800px !important;
    }

    .add-from .el-form-item {
        margin-bottom: 18px;
    }

    .add-from .el-form-item__content > div.el-textarea {
        width: 600px;
    }

    /deep/ .el-textarea__inner {
        border-radius: 2px
    }

    /deep/ .el-button--small {
        border-radius: 2px !important;
    }

    /deep/ .el-checkbox {
        display: block;
        margin-bottom: 15px;
    }

    /deep/ .el-dialog__body {
        padding-bottom: 0;
    }

    /deep/ .el-checkbox__input {
        display: inline-block;
        vertical-align: top;

        span.el-checkbox__inner {
            margin-top: 2px;
        }
    }

    /deep/ .el-checkbox__inner {

    }

    /deep/ .el-checkbox__label {
        width: 90%;
        white-space: normal;
        vertical-align: top;
    }

    /deep/ label.is-checked {
        .el-checkbox__label {
            color: #606266 !important;
        }
    }

    /deep/ .el-link--inner:hover {
        font-weight: 600
    }

    /deep/ .auto-header-textarea textarea {
        height: 364px;
        min-height: 364px;
    }

    /deep/ .introduction textarea {
        height: 75px;
        min-height: 75px;
    }

    .pcListContainer {
        margin: 0 0 0 20px;
    }

    .iconAddCls {
        font-size: 24px;
        color: #409EFF;
        cursor: pointer;
        margin: 5px 0 30px 0;
        vertical-align: top;
    }

    .iconAddCls-item {
        font-size: 24px;
        color: #409EFF;
        cursor: pointer;
        margin: 5px 0 0 5px;
        vertical-align: top;
    }

    .iconDelCls {
        font-size: 24px;
        color: #F56C6C;
        cursor: pointer;
        margin-left: 10px;
        vertical-align: top;
    }

    .iconDelCls-item {
        font-size: 24px;
        color: #F56C6C;
        cursor: pointer;
        margin: 5px 0 0 5px;
        vertical-align: top;
    }

    .hljl-container {
        /*width: 100%;/*/

        .hljl-main {
            padding: 5px 10px;
            border: 1px solid #DCDFE6;
            border-radius: 2px;
            width: 1100px;
            float: left;
            margin: 0 0 20px 0;

            .hljl-title {
                width: 100%;
                height: 40px;
            }

            .hljl-item {
                width: 100%;

                .hljl-item-main {

                    .hljl-item-label {
                        float: left;
                        width: 80px;
                    }

                    .hljl-item-value {
                        float: left;
                        width: 300px;
                    }

                    .hljl-item-func {
                        float: left;
                        width: 50px;
                    }
                }
            }

            /deep/ .el-form-item__content div.el-input,
            /deep/ .el-form-item__content div.el-select,
            /deep/ .el-form-item__content div.el-textarea,
            /deep/ .el-form-item__content div.vue-treeselect {
                width: auto;
            }
        }

        .hljl-func {
            width: 5%;
            float: right;
        }
    }

    .border {
        border: 1px solid red;
    }

    .clear-both {
        clear: both;
    }
</style>
