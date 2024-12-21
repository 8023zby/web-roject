<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive>
      <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
    </keep-alive>
  </transition>
</template>

<script>
import list from './list.vue'
import detail from './detail.vue'
export default {
  components: { list, detail },
  data () {
    return {
      optionType: 'list',
      detail: {},
      module: {} // 用于兄弟组件之间的多个对象传值
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', detail = {}) {
      this.detail = detail
      this.optionType = optionType
    }
  }
}
</script>
