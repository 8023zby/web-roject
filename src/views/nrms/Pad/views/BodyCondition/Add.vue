<template>
  <div v-loading="loading" class="container">
    <el-form label-width="60px" class="form_top">
      <el-row>
        <el-col :span="6" :offset="1">
          <el-form-item label="日期">
            <el-date-picker
              v-model="sign_form.recordDate"
              prefix-icon="el-icon-date"
              type="datetime"
              popper-class="pad_datetime_el-date-picker"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
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
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" @click="relationSHDeviceData">
            获取手环数据
          </el-button>
          <el-button type="success" @click="relationDeviceData">
            体征设备
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-form ref="sign_form" :model="sign_form" label-width="130px">
      <!-- 表单项 循环体征项 先固定 后动态  -->
      <el-row>
        <el-col :span="20" :offset="2" class="form_wrapper">
          <el-row>
            <template v-for="(item, index) in sign_item">
              <el-col :span="9">
                <el-form-item
                  :label="item.signItemShowName"
                  :prop="'extendList.'+ index + '.applyValue'"
                  :rules="getRules(item.signFieldName)"
                >
                  <div v-if="item.signSummaryType !== 1">{{sign_form.extendList[index]['applyValue'] || '&nbsp;'}}</div>
                  <template v-else>
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
              <el-col :span="3">
                <div>{{item.signItemUnit || '&nbsp;'}}</div>
              </el-col>
              <!-- 体温 -->
              <template v-if="item.signFieldName === 'tiwen'">
                <el-col :span="9">
                  <el-form-item label="测量方式">
                    <el-radio-group v-model="sign_form.extendList[index].itemValueType">
                      <el-radio label="yw">腋温</el-radio>
                      <el-radio label="kw">口温</el-radio>
                      <el-radio label="gw">肛温</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <div>&nbsp;</div>
                </el-col>
              </template>

              <template v-if="item.signFieldName === 'tiwen'">
                <el-col :span="9">
                  <el-form-item label="复测体温" :prop="'extendList.'+ index + '.phValue'" :rules="getRules('fctw')">
                    <el-input
                      v-model="sign_form.extendList[index]['phValue']"
                      @input="sign_form_change"
                      :disabled="sign_form.extendList[index]['applyValue']=='拒测' || sign_form.extendList[index]['applyValue']=='外出' || sign_form.extendList[index]['applyValue']=='不升'"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <div>{{item.signItemUnit || '&nbsp;'}}</div>
                </el-col>
              </template>
              <!-- 复测 -->
              <template v-if="item.signFieldName === 'tengtongdengji'">
                <el-col :span="9">
                  <el-form-item label="复测疼痛">
                    <el-select
                      v-if="item.dropdownConfig"
                      v-model="sign_form.extendList[index]['phValue']"
                      @change="sign_form_change"
                      filterable
                      allow-create
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
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <div>{{item.signItemUnit || '&nbsp;'}}</div>
                </el-col>
              </template>
              <!-- 舒张压 -->
              <template v-if="item.signFieldName === 'shuzhangya'">
                <el-col :span="9">
                  <el-form-item label="测量位置">
                    <el-select
                      @change="sign_form_change"
                      v-model="sign_form.extendList[index]['itemValueType']"
                      placeholder="">
                      <el-option value="上肢" label="上肢"></el-option>
                      <el-option value="下肢" label="下肢"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <div>&nbsp;</div>
                </el-col>
              </template>
            </template>
          </el-row>
          <!-- 血糖/手环 -->
          <template v-for="n in 3">
            <el-row>
              <el-col :span="9">
                <el-form-item v-if="extendItem.blood_sugar[n - 1]" :label="extendItem.blood_sugar[n - 1].title">
                  <el-select
                    v-if="extendItem.blood_sugar[n - 1].code == 'measurePeriod'"
                    v-model="sign_form.glucometerInfo[extendItem.blood_sugar[n - 1].code]"
                    @change="sign_form_change"
                    placeholder="">
                    <el-option value="" label=""></el-option>
                    <el-option
                      v-for="(title, code) in bloodSugarTime"
                      :key="code"
                      :value="code"
                      :label="title"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    v-else
                    v-model="sign_form.glucometerInfo[extendItem.blood_sugar[n - 1].code]"
                    @input="sign_form_change"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <div>&nbsp;</div>
              </el-col>
              <el-col :span="9">
                <el-form-item v-if="extendItem.bracelet[n - 1]" :label="extendItem.bracelet[n - 1].title">
                  <el-input
                    v-model="sign_form.braceletRecordInfo[extendItem.bracelet[n - 1].code]"
                    @input="sign_form_change"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <div>&nbsp;</div>
              </el-col>
            </el-row>
          </template>
        </el-col>
        <el-col :span="24" class="form_btns">
          <el-button type="" @click="goBack">
            取消
          </el-button>
          <el-button type="primary" @click="sign_save">保存</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      title="体征设备"
      :visible.sync="showDeviceWinVisible"
      :show-close="false"
      center
      width="500px">
      <el-form label-width="100px">
        <el-row>
          <template v-if="deviceData.type == 0">
            <el-col :span="18">
              <el-form-item label="体温">
                <el-input :value="deviceData.value" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div style="line-height: 35px">&nbsp;°C</div>
            </el-col>
          </template>
          <template v-else-if="deviceData.type == 1">
            <el-col :span="18">
              <el-form-item label="脉搏">
                <el-input :value="deviceData.pulse" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div style="line-height: 35px">&nbsp;</div>
            </el-col>
            <el-col :span="18">
              <el-form-item label="收缩压">
                <el-input :value="deviceData.highPressure" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div style="line-height: 35px">&nbsp;mmHg</div>
            </el-col>
            <el-col :span="18">
              <el-form-item label="舒张压">
                <el-input :value="deviceData.lowPressure" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div style="line-height: 35px">&nbsp;mmHg</div>
            </el-col>
          </template>
          <template v-else-if="deviceData.type == 2">
            <el-col :span="18">
              <el-form-item label="血糖">
                <el-input :value="deviceData.value" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div style="line-height: 35px">&nbsp;mmol/L</div>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDeviceWinVisible = false">取消</el-button>
        <el-button type="warning" @click="initDeviceData">导 入</el-button>
      </span>
    </el-dialog>


    <el-dialog
      title="手环设备"
      :visible.sync="showSHDeviceWinVisible"
      :show-close="false"
      center
      width="500px">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="18">
            <el-form-item label="消耗能量">
              <el-input :value="shDeviceData.energyConsumption" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div style="line-height: 35px">&nbsp;</div>
          </el-col>
          <el-col :span="18">
            <el-form-item label="步数">
              <el-input :value="shDeviceData.stepNumber" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div style="line-height: 35px">&nbsp;</div>
          </el-col>
          <el-col :span="18">
            <el-form-item label="走动距离">
              <el-input :value="shDeviceData.walkingDistance" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div style="line-height: 35px">&nbsp;</div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSHDeviceWinVisible = false">取消</el-button>
        <el-button type="warning" @click="initSHDeviceData">导入</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { ApiSignItemSetting, ApiBodyCondition } from '../../../../../api/nrms'
  import { extendItem, bloodSugarTime } from './extendItem'
  import moment from 'moment'

  export default {
    name: 'body_condition_add',
    props: ['patient', 'codId'],
    data () {
      return {
        loading: false,
        hours: [],
        sign_item: [],
        extendItem,
        bloodSugarTime,
        detailData: null,
        //表单保存时用的结构体
        sign_form: {
          codId: '',
          deptId: '',
          orgId: '',
          patientId: '',
          recordDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          itemHour: '',
          itemType: '',
          extendList: [],
          glucometerInfo: {},
          braceletRecordInfo: {}
        },
        sign_form_search: {},
        empInfo: {},
        // 设备相关
        showSHDeviceWinVisible: false,
        showDeviceWinVisible: false,
        deviceData: {},
        shDeviceData: []
      }
    },
    created () {
      this.sign_form.patientId = this.patient ? (this.patient.patientId || '') : ''
      this.sign_form.orgId = this.patient.orgId
      this.sign_form.deptId = this.patient.deptId

      this.sign_form.codId = this.codId || ''

      this.getData()
    },
    mounted () {
      // 交给安卓使用
      window.nrmsInitDeviceTZData = this.showDeviceDataWin
      window.nrmsInitDeviceSHData = this.showSHDeviceDataWin
    },
    methods: {
      async getData () {
        this.loading = true
        await this.getHours()
        await this.getSignItemData()
        this.loading = false
      },
      async getHours () {
        await ApiSignItemSetting.selectTimeApp({orgId: this.patient.orgId, deptId: this.patient.deptId})
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
        let _this = this
        ApiSignItemSetting.selectItemApp({orgId: this.patient.orgId, deptId: this.patient.deptId, isTemperatureDisplay: 1 })
          .then(res => {
            _this.sign_item = res.data || []
            for (let i = 0; i < _this.sign_item.length; i++) {
              let _d = _this.sign_item[i]

              let obj = {
                signSummaryType: _d['signSummaryType'],
                signId: _d['signId'],
                applyId: _d['signApplyId'],
                applyValue: '',
                phValue: '',
                itemValueType: _d['signFieldName'] === 'tiwen' ? 'yw' : '',
                itemCode: _d['signFieldName']
              }
              _this.sign_form.extendList.push(obj)
            }

            for (let i = 0; i < _this.extendItem.blood_sugar.length; i++) {
              let _d = _this.extendItem.blood_sugar[i]
              _this.$set(this.sign_form.glucometerInfo, _d['code'], '')
              this.sign_form.glucometerInfo.nurseName = this.empInfo['empName'] || ''
            }
            for (let i = 0; i < _this.extendItem.blood_sugar.length; i++) {
              let _d = _this.extendItem.bracelet[i]
              _this.$set(this.sign_form.braceletRecordInfo, _d['code'], '')
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
            ApiBodyCondition.saveApp(form_data)
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
        ApiBodyCondition.selectByHour({
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

      //交互安卓-体征设备数据弹窗
      relationDeviceData () {
        //此方法名待定
        if (window.sign && window.sign.getSignData) {
          this.loading = true
          window.sign.getSignData()
        }
      },
      relationSHDeviceData () {
        //此方法名待定
        if (window.wristband && window.wristband.getWistbandData) {
          this.loading = true
          window.wristband.getWistbandData()
        }
      },
      // 显示弹窗
      showDeviceDataWin (data) {
        data = data || {}
        this.deviceData = data
        this.showDeviceWinVisible = true
        this.loading = false
      },
      // 显示弹窗
      showSHDeviceDataWin (data) {
        data = data || [];

        // let data = [{
        //   'signName': '消耗能量',
        //   'signValue': '12'
        // }, {
        //   'signName': '步数',
        //   'signValue': '6'
        // }, {
        //   'signName': '距离',
        //   'signValue': '7'
        // }]

        let _data = {}
        for (let i = 0; i < data.length; i++) {
          let _d = data[i]
          if (_d['signName'] == '消耗能量') {
            _data['energyConsumption'] = _d['signValue']
          }
          if (_d['signName'] == '步数') {
            _data['stepNumber'] = _d['signValue']
          }
          if (_d['signName'] == '距离') {
            _data['walkingDistance'] = _d['signValue']
          }
          // if(_d['signName'] == '心率'){
          //   _data['walkingDistance'] = _d['signValue']
          // }
        }

        this.shDeviceData = _data
        this.showSHDeviceWinVisible = true
        this.loading = false
      },
      //初始化体温
      initDeviceData () {
        if (this.deviceData.type === 0 || this.deviceData.type === 1) {
          for (let i = 0; i < this.sign_form.extendList.length; i++) {
            let _d = this.sign_form.extendList[i]
            if (_d['itemCode'] == 'tiwen') {
              _d['applyValue'] = '' + this.deviceData.value
            }
            if (_d['itemCode'] == 'shousuoya') {
              _d['applyValue'] = '' + this.deviceData.highPressure
            }
            if (_d['itemCode'] == 'shuzhangya') {
              _d['applyValue'] = '' + this.deviceData.lowPressure
            }
            if (_d['itemCode'] == 'maibo') {
              _d['applyValue'] = '' + this.deviceData.pulse
            }
          }
        }
        // 血糖测量结果
        if (this.deviceData.type === 2) {
          this.sign_form.glucometerInfo.measureResult = '' + this.deviceData.value
        }
        this.showDeviceWinVisible = false
      },
      //初始化手环
      initSHDeviceData () {
        for (let p in this.shDeviceData) {
          this.sign_form.braceletRecordInfo[p] = this.shDeviceData[p]
        }

        this.showSHDeviceWinVisible = false
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
      },
      goBack () {
        this.$emit('option-changed', 'list')
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
      },
      'sign_form.extendList': {
        handler (obj) {
          for (let i = 0; i < obj.length; i++) {
            let _d = obj[i]
            if (_d['itemCode'] === 'tiwen' && (_d['applyValue'] === '拒测' || _d['applyValue'] === '外出' || _d['applyValue'] === '不升')) {
              _d['phValue'] = ''
              break
            }
          }
        },
        immediate: true,
        deep: true
      },
      'patient' (val) {
        this.sign_form.patientId = val.patientId
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    height: 100%;
    padding-top: 30px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    overflow: auto;
    padding-bottom: 100px;
    color: #606266;

    @import '../../../../../assets/nrms/pad/css/form';
    @import '../../../../../assets/nrms/pad/css/dialog';
  }

  .container /deep/ .el-form-item__label {
    height: 33px;
  }

  .form_top {
    padding-top: 20px;

    /deep/ .el-button--primary {
      background-color: #5281EB;
    }

    /deep/ .el-button--success {
      background-color: #00AAFF;
    }
  }

  .form_wrapper {
    background-color: #FAFBFF;
    border-radius: 10px;
    padding: 2%;
    color: #606266;
  }

  .form_btns {
    text-align: center;

    /deep/ .el-button {
      padding-left: 5%;
      padding-right: 5%;
      margin: 20px 5%;
    }

    /deep/ .el-button--primary {
      background-color: #fff !important;
      color: #1e87f0 !important;
      border-color: #1e87f0 !important;
    }
  }
</style>
<style lang="scss" type="text/scss">
  @import "../../../../../assets/nrms/pad/css/datetime";
</style>
