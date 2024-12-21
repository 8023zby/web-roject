<template>
  <layout v-loading="loading">
    <div slot="title">
      {{titMsg}}护理焦点
    </div>
    <div slot="main" class="add-from">
       <el-form :model="addFormData" label-suffix="：" :rules="rules" ref="addForm" class="form-main-center" label-width="130px">
          <el-form-item label="焦点分类" prop="typeId">
            <el-select v-model="addFormData.typeId" placeholder="请选择焦点分类" clearable size="small">
              <el-option v-for="(item, index) in typeData" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="焦点名称" prop="focusName">
            <el-input v-model="addFormData.focusName" placeholder="请输入焦点名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="焦点内容" prop="mustFlag">
            <span v-show="focusContentFlag" style="color:#F56C6C;font-size: 12px">请至少填写一个焦点内容！</span>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in addFormData.basis"
            :key="item.key"
            :prop="'basis.' + index + '.value'"
            class="nrms-content-div"
            :rules="rules_content"
            :label="index === 0 ? '依据D' : ''"
          >
            <el-input type="textarea" :rows="3" maxlength="100" show-word-limit v-model="item.value" placeholder="请输入焦点内容" clearable></el-input>
            <i @click.prevent="addItem('basis')" class="el-icon-circle-plus-outline iconAddCls"></i>
            <i v-if="index!==0" @click.prevent="removeItem('basis', item)" class="el-icon-remove-outline iconDelCls"></i>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in addFormData.measures"
            :key="item.key"
            :prop="'measures.' + index + '.value'"
            class="nrms-content-div"
            :rules="rules_content"
            :label="index === 0 ? '措施A' : ''"
          >
            <el-input type="textarea" :rows="3" maxlength="100" show-word-limit v-model="item.value" placeholder="请输入焦点内容" clearable></el-input>
            <i @click.prevent="addItem('measures')" class="el-icon-circle-plus-outline iconAddCls"></i>
            <i v-if="index!==0" @click.prevent="removeItem('measures', item)" class="el-icon-remove-outline iconDelCls"></i>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in addFormData.mission"
            :key="item.key"
            :prop="'mission.' + index + '.value'"
            class="nrms-content-div"
            :rules="rules_content"
            :label="index === 0 ? '宣教T' : ''"
          >
            <el-input type="textarea" :rows="3" maxlength="100" show-word-limit v-model="item.value" placeholder="请输入焦点内容" clearable></el-input>
            <i @click.prevent="addItem('mission')" class="el-icon-circle-plus-outline iconAddCls"></i>
            <i v-if="index!==0" @click.prevent="removeItem('mission', item)" class="el-icon-remove-outline iconDelCls"></i>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in addFormData.evaluate"
            :key="item.key"
            :prop="'evaluate.' + index + '.value'"
            class="nrms-content-div"
            :rules="rules_content"
            :label="index === 0 ? '评价R' : ''"
          >
            <el-input type="textarea" :rows="3" maxlength="100" show-word-limit v-model="item.value" placeholder="请输入焦点内容" clearable></el-input>
            <i @click.prevent="addItem('evaluate')" class="el-icon-circle-plus-outline iconAddCls"></i>
            <i v-if="index!==0" @click.prevent="removeItem('evaluate', item)" class="el-icon-remove-outline iconDelCls"></i>
          </el-form-item>
        </el-form>
    </div>
    <div slot="footer_btn">
      <el-button @click="reloadUrl">取消</el-button>
      <el-button type="primary" @click="saveData">保存</el-button>
    </div>
  </layout>
</template>

<script>
import layout from '../../../components/nrms/layout/edit'
import BaseManage from '../../../assets/nrms/mixins/BaseManage'
import { AxiosApi } from '../../../api/nrms/http/index'
import { MsgShow } from '../../../assets/nrms/js/Message'
export default {
  name: 'NurseApplyAdd',
  mixins: [BaseManage],
  props: ['modifyData', 'params'],
  components: { layout },
  data () {
    return {
      titMsg: '添加',
      focusContentFlag: false,
      typeData: [{
        typeId: '',
        typeName: ''
      }],
      contentNum: {
        basis: 1,
        measures: 1,
        mission: 1,
        evaluate: 1
      },
      actFlag: 'add',
      addFormData: {
        typeId: '',
        focusName: '',
        deptId: '',
        mustFlag: 'yes',
        basis: [{
          key: `basis_${Date.now()}`,
          value: ''
        }],
        measures: [{
          key: `measures_${Date.now()}`,
          value: ''
        }],
        mission: [{
          key: `mission_${Date.now()}`,
          value: ''
        }],
        evaluate: [{
          key: `evaluate_${Date.now()}`,
          value: ''
        }]
      },
      modelName: '护理焦点',
      url: '/nrms/web-nr/focus',
      rules: {
        typeId: [
          { required: true, message: '请选择焦点分类！' }
        ],
        mustFlag: [
          { required: true }
        ],
        focusName: [
          { required: true, message: '请输入焦点名称！' },
          { message: '焦点名称长度不超过20个字符！', trigger: 'blur', pattern: /^.{1,20}$/ }
        ]
      },
      rules_content: [
        { pattern: /^.{0,100}$/, message: '焦点内容长度不能超过100个字符！', trigger: 'blur' }
      ]
    }
  },
  // 初始化数据
  created () {
    let obj = this.modifyData
    let key = obj['focusId'] || ''
    let o = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.addFormData.deptId = o.deptId || ''
    this.getClassifyData()
    if (key) {
      this.actFlag = 'modify'
      this.titMsg = '编辑'
      // 对象的复制，不然会影响原来的值（假数据导致，要是请求后台应该不会有这问题）
      let temp = { ...obj }
      temp.basis = JSON.parse(temp.basis)
      temp.measures = JSON.parse(temp.measures)
      temp.mission = JSON.parse(temp.mission)
      temp.evaluate = JSON.parse(temp.evaluate)
      this.contentNum = {
        basis: temp.basis.length,
        measures: temp.measures.length,
        mission: temp.mission.length,
        evaluate: temp.evaluate.length
      }
      this.addFormData = temp
      this.addFormData.mustFlag = 'yes'
    }
  },
  methods: {
    // 请求班次
    getClassifyData () {
      AxiosApi('/nrms/web-nr/focus-type', {}, 'GET', { deptId: this.addFormData.deptId }).then(res => {
        this.typeData = res.data || []
      })
    },
    // 焦点内容赋值
    getFocusContent () {
      this.focusContentFlag = false
      let str = ''
      this.addFormData.basis.forEach((item) => {
        if (item.value !== '') {
          str += 'yes'
          return true
        }
      })
      this.addFormData.measures.forEach((item) => {
        if (item.value !== '') {
          str += 'yes'
          return true
        }
      })
      this.addFormData.mission.forEach((item) => {
        if (item.value !== '') {
          str += 'yes'
          return true
        }
      })
      this.addFormData.evaluate.forEach((item) => {
        if (item.value !== '') {
          str += 'yes'
          return true
        }
      })
      if (str === '') {
        this.focusContentFlag = true
      } else {
        this.focusContentFlag = false
      }
      return this.focusContentFlag
    },
    // 保存数据
    saveData () {
      let flag = this.getFocusContent()
      if (flag) {
        return
      }
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          // 焦点内容转换
          let saveData = { ...this.addFormData }
          saveData.basis = JSON.stringify(saveData.basis)
          saveData.measures = JSON.stringify(saveData.measures)
          saveData.mission = JSON.stringify(saveData.mission)
          saveData.evaluate = JSON.stringify(saveData.evaluate)
          this.saveDataDo(saveData, this.actFlag)
        }
      })
    },
    // 添加多个
    addItem (act) {
      if (act === 'basis') {
        if (this.contentNum.basis < 10) {
          this.addFormData.basis.push({
            key: Date.now(),
            value: ''
          })
          this.contentNum.basis++
        } else {
          MsgShow('warning', '最多添加十个焦点内容（依据D）！')
        }
      } else if (act === 'measures') {
        if (this.contentNum.measures < 10) {
          this.addFormData.measures.push({
            key: Date.now(),
            value: ''
          })
          this.contentNum.measures++
        } else {
          MsgShow('warning', '最多添加十个焦点内容（措施A）！')
        }
      } else if (act === 'mission') {
        if (this.contentNum.mission < 10) {
          this.addFormData.mission.push({
            key: Date.now(),
            value: ''
          })
          this.contentNum.mission++
        } else {
          MsgShow('warning', '最多添加十个焦点内容（宣教T）！')
        }
      } else if (act === 'evaluate') {
        if (this.contentNum.evaluate < 10) {
          this.addFormData.evaluate.push({
            key: Date.now(),
            value: ''
          })
          this.contentNum.evaluate++
        } else {
          MsgShow('warning', '最多添加十个焦点内容（评价R）！')
        }
      }
    },
    // 删除多个
    removeItem (act, item) {
      let index
      if (act === 'basis') {
        index = this.addFormData.basis.indexOf(item)
        if (index !== -1) {
          this.addFormData.basis.splice(index, 1)
        }
        this.contentNum.basis--
      } else if (act === 'measures') {
        index = this.addFormData.measures.indexOf(item)
        if (index !== -1) {
          this.addFormData.measures.splice(index, 1)
        }
        this.contentNum.measures--
      } else if (act === 'mission') {
        index = this.addFormData.mission.indexOf(item)
        if (index !== -1) {
          this.addFormData.mission.splice(index, 1)
        }
        this.contentNum.mission--
      } else if (act === 'evaluate') {
        index = this.addFormData.evaluate.indexOf(item)
        if (index !== -1) {
          this.addFormData.evaluate.splice(index, 1)
        }
        this.contentNum.evaluate--
      }
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .form-main-center {
    max-width: 580px;
  }

  .iconAddCls{
    font-size: 24px;
    color: #409EFF;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: top;
  }
  .iconDelCls{
    font-size: 24px;
    color: #F56C6C;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: top;
  }
</style>
