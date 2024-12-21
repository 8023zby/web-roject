<template>
  <layout>
    <div slot="title">{{titMsg}}宣教</div>
    <div slot="main" class="add-from" >
      <el-form :model="addFormData" :rules="rules" ref="addForm" label-width="190px" class="form-main-center">
        <el-form-item label="宣教分类：" prop="typeId">
          <el-select v-model="addFormData.typeId" placeholder="请选择宣教分类" clearable size="small">
            <el-option v-for="(item, index) in typeData" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宣教项目：" prop="educationProject">
          <el-input v-model="addFormData.educationProject" placeholder="请输入宣教项目" clearable></el-input>
        </el-form-item>
        <el-form-item
          :label="index===0?'宣教内容：':''"
          v-for="(item, index) in addFormData.educationText"
          :key="item.key"
          :prop="'educationText.' + index + '.value'"
          :rules="rules_content"
        >
          <el-input style="width: 70%" rows="5" type="textarea" v-model="item.value" placeholder="请输入宣教内容" clearable></el-input>
          <i @click.prevent="addItem()" class="el-icon-circle-plus-outline iconAddCls"></i>
          <i v-if="index!==0" @click.prevent="removeItem(item)" class="el-icon-remove-outline iconDelCls"></i>
        </el-form-item>
      </el-form>
      <div class="form-footer-btn">
        <el-button @click="reloadUrl">取消</el-button>
        <el-button type="primary" @click="saveData">提 交</el-button>
      </div>
    </div>
  </layout>
</template>

<script>
  import BaseManage from '../../../assets/nrms/mixins/BaseManage';
  import { AxiosApi } from '../../../api/nrms/http/index';
  import { MsgShow } from '../../../assets/nrms/js/Message';
  import layout from '../../../components/nrms/layout/edit';

  export default {
    name: 'NurseApplyAdd',
    mixins: [BaseManage],
    props: ['modifyData', 'params'],
    data() {
      return {
        titMsg: '添加',
        typeData: [],
        contentNum: 1,
        actFlag: 'add',
        addFormData: {
          typeId: '',
          educationProject: '',
          deptId: '',
          educationText: [{
            key: `edu_${Date.now()}`,
            value: ''
          }]
        },
        modelName: '宣教',
        url: '/nrms/web-nr/education',
        rules: {
          typeId: [
            { required: true, message: '请选择宣教分类！' }
          ],
          educationProject: [
            { required: true, message: '请输入宣教项目！' }
          ]
        },
        rules_content: [
          { required: true, message: '请输入宣教内容！', trigger: 'blur' },
          { pattern: /^.{0,100}$/, message: '宣教内容长度不能超过100个字符！', trigger: 'blur' }
        ]
      };
    },
    // 初始化数据
    created() {
      let obj = this.modifyData;
      let key = obj['educationId'] || '';
      let o = JSON.parse(localStorage.getItem('selectDeptInfo')) || {};
      this.addFormData.deptId = o.deptId || '';
      this.getClassifyData();
      if (key) {
        this.actFlag = 'modify';
        this.titMsg = '编辑';
        // 对象的复制，不然会影响原来的值（假数据导致，要是请求后台应该不会有这问题）
        let temp = { ...obj };
        temp.educationText = JSON.parse(temp.educationText);
        this.contentNum = temp.educationText.length;
        this.addFormData = temp;
      }
    },
    methods: {
      // 请求分类
      getClassifyData() {
        AxiosApi('/nrms/web-nr/education-type/query-children', {}, 'GET', { deptId: this.addFormData.deptId }).then(res => {
          this.typeData = res.data || [];
        });
      },
      // 保存数据
      saveData() {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            // 宣教内容转换
            let saveData = { ...this.addFormData };
            saveData.educationText = JSON.stringify(saveData.educationText);
            this.saveDataDo(saveData, this.actFlag);
          }
        });
      },
      // 添加多个
      addItem() {
        if (this.contentNum < 10) {
          this.addFormData.educationText.push({
            key: Date.now(),
            value: ''
          });
          this.contentNum++;
        } else {
          MsgShow('warning', '最多添加十个宣教内容');
        }
      },
      // 删除多个
      removeItem(item) {
        let index = this.addFormData.educationText.indexOf(item);
        if (index !== -1) {
          this.addFormData.educationText.splice(index, 1);
        }
        this.contentNum--;
      }
    },
    components: { layout }
  };
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .iconAddCls{
    font-size: 24px;
    color: #409EFF;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
  }
  .iconDelCls{
    font-size: 24px;
    color: #F56C6C;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
  }
</style>
