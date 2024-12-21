<template>
    <div class="holiday_type_container">
        <el-form :rules="rules" :model="holidayTypeData" label-width="80px" ref="holidayTypeForm">
            <el-row>
                <el-col :span="15" :offset="1">
                    <el-form-item label="假期类型" prop="holidayClass" width="216px">
                        <el-input v-model="holidayTypeData.holidayClass"  maxlength="10"  clearable/>
                    </el-form-item>
                </el-col>
                <el-col :span="7" :offset="1">
                    <el-button type="primary" size="small" @click="saveData"
                               style="height: 40px;width: 70px;margin-left: -8px;margin-top: 3px;"
                               :loading="addLoading" v-uni="'qingjiaguanli_class_save'">保存
                    </el-button>
                    <el-button type="text" size="small" @click="resetEventForm"
                               style="margin-left: 20px;margin-top: 3px;" v-uni="'qingjiaguanli_class_reset'">重置
                    </el-button>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="23" :offset="1">
                    <el-form-item label="备注" prop="description">
                        <el-input v-model="holidayTypeData.holidayClassId" style="display: none"/>
                        <el-input type="textarea" placeholder="请输入" v-model="holidayTypeData.description"
                                  style="width: 360px;min-width: 70px;" maxlength="100"
                                  show-word-limit/>
                    </el-form-item>

                </el-col>
            </el-row>

        </el-form>
        <el-table
                highlight-current-row
                :data="holidayTypeDataList"
                height="270px"
        >
            <!-- <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column> -->
            <el-table-column
                    label="假期类型"
                    prop="holidayClass"
                    min-width="50"
                    align="center"
            ></el-table-column>
            <el-table-column
                    label="备注"
                    prop="description"
                    min-width="80"
                    align="center"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button @click="editData(scope.row)" type="text" v-uni:[scope.row.holidayClassId]="'qingjiaguanli_qingjialeixing_edit'" :key="'qingjiaguanli_qingjialeixing_edit' + scope.row.holidayClassId"
                    >编辑
                    </el-button>
                    <el-button
                            type="textred"
                            @click="deleteData(scope.row, scope.$index)"
                            v-uni:[scope.row.holidayClassId]="'qingjiaguanli_qingjialeixing_delete'" :key="'qingjiaguanli_qingjialeixing_delete' + scope.row.holidayClassId"
                    >删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { ApiHolidayType } from '../../../api/hsms'

export default {
  name: 'holiday-type',
  data () {
    return {
      holidayTypeDataList: [],
      holidayTypeData: {
        holidayClassId: '',
        holidayClass: '',
        description: ''
      },
      rules: {
        holidayClass: [
          { required: true, message: '请输入假期类型！' }
        ]
      },
      addLoading: false
    }
  },
  mounted () {
    this.getData()
  },
  /* created() {
            this.getData();
        }, */
  methods: {
    getData () {
      ApiHolidayType.get().then(res => {
        this.holidayTypeDataList = res.data || []
      }).catch(res => {
        this.$message.error(res.message)
      }).finally()
      {
        this.clearData()
      }
    },
    saveData () {
      this.addLoading = true
      if (this.holidayTypeData.holidayClassId) {
        ApiHolidayType.update(this.holidayTypeData).then(res => {
          this.getData()
        }).catch(res => {
          this.$message.error(res.message)
        }).finally()
        {
          this.addLoading = false
        }
      } else {
        ApiHolidayType.save(this.holidayTypeData).then(res => {
          this.getData()
        }).catch(res => {
          this.$message.error(res.message)
        }).finally()
        {
          this.addLoading = false
          // this.clearData();
        }
      }
    },
    editData (row) {
      this.holidayTypeData.description = row.description
      this.holidayTypeData.holidayClass = row.holidayClass
      this.holidayTypeData.holidayClassId = row.holidayClassId
    },
    clearData () {
      this.$refs.holidayTypeForm.resetFields()
    },
    resetEventForm () {
      this.$refs.holidayTypeForm.resetFields()
      console.log(this.holidayTypeData.holidayClassId)
    },
    deleteData (row, index) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiHolidayType.delete({ holidayClassId: row.holidayClassId })
          .then(() => {
            this.$message.success('删除成功！')
            this.holidayTypeDataList.splice(index, 1)
            if (this.holidayTypeData.holidayClassId && this.holidayTypeData.holidayClassId === row.holidayClassId) {
              this.$refs.holidayTypeForm.resetFields()
            }
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .holiday_type_container {
        width: 100%;
        padding: 5px 0 0 0;

        /deep/ .el-input--small, /deep/ .el-button--mini, .el-button--small, /deep/ .el-table .cell {
            font-size: 14px;
        }

        .saveAndReset {
            line-height: 46px;
            padding-left: 19px;

            /deep/ .el-button--primary {
                width: 70px;
                height: 40px;
            }
        }
    }

    /* 表格-表头样式 */
    /deep/ .el-table {
        padding-top: 12px;
    }

    /deep/ .el-table th {
        background-color: #f7f7f7;
        color: #333333;
        font-size: 16px;
        font-weight: normal;
        border-top: 1px solid #E4E7ED;
        border-bottom: 1px solid #E4E7ED;
        padding: 12px 0;

        > .cell {
            color: initial;
            font-size: 16px !important;
        }
    }

    /deep/ .el-form-item__content {
        width: 216px;
    }
</style>
