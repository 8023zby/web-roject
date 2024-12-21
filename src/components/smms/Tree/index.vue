
  /**
    * 通用树形组件
    * @module 组件存放位置
    * @components  Tree
    * @desc 通用的组件调用
    * @author 翟冲
    * @date 2019年05月30日10:22:43
    * @param {Object} [title]    - 参数说明
    * @param {Array} [tdata] - 后台传入的数据 格式为树形 示例
    * @param {Object} [defaultProps] - 数据格式参数
    * @param {Boolean} [showchek] - 节点是否被选 true/false
    * @param {String} [id] - 选择节点必须传入ID
    * @param {Function} [render] - 调用时在树后边添加按钮 例如 编辑 删除
    * @param {Boolean}[isClick] 是否点击当前树 获取的数据给父组件
    * @example 调用示例
    *  <tree :tdata="tdata" :default-props="defaultProps" :tableData="tableData" :showchek='true'></tree>
  **/

<template>
  <div>
    <el-tree
      ref="tree"
      :show-checkbox="showchek"
      :data="tdata"
      :props="defaultProps"
      :node-key="id"
      :check-strictly="true"
      auto-expand-parent
      :render-content="render"
      :default-checked-keys="chekekeys"
      :default-expanded-keys="defaultkeys"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check-change="handleCheckChange"
    />
  </div>
</template>
<script>
export default {
  props: {
    tdata: {
      type: Array,
      default: () => {}
    },
    defaultProps: {
      type: Object,
      default: () => {}
    },
    showchek: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    id: {
      type: String,
      default: () => {
        return 'id'
      }
    },
    isClick: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    render: {
      type: Function,
      default: (h, { node, data, store }) => {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        )
      }
    },
    chekekeys: {
      type: Array,
      default: () => {}
    },
    filterText: {
      type: String,
      default: () => {}
    },
    defaultkeys: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      selectOrg: {
        orgsid: []
      },
      editCheckId: ''
    }
  },

  mounted () {},
  methods: {
    handleNodeClick (item, node, self) {
      this.nodeId = item.id
      if (this.isClick) {
        this.$emit('listClickNodeId', item)
      }
    },
    reset () {
      this.editCheckId = ''
      this.$refs.tree.setCheckedKeys([])
    },
    handleCheckChange (data, checked, indeterminate) {
      if (checked) {
        this.editCheckId = data.id
        this.$refs.tree.setCheckedKeys([data.id])
        // setCurrentNode 设置某个节点的当前选中状态,
        this.$refs.tree.setCurrentNode(data)
      } else {
        if (this.editCheckId === data.id) {
          // 点击已选中复选框，保证至少一个选中
          this.$refs.tree.setCheckedKeys([data.id])
          this.$refs.tree.setCurrentNode(data)
        }
      }
    },
    /*  定位到当前树 */
    filterName (val) {
      this.$refs.tree.filter(val)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.categoryName.indexOf(value) !== -1
    }
  }
}
</script>
