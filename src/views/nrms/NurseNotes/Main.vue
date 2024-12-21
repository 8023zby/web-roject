<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/tabs/">
      <component :is="optionType" :patient="patient" :note="note" :formListObj="formListObj" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
import tabs from './tabs'
import add from './Add'
import print from './Print'
import addSign from './MaiyangList/SomeIn'

export default {
  components: { tabs, add, print, addSign },
  data () {
    return {
      optionType: 'tabs',
      patient: {},
      note: {},
      formListObj: {} // 表单的信息
    }
  },
  methods: {
    optionChangeHandler (optionType = 'tabs', patient = {}, note = {}, formListObj = {}) {
      this.patient = patient
      this.note = note
      this.optionType = optionType
      this.formListObj = formListObj
    }
  }
}
</script>
