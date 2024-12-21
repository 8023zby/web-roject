<template>
  <div class="inspection-details-container">
    <layout_list>
      <div slot="main" class="main-list inspection-details-container-center">
        <div class="inspection-details-container-center">
          <div class="inspection-details-container-center-top">
            <div class="inspection-details-container-center-top-top">
              <span class="top-line"></span>
              <span class="top-text">入科</span>
              <el-button v-uni="'dairuhuanzhe_ruke_goback'" type="primary" @click="returnFather()" class="top-button">返回</el-button>
            </div>
          </div>
          <div class="inspection-details-container-center-main">
            <div class="clinical-content-inner" v-loading="loading">
              <el-form ref="ruleForm" label-width="140px" inline size="medium" style="margin-top: 40px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="患者ID:">
                      <el-input v-model="inDeptPatient.patientId" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="住院号:">
                      <el-input v-model="inDeptPatient.inpNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="患者姓名:">
                      <el-input v-model="inDeptPatient.patientName" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item label="性别:">
                      <el-input v-model="inDeptPatient.sex" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出生日期:">
                      <el-input v-model="inDeptPatient.birthday" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="年龄:">
                      <el-input v-model="inDeptPatient.age" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item label="床位号:" :rules="[{ required: true, message: '床位号不能为空' }]">
                      <el-input v-model="inDeptPatient.bedName" readonly>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

              <div class="bed-list-div" v-loading="bedListLoading">
                <el-radio-group v-uni="'dairuhuanzhe_changeBed'" v-model="bedSelectedId" class="changing_bed_container" @change="changingBedId">
                  <el-radio v-for="item in bed_data" :key="item.bedId" :label="item.bedId" :disabled="item.isUsed ? true : false" :value="item">
                    {{ item.bedName }}
                  </el-radio>
                </el-radio-group>
              </div>
              <el-form label-width="140px" inline size="medium" style="margin-top: 20px" :rules="rules" :model="inDeptPatient" ref="addForm">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="房间号:">
                      <el-input type="text" v-model="inDeptPatient.roomName" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="护理级别:" prop="nurseLevel">
                      <el-select v-model="inDeptPatient.nurseLevel" placeholder="请选择" value-key="nurseLevel">
                        <el-option v-for="item in nurse_level_data" :key="item.value" :label="item.value" :value="item.label">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8"> </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item label="主治医生:">
                      <el-select placeholder="请选择" v-model="inDeptPatient.doctorName" value-key="doctorNumber" @change="doctorNameChanged" v-uni="'dairuhuanzhe_changeDoctor'">
                        <el-option v-for="item in doctor_data" :key="item.doctorId" :label="item.doctorName" :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任护士:">
                      <el-select @change="nurseNameChanged" value-key="nurseNumber" v-model="inDeptPatient.nurseName" placeholder="请选择" v-uni="'dairuhuanzhe_changeNurse'">
                        <el-option v-for="item in nurse_data" :key="item.nurseId" :label="item.nurseName" :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8"> </el-col>
                </el-row>
              </el-form>

              <div style="
                  display: flex;
                  justify-content: center;
                  line-height: 100px;
                ">
                <span>
                  <el-button v-uni="'dairuhuanzhe_cancel'" @click="returnFather">取消</el-button>
                  <el-button v-uni="'dairuhuanzhe_save'" type="primary" v-model="canSaveClick" @click="sendToHis">保存</el-button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </layout_list>
  </div>
</template>

<script>
import layout_list from "../../../components/bnms/layout/list";
import {
  ApiBedCard,
  ApiBedRoom,
  ApiNurseLevel,
  ApiUsers,
} from "../../../api/bnms/index";

export default {
  name: "inDept",
  components: { layout_list },
  data() {
    return {
      loading: false,
      bedListLoading: false,
      inDeptPatient: {},
      canSaveClick: true,
      bedSelectedId: "",
      nurse_level_data: [],
      doctor_data: [],
      nurse_data: [],
      bed_data: [],
      deptId: "",
      rules: {
        nurseLevel: [
          { required: true, message: `请选择护理级别`, trigger: "change" },
        ],
      },
    };
  },
  created() {
    let deptInfo = JSON.parse(localStorage.getItem("deptInfo")) || {};
    this.deptId = deptInfo.deptId;
    this.inDeptPatient = this.$route.query.inDeptPatient;
    // console.log(this.inDeptPatient);
    this.getDataInit();
  },
  methods: {
    returnFather() {
      this.$router.back();
    },
    sendToHis() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          this.canSaveClick = false;
          ApiBedCard.patientWaitingToHis(this.inDeptPatient)
            .then(() => {
              this.$message.success("同步成功！");
            })
            .catch((err) => {
              this.$message.error(err.message);
            })
            .finally(() => {
              this.canSaveClick = true;
            });
        }
      });
    },
    changingBedId(id) {
      let bedSelectData =
        this.bed_data.find((item) => {
          return item.bedId === id;
        }) || {};
      this.inDeptPatient.roomName = bedSelectData.roomName;
      this.inDeptPatient.roomId = bedSelectData.roomId;
      this.inDeptPatient.bedId = bedSelectData.bedId;
      this.inDeptPatient.bedName = bedSelectData.bedName;
    },
    doctorNameChanged(item) {
      this.inDeptPatient.doctorName = item.doctorName;
      this.inDeptPatient.doctorNumber = item.doctorId; // item.doctorNumber;
      // this.inDeptPatient.doctorId = item.doctorId;
    },
    nurseNameChanged(item) {
      this.inDeptPatient.nurseNumber = item.nurseId; // item.nurseNumber;
      this.inDeptPatient.nurseName = item.nurseName;
      // this.inDeptPatient.nurseId = item.nurseId;
    },
    async getDataInit() {
      // 护理级别
      await this.getNurseLevelData();
      // 值班医生
      await this.getDoctorData();
      // 责任护士
      await this.getNurseData();
      // 房间床位
      await this.getBedListData();
    },
    async getNurseLevelData() {
      await ApiNurseLevel.select()
        .then((res) => {
          this.nurse_level_data = res.data.map((v) => {
            let _v = {};
            _v["value"] = v["nurseLevelName"];
            _v["label"] = v["nurseLevelName"];
            return _v;
          });
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    async getDoctorData() {
      await ApiUsers.doctor({ deptId: this.deptId })
        .then((res) => {
          let list = res.data;
          // console.log(list);
          let arr = [];
          for (let i = 0; i < list.length; i++) {
            let _d = list[i];
            arr.push({
              doctorName: _d["empName"],
              doctorNumber: _d["empKey"],
              doctorId: _d["empId"],
            });
          }
          this.doctor_data = arr;
          // console.log(this.doctor_data);
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    async getNurseData() {
      await ApiUsers.nurse({ deptId: this.deptId })
        .then((res) => {
          let list = res.data;
          // console.log(list);
          let arr = [];
          for (let i = 0; i < list.length; i++) {
            let _d = list[i];
            arr.push({
              nurseName: _d["empName"],
              nurseNumber: _d["empKey"],
              nurseId: _d["empId"],
            });
          }
          this.nurse_data = arr;
          // console.log(this.nurse_data);
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    async getBedListData() {
      this.bedListLoading = true;
      ApiBedRoom.bedList({ deptId: this.deptId, page: 1, size: 2000 }).then(
        (res) => {
          let list = res.data.list;
          let arr = [];
          for (let i = 0; i < list.length; i++) {
            if (list[i].display === null || list[i].display !== 1) {
              arr.push({
                bedName: list[i].bedName,
                bedId: list[i].bedId,
                roomName: list[i].roomName,
                roomId: list[i].roomId,
                isUsed: list[i].isUsed,
              });
            }
          }
          this.bed_data = arr;
        }
      );
      this.bedListLoading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.bed-list-div {
  display: block;
  width: 100%;
  min-height: 60px;
}

.changing_bed_container {
  margin-right: 62px;
  margin-left: 135px;
  margin-top: 20px;

  /deep/ .el-radio {
    margin-right: 20px;
    margin-bottom: 10px;
  }

  /deep/ .el-radio__input.is-checked + .el-radio__label {
    color: #fff !important;
    background-color: rgb(30, 135, 240);
    border: none;
  }

  /deep/ .el-radio__input.is-disabled + span.el-radio__label {
    background: rgba(244, 244, 244, 1) !important;
    border: none !important;
    color: #ccc;
  }

  /deep/ .el-radio__inner {
    display: none;
  }

  /deep/ .el-radio__label {
    font-size: 14px;
    padding-left: 0px;
    width: 40px;
    height: 40px;
    border: 1px solid rgb(191, 191, 191);
    display: inline-block;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(102, 102, 102);
    text-align: center;
    border-radius: 2px;
    box-sizing: border-box;
    font-weight: 400;
  }

  /deep/ .el-radio__input.is-disabled + span.el-radio__label {
    background-color: #fff;
    border-color: #dcdfe6;
  }
}

/deep/ .el-form-item__content {
  width: 360px;
}

/deep/ .el-select {
  width: 100%;
}

/deep/ .el-input__inner {
  height: 46px;
  line-height: 46px;
  border: 1px solid rgba(227, 227, 227, 1);
  border-radius: 2px;
}

/deep/ .el-input.is-disabled .el-input__inner {
  border: none;
  color: #333;
  background-color: rgb(245, 245, 245) !important;
}
/deep/ .el-select .el-input.is-disabled .el-input__inner {
  border: none;
  color: #999;
  background-color: rgb(245, 245, 245) !important;
}

.el-button + .el-button {
  margin-left: 16px;
}

.inspection-details-container {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
  background-color: white;
  display: flex;

  &-center {
    display: flex;
    flex-direction: column;
    flex: 1;

    &-top {
      width: 100%;
      margin-top: 0;
      height: 48px;

      &-top {
        height: 48px;
        margin-top: 0;
        width: 100%;
        background-color: #f7f7f7;
        display: flex;
        align-items: center;

        .top-line {
          background-color: #15c690;
          width: 4px;
          height: 15px;
          vertical-align: center;
          margin-left: 15px;
          display: inline-block;
        }

        .top-text {
          font-size: 14px;
          color: #333333;
          margin-left: 15px;
        }

        .top-button {
          height: 28px;
          width: 80px;
          position: absolute;
          right: 16px;
          border-radius: 2px !important;
          font-size: 14px !important;
          padding-top: 6px !important;
          padding-bottom: 6px !important;
        }
      }
    }

    &-main {
      flex: 1;
      position: relative;

      .clinical-content-inner {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 0;
        overflow-y: scroll;
        overflow-x: hidden;
      }

      .red-font-color {
        color: #f56c6c;
      }
    }
  }
}
/deep/ .el-form-item--medium .el-form-item__content,
/deep/ .el-form-item--medium .el-form-item__label {
  line-height: 46px;
}
.el-button--mini,
.el-button--small {
  font-size: 14px;
}
/*
    /deep/ .el-input.is-disabled .el-input__inner{color:#333;}
*/
</style>
