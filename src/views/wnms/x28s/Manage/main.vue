<!--
 * @Author: 翟冲
 * @Owner:
 * @Date: 2022-11-07 10:27:37
 * @LastEditTime: 2023-02-08 18:20:37
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \yarward-wnms-frontEnd\src\views\wnms\x28s\Manage\main.vue
-->
<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>
<script>
import list from "./list";
import addorEdit from "./addorEdit";
import tempNumCall from "./template/tempNumCall";
import tempNumView from "./template/tempNumView3";
import tempNumVideo from "./template/tempNumVideo";

export default {
  components: { list, addorEdit, tempNumCall, tempNumView, tempNumVideo },
  data() {
    return {
      optionType: "list",
      detail: { type: "list" }
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
