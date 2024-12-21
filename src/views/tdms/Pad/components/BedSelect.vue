<template>
  <div class="bed-div">
    <div :class="['item-bed',{'seled':flag.indexOf(','+item.bedId+',')>-1}]" v-for="(item, index) in srcData" @click="selBed(index)" :key="index">{{item.bedName}}</div>
  </div>
</template>

<script>
export default {
  name: 'bed-select',
  props: ['srcData', 'selectedOldBeds'],
  data () {
    return {
      flag: '',
      bedId: ''
    }
  },
  created () {
    this.flag = this.selectedOldBeds
  },
  methods: {
    selBed (index) {
      let id = this.srcData[index].bedId
      this.flag = ',' + id + ','
      this.bedId = id
    }
  }
}
</script>

<style scoped>
  .bed-div{
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    padding-left: 40px;
  }
  .item-bed{
    border: 1px solid #4E9CFE;
    border-radius: 5px;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
    margin: 30px 20px 0px 20px;
    cursor: pointer;
    color: #4E9CFE;
    font-size: 30px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .seled{
    background: #3F94FF;
    border: 1px solid #4E9CFE;
    color: #ffffff;
  }
</style>
