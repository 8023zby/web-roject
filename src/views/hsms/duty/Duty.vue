<template>
    <!--护士排班-班次库管理-->
    <div class="typt-list-container">
        <!--查询-->
        <el-form :inline="true" :model="formSearchData"
                 class="demo-form-inline" ref="formSearch">
            <el-form-item label="班次名称：">
                <el-input v-model="formSearchData.shiftName"
                          style="width: 182px;height: 34px;"
                          size="small" placeholder="请输入" clearable/>
            </el-form-item>
            <el-form-item>
                <div class="typt-search-btn">
                    <el-button type="primary"
                               style="width: 80px;height: 28px;"
                               class="el-button-radius" icon="el-icon-search"
                               @click="onSearchSubmit" v-uni="'yishengbancikuguanli_search'" size="small">搜索
                    </el-button>
                    <el-button  v-uni="'yishengbancikuguanli_reset'"  type="text" @click="reload">重置</el-button>
                </div>
            </el-form-item>
        </el-form>
        <!--end-->
        <hr/>
        <div class="typt-list-add-div">
            <el-button type="warning" size="small"
                       @click="$emit('option-changed', 'add', { businessType: formSearchData.businessType })"
                       icon="el-icon-plus" v-uni="'yishengbancikuguanli_add'">添加
            </el-button>
        </div>
        <!--列表-->
        <el-table
                :data="tableData"
                :stripe="CONFIG.table.stripe"
                v-loading="loading"
                height="80%"
        >
            <el-table-column
                    prop="repoShiftName"
                    align="center"
                    label="班次名称"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="backgroundColor"
                    align="center"
                    label="班次颜色"
            >
                <template slot-scope="scope">
                    <div class="duty-color" :style="{background:scope.row.backgroundColor}"></div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="shiftTime"
                    align="center"
                    label="工作时间"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <!--          <work-time :srcData="scope.row.shiftTime" v-if="subAssemblyShow" />-->
                    {{formateSpanList(scope.row.shiftTime)}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="arrivalTime"
                    align="center"
                    label="到岗时间">
            </el-table-column>
            <el-table-column
                    prop="shiftType"
                    align="center"
                    :formatter="formatType"
                    label="班次类型">
            </el-table-column>
            <el-table-column
                    prop="shiftDescribe"
                    align="center"
                    label="班次说明"
                    show-overflow-tooltip>
            </el-table-column>
            <!--<el-table-column
              :formatter="formatDept"
              align="center"
              prop="deptId"
              label="所属病区">
            </el-table-column>-->
            <el-table-column
                    prop="workHours"
                    align="center"
                    label="工时">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作"
                    width="240">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status" v-uni:[scope.row.repoShiftId]="'yishengbancikuguanli_tingyong'" :key="'yishengbancikuguanli_tingyong' + scope.row.repoShiftId" type="text" @click="closeStatus(scope.row)"
                               style="color: #f56c6c">停用
                    </el-button>
                    <el-button v-else type="text"  v-uni:[scope.row.repoShiftId]="'yishengbancikuguanli_qiyong'" :key="'yishengbancikuguanli_qiyong' + scope.row.repoShiftId" @click="openStatus(scope.row)">启用</el-button>
                    <el-button type="text"
                     v-uni:[scope.row.repoShiftId]="'yishengbancikuguanli_edit'" :key="'yishengbancikuguanli_edit' + scope.row.repoShiftId"
                               @click="$emit('option-changed', 'add', { businessType: formSearchData.businessType }, scope.row)">
                        编辑
                    </el-button>
                    <el-button v-uni:[scope.row.repoShiftId]="'yishengbancikuguanli_delete'" :key="'yishengbancikuguanli_delete' + scope.row.repoShiftId" type="text" @click="del(scope.row)" style="color: #f56c6c">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--end-->
        <!--分页-->
        <div class="paginationDiv">
            <!--组件页码显示-->
            <page-info :pageInfo="pageInfo"/>
        </div>
        <!--end-->
    </div>
</template>

<script>
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import WorkTime from '../../../components/hsms/WorkTime'
import PageInfo from '../../../components/hsms/PageInfoCommon'
import { ResultMsg } from '../../../assets/hsms/js/Message'
import { AxiosApi, GetUnit } from '../../../api/hsms'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseDuty',
  components: {
    'work-time': WorkTime,
    PageInfo
  },
  props: ['params'],
  mixins: [BaseManage, config],
  data () {
    return {
      dutyObj: {},
      deptObj: {},
      subAssemblyShow: true,
      modelName: '班次',
      formSearchData: {
        shiftName: '',
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/repository'
    }
  },
  created () {
    this.formSearchData.businessType = this.params.businessType
    this.getDutyType()
    this.getDept()
  },
  methods: {
    formateSpanList (val) {
      if (val === null || val === undefined || val === '') {
        return ''
      }
      if (typeof (val) === 'string') {
        val = JSON.parse(val)
      }
      let str = ''
      for (let i = 0; i < val.length; i++) {
        let item = val[i]
        str += item.beginTime + '-' + item.endTime + '，'
      }
      if (this.subAssemblyShow) {
        return str.substr(0, str.length - 1)
      } else {
        return ''
      }
    },
    // 格式数据
    formatType (item) {
      return this.dutyObj[item.shiftType] || ''
    },
    // 格式化病区
    formatDept (d) {
      return this.deptObj[d.deptId] || ''
    },
    // 格式数据
    getDutyType () {
      AxiosApi(
        '/hsms/web-hs/repository/' + this.formSearchData.businessType + '/type',
        {},
        'GET',
        { businessType: this.formSearchData.businessType }
      ).then(res => {
        let data = res.data
        data.forEach((item, index) => {
          for (let p in item) {
            this.dutyObj[p] = item[p]
          }
        })
      })
    },
    // 获取部门
    getDept () {
      GetUnit().then(res => {
        res.forEach((item, index) => {
          this.deptObj[item.deptId] = item.deptName
        })
        this.onSearchSubmit()
      })
    },
    // 启用
    openStatus (item) {
      AxiosApi('/hsms/web-hs/repository/' + this.formSearchData.businessType + '/enable', { repoShiftId: item.repoShiftId }, 'PUT').then(res => {
        ResultMsg(res, '启用', this.reload)
      })
    },
    // 停用
    closeStatus (item) {
      AxiosApi('/hsms/web-hs/repository/' + this.formSearchData.businessType + '/enable', { repoShiftId: item.repoShiftId }, 'PUT').then(res => {
        ResultMsg(res, '停用', this.reload)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "../../../assets/hsms/css/self_common";

    .duty-color {
        width: 16px;
        height: 16px;
        border: 1px solid #F2F6FC;
        background: #ffffff;
        margin-left: auto;
        margin-right: auto;
        border-radius: 2px;
    }

    .el-button--small {
        padding: 6px 16px !important;
        border-radius: 2px !important;
    }
</style>
