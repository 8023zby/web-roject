<template>
  <div style="position: relative; height: 100%; background-color: #fff">
    <input type="checkbox" id="hsms_nurse_list_checked" style="display: none">
    <label for="hsms_nurse_list_checked">
      <span class="show_btn">
        <i class="el-icon-arrow-right"></i>
      </span>
    </label>
    <div class="nrms_nurse_list">
      <div class="header">
        <div>表单分类</div>
        <div class="btn">
          <label for="hsms_nurse_list_checked">
            <span class="hide_btn">
              <i class="el-icon-arrow-left"></i>
            </span>
          </label>
        </div>
      </div>
      <div class="list">
        <el-tree
          ref="classTree"
          :data="classTreeData"
          expand-on-click-node
          default-expand-all
          highlight-current
          :node-key="'id'"
          @node-click="nodeClick"
        ></el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { EFormTypeText, EFormType } from '../../../assets/nrms/enum/formManage'
import { ExchangeEFormTypeName, ExcludeEFormType } from './temperatureConfig'
export default {
  name: 'ClassTree',
  data () {
    return {
      loading: false,
      classTreeData: []
    }
  },
  created () {
    this.parseTreeData()
  },
  methods: {
    parseTreeData () {
      let data = []
      Object.keys(EFormTypeText).forEach((key) => {
        // 不显示表单分类的类型
        if (ExcludeEFormType.indexOf(key) >= 0) {
          return
        }
        data.push({
          id: key,
          label: ExchangeEFormTypeName.get(key) || EFormTypeText[key]
        })
      })
      // data.push({
      //   id: 99,
      //   label: '评估表单'
      // })

      this.classTreeData = data

      this.nodeClick(data[0])
      this.$nextTick(function () {
        // 高亮选中的节点
        this.$refs.classTree.setCurrentKey(data[0].id)
      })
    },
    nodeClick (data) {
      this.$emit('changed', data)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/nrms/css/self_common";
  /deep/ .el-tree-node__expand-icon:before {
    content: '';
  }

  /deep/ .el-tree-node__content {
    align-items: center;
  }

  #hsms_nurse_list_checked:checked ~ .nrms_nurse_list {
    width: 0;
    border: none;

    > div {
      display: none;
    }
  }

  #hsms_nurse_list_checked:checked ~ label .show_btn {
    display: inline-block;
  }

  .show_btn {
    display: none;
    position: absolute;
    top: 6px;
    left: -1px;
    border: 1px solid;
    line-height: 13px;
    border-left: none;
    background-color: #fff;
    padding: 6px 3px;
    text-align: center;
    color: #409EFF;
    cursor: pointer;
    z-index: 9;
  }

  .nrms_nurse_list {
    height: 100%;
    width: 230px;
    border-right: 1px solid #e6e6e6;
    transition: width .25s;
    display: flex;
    flex-direction: column;

    .header {
      color: #409EFF;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e6e6e6;

      > div:first-child {
        flex: 1;
        font-size: 16px;
        padding: 5px;
      }
    }

    .btn {
      label {
        display: inline-block;
        padding: 3px 8px;
        text-align: center;
        line-height: 2;
        cursor: pointer;
        border-left: 1px solid #e6e6e6;
        box-shadow: 0px 0px 4px 0px rgba(226, 226, 226, 1);
      }

      .show_btn, hide_btn {

      }
    }

    .list {
      flex: 1;
      overflow: auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      height: 100%;
      // 动作按钮
      .btns {
        padding: 10px;
        display: flex;
        justify-content: space-between;

        /deep/ .el-button {
          width: 70px;
          height: 28px;
          line-height: 28px;
          font-size: 14px;
          padding: 0;
          text-align: center;
          float: right;
        }
      }
    }
  }
</style>
