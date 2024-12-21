<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component :is="optionType" :patient="patient" :patientType="patientType" :param="param" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
  import list from './List'
  import print from './Print'

  export default {
    components: { list, print },
    props: ['patient', 'patientType'],
    data () {
      return {
        optionType: 'list',
        param: ''
      }
    },
    methods: {
      optionChangeHandler (optionType = 'list', param = '') {
        this.param = param
        this.optionType = optionType
      }
    }
  }
</script>
