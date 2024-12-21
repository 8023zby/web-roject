<template>
  <div v-if="!element.config.hidden" class="form-common">
    <template v-if="element.type == 'grid'">
      <grid-form
        :element="element"
        :data="data"
        :valueData="valueData"
        :father="father"
        :isEdit="isEdit"
        :patient="patient"
        :tempList="tempList"
      ></grid-form>
    </template>
    <template v-else-if="element.type == 'input'">
      <input-form
        :element="element"
        :data="data"
        :valueData="valueData"
        @changeValue="changeValue"
        :isEdit="isEdit"
        :assId="assId"
      ></input-form>
    </template>
    <template v-else-if="element.type == 'text'">
      <text-form
        :element="element"
        :data="data"
        :valueData="valueData"
        @changeValue="changeValue"
        :isEdit="isEdit"
      ></text-form>
    </template>
    <template v-else-if="element.type == 'checkbox'">
      <checkbox-form
        :element="element"
        :data="data"
        :valueData="valueData"
        @changeValue="changeValue"
        :isEdit="isEdit"
      ></checkbox-form>
    </template>
    <template v-else-if="element.type == 'radio'">
      <radio-form
        :element="element"
        :data="data"
        :valueData="valueData"
        @changeValue="changeValue"
        :isEdit="isEdit"
      ></radio-form>
    </template>
    <template v-else-if="element.type == 'date'">
      <date-form
        :element="element"
        :data="data"
        :valueData="valueData"
        @changeValue="changeValue"
        :isEdit="isEdit"
      ></date-form>
    </template>
    <template v-else-if="element.type == 'button'">
      <button-form
        :element="element"
        :data="data"
        :valueData="valueData"
        :ColIndex="ColIndex"
        @changeValue="changeValue"
        @changeValueLoop="changeValueLoop"
        :isEdit="isEdit"
        :firstLineAssTime="firstLineAssTime"
        :patient="patient"
        :tempList="tempList"
      ></button-form>
    </template>
    <template v-else-if="element.type == 'select'">
      <select-form
        :element="element"
        :data="data"
        :valueData="valueData"
        @changeValue="changeValue"
        :isEdit="isEdit"
      ></select-form>
    </template>
    <template v-else-if="element.type == 'import'">
      <import-form
        :element="element"
        :data="data"
        :valueData="valueData"
        @changeValue="changeValue"
        :isEdit="isEdit"
      ></import-form>
    </template>
  </div>
</template>
<script>
// import GridForm from "./gridForm";
// import TextForm from "./textForm";
// import InputForm from "./inputForm";
// import CheckboxForm from "./checkboxForm";
// import RadioForm from "./radioForm";
// import DateForm from "./dateForm";
// import ButtonForm from "./buttonForm";
export default {
  components: {
    GridForm: () => import('./gridForm'),
    TextForm: () => import('./textForm'),
    InputForm: () => import('./inputForm'),
    CheckboxForm: () => import('./checkboxForm'),
    RadioForm: () => import('./radioForm'),
    DateForm: () => import('./dateForm'),
    ButtonForm: () => import('./buttonForm'),
    SelectForm: () => import('./selectForm'),
    ImportForm: () => import('./importForm')
  },
  name: 'formCommon',
  props: ['element', 'valueData', 'data', 'father', 'isEdit', 'ColIndex', 'assId', 'firstLineAssTime','patient','tempList'],
  data () {
    return {}
  },
  created () {
    this.valueData.map((item) => {
      if (item.key == this.element.key) {
        this.element.value = item.value
      }
    })
  },
  methods: {
    changeValue (e) {
      this.valueData.map((item) => {
        if (item.key == e.key) {
          item.value = e.value
          item.score = e.score
        }
      })
      if (typeof this.ColIndex === 'number') {
        this.$emit('colValueChange', this.ColIndex)
      }
    },
    changeValueLoop (e) {
      this.$emit('changeLoopValueData', e.index)
    }

  }
  // watch: {
  //   valueData: {
  //     handler(newValue, oldValue) {
  //       newValue.map((item) => {
  //         if (item.key == this.element.key) {
  //           this.element.value = item.value;
  //         }
  //       });
  //     },
  //     deep: true,
  //   },
  // },
}
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
