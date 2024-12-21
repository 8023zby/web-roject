<!--
  文件描述:音频添加组件
  创建时间:2020/9/21
  创建人:Administrator
-->
<template>
  <el-dialog :visible.sync="dialogSortVisible" :title="detail.type === 'edit' ? '编辑' : '添加'" :close-on-click-modal=false :close-on-press-escape=false :show-close="false" width="600px">
    <el-container v-loading="addLoading">
      <el-main class="dialog-from-main addBell-main" style="width: 600px">
        <el-form ref="formdata" :model="formdata" :rules="rules" label-width="95px">
          <!-- 名称 -->
          <el-form-item :label="'音频名称'" prop="broadcastName">
            <el-input v-model.trim="formdata.broadcastName" type="text" maxlength="16" />
          </el-form-item>

          <el-form-item label="上传文件：" prop="file">
            <el-upload class="upload-demo" :file-list="fileList" action="false" accept=".mp3" :multiple="false" :auto-upload="false" :on-change="fileChange" :on-remove="fileRemove">
              <el-button size="small" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">仅可上传大小不超过10M的mp3文件，当前可用空间{{parserUnit(diskSpace.surplus)}}M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="
          detail.type === 'edit' ? editHandler(detail.row.id) : addHandler()
        ">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>

import {
  addBroadCastManage,
  editBroadCastManage,
  getBroadCastManageDiskSpace
} from '@/api/wnms//msgManage/mngAudio';

export default {
  components: {
  },
  data () {
    const rules = {
      broadcastName: [{ required: true, message: '请输入文件名称' }],
      file: [{ required: true, message: '请上传文件', trigger: 'change' }],
    };
    return {
      addLoading: false,
      isFileChange: false, // 上传的附件是否有更改
      detail: {
        type: 'add'
      },
      dialogSortVisible: false,
      // 验证方法
      rules,
      // 上传设置
      uploadOption: {
        fileSize: 100,
        fileSizeUnit: '',
        dataName: '',
        accept: '.mp3,.wma,.wav',
        limits: 2,
        fileList: []
      },
      // 表单内容
      formdata: {
        broadcastName: '',
        file: ''
      },
      diskSpace: {
        total: '0',
        surplus: '0',
      },
      fileList: [],
    };
  },
  watch: {
    fileList: function (newVal) {
      this.formdata.file = this.fileList[0];
      this.$nextTick(() => {
        this.$refs['formdata'].validateField('file');
      })
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.dialogSortVisible = true;
      this.getMaterialManageDiskSpace();
      if(this.detail.type === 'edit') {
        this.formdata.broadcastName = this.detail.row.audioName
        this.fileList.push({
          name: this.detail.row.originName,
          url: this.detail.row.audioPath
        })
      }
    },
    async getMaterialManageDiskSpace () {
      getBroadCastManageDiskSpace()
        .then(res => {
          this.diskSpace = res.data;
        });
    },
    parserUnit (num) {
      const res = parseFloat((+num).toFixed(2));
      return res >= 0 ? res : 0;
    },
    closeDialog () {
      this.$emit('closeAdd');
    },
    /**
     * @添加音频
     */
    addHandler () {
      console.log(this.formdata);
      this.$refs['formdata'].validate((valid) => {
        if (valid) {
          const formdata = new FormData();
          Object.keys(this.formdata).forEach(key => {
            if (Array.isArray(this.formdata[key])) {
              formdata.append(key, JSON.stringify(this.formdata[key]));
            } else {
              formdata.append(key, this.formdata[key]);
            }
          });
          addBroadCastManage(formdata)
            .then(res => {
              this.$message.success('添加成功')
              this.$emit('closeAdd', 'refresh')
            })
            .catch(err => {
              // this.$message.error(err.message || err)
            });
        } else {
          return false;
        }
      });
    },

    /**
     * @编辑音频
     * 1、只改了音频名称 - 修改自己数据库
     * 2、只改了附件 - 音视频先删除，再保存；自己数据库直接修改
     * 3、附件和音频名称都改了
     * 4、没有修改
     */
    editHandler (param) {
      this.$refs['formdata'].validate(valid => {
        if (valid) {
          const formdata = new FormData();
          Object.keys(this.formdata).forEach(key => {
            if(key === 'file' && !(this.formdata[key] instanceof File)) {
              formdata.append(key, null)
              return
            }
            if (Array.isArray(this.formdata[key])) {
              formdata.append(key, JSON.stringify(this.formdata[key]));
            } else {
              formdata.append(key, this.formdata[key]);
            }
          });
          formdata.append('broadcastId', this.detail.row.broadcastId)
          editBroadCastManage(formdata)
            .then(res => {
              this.$message.success('添加成功')
              this.$emit('closeAdd', 'refresh')
            })
            .catch(err => {
              // this.$message.error(err.message || err)
            });
        } else {
          return false
        }
      });
    },
    fileChange (file) {
      if (file.size > 1024 * 1024 * 10) {
        this.$message.error('单个文件大小不超过10M');
        if (this.fileList.length) {
          this.updateFileList(this.fileList[0]);
        } else {
          this.fileList = [];
        }
        return false;
      }
      if (file.size > this.diskSpace.surplus * 1024 * 1024) {
        this.$message.error('文件大小不能超过当前磁盘可用空间');
        if (this.fileList.length) {
          this.updateFileList(this.fileList[0]);
        } else {
          this.fileList = [];
        }
        return false;
      }
      this.updateFileList(file.raw);
    },
    updateFileList (file) {
      this.$set(this.fileList, 0, file);
    },
    handleCheck () {
      this.formdata.deptIds = this.$refs.deptTree.getCheckedKeys();
    },
    fileRemove () {
      this.$nextTick(() => {
        this.fileList = [];
      });
    },

  }
}
</script>
<style lang="scss" scoped>
.addBell-main {
  width: 600px !important;
  height: 230px;
  overflow: hidden !important;
  padding: 15px 20px !important;
}
</style>
