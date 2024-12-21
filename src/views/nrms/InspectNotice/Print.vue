<template>
  <div id="print-inspectNotice-lj23lkajdsf" style="width: 1000px">
    <table>
      <colgroup>
        <col width="110px">
        <col width="200px">
        <col width="90px">
        <col width="140px">
        <col width="180px">
        <col width="180px">
        <col width="100px">
      </colgroup>
      <tr>
        <th colspan="7">
          <formHeader :autoHead="autoHead"></formHeader>
        </th>
      </tr>
      <tr class="border">
        <th  style="text-align: center">日期</th>
        <th  style="text-align: center">检查项目</th>
        <th  style="text-align: center">检查时间</th>
        <th  style="text-align: center">地点</th>
        <th  style="text-align: center">注意事项</th>
        <th  style="text-align: center">备注</th>
        <th  style="text-align: center">护士/家属签名</th>
      </tr>
      <tr v-for="(item, index) in inspectTemplate.list" :key="index" class="border">
        <td>{{getTime(inspectValue[item.id].date, 'YYYY-MM-DD')}}</td>
        <td>
          <el-checkbox-group v-model="inspectValue[item.id].inspects">
            <el-checkbox :label="v" :key="i" v-for="(v, i) in item.inspects"></el-checkbox>
          </el-checkbox-group>
        </td>
        <td>{{getTime(inspectValue[item.id].time, 'HH:mm')}}</td>
        <td style="text-align: center">
          <div v-html="item.places" style="white-space: pre-wrap;"></div>
        </td>
        <td>
          <div v-html="item.attention" style="white-space: pre-wrap;"></div>
        </td>
        <td>
          <div v-html="item.remark" style="white-space: pre-wrap;"></div>
        </td>
        <td>
          <span v-if="inspectValue[item.id].isConfirm">已确认</span>
          <!-- <span v-else>未确认</span> -->
        </td>
      </tr>
      <tr class="border" v-if="inspectTemplate.describe">
        <td colspan="7">
          <div style="width: 800px;overflow:hidden;margin: 0 auto">
            <div v-html="inspectTemplate.describe" style="white-space: pre-wrap;"></div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import formHeader from '../../../components/nrms/autoForm/header'
import printJS from 'print-js'
const moment = require('moment')
export default {
  props: [ 'autoHead', 'inspectTemplate', 'inspectValue', 'printSet' ],
  components: {
    formHeader
  },
  methods: {
    getTime (time, format) {
      if (!time) {
        return ''
      }
      return moment(time).format(format)
    },
    print () {
      const style =
      `
        @page { size: ${this.printSet}; margin:10px auto; }
        table {
          border-collapse: collapse;
          border-spacing: 0;
        }
        th {
          height: 30px;
        }
        tr {
          min-height: 30px;
        }
        td {
          min-height: 30px;
          padding: 10px;
          height: 30px;
        }
        .border th, .border td {
          border: 1px solid;
        }
        .el-checkbox {
          display: block
        }

        .el-checkbox .el-checkbox__label {
          white-space: normal;
        }
        .describe {
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        }
      `
      printJS({
        printable: 'print-inspectNotice-lj23lkajdsf', // 要打印内容的id
        type: 'html',
        style: style,
        scanStyles: false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
th {
  height: 30px
}
td {
  min-height: 30px;
  padding: 10px 10px;
}
.border th, .border td {
  border: 1px solid;
}
</style>
