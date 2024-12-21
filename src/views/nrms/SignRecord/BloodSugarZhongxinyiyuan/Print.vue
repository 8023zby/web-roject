<template>
  <div :id="'nrms-blood-print-' + formId">
    <div v-for="group in dataGroup" class="box">
      <!--startprint_xt-->
      <table :key="group.page" class="nrms-blood-print-table">
        <colgroup>
          <col width="80px">
          <col width="auto">
          <col width="auto">
          <col width="auto">
          <col width="auto">
          <col width="auto">
          <col width="auto">
          <col width="auto">
          <col width="auto">
          <col width="auto">
          <col width="160px" v-if="isGlucoseMeter">
          <col width="80px">
          <!-- 2020-12-25 世博血糖单增加备注字段 -->
          <template v-if="autoHead.tplId === 'H-000010-WXT-0001'">
            <col width="70px">
          </template>
        </colgroup>
        <thead>
        <tr>
          <th colspan="12">
            <formHeader :autoHead="autoHead"></formHeader>
          </th>
        </tr>
        <tr class="border">
          <th rowspan="2">
            时间
          </th>
          <th :colspan="titData.length">血糖测量结果（mmol/L）</th>
          <th v-if="isGlucoseMeter" rowspan="2">
            血糖仪编号
          </th>
          <th rowspan="2">
            护士签名
          </th>
          <!-- 2020-12-25 世博血糖单增加备注字段 -->
          <template v-if="autoHead.tplId === 'H-000010-WXT-0001'">
            <th rowspan="2">
              备注
            </th>
          </template>
        </tr>
        <tr class="border">
          <th v-for="(item, index) in titData" :key="index">
            {{item.label}}
          </th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item,index) in group.data">
          <tr :key="index" class="border">
            <td>
              {{item.recordTime.split(' ')[0]}}<br />{{item.recordTime.split(' ')[1]}}
            </td>
            <td v-for="(d, i) in titData" :key="i">
              {{getResult(item,d.id)}}
            </td>
            <td v-if="isGlucoseMeter">
              {{strSub(item.glucometerNumber, 20)}}
            </td>
            <td>
              <template v-if="item.nurseNameImage">
                <img :src="item.nurseNameImage" style="width: 99%; height: 30px">
              </template>
              <template v-else>
                {{strSub(item.nurseName, 5)}}
              </template>
            </td>
            <!-- 2020-12-25 世博血糖单增加备注字段 -->
            <template v-if="autoHead.tplId === 'H-000010-WXT-0001'">
              <td style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                {{item.remark}}
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
import { AxiosApi } from '../../../../api/nrms/http/index'
import formHeader from '../../../../components/nrms/autoForm/header'

export default {
  name: 'BloodPrint',
  props: {
    patientId: String,
    // 打印方向
    printSet: String,
    // 表头
    autoHead: Object,
    // 是否显示血糖仪编号
    isGlucoseMeter: Number,
    // 血糖测量结果
    titData: Array,
    formId: String
  },
  components: {
    formHeader
  },
  data () {
    return {
      url: '/nrms/web-nr/glucometer-record/queryAll',
      dataGroup: [],
      // 打印每页显示的行数
      pageSize: 16
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
      const style =
          `@page { size: ${this.printSet}; margin:10px auto; }
          .box {
            padding: 10px 0;
            text-align: right;
          }
          .nrms-blood-print-table {
            width: 100%;
            text-align: center;
            font-size: 12px;
            border-collapse: collapse;
            table-layout: fixed;
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
            width:1200px
            page-break-after: always;
            text-align: right;
            padding: 5px;
            height: 20px;
          }`
      printJS({
        printable: `nrms-blood-print-${this.formId}`, // 要打印内容的id
        type: 'html',
        style: style,
        scanStyles: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    padding: 10px 0;
    text-align: right;
  }
  .nrms-blood-print-table {
    width: 1200px;
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
    width: 1200px;
    page-break-after: always;
    text-align: right;
    padding: 5px;
    height: 20px;
  }
</style>
