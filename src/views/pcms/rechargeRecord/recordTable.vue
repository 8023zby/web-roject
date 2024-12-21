<!--
  文件描述：充值记录列表页面
-->
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form :inline="true" :model="search" class="typt-list-search">
      <el-form-item label="住院号：">
        <el-input v-model="search.inpNo" size="small"></el-input>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-model="search.patientName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="单号：">
        <el-input v-model="search.payOrderNum" size="small"></el-input>
      </el-form-item>
      <el-form-item label="充值时间：">
        <el-date-picker
          style="width:200px;"
          v-model="search.beginTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择"
          :clearable="false"
          size="small"
        />
        至&nbsp;
        <el-date-picker
          style="width:200px;"
          v-model="search.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :clearable="false"
          placeholder="请选择"
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button
            type="primary"
            @click="onSubmit"
            icon="el-icon-search"
            size="small"
            >搜索</el-button
          >
          <el-button type="text" @click="reSearch">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--查询条件模块 === END-->
    <hr />
    <!--表格主体 ==== START-->
    <el-table
      :data="pagination.list"
      height="80%"
      select-all
      stripe
      v-loading="yh_loading"
    >
      <!-- <el-table-column prop="sortIndex" align="center" label="序号" width="150">
        <template slot-scope="scope">
          <span>{{
            (pagination.page - 1) * pagination.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="住院号" width align="center" prop="inpNo" />
      <el-table-column label="姓名" align="center" width prop="patientName" />
      <el-table-column
        label="充值时间"
        align="center"
        width
        prop="createTime"
      />
      <el-table-column label="金额" align="center" width prop="payCount" />
      <el-table-column label="充值方式" align="center" width prop="payType">
        <template slot-scope="scope">
          <label>{{ scope.row.payType === 1 ? "支付宝" : "微信" }}</label>
        </template>
      </el-table-column>
      <el-table-column
        label="单号"
        align="center"
        width="300"
        prop="payOrderNum"
      />
    </el-table>
    <!--表格主体 ==== END-->
    <!--分页条-->
    <pagination
      :pagination="pagination"
      @page-size-changed="pageSizeChangeHandler"
      @page-changed="pageChangeHandler"
    />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import { deepMerge } from '@/assets/pcms/utils'
import { queryRecord } from '../../../api/pcms/rechargeRecord/record'
import Pagination from '@/components/pcms/paginations/pagination'
import BaseQueryPageForm from '../common/BaseQueryPageForm'

export default {
  name: 'BillTable',
  // import引入的组件需要注入到对象中才能使用
  mixins: [BaseQueryPageForm],
  components: { Pagination },
  data () {
    const search = this.initQueryCriteria()
    // 这里存放数据
    return {
      tableSortData: {},
      search: search,
      yh_loading: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 方法集合
  methods: {
    /**
     * 将时间格式化为标准字符串==HH-MM-DD HH:MI:ss
     *
     *
     * */
    createTimeStr (time = new Date(), type = 'ymdhis') {
      let date = new Date(time)

      let Str = ''
      let year = date.getFullYear()
      let month = Number(date.getMonth()) + 1
      if (month < 10) month = '0' + month
      let day = date.getDate()
      if (day < 10) day = '0' + day
      let hours = date.getHours()
      if (hours < 10) hours = '0' + hours
      let minutes = date.getMinutes()
      if (minutes < 10) minutes = '0' + minutes
      let Seconds = date.getSeconds()
      if (Seconds < 10) Seconds = '0' + Seconds

      if (type === 'ymdhis') {
        Str =
          year +
          '-' +
          month +
          '-' +
          day +
          ' ' +
          hours +
          ':' +
          minutes +
          ':' +
          Seconds
      } else if (type === 'ymd') {
        Str = year + '-' + month + '-' + day
      } else if (type === 'his') {
        Str = hours + ':' + minutes + ':' + Seconds
      }
      return Str
    },
    refreshDate () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)

      let stime = this.createTimeStr(start, 'ymd') + ' 00:00:00'
      let etime = this.createTimeStr(end, 'ymd') + ' 23:59:59'

      this.valueTime = [new Date(stime), end]

      this.search.beginTime = stime
      this.search.endTime = etime

      return { beginTime: stime, endTime: etime }
    },
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(
        {
          inpNo: '',
          patientName: '',
          payOrderNum: '',
          beginTime: '',
          endTime: ''
        },
        form
      )
    },
    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      queryRecord(this.createQueryParams())
        .then(data => {
          this.queryResultHandler(data)
        })
        .finally(() => {
          this.yh_loading = false
        })
    },
    // 查询
    onSubmit () {
      this.executeQueryPage()
    },
    // 清空筛选条件
    reSearch () {
      this.search = this.initQueryCriteria(this.refreshDate())
      this.queryHandler()
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.refreshDate()
    this.executeQueryPage()
  },
  beforeCreate () {}, // 生命周期 - 创建之前
  beforeMount () {}, // 生命周期 - 挂载之前
  beforeUpdate () {}, // 生命周期 - 更新之前
  updated () {}, // 生命周期 - 更新之后
  beforeDestroy () {}, // 生命周期 - 销毁之前
  destroyed () {}, // 生命周期 - 销毁完成
  activated () {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
