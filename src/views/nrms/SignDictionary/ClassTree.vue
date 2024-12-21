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
        <div>体征项分类</div>
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
          <el-button v-uni="'tizhengxiang_fenlei_add'" type="primary" @click="nodeAdd(null)" v-checkAuth="'addSignItemClass'">添加</el-button>
          <el-button v-uni="'tizhengxiang_fenlei_sort'" type="primary" @click="nodeSort" v-checkAuth="'sortSignItemClass'">排序</el-button>
        </div>
        <el-tree
          ref="classTree"
          :data="classTreeData"
          :props="defaultProps"
          default-expand-all
          highlight-current
          @node-click="nodeClick"
          :node-key="nodeKey"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <!-- 名称: 新增节点增加class（is-new） -->
            <div class="comp-tr-node--name">{{ node.label }}</div>
            <!-- 按钮 -->
            <div v-if="data.signClassifyId !=='' && checkAuth('editSignItemClass,deleteSignItemClass')">
              <!-- 编辑 -->
              <span v-uni:[nodeKey]="'tizhengxiang_fenlei_edit'" :key="'edit' + nodeKey" style="margin:0 10px 0 0" @click="nodeEdit(node, data)" v-checkAuth="'editSignItemClass'">
                    <i class="el-icon-edit-outline"></i>
                  </span>
              <!-- 删除 -->
              <span v-uni:[nodeKey]="'tizhengxiang_fenlei_delete'" :key="'delete' + nodeKey" @click="nodeDel(node, data)" v-checkAuth="'deleteSignItemClass'">
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
      width="600px"
    >
      <class-sort @sortCallBack="sortCallBack"></class-sort>
      <div slot="footer">
        <el-button type="primary" @click="sortDialogClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moduleMixin from '../../../assets/nrms/mixins/moduleMixin'
import { ApiSignClassify } from '../../../api/nrms'
import classSort from './SettingItem'
export default {
  name: 'ClassTree',
  mixins: [moduleMixin],
  data () {
    return {
      loading: false,
      nodeKey: 'signClassifyId',
      defaultProps: {
        label: 'signClassifyName',
        id: 'signClassifyId'
      },
      classTreeData: [],
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
    getData (s) {
      this.loading = true
      ApiSignClassify.select(this.searchFrom)
        .then(res => {
          let data = res.data || []
          data.unshift({ signClassifyId: '', signClassifyName: '全部' })
          this.classTreeData = data
          this.loading = false
          if (s) {
            this.nodeClick({ signClassifyId: '', signClassifyName: '全部' })
            this.$nextTick(function () {
              this.$refs.classTree.setCheckedKeys([''])
            })
          }
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
        signClassifyName: ''
      }
      if (data) {
        title = '编辑'
        opts['inputValue'] = '' + data.signClassifyName
        Object.assign(_data, data)
      }

      this.$prompt('分类名称:', title, opts).then(({ value }) => {
        _data.signClassifyName = value
        ApiSignClassify.save(_data)
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
        ApiSignClassify.delete({ signClassifyId: data.signClassifyId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getData(1)
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    nodeClick (data) {
      this.$emit('changed', data.signClassifyId)
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
  @import "../../../assets/nrms/css/self_common";

  /deep/ .el-tree-node__expand-icon:before {
    content: '';
  }
  /deep/ .cell {
    cursor: default !important;
  }

  /* 覆盖element css */
  .nrms_nurse_list /deep/ .el-table th > .cell {
    font-size: 14px;
    color: initial;
    font-weight: 400;
  }

  .nrms_nurse_list /deep/ .el-table td > .cell {
    padding: 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nrms_nurse_list /deep/ .el-tabs__item {
    padding: 0 14px !important;
    max-width: initial;
    min-width: initial;
    font-size: 14px;
  }

  .nrms_nurse_list /deep/ .el-tabs__item.is-active {
    max-width: initial;
    min-width: initial;
  }

  .nrms_nurse_list /deep/ .el-table {
    font-size: 14px;
  }

  .nrms_patient_list /deep/ .el-table td, .el-table th {
    padding: 6px 0;
  }

  .nrms_nurse_list /deep/ .el-table th {
    background-color: #F4F4F4;
  }

  .nrms_nurse_list /deep/ .el-table td, .el-table th.is-leaf {
    border: none !important;
  }

  .nrms_nurse_list /deep/ .el-table--border::after, .el-table--group::after {
    width: 0;
  }

  .nrms_nurse_list /deep/ .el-table::before {
    height: 0;
  }

  .nrms_nurse_list .list /deep/ .el-table__body tr.current-row > td {
    color: #409EFF;
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

  /deep/ .el-tree-node__content {
    align-items: center !important;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 10px;

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
