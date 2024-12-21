<template>
  <layout v-loading="loading">
    <div slot="aside">
      <patient-list
        @initPatient="initPatient"
        initRowType="in"
        initRowIndex="0"
      />
    </div>
    <div slot="main">
      <listLayout>
        <div slot="left_btn" class="tool-bar">
          <el-button
            type="warning"
            size="small"
            @click="add"
            icon="el-icon-plus"
            v-if="patient.patientType == EPatientType.in || patient.outHospitalFlag == EOutHospitalFlag.return"
            >添加
          </el-button>
          <el-button
            type="warning"
            size="small"
            icon="el-icon-plus"
            v-else
            disabled
            >添加
          </el-button>
        </div>
        <div slot="query" class="query-items">
          <ul class="menu" v-if="tempList && tempList.length">
            <li
              v-for="(item, index) in tempList"
              :key="index"
              class="menu-item"
              @click="changeAssId(item)"
              :class="{ active: item.assId == searchObj.assId }"
            >
              <span>{{ item.assName }}</span>
            </li>
          </ul>
          <el-form
            class="demo-form-inline"
            :inline="true"
            :model="searchObj"
            ref="formSearch"
          >
            <el-form-item label="时间:" prop="startTime" style="margin-right: 10px">
              <el-date-picker
                v-model="searchObj.startTime"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item style="margin: 12px 0">
              <span style="font-size: 14px;color: #666">至</span>
            </el-form-item>
            <el-form-item prop="endTime" style="margin-left: 10px">
              <el-date-picker
                v-model="searchObj.endTime"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <div class="typt-search-btn">
                <el-button
                  type="primary"
                  class="el-button-radius"
                  icon="el-icon-search"
                  @click="getData"
                  size="small"
                  >搜索
                </el-button>
                <el-button type="text" @click="resetSearchObj">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div slot="main" class="main-list table">
          <!-- 表格 -->
          <el-table :data="dataList" stripe ref="table" height="100%">
            <el-table-column
              prop="assessmentTime"
              label="评估时间"
              min-width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="grade"
              label="分数"
              min-width="80"
              align="center"
            ></el-table-column>
            <el-table-column
							v-if="hiddenLevel"
              prop="riskLevel"
              label="风险级别"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                <div class="levelColor-main">
                  <div class="levelColor-value">{{ scope.row.riskLevel }}</div>
                  <div
                    class="levelColor-color"
                    :class="{ haslevelColor: scope.row.levelColor }"
                    :style="{ background: scope.row.levelColor  }"
                  ></div>
                  <div class="clear-both"></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="assessPerson"
              label="评估人"
              min-width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <template>
                  <el-button @click="edit(scope.row)" type="text"
                    v-if="patient.patientType != EPatientType.out || patient.outHospitalFlag == EOutHospitalFlag.return"
                    >编辑
                  </el-button>
                  <el-button @click="edit(scope.row)" type="text"
                    v-else
                    >查看
                  </el-button>
                  <el-button type="textred" @click="delRecord(scope.row)" :disabled="patient.patientType == EPatientType.out && patient.outHospitalFlag != EOutHospitalFlag.return"
                    >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div slot="footer" class="page-bar">
          <!--组件页码显示-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page_current"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page_total"
          >
          </el-pagination>
        </div>
      </listLayout>
    </div>
  </layout>
</template>
<script>
import layout from '../../../components/nrms/layout/aside'
import listLayout from '../../../components/nrms/layout/list'

import PatientList from '../../../components/nrms/PatientList'
import { ApiAssManage } from '../../../api/nrms/index'
import { EOutHospitalFlag, EPatientType } from '../../../assets/nrms/enum/patient'

export default {
  name: 'partrol_list',
  props: ['modifyData', 'params'],

  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 0,
      // 修改、添加相关
      showDialog: false,
      saveDataFlag: true,
      // 患者信息
      patient: {},
      // 当前登录用户信息
      current_account: {
        id: '',
        account: '',
        empName: '',
        deptName: '',
        password: ''
      },
      dataList: [],
      managerListParams: {
        assClass: 10,
        page: '',
        size: ''
      },
      temp: {},
      tempList: [],
      searchObj: {
        patientId: '',
        page: 1,
        size: 10,
        assClass: '10',
        assId: '',
        startTime: '',
        endTime: '',
        sort: {
          ass_times: 2// 1升序2降序
        }
      },
      assId: '',
      moduleId: '',
      EPatientType,
      EOutHospitalFlag,
      hiddenLevel: true
    }
  },
  async created () {
    // 初始化
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    let userId = localStorage.getItem('userId') || ''
    this.current_account.id = empInfo.empId
    this.current_account.account = userId
    this.current_account.empName = empInfo.empName
    this.current_account.deptName = deptInfo.deptName
    this.current_account.deptId = deptInfo.deptId
    await this.getManagerList()
  },
  activated () {
    if (this.searchObj.patientId && this.searchObj.assId) {
      this.resetSearchObj()
    }
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    initPatient (patient, type = 0) {
      this.patient = patient
      this.$set(this.patient, 'patientType', type)
      console.log(this.patient.patientType)
      if (this.searchObj.patientId != patient.patientId) {
        this.searchObj.patientId = patient.patientId
        this.resetSearchObj()
      }
    },
    async getData () {
      try {
        this.searchObj.patientId = this.patient.patientId
        let res = await ApiAssManage.getList(this.searchObj)
        let temp = {}
        if (this.searchObj.page == 1) this.dataList = []
        if (res.data.list.length > 0) {
          this.dataList = res.data.list
        }
        this.page_total = res.data.total
      } catch (error) {}
    },
    /* 获取表单列表 */
    async getManagerList () {
      try {
        let res = await ApiAssManage.assMangerList(this.managerListParams)
        this.tempList = res.data
        this.changeAssId(this.tempList[0])
      } catch (error) {}
    },

    openDialog () {
      if (!this.patient.patientId) {
        this.$message.error('请先选择患者！')
        return false
      }
      this.showDialog = true
    },
    add () {
      this.showDialog = false
      if (JSON.stringify(this.temp) == '{}') {
        this.$message({
          type: 'error',
          message: '请先配置风险评估单'
        })
        return false
      }
      let temp = this.temp
      this.$emit('option-changed', 'add', { patient: this.patient, temp }, {})
    },
    edit (row) {
      console.log(row, '--------------')
      let temp = {
        assId: row.ass_id,
        assName: row.ass_name,
        assStyle: row.ass_style,
        moduleJson: JSON.parse(row.module_json),
        moduleId: row.module_id,
        authControl: row.auth_control,
        assCode: row.ass_code
      }
      this.$emit(
        'option-changed',
        'add',
        { patient: this.patient, temp, row },
        {}
      )
    },
    delRecord (row) {
      this.$confirm('是否确认删除？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(async () => {
        try {
          let res = await ApiAssManage.delete(row.ass_record_id)
        } catch (error) {
          this.$message.error(error.message)
          return
        }
        if (this.page_total % 10 == 1 && this.searchObj.page > 1) {
          this.searchObj.page--
        }
        this.$message.success('删除成功！')
        this.getData()
      })
    },
    getPatrolContents () {
      let _this = this
      _this.patrolObj.patrolContent = ''
      for (let item of _this.basePatrolObj) {
        if (item.patrolType == _this.patrolObj.patrolType) {
          _this.basePatrolContents = JSON.parse(item.patrolContent)
        }
      }
    },
    handleSizeChange (val) {
      this.searchObj.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.searchObj.page = val
      this.getData()
    },
    resetSearchObj () {
      this.searchObj.startTime = ''
      this.searchObj.endTime = ''
      if (!this.searchObj.patientId || !this.searchObj.assId) {
        return
      }
      this.handleCurrentChange(1)
    },
    formatDate (date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length)
          )
        }
      }
      return fmt
    },
    indexMethod (index) {
      return (this.searchObj.page - 1) * this.searchObj.size + index + 1
    },
    changeAssId (assItem) {
      this.searchObj.assId = assItem.assId
      this.moduleId = assItem.moduleId
      if (this.moduleId == '10031' || this.moduleId == '10032' || this.moduleId == '10042') {
        this.hiddenLevel = false
      } else {
        this.hiddenLevel = true
      }
      this.temp = assItem
      this.resetSearchObj()
    }
  },

  components: {
    PatientList,
    layout,
    listLayout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
/deep/ .assSelect {
  .el-input__inner {
    height: 34px;
    width: 300px;
  }
}
.menu {
  margin: 20px 14px 0;
  background: #edf6fe;
  padding: 12px 14px 2px;
  display: flex;
  flex-wrap: wrap;
  .menu-item {
    margin-bottom: 10px;
    margin-right: 10px;
    height: 28px;
    padding: 0 12px;
    line-height: 28px;
    border-radius: 2px;
    cursor: pointer;
    &:hover {
      color: #1e87f0;
    }
    &.active {
      background: #1e87f0;
      color: #fff;
    }
  }
}
.levelColor-main {
  text-align: center;
  /*border: 1px solid red;*/
  // width: 100px;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  .levelColor-color {
    // float: left;
    width: 16px;
    height: 16px;
    margin: 0 0 0 10px;
    // border: 1px solid #f2f6fc;
    // background: #ffffff;
    border-radius: 2px;
    &.haslevelColor {
      border: 1px solid #f2f6fc;
    }
  }

  .levelColor-value {
    // float: left;
    height: 16px;
    line-height: 16px;
    color: #666666;
    font-size: 14px;
  }
}
/deep/ .el-icon-time::before {
  font-size: 14px;
}
</style>
