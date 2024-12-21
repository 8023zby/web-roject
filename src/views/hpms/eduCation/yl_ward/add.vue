<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo" />
      <div class="typt-tit-content">新建文章</div>
    </div>

    <div class="typt-add-container">
      <div class="typt-add-form" style="width:1000px">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <!-- <el-form-item v-if="detail.isWard===1" label="文章展示护理单元" prop="nurseUnitId">
            <el-select v-model="form.nurseUnitId" placeholder="请选择">
              <el-option
                v-for="item in detail.nurseUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>-->

          <el-form-item label="请选择所属分类" prop="categoryId">
            <el-select :popper-append-to-body="false" v-model="form.categoryId" placeholder="请选择">
              <el-option
                v-for="item in  detail.Category.filter(item =>
                this.detail.isWard === 0 ? item.type === '0' : item.type !== '0'
                )"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="请输入文章标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入文章标题" />
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item label="文章展示图">
            <template>
              <App-cropper
                :width="178"
                :height="178"
                :fixed-number="[1,1]"
                v-model="form.url"
                @subUploadSucceed="handleUploadSucceed"
              />
            </template>
          </el-form-item>
          <el-form-item label="请上传音视频文件">
            <upload-flied
              ref="uploadVideoFile"
              :data-name="video.dataName"
              :accept="video.accept"
              :limits="video.limit"
              :filelist="video.fileList"
              :Iscallback="video.Iscallback"
              @uploadFlieds="uploadFlieds"
              @isUploadFiedsFlag="isUploadFiedsFlag"
            />
            <el-link
              type="info"
              disabled
            >音频支持格式:mp3,wav,wma；视频支持格式 mp4,avi,3gp,rmvb,wmv,mkv,mov,flv；</el-link>
          </el-form-item>
          <el-form-item label="正文录入方式">
            <el-radio-group v-model="form.articleType">
              <el-radio :label="0">手动输入</el-radio>
              <el-radio :label="1">上传文档</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.articleType==1" label="请上传宣教文档">
            <upload-flied
              ref="uploadFile"
              :data-name="text.dataName"
              :accept="text.accept"
              :limits="text.limit"
              :filelist="text.fileList"
              :Iscallback="text.Iscallback"
              @uploadFlieds="uploadFlieds"
              @isUploadFiedsFlag="isUploadFiedsFlag"
            />
            <el-link type="info" disabled>文档支持格式:pdf；</el-link>
          </el-form-item>
          <el-form-item v-else label="文章录入" prop="contentText">
            <Editor ref="editor" v-model="form.contentText" style="height:28rem" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button type="success" @click="showpre()">预览</el-button>
      <el-button type="primary" @click="submitHandler('form')">提交</el-button>
      <el-button @click="$emit('option-changed', 'list')">取消</el-button>
    </div>
    <!--标签弹窗-->
    <el-dialog title="标签" :visible.sync="dialogTagVisible" width="50%" :lock-scroll="true"
               :close-on-click-modal=false
               :close-on-press-escape=false
    >
      <div style="margin-top: 20px" class="el-dialog-div">
        <el-checkbox-group v-model="form.tags" size="mini" @change="handleCheckedCitiesChange">
          <el-checkbox border v-for="labs in lableList" :key="labs.id" :label="labs.id">
            <span :title="labs.tagName">{{ LimitNumber(labs.tagName) }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="TagCancel">取 消</el-button>
        <el-button type="primary" @click="dialogTagVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--文章预览弹窗-->
    <el-dialog title="文章预览" :fullscreen="true" :visible.sync="predialog" :lock-scroll="true">
      <template>
        <preview-view :detail="form"></preview-view>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import BaseEditForm from '../../common/BaseEditForm'
import { deepMergeLeft } from '@/assets/hpms/utils'
import * as wardApi from '@/api/hpms/eduCation/ward'
import * as lableApi from '@/api/hpms/eduCation/lableManage'
import mains from './main'

import uploadFlied from '@/components/hpms/Upload/NewUploadFlied'
import Editor from '@/components/hpms/QuillEditor/Editor'
import { formatter } from '@/assets/hpms/utils/common'
import AppCropper from '@/components/hpms/Upload/Upload'
import previewView from './previewView'

export default {
  components: {
    uploadFlied,
    Editor,
    AppCropper,
    previewView
  },
  mixins: [BaseEditForm, mains],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    const form = this.initForm()
    const rules = this.initRules()
    const video = this.initVideo()
    const text = this.initVText()
    return {
      url: '',
      langExt: {
        preview: '预览'
      },
      show: false,
      imgDataUrl: '',
      lableList: [], // 标签列表
      form: form,
      rules: rules,
      video: video,
      text: text,
      dialogTagVisible: false, // 标签弹窗
      predialog: false,
      type: [],
      historyTag: [...form.tags],
      guestInfo: {
        icon: ''
      },
      guestUpInfo: ''
    }
  },
  mounted () {
    deepMergeLeft(this.form, this.initForm())
    this.$nextTick(() => {
      this.$refs['form'].clearValidate()
    })
    this.form.nurseUnitId = this.detail.isWard === 0 ? 0 : this.selectDeptInfo()
    /* 获取标签列表 */
    this.handleGetLable()
  },
  methods: {
    isUploadFiedsFlag (value) {
      // 音视频文件
      if (value.type === '1' || value.type === '0') {
        this.video.video_flag = value.isFlag
      } else if (value.type === '2') {
        // 文本文件 pdf
        this.text.text_flag = value.isFlag
      }
    },
    // 文章展示图上传成功后的地址
    handleUploadSucceed (data) {
      //  data.name  //图片名称
      //  data.url  //图片地址
      this.form.url = data.url
    },
    showpre () {
      this.predialog = true
    },
    showTags () {
      this.dialogTagVisible = true
    },
    tagsList (id) {
      return formatter(this.lableList, id, { value: 'id', label: 'tagName' })
    },
    LimitNumber (txt) {
      if (txt.length > 6) {
        txt = txt.substr(0, 5) + '...'
      }
      return txt
    },
    // 标签清空
    TagCancel () {
      if (this.form.tags.length !== this.historyTag.length) {
        this.form.tags = this.historyTag
      }
      // if (!this.form.tags.length > 0) {
      //   this.form.tags = []
      // }
      this.dialogTagVisible = false
    },
    // 获取路径
    uploadFlieds (data) {
      switch (data.name) {
        case 'text':
          this.form.uploadFile = data.data
          if (data.data !== '') {
            this.submitFiledDndForm()
          }
          break
        case 'video':
          this.form.eduVideoType = data.cuType || '' // 视频格式
          this.form.contentFile = data.data
          if (data.data !== '') {
            if (this.form.articleType === 1 && this.text.text_flag) {
              this.$refs.uploadFile.submit()
            } else {
              this.submitFiledDndForm()
            }
          }
          break
      }
    },

    /* 上传文件地址 */
    UploadFile () {
      return '/bmms/web-bm/file'
    },

    toggleShow () {
      this.show = !this.show
    },

    /* 标签获取列表 */
    handleGetLable () {
      lableApi.getInfo({ isPage: 0 }).then(res => {
        if (res.status === 200) {
          this.lableList = res.data
        }
      })
    },

    /* 获取标签 */
    handleCheckedCitiesChange (value) {
      this.form.tags = value
    },

    submitFiledDndForm () {
      // 先提文件后提交表单
      if (this.form.articleType === 0) {
        this.form.uploadFile = ''
      } else {
        this.form.contentText = ''
      }
      this.form.isWard = this.detail.isWard
      wardApi.Add(this.form).then(data => {
        this.submitSuccessHandler(data)
      })
    },
    // 提交表单
    customSubmitHandler () {
      if (this.video.video_flag) {
        this.$refs.uploadVideoFile.submit()
      } else if (this.text.text_flag) {
        this.$refs.uploadFile.submit()
      } else {
        this.submitFiledDndForm()
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.query-area > div {
  margin-right: 50px;
}

.item {
  display: inline-table;
  width: 15%;
}

.el-checkbox.is-bordered.el-checkbox {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 110px;
}
.el-dialog-div {
  height: 30vh;
  overflow-y: auto;
  margin-top: 20px;
}
</style>
