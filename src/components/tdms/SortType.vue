<template>
  <div>
    <el-select v-model="sort" placeholder="排序方式" @change="queryData" clearable style="width: 182px">
      <el-option v-for="(item, index) in orderBy" :key="index" :label="item.label" :value="item.id">
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
  props: {
    orderBy: {
      type: Array,
      default () {
        return [{
          id: 'ip desc',
          label: 'ip降序'
        },
        {
          id: 'ip asc',
          label: 'ip升序'
        },
        {
          id: 'inet_aton( ip ) desc',
          label: 'ip数字降序'
        },
        {
          id: 'inet_aton( ip ) asc',
          label: 'ip数字升序'
        }]
      }
    }
  },
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
