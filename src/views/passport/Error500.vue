<template>
  <div class="passport-404-container">
    <img src="/static/passport/img/500.jpg" height="200"/>
    <div class="passport-404-msg">
      <img src="/static/passport/img/error.png" height="30" width="30"/>
      <div class="passport-404-tit">很抱歉，程序暂时无法处理您的访问请求！</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorInfo500'
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
