<template>
  <div
    class="text-form-label"
    :style="{
      'text-align': element.config.align,
      'font-weight': element.config.weight,
      'width': element.config.width,
      'font-size': element.config.fontSize,
      'color': element.config.color
    }"
    :class="element.config.border ? 'borderStyle' : ''"
  >
    {{ element.config.label }}
  </div>
</template>
<script>
const Text = {
  type: 'text',
  value: '',
  key: '5',
  config: {
    label: '生命体征',
    align: 'center',
    weight: 'bold',
    width: ''
  }
}
export default {
  name: 'textForm',
  props: ['element', 'valueData', 'data', 'isEdit'],
  data () {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.borderStyle{
  border: 1px solid rgb(221, 221, 221);
  border-left: none;
  border-right: none;
}
</style>
<style lang="scss">
</style>
