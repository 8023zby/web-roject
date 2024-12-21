<template>
  <el-container>
    <el-main>
      <el-form
        ref="configContent"
        :model="configContent"
        :rules="rules"
        label-width="160px"
      >
        <el-form-item label="呼叫悬浮按钮" prop="name">
          <el-switch
            v-model="configContent.isCallBedSide"
            :active-color="switchActiveColor"
          />
        </el-form-item>
        <el-form-item label="娱乐设置" prop="name">
          <el-checkbox-group v-model="configContent.isIPTVBedSide">
            <el-checkbox label="电视点播" />
            <el-checkbox label="电视直播" />
            <el-checkbox label="微信" />
            <el-checkbox label="浏览器" />
            <el-checkbox label="腾讯视频" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="长者隐私" prop="name">
          <el-checkbox v-model="configContent.isFilterNameBedSide"
            >姓名保护</el-checkbox
          >
          <el-checkbox v-model="configContent.isElderDetail"
            >长者详情</el-checkbox
          >
        </el-form-item>
        <div class="el-form-item-left">
          <el-form-item label="床头卡设置">
            <el-switch
              v-model="configContent.isStandbyBedSide"
              :active-color="switchActiveColor"
            />
            屏幕无操作
          </el-form-item>
          <el-form-item prop="isStandbyTimeBedSide">
            <el-input
              v-model.trim="configContent.isStandbyTimeBedSide"
              type="text"
              maxlength="3"
              :disabled="!configContent.isStandbyBedSide"
              class="w60"
            />
            秒后自动显示床头卡
            <!-- TODO: 设置项开关为开，其输入框默认为30，输入限制为300以内正整数 -->
          </el-form-item>
        </div>
        <el-form-item label="护理员端设置" prop="backDurationBedSide">
          屏幕无操作
          <el-input
            v-model.trim="configContent.backDurationBedSide"
            type="text"
            maxlength="4"
            class="w60"
          />
          秒后自动返回长者首页
          <!-- TODO: 默认为60，输入限制为1000以内正整数 -->
        </el-form-item>
        <el-form-item label="分机音量" prop="name">
          <el-row :gutter="10">
            <el-col
              v-for="(o, index) in 4"
              :key="o"
              :xs="12"
              :sm="6"
              :md="5"
              :lg="5"
              :xl="4"
              style="margin-bottom: 10px"
            >
              <el-card
                :body-style="{ padding: '0px' }"
                shadow="never"
                style="padding: 10px;"
              >
                <el-time-picker
                  v-model="configContent.volumeBedSide[index].Time"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  :clearable="false"
                  style="width:100%"
                />
                <el-select
                  v-model="configContent.volumeBedSide[index].Vol"
                  placeholder="请选择音量"
                  style="width:100%; margin-top: 10px"
                >
                  <el-option
                    v-for="item in volumeOptionsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="分机亮度" prop="name">
          <el-row :gutter="10">
            <el-col
              v-for="(o, index) in 4"
              :key="o"
              :xs="12"
              :sm="6"
              :md="5"
              :lg="5"
              :xl="4"
              style="margin-bottom: 10px"
            >
              <el-card
                :body-style="{ padding: '0px' }"
                shadow="never"
                style="padding: 10px;"
              >
                <el-time-picker
                  v-model="configContent.lightBedSide[index].Time"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  :clearable="false"
                  style="width:100%"
                />
                <el-select
                  v-model="configContent.lightBedSide[index].Light"
                  placeholder="请选择亮度"
                  style="width:100%; margin-top: 10px"
                >
                  <el-option
                    v-for="item in lightOptionsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="定时重启" prop="name">
          <el-switch
            v-model="configContent.autoRestartBedSide.state"
            :active-color="switchActiveColor"
          />
          每天
          <el-time-picker
            v-model="configContent.autoRestartBedSide.time"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            :clearable="false"
            :disabled="!configContent.autoRestartBedSide.state"
            class="w120"
          />
          自动重启
        </el-form-item>
      </el-form>
      <el-row class="top-24" style="text-align: center">
        <el-button
          type="primary"
          @click.prevent.stop="saveConfig(deviceConfigName)"
          >保存</el-button
        >
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import "./systemConfig.css";
import configMixin from "./mixin";

export default {
  name: "YLSideConfig",
  mixins: [configMixin],
  data() {
    return {
      // 弹窗是否显示
      dialogVisible: false,
      // 配置页面名称
      deviceConfigName: "YLSideConfig",
      // 配置内容
      configContent: {
        isCallBedSide: true,
        isIPTVBedSide: ["电视点播", "电视直播", "微信", "浏览器", "腾讯视频"],
        isCheckResultBedSide: true,
        isCheckoutResultBedSide: true,
        isFilterNameBedSide: true,
        isElderDetail: true,
        isStandbyBedSide: true,
        isStandbyTimeBedSide: "30",
        backDurationBedSide: "300",
        volumeBedSide: [
          {
            Time: "08:00:00",
            Vol: "10"
          },
          {
            Time: "12:00:00",
            Vol: "8"
          },
          {
            Time: "14:00:00",
            Vol: "10"
          },
          {
            Time: "18:00:00",
            Vol: "6"
          }
        ],
        lightBedSide: [
          {
            Time: "08:00:00",
            Light: "50"
          },
          {
            Time: "12:00:00",
            Light: "50"
          },
          {
            Time: "14:00:00",
            Light: "50"
          },
          {
            Time: "18:00:00",
            Light: "50"
          }
        ],
        autoRestartBedSide: {
          state: false,
          time: "08:00:00"
        }
      }
    };
  }
};
</script>
<style lang="scss">
.bedCardTemp .el-radio {
  .el-radio__input {
    display: none;
  }

  &.is-checked .el-card {
    border: 1px solid blue;
  }
}

.el-form-item-left {
  .el-form-item {
    display: inline-flex;

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>
