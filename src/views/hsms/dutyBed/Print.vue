<template>
  <div class="print_containter">
    <table cellpadding="0" cellspacing="0" border="0" id="printTableBed"></table>
    <el-button type="primary" v-uni="'paichuangguanlidayin'" @click="printTableBed()">打印</el-button>
    <el-button type="primary" v-uni="'paichuangguanlifanhui'" @click="closeWin()">返回</el-button>
    <canvas id="line" style="display:none;"></canvas>
  </div>
</template>

<script>
import printJS from 'print-js'
import $ from 'jquery'
export default {
  name: 'PrintBed',
  mounted () {
    this.initTable()
  },
  methods: {
    /** 打印  */
    printTableBed () {
      const style = '.print_containter table{border-collapse: initial}' +
        '.print_containter{' +
        '    width: 1200px;' +
        '    height: 100%;' +
        '    margin-left:auto;' +
        '    margin-right:auto;' +
        '    text-align: center;' +
        '}' +
        '    #printTableBed td {' +
        '      word-wrap:break-word;' +
        '      word-break:break-all;' +
        '    }' +
        '    #printTableBed{' +
        '      width: 100%;' +
        '      padding: 10px;' +
        '    }' +
        '    #printTableBed th,#printTableBed td{' +
        '      border: 1px solid #000000;' +
        '      text-align: center;' +
        '    }' +
        '    #printTableBed td{' +
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
        '    #lineTd{' +
        '      position: relative;' +
        '      width: 100px;' +
        '    }' +
        '    .titNameCls {' +
        '      position: absolute;' +
        '      left: 3px;' +
        '      bottom: 3px;' +
        '    }' +
        '    .titDateCls {' +
        '      position: absolute;' +
        '      right: 3px;' +
        '      top: 3px;' +
        '    }' +
        '  @media print{' +
        '    INPUT {display:none}' +
        '    table{page-break-after:always}' +
        '    thead{display:table-header-group}' +
        '    body{-webkit-print-color-adjust:exact;}' +
        '  }'
      printJS({
        printable: 'printTableBed', // 要打印内容的id
        type: 'html',
        style: style,
        scanStyles: false
      })
    },
    /** 关闭 */
    closeWin () {
      localStorage.setItem('tableDataBed', '')
      window.close()
    },
    /** 形成表单 */
    initTable () {
      let d = localStorage.getItem('tableDataBed')
      let html = ''
      let th1 = '<tr>'
      let tbodyHtml = ''
      if (d !== '') {
        d = JSON.parse(d)
        let thead = d.thead
        let tbody = d.tbody
        $.each(thead, function (index, val) {
          th1 += '<th style="height: 40px">' + val.name + '</th>'
        })
        th1 += '</tr>'
        $.each(tbody, function (i, v) {
          tbodyHtml += '<tr><td width="15%">' + v.accountId + '</td>' +
                            '<td width="15%">' + v.accountName + '</td>' +
                            '<td width="20%">' + v.shiftName + '</td>' +
                            '<td width="25%">' + v.shiftSpanList + '</td>' +
                            '<td width="25%">' + v.bedOrRoomStr + '</td>' +
                        '</tr>'
        })
        html = '<thead>' + th1 + '</thead><tbody>' + tbodyHtml + '</tbody>'
        $('#printTableBed').html(html)
        let len = $('#printTableBed').find('tr').length
        let tableHeight = $('#printTableBed').height()
        let h = 60 + Math.floor((1000 - tableHeight) / (len - 2))
        if (h > 150) {
          h = 150
        }
        $('#printTableBed').find('td').css({
          height: h + 'px'
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .print_containter{
    width: 1200px;
    height: 100%;
    margin-left:auto;
    margin-right:auto;
    text-align: center;
    table{border-collapse: initial}
    #printTableBed td {
      word-wrap:break-word;
      word-break:break-all;
    }
    #printTableBed{
      width: 100%;
      padding: 10px;
    }
    #printTableBed th,#printTableBed td{
      border: 1px solid #000000;
      text-align: center;
    }
    #printTableBed td{
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
    #lineTd{
      position: relative;
      width: 100px;
    }
    .titNameCls {
      position: absolute;
      left: 3px;
      bottom: 3px;
    }
    .titDateCls {
      position: absolute;
      right: 3px;
      top: 3px;
    }
  }
  @media print{
    INPUT {display:none}
    table{page-break-after:always}
    thead{display:table-header-group}
    body{-webkit-print-color-adjust:exact;}
  }
</style>
