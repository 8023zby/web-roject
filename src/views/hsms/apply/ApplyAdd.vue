<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}申请</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form :model="addFormData" :rules="rules" ref="addForm" label-width="130px">
          <el-form-item label="开始时间：" prop="beginDate">
            <el-date-picker
              style="width: 300px"
              v-model="addFormData.beginDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="endDate">
            <el-date-picker
              style="width: 300px"
              v-model="addFormData.endDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请班次：" prop="shiftId">
            <el-select v-model="addFormData.shiftId"
                       style="width: 300px"
                       placeholder="请选择">
              <!--el-option label="请选择" value=""></el-option-->
              <el-option v-for="(item, index) in dutyData"
                         :key="index"
                         :label="item.shiftName"
                         :value="item.shiftId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="申请原因：" prop="applyDescribe">
            <el-input v-model="addFormData.applyDescribe" rows="7"
                      autocomplete="off"
                      style="width: 300px"
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
import { GetDuty } from '../../../api/hsms'

export default {
  name: 'NurseApplyAdd',
  mixins: [BaseManage],
  props: ['modifyData', 'params'],
  data () {
    return {
      locationUrl: '/apply',
      dutyData: [],
      titMsg: '添加',
      actFlag: 'add',
      businessType: 'NURSE',
      addFormData: {
        shiftId: '',
        beginDate: '',
        endDate: '',
        applyDescribe: ''
      },
      modelName: '排班申请',
      url: '/hsms/web-hs/apply',
      rules: {
        beginDate: [
          { required: true, message: '请选择开始时间！' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间！' }
        ],
        shiftId: [
          { required: true, message: '请选择申请班次！' }
        ],
        applyDescribe: [
          // { message: '申请原因长度不超过200个字符！', trigger: 'blur', pattern: /^.{0,200}$/ }
        ]
      }
    }
  },
  // 初始化数据
  created () {
    this.businessType = this.params.businessType
    let obj = this.modifyData
    this.getDutyData()
    let key = obj['applyId'] || ''
    if (key) {
      this.actFlag = 'modify'
      this.titMsg = '编辑'
      // 对象的复制，不然会影响原来的值（假数据导致，要是请求后台应该不会有这问题）
      let temp = { ...obj }
      this.addFormData = temp
    }
  },
  methods: {
    // 请求班次
    getDutyData () {
      GetDuty(this.businessType).then(res => {
        this.dutyData = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/hsms/css/self_common";
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
