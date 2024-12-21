<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}菜单</div>
    </div>
    <div class="typt-add-container">
        <div class="typt-add-form" v-loading="loading"  >
            <el-form  :rules="rules"  ref="addFormData" class="from" label-width="150px" :model="addFormData">
                <el-form-item label="菜单名称：" prop="name">
                    <el-input v-model="addFormData.name" placeholder="请输入菜单名称" clearable></el-input>
                </el-form-item>
                <el-form-item v-show="addFormData.authorityType=='authority'"  label="请求地址：" prop="url">
                    <!-- 这个其实就是借口访问的地址 例如   列表就是 userlist  添加就是 useradd -->
                    <el-input v-model="addFormData.url" placeholder="请输入请求地址" clearable></el-input>
                </el-form-item>
                <el-form-item v-show="addFormData.authorityType=='model'"  label="页面请求地址：" prop="remark">
                    <!-- 这个其实就是二级三级页面访问的地址  注：使用remark 使用remark 使用remark-->
                    <el-input v-model="addFormData.remark" placeholder="请输入页面请求地址" clearable></el-input>
                </el-form-item>
                <el-form-item  label="英文权限标识：" prop="authorityCode">
                    <el-input v-model="addFormData.authorityCode" placeholder="请输入权限标识" clearable></el-input>
                </el-form-item>
                <el-form-item  v-show="addFormData.authorityType=='authority'" label="菜单类型：" prop="type">
                <el-select v-model="addFormData.type" placeholder="请选择菜单类型" clearable>
                    <el-option  v-for="item in typeOptions"  :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item  v-show="addFormData.authorityType=='authority'" label="请求方式：" prop="method">
                    <el-select v-model="addFormData.method" placeholder="请选择请求方式" clearable>
                    <el-option  v-for="item in  methodOptions"  :key="item.label" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                 <el-radio-group v-model="addFormData.status">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="2">隐藏</el-radio>
                 </el-radio-group>
                </el-form-item>
                <el-form-item label="头像">
                  <v-upload-image :imageObj="imageObj" ref="imgDiv"></v-upload-image>
                </el-form-item>
            </el-form>
        </div>
     </div>
    <div class="typt-add-footer">
      <el-button type="primary" @click="onSubmit('addFormData')">保存</el-button>
      <el-button @click="reloadUrl">取消</el-button>
    </div>
  </div>
</template>

<script>

import Menu from '../../../../assets/passport/mixins/Menu'
import vUploadImage from '../../../../components/passport/UploadImage.vue'
export default {
  props: ['params'],
  components: {
    vUploadImage
  },
  mixins: [Menu],
  data () {
    return {
      imageObj: {
        picRoute: '5',
        avatar: 'avatar_menu',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: ''
      },
      addFormData: {
        status: 1,
        icon: null,
        authorityCode: '',
        authorityType: '',
        parentId: '',
        name: null,
        url: null,
        authorityId: null,
        remark: null,
        level: null // 区分 是二级菜单还是三级菜单  只有在model中需要其余不需要为了做方便现在是全部传给后台
      },
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
      typeOptions: [ {
        value: 1,
        label: '按钮'
      }, {
        value: 2,
        label: '接口'
      }],
      cuid: null,
      modelName: '菜单',
      titMsg: '添加',
      url: '/passport/web-rbac/authoritys',
      addSate: false,
      parentId: '', // 上级ID 返回菜单的时候使用
      rules: {
        name: [
          { required: true, message: '请填写菜单名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    let _this = this
    //  当前ID 用户编辑
    _this.addFormData.authorityId = _this.params.authorityId
    //   当前是那第几页
    _this.cuid = _this.params.cuid

    //  二级目录的时候添加菜单 addSate 初始值为false
    _this.addSate = _this.params.addSate || false
    // 从本地取出存储的值
    let CuData = JSON.parse(localStorage.getItem('cuData')) || []
    CuData.forEach((value, index) => {
      if ((value.cuid + 1) === _this.cuid) {
        _this.addFormData.parentId = value.authorityId
      }
    })
    // 获取当前的类型
    _this.getType()
    // 获取列表详情
    if (_this.addFormData.authorityId) {
      this.titMsg = '编辑'
      this.detail(_this.addFormData.authorityId, { authorityType: this.addFormData.authorityType })
    }
  },

  methods: {
    editBackList () {
      this.$emit('option-changed', 'list', { cuid: this.cuid })
    },
    /*  获取类型 */
    getType () {
      if (this.cuid === 1) {
        // 初始化默认的cuid是1
        this.addFormData.authorityType = 'system'
        // 当前值不是大于1 并且小于等于3那么 不是模块就是功能
      } else if (this.cuid > 1 && this.cuid <= 3) {
        // 获取类型从添加页面过来的addSate是true那么就是 菜单 如果是false 就是模块
        if (this.addSate) {
          this.addFormData.authorityType = 'authority'
        } else {
          this.addFormData.authorityType = 'model'
        }
      } else {
        this.addFormData.authorityType = 'authority'
      }
    },
    onSubmit (addFormData) {
      let _this = this
      _this.$refs[addFormData].validate((valid) => {
        if (valid) {
          _this.addFormData.level = _this.cuid
          this.addFormData.icon = this.$refs.imgDiv.imageObj.imageUrl
          // 修改菜单
          if (_this.addFormData.authorityId != null) {
            this.edit(this.addFormData)
          } else {
            // 添加菜单
            _this.getType()
            this.add(this.addFormData)
          }
        }
      })
    }
  }
}
</script>
<style></style>
