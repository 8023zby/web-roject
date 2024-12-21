<template>
  <div class="container"
       v-loading="loading">
    <layout_list>
      <!-- 表格 -->
      <div slot="main"
           class="main-list table">
        <el-table
          :data="waitingPatientList"
          highlight-current-row
          height="100%"
          stripe
        >
          <!-- <el-table-column type="index" label="序号" width="60" align='center'>
            <template scope="scope">
              <span>{{(selectCondition.page - 1) * selectCondition.size + scope.$index + 1}}</span>
            </template>
          </el-table-column> -->
          <el-table-column align='center'
                           prop="patientId"
                           label="患者ID"/>
          <el-table-column align='center'
                           prop="inpNo"
                           label="住院号"/>
          <el-table-column align='center'
                           prop="patientName"
                           label="患者姓名"/>
          <el-table-column align='center'
                           prop="sex"
                           label="性别"/>
          <el-table-column align='center'
                           label="出生日期">
            <template slot-scope="scope">
              <span>{{scope.row.birthday|formatDateTimeYMD}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center'
                           prop="age"
                           label="年龄"/>
          <el-table-column align='center'
                           prop="diagnose"
                           label="门诊诊断"
                           show-overflow-tooltip/>
          <el-table-column align='center'
                           label="入院时间"
          >
            <template slot-scope="scope">
              <span>{{scope.row.inTime|formatDateTimeYMD}}</span><br/>
              <span>{{scope.row.inTime|formatDateTimeHM}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center'
                           prop="inFqcy"
                           label="入院次数"/>
          <el-table-column align='center'
                           prop="contactName"
                           label="联系人姓名"/>
          <el-table-column align='center'
                           prop="contactNumber"
                           label="联系人电话"/>
          <el-table-column align='center'
                           prop="contactRelation"
                           label="与患者关系"/>

          <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
              <router-link :to="{name:sonPath,query:{inDeptPatient:scope.row}}">
                <el-button :key="'dairuhuanzhe_ruke' + scope.row.patientId " v-uni:[scope.row.patientId]="'dairuhuanzhe_ruke'" type="text"
                >入科
                </el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div slot="footer" class="page-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="selectCondition.page"
          :page-size="selectCondition.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total"
        >
        </el-pagination>
      </div>
    </layout_list>
    <router-view></router-view>
  </div>
</template>

<script>
import layout_list from '../../../components/bnms/layout/list'
import { ApiBedCard } from '../../../api/bnms/index'
import moment from 'moment'

export default {
  name: 'OutHospital',
  components: { layout_list },
  data () {
    return {
      waitingPatientList: [],
      loading: false,
      page_current: 1,
      page_total: 0,
      selectCondition: {
        page: 1,
        size: 10,
        deptId: ''
      },
      outHospitalVisible: false,
      outHospitalSDVisible: false,
      outHospitalCurrent: {},
      sonPath: 'in-dept-son'
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
  watch: {
    '$route' () {
      if (!this.$route.path.includes('in-dept-son_fakeRouter')) {
        this.getData()
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      ApiBedCard.patientWaitingList(this.selectCondition).then(res => {
        this.waitingPatientList = res.data.list
        this.page_total = res.data.total
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.selectCondition.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.selectCondition.page = val
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

<style lang="scss" scoped>
  @import "../../../assets/bnms/css/self_common";

  .container {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    height: 100%;
    position: relative;
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
  /deep/ .el-button--mini, .el-button--small{
    font-size:14px;
  }
</style>
