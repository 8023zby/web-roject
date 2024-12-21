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
        <div>标签分类</div>
        <div class="btn">
          <label for="hsms_nurse_list_checked">
            <span class="hide_btn">
              <i class="el-icon-arrow-left"></i>
            </span>
          </label>
        </div>
      </div>
      <div class="list">
        <div class="btns">
          <el-button v-uni="'tongjibiaoqianbiaoqianfenlei_add'" type="primary" @click="nodeAdd(null)" v-checkAuth="'addStatisticsClass'">添加</el-button>
          <el-button v-uni="'tongjibiaoqianbiaoqianfenlei_sort'" type="primary" @click="nodeSort" v-checkAuth="'sortStatisticsClass'">排序</el-button>
        </div>
        <el-tree
          ref="classTree"
          :data="classTreeData"
          :props="defaultProps"
          show-checkbox
          check-on-click-node
          highlight-current
          @node-click="nodeClick"
          :node-key="nodeKey"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <!-- 名称: 新增节点增加class（is-new） -->
            <div class="comp-tr-node--name">{{ node.label }}</div>
            <!-- 按钮 -->
            <div v-if="data.classId" v-checkAuth="'editStatisticsClass,deleteStatisticsClass'">
              <!-- 编辑 -->
              <span v-uni:[nodeKey]="'tongjibiaoqianbiaoqianfenlei_edit'" :key="'edit' + nodeKey" style="margin:0 10px 0 0" @click.stop="nodeEdit(node, data)" v-checkAuth="'editStatisticsClass'">
                    <i class="el-icon-edit-outline"></i>
                  </span>
              <!-- 删除 -->
              <span v-uni:[nodeKey]="'tongjibiaoqianbiaoqianfenlei_delete'" :key="'delete' + nodeKey" @click.stop="nodeDel(node, data)" v-checkAuth="'deleteStatisticsClass'">
                    <i class="el-icon-delete"></i>
                  </span>
            </div>
          </div>
        </el-tree>
      </div>
    </div>

    <el-dialog
      title="排序"
      :visible="visible"
      :close-on-click-modal="false"
      :show-close="false"
      width="780px"
    >
      <class-sort @sortCallBack="sortCallBack"></class-sort>
      <div slot="footer">
        <el-button v-uni="'tongjibiaoqianbiaoqianfenleisort_cacel'" type="primary" @click="sortDialogClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moduleMixin from '../../../../assets/bnms/mixins/moduleMixin'
import { ApiClassifyManage } from '../../../../api/bnms'
import classSort from './Classify'
export default {
  name: 'ClassTree',
  mixins: [moduleMixin],
  data () {
    return {
      loading: false,
      nodeKey: 'classId',
      defaultProps: {
        label: 'className',
        id: 'id'
      },
      classTreeData: [],
      curNodeClassId: '',
      searchFrom: {
        labelType: '101'
      },
      visible: false,
      hasOperateSuccess: false
    }
  },
  components: {
    'class-sort': classSort
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      ApiClassifyManage.select(this.searchFrom)
        .then(res => {
          let data = res.data || []
          data.unshift({ classId: '', className: '全部' })
          this.classTreeData = data
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    nodeAdd (data) {
      let opts = {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入',
        inputValidator: function (value) {
          if (!value || value === '') {
            return '分类名称不能为空！'
          }
          if (value.length > 20) {
            return '最多20个字符!'
          }
        },
        showClose: false
      }
      let title = '添加'
      let _data = {
        labelType: this.searchFrom.labelType,
        className: ''
      }
      if (data) {
        title = '编辑'
        opts['inputValue'] = '' + data.className
        Object.assign(_data, data)
      }

      this.$prompt('分类名称:', title, opts).then(({ value }) => {
        _data.className = value
        ApiClassifyManage.save(_data)
          .then(() => {
            this.getData()
            this.$message.success('添加成功！')
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    nodeSort () {
      this.visible = true
    },
    nodeEdit (node, data) {
      this.nodeAdd(data)
    },
    nodeDel (node, data) {
      this.$confirm(' 确认要进行删除？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiClassifyManage.delete({ classId: data.classId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getData()
            if (this.curNodeClassId === data.classId) {
              this.curNodeClassId = ''
              this.nodeClick({ classId: '' })
            }
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    nodeClick (data) {
      this.$refs.classTree.setCheckedKeys([data.classId || ''])
      this.curNodeClassId = data.classId
      this.$emit('changed', data.classId)
    },
    sortCallBack () {
      this.hasOperateSuccess = true
    },
    sortDialogClose () {
      this.visible = false
      this.hasOperateSuccess && this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../assets/bnms/css/self_common";

  /deep/ .el-tree-node__expand-icon {
    display: none;
  }
  /deep/ .cell {
    cursor: default !important;
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

  /deep/ .el-tree-node .el-checkbox {
    display: none;
  }
  /deep/ .el-tree-node__content {
    align-items: center !important;
  }
  /deep/ .is-checked + .custom-tree-node {
    background-color: #f0f7ff;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding: 0 10px;

    i {
      color: #1E87F0;
    }
  }

  /deep/ .el-dialog {
    .el-dialog__body {
      padding: 0 !important;
    }
  }
</style>
