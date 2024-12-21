<template>
  <div>
    <!-- 图片上传组件辅助-->
    <el-upload
      v-show="false"
      class="avatar-uploader"
      action="/bmms/web-bm/file"
      name="img"
      accept=".jpg, .png"
      :show-file-list="false"
      :on-change="handleChange"
      :http-request="httpRequest"
      :before-upload="beforeUpload"
    />
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      class="editor ql-editor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    />
  </div>
</template>
<script>
// 工具栏配置
import { quillEditor } from 'vue-quill-editor'
import { Uploads } from '@/api/hpms/qiniu'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import ImageResize from 'quill-image-resize-module'
import * as Quill from 'quill'
var Size = Quill.import('attributors/style/size')
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '32px', '48px', '64px'] // 引入编辑器
Quill.register(Size, true)
Quill.register('modules/imageResize', ImageResize)

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  // ['blockquote', 'code-block'], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  // [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  // [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ size: Size.whitelist }],
  [{ 'align': [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  // [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ color: [] }], // 字体颜色、字体背景颜色

  ['clean'], // 清除文本格式
  ['image'] // 链接、图片
]
const toolbarTips = [
  { Choice: '.ql-bold', title: '加粗' },
  { Choice: '.ql-italic', title: '倾斜' },
  { Choice: '.ql-underline', title: '下划线' },
  { Choice: '.ql-header', title: '段落格式' },
  { Choice: '.ql-strike', title: '删除线' },
  { Choice: '.ql-blockquote', title: '块引用' },
  { Choice: '.ql-code-block', title: '插入代码段' },
  { Choice: '.ql-size', title: '字体大小' },
  { Choice: '.ql-list[value="ordered"]', title: '编号列表' },
  { Choice: '.ql-list[value="bullet"]', title: '项目列表' },
  { Choice: '.ql-header[value="1"]', title: 'h1' },
  { Choice: '.ql-header[value="2"]', title: 'h2' },
  { Choice: '.ql-align', title: '对齐方式' },
  { Choice: '.ql-color', title: '字体颜色' },
  { Choice: '.ql-background', title: '背景颜色' },
  { Choice: '.ql-image', title: '图像' },
  { Choice: '.ql-video', title: '视频' },
  { Choice: '.ql-link', title: '添加链接' },
  { Choice: '.ql-formula', title: '插入公式' },
  { Choice: '.ql-clean', title: '清除格式' },
  { Choice: '.ql-indent[value="-1"]', title: '向左缩进' },
  { Choice: '.ql-indent[value="+1"]', title: '向右缩进' },
  { Choice: '.ql-header .ql-picker-label', title: '标题大小' },
  { Choice: '.ql-header .ql-picker-item[data-value="1"]', title: '标题一' },
  { Choice: '.ql-header .ql-picker-item[data-value="2"]', title: '标题二' },
  { Choice: '.ql-header .ql-picker-item[data-value="3"]', title: '标题三' },
  { Choice: '.ql-header .ql-picker-item[data-value="4"]', title: '标题四' },
  { Choice: '.ql-header .ql-picker-item[data-value="5"]', title: '标题五' },
  { Choice: '.ql-header .ql-picker-item[data-value="6"]', title: '标题六' },
  { Choice: '.ql-header .ql-picker-item:last-child', title: '标准' },
  { Choice: '.ql-size .ql-picker-item[data-value="small"]', title: '小号' },
  { Choice: '.ql-size .ql-picker-item[data-value="large"]', title: '大号' },
  { Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: '超大号' },
  { Choice: '.ql-size .ql-picker-item:nth-child(2)', title: '标准' },
  { Choice: '.ql-align .ql-picker-item:first-child', title: '居左对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="center"]', title: '居中对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="right"]', title: '居右对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="justify"]', title: '两端对齐' }
]
export default {
  components: {
    quillEditor
  },
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: () => {}
    },
    /* 图片大小 */
    maxSize: {
      type: Number,
      default: 4000 // kb
    }
  },

  data () {
    return {
      params: {
        token: '',
        FileName: ''
      },
      content: this.value,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        placeholder: '您想说点什么？',
        theme: 'snow', // or 'bubble'
        modules: {
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
              // link: function(value) {
              //   if (value) {
              //     var href = prompt('请输入url');
              //     this.quill.format("link", href);
              //   } else {
              //     this.quill.format("link", false);
              //   }
              // },
            }
          }
        }
      },
      serverUrl: this.UploadFile(), // 这里写你要上传的图片服务器地址
      header: {
        // token: sessionStorage.token
      } // 有的图片服务器要求请求头需要有token
    }
  },
  watch: {
    value (val) {
      this.content = this.value
    }
  },
  // computed: {
  //   content () {
  //     return this.value
  //   }
  // },
  mounted () {
    for (let item of toolbarTips) {
      let tip = document.querySelector('.quill-editor ' + item.Choice)
      if (!tip) continue
      tip.setAttribute('title', item.title)
    }
  },
  created () {
    // this.$nextTick(() => {
    //   document.getElementById('self_typt-add-container').scrollTop = 0
    // })
  },
  methods: {
    UploadFile () {
      return '/bmms/web-bm/file'
    },
    onEditorBlur () {
      // 失去焦点事件
    },
    onEditorFocus () {
      // 获得焦点事件
    },
    onEditorChange () {
      // 内容改变事件
      this.content = this.content.replace(/href=/g, '')
      this.$emit('input', this.content)
    },
    cuFocus () {
      this.$nextTick(function () {
        document.getElementById('self_typt-add-container').scrollTop = 0
      })
    },
    httpRequest (param) {
      const form = new FormData()
      form.append('file', param.file, param.file.name)
      Uploads(form).then(res => {
        if (res.status === 200) {
          const quill = this.$refs.myQuillEditor.quill
          // 如果上传成功
          if (res.status === 200) {
            // 获取光标所在位置
            const length = quill.getSelection().index
            // 插入图片  res.url为服务器返回的图片地址
            quill.insertEmbed(length, 'image', res.data.urlPath)
            // 调整光标到最后
            quill.setSelection(length + 1)
          } else {
            this.$message.error('图片插入失败')
          }
          // loading动画消失
          this.quillUpdateImg = false
        }
      })
    },
    // 富文本图片上传前
    beforeUpload (file) {
      // 显示loading动画
      this.quillUpdateImg = true
      const filetype = file.name.slice(
        file.name.lastIndexOf('.'),
        file.name.length
      )
      if (filetype === '.jpg' || filetype === '.png') {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!')
          return false
        } else {
          return true
        }
      } else {
        this.$message.error('请上传PNG,JPG格式文件')
        return false
      }
    },
    handleChange (file, fileList) {
      var fileObj = file
      const form = new FormData()
      form.append('token', 'wnms')
      form.append('FileName', '44324')
      form.append('File', fileObj)
    }
  }
}
</script>

<style lang="scss">
  .ql-container{
    >div:not(.ql-editor){
      >div{
        >span{
          display: none !important;
          border:1px solid red !important;
        }
      }
    }
  }
.editor {
  line-height: normal !important;
  height: 28rem;
  overflow: hidden;
  margin-top: -1vh;
}
.ql-container {
  overflow: auto;
  height: calc(100% - 50px);
}
.ql-editor {
  p{
    img{
      max-width: 100%;
      margin: auto ;
      display: block ;
      float: none !important;
    }
  }
}
.ql-snow .ql-editor,.ql-snow .ql-editor img {
  display: block;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-toolbar {
  white-space: normal;
}
.ql-picker-item[data-value='10px']::before,
.ql-picker-label[data-value='10px']::before {
  content: '10px' !important;
}

.ql-picker-item[data-value='12px']::before,
.ql-picker-label[data-value='12px']::before {
  content: '12px' !important;
}

.ql-picker-item[data-value='14px']::before,
.ql-picker-label[data-value='14px']::before {
  content: '14px' !important;
}

.ql-picker-item[data-value='16px']::before,
.ql-picker-label[data-value='16px']::before {
  content: '16px' !important;
}

.ql-picker-item[data-value='18px']::before,
.ql-picker-label[data-value='18px']::before {
  content: '18px' !important;
}

.ql-picker-item[data-value='20px']::before,
.ql-picker-label[data-value='20px']::before {
  content: '20px' !important;
}

.ql-picker-item[data-value='24px']::before,
.ql-picker-label[data-value='24px']::before {
  content: '24px' !important;
}

.ql-picker-item[data-value='30px']::before,
.ql-picker-label[data-value='30px']::before {
  content: '30px' !important;
}

.ql-picker-item[data-value='32px']::before,
.ql-picker-label[data-value='32px']::before {
  content: '32px' !important;
}
.ql-picker-item[data-value='48px']::before,
.ql-picker-label[data-value='48px']::before {
  content: '48px' !important;
}
.ql-picker-item[data-value='64px']::before,
.ql-picker-label[data-value='64px']::before {
  content: '64px' !important;
}
.ql-picker-item[data-value='72px']::before,
.ql-picker-label[data-value='72px']::before {
  content: '72px' !important;
}

.ql-picker-item[data-value='36px']::before,
.ql-picker-label[data-value='36px']::before {
  content: '36px' !important;
}

.ql-editor .ql-indent-1:not(.ql-direction-rtl){
  text-indent: 2em;
  padding-left: 0;
}
.ql-editor .ql-indent-2:not(.ql-direction-rtl){
  text-indent: 4em;
  padding-left: 0;
}
.ql-editor .ql-indent-3:not(.ql-direction-rtl){
  text-indent: 6em;
  padding-left: 0;
}
.ql-editor .ql-indent-4:not(.ql-direction-rtl){
  text-indent: 8em;
  padding-left: 0;
}
.ql-editor .ql-indent-5:not(.ql-direction-rtl){
  text-indent: 10em;
  padding-left: 0;
}
.ql-editor .ql-indent-6:not(.ql-direction-rtl){
  text-indent: 12em;
  padding-left: 0;
}
.ql-editor .ql-indent-7:not(.ql-direction-rtl){
  text-indent: 14em;
  padding-left: 0;
}
.ql-editor .ql-indent-8:not(.ql-direction-rtl){
  text-indent: 16em;
  padding-left: 0;
}
</style>
