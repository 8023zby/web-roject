<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :modify-data="modifyData" :params="params" @option-changed="optionChangeHandler" />
  </transition>
</template>

<script>
import list from './List'
import add from './Add'
import MainItem from '../../../assets/bnms/mixins/MainItem'
export default {
  components: { list, add },
  mixins: [MainItem]
}
</script>
