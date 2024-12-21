<template>

  <listLayout v-loading="loading">
    <div slot="query"
         class="query-items">
      <el-form class="demo-form-inline"
               :inline="true"
               :model="searchObj"
               ref="formSearch">
        <el-form-item label="巡视时间："
                      prop="startTime">
          <el-col :span="11">
            <el-date-picker v-model="searchObj.startTime"
                            type="datetime"
                            :clearable="false"
                            :editable="false"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            v-uni="'yihuxunshi_startTime'"
                            placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <span class="to">至</span>
        <el-form-item prop="endTime">
          <el-col :span="11">
            <el-date-picker v-model="searchObj.endTime"
                            type="datetime"
                            :clearable="false"
                            :editable="false"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            v-uni="'yihuxunshi_endTime'"
                            placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-form-item>

        <!--
                <el-form-item label="巡视时间:" prop="patrolType">
                  <el-date-picker
                          v-model="searchTime"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          :clearable="false"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          format="yyyy-MM-dd HH:mm"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          align="right"
                          :default-time="['00:00:00', '23:59:59']">
                  </el-date-picker>
                </el-form-item>
        -->

        <el-form-item label="巡视类型:">
          <el-select v-model="searchObj.patrolType"
                     placeholder="请选择" clearable
                     v-uni="'yihuxunshi_xunshileixing'"
                     style="width:140px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="护理巡视" value="护理巡视"></el-option>
            <el-option label="医生巡视" value="医生巡视"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary"
                       class="el-button-radius"
                       icon="el-icon-search"
                       v-uni="'yihuxunshi_search'"
                       @click="getData" size="small">搜索
            </el-button>
            <el-button type="text"
                       v-uni="'yihuxunshi_reset'"
                       @click="resetSearchObj('resetAndGetData')">重置
            </el-button>
            <el-button type="success"
                       v-show="false"
                       class="el-button-radius"
                       style="margin-left: 20px;"
                       v-uni="'yihuxunshi_export'"
                       @click="exportShow" size="small">导出
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="main" class="main-list table">
      <!-- 表格 -->
      <el-table :data="pList"
                stripe
                :height="tHeight"
                ref="table">
        <!--el-table-column align="center"
                         width="50"></el-table-column-->
        <!-- <el-table-column type="index"
                         align="center"
                         label="序号"
                         width="60"></el-table-column> -->
        <el-table-column prop="patrolTime"
                         label="巡视时间"
                         min-width="80"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.patrolTime ? scope.row.patrolTime.split(" ")[0] : ''}}<br/>
            {{scope.row.patrolTime ? formatTime(scope.row.patrolTime) : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="patrolType"
                         label="巡视类型"
                         min-width="60"
                         align="center"></el-table-column>
        <el-table-column prop="roomName"
                         label="房间号"
                         min-width="40"
                         align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="bedName"
                         label="床位号"
                         min-width="40"
                         align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="patrolUser"
                         label="巡视人"
                         min-width="60"
                         align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="patrolContent"
                         label="巡视内容"
                         min-width="180"
                         :show-overflow-tooltip="true"
                         align="left">
        </el-table-column>

        <el-table-column fixed="right"
                         label="操作"
                         width="150"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)"
                       v-uni:[scope.$index]="'yihuxunshi_edit'"
                       type="text" size="small">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <!--组件页码显示-->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="page_current"
                     :page-sizes="[ 10, 30, 50, 100]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper"
                     v-uni="'yihuxunshi_pagination'"
                     :total="page_total">
      </el-pagination>
    </div>
    <!-- 导出 -->
    <el-dialog title="导出"
               :visible.sync="partrolExport.visible"
               width="640px"
               @close="exportCancel"
               :show-close="false"
               :close-on-click-modal="false">
      <div class="partrolExport-main">
        <el-checkbox v-model="partrolExport.checkAll"
                     v-uni="'yihuxunshi_export_selectAll'"
                     @change="handleCheckAllChange">全选
        </el-checkbox>
        <div style="height: 5px;"></div>
        <el-checkbox-group v-model="partrolExport.value"
                           v-uni="'yihuxunshi_export_select'"
                           @change="handleCheckedChange">
          <el-checkbox v-for="item in partrolExport.setting"
                       :key="item.value"
                       :label="item.value">{{item.label}}
          </el-checkbox>
          <!--:disabled="item.disabled"-->
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportCancel" v-uni="'yihuxunshi_export_cancel'">取消</el-button>
        <el-button type="primary" @click="exportDo" v-uni="'yihuxunshi_export_confirm'">确认</el-button>
      </div>
    </el-dialog>

  </listLayout>
</template>

<script>
import { ApiPatrol } from '../../../api/nrms'
import listLayout from '../../../components/nrms/layout/list'
import moment from 'moment'

export default {
  name: 'partrol_list',
  data () {
    return {
      tHeight: '700',
      loading: false,
      page_current: 1,
      page_total: 0,
      // 修改、添加相关
      showDialog: false,
      searchObj: {
        startTime: moment().subtract(0, 'days').format('YYYY-MM-DD 00:00'),
        endTime: moment().subtract(0, 'days').format('YYYY-MM-DD 23:59'),
        patrolType: '',
        size: '10',
        page: '1'
      },
      pList: [],
      // searchTime: [],
      search_patrolType: '',
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      partrolExport: {
        visible: false,
        setting: [
          {
            label: '巡视时间',
            value: 0,
            disabled: false
          },
          {
            label: '巡视类型',
            value: 1,
            disabled: false
          },
          {
            label: '房间号',
            value: 2,
            disabled: false
          },
          {
            label: '床位号',
            value: 3,
            disabled: false
          },
          {
            label: '巡视人',
            value: 4,
            disabled: false
          },
          {
            label: '巡视内容',
            value: 5,
            disabled: false
          }
        ],
        value: [0, 1, 2, 3, 4, 5],
        checkAll: true
      }
    }
  },
  created () {
    this.setTableHeight()
  },
  mounted () {
    this.resetSearchObj()
  },
  updated () {
    this.tableDoLayout()
  },
  activated () {
    this.getData()
    this.tableDoLayout()
  },
  methods: {
    tableDoLayout () {
      let that = this
      this.$nextTick(function () {
        that.$refs.table.doLayout()
      })
    },
    setTableHeight () {
      this.tHeight = (window.innerHeight - 253)
    },
    resetSearchObj (op = null) {
      this.$refs.formSearch.resetFields()
      this.searchObj.patrolType = ''
      this.handleCurrentChange(1)
      /*
              let endDT = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
              let begDT =  new Date(new Date(new Date().toLocaleDateString()).getTime()-3600 * 1000 * 24 *6);
            /!*
              this.$set(this.searchTime,0,begDT);
              this.$set(this.searchTime,1,endDT);
            *!/

              this.searchObj.startTime=this.formatDate(begDT,'yyyy-MM-dd hh:mm:ss');
              this.searchObj.endTime=this.formatDate(endDT,'yyyy-MM-dd hh:mm:ss');
              //console.log(this.searchObj.startTime)

              this.searchObj.patrolType='';
              if(op == 'resetAndGetData') this.handleCurrentChange(1); */
    },
    getData () {
      this.loading = true
      /*
              this.searchObj.startTime=this.formatDate(new Date(this.startTime),'yyyy-MM-dd hh:mm:ss');
              this.searchObj.endTime=this.formatDate(new Date(this.endTime),'yyyy-MM-dd hh:mm:ss');
            */
      ApiPatrol.getRecord(this.searchObj, 'patrolRecord').then((res) => {
        this.pList = res.data.list
        this.page_total = res.data.total
        this.loading = false
      })
    },
    edit (row) {
      this.$emit('changed', 'add', row)
    },
    delRecord (row) {
      this.$confirm('是否确认删除？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        ApiPatrol.delRecord({ recordId: row.recordId }, 'patrolRecord')
          .then(() => {
            this.$message.success('删除成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    handleSizeChange (val) {
      this.searchObj.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.searchObj.page = val
      this.getData()
    },
    formatDate (date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
        }
      }
      return fmt
    },
    exportShow () {
      this.partrolExport.visible = true
      this.exportClear()
    },
    exportDo () {
      if (this.partrolExport.value.length === 0) {
        this.$message.error('请至少选择一项')
        return false
      }
      this.partrolExport.visible = false
      // let that = this
      let host = window.location.host
      let startTime = this.searchObj.startTime
      let endTime = this.searchObj.endTime
      let patrolType = this.searchObj.patrolType
      let exportTitle = this.partrolExport.value.join(',')
      let url = 'http://' + host + '/nrms/web-nr/patrol-record/export' +
          '?startTime=' + startTime +
          '&endTime=' + endTime +
          '&patrolType=' + patrolType +
          '&exportTitle=' + exportTitle
      window.open(url)
      // setTimeout(function () {
      //   that.exportClear()
      // }, 10)
    },
    exportCancel () {
      this.partrolExport.visible = false
      this.exportClear()
    },
    exportClear () {
      this.partrolExport.checkAll = true
      this.partrolExport.value = [0, 1, 2, 3, 4, 5]
    },
    handleCheckedChange (val) {

    },
    handleCheckAllChange (val) {
      this.partrolExport.value = []
      if (val === true) { // 全选
        for (let i = 0; i < this.partrolExport.setting.length; i++) {
          this.partrolExport.value.push(this.partrolExport.setting[i].value)
        }
      } else { // 不全选
        this.partrolExport.value = []
      }
    },
    formatTime (value) {
      return moment(value).format('HH:mm')
    }
  },
  components: {
    listLayout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
  .query-items{
    .to{
      display: inline-block;
      line-height: 32px;
      margin: 12px 0;
    }
  }
  /* 覆盖element css */

  /*
    .typt-list-container {
      height: 100%;
      display: flex;
      justify-content: flex-start;

      .main {
        flex: 1;
        overflow: auto;
        padding: 0;
      }
    }
    .typt-list-container .el-form-item{height:auto;padding-bottom:10px;}
    .typt-list-container .paginationDiv{text-align:center;}
  */

  .partrolExport-main {
    height: 60px;
  }
</style>
