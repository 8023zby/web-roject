<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">添加宣教内容</div>
      <div class="typt-tit-btn" v-if="Number(form.articleType) === 0" style="position: relative;left: 83%;">
        <el-button type="success" @click="showpre()">预览</el-button>
      </div>
    </div>

    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 100%">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <el-form-item label="所属分类:" prop="categoryId">
            <el-select
              :popper-append-to-body="false"
              v-model="form.categoryId"
              placeholder="请选择"
              style="width: 36%"
            >
              <el-option
                v-for="item in Category"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标题:" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入"
              style="width: 36%"
            />
          </el-form-item>
          <el-form-item prop="mainImage" label="封面:">
            <template>
              <App-cropper
                :width="178"
                :height="178"
                :fixed-number="[1, 1]"
                v-model="form.url"
                :maxFileSize="20"
                @subUploadSucceed="handleUploadSucceed"
              />
            </template>
          </el-form-item>

          <el-form-item label="摘要:" v-if="false">
            <el-input
              :rows="4"
              style="width: 36%"
              v-model="form.summary"
              type="textarea"
              maxlength="100"
              :show-word-limit="true"
              placeholder="请输入"
            >
            </el-input>
            <br />
          </el-form-item>

          <el-form-item label="音视频文件:" prop="contentFile">
            <upload-flied
              ref="uploadVideoFile"
              :data-name="video.dataName"
              :accept="video.accept"
              :limits="video.limit"
              :filelist="video.fileList"
              :Iscallback="video.Iscallback"
              @uploadFlieds="uploadFlieds"
              :fileSize="1024"
              @isUploadFiedsFlag="isUploadFiedsFlag"
            />
            <el-link type="info" disabled>
              音频支持格式：.mp3、.wav、.wma
              <br />视频支持格式：
              .mp4、.3gp、.mpeg、.mkv、.mov、.flv、.avi、.wmv、.mpg、.rmvb
            </el-link>
          </el-form-item>

          <el-form-item label="正文录入方式:">
            <el-radio-group v-model="form.articleType">
              <el-radio :label="0">手动录入</el-radio>
              <el-radio :label="1">上传文档</el-radio>
              <!--<el-radio :label="2">上传表单</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <!-- prop="formStyle" -->
          <el-form-item
            v-if="form.articleType == 2"
            label="宣教表单样式文件:"
            prop="formStyle"
          >
            <div class="row_span">
              <el-input
                v-model="form.formStyle"
                style="width: 31%; margin-right: 10px"
              />
              <upload-flied
                ref="uploadFileStyle"
                :param="{ isFile: false, name: '导入' }"
                ismanyup="1"
                :data-name="styleTxt.dataName"
                :accept="styleTxt.accept"
                :limits="styleTxt.limit"
                :filelist="styleTxt.fileList"
                :Iscallback="styleTxt.Iscallback"
                @uploadFlieds="uploadFlieds"
                @isUploadFiedsFlag="isUploadFiedsFlag"
              >
              </upload-flied>
            </div>
          </el-form-item>

          <!-- prop="fieldStructure" -->
          <el-form-item
            v-if="form.articleType == 2"
            label="字段结构文件:"
            prop="fieldStructure"
          >
            <div class="row_span">
              <el-input
                v-model="form.fieldStructure"
                style="width: 31%; margin-right: 10px"
              />
              <upload-flied
                ref="uploadFileStru"
                :param="{ isFile: false, name: '导入' }"
                ismanyup="2"
                :data-name="struTxt.dataName"
                :accept="struTxt.accept"
                :limits="struTxt.limit"
                :filelist="struTxt.fileList"
                :Iscallback="struTxt.Iscallback"
                @uploadFlieds="uploadFlieds"
                @isUploadFiedsFlag="isUploadFiedsFlag"
              >
              </upload-flied>
            </div>
          </el-form-item>

          <el-form-item v-if="form.articleType == 1" label="上传文档:">
            <upload-flied
              ref="uploadFile"
              :data-name="text.dataName"
              :accept="text.accept"
              :limits="text.limit"
              :filelist="text.fileList"
              :Iscallback="text.Iscallback"
              :fileSize="15"
              @uploadFlieds="uploadFlieds"
              @isUploadFiedsFlag="isUploadFiedsFlag"
            />
            <el-link type="info" disabled
            >文档支持格式:pdf（大小不超过15M）</el-link
            >
          </el-form-item>

          <el-form-item
            v-if="form.articleType == 0"
            label="文章录入"
          >
            <Editor
              ref="editor"
              @input="editorChange"
              v-model="form.contentText"
              style="height: 28rem"
            />
          </el-form-item>

          <el-form-item label="关联标签">
            <el-button type="primary" @click="showTags">选择标签</el-button>
          </el-form-item>
          <el-form-item>
            <el-tag
              style="margin-left: 10px"
              v-for="(item, index) in form.tags"
              closable
              size="medium"
              :key="index"
              @close="tagClose(index)"
            >{{ labelNameById(item) }}</el-tag
            >
          </el-form-item>

          <el-form-item label="阅读要求:">
            <el-radio-group v-model="form.isAskToRead">
              <el-radio :label="0">仅阅读</el-radio>
              <el-radio :label="1">需要患者了解</el-radio>
              <el-radio :label="2"
              >需要患者了解并签字</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item label="启用状态:">
            <el-switch
              v-model="form.isEnable"
              :inactive-value="0"
              :active-value="1"
            />
          </el-form-item>

          <el-form-item label="自动推送规则:">
            <el-switch
              v-model="form.isPushOnceIn"
              :inactive-value="0"
              :active-value="1"
            />
            <label class="isShowDoor_cls">入院立即推送</label>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="$emit('option-changed', 'list')">取消</el-button>
      <el-button
        type="primary"
        :loading="btnLoading"
        @click="submitHandler('form')"
      >保存</el-button
      >
    </div>
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <!--标签弹窗-->
      <el-dialog
        title="标签"
        :visible.sync="dialogTagVisible"
        width="30%"
        :lock-scroll="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div style="margin-top: 20px" class="el-dialog-div">
          <el-tree
            :data="lableTreeList"
            show-checkbox
            node-key="id"
            default-expand-all
            check-on-click-node
            :default-checked-keys="form.tags"
            ref="tree1"
            :props="{
              label: 'categoryName',
              children: 'childsList',
            }"
          >
          </el-tree>
          <!-- <el-checkbox-group
                  v-model="newtags"
                  size="mini"
                >
                  <el-checkbox
                    border
                    v-for="labs in lableList"
                    :key="labs.id"
                    :label="labs.id"
                  >
                    <span :title="labs.tagName">{{ LimitNumber(labs.tagName) }}</span>
                  </el-checkbox>
                </el-checkbox-group> -->
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTagVisible = false">取 消</el-button>
          <el-button type="primary" @click="TagSure">确 定</el-button>
        </div>
      </el-dialog>
      <!--文章预览弹窗-->
      <el-dialog
        title="文章预览"
        :fullscreen="true"
        :visible.sync="predialog"
        :lock-scroll="true"
      >
        <template>
          <preview-view :detail="form"></preview-view>
        </template>
      </el-dialog>
    </slot>
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
    const styleTxt = this.initVText()
    const StruTxt = this.initVText()
    return {
      isWard: 1,
      Category: [],
      showVisiable: false,
      url: '',
      langExt: {
        preview: '预览'
      },
      show: false,
      imgDataUrl: '',
      lableTreeList: [],
      lableList: [], // 标签列表
      form: form,
      rules: rules,
      video: video,
      styleTxt: styleTxt,
      struTxt: StruTxt,
      text: text,
      dialogTagVisible: false, // 标签弹窗
      predialog: false,
      type: [],
      newtags: [],
      historyTag: [...form.tags],
      testSubmitIsRun: false
    }
  },

  mounted () {
    console.log('添加页输出this.detail：---', this.detail)
    deepMergeLeft(this.form, this.initForm())
    this.$nextTick(() => {
      this.showVisiable = true

      if (this.detail) {
        this.isWard = this.detail.isWard
        this.Category = this.detail.Category
        this.form.nurseUnitId =
          this.isWard === 0 ? 0 : this.selectDeptInfo()

        for (let v of this.detail.Category) {
          if (v.value === this.detail.categoryId) { this.form.categoryId = this.detail.categoryId }
        }
      }
      /* 获取标签列表 */
      // this.handleGetLable()

      let orgInfo = localStorage.getItem('orgInfo') || {}
      if (orgInfo) orgInfo = JSON.parse(orgInfo)
      // 获取标签tree列表
      lableApi.getTreeList({
        deptId: this.form.nurseUnitId,
        orgId: orgInfo.orgId
      }).then((res) => {
        if (res.status === 200) {
          this.lableTreeList = res.data
        }
      })
    })
  },
  methods: {
    // 富文本输入变化回调
    editorChange (text) {
      this.$refs['form'].clearValidate()
    },
    tagClose (index) {
      this.form.tags.splice(index, 1)
      this.$refs.tree1.setCheckedKeys(this.form.tags)
    },
    // 通过标签id获取标签名称
    labelNameById (id) {
      return this.getNameBylabelId(id, this.lableTreeList)
    },
    // 递归获取标签名称
    getNameBylabelId (id, list) {
      let res = ''
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
          res = list[i].categoryName
          console.log('id=id', res)
          break
        } else {
          if (list[i].childsList) { res = this.getNameBylabelId(id, list[i].childsList) }
          if (res) break
        }
      }
      return res
    },
    isUploadFiedsFlag (value) {
      // 音视频文件
      if (value.type === '1' || value.type === '0') {
        this.video.video_flag = value.isFlag
      } else if (value.type === '2') {
        // 文本文件 pdf
        if (value.ismanyup === '1') {
          this.styleTxt.text_flag = value.isFlag
          this.form.formStyle = value.filedsName
        } else if (value.ismanyup === '2') {
          this.struTxt.text_flag = value.isFlag
          this.form.fieldStructure = value.filedsName
        } else {
          this.text.text_flag = value.isFlag
        }
      }
    },
    showpre () {
      this.predialog = true
    },
    // 文章展示图上传成功后的地址
    handleUploadSucceed (data) {
      //  data.name  //图片名称
      //  data.url  //图片地址
      this.form.url = data.url
    },

    getTagNameById (id) {
      return 'aaa'
    },

    showTags () {
      this.dialogTagVisible = true
      // this.newtags = this.form.tags;
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

    // 标签确认
    TagSure () {
      // this.form.tags = this.newtags;
      let _list = this.$refs.tree1.getCheckedNodes()

      this.form.tags = []

      _list.forEach((item) => {
        if (item.isLabel) {
          this.form.tags.push(item.id)
        }
      })

      this.dialogTagVisible = false
    },

    // 获取路径
    uploadFlieds (data) {
      console.log('上传附件后调用：', data)
      switch (data.name) {
        case 'text':
          if (data.manyUp === '1') {
            // 表样式文件
            this.form.formStyle = data.data

            // 提交到第二个 因为是必填
            this.$refs.uploadFileStru.submit()
          } else if (data.manyUp === '2') {
            // 字段结构
            this.form.fieldStructure = data.data

            // 提交到表单
            this.submitFiledDndForm()
          } else {
            // 上传文档
            this.form.uploadFile = data.data
            // 提交到表单
            this.submitFiledDndForm()
          }
          break
        case 'video':
          this.form.eduVideoType = data.cuType || '' // 视频格式
          this.form.contentFile = data.data
          if (data.data !== '') {
            if (this.form.articleType === 1 && this.text.text_flag) {
              this.$refs.uploadFile.submit()
            } else if (this.form.articleType === 2 && this.styleTxt.text_flag) {
              this.$refs.uploadFileStyle.submit()
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
      lableApi.getInfo({ isPage: 0 }).then((res) => {
        if (res.status === 200) {
          this.lableList = res.data
        }
      })
    },

    submitFiledDndForm () {
      // 先清空后添加
      this.fromClear()
      if (this.form.isPushOnceIn === null) this.form.isPushOnceIn = 0
      this.replaceClass(() => {
        wardApi.Add(this.form)
          .then((data) => {
            this.btnLoading = false
            // this.submitSuccessHandler(data)
            if (data.status === 200) {
              this.optionSuccessHandler('success', data.desc, () => {
                this.backHandler()
              })
            } else {
              this.optionSuccessHandler('error', data.desc)
            }
          })
          .catch((res) => {
            console.log('保存有错误！！！', res)
            this.btnLoading = false
          })
      })
    },
    // 提交表单
    customSubmitHandler () {
      // 提交之前先判断，是不是重名
      console.log(JSON.stringify(this.form), '保存输出')
      wardApi
        .checkAdd(this.form)
        .then((data) => {
          console.log(data)
          if (data.data) {
            this.btnLoading = true
            if (this.video.video_flag) {
              // 判断音频的上传
              this.$refs.uploadVideoFile.submit()
            } else if (this.text.text_flag) {
              // 判断pdf的上传
              this.$refs.uploadFile.submit()
            } else if (this.styleTxt.text_flag) {
              // 判断样式表的上传
              this.$refs.uploadFileStyle.submit()
            } else if (this.struTxt.text_flag) {
              // 判断表结构的上传
              this.$refs.uploadFileStru.submit()
            } else {
              this.submitFiledDndForm()
            }
          } else {
            this.optionSuccessHandler(
              'error',
              '该护理单元已存在该标题的宣教文章，请确认后再添加'
            )
          }
        })
        .catch((res) => {
          console.log('判断是否重名有错误！！！', res)
        })
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/assets/hpms/css/self_common.scss";

.isShowDoor_cls {
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #1e87f0;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-left: 10px;
}
.row_span {
  display: flex;
  flex-direction: row;
}
.query-area > div {
  margin-right: 50px;
}

.el-checkbox.is-bordered.el-checkbox {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 110px;
}
.el-dialog-div {
  height: 45vh;
  overflow-y: auto;
  margin-top: 20px;
}
.el-tree-node__label {
  margin-left: 10px;
}
</style>
