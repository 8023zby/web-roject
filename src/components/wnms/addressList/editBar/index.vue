<template>
  <div class="edit-panel">
    <el-button @click="addList()" class="add-btn">+&nbsp;&nbsp;&nbsp;添加</el-button>
    <el-button @click="sortList()" class="add-sort"  :disabled="isDisabled">排序</el-button>
  </div>
</template>
<script>
export default {
  props: {
    editType: {
      type: String,
      default: ''
    },
    typeList: {
      type: Array,
      default: function () {
        return []
      }
    },
    typeId: {
      type: String,
      default: ''
    }
  },
  watch: {
    typeId: function () {
      if (this.typeId === '') {
        // this.$message({
        //   showClose: true,
        //   message: '请选择要添加的分类',
        //   type: 'warning'
        // })
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    }
  },
  components: {
  },
  data () {
    return {
      isDisabled: true
    }
  },
  computed: {
  },
  mounted () {
    // 判断是否有分类id，无：按钮置灰
  },
  methods: {
    addList () {
      // if (this.typeId === '') {
      //   this.$message({
      //     showClose: true,
      //     message: '请选择要添加的分类',
      //     type: 'warning'
      //   })
      //   return
      // }
      if (this.editType === 'ebookEdit') {
        // 电子书添加
        this.$emit('addEbook')
      } else if (this.editType === 'musicEdit') {
        // 音乐添加
        this.$emit('addMusic')
      }
    }
  }
}
</script>
<style scoped scss>
.edit-panel{
  display: flex;
  flex-direction: row;
  padding: 18px 0px;
  justify-content: space-between;
  border-bottom: 1px solid #EBEEED;
}
.add-btn{
  background: #ff8b00;
  color:#ffffff;
  padding: 8px 14px;
  border-radius: 2px;
  margin-left: 10px;
}
.add-sort{
  background: #409EFF;
  color:#ffffff;
  padding: 8px 18px;
  border-radius: 2px;
  margin-right: 10px;
}
</style>
