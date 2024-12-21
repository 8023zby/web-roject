/*
 * @Author: yxb
 * @Date: 2021-07-08 09:56:32
 * @LastEditors: 翟冲
 * @LastEditTime: 2021-12-03 14:27:01
 * @Description: 页面功能描述
 */
export default {
  data () {
    return {

    };
  },
  methods: {
    // 校验
    initRules () {
      let _this = this;
      return {
        menuName: [{ required: true, message: '不能为空', trigger: 'blur' },
        { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        menuCode: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        sort: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        pageUrl: [
          {
            required: true,
            message: '不能为空',
            trigger: 'change'
          }
        ],

        icon: [{
          required: true,
          trigger: 'blur',
          validator: (rules, value, callback) => {
            if (this.form.menuFrom !== 'bedHead') {
              if (!_this.images.imageUrlCancel || !_this.images.imageUrlConfirm) {
                return callback(new Error('不能为空'));
              }
            } else {
              if (!_this.images.imageUrlConfirm) {
                return callback(new Error('不能为空'));
              }
            }
            return callback();
          }
        }]
      };
    },
    initImage () {
      return {
        actionUrl: '/bmms/web-bm/file/scale',
        imageUrlCancel: '', // 取消
        imageUrlCancelUrl: '', // 取消
        imageUrlConfirm: '', // 确认
        imageUrlConfirmUrl: ''// 确认
      };
    },
    // 表单字段
    initForm () {
      // if (this.$route.params.type=) {
      //   this.$message({
      //     type: 'error',
      //     message: '找不到id'
      //   })
      //   return false
      // }
      return {

        sort: '0',
        parentId: 0, // 父类id
        parentName: '', // 父类名称
        menuName: '', // 菜单名称
        menuCode: '', // 菜单标识
        status: 1, // 显示 隐藏
        pageUrl: '', // 跳转地址
        remark: '', // 备注
        icon: '', // 图标
        menuFrom: this.$route.params.type || 'bedSide'
      };
    }
  }
};
