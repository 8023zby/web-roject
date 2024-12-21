<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="includeList">
      <component @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
import list from './userlist'
import add from './userAddModify'
import sort from './UserSort'
import importUser from './UserImport'
import deleteUser from './UserDelete'
import MainItem from '../../../../assets/passport/mixins/MainItem'
export default {
  components: { list, add, sort, importUser, deleteUser },
  mixins: [MainItem]
}
</script>
