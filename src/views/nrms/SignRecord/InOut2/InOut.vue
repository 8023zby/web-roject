<template>
  <div class="nrms-main-div">
    <layout class="nrms-blood-list">
      <div slot="right_btn" class="tool-bar" v-if="!isPreview">
        <el-button
                v-uni="'tizhengjiluchuruliangdan_xiaojie'"
          type="primary"
          size="small"
          @click="showSummary('small')"
          :disabled="btn_disable"
        >小结
        </el-button>
        <el-button
                v-uni="'tizhengjiluchuruliangdan_zongjie'"
          type="primary"
          size="small"
          @click="showSummary('big')"
          :disabled="btn_disable"
        >总结
        </el-button>
        <el-button v-uni="'tizhengjiluchuruliangdan_print'" type="success" size="small" @click="printDo">打印</el-button>
      </div>
      <div slot="main" class="main-list">
        <formHeader :autoHead="autoHead"></formHeader>
        <!--
                        <div class="nrms-blood-bigTit">
                          <div class="nrms-blood-hospitalTit">
                            xxxx附属医院
                          </div>
                          <div class="nrms-blood-labelTit">
                            出入量记录单
                          </div>
                        </div>
                        <div class="nrms-blood-tit">
                          <div class="nrms-blood-tit-span">姓名:{{patientData.patientName}}</div>
                          <div class="nrms-blood-tit-span">性别:{{patientData.sex}}</div>
                          <div class="nrms-blood-tit-span">年龄:{{patientData.patientAge}}</div>
                          <div class="nrms-blood-tit-span">科别:{{deptName}}</div>
                          <div class="nrms-blood-tit-span">床号:{{patientData.bedName}}</div>
                          <div class="nrms-blood-tit-span">入院时间:2019-07-29 12:12:13</div>
                          <div class="nrms-blood-tit-span">住院号:{{patientData.inpNo}}</div>
                        </div>-->
        <!--列表-->
        <el-table
          ref="table"
          :data="tableData"
          v-loading="loading"
          :span-method="arraySpanMethod"
          stripe
          highlight-current-row
          height="100%"
          class="table"
        >
          <!-- <el-table-column prop="id" align="center" width="73" label="序号">
            <template slot-scope="scope">
              {{ scope.row.selfIndex || '' }}
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            width="128"
            label="日期"
          >
            <template slot-scope="scope">
              <span style="color: #f56c6c" v-if="scope.row.type === 3">{{
                getTime(scope.row.recordTime, 'YYYY-MM-DD')
              }}</span>
              <span v-else>{{ getTime(scope.row.recordTime, 'YYYY-MM-DD') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="128"
            label="时间"
          >
            <template slot-scope="scope">
              <span style="color: #f56c6c" v-if="scope.row.type === 3">{{
                getTime(scope.row.recordTime, 'HH:mm')
              }}</span>
              <span v-else>{{ getTime(scope.row.recordTime, 'HH:mm') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入量（ml）" align="center">
            <el-table-column
              prop="intakeProject"
              align="center"
              show-overflow-tooltip
              label="入量项目"
              width="150"
            >
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type === 3">{{
                  scope.row.intakeMode
                }}</span>
                <span v-else-if="scope.row.type === 2">{{
                  scope.row.intakeMode
                }}</span>
                <span v-else>{{ scope.row.intakeProject }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="intakeAmount"
              align="center"
              show-overflow-tooltip
              label="入量"
            >
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type === 3">{{
                  scope.row.intakeAmount
                }}</span>
                <span v-else>{{ scope.row.intakeAmount }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="出量（ml）" align="center">
            <el-table-column
              prop="outputProject"
              align="center"
              show-overflow-tooltip
              label="出量项目"
              width="150"
            >
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type === 3">{{
                  scope.row.outputMode
                }}</span>
                <span v-else-if="scope.row.type === 2">{{
                  scope.row.outputMode
                }}</span>
                <span v-else>{{ scope.row.outputProject }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="outputAmount"
              align="center"
              show-overflow-tooltip
              label="出量"
            >
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type === 3">{{
                  scope.row.outputAmount
                }}</span>
                <span v-else>{{ scope.row.outputAmount }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="nurseName"
            align="center"
            :show-overflow-tooltip="true"
            min-width="100px"
            class-name="autograph"
            label="护士签名"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.nurseNameImage">
                <img
                  :src="scope.row.nurseNameImage"
                  style="width: 100%; height: 30px"
                />
              </template>
              <template v-else>
                <span style="color: #f56c6c" v-if="scope.row.type === 3">{{
                  scope.row.nurseName
                }}</span>
                <span v-else>{{ scope.row.nurseName }}</span>
              </template>
            </template>
          </el-table-column>
          <template v-if="!btn_disable">
            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope">
                <template v-if="scope.row.nurseRecordId">
                  <el-button v-uni:[scope.row.recordId]="'tizhengjiluchuruliangdan_edit'" type="text" disabled>编辑</el-button>
                  <el-button v-uni:[scope.row.recordId]="'tizhengjiluchuruliangdan_delete'" type="text" disabled>删除</el-button>
                </template>
                <template v-else>
                  <el-button v-uni:[scope.row.recordId]="'tizhengjiluchuruliangdan_edit'" @click="modify(scope.row)" type="text"
                  >编辑
                  </el-button>
                  <el-button v-uni:[scope.row.recordId]="'tizhengjiluchuruliangdan_delete'" type="textred" @click="del(scope.row)"
                  >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>

      <!--组件页码显示-->
      <page-info v-if="!isPreview"
        :pageInfo="pageInfo"
        @onSearchSubmit="onSearchSubmit"
        slot="footer"
        class="page-bar"
      ></page-info>
      <!--打印区域-->
      <div style="display: none">
        <print
          ref="print"
          :patientId="formSearchDataStatic.patientId"
          :printSet="printSet"
          :autoHead="autoHead"
        ></print>
      </div>
    </layout>
    <!-- 出院&&非出院召回 || 转科的患者不显示-->
    <template v-if="!btn_disable && !isPreview">
      <div
        class="el-col-add absolute"
        :style="{right:form_show_hide ? '-437px': 0}"
        id="add_form"
      >
        <el-button v-uni="'tizhengjiluchuruliangdan_expend'" size="small" class="form_show_btn" @click="formShowHide">
          <i
            :class="
              form_show_hide ? 'el-icon-arrow-left' : 'el-icon-arrow-right'
            "
          ></i>
        </el-button>
        <div style="overflow: auto; height: 100%; padding: 0 15px">
          <el-form
                  v-uni="'tizhengjiluchuruliangdan_form'"
            class="nrms-blood-add"
            :model="addFormData"
            :rules="rules"
            ref="addForm"
            label-width="90px"
          >
            <el-form-item
              label="日期:"
              prop="recordDate"
              class="time_form_item"
            >
              <el-date-picker
                      v-uni="'tizhengjiluchuruliangdan_date'"
                v-model="addFormData.recordDate"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                :clearable="false"
                placeholder="请选择日期"
                @keydown.native="nextFocus"
                class="control-input"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="时间:"
              prop="time"
              class="time_form_item"
            >
              <el-time-picker
                      v-uni:[index]="'tizhengjiluchuruliangdan_time'"
                      v-model="addFormData.time"
                value-format="HH:mm"
                format="HH:mm"
                type="time"
                :clearable="false"
                placeholder="请选择时间"
                @keydown.native="nextFocus"
                class="control-input"
              >
              </el-time-picker>
            </el-form-item>
            <el-row>
              <el-col :span="20"
              ><span style="font-size: 16px; margin-left: 31px; color: #333"
              >入量:</span
              >
              </el-col>
              <el-col :span="4">
                <i
                  @click.prevent="addItem('intakeList')"
                  class="el-icon-circle-plus-outline iconAddCls"
                ></i
                ></el-col>
              <el-col style="margin-top: 5px">
                <!--<fieldset v-if="addFormData.intakeList.length===0">-->
                <!--<legend>入量:</legend>-->
                <!--&lt;!&ndash;<div class="nrms-blood-img">&ndash;&gt;-->
                <!--&lt;!&ndash;<i @click.prevent="addItem('intakeList')" class="el-icon-circle-plus-outline iconAddCls"></i>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--</fieldset>-->
                <fieldset
                  v-for="(item, index) in addFormData.intakeList"
                  :key="index"
                >
                  <legend>入量{{ index + 1 }}:</legend>
                  <div class="nrms-blood-img">
                    <i
                      @click.prevent="removeItem('intakeList', item)"
                      class="el-icon-remove-outline iconDelCls"
                    ></i>
                  </div>
                  <el-form-item
                    label-width="80px"
                    label="入量项目:"
                    :prop="'intakeList.' + index + '.project'"
                    :rules="{
                      message: '入量项目不超过10个字符！',
                      trigger: 'change',
                      pattern: /^.{0,10}$/,
                    }"
                  >
                    <el-select
                            v-uni:[index]="'tizhengjiluchuruliangdan_ruliangxiangmu'"
                      filterable
                      allow-create
                      v-model="item.project"
                      placeholder="请选择"
                      clearable
                      :id="'ruliangxiangmu' + index"
                      @keydown.native="nextFocus"
                      class="control-input"
                    >
                      <el-option
                        v-for="(item, index) in inProject"
                        :key="index"
                        :label="item.signItemShowName"
                        :value="item.signItemShowName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label-width="80px"
                    label="入量:"
                    :prop="'intakeList.' + index + '.amount'"
                    :rules="[
                      {
                        required: true,
                        message: '请输入入量！',
                        trigger: 'blur',
                      },
                      {
                        message: '请输入正确的数字！',
                        trigger: 'blur',
                        pattern: /^\d+(\.\d+)?$/,
                      },
                      {
                        message: '入量长度不超过5个字符！',
                        trigger: 'blur',
                        pattern: /^.{0,5}$/,
                      },
                    ]"
                  >
                    <el-input
                            v-uni:[index]="'tizhengjiluchuruliangdan_ruliang'"
                      v-model="item.amount"
                      placeholder="入量"
                      clearable
                      :id="'ruliang' + index"
                      @keydown.native="nextFocus"
                      class="control-input"
                    ></el-input>
                    ml
                  </el-form-item>
                </fieldset>
              </el-col>
              <el-col :span="20"
              ><span style="font-size: 16px; margin-left: 31px; color: #333"
              >出量:</span
              >
              </el-col>
              <el-col :span="4">
                <i
                  @click.prevent="addItem('outputList')"
                  class="el-icon-circle-plus-outline iconAddCls"
                ></i
                ></el-col>
              <el-col style="margin-top: 5px">
                <!--<fieldset v-if="addFormData.outputList.length===0">-->
                <!--<legend>出量1:</legend>-->
                <!--&lt;!&ndash;<div class="nrms-blood-img">&ndash;&gt;-->
                <!--&lt;!&ndash;<i @click.prevent="addItem('outputList')" class="el-icon-circle-plus-outline iconAddCls"></i>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--</fieldset>-->
                <fieldset
                  v-for="(item, index) in addFormData.outputList"
                  :key="index"
                >
                  <legend>出量{{ index + 1 }}:</legend>
                  <div class="nrms-blood-img">
                    <i
                      @click.prevent="removeItem('outputList', item)"
                      class="el-icon-remove-outline iconDelCls"
                    ></i>
                  </div>
                  <el-form-item
                    label-width="80px"
                    label="出量项目:"
                    :prop="'outputList.' + index + '.project'"
                    :rules="{
                      message: '出量项目不超过10个字符！',
                      trigger: 'change',
                      pattern: /^.{0,10}$/,
                    }"
                  >
                    <el-select
                            v-uni:[index]="'tizhengjiluchuruliangdan_chuliangxiangmu'"
                      filterable
                      allow-create
                      v-model="item.project"
                      placeholder="请选择"
                      clearable
                      :id="'chuliangxiangmu' + index"
                      @keydown.native="nextFocus"
                      class="control-input"
                    >
                      <el-option
                        v-for="(item, index) in outProject"
                        :key="index"
                        :label="item.signItemShowName"
                        :value="item.signItemShowName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label-width="80px"
                    label="出量:"
                    :prop="'outputList.' + index + '.amount'"
                    :rules="[
                      {
                        required: true,
                        message: '请输入出量！',
                        trigger: 'blur',
                      },
                      {
                        message: '请输入正确的数字！',
                        trigger: 'blur',
                        pattern: /^\d+(\.\d+)?$/,
                      },
                      {
                        message: '出量长度不超过5个字符！',
                        trigger: 'blur',
                        pattern: /^.{0,5}$/,
                      },
                    ]"
                  >
                    <el-input
                            v-uni:[index]="'tizhengjiluchuruliangdan_chuliangchuliang'"
                      v-model="item.amount"
                      placeholder="请输入"
                      clearable
                      :id="'chuliang' + index"
                      @keydown.native="nextFocus"
                      class="control-input"
                    ></el-input>
                    ml
                  </el-form-item>
                </fieldset>
              </el-col>
            </el-row>
            <!--<el-form-item label="护士签名:" prop="nurseName">-->
            <!--<el-input disabled v-model="addFormData.nurseName" placeholder="请输入护士签名" clearable></el-input>-->
            <!--</el-form-item>-->
          </el-form>
          <div class="typt-add-footer btn_footer" v-if="!isPreview">
            <el-button v-uni="'tizhengjiluchuruliangdan_cancel'" @click="reloadUrl">取消</el-button>
            <el-button v-uni="'tizhengjiluchuruliangdan_save'" type="primary" @click="saveData" :loading="addVis"
            >保存
            </el-button
            >
          </div>
        </div>
      </div>
    </template>
    <!--小结-->
    <el-dialog
      :title="summary.tit"
      :visible.sync="summary.summaryVis"
      width="600px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form
              v-uni="'tizhengjiluchuruliangdan_xiaojieform'"
              ref="briefSummary"
        class="typt-add-dialog"
        label-width="120px"
        :rules="rules_summary"
        :model="summary.summaryData"
      >
        <el-form-item label="时间:" prop="startTime">
          <el-date-picker
                  v-uni="'tizhengjiluchuruliangdan_xiaojietime'"
            @change="changeTime"
            class="smallInput"
            v-model="summary.summaryData.recordTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            :clearable="false"
            placeholder="请选择时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结量开始时间:" prop="startTime">
          <el-date-picker
                  v-uni="'tizhengjiluchuruliangdan_xiaojiebegintime'"
            class="smallInput"
            v-model="summary.summaryData.startTime"
            type="datetime"
            default-time="07:00:00"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择开始时间"
            @change="changeSummaryDataTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结量结束时间:" prop="endTime">
          <el-date-picker
                  v-uni="'tizhengjiluchuruliangdan_xiaojieendtime'"
            class="smallInput"
            v-model="summary.summaryData.endTime"
            type="datetime"
            default-time="16:00:00"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="请选择结束时间"
            @change="changeSummaryDataTime"
          >
          </el-date-picker>
          <!--  <div v-if="summaryFlag === 'yes'" style="color: #f56c6c;font-size: 12px;">
                          已经添加{{summary.summaryData.recordTime.substr(0,10)+summary.tit}}, 不可重复添加
                      </div>-->
        </el-form-item>
        <!-- 省立增加时间段下拉 -->
        <el-form-item label="时间段:">
          <el-select
                  v-uni="'tizhengjiluchuruliangdan_xiaojietimepart'"
            v-model="summary.summaryData.pointFlag"
            filterable
            clearable
            placeholder="请选择时间段">
            <el-option
              v-for="(value,index) in timePart"
              :key="index"
              :label="value.label"
              :value="value.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入量项目名称:">
          <el-input
                  v-uni="'tizhengjiluchuruliangdan_xiaojiebegininputSummaryName'"
            clearable
            v-model="summary.summaryData.inputSummaryName"
            maxlength="10"
            placeholder="请输入"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="出量项目名称:">
          <el-input
                  v-uni="'tizhengjiluchuruliangdan_xiaojiebeginoutSummaryName'"
            clearable
            v-model="summary.summaryData.outSummaryName"
            maxlength="10"
            placeholder="请输入"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-button v-uni="'tizhengjiluchuruliangdan_xiaojiesyncTemperature'" type="warning" @click="syncTemperature" v-if="summary.summaryData.type == 3">插入体温单</el-button>
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button v-uni="'tizhengjiluchuruliangdan_xiaojiecancel'" @click="cancelSummaryAdd">取消</el-button>
        <!-- <el-button v-if="summaryFlag === 'yes'" type="info" disabled @click="saveSummaryData" :loading="addVis">
                     确认
                 </el-button>-->
        <el-button v-uni="'tizhengjiluchuruliangdan_xiaojieconfirm'" type="primary" @click="saveSummaryData" :loading="addVis"
        >确认
        </el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseManage from '../../../../assets/nrms/mixins/BaseManage'
import PageInfo from '../../../../components/nrms/PageInfo'
import { MsgShow } from '../../../../assets/nrms/js/Message'
import { DateFormate } from '../../../../assets/nrms/js/Unitils'
import { ApiSignItem, ApiAutoForm, ApiNurseNotes, ApiIntakeOutput } from '../../../../api/nrms/index'
import { AxiosApi } from '../../../../api/nrms/http/index'
import layout from '../../../../components/nrms/layout/list'
import formHeader from '../../../../components/nrms/autoForm/header'
import print from './Print'
import moment from 'moment'
const $ = require('jquery')

const timePart = [
  {
    label: '24小时',
    value: '24小时'
  },
  {
    label: '23小时',
    value: '23小时'
  },
  {
    label: '22小时',
    value: '22小时'
  },
  {
    label: '21小时',
    value: '21小时'
  },
  {
    label: '20小时',
    value: '20小时'
  },
  {
    label: '19小时',
    value: '19小时'
  },
  {
    label: '18小时',
    value: '18小时'
  },
  {
    label: '17小时',
    value: '17小时'
  },
  {
    label: '16小时',
    value: '16小时'
  },
  {
    label: '15小时',
    value: '15小时'
  },
  {
    label: '14小时',
    value: '14小时'
  },
  {
    label: '13小时',
    value: '13小时'
  },
  {
    label: '12小时',
    value: '12小时'
  },
  {
    label: '11小时',
    value: '11小时'
  },
  {
    label: '10小时',
    value: '10小时'
  },
  {
    label: '09小时',
    value: '09小时'
  },
  {
    label: '08小时',
    value: '08小时'
  },
  {
    label: '07小时',
    value: '07小时'
  },
  {
    label: '06小时',
    value: '06小时'
  },
  {
    label: '05小时',
    value: '05小时'
  },
  {
    label: '04小时',
    value: '04小时'
  },
  {
    label: '03小时',
    value: '03小时'
  },
  {
    label: '02小时',
    value: '02小时'
  },
  {
    label: '01小时',
    value: '01小时'
  }
]

export default {
  name: 'InOut',
  components: { PageInfo, layout, formHeader, print },
  mixins: [BaseManage],
  props: ['patient', 'patientType', 'formObj', 'isPreview'],
  watch: {
    patient: {
      handler (newValue, oldValue) {
        this.patientData = this.patient
        this.formSearchDataStatic.patientId = this.patient.patientId
        this.publicObj.patientId = this.patient.patientId
        this.pageInfo.currentPage = 1
        this.getSummaryData()
        this.getData()
        this.getFormInfo('update')
      },
      immediate: true
    }
  },
  computed: {
    btn_disable: function () {
      // 出院&&非出院召回 || 转科
      if (
        (this.patientType === 2 && this.patient.outHospitalFlag !== 1) ||
          this.patientType === 1
      ) {
        return true
      }
      return false
    }
  },
  data () {
    return {
      summaryFlag: true,
      form_show_hide: true,
      deptName: '',
      actFlag: 'add',
      patientData: {},
      modeObj: [
        {
          id: '空',
          label: '空'
        },
        {
          id: '医嘱',
          label: '医嘱'
        }
      ],
      // 总结
      summary: {
        tit: '总结',
        summaryVis: false,
        summaryData: {
          type: 3,
          recordTime: '',
          startTime: '',
          endTime: '',
          nurseName: '',
          pointFlag: '',
          inputSummaryName: '总结入量',
          outSummaryName: '总结出量'
        }
      },
      publicObj: {
        patientId: '',
        deptId: ''
      },
      // 添加数据
      addFormData: {
        recordId: '',
        recordDate: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm'),
        intakeList: [
          {
            mode: '',
            project: '',
            standby: '',
            amount: ''
          }
        ],
        outputList: [],
        type: 1,
        nurseName: ''
      },
      contentNum: {
        intakeList: 1,
        outputList: 0
      },
      inProject: [],
      outProject: [],
      rules_summary: {
        endTime: [{ required: true, message: '请选择结量结束时间！' }],
        startTime: [{ required: true, message: '请选择结量开始时间！' }]
      },
      rules: {
        // recordTime: [
        //   { required: true, message: '请选择时间！' }
        // ],
        // nurseName: [
        //   { required: true, message: '请填写护士签名！' }
        // ]
      },
      modelName: '出入量记录',
      formSearchDataStatic: {
        patientId: ''
      },
      oldData: {
        recordDate: ''
      },
      allSummaryData: {},
      allSmallData: {},
      url: '/nrms/web-nr/intake-output',
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      showHead: false,
      nurseName: '',
      printSet: '', // 打印样式 横版或者竖版
      timePart
    }
  },
  created () {
    this.patientData = this.patient
    let obj = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.addFormData.nurseName = obj.empId || ''
    this.nurseName = obj.empId || ''
    let curDate = this.initDate()
    this.summary.summaryData.recordTime = new Date(curDate)
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.publicObj.deptId = deptInfo.deptId || ''
    this.deptName = deptInfo.deptName || ''
    this.formSearchDataStatic.patientId = this.patient.patientId
    this.publicObj.patientId = this.patient.patientId || ''
    this.getSummaryData()
    this.getData()
    this.getFormInfo()
    this.getSignById()
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 回车跳到下一个可获得焦点的元素
    nextFocus (e) {
      let element = e.target
      let allinput = $('#add_form .control-input input')
      let index = 0
      allinput.each((i, el) => {
        if (element == el) {
          index = i
        }
      })
      const keyCode = e.keyCode || e.which || e.charCode
      let type = 'input'
      if (element.parentNode.parentNode.classList.contains('el-select')) {
        type = 'select'
      } else if (element.parentNode.classList.contains('el-date-editor')) {
        type = 'date'
      }
      console.log(type)
      // 输入框或者下拉
      let focusE = null
      // 回车 13 下 40 左 37 右 39 上 38
      if (keyCode === 13 || keyCode === 39 || keyCode === 40) {
        // 回车 右 下
        if (index < allinput.length) {
          if (type == 'input') {
            focusE = allinput[index + 1]
          } else {
            if (keyCode === 13) {
              focusE = allinput[index + 1]
            }
          }
        }
      } else if (keyCode === 37 || keyCode === 38) {
        // 上 左
        if (index > 0) {
          if (type == 'input' || type == 'select') {
            focusE = allinput[index - 1]
          }
        }
      }
      focusE && focusE.focus()
    },
    getFormInfo (_type) {
      this.autoHead.tplData = this.patient || null
      this.autoHead.tplId = this.formObj.formCode || ''
      this.autoHead.formName = this.formObj.formName || ''
      this.autoHead.tplHtml = this.formObj.formStyle || ''
      this.formObj.formId = this.formObj.formId || ''
      this.printSet = this.formatPrintSet(
        this.formObj.printSet ? this.formObj.printSet : 1
      ) // 默认纵向打印
      this.showHead = true
    },
    /**
       * @description: 根据表单id获取体征项
       * @param {*}
       * @return {*}
       */
    getSignById () {
      ApiNurseNotes.getFixedListItem({ formId: this.formObj.formId }).then(res => {
        let list = res.data
        list.map(item => {
          if (item.signItemFieldName == 'ruliang') {
            this.inProject = item.childrenSignItem.filter(v => v.signInOutType == 1)
          } else if (item.signItemFieldName == 'shiruliangfuqin') {
            this.outProject = item.childrenSignItem.filter(v => v.signInOutType == 2)
          }
        })
      })
    },

    formShowHide () {
      this.form_show_hide = !this.form_show_hide
    },
    // 获取小结 总结
    getSummaryData () {
      if (!this.patient.patientId) return false
      AxiosApi(`/nrms/web-nr/intake-output/summary`, {}, 'GET', {
        patientId: this.patient.patientId
      }).then((res) => {
        if (res.status === 200) {
          this.allSmallData = {}
          this.allSummaryData = {}
          if (!res.data || !res.data.length) {
            return
          }
          res.data.forEach((item) => {
            if (item.type === 2) {
              this.allSmallData[item.beginTime.substr(0, 10)] = 'yes'
            }
            if (item.type === 3) {
              this.allSummaryData[item.beginTime.substr(0, 10)] = 'yes'
            }
          })
        }
      })
    },
    // 时间变化
    changeTime () {
      let curDate = ''
      let endDate = ''
      this.summaryFlag = ''
      if (this.summary.summaryData.type === 2) {
        curDate = this.initDate('small', this.summary.summaryData.recordTime)
        endDate = curDate.replace('07:00', '19:00')
        this.summaryFlag = this.allSmallData[curDate.substr(0, 10)] || ''
      } else {
        curDate = this.initDate('', this.summary.summaryData.recordTime)
        endDate = this.initDate('small', this.summary.summaryData.recordTime)
        this.summaryFlag = this.allSummaryData[curDate.substr(0, 10)] || ''
      }
      if (
        this.actFlag === 'modify' &&
          this.oldData.recordDate ===
          this.summary.summaryData.recordTime.substr(0, 10)
      ) {
        this.summaryFlag = ''
      }
      this.summary.summaryData.startTime = curDate
      this.summary.summaryData.endTime = endDate
    },
    // 取消添加
    cancelSummaryAdd () {
      this.addVis = false
      this.summary.summaryVis = false
      this.actFlag = 'add'
    },
    // 合并行
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
          columnIndex === 1 ||
          columnIndex === 2 ||
          columnIndex === 7 ||
          columnIndex === 8
      ) {
        return {
          rowspan: row.rowCount,
          colspan: 1
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
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
    // 保存数据
    saveData () {
      this.addFormData.recordTime = moment(`${this.addFormData.recordDate} ${this.addFormData.time}`).format('YYYY-MM-DD HH:mm')
      let _time = this.getCurrentSecond(this.addFormData.recordTime)
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.actFlag === 'add') {
            this.addFormData = Object.assign(this.addFormData, this.publicObj)
          }
          if (!this.addFormData.patientId) {
            this.$message.warning('请选择病人！')
            return
          }
          if (
            this.addFormData.intakeList.length === 0 &&
              this.addFormData.outputList.length === 0
          ) {
            this.$message.warning('请至少填写一个出量或者入量！')
            return
          }
          this.addFormData.recordTime = _time
          this.saveDataDo(this.addFormData, this.actFlag)
        }
      })
    },
    // 修改
    modify (row) {
      console.log(row)
      this.actFlag = 'modify'
      if (row.type === 2 || row.type === 3) {
        this.modifySummary(row)
        return false
      }
      AxiosApi(`${this.url}/record-id`, {}, 'GET', {
        recordId: row.recordId
      }).then((res) => {
        let data = res.data
        data.nurseName = this.nurseName
        this.addFormData = {
          ...data,
          recordDate: moment(data.recordTime).format('YYYY-MM-DD'),
          time: moment(data.recordTime).format('HH:mm')
        }
      })
    },
    // 形成时间
    initDate (act = '', day = '') {
      let date = new Date()
      if (day !== '') {
        date = new Date(day)
      }
      if (act === '') {
        date.setTime(date.getTime() - 24 * 60 * 60 * 1000)
      }
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      return y + '-' + m + '-' + d + ' 07:00'
    },
    // 修改
    modifySummary (row) {
      this.summaryFlag = ''
      if (row.type === 2) {
        this.summary.tit = '小结'
      } else {
        this.summary.tit = '总结'
      }
      let pointFlag = ''
      let inputSummaryName = row.intakeMode
      let outSummaryName = row.outputMode
      if (row.intakeMode.indexOf('时') >= 0) {
        pointFlag = row.intakeMode.slice(0, row.intakeMode.indexOf('时') + 1)
      }
      if (pointFlag) {
        inputSummaryName = row.intakeMode.slice(row.intakeMode.indexOf('时') + 1, row.intakeMode.length)
        outSummaryName = row.outputMode.slice(row.outputMode.indexOf('时') + 1, row.outputMode.length)
      }
      AxiosApi(`${this.url}/record-id`, {}, 'GET', {
        recordId: row.recordId
      }).then((res) => {
        let data = res.data
        this.summary.summaryData = data
        this.summary.summaryData.pointFlag = pointFlag
        this.summary.summaryData.inputSummaryName = inputSummaryName
        this.summary.summaryData.outSummaryName = outSummaryName
        this.oldData.recordDate = data.recordTime.substr(0, 10)
      })
      this.summary.summaryVis = true
    },
    // 小结
    showSummary (act) {
      let curDate = this.initDate()
      let endDate = ''
      let inputSummaryName = '总结入量'
      let outSummaryName = '总结出量'
      if (act === 'small') {
        curDate = this.initDate(act)
        endDate = curDate.replace('07:00', '16:00')
        this.summaryFlag = this.allSmallData[curDate.substr(0, 10)] || ''
        inputSummaryName = '小结入量'
        outSummaryName = '小结出量'
      } else {
        this.summaryFlag = this.allSummaryData[curDate.substr(0, 10)] || ''
      }
      this.oldData.recordDate = ''
      let obj = {
        type: 3,
        nurseName: this.nurseName,
        recordTime: DateFormate.getNowFormatDate(),
        startTime: DateFormate.getNowFormatDate(new Date(curDate)),
        endTime: DateFormate.getNowFormatDate(new Date(endDate)),
        pointFlag: '',
        inputSummaryName,
        outSummaryName
      }
      this.summary.summaryData = Object.assign(
        this.summary.summaryData,
        this.publicObj,
        obj
      )
      if (act === 'small') {
        this.summary.tit = '小结'
        this.summary.summaryData.type = 2
      } else {
        this.summary.tit = '总结'
        let d = this.initDate('small')
        this.summary.summaryData.endTime = DateFormate.getNowFormatDate(
          new Date(d)
        )
      }
      // 自动计算时间段
      this.summary.summaryData.pointFlag = this.calculatePointFlag(this.summary.summaryData.startTime, this.summary.summaryData.endTime)
      this.summary.summaryVis = true
    },
    // 保存小结
    saveSummaryData () {
      let _time1 = this.getCurrentSecond(this.summary.summaryData.recordTime)
      let _time2 = this.getCurrentSecond(this.summary.summaryData.startTime)
      let _time3 = this.getCurrentSecond(this.summary.summaryData.endTime)
      this.$refs['briefSummary'].validate((valid) => {
        if (valid) {
          if (!this.summary.summaryData.patientId) {
            this.$message.warning('请选择病人！')
            return
          }
          if (_time2 > _time3) {
            MsgShow('error', '开始时间不能早于结束时间！')
            return
          }
          this.summary.summaryData.nurseName = this.nurseName
          this.summary.summaryData.recordTime = _time1
          this.summary.summaryData.startTime = _time2
          this.summary.summaryData.endTime = _time3
          this.saveDataDo(this.summary.summaryData, this.actFlag)
        }
      })
    },
    reload () {
      this.reloadUrl()
    },
    // 刷新页面
    reloadUrl () {
      this.actFlag = 'add'
      this.addVis = false
      this.summary.summaryVis = false
      this.contentNum = {
        intakeList: 1,
        outputList: 1
      }
      let obj = {
        recordId: '',
        recordDate: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm'),
        intakeList: [
          {
            mode: '',
            project: '',
            standby: '',
            amount: ''
          }
        ],
        outputList: []
      }
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
        this.addFormData = Object.assign(this.addFormData, this.publicObj, obj)
        this.getData()
        this.getSummaryData()
      })
    },
    // 添加多个
    addItem (act) {
      if (act === 'intakeList') {
        if (this.contentNum.intakeList < 5) {
          this.addFormData.intakeList.push({
            mode: '',
            project: '',
            standby: '',
            amount: ''
          })
          this.contentNum.intakeList++
        } else {
          MsgShow('warning', '最多添加五个入量！')
        }
      } else if (act === 'outputList') {
        if (this.contentNum.outputList < 5) {
          this.addFormData.outputList.push({
            mode: '',
            project: '',
            characters: '',
            amount: ''
          })
          this.contentNum.outputList++
        } else {
          MsgShow('warning', '最多添加五个出量！')
        }
      }
    },
    // 删除多个
    removeItem (act, item) {
      let index
      if (act === 'intakeList') {
        index = this.addFormData.intakeList.indexOf(item)
        if (index !== -1) {
          this.addFormData.intakeList.splice(index, 1)
        }
        this.contentNum.intakeList--
      } else if (act === 'outputList') {
        index = this.addFormData.outputList.indexOf(item)
        if (index !== -1) {
          this.addFormData.outputList.splice(index, 1)
        }
        this.contentNum.outputList--
      }
    },
    // 格式化打印方式
    formatPrintSet (_printSet) {
      switch (_printSet) {
        case 1:
          return 'portrait'
          break
        case 2:
          return 'landscape'
          break
        default:
          return 'portrait'
          break
      }
    },
    printDo () {
      this.$refs.print.print()
    },
    // 字符串截取
    strSub (str, len) {
      if (str === null || str === '') {
        return ''
      }
      return ('' + str).substring(0, len)
    },
    /**
       * @description: 计算时间段
       * @param {*}
       * @return {*}
       */
    calculatePointFlag (startTime, endTime) {
      let hours = Math.round(moment(endTime).diff(moment(startTime), 'hours', true))
      if (hours <= 0) {
        return ''
      } else if (hours >= 24) {
        return '24小时'
      } else {
        let pointFlag = ''
        this.timePart.map(item => {
          if (parseInt(item.value) == hours) {
            pointFlag = item.value
          }
        })
        return pointFlag
      }
    },
    /**
       * @description: 当总结小结时间改变
       * @param {*}
       * @return {*}
       */
    changeSummaryDataTime () {
      this.summary.summaryData.pointFlag = this.calculatePointFlag(this.summary.summaryData.startTime, this.summary.summaryData.endTime)
      this.$forceUpdate()
    },
    /**
       * @description: 同步体温单
       * @param {*}
       * @return {*}
       */
    async syncTemperature () {
      this.summary.summaryData.recordTime = this.getCurrentSecond(this.summary.summaryData.recordTime)
      this.summary.summaryData.startTime = this.getCurrentSecond(this.summary.summaryData.startTime)
      this.summary.summaryData.endTime = this.getCurrentSecond(this.summary.summaryData.endTime)
      let params = {
        ...this.summary.summaryData,
        pointFlag: this.summary.summaryData.pointFlag ? this.summary.summaryData.pointFlag.replace('小时', 'h') : ''
      }
      try {
        await ApiIntakeOutput.syncTemperature(params)
        this.$message.success('插入体温单成功')
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    getTime (time, format = 'YYYY-MM-DD HH:mm') {
      return moment(time).format(format)
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/nrms/css/self_common";

  /* 签名 */
  /deep/ .autograph {
    padding: 0 !important;
  }

  @media screen and (max-width: 1550px) {
    .form_show_btn {
      display: inline-block !important;
    }
    .el-col-add.absolute {
      position: absolute;
      right: 0;
      z-index: 100;
      background-color: #fff;

      .form_show_btn {
        display: inline-block;
      }
    }
  }

  /deep/ .tool-btn {
    border-bottom: 1px solid #e4e7ed;
  }

  .form_show_btn {
    display: none;
    position: absolute;
    top: 80px;
    left: -22px;
    padding: 7px 3px !important;
    background-color: #fff;
    z-index: 9;
    color: #1e87f0;
    border-color: #1e87f0;
    border-radius: 0 !important;
    border-right: none;
  }

  /deep/ .main-list {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;

    .el-table {
      flex: 1;
    }
  }

  /deep/ .el-pagination.is-background .btn-next.disabled,
  /deep/ .el-pagination.is-background .btn-next:disabled,
  /deep/ .el-pagination.is-background .btn-prev.disabled,
  /deep/ .el-pagination.is-background .btn-prev:disabled,
  /deep/ .el-pagination.is-background .el-pager li.disabled {
    color: #fff;
  }

  .nrms-main-div {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .nrms-blood-add {
    margin-top: 40px;

    /deep/ .el-form-item__label {
      padding-right: 8px;
    }

    /deep/ .time_form_item {
      margin-bottom: 30px;
    }

    /deep/ .el-input,
    /deep/ .el-select,
    /deep/ .el-textarea,
    /deep/ .el-date-editor.el-input {
      width: 250px;
    }
  }

  .nrms-blood-list {
    height: 100%;
    width: 0;
    flex: 1;
  }

  .el-col-add {
    width: 437px;
    height:100%;
    transition: all .25s;
    border-left: 1px solid #e6e6e6;

    > div {
      display: flex;
      flex-direction: column;

      .el-form {
        flex: 1;
        overflow-y: auto;
      }
    }
  }

  .el-col {
    fieldset {
      border: 1px solid #e6e6e6;
      padding: 30px 10px 0 10px;
      position: relative;

      .el-form {
        margin-left: 0px !important;
      }

      margin-bottom: 30px;
    }

    legend {
      color: #333333 !important;
      margin-left: 20px;
      font-size: 16px !important;
      width: auto;
    }

    .iconAddCls {
      font-size: 24px;
      color: #409eff;
      cursor: pointer;
      margin-left: 30px;
      vertical-align: middle;
    }

    .iconDelCls {
      font-size: 24px;
      color: #f56c6c;
      cursor: pointer;
      margin-left: 10px;
      vertical-align: middle;
    }

    .nrms-blood-img {
      text-align: right;
      position: absolute;
      top: 18px;
      right: 10px;
    }
  }

  .btn_footer {
    margin: 10px 0;
  }
  /deep/.table .cell.el-tooltip {
    width: 100%!important;
  }
</style>
<style lang="scss" type="text/scss">
  .el-message-box__wrapper .el-message-box .el-message-box__btns {
    padding-top: 0;
  }
</style>
