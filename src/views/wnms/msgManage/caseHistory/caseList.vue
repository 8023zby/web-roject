<template>
  <el-container>
    <el-aside width="auto" style="background: #fff;overflow: visible">
      <patient-list @initPatient="getPatInfo" :initRowIndex="0"></patient-list>
    </el-aside>
    <div class="typt-list-container">
      <!--查询+表格-->
      <div class="wareCategoryList">
        <!-- 查询条件 -->
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="推送时间">
              <el-date-picker
                v-model="search.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="开始时间"
                default-time="00:00:01"
              />—
              <el-date-picker
                v-model="search.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                default-time="23:59:59"
                placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryHandler">搜索</el-button>
              <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="typt-list-add-div" />
        </div>
        <!-- 最外层div -->
        <div>
          <!-- 数据单独div -->

          <div v-for="(item, index) in pagination.list" :key="index" class="boderDiv">
            <!-- 名称 和日期 -->
            <div class="header-panel">
              <span class="tit-ft">{{ item.caseName }}</span>
              <span class="tit-rg">{{ item.caseTime }}</span>
            </div>
            <!-- 内容 -->
            <div class="header-body">
              <div class="divcontnet">{{ item.caseContent }}</div>
            </div>
          </div>
          <div v-if="pagination.list.length<=0" class="nullDataDIV">
            <span>
              无此条件下的查询结果
              <span />
            </span>
          </div>
        </div>
        <div class="paginationDiv">
          <pagination
            :pagination="pagination"
            @page-size-changed="pageSizeChangeHandler"
            @page-changed="pageChangeHandler"
          />
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import PatientList from '../../advices/PatientList'
import { deepMerge } from '@/assets/wnms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import Pagination from '@/components/wnms/paginations/pagination'
import * as caseHistoryApi from '@/api/wnms//msgManage/caseHistory'
export default {
  components: { Pagination, PatientList },
  mixins: [BaseQueryPageForm],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    const search = this.initQueryCriteria()
    return {
      search: search,
      patInfo: Object
    }
  },
  mounted () {
    // this.executeQueryPage()
  },
  methods: {
    // 默认列表
    executeQueryPage () {
      this.search.patientId = this.patInfo['patientId']
      caseHistoryApi.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      })
    },

    // 查询条件
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        patientId: '',
        startTime: null, // 开始日期
        endTime: null // 结束日期
      })
    },

    // 重置
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.executeQueryPage()
    },

    // 获取患者id
    getPatInfo (row, type) {
      console.log(row)
      if (row !== 'null') {
        this.patInfo['patientId'] = row.patientId
      } else {
        this.$message({
          message: '患者数据错误（无patientId）',
          type: 'warning'
        })
      }
    },
    queryHandler () {
      // 判断是否有patientId
      if (
        this.patInfo['patientId'] === '' ||
        this.patInfo['patientId'] === null ||
        this.patInfo['patientId'] === undefined
      ) {
        this.$message({
          message: '请先从左侧患者一览中选择要查看的患者',
          type: 'warning'
        })
      } else {
        this.executeQueryPage()
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.boderDiv {
  border-radius: 2px;
  box-shadow: 0 0 2px 2px #dfe6ec;
  margin: 10px auto;
  width: 97%;
}
.header-panel {
  height: 50px;
  border-bottom: solid 1px #dfe6ec;

  background: rgb(249, 249, 249);
}
.tit-ft {
  float: left;
  height: 50px;
  margin-left: 5px;
  line-height: 50px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  width: 80%;
  overflow: hidden;
}
.tit-rg {
  float: right;
  margin-right: 5px;
  line-height: 50px;
}
.header-body {
  width: 100%;
  background: #ffffff;
  margin-bottom: 15px;
}
.divcontnet {
  width: 100%;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 400;
  min-height: 100px;
  background: #ffffff;
}
.nullDataDIV {
  line-height: 50px;
  font-size: 18px;
  letter-spacing: 2px;
  text-align: center;
}
</style>
