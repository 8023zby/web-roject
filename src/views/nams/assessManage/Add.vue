<template>

  <layout v-loading="loading">

    <div slot="title">
      {{ form_type_text }}评估
    </div>

    <div slot="main" class="add-from">
      <el-row>
        <el-col :span="24">

          <el-form
            :model="ruleForm"
            ref="ruleForm"
            :rules="rules"
            label-width="160px">

            <el-form-item label="评估编号:"
                          prop="assCode"
                          v-if="form_type_text === '编辑' ">

              <el-col :span="23">
                <el-input
                  v-model="ruleForm.assCode"
                  placeholder=""
                  disabled />
              </el-col>
              <el-col :span="1"></el-col>

            </el-form-item>

            <el-form-item label="评估单名称:"
                          prop="assName">

              <el-col :span="23">
                <el-input
                  v-model="ruleForm.assName"
                  placeholder="请输入"
                  clearable
                  maxlength="32" />
              </el-col>
              <el-col :span="1"></el-col>

            </el-form-item>

            <!--el-row>
            <el-col :span="10">
              <el-form-item label="表单多次填写:"
                            prop="haveRecordRate">
                <el-switch v-model="ruleForm.haveRecordRate"
                         :inactive-value="0"
                         :active-value="1"
                         active-color="#05DB7A"
                         :change="changeHaveRecordRate(ruleForm.haveRecordRate)" />
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item label="最多可填写:"
                            v-if="isShowassRate"
                            prop="assRate"
                            label-width="100px">
                <el-select v-model="ruleForm.assRate"
                           style="width: 150px;"
                           clearable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1"
                    v-if="isShowassRate">
                    <span style="line-height: 32px;font-size: 14px;color: #666666;margin-left: -5px;">次</span>
            </el-col>

            </el-row-->

            <!--el-form-item label="匹配风险等级:"
                          prop="levelType">
              <el-switch v-model="ruleForm.levelType"
                         :inactive-value="0"
                         :active-value="1"
                         active-color="#05DB7A" />

            </el-form-item-->

            <el-form-item label="应用病区:"
                          prop="deptId">

              <el-col :span="23">

                <el-checkbox v-model="checkedAll"
                            @change="handleCheckAllChange"
                  >全选/取消全选
                </el-checkbox>

                <el-tree
                  ref="tree"
                  node-key="deptId"
                  show-checkbox
                  :expand-on-click-node="false"
                  :default-checked-keys="deptIds"
                  check-on-click-node
                  check-strictly
                  :data="nurse_data"
                  :props="defaultProps"
                  @check="handleNodeCheck" />

              </el-col>
              <el-col :span="1"></el-col>
            </el-form-item>

            <el-form-item label="简介:"
                          prop="assRemarks">

              <el-col :span="23">
                <el-input placeholder="请输入"
                          type="textarea"
                          v-model="ruleForm.assRemarks"
                          rows="7"
                          maxlength="100"
                          show-word-limit />
              </el-col>
              <el-col :span="1"></el-col>
            </el-form-item>

          </el-form>

          <div class="assess-footer">
            <el-button size="medium"
                       style="border-radius: 0;width: 78px;height: 38px;"
                       @click="close()">取消</el-button>
            <el-button type="primary"
                       style="border-radius: 0;width: 78px;height: 38px;"
                       size="medium"
                       @click="submitForm">保存</el-button>
          </div>

        </el-col>
      </el-row>
    </div>

    <div slot="footer_btn">

    </div>

  </layout>

</template>

<script>
import layout from '../../../components/nams/layout/edit'
import { ApiAssessManage, ApiDept, ApiLabel2Nurse } from '../../../api/nams/index'

export default {
  name: 'add',
  components: {
    layout
  },
  props: ['detail'],
  data () {
    return {
      loading: false,
      form_type_text: '',
      ruleForm: {
        assId: '',
        assCode: '', // 评估单编号
        assName: '', // 评估单名称
        assRemarks: '', // 简述
        haveRecordRate: 0, // 表单多次填写，1 是，0 否
        assRate: '', // 填写次数
        levelType: 0, // 匹配风险等级，1 是，0 否
        deptId: null// "a10c3769c19045c18325ceec28f9cbb7,a10c3769c19045c18325ceec28f9cbb8"
      },

      checkedAll: false,
      deptIds: [],
      defaultProps: {
        label: 'deptName'
      },

      label2nurse_data: [],
      current_labelcode: [],
      nurse_data: [],
      tree_nurse_data: [],

      isShowassRate: false, // 是否展示填写次数
      options: [
        {
          value: 2,
          label: '2'
        }, {
          value: 3,
          label: '3'
        }, {
          value: 4,
          label: '4'
        }, {
          value: 5,
          label: '5'
        }
      ],
      rules: {
        assName: [
          { required: true, message: '请输入评估单名称！', trigger: 'blur' },
          {
            min: 1,
            max: 32,
            message: '长度在 1 到 32 个字符！',
            trigger: 'blur'
          }
        ],
        haveRecordRate: [
          { required: true, message: '请选择表单多次填写类型！', trigger: 'change' }
        ],
        assRate: [
          { required: true, message: '请选择最多可填写次数！', trigger: 'change' }
        ],
        levelType: [
          { required: true, message: '请选择匹配风险等级类型！', trigger: 'change' }
        ],
        assRemarks: [
          { required: true, message: '请输入简介！', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符！',
            trigger: 'blur'
          }
        ]

      }
    }
  },
  watch: {
    label2nurse_data (data) {
      // console.log(data)
      data = data || []
      this.deptIds = data
      this.$nextTick(function () {
        this.$refs.tree.setCheckedKeys(data)
      })
    }
  },
  created () {
    let params = this.detail || {}
    this.form_type_text = params['assId'] ? '编辑' : '添加'
    // console.log(params)
    if (params.assRate === 0) {
      params.assRate = ''
    }
    Object.assign(this.ruleForm, params)
    this.getDeptData()
    // console.log(this.ruleForm.deptId)
    if (this.ruleForm.deptId === null || this.ruleForm.deptId === '' || this.ruleForm.deptId === undefined) {

    } else {
      this.label2nurse_data = this.ruleForm.deptId.split(',')
    }
  },
  computed: {

  },
  methods: {
    // 获取科室
    getDeptData () {
      this.nurse_data = []
      ApiDept.select().then(res => {
        this.nurse_data = res.data.list
        let dept = res.data.list
        this.nurse_data = dept // this.getNurseDataDept(dept);
        let temp = JSON.stringify(res.data.list)
        temp = temp
          .replace(/deptId/g, 'id')
          .replace(/deptName/g, 'label')
          .replace(/,"children":null/g, '')
        this.tree_nurse_data = JSON.parse(temp)
      })
    },
    // 获取所有科室的deptId
    getNurseDataDept (data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        let _d = data[i]
        arr.push({
          deptId: _d['deptId'],
          deptName: _d['deptName']
        })
        if (data[i].children) {
          let a = this.getNurseDataDept(data[i].children)
          arr.push(...a)
        }
      }
      return arr
    },

    handleCheckAllChange (val) {
      if (val) {
        let arr = (this.deptIds = this.getNurseDataDeptId(this.nurse_data))
        this.$refs.tree.setCheckedKeys(arr)
        this.ruleForm.deptId = this.deptIds.join(',')
      } else {
        this.deptIds = []
        this.$refs.tree.setCheckedKeys([])
        this.ruleForm.deptId = null
      }
    },
    getNurseDataDeptId (data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].deptId)
        if (data[i].children) {
          let a = this.getNurseDataDeptId(data[i].children)
          arr.push(...a)
        }
      }
      return arr
    },
    handleNodeCheck () {
      this.deptIds = this.$refs.tree.getCheckedKeys()
      this.ruleForm.deptId = this.deptIds.join(',')
    },

    // 返回
    close () {
      this.$emit('changed', 'list2')
    },
    // 保存
    submitForm () {
      // console.log(this.ruleForm)
      // return false
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiAssessManage.save(this.ruleForm)
            .then((res) => {
              this.$message.success(res.desc)

              if (this.form_type_text === '编辑') {
                let http = null
                http = ApiLabel2Nurse.one({
                  assIds: [this.ruleForm.assId],
                  depIds: this.ruleForm.deptId
                })

                http
                  .then(() => {
                    this.close()
                  })
                  .catch(res => {
                    this.$message.error(res.message)
                  })
              } else {
                this.close()
              }
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 表单是否多次填写
    changeHaveRecordRate (haveRecordRate) {
      if (haveRecordRate === 1) { // 开启
        this.isShowassRate = true
      } else {
        this.isShowassRate = false
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nams/css/self_common";

  .add-from {
    padding-top: 64px;
    width: 500px;
    max-height: 100%;
    margin-left: auto;
    margin-right: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  /deep/ .el-select{
        float: left;
        width: 150px !important;
        .el-input{
          width: 150px !important;
          .el-input__inner{
            width: 150px !important;
          }
        }
      }

  /*.el-col {
    border: 1px solid red;
  }*/

  .assess-footer {
    width: 100%;
    text-align: center;
    margin: 20px 0;
  }
</style>
