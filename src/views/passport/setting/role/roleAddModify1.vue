<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}角色</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" v-loading="loading" style="width: 600px">
        <el-form  :rules="rules"  ref="addFormData" class="from" label-width="130px" :model="addFormData">
          <el-form-item label="角色名称：" prop="name">
            <el-input v-uni="actFormKey + 'juesemingcheng'" style="width: 300px" v-model="addFormData.name" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" >
            <el-input v-uni="actFormKey + 'juesemiaoshu'" :disabled="addFormData.roleLevel === 0" style="width: 300px" type="textarea" placeholder="请输入" :rows="4" maxlength="20" show-word-limit  v-model="addFormData.roleDesc"></el-input>
          </el-form-item>
          <el-form-item label="功能权限：" prop="authority" class="passport-authority">
            <div class="passport-empty" v-if="addFormData.roleLevel === 0">全部</div>
            <div style="display: flex" v-else>
              <div class="passport-role-div">
                <div v-if="deceiveData.length === 0" class="passport-empty">
                  暂无数据
                </div>
                <div v-else @click="checkDeceive(index)" v-for="(item,index) in deceiveData" :key="index" :class="{'passport-role-item':true,'passport-role-hover':checkIndex===index}">
                  <div class="passport-role-item-content">{{item.landingEndName}}</div>
                  <i class="el-icon-arrow-right passport-arrow"></i>
                </div>
              </div>
              <div class="passport-role-tree">
                <zc-tree v-uni="actFormKey + 'juesequanxian'" v-for="(item,index) in deceiveData" :key="index" v-show="checkIndex===index" :nodeKey="nodeKey" :Selecteds="selectAuthority[item.landingEndId]" :ref="'tree'+index" :options ="item.authList" :props="props"  ></zc-tree>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button v-uni="actKey + 'cancel'" @click="reloadUrl">取消</el-button>
      <el-button v-uni="actKey + 'save'" type="primary" @click="onSubmit('addFormData')" :loading="addVis">保存</el-button>
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
      deceiveData: [],
      modelName: '角色',
      titMsg: '添加',
      actFlag: 'add',
      nodeKey: 'authorityId',
      authorityData: [],
      addFormData: {
        roleId: null,
        name: null,
        roleDesc: null,
        authorityIds: [],
        landingEndAuthIds: [],
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
      minAuthorityIds: [],
      checkIndex: 0,
      selectAuthority: {},
      detailAuthority: {},
      firstClick: {},
      actFormKey:  'jueseguanlitianjia__',
      actKey: 'jueseguanlitianjia_'
    }
  },
  created () {
    this.addFormData.roleId = this.params.id
    this.getAuthorityByItem()
  },
  methods: {
    // 选择登录应用
    checkDeceive (index) {
      this.checkIndex = index
      if (this.actFlag === 'modify') {
        let temp = []
        let id = this.deceiveData[index].landingEndId
        let authList = this.deceiveData[index].authList
        let selectedArr = this.detailAuthority[id] || []
        // 赋值过就不在赋值
        if (this.firstClick[id]) return false
        this.getChild(authList)
        selectedArr.forEach((item) => {
          if (this.minAuthorityIds.toString().includes(item)) {
            temp.push(item)
          }
        })
        this.selectAuthority[id] = temp
        this.firstClick[id] = true
      }
    },
    // 通过父类获取子类的方法 获取值
    getTreeList (obj) {
      obj.authorityIds = []
      obj.landingEndAuthIds = []
      this.deceiveData.forEach((item, index) => {
        let d = this.$refs['tree' + index][0].TreeData
        let flag = this.$refs['tree' + index][0].flag
        if (!flag) {
          d = this.detailAuthority[item.landingEndId] || []
        }
        let temp = []
        d.forEach((val) => {
          temp.push({
            landEndId: item.landingEndId,
            authId: val
          })
        })
        obj.authorityIds = [...obj.authorityIds, ...d]
        obj.landingEndAuthIds = [...obj.landingEndAuthIds, ...temp]
      })
    },
    // 根据登录应用获取权限
    getAuthorityByItem () {
      AxiosApi(
        '/passport/web-rbac/roles/landingEnd/authoritys',
        {},
        'GET'
      ).then(res => {
        this.deceiveData = res.data
        if (this.addFormData.roleId) {
          this.titMsg = '编辑'
          this.actFlag = 'modify'
          this.actKey = 'jueseguanlibianji_'
          this.actFormKey = 'jueseguanlibianji__'
          this.detail(this.addFormData.roleId)
        } else {
          this.checkDeceive(0)
        }
      })
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
        Object.assign(this.addFormData, res.data)
        if (this.addFormData.roleLevel === 0) {
          this.addFormData.roleDesc = '系统预设角色'
        }
        this.addFormData.landingEndAuthIds.forEach((item) => {
          if (this.detailAuthority[item.landEndId]) {
            this.detailAuthority[item.landEndId].push(item.authId)
          } else {
            this.detailAuthority[item.landEndId] = [item.authId]
          }
        })
        this.checkDeceive(0)
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
      if (this.addFormData.roleLevel !== 0) {
        // 获取权限
        this.getTreeList(obj)
        // 去重
        let authorityIds = new Set(obj.authorityIds)
        let temp = []
        obj.authorityIds = [...authorityIds]
        // 登录应用权限数据去重
        for (let item of obj.landingEndAuthIds) { // 循环json数组对象的内容
          let flag = true // 建立标记，判断数据是否重复，true为不重复
          for (let val of temp) { // 循环新数组的内容
            if (item.authId === val.authId) { // 让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
              flag = false
            }
          }
          if (flag) { // 判断是否重复
            temp.push(item) // 不重复的放入新数组。  新数组的内容会继续进行上边的循环。
          }
        }
        obj.landingEndAuthIds = temp
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

<style lang="scss">
  .passport-authority .el-form-item__content{
    max-height: 500px;
    min-height: 300px;
    overflow: auto;
    display: flex;
  }
  .passport-role-div{
    margin-right: 20px;
    padding-top: 15px;
  }
  .passport-role-tree, .passport-role-div{
    border: 1px solid #DCDFE6;
    height: 400px;
    overflow: auto;
    width: 210px;
  }
  .passport-role-tree{
    padding-top: 10px;
  }
  .passport-role-hover{
    background: #eef7fe;
    color: #1e87f0 !important;
  }
  .passport-role-item{
    width: 100%;
    height: 38px;
    display: flex;
    color: #606266;
    cursor: pointer;
    .passport-arrow{
      font-size: 20px;
      height: 38px;
      line-height: 38px;
    }
    .passport-role-item-content{
      line-height: 38px;
      width: 180px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      padding-left: 5px;
    }
  }
</style>
<style scoped>
  .passport-empty{
    width: 300px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #606266;
    border: 1px solid #DCDFE6;
  }
</style>
