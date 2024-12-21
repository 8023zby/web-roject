<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item prop="templateType" label="模板类型">
          <el-select v-model="search_form.templateType" @change="searchForm" placeholder="请选择">
            <el-option v-for="(key, value) in templateType" :label="key.name" :value="key.value" :key="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="templateName" label="模板名称">
          <el-input v-model="search_form.templateName" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchForm()" v-uni="'mubanshezhi_search'">搜索</el-button>
          <el-button type="text" @click="resetForm()" v-uni="'mubanshezhi_reset'">重置 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" icon="el-icon-plus" @click="labelAdd(null)" v-uni="'mubanshezhi_add'">添加</el-button>
    </div>

    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table ref="table" :data="label_data" :row-key="getRowKeys" stripe height="100%">
        <!-- <el-table-column type="index" label="序号" width="100">
          <template slot-scope="scope">
            <span>{{
              (search_form.page - 1) * search_form.size + (scope.$index + 1)
            }}</span>
          </template>
        </el-table-column> -->

        <el-table-column prop="templateType" label="模板类型" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.templateType === 1 ? "触屏版" : "遥控器版" }}
          </template>
        </el-table-column>

        <el-table-column prop="templateName" label="模板名称" min-width="110" align="center"></el-table-column>

        <el-table-column prop="navStyleName" label="导航样式" min-width="110" align="center">
        </el-table-column>
        <el-table-column prop="menuPage" label="菜单页面" min-width="110" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip align="center"></el-table-column>

        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="copyData(scope.row)" type="text" v-uni:[scope.row.templateId]="'mubanshezhi_copy'" :key="'copy' + scope.row.templateId">复制
            </el-button>
            <el-button @click="labelAdd(scope.row)" type="text" :disabled="scope.row.initTag === 0 ? true : false" v-uni:[scope.row.templateId]="'mubanshezhi_edit'" :key="'edit' + scope.row.templateId">编辑</el-button>
            <el-button type="textred" @click="labelDelete(scope.row)" :disabled="scope.row.initTag === 0 ? true : false" v-uni:[scope.row.templateId]="'mubanshezhi_delete'" :key="'delete' + scope.row.templateId">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page_current" :page-size="search_form.size" layout="total, sizes, prev, pager, next, jumper" :total="page_total">
      </el-pagination>
    </div>
  </layout>
</template>

<script>
import layout from '../../../../components/bnms/layout/list'
import { ModelSetApi } from '../../../../api/bnms/index'

export default {
  name: 'kanban_list',
  data () {
    return {
      templateType: [
        {
          name: '全部',
          value: null
        },
        {
          name: '触屏版',
          value: 1
        },
        {
          name: '遥控器版',
          value: 0
        }
      ],
      loading: false,
      page_current: 1,
      page_total: 0,
      label_data: [],
      delete_visible: false,
      delete_used_depts: [],
      curDeleteRow: {},
      // 搜 索表单
      search_form: {
        templateType: null,
        templateName: '',
        size: 10,
        page: 1
      },
      navData: []
    }
  },
  created () {

  },
  activated () {
    this.getLabelData()
  },
  methods: {
    copyData (row) { // 复制
      ModelSetApi.oneModelSetList({ templateId: row.templateId }).then((res) => {
        delete res.data['updateDate']
        delete res.data['createDate']
        delete res.data['creator']
        delete res.data['modify']
        delete res.data['status']
        delete res.data['templateId']

        res.data.pages.map((v) => {
          v['operFlag'] = 1 // 复制相当于添加，operFlag应为1
          delete v['id']
        })

        res.data.templateName = res.data.templateName + '副本'
        this.$emit('changed', 'add', res.data)
      }).catch((res) => {
        this.$message.error(res.message)
      })
    },
    getLabelData () {
      this.loading = true
      ModelSetApi.modelSetList(this.search_form)
        .then((res) => {
          res.data = res.data || { list: [], total: 0 }
          // 处理菜单页面===拼接多菜单
          res.data.list = res.data.list.map((v) => {
            if (v.pages && v.pages.length > 0) {
              let _v = []
              for (let one of v.pages) {
                _v.push(one.menuName)
              }
              v.menuPage = _v.join('/')
            }
            return v
          })

          this.label_data = res.data.list

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
    labelAdd (row) {
      if (row === null) {
        this.$emit('changed', 'add', row)
      } else {
        ModelSetApi.oneModelSetList({ templateId: row.templateId }).then((res) => {
          this.$emit('changed', 'add', res.data)
        }).catch((res) => {
          this.$message.error(res.message)
        })
      }
    },
    labelDelete (row) {
      this.curDeleteRow = row
      // 验证是否已关联科室设备
      this.labelDeleteBefore()
    },
    labelDeleteDo () {
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ModelSetApi.delModelSet({ templateId: this.curDeleteRow.templateId })
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
      }).catch(() => {

      })
    },
    labelDeleteBefore () {
      ModelSetApi.checkDelModelSet({ templateId: this.curDeleteRow.templateId })
        .then((res) => {
          // 处理返回数据，将 deviceList 为空的数据直接删除，为了方便后续逻辑处理
          let _newData = []
          if (res.data && res.data.length > 0) {
            for (let item of res.data) {
              if (item.deviceList.length !== 0) {
                _newData.push(item)
              }
            }
          }

          if (_newData.length > 0) {
            let _html = ''

            _html = '<div style="text-align: left;"><strong>该模板已应用到以下科室设备，无法进行删除。</strong><br />'
            for (let [index, one] of new Map(_newData.map((item, i) => [i, item]))) {
              _html += '<span style="margin-left: 25px;">' + one.deptName + ':'
              let _tHtml = ''
              for (let two of one.deviceList) {
                _tHtml += two.deviceName + ','
              }
              _html += _tHtml.substring(0, _tHtml.length - 1)
              _html += '</span><br />'

              if (index >= 2) {
                _html += '<span style="margin-left: 25px;">......</span><br />'
                break
              }
            }

            _html += '</div>'

            this.$alert(_html + '请先取消模板在科室应用，再进行删除操作。', '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '关闭'
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
  },
  components: {
    layout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";
/deep/.el-table th > .cell {
  padding-left: 30px;
}

/deep/.el-table .cell {
  padding-left: 30px;
}
</style>
