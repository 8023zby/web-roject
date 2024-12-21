<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls"
         v-show="false">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}岗位</div>
    </div>
    <div class="">
      <div class="typt-add-form">
        <el-form :model="addFormData"
                 :rules="rules"
                 ref="addForm"
                 label-width="130px">
          <el-form-item label="岗位名称："
                        prop="postName">
            <el-input v-model="addFormData.postName"
                      style="width: 300px;"
                      type="text"
                      maxlength="10"
                      placeholder="请输入"
                      clearable/>
          </el-form-item>
          <el-form-item label="岗位描述："
                        prop="postDescribe">
            <el-input v-model="addFormData.postDescribe"
                      style="width: 300px;"
                      rows="5"
                      autocomplete="off"
                      type="textarea"
                      placeholder="请输入"
                      show-word-limit
                      maxlength="50"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer"
         style="margin-bottom: 20px;height: 60px;">
      <el-button @click="backReloadUrl">取消</el-button>
      <el-button type="primary" @click="saveData2" :loading="addVis">确认</el-button>
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import { filterData } from '../../../assets/hsms/unitils/unitils'
import { AxiosJsonApi } from '../../../api/hsms'
import { ResultMsg } from '../../../assets/hsms/js/Message'

export default {
  name: 'NursePostAdd',
  mixins: [BaseManage],
  props: ['modifyData', 'params'],
  data () {
    return {
      actFlag: 'add',
      titMsg: '添加',
      businessType: 'NURSE',
      addFormData: {
        postName: '',
        postDescribe: ''
      },
      locationUrl: '/post',
      modelName: '岗位',
      url: '/hsms/web-hs/post',
      rules: {
        postName: [
          // { required: true, message: '岗位名称长度不超过10个字符！', trigger: 'blur', pattern: /^.{1,10}$/ }
        ],
        postDescribe: [
          // { message: '岗位描述长度不超过200个字符！', trigger: 'blur', pattern: /^.{0,200}$/ }
        ]
      }
    }
  },
  // 初始化数据
  created () {
    // console.log('created');
    this.init()
  },
  mounted () {
    // console.log('mounted');
    this.init()
  },
  activated () {
    // console.log('activated');
    this.init()
  },
  watch: {
    modifyData: {
      immediate: true,
      handler (val) {
        this.modifyData = val
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.businessType = this.params.businessType || 'NURSE'
      let obj = this.modifyData
      let key = obj['postId'] || ''
      if (key) {
        this.actFlag = 'modify'
        this.titMsg = '编辑'
        // 对象的复制，不然会影响原来的值（假数据导致，要是请求后台应该不会有这问题）
        let temp = { ...obj }
        this.addFormData = temp
      }
    },
    backReloadUrl () {
      this.actFlag = 'add'
      this.addFormData = {
        hierarchyName: '',
        hierarchyDescribe: ''
      }
      this.$emit('close-item')
    },
    // 保存数据
    saveData2 () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.saveDataDo2(this.addFormData, this.actFlag)
        }
      })
    },
    // 保存数据
    saveDataDo2 (data, act, params = {}, isOne = true) {
      let methodType = 'POST'
      let actMsg = '添加'
      let addData
      if (!act) {
        act = 'add'
      }
      if (act === 'add') {
        addData = filterData(data)
      } else if (act === 'modify') {
        methodType = 'PUT'
        actMsg = '修改'
        addData = data
      }
      this.addVis = true
      AxiosJsonApi(this.url + '/' + this.businessType, addData, methodType, params).then(res => {
        this.addVis = false
        ResultMsg(res, actMsg + this.modelName, this.backReloadUrl)
        /* if (isOne) {
            ResultMsg(res, actMsg + this.modelName, this.reloadUrl)
          } else {
            ResultMsg(res, actMsg + this.modelName, this.refresh)
          }
          if (res.status !== 200) {
            this.addVis = false
          } */
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-input--small .el-input__inner {
    height: 46px !important;
  }

  /deep/ .el-button--small {
    width: 70px !important;
    height: 40px !important;
  }

  .typt-add-form {
    padding-top: 0;
  }

  .typt-add-footer {
    text-align: right;
  }

  /deep/ .el-textarea__inner {
    padding-bottom: 28px;
    border-radius: 2px;
  }

  /deep/ .el-textarea .el-input__count {
    text-align: right;
    left: 1px;
    right: 1px;
    bottom: 1px;
    padding: 7px 5px;
    font-size: 12px;
    line-height: normal;
  }
</style>
