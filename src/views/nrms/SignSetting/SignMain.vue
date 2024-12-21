<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component :is="optionType" :rowData="rowData" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
  import list from './SignItem'
  import add from './SignItemAdd'

  export default {
    components: { list, add },
    data() {
      return {
        optionType: 'list',
        rowData: {}
      }
    },
    methods: {
      optionChangeHandler(optionType = 'list',  data = {}) {
        this.rowData = data;
        this.optionType = optionType
      }
    }
  }
</script>
