<template>
  <div class="passport_message_box">
    <div class="passport_message_box-tit-div">
      <div class="passport_message_box_close" @click="closeNotice">关闭</div>
      <div class="passport_message_box-tit">消息</div>
    </div>
    <div class="passport_message_box_content">
      <div class="passport_message_box_content_item">
        <div>{{messageData}}</div>
        <div class="passport_message_box_content_detail" @click="detailNotice">立即查看</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notice',
  props: ['noticeData'],
  data () {
    return {
      messageData: ''
    }
  },
  watch: {
    noticeData () {
      this.messageData = this.noticeData
    }
  },
  created () {
    this.messageData = this.noticeData
  },
  methods: {
    // 关闭消息
    closeNotice () {
      this.$emit('closeNotice')
    },
    // 立即查看
    detailNotice () {
      this.$emit('detailNotice')
    }
  }
}
</script>

<style scoped lang="scss">
  .passport_message_box{
    position: absolute;
    z-index: 9999;
    width: 180px;
    left: 60px;
    background: rgba(0,0,0,0.65);
    height: 100%;
    overflow: auto;
    .passport_message_box_content{
      box-sizing: border-box;
      margin-top: 40px;
      color: #F3FF00;
      font-size: 14px;
      padding-left: 15px;
      padding-right: 15px;
      .passport_message_box_content_item{
        min-height: 60px;
        margin-top: 20px;
      }
      .passport_message_box_content_detail{
        position: absolute;
        font-size: 12px;
        text-align: right;
        color: #ffffff;
        height: 18px;
        border-bottom: 1px solid #ffffff;
        width: 50px;
        margin-top: 15px;
        right: 10px;
        cursor: pointer;
      }
    }
    .passport_message_box-tit-div{
      width: 100%;
      color: #ffffff;
      font-size: 14px;
      .passport_message_box-tit{
        box-sizing: border-box;
        width: 80%;
        height: 40px;
        margin-top: 12px;
        line-height: 40px;
        margin-left: auto;
        margin-right: auto;
        border-bottom: 1px solid #ffffff;
      }
      .passport_message_box_close{
        position: absolute;
        right: 10px;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }
</style>
