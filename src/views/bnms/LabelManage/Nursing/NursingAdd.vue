<template>
  <layout v-loading="loading">
    <div slot="title">
      {{ form_type_text }}护理标签
    </div>
    <div slot="main" class="add-from">
      <el-form v-uni="'hulibiaoqiantianjiabiaodan'" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="auto" label-suffix=":">
        <el-form-item label="标签分类" prop="classId">
          <el-select v-model="ruleForm.classId" filterable multiple clearable placeholder="请选择" v-uni="'classId'">
            <el-option v-for="item in classify_data" :key="item.classId" :label="item.className" :value="item.classId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称" prop="labelName">
          <el-input v-model.trim="ruleForm.labelName" placeholder="请输入" oninput="if(value.length>16)value=value.slice(0,16)"></el-input>
        </el-form-item>
        <el-form-item label="是否手工输入" prop="inputType">
          <el-radio-group v-model="ruleForm.inputType" @change="handleInputType">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示标识" prop="identifyId">
          <el-select v-model="ruleForm.identifyId" v-uni="'identifyId'" filterable clearable placeholder="请选择">
            <el-option v-for="item in identify_data" :key="item.identifyId" :label="item.identifyName" :value="item.identifyId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联内容" prop="dataSources">
          <el-radio-group v-model="ruleForm.dataSources" @change="handleRelationType">
            <el-radio :label="1" :disabled="ruleForm.inputType == 1">关联患者字段</el-radio>
            <el-radio :label="2" disabled>关联风险评估</el-radio>
            <el-radio :label="3">自定义字段</el-radio>
            <el-radio :label="4" :disabled="ruleForm.inputType == 1">自定义脚本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联患者字段" prop="relationField" v-if="ruleForm.dataSources === 1" style="width: 725px">
          <el-col :span="12">
            <el-select v-model="ruleForm.relationField" v-uni="'relationField'" filterable clearable placeholder="请选择" @change="handlerPatientChange" style="width: 300px">
              <el-option v-for="item in patient_data" :key="item.labelId" :label="item.labelName" :value="item.labelSql">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-select v-model="ruleForm.relationValue" v-uni="'relationValue'" filterable clearable placeholder="请选择" style="width: 300px">
              <el-option v-for="item in patient_data2.item" :key="item.name" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="关联风险评估" prop="relationField" v-if="ruleForm.dataSources === 2" style="width: 725px">
          <el-col :span="12">
            <el-select v-model="ruleForm.relationField" v-uni="'relationField'" filterable clearable placeholder="请选择" @change="handlerAssessChange" style="width: 300px">
              <el-option v-for="item in assess_data" :key="item.assId" :label="item.assName" :value="item.assId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-select v-model="ruleForm.relationValue" v-uni="'relationValue'" filterable clearable placeholder="请选择" style="width: 300px">
              <el-option v-for="item in assess_child_data" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="字段内容" prop="labelSql" v-if="ruleForm.dataSources === 3">
          <el-input v-model="ruleForm.labelSql" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="脚本内容" prop="labelSql" v-if="ruleForm.dataSources === 4">
          <el-input type="textarea" :rows="5" v-model="ruleForm.labelSql" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="正则表达式" prop="labelSql" v-if="ruleForm.dataSources === 5 || ruleForm.dataSources === 6">
          <el-input type="textarea" :rows="5" v-model="ruleForm.labelSql" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="信息看板显示样式" prop="boardShowValue">
          <el-checkbox-group v-model="ruleForm.boardShowValue" @change="changeBoardShowValue" class="display-checkbox">
            <el-checkbox label="1">
              <div class="checkbox-label">
                <div class="checkbox-label-name">合计信息</div>
                <div class="checkbox-color" @click.stop.prevent="() => {}">
                  <span class="checkbox-color-label">字体颜色：</span>
                  <el-color-picker v-model="color1" size="mini" @change="changeColor(1)"></el-color-picker>
                </div>
                <div class="checkbox-color" @click.stop.prevent="() => {}">
                  <span class="checkbox-color-label checkbox-color-label-value">{{ color1  }}</span>
                </div>
              </div>
            </el-checkbox>
            <el-checkbox label="2">
              <div class="checkbox-label">
                <div class="checkbox-label-name">床位号</div>
                <div class="checkbox-color" @click.stop.prevent="() => {}">
                  <span class="checkbox-color-label">字体颜色：</span>
                  <el-color-picker v-model="color2" size="mini" @change="changeColor(2)"></el-color-picker>
                </div>
                <div class="checkbox-color" @click.stop.prevent="() => {}">
                  <span class="checkbox-color-label checkbox-color-label-value">{{ color2  }}</span>
                </div>
              </div>
            </el-checkbox>
            <el-checkbox label="3">
              <div class="checkbox-label">
                <div class="checkbox-label-name">患者姓名</div>
                <div class="checkbox-color" @click.stop.prevent="() => {}">
                  <span class="checkbox-color-label">字体颜色：</span>
                  <el-color-picker v-model="color3" size="mini" @change="changeColor(3)"></el-color-picker>
                </div>
                <div class="checkbox-color" @click.stop.prevent="() => {}">
                  <span class="checkbox-color-label checkbox-color-label-value">{{ color3  }}</span>
                </div>
              </div>
            </el-checkbox>
            <el-checkbox label="4" :disabled="isRelationCheckBoxDisabled">
              <div class="checkbox-label">
                <div class="checkbox-label-name">关联患者字段</div>
                <div class="checkbox-color" @click.stop.prevent="() => {}">
                  <span class="checkbox-color-label">字体颜色：</span>
                  <el-color-picker v-model="color4" size="mini" @change="changeColor(4)"></el-color-picker>
                </div>
                <div class="checkbox-color" @click.stop.prevent="() => {}">
                  <span class="checkbox-color-label checkbox-color-label-value">{{ color4  }}</span>
                </div>
                <div class="checkbox-relation" @click.stop.prevent="() => {}">
                  <el-form-item label="" v-uni="'checkboxrelation'" prop="relation">
                    <span style="color: #606266">显示患者字段：</span>
                    <el-select v-model="relation" v-uni="'checkboxrelationselect'" filterable :disabled="isRelationDisabled" placeholder="请选择" style="width: 300px">
                      <el-option v-for="item in patient_data" :key="item.labelId" :label="item.labelName" :value="item.labelSql">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="信息看板是否显示执行状态" prop="isShowStatus">
          <el-radio-group v-model="ruleForm.isShowStatus" @change="handleIsShowStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="信息看板状态是否允许手输" prop="boardUpdate">
          <el-radio-group v-model="ruleForm.boardUpdate" :disabled="!(ruleForm.inputType === 1 && ruleForm.isShowStatus === 1)">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button v-uni="'hulibiaoqian_cancel'" size="small" @click="close">
        取消
      </el-button>
      <el-button v-uni="'hulibiaoqian_save'" type="primary" size="small" @click="submitForm">
        保存
      </el-button>
    </div>
  </layout>
</template>

<script>
import {
  ApiNursingManage,
  ApiClassifyManage,
  ApiNursingIdentifyManage,
  ApiPatientManage,
  ApiNurseLevel,
} from "../../../../api/bnms/index";
import layout from "../../../../components/bnms/layout/edit";

export default {
  name: "nursing_add",
  components: { layout },
  data() {
    return {
      loading: false,
      show_labelDisplayTypeValue: false,
      form_type_text: "",
      classify_data: [],
      identify_data: [],
      patient_data: [],
      patient_data2: [],
      assess_data: [],
      assess_child_data: [],
      ruleForm: {
        classId: [],
        identifyId: "",
        dataSources: 1,
        labelType: "201",
        labelName: "",
        inputType: 2,
        labelSql: "",
        relationField: "",
        relationValue: "",
        boardShowValue: [],
        boardUpdate: 0,
        isShowStatus: 0,
      },
      rules: {
        labelName: [
          { required: true, message: "请输入标签名称！", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符！",
            trigger: "blur",
          },
        ],
        inputType: [
          {
            required: true,
            message: "请选择是否手工输入！",
            trigger: "change",
          },
        ],
        dataSources: [
          {
            required: true,
            message: "请选择关联内容/脚本！",
            trigger: "change",
          },
        ],
        relationField: [
          {
            validator: (rule, value, callback) => {
              if (
                (this.ruleForm.dataSources === 1 ||
                  this.ruleForm.dataSources === 2) &&
                value === ""
              ) {
                callback(new Error("关联内容不能为空！"));
              } else if (value.length > 50) {
                callback(new Error("关联内容不能超过50个字符！"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        labelSql: [
          // { required: true, message: "请输入字段名称/脚本！", trigger: "blur" }
          {
            validator: (rule, value, callback) => {
              // if (this.ruleForm.inputType === 2 && (this.ruleForm.dataSources === 3 || this.ruleForm.dataSources === 4) && value === '') {
              if (
                (this.ruleForm.dataSources === 3 ||
                  this.ruleForm.dataSources === 4) &&
                value === ""
              ) {
                callback(new Error("请输入！"));
              } else if (
                this.ruleForm.dataSources === 3 &&
                value &&
                value.length > 200
              ) {
                callback(new Error("最多输入200个字符！"));
              } else if (
                this.ruleForm.dataSources === 4 &&
                value &&
                value.length > 700
              ) {
                callback(new Error("最多输入700个字符！"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        relation: [
          {
            validator: (rule, value, callback) => {
              if (this.isRelationDisabled) {
                return callback();
              }
              if (!this.relation) {
                return callback(new Error("请选择显示患者字段！"));
              } else {
                return callback();
              }
            },
            trigger: "blur",
          },
        ],
        boardShowValue: [
          {
            required: true,
            message: "请选择床位号，患者姓名或者关联患者字段！",
            trigger: "change",
          },
          {
            validator: (rule, value, callback) => {
              if (
                this.ruleForm.boardShowValue.includes("2") ||
                this.ruleForm.boardShowValue.includes("3") ||
                this.ruleForm.boardShowValue.includes("4")
              ) {
                return callback();
              } else {
                if (this.ruleForm.dataSources == 1) {
                  return callback(
                    new Error("请选择床位号，患者姓名或者关联患者字段！")
                  );
                } else {
                  return callback(new Error("请选择床位号或患者姓名！"));
                }
              }
            },
            trigger: "blur",
          },
        ],
      },
      relation: "",
      isRelationDisabled: true,
      isRelationCheckBoxDisabled: false,
      color1: "#555555",
      color2: "#555555",
      color3: "#555555",
      color4: "#555555",
    };
  },
  props: ["detail"],
  created() {
    let params = this.detail || {};

    this.form_type_text = params["labelId"] ? "编辑" : "添加";

    if (params.classId && typeof params.classId === "string") {
      params.classId = params.classId.split(",");
    } else {
      params.classId = [];
    }
    if (params.dataSources && params.dataSources !== 1) {
      this.relation = "";
      this.isRelationDisabled = true;
      this.isRelationCheckBoxDisabled = true;
    }
    if (params.boardShowValue) {
      try {
        let obj = JSON.parse(params.boardShowValue);
        params.boardShowValue = [];
        Object.keys(obj).map((item) => {
          params.boardShowValue.push(item);
          switch (item) {
            case "4":
              let arr = obj[item].split(";");
              this[`color${item}`] = arr[0] ? arr[0] : "";
              this.relation = arr[1] ? arr[1] : "";
              this.isRelationDisabled = false;
              break;
            default:
              this[`color${item}`] = obj[item] ? obj[item] : "";
              break;
          }
        });
      } catch (error) {
        console.log(error);
        params.boardShowValue = params.boardShowValue.split(",");
      }
    } else {
      params.boardShowValue = [];
    }

    Object.assign(this.ruleForm, params);
    this.getClassify();
  },
  methods: {
    changeColor(item) {
      if (this[`color${item}`] === null) {
        this[`color${item}`] = "#555555";
      }
    },
    getClassify() {
      Promise.all([
        ApiClassifyManage.select({ labelType: this.ruleForm.labelType }),
        ApiNursingIdentifyManage.selectAll(),
        ApiPatientManage.select({ labelType: 301 }),
        ApiNursingManage.selectAssess(),
      ])
        .then((res) => {
          this.classify_data = res[0].data || [];
          this.identify_data = res[1].data || [];
          this.patient_data = res[2].data || [];
          this.assess_data = res[3].data || [];

          // 二级评估初始
          if (this.ruleForm.relationField) {
            for (let i = 0; i < this.assess_data.length; i++) {
              if (this.assess_data[i].assId === this.ruleForm.relationField) {
                this.assess_child_data = this.assess_data[i]["levelList"]
                  ? this.assess_data[i]["levelList"].split(",")
                  : [];
                break;
              }
            }
          }

          if (this.ruleForm.relationField) {
            if (this.ruleForm.dataSources === 1) {
              this.handlerPatientChange(this.ruleForm.relationField, false);
            } else if (this.ruleForm.dataSources === 1) {
              this.handlerAssessChange(this.ruleForm.relationField, false);
            }
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    submitForm() {
      let _formData = JSON.parse(JSON.stringify(this.ruleForm));

      // _formData['boardShowValue'] = _formData['boardShowValue'].join(',')
      _formData["classId"] = _formData["classId"].join(",");
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let obj = {};
          _formData["boardShowValue"].map((item) => {
            switch (item) {
              case "4":
                obj["4"] = `${this.color4 ? this.color4 : ""};${this.relation}`;
                break;
              default:
                obj[item] = this[`color${item}`] ? this[`color${item}`] : "";
                break;
            }
          });

          _formData["boardShowValue"] = JSON.stringify(obj);

          ApiNursingManage.save(_formData)
            .then(() => {
              this.$message.success("保存正确！");
              this.close();
            })
            .catch((res) => {
              this.$message.error(res.message);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handlerPatientChange(val, reset) {
      if (val && !this.isRelationDisabled && !this.relation) {
        this.relation = val;
      }
      reset !== false && (this.ruleForm.relationValue = "");
      if (val === "nurseLevel") {
        ApiNurseLevel.select({ deptId: this.deptId })
          .then((res) => {
            let arr = [];
            const list = res.data || [];
            for (let i = 0; i < list.length; i++) {
              arr.push({
                name: list[i].nurseLevelName,
                id: list[i].nurseLevelId,
              });
            }
            this.patient_data2 = { item: arr };
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        for (let i = 0; i < this.patient_data.length; i++) {
          if (this.patient_data[i].labelSql === val) {
            this.patient_data2 = this.patient_data[i]["labelShowInfo"]
              ? JSON.parse(this.patient_data[i]["labelShowInfo"])
              : { item: [] };
            break;
          }
        }
      }
    },
    handlerAssessChange(val, reset) {
      reset !== false && (this.ruleForm.relationValue = "");
      for (let i = 0; i < this.assess_data.length; i++) {
        if (this.assess_data[i].assId === val) {
          this.assess_child_data = this.assess_data[i]["levelList"]
            ? this.assess_data[i]["levelList"].split(",")
            : [];
          break;
        }
      }
    },
    handleRelationType(val) {
      if (this.ruleForm.dataSources === 1) {
        this.isRelationCheckBoxDisabled = false;
      } else {
        this.isRelationCheckBoxDisabled = true;
        this.ruleForm.boardShowValue.splice(
          this.ruleForm.boardShowValue.indexOf("4"),
          1
        );
        this.isRelationDisabled = true;
        this.relation = "";
      }
      this.ruleForm.relationField = "";
      this.ruleForm.relationValue = "";
      this.ruleForm.labelSql = "";
    },
    handleInputType(val) {
      if (val === 1) {
        this.ruleForm.dataSources = 3;
      } else {
        this.ruleForm.dataSources = 1;
        this.ruleForm.boardUpdate = 0;
      }
      this.handleRelationType();
    },
    handleIsShowStatus(val) {
      if (val === 1) {
      } else {
        this.ruleForm.boardUpdate = 0;
      }
      this.handleRelationType();
    },
    // 重置表单 & 关闭窗体
    close() {
      this.$emit("changed", "list1");
    },
    /**
     * @description: 当信息看板显示样式变化时
     * @param {*}
     * @return {*}
     */
    changeBoardShowValue(value) {
      if (value.indexOf("4") >= 0) {
        this.isRelationDisabled = false;
        if (!this.relation) {
          this.relation = this.ruleForm.relationField;
        }
      } else {
        this.isRelationDisabled = true;
        this.relation = "";
      }
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";

/deep/ .display-checkbox {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-checkbox {
    display: block;
  }
  .checkbox-label {
    display: flex;
    align-items: center;
  }
  .checkbox-color-label {
    color: #606266;
  }

  .checkbox-color-label-value {
    margin-left: 15px;
  }
  .checkbox-label-name {
    width: 100px;
  }
  .checkbox-color {
    display: flex;
    align-items: center;
  }
  .checkbox-relation {
    display: flex;
    align-items: center;
    margin-left: 50px;
    margin-bottom: -35px;
    .el-form-item__error {
      margin-left: 100px;
    }
  }
}
</style>
