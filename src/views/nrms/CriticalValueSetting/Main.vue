<!--
 * @Author: hanzhe
 * @Date: 2021-05-07 13:09:22
 * @LastEditTime: 2021-11-17 10:25:47
 * @LastEditors: hanzhe
 * @Description: 
 * @FilePath: \yarward-nrms-frontend\src\views\nrms\CriticalValueSetting\Main.vue
-->
<template>
  <keep-alive v-if="$route.meta.keepAlive" :include="/tabs/">
    <component :is="name" :detail="detail" @changed="changedRoute"></component>
  </keep-alive>
  <component v-else :is="name" :detail="detail" @changed="changedRoute"></component>
</template>

<script>
import tabs from './Index'
import add1 from './InspectAdd'
import add2 from './ExamineAdd'

export default {
  name: 'critical_value_main',
  data () {
    return {
      name: 'tabs',
      detail: null
    }
  },
  methods: {
    changedRoute (name = 'tabs', detail = null) {
      this.name = name
      this.detail = detail
    }
  },
  components: {
    tabs, add1, add2
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  }
}
</script>

<style scoped>

</style>
