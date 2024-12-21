<template>
  <transition name="fade-transform"
              mode="out-in">
      <component :is="optionType"
                @main-reload="mainReload"
                v-if="isRouterAlive"
                :params="params"
                @option-changed="optionChangeHandler" />
  </transition>
</template>

<script>
import list from './list'
import add from './add'
import sort from './sort'

export default {
  components: { list, add, sort },
  data () {
    return {
      optionType: 'list',
      isRouterAlive: true,
      params: {}
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', params = {}) {
      this.optionType = optionType
      this.params = params
      console.log(this.params)
    },
    // 页面刷新
    mainReload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
