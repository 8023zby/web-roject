<template>
  <div class="container">
    <div class="tree" v-for="item1 in tree_data" :key="item1.id">
      <dl class="one" :class="{close: !item1.show }" @click="treeShowHide(item1)">
        <i class="el-icon-caret-bottom"></i>
       {{item1.label}}
      </dl>
      <el-collapse-transition>
        <div class="group" v-show="item1.show">
          <template v-for="(item2, index) in item1.children">
            <dl class="two" :class="{'two-last': index + 1 == item1.children.length, close: !item2.show}" @click="treeShowHide(item2)" :key="item2.id + 1">
              <i class="el-icon-caret-bottom"></i>
              {{item2.label}}
              <span></span>
            </dl>
            <el-collapse-transition>
              <div class="group" :key="item2.id + 2" v-show="item2.show">
                <dl class="three" @click="$emit('node-click', item3)" v-for="item3 in item2.children" :key="item3.id">
                  <div class="ellipsis">{{item3.label}}</div>
                  <span></span>
                </dl>
              </div>
            </el-collapse-transition>
          </template>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: "focus",
    props: ['data', 'extend'],
    data() {
      return {
        tree_data: []
      };
    },
    watch: {
      data (data) {
        let _data = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < _data.length; i++) {
          _data[i].show = false;
          if (_data[i]['deptId'] === this.extend) {
            _data[i].show = true;
          }
          if (_data[i]['children'] && _data[i]['children'].length > 0) {
            for (let j = 0; j < _data[i]['children'].length; j++) {
              _data[i]['children'][j].show = true;
            }
          }
        }
        this.tree_data = _data;
      }
    },
    created() {},
    methods: {
      treeShowHide(e) {
        e.show = !e.show;
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    background-color: transparent;
  }

  dl {
    margin: 0;
    padding: 11px 0;
    font-size: 16px;
    position: relative;
    cursor: pointer;

    .el-icon-caret-bottom {
      color: #1E87F0;
      font-size: 20px;
    }

    &.close {
      .el-icon-caret-bottom {
        transform: rotate(-90deg);
      }
    }
  }

  .one {
    padding-left: 26px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &:before {
      content: " ";
      border-left: 1px #1E87F0 dashed;
      position: absolute;
      left: 36px;
      bottom: 0;
      height: 100%;
    }
  }

  .one:last-child {
    &:before {
      height: 50%;
      top: 0;
      bottom: auto;
    }
  }

  .two {
    padding-left: 66px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    .el-icon-caret-bottom {
      color: #FF9D00;
    }

    span {
      position: absolute;
      left: 36px;
      top: 0;
      height: 100%;
      width: 0;
      border-left: 1px #1E87F0 dashed;
    }

    &:before {
      content: " ";
      border-top: 1px #1E87F0 dashed;
      position: absolute;
      left: 36px;
      top: 21px;
      width: 34px;
    }

    &:after {
      content: " ";
      border-left: 1px #FF9D00 dashed;
      position: absolute;
      left: 76px;
      bottom: 0;
      height: 50%;
      width: 0;
      z-index: -1;
    }

    &.close {
      &:after {
        display: none;
      }
    }
  }

  .three {
    position: relative;
    padding-left: 116px;
    color: #666666;
    div.ellipsis{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    span {
      position: absolute;
      left: 36px;
      top: 0;
      height: 49px;
      width: 0;
      border-left: 1px #1E87F0 dashed;
    }

    &:before {
      content: " ";
      position: absolute;
      left: 76px;
      bottom: 20px;
      height: 40px;
      width: 0;
      border-left: 1px #FF9D00 dashed;
    }

    &:after {
      content: " ";
      border-top: 1px #FF9D00 dashed;
      position: absolute;
      left: 76px;
      top: 24px;
      width: 33px;
    }
  }

  .tree {

  }

  .tree:first-child {
    .one {
      &:before {
        height: 50%;
      }
    }
    .close {
      &:before {
        transition: height .25s;
        height: 50%;
        bottom: 0
      }
  }
  }
  /*根据UI要求，内容收起时 多个一级节点虚线连接*/
  .tree:last-child {
    .one.close {
      &:before {
        transition: height .25s;
        height: 50%;
        top: 0
      }
    }
  }

  .tree:last-child {
    > .group {

      .two-last {
        span {
          height: 50%;
        }
      }

      > .group:last-child {
        .three {
          span {
            display: none;
          }
        }
      }
    }
  }
</style>
