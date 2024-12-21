<template comments>
  <div v-loading="loading" class="container" style="width: 100%">
    <!-- left -->
    <div class="sheet_container">
      <div class="buttons">
        <el-button type="primary" size="small" @click="getSearchWeek('first')">
          首周
        </el-button>
        <el-button type="primary" size="small" @click="getSearchWeek('prev')">
          上一周
        </el-button>
        <el-button type="primary" size="small" @click="getSearchWeek('next')">
          下一周
        </el-button>
        <el-button type="primary" size="small" @click="getSearchWeek('last')"
        >尾周
        </el-button>
        <el-button type="" size="small" @click="goBack">
          返回
        </el-button>
      </div>
      <div class="sheet">
        <!--startprint-->
        <TemperatureSheet :patient="patient" :sign_item="sign_item" :cur_week_date="cur_week_date" :cur_week_in="cur_week_in" :cur_week_ss="cur_week_ss" :hours="hours" :sheet_data="sheet_data"/>
        <!--endprint-->
      </div>
    </div>
  </div>
</template>

<script>
  import { ApiTemperatureSheet, ApiSignItemSetting, ApiInAndOutDate } from '../../../../../api/nrms/index'
  import moment from 'moment'

  export default {
    name: 'temperature_sheet',
    props: ['patient'],
    data () {
      return {
        loading: false,
        sign_item: [], //体征项
        hours: [], //测量时间
        inHospitalDate: '', //住院日期
        outHospitalDate: '', //出院日期
        cur_week_index: [], //当前周的索引
        all_week_date: [], //所有日期周s
        cur_week_date: [], //当前日期周
        cur_week_in: [], //当前住院天
        cur_week_ss: [], //当前手术天
        sheet_data: {}
      }
    },
    created () {
      this.getInitData()
      //this.getData()
    },
    methods: {
      async getInitData () {
        this.loading = true
        await this.getHours()
        await this.getSignItemData()
        this.getData()
        this.loading = false
      },

      getData () {
        this.inHospitalDate = (this.patient.inTime || '').split(" ")[0];
        this.outHospitalDate = (this.patient.outHospitalTime || '').split(" ")[0];

        this.getHospitalizationDate()
        this.getSheetData()
      },
      async getHours () {
        ApiSignItemSetting.selectTimeApp({orgId: this.patient.orgId, deptId: this.patient.deptId})
          .then(res => {
            this.hours = res.data || [];
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },
      async getSignItemData () {
        ApiSignItemSetting.selectItemApp({ orgId: this.patient.orgId, deptId: this.patient.deptId, isTemperatureDisplay: 1 })
          .then(res => {
            this.sign_item = res.data || []
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },
      async getSheetData () {
        ApiTemperatureSheet.selectApp({
          orgId: this.patient.orgId,
          deptId: this.patient.deptId,
          patientId: this.patient.patientId,
          beginDate: this.cur_week_date[0],
          endDate: this.cur_week_date[this.cur_week_date.length - 1]
        })
          .then((res) => {
            this.sheet_data = res.data || {}
            this.getSSDays()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },

      getHospitalizationDate () {
        let inDate = this.inHospitalDate //入院日期
        let cur_date = this.outHospitalDate || moment().format('YYYY-MM-DD') //当前日期
        let inDateArr = [] //时间按周分组
        let diffDays = moment(cur_date).diff(moment(inDate), 'days') + 1 //获取时间差, 加上住院当天

        let _arr = []
        for (let i = 0; i < diffDays; i++) {
          //入院日期后的每一个日期
          _arr.push(moment(inDate).add(i, 'days').format('YYYY-MM-DD'))
          if (_arr.length === 7 || i === diffDays - 1) {
            this.cur_week_date = [] //当前日期周
            if (cur_date === _arr[0] || cur_date === _arr[_arr.length - 1] || moment(cur_date).isBetween(_arr[0], _arr[_arr.length - 1])) {
              this.cur_week_date = _arr
              this.cur_week_index = inDateArr.length
            }
            inDateArr.push(_arr)
            //置空
            _arr = []
          }
        }
        //如果当前周不存在或已超过出院日期显示最后一周
        if (this.cur_week_date.length === 0) {
          this.cur_week_date = inDateArr[inDateArr.length - 1]
          this.cur_week_index = inDateArr.length - 1
        }
        this.all_week_date = inDateArr
        this.getInDays()
      },
      getInDays () {
        this.cur_week_in = [] //当前住院天
        let inDate = this.inHospitalDate
        //计算住院天数
        for (let x = 0; x < this.cur_week_date.length; x++) {
          let _d = this.cur_week_date[x]
          let day1 = moment(_d).diff(moment(inDate), 'days') + 1
          this.cur_week_in.push(day1 >= 1 ? day1 : '')
        }
      },
      //目前 手术日期先从临床事件中获取
      //以后再说以后
      getSSDays () {
        this.cur_week_ss = [] //当前手输天
        let eventData = this.sheet_data.eventData || []
        let ssDate = [] //手术/分娩时间
        for (let i = 0; i < eventData.length; i++) {
          let _d = eventData[i]
          if (_d['applyValue'] === '手术' || _d['applyValue'] === '分娩') {
            ssDate.push(_d['recordDate'])
          }
        }
        //计算住院天数
        for (let x = 0; x < this.cur_week_date.length; x++) {
          let _d = this.cur_week_date[x]
          let ss = []
          for (let y = 0; y < ssDate.length; y++) {
            let diffDay = moment(_d).diff(moment(ssDate[y]).format('YYYY-MM-DD'), 'days') + 1
            //prd
            let s = diffDay <= 1 || (diffDay - 1) > 14 ? '' : diffDay - 1
            s && ss.push(s)
          }
          this.cur_week_ss.push(ss.length > 0 ? ss.join('/') : '')
        }
      },
      getSearchWeek (type) {
        if (this.isPatientEmpty()) {
          return false
        }
        if (type === 'first') {
          if (this.cur_week_index === 0) {
            this.$message.warning('已经是首周！')
            return false
          }
          this.cur_week_index = 0
          this.cur_week_date = this.all_week_date[this.cur_week_index]
        } else if (type === 'prev') {
          if (this.cur_week_index === 0) {
            this.$message.warning('已经是首周！')
            return false
          }
          this.cur_week_index -= 1
          this.cur_week_date = this.all_week_date[this.cur_week_index]
        } else if (type === 'next') {
          if (this.cur_week_index === this.all_week_date.length - 1) {
            this.$message.warning('已经是尾周！')
            return false
          }
          this.cur_week_index += 1
          this.cur_week_date = this.all_week_date[this.cur_week_index]
        } else if (type === 'last') {
          if (this.cur_week_index === this.all_week_date.length - 1) {
            this.$message.warning('已经是尾周！')
            return false
          }
          this.cur_week_index = this.all_week_date.length - 1
          this.cur_week_date = this.all_week_date[this.cur_week_index]
        }
        this.getInDays()
        this.getSSDays()
        this.getSheetData()
      },

      isPatientEmpty () {
        if (!this.patient.patientId) {
          this.$message.warning('请先选择患者！')
          return true
        }
        return false
      },
      goBack () {
        this.$emit('option-changed', 'list')
      }
    },
    watch: {
      'patient' (val) {
        this.patient = val
        this.getData()
      }
    },
    components: {
      TemperatureSheet: () => import('../../../../../components/nrms/TemperatureSheet')
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    display: flex;
    justify-content: space-between;
    height: 100%;

    > div {
      height: 100%;
    }
  }

  .sheet_container {
    flex: 1;
    width: 0;
    overflow: auto;
    text-align: center;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;

    .buttons {
      padding: 10px;
      text-align: right;
      position: relative;

      > .sign_show_btn {
        display: none;
        position: absolute;
        top: 80px;
        right: 0;
        padding: 5px;
        background-color: #fff;
        border-radius: 8px 0 0 8px !important;
        z-index: 9;
      }
    }
  }

  .sheet {
    flex: 1;
    height: 0;
    overflow: auto;
    padding: 20px 0 10%;
  }
</style>
