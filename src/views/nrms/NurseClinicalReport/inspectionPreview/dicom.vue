<template>
  <div class="container">
    <div class="content">
      <dicom-view :file-type="fileType" :imagePaths="imagePaths" :menus="menus"></dicom-view>
    </div>
  </div>
</template>

<script>
import { ApiClinicalReport } from '../../../../api/nrms'
import DicomView from '../../../../components/nrms/dicomm/dicommView'

export default {
  name: 'inspection-dicom',
  components: { DicomView },
  data () {
    return {
      imagePaths: [],
      fileType: 'jpg',
      menus: 'all',
      loading: true
    }
  },
  created () {
    // 获取地址
    const path = this.$route.query.path || ''
    ApiClinicalReport.getDcmJpg({ imagePath: path })
      .then(res => {
        const data = res.data || []
        const imgArr = []
        for (let i = 0; i < data.length; i++) {
          imgArr.push('http://' + location.host + data[i])
        }
        this.imagePaths = imgArr || []
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>

<style lang="scss" scoped>
  .container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 100;

    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1;
    div {
      height: 100%;
    }
  }
</style>
