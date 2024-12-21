<template>
  <div id="nrms-inout-print-lsjjeis88">
    <div v-for="group in dataGroup" class="box">
      <table :key="group.page" class="nrms-inout-print-table">
        <colgroup>
          <col width="120px">
          <col width="120px">
          <col width="240px">
          <col width="120px">
          <col width="240px">
          <col width="120px">
          <col width="240px">
        </colgroup>
        <thead>
        <tr>
          <th colspan="10">
            <formHeader :autoHead="autoHead"></formHeader>
          </th>
        </tr>
        <tr class="border">
          <th rowspan="2" :class="{'border-blue-th': group.data[0] && (group.data[0].type == 2 || group.data[0].type == 3 )}">日期</th>
          <th rowspan="2" :class="{'border-blue-th': group.data[0] && (group.data[0].type == 2 || group.data[0].type == 3 )}">时间</th>
          <th colspan="2">入量（ml）</th>
          <th colspan="2">出量（ml）</th>
          <th rowspan="2" :class="{'border-blue-th': group.data[0] && (group.data[0].type == 2 || group.data[0].type == 3 )}">护士签名</th>
        </tr>
        <tr class="border" :class="{'border-blue': group.data[0] && (group.data[0].type == 2 || group.data[0].type == 3 )}">
          <th>入量项目</th>
          <th>入量</th>
          <th>出量项目</th>
          <th>出量</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item, index) in group.data">
          <tr :key="index" class="border" :class="{'border-blue': group.data[index + 1] && (group.data[index + 1].type == 2 || group.data[index + 1].type == 3 )}">
            <td>
              {{getTime(item.recordTime, 'YYYY-MM-DD')}}
            </td>
            <td>
              {{getTime(item.recordTime, 'HH:mm')}}
            </td>
            <td>
              <span v-if="item.type==2 || item.type == 3">{{strSub(item.intakeMode,10)}}</span>
              <span>{{strSub(item.intakeProject,10)}}</span>
            </td>
            <td>{{item.intakeAmount}}</td>
            <td>
              <span v-if="item.type==2 || item.type == 3">{{strSub(item.outputMode,10)}}</span>
              <span>{{strSub(item.outputProject,10)}}</span>
            </td>
            <td>{{item.outputAmount}}</td>
            <td>
              <template v-if="item.nurseNameImage">
                <img :src="item.nurseNameImage" style="width: 100px; height: 30px">
              </template>
              <template v-else>
                <div style="display: flex;justify-content: center">
                  <span>{{item.nurseName}}</span>
                </div>
              </template>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
      <div class="paging">
        第{{group.page}}页
      </div>
    </div>
  </div>
</template>

<script>
import printJS from 'print-js'
import { AxiosApi } from '../../../../api/nrms/http/index'
import formHeader from '../../../../components/nrms/autoForm/header'
const moment = require('moment')

export default {
  name: 'InOutPrint',
  props: {
    patientId: String,
    printSet: String,
    autoHead: Object
  },
  components: {
    formHeader
  },
  data () {
    return {
      url: '/nrms/web-nr/intake-output',
      dataGroup: [],
      // 打印每页显示的行数
      pageSize: 19
    }
  },
  methods: {
    // 请求列表
    getData () {
      this.dataGroup = []
      AxiosApi(this.url, {}, 'GET', { patientId: this.patientId }).then(res => {
        let { data = [] } = res
        let arr = []
        let p = 1
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i])
          if (arr.length === this.pageSize) {
            this.dataGroup.push({
              page: p,
              data: arr
            })
            p++
            arr = []
          }
        }
        this.dataGroup.push({
          page: p,
          data: arr
        })

        this.$nextTick(function () {
          this.printToBrowser()
        })
      })
    },
    // 字符串截取
    strSub (str, len) {
      if (str === null || str === '') {
        return ''
      }
      return ('' + str).substring(0, len)
    },
    print () {
      this.getData()
    },
    printToBrowser () {
      const style =
          `@page { size: ${this.printSet}; margin:0 auto; }
          .box {
            padding: 10px 0
          }
          .nrms-inout-print-table {
            width: 1200px;
            text-align: center;
            font-size: 12px;
            border-collapse: collapse;
            margin-top: 30px;
          }

          .nrms-inout-print-table > thead th {
            height: 30px;
          }

          .nrms-inout-print-table > tbody td {
            word-break: break-all;
            height: 30px;
          }

          .border th, .border td {
            border: 1px solid;
          }

          .border-blue td, .border-blue th, .border .border-blue-th {
            border-bottom-color: #1e87f0;
            border-bottom-width: 2px;
          }

          .paging {
            page-break-after: always;
            text-align: center;
            padding: 5px;
            height: 20px;
          }`
      printJS({
        printable: 'nrms-inout-print-lsjjeis88', // 要打印内容的id
        type: 'html',
        style: style,
        scanStyles: false
      })
    },
    getTime (time, format = 'YYYY-MM-DD HH:mm') {
      return moment(time).format(format)
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    padding: 10px 0
  }
  .nrms-inout-print-table {
    width: 1200px;
    text-align: center;
    font-size: 12px;
    border-collapse: collapse;
  }

  .nrms-inout-print-table > thead th {
    height: 30px;
  }

  .nrms-inout-print-table > tbody td {
    word-break: break-all;
    height: 30px;
  }
  .border th, .border td {
    border: 1px solid;
  }
  .border-blue td, .border-blue th, .border .border-blue-th {
    border-bottom-color: #1e87f0;
    border-bottom-width: 2px;
  }
  .paging {
    page-break-after: always;
    text-align: right;
    padding: 5px;
    height: 20px;
  }
</style>
