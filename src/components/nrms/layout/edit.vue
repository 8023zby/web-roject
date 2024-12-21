<template>
  <el-container>
    <el-header :height="'48px'">
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="right-btn">
        <slot name="right_btn"></slot>
      </div>
    </el-header>
    <el-main ref="main-container">
      <!--<div ref="main-main">-->
        <slot name="main"></slot>
      <!--</div>-->
      <div class="footer-btn" ref="main-footer" v-if="$slots.footer_btn">
        <slot name="footer_btn"></slot>
      </div>
    </el-main>
    <el-footer v-if="$slots.footer">
      <solt name="footer"></solt>
    </el-footer>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot></slot>
  </el-container>
</template>

<script>
export default {
  name: 'add_edit_layout',
  mounted () {
    // this.resize()
  },
  updated () {
    // this.resize()
  },
  methods: {
    resize () {
      let container = this.$refs['main-container'].$el
      let ch = container.getBoundingClientRect().height
      let mh = this.$refs['main-main'].getBoundingClientRect().height
      let f = this.$refs['main-footer']
      if (f) {
        let fh = f.getBoundingClientRect().height

        // console.log((mh + fh), '>', ch)
        if ((mh + fh) > ch) {
          f.style.boxShadow = '0 0 6px 0 rgba(124, 124, 124, 0.3)'
        } else {
          f.style.boxShadow = 'none'
        }
      }

      // let io = new IntersectionObserver(entries => {
      //   console.log(entries[0].intersectionRatio)
      //   if (entries[0].intersectionRatio < 1) {
      //     f.style.boxShadow = '0 0 6px 0 rgba(124, 124, 124, 0.3)'
      //   } else {
      //     f.style.boxShadow = 'none'
      //   }
      // }, {})
      // io.observe(container.getElementsByTagName('div')[0])
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .el-container {
    height: 100%;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7f7f7;
    color: #333;
    font-size: 14px;
    padding-left: 30px;
  }
  .title {
    position: relative;
    &:before {
      content: ' ';
      width: 4px;
      height: 15px;
      border-radius: 2px;
      background-color: #13ce66;
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .el-main {
    padding: 0;
    position: relative;
  }

  .right-btn {
    /deep/ .el-button {
      border-radius: 2px !important;
      font-size: 14px !important;
      padding-top: 6px !important;
      padding-bottom: 6px !important;
      min-width: 78px;
    }
  }

  .footer-btn {
    text-align: center;
    padding-top: 12px;
    padding-bottom: 10px;

    /deep/ .el-button {
      font-size: 14px;
      border-radius: 2px !important;
      height: 38px;
      min-width: 78px;
    }
  }
</style>
