<!--
 * @Author: your name
 * @Date: 2021-10-14 14:33:41
 * @LastEditTime: 2021-12-15 13:44:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \develop_sams\src\views\nrms\CritcalValue\receive.vue
-->
<template>
  <el-dialog
  title="接收"
  :visible.sync="dialogVisible"
  :close-on-click-modal="false"
  width="490px">
  <span style="margin-bottom:30px;display:block">确认接收该条危急值消息吗？</span>
  <el-form ref="form" :model="form" > <!-- label-width="40px" -->
    <el-form-item label="备注:">
      <el-input v-uni="'weijizhi_jieshou'" type="textarea" style="width:300px" maxlength="100" show-word-limit :autosize="{minRows: 4, maxRows: 5}" v-model="form.remark"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button v-uni="'weijizhi_jieshou_cancel'" @click="cancel">取 消</el-button>
    <el-button v-uni="'weijizhi_jieshou_confirm'" type="primary" @click="receiveConfirm">确 定</el-button>
  </span>
</el-dialog>

</template>

<script>
import { ApiWarningList } from '@/api/nrms/index.js'
export default {
  props: ['dialogVisible', 'reportId'],
  data () {
    return {
      form: {
        remark: ''
      }
    }
  },
  created () { },
  methods: {
    cancel () {
      this.form.remark = ''
      this.$parent.dialogVisible = false
    },
    receiveConfirm () {
      const nurseName = JSON.parse(localStorage.getItem('empInfo'))
      const data = {
        receiveUser: nurseName.empName, // 接收人；字符串；必填
        remark: this.form.remark, // 备注；字符串；可选
        reportId: this.reportId // 记录ID；字符串；必填
      }
      ApiWarningList.receivePatient(data).then(res => {
        console.log(res)
        this.$emit('getCheckList')
        this.cancel()
      })
        .catch(console.error())
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-form-item__label {
  text-align: left;
}

/deep/ .el-dialog__body{
  padding-left: 65px;
}

</style>
