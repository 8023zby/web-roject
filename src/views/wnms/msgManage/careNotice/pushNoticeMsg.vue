<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo" />
      <div class="typt-tit-content">医护公告</div>
    </div>

    <el-main>
      <el-form ref="formData" :model="formData" :rules="rules">
        <el-form-item prop="pushContent" label-width="180px" label="公告内容：">
          <el-input v-model="formData.pushContent" type="textarea" :rows="6" maxlength="200" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item prop="isbnNursingTVRevice" label-width="180px" label="显示在信息看板：">
          <el-radio-group v-model="formData.isbnNursingTVRevice">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="checkRecvDepts" label-width="180px" label="接收护理单元：">
          <treeSelect @select="selectDeptsEvent" @deselect="deSelectDeptEvent" :clearable=isClear :multiple="true" :options="deptsList" :normalizer="normalizer" :flat="true" :sort-value-by="sortValueBy" :default-expand-level="2" placeholder="请选择护理单元" v-model="formData.checkRecvDepts" />
        </el-form-item>
        <el-form-item label="接收人：" prop="recvPersons" label-width="180px">
          <div v-for="item in dislpayRecvDeptsInfo">
            {{item.deptName}}：
            <el-button type="primary" @click="checkAllPerson(item.deptId)">全选</el-button>
            <el-button type="primary" @click="unCheckAllPerson(item.deptId)">反选</el-button>
            <el-checkbox-group @change="selectPersonEvent" v-if="item.checkInfo" v-model="checkedPersons">
              <el-checkbox v-for="person in item.persons" :label="person.empId" :value="person.empId" :key="person.empId">{{person.empName}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label-width="180px" label="推送时间：" prop="pushDate">
          <el-radio-group v-model="formData.pushModel" @change="onChangePushModel">
            <el-radio :label="0">立即推送</el-radio>
            <el-radio :label="1">定时推送</el-radio>
          </el-radio-group>
          <el-date-picker :disabled="formData.pushModel==0? true:false" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.pushDate" style="margin-left: 40px"></el-date-picker>
        </el-form-item>
      </el-form>
    </el-main>
    <div class="typt-add-footer">
      <el-button @click="goBack()">取消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import treeSelect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { getDeptInfo, selectDeptInfo, getUser } from '@/assets/wnms/utils/common';
import BaseQueryPageForm from '@/views/wnms/common/BaseQueryPageForm';
import {
  getAppPersonsByDeptId,
  getDeptsList,
  pushMsgApi,
  editMsgApi,
  getUsersByDept,
  getMsgInfoByMessageID
} from '@/api/wnms/msgManage/patientMsg';
// import {getdepts} from '@/api/wnms/msgManage/systemConfig'


export default {
  name: "pushMessage",
  mixins: [BaseQueryPageForm],
  components: { treeSelect },
  data () {
    return {
      search: {
        size: 99999,
        page: 1
      },
      deptsList: [],
      editRecvDeptList: [],
      formData: {
        pushContent: "",
        isbnNursingTVRevice: 0,
        checkRecvDepts: [],
        checkRecvPersons: [],
        pushModel: 0,
        pushDate: ''
      },
      rules: {
        pushContent: [{ required: true, message: '请输入推送内容', trigger: 'blur' },
        { max: 200, message: "推送内容不能超过200个字符" }],
        recvDeptVal: [{ required: true, message: '请选择护理单元', trigger: 'blur' }],
        checkRecvDepts: [{ type: 'array', required: true, message: '请选择护理单元', trigger: 'change' }],
        pushDate: [{ required: true, message: '请选择推送日期', trigger: 'blur' }]
      },
      gDeptId: '',
      gOrgId: '',
      dislpayRecvDeptsInfo: [],
      gType: 'add',
      gEditEmpUser: [],
      disabled: {
        type: Boolean,
        default: false
      },
      checkedPersons: [],
      isClear: false,
      sortValueBy: "ORDER_SELECTED"

    };
  },
  created () {
    this.gType = this.$route.query.type;
    this.gDeptId = selectDeptInfo();
    this.gOrgId = getDeptInfo().orgId;
    this.initPushDate();
  },
  mounted () {
    this.initDepts();
  },
  watch: {
    formData: {
      handler (val, oldVal) {
      },
      deep: true
    }
  },
  methods: {
    onChangePushModel (val) {
      if (val) {
        this.formData.pushDate = moment().add(5, 'm').format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.formData.pushDate = moment().format('YYYY-MM-DD HH:mm:ss')
      }
    },
    goBack () {
      this.$router.go(-1);
    },
    getCurrentDate () {
      var currentDate = new Date();
      var year = currentDate.getFullYear().toString();
      var month = (currentDate.getMonth() + 1).toString();
      var date = currentDate.getDate().toString();
      var hour = currentDate.getHours().toString();
      var minute = currentDate.getMinutes().toString();
      var second = currentDate.getSeconds().toString();
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    },
    getNoticeMsgInfo (msgId) {
      getMsgInfoByMessageID(msgId).then(res => {
        if (res.status == 200) {
          let dataInfo = res.data;
          this.formData.checkRecvDepts = dataInfo.deptIdList;
          this.editRecvDeptList = dataInfo.deptDoList;
          this.formData.pushContent = dataInfo.content;
          this.formData.isbnNursingTVRevice = dataInfo.isbnNursingTVRevice;
          this.formData.pushModel = dataInfo.pushType;
          if (dataInfo.pushType == 1) {
            this.formData.pushDate = dataInfo.pushTime;
          }


          this.gEditEmpUser = [];
          dataInfo.empUser.forEach(item => {
            this.gEditEmpUser.push(item.empId);
          });

          console.log(this.gEditEmpUser);
          this.loadRecvPerson(dataInfo.empUser == null ? [] : this.gEditEmpUser);
          // console.log(dataInfo)
        }
      }).catch(err => {
      });
    },
    save () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          let checkedEmpUser = [];
          let newEmpUsers = this.megerDeptsInfo(this.checkedPersons, this.dislpayRecvDeptsInfo);

          if (this.formData.isbnNursingTVRevice == 0) {
            if (newEmpUsers.length == 0) {
              this.$message("请配置接收人或信息看板");
              return;
            }
          }

          let para =
          {
            "empUser": newEmpUsers,
            "content": this.formData.pushContent,
            "deptIdList": this.formData.checkRecvDepts,
            "isGenerateAudio": 0,
            "msgResource": "MANUAL-NOTICE",
            "orgId": this.gOrgId,
            "pushType": this.formData.pushModel,
            "pushTime": this.formData.pushModel == 0 ? this.getCurrentDate() : this.formData.pushDate,
            "receiveDevice": `${newEmpUsers && newEmpUsers.length ? 'USER' : ''}${newEmpUsers && newEmpUsers.length && this.formData.isbnNursingTVRevice == 1 ? ',' : ''}${this.formData.isbnNursingTVRevice == 1 ? "bnNursingTV" : ""}`, //bnNursingTV
          };

          console.log(JSON.stringify(para));
          if (this.gType == 'edit') {
            para.messageId = this.$route.query.para.messageId;
            editMsgApi(para).then(res => {
              if (res.status == 200) {
                this.$confirm('消息已推送', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  center: true,
                  type: 'success',
                  showClose: false
                }).then(() => {
                  this.$router.go(-1);
                });
              }
              else {
                this.$message("消息推送失败！");
              }
            }).catch(err => {
              console.log(err);
            });
          }
          else {
            pushMsgApi(para).then(res => {
              if (res.status == 200) {
                this.$confirm('消息已推送', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  center: true,
                  type: 'success',
                  showClose: false
                }).then(() => {
                  this.$router.go(-1);
                });
              }
              else {
                this.$message("消息推送失败！");
              }
            }).catch(err => {
              console.log(err);
            });
          }
        }
      });
    },

    megerDeptsInfo (editInfo, allInfo) {
      let newArr = [];
      allInfo.forEach(allItem => {
        let persons = allItem.persons;
        editInfo.forEach(editItem => {
          for (let i = 0; i < persons.length; i++) {
            if (persons[i].empId == editItem) {
              newArr.push({
                empId: persons[i].empId,
                empName: persons[i].empName,
                deptId: persons[i].deptId
              });
            }
          }
        });
      });
      return newArr;
    },
    initDepts () {
      getDeptsList().then(res => {
        if (res.status == 200) {
          this.$nextTick(() => {
            this.deptsList = res.data.list;
          });
          if (this.gType == 'edit') {
            this.getNoticeMsgInfo(this.$route.query.para.messageId);
          }
        }
      }).catch(err => {
      }).finally(() => {
      });
    },
    loadPersonBySingleDept (mdeptName, mdeptId) {
      let deptId = mdeptId;
      let deptName = mdeptName; //this.findDeptName(deptId)
      let deptObj = {
        deptId: deptId,
        deptName: deptName
      };

      let params = this.createQueryParams();
      params.deptId = deptId;
      getAppPersonsByDeptId(deptId).then(res => {
        if (res.status == 200) {
          deptObj.persons = res.data;
          deptObj.checkInfo = [];
          this.dislpayRecvDeptsInfo.push(deptObj);
          console.log(JSON.stringify(this.dislpayRecvDeptsInfo));
        }
      }).catch(err => {
      });
    },
    loadRecvPerson (editPerson = []) {
      this.checkedPersons = editPerson;
      this.dislpayRecvDeptsInfo = [];
      for (let i = 0; i < this.formData.checkRecvDepts.length; i++) {
        let deptId = this.formData.checkRecvDepts[i];
        let deptName = this.findDeptName(deptId);
        let deptObj = {
          deptId: deptId,
          deptName: deptName
        };

        let params = this.createQueryParams();
        params.deptId = deptId;
        getAppPersonsByDeptId(deptId).then(res => {
          if (res.status == 200) {
            deptObj.persons = res.data;
            deptObj.checkInfo = this.gType == 'edit' ? editPerson : [];
            this.dislpayRecvDeptsInfo.push(deptObj);
          }
        }).catch(err => {
        });
      }
    },
    selectDeptsEvent (val) {
      this.loadPersonBySingleDept(val.deptName, val.deptId);
    },
    deSelectDeptEvent (val) {
      this.dislpayRecvDeptsInfo.splice(
        this.dislpayRecvDeptsInfo.findIndex(item => item.deptId === val.deptId), 1);
    },
    selectPersonEvent (val) {
      console.log(this.checkedPersons);
    },

    checkAllPerson (val) {
      this.dislpayRecvDeptsInfo.forEach(item => {
        if (item.deptId == val) {
          item.persons.forEach(person => {
            if (!this.checkedPersons.includes(person.empId)) {
              this.checkedPersons.push(person.empId);
            }
          });
        }
      });
    },
    unCheckAllPerson (val) {
      this.dislpayRecvDeptsInfo.forEach(item => {
        if (item.deptId == val) {
          item.persons.forEach(person => {
            console.log(person.empName);
            if (this.checkedPersons.includes(person.empId)) {
              this.checkedPersons.splice(this.checkedPersons.findIndex(item => item === person.empId), 1);
            }
            else {
              this.checkedPersons.push(person.empId);
            }
          });
        }
      });
    },

    findDeptName (deptId) {
      for (let i = 0; i < this.editRecvDeptList.length; i++) {
        let deptItem = this.editRecvDeptList[i];
        if (deptItem.deptId == deptId) {
          return deptItem.deptName;
        }
      }
    },
    initPushDate () {

      let date = new Date();
      date.setMinutes(date.getMinutes() + 5);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let hours = date.getHours().toString().padStart(2, '0');
      let minutes = date.getMinutes().toString().padStart(2, '0');
      let seconds = date.getSeconds().toString().padStart(2, '0');
      this.formData.pushDate = `${y}-${m}-${d} ${hours}:${minutes}:${seconds}`;//  y + '-' + m + '-' + d + " 00:00:00";

    },

    normalizer (node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined
      };
    },
  }
}
</script>

<style scoped>

</style>
