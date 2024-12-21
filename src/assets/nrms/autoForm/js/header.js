export default {
  data () {
    return {
      baseObj: {
        hospitalName: '待获取的医院名若没有此处在模板中直接输入即可',
        formName: '',
        hospitalLogo: '/static/passport/img/yarward.png'
      },
      dataObj: {
        tplId: '',
        tplHtml: '',
        tplData: {
          pName: '张吉',
          sex: '女',
          age: '11',
          pDept: '儿科',
          pNumber: '202004100001',
          bedNo: '03-01'
        }
      }
    }
  },
  methods: {

  }
}
