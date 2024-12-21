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
            @click="openDialog"
            icon="el-icon-plus"
            v-if="this.patient.patientType != 1 && saveDataFlag"
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
          <el-form
            class="demo-form-inline"
            :inline="true"
            :model="searchObj"
            ref="formSearch"
          >
            <el-form-item label="交接单类型:" prop="startTime">
              <el-select
                v-model="searchObj.recordType"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in recordTypeArr"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="转出科室:">
              <el-input
                v-model.trim="searchObj.turnOutDeptName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="转入科室:">
              <el-input
                v-model.trim="searchObj.turnInDeptName"
                placeholder="请输入"
              ></el-input>
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
            <el-table-column align="center" width="50"></el-table-column>
            <!-- <el-table-column
              type="index"
              align="center"
              label="序号"
              width="60"
              :index="indexMethod"
            ></el-table-column> -->

            <el-table-column
              prop="ass_name"
              label="交接单类型"
              min-width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="turnOutTime"
              label="转出时间"
              min-width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="turnOutDeptName"
              label="转出科室"
              min-width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="turnOutUser"
              label="转出护士"
              min-width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="turnInTime"
              label="转入时间"
              min-width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="turnInDeptName"
              label="转入科室"
              min-width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="turnInUser"
              label="转入护士"
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
                <template v-if="!saveDataFlag">
                  <el-button @click="edit(scope.row)" type="text"
                    >查看</el-button
                  >
                </template>
                <template v-else>
                  <el-button @click="edit(scope.row)" type="text"
                    >编辑
                  </el-button>
                  <el-button
                    type="textred"
                    @click="delRecord(scope.row)"
                    :disabled="
                      (!!scope.row.turnInDeptId ||
                      scope.row.turnOutDeptId != current_account.deptId)
                      ||
                      (patient.patientType != EPatientType.in && patient.outHospitalFlag != EOutHospitalFlag.return)
                    "
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
    <!--新增、编辑对话框-->
    <el-dialog
      title="添加交接单"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="showDialog"
      width="490px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="tCenter" style="display: flex;align-items:center;padding: 16px 20px 35px">
            <label style="margin-right: 12px">交接单类型:</label>
            <el-select size="small" style="width: 300px" class="assSelect" v-model="assId" placeholder="请选择">
              <el-option
                v-for="item in tempList"
                :key="item.assId"
                :label="item.assName"
                :value="item.assId">
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="add"
          >确认</el-button
        >
      </div>
    </el-dialog>
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
      recordTypeArr: [
        { label: '全部', value: '' }
      ],
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
        assClass: 2,
        page: 1,
        size: 10
      },
      tempList: [],
      searchObj: {
        patientId: '',
        recordType: '',
        turnOutDeptName: '',
        turnInDeptName: '',
        size: '10',
        page: '1',
        assClass: '2',
        sort: {
          turnOutTime: 2
        }
      },
      assId: '',
      EPatientType,
      EOutHospitalFlag
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
    this.searchObj.patientId && this.getData()
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
      if (this.searchObj.patientId != patient.patientId) {
        this.searchObj.patientId = patient.patientId
        if (this.patient.patientType == 2 && this.patient.outHospitalFlag != 1) {
          this.saveDataFlag = false
        } else {
          this.saveDataFlag = true
        }
        this.resetSearchObj()
      }
    },
    async getData () {
      let condition = []
      Object.keys(this.searchObj).map(key => {
        switch (key) {
          case 'recordType':
            if (this.searchObj[key]) {
              condition.push({
                key,
                value: this.searchObj[key]
              })
            }
            break
          case 'turnOutDeptName':
            if (this.searchObj[key]) {
              condition.push({
                key,
                value: this.searchObj[key]
              })
            }
            break

          case 'turnInDeptName':
            if (this.searchObj[key]) {
              condition.push({
                key,
                value: this.searchObj[key]
              })
            }
            break
          default:
            break
        }
      })
      this.searchObj.condition = condition
      this.loading = true
      try {
        let res = await ApiAssManage.getList(this.searchObj)
        this.dataList = res.data.list
        this.page_total = res.data.total
      } catch (error) {}
      this.loading = false
    },
    /* 获取表单列表 */
    async getManagerList () {
      try {
        let res = await ApiAssManage.assMangerList(this.managerListParams)
        this.tempList = res.data.list
        this.tempList.map(item => {
          this.recordTypeArr.push({
            label: item.assName,
            value: item.assName
          })
        })
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
      if (!this.assId) {
        this.$message.error('请选择交接单类型')
        return
      }
      this.showDialog = false
      let temp = null
      this.tempList.map(item => {
        if (this.assId === item.assId) {
          temp = item
        }
      })
      this.$emit('option-changed', 'add', { patient: this.patient, temp }, {})
    },
    edit (row) {
      let temp = {
        assId: row.ass_id,
        assName: row.ass_name,
        assStyle: row.ass_style,
        moduleJson: JSON.parse(row.module_json),
        moduleId: row.module_id,
        authControl: row.auth_control,
        assCode: row.ass_code
      }
      console.log(temp)
      this.$emit('option-changed', 'add', { patient: this.patient, temp }, row)
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
      this.searchObj.recordType = ''
      this.searchObj.turnInDeptName = ''
      this.searchObj.turnOutDeptName = ''
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
    }
    // indexMethod (index) {
    //   return (this.searchObj.page - 1) * this.searchObj.size + index + 1
    // }
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
</style>
