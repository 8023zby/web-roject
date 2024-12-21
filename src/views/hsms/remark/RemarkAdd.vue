<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}事件备忘</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form :model="addFormData" :rules="rules" ref="addForm" label-width="130px">
          <el-form-item label="开始时间:" prop="beginDate">
            <el-date-picker
              style="width: 300px;"
              v-model="addFormData.beginDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间:" prop="endDate">
            <el-date-picker
              style="width: 300px;"
              v-model="addFormData.endDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注:" prop="noteDescribe">
            <el-input v-model="addFormData.noteDescribe"
                      rows="7"
                      autocomplete="off"
                      style="width: 300px;"
                      type="textarea"
                      placeholder="请输入"
                      show-word-limit
                      maxlength="200"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="reloadUrl">取消</el-button>
      <el-button type="primary" @click="saveData" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import moment from 'moment'

export default {
  name: 'NurseRemarkAdd',
  mixins: [BaseManage],
  props: ['modifyData', 'params'],
  data () {
    const validate = (rule, value, callback) => {
      console.log(moment(this.addFormData.endDate).diff(moment(this.addFormData.beginDate)))
      if (moment(this.addFormData.endDate).diff(moment(this.addFormData.beginDate)) < 0) {
        callback(new Error('结束时间必须晚于开始时间！'))
      } else {
        callback()
      }
    }
    return {
      dutyData: [],
      actFlag: 'add',
      titMsg: '添加',
      businessType: 'NURSE',
      addFormData: {
        beginDate: '',
        endDate: '',
        noteDescribe: ''
      },
      locationUrl: '/remark',
      modelName: '事件备忘',
      url: '/hsms/web-hs/note',
      rules: {
        beginDate: [
          { required: true, message: '请选择开始时间！', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间！', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        noteDescribe: [
          { required: true, message: '请输入备注！', trigger: 'blur' }
          // {message: '备注长度不超过200个字符！', trigger: 'blur', pattern: /^.{1,200}$/}
        ]
      }
    }
  },
  // 初始化数据
  created () {
    this.businessType = this.params.businessType
    let obj = this.modifyData
    let key = obj['noteId'] || ''
    if (key) {
      this.actFlag = 'modify'
      this.titMsg = '编辑'
      // 对象的复制，不然会影响原来的值（假数据导致，要是请求后台应该不会有这问题）
      let temp = { ...obj }
      this.addFormData = temp
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/hsms/css/self_common";
  /deep/ .el-input--small .el-input__inner {
    height: 34px;
  }

  /deep/ .el-textarea__inner {
    padding-bottom: 28px;
    border-radius: 2px;
  }

  /deep/ .el-textarea .el-input__count {
    text-align: right;
    left: 1px;
    right: 1px;
    bottom: 1px;
    padding: 7px 5px;
    font-size: 12px;
    line-height: normal;
  }
</style>
