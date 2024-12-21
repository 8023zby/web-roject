<template>
  <div v-loading="loading" class="container">
    <div>
      <div class="toolbar" v-if="patient.type == 2">
        <!-- 查询条件 -->
        <div class="search_form"></div>
        <!-- 操作按钮 -->
        <div class="operation">
          <div class="left"></div>
          <div class="right">
            <el-button type="warning" @click="addBody" icon="el-icon-plus" >
              新建体况
            </el-button>
          </div>
        </div>
      </div>

      <el-table
        ref="table"
        highlight-current-row
        :row-key="getRowKeys"
        :data="tableList"
        height="60%"
      >
        <el-table-column
          prop="recordTime"
          align="center"
          width="100"
          label="日期">
        </el-table-column>

        <!--  动态表头  -->
        <template v-for="item in sign_item">
          <el-table-column
            :key="item.signFieldName"
            :prop="item.signFieldName"
            align="center"
            min-width="100"
            :label="item.signItemShowName">
          </el-table-column>

          <el-table-column
            v-if="item.signFieldName == 'tiwen'"
            prop="tiwen_itemValueType"
            align="center"
            min-width="100"
            label="测量方式">
            <template slot-scope="scope">
              {{sign_config.tiwen_type[scope.row.tiwen_itemValueType]}}
            </template>
          </el-table-column>
          <el-table-column
            v-if="item.signFieldName == 'tiwen'"
            prop="tiwen_phValue"
            align="center"
            min-width="100"
            label="复测体温">
          </el-table-column>
          <el-table-column
            v-if="item.signFieldName == 'tengtongdengji'"
            prop="tengtongdengji_phValue"
            align="center"
            min-width="100"
            label="复测疼痛">
          </el-table-column>
          <el-table-column
            v-if="item.signFieldName == 'shuzhangya'"
            prop="shuzhangya_phValue"
            align="center"
            min-width="100"
            label="测量位置">
          </el-table-column>
        </template>

        <!--<el-table-column-->
        <!--label="操作"-->
        <!--fixed="right"-->
        <!--width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button @click="editBody(scope.row)" type="text" size="small">-->
        <!--编辑-->
        <!--</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
  </div>
  </div>
</template>

<script>
  import { ApiSignItemSetting, ApiBodyCondition } from '../../../../../api/nrms'
  import { extendItem, bloodSugarTime } from './extendItem'
  import { sign as sign_config } from '../../../../../assets/nrms/common/item_config'

  export default {
    name: 'body_condition_list',
    data () {
      return {
        loading: false,
        sign_config,
        tableList: [],
        sign_item: [],
        extendItem,
        bloodSugarTime,
        //查询表单
        search_form: {
          patientId: '',
          deptId: '',
          orgId: '',
          startTime: '',
          endTime: '',
          timeFrame: []
        },
        empInfo: {}
      }
    },
    props: ['patient', 'patientType', 'entryType'],
    created () {
      this.search_form.patientId = this.patient.patientId;
      this.search_form.deptId = this.patient.deptId;
      this.search_form.orgId = this.patient.orgId;
      this.getSignItem()
    },
    activated (){
      this.search_form.patientId && this.getData()
    },
    updated () {
      this.$nextTick(function () {
        this.$refs.table.doLayout()
      })
    },
    methods: {
      getSignItem () {
        let _this = this;
        ApiSignItemSetting.selectItemApp({ deptId: this.patient.deptId, isTemperatureDisplay: 1 })
          .then(res => {
            _this.sign_item = res.data || [];

            for (let i = 0; i < _this.extendItem.blood_sugar.length; i++) {
              let _d = _this.extendItem.blood_sugar[i]
              _this.sign_item.push({signFieldName: _d['code'], signItemShowName: _d['title']})
            }
            for (let i = 0; i < _this.extendItem.blood_sugar.length; i++) {
              let _d = _this.extendItem.bracelet[i]
              _this.sign_item.push({signFieldName: _d['code'], signItemShowName: _d['title']})
            }

            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      },
      getData () {
        let obj = { ...this.search_form }
        delete obj.timeFrame
        ApiBodyCondition.selectApp(obj).then(res => {
          this.tableList = res.data // [{recordDate: '2018-09-02'}];
        }).catch(res => {
          this.$message.error(res.message)
        })
      },
      searchForm () {
        this.getData()
      },
      resetForm () {
        this.$refs.search_form.resetFields()
      },
      addBody () {
        // if (!this.patient || !this.patient.patientId) {
        //   this.$message.warning('请先选择患者！')
        //   return false
        // }
        this.$emit('option-changed', 'add', '')
      },
      editBody (data) {
        this.$emit('option-changed', 'add', data.codId)
      },
      deleteBody (row) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ApiNurseNotes.delete({ recordId: row.recordId })
            .then(() => {
              this.$message.success('删除成功！')
              this.getData()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        })
      },
      getRowKeys (row) {
        return row.recordId
      }
    },
    watch: {
      'patient' (val) {
        //this.search_form.patientId = val.patientId
        //this.getData()
      },
      'search_form.timeFrame' (val) {
        this.search_form.startTime = val[0]
        this.search_form.endTime = val[1]
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    height: 100%;
    > div {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 93%;
      width: 100%;
      height: 100%;
    }

    @import '../../../../../assets/nrms/pad/css/table';
  }

  .toolbar {
    padding: 10px;
    border-bottom: 1px solid #ebeef5;

    /deep/ .el-button {
      border-radius: 5px !important;
    }

    .operation {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        justify-content: flex-start;
      }

      .right {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
