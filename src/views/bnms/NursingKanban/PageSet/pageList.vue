<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form
        ref="search_form"
        :inline="true"
        :model="search_form"
        label-suffix=":"
      >
        <el-form-item prop="pageType" label="页面类型">
          <el-select
            v-model="search_form.pageType"
            placeholder="请选择"
            @change="searchForm"
          >
            <el-option
              v-for="(key, value) in pageType"
              :key="value"
              :label="key.name"
              :value="key.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="pageName" label="页面名称">
          <el-input
            v-model="search_form.pageName"
            placeholder="请输入"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchForm()" v-uni="'yemianshezhi_search'">搜索</el-button>
          <el-button type="text" @click="resetForm()" v-uni="'yemianshezhi_reset'">重置 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" icon="el-icon-plus" @click="labelAdd(null)" v-uni="'yemianshezhi_add'">添加</el-button>
    </div>

    <!-- 表格 -->
    <div slot="main" class="main-list picList">
      <el-table
        ref="table"
        :data="label_data"
        :row-key="getRowKeys"
        stripe
        class="manTable"
        height="100%"
      >
        <!-- <el-table-column type="index" label="序号" width="100">
          <template slot-scope="scope">
            <span>{{
              (search_form.page - 1) * search_form.size + (scope.$index + 1)
            }}</span>
          </template>
        </el-table-column> -->

        <el-table-column
          prop="pageType"
          label="页面类型"
          min-width="110"
        >
          <template slot-scope="scope">
            {{ scope.row.pageType === 1 ? "触屏版" : (scope.row.pageType === 2 ? "遥控器版" : '通用') }}
          </template>
        </el-table-column>

        <el-table-column
          prop="pageName"
          label="页面名称"
          min-width="110"
        />

        <el-table-column
          prop="contentType"
          label="链接内容"
          min-width="110"
        >
          <template slot-scope="scope">
            {{ scope.row.contentType === 1 ? "内部链接" : (scope.row.contentType === 3 ? "外部链接" : '链接图片') }}
          </template>
        </el-table-column>

        <el-table-column
          prop="content"
          label="URL地址"
          min-width="110"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.contentType === 1 || scope.row.contentType === 3">{{ scope.row.content }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="thumbnailUrl"
          label="链接图片"
          min-width="110"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.contentType === 2">{{ scope.row.thumbnailUrl }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="thumbnailUrl"
          label="缩略图"
          min-width="110"
        >
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.initTag === 0"
              style="width: 62px;height: 35px;"
              :src="'/static/bnms/img/kanban/pageThumb/' + scope.row.thumbnailUrl"
              fit="contain"
              :preview-src-list="['/static/bnms/img/kanban/page/' + scope.row.thumbnailUrl]"
            />
            <el-image v-else-if="scope.row.thumbnailUrl" style="width: 62px;height: 35px" :src="scope.row.thumbnailUrl" :preview-src-list="[scope.row.thumbnailUrl]" />
            <el-image v-else style="width: 62px; height: 35px" :src="blockImg" />
          </template>
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注"
          min-width="80"
          show-overflow-tooltip
        />

        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button v-if="(scope.row.content === '/theme1/home' || scope.row.content === '/theme1/homenew') && scope.row.initTag" type="text" @click="labelAdd(scope.row,'layout','touch')" v-uni:[scope.row.pageId]="'yemianshezhi_layout_edit'" :key="'layout_edit' + scope.row.pageId">布局修改</el-button>
            <el-button v-else-if="scope.row.content === '/theme0/home' && scope.row.initTag" type="text" @click="labelAdd(scope.row,'layout','yao')" v-uni:[scope.row.pageId]="'yemianshezhi_layout_edit'" :key="'layout_edit' + scope.row.pageId">布局修改</el-button>
            <el-button v-else :disabled="true" type="text" @click="labelAdd(scope.row,'layout','yao')" v-uni:[scope.row.pageId]="'yemianshezhi_layout_edit'" :key="'layout_edit' + scope.row.pageId">布局修改</el-button>
            <el-button type="text" :disabled="scope.row.initTag === 0 ? true : false" @click="labelAdd(scope.row)" v-uni:[scope.row.pageId]="'yemianshezhi_edit'" :key="'using' + scope.row.pageId">编辑</el-button>
            <el-button type="textred" :disabled="scope.row.initTag === 0 ? true : false" @click="labelDelete(scope.row)" v-uni:[scope.row.pageId]="'yemianshezhi_delete'" :key="'delete' + scope.row.pageId">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination
        :current-page.sync="page_current"
        :page-size="search_form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-drawer
      title="添加"
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      :with-header="false"
      :before-close="handleClose"
    >
      <add v-if="drawer" :cur-row="curRow" @closeDrawer="closeDrawer" />
    </el-drawer>

    <el-drawer
      title="布局修改"
      :visible.sync="drawerLayout"
      :direction="direction"
      size="27%"
    >
      <div slot="title" class="newTitle">布局修改</div>
      <firstLayout v-if="drawerLayout" ref="firstLayout" :cur-row="curRow" @closeDrawer="closeDrawer" @openDialog="openDialog" />
    </el-drawer>

    <el-dialog title="页面布局" :visible.sync="pageConfig" width="40%" :show-close="false" :close-on-click-modal="false">
      <firstLayoutConfig v-if="changePageType === 'touch' && pageConfig" :cur-row="curRow" :mod-layout="modLayout" @closeDialog="closeDialog" />
      <firstLayoutConfigYao v-else-if="changePageType === 'yao' && pageConfig" :cur-row="curRow" :mod-layout="modLayout" @closeDialog="closeDialog" />
    </el-dialog>
  </layout>
</template>

<script>
import layout from '../../../../components/bnms/layout/list'
import add from './pageAdd'
import firstLayout from './firstLayout'
import firstLayoutConfig from './firstLayoutConfig'
import firstLayoutConfigYao from './firstLayoutConfigYao'
import { PageSetApi } from '../../../../api/bnms/index'

export default {
  name: 'PageList',
  components: {
    layout,
    add,
    firstLayout,
    firstLayoutConfig,
    firstLayoutConfigYao
  },
  data () {
    return {
      changePageType: '',
      pageConfig: false,
      drawerLayout: false,
      blockImg: require('@/assets/bnms/images/icon_pic.png'),
      curRow: '',
      drawer: false,
      direction: 'rtl',
      pageType: [
        {
          name: '全部',
          value: ''
        },
        {
          name: '通用',
          value: 0
        },
        {
          name: '触屏版',
          value: 1
        },
        {
          name: '遥控器版',
          value: 2
        }
      ],
      loading: false,
      page_current: 1,
      page_total: 0,
      label_data: [],
      delete_visible: false,
      curDeleteRow: {},
      // 搜 索表单
      search_form: {
        pageType: '',
        labelType: '301',
        pageName: '',
        size: 10,
        page: 1
      },
      modLayout: {}
    }
  },
  created () {
    this.getLabelData()
  },
  activated () {
    this.getLabelData()
  },
  methods: {
    openDialog (data) {
      this.modLayout = data
      this.pageConfig = true
    },
    closeDialog (type) {
      if (type !== 'back') {
        this.$refs.firstLayout.getData()
      }

      this.pageConfig = false
    },
    closeDrawer () {
      this.drawer = false
      this.drawerLayout = false
      this.getLabelData()
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    getLabelData () {
      this.loading = true
      PageSetApi.pageSetList(this.search_form)
        .then((res) => {
          // 处理外部链接url解密
          this.label_data = res.data.list.map((item) => {
            if (item.contentType === 3) {
              item.content = item.content.replace('/common/url/', '')
              item.content = Buffer.from(item.content, 'base64').toString('utf-8')
            }

            return item
          })

          this.page_total = res.data.total
          this.loading = false
        })
        .catch((res) => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    searchForm () {
      this.handleCurrentChange(1)
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    labelAdd (row, type, pageType) {
      this.curRow = row
      if (type === 'layout') {
        this.drawerLayout = true
        this.changePageType = pageType
      } else {
        this.drawer = true
      }
    },
    labelDelete (row) {
      this.curDeleteRow = row
      // 验证是否已关联科室设备
      this.labelDeleteBefore()
    },
    labelDeleteDo () { // 执行删除数据
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        PageSetApi.delPageSet({ pageId: this.curDeleteRow.pageId })
          .then(() => {
            if (this.label_data.length === 1 && this.page_current > 1) {
              this.search_form.page = this.page_current - 1
            }
            this.$message.success('删除成功！')
            this.resetForm()
          })
          .catch((res) => {
            this.$message.error(res.message)
          })
      })
    },
    labelDeleteBefore () { // 删除数据的校验
      PageSetApi.checkDelPageSet({ pageId: this.curDeleteRow.pageId })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            let _html = ''
            if (res.data.length > 3) {
              _html = '<div style="text-align: left;">' +
                        '<strong>该页面已关联在以下模板，无法进行删除。</strong><br />' +
                        '<span style="margin-left: 25px;">' + res.data[0].templateName + '</span><br />' +
                        '<span style="margin-left: 25px;">' + res.data[1].templateName + '</span><br />' +
                        '<span style="margin-left: 25px;">' + res.data[2].templateName + '</span><br />' +
                        '<span style="margin-left: 25px;">......</span><br />' +
                      '</div>'
            } else {
              _html = '<div style="text-align: left;"><strong>该页面已关联在以下模板，无法进行删除。</strong><br />'
              for (const one of res.data) {
                _html += '<span style="margin-left: 25px;">' + one.templateName + '</span><br />'
              }
              _html += '</div>'
            }
            this.$alert(_html + '请先取消页面与模板的关联，再进行删除操作。', '提示', {
              customClass: 'alertStyle',
              dangerouslyUseHTMLString: true,
              confirmButtonText: '关闭'
            }).catch(() => {

            })
          } else {
            this.labelDeleteDo()
          }
        })
        .catch((res) => {
          this.$message.error(res.message)
        })
    },
    getRowKeys (row) {
      return row.labelId
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getLabelData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getLabelData()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";
  /deep/ :focus {
    outline: 0;
  }
  .picList {
    /deep/ tr:hover {
      transform: none !important;
    }
  }

/deep/.el-dialog {
  .el-dialog__body {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .el-form-item {
    margin-bottom: 15px;
  }

  .el-input__inner {
    height: 32px;
  }

  .el-form-item__label {
    height: 32px;
    line-height: 32px;
  }
}

/deep/.el-drawer__header {
  margin-bottom: 0px;
  padding: 0px;
  border-bottom: 1px solid #EEEEEE;
}

.newTitle {
  margin-bottom: 0px;
  padding: 23px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/deep/.el-drawer__close-btn {
  padding-right: 24px;
}
/deep/.el-table th>.cell {
  padding-left: 30px;
}

/deep/.el-table .cell {
  padding-left: 30px;
}
</style>

<style>
.el-message-box__wrapper .alertStyle .el-message-box__header {
  line-height: 0px;
}

.el-message-box__wrapper .alertStyle .el-message-box__header .el-message-box__headerbtn {
  top: 15px;
}
</style>
