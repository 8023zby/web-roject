<template>
  <div class="passport-404-container">
    <img src="/static/passport/img/404.jpg" height="200"/>
    <div class="passport-404-msg">
      <img src="/static/passport/img/error.png" height="30" width="30"/>
      <div class="passport-404-tit">很抱歉，您访问的页面地址有误，或者该页面不存在！</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorInfo'
}
</script>

<style scoped lang="scss">
.passport-404-container{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  .passport-404-msg{
    color: #58AFB6;
    font-size: 18px;
    margin-top: 20px;
    display: flex;
  }
  .passport-404-tit{
    margin-left: 20px;
    line-height: 30px;
  }
}
</style>
