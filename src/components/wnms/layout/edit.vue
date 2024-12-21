<template>
  <el-container>
    <!-- <el-header :height="'48px'">
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="right-btn">
        <slot name="right_btn"></slot>
      </div>
    </el-header> -->
    <el-main>
      <slot name="main"></slot>
      <div class="footer-btn">
        <slot name="footer_btn"></slot>
      </div>
    </el-main>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot></slot>
  </el-container>
</template>

<script>
export default {
  name: 'add_edit_layout'

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
  // .title {
  //   position: relative;
  //   // &:before {
  //   //   content: ' ';
  //   //   width: 4px;
  //   //   height: 15px;
  //   //   border-radius: 2px;
  //   //   background-color: #13ce66;
  //   //   position: absolute;
  //   //   left: -12px;
  //   //   top: 50%;
  //   //   transform: translateY(-50%);
  //   // }
  // }

  .el-main {
    padding: 0;
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
