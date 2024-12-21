import {
  selectDeptInfo
} from '@/assets/hpms/utils/common'
import * as wardApi from '@/api/hpms/eduCation/ward'

export default {
  data () {
    return {
      btnLoading: false
    }
  },
  mounted () {
  },
  methods: {

    fromClear () {
      // 先提文件后提交表单
      if (this.form.articleType === 0) {
        // 上传文档1
        this.form.uploadFile = ''
        // 上传表单 2
        this.form.formStyle = '' // 表样式文件 1
        this.form.fieldStructure = '' // 字段结构2
        // 清除 1 2
      } else if (this.form.articleType === 1) {
        // 富文本编译器0
        this.form.contentText = ''
        // 上传表单 2
        this.form.formStyle = '' // 表样式文件 1
        this.form.fieldStructure = '' // 字段结构2
        // 清除 0 2
      } else {
        // 富文本编译器0
        this.form.contentText = ''
        // 上传文档1
        this.form.uploadFile = ''
        // 清除 0 1
      }
      this.form.isWard = this.isWard
    },
    // 获取护理单元ID
    selectDeptInfo () {
      return selectDeptInfo()
    },
    // 替换富文本编辑器内容的class
    replaceClass (callback) {
      var str = [];
      if (!this.form.contentText) {
        this.form.contentText = ''
      }
      this.form.contentText.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
        str.push(match)
      })

      for(let v of str.values()){
        let vv = this.form.contentText.split(v)
        this.form.contentText = vv[0] +'<p>'+v+'</p>'+ vv[1]
      }
      if(!this.form.contentFile)this.form.eduVideoType = ''
      if (callback) callback()
    },
    initVText () {
      return {
        param: {
          isFile: true, // 是否显示文件,
          name: ''// 文件名字
        },
        dataName: 'text',
        accept: '.pdf', // ,.ppt,.pptx,.doc,.docx
        limit: 1,
        Iscallback: true,
        filelist: [],
        text_flag: false
      }
    },
    initVideo () {
      return {
        param: {
          isFile: true, // 是否显示文件,
          name: ''// 文件名字
        },
        dataName: 'video',
        accept: '.mp4,.3gp,.mpeg,.mkv,.mov,.flv,.avi,.wmv,.mpg,.rmvb,.mp3,.wav,.wma',
        limit: 1,
        Iscallback: true,
        filelist: [],
        video_flag: false
      }
    },
    initForm () {
      return {
        title: '', // 标题
        nurseUnitId: '', // 护理单元
        isShowDoor: 1, // 自动推送规则
        createTime: '', // 添加时间
        articleType: 0, // 0,手动录入；1,上传文档；2、音频；3、视频
        categoryId: '',
        tags: [], // 标签
        contentText: '', // 文章内容
        id: '',
        contentFile: '', // 存放音频或视频
        url: '', // 封面图
        uploadFile: '', // 上传文档内容
        isWard: 0,
        eduVideoType: '', // 0是视频 1是音频
        formStyle: '', // 表样式文件
        fieldStructure: '', // 字段结构
        summary: '', // 摘要
        isEnable: 1, //  0 没启用 1 启用
        isAskToRead: 0, //  阅读要求: 0 阅读 1  患者了解 2 了解并签字
        isPushOnceIn: '' //  是否入院立即宣教
      }
    },
    initAssortform () {
      const deptId = this.selectDeptInfo()
      return {
        listData: [],
        Tform: {
          id: '',
          categoryName: '',
          nurseUnitId: deptId,
          title: '添加'
        },

        dialogFormVisible: false, // 添加编辑
        roles: {
          categoryName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            {
              min: 1,
              max: 10,
              message: '长度在 1 到 10个字符',
              trigger: 'blur'
            }
          ],
          nurseUnitId: [
            { required: true, message: '请选择护理单元', trigger: 'change' }
          ],
        }
      }
    },
    initRules () {
      const that = this
      return {
        formStyle: [{
          required: true,
          message: '请导入文件',
          trigger: 'change'
        }],
        fieldStructure: [{
          required: true,
          message: '请导入文件',
          trigger: 'change'
        }],
        categoryId: [{
          required: true,
          message: '请选择所属分类',
          trigger: 'change'
        }],
        nurseUnitId: [{
          required: true,
          message: '请选择护理单元',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '请填写文章标题',
          trigger: 'blur'
        }, {
          min: 1,
          max: 16,
          message: '长度在 1 到 16个字符',
          trigger: 'blur'
        }],
        articleType: [{
          required: true,
          message: '请选录入方式',
          trigger: 'blur'
        }],
        contentText: [{
          required: true,
          message: '请填写文章录入',
          trigger: 'blur'
        }, {
          min: 1,
          max: 10000,
          message: '长度限制在10000个字符',
          trigger: 'blur'
        }],
        contentFile: [
          {
            validator(rule, value, callback, source, options) {
              const isTextFile = () => {
                return that.form.articleType === 1 && (that.text.text_flag || that.text.filelist && that.text.filelist.length)
              }
              const isTextContent = () => {
                return that.form.articleType === 0 && that.form.contentText
              }
              const isMediaFile = () => {
                return that.video.video_flag || that.video.filelist && that.video.filelist.length
              }
              if(isTextFile() || isTextContent() || isMediaFile()) {
                callback()
              } else {
                callback(new Error('内容与音视频不能同时为空'))
              }
            }
          },
        ],
      }
    }
  }
}
