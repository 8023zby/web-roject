<template>
    <layout>
        <div slot="title">{{ form_type_text }}交班配置</div>
        <div slot="main" class="add-from">
            <div class="form-main-center"
                 :style="{'max-width': ruleForm.bnShiftChildList.length>0 ? '900px' : ''}">
                <el-form ref="ruleForm"
                         :model="ruleForm"
                         :rules="rules"
                         label-width="80px">
                    <el-form-item label="名称:"
                                  prop="shiftMainName"
                                  label-width="95px">
                        <el-input v-model="ruleForm.shiftMainName"
                                  type="text"
                                  maxlength="20"
                                  placeholder="请输入"/>
                    </el-form-item>
                    <el-form-item label="排班模式:"
                                  prop="shiftType"
                                  label-width="95px">
                        <el-select v-model="ruleForm.shiftType"
                                   placeholder="请选择"
                                   clearable
                                   ref="select-a"
                                   id="a"
                                   @focus="selectFocus('a')"
                                   v-uni="'jiaobanshezhi_add_changeMode'"
                                   @change="handleChange">
                            <el-option label="两班倒" value="两班倒"/>
                            <el-option label="三班倒" value="三班倒"/>
                        </el-select>
                    </el-form-item>

                    <!-- 班次循环 -->
                    <template v-for="(item, index) in ruleForm.bnShiftChildList">

                        <!--el-form-item-- :label="'班次'+ (index + 1) + ':'"
                                      class="shift-item">
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="班次名称:"
                                                  label-width="95px"
                                                  :prop="'bnShiftChildList['+ index +'].shiftName'"
                                                  :rules="[{
                      required: true, message: '班次名称不能为空！', trigger: 'blur'
                    },{ min:1, max: 20, message: '最多20个字符！', trigger: 'blur' }]"
                                    >
                                        <el-input v-model="item.shiftName"/>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="班次时间:"
                                                  label-width="95px"
                                                  :prop="'bnShiftChildList['+index +'].beginTime'"
                                                  :rules="{
                      required: true, message: '班次时间不能为空！', trigger: 'blur'
                    }"
                                    >
                                        <el-time-picker
                                                v-model="item.beginTime"
                                                :picker-options="{
                          format:'HH:mm',
                        }"
                                                value-format="HH:mm"
                                                placeholder="请选择">
                                        </el-time-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="至" :prop="'bnShiftChildList['+index +'].endTime'"
                                                  label-width="40px"
                                                  :rules="[
                                {required: true, message: '班次时间不能为空！', trigger: 'blur'},
                                { validator: function (rule, value, callback)  {
                                  if (value === item.beginTime) {
                                    callback('不能与开始时间一样！');
                                  } else {
                                    callback();
                                  }
                                }, trigger: 'blur' }
                    ]"
                                    >
                                        <el-time-picker
                                                v-model="item.endTime"
                                                :picker-options="{
                          format:'HH:mm',
                        }"
                                                value-format="HH:mm"
                                                placeholder="请选择">
                                        </el-time-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item-->

                        <div class="setting-container">
                            <div class="setting-title">班次{{index + 1}}</div>
                            <div class="setting-main">
                                <div class="setting-item">
                                    <div class="setting-name-label">班次名称:</div>
                                    <div class="setting-name-value">
                                        <el-form-item label=""
                                                      label-width="0"
                                                      :prop="'bnShiftChildList['+ index +'].shiftName'"
                                                      :rules="[{
                      required: true, message: '班次名称不能为空！', trigger: 'blur'
                    },{ min:1, max: 20, message: '最多20个字符！', trigger: 'blur' }]"
                                        >
                                            <el-input v-model="item.shiftName"
                                                      maxlength="20"
                                                      type="text"
                                                      placeholder="请输入"/>
                                        </el-form-item>
                                    </div>
                                    <div class="clear-both"></div>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-time-label">班次时间:</div>
                                    <div class="setting-time-value">
                                        <el-form-item label=""
                                                      label-width="0"
                                                      :prop="'bnShiftChildList['+index +'].beginTime'"
                                                      :rules="{
                      required: true, message: '班次时间不能为空！', trigger: 'blur'
                    }"
                                        >
                                            <el-time-picker
                                                    v-model="item.beginTime"
                                                    :picker-options="{
                          format:'HH:mm',
                        }"
                                                    value-format="HH:mm"
                                                    placeholder="请选择">
                                            </el-time-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="setting-time-conn">至</div>
                                    <div class="setting-time-value">
                                        <el-form-item label=""
                                                      :prop="'bnShiftChildList['+index +'].endTime'"
                                                      label-width="0"
                                                      :rules="[
                                {required: true, message: '班次时间不能为空！', trigger: 'blur'},
                                { validator: function (rule, value, callback)  {
                                  if (value === item.beginTime) {
                                    callback('不能与开始时间一样！');
                                  } else {
                                    callback();
                                  }
                                }, trigger: 'blur' }
                    ]"
                                        >
                                            <el-time-picker
                                                    v-model="item.endTime"
                                                    :picker-options="{
                          format:'HH:mm',
                        }"
                                                    value-format="HH:mm"
                                                    placeholder="请选择">
                                            </el-time-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="clear-both"></div>
                                </div>
                            </div>
                        </div>

                    </template>

                    <el-form-item label="备注:"
                                  label-width="95px"
                                  prop="remarks">
                        <el-input type="textarea"
                                  v-model="ruleForm.remarks"
                                  :rows="5"
                                  maxlength="50"
                                  placeholder="请输入"
                                  show-word-limit/>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div slot="footer_btn">
            <el-button size="medium"
                       @click="close" v-uni="'jiaobanshezhi_add_cancel'">
                取消
            </el-button>
            <el-button type="primary"
                       size="medium"
                       @click="submitForm" v-uni="'jiaobanshezhi_add_save'">
                保存
            </el-button>
        </div>

    </layout>
</template>

<script>
import { ApiShifts } from '../../../api/bnms/index'
import layout from '../../../components/bnms/layout/edit'
import _select from '../../../assets/bnms/mixins/_select'

export default {
  name: 'shift_setting_add',
  components: { layout },
  mixins: [_select],
  data () {
    return {
      form_type_text: '',
      ruleForm: {
        shiftMainId: '',
        shiftMainName: '',
        shiftType: '',
        bnShiftChildList: [],
        remarks: ''
      },
      rules: {
        shiftMainName: [
          { required: true, message: '请填写交班名称！', trigger: 'blur' },
          { min: 1, max: 20, message: '最多20个字符！', trigger: 'blur' }
        ],
        shiftType: [
          { required: true, message: '请选择交班模式！', trigger: 'blur' },
          { min: 1, max: 20, message: '最多20个字符！', trigger: 'blur' }
        ],
        remarks: [
          { min: 1, max: 50, message: '最多50个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['shift'],
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.ruleForm.userId = empInfo.empId || ''
    this.form_type_text = this.shift['shiftMainId'] ? '编辑' : '添加'
    // 处理详情
    if (JSON.stringify(this.shift) !== '{}') {
      let data = JSON.parse(JSON.stringify(this.shift))
      this.ruleForm = data
    }
  },
  methods: {
    handleChange (val) {
      this.ruleForm.bnShiftChildList = []
      if (!val) return
      let count = val === '两班倒' ? 2 : 3
      for (let i = 0; i < count; i++) {
        this.ruleForm.bnShiftChildList.push({
          shiftName: '',
          beginTime: '',
          endTime: ''
        })
      }
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiShifts.save(this.ruleForm)
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
    close () {
      this.$emit('option-changed', 'list')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    @import "../../../assets/bnms/css/self_common";

    /deep/ .el-form-item__label {
        width: 100px;
    }

    .shift-item {
        > /deep/ .el-form-item__content {
            border: 1px solid #E4E7ED;
            padding: 18px 0 0 18px;
            border-radius: 2px;
            margin-left: 95px !important;
        }
    }

    /deep/ .el-row {
        width: initial !important;
    }

    /deep/ .el-input--small .el-input__inner {
        width: 300px;
        height: 34px;
    }

    .RED {
        content: '*';
        color: #F56C6C;
        margin-right: 4px;
    }

    .setting-container {
        margin: 0 0 30px 0;

        .setting-title {
            color: #333333;
            font-size: 14px;
            width: 95px;
            height: 20px;
            line-height: 20px;
            text-align: left;
            padding: 0 0 0 18px;
            margin: 20px 0 10px 0;
        }

        .setting-title:before {
            content: '*';
            color: #F56C6C;
            margin-right: 4px;
        }

        .setting-main {
            width: 738px;
            height: 120px;
            border: 1px solid #EBEEF5;
            border-radius: 2px;
            margin: 0 0 0 10px;

            .setting-item {

                .setting-name-label {
                    float: left;
                    height: 60px;
                    width: 85px;
                    line-height: 60px;
                    color: #666666;
                    font-size: 14px;
                    text-align: center;
                }

                .setting-name-value {
                    float: left;
                    height: 60px;
                    line-height: 60px;

                    .el-form-item {
                        margin: 12px 0 0 0;
                    }
                }

                .setting-time-label {
                    float: left;
                    height: 60px;
                    width: 85px;
                    line-height: 60px;
                    color: #666666;
                    font-size: 14px;
                    text-align: center;
                }

                .setting-time-value {
                    float: left;
                    height: 60px;
                    width: 300px;
                    line-height: 60px;

                    .el-form-item {
                        margin: 12px 0 0 0;
                    }
                }

                .setting-time-conn {
                    float: left;
                    width: 40px;
                    text-align: center;
                    height: 60px;
                    line-height: 60px;
                    color: #666666;
                    font-size: 14px;
                }
            }
        }
    }

    textarea {
        font-family: none;
    }

    .border {
        border: 1px solid red;
    }

    .clear-both {
        clear: both;
    }
</style>
