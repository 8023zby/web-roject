<!--
 * @Author: 翟冲
 * @Owner:
 * @Date: 2023-02-01 09:02:24
 * @LastEditTime: 2023-02-01 09:20:16
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \yarward-wnms-frontEnd\src\views\wnms\deviceVersion\main.vue
-->
<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>
<script>
import list from "./list";
export default {
  components: { list },
  data() {
    return {
      optionType: "list",
      detail: {}
    };
  },
  methods: {
    optionChangeHandler(optionType = "list", detail = {}) {
      this.detail = detail;
      this.optionType = optionType;
    }
  }
};
</script>
