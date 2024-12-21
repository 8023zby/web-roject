<template>
  <layout v-loading="loading">
    <!--查询-->
    <div slot="query"
         class="query-items">
      <el-form class="demo-form-inline"
               :inline="true"
               :model="searchObj"
               ref="formSearch">
        <el-form-item :label="'频次名称：'">
          <el-input v-uni="'pinggupinci_yizhupinci_pincimingcheng'" v-model.trim="searchObj.frequencyName"
                    clearable
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item :label="'频次编号：'">
          <el-input v-uni="'pinggupinci_yizhupinci_pincibianhao'" v-model.trim="searchObj.frequencyCode"
                    clearable
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item :label="'执行规则：'">
          <el-select v-uni="'pinggupinci_yizhupinci_zhixingguize'" v-model="searchObj.frequencyRule"
                     v-if="tab.activeName === 'frequency'"
                     placeholder="请选择"
                     clearable>
            <el-option v-for="item in frequencyRuleOptionDoctor"
                       :label="item.label"
                       :key="item.value"
                       :value="item.value"/>
          </el-select>
          <el-select v-uni="'pinggupinci_yizhupinci_zhixingguize'" v-model="searchObj.frequencyRule"
                     v-if="tab.activeName === 'assess'"
                     placeholder="请选择"
                     clearable>
            <el-option v-for="item in frequencyRuleOptionAssess"
                       :label="item.label"
                       :key="item.value"
                       :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button v-uni="'pinggupinci_yizhupinci_search'" type="primary"
                       class="el-button-radius"
                       icon="el-icon-search"
                       @click="handleCurrentChange(1)"
                       size="small">搜索
            </el-button>
            <el-button v-uni="'pinggupinci_yizhupinci_reset'" type="text"
                       @click="resetSearchObj">重置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--end-->

    <div slot="left_btn"
         class="tool-bar">
      <el-button
        v-uni="'pinggupinci_yizhupinci_add'"
        type="warning"
        icon="el-icon-plus"
        @click="$emit('option-changed', 'add', '', tab);"
        v-checkAuth="tab.activeName==='assess' ? 'addAssessSet' : 'addDoctorsAdviceSet'"
      >
        添加
      </el-button>
    </div>
    <!-- 表格 -->
    <div slot="main"
         class="main-list">
      <el-table
        ref="table"
        :data="frequency_data"
        row-key="labelId"
        stripe
        highlight-current-row
        height="100%">
        <!-- <el-table-column
          type="index"
          label="序号"
          width="120"
          fixed="left"
          align="center">
          <template scope="scope">
            <span>{{(page - 1) * size + (scope.$index + 1)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="frequencyName"
          label="频次名称"
          min-width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="frequencyCode"
          label="频次编号"
          min-width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="frequencyRule"
          v-if="tab.activeName === 'frequency'"
          label="执行规则"
          min-width="100"
          align="center">
          <template slot-scope="scope">
            {{executeRule[scope.row.frequencyRule] || ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="frequencyRule"
          v-if="tab.activeName === 'assess'"
          label="执行规则"
          min-width="100"
          align="center">
          <template slot-scope="scope">
            {{executeRuleAssess[scope.row.frequencyRule] || ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="frequencyExecuteTime2"
          min-width="100"
          label="执行时间点"
          show-overflow-tooltip
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="100"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
          align="center"
          v-if="checkAuth(tab.activeName==='assess' ? 'editAssessSet,deleteAssessSet' : 'editDoctorsAdviceSet,deleteDoctorsAdviceSet')"
        >
          <template slot-scope="scope">
            <el-button
              v-uni:[scope.$index]="'pinggupinci_yizhupinci_edit'"
              type="text"
              @click="$emit('option-changed','add',scope.row,tab)"
              v-uni:[scope.row.frequencyConfigId]="'pinggupinci_edit'"
              :key="'edit' + scope.row.frequencyConfigId"
              v-checkAuth="tab.activeName==='assess' ? 'editAssessSet' : 'editDoctorsAdviceSet'"
            >
              编辑
            </el-button>
            <el-button
              v-uni:[scope.$index]="'pinggupinci_yizhupinci_delet'"
              type="textred"
              @click="frequencyDelete(scope.row)"
              v-uni:[scope.row.frequencyConfigId]="'pinggupinci_delete'"
              :key="'delete' + scope.row.frequencyConfigId"
              v-checkAuth="tab.activeName==='assess' ? 'deleteAssessSet' : 'deleteDoctorsAdviceSet'"
            >
              删除
            </el-button>
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
        :page-sizes="[10, 30, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total">
      </el-pagination>
    </div>

    <el-dialog
      title="删除"
      :visible="delete_visible"
      :close-on-click-modal="false"
      :show-close="false"
      width="490px">
      <div style="text-align: center">
        <div v-if="tab.activeName === 'frequency'">该医嘱频次正在使用，不能删除！！</div>
        <div v-if="tab.activeName === 'assess'">该评估频次已关联评估设置，不允许删除！</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'pinggupinci_yizhupinci_guanbishanchuquerentanchuang'" type="primary"
                   @click="delete_visible = false">关闭
        </el-button>
      </div>
    </el-dialog>

  </layout>
</template>

<script>
import moduleMixin from '../../../assets/dams/mixins/moduleMixin'
import { ApiFrequencySetting, ApiAssessSetting } from '../../../api/dams'
import { executeRule, executeRuleAssess, weekConfig } from '../../../assets/dams/js/item_config'
import layout from '../../../components/dams/layout/list'

export default {
  name: 'FrequencySettingList',
  props: ['tab'],
  mixins: [moduleMixin],
  components: { layout },
  data () {
    return {
      loading: false,
      executeRule,
      executeRuleAssess,
      weekConfig,
      frequency_data: [],
      page_current: 1,
      page_total: 0,
      page: 1,
      size: 10,
      delete_visible: false,
      searchObj: {
        frequencyName: '',
        frequencyCode: '',
        frequencyRule: ''
      },
      frequencyRuleOptionDoctor: [// 医嘱
        {
          label: '全部',
          value: ''
        },
        {
          label: '按天执行',
          value: 0
        },
        {
          label: '隔天执行',
          value: 1
        },
        {
          label: '按周执行',
          value: 2
        },
        {
          label: '按开始执行时间',
          value: 3
        }
      ],
      frequencyRuleOptionAssess: [// 评估
        {
          label: '全部',
          value: ''
        },
        {
          label: '每天执行',
          value: 0
        },
        {
          label: '隔天执行',
          value: 1
        },
        {
          label: '按周执行',
          value: 2
        }
      ]
    }
  },
  created () {

  },
  mounted () {
    this.getData()
  },
  activated () {

  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    resetSearchObj () {
      this.searchObj.frequencyName = ''
      this.searchObj.frequencyCode = ''
      this.searchObj.frequencyRule = ''
      this.handleCurrentChange(1)
    },
    // 医嘱频次
    getFrequencyData () {
      this.loading = true
      let param = {
        frequencyName: this.searchObj.frequencyName,
        frequencyCode: this.searchObj.frequencyCode,
        frequencyRule: this.searchObj.frequencyRule,
        page: this.page,
        size: this.size
      }
      ApiFrequencySetting.select(param)
        .then(res => {
          let list = res.data.list
          for (let i = 0; i < list.length; i++) {
            if (list[i]['frequencyRule'] === 0 || list[i]['frequencyRule'] === 1) {
              let timeTotal = []
              for (let j = 0; j < list[i]['frequencyConfigExtendDoList'].length; j++) {
                let _k = list[i]['frequencyConfigExtendDoList'][j]
                let time = _k['frequencyExecuteTime']
                if (time) timeTotal.push(time)
              }
              list[i]['frequencyExecuteTime2'] = timeTotal.join(',')
            }
            if (list[i]['frequencyRule'] === 2) {
              let timeTotal = []
              for (let j = 0; j < list[i]['frequencyConfigExtendDoList'].length; j++) {
                let _k = list[i]['frequencyConfigExtendDoList'][j]
                let time = _k['frequencyExecuteTime']
                if (time) timeTotal.push(time)
              }
              let weekArr = []
              if (list[i]['weekDateIndex'] && list[i]['weekDateIndex'].length) {
                for (let j = 0; j < list[i]['weekDateIndex'].length; j++) {
                  let _k = list[i]['weekDateIndex'][j]
                  let week = weekConfig[_k] || ''
                  if (week) weekArr.push(week)
                }
              }
              list[i]['frequencyExecuteTime2'] = weekArr.join(',') + (timeTotal.length > 0 ? ':' : '') + timeTotal.join(',')
            }
            if (list[i]['frequencyRule'] === 3) {
              list[i]['frequencyExecuteTime2'] = '开始执行后' + list[i]['executeIntervalTime'] + '分钟'
            }
          }
          this.frequency_data = list
          this.page_total = res.data.total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 评估频次
    getAssessData () {
      this.loading = true
      let param = {
        frequencyName: this.searchObj.frequencyName,
        frequencyCode: this.searchObj.frequencyCode,
        frequencyRule: this.searchObj.frequencyRule,
        page: this.page,
        size: this.size
      }
      ApiAssessSetting.select(param)
        .then(res => {
          let list = res.data.list
          for (let i = 0; i < list.length; i++) {
            if (list[i]['frequencyRule'] === 0 || list[i]['frequencyRule'] === 1) {
              let timeTotal = []
              for (let j = 0; j < list[i]['assessmentConfigExtendDoList'].length; j++) {
                let _k = list[i]['assessmentConfigExtendDoList'][j]
                let time = _k['frequencyExecuteTime']
                if (time) timeTotal.push(time)
              }
              list[i]['frequencyExecuteTime2'] = timeTotal.join(',')
            }
            if (list[i]['frequencyRule'] === 2) {
              let timeTotal = []
              for (let j = 0; j < list[i]['assessmentConfigExtendDoList'].length; j++) {
                let _k = list[i]['assessmentConfigExtendDoList'][j]
                let time = _k['frequencyExecuteTime']
                if (time) timeTotal.push(time)
              }
              let weekArr = []
              if (list[i]['weekDateIndex'] && list[i]['weekDateIndex'].length) {
                for (let j = 0; j < list[i]['weekDateIndex'].length; j++) {
                  let _k = list[i]['weekDateIndex'][j]
                  let week = weekConfig[_k] || ''
                  if (week) weekArr.push(week)
                }
              }
              list[i]['frequencyExecuteTime2'] = weekArr.join(',') + (timeTotal.length > 0 ? ':' : '') + timeTotal.join(',')
            }
            if (list[i]['frequencyRule'] === 3) {
              list[i]['frequencyExecuteTime2'] = '开始执行后' + list[i]['executeIntervalTime'] + '分钟'
            }
          }
          this.frequency_data = list
          this.page_total = res.data.total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    frequencyDelete (row) {
      let title = ''
      if (this.tab.activeName === 'frequency') {
        title = '医嘱频次'
      } else {
        title = '评估频次'
      }
      this.$confirm('确认要删除该条' + title + '吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        if (this.tab.activeName === 'frequency') {
          let param = {
            frequencyConfigId: row.frequencyConfigId
          }
          ApiFrequencySetting.delete(param)
            .then(() => {
              this.$message.success('删除成功！')
              this.getData()
            })
            .catch(res => {
              if (res.message.includes('该频次')) {
                this.delete_visible = true
              } else {
                this.$message.error(res.message)
              }
            })
        } else {
          let param = {
            assessmentConfigId: row.assessmentConfigId
          }
          ApiAssessSetting.delete(param)
            .then(() => {
              this.$message.success('删除成功！')
              this.getData()
            })
            .catch(res => {
              if (res.message.includes('该频次')) {
                this.delete_visible = true
              } else {
                this.$message.error(res.message)
              }
            })
        }
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page_current = this.page = val
      this.getData()
    },
    getData () {
      switch (this.tab.activeName) {
        case 'frequency':
          this.getFrequencyData()
          break
        case 'assess':
          this.getAssessData()
          break
        default:
          this.getFrequencyData()
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";
</style>
