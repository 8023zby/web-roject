<template>
   <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="currentSize"
      :page-sizes="[10, 20, 30, 50,100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableTotal">
    </el-pagination>
</template>
<script>
export default {
  props: {
    tableTotal: {
      type: Number,
      default: 0
    },
    pageChange:{
      type:Object,
      default: () => {
      }
    }
  },
  components: {
  },
  data () {
    return {
      currentPage: 1,
      currentSize:10
    }
  },
  watch:{
      pageChange:{
          handler:function(val,oldval){
              this.currentPage  = val.page
              this.currentSize = val.size
              console.log(val,oldval,'测试====')
          },
          deep:true//对象内部的属性监听，也叫深度监听
      },
      'pageChange.page':function(val,oldval){
          this.currentPage  = val
          console.log(val,oldval,'=========')
      },
      'pageChange.size':function(val,oldval){
          this.currentSize = val
          console.log(val,oldval,'====')
      }
  },

  computed: {
  },
  mounted () {
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>
<style scoped scss>
</style>
