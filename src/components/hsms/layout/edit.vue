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
      <div ref="main-main">
        <slot name="main"></slot>
      </div>
      <div class="footer-btn" ref="main-footer">
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
    // 底部按钮在内容多时固定到底部
    this.$nextTick(function () {
      let container = this.$refs['main-container'].$el
      let ch = container.getBoundingClientRect().height
      let h = this.$refs['main-main'].getBoundingClientRect().height
      if (h - 64 > ch) { // 58 + 6 是底部的高度
        container.classList.add('fixed')
      }
    })
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
    padding-top: 50px;
    padding-bottom: 30px;

    /deep/ .el-button {
      font-size: 14px;
      border-radius: 2px !important;
      height: 38px;
      min-width: 78px;
    }
  }

  // 底部按钮在内容多时固定到底部
  .fixed {
    display: flex;
    flex-direction: column;

    > div:first-child {
      flex: 1;
      overflow: auto;
    }

    .footer-btn {
      padding: 10px 0;
      margin-top: 6px;
      box-shadow: 0 0 6px 0 rgba(124, 124, 124, 0.3);
    }
  }
</style>
