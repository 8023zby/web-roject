<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}用户</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form passport-user-modify">
        <el-form :rules="rules" ref="addFormData" class="from" label-width="130px" :model="addFormData">
          <el-form-item label="用户名：" prop="userName">
            <el-input v-uni=" actFormKey + 'yonghuming'" placeholder="请输入" v-model="addFormData.userName" :disabled="userFlag" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="userPassword">
            <el-input v-if="userFlag" placeholder="******" disabled="disabled"></el-input>
            <el-input v-else placeholder="默认123456" disabled="disabled"></el-input>
          </el-form-item>
          <!-- v-model="addFormData.userPassword" -->
          <el-form-item label="角色名称：" prop="roleIds">
            <el-select v-uni="actFormKey + 'juesemingcheng'" :disabled="isAdmin" :popper-append-to-body="false" v-model="addFormData.roleIds" multiple placeholder="请选择" clearable>
              <el-option v-for="item in roleData" :key="item.roleId" :label="item.name" :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="userStatus">
            <el-radio-group v-uni="actFormKey + 'zhuangtai'" :disabled="isAdmin" v-model="addFormData.userStatus">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="头像：">
            <!--上传图片组件-->
            <v-upload-image v-uni="actKey + 'upload'" :imageObj="imageObj" ref="imgDiv"></v-upload-image>
          </el-form-item>
          <el-form-item label="工号：" prop="empKey">
            <el-input v-uni="actFormKey + 'gonghao'" placeholder="请输入" v-model="addFormData.empKey" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="empName">
            <el-input v-uni="actFormKey + 'xingming'" placeholder="请输入" v-model="addFormData.empName" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-uni="actFormKey + 'xingbie'" v-model="addFormData.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phoneNum">
            <el-input v-uni="actFormKey + 'shoujihao'" v-model="addFormData.phoneNum" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="卡号：" prop="cordNum">
            <el-input v-uni="actFormKey + 'kahao'" placeholder="请输入" v-model="addFormData.cordNum" clearable></el-input>
            &emsp;<el-button v-uni="actFormKey + 'read'" type="primary" @click="readCard">读取</el-button><br /><span style="color:#f56c6c">先将卡放在读卡器上，然后点击读取</span>
          </el-form-item>
          <el-form-item label="部门：" prop="deptId" class="deptCls deptId-cls">
            <treeselect v-uni="actFormKey + 'bumen'" @input="checkDeptId" :disabled="isAdmin" placeholder="请选择" v-model="addFormData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptData" noChildrenText="无子节点" />
            <!--<zc-tree  v-model="addFormData.deptId" :nodeKey="nodeKey"  :Selecteds="addFormData.deptId" ref="tree" :options ="deptData" :props="props">
          </zc-tree>-->
          </el-form-item>
          <el-form-item label="存储数据范围：" prop="dataDeptIds" class="deptCls dept-cls">
            <div class="emptyAll" v-if="isAdmin">全部</div>
            <treeselect v-uni="actFormKey + 'cunchushujufanwei'" @input="checkDataDeptId" v-else :flat="true" placeholder="请选择" v-model="addFormData.dataDeptIds" noOptionsText="暂无数据" :multiple="true" noResultsText="无匹配数据" :options="deptData" valueConsistsOf="ALL" noChildrenText="无子节点" />
            <!--<zc-trees  v-model="addFormData.dataDeptIds" :nodeKey="nodeKey"  :Selecteds="addFormData.dataDeptIds" ref="trees" :options ="deptData" :props="propss">
              </zc-trees>-->
          </el-form-item>
          <el-form-item label="岗位：" prop="jobIds">
            <el-select v-uni="actFormKey + 'gangwei'" v-model="addFormData.jobIds" placeholder="请选择" clearable multiple>
              <el-option v-for="item in jobData" :key="item.jobId" :label="item.jobName" :value="item.jobId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称：" prop="empTitle">
            <el-input v-uni="actFormKey + 'zhiwu'" placeholder="请输入" v-model="addFormData.empTitle" clearable></el-input>
          </el-form-item>
          <el-form-item label="简介：">
            <el-input v-uni="actFormKey + 'jianjie'" placeholder="请输入" type="textarea" v-model="addFormData.intro" rows="15" maxlength="2000" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button v-if="params" v-uni="actKey + 'cancel'" @click="reloadUrl">取消</el-button>
      <el-button v-uni="actKey + 'cancel'" v-else @click="returnList">取消</el-button>
      <el-button v-uni="actKey + 'save'" v-if="params" type="primary" @click="onSubmit('addFormData', '')" :loading="addVis">保存</el-button>
      <el-button v-uni="actKey + 'save'" v-else type="primary" @click="onSubmit('addFormData','pims')" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import VueJsonp from "vue-jsonp";
import Vue from "vue";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import User from "../../../../assets/passport/mixins/User";
import vUploadImage from "../../../../components/passport/CropperUploadImg.vue";
import { AxiosApi } from "../../../../api/passport/http";
import { isvalidPhone } from "../../../../assets/passport/js/validate.js";
Vue.use(VueJsonp);
export default {
  props: ["params"],
  mixins: [User],
  components: {
    vUploadImage,
    Treeselect,
  },
  data() {
    // 验证手机号
    let validPhone = (rule, value, callback) => {
      if (value === "" || value === null) {
        callback();
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      isAdmin: false,
      ORG_TYPE: window.GLOBAL_CONFIG.ORG_TYPE || "",
      imageObj: {
        picRoute: "6",
        avatar: "avatar",
        widthSmall: "widthSmall",
        imgType: "oldman",
        imageBase64: "",
        imageUrl: "",
        fileSize: true,
        fromWhere: "apply",
        isCut: "yes",
      },
      Selecteds: [],
      roleData: [],
      deptData: [],
      jobData: [],
      jobObj: {},
      titMsg: "添加",
      addFormData: {
        isOrgAdmin: false,
        userName: null,
        roleId: null,
        userPassword: 123456,
        userStatus: 1,
        roleIds: [],
        // 员工信息
        empId: null,
        empKey: null,
        empName: null,
        sex: 2,
        userTelephone: null,
        phoneNum: null,
        cordNum: null,
        jobIds: [],
        empTitle: null,
        intro: null,
        deptId: null,
        dataDeptIds: [],
      },
      userFlag: false,
      modelName: "用户",
      url: "/passport/web-rbac/users",
      rules_pims: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[0-9A-Za-z]{6,20}$/,
            message: "用户名由字母或者数字组成，且长度为6-20位！ ",
            trigger: "blur",
          },
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validPhone, trigger: "blur" },
        ],
      },
      rules_his: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名长度为2-20位！ ",
            trigger: "blur",
          },
        ],
        phoneNum: [{ validator: validPhone, trigger: "blur" }],
        empKey: [{ required: true, message: "请填写工号", trigger: "blur" }],
        jobIds: [{ required: true, message: "请选择岗位", trigger: "change" }],
      },
      rules_common: {
        userPassword: [{ required: true }],
        roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
        userStatus: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
        empName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "姓名的长度不能超过20个字符！",
            trigger: "blur",
          },
        ],
        empKey: [
          {
            min: 0,
            max: 50,
            message: "工号长度不能超过50个字符",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        deptId: [{ required: true, message: "请选择部门" }],
        dataDeptIds: [{ required: true, message: "请选择数据存储范围" }],
      },
      rules: {
        empTitle: [
          {
            min: 0,
            max: 20,
            message: "职称长度不能超过20个字符！",
            trigger: "blur",
          },
        ],
        cordNum: [
          {
            min: 0,
            max: 20,
            message: "卡号长度不可超过20个字符",
            trigger: "blur",
          },
        ],
      },
      oldDepts: {
        deptId: "",
        dataDeptIds: "",
      },
      actFormKey: "yonghuzhanghaotianjia__",
      actKey: "yonghuzhanghaotianjia_",
    };
  },
  created() {
    this.addFormData.userId = this.params ? this.params.id || "" : "";
    if (this.addFormData.userId) {
      this.actFormKey = "yonghuzhanghaobianji__";
      this.actKey = "yonghuzhanghaobianji_";
      this.titMsg = "编辑";
      this.userFlag = "disabled";
      this.detail(this.addFormData.userId);
    }
    /* 获取角色信息 */
    this.getRoleList();
    /* 获取岗位信息 */
    this.getPostList();
    /* 获取部门信息 */
    this.getDeptList();
    if (this.ORG_TYPE === 3 || this.ORG_TYPE === 1) {
      this.rules = { ...this.rules, ...this.rules_pims, ...this.rules_common };
      if (this.addFormData.userId) {
        this.rules["userName"] = [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ];
      }
    } else {
      this.rules = { ...this.rules, ...this.rules_his, ...this.rules_common };
      if (this.addFormData.userId) {
        this.rules["userName"] = [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ];
      }
    }
  },
  methods: {
    // 检测部门是否有值
    checkDeptId() {
      this.$nextTick(() => {
        let dom = document.querySelector(".deptId-cls .el-form-item__error");
        if (this.addFormData.deptId !== null && this.addFormData.deptId) {
          if (dom) {
            dom.style.display = "none";
          }
        } else {
          if (dom) {
            dom.style.display = "block";
          }
          this.addFormData.deptId = null;
          this.$refs.addFormData.validateField("deptId");
        }
      });
    },
    // 检测部门是否有值
    checkDataDeptId() {
      this.$nextTick(() => {
        let dom = document.querySelector(".dept-cls .el-form-item__error");
        if (
          this.addFormData.dataDeptIds !== null &&
          this.addFormData.dataDeptIds &&
          this.addFormData.dataDeptIds.length > 0
        ) {
          if (dom) {
            dom.style.display = "none";
          }
        } else {
          if (dom) {
            dom.style.display = "block";
          }
          this.addFormData.dataDeptIds = [];
          this.$refs.addFormData.validateField("dataDeptIds");
        }
      });
    },
    // 超级管理员设置
    initAdmin() {
      this.oldDepts.deptId = this.addFormData.deptId;
      this.oldDepts.dataDeptIds = this.addFormData.dataDeptIds;
      this.isAdmin = true;
      this.addFormData.sex = 1;
      this.addFormData.dataDeptIds = ["all"];
    },
    // 读卡
    readCard() {
      this.$jsonp("http://127.0.0.1:3586/readcode", {
        callbackName: "successCallback",
      })
        .then((res) => {
          this.addFormData.cordNum = res.Result.replace(/\s/g, "");
        })
        .catch(() => {
          this.$confirm(
            `读卡服务异常，请确定读卡器服务已经开启,如果未下载读卡器服务启动包，请点击确定下载！`,
            "提示",
            {
              confirmButtonText: "确 认",
              cancelButtonText: "取消",
              showClose: false,
              type: "warning",
            }
          ).then(() => {
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = "/static/passport/readCard.zip";
            link.setAttribute("download", "读卡服务器.zip");
            document.body.appendChild(link);
            link.click();
          });
        });
    },
    // 返回列表
    returnList() {
      this.$router.push("/user");
    },
    // 查询角色
    getRoleList() {
      AxiosApi("/passport/web-rbac/roles", {}, "GET", {
        page: 1,
        size: 999,
      }).then((res) => {
        if (res.status === 200) {
          let data = res.data.list || [];
          this.roleData = data;
        }
      });
    },
    // 查询岗位
    getPostList() {
      AxiosApi("/ifms/web-org/job", {}, "GET", { page: 1, size: 999 }).then(
        (res) => {
          if (res.status === 200) {
            let data = res.data.list || [];
            this.jobData = data;
            data.forEach((item) => {
              this.jobObj[item.jobId] = item.jobTypeCode;
            });
          }
        }
      );
    },
    // 查询部门
    getDeptList() {
      AxiosApi("/ifms/web-org/depts", {}, "GET").then((res) => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list);
          temp = temp
            .replace(/deptId/g, "id")
            .replace(/deptName/g, "label")
            .replace(/,"children":null/g, "")
            .replace(/,"children":\[\]/g, "");
          this.deptData = JSON.parse(temp);
        }
      });
    },
    onSubmit(addFormData, act = "") {
      this.$refs[addFormData].validate((valid) => {
        if (valid) {
          let temp = [];
          if (this.addFormData.jobIds !== null) {
            this.addFormData.jobIds.forEach((item) => {
              temp.push(this.jobObj[item]);
            });
            this.addFormData.jobTypeCodes = temp;
          }
          this.addFormData.userTelephone = this.addFormData.phoneNum;
          this.addFormData.jobTypeCodes = temp;
          this.addFormData.workingPicture = this.$refs.imgDiv.imageObj.imageUrl;
          this.addFormData.empId = this.addFormData.userId;
          // 为了可以过必选项验证
          if (this.isAdmin) {
            this.addFormData.deptId = this.oldDepts.deptId;
            this.addFormData.dataDeptIds = this.oldDepts.dataDeptIds;
          }
          // 卡号去空格
          if (this.addFormData.cordNum !== null) {
            this.addFormData.cordNum = this.addFormData.cordNum.replace(
              /\s/g,
              ""
            );
          }
          let addData = { ...this.addFormData };
          if (addData.deptId !== null) {
            addData.deptId = addData.deptId.toString();
          }
          if (this.addFormData.userId !== "") {
            this.edit(addData);
            this.refreshCache();
          } else {
            // 首先添加员工信息再添加基本信息
            this.add(addData, {}, act);
            this.refreshCache();
          }
        }
      });
    },
    // 更新本地数据范围缓存
    refreshCache() {
      AxiosApi("/passport/web-rbac/logins/getDataDeptInfoList", {}, "GET").then(
        (res) => {
          if (res.status === 200) {
            localStorage.setItem("dataDeptInfoList", JSON.stringify(res.data));
          }
        }
      );
    },
  },
};
</script>
<style scoped lang="scss">
.emptyAll {
  color: #606266;
  line-height: 32px;
}
</style>
<style lang="scss" scoped>
.passport-user-smallInput {
  width: 230px !important;
  .el-input__inner {
    width: 230px !important;
  }
}
.passport-user-modify {
  .el-textarea__inner {
    padding-bottom: 28px;
  }
  .el-input__count {
    text-align: right;
    left: 1px;
    right: 1px;
    bottom: 1px;
    padding: 7px 5px;
    font-size: 12px;
    line-height: normal;
  }
}
</style>
