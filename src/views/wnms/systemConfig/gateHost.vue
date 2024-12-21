<template>
  <el-container class="setting-main" v-loading="yh_loading">
    <el-main>
      <deptInsideMenu @dataInit="reLoadData" :deptId="deptId" :anchorList="anchorList" loadData :disabled="deptDisabled"></deptInsideMenu>
      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
        <el-divider>
          <h2 id="divider1">页面设置</h2>
        </el-divider>
        <!-- 呼叫功能 -->
        <!-- <el-form-item label="呼叫功能">
          <el-switch
            v-model="configContent.isCallGate"
            :active-color="switchActiveColor"
          />
        </el-form-item>-->

        <!-- 显示模式 -->
        <el-form-item label="显示模式">
          <el-radio v-model="configContent.roomModelGate" label="0">管床模式</el-radio>
          <el-radio v-model="configContent.roomModelGate" label="1">管房模式</el-radio>
          <!-- <small>显示模式更改后，排班模式进行对应更改</small> -->
        </el-form-item>

        <!-- 显示模式 -->
        <el-form-item label="房间信息">
          <el-radio-group v-model="configContent.isdoorshow">
            <el-radio label="doorall">全部</el-radio>
            <el-radio label="doorroom">房间名称</el-radio>
            <el-radio label="doorbed">床位名称</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 显示科室名称 -->
        <div class="el-form-item-left">
          <el-form-item label="显示科室名称">
            <el-switch v-model="configContent.isShowDeptName" :active-color="switchActiveColor" />
            <span style="color: #888; margin-left: 10px">该项设置仅对横屏门口机生效</span>
          </el-form-item>

          <el-form-item v-show="configContent.isShowDeptName" style="margin-top:-1rem;" prop="deptNameColor" :rules="[
              {
                required: configContent.isShowDeptName,
                message: '不能为空',
                trigger: 'blur',
              },
            ]">
            显示颜色
            <el-color-picker v-model="configContent.deptNameColor" popper-class="dept-popper" :predefine="predefineColors" style="margin-left:1rem;transform: translateY(10px);" />
          </el-form-item>
        </div>

        <!-- 显示患者姓名 -->
        <div class="el-form-item-left">
          <div style="height: 3rem;line-height: 2rem;">
            <el-form-item label="显示患者姓名">
              <el-switch v-model="configContent.isShowNameGate" :active-color="switchActiveColor" />
            </el-form-item>
          </div>

          <!-- 开启隐私保护 -->
          <el-form-item label="开启隐私保护" prop="name">
            <el-switch v-model="configContent.isFilterNameGate" :active-color="switchActiveColor" :disabled="!configContent.isShowNameGate" />
          </el-form-item>
        </div>

        <!-- 展示文章 -->
        <el-form-item label="展示文章" prop="educationTitle">
          <el-input v-model.trim="configContent.education.educationTitle" type="text" maxlength="7" disabled :show-word-limit="true" style="width: 50%; margin-right: 1rem" />
          <el-button round type="primary" size="mini" @click="eduDialogToggle">选择</el-button>
          <small>{{ whileName }}</small>
        </el-form-item>

        <!-- 护士进入超时时间 -->
        <el-form-item label="护士离开" prop="nurseIntoOutTime" :rules="[{ validator: validatorNurseIntoOut, trigger: 'blur' }]">
          护士进入
          <el-input v-model.number="configContent.nurseIntoOutTime" type="text" max="3" min="1" :show-word-limit="true" class="w60" />&nbsp; 秒后自动离开
        </el-form-item>

        <!-- 是否自动播放视频 -->
        <el-form-item label="自动播放视频" prop="name">
          <el-switch v-model="configContent.hostPlay" :active-color="switchActiveColor" />
        </el-form-item>
        <!--轮播开关-->
        <el-form-item label="是否启用轮播模式" prop="isCircle">
          <el-radio v-model="configContent.isCircle" :label="true">是</el-radio>
          <el-radio v-model="configContent.isCircle" :label="false">否</el-radio>
          <span style="color: #888; margin-left: 10px">该项设置仅对横屏门口机生效</span>
        </el-form-item>

        <!--轮播间隔-->
        <el-form-item label="轮播模式间隔" prop="circleTime" v-show="configContent.isCircle" :rules="[{ validator: validatorCircleTime, trigger: 'blur' }]">
          <el-input v-model.number="configContent.circleTime" :max="600" :min="5" type="number" :show-word-limit="true" class="w60" />&nbsp; 秒
        </el-form-item>

        <!--返回主页-->
        <el-form-item label="返回主页" prop="ReturnHomePage">
          无操作
          <el-input v-model="configContent.ReturnHomePage" oninput="value=value.replace(/[^\d]/g,')" type="text" class="w60" />&nbsp; 秒后自动返回主页
        </el-form-item>

        <!-- 终端设置 -->
        <el-form-item label="终端设置">
          <el-switch v-model="configContent.deviceSettingGate" :active-color="switchActiveColor" />
        </el-form-item>
        <!-- 是否取消点击屏幕护士进入 -->
        <el-form-item label="是否取消点击屏幕护士进入">
          <el-switch v-model="configContent.cancelClickScreenToEnter" :active-color="switchActiveColor" />
        </el-form-item>

        <!-- SBAR交班 -->
        <el-form-item label="SBAR交班">
          <el-switch v-model="configContent.SBARshiftHandover" :active-color="switchActiveColor" />
        </el-form-item>

        <!-- 横屏门口机是否显示导航栏 -->
        <el-form-item label="显示导航栏">
          <el-switch v-model="configContent.ShowNavigationBarDoor" :active-color="switchActiveColor" />
          <span style="color: #888; margin-left: 10px">该项设置仅对横屏门口机生效</span>
        </el-form-item>
        <el-form-item class="NavigationBarConfig" label="导航栏内容">
          <el-button round type="primary" size="mini" @click="NavigationBarAdd">添加</el-button>
          <section v-if="isNavigationBarShow">
            <div v-for="(item,index) in configContent.NavigationBarConfigDoor" :key="index" class="NaBarC-con">
              {{item.tabname}}
              <i class="el-icon-edit-outline" @click="NavigationBarEdit(index)" title="编辑"></i>
              <i class="el-icon-delete-solid" @click="NavigationBarDel(index,configContent.NavigationBarConfigDoor)" title="删除"></i>
              <i class="el-icon-sort-down" @click="NavigationBarSort('down',index,configContent.NavigationBarConfigDoor)" title="下移"></i>
              <i class="el-icon-sort-up" @click="NavigationBarSort('up',index,configContent.NavigationBarConfigDoor)" title="上移"></i>
              <!--<div class="show-type">显示内容：{{item.showinfotype}}</div>-->
              <ol v-if="item.showinfotype==='宣教文章'">
                <li v-for="item2 in item.showinfo" :key="item2.eduid">{{item2.allname}}</li>
              </ol>
              <ol v-if="item.showinfotype==='医护'">
                <li v-for="item2 in item.showinfo" :key="item2.empId">{{item2.empName}}</li>
              </ol>
              <ol v-if="item.showinfotype==='明星医护'">
                <li v-for="item2 in item.showinfo" :key="item2.empId">{{item2.empName}}</li>
              </ol>
            </div>
          </section>
        </el-form-item>

        <el-divider>
          <h2 id="divider2">呼叫设置</h2>
        </el-divider>

        <!-- 呼叫需要验证 -->
        <div class="el-form-item-left">
          <el-form-item label="呼叫需要验证">
            <el-switch v-model="configContent.callToVerifyGate" :active-color="switchActiveColor" />
          </el-form-item>
          <el-form-item prop="callToVerifyPasswordGate" :rules="[
              {
                required: configContent.callToVerifyGate,
                message: '不能为空',
                trigger: 'blur',
              },
              // { min: 1, max: 7, message: '长度在 1 到 7 个数字', trigger: 'blur' }
              { validator: (rule, value, callback) => {
                if(String(value).length < 1 || String(value).length > 7) {
                  callback('长度在1到7个数字')
                } else {
                  callback()
                }
              }, trigger: 'blur'}
            ]">
            验证密码
            <el-input v-model="configContent.callToVerifyPasswordGate" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" :disabled="!configContent.callToVerifyGate" class="w150" />
          </el-form-item>
        </div>

        <!--呼叫转移-->
        <!-- <el-form-item label="呼叫转移">
          <el-switch
            v-model="configContent.callForwarding"
            :active-color="switchActiveColor"
          />
        </el-form-item>-->

        <!--清除呼叫-->
        <!-- <el-form-item label="清除呼叫">
          <el-switch
            v-model="configContent.callClear"
            :active-color="switchActiveColor"
          />
        </el-form-item>-->

        <el-divider>
          <h2 id="divider3">硬件控制</h2>
        </el-divider>
        <!-- 门灯颜色 - 护士进入 -->
        <el-form-item label="门灯颜色 - 护士进入">
          <el-color-picker v-model="configContent.colorNurseGate" :predefine="predefineColors" />
        </el-form-item>

        <!-- 门灯颜色 - 卫生间呼叫 -->
        <el-form-item label="门灯颜色 - 卫生间呼叫">
          <el-color-picker v-model="configContent.colorToiletGate" :predefine="predefineColors" />
        </el-form-item>

        <!-- 门灯颜色 - 护理级别 -->
        <el-form-item label="门灯颜色 - 护理级别">
          <el-row :gutter="10">
            <el-col v-for="(item, index) in configContent.colorLevelGate" :key="index" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <div>{{ item.nurseLevelName }}</div>
              <el-color-picker v-model="configContent.colorLevelGate[index].nurseLevelColor" :predefine="predefineColors" />
              <!-- </template> -->
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 终端音量 -->
        <el-form-item label="终端音量">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.volumeGate[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }" :clearable="false" placeholder="选择时间" style="width: 100%" />
                <el-select class="volume-select" v-model="configContent.volumeGate[index].Vol" placeholder="请选择音量" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 广播音量 -->
        <el-form-item label="广播音量">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.radioVolumeGate[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }" :clearable="false" placeholder="选择时间" style="width: 100%" />
                <el-select class="volume-select" v-model="configContent.radioVolumeGate[index].Vol" placeholder="请选择音量" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in volumeOptionsList2" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 终端亮度 -->
        <el-form-item label="终端亮度">
          <el-row :gutter="10">
            <el-col v-for="(o, index) in 4" :key="o" :xs="12" :sm="6" :md="5" :lg="5" :xl="4" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" shadow="never" style="padding: 10px">
                <el-time-picker v-model="configContent.lightGate[index].Time" format="HH:mm:ss" value-format="HH:mm:ss" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }" :clearable="false" placeholder="选择时间" style="width: 100%" />
                <el-select class="light-select" v-model="configContent.lightGate[index].Light" placeholder="请选择亮度" style="width: 100%; margin-top: 10px">
                  <el-option v-for="item in lightOptionsList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 定时启动屏保时间 -->
        <el-form-item label="定时启用屏保时间">
          <el-switch v-model="configContent.iscloseScreenDoorHost" :active-color="switchActiveColor" />
        </el-form-item>

        <el-form-item>
          <el-time-picker v-model="configContent.closeScreenDoorHost.startTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenDoorHost" />-
          <el-time-picker v-model="configContent.closeScreenDoorHost.endTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="选择开始时间" :clearable="false" :disabled="!configContent.iscloseScreenDoorHost" />
        </el-form-item>

        <el-form-item prop="brightViewDoorHost">
          点亮屏幕
          <el-input v-model.trim="configContent.brightViewDoorHost" type="text" maxlength="4" class="w60" :disabled="!configContent.iscloseScreenDoorHost" />秒后自动显示屏保
        </el-form-item>

        <!-- 重启终端 -->
        <el-form-item label="重启终端">
          <el-button round type="primary" size="mini" @click="rebootEC(deviceType.ecDoorwayExtension)">重启</el-button>
        </el-form-item>

        <!-- 门灯调度 -->
        <!-- <el-form-item label="门灯调度" prop="name">
          <el-switch v-model="configContent.doorLampOpen" :active-color="switchActiveColor" />
        </el-form-item> -->

        <!-- 定时重启 -->
        <el-form-item label="定时重启">
          <el-switch v-model="configContent.autoRestarGate.state" :active-color="switchActiveColor" />每天
          <el-time-picker v-model="configContent.autoRestarGate.time" format="HH:mm:ss" value-format="HH:mm:ss" :clearable="false" :disabled="!configContent.autoRestarGate.state" class="w120" />时间，自动重启
        </el-form-item>

        <!-- <el-form-item label="查房功能">
          <el-switch v-model="configContent.isWardRoundGate" :active-color="switchActiveColor" />
        </el-form-item>-->

        <!-- 呼叫密码 -->
        <!-- <el-form-item label="呼叫密码" prop="callPasswordGate">
          <el-input
            v-model.trim="configContent.callPasswordGate"
            type="text"
            maxlength="7"
            :show-word-limit="true"
            class="w150"
          />
        </el-form-item>-->
      </el-form>

      <el-row class="top-24 save-view" style="text-align: center">
        <el-button @click="goParent">取消</el-button>
        <el-button type="primary" @click.prevent.stop="saveConfig(deviceConfigName)">保存</el-button>
      </el-row>
    </el-main>
    <!--选择宣教内容-->
    <el-dialog title="选择宣教内容" :visible.sync="eduDialogVisible" width="60%" :close-on-click-modal="false" :close-on-press-escape="false">
      <!--:default-expanded-keys="[configContent.education.educationId]"
      :default-checked-keys="[configContent.education.educationId]"-->
      <div style="max-height: 50vh;overflow: auto">
        <el-tree id="eduDialogTreeForm" ref="treeForm" :data="content_data" :default-expand-all="true" highlight-current accordion show-checkbox :check-strictly="true" check-on-click-node node-key="id" @check="handleClick" :default-expanded-keys="eduExpandedKeys" :default-checked-keys="eduCheckedKeys"></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="chooseContent">保存</el-button>
      </span>
    </el-dialog>
    <!--导航栏内容设置-->
    <el-dialog title="导航栏内容设置" :visible.sync="NavbarConVisible" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" class="NavbarCon-dialog">
      <div>
        <el-form ref="NavigationBarDia" :model="NavigationBarDia" :rules="rulesNavigationBar" label-width="160px">
          <el-form-item label="页面类型:" prop="tabid">
            <el-select v-model="NavigationBarDia.tabid" placeholder="请选择" @change="NavigationBarTypeChange">
              <el-option v-for="item in NavigationBarInfo" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <!--<el-input
              v-model.trim="NavigationBarDia.tabid"
              type="text"
            />-->
          </el-form-item>
          <el-form-item label="导航菜单名称:" prop="tabname">
            <el-input v-model.trim="NavigationBarDia.tabname" type="text" />
          </el-form-item>
          <el-form-item label="显示内容:" v-if="NavigationBarType !== '安卓页面'">
            <section v-if="NavigationBarType === '宣教文章'">
              <el-button round type="primary" size="mini" @click="eduDialogToggle">选择宣教文章</el-button>
              <ol v-if="isNavigationBarShow">
                <li v-for="(item2,index2) in NavigationBarDia.showinfo" :key="item2.eduid">
                  {{item2.allname}}
                  <i class="el-icon-delete-solid" @click="NavigationBarDel(index2,NavigationBarDia.showinfo)" title="删除"></i>
                  <i class="el-icon-sort-down" @click="NavigationBarSort('down',index2,NavigationBarDia.showinfo)" title="下移"></i>
                  <i class="el-icon-sort-up" @click="NavigationBarSort('up',index2,NavigationBarDia.showinfo)" title="上移"></i>
                </li>
              </ol>
            </section>
            <section v-else-if="NavigationBarDia.showinfotype == '医护'">
              <el-button round type="primary" size="mini" @click="showDialogMedical">选择医护</el-button>
              <ol>
                <li v-for="(item2,index2) in NavigationBarDia.showinfo" :key="item2.eduid">
                  {{item2.empName}}
                  <i class="el-icon-delete-solid" @click="NavigationBarDel(index2,NavigationBarDia.showinfo)" title="删除"></i>
                  <i class="el-icon-sort-down" @click="NavigationBarSort('down',index2,NavigationBarDia.showinfo)" title="下移"></i>
                  <i class="el-icon-sort-up" @click="NavigationBarSort('up',index2,NavigationBarDia.showinfo)" title="上移"></i>
                </li>
              </ol>
            </section>
            <section v-else-if="NavigationBarDia.showinfotype == '明星医护'">
              <el-button round type="primary" size="mini" @click="showDialogStarMedical">选择明星医护</el-button>
              <ol>
                <li v-for="(item2,index2) in NavigationBarDia.showinfo" :key="item2.eduid">
                  {{item2.empName}}
                  <i class="el-icon-delete-solid" @click="NavigationBarDel(index2,NavigationBarDia.showinfo)" title="删除"></i>
                  <i class="el-icon-sort-down" @click="NavigationBarSort('down',index2,NavigationBarDia.showinfo)" title="下移"></i>
                  <i class="el-icon-sort-up" @click="NavigationBarSort('up',index2,NavigationBarDia.showinfo)" title="上移"></i>
                </li>
              </ol>
            </section>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="NavbarConCancel">取消</el-button>
        <el-button type="primary" @click="NavbarConSave">保存</el-button>
      </span>
    </el-dialog>
    <!--明星医护设置-->
    <StarMedical ref="comStarMedical" v-if="showDialogStarMedicalVisiable" @chooseMedical="chooseStarMedical"></StarMedical>

    <!--医护选择弹窗-->
    <DialogMedical ref="comDialogMedical" v-if="showDialogMedicalVisiable" @chooseMedical="chooseMedical"></DialogMedical>
  </el-container>
</template>

<script>
import "./systemConfig.css";
import configMixin from "./mixin";
import { deepClone } from "@/assets/wnms/utils";
import deptInsideMenu from "@/components/wnms/deptInsideMenu/deptInsideMenu";
import DialogMedical from "@/components/wnms/sysconfig/DialogMedical";
import StarMedical from "@/components/wnms/sysconfig/StarMedical";

export default {
  name: "DoorwayDeviceConfig",
  mixins: [configMixin],
  components: { deptInsideMenu, DialogMedical, StarMedical },
  data() {
    var validatorNurseIntoOut = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("设置范围值1~10000s"));
      }
      if (!/(^[1-9]\d*$)/.test(value)) {
        return callback(new Error("设置范围值1~10000s"));
      }
      if (value > 10000 || value < 1) {
        return callback(new Error("设置范围值1~10000s"));
      } else {
        callback();
      }
    };
    var validatorReturnHomePage = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("设置范围值1~1000s"));
      }
      if (!/(^[1-9]\d*$)/.test(value)) {
        return callback(new Error("设置范围值1~1000s"));
      }
      if (value > 1000 || value < 1) {
        callback(new Error("设置范围值1~1000s"));
      } else {
        callback();
      }
    };
    var validatorCircleTime = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error("轮播模式间隔不能为空"));
      }
      if (!/(^[1-9]\d*$)/.test(value)) {
        return callback(new Error("设置范围值5~600s"));
      }
      if (value > 600 || value < 5) {
        callback(new Error("设置范围值5~600s"));
      } else {
        callback();
      }
    };

    return {
      // 锚点列表
      anchorList: [
        {
          src: "divider1",
          title: "页面设置"
        },
        {
          src: "divider2",
          title: "呼叫设置"
        },
        {
          src: "divider3",
          title: "硬件控制"
        }
      ],
      validatorCircleTime: validatorCircleTime,
      validatorNurseIntoOut: validatorNurseIntoOut,
      validatorReturnHomePage: validatorReturnHomePage,
      showDialogMedicalVisiable: false, // 展示医护选择弹窗
      showDialogStarMedicalVisiable: false, // 展示明星医护选择弹窗
      NavigationBarType: "安卓页面",
      NavigationBarInfo: [
        { id: "roominfo", name: "房间信息页", type: "安卓页面" },
        { id: "doctorinfo", name: "医护列表页", type: "安卓页面" },
        { id: "starinfo", name: "明星医护页", type: "明星医护" },
        { id: "pages", name: "多篇文章页", type: "宣教文章" },
        { id: "pageone", name: "单篇文章页", type: "宣教文章" },
        { id: "MedicalDisplay", name: "医护简介页", type: "医护" }
      ],
      NavigationBarDia: {}, // 导航栏配置临时数据
      NavigationBarEditKey: null, // 导航编辑索引
      isNavigationBarShow: true,
      i: 0,
      // 宣教弹窗
      eduDialogVisible: false,
      NavbarConVisible: false, // 导航栏内容设置
      treeCheckedArray: [], // 宣教文章多选时，选中的值
      content_data: [],
      eduExpandedKeys: [], // 宣教树，默认展开节点
      eduCheckedKeys: [], // 宣教树，默认选中节点
      EDUid_name: [], // 宣教id对应名称、全名
      treeCheckedObj: {
        checked: "",
        whileName: "",
        label: ""
      },
      oldCallToVerifyPasswordGate: null, // 暂存呼叫需要验证
      whileName: "", // tree 标题
      // 配置页面名称
      deviceConfigName: "doorway",
      configContentJSON:
        '{"hostPlay":false,"SBARshiftHandover": false,"iscloseScreenDoorHost":true,"brightViewDoorHost":"30","closeScreenDoorHost":{"startTime":"23:00:00","endTime":"05:00:00"},"circleTime":10,"isCircle":false,"isdoorshow":"doorall","cancelClickScreenToEnter":false,"isShowNameGate":false,"selectHealthCareList":[],"deviceSettingGate":false,"isCallGate":true,"callToVerifyGate":true,"callToVerifyPasswordGate":3585668,"isWardRoundGate":true,"roomModelGate":"0","isFilterNameGate":true,"education":{"educationId":"","educationTitle":""},"colorNurseGate":"#FF00FF","colorToiletGate":"#FF0000","nurseIntoOutTime":100,"ReturnHomePage":"30","colorLevelGate":[],"volumeGate":[{"Time":"08:00:00","Vol":"10"},{"Time":"12:00:00","Vol":"8"},{"Time":"14:00:00","Vol":"10"},{"Time":"18:00:00","Vol":"6"}],"radioVolumeGate":[{"Time":"08:00:00","Vol":"5"},{"Time":"12:00:00","Vol":"5"},{"Time":"14:00:00","Vol":"5"},{"Time":"18:00:00","Vol":"5"}],"lightGate":[{"Time":"08:00:00","Light":"50"},{"Time":"12:00:00","Light":"50"},{"Time":"14:00:00","Light":"50"},{"Time":"18:00:00","Light":"50"}],"autoRestarGate":{"state":false,"time":"08:00:00"},"isShowDeptName":false,"deptNameColor":"#D7B369"}',
      // 配置内容
      configContent: null,
      checkedkey: [],
      defaultProps: {
        children: "child",
        label: "moduleName",
        id: "moduldCode" // 可要可不要
      },
      deviceSettingGate: false,
      ShowNavigationBarDoor: false, // 横屏门口机是否显示导航栏
      NavigationBarConfigDoor: [], // 横屏门口机导航栏内容
      // 取uniqueValue值的时候，列：uniqueValue[0]否则会是一个数组
      uniqueValue: "" // 最后拿到的唯一选择的moduldCode值,相当于id
    };
  },
  async mounted() {
    // 获取宣教文章
    // this.getEducationData();
    // this.getNursingLevel(this.nurseUnitId);
  },
  created() {
    this.configContent = JSON.parse(this.configContentJSON);
  },
  watch: {
    // 处理呼叫验证密码
    "configContent.callToVerifyGate": function (val, oldval) {
      if (val) {
        this.configContent.callToVerifyPasswordGate =
          this.oldCallToVerifyPasswordGate;
      } else {
        this.configContent.callToVerifyPasswordGate = null;
      }
    },
    "configContent.deviceSettingGate": function (val, old) {
      this.deviceSettingGate = val;
    }
  },
  methods: {
    /**
     * 横屏门口机导航栏配置
     * @constructor
     */
    // 展示选择明星医护的弹窗
    showDialogStarMedical() {
      this.showDialogStarMedicalVisiable = true;
      this.$nextTick(() => {
        this.$refs.comStarMedical.init({
          showinfo: JSON.stringify(this.NavigationBarDia.showinfo)
        });
      });
    },
    // 展示选择医护的弹窗
    showDialogMedical() {
      this.showDialogMedicalVisiable = true;
      this.$nextTick(() => {
        let arr = [];
        for (let v of this.NavigationBarDia.showinfo) {
          arr.push(v.empId);
        }
        this.$refs.comDialogMedical.init({
          SingleChoice: true,
          check: deepClone(arr),
          deptId: this.deptId
        });
      });
    },
    // 确认选择内容
    chooseMedical(check) {
      this.NavigationBarDia.showinfo = check;
      let arr = [];
      for (let v of check.values()) {
        arr.push(v.empId);
      }
      this.NavigationBarDia.medicalids = arr.join(",");
    },
    // 明星医护确认弹窗
    chooseStarMedical(arr) {
      this.NavigationBarDia.showinfo = JSON.parse(arr);
    },
    NavigationBarTypeChange(value) {
      this.$refs["NavigationBarDia"].clearValidate();
      let v = this.NavigationBarInfo.find((vv, ii) => {
        return vv.id === value;
      });
      if (v) this.NavigationBarType = v.type;
      this.NavigationBarDia.showinfotype = this.NavigationBarType;
      this.NavigationBarDia.showinfo = [];
    },
    // 门口机导航栏---添加
    NavigationBarAdd() {
      if (!this.configContent.NavigationBarConfigDoor) {
        this.configContent.NavigationBarConfigDoor = [];
      }
      this.NavigationBarDia = {
        tabid: "",
        tabname: "",
        showinfotype: "安卓页面",
        showinfo: [],
        eduids: "", // 宣教ids
        medicalids: "" // 医护ids
      };
      this.NavigationBarType = "安卓页面";
      this.NavbarConVisible = true;
      this.NavigationBarEditKey = null;
      this.$nextTick(() => {
        this.$refs["NavigationBarDia"].clearValidate();
      });
    },
    // 门口机导航栏---编辑
    NavigationBarEdit(ii) {
      this.NavigationBarEditKey = ii;
      this.NavigationBarDia = deepClone(
        this.configContent.NavigationBarConfigDoor[ii]
      );
      this.NavigationBarType = this.NavigationBarDia.showinfotype;
      this.NavbarConVisible = true;
    },
    // 门口机导航栏---删除
    NavigationBarDel(ii, OBJ) {
      this.isNavigationBarShow = false;
      OBJ.splice(ii, 1);
      this.$nextTick(() => {
        this.isNavigationBarShow = true;
      });
    },
    // 门口机导航栏---排序
    NavigationBarSort(f, ii, OBJ) {
      let newA = deepClone(OBJ[ii]);
      if (f === "up" && ii === 0) {
        this.$message.warning("已经在第一个！");
        return;
      }
      if (f === "down" && ii === OBJ.length - 1) {
        this.$message.warning("已经在最后一个！");
        return;
      }
      this.isNavigationBarShow = false;
      OBJ.splice(ii, 1);
      let i;

      if (f === "up") {
        i = ii - 1;
      } else if (f === "down") {
        i = ii + 1;
      }
      OBJ.splice(i, 0, newA);
      this.isNavigationBarShow = false;
      this.$nextTick(() => {
        this.isNavigationBarShow = true;
      });
    },
    NavbarConCancel() {
      this.NavbarConVisible = false;
    },
    // 门口机导航栏---弹窗-保存点击
    NavbarConSave() {
      console.log(
        "门口机导航栏取人（this.NavigationBarDia）：",
        JSON.stringify(this.NavigationBarDia)
      );
      this.$refs["NavigationBarDia"].validate((valid) => {
        if (valid) {
          if (this.NavigationBarType === "宣教文章") {
            if (
              !this.NavigationBarDia.showinfo ||
              this.NavigationBarDia.showinfo.length === 0
            ) {
              this.$message.warning("请选择宣教文章！");
              return;
            }
            if (
              this.NavigationBarDia.tabid === "pageone" &&
              this.NavigationBarDia.showinfo.length > 1
            ) {
              this.$message.warning("单篇文章页只能选择1篇宣教文章！");
              return;
            }
            let arr = [];
            for (let v of this.NavigationBarDia.showinfo) {
              arr.push(v.eduid);
            }
            this.NavigationBarDia.eduids = arr.join(",");
          } else if (
            this.NavigationBarType === "医护" ||
            this.NavigationBarType === "明星医护"
          ) {
            if (
              !this.NavigationBarDia.showinfo ||
              this.NavigationBarDia.showinfo.length === 0
            ) {
              this.$message.warning("请选择医护！");
              return;
            }
            let arr = [];
            for (let v of this.NavigationBarDia.showinfo) {
              arr.push(v.empId);
            }
            this.NavigationBarDia.medicalids = arr.join(",");
          }
          if (this.NavigationBarEditKey !== null) {
            this.configContent.NavigationBarConfigDoor[
              this.NavigationBarEditKey
            ] = deepClone(this.NavigationBarDia);
          } else {
            this.configContent.NavigationBarConfigDoor.push(
              deepClone(this.NavigationBarDia)
            );
          }
          this.NavbarConCancel();
        }
      });
    },
    NavigationBarDiaTypeChange() {
      this.NavigationBarDia.showinfo = "";
    },
    eduNavigationBarDel(ii) {
      this.isNavigationBarShow = false;
      this.NavigationBarDia.showinfo.splice(ii, 1);
      this.$nextTick(() => {
        this.isNavigationBarShow = true;
      });
    },
    // 是否是数字
    isNumber(obj) {
      return typeof obj === "number" && isFinite(obj);
    },
    // 宣教弹窗
    eduDialogToggle() {
      // 获取宣教文章
      this.getEducationData();
      this.eduDialogVisible = !this.eduDialogVisible;
    },

    // 取消
    cancel() {
      this.treeCheckedObj = {
        checked: "",
        whileName: "",
        label: ""
      };

      this.eduDialogVisible = false;
    },
    treeFindPath(tree, func, path = []) {
      if (!tree) return [];
      for (const data of tree) {
        // 这里按照你的需求来存放最后返回的内容吧
        path.push(data.label);
        if (func(data)) return path;
        if (data.children) {
          const findChildren = this.treeFindPath(data.children, func, path);
          if (findChildren.length) return findChildren;
        }
        path.pop();
      }
      return [];
    },
    chooseContent() {
      if (this.NavbarConVisible) {
        // 导航栏设置宣教时
        if (this.treeCheckedArray.length === 0) {
          this.$message.error("未选择文章！");
          return;
        }

        if (!Array.isArray(this.NavigationBarDia.showinfo)) {
          this.NavigationBarDia.showinfo = [];
        }
        this.NavigationBarDia.showinfo = this.treeCheckedArray;
      } else {
        const getCheckedNodes = this.$refs.treeForm.getCheckedNodes() || [];
        // if (getCheckedNodes.length < 0) {
        //   this.$message.error("未选择文章！");
        //   return;
        // }
        if (this.treeCheckedObj.checked != "") {
          this.configContent.education.educationId =
            this.treeCheckedObj.checked;
          this.configContent.education.educationTitle =
            this.treeCheckedObj.label;
          this.whileName = this.treeCheckedObj.whileName;
        } else {
          let getlabel = this.treeFindPath(
            this.content_data,
            (data) => data && getCheckedNodes[0] && data.label == getCheckedNodes[0].label
          );
          this.whileName = getlabel.length > 0
            ? getlabel.join("-")
            : (getCheckedNodes[0]
              ? getCheckedNodes[0].label
              : '');
          if(!getlabel || !getlabel.length)  {
            this.configContent.education.educationId = ''
            this.configContent.education.educationTitle = ''
          }
        }
      }

      this.cancel();
    },

    // 选择宣教文章
    handleClick(data, checked, node) {
      if (data.children) return;
      // 导航配置选择宣教时，需多选
      this.treeCheckedArray = [];
      if (this.NavbarConVisible) {
        for (let vv of checked.checkedNodes.values()) {
          let edu = this.EDUid_name.find((v, i) => {
            return v.id === vv.id;
          });
          let o = {
            eduid: vv.id,
            eduname: vv.label,
            allname: edu.whileName,
            sort: this.treeCheckedArray.length
          };
          this.treeCheckedArray.push(o);
        }
        return;
      }
      if (checked.checkedKeys.length === 0) {
        this.$refs.treeForm.setCheckedNodes([]);
        this.treeCheckedObj = {
          checked: "",
          whileName: "",
          label: ""
        };
      } else {
        this.$refs.treeForm.setCheckedNodes([data]);
        this.treeCheckedObj.label = data.label;
        this.treeCheckedObj.checked = data.id;

        let key = data.id;
        for (let v of this.content_data.values()) {
          if (v.id === key) {
            this.treeCheckedObj.whileName = v.label;
          } else if (v.children !== null) {
            for (let v2 of v.children.values()) {
              if (v2.id === key) {
                this.treeCheckedObj.whileName = v.label + "-" + v2.label;
              } else if (v2.children !== null) {
                for (let v3 of v2.children.values()) {
                  if (v3.id === key) {
                    this.treeCheckedObj.whileName =
                      v.label + "-" + v2.label + "-" + v3.label;
                  }
                }
              }
            }
          }
        }
      }
    },
    // 锚点定位
    onAnchor(id) {
      document.querySelector(`#${id}`).scrollIntoView(true);
    },
    // 循环 tree 标题
    dealWholeLabel() {
      this.EDUid_name = [];
      for (let v of this.content_data.values()) {
        if (v.children === null) {
          let o = {
            id: v.id,
            name: v.label,
            whileName: v.label
          };
          this.EDUid_name.push(o);
        } else if (v.children !== null) {
          for (let v2 of v.children.values()) {
            if (v2.children === null) {
              let o = {
                id: v2.id,
                name: v2.label,
                whileName: v.label + "-" + v2.label
              };
              this.EDUid_name.push(o);
            } else if (v2.children !== null) {
              for (let v3 of v2.children.values()) {
                let o = {
                  id: v3.id,
                  name: v3.label,
                  whileName: v.label + "-" + v2.label + "-" + v3.label
                };
                this.EDUid_name.push(o);
              }
            }
          }
        }
      }
      // 设置默认选中节点
      if (this.NavbarConVisible) {
        console.log("选中节点：", this.NavigationBarDia.showinfo);
        this.eduExpandedKeys = [];
        this.eduCheckedKeys = [];
        if (!Array.isArray(this.NavigationBarDia.showinfo)) return;
        for (let v of this.NavigationBarDia.showinfo.values()) {
          if (v && v.eduid) {
            this.eduExpandedKeys.push(v.eduid);
            this.eduCheckedKeys.push(v.eduid);
          }
        }
        this.treeCheckedArray = this.NavigationBarDia.showinfo;
      } else {
        this.eduExpandedKeys = [this.configContent.education.educationId];
        this.eduCheckedKeys = [this.configContent.education.educationId];
      }
    }
  }
};
</script>
<style lang="scss">
.NavbarCon-dialog {
  .el-dialog {
    .el-dialog__body {
      > div {
        width: 85%;
        .el-form {
          .el-form-item {
            ol {
              li {
                i {
                  font-size: 19px;
                  margin: 0 5px;
                  color: #1e87f0;
                  cursor: pointer;
                }
                .el-icon-delete-solid {
                  color: #ff4f00;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scope>
.NavigationBarConfig {
  .el-form-item__content {
    .NaBarC-con {
      font-size: 16px;
      margin: 15px;
      i {
        font-size: 19px;
        margin: 0 5px;
        color: #1e87f0;
        cursor: pointer;
      }
      .el-icon-delete-solid {
        color: #ff4f00;
      }
      .show-type,
      ol {
        padding-left: 30px;
        font-size: 14px;
        color: #919191;
      }
    }
  }
}
#eduDialogTreeForm {
  .el-tree-node {
    .el-checkbox__inner {
      display: none !important;
    }
    &
      > .el-tree-node__children
      > .el-tree-node
      .el-tree-node__children
      .el-checkbox__inner {
      display: inline-block !important;
    }
  }
}
.top-view {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
}

.anchor-view {
  border: 1px solid #409eff;
  border-radius: 4px;
  display: flex;
  background-color: #fff;
}

.anchor-view div {
  padding: 6px 15px;
  color: #409eff;
  border-right: 1px solid #409eff;
  cursor: pointer;
}

.anchor-view div:last-child {
  border: none !important;
}
.save-view {
  background-color: #fff;
  position: sticky;
  bottom: -20px;
  padding: 20px 0;
  z-index: 20;
}
.star-dialog {
  .el-dialog__body {
    padding: 0 0 10px 0 !important;
  }
}
.star-view {
  height: 55vh;
  display: flex;
  border-bottom: 1px solid #dedfdf;

  .star-view-block {
    display: flex;
    flex-direction: column;
    .star-view-list-title {
      padding: 3px 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #dedfdf;
      background-color: #f5f7fa;
      font-size: 16px;
    }
    .star-view-list {
      flex: 1;
      width: 100%;
      overflow: auto;
      padding: 5px 0;
      .star-view-empty {
        text-align: center;
        padding: 50px 0;
        color: #888;
      }
      .star-view-item {
        position: relative;
        padding: 8px 10px;
        cursor: pointer;
        &:hover {
          background-color: #f5f7fa;
        }

        &:hover .star-view-item-btns {
          display: flex;
        }

        .star-view-item-btns {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          display: none;
          align-items: center;
          padding: 0 10px 0 0;
        }
      }
      .star-view-item-active-dept {
        background-color: #f5f7fa !important;
      }
      .star-view-item-active-healthcare {
        background-color: #f5f7fa !important;
        &::after {
          position: absolute;
          top: 8px;
          right: 25px;
          box-sizing: border-box;
          width: 8px;
          height: 16px;
          transform: rotate(45deg);
          border-width: 2px;
          border-style: solid;
          border-color: #1e87f0;
          border-top: 0;
          border-left: 0;
          position: absolute;
          content: "";
        }
      }
    }
  }
  .star-view-left {
    width: 260px;
    height: 100%;
  }
  .star-view-center {
    flex: 1;
    height: 100%;
    border-left: 1px solid #dedfdf;
    border-right: 1px solid #dedfdf;
  }
  .star-view-right {
    flex: 1;
    height: 100%;
  }
}

.depts-tree {
  .is-current {
    background-color: #f5f7fa;
  }
}
// 去掉数字输入框的箭头
/*谷歌*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/*火狐*/
input[type="number"] {
  -moz-appearance: textfield;
}

// 颜色选择器的 清空按钮隐藏===因为当点击清空之后，原来的颜色无法再选中==yxb
.el-color-dropdown__btns {
  .el-button--text {
    display: none;
  }
}
</style>
