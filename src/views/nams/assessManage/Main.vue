<template>
  <keep-alive v-if="$route.meta.keepAlive"
              :include="/list/">
    <component :is="name"
               :detail="detail"
               @changed="changedRoute"/>
  </keep-alive>
  <component v-else
             :is="name"
             :detail="detail"
             @changed="changedRoute"/>
</template>

<script>
  import list from './List'
  import add from './Add'

  export default {
    components: { list, add },
    data() {
      return {
        name: "list",
        detail: null
      }
    },
    methods: {
      changedRoute(name = 'list', detail = null) {
        this.name = name;
        this.detail = detail;
      }
    }
  }
</script>
