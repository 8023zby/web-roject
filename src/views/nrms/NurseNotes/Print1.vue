<template>
  <!--

    这是一个不拆行、不显示页码的打印，利用html元素宽度自动换行，浏览器打印换页

    使用背景图显示行线，打印时需要注意在“更多设置” - “选项” - 勾选“背景图形”， chrome浏览器，其他未测试

  -->
  <div class="nurse_note_print_container">
    <table border="0">
      <thead>
      <tr>
        <td colspan="20" class="border_none" style="font-size: 18px; height: 50px; vertical-align: bottom">xx市中心医院</td>
      </tr>
      <tr>
        <td colspan="20" class="border_none" style="font-size: 16px; line-height: 35px;">护理记录单</td>
      </tr>
      <tr>
        <td colspan="20" class="border_none" style="line-height: 25px; padding: 0 28px">
          <div class="patient_basic">
            <div>姓名：刘润杰</div>
            <div>性别：男</div>
            <div>年龄：50岁</div>
            <div>病区：心内二东区</div>
            <div>科室：心血管二科</div>
            <div>住院号：02154521</div>
            <div>床号：01床</div>
          </div>
        </td>
      </tr>
      <tr>
        <td rowspan="3" class="A">
          <span class="date_title">
            <svg xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="51" x2="80" y2="0"/>
            </svg>
            <span class="text">
              <span>日期</span>
              <span>时间</span>
            </span>
          </span>
        </td>
        <td rowspan="3" class="B">体温<br>°C</td>
        <td rowspan="3" class="C">脉搏<br>次/分</td>
        <td rowspan="3" class="D">呼吸<br>次/分</td>
        <td rowspan="3" class="E">血压<br>mmhg</td>
        <td rowspan="3" class="F">心率<br>次/分</td>
        <td rowspan="3" class="G">血氧饱和度 %</td>
        <td rowspan="3" class="H">神志</td>
        <td colspan="4">瞳孔</td>
        <td colspan="2">入量</td>
        <td colspan="3">出量</td>
        <td rowspan="3" class="R">病情及治疗</td>
        <td rowspan="3" class="S">护士签名</td>
        <td rowspan="3" class="T">护士长<br>签名</td>
      </tr>
      <tr>
        <td colspan="2">大小mm</td>
        <td colspan="2">反应</td>
        <td rowspan="2" class="M">内容</td>
        <td rowspan="2" class="N">量<br>ml</td>
        <td rowspan="2" class="O">内容</td>
        <td rowspan="2" class="P">形状</td>
        <td rowspan="2" class="Q">量<br>ml</td>
      </tr>
      <tr>
        <td class="I">左</td>
        <td class="J">右</td>
        <td class="K">左</td>
        <td class="L">右</td>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(note, index) in note_data" :key="index" class="line_table">
        <td class="A date_time">2018-02-02 12:12:12</td>
        <td class="B fixed_item">37.2</td>
        <td class="C fixed_item">78</td>
        <td class="D fixed_item">64</td>
        <td class="E fixed_item">125/80</td>
        <td class="F fixed_item">45</td>
        <td class="G fixed_item">97</td>
        <td class="H fixed_item">浅阿迷</td>
        <td class="I fixed_item">180</td>
        <td class="J fixed_item">灵敏</td>
        <td class="K fixed_item">120</td>
        <td class="L fixed_item">迟钝</td>
        <td class="M text_line_height">xxx射液</td>
        <td class="N fixed_item">200</td>
        <td class="O fixed_item">呕吐</td>
        <td class="P fixed_item">流</td>
        <td class="Q fixed_item">200</td>
        <td class="R text_line_height">{{note.conditionTxt}}</td>
        <td class="S fixed_item" style="padding: 0">
          <span class="sign_name">
            <svg xmlns="http://www.w3.org/2000/svg" style="">
              <line x1="0" y1="33" x2="70" y2="0" style=""/>
            </svg>
            <span class="text">
              <span>张小护</span>
              <span>李大护</span>
            </span>
          </span>
        </td>
        <td class="T fixed_item">李大护</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: "nurse_notes_print",
    data() {
      return {
        note_data: [
          {
            conditionTxt: "切口用无菌, 渗血渗液。",
            isPage: true
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。",
            isPage: true
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。无渗血渗液。切口用无菌敷"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。",
            isPage: true
          },
          {
            conditionTxt: "切口用无菌敷料包扎，无渗血渗液。切口用无菌敷料包扎，无渗血渗液。"
          },
        ]
      };
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  $border-color: #525252;
  $text-color: #333;

  table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    border: none;
    td {
      padding: 0;
      margin: 0;
      border: 0;
      box-sizing: border-box;
    }
  }

  .nurse_note_print_container {
    width: 1043px;
    font-size: 12px;
    padding: 0 40px;
    color: $text-color;
    table {
      thead {
        td {
          border: 1px solid $border-color;
        }
        td.border_none {
          border: none
        }
      }
    }
  }

  .patient_basic {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }

  /* 斜线svg */
  .date_title, .sign_name {
    display: block;
    position: relative;
    svg {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    line {
      stroke: $border-color;
      stroke-width: 1
    }
    .text {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      span:first-child {
        position: absolute;
      }
      span:last-child {
        position: absolute;
      }
    }
  }

  /* 日期表头 */
  .date_title {
    height: 51px;
    width: 80px;
    .text {
      span:first-child {
        top: 5px;
        left: 5px;
      }
      span:last-child {
        bottom: 5px;
        right: 5px;
      }
    }
  }

  //签名列
  .sign_name {
    height: 33px;
    width: 70px;
    .text {
      span:first-child {
        top: 1px;
        left: 1px;
      }
      span:last-child {
        bottom: 1px;
        right: 1px;
      }
    }
  }

  .line_table {
    background: url("../../../assets/nrms/images/print4.png");
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    td {
      vertical-align: top;
      box-sizing: border-box;
      border-left: 1px solid $border-color;
      border-right: 1px solid $border-color;
    }
    .fixed_item {
      padding-top: 8px;
    }
    .text_line_height {
      padding: 0 5px;
      line-height: 34px;
      text-align: left;
    }
  }

  .A {
    width: 80px;
  }

  .B {
    width: 36px;
  }

  .C {
    width: 36px;
  }

  .D {
    width: 36px;
  }

  .E {
    width: 50px;
  }

  .F {
    width: 36px;
  }

  .G {
    width: 36px;
  }

  .H {
    width: 45px;
  }

  .I {
    width: 35px;
  }

  .J {
    width: 35px;
  }

  .K {
    width: 35px;
  }

  .L {
    width: 35px;
  }

  .M {
    width: 55px;
  }

  .N {
    width: 35px;
  }

  .O {
    width: 40px;
  }

  .P {
    width: 35px;
  }

  .Q {
    width: 35px;
  }

  .R {
    width: 224px;
  }
  .S {
    width: 70px;
  }

  .T {
    width: 50px;
  }
</style>
