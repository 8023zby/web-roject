<template>
  <div>
    <el-select v-model="sort" placeholder="排序方式" @change="queryData" style="width: 182px;">
      <el-option v-for="item in orderBy" :key="item.id" :label="item.label" :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'sort-type',
  data () {
    return {
      sort: ''
    }
  },
  props: ['orderBy'],
  methods: {
    // 查询
    queryData () {
      this.$emit('query', this.sort)
    }
  }
}
</script>

<style scoped>

</style>
