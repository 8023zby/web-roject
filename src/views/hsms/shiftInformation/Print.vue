<template>
  <div class="shift-information-print-containter">
    <table cellpadding="0"
           cellspacing="0"
           border="0"
           id="printTable"></table>
    <el-button type="primary"
              v-uni="'yishengyuepaibandayin'"
               @click="printTable()">打印
    </el-button>
    <el-button type="primary"
              v-uni="'yishengyuepaibanfanhui'"
               @click="closeWin()">返回
    </el-button>
    <canvas id="line" style="display:none;"></canvas>
  </div>
</template>

<script>
import $ from 'jquery'
import printJS from 'print-js'
import { line } from '../../../assets/hsms/unitils/unitils'

export default {
  name: 'Print',
  mounted () {
    this.initTable()
  },
  methods: {
    /** 打印 */
    printTable () {
      const style = '.shift-information-print-containter table{border-collapse: initial}' +
          '.shift-information-print-containter{' +
          '    width: 1000px;' +
          '    height: 100%;' +
          '    margin-left:auto;' +
          '    margin-right:auto;' +
          '    text-align: center;' +
          '}' +
          '    #printTable td {' +
          '      word-wrap:break-word;' +
          '      word-break:break-all;' +
          '    }' +
          '    #printTable{' +
          '      width: 100%;' +
          '      padding: 10px;' +
          '    }' +
          '    #printTable th,#printTable td{' +
          '      border: 1px solid #000000;' +
          '      text-align: center;' +
          '    }' +
          '    #first-beizhu{' +
          '       /*border-bottom: 1px solid #000000 !important;*/' +
          '    }' +
          '    #printTable td{' +
          '      height: 60px;' +
          '    }' +
          '    #printTable th{' +
          '      height: 30px;' +
          '    }' +
          '    .td-top{' +
          '      vertical-align: top;' +
          '    }' +
          '    .btnCls{' +
          '      height: 38px;' +
          '      line-height: 38px;' +
          '      padding: 0 18px;' +
          '      background-color: #009688;' +
          '      color: #fff;' +
          '      white-space: nowrap;' +
          '      text-align: center;' +
          '      font-size: 14px;' +
          '      border: none;' +
          '      border-radius: 2px;' +
          '      cursor: pointer;' +
          '      background-color: #1E9FFF;' +
          '      margin-left: auto;' +
          '      margin-right: auto;' +
          '    }' +
          '    #lineTd{' +
          '      position: relative;' +
          '      width: 100px;' +
          '    }' +
          '    .titNameCls {' +
          '      position: absolute;' +
          '      left: 5px;' +
          '      bottom: 5px;' +
          '    }' +
          '    .titDateCls {' +
          '      position: absolute;' +
          '      right: 5px;' +
          '      top: 5px;' +
          '    }' +
          '  @media print{' +
          '    INPUT {display:none}' +
          '    table{page-break-after:always}' +
          '    thead{display:table-header-group}' +
          '    body{-webkit-print-color-adjust:exact;}' +
          '  }'
      printJS({
        printable: 'printTable', // 要打印内容的id
        type: 'html',
        style: style,
        scanStyles: false
      })
    },
    /** 关闭 */
    closeWin () {
      localStorage.setItem('tableData', '')
      localStorage.setItem('printType', '')
      window.close()
    },
    /** 形成表单 */
    initTable () {
      let d = localStorage.getItem('tableData')
      let printType = localStorage.getItem('printType')
      let html = ''
      let th1 = '<tr>'
      let th2 = '<tr>'
      let remarkHtml = ''
      let tbodyHtml = ''
      if (d !== '') {
        d = JSON.parse(d)
        let thead = d.thead
        let tbody = d.tbody
        let remarkData = d.remarkData
        /* console.log(remarkData)
        let remarkDataStyle
        if (remarkData.length === 1) {
          remarkDataStyle = ''
        } else {
          remarkDataStyle = 'border-bottom: none;'
        } */
        if (printType === 'SHIFT_BED_NOTE' || printType === 'SHIFT_NOTE') {
          $.each(remarkData, function (index, val) {
            if (index === 0) {
              remarkHtml += '<tr>' +
                  '<td rowspan="' + remarkData.length + '" colspan="2">备注</td>' +
                  '<td colspan="7" style="text-align: left">&emsp;' + (index + 1) + '、&nbsp' + val.noteDescribe + '</td>'
            } else {
              remarkHtml += '<tr>' +
                  '<td colspan="7" style="text-align: left">&emsp;' + (index + 1) + '、&nbsp' + val.noteDescribe + '</td>'
            }
            /* if (index === 0) {
              remarkHtml += '<tr>' +
                '<td colspan="2" style="' + remarkDataStyle + '" ' +
                ' id="first-beizhu">备注</td>' +
                '<td colspan="7" style="text-align: left">&emsp;' + (index + 1) + '、&nbsp' + val.noteDescribe + '</td>'
            } else {
              remarkHtml += '<tr>' +
                '<td colspan="2" style="border-top: none;"></td>' +
                '<td colspan="7" style="text-align: left">&emsp;' + (index + 1) + '、&nbsp' + val.noteDescribe + '</td>'
            } */
            remarkHtml += '</tr>'
          })
        }
        $.each(thead, function (index, val) {
          if (index === 0) {
            th1 += '<th rowspan="2" style="width: 50px;">' + val.name + '</th>'
          } else if (index === 1) {
            th1 += '<th rowspan="2" id="lineTd">' +
                '<div class="titDateCls">日期</div>' +
                '<div class="titNameCls">姓名</div>' +
                '</th>'
          } else {
            th1 += '<th>' + val.name + '</th>'
            th2 += '<th>' + val.week + '</th>'
          }
        })
        th1 += '</tr>'
        th2 += '</tr>'
        $.each(tbody, function (index, val) {
          let tds = val
          tbodyHtml += '<tr>'
          $.each(tds, function (i, v) {
            if (i === 0) {
              tbodyHtml += '<td>' + v.name + '</td>'
            } else if (i === 1) {
              tbodyHtml += '<td>' + v.name + '<span>&emsp;' + v.level + '&emsp;' + v.remark + '</span></td>'
            } else {
              if (printType === 'SHIFT' || printType === 'SHIFT_NOTE') {
                tbodyHtml += '<td class="td-top">' + v.name + '</td>'
              } else {
                tbodyHtml += '<td class="td-top">' + v.name + '<br/><span>' + v.bedNoList + '</span></td>'
              }
            }
          })
          tbodyHtml += '</tr>'
        })
        // html = '<thead>' + th1 + th2 + '</thead>' +
        html = '' + th1 + th2 + '' +
            // '<tbody>' + tbodyHtml + remarkHtml + '</tbody>'
            '' + tbodyHtml + remarkHtml + ''
        $('#printTable').html(html)
        line('lineTd', 1, '#000000')
        let len = $('#printTable').find('tr').length
        let tableHeight = $('#printTable').height()
        let h = 60 + Math.floor((1000 - tableHeight) / (len - 2))
        if (h > 150) {
          h = 150
        }
        // $('#printTable').find('td').css({
        //   height: h + 'px'
        // })
      }
    }
  }
}
</script>

<style lang="scss">
  .shift-information-print-containter {
    width: 1000px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;

    table {
      border-collapse: initial
    }

    #printTable td {
      word-wrap: break-word;
      word-break: break-all;
    }

    #printTable {
      width: 100%;
      padding: 10px;
    }

    #printTable th, #printTable td {
      border: 1px solid #000000;
      text-align: center;
    }

    #printTable td {
      height: 60px;
    }

    #printTable th {
      height: 30px;
    }

    .td-top {
      /*vertical-align: top;*/
    }

    .btnCls {
      height: 38px;
      line-height: 38px;
      padding: 0 18px;
      /*background-color: #009688;*/
      color: #fff;
      white-space: nowrap;
      text-align: center;
      font-size: 14px;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      background-color: #1E9FFF;
      margin-left: auto;
      margin-right: auto;
    }

    #lineTd {
      position: relative;
      width: 100px;
    }

    .titNameCls {
      position: absolute;
      left: 5px;
      bottom: 5px;
    }

    .titDateCls {
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }
</style>
