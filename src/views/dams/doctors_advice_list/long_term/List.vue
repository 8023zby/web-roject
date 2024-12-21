<template>
  <layout v-loading="loading">
    <!-- 查询条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix="：">
          <el-form-item prop="startAdviceTimeBegin" label="开嘱日期">
            <el-date-picker
              v-uni="'yizhuliebiao_kaizhuriqi_date'"
              v-model="search_form.startAdviceTimeBegin"
              value-format="yyyy-MM-dd"
              type="date"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
          <span class="to">至</span>
          <el-form-item prop="startAdviceTimeEnd">
            <el-date-picker
              v-uni="'yizhuliebiao_kaizhuriqi_date'"
              v-model="search_form.startAdviceTimeEnd"
              value-format="yyyy-MM-dd"
              type="date"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
        <el-form-item label="开嘱复核状态" prop="checkStartStatus">
          <el-select
            v-uni="'yizhuliebiao_kaizhufuhezhuangtai'"
            v-model="search_form.checkStartStatus"
            placeholder="全部"
            clearable
            autocomplete="off"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未复核" :value="0"></el-option>
            <el-option label="已复核" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="停嘱复核状态" prop="checkStopStatus">
          <el-select
            v-uni="'yizhuliebiao_tizhufuhezhuangtai'"
            v-model="search_form.checkStopStatus"
            placeholder="全部"
            clearable
            autocomplete="off"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未复核" :value="0"></el-option>
            <el-option label="已复核" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-uni="'yizhuliebiao_search'"
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
          >搜索
          </el-button>
          <el-button v-uni="'yizhuliebiao_reset'" type="text" @click="resetForm()" style="margin-left: 0;"
          >重置
          </el-button>

        </el-form-item>
      </el-form>
    </div>
    <div slot="right_btn" class="tool-bar">
      <!--ui要求暂无数据的时候 按钮为灰色-->
      <!--<el-button type="success" disabled class="noDataStyle" v-if="table_data.length===0">-->
        <!--按页打印-->
      <!--</el-button>-->
      <!--<el-button type="success" @click="printWin()" v-else>-->
        <!--按页打印-->
      <!--</el-button>-->
      <!--<el-button type="success" @click="printAll" disabled class="noDataStyle" v-if="table_data.length===0">-->
        <!--打印-->
      <!--</el-button>-->
      <!--<el-button type="success" @click="printAll" v-else>-->
        <!--打印-->
      <!--</el-button>-->
      <!--<el-button type="primary" @click="adviceMultiCheck" disabled class="noDataStyle" v-if="table_data.length===0">-->
        <!--复核-->
      <!--</el-button>-->
      <!--<el-button type="primary" @click="adviceMultiCheck" :disabled="btn_disable" v-else>-->
        <!--复核-->
      <!--</el-button>-->
      <el-button v-uni="'yizhuliebiao_anyedayin'" type="success" @click="printWin()">
        按页打印
      </el-button>
      <el-button v-uni="'yizhuliebiao_print'" type="success" @click="printAll">
        打印
      </el-button>
      <el-button v-uni="'yizhuliebiao_fuhe'" type="primary" @click="adviceMultiCheck" :disabled="btn_disable">
        复核
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
        @selection-change="handleTableSelectionChange"
        height="100%"
      >
        <el-table-column
          type="selection"
          reserve-selection
          :selectable="handleSelectable"
          align="center"
          width="70"
          fixed="left"
        >
        </el-table-column>
        <!--<span v-if="scope.row.main">{{(search_form.page - 1) * search_form.size + scope.$index + 1}}</span>-->
        <!-- <el-table-column type="index" fixed="left" align="center" label="序号" width="90">
          <template scope="scope">
            {{scope.row.selfIndex || ''}}
          </template>
        </el-table-column> -->
        <el-table-column
          prop="startAdviceTime"
          label="开嘱时间"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span :style="{color: !scope.row.checkStartStatus ? 'red': ''}">
            {{scope.row.startAdviceTime ? scope.row.startAdviceTime.split(" ")[0] : ''}}<br/>
            {{scope.row.startAdviceTime ? formatTime(scope.row.startAdviceTime) : ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="medicalItemName"
          label="医嘱名称"
          header-align="center"
          show-overflow-tooltip
          width="300"
          class-name="medicalItemName"
        >
          <template slot-scope="scope">
            <span :class="scope.row.icon"></span>
            <span :style="{color: !scope.row.checkStartStatus ? 'red': ''}">{{scope.row.medicalItemName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="dosage"
          label="剂量"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <span :style="{color: !scope.row.checkStartStatus ? 'red': ''}">{{scope.row.dosage}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="frequencyCode"
          label="频次"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <span :style="{color: !scope.row.checkStartStatus ? 'red': ''}">{{scope.row.frequencyCode}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="purpose"
          label="用法"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <span :style="{color: !scope.row.checkStartStatus ? 'red': ''}">{{scope.row.purpose}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="medicalAdviceOperationType"
          label="医嘱分类"
          align="center"
          width="90"
        >
          <template slot-scope="scope">
            <span :style="{color: !scope.row.checkStartStatus ? 'red': ''}">{{config.doctors_advice_type[scope.row.medicalAdviceOperationType] || ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="startAdviceDoctor"
          label="开嘱医生"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span :style="{color: !scope.row.checkStartStatus ? 'red': ''}">{{scope.row.startAdviceDoctor}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkStartTime"
          label="复核时间"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            {{scope.row.checkStartTime ? scope.row.checkStartTime.split(" ")[0] : ''}}<br/>
            {{scope.row.checkStartTime ? formatTime(scope.row.checkStartTime) : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="checkStartNurse"
          label="复核护士"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            {{user_data[scope.row.checkStartNurse] || ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="stopAdviceTime"
          label="停嘱时间"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span :style="{color: !scope.row.checkStopStatus && scope.row.checkStartStatus == 1 ? 'red': ''}">
              {{scope.row.stopAdviceTime ? scope.row.stopAdviceTime.split(" ")[0] : ''}}<br/>
              {{scope.row.stopAdviceTime ? formatTime(scope.row.stopAdviceTime) : ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stopAdviceDoctor"
          label="停嘱医生"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span :style="{color: !scope.row.checkStopStatus && scope.row.checkStartStatus == 1 ? 'red': ''}">
              {{scope.row.stopAdviceDoctor}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkStopTime"
          label="停嘱复核时间"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{scope.row.checkStopTime ? scope.row.checkStopTime.split(" ")[0] : ''}}<br/>
            {{scope.row.checkStopTime ? formatTime(scope.row.checkStopTime) : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="checkStopNurse"
          label="停嘱复核护士"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{user_data[scope.row.checkStopNurse] || ''}}
          </template>
        </el-table-column>
        <template v-if="!btn_disable">
        <el-table-column label="操作" align="center" fixed="right" width="130">
          <template slot-scope="scope">
            <template v-if="scope.row.main">
            <!--{{scope.row.isExecuted}}-->
            <!-- 停嘱复核 -->
            <el-button v-uni:[scope.$index]="'yizhuliebiao_quxiaotingzhufuhe'" type="text" @click="adviceStopCheckCancel(scope.row)" v-if="scope.row.checkStopStatus === 1"
            >取消停嘱复核
            </el-button>
            <el-button v-uni:[scope.$index]="'yizhuliebiao_tingzhufuhe'" @click="adviceStopCheck(scope.row)" type="text"
                       v-if="scope.row.stopAdviceTime && (!scope.row.checkStopStatus || scope.row.checkStopStatus === 0 || scope.row.checkStopStatus === 2) && scope.row.checkStartStatus === 1"
            >停嘱复核
            </el-button>
            <!-- 开嘱复核 执行了 -->
            <el-button v-uni:[scope.$index]="'yizhuliebiao_quxiaokaizhufuhe'" type="text" @click="adviceStartCheckCancel(scope.row)" :disabled="scope.row.isExecuted" v-if="!scope.row.stopAdviceTime && scope.row.checkStartStatus === 1 && (scope.row.checkStopStatus === 0 || !scope.row.checkStopStatus)"
            >取消开嘱复核
            </el-button>
            <el-button v-uni:[scope.$index]="'yizhuliebiao_kaizhufuhe'" @click="adviceStartCheck(scope.row)" type="text"
                       v-if="!scope.row.stopAdviceTime && scope.row.startAdviceTime &&  (!scope.row.checkStartStatus || scope.row.checkStartStatus === 0 || scope.row.checkStartStatus === 2)"
            >开嘱复核
            </el-button>
            </template>
          </template>
        </el-table-column>
        </template>
      </el-table>
    </div><!-- 分页 -->
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
      <!-- 打印页码 -->
      <el-dialog title="选择打印页码" :visible.sync="print_form_visible" width="200px" :show-close="false">
      <el-form :model="print_form" ref="print_form">
        <el-form-item prop="page">
          <el-select
            v-uni="'yizhuliebiao_xuanzedayinyema'"
            v-model="print_form.page"
            clearable
            autocomplete="off"
            :rules="[
              { required: true, message: '请选择要打印的页码！', trigger: 'blur' },

            ]"
          >
            <el-option
              v-for="page in print_pages"
              :label="'第'+ page +'页'"
              :value="+page"
              :key="page"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'yizhuliebiao_xuanzedayinyema_cancle'" @click="print_form_visible = false">取消</el-button>
        <el-button v-uni="'yizhuliebiao_xuanzedayinyema_confirm'" type="primary" @click="printSubmit">确认</el-button>
      </div>
    </el-dialog>

      <!-- 打印 -->
      <div style="display: none">
        <print ref="print" :patient="patient" :param="print_param"></print>
      </div>
    </template>
  </layout>
</template>

<script>
import moment from 'moment'
import { doctors_advice_type } from '../../../../assets/dams/js/item_config'
import { ApiDoctorsAdvice, ApiUser } from '../../../../api/dams/index'
import layout from '../../../../components/dams/layout/list'
import print from './Print'

export default {
  name: 'long_term_advice_list',
  components: { layout, print },
  data () {
    return {
      loading: false,
      config: {
        doctors_advice_type
      },
      user_data: [], // 用户数据，比对姓名用
      pages: 1,
      page_current: 1,
      page_total: 1,
      table_data: [],
      // 查询表单
      search_form: {
        patientId: '',
        medicalAdviceType: 0, // 长期医嘱
        startAdviceTimeBegin: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        startAdviceTimeEnd: moment().format('YYYY-MM-DD'), // [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        checkStartStatus: null,
        checkStopStatus: null,
        page: 1,
        size: 10
      },
      print_pages: 0,
      print_param: null,
      print_form_visible: false,
      print_form: { page: '' },
      // table多选结果
      multipleSelection: []
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

      // 隐藏不能操作的checkbox
      let checkbox = this.$refs.table.$el.querySelectorAll('td.el-table-column--selection .el-checkbox.is-disabled')
      for (let i = 0; i < checkbox.length; i++) {
        checkbox[i].style.display = 'none'
      }
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
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    getPrintPage () {
      ApiDoctorsAdvice.selectPrintPage(this.search_form)
        .then(res => {
          this.print_pages = Math.ceil(res.data.total / 24)
        }).catch(res => {
          this.$message.error(res.message)
        })
    },
    getData () {
      if (!this.hasPatient()) {
        return false
      }
      this.loading = true
      ApiDoctorsAdvice.select(this.search_form)
        .then(res => {
          let list = res.data.list
          this.table_data = []
          // 处理数据
          for (let i = 0; i < list.length; i++) {
            let item = list[i]

            let first_item = item.medicalAdviceItemDoList.slice(0, 1)
            first_item[0] && (first_item[0].main = true)
            first_item[0] && (first_item[0].index = i)
            let surplus = item.medicalAdviceItemDoList.slice(1)
            let nSurplus = []

            if (surplus.length > 0) {
              if (!item.children_data) item.children_data = []
              for (let h = 0; h < surplus.length; h++) {
                item.children_data.push({
                  medicalItemName: surplus[h].medicalItemName,
                  dosage: surplus[h].dosage,
                  checkStartStatus: item.checkStartStatus,
                  checkStopStatus: item.checkStopStatus
                })
              }

              // 把其他医嘱项并入table
              first_item[0].icon = 'top_line'
              for (let h = 0; h < surplus.length; h++) {
                nSurplus.push({
                  medicalAdviceItemId: surplus[h].medicalAdviceItemId,
                  medicalItemName: surplus[h].medicalItemName,
                  dosage: surplus[h].dosage,
                  checkStartStatus: item.checkStartStatus,
                  checkStopStatus: item.checkStopStatus,
                  icon: (h === surplus.length - 1) ? 'bottom_line' : 'middle_line'
                })
              }
            }

            Object.assign(item, first_item[0], { selfIndex: (this.search_form.page - 1) * this.search_form.size + i + 1 })
            this.table_data.push(item)
            this.table_data.push(...nSurplus)
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
      this.getData()
    },
    resetForm () {
      if (!this.hasPatient()) {
        return false
      }
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    printWin () {
      if (!this.hasPatient()) {
        return false
      }
      this.print_form_visible = true
    },
    printSubmit () {
      this.$refs.print_form.validate((valid) => {
        if (valid) {
          this.print_form_visible = false
          // this.$emit('option-changed', 'print', this.print_form.page);
          this.print_param = this.print_form.page
          this.$nextTick(function () {
            this.$refs.print.parseDataToPrintView()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 打印全部或选中的
    printAll () {
      if (!this.hasPatient()) {
        return false
      }
      this.print_param = this.multipleSelection.length > 0 ? this.multipleSelection : null
      if (!this.print_param) {
        this.$message.warning('请先选择医嘱数据！')
        return false
      }

      this.$nextTick(function () {
        this.$refs.print.parseDataToPrintView()
      })
      // this.$emit('option-changed', 'print', this.multipleSelection.length > 0 ? this.multipleSelection : null);
    },
    adviceStartCheck (row) {
      this.check([{ patientId: this.patient.patientId, medicalAdviceId: row.medicalAdviceId, checkStartStatus: 1 }])
    },
    adviceStartCheckCancel (row) {
      // 执行中的不能取消[后端做了验证，前端不再需要并且后端也没有返回这个字段]
      // if (row.executeStatus && row.executeStatus === 5) {
      //   this.$message.warning('医嘱正在执行中，请先取消执行！')
      //   return false
      // }
      this.checkCancel([{
        patientId: this.patient.patientId,
        medicalAdviceId: row.medicalAdviceId,
        checkStartStatus: 2
      }])
    },
    adviceStopCheck (row) {
      this.check([{ patientId: this.patient.patientId, medicalAdviceId: row.medicalAdviceId, checkStopStatus: 1 }])
    },
    adviceStopCheckCancel (row) {
      // 执行中的不能取消
      // if (row.executeStatus === 5) {
      //   this.$message.warning('医嘱正在执行中，请先取消执行！')
      //   return false
      // }
      this.checkCancel([{
        patientId: this.patient.patientId,
        medicalAdviceId: row.medicalAdviceId,
        checkStopStatus: 2
      }])
    },
    adviceMultiCheck () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择医嘱！')
        return false
      }
      let data = []

      for (let i = 0; i < this.multipleSelection.length; i++) {
        let _d = this.multipleSelection[i]
        let m = {
          patientId: this.patient.patientId,
          medicalAdviceId: _d['medicalAdviceId']
        }
        // 已停嘱 未复核
        if (_d['stopAdviceTime'] && _d['checkStopStatus'] !== 1) {
          m['checkStopStatus'] = 1
          data.push(m)
        }

        // 未停嘱 未复核
        if (!_d['stopAdviceTime'] && _d['checkStartStatus'] !== 1) {
          m['checkStartStatus'] = 1
          data.push(m)
        }
      }
      data.length > 0 && this.check(data)
    },
    check (data) {
      this.$confirm('确认复核该医嘱？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiDoctorsAdvice.check(data)
          .then(() => {
            this.$message.success('复核成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    checkCancel (data) {
      this.$confirm('确认取消复核该医嘱？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiDoctorsAdvice.checkCancel(data)
          .then(() => {
            this.$message.success('取消复核成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    getRowKeys (row) {
      return row.medicalAdviceId + '-' + row.medicalAdviceItemId
    },
    handleSelectable (row) {
      return row.main
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getData()
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
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
      return row.medicalAdviceItemId
    }
  },
  watch: {
    patient (val) {
      this.search_form.patientId = this.patient.patientId
      this.handleCurrentChange(1)
      this.getPrintPage()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/dams/css/self_common";
  .query-items{
    .to{
      display: inline-block;
      line-height: 32px;
      margin: 12px 0;
    }
  }
  .noDataStyle{
    background: #b5b5b5 !important;
    border-color: #b5b5b5 !important;
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
    /*content: " ";*/
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
    /*content: " ";*/
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
    /*content: " ";*/
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
