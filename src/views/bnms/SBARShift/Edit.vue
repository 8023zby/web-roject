<template>
  <layout v-loading="loading">
    <div slot="title">护士交班记录</div>
    <div slot="main">
      <div class="tool-bar" style="text-align: right; border-bottom: 1px solid #E4E7ED">
        <!-- 先保存 再交班 -->
        <el-button type="primary" @click="takeOver" :disabled="!shiftPatient.infoValue || shiftPatient.takeOver">接班</el-button>
        <el-button type="success" @click="printView">打印预览</el-button>
      </div>
      <div class="bnms_sbar_shift_container" id="bnms_sbar_shift_container">
        <table id="bnms_sbar_shift_container_table">
          <colgroup>
            <col width="70">
            <col width="auto">
          </colgroup>
          <thead>
          <tr>
            <td colspan="2" class="hospital">{{orgInfo.orgName}}</td>
          </tr>
          <tr>
            <td colspan="2" class="title">护士交班记录</td>
          </tr>
          <tr>
            <td colspan="2" class="patient">
              <div>
                <div>姓名：{{patient_data.patientName || ''}}</div>
                <div>性别：{{patient_data.sex || ''}}</div>
                <div>年龄：{{patient_data.patientAge || ''}}</div>
                <div>床号：{{patient_data.bedNo || ''}}床</div>
                <div>科室：{{deptName || ''}}</div>
                <div>住院号：{{patient_data.patientId || ''}}</div>
              </div>
            </td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="td-left">现状</td>
            <td class="td-right">
              <div class="line-form">
                <label class="label">诊断：</label>
                <input type="text" v-model="patient_data.diagnosis">
              </div>
              <div class="line-form">
                <div style="flex-basis: 50%">
                  <label class="label">过敏史：</label>
                  <input type="text" v-model="patient_data.allergyHistory">
                </div>
                <div style="flex: 1;">
                  <label class="label">既往史：</label>
                  <input type="text" v-model="add_form.pastHistory">
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="td-left">背景</td>
            <td class="td-right">
              <div class="line-form">
                <label class="label">饮食状况：</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_yszk_check1">正常</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_yszk_check2">其他</label>
                <input type="text" v-model="add_form.bj_yszk_input">
              </div>
              <div class="line-form">
                <label class="label">管路状况：</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_glzk_check1">正常</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_glzk_check2">其他</label>
                <input type="text" v-model="add_form.bj_glzk_input">
              </div>
              <div class="line-form">
                <label class="label">皮肤情况：</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_pfqk_check1">完好</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_pfqk_check2">破溃</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_pfqk_check3">压疮</label>
              </div>
              <div class="line-form" style="padding-left: 70px; ">
                <label class="label">部位：</label><input type="text" v-model="add_form.bj_bw_input">
                <label class="label">程度：</label><input type="text" v-model="add_form.bj_cd_input">
              </div>
              <div class="line-form">
                <label class="label">二便情况：</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_ebqk_check1">正常</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_ebqk_check2">其他</label>
                <input type="text" v-model="add_form.bj_ebqk_input">
              </div>
              <div class="line-form">
                <label class="label">特殊用药：</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_tsyy_check1">正常</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_tsyy_check2">其他</label>
                <input type="text" v-model="add_form.bj_tsyy_input">
              </div>
              <div class="line-form">
                <label class="label">其他：</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_qt_check1">正常</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.bj_qt_check2">其他</label>
                <input type="text" v-model="add_form.bj_qt_input">
              </div>
            </td>
          </tr>
          <tr>
            <td class="td-left">评估</td>
            <td class="td-right">
              <div class="line-form">
                <label class="label">护理风险：</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.pg_hlfx_check1">跌倒/坠床</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.pg_hlfx_check2">压疮</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.pg_hlfx_check3">疼痛</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.pg_hlfx_check4">VTE</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.pg_hlfx_check5">导管滑脱</label>
              </div>
              <div class="line-form">
                <label class="label">未完成检查：</label>
                <input type="text" v-model="add_form.pg_wwcjc_input">
              </div>
              <div class="line-form">
                <label class="label">未完成治疗：</label>
                <input type="text" v-model="add_form.pg_wwczl_input">
              </div>
              <div class="line-form">
                <label class="label">其他：</label>
                <input type="text" v-model="add_form.pg_qt_input">
              </div>
            </td>
          </tr>
          <tr>
            <td class="td-left">建议</td>
            <td class="td-right">
              <div class="line-form">
                <label class="label">请关注：</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.jy_qgz_check1">疼痛</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.jy_qgz_check2">VTE</label>
                <label class="checkbox"><input type="checkbox" v-model="add_form.jy_qgz_check3">导管滑脱</label>
              </div>
              <div class="line-form">
                <label class="label">其他：</label>
                <input type="text" v-model="add_form.jy_qt_input">
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2" class="patient">
              <div>
                <div><label class="label">交班护士签名</label><input type="text" readonly v-model="add_form.end_jbhsqm1">
                </div>
                <div><label class="label">班次</label><input type="text" readonly v-model="add_form.end_bc"></div>
                <div><label class="label">接班护士签名</label><input type="text" readonly v-model="add_form.end_jbhsqm2">
                </div>
                <div><label class="label">日期时间</label><input type="text" readonly v-model="add_form.end_rqsj"></div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer_btn">
      <el-button @click="close">返回</el-button>
      <!-- 先保存 再交班 -->
      <el-button type="primary" @click="save" v-if="!shiftPatient.takeOver">保存</el-button>
    </div>
  </layout>
</template>

<script>
  import layout from '../../../components/bnms/layout/edit';
  import printJS from 'print-js';
  import moment from 'moment';
  import printStyle from './printStyle';
  import { ApiNurseShift } from '../../../api/bnms/index';

  export default {
    name: "sbar_shift_print",
    components: { layout },
    props: {
      'shift': {
        type: Object,
        default() {
          return {};
        }
      },
      'shiftPatient': {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        loading: false,
        deptName: '',
        patient_data: {
          patientName: '姓名',
          sex: '姓名',
          patientAge: '姓名',
          bedName: '011',
          inpNo: '4545451354',
          diagnosis: '',
          allergyHistory: ''
        },
        add_form: {
          pastHistory: '',
          // 饮食状况
          bj_yszk_check1: false,
          bj_yszk_check2: false,
          bj_yszk_input: '',
          // 管路状况
          bj_glzk_check1: false,
          bj_glzk_check2: false,
          bj_glzk_input: '',
          // 皮肤情况
          bj_pfqk_check1: false,
          bj_pfqk_check2: false,
          bj_pfqk_check3: false,
          // 部位
          bj_bw_input: '',
          // 程度
          bj_cd_input: '',
          // 耳边情况
          bj_ebqk_check1: false,
          bj_ebqk_check2: false,
          bj_ebqk_input: '',
          // 特殊用药
          bj_tsyy_check1: false,
          bj_tsyy_check2: false,
          bj_tsyy_input: '',
          // 其他
          bj_qt_check1: false,
          bj_qt_check2: false,
          bj_qt_input: '',
          // 护理风险
          pg_hlfx_check1: false,
          pg_hlfx_check2: false,
          pg_hlfx_check3: false,
          pg_hlfx_check4: false,
          pg_hlfx_check5: false,
          // 未完成检查
          pg_wwcjc_input: '',
          // 未完成治疗
          pg_wwczl_input: '',
          // 其他
          pg_qt_input: '',
          // 建议 请关注
          jy_qgz_check1: false,
          jy_qgz_check2: false,
          jy_qgz_check3: false,
          // 其他
          jy_qt_input: '',
          // 护士
          end_jbhsqm1: '',
          end_bc: '',
          end_jbhsqm2: '',
          end_rqsj: ''
        },
        deptInfo: {},
        empInfo: {},
        orgInfo: {}
      };
    },
    created() {
      this.orgInfo = JSON.parse(localStorage.getItem("orgInfo")) || [];
      this.deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {};
      this.deptName = this.deptInfo.deptName;
      this.empInfo = JSON.parse(localStorage.getItem('empInfo')) || {};
      this.add_form.end_jbhsqm1 = this.empInfo.empName;
      this.add_form.end_bc = this.shift.shiftName;
      this.patient_data = JSON.parse(JSON.stringify(this.shiftPatient));
      this.patient_data.infoValue && (this.add_form = JSON.parse(this.patient_data.infoValue));
    },
    methods: {
      save() {
        this.patient_data.infoValue = JSON.stringify(this.add_form);
        ApiNurseShift.SBARShiftSave(this.patient_data)
          .then(() => {
            this.close();
            this.$message.success("保存成功！");
          }).catch(res => {
          this.$message.error(res.message);
        });
      },
      takeOver() {
        let infoValue = JSON.parse(this.patient_data.infoValue) || {};
        infoValue['end_jbhsqm2'] = this.empInfo.empName;
        infoValue['end_rqsj'] = moment().format("YYYY-MM-DD");
        ApiNurseShift.SBARShiftTakeOver({
          recordId: this.patient_data.recordId,
          infoValue: JSON.stringify(infoValue)
        }).then(() => {
          this.$message.success("接班成功！");
          this.close();
        }).catch(res => {
          this.$message.error(res.message);
        });
      },
      printView() {
        printJS({
          printable: 'bnms_sbar_shift_container_table',
          type: 'html',
          style: printStyle,
          scanStyles: false
        });
      },
      close() {
        this.$emit('option-changed', 'list');
      }
    }
  };
</script>


<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
  .bnms_sbar_shift_container {
    height: 100%;
    padding: 20px 0;
    overflow: auto;
  }

  /deep/ .el-main {
    padding: 0;
  }

  /* 打印部分的样式 start */
  table {
    margin: 0 auto;
    width: 750px;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 12px;
  }

  td {
    border: 1px solid black;

    &.td-left {
      text-align: center;
    }

    &.td-right {
      padding: 5px 15px;
    }

    .line-form {
      height: 35px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .label {
    min-width: 60px;
    display: inline-block;
  }

  .checkbox {
    padding: 0 10px;
  }

  input[type=text] {
    margin: 0 10px;
    border: 1px solid #666;
    height: 20px;
    padding: 0 3px
  }

  .hospital, .title, .patient {
    border: none;
    text-align: center;
  }

  .hospital {
    font-size: 16px;
  }

  .title {
    font-size: 20px;
  }

  .patient {
    padding: 10px;

    > div {
      display: flex;
      justify-content: space-around;
    }

    input {
      width: 86px;
    }
  }

  /* 打印部分的样式 end */
</style>
