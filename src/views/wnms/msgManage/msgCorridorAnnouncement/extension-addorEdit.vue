<!--分机公告-->
<template>
  <div class="typt-list-main">
    <div class="typt-add-container">
      <div class="typt-add-form extension-addorEdit" style="width: 600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-form-item label="入院须知" prop="">
            <el-input
              v-model="form.admissionNoticeContent"
              placeholder="请输入入院须知"
              class="elinput-400"
              type="textarea"
              :rows="8"
              maxlength="10000"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="科室简介" prop="">
            <el-input
              v-model="form.departmentProfileContent"
              placeholder="请输入科室简介"
              class="elinput-400"
              type="textarea"
              :rows="8"
              maxlength="10000"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="服务信息" prop="">
            <el-input
              v-model="form.serviceInformationContent"
              placeholder="请输入服务信息"
              class="elinput-400"
              type="textarea"
              :rows="8"
              maxlength="10000"
              show-word-limit
            />
          </el-form-item>

        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button type="primary" @click="submit()">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseEditForm from '../../common/BaseEditForm'
import * as csmsManageApi from '@/api/wnms/msgManage/csmsManage'
import mixins from '@/views/wnms/x28s/Manage/mixins'
import { selectDeptInfoData } from "@/assets/wnms/utils/common";

export default {
  mixins: [BaseEditForm, mixins],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },

  data () {
    const form = this.initForm()
    const selectDept = selectDeptInfoData()
    return {
      form,
      selectDept
    }
  },

  mounted () {
    this.getData()
  },
  methods: {
    initForm() {
      return {
        admissionNoticeContent: "",
        departmentProfileContent: "",
        serviceInformationContent: "",
      }
    },
    getData() {
      csmsManageApi.getDeviceNotice({
        deptId: this.selectDept.deptId
      }).then(res => {
        this.form = {
          admissionNoticeContent: res.data.admissionNoticeContent,
          departmentProfileContent: res.data.departmentProfileContent,
          serviceInformationContent: res.data.serviceInformationContent,
        }
      })
    },
    submit () {
      csmsManageApi.addDeviceNotice({
        ...this.form,
        deptId: this.selectDept.deptId
      }).then(res => {
        if(res.status === 200) {
          this.$message.success(res.desc)
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    }
  }
}
</script>
<style lang="scss">
  @import '@/assets/wnms/css/self_common.scss';
</style>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.btn_add,
.btn_del {
  font-size: 14px;
  height: 2.1rem;
  min-width: 0px;
}

.btn-area {
  padding: 20px 0px 10px 0px;
}
.query-area > div {
  margin-right: 50px;
}

.inputwidth {
  width: 30rem;
}
.textarea {
  width: 30rem;
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
/deep/ .el-textarea__inner {
  padding-bottom: 28px;
}
  .extension-addorEdit{
    .el-form{
      .el-form-item{
        height: auto;
      }
    }
  }
</style>
