<template>
  <el-dialog
    title="应用"
    :visible="visible"
    :close-on-click-modal="false"
    :show-close="false"
    width="400px"
    @close="resetCloseForm">

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

    <div slot="footer" class="dialog-footer">
      <el-button @click="resetCloseForm()" size="small">取消</el-button>
      <el-button @click="submitForm()" size="small"
                 type="primary" >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ApiLabel2Nurse } from "../../../api/nams/index";

export default {
  name: "label2nurse",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    init_checked: {
      type: Array,
      default: function() {
        return [];
      }
    },
    label_ids: {
      type: Array,
      default: function() {
        return [];
      }
    },
    nurse_data: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      checkedAll: false,
      deptIds: [],
      defaultProps: {
        label: "deptName"
      }
    };
  },
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        let arr = (this.deptIds = this.getNurseDataDeptId(this.nurse_data));
        this.$refs.tree.setCheckedKeys(arr);
      } else {
        this.deptIds = [];
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    getNurseDataDeptId(data) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].deptId);
        if (data[i].children) {
          let a = this.getNurseDataDeptId(data[i].children);
          arr.push(...a);
        }
      }
      return arr;
    },
    handleNodeCheck() {
      this.deptIds = this.$refs.tree.getCheckedKeys();
    },
    submitForm() {
      let http = null;
      //批量应用
      if (this.label_ids.length > 1) {
        http = ApiLabel2Nurse.multi({
          assIds: this.label_ids,//.join(","),
          depIds: this.deptIds.join(",")
        });
      }
      //单个应用
      else {
        // 取得未选中的
        let ban = [];
        this.init_checked.forEach(v => {
          if (this.deptIds.indexOf(v) == -1) {
            ban.push(v);
          }
        });

        http = ApiLabel2Nurse.one({
          assIds: this.label_ids,//[0],
          depIds: this.deptIds.join(","),
          // banDeptIdList: ban.join(",")
        });
      }
      http
        .then(() => {
          this.$message.success("应用成功！");
          this.$emit('option-changed')
          this.resetCloseForm();
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    //重置表单 & 关闭窗体
    resetCloseForm() {
      this.checkedAll = false;
      this.$emit("update:visible", false);
    }
  },
  watch: {
    init_checked(data) {
      data = data || [];
      this.deptIds = data;
      this.$nextTick(function() {
        this.$refs.tree.setCheckedKeys(data);
      });
    },
    deptIds(val) {
      if(val.length < this.nurse_data.length) {
        this.checkedAll = false
      }
      if(this.nurse_data.length === val.length){
        this.checkedAll = true
      }
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
  .dialog-footer .el-button--small {
    padding: 12px 20px !important;
    border-radius: 0 !important;
  }
</style>
