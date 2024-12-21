<template>
  <layout v-loading="loading">
    <div slot="title">
      {{form_type_text}}显示标识
    </div>
    <div slot="main" class="add-from form-main-center">
      <el-form v-uni="'hulibiaoqianbiaoshimingchengxiangqing'" :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="120px"
               label-suffix=":">
        <el-form-item label="标识名称" prop="identifyName">
          <el-input v-model="ruleForm.identifyName" placeholder="请输入" />
        </el-form-item>
        <div style="padding: 5px">PDA/床位一览/床旁医护端标识</div>
        <div class="borderStyle">
          <el-form-item label="标识内容" prop="bedListIdentifyType">
            <el-radio-group v-model="ruleForm.bedListIdentifyType" @change="onChangeBedListIdentifyType">
              <template v-for="(value, key) in item_config.labelShowType">
                <el-radio v-if="key !== '1'" :label="+key" :key="key">{{ value }}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <!-- 简称 -->
          <el-form-item v-if="ruleForm.bedListIdentifyType == 2" style="margin: 0">
            <el-col :span="5">
              <el-form-item prop="listIdentificationValueA">
                <el-input style="width: 100%" v-model="ruleForm.listIdentificationValueA" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="1" :offset="1">
              <el-form-item prop="listIdentificationValueB">
                <el-color-picker v-model="ruleForm.listIdentificationValueB" :predefine="predefineColors" />
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item style="margin: 0" v-if="ruleForm.bedListIdentifyType == 2">
            <span style="color:#999999; font-size: 12px">汉字/大写字母显示第一个，小写字母/数字显示第一二个</span>
          </el-form-item>
          <!-- 符号 -->
          <el-form-item v-if="ruleForm.bedListIdentifyType == 3">
            <el-col :span="5">
              <el-form-item prop="listIdentificationValueA">
                <el-select v-uni="'listIdentificationValueA'" style="width: 100%" v-model="ruleForm.listIdentificationValueA" placeholder="请选择" clearable>
                  <el-option v-for="(value, key) in item_config.shape" :key="key" :label="value" :value="key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" :offset="1">
              <el-form-item prop="listIdentificationValueB">
                <el-color-picker v-model="ruleForm.listIdentificationValueB" :predefine="predefineColors" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <!-- 图片 -->
          <el-form-item v-if="ruleForm.bedListIdentifyType == 4">
            <el-col :span="12">
              <el-form-item>
                <el-input style="width: 100%" disabled v-model="ruleForm.listIdentificationImageName" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="4" class="choseStyle">
              <el-button v-uni="'hulibiaoqianbiaoshimingchengxuanzetupian'" size="mini" type="primary" @click="showImageDepository('list')">选择</el-button>
            </el-col>
            <el-col :span="4">
              <div style="width: 22px; height: 50px;">
                <el-tooltip class="item"
                            effect="dark"
                            :content="getTipName(ruleForm.listIdentificationImage)"
                            placement="right">
                  <img :src="ruleForm.listIdentificationImage" class="logoImg">
                </el-tooltip>
              </div>
            </el-col>
          </el-form-item>
        </div>
        <div style="padding: 5px">床头卡标识</div>
        <div class="borderStyle">
          <el-form-item label="标识内容" prop="bedCardIdentifyType">
            <el-radio-group v-model="ruleForm.bedCardIdentifyType" @change="onChangeBedCardIdentifyType">
              <el-radio v-for="(value, key) in item_config.labelShowType" :label="+key" :key="key">{{ value }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 名称 -->
          <template v-if="ruleForm.bedCardIdentifyType == 1">
            <el-form-item prop="cardIdentificationValueB" label="字体颜色">
              <el-color-picker v-model="ruleForm.cardIdentificationValueB" :predefine="predefineColors" />
            </el-form-item>
            <el-form-item prop="cardIdentificationValueC" label="背景颜色">
              <el-color-picker v-model="ruleForm.cardIdentificationValueC" :predefine="predefineColors">
              </el-color-picker>
            </el-form-item>
          </template>
          <!-- 简称 -->
          <el-form-item v-if="ruleForm.bedCardIdentifyType == 2">
            <el-col :span="5">
              <el-form-item prop="cardIdentificationValueA">
                <el-input style="width: 100%" v-model="ruleForm.cardIdentificationValueA" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="1" :offset="1">
              <el-form-item prop="cardIdentificationValueB">
                <el-color-picker v-model="ruleForm.cardIdentificationValueB" :predefine="predefineColors" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <!-- 符号 -->
          <el-form-item v-if="ruleForm.bedCardIdentifyType == 3">
            <el-col :span="5">
              <el-form-item prop="cardIdentificationValueA">
                <el-select style="width: 100%" v-model="ruleForm.cardIdentificationValueA" placeholder="请选择" clearable>
                  <el-option v-for="(value, key) in item_config.shape" :key="key" :label="value" :value="key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" :offset="1">
              <el-form-item prop="cardIdentificationValueB">
                <el-color-picker v-model="ruleForm.cardIdentificationValueB" :predefine="predefineColors" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <!-- 图片 -->
          <el-form-item v-if="ruleForm.bedCardIdentifyType == 4">
            <el-col :span="12">
              <el-form-item>
                <el-input style="width: 100%" disabled v-model="ruleForm.cardIdentificationImageName" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="4" class="choseStyle">
              <el-button v-uni="'hlbqbsmcxzctktp_upload'" size="mini" type="primary" @click="showImageDepository('card')">选择</el-button>
            </el-col>
            <el-col :span="4">
              <div style="width: 75px; height: 57px;">
                <el-tooltip class="item" effect="dark" :content="getTipName(ruleForm.cardIdentificationImage)" placement="right">
                  <img :src="ruleForm.cardIdentificationImage" class="logoImg">
                </el-tooltip>
              </div>
            </el-col>
          </el-form-item>
        </div>
        <div style="padding: 5px">床旁患者端标识</div>
        <div style="margin-bottom: 10px;" class="borderStyle">
          <el-form-item label="标识内容" prop="padPatientIdentifyType">
            <el-radio-group v-model="ruleForm.padPatientIdentifyType" @change="onChangePadCardIdentifyType">
              <template v-for="(value, key) in item_config.labelShowType">
                <el-radio v-if="key === '1' || key === '4'" :label="+key" :key="key">{{ value }}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <!-- 名称 -->
          <template v-if="ruleForm.padPatientIdentifyType == 1">
            <el-form-item prop="padPatientIdentificationValueB" label="字体颜色">
              <el-color-picker v-model="ruleForm.padPatientIdentificationValueB" :predefine="predefineColors" />
            </el-form-item>
            <el-form-item prop="padPatientIdentificationValueC" label="背景颜色">
              <el-color-picker v-model="ruleForm.padPatientIdentificationValueC" :predefine="predefineColors" />
            </el-form-item>
          </template>
          <!-- 简称 -->
          <el-form-item v-if="ruleForm.padPatientIdentifyType == 2">
            <el-col :span="5">
              <el-form-item prop="padPatientIdentificationValueA">
                <el-input style="width: 100%" v-model="ruleForm.padPatientIdentificationValueA" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="1" :offset="1">
              <el-form-item prop="padPatientIdentificationValueB">
                <el-color-picker v-model="ruleForm.padPatientIdentificationValueB" :predefine="predefineColors" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <!-- 符号 -->
          <el-form-item v-if="ruleForm.padPatientIdentifyType == 3">
            <el-col :span="5">
              <el-form-item prop="padPatientIdentificationValueA">
                <el-select style="width: 100%" v-model="ruleForm.padPatientIdentificationValueA" placeholder="请选择" clearable>
                  <el-option v-for="(value, key) in item_config.shape" :key="key" :label="value" :value="key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" :offset="1">
              <el-form-item prop="padPatientIdentificationValueB">
                <el-color-picker v-model="ruleForm.padPatientIdentificationValueB" :predefine="predefineColors" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <!-- 图片 -->
          <el-form-item v-if="ruleForm.padPatientIdentifyType == 4">
            <el-col :span="12">
              <el-form-item>
                <el-input style="width: 100%" disabled v-model="ruleForm.padPatientIdentificationImageName" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="4" class="choseStyle">
              <el-button v-uni="'hlbqbsmcxzcpktp_upload'" type="primary" size="mini" @click="showImageDepository('padPatient')">选择</el-button>
            </el-col>
            <el-col :span="4">
              <div style="width: 75px; height: 57px;">
                <el-tooltip class="item"
                            effect="dark"
                            :content="getTipName(ruleForm.padPatientIdentificationImage)"
                            placement="right">
                  <img :src="ruleForm.padPatientIdentificationImage" class="logoImg">
                </el-tooltip>
              </div>
            </el-col>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button v-uni="'hulibiaoqian_xianshibiaoshi_cancel'" @click="close">返回</el-button>
      <el-button v-uni="'hulibiaoqian_xianshibiaoshi_save'" type="primary" @click="submitForm">保存</el-button>
    </div>
    <template slot>
      <!--图片库-->
      <el-dialog title="图片库" :visible="image_depository_visible" :close-on-click-modal="false" :show-close="false" width="600px">
        <div class="img-depository">
          <div v-for="(path, index) in img" :key="index" class="img-item">
            <input type="radio" :id="'img_radio' + index" :value="path" name="imgDepository" v-model="img_depository_path">
            <label :for="'img_radio' + index">
              <el-tooltip class="item"
                          effect="dark"
                          :content="getTipName(path)"
                          placement="bottom">
                <img :src="path" :key="index" :class="image_depository_type">
              </el-tooltip>
            </label>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button v-uni="'hlbqtpk_cancel'" @click="image_depository_visible = false">取消</el-button>
          <el-button v-uni="'hlbqtpk_save'" type="primary" @click="handlerImageChange">确认</el-button>
        </div>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import { ApiNursingIdentifyManage } from '../../../../api/bnms'
import item_config from '../../../../assets/bnms/common/item_config'
import layout from '../../../../components/bnms/layout/edit'

export default {
  name: 'identify_edit',
  props: ['detail'],
  data () {
    return {
      item_config,
      loading: false,
      image_depository_visible: false,
      form_type_text: '',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#FC0303'
      ],
      // 图库路径
      img: [],
      image_depository_type: '',
      img_depository_path: '',
      ruleForm: {
        identifyName: '',
        bedListIdentifyType: 2,
        bedListIdentifyInfo: '|#000000',
        bedCardIdentifyType: 1,
        bedCardIdentifyInfo: '#ffffff|#000000',
        padPatientIdentifyType: 1,
        padPatientIdentifyInfo: '#ffffff|#000000',
        //
        listIdentificationValueA: '',
        listIdentificationValueB: '#000000',
        cardIdentificationValueA: '',
        cardIdentificationValueB: '#ffffff',
        cardIdentificationValueC: '#000000',
        padPatientIdentificationValueB: '#ffffff',
        padPatientIdentificationValueC: '#000000',
        //
        listIdentificationImage: '',
        listIdentificationImageName: '',
        cardIdentificationImage: '',
        cardIdentificationImageName: '',
        padPatientIdentificationImage: '',
        padPatientIdentificationImageName: ''
      },
      rules: {
        identifyName: [
          { required: true, message: '请输入标识名称！', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符！',
            trigger: 'blur'
          }
        ],
        listIdentificationValueA: [
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.bedListIdentifyType === 3 && value === '') {
                callback(new Error('请选择符号/图标！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.bedListIdentifyType === 2 && value.length > 10) {
                callback(new Error('长度在 1 到 10 个字符！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        cardIdentificationValueA: [
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.bedCardIdentifyType === 3 && value === '') {
                callback(new Error('请选择符号/图标！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.bedCardIdentifyType === 2 && value.length > 10) {
                callback(new Error('长度在 1 到 10 个字符！'))
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
  created () {
    let params = this.detail || {}
    this.form_type_text = params['identifyId'] ? '编辑' : '添加'
    // 处理回显内容
    if (params.bedListIdentifyInfo) {
      let info = []
      if (typeof params.bedListIdentifyInfo === 'string') {
        info = params.bedListIdentifyInfo.split('|')
      } else {
        info = params.bedListIdentifyInfo
      }
      if (params.bedListIdentifyType === 2 || params.bedListIdentifyType === 3) {
        params.listIdentificationValueA = info[0]
        params.listIdentificationValueB = info[1]
      } else if (params.bedListIdentifyType === 1) {
        params.listIdentificationValueB = info[0]
        params.listIdentificationValueC = info[1]
      } else {
        params.listIdentificationImage = info[0]
      }
    }
    if (params.bedCardIdentifyInfo) {
      let info = []
      if (typeof params.bedCardIdentifyInfo === 'string') {
        info = params.bedCardIdentifyInfo.split('|')
      } else {
        info = params.bedCardIdentifyInfo
      }
      if (params.bedCardIdentifyType === 2 || params.bedCardIdentifyType === 3) {
        params.cardIdentificationValueA = info[0]
        params.cardIdentificationValueB = info[1]
      } else if (params.bedCardIdentifyType === 1) {
        params.cardIdentificationValueB = info[0]
        params.cardIdentificationValueC = info[1]
      } else {
        params.cardIdentificationImage = info[0]
      }
    }
    if (params.padPatientIdentifyInfo) {
      let info = []
      if (typeof params.padPatientIdentifyInfo === 'string') {
        info = params.padPatientIdentifyInfo.split('|')
      } else {
        info = params.padPatientIdentifyInfo
      }
      if (params.padPatientIdentifyType === 2 || params.padPatientIdentifyType === 3) {
        params.padPatientIdentificationValueA = info[0]
        params.padPatientIdentificationValueB = info[1]
      } else if (params.padPatientIdentifyType === 1) {
        params.padPatientIdentificationValueB = info[0]
        params.padPatientIdentificationValueC = info[1]
      } else {
        params.padPatientIdentificationImage = info[0]
      }
    }
    Object.assign(this.ruleForm, params)
  },
  methods: {
    onChangePadCardIdentifyType (val) {
      if (val === 1) {
        this.ruleForm.padPatientIdentificationValueB = '#ffffff'
        this.ruleForm.padPatientIdentificationValueC = '#000000'
        this.ruleForm.padPatientIdentifyInfo = '#ffffff|#000000'
      } else {
        this.ruleForm.padPatientIdentificationImage = ''
      }
    },
    onChangeBedCardIdentifyType (val) {
      if (val === 1) {
        this.ruleForm.cardIdentificationValueB = '#000000'
        this.ruleForm.cardIdentificationValueC = '#ffffff'
        this.ruleForm.bedCardIdentifyInfo = '#ffffff|#000000'
      } else if (val === 2 || val === 3) {
        this.ruleForm.cardIdentificationValueA = ''
        this.ruleForm.cardIdentificationValueB = '#000000'
        this.ruleForm.bedCardIdentifyInfo = '|#000000'
      } else {
        this.ruleForm.cardIdentificationImage = ''
        this.ruleForm.bedCardIdentifyInfo = ''
      }
    },
    onChangeBedListIdentifyType (val) {
      if (val === 2 || val === 3) {
        this.ruleForm.listIdentificationValueA = ''
        this.ruleForm.listIdentificationValueB = '#000000'
        this.ruleForm.bedListIdentifyInfo = '|#000000'
      } else {
        this.ruleForm.listIdentificationImage = ''
      }
    },
    showImageDepository (type) {
      let path = ''
      let curPath = ''
      switch (type) {
        case 'list':
          path = 'webAndNurseDoctor'
          curPath = this.ruleForm.listIdentificationImage
          break
        case 'card':
          path = 'padCard'
          curPath = this.ruleForm.cardIdentificationImage
          break
        case 'padPatient':
          path = 'padPatient'
          curPath = this.ruleForm.padPatientIdentificationImage
          break
      }
      this.img = []
      ApiNursingIdentifyManage.selectImage({ url: '/hllabel/' + path })
        .then(res => {
          this.img = res.data || []
          this.image_depository_visible = true
          this.image_depository_type = type
          this.img_depository_path = curPath
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    handlerImageChange () {
      this.image_depository_visible = false
      this.ruleForm[this.image_depository_type + 'IdentificationImage'] = this.img_depository_path
      this.image_depository_type = ''
      this.img_depository_path = ''
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiNursingIdentifyManage.save(this.ruleForm)
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
    // 返回
    close () {
      this.$emit('changed', 'list2')
    },
    getTipName (path) {
      var arr = path.split('.') || []
      var _path = arr[0] || ''
      var _arr = _path.split('/')
      var length = _arr.length
      return _arr[(length - 1)] || ''
    }
  },
  watch: {
    'ruleForm.listIdentificationValueA' (v) {
      this.ruleForm.bedListIdentifyInfo = v + '|' + this.ruleForm.listIdentificationValueB
    },
    'ruleForm.listIdentificationValueB' (v) {
      this.ruleForm.bedListIdentifyInfo = this.ruleForm.listIdentificationValueA + '|' + v
    },
    'ruleForm.listIdentificationImage' (v) {
      this.ruleForm.bedListIdentifyInfo = v
      // 图片名称
      let _imgName = v.split('/')[v.split('/').length - 1]

      this.ruleForm.listIdentificationImageName = _imgName.substr(0, _imgName.length - 4)
    },
    'ruleForm.cardIdentificationValueA' (v) {
      this.ruleForm.bedCardIdentifyInfo = v + '|' + this.ruleForm.cardIdentificationValueB
    },
    'ruleForm.cardIdentificationValueB' (v) {
      if (this.ruleForm.bedCardIdentifyType === 1) {
        this.ruleForm.bedCardIdentifyInfo =
            v + '|' + this.ruleForm.cardIdentificationValueC
      } else {
        this.ruleForm.bedCardIdentifyInfo =
            this.ruleForm.cardIdentificationValueA + '|' + v
      }
    },
    'ruleForm.cardIdentificationValueC' (v) {
      this.ruleForm.bedCardIdentifyInfo =
          this.ruleForm.cardIdentificationValueB + '|' + v
    },
    'ruleForm.cardIdentificationImage' (v) {
      this.ruleForm.bedCardIdentifyInfo = v
      // 图片名称
      let _imgName = v.split('/')[v.split('/').length - 1]

      this.ruleForm.cardIdentificationImageName = _imgName.substr(0, _imgName.length - 4)
    },
    'ruleForm.padPatientIdentificationValueB' (v) {
      this.ruleForm.padPatientIdentifyInfo = v + '|' + this.ruleForm.padPatientIdentificationValueC
    },
    'ruleForm.padPatientIdentificationValueC' (v) {
      this.ruleForm.padPatientIdentifyInfo = this.ruleForm.padPatientIdentificationValueB + '|' + v
    },
    'ruleForm.padPatientIdentificationImage' (v) {
      this.ruleForm.padPatientIdentifyInfo = v
      // 图片名称
      let _imgName = v.split('/')[v.split('/').length - 1]

      this.ruleForm.padPatientIdentificationImageName = _imgName.substr(0, _imgName.length - 4)
    }
  },
  components: {
    layout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/bnms/css/self_common";

  /deep/.el-main {
    overflow: hidden;
  }

  .add-from {
    height: calc(100% - 100px);
    padding: 40px 10px 0 10px;
    .el-form-item {
      margin-bottom: 20px;
    }
  }

  .img-depository {
    .img-item {
      float: left;

      .list {
        width: 22px;
        height: 22px;
      }

      .card, .padPatient {
        width: 75px;
        height: 57px;
      }

      input {
        display: none;
      }

      label {
        margin: 5px;
        padding: 5px;
        display: inline-block;
        border: 1px solid #efefef;
        text-align: center;
        cursor: pointer;
      }

      input[type="radio"]:checked + label, label:hover {
        border: 1px solid #1E87F0;
      }

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .logoImg {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
  }

  .borderStyle {
    border: 1px #EBEEF5 solid;
    border-radius: 2px;
    width:524px;
  }

  .choseStyle {
    margin-right: 12px;
    margin-left: 16px;
  }
</style>
