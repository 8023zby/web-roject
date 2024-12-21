import { saveUserFace, updateUserFace, deleteUserFace, getUserFace } from '../../../api/passport/userFace'
import { MsgShow } from '../js/Message'
export default {
  data () {
    return {
      biometricId: '',
      saveType: ''
    }
  },
  created () {
    if (this.imageObj.fromWhere === 'sign') {
      this.saveType = 2
      this.getFaceData()
    }
  },
  methods: {
    // 请求生物识别数据
    getFaceData () {
      getUserFace({
        userId: this.imageObj.userId,
        type: this.saveType
      }).then(res => {
        if (res.status === 200) {
          if (this.imageObj.fromWhere === 'sign') {
            if (res.data.length > 0) {
              this.biometricId = res.data[0].biometricId
              this.imageObj.imageUrl = res.data[0].resources
            }
          }
        }
      })
    },
    // 保存数据
    saveFaceData (path) {
      saveUserFace({
        userId: this.imageObj.userId,
        type: this.saveType,
        resources: path
      }).then(res => {
        if (res.status !== 200) {
          MsgShow('error', res.desc, 3000)
        } else {
          this.getFaceData()
        }
      })
    },
    // 修改数据
    updateFaceData (path) {
      updateUserFace({
        userId: this.imageObj.userId,
        type: this.saveType,
        resources: path,
        biometricId: this.biometricId
      }).then(res => {
        if (res.status !== 200) {
          MsgShow('error', res.desc, 3000)
        } else {
          this.imageObj.imageUrl = path
        }
      })
    },
    // 删除数据
    deleteFaceData () {
      deleteUserFace({
        userId: this.imageObj.userId,
        biometricId: this.biometricId
      }).then(res => {
        if (res.status !== 200) {
          MsgShow('error', res.desc, 3000)
        } else {
          this.imageObj.imageUrl = ''
          this.biometricId = ''
        }
      })
    }
  }
}
