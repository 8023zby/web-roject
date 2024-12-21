<template>
  <div class="container">
    <div class="left">
      <patient-waiting @waitingPatient="resetCurrentWaitingPatient" ref="myWaiting"></patient-waiting>
    </div>
    <div class="right">
      <div style="position: relative;top: 20px;display: flex">
        <div class="div-left">
          <div
            style="height: 80px;width: 80px;margin:20px auto 10px;border-radius:70px;background-color: #E3E3E3;text-align: center;vertical-align: center;">
            <i class="el-icon-s-custom" style="font-size: 70px;height: 100%;line-height: 80px;color: white"></i>
          </div>
          <div style="text-align: center;height: 20px;">
            <span>{{currentWaitingPatient.patientName}}</span>
          </div>
          <div
            style="width: 80px;text-align: center;height: 30px;border-radius:15px;border: 1px solid #E3E3E3;margin: 10px auto;">
            <span style="line-height: 30px;">待入科</span>
          </div>
        </div>
        <div class="div-right">
          <table>
            <tr>
              <td>患者ID</td>
              <td>{{currentWaitingPatient.patientId}}</td>
              <td>住院号</td>
              <td>{{currentWaitingPatient.inpNo}}</td>
            </tr>
            <tr>
              <td>患者姓名</td>
              <td>{{currentWaitingPatient.patientName}}</td>
              <td>性别</td>
              <td>{{currentWaitingPatient.sex}}</td>
            </tr>
            <tr>
              <td>出生日期</td>
              <td>{{currentWaitingPatient.birthday}}</td>
              <td>年龄</td>
              <td>{{currentWaitingPatient.age}}</td>
            </tr>
            <tr>
              <td>门诊诊断</td>
              <td>{{currentWaitingPatient.diagnose}}</td>
              <td>入院时间</td>
              <td>{{currentWaitingPatient.inTime}}</td>
            </tr>
            <tr>
              <td>入院次数</td>
              <td>{{currentWaitingPatient.inFqcy}}</td>
              <td>联系人电话</td>
              <td>{{currentWaitingPatient.contactNumber}}</td>
            </tr>
            <tr>
              <td>联系人姓名</td>
              <td>{{currentWaitingPatient.contactName}}</td>
              <td>与患者关系</td>
              <td>{{currentWaitingPatient.contactRelation}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div style="position: relative;top: 100px;">
        <el-form :inline="true" v-model="currentWaitingPatient">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="床位号" required>
                <el-input type="text" v-model="currentWaitingPatient.bedName" readonly>
                </el-input>
              </el-form-item>
              <el-button type="primary" @click="dialogVisible = !dialogVisible"
                         :disabled="currentWaitingPatient.patientId==null">选择床位
              </el-button>
            </el-col>
          </el-row>

          <el-form-item label="房间号" style="padding-left: 10px;">
            <el-input type="text" v-model="currentWaitingPatient.roomName" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="护理级别">
            <el-select v-model="currentWaitingPatient.nurseLevel" placeholder="请选择">
              <el-option
                v-for="item in nurse_level_data"
                :key="item.value"
                :label="item.value"
                :value="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主治医生">
            <el-select placeholder="请选择" @change="doctorNameChanged" v-model="currentWaitingPatient.doctorNumber">
              <el-option
                v-for="item in doctor_data"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任护士">
            <el-select @change="nurseNameChanged" v-model="currentWaitingPatient.nurseNumber" placeholder="请选择">
              <el-option
                v-for="item in nurse_data"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入科时间">
            <el-input type="text" v-model="currentWaitingPatient.inDeptTime" disabled>
            </el-input>
          </el-form-item>
        </el-form>
        <div style="position: relative;top: 50px;left: 20px;">
          <el-button @click="sendToHis"
                     :disabled="(btnSendHisIsClick||currentWaitingPatient.bedId==null)"
                     type="warning">同步his<i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </div>
      </div>
      <el-dialog
        title="选择床位"
        :visible.sync="dialogVisible"
        width="42%"
      >
        <div class="changing_bed_container">
          <el-radio-group v-model="bedSelectedId">
            <el-radio
              v-for="(item, index) in bed_data"
              :key="item.value + index"
              :label="item.value"
              :disabled="item.isUsed ? true : false"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
         <el-button type="primary" size="small" @click="changingBedId"
         >确认</el-button
         >
         <el-button
           type="gray"
           size="small"
           @click="dialogVisible = false"
         >取消</el-button
         >
       </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import PatientWaitingList from './PatientWaitingList';
  import {ApiBedCard, ApiBedRoom, ApiNurseLevel, ApiUsers} from "../../../api/bnms/index";

  export default {
    name: "PatientWaiting",
    components: {
      "patient-waiting": PatientWaitingList
    },
    data() {
      return {
        currentWaitingPatient: {},
        nurseLevelList: [],
        doctorNameList: [],
        nurseNameList: [],
        nurse_level_data: [],
        doctor_data: [],
        nurse_data: [],
        bed_data: [],
        deptId: "",
        dialogVisible: false,
        bedSelectedId: {},
        btnSendHisIsClick: false
      }
    },
    created() {
      let deptInfo = JSON.parse(localStorage.getItem('deptInfo')) || {};
      this.deptId = deptInfo.deptId || '64b7b62f9cb7434c884e308f57522d38';
      this.getDataInit();
    },
    methods: {
      resetCurrentWaitingPatient(row) {
        this.currentWaitingPatient = row;
      },
      sendToHis() {
        this.btnSendHisIsClick = true;
        ApiBedCard.patientWaitingToHis(this.currentWaitingPatient).then(() => {
          this.$message.success('同步成功！');
          this.$refs.myWaiting.getData();
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.btnSendHisIsClick = false;
        });
      },
      changingBedId() {
        let bedSelectData = this.bed_data.find(item => {
          return item.value === this.bedSelectedId;
        })
        this.currentWaitingPatient.roomName = bedSelectData.roomName;
        this.currentWaitingPatient.roomId = bedSelectData.roomId;
        this.currentWaitingPatient.bedId = bedSelectData.value;
        this.currentWaitingPatient.bedName = bedSelectData.label;
        this.dialogVisible = false;
      },
      doctorNameChanged(id) {
        this.currentWaitingPatient.doctorName = this.doctor_data.find(item => {
          return item.value === id
        }).label;
        this.currentWaitingPatient.doctorNumber = id;
      },
      nurseNameChanged(id) {
        this.currentWaitingPatient.nurseName = this.nurse_data.find(item => {
          return item.value === id
        }).label;
        this.currentWaitingPatient.nurseNumber = id;
      },
      async getDataInit() {
        //护理级别
        await this.getNurseLevelData();
        //值班医生
        await this.getDoctorData();
        //责任护士
        await this.getNurseData();
        // 房间床位
        await this.getBedListData();
      },
      async getNurseLevelData() {
        await ApiNurseLevel.select().then(res => {
          this.nurse_level_data = res.data.map(v => {
            let _v = {};
            _v["value"] = v["nurseLevelName"];
            _v["label"] = v["nurseLevelName"];
            return _v;
          });
        }).catch(err => {
          this.$message.error(err.message)
        });
      },
      async getDoctorData() {
        await ApiUsers.doctor({deptId: this.deptId}).then(res => {
          let list = res.data;
          let arr = [];
          for (let i = 0; i < list.length; i++) {
            let _d = list[i];
            arr.push({label: _d['empName'], value: _d['empKey']});
          }
          this.doctor_data = arr;
        }).catch(res => {
          this.$message.error(res.message);
        });
      },
      async getNurseData() {
        await ApiUsers.nurse({deptId: this.deptId}).then(res => {
          let list = res.data;
          let arr = [];
          for (let i = 0; i < list.length; i++) {
            let _d = list[i];
            arr.push({label: _d['empName'], value: _d['empKey']});
          }
          this.nurse_data = arr;
        }).catch(res => {
          this.$message.error(res.message);
        });
      },
      async getBedListData() {
        ApiBedRoom.bedList({deptId: this.deptId, page: 1, size: 2000}).then(res => {
          let list = res.data.list;
          let arr = [];
          for (let i = 0; i < list.length; i++) {
            arr.push({
              // label: (list[i].bedName != null && list[i].bedName.indexOf('床') != -1) ? list[i].bedName : list[i].bedName + '床',
              label: list[i].bedName,
              value: list[i].bedId,
              roomName: list[i].roomName,
              roomId: list[i].roomId,
              isUsed: list[i].isUsed
            });
          }

          this.bed_data = arr;
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    height: 100%;
    display: flex;
    justify-content: flex-start;

    .left {
      /*margin-right: 5px;*/
    }

    .right {
      flex: 1;
      width: 0;
      overflow: hidden;
      position: relative;

      /deep/ .el-form-item__label {
        /*width: 90px;*/
        color: #333333 !important;
      }

      .changing_bed_container {
        //当前患者的床号
        .curr_patient {
          /deep/ .el-radio__label {
            color: #fff !important;
            background-color: #409eff !important;
          }
        }

        /deep/ .el-radio {
          margin-right: 20px;
          margin-bottom: 10px;
        }

        /deep/ .el-radio__input.is-checked + .el-radio__label {
          color: #fff;
          background-color: #45d4b6;
          border-color: #45d4b6;
        }

        /deep/ .el-radio__inner {
          display: none;
        }

        /deep/ .el-radio__label {
          font-size: 14px;
          padding-left: 0px;
          width: 45px;
          height: 45px;
          border: 1px solid #409eff;
          display: inline-block;
          line-height: 45px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #409eff;
          text-align: center;
          border-radius: 5px;
        }

        /deep/ .el-radio__input.is-disabled + span.el-radio__label {
          color: #999;
          background-color: #fff;
          border-color: #dcdfe6;
        }
      }

      .div-left {
        float: left;
        width: 200px;
        height: 200px;
        border: 1px solid #E8E8E8;
        border-right: none;
        color: #333333 !important;
      }

      .div-right {
        flex: 1;

        table {
          width: 99%;
          height: 100%;
          text-align: center;
          border-collapse: collapse;
          color: #333333 !important;

          tr th, tr td {
            border: 1px solid #E8E8E8;
          }

          td:nth-child(odd) {
            background-color: #F9F9F9;
            width: 20%;
          }
        }
      }
    }
  }
</style>
