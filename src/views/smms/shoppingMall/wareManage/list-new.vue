<!--
  文件描述：基于新UI的list页面
    主样式class：list-page-new
  创建时间：2020/4/9 13:19
  创建人：Adsmallstrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
-->
<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true">
        <!--   查询条件 -->
        <el-form-item :label="`${shopTypeName}名称:`">
          <el-input v-model="search.title" :placeholder="`请输入${shopTypeName}名称`" size="small" />
        </el-form-item>
        <el-form-item :label="`${shopTypeName}分类:`">
          <el-select v-model="search.categoryId" placeholder="全部" size="small">
            <el-option value>全部</el-option>
            <el-option
              v-for="item in wareType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${shopTypeName}状态:`">
          <el-select v-model="search.shelfState" placeholder="全部" size="small">
            <el-option value>全部</el-option>
            <el-option
              v-for="item in wareState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <!--   按钮查询 -->
          <div class="typt-search-btn">
            <el-button
              type="primary"
              class="el-button-radius"
              icon="el-icon-search"
              @click="queryHandler"
              size="small"
            >搜索</el-button>
            <el-button type="text" class="el-button-radius" @click="clsHandler" size="small">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <!-- 添加 ,排序 按钮  -->
        <el-button
          type="warning"
          icon="el-icon-plus"
          @click="$emit('option-changed', 'addNew', { wareType: wareType })"
          size="small"
        >添加</el-button>
        <div class="action_div">
          <el-button
            type="primary"
            :disabled="pagination.list.length <= 0"
            @click="toSort()"
            size="small"
          >排序</el-button>
          <el-button
            v-for="(item, index) in btnData"
            :key="index"
            type="primary"
            @click="handlerButtons(`${item.value}`, `${item.msg}`)"
            size="small"
          >{{ item.key }}</el-button>
        </div>
      </div>
      <!--列表-->
      <!-- table -->
      <el-table
        v-loading="yh_loading"
        :data="pagination.list"
        style="width: 100%"
        height="80%"
        select-all
        stripe
        @select="handleSelect"
        @select-all="handleALL"
      >
        <el-table-column type="selection" width="55" sortable />
        <el-table-column prop="sortIndex" align="center" label="序号" width="60">
          <template slot-scope="scope">
            <span>
              {{
              (pagination.page - 1) * pagination.size + scope.$index + 1
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="`${shopTypeName}名称`" prop="title" align="center" />
        <el-table-column
          :label="`${shopTypeName}分类`"
          prop="categoryId"
          :formatter="wareTypeFormatter"
          align="center"
        />
        <el-table-column label="价格" prop="listprice" align="center" />
        <el-table-column label="库存" prop="listkucun" align="center"></el-table-column>
        <el-table-column
          :label="`${shopTypeName}状态`"
          prop="shelfState"
          :formatter="shelfStateType"
          align="center"
        />
        <el-table-column label="审核状态" prop="auditState" :formatter="auditStateType" align="center" />
        <el-table-column label="是否推荐" align="center">
          <template slot-scope="scope">
            <el-switch @change="recommendedChange(scope.row)" v-model="scope.row.isRecommend"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="280">
          <template slot-scope="scope">
            <span
              class="el-button-text-color"
              @click="$emit('option-changed', 'check', { row: scope.row })"
            >审核记录</span>
            <span
              class="el-button-text-color"
              @click="
                $emit('option-changed', 'addNew', {
                  wareType: wareType,
                  row: scope.row,
                })
              "
            >编辑</span>
            <span class="el-text-danger" @click="delHandler(scope.$index, scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!--组件页码显示-->
      <!-- 分页码 -->
      <pagination
        :pagination="pagination"
        @page-size-changed="pageSizeChangeHandler"
        @page-changed="pageChangeHandler"
      />
    </div>
    <!--新增房间对话框-->
    <!----排序------>
    <el-dialog
      custom-class="bedDialog"
      title="排序"
      :visible.sync="dialogSortVisible"
      width="780px"
      :close-on-click-modal="false"
      v-if="dialogSortVisible"
      @close="executeQueryPage"
    >
      <table-sort filedName="title" tit="商品名称" T="shopping"></table-sort>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import { deepMerge } from '@/assets/smms/utils'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as wareManageApi from '@/api/smms/shopingMall/wareManage'
import Pagination from '@/components/smms/paginations/pagination'

import tableSort from '@/components/smms/tableSort'

export default {
  name: 'list2',
  components: { Pagination, tableSort },
  mixins: [BaseQueryPageForm],
  inject: ['routerTo'],
  data () {
    // 这里存放数据
    const search = this.initQueryCriteria()
    return {
      yh_loading: false,
      shopTypeName: '商品', // 店铺类型
      sortable: null,
      oldList: [],
      newList: [],
      dialogSortVisible: false,
      selectID: [],
      search: search,
      selected: null,
      wareType: [],
      wareState: [
        {
          value: '1',
          label: '上架'
        },
        {
          value: '0',
          label: '下架'
        }
      ],
      btnData: [
        // { key: '排序', value: 'sort' },
        { key: '置满', value: 'Full', msg: '确定要置满吗？' },
        { key: '沽清', value: 'Clear', msg: '确定要沽清吗？' },
        { key: '上架', value: 'Top', msg: '确定要上架吗？' },
        { key: '下架', value: 'Down', msg: '确定要下架吗？' }
      ]
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    // // 判断店铺具备完整信息是否
    this.isCompleteInfo(true)
  },
  // 方法集合
  methods: {
    // 判断是否需要完善店铺信息
    isCompleteInfo (t) {
      const _this = this
      let shopImg = localStorage.getItem('shopInfo.img')
      let shopType = JSON.parse(localStorage.getItem('shopInfo.shopType'))
      if (Number(shopType) === 2) this.shopTypeName = '服务'

      if (
        shopImg === '' ||
        shopImg === null ||
        shopImg === undefined ||
        shopImg === 'null'
      ) {
        if (t) {
          _this.isWholeInfo((res) => {
            _this.isCompleteInfo(false)
          })
        } else {
          this.$alert('店铺信息缺失，请点击左侧店铺信息菜单，完善信息。', '', {
            confirmButtonText: '确定',
            callback: action => {
              this.routerTo('/shop')
            }
          })
        }
      } else {
        _this.executeQueryPage()
        _this.getCategory()
      }
    },
    /* 商家类型对照 */
    wareTypeFormatter (row, c) {
      for (let i = 0; i < this.wareType.length; i++) {
        if (Object.is(this.wareType[i].value, row.categoryId)) {
          return this.wareType[i].label
        }
      }
    },

    /*  状态对照 */
    auditStateType (row, c) {
      const Ctype = {
        '-1': '未发起审核',
        '0': '等待审核',
        '1': '审核通过',
        '2': '审核未过'
      }
      return Ctype[row.auditState]
    },
    /*  状态对照 */
    shelfStateType (row, c) {
      const Ctype = { 1: '上架', 0: '下架' }
      return Ctype[row.shelfState]
    },

    /* 获取分类 */
    getCategory () {
      wareManageApi
        .getCategoryList()
        .then(res => {
          this.IsSuccess(res, () => {
            res.data.forEach((value, index) => {
              this.wareType.push({
                value: value.id,
                label: value.categoryName
              })
            })
          }, false)
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取失败222'
          })
        })
    },
    /* 修改推荐状态 */
    recommendedChange (r) {
      let isRecommend = r.isRecommend
      r.isRecommend = !r.isRecommend
      wareManageApi
        .UpdateRecommend({
          id: r.id,
          isRecommend: (isRecommend ? 1 : 0)
        })
        .then(res => {
          this.IsSuccess(res)
        })
    },

    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        roleType: 1,
        title: '',
        shelfState: '',
        categoryId: ''
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      wareManageApi.getInfo(this.createQueryParams()).then(data => {
        this.IsSuccess(data, () => {
          this.queryResultHandler(data)
          for (let v of this.pagination.list.values()) {
            v.isRecommend === 0 ? v.isRecommend = false : v.isRecommend = true
          }
        }, false)
      }).finally(() => {
        this.yh_loading = false
      })
    },
    /* 列表删除 */
    customDelHandler (index, row) {
      wareManageApi.Delete(row.id).then(res => {
        this.IsSuccess(res)
        this.executeQueryPage()
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.executeQueryPage()
    },
    /* 全选 */
    handleALL (val) {
      this.handleSelect(val)
    },
    /*  获取当前选中的数据 */
    handleSelect (row) {
      this.selectID = []
      if (row.length > 0) {
        row.forEach((value, index) => {
          this.selectID.push(value.id)
        })
      }
    },

    /*  清楚查询条件 */
    handlerClear () {
      this.$router.push('wareFrom')
    },

    /* 按钮入口 */
    handlerButtons (T, msg) {
      if (this.selectID.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择要操作的列表'
        })
        return
      }

      this.submitData(T, msg)
    },
    //  按钮,置满,沽清,上架,下架
    handlerBtn (T) {
      switch (T) {
        case 'Full': // 置满
          wareManageApi.getFul(this.selectID).then(res => {
            this.selectID = []
            this.IsSuccess(res)
          })
          break
        case 'Clear': // 洁清
          wareManageApi.getEmpty(this.selectID).then(res => {
            this.selectID = []
            this.IsSuccess(res)
          })
          break
        case 'Top': // 上架
          wareManageApi
            .UpdateSort({
              ids: this.selectID,
              state: 1
            })
            .then(res => {
              this.selectID = []
              this.IsSuccess(res)
            })
          break
        case 'Down': // 下架
          wareManageApi
            .UpdateSort({
              ids: this.selectID,
              state: 0
            })
            .then(res => {
              this.selectID = []
              this.IsSuccess(res)
            })
          break
      }
    },
    // 排序
    toSort () {
      this.dialogSortVisible = true
    }

  }
}
</script>
<style lang='scss'>
@import '@/assets/smms/css/self_common.scss';
.bedDialog {
  .el-dialog__body {
    height: 500px;
  }
}
</style>
