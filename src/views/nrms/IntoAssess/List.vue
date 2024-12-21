<template>
  <layout v-loading="loading">
    <div slot="aside">
      <!-- 患者列表 -->
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0" />
    </div>
      <listLayout slot="main">
        <div slot="left_btn" class="tool-bar">
          <el-button
            type="warning"
            size="small"
            @click="add"
            icon="el-icon-plus"
            v-if="patient && patient.patientType == EPatientType.in"
          >添加</el-button>
        </div>
        <div slot="main" class="main-list table">
          <!-- 表格 -->
          <el-table :data="dataList" stripe ref="table" height="100%">
            <el-table-column align="center" width="50"></el-table-column>
            <!-- <el-table-column type="index" align="center" label="序号" width="60" :index="indexMethod"></el-table-column> -->
            <el-table-column prop="ass_name" label="转入评估单名称" min-width="80" align="center"></el-table-column>
            <el-table-column prop="create_user_name" label="创建者" min-width="80" align="center"></el-table-column>
            <el-table-column label="创建时间" min-width="80" align="center">
              <template slot-scope="scope">
                {{formatTime(scope.row.create_time,'YYYY-MM-DD HH:mm')}}
              </template>
            </el-table-column>
            <el-table-column prop="update_user_name" label="更新者" min-width="80" align="center"></el-table-column>
            <el-table-column label="更新时间" min-width="80" align="center">
              <template slot-scope="scope">
                {{formatTime(scope.row.update_time,'YYYY-MM-DD HH:mm')}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <template>
                  <el-button @click="edit(scope.row)" type="text" v-if="patient && patient.patientType == EPatientType.in">编辑</el-button>
                  <el-button @click="edit(scope.row)" type="text" v-else>查看</el-button>
                  <el-button
                    type="textred"
                    @click="delRecord(scope.row)"
                    v-if="patient && patient.patientType == EPatientType.in"
                  >删除</el-button>
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
            :current-page.sync="searchObj.page"
            :page-sizes="[ 10, 20, 30, 40, 50, 100]"
            :page-size="searchObj.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page_total"
          ></el-pagination>
        </div>
      </listLayout>
    <template>
    <!--新增、编辑对话框-->
    <el-dialog
      title="添加"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="showDialog"
      width="600px"
    >
      <div class="intoAssess-type-add">
        <label for class="intoAssess-type-label">请选择手术评估单类型：</label>
        <el-radio-group v-model="intoAssessType" class="intoAssess-type-radio">
          <el-radio v-for="item in intoAssessList" :key="item.moduleId" :label="item.assId">{{item.name}}</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="addConfirm">确认</el-button>
      </div>
    </el-dialog>
    </template>
  </layout>
</template>
<script>
import layout from '../../../components/nrms/layout/aside'
import listLayout from '../../../components/nrms/layout/list'
import PatientList from '../../../components/nrms/PatientList'
import { ApiAssManage } from '../../../api/nrms'
import { EAssClass } from '../../../assets/nrms/enum/formManage'
import { EPatientType } from '../../../assets/nrms/enum/patient'

const moment = require('moment')

export default {
  name: 'partrol_list',
  props: ['modifyData', 'params'],

  data () {
    return {
      loading: false,
      page_total: 0,
      // 修改、添加相关
      showDialog: false,
      saveDataFlag: true,
      intoAssessType: '', // 手术评估单类型
      intoAssessList: [], // 手术评估单模板列表
      addOperationType: '',
      patient: {}, // 患者信息,
      // 当前登录用户信息
      current_account: {
        id: '',
        account: '',
        empName: '',
        deptName: '',
        password: ''
      },
      dataList: [],
      // 查询参数
      searchObj: {
        assClass: '8',
        condition: [],
        page: 1,
        patientId: '',
        size: 10,
        sort: {
          ass_date: 1
        }
      },
      // 查询手术评估单模板列表参数
      managerListParams: {
        assClass: EAssClass.intoAssess,
        page: 1,
        size: 10
      },
      EPatientType
    }
  },
  computed: {
    // 搜索栏选择框参数
    intoAssessArr () {
      let arr = JSON.parse(JSON.stringify(this.intoAssessList))
      if (!arr || !arr.length) {
        return []
      }
      arr.unshift({
        name: '全部',
        assType: '',
        assTimes: ''
      })
      return arr
    }
  },
  mounted () {
    // 初始化
    this.getManagerList()
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    let userId = localStorage.getItem('userId') || ''
    this.current_account = {
      ...this.current_account,
      id: empInfo.empId,
      account: userId,
      empName: empInfo.empName,
      deptName: deptInfo.deptName
    }
  },
  activated () {
    this.searchObj.patientId && this.getData()
  },
  // updated() {
  //   this.$nextTick(() => {
  //     this.$refs.table.doLayout();
  //   });
  // },
  methods: {
    // 初始化
    initPatient (patient, type = 0) {
      this.patient = patient
      if (!this.patient) {
        this.dataList = []
        return
      }
      this.$set(this.patient, 'patientType', type)
      if (this.searchObj.patientId != patient.patientId) {
        this.searchObj.patientId = patient.patientId
        if (this.patient.patientType == 2 || this.patient.patientType == 1) {
          this.saveDataFlag = false
        } else {
          this.saveDataFlag = true
        }
        this.resetSearchObj()
        // this.getData();
      }
    },
    // 获取参数管理列表
    async getManagerList () {
      try {
        let res = await ApiAssManage.assMangerList(this.managerListParams)
        let intoAssess = []
        let list = res.data.list
        list.map((item) => {
          intoAssess.push({ ...item, name: item.assName, assTimes: 1 })
        })
        this.intoAssessList = intoAssess
      } catch (error) {
        console.log(error)
      }
    },
    // 获取数据
    async getData () {
      this.loading = true
      this.searchObj.moduleId = ''
      this.intoAssessList.map(item => {
        if (item.assId == this.searchObj.assId) {
          this.searchObj.moduleId = item.moduleId
        }
      })
      try {
        let res = await ApiAssManage.getList(this.searchObj)
        this.dataList = res.data.list
        this.page_total = res.data.total
      } catch (error) {}
      this.loading = false
    },
    // 添加
    add () {
      if (!this.intoAssessList[0]) {
        this.$message.error('请先配置转入评估单')
        return
      }
      this.$emit(
        'option-changed',
        'add',
        { intoAssess: this.intoAssessList[0], patient: this.patient },
        {}
      )
    },
    // 确认添加
    addConfirm () {
      if (!this.intoAssessType) {
        this.$message.warning('请选择手术评估单类型！')
        return
      }
      this.showDialog = false
      let intoAssess = null
      this.intoAssessList.map(item => {
        if (item.assId == this.intoAssessType) {
          intoAssess = item
        }
      })
      this.$emit(
        'option-changed',
        'add',
        { intoAssess, patient: this.patient },
        {}
      )
    },
    // 编辑
    edit (row) {
      let intoAssess = {
        assId: row.ass_id,
        assName: row.ass_name,
        assStyle: row.ass_style,
        moduleJson: JSON.parse(row.module_json),
        moduleId: row.module_id,
        info: {
          ...row
        }
      }
      this.$emit('option-changed', 'add', { intoAssess, patient: this.patient, row }, {})
    },
    // 删除
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
    // 处理size变化
    handleSizeChange (val) {
      this.searchObj.size = val
      this.getData()
    },
    // 分页当前页码变化
    handleCurrentChange (val) {
      this.searchObj.page = val
      this.getData()
    },
    // 重置搜索参数
    resetSearchObj () {
      this.searchObj = {
        ...this.searchObj,
        assClass: '8',
        condition: [],
        page: 1,
        size: 10,
        sort: {
          ass_date: 1
        }
      }
      this.getData()
    },
    hideDialog () {},
    // 序号
    indexMethod (index) {
      return (this.searchObj.page - 1) * this.searchObj.size + index + 1
    },
    formatTime (time, formatStr = 'YYYY-MM-DD HH:mm:ss') {
      if (!time) {
        return ''
      }
      return moment(time).format(formatStr)
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
.intoAssess-type-add {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 20px;
  .intoAssess-type-label {
    padding-top: 5px;
  }
}
.intoAssess-type-radio {
  display: flex;
  flex-direction: column;
  .el-radio {
    margin: 10px;
  }
}
</style>
