<template>
  <layout v-loading="loading">
    <div slot="title">
      {{ form_type_text }}危急值
    </div>
    <div slot="main" class="add-from">
      <el-form v-uni="'weijizhishezhi_jianyanform'" :model="ruleForm" :rules="rules" ref="ruleForm" class="form-main-center" label-suffix="：" label-width="170px">
        <el-row>
          <el-col :lg="12" :xl="8">
            <el-form-item label="检验类型" prop="examineType">
              <el-select v-uni="'weijizhishezhi_jianyanleixing'" v-model="ruleForm.examineType" filterable clearable placeholder="请选择" @change="clearExaminUnit">
                <el-option v-for="item in item_data" :key="item.sort" :label="item.classValue" :value="item.crisisClassId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :xl="8">
            <el-form-item label="项目名称" prop="examineId">
              <el-select v-uni="'weijizhishezhi_xiangmumingcheng'" v-model="ruleForm.examineId" filterable clearable placeholder="请选择" @change="setExamineUnit">
                <el-option v-for="item in examineNameData" :key="item.crisisChildDictId" :label="item.crisisChildName" :value="item.crisisChildDictId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :xl="8">
            <el-form-item label="英文缩写" prop="examineAbridgeName">
              <el-input v-uni="'weijizhishezhi_yingwensuoxie'" v-model="ruleForm.examineAbridgeName" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :xl="8">
            <el-form-item label="单位" prop="examineUnit">
              <el-input v-uni="'weijizhishezhi_danwei'" v-model="ruleForm.examineUnit" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="启用状态" prop="isEnable">
          <el-switch v-uni="'weijizhishezhi_qiyongzhuangtai'" v-model="ruleForm.isEnable">
          </el-switch>
        </el-form-item>
        <el-form-item label="检验结果类型" prop="resultRange">
          <el-radio-group v-uni="'weijizhishezhi_jianyanjieguoleixing'" v-model="ruleForm.resultRange">
            <el-radio :label="1">数值</el-radio>
            <el-radio :label="2">阴(-)/阳(+)</el-radio>
            <el-radio :label="3">文本</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="ruleForm.resultRange===1">
          <el-form-item label="范围设置" class="items" :rules="[
                               { required: true, message: '请选择范围设置', trigger: 'blur' },
                              ]">
            <div style="display: flex;align-items: center;height: 34px;">
              <el-radio-group v-uni="'weijizhishezhi_fanweishezhi'" v-model="ruleForm.numberType.resultRange" @change="resultRangeChange">
                <el-radio :label="1">单一范围</el-radio>
                <el-radio :label="2">多种范围</el-radio>
              </el-radio-group>
              <div style="display: inline-block" v-if="ruleForm.numberType.resultRange===2">
                <i class="el-icon-circle-plus-outline iconAddCls" style="font-size: 20px; color: #1e87f0;" @click.prevent="addValue(ruleForm.resultRange)" />
              </div>
            </div>

            <template v-if="ruleForm.numberType.resultRange===2">
              <div v-for="(item,index) in ruleForm.numberType.content" style="display: flex" :key="index">
                <div class="box more">
                  <div style="color:#666;padding-left: 20px;">范围{{index+1}}</div>
                  <el-row>
                    <el-col :lg="12" :xl="8">
                      <el-form-item label="性别" label-width="100px" :prop="'numberType.content.'+index+'.sex'" :rules="[
                               { required: true, message: '请输入性别', trigger: 'blur' },
                              ]">
                        <el-select v-uni:[index]="'weijizhishezhi_xingbie'" v-model="item.sex">
                          <el-option label="男" value="男"></el-option>
                          <el-option label="女" value="女"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="12" :xl="8">
                      <!--因为设计到pda端一份报告关联多个检验项目，经过与产品沟通，在检验结果类型为数值类型时存在多种范围设置-->
                      <!--因此警戒值以及参考值得显示需要通过患者年龄进行比对到某一范围的警戒值-->
                      <!--因此设置范围中各年龄段不能重复验证规则以及年龄单位只能是一种类型-->
                      <el-form-item label="最小年龄" label-width="100px" :prop="'numberType.content.'+index+'.smallAge'" :rules="[
                               { required: true, message: '请输入最小年龄', trigger: 'blur' },
                                  { type: 'number', message: '年龄必须为数字值',trigger: 'blur' }
                              ]">
                        <el-input v-uni:[index]="'weijizhishezhi_zuixiaonianling'" v-model.number="item.smallAge" placeholder="请输入" maxlength="3" style="width: 231px;" class="noRightBorder"></el-input>
                        <el-select v-uni:[index]="'weijizhishezhi_nianlingdanwei'" v-model="item.smallAgeType" style="width:68px;" :disabled="index!==0" @change="ageTypeChange">
                          <el-option label="天" value="天"></el-option>
                          <el-option label="周" value="周"></el-option>
                          <el-option label="月" value="月"></el-option>
                          <el-option label="岁" value="岁"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="12" :xl="8">
                      <el-form-item label="最大年龄" label-width="100px" :prop="'numberType.content.'+index+'.bigAge'" :rules="[
                               { required: true, message: '请输入最大年龄', trigger: 'blur' },
                               { type: 'number', message: '年龄必须为数字值',trigger: 'blur' }
                              ]">
                        <el-input v-uni:[index]="'weijizhishezhi_zuidanianling'" v-model.number="item.bigAge" placeholder="请输入" maxlength="3" style="width: 231px;" class="noRightBorder"></el-input>
                        <el-select v-uni:[index]="'weijizhishezhi_nianlingdanwei'" v-model="item.bigAgeType" style="width:68px;" disabled>
                          <el-option label="天" value="天"></el-option>
                          <el-option label="周" value="周"></el-option>
                          <el-option label="月" value="月"></el-option>
                          <el-option label="岁" value="岁"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="12" :xl="8">
                      <el-form-item label="正常低值" label-width="100px" :prop="'numberType.content.'+index+'.normalLowValue'" :rules="[
                               { required: true, message: '请输入正常低值', trigger: 'blur' },
                                { type: 'number', message: '正常低值必须为数字值',trigger: 'blur' }
                              ]">
                        <el-input v-uni:[index]="'weijizhishezhi_zhengchangdizhi'" v-model.number="item.normalLowValue" maxlength="5" placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="12" :xl="8">
                      <el-form-item label="正常高值" label-width="100px" :prop="'numberType.content.'+index+'.normalHighValue'" :rules="[
                               { required: true, message: '请输入正常高值', trigger: 'blur' },
                                { type: 'number', message: '正常高值必须为数字值',trigger: 'blur' }
                              ]">
                        <el-input v-uni:[index]="'weijizhishezhi_zhengchanggaozhi'" v-model.number="item.normalHighValue" maxlength="5" placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="12" :xl="8">
                      <el-form-item label="警戒低值" label-width="100px">
                        <el-input v-uni:[index]="'weijizhishezhi_jingjiedizhi'" v-model="item.waringLowValue" placeholder="请输入"></el-input>
                      </el-form-item>

                    </el-col>
                    <el-col :lg="12" :xl="8">
                      <el-form-item label="警戒高值" label-width="100px">
                        <el-input v-uni:[index]="'weijizhishezhi_jingjiegaozhi'" v-model="item.waringHighValue" placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div>
                  <i class="el-icon-remove-outline iconDelCls" style="margin-top: 20px;" @click.prevent="removeValue('numberType',index)" v-show="ruleForm.numberType.content.length > 1" />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="box one">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="正常低值" label-width="100px" prop="numberType.content.normalLowValue" :rules="[
                               { required: true, message: '请输入正常低值', trigger: 'blur' },
                              ]">
                      <el-input v-uni="'weijizhishezhi_zhengchangdizhi'" v-model="ruleForm.numberType.content.normalLowValue" placeholder="请输入"></el-input>
                    </el-form-item>

                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="正常高值" label-width="100px" prop="numberType.content.normalHighValue" :rules="[
                               { required: true, message: '请输入正常高值', trigger: 'blur' },
                              ]">
                      <el-input v-uni="'weijizhishezhi_zhengchanggaozhi'" v-model="ruleForm.numberType.content.normalHighValue" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="警戒低值" label-width="100px">
                      <el-input v-uni="'weijizhishezhi_jingjiedizhi'" v-model="ruleForm.numberType.content.waringLowValue" placeholder="请输入"></el-input>
                    </el-form-item>

                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="警戒高值" label-width="100px">
                      <el-input v-uni="'weijizhishezhi_jingjiegaozhi'" v-model="ruleForm.numberType.content.waringHighValue" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-form-item>
        </template>
        <!--检验结果类型-阴-阳+-->
        <template v-if="ruleForm.resultRange===2">
          <el-form-item class="items">
            <div class="box one" style="margin-top: 0;">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="正常值" label-width="100px" prop="yinYangType.normalValue" :rules="[
                               { required: true, message: '请输入正常值', trigger: 'blur' },
                              ]">
                    <el-select v-uni="'weijizhishezhi_yinyangzhengchangzhi'" v-model="ruleForm.yinYangType.normalValue">
                      <el-option label="阴性/-" value="阴性/-"></el-option>
                      <el-option label="阳性/+" value="阳性/+"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="危急值" label-width="100px" prop="yinYangType.crisisValue" :rules="[
                               { required: true, message: '请输入危急值', trigger: 'blur' },
                              ]">
                    <el-select v-uni="'weijizhishezhi_yinyangweijizhi'" v-model="ruleForm.yinYangType.crisisValue">
                      <el-option label="阴性/-" value="阴性/-"></el-option>
                      <el-option label="阳性/+" value="阳性/+"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </template>
        <!--检验结果类型-文本-->
        <template v-if="ruleForm.resultRange===3">
          <el-form-item class="items">
            <div class="box more" style="margin-top: 0;">
              <div style="display: flex">
                <div style="color:#666;padding-left: 20px;"><span style="color: #F56C6C;margin-right:4px">*</span>危急值</div>
                <div style="padding: 2px 0 0 10px;">
                  <i class="el-icon-circle-plus-outline iconAddCls" style="font-size: 20px; color: #1e87f0;" @click.prevent="addValue(ruleForm.resultRange)" />
                </div>
              </div>
              <el-form-item v-for="(item, index) in ruleForm.textType" :label="'关键词'+ (index + 1)" :key="item.key" :prop="'textType.' + index + '.value'" :rules="[{
                                    validator: valueRule(),
                                    trigger: 'blur'
                                }]" label-width="90px">
                <el-input v-uni:[index]="'weijizhishezhi_guanjianzhi'" v-model="item.value" placeholder="请输入" maxlength="20"></el-input>
                <i class="el-icon-remove-outline iconDelCls" @click.prevent="removeValue('textType',index)" v-show="ruleForm.textType.length > 1" />
              </el-form-item>
            </div>
          </el-form-item>
        </template>
        <el-form-item label="临床意义及措施" prop="examineMeasures">
          <el-input v-uni="'weijizhishezhi_linchuangyiyi'" type="textarea" :rows="6" style="width:93%" maxlength="1000" show-word-limit v-model="ruleForm.examineMeasures" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button size="small" @click="close" v-uni="'weijizhishezhi_jianyancancel'">
        取消
      </el-button>
      <el-button type="primary" size="small" @click="submitForm" v-uni="'weijizhishezhi_jianyansave'">
        保存
      </el-button>
    </div>
  </layout>
</template>

<script>
import {
  ApiCriticalValueExamine,
  ApiDangerClassify,
  ApiChildDangerDictionary,
} from "../../../api/nrms/index";
import layout from "../../../components/nrms/layout/edit";

export default {
  name: "critical_value_inspect_add",
  components: { layout },
  data() {
    return {
      loading: false,
      rowDataParams: {},
      form_type_text: "",
      item_data: [],
      examineNameData: [],
      defaultAgeType: "岁",
      ruleForm: {
        examineId: "",
        examineType: "",
        examineName: "",
        examineAbridgeName: "",
        examineUnit: "",
        isEnable: true,
        resultRange: 1,
        // 检验结果类型-数值
        numberType: {
          resultRange: 1, // 范围设置
          content: {
            normalLowValue: "", // 正常低值
            normalHighValue: "", // 正常高值
            waringLowValue: "", // 警戒低值
            waringHighValue: "", // 警戒高值
          },
        },
        // 检验结果类型-阴阳
        yinYangType: {
          normalValue: "阴性/-",
          crisisValue: "阳性/+",
        },
        // 检验结果类型-文本
        textType: [{ value: "" }, { value: "" }, { value: "" }],
        examineMeasures: "",
      },
      vaildFlag: true,
      rules: {
        examineType: [
          { required: true, message: "请选择检验类型！", trigger: "change" },
        ],
        examineId: [
          {
            required: true,
            message: "请选择检验项目名称！",
            trigger: "change",
          },
        ],
        isEnable: [],
        resultRange: [
          { required: true, message: "请选择检验结果类型", trigger: "change" },
        ],
        examineMeasures: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 1000) {
                callback(new Error("临床意义及措施不能超过1000个字符！"));
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
    this.rowDataParams = JSON.parse(JSON.stringify(this.detail));
    let params = this.rowDataParams || {};
    this.form_type_text = params["examineSetId"] ? "编辑" : "添加";
    Object.assign(this.ruleForm, params);
    params["examineSetId"] && this.initData(this.ruleForm.resultRange);
    if (
      params["examineSetId"] &&
      params["resultRange"] === 1 &&
      params["criticalValue"].resultRange === 2
    ) {
      this.defaultAgeType = params["criticalValue"].content[0].smallAgeType;
    } else {
      this.defaultAgeType = "岁";
    }
    this.getItemData();
  },
  methods: {
    initData(val) {
      switch (val) {
        case 1:
          this.ruleForm.numberType = this.rowDataParams.criticalValue;
          break;
        case 2:
          this.ruleForm.yinYangType = this.rowDataParams.criticalValue;
          break;
        case 3:
          this.ruleForm.textType = this.rowDataParams.criticalValue;
          break;
      }
    },
    // 获取检验类型
    getItemData() {
      ApiDangerClassify.select({ classValue: "", classType: 2 })
        .then((res) => {
          this.item_data = res.data || [];
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    valueRule() {
      return (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入关键词！"));
        } else if (value.length > 20) {
          callback(new Error("最多20个字符！"));
        } else {
          callback();
        }
      };
    },
    addValue(type) {
      switch (type) {
        case 1:
          if (this.ruleForm.numberType.content.length >= 10) {
            this.$message.error("每个项目最多支持添加10个范围");
            return;
          }
          this.ruleForm.numberType.content.push({
            sex: "男",
            smallAge: "",
            smallAgeType: this.defaultAgeType,
            bigAge: "",
            bigAgeType: this.defaultAgeType,
            normalLowValue: "", // 正常低值
            normalHighValue: "", // 正常高值
            waringLowValue: "", // 警戒低值
            waringHighValue: "", // 警戒高值
          });
          break;
        case 3:
          if (this.ruleForm.textType.length >= 10) {
            this.$message.error("每个项目最多支持添加10个关键词");
            return;
          }
          this.ruleForm.textType.push({ value: "" });
          break;
        default:
          this.$message.error("请选择正确的检验结果类型");
          break;
      }
    },
    removeValue(type, index) {
      if (type === "numberType") {
        this.ruleForm.numberType.content.splice(index, 1);
      }
      if (type === "textType") {
        this.ruleForm.textType.splice(index, 1);
      }
    },
    selectExamineName() {
      ApiChildDangerDictionary.select({
        crisisClassId: this.ruleForm.examineType,
      }).then((res) => {
        // 根据类型查名称
        this.examineNameData = res.data || [];
      });
    },
    // 切换检验类型时将名称 缩写 单位清空
    clearExaminUnit() {
      this.ruleForm.examineId = "";
      this.ruleForm.examineAbridgeName = "";
      this.ruleForm.examineUnit = "";
    },
    setExamineUnit(id) {
      let selectId = id;
      let data = this.examineNameData.find(
        (item) => item.crisisChildDictId === selectId
      );
      this.ruleForm.examineAbridgeName = (data && data.crisisChildEnName) || "";
      this.ruleForm.examineUnit = (data && data.crisisChildUnit) || "";
      this.ruleForm.examineName = (data && data.crisisChildName) || "";
    },
    submitForm() {
      let _formData = JSON.parse(JSON.stringify(this.ruleForm));
      switch (this.ruleForm.resultRange) {
        case 1:
          _formData.criticalValue = this.ruleForm.numberType;
          break;
        case 2:
          _formData.criticalValue = this.ruleForm.yinYangType;
          break;
        case 3:
          _formData.criticalValue = this.ruleForm.textType;
          break;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 验证检验结果为数值类型-多种范围时同性别年龄段不能重复
          this.validAgeRepeat();
          if (this.vaildFlag) {
            // console.log(JSON.stringify(_formData))
            ApiCriticalValueExamine.save(_formData)
              .then(() => {
                this.$message.success("保存正确！");
                this.close();
              })
              .catch((res) => {
                this.$message.error(res.message);
              });
          } else {
            console.log("年龄字段验证error");
            return false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 验证检验结果为数值类型-多种范围时同性别年龄段不能重复
    validAgeRepeat() {
      this.vaildFlag = true;
      // 检验结果类型为数值并且是多种范围需判断年龄
      if (
        this.ruleForm.resultRange === 1 &&
        this.ruleForm.numberType.resultRange === 2
      ) {
        // 最小年龄<=最大年龄
        let newAgeObj = { 男: [], 女: [] };
        for (let i = 0; i < this.ruleForm.numberType.content.length; i++) {
          let item = this.ruleForm.numberType.content[i];
          let min = parseFloat(item.smallAge);
          let max = parseFloat(item.bigAge);
          if (max < min) {
            this.vaildFlag = false;
            this.$message.error("最小年龄值≤最大年龄值，请检查！");
            return;
          }
          // 将不同性别的对象进行归类
          if (item.sex === "男") {
            let min = parseFloat(item.smallAge);
            let max = parseFloat(item.bigAge);
            let tempArr = [min, max];
            newAgeObj["男"].push(tempArr);
          }
          if (item.sex === "女") {
            let min = parseFloat(item.smallAge);
            let max = parseFloat(item.bigAge);
            let tempArr = [min, max];
            newAgeObj["女"].push(tempArr);
          }
        }
        console.log("newAgeObj", newAgeObj);
        for (let key in newAgeObj) {
          if (newAgeObj[key].length > 0) {
            console.log("newAgeObj[key]", newAgeObj[key]);
            // 不同性别年龄区间不能有重复判断
            if (this.isIntersect(newAgeObj[key])) {
              console.log("false");
              this.vaildFlag = false;
              this.$message.error(`${key}性范围中年龄字段区间有重合，请检查！`);
              return;
            }
          } else {
            console.log("continue");
            continue;
          }
        }
      }
    },
    // 判断两个区间是否相交
    isIntersect(arr) {
      let minStart1 = 0;
      let minStart2 = 0;
      let maxEnd1 = 0;
      let maxEnd2 = 0;
      let maxStartArr = [];
      let minEndArr = [];
      for (let i = 0; i < arr.length; i++) {
        minStart1 = arr[i][0];
        maxEnd1 = arr[i][1];
        for (let t = 0; t < arr.length; t++) {
          minStart2 = arr[t][0];
          maxEnd2 = arr[t][1];
          if (i !== t) {
            // 不与自身比
            maxStartArr = [minStart1, minStart2]; // 开始课时数组
            minEndArr = [maxEnd1, maxEnd2]; // 结束课时数组
            // 判断是否有重合区间
            if (Math.max(...maxStartArr) <= Math.min(...minEndArr)) {
              return true;
            }
          }
        }
      }
    },
    resultRangeChange(val) {
      let params = this.detail || {};
      let curRange =
        (params.criticalValue && params.criticalValue.resultRange) || "";
      // console.log(val, curRange)
      if (val === curRange) {
        // console.log('val === curRange', val)
        this.ruleForm.numberType.content = params.criticalValue.content;
      } else {
        if (val === 2) {
          // 多种范围
          // console.log('val === 2', val)
          let multiRange = [
            {
              sex: "男",
              smallAge: "",
              smallAgeType: this.defaultAgeType,
              bigAge: "",
              bigAgeType: this.defaultAgeType,
              normalLowValue: "", // 正常低值
              normalHighValue: "", // 正常高值
              waringLowValue: "", // 警戒低值
              waringHighValue: "", // 警戒高值
            },
            {
              sex: "男",
              smallAge: "",
              smallAgeType: this.defaultAgeType,
              bigAge: "",
              bigAgeType: this.defaultAgeType,
              normalLowValue: "", // 正常低值
              normalHighValue: "", // 正常高值
              waringLowValue: "", // 警戒低值
              waringHighValue: "", // 警戒高值
            },
          ];
          this.ruleForm.numberType.content = JSON.parse(
            JSON.stringify(multiRange)
          );
        } else {
          // 单一范围
          // console.log('val === 1', val)
          this.ruleForm.numberType.content = {
            normalLowValue: "",
            normalHighValue: "",
            waringLowValue: "",
            waringHighValue: "",
          };
        }
      }
    },
    // 点击切换年龄单位后其余范围中的年龄单位统一按这个单位
    ageTypeChange(val) {
      this.defaultAgeType = val;
      this.ruleForm.numberType.content.forEach((item) => {
        item.bigAgeType = this.defaultAgeType;
        item.smallAgeType = this.defaultAgeType;
      });
    },
    // 重置表单 & 关闭窗体
    close() {
      this.$emit("changed", "tabs", "");
    },
  },
  watch: {
    "ruleForm.examineType": {
      handler(val) {
        this.selectExamineName();
      },
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";

.form-main-center {
  max-width: initial;
}

.items {
  > /deep/.el-form-item__content {
    .box {
      overflow: hidden;
      border: 1px solid #ebeef5;
      margin-top: 20px;
      padding: 5px 0;
    }
    .one {
      width: 58%;
      min-width: 860px;
    }
    .more {
      width: 93%;
    }
    .el-form-item {
      width: 450px;
      float: left;
      margin: 10px 0;
    }
  }
  i.iconDelCls {
    font-size: 20px;
    color: #f56c6c;
    /*margin-top: 8px; */
    margin-left: 12px;
  }
  .noRightBorder {
    /deep/.el-input__inner {
      border-right: none;
    }
  }
  .rangeRadio {
    height: 24px;
    padding-top: 10px;
  }
}
</style>
