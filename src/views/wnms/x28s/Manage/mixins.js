import { isChinaEnglish } from '@/assets/wnms/utils/validate';
import {
  selectDeptInfoData,
  formatter,
  dataReduce,
  getDeptInfo
} from '@/assets/wnms/utils/common';

import { getStorageUser } from '@/assets/wnms/utils/storageUser.js';

import outMixins from '../mixins';

export default {

  data () {
    return {
      //应用到护理单元的数据
      selectDeptId: null
    };
  },
  mixins: [outMixins],
  created () {
    if (this.detail && this.detail.type == 'list') {
      this.getdeptsList();
    }
  },
  mounted () {

  },
  methods: {

    dataReduce (array, value) {
      return dataReduce(array, value);
    },

    formatter () {
      return formatter(selectDeptInfoData(), null, {
        label: 'deptName',
        flag: false
      });
    },
    initVideo () {
      return {
        dataName: 'video',
        accept: '.mp4,.avi,.3gp,.rmvb,.wmv,.mkv,.mov,.flv',
        limit: 1,
        fileList: []
      };
    },
    initForm () {
      return {
        screenId: '',
        materialName: '', // 素材名称
        isLoop: 1, // 是否轮播
        playTime: [{ playTime: '' }], // 素材定时播放时间
        materialType: 0, // 素材类型
        materialContent: '', // 公告类型为图文时 素材正文
        multipartFile: null, // 公告类型为视频时 视频file
        deptId: '',//this.selectDeptInfo()
        isNew: 1,//1:代表新的音频文件，告知后端需要上传，0:告知后端无须再次上传，只有编辑的时候 只要点击过删除，那么就代表后端需要重新上传
      };
    },
    retunTreeList (res) {
      if (res.status === 200 && res.data.list.length > 0) {
        this.dataTree = res.data.list;

        if (this.detail.type == 'list' && this.detail.deptId) {
          this.search.deptId = this.detail.deptId;
          this.selectDeptId = this.detail.deptId;
        } else {
          if (this.search) {
            this.selectDeptId = this.dataTree[0].deptId;
            this.search.deptId = this.selectDeptId;
          }
        }
        this.executeQueryPage();
      }
    },
    initRules (nameTitle = '素材名称') {
      const tempname = (rule, value, callback) => {
        if (isChinaEnglish(value)) {
          callback(new Error('只能输入中英文以及数字'));
        } else {
          callback();
        }
      };
      const validateContent = (rule, value, callback) => {
        if (this.form.materialType === 0) {
          if (value.length < 1) {
            callback(new Error('不能为空'));
          } else if (value.length > 5000) {
            callback(new Error('长度在 1 到 5000 个字符'));
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      return {
        value: [{
          required: true,
          message: '素材定时播放时间不能为空',
          trigger: 'blur'
        }],
        materialName: [{
          required: true,
          message: `${nameTitle}不能为空`,
          trigger: 'blur'
        }, {
          validator: tempname,
          trigger: 'blur'
        }, {
          validator: this.tempNameIsRepeat,
          trigger: 'blur'
        }, {
          min: 1,
          max: 10,
          message: '长度在 1 到 10 个字符'
        }],

        materialContent: {
          validator: validateContent,
        }

      };
    }

  }
};
