<template>
  <div class="container">
    <div class="container-left">

      <div class="container-left-title">
        <span>{{form.materialName}}</span>
      </div>
      <div class="container-left-main" ref="content">
        <span :class="lineContent" ref="fontcontent" id="fontcontent" v-html="form.materialContent">1111111111111111</span>

      </div>
    </div>
    <div class="container-right">
      <div class="container-right-date">
        <span>{{form.date}}</span>
      </div>
      <div class="container-right-time">
        <span class="time">{{form.time}}</span>
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
.font-content {
  width: 100%;
  display: inline-block;
  margin-top: 10px;
  word-break: break-all;
  white-space: pre-wrap;
}

.container {
  width: 95%;
  height: 50%;
  display: flex;
  justify-content: space-around;
  background: #205fa3 url("../images/3.png") no-repeat;
  background-size: 100%;
  .container-left {
    flex: 0.7;
    height: 100%;
    background: url("../images/4.png") no-repeat;
    .container-left-title {
      height: 20%;
      display: flex;
      align-items: center;
      padding-left: 1rem;
      span {
        font-size: 1.5rem;
        font-weight: 600;
        color: #ffffff;
      }
    }
    .container-left-main {
      height: 80%;
      overflow: hidden;
    }
  }
  .container-right {
    flex: 0.3;
    height: 100%;
    .container-right-date {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40%;

      span {
        font-size: 2.5rem;
        font-weight: 900;
        color: #ffffff;
      }
    }
    .container-right-time {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      height: 60%;

      span {
        font-size: 8rem;
        font-weight: 900;
        color: #ffffff;
      }
    }
  }
}
</style>
