<template>
  <div class="edit-panel">
    <el-button
      type="warning"
      icon="el-icon-plus"
      size="small"
      @click="addList"
    >添加</el-button>
    <el-button type="primary" @click="sortList()" size="small"  :disabled="isDisabled">排序</el-button>
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
    },
    sortList () {
      // 列表排序
      if (this.editType === 'ebookEdit') {
        // 电子书排序
        this.$emit('sortEbook')
      } else if (this.editType === 'musicEdit') {
        // 音乐排序
        this.$emit('sortMusicType')
      }
    }
  }
}
</script>
<style scoped scss>
.edit-panel{
  display: flex;
  flex-direction: row;
  padding:5px 18px;
  justify-content: space-between;
  border-bottom: 1px solid #EBEEED;
}

</style>
