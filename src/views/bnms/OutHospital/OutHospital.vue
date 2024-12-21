<template>
  <div class="container" v-loading="loading">
    <layout-list>
      <div slot="query" class="query-items">
        <el-form :inline="true" v-uni="'huazhechuyuanchaxunbiaodan'" :model="searchForm" ref="searchForm" label-suffix=":">
          <el-form-item label="出院日期" prop="date">
            <el-date-picker
              v-model="searchForm.date"
              :clearable="false"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="bedName" label="床号">
            <el-input
              v-model="searchForm.bedName"
              placeholder="请输入"
              autocomplete="off"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="patientName" label="患者姓名">
            <el-input
              v-model="searchForm.patientName"
              placeholder="请输入"
              autocomplete="off"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchFormSubmit()"
              v-uni="'chuyuanhuanzhe_search'"
            >搜索
            </el-button>
            <el-button type="text" @click="searchFormReset()" v-uni="'chuyuanhuanzhe_reset'">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div slot="main" class="main-list table">
        <el-table
          :data="patientOutHospitalList"
          highlight-current-row
          height="100%"
          stripe

        >
          <!-- <el-table-column label="序号" width="60" align='center' >
            <template scope="scope">
              <span>{{(searchForm.page - 1) * searchForm.size + scope.$index + 1}}</span>
            </template>
          </el-table-column> -->
          <el-table-column align='center'
                           prop="bedName"
                           label="床号" />
          <el-table-column align='center'
                           prop="patientName"
                           label="姓名" />
          <el-table-column align='center'
                           prop="sex"
                           label="性别" />
          <el-table-column align='center'
                           prop="age"
                           label="年龄"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column align='center'
                           label="入院时间">
            <template slot-scope="scope">
              <div>{{scope.row.inTime|formatDateTimeYMDHMS}}</div>
            </template>
          </el-table-column>
          <el-table-column align='center'
                           prop="outHospitalDiagnose"
                           label="出院诊断"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <!--<el-tooltip class="item" effect="dark" placement="bottom" show-overflow-tooltip="true">
                <div slot="content" class="multiple">{{scope.row.outHospitalDiagnose}}</div>
                <div class="outHos">{{scope.row.outHospitalDiagnose}}</div>
              </el-tooltip>-->
              {{scope.row.outHospitalDiagnose}}
              <!-- <span class="multiline-ellipsis">
                 {{scope.row.outHospitalDiagnose}}
               </span>-->
            </template>
          </el-table-column>
          <el-table-column align='center'
                           label="出院时间">
            <template slot-scope="scope">
              <div>{{scope.row.outHospitalTime|formatDateTimeYMDHMS}}</div>
            </template>
          </el-table-column>
          <el-table-column align='center'
                           label="数据状态">
            <template slot-scope="scope">
              {{scope.row.outHospitalFlag===1?'已解锁':'锁定' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
              <!-- <el-button @click="resetOutHospitalFlag(scope.row.outHospitalId,scope.row.outHospitalFlag===1?2:1)" type="text"
                          :style="{color:(scope.row.outHospitalFlag===1?'orange':'')}"
               >{{scope.row.outHospitalFlag===1?'取消召回':'出院召回' }}
               </el-button>-->
              <el-button :key="'chuyuanhuanzhe_shujujiesuo' + scope.row.out_hospital_id" v-uni:[scope.row.out_hospital_id]="'chuyuanhuanzhe_shujujiesuo'" @click="resetCurrent(scope.row)" type="text"
                         :style="{color:(scope.row.outHospitalFlag===1?'#13CE66':'#1E87F0')}"
              >{{scope.row.outHospitalFlag===1?'数据锁定':'数据解锁' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div slot="footer" class="page-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="searchForm.page"
          :page-size="searchForm.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total"
        >
        </el-pagination>
      </div>
    </layout-list>

    <el-dialog title="数据解锁" :visible.sync="outHospitalVisible" class="dialog" :show-close="false">
      <div style="padding-bottom: 30px;text-align: center"><span>确认要对患者进行数据解锁?</span></div>
      <el-form :inline="false">
        <el-form-item label="患者ID:">
          <el-input type="text" v-model="outHospitalCurrent.patientId" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input type="text" v-model="outHospitalCurrent.patientName" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="主治医生:">
          <el-input type="text" v-model="outHospitalCurrent.doctorName" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="责任护士:">
          <el-input type="text" v-model="outHospitalCurrent.nurseName" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="房间号:">
          <el-input type="text" v-model="outHospitalCurrent.roomName" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="床位号:">
          <el-input type="text" v-model="outHospitalCurrent.bedName" disabled>
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'chuyuanhuanzhe_sjjs_cancel'" @click="outHospitalVisible = false" round class="pad-cancel">取消</el-button>
        <el-button v-uni="'chuyuanhuanzhe_sjjs_save'" type="primary" @click="resetOutHospitalFlag" round class="pad-primary">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="数据锁定" :visible.sync="outHospitalSDVisible" class="dialog" :show-close="false">
      <div style="text-align: left;display: flex; justify-content: center;">
        <span>确认要对该患者:<br/>患者ID：{{outHospitalCurrent.patientId}},姓名：{{outHospitalCurrent.patientName}}<br/>进行数据锁定操作吗?</span>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'chuyuanhuanzhe_sjsd_cancel'" @click="outHospitalSDVisible = false" round class="pad-cancel">取消</el-button>
        <el-button v-uni="'chuyuanhuanzhe_sjsd_save'" type="primary" @click="resetOutHospitalFlag" round class="pad-primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import layoutList from '../../../components/bnms/layout/list'
import { ApiBedCard } from '../../../api/bnms/index'
import moment from 'moment'

export default {
  name: 'OutHospital',
  components: { layoutList },
  data () {
    return {
      patientOutHospitalList: [],
      loading: false,
      page_current: 1,
      page_total: 0,
      searchForm: {
        date: [
          moment().subtract(7, 'day').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD')
        ],
        bedName: '',
        patientName: '',
        page: 1,
        size: 10
      },
      outHospitalVisible: false,
      outHospitalSDVisible: false,
      outHospitalCurrent: {}
    }
  },
  filters: {
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
    },
    formatDateTimeYMDHMS (time) {
      if (time == null) {
        return
      }
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created () {
    this.getData()
  },
  methods: {
    searchFormSubmit () {
      this.handleCurrentChange(1)
    },
    searchFormReset () {
      this.$refs.searchForm.resetFields()
      this.handleCurrentChange(1)
    },
    getData () {
      this.loading = true
      const form = JSON.parse(JSON.stringify(this.searchForm))
      form.startDate = form.date ? (form.date[0] || '') : ''
      form.endDate = form.date ? (form.date[1] || '') : ''
      delete form.date

      ApiBedCard.patientOutHospitalList(form).then(res => {
        this.patientOutHospitalList = res.data.list || []
        this.page_total = res.data.total
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    resetCurrent (outHos) {
      if (outHos.outHospitalFlag === 1) {
        this.outHospitalSDVisible = true
      } else {
        this.outHospitalVisible = true
      }
      this.outHospitalCurrent = outHos
    },
    resetOutHospitalFlag () {
      this.outHospitalVisible = false
      this.outHospitalSDVisible = false
      ApiBedCard.patientOutHospitalRecall({
        outHospitalId: this.outHospitalCurrent.outHospitalId,
        outHospitalFlag: (this.outHospitalCurrent.outHospitalFlag === 1 ? 2 : 1)
      }).then(() => {
        this.getData()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleSizeChange (val) {
      this.searchForm.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.getData()
    }
  }
}
</script>

<style lang="scss">
  .el-tooltip__popper {
    max-width: 500px
  }
</style>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";

  /deep/ .el-tooltip__popper {
    max-width: 500px !important;
    word-wrap: break-word
  }
  /deep/ .el-button--mini, .el-button--small{
    font-size:14px;
  }
  .container {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    height: 100%;
  }

  .table {
    flex: 1;
    height: 0;
    overflow: hidden;

    td {
      .outHos {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

  .multiple {
    max-width: 500px; // 最大的宽度，必写属性
    word-wrap: break-word
  }

  .multiline-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal !important;
    word-wrap: break-word;
  }

  .dialog {
    /deep/ .el-dialog {
      width: 500px;
    }

    .el-form-item {
      width: 100px;

      /deep/ .el-form-item__label {
        width: 90px !important;
        display: inline-block;
        text-align: right;
      }

      /deep/ .el-form-item__content {
        width: 400px;
        align-items: center;

        .el-input {
          width: 290px;
        }
      }
    }

  }
</style>
