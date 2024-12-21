<!--
  文件描述：铃声/音频添加组件
  创建时间：2020/4/21 15:58
  创建人：Administrator
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
      <el-main class="dialog-from-main addBell-main typt-add-dialog" style="width: 600px">
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
              v-model="formContent.fileUrl2"
              :data-name="uploadOption.dataName"
              :accept="uploadOption.accept"
              :limits="uploadOption.limits"
              :filelist="uploadOption.fileList"
              :fileSize="uploadOption.fileSize"
              @uploadFlieds="uploadFlieds"
              @uploadFliedsChange="uploadFliedsChange"
              @changeLoading="changeLoading"
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
import './mngClock.scss'
import mixin from './mixin'
import uploadFlied from '@/components/wnms/Upload/uploadFileNew'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'

import {
  queryDetailsApi,
  addApi,
  editApi
} from '@/api/wnms//msgManage/mngAudio'

let checkBellList = []
export default {
  components: {
    uploadFlied
  },
  mixins: [mixin, BaseQueryPageForm],
  props: ['bellList'],
  data () {
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
            trigger: 'change'
          },
          {
            min: 1,
            max: 16,
            message: '请输入16位以内',
            trigger: 'blur'
          }
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
  mounted () {
    checkBellList = []
    for (const item of this.bellList) {
      checkBellList.push(item.audioName)
    }
  },
  methods: {
    changeLoading () {
      this.addLoading = false
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
      if (checkBellList.indexOf(this.formContent.audioName) > -1) {
        this.$message({
          message: '已存在该名称,不能重复添加',
          type: 'warning'
        })
        return false
      }
      this.$refs['formContent'].validate(valid => {
        if (valid) {
          this.addLoading = true
          this.$refs.refUploadFile.submit()
        } else {
          return false
        }
      })
    },

    /**
     * @编辑音频
     */
    editHandler (param) {
      this.$refs['formContent'].validate(valid => {
        if (valid) {
          this.addLoading = true
          // 1、只改了音频名称
          if (!this.isFileChange) {
            this.editSave()
          } else if (this.isFileChange) {
            this.$refs.refUploadFile.submit()
          }
        } else {
          return false
        }
      })
    },
    // A10编辑保存
    editSave () {
      console.log('编辑保存：\n', this.isFileChange, JSON.stringify(this.formContent))
      editApi({
        id: this.detail.row.id,
        ...this.formContent
      }).then(response => {
        // 返回音频列表
        this.IsSuccess(response, () => {
          this.addLoading = false
          this.$emit('closeAdd', 'refresh')
        })
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
        this.formContent.audioDuration = res.data.formatDuration
        this.formContent.fileUrl = res.data.urlPath
        this.formContent.originalFileName = res.data.sourceFileName

        if (this.detail.type === 'edit') {
          setTimeout(() => {
            this.editSave()
          }, 500)
        } else {
          addApi(this.formContent).then(response => {
            // 返回音频列表
            this.IsSuccess(response, () => {
              this.$emit('closeAdd', 'refresh')
            })
          }).catch(error => {
            console.log('添加失败！', error)
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
