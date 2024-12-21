<template>
  <div class="typt-list-container nrms-pad">
    <div class="typt-list-add-div" v-if="patientData.type==='2'">
      <div class="action_div">
        <el-button type="primary" size="small" @click="$emit('option-changed', 'add',{patientData:patient})">新增出入量</el-button>
      </div>
    </div>
    <!--列表-->
    <!--:span-method="arraySpanMethod"-->
    <el-table
      :data="tableData"
      v-loading="loading"
      stripe
      height="100%"
    >
      <el-table-column
        prop="recordTime"
        align="center"
        width="200"
        label="时间">
        <template slot-scope="scope">
          <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.recordTime}}</span>
          <span v-else>{{scope.row.recordTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入量（ml）" align="center">
        <el-table-column
          prop="intakeMode"
          align="center"
          :show-overflow-tooltip = "true"
          label="方式">
          <template slot-scope="scope">
            <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.intakeMode}}</span>
            <span v-else>{{scope.row.intakeMode}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="intakeProject"
          align="center"
          :show-overflow-tooltip = "true"
          label="项目">
          <template slot-scope="scope">
            <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.intakeProject}}</span>
            <span v-else>{{scope.row.intakeProject}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="intakeStandby"
          align="center"
          :show-overflow-tooltip = "true"
          label="备用量">
          <template slot-scope="scope">
            <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.intakeStandby}}</span>
            <span v-else>{{scope.row.intakeStandby}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="intakeAmount"
          align="center"
          :show-overflow-tooltip = "true"
          label="实入量">
          <template slot-scope="scope">
            <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.intakeAmount}}</span>
            <span v-else>{{scope.row.intakeAmount}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="出量（ml）" align="center">
        <el-table-column
          prop="outputMode"
          align="center"
          :show-overflow-tooltip = "true"
          label="方式">
          <template slot-scope="scope">
            <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.outputMode}}</span>
            <span v-else>{{scope.row.outputMode}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="outputProject"
          align="center"
          :show-overflow-tooltip = "true"
          label="项目">
          <template slot-scope="scope">
            <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.outputProject}}</span>
            <span v-else>{{scope.row.outputProject}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="outputCharacters"
          align="center"
          :show-overflow-tooltip = "true"
          label="性状">
          <template slot-scope="scope">
            <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.outputCharacters}}</span>
            <span v-else>{{scope.row.outputCharacters}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="outputAmount"
          align="center"
          :show-overflow-tooltip = "true"
          label="量">
          <template slot-scope="scope">
            <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.outputAmount}}</span>
            <span v-else>{{scope.row.outputAmount}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="nurseName"
        align="center"
        :show-overflow-tooltip = "true"
        label="护士签名">
        <template slot-scope="scope">
          <span style="color: #f56c6c" v-if="scope.row.type===3">{{scope.row.nurseName}}</span>
          <span v-else>{{scope.row.nurseName}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import BaseManage from '../../../../../assets/nrms/mixins/BaseManage'
export default {
  name: 'InOut',
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
      pageInfo: {
        currentPage: 1,
        size: 1000
      },
      modelName: '出入量记录',
      formSearchDataStatic: {
        patientId: ''
      },
      patientData: {},
      url: '/nrms/web-nr/intake-output'
    }
  },
  created () {
    this.patientData = this.patient
    this.formSearchDataStatic.patientId = this.patient.patientId
    this.getData()
  },
  methods: {
    // 合并行
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 10 || columnIndex === 11) {
        return {
          rowspan: row.rowCount,
          colspan: 1
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    }
  }
}
</script>
