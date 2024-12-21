<template>
  <!--护士排班-班次管理-->
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form  :inline="true"
               :model="formSearchData"
               class="demo-form-inline"
               ref="formSearch">
        <el-form-item label="班次名称：">
          <el-input size="small"
                    style="width: 182px;height: 34px;"
                    v-model="formSearchData.shiftName"
                    placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button v-uni="'ysbanciguanli_search'" type="primary" class="el-button-radius"
                       style="width: 80px;height: 28px;"
                       icon="el-icon-search" @click="onSearchSubmit"
                       size="small">搜索
            </el-button>
            <el-button v-uni="'ysbanciguanli_reset'" type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr/>
      <div class="typt-list-add-div">
        <el-button type="warning"
                   size="small"
                   @click="add"
                   v-uni="'ysbanciguanli_add'"
                   icon="el-icon-plus">添加
        </el-button>
        <div class="action_div">
          <el-button v-if="formSearchData.businessType=='NURSE'"
                     type="primary"
                     size="small"
                     style="width: 80px;"
                     v-uni="'ysbanciguanli_setting'"
                     @click="showSet()">设置
          </el-button>
          <el-button type="primary"
                     style="width: 110px;padding: 6px 0 6px 2px !important;"
                     size="small"
                     v-uni="'ysbanciguanli_import'"
                     @click="showDutySet()">科室班次导入
          </el-button>
          <div class="model_cls"
               v-if="formSearchData.businessType=='NURSE'">当前模式：<span>{{modelObj[modelType]}}</span>
          </div>
        </div>
      </div>
      <!--列表-->
      <el-table :data="tableData"
                :stripe="CONFIG.table.stripe"
                v-loading="loading"
                height="80%">
        <el-table-column prop="shiftName"
                         align="center"
                         label="班次名称"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="backgroundColor"
                         align="center"
                         label="班次颜色">
          <template slot-scope="scope">
            <div class="duty-color"
                 :style="{background:scope.row.backgroundColor}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="spanList"
                         align="center"
                         label="工作时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <!--work-time :srcData="scope.row.spanList" v-if="subAssemblyShow"/>-->
            {{formateSpanList(scope.row.spanList)}}
          </template>
        </el-table-column>
        <el-table-column prop="arrivalTime"
                         align="center"
                         label="到岗时间">
        </el-table-column>
        <el-table-column prop="shiftType"
                         align="center"
                         :formatter="formatType"
                         label="班次类型">
        </el-table-column>
        <el-table-column align="center"
                         prop="shiftDescribe"
                         label="班次说明" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         v-if="formSearchData.businessType=='NURSE'"
                         :formatter="formatBed"
                         prop="bedList"
                         label="分管床位"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         v-if="formSearchData.businessType=='NURSE'"
                         :formatter="formatRoom"
                         prop="roomList"
                         label="分管房间">
        </el-table-column>
        <el-table-column align="center"
                         :formatter="formatDept"
                         prop="deptId"
                         label="所属病区">
        </el-table-column>
        <el-table-column align="center"
                         prop="workHours"
                         label="工时">
        </el-table-column>
        <el-table-column align="center"
                         label="操作"
                         width="240">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status"
                       type="text"
                       @click="closeStatus(scope.row)"
                       v-uni:[scope.row.shiftId]="'ysbanciguanli_tingyong'"
                       :key="'ysbanciguanli_tingyong' + scope.row.shiftId"
                       style="color: #f56c6c">停用
            </el-button>
            <el-button v-else type="text"
                       v-uni:[scope.row.shiftId]="'ysbanciguanli_qiyong'"
                       :key="'ysbanciguanli_qiyong' + scope.row.shiftId"
                       @click="openStatus(scope.row)">启用
            </el-button>
            <el-button type="text"
                       v-uni:[scope.row.shiftId]="'ysbanciguanli_edit'"
                       :key="'ysbanciguanli_edit' + scope.row.shiftId"

                       @click="$emit('option-changed', 'add', { businessType: formSearchData.businessType, modelType: modelType }, scope.row)">
              编辑
            </el-button>
            <el-button type="text"
                       @click="del(scope.row)"
                      v-uni:[scope.row.shiftId]="'ysbanciguanli_delete'"
                       :key="'ysbanciguanli_delete' + scope.row.shiftId"
                       style="color: #f56c6c">删除
            </el-button>
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
    <!--设置-->
    <el-dialog title="设置"
               :visible.sync="setFormVisible"
               width="490px"
               :show-close="false"
               :close-on-click-modal="false">
      <el-form :model="setFormData"
               :rules="setFormDataRules"
               ref="setForm"
               label-width="110px"
               class="hsms-add-dialog">
        <el-form-item label="选择模式："
                      prop="nurseMode">
          <el-select v-model="setFormData.nurseMode"
                     placeholder="请选择模式" style="width: 300px;">
            <el-option label="管床模式" value="BED"/>
            <el-option label="管房模式" value="ROOM"/>
          </el-select>
        </el-form-item>
        <el-form-item label="天默认工时："
                      prop="hourStandard">
          <!--el-input-number v-model="setFormData.hourStandard" autocomplete="off" :min="0" :max="24"></el-input-number-->
          <el-input style="width: 300px;"
                    v-model="setFormData.hourStandard"
                    autocomplete="off"
                    type="number"
                    oninput="if(value.length>5)value=value.slice(0, 5)"
                    minlength="0"
                    placeholder="请输入"
                    maxlength="24"/>
        </el-form-item>
        <el-form-item label="周默认工时："
                      prop="weekStandard">
          <!--el-input-number v-model="setFormData.weekStandard" autocomplete="off" :min="0" :max="168"></el-input-number-->
          <el-input style="width: 300px;"
                    v-model="setFormData.weekStandard"
                    autocomplete="off"
                    type="number"
                    oninput="if(value.length>6)value=value.slice(0, 6)"
                    minlength="0"
                    placeholder="请输入"
                    maxlength="168"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'ysbancikuguanli_setting_cancel'" @click="cancelSetAdd"
                   style="width: 70px;height: 40px;border-radius: 2px !important;">取消
        </el-button>
        <el-button type="primary"
                   @click="saveSetData" :loading="addVis"
                   v-uni="'ysbancikuguanli_setting_save'"
                   style="width: 70px;height: 40px;border-radius: 2px !important;">确认
        </el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!--科室导入-->
    <el-dialog title="科室班次导入"
               :visible.sync="dutyFormVisible"
               width="780px"
               :close-on-click-modal="false"
               :show-close="false"
                v-uni="'ysbancikuguanli_import_close'"
               @close="cancelDutySetAdd">
      <el-form ref="setDutyForm" label-width="80px" style="">
        <el-form-item label-width="0" style="padding: 0 0 0 85px;">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入"
            v-model="transSelected"
            :titles="['可选班次', '已选班次']"
            :props="{key: 'repoShiftId',label: 'repoShiftName'}"
            :data="transData">
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDutySetAdd"
         v-uni="'ysbancikuguanli_import_cancel'"
                   style="width: 70px;height: 40px;border-radius: 2px !important;">取消
        </el-button>
        <el-button type="primary" @click="saveDutySetData"
                   :loading="addVis"
        v-uni="'ysbancikuguanli_import_save'"
                   style="width: 70px;height: 40px;border-radius: 2px !important;">确认
        </el-button>
      </div>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import WorkTime from '../../../components/hsms/WorkTime'
import PageInfo from '../../../components/hsms/PageInfoCommon'
import { ResultMsg } from '../../../assets/hsms/js/Message'
import { AxiosApi, AxiosJsonApi, GetPubDuty, GetModelType, GetRoom, GetBed, GetUnit } from '../../../api/hsms'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseDeptDuty',
  components: {
    'work-time': WorkTime,
    PageInfo
  },
  mixins: [BaseManage, config],
  props: ['params'],
  data () {
    return {
      dutyObj: {},
      setFormData: {
        nurseMode: 'BED',
        hourStandard: '',
        weekStandard: ''
      },
      setFormDataRules: {
        hourStandard: [
          {
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('0<天默认工时<=24'))
              } else if (value <= 0 || value > 24) {
                callback(new Error('0<天默认工时<=24'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        weekStandard: [
          {
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('0<周默认工时<=168'))
              } else if (value <= 0 || value > 168) {
                callback(new Error('0<周默认工时<=168'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      getSetData: {
        nurseMode: 'BED',
        hourStandard: '',
        weekStandard: ''
      },
      bedObj: {},
      BedObj: {},
      deptObj: {},
      roomObj: {},
      RoomObj: {},
      transData: [],
      transSelected: [],
      filterMethod (query, item) {
        return item.repoShiftName.indexOf(query) > -1
      },
      modelObj: {
        'BED': '管床模式',
        'ROOM': '管房模式'
      },
      modelType: 'BED',
      setFormVisible: false,
      dutyFormVisible: false,
      subAssemblyShow: true,
      modelName: '班次',
      formSearchData: {
        shiftName: '',
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/shift'
    }
  },
  created () {
    this.formSearchData.businessType = this.params.businessType
    this.getDutyType()
    this.getDept()
    this.getPubDuty()
    this.getModelType()
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
    // 格式化床位
    formatBed (d) {
      let data = d.relationList
      let _objList = []
      let str = ''
      if (data.length > 0) {
        /* data.forEach((item, index) => {
                if (this.bedObj[item.objId]) {
                  str += this.bedObj[item.objId] + ','
                }
              }) */
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.BedObj.length; j++) {
            if (data[i].objId === this.BedObj[j].bedId) {
              _objList.push(this.BedObj[j])
            }
          }
        }
        _objList.sort(function (a, b) {
          if (a.sort === null || b.sort === null) {
            return false
          } else {
            if (a.sort < b.sort) {
              return -1
            } else if (a.sort === b.sort) {
              return 0
            } else {
              return 1
            }
          }
        })
        for (let m = 0; m < _objList.length; m++) {
          str += _objList[m].bedName + ','
        }
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    // 格式化病区
    formatDept (d) {
      return this.deptObj[d.deptId] || ''
    },
    // 格式化房间
    formatRoom (d) {
      let data = d.relationList
      let _objList = []
      let str = ''
      if (data.length > 0) {
        /* data.forEach((item, index) => {
                if (this.roomObj[item.objId]) {
                  str += this.roomObj[item.objId] + ','
                }
              }) */
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.RoomObj.length; j++) {
            if (data[i].objId === this.RoomObj[j].roomId) {
              _objList.push(this.RoomObj[j])
            }
          }
        }
        _objList.sort(function (a, b) {
          if (a.sort === null || b.sort === null) {
            return false
          } else {
            if (a.sort < b.sort) {
              return -1
            } else if (a.sort === b.sort) {
              return 0
            } else {
              return 1
            }
          }
        })
        for (let m = 0; m < _objList.length; m++) {
          str += _objList[m].roomName + ','
        }
      }
      return str
    },
    // 格式数据
    formatType (item) {
      return this.dutyObj[item.shiftType] || ''
    },
    // 科室班次导入
    showDutySet () {
      this.transSelected = []
      this.dutyFormVisible = true
    },
    // 设置
    showSet () {
      this.setFormData = { ...this.getSetData }
      this.setFormVisible = true
    },
    // 设置保存
    saveSetData () {
      let method = 'POST'
      let dpId = this.getSetData.deptId || ''
      if (dpId !== '') {
        method = 'PUT'
      }
      this.$refs['setForm'].validate((valid) => {
        if (valid) {
          this.addVis = true
          AxiosJsonApi(
            '/hsms/web-hs/dept/config/' + this.formSearchData.businessType,
            this.setFormData,
            method
          ).then(res => {
            ResultMsg(res, '设置', this.reloadMain)
            if (res.status !== 200) {
              this.addVis = false
            }
          })
        }
      })
    },
    // 科室班次导入保存
    saveDutySetData () {
      let dutyData = []
      if (this.transSelected.length === 0) {
        this.$message.warning('请选择要导入的班次！')
        return
      }
      let selData = this.transSelected.join(',')
      this.transData.forEach((item, key) => {
        if (selData.indexOf(item.repoShiftId) > -1) {
          dutyData.push(item)
        }
      })
      this.addVis = true
      AxiosJsonApi('/hsms/web-hs/shift/' + this.formSearchData.businessType + '/import', { data: dutyData }).then(res => {
        ResultMsg(res, '科室导入', this.reloadMain)
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
    // 取消
    cancelDutySetAdd () {
      this.addVis = false
      this.dutyFormVisible = false
    },
    // 取消
    cancelSetAdd () {
      this.$refs.setForm.resetFields()
      this.addVis = false
      this.setFormVisible = false
    },
    // 启用
    openStatus (item) {
      AxiosApi('/hsms/web-hs/shift/' + this.formSearchData.businessType + '/enable', { shiftId: item.shiftId }, 'PUT').then(res => {
        ResultMsg(res, '启用', this.reload)
      })
    },
    // 停用
    closeStatus (item) {
      AxiosApi('/hsms/web-hs/shift/' + this.formSearchData.businessType + '/enable', { shiftId: item.shiftId }, 'PUT').then(res => {
        ResultMsg(res, '停用', this.reload)
      })
    },
    // 添加
    add () {
      this.$emit('option-changed', 'add', {
        businessType: this.formSearchData.businessType,
        modelType: this.modelType
      })
    },
    // 获取模式
    getModelType () {
      GetModelType(this.formSearchData.businessType).then(res => {
        if (res) {
          this.modelType = res.nurseMode || 'BED'
          this.getSetData = res
          this.setFormData = res
        }
      })
    },
    // 获取班次库
    getPubDuty () {
      GetPubDuty(this.formSearchData.businessType).then(res => {
        this.transData = res
      })
    },
    // 获取床位
    getBed () {
      GetBed().then(res => {
        res.forEach((item, index) => {
          this.bedObj[item.bedId] = item.bedName
        })
        this.BedObj = res
        this.getRoom()
      })
    },
    // 获取房间
    getRoom () {
      GetRoom().then(res => {
        res.forEach((item, index) => {
          this.roomObj[item.roomId] = item.roomName
        })
        this.RoomObj = res
        this.onSearchSubmit()
      })
    },
    // 获取部门
    getDept () {
      GetUnit().then(res => {
        res.forEach((item, index) => {
          this.deptObj[item.deptId] = item.deptName
        })
        this.getBed()
      })
    },
    // 获取班次类型
    getDutyType () {
      AxiosApi('/hsms/web-hs/shift/' + this.formSearchData.businessType + '/type', {}, 'GET', { businessType: this.formSearchData.businessType }).then(res => {
        let data = res.data
        data.forEach((item, index) => {
          for (let p in item) {
            this.dutyObj[p] = item[p]
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/hsms/css/self_common";

  .typt-list-container .action_div button {
    margin-left: 10px;
  }

  .el-button--small {
    padding: 6px 16px !important;
    border-radius: 2px !important;
  }

  .duty-color {
    width: 16px;
    height: 16px;
    border: 1px solid #F2F6FC;
    background: #ffffff;
    margin-left: auto;
    margin-right: auto;
    border-radius: 2px;
  }

  .action_div {
    text-align: right;
    position: relative;
    float: right;
    padding-right: 20px;

    .model_cls {
      position: absolute;
      right: 240px;
      top: 5px;
      width: 200px;
      font-size: 15px;
      color: #333333;
    }
  }
</style>
