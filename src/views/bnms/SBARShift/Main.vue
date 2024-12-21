<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component :is="optionType" :shift="shift" :shiftPatient="shiftPatient" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
  import list from './List'
  import edit from './Edit'

  export default {
    components: { list, edit },
    data () {
      return {
        optionType: 'list',
        shift: {},
        shiftPatient: {}
      }
    },
    methods: {
      optionChangeHandler (optionType = 'list', shift = {}, shiftPatient = {}) {
        this.shift = shift
        this.optionType = optionType
        this.shiftPatient = shiftPatient
      }
    }
  }
</script>
