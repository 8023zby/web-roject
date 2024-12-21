<!--点阵显示屏公告-->
<template>
  <div class="typt-list-container">
    <!-- 查询条件 -->
    <div>
      <hr />
      <div class="typt-list-add-div">
        <el-button
          type="warning"
          @click="add"
        >发布公告</el-button>
        <div class="action_div">
          <el-button type="primary" :disabled="pagination.list.length <=0" @click="toSort()">公告排序</el-button>
          <el-button type="primary" :disabled="pagination.list.length <=0" @click="updateCorridor()">更新点阵屏</el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="pagination.list" style="width: 100%" height="80%" select-all stripe>
      <el-table-column prop="sortIndex" align="center" label="序号" width="150">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column  :show-overflow-tooltip="true" label="公告内容" prop="content" align="center" />
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <span
            class="el-button-text-color"
            @click="$emit('transfer','latticeAddorEdit',{type:'edit',row:scope.row,selectDeptId})"
          >编辑</span>
          <span class="el-text-danger" @click="delHandler(scope.$index, scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationDiv">
      <pagination
        :pagination="pagination"
        @page-size-changed="pageSizeChangeHandler"
        @page-changed="pageChangeHandler"
      />
    </div>
    <!--排序对话框-->
    <el-dialog
      :visible.sync="dialogSortVisible"
      width="800px"
      class="clsStor"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div slot="title" class="header-title">
       <!-- <span style="color:red">操作方式：鼠标拖拽所需项至相应位置以完成排序</span>-->
      </div>
      <el-table
        ref="dragTable"
        :data="tableSortData"
        style="width: 100%;"
        row-key="screenId"
        border
        fit
        highlight-current-row
        max-height="500"
      >
        <el-table-column label="序号" type="index" width="150" />
        <el-table-column label="名称" prop="content" />
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button type="text" @click="moveUp(scope.$index, scope.row)">上移</el-button>
            <el-button
              type="text"
              @click="moveDown(scope.$index, scope.row)"
              style="color:#f56f6c"
            >下移</el-button>
            <el-button type="text" @click="moveTop(scope.$index, scope.row)">置顶</el-button>
            <el-button
              type="text"
              @click="moveBottom(scope.$index, scope.row)"
              style="color:#f56f6c"
            >置底</el-button>
            <el-button type="text" @click="customDo(scope.$index, scope.row)">指定位置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSortVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSortSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogShowVisible" width="100%">
      <div style="height:550px">
        <tempNumView :previewData="previewData"></tempNumView>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { deepMerge } from '@/assets/wnms/utils'
    import BaseQueryPageForm from '../../common/BaseQueryPageForm'
    import mixin from './mixin'
    import * as csmsManageApi from '@/api/wnms/msgManage/csmsManage'
    import Pagination from '@/components/wnms/paginations/pagination'
    import { formatter } from '../../../../assets/wnms/utils/common'
    import tempNumView from '@/views/wnms/x28s/Manage/template/tempNumView'
    import {
        selectDeptInfo, selectDeptInfoData
    } from '@/assets/wnms/utils/common'

    export default {
        components: { Pagination, tempNumView },
        mixins: [BaseQueryPageForm, mixin],
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
                tableSortData: [],
                dialogSortVisible: false,
                search: search,
                Category: [],
                ft: [{ value: 0, name: '图文' }, { value: 1, name: '视频' }],
                dialogShowVisible: false,
                previewData: {},
                DeptInfo: {}, //护理单元信息
                selectDeptId: selectDeptInfo() // 当前护理单元
            }
        },
        mounted () {
            this.executeQueryPage()
        },
        methods: {
            add() {
                if (this.pagination.total >= 15) {
                    this.$message({
                        type: 'warning',
                        message: '点阵屏广告最多允许添加15条，请先删除已有广告后再进行新的添加'
                    })
                    return
                }
                this.$emit('transfer', 'latticeAddorEdit', { type: 'add', selectDeptId: this.selectDeptId })
            },
            /* 查询条件 */
            initQueryCriteria (form = {}) {
                let selectData = selectDeptInfoData()
                return deepMerge(form, {
                    deptId: selectData.deptId,
                    orgId: selectData.orgId
                })
            },

            /* 列表类型对照 */
            formatter (v) {
                return formatter(this.ft, v.materialType, {
                    value: 'value',
                    label: 'name'
                })
            },

            /* 获取列表 */
            executeQueryPage () {
                csmsManageApi.litticeList(this.createQueryParams()).then(data => {
                    this.queryResultHandler(data)
                })
            },

            /* 列表删除 */
            customDelHandler (index, row) {
                console.log(row)
                csmsManageApi.latticeDelete(row.id).then(res => {
                    this.IsSuccess(res)
                    this.executeQueryPage()
                })
            },
            /* 排序 */
            onSortSubmit () {
                let list = []
                this.tableSortData.forEach((value, index) => {
                    list.push({
                        id: value.id,
                        sortIndex: index + 1
                    })
                })
                csmsManageApi.latticeSort(list).then(res => {
                    this.IsSuccess(res)
                    this.dialogSortVisible = false
                })
            },
            updateCorridor() {
                let selectData = selectDeptInfoData()
                csmsManageApi
                    .updateLittice({ deptId: selectData.deptId, orgId: selectData.orgId })
                    .then(res => {
                        this.IsSuccess(res)
                    })
            },
            /* 排序 */
            toSort () {
                let selectData = selectDeptInfoData()
                csmsManageApi
                    .litticeList({ pageHelp: 1, deptId: selectData.deptId, orgId: selectData.orgId })
                    .then(res => {
                        if (res.status === 200) {
                            this.tableSortData = res.data
                            this.dialogSortVisible = true
                        } else {
                            this.$message('获取数据失败')
                        }
                    })
            }
        }
    }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
  .btn-area {
    padding: 20px 0px 10px 0px;
  }
  .query-area > div {
    margin-right: 50px;
  }

  .addbtn {
    float: right;
  }
  .clsStor {
    height: 85%;
  }
  .storTitle {
    color: red;
    font-size: 1em;
  }
</style>
