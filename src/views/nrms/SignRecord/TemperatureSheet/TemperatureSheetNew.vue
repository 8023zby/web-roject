<template comments>
  <div v-loading="loading" class="container" style="width: 100%">
    <!-- left -->
    <div class="sheet_container">
      <div class="buttons tool-bar">
        <el-button v-uni="'tizhengjilutiwendan_shouzhou'" type="primary" size="small" @click="getSearchWeek('first')"
        >首周
        </el-button>
        <el-button v-uni="'tizhengjilutiwendan_shangyizhou'" type="primary" size="small" @click="getSearchWeek('prev')"
        >上一周
        </el-button>
        <el-button v-uni="'tizhengjilutiwendan_xiayizhou'" type="primary" size="small" @click="getSearchWeek('next')"
        >下一周
        </el-button>
        <el-button v-uni="'tizhengjilutiwendan_weizhou'" type="primary" size="small" @click="getSearchWeek('last')"
        >尾周
        </el-button>
        <el-button v-uni="'tizhengjilutiwendan_piliangluru'" type="primary" size="small" @click="multiSave" :disabled="btn_disable"
        >批量录入
        </el-button>
        <el-button v-uni="'tizhengjilutiwendan_tizhengqushitu'" type="primary" size="small" @click="temperatureCharts"
        >体征趋势图
        </el-button>
        <el-button v-uni="'tizhengjilutiwendan_print'" type="success" size="small" @click="printView"
        >打印
        </el-button>
      </div>
      <!-- 2:世博医院体温单， 3:4时刻 默认6时刻 5:山东病历规范体温单 -->
      <!--世博医院要求表头以及日期时间行固定 所以单独一个样式-->
      <div :class="formRelationStyle == 2?'shiboSheet':'sheet'">
        <!--startprint-->
        <TemperatureSheetSixShibo
                v-if="formRelationStyle == 2"
                :relationType="'2'"
                :patient="patient" :signItem="sign_item_init" :curWeekDate="cur_week_date"
                :curWeekIn="cur_week_in" :curWeekDays="cur_week_days" :hours="hours" :formHeader="formHeader"
                :curWeekIndex="cur_week_index"
                :sheetData="sheet_data" ref="temperatureSheet"
        />
        <TemperatureSheetSixShandong
          v-else-if="formRelationStyle == 5"
          :relationType="'5'"
          :patient="patient" :signItem="sign_item_init" :curWeekDate="cur_week_date"
          :curWeekIn="cur_week_in" :curWeekDays="cur_week_days" :hours="hours" :formHeader="formHeader"
          :curWeekIndex="cur_week_index"
          :sheetData="sheet_data" ref="temperatureSheet"
        />
        <TemperatureSheetSixShengli
          v-else-if="formRelationStyle == 6"
          :relationType="'6'"
          :patient="patient" :signItem="sign_item_init" :curWeekDate="cur_week_date"
          :curWeekIn="cur_week_in" :curWeekDays="cur_week_days" :hours="hours" :formHeader="formHeader"
          :curWeekIndex="cur_week_index"
          :sheetData="sheet_data" ref="temperatureSheet"
        />
        <TemperatureSheetFour
          v-else-if="formRelationStyle == 3"
          :patient="patient" :signItem="sign_item_init" :curWeekDate="cur_week_date"
          :curWeekIn="cur_week_in" :curWeekDays="cur_week_days" :hours="hours" :formHeader="formHeader"
          :curWeekIndex="cur_week_index"
          :sheetData="sheet_data" ref="temperatureSheet"
        />
        <TemperatureSheetSix
          v-else
          :patient="patient" :signItem="sign_item_init" :curWeekDate="cur_week_date"
          :curWeekIndex="cur_week_index"
          :relationType="formRelationStyle"
          :curWeekIn="cur_week_in" :curWeekDays="cur_week_days" :hours="hours" :formHeader="formHeader"
          :sheetData="sheet_data" ref="temperatureSheet"
        />
        <!--endprint-->
      </div>
    </div>

    <!-- right -->
    <div class="sign_form absolute" id="sign_form" v-if="!btn_disable" :style="{right:sign_form_show_hide ? '-437px': 0}">
      <el-button v-uni="'tizhengjilutiwendan_tizhengxiangluru_expend'" size="small" v-if="!btn_disable" class="sign_show_btn" @click="sign_show_hide">
        <i :class="sign_form_show_hide ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </el-button>

      <div style="height: 100%; display: flex; flex-direction: column;">
        <el-form label-width="120px" v-uni="'tizhengjilutiwendan_tizhengxiangluru_form'">
          <el-row>
            <el-col :span="8" :offset="16" class="tool-bar">
              <el-button v-uni="'tizhengjilutiwendan_linchuangshijian'" type="primary" size="small" @click="showEventWin" style="float: right;margin-right: 20px;">临床事件
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 33px;">
            <el-col :span="24">
              <el-form-item label="日期:">
                <el-date-picker
                        v-uni="'tizhengjilutiwendan_tizhengxiangluru_date'"
                  :clearable="false"
                  v-model="sign_form.recordDate"
                  type="date"
                  style="width: 300px;"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="选择日期时间"
                  @change="dateChange"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 时间段 -->
          <el-tabs v-uni="'tizhengjilutiwendan_tizhengxiangluru_time'" v-model="sign_form.itemHour" @tab-click="tabsHandleClick" class="right_tabs">
            <el-tab-pane
              :label="h.measuringTime + ''" :name="h.measuringTime + ''" v-for="h in hours"
              :key="h.id"
            ></el-tab-pane>
          </el-tabs>
        </el-form>

        <el-form ref="sign_form" :model="sign_form" label-width="120px" v-uni="'tizhengjilutiwendan_tizhengxiangluru_form2'">
          <!-- 表单项 循环体征项 动态  -->
          <template v-for="(nItem, key) in sign_item">
            <!-- 体温与血糖与疼痛等级    v-if与v-else-if之间不能有注释行  否则会报错 -->
            <template v-if="nItem.signItemFieldName === 'tiwen'">
              <el-form-item
                :key="'1_' + key"
                :label="nItem.signItemShowName+':'"
                :prop="'extendList.'+ nItem.signItemFieldName + '.signValue'"
                :rules="[{
                  validator: getRules(nItem.signItemFieldLength),
                  trigger: 'change'
                }]"
              >
                <div class="sign_container">
                  <div class="sign_content">
                    <el-select
                            v-uni="'tizhengjilutiwendan_tizhengxiangluru_tiwen'"
                      v-if="nItem.signItemSvgSetting"
                      v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']"
                      @change="sign_form_change($event)"
                      @keydown.native="nextFocus"
                      allow-create
                      filterable
                      default-first-option
                      clearable
                      placeholder="请输入或选择"
                    >
                      <el-option
                        v-for="(option,index) in nItem.signItemSvgSetting"
                        :key="'2_' + index"
                        :value="option.settingItem"
                        :label="option.settingItem"
                      >
                      </el-option>
                    </el-select>
                    <el-input v-else v-uni="'tizhengjilutiwendan_tizhengxiangluru_tiwen'" v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']" clearable @input="sign_form_change" />
                  </div>
                  <template v-if="nItem.signItemUnit">
                    <div class="sign_unit">{{nItem.signItemUnit}}</div>
                  </template>
                </div>
              </el-form-item>
              <template v-for="(child, key1) in nItem.childrenSignItem">
                <el-form-item
                  :key="'3_' + key1"
                  v-if="child.signItemFieldName === 'tiwenceliangfangshi'"
                  :label="child.signItemShowName+':'"
                  :prop="'extendList.'+ nItem.signItemFieldName + '.itemValueType'"
                  :rules="[{
                    validator: getRules(child.signItemFieldLength),
                    trigger: 'change'
                  }]"
                >
                  <div class="sign_container">
                    <div class="sign_content">
                      <el-radio-group v-uni="'tizhengjilutiwendan_tizhengxiangluru_tiwenceliangfangshi'" @keydown.native="nextFocus" v-model="sign_form.extendList[nItem.signItemFieldName]['itemValueType']">
                        <el-radio
                          v-for="(option,index) in child.signItemSvgSetting"
                          :key="'4_' + index"
                          :label="option.settingItem"
                        >{{option.settingItem}}
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                </el-form-item>

                <el-form-item
                  :key="'5_' + key1"
                  v-if="child.signItemFieldName === 'fucetiwen'"
                  :label="child.signItemShowName+':'"
                  :prop="'extendList.'+ nItem.signItemFieldName + '.phValue'"
                  :rules="[{
                    validator: getRules(child.signItemFieldLength),
                    trigger: 'change'
                  }]"
                >
                  <div class="sign_container">
                    <div class="sign_content">
                      <el-input
                              v-uni="'tizhengjilutiwendan_tizhengxiangluru_fucetiwen'"
                        @keydown.native="nextFocus"
                        clearable
                        placeholder="请输入"
                        :disabled="
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='' ||
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='拒测' ||
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='外出' ||
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='不升' ||
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='请假'"
                        v-model="sign_form.extendList[nItem.signItemFieldName]['phValue']" @input="sign_form_change"
                      />
                    </div>
                    <template v-if="child.signItemUnit">
                      <div class="sign_unit">{{child.signItemUnit}}</div>
                    </template>
                  </div>
                </el-form-item>
                <el-form-item
                  :key="'6_' + key1"
                  v-else-if="child.signItemFieldName === 'fushitiwen'"
                  :label="child.signItemShowName+':'"
                  :prop="'extendList.'+ child.signItemFieldName + '.value'"
                  :rules="[{
                    validator: getRules(child.signItemFieldLength),
                    trigger: 'change'
                  }]"
                >
                  <div class="sign_container">
                    <div class="sign_content">
                      <el-checkbox
                              v-uni="'tizhengjilutiwendan_tizhengxiangluru_fushitiwen'"
                        @keydown.native="nextFocus"
                        true-label="1"
                        false-label=""
                        :disabled="
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='' ||
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='拒测' ||
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='外出' ||
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='不升' ||
                          sign_form.extendList[nItem.signItemFieldName]['signValue']=='请假'
                        "
                        v-model="sign_form.extendList[child.signItemFieldName]['signValue']" @input="sign_form_change"
                      />
                    </div>
                    <template v-if="child.signItemUnit">
                      <div class="sign_unit">{{child.signItemUnit}}</div>
                    </template>
                  </div>
                </el-form-item>
              </template>
            </template>
            <template v-else-if="nItem.signItemFieldName === 'xuetang'">
              <el-form-item
                :key="'7_' + key"
                :label="nItem.signItemShowName+':'"
                :prop="'extendList.'+ nItem.signItemFieldName + '.signValue'"
                :rules="[{
                  validator: getRules(nItem.signItemFieldLength),
                  trigger: 'change'
                }]"
              >
                <div class="sign_container">
                  <div class="sign_content">
                    <el-input
                            v-uni="'tizhengjilutiwendan_tizhengxiangluru_xuetang'"
                      @keydown.native="nextFocus"
                      clearable
                      placeholder="请输入"
                      v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']" @input="sign_form_change" />
                  </div>
                  <template v-if="nItem.signItemUnit">
                    <div class="sign_unit">{{nItem.signItemUnit}}</div>
                  </template>
                </div>
              </el-form-item>
              <template v-for="(child, key1) in nItem.childrenSignItem">
                <el-form-item
                  :key="'8_' + key1"
                  v-if="child.signItemFieldName === 'celiangshike'"
                  :label="child.signItemShowName+':'"
                  :prop="'extendList.'+ nItem.signItemFieldName + '.itemValueType'"
                  :rules="[{
                    validator: getRules(child.signItemFieldLength),
                    trigger: 'change'
                  }]"
                >
                  <div class="sign_container">
                    <div class="sign_content">
                      <el-select
                              v-uni="'tizhengjilutiwendan_tizhengxiangluru_celiangshike'"
                        v-model="sign_form.extendList[nItem.signItemFieldName]['itemValueType']"
                        @keydown.native="nextFocus"
                        @change="sign_form_change"
                        clearable
                        :disabled="sign_form.extendList[nItem.signItemFieldName]['signValue']==''"
                        default-first-option
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(option,index) in child.signItemSvgSetting"
                          :key="'9_' + index"
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
              <el-form-item
                :key="'10_' + key"
                :label="nItem.signItemShowName+':'"
                :prop="'extendList.'+ nItem.signItemFieldName + '.signValue'"
                :rules="[{
                  validator: getRules(nItem.signItemFieldLength),
                  trigger: 'change'
                }]"
              >
                <div class="sign_container">
                  <div class="sign_content">
                    <el-select
                            v-uni="'tizhengjilutiwendan_tizhengxiangluru_tengtongdengji'"
                      v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']"
                      @keydown.native="nextFocus"
                      @change="sign_form_change"
                      clearable
                      default-first-option
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(option,index) in nItem.signItemSvgSetting"
                        :key="'s' + index"
                        :value="option.settingItem"
                        :label="option.settingItem"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <template v-if="nItem.signItemUnit">
                    <div class="sign_unit">{{nItem.signItemUnit}}</div>
                  </template>
                </div>
              </el-form-item>
              <template v-for="(child, key1) in nItem.childrenSignItem">
                <el-form-item
                  :key="'ttdj' + key1"
                  v-if="child.signItemFieldName === 'fucetengtong'"
                  :label="child.signItemShowName+':'"
                  :prop="'extendList.'+ nItem.signItemFieldName + '.phValue'"
                  :rules="[{
                    validator: getRules(child.signItemFieldLength),
                    trigger: 'change'
                  }]"
                >
                  <div class="sign_container">
                    <div class="sign_content">
                      <el-select
                              v-uni="'tizhengjilutiwendan_tizhengxiangluru_fucetengtong'"
                        v-model="sign_form.extendList[nItem.signItemFieldName]['phValue']"
                        @keydown.native="nextFocus"
                        @change="sign_form_change"
                        :disabled="sign_form.extendList[nItem.signItemFieldName]['signValue']==''"
                        clearable
                        default-first-option
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(option,index) in child.signItemSvgSetting"
                          :key="'sc' + index"
                          :value="option.settingItem"
                          :label="option.settingItem"
                        >
                        </el-option>
                      </el-select>
                      <!--<el-radio-group-->
                        <!--@keydown.native="nextFocus"-->
                        <!--v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']"-->
                        <!--v-else-if="child.signItemFieldType==='3'"-->
                      <!--&gt;-->
                        <!--<el-radio-->
                          <!--v-for="(option,index) in nItem.signItemSvgSetting"-->
                          <!--:key="'rc' + index"-->
                          <!--:label="option.settingItem"-->
                        <!--&gt;{{option.settingItem}}-->
                        <!--</el-radio>-->
                      <!--</el-radio-group>-->
                      <!--<el-input-->
                        <!--@keydown.native="nextFocus"-->
                        <!--clearable-->
                        <!--placeholder="请输入"-->
                        <!--v-else-if="child.signItemFieldType==='2'" type='text' min="0"-->
                        <!--v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']" @input="sign_form_change"-->
                      <!--&gt;</el-input>-->
                      <!--<el-input-->
                        <!--@keydown.native="nextFocus"-->
                        <!--clearable-->
                        <!--placeholder="请输入"-->
                        <!--v-else v-model="sign_form.extendList[nItem.signItemFieldName]['phValue']" @input="sign_form_change"-->
                      <!--&gt;</el-input>-->
                    </div>
                  </div>
                </el-form-item>
              </template>
            </template>
            <template v-else>
              <el-form-item
                :key="key"
                :label="nItem.newSignItemShowName+':'"
                :prop="'extendList.'+ nItem.signItemFieldName + '.signValue'"
                :rules="[{
                  validator: getRules(nItem.signItemFieldLength),
                  trigger: 'change'
                }]"
              >
                <template v-if="nItem.signSummaryType&&nItem.signSummaryType !== 0">
                  <div class="sign_container">
                    <div class="sign_content">
                      <span>{{sign_form.extendList[nItem.signItemFieldName]['signValue']}}</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="sign_container">
                    <div class="sign_content">
                      <el-select
                              v-uni:[nItem.id]="'tizhengjilutiwendan_tizhengxiangluru_select'"
                        v-if="nItem.signItemFieldType==='4'"
                        v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']"
                        @keydown.native="nextFocus"
                        @change="sign_form_change"
                        clearable
                        default-first-option
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(option,index) in nItem.signItemSvgSetting"
                          :key="index"
                          :value="option.settingItem"
                          :label="option.settingItem"
                        >
                        </el-option>
                      </el-select>
                      <el-select
                              v-uni:[nItem.id]="'tizhengjilutiwendan_tizhengxiangluru_allowcreateselect'"
                        v-else-if="nItem.signItemFieldType==='6'||nItem.signItemFieldType==='7'"
                        v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']"
                        clearable
                        filterable
                        allow-create
                        default-first-option
                        @keydown.native="nextFocus"
                        @change="sign_form_change"
                        placeholder="请输入或选择"
                      >
                        <el-option
                          v-for="(option,index) in nItem.signItemSvgSetting"
                          :key="'11_' + index"
                          :value="option.settingItem"
                          :label="option.settingItem"
                        >
                        </el-option>
                      </el-select>
                      <el-radio-group
                              v-uni:[nItem.id]="'tizhengjilutiwendan_tizhengxiangluru_radiogroup'"
                        @keydown.native="nextFocus"
                        v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']"
                        v-else-if="nItem.signItemFieldType==='3'"
                      >
                        <el-radio
                          v-for="(option,index) in nItem.signItemSvgSetting"
                          :key="'12_' + index"
                          :label="option.settingItem"
                        >{{option.settingItem}}
                        </el-radio>
                      </el-radio-group>
                      <el-input
                              v-uni:[nItem.id]="'tizhengjilutiwendan_tizhengxiangluru_numberinput'"
                        v-else-if="nItem.signItemFieldType==='2'"
                        @keydown.native="nextFocus"
                        clearable
                        placeholder="请输入"
                        type='text' min="0" v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']" @input="sign_form_change" ></el-input>
                      <el-input
                              v-uni:[nItem.id]="'tizhengjilutiwendan_tizhengxiangluru_input'"
                        v-else
                        clearable
                        placeholder="请输入"
                        @keydown.native="nextFocus"
                        v-model="sign_form.extendList[nItem.signItemFieldName]['signValue']" @input="sign_form_change" ></el-input>
                    </div>
                    <template v-if="nItem.signItemUnit">
                      <div class="sign_unit">{{nItem.signItemUnit}}</div>
                    </template>
                  </div>
                </template>
              </el-form-item>
            </template>
          </template>
        </el-form>
        <div class="save-btn">
          <el-button v-uni="'tizhengjilutiwendan_save'" type="primary" @click="sign_save" style="border-radius: 2px !important;">保存</el-button>
        </div>
      </div>
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
      <event-win :patient="patient" :formId="formId" @reset="getSheetData" ref="event_win" />
      <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="eventWinClose">关 闭</el-button>-->
      <!--</span>-->
    </el-dialog>

  </div>
</template>

<script>
import TemperatureSheetSix from '../../../../components/nrms/TemperatureSheetSix'
import TemperatureSheetFour from '../../../../components/nrms/TemperatureSheetFour'
import TemperatureSheetSixShibo from '../../../../components/nrms/TemperatureSheetSixShibo'
import TemperatureSheetSixShandong from '../../../../components/nrms/TemperatureSheetSixShandong'
import TemperatureSheetSixShengli from '../../../../components/nrms/TemperatureSheetSixShengli'
import { ApiTemperatureSheet, ApiSignItemSetting, ApiAutoForm } from '../../../../api/nrms/index'
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
      sign_item_init: [], // 未组装的体征项
      sign_item: [], // 组装后体征项 "瞳孔-反应-右"
      firstSvgObj: {}, // 所有类型为单选的体征项中svg字段的 signId+第一个配置项值 的对象
      hours: [], // 测量时间
      inHospitalDate: '', // 住院日期
      outHospitalDate: '', // 出院日期
      cur_week_index: 0, // 当前周的索引
      all_week_date: [], // 所有日期周s
      cur_week_date: [], // 当前日期周
      cur_week_in: [], // 当前住院天
      cur_week_days: { allSsDays: [], ssDays: [], chDays: [] }, // ss 手术/产后、ch 产后
      all_week_ssDays: [],
      extendList: {}, // 右侧表单数据
      // 表单保存时用的结构体
      sign_form: {
        patientId: this.patient.patientId || '',
        recordDate: moment().format('YYYY-MM-DD'),
        itemHour: '',
        itemType: '',
        extendList: {}// 其他体征项 用于循环v-model时展示
      },
      firstItemHour: '', // 缓存第一个测量时间点
      firstItemType: '', // 缓存第一个测量时间点类型
      beforeItemHourFlag: '', // 时刻点变量标记 用于编辑数据后保存时用
      currentItemHourFlag: '',
      sign_form_change_flag: false,
      sign_form_search: {},
      sheet_data: {},
      sign_form_show_hide: true,
      printSet: '', // 存储从体温单组件传递过来的打印方式
      formHeader: {}, // 表头数据
      formRelationStyle: '', // 体温单样式
      formId: ''
    }
  },
  computed: {
    btn_disable: function () {
      // 出院&&非出院召回 || 转科
      if ((this.patientType == 2 && this.patient.outHospitalFlag != 1) || this.patientType == 1) {
        return true
      }
      return false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 回车跳到下一个可获得焦点的元素
    nextFocus (e) {
      const keyCode = e.keyCode || e.which || e.charCode

      let root = null
      const classList = e.target.classList
      // 输入框或者下拉
      if (classList.contains('el-input__inner')) {
        const pClassList = e.target.parentNode.parentNode.classList
        // 下拉
        if (pClassList.contains('el-select')) {
          root = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        } else {
          // 输入框
          root = e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        }
      } else if (classList.contains('el-radio__original')) { // 单选
        root = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      } else if (classList.contains('el-checkbox__original')) { // 复选
        root = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      }

      let focusParent = null
      // 回车 13 下 40 左 37 右 39 上 38
      if (keyCode === 13 || keyCode === 39 || keyCode === 40) { // 回车 右 下
        focusParent = root.nextElementSibling
      } else if (keyCode === 37 || keyCode === 38) { // 上 左
        focusParent = root.previousElementSibling
      }

      let focusE = null
      if (focusParent) {
        if (focusParent.querySelector('input')) {
          focusE = focusParent.querySelector('input')
        } else if (focusParent.querySelector('checkbox')) {
          focusE = focusParent.querySelector('checkbox')
        } else if (focusParent.querySelector('radio')) {
          focusE = focusParent.querySelector('radio')
        } else if (focusParent.querySelector('.el-button--primary')) {
          // 直接触发保存按钮事件去保存数据
          focusE = focusParent.querySelector('.el-button--primary')
        }
        console.log('root --- ', root)
        console.log('focusParent -- ', focusParent, focusE)
        // e.target.blur()
        focusE && focusE.focus()
      }
    },
    async getData () {
      this.loading = true
      await this.getFormInfo()
    },
    async getFormInfo () {
      await ApiAutoForm.getFormDictByType({ formType: 2 }).then((res) => {
        this.loading = false
        if (res.data == null) {
          this.$message.error('请先运维端配置体温单各数据并将表单应用于该科室')
        } else {
          const { formId, formRelationStyle, formCode, formName, formStyle, temperatureTimeDos } = res.data || {}
          this.formRelationStyle = formRelationStyle
          this.formId = formId
          this.formHeader = { formCode, formName, formStyle }

          // 体温单测量时刻点
          const _temperatureTimeDos = temperatureTimeDos || []
          this.hours = _temperatureTimeDos || []
          this.sign_form.itemHour = temperatureTimeDos.length ? temperatureTimeDos[0].measuringTime + '' : ''
          this.beforeItemHourFlag = this.sign_form.itemHour
          this.currentItemHourFlag = this.sign_form.itemHour
          this.firstItemHour = temperatureTimeDos.length ? temperatureTimeDos[0].measuringTime + '' : ''
          this.sign_form.itemType = temperatureTimeDos.length ? temperatureTimeDos[0].type : ''
          this.firstItemType = temperatureTimeDos.length ? temperatureTimeDos[0].type : ''
          this.getSignItemData()
          // 获取 第一个时刻点的数据
          this.getFormDataByHour()
        }
      })
    },
    dateChange () {
      this.getFormDataByHour()
    },
    // 获取体征项
    async getSignItemData () {
      await ApiSignItemSetting.selectItem({ formId: this.formId })//  this.formObj.formId  表单id
        .then(res => {
          let data = res.data || []
          this.sign_item_init = data || []
          this.sign_item = []
          this.sign_form.extendList = {}
          for (let i = 0; i < data.length; i++) {
            let signFieldName = data[i]['signItemFieldName']
            // 血糖、体温、疼痛等级
            if (signFieldName === 'xuetang' || signFieldName === 'tiwen' || signFieldName === 'tengtongdengji') {
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
              this.$set(this.sign_form.extendList, data[i]['signItemFieldName'], obj)

              // 体温单-复试体温
              if (signFieldName === 'tiwen') {
                for (let j = 0; j < data[i]['childrenSignItem'].length; j++) {
                  let sI = data[i]['childrenSignItem'][j]
                  if (sI.signItemFieldName === 'fushitiwen') {
                    let obj = {
                      signSummaryType: sI['signSummaryType'],
                      signId: sI['signId'],
                      signValue: '',
                      phValue: '',
                      itemValueType: '',
                      itemCode: sI['signItemFieldName']
                    }
                    this.$set(this.sign_form.extendList, sI['signItemFieldName'], obj)
                  }
                }
              }
            } else {
              let str = data[i]['signItemShowName']
              this.getNewSignItemShowName(data[i], str)// 递归获取子元素中的signItemShowName值
            }
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    getNewSignItemShowName (data, strItem) {
      let item = data['childrenSignItem']
      if (item.length === 0) { // 没有子项的时候 取当前这个list放进sign_item中，重新组合
        let smallChildItem = JSON.parse(JSON.stringify(data))
        if (smallChildItem['signItemFieldName'] === 'shousuoya' || smallChildItem['signItemFieldName'] === 'shuzhangya' || smallChildItem['signItemFieldName'] === 'celiangweizhi') {
          smallChildItem['newSignItemShowName'] = data['signItemShowName'] // 舒张压收缩压测量位置不需要展示血压-收缩压
        } else {
          smallChildItem['newSignItemShowName'] = strItem // 总尿量-大便次数-尿量-水-排泄 格式
        }
        this.sign_item.push(smallChildItem)
        // 保存数据格式
        let obj = {
          signSummaryType: smallChildItem['signSummaryType'],
          signId: smallChildItem['signId'],
          signValue: '',
          phValue: '',
          itemValueType: '',
          itemCode: smallChildItem['signItemFieldName']
        }
        this.$set(this.sign_form.extendList, smallChildItem['signItemFieldName'], obj)
      } else {
        for (let j = 0; j < item.length; j++) {
          let str2 = strItem + '-' + item[j]['signItemShowName']
          this.getNewSignItemShowName(item[j], str2)
        }
      }
    },
    // 获取体温单数据
    async getSheetData () {
      await ApiTemperatureSheet.select({
        patientId: this.patient.patientId || '',
        beginDate: this.cur_week_date[0] || moment().subtract(-7, 'days').format('YYYY-MM-DD'),
        endDate: this.cur_week_date[this.cur_week_date.length - 1] || moment().format('YYYY-MM-DD')
      })
        .then((res) => {
          this.sheet_data = res.data || {}
          this.getSSDays()
        })
        .catch(res => {
          this.$message.error(res.message)
        })
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
    sign_save () {
      if (this.isPatientEmpty()) {
        return false
      }
      this.$refs.sign_form.validate((valid) => {
        if (valid) {
          this.$confirm('确认要保存数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          }).then(() => {
            this.sign_save_do()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sign_save_do () {
      let formData = JSON.parse(JSON.stringify(this.sign_form))
      formData.extendList = Object.values(formData.extendList) // 转成数组

      formData.itemHour = +formData.itemHour
      let rDate = formData.recordDate
      if (moment(rDate).diff(moment(this.inHospitalDate), 'days') < 0) {
        this.$message.warning('日期不能小于入院日期！')
        return false
      }
      if (!formData.recordDate) {
        this.$message.warning('请选择日期！')
        return false
      }
      if (!formData.itemHour) {
        this.$message.warning('请选择时刻！')
        return false
      }
      // 过滤汇总项
      formData.extendList = formData.extendList.filter(v => {
        return v.signSummaryType === 0
      })
      let _time = formData.recordDate + ' 00:00:00'
      formData.recordDate = _time
      ApiTemperatureSheet.saveSignData(formData)
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
    },
    // 获取当前时间点的数据
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
    // 获取右侧表单数据，根据患者id 日期 测量时间
    async getFormDataByHour () {
      // 获取体征项字典中的第一个选项，并放入对象中
      this.getFirstSvgOption()

      await ApiTemperatureSheet.selectByHour({
        patientId: this.patient.patientId || '',
        recordDate: this.sign_form.recordDate + ' 00:00:00',
        itemHour: this.sign_form.itemHour
      })
        .then((res) => {
          let resData = res.data.length > 0 ? res.data[0].data : []
          for (let x in this.sign_form.extendList) {
            let eitem = this.sign_form.extendList[x]
            // 先置空
            if (eitem.itemCode === 'tiwen' || eitem.itemCode === 'tengtongdengji' || eitem.itemCode === 'xuetang') {
              eitem.signValue = ''
              eitem.phValue = ''
              eitem.itemValueType = this.firstSvgObj[eitem.signId] || ''
            } else {
              eitem.signValue = this.firstSvgObj[eitem.signId] || ''
              eitem.phValue = ''
              eitem.itemValueType = ''
            }
            for (let y = 0; y < resData.length; y++) {
              let ritem = res.data[0].data[y]
              if (eitem.signId === ritem.signId) {
                eitem.signValue = ritem.signValue || ''
                eitem.phValue = ritem.phValue || ''
                eitem.itemValueType = ritem.itemValueType || ''
              }
            }
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 获取体征项的第一个选项，方便表单中默认选中
    getFirstSvgOption () {
      this.firstSvgObj = {}
      for (let i = 0; i < this.sign_item.length; i++) {
        let item = this.sign_item[i]
        let child = this.sign_item[i]['childrenSignItem']
        if (item['signItemFieldName'] === 'tiwen') {
          let signId = item['signId']
          for (let j = 0; j < child.length; j++) {
            if (child[j]['signItemFieldName'] === 'tiwenceliangfangshi' && child[j]['signItemFieldType'] === '3') {
              let filedSvgSetting = child[j]['signItemSvgSetting']
              this.firstSvgObj[signId] = filedSvgSetting[0]['settingItem']
            }
          }
        } else if (item['signItemFieldName'] === 'xuetang') {
          let signId = item['signId']
          for (let j = 0; j < child.length; j++) {
            if (child[j]['signItemFieldName'] === 'celiangweizhi' && child[j]['signItemFieldType'] === '3') {
              let filedSvgSetting = child[j]['signItemSvgSetting']
              this.firstSvgObj[signId] = filedSvgSetting[0]['settingItem']
            }
          }
        } else if (item['signItemFieldName'] === 'tengtongdengji') {
          let signId = item['signId']
          for (let j = 0; j < child.length; j++) {
            if (child[j]['signItemFieldName'] === 'fucetengtong' && child[j]['signItemFieldType'] === '3') {
              let filedSvgSetting = child[j]['signItemSvgSetting']
              this.firstSvgObj[signId] = filedSvgSetting[0]['settingItem']
            }
          }
        } else {
          // 获取单选按钮类型的体征项的id与第一个默认值
          this.getFirstSvgObj(this.sign_item[i])
        }
      }
    },
    getFirstSvgObj (childItem) {
      let filedType = childItem.signItemFieldType
      let filedSvgSetting = childItem.signItemSvgSetting
      if (filedType === '3') {
        this.firstSvgObj[childItem.signId] = filedSvgSetting[0]['settingItem']
      }
    },
    // 根据患者入院日期、出院日期计算体温单的周数
    getHospitalizationDate () {
      let inDate = this.inHospitalDate // 入院日期
      let curDate = this.outHospitalDate || moment().format('YYYY-MM-DD') // 当前日期
      let inDateArr = [] // 时间按周分组
      let diffDays = moment(curDate).diff(moment(inDate), 'days') + 1 // 获取时间差, 加上住院当天
      let _arr = []
      for (let i = 0; i < diffDays; i++) {
        // 入院日期后的每一个日期
        _arr.push(moment(inDate).add(i, 'days').format('YYYY-MM-DD'))
        if (_arr.length === 7 || i === diffDays - 1) {
          this.cur_week_date = [] // 当前日期周
          if (curDate === _arr[0] || curDate === _arr[_arr.length - 1] || moment(curDate).isBetween(_arr[0], _arr[_arr.length - 1])) {
            this.cur_week_date = _arr
            this.cur_week_index = inDateArr.length
          }
          inDateArr.push(_arr)
          // 置空
          _arr = []
        }
      }

      // 最后一周不足7天补齐
      let lastWeek = inDateArr.length ? inDateArr[inDateArr.length - 1] : []
      let lastWeekDate = lastWeek[lastWeek.length - 1]
      let len = 7 - lastWeek.length
      for (let i = 1; i <= len; i++) {
        lastWeek.push(moment(lastWeekDate).add(i, 'days').format('YYYY-MM-DD'))
      }

      // 如果当前周不存在或已超过出院日期显示最后一周
      if (this.cur_week_date.length === 0) {
        this.cur_week_date = inDateArr.length ? inDateArr[inDateArr.length - 1] : []
        this.cur_week_index = inDateArr.length - 1
      }
      this.all_week_date = inDateArr
      this.getInDays()
    },
    // 根据体温单周数计算每周的每一天对应的住院天数
    getInDays () {
      this.cur_week_in = [] // 当前住院天
      let inDate = this.inHospitalDate
      // 计算住院天数
      for (let x = 0; x < this.cur_week_date.length; x++) {
        let _d = this.cur_week_date[x]
        let day1 = moment(_d).diff(moment(inDate), 'days') + 1
        this.cur_week_in.push(day1 >= 1 ? day1 : '')
      }
    },
    // 手术天数
    // 目前 手术日期先从临床事件中获取
    getSSDays () {
      let eventData = this.sheet_data.eventData || []
      let allSsDate = [] // 手术/分娩时间
      let ssDate = [] // 手术时间
      let chDate = [] // 分娩时间
      for (let i = 0; i < eventData.length; i++) {
        let _d = eventData[i]
        if (_d['signValue'] === '手术' || _d['signValue'] === '分娩') {
          allSsDate.push(_d['recordDate'])
        }
        if (_d['signValue'] === '手术') {
          ssDate.push(_d['recordDate'])
        }
        if (_d['signValue'] === '分娩') {
          chDate.push(_d['recordDate'])
        }
      }
      // 计算手术天数
      this.all_week_ssDays = []
      for (let i = 0; i < this.all_week_date.length; i++) {
        let weekSsDays = { allSsDays: [], ssDays: [], chDays: [] } // ss 手术/产后、ch 产后

        for (let x = 0; x < this.all_week_date[i].length; x++) {
          let _date = this.all_week_date[i][x]

          // 包含手术+分娩
          let allSs = []
          for (let y = 0; y < allSsDate.length; y++) {
            let diffDay = moment(_date).diff(moment(allSsDate[y]).format('YYYY-MM-DD'), 'days')
            // 2020-12-25 山东病历规范体温单 不限制大小
            let s = diffDay < 0 || diffDay > (this.formRelationStyle === '2' ? 999 : 14) ? '' : diffDay

            // 2020-12-25 山东病历规范体温单 两次手术相差7天重新开始计算
            if (this.formRelationStyle === '2') {
              // 最后两个大于7
              if (allSs[y - 1] - s > 7) {
                allSs = []
                s !== '' && allSs.push(s)
                // 把算过的手术日期删掉就可以从头开始
                allSsDate.splice(0, y)
              } else if (y === allSsDate.length - 1 && s > 7) {
                // 最后两个小于7的 最后一个日期大于7
                allSs = []
                allSsDate = []
              } else {
                s !== '' && allSs.push(s)
              }
            } else {
              s !== '' && allSs.push(s)
            }
          }
          weekSsDays.allSsDays.push(allSs.length > 0 ? allSs.reverse().join('/') : '')

          // 单独处理手术
          let ss = []
          for (let y = 0; y < ssDate.length; y++) {
            let diffDay = moment(_date).diff(moment(ssDate[y]).format('YYYY-MM-DD'), 'days')
            let s = diffDay < 0 || diffDay > 14 ? '' : diffDay
            s !== '' && ss.push(s)
          }
          weekSsDays.ssDays.push(ss.length > 0 ? ss.reverse().join('/') : '')

          // 单独处理产后
          let ch = []
          for (let y = 0; y < chDate.length; y++) {
            let diffDay = moment(_date).diff(moment(chDate[y]).format('YYYY-MM-DD'), 'days')
            let s = diffDay < 0 || diffDay > 14 ? '' : diffDay
            s !== '' && ch.push(s)
          }
          weekSsDays.chDays.push(ch.length > 0 ? ch.reverse().join('/') : '')
        }
        // console.table('第' + i + '周 ', weekSsDays.allSsDays)
        this.all_week_ssDays.push(weekSsDays)
      }

      // alert(this.cur_week_index)
      this.cur_week_days = this.all_week_ssDays[this.cur_week_index]
    },
    // 根据上周、下周等选项获取每周的日期，处理理在院天数，获取本周数据
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
      } else if (type === 'prev') {
        if (this.cur_week_index === 0) {
          this.$message.warning('已经是首周！')
          return false
        }
        this.cur_week_index -= 1
      } else if (type === 'next') {
        if (this.cur_week_index === this.all_week_date.length - 1) {
          this.$message.warning('已经是尾周！')
          return false
        }
        this.cur_week_index += 1
      } else if (type === 'last') {
        if (this.cur_week_index === this.all_week_date.length - 1) {
          this.$message.warning('已经是尾周！')
          return false
        }
        this.cur_week_index = this.all_week_date.length - 1
      }

      this.cur_week_date = this.all_week_date[this.cur_week_index]
      this.cur_week_days = this.all_week_ssDays[this.cur_week_index]
      this.getInDays()
      // this.getSSDays()
      this.getSheetData()
    },
    // 跳转批量录入
    multiSave () {
      this.$emit('batch-sign', 'batch_sign_add')
    },
    // 跳转趋势图
    temperatureCharts () {
      this.$emit('option-changed', 'chart_tabs')
    },
    // 显示临床事件
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
      this.printSet = this.$refs.temperatureSheet.printSet
      let _printStyle = ''
      switch (this.printSet) {
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
      // top和left见各个体温单中的样式
      let top = '85px'
      let left = '120px'
      // 2020-12-25 世博医院 疼痛等级增加了两行，容器定位也跟着变化
      if (this.formRelationStyle === '2') {
        top = '0px'
      }
      // 20201-01-09 省立左侧为 脉搏和体温两列，42°以上是三行, 左侧脉搏、体温刻度带颜色
      if (this.formRelationStyle === '6') {
        top = '54px'
        left = '79px'
        _printStyle +=
          `.tableSvg tr:nth-child(3) td:nth-child(1), .tableSvg tr:nth-child(4) td:nth-child(1), .tableSvg tr:nth-child(6) td:nth-child(1), .tableSvg tr:nth-child(11) td:nth-child(1), .tableSvg tr:nth-child(16) td:nth-child(1), .tableSvg tr:nth-child(21) td:nth-child(1), .tableSvg tr:nth-child(26) td:nth-child(1), .tableSvg tr:nth-child(31) td:nth-child(1), .tableSvg tr:nth-child(36) td:nth-child(1), .tableSvg tr:nth-child(41) td:nth-child(1) {
            color: red;
          }
          .tableSvg tr:nth-child(3) td:nth-child(2), .tableSvg tr:nth-child(4) td:nth-child(2), .tableSvg tr:nth-child(6) td:nth-child(2), .tableSvg tr:nth-child(11) td:nth-child(2), .tableSvg tr:nth-child(16) td:nth-child(2), .tableSvg tr:nth-child(21) td:nth-child(2), .tableSvg tr:nth-child(26) td:nth-child(2), .tableSvg tr:nth-child(31) td:nth-child(2), .tableSvg tr:nth-child(36) td:nth-child(2), .tableSvg tr:nth-child(41) td:nth-child(2) {
            color: blue;
          }`
      }
      let svgContainer =
        `.svg_container {
            display: inline-block;
            position: absolute;
            top: ${top};
            left: ${left};
          }`
      printJS({
        printable: 'temperature_sheet_print_container',
        type: 'html',
        style: _printStyle + svgContainer,
        scanStyles: false
      })
    },
    // 关闭临床事件
    eventWinClose () {
      this.eventDialogVisible = false
      this.$refs.event_win.resetEventForm()
      this.$refs.event_win.form_btn_disabled = false
    },
    // 小分辨率右侧表单可以收缩
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
    getRules (length) {
      return (rule, value, callback) => {
        if (value && value.length > length) {
          callback(new Error('长度在 1 到 ' + length + ' 个字符！'))
        } else {
          callback()
        }
      }
    },
    // getRules (fieldName) {
    //   let rule = {}
    //   switch (fieldName) {
    //     case 'tiwen':
    //     case 'fctw':
    //       rule = { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'change' }
    //       break
    //     case 'huxi':
    //     case 'tizhong':
    //       rule = { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'change' }
    //       break
    //     case 'maibo':
    //     case 'xinlv':
    //     case 'shousuoya':
    //     case 'shuzhangya':
    //     case 'xuetang':
    //     case '':
    //       rule = { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur' }
    //       break
    //     case 'dabiancishu':
    //       rule = { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
    //       break
    //   }
    //   return rule
    // },
    // 记录右侧体征项、测量时间点是否有变动
    sign_form_change (e) {
      this.sign_form_change_flag = true
      this.beforeItemHourFlag = this.sign_form.itemHour
    }
  },
  watch: {
    // 选择时间点后获取时间点的类型
    'sign_form.itemHour' (val) {
      for (let i = 0; i < this.hours.length; i++) {
        let _d = this.hours[i]
        if (_d.measuringTime === +val) {
          this.sign_form.itemType = _d.type
          break
        }
      }
    },
    'patient': {
      async handler (val) {
        if (val.patientId) {
          this.sign_form.patientId = val.patientId
          this.inHospitalDate = (val.inTime || '').split(' ')[0]
          this.outHospitalDate = (val.outHospitalTime || '').split(' ')[0]
          this.getHospitalizationDate()
          this.$refs.sign_form && this.$refs.sign_form.resetFields()
          // // 重置时间和时间点
          this.sign_form.recordDate = moment().format('YYYY-MM-DD')
          this.sign_form.itemHour = this.firstItemHour
          this.sign_form.itemType = this.firstItemType
          if (this.sign_form.itemHour) {
            this.getFormDataByHour()
          }
        }
        await this.getSheetData()
      },
      immediate: true
    },
    // 体温输入非数字时，复测体温置空
    'sign_form.extendList': {
      handler (obj) {
        for (let i in obj) {
          let _d = obj[i]
          if (
            _d['itemCode'] === 'tiwen' &&
            (_d['signValue'] === '拒测' || _d['signValue'] === '外出' || _d['signValue'] === '不升' || _d['signValue'] === '请假')
          ) {
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
    TemperatureSheetSixShibo,
    TemperatureSheetSixShandong,
    TemperatureSheetSixShengli,
    TemperatureSheetFour,
    TemperatureSheetSix,
    EventWin: () => import('./EventWin')
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  @media screen and (max-width: 1550px) {
    .sign_show_btn {
      display: inline-block !important;
    }
    .sign_form.absolute {
      position: absolute;
      right: 0;
      background-color: #fff;

      .sign_show_btn {
        display: inline-block;
      }
    }
    .sheet_container {
      .buttons {
        text-align: left !important;
      }
    }

    .tool-bar {
      /deep/ .el-button {
        margin: 0 10px 10px 0
      }
    }
  }

  /deep/ .el-radio {
    /*margin-right: 20px;*/
  }

  /deep/ .tool-btn {
    border-bottom: 1px solid #E4E7ED;
  }

  .tool-bar {
    /deep/ .el-button {
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
    position: relative;

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
      padding: 13px 20px;
      text-align: right;
      position: relative;

      .el-button + .el-button {
        /*margin-left: 20px;*/
      }
    }
  }

  .sheet {
    flex: 1;
    height: 0;
    overflow: auto;
    padding: 20px 0 10%;
  }
  .shiboSheet{
    flex: 1;
    height: 0;
    overflow: hidden;
    padding-top: 20px;
  }

  .sign_form {
    border-left: 1px solid #e6e6e6;
    width: 437px;
    transition: all .25s;

    .el-form {
      padding: 13px 0 0px;
      &:nth-child(2) {
        flex: 1;
        overflow-y: auto;
      }
    }

    .save-btn {
      text-align: center;
      padding: 10px 0;
    }

    .sign_show_btn {
      display: none;
      position: absolute;
      top: 80px;
      left: -20px;
      padding: 7px 3px !important;
      background-color: #fff;
      z-index: 9;
      color: #1E87F0;
      border-color: #1E87F0;
      border-radius: 0 !important;
      border-right: none;
    }
  }

  /deep/ .el-form-item__label {
    padding-right: 8px;
  }

  /deep/ input[type='number'] {
    padding-right: 0;
  }

  .focus_window {
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
  }

  /*右侧tab样式修改*/
  .right_tabs {
    padding: 0 20px;

    /deep/ .el-tabs__nav-wrap {
      padding: 0 10px;
    }

    /deep/ .el-tabs__header {
      padding: 0;
      margin-bottom: 8px;
    }

    /deep/ .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2), .el-tabs--bottom .el-tabs__item.is-top:nth-child(2), .el-tabs--top .el-tabs__item.is-bottom:nth-child(2), .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      padding-left: 20px;
    }

    /deep/ .el-tabs__item {
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
  .sign_container {
    display: flex;
    padding-right: 20px;

    .sign_content {
      width: 235px;
    }

    .sign_unit {
      padding-left: 10px;
      width: auto;
    }
  }

  .el-select {
    width: 100%;
  }
</style>
<style type="text/scss" lang="scss">
  .right .el-tabs__content {
    top: 57px !important;
  }

  /*临床事件弹窗*/
  .eventDialogCss {
    .el-dialog__body {
      padding: 30px 0 0 0;
    }
  }
</style>
