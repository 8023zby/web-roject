<template>
  <div v-loading="loading" class="container">
    <div class="nrms_add_form">
      <div class="title">{{ form_type_text }}体征项</div>
      <div class="container">
        <el-form
          :model="sign_form"
          :rules="rules"
          ref="sign_form"
          label-width="120px"
        >
          <el-row>
            <el-col :xl="8" :lg="8" :md="12" >
              <el-form-item label="体征项名称" prop="signItemName">
                <el-input
                  v-model="sign_form.signItemName"
                  placeholder=""
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" >
              <el-form-item label="显示名称" prop="signItemShowName">
                <el-input
                  v-model="sign_form.signItemShowName"
                  placeholder=""
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" >
              <el-form-item label="单位" prop="signItemUnit">
                <el-input
                  v-model="sign_form.signItemUnit"
                  placeholder=""
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :xl="8" :lg="8" :md="12" >-->
            <!--<el-form-item label="存储方式" prop="signStorageType">-->
            <!--<el-select-->
            <!--v-model="sign_form.signStorageType"-->
            <!--placeholder=""-->
            <!--autocomplete="off"-->
            <!--clearable-->
            <!--&gt;-->
            <!--<el-option label="" value=""></el-option>-->
            <!--<el-option-->
            <!--v-for="(value, key) in sign_config.storage_type"-->
            <!--:label="value"-->
            <!--:value="+key"-->
            <!--:key="key"-->
            <!--&gt;</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <!--</el-col>-->
            <el-col :xl="8" :lg="8" :md="12" >
              <el-form-item label="适用类别" prop="patientAgeType">
                <el-select
                  v-model="sign_form.patientAgeType"
                  placeholder=""
                  autocomplete="off"
                  clearable
                >
                  <el-option label="" value=""></el-option>
                  <el-option
                    v-for="(value, key) in sign_config.suit_type"
                    :label="value"
                    :value="+key"
                    :key="key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="12" >
              <el-form-item label="字段名称" prop="signFieldName">
                <el-input
                  v-model="sign_form.signFieldName"
                  placeholder=""
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="是否为出入项" prop="signInOutType">
            <el-radio-group
              v-model="sign_form.signInOutType"
            >
              <el-radio
                v-for="(value, key) in sign_config.inout_item"
                :label="+key"
                :key="key"
              >{{ value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否为汇总项" prop="signSummaryType">
            <el-radio-group
              v-model="sign_form.signSummaryType"
            >
              <el-radio
                :disabled="sign_form.signInOutType === 1 ? false : true "
                v-for="(value, key) in sign_config.gather_item"
                :label="+key"
                :key="key"
              >{{ value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label=" " prop="relationJson">
            <el-select
              v-model="sign_form.relationJson"
              multiple
              placeholder="请选择关联体征"
              :disabled="((sign_form.signSummaryType !== 2 && sign_form.signSummaryType !== 3) || sign_form.signInOutType !== 1) ? true : false "
            >
              <el-option
                v-for="item in relation_sign"
                :label="item.signItemName"
                :value="item.signId"
                :key="item.signId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配置项" prop="dropdownConfig2" >
            <el-input clearable type="textarea" v-model="sign_form.dropdownConfig2"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark" >
            <el-input clearable v-model="sign_form.remark" style="width: 80%; max-width: initial"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="submitForm"
            >保存</el-button
            >
            <el-button type="gray" size="small" @click="close()"
            >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { ApiSignItem } from "../../../api/nrms/index";
  import { sign as sign_config } from "../../../assets/nrms/common/item_config";

  export default {
    name: "sign_item_add",
    props:["rowData"],
    data() {
      return {
        sign_config,
        loading: false,
        form_type_text: "",
        relation_sign: [],
        sign_form: {
          signItemName: "",
          signItemShowName: "",
          signItemUnit: "",
          // signStorageType: "",
          patientAgeType: 1,
          signFieldName: "",
          signInOutType: 1,
          signSummaryType: null,
          relationJson: [],
          dropdownConfig: null,
          dropdownConfig2: "",
          remark: ""
        },
        rules: {
          signItemName: [
            { required: true, message: "请输入体征项名称！", trigger: "blur" },
            {
              min: 1,
              max: 32,
              message: "长度在 1 到 32 个字符！",
              trigger: "blur"
            }
          ],
          signFieldName:[
            { required: true, message: "请输入字段名称！", trigger: "blur" },
            {
              min: 1,
              max: 100,
              message: "长度在 1 到 100 个字符！",
              trigger: "blur"
            }
          ],
          signItemShowName: [
            { required: true, message: "请输入显示名称！", trigger: "blur" },
            {
              min: 1,
              max: 32,
              message: "长度在 1 到 32 个字符！",
              trigger: "blur"
            }
          ],
          signInOutType: [
            { required: true, message: "请选择是否为出入项！", trigger: "blur" }
          ],
          signItemUnit: [
            // { required: true, message: "请输入单位！", trigger: "blur" },
            {
              min: 1,
              max: 10,
              message: "长度在 1 到 10 个字符！",
              trigger: "blur"
            }
          ],
          // signStorageType: [
          //   { required: true, message: "请选择存储方式！", trigger: "blur" }
          // ],
          remark: [
            {
              min: 1,
              max: 32,
              message: "长度在 1 到 32 个字符！",
              trigger: "blur"
            }
          ]
        }
      };
    },
    created() {
      let params = this.rowData;
      this.form_type_text = params && params["signId"] ? "编辑" : "添加";
      params && params.dropdownConfig && (params.dropdownConfig2 = params.dropdownConfig.join("\n"));
      // params && params.relationJson && (params.relationJson = JSON.parse(params.relationJson));
      Object.assign(this.sign_form, params);
    },
    methods: {
      getRelationItem (type){
        ApiSignItem.selectRelation({inOutType: type})
          .then(res => {
            this.relation_sign = res.data;
          })
          .catch(res => {
            this.$message.error(res.message);
          });
      },
      submitForm() {
        this.$refs.sign_form.validate(valid => {
          if (valid) {
            this.sign_form.relationJson = JSON.stringify(this.sign_form.relationJson);
            if(this.sign_form.dropdownConfig2) {
              this.sign_form.dropdownConfig = JSON.stringify(this.sign_form.dropdownConfig2.split("\n"))
            }else {
              this.sign_form.dropdownConfig = null;
            }

            //新建的也就是非初始化的存储方式只能是按天
            if(this.form_type_text === '添加'){
              this.sign_form.signStorageType = 3;
            }

            ApiSignItem.save(this.sign_form)
              .then(() => {
                this.$message.success("保存正确！");
                this.close();
              })
              .catch(res => {
                this.$message.error(res.message);
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      //关闭
      close() {
        this.$emit("option-changed", "list")
      }
    },
    watch: {
      "sign_form.signInOutType" (val){
        if(val !== 1) {
          this.sign_form.signSummaryType = null;
          this.relation_sign = [];
        };
      },
      "sign_form.signSummaryType" (val, oval){
        if (!val || val === 1) {
          this.relation_sign = [];
        }else {
          this.getRelationItem(val)
        }
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
</style>
