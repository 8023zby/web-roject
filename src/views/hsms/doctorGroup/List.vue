<template>
  <layout_aside>
    <div slot="aside">
      <leftGroup ref="leftGroup" @option-changed="sendParams" @updateDoctorList="updateDoctorList"></leftGroup>
    </div>
    <div slot="main">
      <layout_list>
        <div slot="main" class="main-list">
          <!--列表-->
          <el-table
            :data="tableData"
            stripe
            height="100%"
            :row-style="{height:'48px'}"
          >
            <el-table-column type="index" label="序号" align="center" width="120">
              <template slot-scope="scope">
                {{(search_form.page - 1) * search_form.size +
                scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column
              min-width="100px"
              prop="groupName"
              align="center"
              label="医生姓名">
            </el-table-column>
            <el-table-column
              min-width="100px"
              prop="dutyType"
              align="center"
              label="值班类别">
            </el-table-column>
            <el-table-column
              prop="dataList"
              align="center"
              :label="'分管'+modelTypeName"
              min-width="200"
              show-overflow-tooltip
            >
            </el-table-column>
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
          >
          </el-pagination>
        </div>
      </layout_list>
    </div>
  </layout_aside>
</template>

<script>
import layout_aside from '../../../components/hsms/layout/aside'
import layout_list from '../../../components/hsms/layout/list'
import leftGroup from './leftGroup'
import { ApiDoctorGroup } from '../../../api/hsms'

export default {
  name: 'NurseGroup',
  components: { layout_aside, layout_list, leftGroup },
  data () {
    return {
      modelTypeName: '',
      // 查询表单
      search_form: {
        id: '',
        modelType: 'BED',
        size: 10,
        page: 1
      },
      page_current: 1,
      page_total: 1,
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
    // this.getData()
  },
  methods: {
    sendParams (modelType, nodeId) {
      this.modelTypeName = modelType === 'ROOM' ? '房间' : '床位'
      this.search_form.id = nodeId
      this.search_form.modelType = modelType

      this.getData()
    },
    updateDoctorList () {
      this.search_form.id = ''
      this.getData()
    },
    getData () {
      ApiDoctorGroup.selectList(this.search_form).then(res => {
        let list = res.data.list || []
        list.forEach(item => {
          switch (item.dutyType) {
            case 1:
              item.dutyType = '一线'
              break
            case 2:
              item.dutyType = '二线'
              break
            case 3:
              item.dutyType = '三线'
              break
            default:
              item.dutyType = ''
              break
          }
        })
        this.tableData = list
        this.page_total = res.data.total
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

  .el-button--small {
    padding: 6px 16px !important;
    border-radius: 2px !important;
  }
</style>
