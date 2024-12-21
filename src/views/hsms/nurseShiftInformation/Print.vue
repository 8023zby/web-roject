<template>
  <div class="nurse-shift-infomation-print-containter">
    <!-- v-uni="'paibanliushuidayinliebiao'" -->
    <table cellpadding="0"
           cellspacing="0"
           border="0"
           style="width: 1070px;table-layout: fixed"
           id="printTable"></table>
    <el-button type="primary"
               @click="printTable()" v-uni="'paibanliushui_print'">打印
    </el-button>
    <el-button type="primary"
               @click="closeWin()" v-uni="'paibanliushui_return'">返回
    </el-button>
    <canvas id="line" style="display:none;"></canvas>
  </div>
</template>

<script>
import $ from 'jquery'
import printJS from 'print-js'
import { line } from '../../../assets/hsms/unitils/unitils'
import iconContrast from '../nurseDuty/iconContrast'

export default {
  name: 'Print',
  mounted () {
    this.initTable()
  },
  methods: {
    /** 打印 */
    printTable () {
      const style = '.nurse-shift-infomation-print-containter table{border-collapse: initial}' +
          '.nurse-shift-infomation-print-containter{' +
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
        css: '/static/hsms/icons/iconfont.css',
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
        // console.log(remarkData)
        if (printType === 'SHIFT_BED_NOTE' || printType === 'SHIFT_NOTE') {
          $.each(remarkData, function (index, val) {
            if (index === 0) {
              remarkHtml += '<tr>' +
                  '<td rowspan="' + remarkData.length + '" colspan="2" style="padding: 10px">备注</td>' +
                  '<td colspan="' + (thead.length - 2) + '" style="text-align: left">&emsp;' + (index + 1) + '、&nbsp' + val.noteDescribe + '</td>'
            } else {
              remarkHtml += '<tr>' +
                  '<td colspan="' + (thead.length - 2) + '" style="text-align: left;">&emsp;' + (index + 1) + '、&nbsp' + val.noteDescribe + '</td>'
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
          switch (val.key) {
            case 'index':
              th1 += '<th rowspan="2" style="width: 50px;">' + val.name + '</th>'
              break
            case 'name':
              th1 += '<th rowspan="2" width="80">' +
                val.name +
                '</th>'
              break
            case 'level':
              th1 += '<th rowspan="2" width="80">' + val.name + '</th>'
              break
            case 'date':
              th1 += '<th>' + val.name + '</th>'
              th2 += '<th>' + val.week + '</th>'
              break
            case 'weekWorkHour':
              th1 += '<th rowspan="2" width="70">' + val.name + '</th>'
              break
            case 'arrearsHour':
              th1 += '<th rowspan="2" width="80">' + val.name + '</th>'
              break
            case 'annualCount':
              th2 += '<th width="80">' + val.name + '</th>'
              break
            case 'annualLeave':
              th2 += '<th width="80">' + val.name + '</th>'
              break
            default:
              break
          }
        })
        let nianjiaLength = (thead.filter(v => v.key == 'annualCount' || v.key == 'annualLeave')).length
        th1 += nianjiaLength ? '<th colspan="' + nianjiaLength + '">年休</th>' : ''
        // console.log(th1)
        th1 += '</tr>'
        th2 += '</tr>'
        $.each(tbody, function (index, val) {
          let tds = val
          tbodyHtml += '<tr>'
          $.each(tds, function (i, v) {
            switch (v.key) {
              case 'date':
                let showName = ''
                v.name.map((item, nameIndex) => {
                  if (nameIndex == 0) {
                    showName += item.shiftDetail.shiftImg ? ('<i class="iconfont-hsms ' + iconContrast[item.shiftDetail.shiftImg].id + ' " ></i>') : item.shiftDetail.shiftName
                  } else {
                    showName += `/${item.shiftDetail.shiftImg ? ('<i class="iconfont-hsms ' + iconContrast[item.shiftDetail.shiftImg].id + ' " />') : item.shiftDetail.shiftName}`
                  }
                })
                if (printType === 'SHIFT' || printType === 'SHIFT_NOTE') {
                } else {
                  if (v.printBedOrRoom) {
                    for (let itemP of v.printBedOrRoom) {
                      if (itemP.bedList) {
                        showName += '<br/><span>床位号:' + itemP.bedList + '</span>'
                      }
                      if (itemP.roomList) {
                        showName += '<br/><span>房间号:' + itemP.roomList + '</span>'
                      }
                      // 判断下 ‘/’
                      if ((v.printBedOrRoom.indexOf(itemP) + 1) < v.printBedOrRoom.length) {
                        showName += '<span>/</span>'
                      }
                    }
                  }
                }
                tbodyHtml += '<td style="padding: 2px 0">' + showName + '</td>'
                break
              default:
                tbodyHtml += '<td style="padding: 2px 0">' + v.name + '</td>'
                break
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
        // let len = $('#printTable').find('tr').length
        // let tableHeight = $('#printTable').height()
        // let h = 60 + Math.floor((1000 - tableHeight) / (len - 2))
        // if (h > 150) {
        //   h = 150
        // }
        // $('#printTable').find('td').css({
        //   height: h + 'px'
        // })
      }
    }
  }
}
</script>

<style lang="scss">
  .nurse-shift-infomation-print-containter {
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

    #printTable th {
      height: 30px;
    }

    .td-top {
      vertical-align: top;
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
<style lang="scss" scoped>
  @import '../../../../public/static/hsms/icons/iconfont.css';
</style>
