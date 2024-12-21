<template>
  <el-dialog
    title="应用"
    :visible="visible"
    :close-on-click-modal="false"
    width="490px"
    @close="resetCloseForm"
    :showClose="false"
  >
    <el-form ref="ruleForm" :model="ruleForm">
      <el-form-item
        prop="shiftMainId"
        :rules="{
          required: true, message: '请选择交班！', trigger: 'change'
        }">
        <el-select v-model="ruleForm.shiftMainId" placeholder="交班" @change="handleChange">
          <el-option v-for="item in shifts" :key="item.shiftMainId" :label="item.shiftMainName" :value="item.shiftMainId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="tree-container">
      <el-checkbox v-model="checkedAll" @change="handleCheckAllChange">
        全选/取消全选
      </el-checkbox>

      <el-tree
        v-loading="loading"
        ref="tree"
        node-key="deptId"
        show-checkbox
        :expand-on-click-node="false"
        :default-checked-keys="curCheckedDeptIds"
        check-on-click-node
        check-strictly
        :data="allDepts"
        :props="defaultProps"
        @check="handleNodeCheck"
      ></el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetCloseForm()" size="small">关闭</el-button>
      <el-button type="primary" @click="submitForm()" size="small">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { ApiShifts2Dept, ApiDept, ApiShifts } from "../../../api/bnms/index";

  export default {
    name: "shift2nurse",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      shifts: {
        type: Array,
        default: function () {
          return null;
        }
      }
    },
    data() {
      return {
        loading: false,
        checkedAll: false,
        curCheckedDeptIds: [],
        defaultProps: {
          label: "deptName"
        },
        oldCheckedDeptIds: [],
        allDepts_cache: [],
        allDepts: [],
        ruleForm: {
          shiftMainId: ""
        },
        orgInfo: {}
      };
    },
    created() {
      this.orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || [];
      this.getAllDept();
    },
    methods: {
      // 获取所有科室
      getAllDept() {
        this.loading = true;
        ApiDept.select().then(res => {
          this.loading = false;
          if(res.data) {
            this.allDepts = this.allDepts_cache = res.data.list || [];
          }else {
            this.allDepts = this.allDepts_cache = [];
          }
        });
      },
      // 获取已应用的科室
      handleChange(val) {
        this.loading = true;
        // 先还原
        this.allDepts = JSON.parse(JSON.stringify(this.allDepts_cache));
        Promise.all([this.getUsedDeptList(), this.getSelfUsedDept(val)])
          .then(res => {
            const other_dept = res[0].data || [];
            const self_dept = res[1].data || [];
            //禁用
            this.allDepts = this.disabledDept(this.allDepts, self_dept, other_dept);
            //
            this.oldCheckedDeptIds = self_dept;
            this.$nextTick(function () {
              this.$refs.tree.setCheckedKeys(self_dept);
            });
            this.loading = false;
          }).catch(res => {
          this.loading = false;
          this.$message.error(res.message);
        });
      },
      getSelfUsedDept(val) {
        return ApiShifts2Dept.select({ shiftMainId: val });
      },
      // 已有应用的科室
      getUsedDeptList() {
        return ApiShifts.deptList({ orgId: this.orgInfo.orgId });
      },
      disabledDept(depts, self_dept, other_dept) {
        for (let i = 0; i < depts.length; i++) {
          let _d = depts[i];
          if (other_dept.includes(_d['deptId']) && !self_dept.includes(_d['deptId'])) {
            this.$set(_d, 'disabled', true);
          }
          if (_d['children'] && _d['children'].length > 0) this.disabledDept(_d['children'], self_dept, other_dept);
        }
        return depts;
      },
      // 全选
      handleCheckAllChange(val) {
        if (val) {
          let arr = (this.curCheckedDeptIds = this.getNurseDataDeptId(this.allDepts));
          this.$refs.tree.setCheckedKeys(arr);
        } else {
          this.curCheckedDeptIds = [];
          this.$refs.tree.setCheckedKeys([]);
        }
      },
      // 格式化科室ids
      getNurseDataDeptId(data) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          if(!data[i].disabled) arr.push(data[i].deptId);
          if (data[i].children) {
            let a = this.getNurseDataDeptId(data[i].children);
            arr.push(...a);
          }
        }
        return arr;
      },
      handleNodeCheck() {
        this.curCheckedDeptIds = this.$refs.tree.getCheckedKeys();
      },
      submitForm() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            //取得未选中的
            let ban = [];
            this.oldCheckedDeptIds.forEach(v => {
              if (this.curCheckedDeptIds.indexOf(v) == -1) {
                ban.push(v);
              }
            });
            ApiShifts2Dept.apply({
              shiftMainId: this.ruleForm.shiftMainId,
              pickDeptIdList: this.curCheckedDeptIds.join(","),
              banDeptIdList: ban.join(",")
            })
              .then(() => {
                this.$message.success("应用成功！");
                this.resetCloseForm();
              })
              .catch(res => {
                this.$message.error(res.message);
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      //重置表单 & 关闭窗体
      resetCloseForm() {
        this.checkedAll = false;
        this.ruleForm.shiftMainId = '';
        this.$refs.tree.setCheckedKeys([]);
        this.allDepts = JSON.parse(JSON.stringify(this.allDepts_cache));
        this.$emit('update:visible', false);
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  /deep/ .el-dialog__body{
    text-align: center;
  }
  /deep/ .tree-container {
    max-width: 100%;
    display: inline-block;
    text-align: left;
  }
  /deep/ .el-tree-node__expand-icon {
    font-size: 16px;
    color: #2D2D2D;
  }

  /deep/ .el-tree-node__expand-icon.is-leaf {
    color: transparent;
  }
  /deep/ .el-tree-node__content {
    align-items: baseline;

    .el-tree-node__label{
      color: #5B5B5B
    }
    .el-tree-node__expand-icon:not(.is-leaf) ~ .el-tree-node__label{
      color: #2D2D2D;
    }
    .el-tree-node__label {
      height: auto;
    }
  }
</style>
