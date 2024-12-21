<template>
  <layout v-loading="loading">
    <!-- 查询条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item label="计划执行日期" prop="executeDate">
          <el-date-picker
            v-uni="'yizhuzhixing_date'"
            v-model="search_form.executeDate"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="医嘱类型" prop="medicalAdviceType">
          <el-select
            v-uni="'yizhuzhixing_yizhuleixing'"
            v-model="search_form.medicalAdviceType"
            placeholder="全部"
            clearable
            autocomplete="off"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(value, key) in config.advice_type"
              :label="value"
              :value="+key"
              :key="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医嘱状态" prop="executeStatus">
          <el-select
            v-uni="'yizhuzhixing_yizhuzhuangtai'"
            v-model="search_form.executeStatus"
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
        <el-form-item label="医嘱分类" prop="medicalAdviceOperationType">
          <el-select
            v-uni="'yizhuzhixing_yizhufenlei'"
            v-model="search_form.medicalAdviceOperationType"
            placeholder="全部"
            autocomplete="off"
            clearable
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(value, key) in config.doctors_advice_type"
              v-if="+key!==8"
              :label="value"
              :value="key"
              :key="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-uni="'yizhuzhixing_search'"
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
          >搜索
          </el-button>
          <el-button v-uni="'yizhuzhixing_reset'" type="text" @click="resetForm()"
          >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="right_btn" class="tool-bar">
      <el-button v-uni="'yizhuzhixing_print'" type="success" @click="printView()"
      >打印
      </el-button>
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        ref="table"
        :data="table_data"
        :row-key="getRowKeys"
        highlight-current-row
        stripe
        @selection-change="handleTableSelectionChange"
        height="100%"
      >
        <el-table-column
          type="selection"
          :selectable="handleSelectable"
          reserve-selection
          align="center"
          fixed="left"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="medicalAdviceType"
          label="类型"
          width="60"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.medicalAdviceType!=null">{{scope.row.medicalAdviceType == 0 ? '长期' : '临时'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="medicalAdviceOperationType"
          label="分类"
          width="60"
          align="center"
        >
          <template slot-scope="scope">
            {{config.doctors_advice_type[scope.row.medicalAdviceOperationType] || ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="medicalItemName"
          label="医嘱名称"
          show-overflow-tooltip
          header-align="center"
          width="300"
          class-name="medicalItemName"
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
          width="80"
        ></el-table-column>
        <el-table-column
          prop="frequencyCode"
          label="频次"
          align="center"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="purpose"
          align="center"
          label="用法"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="executeStatus"
          label="状态"
          align="center"
          min-width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.main">{{scope.row.executeStatus ? '已执行' : '未执行'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="frequencyExecuteTime"
          label="计划执行时间"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.main">
              {{search_form.executeDate}}<br />
              {{scope.row.frequencyExecuteTime || ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="executeTime"
          label="开始时间"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            {{scope.row.executeTime ? scope.row.executeTime.split(' ')[0] : ''}}<br />
            {{scope.row.executeTime ? formatTime(scope.row.executeTime) : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="executeNurse"
          label="执行护士"
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            {{user_data[scope.row.executeNurse] || ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.executeStatus === 4" style="color: red;">
              {{scope.row.stopTime ? scope.row.stopTime.split(' ')[0] : ''}}<br />
              {{scope.row.stopTime ? formatTime(scope.row.stopTime) : ''}}
            </span>
            <span v-else>
              {{scope.row.endTime ? scope.row.endTime.split(' ')[0] : ''}}<br />
              {{scope.row.endTime ? formatTime(scope.row.endTime) : ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="endNurse"
          label="结束护士"
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.executeStatus === 4" style="color: red;">{{user_data[scope.row.stopNurse] || ''}}</span>
            <span v-else>{{user_data[scope.row.endNurse] || ''}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="remark"-->
        <!--label="备注"-->
        <!--show-overflow-tooltip-->
        <!--&gt;</el-table-column>-->
        <template v-if="!btn_disable">
          <el-table-column label="操作" align="center" fixed="right" width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.main">
                <!--{{scope.row.medicalAdviceId}}-->
                <!--<br>-->
                <!--{{scope.row.startAdviceTime}}-->
                <!--<br>-->
                <!--{{scope.row.stopAdviceTime}}-->
                <template v-if="scope.row.isOperate">
                  <!--<template v-if="moment().format('')"></template>-->
                  <!--status-{{scope.row.executeStatus}}<br/>-->
                  <!--execute-{{scope.row.executeStatusFlag}}<br/>-->
                  <!--patrol-{{scope.row.patrolButtonFlag}}<br/>-->
                  <!--pause-{{scope.row.pauseButtonFlag}}<br/>-->
                  <!--cancelpause-{{scope.row.cancelPauseButtonFlag}}<br/>-->
                  <!--stop-{{scope.row.stopButtonFlag}}<br/>-->
                  <!--end-{{scope.row.endButtonFlag}}<br/>-->
                  <!-- 当天的才能操作， 暂停了只能有[取消暂停、停止用药] -->
                  <el-button
                    v-uni:[scope.$index]="'yizhizhixing_zhixing'"
                    v-if="scope.row.executeButtonFlag" @click="execute(scope.row)"
                    type="text"
                  >
                    执行
                  </el-button>
                  <!--输液 非未执行的-->
                  <template
                    v-if="scope.row.medicalAdviceOperationType === 1 && scope.row.executeStatusFlag"
                  >
                    <el-button
                      v-uni:[scope.$index]="'yizhuzhixing_xunshicaozuo'"
                      type="text" style="margin-left: 20px"
                      :disabled="!scope.row.endButtonFlag && !scope.row.stopButtonFlag"
                      @click="showOperateBtns($event, scope.row)"
                    >
                      巡视操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </template>
                  <el-button
                    v-uni:[scope.$index]="'yizhuzhixing_chexiao'"
                    v-if="!scope.row.executeButtonFlag" @click="revoke(scope.row)"
                    type="text" style="margin : 0 10px"
                  >
                    撤销
                  </el-button>
                </template>
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
      <!-- 巡视操作按钮-->
      <ul class="el-dropdown-menu el-popper el-dropdown-menu--small" v-show="dropDownShow" :style="dropDownXY"
          style="position: fixed; top: 290px; left: 1765px; transform-origin: center top; z-index: 2007;"
          x-placement="bottom-end"
      >
        <li v-uni="'yizhuzhixing_xunshi'" class="el-dropdown-menu__item" @click="operateExecute('巡视')" v-if="curAdvice.patrolButtonFlag">巡视
        </li>
        <li v-uni="'yizhuzhixing_zantingyongyao'" class="el-dropdown-menu__item" @click="operateExecute('暂停用药')" v-if="curAdvice.pauseButtonFlag">
          暂停用药
        </li>
        <li v-uni="'yizhuzhixing_quxiaozanting'" class="el-dropdown-menu__item" @click="operateExecute('取消暂停')"
            v-if="curAdvice.cancelPauseButtonFlag"
        >取消暂停
        </li>
        <li v-uni="'yizhuzhixing_tingzhiyongyao'" class="el-dropdown-menu__item" @click="operateExecute('停止用药')" v-if="curAdvice.stopButtonFlag">
          停止用药
        </li>
        <li v-uni="'yizhuzhixing_jieshuyongyao'" class="el-dropdown-menu__item" @click="operateExecute('结束用药')" v-if="curAdvice.endButtonFlag">结束用药
        </li>
        <div x-arrow="" class="popper__arrow" style="left: 50%; margin-left: -6px"></div>
      </ul>

      <!--暂停/停止-->
      <el-dialog
        center
        :title="form_dialog_title + '用药'"
        :append-to-body="true"
        :visible.sync="form_dialog_visible"
        :show-close="false"
        width="490px"
      >
        <el-form ref="ruleFormStop" :model="operate_form" label-width="80px" label-suffix=":">
          <el-form-item
            prop="remarkOperate"
            label="原因"
            :rules="[
              { required: true, message: '请选择原因！', trigger: 'blur' }
            ]"
          >
            <el-select v-uni="'yizhuzhixing_yongyaoyuanyin'" v-model="operate_form.remarkOperate" placeholder="请选择" clearable>
              <el-option label="患者拒绝执行" value="患者拒绝执行"></el-option>
              <el-option label="家属拒绝执行" value="家属拒绝执行"></el-option>
              <el-option label="医生紧急停嘱" value="医生紧急停嘱"></el-option>
              <el-option label="医生取消医嘱" value="医生取消医嘱"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-uni="'yizhuzhixing_yongyaoyuanyinbeizhu'" type="textarea" v-model="operate_form.remarkContent"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button v-uni="'yizhuzhixing_dialog_cancel'" @click="form_dialog_visible = false">取消</el-button>
        <el-button v-uni="'yizhuzhixing_dialog_confirm'" type="primary" @click="operateConfirm(form_dialog_title + '用药', 'ruleFormStop')">确认</el-button>
      </span>
      </el-dialog>

      <!--滴速-->
      <el-dialog
        center
        title="巡视"
        :append-to-body="true"
        :visible.sync="disu_dialog_visible"
        :show-close="false"
        width="490px"
      >
        <el-form ref="ruleFormDisu" :model="operate_form" label-width="85px" label-suffix=":">
          <el-form-item
            prop="disu"
            label="滴速"
            style="margin-top: 20px"
            :rules="[
              { required: true, message: '请填写滴速！', trigger: 'blur' },
              { validator: validateDisu, trigger: 'blur' }
            ]"
          >
            <el-col :span="20">
              <el-input v-uni="'yizhuzhixing_disu'" v-model="operate_form.disu" max="4" placeholder="请输入"></el-input>
            </el-col>
            <el-col :span="4">
              <span style="height: 46px; line-height: 46px">&nbsp;滴/分</span>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'yizhuzhixing_dialog_cancel'" @click="disu_dialog_visible = false">取消</el-button>
          <el-button v-uni="'yizhuzhixing_dialog_confirm'" type="primary" @click="operateConfirm('巡视', 'ruleFormDisu')">确认</el-button>
        </span>
      </el-dialog>

      <!-- 打印组件 -->
      <div style="display: none">
        <print_page
          ref="print" :patient="patient"
          :param="multipleSelection.length > 0 ? multipleSelection : null"
          :executeDate="search_form.executeDate"
        ></print_page>
      </div>
    </template>
  </layout>
</template>

<script>
import { doctors_advice_type, advice_type } from '../../../assets/dams/js/item_config'
import { ApiAdviceExecute, ApiUser } from '../../../api/dams/index'
import moment from 'moment'
import layout from '../../../components/dams/layout/list'

export default {
  name: 'advice_execute_list',
  components: {
    layout,
    print_page: () => import('./Print')
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
  data () {
    return {
      loading: false,
      config: {
        doctors_advice_type,
        advice_type
      },
      user_data: {}, // 用户信息
      page_current: 1,
      page_total: 1,
      table_data: [], // 表格数据
      nowDate: moment().format('YYYY-MM-DD'), // 当前日期 日期比较用
      // 查询表单
      search_form: {
        patientId: '',
        executeDate: moment().format('YYYY-MM-DD'),
        medicalAdviceType: null,
        executeStatus: null,
        medicalAdviceOperationType: '',
        page: 1,
        size: 10
      },
      dropDownShow: false,
      dropDownXY: { top: '290px', left: '1765px' },
      disu_dialog_visible: false,
      form_dialog_visible: false,
      form_dialog_title: '暂停',
      curAdvice: {},
      operate_form: {
        remarkOperate: '',
        remarkContent: '',
        disu: ''
      },
      // table多选结果
      multipleSelection: []
    }
  },
  created () {
    let _this = this
    document.body.addEventListener('click', function (e) {
      _this.dropDownShow = false
    }, true)
    this.getUserData()
  },
  activated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  updated () {
    this.$nextTick(function () {
      // 隐藏不能操作的checkbox
      let checkbox = this.$refs.table.$el.querySelectorAll('td.el-table-column--selection .el-checkbox.is-disabled')
      for (let i = 0; i < checkbox.length; i++) {
        checkbox[i].style.display = 'none'
      }

      this.$refs.table.doLayout()
    })
  },
  methods: {
    validateDisu (rule, value, callback) {
      if (!/^\d{0,4}$/.test(value)) {
        callback(new Error('请输入数字且最大四位!'))
      } else {
        callback()
      }
    },
    // 获取护士用户信息
    getUserData () {
      ApiUser.nurse().then(res => {
        const data = res.data || []
        let obj = {}
        for (let i = 0; i < data.length; i++) {
          obj[data[i]['empId']] = data[i]['empName']
        }
        this.user_data = obj
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    getData () {
      if (!this.hasPatient()) {
        return false
      }
      this.dropDownShow = false
      this.loading = true
      ApiAdviceExecute.select(this.search_form)
        .then(res => {
          this.table_data = []
          let list = []
          if (res.data && res.data.list) {
            list = res.data.list
          }
          // 处理数据
          for (let i = 0; i < list.length; i++) {
            let item = list[i]

            for (let x = 0; x < item.medicalAdviceItemDoList.length; x++) {
              let _d = item.medicalAdviceItemDoList[x]
              _d['medicalAdviceItemId'] = _d['medicalAdviceItemId'] + '-' + item['extendId']
            }

            let first_item = item.medicalAdviceItemDoList.slice(0, 1)
            first_item[0] && (first_item[0].main = true)
            let surplus = item.medicalAdviceItemDoList.slice(1)
            let nSurplus = []

            if (surplus.length > 0) {
              // 原有的逻辑不变以保持打印稳定
              if (!item.children_data) item.children_data = []
              for (let h = 0; h < surplus.length; h++) {
                item.children_data.push({
                  medicalItemName: surplus[h].medicalItemName,
                  dosage: surplus[h].dosage
                })
              }

              // 把其他医嘱项并入table
              first_item[0].icon = 'top_line'
              for (let h = 0; h < surplus.length; h++) {
                nSurplus.push({
                  medicalAdviceItemId: surplus[h].medicalAdviceItemId,
                  medicalItemName: surplus[h].medicalItemName,
                  dosage: surplus[h].dosage,
                  icon: (h === surplus.length - 1) ? 'bottom_line' : 'middle_line'
                })
              }
            }

            // 执行日期不是当天
            if (this.search_form.executeDate !== moment().format('YYYY-MM-DD')) {
              item['isOperate'] = false
            } else {
              item['isOperate'] = true
            }

            Object.assign(item, first_item[0])
            this.table_data.push(item)
            this.table_data.push(...nSurplus)
          }
          this.page_total = res.data.total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    searchForm () {
      this.handleCurrentChange(1)
    },
    // 执行
    execute (row) {
      this.$confirm('确认执行该医嘱？', '执行', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiAdviceExecute.execute({
          medicalAdviceId: row.medicalAdviceId,
          executeDate: this.search_form.executeDate,
          extendId: row.extendId,
          executeId: row.executeId || ''
        })
          .then(() => {
            this.$message.success('执行成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    // 撤销
    revoke (row) {
      this.$confirm('确认撤销该医嘱操作？', '撤销', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiAdviceExecute.revoke({
          medicalAdviceId: row.medicalAdviceId,
          executeId: row.executeId
        })
          .then(() => {
            this.$message.success('撤销成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    // 显示操作按钮
    showOperateBtns (e, row) {
      this.curAdvice = row
      let top = e.target.getBoundingClientRect().top
      let left = e.target.getBoundingClientRect().left
      this.dropDownXY = { top: (top + 15) + 'px', left: (document.body.clientWidth - 158) + 'px' }
      this.dropDownShow = true
    },
    // 操作
    operateExecute (type) {
      this.operate_form = {
        remarkOperate: '',
        remarkContent: '',
        disu: ''
      }
      switch (type) {
        case '巡视':
          this.disu_dialog_visible = true
          break
        case '取消暂停':
          this.$confirm('确认取消暂停？', '取消暂停', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          }).then(() => {
            this.operateDo(type)
          })
          break
        case '暂停用药':
        case '停止用药':
          this.form_dialog_visible = true
          this.form_dialog_title = type.replace('用药', '')
          break
        case '结束用药':
          this.$confirm('确认要结束用药？', '结束用药', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          }).then(() => {
            this.operateDo(type)
          })
          break
      }
    },
    // 有表单输入
    operateConfirm (type, rule) {
      this.$refs[rule].validate(valid => {
        if (valid) {
          this.operateDo(type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 操作提交
    operateDo (type) {
      let _params = {
        medicalAdviceId: this.curAdvice.medicalAdviceId,
        executeId: this.curAdvice.executeId,
        remark: this.curAdvice.remark || {}
      }
      let http = null
      switch (type) {
        case '巡视':
          Object.assign(_params.remark, this.operate_form)
          _params.patrolSpeed = this.operate_form.disu
          http = ApiAdviceExecute.patrol(_params)
          break
        case '暂停用药':
          Object.assign(_params.remark, this.operate_form)
          http = ApiAdviceExecute.pause(_params)
          break
        case '取消暂停':
          http = ApiAdviceExecute.cancelPause(_params)
          break
        case '停止用药':
          Object.assign(_params.remark, this.operate_form)
          http = ApiAdviceExecute.stop(_params)
          break
        case '结束用药':
          Object.assign(_params.remark, this.operate_form)
          http = ApiAdviceExecute.end(_params)
          break
      }
      http
        .then(() => {
          this.$message.success(type + '成功！')
          this.getData()
        })
        .catch(res => {
          this.$message.error(res.message)
        })
        .finally(() => {
          this.disu_dialog_visible = false
          this.form_dialog_visible = false
        })
    },

    resetForm () {
      if (!this.hasPatient()) {
        return false
      }
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    // 打印全部或选中的
    printView () {
      if (!this.hasPatient()) {
        return false
      }
      this.loading = true
      this.$refs.print.printPreview()
      this.loading = false
    },
    getRowKeys (row) {
      return row.medicalAdviceItemId + row.extendId
    },
    getChildRowKeys (row) {
      return row.medicalAdviceItemId
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

  /deep/ .el-dialog {
    max-height: 80%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .el-dialog__body {
      flex: 1;
      overflow: auto;
    }
  }

  .planed-time {
    /deep/ .el-form-item__content {
      width: 400px;
    }
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  // /deep/ .medicalItemName {
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
