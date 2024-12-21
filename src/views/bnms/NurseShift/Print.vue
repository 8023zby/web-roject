<template>
    <div class="print_container"
         v-loading="loading">

        <div id="print_btn">
            <el-button @click="printView">打印</el-button>
            <el-button @click="close">返回</el-button>
        </div>

        <div class="bnms_nurse_shift_container"
             id="bnms_nurse_shift_container">
            <div id="bnms_nurse_shift_container_table">
                <formHeader :autoHead="autoHead"></formHeader>
                <table>
                    <colgroup>
                        <col width="60">
                        <col width="60">
                        <col width="60">
                        <col v-for="n in shifts_count"
                             width="auto">
                    </colgroup>
                    <thead>
                    <!--<tr>-->
                    <!--<td colspan="12">-->
                    <!--<formHeader :autoHead="autoHead"></formHeader>-->
                    <!--</td>-->
                    <!--</tr>-->
                    </thead>
                    <tbody>
                    <template v-for="(item,index) in table_data">

                        <!-- 分页 -->
                        <tr v-if="item.page && table_data.length !== 1 "
                            class="page">
                            <td colspan="3">&nbsp;</td>
                            <template v-for="n in shifts_count">
                                <td v-if="n === shifts_count">
                                    <div>
                                        <div>护士签名:{{statistic_data[n - 1]['createUser'] || ''}}</div>
                                        <div>第{{item.page}}页</div>
                                    </div>
                                </td>
                                <td v-if="n === 1 && n !== shifts_count">护士签名:{{statistic_data[n - 1]['createUser'] ||
                                    ''}}
                                </td>
                                <td v-if="n === 2 && n !== shifts_count">护士签名:{{statistic_data[n - 1]['createUser'] ||
                                    ''}}
                                </td>
                            </template>
                        </tr>

                        <!-- 表头 -->
                        <template v-if="index === 0 || item.page && index !== table_data.length - 1">

                            <!--<tr :class="{hidde: index !== 0}">-->
                            <!--<td :colspan="3 + shifts_count"-->
                            <!--class="hospital">{{orgInfo.orgName}}</td>-->
                            <!--</tr>-->
                            <!--<tr :class="{hidde: index !== 0}">-->
                            <!--<td :colspan="3 + shifts_count"-->
                            <!--class="title">护士交班报告</td>-->
                            <!--</tr>-->
                            <!--<tr :class="{hidde: index !== 0}">-->
                            <!--<td :colspan="3 + shifts_count" class="dept">-->
                            <!--<div>-->
                            <!--<div>科室:{{deptInfo.deptName}}</div>-->
                            <!--<div>日期:{{shift.shiftTime}}</div>-->
                            <!--</div>-->
                            <!--</td>-->
                            <!--</tr>-->
                            <!--<table class="tableTrStyle">-->
                            <tr :class="{thead: true, hidde: index !== 0,tableTrStyle:true}">
                                <td :rowspan="1 + rowNumber">床<br/><br/>号</td>
                                <td :rowspan="1 + rowNumber">姓<br/><br/>名</td>
                                <td :rowspan="1 + rowNumber">交<br/>班<br/>原<br/>因</td>
                                <td class="statistic" v-for="n in shifts_count">
                                    <div>
                                        <div>患者总数：{{statistic_data[n - 1] ? (statistic_data[n -1]['statistic']['患者总数']
                                            || 0) : 0}}
                                        </div>
                                        <div>时间：{{statistic_data[n - 1] ? (statistic_data[n -1]['remarks'] || '') :
                                            ''}}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr :class="{thead: true, hidde: index !== 0,tableTrStyle:true}" v-for="(v, i) in shiftReasonList">
                                <td class="statistic" v-for="n in shifts_count">
                                    <div>
                                        <div v-for="shiftReasonItem in v" class="shiftReasonItem">
                                            {{shiftReasonItem.name}}：{{statistic_data[n - 1] ? (statistic_data[n
                                            -1]['statistic'][shiftReasonItem.name] || 0) : 0}}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <!--</table>-->
                        </template>
                        <!--<table class="tableTrStyle">-->
                        <!-- 数据行 -->
                        <tr v-if="!item.page" class="tableTrStyle">
                            <td>{{item.bedNo}}</td>
                            <td>{{item.patientName}}</td>
                            <td>{{item.shiftReason}}</td>
                            <template v-for="n in shiftArr">
                                <td class="text_left" v-if="n.sort === 1">{{item.shiftTextOne}}</td>
                                <td class="text_left" v-if="n.sort === 2">{{item.shiftTextTwo}}</td>
                                <td class="text_left" v-if="n.sort === 3">{{item.shiftTextThree}}</td>
                            </template>
                        </tr>
                        <!--</table>-->
                        <!-- 分页当无数据的时候单独判断 -->
                        <tr v-if="item.page && table_data.length === 1 "
                            class="page">
                            <td colspan="3">&nbsp;</td>
                            <template v-for="n in shifts_count">
                                <td v-if="n === shifts_count">
                                    <div>
                                        <div>护士签名:{{statistic_data[n - 1]['createUser'] || ''}}</div>
                                        <div>第{{item.page}}页</div>
                                    </div>
                                </td>
                                <td v-if="n === 1 && n !== shifts_count">护士签名:{{statistic_data[n - 1]['createUser'] ||
                                    ''}}
                                </td>
                                <td v-if="n === 2 && n !== shifts_count">护士签名:{{statistic_data[n - 1]['createUser'] ||
                                    ''}}
                                </td>
                            </template>
                        </tr>

                    </template>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>

<script>
import printJS from 'print-js'
import printStyle from './printStyle'
import { ApiAutoForm, ApiNurseShift, ApiShiftReason } from '../../../api/bnms/index'
import formHeader from '../../../components/bnms/autoForm/header'

export default {
  name: 'nurse_shift_print',
  components: { formHeader },
  data () {
    return {
      loading: false,
      statistic_data: [],
      table_data: [],
      shifts_count: 0,
      deptInfo: {},
      shiftArr: [], // 获取的班次数据
      orgInfo: {},
      shiftReasonList: [],
      rowNumber: 0
    }
  },
  props: {
    'shift': {
      type: Object,
      default () {
        return {}
      }
    },
    'autoHead': {
      type: Object,
      default () {
        return {}
      }
    }
  },
  created () {
    // console.log(this.shift);
    this.orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || []
    this.deptName = this.deptInfo.deptName || ''
    // this.getData();
  },
  methods: {
    async getData (_res) {
      this.shifts_count = _res.data.length || 0
      this.shiftArr = _res.data || []
      await this.getShiftReason()
      if (!this.shiftReasonList || !this.shiftReasonList.length || !this.rowNumber) {
        return
      }
      Promise.all(
        [
          this.getStatisticData(),
          this.getPatientData()
        ]
      ).then(res => {
        const patient = res[1].data || []// getPatientData
        const statisticData = res[0].data || []// getStatisticData
        const statistic = [...new Array(this.shiftArr.length)].map((v, i) => {
          return {
            createTime: null,
            createUser: '',
            updateTime: null,
            updateUser: '',
            remarks: `${this.shiftArr[i].beginTime} - ${this.shiftArr[i].endTime}`,
            statistic: {}
          }
        })
        statisticData.map(item => {
          statistic[item.shiftSort - 1]['statistic'][item.shiftReason] = item.shiftPatientCnt
          statistic[item.shiftSort - 1]['createUser'] = item.createUser
        })

        // console.log(statistic_length, shiftArr_length);

        // 统计数据
        this.statistic_data = statistic

        // 行数据
        this.table_data = []
        // 增加分页
        let page = 1
        for (let i = 0; i < patient.length; i++) {
          this.table_data.push(patient[i])
          if (i !== 0 && (i % (42 - this.rowNumber) === 0 || i === patient.length - 1)) {
            this.table_data.push({ page: page })
            page++
          }
        }

        let tArr = []
        for (let t = 0; t < this.table_data.length; t++) {
          if (this.table_data[t].page === undefined) {

          } else {
            tArr.push(1)
          }
        }

        // console.log(tArr, tArr.length);
        if (tArr.length === 0) {
          this.table_data.push({ page: 1 })
        }

        // this.printView();
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    getStatisticData () {
      return ApiNurseShift.printStatistic({
        shiftTime: this.shift.shiftTime,
        deptId: this.deptInfo.deptId,
        log: 'getStatisticData'
      })
    },
    // 当天所有交班记录中的整合后的患者数据
    getPatientData () {
      // this.shifts_count = this.shift.sort;
      // console.log(this.shifts_count);
      return ApiNurseShift.printPatient({
        shiftTime: this.shift.shiftTime,
        deptId: this.deptInfo.deptId,
        // width: (900 / this.shifts_count) + 0.01,
        width: (810 / this.shifts_count) + 0.01,
        num: this.shifts_count,
        log: 'getPatientData'
      })
    },
    printView () {
      printJS({
        printable: 'bnms_nurse_shift_container_table',
        type: 'html',
        style: printStyle,
        scanStyles: false
      })
    },
    close () {
      this.$emit('option-changed', 'list')
    },

    /* 获取交班原因 */
    async getShiftReason () {
      try {
        let res = await ApiAutoForm.getFormDictByType({ formType: '12' })
        if (!res.data) {
          return this.$message.error('请先配置交班报告表单')
        }
        let res2 = await ApiShiftReason.get({ formId: res.data.formId })
        if (!res2.data || !res2.data.length) {
          return this.$message.error('请先配置交班原因')
        }
        let shiftReasonList = []
        res2.data.map((item, index) => {
          if (!shiftReasonList[Math.floor(index / 3)]) {
            shiftReasonList[Math.floor(index / 3)] = []
          }
          shiftReasonList[Math.floor(index / 3)].push({
            name: item.shiftReasonName
          })
        })
        this.shiftReasonList = shiftReasonList
        this.rowNumber = shiftReasonList.length
      } catch (error) {
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .print_container {
        height: 100%;
        position: relative;
    }

    #print_btn {
        position: absolute;
        top: 15px;
        right: 10%;
    }

    .bnms_nurse_shift_container {
        height: 100%;
        overflow: auto;
    }

    .hidde {
        display: none;
    }

    /* 打印部分的样式 start */
    table {
        margin: 0 auto;
        width: 1120px;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 12px;
    }

    td {
        padding: 0 5px;
        text-align: center;
        border: 1px solid black;
    }

    tbody td, .thead td {
        height: 30px;
    }

    .text_left {
        text-align: left;
        font-size: 12px;
        color: red;
    }

    .hospital, .title, .dept {
        border: none;
        padding: 5px;
        font-weight: bold;
    }

    .dept {
        font-weight: inherit;

        div {
            display: flex;

            div:first-child {
                width: 200px;
            }
        }
    }

    .hospital {
        font-size: 16px;
    }

    .title {
        font-size: 20px;
    }

    .statistic {
        div {
            display: flex;
            justify-content: space-between;
        }
    }

    .page {
        td {
            border-left: none;
            border-right: none;
            border-bottom: none;
            text-align: left;

            div {
                display: flex;
                justify-content: space-between;
            }
        }
    }

    /* 打印部分的样式 end */
</style>
