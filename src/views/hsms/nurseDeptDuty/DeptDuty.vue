<template>
    <layout>
        <!-- 搜索条件 -->
        <div slot="query" class="query-items">
            <!--查询-->
            <el-form  :inline="true" :model="searchForm" ref="searchForm">
                <el-form-item label="班次类型：" prop="shiftType">
                    <el-select  v-model="searchForm.shiftType" filterable clearable placeholder="请选择">
                        <el-option v-for="(name, id) in shiftTypes" :key="id" :label="name" :value="id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班次名称：" prop="shiftName">
                    <el-input v-model="searchForm.shiftName" size="small" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button v-uni="'banciguanli_search'" type="primary" icon="el-icon-search" @click="searchSubmit" size="small">搜索
                    </el-button>
                    <el-button v-uni="'banciguanli_reset'" type="text" @click="searchReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 操作按钮 -->
        <div slot="left_btn" class="tool-bar">
            <el-button v-uni="'banciguanli_add'" type="warning" @click="onModify({}, 'add')" icon="el-icon-plus">添加
            </el-button>
            <el-button v-uni="'banciguanli_zuhebanguanli'" @click="combinedShiftVisible = true" type="primary">
                组合班管理
            </el-button>
        </div>
        <div slot="right_btn" class="tool-bar">
            <!-- <div style="display: inline-block; margin-right: 20px">
        当前模式：{{dutyModel[modelType]}}
      </div> -->
            <el-button type="primary" v-uni="'banciguanli_setting'" size="small" @click="onSetting">设置
            </el-button>
            <el-button type="primary" v-uni="'banciguanli_import'" size="small" @click="dutyImportVisible = true">科室班次导入
            </el-button>
            <el-button type="primary" v-uni="'banciguanli_columnSetting'" @click="tableHeaderVisible = true">
                列设置
            </el-button>
        </div>
        <!-- 表格 -->
        <div slot="main" class="main-list">
            <el-table  :data="tableData" stripe v-loading="loading" height="100%">
                <!-- <el-table-column type="index" align="center" label="序号" width="90">
                    <template scope="scope">
                        <span>{{(pageInfo.page - 1) * pageInfo.size + (scope.$index + 1)}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column v-if="tableHeaderFields.includes('shiftType')" prop="shiftType" align="center" :formatter="formatType" label="班次类型">
                </el-table-column>
                <el-table-column class-name="shiftName" prop="shiftName" align="center" label="班次名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :style="{background: scope.row.backgroundColor, color: scope.row.foregroundColor}">
                            <span>{{scope.row.shiftName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="tableHeaderFields.includes('arrivalTime')" prop="arrivalTime" align="center" label="到岗时间">
                </el-table-column>
                <el-table-column v-if="tableHeaderFields.includes('spanList')" prop="spanList" align="center" label="起止时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{formatSpanList(scope.row.spanList)}}
                    </template>
                </el-table-column>
                <el-table-column v-if="tableHeaderFields.includes('workHours')" prop="workHours" align="center" label="工时">
                </el-table-column>
                <el-table-column v-if="tableHeaderFields.includes('shiftImg')" prop="shiftImg" align="center" label="图标设置">
                    <template slot-scope="scope">
                        <i v-if="scope.row.shiftImg" class="iconfont-hsms" :class="iconContrast[scope.row.shiftImg].id" />
                    </template>
                </el-table-column>
                <el-table-column v-if="tableHeaderFields.includes('isExtra')" prop="isExtra" align="center" label="加扣班设置" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{formatSetting(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column v-if="tableHeaderFields.includes('shiftDescribe')" prop="shiftDescribe" align="center" label="班次说明" show-overflow-tooltip>
                </el-table-column>
                <el-table-column v-if="tableHeaderFields.includes('bedList')" align="center" :formatter="formatBed" prop="bedList" label="分管床位" show-overflow-tooltip>
                </el-table-column>
                <el-table-column v-if="tableHeaderFields.includes('roomList')" align="center" :formatter="formatRoom" prop="roomList" label="分管房间" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="status" align="center" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-uni:[scope.row.shiftId]="'bcgl_switch_status'" :key="'bcgl_switch_status' + scope.row.shiftId" @change="onChangeDutyStatus(scope.row)" v-model="scope.row.status">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="240">
                    <template slot-scope="scope">
                        <el-button :key="'banciguanli_copy' + scope.row.shiftId" v-uni:[scope.row.shiftId]="'banciguanli_copy'" type="text" @click="onCloneRow(scope.row, 'clone')">
                            复制
                        </el-button>
                        <el-button v-uni:[scope.row.shiftId]="'banciguanli_edit'" :key="'banciguanli_edit' + scope.row.shiftId" type="text" @click="onModify(scope.row, 'edit')">
                            编辑
                        </el-button>
                        <el-button type="textred" v-uni:[scope.row.shiftId]="'banciguanli_delete'" :key="'banciguanli_delete' + scope.row.shiftId" @click="onDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div slot="footer" class="page-bar">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageInfo.page" :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
            </el-pagination>
        </div>

        <!-- 模式设置 -->
        <el-dialog title="设置" :visible.sync="settingFormVisible" width="490px" :show-close="false" :close-on-click-modal="false">
            <el-form :model="settingForm" :rules="settingFormRules" ref="settingForm" label-width="130px">
                <el-form-item label="每天默认工时：" prop="hourStandard">
                    <el-input style="width: 260px" v-model="settingForm.hourStandard" autocomplete="off" type="number" oninput="if(value.length>5)value=value.slice(0, 5)" minlength="0" placeholder="请输入" maxlength="24" />
                    &nbsp;&nbsp;小时
                </el-form-item>
                <el-form-item label="每周合理班时数：" prop="weekStandard">
                    <el-input style="width: 260px" v-model="settingForm.weekStandard" autocomplete="off" type="number" oninput="if(value.length>6)value=value.slice(0, 6)" minlength="0" placeholder="请输入" maxlength="168" />
                    &nbsp;&nbsp;小时
                </el-form-item>
                <el-form-item label="每周休息天数：" prop="restCount">
                    <el-input style="width: 260px" v-model="settingForm.restCount" autocomplete="off" type="number" oninput="if(value.length>6)value=value.slice(0, 6)" minlength="0" placeholder="请输入" maxlength="168" />
                    &nbsp;&nbsp;天
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-uni="'banciguanli_setting_cancel'" @click="onSettingClose">
                    取消
                </el-button>
                <el-button v-uni="'banciguanli_setting_save'" type="primary" @click="onSettingSubmit">
                    确认
                </el-button>
            </div>
        </el-dialog>
        <!-- 列设置 -->
        <el-dialog title="列设置" :visible="tableHeaderVisible" :close-on-click-modal="false" :show-close="false" width="580px">
            <div class="list-header">
                <div style="color: #333; font-size: 14px">在表单中显示列：</div>
                <el-checkbox-group v-model="tableHeaderFields">
                    <el-checkbox v-for="item in tableHeaders" :label="item.field" :key="item.field" style="width: 25%; margin: 5px 0">
                        {{item.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button v-uni="'banciguanli_columnSetting_cancel'" @click="tableHeaderVisible = false">取消</el-button>
                <el-button v-uni="'banciguanli_columnSetting_save'" type="primary" @click="onTableColumnSetting">确认</el-button>
            </div>
        </el-dialog>
        <!--科室导入-->
        <el-dialog title="科室班次导入" :visible.sync="dutyImportVisible" width="780px" :close-on-click-modal="false" :show-close="false">
            <el-form ref="setDutyForm" label-width="80px" style="">
                <el-form-item label-width="0" style="padding: 0 0 0 85px;">
                    <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入" v-model="selectedDuty" :titles="['可选班次', '已选班次']" :props="{key: 'repoShiftId', label: 'repoShiftName'}" :data="dutyData">
                    </el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-uni="'banciguanli_import_cancel'" @click="dutyImportVisible = false">
                    取消
                </el-button>
                <el-button v-uni="'banciguanli_import_save'" :loading="buttonLoading" type="primary" @click="onImportDeptDuty">
                    确认
                </el-button>
            </div>
        </el-dialog>
        <!-- 组合班次 -->
        <combined-shift :visible.sync="combinedShiftVisible" :shiftTypes="shiftTypes"></combined-shift>
    </layout>
</template>

<script>
import layout from '../../../components/hsms/layout/list'
import CombinedShift from './CombinedShift'
import { ApiNurseDuty, ApiNurseShift } from '../../../api/hsms/api'
import listMixin from '../nurseDuty/listMixin'
import { GetRoom, GetBed } from '../../../api/hsms'
import iconContrast from '../nurseDuty/iconContrast'

export default {
  name: 'NurseDeptDuty',
  components: {
    layout,
    CombinedShift
  },
  props: ['params'],
  mixins: [listMixin],
  data () {
    const filterMethod = (query, item) => {
      return item.repoShiftName.indexOf(query) > -1
    }
    return {
      rowKey: 'shiftId', // 唯一值
      iconContrast,
      tableHeaderVisible: false,
      tableHeaders: [
        {
          name: '班次类型',
          field: 'shiftType'
        },
        {
          name: '到岗时间',
          field: 'arrivalTime'
        },
        {
          name: '起止时间',
          field: 'spanList'
        },
        {
          name: '工时',
          field: 'workHours'
        },
        {
          name: '图标设置',
          field: 'shiftImg'
        },
        {
          name: '加扣班设置',
          field: 'isExtra'
        },
        {
          name: '班次说明',
          field: 'shiftDescribe'
        },
        {
          name: '分管床位',
          field: 'bedList'
        },
        {
          name: '分管房间',
          field: 'roomList'
        }
      ],
      tableHeaderFields: [],
      // dutyModel: {
      //   'BED': '管床模式',
      //   'ROOM': '管房模式'
      // },
      modelType: '', // 班次模式
      dutyData: [], // 班次库
      shiftTypes: {}, // 班次类型
      beds: {}, // 床位
      rooms: {}, // 房间
      // 查询
      searchForm: {
        shiftName: '',
        shiftType: '',
        businessType: 'NURSE'
      },
      // 设置
      settingFormVisible: false,
      settingForm: {
        // nurseMode: 'BED',
        hourStandard: 0,
        weekStandard: 0,
        restCount: 0
      },
      settingFormCache: {},
      settingFormRules: {
        hourStandard: [
          {
            validator: (rule, value, callback) => {
              if (
                value === '' ||
                                value === null ||
                                value === undefined
              ) {
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
              if (
                value === '' ||
                                value === null ||
                                value === undefined
              ) {
                callback(new Error('0<周合理班时数<=168'))
              } else if (value <= 0 || value > 168) {
                callback(new Error('0<周合理班时数<=168'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        restCount: [
          {
            validator: (rule, value, callback) => {
              if (
                value === '' ||
                                value === null ||
                                value === undefined
              ) {
                callback(new Error('0<周休息天数<=7'))
              } else if (value <= 0 || value > 7) {
                callback(new Error('0<周休息天数<=7'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      // 科室转换导入
      dutyImportVisible: false,
      selectedDuty: [],
      filterMethod: filterMethod,
      // 按钮加载状态
      buttonLoading: false,
      // 组合班
      combinedShiftVisible: false
    }
  },
  created () {
    // 列设置
    this.tableHeaderFields = []
    if (localStorage.getItem('deptDutyFieldSetting')) {
      this.tableHeaderFields = JSON.parse(
        localStorage.getItem('deptDutyFieldSetting')
      )
    } else {
      this.tableHeaders.forEach((item) => {
        this.tableHeaderFields.push(item.field)
      })
      localStorage.setItem(
        'deptDutyFieldSetting',
        JSON.stringify(this.tableHeaderFields)
      )
    }
    this.initData()
    Object.assign(this.searchForm, this.pageInfo)
  },
  methods: {
    initData () {
      Promise.all([
        this.getBed(),
        this.getRoom(),
        this.getShiftType(),
        this.getModelType(),
        this.getDuty()
      ]).then(() => {
        this.loadData()
      })
    },
    onSetting () {
      this.settingFormVisible = true
      this.settingFormCache = JSON.parse(JSON.stringify(this.settingForm))
    },
    loadData () {
      this.loading = true
      ApiNurseShift.select(this.searchForm)
        .then((res) => {
          console.log(22222)
          this.tableData =
                        res.data && res.data.list ? res.data.list : []
          this.pageInfo.total =
                        res.data && res.data.total ? res.data.total : 0
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取模式
    getModelType () {
      return ApiNurseShift.model().then((res) => {
        if (res.data) {
          this.modelType = res.data.nurseMode || 'BED'
          this.settingForm = res.data
        }
      })
    },
    // 获取班次库
    getDuty () {
      return ApiNurseDuty.select({ enable: 1 }).then((res) => {
        this.dutyData = res.data || []
      })
    },
    // 列设置
    onTableColumnSetting () {
      localStorage.setItem(
        'deptDutyFieldSetting',
        JSON.stringify(this.tableHeaderFields)
      )
      this.tableHeaderVisible = false
    },
    // 设置-关
    onSettingClose () {
      this.settingFormVisible = false
      this.settingForm = JSON.parse(JSON.stringify(this.settingFormCache))
      this.$refs.settingForm.clearValidate()
    },
    // 设置-确认
    onSettingSubmit () {
      this.$refs['settingForm'].validate((valid) => {
        if (valid) {
          ApiNurseShift.saveModel(this.settingForm)
            .then(() => {
              this.$message.success('设置成功！')
              this.settingFormVisible = false
              this.initData()
            })
            .catch((res) => {
              this.$message.error(res.message || '设置失败！')
            })
        }
      })
    },
    // 科室班次导入
    onImportDeptDuty () {
      let dutyData = []
      if (this.selectedDuty.length === 0) {
        this.$message.warning('请选择要导入的班次！')
        return
      }
      let selData = this.selectedDuty.join(',')
      this.dutyData.forEach((item) => {
        if (selData.indexOf(item.repoShiftId) > -1) {
          dutyData.push(item)
        }
      })
      this.buttonLoading = true
      ApiNurseShift.importShift({ data: dutyData })
        .then(() => {
          this.$message.success('导入成功！')
          this.loadData()
          this.buttonLoading = false
          this.dutyImportVisible = false
        })
        .catch((res) => {
          this.$message.error(res.message || '导入失败！')
          this.buttonLoading = false
        })
    },
    onCloneRow (row, type) {
      let _row = JSON.parse(JSON.stringify(row))
      _row.shiftId = 'clone'
      _row.shiftName = _row.shiftName + '-副本'
      _row.modelType = this.modelType
      this.$emit('changed', 'add', _row, type)
    },
    onModify (row, type) {
      row.modelType = this.modelType
      this.$emit('changed', 'add', row, type)
    },
    onDelete (row) {
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiNurseShift.delete({ shiftId: row.shiftId })
          .then(() => {
            this.$message.success('删除成功！')
            this.loadData()
          })
          .catch((res) => {
            this.$message.error(res.message || '删除失败！')
          })
      })
    },
    // 获取班次类型
    getShiftType () {
      return ApiNurseShift.types({ businessType: 'NURSE' }).then((res) => {
        console.log(1111)
        let data = res.data
        data.forEach((item) => {
          for (let p in item) {
            this.shiftTypes[p] = item[p]
          }
        })
      })
    },
    // 状态 启用|停用
    onChangeDutyStatus (row) {
      let s = row.status
      ApiNurseShift.status({ shiftId: row.shiftId })
        .then(() => {
          this.$message.success('操作成功！')
        })
        .catch((res) => {
          row.status = !s
          this.$message.error(res.message || '操作失败！')
        })
    },
    // 获取床位
    getBed () {
      return GetBed().then((res) => {
        this.beds = res || []
      })
    },
    // 获取房间
    getRoom () {
      return GetRoom().then((res) => {
        this.rooms = res || []
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
    formatSpanList (val) {
      if (val === null || val === undefined || val === '') {
        return ''
      }
      if (typeof val === 'string') {
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
    },
    // 格式化床位
    formatBed (row) {
      let data = row.bedRelationList
      let _objList = []
      let str = ''
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.beds.length; j++) {
            if (data[i].objId === this.beds[j].bedId) {
              _objList.push(this.beds[j])
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
    // 格式化房间
    formatRoom (row) {
      let data = row.roomRelationList
      let _objList = []
      let str = ''
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.rooms.length; j++) {
            if (data[i].objId === this.rooms[j].roomId) {
              _objList.push(this.rooms[j])
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
        str = str.substring(0, str.length - 1)
      }
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/hsms/css/self_common";
@import "../../../../public/static/hsms/icons/iconfont.css";

/deep/ .shiftName {
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
