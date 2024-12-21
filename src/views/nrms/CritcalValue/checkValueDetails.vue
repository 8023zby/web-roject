<template>
  <div class="inspection-details-container">
    <layoutList>
      <div slot="main" class="main-list inspection-details-container-center">
        <div class="inspection-details-container-center">
          <div class="inspection-details-container-center-top">
            <div class="inspection-details-container-center-top-top">
              <span class="top-line" />
              <span class="top-text">{{ title }}</span>
              <el-button v-uni="'weijizhi_detail_back'" type="primary" class="top-button" @click="returnFather()">返回</el-button>
            </div>
          </div>
          <div class="inspection-details-container-center-main">
            <div class="clinical-content-inner">
              <iframe :src="pdfSrc" style="height: 100%;width: 100%" />
            </div>
          </div>
        </div>
      </div>
    </layoutList>
  </div>
</template>

<script>
import layoutList from '../../../components/nrms/layout/list'

export default {
  name: 'InspectionDetails',
  components: { layoutList },
  data () {
    return {
      pdfSrc: '', // pdf文件地址
      title: ''
    }
  },
  created () {
    const src_temp = this.$route.query.pdfPath || ''
    this.title = this.$route.query.title || ''
    if (src_temp === null || src_temp === '') {
      this.$message.error('报告文件不能为空！')
      return
    }
    this.pdfSrc = '/static/nrms/pdfjs/web/viewer.html?file=' + encodeURIComponent(src_temp)
  },
  methods: {
    returnFather () {
      this.$router.go(-1)
    }
  }
}

</script>

<style scoped lang="scss">
.inspection-details-container {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
  background-color: white;
  display: flex;
  z-index: 9;

  &-center {
    display: flex;
    flex-direction: column;
    flex: 1;

    &-top {
      width: 100%;
      margin-top: 0;
      height: 48px;

      &-top {
          height: 48px;
          margin-top: 0;
          width: 100%;
          background-color: #f7f7f7;
          display: flex;
          align-items: center;

          .top-line {
              background-color: #15c690;
              width: 4px;
              height: 15px;
              vertical-align: center;
              margin-left: 15px;
              display: inline-block;
              border-radius: 2px;
          }

          .top-text {
              font-size: 14px;
              color: #333333;
              margin-left: 15px;
          }

          .top-button {
              height: 28px;
              width: 80px;
              position: absolute;
              right: 16px;
              border-radius: 2px !important;
              font-size: 14px !important;
              padding-top: 6px !important;
              padding-bottom: 6px !important;
          }
      }
    }

    &-main {
      flex: 1;
      position: relative;

      .clinical-content-inner {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 0;
        overflow-y: scroll;
        overflow-x: hidden;
      }

      .red-font-color {
        color: #f56c6c;
      }
    }
  }
}
</style>