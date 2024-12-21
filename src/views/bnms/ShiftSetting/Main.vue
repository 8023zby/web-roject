<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component :is="optionType" :shift="shift" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
  import list from './List'
  import add from './Add'

  export default {
    components: { list, add },
    data () {
      return {
        optionType: 'list',
        shift: {},
        shiftPatient: {}
      }
    },
    methods: {
      optionChangeHandler (optionType = 'list', shift = {}) {
        this.shift = shift
        this.optionType = optionType
      }
    }
  }
</script>
