<template>
  <div class="temperature_sheet_print_container" id="temperature_sheet_print_container">
    <!-- 自动表头 -->
    <table class="header">
      <tr>
        <td>
          <formHeader :autoHead="autoHead"></formHeader>
        </td>
      </tr>
    </table>
    <!--
      四个时间点
      计算宽度:15 * 6 / n = 22.5, n是时间点个数
      日期、住院天数、手输后天数 colspan为n
      时间hours.length ===0默认n
      每行tr 保留n个td不够补齐
    -->
    <div>
      <div style="margin: auto; position: relative; width: 750px">
        <!-- 体温单表格 -->
        <table class="tableSvg">
          <colgroup>
            <col width="59px">
            <col width="59px">
            <!--周一-->
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <!--周二-->
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <!--周三-->
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <!--周四-->
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <!--周五-->
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <!--周六-->
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <!--周七-->
            <col width="21px">
            <col width="21px">
            <col width="21px">
            <col width="21px">
          </colgroup>
          <tbody>
          <tr>
            <td class="every" colspan="2">日期</td>
            <td colspan="4" class="every" v-for="i in 7">{{curWeekDate[i - 1] || ""}}</td>
          </tr>

          <tr>
            <td class="every" colspan="2">住院天数</td>
            <td colspan="4" class="every" v-for="i in 7">{{curWeekIn[i - 1] || ""}}</td>
          </tr>

          <tr>
            <td class="every" colspan="2">手术后天数</td>
            <td colspan="4" class="every" v-for="i in 7">{{curWeekSs[i - 1] || ""}}</td>
          </tr>

          <!-- 时间轴 -->
          <tr class="height hour">
            <td colspan="2">时间</td>
            <template v-for="i in 7">
              <template v-if="hours.length === 0">
                <td v-for="n in 4" :class="{borderR : n === 4 && i !== 7}"></td>
              </template>
              <template v-else>
                <td v-for="(h, index) in hours"
                    :class="{borderR : index === 3 && i !== 7}"
                    :style="{color: h.markingColor}"
                    :key="i +'' +h.id">
                  {{h.measuringTime}}
                </td>
              </template>
            </template>
          </tr>

          <!-- 脉搏/体温 -->
          <tr class="height">
            <td rowspan="2">脉搏<br/>(次/分)</td>
            <td rowspan="2">体温<br/>(°C)</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 刻度 42 -->
          <tr class="height">
            <td rowspan="5" class="text-top">180</td>
            <td rowspan="5" class="text-top">42°C</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 刻度 41 -->
          <tr class="height">
            <td rowspan="5" class="text-top">160</td>
            <td rowspan="5" class="text-top">41°C</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 刻度 40 -->
          <tr class="height">
            <td rowspan="5" class="text-top">140</td>
            <td rowspan="5" class="text-top">40°C</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 刻度 39 -->
          <tr class="height">
            <td rowspan="5" class="text-top">120</td>
            <td rowspan="5" class="text-top">39°C</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 刻度 38 -->
          <tr class="height">
            <td rowspan="5" class="text-top">100</td>
            <td rowspan="5" class="text-top">38°C</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 刻度 37 -->
          <tr class="height">
            <td rowspan="5" class="text-top">80</td>
            <td rowspan="5" class="text-top">37°C</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 刻度 36 -->
          <tr class="height">
            <td rowspan="5" class="text-top">60</td>
            <td rowspan="5" class="text-top">36°C</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 刻度 35 -->
          <tr class="height">
            <td rowspan="5" class="text-top">40</td>
            <td rowspan="5" class="text-top">35°C</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 疼痛等级 -->
          <tr class="height">
            <td rowspan="5" class="tt">
              <span>疼</span><br/><span>痛</span><br/><span>等</span><br/><span>级</span>
            </td>
            <td rowspan="5">
              <div style="height: 100%; width: 100%; display: flex; justify-content: space-between; flex-direction: column; align-items: flex-end;">
                <div style="display: inline-block">10</div>
                <div style="display: inline-block">8</div>
                <div style="display: inline-block">6</div>
                <div style="display: inline-block">4</div>
                <div style="display: inline-block">2</div>
                <div style="display: inline-block">0</div>
              </div>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <!-- 循环可显示的体征项 -->
          <template v-for="item in showSignItem">
            <tr :key="item.signId">
              <td :class="{every: true, hx: item.signItemFieldName==='huxi'}" colspan="2">
                {{item.newSignItemShowName}}{{item.signItemUnit ? '('+item.signItemUnit+')' : ''}}
              </td>
              <template v-if="item.signItemFieldName==='huxi'">
                <td :class="{'text-top' : n % 2 === 0, 'text-bottom': n % 2 !== 0}" v-for="n in item.length">
                  <template v-if="item.data[n - 1]">
                    <span v-if="item.data[n - 1].signValue==='呼吸机'"><img src="../../assets/nrms/images/rrr.svg"></span>
                    <span v-else>{{item.data[n - 1].signValue}}</span>
                  </template>
                  <template v-else>
                    <span></span>
                  </template>
                </td>
              </template>
              <template v-else-if="item.signItemFieldName === 'xueya'">
                <template v-if="item.data[n - 1]" v-for="n in item.length">
                  <td :colspan="item.colspan" :class="{every: true, text_scale: item.data[n - 1].itemValueType === '下肢'}" >
                    <span>{{item.data[n - 1].signValue}}</span>
                  </td>
                </template>
                <template v-else>
                  <td :colspan="item.colspan" class="every"><span></span></td>
                </template>
              </template>
              <template v-else>
                <td :colspan="item.colspan" class="every" v-for="n in item.length">
                  <template v-if="item.data[n - 1]">
                    <span v-if="item.data[n - 1].signValue==='人工肛门'">
                      <img src="../../assets/nrms/images/five-star.svg">
                    </span>
                    <span v-else-if="item.data[n - 1].signValue==='大便失禁'">
                      <img src="../../assets/nrms/images/sstar.svg">
                    </span>
                    <span v-else>{{item.data[n - 1].signValue}}</span>
                  </template>
                  <template v-else>
                    <span></span>
                  </template>
                </td>
              </template>
            </tr>
          </template>
          <!-- 补空行 -->
          <tr v-for="n in (10 - showSignItem.length < 0 ? 0 : 10 - showSignItem.length)">
            <td class="every" colspan="2">&nbsp;</td>
            <td colspan="4" class="every 1"></td>
            <td colspan="4" class="every"></td>
            <td colspan="4" class="every"></td>
            <td colspan="4" class="every"></td>
            <td colspan="4" class="every"></td>
            <td colspan="4" class="every"></td>
            <td colspan="4" class="every"></td>
          </tr>

          </tbody>
        </table>
        <!-- 体温单数据绘制容器 -->
        <div class="svg_container">
          <svg :width="svgWidth + 'px'" :height="svgHeight + 'px'">
            <!--复测体温，物理降温[虚线] -->
            <template v-for="(item, index) in fctwLine">
              <g style="fill: none; stroke: red; stroke-width: 2px" :key="'fctwLine-' + index" :title="item.title || '复测体温'">
                <path stroke-dasharray="3,3" :d="item"/>
              </g>
            </template>

            <!--复测疼痛 [虚线] -->
            <template v-for="(item, index) in fcttLine">
              <g style="fill: none; stroke: red; stroke-width: 2px" :key="'fcttLine-' + index" :title="item.title || '复测疼痛'">
                <path stroke-dasharray="3,3" :d="item"/>
              </g>
            </template>

            <!-- 体温，脉搏，心率，疼痛等[折线] -->
            <template v-for="(item, index) in brokenLine">
              <path :stroke="item.stroke" stroke-width="2" fill='none' :d="item.d" :title="item.title || '折线'" />
            </template>

            <!-- 脉搏短促[线][多变形] -->
            <template v-for="(item, index) in mbdcLinePolygon.line">
              <line :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2" stroke="red" stroke-width="1" :title="item.title || '多边形'" />
            </template>
            <template v-for="(item, index) in mbdcLinePolygon.polygon">
              <polygon :points="item.points" fill="none" :stroke="item.stroke" stroke-width="2" :title="item.title || '多边形'"/>
            </template>

            <!-- 复测体温 物理降温[点  11] -->
            <template v-for="(item, index) in fctwPoint">
              <a-tooltip :title="item.title" :key="'fctwPoint-'+ index">
                <circle :cx="item.x" :cy="item.y" r="4" stroke-width="2" stroke="red" fill='#fff' :title="item.title || '复测体温点'"/>
              </a-tooltip>
            </template>

            <!-- 复测疼痛[点] -->
            <template v-for="(item, index) in fcttPoint">
              <a-tooltip :title="item.title" :key="'fcttPoint-'+ index">
                <!--<circle :cx="item.x" :cy="item.y" r="4" stroke-width="2" stroke="red" fill='#fff'/>-->
                <text :x="item.x - 4" :y="item.y" fill="red" style="font-size:11px; font-weight: bold" :title="item.title || '复测疼痛点'">p</text>
              </a-tooltip>
            </template>

            <!-- 体温，脉搏，心率，疼痛等[点   ] -->
            <template v-for="(item, index) in coincidePoint">
              <a-tooltip :title="item.title" :key="'coincidePoint-'+ index">
                <circle :cx="item.x" :cy="item.y" :r="item.r" stroke-width="2" :stroke="item.stroke" :fill='item.fill' :title="item.title || 'tw/mb/xl/tt点' "/>
              </a-tooltip>
            </template>

            <!-- 体温，脉搏，心率，疼痛等重合的/腋温 [X  ] -->
            <template v-for="(item, index) in intersectPoint">
              <svg :key="'intersectPoint-'+ index">
                <a-tooltip :title="item.title">
                  <line :cx="item.x" :cy="item.y" :x1="+item.x - +item.halfSize" :y1="+item.y - +item.halfSize" :x2="+item.x + +item.halfSize" :y2="+item.y + +item.halfSize" stroke-width="2" :stroke="item.stroke" :title="item.title || 'X'" />
                </a-tooltip>
                <a-tooltip :title="item.title">
                  <line :x1="+item.x + +item.halfSize" :y1="+item.y - +item.halfSize" :x2="+item.x - +item.halfSize" :y2="+item.y + +item.halfSize" stroke-width="2" :stroke="item.stroke" :title="item.title || 'X'"/>
                </a-tooltip>
              </svg>
            </template>

            <!-- 疼痛[点] -->
            <template v-for="(item, index) in ttPoint">
              <a-tooltip :title="item.title" :key="'ttPoint-'+ index">
                <!--<circle :cx="item.x" :cy="item.y" :r="item.r" stroke-width="2" :stroke="item.stroke" :fill='item.fill'/>-->
                <text :x="item.x - 4" :y="item.y" fill="blue" style="font-size:12px; font-weight: bold">p</text>
              </a-tooltip>
            </template>

            <!-- 箭头 -->
            <template v-for="(item, index) in arrowhead">
              <svg>
                <line :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2" :stroke="item.color" :stroke-width="1.3" marker-end='url(#markerArrow)'/>
                <defs>
                  <marker id='markerArrow' markerWidth='8' markerHeight='8' refX='4' refY='4.5' orient='auto'>
                    <path d='M1.62,1.62 L1.62,7.92 L7.2,4.32 L1.62,1.62' :fill="item.color" :title="item.title || ''"/>
                  </marker>
                </defs>
              </svg>
            </template>

            <!-- 事件 -->
            <template v-for="(item, index) in eventText">
              <svg v-if="item instanceof Array">
                <text v-for="(item2, index) in item" :x="item2.x" :y="item2.y" :fill="item2.fill" style="font-size:11px" :title="item.title || '事件'">{{item2.text}}</text>
              </svg>
              <text v-else :x="item.x" :y="item.y" :fill="item.fill" style="font-size:11px" :title="item.title || '事件'">{{item.text}}</text>
            </template>

          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formHeader from '../../components/nrms/autoForm/header'
import moment from 'moment'
import { Tooltip } from 'ant-design-vue'
import temperatureMixin from './temperatureMixin'

export default {
  name: 'TemperatureSheetNewFour',
  props: ['formHeader', 'patient', 'sheetData', 'signItem', 'curWeekDate', 'curWeekIn', 'curWeekSs', 'hours'],
  mixins: [temperatureMixin],
  data () {
    return {
      // 画布容器高度
      svgHeight: 660,
      svgWidth: 624,
      // 单个单元格的宽高 4个格子时
      td: {
        width: 22.5,
        height: 14
      },
      fctwLine: [], // 复测体温【线】
      fctwPoint: [], // 复测体温【点】
      fcttLine: [], // 复测疼痛【线】
      fcttPoint: [], // 复测疼痛【点】
      ttPoint: [], // 疼痛[点]
      brokenLine: [], // 体温、脉搏、心率、疼痛等【折线】
      coincidePoint: [], // 体温、脉搏、心率、疼痛等点和重合的点
      intersectPoint: [], // 体温、脉搏、心率、疼痛等 交叉的点
      eventText: [], // 事件文字
      arrowhead: [], // 箭头
      mbdcLinePolygon: { line: [], polygon: [] }, // 脉搏短促[线][多边形]

      showSignItem: [], // 体征项
      pointLineData: [] // 体温单数据
    }
  },
  watch: {
    // 过滤后可以显示的体征项(底部)
    sheetData: function () {
      this.reset()
      this.parseProps()
    },
    signItem: {
      handler () {
        this.reset()
        this.parseProps()
      },
      immediate: true
    },
    patient: {
      handler (val) {
        this.autoHead.tplData = val
      },
      immediate: true
    },
    formHeader: {
      handler (val) {
        this.autoHead.tplId = val.formCode || ''
        this.autoHead.formName = val.formName || ''
        this.autoHead.tplHtml = val.formStyle || ''
      },
      immediate: true
    }
  },
  created () {},
  methods: {
    // 重置所有数据
    reset () {
      this.showSignItem = []
      this.pointLineData = []

      this.fctwLine = [] // 复测体温 物理降温虚线
      this.fctwPoint = [] // 复测体温物理降温
      this.fcttLine = [] // 复测疼痛 虚线
      this.fcttPoint = [] // 复测疼痛
      this.brokenLine = [] // 体温、脉搏、心率、疼痛等折线
      this.coincidePoint = [] // 体温、脉搏、心率、疼痛等点和重合的点
      this.intersectPoint = [] // 体温、脉搏、心率、疼痛等 交叉的点
      this.eventText = [] // 事件文字
      this.ttPoint = [] // 疼痛
      this.arrowhead = [] // 箭头
      this.mbdcLinePolygon = { line: [], polygon: [] } // 脉搏短促[线][多边形]
    },
    parseProps () {
      let sheetData = this.sheetData
      if (!this.signItem || this.signItem.length === 0 || !sheetData) {
        return false
      }

      // 体温中非数字值、不在显示区间的作为事件处理
      if (sheetData['tiwen']) {
        for (let i = 0; i < sheetData['tiwen'].length; i++) {
          let _d = sheetData['tiwen'][i]
          // 空值直接忽略
          if (!_d['signValue']) {
            continue
          }
          // 不是数字的就算事件 大于42都的作为事件，把体温分组，但是不会绘制
          if (!/^[0-9]+.?[0-9]*$/.test(_d['signValue']) || _d['signValue'] > 42 || _d['signValue'] < 34) {
            let t = sheetData['tiwen'].splice(i, 1)
            sheetData.eventData.push(...t)
            i--
          }
        }
      }

      // 心率大于180小于20作为事件处理
      if (sheetData['xinlv']) {
        for (let i = 0; i < sheetData['xinlv'].length; i++) {
          let _d = sheetData['xinlv'][i]
          if (!_d['signValue']) {
            continue
          }
          if (_d['signValue'] > 180 || _d['signValue'] < 20) {
            let t = sheetData['xinlv'].splice(i, 1)
            sheetData.eventData.push(...t)
            i--
          }
        }
      }

      // 脉搏大于180小于20作为事件处理
      if (sheetData['maibo']) {
        for (let i = 0; i < sheetData['maibo'].length; i++) {
          let _d = sheetData['maibo'][i]
          if (!_d['signValue']) {
            continue
          }
          if (_d['signValue'] > 180 || _d['signValue'] < 20) {
            let t = sheetData['maibo'].splice(i, 1)
            sheetData.eventData.push(...t)
            i--
          }
        }
      }

      // 疼痛大于10小于0作为事件处理
      if (sheetData['tengtongdengji']) {
        for (let i = 0; i < sheetData['tengtongdengji'].length; i++) {
          let _d = sheetData['tengtongdengji'][i]
          if (!_d['signValue']) {
            continue
          }
          if (_d['signValue'] > 10 || _d['signValue'] < 0) {
            let t = sheetData['tengtongdengji'].splice(i, 1)
            sheetData.eventData.push(...t)
            i--
          }
        }
      }

      this.pointLineData = sheetData

      // 处理体温单底部表格要显示的数据
      let showItems = []
      let huxiCache = { data: [] } // 呼吸
      let shousuoyaCache = { data: [] } // 收缩压
      let shuzhangyaCache = { data: [] } // 舒张压
      let xueyaCache = [] // 血压
      for (let i = 0; i < this.signItem.length; i++) {
        let _d = this.signItem[i]
        let data = sheetData[_d['signItemFieldName']] || []

        // 始终显示(1) || 有内容显示(2) && 存储方式不能为空 && 存储方式不为空的
        if (
          (_d['isShow'] === 1 || (_d['isShow'] === 2 && data.length > 0 && !this.isEmpty(data))) &&
          (!_d['signStorageType'] || _d['signStorageType'] !== '')
        ) {
          _d['colspan'] = 1 // 单元格跨列
          _d['length'] = 28 // 单元格个数

          // 存储方式 0按天 1按半天 2按时间点
          if (_d['signStorageType'] === 1) {
            _d['colspan'] = 2
            _d['length'] = 14
          } else if (_d['signStorageType'] === 0) {
            _d['colspan'] = 4
            _d['length'] = 7
          }
          _d['data'] = this.parseLineData(_d, data)
          showItems.push(_d)
        }
        // 呼吸
        if (_d['signItemFieldName'] === 'huxi') {
          _d['colspan'] = 1
          _d['length'] = 28
          _d['data'] = this.parseLineData(_d, data)
          huxiCache = _d
        }
        // 收缩压
        if (_d['signItemFieldName'] === 'shousuoya') {
          _d['data'] = this.parseLineData(_d, data)
          shousuoyaCache = _d
        }
        // 舒张压
        if (_d['signItemFieldName'] === 'shuzhangya') {
          _d['data'] = this.parseLineData(_d, data)
          shuzhangyaCache = _d
        }
      }
      // 合并收缩压|舒张压
      for (let i = 0; i < shousuoyaCache.data.length; i++) {
        let ssy = shousuoyaCache.data[i] ? shousuoyaCache.data[i].signValue : ''
        let szy = shuzhangyaCache.data[i] ? shuzhangyaCache.data[i].signValue : ''
        let type = shuzhangyaCache.data[i].itemValueType === '下肢' ? '(下)' : ''
        xueyaCache.push({ signValue: ssy + (ssy ? '/' : '') + szy + type, itemValueType: shuzhangyaCache.data[i].itemValueType })
      }
      // 必须设置半天存储
      showItems.unshift({
        signId: '89898998989898989898',
        signItemUnit: 'mmHg',
        newSignItemShowName: '血压',
        data: xueyaCache,
        colspan: 2,
        length: 14,
        signItemFieldName: 'xueya'
      })
      showItems.unshift(huxiCache)
      this.showSignItem = showItems

      // 开始处理点线重合点
      this.parseRePoint(this.pointLineData, this.curWeekDate[0])
      // 开始处理事件
      this.parseEvent(this.pointLineData ? this.pointLineData.eventData : [], this.curWeekDate[0])
    },
    parseRePoint (pointData, beginDate) {
      let _this = this
      let height = _this.td.height
      let mb = pointData.maibo || [] // 脉搏
      let xl = pointData.xinlv || [] // 心率
      let wd = pointData.tiwen || [] // 温度
      let tt = pointData.tengtongdengji || [] // 疼痛
      let events = pointData.eventData || [] // 事件

      // 绘制点、折线、脉搏短促
      let pointArray = []

      // 统计拒测/外出/不升事件
      let tiwenLeaveEvents = [] // 缓存
      let xinlvLeaveEvents = [] // 缓存
      let maiboLeaveEvents = [] // 缓存
      let ttLeaveEvents = [] // 缓存
      for (let i = 0; i < events.length; i++) {
        let value = events[i].signValue

        let dataTime = events[i].recordDate.split(' ')[0] + ' ' + (events[i].itemHour || this.parseEventHour(events[i].recordDate)) + ':00'

        if (events[i].itemCode === 'tiwen' && (value === '拒测' || value === '外出' || value === '不升' || value > 42 || value < 34)) {
          tiwenLeaveEvents.push(dataTime)
        }
        if (events[i].itemCode === 'xinlv' && (value > 180 || value < 20)) {
          xinlvLeaveEvents.push(dataTime)
        }
        if (events[i].itemCode === 'maibo' && (value > 180 || value < 20)) {
          maiboLeaveEvents.push(dataTime)
        }
        if (events[i].itemCode === 'tengtongdengji' && (value > 10 || value < 0)) {
          ttLeaveEvents.push(dataTime)
        }
      }

      // 根据事件分组
      let xlGroup = this.splitGroup(xinlvLeaveEvents, xl)
      let wdGroup = this.splitGroup(tiwenLeaveEvents, wd)
      let mbGroup = this.splitGroup(maiboLeaveEvents, mb)
      let ttGroup = this.splitGroup(ttLeaveEvents, tt)

      // return false

      // 体温-换算坐标
      let wdPoints = []
      for (let i = 0; i < wdGroup.length; i++) {
        let wdArray = wdGroup[i]
        wdPoints[i] = []
        for (let j = 0; j < wdArray.length; j++) {
          if (!wdArray[j].signValue) continue
          let xy = this.getXY(wdArray[j], beginDate, 'wd')
          wdPoints[i].push(xy)
        }
      }

      // 心率-换算坐标
      let xlPoints = []
      for (let i = 0; i < xlGroup.length; i++) {
        let xlArray = xlGroup[i]
        xlPoints[i] = []
        for (let j = 0; j < xlArray.length; j++) {
          if (!xlArray[j].signValue) continue
          let xy = this.getXY(xlArray[j], beginDate, 'xl')
          xlPoints[i].push(xy)
        }
      }

      // 脉搏-换算坐标
      let mbPoints = []
      for (let i = 0; i < mbGroup.length; i++) {
        let mbArray = mbGroup[i]
        mbPoints[i] = []
        for (let j = 0; j < mbArray.length; j++) {
          if (!mbArray[j].signValue) continue
          let xy = this.getXY(mbArray[j], beginDate, 'mb')
          mbPoints[i].push(xy)
        }
      }

      // 疼痛-换算坐标
      let ttPoints = []
      for (let i = 0; i < ttGroup.length; i++) {
        let ttArray = ttGroup[i]
        ttPoints[i] = []
        for (let j = 0; j < ttArray.length; j++) {
          if (!ttArray[j].signValue) continue
          let xy = this.getXY(ttArray[j], beginDate, 'tt')
          ttPoints[i].push(xy)
        }
      }

      // 绘制[复测温度]
      let wdMax = 30
      for (let i = 0; i < wdPoints.length; i++) {
        let wdPoint = wdPoints[i] // 组
        for (let j = 0; j < wdPoint.length; j++) {
          let value = wdPoint[j].value // 温度
          let phValue = wdPoint[j].point.phValue // 复测
          let yPx = wdPoint[j].y
          let xPx = wdPoint[j].x
          // 如果存在复测温度
          if (phValue) {
            if (value > 42) {
              yPx = wdMax
            }
            // 获取复测温度的坐标
            let futwY = this.getXY(wdPoint[j].point, beginDate, 'wd', true).y
            // 线
            _this.fctwLine.push('M' + xPx + ' ' + yPx + ' ' + xPx + ' ' + futwY)
            // 点
            if (value !== phValue) {
              _this.fctwPoint.push({ x: xPx, y: futwY, title: '复测体温:' + phValue + '°C' })
            }
          }
        }
      }
      // 绘制[复测疼痛]
      for (let i = 0; i < ttPoints.length; i++) {
        let ttPoint = ttPoints[i]
        for (let j = 0; j < ttPoint.length; j++) {
          let value = ttPoint[j].value // 疼痛
          let phValue = ttPoint[j].point.phValue // 复测疼痛
          let yPx = ttPoint[j].y
          let xPx = ttPoint[j].x
          // 如果存在复测疼痛
          if (phValue) {
            if (value > 10) {
              yPx = 14
            }
            // 获取复测疼痛的坐标
            let wljwY = this.getXY(ttPoint[j].point, beginDate, 'tt', true).y
            _this.fcttLine.push('M' + xPx + ' ' + yPx + ' ' + xPx + ' ' + wljwY)
            // 绘制复测疼痛的点
            if (value !== phValue) {
              _this.fcttPoint.push({ x: xPx, y: wljwY, title: '复测疼痛:' + phValue })
            }
          }
        }
      }

      // 整合数据 用于绘制折线图
      let coor = []
      // 体温根据事件分组，点和线分开处理
      let _wdPoints = [[]]
      for (let v = 0; v < wdPoints.length; v++) {
        _wdPoints[0].push(...wdPoints[v])
      }
      // 体温-点
      for (let i = 0; i < _wdPoints.length; i++) {
        let wdPoint = _wdPoints[i]
        coor[0] = {} // 温度的由于会有拒测、外出、不升等情况，这里都在合并到一个数组
        for (let j = 0; j < wdPoint.length; j++) {
          let x = wdPoint[j].x
          let y = wdPoint[j].y
          coor[0][x] = coor[0][x] || {}
          coor[0][x]['wd'] = wdPoint[j]

          // 复测体温单独处理
          if (wdPoint[j].point.phValue) {
            let wljwY = this.getXY(wdPoint[j].point, beginDate, 'wd', true).y
            coor[0][x]['fcwd'] = {
              x: x,
              y: wljwY,
              value: wdPoint[j].point.phValue,
              type: wdPoint[j].type,
              point: wdPoint[j].point
            }
          }
        }
      }
      // 体温-线
      for (let i = 0; i < wdPoints.length; i++) {
        let wdPoint = wdPoints[i]
        // 定义折线path
        let wdPath = ''
        for (let j = 0; j < wdPoint.length; j++) {
          let x = wdPoint[j].x
          let y = wdPoint[j].y
          if (wdPath === '') {
            wdPath += 'M' + x + ',' + y
          } else {
            wdPath += 'L' + x + ',' + y
          }
        }
        _this.brokenLine.push({ stroke: 'blue', d: wdPath })
      }

      // 心率根据事件分组 点和线分开处理
      let _xlPoints = [[]]
      for (let v = 0; v < xlPoints.length; v++) {
        _xlPoints[0].push(...xlPoints[v])
      }
      // 心率-点
      for (let i = 0; i < _xlPoints.length; i++) {
        let xlPoint = _xlPoints[i]
        // coor[0] = {}; // 心率大于180情况，这里都在合并到一个数组
        for (let j = 0; j < xlPoint.length; j++) {
          let x = xlPoint[j].x
          let y = xlPoint[j].y
          coor[0][x] = coor[0][x] || {}
          coor[0][x]['xl'] = xlPoint[j]
        }
      }
      // 心率-线
      for (let i = 0; i < xlPoints.length; i++) {
        let xlPoint = xlPoints[i]
        // 定义折线path
        let xlPath = ''
        for (let j = 0; j < xlPoint.length; j++) {
          let x = xlPoint[j].x
          let y = xlPoint[j].y
          if (xlPath === '') {
            xlPath += 'M' + x + ',' + y
          } else {
            xlPath += 'L' + x + ',' + y
          }
        }
        _this.brokenLine.push({ stroke: 'red', d: xlPath })
      }

      // 脉搏根据事件分组 点和线分开处理
      let _mbPoints = [[]]
      for (let v = 0; v < mbPoints.length; v++) {
        _mbPoints[0].push(...mbPoints[v])
      }
      // 脉搏-点
      for (let i = 0; i < _mbPoints.length; i++) {
        let mbPoint = _mbPoints[i]
        for (let j = 0; j < mbPoint.length; j++) {
          let x = mbPoint[j].x
          let y = mbPoint[j].y
          coor[0][x] = coor[0][x] || {}
          coor[0][x]['mb'] = mbPoint[j]
        }
      }
      // 脉搏-线
      for (let i = 0; i < mbPoints.length; i++) {
        let mbPoint = mbPoints[i]
        // 定义折线path
        let mbPath = ''
        for (let j = 0; j < mbPoint.length; j++) {
          let x = mbPoint[j].x
          let y = mbPoint[j].y
          if (mbPath === '') {
            mbPath += 'M' + x + ',' + y
          } else {
            mbPath += 'L' + x + ',' + y
          }
        }
        _this.brokenLine.push({ stroke: 'red', d: mbPath })
      }

      // 疼痛根据事件分组 点和线分开处理
      let _ttPoints = [[]]
      for (let v = 0; v < ttPoints.length; v++) {
        _ttPoints[0].push(...ttPoints[v])
      }
      // 疼痛-点
      for (let i = 0; i < _ttPoints.length; i++) {
        let ttPoint = _ttPoints[i]
        for (let j = 0; j < ttPoint.length; j++) {
          let x = ttPoint[j].x
          let y = ttPoint[j].y
          coor[0][x] = coor[0][x] || {}
          coor[0][x]['tt'] = ttPoint[j]
        }
      }
      // 疼痛-线
      for (let i = 0; i < ttPoints.length; i++) {
        let ttPoint = ttPoints[i]
        // 定义折线path
        let ttPath = ''
        for (let j = 0; j < ttPoint.length; j++) {
          let x = ttPoint[j].x
          let y = ttPoint[j].y
          if (ttPath === '') {
            ttPath += 'M' + x + ',' + y
          } else {
            ttPath += 'L' + x + ',' + y
          }
        }
        _this.brokenLine.push({ stroke: 'blue', d: ttPath })
      }

      console.log('coor - ', coor)

      // 判断点是否重合
      for (let i = 0; i < coor.length; i++) {
        let json = coor[i]
        for (let j in json) {
          if (!json[j].mb) {
            json[j].mb = {}
          }
          if (!json[j].xl) {
            json[j].xl = {}
          }
          if (!json[j].wd) {
            json[j].wd = {}
          }
          if (!json[j].tt) {
            json[j].tt = {}
          }
          // 复测体温
          if (!json[j].fcwd) {
            json[j].fcwd = {}
          }

          let mbY = json[j].mb.y
          let xlY = json[j].xl.y
          let wdY = json[j].wd.y
          let fcwdY = json[j].fcwd.y // 复测温度
          let ttY = json[j].tt.y

          let yw = json[j].wd.type === '腋温' // 腋温
          let kw = json[j].wd.type === '口温' // 口温
          let gw = json[j].wd.type === '肛温' // 肛温

          let fcyw = json[j].fcwd.type === '腋温' // 腋温
          let fckw = json[j].fcwd.type === '口温' // 口温
          let fcgw = json[j].fcwd.type === '肛温' // 肛温

          // 判断是否重合
          let ismbxlwd = mbY && xlY && wdY // 脉搏+心率+温度点都存在
          let ismbxl = mbY && xlY // 脉搏+心率点都存在
          let ismbwd = mbY && wdY // 脉搏+温度点都存在
          let isxlwd = xlY && wdY // 心率+温度点都存在

          let ismbxlfcwd = mbY && xlY && fcwdY // 脉搏+心率+温度点都存在
          let ismbfcwd = mbY && fcwdY // 脉搏+温度点都存在
          let isxlfcwd = xlY && fcwdY // 心率+温度点都存在

          let istt = ttY
          let iswd = wdY

          if (ismbxlwd && mbY === xlY && xlY === wdY && gw) { // 脉搏+心率+肛温[红圆+红圈+蓝圈]:两个圈在外围（红圈在最外层表示心率，篮圈在里层表示肛温）、一个圆在中间（红圆表示脉搏）
            let title = '脉搏:' + json[j].xl.value + '次，心率:' + json[j].xl.value + '次,肛温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: '肛温', 'x': j, 'y': xlY, r: 7, stroke: 'blue', title, fill: '#fff' })
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 3, stroke: 'red', title, fill: 'red' })
          } else if (ismbxlwd && mbY === xlY && xlY === wdY && yw) { // 脉搏+心率+腋温[红圆+红圈+蓝叉]:红圈在外围（表示心率）、红圆在中间（表示脉搏）、蓝叉在中间红圆之上（表示腋温）
            let title = '脉搏:' + json[j].xl.value + '次，心率:' + json[j].xl.value + '次,腋温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: 'red' })
            _this.intersectPoint.push({ type: '腋温', 'x': j, 'y': xlY, halfSize: 4, stroke: 'blue', title })
          } else if (ismbxlwd && mbY === xlY && xlY === wdY && kw) { // 脉搏+心率+口温[红圆+红圈+蓝圆]:红圈在外围（表示心率）、红圆在中间（表示脉搏）、蓝圆在中间红圆之上（表示口温）
            let title = '脉搏:' + json[j].xl.value + '次，心率:' + json[j].xl.value + '次,口温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: 'red' })
            _this.coincidePoint.push({ type: '口温', 'x': j, 'y': xlY, r: 3, stroke: 'blue', title, fill: 'blue' })
          } else if (isxlwd && xlY === wdY && gw) { // 心率+肛温[红圈+蓝圈]
            let title = '心率:' + json[j].xl.value + '次，肛温:' + json[j].wd.value + '°C'
            if (xlY && wdY) {
              _this.coincidePoint.push({ type: '肛温', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 3, stroke: 'blue', title, fill: '#fff' })
            }
            mbY && _this.coincidePoint.push({
              type: 'mb',
              'x': j,
              'y': mbY,
              r: 4,
              stroke: 'red',
              title: '脉搏:' + json[j].mb.value + '次',
              fill: 'red'
            })// 脉搏
          } else if (isxlwd && xlY === wdY && yw) { // 心率+腋温[红圈+蓝叉]]
            let title = '心率:' + json[j].xl.value + '次，腋温:' + json[j].wd.value + '°C'
            if (xlY && wdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.intersectPoint.push({ type: '腋温', 'x': j, 'y': xlY, halfSize: 4, stroke: 'blue', title })
            }
            mbY && _this.coincidePoint.push({
              type: 'mb',
              'x': j,
              'y': mbY,
              r: 4,
              stroke: 'red',
              title: '脉搏:' + json[j].mb.value + '次',
              fill: 'red'
            })// 脉搏
          } else if (isxlwd && xlY === wdY && kw) { // 心率+口温[红圈+蓝圆]
            let title = '心率:' + json[j].xl.value + '次，口温:' + json[j].wd.value + '°C'
            if (xlY && wdY) {
              _this.coincidePoint.push({ type: 'xl', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.coincidePoint.push({ type: '口温', 'x': j, 'y': xlY, r: 3, stroke: 'blue', title, fill: 'blue' })
            }
            mbY && _this.coincidePoint.push({
              type: 'mb',
              'x': j,
              'y': mbY,
              r: 4,
              stroke: 'red',
              title: '脉搏:' + json[j].mb.value + '次',
              fill: 'red'
            })// 脉搏
          } else if (ismbwd && mbY === wdY && gw) { // 脉搏+肛温[红圆+蓝圈]
            let title = '脉搏:' + json[j].mb.value + '次，肛温:' + json[j].wd.value + '°C'
            if (mbY && wdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'blue', title, fill: '#fff' })
              _this.coincidePoint.push({ type: '肛温', 'x': j, 'y': mbY, r: 3, stroke: 'red', title, fill: 'red' })
            }
            xlY && _this.coincidePoint.push({
              type: 'xl',
              'x': j,
              'y': xlY,
              r: 4,
              stroke: 'red',
              title: '心率:' + json[j].xl.value + '次',
              fill: '#fff'
            })// 心率
          } else if (ismbwd && mbY === wdY && yw) { // 脉搏+腋温[红圆+蓝叉]
            let title = '脉搏:' + json[j].mb.value + '次，腋温:' + json[j].wd.value + '°C'
            if (mbY && wdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.intersectPoint.push({ type: '腋温', 'x': j, 'y': mbY, halfSize: 4, stroke: 'blue', title })
            }
            xlY && _this.coincidePoint.push({
              type: 'xl',
              'x': j,
              'y': xlY,
              r: 4,
              stroke: 'red',
              title: '心率:' + json[j].xl.value + '次',
              fill: '#fff'
            })// 心率
          } else if (ismbwd && mbY === wdY && kw) { // 脉搏+口温[红圆+蓝圆]
            let title = '脉搏:' + json[j].mb.value + '次，口温:' + json[j].wd.value + '°C'
            if (mbY && wdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.coincidePoint.push({ type: '口温', 'x': j, 'y': mbY, r: 3, stroke: 'blue', title, fill: 'blue' })
            }
            xlY && _this.coincidePoint.push({
              type: 'xl',
              'x': j,
              'y': xlY,
              r: 4,
              stroke: 'red',
              title: '心率:' + json[j].xl.value + '次',
              fill: '#fff'
            })// 心率
          } else if (ismbxl && mbY === xlY) { // 脉搏+心率[红圆]
            let title = '脉搏:' + json[j].mb.value + '次，心率' + json[j].mb.value + '次'
            mbY && xlY && _this.coincidePoint.push({
              type: 'mb',
              'x': j,
              'y': mbY,
              r: 4,
              stroke: 'red',
              title,
              fill: 'red'
            })
            drawWd(json[j], j, wdY, 1)
          } else { // 其他补充和的点-正常绘制
            xlY && _this.coincidePoint.push({
              type: 'xl',
              'x': j,
              'y': xlY,
              r: 4,
              stroke: 'red',
              title: '心率:' + json[j].xl.value + '次',
              fill: '#fff'
            })// 心率
            mbY && _this.coincidePoint.push({
              type: 'mb',
              'x': j,
              'y': mbY,
              r: 4,
              stroke: 'red',
              title: '脉搏:' + json[j].mb.value + '次',
              fill: 'red'
            })// 脉搏
            wdY && drawWd(json[j], j, wdY, 2)
          }

          // 复测体温
          if (ismbwd && mbY === fcwdY && fcgw) { // 脉搏+复测肛温[红圆+蓝圈]
            let title = '脉搏:' + json[j].mb.value + '次，复测肛温:' + json[j].wd.value + '°C'
            if (mbY && fcwdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'blue', title, fill: '#fff' })
              _this.coincidePoint.push({ type: '肛温', 'x': j, 'y': mbY, r: 3, stroke: 'red', title, fill: 'red' })
            }
          } else if (ismbwd && mbY === fcwdY && fcyw) { // 脉搏+复测腋温[红圆+蓝叉]
            let title = '脉搏:' + json[j].mb.value + '次，复测腋温:' + json[j].fcwd.value + '°C'
            if (mbY && fcwdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.intersectPoint.push({ type: 'yw', 'x': j, 'y': mbY, halfSize: 4, stroke: 'blue', title })
            }
          } else if (ismbfcwd && mbY === fcwdY && fckw) { // 脉搏+复测口温[红圆+蓝圆]
            let title = '脉搏:' + json[j].mb.value + '次，复测口温:' + json[j].fcwd.value + '°C'
            if (mbY && fcwdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.coincidePoint.push({ type: '口温', 'x': j, 'y': mbY, r: 3, stroke: 'blue', title, fill: 'blue' })
            }
          } else if (isxlfcwd && xlY === fcwdY && fcgw) { // 心率+肛温[红圈+蓝圈]
            let title = '心率:' + json[j].xl.value + '次，复测肛温:' + json[j].fcwd.value + '°C'
            if (xlY && fcwdY) {
              _this.coincidePoint.push({ type: '肛温', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 3, stroke: 'blue', title, fill: '#fff' })
            }
          } else if (isxlfcwd && xlY === fcwdY && fcyw) { // 心率+复测腋温[红圈+蓝叉]]
            let title = '心率:' + json[j].xl.value + '次，复测腋温:' + json[j].fcwd.value + '°C'
            if (xlY && fcwdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.intersectPoint.push({ type: '腋温', 'x': j, 'y': xlY, halfSize: 4, stroke: 'blue', title })
            }
          } else if (isxlfcwd && xlY === fcwdY && fckw) { // 心率+口温[红圈+蓝圆]
            let title = '心率:' + json[j].xl.value + '次，复测口温:' + json[j].fcwd.value + '°C'
            if (xlY && fcwdY) {
              _this.coincidePoint.push({ type: 'xl', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.coincidePoint.push({ type: '口温', 'x': j, 'y': xlY, r: 3, stroke: 'blue', title, fill: 'blue' })
            }
          }

          // 绘制温度
          // noinspection JSAnnotator
          function drawWd (point, j, wdY, t) {
            // 此处无效注释掉，温度大于42的不再绘制
            if (wdY < wdMax) {
              // 绘制向上的箭头
              // let x = j
              // let y1 = wdMax
              // let y2 = wdMax - 5 * height + 3
              // _this.arrowhead.push({ x1: x, y1: y1, x2: x, y2: y2, color: 'blue', title: '' })
            } else {
              if (point.wd.type === '腋温') {
                _this.intersectPoint.push({
                  type: '腋温',
                  'x': j,
                  'y': wdY,
                  halfSize: 4,
                  stroke: 'blue',
                  title: '腋温:' + point.wd.value + '°C'
                })// 温度
              } else if (point.wd.type === '肛温') {
                _this.coincidePoint.push({
                  type: '肛温',
                  'x': j,
                  'y': wdY,
                  r: 4,
                  stroke: 'blue',
                  title: '肛温:' + point.wd.value + '°C',
                  fill: '#fff'
                })
              } else if (point.wd.type === '口温') {
                _this.coincidePoint.push({
                  type: '口温',
                  'x': j,
                  'y': wdY,
                  r: 4,
                  stroke: 'blue',
                  title: '口温:' + point.wd.value + '°C',
                  fill: 'blue'
                })
              }
            }
          }

          // 绘制疼痛，疼痛是单独的，不与其他尤其那和
          let title = '疼痛:' + json[j].tt.value
          istt && _this.ttPoint.push({ type: 'tt', x: j, y: ttY, r: 4, stroke: 'blue', title, fill: 'blue' })
        }
      }
      // 根据心率和脉搏点，绘制多边形（脉搏短促）
      // 1.统计出现的多边形
      let polygonArray = this.getPolygon(mbPoints, _xlPoints)
      // 2.绘制多边形
      for (let i = 0; i < polygonArray.length; i++) {
        let polygon = polygonArray[i]
        pointArray.push(this.parseBlueLine(polygon))
      }
    },
    parseBlueLine (polygonArray) {
      let _this = this
      let polygonLine = this.parsePolygon(polygonArray, 'red').linear
      let htmlDe = this.parsePolygon(polygonArray, 'red', 'polygon').html
      let point = this.parsePolygon(polygonArray, 'red').point
      let totalPoints = []
      let blueLineFuncs = this.getBlueLineFuncs()
      for (let i = 0; i < blueLineFuncs.length; i++) {
        let pointArray = []
        for (let j = 0; j < polygonLine.length; j++) {
          let pointNow = point[j]
          let maxX = this.getDoundary(pointNow).maxX
          let minX = this.getDoundary(pointNow).minX
          let maxY = this.getDoundary(pointNow).maxY
          let minY = this.getDoundary(pointNow).minY
          // 一条边与斜线的交点
          // 计算交点
          let line1 = blueLineFuncs[i]
          let line2 = polygonLine[j]
          let points = this.segmentsIntr(line1, line2)
          // 判断交点是否在线段上，即在多边形内
          if (points.x >= minX && points.x <= maxX && points.y >= minY && points.y <= maxY) {
            pointArray.push(points)
          }
        }
        if (pointArray.length) {
          totalPoints.push(pointArray)
        }
      }
      for (let j = 0; j < totalPoints.length; j++) {
        let points = totalPoints[j]
        if (points.length === 2) {
          _this.mbdcLinePolygon.line.push({
            x1: points[0].x,
            y1: points[0].y,
            x2: points[1].x,
            y2: points[1].y,
            stroke: 'blue',
            strokeWidth: 1
          })
        } else if (points.length > 2 && points.length % 2 === 0) {
          // 根据x值大小排序（升序）冒泡排序
          for (let i = 0; i < points.length - 1; i++) { // 取数组中任意两点匹配
            for (let k = 0; k < points.length - 1 - i; k++) {
              let pointX = points[k].x
              let nextPointX = points[k + 1].x
              if (pointX > nextPointX) {
                let temp = points[k]
                points[k] = points[k + 1]
                points[k + 1] = temp
              }
            }
          }
          // 相邻两点生成一条线段
          for (let i = 0; i < points.length; i = i + 2) {
            _this.mbdcLinePolygon.line.push({
              x1: points[i].x,
              y1: points[i].y,
              x2: points[i + 1].x,
              y2: points[i + 1].y,
              stroke: 'blue',
              strokeWidth: 2
            })
          }
        }
      }
      _this.mbdcLinePolygon.polygon.push(htmlDe)
    },
    parsePolygon (points, color) {
      if (points.length === 0) {
        return ''
      }
      color = color || '#000'
      let polygonLinear = []
      let pointStr
      let pointStrArray = []
      let point = []
      for (let i = 0; i < points.length; i++) {
        pointStr = points[i].x + ',' + points[i].y
        // 根据两点求方程
        if (points[i + 1] !== undefined) {
          let linear = this.lineX(points[i], points[i + 1])
          polygonLinear.push(linear)
          point.push([points[i], points[i + 1]])
        }
        pointStrArray.push(pointStr)
      }
      pointStr = pointStrArray.join(' ')
      let polygonHtml = { points: pointStr, stroke: color }
      return {
        'html': polygonHtml,
        'linear': polygonLinear,
        'point': point
      }
    },
    parseEvent (evenArray, beginDate) {
      if (evenArray === undefined || evenArray.length === 0) {
        return
      }
      let _this = this
      let tdW = _this.td.width // 获取td的宽度
      let daysW = _this.td.width * 4 // 一天的显示的宽度
      let chinese = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      let height = _this.td.height
      // 按时间分组，显示在同一时间段
      let timeArray = {}
      let otherArray = []
      let evensXpx = {}
      for (let i = 0; i < evenArray.length; i++) {
        let value = evenArray[i].signValue
        evenArray[i].itemHour = evenArray[i].itemHour || this.parseEventHour(evenArray[i].recordDate)
        let dataTime = evenArray[i].recordDate.split(' ')[0] + ' ' + (evenArray[i].itemHour || this.parseEventHour(evenArray[i].recordDate)) + ':00'

        evensXpx[dataTime] = this.getDateDiff(beginDate, evenArray[i].recordDate.split(' ')[0]) * daysW + tdW * this.getHourIndex(evenArray[i].itemHour) - tdW / 2

        if (value !== '开呼吸机' && value !== '关呼吸机' && value !== '不升' && isNaN(value)) {
          if (timeArray[dataTime] === undefined) {
            timeArray[dataTime] = []
            timeArray[dataTime].push(evenArray[i])
          } else {
            timeArray[dataTime].push(evenArray[i])
          }
        } else {
          otherArray.push(evenArray[i])
        }
      }
      // 生成HTML
      let showArray = []
      let xPxArray = []
      for (let time in timeArray) {
        let evens = timeArray[time]
        let xPx = evensXpx[time] - 5.5
        let show = ''
        let k = 0
        for (let j = 0; j < evens.length; j++) {
          let curEven = evens[j]
          let value = curEven.signValue
          let hour = parseInt(moment(curEven.recordDate).format('HH'))
          let minute = parseInt(moment(curEven.recordDate).format('mm'))
          let hourStr = hour.toString()
          let minuteStr = minute.toString()
          let finalValue = ''
          let isLeave = value === '请假'
          // 拒测和外出 只显示实际值 不显示日期
          if (value !== '外出' && value !== '拒测') {
            if (minute > 0) {
              finalValue = value + (isLeave ? '' : '||' + this.numToChinese(hourStr, chinese) + '时' + this.numToChinese(minuteStr, chinese) + '分')
            } else {
              finalValue = value + (isLeave ? '' : '||' + this.numToChinese(hourStr, chinese) + '时整')
            }
          } else {
            finalValue = value
          }
          if (k === 0) {
            show += finalValue
          } else {
            show += ' ' + finalValue
          }
          k++
        }
        showArray.push(show)
        xPxArray.push(xPx)
      }
      // 绘制事件
      for (let i = 0; i < showArray.length; i++) {
        // 绘制path
        let xPx = xPxArray[i]
        let textArray = showArray[i].split('')
        let svgText = []
        for (let i = 0; i < textArray.length; i++) {
          svgText.push({
            x: textArray[i] === '|' ? (xPx + 4) : xPx,
            y: 12 + i * height,
            fill: 'red',
            text: textArray[i]
          })
        }
        _this.eventText.push(svgText)
      }
      // 绘制其他事件
      for (let i = 0; i < otherArray.length; i++) {
        let value = otherArray[i].signValue
        let xPx = this.getDateDiff(beginDate, otherArray[i].recordDate.split(' ')[0]) * daysW + tdW * this.getHourIndex(otherArray[i].itemHour) - tdW / 2
        // 心率
        if (+value > 180) {
          let textArray = ['过', '快']
          for (let j = 0; j < textArray.length; j++) {
            _this.eventText.push({ x: xPx - 5.5, y: 3 * 14 + j * 14 - 2, fill: '#000', text: textArray[j] })
          }
        } else if (value === '不升') { // 体温-不升
          let valueArray = value.split('')
          // 显示在35度下面
          let cy = 37 * height
          for (let k = 0; k < valueArray.length; k++) {
            _this.eventText.push({ x: xPx - 5.5, y: cy + height * k + 12, fill: 'red', text: valueArray[k] })
          }
        } else if (value === '拒测' || value === '外出') { // 体温-拒测、外出
          let valueArray = value.split('')
          // 显示在35度下面
          for (let k = 0; k < valueArray.length; k++) {
            _this.eventText.push({ x: xPx - 5.5, y: 3 * 14 + k * 14 - 2, fill: '#000', text: valueArray[k] })
          }
        }
      }
    },
    // 计算事件时间所在的时间点【重点，测量时间每个之间必须是相差4】
    parseEventHour (datetime) {
      let date = datetime.split(' ')[0]
      for (let i = 0; i < this.hours.length; i++) {
        let _d = this.hours[i]
        let h = _d.measuringTime
        let dateHour = date + ' ' + (h > 9 ? h : '0' + h) + ':00:00'
        let b = ''
        let e = ''
        let pOffset = 0 // 上个偏移
        let nOffset = 0 // 下个偏移
        if (i === 0) {
          let nh = this.hours[i + 1] ? this.hours[i + 1].measuringTime : 0
          nOffset = ((nh - h) / 2).toFixed(1)

          b = date + ' 00:00:00'
          e = moment(dateHour).add(nOffset, 'hour').format('YYYY-MM-DD HH:mm') + ':00'
        } else if (i === this.hours.length - 1) {
          let ph = this.hours[i - 1] ? this.hours[i - 1].measuringTime : 0
          pOffset = ((h - ph) / 2).toFixed(1)

          b = moment(dateHour).add(-pOffset, 'hour').format('YYYY-MM-DD HH:mm') + ':01'
          e = date + ' 23:59:59'
        } else {
          let ph = this.hours[i - 1] ? this.hours[i - 1].measuringTime : 0
          pOffset = ((h - ph) / 2).toFixed(1)
          let nh = this.hours[i + 1] ? this.hours[i + 1].measuringTime : 0
          nOffset = ((nh - h) / 2).toFixed(1)

          b = moment(dateHour).add(-pOffset, 'hour').format('YYYY-MM-DD HH:mm') + ':01'
          e = moment(dateHour).add(nOffset, 'hour').format('YYYY-MM-DD HH:mm') + ':00'
        }

        if (datetime === b || datetime === e || moment(datetime).isBetween(b, e)) {
          return h
        }
      }
    },
    // 处理体温单底部每一行的数据
    parseLineData (item, data) {
      let d = []
      for (let i = 0; i < this.curWeekDate.length; i++) {
        let date = this.curWeekDate[i] // 日期
        // 时间点
        if (item.signStorageType === 2) {
          for (let x = 0; x < this.hours.length; x++) {
            let h = this.hours[x]
            let value = ''
            for (let j = 0; j < data.length; j++) {
              let recordDate = data[j]['recordDate'].split(' ')[0]
              let recordHour = data[j]['itemHour']
              if (date === recordDate && h.measuringTime === +recordHour) {
                value = data[j]
              }
            }
            d.push(value)
          }
        }
        // 半天
        if (item.signStorageType === 1) {
          // 上午
          let value1 = ''
          for (let j = 0; j < data.length; j++) {
            let recordDate = data[j]['recordDate'].split(' ')[0]
            let recordType = data[j]['itemType'] // 1上午 2下午
            if (date === recordDate && +recordType === 1) {
              value1 = data[j]
            }
          }
          d.push(value1)
          // 下午
          let value2 = ''
          for (let j = 0; j < data.length; j++) {
            let recordDate = data[j]['recordDate'].split(' ')[0]
            let recordType = data[j]['itemType'] // 1上午 2下午
            if (date === recordDate && +recordType === 2) {
              value2 = data[j]
            }
          }
          d.push(value2)
        }
        // 全天
        if (item.signStorageType === 0) {
          let value = ''
          for (let j = 0; j < data.length; j++) {
            let recordDate = data[j]['recordDate'].split(' ')[0]
            if (date === recordDate) {
              value = data[j]
            }
          }
          d.push(value)
        }
      }
      return d
    }
  },
  components: {
    [Tooltip.name]: Tooltip,
    formHeader
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .temperature_sheet_print_container {
    width: 100%;
    margin: 0 auto;
    display: inline-block;
    /*position: relative;*/
    color: #000;
  }

  .header {
    text-align: center;
    font-size: 12px;
    .hospital {
      font-size: 13px;
    }
    .title {
      font-size: 18px;
    }
    .patient_basic {
      height: 36px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }

  table {
    width: 750px;
  }

  .tableSvg {
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 12px;
    tr {
      td {
        border: 1px solid #BFBFBF;
        text-align: center;
        box-sizing: border-box;
        line-height: 1.5;
        &.hx {
          height: 35px;
        }
        &.tt {
          span {
            display: inline-block;
            padding: 2px;
          }
        }
        img {
          width: 14px;
        }
      }
      .text-top {
        vertical-align: top;
      }
      .text-bottom {
        vertical-align: bottom;
      }
      &.height {
        height: 14px;
        td {
          line-height: 1;
          &.borderR {
            border-right: 1px solid red;
          }
        }
      }
      &.hour {
        td {
          line-height: 1.5;
        }
      }
    }
  }

  .svg_container {
    display: inline-block;
    position: absolute;
    top: 77px;
    left: 126px;
  }

  .text_scale {
    position: relative;
    > span {
      display: inline-block;
      position: absolute;
      top: 0;
      left: -6px;
      transform: scale(.7);
    }
  }
</style>
<style>
  /* 覆盖ant tooltip样式 */
  *, ::after, ::before {
    box-sizing: initial;
  }
</style>
