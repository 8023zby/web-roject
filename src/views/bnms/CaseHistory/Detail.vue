<template>
  <layout_edit>
    <div slot="title">病历详情</div>
    <div slot="right_btn">
      <el-button type="primary" @click="close">返回</el-button>
    </div>
    <div slot="main" class="pdfContainer">
      <iframe :src="pdfSrc" style="height: 100%;" />
    </div>
  </layout_edit>
</template>

<script>

import layout_edit from '../../../components/bnms/layout/edit'
export default {
  name: 'Detail',
  components: { layout_edit },
  props: ['patient', 'detail'],
  data () {
    return {
      pdfUrl: '',
      pageCount: 0,
      pdfSrc: '', // pdf文件地址
      numPages: 0,
      page: 0
    }
  },
  watch: {
    patient (patient) {
      this.$emit('option-changed', 'list')
    }
  },
  created () {
    const src_temp = this.$route.query.pdfPath || ''
    if (src_temp === null || src_temp === '') {
      this.$message.error('报告文件不能为空！')
      return
    }
    this.pdfSrc = '/static/bnms/pdfjs/web/viewer.html?file=' + encodeURIComponent(src_temp)
  },
  methods: {
    close () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
.pdfContainer{
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
