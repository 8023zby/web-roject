<template>
  <el-button :type="type" :size="size" :loading="loading" @click="click">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'LoadingButton',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    click () {
      this.loading = true
      this.$emit('click', () => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
