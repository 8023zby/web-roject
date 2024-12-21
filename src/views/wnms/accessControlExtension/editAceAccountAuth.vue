<!--
 * @Author: 范博
 * @Owner: 
 * @Date: 2022-05-17 15:00:37
 * @LastEditTime: 2022-08-25 18:57:05
 * @LastEditors: 范博
 * @Description: 
 * @FilePath: \yarward-wnms-frontEnd\src\views\wnms\accessControlExtension\editAceAccountAuth.vue
-->

<template>
  <el-container>
    <el-main>
      <el-form ref="editForm" :model="editForm" :rules="editRules">
        <template v-if="!isBatchMode">
          <el-form-item label="部门：" label-width="180px">
            {{editForm.deptName}}
          </el-form-item>
          <el-form-item label="用户名：" label-width="180px">
            {{editForm.userName}}
          </el-form-item>
          <el-form-item label="姓名：" label-width="180px">
            {{editForm.empName}}
          </el-form-item>
          <el-form-item label="状态：" label-width="180px">
            <el-radio-group v-model="editForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item label="门禁权限" label-width="180px">
          <el-select v-model="userRoleId" @change="selectUserRoleAuth">
            <el-option value="" label="无数据"></el-option>
            <el-option v-for="item in userRoleAuthList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="180px" prop="checkDeptList">
          <div>
            <el-checkbox @change="checkAllNodes" v-model="checkAll">全部</el-checkbox>
          </div>
          <div>
            <el-tree ref="deptTree" :check-strictly="checkStrictly" :default-checked-keys="checkDeptList" node-key="deptId" @check-change="handleCheck" :data="deptList" :props="defaultProps" show-checkbox :default-expand-all="true">
            </el-tree>
          </div>
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

import { selectDeptInfo, getUser } from '@/assets/wnms/utils/common';
import { ListInfo, DetailUserRoleAuthInfo, ListEntranceGuardDeviceInfo } from '@/api/wnms/accessControlExtension/aceRole.js';
import { EditInfo, BatchEditInfo, DetailInfo } from '@/api/wnms/accessControlExtension/aceAccounAuth.js';
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
      checkStrictly: false,
      checkAll: false,
      isBatchMode: false,
      editType: 'singelEdit',
      editData: {},
      editCheckDeptList: [],
      checkDeptList: [],
      editForm: {
        id: "",
        userId: '',
        deptName: '',
        userName: '',
        empName: '',
        status: '',
      },
      userRoleId: '',
      userRoleAuthList: [],
      editAccountList: [],
      deptList: [],
      defaultProps: {
        children: 'child',
        label: 'deptName'
      },
      editRules: {
        // checkDeptList: [{ validator: deviceTreeValidate, trigger: 'change' }]
      },
      testDevice: [
        "03bb17da97c84ab695e23944d3c37fd2",
        "2d1b6640c4224da6882aabfd9962dfd6",
        //"4adf587c32bc4799a0ad0954d9805aca",
        "695c23a3ee964b05b40d6909fcf65908",
        "6becabb001814cc3a31d62e31bef0c69",
        "776067fb9e6c402faed75e767086a663",
        "8106dddee2a14cadb28366fa0e693e81",
        "8a2068a06eae42ba8f03f4103197aa36",
        "8e6cdfb41e7f498ea4f751292d22da2f",
        "9375a26abd6c47b494430f2c4062b8a6",
        "9aa974f78d4b49788cd539f3f6792c02",
        "9c2ec82e844e4087abf93f542bc34712",
        "a9063a75b1ce41ac9562b26a3d5f4120",
        "abaca79b12a34d6e8ec9b3bb5a99432b",
        "afc557b2e9f64d5084d91d3489bde869",
        "b5887d98518845f5abe21d8c49dbf774",
        "b76778010b4c48ab96edebf534f881ee",
        "c46baf48e2b44d82bdf3583609ccaf6c",
        "d3bb9e00a0024605a84177eae0e01c72",
        "dc285dc919d849988f97c0de45b36e59",
        "e929b4026ab245289bbde3a6f427e54c",
        "ed50d37ab43c4b929371c4012e953d97",
        "fe634244a457425aa679303397d40993",
        "fef855a57081402ea5daaff71335394f"
      ]
    };
  },
  mounted () {
    this.editType = this.$route.params.type;
    this.initDeptDevTree();
    this.queryUserRoleAuthList();
    if (this.editType == 'singelEdit') {
      this.isBatchMode = false;
      this.editForm.id = this.$route.params.data;
      this.queryInfo(this.editForm.id);
    }
    else {
      this.isBatchMode = true;
      this.editAccountList = this.$route.params.data;
      console.log(this.editAccountList);
    }
  },
  methods: {
    checkAllNodes () {
      console.log(this.checkAll);
      if (this.checkAll) {
        this.$refs.deptTree.setCheckedNodes(this.deptList);
      } else {
        this.$refs.deptTree.setCheckedKeys([]);
      }
    },
    onSave () {
      this.$refs['editForm'].validate((v) => {
        if (v) {
          this.update();
        }
      });
    },
    initDeptDevTree () {
      ListEntranceGuardDeviceInfo({
        deviceType: 'wnEntranceGuard'
      }).then(res => {
        if (res.status == 200) {
          this.$nextTick(() => {
            this.deptList = res.data || [];
          });
        }
      }).catch(err => {
      });
    },
    handleCheck (data, checkData) {
      this.checkDeptList = this.$refs.deptTree.getCheckedKeys();
    },
    selectUserRoleAuth () {
      this.$refs.deptTree.setCheckedKeys([]);
      if (this.userRoleId == '') {
        let editArrDept = JSON.parse(JSON.stringify(this.editCheckDeptList));
        this.$refs.deptTree.setCheckedKeys(editArrDept);
        return;
      }
      DetailUserRoleAuthInfo(this.userRoleId).then(res => {
        if (res.status == 200) {
          let allCheckDepts = [...this.checkDeptList, ...res.data.deviceIdList];
          let set = new Set(allCheckDepts);
          this.checkDeptList = Array.from(set);
        } else {
          this.$message(res.desc);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getAccountIdToArray () {
      let accountArr = [];
      this.editAccountList.forEach(item => {
        accountArr.push(item.id);
      });
      return accountArr;
    },
    update () {
      // this.checkDeptList.forEach(chkDeptItem=>{
      //   this.deptList.forEach(deptItem=>{
      //     // if(chkDeptItem == deptItem.)
      //   })
      // })
      if (this.editType == 'singelEdit') {
        EditInfo({
          userId: this.editForm.id,
          status: this.editForm.status,
          deviceIdList: this.checkDeptList,
        }).then(res => {
          if (res.status == 200) {
            this.$router.push('/aceAccountAuth');
          } else {
            this.$message(res.desc);
          }
        }).catch(err => {
        });
      } else {
        BatchEditInfo({
          userIdList: this.getAccountIdToArray(),
          status: this.editForm.status,
          deviceIdList: this.checkDeptList,
        }).then(res => {
          if (res.status == 200) {
            this.$router.push('/aceAccountAuth');
          } else {
            this.$message(res.desc);
          }
        }).catch(err => {
        });
      }
    },
    queryInfo (roleId) {
      DetailInfo(roleId).then(res => {
        if (res.status == 200) {
          console.log(res);
          this.editForm.deptName = res.data.deptName;
          this.editForm.userName = res.data.userName;
          this.editForm.empName = res.data.empName;
          this.editForm.status = res.data.status;
          this.userRoleId = res.data.entranceGuardRoleId;
          this.checkDeptList = this.editCheckDeptList = res.data.deviceIdList || [];
          // this.editCheckDeptList = res.data.deviceIdList || [];

          console.log(selectDeptInfo());
        } else {
        }
      }).catch(err => {
      });
    },
    queryUserRoleAuthList () {
      ListInfo({
        size: 9999,
        page: 1
      }).then(res => {
        this.userRoleAuthList = res.data.list;
      }).catch(err => {
      });
    },
    back () {
      this.$router.push('/aceAccountAuth');
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
