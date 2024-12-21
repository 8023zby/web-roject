<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form v-uni="'hulibiaoqianbiaoshimingchengsousuobiaodan'" :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item prop="identifyName" label="标识名称">
          <el-input
            v-model="search_form.identifyName"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
            v-uni="'hulibiaoqian_xianshibiaoshi_search'"
          >搜索
          </el-button
          >
          <el-button type="text" @click="resetForm()"
            v-uni="'hulibiaoqian_xianshibiaoshi_reset'"
          >重置
          </el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->

    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" icon="el-icon-plus" @click="identifyAdd(null)" v-uni="'hulibiaoqian_xianshibiaoshi_add'">添加</el-button>
    </div>
    <div slot="right_btn" class="tool-bar">
      <el-button type="primary" @click="$emit('changed', 'list1')" v-uni="'hulibiaoqian_xianshibiaoshi_goback'">返回</el-button>
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        ref="table"
        :data="identify_data"
        stripe
        highlight-current-row
        @selection-change="handleTableSelectionChange"
            v-uni="'hulibiaoqianbiaoshimingchengliebiao'"
        height="100%"
      >
        <el-table-column type="selection" align="center" width="70"></el-table-column>
        <!-- <el-table-column type="index" label="序号" width="90" align="center">
          <template scope="scope">
            <span>{{(search_form.page - 1) * search_form.size + (scope.$index + 1)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="identifyName" label="标识名称" min-width="100" align="center">
        </el-table-column>
        <el-table-column label="床位一览标识" min-width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bedListIdentifyType==2" :style="{color:scope.row.bedListIdentifyInfoArr[1]}">
              {{scope.row.bedListIdentifyInfoArr[0]}}
            </span>
            <span v-if="scope.row.bedListIdentifyType==3">
              <ShapeSvg :shape="scope.row.bedListIdentifyInfoArr[0]" :color="scope.row.bedListIdentifyInfoArr[1]"/>
            </span>
            <span v-if="scope.row.bedListIdentifyType==4 && scope.row.bedListIdentifyInfoArr[0]">
              <el-tooltip class="item"
                          effect="dark"
                          :content="getTipName(scope.row.bedListIdentifyInfoArr[0])"
                          placement="top">
                <img :src="scope.row.bedListIdentifyInfoArr[0]"
                     style="width: 22px; height: 22px"/>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="床头卡标识" min-width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bedCardIdentifyType==1"
                  :style="{backgroundColor: scope.row.bedCardIdentifyInfoArr[1], color: scope.row.bedCardIdentifyInfoArr[0]}">
              名称
            </span>
            <span v-if="scope.row.bedCardIdentifyType==2" :style="{color:scope.row.bedCardIdentifyInfoArr[1]}">
              {{scope.row.bedCardIdentifyInfoArr[0]}}
            </span>
            <span v-if="scope.row.bedCardIdentifyType==3">
              <ShapeSvg :shape="scope.row.bedCardIdentifyInfoArr[0]" :color="scope.row.bedCardIdentifyInfoArr[1]"/>
            </span>
            <span v-if="scope.row.bedCardIdentifyType==4 && scope.row.bedCardIdentifyInfoArr[0]">
              <el-tooltip class="item"
                          effect="dark"
                          :content="getTipName(scope.row.bedCardIdentifyInfoArr[0])"
                          placement="top">
                <img :src="scope.row.bedCardIdentifyInfoArr[0]"
                     style="width: 22px; height: 22px"/>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="床旁患者端标识" min-width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.padPatientIdentifyType==1"
                  :style="{backgroundColor: scope.row.padPatientIdentifyInfoArr[1], color: scope.row.padPatientIdentifyInfoArr[0]}">
              名称
            </span>
            <span v-if="scope.row.padPatientIdentifyType==2" :style="{color:scope.row.padPatientIdentifyInfoArr[1]}">
              {{scope.row.padPatientIdentifyInfoArr[0]}}
            </span>
            <span v-if="scope.row.padPatientIdentifyType==3">
              <ShapeSvg :shape="scope.row.padPatientIdentifyInfoArr[0]" :color="scope.row.padPatientIdentifyInfoArr[1]"/>
            </span>
            <span v-if="scope.row.padPatientIdentifyType==4 && scope.row.padPatientIdentifyInfoArr[0]">
              <el-tooltip class="item"
                          effect="dark"
                          :content="getTipName(scope.row.padPatientIdentifyInfoArr[0])"
                          placement="top">
                <img :src="scope.row.padPatientIdentifyInfoArr[0]"
                   style="width: 22px; height: 22px"/>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="identifyAdd(scope.row)" type="text"  v-uni:[scope.row.identifyId]="'hulibiaoqian_xianshibiaoshi_edit'" :key="'edit' + scope.row.identifyId"
            size="small">
              编辑
            </el-button>
            <el-button
              type="textred"
              size="small"
              v-uni:[scope.row.identifyId]="'hulibiaoqian_xianshibiaoshi_delete'"
              :key="'delete' + scope.row.identifyId"
              @click="identifyDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page_current"
        :page-size="search_form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
      >
      </el-pagination>
    </div>
  </layout>
</template>

<script>
import layout from '../../../../components/bnms/layout/list'
import { ApiNursingIdentifyManage } from '../../../../api/bnms/index'

export default {
  name: 'nursing_identify',
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 0,
      identify_data: [],
      // 搜索表单
      search_form: {
        labelType: '201',
        deptId: null,
        identifyName: '',
        size: 10,
        page: 1
      },
      // table多选结果
      multipleSelection: []
    }
  },
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptId = deptInfo.deptId || ''

    this.getIdentifyData()
  },
  activated () {
    this.getIdentifyData()
  },
  methods: {
    getIdentifyData () {
      this.loading = true
      ApiNursingIdentifyManage.select(this.search_form)
        .then(res => {
          res.data = res.data || { list: [], total: 0 }
          this.identify_data = res.data.list.map(v => {
            v.bedListIdentifyInfoArr = []
            v.bedCardIdentifyInfoArr = []
            v.padPatientIdentifyInfoArr = []

            if (v.bedListIdentifyInfo) {
              v.bedListIdentifyInfoArr = v.bedListIdentifyInfo.split('|')
            }
            if (v.bedCardIdentifyInfo) {
              v.bedCardIdentifyInfoArr = v.bedCardIdentifyInfo.split('|')
            }
            if (v.padPatientIdentifyInfo) {
              v.padPatientIdentifyInfoArr = v.padPatientIdentifyInfo.split('|')
            }
            return v
          })
          this.page_total = res.data.total || 0
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    searchForm () {
      this.handleCurrentChange(1)
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    identifyAdd (row) {
      this.$emit('changed', 'add2', row)
    },
    identifyDelete (row) {
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiNursingIdentifyManage.delete({ identifyId: row.identifyId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getIdentifyData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    getRowKeys (row) {
      return row.identifyId
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getIdentifyData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getIdentifyData()
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
    },
    getTipName (path) {
      var arr = path.split('.') || []
      var _path = arr[0] || ''
      var _arr = _path.split('/')
      var length = _arr.length
      return _arr[(length - 1)] || ''
    }
  },
  components: {
    layout,
    ShapeSvg: () => import('@/components/bnms/ShapeSvg')
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/bnms/css/self_common";
</style>
