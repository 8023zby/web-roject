<template>
  <layout>
    <div slot="title">添加</div>
    <div slot="main" class="add-from">
      <el-form
        :rules="rules"
        :model="operationForm"
        ref="form"
        label-width="104px"
        class="form-main-center"
      >
        <el-form-item label="手术日期:" prop="operationDate">
          <el-date-picker
            v-model="operationForm.operationDate"
            type="date"
            placeholder="请选择"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型:" prop="operationType">
          <el-input
            v-model="operationForm.operationType"
            placeholder="请输入"
            maxlength="32"
          ></el-input>
        </el-form-item>
        <el-form-item label="床位:" prop="bedNo">
          <el-select v-model="operationForm.bedNo" placeholder="请选择" @change="changeBed" filterable>
            <el-option v-for="(item,index) in bedList" :key="item.bedId" :label="item.bedName" :value="item.bedName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="住院号:" prop="patientHospitalNo">
          <el-input v-model="operationForm.patientHospitalNo" placeholder="请输入" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="patientName">
          <el-input v-model="operationForm.patientName" placeholder="请输入" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="patientSex">
          <el-select v-model="operationForm.patientSex" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄:" prop="patientAge">
          <el-input type="number" v-model="operationForm.patientAge" placeholder="请输入" maxlength="3" @input="onChangeAge"></el-input>
        </el-form-item>
        <el-form-item label="麻醉:" prop="anesthesiaMode">
          <el-select v-model="operationForm.anesthesiaMode" placeholder="请选择">
            <el-option label="全" value="全"></el-option>
            <el-option label="局" value="局"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 404px"></el-form-item>
        <el-form-item label="病变/处理血管:" prop="operationHandle" style="width: 100%">
          <el-input type="textarea" v-model="operationForm.operationHandle" placeholder="请输入" maxlength="100" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="化验:" prop="laboratory" style="width: 100%">
          <el-input type="textarea" v-model="operationForm.laboratory" placeholder="请输入" maxlength="100" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="检查:" prop="inspect" style="width: 100%">
          <el-input type="textarea" v-model="operationForm.inspect" placeholder="请输入" maxlength="100" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="体重/医保:" prop="weight" style="width: 100%">
          <el-input type="textarea" v-model="operationForm.weight" placeholder="请输入" maxlength="100" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark" style="width: 100%">
          <el-input type="textarea" v-model="operationForm.remark" placeholder="请输入" maxlength="100" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button @click="cancel">
        取消
      </el-button>
      <el-button type="primary" @click="submitForm">
        保存
      </el-button>
    </div>
  </layout>
</template>
<script>
import layout from '../../../components/bnms/layout/edit'
import { ApiBedCard, ApiBedRoom, ArrangeApi } from '../../../api/bnms/index'
const moment = require('moment')
export default {
  components: { layout },
  props: ['params'],
  data () {
    return {
      operationForm: {
        operationDate: moment().format('YYYY-MM-DD')
      },
      rules: {
        operationDate: [
          { required: true, message: '请选择手术日期', trigger: 'change' }
        ],
        operationType: [
          { required: true, message: '请输入手术类型', trigger: 'change' }
        ],
        patientHospitalNo: [
          { required: true, message: '请输入住院号', trigger: 'change' }
        ],
        bedNo: [
          { required: true, message: '请选择床位', trigger: 'change' }
        ],
        patientName: [
          { required: true, message: '请输入患者姓名', trigger: 'change' }
        ]
      },
      row: null,
      /**
      * ------------------------------------------------------------------
      * 床位选择
      * ------------------------------------------------------------------
      */
      deptId: '',
      bedList: [],
      bedPatientList: []
    }
  },
  async mounted () {
    this.row = this.params.row
    if (this.row) {
      this.operationForm = {
        ...this.params.row
      }
    }
    // 获取部门信息
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptId = deptInfo.deptId || ''
    // 获取床位信息
    await this.getAllBeds()
    await this.getHasPatientBed()
  },
  methods: {
    /**
    * ------------------------------------------------------------------
    * 添加编辑信息
    * ------------------------------------------------------------------
    */
    onChangeAge (value) {
      if (value.length > 3) {
        this.operationForm.patientAge = value.slice(0, 3)
      }
    },

    /**
    * ------------------------------------------------------------------
    * 获取床位信息
    * ------------------------------------------------------------------
    */

    /**
     * @description: 获取所有床位
     * @param {*}
     * @return {*}
     */
    async getAllBeds () {
      try {
        let res = await ApiBedRoom.bedList({ deptId: this.deptId, pageHelper: 2 })
        this.bedList = res.data
      } catch (error) {
      }
    },
    /**
     * @description: 获取床位信息
     * @param {*}
     * @return {*}
     */
    async getHasPatientBed () {
      try {
        let res = await ApiBedCard.patientList()
        this.bedPatientList = res.data.patientSelectDtos
      } catch (error) {
      }
    },
    /**
     * @description: 当选择床位时自动填写
     * @param {*}
     * @return {*}
     */
    async changeBed (e) {
      let patient = {}
      this.bedPatientList.map(item => {
        if (item.patientIn.bedName == e) {
          patient = item.patientIn
        }
      })
      this.operationForm = {
        ...this.operationForm,
        patientName: patient.patientName,
        patientHospitalNo: patient.inpNo,
        patientSex: patient.sex,
        patientAge: parseInt(patient.patientAge),
        patientId: patient.patientId
      }
    },
    /**
    * ------------------------------------------------------------------
    * 取消保存操作
    * ------------------------------------------------------------------
    */
    // 取消
    cancel () {
      this.$emit('option-changed', 'list')
    },
    // 确认
    async submitForm () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (!this.row) {
            this.operationForm.operationDate = moment(this.operationForm.operationDate).format('YYYY-MM-DD')
            try {
              let res = await ArrangeApi.add(this.operationForm)
            } catch (error) {
              this.$message.error(error.message)
              return
            }
          } else {
            try {
              let res = await ArrangeApi.update(this.operationForm)
            } catch (error) {
              this.$message.error(error.message)
              return
            }
          }
          this.$emit('main-reload')
          this.$emit('option-changed', 'list')
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/bnms/css/self_common";
.form-main-center {
  max-width: initial;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 40px 60px 10px;
}
</style>
