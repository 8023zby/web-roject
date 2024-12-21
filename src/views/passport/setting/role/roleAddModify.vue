<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}角色</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" v-loading="loading"  >
        <el-form  :rules="rules"  ref="addFormData" class="from" label-width="130px" :model="addFormData">
          <el-form-item label="角色名称：" prop="name">
            <el-input v-model="addFormData.name" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" >
            <el-input :disabled="addFormData.roleLevel === 0" type="textarea" placeholder="请输入" :rows="4" maxlength="20" show-word-limit  v-model="addFormData.roleDesc"></el-input>
          </el-form-item>
          <el-form-item label="功能权限：" prop="authority" class="passport-authority">
            <div class="passport-empty" v-if="addFormData.roleLevel === 0">全部</div>
            <zc-tree v-else v-model="addFormData.authorityIds" :nodeKey="nodeKey"  :Selecteds="addFormData.authorityIds"   ref="tree" :options ="authorityData" :props="props"  ></zc-tree>
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

import BaseManage from '../../../../assets/passport/mixins/BaseManage'
import ZcTree from '../../../../components/passport/ZcTree.vue'
import { AxiosApi } from '../../../../api/passport/http'
import { MsgShow } from '../../../../assets/passport/js/Message'
export default {
  props: ['params'],
  components: {
    ZcTree
  },
  mixins: [BaseManage],
  data () {
    return {
      imageObj: {
        picRoute: '2',
        avatar: 'avatar',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: ''
      },
      modelName: '角色',
      titMsg: '添加',
      nodeKey: 'authorityId',
      authorityData: [],
      addFormData: {
        roleId: null,
        name: null,
        roleDesc: null,
        authorityIds: [],
        roleLevel: 1,
        authority: 1
      },
      url: '/passport/web-rbac/roles',
      rules: {
        name: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
          { message: '角色名称只可输入汉字并且不能超过10个字符！', trigger: 'blur', pattern: /^[\u4e00-\u9fa5]{1,10}$/ }
        ],
        authority: [
          { required: true, message: '请选择功能权限', trigger: 'blur' }
        ]
      },
      props: {
        children: 'child',
        label: 'authorityName',
        id: 'authorityId'
      },
      srcAuthorityIds: [],
      minAuthorityIds: []
    }
  },
  mounted () {
    this.addFormData.roleId = this.params.id
    this.getAuthoritysList()
  },
  methods: {
    // 通过父类获取子类的方法 获取值
    getTreeList (obj) {
      if (this.$refs.tree.flag) {
        obj.authorityIds = this.$refs.tree.TreeData
      } else {
        obj.authorityIds = this.srcAuthorityIds
      }
    },
    // 获取权限菜单
    getAuthoritysList () {
      AxiosApi(
        '/passport/web-rbac/roles/authoritys',
        {},
        'GET',
        { tree: 1 }
      ).then(res => {
        let data = res.data || []
        this.authorityData = data
        this.getChild(data)
        if (this.addFormData.roleId) {
          this.titMsg = '编辑'
          this.detail(this.addFormData.roleId)
        }
      })
    },
    // 查看详情
    detail (id, params = {}) {
      AxiosApi(`${this.url}/${id}`, {}, 'GET', params).then(res => {
        let temp = []
        Object.assign(this.addFormData, res.data)
        if (this.addFormData.roleLevel === 0) {
          this.addFormData.roleDesc = '系统预设角色'
        }
        this.srcAuthorityIds = [...this.addFormData.authorityIds]
        this.addFormData.authorityIds.forEach((item) => {
          if (this.minAuthorityIds.toString().includes(item)) {
            temp.push(item)
          }
        })
        this.addFormData.authorityIds = temp
      })
    },
    // 查找子集
    getChild (data) {
      data.forEach((item) => {
        if (item.child && item.child.length > 0) {
          this.getChild(item.child)
        } else {
          this.minAuthorityIds.push(item.authorityId)
        }
      })
    },
    onSubmit (addFormData) {
      let obj = { ...this.addFormData }
      // 获取权限
      if (this.addFormData.roleLevel !== 0) {
        this.getTreeList(obj)
        if (obj.authorityIds.length === 0) {
          MsgShow('warning', '请选择功能权限', 3000)
          return false
        }
      }
      this.$refs[addFormData].validate((valid) => {
        if (valid) {
          if (obj.roleId != null) {
            // 修改角色
            this.edit(obj, obj.roleId)
          } else {
            // 添加角色
            this.add(obj)
          }
        }
      })
    }
  }
}
</script>

<style>
  .passport-authority .el-form-item__content{
    border: 1px solid #DCDFE6;
    max-height: 500px;
    min-height: 300px;
    overflow: auto;
    width: 300px;
  }
</style>
<style scoped>
  .passport-empty{
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #606266;
  }
</style>
