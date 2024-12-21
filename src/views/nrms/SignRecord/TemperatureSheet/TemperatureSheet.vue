<template comments>
  <div v-loading="loading" class="container" style="width: 100%">
    <!-- left -->
    <div class="sheet_container">
      <div class="buttons tool-bar">
        <el-button type="primary" size="small" @click="getSearchWeek('first')"
        >首周
        </el-button>
        <el-button type="primary" size="small" @click="getSearchWeek('prev')"
        >上一周
        </el-button>
        <el-button type="primary" size="small" @click="getSearchWeek('next')"
        >下一周
        </el-button>
        <el-button type="primary" size="small" @click="getSearchWeek('last')"
        >尾周
        </el-button>
        <el-button type="primary" size="small" @click="multiSave" :disabled="btn_disable"
        >批量录入
        </el-button>
        <el-button type="primary" size="small" @click="temperatureCharts"
        >体征趋势图
        </el-button>
        <el-button type="success" size="small" @click="printView"
        >打印
        </el-button>
        <el-button size="small" v-if="!btn_disable" class="sign_show_btn" @click="sign_show_hide">
          <i :class="sign_form_show_hide ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
        </el-button>
      </div>

      <div class="sheet">
        <!--startprint-->
        <TemperatureSheet :patient="patient" :sign_item="sign_item" :cur_week_date="cur_week_date"
        :cur_week_in="cur_week_in" :cur_week_ss="cur_week_ss" :hours="hours"
        :sheet_data="sheet_data" ref="temperatureSheet"/>
        <!--endprint-->
      </div>
    </div>

    <!-- right -->
    <div class="sign_form" id="sign_form" v-if="!btn_disable" :style="{width:sign_form_show_hide ? '437px' : 0}">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="8" :offset="16" class="tool-bar">
            <el-button type="primary" size="small" @click="showEventWin" style="float: right;margin-right: 20px;">临床事件</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: 33px;">
          <el-col :span="24">
            <el-form-item label="日期：">
              <el-date-picker
                :clearable="false"
                v-model="sign_form.recordDate"
                type="date"
                style="width: 300px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期时间"
              @change="dateChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 时间段 -->
        <el-tabs v-model="sign_form.itemHour" @tab-click="tabsHandleClick" class="right_tabs">
          <el-tab-pane :label="h.takeTemperatureTime + ''" :name="h.takeTemperatureTime + ''" v-for="h in hours"
                       :key="h.temperatureConfigId"></el-tab-pane>
        </el-tabs>
      </el-form>

      <el-form ref="sign_form" :model="sign_form" label-width="120px">
        <!-- 表单项 循环体征项 动态  -->
        <template v-for="(nItem, key) in sign_item">
          <!-- 体温与血糖与疼痛等级    v-if与v-else-if之间不能有注释行  否则会报错 -->
          <template v-if="nItem.signItemFieldName === 'tiwen'">
                <el-form-item :label="nItem.signItemShowName+'：'" :prop="'extendList.'+ key + '.signValue'">
                  <div class="sign_container">
                  <div class="sign_content">
                  <el-select
                    v-if="nItem.signItemSvgSetting"
                    v-model="sign_form.extendList[key]['signValue']"
                    @change="sign_form_change"
                    allow-create
                    filterable
                    placeholder="请输入或选择">
                    <el-option value="" label=""></el-option>
                    <el-option
                      v-for="(option,index) in nItem.signItemSvgSetting"
                      :key="index"
                      :value="option.settingItem"
                      :label="option.settingItem"
                    >
                    </el-option>
                  </el-select>
                  <el-input v-else v-model="sign_form.extendList[key]['signValue']" @input="sign_form_change"/>
                  </div>
                    <template v-if="nItem.signItemUnit">
                      <div class="sign_unit">{{nItem.signItemUnit}}</div>
                    </template>
                  </div>
                </el-form-item>
              <template v-for="(child, key1) in nItem.childrenSignItem">
                    <el-form-item v-if="child.signItemFieldName === 'tiwenceliangfangshi'" :label="child.signItemShowName+'：'"
                                :prop="'extendList.'+ key + '.itemValueType'">
                      <div class="sign_container">
                        <div class="sign_content">
                    <el-radio-group v-model="sign_form.extendList[key]['itemValueType']">
                      <el-radio
                        v-for="(option,index) in child.signItemSvgSetting"
                        :key="index"
                        :label="option.settingItem">{{option.settingItem}}</el-radio>
                    </el-radio-group>
                        </div>
                      </div>
                  </el-form-item>

                  <el-form-item v-if="child.signItemFieldName === 'fucetiwen'" :label="child.signItemShowName+'：'"
                                :prop="'extendList.'+ key + '.phValue'">
                    <div class="sign_container">
                      <div class="sign_content">
                    <el-input
                      :disabled="sign_form.extendList[key]['signValue']=='' || sign_form.extendList[key]['signValue']=='拒测' || sign_form.extendList[key]['signValue']=='外出' || sign_form.extendList[key]['signValue']=='不升'"
                      v-model="sign_form.extendList[key]['phValue']" @input="sign_form_change"/>
                      </div>
                      <template v-if="child.signItemUnit">
                        <div class="sign_unit">{{child.signItemUnit}}</div>
                      </template>
                    </div>
                  </el-form-item>
              </template>
          </template>
          <template v-else-if="nItem.signItemFieldName === 'xuetang'">
                <el-form-item :label="nItem.signItemShowName+'：'" :prop="'extendList.'+ key + '.signValue'">
                  <div class="sign_container">
                    <div class="sign_content">
                  <el-input v-model="sign_form.extendList[key]['signValue']" @input="sign_form_change"/>
                    </div>
                    <template v-if="nItem.signItemUnit">
                      <div class="sign_unit">{{nItem.signItemUnit}}</div>
                    </template>
                  </div>
                </el-form-item>
              <template v-for="(child, key1) in nItem.childrenSignItem">
                  <el-form-item v-if="child.signItemFieldName === 'celiangshike'" :label="child.signItemShowName+'：'"
                                :prop="'extendList.'+ key + '.itemValueType'">
                    <div class="sign_container">
                      <div class="sign_content">
                    <el-select
                      v-model="sign_form.extendList[key]['itemValueType']"
                      @change="sign_form_change"
                      clearable
                      :allow-create="child.signItemFieldType==='5'"
                      :filterable="child.signItemFieldType==='5'"
                      :disabled="sign_form.extendList[key]['signValue']==''"
                      placeholder="请选择">
                      <el-option
                        v-for="(option,index) in child.signItemSvgSetting"
                        :key="index"
                        :value="option.settingItem"
                        :label="option.settingItem"
                      >
                      </el-option>
                    </el-select>
                      </div>
                    </div>
                  </el-form-item>
              </template>
          </template>
          <template v-else-if="nItem.signItemFieldName === 'tengtongdengji'">
                <el-form-item :label="nItem.signItemShowName+'：'" :prop="'extendList.'+ key + '.signValue'">
                  <div class="sign_container">
                    <div class="sign_content">
                  <el-select
                    v-if="nItem.signItemSvgSetting"
                    v-model="sign_form.extendList[key]['signValue']"
                    @change="sign_form_change"
                    clearable
                    placeholder="请选择">
                    <el-option
                      v-for="(option,index) in nItem.signItemSvgSetting"
                      :key="index"
                      :value="option.settingItem"
                      :label="option.settingItem"
                    >
                    </el-option>
                  </el-select>
                  <el-input v-else v-model="sign_form.extendList[key]['signValue']" @input="sign_form_change"/>
                    </div>
                    <template v-if="nItem.signItemUnit">
                      <div class="sign_unit">{{nItem.signItemUnit}}</div>
                    </template>
                  </div>
                </el-form-item>
              <template v-for="(child, key1) in nItem.childrenSignItem">
                  <el-form-item v-if="child.signItemFieldName === 'fucetengtong'" :label="child.signItemShowName+'：'" :prop="'extendList.'+ key + '.phValue'">
                    <div class="sign_container">
                      <div class="sign_content">
                    <el-select
                      v-if="child.signItemSvgSetting"
                      v-model="sign_form.extendList[key]['phValue']"
                      @change="sign_form_change"
                      :disabled="sign_form.extendList[key]['signValue']==''"
                      filterable
                      allow-create
                      placeholder="">
                      <el-option value="" label=""></el-option>
                      <el-option
                        v-for="(option,index) in child.signItemSvgSetting"
                        :key="index"
                        :value="option.settingItem"
                        :label="option.settingItem"
                      >
                      </el-option>
                    </el-select>
                    <el-input v-else v-model="sign_form.extendList[key]['phValue']" @input="sign_form_change"/>
                      </div>
                    </div>
                  </el-form-item>
              </template>
          </template>
          <template v-else>
                <el-form-item
                  :label="nItem.newSignItemShowName+'：'"
                  :prop="'extendList.'+ key + '.signValue'"
                  :rules="getRules(nItem.signFieldName)"
                >
                  <template v-if="nItem.signSummaryType&&nItem.signSummaryType !== 0">
                    <div class="sign_container">
                      <div class="sign_content">
                        <span>{{sign_form.extendList[key]['signValue']}}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="sign_container">
                      <div class="sign_content">
                    <el-select
                      v-if="nItem.signItemFieldType==='4'"
                      v-model="sign_form.extendList[key]['signValue']"
                      @change="sign_form_change"
                      clearable
                      placeholder="请选择">
                      <el-option
                        v-for="(option,index) in nItem.signItemSvgSetting"
                        :key="index"
                        :value="option.settingItem"
                        :label="option.settingItem"
                      >
                      </el-option>
                    </el-select>
                    <el-select
                      v-else-if="nItem.signItemFieldType==='5'"
                      v-model="sign_form.extendList[key]['signValue']"
                      filterable
                      allow-create
                      @change="sign_form_change"
                      placeholder="请输入或选择">
                      <el-option value="" label=""></el-option>
                      <el-option
                        v-for="(option,index) in nItem.signItemSvgSetting"
                        :key="index"
                        :value="option.settingItem"
                        :label="option.settingItem"
                      >
                      </el-option>
                    </el-select>
                    <el-radio-group
                      v-model="sign_form.extendList[key]['signValue']"
                      v-else-if="nItem.signItemFieldType==='3'"
                    >
                      <el-radio
                        v-for="(option,index) in nItem.signItemSvgSetting"
                        :key="index"
                        :label="option.settingItem">{{option.settingItem}}</el-radio>
                    </el-radio-group>
                    <el-input v-else-if="nItem.signItemFieldType==='2'"  type='number' v-model="sign_form.extendList[key]['signValue']" @input="sign_form_change"/>
                    <el-input v-else v-model="sign_form.extendList[key]['signValue']" @input="sign_form_change"/>
                      </div>
                      <template v-if="nItem.signItemUnit">
                        <div class="sign_unit">{{nItem.signItemUnit}}</div>
                      </template>
                    </div>
                  </template>
                </el-form-item>
          </template>
        </template>
        <div style="text-align: center; padding: 20px 0">
          <el-button type="primary" @click="sign_save" style="border-radius: 2px !important;">保存</el-button>
        </div>
      </el-form>
    </div>

    <!-- 临床事件弹窗 -->
    <el-dialog
      class="focus_window"
      title="临床事件"
      :visible.sync="eventDialogVisible"
      :before-close="eventWinClose"
      width="490px"
      custom-class="eventDialogCss"
    >
        <event-win :patient="patient" @reset="getSheetData" ref="event_win"/>
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="eventWinClose">关 闭</el-button>-->
      <!--</span>-->
    </el-dialog>

  </div>
</template>

<script>
  import TemperatureSheet from '../../../../components/nrms/TemperatureSheet';
  import { ApiTemperatureSheet, ApiSignItemSetting, ApiInAndOutDate } from '../../../../api/nrms/index'
  import moment from 'moment'
  import printJS from 'print-js'
  import printStyle from './printStyle'

  export default {
    name: 'temperature_sheet',
    props: ['patient', 'patientType'],
    data () {
      return {
        loading: false,
        sign_form_width: 350,
        eventDialogVisible: false,
        sign_item: [], //组装后体征项
        firstSvgObj:{},//所有类型为单选的体征项中svg字段的 signId+第一个配置项值 的对象
        hours: [], //测量时间
        inHospitalDate: '', //住院日期
        outHospitalDate: '', //出院日期
        cur_week_index: [], //当前周的索引
        all_week_date: [], //所有日期周s
        cur_week_date: [], //当前日期周
        cur_week_in: [], //当前住院天
        cur_week_ss: [], //当前手术天
        extendList: {}, //右侧表单数据
        //表单保存时用的结构体
        sign_form: {
          patientId: this.patient.patientId,
          recordDate: moment().format('YYYY-MM-DD'),
          itemHour: '',
          itemType: '',
          extendList: [],//其他体征项 用于循环v-model时展示
        },
        firstItemHour:'',
        firstItemType:'',
        beforeItemHourFlag:'',//时刻点变量标记 用于编辑数据后保存时用
        currentItemHourFlag:'',
        sign_form_change_flag: false,
        sign_form_search: {},
        sheet_data: {},
        sign_form_show_hide: true,
        printSet:''//存储从体温单组件传递过来的打印方式
      }
    },
    computed: {
      btn_disable: function () {
        // 出院&&非出院召回 || 转科
        if ((this.patientType == 2 && this.patient.outHospitalFlag != 1) || this.patientType == 1) {
          return true
        }
        return false
      },
    },
    created () {
      this.getData();
    },
    methods: {
      async getData () {
        this.loading = true
        await this.getSignItemData()
        await this.getHours()
        this.loading = false
      },

      dateChange(){
        this.getFormDataByHour()
      },
      async getHours () {
        ApiSignItemSetting.selectTime()
          .then(res => {
            this.hours = res.data || []
            this.sign_form.itemHour = res.data ? res.data[0].takeTemperatureTime + '' : ''
            this.beforeItemHourFlag = this.sign_form.itemHour //初始值与itemHour一样
            this.currentItemHourFlag = this.sign_form.itemHour
            this.firstItemHour = res.data ? res.data[0].takeTemperatureTime + '' : ''
            this.sign_form.itemType = res.data ? res.data[0].temperatureItemType : ''
            this.firstItemType = res.data ? res.data[0].temperatureItemType : ''
            //获取一下第一个时刻点的数据
            this.getFormDataByHour()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },
      async getSignItemData () {
        ApiSignItemSetting.selectItem({ formId: 'd16b99a8f7e34ef18bcfc9586299fbff' })//  this.formObj.formId  表单id
          .then(res => {
            let data = res.data || []
            this.sign_item = []
            this.sign_form.extendList = []
            for (let i = 0; i < data.length; i++) {
              let sign_field_name = data[i]['signItemFieldName']
              if (sign_field_name === 'xuetang') {//血糖和体温单独处理
                data[i]['newSignItemShowName'] = data[i]['signItemShowName']
                this.sign_item.push(data[i])
                let obj = {
                  signSummaryType: data[i]['signSummaryType'],
                  signId: data[i]['signId'],
                  signValue: '',
                  phValue: '',
                  itemValueType: '',
                  itemCode: data[i]['signItemFieldName']
                }
                this.sign_form.extendList.push(obj)

              } else if (sign_field_name === 'tiwen') {
                data[i]['newSignItemShowName'] = data[i]['signItemShowName']
                this.sign_item.push(data[i])
                //取体温测量方式的配置项的第一个值作为单选的第一个默认选中
                // let childItems = data[i]['childrenSignItem']
                // let firstChecked = ''
                // for(let k=0;k<childItems.length;k++){
                //   if(childItems[k]['signItemFieldName'] === 'tiwenceliangfangshi'){
                //     let _signItemSvgSetting = childItems[k]['signItemSvgSetting']||[]
                //     if(childItems[k]['signItemFieldType'] === '3' && _signItemSvgSetting.length>0){
                //       firstChecked = _signItemSvgSetting[0]['settingItem']
                //     }else{
                //       firstChecked = ''
                //     }
                //   }
                // }
                let obj = {
                  signSummaryType: data[i]['signSummaryType'],
                  signId: data[i]['signId'],
                  signValue: '',
                  phValue: '',
                  itemValueType: '',
                  itemCode: data[i]['signItemFieldName']
                }
                this.sign_form.extendList.push(obj)
              }else if (sign_field_name === 'tengtongdengji') {
                data[i]['newSignItemShowName'] = data[i]['signItemShowName']
                this.sign_item.push(data[i])
                let obj = {
                  signSummaryType: data[i]['signSummaryType'],
                  signId: data[i]['signId'],
                  signValue: '',
                  phValue: '',
                  itemValueType: '',
                  itemCode: data[i]['signItemFieldName']
                }
                this.sign_form.extendList.push(obj)
              }else {
                let str = data[i]['signItemShowName']
                this.getNewSignItemShowName(data[i], str)//递归获取子元素中的signItemShowName值
              }

            }

          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },

      getNewSignItemShowName (data, strItem) {
        let item = data['childrenSignItem']
        if (item.length === 0) {//没有子项的时候 取当前这个list放进sign_item中，重新组合
          let smallChildItem = JSON.parse(JSON.stringify(data))
          if(smallChildItem['signItemFieldName'] === 'shousuoya'||smallChildItem['signItemFieldName'] === 'shuzhangya'||smallChildItem['signItemFieldName'] === 'celiangweizhi' ){
            smallChildItem['newSignItemShowName'] = data['signItemShowName'] // 舒张压收缩压测量位置不需要展示血压-收缩压
          }else{
            smallChildItem['newSignItemShowName'] = strItem // 总尿量-大便次数-尿量-水-排泄 格式
          }
          this.sign_item.push(smallChildItem)
          //保存数据格式
          let obj = {
            signSummaryType: smallChildItem['signSummaryType'],
            signId: smallChildItem['signId'],
            signValue: '',
            phValue: '',
            itemValueType:'',
            itemCode: smallChildItem['signItemFieldName']
          }
          this.sign_form.extendList.push(obj)
        } else {
          for (let j = 0; j < item.length; j++) {
            let str2 = strItem + '-' + item[j]['signItemShowName']
            this.getNewSignItemShowName(item[j], str2)
          }
        }
      },
      async getSheetData () {
        ApiTemperatureSheet.select({
          patientId: this.patient.patientId,
          beginDate: this.cur_week_date[0],
          endDate: this.cur_week_date[this.cur_week_date.length - 1]
        })
          .then((res) => {
            this.sheet_data = res.data || {}
            this.getSSDays()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },
      //获取当前秒数
      getCurrentSecond(time){
        let s = moment().seconds()
        if (s >= 0 && s <= 9) {
          s = '0' + s
        }
        time= time.substr(0,16)+':' + s
        return time
      },
      sign_save () {
        if (this.isPatientEmpty()) {
          return false
        }
        this.$refs.sign_form.validate((valid) => {
          if (valid) {
            let form_data = { ...this.sign_form }
            let _hasVal = false
            for (let i = 0; i < form_data.extendList.length; i++) {
              let _d = form_data.extendList[i];
              if((_d['itemCode'] === 'tiwen' || _d['itemCode'] === "tengtongdengji") && _d['phValue']){
                _hasVal = true;
              }
              else if (_d['signValue']) {
                _hasVal = true;
              }
            }
            if (!_hasVal) {
              this.$message.warning('请填写患者体征项信息！')
              return false
            }

            form_data.itemHour = +form_data.itemHour
            let r_date = form_data.recordDate
            if (moment(r_date).diff(moment(this.inHospitalDate), 'days') < 0) {
              this.$message.warning('日期不能小于入院日期！')
              return false
            }
            if (form_data.recordDate == '') {
              this.$message.warning('请选择日期！')
              return false
            }
            if (form_data.itemHour == '') {
              this.$message.warning('请选择时刻！')
              return false
            }
            //过滤汇总项
            form_data.extendList = form_data.extendList.filter(v => {
              return v.signSummaryType === 0
            })
            let _time = form_data.recordDate+' 00:00:00'
            form_data.recordDate = _time
            ApiTemperatureSheet.saveSignData(form_data)
              .then(() => {
                this.$message.success('保存正确！')
                this.sign_form_change_flag = false
                this.sign_form.itemHour = this.currentItemHourFlag
                this.getFormDataByHour()
                this.getSheetData()
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
      tabsHandleClick (tab, event) {
        // console.log('tab',tab)
        this.currentItemHourFlag = tab.name
        if (this.isPatientEmpty()) {
          return false
        }

        if (!this.sign_form_change_flag) {
          this.sign_form_change_flag = false
          this.getFormDataByHour()

        } else {
          this.sign_form.itemHour = this.beforeItemHourFlag
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
        this.getFirstSvgOption()//获取体征项中svg字典中的第一个选项，并放入对象中

        ApiTemperatureSheet.selectByHour({
          patientId: this.patient.patientId,
          recordDate: this.sign_form.recordDate+' 00:00:00',
          itemHour: this.sign_form.itemHour
        })
          .then((res) => {
            let resData = res.data.length > 0 ? res.data[0].data : []
            for (let x = 0; x < this.sign_form.extendList.length; x++) {
              let eitem = this.sign_form.extendList[x]
              //先置空
              console.log('this.firstSvgObj',this.firstSvgObj)
              // console.log('eitem',eitem)
              if(eitem.itemCode === 'tiwen'||eitem.itemCode === 'tengtongdengji'||eitem.itemCode === 'xuetang'){
                eitem.signValue = ''
                eitem.phValue = ''
                eitem.itemValueType = this.firstSvgObj[eitem.signId]
              }else{
                eitem.signValue = this.firstSvgObj[eitem.signId]
                eitem.phValue = ''
                eitem.itemValueType = ''
              }
              for (let y = 0; y < resData.length; y++) {
                let ritem = res.data[0].data[y]
                if (eitem.signId === ritem.signId) {
                  eitem.signValue = ritem.signValue
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
      getFirstSvgOption(){
        this.firstSvgObj = {}
        console.log('this.sign_item',this.sign_item)
        for (let i = 0; i < this.sign_item.length; i++) {
          let item = this.sign_item[i]
          let child = this.sign_item[i]['childrenSignItem']
          if(item['signItemFieldName']==='tiwen'){
            let signId = item['signId']
            for(let j=0;j<child.length;j++){
              if(child[j]['signItemFieldName']==='tiwenceliangfangshi'&&child[j]['signItemFieldType']==='3'){
                let filedSvgSetting = child[j]['signItemSvgSetting']
                this.firstSvgObj[signId] = filedSvgSetting[0]['settingItem']
              }
            }
          }else if(item['signItemFieldName']==='xuetang'){
            let signId = item['signId']
            for(let j=0;j<child.length;j++){
              if(child[j]['signItemFieldName']==='celiangweizhi'&&child[j]['signItemFieldType']==='3'){
                let filedSvgSetting = child[j]['signItemSvgSetting']
                this.firstSvgObj[signId] = filedSvgSetting[0]['settingItem']
              }
            }
          }else if(item['signItemFieldName']==='tengtongdengji'){
            let signId = item['signId']
            for(let j=0;j<child.length;j++){
              if(child[j]['signItemFieldName']==='fucetengtong'&&child[j]['signItemFieldType']==='3'){
                let filedSvgSetting = child[j]['signItemSvgSetting']
                this.firstSvgObj[signId] = filedSvgSetting[0]['settingItem']
              }
            }
          }else{
            //获取单选按钮类型的体征项的id与第一个默认值
            this.getFirstSvgObj(this.sign_item[i])
          }
        }
        console.log('firstSvgObj',this.firstSvgObj)
      },
      getFirstSvgObj(childItem){
          let filedType = childItem.signItemFieldType
          let filedSvgSetting = childItem.signItemSvgSetting
          if(filedType === '3'){
            this.firstSvgObj[childItem.signId] = filedSvgSetting[0]['settingItem']
          }
      },
      getHospitalizationDate () {
        let inDate = this.inHospitalDate //入院日期
        let cur_date = this.outHospitalDate || moment().format('YYYY-MM-DD') //当前日期
        let inDateArr = [] //时间按周分组
        let diffDays = moment(cur_date).diff(moment(inDate), 'days') + 1 //获取时间差, 加上住院当天
        let _arr = []
        for (let i = 0; i < diffDays; i++) {
          //入院日期后的每一个日期
          _arr.push(moment(inDate).add(i, 'days').format('YYYY-MM-DD'))
          if (_arr.length === 7 || i === diffDays - 1) {
            this.cur_week_date = [] //当前日期周
            if (cur_date === _arr[0] || cur_date === _arr[_arr.length - 1] || moment(cur_date).isBetween(_arr[0], _arr[_arr.length - 1])) {
              this.cur_week_date = _arr
              this.cur_week_index = inDateArr.length
            }
            inDateArr.push(_arr)
            //置空
            _arr = []
          }
        }
        //如果当前周不存在或已超过出院日期显示最后一周
        if (this.cur_week_date.length === 0) {
          this.cur_week_date = inDateArr[inDateArr.length - 1]
          this.cur_week_index = inDateArr.length - 1
        }
        this.all_week_date = inDateArr
        this.getInDays()
      },
      getInDays () {
        this.cur_week_in = [] //当前住院天
        let inDate = this.inHospitalDate
        //计算住院天数
        for (let x = 0; x < this.cur_week_date.length; x++) {
          let _d = this.cur_week_date[x]
          let day1 = moment(_d).diff(moment(inDate), 'days') + 1
          this.cur_week_in.push(day1 >= 1 ? day1 : '')
        }
      },
      //目前 手术日期先从临床事件中获取
      //以后再说以后
      getSSDays () {
        this.cur_week_ss = [] //当前手输天
        let eventData = this.sheet_data.eventData || []
        let ssDate = [] //手术/分娩时间
        for (let i = 0; i < eventData.length; i++) {
          let _d = eventData[i]
          if (_d['signValue'] === '手术' || _d['signValue'] === '分娩') {
            ssDate.push(_d['recordDate'])
          }
        }
        //计算住院天数
        for (let x = 0; x < this.cur_week_date.length; x++) {
          let _d = this.cur_week_date[x]
          let ss = []
          for (let y = 0; y < ssDate.length; y++) {
            let diffDay = moment(_d).diff(moment(ssDate[y]).format('YYYY-MM-DD'), 'days') + 1
            //prd
            let s = diffDay <= 1 || (diffDay - 1) > 14 ? '' : diffDay - 1
            s && ss.push(s)
          }
          this.cur_week_ss.push(ss.length > 0 ? ss.reverse().join('/') : '')
        }
      },
      getSearchWeek (type) {
        if (this.isPatientEmpty()) {
          return false
        }
        if (type === 'first') {
          if (this.cur_week_index === 0) {
            this.$message.warning('已经是首周！')
            return false
          }
          this.cur_week_index = 0
          this.cur_week_date = this.all_week_date[this.cur_week_index]
        } else if (type === 'prev') {
          if (this.cur_week_index === 0) {
            this.$message.warning('已经是首周！')
            return false
          }
          this.cur_week_index -= 1
          this.cur_week_date = this.all_week_date[this.cur_week_index]
        } else if (type === 'next') {
          if (this.cur_week_index === this.all_week_date.length - 1) {
            this.$message.warning('已经是尾周！')
            return false
          }
          this.cur_week_index += 1
          this.cur_week_date = this.all_week_date[this.cur_week_index]
        } else if (type === 'last') {
          if (this.cur_week_index === this.all_week_date.length - 1) {
            this.$message.warning('已经是尾周！')
            return false
          }
          this.cur_week_index = this.all_week_date.length - 1
          this.cur_week_date = this.all_week_date[this.cur_week_index]
        }
        this.getInDays()
        this.getSSDays()
        this.getSheetData()
      },
      multiSave () {
        this.$emit('batch-sign', 'batch_sign_add')
      },
      temperatureCharts () {
        this.$emit('option-changed', 'chart_tabs')
      },
      showEventWin () {
        if (this.isPatientEmpty()) {
          return false
        }
        this.eventDialogVisible = true
      },
      printView () {
        if (this.isPatientEmpty()) {
          return false
        }
        this.printSet=this.$refs.temperatureSheet.printSet
        let _printStyle = ''
          switch(this.printSet){
            case 1:
              _printStyle = printStyle.toString().replace('#portrait#', 'portrait')
            break
            case 2:
              _printStyle = printStyle.toString().replace('#portrait#', ' landscape')
              break
            default:
              _printStyle = printStyle.replace('#portrait#', 'portrait')
            break
          }
        // console.log(printStyle)
        printJS({
          printable: 'temperature_sheet_print_container',
          type: 'html',
          style: _printStyle,
          scanStyles: false
        })
      },
      eventWinClose () {
        this.eventDialogVisible = false
        this.$refs.event_win.resetEventForm()
        this.$refs.event_win.form_btn_disabled = false
      },
      //小分辨率右侧表单可以收缩
      sign_show_hide () {
        this.sign_form_show_hide = !this.sign_form_show_hide
        // let w = document.getElementById('sign_form').getBoundingClientRect().width
        // document.getElementById('sign_form').style.width = w > 1 ? 0 : '350px'
      },
      isPatientEmpty () {
        if (!this.patient.patientId) {
          this.$message.warning('请先选择患者！')
          return true
        }
        return false
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
          case 'xuetang':
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
        this.beforeItemHourFlag = this.sign_form.itemHour
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
      'patient':{
        handler (val) {
          this.sign_form.patientId = val.patientId
          this.inHospitalDate = (val.inTime || '').split(' ')[0]
          this.outHospitalDate = (val.outHospitalTime || '').split(' ')[0]
          this.getHospitalizationDate()
          this.getSheetData()
          this.$refs.sign_form && this.$refs.sign_form.resetFields()
          //重置时间和时间点
          this.sign_form.recordDate = moment().format('YYYY-MM-DD')
          this.sign_form.itemHour = this.firstItemHour
          this.sign_form.itemType = this.firstItemType
          if(this.sign_form.itemHour){
            this.getFormDataByHour()
          }
        },
        immediate: true,
        deep: true
      } ,
      'sign_form.extendList': {
        handler (obj) {
          for (let i = 0; i < obj.length; i++) {
            let _d = obj[i]
            if (_d['itemCode'] === 'tiwen' && (_d['signValue'] === '拒测' || _d['signValue'] === '外出' || _d['signValue'] === '不升')) {
              _d['phValue'] = ''
              break
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    components: {
      TemperatureSheet: TemperatureSheet,
      EventWin: () => import('./EventWin')
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @media screen and (max-width: 1550px) {
    .sign_show_btn {
      display: inline-block !important;
    }
    #sign_form {
      width: 0px;
    }
  }

  /deep/ .el-radio {
    margin-right: 30px;
  }

  /deep/ .tool-btn {
    border-bottom: 1px solid #E4E7ED;
  }

  .tool-bar {
    /deep/ .el-button:not(.sign_show_btn) {
      border-radius: 2px !important;
      font-size: 14px !important;
      padding: 6px 0 !important;
      width: 80px;
    }
  }

  .container {
    display: flex;
    justify-content: space-between;
    height: 100%;

    > div {
      height: 100%;
    }
  }

  .sheet_container {
    flex: 1;
    width: 0;
    overflow: auto;
    text-align: center;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;

    .buttons {
      padding:13px 20px;
      text-align: right;
      position: relative;
      .el-button+.el-button{
        margin-left: 20px;
      }
      > .sign_show_btn {
        display: none;
        position: absolute;
        top: 80px;
        right: 0;
        padding: 7px 3px !important;
        background-color: #fff;
        z-index: 9;
        color: #1E87F0;
        border-color: #1E87F0;
        border-radius: 0 !important;
        border-right: none;
      }
    }
  }

  .sheet {
    flex: 1;
    height: 0;
    overflow: auto;
    padding: 20px 0 10%;
  }

  .sign_form {
    border-left: 1px solid #e6e6e6;
    width: 350px;
    overflow: auto;
    transition: width 0.25s;

    .el-form {
      padding:13px 0 0px;
    }

  }

  /deep/.el-form-item__label{
    padding-right: 8px;
  }
 /deep/ input[type='number'] {
    padding-right: 0;
  }

  /*右侧tab样式修改*/
.right_tabs{
  padding: 0 20px;
    /deep/ .el-tabs__nav-wrap {
      padding: 0 10px;
    }
  /deep/ .el-tabs__header{
    padding: 0;
    margin-bottom: 8px;
  }
  /deep/.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2), .el-tabs--bottom .el-tabs__item.is-top:nth-child(2), .el-tabs--top .el-tabs__item.is-bottom:nth-child(2), .el-tabs--top .el-tabs__item.is-top:nth-child(2){
    padding-left: 20px;
  }
  /deep/.el-tabs__item{
    padding: 0 25px;
    max-width: initial;
    min-width: initial;
  }
   /deep/ .el-tabs__item.is-active {
    max-width: initial;
    min-width: initial;
  }
}
  /*右侧体征项 弹性布局*/
  .sign_container{
    display: flex;
    padding-right: 20px;
    .sign_content{
      flex: 1;
    }
    .sign_unit{
      padding-left: 10px;
      width: auto;
    }
  }
  .el-select{
    width: 100%;
  }
</style>
<style type="text/scss" lang="scss">
  .right .el-tabs__content{
    top: 57px !important;
  }
  /*临床事件弹窗*/
  .eventDialogCss{
    .el-dialog__body{
      padding: 30px 0 0 0;
    }
  }
</style>
