import getStorageUser from '@/assets/wnms/utils/storageUser'
import {
  queryListApi,
  getJieXiStu,
  editApi
} from '@/api/wnms//msgManage/mngAudio'

import {
  selectDeptInfo
} from '@/assets/wnms/utils/common'

export default {
  data () {
    return {
      // 验证方法
      rules: {
        'nurseUnitIds': [{
          required: true,
          message: '请选择护理单元',
          trigger: 'change'
        }],
        'title': [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 16,
          message: '请输入16位以内',
          trigger: 'blur'
        }
        ]
      },
      // 音频列表
      audioList: [],
      // 床位列表
      bedList: [],
      // 房间列表
      roomList: [],
      //
      audioTypeList: [
        {
          name: '播放单',
          value: 'broadcast'
        },
        {
          name: '闹钟',
          value: 'alarm'
        }
      ],
      // 当前页码
      page: 1,
      // 每页数量
      size: 10,
      // 当前页面
      currPage: 1,
      // 护理单元列表
      nurseUnitList: {}
    }
  },
  computed: {
    // 登录用户的所有护理单元 ID 字符串
    nurseUnitIdString () {
      return getStorageUser('dataDeptInfoList').map(item => item.deptId)
    },
    // 判断音频类型
    isAudioType () {
      return this.detail.audioType === 'alarm' ? '铃声' : '音频'
    }
  },
  mounted () {
    // 获取护理单元
    this.nurseUnitList = getStorageUser('dataDeptInfoList')
  },
  methods: {
    /**
     * 获取某个音频的解析状态，并修改其解析状态
     * @param source
     * @returns {any}
     */
    getJieXiStatus (v, callBack) {
      /*setTimeout(()=>{
        this.modifyStatus(v, callBack)
      },1000*10)
      return*/

      let param = {
        fname: v.fileUrl
      }
      getJieXiStu(param).then(res => {
        if (res.status === 200 && res.data.audio_status === 'ready') {
          this.modifyStatus(v, callBack)
        } else if (res.status === 200 && res.data.audio_status === 'transcoding') {
          // 未解析完成，1分钟后再请求一次
          setTimeout(() => {
            this.getJieXiStatus(v, callBack)
          }, 1000 * 60)
        }
      }).catch(e => {
        console.log('获取解析状态失败！！', e)
      })
    },
    /**
     * 修改A10保存的音频状态
     * @param v
     */
    modifyStatus (v, callBack) {
      v.audioStatus = 1
      editApi(v).then(res => {
        if (res.status === 200) {
          if (callBack) callBack()
        }
      }).catch(e => {
        console.log('修改A10保存的音频状态失败！！', e)
      })
    },
    // 深拷贝方法
    deepClone (source) {
      const _source = JSON.stringify(source)
      const sourceClone = JSON.parse(_source)
      return sourceClone
    },

    /**
     * @获取音频列表
     */
    queryAudioListHandler (param, callback) {
      queryListApi(param).then(response => {
        this.audioList = response.data
        if (callback) callback()
        if (!this.detail.row) {
          this.formContent.audioFileId = '1'
        }
      })
    },

    // 每页数量切换
    handleSizeChange (val) {
      this.size = val
      this.queryListHandler(this.search)
      // this.queryListHandler({
      //   page: this.page,
      //   size: this.size,
      //   deptIds: this.search.deptIds,
      //   toneName: this.search.toneName,
      // })
    },
    // 分页切换
    handleCurrentChange (val) {
      this.page = val
      this.queryListHandler(this.search)
      // this.queryListHandler({
      //   page: this.page,
      //   size: this.size,
      //   deptIds: this.search.deptIds,
      //   toneName: this.search.toneName,
      // })
    },

    // 表单验证方法
    validate () {
      this.$refs['formContent'].validate(valid => {
        if (valid) {
          // ...
        } else {
          return false
        }
      })
    },

    // 清除表单验证
    clearValidate (refs) {
      alert(555)
      this.$nextTick(() => {
        this.$refs[refs].clearValidate()
      })
    },

    // 获取护理单元ID
    selectDeptInfo () {
      return selectDeptInfo()
    }
  }
}
