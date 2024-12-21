<template>
  <keep-alive v-if="$route.meta.keepAlive" :include="/list/">
    <component :is="name" :detail="detail" @changed="changedRoute"></component>
  </keep-alive>
  <component v-else :is="name" :detail="detail" @changed="changedRoute"></component>
</template>

<script>
import tabs from './Index'
import add1 from './NursingAdd'
import add2 from './IdentifyAdd'
import list1 from './NursingList'
import list2 from './Identify'

export default {
  name: 'label_manage_nursing_main',
  data () {
    return {
      name: 'list1',
      detail: null
    }
  },
  methods: {
    changedRoute (name = 'list1', detail = null) {
      this.name = name
      this.detail = detail
    }
  },
  components: {
    tabs, add1, add2, list1, list2
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  }
}
</script>

<style scoped>

</style>
