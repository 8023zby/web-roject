<template>
  <div>
    <el-container>
      <el-main class="main">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple-dark">医院满意度调查问卷</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">护理单元:神经内一</div>
            <div class="grid-content bg-purple">提交时间:2019年4月13日 12:14</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">床号:001</div>
            <div class="grid-content bg-purple-light">姓名:王患者</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">住院号:23424234</div>
            <div class="grid-content bg-purple">得分:80/100</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">1、您对本医院的医声腐乳质量如何评价？</div>
            <div class="grid-content bg-purple">A:非常满意</div>
            <div class="grid-content bg-purple">A:非常满意</div>
            <div class="grid-content bg-purple">A:非常满意</div>
            <div class="grid-content bg-purple">A:非常满意</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">1、您对本医院的医声腐乳质量如何评价？</div>
            <div class="grid-content bg-purple">A:非常满意</div>
            <div class="grid-content bg-purple">A:非常满意</div>
            <div class="grid-content bg-purple">A:非常满意</div>
            <div class="grid-content bg-purple">A:非常满意</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">1、您对本医院的医声腐乳质量如何评价？</div>
            <div class="grid-content bg-purple">A:非常满意</div>
            <div class="grid-content bg-purple">A:非常满意</div>
            <div class="grid-content bg-purple">A:非常满意</div>
            <div class="grid-content bg-purple">A:非常满意</div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { deepMerge } from '@/assets/qsms/utils'
import BaseQueryPageForm from '../common/BaseQueryPageForm'
import * as qsmsApi from '@/api/qsms/qsmsManage/qsmsList'
export default {
  components: {},
  mixins: [BaseQueryPageForm],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  data () {
    const search = this.initQueryCriteria()
    return {
      Details: {},
      sortable: null,
      dialogSortVisible: true,
      formLabelWidth: '120px',
      selectID: [],
      search: search,
      Category: []
    }
  },
  mounted () {
    debugger
    qsmsApi.Details(this.detail.row).then(res => {
      console.log(res)
    })
  },
  methods: {
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        title: '', // 标题
        isEnable: '', // 状态
        categoryId: '', // 分类
        nurseUnitId: []
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      //   qsmsApi.Details(this.createQueryParams()).then(data => {
      //     this.queryResultHandler(data)
      //   })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.executeQueryPage()
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.bg-purple-dark {
  text-align: center;
}
</style>
