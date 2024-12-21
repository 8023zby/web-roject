<template>
  <div>
    <div style="display:none" class="audios" v-if="showAudio">
      <audio controls="controls" ref="audio">
        <source :src="src || ''" type="audio/mpeg" />
      </audio>
    </div>
    <div class="voice-bg">
      <img v-if="isPlaying" src="@/assets/wnms/img/audio/voice-play.gif" alt />

      <img v-else src="@/assets/wnms/img/audio/voice.png" alt />
      <span>{{ duration || 0 }}"</span>
    </div>
  </div>
</template>
<script>

export default {
  name: 'm-audio',
  props: {

    astop: {
      type: Boolean,
      default: true
    },
    src: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: "轻触播放"
    },
    showDuration: {
      type: Boolean,
      default: true
    },
    block: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: () => {
        return 0
      }
    }
  },
  data () {
    return {
      timer: null,
      isPlaying: false,
      currentTime: 0,
      showAudio: true
    }
  },
  mounted () {
    // "duration": "6413.333333",   文件总时间
    //  this.duration = 10
  },
  methods: {

    handlePlay (value) {
      const audio = this.$refs.audio
      if (!this.isPlaying) {
        audio.currentTime = 0
        audio.play()
        this.isPlaying = true
        this.watchEnd()
      } else {
        audio.pause()
        clearTimeout(this.timer)
        this.isPlaying = false
        audio.currentTime = 0
      }
    },
    closeAudio () {
      this.$refs.audio.pause()
      this.isPlaying = false
    },
    watchEnd () {
      const that = this
      this.timer = setTimeout(() => {
        that.isPlaying = false
        that.showAudio = false
        this.$nextTick(() => {
          that.showAudio = true
        })
      }, (that.duration + 1) * 1000)
    },

    beforeDestroy () {
      clearTimeout(this.timer)
    }
  },
  watch: {

  }
}
</script>
<style lang="scss" scoped>
.voice-bg {
  padding-left: 0.5vw;
  background: #1e87f0;
  width: 10rem;
  display: flex;
  align-items: center;
  border-radius: 2px;
  height: 34px;
  img {
    height: 1.3rem;
  }
  span {
    padding-left: 2rem;
    color: #fff;
  }
}
</style>
