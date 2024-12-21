<template>
  <div class="main_video_x28s">
    <div class="image">
      <!-- 左侧内容显示 -->
      <div class="content-Left">
        <!-- logo -->
        <div class="logo">
          <img style="width:5rem; height:5rem" :src="form.logoUrl" />
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
      <!-- 中间内容展示 -->
      <div class="content-Main">
        <div class="demo" style="height:100%">
          <video-player
            v-if="cuVideoType=='mp4'"
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>
          <span v-else>
            <h1>当前播放器不支持 {{cuVideoType}}格式的视频！</h1>
          </span>
        </div>
      </div>
    </div>
    <div v-if="detail.showBackBtn" class="back-btn">
      <el-button type="primary" @click="backList()">返回</el-button>
    </div>
  </div>
</template>
<script>
// 离开 zoomOutLeft box animated pulse
import { videoPlayer } from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

import '../../assets/css/style.css'
export default {
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    },
    previewData: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  components: {
    videoPlayer
  },
  data () {
    return {
      Maxsrc: require('../../assets/img/line.png'),
      mainsrc: require('../../assets/img/lineTop.png'),
      nursingName: '',
      form: {
        time: '',
        date: '',
        materialContent: ` `,
        materialName: ''
      },
      cuVideoType: '',
      playerOptions: {
        // 播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        // 如果true,浏览器准备好时开始回放。
        autoplay: true,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: 'auto',
        language: 'zh-CN',
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: '16:9',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [
          {
            // 类型
            type: 'video/mp4',
            // url地址
            src: []
          }
        ],
        // 你的封面地址
        poster: '',
        // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          // 全屏按钮
          fullscreenToggle: true
        }
      }
    }
  },
  mounted () {
    this.preview()
  },
  methods: {
      backList() {
          this.$emit('option-changed', 'index', this.detail)
      },
    preview () {
      this.form = this.detail.previewData
      // this.form.materialContent['url']
      this.playerOptions.sources[0].src = JSON.parse(
        this.form.materialContent
      ).url
      this.cuVideoType = this.playerOptions.sources[0].src.split('.')[1]
      // this.nursingName =  this.detail.previewData.materialName
      this.$nextTick(() => {
        // this.getHeight()
      })
    }
  }
}
</script>
<style lang="scss"  scoped>
.main_video_x28s {
  height: 67%;
  width: 99.9%;
  border: 1px solid #3bc0ee;
  .image {
    background: url('../../assets/img/viewbg.png') no-repeat;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .content-Left {
    width: 27%;
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
    width: 64%;
    display: flex;
    flex-direction: column;
    height: 100%;
    .demo {
      display: inline-block;
      width: 90%;
      height: 100%;
      text-align: center;
      line-height: 100px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      margin-right: 4px;
    }
    .demo:hover {
      display: block;
    }
  }
  .back-btn{
    width: 100%;
    text-align: center;
    height: 10vh;
    line-height: 10vh;
    .el-button{
      min-width: 70px;
      height: 38px;
      font-size: 14px;
      margin-left: 16px!important;
      border-radius: 2px!important;
    }
  }
}
</style>
