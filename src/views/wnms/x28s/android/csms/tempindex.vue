<template>
  <div class="main-content">
    <div :class="contentTitle">
      <!-- <div :class="titleCss" ref="title">
        <span>{{title}}</span>
        <div class="line animated flash">
          <img :src="linsrc" />
        </div>
      </div>-->
      <div class="content" id="contentid" ref="content">
        <span :class="lineContent" ref="fontcontent" id="fontcontentid" v-html="content"></span>
      </div>
    </div>
  </div>
</template>
<script>
import "../../assets/css/style.css";
import * as csmsManageApi from "../../api/csmsManage";
import { geturlkey } from "@/assets/wnms/utils/common.js";
/* 2022-03-04 测试DPI适配时发现CSS冲突 谭启春 */
// import "../../Manage/template/temp.css";

export default {
  data() {
    const xsrc = require("../../assets/img/line.png");
    const isrc = require("../../assets/img/lineTop.png");
    return {
      Maxsrc: xsrc,
      mainsrc: isrc,
      linsrc: xsrc,
      rowup: "rowup",
      ishide: false,
      titleCss: "main-title",
      title: "",
      content: ` `,
      lineContent: "font-content",
      contentTitle: "content-title"
    };
  },
  mounted() {
    this.getLocalhostData();
  },

  methods: {
    textScroll() {
      let fatherEle = window.innerHeight;
      let daughterEle = this.$refs.fontcontent; // 100
      let fatherHeightCp = 0; // 初始化变量
      let heights = daughterEle.offsetHeight - fatherEle; // 实际的高度

      if (daughterEle.clientHeight > fatherEle) {
        daughterEle.style.transform = `translateY(0px)`;
        let interval = setInterval(function () {
          let step = 40;
          let from = fatherHeightCp;
          let to = fatherHeightCp - step;
          fatherHeightCp = fatherHeightCp - step;
          var keyframes = document.styleSheets[0];
          let b = Date.parse(new Date());
          let name = "myMove2" + b.toString();
          keyframes.insertRule(
            `@keyframes  ${name} { from { transform: translateY(${from}px); }  to { transform: translateY(${to}px) } }`
          );
          daughterEle.style.animation = ` ${name} 1000ms linear`;
          // daughterEle.style.transform = `translateY(${fatherHeightCp}px)`
          daughterEle.style.animationFillMode = "forwards";
          if (-fatherHeightCp >= heights + 15) {
            try {
              setTimeout(() => {
                window.androidJs.onScrollActionEnd();
              }, 5000);
            } catch (e) {
              console.log("调用安卓方法androidJs.onScrollActionEnd()失败");
            }
            clearInterval(interval);
          }
        }, 1000);
      } else {
        try {
          setTimeout(() => {
            window.androidJs.onScrollActionEnd();
          }, 5 * 60 * 1000);
        } catch (e) {
          console.log("调用安卓方法androidJs.onScrollActionEnd()失败");
        }
      }
    },
    getLocalhostData() {
      let key = geturlkey("screenId");
      if (key) {
        let obj = {
          screenId: key
        };
        if (obj.screenId === "") {
          this.$router.push("/home/404");
          return;
        }
        csmsManageApi.getDetails(obj).then((res) => {
          if (res.status === 200) {
            if (res.data.materialType === 1) {
              this.title = "本条数据是一条视频文件";
              this.content = "本条数据是一条视频文件";
              return false;
            }
            this.title = res.data.materialName;
            this.content = res.data.materialContent;

            let nodes = document.getElementById("viewport_id");
            let devicePixelRatio = window.devicePixelRatio;
            let deviceScale = 1;
            deviceScale = deviceScale / devicePixelRatio;
            console.log(
              "devicePixelRatio:" + devicePixelRatio,
              "deviceScale:" + deviceScale
            );
            nodes.setAttribute("content", `initial-scale=${deviceScale}`);
            this.$nextTick(() => {
              setTimeout(() => {
                this.textScroll();
              }, 2000);

              try {
                window.androidJs.sendTitle(this.title);
              } catch (e) {
                console.log("调用安卓方法androidJs.sendTitle失败");
              }
            });
          }
        });
      } else {
        this.$router.push("/home/404");
      }
    },
    // 弃用
    change() {
      let fontHeight = this.$refs.fontcontent.offsetHeight; // 100
      let fh = fontHeight - window.innerHeight + 15;

      if (fontHeight > window.innerHeight - 55) {
        var keyframes = document.styleSheets[0];
        let b = Date.parse(new Date());
        let name = "Moves" + b.toString();
        keyframes.insertRule(
          `@keyframes  ${name} { from { transform: translateY(0); }  to { transform: translateY(-${fh}px) } }`
        );

        let speed = fontHeight / 20;
        this.$refs.fontcontent.style.animation = ` ${name} ${
          fontHeight / speed
        }s `;
        this.$refs.fontcontent.style.animationFillMode = "forwards";

        this.lineContent = "font-content ";
        this.titleCss = "main-title  minititle ";
        setTimeout(() => {
          this.linsrc = this.mainsrc;
        }, 1000);
      } else {
        this.titleCss = "main-title ";
        this.lineContent = "font-content ";
        setTimeout(() => {
          this.linsrc = this.Maxsrc;
        }, 1000);
      }
    }
  }
};
</script>
<style scoped>
.content-title {
  position: relative;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.main-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 1%;
  color: #3879c9;
  font-size: 0.9cm;
  font-weight: 350;
}
.img {
  margin: 1rem;
}
.content {
  height: 66%;
  overflow: hidden;
  /* display: inline-block; */
  white-space: pre-wrap;
  word-wrap: break-word;
}
.line {
  text-align: center;
  padding-bottom: 5px;
}
.font-content {
  width: 100%;
  /* display: inline-block; */
  text-align: left;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.content p {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.minititle {
  font-size: 0.7cm;
  font-weight: 350;
}
</style>
