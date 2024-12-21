
export default {
  props: {

  },
  components: {},
  data () {
    return {

    };
  },
  watch: {},
  computed: {},
  created () { },
  mounted () {

  },
  methods: {
    getDefaultDeptInfo (options = {}) {
      console.log(this.$route.fullPath, this.$route.path, 'deptMixins...............');
      let defaultOption = {
        follow: options.follow || false
      };
      let landingInfo = this.getStorageSelectLandingEndInfo();

      //landingEndCode  OPEX 属于运维  value='terminal'并且是病房终端
      if (landingInfo.landingEndCode === "OPEX" && defaultOption.follow) {
        let currDept = this.getStorageTdms_searchDept();
        return this.isNullOrEmpty(currDept) ? this.getStorageDeptInfo().deptId : currDept;
      }
      //landingEndCode  WEB属于病区 OPEX 属于运维  
      if (landingInfo.landingEndCode === "WEB") {
        return this.getStorageSelectDeptId();
      }

      if (landingInfo.landingEndCode === "OPEX") {
        return this.getStorageDeptInfo().deptId;
      }
    },

    // 获取病区端当前部门ID
    getStorageSelectDeptId () {
      return this.getStorage('selectDeptId');
    },
    // 获取病区端当前部门
    getStorageSelectDeptInfo () {
      let info = this.getStorage('selectDeptInfo');
      let data = { deptName: "", deptId: "", };
      return this.__format(info, data);
    },
    // 获取病房终端当前的科室
    getStorageTdms_searchDept () {

      return this.getStorage('tdms_searchDept');

    },
    // 获取当前选择的端
    getStorageSelectLandingEndInfo () {
      let info = this.getStorage('selectLandingEndInfo');
      let data = { landingEndId: "", deviceType: [], landingEndCode: "" };
      return this.__format(info, data);
    },
    // 获取当前用户登录的部门
    getStorageDeptInfo () {
      let info = this.getStorage('deptInfo');
      let data = { deptName: "", deptId: "" };
      return this.__format(info, data);
    },
    // 读取本地Storage
    getStorage (name) {
      let value = localStorage.getItem(name) || null;
      if (this.isNullOrEmpty(value)) {
        console.log(`${value}值为空，空`);
        return null;
      } else {
        return value;
      }
    },
    // 写入当前本地Storage
    setStorage (name, value) {
      localStorage.setItem(name, value);
    },
    __format (info, obj) {
      if (this.isNullOrEmpty(info) || typeof info != 'string') return obj;
      let jsondata = JSON.parse(info);
      let data = {};
      Object.keys(obj).map(key => {
        data[key] = jsondata[key];
      });
      return data;
    },
    isNullOrEmpty (v) {
      if (v == undefined || v == null || v == 'undefined') return true;
      return (typeof (v) === "string" && v.length == 0);
    }
  }
};
