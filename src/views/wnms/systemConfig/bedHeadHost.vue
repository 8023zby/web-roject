<template>
  <el-container style="height: 100%" v-loading="yh_loading">
    <el-main>
      <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" :anchorList="[]" :disabled="deptDisabled"></deptInsideMenu>
      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
        <!-- 床头卡患者姓名保护 -->
        <el-form-item label="床头卡患者姓名保护" prop="name">
          <el-switch v-model="configContent.isFilterNameBedHead" :active-color="switchActiveColor" />
        </el-form-item>

        <!-- <el-form-item label="呼叫按钮" prop="name" >
          <el-switch v-model="configContent.isCallBedHead" :active-color="switchActiveColor" />
        </el-form-item>-->

        <!-- 二维码 -->
        <el-form-item label="床头卡二维码" prop="name">
          <el-switch v-model="configContent.QRCodeBedHead.state" :active-color="switchActiveColor" />

          <el-row v-show="configContent.QRCodeBedHead.state">
            <el-input v-model.trim="configContent.QRCodeBedHead.text" id="IDQRCodeFieldSelection" type="text" :show-word-limit="true" :disabled="!configContent.QRCodeBedHead.state" style="width: 50%; margin-right: 1rem" />
            <el-button round size="mini" @click="textField='',dialogVisibleQRCode = true">插入字段</el-button>
          </el-row>

          <el-row v-show="configContent.QRCodeBedHead.state">
            <div id="QRCodeImg"></div>
          </el-row>
        </el-form-item>
        <el-form-item label="二维码标注" prop="QRCodeLabelBedHead" v-show="configContent.QRCodeBedHead.state">
          <el-input v-model.trim="configContent.QRCodeLabelBedHead" type="text" :show-word-limit="true" style="width: 50%; margin-right: 1rem" />
        </el-form-item>

        <!-- 自动显示床头卡 -->
        <!--<div class="el-form-item-left">
          <el-form-item label="自动显示床头卡">
            <el-switch v-model="configContent.isStandbyBedHead" :active-color="switchActiveColor" />
          </el-form-item>
          <el-form-item prop="isStandbyTimeBedHead">
            &nbsp;患者端无操作
            <el-input
              v-model.trim="configContent.isStandbyTimeBedHead"
              type="text"
              maxlength="3"
              :disabled="!configContent.isStandbyBedHead"
              class="w60"
            />秒后自动显示床头卡
          </el-form-item>
        </div>-->
        <div class="el-form-item-left">
          <el-form-item label="床头卡显示模式">
            <el-radio-group v-model="configContent.new_isStandbyBedHead">
              <el-radio :label="1">不显示</el-radio>
              <el-radio :label="2">屏保显示</el-radio>
              <el-radio :label="3">一直显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="isStandbyTimeBedHead">
            &nbsp; &nbsp; &nbsp;&nbsp;患者端无操作
            <el-input v-model.trim="configContent.isStandbyTimeBedHead" type="text" maxlength="3" :disabled="configContent.new_isStandbyBedHead===1 || configContent.new_isStandbyBedHead===3" class="w60" />秒后自动显示
          </el-form-item>
        </div>

        <!-- 一直显示 -->
        <!-- <el-form-item label="一直显示" prop="name" style="margin-left: 4em">
          <el-switch v-model="configContent.isAlwaysBedHead" :active-color="switchActiveColor" :disabled="!configContent.isStandbyBedHead" />
        </el-form-item>-->

        <!-- 定时息屏时间 -->
        <div>
          <el-form-item label="定时息屏时间">
            <el-switch v-model="configContent.iscloseScreenBedHead" :active-color="switchActiveColor" />
          </el-form-item>

          <el-form-item>
            <el-time-picker v-model="configContent.closeScreenBedHead.startTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenBedHead" />-
            <el-time-picker v-model="configContent.closeScreenBedHead.endTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenBedHead" />
          </el-form-item>

          <el-form-item prop="brightViewBedHead">
            点亮屏幕
            <el-input v-model.trim="configContent.brightViewBedHead" type="text" maxlength="3" class="w60" :disabled="!configContent.iscloseScreenBedHead" />秒后自动息屏
          </el-form-item>
        </div>
        <el-form-item label="消息提醒静音时间段">
          <el-button round type="primary" size="mini" @click="onAddmessageSilence" v-if="configContent.messageSilenceBedHead.length === 0">添加</el-button>
          <section v-else>
            <div v-for="(businessHour, hourIndex) in configContent.messageSilenceBedHead" :key="hourIndex">
              <div style="white-space: nowrap;padding-bottom: 15px;">
                {{`时间${(hourIndex + 1)}：`}}
                <el-time-picker v-model="configContent.messageSilenceBedHead[hourIndex]['start']" value-format="HH:mm:ss" placeholder="开始时间">
                </el-time-picker>
                至
                <el-time-picker v-model="configContent.messageSilenceBedHead[hourIndex]['end']" value-format="HH:mm:ss" placeholder="结束时间">
                </el-time-picker>
                <div class="item-title" style="display: inline-block;margin: 0 5px;" @click="onAddmessageSilence">
                  <i class="el-icon-circle-plus-outline" style="cursor: pointer" />
                </div>
                <div class="item-title" style="display: inline-block;margin: 0 5px;" @click="removemessageSilence(hourIndex)">
                  <i class="el-icon-remove-outline" style="cursor: pointer" />
                </div>
              </div>
            </div>
          </section>
        </el-form-item>

        <!-- 呼叫开关发起的呼叫类型 -->
        <el-form-item label="呼叫开关发起">
          <el-radio v-model="configContent.kHandlerCallTypeBedHead" :label="1">语音呼叫</el-radio>
          <el-radio v-model="configContent.kHandlerCallTypeBedHead" :label="0">视频呼叫</el-radio>
        </el-form-item>

        <!-- 呼叫开关通话设置 -->
        <el-form-item label="呼叫开关通话设置">
          <el-radio v-model="configContent.answerWayBedHead" label="0">终端喇叭发声</el-radio>
          <el-radio v-model="configContent.answerWayBedHead" label="1">手柄听筒发声</el-radio>
        </el-form-item>

        <!-- 信息查询身份验证 -->
        <el-form-item label="信息查询身份验证" prop="name">
          <el-switch v-model="configContent.informationQueryAuthBedHead" :active-color="switchActiveColor" />
        </el-form-item>
        <el-form-item label="充值身份确认">
          <el-switch v-model="configContent.RechargeIdentityBedHead" :active-color="switchActiveColor" />
        </el-form-item>
        <el-form-item label="充值最小金额" prop="MinimumRechargeAmountBedHead">
          <el-input v-model.trim="configContent.MinimumRechargeAmountBedHead" type="text" maxlength="4" class="w60" />
        </el-form-item>

        <!-- 护理任务允许执行 -->
        <el-form-item label="护理任务允许执行" prop="name">
          <el-switch v-model="configContent.nursingTasksAllowedBedHead" :active-color="switchActiveColor" />
        </el-form-item>

        <!-- TODO: 准备从此模块移除 === START =================================================================== -->
        <!-- 院内服务功能 -->
        <!-- <el-form-item label="院内服务功能" prop="name">
          <el-checkbox-group v-model="configContent.isBusinessBedHead">
            <el-checkbox label="餐厅点餐" />
          </el-checkbox-group>
        </el-form-item>-->

        <!-- 查看费用 -->
        <!-- <el-form-item label="查看费用" prop="name">
          <el-switch
            v-model="configContent.isCheckCostBedHead"
            :active-color="switchActiveColor"
          />
          <el-checkbox
            v-model="configContent.isCostLevelBedHead"
            :disabled="!configContent.isCheckCostBedHead"
            >住院费别</el-checkbox
          >
          <el-checkbox
            v-model="configContent.isCostDetailsBedHead"
            :disabled="!configContent.isCheckCostBedHead"
            >费用明细</el-checkbox
          >
        </el-form-item>-->

        <!-- 导航栏 -->
        <!-- <div class="el-form-item-left">
          <el-form-item label="导航栏" prop="name">
            <el-switch
              v-model="configContent.autoBedHead"
              :active-color="switchActiveColor"
            />
            无操作
          </el-form-item>
          <el-form-item prop="autoBedHeadTime">
            <el-input
              v-model.trim="configContent.autoBedHeadTime"
              type="text"
              maxlength="3"
              :disabled="!configContent.autoBedHead"
              class="w60"
            />
            秒后自动隐藏导航栏
          </el-form-item>
        </div>-->

        <!-- 床头卡 -->
        <!-- <div class="el-form-item-left">
          <el-form-item label="床头卡">
            <el-switch
              v-model="configContent.isStandbyBedHead"
              :active-color="switchActiveColor"
            />
            无操作
          </el-form-item>
          <el-form-item prop="isStandbyTimeBedHead">
            <el-input
              v-model.trim="configContent.isStandbyTimeBedHead"
              type="text"
              maxlength="3"
              :disabled="!configContent.isStandbyBedHead"
              class="w60"
            />
            秒后自动显示床头卡
          </el-form-item>
        </div>-->
        <!-- TODO: 准备从此模块移除 == END ==================================================================== -->

        <el-form-item label="功能入口" prop="menuTree">
          <el-tree style="width:15rem" :data="sideTree" show-checkbox ref="tree" node-key="id" :default-checked-keys="menuArrayList" :props="{
              label: 'menuName',
              children: 'children',
            }"></el-tree>
        </el-form-item>

        <!-- 终端音量 -->
        <el-form-item label="终端音量" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <el-time-picker v-model="configContent.volBedHead[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }" :clearable="false" placeholder="选择时间" style="width:100%" />
                <el-select class="volume-select" v-model="configContent.volBedHead[index].Vol" placeholder="请选择音量" style="width:100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 广播音量 -->
        <el-form-item label="广播音量" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <el-time-picker v-model="configContent.radioVolumeBedHead[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }" :clearable="false" placeholder="选择时间" style="width:100%" />
                <el-select class="volume-select" v-model="configContent.radioVolumeBedHead[index].Vol" placeholder="请选择音量" style="width:100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList2" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 终端亮度 -->
        <el-form-item label="终端亮度" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                <el-time-picker v-model="configContent.lightBedHead[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }" :clearable="false" placeholder="选择时间" style="width:100%" />
                <el-select class="light-select" v-model="configContent.lightBedHead[index].Light" placeholder="请选择亮度" style="width:100%; margin-top: 10px">
                  <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 通话音量 -->
        <el-form-item label="通话音量" prop="name">
          <el-row :gutter="10">
            <el-radio-group v-model="configContent.callBedHeadSettings">
              <el-radio :label="1">上次通话音量</el-radio>
              <el-radio :label="2">分时段自动调整</el-radio>
            </el-radio-group>
          </el-row>
          <el-row :gutter="10" v-if="configContent.callBedHeadSettings==2">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.callVolumeBedHead[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" style="width: 100%" />
                <el-select class="volume-select" v-model="configContent.callVolumeBedHead[index].Vol" placeholder="请选择音量" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList2" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 系统亮度 -->
        <el-form-item label="系统亮度" prop="name">
          <el-switch v-model="configContent.bedheadBrightness.state" :active-color="switchActiveColor" />
          <el-select class="light-select" v-model="configContent.bedheadBrightness.light" placeholder="请选择亮度" :disabled="!configContent.bedheadBrightness.state" style=" margin-left: 10px">
            <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>仅针对光感原件有效
        </el-form-item>

        <!-- 护工中心设备列表 -->
        <el-form-item label="呼叫护工" prop="name">
          <el-switch v-model="configContent.isCallCenterUseHead" :active-color="switchActiveColor" />

          <div v-show="configContent.isCallCenterUseHead">
            <el-button round type="primary" size="mini" @click="onShowCallCenterDeviceList">护工设备管理</el-button>
            <span style="margin-left: 10px">已选 {{ configContent.CallCenterDeviceListHead.length }} 个设备</span>
          </div>
        </el-form-item>

        <!-- 更新床头卡 -->
        <el-form-item label="更新床头卡" prop="name">
          <el-button round size="mini" @click="dialogVisible = true">选择模板</el-button>
          <!-- <el-button
            round
            type="primary"
            size="mini"
            @click.prevent.stop="rebootEC(deviceConfigName, 'updateBedCard')"
            >更新</el-button
          >-->
        </el-form-item>

        <!-- 重启终端 -->
        <el-form-item label="重启终端" prop="name">
          <el-button round type="primary" size="mini" @click="rebootEC(deviceType.ecBedHeadExtension)">重启</el-button>
        </el-form-item>

        <!-- 定时重启 -->
        <el-form-item label="定时重启" prop="name">
          <el-switch v-model="configContent.autoRestartBedHead.state" :active-color="switchActiveColor" />每天
          <el-time-picker v-model="configContent.autoRestartBedHead.time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" :disabled="!configContent.autoRestartBedHead.state" class="w120" />时间，自动重启
        </el-form-item>

        <!-- 终端设置 -->
        <el-form-item label="终端设置">
          <el-switch v-model="configContent.deviceSettingBedHead" :active-color="switchActiveColor" />
        </el-form-item>
        <!-- 门灯调度 -->
        <!-- <el-form-item label="门灯调度" prop="name">
          <el-switch v-model="configContent.doorLampOpenBedHead" :active-color="switchActiveColor" />
        </el-form-item>
        测试提出去除
        <el-form-item label="呼叫被值班室屏蔽" prop="name">
          <el-switch v-model="configContent.bedHeadCallScreening" :active-color="switchActiveColor" />
        </el-form-item> -->
        <!--宣教音视频自动播放配置开关-->
        <el-form-item label="宣教音视频自动播放" prop="name">
          <el-switch v-model="configContent.eduAutoPlayBedhead" :active-color="switchActiveColor" />
        </el-form-item>
        <el-form-item label="宣教样式" v-if="false">
          <el-radio-group v-model="configContent.eduStyleBedHead">
            <el-radio label="list">列表</el-radio>
            <el-radio label="jiugongge">九宫格</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 保存 -->
      <el-row class="top-24 save-view" style="text-align: center">
        <el-button @click="goParent">取消</el-button>
        <el-button type="primary" @click.prevent.stop="saveConfig(deviceConfigName)">保存</el-button>
      </el-row>

      <!--二维码显示字段选择 === START-->
      <el-dialog title="选择字段" class="QRCode-field-selection" :visible.sync="dialogVisibleQRCode" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
        <div>
          <section v-for="item in listTableFields" :key="item.key">
            <el-radio v-model="textField" :label="item.key" border>{{item.keyName}}</el-radio>
          </section>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleQRCode = false">取 消</el-button>
          <el-button type="primary" @click="QRCodeFieldSelection()">插入</el-button>
        </span>
      </el-dialog>
      <!--二维码显示字段选择 === END-->

      <el-dialog title="选择模板" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="bedCardTemp">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in cardTemplateList.bedHead.length" :key="o" :xs="12" :sm="12" :md="8" :lg="6" :xl="6" style="margin-bottom: 10px">
              <el-radio v-model="configContent.cardTemplateBedHead.label" :label="cardTemplateList.bedHead[index].label">
                <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px;">
                  <el-tooltip class="item" effect="dark" :content="cardTemplateList.bedHead[index].memo||'暂无描述'" placement="top">
                    <img :src="cardTemplateList.bedHead[index].image" class="image" />
                  </el-tooltip>
                  <div class="card-name">{{ cardTemplateList.bedHead[index].label }}</div>
                </el-card>
              </el-radio>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click.prevent.stop="
              (dialogVisible = false),
                rebootEC(deviceConfigName, 'updateBedCard')
            ">确认</el-button>
        </span>
      </el-dialog>

      <el-dialog title="护工中心设备管理" :visible.sync="ShowCallCenterDeviceListDialog" width="40%" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="callcenter-tree-view">
          <el-tree :data="CallCenterDeviceAllList" ref="callCenterTree" show-checkbox :default-checked-keys="configContent.CallCenterDeviceListHead" node-key="deviceId" :props="{
              label: 'deptName',
              children: 'child',
            }"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ShowCallCenterDeviceListDialog = false">取 消</el-button>
          <el-button type="primary" @click="onGetSelectCallCenterDevice">保存</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import "./systemConfig.css";
import configMixin from "./mixin";
import axios from "axios";
import * as API from "@/api/wnms/msgManage/systemConfig";
import QRCode from "qrcodejs2";
import { newGetSelectData } from "../../../assets/wnms/utils/common";

import deptInsideMenu from "@/components/wnms/deptInsideMenu/deptInsideMenu";
export default {
  name: "BedHeadDeviceConfig",
  mixins: [configMixin],
  components: { QRCode, deptInsideMenu },
  data() {
    return {
      // 二维码选择的字段
      listTableFields: [],
      // 二维码选中的字段
      textField: "",
      // 二维码选择责字段弹窗
      dialogVisibleQRCode: false,
      // 弹窗是否显示
      dialogVisible: false,
      // 配置页面名称
      deviceConfigName: "bedHead",
      // 临时二维码图片
      QRCodeImg: "",
      // 护工中心弹窗显隐
      ShowCallCenterDeviceListDialog: false,
      // 护工中心tree数据列表
      CallCenterDeviceAllList: [],
      configContentJSON:
        '{"callBedHeadSettings":1,"callVolumeBedHead":[{"Time":"08:00:00","Vol":"15"},{"Time":"12:00:00","Vol":"15"},{"Time":"14:00:00","Vol":"15"},{"Time":"18:00:00","Vol":"15"}],"new_isStandbyBedHead":2,"eduAutoPlayBedhead":false,"eduStyleBedHead":"list","isCallCenterUseHead":false,"CallCenterDeviceListHead":[],"messageSilenceBedHead":[{"start":"20:00:00","end":"07:00:00"}],"QRCodeBedHead":{"state":false,"type":"custom","text":""},"QRCodeLabelBedHead":"","isBusinessBedHead":["餐厅点餐","商超便利","护工中心"],"isCheckCostBedHead":true,"isCostDetailsBedHead":true,"isFilterNameBedHead":true,"isCallBedHead":true,"isStandbyBedHead":true,"isAlwaysBedHead":false,"isStandbyTimeBedHead":"30","autoBedHead":true,"autoBedHeadTime":"200","isCostLevelBedHead":true,"iscloseScreenBedHead":true,"closeScreenBedHead":{"startTime":"20:00:00","endTime":"06:00:00"},"brightViewBedHead":"15","answerWayBedHead":"0","informationQueryAuthBedHead":true,"RechargeIdentityBedHead":true,"MinimumRechargeAmountBedHead":500,"nursingTasksAllowedBedHead":false,"volBedHead":[{"Time":"08:00:00","Vol":"10"},{"Time":"12:00:00","Vol":"8"},{"Time":"14:00:00","Vol":"10"},{"Time":"18:00:00","Vol":"6"}],"radioVolumeBedHead":[{"Time":"08:00:00","Vol":"5"},{"Time":"12:00:00","Vol":"5"},{"Time":"14:00:00","Vol":"5"},{"Time":"18:00:00","Vol":"5"}],"lightBedHead":[{"Time":"08:00:00","Light":"50"},{"Time":"12:00:00","Light":"50"},{"Time":"14:00:00","Light":"50"},{"Time":"18:00:00","Light":"50"}],"cardTemplateBedHead":{"path":"/a10/bedhead/bedSideCard.html","label":"M0","image":""},"autoRestartBedHead":{"state":false,"time":"08:00:00"},"deviceSettingBedHead":false,"bedheadBrightness":{"state":false,"light":""}, "kHandlerCallTypeBedHead": 1}',
      // 配置内容
      configContent: null,
      sideTree: [],
      menuArrayList: [],
      yh_loading: false
    };
  },
  created() {
    this.configContent = JSON.parse(this.configContentJSON);
  },
  mounted() {
    API.getPatinetLable({ deptId: this.deptId }).then((res) => {
      if (res.data.length > 0) {
        this.listTableFields = newGetSelectData({
          data: res.data,
          params: {
            key: "labelSql",
            keyName: "labelName"
          }
        });
      }
    });
    // 获取床头卡模板列表
    API.fetchCardTemplateList({ type: "床头-all" }).then((res) => {
      this.cardTemplateList.bedHead = res.data;
    });

    API.getDeviceList("wnDutyMainframe").then((res) => {
      this.CallCenterDeviceAllList = res.data || [];
    });
  },
  watch: {
    // 生成二维码
    "configContent.QRCodeBedHead.text": function (val, old) {
      if (val.length > 200) {
        this.configContent.QRCodeBedHead.text = old;
        this.$message.warning("二维码设置不允许超过200个字符！");
        return;
      }
      this.$nextTick(function () {
        this.createQRCode(val);
      });
    }
  },
  methods: {
    // 添加消息提醒静音时间段时间
    onAddmessageSilence() {
      if (this.configContent.messageSilenceBedHead.length >= 3) {
        this.$message.error("最多可以有三条数据");
        return;
      }
      this.configContent.messageSilenceBedHead.push({
        start: "20:00:00",
        end: "07:00:00"
      });
    },
    // 删除消息提醒静音时间段时间
    removemessageSilence(timeIndex) {
      this.configContent.messageSilenceBedHead.splice(timeIndex, 1);
    },
    getParentMeun(callback) {
      API.getParentMeun({
        status: 1,
        menuFrom: "bedHead",
        orgId: this.orgId
      }).then((res) => {
        this.sideTree = res.data;
        callback && callback();
      });
    },
    // 二维码字段选择
    QRCodeFieldSelection() {
      if (!this.textField) {
        this.$message.warning("请先选择字段！");
        return;
      }
      this.dialogVisibleQRCode = false;
      let myValue = `|${this.textField}|`;
      this.insertAtCursort(myValue);
    },
    async insertAtCursort(myValue) {
      let id = "#IDQRCodeFieldSelection";
      const myField = document.querySelector(id);
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        this.configContent.QRCodeBedHead.text =
          myField.value.substring(0, startPos) +
          myValue +
          myField.value.substring(endPos, myField.value.length);
        await this.$nextTick(); // 这句是重点, 圈起来
        myField.focus();
        myField.setSelectionRange(
          endPos + myValue.length,
          endPos + myValue.length
        );
      } else {
        this.configContent.QRCodeBedHead.text += myValue;
      }
    },
    // 生成二维码
    createQRCode(val) {
      document.getElementById("QRCodeImg").innerHTML = "";
      new QRCode("QRCodeImg", {
        width: 124,
        height: 124,
        text: val,
        correctLevel: 3
      });
    },
    // 显示护工中心设备管理弹窗
    onShowCallCenterDeviceList() {
      this.ShowCallCenterDeviceListDialog = true;
    },
    // 护工中心设备保存处理
    onGetSelectCallCenterDevice() {
      let res = this.$refs.callCenterTree.getCheckedKeys();
      this.configContent.CallCenterDeviceListHead = [];
      res.forEach((item) => {
        if (item !== "-1") {
          this.configContent.CallCenterDeviceListHead.push(item);
        }
      });
      this.ShowCallCenterDeviceListDialog = false;
    },
    // 点击树
    SaveData(data) {
      var that = this;
      that.configContent = { ...this.configContent, ...data };
      that.getParentMeun(() => {
        // 获取数据
        let treelist = data.menuArrayList.map((item) => item.id) || [];
        // 回显数据
        let t = that.$refs.tree.getCheckedNodes() || [];
        // 先清空再赋值
        if (t.length > 0) {
          t.map((item) => {
            that.$refs.tree.setChecked(item.id, false);
          });
        }
        that.$nextTick(() => {
          if (treelist.length > 0) {
            treelist.forEach((i, n) => {
              var node = that.$refs.tree.getNode(i);
              if (node && node.isLeaf) {
                that.$refs.tree.setChecked(node, true);
              }
            });
          } else {
            console.log("没有获取任何数据");
          }
        });
      });
    },
    // 手写验证
    formValidation() {
      let _this = this;
      // 处理静音时间段的数据
      let slienceI = _this.configContent.messageSilenceBedHead.findIndex(
        (item, index) => {
          return !item.start || !item.end;
        }
      );
      if (slienceI !== -1) {
        this.$message.warning("消息提醒静音时间段设置不正确！");
        return false;
      }

      return true;
    },
    getCheckedKeys() {
      let _this = this;

      let node = this.$refs.tree.getCheckedNodes();
      if (node.length > 0) {
        let nodeList = node.map((item) => {
          return {
            pageUrl: item.pageUrl,
            menuCode: item.id,
            id: item.id,
            menuName: item.menuName
          };
        });

        // 根据配置查找出对象的菜单
        let list = nodeList.map((item) => item.id);

        // 保存当前数据
        _this.menuArrayList = list;

        let arr = this.sideTree.filter(function (item) {
          return list.indexOf(item.id) != -1;
        });

        let call = arr.find((item) => item.menuCode == "_call_bh") || null;
        // 控制悬浮按钮 同步树种的悬浮按钮
        if (call !== null) {
          this.configContent.isCallBedHead = true;
        } else {
          this.configContent.isCallBedHead = false;
        }
      } else {
        _this.menuArrayList = [];
      }
    }
  }
};
</script>
<style lang="scss">
.el-tooltip__popper {
  max-width: 30%;
}
.bedCardTemp .el-radio {
  .el-radio__input {
    display: none;
  }

  &.is-checked .el-card {
    border: 1px solid blue;
  }
}

.bedCardTemp {
  height: 55vh;
  overflow-y: auto;
  overflow-x: hidden;
  .el-row {
    .el-col {
      display: inline-block;
      float: none;
      width: 11.5vw;
      height: 17vh;
      .image {
        width: 10vw;
        height: 13vh;
      }
      .card-name {
        margin-top: 10px;
        text-align: center;
        font-weight: bold;
        white-space: normal;
        height: 4vh;
      }
    }
  }
}

#QRCodeImg {
  display: inline-block;
  margin-top: 1rem;
  padding: 10px;
  border: 1px solid #dcdfe6;
}

.callcenter-tree-view {
  height: 500px;
  overflow: auto;
}
.QRCode-field-selection {
  .el-dialog {
    .el-dialog__body {
      div {
        height: 500px;
        overflow: auto;
        section {
          display: inline-block;
          margin: 10px;
          min-width: 20%;
        }
      }
    }
  }
}
.save-view {
  background-color: #fff;
  position: sticky;
  bottom: -20px;
  padding: 20px 0;
  z-index: 20;
}
</style>
