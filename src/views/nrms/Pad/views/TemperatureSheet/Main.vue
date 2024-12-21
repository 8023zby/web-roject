<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive>
      <component :is="optionType" :patient="patientData" :entryType="entryType" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
  import list from './List';
  import sheet from './TemperatureSheet';
  import add from './Add';

  export default {
    components: { list, sheet, add },
    props:["patientData", "entryType"],
    data() {
      return {
        optionType: 'list',
        nodeData: {},
      };
    },
    methods: {
      optionChangeHandler(optionType = 'list') {
        this.optionType = optionType;
      }
    }
  };
</script>
