<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{ form_type_text }}宣教记录</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 800px">
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="120px"
        >

          <el-form-item label="宣教类型：" prop="educationType" :rules="{ required: true, message: '宣教类型不能为空'}">

            <el-select v-model="ruleForm.educationType" placeholder="请选择宣教类型">
              <el-option label="入院宣教" value="1"></el-option>
              <el-option label="住院宣教" value="2"></el-option>
              <el-option label="出院宣教" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="宣教对象：" prop="educationObject" >
            <el-checkbox-group v-model="ruleForm.educationObject">
              <el-checkbox label="1">患者</el-checkbox>
              <el-checkbox label="2">家属</el-checkbox>
              <el-checkbox label="3">陪护</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="宣教方式：" prop="educationWay"
          >
            {{ruleForm.eduWay}}
            <el-checkbox-group v-model="ruleForm.educationWay">
              <el-checkbox label="1">口述</el-checkbox>
              <el-checkbox label="2">演示</el-checkbox>
              <el-checkbox label="3">书面</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="宣教时间："  prop="sendEduWay" :rules="{ required: true, message: '宣教时间不能为空'}">
            <el-radio :label="1" v-model="ruleForm.sendEduWay">即时宣教</el-radio>
          </el-form-item>
          <el-form-item label="" :rules="{ required: true, message: '宣教时间不能为空'}">
            <el-radio :label="2" v-model="ruleForm.sendEduWay">计划宣教</el-radio>
            <el-date-picker
              v-model="ruleForm.educationTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="宣教内容："  prop="educationText" :rules="{ required: true, message: '宣教内容不能为空'}">
            <el-input
              v-model="ruleForm.educationText"
              placeholder="请选择"
              style="width: 36%"
              readOnly
            ></el-input>
            <el-button size="mini" type="primary" @click="chooseEduContent()" style="margin-left: 15px;">选择</el-button>
          </el-form-item>
          <el-form-item>
            <span style="color:#a39ca0;">{{whileName}}</span>
          </el-form-item>

        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button  @click="close()">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="submitForm"
      >保存</el-button
      >
    </div>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <el-dialog
        title="选择宣教内容"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="eduDialogVisible"
        width="600px"
      >
        <div style="overflow: auto;height: 450px">
          <el-tree
            ref="treeForm"
            :data="content_data"
            highlight-current
            accordion
            show-checkbox
            :check-strictly="true"
            check-on-click-node
            node-key="id"
            @check="handleClick"
            :default-expanded-keys="[treeCheckedObj.checked]"
            :default-checked-keys="[treeCheckedObj.checked]"
          >
          </el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="cancelChoose()" >取 消</el-button>
        <el-button type="primary" @click="chooseContent">确 定</el-button>
      </span>
      </el-dialog>
    </slot>
  </div>
</template>

<script>

import { getEdu, addEduRecord, editEduRecord } from '@/api/hpms/eduCation/situation'
import layout from './layout/edit'

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
  data () {
    return {
      loading: false,
      show_labelDisplayTypeValue: false,
      expanded_content_ids: [], // 默认展开的宣教分类分类
      content_data: [], // 宣教数据
      // 弹窗开关
      contentDialogVisible: false,
      contentDetailData: {},
      content_form: [], // 选择后的宣教数据
      // 新建表单
      ruleForm: {
        deptId: '',
        patientId: '',
        bedName: '',
        patientName: '', // 患者姓名
        educationTime: this.getDateTime(), // 宣教时间
        educationObject: [], // 宣教对象
        educationType: '', // 宣教类型
        educationCount: 1, // 宣教次数
        educationProject: '', // 宣教项目
        educationText: '', // 宣教内容
        educationUser: '', // 宣教者
        educationWay: [], // 宣教方式
        sendEduWay: 1 // 及时推送
      },
      education: {
        educationId: '',
        educationTitle: ''
      },
      treeCheckedObj: {
        checked: '',
        whileName: '',
        label: ''
      },
      whileName: '',
      rules: {},
      eduDialogVisible: false,
      eduAddress: ''
    }
  },
  computed: {
    form_type_text () {
      return this.detail && this.detail.id ? '编辑' : '添加'
    }
  },
  created () {
    // 初始化
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.ruleForm.deptId = this.patient.deptId
    this.ruleForm.educationUser = empInfo.empName
    this.expanded_content_ids = [empInfo.deptId]
    if (this.detail.id) {
      this.ruleForm.educationType = this.detail.eduType.toString()
      let eo = this.detail.eduTarget.split(',')
      this.ruleForm.educationObject = eo.filter(function (el) {
        return el !== ''
      })
      let ew = this.detail.eduWay.split(',')
      this.ruleForm.educationWay = ew.filter(function (el) {
        return el !== ''
      })

      this.ruleForm.educationTime = this.detail.sentTime
      this.ruleForm.sendEduWay = Number(this.detail.sendType)
      this.ruleForm.educationText = this.detail.eduName
      this.education = {
        educationId: this.detail.eduId,
        educationTitle: this.detail.eduName
      }
    } else {
      Object.assign(this.ruleForm, this.patient)
    }
    this.getEducationData()
  },
  mounted () {
  },
  activated () {
    Object.assign(this.ruleForm, this.detail)
    this.ruleForm.patientId = this.patient.patientId
  },
  deactivated () {
    // 清空上次选择的数据
    this.content_form = []
  },
  methods: {
    dealWholeLabel () {
      let key = this.detail.eduId
      for (let v of this.content_data.values()) {
        if (v.id === key) {
          this.whileName = v.label
        } else if (v.children !== null) {
          for (let v2 of v.children.values()) {
            if (v2.id === key) {
              this.whileName = v.label + '-' + v2.label
            } else if (v2.children !== null) {
              for (let v3 of v2.children.values()) {
                if (v3.id === key) {
                  this.whileName = v.label + '-' + v2.label + '-' + v3.label
                }
              }
            }
          }
        }
      }
    },
    // 获取宣教内容
    getEducationData () {
      getEdu({
        orgId: JSON.parse(localStorage.getItem('empInfo')).orgId,
        nurseUnitId: this.ruleForm.deptId + ',' + 0
      }).then(res => {
        console.log(res.data)
        for (let i of res.data) {
          if (i.children !== null) {
            i.disabled = true
          }
          for (let j of i.children) {
            if (i.children !== null) {
              j.disabled = true
            }
          }
        }
        this.content_data = res.data
        if (this.detail.id) this.dealWholeLabel()
      })
    },
    // 树 事件
    showContent (data) {
      console.log(data)
      if (data.children) {
        return
      }
      this.contentDialogVisible = true
      this.contentDetailData = JSON.parse(JSON.stringify(data))
      this.ruleForm.educationText = this.contentDetailData.label
      this.contentDetailData['educationText'] = JSON.parse(this.contentDetailData.educationText || '{}')
    },
    // 选择内容 确认 事件
    changeContent () {
      let content = this.ruleForm.educationText ? [this.ruleForm.educationText] : []
      content.push(...this.content_form)
      this.ruleForm.educationText = content.join('\r\n')
      this.ruleForm.educationProject = this.contentDetailData.label
      this.content_form = []
      this.contentDetailData = {}
      this.contentDialogVisible = false
    },
    // 加载宣教内容
    chooseEduContent () {
      this.treeCheckedObj = {
        checked: this.education.educationId,
        whileName: this.whileName,
        label: this.education.educationTitle
      }
      this.eduDialogVisible = true

      this.$nextTick(() => {
        this.$refs.treeForm.setCheckedKeys([this.treeCheckedObj.checked])
      })
    },
    cancelChoose () {
      this.treeCheckedObj = {
        checked: '',
        whileName: '',
        label: ''
      }
      this.eduDialogVisible = false
    },
    chooseContent () {
      if (this.treeCheckedObj.checked === '') {
        this.$message.error('未选择文章！')
        return
      }
      this.education.educationId = this.treeCheckedObj.checked
      this.education.educationTitle = this.treeCheckedObj.label
      this.ruleForm.educationText = this.treeCheckedObj.label
      this.whileName = this.treeCheckedObj.whileName

      this.cancelChoose()
    },
    handleClick (data, checked, node) {
      if (checked.checkedKeys.length === 0) {
        this.$refs.treeForm.setCheckedNodes([])
        this.treeCheckedObj = {
          checked: '',
          whileName: '',
          label: ''
        }
      } else {
        this.$refs.treeForm.setCheckedNodes([data])
        this.treeCheckedObj.label = data.label
        this.treeCheckedObj.checked = data.id

        let key = data.id
        for (let v of this.content_data.values()) {
          if (v.id === key) {
            this.treeCheckedObj.whileName = v.label
          } else if (v.children !== null) {
            for (let v2 of v.children.values()) {
              if (v2.id === key) {
                this.treeCheckedObj.whileName = v.label + '-' + v2.label
              } else if (v2.children !== null) {
                for (let v3 of v2.children.values()) {
                  if (v3.id === key) {
                    this.treeCheckedObj.whileName = v.label + '-' + v2.label + '-' + v3.label
                  }
                }
              }
            }
          }
        }
      }
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(this.ruleForm.sendEduWay)
          if (new Date(this.ruleForm.educationTime) < new Date() && this.ruleForm.sendEduWay === 2) {
            this.$message.error('宣教时间不能早于当前时间！')
            return
          }
          this.loading = true

          if (this.detail.id) {
            // this.education.educationId = this.detail.eduId
            editEduRecord({
              id: this.detail.id,
              patientId: this.patient.patientId,
              eduType: this.ruleForm.educationType,
              eduTarget: this.ruleForm.educationObject.join(','),
              eduWay: this.ruleForm.educationWay.join(','),
              sendType: this.ruleForm.sendEduWay,
              sentTime: this.ruleForm.educationTime + ':00',
              eduId: this.education.educationId, // 宣教文章id
              nurseUnitId: this.ruleForm.deptId,
              updateUser: JSON.parse(localStorage.getItem('empInfo')).empName,
              updateUserId: localStorage.getItem('userId'),
              isEnable: 1
            }).then(res => {
              console.log(res)
              this.$message.success('保存正确！')
              this.loading = false
              this.close()
            }).catch(error => {
              this.$message.error(error.message)
            })
          } else {
            let d = new Date(this.ruleForm.educationTime)
            let dtime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
            addEduRecord({
              patientId: this.ruleForm.patientId,
              eduType: this.ruleForm.educationType,
              eduTarget: this.ruleForm.educationObject.join(','),
              eduWay: this.ruleForm.educationWay.join(','),
              sendType: this.ruleForm.sendEduWay,
              sentTime: dtime + ':00',
              eduId: this.education.educationId, // 宣教文章id
              nurseUnitId: this.ruleForm.deptId,
              createUser: JSON.parse(localStorage.getItem('empInfo')).empName,
              createUserId: localStorage.getItem('userId')
            }).then(res => {
              console.log(res)
              this.$message.success('保存正确！')
              this.loading = false
              this.close()
            }).catch(error => {
              this.$message.error(error.message)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 返回
    close () {
      this.$emit('option-changed', 'list')
    },
    getDateTime () {
      let date = new Date()
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000)

      return date
      // return date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + date.getDate() +
      //   ' ' + (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' +
      //   (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) + ':' +
      //   (date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds())
      // return date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + date.getDate() +
      //        ' 10:00:00'
    }
  }
}
</script>
<style lang="scss">
  @import "@/assets/hpms/css/self_common.scss";
</style>
<style lang="scss" type="text/scss" scoped>
  @import "./self_common";

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
