<template>
  <layout>
    <div slot="title">{{ form_type_text }}体征项</div>
    <div slot="main" class="add-from">
      <el-form
        :model="sign_form"
        :rules="rules"
        ref="sign_form"
        label-width="120px"
        class="form-main"
      >
        <el-row>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="所属分类:" prop="signClassifyId">
              <el-select
                v-uni="'tizhengxiang_add_edit_suoshufenlei'"
                v-model="sign_form.signClassifyId"
                placeholder="请选择"
                autocomplete="off"
                clearable
                :disabled="btn_disable"
                @change="getParentRelationItem(sign_form.signClassifyId)"
              >
                <el-option
                  v-for="(item, key) in classify"
                  :label="item.signClassifyName"
                  :value="item.signClassifyId"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="体征项名称:" prop="signItemName">
              <el-input
                v-uni="'tizhengxiang_add_edit_tizhengxiangmingcheng'"
                v-model="sign_form.signItemName"
                placeholder="请输入"
                clearable
                :disabled="btn_disable"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="显示名称:" prop="signItemShowName">
              <el-input
                v-uni="'tizhengxiang_add_edit_xianshimingcheng'"
                v-model="sign_form.signItemShowName"
                placeholder="请输入"
                clearable
                :disabled="btn_disable"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="单位:" prop="signItemUnit">
              <el-input
                v-uni="'tizhengxiang_add_edit_danwei'"
                v-model="sign_form.signItemUnit"
                placeholder="请输入"
                clearable
                :disabled="btn_disable"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="上级关联项:" prop="parentId">
              <el-select
                v-uni="'tizhengxiang_add_edit_shangjiguanlianxiang'"
                v-model="sign_form.parentId"
                placeholder="请选择"
                autocomplete="off"
                filterable
                clearable
                :disabled="btn_disable || sign_form.signClassifyId == ''"
              >
                <el-option
                  v-for="(item,key) in parent_relation_sign"
                  :label="item.signItemName"
                  :value="item.signId"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="字段名称:" prop="signItemFieldName">
              <el-input
                v-uni="'tizhengxiang_add_edit_ziduanmingcheng'"
                v-model="sign_form.signItemFieldName"
                placeholder="请输入"
                clearable
                :disabled="btn_disable"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="字段长度:" prop="signItemFieldLength">
              <el-input
                v-uni="'tizhengxiang_add_edit_ziduanchangdu'"
                v-model.number="sign_form.signItemFieldLength"
                placeholder="请输入"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="字段类型:" prop="signItemFieldType">
              <el-select
                v-uni="'tizhengxiang_add_edit_ziduanleixing'"
                v-model="sign_form.signItemFieldType"
                placeholder="请选择"
                autocomplete="off"
                clearable
                @change="signItemFieldTypeChange"
                :disabled="disabled"
              >
                <el-option
                  v-for="(value, key) in sign_config.sign_item_field_type"
                  :label="value"
                  :value="key"
                  :key="key"
                ></el-option>
              </el-select>
              <i v-uni="'tizhengxiang_add_edit_ziduanleixing_add'" @click.prevent="addItem()" class="el-icon-circle-plus-outline iconAddCls"
                 v-if="showSignSetting==='2'"></i>
            </el-form-item>
          </el-col>
          <el-col :xl="16" :lg="16" :md="16" v-if="showSignSetting==='1'">
            <el-form-item label="绘制符号:">
              <el-row :gutter="20">
                <el-col :span="10" style="padding-left: 0;padding-right: 0;">
                  <el-input v-uni="'tizhengxiang_add_edit_huizhifuhao'" v-model="sign_form.signItemSvgSetting[0].svgSymbol" readonly
                            class="input_readonly"></el-input>
                  <el-button v-uni="'tizhengxiang_add_edit_huizhifuhao_choose'" style="padding: 6px 25px;border-radius:2px !important;margin-left: 11px;" type="primary"
                             @click="openSvgDialog(0)">选择
                  </el-button>
                </el-col>
                <el-col :span="5" style="padding-left: 0;">
                  <el-form-item label="颜色:" prop="signItemSvgSetting[0].color" class="svgSettingStyle">
                    <div class="flexCss">
                    <el-color-picker
                      v-uni="'tizhengxiang_add_edit_huizhifuhao_yanse'"
                      v-model="sign_form.signItemSvgSetting[0].color"
                      :predefine="predefineColors">
                    </el-color-picker>
                    <div class="svgCss">
                       <SignSvg :signType="sign_form.signItemSvgSetting[0].svgSymbol"
                                :color="sign_form.signItemSvgSetting[0].color"
                                v-if="sign_form.signItemSvgSetting[0].svgSymbol"/>
                    </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(item,index) in sign_form.signItemSvgSetting"
                :key="index"
                v-if="showSignSetting==='2'">
          <el-col :xl="8" :lg="8" :md="12"
          >
            <el-form-item :label="'配置项'+(index+1)+':'" :prop="'signItemSvgSetting.'+index+'.settingItem'">
              <el-input
                v-uni:[index]="'tizhengxiang_add_edit_peizhixiang'"
                v-model="item.settingItem"
                placeholder="请输入"
                autocomplete="off"
                :disabled="disabled"
                v-if="!item.isEditOption"
              >
              </el-input>
              <el-input
                v-uni:[index]="'tizhengxiang_add_edit_peizhixiang'"
                v-model="item.settingItem"
                placeholder="请输入"
                autocomplete="off"
                v-else
              ></el-input>
              <i @click.prevent="removeItem(item)" class="el-icon-remove-outline iconDelCls"></i>
            </el-form-item>
          </el-col>
          <el-col :xl="16" :lg="16" :md="12">
            <el-form-item label="绘制符号:">
              <el-row :gutter="20">
                <el-col :span="10" style="padding-left: 0;padding-right: 0;">
                  <el-input v-uni="'tizhengxiang_add_edit_huizhifuhao'" v-model="item.svgSymbol" readonly
                            class="input_readonly"></el-input>
                  <el-button v-uni="'tizhengxiang_add_edit_huizhifuhao_choose'" style="padding: 6px 25px;border-radius:2px !important;margin-left: 11px;" type="primary"
                             @click="openSvgDialog(index)">选择
                  </el-button>
                </el-col>
                <el-col :span="5" style="padding-left: 0;">
                  <el-form-item label="颜色:" :prop="'signItemSvgSetting.'+index+'.color'" class="svgSettingStyle">
                    <div class="flexCss">
                      <div>
                        <el-color-picker
                          v-uni="'tizhengxiang_add_edit_huizhifuhao_yanse'"
                          v-model="item.color"
                          :predefine="predefineColors">
                        </el-color-picker>
                      </div>
                      <div class="svgCss">
                        <SignSvg :signType="item.svgSymbol" :color="item.color" v-if="item.svgSymbol"/>
                      </div>
                    </div>
                  </el-form-item>

                </el-col>
                <!--<el-col :span="3">-->
                 <!---->
                <!--</el-col>-->
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="是否为出入项:" prop="signInOutType">
              <el-radio-group
                v-uni="'tizhengxiang_add_edit_shifouweichuruxiang'"
                v-model="sign_form.signInOutType"
                @change="signInOutTypeChange"
              >
                <el-radio
                  v-for="(value, key) in sign_config.inout_item"
                  :label="+key"
                  :key="key"
                >{{ value }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="是否为汇总项:" prop="signSummaryType">
              <el-radio-group
                v-uni="'tizhengxiang_add_edit_shifouweihuizongxiang'"
                v-model="sign_form.signSummaryType"
                @change="signSummaryTypeChange"
              >
                <el-radio
                  :disabled="sign_form.signInOutType === 0 ? false : true "
                  v-for="(value, key) in sign_config.gather_item"
                  :label="+key"
                  :key="key"
                >{{ value }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12">
            <el-form-item label="关联体征: " prop="relationSignJson">
              <el-select
                v-uni="'tizhengxiang_add_edit_guanliantizheng'"
                v-model="sign_form.relationSignJson"
                multiple
                clearable
                placeholder="请选择"
                :disabled="(sign_form.signInOutType === 0 &&( sign_form.signSummaryType ===1 ||sign_form.signSummaryType ===2) ) ? false : true "
              >
                <el-option
                  v-for="item in relation_sign"
                  :label="item.signItemName"
                  :value="item.signId"
                  :key="item.signId"
                  v-if="rowData && (rowData.signId!==item.signId)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注:" prop="remark">
              <el-input v-uni="'tizhengxiang_add_edit_remark'" clearable type="textarea" v-model="sign_form.remark" placeholder="请输入" maxlength="32"
                        show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer_btn" class="saveAndCancelBtn">
      <el-button v-uni="'tizhengxiang_add_edit_cancle'" size="small" @click="close()"
      >取消
      </el-button
      >
      <el-button v-uni="'tizhengxiang_add_edit_save'" type="primary" size="small" @click="submitForm"
      >保存
      </el-button
      >
    </div>
    <template>
      <!--绘制符号对话框-->
      <el-dialog
        title="选择绘制符号"
        :visible.sync="svgDialogVisible"
        width="490px"
        custom-class="signDialogCss"
        :show-close="false"
      >
        <div class="alert_content">
          <ul>
            <li v-for="(item,index) in sign_config.sign_item_svg_type"
                :key="index"
                :class="{activeBackGround:item.name===checkedSvgItem,activeBorder:item.name===checkedSvgItemHover}"
                @click="svgChange(item)" @mouseenter="enter(item.name)">
              <SignSvg :signType="item.name" :color="selected===item.id?'#ffffff':'#333'" :key="index"/>
            </li>
          </ul>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'tizhengxiang_add_edit_dialog_cancle'" @click="svgDialogVisible = false">取消</el-button>
          <el-button v-uni="'tizhengxiang_add_edit_dialog_confirm'" type="primary" @click="choseSvgImage">确认</el-button>
        </span>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import { ApiSignItem, ApiSignClassify } from '../../../api/nrms/index'
import { sign as sign_config } from '../../../assets/nrms/common/item_config'
import layout from '../../../components/nrms/layout/edit'
import SignSvg from '@/components/nrms/SignSvg'

export default {
  name: 'sign_item_add',
  props: ['rowData'],
  components: { layout, SignSvg },
  data () {
    var validateFieldLength = (rule, value, callback) => {
      if (value <= 0 || value > 32) {
        callback(new Error('只能输入 1 到 32 之间的数字！'))
      } else {
        callback()
      }
    }
    return {
      predefineColors: [
        '#000000',
        '#FF0000',
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ],
      classify: [],
      sign_config,
      loading: false,
      svgDialogVisible: false, // svg图片弹框
      checkedSvgItem: '',
      checkedSvgItemIndex: '',
      checkedSvgItemHover: '',
      form_type_text: '',
      parent_relation_sign: [], // 上级关联项
      relation_sign: [], // 关联体征
      showSignSetting: '0', // 配置项是否显示  0:都不显示 1:显示配置项+绘制符号   2:显示只有绘制符号
      contentNum: {
        signItemSvgSettingNum: 1
      },
      sign_form: {
        signClassifyId: '',
        signItemName: '',
        signItemShowName: '',
        signItemUnit: '',
        signStorageType: 0,
        parentId: '',
        signItemFieldName: '',
        signItemFieldLength: '',
        signItemFieldType: '',
        signItemSvgSetting: [
          {
            settingItem: '', // 配置项
            svgSymbol: '', // 绘制符号
            color: '#333',
            isEditOption: true
          }
        ],
        signInOutType: 0,
        signSummaryType: 0,
        relationSignJson: [],
        // dropdownConfig: [],//此字段前端暂时用不到，前端写死字段类型下拉内容
        remark: '',
        defaultInFromShow: {},
        defaultInFromSetting: {}
      },
      rules: {
        signClassifyId: [
          { required: true, message: '请选择所属分类！', trigger: 'blur' }
        ],
        signItemName: [
          { required: true, message: '请输入体征项名称！', trigger: 'blur' },
          {
            min: 1,
            max: 32,
            message: '长度在 1 到 32 个字符！',
            trigger: 'blur'
          }
        ],
        signItemShowName: [
          { required: true, message: '请输入显示名称！', trigger: 'blur' },
          {
            min: 1,
            max: 32,
            message: '长度在 1 到 32 个字符！',
            trigger: 'blur'
          }
        ],
        signItemFieldName: [
          { required: true, message: '请输入正确的字段名称！', trigger: 'blur' },
          {
            min: 1,
            max: 32,
            message: '长度在 1 到 32 个字符！',
            trigger: 'blur'
          }
        ],
        signItemFieldLength: [
          { required: true, message: '请输入字段长度！', trigger: 'blur' },
          { type: 'number', message: '字段长度必须为数字', trigger: 'blur' },
          { validator: validateFieldLength, trigger: 'blur' }
        //   // {
        //   //   min: 0,
        //   //   max: 33,
        //   //   message: '字段长度在 1 到 32 之间！',
        //   //   trigger: 'blur'
        //   // }
        ],
        signItemFieldType: [
          { required: true, message: '请选择字段类型！', trigger: 'blur' }
        ],
        signInOutType: [
          { required: true, message: '请选择是否为出入项！', trigger: 'blur' }
        ],
        signSummaryType: [
          { required: true, message: '请选择是否为汇总项！', trigger: 'blur' }
        ],
        signItemUnit: [
          // { required: true, message: "请输入单位！", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符！',
            trigger: 'blur'
          }
        ],
        // signStorageType: [
        //   { required: true, message: "请选择存储方式！", trigger: "blur" }
        // ],
        remark: [
          {
            min: 1,
            max: 32,
            message: '长度在 1 到 32 个字符！',
            trigger: 'blur'
          }
        ]
      },
      selected: -1
    }
  },
  computed: {
    btn_disable: function () {
      // 编辑的时候不许改该
      if (this.rowData.signId) {
        return true
      } else {
        return false
      }
    },
    disabled: function () {
      // 需要绘制图的体征项 字段类型不可编辑 体温以及子集、血压以及子集、脉搏、呼吸、疼痛
      if (this.rowData && (this.rowData.signItemFieldName === 'tiwen' || this.rowData.signItemFieldName === 'tiwenceliangfangshi' || this.rowData.signItemFieldName === 'fucetiwen' || this.rowData.signItemFieldName === 'tengtongdengji' || this.rowData.signItemFieldName === 'maibo' ||
          this.rowData.signItemFieldName === 'huxi' || this.rowData.signItemFieldName === 'xueya' || this.rowData.signItemFieldName === 'shousuoya' || this.rowData.signItemFieldName === 'shuzhangya' || this.rowData.signItemFieldName === 'xuetang')) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    let params = this.rowData
    console.log('this.params---', params)
    this.form_type_text = params && params['signId'] ? '编辑' : '添加'

    Object.assign(this.sign_form, params)
    // 防止初始化数据中带有关联体温，但是如果都过滤掉体温的话 编辑的时候无法反显父级关联项 体温字段
    this.getParentRelationItemAll(params['signClassifyId'])
    if (params['signSummaryType'] && params['signSummaryType'] !== 0) {
      this.getRelationItem(params['signSummaryType'])
    }

    // console.log('this.sign_form---', this.sign_form);
    // 防止后台传过来数据signItemSvgSetting为null 导致signItemSvgSetting[0]使用报错
    if (!this.sign_form.signItemSvgSetting) { // 此字段要求后台初始化的时候必须是数组
      this.sign_form.signItemSvgSetting = [
        {
          settingItem: '', // 配置项
          svgSymbol: '', // 绘制符号
          color: '#333',
          isEditOption: true// 从页面手动增加的【配置项】 此标识为true  要想配置项不能编辑 需修改数据库此字段为false或者初始化的时候将此字段设置为false，目前体温、体温测量方式、疼痛等级配置项不嫩编辑
        }
      ]
    }
    let sign_type = params ? params['signItemFieldType'] : ''
    this.signItemFieldTypeShow(sign_type)// 根据字段类型来控制配置项的显示
    this.getSignClassifyData()
  },
  methods: {
    // 获取体征项分类
    getSignClassifyData () {
      ApiSignClassify.select().then(res => {
        this.classify = res.data || []
      })
    },
    // 获取上级关联项 编辑时不过滤体温等字段
    getParentRelationItemAll (val) {
      this.parent_relation_sign = []
      ApiSignItem.select({ signClassifyId: val })
        .then(res => {
          let list = res.data || []
          for (let i = 0; i < list.length; i++) {
            let parentSignItem = {}
            parentSignItem['signId'] = list[i]['signId'] || ''
            parentSignItem['parentId'] = list[i]['parentId'] || ''
            parentSignItem['signItemName'] = list[i]['signItemName']
            this.parent_relation_sign.push(parentSignItem)
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 获取上级关联项 新增时过滤体温等字段
    getParentRelationItem (val) {
      this.parent_relation_sign = []
      ApiSignItem.select({ signClassifyId: val, filterRelationSignJsonFlag: 1 })
        .then(res => {
          let list = res.data || []
          for (let i = 0; i < list.length; i++) {
            let parentSignItem = {}
            parentSignItem['signId'] = list[i]['signId'] || ''
            parentSignItem['parentId'] = list[i]['parentId'] || ''
            parentSignItem['signItemName'] = list[i]['signItemName']
            this.parent_relation_sign.push(parentSignItem)
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 获取关联体征
    getRelationItem (type) {
      this.relation_sign = []
      ApiSignItem.select({ signInOutType: type })
        .then(res => {
          console.log(res)
          let list = res.data || []
          for (let i = 0; i < list.length; i++) {
            let signItem = {}
            signItem['signId'] = list[i]['signId']
            signItem['signItemName'] = list[i]['signItemName']
            signItem['signItemShowName'] = list[i]['signItemShowName']
            this.relation_sign.push(signItem)
          }
          // 在关联体征v-mode的时候过滤已经删除掉的入项/出项体征项
          // console.log(this.sign_form.relationSignJson)

          let arr = []
          for (let j = 0; j < this.relation_sign.length; j++) {
            let jItem = this.relation_sign[j]['signId']
            if (this.sign_form.relationSignJson && this.sign_form.relationSignJson.includes(jItem)) {
              arr.push(jItem)
            }
          }
          this.sign_form.relationSignJson = arr
          // console.log(this.sign_form.relationSignJson)
          console.log('relation_sign', this.relation_sign)
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    submitForm () {
      this.$refs.sign_form.validate(valid => {
        console.log(valid, 1111111)
        if (valid) {
          this.sign_form.relationSignJson = JSON.parse(JSON.stringify(this.sign_form.relationSignJson))
          // 新建的也就是非初始化的存储方式只能是按天
          if (this.form_type_text === '添加') {
            this.sign_form.signStorageType = 0
          }

          ApiSignItem.save(this.sign_form)
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
    // 添加多个
    addItem () {
      if (this.contentNum.signItemSvgSettingNum < 10) {
        this.sign_form.signItemSvgSetting.push({
          settingItem: '', // 配置项
          svgSymbol: '', // 绘制符号
          color: '#333',
          isEditOption: true
        })
        this.contentNum.signItemSvgSettingNum++
      } else {
        this.$message.success('配置项最多添加10个！')
      }
    },
    // 删除多个
    removeItem (item) {
      let index
      index = this.sign_form.signItemSvgSetting.indexOf(item)
      if (index !== -1) {
        this.sign_form.signItemSvgSetting.splice(index, 1)
      }
      this.contentNum.signItemSvgSettingNum--
    },
    signItemFieldTypeShow (val) {
      if (val === '1' || val === '2') {
        this.showSignSetting = '1'
      } else if (val === '3' || val === '4' || val === '6' || val === '7') {
        this.showSignSetting = '2'
      } else {
        this.showSignSetting = '0'
      }
    },
    enter (item) {
      this.checkedSvgItemHover = item
    },
    svgChange (item) {
      this.checkedSvgItem = item.name
      this.selected = item.id
    },
    openSvgDialog (index) {
      this.checkedSvgItemIndex = index// 点击的选择的索引
      this.svgDialogVisible = true
    },
    choseSvgImage () {
      let index = this.checkedSvgItemIndex
      this.sign_form.signItemSvgSetting[index].svgSymbol = this.checkedSvgItem
      this.svgDialogVisible = false
    },
    // 字段类型下拉框值改变时事件
    signItemFieldTypeChange (val) {
      this.signItemFieldTypeShow(val)
      this.sign_form.signItemSvgSetting = [
        {
          settingItem: '', // 配置项
          svgSymbol: '', // 绘制符号
          color: '#333',
          isEditOption: true
        }
      ]
    },
    // 是否为出入项改变时事件
    signInOutTypeChange (val) {
      if (val !== 0) {
        this.sign_form.signSummaryType = 0
        this.relation_sign = []
        this.sign_form.relationSignJson = []
      }
    },
    // 是否为汇总项改变时事件
    signSummaryTypeChange (val) {
      console.log(val)
      if (val && val !== 0) {
        this.sign_form.relationSignJson = []
        this.getRelationItem(val)
      } else {
        this.relation_sign = []
        this.sign_form.relationSignJson = []
      }
    },
    // 关闭
    close () {
      this.$emit('option-changed', 'list')
    }
  },
  watch: {}
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .svgSettingStyle {
    margin-bottom: 0 !important;
    height: 33px;
.flexCss{
  display: flex;
  .svgCss{
    padding-top: 5px;
    padding-left: 20px;
  }
}
    /deep/ .el-form-item__label {
      width: auto !important;
    }

    /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }
  }

  .input_readonly {
    width: 300px !important;

    /deep/ .el-input__inner {
      background-color: #EEEEEE;
    }
  }

  .iconAddCls {
    font-size: 24px;
    color: #409EFF;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
  }

  .iconDelCls {
    font-size: 24px;
    color: #F56C6C;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
  }
/deep/.el-textarea__inner{
  min-height: 60px !important;
}
  /deep/.el-button--mini, .el-button--small{
    font-size: 14px;
  }

</style>
<style lang="scss" type="text/scss">
  .signDialogCss {
    .el-dialog__header{
      border-bottom: 1px solid #E7E7E7;
    }
    .el-dialog__body{
      padding-top: 13px;

    .alert_content {
      width: auto;
      height: 160px;
      overflow: auto;

      ul {
        list-style-type: none;

        li {
          width: 28px;
          height: 28px;
          float: left;
          border: 1px solid #999;
          margin-top: 24px;
          margin-right: 17px;
          text-align: center;
          line-height: 38px;

          div {
            padding: 5px 5px 2px;
          }
        }
      }
    }
    }
    .activeBackGround {
      background-color: #1E87F0;
      border-color: #1E87F0;

    }

    .activeBorder {
      border-color: #1E87F0 !important;
    }
  }
  /*.footer-btn{*/
    /*padding-top: 30px !important;*/
  /*}*/
</style>
