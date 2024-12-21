<template>
  <div id="nrms-blood2-print-lsjxx34jeis89">
    <div v-for="group in dataGroup" class="box">
      <!--startprint_xt-->
      <table :key="group.page" class="nrms-blood-print-table">
        <thead>
        <tr>
          <th colspan="12">
            <formHeader :autoHead="autoHead"></formHeader>
          </th>
        </tr>
        <tr class="border">
          <th rowspan="2">
            日期
          </th>
          <th rowspan="2">
            项目
          </th>
          <th colspan="2">
            早餐
          </th>
          <th colspan="2">
            午餐
          </th>
          <th colspan="2">
            晚餐
          </th>
          <template v-for="(item,index) in formDictExtendDoList">
            <th rowspan="2" :key="index">
              {{item.projectName}}
            </th>
          </template>
        </tr>
        <tr class="border">
          <th>前</th>
          <th>后</th>
          <th>前</th>
          <th>后</th>
          <th>前</th>
          <th>后</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item,index) in group.data">
          <tr :key="index" class="border">
            <td rowspan="2" v-if="index % 2 == 0">{{item.recordDate}}</td>
            <td><span v-html="item.proj"></span></td>
            <td>{{item.zaocanqian}}</td>
            <td>{{item.zaocanhou}}</td>
            <td>{{item.wucanqian}}</td>
            <td>{{item.wucanhou}}</td>
            <td>{{item.wancanqian}}</td>
            <td>{{item.wancanhou}}</td>
            <template v-for="(v,index) in formDictExtendDoList">
              <td :key="index">
                {{item[v.fieldName]}}
              </td>
            </template>
          </tr>
        </template>
        </tbody>
      </table>
      <!--endprint_xt-->
      <div class="paging">
        第{{group.page}}页
      </div>
    </div>
  </div>
</template>

<script>
import printJS from 'print-js'
import formHeader from '../../../../components/nrms/autoForm/header'
import { ApiBloodMonitoring } from '../../../../api/nrms'
const moment = require('moment')

export default {
  name: 'BloodPrint',
  props: {
    patientId: String,
    // 打印方向
    printSet: String,
    // 表头
    autoHead: Object,
    // 配置项
    formDictExtendDoList: Array,
    // formCode
    formCode: String
  },
  components: {
    formHeader
  },
  data () {
    return {
      dataGroup: [],
      // 打印每页显示的行数
      pageSize: 36
    }
  },
  methods: {
    // 请求列表
    async getData () {
      this.dataGroup = []
      try {
        let res = await ApiBloodMonitoring.list({
          patientId: this.patientId,
          formCode: this.formCode
        })
        let data = res.data.list
        let arr = []
        let p = 1
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          let signObj = {
            recordDate: moment(element.recordDate).format('YYYY-MM-DD'),
            proj: '血糖值<br/>(mmol/L)',
            element
          }
          let extendObj = {
            recordDate: moment(element.recordDate).format('YYYY-MM-DD'),
            proj: '测量者',
            element
          }
          element.signList.map(v => {
            signObj[v.signId] = v.signValue
          })
          element.extend.map(v => {
            extendObj[v.extendName] = v.extendValue
          })
          arr.push(signObj)
          arr.push(extendObj)
          console.log(arr.length, this.pageSize)
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

        this.$nextTick(() => {
          this.printToBrowser()
        })
      } catch (error) {
      }
    },
    // 字符串截取
    strSub (str, len) {
      if (str === null || str === '') {
        return ''
      }
      return ('' + str).substring(0, len)
    },
    getResult (item, key) {
      if (item.measurePeriod === key) {
        return this.strSub((item.measureResult || ''), 5)
      } else {
        return ''
      }
    },
    print () {
      this.getData()
    },
    printToBrowser () {
      let style =
          `@page { size: ${this.printSet}; margin:10px auto; }
          .box {
            padding: 10px 0;
            text-align: right;
            padding-top: 30px;
            page-break-after: always;
          }
          .nrms-blood-print-table {
            width: 1050px;
            text-align: center;
            font-size: 12px;
            border-collapse: collapse;
            // table-layout: fixed;
          }

          .nrms-blood-print-table > thead th {
            height: 30px;
          }

          .nrms-blood-print-table > tbody td {
            word-break: break-all;
            height: 30px;
          }

          .border th, .border td {
            border: 1px solid;
          }

          .paging {
            width: 100%
            text-align: center;
            padding: 5px;
            height: 20px;
            display:flex;
            justify-content: center;
          }`
      if (this.formDictExtendDoList.length > 4) {
        style += `
          table {
            table-layout: fixed;
          }
        `
      }
      printJS({
        printable: 'nrms-blood2-print-lsjxx34jeis89', // 要打印内容的id
        type: 'html',
        style: style,
        scanStyles: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  table {
    table-layout: fixed;
  }
  .box {
    padding: 10px 0;
    text-align: right;
  }
  .nrms-blood-print-table {
    width: 1050px;
    text-align: center;
    font-size: 12px;
    border-collapse: collapse;
  }

  .nrms-blood-print-table > thead th {
    height: 30px;
  }

  .nrms-blood-print-table > tbody td {
    word-break: break-all;
    height: 30px;
  }
  .border th, .border td {
    border: 1px solid;
  }
  .paging {
    width: 800px;
    page-break-after: always;
    text-align: center;
    padding: 5px;
    height: 20px;
  }
</style>
