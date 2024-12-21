<template>
  <el-menu @open="openMenu" @close="closeMenu" text-color="#666666" active-text-color="#1e87f0"
           :default-active="defaultActive" class="el-menu-vertical-demo" @select="checkMenu" :default-openeds="opened" @checkMenu="checkMenu">
    <menu-tree :menuNum="menuNum" v-for="(item, index) in secondMenuData" :key="index" :menuData="item" :firstName="firstName" :selectedKey="selectedKey"></menu-tree>
  </el-menu>
</template>

<script>
import MenuTree from './MenuTree.vue'
export default {
  name: 'nav-menu',
  props: ['authorityTree', 'dataKey', 'defaultActive', 'firstName', 'menuNum'],
  components: {
    MenuTree
  },
  data () {
    return {
      opened: [],
      secondMenuData: [],
      selectedKey: '',
      tempObj: {}
    }
  },
  watch: {
    dataKey () {
      this.secondMenuData = this.authorityTree[this.dataKey].child
      this.secondMenuData.forEach((item) => {
        this.opened.push(item.authorityId)
      })
    }
  },
  created () {
    this.secondMenuData = this.authorityTree[this.dataKey].child
    this.secondMenuData.forEach((item) => {
      this.opened.push(item.authorityId)
    })
  },
  methods: {
    openMenu (key) {
      this.tempObj[key] = key + '_open'
      this.initData()
    },
    closeMenu (key) {
      this.tempObj[key] = key + '_close'
      this.initData()
    },
    checkMenu (key) {
      let dom = event.target
      let tagName = dom.tagName
      if (tagName === 'LI') {
        dom = dom.firstChild
      }
      let curName = dom.innerText
      let pName = dom.getAttribute('pName')
      let fName = dom.getAttribute('fName')
      this.$emit('checkMenu', key, curName, pName, '', fName)
    },
    // 整合数据
    initData () {
      this.selectedKey = ''
      let d = this.tempObj
      for (let p in d) {
        this.selectedKey += d[p]
      }
    }
  }
}
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 150px !important;
  }
  .el-menu-vertical-demo{
    height: 100%;
    overflow: auto;
  }
</style>
