<template>
  <div class="video_main" style="height:100%;width:100%;">
    <div class="close_div">
      <!-- <img @click="close_btn" v-if="false" src="../../../assets/smms/img/shopPing/close.png" alt /> -->
    </div>
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      v-if="isPay"
      :options="playerOptions"
    ></video-player>
  </div>
</template>
<script>
import { videoPlayer } from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

export default {

  components: {
    videoPlayer
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
  },
  data () {
    return {
      isPay: true,
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
            src: ''
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
          fullscreenToggle: false
        }
      }
    }
  },
  mounted () {
    //	this.preview()
  },
  methods: {
    preview (v) {
      this.isPay = true
      this.playerOptions.sources[0].src = v

    },

    close_btn () {
      this.isPay = false
      this.$emit('video_close', false)
    },

    onPlayerPause (player) {
      console.log('player pause!', player)
    }
  }
}
</script>
<style scoped>
img {
  width: 50px;
  height: 50px;
  z-index: 10000;
  position: fixed;
  top: 10vh;
  right: 8vw;
  float: left;
}
</style>
