<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{ detail.type === 'edit'?'编辑':'添加' }}系统文件</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 100%">
        <el-form ref="formdata" :model="formdata" label-width="130px" :rules="rules">
          <el-form-item label="上传文件：" prop="file">
            <el-upload 
              v-if="detail.type !== 'edit'" 
              class="upload-demo" 
              :file-list="fileList" 
              action="false" 
              accept=".mp3,.wav,.jpg,.png,.bmp" 
              :multiple="true" 
              :auto-upload="false"
              :on-change="fileChange" 
              :on-remove="fileRemove"
            >
              <el-button size="small" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">仅可上传大小不超过1M的mp3/wav/png/jpg/bmp文件，当前可用空间{{parserUnit(diskSpace.surplus)}}M</div>
            </el-upload>
            <span v-else>{{detail.row && detail.row.materialName}}</span>
          </el-form-item>
          <el-form-item label="应用终端：" prop="deviceTypes">
            <el-checkbox-group v-model="formdata.deviceTypes">
              <el-checkbox label="YH-6297i">床头分机（6297i）</el-checkbox>
              <el-checkbox label="YH-6267i">门口分机（6267i）</el-checkbox>
              <el-checkbox label="YH-A26i">门口分机（A26i）</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="应用科室：" prop="deptIds">
            <el-checkbox :indeterminate="isDeptDeterminate" :value="isDeptCheckAll" @change="onDeptCheckAllChange">全选</el-checkbox>
            <el-tree :data="deptList" show-checkbox default-expand-all @check-change="handleCheck" node-key="deptId" ref="deptTree" highlight-current check-strictly :props="defaultProps"></el-tree>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" class="passport-imgDialog" :destroy-on-close="true">
      <div class="picDialog" style="max-width: 100%;max-height: 600px; padding-bottom: 20px;">
        <img :src="getPicture(fileList[0])" v-if="fileList && fileList.length" style="max-height: 600px;max-width: 100%"/>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as msgWarnApi from '@/api/wnms//msgManage/msgWarn';
import * as API from "@/api/wnms/msgManage/systemConfig";
import _ from "lodash"
export default {
  props: {
    detail: {}
  },
  data () {
    const rules = {
      file: [{ required: true, message: '请上传文件', trigger: 'change' }],
      deviceTypes: [{ required: true, message: '请选择应用终端' }],
      deptIds: [{ required: true, message: '请选择应用科室' }]
    };
    return {
      rules,
      formdata: {
        file: [],
        deviceTypes: [],
        deptIds: []
      },
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      diskSpace: {
        total: '0',
        surplus: '0',
      },
      fileList: [],
      seen: false,
      dialogVisible: false,
      deptIds: [],
      isDeptDeterminate: false,
      isDeptCheckAll: false,
    };
  },
  watch: {
    fileList: function (newVal) {
      this.formdata.file = newVal || [];
      this.$nextTick(() => {
        this.$refs['formdata'].validateField('file');
      })
    },
    "formdata.deptIds": function(newVal) {
      if(this.deptIds.every(item => newVal.find(v => v === item))) {
        this.isDeptCheckAll = true
        this.isDeptDeterminate = false
      } else {
        if(newVal && newVal.length) {
          this.isDeptDeterminate = true
        } else {
          this.isDeptDeterminate = false
        }
        this.isDeptCheckAll = false
      }
    }
  },
  created () {

  },
  async mounted () {
    await this.getdepts();
    this.getDeptsIds();
    this.getMaterialManageDiskSpace();
    this.init()
  },
  methods: {
    init() {
      this.formdata = {
        file: '',
        deviceTypes: this.detail.row.deviceTypes,
        deptIds: this.detail.row.deptIds
      }
      this.fileList.push({
        name: this.detail.row.materialName,
        url: this.detail.row.materialPath
      })
      this.$refs.deptTree.setCheckedKeys(this.formdata.deptIds)
    },
    /* 获取护理单元 */
    async getdepts () {
      let res = await msgWarnApi.getdepts().catch(err => {})
      if (res.status === 200 && res.data !== null) {
        this.deptList = res.data.list;
      }
    },
    getDeptsIds() {
      const deptIds = []
      let queue = [].concat(this.deptList)
      while(queue.length) {
        const top = queue.shift()
        if(top.children && top.children.length) {
          queue = queue.concat(top.children)
        }
        deptIds.push(top.deptId)
      }
      this.deptIds = deptIds
    },
    async getMaterialManageDiskSpace () {
      API.getMaterialManageDiskSpace()
        .then(res => {
          this.diskSpace = res.data;
        });
    },
    parserUnit (num) {
      const res = parseFloat((num / 1024).toFixed(2));
      return res >= 0 ? res : 0;
    },
    save () {
      this.$refs['formdata'].validate((valid) => {
        if (valid) {
          const formdata = new FormData()
          Object.keys(this.formdata).forEach(key => {
            if(key === 'file' && !(this.formdata[key] instanceof File)) {
              formdata.append(key, null)
              return
            }
            if(Array.isArray(this.formdata[key])) {
              formdata.append(key, JSON.stringify(this.formdata[key]))
            } else {
              formdata.append(key, this.formdata[key])
            }
          })
          formdata.append('materialId', this.detail.row.materialId)
          API.updateMaterialMange(formdata)
            .then(res => {
              this.$message.success('编辑成功')
              this.$emit('option-changed', 'list')
            })
            .catch(err => {
              // this.$message.error(err.message || err)
            })
        } else {
          return false;
        }
      });
    },
    cancel () {
      this.$emit('option-changed', 'list');
    },
    handleUpload (res, file) {
    },
    // beforeUpload(file) {
    //   return false
    // },
    fileChange (file, fileList) {
      if (file.size > 1024 * 1024) {
        this.$message.closeAll()
        this.$message.error('单个文件大小不超过1M');
        this.fileList = _.cloneDeep(this.fileList)
        return false;
      }
      if (file.size > this.diskSpace.surplus * 1024) {
        this.$message.closeAll()
        this.$message.error('文件大小不能超过当前磁盘可用空间');
        this.fileList = _.cloneDeep(this.fileList)
        return false;
      }
      this.fileList.push(file)
    },
    handleCheck () {
      this.formdata.deptIds = this.$refs.deptTree.getCheckedKeys();
    },
    fileRemove (file, fileList) {
      this.$nextTick(() => {
        this.fileList.splice(this.fileList.findIndex(item => item.uid === file.uid), 1)
      });
    },
    getPicture(file) {
      if(!file) return ''
      return file instanceof File ? URL.createObjectURL(file) : file.url
    },
    onTypeChange() {
      this.fileList = []
    },
    onDeptCheckAllChange() {
      if(!this.isDeptCheckAll) {
        this.formdata.deptIds = JSON.parse(JSON.stringify(this.deptIds))
        this.$refs.deptTree.setCheckedKeys(this.formdata.deptIds)
      } else {
        this.formdata.deptIds = []
        this.$refs.deptTree.setCheckedKeys([])
      }
    }
  }
}
</script>
<style scoped lang="scss">
.typt-add-container {
  padding: 20px;
}
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #cdd0d5;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: #cdd0d5;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
  color: #409eff !important;
}
.avatar-uploader-icon {
  font-size: 24px;
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
}
.avatar {
  width: 110px;
  height: 110px;
  display: block;
}
.showBtn {
  position: absolute;
  bottom: 0px;
  left: 0;
  height: 22px;
  line-height: 22px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  border-radius: 0 0 2px 2px;
  width: 100%;
}
.ImgBtn {
  float: left;
  width: 50%;
  background: rgba(51, 51, 51, 0.3);
}
.closeBtn {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  color: #999999;
}
.picDialog {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>