<template>
  <layout class="container" v-loading="loading">
    <div slot="right_btn" class="tool-bar">
      <!-- 对接真实打印机时再放开注释 -->
      <!--<el-button @click="print" type="success">打印</el-button>-->
    </div>
    <div slot="main" class="main-list">
      <div class="top">
        <div class="topIcon title">
          当前腕带
        </div>
        <div class="currentWristband">
          腕带编码:<span>{{patient_data ?patient_data.patientIn.wristband:""}}</span>
        </div>
      </div>
      <div class="bottom">
        <div class="bottomIcon title">
          腕带信息
        </div>
        <div class="WristbandInfo">
          <table>
            <colgroup>
              <col width="100px">
              <col width="110px">
              <col width="100px">
              <col width="170px">
              <col width="100px">
            </colgroup>
            <tbody>
            <tr>
              <td rowspan="3">
                <div class="qrCode">
                  <img :src="qrImg" width="88px" height="88px">
                </div>
              </td>
              <td>科室:{{deptName}}</td>
              <td>床号:{{patient_data ? patient_data.patientIn.bedName : ""}}</td>
              <td>住院号:{{patient_data ?patient_data.patientIn.inpNo:""}}</td>
              <td rowspan="3">
                <div class="qrCode">
                  <img :src="qrImg" width="88px" height="88px">
                </div>
              </td>
            </tr>
            <tr>
              <td>姓名:{{patient_data ?patient_data.patientIn.patientName:""}}</td>
              <td>性别:{{patient_data ?patient_data.patientIn.sex:""}}</td>
              <td>年龄:{{patient_data ?patient_data.patientIn.patientAge:""}}</td>
            </tr>
            <tr>
              <td colspan="3">入院时间:{{patient_data ?patient_data.patientIn.inTime:""}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import { ApiWristbandPrint } from '../../../api/bnms/index'
import layout from '../../../components/bnms/layout/list'

export default {
  name: 'WristbandPrinting',
  components: { layout },
  data () {
    return {
      loading: false,
      patient_data: {},
      deptId: '',
      qrImg: '',
      searchParams: {
        patientId: '',
        width: 88,
        height: 88,
        orgId: ''
      }
    }
  },
  props: ['patientDetail'],
  created () {
    // console.log('this.patientDetail',this.patientDetail)
    let selectDeptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptName = selectDeptInfo.deptName || ''
    this.patient_data = this.patientDetail.patient || { patientIn: {} }
    this.searchParams.patientId = this.patient_data.patientIn.patientId || ''
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      ApiWristbandPrint.select(this.searchParams)
        .then(res => {
          console.log('res:', res)
          this.loading = false
          if (res.data != null) {
            this.qrImg = 'data:image/png;base64,' + res.data
          }
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 腕带打印
    print () {

    },
    // 关闭详情
    closeDetail () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
  /deep/.el-header{
    border-bottom: 1px solid #E4E7ED;
  }
  .top .title,.bottom .title {
    margin: 20px 0 20px 16px;
    height: 20px;
    font-size: 16px;
    line-height: 20px;
    color: #1e87f0;
    padding-left: 32px;
  }
  .topIcon {
    background: url('../../../assets/bnms/images/icon_top.png') no-repeat 0px 0;
  }
  .bottomIcon {
    background: url('../../../assets/bnms/images/icon_bottom.png') no-repeat 0px 0;
  }
  .currentWristband {
    margin: 20px 0 20px 48px;
    color: #333;
    font-size: 14px;

    span {
      padding-right: 40px;
      color: #666;
    }
  }

  .WristbandInfo {
    width: 580px;
    border-radius: 2px;
    border: 1px solid #cccece;
    margin-left: 16px;
    padding: 10px 30px;
    font-size: 14px;
    color: #333;

    table {
      table-layout: fixed;
      border-collapse: collapse;
      width: 100%;

      td {
        padding: 5px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        .qrCode {
          width: 88px;
          height: 88px;
          float: right;
        }
      }
    }
  }
</style>
