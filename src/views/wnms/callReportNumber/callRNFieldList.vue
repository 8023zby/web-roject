<template>
  <div class="typt-list-container">
    <el-form :inline="true" :model="queryForm" ref="queryForm">
      <el-form-item label="字段内容">
        <el-input placeholder="请输入" v-model="queryForm.field"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="executeQueryPage()" icon="el-icon-search">搜索</el-button>
        <el-button type="text" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <div class="typt-list-add-div">
      <el-button type="warning" icon="el-icon-plus" @click="goAddOrEdit('add','')">添加
      </el-button>
    </div>
    <el-table :data="pagination.list" height="100%" stripe highlight-current-row v-loading="yh_loading">
      <el-table-column label="" prop="" width="20px" />
      <el-table-column label="字段内容" prop="field" show-overflow-tooltip />
      <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip />
      <el-table-column label="备注" prop="memo" show-overflow-tooltip />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template v-if="scope.row.systemField === 1">
            <el-button type="text" @click="goAddOrEdit('edit', scope.row)" size="mini">编辑 </el-button>
            <el-button type="text" @click="goAddOrEdit('download', scope.row)" size="mini">下载</el-button>
            <el-button type="text" @click="delInfo(scope.row)" size="mini" style="color:#F56C6C">删除</el-button>
          </template>
          <template v-else-if="scope.row.systemField === 0">
            <el-button type="text" @click="goAddOrEdit('download', scope.row)" size="mini">下载</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    <el-dialog :visible.sync="addRNDialogVisible" width="400px;">
      <div slot="title" class="header-title">
        {{editTitle}}字段
      </div>
      <span>
        <el-form ref="addForm" :model="addForm" :rules="addRules">
          <el-form-item label="字段内容" label-width="80px" prop="field">
            <el-input v-model="addForm.field"></el-input>
          </el-form-item>
          <el-form-item label="上传音频" label-width="80px" prop="audioFileName">
            <uploadFlied ref="uploadVideoFile" :data-name="uploadInfo.dataName" :accept="uploadInfo.accept" :limit="1" :filelist="uploadInfo.filelist" :Iscallback="uploadInfo.Iscallback" @uploadFliedsChange="uploadFliedsChange" @uploadFlieds="uploadFlieds" @changeLoading="changeLoading" />
            <el-link type="info" disabled>
              最大上传大小10M，格式为“wav”
            </el-link>
          </el-form-item>
          <el-form-item label="备注" label-width="80px" style="margin-top: 40px">
            <el-input v-model="addForm.memo" :rows="5" type="textarea" maxlength="100" show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRNDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave()" :loading="saveBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { selectDeptInfo, getUser } from '@/assets/wnms/utils/common';
import { deepMerge } from '@/assets/wnms/utils';
import BaseQueryPageForm from '../common/BaseQueryPageForm';
import Pagination from '@/components/wnms/paginations/pagination';
import uploadFlied from '@/components/wnms/Upload/uploadFileNew';
import { hasRNFieldInfoApi, ListInfo, AddInfo, DetailInfo, DeleteInfo, EditInfo } from '@/api/wnms/callReportNumber/callRNField.js';

export default {
  name: "callRNFieldList",
  mixins: [BaseQueryPageForm],
  components: {
    uploadFlied,
    Pagination,
  },
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    var audioFileNameRequired = (rule, value, callback) => {
      let fileList = this.uploadInfo.fileList;
      if (value || (fileList && fileList.length)) {
        callback();
      } else {
        callback(new Error('请上传音频'));
      }
    };
    return {
      addRNDialogVisible: false,
      isFileChange: false,
      saveBtnLoading: false,
      editType: 'add',
      editTitle: '添加',
      search: {
        size: 10,
        page: 1
      },
      yh_loading: false,
      queryForm: {
        field: ''
      },
      addForm: {
        id: '',
        field: '',
        memo: '',
        audioFileUrl: '',
        audioFileName: '',
      },
      md5string: "1",
      fileContent: '',
      uploadInfo: {
        param: {
          isFile: true, // 是否显示文件,
          name: ''// 文件名字
        },
        dataName: 'video',
        accept: '.wav',
        limit: 1,
        Iscallback: true,
        filelist: [],
      },
      addRules: {
        field: [{ required: true, message: '请输入字段内容' }, { max: 16, trigger: 'blur', message: "字段内容长度最大16个字符" }],
        audioFileName: [{ required: true, validator: audioFileNameRequired, trigger: 'blur' }]
      }
    };
  },
  created () {

  },
  mounted () {
    this.executeQueryPage();
  },
  methods: {
    executeQueryPage () {
      this.yh_loading = true;
      let params = this.createQueryParams();
      params.field = this.queryForm.field;
      ListInfo(params).then(res => {
        this.queryResultHandler(res);
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.yh_loading = false;
      });
    },
    onSave () {
      console.log(this.addForm.audioFileName);
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          hasRNFieldInfoApi({
            id: this.addForm.id,
            audioFileUrl: this.addForm.audioFileUrl,
            field: this.addForm.field,
            memo: this.addForm.memo,
            fileName: this.addForm.audioFileName,
          }).then(res => {
            if (res.status == 200) {
              console.log("submit");
              if (this.isFileChange) {
                this.saveBtnLoading = true;
                this.$refs.uploadVideoFile.submit();
              }
              else {
                if (this.editType == 'add') {
                  this.add();
                } else {
                  this.edit();
                }
              }
            }
            else {
              this.saveBtnLoading = false;
              this.$message(res.desc);
            }
          }).catch(err => {
            this.saveBtnLoading = false;
          });
        }
        else {
          this.saveBtnLoading = false;
        }
      });
    },
    uploadFlieds (d) {
      console.log(d);
      this.saveBtnLoading = false;
      this.fileContent = d.data;
      this.md5string = this.fileContent.MD5;
      this.addForm.audioFileUrl = this.fileContent.urlPath;
      console.log(this.fileContent.urlPath);
      if (this.editType == 'add') {
        this.add();
      } else {
        this.edit();
      }
    },
    add () {
      console.log("add");
      AddInfo({
        audioFileUrl: this.addForm.audioFileUrl,
        field: this.addForm.field,
        memo: this.addForm.memo,
        fileName: this.addForm.audioFileName,
        md5String: this.md5string,
        fileContent: JSON.stringify(this.fileContent)
      }).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.saveBtnLoading = false;
          this.addRNDialogVisible = false;
          this.executeQueryPage();
          this.saveBtnLoading = false;
        } else {
          this.saveBtnLoading = false;
          this.$message(res.desc);
        }
      }).catch(err => {
        this.saveBtnLoading = false;
        console.log(err);
      });
    },
    edit () {
      EditInfo({
        id: this.addForm.id,
        audioFileUrl: this.addForm.audioFileUrl,
        field: this.addForm.field,
        memo: this.addForm.memo,
        fileName: this.addForm.audioFileName,
        md5String: this.md5string
      }).then(res => {
        if (res.status == 200) {
          this.saveBtnLoading = false;
          this.addRNDialogVisible = false;
          this.executeQueryPage();
          this.saveBtnLoading = false;
        } else {
          this.saveBtnLoading = false;
          this.$message(res.desc);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    changeLoading () {
      console.log("===================changeLoading");
      //this.saveBtnLoading = false;
    },
    uploadFliedsChange (res) {
      console.log(res);
      this.isFileChange = true;
      this.saveBtnLoading = false;
      if (res.type == 'del') {
        this.addForm.audioFileName = '';
      } else if (res.type == 'change') {
        console.log(res.file.name);
        this.addForm.audioFileName = res.file.name;
      }
    },
    resetForm () {
      this.queryForm.field = '';
      this.executeQueryPage();
    },
    goAddOrEdit (t, row) {
      this.editType = t;
      if (this.$refs["addForm"] !== undefined) {
        this.$refs["addForm"].resetFields();
      }
      this.uploadInfo.filelist = [];
      if (t == 'add') {
        this.editTitle = '添加';
        this.addRNDialogVisible = true;
        this.addForm.id = '';
        this.addForm.field = '';
        this.addForm.memo = '';
        this.uploadInfo.fileList = [];
        this.addForm.audioFileName = '';
      }
      else if (t == 'download') {
        console.log(row);
        window.open(row.audioFileUrl, '_blank');
      }
      else if (t == 'edit') {
        this.editTitle = '修改';
        DetailInfo(row.id).then(res => {
          if (res.status == 200) {
            this.addRNDialogVisible = true;
            this.addForm.id = res.data.id;
            this.addForm.field = res.data.field;
            this.addForm.memo = res.data.memo;

            let fileName = res.data.fileName;
            let fileUrl = res.data.audioFileUrl;
            this.addForm.audioFileName = fileName;
            this.addForm.audioFileUrl = fileUrl;

            this.uploadInfo.filelist.push({ name: fileName, url: fileUrl });
          }
        }).catch(err => {
          console.log(err);
        });
      }
    },
    delInfo (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.yh_loading = true;
        DeleteInfo(row.id).then(res => {
          if (res.status == 200) {
            this.$message("删除成功");
            this.executeQueryPage();
          } else {
            this.$message("删除失败");
          }
        }).catch(err => {
          console.log(err);
        }).finally(() => {
          this.yh_loading = false;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }

}
</script>

<style scoped>
/deep/.el-dialog__footer{
  padding: 85px 20px 20px 20px;
}
  .typt-list-container .el-form {
    margin-bottom: 20px;
  }

</style>
