<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive include="List">
      <component :is="name" @option-changed="changedOptionType" :rowData="rowData"/>
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
    }
  },
  methods: {
    changedOptionType (name = 'list', rowData = {}) {
      this.name = name
      this.rowData = rowData
    }

  },
  components: {
    add, list
  }
}
</script>

<style type="text/scss" lang="scss" scoped>

</style>
