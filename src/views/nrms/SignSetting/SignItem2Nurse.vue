<template>
  <el-dialog
    title="应用"
    :visible="visible"
    :close-on-click-modal="false"
    width="250px"
    @close="resetCloseForm"
  >
    <el-checkbox
      v-model="checkedAll"
      @change="handleCheckAllChange"
    >全选/取消全选
    </el-checkbox>
    <!--<div style="margin: 15px 0;"></div>-->
    <!--<el-checkbox-group v-model="checked" @change="handleCheckedChange">-->
    <!--<div v-for="item in nurse_data" :key="item.deptId">-->
    <!--<el-checkbox :label="item.deptId" :value="item.deptId"-->
    <!--&gt;{{ item.deptName }}-->
    <!--</el-checkbox>-->
    <!--</div>-->
    <!--</el-checkbox-group>-->
    <el-tree
      ref="tree"
      node-key="deptId"
      show-checkbox
      default-expand-all
      :expand-on-click-node="false"
      :default-checked-keys="deptIds"
      check-on-click-node
      check-strictly
      :data="nurse_data"
      :props="defaultProps"
      @check="handleNodeCheck"
    ></el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm()" size="small"
      >保存
      </el-button
      >
      <el-button @click="resetCloseForm()" size="small">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { ApiSignItem2Nurse } from "../../../api/nrms/index";

  export default {
    name: "item2nurse",
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
      sign_ids: {
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
          label: 'deptName'
        }
      };
    },
    methods: {
      handleCheckAllChange(val) {
        if (val) {
          let arr = this.deptIds = this.getNurseDataDeptId(this.nurse_data);
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
            arr.push(...a)
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
        if (this.sign_ids.length > 1) {
          http = ApiSignItem2Nurse.multi({
            signId: this.sign_ids.join(","),
            deptId: this.deptIds.join(",")
          });
        }
        //单个应用
        else {
          //取得未选中的
          let ban = [];
          this.init_checked.forEach(v => {
            if (this.deptIds.indexOf(v) == -1) {
              ban.push(v);
            }
          });
          http = ApiSignItem2Nurse.one({
            signId: this.sign_ids[0],
            deptId: this.deptIds.join(","),
            // banDeptIdList: ban.join(",")
          });
        }
        http
          .then(() => {
            this.$message.success("应用成功！");
            this.resetCloseForm();
          })
          .catch(res => {
            this.$message.error(res.message);
          });
      },
      //重置表单 & 关闭窗体
      resetCloseForm() {
        this.checkedAll = false;
        this.$parent.item2nurse_visible = false;
      }
    },
    watch: {
      init_checked(data) {
        data = data || [];
        this.deptIds = data;
        this.$nextTick(function () {
          this.$refs.tree.setCheckedKeys(data);
        })
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped></style>
