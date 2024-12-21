<template>
  <div style="height: 100%">
    <transition name="fade-transform" mode="out-in">
      <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
    </transition>
  </div>
</template>

<script>
import list from './list.vue'
import tabs from './tabs.vue'
export default {
  components: { list, tabs },
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      optionType: 'tabs'
    }
  },
  mounted () {},
  methods: {
    optionChangeHandler (optionType = 'tabs', detail = {}) {
      if (optionType === 'backQsmsList') {
        this.$emit('option-changed', 'list')
      }
      this.optionType = optionType
      detail = this.detail
    }
  }
}
</script>
