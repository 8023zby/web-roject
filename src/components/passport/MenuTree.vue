<template>
  <el-submenu v-if="menuData.child&&menuData.child.length>0" :index="menuData.authorityId" v-uni="'erjicaidan_' + menuData.authorityCode">
    <template slot="title">
      <i class="passport_nav_i">
        <i v-if="flag.indexOf(menuData.authorityId+ '_close')>-1" class="el-icon-caret-right passport_nav_open" />
        <i v-else class="el-icon-caret-bottom passport_nav_open"></i>
      </i>
      <span slot="title" style="position: relative">
        {{menuData.authorityName}}
        <!--A10消息提醒数字-->
        <div v-if="menuNum[menuData.authorityCode]" class="passport-message-circle">{{menuNum[menuData.authorityCode]}}</div>
      </span>
    </template>
    <el-menu-item v-for="(item, index) in menuData.child" :key="index" :index="item.pageUrl" v-uni="'sanjicaidan_' + item.authorityCode">
      <span style="position: relative" slot="title" :pName="menuData.authorityName" :url="item.pageUrl" :fName="firstName">
        {{item.authorityName}}
        <!--A10消息提醒数字-->
        <div v-if="menuNum[item.authorityCode]" class="passport-message-circle">{{menuNum[item.authorityCode]}}</div>
      </span>
    </el-menu-item>
  </el-submenu>
  <el-menu-item v-else :index="menuData.pageUrl" class="passport-second-menu" v-uni="'erjicaidan_' + menuData.authorityCode">
    <span slot="title" pName="" :url="menuData.pageUrl" :fName="firstName" style="position: relative">
      {{menuData.authorityName}}
      <!--A10消息提醒数字-->
      <div v-if="menuNum[menuData.authorityCode]" class="passport-message-circle">{{menuNum[menuData.authorityCode]}}</div>
    </span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'menu-tree',
  props: {
    menuData: {
      type: Object,
      required: true
    },
    selectedKey: {
      type: String
    },
    firstName: {
      type: String,
      required: true
    },
    menuNum: {
      type: Object
    }
  },
  data () {
    return {
      flag: ''
    }
  },
  watch: {
    selectedKey (newValue, oldValue) {
      this.flag = this.selectedKey
    }
  },
  created () {
    this.flag = this.selectedKey
  }
}
</script>

<style lang="scss">
  .passport_second_menu{
    .passport_nav_open{
      font-size: 12px;
      width: 6px;
      margin-top: -5px;
      color: #1E87F0;
    }
    .passport_nav_i{
      padding-right: 5px;
    }
    .passport-second-menu {
      padding-left: 25px !important;
      color: #333333 !important;
      height: 38px;
      line-height: 38px;
      background: #F7F7F7;
    }
    .is-active{
      background: #daeff7;
      color: #409EFF !important;
    }
    .passport-second-menu:hover {
      background: #ecf5ff;
    }
    .el-submenu__title{
      padding: 0 10px !important;
      height: 38px !important;
      line-height: 38px !important;
      color: #333333 !important;
    }
    .el-submenu__icon-arrow{
      display: none;
    }
    .el-submenu{
      background: #F7F7F7;
      .el-menu-item{
        height: 38px !important;
        line-height: 38px !important;
        padding-left: 30px !important;
        min-width: 140px !important;
      }
    }
    .passport-message-circle{
      position: absolute;
      background-color: #EE736D;
      min-width: 18px;
      height: 18px;
      border-radius: 18px;
      top:-8px;
      right: -20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #FFFFFF;
      pointer-events: none;
    }
  }
</style>
