<template>
    <!--医护排班-排班规则-周-->
    <div class="typt-list-container">
        <div class="typt-list-add-div">
            <div class="action_div">
                <el-button class="shift-button"
                           style="padding: 6px 0 !important;"
                           v-if="formSearchData.businessType == 'DOCTOR'"
                           type="primary" size="small" v-uni="'yspaibanguize_setting'" @click="showSet()">设置
                </el-button>
                <el-button class="shift-button"
                           style="padding: 6px 0 !important;"
                           type="primary"
                           v-uni="'yspaibanguize_edit'"
                           size="small" @click="setDutyRule()">编辑排班
                </el-button>
                <div class="model_cls"
                     v-if="formSearchData.businessType=='DOCTOR'">
                    当前模式:<span>{{setParam.modelObj[setParam.modelType]}}</span>
                </div>
            </div>
        </div>
        <!--end-->
        <!--列表-->
        <div style="flex: 1">
          <el-table
                  style="border-top: 1px solid #EBEEF5;"
                  :data="tableData"
                  :stripe="CONFIG.table.stripe"
                  v-loading="loading"
                  height="100%"><!--border-->
              <el-table-column
                      align="center"
                      prop="empKey"
                      show-overflow-tooltip
                      label="工号"/>
              <el-table-column
                      align="center"
                      prop="accountName"
                      show-overflow-tooltip
                      label="姓名"/>
              <el-table-column v-for="(item,index) in weekData"
                               :render-header="renderHeader"
                               :key="index"
                               align="center"
                               :prop="item.id"
                               :label="item.name">
                  <template slot-scope="scope">
                      <shift-manage :type="'rule'"
                                    @dealSelData="dealSelData" :srcData="scope.row"
                                    :col="index" :row="scope.$index" :dataId="item.id"
                                    :flag="selectShow" :dutyData="dutyData"/>
                  </template>
              </el-table-column>
          </el-table>
        </div>
        <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv">
            <el-button v-uni="'yspaibanguize_cancel'" @click="refresh">取消</el-button>
            <el-button v-uni="'yspaibanguize_save'" type="primary" @click="saveData" :loading="addVis">保存</el-button>
        </div>
        <!--设置-->
        <el-dialog title="设置"
                   :visible.sync="setParam.setFormVisible"
                   :show-close="false"
                   width="460px"
                   :close-on-click-modal="false">
            <set-config :data="setParam.getSetData.scheduleMode" @dealSetData="dealSetData"/>
            <div slot="footer" class="dialog-footer"
                 style="margin-top: -15px;padding-bottom: 5px;">
                <el-button v-uni="'yspaibanguize_setting_cancel'" @click="cancelSetAdd">取消</el-button>
                <el-button v-uni="'yspaibanguize_setting_save'" type="primary" @click="saveSetData" :loading="addVis">确认</el-button>
            </div>
        </el-dialog>
        <!--end-->
    </div>
</template>

<script>
import ShiftInformation from '../../../assets/hsms/mixins/ShiftInformation'
import ShiftManage from '../../../components/hsms/ShiftManager'
import SetConfig from '../../../components/hsms/SetConfig'
import DutyTypeSet from '../../../assets/hsms/mixins/DutyTypeSet'
import { GetDuty, GetNurseUser } from '../../../api/hsms'
import { DateFormate } from '../../../assets/hsms/unitils/unitils'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseShiftInformationRule',
  components: {
    'shift-manage': ShiftManage,
    'set-config': SetConfig
  },
  mixins: [ShiftInformation, DutyTypeSet, config],
  inject: ['tabRefresh', 'getBusinessType'],
  data () {
    return {
      typeStr: 'rule',
      weekData: [
        {
          id: '1',
          week: '星期一'
        }, {
          id: '2',
          week: '星期二'
        }, {
          id: '3',
          week: '星期三'
        }, {
          id: '4',
          week: '星期四'
        }, {
          id: '5',
          week: '星期五'
        }, {
          id: '6',
          week: '星期六'
        }, {
          id: '7',
          week: '星期日'
        }
      ],
      modelName: '排班规则',
      formSearchData: {
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/rule'
    }
  },
  // 初始化
  created () {
    this.formSearchData.businessType = this.getBusinessType()
    this.initWeekData()
    this.getNurseUser()
    this.getDuty()
  },
  methods: {
    // 编辑排班跳全页
    setDutyRule () {
      this.$emit('changed', 'add')
    },
    // 标题头样式
    renderHeader (h, { column }) {
      let v = column.label
      return h('div', { style: 'line-height:20px;' }, [
        h('span', v)
      ])
    },
    // 返回周一到周日
    getCurWeek (time) {
      let d = DateFormate.getMonDate(time)
      let arr = []
      for (let i = 0; i < 7; i++) {
        arr.push({
          // id: Y + '-' + M + '-' + D,
          id: '' + (i + 1) + '',
          name: DateFormate.getDayName(d.getDay()) + '',
          date: d.getDate() + '/' + (d.getMonth() + 1),
          week: DateFormate.getDayName(d.getDay())
        })
        d.setDate(d.getDate() + 1)
      }
      return arr
    },
    initWeekData () {
      let curTime = DateFormate.getNowFormatDate(new Date(new Date().getTime()))
      this.weekData = this.getCurWeek(curTime)
      // console.log(this.weekData);
    },
    // 刷新页面
    refresh () {
      this.tabRefresh('first', this.setParam.setFormData.scheduleMode)
    },
    // 保存
    saveData () {
      // console.log(JSON.stringify(this.selectedData))
      this.saveDataDo({ data: this.selectedData }, 'add', {}, false)
    },
    // 获取班次
    getDuty () {
      GetDuty(this.formSearchData.businessType).then(res => {
        this.dutyData = res
      })
    },
    // 处理选择数据
    dealSelData (item, index) {
      this.selectedData[index] = item
    },
    // 获取用户
    getNurseUser () {
      GetNurseUser(this.formSearchData.businessType).then(res => {
        this.userData = res
        this.onSearchSubmit()
      })
    }
  }
}
</script>

<style scoped lang="scss">
    @import "../../../assets/hsms/css/self_common";

    .shift-button {
        width: 80px;
        height: 28px;
        /*line-height: 14px;*/
        text-align: center;
        /*padding: 6px 0 !important;*/
        border-radius: 2px !important;
    }

    /deep/ .el-dialog__wrapper .el-dialog__footer .el-button--default,
    .el-dialog__wrapper .el-dialog__footer .el-button--primary {
        border-radius: 0 !important;
    }

    .typt-list-container .el-button--small {
        padding: 12px 20px !important;
    }

    .btnDiv {
        text-align: center;
        margin-top: 10px;
    }

    .action_div {
        text-align: right;
        position: relative;
        height: 30px;

        .model_cls {
            position: absolute;
            right: 240px;
            font-size: 14px;
            width: 150px;
            top: 5px;
        }
    }

    /deep/ .el-table {
        border-top: 1px solid #EBEEF5;
    }

    /deep/ .el-table__header {
        border-top: none;
    }

    /deep/ .el-dialog .el-form {
        margin-left: 0 !important;
    }
</style>
