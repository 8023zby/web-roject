/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi } from '../../../api/passport/http'
import BaseManage from './BaseManage'
export default {
  extends: BaseManage,
  methods: {
    // 查看详情
    detail (id, params = {}) {
      AxiosApi(`${this.url}/${id}`, {}, 'GET', params).then(res => {
        let icon = res.data.icon || ''
        let iconBase64 = res.data.iconBase64 || ''
        if (icon !== null && icon !== '') {
          this.imageObj.imageBase64 = iconBase64
          this.imageObj.workingPicture = icon
        }
        Object.assign(this.addFormData, res.data)
      })
    }
  }
}
