import {
  selectDeptInfo,
  getDeptInfo
} from '@/assets/wnms/utils/common';

import { getStorageUser } from '@/assets/wnms/utils/storageUser.js';

import outMixins from '../mixins';
import deptMixins from "@/assets/wnms/js/deptMixins.js";
import {
  Query,
  Edit,
  QueryVoiceBroadcastList,
  QuerycardTemplateList,
  Reboot,
  iconConfig
} from '../api/csmsConfig';

export default {
  data () {
    return {
      //应用到护理单元的数据
      selectDeptId: null,
      // 验证方法
      rules: {
        'defaultPrompt': [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 20,
          message: '请输入20位以内数字',
          trigger: 'blur'
        }
        ]
      },
      // 开关颜色 [激活]
      switchActiveColor: '#13ce66',
      // Loading 状态
      loadingState: false,
      // 音量列表
      volumeOptionsList: [{
        value: '0',
        label: '0'
      }, {
        value: '1',
        label: '1'
      }, {
        value: '2',
        label: '2'
      }, {
        value: '3',
        label: '3'
      }, {
        value: '4',
        label: '4'
      }, {
        value: '5',
        label: '5'
      }, {
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
      cardTemplateList: [],
      // 语音播报列表
      voiceBroadcastList: []
    };
  },
  mounted () {
    this.getdeptsList();
  },
  mixins: [outMixins, deptMixins],
  methods: {
    getIconConfig () {
      return iconConfig();
    },
    retunTreeList (res) {
      if (res.status === 200 && res.data.list.length > 0) {
        this.dataTree = res.data.list;
        this.selectDeptId = this.getDefaultDeptInfo({ follow: true, notdefault: true }) || this.dataTree[0].deptId;
        this.getData();
        this.QuerycardTemplateList();
        this.QueryVoiceBroadcastList();
      }
    },
    /**
     * @获取配置详情
     * @description 获取不同分机的配置详情
     */
    getData () {
      Query(this.selectDeptId).then(response => {
        if (response.status === 200) {
          this.configContent = response.data;
          this.imgDataUrl = this.configContent.logoUrl;
          this.playTime = (response.data.loopTime !== '' && response.data.loopTime !== null) ? response.data.loopTime : [
            ['', '']
          ];
        } else {
          this.$message({
            type: 'error',
            message: response.desc
          });
        }
      });
    },

    /**
     * @获取模板列表
     * @description 获取模板列表
     */
    QuerycardTemplateList () {
      QuerycardTemplateList().then(response => {
        if (response.status === 200) {
          // console.log(response.data)
          this.cardTemplateList = response.data;
        } else {
          this.$message({
            type: 'error',
            message: response.desc
          });
        }
      });
    },

    /**
     * @获取语音播报列表
     * @description 获取语音播报列表
     */
    QueryVoiceBroadcastList () {
      QueryVoiceBroadcastList().then(response => {
        if (response.status === 200) {
          this.voiceBroadcastList = response.data.map(item => item.voiceBroadcast);
        } else {
          this.$message({
            type: 'error',
            message: response.desc
          });
        }
      });
    },

    /**
     * @保存配置
     * @description 保存配置数据
     */
    saveConfig () {
      this.configContent.loopTime = this.playTime;
      this.$refs['configContent'].validate((valid) => {
        if (valid) {
          Edit(this.configContent).then(response => {
            if (response.status === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.getData();
            } else {
              this.$message({
                type: 'error',
                message: response.desc
              });
              this.getData();
            }
          });
        } else {
          return false;
        }
      });
    },

    /**
     * @重启分机
     * @param {deptId} 护理单元 ID
     * @description 重启指定护理单元下指定类型的分机
     */
    rebootEC () {
      this.$confirm('此操作将重启显示屏, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Reboot(this.selectDeptId).then(response => {
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
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重启'
        });
      });
    },

    //
    handleCheckAllChange (val) {
      this.configContent.voiceBroadcast = val ? this.voiceBroadcastList : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.voiceBroadcastList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.voiceBroadcastList.length;
    }
  }
};
