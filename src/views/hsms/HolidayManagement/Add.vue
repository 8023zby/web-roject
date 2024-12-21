<template>
    <div class="typt-list-main">
        <div class="typt-tit-cls">
            <div class="typt-tit-logo"></div>
            <div class="typt-tit-content">{{titMsg}}请假</div>
        </div>
        <div class="typt-add-container">
            <div class="typt-add-form">
                <el-form :model="holidayData" :rules="rules" ref="addForm" label-width="130px">
                    <el-form-item label="请假类型:" prop="holidayClass">
                        <el-select placeholder="请选择" v-model="holidayData.holidayClass" filterable clearable>
                            <el-option v-for="item in holidayTypeData" :label="item.holidayClass"
                                       :value="item.holidayClass"
                                       :key="item.holidayClassId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始日期:" prop="startDate">
                        <el-date-picker
                            style="width: 300px"
                            v-model="holidayData.startDate"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择" :picker-options="expireTimeOption" @change="changDateTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束日期:" prop="endDate">
                        <el-date-picker
                            style="width: 300px"
                            v-model="holidayData.endDate"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            placeholder="请选择" :picker-options="expireTimeOption" @change="changDateTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="请假天数:" prop="leaveWorkDays">
                        <el-input v-model="holidayData.leaveWorkDays"
                                  type="number"
                                  placeholder="请输入"
                                  clearable disabled/>
                    </el-form-item>
                    <el-form-item label="累计天数:" prop="isAutoShow">
                        <el-checkbox label="自动显示累计天数" v-model="holidayData.isAutoShow" :true-label="1">
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item label="请假理由:" prop="holidayReason">
                        <el-input v-model="holidayData.leaveWorkReason" rows="7"
                                  autocomplete="off"
                                  style="width: 300px"
                                  type="textarea"
                                  placeholder="请输入"
                                  show-word-limit
                                  maxlength="100"/>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="typt-add-footer">
            <el-button @click="cancelData">取消</el-button>
            <el-button type="primary" @click="saveData" :loading="addLoading">保存</el-button>
        </div>
    </div>
</template>

<script>
import { ApiHolidayType, ApiHolidayData } from '../../../api/hsms'
import moment from 'moment'

export default {
  name: 'HolidayAdd',
  props: ['modifyData', 'params'],
  data () {
    return {
      titMsg: '添加',
      operateFlag: 'add',
      addLoading: false,
      holidayData: {
        holidayId: '',
        holidayTypeId: 0,
        startDate: null,
        endDate: null,
        isAutoShow: 0,
        leaveWorkDays: 0,
        holidayReason: ''
      },
      holidayTypeData: [],
      modelName: '请假管理',
      rules: {
        holidayClass: [{ required: true, message: '请选择请假类型！', trigger: 'blur' }],
        startDate: [
          { required: true, message: '请选择开始日期！', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期！', trigger: 'blur' }
        ],
        leaveWorkDays: [
          { required: true, message: '请输入请假天数！', trigger: 'blur' }
        ]
      },
      expireTimeOption: {
        disabledDate (date) {
          // disabledDate 文档上:设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() < moment().add(-1, 'months').date(0)
        }
      }
    }
  },
  // 初始化数据
  activated () {
    this.$refs.addForm.resetFields()

    this.getDutyData()
    let key = this.modifyData['leaveWorkId'] || ''

    if (key) {
      this.titMsg = '编辑'
      this.holidayData = this.modifyData
      this.operateFlag = 'edit'
    } else {
      this.operateFlag = 'add'
      this.holidayData = this.modifyData
      this.$set(this.holidayData, 'isAutoShow', 0)
      this.$set(this.holidayData, 'leaveWorkDays', 0)
      /* this.holidayData.startDate = ''
                this.holidayData.endDate = '' */
      // this.holidayData.leaveWorkDays = 0
    }
  },
  methods: {
    changDateTime () {
      if (this.holidayData.startDate && this.holidayData.endDate) {
        this.holidayData.leaveWorkDays = moment(this.holidayData.endDate).diff(moment(this.holidayData.startDate), 'day') + 1
      }
    },
    // 请求请假类型
    getDutyData () {
      ApiHolidayType.get().then(res => {
        this.holidayTypeData = res.data || []
      })
    },
    cancelData () {
      this.$emit('option-changed', 'list')
    },
    saveData () {
      this.$refs['addForm'].validate(
        (valid) => {
          if (valid) {
            if (parseFloat(this.holidayData.leaveWorkDays) > 9999) {
              this.$message.error('请假天数过大!')
              return
            }
            this.holidayData.isAutoShow = this.holidayData.isAutoShow ? 1 : 0
            if (this.holidayData.endDate < this.holidayData.startDate) {
              this.$message.error('开始时间不能大于结束时间！')
              return
            }
            this.addLoading = true

            if (this.operateFlag === 'add') {
              let _this = this

              ApiHolidayData.save(this.holidayData).then(
                setTimeout(function () {
                  _this.$emit('option-changed', 'list')
                }, 100)
              ).catch(res => {
                this.$message.error(res.message)
              }).finally()
              {
                this.addLoading = false
              }
            } else {
              let _this = this

              ApiHolidayData.update(this.holidayData).then(
                setTimeout(function () {
                  _this.$emit('option-changed', 'list')
                }, 100)
              ).catch(res => {
                this.$message.error(res.message)
              }).finally()
              {
                this.addLoading = false
              }
            }
          }
        }
      )
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
