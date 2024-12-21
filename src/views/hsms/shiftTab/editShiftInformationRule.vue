<template>
  <!--医护排班-排班规则-周编辑-->
  <div class="typt-list-container">
    <!--列表-->
    <el-table
      style="border-top: 1px solid #EBEEF5;"
      :data="tableData"
      :stripe="CONFIG.table.stripe"
      v-loading="loading"
      height="80%"><!--border-->
      <el-table-column
        align="center"
        prop="empKey"
        label="工号"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="accountName"
        label="姓名"
      >
      </el-table-column>
      <el-table-column v-for="(item,index) in weekData"
                       :render-header="renderHeader"
                       :key="index"
                       align="center"
                       :prop="item.id"
                       :label="item.name">
        <template slot-scope="scope">
          <shift-manage :type="'rule'"
                        :ref="index + '-' + scope.$index"
                        :id="index + '-' + scope.$index"
                        @dealSelData="dealSelData"
                        @dealSelFocus="dealSelFocus"
                        :srcData="scope.row"
                        :col="index"
                        :row="scope.$index"
                        :dataId="item.id"
                        :flag="selectShow"
                        :dutyData="dutyData"/>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv" style="height: 50px;">
      <el-button v-uni="'yszhoupaibanguize_cancel'" @click="refresh" style="width: 70px;height: 40px;">取消</el-button>
      <el-button v-uni="'yszhoupaibanguize_save'" type="primary" @click="saveData" :loading="addVis" style="width: 70px;height: 40px;">保存</el-button>
    </div>
  </div>
</template>

<script>
import ShiftInformation from '../../../assets/hsms/mixins/ShiftInformation'
import ShiftManage from '../../../components/hsms/ShiftManager'
import SetConfig from '../../../components/hsms/SetConfig'
import DutyTypeSet from '../../../assets/hsms/mixins/DutyTypeSet'
import { AxiosJsonApi, GetDuty, GetNurseUser } from '../../../api/hsms'
import { DateFormate, filterData } from '../../../assets/hsms/unitils/unitils'
import { ResultMsg } from '../../../assets/hsms/js/Message'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseShiftInformationRule',
  components: {
    'shift-manage': ShiftManage,
    'set-config': SetConfig
  },
  mixins: [ShiftInformation, DutyTypeSet, config],
  // provide () {
  //   return {
  //     tabRefresh: this.reload,
  //     getBusinessType: this.getBusinessType
  //   }
  // },
  // inject: ['tabRefresh', 'getBusinessType'],
  data () {
    return {
      businessType: '',
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
      url: '/hsms/web-hs/rule',
      select: {
        id: ''
      }
    }
  },
  // 初始化
  created () {
    this.businessType = this.$route.params.businessType || 'NURSE'
    this.formSearchData.businessType = this.getBusinessType()
    this.initWeekData()
    this.getNurseUser()
    this.getDuty()
    this.selectShow = true
  },
  mounted () {
    console.log('mounted')
    let that = this
    window.addEventListener('scroll', function (e) {
      that.scrollFunc()
    }, true)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollFunc)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollFunc)
  },
  methods: {
    scrollFunc () {
      // let header = document.getElementsByClassName('has-gutter')[0];
      let header = $('.has-gutter')
      let header_offset = header.offset() || null
      if (header_offset === null) {
        return false
      }
      let header_top = +header_offset.top + 50
      if (this.select === undefined || this.select === null || this.select === '') {
        return false
      }
      let ref = this.$refs[this.select.id][0] || null
      $('.el-select-dropdown').each(function (e) {
        if ($(this).css('display') === 'none') {

        } else {
          let el_select_dropdown = this
          let el_select_dropdown_offset_top = el_select_dropdown.offsetTop
          if (+el_select_dropdown_offset_top <= +header_top) {
            console.log('小于了')
            ref && ref.blur()
            // $(this).css('display', 'none');
            // ref.$refs.input.blur();
          }
        }
      })
    },
    getBusinessType () {
      return this.businessType
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
      console.log(this.weekData)
    },
    // 刷新页面
    refresh () {
      // this.tabRefresh('first', this.setParam.setFormData.scheduleMode)
      this.reloadUrl1()
    },
    // 保存
    saveData () {
      // console.log(JSON.stringify(this.selectedData))
      this.saveDataDo1({ data: this.selectedData }, 'add', {}, false)
    },
    // 保存数据
    saveDataDo1 (data, act, params = {}, isOne = true) {
      // console.log(data);
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
      AxiosJsonApi(this.url + '/' + this.formSearchData.businessType, addData, methodType, params).then(res => {
        if (isOne) {
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl1)
        } else {
          // ResultMsg(res, actMsg + this.modelName, this.refresh)
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl1)
        }
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
    // 返回
    reloadUrl1 () {
      // let businessType = this.businessType || this.formSearchData.businessType
      // this.$emit('option-changed', 'list', { businessType: businessType })
      this.$emit('changed', 'list')
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
    dealSelFocus (id) {
      this.select.id = id
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
  .shift-button {
    width: 80px;
    height: 28px;
    /*line-height: 14px;*/
    text-align: center;
    /*padding: 6px 0 !important;*/
    border-radius: 2px !important;
  }

  /deep/.el-dialog__wrapper .el-dialog__footer .el-button--default,
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

  /deep/ el-table {
    border-top: 1px solid #EBEEF5;
  }
</style>
