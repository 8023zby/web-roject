<!--
  文件描述：引用问卷的组件
  创建时间：2021/9/13 10:49
  创建人：PCL
-->
<template>
    <div class="">
      <el-dialog :title="'选择问卷'"
                 :visible.sync="importDialog"
                 :close-on-click-modal=false
                 :close-on-press-escape=false
                 width="880px"
                 custom-class="importClass"
                 @close="closeDialog">
        <el-header height="auto" style="background: none;">
          <div class>
            <div class="query-items-container" ref="query_form">
              <slot name="query">
                <el-form ref="search" :inline="true" :model="search" class="search">
                  <el-form-item label="问卷标题:" prop="title">
                    <el-input v-model="search.title" placeholder="请输入" />
                  </el-form-item>
                  <el-form-item>
                    <div class="typt-search-btn">
                      <el-button type="primary" icon="el-icon-search" class="el-button-radius" @click="querySea">搜索</el-button>
                      <el-button type="text" @click="handleList()">重置</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </slot>
            </div>
          </div>
        </el-header>

        <el-main style="height: 550px;padding-top: 0;">
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
                <!-- <el-table-column type="index" label="序号" width="100" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.$index+( pagination.page - 1) *pagination.size + 1 }}</span>
                  </template>
                </el-table-column> -->
                <el-table-column label="问卷标题" prop="title" />
                <el-table-column label="状态" prop="paperState" width="100" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.paperState == 1">启用</span>
                    <span v-else>停用</span>
                  </template>
                </el-table-column>

                <el-table-column label="创建时间" prop="createTime" align="center" />
                <el-table-column label="操作" width="100" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="toUse(scope.row, true)">引用</el-button>
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
              class="use-question-conmonent"
            />
          </slot>
        </el-footer>
      </el-dialog>
    </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import { fetchQsmsList } from '@/api/qsms/qsmsManage/qsmsManage'
import Pagination from '@/components/qsms/paginations/pagination'
import BaseQueryPageForm from '../common/BaseQueryPageForm'
export default {
  name: 'useQuestion',
  // import引入的组件需要注入到对象中才能使用
  components: {
    Pagination
  },
  props: {
    nurseUnitId: {
      type: String || Number,
      default: () => {
        return 0
      }
    }
  },
  mixins: [BaseQueryPageForm],
  data () {
    // 这里存放数据
    return {
      importDialog: false,
      reDataJson: [],
      yh_loading: false,
      // 查询字段
      search: {
        title: '',
        questionType: ''
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 方法集合
  methods: {
    init () {
      this.importDialog = true
      this.handleList()
    },
    closeDialog () {
      this.importDialog = false
    },
    executeQueryPage () {
      this.yh_loading = true
      fetchQsmsList({
        size: this.pagination.size,
        page: this.pagination.page,
        nurseUnitId: this.nurseUnitId,
        ...this.search
      }).then(response => {
        this.queryResultHandler(response)
      }).finally(() => {
        this.yh_loading = false
      })
    },
    querySea () {
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },
    toUse (importData, importIs) {
      this.$emit('toUse', importData, importIs)
      this.closeDialog()
    },
    handleList () {
      this.search = {
        title: '',
        questionType: ''
      }
      this.querySea()
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () {
  }, // 生命周期 - 创建之前
  beforeMount () {
  }, // 生命周期 - 挂载之前
  beforeUpdate () {
  }, // 生命周期 - 更新之前
  updated () {
  }, // 生命周期 - 更新之后
  beforeDestroy () {
  }, // 生命周期 - 销毁之前
  destroyed () {
  }, // 生命周期 - 销毁完成
  activated () {
  } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style scoped lang="scss">
    //@import url(); 引入公共css类
  .use-question-conmonent{
    text-align: center;
  }
</style>
