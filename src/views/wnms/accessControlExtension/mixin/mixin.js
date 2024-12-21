// import store from '@/store'
import getStorageUser from '@/assets/wnms/utils/storageUser';
import * as API from '@/api/wnms/msgManage/systemConfig';
import { deepClone, getRouterQuery } from '@/assets/wnms/utils';

export default {
  data () {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
    };
    // 验证规则
    var validateRules = {
      positiveInteger: {
        reg: /^[0-9]+$/,
        msg: '请输入正整数'
      },
      minLlimit: {
        reg: /^[5-9]|([1-9][0-9]+)$/,
        msg: '不可小于5'
      },
      minLlimit5: {
        reg: /^[5-9]|[1-9][0-9]|([1-9][0-9][0-9])|([1-9][0-9][0-9][0-9])$/,
        msg: '不可小于5'
      },
      minLlimit1000: {
        reg: /^(?:\d{1,3}|1000)$/,
        msg: '取值范围0-1000'
      }
    };
    var validateMenu = (rule, value, callback) => {
      let arr = this.$refs && this.$refs.tree.getCheckedNodes();
      if (arr.length == 0 || !arr) {
        callback(new Error('至少勾选一项.'));
      } else {
        callback();
      }
    };
    var checkRulesMainHost = (rule, value, callback) => {
      setTimeout(() => {
        if (value > 100 || value < 10) {
          callback(new Error('请输入10-100以内正整数'));
        } else {
          callback();
        }
      }, 100);
    };

    let { deviceType, deviceId, singleStatus } = this.getDevice();
    return {

      // // 获取url中的参数
      // deviceData: {
      //   deviceType: deviceType,
      //   deviceId: deviceId || ''
      // },
      deptDisabled: !!deviceId, // 科室选择禁用
      yh_loading: false,
      // 验证方法
      rulesNavigationBar: {
        'tabid': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
        'tabname': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
        'showinfo': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }]

      },
      rules: {
        'menuTree': [
          { required: true, validator: validateMenu, trigger: 'change' }
        ],
        'callTimeoutDurationMainHost': [{
          min: 1,
          max: 3,
          message: '请输入10-100以内正整数',
          trigger: 'blur'
        },
        { validator: checkRulesMainHost, trigger: 'blur' }
        ],
        'bodyTmperature': [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        'brightViewMainHost': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        },
        {
          pattern: validateRules.minLlimit5.reg,
          message: validateRules.minLlimit5.msg,
          trigger: 'blur'
        }
        ],
        'brightViewDoorHost': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        },
        {
          pattern: validateRules.minLlimit5.reg,
          message: validateRules.minLlimit5.msg,
          trigger: 'blur'
        }
        ],
        'brightViewDutyHost': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        },
        {
          pattern: validateRules.minLlimit5.reg,
          message: validateRules.minLlimit5.msg,
          trigger: 'blur'
        }
        ],
        'autoBedHeadTime': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 3,
          message: '请输入3位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        }
        ],
        'isStandbyTimeBedHead': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 3,
          message: '请输入3位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        },
        {
          pattern: validateRules.minLlimit.reg,
          message: validateRules.minLlimit.msg,
          trigger: 'blur'
        }
        ],
        'MinimumRechargeAmountBedSide': [{
          required: false,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        },
        {
          pattern: validateRules.minLlimit1000.reg,
          message: validateRules.minLlimit1000.msg,
          trigger: 'blur'
        }
        ],
        'MinimumRechargeAmountBedHead': [{
          required: false,
          message: '不能为空',
          trigger: 'blur'
        }, {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        }, {
          pattern: validateRules.minLlimit1000.reg,
          message: validateRules.minLlimit1000.msg,
          trigger: 'blur'
        }],
        'controlTypeCardNumber': [{
          required: false,
          message: '不能为空',
          trigger: 'blur'
        }],
        'isStandbyTimeBedSide': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 3,
          message: '请输入3位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        },
        {
          pattern: validateRules.minLlimit.reg,
          message: validateRules.minLlimit.msg,
          trigger: 'blur'
        }
        ],
        'isStandbyBedSide.time': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 3,
          message: '请输入3位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        }
        ],
        'backDurationBedSide': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 4,
          message: '请输入4位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        },
        {
          validator: (rule, value, callback) => {
            if (value < 30) {
              callback(new Error('最少设置30秒钟.'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
        ],
        'minCostBedSide': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 5,
          message: '请输入5位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        }
        ],
        'callPasswordGate': [{
          min: 1,
          max: 7,
          message: '请输入7位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        }
        ],
        'doorGuardPasswordGuard': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 7,
          message: '请输入7位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        }
        ],
        'callToVerifyPasswordGate': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 7,
          message: '请输入7位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        }],
        'onceVisitDuration': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 3,
          message: '请输入3位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        }
        ],
        'brightViewBedHead': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 3,
          message: '请输入3位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        },
        {
          validator: (rule, value, callback) => {
            if (value < 5) {
              callback(new Error('最少设置5秒钟.'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
        ],
        'brightViewBedSide': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 3,
          message: '请输入3位以内数字',
          trigger: 'blur'
        },
        {
          pattern: validateRules.positiveInteger.reg,
          message: validateRules.positiveInteger.msg,
          trigger: 'blur'
        }
        ],
        'QRCodeLabelBedSide': [{
          max: 8,
          message: '请输入少于8个字符',
          trigger: 'change'
        }],
        'QRCodeLabelBedHead': [{
          max: 8,
          message: '请输入少于8个字符',
          trigger: 'change'
        }],

        'QRCodeBedSideText': [{
          max: 3,
          message: '请输入少于url',
          trigger: 'blur'
        }]
      },
      // 开关颜色 [激活]
      // switchActiveColor: '#13ce66',
      switchActiveColor: '',
      // Loading 状态
      loadingState: false,
      // 音量列表
      volumeOptionsList: [
        {
          value: '0',
          label: '0'
        },
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        },
        {
          value: '6',
          label: '6'
        },
        {
          value: '7',
          label: '7'
        },
        {
          value: '8',
          label: '8'
        },
        {
          value: '9',
          label: '9'
        },
        {
          value: '10',
          label: '10'
        },
        {
          value: '11',
          label: '11'
        },
        {
          value: '12',
          label: '12'
        },
        {
          value: '13',
          label: '13'
        },
        {
          value: '14',
          label: '14'
        },
        {
          value: '15',
          label: '15'
        }
      ],
      volumeOptionsList2: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        }
      ],
      // 亮度列表
      lightOptionsList: [{
        value: '1',
        label: '1'
      },
      {
        value: '2',
        label: '2'
      },
      {
        value: '3',
        label: '3'
      },
      {
        value: '4',
        label: '4'
      },
      {
        value: '5',
        label: '5'
      },
      {
        value: '6',
        label: '6'
      },
      {
        value: '7',
        label: '7'
      },
      {
        value: '8',
        label: '8'
      },
      {
        value: '9',
        label: '9'
      },
      {
        value: '10',
        label: '10'
      },
      {
        value: '20',
        label: '20'
      },
      {
        value: '30',
        label: '30'
      },
      {
        value: '40',
        label: '40'
      },
      {
        value: '50',
        label: '50'
      },
      {
        value: '60',
        label: '60'
      },
      {
        value: '70',
        label: '70'
      },
      {
        value: '80',
        label: '80'
      },
      {
        value: '90',
        label: '90'
      },
      {
        value: '100',
        label: '100'
      }
      ],
      // 床头卡模板列表
      cardTemplateList: {
        bedHead: [

        ],
        bedSide: [

        ]
      },
      // 护理级别列表
      colorLevelList: [
        // {
        //   "nurseLevelId": "1",
        //   "nurseLevelName": "特级护理",
        //   "nurseLevelShort": "特",
        //   "fontColor": "#FFFFFF",
        //   "backgroundColor": "#FF0000",
        //   "canDelete": 0,
        //   "remark": null,
        //   "userId": "wj",
        //   "orgId": null,
        //   "createTime": "2020-02-08 00:00:00"
        // }
      ],
      // 预定颜色
      predefineColors: [
        '#FF0000', // 红色
        '#00FF00', // 绿色
        '#0000FF', // 蓝色
        '#FFFF00', // 黄色
        '#00FFFF', // 青色
        '#FF00FF', // 紫色
        '#FFFFFF' // 白色
      ],
      // 分机类型
      deviceType: {
        ecBedSideExtension: 'wnBedSideExtension', // [病房呼叫设备A10] 床旁分机
        ecBedHeadExtension: 'wnBedHeadExtension', // [病房呼叫设备A10] 床头分机
        ecToiletExtension: 'wnToiletExtension', // [病房呼叫设备A10] 卫生间分机
        ecDoorwayExtension: 'wnDoorWayExtension', // [病房呼叫设备A10] 门口分机
        ecMedicalMainframe: 'wnMedicalMainframe', // [病房呼叫设备A10] 医护主机
        ecDutyExtension: 'wnDutyMainframe', // [病房呼叫设备A10] 值班室分机
        ecDoorAccessExtension: 'wnEntranceGuard', // [病房呼叫设备A10] 门禁分机
        ecCorridorScreen: 'wnCorridorScreen', // [病房呼叫设备A10] 走廊显示屏
        ecVoiceGatewayDevice: 'wnVoiceGateway', // [病房呼叫设备A10] 语音网关
        ecDoctorAssistantDevice: 'wnMedicalAudioAssistant', // [病房呼叫设备A10] 医生助手
        esMainframe: 'esMainframe', // [病房呼叫设备A10] 主机
        ecNursingScreen: 'ecNursingScreen', // [病房呼叫设备A10] 病房呼叫信息看板
        rvKinVisitExtension: 'rvKinVisitExtension' // [病房呼叫设备A10] 探视分级
      },
      // 护理单元列表
      nurseUnitList: {},
      // 护理单元 ID
      nurseUnitId: '',
      // 设备ID
      deviceId: deviceId || '', // localStorage.getItem('deviceId')
      orgId: '',
      deptId: '',
      singleStatus: singleStatus || '0' // 是否开启单个配置 0 未开启 1 开启
    };
  },
  mounted () {
    this.sysInit();
  },
  watch: {
    // 床头
    'configContent.cardTemplateBedHead.label': function (val) {
      this.cardTemplateList.bedHead.find(item => {
        if (item.label === val) {
          // this.configContent.cardTemplateBedHead.image = item.image
          this.configContent.cardTemplateBedHead.path = item.path;
        }
      });
    },
    // 床旁
    'configContent.cardTemplateBedSide.label': function (val) {
      this.cardTemplateList.bedSide.find(item => {
        if (item.label === val) {
          // this.configContent.cardTemplateBedSide.image = item.image
          this.configContent.cardTemplateBedSide.path = item.path;
        }
      });
    }
  },
  methods: {
    reLoadData (deptId) {
      this.deptId = deptId;
      this.nurseUnitId = deptId;
      console.log('科室修改deptId:', deptId, '\nthis.deviceConfigName:', this.deviceConfigName);
      // 判断是否为门口机
      if (this.deviceConfigName === 'doorway' || this.deviceConfigName === 'iDoorWayExtension') {
        // 获取护理级别列表
        this.$nextTick(() => {
          this.getNursingLevel(() => {
            // 获取初始化数据列表
            this.getData(this.deviceConfigName);
          });
        });
      } else if (this.deviceConfigName === 'other') {
        this.onGetMedicalList(this.deptId);
        // 获取初始化数据列表
        this.getData(this.deviceConfigName);
      } else {
        // 获取初始化数据列表
        this.getData(this.deviceConfigName);
      }
    },
    sysInit () {
      let _this = this;
      // url中获取deptId
      const selectDeptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {};
      this.deptId = this.$route.query.deptId || selectDeptInfo.deptId;
      this.nurseUnitId = this.$route.query.deptId || selectDeptInfo.deptId;
      // 判断是否为门口机
      if (this.deviceConfigName === 'doorway' || this.deviceConfigName === 'iDoorWayExtension' || this.deviceConfigName === 'iOther') {
        // 获取护理级别列表
        this.$nextTick(() => {
          this.getNursingLevel(() => {
            // 获取初始化数据列表
            this.getData(this.deviceConfigName);
          });
        });
      } else if (this.deviceConfigName === 'other') {
      } else {
        console.log(this, 'deviceConfigName', _this);
        // 获取初始化数据列表
        this.getData(this.deviceConfigName);
      }
      console.log(this, '结束' + _this);
    },
    /**
     * @获取配置详情
     * @param {deviceType} 设备类型
     * @param {
     *  orgId, // 机构ID
     *  nurseUnitId, // 护理单元ID
     *  deviceId //  设备ID
     * }
     * @description 获取不同分机的配置详情
     */
    getData (deviceType) {
      // alert(deviceType)
      this.yh_loading = true;
      this.orgId = getStorageUser('orgInfo').orgId; // 处理orgId获取不到的问题
      // 请求数据
      API.fetchSystemConfigDetails(deviceType, {
        orgId: this.orgId, // 机构ID
        nurseUnitId: this.nurseUnitId, // 护理单元ID
        deviceId: this.deviceId //  设备ID
      }).then(response => {
        if (response.status === 200 && response.data !== null) {
          switch (deviceType) {
            // 床旁分机
            case 'bedSide':
            case 'bedHead':
              this.configContent = JSON.parse(this.configContentJSON);
              this.$nextTick(() => {
                this.SaveData(response.data);
              });
              break;
            case 'other':
              var _data = response.data;
              let { horizontalImage, verticalImage } = _data;
              this.configContent = JSON.parse(this.configContentJSON);
              this.imageObj.horizontal.imageUrl = horizontalImage;
              this.imageObj.vertical.imageUrl = verticalImage;
              _data.audioAndVideoCallSolution = _data.audioAndVideoCallSolution || 'videoPaas';
              this.audioAndVideoCallSolution = _data.audioAndVideoCallSolution;
              this.configContent = { ...this.configContent, ..._data };
              // 录音录像存放地址默认值
              if (!this.configContent.audioAndVideoRecordingsOtherPath) this.configContent.audioAndVideoRecordingsOtherPath = this.defaultaudioAndVideoRecordingsOtherPath;
              break;
            // 门禁分机
            case 'accessControl':
              var _data = response.data;

              _data.normalOpenTimeGuard = _data.normalOpenTimeGuard.map(item => {
                return [item.start, item.end];
              });

              // 回显数据
              this.configContent = { ...this.configContent, ..._data };
              // 时间选择器数量
              this.timeIndex = _data.normalOpenTimeGuard.length - 1;
              break;

            // 探视分机
            case 'visit':
              var _data = response.data;

              // _data.businessHours = _data.businessHours.map(item => {
              //   return [item.start, item.end]
              // })

              // 回显数据
              this.configContent = { ...this.configContent, ..._data };

              break;

            // 门口机
            case 'doorway':
              this.configContent = JSON.parse(this.configContentJSON);
              this.configContent = { ...this.configContent, ...response.data };
              // 横屏门口机配置，如果宣教或医护被删除，则清空显示(showinfo)
              if (this.configContent.NavigationBarConfigDoor) {
                for (let v of this.configContent.NavigationBarConfigDoor.values()) {
                  if (v.tabid === 'starinfo' || v.tabid === 'MedicalDisplay') {
                    // 医护的展示人员信息，先向中台查询这些人是否还在
                    v.showinfo = [];
                    API.getListEmp({ empIds: v.medicalids }).then(res => {
                      if (res.data) {
                        for (let vv of res.data.values()) {
                          v.showinfo.push({
                            empId: vv.empId,
                            empName: vv.empName
                          });
                        }
                      }
                    }).finally(() => {
                    });
                  } else if (v.tabid === 'pages' || v.tabid === 'pageone') {
                    // 配置宣教回显的时候，判断宣教是否还在
                    v.showinfo = [];
                    API.getGetDeptDescMany({ id: v.eduids }).then(res => {
                      if (res.data) {
                        for (let vv of res.data.values()) {
                          v.showinfo.push({
                            eduid: vv.eduID,
                            eduname: vv.eduTitle,
                            allname: vv.eduTypeName + '-' + vv.eduTitle
                          });
                        }
                      }
                    }).finally(() => {
                    });
                  }
                }
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

              // 重新赋值整理好的护理级别列表
              this.configContent.colorLevelGate = JSON.parse(JSON.stringify(_newColorLevelListArr));
              // 呼叫验证密码兼容老版本string类型
              this.configContent.callToVerifyPasswordGate = Number(this.configContent.callToVerifyPasswordGate);
              // 缓存呼叫验证密码
              this.oldCallToVerifyPasswordGate = this.configContent.callToVerifyPasswordGate;
              break;

            default:
              // 回显数据
              this.configContent = { ...this.configContent, ...response.data };
          }
        }
      }).finally(() => {
        this.yh_loading = false;
      });
    },

    /**
     * @保存配置
     * @param {nurseUnitId} 护理单元 ID
     * @param {deviceConfigName} 配置页面名称
     * @description 保存配置数据
     */
    saveConfig (deviceConfigName) {
      let _this = this;
      // 验证数据并保存
      this.$refs['configContent'].validate((valid) => {
        if (valid) {
          let addConfig = {};

          if (deviceConfigName === 'bedSide' || deviceConfigName === 'bedHead') {
            if (!this.formValidation()) return;
            this.getCheckedKeys();
            // 患者端功能入口
            addConfig.menuArrayList = this.menuArrayList;
          }

          if (deviceConfigName === 'doorway') {
            // 门口机数据处理
            this.configContent.ReturnHomePage = this.configContent.ReturnHomePage || '0';
          }

          if (deviceConfigName == 'accessControl') {
            if (!this.configContent.controlType) {
              this.$message({
                message: '请选择控制方式',
                type: 'warning'
              });
              return;
            }

            if (this.configContent.controlType != '0' && !this.configContent.cardTransmissionOrder) {
              this.$message({
                message: '请选择卡号传输顺序',
                type: 'warning'
              });
              return;
            }

            // 门禁分机提交验证
            if (this.configContent.controlType == '1' || this.configContent.controlType == '2') {
              // 如果控制方式是韦根26或韦根34，则必填备用卡号
              if (!this.configContent.controlTypeCardNumber) {
                // this.$alert('控制方式为韦根26或韦根34时，必须填写备用卡号', '提示', {
                //   confirmButtonText: '确定'
                // });

                this.$notify({
                  title: '提示',
                  message: '控制方式为韦根26或韦根34时，必须填写备用卡号',
                  type: 'warning',
                  position: 'bottom-right',
                  duration: 0
                });
                return;
              }

              // 韦根设置必选
              if (!this.configContent.WegingCode) {
                this.$notify({
                  title: '提示',
                  message: '控制方式为韦根26或韦根34时，必须选择韦根设置',
                  type: 'warning',
                  position: 'bottom-right',
                  duration: 0
                });
                return;
              }
            }
          }
          if (deviceConfigName === 'other') {
            this.configContent.horizontalImage = _this.$refs.imghz.imageObj.imageUrl || '', // 横屏图片
              this.configContent.verticalImage = _this.$refs.imgvc.imageObj.imageUrl || ''; // 竖屏图片
          }

          let _saveData = deepClone(this.configContent);
          if (deviceConfigName === 'visit') {
            // _saveData.businessHours = this.configContent.businessHours.map(item => {
            //   return {
            //     start: item[0],
            //     end: item[1]
            //   }
            // })

            for (var i = 0; i < this.configContent.businessHours.length; i++) {
              console.log(this.configContent.businessHours[i]);
              if (this.configContent.businessHours[i].start == "" || this.configContent.businessHours[i].end == "") {
                this.$message("探视时间不能为空");
                return;
              }
            }
          }

          if (deviceConfigName === 'accessControl') {
            if (this.configContent.normalOpenTimeGuard.length > 0) {
              _saveData.normalOpenTimeGuard = this.configContent.normalOpenTimeGuard.map(item => {
                return {
                  start: item[0],
                  end: item[1]
                };
              });
              if (!this.timePickerRange) return false;
            } else {
              _saveData.normalOpenTimeGuard = [];
            }

            if (this.configContent.unlockDutyRoomOpenTime.length > 0) {
              _saveData.unlockDutyRoomOpenTime = this.configContent.unlockDutyRoomOpenTime;
            } else {
              _saveData.unlockDutyRoomOpenTime = [];
            }
          }

          if (_saveData.callToVerifyPasswordGate) {
            _saveData.callToVerifyPasswordGate = _saveData.callToVerifyPasswordGate.toString();
          }

          // 探视模式
          if (_saveData.visitModeContent) {
            _saveData.visitModeContent = this.textEncode(_saveData.visitModeContent);
          }

          addConfig.nurseUnitId = this.nurseUnitId == "" ? '2e56ecde2d2b485d81e4636f60342aed' : this.nurseUnitId;
          addConfig.config = JSON.stringify(_saveData);
          addConfig.deviceId = this.deviceId;

          API.addSystemConfig(addConfig, deviceConfigName).then(response => {
            if (response.status === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.getData(this.deviceConfigName);
              if (deviceConfigName != 'other') {
                // 返回父级菜单
                this.goParent();
              }
            } else {
              this.$message({
                type: 'error',
                message: response.desc
              });
              this.getData(this.deviceConfigName);
            }
          });
        } else {
          return false;
        }
      });
    },

    /**
     * @重启分机
     * @param {nurseUnitId} 护理单元 ID
     * @param {deviceType} 分机设备类型
     * @param {messageType} 消息类型 reboot：重启, updateBedCard: 更新床头卡
     * @description 重启指定护理单元下指定类型的分机
     */
    rebootEC (deviceType, messageType = 'reboot') {
      if (messageType === 'reboot') {
        this.$confirm('将要重启分机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadingState = true;
          API.reboot({
            unitId: this.nurseUnitId,
            deviceType,
            messageType,
            deviceId: this.deviceId //  设备ID
          }).then(response => {
            if (response.status === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
            } else {
              this.$message({
                type: 'error',
                message: response.desc
              });
            }

            this.loadingState = false;
          });
        });
      } else {
        // 验证数据并保存
        this.$refs['configContent'].validate((valid) => {
          if (valid) {
            this.$confirm('将更新床头卡, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              this.loadingState = true;

              // 保存数据
              const saveConfig = await this.saveConfig(deviceType);

              if (saveConfig.status === 200) {
                await API.reboot({
                  unitId: this.nurseUnitId,
                  deviceType,
                  messageType,
                  message: this.configContent
                }).then(response => {
                  if (response.status === 200) {
                    this.$message({
                      type: 'success',
                      message: '操作成功'
                    });
                  } else {
                    this.$message({
                      type: 'error',
                      message: response.desc
                    });
                  }

                  this.loadingState = false;
                });
              }
            });
          } else {
            this.$confirm('存在填写不合规配置项，无法更新床头卡!', '提示', {
              showConfirmButton: false,
              cancelButtonText: '取消',
              type: 'warning'
            });
          }
        });
      }
    },

    /**
     * TODO: 等待其他项目组完成接口
     * @获取护理级别
     * @description 获取所有护理级别
     */
    getNursingLevel (callback) {
      API.nursingLevel({ deptId: this.nurseUnitId }).then(
        response => {
          // response = {
          //   "status": 200,
          //   "desc": "操作成功",
          //   "data": [
          //     {
          //       "nurseLevelId": "35620be3bd0011ea9d9d00163e0a0a8d",
          //       "nurseLevelName": "一级护理",
          //       "nurseLevelShort": "一",
          //       "fontColor": "#FC0303",
          //       "backgroundColor": "#90EE90",
          //       "canDelete": 1,
          //       "remark": null,
          //       "userId": "d1f79807f54f4d81ba1d3fd316b4ecc3",
          //       "orgId": null,
          //       "createTime": "2020-07-03 15:38:38"
          //     },
          //     {
          //       "nurseLevelId": "3c169be2bd0011ea9d9d00163e0a0a8d",
          //       "nurseLevelName": "二级护理",
          //       "nurseLevelShort": "二",
          //       "fontColor": "#C71585",
          //       "backgroundColor": "#00CED1",
          //       "canDelete": 1,
          //       "remark": null,
          //       "userId": "d1f79807f54f4d81ba1d3fd316b4ecc3",
          //       "orgId": null,
          //       "createTime": "2020-07-03 15:38:49"
          //     },
          //     {
          //       "nurseLevelId": "46f84ccebd0011ea9d9d00163e0a0a8d",
          //       "nurseLevelName": "三级护理",
          //       "nurseLevelShort": "三",
          //       "fontColor": "#FF4500",
          //       "backgroundColor": "#FF8C00",
          //       "canDelete": 1,
          //       "remark": null,
          //       "userId": "d1f79807f54f4d81ba1d3fd316b4ecc3",
          //       "orgId": null,
          //       "createTime": "2020-07-03 15:39:07"
          //     },
          //     {
          //       "nurseLevelId": "4df65c55bd0011ea9d9d00163e0a0a8d",
          //       "nurseLevelName": "四级护理",
          //       "nurseLevelShort": "四",
          //       "fontColor": "#32EF0C",
          //       "backgroundColor": "#90EE90",
          //       "canDelete": 1,
          //       "remark": null,
          //       "userId": "d1f79807f54f4d81ba1d3fd316b4ecc3",
          //       "orgId": null,
          //       "createTime": "2020-07-03 15:39:19"
          //     },
          //     {
          //       "nurseLevelId": "4df65c55bd0011ea9d9d00163e0a0a8d",
          //       "nurseLevelName": "五级护理",
          //       "nurseLevelShort": "五",
          //       "fontColor": "#32EF0C",
          //       "backgroundColor": "#90EE90",
          //       "canDelete": 1,
          //       "remark": null,
          //       "userId": "d1f79807f54f4d81ba1d3fd316b4ecc3",
          //       "orgId": null,
          //       "createTime": "2020-07-03 15:39:19"
          //     }
          //   ]
          // }

          // 赋值
          this.colorLevelList = response.data;

          // 回调函数
          callback && callback();
        });
    },
    // 获取宣教文章
    getEducationData () {
      API.getEdu({
        orgId: this.orgId,
        nurseUnitId: this.nurseUnitId
      }).then(res => {
        this.content_data = res.data;
        // 循环 tree
        this.dealWholeLabel();
      });
    },

    // 返回父级
    goParent () {
      let deviceType = this.$route.query.deviceType;
      let path = '';
      if (this.deptId) {
        path = `/deveiceA10/${deviceType}?deptId=${this.deptId}`;
      } else {
        path = `/deveiceA10/${deviceType}`;
      }
      this.$router.push({
        path: path
      });
    },
    //  获取
    getDevice () {
      return getRouterQuery(this);
    },
    getTextContent (text) {
      if (!text) return '';
      return text.replace(/<[^>]+>/g, "").replace(/\r|\n|\s/g, '');
    },
    textEncode (text) {
      if (!text) return '';
      return encodeURIComponent(text);
    },
    textDecode (text) {
      if (!text) return '';
      return decodeURIComponent(text);
    }
  }
};
