<!--
 * @Author: 范博
 * @Owner: 
 * @Date: 2022-05-13 14:29:10
 * @LastEditTime: 2022-07-19 09:09:40
 * @LastEditors: 范博
 * @Description: 
 * @FilePath: \yarward-wnms-frontEnd\src\views\wnms\accessControlExtension\editAceRoleAuth.vue
-->
<template>
  <el-container>
    <el-main>
      <el-form ref="editForm" :model="editForm" :rules="editRules">
        <el-form-item label="门禁角色名称" prop="name" label-width="180px">
          <el-input v-model="editForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="门禁权限" prop="checkDeptList" label-width="180px">
          <el-tree ref="deptTree" :default-checked-keys="editForm.checkDeptList" node-key="deptId" @check-change="handleCheck" :data="deptList" :props="defaultProps" show-checkbox :default-expand-all="true">
          </el-tree>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer style="text-align:center">
      <el-button @click="back()">取消</el-button>
      <el-button type="primary" @click="onSave()">保存</el-button>
    </el-footer>
  </el-container>

</template>

<script>
import { AddInfo, EditInfo, DetailUserRoleAuthInfo, ListEntranceGuardDeviceInfo } from '@/api/wnms/accessControlExtension/aceRole.js';
import internal from 'assert';
export default {
  name: "editAceRoleAuth",
  data () {
    var deviceTreeValidate = (rule, value, callback) => {
      let arr = this.$refs.deptTree.getCheckedKeys(); // 在此获取选中的树形数据
      if (arr.length == 0 || !arr) {
        callback(new Error("请选择门禁权限"));
      } else {
        callback();
      }
    };
    return {
      editType: 'add',
      editData: {},
      editForm: {
        id: "",
        name: "",
        checkDeptList: [],
      },
      deptList: [],
      defaultProps: {
        children: 'child',
        label: 'deptName'
      },
      editRules: {
        name: [{ required: true, message: '请输入门禁角色名称', trigger: 'blur' }, { min: 1, max: 10, message: '门禁角色名称长度在 1 到 10 个字符', trigger: 'blur' }],
        checkDeptList: [{ required: true, validator: deviceTreeValidate, trigger: 'change' }]
      },
    };
  },
  mounted () {

    this.editType = this.$route.query.type;
    this.initDeptTree();
    if (this.editType == 'edit') {
      this.editData = this.$route.query.data;
      this.queryInfo(this.editData);
    }
  },
  methods: {
    onSave () {
      this.$refs['editForm'].validate((v) => {
        if (v) {
          if (this.editType == 'add') {
            this.add();
          } else {
            this.update();
          }
        }
      });
    },
    initDeptTree () {
      ListEntranceGuardDeviceInfo({
        deviceType: 'wnEntranceGuard',
        disabled: '1'
      }).then(res => {
        if (res.status == 200) {
          this.$nextTick(() => {
            this.deptList = res.data;
          });
        }
      }).catch(err => {
      });
    },
    handleCheck (data, checkData) {
      this.editForm.checkDeptList = this.$refs.deptTree.getCheckedKeys();
    },
    add () {
      AddInfo({
        name: this.editForm.name,
        roleDesc: '',
        deviceIdList: this.editForm.checkDeptList,
      }).then(res => {
        if (res.status == 200) {
          this.$router.push('/aceRoleAuth');
        } else {
          this.$message(res.desc);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    update () {
      EditInfo({
        id: this.editForm.id,
        name: this.editForm.name,
        roleDesc: '',
        deviceIdList: this.editForm.checkDeptList,
      }).then(res => {
        if (res.status == 200) {
          this.$router.push('/aceRoleAuth');
        } else {
        }
      }).catch(err => {
      });
    },
    queryInfo (roleId) {
      DetailUserRoleAuthInfo(
        roleId,
      ).then(res => {
        if (res.status == 200) {
          this.editForm.id = res.data.id;
          this.editForm.name = res.data.name;
          this.editForm.checkDeptList = res.data.deviceIdList;
        } else {
        }
      }).catch(err => {
      });
    },
    back () {
      this.$router.push('/aceRoleAuth');
    }
  }
}
</script>

<style  scoped>

.config-row{
  width:80%;
  height: 80%;
  background: red;
}
</style>
