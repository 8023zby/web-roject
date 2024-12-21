<template>
  <div class="container">
    <div class="container-left">
      <div class="container-left-title">
        <div class="left-icon"><span> <img style="width:5rem; height:5rem" :src="form.logoUrl" />
          </span></div>
        <div class="left-deptName"><span>{{form.deptName}}</span></div>
      </div>
      <div class="container-left-main">
        <span>
          祝您早日康复

        </span>
      </div>
      <div class="container-left-bottom">
        <span class="date"> {{form.date}}</span>
        <span class="time"> {{form.time}}</span>
        <span class="week"> {{form.week}}</span>
      </div>
    </div>
    <div class="container-right">
      <div class="container-right-title">
        <span class="title"> <span>{{form.materialName}}</span></span>
      </div>
      <div class="container-right-main" ref="content">
        <span :class="lineContent" ref="fontcontent" id="fontcontent" v-html="form.materialContent"></span>

      </div>
    </div>
  </div>
</template>
<script>
// 离开 zoomOutLeft box animated pulse
import "../../assets/css/style.css";
export default {
  name: "tempNumView2",
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    },
    previewData: {
      required: false,
      type: Object,
      default: () => {}
    }
  },

  data() {
    const xsrc = require("../../assets/img/line.png");
    const isrc = require("../../assets/img/lineTop.png");
    return {
      Maxsrc: xsrc,
      mainsrc: isrc,
      linsrc: xsrc,
      nursingName: "",
      form: {
        time: "",
        date: "",
        materialContent: ` `,
        materialName: "",
        deptName: "",
        week: ""
      },
      lineContent: "font-content",
      titleCss: "title",
      rowup: "rowup",
      contentTitle: "content-title_x28s"
    };
  },
  created() {
    this.preview();
  },
  mounted() {},
  methods: {
    backList() {
      this.$emit("option-changed", "index", this.detail);
    },
    preview() {
      this.form = this.detail.previewData;
      let date = this.$data.form.date.split(" ");
      this.$data.form.date = date[0];
      this.$data.form.week = date[1];
      this.$nextTick(() => {
        this.textScroll();
      });
    },
    textScroll() {
      let fatherEle = this.$refs.content;
      let daughterEle = this.$refs.fontcontent; // 100
      const element = document.querySelectorAll("#fontcontent p");

      // element.forEach(function (e) {
      //   for (let i = 0; i < e.children.length; i++) {
      //     let style = e.children[i].style.fontSize;
      //     let fontSize = parseFloat(style);
      //     e.children[i].style.fontSize = (fontSize * 0.875) / 1.5 + "rem";
      //   }
      // });
      let fatherHeightCp = 0; // 初始化变量
      let heights = daughterEle.offsetHeight - fatherEle.offsetHeight; // 实际的高度

      if (daughterEle.clientHeight > fatherEle.clientHeight) {
        daughterEle.style.transform = `translateY(0px)`;
        this.lineContent = "font-content minifont-content ";
        this.titleCss = "title minititle ";
        setTimeout(() => {
          this.linsrc = this.mainsrc;
        }, 1000);

        let interval = setInterval(function () {
          fatherHeightCp = fatherHeightCp - 1;

          daughterEle.style.transform = `translateY(${fatherHeightCp}px)`;
          if (-fatherHeightCp >= heights + 15) {
            clearInterval(interval);
          }
        }, 20);
      } else {
        this.titleCss = "title ";
        this.lineContent = "font-content";
        setTimeout(() => {
          this.linsrc = this.Maxsrc;
        }, 1000);
      }
    },
    getHeight() {
      let height = this.$refs.content.offsetHeight; // 100
      let fontHeight = this.$refs.fontcontent.offsetHeight; // 100
      let fh = fontHeight - height;

      if (fontHeight > height) {
        // 开始滚动
        var keyframes = document.styleSheets[0];
        let b = Date.parse(new Date());
        let name = "myMove2" + b.toString();

        keyframes.insertRule(
          `@keyframes  ${name} { from { transform: translateY(0); }  to { transform: translateY(-${fh}px) } }`
        );

        this.$refs.fontcontent.style.animation = ` ${name} ${
          fontHeight / 35
        }s `;
        this.$refs.fontcontent.style.animationFillMode = "forwards";

        this.lineContent = "font-content minifont-content ";
        this.titleCss = "title minititle ";
        setTimeout(() => {
          this.linsrc = this.mainsrc;
        }, 1000);
      } else {
        this.titleCss = "title ";
        this.lineContent = "font-content";
        setTimeout(() => {
          this.linsrc = this.Maxsrc;
        }, 1000);
      }
      console.log(height, fontHeight);
    }
  }
};
</script>
<style  lang="scss"  scoped>
.content-title_x28s {
  position: relative;
  overflow: hidden;
  animation: mymove 1s;
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
}

.font-content {
  width: 100%;
  display: inline-block;
  margin-top: 10px;
  word-break: break-all;
  white-space: pre-wrap;
}
/* 主样式 */
.main_view_x28s {
  height: 517px;
  width: 1920px;
  border: 1px solid #3bc0ee;

  .back-btn {
    width: 100%;
    text-align: center;
    height: 10vh;
    line-height: 10vh;
    .el-button {
      min-width: 70px;
      height: 38px;
      font-size: 14px;
      margin-left: 16px !important;
      border-radius: 2px !important;
    }
  }
  /* 外面大div */
  .bgimage {
    background: url("../../assets/img/viewbg.png") no-repeat;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* 左边内容 */
    .content-Left {
      width: 520px;
      margin-left: 1rem;
    }
  }

  .content-left-div {
    width: 90%;
  }

  /* 左边内容 logo */
  .logo {
    padding-top: 10px;
    width: 90px;
    height: 90px;
  }

  /* 左边内容护理单元 */
  .nursing {
    font-size: 1.1cm;
    color: aliceblue;
    font-weight: 400;
    text-align: center;
  }

  /* 左边内容时间 */
  .dateTime {
    padding-top: 1rem;
    text-align: center;
  }

  /* 左边内容年月日 */
  .time {
    font-size: 4cm;
    color: aliceblue;
    font-weight: 300;
    text-align: center;
  }

  /* 左边内容样式 */
  .datebg {
    background: #67e9ec;
    border-radius: 30px;
    text-align: center;
    padding: 10px;
    margin-top: 1rem;
  }

  /* 左边内容年月日样式 */
  .dateCss {
    font-size: 0.9cm;
    color: #4364a6;
  }

  /* 右边内容 */
  .content-Main {
    width: 1400px;
    display: flex;
    flex-direction: column;
    height: 517px;
    background-color: #5f92ca;
  }

  /* 右边内容标题 */
  .title {
    font-size: 0.9cm;
    font-weight: 350;
    display: block;
    width: 100%;
    padding-top: 3%;
    color: #3879c9;
    text-align: center;
  }

  /* 右边内容横线 */
  .line {
    text-align: center;
    padding-bottom: 10px;
  }

  /* 右边内容div */
  .content {
    height: 80%;
    overflow: hidden;
  }

  /* 右边内容文字 */
  .font-content {
    width: 100%;
    display: inline-block;
    margin-top: 10px;
    word-break: break-all;
    white-space: pre-wrap;
  }

  .minititle {
    font-size: 0.7cm;
    font-weight: 350;
  }

  .font-content p img {
    width: 100%;
  }
}
.container {
  width: 100%;
  height: 50%;

  background: #205fa3 url("../images/1.png") no-repeat;
  position: absolute;
  .container-left {
    width: 48%;
    height: 100%;
    padding-left: 2rem;
    float: left;
    .container-left-title {
      height: 20%;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .left-icon {
        width: 60px;
        height: 60px;
      }
      .left-deptName {
        width: 80%;
        font-size: 2rem;
        color: #ffca26;
      }
    }
    .container-left-main {
      height: 60%;
      display: flex;
      align-items: center;
      span {
        font-size: 8rem;
        color: #ffca26;
      }
    }
    .container-left-bottom {
      height: 20%;
      font-size: 3rem;
      color: #ffca26;
      .date,
      .ime,
      .week {
        margin: 2rem;
      }
    }
  }
  .container-right {
    background: #205fa3 url("../images/2.png") no-repeat;
    float: right;
    width: 48%;
    height: 100%;
    padding-left: 2rem;
    // background: #7baadd;
    .container-right-title {
      position: relative;
      .title {
        font-size: 2rem;
        position: absolute;
        color: #ffffff;
        font-weight: 700;
        top: 20%;
      }
      height: 20%;
    }
    .container-right-main {
      height: 80%;
      overflow: hidden;
    }
  }
}
</style>
