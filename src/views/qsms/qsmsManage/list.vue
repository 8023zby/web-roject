<!--
  文件描述：基于新UI的list页面-问卷管理
    主样式class：list-page-new
  创建时间：2020/4/23 15:19
  创建人：Administrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
  关于主体查询方法，方法名为：executeQueryPage
  表格数据变量为：pagination.list

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->
<template>
  <el-container class="list-page-new">
    <el-header height="auto">
      <!--有标题的话，header的class = header-hastitle-->
      <!--查询条件模块 === START-->
      <div class>
        <div class="query-items-container" ref="query_form">
          <slot name="query">
            <el-form ref="search" :inline="true" :model="search" class="search">
              <el-form-item label="标题:" prop="title">
                <el-input v-model="search.title" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="状态:" prop="paperState">
                <el-select v-model="search.paperState" placeholder="请选状态">
                  <el-option
                    v-for="item in state"
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
                    icon="el-icon-search"
                    class="el-button-radius"
                    @click="query"
                  >搜索</el-button>
                  <el-button type="text" @click="handleReset('search')">重置</el-button>
                </div>
              </el-form-item>
            </el-form>
          </slot>
        </div>
      </div>
      <!--查询条件模块 === END-->

      <div class="tool-container">
        <div class="left">
          <!--左边按钮-->
          <slot name="left_btn">
            <el-button
              type="warning"
              size="small"
              icon="el-icon-plus"
              @click="$emit('option-changed', 'add')"
            >添加</el-button>
          </slot>
        </div>
        <div class="right">
          <!--右边按钮-->
          <slot name="right_btn"></slot>
        </div>
      </div>
    </el-header>
    <el-main>
      <!--主体列表-->
      <slot name="main">
        <div class="typt-list-container">
        <el-table
          :data="pagination.list"
          height="100%"
          v-loading="yh_loading"
          :header-cell-style="{'background': '#f9f9f9'}"
          select-all
          stripe
        >
          <!-- <el-table-column type="index" label="序号" width="160" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index+( pagination.page - 1) *pagination.size + 1 }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="问卷标题" prop="title" align="center" />
          <el-table-column label="状态" prop="paperState" width="100" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.paperState"
                :active-color="switchActiveColor"
                :active-value="1"
                :inactive-value="0"
                @change="UpdateQsmsState(scope.row)"
              />
            </template>
          </el-table-column>
          <!--<el-table-column label="护理单元"
                           prop="nurseUnitNames"
          align="center" />-->
          <el-table-column label="答卷数量" prop="counts" align="center" />
          <el-table-column label="创建时间" prop="createTime" align="center" />
          <el-table-column label="操作" width="480" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.counts===0"
                @click="$emit('option-changed', 'statistics', { paperId: scope.row.paperId })"
              >答卷统计</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.counts===0"
                @click="routerToAnsList(scope.row)"
              >答卷列表</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.counts===0"
                @click="exportExcel(scope.row.paperId)"
              >导出答卷表
              </el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.counts>0"
                @click="isEdit(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                :style="scope.row.counts===0?'color:#F56C6C;':''"
                :disabled="scope.row.counts>0"
                @click="delHandler(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </slot>
    </el-main>

    <el-footer height="auto" class="page-bar">
      <!--分页条-->
      <slot name="footer">
        <pagination
          :pagination="pagination"
          @page-size-changed="pageSizeChangeHandler"
          @page-changed="pageChangeHandler"
        />
      </slot>
    </el-footer>
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <!--调查问卷弹窗-->
      <el-dialog
        title="导出答卷表"
        :visible.sync="QuestionnaireDialog"
        width="580px"
        :show-close="false"
        :close-on-click-modal="false"
        class="classifyDialogStyle">

        <el-form
          :model="QuestionnaireForm"
          ref="QuestionnaireForm"
          label-width="100px"
          label-suffix=":"
          :rules="rules"
          :inline="true"
        >
          <el-form-item label="答卷日期" prop="startTime">
            <el-date-picker
              type="date"
              v-model="QuestionnaireForm.startTime"
              :clearable="false"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 182px;"
            ></el-date-picker>
          </el-form-item>
          <span class="split">至</span>
          <el-form-item label="" prop="endTime" label-width="0">
            <el-date-picker
              type="date"
              v-model="QuestionnaireForm.endTime"
              :clearable="false"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 182px;"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
      </span>
      </el-dialog>
      <!--导出提示弹窗-->
      <el-dialog
        title="导出提示"
        :visible.sync="alertDialog"
        width="490px"
        :show-close="false"
        :close-on-click-modal="false"
        class="alertDialogStyle">
        <div class="title">
          答卷EXCEL表生成中，请耐心等候...</div>
      </el-dialog>
    </slot>
  </el-container>
</template>

<script>
import mixin from './mixin'
import Pagination from '@/components/qsms/paginations/pagination'
import BaseQueryPageForm from '../common/BaseQueryPageForm'

import { delQsms, getState, fetchQsmsList } from '@/api/qsms/qsmsManage/qsmsManage'
import getStorageUser from '@/assets/qsms/utils/storageUser'

export default {
  name: 'QsmsManage',
  mixins: [mixin, BaseQueryPageForm],
  components: { Pagination },
  data () {
    return {
      yh_loading: false,
      // 表格数据
      tableData: {},
      // 查询参数
      search: {
        // 护理单元 ID
        nurseUnitId: '',
        // 问卷标题
        title: '',
        // 问卷状态
        paperState: null
      }
    }
  },
  mounted () {
    let deptInfo = getStorageUser('selectDeptInfo')

    if (deptInfo === null || deptInfo === '') {
      this.$message({
        type: 'error',
        message: '无法获取到单位信息，请重新登陆!'
      })
      localStorage.clear()
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
      return false
    }

    this.search.nurseUnitId = deptInfo.deptId
    // 获取列表数据
    this.executeQueryPage()
  },
  methods: {
    /**
     * 跳转答卷列表
     *
     * */
    routerToAnsList (row) {
      this.$router.push({ path: '/answerSheetList', query: { paperId: row.paperId, title: row.title, pageFrom: '' } })
    },
    /**
     * @获取问卷列表
     * @param {Integer: page} 页面，默认为1
     * @param {Integer: size} 条数，默认为10
     * @param {String: nurseUnitId} 护理单元id(多个,逗号拼接)
     * @param {String: title} 问卷标题
     * @param {Integer: paperState} 问卷状态，0 不可用 1 可用
     * @description 获取问卷列表
     */
    executeQueryPage () {
      this.yh_loading = true
      fetchQsmsList({
        size: this.pagination.size,
        page: this.pagination.page,
        ...this.search
      }).then(response => {
        this.queryResultHandler(response)
      }).finally(() => {
        this.yh_loading = false
      })
    },
    /**
     * @是否可编辑
     * @param {String: id} 问题 id，必填
     * @description
     */
    isEdit (row) {
      getState(row.paperId).then(response => {
        if (response.status === 200) {
          // 路由转跳编辑页面
          this.$emit('option-changed', 'add', { type: 'edit', row })
        } else {
          this.$message({
            type: 'error',
            message: response.desc
          })
        }
      })
    },
    /**
     * @删除问卷
     * @param {String: id} 问题 id，必填
     * @description
     */
    customDelHandler (row) {
      delQsms(row.paperId).then(response => {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.executeQueryPage()
        } else {
          this.$message({
            type: 'error',
            message: response.desc
          })
        }
      })
    },
    /* 清楚查询条件 */
    handleReset (formName) {
      this.page = 1
      this.currPage = 1
      this.size = 10
      this.search.title = ''
      this.search.paperState = null
      this.initPagination(this.pagination)
      this.executeQueryPage()
    }
  }
}
</script>
<style lang='scss'>
@import '@/assets/qsms/css/self_common.scss';
/deep/ .el-button + .el-button {
  margin-left: 0;
}

.classifyDialogStyle,.alertDialogStyle {
  /deep/ .el-dialog {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    max-height: 80%;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-dialog__body {
      overflow: hidden;

      .el-form-item {
        display: inline-block;
        margin-top: 10px;
        margin-bottom: 0px;
      }
    }

    .el-dialog__footer {
      margin-bottom: 10px;

      .el-button {
        width: 70px;
        height: 38px;
      }

      .el-button + .el-button {
        margin-left: 15px;
      }
    }
  }

  .split {
    display: inline-block;
    line-height: 32px;
    margin: 0px 20px 0 10px;
  }
}
.alertDialogStyle{
  .title{
    text-align: center;
    background: url("../../../assets/qsms/img/notice.png") no-repeat 90px 30px;
    padding: 30px 0 50px 0;
  }
}
</style>
