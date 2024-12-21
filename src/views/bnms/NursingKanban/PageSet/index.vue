
<template>
  <keep-alive v-if="$route.meta.keepAlive" :include="/list/">
    <component :is="name"></component>
  </keep-alive>
</template>

<script>
import list from './pageList'

export default {
  name: 'page_template',
  components: {
    list
  },
  data () {
    return {
      name: 'list'
    }
  },
  methods: {

  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  }
}
</script>

<style scoped>
</style>
