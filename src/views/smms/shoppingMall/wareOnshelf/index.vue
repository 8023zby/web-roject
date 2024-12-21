<!--
  文件描述：上架审核主页
  创建时间：2020/4/16 18:44
  创建人：Administrator
-->
<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import wareOnshelfList from './list.vue'
import wareOnshelfListLog from './loglist.vue'
import detail from './detail.vue'
export default {
  name: 'wareOnshelfListMain',
  // import引入的组件需要注入到对象中才能使用
  components: { wareOnshelfList, wareOnshelfListLog, detail },
  data () {
    // 这里存放数据
    return {
      optionType: 'wareOnshelfList',
      detail: {},
      module: {} // 用于兄弟组件之间的多个对象传值
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 方法集合
  methods: {
    optionChangeHandler (optionType = 'wareOnshelfList', detail = {}) {
      this.detail = detail
      this.optionType = optionType
    }
  }
}
</script>

<style scoped lang="scss">
//@import url(); 引入公共css类
</style>
