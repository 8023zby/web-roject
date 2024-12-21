<template>
  <layout>
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <!--查询-->
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-form-item label="班次类型:" prop="shiftType">
          <el-select v-model="searchForm.shiftType" filterable clearable placeholder="请选择">
            <el-option
              v-for="(name, id) in shiftTypes"
              :key="id"
              :label="name"
              :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班次名称:" prop="shiftName">
          <el-input
            v-model="searchForm.shiftName"
            size="small" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button
            v-uni="'bancikuguanli_search'"
            type="primary" icon="el-icon-search"
            @click="searchSubmit" size="small">搜索
          </el-button>
          <el-button v-uni="'bancikuguanli_reset'" type="text" @click="searchReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <el-button
        v-uni="'bancikuguanli_add'"
        type="warning"
        @click="$emit('changed', 'add')"
        icon="el-icon-plus">添加
      </el-button>
    </div>
    <div slot="right_btn" class="tool-bar">
      <el-button
        v-uni="'bancikuguanli_columnSetting'"
        type="primary"
        @click="tableHeaderVisible = true">
        列设置
      </el-button>
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        height="100%"
      >
        <!-- <el-table-column type="index" align="center" label="序号" width="90">
          <template slot-scope="scope">
            <span>{{(pageInfo.page - 1) * pageInfo.size + (scope.$index + 1)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          v-if="tableHeaderFields.includes('shiftType')"
          prop="shiftType"
          align="center"
          :formatter="formatType"
          label="班次类型">
        </el-table-column>
        <el-table-column
          class-name="repoShiftName"
          prop="repoShiftName"
          align="center"
          label="班次名称"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <div :style="{background: scope.row.backgroundColor, color: scope.row.foregroundColor}">
              <span>{{scope.row.repoShiftName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableHeaderFields.includes('arrivalTime')"
          prop="arrivalTime"
          align="center"
          label="到岗时间">
        </el-table-column>
        <el-table-column
          v-if="tableHeaderFields.includes('shiftTime')"
          prop="shiftTime"
          align="center"
          label="起止时间"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{formatShiftTime(scope.row.shiftTime)}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableHeaderFields.includes('workHours')"
          prop="workHours"
          align="center"
          label="工时">
        </el-table-column>
        <el-table-column
          v-if="tableHeaderFields.includes('shiftImg')"
          prop="shiftImg"
          align="center"
          label="图标设置">
          <template slot-scope="scope">
            <i v-if="scope.row.shiftImg" class="iconfont-hsms" :class="iconContrast[scope.row.shiftImg].id" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableHeaderFields.includes('isExtra')"
          prop="isExtra"
          align="center"
          label="加扣班设置"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{formatSetting(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableHeaderFields.includes('shiftDescribe')"
          prop="shiftDescribe"
          align="center"
          label="班次说明"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-uni:[scope.row.repoShiftId]="'bckgl_switch_status'"
              :key="'bckgl_switch_status' + scope.row.repoShiftId"
              @change="onChangeDutyStatus(scope.row)"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="240">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-uni:[scope.row.repoShiftId]="'bancikuguanli_copy'"
              :key="'bancikuguanli_copy' + scope.row.repoShiftId"
              @click="onCloneRow(scope.row)">
              复制
            </el-button>
            <el-button
              type="text"
              v-uni:[scope.row.repoShiftId]="'bancikuguanli_edit'"
              :key="'bancikuguanli_edit' + scope.row.repoShiftId"
              @click="$emit('changed', 'add', scope.row)">
              编辑
            </el-button>
            <el-button type="textred" v-uni:[scope.row.repoShiftId]="'bancikuguanli_delete'"
 :key="'bancikuguanli_delete' + scope.row.repoShiftId" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageInfo.page"
        :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>

    <!-- 列设置 -->
    <el-dialog
      title="列设置"
      :visible="tableHeaderVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="580px">
      <div class="list-header">
        <div style="color: #333; font-size: 14px">在表单中显示列:</div>
        <el-checkbox-group v-model="tableHeaderFields">
          <el-checkbox v-for="item in tableHeaders" :label="item.field" :key="item.field" style="width: 25%; margin: 5px 0">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'bckgl_lsz_cancel'" @click="onTableColumnSettingCancel">取消</el-button>
        <el-button v-uni="'bckgl_lsz_save'" type="primary" @click="onTableColumnSetting">确认</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import layout from '../../../components/hsms/layout/list'
import { ApiNurseDuty, ApiNurseShift } from '../../../api/hsms/api'
import listMixin from './listMixin'
import iconContrast from './iconContrast'

export default {
  name: 'NurseDuty',
  components: {
    layout
  },
  props: ['params'],
  mixins: [listMixin],
  data () {
    return {
      rowKey: 'repoShiftId', // 唯一值
      iconContrast,
      tableHeaderVisible: false,
      tableHeaders: [{
        name: '班次类型',
        field: 'shiftType'
      }, {
        name: '到岗时间',
        field: 'arrivalTime'
      }, {
        name: '起止时间',
        field: 'shiftTime'
      }, {
        name: '工时',
        field: 'workHours'
      }, {
        name: '图标设置',
        field: 'shiftImg'
      }, {
        name: '加扣班设置',
        field: 'isExtra'
      }, {
        name: '班次说明',
        field: 'shiftDescribe'
      }],
      tableHeaderFields: [],
      shiftTypes: {},
      searchForm: {
        shiftName: '',
        shiftType: ''
      }
    }
  },
  async created () {
    // 列设置
    this.tableHeaderFields = []
    if (localStorage.getItem('dutyFieldSetting')) {
      this.tableHeaderFields = JSON.parse(localStorage.getItem('dutyFieldSetting'))
    } else {
      this.tableHeaders.forEach(item => {
        this.tableHeaderFields.push(item.field)
      })
      localStorage.setItem('dutyFieldSetting', JSON.stringify(this.tableHeaderFields))
    }
    await this.getShiftType()
    Object.assign(this.searchForm, this.pageInfo)
    this.loadData()
  },
  methods: {
    loadData () {
      this.loading = true
      ApiNurseDuty.select(this.searchForm)
        .then(res => {
          this.tableData = res.data && res.data.list ? res.data.list : []
          this.pageInfo.total = res.data && res.data.total ? res.data.total : 0
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 列设置
    onTableColumnSetting () {
      localStorage.setItem('dutyFieldSetting', JSON.stringify(this.tableHeaderFields))
      this.tableHeaderVisible = false
    },
    onTableColumnSettingCancel () {
      this.tableHeaders.forEach(item => {
        this.tableHeaderFields.push(item.field)
      })
      localStorage.setItem('dutyFieldSetting', JSON.stringify(this.tableHeaderFields))
      this.tableHeaderVisible = false
    },
    // 克隆
    onCloneRow (row) {
      let _row = JSON.parse(JSON.stringify(row))
      _row.repoShiftId = 'clone'
      _row.repoShiftName = _row.repoShiftName + '-副本'
      this.$emit('changed', 'add', _row)
    },
    onDelete (row) {
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiNurseDuty.delete({ repoShiftId: row.repoShiftId })
          .then(() => {
            this.$message.success('删除成功！')
            this.handleCurrentChange(1)
          })
          .catch(res => {
            this.$message.error(res.message || '删除失败！')
          })
      })
    },
    // 获取班次类型
    async getShiftType () {
      await ApiNurseShift.types({ businessType: 'NURSE' }).then(res => {
        let data = res.data
        const temp = {}
        data.forEach((item) => {
          for (let p in item) {
            temp[p] = item[p]
          }
        })
        this.shiftTypes = temp
      })
    },
    // 状态 启用|停用
    onChangeDutyStatus (row) {
      let s = row.status
      ApiNurseDuty.status({ repoShiftId: row.repoShiftId })
        .then(() => {
          this.$message.success('操作成功！')
        })
        .catch(res => {
          row.status = !s
          this.$message.error(res.message || '操作失败！')
        })
    },
    formatSetting (row) {
      let str = ''
      if (row.isExtra) {
        const text1 = row.extraType === 1 ? '加班' : '扣班'
        const text2 = row.extraType === 1 ? '增加' : '扣除'
        str += text1 + row.extraTime + '小时'
        if (row.vacationTime) {
          str += '，' + text2 + '存假' + row.vacationTime + '小时'
        }
        if (row.annualTime) {
          str += '，' + text2 + '年假' + row.annualTime + '小时'
        }
      }
      return str
    },
    formatShiftTime (val) {
      if (val === null || val === undefined || val === '' || val === 'null') {
        return ''
      }
      if (typeof (val) === 'string') {
        val = JSON.parse(val)
      }
      let str = []
      for (let i = 0; i < val.length; i++) {
        let item = val[i]
        str.push(item.beginTime + '-' + item.endTime)
      }

      return str.join('，')
    },
    // 班次类型
    formatType (item) {
      return this.shiftTypes[item.shiftType] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/hsms/css/self_common";
  @import "../../../../public/static/hsms/icons/iconfont.css";

  /deep/.repoShiftName {
    padding: 0;
    margin: 0;

    /deep/ .cell {
      height: 100%;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 0 5px;

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
