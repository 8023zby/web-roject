<template>
  <layout v-loading="loading">

    <!-- 查询条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix="：">
        <el-form-item label="开嘱日期" class="date-range">
          <el-form-item prop="beginDate">
            <el-date-picker
              v-uni="'pishiguanli_date'"
              v-model="search_form.beginDate"
              value-format="yyyy-MM-dd"
              type="date"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
          <div class="to">至</div>
          <el-form-item prop="endDate">
            <el-date-picker
              v-uni="'pishiguanli_date'"
              v-model="search_form.endDate"
              value-format="yyyy-MM-dd"
              type="date"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-uni="'pishiguanli_zhuangtai'"
            v-model="search_form.status"
            placeholder="全部"
            clearable
            autocomplete="off"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未执行" :value="0"></el-option>
            <el-option label="已执行" :value="1"></el-option>
            <!--<el-option label="已删除" value="2"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-uni="'pishiguanli_search'"
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
          >搜索
          </el-button>
          <el-button v-uni="'pishiguanli_reset'" type="text" @click="resetForm()"
          >重置
          </el-button>

        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->

    <div slot="right_btn" class="tool-bar">
      <el-button v-uni="'pishiguanli_piliangluru'" type="primary" @click="multiIn" :disabled="btn_disable"
      >批量录入
      </el-button>
    </div>

    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        ref="table"
        :data="table_data"
        :row-key="getRowKeys"
        stripe
        highlight-current-row
        height="100%"
      >
        <el-table-column
          type="selection"
          reserve-selection
          align="center"
          fixed="left"
          width="70"
        ></el-table-column>
        <!-- <el-table-column type="index" fixed="left" align="center" label="序号" width="90">
          <template scope="scope">
            <span>{{(search_form.page - 1) * search_form.size + (scope.$index + 1)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="medicalItemName"
          label="皮试项目"
          header-align="center"
          show-overflow-tooltip
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="startAdviceTime"
          label="开嘱时间"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="skinTestType"
          label="原液/皮试液"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.medicalItemInfo.skinTestType}}
          </template>
        </el-table-column>
        <el-table-column
          prop="dosage"
          label="剂量"
          min-width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="purpose"
          label="用法"
          min-width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="execStatus"
          label="状态"
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            {{scope.row.execStatus === 1 ? '已执行' : '未执行'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="skinTestResult"
          label="皮试结果"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="startTime"
          label="皮试开始时间"
          align="center"
          min-width="120"
        >
          <template slot-scope="scope">
            {{scope.row.startTime ? scope.row.startTime.split(" ")[0] : ''}}<br/>
            {{scope.row.startTime ? scope.row.startTime.split(" ")[1] : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="skinTestNurse"
          label="皮试人员"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            {{user_data[scope.row.skinTestNurse] || '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="皮试结束时间"
          align="center"
          min-width="120"
        >
          <template slot-scope="scope">
            {{scope.row.endTime ? scope.row.endTime.split(" ")[0] : ''}}<br/>
            {{scope.row.endTime ? scope.row.endTime.split(" ")[1] : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="checkNurse"
          label="复核人员"
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            {{user_data[scope.row.checkNurse] || '-'}}
          </template>
        </el-table-column>
        <template v-if="!btn_disable">
        <el-table-column fixed="right" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <template v-if="scope.row.main">
              <el-button v-uni:[scope.$index]="'pishiguanli_zhixing'" @click="execute(scope.row)" type="text"
                         v-if="scope.row.execStatus !== 1">
                执行
              </el-button>
              <el-button v-uni:[scope.$index]="'pishiguanli_cancel'" @click="cancelExecute(scope.row)" type="text"
                         v-if="scope.row.execStatus===1 && !scope.row.skinTestResult">
                取消
              </el-button>
              <el-button v-uni:[scope.$index]="'pishiguanli_luru'" @click="add(scope.row)" type="text"
                         v-if="scope.row.execStatus===1 && !scope.row.skinTestResult">
                录入
              </el-button>
              <el-button v-uni:[scope.$index]="'pishiguanli_edit'" @click="edit(scope.row)" type="text"
                         v-if="scope.row.execStatus===1 && scope.row.checkStatus!==1 && scope.row.skinTestResult">
                编辑
              </el-button>
              <el-button v-uni:[scope.$index]="'pishiguanli_fuhe'" type="text" @click="check(scope.row)"
                         v-if="scope.row.checkStatus!==1 && scope.row.skinTestResult">
                复核
              </el-button>
              <el-button v-uni:[scope.$index]="'pishiguanli_quxiaofuhe'" @click="cancelCheck(scope.row)" type="text"
                         v-if="scope.row.checkStatus == 1">
                取消复核
              </el-button>
            </template>
          </template>

        </el-table-column>
        </template>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page_current"
        :page-size="search_form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
      >
      </el-pagination>
    </div>

    <template slot>
      <!-- 录入 -->
      <el-dialog title="录入" :visible.sync="input_form_visible" width="490px" :show-close="false">
        <el-form :model="input_form" ref="input_form" label-width="120px" label-suffix="：">
          <el-form-item label="皮试结果" prop="result"
                        :rules="[
                { required: true, message: '请选择皮试结果！', trigger: 'change' },

              ]">
            <el-select v-uni="'pishiguanli_luru'" v-model="input_form.result" placeholder="请选择皮试结果">
              <el-option label="阴性" value="阴性"></el-option>
              <el-option label="阳性" value="阳性"></el-option>
              <el-option label="未知" value="未知"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结果记录时间" prop="endTime"
                        :rules="skinTestResultValidate">
            <el-date-picker
              v-uni="'pishiguanli_luru_date'"
              v-model="input_form.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-uni="'pishiguanli_luru_cancel'" @click="input_form_visible = false">取消</el-button>
          <el-button v-uni="'pishiguanli_luru_confirm'" type="primary" @click="editSubmit">确认</el-button>
        </div>
      </el-dialog>

      <!-- 复核 -->
      <el-dialog
        class="trial_window"
        title="复核"
        :close-on-click-modal="false"
        :visible.sync="check_form_visible"
        width="490px">
        <span>
          <el-form ref="check_form" :model="check_form" label-width="100px" label-suffix="：">
            <el-form-item label="账户" prop="account"
                          :rules="[
                { required: true, message: '请选择账户！', trigger: 'change' },

              ]"
            >
              <el-select v-uni="'pishiguanli_fuhe'" v-model="check_form.account" placeholder="请选择账户">
                <el-option
                  v-for="item in nurse_data"
                  :key="item.empId"
                  :label="item.empName"
                  :value="item.userName">
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="password"
                          :rules="[
                { required: true, message: '请填写密码！！', trigger: 'blur' },

              ]"
            >
              <el-input
                v-uni="'pishiguanli_fuhe_password'"
                type="password"
                v-model="check_form.password"
                placeholder=""
                autocapitalize="off"
                required
              ></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'pishiguanli_fuhe_cancel'" @click="check_form_visible = false">取消</el-button>
          <el-button v-uni="'pishiguanli_fuhe_confirm'" type="primary" @click="checkSubmit">确认</el-button>
        </span>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import layout from '../../../components/dams/layout/list'
import { ApiSkinTest, ApiUser } from '../../../api/dams/index'
import moment from 'moment'

export default {
  name: 'skin_test_list',
  components: { layout },
  data () {
    let skinTestValidateFun = (rule, value, callback) => {
      if (moment(value).isBefore(moment(this.input_form.startTime))) {
        callback(new Error('皮试结果时间不能大于执行时间！'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      config: {
        skinTestType: {
          0: '原液',
          1: '皮试液'
        }
      },
      empInfo: null,
      user_data: {},
      nurse_data: [],
      page_current: 1,
      page_total: 1,
      table_data: [],
      // 查询表单
      search_form: {
        empId: '',
        patientId: '',
        beginDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'), // [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        status: '',
        page: 1,
        size: 10
      },
      skinTestResultValidate: [
        { required: true, message: '请选择时间！', trigger: 'blur' },
        { validator: skinTestValidateFun, trigger: 'blur' }
      ],
      input_form_visible: false,
      input_form: {
        testId: '',
        result: '',
        endTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      check_form_visible: false,
      check_form: {
        account: '',
        password: ''
      },
      curLoginUserName: '',
      curLoginUserId: ''
    }
  },
  props: ['patient', 'patientType'],
  computed: {
    btn_disable: function () {
      // 出院 || 转科
      if ((this.patientType == 2) || this.patientType == 1) {
        return true
      }
      return false
    }
  },
  created () {
    this.empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    let userName = localStorage.getItem('userId') || ''
    this.curLoginUserName = userName
    this.curLoginUserId = this.empInfo.empId
    this.search_form.beginDate = moment(this.patient.inTime).format('YYYY-MM-DD')
    this.getUserData()
  },
  activated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 获取护士用户信息
    getUserData () {
      ApiUser.nurse().then(res => {
        const data = res.data || []
        for (let i = 0; i < data.length; i++) {
          this.user_data[data[i]['empId']] = data[i]['empName']
        }
        this.nurse_data = data
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    getData () {
      if (!this.hasPatient()) {
        return false
      }
      this.loading = true
      ApiSkinTest.select(this.search_form)
        .then(res => {
          let list = res.data.list
          this.table_data = []
          // 处理数据
          for (let i = 0; i < list.length; i++) {
            let item = list[i]
            console.log(list[i].itemList)
            for (let x = 0; x < list[i].itemList.length; x++) {
              let _d = list[i].itemList[x]
              let nItem = {}
              if (x === 0) {
                nItem = { ...item }
                nItem['medicalItemInfo'] = _d['medicalItemInfo']
                nItem['medicalItemName'] = _d['medicalItemName']
                nItem['dosage'] = _d['dosage']
                nItem['purpose'] = _d['purpose']
                nItem['main'] = true
              } else {
                nItem['medicalItemName'] = _d['medicalItemName']
                nItem['dosage'] = _d['dosage']
                nItem['checkStartStatus'] = item['checkStartStatus']
                nItem['checkStopStatus'] = item['checkStopStatus']
              }
              this.table_data.push(nItem)
            }
          }
          // this.table_data = res.data.list;
          this.page_total = res.data.total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    searchForm () {
      if (!this.hasPatient()) {
        return false
      }
      this.handleCurrentChange(1)
    },
    execute (row) {
      console.log('row  - ', row)
      this.$confirm('确认要执行该条皮试项目吗？', '执行', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiSkinTest.execute({ adviceId: row.medicalAdviceId, targetDate: moment().format('YYYY-MM-DD') })
          .then(() => {
            this.$message.success('执行成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    add (row) {
      this.input_form['testId'] = row.skinTestId
      this.input_form['startTime'] = row.startTime
      this.input_form['endTime'] = ''
      this.input_form['result'] = ''
      this.input_form_visible = true
    },
    edit (row) {
      this.input_form['testId'] = row.skinTestId
      this.input_form['startTime'] = row.startTime || ''
      this.input_form['endTime'] = row.endTime || ''
      this.input_form['result'] = row.skinTestResult || ''
      this.input_form_visible = true
    },
    editSubmit () {
      this.$refs.input_form.validate((valid) => {
        if (valid) {
          ApiSkinTest.edit(this.input_form)
            .then(() => {
              this.$message.success('保存成功！')
              this.input_form_visible = false
              this.getData()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelExecute (data) {
      this.$confirm('确认要取消执行该条皮试项目？', '取消', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiSkinTest.cancelExecute({ testId: data.skinTestId })
          .then(() => {
            this.$message.success('取消成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    check (row) {
      this.check_form['testId'] = row.skinTestId
      // 登录用户和录入用户一样
      if (row.skinTestNurse === this.curLoginUserId) {
        this.check_form_visible = true
      } else {
        this.$confirm('确认要复核该条皮试项目？', '复核', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }).then(() => {
          this.checkDo(this.curLoginUserName)
        })
      }
    },
    checkSubmit () {
      this.$refs.check_form.validate((valid) => {
        if (valid) {
          // 1。验证用户名密码正确
          ApiUser.verify_password({
            loginName: this.check_form.account,
            loginPassword: this.check_form.password
          }).then(res => {
            if (res.data) {
              this.checkDo(res.data || '--')
            } else {
              this.$message.warning('您输入的密码错误！')
            }
          }).catch(res => {
            this.$message.error(res.message)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    checkDo (nurseId) {
      // alert(JSON.stringify({ testId: this.check_form.testId, nurseId: nurseId }))
      ApiSkinTest.check({ testId: this.check_form.testId, nurseId: nurseId })
        .then(() => {
          this.$message.success('操作成功！')
          this.check_form_visible = false
          this.getData()
        }).catch(res => {
          this.$message.error(res.message)
        })
    },
    cancelCheck (data) {
      this.$confirm('确认要取消复核该条皮试项目？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiSkinTest.cancelCheck({ testId: data.skinTestId })
          .then(() => {
            this.$message.success('取消成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    getRowKeys (row) {
      return row.medicalAdviceId
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getData()
    },
    hasPatient () {
      if (!this.patient.patientId) {
        this.$message.warning('请先选择患者！')
        return false
      }
      return true
    },
    multiIn () {
      this.$emit('option-changed', 'multi')
    }
  },
  watch: {
    patient (patient) {
      this.search_form.patientId = patient.patientId
      this.handleCurrentChange(1)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";

  .date-range .el-form-item__content div {
    float: left;
  }

  .date-range .el-form-item__content .to {
    padding-right: 10px;
  }
</style>
