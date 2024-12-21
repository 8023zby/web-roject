<template>
  <el-container style="height: 100%" v-loading="yh_loading">
    <el-main>
      <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" :anchorList="anchorList" :disabled="deptDisabled"></deptInsideMenu>

      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
        <el-divider>
          <h2 :id="anchorList[0].src">{{anchorList[0].title}}</h2>
        </el-divider>

        <el-form-item label="启用探视模式" prop="visitModeContent">
          <el-switch v-model="configContent.visitMode" :active-color="switchActiveColor" />
          <el-row v-show="configContent.visitMode">
            <quill-editor ref="text" v-model="configContent.visitModeContent" :options="quillEditorOptions" class="myQuillEditor" />
          </el-row>
          <span style="color:#ccc;margin-left:1rem">启用后床旁分机仅具备探视所需要的视频通话</span>
        </el-form-item>

        <el-divider>
          <h2 :id="anchorList[1].src">{{anchorList[1].title}}</h2>
        </el-divider>

        <div class="el-form-item-left">
          <el-form-item label="显示模式">
            <el-radio-group v-model="configContent.new_isStandbyBedSide">
              <el-radio :label="1">不显示</el-radio>
              <el-radio :label="2">屏保显示</el-radio>
              <el-radio :label="3">一直显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="isStandbyTimeBedSide">
            &nbsp; &nbsp; &nbsp;&nbsp;患者端无操作
            <el-input v-model.trim="configContent.isStandbyTimeBedSide" type="text" maxlength="3" :disabled="configContent.new_isStandbyBedSide===1 || configContent.new_isStandbyBedSide===3" class="w60" />秒后自动显示
          </el-form-item>
        </div>
        <!-- 床头卡患者姓名保护 -->
        <el-form-item label="患者姓名保护">
          <el-switch v-model="configContent.isFilterNameBedSide" :active-color="switchActiveColor" />
        </el-form-item>
        <!-- 二维码 -->
        <el-form-item label="床头卡二维码" prop="name">
          <el-switch v-model="configContent.QRCodeBedSide.state" :active-color="switchActiveColor" />

          <el-row v-show="configContent.QRCodeBedSide.state">
            <el-input v-model.trim="configContent.QRCodeBedSide.text" id="IDQRCodeFieldSelection" type="text" :show-word-limit="true" :disabled="!configContent.QRCodeBedSide.state" style="width: 50%; margin-right: 1rem" />
            <el-button round size="mini" @click="textField='',dialogVisibleQRCode = true">插入字段</el-button>
          </el-row>

          <el-row v-show="configContent.QRCodeBedSide.state">
            <div id="QRCodeImg"></div>
          </el-row>
        </el-form-item>
        <el-form-item label="二维码标注" prop="QRCodeLabelBedSide" v-show="configContent.QRCodeBedSide.state">
          <el-input v-model.trim="configContent.QRCodeLabelBedSide" type="text" :show-word-limit="true" style="width: 50%; margin-right: 1rem" />
        </el-form-item>

        <!-- 新版二维码 先用以前的 -->
        <!-- <div class="el-form-item-left">
          <div>
            <el-form-item label="二维码">
              <el-radio-group v-model="configContent.QRCodeBedSide.code">
                <el-radio :label="1">不显示</el-radio>
                <el-radio :label="2">手输URL</el-radio>
                <el-radio :label="3">接口传值</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="名称" prop="QRCodeLabel" label-width="80px">
              <el-input
                v-model.trim="configContent.QRCodeLabel"
                type="text"
                :show-word-limit="true"
                :disabled="configContent.QRCodeBedSide.code===1 "
              />
            </el-form-item>

            <el-form-item label="URL" label-width="80px" prop="QRCodeBedSideText">
              <el-input
                v-model.trim="configContent.QRCodeBedSide.text"
                type="text"
                :show-word-limit="true"
                :disabled="configContent.QRCodeBedSide.code===1 ||configContent.QRCodeBedSide.code==3"
                style="width: 20rem; "
              />
            </el-form-item>
          </div>
          <el-form-item style="margin-left:6rem">
            <div id="QRCodeImg"></div>
          </el-form-item>
        </div>-->

        <!-- 新版二维码 先用以前的结束 -->

        <!-- ===============================改版了不用开始   20201216========================= -->
        <!-- 自动显示床头卡 -->
        <!-- <div class="el-form-item-left">
          <el-form-item label="显示模式">
            <el-switch v-model="configContent.isStandbyBedSide" :active-color="switchActiveColor" />
          </el-form-item>

          <el-form-item prop="isStandbyTimeBedSide">
            &nbsp;患者端无操作
            <el-input
              v-model.trim="configContent.isStandbyTimeBedSide"
              type="text"
              maxlength="3"
              :disabled="!configContent.isStandbyBedSide"
              class="w60"
            />秒后自动显示床头卡
        </el-form-item>-->
        <!-- 一直显示 -->
        <!-- <el-form-item label="一直显示" prop="name" style="margin-left: 4em">
            <el-switch
              v-model="configContent.isAlways"
              :active-color="switchActiveColor"
              :disabled="!configContent.isStandbyBedSide"
            />
          </el-form-item>
        </div>-->

        <!-- ===============================改版了不用结束==================================== -->
        <!--
        二维码   2020-12-21 zc 注释
        <el-form-item label="二维码" prop="name">
          <el-switch v-model="configContent.QRCodeBedSide.state" :active-color="switchActiveColor" />
          <el-row></el-row>
        </el-form-item>-->

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

        <!-- ==============================================登陆登出========================================= -->
        <el-divider>
          <h2 :id="anchorList[2].src">{{anchorList[2].title}}</h2>
        </el-divider>

        <!-- 无患者 -->
        <el-form-item label="无患者床位">
          <el-switch v-model="configContent.isNonePatientBedSide" :active-color="switchActiveColor" />
          <span style="color:red;">该设备用于始终没有患者的空床位（如省立医院多普勒室、健康宣教室），将取消登录验证</span>
        </el-form-item>
        <!-- 自动登录-->
        <el-form-item label="患者入院自动登录">
          <el-switch v-model="configContent.isAutoLogin" :active-color="switchActiveColor" />
        </el-form-item>

        <!-- 医护端登陆方式-->
        <el-form-item label="医护端登录方式">
          <el-checkbox-group v-model="configContent.loginMode">
            <el-checkbox label="1">医护刷卡</el-checkbox>
            <el-checkbox label="2">人脸识别</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 医护端自动返回 -->
        <el-form-item label="医护端自动退出" prop="backDurationBedSide">
          <el-switch v-model="configContent.isBackBedSide" :active-color="switchActiveColor" />无操作
          <el-input v-model.trim="configContent.backDurationBedSide" type="text" maxlength="4" class="w60" />秒后自动退出
        </el-form-item>

        <!-- 医护端自动返回 -->

        <!-- <el-form-item label="腕带登录">
          <el-row>
            <el-input
              id="wristFieldSelection"
              v-model.trim="configContent.wristBand.labels"
              type="text"
              :show-word-limit="true"
              ref="wristref"
              style="width: 50%; margin-right: 1rem"
            />
            <el-button
              round
              size="mini"
              @click="formWristBand.textField='',formWristBand.dialogVisible = true"
            >插入字段</el-button>

            <div class="wristref_cls">
              <span>分隔符(可更改)</span>
              <el-input
                type="text"
                class="wristref_input_cls"
                v-model="configContent.wristBand.handseparate"
              ></el-input>
            </div>
          </el-row>
        </el-form-item>-->

        <!-- //=====================================功能设置========================================= -->
        <el-divider>
          <h2 :id="anchorList[3].src">{{anchorList[3].title}}</h2>
        </el-divider>
        <el-form-item label="患者端功能入口" prop="menuTree">
          <el-tree style="width:15rem" :data="sideTree" show-checkbox ref="tree" node-key="id" :props="{
              label: 'menuName',
              children: 'children',
            }"></el-tree>
        </el-form-item>

        <!-- TODO: 准备从此模块移除 === START =================================================================== -->
        <!-- <el-form-item label="呼叫按钮" prop="name">  2020-12-21 zc 注释
          <el-switch v-model="configContent.isCallBedSide" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item label="住院缴费" prop="name">
          <el-switch v-model="configContent.isPayBedSide" :active-color="switchActiveColor" />
        </el-form-item>-->

        <!-- 护工中心设备列表 -->
        <el-form-item label="呼叫护工" prop="name">
          <el-switch v-model="configContent.isCallCenterUse" :active-color="switchActiveColor" />

          <div v-show="configContent.isCallCenterUse">
            <el-button round type="primary" size="mini" @click="onShowCallCenterDeviceList">护工设备管理</el-button>
            <span style="margin-left: 10px">已选 {{ configContent.CallCenterDeviceList.length }} 个设备</span>
          </div>
        </el-form-item>
        <!-- <el-form-item label="查看费用" prop="name">
          <el-switch
            v-model="configContent.isCheckCostBedSide"
            :active-color="switchActiveColor"
          />
        </el-form-item>-->

        <!-- <el-form-item label="患者隐私" prop="name">
          <el-checkbox v-model="configContent.isFilterNameBedSide"
            >姓名保护</el-checkbox
          >
          <el-checkbox v-model="configContent.isCheckResultBedSide"
            >检查报告</el-checkbox
          >
          <el-checkbox v-model="configContent.isCheckoutResultBedSide"
            >检验结果</el-checkbox
          >
        </el-form-item>-->
        <!-- TODO: 准备从此模块移除 == END ==================================================================== -->

        <!-- 医护端床位切换 -->
        <div class="el-form-item-left">
          <div>
            <el-form-item label="患者端近日安排"></el-form-item>
            <el-form-item label="显示医嘱分类" prop="RayRehearse.type" label-width="120px">
              <el-checkbox-group v-model="configContent.RayRehearse.type">
                <el-checkbox v-for="(item,  index) in dayRehearse.type" :label="item.classifyId" :key="index">{{item.classifyName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <el-form-item label=" "></el-form-item>
          <el-form-item label="显示医嘱日期" label-width="120px">
            <el-checkbox-group v-model="configContent.RayRehearse.day">
              <el-checkbox v-for="(item, index) in dayRehearse.day" :label="item.value" :key="index">{{item.key}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>

        <!-- 医护端床位切换 -->
        <div class="el-form-item-left">
          <div style="height: 3rem;widht:5rem;display:inline-block">
            <el-form-item label="医护端床位切换">
              <el-switch v-model="configContent.bedsSwitchBedSide" :active-color="switchActiveColor" />
            </el-form-item>
          </div>

          <!-- 医护端病区切换 -->
          <el-form-item label="病区切换" prop="name" style="margin-left: 4em">
            <el-switch v-model="configContent.wardSwitchBedSide" :active-color="switchActiveColor" :disabled="!configContent.bedsSwitchBedSide" />
          </el-form-item>
        </div>
        <!-- 终端设置 -->
        <el-form-item label="终端设置">
          <el-switch v-model="configContent.deviceSettingBedSide" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item label="充值身份确认">
          <el-switch v-model="configContent.RechargeIdentityBedSide" :active-color="switchActiveColor" />
        </el-form-item>
        <el-form-item label="充值最小金额" prop="MinimumRechargeAmountBedSide">
          <el-input v-model.trim="configContent.MinimumRechargeAmountBedSide" type="text" maxlength="4" class="w60" />
        </el-form-item>
        <!--宣教音视频自动播放配置开关-->
        <el-form-item label="宣教音视频自动播放" prop="name">
          <el-switch v-model="configContent.eduAutoPlayBedside" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item label="宣教样式">
          <el-radio-group v-model="configContent.eduStyleBedSide">
            <el-radio label="list">列表</el-radio>
            <el-radio label="jiugongge">九宫格</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="大字版" prop="name">
          <el-switch v-model="configContent.bigWordType" :active-color="switchActiveColor" />
        </el-form-item>

        <!-- //=====================================功能设置结束========================================= -->

        <!-- //=====================================硬件控制========================================= -->
        <el-divider>
          <h2 :id="anchorList[4].src">{{anchorList[4].title}}</h2>
        </el-divider>

        <!-- 呼叫开关发起的呼叫类型 -->
        <el-form-item label="呼叫开关发起">
          <el-radio v-model="configContent.kHandlerCallTypeBedSide" :label="1">语音呼叫</el-radio>
          <el-radio v-model="configContent.kHandlerCallTypeBedSide" :label="0">视频呼叫</el-radio>
        </el-form-item>

        <!-- 手柄发起呼叫被接听后 -->
        <el-form-item label="呼叫开关通话设置">
          <el-radio v-model="configContent.answerWayBedSide" label="0">终端喇叭发声</el-radio>
          <el-radio v-model="configContent.answerWayBedSide" label="1">手柄听筒发声</el-radio>
        </el-form-item>

        <!-- 定时息屏时间 -->
        <div>
          <el-form-item label="定时息屏时间">
            <el-switch v-model="configContent.iscloseScreenBedSide" :active-color="switchActiveColor" />
          </el-form-item>

          <el-form-item>
            <el-time-picker v-model="configContent.closeScreenBedSide.startTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenBedSide" />-
            <el-time-picker v-model="configContent.closeScreenBedSide.endTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenBedSide" />
          </el-form-item>

          <el-form-item prop="brightViewBedSide">
            点亮屏幕
            <el-input v-model.trim="configContent.brightViewBedSide" type="text" maxlength="3" class="w60" :disabled="!configContent.iscloseScreenBedSide" />秒后自动息屏
          </el-form-item>
        </div>
        <el-form-item label="消息提醒静音时间段">
          <el-button round type="primary" size="mini" @click="onAddmessageSilence" v-if="configContent.messageSilenceBedSide.length === 0">添加</el-button>
          <section v-else>
            <div v-for="(businessHour, hourIndex) in configContent.messageSilenceBedSide" :key="hourIndex">
              <div style="white-space: nowrap;padding-bottom: 15px;">
                {{`时间${(hourIndex + 1)}：`}}
                <el-time-picker v-model="configContent.messageSilenceBedSide[hourIndex]['start']" value-format="HH:mm:ss" placeholder="开始时间">
                </el-time-picker>
                至
                <el-time-picker v-model="configContent.messageSilenceBedSide[hourIndex]['end']" value-format="HH:mm:ss" placeholder="结束时间">
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
        <!-- 视频播放最大音量 -->
        <el-form-item label="音视频播放最大音量" prop="name">
          <el-select v-model="configContent.audioMaxVolumeBedSide" class="volume-select" placeholder="请选择音量" :xs="12" :sm="6" :md="5" :lg="5" :xl="4">
            <el-option v-for="item in volumeOptionsList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- 终端音量 -->
        <el-form-item label="终端音量" prop="name">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.volumeBedSide[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" style="width: 100%" />
                <el-select class="volume-select" v-model="configContent.volumeBedSide[index].Vol" placeholder="请选择音量" style="width: 100%; margin-top: 10px">
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
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.radioVolumeBedSide[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" style="width: 100%" />
                <el-select class="volume-select" v-model="configContent.radioVolumeBedSide[index].Vol" placeholder="请选择音量" style="width: 100%; margin-top: 10px">
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
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.lightBedSide[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" style="width: 100%" />
                <el-select class="light-select" v-model="configContent.lightBedSide[index].Light" placeholder="请选择亮度" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 通话音量 -->
        <el-form-item label="通话音量" prop="name">
          <el-row :gutter="10">
            <el-radio-group v-model="configContent.callBedSideSettings">
              <el-radio :label="1">上次通话音量</el-radio>
              <el-radio :label="2">分时段自动调整</el-radio>
            </el-radio-group>
          </el-row>
          <el-row :gutter="10" v-if="configContent.callBedSideSettings==2">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.callVolumeBedSide[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" style="width: 100%" />
                <el-select class="volume-select" v-model="configContent.callVolumeBedSide[index].Vol" placeholder="请选择音量" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList2" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 系统亮度 -->
        <el-form-item label="系统亮度" prop="name">
          <el-switch v-model="configContent.bedsideBrightness.state" :active-color="switchActiveColor" />
          <el-select class="light-select" v-model="configContent.bedsideBrightness.light" placeholder="请选择亮度" :disabled="!configContent.bedsideBrightness.state" style=" margin-left: 10px">
            <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>仅针对光感原件有效
        </el-form-item>

        <!-- 重启终端 -->
        <el-form-item label="重启终端" prop="name">
          <el-button round type="primary" size="mini" @click="rebootEC(deviceType.ecBedSideExtension)">重启</el-button>
        </el-form-item>

        <!-- 定时重启 -->
        <el-form-item label="定时重启" prop="name">
          <el-switch v-model="configContent.autoRestartBedSide.state" :active-color="switchActiveColor" />每天
          <el-time-picker v-model="configContent.autoRestartBedSide.time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" :disabled="!configContent.autoRestartBedSide.state" class="w120" />时间，自动重启
        </el-form-item>

        <!-- 门灯调度 -->
        <!-- <el-form-item label="门灯调度" prop="name">
          <el-switch v-model="configContent.doorLampOpenBedSide" :active-color="switchActiveColor" />
        </el-form-item> -->

        <!-- //=====================================硬件控制结束========================================= -->
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
            <el-col v-for="(o, index) in cardTemplateList.bedSide.length" :key="o" :xs="12" :sm="12" :md="8" :lg="6" :xl="6" style="margin-bottom: 10px">
              <el-radio v-model="configContent.cardTemplateBedSide.label" :label="cardTemplateList.bedSide[index].label">
                <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                  <el-tooltip class="item" effect="dark" :content="cardTemplateList.bedSide[index].memo||'暂无描述'" placement="top">
                    <img :src="cardTemplateList.bedSide[index].image" class="image" />
                  </el-tooltip>
                  <div class="card-name">{{ cardTemplateList.bedSide[index].label }}</div>
                </el-card>
              </el-radio>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="
              (dialogVisible = false),
                rebootEC(deviceConfigName, 'updateBedCard')
            ">保存</el-button>
        </span>
      </el-dialog>

      <el-dialog title="护工中心设备管理" :visible.sync="ShowCallCenterDeviceListDialog" width="40%" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="callcenter-tree-view">
          <el-tree :data="CallCenterDeviceAllList" ref="callCenterTree" show-checkbox :default-checked-keys="configContent.CallCenterDeviceList" node-key="deviceId" :props="{
              label: 'deptName',
              children: 'child',
            }"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ShowCallCenterDeviceListDialog = false">取 消</el-button>
          <el-button type="primary" @click="onGetSelectCallCenterDevice">保存</el-button>
        </span>
      </el-dialog>

      <!--腕带登录dialog === START-->
      <!-- <el-dialog
        title="选择字段"
        class="QRCode-field-selection"
        :visible.sync="formWristBand.dialogVisible"
        width="50%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div>
          <section v-for="item in formWristBand.list_x" :key="item.key">
            <el-radio v-model="formWristBand.textField" :label="item.key" border>{{item.keyName}}</el-radio>
          </section>
          <br />
          <section v-for="item in formWristBand.list_y" :key="item.key">
            <el-radio v-model="formWristBand.textField" :label="item.key" border>{{item.keyName}}</el-radio>
          </section>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="formWristBand.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="btnInspPatLable()">插入</el-button>
        </span>
      </el-dialog>-->
      <!--腕带登录dialog === END-->
    </el-main>
  </el-container>
</template>

<script>
import "./systemConfig.css";
import configMixin from "./mixin";
import * as API from "@/api/wnms/msgManage/systemConfig";
import QRCode from "qrcodejs2";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import BaseQueryPageForm from "../common/BaseQueryPageForm";
import { newGetSelectData } from "../../../assets/wnms/utils/common";
import deptInsideMenu from "@/components/wnms/deptInsideMenu/deptInsideMenu";

export default {
  name: "BedSideDeviceConfig",
  mixins: [configMixin, BaseQueryPageForm],
  components: { QRCode, quillEditor, deptInsideMenu },
  data() {
    return {
      formWristBand: {
        dialogVisible: false,
        textField: "",
        list_x: [],
        list_y: []
      },
      // 锚点列表
      anchorList: [
        {
          src: "divider1",
          title: "启用探视"
        },
        {
          src: "divider2",
          title: "床头卡"
        },
        {
          src: "divider3",
          title: "登录登出"
        },
        {
          src: "divider4",
          title: "功能设置"
        },
        {
          src: "divider5",
          title: "硬件控制"
        }
      ],
      // 二维码选择的字段
      listTableFields: [],
      // 二维码选中的字段
      textField: "",
      quillEditorOptions: {
        placeholder: "请填写探视模式提示内容",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"], // 加粗，斜体，下划线，删除线
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
            [{ color: [] }] // 字体颜色，字体背景颜色
          ]
        }
      },
      // 护工中心弹窗显隐
      ShowCallCenterDeviceListDialog: false,
      // 护工中心tree数据列表
      CallCenterDeviceAllList: [],
      // 弹窗是否显示
      dialogVisible: false,
      // 二维码选择责字段弹窗
      dialogVisibleQRCode: false,
      // 配置页面名称
      deviceConfigName: "bedSide",
      // 临时二维码图片
      QRCodeImg: "",
      configContentJSON:
        '{"callBedSideSettings":1,"callVolumeBedSide":[{"Time":"08:00:00","Vol":"15"},{"Time":"12:00:00","Vol":"15"},{"Time":"14:00:00","Vol":"15"},{"Time":"18:00:00","Vol":"15"}],"eduStyleBedSide":"list","bigWordType":false,"eduAutoPlayBedside":false,"isCallCenterUse":false,"CallCenterDeviceList":[],"messageSilenceBedSide":[{"start":"20:00:00","end":"07:00:00"}],"visitMode":false,"visitModeContent":"","isAutoLogin":false,"isNonePatientBedSide":false,"isCallBedSide":true,"isIPTVBedSide":["电视直播","视频点播"],"isBusinessBedSide":[],"audioMaxVolumeBedSide":"15","QRCodeBedSide":{"state":false,"type":"custom","text":"","code":1},"QRCodeLabelBedSide":"","isPayBedSide":true,"isCheckCostBedSide":true,"isCheckResultBedSide":true,"isCheckoutResultBedSide":true,"isFilterNameBedSide":true,"isCostLevelBedSide":true,"iscloseScreenBedSide":true,"closeScreenBedSide":{"startTime":"20:00:00","endTime":"06:00:00"},"brightViewBedSide":"15","isStandbyBedSide":false,"new_isStandbyBedSide":2,"isAlways":false,"answerWayBedSide":"0","isStandbyTimeBedSide":"60","isBackBedSide":true,"backDurationBedSide":"60","bedsSwitchBedSide":false,"wardSwitchBedSide":false,"volumeBedSide":[{"Time":"08:00:00","Vol":"10"},{"Time":"12:00:00","Vol":"8"},{"Time":"14:00:00","Vol":"10"},{"Time":"18:00:00","Vol":"6"}],"radioVolumeBedSide":[{"Time":"08:00:00","Vol":"5"},{"Time":"12:00:00","Vol":"5"},{"Time":"14:00:00","Vol":"5"},{"Time":"18:00:00","Vol":"5"}],"lightBedSide":[{"Time":"08:00:00","Light":"50"},{"Time":"12:00:00","Light":"50"},{"Time":"14:00:00","Light":"50"},{"Time":"18:00:00","Light":"50"}],"cardTemplateBedSide":{"path":"/bedsideIndex","label":"M2","image":"/resource/json/bedHead/M2/index.jpg"},"autoRestartBedSide":{"state":false,"time":"08:00:00"},"RechargeIdentityBedSide":true,"MinimumRechargeAmountBedSide":500,"deviceSettingBedSide":false,"loginMode":["1"],"menuList":[],"RayRehearse":{"type":[],"day":[]},"bedsideBrightness":{"state":false,"light":""}, "kHandlerCallTypeBedSide": 1}',
      // 配置内容
      configContent: null,
      // 近日安排
      dayRehearse: {
        // 根据后台护理医嘱表写的
        type: [],
        day: [
          { key: "昨日", value: "yesterDay" },
          { key: "今日", value: "toDay" },
          { key: "明日", value: "tomorDay" }
        ]
      },
      // 功能设置菜单树
      sideTree: [],
      menuArrayList: []
    };
  },
  created() {
    let that = this;
    this.rules = {
      ...this.rules,
      "RayRehearse.type": [
        {
          required: true,
          message: "至少勾选一个分类",
          trigger: "change"
        }
      ],
      visitModeContent: [
        {
          validator(rule, value, callback, source, options) {
            if (!value) {
              callback();
              return;
            }
            if (that.getTextContent(value).length > 500) {
              callback("请输入字数小于500");
              return;
            }
            if (that.textEncode(value).length > 5000) {
              callback("输入字符不能大于5000");
              return;
            }
            callback();
          }
        }
      ]
    };
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

    // 获取医嘱信息
    API.getClassifys().then((res) => {
      this.dayRehearse.type = Array.isArray(res.data)
        ? res.data
            .sort((a, b) => a.classifyId - b.classifyId)
            .map((item) => {
              item.classifyId = Number(item.classifyId);
              return item;
            })
        : [];
    });

    // 获取床头卡模板列表
    API.fetchCardTemplateList({ type: "床旁-all" }).then((res) => {
      this.cardTemplateList.bedSide = res.data;
    });

    API.getDeviceList("wnDutyMainframe").then((res) => {
      this.CallCenterDeviceAllList = res.data || [];
    });
  },
  computed: {
    code: function () {
      return this.configContent.QRCodeBedSide.code;
    }
  },
  watch: {
    // // 床头卡一直显示联动
    // "configContent.isStandbyBedSide": function (val) {
    //   if (!val) this.configContent.isAlways = val
    // },

    /* 'configContent.QRCodeBedSide.code': {
      handler (new_val, old_value) {
        switch (new_val) {
          case 1:
            this.configContent.QRCodeLabel = ''
            this.configContent.QRCodeBedSide.text = ''
            break
          case 2:
            break
          case 3:
            this.configContent.QRCodeBedSide.text = ''
            break
        }
      },
      deep: true,
      immediate: false
    }, */
    "configContent.bedsSwitchBedSide": function (val) {
      if (!val) this.configContent.wardSwitchBedSide = val;
    },
    //
    "configContent.QRCodeBedSide.text": function (val, old) {
      if (val.length > 200) {
        this.configContent.QRCodeBedSide.text = old;
        this.$message.warning("二维码设置不允许超过200个字符！");
        return;
      }
      // 生成二维码
      this.$nextTick(function () {
        this.createQRCode(val);
      });
    }
  },
  methods: {
    //添加消息提醒静音时间段时间
    onAddmessageSilence() {
      if (this.configContent.messageSilenceBedSide.length >= 3) {
        this.$message.error("最多可以有三条数据");
        return;
      }
      this.configContent.messageSilenceBedSide.push({
        start: "20:00:00",
        end: "07:00:00"
      });
    },
    //删除消息提醒静音时间段时间
    removemessageSilence(timeIndex) {
      this.configContent.messageSilenceBedSide.splice(timeIndex, 1);
    },
    getParentMeun(callback) {
      API.getParentMeun({
        status: 1,
        menuFrom: "bedSide",
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
        this.configContent.QRCodeBedSide.text =
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
        this.configContent.QRCodeBedSide.text += myValue;
      }
    },
    // 点击树
    SaveData(data) {
      var that = this;
      data.visitModeContent = decodeURIComponent(data.visitModeContent);
      // 获取数据
      that.configContent = { ...this.configContent, ...data };
      // 获取完数据后再给菜单赋值
      that.getParentMeun(() => {
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
      // 处理启用探视模式的字符串
      if (_this.configContent.visitModeContent) {
        _this.configContent.visitModeContent =
          _this.configContent.visitModeContent.replace(/"/g, "'");
      }
      // 处理静音时间段的数据
      let slienceI = _this.configContent.messageSilenceBedSide.findIndex(
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
      // let nodes = this.$refs.tree.getCheckedNodes()
      // 获取子节点未全选时的父节点id
      let childArr = this.$refs.tree.getCheckedNodes();
      let parentArr = this.$refs.tree.getHalfCheckedNodes();
      let node = parentArr.concat(childArr);
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
        let call = arr.find((item) => item.menuCode == "call") || null;
        // 控制悬浮按钮 同步树种的悬浮按钮
        if (call !== null) {
          this.configContent.isCallBedSide = true;
        } else {
          this.configContent.isCallBedSide = false;
        }
      } else {
        _this.menuArrayList = [];
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
      this.configContent.CallCenterDeviceList = [];
      res.forEach((item) => {
        if (item != "-1") {
          this.configContent.CallCenterDeviceList.push(item);
        }
      });
      this.ShowCallCenterDeviceListDialog = false;
      console.log(this.configContent.CallCenterDeviceList);
    }
    // 腕带登录
    // btnInspPatLable () {

    //   if (!this.formWristBand.textField) {
    //     this.$message.warning('请先选择字段！')
    //     return
    //   }
    //   let value = `${this.configContent.wristBand.fieldSeparate}${this.formWristBand.textField}${this.configContent.wristBand.handseparate}`

    //   this.insertWrist(value)
    //   this.formWristBand.dialogVisible = false

    // },
    // 腕带登录
    // async insertWrist (myValue) {
    //   let id = '#wristFieldSelection'
    //   const myField = document.querySelector(id)
    //   if (myField.selectionStart || myField.selectionStart === 0) {
    //     var startPos = myField.selectionStart
    //     var endPos = myField.selectionEnd
    //     this.configContent.wristBand.labels =
    //       myField.value.substring(0, startPos) +
    //       myValue +
    //       myField.value.substring(endPos, myField.value.length)
    //     await this.$nextTick() // 这句是重点, 圈起来
    //     myField.focus()
    //     myField.setSelectionRange(
    //       endPos + myValue.length,
    //       endPos + myValue.length
    //     )
    //   } else {
    //     this.configContent.wristBand.labels += myValue
    //   }
    // },
  }
};
</script>
<style lang="scss" scoped>
.el-tooltip__popper {
  max-width: 30%;
}
.wristref_cls {
  display: inline;
  padding-right: 1rem;
  width: 100px;
  .wristref_input_cls {
    padding-left: 1rem;
    width: 10rem;
  }
}

.checkbox_group_clss {
  width: 15rem;
  display: inline-block;
}

.checkbox_group_cls {
  width: 7rem;
  display: inline-block;
}
.checkbox_cls {
  display: inline-block;
  width: 100%;
}

.bedCardTemp .el-radio {
  /deep/ .el-radio__input {
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

.el-form-item-left {
  /deep/ .el-form-item {
    display: inline-flex;

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}

#QRCodeImg {
  display: inline-block;
  margin-top: 1rem;
  padding: 10px;
  border: 1px solid #dcdfe6;
}

.myQuillEditor {
  margin-top: 10px;
}

.ql-picker-options {
  z-index: 100 !important;
}

.callcenter-tree-view {
  height: 500px;
  overflow: auto;
}
.QRCode-field-selection {
  .el-dialog {
    .el-dialog__body {
      div {
        min-height: 200px;
        section {
          display: inline-block;
          margin: 10px;
          width: 20%;
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
