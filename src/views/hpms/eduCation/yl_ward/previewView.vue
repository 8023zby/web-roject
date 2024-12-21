<template>
  <div class="divbackgroud">
    <br />
    <div class="articleBox">
      <div class="titDiv">{{ detail.title }}</div>
      <div class="contentDiv">
        <el-input type="textarea" v-html="detail.contentText " />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  mounted () {}
}
</script>
<style  scoped>
.divbackgroud {
  min-height: 800px;
  background-color: #e7ffce;
  background: url('../../../../../public/static/hpms/img/ArticleBg.jpg') top
    center/cover fixed no-repeat;
}

.titDiv {
  text-align: center;
  width: 100%;
  font-size: 40px !important;
  font-weight: bold;
  line-height: 50px;
  color: #669900;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.17);
}
.articleBox {
  margin: 5%;
  padding: 20px;
  background: rgba(228, 232, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 600px;
}
.contentDiv {
  margin: 4% auto;
  font-size: 16px;
  color: #4a4a4a;
  word-break: normal;
  word-wrap: break-word;
}
</style>
