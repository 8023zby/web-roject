<template>
  <el-dialog :title="dialogPara.dialogTit" :visible.sync="dialogPara.isShow" width="30%">
    <el-form  label-width="100px" :model="dialogPara" :rules="rules" ref="ruleForm" >
      <el-form-item label="分类" v-if="typeId === ''" :rules="[
      { required: true, message: '请输入分类', trigger: 'blur' }
    ]">
        <el-select v-model="dialogPara.getTypeId" placeholder="请选择分类" style="width: 90%">
          <el-option  v-for="(item,index) in typeList" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="dialogPara.labelTit" :rules="[
      { required: true, message: '请输入名称', trigger: 'blur' }
    ]">
        <el-input style="width: 90%" v-model.trim="dialogPara.editContent">></el-input>
      </el-form-item>
      <el-form-item :label="dialogPara.labelFile" v-if="dialogPara.isFilePara">
        <upload-flie
          ref="uploadVideoFile"
          v-model="formContent.fileUrl"
          :data-name="dialogPara.uploadOption.dataName"
          :accept="dialogPara.uploadOption.accept"
          :limits="dialogPara.uploadOption.limits"
          :filelist="dialogPara.uploadOption.fileList"
          @uploadFlieds="uploadFlieds"
          @getFilePara="getFilePara"/>
      </el-form-item>
      <el-form-item label="封面上传" v-if="dialogPara.isCover">
        <el-upload
                action="/bmms/web-bm/file"
                :show-file-list="false"
                :accept="acceptType"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
          <img v-if="dialogPara.uploadOption.coverImg" :src="dialogPara.uploadOption.coverImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogPara.isShow = false">取 消</el-button>
      <el-button type="primary" @click="editSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addEbooksType, editEbooksType, addEbook, editEbook,geteEbooksType} from '@/api/msms/ebooks/index.js'
import { addMusicType, editMusicType, addMusic, editMusic } from '@/api/msms/music/index.js'
import minxin from '@/views/msms/ebookManage/mixin.js'
import uploadFile from '@/components/msms/uploadFile/uploadFile'
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
    typeId:{
      type:String,
      default: function () {
        return ''
      }
    }
  },
  components: {
    'upload-flie': uploadFile
  },
  data () {
    return {
      typeData:[],
      rules: {
        editContent: [
          {required: true, message: '请输入', trigger: 'blur'}
          ]
      },
      editDialogVisible: false,
      editForm: {
        'name': ''
      },
      list1:'',
      isShowType: true,
      uploadIcon: require('@/assets/msms/img/uploadIcon.png'),
      imageUrl: '',
      coverImg:'',
      acceptType:'.png,.jpg,.jpeg',
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
      },
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
        }
        ]
      }
    }
  },
  watch: {
    dialogPara (val) {
      if(val.editType === 'addMusic' || val.editType === 'addEbook') {
        this.formContent.fileUrl = ''
        this.coverImg = ''
      }else if(val.editType === 'editMusic' || val.editType === 'editEbook'){
        this.formContent.fileUrl = this.dialogPara.fileUrl
        this.formContent.originalFileName = this.dialogPara.fileOriginName
        this.formContent.audioDuration  = this.dialogPara.audioDuration
        this.formContent.fileSize = this.dialogPara.fileSize
      }
    }
  },
  computed: {
  },
  mounted () {
    console.log(this.typeList)
    // 获取编辑前数据
    // this.$nextTick(() => {
    //   geteEbooksType({
    //   }).then(res => {
    //     if (res.status === 200) {
    //       this.typeData = res.data
    //       console.log('=================')
    //       console.log(this.typeData)
    //     }
    //   }).catch(error => {
    //     this.$message.error(JSON.stringify(error) + '数据获取失败')
    //   })
    // })
  },
  methods: {
    // 展开分类
    spreadClick () {
      this.activeAllType = !this.activeAllType
    },
    typeHover (id) {
      this.activeId = id
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
          console.log('----------')
          console.log(res)
          if (res.status === 200) {
            // this.getebooksType()
            this.dialogPara.isShow = false
            // 通知父组件更新最新数据
            this.$emit('upDataType', this.ebookType)
          }else if(res.status === 20001){
            this.$message.error('' + res.desc)
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'editEbooksType') {
        // 编辑电子书分类
        editEbooksType({
          id: this.dialogPara.editId,
          name: this.dialogPara.editContent
        }).then(res => {
          if (res.status === 200) {
            // this.getebooksType()
            this.dialogPara.isShow = false
            // 通知父组件更新最新数据
            this.$emit('upDataType', this.ebookType)
          }else if(res.status === 20001){
            this.$message.error('' + res.desc)
          }
        }).catch(error => {
          // this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'addEbook') {
        if (this.dialogPara.getTypeId === '') {
          this.$message.error('请选择音乐分类')
          return
        }
        if (this.formContent.fileUrl === '') {
          this.$message.error('请上传文件')
          return
        }
        addEbook({
          typeId: this.dialogPara.getTypeId,
          name: this.dialogPara.editContent,
          fileOriginName:this.formContent.originalFileName,
          storageAddress: this.formContent.fileUrl,
          filesize: this.formContent.fileSize,
          coverUrl:this.coverImg
        }).then(res => {
          if (res.status === 200) {
            this.dialogPara.isShow = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$emit('upDataList', this.ebookType)
            this.formContent.fileUrl === ''
          }else if (res.status === 20001){
            this.$message.error('' + res.desc)
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'editEbook') {
        if (this.formContent.fileUrl === '') {
          this.$message.error('请上传文件')
          return
        }
        editEbook({
          typeId: this.dialogPara.getTypeId,
          id: this.dialogPara.editId,
          fileOriginName:this.formContent.originalFileName,
          name: this.dialogPara.editContent,
          storageAddress: this.formContent.fileUrl,
          filesize: this.formContent.fileSize,
          coverUrl:this.coverImg
        }).then(res => {
          if (res.status === 200) {
            this.dialogPara.isShow = false
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.$emit('upDataList', this.ebookType)
          }else if (res.status === 20001){
            this.$message.error('' + res.desc)
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'addMusicType') {
        addMusicType({
          name: this.dialogPara.editContent
        }).then(res => {
          if (res.status === 200) {
            // this.getebooksType()
            this.dialogPara.isShow = false
            // 通知父组件更新最新数据
            this.$emit('upDataType', this.ebookType)
          }else if(res.status === 20001){
            this.$message.error('' + res.desc)
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'editMusicType') {
        // 编辑音乐分类
        editMusicType({
          id: this.dialogPara.editId,
          name: this.dialogPara.editContent
        }).then(res => {
          if (res.status === 200) {
            // this.getebooksType()
            this.dialogPara.isShow = false
            // 通知父组件更新最新数据
            this.$emit('upDataType', this.ebookType)
          }else if(res.status === 20001){
            this.$message.error('' + res.desc)
          }
        }).catch(error => {
          // this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'editMusic') {
        // this.getDuration(JSON.parse(res.data).url)
        // this.formContent.fileUrl = JSON.parse(res.data).url
        if (this.formContent.fileUrl === '') {
          this.$message.error('请上传文件')
          return
        }
        editMusic({
          typeId: this.dialogPara.getTypeId,
          id: this.dialogPara.editId,
          name: this.dialogPara.editContent,
          fileOriginName:this.formContent.originalFileName,
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
          }else if (res.status === 20001){
            this.$message.error('' + res.desc)
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      } else if (this.dialogPara.editType === 'addMusic') {
        if (this.dialogPara.getTypeId === '') {
          this.$message.error('请选择音乐分类')
          return
        }
        if (this.formContent.fileUrl === '') {
          this.$message.error('请上传文件')
          return
        }
        addMusic({
          typeId: this.dialogPara.getTypeId,
          name: this.dialogPara.editContent,
          fileOriginName:this.formContent.originalFileName,
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
            this.$emit('upDataList', this.ebookType)
            this.formContent.fileUrl === ''
          }else if (res.status === 20001){
            this.$message.error('' + res.desc)
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
      }
    },
    // 接收上传组件得返回结果
    uploadFlieds (res) {
      if (res.data === '') {
        this.formContent.fileUrl = res.data
        this.formContent.audioDuration = res.data
        this.formContent.originalFileName = res.data
      } else {
        // 清除上传组件验证结果
        // this.$refs['formContent'].clearValidate(['fileUrl'])
        this.getDuration(JSON.parse(res.data).url)
        this.formContent.fileUrl = JSON.parse(res.data).url
        this.formContent.originalFileName = JSON.parse(res.data).name
      }
    },
    // 音频获取时长
    getDuration (url) {
      const _this = this
      // 获取录音时长
      // 经测试，发现audio也可获取视频的时长
      // `http://192.168.30.154/${url}`
      let _audioDuration
      // const audioElement = new Audio(`http://192.168.30.153${url}`)
      const audioElement = new Audio(`http://${window.location.host}${url}`)
      console.log(audioElement)
      audioElement.addEventListener('loadedmetadata', function (_event) {
        // 得到时长
        _audioDuration = `${parseInt(audioElement.duration / 60)}:${(parseInt(audioElement.duration % 60) < 10) ? ('0' + parseInt(audioElement.duration % 60)) : parseInt(audioElement.duration % 60)}`
        // 赋值时长
        _this.formContent.audioDuration = _audioDuration
      })
    },
    getFilePara (fileSize) {
      this.formContent.fileSize = fileSize
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
      console.log(file)
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
    handleAvatarSuccess(res, file) {
      console.log(res)
      if(res.status === 200){
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.coverImg = res.data.urlPath
        this.dialogPara.uploadOption.coverImg = URL.createObjectURL(file.raw);
      }else{
        this.$message.error('上传失败')
      }
    },
    beforeAvatarUpload(file) {
      var filename = file.name.substring(file.name.lastIndexOf('.'))
      const accept = this.acceptType.split(',')
      // 传给父组件文件大小
      this.$emit('getFilePara', (file.size / 1024 / 1024).toFixed(1))
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!accept.includes(filename)) {
        // 选择的不是当前格式
        this.$message.warning(`请上传 ${accept} 文件!`)
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
    }
  }
}
</script>
<style scoped scss>
.uploadIcon-panel {
  width: 20px;
  height:18px;
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
</style>
