<template>
  <div class="inspection-details-container">
    <layout_list>
      <div slot="main" class="main-list inspection-details-container-center">
        <div class="inspection-details-container-center">
          <div class="inspection-details-container-center-top">
            <div class="inspection-details-container-center-top-top">
              <span class="top-line" />
              <span class="top-text">{{ title }}</span>
              <el-button type="primary" class="top-button" @click="returnFather()">返回</el-button>
            </div>
          </div>
          <div class="inspection-details-container-center-main">
            <div class="clinical-content-inner">
              <div class="html" v-html="html">无内容</div>
            </div>
          </div>
        </div>
      </div>
    </layout_list>
  </div>
</template>

<script>

import layout_list from '../../../../components/nrms/layout/list'
export default {
  name: 'InspectionHtml',
  components: { layout_list },
  data () {
    return {
      title: '',
      html: ''
    }
  },
  created () {
    this.html = this.$route.query.html || ''
    this.title = this.$route.query.title || ''
  },
  methods: {
    returnFather () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.el-main {
  padding: 0px !important;
}
.inspection-details-container {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
  background-color: white;
  display: flex;

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

