<template>
  <div v-loading="loading" class="container">
    <el-form ref="sign_form" :model="sign_form" label-width="150px">
      <el-row class="date_time">
        <el-col :span="8" :offset="7">
          <el-form-item label="日期">
            <el-date-picker
              v-model="sign_form.recordDate"
              prefix-icon="el-icon-date"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              popper-class="pad_datetime_el-date-picker"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="date_time" style="margin-bottom: 30px">
        <el-col :span="8" :offset="7">
          <el-form-item label="时刻">
            <el-select
              v-model="sign_form.itemHour"
              @change="hour_change"
              placeholder="">
              <el-option
                v-for="h in hours"
                :key="h.temperatureConfigId"
                :label="h.takeTemperatureTime + ''"
                :value="h.takeTemperatureTime + ''"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 表单项 循环体征项 先固定 后动态  -->
      <template v-for="(item, index) in sign_item">
        <el-row class="fix_item">
          <el-col :span="12" :offset="5">
            <el-form-item
              :label="item.signItemShowName"
              :prop="'extendList.'+ index + '.applyValue'"
              :rules="getRules(item.signFieldName)"
            >
              <!--<span v-if="item.signSummaryType !== 1">{{sign_form.extendList[index]['applyValue']}}</span>-->
              <template>
                <el-select
                  v-if="item.dropdownConfig"
                  v-model="sign_form.extendList[index]['applyValue']"
                  filterable
                  allow-create
                  @change="sign_form_change"
                  placeholder="">
                  <el-option value="" label=""></el-option>
                  <el-option
                    v-for="option in item.dropdownConfig"
                    :key="option"
                    :value="option"
                    :label="option"
                  >
                  </el-option>
                </el-select>
                <el-input v-else v-model="sign_form.extendList[index]['applyValue']" @input="sign_form_change"/>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <div>{{item.signItemUnit || '&nbsp;'}}</div>
          </el-col>
        </el-row>
      </template>

      <el-row>
        <el-col  style="text-align: center">
          <el-button type="primary" @click="sign_save">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { ApiSignItemSetting, ApiTemperatureSheet } from '../../../../../api/nrms'
  import moment from 'moment'

  export default {
    name: 'sign_input',
    props: ['patient'],
    data () {
      return {
        loading: false,
        hours: [],
        sign_item: [],
        //表单保存时用的结构体
        sign_form: {
          orgId: '',
          deptId: '',
          patientId: '',
          recordDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          itemHour: '',
          itemType: '',
          extendList: []
        },
        sign_form_search: {}
      }
    },
    created () {
      this.sign_form.patientId = this.patient ? (this.patient.patientId || '') : ''
      this.sign_form.orgId = this.patient.orgId
      this.sign_form.deptId = this.patient.deptId

      this.getData()
    },
    methods: {
      async getData () {
        this.loading = true
        await this.getHours()
        await this.getSignItemData()
        this.loading = false
      },
      async getHours () {
        ApiSignItemSetting.selectTimeApp({orgId: this.patient.orgId, deptId: this.patient.deptId})
          .then(res => {
            this.hours = res.data || []
            this.sign_form.itemHour = res.data ? res.data[0].takeTemperatureTime + '' : ''
            this.sign_form.itemType = res.data ? res.data[0].temperatureItemType : ''
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },
      async getSignItemData () {
        ApiSignItemSetting.selectItemApp({orgId: this.patient.orgId, deptId: this.patient.deptId, isSignDisplay: 1 })
          .then(res => {
            this.sign_item = res.data || []
            for (let i = 0; i < this.sign_item.length; i++) {
              let _d = this.sign_item[i]

              let obj = {
                signSummaryType: _d['signSummaryType'],
                signId: _d['signId'],
                applyId: _d['signApplyId'],
                applyValue: '',
                phValue: '',
                itemValueType: _d['signFieldName'] === 'tiwen' ? 'yw' : '',
                itemCode: _d['signFieldName']
              }
              // this.$set(this.sign_form.extendList, _d['signFieldName'], obj);
              this.sign_form.extendList.push(obj)
            }
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },
      sign_save () {
        if (this.isPatientEmpty()) {
          return false
        }
        this.$refs.sign_form.validate((valid) => {
          if (valid) {
            let form_data = { ...this.sign_form }
            form_data.itemHour = +form_data.itemHour
            //过滤汇总项
            form_data.extendList = form_data.extendList.filter(v => {
              return v.signSummaryType === 1
            })
            ApiTemperatureSheet.saveSignDataApp(form_data)
              .then(() => {
                this.$message.success('保存正确！')
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
      //获取当前时间点的数据
      hour_change (tab) {
        if (!this.sign_form_change_flag) {
          this.sign_form_change_flag = false
          this.getFormDataByHour()
        } else {
          this.$confirm('是否保存当前编辑的数据?', '提示', {
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.sign_save()
            this.sign_form_change_flag = false
          }).catch(() => {
            this.getFormDataByHour()
            this.sign_form_change_flag = false
          })
        }
      },
      getFormDataByHour () {
        ApiTemperatureSheet.selectByHourApp({
          orgId: this.patient.orgId,
          deptId: this.patient.deptId,
          patientId: this.patient.patientId,
          recordDate: this.sign_form.recordDate,
          itemHour: this.sign_form.itemHour
        })
          .then((res) => {
            let resData = res.data.length > 0 ? res.data[0].data : []

            for (let x = 0; x < this.sign_form.extendList.length; x++) {
              let eitem = this.sign_form.extendList[x]
              //先置空
              eitem.applyValue = ''
              eitem.phValue = ''
              eitem.itemValueType = eitem.itemCode == 'tiwen' ? 'yw' : ''

              for (let y = 0; y < resData.length; y++) {
                let ritem = res.data[0].data[y]
                if (eitem.applyId === ritem.applyId) {
                  eitem.applyValue = ritem.applyValue
                  eitem.phValue = ritem.phValue
                  eitem.itemValueType = ritem.itemValueType
                }
              }
            }
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },
      getRules (fieldName) {
        let rule = {}
        switch (fieldName) {
          case 'tiwen':
          case 'fctw':
            rule = { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'change' }
            break
          case 'huxi':
          case 'tizhong':
            rule = { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'change' }
            break
          case 'maibo':
          case 'xinlv':
          case 'shousuoya':
          case 'shuzhangya':
          case '':
            rule = { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur' }
            break
          case 'dabiancishu':
            rule = { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
            break
        }
        return rule
      },
      sign_form_change () {
        this.sign_form_change_flag = true
      },
      isPatientEmpty () {
        if (!this.patient.patientId) {
          this.$message.warning('请先选择患者！')
          return true
        }
        return false
      }
    },
    watch: {
      'sign_form.itemHour' (val) {
        for (let i = 0; i < this.hours.length; i++) {
          let _d = this.hours[i]
          if (_d.takeTemperatureTime === +val) {
            this.sign_form.itemType = _d.temperatureItemType
            break
          }
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    height: 100%;
    padding-top: 50px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    position: relative;
    overflow: auto;
    color: #606266;

    @import '../../../../../assets/nrms/pad/css/form';
  }

  .fix_item {
    /deep/ .el-form-item__label {
      position: relative;
      &::before {
        content: "";
        border: 2px solid #00AAFF;
        border-radius: 50%;
        padding: 5px;
        position: absolute;
        left: 35px;
        top: 8px;
      }
    }
  }
</style>
<style lang="scss" type="text/scss">
  @import "../../../../../assets/nrms/pad/css/datetime";
</style>
