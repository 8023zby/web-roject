<template>
  <div style="height: 100%;">
    <transition name="fade-transform" mode="out-in">
      <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
    </transition>
  </div>
</template>

<script>
import list from './list.vue'
import Manage from '../qsmsManage/qsmsManage.vue'

export default {
  components: { list, Manage },
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      optionType: 'list'
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', detail = {}) {
      if (optionType === 'backQsmsList') { // 返回问卷管理列表
        this.$emit('option-changed', 'list')
      }
      detail = this.detail
      this.optionType = optionType
    }
  }
}
</script>
