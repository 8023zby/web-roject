<template>
<div class="container">
  <div class="bottom">
    <el-form :model="searchParams" style="display:flex;flex-wrap: wrap;">
      <el-form-item label="报告日期:" label-width="75px">
        <el-radio-group v-uni="'weijizhi_baogaoriqi_zuijinjitian'" v-model="reportDate" @change="selectDate">
          <el-radio :label="item.labelId" v-for="item in radioList" :key="item.labelId">{{ item.labelName }}</el-radio>
        </el-radio-group>

        <el-date-picker
          @change="selectDate(reportDate)"
          v-uni="'weijizhi_baogaoriqi_xuanzekaishiriqi'"
          style="width:182px;margin-left: 12px"
          :disabled="reportDate !== '11'"
          v-model="searchParams.beginDate"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
        <span style="padding: 0 11px">至</span>
        <el-date-picker
          @change="selectDate(reportDate)"
          v-uni="'weijizhi_baogaoriqi_xuanzejiehsuriqi'"
          style="width:182px"
          :disabled="reportDate !== '11'"
          v-model="searchParams.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="床号:" label-width="50px" style="margin-left:24px">
        <el-input v-uni="'weijizhi_chuanghao'" v-model="searchParams.bedName" style="width:182px;"></el-input>
      </el-form-item>

      <el-form-item :label="title" label-width="75px" style="margin-left:24px">
        <el-input v-uni="'weijizhi_jianchaxiangmu'" v-model="searchParams.projectContent" style="width:182px;"></el-input>
      </el-form-item>

      <el-form-item label="接收人:" label-width="64px">
        <el-input v-uni="'weijizhi_jieshouren'" v-model="searchParams.receiveUser" style="width:182px;"></el-input>
      </el-form-item>
      <el-form-item class="button">
        <el-button v-uni="'weijizhi_search'" @click="query" type="primary">查询</el-button>
        <el-button v-uni="'weijizhi_reset'" @click="reset()" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div style="float: right;margin: 13px;">
    <el-button v-uni="'weijizhi_lieshezhi'" @click="setupColm" class="btn" style="margin-top:10px" type="primary">
      列设置
    </el-button>
  </div>
  </div>
</template>

<script>
export default {
  props: ['searchParams', 'title'],
  data () {
    return {
      form: {
        recordType: 1,
        beginDate: null,
        endDate: null,
        bedName: null,
        projectContent: null,
        receiveUser: null
      },
      reportDate: '7',
      radioList: [{
        labelName: '最近三天',
        labelId: '3'
      }, {
        labelName: '最近7天',
        labelId: '7'
      }, {
        labelName: '最近一个月',
        labelId: '9'
      }, {
        labelName: '自定义',
        labelId: '11'
      }],
      value1: ''
    }
  },
  components: {
    // LayoutList: () => import('../../../components/nrms/layout/list.vue')
  },
  created () {
  },
  methods: {
    query () {
      if (!this.searchParams.beginDate) {
        this.$message({
          message: '请选择开始时间',
          type: 'warning'
        })
        return false
      }
      if (!this.searchParams.endDate) {
        this.$message({
          type: 'warning',
          message: '请选择结束时间'
        })
        return false
      }
      this.$emit('selectData', this.reportDate)
    },
    reset () {
      this.reportDate = '7'
      this.searchParams.beginDate = this.getDay(-6) + ' 00:00:00'
      this.searchParams.endDate = this.getDay(0) + ' 23:59:59'
      this.searchParams.bedName = null
      this.searchParams.receiveUser = null
      this.searchParams.projectContent = null
      this.searchParams.page = 1
      this.searchParams.size = 10
      this.query()
    },
    setupColm () {
      this.$emit('setupColm')
    },
    selectDate (val) {
      const endDate = this.getDay(0)
      if (val === '3') {
        this.searchParams.beginDate = this.getDay(-2) + ' 00:00:00'
        this.searchParams.endDate = endDate + ' 23:59:59'
      } else if (val === '7') {
        this.searchParams.beginDate = this.getDay(-6) + ' 00:00:00'
        this.searchParams.endDate = endDate + ' 23:59:59'
      } else if (val === '9') {
        this.searchParams.beginDate = this.getDay(-29) + ' 00:00:00'
        this.searchParams.endDate = endDate + ' 23:59:59'
      } else if (val === '11') {
        if (this.searchParams.endDate.indexOf('23:59:59') > -1) {
          this.searchParams.endDate = this.searchParams.endDate
        } else {
          this.searchParams.endDate = this.searchParams.endDate + ' 23:59:59'
        }
      }
      console.log(this.searchParams, '查询条件')
    },
    getDay (day) {
      var today = new Date()

      const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day

      today.setTime(targetday_milliseconds) // 注意，这行是关键代码

      var tYear = today.getFullYear()

      var tMonth = today.getMonth()

      var tDate = today.getDate()

      tMonth = this.doHandleMonth(tMonth + 1)

      tDate = this.doHandleMonth(tDate)

      return tYear + '-' + tMonth + '-' + tDate
    },

    doHandleMonth (month) {
      var m = month
      if (month.toString().length == 1) {
        m = '0' + month
      }
      return m
    }
  }
}
</script>

<style scoped lang="scss">
// @import "../../../assets/nrms/css/self_common";
.row2 {
  display: flex;
  width: max-content;
  /deep/ .el-input__inner {
    width: 200px;
  }
}
/deep/.button {
  .el-form-item__content {
    margin-left: 38px !important;
  }
}
.bottom::after{
  content: '';
  clear: both;
  height: 1px;
  width: calc(100% + 34px);
  display: block;
  background: #EBEBEB;
  left: 0px;
  position: absolute;
}
</style>
