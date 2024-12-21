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
            :disabled="!saveDataFlag"
          >添加</el-button>
        </div>
        <div slot="query" class="query-items">
          <el-form class="demo-form-inline" :inline="true" :model="searchObj" ref="formSearch">
            <el-form-item label="手术评估单类型：" prop="startTime">
              <el-select
                v-model="searchObj.assId"
                clearable
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option
                  v-for="item in operationArr"
                  :label="item.name"
                  :value="item.assId"
                  :key="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建者/更新者：">
              <el-input v-model.trim="searchObj.userName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="typt-search-btn">
                <el-button
                  type="primary"
                  class="el-button-radius"
                  icon="el-icon-search"
                  @click="getData"
                  size="small"
                >搜索</el-button>
                <el-button type="text" @click="resetSearchObj">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div slot="main" class="main-list table">
          <!-- 表格 -->
          <el-table :data="dataList" stripe ref="table" height="100%">
            <el-table-column align="center" width="50"></el-table-column>
            <!-- <el-table-column type="index" align="center" label="序号" width="60" :index="indexMethod"></el-table-column> -->
            <el-table-column prop="assName" label="手术评估单类型" min-width="80" align="center"></el-table-column>
            <el-table-column prop="createUserName" label="创建者" min-width="80" align="center"></el-table-column>
            <el-table-column label="创建时间" min-width="80" align="center">
              <template slot-scope="scope">
                {{formatTime(scope.row.createTime,'YYYY-MM-DD HH:mm')}}
              </template>
            </el-table-column>
            <el-table-column prop="updateUserName" label="更新者" min-width="80" align="center"></el-table-column>
            <el-table-column label="更新时间" min-width="80" align="center">
              <template slot-scope="scope">
                {{formatTime(scope.row.updateTime,'YYYY-MM-DD HH:mm')}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <template v-if="!saveDataFlag">
                  <el-button @click="edit(scope.row)" type="text">查看</el-button>
                </template>
                <template v-else>
                  <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                  <el-button
                    type="textred"
                    @click="delRecord(scope.row)"
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
      <div class="operation-type-add">
        <label for class="operation-type-label">请选择手术评估单类型：</label>
        <el-radio-group v-model="operationType" class="operation-type-radio">
          <el-radio v-for="item in operationList" :key="item.moduleId" :label="item.assId">{{item.name}}</el-radio>
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
import { ApiDeptChange, ApiAssManage } from '../../../api/nrms'

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
      operationType: '', // 手术评估单类型
      operationList: [], // 手术评估单模板列表
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
        patientId: '',
        assClass: '1',
        assType: '',
        assTimes: '',
        userName: '',
        size: 10,
        page: 1,
        moduleId: '',
        assId: ''
      },
      // 查询手术评估单模板列表参数
      managerListParams: {
        assClass: 1,
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    // 搜索栏选择框参数
    operationArr () {
      let arr = JSON.parse(JSON.stringify(this.operationList))
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
        let operation = []
        let list = res.data.list
        list.map((item) => {
          operation.push({ ...item, name: item.assName, assTimes: 1 })
        })
        this.operationList = operation
      } catch (error) {
        console.log(error)
      }
    },
    // 获取数据
    async getData () {
      this.loading = true
      this.searchObj.moduleId = ''
      this.operationList.map(item => {
        if (item.assId == this.searchObj.assId) {
          this.searchObj.moduleId = item.moduleId
        }
      })
      try {
        let res = await ApiAssManage.list(this.searchObj)
        this.dataList = res.data.list
        this.page_total = res.data.total
      } catch (error) {}
      this.loading = false
    },
    // 添加
    add () {
      if (!this.patient.patientId) {
        this.$message.warning('请先选择患者！')
        return false
      }
      this.showDialog = true
    },
    // 确认添加
    addConfirm () {
      if (!this.operationType) {
        this.$message.warning('请选择手术评估单类型！')
        return
      }
      this.showDialog = false
      let operation = null
      this.operationList.map(item => {
        if (item.assId == this.operationType) {
          operation = item
        }
      })
      this.$emit(
        'option-changed',
        'add',
        { operation, patient: this.patient },
        {}
      )
    },
    // 编辑
    edit (row) {
      let operation = {
        assId: row.assId,
        assName: row.assName,
        assStyle: row.assStyle,
        moduleJson: row.moduleJson,
        moduleId: row.moduleId
      }
      this.$emit('option-changed', 'add', { operation, patient: this.patient, row }, {})
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
          let res = await ApiAssManage.delete(row.assRecordId)
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
        assClass: '1',
        assType: '',
        assTimes: '',
        moduleId: '',
        userName: '',
        size: 10,
        page: 1,
        assId: ''
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
.operation-type-add {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 20px;
  .operation-type-label {
    padding-top: 5px;
  }
}
.operation-type-radio {
  display: flex;
  flex-direction: column;
  .el-radio {
    margin: 10px;
  }
}
</style>
