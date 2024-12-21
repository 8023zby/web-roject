<template>
  <el-dialog :title="dialogPara.dialogTit" :visible.sync="dialogPara.isShow" width="30%"  :close-on-click-modal=false
             :show-close="false"
             :close-on-press-escape=false>
    <el-form  label-width="120px" :model="dialogPara" :rules="rules" ref="ruleForm" >
      <el-form-item label="分类：" v-if="typeId === '' && dialogPara.getTypeId!=='addType'" prop="fenlei">
        <el-select v-model="dialogPara.getTypeId" placeholder="请选择分类" size="small" style="width: 90%">
          <el-option  v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`${dialogPara.labelTit}：`" prop="editContent">
        <el-input size="small" placeholder="请输入" style="width: 90%" v-model.trim="dialogPara.editContent">></el-input>
      </el-form-item>
      <el-form-item :label="`${dialogPara.labelFile}：`" v-if="dialogPara.isFilePara" prop="labelFile">
        <upload-flie
          ref="uploadVideoFile"
          v-model="formContent.fileUrl"
          :data-name="dialogPara.uploadOption.dataName"
          :accept="dialogPara.uploadOption.accept"
          :limits="2"
          :filelist="dialogPara.uploadOption.fileList"
          :fileSize="dialogPara.uploadOption.fileSize"
          @uploadFliedsChange="uploadFliedsChange"
          @uploadFlieds="uploadFlieds"
          @getFilePara="getFilePara"/>
      </el-form-item>
      <el-form-item label="封面上传：" v-if="dialogPara.isCover">
        <div>
          <app-cropper
            :width="125"
            :height="175"
            :fixed-number="[125,175]"
            v-model="dialogPara.uploadOption.coverImg"
            @subUploadSucceed="handleUploadSucceed"
          />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">

      <el-button @click="cancel()" size="small">取 消</el-button>
      <el-button type="primary" @click="editSubmit()" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addEbooksType, editEbooksType, addEbook, editEbook } from '@/api/msms/ebooks/index.js'
import { addMusicType, editMusicType, addMusic, editMusic } from '@/api/msms/music/index.js'
import minxin from '@/views/msms/ebookManage/mixin.js'
import uploadFile from '@/components/msms/uploadFile/uploadFile'
import AppCropper from '@/components/msms/Upload/Upload'
import { DeleteFileds } from '@/api/msms/qiniu'
import qs from 'qs'

export default {
  mixins: [minxin],
  props: {
    dialogPara: {
      type: Object,
      default: () => {
      },
      editType: ''
    },
    typeList: {
      type: Array,
      default: function () {
        return []
      }
    },
    typeId: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  components: {
    'upload-flie': uploadFile,
    AppCropper
  },
  data () {
    return {
      deleteFiles: [], // 删除附件
      // 验证方法
      rules: {
        'fileUrl': [{
          required: true,
          message: '请上传音频',
          trigger: 'change'
        }],
        'audioName': [{
          required: true,
          message: '请输入名称',
          trigger: 'change'
        },
        {
          min: 1,
          max: 16,
          message: '请输入16位以内',
          trigger: 'blur'
        }],
        fenlei: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        editContent: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        labelFile: [
          { required: true }
        ]

      },
      typeData: [],
      editDialogVisible: false,
      editForm: {
        'name': ''
      },
      list1: '',
      isShowType: true,
      uploadIcon: require('@/assets/msms/img/uploadIcon.png'),
      imageUrl: '',
      coverImg: '',
      acceptType: '.png,.jpg,.jpeg',
      // 上传设置
      // uploadOption: {
      //   fileSize: 99,
      //   fileSizeUnit: '',
      //   dataName: '',
      //   accept: '.mp3',
      //   limits: 1,
      //   fileList: [{}]
      // },
      // 表单内容
      formContent: {
        audioName: '',
        originalFileName: '',
        audioDuration: '',
        fileUrl: '',
        audioType: 'broadcast',
        fileSize: ''
      }
    }
  },
  watch: {
    dialogPara (val) {
      if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
      if (val.uploadOption.fileList && val.uploadOption.fileList.length !== 0) {
        for (let v of val.uploadOption.fileList) {
          this.deleteFiles.push(v.url)
        }
      }
      this.rules.editContent = [{ required: true, message: '请输入名称', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }]
      if (val.editType === 'addMusic' || val.editType === 'addEbook') {
        this.formContent.fileUrl = ''
        this.coverImg = ''
        this.dialogPara.uploadOption.coverImg = ''
        if (this.dialogPara.isCover) {
          this.dialogPara.isCover = false
          this.$nextTick(() => {
            this.dialogPara.isCover = true
          })
        }
      } else if (val.editType === 'editMusic' || val.editType === 'editEbook') {
        this.formContent.fileUrl = this.dialogPara.fileUrl
        this.formContent.originalFileName = this.dialogPara.fileOriginName
        this.formContent.audioDuration = this.dialogPara.audioDuration
        this.formContent.fileSize = this.dialogPara.fileSize
      } else if (val.editType === 'addMusicType' || val.editType === 'editMusicType' || val.editType === 'addEbooksType' || val.editType === 'editEbooksType') {
        this.rules.editContent = [{ required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  mounted () {
    console.log(this.dialogPara)

    let val = this.dialogPara
    if (val.editType === 'addMusicType' || val.editType === 'editMusicType' || val.editType === 'addEbooksType' || val.editType === 'editEbooksType') {
      this.rules.editContent = [{ required: true, message: '请输入名称', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }]
    }
  },
  methods: {
    cancel () {
      if (this.$refs.uploadVideoFile) this.$refs.uploadVideoFile.fileList = null
      this.dialogPara.isShow = false
    },
    editSubmit () {
      let reg = new RegExp('Type')
      if (this.dialogPara.editContent === '') {
        this.$message.error('名称不可以为空')
        return
      } else if (this.dialogPara.editContent.length > 10 && reg.test(this.dialogPara.editType)) {
        this.$message.error('名称不可以超过十个字符')
        return
      } else if (this.dialogPara.editContent.length > 20 && !reg.test(this.dialogPara.editType)) {
        this.$message.error('名称不可以超过二十个字符')
        return
      }
      // 添加电子书分类
      if (this.dialogPara.editType === 'addEbooksType') {
        addEbooksType({
          name: this.dialogPara.editContent
        }).then(res => {
          if (res.status === 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogPara.isShow = false
            // 通知父组件更新最新数据
            this.$emit('upDataType', this.ebookType)
          } else if (res.status === 20001) {
            this.$message({
              message: res.desc,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'editEbooksType') { // 编辑电子书分类
        editEbooksType({
          id: this.dialogPara.editId,
          name: this.dialogPara.editContent
        }).then(res => {
          if (res.status === 200) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.dialogPara.isShow = false
            // 通知父组件更新最新数据
            this.$emit('upDataType', this.ebookType)
          } else if (res.status === 20001) {
            this.$message({
              message: res.desc,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'addEbook') { // 添加电子书
        if (this.dialogPara.getTypeId === '') {
          this.$message.error('请选择分类')
          return
        }
        this.$refs.uploadVideoFile.submit()
      } else if (this.dialogPara.editType === 'editEbook') { // 编辑电子书
        if (this.formContent.fileUrl === '') {
          this.$refs.uploadVideoFile.submit()
          return
        }
        editEbook({
          typeId: this.dialogPara.getTypeId,
          id: this.dialogPara.editId,
          fileOriginName: this.formContent.originalFileName,
          name: this.dialogPara.editContent,
          storageAddress: this.formContent.fileUrl,
          filesize: this.formContent.fileSize,
          coverUrl: this.coverImg
        }).then(res => {
          if (res.status === 200) {
            this.dialogPara.isShow = false
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.$emit('upDataList', this.ebookType)
          } else if (res.status === 20001) {
            this.$message({
              message: res.desc,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'addMusicType') { // 添加音乐分类
        addMusicType({
          name: this.dialogPara.editContent
        }).then(res => {
          if (res.status === 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            // this.getebooksType()
            this.dialogPara.isShow = false
            // 通知父组件更新最新数据
            this.$emit('upDataType', this.ebookType)
          } else if (res.status === 20001) {
            this.$message({
              message: res.desc,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'editMusicType') { // 编辑音乐分类
        editMusicType({
          id: this.dialogPara.editId,
          name: this.dialogPara.editContent
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            // this.getebooksType()
            this.dialogPara.isShow = false
            // 通知父组件更新最新数据
            this.$emit('upDataType', this.ebookType)
          } else if (res.status === 20001) {
            this.$message({
              message: res.desc,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'editMusic') { // 编辑音乐
        if (this.formContent.fileUrl === '') {
          this.$refs.uploadVideoFile.submit()
          return
        }

        editMusic({
          typeId: this.dialogPara.getTypeId,
          id: this.dialogPara.editId,
          name: this.dialogPara.editContent,
          fileOriginName: this.formContent.originalFileName,
          storageAddress: this.formContent.fileUrl,
          often: this.formContent.audioDuration, // 时长
          filesize: this.formContent.fileSize // 文件大小
        }).then(res => {
          if (res.status === 200) {
            this.dialogPara.isShow = false
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.$emit('upDataList', this.ebookType)
          } else if (res.status === 20001) {
            this.$message({
              message: res.desc,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'addMusic') { // 添加音乐
        if (this.dialogPara.getTypeId === '') {
          this.$message.error('请选择分类')
          return
        }
        this.$refs.uploadVideoFile.submit()
      }
    },
    // 附件改变时，回调
    uploadFliedsChange (res) {
      console.log('附件改变时，回调函数\n', JSON.stringify(res))
      this.formContent.fileUrl = ''
    },
    // 接收上传组件得返回结果
    uploadFlieds (res) {
      console.log('接收上传组件得返回结果:', res)
      if (res.data === '') {
        // 移除文件
        this.formContent.fileUrl = res.data
        this.formContent.audioDuration = res.data
        this.formContent.originalFileName = res.data
      } else {
        let d = JSON.parse(res.data)
        this.formContent.fileUrl = d.url
        this.formContent.originalFileName = d.name
        if (d.formatDuration) {
          let f = d.formatDuration.split(':')
          if (f[0] === '00')d.formatDuration = f[1] + ':' + f[2]
          this.formContent.audioDuration = d.formatDuration
        }

        // 提交保存
        if (this.dialogPara.editType === 'addEbook') {
          // 添加电子书
          addEbook({
            typeId: this.dialogPara.getTypeId,
            name: this.dialogPara.editContent,
            fileOriginName: this.formContent.originalFileName,
            storageAddress: this.formContent.fileUrl,
            filesize: this.formContent.fileSize,
            coverUrl: this.coverImg
          }).then(res => {
            if (res.status === 200) {
              this.dialogPara.isShow = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$refs.uploadVideoFile.handleAudioRemove()
              this.$emit('upDataList', this.ebookType)
            } else if (res.status === 20001) {
              this.$message({
                message: res.desc,
                type: 'error'
              })
            }
          }).catch(error => {
            this.$message.error(JSON.stringify(error))
          })
        } else if (this.dialogPara.editType === 'editEbook') {
          // 编辑电子书
          if (this.formContent.fileUrl === '') {
            this.$message.error('请上传文件')
            return
          }
          editEbook({
            typeId: this.dialogPara.getTypeId,
            id: this.dialogPara.editId,
            fileOriginName: this.formContent.originalFileName,
            name: this.dialogPara.editContent,
            storageAddress: this.formContent.fileUrl,
            filesize: this.formContent.fileSize,
            coverUrl: this.coverImg
          }).then(res => {
            if (res.status === 200) {
              this.dialogPara.isShow = false
              for (let v of this.deleteFiles) {
                if (!this.formContent.fileUrl || v !== this.formContent.fileUrl) {
                  DeleteFileds(qs.parse({ filePath: v })).then(r => {
                  }).catch(errors => {
                  })
                }
              }
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.$refs.uploadVideoFile.handleAudioRemove()
              this.$emit('upDataList', this.ebookType)
            } else if (res.status === 20001) {
              this.$message({
                message: res.desc,
                type: 'error'
              })
            }
          }).catch(error => {
            this.$message.error(JSON.stringify(error))
          })
        } else if (this.dialogPara.editType === 'editMusic') {
          // 编辑音乐
          editMusic({
            typeId: this.dialogPara.getTypeId,
            id: this.dialogPara.editId,
            name: this.dialogPara.editContent,
            fileOriginName: this.formContent.originalFileName,
            storageAddress: this.formContent.fileUrl,
            often: this.formContent.audioDuration, // 时长
            filesize: this.formContent.fileSize // 文件大小
          }).then(res => {
            if (res.status === 200) {
              this.dialogPara.isShow = false
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              for (let v of this.deleteFiles) {
                if (!this.formContent.fileUrl || v !== this.formContent.fileUrl) {
                  DeleteFileds(qs.parse({ filePath: v })).then(r => {
                  }).catch(errors => {
                  })
                }
              }
              this.$refs.uploadVideoFile.handleAudioRemove()
              this.$emit('upDataList', this.ebookType)
            } else if (res.status === 20001) {
              this.$message({
                message: res.desc,
                type: 'error'
              })
            }
          }).catch(error => {
            this.$message.error(JSON.stringify(error))
          })
        } else if (this.dialogPara.editType === 'addMusic') {
          // 添加音乐
          addMusic({
            typeId: this.dialogPara.getTypeId,
            name: this.dialogPara.editContent,
            fileOriginName: this.formContent.originalFileName,
            storageAddress: this.formContent.fileUrl,
            often: this.formContent.audioDuration, // 时长
            filesize: this.formContent.fileSize // 文件大小
          }).then(res => {
            if (res.status === 200) {
              this.dialogPara.isShow = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$refs.uploadVideoFile.handleAudioRemove()
              this.$emit('upDataList', this.ebookType)
            }
          })
            .catch(error => {
              this.$message.error(JSON.stringify(error))
            })
        }
      }
    },
    getFilePara (fileSize) {
      this.formContent.fileSize = fileSize
    },
    handleUploadSucceed (imgDataUrl) {
      this.coverImg = imgDataUrl.url
      this.dialogPara.uploadOption.coverImg = URL.createObjectURL(imgDataUrl.url)
    }
  }
}
</script>
<style scoped scss>
.uploadIcon-panel {
  /*width: 20px;*/
  /*height:18px;*/
  margin-right:10px ;
}
.upload-panel{
  display: flex;
  height: 40px;
  width: 30%;
  padding: 0 10px;
  align-items: center;
  border: 1px dashed#DCDFE6;
}
img{
  width:100%;
  height: 100%;
}
.el-upload{
  border: 1px solid #C0C4CC !important;
}
.avatar-uploader .el-upload {
  border: 1px solid #C0C4CC !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload--text{
  border:1px solid #C0C4CC !important;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.uploadPanel > div{
  border: 1px dashed;
}
.avatar-uploader-icon{
  border: 1px dashed #DCDFE6;
}
</style>
