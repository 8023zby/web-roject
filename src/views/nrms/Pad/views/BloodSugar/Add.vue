<template>
  <div class="typt-list-main">
    <div class="typt-add-container">
      <el-button type="primary" style="float: right;margin: 20px;" class="nrms-tz-cls">体征设备</el-button>
      <div class="typt-add-form-blood">
        <el-form class="nrms-blood-add" :model="addFormData" :rules="rules" ref="addForm" label-width="150px">
          <el-form-item label="时间：" prop="recordTime">
            <el-date-picker
              ref="timeRef"
              :clearable="false"
              v-model="addFormData.recordTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择时间">
            </el-date-picker>
            <i class="el-icon-date nrms-date-icon" @click="showTime"></i>
          </el-form-item>
          <el-form-item label="测量时刻：" prop="measurePeriod">
            <el-select v-model="addFormData.measurePeriod" clearable size="small">
              <el-option v-for="(item, index) in titData" :key="index" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="测量结果：" prop="measureResult">
            <el-input v-model="addFormData.measureResult" clearable></el-input>&emsp;<span style="font-size: 18px;">mmol/L</span>
          </el-form-item>
          <el-form-item label="血糖仪编号：" prop="glucometerNumber">
            <el-input v-model="addFormData.glucometerNumber"  clearable></el-input>
          </el-form-item>
          <el-form-item v-show="false" label="护士签名：" prop="nurseName">
            <el-input v-model="addFormData.nurseName"  clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="typt-add-footer">
        <el-button @click="reloadUrl" class="nrms-btn-cancel">取消</el-button>
        <el-button @click="saveData" class="nrms-btn-save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormate } from '../../../../../assets/nrms/js/Unitils'
import BaseManage from '../../../../../assets/nrms/mixins/BaseManage'
export default {
  name: 'BloodSugarAdd',
  mixins: [BaseManage],
  props: ['params'],
  data () {
    let checkData = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('血糖仪编号不能含有汉字!'))
        } else {
          callback()
        }
      }
      callback()
    }
    return {
      titMsg: '添加',
      actFlag: 'add',
      titData: [{
        id: 1,
        label: '临时'
      },
      {
        id: 2,
        label: '空腹'
      },
      {
        id: 3,
        label: '早餐后'
      },
      {
        id: 4,
        label: '午餐前'
      }, {
        id: 5,
        label: '午餐后'
      },
      {
        id: 6,
        label: '晚餐前'
      },
      {
        id: 7,
        label: '晚餐后'
      }, {
        id: 8,
        label: '睡前'
      },
      {
        id: 9,
        label: '夜间'
      }],
      // 添加数据
      addFormData: {
        recordId: '',
        recordTime: DateFormate.getNowFormatDate(),
        measurePeriod: '',
        measureResult: '',
        glucometerNumber: '',
        nurseName: '',
        patientId: '',
        deptId: '',
        orgId: ''
      },
      modelName: '血糖记录',
      url: '/nrms/web-nr/glucometer-record',
      rules: {
        recordTime: [
          { required: true, message: '请选择时间！' }
        ],
        measurePeriod: [
          { required: true, message: '请选择测量时刻！' }
        ],
        nurseName: [
          { required: true, message: '请填写护士签名！' }
        ],
        glucometerNumber: [
          { validator: checkData, trigger: 'blur' },
          { required: true, message: '血糖仪编号长度不超过20个字符！', trigger: 'blur', pattern: /^.{0,20}$/ }
        ],
        measureResult: [
          { required: true, message: '请填写正确的血糖测量结果！', trigger: 'blur', pattern: /^\d+(\.\d+)?$/ },
          { message: '血糖测量结果长度不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/ }
        ]
      }
    }
  },
  // 初始化数据
  created () {
    this.addFormData.patientId = this.params.patientData.patientId
    this.addFormData.deptId = this.params.patientData.partId
    this.addFormData.nurseName = this.params.patientData.nurseName
    this.addFormData.orgId = this.params.patientData.orgId
  },
  methods: {
    // 显示时间
    showTime () {
      this.$refs.timeRef.showPicker()
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
  .typt-add-footer{
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
  }
  .typt-add-form-blood{
    background: #FAFBFF;
    border-radius: 10px;
    margin-top: 60px;
    width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 33px 60px;
    padding-top: 60px;
    .el-icon-time:before {
      content: "";
    }
    .el-form-item__label{
      font-size: 20px;
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
        width: 205px !important;
        color: #FFFFFF;
        background: #5180EA;
      }
      .el-input__icon{
        color: #FFFFFF;
      }
    }
  }

</style>
