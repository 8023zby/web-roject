<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
  </transition>
</template>

<script>
import list from './Duty'
import add from './DutyAdd'
import MainItem from '../../../assets/hsms/mixins/MainItem'
export default {
  components: { list, add },
  mixins: [MainItem]
}
</script>
