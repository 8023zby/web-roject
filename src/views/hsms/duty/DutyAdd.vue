<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}班次库</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form  :model="addFormData" :rules="rules" ref="addForm" label-width="130px">
          <el-form-item label="班次名称:" prop="repoShiftName">
            <el-input style="width: 300px"
                      v-model="addFormData.repoShiftName"
                      autocomplete="off"
                      maxlength="20"
                      :clearable="true"
                      placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="班次类型:" prop="shiftType">
            <el-select :popper-append-to-body="false"
                       style="width: 300px"
                       v-model="addFormData.shiftType"
                       placeholder="请选择">
              <!--el-option label="请选择" value=""></el-option-->
              <el-option v-for="(item, index) in dutyTypeData"
                         :key="index"
                         :label="item.name"
                         :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="到岗时间:" prop="arrivalTime">
            <el-time-picker
              style="width: 300px"
              v-model="addFormData.arrivalTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="请选择">
            </el-time-picker>
          </el-form-item>

          <el-form-item
            v-for="(item, index) in addFormData.shiftTime"
            :label="'工作时间:'"
            :key="item.key"
            :prop="'shiftTime_' + index "
          >
            <el-time-picker
              style="width: 300px"
              class="smallInput"
              v-model="item.beginDate"
              type="date"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="开始时间">
            </el-time-picker>
            &nbsp;<span style="color: #666666;">至</span>&nbsp;
            <el-time-picker
              style="width: 300px"
              class="smallInput"
              v-model="item.endDate"
              type="date"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="结束时间">
            </el-time-picker>
            <i v-uni:[item.key]="'yishengtianjiabanciku_addTime'" :key="'yishengtianjiabanciku_addTime' + item.key" @click.prevent="addShiftTime()" class="el-icon-circle-plus-outline iconAddCls"/>
            <i v-uni:[item.key]="'yishengtianjiabanciku_delTime'" :key="'yishengtianjiabanciku_delTime' + item.key" v-if="index!==0" @click.prevent="removeShiftTime(item)"
               class="el-icon-remove-outline iconDelCls"/>
          </el-form-item>
          <el-form-item label="班次颜色:" prop="backgroundColor">
            <div style="height: 34px;">
              <el-color-picker v-model="addFormData.backgroundColor"/>
            </div>
          </el-form-item>
          <el-form-item label="字体颜色:" prop="foregroundColor">
            <div style="height: 34px;">
              <el-color-picker v-model="addFormData.foregroundColor"/>
            </div>
          </el-form-item>
          <el-form-item label="工时:" prop="workHours">
            <!--el-input-number v-model="addFormData.workHours" :precision="1" :step="0.5" :max="24" /-->
            <el-input v-model="addFormData.workHours"
                      style="width: 300px;"
                      :clearable="true"
                      placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="班次说明:" prop="shiftDescribe">
            <el-input v-model="addFormData.shiftDescribe"
                      style="width: 300px;"
                      rows="7" autocomplete="off"
                      type="textarea"
                      placeholder="请输入"
                      show-word-limit
                      maxlength="200"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button v-uni="'yishengtianjiabanciku_cancel'" @click="reloadUrl">取消</el-button>
      <el-button v-uni="'yishengtianjiabanciku_save'" type="primary" @click="saveData" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import { MsgShow } from '../../../assets/hsms/js/Message'
import { AxiosApi } from '../../../api/hsms'
import moment from 'moment'

export default {
  name: 'NurseDutyAdd',
  props: ['modifyData', 'params'],
  mixins: [BaseManage],
  data () {
    return {
      modelName: '班次',
      titMsg: '添加',
      url: '/hsms/web-hs/repository',
      locationUrl: '/duty',
      actFlag: 'add',
      businessType: 'NURSE',
      dutyTypeData: [],
      shiftTimeNum: 1,
      addFormData: {
        repoShiftName: '',
        backgroundColor: '#FFFFFF',
        arrivalTime: '',
        shiftType: '',
        shiftDescribe: '',
        workHours: '',
        foregroundColor: '#606266',
        shiftTime: [{
          key: Date.now(),
          beginDate: '',
          endDate: ''
        }]
      },
      rules: {
        repoShiftName: [
          { required: true, message: '请填写班次名称！' }
          // {message: '班次名称长度不超过20个字符！', trigger: 'blur', pattern: /^.{1,20}$/}
        ],
        shiftType: [
          { required: true, message: '请选择班次类型！' }
        ],
        workHours: {
          validator: (rule, value, callback) => {
            if (value && !/^(\d+|\d+\.\d{1,2})$/.test(value)) {
              callback(new Error('请输入数字,小数支持2位!'))
            } else if (value && value > 24) {
              callback(new Error('工时必须为0-24范围内的数字！'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        },
        shiftDescribe: [
          // {message: '班次说明长度不超过200个字符！', trigger: 'blur', pattern: /^.{0,200}$/}
        ]
      }
    }
  },
  // 初始化数据
  created () {
    let obj = this.modifyData
    let key = obj['repoShiftId'] || ''
    this.businessType = this.params.businessType
    this.getDutyType()
    if (key) {
      this.actFlag = 'modify'
      this.titMsg = '编辑'
      // 对象的复制，不然会影响原来的值（假数据导致，要是请求后台应该不会有这问题）
      let temp = { ...obj }
      // 工作时间转换
      let shiftTime = temp.shiftTime || ''
      if (shiftTime === '') {
        temp.shiftTime = [{
          key: Date.now(),
          beginDate: '',
          endDate: ''
        }]
      } else {
        shiftTime = JSON.parse(shiftTime)
        let obj = []
        for (let i = 0; i < shiftTime.length; i++) {
          obj.push({
            key: Date.now() + i,
            beginDate: shiftTime[i].beginTime,
            endDate: shiftTime[i].endTime
          })
        }
        this.shiftTimeNum = shiftTime.length
        temp.shiftTime = obj
      }
      this.addFormData = temp
    }
  },
  methods: {
    // 保存数据
    saveData () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          // 班次时间数据转换
          let workObj = []
          let saveData = { ...this.addFormData }
          let temp = saveData.shiftTime
          for (let i = 0; i < temp.length; i++) {
            let val = temp[i]
            if (!val || (!val.beginDate && !val.endDate)) continue
            workObj.push({
              beginTime: val.beginDate,
              endTime: val.endDate,
              sort: i + 1
            })
          }
          if (workObj.length === 0) {
            delete saveData.shiftTime
          } else {
            saveData.shiftTime = JSON.stringify(workObj)
          }
          this.saveDataDo(saveData, this.actFlag)
        }
      })
    },
    // 删除工作时间
    removeShiftTime (item) {
      let index = this.addFormData.shiftTime.indexOf(item)
      if (index !== -1) {
        this.addFormData.shiftTime.splice(index, 1)
      }
      this.shiftTimeNum--
    },
    // 添加工作时间
    addShiftTime () {
      if (this.shiftTimeNum < 5) {
        this.addFormData.shiftTime.push({
          key: Date.now(),
          beginDate: '',
          endDate: ''
        })
        this.shiftTimeNum++
      } else {
        MsgShow('warning', '最多添加五个工作时间段！')
      }
    },
    // 获取班次类型
    getDutyType () {
      AxiosApi('/hsms/web-hs/repository/' + this.businessType + '/type', {}, 'GET', { businessType: this.businessType }).then(res => {
        let data = res.data
        data.forEach((item, index) => {
          for (let p in item) {
            this.dutyTypeData.push({
              id: p,
              name: item[p]
            })
          }
        })
      })
    }
  },
  watch: {
    'addFormData.shiftTime': {
      handler (val) {
        let time = 0
        // debugger
        for (let i = 0; i < val.length; i++) {
          const sTime = val[i].beginDate
          const eTime = val[i].endDate

          if (sTime && eTime) {
            let dsTime = ''
            let deTime = ''

            dsTime = moment().format('YYYY-MM-DD') + ' ' + sTime
            deTime = moment().format('YYYY-MM-DD') + ' ' + eTime

            const v = moment(deTime).diff(moment(dsTime))
            // 第二个时间比第一个小，第二个算明天的
            if (v <= 0) {
              deTime = moment().add(1, 'day').format('YYYY-MM-DD') + ' ' + eTime
            }

            time += moment(deTime).diff(moment(dsTime), 'minute')
          }
        }
        this.addFormData.workHours = (Math.abs(time) / 60).toFixed(2)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/hsms/css/self_common";

  /deep/ .el-input__inner {
    /*width: 300px;*/
    height: 34px;
  }

  .smallInput {
    width: 150px;
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
