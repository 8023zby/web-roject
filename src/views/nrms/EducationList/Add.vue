<template>
  <layout v-loading="loading">
    <div slot="title">
      {{ form_type_text }}宣教
    </div>
    <div slot="main" class="add-from">
      <el-row>
        <el-col :span="18">
          <el-form
            :model="ruleForm"
            ref="ruleForm"
            label-width="120px"
          >
            <!-- 患者基本信息  -->
            <el-form-item label="床号" prop="bedName">
              <el-input
                v-model="patient.bedName"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="patientName">
              <el-input
                v-model="patient.patientName"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="宣教对象" prop="educationObject" :rules="{ required: true, message: '宣教对象不能为空'}">
              <el-checkbox-group v-model="ruleForm.educationObject">
                <el-checkbox label="患者"></el-checkbox>
                <el-checkbox label="家属"></el-checkbox>
                <el-checkbox label="陪护"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="宣教方式" prop="educationType"
                          :rules="{ required: true, message: '宣教方式不能为空'}"
            >
              <el-checkbox-group v-model="ruleForm.educationType">
                <el-checkbox label="口述"></el-checkbox>
                <el-checkbox label="演示"></el-checkbox>
                <el-checkbox label="书面"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="宣教次数" prop="educationCount">
              <el-select
                v-model="ruleForm.educationCount"
                filterable
                allow-create
                placeholder="">
                </el-option>
                <el-option
                  v-for="value in 10"
                  :key="value"
                  :label="value"
                  :value="value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="宣教项目" prop="educationProject" :rules="{ required: true, message: '宣教项目不能为空'}">
              <el-input
                v-model="ruleForm.educationProject"
                placeholder=""
                readonly
              >
              </el-input>
            </el-form-item>

            <el-form-item
              prop="educationText"
              required
              label="宣教内容"
              :rules="[
                  { required: true, message: '宣教内容不能为空'},
                  { min: 1, max: 500, message: '最多500个字符', trigger: 'blur' }
                ]"
            >
              <el-input type="textarea" style="width: 100%" :rows="10" v-model="ruleForm.educationText"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="10">

                <el-form-item label="护士" prop="educationUser">
                  <el-input
                    v-model="ruleForm.educationUser"
                    placeholder=""
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="宣教时间" prop="educationTime">
                  <el-date-picker
                    v-model="ruleForm.educationTime"
                    type="datetime"
                    valueFormat="yyyy-MM-dd HH:mm:ss"
                    placeholder="">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>


            <el-form-item class="form-footer-btn">
              <el-button size="small" @click="close()"
              >返回
              </el-button
              >
              <el-button type="primary" size="small" @click="submitForm"
              >保存
              </el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="5" :offset="1">
          <div class="nurse_content">
            <div class="title">宣教内容</div>
            <el-tree
              :data="content_data"
              highlight-current
              accordion
              node-key="deptId"
              :default-expanded-keys="[...expanded_content_ids]"
              @node-click="showContent"
            >
            </el-tree>
          </div>
        </el-col>
      </el-row>
    </div>

    <template slot>
      <!-- 选择弹框 -->
      <el-dialog
        class="content_window"
        title="请选择宣教内容"
        :visible.sync="contentDialogVisible"
        width="40%">
        <div>
          <el-form ref="content_form" label-width="80px">
            <el-form-item>
              <el-checkbox-group v-model="content_form">
                <el-checkbox :label="item.value" v-for="(item,index) in contentDetailData.educationText" :key="index">{{item.value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="contentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changeContent">确认</el-button>
      </span>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
  import { ApiEducationList } from '../../../api/nrms/index';
  import { deepMerge } from '../../../assets/nrms/common/utils';
  import layout from '../../../components/nrms/layout/edit';

  export default {
    name: 'nurse_notes_add',
    components: { layout },
    props: {
      patient: {
        type: Object
      },
      detail: {
        type: Object
      }
    },
    data() {
      return {
        loading: false,
        show_labelDisplayTypeValue: false,
        expanded_content_ids: [], //默认展开的宣教分类分类
        content_data: [], //宣教数据
        //弹窗开关
        contentDialogVisible: false,
        contentDetailData: {},
        content_form: [], // 选择后的宣教数据
        //新建表单
        ruleForm: {
          deptId: '',
          patientId: '',
          bedName: '',
          patientName: '',  //患者姓名
          educationTime: this.getDateTime(),  //宣教时间
          educationObject: [], //宣教对象
          educationType: [], //宣教类型
          educationCount: 1,  //宣教次数
          educationProject: '', //宣教项目
          educationText: '', //宣教内容
          educationUser: '' //宣教者
        },
        rules: {}
      };
    },
    computed: {
      form_type_text() {
        return this.detail && this.detail.recordId ? '编辑' : '添加';
      }
    },
    created() {
      //初始化
      let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {};
      this.ruleForm.deptId = empInfo.deptId;
      this.ruleForm.educationUser = empInfo.empName;
      this.expanded_content_ids = [empInfo.deptId];
      if (this.detail.recordId) {
        Object.assign(this.ruleForm, this.detail);
        this.ruleForm.educationObject = this.ruleForm.educationObject.split(",");
        this.ruleForm.educationType = this.ruleForm.educationType.split(",");
      } else {
        Object.assign(this.ruleForm, this.patient);
      }
      this.getEducationData();
    },
    activated() {
      Object.assign(this.ruleForm, this.detail);
      this.ruleForm.patientId = this.patient.patientId;
    },
    deactivated() {
      //清空上次选择的数据
      this.content_form = [];
    },
    methods: {
      // 获取宣教内容
      getEducationData() {
        ApiEducationList.contentAll().then(res => {
          this.content_data = res.data;
        });
      },
      //树 事件
      showContent(data) {
        if (data.children) {
          return;
        }
        this.contentDialogVisible = true;
        this.contentDetailData = JSON.parse(JSON.stringify(data));
        this.contentDetailData['educationText'] = JSON.parse(this.contentDetailData.educationText || '{}');
      },
      //选择内容 确认 事件
      changeContent() {
        let content = this.ruleForm.educationText ? [this.ruleForm.educationText] : [];
        content.push(...this.content_form);
        this.ruleForm.educationText = content.join('\r\n');
        this.ruleForm.educationProject = this.contentDetailData.label;
        this.content_form = [];
        this.contentDetailData = {};
        this.contentDialogVisible = false;
      },
      submitForm() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true;
            let _ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
            _ruleForm.educationObject = _ruleForm.educationObject.join(",");
            _ruleForm.educationType = _ruleForm.educationType.join(",");
            ApiEducationList.save(_ruleForm)
              .then(() => {
                this.$message.success('保存正确！');
                this.loading = false;
                this.close();
              })
              .catch(res => {
                this.loading = false;
                this.$message.error(res.message);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //返回
      close() {
        this.$emit('option-changed', 'list');
      },
      getDateTime() {
        let date = new Date();
        return date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + date.getDate()
          + ' ' + (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' +
          (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) + ':' +
          (date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds());
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .content_window /deep/ .el-checkbox {
    display: flex;
    margin-top: 6px;
    margin-bottom: 10px;
    white-space: normal;
  }

  .content_window /deep/ .el-checkbox__input {
    padding-top: 3px;
  }

  .nurse_content {
    width: 220px;
    max-height: 400px;
    overflow: auto;
    border: 1px solid rgb(228, 231, 237);

    .title {
      padding: 20px 0 15px 30px;
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }

  .nurse_content /deep/ .el-tree {
    padding: 0 20px 20px;
  }

  .nurse_content /deep/ .el-tree-node__content>.el-tree-node__expand-icon {
    padding: 4px;
    color: #333;
    font-size: 16px;
  }

  .nurse_content /deep/ .el-tree-node__content {
    overflow: hidden;
  }

  .nurse_content /deep/ .el-tree-node__label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
