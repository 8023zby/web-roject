<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component :is="optionType" :patient="patientData" :patientType="patientType" :entryType="entryType" :codId="codId" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
  import list from './List';
  import add from './Add';

  export default {
    components: { list, add },
    props:["patientData", "patientType", "entryType"],
    data() {
      return {
        optionType: 'list',
        codId: "",
      };
    },
    methods: {
      optionChangeHandler(optionType = 'list', codId = "") {
        this.codId = codId;
        this.optionType = optionType;
      }
    }
  };
</script>
