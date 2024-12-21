<template>
  <layout class="preview">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form
        :inline="true"
        label-suffix="："
      >
        <el-form-item prop="classId" label="终端">
          <el-select v-model="deviceId" @change="searchForm" @clear="resetForm" filterable placeholder="请选择" clearable>
            <el-option
              v-for="item in devData"
              :key="item.deviceId"
              :label="item.deviceName"
              :value="item.deviceId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <div class="zoom">
        <button @click="zoom(-1)" :disabled="!iframeUrl || slideValue == 5" v-uni="'kanbanyulan_zoomsmall'" />
        <button @click="zoom(1)" :disabled="!iframeUrl || slideValue == 10" v-uni="'kanbanyulan_zoombig'" />
      </div>
    </div>
    <div slot="main">
      <div v-if="!iframeUrl" class="empty">
        <div class="img">

        </div>
        <div class="text">
          请先选择终端
        </div>
      </div>
      <iframe
        v-else
        ref="kbIframe"
        style="width: 1920px; height: 1080px; transform: scale(0.5); transform-origin:top left;"
        frameborder="0"
        :src="iframeUrl"
      >
      </iframe>
    </div>
  </layout>
</template>

<script>
import layout from '../../../../components/bnms/layout/list'
import { ApiKanbanDev, ApiKanbanSwitch } from '../../../../api/bnms'

export default {
  name: 'kanban_preview',
  components: { layout },
  data () {
    return {
      orgId: '',
      deptId: '',
      slideValue: 5,
      deviceId: '',
      devData: [],
      devTouchMode: {},
      iframeUrl: ''
    }
  },
  async created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptId = deptInfo.deptId || ''
    this.orgId = deptInfo.orgId || ''
    await Promise.all([this.getDeviceModel(), this.getDevData()])
  },
  methods: {
    // 获取设备的触屏模式
    getDeviceModel () {
      ApiKanbanSwitch.select({ deptId: this.deptId })
        .then(res => {
          const data = res.data || []
          for (let i = 0; i < data.length; i++) {
            let _d = data[i]
            this.devTouchMode[_d['devId']] = _d['touchMode']
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDevData () {
      ApiKanbanDev.select({ deviceType: 'bnNursingTV', contain: 0, pageHelper: 0 })
        .then(res => {
          this.devData = res.data || []
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchForm (deviceId) {
      if (!deviceId) return

      // 触屏模式
      const touchMode = this.devTouchMode[deviceId]
      const host = location.host
      this.iframeUrl = 'http://' + host + '/ntv/index.html?orgId=' + this.orgId + '&deptId=' + this.deptId + '&devId=' + deviceId + '&touch=' + touchMode
    },
    resetForm () {
      this.deviceId = ''
      this.iframeUrl = ''
    },
    formatTooltip (val) {
      return '缩放：' + val * 10 + '%'
    },
    zoom (val) {
      this.slideValue += val
      this.$refs.kbIframe.style.transform =
        'scale(' + this.slideValue / 10 + ')'
    },
    full () {
      const ele = this.$refs.kbIframe
      if (ele.requestFullscreen) {
        ele.requestFullscreen()
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen()
      } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen()
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen()
      }
    },
    exitFullscreen () {
      if (document.exitFullScreen) {
        document.exitFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/bnms/css/self_common";
/deep/ .el-header hr {
  display: none !important;
}

/deep/ .query-items {
  padding-left: 30px;
}
/deep/ .tool-bar {
  padding-left: 30px;
  padding-top: 8px;
  padding-bottom: 30px;
}
/deep/ .el-main {
  padding: 0 28px 22px;
  > div {
    overflow: auto;
  }
}
.preview {
  height: 100%;
  overflow: auto;
  position: relative;
}
.zoom {
  width: 146px;
  /*height:40px;*/
  padding: 5px 0 3px;
  text-align: center;
  background: rgba(247, 247, 247, 1);
  border-radius: 33px;

  button {
    height: 30px;
    width: 30px;
    margin: 0 10px;
    border: none;
    background-color: transparent;
  }
  button:disabled {
    cursor: not-allowed;
  }
  button:first-child {
    /*background-color: #0e90d2;*/
    background-image: url("../../../../assets/bnms/images/btn_scale-_sel.png");
    &:disabled {
      background-image: url("../../../../assets/bnms/images/btn_scale-.png");
    }
  }
  button:last-child {
    /*background-color: blue;*/
    background-image: url("../../../../assets/bnms/images/btn_scale+_sel.png");
    &:disabled {
      background-image: url("../../../../assets/bnms/images/btn_scale+.png");
    }
  }
}
  .empty {
    background-color: #F7F7F7;
    text-align: center;
    height: 100%;
    padding-top: 12%;
    box-sizing: border-box;

    .img {
      display: inline-block;
      width: 240px;
      height: 209px;
      background-image: url("../../../../assets/bnms/images/icon_pic.png");
    }
    .text {
      margin-top: 40px;
      font-size: 20px;
      color: #999999;
    }
  }
</style>
