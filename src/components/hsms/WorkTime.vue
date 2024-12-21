<template>
  <div>
    <span v-for="(item, index) in data"
          :key="index">{{item.beginTime + '-' + item.endTime}}<br v-if="index!==srcData.length-1"/>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'work-time',
    props: ['srcData'],
    data () {
      return {
        data: []
      }
    },
    methods: {
      initData () {
        if (typeof (this.srcData) === 'string') {
          this.data = JSON.parse(this.srcData)
        } else {
          this.data = this.srcData
        }
      }
    },
    created () {
      this.initData()
    }
  }
</script>

<style scoped>

</style>
