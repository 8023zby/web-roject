<template>
  <div class="print_containter">
    <table cellpadding="0" cellspacing="0" border="0" id="printTableMerits"></table>
    <el-button type="primary" @click="printTableMerits()">打印</el-button>
    <el-button type="primary" @click="closeWin()">返回</el-button>
    <canvas id="line" style="display:none;"></canvas>
  </div>
</template>

<script>
import printJS from 'print-js'
import $ from 'jquery'
export default {
  name: 'PrintMerits',
  mounted () {
    this.initTable()
  },
  methods: {
    /** 打印 */
    printTableMerits () {
      const style = '.print_containter table{border-collapse: initial}' +
        ' .print_containter{' +
        '    width: 1500px;' +
        '    height: 100%;' +
        '    margin-left:auto;' +
        '    margin-right:auto;' +
        '    text-align: center;' +
        '}' +
        '    #printTableMerits td,#printTableMerits th {' +
        '      word-wrap:break-word;' +
        '      word-break:break-all;' +
        '    }' +
        '    #printTableMerits{' +
        '      width: 100%;' +
        '      padding: 10px;' +
        '    }' +
        '    #printTableMerits th,#printTableMerits td{' +
        '      border: 1px solid #000000;' +
        '      text-align: center;' +
        '    }' +
        '    #printTableMerits td{' +
        '      height: 60px;' +
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
        '    .tdCls{' +
        '      width: 60px;' +
        '    }' +
        '  @media print{' +
        '    INPUT {display:none}' +
        '    table{page-break-after:always}' +
        '    thead{display:table-header-group}' +
        '    body{-webkit-print-color-adjust:exact;}' +
        '  }'
      printJS({
        printable: 'printTableMerits', // 要打印内容的id
        type: 'html',
        style: style,
        scanStyles: false
      })
    },
    /** 关闭 */
    closeWin () {
      localStorage.setItem('tableDataMerits', '')
      window.close()
    },
    /** 形成表单 */
    initTable () {
      let d = localStorage.getItem('tableDataMerits')
      let html = ''
      let th1 = '<tr>'
      let tbodyHtml = ''
      if (d !== '') {
        d = JSON.parse(d)
        let thead = d.thead
        let tbody = d.tbody
        $.each(thead, function (index, val) {
          if (index === 0) {
            th1 += '<th style="width: 40px;height: 40px">' + val.name + '</th>'
          } else if (index === 1) {
            th1 += '<th class="tdCls">姓名</th>'
          } else {
            th1 += '<th>' + val.name + '</th>'
          }
        })
        th1 += '</tr>'
        $.each(tbody, function (index, val) {
          let tds = val
          tbodyHtml += '<tr>'
          $.each(tds, function (i, v) {
            tbodyHtml += '<td>' + v.name + '</td>'
          })
          tbodyHtml += '</tr>'
        })
        html = '<thead>' + th1 + '</thead><tbody>' + tbodyHtml + '</tbody>'
        $('#printTableMerits').html(html)
        let len = $('#printTableMerits').find('tr').length
        let tableHeight = $('#printTableMerits').height()
        let h = 60 + Math.floor((990 - tableHeight) / (len - 2))
        if (h > 150) {
          h = 150
        }
        $('#printTableMerits').find('td').css({
          height: h + 'px'
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .print_containter{
    width: 1500px;
    height: 100%;
    margin-left:auto;
    margin-right:auto;
    text-align: center;
    table{border-collapse: initial}
    #printTableMerits td,#printTableMerits th {
      word-wrap:break-word;
      word-break:break-all;
    }
    #printTableMerits{
      width: 100%;
      padding: 10px;
    }
    #printTableMerits th,#printTableMerits td{
      border: 1px solid #000000;
      text-align: center;
    }
    #printTableMerits td{
      height: 60px;
    }
    .btnCls{
      height: 38px;
      line-height: 38px;
      padding: 0 18px;
      background-color: #009688;
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
    .tdCls{
      width: 60px;
    }
  }
  @media print{
    INPUT {display:none}
    table{page-break-after:always}
    thead{display:table-header-group}
    body{-webkit-print-color-adjust:exact;}
  }
</style>
