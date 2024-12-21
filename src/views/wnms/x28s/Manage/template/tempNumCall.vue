<template>
  <div class="main_x28s">
    <div class="image">
      <!-- 左侧内容显示 -->
      <div class="content-Left">
        <!-- logo -->
        <div class="logo">
          <img style="width:5rem; height:5rem" src="../../assets/img/log.png" />
        </div>
        <!-- 护理单元 -->
        <div class="nursing">
          <span>{{nursingName}}</span>
        </div>
        <div class="dateTime">
          <!-- 时间 -->
          <div class="time">
            <span>{{time}}</span>
          </div>
          <!-- 年月份 -->
          <div class="datebg">
            <span class="dateCss">{{date}}</span>
          </div>
        </div>
      </div>
      <!-- 中间内容展示 -->
      <div class="content-Main">
        <span class="font-content">
          <!-- <marquee scrollamount="10" behavior="scroll" direction="left"></marquee>{{content}} -->
          {{content}}
        </span>
      </div>
      <!-- 右侧内容展示 -->
      <div class="content-rgith">
        <img src="../../assets/img/jing.png" alt />
      </div>
    </div>
  </div>
</template>
<script>


export default {
  data () {
    return {
      nursingName: '心脏大血管外科一病房',
      time: '02:20',
      date: '2019年10月14日    星期三',
      content:
        '102房间02呼叫是的水电费第三方水电费第三方发的所发生的发顺丰水电费'
    }
  },
  created () {
    this.move()
  },
  methods: {
    move () {
      // 箭头函数解决 this 指向问题
      var timer = setInterval(() => {
        var start = this.content.slice(0, 1)
        var end = this.content.slice(1)
        this.content = end + start
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped >
.main_x28s {
  height: 65%;
  width: 99.9%;
  border: 1px solid #3bc0ee;
  .image {
    background: url('../../assets/img/mainShow.png') no-repeat;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .content-Left {
      width: 29%;
      margin-left: 1rem;
      .logo {
        padding-top: 10px;
        width: 90px;
        height: 90px;
      }

      .nursing {
        font-size: 1.1cm;
        color: aliceblue;
        font-weight: 400;
        text-align: center;
      }
      .dateTime {
        padding-top: 1rem;
        text-align: center;
        .time {
          font-size: 4cm;
          color: aliceblue;
          font-weight: 300;
          text-align: center;
        }
      }

      .datebg {
        background: #67e9ec;
        border-radius: 30px;
        text-align: center;
        padding: 10px;
        margin-top: 3rem;
        .dateCss {
          font-size: 0.9cm;
          color: #4364a6;
        }
      }
    }
    .content-Main {
      width: 50%;
      display: flex;
      align-items: center;
      .font-content {
        font-size: 3cm;
        color: #3db9f0;
        font-weight: 400;
        display: block; /*内联对象需加*/
        width: 31em;
        word-break: keep-all; /* 不换行 */
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
      }
    }
    .content-rgith {
      width: 18.5%;
      display: flex;
      align-items: center;
    }
  }
}
</style>
