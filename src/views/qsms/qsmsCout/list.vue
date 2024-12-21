<!--问卷统计-选项统计-->
<template>
  <div class="" style="height: 100%">
    <!--查询+表格-->
    <search-list
      ref="queryList"
      tabtype="选项统计"
      @unitSearch="unitSearch"
      :shownurseUnitId="shownurseUnitId"
    />

    <template>
      <div class="cout-list-main">
        <div v-for="(item, i) in objData" :key="item.id" class="cout-tab-list">
          <template>
            <div class="spanTitle">
              <span>{{ i+1 }}、{{ item.title }}</span>
            </div>
          </template>
          <!-- 非3的table -->
          <template v-if="item.questionType!==2">
            <el-table :data="item.answerReportList" style="width: 100%">
              <template>
                <div v-for="(value, index) in zdtable[fun(item.questionType)]" :key="index">
                  <el-table-column
                    align="center"
                    v-if="value.field!=='opearte'"
                    :label="value.name"
                    :prop="value.field"
                  />
                  <el-table-column v-else :label="value.name" align="center" :prop="value.field">
                    <template slot-scope="scope">
                    <span
                      class="el-button-text-color"
                      @click="opeartHandler(scope.$index, scope.row, item)"
                    >选项统计</span>
                    </template>
                  </el-table-column>
                </div>
              </template>
            </el-table>
          </template>
          <!-- 非3的table结束 -->
          <template v-if="item.questionType===2">
            <el-table :data="item.answerFillList.list" style="width: 100%">
              <template>
                <div v-for="(value, index) in zdtable[fun(item.questionType)]" :key="index">
                  <el-table-column
                    v-if="value.field!=='index'"
                    :label="value.name"
                    :prop="value.field"
                  />
                  <el-table-column v-else width="200px" :label="value.name" :type="value.field" />
                </div>
              </template>
            </el-table>
            <div class="paginationDiv">
              <pagination
                :pagination="item.answerFillList"
                @page-size-changed="pageSizeChangeHandler"
                @page-changed="pageChangeHandler"
              />
            </div>
          </template>
        </div>
      </div>
    </template>

    <el-dialog :title="title" :visible.sync="OpCountData.dialogOptionTable" class="dialog-Option-statistics" :close-on-click-modal="false" @close="dialogClose">
      <el-table :data="pagination.list" style="width: 100%">
        <el-table-column property="nurseUnitName" label="护理单元" />
        <el-table-column property="patientName" label="患者姓名" />
        <el-table-column property="nurseName" label="责任护士" />
        <el-table-column property="doctorName" label="主管医生" />
        <el-table-column property="createDate" label="提交时间" />
      </el-table>
      <div class="paginationDiv">
        <pagination
          :pagination="pagination"
          @page-size-changed="pageSizeChange"
          @page-changed="pageChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepMerge } from '@/assets/qsms/utils'
import BaseQueryPageForm from '../common/BaseQueryPageForm'
import * as qsmsCountApi from '@/api/qsms/qsmsManage/qsmsCount'
import Pagination from '@/components/qsms/paginations/pagination'
import mixins from '../qsmsCout/mixins'
import SearchList from '../common/components/searchList.vue'
import getStorageUser from '@/assets/qsms/utils/storageUser'

export default {
  components: { Pagination, SearchList },
  mixins: [BaseQueryPageForm, mixins],
  props: {
    pageFrom: {
      type: String
    },
    detail: {
      required: true,
      type: Object,
      default: () => {}
    },
    shownurseUnitId: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    const search = this.initQueryCriteria()
    const table = this.initTable()
    return {
      detailIndex: '',
      detailRow: '',
      detailItem: '',
      search: search,
      zdtable: table,
      // 选项统计
      OpCountData: {
        dialogOptionTable: false,
        gridData: []
      },
      objData: [],
      nurseUnitData: [], // 当前所在的护理单元
      selectDeptInfo: {},
      dataDeptInfoList: [],
      title: ''
    }
  },
  mounted () {
    if (this.detail.paperId === '') {
      this.$message({
        type: 'error',
        message: 'paperid为空'
      })
      return false
    }
    this.selectDeptInfo = getStorageUser('selectDeptInfo')
    this.dataDeptInfoList = getStorageUser('dataDeptInfoList')

    if (this.pageFrom === 'WH') {
      let nurseUnitIds = []
      for (let v of this.dataDeptInfoList.values()) {
        nurseUnitIds.push(v.deptId)
      }
      this.search.nurseUnitIds = nurseUnitIds.join(',')
      delete this.search.nurseUnitId
    } else {
      this.search.nurseUnitId = this.selectDeptInfo.deptId
      delete this.search.nurseUnitIds
    }
  },
  methods: {
    dialogClose () { // 关闭弹窗，重置翻页数据
      this.pagination.page = 1
      this.pagination.size = 10
    },
    pageSizeChange (pageSize) {
      this.pagination.size = pageSize
      this.pagination.page = 1
      this.opeartHandler(this.detailIndex, this.detailRow, this.detailItem)
    },
    pageChange (page) {
      this.pagination.page = page
      this.opeartHandler(this.detailIndex, this.detailRow, this.detailItem)
    },
    // 选项统计点击的当前列的数据
    opeartHandler (index, row, i) {
      this.detailIndex = index
      this.detailRow = row
      this.detailItem = i
      this.search.answerId = row.optionId

      this.title = `${i.title}：【 ${this.search.beginTime} 至 ${this.search.endTime}】`
      let _search = this.createQueryParams()
      _search.size = this.pagination.size
      _search.page = this.pagination.page
      qsmsCountApi.getDetails(_search).then(res => {
        this.OpCountData.dialogOptionTable = true
        this.queryResultHandler(res)
      })
    },
    fun (t) {
      if (t === 0 || t === 1 || t === 3 || t === 4 || t === 5) {
        return 1
      } else {
        return 2
      }
    },
    searchCondition (serach, callback) {
      this.search = { ...serach }

      if (this.pageFrom === 'WH') {
        if (serach.nurseUnitId === '') {
          let nurseUnitIds = []
          for (let v of this.dataDeptInfoList.values()) {
            nurseUnitIds.push(v.deptId)
          }
          this.search.nurseUnitIds = nurseUnitIds.join(',')
          delete this.search.nurseUnitId
        } else {
          delete this.search.nurseUnitIds
        }
      } else {
        this.search.nurseUnitId = this.selectDeptInfo.deptId
      }
      this.search.paperId = this.detail.paperId

      callback()
    },
    // 子组件传查询条件
    unitSearch (serach) {
      this.searchCondition(serach, () => {
        this.executeQueryPage()
      })
    },
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        nurseUnitId: '', // 护理单元
        beginTime: '', // 提交时间
        endTime: '', // 结束时间
        answerId: '',
        paperId: this.detail.paperId
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      qsmsCountApi.getInfo(this.createQueryParams()).then(data => {
        if (data.status === 200) {
          this.objData = data.data
        }
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.executeQueryPage()
    }
  }
}
</script>
<style lang="scss">
  .dialog-Option-statistics{
    .el-dialog{
      .el-dialog__header{
        height:auto;
        min-height:46px;
        width: 90%;
      }
    }
  }
</style>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
 <style scoped lang="scss">
   .cout-list-main{
     height: calc(100% - 58px);
     overflow-y: scroll;
     .cout-tab-list{
       border: 1px solid #e5dada;
       margin-top: 15px;
       .spanTitle {
         padding: 10px 16px;
       }
     }
     .cout-tab-list:first-child{
       margin-top: 0;
     }
   }
</style>
