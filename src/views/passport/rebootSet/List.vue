<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">终端重启设置</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 600px;">
        <el-form :rules="rules" ref="addFormData" class="from" label-width="130px" :model="addFormData">
          <el-form-item label="间隔天数：" prop="periodDays">
            <el-input style="width: 100px" v-model="addFormData.periodDays" clearable></el-input>&nbsp;天
          </el-form-item>
          <el-form-item label="重启时间段：" prop="time">
            <el-time-picker is-range value-format="HH:mm" v-model="addFormData.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择重启时间段">
            </el-time-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button type="primary" @click="onSubmit()" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http'
import { ResultMsg } from '../../../assets/passport/js/Message'
export default {
  data () {
    let validateDay = (rule, value, callback) => {
      let reg = /(^[1-9]\d*$)/
      if (!reg.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      addVis: false,
      addFormData: {
        periodDays: '',
        beginTime: '',
        endTime: '',
        time: ''
      },
      modelName: '终端重启设置',
      rules: {
        periodDays: [
          { required: true, message: '请设置间隔天数', trigger: 'blur' },
          { validator: validateDay, trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择重启时间段', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getSetData()
  },
  methods: {
    // 保存设置
    onSubmit () {
      this.$refs['addFormData'].validate((valid) => {
        if (valid) {
          let obj = { ...this.addFormData }
          obj.beginTime = this.addFormData.time[0]
          obj.endTime = this.addFormData.time[1]
          delete obj.time
          let methodType = 'POST'
          AxiosJsonApi(
            '/tams/terminal-dispatch/period/set-period-time',
            obj,
            methodType
          ).then((res) => {
            ResultMsg(res, this.modelName, this.getSetData)
            if (res.status !== 200) {
              this.addVis = false
            }
          })
        }
      })
    },
    // 获取数据
    getSetData () {
      this.loading = true
      AxiosApi(
        '/tams/terminal-dispatch/period/get-period-time',
        {},
        'GET'
      ).then((res) => {
        this.loading = false
        if (res.status === 200) {
          let data = res.data
          this.addFormData = { ...this.addFormData, ...data }
          this.addFormData.time = [
            this.addFormData.beginTime,
            this.addFormData.endTime
          ]
        }
      })
    }
  }
}
</script>
