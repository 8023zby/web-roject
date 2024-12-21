<template>
  <div class="typt-list-container nrms-pad">
    <div class="typt-list-add-div" v-if="patientData.type==='2'">
      <div class="action_div">
        <el-button type="primary" size="small" @click="$emit('option-changed', 'add', {patientData:patient})">新增血糖</el-button>
      </div>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="100%"
    >
      <el-table-column
        prop="recordTime"
        align="center"
        width="200"
        label="时间">
      </el-table-column>
      <el-table-column label="血糖测量结果（mmol/L）" align="center">
        <el-table-column
          v-for="(item, index) in titData"
          :prop="item.id+'_rs'"
          align="center"
          :show-overflow-tooltip = "true"
          :formatter="formatterTit"
          :key="index"
          :label="item.label">
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="glucometerNumber"
        align="center"
        :show-overflow-tooltip = "true"
        width="200"
        label="血糖仪编号">
      </el-table-column>
      <el-table-column
        prop="nurseName"
        align="center"
        :show-overflow-tooltip = "true"
        label="护士签名">
      </el-table-column>
    </el-table>
    <!--end-->
  </div>
</template>

<script>
import BaseManage from '../../../../../assets/nrms/mixins/BaseManage'
export default {
  name: 'BloodSugar',
  mixins: [BaseManage],
  props: ['patient'],
  watch: {
    patient: {
      handler (newValue, oldValue) {
        this.patientData = this.patient
        this.formSearchDataStatic.patientId = this.patientData.patientId
        this.reloadUrl()
      }
    }
  },
  data () {
    return {
      patientData: {},
      actFlag: 'add',
      pageInfo: {
        currentPage: 1,
        size: 1000
      },
      deptName: '',
      titData: [{
        id: 1,
        label: '临时'
      },
      {
        id: 2,
        label: '空腹'
      },
      {
        id: 3,
        label: '早餐后'
      },
      {
        id: 4,
        label: '午餐前'
      }, {
        id: 5,
        label: '午餐后'
      },
      {
        id: 6,
        label: '晚餐前'
      },
      {
        id: 7,
        label: '晚餐后'
      }, {
        id: 8,
        label: '睡前'
      },
      {
        id: 9,
        label: '夜间'
      }],
      modelName: '血糖记录',
      formSearchDataStatic: {
        patientId: ''
      },
      url: '/nrms/web-nr/glucometer-record'
    }
  },
  created () {
    this.patientData = this.patient
    this.formSearchDataStatic.patientId = this.patient.patientId
    this.getData()
  },
  methods: {
    // 格式化数据
    formatterTit (row, column) {
      if (column.property === row.measurePeriod + '_rs') {
        return row.measureResult || ''
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss">
  @import "../../../../../assets/nrms/css/blood/padCss";
</style>
