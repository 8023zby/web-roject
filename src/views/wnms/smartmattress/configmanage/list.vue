<template>
  <layout class="container" v-loading="loading">
    <div slot="main" class="nei_con">
      <div style="position: relative;">
        <div class="top-title">
          <span>基础设置</span>
        </div>
        <div class="top-content">
          <el-row>
            <el-col :span="24">
              <el-form ref="ruleForm" :model="baseSetting" :rules="ruleForm" label-width="200px" label-suffix="：">
                <el-form-item label="数据更新频率" label-width="154px" prop="updateFrequency">
                  <span>
                    <el-input v-model.number="baseSetting.updateFrequency" class="smallInput" />
                    秒/更新
                    <span class="tips">最高更新频率30秒/更新，可设置30以上的数据。</span>
                  </span>
                </el-form-item>

                <el-form-item label="日间模式时间" label-width="154px" prop="dayMode">
                  <span>
                    <el-time-picker v-model="startTime" format="HH:mm" value-format="HH:mm" :clearable="false" placeholder="起始时间">
                    </el-time-picker>
                    至
                    <el-time-picker v-model="endTime" format="HH:mm" value-format="HH:mm" :clearable="false" placeholder="结束时间">
                    </el-time-picker>
                  </span>
                </el-form-item>

                <el-form-item label="夜间模式时间" label-width="154px" prop="nightMode">
                  <span>
                    <el-time-picker v-model="startNightTime" format="HH:mm" value-format="HH:mm" :clearable="false" placeholder="起始时间">
                    </el-time-picker>
                    至
                    <el-time-picker v-model="endNightTime" format="HH:mm" value-format="HH:mm" :clearable="false" placeholder="结束时间">
                    </el-time-picker>
                  </span>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>

      <div style="position: relative;">
        <div class="top-title">
          <span>预警设置</span>
        </div>
        <div class="btnContainer">
          <el-button type="primary" @click="changeMode(1)" :class="modeValue === 1 ? 'daytype' : 'nighttype'" class="btn modBtn dayBtn" v-uni="'device_day'">日间模式</el-button>
          <el-button @click="changeMode(0)" :class="modeValue === 1 ? 'nighttype' : 'daytype'" class="btn modBtn" v-uni="'device_night'">夜间模式</el-button>
        </div>
        <div class="top-content alertSet">
          <el-row>
            <el-col :span="24">
              <el-form ref="ruleForm1" :model="modeSetting" label-width="200px" label-suffix="：">
                <el-form-item label="呼吸频率" label-width="154px">
                  <el-switch v-model="modeSetting.respiratoryRateSwitch" :active-value="1" :inactive-value="0" />
                  <span class="rightCon">
                    正常值:
                    <el-input v-model.number="respiratoryRateS" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!modeSetting.respiratoryRateSwitch" />
                    至
                    <el-input v-model.number="respiratoryRateE" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!modeSetting.respiratoryRateSwitch" />
                    次/分钟
                  </span>
                </el-form-item>

                <el-form-item label="心率" label-width="154px">
                  <el-switch v-model="modeSetting.heartRateSwitch" :active-value="1" :inactive-value="0" />
                  <span class="rightCon">
                    正常值:
                    <el-input v-model.number="heartRateS" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!modeSetting.heartRateSwitch" />
                    至
                    <el-input v-model.number="heartRateE" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!modeSetting.heartRateSwitch" />
                    次/分钟
                  </span>
                </el-form-item>

                <el-form-item label="翻身护理" label-width="154px">
                  <el-switch v-model="modeSetting.turnOverSwitch" :active-value="1" :inactive-value="0" />
                  <span class="rightCon">
                    按照固定间隔时间:
                    <el-input v-model.number="modeSetting.turnOver" maxlength="4" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!modeSetting.turnOverSwitch" />
                    分钟
                  </span>
                </el-form-item>

                <el-form-item label="离床预警" label-width="154px">
                  <el-switch v-model="modeSetting.outBedSwitch" :active-value="1" :inactive-value="0" />
                  <span class="rightCon">
                    离床时间上限值:
                    <el-input v-model.number="modeSetting.outBed" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!modeSetting.outBedSwitch" />
                    分钟
                  </span>
                </el-form-item>

                <!-- <el-form-item label="启用护理标签配置" label-width="154px">
                  <el-switch v-model="modeSetting.nursingLabelSwitch" :active-value="1" :inactive-value="0" />
                </el-form-item> -->

                <!-- <el-form-item label-width="15px">
                  <div style="color: #999999;">选自系统中已经有的护理标签，如果患者有该标签，则启用标签中规定的预警设置。如无符合的标签，则执行公共预警设置，有多个标签冲突时，执行优先级最高的标签设置。数值越小优先级越高。</div>
                </el-form-item> -->

                <!-- <el-form-item label-width="15px">
                  <el-table :data="label_data" border stripe class="labelList showTable" :class="label_data.length > 0 ? '' : 'addLabelTable'">
                    <el-table-column prop="labelName" label="护理标签名称" width="150"></el-table-column>
                    <el-table-column prop="labelLevel" label="优先级" width="100"></el-table-column>
                    <el-table-column label="规则" min-width="130">
                      <template slot-scope="scope">
                        <span>{{ scope.row.respiratoryRateSwitch ? '呼吸频率：' + scope.row.respiratoryRate : '' }}</span>
                        <span v-if="scope.row.respiratoryRateSwitch && (scope.row.heartRateSwitch || scope.row.turnOverSwitch || scope.row.outBedSwitch)">，</span>
                        <span>{{ scope.row.heartRateSwitch ? '心率：' + scope.row.heartRate : '' }}</span>
                        <span v-if="scope.row.heartRateSwitch && (scope.row.turnOverSwitch || scope.row.outBedSwitch)">，</span>
                        <span>{{ scope.row.turnOverSwitch ? '翻身护理：固定间隔时间' + scope.row.turnOver + '分钟' : '' }}</span>
                        <span v-if="scope.row.turnOverSwitch && scope.row.outBedSwitch">，</span>
                        <span>{{ scope.row.outBedSwitch ? '离床预警：' + scope.row.outBed + '分钟' : '' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" header-align="left" width="150">
                      <template slot-scope="scope">
                        <el-button @click="setUse(scope.row)" type="text" size="small" v-uni:[scope.row.labelId]="'smart_using'" :key="'using' + scope.row.labelId">设置</el-button>
                        <el-button type="textred" size="small" @click="labelDelete(scope.row)" v-uni:[scope.row.labelId]="'smart_delete'" :key="'delete' + scope.row.labelId">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <el-table border class="labelList addLabelTable labelAddTable">
                    <el-table-column prop="nurseLevelName" min-width="150">
                      <template slot="header">
                        <i class="el-icon-plus" style="font-size:20px;" @click="addOneRow"></i>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item> -->
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div slot="footer_btn">
      <el-button type="primary" @click="onSubmit" class="btn" v-uni="'smart_save'">保存</el-button>
    </div>

    <!--护理标签配置-->
    <el-dialog title="护理标签配置" :visible.sync="dialogVisible" width="580px" :show-close="false" :close-on-click-modal="false">
      <div class="labelConfig">
        <el-form ref="labelForm" :model="labelSetting" :rules="labelForm" label-width="200px" label-suffix="：">
          <el-form-item label="标签名称:" label-width="125px">
            <el-select v-model="labelSetting.nurseLabelId" placeholder="请选择标签">
              <el-option v-for="item in labelDataList" :key="item.labelId" :label="item.labelName" :value="item.labelId" />
            </el-select>
          </el-form-item>

          <el-form-item label="标签优先级" label-width="125px" prop="priority">
            <el-input v-model.number="labelSetting.labelLevel" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="2" class="labelInput" />
          </el-form-item>

          <el-form-item label="呼吸频率" label-width="125px">
            <el-switch v-model="labelSetting.respiratoryRateSwitch" :active-value="1" :inactive-value="0" />
            <span class="rightCon">
              正常值:
              <el-input v-model.number="respiratoryRateLabelS" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!labelSetting.respiratoryRateSwitch" />
              至
              <el-input v-model.number="respiratoryRateLabelE" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!labelSetting.respiratoryRateSwitch" />
              次/分钟
            </span>
          </el-form-item>

          <el-form-item label="心率" label-width="125px">
            <el-switch v-model="labelSetting.heartRateSwitch" :active-value="1" :inactive-value="0" />
            <span class="rightCon">
              正常值:
              <el-input v-model.number="heartRateLabelS" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!labelSetting.heartRateSwitch" />
              至
              <el-input v-model.number="heartRateLabelE" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!labelSetting.heartRateSwitch" />
              次/分钟
            </span>
          </el-form-item>

          <el-form-item label="翻身护理" label-width="125px">
            <el-switch v-model="labelSetting.turnOverSwitch" :active-value="1" :inactive-value="0" />
            <span class="rightCon">
              按照固定间隔时间:
              <el-input v-model.number="labelSetting.turnOver" maxlength="4" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!labelSetting.turnOverSwitch" />
              分钟
            </span>
          </el-form-item>

          <el-form-item label="离床预警" label-width="125px">
            <el-switch v-model="labelSetting.outBedSwitch" :active-value="1" :inactive-value="0" />
            <span class="rightCon">
              上限值:
              <el-input v-model.number="labelSetting.outBed" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="smallInput" :disabled="!labelSetting.outBedSwitch" />
              分钟
            </span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="!updateLabel" @click="saveLabel()">确 定</el-button>
        <el-button type="primary" v-else @click="upLabel()">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import dateFormat from "../../../../assets/wnms/utils/dateFormat";
import layout from "../../../../components/wnms/layout/edit";
import * as devicesmanage from "@/api/wnms/devicesmanage";

export default {
  name: "devicesmanage",
  components: { layout },
  data() {
    var dayModeTime = (rule, value, callback) => {
      if (
        !(
          (this.startTime !== "" &&
            this.endTime !== "" &&
            this.startTime !== null &&
            this.endTime !== null) ||
          (this.startTime === "" && this.endTime === "") ||
          (this.startTime === null && this.endTime === null)
        )
      ) {
        return callback(new Error("起始时间和结束时间必须同时存在！"));
      } else {
        callback();
      }
    };

    var nightModeTime = (rule, value, callback) => {
      if (
        !(
          (this.startNightTime !== "" &&
            this.endNightTime !== "" &&
            this.startNightTime !== null &&
            this.endNightTime !== null) ||
          (this.startNightTime === "" && this.endNightTime === "") ||
          (this.startNightTime === null && this.endNightTime === null)
        )
      ) {
        return callback(new Error("起始时间和结束时间必须同时存在！"));
      } else {
        callback();
      }
    };
    return {
      changeModeFlag: false,
      updateLabel: false,
      labelDataList: [],
      respiratoryRateLabelS: "",
      respiratoryRateLabelE: "",
      heartRateLabelS: "",
      heartRateLabelE: "",
      dialogVisible: false,
      label_data: [],
      startTime: "",
      endTime: "",
      startNightTime: "",
      endNightTime: "",
      respiratoryRateS: "",
      respiratoryRateE: "",
      heartRateS: "",
      heartRateE: "",
      loading: false,
      modeSetting: {
        respiratoryRateSwitch: 0,
        respiratoryRate: "",
        heartRateSwitch: 0,
        heartRate: "",
        outBedSwitch: 0,
        outBed: "",
        turnOverSwitch: 0,
        turnOver: "",
        nursingLabelSwitch: 0
      },
      dayModeSetting: {
        respiratoryRateSwitch: 0,
        respiratoryRate: "",
        heartRateSwitch: 0,
        heartRate: "",
        outBedSwitch: 0,
        outBed: "",
        turnOverSwitch: 0,
        turnOver: "",
        nursingLabelSwitch: 0
      },
      nightModeSetting: {
        respiratoryRateSwitch: 0,
        respiratoryRate: "",
        heartRateSwitch: 0,
        heartRate: "",
        outBedSwitch: 0,
        outBed: "",
        turnOverSwitch: 0,
        turnOver: "",
        nursingLabelSwitch: 0
      },
      baseSetting: {
        updateFrequency: "",
        dayMode: "",
        nightMode: ""
      },
      labelSetting: {
        mode: 0,
        nurseLabelId: "",
        labelLevel: "",
        respiratoryRateSwitch: 0,
        respiratoryRate: "",
        heartRateSwitch: 0,
        heartRate: "",
        outBedSwitch: 0,
        outBed: "",
        turnOverSwitch: 0,
        turnOver: ""
      },
      startTimeRangge: [],
      endTimeRangge: [],
      startNightTimeRangge: [],
      endNightTimeRangge: [],
      ruleForm: {
        updateFrequency: [
          {
            pattern: /^(3[0-9]|[4-9]\d|\d{3,})$/,
            message: "数据更新频率不能小于30",
            trigger: "blur"
          }
        ],
        dayMode: [],
        nightMode: []
        // dayMode: [{ validator: dayModeTime }],
        // nightMode: [{ validator: nightModeTime }]
      },
      labelForm: {
        priority: [
          {
            pattern: /^[1-9]\d*$/,
            message: "标签优先级为正整数",
            trigger: "blur"
          }
        ]
      },
      modeValue: 1
    };
  },
  watch: {
    startTime: {
      handler(newValue, oldValue) {
        // if (this.checkTime(newValue, this.startNightTime) == 'greater') {
        //   this.endTimeRangge = [newValue + ':00' + '-' + '23:59:59', '00:00:00' + '-' + this.startNightTime + ':00']
        // } else if (this.checkTime(newValue, this.startNightTime) == 'equal') {
        // } else {
        //   this.endTimeRangge = [newValue + ':00' + '-' + this.startNightTime + ':00']
        // }
        // if (this.checkTime(newValue, this.startNightTime) == 'greater') {
        //   this.endNightTimeRangge = [newValue + ':00' + '-' + '23:59:59', '00:00:00' + '-' + this.startNightTime + ':00']
        // } else if (this.checkTime(newValue, this.startNightTime) == 'equal') {
        // } else {
        //   this.endNightTimeRangge = [newValue + ':00' + '-' + this.startNightTime + ':00']
        // }
      },
      deep: true
    },
    endTime: {
      handler(newValue, oldValue) {
        // e = moment(dateHour).add(1, 'hour').format('YYYY-MM-DD HH:mm') + ':00'
        // if (this.checkTime(newValue, this.endNightTime) == 'greater') {
        //   this.startTimeRangge = [this.endNightTime + ':00' + '-' + '23:59:59', '00:00:00' + '-' + newValue + ':00']
        // } else if (this.checkTime(newValue, this.endNightTime) == 'equal') {
        //   let _t = moment(this.endNightTime).add(1, 'minute').format('YYYY-MM-DD HH:mm')
        //   this.startTimeRangge = [_t + ':00' + '-' + '23:59:59', '00:00:00' + '-' + newValue + ':00']
        // } else {
        //   this.startTimeRangge = [newValue + ':00' + '-' + this.endNightTime + ':00']
        // }
        // if (this.checkTime(newValue, this.endNightTime) == 'greater') {
        //   this.startNightTimeRangge = [newValue + ':00' + '-' + '23:59:59', '00:00:00' + '-' + this.endNightTime + ':00']
        // } else if (this.checkTime(newValue, this.endNightTime) == 'equal') {
        // } else {
        //   this.startNightTimeRangge = [newValue + ':00' + '-' + this.endNightTime + ':00']
        // }
      }
      // deep: true
    },
    startNightTime: {
      handler(newValue, oldValue) {
        // if (this.checkTime(newValue, this.startTime) == 'greater') {
        //   this.endTimeRangge = [this.startTime + ':00' + '-' + newValue + ':00']
        // } else if (this.checkTime(newValue, this.startTime) == 'equal') {
        // } else {
        //   this.endTimeRangge = [newValue + ':00' + '-' + '23:59:59', '00:00:00' + '-' + this.startTime + ':00']
        // }
        // if (this.checkTime(newValue, this.startTime) == 'greater') {
        //   this.endNightTimeRangge = [newValue + ':00' + '-' + '23:59:59', '00:00:00' + '-' + this.startTime + ':00']
        // } else if (this.checkTime(newValue, this.startTime) == 'equal') {
        // } else {
        //   this.endNightTimeRangge = [newValue + ':00' + '-' + this.startTime + ':00']
        // }
      }
      // deep: true
    },
    endNightTime: {
      handler(newValue, oldValue) {
        // if (this.checkTime(newValue, this.endTime) == 'greater') {
        //   this.startNightTimeRangge = [this.endTime + ':00' + '-' + newValue + ':00']
        // } else if (this.checkTime(newValue, this.endTime) == 'equal') {
        // } else {
        //   this.startNightTimeRangge = [newValue + ':00' + '-' + '23:59:59', '00:00:00' + '-' + this.endTime + ':00']
        // }
        // if (this.checkTime(newValue, this.endTime) == 'greater') {
        //   this.startTimeRangge = [this.endTime + ':00' + '-' + newValue + ':00']
        // } else if (this.checkTime(newValue, this.endTime) == 'equal') {
        // } else {
        //   // this.startTimeRangge = [newValue + ':00' + '-' + '23:59:59','00:00:00' + '-' + this.endTime + ':00']
        //   this.startTimeRangge = [newValue + ':00' + '-' + this.endTime + ':00']
        // }
      }
      // deep: true
    }
  },
  created() {
    this.startTime = dateFormat(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        "08",
        "00"
      ),
      "HH:mm"
    );
    this.endTime = dateFormat(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        "17",
        "00"
      ),
      "HH:mm"
    );
    this.startNightTime = dateFormat(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        "17",
        "30"
      ),
      "HH:mm"
    );
    this.endNightTime = dateFormat(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        "07",
        "00"
      ),
      "HH:mm"
    );

    this.getSetedDetail();
    this.getSetedLableList();
  },
  methods: {
    checkTime(first, second) {
      if (first.split(":")[0] > second.split(":")[0]) {
        return "greater";
      } else if (first.split(":")[0] == second.split(":")[0]) {
        if (first.split(":")[1] > second.split(":")[1]) {
          return "greater";
        } else if (first.split(":")[1] > second.split(":")[1]) {
          return "equal";
        } else {
          return "less";
        }
      } else {
        return "less";
      }
    },
    getSetedLableList() {
      devicesmanage
        .getSetedLabels({ mode: this.modeValue === 1 ? 0 : 1 })
        .then((res) => {
          if (res && res.data) {
            this.label_data = res.data;
          }
        })
        .catch((res) => {
          console.log(res.desc);
        });
    },
    getSetedDetail() {
      devicesmanage
        .getDetail()
        .then((res) => {
          if (res && res.data) {
            this.baseSetting = res.data.baseSetting;
            this.startTime = this.baseSetting.dayMode.split("-")[0];
            this.endTime = this.baseSetting.dayMode.split("-")[1];
            this.startNightTime = this.baseSetting.nightMode.split("-")[0];
            this.endNightTime = this.baseSetting.nightMode.split("-")[1];

            if (Object.keys(res.data.dayModeSetting).length > 0) {
              this.modeValue = 1;
            } else {
              this.modeValue = 0;
            }

            this.dayModeSetting = res.data.dayModeSetting;
            this.nightModeSetting = res.data.nightModeSetting;

            this.modeSetting =
              Object.keys(res.data.dayModeSetting).length > 0
                ? res.data.dayModeSetting
                : res.data.nightModeSetting;
            this.respiratoryRateS =
              this.modeSetting.respiratoryRate.split("-")[0];
            this.respiratoryRateE =
              this.modeSetting.respiratoryRate.split("-")[1];
            this.heartRateS = this.modeSetting.heartRate.split("-")[0];
            this.heartRateE = this.modeSetting.heartRate.split("-")[1];
          }
        })
        .catch((res) => {
          console.log(res.desc);
        });
    },
    addOneRow() {
      this.updateLabel = false;
      this.labelSetting = {
        mode: 0,
        nurseLabelId: "",
        labelLevel: "",
        respiratoryRateSwitch: 0,
        respiratoryRate: "",
        heartRateSwitch: 0,
        heartRate: "",
        outBedSwitch: 0,
        outBed: "",
        turnOverSwitch: 0,
        turnOver: ""
      };
      this.respiratoryRateLabelS = "";
      this.respiratoryRateLabelE = "";
      this.heartRateLabelS = "";
      this.heartRateLabelE = "";
      this.dialogVisible = true;

      this.getLabels();
    },
    getLabels() {
      devicesmanage
        .getLabels({ labelType: 201 })
        .then((res) => {
          if (res && res.data) {
            this.labelDataList = res.data;
          }
        })
        .catch((res) => {
          console.log(res.desc);
        });
    },
    saveLabel() {
      if (this.labelSetting.respiratoryRateSwitch) {
        // 开了呼吸频率开关
        if (
          this.checkNum(this.respiratoryRateLabelS, this.respiratoryRateLabelE)
        ) {
          // 呼吸频率校验通过
          this.labelSetting.respiratoryRate =
            this.respiratoryRateLabelS + "-" + this.respiratoryRateLabelE;
        } else {
          this.$message.warning(
            "呼吸频率两个数值必须同时存在，并且后面值大于前面值!"
          );
          return false;
        }
      }

      if (this.labelSetting.labelLevel === "") {
        this.$message.warning("请填写标签优先级!");
        return false;
      }

      if (this.labelSetting.heartRateSwitch) {
        // 开了心率开关
        if (this.checkNum(this.heartRateLabelS, this.heartRateLabelE)) {
          // 心率校验通过
          this.labelSetting.heartRate =
            this.heartRateLabelS + "-" + this.heartRateLabelE;
        } else {
          this.$message.warning(
            "心率两个数值必须同时存在，并且后面值大于前面值!"
          );
          return false;
        }
      }

      if (
        this.labelSetting.turnOverSwitch &&
        this.labelSetting.turnOver === ""
      ) {
        this.$message.warning("翻身护理不能为空!");
        return false;
      }

      if (this.labelSetting.outBedSwitch && this.labelSetting.outBed === "") {
        this.$message.warning("离床预警不能为空!");
        return false;
      }

      this.labelSetting.mode = this.modeValue === 1 ? 0 : 1;

      devicesmanage.addLabel(this.labelSetting).then((res) => {
        if (
          res &&
          res.status === 200 &&
          res.desc.indexOf("标签优先级不可重复") > -1
        ) {
          this.$message.error(
            "标签优先级" + this.labelSetting.labelLevel + "重复，请修改!"
          );
        } else if (
          res &&
          res.status === 200 &&
          res.desc.indexOf("护理标签不可重复") > -1
        ) {
          let _item = this.labelDataList.filter(
            (item) => item.labelId === this.labelSetting.nurseLabelId
          );

          this.$message.error(_item[0].labelName + "重复，请修改!");
        } else {
          this.dialogVisible = false;
          this.getSetedLableList();
        }
      });
    },
    upLabel() {
      this.labelSetting.respiratoryRate =
        this.respiratoryRateLabelS + "-" + this.respiratoryRateLabelE;
      this.labelSetting.heartRate =
        this.heartRateLabelS + "-" + this.heartRateLabelE;
      if (this.labelSetting.respiratoryRateSwitch) {
        // 开了呼吸频率开关
        if (
          this.checkNum(this.respiratoryRateLabelS, this.respiratoryRateLabelE)
        ) {
          // 呼吸频率校验通过
          this.labelSetting.respiratoryRate =
            this.respiratoryRateLabelS + "-" + this.respiratoryRateLabelE;
        } else {
          this.$message.warning(
            "呼吸频率两个数值必须同时存在，并且后面值大于前面值!"
          );
          return false;
        }
      }

      if (this.labelSetting.labelLevel === "") {
        this.$message.warning("请填写标签优先级!");
        return false;
      }

      if (this.labelSetting.heartRateSwitch) {
        // 开了心率开关
        if (this.checkNum(this.heartRateLabelS, this.heartRateLabelE)) {
          // 心率校验通过
          this.labelSetting.heartRate =
            this.heartRateLabelS + "-" + this.heartRateLabelE;
        } else {
          this.$message.warning(
            "心率两个数值必须同时存在，并且后面值大于前面值!"
          );
          return false;
        }
      }

      if (
        this.labelSetting.turnOverSwitch &&
        this.labelSetting.turnOver === ""
      ) {
        this.$message.warning("翻身护理不能为空!");
        return false;
      }

      if (this.labelSetting.outBedSwitch && this.labelSetting.outBed === "") {
        this.$message.warning("离床预警不能为空!");
        return false;
      }

      devicesmanage.updLabel(this.labelSetting).then((res) => {
        if (
          res &&
          res.status === 200 &&
          res.desc.indexOf("标签优先级不可重复") > -1
        ) {
          this.$message.error(
            "标签优先级" + this.labelSetting.labelLevel + "重复，请修改!"
          );
        } else if (
          res &&
          res.status === 200 &&
          res.desc.indexOf("护理标签不可重复") > -1
        ) {
          let _item = this.labelDataList.filter(
            (item) => item.labelId === this.labelSetting.nurseLabelId
          );

          this.$message.error(_item[0].labelName + "重复，请修改!");
        } else {
          this.dialogVisible = false;
          this.getSetedLableList();
        }
      });
    },
    setUse(row) {
      // 设置
      this.getLabels();
      this.updateLabel = true;
      this.dialogVisible = true;

      this.labelSetting = JSON.parse(JSON.stringify(row));

      this.respiratoryRateLabelS = this.labelSetting.respiratoryRate.split(
        "-"
      )[0]
        ? this.labelSetting.respiratoryRate.split("-")[0]
        : "";
      this.respiratoryRateLabelE = this.labelSetting.respiratoryRate.split(
        "-"
      )[1]
        ? this.labelSetting.respiratoryRate.split("-")[1]
        : "";
      this.heartRateLabelS = this.labelSetting.heartRate.split("-")[0]
        ? this.labelSetting.heartRate.split("-")[0]
        : "";
      this.heartRateLabelE = this.labelSetting.heartRate.split("-")[1]
        ? this.labelSetting.heartRate.split("-")[1]
        : "";
    },
    labelDelete(row) {
      // 删除
      this.$confirm("确定删除设置的标签？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        devicesmanage
          .deleteLabel({ labelId: row.labelId })
          .then((res) => {
            if (res) {
              this.$message.success(res.desc);
              this.getSetedLableList();
            }
          })
          .catch((res) => {
            this.$message.error(res.desc);
          });
      });
    },
    changeMode(val) {
      // 切换日间模式、夜间模式
      if (this.modeValue === 1) {
        this.changeModeFlag = true;
        if (this.modeSetting.respiratoryRateSwitch) {
          // 开了呼吸频率开关
          if (this.checkNum(this.respiratoryRateS, this.respiratoryRateE)) {
            // 呼吸频率校验通过
            this.dayModeSetting.respiratoryRate =
              this.respiratoryRateS + "-" + this.respiratoryRateE;
            this.dayModeSetting.respiratoryRateSwitch =
              this.modeSetting.respiratoryRateSwitch;
          } else {
            this.$message.warning(
              "呼吸频率两个数值必须同时存在，并且后面值大于前面值!"
            );
            return false;
          }
        }

        if (this.modeSetting.heartRateSwitch) {
          // 开了心率开关
          if (this.checkNum(this.heartRateS, this.heartRateE)) {
            // 心率校验通过
            this.dayModeSetting.heartRate =
              this.heartRateS + "-" + this.heartRateE;
            this.dayModeSetting.heartRateSwitch =
              this.modeSetting.heartRateSwitch;
          } else {
            this.$message.warning(
              "心率两个数值必须同时存在，并且后面值大于前面值!"
            );
            return false;
          }
        }

        if (
          this.modeSetting.turnOverSwitch &&
          this.modeSetting.turnOver === ""
        ) {
          this.$message.warning("翻身护理不能为空!");
          return false;
        }

        if (this.modeSetting.outBedSwitch && this.modeSetting.outBed === "") {
          this.$message.warning("离床预警不能为空!");
          return false;
        }

        this.respiratoryRateS = "";
        this.respiratoryRateE = "";
        this.heartRateS = "";
        this.heartRateE = "";
        this.modeSetting = this.nightModeSetting;

        this.respiratoryRateS = this.modeSetting.respiratoryRate.split("-")[0];
        this.respiratoryRateE = this.modeSetting.respiratoryRate.split("-")[1];

        this.heartRateS = this.modeSetting.heartRate.split("-")[0];
        this.heartRateE = this.modeSetting.heartRate.split("-")[1];
      } else {
        this.changeModeFlag = false;
        if (this.modeSetting.respiratoryRateSwitch) {
          // 开了呼吸频率开关
          if (this.checkNum(this.respiratoryRateS, this.respiratoryRateE)) {
            // 呼吸频率校验通过
            this.nightModeSetting.respiratoryRate =
              this.respiratoryRateS + "-" + this.respiratoryRateE;
            this.nightModeSetting.respiratoryRateSwitch =
              this.modeSetting.respiratoryRateSwitch;
          } else {
            this.$message.warning(
              "呼吸频率两个数值必须同时存在，并且后面值大于前面值!"
            );
            return false;
          }
        }

        if (this.modeSetting.heartRateSwitch) {
          // 开了心率开关
          if (this.checkNum(this.heartRateS, this.heartRateE)) {
            // 心率校验通过
            this.nightModeSetting.heartRate =
              this.heartRateS + "-" + this.heartRateE;
            this.nightModeSetting.heartRateSwitch =
              this.modeSetting.heartRateSwitch;
          } else {
            this.$message.warning(
              "心率两个数值必须同时存在，并且后面值大于前面值!"
            );
            return false;
          }
        }

        if (
          this.modeSetting.turnOverSwitch &&
          this.modeSetting.turnOver === ""
        ) {
          this.$message.warning("翻身护理不能为空!");
          return false;
        }

        if (this.modeSetting.outBedSwitch && this.modeSetting.outBed === "") {
          this.$message.warning("离床预警不能为空!");
          return false;
        }

        this.respiratoryRateS = "";
        this.respiratoryRateE = "";
        this.heartRateS = "";
        this.heartRateE = "";
        this.modeSetting = this.dayModeSetting;

        this.respiratoryRateS = this.modeSetting.respiratoryRate.split("-")[0];
        this.respiratoryRateE = this.modeSetting.respiratoryRate.split("-")[1];

        this.heartRateS = this.modeSetting.heartRate.split("-")[0];
        this.heartRateE = this.modeSetting.heartRate.split("-")[1];
      }

      this.modeValue = val;

      this.getSetedLableList();
    },
    onSubmit() {
      // 需要单独判断，没有走切换状态
      if (!this.changeModeFlag) {
        if (
          this.checkNum(this.respiratoryRateS, this.respiratoryRateE) &&
          this.modeSetting.respiratoryRateSwitch
        ) {
          this.dayModeSetting.respiratoryRate =
            this.respiratoryRateS + "-" + this.respiratoryRateE;
        } else if (
          !this.checkNum(this.respiratoryRateS, this.respiratoryRateE) &&
          this.modeSetting.respiratoryRateSwitch
        ) {
          this.$message.warning(
            "呼吸频率两个数值必须同时存在，并且后面值大于前面值!"
          );
          return false;
        }

        if (
          this.checkNum(this.heartRateS, this.heartRateE) &&
          this.modeSetting.heartRateSwitch
        ) {
          this.dayModeSetting.heartRate =
            this.heartRateS + "-" + this.heartRateE;
        } else if (
          !this.checkNum(this.heartRateS, this.heartRateE) &&
          this.modeSetting.heartRateSwitch
        ) {
          this.$message.warning(
            "心率两个数值必须同时存在，并且后面值大于前面值!"
          );
          return false;
        }

        if (
          this.modeSetting.turnOverSwitch &&
          this.modeSetting.turnOver === ""
        ) {
          this.$message.warning("翻身护理不能为空!");
          return false;
        }

        if (this.modeSetting.outBedSwitch && this.modeSetting.outBed === "") {
          this.$message.warning("离床预警不能为空!");
          return false;
        }
      } else {
        if (
          this.checkNum(this.respiratoryRateS, this.respiratoryRateE) &&
          this.modeSetting.respiratoryRateSwitch
        ) {
          this.nightModeSetting.respiratoryRate =
            this.respiratoryRateS + "-" + this.respiratoryRateE;
        } else if (
          !this.checkNum(this.respiratoryRateS, this.respiratoryRateE) &&
          this.modeSetting.respiratoryRateSwitch
        ) {
          this.$message.warning(
            "呼吸频率两个数值必须同时存在，并且后面值大于前面值!"
          );
          return false;
        }

        if (
          this.checkNum(this.heartRateS, this.heartRateE) &&
          this.modeSetting.heartRateSwitch
        ) {
          this.nightModeSetting.heartRate =
            this.heartRateS + "-" + this.heartRateE;
        } else if (
          !this.checkNum(this.heartRateS, this.heartRateE) &&
          this.modeSetting.heartRateSwitch
        ) {
          this.$message.warning(
            "心率两个数值必须同时存在，并且后面值大于前面值!"
          );
          return false;
        }

        if (
          this.modeSetting.turnOverSwitch &&
          this.modeSetting.turnOver === ""
        ) {
          this.$message.warning("翻身护理不能为空!");
          return false;
        }

        if (this.modeSetting.outBedSwitch && this.modeSetting.outBed === "") {
          this.$message.warning("离床预警不能为空!");
          return false;
        }
      }

      let _savedata = {
        dayModeSetting: this.dayModeSetting,
        nightModeSetting: this.nightModeSetting,
        baseSetting: this.baseSetting
      };

      _savedata.baseSetting.dayMode = this.startTime + "-" + this.endTime;
      _savedata.baseSetting.nightMode =
        this.startNightTime + "-" + this.endNightTime;

      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        devicesmanage
          .saveConfig(_savedata)
          .then((res) => {
            this.$message.success("保存参数成功!");
          })
          .catch((res) => {
            console.log(res.desc);
          });
      });
    },
    checkNum(first, second) {
      // 判断前面的数值，小于后面的数值
      if (first !== "" && second !== "" && +first < +second) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.el-col {
  margin-top: 20px;
}

.btn {
  display: block;
  margin: 0 auto;
}

.top-title {
  margin-top: 20px;
  margin-left: 16px;
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
}

.top-content {
  border: 1px solid #ebeef5;
  margin: 16px 16px 0;
}

.nei_con {
  height: calc(100% - 60px);
  overflow: auto;
  box-shadow: 0px 0px 6px 0px rgba(113, 113, 113, 0.3);
}

.btnContainer {
  width: 240px;
  padding-left: 15px;
  margin-top: 20px;
}

.modBtn {
  border-radius: 17px;
  width: 100px;
  height: 34px;
}

.dayBtn {
  float: left;
}

.daytype {
  background: #1e87f0;
  color: white;
}

.nighttype {
  background: #ffffff !important;
  border: 1px solid #1e87f0;
  color: #1e87f0;
}

.alertSet {
  margin-bottom: 20px;
}

.smallInput {
  width: 100px;
}

.rightCon {
  margin-left: 15px;
}

.tips {
  margin-left: 10px;
  color: #999999;
}

/deep/.showTable th {
  background-color: #f7f7f7;
}

.labelList {
  width: 80%;
}

.addLabelTable {
  /deep/.el-table__body-wrapper {
    display: none;
  }
}

.labelAddTable {
  border-top: none;
}

.labelConfig {
  height: 330px;
}

.labelInput {
  width: 215px;
}
</style>
