<template>
  <div class="typt-list-main">
    <pushMessageComponents></pushMessageComponents>
  </div>
</template>

<script>

  import pushMessageComponents from '@/components/wnms/Message/pushMessageComponents.vue'

  export default {
    name: "pushMessage",
    components: {pushMessageComponents},
    data() {
      return {}
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style scoped>

</style>
