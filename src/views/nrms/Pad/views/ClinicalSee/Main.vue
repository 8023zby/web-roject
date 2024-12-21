<template>
  <transition name="fade" mode="out-in" >
    <keep-alive :include="/clinicalList/">
      <component is="list" :patientId="patientId"></component>
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'

export default {
  name: '',
  components: {
    list
  },
  created () {
    this.getData()
  },
  data () {
    return {
      patientId: ''
    }
  },
  methods: {
  // 调用安卓方法
    getData () {
    // type 1为医生 2 为护士
      let str = '{"nurseName":"张三","nurseId":"123","partId":"111","deptName":"内科","bedName":"1床","intoTime":"2019-08-07",' +
      '"patientId":"3232121","patientName":"陈文宗","patientSex":"男","patientAge":"18","intoNo":"13133112313","type":"2"}'
      let obj = JSON.parse(str)
      this.patientId = obj.patientId
      if (window.androida10 && window.androida10.getAndroidData) {
        let str = window.androida10.getAndroidData()
        let obj = JSON.parse(str)
        this.patientId = obj.patientId
      }
    }
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 2s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
