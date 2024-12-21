<template>
  <div class="room-div">
    <div :class="['item-room',{'seled':flag.indexOf(','+item.roomId+',')>-1}]" v-for="(item, index) in srcData" @click="selBed(index)" :key="index">{{item.roomName}}</div>
  </div>
</template>

<script>
export default {
  name: 'room-select',
  props: ['srcData', 'selectedOldRooms'],
  data () {
    return {
      flag: '',
      roomId: ''
    }
  },
  created () {
    this.flag = this.selectedOldRooms
  },
  methods: {
    selBed (index) {
      let id = this.srcData[index].roomId
      this.flag = ',' + id + ','
      this.roomId = id
    }
  }
}
</script>

<style scoped>
  .room-div{
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    padding-left: 40px;
  }
  .item-room{
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
