<script>
import Vue from 'vue/dist/vue.esm.js'
import moment from 'moment'
import { ApiNurseUploadLogo } from '@/api/nrms'

export default {
  data () {
    return {
      baseObj: {
        hospitalName: JSON.parse(localStorage.getItem('orgInfo')).orgName || '',
        formName: '',
        hospitalLogo: '/static/nrms/unit_logo/logo.png'
      },
      dataObj: {
        moduleId: '',
        tplId: '',
        tplHtml: '',
        tplData: {
          'patientId': '',
          'id': '',
          'deptId': '',
          'personIdNo': '',
          'inFqcy': '',
          'patientName': '',
          'sex': '',
          'doctorName': '',
          'nurseName': '',
          'inpNo': '',
          'bedName': '',
          'nurseLevel': '',
          'orgId': '',
          'createUser': '',
          'birthday': '',
          'createTime': '',
          'inTime': '',
          'patientAge': '',
          'deptName': '',
          'deptNameCode': '',
          'bedId': '',
          'illnessStatus': '',
          'insuranceType': '',
          'diagnose': '',
          'diet': '',
          'allergy': '',
          'wristband': '',
          'operationTime': '',
          'inDeptTime': '',
          'display': '',
          'patientType': ''
        }
      },
      /* CSS相关，为适配打印 */
      styleObj: {
        ulStyle: {
          width: '100%',
          margin: '15px auto',
          padding: '0',
          'list-style-type': 'none',
          clear: 'both',
          'text-align': 'center',
          'max-width': '900px'
        },
        ulAll: {
          width: '99%'

        },
        ulTable: {
          display: 'table'
        },
        liStyle: {
          margin: '0',
          display: 'inline-block',
          'text-align': 'left',
          padding: '0 20px'
        },
        liStyleFloatR: {
          float: 'right',
          'padding-right': '30px'
        },
        liStyleCell: {
          display: 'table-cell',
          'text-align': 'left'
        }
      }
    }
  },
  props: {
    autoHead: Object
  },
  methods: {
    initHtml () {
      this.dataObj.tplId = this.autoHead.tplId || ''
      this.baseObj.formName = this.autoHead.formName || '表单标题'
      this.dataObj.moduleId = this.autoHead.moduleId || ''
      this.autoHead.hospitalLogo && (this.baseObj.hospitalLogo = this.autoHead.hospitalLogo || '')
      this.dataObj.tplHtml = '<div>' + this.autoHead.tplHtml + '</div>'
      if (this.autoHead.tplData) {
        this.dataObj.tplData = this.autoHead.tplData
      }

      // 入院时间复制一个年月日格式的
      if (this.dataObj.tplData.inTime) {
        this.dataObj.tplData.inDate = moment(this.dataObj.tplData.inTime).format('YYYY-MM-DD')
      }
    }
  },
  created () {
    if (!this.autoHead.hospitalLogo) {
      const orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
      const orgId = orgInfo['orgId'] || ''
      ApiNurseUploadLogo.getLogoUrl({
        orgId: orgId
      }).then((res) => {
        if (res.data && res.data.logoUrl) {
          this.baseObj.hospitalLogo = res.data.logoUrl
        } else {
          this.baseObj.hospitalLogo = '/static/nrms/unit_logo/logo.png'
        }
      })
        .catch(() => {
        })
    }
  },
  render (h) {
    this.initHtml()
    if (this.autoHead.tplHtml === '') this.autoHead.tplHtml = "<div style='text-align:center; font-size:18px'>请先正确配置表头样式</div>"
    const com = Vue.extend({
      template: this.dataObj.tplHtml,
      props: {
        baseObj: Object,
        dataObj: Object,
        styleObj: Object
      }
    })
    return h(com, {
      props: {
        baseObj: this.baseObj,
        dataObj: this.dataObj,
        styleObj: this.styleObj
      }
    })
  }
}
</script>
