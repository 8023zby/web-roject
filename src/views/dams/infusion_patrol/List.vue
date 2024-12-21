<template>
  <layout v-loading="loading">

    <!-- 查询条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix="：">
        <el-form-item label="巡视时间" prop="targetDate">
          <el-date-picker
            v-uni="'shuyexunshi_date'"
            v-model="search_form.targetDate"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            v-uni="'shuyexunshi_search'"
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
          >搜索
          </el-button>
          <el-button v-uni="'shuyexunshi_reset'" type="text" @click="resetForm()"
          >重置
          </el-button>

        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->

    <div slot="right_btn" class="tool-bar">
      <!-- 下一个迭代做 -->
      <el-button v-uni="'shuyexunshi_print'" type="success" @click="printView">
        打印
      </el-button>
      <!--<el-button @click="patrolMulti" type="primary"-->
      <!--&gt;巡视-->
      <!--</el-button>-->
      <!--<el-button type="primary" @click="patrolCancelMulti"-->
      <!--&gt;取消巡视-->
      <!--</el-button>-->
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
          reserve-selection
          :selectable="handleSelectable"
          align="center"
          width="70"
          fixed="left"
        >
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
            <span :class="scope.row.icon"></span>
            {{scope.row.medicalItemName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="dosage"
          label="剂量"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="frequencyCode"
          label="频次"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="purpose"
          label="用法"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="frequencyExecuteTime"
          label="计划执行时间"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{scope.row.frequencyExecuteTime ? scope.row.frequencyExecuteTime.split(" ")[0] : ''}}<br/>
            {{scope.row.frequencyExecuteTime ? scope.row.frequencyExecuteTime.split(" ")[1] : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="patrolTypeDesc"
          label="巡视节点"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="patrolSpeed"
          label="滴速"
          align="center"
          width="60"
        >
        </el-table-column>
        <el-table-column
          prop="patrolNurse"
          label="巡视护士"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            {{user_data[scope.row.patrolNurse] || ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="patrolTime"
          label="巡视时间"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{scope.row.patrolTime ? scope.row.patrolTime.split(" ")[0] : ''}}<br/>
            {{scope.row.patrolTime ? scope.row.patrolTime.split(" ")[1] : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{(scope.row.remark ? scope.row.remark.remarkOperate : '') +''+ (scope.row.remark ? scope.row.remark.remarkContent : '')}}
          </template>
        </el-table-column>
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
      <!-- 打印组件 -->
      <div style="display: none">
        <print ref="print" :patient="patient" :param="multipleSelection.length > 0 ? multipleSelection : null" :executeDate="search_form.targetDate"></print>
      </div>
    </template>
  </layout>
</template>

<script>
import layout from '../../../components/dams/layout/list'
import print from './Print'
import { doctors_advice_type } from '../../../assets/dams/js/item_config'
import { ApiInfusionPatrol, ApiUser } from '../../../api/dams/index'
import moment from 'moment'

export default {
  name: 'advice_patrol_list',
  components: { layout, print },
  data () {
    return {
      loading: false,
      config: {
        doctors_advice_type,
        patrolType: {
          0: '巡视',
          1: '暂停',
          2: '继续用药',
          3: '结束',
          9999: '执行'
        }
      },
      user_data: [],
      page_current: 1,
      page_total: 1,
      table_data: [],
      // 查询表单
      search_form: {
        empId: '',
        patientId: '',
        targetDate: moment().format('YYYY-MM-DD'),
        page: 1,
        size: 10
      },
      // table多选结果
      multipleSelection: []
    }
  },
  props: ['patient', 'patientType'],
  computed: {
    btn_disable: function () {
      // 出院&&非出院召回 || 转科
      if ((this.patientType == 2 && this.patient.outHospitalFlag != 1) || this.patientType == 1) {
        return true
      }
      return false
    }
  },
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.search_form.empId = empInfo.empId || ''
    this.getUserData()
  },
  mounted () {

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
    getData () {
      if (!this.hasPatient()) {
        return false
      }
      this.loading = true
      ApiInfusionPatrol.select(this.search_form)
        .then(res => {
          let list = res.data.list
          this.table_data = []
          // 处理数据
          for (let i = 0; i < list.length; i++) {
            let item = list[i]
            item['frequencyExecuteTime'] = this.search_form.targetDate + ' ' + (item['frequencyExecuteTime'] || '')

            let first_item = item.itemList.slice(0, 1)
            first_item[0] && (first_item[0].main = true)
            let surplus = item.itemList.slice(1)
            let nSurplus = []

            item = Object.assign({}, item, first_item[0])
            item.patrolList[0]['remark'] = item.patrolList[0]['remark'] || { disu: '', remarkOperate: '', remarkContent: '' }
            if (surplus.length > 0) {
              if (!item.children_data) item.children_data = []
              for (let h = 0; h < surplus.length; h++) {
                item.children_data.push({
                  medicalItemName: surplus[h].medicalItemName,
                  dosage: surplus[h].dosage
                })
              }
              // 把其他医嘱项并入table
              item.icon = 'top_line'
              for (let h = 0; h < surplus.length; h++) {
                nSurplus.push({
                  medicalAdviceItemId: surplus[h].medicalAdviceItemId,
                  medicalItemName: surplus[h].medicalItemName,
                  dosage: surplus[h].dosage,
                  icon: (h === surplus.length - 1) ? 'bottom_line' : 'middle_line'
                })
              }

              nSurplus[nSurplus.length - 1] = Object.assign({}, nSurplus[nSurplus.length - 1], item.patrolList[0])
            } else {
              delete item.patrolList[0]['frequencyExecuteTime']
              item = Object.assign({}, item, item.patrolList[0])
            }

            console.log('item - ', item)

            this.table_data.push(item)
            this.table_data.push(...nSurplus)
            // 剩余放入子项
            for (let y = 1; y < item.patrolList.length; y++) {
              let _d = item.patrolList[y]
              delete _d['frequencyExecuteTime']
              _d['remark'] = _d['remark'] || { disu: '', remarkOperate: '', remarkContent: '' }

              this.table_data.push(_d)
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
    handleTableSelectionChange (val) {
      this.multipleSelection = val
    },
    printView () {
      if (!this.hasPatient()) {
        return false
      }
      // this.$emit('option-changed', 'print', this.multipleSelection.length > 0 ? this.multipleSelection : null, this.search_form.targetDate);
      this.loading = true
      this.$refs.print.printPreview()
      this.loading = false
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    getRowKeys (row) {
      return row.medicalAdviceId + row.medicalAdviceItemId + row.patrolId
    },
    handleSelectable (row) {
      return row.main
    },
    getChildRowKeys (row) {
      return row.medicalAdviceItemId + row.patrolId
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
    &:after {
      content: " ";
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50%;
      width: 8px;
      border-left: 1px solid #E8E8E8;
      border-top: 1px solid #E8E8E8;
    }
  }
  .middle_line {
    &:after {
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 8px;
      border-left: 1px solid #E8E8E8;
    }
  }
  .bottom_line {
    &:after {
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      height: 50%;
      width: 8px;
      border-left: 1px solid #E8E8E8;
      border-bottom: 1px solid #E8E8E8;
    }
  }
</style>
