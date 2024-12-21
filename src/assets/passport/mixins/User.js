/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http'
import { ResultMsg, MsgShow } from '../js/Message'
import BaseManage from './BaseManage'
export default {
  extends: BaseManage,
  methods: {
    // 重置密码
    resetPass (row) {
      this.$confirm('确定将密码重置？', '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then((res) => {
        AxiosApi(
          `${this.url}/${row.userId}/resetPassword`,
          {},
          'PUT'
        ).then(res => {
          ResultMsg(res, '密码重置', () => {
            this.passwordVis = false
            this.onSearchSubmit('page')
          })
        })
      })
    },
    // 更改用户状态
    changeStatus (row) {
      AxiosApi(
        `${this.url}/${row.userId}/changeStatus/${row.userStatus}`,
        {},
        'PUT'
      ).then(res => {
        this.onSearchSubmit('page')
      })
    },
    // 查看详情
    detail (id) {
      AxiosApi(`${this.url}/${id}`, {}, 'GET').then(res => {
        if (res.status === 200) {
          Object.assign(this.addFormData, res.data)
          this.getEmpInfo(id)
          if (this.addFormData.isAdmin) {
            this.initAdmin()
          }
        }
      })
    },
    // 查询员工信息
    getEmpInfo (id) {
      AxiosApi(`/ifms/web-org/emp/${id}`, {}, 'GET').then(res => {
        if (res.status === 200 && res.data !== null) {
          // let deptId = res.data.deptId === null ? '' : res.data.deptId || ''
          let workingPicture = res.data.workingPicture || ''
          if (workingPicture !== '' && workingPicture !== null) {
            this.imageObj.imageUrl = workingPicture
          }
          /* if (deptId !== '') {
            res.data.deptId = deptId.split(',')
          } else {
            res.data.deptId = []
          } */
          Object.assign(this.addFormData, res.data)
          if (this.addFormData.isAdmin) {
            this.initAdmin()
          }
        }
      })
    },
    // 保存数据
    add (data, params = {}, act = '') {
      let methodType = 'POST'
      let addData = this.filterData(data)
      this.addVis = true
      AxiosJsonApi(this.url, addData, methodType, params).then(res => {
        let status = res.status
        let desc = res.desc
        if (status === 200) {
          addData['empId'] = res.data
          this.addEmpInfo(addData, act)
        } else {
          this.addVis = false
          MsgShow('error', desc)
        }
      })
    },
    // 保存员工数据
    addEmpInfo (data, act = '') {
      AxiosJsonApi(`/ifms/web-org/emp`, data, 'POST').then(res => {
        if (act === 'pims') {
          ResultMsg(res, '添加' + this.modelName, this.returnList)
        } else {
          ResultMsg(res, '添加' + this.modelName, this.reloadAdd)
        }
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
    // 修改数据
    editEmpInfo (data) {
      let methodType = 'PUT'
      let actMsg = '修改'
      AxiosJsonApi(`${this.url}/${this.addFormData.userId}`, data, methodType).then(res => {
        ResultMsg(res, actMsg + this.modelName, this.reloadUrl)
        if (res.status !== 200) {
          this.addVis = false
        }
      })
    },
    // 修改员工数据
    edit (data) {
      let methodType = 'PUT'
      this.addVis = true
      // console.log(JSON.stringify(data))
      AxiosJsonApi(`/ifms/web-org/emp`, data, methodType).then(res => {
        let status = res.status
        let desc = res.desc
        if (status === 200) {
          this.editEmpInfo(data)
        } else {
          this.addVis = false
          MsgShow('error', desc)
        }
      })
    },
    // 重置
    reload () {
      this.formSearchData = this.clearObj(this.formSearchData)
      this.formSearchData.deptId = null
      this.createTime = ''
      this.lastLoginTime = ''
      this.onSearchSubmit()
    }
  }
}
