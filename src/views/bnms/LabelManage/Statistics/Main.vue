<template>
  <keep-alive v-if="$route.meta.keepAlive" :include="/list/">
    <component :is="name" :detail="detail" @changed="changedRoute"></component>
  </keep-alive>
  <component v-else :is="name" :detail="detail" @changed="changedRoute"></component>
</template>

<script>
import list from './StatisticsList'
import add from './StatisticsAdd'

export default {
  name: 'label_manage_statistic_main',
  data () {
    return {
      name: 'list',
      detail: null
    }
  },
  methods: {
    changedRoute (name = 'list', detail = null) {
      this.name = name
      this.detail = detail
    }
  },
  components: {
    list, add
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  }
}
</script>

<style scoped>

</style>
