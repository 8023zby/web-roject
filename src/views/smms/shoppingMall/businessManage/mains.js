import { deepMerge } from "../../../../assets/smms/utils";
import * as businessManageApi from "../../../../api/smms/shopingMall/businessManage";
export default {
  data() {
    return {
      // SWITCH COLOR
      activeColor: "#13ce66",
      inactiveColor: "#ff4949",
      // 商家类型 列表
      shopType: [
        {
          label: "餐厅食堂",
          value: 0
        },
        {
          label: "商超便利",
          value: 1
        },
        {
          label: "护工中心",
          value: 2
        }
      ],
      // 新建&编辑 字段
      form: {
        shop: {
          id: "",
          shopName: "",
          contactPhone: "",
          shopType: 0,
          auditByHospital: 1 // false:不审核 true:审核
        },
        businesses: {
          orgName: "",
          userName: "",
          userTelephone: ""
        }
      },
      // 验证规则
      rules: this.initRules()
    };
  },
  watch: {
    "form.shop.shopName": {
      handler: function(newVal, oldVal) {
        this.form.businesses.orgName = this.form.shop.shopName;
      }
    },
    "form.shop.contactPhone": {
      handler: function(newVal, oldVal) {
        this.form.businesses.userTelephone = this.form.shop.contactPhone;
      }
    }
  },
  methods: {
    // 这里放校验
    initRules() {
      var dc_rules = {
        checkUserName: {
          reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
          msg: "必须由字母、数字组成，且不能出现空格"
        },
        checkShopName: {
          reg: /^[0-9a-zA-Z\u4e00-\u9fa5\_\+\-]{1,16}$/,
          msg: "请输入字母、数字、中文、下划线、中划线、加号，且不能出现空格"
        },
        checkPhone: {
          reg: /^1\d{10}$/,
          msg: "请输入正确的手机号"
        }
      };

      return {
        "businesses.userName": [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "用户名长度为 6 到 20 位！",
            trigger: "blur"
          },
          {
            pattern: dc_rules.checkUserName.reg,
            message: dc_rules.checkUserName.msg,
            trigger: "blur"
          }
        ],
        "shop.shopName": [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur"
          },
          {
            pattern: dc_rules.checkShopName.reg,
            message: dc_rules.checkShopName.msg,
            trigger: "blur"
          }
        ],
        "shop.contactPhone": [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "手机号类型为 11 个数字",
            trigger: "blur"
          },
          {
            pattern: dc_rules.checkPhone.reg,
            message: dc_rules.checkPhone.msg,
            trigger: "blur"
          }
        ]
      };
    },
    // 请求列表
    executeQueryPage() {
      this.yh_loading = true;
      businessManageApi
        .getInfo(this.createQueryParams())
        .then(res => {
          this.IsSuccess(
            res,
            () => {
              this.queryResultHandler(res, () => {
                this.dealListData();
              });
            },
            false
          );
        })
        .finally(() => {
          this.yh_loading = false;
        });
    },
    getLockStatus(callback) {
      const _this = this;
      businessManageApi.getlockStatus({}).then(res => {
        this.IsSuccess(
          res,
          () => {
            _this.isFrozenStatus = res.data;
            callback();
          },
          false
        );
      });
    },
    /**
     * 处理用户的锁定状态
     *
     * */
    dealListData() {
      this.showTableVisable = false;
      this.$nextTick(() => {
        if (this.isFrozenStatus.length > 0) {
          for (let v of this.pagination.list.values()) {
            v.isFrozen = 0;
            let org = this.isFrozenStatus.find((value, index) => {
              return value.orgId === v.id;
            });
            if (org && org.isFrozen !== null) v.isFrozen = org.isFrozen;
          }
        }
        this.showTableVisable = true;
      });
    },
    initQueryCriteria(form = {}) {
      return deepMerge(form, {
        shopName: "",
        shopType: 0, // 0：食堂餐厅
        isEnable: "",
        auditByHospital: ""
      });
    },
    successInfo(data) {
      if (data.status === 200) {
        this.$message({
          type: "success",
          message: "操作成功"
        });
      } else {
        this.$message({
          type: "error",
          message: "操作失败"
        });
      }
    }
  }
};
