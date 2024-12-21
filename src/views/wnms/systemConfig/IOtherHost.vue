<!--
 * @Author: 王纪祥
 * @Owner: 王纪祥
 * @Date: 2022-02-23 10:20:09
 * @LastEditTime: 2022-11-03 10:40:29
 * @LastEditors: 王纪祥
 * @Description: 
 * @FilePath: \yarward-wnms-frontEnd\src\views\wnms\systemConfig\IOtherHost.vue
-->
<template>
  <!-- i系列分机跨终端配置 -->
  <el-container class="setting-main">
    <el-main>
			<deptInsideMenu
        @dataInit="reLoadData"
        :deptId="deptId"
        :anchorList="anchorList"
        loadData
        :disabled="deptDisabled"
      ></deptInsideMenu>
      <el-form ref="configContent" :model="configContent" :rules="rules" label-width="160px">
				<el-divider>
          <h2 id="divider1">页面设置</h2>
        </el-divider>
				<div style="display: flex">
					<el-form-item label="刷卡功能是否开启" prop="iccardOpen">
          	<el-switch
            	v-model="configContent.iccardOpen"
            	:active-color="switchActiveColor"
            	active-value="1"
            	inactive-value="0"
              @change="onIccardOpen"
          	/>
        	</el-form-item>
					<el-form-item label="刷卡声音是否开启" prop="iccardMute">
						<el-switch
              :disabled="configContent.iccardOpen == '0'"
            	v-model="configContent.iccardMute"
            	:active-color="switchActiveColor"
            	active-value="0"
            	inactive-value="1"
          	/>
        	</el-form-item>
				</div>
				<el-form-item label="护士离开" prop="nurseInTimeout" :rules="[{ validator: validatorNurseIntoOut, trigger: 'blur' }]">
          护士进入
          <el-input v-model="configContent.nurseInTimeout" type="text" max="3" min="1" :show-word-limit="true" class="w60" />&nbsp; 分钟后自动离开
        </el-form-item>
				<el-form-item label="护士进入/离开声音提示" prop="nurseInMute">
					<el-switch
            v-model="configContent.nurseInMute"
            :active-color="switchActiveColor"
            active-value="0"
            inactive-value="1"
          />
				</el-form-item>
        <!-- <el-form-item label="宕机呼叫主机">
          <el-select v-model="configContent.downtimeCallIp" placeholder="请选择">
            <el-option v-for="item in medicalMainframeList" :key="item.deviceId" :label="item.deviceName+'（'+item.deviceModel+'）'" :value="item.ip"></el-option>
          </el-select>
        </el-form-item> -->
				<el-form-item label="健康宣教二维码" prop="eduQrCode">
					<v-upload-image :imageObj="imageObj.eduQrCode" ref="imgQr"></v-upload-image>
				</el-form-item>
				<el-divider>
          <h2 id="divider2">硬件控制</h2>
        </el-divider>
        <!-- 指示灯颜色 - 护士进入 -->
        <el-form-item label="指示灯颜色 - 护士进入">
          <el-color-picker v-model="configContent.colorNurseGate" :predefine="predefineColors" />
        </el-form-item>

        <!-- 指示灯颜色 - 卫生间呼叫 -->
        <el-form-item label="指示灯颜色 - 卫生间呼叫">
          <el-color-picker v-model="configContent.colorToiletGate" :predefine="predefineColors" />
        </el-form-item>

        <!-- 指示灯颜色 - 护理级别 -->
        <el-form-item label="指示灯颜色 - 护理级别">
          <el-row :gutter="10">
            <el-col
              v-for="(item, index) in configContent.colorLevelGate"
              :key="index"
              :xs="12"
              :sm="6"
              :md="5"
              :lg="5"
              :xl="4"
              style="margin-bottom: 10px"
            >
              <div>{{ item.nurseLevelName }}</div>
              <el-color-picker
                v-model="configContent.colorLevelGate[index].nurseLevelColor"
                :predefine="predefineColors"
              />
              <!-- </template> -->
            </el-col>
          </el-row>
        </el-form-item>
			</el-form>
			<el-row class="top-24 save-view" style="text-align: center">
        <el-button type="primary" @click.prevent.stop="saveConfig(deviceConfigName)">保存</el-button>
      </el-row>
		</el-main>
	</el-container>
</template>

<script>
import "./systemConfig.css";
import configMixin from "./mixin";
import * as API from "@/api/wnms/msgManage/systemConfig";
import getStorageUser from '@/assets/wnms/utils/storageUser';
import deptInsideMenu from '@/components/wnms/deptInsideMenu/deptInsideMenu';
import vUploadImage from "@/components/wnms/Upload/CropperUploadImg.vue";
export default {

  name: 'IOtherHost',

  mixins: [configMixin],

  components: { deptInsideMenu, vUploadImage },

  data () {
		var validatorNurseIntoOut = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("设置范围值1~30分钟"));
      }
      if (!/(^[1-9]\d*$)/.test(value)) {
        return callback(new Error("设置范围值1~30分钟"));
      }
      if (value > 30 || value < 1) {
        return callback(new Error("设置范围值1~30分钟"));
      } else {
        callback();
      }
    };
    return {
      validatorNurseIntoOut,
			imageObj: {
				eduQrCode: {
					imglable: "",
          avatar: "avatar",
          imgType: "oldman",
          imageUrl: ""
				}
			},
      anchorList: [
        {
          src: "divider1",
          title: "页面设置"
        },
        {
          src: "divider2",
          title: "硬件控制"
        }
      ],
      // 配置页面名称
      deviceConfigName: "iOther",
      // 配置内容
      configContent: {
        nurseInTimeout: '10',
        colorNurseGate: "#FF00FF",
        colorToiletGate: "#FF0000",
        // 护理级别列表
        colorLevelGate: [],
        iccardOpen: '1',              //IC刷卡开关, 0:关闭; 1:开启;
        iccardMute: '0',              //IC刷卡静音, 0:叮咚; 1:静音;
        nurseInMute: '0',             //护士进入离开静音, 0:发声; 1:静音;
				eduQrCode: '',
        // downtimeCallIp: '',
        // downtimeCallId: ''
      },
      medicalMainframeList: [],
    };
  },

  async mounted () {
    this.addRules();
  },

  watch: {
    // 'configContent.downtimeCallIp': function(newVal) {
    //   if(!newVal) {
    //     this.configContent.downtimeCallId = ""
    //     return
    //   }
    //   const device = this.medicalMainframeList.find(item => item.ip === newVal)
    //   if(device) {
    //     this.configContent.downtimeCallId = device.deviceId
    //   }
    // }
  },

  methods: {
    /**
    * @description: 获取配置
    * @param {*} deviceType
    * @return {*}
    */
    async getData (deviceType) {
      this.orgId = getStorageUser("orgInfo").orgId; //处理orgId获取不到的问题
      try {
        let res = await API.fetchDeviceConfig(deviceType, {
          orgId: this.orgId, // 机构ID
          nurseUnitId: this.nurseUnitId, // 护理单元ID
          deviceId: this.deviceId //  设备ID
        });
        if (res.data) {
          Object.keys(this.configContent).map(key => {
            this.configContent[key] = res.data[key];
          });
					this.imageObj.eduQrCode.imageUrl = this.configContent.eduQrCode 
        }
        // 重新组装护理级别列表，将选中的颜色加入
        const _newColorLevelListArr = this.colorLevelList.map(levelListItem => {
          this.configContent.colorLevelGate.map(colorLevelItem => {
            if (levelListItem.nurseLevelName === colorLevelItem.nurseLevelName) {
              levelListItem.nurseLevelColor = colorLevelItem.nurseLevelColor;
            }
          });

          if (!levelListItem.nurseLevelColor) levelListItem.nurseLevelColor = '';

          return levelListItem;
        });
        // this.onGetMedicalList(this.deptId)

        // 重新赋值整理好的护理级别列表
        this.configContent.colorLevelGate = JSON.parse(JSON.stringify(_newColorLevelListArr));
      } catch (error) { }
    },
		/**
     * @description: 保存配置
     * @param {*} deviceConfigName
     * @return {*}
     */
    async saveConfig () {
      this.$refs['configContent'].validate(async (valid) => {
        if (valid) {
					this.configContent.eduQrCode = this.imageObj.eduQrCode.imageUrl
          const addConfig = {
            nurseUnitId: this.nurseUnitId || null,
            config: JSON.stringify(this.configContent),
            deviceId: this.deviceId || null
          }
          try {
            let res = await API.addDeviceConfig(addConfig, this.deviceConfigName)
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.desc
              })
              this.getData(this.deviceConfigName)
            }
          } catch (error) {
            // this.$message.error(error.message || error)
          }
        } else {
          return false
        }
      })
    },
		/**
     * @description: 添加rule
     * @param {*}
     * @return {*}
     */
    addRules () {
      this.rules = {
        ...this.rules,
      }
    },
    onIccardOpen(value) {
      if(value == '0') this.configContent.iccardMute = '1'
    },
    async onGetMedicalList (deptId) {
      this.medicalMainframeList = [];
      let res = await API.getMedicalListByDeptId(deptId);
      if (res.status == 200) {
        this.medicalMainframeList = res.data.list || [];
        if(!this.configContent.downtimeCallIp) {
          this.configContent.downtimeCallIp = this.medicalMainframeList && this.medicalMainframeList.length
            ? this.medicalMainframeList[0].ip
            : ''
        } else {
          const device = this.medicalMainframeList.find(item => item.ip === this.configContent.downtimeCallIp)
          if(!device) {
            this.configContent.downtimeCallIp = ''
          }
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
</style>