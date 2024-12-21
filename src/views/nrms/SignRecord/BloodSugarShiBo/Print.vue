<template>
  <div style="width: 1050px" :id="'nrms-body-print-lsjxx34jeis88' + formCode">
    <div>
      <div v-for="(item,index) in dataGroup" :key="index" style="page-break-after:always;padding-top: 30px">
        <formHeader :autoHead="autoHead"></formHeader>
        <div class="table-box" style="display: flex;padding-right: 15px;width: 100%;justify-content: center;">
          <table border="0" cellspacing="0" cellpadding="0" align="center" style="width: 50%">
            <thead>
              <tr>
                <th>日期</th>
                <th>时间</th>
                <th>血糖值<br />(mmol/L)</th>
                <th>测量者</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(v,i) in item.data[0]" :key="i">
                <td v-if="v.recordDate">
                  <span>{{ getDate(item.data[0][i - 1] ? item.data[0][i - 1].recordDate.substr(0,10) : '' ,v.recordDate.substr(0,10)) }}</span>
                </td>
                <td v-else></td>
                <td v-if="v.recordDate">
                  {{v.recordDate.substr(11, 5)}}
                </td>
                <td v-else></td>
                <td>
                  {{ v.bloodVal }}
                </td>
                <td>
                  {{ v.userName }}
                </td>
                <td>
                  {{ v.remark }}
                </td>
              </tr>
            </tbody>
          </table>
          <table border="0" cellspacing="0" cellpadding="0" align="center" style="width: 50%">
            <thead>
              <tr>
                <th>日期</th>
                <th>时间</th>
                <th>血糖值<br />(mmol/L)</th>
                <th>测量者</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(v,i) in item.data[1]" :key="i">
                <td v-if="v.recordDate">
                  <span>{{ getDate(item.data[1][i - 1] ? item.data[1][i - 1].recordDate.substr(0,10) : '' ,v.recordDate.substr(0,10)) }}</span>
                </td>
                <td v-else></td>
                <td v-if="v.recordDate">
                  {{v.recordDate.substr(11, 5)}}
                </td>
                <td v-else></td>
                <td>
                  {{ v.bloodVal }}
                </td>
                <td>
                  {{ v.userName }}
                </td>
                <td>
                  {{ v.remark }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="paging">
          第 {{ index + 1 }} 页
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import printJS from 'print-js'
import { AxiosApi } from '../../../../api/nrms/http/index'
import formHeader from '../../../../components/nrms/autoForm/header'
import moment from 'moment'

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
      pageSize: 42
    }
  },
  methods: {
    getDate (lastDate, nowDate) { // 如果当前日期换月了，体现全部，否则只显示日
      if (!nowDate) {
        return ''
      }
      if (!lastDate) {
        return nowDate
      }
      let lastDateMonth = moment(lastDate).month()
      let nowDateMonth = moment(nowDate).month()
      let lastDateYear = moment(lastDate).year()
      let nowDateYear = moment(nowDate).year()
      if ((lastDateMonth === nowDateMonth) && (lastDateYear === nowDateYear)) {
        return moment(nowDate).date() < 10 ? '0' + moment(nowDate).date() : moment(nowDate).date()
      } else {
        return nowDate
      }
    },
    getData () { // 请求列表
      this.dataGroup = []
      AxiosApi(this.url, {}, 'GET', { patientId: this.patientId, formCode: this.formCode }).then(res => {
        res.data.list.map((v) => {
          v.signList.map((o) => {
            v[o.signId] = o.signValue
          })

          v.extend.map((o) => {
            v[o.extendName] = o.extendValue
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

        // 对分页完成的数据再进行半页分数据
        this.dataGroup.map((v) => {
          v.data = this.group(v.data, this.pageSize / 2)
        })

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
    group (array, subGroupLength) { // 将一个数组按长度分成两个数组
      let index = 0
      let newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength))
      }
      return newArray
    },
    // 字符串截取
    strSub (str, len) {
      if (str === null || str === '') {
        return ''
      }
      return ('' + str).substring(0, len)
    },
    getResult (item, key) {
      return item[key]
    },
    print () {
      this.getData()
    },
    printToBrowser () {
      printJS({
        printable: 'nrms-body-print-lsjxx34jeis88' + this.formCode, // 要打印内容的id
        type: 'html',
        style: `
        @page { size: ${this.printSet};margin:0 auto; }
        li {
          font-size: 12px
        }
        .table-box table{
          border: 1px solid #333;
        }
        .table-box th, .table-box td {
          border: 1px solid #333;
          font-size: 12px
        }
        .table-box th {
          padding: 10px
        }
        .table-box td {
          padding: 10px;
          height: 38px;
          text-align: center;
        }
        .paging {
          width:1200px
          page-break-after: always;
          text-align: center;
          padding: 5px;
          line-height:200px;
          height: 30px;
        }
        `,
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
