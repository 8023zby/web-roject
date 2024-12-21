<template>
  <div class="typt-list-container">
    <!-- 查询条件 -->
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="科室:">
          <treeselect
            v-model="selectDeptId"
            :multiple="false"
            :options="dataTree"
            :normalizer="normalizer"
            @select="onSelect"
            :default-expand-level="2"
            :clearable="false"
            placeholder="请选择科室"
          />
        </el-form-item>

        <el-form-item label="素材名称:">
          <el-input v-model="search.materialName" placeholder="请输入素材名称" elearable />
        </el-form-item>
        <el-form-item label="素材类型:">
          <el-select v-model="search.materialType" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option
              v-for="item in Category"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- 查询按钮 -->
          <div class="typt-search-btn">
            <el-button
              type="primary"
              @click="queryHandler"
              class="el-button-radius"
              icon="el-icon-search"
            >搜索</el-button>
            <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <hr />
      <div class="typt-list-add-div">
        <el-button
          type="warning"
          icon="el-icon-plus"
          @click="$emit('option-changed','addorEdit',{type:'add',selectDeptId:selectDeptId})"
        >新建</el-button>
        <div class="action_div">
          <el-button type="primary" :disabled="pagination.list.length <=0" @click="toSort()">素材排序</el-button>
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
      <el-table-column label="素材名称" prop="materialName" align="center" />
      <el-table-column label="素材类型" prop="materialType" :formatter="formatter" align="center" />
      <el-table-column label="是否轮播" prop="isLoop" align="center">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            @change="changeSwitch(scope.row)"
            v-model="scope.row.isLoop"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="定时播放时间" prop="playTime" align="center">
        <template slot-scope="pyScope">
          <span>{{pyScope.row.playTime===null?'': pyScope.row.playTime.map(item => item.playTime).toString()}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="el-button-text-color" @click="showImage(scope.row)">预览</span>
          <span
            class="el-button-text-color"
            @click="$emit('option-changed','addorEdit', {type:'edit',row:scope.row})"
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
    <el-dialog :visible.sync="dialogSortVisible" width="500px">
      <div slot="title" class="header-title">
        <span style="color:red">操作方式：鼠标拖拽所需项至相应位置以完成排序</span>
      </div>
      <el-table
        ref="dragTable"
        :data="tableSortData"
        style="width: 100%"
        max-height="500"
        row-key="screenId"
        fit
        highlight-current-row
      >
        <el-table-column label="序号" type="index" width="150" />
        <el-table-column label="名称" prop="materialName" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSortSubmit()">确 定</el-button>
        <el-button @click="dialogSortVisible = false">取 消</el-button>
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
    import * as csmsManageApi from '@/api/wnms/msgManage/csmsManage'
    import Pagination from '@/components/wnms/paginations/pagination'
    import mixins from '@/views/wnms/x28s/Manage/mixins.js'
    import Sortable from 'sortablejs'
    import { formatter, newGetSelectData } from '../../../../assets/wnms/utils/common'
    import tempNumView from '@/views/wnms/x28s/Manage/template/tempNumView'
    import Treeselect from "@riophae/vue-treeselect"
    import "@riophae/vue-treeselect/dist/vue-treeselect.css"

    export default {
        components: { Pagination, tempNumView, Treeselect },
        mixins: [BaseQueryPageForm, mixins],
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
                sortable: null,
                oldList: [],
                newList: [],
                dialogSortVisible: false,
                search: search,
                Category: [],
                ft: [{ value: 0, name: '图文' }, { value: 1, name: '视频' }],
                dialogShowVisible: false,
                previewData: {},
                DeptInfo: {}, //护理单元信息
                dataTree: [],
            }
        },
        mounted () {

            this.csmsCategory()
        },
        methods: {

            onSelect (node, ins) {
                this.selectDeptId = node.deptId
                this.search.deptId = this.selectDeptId
            },
            normalizer (node) {
                return {
                    id: node.deptId,
                    label: node.deptName,
                    children:
                        node.children && node.children.length > 0 ? node.children : undefined,
                }
            },

            /* 预览 */
            showImage (row) {
                csmsManageApi
                    .getDetails({
                        screenId: row.screenId
                    })
                    .then(res => {
                        this.dialogShowVisible = true
                        if (res.status === 200) {
                            // this.previewData = res.data
                            // 跳转是那个模板
                            let temp = row.materialType === 0 ? 'tempNumView' : 'tempNumVideo'
                            this.$emit('option-changed', temp, { previewData: res.data })
                        }
                    })
            },
            /* 更新轮播状态 */
            changeSwitch (row) {
                // 是否轮播 0 不 1 是
                csmsManageApi
                    .UpdateLoop({ screenId: row.screenId, isLoop: row.isLoop })
                    .then(res => {
                        if (res.status === 200) {
                            this.executeQueryPage()
                            this.$message({
                                type: 'success',
                                message: '设置成功'
                            })
                        }
                    })
            },
            /* 查询条件 */
            initQueryCriteria (form = {}) {
                return deepMerge(form, {
                    materialName: '', //  模板名称
                    materialType: '',
                    deptId: ''
                })
            },

            /* 素材类型 */
            csmsCategory () {
                this.Category = newGetSelectData({
                    data: this.ft,
                    params: {
                        value: 'value',
                        label: 'name'
                    }
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

                // if (this.detail.deptId) {

                //   this.$nextTick(() => {
                //     this.selectDeptId = this.detail.deptId
                //   })
                //   this.search.deptId = this.detail.deptId
                // }
                csmsManageApi.getInfo(this.createQueryParams()).then(data => {
                    this.queryResultHandler(data)
                })
            },

            /* 列表删除 */
            customDelHandler (index, row) {
                csmsManageApi.Delete(row.screenId).then(res => {
                    this.IsSuccess(res)
                    this.executeQueryPage()
                })
            },

            /* 清楚查询条件 */
            clsHandler () {
                this.search = this.initQueryCriteria()
                //  this.queryHandler()
                this.detail.deptId = ''
                this.getdeptsList()
            },
            /* 排序 */
            onSortSubmit () {
                var list = []
                this.newList.forEach((value, index) => {
                    list.push(index + 1)
                })
                csmsManageApi.Sort({ ids: this.newList, sortIndexs: list }).then(res => {
                    this.IsSuccess(res)
                    this.dialogSortVisible = false
                })
            },
            /* 商品排序 */
            setSort () {
                let _this = this
                const el = this.$refs.dragTable.$el.querySelectorAll(
                    '.el-table__body-wrapper > table > tbody'
                )[0]

                this.sortable = Sortable.create(el, {
                    ghostClass: 'sortable-ghost',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '')
                    },
                    onEnd: evt => {
                        const targetRow = _this.tableSortData.splice(evt.oldIndex, 1)[0]
                        _this.tableSortData.splice(evt.newIndex, 0, targetRow)
                        const tempIndex = _this.newList.splice(evt.oldIndex, 1)[0]
                        _this.newList.splice(evt.newIndex, 0, tempIndex)
                    }
                })
            },
            /* 商品排序 */
            toSort () {
                csmsManageApi
                    .getInfo({ pageHelp: 1, deptId: this.selectDeptId })
                    .then(res => {
                        if (res.status === 200) {
                            this.tableSortData = res.data
                            this.dialogSortVisible = true
                            this.oldList = this.tableSortData.map(v => v.screenId)
                            this.newList = this.oldList.slice()
                            this.$nextTick(() => {
                                this.setSort()
                            })
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
