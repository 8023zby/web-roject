<template>
  <layout v-loading="loading">
    <div slot="title">测量时间设置</div>
    <div slot="main" class="add-from form-main-center">
      <el-form :rules="rules" ref="ruleForm" :model="timeForm" label-suffix=":" :inline="true">
        <template v-for="n in temperatureTime[detail.formRelationStyle]">
          <div class="title" :key="n + 'title'">测量时间{{n}}</div>
          <div class="box" :key="n">
            <el-form-item label="测量时间" :prop="'timeData.'+ (n-1) +'.measuringTime'"
                          :rules="[{ required: true, message: '请输入测量时间！', trigger: 'blur' }]"
            >
              <el-select
                v-model="timeForm.timeData[n-1].measuringTime"
                placeholder=""
                clearable
              >
                <el-option
                  v-for="value in 24"
                  :key="value"
                  :label="(value > 9 ? value : '0' + value) +':00'"
                  :value="value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="颜色" :prop="'timeData.'+ (n-1) +'.markingColor'">
              <el-color-picker
                v-model="timeForm.timeData[n-1].markingColor"
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-form-item>
            <el-form-item label="所属时间段" :prop="'timeData.'+ (n-1) +'.type'">
              <el-radio-group v-model="timeForm.timeData[n-1].type">
                <el-radio :label="1">上午</el-radio>
                <el-radio :label="2">下午</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </template>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button size="small" @click="close()">
        取消
      </el-button>
      <el-button type="primary" size="small" @click="submitForm">
        保存
      </el-button>

    </div>
  </layout>
</template>

<script>
import layout from '../../../components/nrms/layout/edit'
import { ApiSignItemSetting } from '../../../api/nrms/index'
import { temperatureTime } from './temperatureConfig'

export default {
  name: 'TimeSetting',
  props: ['detail'],
  components: { layout },
  data () {
    return {
      loading: false,
      // 每种体温单测量时间个数由前端固定
      temperatureTime,
      predefineColors: [
        '#000000',
        '#FF0000',
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ],
      timeForm: {
        timeData: []
      },
      rules: {}
    }
  },
  created () {
    // 初始化
    for (let i = 0; i < this.temperatureTime[this.detail.formRelationStyle]; i++) {
      this.timeForm.timeData.push({
        formId: this.detail.formId,
        measuringTime: '',
        markingColor: '#000',
        type: 1
      })
    }
    this.getTimeItem()
  },
  methods: {
    getTimeItem () {
      this.loading = true
      ApiSignItemSetting.temperatureMeasureTime({ formId: this.detail.formId })
        .then(res => {
          let data = res.data || []
          for (let i = 0; i < data.length; i++) {
            let _d = data[i]
            _d.markingColor = _d.markingColor || '#000'
            this.timeForm.timeData.splice(i, 1, _d)
          }
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    submitForm () {
      this.loading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.timeForm.timeData = this.timeForm.timeData.splice(0, this.temperatureTime[this.detail.formRelationStyle])
          let MeasureTimeArr = []
          this.timeForm.timeData.forEach(item => {
            let measureTime = item.measuringTime
            MeasureTimeArr.push(measureTime)
          })
          if (new Set(MeasureTimeArr).size !== MeasureTimeArr.length) {
            this.$message({
              message: '请勿选择重复的测量时间！',
              type: 'warning'
            })
            this.loading = false
            return
          }
          ApiSignItemSetting.temperatureMeasureSave(this.timeForm.timeData)
            .then(res => {
              this.$message.success('保存成功')
            })
            .catch(res => {
              this.$message.error(res.message)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          this.loading = false

          return false
        }
      })
    },
    // 重置表单 & 关闭窗体
    close () {
      this.$emit('changed', 'list')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .form-main-center {
    max-width: 800px;
    color: #666;

    .title {
      padding: 30px 0 12px;

      &:first-child {
        padding-top: 0;
      }
    }

    .box {
      padding: 10px 11px 0;
      border: 1px solid #EBEEF5;
      border-radius: 2px;
      display: flex;
      justify-content: flex-start;
    }
  }

  .add-from {
    .el-form-item {
      margin-bottom: 18px;
    }
  }
</style>
