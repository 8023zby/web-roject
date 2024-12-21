<template>
  <keep-alive :include="/list/">
    <component :is="name" :patientDetail="patient" @hook:activated="scrollTo" @changed="changedRoute"></component>
  </keep-alive>
</template>

<script>
import list from './CardList'
import tabs from './CardTabs'

export default {
  name: 'bed_card_main',
  data () {
    return {
      name: 'list',
      patient: null

    }
  },
  methods: {
    changedRoute (name, patient = null) {
      this.name = name
      this.patient = patient
    },
    scrollTo () {
      // 添加、更新患者时，定位到患者位置，并高亮
      if (this.name && this.name === 'list') {
        const positionInfo = JSON.parse(sessionStorage.getItem('cardContainerScrollTop') || '{}')
        document.querySelector('#cardContainer').parentNode.scrollTop = positionInfo.position

        this.$nextTick(() => {
          // 删除样式
          setTimeout(() => {
            document.querySelector('#' + positionInfo.domId) && document.querySelector('#' + positionInfo.domId).classList.remove('blue')
          }, 5 * 1000)
          // 增加样式
          document.querySelector('#' + positionInfo.domId) && document.querySelector('#' + positionInfo.domId).classList.add('blue')
        })
      }
    }
  },
  components: {
    list, tabs
  }
}
</script>

<style scoped>

</style>
