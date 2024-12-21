<template>
  <layout_aside v-loading="loading">
    <div slot="aside">
      <check_classify_list @getClissfyItem="getClissfyItem" ref="classifyList"/>
    </div>
    <div slot="main">
      <layout_list>
        <div slot="query" class="query-items">
          <el-form v-uni="'jianchaxiangmu_form'" class="demo-form-inline" ref="search_form" :inline="true" :model="search_form"
                   label-suffix="：" label-width="120px">
            <el-form-item label="检查项目代码" prop="crisisCode">
              <el-input
                      v-uni="'jianchaxiangmu_daima'"
                placeholder="请输入"
                v-model="search_form.crisisCode"
                clearable></el-input>
            </el-form-item>
            <el-form-item label="检查项目名称" prop="crisisName">
              <el-input
                      v-uni="'jianchaxiangmu_mingcheng'"
                placeholder="请输入"
                v-model="search_form.crisisName"
                clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-uni="'jianchaxiangmu_search'" type="primary" class="el-button-radius btn-position" icon="el-icon-search"
                         @click="getData()"
                         size="small">搜索
              </el-button>

              <el-button v-uni="'jianchaxiangmu_reset'" type="text" @click="reset" style="margin-left: 0">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div slot="left_btn" class="tool-bar">
          <el-button v-uni="'jianchaxiangmu_add'" type="warning" icon="el-icon-plus" @click="itemAdd(null)" v-checkAuth="'addDangerDict'"
          >添加
          </el-button>
        </div>
        <div slot="right_btn" class="tool-bar">
          <el-button v-uni="'jianchaxiangmu_import'" type="primary" @click="openImportDialog" v-checkAuth="'importDangerDict'">导入</el-button>
          <el-button v-uni="'jianchaxiangmu_export'" type="primary" @click="exportExcel" v-checkAuth="'exportDangerDict'">导出
          </el-button>
        </div>
        <div slot="main" class="main-list">
          <el-table ref="table" highlight-current-row :data="tableData" height="100%"
                    :row-style="{height:'44px'}" stripe>
            <!-- <el-table-column type="index" label="序号" align="center" width="120">
              <template slot-scope="scope">
                {{(search_form.page - 1) * search_form.size +
                scope.$index + 1}}
              </template>
            </el-table-column> -->
            <el-table-column align="center" prop="crisisCode" label="检查项目代码" min-width="200px">
            </el-table-column>
            <el-table-column align="center" prop="crisisName" label="检查项目名称" min-width="200px">
            </el-table-column>
            <el-table-column align="center" prop="crisisShowName" label="显示名称" min-width="200px">
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip>
              <template slot="header" slot-scope="scope">项目备注</template>
              <template slot-scope="scope">
                {{scope.row.crisisNote}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200" align="center" v-if="checkAuth('editDangerDict,deleteDangerDict')">
              <template slot-scope="scope">
                <el-button
                        v-uni:[scope.row.crisisDictId]="'jianchaxiangmu_edit'"
                  type="text"
                  @click="itemAdd(scope.row)"
                  v-checkAuth="'editDangerDict'"
                >编辑
                </el-button>
                <el-button
                        v-uni:[scope.row.crisisDictId]="'jianchaxiangmu_delete'"
                  type="textred"
                  @click="itemDelete(scope.row)"
                  v-checkAuth="'deleteDangerDict'"
                >删除
                </el-button>
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
            :page-sizes="[10,20, 30, 40,50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page_total"
          >
          </el-pagination>
        </div>
      </layout_list>
    </div>
    <!--导入弹窗-->
    <template>
      <el-dialog
        title="导入"
        :visible.sync="importDialogVisible"
        width="490px"
        :show-close="false"
        :close-on-click-modal="false"
        custom-class="importDialogStyle">
        <div class="flexContent">
          <el-upload
            ref="upload"
            action="nrms/web-nr/crisis-dict/import"
            :show-file-list="false"
            :on-change="tirggerFile"
            :multiple="false"
            :on-success="uploadSuccess"
            :limit="1"
            :auto-upload="false"
            :data="{importType:'INSPECT_IMPORT'}"
          >
            <div slot="trigger" class="file">
              <div style="width: 50px;">文件：</div>
              <el-input
                      v-uni="'jianchaxiangmu_selectFileName'"
                placeholder=""
                autocomplete="off"
                readonly
                v-model="fileName"
              ></el-input>
              <el-button v-uni="'jianchaxiangmu_selectFile'" size="small" style="margin-left: 12px;" type="primary"
              >选取文件
              </el-button>
            </div>
            <div class="process" v-show="progressShow">
              <el-progress v-uni="'jianchaxiangmu_progress'" :percentage="percentage"
                           :show-text="false"></el-progress>
            </div>
            <div slot="tip" class="limitText">支持文件格式EXCEL,文件不能超过5MB。<a
              href="/resource/zhhl_crisis/检查项目导入模板.xlsx">下载导入模板</a></div>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'jianchaxiangmu_cancel'" @click="close">取消</el-button>
          <el-button v-uni="'jianchaxiangmu_importFile'" type="primary" @click="importFiles">导入</el-button>
      </span>
      </el-dialog>
    </template>
    <!--导入报错弹窗-->
    <template>
      <el-dialog
        title="导入"
        :visible.sync="importErrorDialogVisible"
        width="490px"
        :show-close="false"
        :close-on-click-modal="false"
        custom-class="importErrorDialogStyle">
        <div v-html="importErrorMessage" style="padding: 0 20px;"></div>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'jianchaxiangmu_close'" type="primary" @click="closeErrorDialog">关闭</el-button>
      </span>
      </el-dialog>
    </template>
  </layout_aside>
</template>

<script>
import moduleMixin from '../../../assets/nrms/mixins/moduleMixin'
import layout_aside from '../../../components/nrms/layout/aside'
import layout_list from '../../../components/nrms/layout/list'
import check_classify_list from './checkClassifyList'
import { ApiDangerDictionary } from '../../../api/nrms'

export default {
  name: 'List',
  mixins: [moduleMixin],
  data () {
    return {
      loading: false,
      tableData: [],
      // 分类信息
      clissfyItem: {},
      // 查询表单
      search_form: {
        crisisClassId: '',
        crisisCode: '',
        crisisName: '',
        crisisType: '1',
        size: 10,
        page: 1
      },
      page_current: 1,
      page_total: 1,
      importDialogVisible: false, // 导入弹窗
      importErrorDialogVisible: false, // 导入报错弹窗
      importErrorMessage: '',
      file: {},
      fileName: '',
      progressId: '',
      percentage: 0,
      progressShow: false,
      clearT: ''
    }
  },
  watch: {},
  activated () {
    this.getData()
    this.reload()
  },
  methods: {
    reload () {
      this.$nextTick(function () {
        this.$refs.table.doLayout()
      })
    },
    getClissfyItem (item) {
      if (item) {
        this.clissfyItem = item
        this.search_form.crisisClassId = this.clissfyItem.crisisClassId
        this.getData()
      } else {
        this.clissfyItem = {}
        this.search_form.crisisClassId = ''
        this.getData()
      }
    },
    getData () {
      ApiDangerDictionary.select(this.search_form).then(res => {
        this.tableData = res.data.list || []
        this.page_total = res.data.total
      })
    },
    // 添加项目
    itemAdd (row) {
      this.$emit('option-changed', 'add', row, this.clissfyItem)
    },
    // 删除项目
    itemDelete (row) {
      let _row = JSON.parse(JSON.stringify(row))
      ApiDangerDictionary.deleteSelect({ crisisDictId: _row.crisisDictId, crisisType: '1' })
        .then((res) => {
          let result = res.data
          if (result) {
            // 为true时可以删除
            this.$confirm('确认要进行删除吗？', '删除', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
              ApiDangerDictionary.delete({ crisisDictId: _row.crisisDictId, crisisType: '1' })
                .then(() => {
                  this.$message.success('删除成功！')
                  this.getData()
                })
                .catch(res => {
                  this.$message.error(res.message)
                })
            })
          } else {
            this.$confirm('该检查项目与危急值设置关联，无法删除！', '删除', {
              showCancelButton: false,
              confirmButtonText: '关闭',
              type: 'warning',
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
            })
          }
        })
        .catch(res => {
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
    },
    reset () {
      this.$refs.search_form.resetFields()
      this.clissfyItem = {}
      this.search_form.crisisClassId = ''
      this.$refs.classifyList.rowSelected = -1
      this.$refs.classifyList.rowHover = -1
      this.handleCurrentChange(1)
    },
    openImportDialog () {
      this.importDialogVisible = true
      // 初始化上传实例
      ApiDangerDictionary.initUpload().then(res => {
        // 初始化成功
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    tirggerFile (file) {
      this.fileName = ''
      this.file = file
      if (!this.file) {
        this.$message.error('请选择文件！')
        return false
      }
      let size = Math.floor(this.file.size / 1024)
      if (size > 5 * 1024 * 1024) {
        this.$message.error('文件大小请控制在5M以内！')
        this.$refs.upload.clearFiles()
        return false
      }
      let fileName = this.file.name
      // 获取文件后缀名
      let fileTypeName = fileName.substring(
        fileName.lastIndexOf('.') + 1, fileName.length)
      if (fileTypeName !== 'xls' && fileTypeName !== 'xlsx') {
        this.$message.error('支持excel格式文件导入!')
        this.$refs.upload.clearFiles()
        return false
      }
      this.fileName = this.file.name
    },
    importFiles () {
      if (this.fileName == '') {
        this.$message.error('请选择文件！')
        return false
      }
      this.progressShow = true
      this.$refs.upload.submit()
    },
    exportExcel () {
      window.open('/nrms/web-nr/crisis-dict/inspenct-export?crisisClassId=' + this.search_form.crisisClassId + '&crisisCode=' + this.search_form.crisisCode + '&crisisName=' + this.search_form.crisisName + '&crisisType=1')
    },
    // 导入成功回调
    uploadSuccess (response, file) {
      console.log('response', response)
      this.progressId = response.data
      this.clearT = setInterval(() => {
        this.searchProgress(this.progressId)
      }, 1000)
    },
    searchProgress (res) {
      let _res = res // 查询的进度条ID
      ApiDangerDictionary.selectProgress({ progressId: _res }).then(res => {
        let data = res.data
        if (data.end && data.errorMsg) {
          this.percentage = data.progress || 0
          // clearInterval(this.clearT)
          if (data.progress === 100) {
            // 上传导入成功
            clearInterval(this.clearT)
            this.resetImportDialog()
            this.importDialogVisible = false
            this.$message.success(`导入成功，导入${data.total}条数据`)
            this.getData()
            this.$refs.classifyList.getClassifyData()
          } else {
            clearInterval(this.clearT)
            this.importErrorMessage = data.errorMsg
            this.importErrorDialogVisible = true
            this.$refs.upload.clearFiles()
          }
        } else {
          this.percentage = data.progress || 0
        }
      }).catch(res => {
        clearInterval(this.clearT)
        this.$message.error(res.message)
      })
    },
    close () {
      this.resetImportDialog()
      clearInterval(this.clearT)
      // 上传过程中 点击弹框取消按钮 则中断上传
      if (this.progressId) {
        ApiDangerDictionary.cancelUpload({ progressId: this.progressId }).then(res => {
          // 初始化成功
        }).catch(res => {
          this.$message.error(res.message)
        })
      }
      this.importDialogVisible = false
    },
    closeErrorDialog () {
      this.resetImportDialog()
      this.importErrorDialogVisible = false
      this.importDialogVisible = false
    },
    resetImportDialog () {
      this.file = {}
      this.fileName = ''
      this.percentage = 0
      this.progressShow = false
      this.$refs.upload.clearFiles()
      this.importErrorMessage = ''
    }
  },
  components: {
    check_classify_list, layout_aside, layout_list
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .right {
    position: relative;
  }

  .right /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }

  .right /deep/ .el-tabs__content {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    bottom: 0;

    > div {
      height: 100%
    }

    /deep/ .el-icon-date:before {
      content: "\E71F";
    }

    /deep/ .el-table--small td {
      padding: 0
    }
  }

  .report_detail {
    height: 100%;

    ul {
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      list-style: none;

      li {
        margin: 10px;
      }
    }
  }

  .multiline-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal !important;
    word-wrap: break-word;
  }

</style>
<style lang="scss" type="text/scss">
  .importDialogStyle {
    .el-dialog__body {
      .flexContent {
        display: flex;
        flex-direction: column;

        .file {
          display: flex;
          justify-items: center;
          align-items: center;

          .el-input {
            width: 300px;

            .el-input__inner {
              height: 34px;
            }
          }
        }

        .process {
          padding-left: 50px;
          margin-top: 8px;
          width: 300px;
        }

        .limitText {
          padding-left: 50px;
          margin-top: 5px;
          font-size: 12px;
          color: #8E8E8E;
          text-align: left;

          a {
            text-decoration: underline;
            color: #1E87F0;
          }
        }
      }
    }

    .el-dialog__footer {
      padding-top: 34px;
    }

  }
</style>
