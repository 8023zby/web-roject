<template>
  <transition name="fade-transform"
              mode="out-in">
    <!-- <keep-alive exclude="add"> -->
    <component :is="optionType"
               :detail="detail"
               @option-changed="optionChangeHandler" />
    <!-- </keep-alive> -->
  </transition>
</template>

<script>
import list from './list.vue'
import add from './add.vue'
import statistics from '../qsmsCout/main.vue'
import answerSheetList from '../qsmsList/main.vue'

export default {
  components: { list, add, answerSheetList, statistics },
  data () {
    return {
      optionType: 'list',
      detail: {}
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', detail = {}) {
        console.log('病区问卷加载其他组件：',optionType,'\n',JSON.stringify(detail))
      this.optionType = optionType
      this.detail = detail
    }
  }
}
</script>
