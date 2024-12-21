<template>
    <layout v-loading="loading">
        <div slot="left_btn"
             class="tool-bar">
            <el-button type="warning"
                       icon="el-icon-plus"
                       v-uni="'jiaobanshezhi_add'"
                       @click="shiftsAdd">添加
            </el-button>
        </div>
        <div slot="right_btn"
             class="tool-bar">
            <el-button type="primary"
                       v-uni="'jiaobanshezhi_save'"
                       @click="shiftsUse" >应用
            </el-button>
        </div>

        <!-- 表格 -->
        <div slot="main"
             class="main-list">
            <el-table ref="table"
                      :data="shift_setting_data"
                      :border="false"
                      :stripe="true"
                      height="100%"
                      :header-cell-style="headerCellStyle"
                      highlight-current-row
                      style="width: 100%">
                <!-- <el-table-column type="index"
                                 label="序号"
                                 align="center"
                                 width="70"/> -->
                <el-table-column
                        prop="shiftMainName"
                        label="名称"
                        align="center"
                        show-overflow-tooltip
                        min-width="100"
                        header-align="center"/>
                <el-table-column
                        prop="shiftType"
                        label="交班模式"
                        align="center"
                        show-overflow-tooltip
                        min-width="100"/>
                <el-table-column label="班次1" header-align="center">
                    <el-table-column
                            prop="shiftName"
                            header-align="center"
                            label="班次名称"
                            align="center"
                            show-overflow-tooltip
                            min-width="120">
                        <template slot-scope="scope">
                            {{scope.row.bnShiftChildList[0] && scope.row.bnShiftChildList[0].shiftName}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="beginTime"
                            align="center"
                            label="开始时间"
                            min-width="130">
                        <template slot-scope="scope">
                            {{scope.row.bnShiftChildList[0] && scope.row.bnShiftChildList[0].beginTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="endTime"
                            align="center"
                            label="结束时间"
                            min-width="130">
                        <template slot-scope="scope">
                            {{scope.row.bnShiftChildList[0] && scope.row.bnShiftChildList[0].endTime}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="班次2" header-align="center">
                    <el-table-column
                            prop="shiftName"
                            header-align="center"
                            label="班次名称"
                            align="center"
                            show-overflow-tooltip
                            min-width="120">
                        <template slot-scope="scope">
                            {{scope.row.bnShiftChildList[1] && scope.row.bnShiftChildList[1].shiftName}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="beginTime"
                            align="center"
                            label="开始时间"
                            min-width="130">
                        <template slot-scope="scope">
                            {{scope.row.bnShiftChildList[1] && scope.row.bnShiftChildList[1].beginTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="endTime"
                            align="center"
                            label="结束时间"
                            min-width="130">
                        <template slot-scope="scope">
                            {{scope.row.bnShiftChildList[1] && scope.row.bnShiftChildList[1].endTime}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="班次3" header-align="center">
                    <el-table-column
                            prop="shiftName"
                            header-align="center"
                            label="班次名称"
                            align="center"
                            show-overflow-tooltip
                            min-width="120">
                        <template slot-scope="scope">
                            {{scope.row.bnShiftChildList[2] && scope.row.bnShiftChildList[2].shiftName}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="beginTime"
                            align="center"
                            label="开始时间"
                            min-width="130">
                        <template slot-scope="scope">
                            {{scope.row.bnShiftChildList[2] && scope.row.bnShiftChildList[2].beginTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="endTime"
                            align="center"
                            label="结束时间"
                            min-width="130">
                        <template slot-scope="scope">
                            {{scope.row.bnShiftChildList[2] && scope.row.bnShiftChildList[2].endTime}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column
                        prop="remarks"
                        label="备注"
                        min-width="100"
                        align="center"
                        show-overflow-tooltip/>

                <el-table-column fixed="right" label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button @click="shiftsEdit(scope.row)"
                                   type="text"
                                   size="medium"
                                   v-uni:[scope.row.shiftMainId]="'jiaobanshezhi_edit'"
                                   :key="'jiaobanshezhi_edit' + scope.row.shiftMainId"
                                   >编辑
                        </el-button>
                        <el-button type="textred"
                                   size="medium"
                                   @click="shiftsDelete(scope.row)"
                                    v-uni:[scope.row.shiftMainId]="'jiaobanshezhi_delete'"
                                   :key="'jiaobanshezhi_delete' + scope.row.shiftMainId"
                                   >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <template slot>
            <!-- 标签应用到科室 -->
            <Shift2Dept ref="Shift2Dept"
                        :visible.sync="shifts2nurse_visible"
                        :shifts="shift_setting_data"/>
        </template>
    </layout>
</template>

<script>
import Shift2Dept from './Shift2Dept'
import { ApiShifts, ApiDept } from '../../../api/bnms/index'
import layout from '../../../components/bnms/layout/list'

export default {
  name: 'nurse_level_list',
  data () {
    return {
      loading: false,
      shift_setting_data: [],
      // 标签应用
      shifts2nurse_visible: false,
      shifts2nurse_data: [],
      current_nurse_level_id: '',
      nurse_data: []
    }
  },
  created () {
  },
  activated () {
    this.getShiftData()
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
    headerCellStyle ({ row, column, rowIndex, columnIndex }) {
      if ((rowIndex === 0 && columnIndex === 3) || (rowIndex === 0 && columnIndex === 4) ||
                    (rowIndex === 0 && columnIndex === 5) || (rowIndex === 0 && columnIndex === 6) ||
                    (rowIndex === 1 && columnIndex === 3) || (rowIndex === 1 && columnIndex === 0) ||
                    (rowIndex === 1 && columnIndex === 6)) {
        return 'border-left: 1px solid #E4E7ED;'
      }
    },
    getShiftData () {
      // this.shift_setting_data = [
      //   {
      //     shiftId: '1', shiftMainName: '三班倒', shiftType: '三班倒',
      //     bnShiftChildList: [
      //       { shiftName: '白班', beginTime: '12:00', endTime: '17:00' },
      //       { shiftName: '大夜', beginTime: '17:00', endTime: '00:00' },
      //       { shiftName: '小夜', beginTime: '00:00', endTime: '12:00' }
      //     ]
      //   },
      //   {
      //     shiftId: '2', shiftMainName: '两班倒', shiftType: '两班倒',
      //     bnShiftChildList: [
      //       { shiftName: '白班', beginTime: '12:00', endTime: '17:00' },
      //       { shiftName: '夜班', beginTime: '17:00', endTime: '00:00' },
      //     ]
      //   }
      // ];
      this.loading = false
      ApiShifts.select()
        .then(res => {
          this.shift_setting_data = res.data
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    shiftsUse () {
      this.shifts2nurse_visible = true
    },
    shiftsAdd () {
      this.$emit('option-changed', 'add')
    },
    shiftsEdit (row) {
      this.$emit('option-changed', 'add', row)
    },
    shiftsDelete (row) {
      this.$confirm('确认要删除该数据？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiShifts.delete({ shiftMainId: row.shiftMainId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getShiftData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    }
  },
  components: {
    Shift2Dept, layout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    @import "../../../assets/bnms/css/self_common";

    .main-list {
        /deep/ .el-table th {
            border-top: none !important;
            border-right: none !important;
        }

        /deep/ .el-table--border td {
            border-right: none !important;
        }

        /deep/ .el-table_4_column_32 {
            border-left: 1px solid #E4E7ED;
            border-right: 1px solid #E4E7ED;
        }
    }
</style>
