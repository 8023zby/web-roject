<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}权限</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form  :rules="rules" ref="addForm" class="from" label-width="150px" :model="addFormData">
          <el-form-item label="上级目录：">
            <treeselect disabled v-model="addFormData.parentId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="authorityData" noChildrenText="无子节点"/>
          </el-form-item>
          <el-form-item label="类型：" prop="menuType">
            <el-radio-group v-model="menuType" @change="changeMenu">
              <el-radio :label="1" v-if="addFormData.level===1">系统</el-radio>
              <el-radio :label="1" v-else disabled>系统</el-radio>
              <el-radio :label="2" v-if="addFormData.level===2 || addFormData.level===3">模块</el-radio>
              <el-radio :label="2" v-else disabled>模块</el-radio>
              <el-radio :label="4" v-if="addFormData.level===4  || addFormData.level===3">接口</el-radio>
              <el-radio :label="4" v-else disabled>接口</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限名称：" prop="apiName">
            <el-input v-model="addFormData.apiName" placeholder="请输入权限名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="权限标识：" prop="apiCode">
            <el-input v-model="addFormData.apiCode" placeholder="请输入权限标识" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="menuType===4" label="请求方式：" prop="method">
            <el-select v-model="addFormData.method" placeholder="请选择请求方式" clearable>
              <el-option  v-for="item in  methodOptions"  :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="menuType===4" label="请求地址：" prop="url">
            <el-input v-model="addFormData.url" placeholder="请输入请求地址" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="menuType===4" label="排序：" prop="sort">
            <el-input v-model="addFormData.sort" placeholder="请输入排序" clearable></el-input>
          </el-form-item>
          <el-form-item  label="备注：" prop="remark">
            <el-input type="textarea" rows="4" v-model="addFormData.remark" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="reloadUrl">取消</el-button>
      <el-button type="primary" @click="onSubmit()" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { AxiosApi } from '../../../api/passport/http/index'
import BaseManage from '../../../assets/passport/mixins/BaseManage'
export default {
  components: {
    Treeselect
  },
  props: ['params', 'modifyData'],
  mixins: [BaseManage],
  data () {
    return {
      authorityData: [],
      addFormData: {
        level: '',
        parentId: '',
        apiName: '',
        apiCode: '',
        remark: '',
        method: '',
        sort: null,
        url: ''
      },
      menuType: 1,
      methodOptions: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }, {
        value: 'PUT',
        label: 'PUT'
      }, {
        value: 'DELETE',
        label: 'DELETE'
      }],
      modelName: '权限',
      titMsg: '添加',
      url: '/passport/web-rbac/systems',
      url_models: '/passport/web-rbac/models',
      url_apis: '/passport/web-rbac/apis',
      rules: {
        apiName: [
          { required: true, message: '请填写权限名称', trigger: 'blur' }
        ],
        apiCode: [
          { required: true, message: '请填写权限标识', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请填写请求方式', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请填写请求地址', trigger: 'blur' }
        ],
        sort: [
          { pattern: /^[0-9]\d*$/, message: '请填写正确的排序', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let act = this.params.act
    let d = this.modifyData
    if (!d.parentId || d.parentId === null) {
      d.parentId = ''
    }
    if (act === 'add') {
      let apiId = d.apiId
      if (apiId === 'root') {
        this.addFormData.level = 1
        this.menuType = 1
      } else {
        this.addFormData.level = d.level + 1
        if (this.addFormData.level === 3) {
          this.menuType = 2
        } else {
          this.menuType = d.level + 1
        }
        this.addFormData.parentId = d.apiId
      }
    } else {
      this.addFormData = { ...d }
      if (this.addFormData.level === 3) {
        this.menuType = 2
      } else {
        this.menuType = this.addFormData.level
      }
    }
    this.getData()
  },
  methods: {
    // 切换类型
    changeMenu (val) {
      if (val === 4) {
        this.addFormData.level = 4
      }
    },
    getData () {
      AxiosApi('/passport/web-rbac/systems', {}, 'GET', { tree: 1 }).then(res => {
        let temp = JSON.stringify(res.data)
        temp = temp.replace(/apiId/g, 'id').replace(/apiName/g, 'label').replace(/,"child":null/g, '').replace(/child/g, 'children')
        this.authorityData = JSON.parse(temp)
        this.authorityData.push({
          id: '',
          label: '根目录'
        })
      })
    },
    onSubmit () {
      let level = this.addFormData.level
      let url = this.url
      if (level === 2 || level === 3) {
        url = this.url_models
      }
      if (level === 4) {
        url = this.url_apis
      }
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.params.act === 'modify') {
            // 修改权限
            this.edit(this.addFormData, '', url)
          } else {
            // 添加权限
            this.add(this.addFormData, {}, url)
          }
        }
      })
    }
  }
}
</script>
<style></style>
