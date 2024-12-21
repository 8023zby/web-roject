<template>
  <layout v-loading="loading">
    <div slot="title">{{ form_type_text }}统计标签</div>
    <div slot="main" class="add-from">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" label-suffix=":" v-uni="'tongjibiaoqiantianjiabiaodan'">
        <el-form-item label="标签分类" prop="classId">
          <el-select v-uni="'tongjibiaoqiantianjiabiaodanfenlei'" v-model="ruleForm.classId" filterable multiple clearable placeholder="请选择">
            <el-option v-for="item in classify_data" :key="item.classId" :label="item.className" :value="item.classId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称" prop="labelName">
          <el-input v-model.trim="ruleForm.labelName" placeholder="请输入" oninput="if(value.length>16)value=value.slice(0,16)"></el-input>
        </el-form-item>
        <el-form-item label="标识内容" prop="labelShowType">

          <el-radio-group v-model="ruleForm.labelShowType" @change="ruleForm.labelShowInfo = ruleForm.labelIdentificationValueA = ruleForm.labelIdentificationValueB = ''">
            <template v-for="(value, key) in item_config.labelShowType">

              <el-radio v-if="key!=4" :key="key" :label="+key">{{ value }}
              </el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <!-- 简称 -->
        <el-form-item v-if="ruleForm.labelShowType == 2" style="margin: 0">
          <el-form-item prop="labelIdentificationValueA" style="margin: 0;width: 250px;float:left;">
            <el-input style="width: 250px" v-model="ruleForm.labelIdentificationValueA" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item prop="labelIdentificationValueB" style="margin: 0;width: 250px;float:left;margin-left: 15px;">
            <el-color-picker v-model="ruleForm.labelIdentificationValueB" :predefine="predefineColors">
            </el-color-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="ruleForm.labelShowType == 2">
          <span style="color:#999999; font-size: 12px">汉字/大写字母显示第一个，小写字母/数字显示第一二个</span>
        </el-form-item>
        <!-- 符号 -->
        <el-form-item v-if="ruleForm.labelShowType == 3">

          <el-form-item prop="labelIdentificationValueA" style="margin: 0;width: 250px;float:left;">
            <el-select style="width: 250px" v-model="ruleForm.labelIdentificationValueA" placeholder="请选择" clearable>
              <el-option v-for="(value, key) in item_config.shape" :key="key" :label="value" :value="key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="labelIdentificationValueB" style="margin: 0;width: 250px;float:left;margin-left: 15px;">
            <el-color-picker v-model="ruleForm.labelIdentificationValueB" :predefine="predefineColors">
            </el-color-picker>
          </el-form-item>
        </el-form-item>
        <!-- 图片 -->
        <el-form-item v-if="ruleForm.labelShowType == 4">
          图片库选择
        </el-form-item>
        <el-form-item label="字段/脚本" prop="labelSql">
          <el-input type="textarea" :rows="7" v-model="ruleForm.labelSql" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="查询筛选脚本" prop="labelEvent">
          <el-input type="textarea" :rows="7" v-model="ruleForm.labelEvent" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="信息看板显示样式" prop="boardShowValue">
          <el-checkbox-group v-model="ruleForm.boardShowValue">
            <el-checkbox label="1" disabled>合计信息</el-checkbox>
            <el-checkbox label="2">床位号</el-checkbox>
            <el-checkbox label="3">患者姓名</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button v-uni="'tongjibiaoqiantianjia_cancel'" size="small" @click="close()">
        取消
      </el-button>
      <el-button v-uni="'tongjibiaoqiantianjia_save'" type="primary" size="small" @click="submitForm">
        保存
      </el-button>

    </div>
  </layout>
</template>

<script>
import { ApiStatisticsManage, ApiClassifyManage } from "../../../../api/bnms";
import item_config from "../../../../assets/bnms/common/item_config";
import layout from "../../../../components/bnms/layout/edit";

export default {
  name: "statistics_add",
  components: { layout },
  data() {
    return {
      item_config,
      loading: false,
      show_labelDisplayTypeValue: false,
      classify_data: [],
      ruleForm: {
        classId: [],
        labelType: "101",
        labelName: "",
        inputType: 2,
        labelSql: "",
        labelEvent: "",
        labelShowType: 2,
        labelShowInfo: "",
        labelIdentificationValueA: "",
        labelIdentificationValueB: "#000000",
        labelIdentificationImage: { path: "" },
        boardShowValue: ["1"],
      },
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "#FC0303",
      ],
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
        labelShowType: [
          { required: true, message: "请选择标识内容！", trigger: "change" },
        ],
        labelSql: [
          { required: true, message: "请填写字段/脚本！", trigger: "blur" },
        ],
        labelIdentificationValueA: [
          {
            required: true,
            message: "请填写标识内容具体值！",
            trigger: "change",
          },
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.labelShowType === 2 && value.length > 10) {
                callback(new Error("最多10个字符！"));
              } else if (
                this.ruleForm.labelShowType === 2 &&
                value.length > 10
              ) {
                callback(new Error("最多10个字符！"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        labelEvent: [
          {
            validator: (rule, value, callback) => {
              if (
                value !== "" &&
                /\bselect\b|\bdelete\b|\binsert\b|\bupdate\b/gi.test(value)
              ) {
                callback(
                  new Error(
                    "内容不能包含select、delete、update、insert等关键词！"
                  )
                );
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: ["detail"],
  created() {
    this.getClassify();

    let params = this.detail || {};
    // 处理回显内容
    if (
      params.labelShowInfo &&
      (params.labelShowType == "2" || params.labelShowType == "3")
    ) {
      let info = params.labelShowInfo.split("|");
      params.labelIdentificationValueA = info[0];
      params.labelIdentificationValueB = info[1];
    }
    if (params.classId) {
      params.classId = params.classId.split(",");
    } else {
      params.classId = [];
    }
    if (params.boardShowValue) {
      params.boardShowValue = params.boardShowValue.split(",");
    } else {
      params.boardShowValue = ["1"];
    }
    Object.assign(this.ruleForm, params);
  },
  computed: {
    form_type_text() {
      return this.ruleForm.labelId ? "编辑" : "添加";
    },
  },
  methods: {
    getClassify() {
      ApiClassifyManage.select({ labelType: this.ruleForm.labelType })
        .then((res) => {
          this.classify_data = res.data || {};
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    submitForm() {
      let _formData = JSON.parse(JSON.stringify(this.ruleForm));
      _formData["boardShowValue"] = _formData["boardShowValue"].join(",");
      _formData["classId"] = _formData["classId"].join(",");

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          ApiStatisticsManage.save(_formData)
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
    // 重置表单 & 关闭窗体
    close() {
      this.$emit("changed", "list");
    },
  },
  watch: {
    "ruleForm.labelIdentificationValueA"(v) {
      this.ruleForm.labelShowInfo =
        v + "|" + this.ruleForm.labelIdentificationValueB;
    },
    "ruleForm.labelIdentificationValueB"(v) {
      this.ruleForm.labelShowInfo =
        this.ruleForm.labelIdentificationValueA + "|" + v;
    },
    "ruleForm.labelIdentificationImage.path"(v) {
      this.ruleForm.labelShowInfo = v + "|";
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";
</style>
