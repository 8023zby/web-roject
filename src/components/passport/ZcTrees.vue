<template>
    <div>
    <el-tree :data="data" :props="props" ref="tree"   :node-key="nodeKey"    @check="getCheckedKeys"
    show-checkbox  :default-checked-keys="Selecteds"></el-tree>

    </div>

</template>

<script>
export default {
  props: {
    nodeKey: {
      type: String,
      default () {
        return []
      }
    },
    Selecteds: {
      type: Array,
      default () {
        return []
      }
    },
    options: {
      type: Array,
      default () {
        return []
      }
    },
    // 树节点配置选项
    props: {
      type: Object,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      TreeData: []
    }
  },
  watch: {
    Selecteds () {
      this.TreeData = this.Selecteds
    }
  },
  computed: {
    data () {
      return this.options
    }
  },
  methods: {

    orgCheckChange (data, checked, indeterminate) {

    },
    /* 获取当前树的ID值 */
    getCheckedKeys (node, keys) {
      // this.$refs.tree.getCheckedKeys();
      let checkedKeys = keys.checkedKeys
      // let halfChecked = keys.halfCheckedKeys;
      // let checkArr = checkedKeys.concat(halfChecked);
      this.TreeData = checkedKeys
    }
  }
}
</script>
