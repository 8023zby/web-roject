<!--宣教标签使用树结构-->
<template>
  <div v-loading="isLoading" class="comp-tree">
    <el-button
      class="comp-tr-top"
      type="primary"
      size="small"
      v-if="false"
      @click="handleAddTop"
    >添加顶级节点</el-button>
    <!-- tree -->
    <el-tree
      ref="SlotTree"
      :data="setTree"
      :props="defaultProps"
      :expand-on-click-node="false"
      :default-expanded-keys="defaultkeys"
      @node-click="handleNodeClick"
      highlight-current
      :node-key="NODE_KEY"
    >
      <div class="comp-tr-node" slot-scope="{ node, data }">

        <!-- 编辑状态 -->
        <template v-if="node.isEdit">
          <el-input
            v-model="data.name"
            autofocus
            size="mini"
            :ref="'slotTreeInput'+data[NODE_KEY]"
            @blur.stop="handleInput(node, data)"
            @keyup.enter.native="handleInput(node, data)"
          ></el-input>
        </template>

        <!-- 非编辑状态 -->
        <template v-else>
          <!-- 名称： 新增节点增加class（is-new） -->
          <span
            :class="[data[NODE_KEY] < NODE_ID_START ? 'is-new' : '', 'comp-tr-node--name']"
          >{{ node.label }}</span>

          <!-- 按钮 -->

          <span class="comp-tr-node--btns">
            <!-- 新增 -->
            <span  style="margin:0 10px 0 0" @click="showdialog(node, data,'Add')" v-if="node.level<MAX_LEVEL">
              <i class="el-icon-plus"></i>
            </span>
            <template v-if="saveFirstIds.indexOf(data[NODE_KEY])<0">
              <!-- 编辑 -->
              <span style="margin:0 10px 0 0" @click="showdialog(node, data,'Edit')">
                <i class="el-icon-edit"></i>
              </span>
              <!-- 删除 -->
              <span  @click="handleDelete(node, data)">
                <i class="el-icon-delete"></i>
              </span>
            </template>
          </span>
        </template>
      </div>
    </el-tree>
        <!--添加树-->
    <el-dialog
      :title="treeForm.T === 'Add' ? '添加分类' : '编辑分类'"
      :visible.sync="dialogFormTreeVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :show-close="false"
      width="30%">
      <el-form
        ref="treeForm"
        :rules="rules"
        :model="treeForm"
        style="text-align:  center"
        :role="roles">
        <el-form-item label="分类名称:" label-width="100px" prop="categoryName">
          <el-input v-model.trim="treeForm.categoryName" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset('treeForm')">取 消</el-button>
        <el-button type="primary" @click=" treeForm.T ==='Add'? handleAdd():handleEdit()">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import * as lableManageApi from '@/api/hpms/eduCation/lableManage'
import BaseQueryPageForm from '@/views/hpms/common/BaseQueryPageForm'

export default {
  name: 'component-tree',
  mixins: [BaseQueryPageForm],
  props: {
    setTree: {
      type: Array,
      default: () => {}
    },
    saveFirstIds: {
      type: Array,
      default: () => {}
    },
    defaultProps: {
      type: Object,
      default: () => {}
    },
    defaultkeys: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      isLoading: false, // 是否加载
      NODE_KEY: 'id', // id对应字段
      MAX_LEVEL: 4, // 设定最大层级
      NODE_ID_START: 0, // 新增节点id，逐次递减
      startId: null,
      initParam: {
        // 新增参数
        categoryName: '新增节点',
        parentId: 0,
        childsList: []
      },
      dialogFormTreeVisible: false,
      treeForm: {
        categoryName: '',
        id: '',
        T: 'Add'
      },
      cudata: {
        _node: [],
        _data: []
      },
      roles: { },
      rules: {
        categoryName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    // 初始值
    this.startId = this.NODE_ID_START
  },
  methods: {
    handleNodeClick (item, node, self) {
      this.nodeId = item.id
      this.$emit('listClickNodeId', item)
    },
    // 重置
    reset () {
      this.$nextTick(() => {
        this.$refs.treeForm.resetFields()
        this.dialogFormTreeVisible = false
      })
    },

    handleDelete (_node, _data) {
      const _this = this
      // 删除节点
      // 判断是否存在子节点
      if (_data.childsList && _data.childsList.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(res => {
            lableManageApi.getEdTagCategory({ parentId: _data.parentId, categoryName: _data.categoryName , id: _data.id}).then(res => {
              _this.IsSuccessCommon(res, () => {
                lableManageApi.DelLable(res.data.id).then(res => {
                  if (res.status === 200) {
                    this.$message.success('删除成功！')
                    this.$refs.SlotTree.remove(_data)
                    this.$emit('refreshList')
                  }else{
                    this.$message.error(res.desc)
                  }
                })
              }, false)
            })
            this.$nextTick(() => {
              /*if (this.$refs.SlotTree) {
                this.$refs.SlotTree.remove(_data)
                this.$message.success('删除成功！')
              }*/
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      }
    },
    handleEdit () {
      this.$refs.treeForm.validate((valid) => {
        if (!valid) return false

        let _node = this.cudata._node
        let _data = this.cudata._data
        // 编辑节点
        _data.categoryName = this.treeForm.categoryName
        _node.data.categoryName = this.treeForm.categoryName
        this.submitTrueForm('treeForm')
      })
    },
    // 弹窗
    showdialog (_node, _data, T) {
      const _this = this
      if (T === 'Edit') {
        lableManageApi.getEdTagCategory({ parentId: _data.parentId, categoryName: _data.categoryName , id: _data.id}).then(res => {
          _this.IsSuccessCommon(res, () => {
            _this.treeForm = { ...res.data }

            _this.treeForm.T = T
            _this.dialogFormTreeVisible = true
            //   清空
            _this.cudata._node = _node
            _this.cudata._data = _data
          }, false)
        })
      } else {
        if (_node.level >= _this.MAX_LEVEL) {
          _this.$message.warning('当前已达到' + this.MAX_LEVEL + '级，无法新增！')
          return false
        }
        _this.treeForm = {
          categoryName: '',
          id: '',
          T: 'Add'
        }
        // this.reset()

        _this.treeForm.T = T
        _this.dialogFormTreeVisible = true
        //   清空
        _this.cudata._node = _node
        _this.cudata._data = _data
      }
    },
    handleAdd () {
      this.$refs.treeForm.validate((valid) => {
        if (!valid) return false

        let _node = this.cudata._node
        let _data = this.cudata._data
        let obj = JSON.parse(JSON.stringify(this.treeForm)) // copy参数
        obj.parentId = _data[this.NODE_KEY] // 父id
        obj[this.NODE_KEY] = --this.startId // 节点id：逐次递减id
        // 判断字段是否存在
        if (!_data.childsList) {
          this.$set(_data, 'childsList', [])
        }
        let isRepeat = _data.childsList.find(i => i.categoryName === obj.categoryName)
        if (!isRepeat) {
          // 新增数据
          // _data.childsList.push(obj)
          // 展开节点
          if (!_node.expanded) {
            _node.expanded = true
          }
          this.treeForm = { ...obj }
          //  提交到后台
          this.submitTrueForm('treeForm')
        } else {
          this.$message({
            type: 'warning',
            message: '不允许有重复数据添加'
          })
        }
      })
    },
    /* 提交树的数据 */
    submitTrueForm (formName) {
      const _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          /*  添加 */
          let lable = _this.treeForm.T === 'Add' ? 'AddLable' : 'EditLable'
          lableManageApi[lable](_this.treeForm).then(res => {
            _this.IsSuccessCommon(res, () => {
              this.dialogFormTreeVisible = false
              this.$emit('getLablelist')
            }, true)
          })
        }
      })
    },
    handleAddTop () {
      // 添加顶部节点
      let obj = JSON.parse(JSON.stringify(this.initParam)) // copy参数
      obj[this.NODE_KEY] = --this.startId // 节点id：逐次递减id
      this.setTree.push(obj)
    }
  }
}
</script>
<style >
 .show-btns, .comp-tree .el-tree-node__content:hover .comp-tr-node--btns, .comp-tree .is-current > .el-tree-node__content .comp-tr-node--btns {
  opacity: 1;
}
.comp-tree {
  width: 100%;
  overflow: auto;
  max-height: 80vh;
}
.comp-tree .comp-tr-top {
  width: 100px;
  margin-bottom: 2em;
}
.comp-tree .comp-tr-node .comp-tr-node--name {
  display: inline-block;
  line-height: 40px;
  min-height: 40px;
}
.comp-tree .comp-tr-node .comp-tr-node--name.is-new {
  font-weight: bold;
}
.comp-tree .comp-tr-node .comp-tr-node--btns {
  margin-left: 20px;
  opacity: 0;
  transition: opacity 0.1s;
}
.comp-tree .comp-tr-node .comp-tr-node--btns .el-button {
  transform: scale(0.8);
}
.comp-tree .comp-tr-node .comp-tr-node--btns .el-button + .el-button {
  margin-left: -1px;
}
</style>
