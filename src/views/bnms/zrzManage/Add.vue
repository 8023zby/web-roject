<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo" />
      <div class="typt-tit-content">{{ titMsg }}分组</div>
    </div>
    <div v-loading="loading" class="typt-add-container">
      <div class="typt-add-form" style="width: 85%; padding-top: 40px">
        <el-form ref="addForm" :model="addFormData" :rules="rules" label-width="130px" label-suffix=":">
          <el-form-item :label="'组名'" prop="groupName">
            <el-input v-model.trim="addFormData.groupName" style="width: 300px" placeholder="请输入" />
          </el-form-item>
          <el-form-item :label="'部门'" prop="deptId">
            <treeselect v-model="addFormData.deptId" placeholder="请选择" :multiple="false" :options="params.deptData" noOptionsText="无可选项" noChildrenText="无子节点" noResultsText="无匹配结果" @select="getUser" :z-index="999999" />
          </el-form-item>
          <el-form-item :label="'组员姓名'" prop="accountId">
            <el-select v-model="addFormData.accountId" style="width: 300px" filterable multiple placeholder="请选择" @visible-change="upcheck">
              <el-option v-for="(item, index) in userData" :key="index" :label="`${item.empName}(${item.userName})`" :value="item.empId" />
            </el-select>
          </el-form-item>

          <el-form-item label="责任床位">
            <bed-list :src-data="bedListData" :disabled-bed="disabledBed" :check-data="checkData" @getBedOrRoomVal="setBedOrRoomVal" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="reloadUrl" v-uni="'zerenzuguanliliebiao_cancel'">取消</el-button>
      <el-button type="primary" :loading="addVis" @click="saveData" v-uni="'zerenzuguanliliebiao_save'">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseManage from "../../../assets/bnms/mixins/BaseManage";
import BedList from "../../../components/bnms/BedList";
import { GetNurseUserLeader, GetBed } from "../../../api/bnms";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ZrzAdd",
  components: {
    "bed-list": BedList,
    Treeselect,
  },
  mixins: [BaseManage],
  props: ["modifyData", "params"],
  data() {
    var checkMark = (rule, value, callback) => {
      if (!this.checkSpecificKey(value)) {
        callback(new Error("不能输入特殊字符，请重新输入！"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      modelName: "分组",
      titMsg: "添加",
      url: "/wnms/web-wn/responsibilityGroup",
      actFlag: "add",
      bedListData: [],
      userData: [],
      checkData: [],
      disabledBed: "",
      addFormData: {
        deptId: null,
        groupName: "",
        accountId: [],
        bedIdList: [],
      },
      rules: {
        accountId: [
          { required: true, message: `请选择组员账号！`, trigger: "change" },
        ],
        deptId: [
          { required: true, message: `请选择部门！`, trigger: "change" },
        ],
        groupName: [
          { required: true, message: `请填写组名！`, trigger: "blur" },
          { validator: checkMark, trigger: "blur" },
          { min: 0, max: 20, message: "长度不能多于20个字符", trigger: "blur" },
        ],
      },
    };
  },
  // 初始化数据
  created() {
    const obj = this.modifyData;
    const key = obj["id"] || "";

    if (key) {
      this.addFormData.deptId = obj.id;
      this.initDetails(key);
    }
  },
  methods: {
    checkSpecificKey(str) {
      var specialKey =
        "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？-]‘'";
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
          return false;
        }
      }
      return true;
    },
    upcheck(flag) {
      // 当下拉出现的时候，手动触发部门的校验
      if (flag) {
        this.$refs["addForm"].validateField("deptId");
      }
    },
    async initDetails(id) {
      this.loading = true;
      this.actFlag = "modify";
      this.titMsg = "编辑";

      await this.detail(id);

      await this.getUser("");

      this.addFormData.accountId = this.addFormData.userIdList;

      await this.getBed();

      if (this.addFormData.bedIdList) {
        for (const one of this.addFormData.bedIdList) {
          this.checkData.push({
            objId: one,
          });
        }
      }

      this.initDisabledBed();
    },
    // 初始化不能选择的床位
    initDisabledBed() {
      let str = ",";
      if (this.addFormData.bedIdNoDelete) {
        this.addFormData.bedIdNoDelete.forEach((item) => {
          str += item + ",";
        });
      }

      this.disabledBed = str;
      this.loading = false;
    },
    // 放数据
    setBedOrRoomVal(item) {
      let str = "";
      item.forEach((val) => {
        str += val.objId + ",";
      });
      this.addFormData.bedIdList = str.substr(0, str.length - 1).split(",");
    },
    saveData() {
      // 保存数据
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          const saveData = { ...this.addFormData };
          saveData.userIdList = saveData.accountId;
          delete saveData["accountId"];

          if (this.actFlag === "add") {
            this.add(saveData);
          } else {
            const _temp = {
              id: saveData.id,
              userIdList: saveData.userIdList,
              bedIdList: saveData.bedIdList == null ? [] : saveData.bedIdList,
              groupName: saveData.groupName,
              deptId: saveData.deptId,
            };
            this.edit(_temp);
          }
        }
      });
    },
    getUser(node) {
      // 获取用户
      if (node) {
        this.addFormData.deptId = node.id;
        this.addFormData.bedIdList = [];
        this.checkData = [];
      }

      this.getBed();

      this.addFormData.accountId = [];

      const jobTypeCodes = "nurseHead,nurseTeamLeader,nurse,groupType";
      let searchType = true;
      let dataDeptIds = this.addFormData.deptId;
      GetNurseUserLeader.getNames(
        this.addFormData.deptId,
        jobTypeCodes,
        dataDeptIds,
        searchType
      ).then((res) => {
        this.userData = res.data;
      });
    },
    async getBed() {
      // 获取床位
      await GetBed.getBed(this.addFormData.deptId).then((res) => {
        this.bedListData = [];
        res.data.list.forEach((item, index) => {
          this.bedListData.push({
            objId: item.bedId,
            objName: item.bedName,
            sort: item.sort,
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.smallInput {
  width: 150px;
}

.iconAddCls {
  font-size: 24px;
  color: #409eff;
  cursor: pointer;
  margin-left: 10px;
  vertical-align: middle;
}

.iconDelCls {
  font-size: 24px;
  color: #f56c6c;
  cursor: pointer;
  margin-left: 10px;
  vertical-align: middle;
}

/deep/ .el-input--small .el-input__inner {
  height: 34px;
}
</style>
