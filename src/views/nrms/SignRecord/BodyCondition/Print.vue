<template>
  <div id="nrms-body-print-lsjxx34jeis88">
    <div v-for="(group, index) in dataGroup" :key="index" class="box">
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
          <col width="80px">
        </colgroup>
        <thead>
          <tr>
            <th colspan="12">
              <formHeader :autoHead="autoHead"></formHeader>
            </th>
          </tr>
          <tr class="border">
            <th colspan="2">
              测量时间
            </th>
            <th v-for="(item, index) in titData" :key="index" :style="'width:' +  750 / titData.length + 'px'">
              {{item.name}}
            </th>
          </tr>
        </thead>
        <tbody>
        <template v-for="(item,index) in group.data">
          <tr :key="index" class="border">
            <td colspan="2">
              {{item.recordDate.split(' ')[0]}}<br />{{item.recordDate.split(' ')[1]}}
            </td>
            <td v-for="(d, i) in titData" :key="i">
              {{getResult(item,d.prop)}}
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

export default {
  name: 'BloodPrint',
  props: {
    patientId: String,
    // 打印方向
    printSet: String,
    // 表头
    autoHead: Object,
    // 血糖测量结果
    titData: Array,
    formCode: String
  },
  components: {
    formHeader
  },
  data () {
    return {
      url: '/nrms/web-nr/circumference',
      dataGroup: [],
      // 打印每页显示的行数
      pageSize: 32
    }
  },
  methods: {
    // 请求列表
    getData () {
      this.dataGroup = []
      AxiosApi(this.url, {}, 'GET', { patientId: this.patientId, formCode: this.formCode }).then(res => {
        res.data.list.map((v) => {
          v.signList.map((o) => {
            v[o.signName] = o.signValue
          })
          v.recordTime = v.recordDate
          return v
        })

        let data = res.data.list
        let arr = []
        let p = 1

        // 对data进行处理 data 的长度是 pageSize的整数倍，不需要处理，否则得补全
        let _num = Math.ceil(data.length / this.pageSize)
        let _newArr = []
        if (_num === 0) {
          _num = 1
        }

        _newArr = this.formatArr(data, _num * this.pageSize)

        for (let i = 0; i < _newArr.length; i++) {
          arr.push(_newArr[i])
          if (arr.length === this.pageSize) {
            this.dataGroup.push({
              page: p,
              data: arr
            })
            p++
            arr = []
          }
        }

        // this.dataGroup.push({
        //   page: p,
        //   data: arr
        // })

        this.$nextTick(function () {
          this.printToBrowser()
        })
      })
    },
    formatArr (arr, n) {
      let len = arr.length
      if (n <= arr.length) {
        return arr.slice(0, n)
      }
      return arr.concat(new Array(n - len).fill({ recordDate: '', signList: [{ signId: 'bloodVal', signValue: '' }] })) // 可填充所需数据类型
    },
    getResult (item, key) {
      return item[key]
    },
    print () {
      this.getData()
    },
    printToBrowser () {
      const style =
          `@page { size: ${this.printSet}; margin:0 auto; }
          .box {
            padding: 10px 0;
            text-align: right;
            page-break-after: always;
          }
          .nrms-blood-print-table {
            width: 800px;
            text-align: center;
            font-size: 12px;
            border-collapse: collapse;
          }

          .nrms-blood-print-table > thead th {
            height: 38px;
          }

          .nrms-blood-print-table > tbody td {
            word-break: break-all;
            height: 38px;
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
        printable: 'nrms-body-print-lsjxx34jeis88', // 要打印内容的id
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
