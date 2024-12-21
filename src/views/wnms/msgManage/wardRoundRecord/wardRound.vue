<template>
  <div class="typt-list-main">
    <div class="box typt-list-container">
      <el-form ref="search" :inline="true" :model="search" class="search">
        <!-- <el-form-item label="护理单元">
          <el-select v-model="search.deptIds"
                     @change="changeHander"
                     placeholder="全部">
            <el-option value>全部</el-option>
            <el-option v-for="item in nurseUnitList"
                       :key="item.deptId"
                       :label="item.deptName"
                       :value="item.deptId">{{ item.deptName }}
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="房间号">
          <el-select v-model="search.roomId" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option
              v-for="item in roomList"
              :key="item.roomId"
              :label="item.roomName"
              :value="item.roomId"
            >{{ item.roomName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查房护士">
          <el-select v-model="search.userId" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option
              v-for="item in nurseList"
              :key="item.empId"
              :label="item.empName"
              :value="item.empId"
            >{{ item.empName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="title">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <!-- 查询按钮 -->
          <div class="typt-search-btn">
            <el-button
              type="primary"
              icon="el-icon-search"
              class="el-button-radius"
              @click="serachHandler"
            >搜索</el-button>
            <el-button type="text" @click="resetHandler">重置</el-button>
          </div>
        </el-form-item>
      </el-form>

      <hr />

      <el-table
        :data="tableData.list"
        :header-cell-style="{'background': '#f9f9f9'}"
        height="80%"
        select-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{ (tableData.pageNum - 1) * tableData.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间号" prop="roomName" align="center" />
        <el-table-column label="床号" prop="bedName" align="center" />
        <el-table-column label="查房护士" prop="userName" align="center" />
        <el-table-column label="查房时间" prop="checkTime" align="center" />
      </el-table>
      <br />
      <div class="paginationDiv">
        <el-pagination
          :total="tableData.total"
          :page-size="size"
          :current-page.sync="currPage"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mixin from './mixin'

import {
  queryListApi,
  queryRoomListApi,
  queryNurseListApi
} from '@/api/wnms//msgManage/wardRoundRecord'

export default {
  name: 'MngAudio',
  mixins: [mixin],
  data () {
    return {
      // 时间选择
      timeRange: [],
      // 表格数据
      tableData: {},
      // 查询参数
      search: {
        deptIds: this.selectDeptInfo(),
        roomId: '',
        userId: '',
        beginTime: '',
        endTime: ''
      }
    }
  },
  computed: {
    // 设置默认开始时间
    default_beginTime: function () {
      return `${this.formatDate().FullYear}-${this.formatDate().Month + 1}-${this.formatDate().Date} 00:00:00`
    },
    // 设置默认结束时间
    default_endTime: function () {
      return `${this.formatDate().FullYear}-${this.formatDate().Month + 1}-${this.formatDate().Date} ${this.formatDate().Hours}:${this.formatDate().Seconds}:${this.formatDate().Minutes}`
    }
  },
  watch: {
    // 获取护理单元id字符串
    // nurseUnitIdString: function () {
    //   this.queryListHandler({
    //     deptIds: this.selectDeptInfo(),
    //     beginTime: this.default_beginTime,
    //     endTime: this.default_endTime
    //   })
    // },
    // 监听事件选择
    'timeRange': function (newVal, oldVal) {
      const [beginTime, endTime] = newVal

      this.search.beginTime = beginTime
      this.search.endTime = endTime
    }
  },
  mounted () {
    // 获取房间列表
    this.queryRoomListHandler()

    // 获取护士列表
    this.queryNurseListHandler()
    // 回显时间框
    this.timeRange = [this.default_beginTime, this.default_endTime]

    // 获取记录列表
    this.queryListHandler({
      deptIds: this.selectDeptInfo(),
      beginTime: this.default_beginTime,
      endTime: this.default_endTime
    })
  },
  methods: {
    /**
     * @获取记录列表
     */
    queryListHandler (param) {
      queryListApi({
        page: this.page,
        size: this.size,
        ...param
      }).then(response => {
        this.tableData = response.data
      })
    },

    /**
     * @获取房间列表
     */
    queryRoomListHandler () {
      queryRoomListApi({
        page: this.page,
        size: this.size,
      }).then(response => {
        this.roomList = response.data.list
      })
    },

    /**
     * @获取护士列表
     */
    queryNurseListHandler (param) {
      queryNurseListApi(param).then(response => {
        this.nurseList = response.data
      })
    },

    // 搜索
    serachHandler () {
      this.page = 1
      this.currPage = 1
      // 深拷贝 search 参数
      const cloneSearchData = this.deepClone(this.search)
      // 判断 未选择护理单元时，默认全选
      if (cloneSearchData.deptIds === '') {
        cloneSearchData.deptIds = this.selectDeptInfo()
      }
      this.queryListHandler(cloneSearchData)
    },

    // 清楚查询条件
    resetHandler () {
      this.page = 1
      this.size = 10
      this.currPage = 1
      this.timeRange = [this.default_beginTime, this.default_endTime]
      this.search = {
        deptIds: this.selectDeptInfo(),
        roomId: '',
        userId: '',
        beginTime: this.default_beginTime,
        endTime: this.default_endTime
      }

      this.queryListHandler(this.search)
      this.search.deptIds = ''
    },

    // 获取当前时间
    formatDate () {
      var myDate = new Date() // 获取系统当前时间

      return {
        Year: myDate.getYear(), // 获取当前年份(2位)
        FullYear: myDate.getFullYear(), // 获取完整的年份(4位,1970-????)
        Month: myDate.getMonth(), // 获取当前月份(0-11,0代表1月)
        Date: myDate.getDate(), // 获取当前日(1-31)
        Day: myDate.getDay(), // 获取当前星期X(0-6,0代表星期天)
        Time: myDate.getTime(), // 获取当前时间(从1970.1.1开始的毫秒数)
        Hours: myDate.getHours(), // 获取当前小时数(0-23)
        Minutes: myDate.getMinutes(), // 获取当前分钟数(0-59)
        Seconds: myDate.getSeconds(), // 获取当前秒数(0-59)
        Milliseconds: myDate.getMilliseconds(), // 获取当前毫秒数(0-999)
        LocaleDateString: myDate.toLocaleDateString() // 获取当前日期
      }
    }
  }
}
</script>
