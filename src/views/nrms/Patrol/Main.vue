<template>
  <keep-alive v-if="$route.meta.keepAlive" >
    <component :is="name" :detail="detail" @changed="changedRoute"></component>
  </keep-alive>
  <component v-else :is="name" :detail="detail" @changed="changedRoute"></component>
</template>

<script>
  import list from "./List";
  import add from "./Add";

  export default {
    name: "partrol_list",
    data() {
      return {
        name: "list",
        detail: null
      };
    },
    methods: {
      changedRoute(name = 'list', detail = null) {
        this.name = name;
        this.detail = detail;
      }
    },
    components: {
      list, add
    },
    beforeRouteEnter (to, from, next) {
      to.meta.keepAlive = true;
      next();
    }

  };
</script>

<style scoped>

</style>
