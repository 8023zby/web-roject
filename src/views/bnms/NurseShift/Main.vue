<template>
  <transition name="fade-transform"
              mode="out-in">
    <keep-alive :include="/list/">
      <component :is="optionType"
                 :shift="shift"
                 :shiftPatient="shiftPatient"
                 :autoHead="autoHead"
                 @option-changed="optionChangeHandler" />
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'
import add from './Add'
import print from './Print'
import record from './Record'

export default {
  components: { list, add, print, record },
  data () {
    return {
      optionType: 'list',
      shift: {},
      shiftPatient: {},
      autoHead:{},
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', shift = {}, shiftPatient = {},autoHead = {}) {
      this.shift = shift
      this.optionType = optionType
      this.shiftPatient = shiftPatient
      this.autoHead = autoHead
    }
  }
}
</script>
