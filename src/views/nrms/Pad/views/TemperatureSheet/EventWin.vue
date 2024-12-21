<template>
  <div class="event_container">
    <el-form ref="event_form" :rules="event_form_rule" :model="event_form" label-width="80px">
      <el-row>
        <el-col :span="14">
          <el-form-item label="时间" prop="eventTime">
            <el-date-picker
              v-model="event_form.eventTime"
              prefix-icon="el-icon-date"
              type="datetime"
              popper-class="pad_datetime_el-date-picker"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-button type="primary" size="small" @click="saveEvent">保存</el-button>
          <el-button type="gray" size="small" @click="resetEventForm">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="事件" prop="eventType">
            <el-select
              v-model="event_form.eventType"
              placeholder="">
              <el-option value="" label=""></el-option>
              <el-option value="入院" label="入院"></el-option>
              <el-option value="分娩" label="分娩"></el-option>
              <el-option value="死亡" label="死亡"></el-option>
              <el-option value="手术" label="手术"></el-option>
              <el-option value="转科" label="转科"></el-option>
              <el-option value="出院" label="出院"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="eventRemark">
        <el-input v-model="event_form.eventId" style="display: none"/>
        <el-input v-model="event_form.eventRemark" style="width: 80%; max-width: initial"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { ApiTempEvent } from '../../../../../api/nrms'
  import moment from 'moment'

  export default {
    name: 'temperature_event_win',
    props: ['patient'],
    data () {
      return {
        event_form: {
          orgId: '',
          deptId: '',
          patientId: '',
          eventId: '',
          eventTime: moment().format('YYYY-MM-DD HH:MM:SS'),
          eventType: '',
          eventRemark: ''
        },
        event_form_rule: {
          eventTime: [
            { required: true, message: '请选择日期时间', trigger: 'blur' }
          ],
          eventType: [
            { required: true, message: '请选择事件', trigger: 'blur' }
          ]
        }
      }
    },
    created (){
      this.event_form.patientId = this.patient.patientId
      this.event_form.orgId = this.patient.orgId
      this.event_form.deptId = this.patient.deptId
    },
    methods: {
      saveEvent () {
        this.$refs.event_form.validate((valid) => {
          if (valid) {
            ApiTempEvent.insertApp(this.event_form)
              .then(() => {
                this.$message.success('保存成功！')
                this.resetEventForm()
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
      resetEventForm () {
        this.$refs.event_form.resetFields()
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .event_container {
    width: 500px;
    padding: 10px 0;
    color: #606266;

    @import '../../../../../assets/nrms/pad/css/form';

    /deep/ .el-button {
      border-radius: 5px !important;
    }
  }
</style>
<style lang="scss" type="text/scss">
  @import "../../../../../assets/nrms/pad/css/datetime";
</style>
