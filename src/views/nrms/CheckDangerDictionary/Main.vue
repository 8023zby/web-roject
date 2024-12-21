<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive include="List">
      <component :is="name" @option-changed="changedOptionType" :rowData="rowData" :clissfyItem="clissfyItem"/>
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'
import add from './Add'
export default {
  name: 'Main',
  data () {
    return {
      name: 'list',
      rowData: {},
      clissfyItem: {}
    }
  },
  methods: {
    changedOptionType (name = 'list', rowData = {}, clissfyItem = {}) {
      this.name = name
      this.rowData = rowData
      this.clissfyItem = clissfyItem
    }

  },
  components: {
    add, list
  }
}
</script>

<style type="text/scss" lang="scss" scoped>

</style>
