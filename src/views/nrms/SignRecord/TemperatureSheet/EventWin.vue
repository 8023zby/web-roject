<template>
  <div class="event_container">
    <el-form ref="event_form" :rules="event_form_rule" :model="event_form" label-width="92px" v-uni="'tizhengjilutiwendan_linchuangshijian_form'">
      <el-row>
        <el-col :span="15">
          <el-form-item label="日期:" prop="eventTime" >
            <el-date-picker
                    v-uni="'tizhengjilutiwendan_linchuangshijian_date'"
              v-model="event_form.eventTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              :clearable="false"
            style="width: 212px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" class="saveAndReset">
          <el-button type="primary" size="small" @click="saveEvent" v-uni="'tizhengjilutiwendan_linchuangshijian_save'">保存</el-button>
          <el-button type="text" size="small" @click="resetEventForm" style="margin-left: 26px;" v-uni="'tizhengjilutiwendan_linchuangshijian_reset'">重置</el-button>
        </el-col>
      </el-row>
      <el-form-item label="事件:" prop="eventType">
        <el-select
                v-uni="'tizhengjilutiwendan_linchuangshijian_shijianselect'"
          v-model="event_form.eventType"
          placeholder=""
          style="width: 360px;"
          clearable
          :filterable="eventFieldType === 1"
          :allow-create="eventFieldType === 1"
        >
          <el-option v-for="item in events" :key="item.name" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:" prop="eventRemark" class="event">
        <el-input v-model="event_form.eventId" style="display: none"/>
        <el-input v-uni="'tizhengjilutiwendan_linchuangshijian_remark'" type="textarea" placeholder="请输入" v-model="event_form.eventRemark" style="width: 360px;min-width: 70px;" maxlength="100"
                   show-word-limit/>
      </el-form-item>
    </el-form>

    <el-table
      highlight-current-row
      :data="event_list"
      height="270px"
      class="event_table"
    >
      <el-table-column
        label="日期"
        prop="eventTime"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{formatDate(scope.row.eventTime)}}<br>{{formatTime(scope.row.eventTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="事件"
        prop="eventType"
        min-width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        label="备注"
        prop="eventRemark"
        min-width="80"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <!-- his来的不能编辑删除 -->
          <el-button v-uni:[scope.row.eventId]="'tizhengjilutiwendan_linchuangshijian_edit'" @click="editEvent(scope.row)" type="text" :disabled="scope.row.fromHis == 1"
          >编辑
          </el-button>
          <el-button
                  v-uni:[scope.row.eventId]="'tizhengjilutiwendan_linchuangshijian_delete'"
            type="textred"
            :disabled="scope.row.fromHis == 1"
            @click="deleteEvent(scope.row, scope.$index)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ApiTempEvent, ApiEventManage } from '../../../../api/nrms/index'
import moment from 'moment'

export default {
  name: 'event_win',
  props: ['patient', 'formId'],
  data () {
    return {
      event_form: {
        patientId: '',
        eventId: '',
        eventTime: moment().format('YYYY-MM-DD HH:mm'),
        eventType: '',
        eventRemark: ''
      },
      event_form_rule: {
        // eventTime: [
        //   { required: true, message: '请选择日期时间', trigger: 'blur' }
        // ],
        eventType: [
          { required: true, message: '请输入或选择事件', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            // 可手输时验证内容长度
            if (this.eventFieldType === 1 && this.eventFieldLength && value.length > this.eventFieldLength) {
              callback(new Error('最多' + this.eventFieldLength + '字符！'))
            } else {
              callback()
            }
          },
          trigger: 'blur' }
        ]
      },
      eventFieldType: 0,
      eventFieldLength: 0,
      events: [],
      event_list: [],
      search_from: {
        deptId: '',
        patientId: ''
      }
    }
  },
  created () {
    // 初始化
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.search_from.deptId = deptInfo.deptId

    this.getEvents()
    this.getEventData()
  },
  methods: {
    getEvents () {
      ApiEventManage.select({ formId: this.formId })
        .then(res => {
          const { fieldType = 0, handWriteLength = 0, extendSetting = [] } = res.data || {}
          this.eventFieldType = fieldType
          this.eventFieldLength = handWriteLength
          this.events = extendSetting
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    getEventData () {
      this.loading = true
      this.search_from.patientId = this.patient.patientId
      ApiTempEvent.select(this.search_from)
        .then(res => {
          this.event_list = res.data
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    editEvent (data) {
      Object.assign(this.event_form, data)
    },
    // 获取当前秒数
    getCurrentSecond (time) {
      let s = moment().seconds()
      if (s >= 0 && s <= 9) {
        s = '0' + s
      }
      time = time.substr(0, 16) + ':' + s
      return time
    },
    saveEvent () {
      let _time = this.getCurrentSecond(this.event_form.eventTime)
      this.$refs.event_form.validate((valid) => {
        if (valid) {
          this.event_form.patientId = this.patient.patientId
          this.event_form.eventTime = _time
          ApiTempEvent.save(this.event_form)
            .then(() => {
              this.$message.success('保存成功！')
              this.resetEventForm()
              this.getEventData()
              this.$emit('reset')
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
    deleteEvent (row, index) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiTempEvent.delete({ recordId: row.eventId })
          .then(() => {
            this.$message.success('删除成功！')
            this.event_list.splice(index, 1)
            this.$emit('reset')
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    resetEventForm () {
      this.event_form.eventId = ''
      this.$refs.event_form.resetFields()
      this.event_form.eventTime = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    formatDate (dateTime) {
      return moment(dateTime).format('YYYY-MM-DD')
    },
    formatTime (dateTime) {
      return moment(dateTime).format('HH:mm')
    }
  },
  watch: {
    'patient' () {
      this.getEventData()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .event_container {
    width: 100%;
    padding: 5px 0 0 0;
    /deep/.el-input--small,/deep/.el-button--mini, .el-button--small,/deep/.el-table .cell{
      font-size: 14px;
    }
    .saveAndReset{
      line-height: 46px;
      padding-left: 19px;
      /deep/.el-button--primary{
        width: 70px;
        height: 40px;
      }
    }
  }
  /* 表格-表头样式 */
  /deep/ .el-table{
    padding-top: 12px;
  }
  /deep/ .el-table th {
    background-color: #f7f7f7;
    color: #333333;
    font-size: 16px;
    font-weight: normal;
    border-top: 1px solid #E4E7ED;
    border-bottom: 1px solid #E4E7ED;
    padding: 12px 0;
    > .cell {
      color: initial;
    }
  }

  .event {
    /deep/ .el-form-item__label {
      line-height: 32px;
      height: 32px;
    }
  }
</style>
