<template>
  <layout v-loading="loading">
    <div class="query-items" slot="query">
      <el-form v-uni="'tikuangjilu_form'" :inline="true" :model="search_form" ref="search_form">
        <el-form-item label="数据来源:" prop="source">
          <el-select
                  v-uni="'tikuangjilu_source'"
            v-model="search_form.source"
            placeholder="全部"
            autocomplete="off"
            clearable
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="(value, key) in signConfig.sign_source"
              :label="value"
              :value="key"
              :key="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测量时间:" prop="beginTime">
          <el-date-picker
                  v-uni="'tikuangjilu_begintime'"
            type="datetime"
            v-model="search_form.beginTime"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-form-item>
        <span class="split">至</span>
        <el-form-item prop="endTime">
          <el-date-picker
                  v-uni="'tikuangjilu_endtime'"
            type="datetime"
            v-model="search_form.endTime"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="记录人:" prop="nurseName">
          <el-input
                  v-uni="'tikuangjilu_jiluren'"
            v-model="search_form.nurseName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 18px">
          <el-button v-uni="'tikuangjilu_search'" type="primary" icon="el-icon-search" @click="searchForm()"
            >搜索
          </el-button>
          <el-button v-uni="'tikuangjilu_reset'" type="text" @click="resetForm()" style="margin-left: 0"
            >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main-list" slot="main">
      <el-table
        ref="table"
        highlight-current-row
        :data="tableList"
        height="100%"
        stripe
      >
        <!-- <el-table-column type="index" label="序号" width="120" align="center">
          <template slot-scope="scope">
            <span>{{
              (search_form.page - 1) * search_form.size + (scope.$index + 1)
            }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="dataSource"
          align="center"
          min-width="90"
          label="数据来源"
        >
          <template slot-scope="scope">
            {{
              scope.row.dataSource
                ? signConfig.sign_source[scope.row.dataSource]
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="measureTime"
          align="center"
          min-width="135"
          label="测量时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.measureTime.substr(0, 16) }}</span>
          </template>
        </el-table-column>
        <!--  动态表头  -->
        <!-- 体温 -->
        <template v-if="signItem.signItemFieldName === 'tiwen'">
          <el-table-column
            align="center"
            min-width="100"
            :label="signItem.signItemShowName + signItem.signItemUnit"
          >
            <template slot-scope="scope">
              {{ scope.row.signValue[signItem.signId] || "" }}
            </template>
          </el-table-column>
          <template v-for="(item1, key) in signItem.childrenSignItem">
            <el-table-column
              v-if="item1.signItemFieldName === 'tiwenceliangfangshi'"
              :key="key"
              prop="measureMode"
              align="center"
              min-width="100"
              :label="item1.signItemShowName"
            >
              <template slot-scope="scope">
                {{ scope.row.measureMode ? scope.row.measureMode : "" }}
              </template>
            </el-table-column>
          </template>
        </template>
        <!-- 血糖 -->
        <template v-else-if="signItem.signItemFieldName === 'xuetang'">
          <el-table-column
            :key="signItem.signId"
            align="center"
            min-width="100"
            :label="signItem.signItemShowName + signItem.signItemUnit"
          >
            <template slot-scope="scope">
              {{ scope.row.signValue[signItem.signId] || "" }}
            </template>
          </el-table-column>
          <template v-for="(item1, key) in signItem.childrenSignItem">
            <el-table-column
              v-if="item1.signItemFieldName === 'celiangshike'"
              :key="key"
              prop="measureMode"
              align="center"
              min-width="100"
              :label="item1.signItemShowName"
            >
            </el-table-column>
          </template>
        </template>
        <!-- 疼痛等级 -->
        <template v-else-if="signItem.signItemFieldName === 'tengtongdengji'">
          <el-table-column
            align="center"
            min-width="100"
            :label="signItem.signItemShowName + signItem.signItemUnit"
          >
            <template slot-scope="scope">
              {{ scope.row.signValue[signItem.signId] || "" }}
            </template>
          </el-table-column>
        </template>
        <!-- 血压 -->
        <template v-else-if="signItem.signItemFieldName === 'xueya'">
          <template v-for="(item1, key) in signItem.childrenSignItem">
            <el-table-column
              :key="key"
              align="center"
              min-width="100"
              :label="item1.signItemShowName + item1.signItemUnit"
            >
              <template slot-scope="scope">
                {{ scope.row.signValue[item1.signId] || "" }}
              </template>
            </el-table-column>
          </template>
        </template>
        <!-- 体围 -->
        <template v-else-if="signItem.signItemFieldName === 'tiwei'">
          <template v-for="(item1, key) in signItem.childrenSignItem">
            <el-table-column
              :key="key"
              align="center"
              min-width="100"
              :label="item1.signItemShowName + item1.signItemUnit"
            >
              <template slot-scope="scope">
                {{ scope.row.signValue[item1.signId] || "" }}
              </template>
            </el-table-column>
          </template>
        </template>

        <template v-else>
          <template v-for="(item1, key) in newSignItem">
            <el-table-column
              :key="key"
              align="center"
              min-width="100"
              :label="item1.newSignItemShowName + item1.signItemUnit"
            >
              <template slot-scope="scope">
                {{ scope.row.signValue[item1.signId] || "" }}
              </template>
            </el-table-column>
          </template>
        </template>
        <el-table-column
          prop="measureMoment"
          align="center"
          min-width="70"
          label="时刻点"
          v-if="signItem.signItemFieldName !== 'tiwei'"
        >
        </el-table-column>
        <el-table-column
          prop="measureNurse"
          align="center"
          min-width="100"
          label="记录人"
        >
        </el-table-column>
        <el-table-column
          v-if="signItem.signItemFieldName !== 'tiwei'"
          prop="deviceNum"
          align="center"
          min-width="100"
          label="设备编号"
        >
        </el-table-column>
        <template v-if="!btn_disable">
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            min-width="140"
          >
            <template slot-scope="scope">
              <template v-if="!scope.row.confirm">
                <el-button
                        v-uni="'tikuangjilu_confirm'"
                  @click="editBody(scope.row)"
                  type="text"
                  size="small"
                  :disabled="scope.row.dataSource !== '1'"
                >
                  确认
                </el-button>
                <el-button
                        v-uni="'tikuangjilu_delete'"
                  @click="deleteBody(scope.row)"
                  type="textred"
                  size="small"
                  :disabled="scope.row.dataSource !== '1'"
                >
                  删除
                </el-button>
              </template>
              <template v-else>
                <el-button v-uni="'tikuangjilu_confirm'" type="text" size="small" disabled> 确认 </el-button>
                <el-button v-uni="'tikuangjilu_delete'" type="textred" size="small" disabled>
                  删除
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
    <!--确认弹框-->
    <template>
      <el-dialog
        title="确认"
        :visible.sync="confirmDialogVisible"
        width="580px"
        custom-class="classifyDialogStyle"
        :show-close="false"
      >
        <el-form
                v-uni="'tikuangjilu_confirmform'"
          :model="confirm_form"
          :rules="rules"
          ref="confirm_form"
          label-width="100px"
          label-suffix=":"
        >
          <el-form-item label="测量时间" prop="measureTime">
            <el-date-picker
                    v-uni="'tikuangjilu_confirmtime'"
              type="datetime"
              v-model="confirm_form.measureTime"
              :disabled="true"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>
          <!-- 体温 -->
          <template v-if="signItem.signItemFieldName === 'tiwen'">
            <el-row>
              <el-col :span="21">
                <el-form-item
                  v-for="(item, index) in confirm_form.signList"
                  :key="item.signId"
                  :label="signItem.signItemShowName"
                  :prop="'signList.' + index + '.signValue'"
                >
                  <el-input v-uni="'tikuangjilu_tiwen'" v-model="item.signValue" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <div style="line-height: 46px">{{ signItem.signItemUnit }}</div>
              </el-col>
            </el-row>
            <template v-for="(item1, key) in signItem.childrenSignItem">
              <el-row :key="key">
                <el-col :span="21">
                  <el-form-item
                    v-if="item1.signItemFieldName === 'tiwenceliangfangshi'"
                    :key="item1.signId"
                    :label="item1.signItemShowName"
                    prop="measureMode"
                  >
                    <el-radio-group v-uni="'tikuangjilu_tiwenceliangfangshi'" v-model="confirm_form.measureMode">
                      <el-radio
                        v-for="(option, index) in item1.signItemSvgSetting"
                        :key="index"
                        :label="option.settingItem"
                        >{{ option.settingItem }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </template>
          <!-- 血糖 -->
          <template v-else-if="signItem.signItemFieldName === 'xuetang'">
            <el-row>
              <el-col :span="21">
                <el-form-item
                  v-for="(item, index) in confirm_form.signList"
                  :key="item.signId"
                  :label="signItem.signItemShowName"
                  :prop="'signList.' + index + '.signValue'"
                >
                  <el-input v-uni="'tikuangjilu_xuetang'" v-model="item.signValue" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <div style="line-height: 46px">{{ signItem.signItemUnit }}</div>
              </el-col>
            </el-row>
            <template v-for="(item1, key) in signItem.childrenSignItem">
              <el-row :key="key">
                <el-col :span="21">
                  <el-form-item
                    v-if="item1.signItemFieldName === 'celiangshike'"
                    :key="item1.signId"
                    :label="item1.signItemShowName"
                    prop="measureMode"
                  >
                    <el-select
                            v-uni="'tikuangjilu_celiangshike'"
                      v-model="confirm_form.measureMode"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(option, index) in item1.signItemSvgSetting"
                        :key="index"
                        :value="option.settingItem"
                        :label="option.settingItem"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </template>
          <!-- 血压 -->
          <template v-else-if="signItem.signItemFieldName === 'xueya'">
            <template v-for="(item1, key) in confirm_form.signList">
              <el-row v-if="item1.signItemFieldName === 'celiangweizhi'" :key="key">
                <el-col :span="21">
                  <el-form-item
                    :key="key"
                    :label="item1.signItemShowName"
                    :prop="'signList.' + key + '.signValue'"
                  >
                    <el-radio-group
                            v-uni="'tikuangjilu_celiangweizhi'"
                      v-model="confirm_form.signList[key]['signValue']"
                      v-if="item1.signItemFieldType === '3'"
                    >
                      <el-radio
                        v-for="(option, index) in item1.signItemSvgSetting"
                        :key="index"
                        :label="option.settingItem"
                        >{{ option.settingItem }}
                      </el-radio>
                    </el-radio-group>
                    <el-input
                            v-uni="'tikuangjilu_celiangweizhi'"
                      v-else
                      v-model="confirm_form.signList[key]['signValue']"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <div style="line-height: 46px">{{ item1.signItemUnit }}</div>
                </el-col>
              </el-row>
              <el-row v-else :key="key">
                <el-col :span="21">
                  <el-form-item
                    :key="key"
                    :label="item1.signItemShowName"
                    :prop="'signList.' + key + '.signValue'"
                  >
                    <el-input
                            v-uni:[key]="'tikuangjilu_xueya'"
                      v-model="confirm_form.signList[key]['signValue']"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <div style="line-height: 46px">{{ item1.signItemUnit }}</div>
                </el-col>
              </el-row>
            </template>
          </template>

          <!-- 体围 -->
          <template v-else-if="signItem.signItemFieldName === 'tiwei'">
            <template v-for="(item1, key) in confirm_form.signList">
              <el-row :key="key">
                <el-col :span="21">
                  <el-form-item
                    :key="key"
                    :label="item1.signItemShowName"
                    :prop="'signList.' + key + '.signValue'"
                    v-if="item1.signItemName !== '体围'"
                  >
                    <el-input
                            v-uni:[key]="'tikuangjilu_tiwei'"
                      v-model="confirm_form.signList[key]['signValue']"
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="3">
                  <div style="line-height: 46px">{{ item1.signItemUnit }}</div>
                </el-col> -->
              </el-row>
            </template>
          </template>

          <template v-else>
            <el-row>
              <el-col :span="21">
                <el-form-item
                  v-for="(item, index) in confirm_form.signList"
                  :key="item.signId"
                  :label="signItem.signItemShowName"
                  :prop="'signList.' + index + '.signValue'"
                >
                  <el-input  v-uni:[key]="'tikuangjilu_othersignitems'" v-model="item.signValue" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <div style="line-height: 46px">{{ signItem.signItemUnit }}</div>
              </el-col>
            </el-row>
          </template>
          <el-form-item label="时刻点" prop="measureMoment" v-if="signItem.signItemFieldName !== 'tiwei'">
            <el-select v-uni="'tikuangjilu_shikedian'" v-model="confirm_form.measureMoment">
              <el-option
                v-for="(item, key) in hours"
                :label="item.measuringTime"
                :value="item.measuringTime"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'tikuangjilu_cancel'" @click="confirmDialogVisible = false">取消</el-button>
          <el-button v-uni="'tikuangjilu_confirm'" type="primary" @click="confirm">确认</el-button>
        </span>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import { ApiSignBodyItem, ApiAutoForm } from '../../../api/nrms'
import { sign as signConfig } from '../../../assets/nrms/common/item_config'
import layout from '../../../components/nrms/layout/list'
import moment from 'moment'

export default {
  name: 'body_condition_list',
  components: { layout },
  data () {
    return {
      loading: false,
      signConfig,
      firstChecked: '',
      tableList: [],
      newSignItem: [],
      hours: [], // 时刻点
      page_current: 1,
      page_total: 0,
      confirmDialogVisible: false,
      // 查询表头数据
      th_search_form: {
        displayInBodyConditionWeb: 1,
        deptId: ''
      },
      // 查询表单
      search_form: {
        patientId: this.patient.patientId,
        signCode: '',
        source: '',
        beginTime: moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm'),
        endTime: moment().subtract(0, 'days').format('YYYY-MM-DD HH:mm'),
        nurseName: '',
        page: 1,
        size: 10
      },
      confirmData: [],
      // 确认表单
      confirm_form: {
        measureTime: moment().format('YYYY-MM-DD HH:mm'),
        measureMode: '',
        measureMoment: null,
        signList: [
          {
            itemId: '',
            conditionId: '',
            signId: '',
            signValue: ''
          }
        ]
      },
      rules: {
        measureMoment: [
          { required: true, message: '请选择时刻点！', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['patient', 'patientType', 'signItem'],
  computed: {
    btn_disable: function () {
      // 出院 || 转科
      if (this.patientType === 2 || this.patientType === 1 || this.patientType === '2' || this.patientType === '1') {
        return true
      }
      return false
    }
  },
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}

    this.search_form.deptId = deptInfo.deptId
    this.th_search_form.deptId = deptInfo.deptId
    this.search_form.patientId = this.patient.patientId

    if (this.signItem.signItemFieldName === 'xueya') {
      this.getFirstChecked(this.signItem)
    }

    this.getNewSignItemShowName(
      this.signItem,
      this.signItem['signItemShowName']
    )
    this.search_form.signCode = this.signItem.signItemFieldName

    this.getHours()
  },
  updated () {
    this.reLayout()
  },
  activated () {
    this.search_form.patientId = this.patient.patientId
    this.reLayout()
  },
  methods: {
    getFirstChecked (signItem) {
      let childItems = signItem['childrenSignItem']
      for (let k = 0; k < childItems.length; k++) {
        if (childItems[k]['signItemFieldName'] === 'celiangweizhi') {
          let _signItemSvgSetting = childItems[k]['signItemSvgSetting'] || []
          if (
            childItems[k]['signItemFieldType'] === '3' &&
            _signItemSvgSetting.length > 0
          ) {
            this.firstChecked = _signItemSvgSetting[0]['settingItem']
          } else {
            this.firstChecked = ''
          }
        }
      }
    },
    reLayout () {
      this.$nextTick(function () {
        this.$refs.table.doLayout()
      })
    },
    getHours () {
      ApiAutoForm.getFormDictByType({ formType: 2 })
        .then((res) => {
          let hours =
            res.data && res.data.temperatureTimeDos
              ? res.data.temperatureTimeDos
              : []
          this.hours = hours
        })
        .catch((res) => {
          this.$message.error(res.message)
        })
    },
    getNewSignItemShowName (data, strItem) {
      data['signItemUnit'] = data['signItemUnit']
        ? `(${data['signItemUnit']})`
        : '' // 对于体温 血压 血糖 疼痛等级只会对父级单位进行修改  不会改子集单位
      if (
        data['signItemFieldName'] === 'tiwen' ||
        data['signItemFieldName'] === 'xuetang' ||
        data['signItemFieldName'] === 'tengtongdengji'
      ) {
        return
      }
      let item = data['childrenSignItem'] || []
      if (item.length === 0) {
        // 没有子项的时候 取当前这个list放进sign_item中，重新组合
        let smallChildItem = JSON.parse(JSON.stringify(data))

        smallChildItem['newSignItemShowName'] = strItem // 总尿量-大便次数-尿量-水-排泄 格式
        this.newSignItem.push(smallChildItem)
      } else {
        for (let j = 0; j < item.length; j++) {
          let str2 = strItem + '-' + item[j]['signItemShowName']
          this.getNewSignItemShowName(item[j], str2)
        }
      }
    },
    getData () {
      ApiSignBodyItem.selectData(this.search_form)
        .then((res) => {
          let list = res.data.list || []
          this.tableList = []
          // 处理字段的映射关系
          for (let i = 0; i < list.length; i++) {
            let item = { ...list[i] }
            let signListValue = {}
            let _signList = item['signList']
            for (let j = 0; j < _signList.length; j++) {
              signListValue[_signList[j]['signId']] = _signList[j]['signValue']
            }
            item['signValue'] = signListValue
            this.tableList.push(item)
          }
          this.page_total = res.data.total
        })
        .catch((res) => {
          this.$message.error(res.message)
        })
    },
    searchForm () {
      if (!this.hasPatient()) {
        return false
      }
      this.handleCurrentChange(1)
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.$nextTick(function () {
        this.getData()
      })
    },
    editBody (data) {
      Object.assign(this.confirm_form, data)
      // 设置 血压确认弹框 测量位置为配置项的第一个选项
      for (let i = 0; i < this.confirm_form.signList.length; i++) {
        let item = this.confirm_form.signList[i]
        if (
          item['signItemFieldName'] === 'celiangweizhi' &&
          !item['signValue']
        ) {
          item['signValue'] = this.firstChecked
        }
      }

      // 设置默认时刻点为离测量时间最近的时刻点
      if (this.hours.length === 0) {
        this.$message.warning('请先设置时间配置')
        return false
      }
      let measureMoment = parseInt(
        this.confirm_form.measureTime.substr(11, 2)
      )
      let min = Math.abs(measureMoment - this.hours[0].measuringTime)
      this.confirm_form.measureMoment = this.hours[0].measuringTime
      for (let i = 0; i < this.hours.length; i++) {
        let time = this.hours[i].measuringTime
        let interval = Math.abs(measureMoment - time)
        if (interval < min) {
          this.confirm_form.measureMoment = this.hours[i].measuringTime
          min = interval
        }
      }
      this.confirmDialogVisible = true
    },
    // 获取当前秒数
    getCurrentSecond (time) {
      let s = moment().seconds()
      if (s >= 0 && s <= 9) {
        s = '0' + s
      }
      time = time.substr(0, 16) + ':' + s
      return time
    },
    confirm () {
      this.$refs.confirm_form.validate((valid) => {
        if (valid) {
          let _time = this.getCurrentSecond(this.confirm_form.measureTime)
          this.confirm_form.measureTime = _time

          ApiSignBodyItem.confirm(this.confirm_form)
            .then(() => {
              this.$message.success('保存正确！')
              this.confirmDialogVisible = false
              this.getData()
            })
            .catch((res) => {
              this.$message.error(res.message)
            })
        } else {
          return false
        }
      })
    },
    deleteBody (row) {
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        ApiSignBodyItem.delete({ conditionId: row.conditionId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getData()
          })
          .catch((res) => {
            this.$message.error(res.message)
          })
      })
    },
    hasPatient () {
      if (!this.patient.patientId) {
        this.$message.warning('请先选择患者！')
        return false
      }
      return true
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getData()
    }
    // getRowKeys(row) {
    //   return row.signId;
    // }
  },
  watch: {
    patient: {
      handler: function (val) {
        this.search_form.patientId = val.patientId
        this.search_form.page = 1
        val.patientId && this.getData()
      },
      immediate: true
    },
    signItem: {
      handler: function (val) {
        this.search_form.signCode = val.signItemFieldName
      },
      deep: true // 对象内部的属性监听，也叫深度监听
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";

.query-items {
  .split {
    display: inline-block;
    line-height: 32px;
    margin: 12px 0;
  }
}

/deep/ .el-form--inline .el-form-item {
  margin-right: 12px;
}

/deep/ .el-dialog .el-input,
.el-dialog .el-select {
  width: 360px;
}
</style>
<style lang="scss" type="text/scss">
.classifyDialogStyle {
  .el-dialog__body {
    padding-bottom: 15px;
  }

  .el-input,
  .el-input__inner {
    width: 360px;
  }

  .el-form-item.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: "";
  }

  .el-form-item--small .el-form-item__content,
  .el-form-item--small .el-form-item__label {
    line-height: 46px;
  }

  .el-dialog__footer {
    padding: 0 20px 20px 20px;
  }
}

.right .el-tabs__content {
  top: 57px !important;
}

.el-message-box__wrapper .el-message-box .el-message-box__btns {
  padding-top: 0px;
}
</style>
