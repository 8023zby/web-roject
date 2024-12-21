<template>
  <div class="passport-alert">
    <el-alert
      title=""
      type="warning"
      center
      @close="closeAlert"
      class="passport-login-alert"
      show-icon>
      <slot name="title">
        检测到系统与当前浏览器存在兼容性问题，请尝试使用<span class="passport-login-chrome" @click="openChrome">Chrome浏览器</span>打开。
      </slot>
    </el-alert>
  </div>
</template>

<script>
export default {
  name: 'notice-alert',
  data () {
    return {}
  },
  created () {},
  methods: {
    // 打开chrome地址
    openChrome () {
      window.open('https://www.google.cn/chrome/')
    },
    closeAlert () {
      localStorage.setItem('alertStatus', '2')
    }
  }
}
</script>

<style lang="scss">
  .passport-alert{
    .passport-login-alert{
      position: absolute;
      top: 0;
      z-index: 999;
    }
    .passport-login-chrome{
      color: #FFB656;
      cursor: pointer;
    }
    .el-alert{
      border-radius: 0 !important;
      background: #FFE9CA;
      height: 50px;
    }
    .el-alert__icon{
      font-size: 26px;
      color: #FF9F2D;
    }
    .el-alert__closebtn{
      font-size: 24px;
      color: #FFA63D !important;
    }
    .el-alert__description{
      margin: 0px !important;
      color: #333333 !important;
      font-size: 16px;
    }
  }
</style>
