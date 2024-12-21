<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}登录应用</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form :rules="rules"  ref="addFormData" class="from" label-width="130px" :model="addFormData">
          <el-form-item label="登录应用名称：" prop="landingEndName">
            <el-input v-model="addFormData.landingEndName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="登录应用标识：" prop="landingEndCode">
            <el-input v-model="addFormData.landingEndCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="关联终端类型：" prop="deviceTypeList">
            <el-select v-model="addFormData.deviceTypeList" placeholder="请选择" multiple>
              <el-option v-for="item in deviceTypeData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="titMsg==='添加'" label="数据权限设置：" prop="dataDept">
            <el-select v-model="addFormData.dataDept" placeholder="请选择" filterable>
              <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input placeholder="请输入" type="textarea" v-model="addFormData.remark" rows="6" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="reloadUrl">取消</el-button>
      <el-button type="primary" @click="onSubmit('addFormData')" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../assets/passport/mixins/BaseManage'
import { PatientDictionaryArr } from '../../../assets/passport/js/Dictionary'
import { AxiosApi } from '../../../api/passport/http'
export default {
  props: ['params'],
  mixins: [BaseManage],
  data () {
    return {
      deviceTypeData: [],
      jobData: [],
      jobTypeObj: {},
      addFormData: {
        landingEndCode: '',
        landingEndName: '',
        deviceTypeList: [],
        dataDept: 0,
        remark: ''
      },
      dataDeptInfoList: [{
        deptId: 0,
        deptName: '全部'
      },
      {
        deptId: 1,
        deptName: '单个部门'
      }],
      titMsg: '添加',
      modelName: '登录应用',
      rules: {
        landingEndName: [
          { required: true, message: '登录应用名称不可为空！', trigger: 'blur' },
          { min: 1, max: 10, message: '登录应用名称不可超过10个字符', trigger: 'blur' }
        ],
        landingEndCode: [
          { required: true, message: '请输入登录应用标识！', trigger: 'blur' },
          { min: 1, max: 20, message: '登录应用标识不可超过20个字符', trigger: 'blur' }
        ],
        dataDept: [
          { required: true, message: '请选择数据权限设置！', trigger: 'change' }
        ],
        deviceTypeList: [
          { required: true, message: '请选择关联终端类型！', trigger: 'change' }
        ]
      },
      url: '/devops/web-devops/landingEnd'
    }
  },
  created () {
    this.addFormData.landingEndId = this.params.id
    this.deviceTypeData = [ ...PatientDictionaryArr ]
    this.deviceTypeData.unshift({
      id: 'WEB',
      name: 'PC端'
    })
    if (this.addFormData.landingEndId) {
      this.titMsg = '编辑'
      this.detail(this.addFormData.landingEndId)
    } else {
      this.getDeptList()
    }
  },
  methods: {
    // 查询部门
    getDeptList () {
      AxiosApi(
        '/ifms/web-org/depts',
        {},
        'GET'
      ).then(res => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list)
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
          this.deptData = JSON.parse(temp)
        }
      })
    },
    onSubmit (addFormData) {
      this.$refs[addFormData].validate((valid) => {
        if (valid) {
          if (this.addFormData.landingEndId != null) {
            // 修改登录应用
            this.edit(this.addFormData, this.addFormData.landingEndId)
          } else {
            // 添加登录应用
            this.add(this.addFormData)
          }
        }
      })
    },
    // 查看详情
    detail (id, params = {}) {
      AxiosApi(`${this.url}/${id}`, {}, 'GET', params).then(res => {
        if (res.data.deviceType === null || res.data.deviceType === '') {
          res.data.deviceType = '[]'
        }
        Object.assign(this.addFormData, res.data)
        this.addFormData.deviceTypeList = JSON.parse(res.data.deviceType)
      })
    }
  }
}
</script>
