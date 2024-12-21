<template>
  <!--空心圆-->
    <svg v-if="signType == 'circle'"
         t="1594173775900" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3374"
         :width="width" :height="height" :cx="itemX" :cy="itemY"
    >
      <path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m0-931.84c-230.4 0-419.84 189.44-419.84 419.84s189.44 419.84 419.84 419.84c230.4 0 419.84-189.44 419.84-419.84S742.4 92.16 512 92.16z" p-id="3375" :fill="color"></path>
    </svg>
  <!--P-->
    <svg v-else-if="signType == 'textP'" t="1594172867767" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3222"
         :width="width" :height="height" :cx="itemX" :cy="itemY">
      <path d="M547.84 609.28H235.52V1024H122.88V0H563.2c209.92 10.24 322.56 112.64 343.04 302.08-5.12 199.68-122.88 302.08-358.4 307.2zM527.36 102.4H235.52v404.48h296.96c163.84-5.12 245.76-71.68 250.88-209.92-10.24-128-92.16-189.44-256-194.56z" p-id="3223" :fill="color"></path>
    </svg>
  <!--实心圆-->
    <svg v-else-if="signType == 'solidCircle'"
         t="1594170978884" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2727"
         :width="width" :height="height" :cx="itemX" :cy="itemY">
      <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" p-id="2728" :fill="color"></path>
    </svg>
  <!--叉号-->
  <svg v-else-if="signType == 'cha'"
       t="1594343894815" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="913"
       :width="width" :height="height" :cx="itemX" :cy="itemY"
  >
    <path d="M517.12 583.68L143.36 1024H0L440.32 501.76 0 0h133.12L512 409.6l373.76-409.6H1024l-435.2 501.76L1024 1024h-148.48l-358.4-440.32z" p-id="914" :fill="color"></path>
  </svg>
  <!--R-->
    <svg v-else-if="signType == 'circleR'"
      t="1594173988577" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3526"
      :width="width" :height="height" :cx="itemX" :cy="itemY">
      <path d="M803.84 844.8h-102.4l-230.4-302.08H296.96v302.08H220.16v-665.6h307.2c143.36 5.12 215.04 66.56 225.28 179.2 0 117.76-66.56 179.2-199.68 184.32l250.88 302.08zM296.96 245.76v235.52H512c107.52 0 163.84-40.96 163.84-122.88 0-71.68-56.32-107.52-163.84-107.52H296.96z" p-id="3527" :fill="color"></path>
      <path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m0-972.8c-256 0-460.8 204.8-460.8 460.8s209.92 460.8 460.8 460.8 460.8-209.92 460.8-460.8-204.8-460.8-460.8-460.8z" p-id="3528" :fill="color"></path>
    </svg>
  <!--大便失禁用的图标-->
  <svg
    v-else-if="signType == 'chaAndDot'"
    t="1594344042832" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1062"
    :width="width" :height="height" :cx="itemX" :cy="itemY"
  >
    <path d="M517.12 583.68L143.36 1024H0L440.32 501.76 0 0h133.12L512 409.6l373.76-409.6H1024l-435.2 501.76L1024 1024h-148.48l-358.4-440.32z" p-id="1063" :fill="color"></path>
    <path d="M117.76 512m-61.44 0a61.44 61.44 0 1 0 122.88 0 61.44 61.44 0 1 0-122.88 0Z" p-id="1064" :fill="color"></path>
    <path d="M906.24 512m-61.44 0a61.44 61.44 0 1 0 122.88 0 61.44 61.44 0 1 0-122.88 0Z" p-id="1065" :fill="color"></path>
    <path d="M512 906.24m-61.44 0a61.44 61.44 0 1 0 122.88 0 61.44 61.44 0 1 0-122.88 0Z" p-id="1066" :fill="color"></path>
    <path d="M512 117.76m-61.44 0a61.44 61.44 0 1 0 122.88 0 61.44 61.44 0 1 0-122.88 0Z" p-id="1067" :fill="color"></path>
  </svg>
  <!--向上箭头-->
  <svg
    v-else-if="signType == 'arrowHead'"
    t="1594344308629" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1215"
    :width="width" :height="height" :cx="itemX" :cy="itemY"
  >
    <path d="M947.2 435.2L547.84 35.84 512 0l-35.84 35.84-399.36 399.36c-20.48 20.48-20.48 51.2 0 66.56 20.48 20.48 51.2 20.48 66.56 0L460.8 184.32V972.8c0 25.6 20.48 46.08 46.08 46.08s46.08-20.48 46.08-46.08V184.32L870.4 501.76c10.24 10.24 20.48 15.36 35.84 15.36s25.6-5.12 35.84-15.36c25.6-15.36 25.6-46.08 5.12-66.56z" p-id="1216" :fill="color"></path>
  </svg>
  <!--五角星-->
  <svg
    v-else="signType == 'fiveStar'"
    t="1594344407860" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1364"
    :width="width" :height="height" :cx="itemX" :cy="itemY">
    <path d="M829.44 998.4L512 834.56l-317.44 163.84L256 645.12 0 399.36l353.28-51.2L512 25.6l158.72 322.56 353.28 51.2-256 250.88 61.44 348.16zM512 737.28l204.8 107.52-40.96-230.4 163.84-158.72-225.28-30.72-102.4-204.8-102.4 204.8-225.28 30.72L348.16 614.4 307.2 839.68l204.8-102.4z" fill="#231815" p-id="1365" :fill="color"></path>
  </svg>
</template>

<script>
  export default {
    name: 'sign_svg',
    props: {
      signType: {
        type: String
      },
      color: {
        type: String,
        default: '#333'
      }
    },
    data(){
      return{
        width:'20px',
        height:'20px',
        itemX:'',
        itemY:'',
      }
    }
  }
</script>

<style scoped>
</style>
