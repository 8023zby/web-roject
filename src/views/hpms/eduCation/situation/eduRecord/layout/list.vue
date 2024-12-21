<template>
  <el-container>
    <el-header height="auto">
      <div class="query-container" v-if="$slots.query">
        <div class="query-items-container" ref="query_form"
             :class="{'show-all': query_show_btn && query_up_btn, 'query-items-container2': query_show_btn}">
          <slot name="query"></slot>
        </div>
        <i class="el-icon-caret-bottom query-show-btn" v-if="query_show_btn" :class="{'is-show': query_up_btn}"
           @click="queryUpBtnHandler"></i>
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
        },
        query_up_btn: false,
        query_show_btn: false
      };
    },
    created() {
      this.$nextTick(function () {
        if(this.$refs.query_form) {
          let query_form = this.$refs.query_form.querySelector('.el-form');
          if (query_form) {
            this.query_show_btn = query_form.getBoundingClientRect().height > 60;
          } else {
            this.query_show_btn = false;
          }
        }
      });
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

      &:not(.tool-container) {
        padding-right: 40px;
        min-height: 54px;
      }

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

      /* 条件容器 */
      .query-items-container {
        box-sizing: border-box;
        padding: 10px 30px 10px 10px;
        background-color: #fff;
        position: absolute;
        height: 54px;
        width: 100%;
        overflow: hidden;
        z-index: 4;
      }

      .query-items-container2 {
        &:hover, &.show-all {
          height: auto;
          max-height: 200px;
          overflow: visible;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
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
    border-top: 1px solid #E4E7ED;
  }
</style>
