import {
  selectDeptInfo
} from '@/assets/hpms/utils/common'

export default {
  data () {
    return {}
  },
  methods: {
    // 获取护理单元ID
    selectDeptInfo () {
      return selectDeptInfo()
    },
    initVText () {
      return {
        dataName: 'text',
        accept: '.pdf',
        limit: 1,
        Iscallback: true,
        filelist: [],
        text_flag: false
      }
    },
    initVideo () {
      return {
        dataName: 'video',
        accept: '.mp4,.avi,.3gp,.rmvb,.wmv,.mkv,.mov,.flv,.mp3,.wav,.wma',
        limit: 1,
        Iscallback: true,
        filelist: [],
        video_flag: false
      }
    },
    initForm () {
      return {
        title: '',
        nurseUnitId: '',
        isPushOnceIn: '',
        isAskToRead: '',
        isShowDoor: 0,
        createTime: '',
        articleType: 0,
        categoryId: '',
        tags: [],
        contentText: '',
        id: '',
        contentFile: '',
        url: '',
        uploadFile: '',
        isWard: 0,
        eduVideoType: ''// 0是视频 1是音频
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
          ]
        }

      }
    },
    initRules () {
      return {
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
          max: 10,
          message: '长度在 1 到 10个字符',
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
        }]
      }
    }
  }
}
