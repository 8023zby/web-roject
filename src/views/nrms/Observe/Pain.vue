
<template>
  <transition name="fade-transform" mode="out-in">
    <component @main-reload="mainReload"
                v-if="isRouterAlive"
                :is="optionType"
                :modifyData="modifyData"
                :params="params"
                :patient="patient"
                :patientType="patientType"
                :printSet="printSet"
                :formStyle="formStyle"
                :formName="formName"
                :formCode="formCode"
                @option-changed="optionChangeHandler"/>
  </transition>
</template>

<script>
import list from './Pain-list'
import add from './Pain-add'

import MainItem from '../../../assets/nrms/mixins/MainItem'
export default {
  components: { list, add }, //, add, classify
  mixins: [MainItem],
  props: ['patient', 'patientType', 'printSet', 'formStyle', 'formName', 'formCode'],
}
</script>
