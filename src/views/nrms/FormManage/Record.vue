<template>
  <!-- <layout v-loading="loading"> -->
    <div slot="main">
      <div class="bnms_sbar_shift_container"
           id="bnms_sbar_shift_container">
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
              <div class="patient-main">
                <div>姓名:{{patient_data.patientName || ''}}</div>
                <div>性别:{{patient_data.sex || ''}}</div>
                <div>年龄:{{patient_data.patientAge || ''}}</div>
                <div>床号:{{patient_data.bedNo || ''}}床</div>
                <div>科室:</div>
                <div>住院号:{{patient_data.inpNo || ''}}</div>
              </div>
            </td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="td-left">现状</td>
            <td class="td-right">
              <div class="line-form">
                <label class="label">诊断:</label>
                <input v-uni="'biaodanshezhi_record_zhenduan'" type="text" v-model="patient_data.diagnosis" maxlength="50"/>
              </div>
              <div class="line-form2" style="">
                <div style="" class="line-form-allergyHistory">
                  <label class="label">过敏史:</label>
                  <input v-uni="'biaodanshezhi_record_guominshi'" type="text" v-model="patient_data.allergyHistory" maxlength="50"/>
                </div>
                <div style="" class="line-form-pastHistory">
                  <label class="label">既往史:</label>
                  <input v-uni="'biaodanshezhi_record_jiwangshi'" type="text" v-model="add_form.pastHistory" maxlength="50"/>
                </div>
                <div class="clear-both"></div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="td-left">背景</td>
            <td class="td-right">
              <div class="line-form">
                <label class="label">饮食状况:</label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_yszk_check1">正常-->
                  <el-checkbox v-uni="'biaodanshezhi_record_yinshizhuangkuang_zhengchang'" v-model="add_form.bj_yszk_check1">正常</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_yszk_check2">其他-->
                  <el-checkbox v-uni="'biaodanshezhi_record_yinshizhuangkuang_qita'" v-model="add_form.bj_yszk_check2">其他</el-checkbox>
                </label>
                <input v-uni="'biaodanshezhi_record_yinshizhuangkuang'" type="text" v-model="add_form.bj_yszk_input" maxlength="50"/>
              </div>
              <div class="line-form">
                <label class="label">管路状况:</label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_glzk_check1">正常-->
                  <el-checkbox v-uni="'biaodanshezhi_record_guanluzhuangkuang_zhengchang'" v-model="add_form.bj_glzk_check1">正常</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_glzk_check2">其他-->
                  <el-checkbox v-uni="'biaodanshezhi_record_guanluzhuangkuang_qita'" v-model="add_form.bj_glzk_check2">其他</el-checkbox>
                </label>
                <input v-uni="'biaodanshezhi_record_guanluzhuangkuang'" type="text" v-model="add_form.bj_glzk_input" maxlength="50"/>
              </div>
              <div class="line-form">
                <label class="label">皮肤情况:</label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_pfqk_check1">完好-->
                  <el-checkbox v-uni="'biaodanshezhi_record_pifuzhuangkuang_wanhao'" v-model="add_form.bj_pfqk_check1">完好</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_pfqk_check2">破溃-->
                  <el-checkbox v-uni="'biaodanshezhi_record_pifuzhuangkuang_pokui'" v-model="add_form.bj_pfqk_check2">破溃</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_pfqk_check3">压疮-->
                  <el-checkbox v-uni="'biaodanshezhi_record_pifuzhuangkuang_yachuang'" v-model="add_form.bj_pfqk_check3">压疮</el-checkbox>
                </label>
              </div>
              <div class="line-form" style="padding-left: 70px;">
                <label class="label">部位:</label><input v-uni="'biaodanshezhi_record_pifuzhuangkuang_buwei'" type="text" v-model="add_form.bj_bw_input" maxlength="50"/>
                <label class="label">程度:</label><input v-uni="'biaodanshezhi_record_pifuzhuangkuang_chengdu'" type="text" v-model="add_form.bj_cd_input" maxlength="50"/>
              </div>
              <div class="line-form">
                <label class="label">二便情况:</label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_ebqk_check1">正常-->
                  <el-checkbox v-uni="'biaodanshezhi_record_erbianqingkuang_zhengchang'" v-model="add_form.bj_ebqk_check1">正常</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_ebqk_check2">其他-->
                  <el-checkbox v-uni="'biaodanshezhi_record_erbianqingkuang_qita'" v-model="add_form.bj_ebqk_check2">其他</el-checkbox>
                </label>
                <input type="text" v-model="add_form.bj_ebqk_input" maxlength="50"/>
              </div>
              <div class="line-form">
                <label class="label">特殊用药:</label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_tsyy_check1">正常-->
                  <el-checkbox v-uni="'biaodanshezhi_record_teshuyongyao_zhengchang'" v-model="add_form.bj_tsyy_check1">正常</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_tsyy_check2">其他-->
                  <el-checkbox v-uni="'biaodanshezhi_record_teshuyongyao_qita'" v-model="add_form.bj_tsyy_check2">其他</el-checkbox>
                </label>
                <input type="text" v-model="add_form.bj_tsyy_input" maxlength="50"/>
              </div>
              <div class="line-form">
                <label class="label">其他:</label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_qt_check1">正常-->
                  <el-checkbox v-uni="'biaodanshezhi_record_qita_zhengchang'" v-model="add_form.bj_qt_check1">正常</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.bj_qt_check2">其他-->
                  <el-checkbox v-uni="'biaodanshezhi_record_qita_qita'" v-model="add_form.bj_qt_check2">其他</el-checkbox>
                </label>
                <input type="text" v-model="add_form.bj_qt_input" maxlength="50"/>
              </div>
            </td>
          </tr>
          <tr>
            <td class="td-left">评估</td>
            <td class="td-right">
              <div class="line-form">
                <label class="label">护理风险:</label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.pg_hlfx_check1">跌倒/坠床-->
                  <el-checkbox v-uni="'biaodanshezhi_record_hulifengxian_diedao'" v-model="add_form.pg_hlfx_check1">跌倒/坠床</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.pg_hlfx_check2">压疮-->
                  <el-checkbox v-uni="'biaodanshezhi_record_hulifengxian_yachuang'" v-model="add_form.pg_hlfx_check2">压疮</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.pg_hlfx_check3">疼痛-->
                  <el-checkbox v-uni="'biaodanshezhi_record_hulifengxian_tengtong'" v-model="add_form.pg_hlfx_check3">疼痛</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.pg_hlfx_check4">VTE-->
                  <el-checkbox v-uni="'biaodanshezhi_record_hulifengxian_VTE'" v-model="add_form.pg_hlfx_check4">VTE</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.pg_hlfx_check5">导管滑脱-->
                  <el-checkbox v-uni="'biaodanshezhi_record_hulifengxian_daoguan'" v-model="add_form.pg_hlfx_check5">导管滑脱</el-checkbox>
                </label>
              </div>
              <div class="line-form">
                <label class="label">未完成检查:</label>
                <input v-uni="'biaodanshezhi_record_weiwanchengjiancha'" type="text" v-model="add_form.pg_wwcjc_input" maxlength="50"/>
              </div>
              <div class="line-form">
                <label class="label">未完成治疗:</label>
                <input v-uni="'biaodanshezhi_record_weiwanchengzhiliao'" type="text" v-model="add_form.pg_wwczl_input" maxlength="50"/>
              </div>
              <div class="line-form">
                <label class="label">其他:</label>
                <input v-uni="'biaodanshezhi_record_fengxian_qita'" type="text" v-model="add_form.pg_qt_input" maxlength="50"/>
              </div>
            </td>
          </tr>
          <tr>
            <td class="td-left">建议</td>
            <td class="td-right">
              <div class="line-form">
                <label class="label">请关注:</label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.jy_qgz_check1">疼痛-->
                  <el-checkbox v-uni="'biaodanshezhi_record_jianyi_tengtong'" v-model="add_form.jy_qgz_check1">疼痛</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.jy_qgz_check2">VTE-->
                  <el-checkbox v-uni="'biaodanshezhi_record_jianyi_VTE'" v-model="add_form.jy_qgz_check2">VTE</el-checkbox>
                </label>
                <label class="checkbox">
<!--                  <input type="checkbox" v-model="add_form.jy_qgz_check3">导管滑脱-->
                  <el-checkbox v-uni="'biaodanshezhi_record_jianyi_daoguantuoluo'" v-model="add_form.jy_qgz_check3">导管滑脱</el-checkbox>
                </label>
              </div>
              <div class="line-form">
                <label class="label">其他:</label>
                <input v-uni="'biaodanshezhi_record_jianyi_qita'" type="text" v-model="add_form.jy_qt_input" maxlength="50"/>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2" class="patient">
              <div class="patient-main">
                <div>
                  <label class="label">交班护士签名:</label>
                  <input v-uni="'biaodanshezhi_record_jiaobanhushiqianming'" type="text" readonly v-show="shiftPatient.shiftRecordStatus === 0" maxlength="50"/>
                  <input v-uni="'biaodanshezhi_record_jiaobanhushiqianming'" type="text" readonly v-show="shiftPatient.shiftRecordStatus !== 0"
                         v-model="add_form.end_jbhsqm1" maxlength="50"/>
                </div>
                <div>
                  <label class="label">班次:</label>
                  <input v-uni="'biaodanshezhi_record_banci'" type="text" readonly v-model="add_form.end_bc">
                </div>
                <div>
                  <label class="label">接班护士签名:</label>
                  <input v-uni="'biaodanshezhi_record_jiebanhushiqianming'" type="text" readonly v-show="shiftPatient.shiftRecordStatus !== 2" maxlength="50"/>
                  <input v-uni="'biaodanshezhi_record_jiebanhushiqianming'" type="text" readonly v-show="shiftPatient.shiftRecordStatus === 2"
                         v-model="add_form.end_jbhsqm2" maxlength="50"/>
                </div>
                <div>
                  <label class="label">日期时间:</label>
                  <input v-uni="'biaodanshezhi_record_riqishijian'" type="text" readonly v-show="shiftPatient.shiftRecordStatus !== 2" maxlength="50"/>
                  <input v-uni="'biaodanshezhi_record_riqishijian'" type="text" readonly v-show="shiftPatient.shiftRecordStatus === 2" v-model="add_form.end_rqsj"
                         maxlength="50"/>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

      </div>

    </div>
    <!--div-- slot="footer_btn"
         v-show="false">
      <el-button @click="close">取消</el-button>
      <el-button type="primary"
                 @click="save"
                 :disabled="!isCanClickSave">保存
      </el-button>
    </div-->
  <!-- </layout> -->
</template>

<script>
// import layout from '@/components/nrms/layout/edit'

export default {
  name: 'sbar_shift_print',
  // components: { layout },
  props: {
    'shift': {
      type: Object,
      default () {
        return {}
      }
    },
    'shiftPatient': {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
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
      orgInfo: {},
      isCanClickHand: false, // 是否可以交班
      isCanClickTake: false, // 是否可以接班
      isCanClickSave: false// 是否可以保存
    }
  },
  created () {
    // console.log(this.shift);
    // console.log(this.shiftPatient);
    this.orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
    this.deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptName = this.deptInfo.deptName
    this.empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    // this.add_form.end_jbhsqm1 = this.empInfo.empName;// 要根据实际情况显示交班护士签名
    this.patient_data = JSON.parse(JSON.stringify(this.shiftPatient))
    this.patient_data.infoValue && (this.add_form = JSON.parse(this.patient_data.infoValue))
    this.add_form.end_bc = this.shift.shiftName
    // console.log(this.shiftPatient)
    if (this.shiftPatient.shiftRecordStatus === 0) { // 未交班
      this.isCanClickHand = true
      this.isCanClickTake = false
      this.isCanClickSave = true
    } else if (this.shiftPatient.shiftRecordStatus === 1) { // 已交班
      this.isCanClickHand = true
      this.isCanClickTake = true
      this.isCanClickSave = false
    } else if (this.shiftPatient.shiftRecordStatus === 2) { // 已接班
      this.isCanClickHand = false
      this.isCanClickTake = false
      this.isCanClickSave = false
    }
    // console.log(this.add_form.end_bc);
    // console.log(this.patient_data);
  },
  methods: {
    save () {
      /* let longArr = [];
        for (let item in this.add_form){
          if(this.add_form[item].length > 50){
            longArr.push(item);
            break;
          }
        }

        if(longArr.length > 0){
          this.$message.warning('文本输入最多支持50个汉字！');
          return false;
        } */

      console.log(this.patient_data)
      this.patient_data.pastHistory = this.add_form.pastHistory
      this.patient_data.infoValue = JSON.stringify(this.add_form)
      ApiNurseShift.SBARShiftSave(this.patient_data)
        .then(() => {
          this.close()
          this.$message.success('保存成功！')
        }).catch(res => {
          this.$message.error(res.message)
        })
    },
    // 交班
    handOver () {
      // console.log(this.patient_data.infoValue);
      // console.log(this.add_form);
      let infoValue = this.add_form || {}
      // 先交再接
      // end_jbhsqm1 交班护士
      // end_bc 班次
      // end_jbhsqm2 接班护士
      // end_rqsj 日期时间
      infoValue['end_jbhsqm1'] = this.empInfo.empName
      infoValue['end_jbhsqm2'] = ''
      infoValue['end_rqsj'] = ''
      this.$confirm(
        `确认要对该患者进行交班操作？`,
        '交班',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }).then(() => {
        ApiNurseShift.ShiftTakeSave({
          recordId: this.patient_data.recordId,
          infoValue: JSON.stringify(infoValue),
          shiftRecordStatus: 1,
          diagnosis: this.patient_data.diagnosis,
          allergyHistory: this.patient_data.allergyHistory,
          pastHistory: this.add_form.pastHistory
        }).then(() => {
          this.$message.success('交班成功！')
          this.close()
        }).catch(res => {
          this.$message.error(res.message)
        })
      })
    },
    // 接班
    takeOver () {
      let infoValue = this.add_form || {}
      // 先交再接
      // end_jbhsqm1 交班护士
      // end_bc 班次
      // end_jbhsqm2 接班护士
      // end_rqsj 日期时间
      infoValue['end_jbhsqm2'] = this.empInfo.empName
      infoValue['end_rqsj'] = moment().format('YYYY-MM-DD')
      this.$confirm(
        `确认要对该患者进行接班操作？`,
        '接班',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }).then(() => {
        ApiNurseShift.ShiftTakeSave({
          recordId: this.patient_data.recordId,
          infoValue: JSON.stringify(infoValue),
          shiftRecordStatus: 2,
          diagnosis: this.patient_data.diagnosis,
          allergyHistory: this.patient_data.allergyHistory,
          pastHistory: this.add_form.pastHistory
        }).then(() => {
          this.$message.success('接班成功！')
          this.close()
        }).catch(res => {
          this.$message.error(res.message)
        })
      })
    },
    printView () {
      printJS({
        printable: 'bnms_sbar_shift_container_table',
        type: 'html',
        style: printStyle,
        scanStyles: false
      })
    },
    close () {
      this.$emit('option-changed', 'list')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .bnms_sbar_shift_container {
    flex: 1;
    height: 100%;
    padding: 20px 0 0 0;
    padding: 20px 0 0 0;
    overflow: auto;
    position: relative;
  }

  /deep/ .el-checkbox__inner {
    border-color: #D2D2D2;
  }

  /deep/ .el-main {
    padding: 0;

    > div:first-child {
      height: calc(100% - 38px);
      display: flex;
      flex-direction: column;
    }
  }

  .mask {
    width: 750px;
    height: 100%;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate3d(-50%, 0, 0);
    z-index: 999;
  }

  table input:read-only {
    color: #333;
    background-color: #F5F5F5;
    border: none;
    height: 28px;
    padding: 0;
  }

  /* 打印部分的样式 start */
  table {
    margin: 0 auto;
    width: 750px;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 12px;
    border-radius: 2px;
  }

  td {
    border: 1px solid #c9c9c9;

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

    .line-form2 {
      height: 35px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .line-form-allergyHistory {
      flex-basis: 50%;
    }

    .line-form-pastHistory {
      flex: 1;
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
    border: 1px solid #D2D2D2;
    height: 20px;
    padding: 0 3px;
  }

  table input:read-only {
      padding: 0 0 0 5px;
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
      width: 84px;
    }
  }

  /* 打印部分的样式 end */

    .footer_btn {
        text-align: center;
        margin: 20px 0;
    }
</style>
