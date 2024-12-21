import {
  isChinaEnglish

} from '@/assets/wnms/utils/validate'
import {
  selectDeptInfo,
  selectDeptInfoData,
  formatter
} from '@/assets/wnms/utils/common'
import { EMessageViewType, EMessageViewTypeText } from '@/assets/wnms/utils/enums'

export default {
  data () {
    return {}
  },
  computed: {
    EMessageViewType() {
      return EMessageViewType
    },
    EMessageViewTypeText() {
      return EMessageViewTypeText
    }
  },
  methods: {
    // 获取护理单元ID
    selectDeptInfo () {
      return selectDeptInfo()
    },
    formatter () {
      return formatter(selectDeptInfoData(), null, {
        label: 'deptName',
        flag: false
      })
    },
    getMedia () {
      const mediaInfo = {
        param: {
          isFile: true, // 是否显示文件,
          name: ''// 文件名字
        },
        limit: 1,
        Iscallback: true,
        fileList: [],
        video_flag: false
      }
      return function getMediaInfo ({ fileList, messageType = EMessageViewType.audio }) {
        switch (messageType) {
          case EMessageViewType.video:
            mediaInfo.accept = '.mp4,.avi,.3gp,.rmvb,.wmv,.mkv,.mov,.flv,'
            mediaInfo.dataName = 'video'
            break;
          case EMessageViewType.audio:
            mediaInfo.accept = '.mp3,.wav,.wma'
            mediaInfo.dataName = 'audio'
            break;
          default:
            break;
        }
        if (fileList !== undefined) {
          mediaInfo.fileList = fileList
        }
        return mediaInfo
      }
    },
    initForm () {
      return {
        deptId: this.selectDeptInfo(), // 护理单元ID
        deptName: '', // 护理单元名称
        templateName: '', // 模板名称
        templateContent: '', // 模板内容
        type: 0, //0 文字 1 音视频
        fileUrl2: '',
        templateId: '' // 主键ID
      }
    },
    initRules () {
      const tempname = (rule, value, callback) => {
        if (isChinaEnglish(value)) {
          callback(new Error('只能输入中英文以及数字'))
        } else {
          callback()
        }
      }
      const fileUrl2Required = (rule, value, callback) => {
        let fileList = this.getMediaInfo({ messageType: this.form.type }).fileList
        if (value || (fileList && fileList.length)) {
          callback()
        } else {
          callback(new Error('请上传视音频'))
        }
      }
      // const tempContent = (rule, value, callback) => {
      //   if (!isSpecial(value)) {
      //     callback(new Error('不能含有特殊字符！！'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        templateName: [{
          required: true,
          message: '模板名称不能为空',
          trigger: 'blur'
        }, {
          validator: tempname,
          trigger: 'blur'
        }, {
          min: 1,
          max: 10,
          message: '长度在 1 到 10 个字符'
        }],
        templateContent: [{
          required: true,
          message: '模板内容不能为空',
          trigger: 'blur'
        }],
        fileUrl2: [
          {
            validator: fileUrl2Required,
            trigger: 'blur'
          }
        ],
      }
    },
    // 判断是否是媒体文件
    isMediaType(type) {
      return type === EMessageViewType.audio || type === EMessageViewType.video
    }
  }
}
