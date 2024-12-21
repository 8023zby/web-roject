<template>
  <div class="container" v-loading="loading">
    <div class="title">MEWS项目设置<span>(分值区间包含"等于",即:最小值≤X≤最大值)</span></div>
    <div class="formContent">
      <div>
        <el-form v-uni="'mews_form'" ref="MewsManageModel" :model="MewsManageModel" label-width="110px">
          <ul>
            <li v-for="(key, keyIndex) in settingKey" :key="keyIndex">
              <div style="display: flex; align-item: center">
                <span class="key">{{ EMewsTypeText[key] }}：</span>
                <i class="el-icon-circle-plus-outline iconAddCls-item" @click="addScore(key)"></i>
              </div>
              <el-row>
                <el-col :span="12" v-for="(item, index) in MewsManageModel[key]" :key="index" class="colStyle">
                  <div>
                    <el-form-item :label=" `分值区间${++index}：`" v-if="key !== 'consciousness'">
                      <el-input v-uni:[MewsManageModel[key]]="'mews_fenzhiqujianzuixiaozhi'" style="width: 150px" v-model="item.min" placeholder="最小值" maxlength="5"></el-input>
                      <span style="margin: 0px 0 0 10px">至：</span>
                      <el-input v-uni:[MewsManageModel[key]]="'mews_fenzhiqujianzuidazhi'" style="width: 150px" v-model="item.max" placeholder="最大值" maxlength="5"></el-input>
                    </el-form-item>
                    <el-form-item :label=" `分值区间${++index}：`" v-else>
                      <el-input v-uni:[MewsManageModel[key]]="'mews_fenzhiqujian'" style="width: 335px" v-model="item.yishi" placeholder="请输入"></el-input>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="分数：" label-width="70px">
                      <el-input v-uni:[MewsManageModel[key]]="'mews_fenshu'" style="width: 150px" v-model="item.score" placeholder="请输入"></el-input>
                    </el-form-item>
                  </div>
                  <div>
                    <i class="el-icon-remove-outline iconDelCls-item" @click="delScore(key, item)" style="margin-top: 3px;"></i>
                  </div>
                </el-col>
              </el-row>
            </li>
            <div style="display: flex;align-item: center;padding-left: 30px;">
              <span style="display: flex;align-item: center">MEWS总分区间设置：</span>
              <i class="el-icon-circle-plus-outline iconAddCls-item" @click="addScore('total')" style="margin: 0;"></i>
            </div>
            <div class="title"><span>说明：分值区间包含“等于”，即：最小值≤x≤最大值</span></div>
            <li v-for="(item, index) in MewsManageModel.total" :key="'total'+index" style="padding-top: 20px;">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`风险等级${++index}：`">
                    <el-input v-uni:[index]="'mews_totalfengxiandengji'" style="width: 335px" v-model="item.level" maxlength="10" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="分值区间：" label-width="70px">
                    <el-input v-uni:[index]="'mews_totalfenzhiqujianzuixiaozhi'" style="width: 150px" v-model="item.min" placeholder="最小值" maxlength="5"></el-input>
                    <span style="margin: 0px 0 0 10px">至：</span>
                    <el-input v-uni:[index]="'mews_totalfenzhiqujianzuidazhi'" style="width: 150px" v-model="item.max" placeholder="最大值" maxlength="5"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="颜色：" label-width="50px">
                    <el-input v-uni:[index]="'mews_totalyanse'" style="width: 150px" :value="item.color" />
                    <el-color-picker v-uni:[index]="'mews_totalyansepicker'" v-model="item.color" style="margin-left: 12px;"></el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="height: 32px; display: flex; align-items: center">
                  <i class="el-icon-remove-outline iconDelCls-item" @click="delScore('total',item)" style="margin-top: 0;"></i>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="建议措施：">
                  <el-col :span="19">
                    <el-input v-uni="'mews_jianyicuoshi'" type="textarea" v-model="item.suggestion" placeholder="请输入" style="width: 1065px;" maxlength="100" show-word-limit>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-row>
            </li>
          </ul>
        </el-form>
      </div>

    </div>
    <div class="footer">
      <el-button type="primary" @click="saveData" v-uni="'mews_save'">保存</el-button>
    </div>
  </div>
</template>
<script>
import { EMewsTypeText } from "./enum";
import { ApiMewsManage } from "../../../api/nrms/index";
const settingKey = [
  "temperature",
  "heartRate",
  "breath",
  "pressure",
  "consciousness",
];
export default {
  data() {
    return {
      MewsManageModel: {},
      settingKey,
      EMewsTypeText,
      loading: false,
      vaildFlag: true,
    };
  },
  created() {
    this.getDefaultSettings();
    console.log(JSON.stringify(this.MewsManageModel));
  },
  methods: {
    getDefaultSettings() {
      this.loading = true;
      ApiMewsManage.select()
        .then((res) => {
          this.loading = false;
          this.MewsManageModel = res.data || {};
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.message);
        });
    },
    addScore(key) {
      if (this.MewsManageModel[key].length >= 10) {
        this.$message.error("每个项目最多支持添加10个分值区间");
        return;
      }
      this.MewsManageModel[key].push({
        type: key,
        min: null,
        max: null,
        yishi: null,
        score: null,
        sort: this.MewsManageModel[key].length + 1,
        level: null,
        color: null,
        suggestion: null,
      });
    },
    delScore(key, item) {
      if (this.MewsManageModel[key].length <= 1) {
        this.$message.error("每个项目最少须保留一个分值区间");
        return;
      }
      let index = this.MewsManageModel[key].indexOf(item);
      this.MewsManageModel[key].splice(index, 1);
    },
    saveData() {
      this.validDate();
      if (this.vaildFlag) {
        ApiMewsManage.save(this.MewsManageModel)
          .then(() => {
            this.$message.success("保存正确！");
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      }
    },
    validDate() {
      let minMaxArr = [];
      // 验证 分值区间须最小值≤最大值
      Object.keys(this.MewsManageModel).forEach((key) => {
        // 验证除了意识以外的分值区间（ps:意识是文本输入，无需验证最小值≤最大值）
        if (key !== "consciousness") {
          this.MewsManageModel[key].forEach((item) => {
            let _item = {};
            _item["min"] = item["min"] || null;
            _item["max"] = item["max"] || null;
            minMaxArr.push(_item);
          });
        }
      });
      // console.log(minMaxArr)
      for (let i = 0; i < minMaxArr.length; i++) {
        // 注意  如果字符串的第一个字符不能被转换为数字，那么 parseFloat() 会返回 NaN ,parseFloat("He was 40")  返回  NaN
        let min = minMaxArr[i]["min"];
        let max = minMaxArr[i]["max"];
        if ((min && isNaN(min)) || (max && isNaN(max))) {
          this.vaildFlag = false;
          this.$message.error("除意识外分值区间只能录入数字，请检查！");
          return;
        } else {
          this.vaildFlag = true;
        }
        let _min = parseFloat(min);
        let _max = parseFloat(max);
        if (_min && _max && _max < _min) {
          this.vaildFlag = false;
          this.$message.error("分值区间须最小值≤最大值，请检查！");
          return;
        } else {
          this.vaildFlag = true;
        }
      }
      // 验证区间不能有重合
      for (let key in this.MewsManageModel) {
        if (key !== "consciousness") {
          // this.parseKeyData(key)
          let arrModel = [];
          for (let i = 0; i < this.MewsManageModel[key].length; i++) {
            let item = this.MewsManageModel[key][i];
            let min = parseFloat(item.min || "0");
            let max = parseFloat(item.max || "99999");
            let tempArr = [min, max];
            arrModel.push(tempArr);
            // console.log('tempArr:', tempArr, tempArr1)
          }
          if (this.isIntersect(arrModel)) {
            this.vaildFlag = false;
            let message =
              key === "total" ? "MEWS总分区间设置" : EMewsTypeText[key];
            this.$message.error(`${message}分值区间有重合，请检查！`);
            return;
          } else {
            this.vaildFlag = true;
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
  },
};
</script>
<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 38px;
  box-sizing: border-box;
  .title {
    height: 21px;
    font-size: 16px;
    color: #666;
    margin-left: 30px;
    span {
      font-size: 12px;
      color: #999;
    }
  }
  .formContent {
    margin: 12px 0 0 30px;
    flex: 1;
    height: 0;
    overflow: auto;
    > div {
      width: 1492px;
      border: 1px solid #eeeeee;
      margin-bottom: 60px;
      padding: 0px 20px;
      .el-form {
        /deep/ .el-form-item {
          .el-form-item__label {
            padding: 0;
          }
          .el-form-item__content {
            display: flex;
            .el-textarea__inner {
              padding-bottom: 28px;
              border-radius: 2px;
            }
          }
        }
      }
    }
    ul li {
      margin: 20px 0;
      background: #f4f4f5;
      border-radius: 2px;
      padding: 10px 0;
      .colStyle {
        display: flex;
        flex-direction: row;
      }
    }
  }
  .footer {
    width: 100%;
    height: 55px;
    border-top: 1px solid #eeeeee;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-button {
      font-size: 14px;
    }
    .el-button + .el-button {
      margin-left: 15px;
    }
  }
}
.key {
  height: 32px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  box-sizing: border-box;
}
.iconAddCls-item {
  font-size: 24px;
  color: #409eff;
  cursor: pointer;
  margin: 5px 0 30px 0;
  vertical-align: top;
}
.iconDelCls-item {
  font-size: 24px;
  color: #f56c6c;
  cursor: pointer;
  margin-left: 10px;
  vertical-align: top;
}
</style>
