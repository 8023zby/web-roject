<!--点阵液晶显示屏公告-->
<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content"> {{ detail.type==="add"?"添加":'修改' }}</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form passport-user-modify" style="width: 600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-form-item label="内容" prop="content">
            <el-input v-model.trim="form.content" @keydown.native="pushKeyword($event)" placeholder="请输入公告内容" class="elinput-400" type="textarea" :rows="8" maxlength="30" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="backHandler">取消</el-button>
      <el-button type="primary" @click="submit('form')">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseEditForm from "../../common/BaseEditForm";
import { deepMergeLeft } from "@/assets/wnms/utils";
import * as csmsManageApi from "@/api/wnms/msgManage/csmsManage";
import { selectDeptInfoData } from "@/assets/wnms/utils/common";

import mixins from "@/views/wnms/x28s/Manage/mixins";

export default {
  mixins: [BaseEditForm, mixins],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },

  data() {
    const form = this.initForm();
    const rules = this.initRules();
    return {
      form: form,
      rules: rules,
      cutype: {
        video: false,
        content: true
      },
      cudeptid: ""
    };
  },

  mounted() {
    // 点击的时候是add
    let selectData = selectDeptInfoData();
    this.cudeptid = selectData.deptId;
    if (this.detail.type === "add") {
      deepMergeLeft(this.form, this.initForm());
    } else {
      this.form.id = this.detail.row.id;
      // 点击的时候是edit
      csmsManageApi.latticeDetails(this.detail.row.id).then(res => {
        if (res.status === 200) {
          deepMergeLeft(this.form, res.data);
        }
      });
    }
    this.$nextTick(() => {
      this.$refs["form"].clearValidate();
    });
  },
  methods: {
    pushKeyword(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    },
    initRules() {
      return {
        content: [
          {
            required: true,
            message: "不能为空",
            trigger: "change"
          }
        ]
      };
    },
    initForm() {
      let selectData = selectDeptInfoData();
      return {
        content: "",
        deptId: selectData.deptId,
        orgId: selectData.orgId
      };
    },
    ClearForm(fields) {
      let _field = this.$refs["form"].fields;
      _field.map(i => {
        if (i.prop === fields) {
          i.resetField();
          return false;
        }
      });
    },
    submit(formName) {
      this.submitHandler(formName);
    },
    customSubmitHandler() {
      if (this.detail.type === "add") {
        csmsManageApi.latticeAdd(this.form).then(data => {
          this.submitSuccessHandler(data);
        });
      } else {
        csmsManageApi.latticeEdit(this.form).then(data => {
          this.submitSuccessHandler(data);
        });
      }
    },
    submitSuccessHandler(data) {
      if (data.status === 200) {
        this.optionSuccessHandler();
        this.backHandler();
      }
    },
    backHandler() {
      this.$emit("option-changed", "index", this.detail);
    }
  }
};
</script>
<style lang="scss">
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
</style>
