<template>
   <component :is="name"  @main-option-changed="changedOptionType" />
</template>
<script>
  import main_list from './Main'
  import batch_sign_add from './TemperatureSheet/BatchSign'
  export default {
    name: "sign_manage",
    data() {
      return {
        name: 'main_list',
      };
    },
    methods: {
      changedOptionType (name = 'main_list') {
        this.name = name
      },

    },
    components: {
      main_list,batch_sign_add
    }
  };
</script>

<style type="text/scss" lang="scss" scoped>
</style>
