import { saveUserFace, updateUserFace, deleteUserFace, getUserFace } from '../../../api/passport/userFace'
import { MsgShow } from '../js/Message'
export default {
  data () {
    return {
      biometricId: [],
      saveType: ''
    }
  },
  created () {
    if (this.imageObj.fromWhere === 'face') {
      this.saveType = 1
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
          if (this.imageObj.fromWhere === 'face') {
            this.biometricId = res.data
            this.list = []
            res.data.forEach((item) => {
              this.list.push({
                imageUrl: item.resources,
                status: item.status
              })
            })
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
        biometricId: this.biometricId[this.imgIndex].biometricId
      }).then(res => {
        if (res.status !== 200) {
          MsgShow('error', res.desc, 3000)
        } else {
          this.getFaceData()
        }
      })
    },
    // 删除数据
    deleteFaceData (index) {
      deleteUserFace({
        userId: this.imageObj.userId,
        biometricId: this.biometricId[index].biometricId
      }).then(res => {
        if (res.status !== 200) {
          MsgShow('error', res.desc, 3000)
        } else {
          this.getFaceData()
        }
      })
    }
  }
}
