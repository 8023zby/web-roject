<template>
  <layout_aside v-loading="loading">
    <div slot="aside">
      <PatientList @initPatient="initPatient" initRowType="in" initRowIndex="0"></PatientList>
    </div>
    <layout_list slot="main">
      <!--      查询条件-->
      <div slot="query" class="query-items">
        <el-form :inline="true" :model="search_form" ref="search_form">
          <el-form-item label="医嘱类型:" prop="adviceType">
            <el-select v-uni="'peiyeguanli_yizhuleixing'" v-model="search_form.adviceType" placeholder="全部" clearable autocomplete="off">
              <el-option
                v-for="(value, key) in config.doctors_advice_type"
                :label="value"
                :value="key"
                :key="key"
                v-if="key =='1' || key =='2'||key =='3' "
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间:" prop="targetDate">
            <el-date-picker
              v-uni="'peiyeguanli_date'"
              v-model="search_form.targetDate"
              type="date"
              :clearable="false"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="条形码是否打印:" prop="printCode">
            <el-select
              v-uni="'peiyeguanli_shifoudayintiaoxingma'"
              v-model="search_form.printCode"
              placeholder="全部"
              clearable
              autocomplete="off"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="已打印" value="1"></el-option>
              <el-option label="未打印" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配液状态:" prop="dispenseStatus">
            <el-select
              v-uni="'peiyeguanli_peiyezhuangtai'"
              v-model="search_form.dispenseStatus"
              placeholder="全部"
              clearable
              autocomplete="off"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="已配液" value="1"></el-option>
              <el-option label="未配液" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-uni="'peiyeguanli_search'" type="primary" @click="searchForm()" icon="el-icon-search">搜索</el-button>
            <el-button v-uni="'peiyeguanli_reset'" type="text" @click="resetForm()" style="margin-left: 0;"
            >重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="left_btn" class="tool-bar">
      </div>
      <div slot="right_btn" class="tool-bar">
        <el-button v-uni="'peiyeguanli_print'" type="success" @click="printAll">打印</el-button>
        <el-button v-uni="'peiyeguanli_piliangpeiye'" type="primary" @click="$emit('option-changed','batchDispense');" :disabled="btn_disable">批量配液
        </el-button>
      </div>
      <!--      表格-->
      <div slot="main" class="main-list">
        <el-table
          ref="table"
          class="table"
          :data="table_data"
          :row-key="getRowKeys"
          stripe
          highlight-current-row
          @selection-change="handleTableSelectionChange"
          height="100%"
        >
          <el-table-column
            fixed="left"
            type="selection"
            reserve-selection
            :selectable="handleSelectable"
            align="center"
            width="70"
          ></el-table-column>
              <!--<span>{{(search_form.page - 1) * search_form.size + scope.$index + 1}}</span>-->
          <!-- <el-table-column type="index" fixed="left" label="序号" width="90" align="center">
            <template scope="scope">
              <span v-if="scope.row.main">{{scope.row.index + 1}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="startAdviceTime"
            label="开嘱时间"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              {{scope.row.startAdviceTime ? scope.row.startAdviceTime.split(" ")[0] : ''}}<br/>
              {{scope.row.startAdviceTime ? formatTime(scope.row.startAdviceTime) : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="medicalItemName"
            label="医嘱名称"
            header-align="center"
            show-overflow-tooltip
            class-name="medicalItemName"
            width="300"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.icon" :class="scope.row.icon"></span>
              <span>{{scope.row.medicalItemName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dosage"
            label="剂量"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="number"
            label="数量"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="frequencyCode"
            label="频次"
            align="center"
            min-width="60"
          ></el-table-column>
          <el-table-column
            prop="frequencyExecuteTime"
            label="执行时间点"
            align="center"
            width="110"
          ></el-table-column>
          <el-table-column
            prop="purpose"
            label="用法"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="printCount"
            label="打印"
            align="center"
            width="60"
          >
            <template slot-scope="scope">
              {{ (scope.row.printCount == 0 ? '否' : '是') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="medicalAdviceBarcode"
            label="条码号"
            align="center"
            width="100"
          ></el-table-column>
          <!--<el-table-column-->
          <!--prop="medicalOperationType"-->
          <!--label="医嘱类型"-->
          <!--align="center"-->
          <!--min-width="80"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">-->
          <!--{{config.doctors_advice_type[scope.row.medicalOperationType] || ''}}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            prop="dispenseTime"
            label="配液时间"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              {{scope.row.dispenseTime ? scope.row.dispenseTime.split(" ")[0] : ''}}<br/>
              {{scope.row.dispenseTime ? formatTime(scope.row.dispenseTime) : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="dispenseNurse"
            label="配液护士"
            align="center"
            width="100"
          >
            <template slot-scope="scope"
            >
              {{scope.row.dispenseNurse ? user_data[scope.row.dispenseNurse] : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="dispenseCheckTime"
            label="复核时间"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              {{scope.row.dispenseCheckTime ? scope.row.dispenseCheckTime.split(" ")[0] : ''}}<br/>
              {{scope.row.dispenseCheckTime ? formatTime(scope.row.dispenseCheckTime) : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="dispenseCheckNurse"
            label="复核护士"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              {{scope.row.dispenseCheckNurse ? user_data[scope.row.dispenseCheckNurse]: ''}}
            </template>
          </el-table-column>
          <template v-if="!btn_disable">
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.main">

              <!--                                  {{scope.row.dispenseCheckStatus}}-{{scope.row.dispenseStatus}}-->
              <el-button v-uni:[scope.$index]="'peiyeguanli_peiye'" @click="dispenseOperate(scope.row)" type="text"
                         v-if="scope.row.dispenseStatus !== 1"
              >配液
              </el-button>
              <el-button v-uni:[scope.$index]="'peiyeguanli_quxiao'" type="textred" @click="dispenseCancel(scope.row)"
                         v-if="scope.row.dispenseStatus === 1&&scope.row.dispenseCheckStatus !== 1"
              >取消配液
              </el-button>
              <el-button v-uni:[scope.$index]="'peiyeguanli_peiyefuhe'" @click="openCheckDialog(scope.row)" type="text"
                         v-if="(scope.row.dispenseCheckStatus!==1 && scope.row.dispenseStatus === 1)"
              >配液复核
                <!--                  (scope.row.dispenseCheckStatus===0 &&scope.row.dispenseStatus === 1)||(scope.row.dispenseCheckStatus===null&&scope.row.dispenseStatus === 1)-->
              </el-button>
              <el-button v-uni:[scope.$index]="'peiyeguanli_quxiaofuhe'" type="textred" @click="recoveryCancel(scope.row)"
                         v-if="scope.row.dispenseCheckStatus===1"
              >取消复核
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
          :page-sizes="[10, 30, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total"
        >
        </el-pagination>
      </div>
    </layout_list>
    <template>
      <!--    复核-->
      <el-dialog title="复核人"
                 :visible.sync="dialogFormVisible"
                 :close-on-click-modal="false"
                 :showClose="false"
                 custom-class="checkDialogStyle"
                 width="490px"
      >
        <el-form :model="dispense_check_form" class="ifms-add-dialog" ref="userForm">
<!--
          <input type="text" style="display: none;" />
-->
          <el-form-item label="账户：" prop="account" :label-width="formLabelWidth"
                        :rules="[{ required: true, message: '请输入账户', trigger: 'blur' }]">
            <el-input v-uni="'peiyeguanli_fuheren_zhanghu'" v-model="dispense_check_form.account" autocomplete="off"></el-input>
<!--
            <el-input type="text" name="username" style="position:fixed; top:-9999px;"></el-input>
-->

          </el-form-item>
          <el-form-item label="密码：" prop="password" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">

<!--            <el-input ref="pwdText" id="test"
                      v-model="dispense_check_form.password"
                      :type="inputType"
                      autocomplete="off"
                      @focus="changeInputType"
                      :readonly="readonlyFlag"
            ></el-input>-->
            <el-input
              v-uni="'peiyeguanli_fuheren_password'"
              type="text"
              v-model.trim="dispense_check_form.password"
              :maxlength="20"
              onkeyup="this.value=this.value.replace(/[\u4e00-\u9fa5]/g,'')"
              oncontextmenu="return false"
              onpaste="return false"
              oncopy="return false"
              oncut="return false"
              auto-complete="off" value=""
              style="text-security:disc; -webkit-text-security:disc;ime-mode:disabled"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-uni="'peiyeguanli_fuheren_cancel'" @click="cancelConfirm">取消</el-button>
          <el-button v-uni="'peiyeguanli_fuheren_confirm'" type="primary" @click="dialogFormConfirm">确认</el-button>
        </div>
      </el-dialog>
    </template>
  </layout_aside>
</template>

<script>

import { doctors_advice_type, advice_type } from '../../../assets/dams/js/item_config'
import { ApiDoctorsAdviceDispense, ApiUser } from '../../../api/dams/index'
import PatientList from '../../../components/dams/PatientList'
import moment from 'moment'
import layout_aside from '../../../components/dams/layout/aside'
import layout_list from '../../../components/dams/layout/list'

export default {
  name: 'list',
  components: { PatientList, layout_aside, layout_list },
  data () {
    return {
      loading: false,
      config: { doctors_advice_type, advice_type },
      user_data: [], // 用户信息
      dialogFormVisible: false, // 二期复核验证对话框
      dispense_check_form: {
        account: '',
        password: ''
      },
      formLabelWidth: '100px',
      page_current: 1,
      page_total: 1,
      search_form: {
        patientId: '',
        adviceType: '1',
        printCode: '',
        targetDate: moment().format('YYYY-MM-DD'),
        dispenseStatus: '',
        page: 1,
        size: 10
      },
      patient: {}, // 患者
      table_data: [],
      // table多选结果
      multipleSelection: [],
      // 批量复核
      // batchDispense_visible: false,
      current_dispensecode: [] // 批量配液的医嘱id
    }
  },
  computed: {
    btn_disable: function () {
      // 出院|| 转科
      if ((this.patient.patientType == 2) || this.patient.patientType == 1) {
        return true
      }
      return false
    }
  },

  created () {
    // this.getUserData() // 获取用户信息  用于根据id显示姓名的对比
  },
  activated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
      // 隐藏不能操作的checkbox
      let checkbox = this.$refs.table.$el.querySelectorAll('td.el-table-column--selection .el-checkbox.is-disabled')
      for (let i = 0; i < checkbox.length; i++) {
        console.log(checkbox[i], checkbox[i].innerHTML)
        checkbox[i].style.display = 'none'
      }
    })
  },
  methods: {
    getUserData () {
      ApiUser.nurse().then(res => {
        const data = res.data || []
        for (let i = 0; i < data.length; i++) {
          this.user_data[data[i]['empId']] = data[i]['empName']
        }
        this.getDispenseData()
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    initPatient (patient, type) {
      this.patient = patient
      this.$set(this.patient, 'patientType', type)
      this.search_form.patientId = this.patient.patientId
      this.search_form.page = 1
      this.getUserData()
      // 0529-为测试BUG调整
      // this.getDispenseData()
    },
    searchForm () {
      this.handleCurrentChange(1)
    },
    getDispenseData () {
      this.loading = true
      ApiDoctorsAdviceDispense.select(this.search_form)
        .then(res => {
          // console.log(res)
          let list = res.data.list
          this.table_data = []
          // 组装数据 一项大医嘱根据执行时间点的数量来显示条数
          for (let i = 0; i < list.length; i++) { // 循环最外层
            let item = list[i]

            for (let k = 0; k < list[i].dispenseList.length; k++) { // 循环配液时间点
              let dispenseListItem = list[i].dispenseList[k]

              let kItem = {}
              let dispenseListItemArr = []
              kItem = { ...item }
              dispenseListItemArr.push(dispenseListItem)
              kItem['dispenseList'] = dispenseListItemArr

              let first_item = item.itemList.slice(0, 1)
              first_item[0] && (first_item[0].main = true)
              first_item[0] && (first_item[0].index = i)
              let surplus = item.itemList.slice(1)
              let nSurplus = []

              if (surplus.length > 0) {
                if (!item.children_data) kItem.children_data = []
                for (let h = 0; h < surplus.length; h++) {
                  kItem.children_data.push({
                    medicalAdviceItemId: surplus[h].medicalAdviceItemId,
                    medicalItemName: surplus[h].medicalItemName,
                    dosage: surplus[h].dosage,
                    number: surplus[h].number,
                    extendId: dispenseListItem['extendId']
                  })
                }

                // 把其他医嘱项并入table
                first_item[0].icon = 'top_line'
                for (let h = 0; h < surplus.length; h++) {
                  nSurplus.push({
                    medicalAdviceItemId: surplus[h].medicalAdviceItemId,
                    medicalItemName: surplus[h].medicalItemName,
                    dosage: surplus[h].dosage,
                    number: surplus[h].number,
                    extendId: dispenseListItem['extendId'],
                    icon: (h === surplus.length - 1) ? 'bottom_line' : 'middle_line'
                  })
                }
              }

              // 删除配液中的医嘱id，因为是null会覆盖主项中的
              delete dispenseListItem['medicalAdviceId']
              Object.assign(kItem, first_item[0], dispenseListItem)
              this.table_data.push(kItem)
              this.table_data.push(...nSurplus)
            }
          }
          this.page_total = res.data.total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 配液
    dispenseOperate (row) {
      let _row = JSON.parse(JSON.stringify(row))
      console.log(_row, 111111)
      // _row.dispenseList[0]['dispenseStatus'] = 1 // 配液状态
      // let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
      // _row.dispenseList[0]['dispenseNurse'] = empInfo.empId // 登录用户护士ID
      let data = {
        adviceId: _row.medicalAdviceId,
        pointId: _row.dispenseList[0]['extendId'],
        targetDate: this.search_form.targetDate // 查询时间
      }
      // console.log(data.entities)
      ApiDoctorsAdviceDispense.dispense(data)
        .then(() => {
          this.$message.success('配液成功')
          this.getDispenseData()
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 取消配液
    dispenseCancel (row) {
      this.$confirm('确认取消该医嘱配液？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          let _row = JSON.parse(JSON.stringify(row))
          ApiDoctorsAdviceDispense.dispenseCancel({ 'dispenseId': _row.dispenseList[0]['dispenseId'] })
            .then(() => {
              this.$message.success('取消配液成功')
              this.getDispenseData()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        })
    },
    // 取消复核
    recoveryCancel (row) {
      this.$confirm('确认取消复核该医嘱？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          let _row = JSON.parse(JSON.stringify(row))
          ApiDoctorsAdviceDispense.recoveryCancel({ 'dispenseId': _row.dispenseList[0]['dispenseId'] })
            .then(() => {
              this.$message.success('取消复核成功')
              this.getDispenseData()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        })
    },
    // 打开复核对话框  二期
    openCheckDialog (row) {
      this.dispense_check_form = {
        account: '',
        password: ''
      }
      // this.$refs.userForm.resetFields()
      let data = JSON.parse(JSON.stringify(row))
      // // data.dispenseCheckStatus = 1 // 复核状态
      // data.dispenseList[0]['dispenseCheckStatus'] = 1 // 复核状态
      /*
        this.$set(this.dispense_check_form,'account','')
        this.$set(this.dispense_check_form,'password','')
*/
      Object.assign(this.dispense_check_form, data)
      this.dialogFormVisible = true
    },

    // 验证登录账户
    dialogFormConfirm () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          ApiUser.verify_password({
            loginName: this.dispense_check_form.account,
            loginPassword: this.dispense_check_form.password
          })
            .then(res => {
              if (res.data) {
                if (this.dispense_check_form.dispenseList[0]['dispenseNurse'] && this.dispense_check_form.dispenseList[0]['dispenseNurse'] === res.data) {
                  this.$message.error('复核人员与配液人员为同一人')
                } else {
                  this.dispense_check_form.dispenseList[0]['dispenseCheckNurse'] = res.data // 复核人员
                  this.dispenseRecovery(this.dispense_check_form)
                }
              } else {
                this.$message.error('账户名或者密码错误')
              }
            })
            .catch(res => {
              this.$message.error(res.message)
            })
          this.dialogFormVisible = false
          this.readonlyFlag = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelConfirm () {
      this.dialogFormVisible = false
    },
    // 复核
    dispenseRecovery (row) {
      let data = {
        dispenseId: row.dispenseList[0]['dispenseId'],
        nurseId: row.dispenseList[0]['dispenseCheckNurse']
      }
      ApiDoctorsAdviceDispense.recovery(data)
        .then(() => {
          this.$message.success('复核成功')
          this.getDispenseData()
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    resetForm () {
      if (!this.hasPatient()) {
        return false
      }
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    getRowKeys (row) {
      return row.medicalAdviceId + row.medicalAdviceItemId
    },
    handleSelectable (row) {
      return row.main
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getDispenseData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getDispenseData()
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
    },
    // 打印全部或选中的
    printAll () {
      if (!this.hasPatient()) {
        return false
      }
      // 默认不勾选的话  打印全部
      // if (this.multipleSelection.length === 0) {
      //   this.$message.warning('请先选择要打印的医嘱！')
      //   return false
      // }
      this.$emit('option-changed', 'print', this.multipleSelection.length > 0 ? this.multipleSelection : null, this.patient)
    },
    hasPatient () {
      if (!this.patient.patientId) {
        this.$message.warning('请先选择患者！')
        return false
      }
      return true
    },
    formatTime (value) {
      return moment(value).format('HH:mm')
    },
    getChildRowKeys (row) {
      return row.medicalAdviceItemId + row.extendId
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";

  /deep/ .el-dialog__wrapper .el-dialog {
    width: 22%;
  }

  .typt-list-container {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }

  .table {
    flex: 1;
    height: 0;
    overflow: hidden;
  }

  // /deep/.medicalItemName {
  //   padding: 0 !important;
  //   .cell {
  //     height: 100%;
  //     overflow: auto;
  //     display: flex;
  //     align-items: center;
  //     position: relative;
  //     padding-left: 20px;
  //   }
  // }
  .top_line {
    /*&:after {*/
      content: " ";
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50%;
      width: 8px;
      border-left: 1px solid #E8E8E8;
      border-top: 1px solid #E8E8E8;
    /*}*/
  }
  .middle_line {
    /*&:after {*/
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 8px;
      border-left: 1px solid #E8E8E8;
    /*}*/
  }
  .bottom_line {
    /*&:after {*/
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      height: 50%;
      width: 8px;
      border-left: 1px solid #E8E8E8;
      border-bottom: 1px solid #E8E8E8;
    /*}*/
  }
</style>
<style lang="scss" type="text/scss">
  .checkDialogStyle{
    .el-dialog__body{
      .el-input{
        width: 300px;
      }
    }
    .el-dialog__footer{
      padding-top: 5px;
    }
  }
</style>
