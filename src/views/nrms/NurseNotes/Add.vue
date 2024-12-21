<template>
  <LayoutEdit v-loading="loading">
    <div slot="title">
      {{ form_type_text }}{{formListObj.formName || ''}}
    </div>
    <div slot="main" class="add-from">
      <LayoutList>
        <div slot="right_btn" class="tool-bar">
          <el-button type="primary" v-uni="'hulijilu_edit_duqutizheng'" @click="getSigns" size="small" v-if="formListObj.signIsShow">读取体征</el-button>
          <el-button type="success" @click="setPaged" size="small"
                     v-if="formListObj.pageSetShow&&formListObj.pageSetShow===1"
                     v-uni="'hulijilu_edit_shezhifenye'"
          >{{this.ruleForm.skipPage ? '取消分页' : '设置分页'}}
          </el-button>
        </div>
        <div style="display: flex;padding: 0 20px;" slot="main">
          <div style="flex:1">
            <el-form
              :model="ruleForm"
              ref="ruleForm"
              label-width="140px"
              label-suffix=":"
            >
              <!-- 患者基本信息  -->
              <div style="width: 50%;">
                <el-row>
                  <el-form-item label="日期" v-if="formListObj.formCode !== 'H-000010-WHJ-0021' && formListObj.formCode !== 'H-000010-WHJ-0024'">
                    <el-col :span="10">
                      <el-date-picker
                        v-model="ruleForm.recordDate"
                        :clearable="false"
                        :editable="false"
                        type="datetime"
                        valueFormat="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        v-uni="'hulijilu_edit_date'"
                        placeholder="">
                      </el-date-picker>
                    </el-col>
                  </el-form-item>

                  <el-col :span="12">
                    <el-form-item label="日期" v-if="formListObj.formCode === 'H-000010-WHJ-0021' || formListObj.formCode === 'H-000010-WHJ-0024'">
                      <el-date-picker
                        v-model="time"
                        :clearable="false"
                        type="date"
                        valueFormat="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        v-uni="'hulijilu_edit_date'"
                        placeholder="">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="时间" v-if="formListObj.formCode === 'H-000010-WHJ-0021' || formListObj.formCode === 'H-000010-WHJ-0024'">
                      <el-time-picker
                        v-model="hour"
                        :clearable="false"
                        valueFormat="HH:mm"
                        format="HH:mm"
                        v-uni="'hulijilu_edit_shijian'"
                        placeholder="">
                      </el-time-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <template v-for="(items,index) in fixed_item">
                <template v-if="(formListObj.formCode === 'H-000010-WHJ-0005' || formListObj.formCode === 'H-000010-WHJ-0024') && items.signClassifyName === '出入量'">
                  <!--2020-12-25 世博医院-危重患者评估与记录单特殊处理入量和出量 (H-000010-WHJ-0005 和 H-000010-WHJ-0024（省立）)-->
                  <div class="className" :key="index+'rl'">出入量</div>
                  <template v-if="(formListObj.formCode === 'H-000010-WHJ-0005' || formListObj.formCode === 'H-000010-WHJ-0024') && ruLiangSignItem.length > 0">
                    <div style="height: 45px; line-height: 45px; padding-left: 30px; margin-bottom: 20px" :key="index+'_rl'">入量:
                      <div class="config-btn" @click="addSignItem('ru')" v-uni="'hulijilu_edit_ruliang_zengjia'">
                        <i class="el-icon-circle-plus-outline"/>
                      </div>
                    </div>

                    <el-row class="signClass" v-for="(ruForm, formIndex) in ruLiangForm" :key="index + formIndex + 'two'">
                      <legend style="margin-left: 25px;background: RGB(255,255,255);width: 50px;margin-top: -10px;font-size: 14px;">入量{{formIndex + 1}}:</legend>
                      <div
                        class="config-btn"
                        style="margin-top: 0px;position: absolute;right: 10px;cursor: pointer;z-index: 100;"
                        v-if="formIndex > 0"
                        v-uni:[formIndex]="'hulijilu_edit_ruliang_delete'"
                        @click="delSignItem('ru', formIndex)"
                      >
                        <i class="el-icon-remove-outline"/>
                      </div>
                      <el-col v-for="(item,index) in ruLiangSignItem" :key="item.signId" :xl="8" :lg="12" style="padding:10px 0">
                        <el-form-item
                          :label="item.signItemShowName"
                          :rules="[
                      {
                        validator: getSignRule(item.signItemFieldType,item.signItemFieldLength),
                        trigger: 'change'
                      }]"
                        >
                          <el-col :span="20">
                            <el-select
                              v-if="item.signItemFieldType==='3'||item.signItemFieldType==='4' || item.signItemFieldType==='6'||item.signItemFieldType==='7'"
                              v-model="ruLiangForm[formIndex][item.signId].itemValue"
                              clearable
                              :ref="'select-'+index"
                              :id="'index'"
                              @focus="selectFocus(index)"
                              :filterable="item.signItemFieldType==='6'||item.signItemFieldType==='7'"
                              :allow-create="item.signItemFieldType==='6'||item.signItemFieldType==='7'"
                              :placeholder="(item.signItemFieldType==='6'||item.signItemFieldType==='7') ? '请选择或输入' : '请选择'"
                              v-uni:[formIndex]="'hulijilu_edit_ruliang_'+item.signItemShowName"
                              >
                              <el-option
                                label=""
                                value=""
                              >
                              </el-option>
                              <el-option
                                v-for="(value,index) in item.signItemSvgSetting"
                                :key="index+'op'"
                                :label="value.settingItem"
                                :value="value.settingItem">
                              </el-option>
                            </el-select>
                            <el-input
                              v-else
                              clearable
                              :type="item.signItemFieldType === '2' ? 'number' : ''"
                              :min="item.signItemFieldType === '2' ? 0 : ''"
                              v-model="ruLiangForm[formIndex][item.signId].itemValue"
                              placeholder="请输入"
                              v-uni:[formIndex]="'hulijilu_edit_ruliang'+item.signItemShowName"
                            >
                            </el-input>
                          </el-col>
                          <el-col :span="4">
                            <div v-if="item.signItemUnit" style="text-align: left; padding-left: 5px">
                              {{item.signItemUnit}}
                            </div>
                          </el-col>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                  <template v-if="(formListObj.formCode === 'H-000010-WHJ-0005' || formListObj.formCode === 'H-000010-WHJ-0024') && chuLiangSignItem.length > 0">
                    <div style="height: 45px; line-height: 45px; padding-left: 30px; margin-bottom: 20px" :key="index+'cl'">出量:
                      <div class="config-btn" v-uni="'hulijilu_edit_chuliang_add'" @click="addSignItem('chu')">
                        <i class="el-icon-circle-plus-outline"/>
                      </div>
                    </div>
                    <el-row class="signClass" v-for="(chuForm, chuFormIndex) in chuLiangForm" :key="chuFormIndex + index + 'one'">
                      <legend style="margin-left: 25px;background: RGB(255,255,255);width: 50px;margin-top: -10px;font-size: 14px;">出量{{chuFormIndex + 1}}:</legend>
                      <div
                        class="config-btn"
                        v-if="chuFormIndex > 0"
                        style="margin-top: 0px;position: absolute;right: 10px;cursor: pointer;z-index: 100;"
                        @click="delSignItem('chu', chuFormIndex)"
                        v-uni:[chuFormIndex]="'hulijilu_edit_chuliang_delete'"
                      >
                        <i class="el-icon-remove-outline"/>
                      </div>
                      <el-col v-for="(item,index) in chuLiangSignItem" :key="index" :xl="8" :lg="12" style="padding:10px 0">
                        <el-form-item
                          :label="item.signItemShowName"
                          :rules="[
                      {
                        validator: getSignRule(item.signItemFieldType,item.signItemFieldLength),
                        trigger: 'change'
                      }]"
                        >
                          <el-col :span="20">
                            <el-select
                              v-if="item.signItemFieldType==='3'||item.signItemFieldType==='4' || item.signItemFieldType==='6'||item.signItemFieldType==='7'"
                              v-model="chuLiangForm[chuFormIndex][item.signId].itemValue"
                              clearable
                              :ref="'select-'+index"
                              :id="'index'"
                              @focus="selectFocus(index)"
                              :filterable="item.signItemFieldType==='6'||item.signItemFieldType==='7'"
                              :allow-create="item.signItemFieldType==='6'||item.signItemFieldType==='7'"
                              :placeholder="(item.signItemFieldType==='6'||item.signItemFieldType==='7') ? '请选择或输入' : '请选择'"
                              v-uni:[chuFormIndex]="'hulijilu_edit_chuliang_'+item.signItemShowName"
                            >
                              <el-option
                                label=""
                                value=""
                              >
                              </el-option>
                              <el-option
                                v-for="(value,index) in item.signItemSvgSetting"
                                :key="index+'_pop'"
                                :label="value.settingItem"
                                :value="value.settingItem">
                              </el-option>
                            </el-select>
                            <el-input
                              v-else
                              clearable
                              :type="item.signItemFieldType === '2' ? 'number' : ''"
                              :min="item.signItemFieldType === '2' ? 0 : ''"
                              v-model="chuLiangForm[chuFormIndex][item.signId].itemValue"
                              placeholder="请输入"
                              v-uni:[chuFormIndex]="'hulijilu_edit_chuliang_'+item.signItemShowName"
                            >
                            </el-input>
                          </el-col>
                          <el-col :span="4">
                            <div v-if="item.signItemUnit" style="text-align: left; padding-left: 5px">
                              {{item.signItemUnit}}
                            </div>
                          </el-col>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                </template>
                <template v-else>
                  <div class="className" :key="index+'_cl'">{{items.signClassifyName}}</div>
                  <el-row :key="items.signClassifyId" class="signClass">
                    <el-col v-for="(item,index) in items.signItems" :key="item.signId" :xl="8" :lg="12" style="padding:10px 0">
                      <el-form-item
                        :prop="'extendList.'+ item.signId +'.itemValue'"
                        :label="item.signItemShowName"
                        label-width="140px"
                        :rules="[
                        {
                          validator: getSignRule(item.signItemFieldType,item.signItemFieldLength),
                          trigger: 'change'
                        }]"
                      >
                        <el-col :span="20">
                          <el-select
                            v-if="item.signItemFieldType==='3'||item.signItemFieldType==='4' || item.signItemFieldType==='6'||item.signItemFieldType==='7'"
                            v-model="ruleForm.extendList[item.signId].itemValue"
                            clearable
                            :ref="'select-'+index"
                            :id="'index'"
                            @focus="selectFocus(index)"
                            :filterable="item.signItemFieldType==='6'||item.signItemFieldType==='7'"
                            :allow-create="item.signItemFieldType==='6'||item.signItemFieldType==='7'"
                            :placeholder="(item.signItemFieldType==='6'||item.signItemFieldType==='7') ? '请选择或输入' : '请选择'"
                            v-uni:[index]="'hulijilu_edit_'+items.signClassifyName+item.signItemShowName"
                            >
                            <el-option
                              label=""
                              value=""
                            >
                            </el-option>
                            <el-option
                              v-for="(value,index) in item.signItemSvgSetting"
                              :key="index+'opo'"
                              :label="value.settingItem"
                              :value="value.settingItem">
                            </el-option>
                          </el-select>
                          <el-input
                            v-else
                            clearable
                            :type="item.signItemFieldType === '2' ? 'number' : ''"
                            :min="item.signItemFieldType === '2' ? 0 : ''"
                            v-model="ruleForm.extendList[item.signId].itemValue"
                            placeholder="请输入"
                            v-uni:[index]="'hulijilu_edit_'+items.signClassifyName+item.signItemShowName"
                          >
                          </el-input>
                        </el-col>
                        <el-col :span="4">
                          <div v-if="item.signItemUnit" style="text-align: left; padding-left: 5px">
                            {{item.signItemUnit}}
                          </div>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </template>

              <!--各护理记录单除体征项外展示的文本区域内容-->
              <div class="add-form-condition">
                <template v-for="(condition ,index) in conditionField">
                  <div style="width: 100%;" :key="index+'_wz'" v-if="condition.type===3">
                    <el-row>
                      <el-form-item
                        :prop="condition.id"
                        :label="condition.projectName"
                        class=""
                        :rules="[
                      {
                        validator: getRule(condition.type,condition.fieldLength),
                        trigger: 'change'
                      }]"
                      >
                        <el-col :span="24">
                          <el-input
                            v-model="ruleForm[condition.id]"
                            type="textarea"
                            :maxlength="condition.fieldLength"
                            show-word-limit
                            clearable
                            v-uni:[index]="'hulijilu_edit_'+condition.projectName"
                            placeholder="请输入"></el-input>
                        </el-col>
                      </el-form-item>
                    </el-row>
                  </div>
                  <div style="width: 33%;" :key="index+'div'" v-else>
                    <el-row>
                      <el-form-item
                        :prop="condition.id"
                        :label="condition.projectName"
                        class=""
                        :rules="[
                      {
                        validator: getRule(condition.type,condition.fieldLength),
                        trigger: 'change'
                      }]"
                      >
                        <el-col :span="21">
                          <el-select
                            v-if="condition.type===2"
                            v-model="ruleForm[condition.id]"
                            clearable
                            placeholder="请选择"
                            v-uni:[index]="'hulijilu_edit_'+condition.projectName"
                          >
                            <el-option
                              v-for="item in condition.item"
                              :label="item.value"
                              :value="item.value"
                              :key="item.id"
                            ></el-option>
                          </el-select>
                          <el-input
                            v-else
                            v-model="ruleForm[condition.id]"
                            :type="condition.type===1?'number':''"
                            clearable
                            v-uni:[index]="'hulijilu_edit_'+condition.projectName"
                            placeholder="请输入"></el-input>
                        </el-col>
                      </el-form-item>
                    </el-row>
                  </div>
                </template>
              </div>
            </el-form>
          </div>
          <div style="width: 300px;margin-left: 30px;" v-if="focusFlag">
            <!--除了这两个表单之外的表单新增时有护理焦点功能-->
            <div class="nurse_focus">
              <div class="title">护理焦点</div>
              <focus :data="focus_data" @node-click="showFocus" :extend="expanded_focus_ids"></focus>
            </div>
          </div>
        </div>
        <template slot>
          <!-- 选择焦点弹框 -->
          <el-dialog
            class="focus_window"
            :title="focusDialogTitle"
            :visible.sync="focusDialogVisible"
            :showClose="false"
            width="780px">
            <div>
              <el-form ref="focus_form" label-width="95px" label-suffix=":">
                <el-form-item :label="focus.name" v-for="(focus, index) in focusDetailData" :key="index+'jd'">
                  <el-checkbox-group v-model="focus_form">
                    <el-checkbox :label="item" v-for="(item,index) in focus.items" v-uni:[index]="'hulijilu_edit_xuanzejiaodian'" :key="index+'_jd'">{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button v-uni="'hulijilu_edit_xuanzejiaodian_cancel'" @click="focusDialogVisible = false">取消</el-button>
              <el-button v-uni="'hulijilu_edit_xuanzejiaodian_save'" type="primary" @click="changeFocus">确认</el-button>
            </span>
          </el-dialog>
        </template>
      </LayoutList>
    </div>
    <div slot="footer_btn">
      <el-button size="small" @click="close()" v-uni="'hulijilu_edit_cancel'">
        取消
      </el-button>
      <el-button type="primary" size="small" @click="submitForm" v-uni="'hulijilu_edit_cancel'">
        保存
      </el-button>
    </div>
  </LayoutEdit>
</template>

<script>
import moment from 'moment'
import { ApiNurseNotes } from '../../../api/nrms/index'
import LayoutEdit from '../../../components/nrms/layout/edit'
import LayoutList from '../../../components/nrms/layout/list'
import focus from './focus'
import _select from '../../../assets/nrms/mixins/_select'

export default {
  name: 'nurse_notes_add',
  components: { LayoutList, LayoutEdit, focus },
  mixins: [_select],
  props: {
    patient: {
      type: Object,
      default: function () {
        return {}
      }
    },
    note: {
      type: Object,
      default: function () {
        return {}
      }
    },
    formListObj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      time: moment().format('YYYY-MM-DD'),
      hour: moment().format('HH:mm'),
      loading: false,
      show_labelDisplayTypeValue: false,
      focusFlag: 0, // 是否引用焦点字段
      expanded_focus_ids: '', // 默认展开的护理焦点分类
      focus_data: [], // 焦点数据
      fixed_item: [], // 固定项数据
      // 焦点弹窗开关
      focusDialogTitle: '请选择焦点内容',
      focusDialogVisible: false,
      focusDetailData: {},
      focus_form: [], // 选择后的焦点数据
      nowDateTime: '',
      nowDateSs: '',
      conditionField: [],
      // 新建表单
      ruleForm: {
        deptId: '',
        formId: '',
        empName: '',
        patientId: '',
        conditionTxt: {},
        skipPage: false,
        extendList: {},
        recordDate: ''
      },
      rules: {},
      // 2020-12-25 世博医院-危重患者评估与记录单特殊处理入量和出量
      ruLiangSignItem: [],
      chuLiangSignItem: [],
      ruLiangForm: [],
      chuLiangForm: []
    }
  },
  computed: {
    form_type_text () {
      return this.note.recordId ? '编辑' : '添加'
    }
  },
  mounted: function () {
  },
  async created () {
    // 初始化
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.ruleForm.deptId = empInfo.deptId
    this.ruleForm.userName = empInfo.empId
    this.ruleForm.formId = this.formListObj.formId || ''
    this.conditionField = this.formListObj.formDictExtendDoList || []
    this.expanded_focus_ids = deptInfo.deptId
    this.init() // 初始化除了体征项的输入框conditionField
    if (this.note['recordId']) {
      this.note.recordDate = this.note.recordDate.substr(0, 16)
      this.note.extendList = this.note.extendList ? this.note.extendList : {}
      Object.assign(this.ruleForm, this.note)
      // 编辑的时候将conditionTxt的值复制给v-model绑定的condition值
      for (let i = 0; i < this.conditionField.length; i++) {
        this.$set(this.ruleForm, this.conditionField[i].id, this.ruleForm.conditionTxt[this.conditionField[i].id])
      }
      // 每次添加/修改都用id
      this.ruleForm.userName = empInfo.empId
      this.nowDateSs = this.note.recordDate.substr(-3)

      if (this.formListObj.formCode === 'H-000010-WHJ-0021' || this.formListObj.formCode === 'H-000010-WHJ-0024') {
        this.time = this.note.recordDate.substr(0, 10)
        this.hour = this.note.recordDate.substr(11, 5)
      }
    } else {
      this.nowDateTime = moment().format('YYYY-MM-DD HH:mm')
      this.nowDateSs = ':' + moment().format('ss')
      this.ruleForm.recordDate = this.nowDateTime
    }

    this.ruleForm.patientId = this.patient.patientId

    await this.getFixedItem()
    this.getFocusData()
  },
  activated () {
    Object.assign(this.ruleForm, this.note)
    this.ruleForm.patientId = this.patient.patientId
  },
  deactivated () {
    // 清空上次选择的焦点数据
    this.focus_form = []
  },
  methods: {
    init () {
      this.focusFlag = 0
      for (let i = 0; i < this.conditionField.length; i++) {
        let condition = this.conditionField[i]
        this.$set(this.ruleForm, this.conditionField[i].id, '')
        // 获取是否引用焦点字段 否0，是1
        if (condition.focus) {
          this.focusFlag = 1
        }
      }
    },
    addSignItem (type) {
      if (type === 'ru') {
        if (this.ruLiangForm.length === 10) {
          this.$message.warning('入量项目最多添加10个!')
          return false
        }
        let form = {}
        for (let i = 0; i < this.ruLiangSignItem.length; i++) {
          let d = this.ruLiangSignItem[i]
          form[d['signId']] = {
            itemValue: '',
            // 按单位处理类型，后台依次来统计小结/总结
            itemType: d.signItemUnit ? 2 : 1
          }
        }
        this.ruLiangForm.push(form)
      } else {
        if (this.chuLiangForm.length === 10) {
          this.$message.warning('出量项目最多添加10个!')
          return false
        }
        let form = {}
        for (let i = 0; i < this.chuLiangSignItem.length; i++) {
          let d = this.chuLiangSignItem[i]
          form[d['signId']] = {
            itemValue: '',
            // 按单位处理类型，后台依次来统计小结/总结
            itemType: d.signItemUnit ? 4 : 3
          }
        }
        this.chuLiangForm.push(form)
      }
    },
    delSignItem (type, index) {
      let form = null
      if (type === 'ru') {
        form = this.ruLiangForm
      } else {
        form = this.chuLiangForm
      }
      form.splice(index, 1)
    },
    // 获取患者体征
    getSigns () {
      let _time = ''
      if (this.note['recordId']) {
        if (this.formListObj.formCode === 'H-000010-WHJ-0021' || this.formListObj.formCode === 'H-000010-WHJ-0024') {
          // 后台返回的时间没有秒，读取体征得时候必须有秒，暂时拼接上，后续有逻辑优化再处理
          _time = this.note.recordDate.substr(0, 10) + ' ' + this.note.recordDate.substr(11, 5) + ':00'
        } else {
          _time = this.ruleForm.recordDate + this.nowDateSs
        }
      } else {
        if (this.formListObj.formCode === 'H-000010-WHJ-0021' || this.formListObj.formCode === 'H-000010-WHJ-0024') {
          _time = this.time + ' ' + this.hour + ':00'
        } else {
          _time = this.ruleForm.recordDate + this.nowDateSs
        }
      }

      ApiNurseNotes.syncSign({ patientId: this.ruleForm.patientId, targetDate: _time }).then(res => {
        if (res.data) {
          let signData = res.data[0].data
          for (let i = 0; i < signData.length; i++) {
            let _sItem = signData[i]
            this.ruleForm.extendList[_sItem.signId] && (this.$set(this.ruleForm.extendList, _sItem.signId, {
              itemId: _sItem.signId,
              itemValue: _sItem.signValue
            }))
          }
        } else {
          this.$message.error('无可用体征数据!')
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 设置换页
    setPaged () {
      let title = this.ruleForm.skipPage ? '确认要取消分页设置？' : '设置分页后，从该护理记录开始，将另起一页进行打印，确认要进行分页？'
      this.$confirm(title, '信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.ruleForm.skipPage = !this.ruleForm.skipPage
      })
    },
    getFocusData () {
      ApiNurseNotes.getFocusData().then(res => {
        this.focus_data = res.data
      })
    },
    async getFixedItem () {
      this.loading = true
      await ApiNurseNotes.getFixedAddItem({ formId: this.formListObj.formId }).then(res => {
        let items = res.data
        let newItems = []
        for (let i = 0; i < items.length; i++) {
          let newSignItems = []
          for (let z = 0; z < items[i].signItems.length; z++) {
            let _sItem = items[i].signItems[z]

            // 2020-12-25 世博医院-危重患者评估与记录单特殊处理入量和出量 formCode:H-000010-WHJ-0005
            if ((this.formListObj.formCode === 'H-000010-WHJ-0005' || this.formListObj.formCode === 'H-000010-WHJ-0024') &&
                (_sItem['signItemFieldName'] === 'ruliang' || _sItem['signItemFieldName'] === 'shiruliangfuqin')) {
              if (_sItem['signItemFieldName'] === 'ruliang') {
                this.parseSignItem2(this.ruLiangSignItem, _sItem)
                this.parseForm('ru')
                if (this.ruLiangForm.length === 0) this.addSignItem('ru')
              } else {
                this.parseSignItem2(this.chuLiangSignItem, _sItem)
                this.parseForm('chu')
                if (this.chuLiangForm.length === 0) this.addSignItem('chu')
              }
            } else if (_sItem['signItemFieldName'] === 'tiwen' || _sItem['signItemFieldName'] === 'tengtongdengji' || _sItem['signItemFieldName'] === 'xuetang') {
              !this.ruleForm.extendList[_sItem.signId] && (this.$set(this.ruleForm.extendList, _sItem.signId, {
                itemId: _sItem.signId,
                itemValue: ''
              }))
              newSignItems.push(_sItem)
            } else {
              if (!_sItem.childrenSignItem || _sItem.childrenSignItem.length <= 0) {
                !this.ruleForm.extendList[_sItem.signId] && (this.$set(this.ruleForm.extendList, _sItem.signId, {
                  itemId: _sItem.signId,
                  itemValue: ''
                }))
                newSignItems.push(_sItem)
              } else {
                this.parseSignItem(newSignItems, _sItem)
              }
            }
          }
          items[i].signItems = newSignItems
          newItems.push(items[i])
        }

        // 危重护理记录单（省立）  调整添加的显示顺序
        if (this.formListObj.formCode === 'H-000010-WHJ-0024') {
          let _arrNew = []
          for (let item of newItems) {
            if (item.signClassifyName === '出入量') {
              _arrNew[0] = item
            } else if (item.signClassifyName === '病危体征') {
              _arrNew[1] = item
            } else {
              _arrNew[2] = item
            }
          }
          newItems = _arrNew
        }

        if (this.formListObj.formCode === 'H-000010-WHJ-0021') {
          let _arrNew = []
          for (let item of newItems) {
            if (item.signClassifyName === '病危体征') {
              _arrNew[0] = item
            } else if (item.signClassifyName === '基础体征') {
              _arrNew[1] = item
            } else {
              _arrNew[2] = item
            }
          }
          newItems = _arrNew
        }

        this.fixed_item = newItems
        this.loading = false
      })
    },
    parseSignItem (top, items) {
      for (let i = 0; i < items.childrenSignItem.length; i++) {
        let childItem = items.childrenSignItem[i]
        childItem['signItemShowName'] = items['signItemShowName'] + '-' + childItem['signItemShowName']
        if (!childItem.childrenSignItem || childItem.childrenSignItem.length <= 0) {
          let obj = {
            itemId: childItem.signId,
            itemValue: ''
          }

          // 由于世博危重增加了出入量的多条处理，其他表单要兼容的需要增加itemType
          if (items.signItemFieldName === 'ruliang' || items.signItemFieldName === 'shiruliangfuqin') {
            if (childItem.signItemFieldName === 'xingzhuang') {
              obj['itemType'] = 5
            } else {
              if (items.signItemFieldName === 'ruliang') {
                obj['itemType'] = childItem.signItemUnit ? 2 : 1
              } else {
                obj['itemType'] = childItem.signItemUnit ? 4 : 3
              }
            }
          }
          !this.ruleForm.extendList[childItem.signId] && (this.$set(this.ruleForm.extendList, childItem.signId, obj))
          top.push(childItem)
        } else {
          this.parseSignItem(top, childItem)
        }
      }
    },
    // 2020-12-25 世博医院-危重患者评估与记录单特殊处理入量和出量
    // 出入量 修改的数据初始化上
    parseForm (type) {
      if (!this.note.recordId) return false
      let extendList = this.note.extendList
      let item = type === 'ru' ? this.ruLiangSignItem : this.chuLiangSignItem
      let form = type === 'ru' ? this.ruLiangForm : this.chuLiangForm
      let maxLen = 1
      let arr = []
      for (let i = 0; i < item.length; i++) {
        let valueArr = extendList[item[i].signId] ? (extendList[item[i].signId].itemValueArr || []) : []
        let itemType = extendList[item[i].signId] ? (extendList[item[i].signId].itemType || '') : ''
        if (valueArr.length > maxLen) {
          maxLen = valueArr.length
        }

        arr.push({
          itemId: item[i].signId,
          itemValueArr: valueArr,
          itemType: itemType
        })
      }

      for (let i = 0; i < maxLen; i++) {
        let obj = {}
        // 循环
        for (let j = 0; j < arr.length; j++) {
          let e = arr[j]
          obj[e.itemId] = {
            itemValue: e.itemValueArr[i],
            itemType: e.itemType
          }
          this.delDetailRuChu(e.itemId)
        }
        form.push(obj)
      }
    },
    // 删除detail中带有的出入量值
    delDetailRuChu (itemId) {
      let extendList = this.note.extendList
      for (let p in extendList) {
        if (p === itemId) {
          delete extendList[p]
        }
      }
    },
    // 2020-12-25 世博医院-危重患者评估与记录单特殊处理入量和出量
    parseSignItem2 (top, items) {
      for (let i = 0; i < items.childrenSignItem.length; i++) {
        let childItem = items.childrenSignItem[i]
        childItem['signItemShowName'] = items['signItemShowName'] + '-' + childItem['signItemShowName']
        if (!childItem.childrenSignItem || childItem.childrenSignItem.length <= 0) {
          top.push(childItem)
        } else {
          this.parseSignItem2(top, childItem)
        }
      }
    },
    // 焦点 树 事件
    showFocus (data) {
      if (data.children) {
        return
      }
      this.focusDialogTitle = data.label
      this.focusDialogVisible = true
      this.focusDetailData = {
        basis: {
          name: '依据（D）',
          items: data['basis'] ? [...JSON.parse(data['basis']).filter(v => {
            return v.value
          })] : []
        },
        measures: {
          name: '措施（A）',
          items: data['measures'] ? [...JSON.parse(data['measures']).filter(v => {
            return v.value
          })] : []
        },
        mission: {
          name: '宣教（T）',
          items: data['mission'] ? [...JSON.parse(data['mission']).filter(v => {
            return v.value
          })] : []
        },
        evaluate: {
          name: '评价（R）',
          items: data['evaluate'] ? [...JSON.parse(data['evaluate']).filter(v => {
            return v.value
          })] : []
        }
      }
    },
    // 选择焦点内容 确认 事件
    changeFocus () {
      // 循环遍历  找到引用焦点的配置项
      for (let i = 0; i < this.conditionField.length; i++) {
        let focus = this.conditionField[i].focus ? this.conditionField[i].focus : 0
        if (focus) {
          let content = this.ruleForm[this.conditionField[i].id] ? [this.ruleForm[this.conditionField[i].id]] : []
          this.focus_form.forEach(v => {
            content.push(v.value)
          })
          this.ruleForm[this.conditionField[i].id] = content.join('')
        }
      }
      this.focus_form = []
      this.focusDialogVisible = false
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          let _ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
          let obj = {}
          this.conditionField.forEach(v => {
            obj[v.id] = _ruleForm[v.id]
          })
          _ruleForm['conditionTxt'] = obj
          _ruleForm['recordDate'] += this.nowDateSs

          if (this.formListObj.formCode === 'H-000010-WHJ-0021' || this.formListObj.formCode === 'H-000010-WHJ-0024') {
            _ruleForm['recordDate'] = this.time + ' ' + this.hour
          }
          let _extendList = []
          let _hasVal = false
          // 体征数据整合

          Object.keys(_ruleForm.extendList).forEach(v => {
            if (_ruleForm.extendList[v].itemValue) _hasVal = true
            _extendList.push({
              itemId: _ruleForm.extendList[v].itemId,
              itemValue: _ruleForm.extendList[v].itemValue,
              itemType: _ruleForm.extendList[v].itemType
            })
          })

          // 2020-12-25 世博医院-危重患者评估与记录单特殊处理入量和出量
          // formCode H-000010-WHJ-0005
          if (this.formListObj.formCode === 'H-000010-WHJ-0005' || this.formListObj.formCode === 'H-000010-WHJ-0024') {
            // 入量
            let ruObj = {}
            for (let i = 0; i < this.ruLiangForm.length; i++) {
              for (let p in this.ruLiangForm[i]) {
                let d = this.ruLiangForm[i][p]
                if (d) _hasVal = true
                if (!ruObj[p]) {
                  ruObj[p] = {
                    itemValue: [],
                    itemType: d.itemType
                  }
                }
                ruObj[p]['itemValue'].push(d.itemValue)
              }
            }
            for (let p in ruObj) {
              _extendList.push({
                itemId: p,
                itemValue: ruObj[p]['itemValue'].join('#@#'),
                itemType: ruObj[p]['itemType']
              })
            }

            // 出量
            let chuObj = {}
            for (let i = 0; i < this.chuLiangForm.length; i++) {
              for (let p in this.chuLiangForm[i]) {
                let d = this.chuLiangForm[i][p]
                if (d) _hasVal = true
                if (!chuObj[p]) {
                  chuObj[p] = {
                    itemValue: [],
                    itemType: d.itemType
                  }
                }
                chuObj[p]['itemValue'].push(d.itemValue)
              }
            }
            for (let p in chuObj) {
              _extendList.push({
                itemId: p,
                itemValue: chuObj[p]['itemValue'].join('#@#'),
                itemType: chuObj[p]['itemType']
              })
            }
          }

          // 针对除体征项之外的condition列的判断
          for (let i = 0; i < this.conditionField.length; i++) {
            if (_ruleForm[this.conditionField[i].id] !== '') {
              _hasVal = true
              break
            }
          }
          if (!_hasVal) {
            this.loading = false
            this.$message.warning('请填写患者护理记录信息！')
            return false
          }

          _ruleForm.extendList = _extendList
          // 危重护理记录单添加数据全部为空的判断
          let _flag = false
          for (let item of _ruleForm.extendList) {
            if (item.itemValue !== '') {
              _flag = true
            }
          }

          if (!_flag) {
            for (let key in _ruleForm.conditionTxt) {
              if (_ruleForm.conditionTxt[key] !== '') {
                _flag = true
              }
            }
          }

          if (!_flag) {
            this.$message.warning('请填写患者护理记录信息！')
            this.loading = false
            return false
          }

          ApiNurseNotes.save(_ruleForm)
            .then(() => {
              this.$message.success('保存正确！')
              this.loading = false
              this.close()
            })
            .catch(res => {
              this.loading = false
              this.$message.error(res.message)
            })
        } else {
          return false
        }
      })
    },
    // 返回
    close () {
      this.$emit('option-changed', 'tabs')
    },
    getRule (type, length) {
      // 下拉选择不做验证
      if (type === 2) return
      return (rule, value, callback) => {
        if (value && value.length > length) {
          callback(new Error('长度在 1 到 ' + length + ' 个字符！'))
        } else {
          callback()
        }
      }
    },
    getSignRule (type, length) {
      // 体征下拉选择不做验证
      if (type === 4) return
      return (rule, value, callback) => {
        if (value && value.length > length) {
          callback(new Error('长度在 1 到 ' + length + ' 个字符！'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .add-from {
    padding: 0px;
    /deep/ .el-main {
      overflow: auto;
    }
    .signClass {
      border: 1px solid #EEF0F6;
      border-radius: 2px;
      margin-bottom: 30px;

      /deep/ .el-form-item {
        margin-bottom: 0 !important;

        .el-form-item__label {
          height: auto;
        }
      }
    }

    /deep/ .el-form-item__content div.el-input,
    /deep/ .el-form-item__content div.el-select,
    /deep/ .el-form-item__content div.el-textarea,
    /deep/ .el-form-item__content div.vue-treeselect {
      width: 100%;
    }
  }

  .add-form /deep/ .el-form .el-select, .el-form .el-input {
    width: auto;
    display: block;
  }

  .newLabelStyle {
    /deep/ .el-form-item__label {
      width: 180px !important;
    }

    /deep/ .el-form-item__content {
      margin-left: 180px !important;
    }
  }

  .focus_window /deep/ .el-checkbox {
    display: flex;
    margin-top: 6px;
    margin-bottom: 10px;
    white-space: normal;
  }

  .focus_window /deep/ .el-checkbox__input {
    padding-top: 3px;
  }

  .focus_window /deep/ .el-form-item__label {
    float: none;
    display: block;
    font-weight: bold;
  }

  .focus_window /deep/ .el-form-item__content {
    margin-left: 60px !important;
  }

  .nurse_focus {
    width: auto;
    max-height: 500px;
    overflow-y: auto;
    white-space: nowrap;
    border: 1px solid rgb(228, 231, 237);
    padding-bottom: 20px;

    .title {
      padding: 20px 0 0px 24px;
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }

  .nurse_focus /deep/ .el-tree {
    padding: 0 20px 20px;
  }

  .nurse_focus /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 4px;
    color: #333;
    font-size: 16px;
  }

  .nurse_focus /deep/ .el-tree-node__content {
    overflow: hidden;
  }

  .nurse_focus /deep/ .el-tree-node__label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .className {
    padding:0 10px 10px 10px;
    color: #333;
    font-size: 14px;
  }

  .add-form-condition {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
  }

  .config-btn {
    // float: right;
    // margin-right: 30px;
    width: 25px;
    cursor: pointer;
    font-size: 25px;
    color: #409eff;
    margin-left: 45px;
    margin-top: -45px;

    i {
      vertical-align: baseline;

      &.el-icon-remove-outline {
        color: #f56c6c;
      }
    }
  }

</style>
