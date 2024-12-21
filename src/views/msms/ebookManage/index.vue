<!--电子书页面-->
<template>
  <div class="container yule-main">
    <div class="aside">
      <type-aside
          :typeList = 'ebookType'
          :editType="editType"
          v-on:addType="addType"
          v-on:delType="delType"
          v-on:edType="edType"
          v-on:sortType="sortType"
          v-on:getTypeId = 'getTypeId'></type-aside>
    </div>
    <div class="main-panel">
      <search-bar :editType="editType" v-on:ebookSearch = "ebookSearch"></search-bar>
      <hr>
      <edit-bar :editType="editType" v-on:addEbook = "addEbook" v-on:sortEbook = 'sortEbook' :typeId="typeId"></edit-bar>
      <div class="div-table">
      <el-table
              ref="singleTable"
              :data="tableData"
              highlight-current-row
              height="100%"
              :header-cell-style="{background:'rgb(249, 249, 249)'}"
              style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.$index+( page - 1) *size  + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
                property="name"
                label="电子书名称"
                align="center"
                >
        </el-table-column>
        <el-table-column
                property="filesize"
                label="文件大小"
                align="center"
               >
          <template slot-scope="scope">
            <span>{{(scope.row.filesize === '0.0')?'小于0.1':scope.row.filesize}}M</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span style="color:#409EFF;padding:10px 10px;cursor: pointer"
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)">编辑</span>
            <span  style="color:#f56c6c;padding:10px 10px;cursor: pointer"
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <div style='text-align:center;padding:30px 0;border-top: 1px solid #EBEEED'>
        <pages-common
          ref="refPageCommon"
          v-on:handleSizeChange = 'handleSizeChange'
          v-on:handleCurrentChange='handleCurrentChange'
          :pageChange="pageChange"
          :tableTotal='tableTotal'>
          </pages-common>
      </div>
    </div>
  <edit-dialog
          :dialogPara="dialogPara"
          :editType="editType"
          v-on:upDataType="upDataType"
          v-on:upDataList="upDataList"
          :typeList = 'ebookType'
          :typeId="typeId"
  ></edit-dialog>
  <!-- 分类排序列表 -->
  <el-dialog
    title="排序"
    :visible.sync="dialogSortVisible"
    width="40%"
    v-if="dialogSortVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    :show-close=false
  >
    <div style="overflow: auto;height: 500px">
      <el-table
         :data="tableSortType"
         style="width: 100%"
         row-key="id"
         fit
         highlight-current-row
         border
         ref="dragTable">
          <el-table-column
                  type="index"
                  label="序号"
                  width="50">
          </el-table-column>
          <el-table-column
                  property="name"
                  label="分类名称"
                  >
          </el-table-column>
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button type="text" @click="moveTypeUp(scope.$index, scope.row)">上移</el-button>
            <el-button type="text" @click="moveTypeDown(scope.$index, scope.row)" style="color:#f56f6c">下移</el-button>
            <el-button type="text" @click="moveTypeTop(scope.$index, scope.row)">置顶</el-button>
            <el-button type="text" @click="moveTypeBottom(scope.$index, scope.row)" style="color:#f56f6c">置底</el-button>
            <el-button type="text" @click="customTypeDo(scope.$index, scope.row)">指定位置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">

      <el-button @click="dialogSortVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="onSortSubmit()" size="small">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 列表列表 -->
    <el-dialog
      title="排序"
    :visible.sync="dialogSortListVisible"
    width="40%"
    v-if="dialogSortListVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :show-close=false
  >
      <div style="overflow: auto;height: 500px">
        <el-table
          :data="tableSortData"
          style="width: 100%"
          row-key="id"
          fit
          highlight-current-row
          border
          ref="dragTable">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            property="name"
            label="电子书名称"
          >
          </el-table-column>
          <el-table-column label="操作" align="center" width="400">
            <template slot-scope="scope">
              <el-button type="text" @click="moveUp(scope.$index, scope.row)">上移</el-button>
              <el-button type="text" @click="moveDown(scope.$index, scope.row)" style="color:#f56f6c">下移</el-button>
              <el-button type="text" @click="moveTop(scope.$index, scope.row)">置顶</el-button>
              <el-button type="text" @click="moveBottom(scope.$index, scope.row)" style="color:#f56f6c">置底</el-button>
              <el-button type="text" @click="customDo(scope.$index, scope.row)">指定位置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    <div slot="footer" class="dialog-footer">

      <el-button @click="dialogSortListVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="sortSubmit()" size="small">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import typeAside from '@/components/msms/typeAside'
import searchBar from '@/components/msms/searchBar'
import editBar from '@/components/msms/editBar'
import editDialog from '@/components/msms/editDialog'
import pagesCommon from '@/components/msms/pagesCommon/index.vue'
import tableSort from '@/assets/msms/utils/tableSort/tableSort.js'
import { editEbook, delEbook, delEbookType, sortEbookTypes, sortEbook } from '@/api/msms/ebooks/index.js'
import minxin from './mixin'
export default {
  mixins: [minxin],
  components: {
    'type-aside': typeAside,
    'search-bar': searchBar,
    'edit-bar': editBar,
    'edit-dialog': editDialog,
    'pages-common': pagesCommon
  },
  data () {
    return {
      searchName: '',
      tableSortData: [], // 列表排序
      tableSortType: [], // 分类排序
      editType: 'ebookEdit',
      currentRow: null,
      editForm: {
        name: ''
      },
      dialogSortVisible: false,
      dialogSortListVisible: false,
      SortVisible: false,
      rowEditId: '',
      labelName: 'ebook',
      dialogPara: {
        dialogTit: '添加分类',
        labelTit: '电子书名称',
        labelFile: '电子书文件',
        isShow: false,
        editType: 'addEbooksType',
        editId: '',
        editContent: '',
        uploadOption: {
          fileSize: 10,
          fileSizeUnit: '',
          dataName: '',
          accept: '.epub',
          limits: 1,
          fileList: []
        }
      },
      typeId: '',
      oldList: [],
      oldTypeList: [],
      // 表单内容
      formContent: {
        audioName: '',
        originalFileName: '',
        audioDuration: '',
        fileUrl: '',
        audioType: 'broadcast'
      },
      // 分页参数
      page: 1,
      size: 10,
      tableTotal: 0,
      pageChange: {
        page: 1,
        size: 10
      }
    }
  },
  computed: {
  },
  mounted () {
    // 获取音乐分类数据传递到子组件
    this.getebooksType()
    // 获取电子书列表
    this.getEbooksList({
      patientId: '',
      name: '',
      page: '1',
      size: '10'
    })
  },
  methods: {
    addType (para) {
      // 添加电子书分类
      // this.typeId = 'addType'
      this.dialogPara = {
        dialogTit: '添加分类',
        labelTit: '分类名称',
        labelFile: '电子书文件',
        isShow: false,
        editType: 'addEbooksType',
        editId: '',
        getTypeId: 'addType',
        editContent: '',
        uploadOption: {
          fileSize: 10,
          fileSizeUnit: '',
          dataName: '',
          accept: '.epub',
          limits: 1,
          fileList: []
        }
      }
      this.dialogPara.isShow = true
    },
    // 获取类型id
    getTypeId (id) {
      this.typeId = id
      this.pageChange.page = 0
      this.pageChange.page = 1
      this.pageChange.size = 0
      this.pageChange.size = 10
      this.size = 10
      this.page = 1
      this.getEbooksList({
        patientId: '',
        name: '',
        page: '1',
        size: '10',
        typeId: this.typeId
      })
    },
    delType (id) {
      // 删除电子书分类
      this.$confirm('是否确认删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        delEbookType(id).then(res => {
          if (res.status === 200) {
            this.typeId = ''
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getebooksType()
          }
        }).catch(error => {
          this.$message({
            message: '' + error,
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    edType (id, content) {
      // 编辑分类
      this.dialogPara = {
        dialogTit: '编辑分类',
        labelTit: '分类名称',
        labelFile: '电子书文件',
        isShow: false,
        editType: 'editEbooksType',
        editId: id,
        editContent: content
      }
      this.dialogPara.isShow = true
    },
    // 电子书分类排序
    sortType () {
      this.getTypeSort()
      this.dialogSortVisible = true
    },
    upDataType (data) {
      // 监听子组件事件，新增完成后，获取最新数据
      this.getebooksType()
    },
    upDataList (data) {
      // 监听子组件事件，新增完成后，获取最新数据
      this.handleSizeChange(this.size)
    },
    // 监听子组件搜索事件
    ebookSearch (para) {
      if (para === 'reSearch') {
        this.searchName = ''
        this.handleSizeChange(10)
      } else {
        this.searchName = para
        this.handleSizeChange(this.size)
      }
    },
    // 电子书新增
    addEbook () {
      this.dialogPara = {
        dialogTit: '添加电子书',
        labelTit: '电子书名称',
        labelFile: '电子书文件',
        isShow: true,
        editType: 'addEbook',
        getTypeId: this.typeId,
        editId: '',
        editContent: '',
        filePara: '',
        isFilePara: true,
        isCover: true,
        uploadOption: {
          fileSize: 10,
          fileSizeUnit: '',
          dataName: '',
          accept: '.epub',
          limits: 1,
          fileList: [],
          coverImg: ''
        }
      }
      this.dialogPara.isShow = true
    },
    // 监听列表排序
    sortEbook () {
      this.dialogSortListVisible = true
      this.getSortList({
        patientId: '',
        name: '',
        page: '',
        size: '',
        typeId: this.typeId
      })
    },
    editEbook () {
      editEbook({
        typeId: this.typeId,
        id: this.rowEditId,
        name: this.editForm.name,
        storageAddress: '',
        filesize: ''
      }).then(res => {
        if (res.status === 200) {
          this.handleSizeChange(this.size)
        }
      }).catch(error => {
        this.$message.error(JSON.stringify(error) + '')
      })
    },
    delEbook () {
      delEbook(this.rowEditId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.handleSizeChange(this.size)
        }
      }).catch(error => {
        this.$message.error(JSON.stringify(error) + '')
      })
    },
    // 电子书编辑
    handleEdit (index, row) {
      this.dialogPara = {
        dialogTit: '编辑电子书',
        labelTit: '电子书名称',
        labelFile: '电子书文件',
        isShow: true,
        editType: 'editEbook',
        editId: row.id,
        editContent: row.name,
        fileOriginName: row.fileOriginName,
        audioDuration: row.often,
        fileSize: row.filesize,
        fileUrl: row.storageAddress,
        filePara: '',
        getTypeId: row.typeId,
        typeId: this.typeId,
        typeName: row.typeName,
        isFilePara: true,
        isCover: true,
        uploadOption: {
          fileSize: 10,
          fileSizeUnit: '',
          dataName: '',
          accept: '.epub',
          limits: 1,
          fileList: [{ name: row.fileOriginName, url: row.storageAddress }],
          coverImg: row.coverUrl
        }
      }
      this.dialogPara.isShow = true
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        delEbook(row.id).then(res => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.handleSizeChange(this.size)
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error) + '')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editSubmit () {
      this.editEbook()
    },
    delSubmit () {
      this.delEbook()
    },
    // 电子书分类排序
    // 上移
    moveTypeUp (index, row) {
      tableSort.moveUp(index, row, this.tableSortType, this)
    },
    // 下移
    moveTypeDown (index, row) {
      tableSort.moveDown(index, row, this.tableSortType, this)
    },
    // 置顶
    moveTypeTop (index, row) {
      tableSort.moveTop(index, row, this.tableSortType, this)
    },
    // 置底
    moveTypeBottom (index, row) {
      tableSort.moveBottom(index, row, this.tableSortType, this)
    },
    // 指定位置
    customTypeDo (index, row) {
      tableSort.customDo(index, row, this.tableSortType, this)
    },
    // 提交电子书分类排序
    onSortSubmit () {
      this.oldTypeList = this.tableSortType.map(v => v.id)
      this.newList = this.oldTypeList.slice()
      const indexArr = []
      this.newList.forEach((dataItem, sortIndex) => {
        indexArr.push({
          'id': dataItem,
          'sort': sortIndex + 1
        })
      })
      sortEbookTypes(indexArr).then(res => {
        if (res.status === 200) {
          // 新增成功
          this.dialogSortVisible = false
          this.getebooksType()
          this.$message({
            message: '排序成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '' + res.desc,
            type: 'error'
          })
        }
      })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '排序失败')
        })
    },
    // 电子书排序
    // 上移
    moveUp (index, row) {
      tableSort.moveUp(index, row, this.tableSortData, this)
    },
    // 下移
    moveDown (index, row) {
      tableSort.moveDown(index, row, this.tableSortData, this)
    },
    // 置顶
    moveTop (index, row) {
      tableSort.moveTop(index, row, this.tableSortData, this)
    },
    // 置底
    moveBottom (index, row) {
      tableSort.moveBottom(index, row, this.tableSortData, this)
    },
    // 指定位置
    customDo (index, row) {
      tableSort.customDo(index, row, this.tableSortData, this)
    },
    // 列表排序
    sortSubmit () {
      this.oldList = this.tableSortData.map(v => v.id)
      this.newList = this.oldList.slice()
      const indexArr = []
      this.newList.forEach((dataItem, sortIndex) => {
        indexArr.push({
          'id': dataItem,
          'sort': sortIndex + 1
        })
      })
      sortEbook(indexArr).then(res => {
        if (res.status === 200) {
          this.dialogSortListVisible = false
          this.handleSizeChange(this.size)
          this.$message({
            message: '排序成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '' + res.desc,
            type: 'error'
          })
        }
      })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '排序失败')
        })
    },
    // 音频获取时长
    getDuration (url) {
      const _this = this
      // 获取录音时长
      // 经测试，发现audio也可获取视频的时长
      let _audioDuration
      const audioElement = new Audio(url)

      audioElement.addEventListener('loadedmetadata', function (_event) {
        // 得到时长
        _audioDuration = `${parseInt(audioElement.duration / 60)}:${(parseInt(audioElement.duration % 60) < 10) ? ('0' + parseInt(audioElement.duration % 60)) : parseInt(audioElement.duration % 60)}`

        // 赋值时长
        _this.formContent.audioDuration = _audioDuration
      })
    },
    // 文件上传成功的钩子
    handleSuccess () {
      console.log('文件上传成功的钩子')
    },

    // 文件上超出个数的钩子
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 ${this.uploadOption.limits} 个文件，本次选择了 ${files.length} 个文件，已超出个数限制!`)
    },

    // 文件上传前的钩子
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < this.uploadOption.fileSize
      if (!isLt2M) {
        this.$message.error(`上传文件大小不能超过 ${this.uploadOption.fileSize + (this.uploadOption.fileSizeUnit || 'MB')}!`)
      }

      // 设置上传文件名
      this.uploadOption.dataName = this.formContent.audioName

      return isLt2M
    },
    // 判断音频类型
    isAudioType () {
      return this.detail.audioType === 'alarm' ? '铃声' : '音频'
    },
    handleSizeChange (size) {
      this.page = 1
      this.size = size
      this.pageChange = {
        page: this.page,
        size: this.size
      }
      this.getEbooksList({
        typeId: this.typeId,
        patientId: '',
        name: this.searchName,
        page: this.page,
        size: size
      })
    },
    handleCurrentChange (page) {
      this.page = page
      this.getEbooksList({
        typeId: this.typeId,
        patientId: '',
        name: this.searchName,
        page: page,
        size: this.size
      })
    }
  }
}
</script>
<style lang="scss">
  @import '@/assets/msms/css/yule-common.scss';
</style>
<style scoped scss>
  .container{
    display: flex;
    height: 100%;
  }
  .aside{
    box-shadow: 0px 0px 2px 2px #EBEEED;
  }
  .main-panel{
    margin-left: 0.8%;
    box-shadow: 0px 0px 2px 2px #EBEEED;
  }
.el-table thead {
    color: #909399;
    font-weight: 500;
    background:rgba(247,247,247,1) !important
}
 .el-table th, .el-table tr {
   background:rgba(247,247,247,1) !important
}
</style>
