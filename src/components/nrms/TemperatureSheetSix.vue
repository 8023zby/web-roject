<template>
  <!--

  -->
  <div class="temperature_sheet_print_container" id="temperature_sheet_print_container">
    <!-- 自动表头 -->
    <formHeader :autoHead="autoHead"></formHeader>

    <div>
      <div style="margin: auto; position: relative; width: 770px">
        <!-- svgIcon -->
        <svgIcon/>

        <!-- 体温单表格 -->
        <table class="tableSvg" style="width: 750px">
          <colgroup>
            <col width="59px">
            <col width="59px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
            <col width="15px">
          </colgroup>
          <tbody>
          <tr>
            <td class="every" colspan="2">{{messageConfig.date || ''}}</td>
            <td colspan="6" class="every" v-for="i in 7">{{newCurWeekDate[i - 1] || ""}}</td>
          </tr>

          <!-- 时间轴 -->
          <tr class="height hour">
            <td colspan="2">{{messageConfig.hour || ''}}</td>
            <template v-for="i in 7">
              <template v-if="hours.length === 0">
                <td class="borderB" v-for="n in 6" :class="{borderR : n === 6 && i !== 7}"></td>
              </template>
              <template v-else>
                <td class="borderB" v-for="h in hours"
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
            <td rowspan="2" class="borderRB">体温<br/>(°C)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 刻度 42 -->
          <tr class="height">
            <td rowspan="5" class="text-top">180</td>
            <td rowspan="5" class="borderRB text-top">42°</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 刻度 41 -->
          <tr class="height">
            <td rowspan="5" class="text-top">160</td>
            <td rowspan="5" class="text-top borderRB">41°</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 刻度 40 -->
          <tr class="height">
            <td rowspan="5" class="text-top">140</td>
            <td rowspan="5" class="text-top borderRB">40°</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 刻度 39 -->
          <tr class="height">
            <td rowspan="5" class="text-top">120</td>
            <td rowspan="5" class="text-top borderRB">39°</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 刻度 38 -->
          <tr class="height">
            <td rowspan="5" class="text-top">100</td>
            <td rowspan="5" class="text-top borderRB">38°</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 刻度 37 -->
          <tr class="height">
            <td rowspan="5" class="text-top">80</td>
            <td rowspan="5" class="text-top borderRB">37°</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 刻度 36 -->
          <tr class="height">
            <td rowspan="5" class="text-top">60</td>
            <td rowspan="5" class="text-top borderRB">36°</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 刻度 35 -->
          <tr class="height">
            <td rowspan="5" class="text-top">40</td>
            <td rowspan="5" class="text-top borderRB">35°</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 疼痛等级 -->
          <tr class="height">
            <td rowspan="5" class="tt">
              <span>疼</span><br/><span>痛</span><br/><span>等</span><br/><span>级</span>
            </td>
            <td rowspan="5" class="borderRB">
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
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderR"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="borderRB"></td>
          </tr>
          <tr class="height">
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderR borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderB"></td>
            <td class="borderRB borderB"></td>
          </tr>

          <!-- 循环可显示的体征项 -->
          <template v-for="item in showSignItem">
            <tr :key="item.signId">
              <td :class="{every: true, hx: item.signItemFieldName==='huxi'}" colspan="2">
                {{item.newSignItemShowName}}{{item.signItemUnit ? '('+item.signItemUnit+')' : ''}}
              </td>
              <template v-if="item.signItemFieldName==='huxi'">
                <td :class="item.data[n - 1] ? item.data[n - 1].cls : ''" v-for="n in item.length">
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

          <tr>
            <td class="every" colspan="2">{{messageConfig.hospitalDays || ''}}</td>
            <td colspan="6" class="every" v-for="i in 7">{{curWeekIn[i - 1]}}</td>
          </tr>

          <!-- 发热门诊体温单（4）要显示产后日数 -->
          <template v-if="relationType === '4'">
            <tr>
              <td class="every" colspan="2">{{messageConfig.postpartumDays || ''}}</td>
              <td colspan="6" class="every" v-for="i in 7">{{curWeekDays.chDays[i - 1]}}</td>
            </tr>

            <tr>
              <td class="every" colspan="2">{{messageConfig.operationDays || ''}}</td>
              <td colspan="6" class="every" v-for="i in 7">{{curWeekDays.ssDays[i - 1]}}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td class="every" colspan="2">{{messageConfig.operationDays || ''}}</td>
              <td colspan="6" class="every" v-for="i in 7">{{curWeekDays.allSsDays[i - 1]}}</td>
            </tr>
          </template>

          <!-- 补空行 -->
          <tr v-for="n in (10 - showSignItem.length < 0 ? 0 : 10 - showSignItem.length)">
            <td class="every" colspan="2">&nbsp;</td>
            <td colspan="6" class="every 1"></td>
            <td colspan="6" class="every"></td>
            <td colspan="6" class="every"></td>
            <td colspan="6" class="every"></td>
            <td colspan="6" class="every"></td>
            <td colspan="6" class="every"></td>
            <td colspan="6" class="every"></td>
          </tr>

          </tbody>
        </table>

        <!-- 体温单数据绘制容器 -->
        <div class="svg_container" :style="top">
          <svg :width="svgWidth + 'px'" height="710px">
            <!--复测体温，物理降温[虚线] -->
            <template v-for="(item, index) in fctwLine">
              <g style="fill: none; stroke: red; stroke-width: 1px" :key="'fctwLine-' + index" :title="item.title || '复测体温'">
                <path stroke-dasharray="3,3" :d="item"/>
              </g>
            </template>

            <!--复测疼痛 [虚线] -->
            <template v-for="(item, index) in fcttLine">
              <g style="fill: none; stroke: red; stroke-width: 1px" :key="'fcttLine-' + index" :title="item.title || '复测疼痛'">
                <path stroke-dasharray="3,3" :d="item"/>
              </g>
            </template>

            <!-- 体温，脉搏，心率，疼痛等[折线] -->
            <template v-for="(item, index) in brokenLine">
              <path :key="'brokenLine' + index" :stroke="item.stroke" stroke-width="1" fill='none' :d="item.d" :title="item.title || '折线'" />
            </template>

            <!-- 脉搏短促[线][多变形] -->
            <template v-for="(item, index) in mbdcLinePolygon.line">
              <line :key="'mbdcLinePolygon.line' + index" :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2" stroke="red" stroke-width="1" :title="item.title || '多边形'" />
            </template>
            <template v-for="(item, index) in mbdcLinePolygon.polygon">
              <polygon :key="'mbdcLinePolygon.polygon' + index" :points="item.points" fill="none" :stroke="item.stroke" stroke-width="1" :title="item.title || '多边形'"/>
            </template>

            <!-- 复测体温 物理降温[点  11] -->
            <template v-for="(item, index) in fctwPoint">
              <a-tooltip :title="item.title" :key="'fctwPoint-'+ index">
                <use xlink:href="#icon-maibo-05" width="10" height="10" :x="item.x - 5" fill='red' :y="item.y - 5"></use>
              </a-tooltip>
            </template>

            <!-- 复试温度[点] -->
            <template v-for="(item, index) in fswdPoint">
              <a-tooltip :title="item.title" :key="'fswdPoint-'+ index">
                <use xlink:href="#icon-btn_zk" width="10" height="10" :x="item.x - 5" fill='red' :y="item.y - 15"></use>
              </a-tooltip>
            </template>

            <!-- 体温，脉搏，心率，疼痛等[点   ] -->
            <template v-for="(item, index) in coincidePoint">
              <a-tooltip :title="item.title" :key="'coincidePoint-'+ index">
                <circle :cx="item.x" :cy="item.y" :r="item.r" stroke-width="1" :stroke="item.stroke" :fill='item.fill' :title="item.title || 'tw/mb/xl/tt点' "/>
              </a-tooltip>
            </template>

            <!-- 体温：腋温 [X] 耳温 [▲] -->
            <template v-for="(item, index) in intersectPoint">
              <svg :key="'intersectPoint-'+ index">
                <a-tooltip :title="item.title">
                  <use v-if="item.type === '耳温'" xlink:href="#icon-kongxinsanjiao" width="10" height="10" :x="item.x - 5" fill='blue' :y="item.y - 5"></use>
                  <use v-else xlink:href="#icon-tiwen-03" width="10" height="10" :x="item.x - 5" :fill='item.stroke' :y="item.y - 5"></use>
                </a-tooltip>
              </svg>
            </template>

            <!-- 疼痛[点] -->
            <template v-for="(item, index) in ttPoint">
              <a-tooltip :title="item.title" :key="'ttPoint-'+ index">
                <use xlink:href="#icon-tengtongdengjiP-02" width="10" height="10" :x="item.x - 5" fill='blue' :y="item.y - 5"></use>
              </a-tooltip>
            </template>

            <!-- 复测疼痛[点] -->
            <template v-for="(item, index) in fcttPoint">
              <a-tooltip :title="item.title" :key="'fcttPoint-'+ index">
                <use xlink:href="#icon-tengtongdengjiP-02" width="10" height="10" :x="item.x - 5" fill='red' :y="item.y - 5"></use>
              </a-tooltip>
            </template>

            <!-- 箭头 -->
            <template v-for="(item, index) in arrowhead">
              <svg :key="'arrowhead' + index">
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
              <svg v-if="item instanceof Array" :key="'eventText' + index">
                <text v-for="(item2, index) in item" :key="'eventTextText' + index" :x="item2.x" :y="item2.y" :fill="item2.fill" style="font-size:11px" :title="item.title || '事件'">{{item2.text}}</text>
              </svg>
              <text v-else :key="'eventTextText' + index" :x="item.x" :y="item.y" :fill="item.fill" style="font-size:11px" :title="item.title || '事件'">{{item.text}}</text>
            </template>
          </svg>
        </div>

        <!-- 体温单提示 -->
        <div class="svg-tips">
          <table>
            <tr>
              <td>
                脉<br/>搏<br/>
                <svg width="10" height="10">
                  <use xlink:href="#icon-kouwen-04" fill='red'></use>
                </svg>
              </td>
            </tr>
            <tr>
              <td>体<br/>温<br/>:</td>
            </tr>
            <tr>
              <td>
                腋<br/>温<br/>
                <svg width="10" height="10">
                  <use xlink:href="#icon-tiwen-03"  fill='blue'></use>
                </svg>
              </td>
            </tr>
            <tr>
              <td>
                口<br/>温<br/>
                <svg width="10" height="10">
                  <use xlink:href="#icon-kouwen-04" fill='blue'></use>
                </svg>
              </td>
            </tr>
            <tr>
              <td>
                肛<br/>温<br/>
                <svg width="10" height="10">
                  <use xlink:href="#icon-maibo-05" fill='blue'></use>
                </svg>
              </td>
            </tr>
            <tr>
              <td>
                耳<br/>温<br/>
                <svg width="10" height="10">
                  <use xlink:href="#icon-kongxinsanjiao" fill='blue'></use>
                </svg>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- 第几周 -->
    <div style="font-size:12px; text-align: center;">
      第{{curWeekIndex + 1}}周
    </div>
  </div>
</template>

<script>
import formHeader from '../../components/nrms/autoForm/header'
import moment from 'moment'
import { Tooltip } from 'ant-design-vue'
import temperatureMixin from './temperatureMixin'
import svgIcon from './svgIcon'
import { message as messageConfig } from '../../views/nrms/FormManage/temperatureConfig'

export default {
  name: '',
  props: ['relationType', 'formHeader', 'patient', 'sheetData', 'signItem', 'curWeekDate', 'curWeekIn', 'curWeekDays', 'hours', 'curWeekIndex'],
  mixins: [temperatureMixin],
  data () {
    return {
      // 画布容器高度
      svgHeight: 705,
      svgWidth: 630,
      // 单个单元格的宽高 6个格子时
      td: {
        width: 15,
        height: 15
      },
      fswdPoint: [], // 复试体温
      fctwLine: [], // 复测体温【线】
      fctwPoint: [], // 复测体温【点】
      fcttLine: [], // 复测疼痛【线】
      fcttPoint: [], // 复测疼痛【点】
      ttPoint: [], // 疼痛[点]
      brokenLine: [], // 体温、脉搏、心率、疼痛等【折线】
      coincidePoint: [], // 体温、脉搏、心率、疼痛等点和重合的点
      intersectPoint: [], // 体温：腋温 [X] 耳温 [▲]
      eventText: [], // 事件文字
      arrowhead: [], // 箭头
      mbdcLinePolygon: { line: [], polygon: [] }, // 脉搏短促[线][多边形]
      messageConfig: {},
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
    },
    relationType: {
      handler (val) {
        this.messageConfig = messageConfig[val] || {}
      },
      immediate: true
    }
  },
  computed: {
    top: function () {
      // 由于发热类体温单(4)，增加了一行:产后日数， so~
      return 'top: 39px'
    }
  },
  created () {
  },
  methods: {
    // 重置所有数据
    reset () {
      this.showSignItem = []
      this.pointLineData = []

      this.fswdPoint = [] // 复试体温
      this.fctwLine = [] // 复测体温 物理降温虚线
      this.fctwPoint = [] // 复测体温物理降温
      this.fcttLine = [] // 复测疼痛 虚线
      this.fcttPoint = [] // 复测疼痛
      this.brokenLine = [] // 体温、脉搏、心率、疼痛等折线
      this.coincidePoint = [] // 体温、脉搏、心率、疼痛等点和重合的点
      this.intersectPoint = [] // 体温：腋温 [X] 耳温 [▲]
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
      // 临床事件的增加itemCodeFlag标识，设置为'eventData',以便后面解析临床事件的数据 hz
      if (sheetData['eventData']) {
        for (let i = 0; i < sheetData['eventData'].length; i++) {
          let _d = sheetData['eventData'][i]
          // 空值直接忽略
          if (!_d['signValue']) {
            continue
          }
          _d['itemCodeFlag'] = 'eventData'
        }
      }
      // 体温中非数字值作为事件处理
      if (sheetData['tiwen']) {
        for (let i = 0; i < sheetData['tiwen'].length; i++) {
          let _d = sheetData['tiwen'][i]
          // 空值直接忽略
          if (!_d['signValue']) {
            continue
          }
          // 不是数字的就算事件 大于42都的作为事件，把体温分组，但是不会绘制
          if (isNaN(_d['signValue']) || _d['signValue'] > 42) {
            let t = sheetData['tiwen'].splice(i, 1)
            sheetData.eventData.push(...t)
            i--
          }
        }
      }

      // 心率大于180作为事件处理
      if (sheetData['xinlv']) {
        for (let i = 0; i < sheetData['xinlv'].length; i++) {
          let _d = sheetData['xinlv'][i]
          if (!_d['signValue']) {
            continue
          }
          if (_d['signValue'] > 180) {
            let t = sheetData['xinlv'].splice(i, 1)
            sheetData.eventData.push(...t)
            i--
          }
        }
      }
      this.pointLineData = sheetData

      let showItems = []
      for (let i = 0; i < this.signItem.length; i++) {
        let item = this.signItem[i]

        if (item['signItemFieldName'] === 'xueya') { // 血压
          let shousuoyaCache = { data: [] } // 收缩压
          let shuzhangyaCache = { data: [] } // 舒张压
          let xueyaCache = [] // 血压

          for (let j = 0; j < item.childrenSignItem.length; j++) {
            let _d = item.childrenSignItem[j]
            let _data = sheetData[_d['signItemFieldName']] || []
            // 收缩压
            if (_d['signItemFieldName'] === 'shousuoya') {
              _d['data'] = this.parseLineData(_d, _data)
              shousuoyaCache = _d
            }
            // 舒张压
            if (_d['signItemFieldName'] === 'shuzhangya') {
              _d['data'] = this.parseLineData(_d, _data)
              shuzhangyaCache = _d
            }
          }
          // 合并收缩压|舒张压
          for (let i = 0; i < shousuoyaCache.data.length; i++) {
            let ssy = shousuoyaCache.data[i] ? shousuoyaCache.data[i].signValue : ''
            let szy = shuzhangyaCache.data[i] ? shuzhangyaCache.data[i].signValue : ''
            let type = shousuoyaCache.data[i].itemValueType && shousuoyaCache.data[i].itemValueType === '下肢' ? '(下)' : ''
            xueyaCache.push({ signValue: ssy + (ssy ? '/' : '') + szy + type, itemValueType: shousuoyaCache.data[i].itemValueType || '' })
          }

          if (this.isShow(item, xueyaCache)) {
            item['newSignItemShowName'] = item['signItemShowName']
            showItems.push(
              Object.assign(item, { data: xueyaCache }, this.getColspan(item))
            )
          }
        } else if (item['signItemFieldName'] === 'huxi') { // 呼吸的数据单独处理
          let _data = sheetData[item['signItemFieldName']] || []
          // 有值且索引是奇数在上偶数在下
          _data = this.parseLineData(item, _data)
          let hIndex = 1
          for (let j = 0; j < _data.length; j++) {
            if (_data[j]) {
              _data[j].cls = hIndex % 2 === 0 ? 'text-bottom' : 'text-top'
              hIndex++
            }
          }

          if (this.isShow(item, _data)) {
            item['newSignItemShowName'] = item['signItemShowName']
            showItems.push(
              Object.assign(item, { data: _data }, this.getColspan(item))
            )
          }
        } else if (item.childrenSignItem.length > 0) { // 有子项
          this.parseItemGroup(item.childrenSignItem, showItems, sheetData)
        } else {
          let _data = sheetData[item['signItemFieldName']] || []

          if (this.isShow(item, _data)) {
            item['newSignItemShowName'] = item['signItemShowName']
            showItems.push(
              Object.assign(item, { data: this.parseLineData(item, _data) }, this.getColspan(item))
            )
          }
        }
      }

      // 最终要显示在底部的体征项
      this.showSignItem = showItems

      // 开始处理点线重合点
      this.parseRePoint(this.pointLineData, this.curWeekDate[0])
      // 开始处理事件
      this.parseEvent(this.pointLineData ? this.pointLineData.eventData : [], this.curWeekDate[0])
    },
    // 底部是否显示此体征项
    // 始终显示(1) || 有内容显示(2) && 存储方式不能为空 && 存储方式不为空的
    isShow (item, data) {
      if (
        (item['isShow'] === 1 || (item['isShow'] === 2 && data.length > 0 && !this.isEmpty(data))) &&
        (!item['signStorageType'] || item['signStorageType'] !== '')
      ) {
        return true
      }
      return false
    },
    // 解析有子类的体征项，递归名称合并为一个体征项
    parseItemGroup (children, group, sheetData) {
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        let str = child['signItemShowName']
        this.getNewSignItemShowName(children[i], str, group, sheetData)// 递归获取子元素中的signItemShowName值
      }
    },
    // 递归
    getNewSignItemShowName (data, strItem, group, sheetData) {
      let item = data['childrenSignItem']
      if (item.length === 0) { // 没有子项的时候 取当前这个list放进sign_item中，重新组合
        let smallChildItem = JSON.parse(JSON.stringify(data))
        if (smallChildItem['signItemFieldName'] === 'shousuoya' || smallChildItem['signItemFieldName'] === 'shuzhangya' || smallChildItem['signItemFieldName'] === 'celiangweizhi') {
          smallChildItem['newSignItemShowName'] = data['signItemShowName'] // 舒张压收缩压测量位置不需要展示血压-收缩压
        } else {
          smallChildItem['newSignItemShowName'] = strItem // 总尿量-大便次数-尿量-水-排泄 格式
        }
        let _data = sheetData[smallChildItem['signItemFieldName']] || []

        if (this.isShow(smallChildItem, _data)) {
          Object.assign(smallChildItem, { data: this.parseLineData(smallChildItem, _data) }, this.getColspan(smallChildItem))
          group.push(smallChildItem)
        }
      } else {
        for (let j = 0; j < item.length; j++) {
          let str2 = strItem + '-' + item[j]['signItemShowName']
          this.getNewSignItemShowName(item[j], str2, group, sheetData)
        }
      }
    },
    // 根据存储类型获取单元格所占列
    getColspan (item) {
      let data = {}
      data['colspan'] = 1 // 单元格跨列
      data['length'] = 42 // 单元格个数

      // 存储方式
      // 先json字段检测，如果没有就取字段signStorageType中的值
      const signStorageType = item['defaultInFromSetting'] && item['defaultInFromSetting'].hasOwnProperty('signStorageShowType')
        ? item['defaultInFromSetting']['signStorageShowType']
        : item['signStorageType']

      // 存储方式 0按天 1按半天 2按时间点
      if (signStorageType === 1) {
        data['colspan'] = 3
        data['length'] = 14
      } else if (signStorageType === 0) {
        data['colspan'] = 6
        data['length'] = 7
      }
      return data
    },
    parseRePoint (pointData, beginDate) {
      let _this = this
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
      for (let i = 0; i < events.length; i++) {
        let value = events[i].signValue

        let dataTime = events[i].recordDate.split(' ')[0] + ' ' + (events[i].itemHour || this.parseEventHour(events[i].recordDate)) + ':00'
        if (events[i].itemCode === 'tiwen' && (isNaN(value) || value > 42)) {
          tiwenLeaveEvents.push(dataTime)
        }
        if (events[i].itemCode === 'xinlv' && value > 180) {
          xinlvLeaveEvents.push(dataTime)
        }
      }

      // 2021-03-22 心率的分组增加时刻点分组，没有心率的时刻点也作为分组事件，【为了心率脉搏短绌绘制】
      for (let i = 0; i < this.curWeekDate.length; i++) {
        const date = this.curWeekDate[i]
        for (let j = 0; j < this.hours.length; j++) {
          const hour = this.hours[j]
          const dateHour = date + ' ' + hour.measuringTime + ':00'
          const h = this.hasXlByDateHour(xl, dateHour)
          if (!h) {
            xinlvLeaveEvents.push(dateHour)
          }
        }
      }
      // console.log('xinlvLeaveEvents  ', xinlvLeaveEvents)

      // 根据事件分组
      let xlGroup = this.splitGroup(xinlvLeaveEvents, xl)
      let wdGroup = this.splitGroup(tiwenLeaveEvents, wd)
      let mbGroup = this.splitGroup([], mb)
      let ttGroup = this.splitGroup([], tt)

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

      // 脉搏、疼痛、心率、体温-换算坐标
      let mbPoints = []
      let ttPoints = []
      for (let i = 0; i < mbGroup.length; i++) {
        let mbArray = mbGroup[i]
        mbPoints[i] = []
        for (let j = 0; j < mbArray.length; j++) {
          if (!mbArray[j].signValue) continue
          let xy = this.getXY(mbArray[j], beginDate, 'mb')
          mbPoints[i].push(xy)
        }

        let ttArray = ttGroup[i]
        ttPoints[i] = []
        for (let j = 0; j < ttArray.length; j++) {
          if (!ttArray[j].signValue) continue
          let xy = this.getXY(ttArray[j], beginDate, 'tt')
          ttPoints[i].push(xy)
        }
      }

      // 绘制 复测温度[复测温度]
      // 获取 温度等于42°C时的y轴值，如果温度大于42°,即y值小于wdMax，则绘制向上的箭头
      let wdMax = 30
      for (let i = 0; i < wdPoints.length; i++) {
        let wdPoint = wdPoints[i] // 组
        for (let j = 0; j < wdPoint.length; j++) {
          let value = wdPoint[j].value // 温度
          let phValue = wdPoint[j].point.phValue // 复测
          let yPx = wdPoint[j].y
          let xPx = wdPoint[j].x

          // 如果存在复试体温
          const hasFs = this.getFushi(wdPoint[j].point.recordDate, wdPoint[j].point.itemHour)
          if (hasFs) {
            _this.fswdPoint.push({ x: xPx, y: yPx, title: '复试体温', fill: 'red', stroke: 'red' })
          }

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
          let value = ttPoint[j].value
          let phValue = ttPoint[j].point.phValue
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

      // 绘制脉搏折线图
      // 体温由于拒测、外出、不升分组了，所以点和线分开处理
      let coor = []
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

      // 心率由于大于180分组了，所以点和线分开处理
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

      // 脉搏 疼痛等级
      for (let i = 0; i < mbPoints.length; i++) {
        let mbPoint = mbPoints[i]
        let ttPoint = ttPoints[i]
        // 定义折线path
        let mbPath = ''
        let ttPath = ''
        if (!coor[i]) coor[i] = {}
        for (let j = 0; j < mbPoint.length; j++) {
          let x = mbPoint[j].x
          let y = mbPoint[j].y
          coor[i][x] = coor[i][x] || {}
          coor[i][x]['mb'] = mbPoint[j]
          if (mbPath === '') {
            mbPath += 'M' + x + ',' + y
          } else {
            mbPath += 'L' + x + ',' + y
          }
        }
        for (let j = 0; j < ttPoint.length; j++) {
          let x = ttPoint[j].x
          let y = ttPoint[j].y
          coor[i][x] = coor[i][x] || {}
          coor[i][x]['tt'] = ttPoint[j]
          if (ttPath === '') {
            ttPath += ' M' + x + ',' + y
          } else {
            ttPath += ' L' + x + ',' + y
          }
        }

        _this.brokenLine.push({ stroke: 'red', d: mbPath })
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
          let ew = json[j].wd.type === '耳温' // 耳温

          let fcyw = json[j].fcwd.type === '腋温' // 腋温
          let fckw = json[j].fcwd.type === '口温' // 口温
          let fcgw = json[j].fcwd.type === '肛温' // 肛温
          let fcew = json[j].fcwd.type === '耳温' // 耳温

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
            let title = '脉搏:' + json[j].xl.value + '次,心率:' + json[j].xl.value + '次,肛温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: '肛温', 'x': j, 'y': xlY, r: 7, stroke: 'blue', title, fill: '#fff' })
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 3, stroke: 'red', title, fill: 'red' })
          } else if (ismbxlwd && mbY === xlY && xlY === wdY && yw) { // 脉搏+心率+腋温[红圆+红圈+蓝叉]:红圈在外围（表示心率）、红圆在中间（表示脉搏）、蓝叉在中间红圆之上（表示腋温）
            let title = '脉搏:' + json[j].xl.value + '次,心率:' + json[j].xl.value + '次,腋温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: 'red' })
            _this.intersectPoint.push({ type: '腋温', 'x': j, 'y': xlY, halfSize: 4, stroke: 'blue', title })
          } else if (ismbxlwd && mbY === xlY && xlY === wdY && kw) { // 脉搏+心率+口温[红圆+红圈+蓝圆]:红圈在外围（表示心率）、红圆在中间（表示脉搏）、蓝圆在中间红圆之上（表示口温）
            let title = '脉搏:' + json[j].xl.value + '次,心率:' + json[j].xl.value + '次,口温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: 'red' })
            _this.coincidePoint.push({ type: '口温', 'x': j, 'y': xlY, r: 3, stroke: 'blue', title, fill: 'blue' })
          } else if (ismbxlwd && mbY === xlY && xlY === wdY && ew) {
            // 脉搏+心率+耳温[红圆+红圈+蓝圆]:红圈在外围（表示心率）、红圆在中间（表示脉搏）、蓝圆在中间红圆之上（表示耳温）
            let title = '脉搏:' + json[j].xl.value + '次,心率:' + json[j].xl.value + '次,耳温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: 'red' })
            _this.intersectPoint.push({ type: '耳温', 'x': j, 'y': xlY, halfSize: 4, stroke: 'blue', title })
          } else if (isxlwd && xlY === wdY && gw) {
            // 心率+肛温[红圈+蓝圈]
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
          } else if (isxlwd && xlY === wdY && ew) { // 心率+耳温[红圈+三角]]
            let title = '心率:' + json[j].xl.value + '次，耳温:' + json[j].wd.value + '°C'
            if (xlY && wdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.intersectPoint.push({ type: '耳温', 'x': j, 'y': xlY, halfSize: 4, stroke: 'blue', title })
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
          } else if (ismbwd && mbY === wdY && yw) { // 脉搏+腋温[红圈+蓝叉]
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
          } else if (ismbwd && mbY === wdY && ew) { // 脉搏+耳温[红圆+三角]
            let title = '脉搏:' + json[j].mb.value + '次，耳温:' + json[j].wd.value + '°C'
            if (mbY && wdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.intersectPoint.push({ type: '耳温', 'x': j, 'y': mbY, halfSize: 4, stroke: 'blue', title })
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
          if (ismbxlwd && mbY === xlY && xlY === fcwdY && fcgw) { // 脉搏+心率+肛温[红圆+红圈+蓝圈]:两个圈在外围（红圈在最外层表示心率，篮圈在里层表示肛温）、一个圆在中间（红圆表示脉搏）
            let title = '脉搏:' + json[j].xl.value + '次,心率:' + json[j].xl.value + '次,复测肛温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: '肛温', 'x': j, 'y': xlY, r: 7, stroke: 'blue', title, fill: '#fff' })
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 3, stroke: 'red', title, fill: 'red' })
          } else if (ismbxlwd && mbY === xlY && xlY === fcwdY && fcyw) { // 脉搏+心率+腋温[红圆+红圈+蓝x]:两个圈在外围（红圈在最外层表示心率，篮圈在里层表示肛温）、一个圆在中间（红圆表示脉搏）
            let title = '脉搏:' + json[j].xl.value + '次,心率:' + json[j].xl.value + '次,复测腋温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: 'red' })
            _this.intersectPoint.push({ type: '腋温', 'x': j, 'y': xlY, halfSize: 4, stroke: 'blue', title })
          } else if (ismbxlwd && mbY === xlY && xlY === fcwdY && fcew) { // 脉搏+心率+肛温[红圆+红圈+三角]:两个圈在外围（红圈在最外层表示心率，篮圈在里层表示肛温）、一个圆在中间（红圆表示脉搏）
            let title = '脉搏:' + json[j].xl.value + '次,心率:' + json[j].xl.value + '次,复测耳温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: 'red' })
            _this.intersectPoint.push({ type: '耳温', 'x': j, 'y': xlY, halfSize: 4, stroke: 'blue', title })
          } else if (ismbxlwd && mbY === xlY && xlY === fcwdY && fckw) { // 脉搏+心率+肛温[红圆+红圈+蓝园]:两个圈在外围（红圈在最外层表示心率，篮圈在里层表示肛温）、一个圆在中间（红圆表示脉搏）
            let title = '脉搏:' + json[j].xl.value + '次,心率:' + json[j].xl.value + '次,复测口温:' + json[j].wd.value + '°C'
            _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: 'red' })
            _this.coincidePoint.push({ type: '口温', 'x': j, 'y': xlY, r: 3, stroke: 'blue', title, fill: 'blue' })
          } else if (ismbfcwd && mbY === fcwdY && fcgw) { // 脉搏+复测肛温[红圆+蓝圈]
            let title = '脉搏:' + json[j].mb.value + '次，复测肛温:' + json[j].wd.value + '°C'
            if (mbY && fcwdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'blue', title, fill: '#fff' })
              _this.coincidePoint.push({ type: '肛温', 'x': j, 'y': mbY, r: 3, stroke: 'red', title, fill: 'red' })
            }
          } else if (ismbfcwd && mbY === fcwdY && fcyw) { // 脉搏+复测腋温[红圆+蓝叉]
            let title = '脉搏:' + json[j].mb.value + '次，复测腋温:' + json[j].fcwd.value + '°C'
            if (mbY && fcwdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.intersectPoint.push({ type: '腋温', 'x': j, 'y': mbY, halfSize: 4, stroke: 'blue', title })
            }
          } else if (ismbfcwd && mbY === fcwdY && fcew) { // 脉搏+复测耳温[红圆+三角]
            let title = '脉搏:' + json[j].mb.value + '次，复测耳温:' + json[j].fcwd.value + '°C'
            if (mbY && fcwdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': mbY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.intersectPoint.push({ type: '耳温', 'x': j, 'y': mbY, halfSize: 4, stroke: 'blue', title })
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
          } else if (isxlfcwd && xlY === fcwdY && fcew) { // 心率+复测腋温[红圈+三角]]
            let title = '心率:' + json[j].xl.value + '次，复测耳温:' + json[j].fcwd.value + '°C'
            if (xlY && fcwdY) {
              _this.coincidePoint.push({ type: 'mb', 'x': j, 'y': xlY, r: 7, stroke: 'red', title, fill: '#fff' })
              _this.intersectPoint.push({ type: '耳温', 'x': j, 'y': xlY, halfSize: 4, stroke: 'blue', title })
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
              } else if (point.wd.type === '耳温') {
                _this.intersectPoint.push({
                  type: '耳温',
                  'x': j,
                  'y': wdY,
                  r: 4,
                  stroke: 'blue',
                  title: '耳温:' + point.wd.value + '°C',
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
      // 1. 根据心率>180 或者 时刻点为空分组心率和脉搏
      const groupXlMb = this.splitGroupXlMb(xl, mb, this.curWeekDate, this.hours, beginDate)
      for (let i = 0; i < groupXlMb.length; i++) {
        console.log(groupXlMb[i].xl, groupXlMb[i].mb)
        const mbPoints = groupXlMb[i].mb
        const xlPoints = groupXlMb[i].xl

        // 1.统计出现的多边形
        let polygonArray = this.getPolygon([mbPoints], [xlPoints])
        // 2.绘制多边形
        for (let i = 0; i < polygonArray.length; i++) {
          let polygon = polygonArray[i]
          const arr = this.parseBlueLine(polygon)
          pointArray.push(arr)
        }
      }

      // // 1.统计出现的多边形
      // let polygonArray = this.getPolygon(mbPoints, _xlPoints)
      // // 2.绘制多边形
      // for (let i = 0; i < polygonArray.length; i++) {
      //   let polygon = polygonArray[i]
      //   pointArray.push(this.parseBlueLine(polygon))
      // }
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
      polygonArray.length > 2 && _this.mbdcLinePolygon.polygon.push(htmlDe)
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
      const daysW = _this.td.width * 6 // 一天的显示的宽度
      const chinese = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      const height = _this.td.height
      // 分组，显示在同一时间段
      let timeArray = {}
      let otherArray = []
      let evensXpx = {}
      for (let i = 0; i < evenArray.length; i++) {
        const value = evenArray[i].signValue

        evenArray[i].itemHour = evenArray[i].itemHour || this.parseEventHour(evenArray[i].recordDate)
        let dataTime = evenArray[i].recordDate.split(' ')[0] + ' ' +
          (evenArray[i].itemHour || this.parseEventHour(evenArray[i].recordDate)) + ':00'

        evensXpx[dataTime] = this.getDateDiff(beginDate, evenArray[i].recordDate.split(' ')[0]) * daysW + tdW * this.getHourIndex(evenArray[i].itemHour) - tdW / 2

        // 显示顶部的事件，临床事件全部绘制(包含纯数字输入)以及（【不升】和数字 排除）
        let eventFlag = evenArray[i].itemCodeFlag && evenArray[i].itemCodeFlag === 'eventData'
        if ((value !== '不升' && isNaN(value)) || (eventFlag)) {
          if (timeArray[dataTime] === undefined) {
            timeArray[dataTime] = []
          }
          timeArray[dataTime].push(evenArray[i])
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
        for (let j = 0; j < evens.length; j++) {
          let curEven = evens[j]
          let finalValue = curEven.signValue || ' W '
          let showTime = curEven.config && +curEven.config.showTime
          let hour = parseInt(moment(curEven.recordDate).format('HH'))
          let minute = parseInt(moment(curEven.recordDate).format('mm'))
          let hourStr = hour.toString()
          let minuteStr = minute.toString()

          if (finalValue === '请假') {
            // 【请假】特例
          } else if (showTime) {
            if (minute > 0) {
              finalValue += '||' + this.numToChinese(hourStr, chinese) + '时' + this.numToChinese(minuteStr, chinese) + '分'
            } else {
              finalValue += '||' + this.numToChinese(hourStr, chinese) + '时整'
            }
          }

          if (j === 0) {
            show += finalValue
          } else {
            show += ' ' + finalValue
          }
        }
        showArray.push(show)
        xPxArray.push(xPx)
      }
      // 绘制顶部事件
      for (let i = 0; i < showArray.length; i++) {
        // 绘制path
        let xPx = xPxArray[i]
        let textArray = showArray[i].split('')
        let svgText = []
        for (let i = 0; i < textArray.length; i++) {
          svgText.push({
            x: textArray[i] === '|' ? (xPx + 4) : xPx,
            y: (30 + 11) + i * height,
            fill: 'red',
            text: textArray[i]
          })
        }
        _this.eventText.push(svgText)
      }
      // 绘制其他事件
      for (let i = 0; i < otherArray.length; i++) {
        let value = otherArray[i].signValue
        let code = otherArray[i].itemCode
        let xPx = this.getDateDiff(beginDate, otherArray[i].recordDate.split(' ')[0]) * daysW + tdW * this.getHourIndex(otherArray[i].itemHour) - tdW / 2
        // 心率
        if (+value > 180 && code === 'xinlv') {
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
      // 存储方式
      // 先json字段检测，如果没有就取字段signStorageType中的值
      const signStorageType = item['defaultInFromSetting'] && item['defaultInFromSetting'].hasOwnProperty('signStorageShowType')
        ? item['defaultInFromSetting']['signStorageShowType']
        : item['signStorageType']

      let d = []
      for (let i = 0; i < this.curWeekDate.length; i++) {
        let date = this.curWeekDate[i] // 日期
        // 时间点
        if (signStorageType === 2) {
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
        if (signStorageType === 1) {
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
        if (signStorageType === 0) {
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
    },
    // 获取此日此时是否有复试体温
    getFushi (date, hour) {
      const fushitiwen = this.pointLineData.fushitiwen || []
      for (let i = 0; i < fushitiwen.length; i++) {
        const fswd = fushitiwen[i]
        if (fswd.recordDate === date && fswd.itemHour === hour) {
          return true
        }
      }
      return false
    }
  },
  components: {
    [Tooltip.name]: Tooltip,
    svgIcon,
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
        padding: 0;
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
        height: 15px;
        td {
          line-height: 1;
          &.borderL {
            border-left: 1px solid black;
          }
          &.borderB {
            border-bottom: 1px solid black;
          }
          &.borderR {
            border-right: 1px solid red;
          }
          &.borderRB {
            border-right: 1px solid black;
          }
          &.borderT {
            border-top: 1px solid black;
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
    top: 76px;
    left: 120px;
  }

  .svg-tips {
    width: 15px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    table {
      width: 100%;
      font-size: inherit;
      text-align: center
    }
    td {
      height: 100px;
    }
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
