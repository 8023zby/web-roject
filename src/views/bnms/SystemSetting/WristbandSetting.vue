<template>
  <div class="container">
    <div class="bnms_add_form">
      <el-row>
        <el-col :span="15">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px">
            <el-form-item label="腕带二维码包含信息设置:" prop="wristbandValue">
              <template v-for="(item) in config.wrist_band_value">
                <el-checkbox
                  :key="item.key"
                  v-if="item.key==='patient_id'"
                  v-model="obj_item[item.key]"
                  :true-label="item.value" false-label="" disabled >{{item.value}}
                </el-checkbox>
                <el-checkbox
                  v-else
                  :key="item.key"
                  v-model="obj_item[item.key]"
                  :true-label="item.value" false-label="">{{item.value}}
                </el-checkbox>
              </template>

            </el-form-item>
            <el-form-item label="信息分隔符号:">
              <el-select v-model="ruleForm.wristbandInterval" placeholder="请选择">
                <el-option value="|">|</el-option>
                <el-option value="~">~</el-option>
                <el-option value="@">@</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="腕带二维码信息:">
              <div :title="ruleForm.wristbandRule" class="wristbandRule">{{ruleForm.wristbandRule}}</div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!--<div>-->
        <!--<el-button type="primary" @click="onSubmit" class="btn">保存</el-button>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import { wrist_band_value } from '../../../assets/bnms/js/item_config'
import { ApiWristbandSetting } from '../../../api/bnms'

export default {
  name: 'WristbandSetting',
  created () {
    this.getData()
  },
  data () {
    return {
      config: { wrist_band_value },
      obj_item: {},
      ruleForm: {
        wristbandId: '',
        wristbandValue: '',
        wristbandInterval: '|',
        wristbandRule: ''
      },
      rules: {
        wristbandValue: [
          { required: true, message: '请至少选择1项信息', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      await ApiWristbandSetting.save(this.ruleForm)
        .then(() => {
          // this.$message.success('保存成功！')
          // this.getData()
        })
        .catch(() => {
          this.$message.error('腕带设置设置异常！')
        })
    },
    getData () {
      ApiWristbandSetting.select()
        .then(res => {
          if (res.data != null) {
            if (res.data.wristbandId != '') {
              // 编辑
              let strArr = res.data.wristbandValue.split(',')
              let obj_item = {}
              for (let i = 0; i < strArr.length; i++) {
                for (let j = 0; j < this.config.wrist_band_value.length; j++) {
                  let _d = this.config.wrist_band_value[j]
                  if (strArr[i] === _d['key']) {
                    obj_item[strArr[i]] = _d['value']
                    break
                  }
                }
              }
              this.obj_item = obj_item
              this.ruleForm = res.data
            } else {
              this.obj_item = {}
            }
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    }
  },
  watch: {
    obj_item: {
      handler (objItem) {
        let objArrValue = []
        let objArrRule = []
        for (let i = 0; i < this.config.wrist_band_value.length; i++) {
          let _d = this.config.wrist_band_value[i]
          if (objItem[_d['key']]) {
            objArrValue.push(_d['key'])
            objArrRule.push(_d['value'])
          }
        }
        this.ruleForm.wristbandValue = objArrValue.join(',')
        this.ruleForm.wristbandRule = objArrRule.join(this.ruleForm.wristbandInterval)
      },
      deep: true
    },
    'ruleForm.wristbandInterval' (val) {
      let objArrValue = []
      let objArrRule = []
      for (let i = 0; i < this.config.wrist_band_value.length; i++) {
        let _d = this.config.wrist_band_value[i]
        if (this.obj_item[_d['key']]) {
          objArrValue.push(_d['key'])
          objArrRule.push(_d['value'])
        }
      }
      this.ruleForm.wristbandRule = objArrRule.join(val)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .el-col {
    margin-top: 20px;
  }
  /deep/ .el-form-item > label{
    color:#666;
  }
  /deep/ .el-form-item div label , /deep/ .el-form-item div {
    color:#333 ;
  }
.wristbandRule{
  height: 64px;
  background-color: #f5f5f5;
  padding: 0px 5px;
}
  .el-checkbox-group label {
    width: 75px;
    display: inline-block;
  }

  .el-form .el-form-item {
    margin-bottom: 28px;
  }

  .btn{
        display: block;
        margin:0 auto;
  }
  /deep/ .el-input {
    width: 600px;
  }
</style>
