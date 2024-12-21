<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/sheet/">
      <component :is="optionType" :patient="patient" :patientType="patientType" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
  import sheet from './TemperatureSheet';
  import add from './BatchSign';

  export default {
    components: { sheet, add },
    props:["patient", "patientType"],
    data() {
      return {
        optionType: 'sheet',
        nodeData: {},
      };
    },
    methods: {
      optionChangeHandler(optionType = 'sheet', data = {}) {
        this.nodeData = data;
        this.optionType = optionType;
      }
    }
  };
</script>
