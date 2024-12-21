<template>
  <div class="main_view_x28s ">
    <div class="bgimage">
      <!-- 左侧内容显示 -->
      <div class="content-Left">
        <div class="content-left-div">
          <!-- logo -->
          <div class="logo">
          </div>
          <!-- 护理单元 -->
          <div class="nursing">
            <span>{{form.deptName}}</span>
          </div>
          <div class="dateTime">
            <!-- 时间 -->
            <div class="time">
              <span>{{form.time}}</span>
            </div>
            <!-- 年月份 -->
            <div class="datebg">
              <span class="dateCss">{{form.date}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 中间内容展示 -->
      <div class="content-Main">
        <div :class="contentTitle">
          <div :class="titleCss">
            <span>{{form.materialName}}</span>
          </div>
          <div class="line animated flash">
            <img :src="linsrc" />
          </div>
          <div class="content" ref="content">
            <span :class="lineContent" ref="fontcontent" id="fontcontent" v-html="form.materialContent"></span>
          </div>
        </div>
        <!-- 结束中间内容展示 -->
      </div>
    </div>
    <div v-if="detail.showBackBtn" class="back-btn">
      <el-button type="primary" @click="backList()">返回</el-button>
    </div>
  </div>
</template>
<script>
// 离开 zoomOutLeft box animated pulse
import "../../assets/css/style.css";
export default {
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
        deptName: ""
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

      this.$nextTick(() => {
        this.textScroll();
      });
    },
    textScroll() {
      let fatherEle = this.$refs.content;
      let daughterEle = this.$refs.fontcontent; // 100

      const element = document.querySelectorAll("#fontcontent p");
      element.forEach(function (e) {
        for (let i = 0; i < e.children.length; i++) {
          let style = e.children[i].style.fontSize;
          let fontSize = parseFloat(style);
          e.children[i].style.fontSize = (fontSize * 0.875) / 1.5 + "rem";
        }
      });
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
</style>
