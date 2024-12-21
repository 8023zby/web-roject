<template>
  <div class="pad-tree">
    <div class="pad-input-div">
      <i class="el-icon-search pad-icon"></i>
      <input class="pad-input" v-model="filterText"/>
    </div>
    <el-tree
      :data="srcData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      default-expand-all
      ref="tree"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: 'check-dept',
  props: ['srcData'],
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  data () {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'deptName',
        id: 'dept'
      },
      deptId: ''
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.deptName.indexOf(value) !== -1
    },
    handleNodeClick (item) {
      let obj = event.target
      let tagName = obj.tagName
      if (tagName === 'DIV') {
        return false
      }
      let arr = document.getElementsByClassName('selected')
      for (let i = 0; i < arr.length; i++) {
        arr[i].classList.remove('selected')
      }
      obj.classList.add('selected')
      this.deptId = item.deptId
    }
  }
}
</script>
<style>
  :focus {
    outline: none !important;
  }
</style>
<style scoped lang="scss">
.pad-tree /deep/{
  box-sizing: border-box;
  padding-left: 218px;
  padding-top: 30px;
  .selected{
    box-sizing: border-box;
    background: #3F95FF;
    border-radius: 20px;
    color: #ffffff !important;
  }
  .el-tree{
    .el-tree-node__content{
      background: #ffffff;
      height: 42px;
    }
    .el-tree-node__expand-icon{
      color: #3F95FF;
    }
    .is-leaf{
      color:#ffffff;
    }
    .el-tree-node__content>.el-tree-node__expand-icon {
      padding-right: 0px;
      font-size: 16px;
    }
    .el-tree-node__content{
      margin-top: 20px;
      .is-leaf{
        padding: 0px 20px;
      }
      .el-tree-node__label{
        font-size: 24px;
        color: #595959;
        padding: 5px 12px;
      }
    }
  }
  .pad-input-div{
    position: absolute;
    z-index: 999;
    top:100px;
    right:40px;
    height: 34px;
    border: 1px solid #dcdfe6;
    width: 500px;
    border-radius: 34px;
    .pad-input{
      height: 28px;
      width: 450px;
      margin-left: 10px;
      font-size: 16px;
      border: none;
    }
    .pad-icon{
      color: #4F9DFF;
      margin-left: 10px;
      font-size: 16px;
      margin-top: 8px;
    }
  }
}
</style>
