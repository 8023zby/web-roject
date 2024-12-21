<template>
  <layoutAside>
    <div slot="aside">
      <leftGroup ref="leftGroup" @option-changed="sendParams" :switchHlfzSetting="switchHlfzSetting" @updateNurseList="updateNurseList"></leftGroup>
    </div>
    <div slot="main">
      <layoutList>
        <div slot="query" class="query-items" v-if="switchHlfzSetting === 1">
          <el-form ref="search_form" :inline="true" :model="search_form" label-suffix=":">
            <el-form-item label="查询日期">
              <el-date-picker
                style="width: 150px"
                v-model="search_form.classesTime"
                @change="getData"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="el-button-radius btn-position" icon="el-icon-search" @click="getData()" size="small">搜索</el-button>
              <el-button type="text" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div slot="main" class="main-list">
          <el-table :data="tableData" stripe height="100%" :row-style="{height:'48px'}">
            <!-- <el-table-column type="index" label="序号" align="center" width="100">
              <template slot-scope="scope">
                {{(search_form.page - 1) * search_form.size + scope.$index + 1}}
              </template>
            </el-table-column> -->
            <el-table-column min-width="100px" align="center" label="所属名称">
              <template slot-scope="scope" >
                <span v-if="scope.row.groupType === 0">{{ scope.row.groupName }}</span>
                <span v-else>{{ scope.row.groupParentName }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="100px" align="center" label="护士姓名">
              <template slot-scope="scope" >
                <span v-if="scope.row.groupType === 1">{{ scope.row.groupName }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="100px" align="center" label="责任组长">
              <template slot-scope="scope" v-if="scope.row.groupType === 1">
                <span v-if="scope.row.ifLeader === 0">否</span>
                <span v-else>是</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="bedNames" align="center" :label="'分管床位'" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="roomNames" align="center" :label="'分管房间'" min-width="200" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div slot="footer" class="page-bar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page_current"
            :page-sizes="[10,20, 30, 40,50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page_total"
          />
        </div>
      </layoutList>
    </div>
  </layoutAside>
</template>

<script>
import layoutAside from '../../../components/hsms/layout/aside'
import layoutList from '../../../components/hsms/layout/list'
import leftGroup from './leftGroup'
import { ApiHlfzSetting } from '../../../api/bnms'
import { ApiNurseGroup } from '../../../api/hsms'
const moment = require('moment')

export default {
  name: 'NurseGroup',
  components: { layoutAside, layoutList, leftGroup },
  data () {
    return {
      switchHlfzSetting: 0,
      search_form: { // 查询表单
        id: '',
        size: 10,
        page: 1,
        classesTime: moment().format('YYYY-MM-DD')
      },
      page_current: 1,
      page_total: 0,
      tableData: []
    }
  },
  watch: {
    'search_form.id': {
      handler (val) {
        this.search_form.page = 1
        val && this.getData()
      },
      immediate: true
    }
  },
  created () {
    this.checkShowTimeCheck()
    this.getData()
  },
  methods: {
    checkShowTimeCheck () { // 查询是否需要显示时间查询
      let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}

      ApiHlfzSetting.select({ type: 1, deptId: deptInfo.deptId || '' }).then(res => {
        const { value = 0 } = res.data || {}
        this.switchHlfzSetting = value
      })
    },
    reset () {
      this.search_form.classesTime = moment().format('YYYY-MM-DD')
      this.getData()
    },
    sendParams (nodeId) {
      this.search_form.id = nodeId
    },
    updateNurseList () {
      this.search_form.id = ''
      this.getData()
    },
    getData () {
      ApiNurseGroup.selectNurseList(this.search_form).then(res => {
        if (res.data) {
          let list = res.data.list || []

          this.tableData = list
          this.page_total = res.data.total
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getData()
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/hsms/css/self_common";
</style>
