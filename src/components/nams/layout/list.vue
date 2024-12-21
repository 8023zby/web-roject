<template>
  <el-container>
    <el-header height="auto">
      <div class="query-container" v-if="$slots.query">
        <slot name="query"></slot>
      </div>
      <hr style="background-color: #E4E7ED; margin: 0; height: 1px; border: 0" v-if="$slots.query && ($slots.left_btn || $slots.right_btn)"/>
      <div class="tool-container">
        <div class="left">
          <slot name="left_btn"></slot>
        </div>
        <div class="right">
          <slot name="right_btn"></slot>
        </div>
      </div>
    </el-header>
    <el-main>
      <slot name="main"></slot>
    </el-main>
    <el-footer height="auto">
      <slot name="footer" :page="page"></slot>
    </el-footer>
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot></slot>
  </el-container>
</template>

<script>
  export default {
    name: "list_layout",
    data() {
      return {
        page: {
          sizes: [10, 30, 50, 100],
          size: 10,
          layout: "total, sizes, prev, pager, next, jumper"
        }
      };
    },
    created() {
    },
    methods: {
      queryUpBtnHandler() {
        this.query_up_btn = !this.query_up_btn;
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .el-container {
    height: 100%;
  }
  .el-header {
    padding: 0;

    /* 查询条件容器 */
    > div:first-child {
      position: relative;

      /* 三角 */
      .query-show-btn {
        color: #1b7ad8;
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 14px;
        transition: transform 0.3s;
        transform: rotateZ(0);
        z-index: 5;

        &.is-show {
          transition: transform 0.3s;
          transform: rotateZ(180deg);
        }
      }
    }

    /*按钮容器*/
    > div:last-child {
      display: flex;

      > div:first-child {
        flex: 3;
        text-align: left;

        .el-button:first-child {
          margin-right: 20px;
        }
      }

      > div:last-child {
        flex: 4;
        text-align: right;

        .el-button:last-child {
          margin-left: 20px;
        }
      }
    }
  }

  .el-main {
    padding: 0;
    min-height: 0;
    height: 0;
    overflow: hidden;
    /deep/ > div {
      height: 100%;
    }
  }

  .el-footer {
    text-align: center;
    /*border-top: 1px solid #E4E7ED;*/
  }
</style>
