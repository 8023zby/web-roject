<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}菜单</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 650px">
        <el-form  :rules="rules" ref="addForm" class="from" label-width="150px" :model="addFormData">
          <el-form-item label="上级目录：">
            <treeselect disabled v-model="addFormData.parentId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="authorityData" noChildrenText="无子节点"/>
          </el-form-item>
          <el-form-item label="菜单名称：" prop="authorityName">
            <el-input v-model="addFormData.authorityName" placeholder="请输入菜单名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="菜单标识：" prop="authorityCode">
            <el-input v-model="addFormData.authorityCode" placeholder="请输入菜单标识" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="menuType">
            <el-radio-group v-model="addFormData.type" @change="changeMenu">
              <el-radio :label="1" v-if="addFormData.level===1 || addFormData.level===2 || addFormData.level===3">菜单</el-radio>
              <el-radio :label="1" v-else disabled>菜单</el-radio>
              <el-radio :label="2" v-if="addFormData.level===4 || addFormData.level===3">功能按钮</el-radio>
              <el-radio :label="2" v-else disabled>模块</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="事件：">
            <el-radio-group v-model="addFormData.actionType">
              <el-radio :label="1">展开菜单</el-radio>
              <el-radio :label="2">调用接口</el-radio>
              <el-radio :label="3">打开页面并调用接口</el-radio>
              <el-radio :label="4">打开页面</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="addFormData.actionType===3 || addFormData.actionType===4" label="请求地址：" prop="pageUrl">
            <el-input v-model="addFormData.pageUrl" placeholder="请输入请求地址" clearable></el-input>
          </el-form-item>
          <el-form-item class="deptCls" v-if="addFormData.actionType===2 || addFormData.actionType===3" label="选择API：" prop="apis">
            <treeselect valueConsistsOf="LEAF_PRIORITY" placeholder="请选择API" v-model="addFormData.apis" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="true" :options="apiData" noChildrenText="无子节点"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="addFormData.status">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  label="业务范围：" prop="scope">
            <el-select v-model="addFormData.scope" multiple placeholder="请选择">
              <el-option
                v-for="item in scopeData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="排序：" prop="sort">
            <el-input v-model="addFormData.sort" placeholder="请输入排序" clearable></el-input>
          </el-form-item>
          <el-form-item  label="备注：" prop="remark">
            <el-input type="textarea" rows="4" v-model="addFormData.remark" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
          <el-form-item label="图标路径：">
            <el-input v-model="addFormData.icon" placeholder="绝对路径（/static/项目简称/对应图标路径）" clearable></el-input>
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
import BaseManage from '../../../assets/passport/mixins/BaseManage'
import { AxiosApi } from '../../../api/passport/http/index'
export default {
  components: {
    Treeselect
  },
  props: ['params', 'modifyData'],
  mixins: [BaseManage],
  data () {
    return {
      apiData: [],
      addFormData: {
        type: 1,
        status: 1,
        apis: [],
        scope: [],
        icon: '',
        actionType: 1,
        authorityCode: '',
        authorityName: '',
        parentId: '',
        sort: null,
        pageUrl: 'http://www.yarward.com/',
        remark: '',
        level: 1
      },
      authorityData: [],
      modelName: '菜单',
      titMsg: '添加',
      scopeData: [{
        value: 1,
        label: '亚华'
      },
      {
        value: 2,
        label: '医疗'
      },
      {
        value: 3,
        label: '养老'
      },
      {
        value: 4,
        label: '商业'
      }],
      url: '/passport/web-rbac/authoritys',
      rules: {
        authorityName: [
          { required: true, message: '请填写菜单名称', trigger: 'blur' },
          { required: true, message: '菜单名称不能超过10个字符！', trigger: 'blur', pattern: /^.{1,10}$/ }
        ],
        authorityCode: [
          { required: true, message: '请填写菜单标识', trigger: 'blur' }
        ],
        pageUrl: [
          { required: true, message: '请填写请求地址', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '请选择业务范围', trigger: 'change' }
        ],
        apis: [
          { required: false, message: '请选择API', trigger: 'blur' }
        ],
        sort: [
          { pattern: /^[0-9]\d*$/, message: '请填写正确的排序', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getAuthorityList()
    let act = this.params.act
    let d = this.modifyData
    if (d.parentId === null) {
      d.parentId = ''
    }
    if (act === 'add') {
      let authorityId = d.authorityId
      if (authorityId === 'root') {
        this.addFormData.level = 1
        this.addFormData.type = 1
      } else {
        this.addFormData.level = d.level + 1
        if (this.addFormData.level === 4) {
          this.addFormData.type = 2
        } else {
          this.addFormData.type = 1
        }
        this.addFormData.parentId = d.authorityId
      }
    } else {
      this.addFormData = { ...d }
      let tempData = this.addFormData.scope
      let temp = []
      if (typeof (tempData) !== 'object' && tempData !== '' && tempData !== null) {
        tempData = JSON.parse(tempData)
        for (let p in tempData) {
          temp.push(parseInt(tempData[p]))
        }
        this.addFormData.scope = temp
      }
      if (this.addFormData.pageUrl === '' || this.addFormData.pageUrl === null) {
        this.addFormData.pageUrl = 'http://www.yarward.com/'
      }
      if (this.addFormData.level === 4) {
        this.addFormData.type = 2
      } else {
        this.addFormData.type = 1
      }
    }
    this.getData()
  },
  methods: {
    // 获取权限树
    getAuthorityList () {
      AxiosApi('/passport/web-rbac/systems', {}, 'GET', { tree: 1 }).then(res => {
        let temp = JSON.stringify(res.data)
        temp = temp.replace(/apiId/g, 'id').replace(/apiName/g, 'label').replace(/,"child":null/g, '').replace(/child/g, 'children')
        this.apiData = JSON.parse(temp)
      })
    },
    getData () {
      AxiosApi(this.url, {}, 'GET', { tree: 1 }).then(res => {
        let temp = JSON.stringify(res.data)
        temp = temp.replace(/authorityId/g, 'id').replace(/authorityName/g, 'label').replace(/,"child":null/g, '').replace(/child/g, 'children')
        this.authorityData = JSON.parse(temp)
        this.authorityData.push({
          id: '',
          label: '根目录'
        })
      })
    },
    // 切换类型
    changeMenu (val) {
      if (val === 2) {
        this.addFormData.level = 4
      }
    },
    onSubmit () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let saveData = { ...this.addFormData }
          let temp = {}
          saveData.scope.forEach((item, index) => {
            // temp[`type_${index + 1}`] = item
            temp[`type_${item}`] = item
          })
          saveData.scope = JSON.stringify(temp)
          if (saveData.pageUrl === 'http://www.yarward.com/') {
            saveData.pageUrl = ''
          }
          // console.log(this.addFormData)
          // console.log(JSON.stringify(this.addFormData))
          if (this.params.act === 'modify') {
            // 修改菜单
            this.edit(saveData, '', this.url)
          } else {
            // 添加菜单
            this.add(saveData, {}, this.url)
          }
        }
      })
    }
  }
}
</script>
<style></style>
