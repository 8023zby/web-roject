<template>
    <!--绩效管理-班次系数设置-->
    <div class="typt-list-container">
        <!--列表-->
        <el-table
                :data="tableData"
                :stripe="CONFIG.table.stripe"
                v-loading="loading"
                height="530px"
                :header-cell-style="{background:'#F2F2F2'}">
            <el-table-column
                    prop="shiftName"
                    align="center"
                    label="班次名称"
            >
            </el-table-column>
            <el-table-column
                    prop="shiftCoefficient"
                    align="center"
                    label="系数">
                <template slot-scope="scope">
                    <duty-coefficient :curRow="curRow"
                                      :selectArr="selectArr"
                                      :row="scope.$index"
                                      @dealSelData="dealSelData"
                                      :srcData="scope.row"/>
                </template>
            </el-table-column>
            <!--el-table-column
              label="操作"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="modify(scope.$index)" size="mini">编辑</el-button>
              </template>
            </el-table-column-->
        </el-table>
        <!--end-->
        <!--selectShow-->
        <div v-show="true"
             slot="footer"
             class="dialog-footer btnDiv"
             style="text-align: right;margin-top: 0;padding-top: 20px;padding-right: 24px;margin-bottom: 25px;margin-right: 0;border-top: 1px solid #EBEBEB;">
            <el-button @click="refresh1" style="width: 70px;height: 40px;">取消</el-button>
            <el-button type="primary" @click="saveData" style="width: 70px;height: 40px;"
                       :loading="addVis">确认
            </el-button>
        </div>
    </div>
</template>

<script>
import DutyCoefficientVue from '../../../assets/hsms/mixins/DutyCoefficient'
import DutyCoefficient from '../../../components/hsms/DutyCoefficient'
import config from '../../../assets/hsms/mixins/config'
import { filterData } from '../../../assets/hsms/unitils/unitils'
import { AxiosJsonApi } from '../../../api/hsms'
import { ResultMsg } from '../../../assets/hsms/js/Message'

export default {
  name: 'NurseDutyCoefficient',
  components: {
    'duty-coefficient': DutyCoefficient
  },
  mixins: [DutyCoefficientVue, config],
  inject: ['viewRefresh'],
  data () {
    return {
      selectShow: false,
      selectArr: '',
      curRow: '',
      modelName: '班次系数',
      formSearchData: {
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/shift/NURSE/coefficient'
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 处理选择数据
    dealSelData (item, index) {
      this.selectData[index].shiftCoefficient = item
    },
    // 修改
    modify (index) {
      this.selectShow = true
      this.curRow = index
      this.selectArr += `,${index},`
    },
    // 保存
    saveData () {
      this.saveDataDo(
        { data: this.selectData },
        'add',
        {},
        false
      )
    },
    saveDataDo (data, act, params = {}, isOne = true) {
      let businessType = this.formSearchData.businessType
      let methodType = 'POST'
      let actMsg = '添加'
      let addData
      if (!act) {
        act = 'add'
      }
      if (act === 'add') {
        addData = filterData(data)
      } else if (act === 'modify') {
        methodType = 'PUT'
        actMsg = '修改'
        addData = data
      }
      this.addVis = true
      AxiosJsonApi(this.url, addData, methodType, params).then(res => {
        if (isOne) {
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl)
        } else {
          ResultMsg(res, actMsg + this.modelName, this.refresh)
        }
        if (res.status !== 200) {
          this.addVis = false
        } else {
          this.refresh1()
        }
      })
    },
    refresh1 () {
      this.$emit('main-close')
    },
    // 取消
    refresh () {
      this.viewRefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
    .btnDiv {
        text-align: center;
        margin-top: 20px;
    }

    .el-table::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0;
    }

    /deep/ .el-dialog__body {
        padding: 0 !important;
    }

    /deep/ .gutter {
        background: rgb(242, 242, 242) !important;
    }

    /deep/ .el-input-number__decrease, /deep/ .el-input-number__increase {
        height: 46px;
        line-height: 46px;
    }
</style>
