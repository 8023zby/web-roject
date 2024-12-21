<template>
  <div class="print_container"
       v-loading="loading">

    <div id="print_btn">
      <!-- <el-button @click="printView">打印</el-button> -->
      <!-- <el-button @click="close">返回</el-button> -->
    </div>

    <div class="bnms_nurse_shift_container"
         id="bnms_nurse_shift_container">
      <table id="bnms_nurse_shift_container_table">
        <colgroup>
          <col width="60">
          <col width="60">
          <col width="60">
          <col v-for="n in shifts_count"
               width="auto">
        </colgroup>
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
              <td v-if="n === 1 && n !== shifts_count">护士签名:{{statistic_data[n - 1]['createUser'] || ''}}</td>
              <td v-if="n === 2 && n !== shifts_count">护士签名:{{statistic_data[n - 1]['createUser'] || ''}}</td>
            </template>
          </tr>

          <!-- 表头 -->
          <template v-if="index === 0 || item.page && index !== table_data.length - 1">
            <tr :class="{hidde: index !== 0}">
              <td :colspan="3 + shifts_count"
                  class="hospital">{{orgInfo.orgName}}</td>
            </tr>
            <tr :class="{hidde: index !== 0}">
              <td :colspan="3 + shifts_count"
                  class="title">护士交班报告</td>
            </tr>
            <tr :class="{hidde: index !== 0}">
              <td :colspan="3 + shifts_count" class="dept">
                <div>
                  <div>科室:</div>
                  <div>日期:</div>
                </div>
              </td>
            </tr>
            <tr :class="{thead: true, hidde: index !== 0}">
              <td :rowspan="1 + rowNumber">床<br/><br/>号</td>
              <td :rowspan="1 + rowNumber">姓<br/><br/>名</td>
              <td :rowspan="1 + rowNumber">交<br/>班<br/>原<br/>因</td>
              <td class="statistic" v-for="n in shifts_count">
                <div>
                  <div>患者总数：0</div>
                  <div>时间：{{statistic_data[n - 1] ? (statistic_data[n -1]['remarks'] || '') : ''}}</div>
                </div>
              </td>
            </tr>
            <tr :class="{thead: true, hidde: index !== 0}" v-for="(v, i) in shiftReasonList">
              <td class="statistic" v-for="n in shifts_count">
                <div>
                  <div v-for="shiftReasonItem in v" class="shiftReasonItem">
                    {{shiftReasonItem.name}}：0
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <!-- 数据行 -->
          <tr v-if="!item.page">
            <td>{{item.bedNo}}</td>
            <td>{{item.patientName}}</td>
            <td>{{item.shiftReason}}</td>
            <template v-for="n in shiftArr">
              <td class="text_left" v-if="n.sort === 1">{{item.shiftTextOne}}</td>
              <td class="text_left" v-if="n.sort === 2">{{item.shiftTextTwo}}</td>
              <td class="text_left" v-if="n.sort === 3">{{item.shiftTextThree}}</td>
            </template>
          </tr>

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
              <td v-if="n === 1 && n !== shifts_count">护士签名:{{statistic_data[n - 1]['createUser'] || ''}}</td>
              <td v-if="n === 2 && n !== shifts_count">护士签名:{{statistic_data[n - 1]['createUser'] || ''}}</td>
            </template>
          </tr>

        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import printJS from 'print-js'
// import printStyle from './printStyle'
// import { ApiAutoForm, ApiNurseShift, ApiShiftReason } from '../../../api/bnms/index'

export default {
  name: 'nurse_shift_print',
  data () {
    return {
      loading: false,
      statistic_data: [{
        createTime: null,
        createUser: '',
        remarks: '',
        updateTime: null,
        updateUser: ''
      }, {
        createTime: null,
        createUser: '',
        remarks: '',
        updateTime: null,
        updateUser: ''
      }],
      table_data: [{
        bedNo: '',
        patientName: '',
        shiftReason: '',
        shiftTextOne: '',
        shiftTextThree: null,
        shiftTextTwo: null
      }, {
        page: 1
      }],
      shifts_count: 2,
      deptInfo: {},
      shiftArr: [{
        beginTime: '08:00',
        endTime: '16:00',
        shiftChildId: '77f650be1751418ead6bb5278ffa9a5d',
        shiftMainId: '08f94bb0fc0246cd9a73ce1de6bc74fc',
        shiftName: '白班',
        sort: 1
      }, {
        beginTime: '18:00',
        endTime: '23:00',
        shiftChildId: '565ead112a5c42b7bd4f5a816db4a871',
        shiftMainId: '08f94bb0fc0246cd9a73ce1de6bc74fc',
        shiftName: '夜班',
        sort: 2
      }], // 获取的班次数据
      orgInfo: {},
      shiftReasonList: [[
        { name: '正常' },
        { name: '入院' },
        { name: '预手术' }
      ], [
        { name: '手术' },
        { name: '危重' },
        { name: '出院' }
      ], [
        { name: '转入' },
        { name: '转出' },
        { name: '分娩' }
      ], [
        { name: '死亡' },
        { name: '转出' },
        { name: '其他' }
      ]],
      rowNumber: 4
    }
  },
  created () {
    this.orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || []
    this.deptName = this.deptInfo.deptName || ''
  },
  methods: {}
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
