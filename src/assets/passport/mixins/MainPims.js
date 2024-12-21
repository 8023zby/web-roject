/**
 * 养老相关逻辑
 */
import { AxiosApi } from '../../../api/passport/http'

export default {
  data () {
    return {
      colorObj: {
        '#1E87F0': 'data-theme-blue',
        '#FF9D11': 'data-theme-orange',
        '#009995': 'data-theme-green',
        '#743B8F': 'data-theme-purple',
        '#E0241B': 'data-theme-red'
      }
    }
  },
  methods: {
    // 获取主题颜色
    getSystemColor () {
      AxiosApi('/passport/web-rbac/systemConfigs/systemThemeColor', {}, 'GET').then(res => {
        if (res.status === 200) {
          let data = res.data
          if (data !== null) {
            let color = (data.systemThemeColor === null || data.systemThemeColor === '') ? 'data-theme-blue' : this.colorObj[data.systemThemeColor]
            this.dataTheme = color
          }
        } else {
          this.dataTheme = 'data-theme-blue'
        }
        this.menuShow = true
      }).catch(() => {
        this.dataTheme = 'data-theme-blue'
        this.menuShow = true
      })
    }
  }
}
