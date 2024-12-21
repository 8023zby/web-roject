<template>
  <div style="height: 100%">
    <layout-list>
      <div slot="query" class="query-items">
        <el-form
          :inline="true"
          :model="searchForm"
          ref="searchForm"
          class="demo-form-inline"
        >
          <el-form-item label="开始时间:" prop="beginTime">
            <el-col :span="11">
              <el-date-picker
                v-model="searchForm.beginTime"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间:" prop="endTime">
            <el-col :span="11">
              <el-date-picker
                v-model="searchForm.endTime"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="类型:" prop="operationType">
            <el-input
              v-model="searchForm.typeStr"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="住院号:" prop="patientHospitalNo">
            <el-input
              v-model="searchForm.inpNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearchForm()"
              icon="el-icon-search"
              >搜索</el-button
            >
            <el-button type="text" @click="onResetForm('searchForm')"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="left-btn" slot="left_btn">
        <el-button type="warning" class="btn" @click="add">添加</el-button>
      </div>
      <div class="right-btn" slot="right_btn">
        <el-button type="primary" class="btn" @click="sort">排序</el-button>
        <el-button type="primary" class="btn" @click="importExcel"
          >批量导入</el-button
        >
        <el-button type="primary" class="btn" @click="exportExcel"
          >批量导出</el-button
        >
      </div>
      <div slot="main" class="main-list">
        <el-table :data="tableList" ref="table" stripe height="100%">
          <!-- <el-table-column
            type="index"
            align="center"
            label="序号"
            width="60"
            :index="indexMethod"
          ></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="手术日期"
            width="100"
            prop="operationDate"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="类型"
            prop="operationType"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="床位"
            prop="bedNo"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="住院号"
            width="90"
            prop="patientHospitalNo"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="姓名"
            prop="patientName"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="性别"
            prop="patientSex"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="年龄"
            prop="patientAge"
          ></el-table-column>
          <el-table-column
            align="center"
            label="病变/处理血管"
            width="270"
          >
            <template slot-scope="scope">
              <el-tooltip
                      placement="top"
                      effect="dark"
                      v-if="!showTips(250,scope.row,'operationHandle')"
                      :content="scope.row.operationHandle"
               >
                <div class='myNote'>{{scope.row.operationHandle}}</div>
              </el-tooltip>
              <div v-else class='myNote'>{{scope.row.operationHandle}}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="麻醉"
            prop="anesthesiaMode"
          ></el-table-column>
          <el-table-column
            align="center"
            label="化验"
            width="175"
          >
            <template slot-scope="scope">
              <el-tooltip
                      placement="top"
                      effect="dark"
                      v-if="!showTips(250,scope.row,'laboratory')"
                      :content="scope.row.laboratory"
               >
                <div class='myNote'>{{scope.row.laboratory}}</div>
              </el-tooltip>
              <div v-else class='myNote'>{{scope.row.laboratory}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="检查"
            width="175"
          >
            <template slot-scope="scope">
              <el-tooltip
                      placement="top"
                      effect="dark"
                      v-if="!showTips(250,scope.row,'inspect')"
                      :content="scope.row.inspect"
               >
                <div class='myNote'>{{scope.row.inspect}}</div>
              </el-tooltip>
              <div v-else class='myNote'>{{scope.row.inspect}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="体重/医保"
            width="175"
          >
            <template slot-scope="scope">
              <el-tooltip
                      placement="top"
                      effect="dark"
                      v-if="!showTips(250,scope.row,'weight')"
                      :content="scope.row.weight"
               >
                <div class='myNote'>{{scope.row.weight}}</div>
              </el-tooltip>
              <div v-else class='myNote'>{{scope.row.weight}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="备注"
            width="175"
          >
            <template slot-scope="scope">
              <el-tooltip
                      placement="top"
                      effect="dark"
                      v-if="!showTips(250,scope.row,'remark')"
                      :content="scope.row.remark"
               >
                <div class='myNote'>{{scope.row.remark}}</div>
              </el-tooltip>
              <div v-else class='myNote'>{{scope.row.remark}}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="操作"
            width="150"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <template>
                <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                <el-button type="textred" @click="delRecord(scope.row)"
                  >删除</el-button
                >
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="page-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="searchForm.page"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="searchForm.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </layout-list>
    <!-------- 批量导入 start -------->
    <el-dialog title="批量导入" :visible.sync="importVisible" width="490px">
      <div>
        <el-form
          ref="importForm"
          label-width="100px"
          class="typt-add-dialog"
          :rules="importRules"
          :model="importForm"
        >
          <el-form-item label="手术日期：" prop="date">
            <el-date-picker
              v-model="importForm.date"
              type="date"
              :clearable="false"
              style="width: 300px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="文件：" prop="file">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/nrms/web-nr/arrange/import"
              :data="{targetDate: getImportDate(importForm.date)}"
              :file-list="importForm.file"
              accept=".xls,.xlsx"
              :multiple="false"
              :on-change="handleChange"
              :auto-upload="false"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
            >
              <div class="upload-box">
                <div class="upload-box-btn">
                  <img src="../../../../public/static/bnms/img/icon_xzscwj.png" alt="" style="margin-right: 12px">
                  <span>选择上传文件</span>
                </div>
              </div>
            </el-upload>
            <div>
              <p style="font-size: 12px;color: #999;line-height: 1;margin-top: 8px;text-align: left">只可上传excel文件格式，大小限制为5M以内</p>
              <div v-if="importForm.file[0]" class="file-list">
                <img src="../../../../public/static/bnms/svg/icon-operation-file.svg" style="width: 30px" alt="">
                <span>
                  {{importForm.file[0].name}}
                </span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="importVisible = false">取消</el-button>
        <el-button type="primary" @click="importVisibleConfirm">确认</el-button>
      </div>
    </el-dialog>
    <!-------- 批量导入 end -------->

    <!-------- 批量导出 start -------->
    <el-dialog title="批量导出" :visible.sync="exportVisible" width="490px">
      <div>
        <el-form
          ref="exportForm"
          label-width="100px"
          class="typt-add-dialog"
          :rules="exportRules"
          :model="importForm"
        >
          <el-form-item label="手术日期：" prop="date">
            <el-date-picker
              v-model="exportForm.date"
              type="date"
              :clearable="false"
              style="width: 300px"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="exportVisileConfirm">确认</el-button>
      </div>
    </el-dialog>
    <!-------- 批量导出 end -------->
  </div>
</template>
<script>
import layoutList from '../../../components/bnms/layout/list'
import { ArrangeApi } from '../../../api/bnms/index'
const moment = require('moment')
export default {
  components: {
    layoutList
  },
  data () {
    return {
      searchForm: {
        beginTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        typeStr: '',
        inpNo: '',
        page: 1,
        size: 10
      },
      tableList: [],
      total: 0,
      /**
       * ------------------------------------------------------------------
       * 批量导入
       * ------------------------------------------------------------------
       */
      importVisible: false,
      importForm: {
        date: moment().format('YYYY-MM-DD'),
        file: []
      },
      importRules: {
        date: [
          { required: true, message: '请选择手术日期', trigger: 'change' }
        ],
        file: [{ required: true, message: '请上传文件', trigger: 'change' }]
      },
      /**
      * ------------------------------------------------------------------
      * 批量导出
      * ------------------------------------------------------------------
      */
      exportVisible: false,
      exportRules: {
        date: [
          { required: true, message: '请选择手术日期', trigger: 'change' }
        ]
      },
      exportForm: {
        date: moment().format('YYYY-MM-DD')
      },
      loading: null
    }
  },
  async mounted () {
    await this.getList()
  },
  methods: {
    /**
     * ------------------------------------------------------------------
     * 初始化
     * ------------------------------------------------------------------
     */
    /**
     * @description: 获取列表
     * @param {*}
     * @return {*}
     */
    async getList () {
      try {
        let res = await ArrangeApi.list(this.searchForm)
        this.tableList = res.data ? (res.data.list || []) : []
        this.total = res.data ? (res.data.total || 0) : []
      } catch (error) {}
    },
    // /**
    //  * @description: 序号
    //  * @param {*} index
    //  * @return {*}
    //  */
    // indexMethod (index) {
    //   return (this.searchForm.page - 1) * this.searchForm.size + index + 1
    // },
    /**
    * ------------------------------------------------------------------
    * 分页
    * ------------------------------------------------------------------
    */
    handleSizeChange (val) {
      this.searchForm.size = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.getList()
    },
    /**
     * ------------------------------------------------------------------
     * 筛选操作
     * ------------------------------------------------------------------
     */

    /**
     * @description: 筛选操作
     * @param {*}
     * @return {*}
     */
    onSearchForm () {
      this.getList()
    },
    /**
     * @description: 重置操作
     * @param {*}
     * @return {*}
     */
    onResetForm () {
      this.searchForm = {
        beginTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        typeStr: '',
        inpNo: '',
        page: 1,
        size: 10
      }
      this.getList()
    },
    /**
     * ------------------------------------------------------------------
     * 增删改查
     * ------------------------------------------------------------------
     */
    /**
     * @description: 添加操作
     * @param {*}
     * @return {*}
     */
    add () {
      this.$emit('option-changed', 'add', {})
    },
    /**
     * @description: 编辑
     * @param {*}
     * @return {*}
     */
    edit (row) {
      this.$emit('option-changed', 'add', { row })
    },
    /**
     * @description: 删除
     * @param {*}
     * @return {*}
     */
    async delRecord (row) {
      this.$confirm('是否确认删除该条手术?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(async () => {
        try {
          await ArrangeApi.del({ operationId: row.operationId })
          this.onResetForm()
        } catch (error) {
          this.$message.error(error.message)
        }
      }).catch(() => {

      })
    },

    /**
     * ------------------------------------------------------------------
     * 排序操作
     * ------------------------------------------------------------------
     */
    /**
     * @description: 排序
     * @param {*}
     * @return {*}
     */
    sort () {
      this.$emit('option-changed', 'sort')
    },
    /**
     * ------------------------------------------------------------------
     * 批量导入
     * ------------------------------------------------------------------
     */
    /**
     * @description: 批量导入
     * @param {*}
     * @return {*}
     */
    importExcel () {
      this.importVisible = true
    },
    /**
     * @description: 导入确认
     * @param {*}
     * @return {*}
     */
    importVisibleConfirm () {
      this.$refs['importForm'].validate(async valid => {
        if (valid) {
          this.$confirm('批量上传后会覆盖所选日期的手术安排，是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$refs.upload.submit()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          return false
        }
      })
    },
    // 上传文件让第二次覆盖第一的文件
    handleChange (file, fileList) {
      if (fileList.length > 0) {
        this.importForm.file = [fileList[fileList.length - 1]]
      }
    },
    async uploadSuccess (e) {
      this.loading.close()
      let res = e.data[0]
      if (res.type == '0') {
        this.$message.success(res.msg)
        this.importVisible = false
        await this.onResetForm()
        this.importForm = {
          date: moment().format('YYYY-MM-DD'),
          file: []
        }
        return
      }
      this.$message.error(res.msg)
    },
    // 格式化导入时间
    getImportDate (date) {
      return moment(date).format('YYYY-MM-DD')
    },

    beforeUpload (file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 5 // 这里做文件大小限制
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 xls、xlsx格式!',
          type: 'warning'
        })
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 5MB!',
          type: 'warning'
        })
        return false
      }
      this.loading = this.$loading({
        lock: true,
        background: 'rgba(255, 255, 255, 0.7)'
      })
      return (extension || extension2) && isLt2M
    },
    /**
     * ------------------------------------------------------------------
     * 批量导出
     * ------------------------------------------------------------------
     */
    /**
     * @description: 批量导出
     * @param {*}
     * @return {*}
     */
    exportExcel () {
      this.exportVisible = true
    },
    async exportVisileConfirm () {
      this.exportVisible = false
      try {
        let res = await ArrangeApi.export(moment(this.exportForm.date).format('YYYY-MM-DD'))
        console.log(res)
      } catch (error) {
        if (error.status == '500') {
          return this.$message.error(error.message)
        }
      }
      window.open(
        `http://${window.location.host}/nrms/web-nr/arrange/export?targetDate=${moment(this.exportForm.date).format('YYYY-MM-DD')}`
      )
    },
    /**
    * ------------------------------------------------------------------
    * 表格展示问题
    * ------------------------------------------------------------------
    */
    /**
     * @description: 每列最多展示两行
     * @param {*} obj
     * @param {*} row
     * @return {*}
     */
    showTips (cellWidth, row, key) {
      /* obj为鼠标移入时的事件对象 */

      /* currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除 */
      let TemporaryTag = document.createElement('span')
      TemporaryTag.innerText = row[key]
      TemporaryTag.className = 'getTextWidth'
      document.querySelector('body').appendChild(TemporaryTag)
      let currentWidth = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()

      /* cellWidth为表格容器的宽度 */

      /* 当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行 */
      return currentWidth <= (2 * cellWidth)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/bnms/css/self_common";
.container {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  position: relative;
}
.btn {
  width: 80px;
  height: 28px;
  font-size: 14px;
  padding: 0;
}

/deep/ .tool-container {
  padding: 13px 16px 14px;
}
/deep/ .el-main {
  height: auto;
}

.right {
  flex: 1;
  width: 0;
  overflow: hidden;
  position: relative;
}

/*.dams_toolbar .operation_right{*/
/*  width: 12%;*/
/*}*/
/deep/ .el-dialog__wrapper .el-dialog {
  width: 22%;
}

.typt-list-container {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.table {
  flex: 1;
  height: 0;
  overflow: hidden;
}

/**
  * ------------------------------------------------------------------
  * 导入功能相关
  * ------------------------------------------------------------------
  */
.import-dialog {
  .import-dialog-upload {
    display: flex;
    align-items: center;
    .shift-button {
      margin-left: 12px !important;
    }
  }
  /deep/ .el-input--small .el-input__inner {
    height: 32px;
  }
}
.shift-table {
  /deep/ tr td {
    padding: 0 !important;
    height: auto;
  }
}
/deep/ .el-upload-list {
  display: none;
}
.upload-box {
  .upload-box-btn {
    width: 300px;
    box-sizing: border-box;
    height: 46px;
    border: 1px dashed #DFDFDF;
    display: flex;
    justify-content: flex-start;
    padding-left: 12px;
    align-items: center;
  }
}
.el-upload {
  &:active {
    .upload-box-btn {
      border-color: #1E87F0;
    }
  }
}
.file-list {
  width: 300px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #DFDFDF;
  margin-top: 20px;
  span {
    width: 250px;
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
.myNote{
  display:-webkit-box;
  text-overflow:ellipsis;
  overflow:hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient:vertical;
}
</style>
