<template>
  <div class="typt-list-main" style="position: relative">
    <div class="typt-add-container">
      <!--<el-button type="primary" class="nrms-tz-cls" style="position: absolute; right: 20px; top: 20px;">体征设备</el-button>-->
      <div class="typt-add-form-pad">
        <el-form class="nrms-blood-add" :model="addFormData" :rules="rules" ref="addForm" label-width="100px">
          <el-form-item class="nrms-time-item" label="时间：" prop="recordTime">
            <el-date-picker
              v-model="addFormData.recordTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              ref="timeRef"
              type="datetime"
              :clearable="false"
              placeholder="请选择时间">
            </el-date-picker>
            <i class="el-icon-date nrms-date-icon" @click="showTime"></i>
          </el-form-item>
          <el-row>
            <el-col class="nrms-in-out-tit">
              入量
              <div class="nrms-blood-img">
                <i @click.prevent="addItem('intakeList')" class="el-icon-circle-plus iconAddCls"></i>
              </div>
            </el-col>
            <el-col id="in">
              <fieldset v-for="(item, index) in addFormData.intakeList" :key="index">
                <legend>入量{{index+1}}：</legend>
                <div class="nrms-blood-img">
                  <i v-if="index!==0" @click.prevent="removeItem('intakeList', item)" class="el-icon-remove iconDelCls"></i>
                </div>
                <el-row class="nrms-row-cls">
                  <el-col :span="12">
                    <el-form-item label-width="100px" label="方式：" :prop="'intakeList.'+index+'.mode'"
                                  :rules="{
                              message: '入量方式不超过10个字符！', trigger: 'change', pattern: /^.{0,10}$/
                            }">
                      <el-select filterable allow-create v-model="item.mode" clearable>
                        <el-option v-for="(item, index) in modeObj" :key="index" :label="item.label" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label-width="100px" label="备用量：" :prop="'intakeList.'+index+'.standby'"
                                  :rules="[
                                {message: '请输入正确的数字！', trigger: 'blur', pattern: /^\d+(\.\d+)?$/},
                                { message: '备用量长度不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/ }
                            ]">
                      <el-input v-model="item.standby" clearable></el-input>&emsp;<span style="font-size: 18px;">ml</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label-width="100px" label="项目：" :prop="'intakeList.'+index+'.project'"
                                  :rules="{
                              message: '入量项目不超过10个字符！', trigger: 'change', pattern: /^.{0,10}$/
                            }">
                      <el-select filterable allow-create v-model="item.project"  clearable>
                        <el-option v-for="(item, index) in inProject" :key="index" :label="item.signItemShowName" :value="item.signItemShowName"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label-width="100px" label="实入量：" :prop="'intakeList.'+index+'.amount'"
                                  :rules="[
                                {message: '请输入正确的数字！', trigger: 'blur', pattern: /^\d+(\.\d+)?$/},
                                { message: '实入量长度不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/ }
                            ]">
                      <el-input v-model="item.amount" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </fieldset>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="nrms-in-out-tit">
              出量
              <div class="nrms-blood-img">
                <i @click.prevent="addItem('outputList')" class="el-icon-circle-plus iconAddCls"></i>
              </div>
            </el-col>
            <el-col id="out">
              <fieldset v-for="(item, index) in addFormData.outputList" :key="index">
                <legend>出量{{index+1}}：</legend>
                <div class="nrms-blood-img">
                  <i v-if="index!==0" @click.prevent="removeItem('outputList', item)" class="el-icon-remove iconDelCls"></i>
                </div>
                <el-row class="nrms-row-cls">
                  <el-col :span="12">
                    <el-form-item label-width="100px" label="方式：" :prop="'outputList.'+index+'.mode'"
                                  :rules="{
                            message: '出量方式不超过10个字符！', trigger: 'blur', pattern: /^.{0,10}$/
                          }">
                      <el-input v-model="item.mode"  clearable></el-input>
                    </el-form-item>
                    <el-form-item label-width="100px" label="性状：" :prop="'outputList.'+index+'.characters'"
                                  :rules="{
                            message: '出量性状不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/
                          }">
                      <el-input v-model="item.characters" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label-width="100px" label="项目：" :prop="'outputList.'+index+'.project'"
                                  :rules="{
                              message: '出量项目不超过10个字符！', trigger: 'change', pattern: /^.{0,10}$/
                            }">
                      <el-select filterable allow-create v-model="item.project" clearable>
                        <el-option v-for="(item, index) in outProject" :key="index" :label="item.signItemShowName" :value="item.signItemShowName"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label-width="100px" label="量：" :prop="'outputList.'+index+'.amount'"
                                  :rules="[
                            {message: '请输入正确的数字！', trigger: 'blur', pattern: /^\d+(\.\d+)?$/},
                            { message: '量长度不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/ }
                            ]">
                      <el-input v-model="item.amount" clearable></el-input>&emsp;<span style="font-size: 18px;">ml</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </fieldset>
            </el-col>
          </el-row>
          <el-form-item v-show="false" label="护士签名：" prop="nurseName">
            <el-input v-model="addFormData.nurseName" placeholder="请输入护士签名" clearable></el-input>
          </el-form-item>
          <el-form-item label="">
            <div class="typt-add-footer">
              <el-button @click="reloadUrl" class="nrms-btn-cancel">取消</el-button>
              <el-button class="nrms-btn-save" @click="saveData" :loading="addVis">保存</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="nrms-in-out-nav-div">
          <div class="nrms-in-out-nav">
            <div :class="{'nrms-in-out-nav-item':true, 'nrms-active':activeItem==='in'}" @click="scrollPosition('in')">入量</div>
            <div :class="{'nrms-in-out-nav-item':true, 'nrms-active':activeItem==='out'}" @click="scrollPosition('out')">出量</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormate } from '../../../../../assets/nrms/js/Unitils'
import BaseManage from '../../../../../assets/nrms/mixins/BaseManage'
import { AxiosApi } from '../../../../../api/nrms/http/index'
import { MsgShow } from '../../../../../assets/nrms/js/Message'
export default {
  name: 'NurseApplyAdd',
  mixins: [BaseManage],
  props: ['params'],
  data () {
    return {
      titMsg: '添加',
      actFlag: 'add',
      activeItem: 'in',
      modelName: '出入量记录',
      modeObj: [{
        id: '空',
        label: '空'
      },
      {
        id: '医嘱',
        label: '医嘱'
      }],
      url: '/nrms/web-nr/intake-output',
      // 添加数据
      addFormData: {
        recordId: '',
        recordTime: DateFormate.getNowFormatDate(),
        intakeList: [{
          mode: '',
          project: '',
          standby: '',
          amount: ''
        }],
        outputList: [{
          mode: '',
          project: '',
          characters: '',
          amount: ''
        }],
        type: 1,
        nurseName: '',
        patientId: '',
        deptId: ''
      },
      contentNum: {
        intakeList: 1,
        outputList: 1
      },
      inProject: [],
      outProject: [],
      rules: {
        recordTime: [
          { required: true, message: '请选择时间！' }
        ],
        nurseName: [
          { required: true, message: '请填写护士签名！' }
        ]
      }
    }
  },
  // 初始化数据
  created () {
    this.addFormData.patientId = this.params.patientData.patientId
    this.addFormData.deptId = this.params.patientData.partId
    this.addFormData.nurseName = this.params.patientData.nurseName
    this.getInProject()
    this.getOutProject()
  },
  methods: {
    // 显示时间
    showTime () {
      this.$refs.timeRef.showPicker()
    },
    // 滚动
    scrollPosition (id) {
      this.activeItem = id
      document.getElementById(id).scrollIntoView()
    },
    // 获取项目
    getInProject () {
      AxiosApi(`/nrms/web-nr/sign-apply/by-in-out-type`, {}, 'GET', { inOutType: 2 }).then(res => {
        if (res.status === 200) {
          this.inProject = res.data
        }
      })
    },
    // 获取项目
    getOutProject () {
      AxiosApi(`/nrms/web-nr/sign-apply/by-in-out-type`, {}, 'GET', { inOutType: 3 }).then(res => {
        if (res.status === 200) {
          this.outProject = res.data
        }
      })
    },
    // 保存数据
    saveData () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.actFlag === 'add') {
            this.addFormData = Object.assign(this.addFormData, this.publicObj)
          }
          this.saveDataDo(this.addFormData, this.actFlag)
        }
      })
    },
    // 添加多个
    addItem (act) {
      if (act === 'intakeList') {
        if (this.contentNum.intakeList < 5) {
          this.addFormData.intakeList.push({
            mode: '',
            project: '',
            standby: '',
            amount: ''
          })
          this.contentNum.intakeList++
        } else {
          MsgShow('warning', '最多添加五个入量！')
        }
      } else if (act === 'outputList') {
        if (this.contentNum.outputList < 5) {
          this.addFormData.outputList.push({
            mode: '',
            project: '',
            characters: '',
            amount: ''
          })
          this.contentNum.outputList++
        } else {
          MsgShow('warning', '最多添加五个出量！')
        }
      }
    },
    // 删除多个
    removeItem (act, item) {
      let index
      if (act === 'intakeList') {
        index = this.addFormData.intakeList.indexOf(item)
        if (index !== -1) {
          this.addFormData.intakeList.splice(index, 1)
        }
        this.contentNum.intakeList--
      } else if (act === 'outputList') {
        index = this.addFormData.outputList.indexOf(item)
        if (index !== -1) {
          this.addFormData.outputList.splice(index, 1)
        }
        this.contentNum.outputList--
      }
    }
  }
}
</script>
<style lang="scss">
  .nrms-tz-cls,.nrms-tz-cls:visited, .nrms-tz-cls:focus, .nrms-tz-cls:hover{
    border-radius: 4px !important;
    background: #01AAFF !important;
    border-color: #01AAFF !important;
    font-size: 18px !important;
  }
  .nrms-date-icon{
    font-size: 20px;
    margin-left: 40px;
    color: #7791F0;
    vertical-align: middle;
    cursor: pointer;
  }
  .typt-add-form-pad{
    font-size: 20px;
    display: flex;
    .el-icon-time:before {
      content: "";
    }
    .el-form-item__content{
      margin-left: 60px !important;
    }
    .nrms-time-item{
      .el-form-item__label{
        text-align: left;
        font-size: 20px;
      }
    }
    .nrms-btn-cancel{
      background: #EFEFEF;
      border: none;
      border-radius: 6px !important;
      height: 40px;
      width: 100px;
      font-size: 18px !important;
    }
    .nrms-btn-save{
      border-radius: 6px !important;
      height: 40px;
      width: 100px;
      font-size: 18px !important;
      border-color: #5181EC;
      color: #5181EC;
      margin-left: 100px;
    }
    .el-input, .el-select,.el-input__inner{
      border-radius: 30px !important;
      width: 200px !important;
      border: none;
      background: #F4F4F6;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
    }
    .el-input__icon {
      line-height: 40px !important;
    }
    .el-icon-arrow-up{
      color: #15B377 !important;
    }
    .el-icon-arrow-up:before {
      font-size: 16px;
      content: "\e790";
    }
    .el-date-editor {
      .el-input__inner{
        width: 210px !important;
        color: #FFFFFF;
        background: #5180EA;
      }
      .el-input__icon{
        color: #FFFFFF;
      }
    }
    .nrms-blood-add{
      width: 0;
      padding:60px 60px 0px 40px;
      flex: 1;
    }
    .nrms-in-out-tit{
      color: #5886E3;
      border-bottom: 1px solid #C2C7E5;
      padding-bottom: 10px;
    }
    .nrms-row-cls{
      background: #FAFBFF;
      border-radius: 10px;
      padding: 60px;
      padding-bottom: 33px;
      .el-form-item__label{
        font-size: 20px;
        color: #666666 !important;
      }
    }
    .nrms-in-out-nav-div{
      margin-right: 10px;
      width: 120px;
    }
    .nrms-in-out-nav{
      position: fixed;
      height: 104px;
      width: 120px;
      top: 50%;
      background: #5281EB;
      border-radius: 10px;
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .nrms-in-out-nav-item{
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      cursor: pointer;
      color: #FFFFFF;
    }
    .nrms-active{
      color: #5281EB;
      background: #FFFFFF;
      border-left: 1px solid #e6e6e6;
      border-right: 1px solid #e6e6e6;
    }
    .el-col{
      fieldset{
        border: none;
        margin-top: 20px;
        position: relative;
        .el-form{
          margin-left: 0px !important;
        }
        margin-bottom: 20px;
      }
      legend{
        color: #666666 !important;
        font-size: 20px !important;
        width: auto;
      }
      .iconAddCls{
        font-size: 30px;
        color: #4F84E9;
        cursor: pointer;
        margin-left: 10px;
        vertical-align: middle;
      }
      .iconDelCls{
        font-size: 30px;
        color: #F56C6C;
        cursor: pointer;
        margin-left: 10px;
        vertical-align: middle;
      }
      .nrms-blood-img{
        text-align: right;
        position: absolute;
        top: 0px;
        right: 10px;
      }
    }
  }
</style>
