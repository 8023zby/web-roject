<template>
  <div class="time_container">
    <el-form :rules="rules" :model="time_form">
      <el-row v-for="(item, index) in time_data" :key="index">
        <el-col :xl="5" :lg="6">
          <el-form-item :label="'测量时间' + (index + 1)" prop="takeTemperatureTime">
            <el-select
              v-model="item.takeTemperatureTime"
              placeholder=""
            >
              <el-option label="" value=""></el-option>
              <el-option
                v-for="value in 24"
                :key="value"
                :label="(value > 9 ? value : '0' + value) +':00'"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="2" :lg="2">
          <el-form-item label="颜色" prop="temperatureItemColor">
            <el-color-picker
              v-model="item.temperatureItemColor"
              :predefine="predefineColors">
            </el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6">
          <el-form-item label="所属时间段" prop="temperatureItemType">
            <el-radio-group v-model="item.temperatureItemType">
              <el-radio :label="1" >上午</el-radio>
              <el-radio :label="2" >下午</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm"
        >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { ApiSignItemSetting } from "../../../api/nrms/index";

  export default {
    name: "measure_time",
    data() {
      return {
        predefineColors: [
          '#000000',
          '#FF0000',
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585'
        ],
        time_form: {
          takeTemperatureTime: "",
          temperatureItemColor: "",
          temperatureItemType: ""
        },
        rules: {},
        time_data: []
      };
    },
    created (){
      this.getTimeItem();
    },
    methods: {
      getTimeItem() {
        this.loading = true;
        ApiSignItemSetting.selectTime()
            .then(res => {
              let data = res.data || [];
              for (let i = 0; i < 6; i++) {
                let _d = data[i] ? data[i] : {
                  takeTemperatureTime: "",
                  temperatureItemColor: '#000',
                  temperatureItemType: 1
                };
                this.time_data.push(_d)
              }
              this.loading = false;
            })
            .catch(res => {
              this.loading = false;
              this.$message.error(res.message);
            });
      },
      submitForm (){
        ApiSignItemSetting.timeSetting(this.time_data)
            .then(res => {
              this.$message.success('保存成功');
            })
            .catch(res => {
              this.$message.error(res.message);
            });
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .time_container {
    padding: 20px;
  }
</style>
