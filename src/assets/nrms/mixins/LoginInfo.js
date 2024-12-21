/**
  登录后的用户 、科室、职位 等信息
*/
export default {
  data () {
    return {
      empInfo: this.$localStorage.get('empInfo', {}, Object),
      deptInfo: this.$localStorage.get('deptInfo', {}, Object),
      jobInfo: this.$localStorage.get('jobInfo', {}, Object)
    }
  },
  methods: {
  }
}
