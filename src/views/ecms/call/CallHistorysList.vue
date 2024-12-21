<!--
  文件描述：呼叫记录列表页面
-->
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="发起设备：">
        <el-select v-model="search.deviceType" placeholder="全部" size="small">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in deviceType"
            :key="index"
            :label="item.desc"
            :value="item.deviceType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否接通：">
        <el-select
          v-model="search.answerStatus"
          placeholder="全部"
          size="small"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="接通" :value="true"></el-option>
          <el-option label="未接通" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
          style="width: 185px"
          v-model="search.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择"
          size="small"
        />
        至
        <el-date-picker
          v-model="search.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择"
          size="small"
        />
      </el-form-item>

      <el-form-item label="分机号：">
        <el-input
          v-model="search.deviceId"
          placeholder=""
          size="small"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="onSubmit"
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
    <el-table :data="pagination.list" stripe v-loading="loading" height="80%">
      <!-- <el-table-column prop="sortIndex" align="center" label="序号" width="150">
        <template slot-scope="scope">
          <span>{{
            (pagination.page - 1) * pagination.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="是否接通" width="100" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.answerStatus">
            <span>接通</span>
          </div>
          <div v-else>
            <span>未接通</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="callerName" label="发起设备" align="center">
      </el-table-column>
      <el-table-column label="接收设备" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="400"
            trigger="hover"
            :content="scope.row.calleeName"
          >
          <div slot="reference" class="two-row-show">
            {{ scope.row.calleeName }}
          </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="dealWay" label="处理方式" align="center">
      </el-table-column>
      <el-table-column prop="deviceName" label="分机号" align="center">
      </el-table-column>
      <el-table-column
        prop="time_callercallout"
        label="呼叫时间"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="dealTime" label="处理时间" align="center">
      </el-table-column>
      <el-table-column prop="callDuration" label="通话时长" align="center">
      </el-table-column>
      <el-table-column label="播放录音" width="130" align="center">
        <template slot-scope="scope">
          <!--只有 Firefox 和 Chrome 支持 download 属性-->
          <!--:href="urlPath+'ecms/web-ec/callrecords/download?fileName='+ scope.row.url" :download="scope.row.url"-->
          <a
            v-if="
              scope.row.url && scope.row.url !== '' && scope.row.url !== null
            "
            style="color: #6db6ff; cursor: pointer"
            @click="downLoadFile(scope.row)"
            >点击下载</a
          >
        </template>
      </el-table-column>
    </el-table>
    <!--表格主体 ==== END-->

    <!--分页条-->
    <pagination
      :pagination="pagination"
      @page-size-changed="pageSizeChangeHandler"
      @page-changed="pageChangeHandler"
    />
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot> </slot>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import { deepMerge } from '@/assets/ecms/utils'
import BaseManage from '../../../assets/ecms/mixins/BaseManage'
import Pagination from '@/components/ecms/paginations/pagination'
import BaseQueryPageForm from '../common/BaseQueryPageForm'

export default {
  name: 'callHistorysList',
  // import引入的组件需要注入到对象中才能使用
  mixins: [BaseQueryPageForm, BaseManage],
  components: { Pagination },
  data () {
    const search = this.initQueryCriteria()
    // 这里存放数据
    return {
      tableSortData: {},
      search: search,

      modelName: '呼叫记录',
      valueTime: [],
      selectedDeptID: '',
      defaultDeptIdOp: [],
      // url: '/ecms/web-ec/callrecords',
      url: '/avcs/mango/log/',
      urlDevice: '/avcs/mango/log/deviceType',
      urlPath: '',
      deviceType: [
        { deviceType: 'wnVoiceGateway', desc: '手持机' },
        { deviceType: 'wnMedicalMainframe', desc: '医护主机' },
        { deviceType: 'wnEntranceGuard', desc: '门禁分机' },
        { deviceType: 'wnDutyMainframe', desc: '值班室分机' },
        { deviceType: 'wnDoorWayExtension', desc: '门口机' },
        { deviceType: 'wnBedSideExtension', desc: '床旁分机' },
        { deviceType: 'wnBedHeadExtension', desc: '床头分机' },
        { deviceType: 'rvKinVisitExtension', desc: '探视分机' },
        { deviceType: 'wnMedicalAudioAssistant', desc: '医声助手' },
        { deviceType: 'wnToiletExtension', desc: '卫生间分机' }
      ]
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
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)

      let stime = this.createTimeStr(start, 'ymd') + ' 00:00:00'
      let etime = this.createTimeStr(end, 'ymd') + ' 23:59:59'

      this.valueTime = [new Date(stime), end]

      this.search.startTime = stime
      this.search.endTime = etime

      return { startTime: stime, endTime: etime }
    },
    downLoadFile (row) {
      let filePath = row.url
      let file = filePath.split('.')
      let filename = row.time_callercallout + '-' + row.callerName
      fetch(filePath)
        .then((res) => res.blob())
        .then((blob) => {
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.style.display = 'none'
          // 使用获取到的blob对象创建的url
          const url = window.URL.createObjectURL(blob)
          a.href = url
          // 指定下载的文件名
          a.download = filename + '.' + file[file.length - 1]
          a.click()
          document.body.removeChild(a)
          // 移除blob对象的url
          window.URL.revokeObjectURL(url)
        })
    },
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      console.log(form)
      return deepMerge(
        {
          callingType: '',
          isConnect: '',
          startTime: '',
          endTime: '',
          callingEtn: '',
          deviceType: '',
          answerStatus: '',
          deptId: JSON.parse(localStorage.getItem('selectDeptInfo')).deptId
        },
        form
      )
    },
    /* 获取列表 */
    executeQueryPage () {
      this.getData(this.createQueryParams(), (data) => {
        this.queryResultHandler(data)
      })
    },
    // 查询
    onSubmit () {
      this.initPagination(this.pagination)
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
  created () {
    // this.getDeviceType() // 获取查询设备类型
    this.refreshDate()
    // this.onSearchSubmit()
    this.urlPath = window.location.host
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.executeQueryPage()
  }
}
</script>
<style scoped>
.two-row-show{
  display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden;
}
</style>
