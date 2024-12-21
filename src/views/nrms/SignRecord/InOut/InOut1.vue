<template>
  <div class="nrms-main-div">
    <layout class="nrms-blood-list">
      <div slot="right_btn" class="tool-bar">
        <el-button type="primary" size="small" @click="showSummary('small')">小结</el-button>
        <el-button type="primary" size="small" @click="showSummary('big')">总结</el-button>
        <el-button type="success" size="small" @click="$emit('option-changed', 'print')">打印预览</el-button>
      </div>
      <div slot="main" class="main-list">
        <formHeader :autoHead="autoHead" ></formHeader>
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
          <div class="nrms-blood-tit-span">姓名：{{patientData.patientName}}</div>
          <div class="nrms-blood-tit-span">性别：{{patientData.sex}}</div>
          <div class="nrms-blood-tit-span">年龄：{{patientData.patientAge}}</div>
          <div class="nrms-blood-tit-span">科别：{{deptName}}</div>
          <div class="nrms-blood-tit-span">床号：{{patientData.bedName}}</div>
          <div class="nrms-blood-tit-span">入院时间：2019-07-29 12:12:13</div>
          <div class="nrms-blood-tit-span">住院号：{{patientData.inpNo}}</div>
        </div>-->
        <!--列表-->
        <el-table
          ref="table"
          :data="tableData"
          v-loading="loading"
          :span-method="arraySpanMethod"
          height="100%"
        >
          <!-- <el-table-column
            prop="id"
            align="center"
            width="60"
            label="序号">
          </el-table-column> -->
          <el-table-column
            prop="recordTime"
            align="center"
            width="150"
            label="时间">
            <template slot-scope="scope">
              <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.recordTime}}</span>
              <span v-else>{{scope.row.recordTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="入量（ml）" align="center">
            <el-table-column
              prop="intakeMode"
              align="center"
              :show-overflow-tooltip="true"
              label="方式">
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.intakeMode}}</span>
                <span v-else>{{scope.row.intakeMode}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="intakeProject"
              align="center"
              :show-overflow-tooltip="true"
              label="项目">
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.intakeProject}}</span>
                <span v-else>{{scope.row.intakeProject}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="intakeStandby"
              align="center"
              :show-overflow-tooltip="true"
              label="备用量">
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.intakeStandby}}</span>
                <span v-else>{{scope.row.intakeStandby}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="intakeAmount"
              align="center"
              :show-overflow-tooltip="true"
              label="实入量">
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.intakeAmount}}</span>
                <span v-else>{{scope.row.intakeAmount}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="出量（ml）" align="center">
            <el-table-column
              prop="outputMode"
              align="center"
              :show-overflow-tooltip="true"
              label="方式">
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.outputMode}}</span>
                <span v-else>{{scope.row.outputMode}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="outputProject"
              align="center"
              :show-overflow-tooltip="true"
              label="项目">
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.outputProject}}</span>
                <span v-else>{{scope.row.outputProject}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="outputCharacters"
              align="center"
              :show-overflow-tooltip="true"
              label="性状">
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.outputCharacters}}</span>
                <span v-else>{{scope.row.outputCharacters}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="outputAmount"
              align="center"
              :show-overflow-tooltip="true"
              label="量">
              <template slot-scope="scope">
                <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.outputAmount}}</span>
                <span v-else>{{scope.row.outputAmount}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="nurseName"
            align="center"
            :show-overflow-tooltip="true"
            label="护士签名">
            <template slot-scope="scope">
              <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.nurseName}}</span>
              <span v-else>{{scope.row.nurseName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="130">
            <template slot-scope="scope">
              <el-button type="text" :disabled="btn_disable" @click="modify(scope.row)">编辑</el-button>
              <el-button type="textred" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--组件页码显示-->
      <page-info :pageInfo="pageInfo" @onSearchSubmit="onSearchSubmit" slot="footer" class="page-bar"></page-info>
    </layout>

    <div class="el-col-add" :style="{width: form_show_hide ? '350px' : 0}" id="add_form">
      <el-button size="small" class="form_show_btn" @click="formShowHide">
        <i :class="form_show_hide ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
      </el-button>
      <div style="overflow: auto; height: 100%; padding: 0 15px">
        <el-form class="nrms-blood-add" :model="addFormData" :rules="rules" ref="addForm" label-width="100px">
          <el-form-item label="时间：" prop="recordTime">
            <el-date-picker
              v-model="addFormData.recordTime"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              :clearable="false"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <div style="padding-left: 31px;">入量</div>
            </el-col>
            <el-col :span="12" style="position: relative">
              <div style="position: absolute;top: 0px;right: 12px;">
                <i @click.prevent="addItem('intakeList')" class="el-icon-circle-plus-outline iconAddCls"></i>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <fieldset v-if="addFormData.intakeList.length===0">
                <legend>入量</legend>

              </fieldset>
              <fieldset v-for="(item, index) in addFormData.intakeList" :key="index">
                <legend>入量{{index+1}}</legend>
                <div class="nrms-blood-img">
                  <!--<i @click.prevent="addItem('intakeList')" class="el-icon-circle-plus-outline iconAddCls"></i>-->
                  <i @click.prevent="removeItem('intakeList', item)" class="el-icon-remove-outline iconDelCls"></i>
                </div>
                <el-form-item label-width="80px" label="方式：" :prop="'intakeList.'+index+'.mode'"
                              :rules="{
                              message: '入量方式不超过10个字符！', trigger: 'change', pattern: /^.{0,10}$/
                            }">
                  <el-select filterable allow-create v-model="item.mode" placeholder="请选择方式" clearable>
                    <el-option v-for="(item, index) in modeObj" :key="index" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="80px" label="项目：" :prop="'intakeList.'+index+'.project'"
                              :rules="{
                              message: '入量项目不超过10个字符！', trigger: 'change', pattern: /^.{0,10}$/
                            }">
                  <el-select filterable allow-create v-model="item.project" placeholder="请选择项目" clearable>
                    <el-option v-for="(item, index) in inProject" :key="index" :label="item.signItemShowName" :value="item.signItemShowName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="80px" label="备用量：" :prop="'intakeList.'+index+'.standby'"
                              :rules="[
                                { message: '请输入正确的数字！', trigger: 'blur', pattern: /^\d+(\.\d+)?$/ },
                                { message: '备用量长度不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/ }
                            ]">
                  <el-input v-model="item.standby" placeholder="备用量" style="width: 80%" clearable></el-input>
                  ml
                </el-form-item>
                <el-form-item label-width="80px" label="实入量：" :prop="'intakeList.'+index+'.amount'"
                              :rules="[
                                { required: true, message: '请输入实入量！', trigger: 'blur'},
                                { message: '请输入正确的数字！', trigger: 'blur', pattern: /^\d+(\.\d+)?$/},
                                { message: '实入量长度不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/ }
                            ]">
                  <el-input v-model="item.amount" placeholder="实入量" clearable></el-input>
                </el-form-item>
              </fieldset>
            </el-col>
            <el-col>
              <fieldset v-if="addFormData.outputList.length===0">
                <legend>出量1</legend>
                <div class="nrms-blood-img">
                  <i @click.prevent="addItem('outputList')" class="el-icon-circle-plus-outline iconAddCls"></i>
                </div>
              </fieldset>
              <fieldset v-for="(item, index) in addFormData.outputList" :key="index">
                <legend>出量{{index+1}}</legend>
                <div class="nrms-blood-img">
                  <i @click.prevent="addItem('outputList')" class="el-icon-circle-plus-outline iconAddCls"></i>
                  <i @click.prevent="removeItem('outputList', item)" class="el-icon-remove-outline iconDelCls"></i>
                </div>
                <el-form-item label-width="80px" label="方式：" :prop="'outputList.'+index+'.mode'"
                              :rules="{
                            message: '出量方式不超过10个字符！', trigger: 'blur', pattern: /^.{0,10}$/
                          }">
                  <el-input v-model="item.mode" placeholder="请输入方式" clearable></el-input>
                </el-form-item>
                <el-form-item label-width="80px" label="项目：" :prop="'outputList.'+index+'.project'"
                              :rules="{
                              message: '出量项目不超过10个字符！', trigger: 'change', pattern: /^.{0,10}$/
                            }">
                  <el-select filterable allow-create v-model="item.project" placeholder="请选择项目" clearable>
                    <el-option v-for="(item, index) in outProject" :key="index" :label="item.signItemShowName" :value="item.signItemShowName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="80px" label="性状：" :prop="'outputList.'+index+'.characters'"
                              :rules="{
                            message: '出量性状不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/
                          }">
                  <el-input v-model="item.characters" placeholder="请输入性状" clearable></el-input>
                </el-form-item>
                <el-form-item label-width="80px" label="量：" :prop="'outputList.'+index+'.amount'"
                              :rules="[
                            { required: true, message: '请输入量！', trigger: 'blur'},
                            { message: '请输入正确的数字！', trigger: 'blur', pattern: /^\d+(\.\d+)?$/},
                            { message: '量长度不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/ }
                            ]">
                  <el-input v-model="item.amount" placeholder="请输入量" style="width: 80%" clearable></el-input>
                  ml
                </el-form-item>
              </fieldset>
            </el-col>
          </el-row>
          <!--<el-form-item label="护士签名：" prop="nurseName">-->
            <!--<el-input disabled v-model="addFormData.nurseName" placeholder="请输入护士签名" clearable></el-input>-->
          <!--</el-form-item>-->
        </el-form>
        <div class="typt-add-footer">
          <el-button @click="reloadUrl">取消</el-button>
          <el-button type="primary" @click="saveData" :loading="addVis" :disabled="btn_disable">提 交</el-button>
        </div>
      </div>
    </div>
    <!--小结-->
    <el-dialog :title="summary.tit" :visible.sync="summary.summaryVis" width="600px" :close-on-click-modal="false">
      <el-form ref="briefSummary" class="typt-add-dialog" label-width="120px" :rules="rules_summary" :model="summary.summaryData">
        <el-form-item label="时间：" prop="startTime">
          <el-date-picker
            @change="changeTime"
            class="smallInput"
            v-model="summary.summaryData.recordTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            :clearable="false"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结量开始时间：" prop="startTime">
          <el-date-picker
            disabled
            class="smallInput"
            v-model="summary.summaryData.startTime"
            type="datetime"
            :default-time="['07:00']"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结量结束时间：" prop="endTime">
          <el-date-picker
            disabled
            class="smallInput"
            v-model="summary.summaryData.endTime"
            type="datetime"
            :default-time="['19:00']"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="请选择结束时间">
          </el-date-picker>
          <div v-if="summaryFlag === 'yes'" style="color: #f56c6c;font-size: 12px;">已经添加{{summary.summaryData.recordTime.substr(0,10)+summary.tit}}, 不可重复添加</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button @click="cancelSummaryAdd">取消</el-button>
        <el-button v-if="summaryFlag === 'yes'" type="info" disabled @click="saveSummaryData" :loading="addVis">确认</el-button>
        <el-button v-else type="primary" @click="saveSummaryData" :loading="addVis">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import BaseManage from '../../../../assets/nrms/mixins/BaseManage';
  import PageInfo from '../../../../components/nrms/PageInfo';
  import { MsgShow } from '../../../../assets/nrms/js/Message';
  import { DateFormate } from '../../../../assets/nrms/js/Unitils';
  import { AxiosApi } from '../../../../api/nrms/http/index';
  import layout from '../../../../components/nrms/layout/list';
  import { ApiAutoForm } from '../../../../api/nrms/index';
  import formHeader from "../../../../components/nrms/autoForm/header";
  import moment from 'moment'
  export default {
    name: 'InOut',
    components: { PageInfo, layout,formHeader },
    mixins: [BaseManage],
    props: ['patient', 'patientType'],
    watch: {
      patient: {
        handler(newValue, oldValue) {
          this.patientData = this.patient;
          this.formSearchDataStatic.patientId = this.patient.patientId;
          this.publicObj.patientId = this.patient.patientId;
          this.getSummaryData();
          this.getData();
          this.getFormInfo('update')
        }
      }
    },
    computed: {
      btn_disable: function () {
        // 出院&&非出院召回 || 转科
        if ((this.patientType === 2 && this.patient.outHospitalFlag !== 1) || this.patientType === 1) {
          return true;
        }
        return false;
      }
    },
    data() {
      return {
        summaryFlag: true,
        form_show_hide: true,
        deptName: '',
        actFlag: 'add',
        patientData: {},
        modeObj: [{
          id: '空',
          label: '空'
        },
          {
            id: '医嘱',
            label: '医嘱'
          }],
        // 总结
        summary: {
          tit: '总结',
          summaryVis: false,
          summaryData: {
            type: 3,
            recordTime: '',
            startTime: '',
            endTime: '',
            nurseName: ''
          }
        },
        publicObj: {
          patientId: '',
          deptId: ''
        },
        // 添加数据
        addFormData: {
          recordId: '',
          recordTime: moment().format('YYYY-MM-DD HH:ss'),
          intakeList: [{
            mode: '',
            project: '',
            standby: '',
            amount: ''
          }],
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
          endTime: [
            { required: true, message: '请选择结量结束时间！' }
          ],
          startTime: [
            { required: true, message: '请选择结量开始时间！' }
          ]
        },
        rules: {
          recordTime: [
            { required: true, message: '请选择时间！' }
          ],
          nurseName: [
            { required: true, message: '请填写护士签名！' }
          ]
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
        //自动表头所用
        autoHead:{
          tplId:'',
          formName:'',
          tplHtml:'<div>loading</div>',
          tplData:{}
        },
        formObj:{
          formType:4,
          formId:''
        },
        showHead:false


      };
    },
    created() {
      this.patientData = this.patient;
      let obj = JSON.parse(localStorage.getItem('empInfo')) || {};
      this.addFormData.nurseName = obj.empName || '';
      this.nurseName = obj.empName || '';
      let curDate = this.initDate();
      this.summary.summaryData.recordTime = new Date(curDate);
      let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {};
      this.publicObj.deptId = deptInfo.deptId || '';
      this.deptName = deptInfo.deptName || '';
      this.formSearchDataStatic.patientId = this.patient.patientId;
      this.publicObj.patientId = this.patient.patientId || '';
      this.getSummaryData();
      this.getInProject();
      this.getOutProject();
      this.getData();
      this.getFormInfo();

    },
    updated() {
      this.$nextTick(function () {
        this.$refs.table.doLayout();
      });
    },
    methods: {
      getFormInfo(_type){
        console.log('getFormInfo_4');
        if(_type=='update'){
          this.autoHead.tplData = this.patient || null;
        }else{
          ApiAutoForm.getFormDictByType({formType:this.formObj.formType}).then((res) => {
            console.log('ApiAutoForm_4');
            if(res.data==null){
              this.$message.error('请先配置表单样式');
            }else{
              this.autoHead.tplData = this.patient || null;
              this.autoHead.tplId = res.data.formCode || '';
              this.autoHead.formName = res.data.formName || '';
              this.autoHead.tplHtml = res.data.formStyle || '';
              this.formObj.formId = res.data.formId || '';
              console.log('inOut')
              console.log(JSON.stringify(this.patient));
              console.log(this.autoHead);
              this.showHead = true;
            }
          });

        }
      },


      formShowHide() {
        this.form_show_hide = !this.form_show_hide;
      },
      // 获取小结 总结
      getSummaryData() {
        if (!this.patient.patientId) return false;
        AxiosApi(`/nrms//web-nr/intake-output/summary`, {}, 'GET', { patientId: this.patient.patientId }).then(res => {
          if (res.status === 200) {
            this.allSmallData = {};
            this.allSummaryData = {};
            if (!res.data || !res.data.length) {
              return
            }
            res.data.forEach((item) => {
              if (item.type === 2) {
                this.allSmallData[item.beginTime.substr(0, 10)] = 'yes';
              }
              if (item.type === 3) {
                this.allSummaryData[item.beginTime.substr(0, 10)] = 'yes';
              }
            });
          }
        });
      },
      // 时间变化
      changeTime() {
        let curDate = '';
        let endDate = '';
        this.summaryFlag = '';
        if (this.summary.summaryData.type === 2) {
          curDate = this.initDate('small', this.summary.summaryData.recordTime);
          endDate = curDate.replace('07:00', '19:00');
          this.summaryFlag = this.allSmallData[curDate.substr(0, 10)] || '';
        } else {
          curDate = this.initDate('', this.summary.summaryData.recordTime);
          endDate = this.initDate('small', this.summary.summaryData.recordTime);
          this.summaryFlag = this.allSummaryData[curDate.substr(0, 10)] || '';
        }
        if (this.actFlag === 'modify' && this.oldData.recordDate === this.summary.summaryData.recordTime.substr(0, 10)) {
          this.summaryFlag = '';
        }
        this.summary.summaryData.startTime = curDate;
        this.summary.summaryData.endTime = endDate;
      },
      // 获取项目
      getInProject() {
        AxiosApi(`/nrms/web-nr/sign-apply/by-in-out-type`, {}, 'GET', { inOutType: 2 }).then(res => {
          if (res.status === 200) {
            this.inProject = res.data;
          }
        });
      },
      // 获取项目
      getOutProject() {
        AxiosApi(`/nrms/web-nr/sign-apply/by-in-out-type`, {}, 'GET', { inOutType: 3 }).then(res => {
          if (res.status === 200) {
            this.outProject = res.data;
          }
        });
      },
      // 取消添加
      cancelSummaryAdd() {
        this.addVis = false;
        this.summary.summaryVis = false;
        this.actFlag = 'add';
      },
      // 合并行
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 10 || columnIndex === 11) {
          return {
            rowspan: row.rowCount,
            colspan: 1
          };
        } else {
          return {
            rowspan: 1,
            colspan: 1
          };
        }
      },
      // 保存数据
      saveData() {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            if (this.actFlag === 'add') {
              this.addFormData = Object.assign(this.addFormData, this.publicObj);
            }
            if (!this.addFormData.patientId) {
              this.$message.warning('请选择病人！');
              return;
            }
            if (this.addFormData.intakeList.length === 0 && this.addFormData.outputList.length === 0) {
              this.$message.warning('请至少填写一个出量或者入量！');
              return;
            }
            this.saveDataDo(this.addFormData, this.actFlag);
          }
        });
      },
      // 修改
      modify(row) {
        this.actFlag = 'modify';
        if (row.type === 2 || row.type === 3) {
          this.modifySummary(row);
          return false;
        }
        AxiosApi(`${this.url}/record-id`, {}, 'GET', { recordId: row.recordId }).then(res => {
          let data = res.data;
          this.addFormData = data;
        });
      },
      // 形成时间
      initDate(act = '', day = '') {
        let date = new Date();
        if (day !== '') {
          date = new Date(day);
        }
        if (act === '') {
          date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
        }
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        if (m < 10) {
          m = '0' + m;
        }
        if (d < 10) {
          d = '0' + d;
        }
        return y + '-' + m + '-' + d + ' 07:00';
      },
      // 修改
      modifySummary(row) {
        this.summaryFlag = '';
        if (row.type === 2) {
          this.summary.tit = '小结';
        }
        AxiosApi(`${this.url}/record-id`, {}, 'GET', { recordId: row.recordId }).then(res => {
          let data = res.data;
          this.summary.summaryData = data;
          this.oldData.recordDate = data.recordTime.substr(0, 10);
        });
        this.summary.summaryVis = true;
      },
      // 小结
      showSummary(act) {
        let curDate = this.initDate();
        let endDate = '';
        if (act === 'small') {
          curDate = this.initDate(act);
          endDate = curDate.replace('07:00', '19:00');
          this.summaryFlag = this.allSmallData[curDate.substr(0, 10)] || '';
        } else {
          this.summaryFlag = this.allSummaryData[curDate.substr(0, 10)] || '';
        }
        this.oldData.recordDate = '';
        let obj = {
          type: 3,
          nurseName: this.nurseName,
          recordTime: DateFormate.getNowFormatDate(),
          startTime: DateFormate.getNowFormatDate(new Date(curDate)),
          endTime: DateFormate.getNowFormatDate(new Date(endDate))
        };
        this.summary.summaryData = Object.assign(this.summary.summaryData, this.publicObj, obj);
        if (act === 'small') {
          this.summary.tit = '小结';
          this.summary.summaryData.type = 2;
        } else {
          let d = this.initDate('small');
          this.summary.summaryData.endTime = DateFormate.getNowFormatDate(new Date(d));
        }
        this.summary.summaryVis = true;
      },
      // 保存小结
      saveSummaryData() {
        this.$refs['briefSummary'].validate((valid) => {
          if (valid) {
            if (!this.summary.summaryData.patientId) {
              this.$message.warning('请选择病人！');
              return;
            }
            this.saveDataDo(this.summary.summaryData, this.actFlag);
          }
        });
      },
      reload() {
        this.reloadUrl();
      },
      // 刷新页面
      reloadUrl() {
        this.actFlag = 'add';
        this.addVis = false;
        this.summary.summaryVis = false;
        this.contentNum = {
          intakeList: 1,
          outputList: 1
        };
        let obj = {
          recordId: '',
          recordTime: DateFormate.getNowFormatDate(),
          intakeList: [{
            mode: '',
            project: '',
            standby: '',
            amount: ''
          }],
          outputList: []
        };
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addFormData = Object.assign(this.addFormData, this.publicObj, obj);
          this.getData();
          this.getSummaryData();
        });
      },
      // 添加多个
      addItem(act) {
        if (act === 'intakeList') {
          if (this.contentNum.intakeList < 5) {
            this.addFormData.intakeList.push({
              mode: '',
              project: '',
              standby: '',
              amount: ''
            });
            this.contentNum.intakeList++;
          } else {
            MsgShow('warning', '最多添加五个入量！');
          }
        } else if (act === 'outputList') {
          if (this.contentNum.outputList < 5) {
            this.addFormData.outputList.push({
              mode: '',
              project: '',
              characters: '',
              amount: ''
            });
            this.contentNum.outputList++;
          } else {
            MsgShow('warning', '最多添加五个出量！');
          }
        }
      },
      // 删除多个
      removeItem(act, item) {
        let index;
        if (act === 'intakeList') {
          index = this.addFormData.intakeList.indexOf(item);
          if (index !== -1) {
            this.addFormData.intakeList.splice(index, 1);
          }
          this.contentNum.intakeList--;
        } else if (act === 'outputList') {
          index = this.addFormData.outputList.indexOf(item);
          if (index !== -1) {
            this.addFormData.outputList.splice(index, 1);
          }
          this.contentNum.outputList--;
        }
      }
    }
  };
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/nrms/css/self_common";

  @media screen and (max-width: 1550px) {
    .form_show_btn {
      display: inline-block !important;
    }
  }

  /deep/.tool-btn {
    border-bottom: 1px solid #E4E7ED;
  }

  .form_show_btn {
    display: none;
    position: absolute;
    top: 80px;
    left: -22px;
    padding: 7px 3px !important;
    background-color: #fff;
    z-index: 9;
    color: #ff9d00;
    border-color: #ff9d00;
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

  /deep/.el-pagination.is-background .btn-next.disabled,
  /deep/.el-pagination.is-background .btn-next:disabled,
  /deep/.el-pagination.is-background .btn-prev.disabled,
  /deep/.el-pagination.is-background .btn-prev:disabled,
  /deep/.el-pagination.is-background .el-pager li.disabled {
    color: #fff;
  }

  .nrms-main-div {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .nrms-blood-add {
    margin-top: 30px;
  }

  .nrms-blood-list {
    border-right: 1px solid #e6e6e6;
    height: 100%;
    width: 0;
    flex: 1;
  }

  .el-row {
    width: 100%;
    height: 100%;
  }

  .el-col-add {
    width: 350px;
    position: relative;
  }

  .el-col {
    fieldset {
      border: 1px solid #e6e6e6;
      padding: 30px 10px 0 10px;
      position: relative;

      .el-form {
        margin-left: 0px !important;
      }

      margin-bottom: 20px;
    }

    legend {
      color: #333333 !important;
      margin-left: 20px;
      font-size: 16px !important;
      width: auto;
    }

    .iconAddCls {
      font-size: 24px;
      color: #409EFF;
      cursor: pointer;
      margin-left: 10px;
      vertical-align: middle;
    }

    .iconDelCls {
      font-size: 24px;
      color: #F56C6C;
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
</style>
