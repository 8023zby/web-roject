<template>
  <div class="my-container">
    <!--  <div class="return-btn-container">
      <el-button type="primary" @click="returnBtn" class="return_btn">返回</el-button>
    </div>-->
    <div class="timeline-container">
      <el-timeline>
        <el-timeline-item icon="el-icon-s-custom" class="timeline-begin"></el-timeline-item>
        <el-timeline-item icon="n">
          <div style="overflow: hidden;text-overflow: clip;white-space: nowrap;background: white;position:absolute;left: 82px;z-index: 1;display: inline-block;width: 80px;margin-left:20px;height: 30px;border-radius:15px;border: 1px solid #E3E3E3;">
            <span style="line-height: 30px;">{{patientDetail.patient.patientIn.bedName |formsubCut}}</span>
          </div>
        </el-timeline-item>
        <el-timeline-item v-for="(item,index) in dynamicsLine" :key="index" icon="el-icon-check" is-bottom="false">
          <div class="timeline-content" style="text-align: center;width: 272px;background: transparent">
            <div style="text-align: center;width: 80px;float: left;">
              {{item.dynamicsTime|formatDateTimeYMD}}
              <br />
              {{ item.dynamicsTime |formatDateTimeHM}}
            </div>
            <div class="row-2">
              {{item.dynamicsContent}}
            </div>

          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <div class="form_btn">
    </div>
  </div>

</template>

<script>
import { ApiBedCard } from '../../../api/bnms/index'
import moment from 'moment'

export default {
  name: 'PatientDynamics',
  data () {
    return {
      dynamicsLine: [],
      patientId: ''
    }
  },
  props: ['patientDetail'],
  created () {
    this.patientId = this.patientDetail.patient.patientIn.patientId || ''
    this.getData()
  },
  filters: {
    formsubCut (val) {
      if (val == null) return
      return val.substring(0, 6)
    },
    formatDateTimeYMD (time) {
      if (time == null) {
        return
      }
      return moment(time).format('YYYY-MM-DD')
    },
    formatDateTimeHM (time) {
      if (time == null) {
        return
      }
      return moment(time).format('HH:mm:ss')
    }
  },
  methods: {
    getData () {
      ApiBedCard.patientDynamics({
        patientId: this.patientId
      })
        .then((res) => {
          this.dynamicsLine = res.data
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
    returnBtn () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.my-container {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;

  /deep/ .el-timeline-item {
    height: 60px;
  }

  /deep/ .el-timeline-item__node {
    background-color: #1b91f0;
    margin-left: 135px;
  }

  /deep/ .el-timeline-item__node--normal {
    height: 21px;
    width: 21px;
  }

  /deep/ .el-timeline-item__tail {
    position: absolute;
    left: 145px;
    height: 120%;
    border-left: 2px solid #e1f0fb;
    z-index: 0;
  }

  /deep/ .el-timeline-item__wrapper {
    padding-left: 0px;
  }

  /deep/ .el-timeline {
    display: inline-block;
  }

  .timeline-begin {
    /deep/ .el-timeline-item {
      padding-bottom: 50px;
    }

    /deep/ .el-timeline-item__node {
      background-color: #e3e3e3;
      height: 50px;
      width: 50px;
      margin-left: 120px;
    }

    /deep/ .el-timeline-item__icon {
      font-size: 30px;
    }
  }
}

.return_btn {
  float: right;
  margin-right: 20px;
  position: relative;
  top: 50%; /*偏移*/
  transform: translateY(-50%);
}

.return-btn-container {
  height: 50px;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e7ed;
}

.timeline-container {
  position: absolute;
  top: 20px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
}

.row-2 {
  position: relative;
  width: 120px;
  height: 30px;
  color: #fff;
  line-height: 30px;
  text-align: left;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  background: #eeeeee;
  color: black;
  margin-left: 220px;
  padding-left: 20px;
}

.row-2::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  top: 5px;
  left: -10px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #eeeeee;
}
</style>
