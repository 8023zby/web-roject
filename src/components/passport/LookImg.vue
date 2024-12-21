<template>
  <div @mouseenter="seen=true" @mouseleave="seen=false" :class="imgClass">
    <img :src="imgUrl" alt="" class="showImg"/>
    <div v-show="seen" class="showBtn" :class="lookImg">
      <p class="ImgBtn" @click.stop="dialogVisible = true">查看</p>
    </div>
    <el-dialog :visible.sync="dialogVisible" class="imgDialog">
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LookImg',
  props: {
    imgUrl: {
      type: String,
      required: true
    },
    imgClass: {
      type: String,
      required: true
    },
    lookImg: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      seen: false
    }
  }
}
</script>
<style>
  .imgDialog .el-dialog{
    height: auto;
  }
</style>
<style scoped>
   .imgContent, .imgContent .showImg{
    width: 110px;
    height: 110px;
    border-radius:2px;
  }
   .identityImg,.identityImg .showImg{
     width: 160px;
     height: 100px;
     margin-right: 10px;
     border-radius:2px;
   }
    .license, .license .showImg{
      width: 160px;
      height: 180px;
      border-radius:2px;
   }
   .license .showImg {
     margin:-1px 0 0 -1px;
   }
   .identityImg{
     float: left;
   }
   .widthSmall{
     width: 110px;
   }
   .widthMiddle{
     width: 160px;
   }
  .showBtn{
    position: absolute;
    bottom: 0;
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    border-radius:0 0 2px 2px;
    background:rgba(51,51,51,0.3);
  }
</style>
