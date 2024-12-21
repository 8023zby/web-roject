<template>
  <layout-aside>
    <div slot="aside">
      <class-tree @changed="setClassId"></class-tree>
    </div>
    <layout slot="main" v-loading="loading">
      <div slot="query" class="query-items">
        <!-- 查询条件 -->
        <el-form :inline="true" :model="search_form" ref="search_form">
          <!--<el-form-item label="所属分类:" prop="signClassifyId">-->
            <!--<el-select-->
              <!--v-model="search_form.signClassifyId"-->
              <!--placeholder="全部"-->
              <!--clearable-->
              <!--autocomplete="off"-->
            <!--&gt;-->
              <!--<el-option label="全部" value=""></el-option>-->
              <!--<el-option-->
                <!--v-for="(item, key) in sign_config_classify"-->
                <!--:label="item.signClassifyName"-->
                <!--:value="item.signClassifyId"-->
                <!--:key="key"-->
              <!--&gt;</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="体征项名称:" prop="signItemName">
            <el-input
              v-uni="'tizhengxiang_search_tizhengxiangmingcheng'"
              clearable
              v-model="search_form.signItemName"
              placeholder="请输入"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="出入项:" prop="signInOutType">
            <el-select
              v-uni="'tizhengxiang_search_churuxiang'"
              v-model="search_form.signInOutType"
              placeholder="全部"
              clearable
              autocomplete="off"
            >
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(value, key) in sign_config.inout_item"
                :label="value"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="汇总项:" prop="signSummaryType">
            <el-select
              v-uni="'tizhengxiang_search_huizongxiang'"
              v-model="search_form.signSummaryType"
              placeholder="全部"
              clearable
              autocomplete="off"
            >
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(value, key) in sign_config.gather_item"
                :label="value"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 18px;">
            <el-button
              v-uni="'tizhengxiang_search'"
              type="primary"
              icon="el-icon-search"
              @click="searchForm()"
            >搜索
            </el-button>
            <el-button v-uni="'tizhengxiang_reset'" type="text" @click="resetForm()" style="margin-left: 0"
            >重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="left_btn" class="tool-bar">
        <el-button type="warning" icon="el-icon-plus" @click="itemAdd(null)" v-checkAuth="'addSignItem'"
        >添加
        </el-button>
      </div>
      <div slot="main" class="main-list">
        <el-table
          :data="item_data"
          highlight-current-row
          style="width: 100%"
          height="100%"
          ref="table1"
          stripe
        >
          <!-- <el-table-column type="index" label="序号" width="100" align="center">
            <template slot-scope="scope">
              <span>{{(search_form.page - 1) * search_form.size + (scope.$index + 1)}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="signClassifyName"
            label="所属分类"
            min-width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="signItemName"
            label="体征项名称"
            min-width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="signItemShowName"
            label="显示名称"
            min-width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="signItemUnit"
            label="单位"
            min-width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="parentSignItemName"
            label="上级关联项"
            min-width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="signItemFieldName"
            label="字段名称"
            show-overflow-tooltip
            min-width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="signItemFieldType"
            label="字段类型"
            show-overflow-tooltip
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              {{sign_config.sign_item_field_type[scope.row.signItemFieldType] || ""}}
            </template>
          </el-table-column>
          <el-table-column
            prop="signItemFieldLength"
            label="字段长度"
            show-overflow-tooltip
            min-width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="signInOutType"
            label="是否为出入项"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              {{sign_config.inout_item[scope.row.signInOutType] || ""}}
            </template>
          </el-table-column>
          <el-table-column
            prop="signSummaryType"
            label="是否为汇总项"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              {{sign_config.gather_item[scope.row.signSummaryType] || ""}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center"
                           v-if="checkAuth('editSignItem,deleteSignItem')"
          >
            <template slot-scope="scope" v-if="scope.row.operateFlag !=0">
              <template v-if="scope.row.operateFlag ===1">
                <el-button v-uni:[scope.$index]="'tizhengxiang_edit'" @click="itemEdit(scope.row)" type="text" v-checkAuth="'editSignItem'"
                >编辑
                </el-button>
                <el-button v-uni:[scope.$index]="'tizhengxiang_delete'" type="text" disabled v-checkAuth="'deleteSignItem'"
                >删除
                </el-button>
              </template>
              <template v-else>
                <el-button v-uni:[scope.$index]="'tizhengxiang_edit'" @click="itemEdit(scope.row)" type="text" v-checkAuth="'editSignItem'"
                >编辑
                </el-button>
                <el-button v-uni:[scope.$index]="'tizhengxiang_delete'" type="textred" @click="itemDeleteSelect(scope.row)" v-checkAuth="'deleteSignItem'"
                >删除
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div slot="footer" class="page-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page_current"
          :page-size="search_form.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total"
        >
        </el-pagination>
      </div>
      <template>
        <!--体征关联项对话框-->

        <el-dialog
          title="下级关联提示"
          :visible.sync="signDialogVisible"
          width="490px"
          custom-class="signDialogCss"
          :show-close="false"
        >
          <div class="alert_content">
            <div style="margin-bottom: 10px;">该体征项存在下级关联体征项，无法删除:</div>
            <div
              v-for="(item,index) in signItems"
              :key="index"
              class="itemCss"
            >{{item+';'}}</div>
            <div>请取消关联关系，再进行删除操作。</div>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="signDialogVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
        <!--表单关联项对话框-->
        <el-dialog
          title="关联提示"
          :visible.sync="signFormDialogVisible"
          width="490px"
          custom-class="signDialogCss"
          :show-close="false"
        >
          <div class="alert_content">
            <div style="margin-bottom: 10px;">该体征项已关联以下表单，无法删除:</div>
            <div
              v-for="(item,index) in signItems"
              :key="index"
              class="itemCss"
              v-if="index < 3"
            >{{item+';'}}</div>
            <div style="margin:5px 0 10px 0;" v-if="signItems.length>3">......</div>
            <div>请取消与表单的关联后，再进行删除操作。</div>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="signFormDialogVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
      </template>
    </layout>
  </layout-aside>
</template>

<script>
import moduleMixin from '../../../assets/nrms/mixins/moduleMixin'
import classTree from './ClassTree'
import layoutAside from '../../../components/nrms/layout/aside'
import layout from '../../../components/nrms/layout/list'
import { sign as sign_config } from '../../../assets/nrms/common/item_config'
import { ApiSignItem, ApiSignClassify } from '../../../api/nrms/index'
export default {
  name: 'sign_item_list',
  mixins: [moduleMixin],
  data () {
    return {
      sign_config,
      loading: false,
      signDialogVisible: false, // 体征关联项弹框
      signFormDialogVisible: false, // 表单关联弹窗
      page_current: 1,
      page_total: 0,
      item_data: [],
      sign_config_classify: [], // 体征项分类
      signItems: [], // 关联体征项
      // 查询表单
      search_form: {
        signClassifyId: '',
        signItemName: '',
        signInOutType: '',
        signSummaryType: '',
        size: 10,
        page: 1
      },
      multipleSelection: []
    }
  },
  created () {
    // 获取体征项分类
    this.getSignClassifyData()
    // 获取数据
    this.getSignItemData()
  },
  activated () {
    this.getSignItemData()
    this.reload()
  },
  methods: {
    reload () {
      this.$nextTick(function () {
        this.$refs.table1.doLayout()
      })
    },
    setClassId (id) {
      this.search_form.signClassifyId = id
      this.searchForm()
    },
    getSignItemData () {
      this.loading = true
      ApiSignItem.select(this.search_form)
        .then(res => {
          let list = res.data.list || []
          this.item_data = []
          for (let i = 0; i < list.length; i++) { // 循环最外层
            let nList = list[i]
            let item = {}
            let parentItem = nList['parentSignItem'] || {}
            item = { ...nList }
            item['parentSignItemName'] = parentItem['signItemName']
            this.item_data.push(item)
          }
          this.page_total = res.data.total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 获取体征项分类
    getSignClassifyData () {
      ApiSignClassify.select().then(res => {
        this.sign_config_classify = res.data || []
      })
    },
    searchForm () {
      this.handleCurrentChange(1)
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    itemAdd () {
      this.itemEdit({ signClassifyId: this.search_form.signClassifyId })
    },
    itemEdit (row) {
      this.$emit('option-changed', 'sign_item_add', this.sign_config_classify, row)
    },
    itemDeleteSelect (row) {
      ApiSignItem.delete({ signId: row.signId, isDelete: false })
        .then(() => {
          this.itemDelete(row)
        })
        .catch(res => {
          // 如果体征项应用到了表单，需要提示
          // desc 能解析就是应用了，desc中带有数据
          try {
            const data = JSON.parse(res.desc)
            this.getRelationItems(data)
          } catch (e) {
            this.$message.error(res.message)
          }
        })
    },
    itemDelete (row) {
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiSignItem.delete({ signId: row.signId, isDelete: true })
          .then(() => {
            this.$message.success('删除成功！')
            this.getSignItemData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    // 获取删除时关联项或表单
    getRelationItems (res) {
      let resDesc = res.desc
      if (resDesc === '下级关联项') {
        let list = res.dataList || []
        this.signItems = []
        for (let i = 0; i < list.length; i++) {
          let signName = list[i]['signItemName']
          this.signItems.push(signName)
        }
        this.signDialogVisible = true
      } else if (resDesc === '表单关联项') {
        // 表单关联项
        let list = res.dataList || []
        this.signItems = []
        for (let i = 0; i < list.length; i++) {
          let formName = list[i]['formName']
          this.signItems.push(formName)
        }
        this.signFormDialogVisible = true
      }
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getSignItemData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getSignItemData()
    }
  },
  components: {
    layout,
    layoutAside,
    classTree
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
</style>
<style lang="scss" type="text/scss">
  .signDialogCss{
    .alert_content{
      width: 80%;
      margin: 0 auto;
    }
    .el-dialog__footer{
      padding: 0 20px 20px 20px;
    }
  }
</style>
