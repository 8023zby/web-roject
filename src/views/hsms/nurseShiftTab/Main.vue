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
  import list from './ShiftTab'
  import add from './editShiftInformationRule'
  import add2 from './editMonthShiftInformationRule'
  import addWeek from './editShiftInformation'
  import addMonth from './editMonthShiftInformation'

  export default {
    components: {
      list,
      add,
      add2,
      addWeek,
      addMonth,
    },
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
    },
    beforeRouteEnter (to, from, next) {
      to.meta.keepAlive = true;
      next();
    }
  }
</script>
