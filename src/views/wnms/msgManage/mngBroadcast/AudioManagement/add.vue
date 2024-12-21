<!--
  文件描述:音频添加组件
  创建时间:2020/9/21
  创建人:Administrator
-->
<template>
  <el-dialog
    :visible.sync="dialogSortVisible"
    :title="detail.type === 'edit' ? '编辑' : '添加'"
    :close-on-click-modal=false
    :close-on-press-escape=false
    :show-close="false"
    width="500px"
  >
    <el-container v-loading="addLoading">
      <el-main class="dialog-from-main addBell-main" style="width: 600px">
        <el-form
          ref="formContent"
          :model="formContent"
          :rules="rules"
          label-width="95px"
        >
          <!-- 名称 -->
          <el-form-item
            :label="detail.audioType == 'alarm' ? '铃声名称' : '音频名称'"
            prop="audioName"
          >
            <el-input
              v-model.trim="formContent.audioName"
              type="text"
              maxlength="16"
            />
          </el-form-item>

          <!-- 上传 -->
          <el-form-item
            :label="detail.audioType == 'alarm' ? '上传铃声' : '上传名称'"
            prop="fileUrl2"
          >
            <upload-flied
              ref="refUploadFile"
              action="/janus/upload_audio"
              v-model="formContent.fileUrl2"
              :data-name="uploadOption.dataName"
              :accept="uploadOption.accept"
              :limits="uploadOption.limits"
              :filelist="uploadOption.fileList"
              :fileSize="uploadOption.fileSize"
              @uploadFlieds="uploadFlieds"
              @uploadFliedsChange="uploadFliedsChange"
              @changeLoading=changeLoading
            />
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>

    <div slot="footer" class="dialog-footer">

      <el-button @click="closeDialog" :disabled="addLoading">取 消</el-button>
      <el-button
        :disabled="addLoading"
        type="primary"
        @click="
          detail.type === 'edit' ? editHandler(detail.row.id) : addHandler()
        "
      >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import mixin from '../../mngClock/mixin'
import uploadFlied from '@/components/wnms/Upload/uploadFileNew'
import BaseQueryPageForm from '../../../common/BaseQueryPageForm'

import {
  queryDetailsApi,
  addApi,
  editApi,
  delShiyinpin
} from '@/api/wnms//msgManage/mngAudio'

export default {
  components: {
    uploadFlied
  },
  mixins: [mixin, BaseQueryPageForm],
  data () {
    const validatebroadcaseName = (rule, value, callback) => {
      console.log(this.checkSpecialKey(value))
      if (!this.checkSpecialKey(value)) {
        callback(new Error('名称不能含有特殊字符！'))
      } else {
        callback()
      }
    }
    return {
      addLoading: false,
      isFileChange: false, // 上传的附件是否有更改
      detail: {
        type: 'add'
      },
      dialogSortVisible: false,
      // 验证方法
      rules: {
        fileUrl2: [
          {
            required: true,
            message: '请上传音频',
            trigger: 'change'
          }
        ],
        audioName: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 16,
            message: '请输入16位以内',
            trigger: 'blur'
          }, { validator: validatebroadcaseName, trigger: 'blur' }
        ]
      },
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
      formContent: {
        deptId: this.selectDeptInfo(),
        audioName: '',
        originalFileName: '',
        audioDuration: '',
        fileUrl: '',
        fileUrl2: '',
        audioType: 'broadcast'
      }
    }
  },
  mounted () {},
  methods: {
    changeLoading () {
      this.addLoading = false
    },
    checkSpecialKey (str) {
      var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——-|{}【】‘；：”“'。，、？]‘'"
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
          return false
        }
      }
      return true
    },
    init () {
      this.dialogSortVisible = true

      // 默认添加类型
      this.formContent.audioType = this.detail.audioType
      // 编辑时回显数据
      if (this.detail.row) {
        // 请求音频详情数据
        queryDetailsApi(this.detail.row.id).then(response => {
          this.formContent.deptId = response.data.deptId
          this.formContent.audioName = response.data.audioName
          this.formContent.audioType = response.data.audioType
          this.formContent.audioDuration = response.data.audioDuration
          this.formContent.fileUrl = response.data.fileUrl
          this.formContent.fileUrl2 = 1
          this.formContent.originalFileName = response.data.originalFileName

          this.uploadOption.fileList = [
            {
              name: response.data.originalFileName,
              url: response.data.fileUrl
            }
          ]
        })
      }
    },
    closeDialog () {
      this.$emit('closeAdd')
    },
    /**
     * @添加音频
     */
    addHandler () {
      this.$refs['formContent'].validate(valid => {
        if (valid) {
          this.addLoading = true
          this.$refs.refUploadFile.dataFile.fname = this.formContent.audioName + '#yh#' + this.formContent.deptId
          this.$refs.refUploadFile.submit()
        } else {
          return false
        }
      })
    },

    /**
     * @编辑音频
     * 1、只改了音频名称 - 修改自己数据库
     * 2、只改了附件 - 音视频先删除，再保存；自己数据库直接修改
     * 3、附件和音频名称都改了
     * 4、没有修改
     */
    editHandler (param) {
      this.$refs['formContent'].validate(valid => {
        if (valid) {
          this.addLoading = true
          // 1、只改了音频名称
          if (!this.isFileChange && this.formContent.fileUrl !== this.formContent.audioName) {
            this.editSave()
          } else if (this.isFileChange) {
            // 2、只改了附件  - 音视频先删除，再保存；自己数据库直接修改
            delShiyinpin({ fname: this.formContent.fileUrl }).then(res => {
              console.log('音视频先删除返回参数:', res)
              if (res.status === 200) {
                this.$refs.refUploadFile.dataFile.fname = this.formContent.audioName + '#yh#' + this.formContent.deptId
                this.$refs.refUploadFile.submit()
              }
            })
          } else {
            console.log('没有修改任何内容，直接关闭弹窗')
            this.$emit('closeAdd', 'refresh')
          }
        }
      })
    },
    // A10接口添加or编辑失败，删除对应音频
    FailA10 () {
      delShiyinpin({ fname: this.formContent.fileUrl }).then(res => {
        console.log('音视频删除返回参数:', res)
        if (res.status === 200) {
        }
      })
    },
    // A10编辑保存
    editSave () {
      console.log('编辑保存:\n', this.isFileChange, JSON.stringify(this.formContent))
      editApi({
        id: this.detail.row.id,
        ...this.formContent
      }).then(response => {
        // 返回音频列表
        this.IsSuccess(response, () => {
          this.addLoading = false
          this.$emit('closeAdd', 'refresh')
        })
      }).catch(e => {
        console.log(e, '--------------编辑失败！！！')
        this.addLoading = false
        this.FailA10()
      })
    },
    // 附件改变时，回调
    uploadFliedsChange (res) {
      console.log('附件改变时，回调函数\n', JSON.stringify(res))
      this.isFileChange = true
      if (res.type === 'del') {
        this.formContent.fileUrl2 = ''
      } else if (res.type === 'change') {
        // 清除上传组件验证结果
        this.$refs['formContent'].clearValidate(['fileUrl2'])
        this.formContent.fileUrl2 = '1'
        this.formContent.originalFileName = res.file.name
      }
    },
    // 接收上传组件得返回结果
    uploadFlieds (res) {
      console.log('接收上传组件得返回结果\n', JSON.stringify(res))

      if (res.status !== 200) {
        this.addLoading = false
        return
      }
      if (res.data === '') {
        this.formContent.fileUrl = res.data
        this.formContent.audioDuration = res.data
        this.formContent.originalFileName = res.data
      } else {
        // 清除上传组件验证结果
        this.$refs['formContent'].clearValidate(['fileUrl'])
        //
        this.formContent.audioDuration = res.data.formatDuration
        this.formContent.fileUrl = res.data.fileName
        this.formContent.originalFileName = res.data.originalFileName
        this.formContent.audioStatus = 0

        if (this.detail.type === 'edit') {
          setTimeout(() => {
            this.editSave()
          }, 500)
        } else {
          addApi(this.formContent).then(response => {
            // 返回音频列表
            this.IsSuccess(response, () => {
              this.addLoading = false
              this.$emit('closeAdd', 'refresh')
            })
          }).catch(error => {
            console.log('添加失败！', error)
            this.FailA10()
            this.addLoading = false
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.addBell-main {
  width: 500px;
  height: 300px !important;
  overflow: hidden !important;
  padding: 15px 20px !important;
  .el-form {
    .el-form-item {
      margin-bottom: 30px !important;
      width: 90%;
    }
  }
}
</style>
