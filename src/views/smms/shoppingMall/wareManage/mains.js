import * as Api from '@/api/smms/shopingMall/wareManage'
export default {
  data () {
    return {}
  },
  methods: {
    // 检测状态
    // checkState () {
    //   Api.getshopState().then(res => {
    //     if (res.status === 200) {
    //       if (res.data.shopType !== 2) {
    //         this.form.shopType = true
    //       } else {
    //         this.form.shopType = false
    //       }
    //     }
    //   })
    // },
    specificationAdd (val) {
      if (val === 1 && this.form.skuDtoList.length === 1) {
        this.form.skuDtoList.push({
          skuName: '', // sku名称
          price: '', // 价格
          packingFee: '', // 包装费
          stockCurrent: '', // 当前库存
          stockMax: '' // 库存最大值
        })
        return false
      } else {
        if (val === 0 && this.form.skuDtoList.length >= 2) {
          const skuData = [...this.form.skuDtoList]
          for (let i = 1; i < skuData.length; i++) {
            if (skuData.length > 1) {
              this.form.skuDtoList.splice(1, 1)
            }
          }
        }
      }
    },
    checkSpecialKey (str) {
      var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
          return false
        }
      }
      return true
    },
    // 此方法专门来判断状态的
    initStates () {
      return {
        shopType: localStorage.getItem('shopInfo.shopType') || '' // 状态为店铺类型 0 食堂 1超市 2护工
      }
    },
    initForm () {
      return {

        roleType: 1, // 状态是商家还是管理员
        cunums: '',
        id: '',
        mainImage: '',
        specification: 0,
        shelfState: 1,
        categoryId: '',
        auditState: 0,
        title: '',
        waredesc: '',
        skuDtoList: [{
          skuName: '', // sku名称
          price: '', // 价格
          packingFee: '', // 包装费
          stockCurrent: '', // 当前库存
          stockMax: '' // 库存最大值
        }],
        attributeDtoList: [{
          name: '',
          valueList: []
        }],
        wareItem: [{
          name: '',
          num: '',
          two: '',
          three: '',
          four: '',
          five: ''
        }]
      }
    },
    initRules () {
      var price = (rule, value, callback) => {
        var re = /^\d+$|^\d*\.\d+$/g
        if (!re.test(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value > 100000) {
            callback(new Error('数字值不能大于100000'))
          } else {
            callback()
          }
        }
      }
      // 判断第一个数组是否大于第二个数值
      var _this = this
      var stockMax = (rule, value, callback) => {
        var re = /^\d+$|^\d*\.\d+$/g
        if (!re.test(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value > 100000) {
            callback(new Error('数字值不能大于100000'))
          } else {
            let number = rule.field.split('.')
            let stockCurrent = _this.form.skuDtoList[number[1]]['stockCurrent']
            if (Number(stockCurrent) > Number(value)) {
              callback(new Error('当前库存量不能大于最大库存量'))
            } else {
              callback()
            }
          }
        }
      }
      var validateInput = (rule, value, callback) => {
        if (!this.checkSpecialKey(value)) {
          callback(new Error('不能含有特殊字符！！'))
        } else {
          callback()
        }
      }
      var ischeck = (rule, value, callback) => {
        // 判断 商品规格是否有重复
        let val = _this.form.skuDtoList.filter((i, v) => {
          if (i.skuName !== '') {
            return i.skuName
          }
        }).map((i, v) => i.skuName)
        //  let val = data.map((i, v) => i.skuName)
        let set = [...new Set(val)]
        if (val.length > set.length) {
          callback(new Error('规格名称不能重复'))
        } else {
          callback()
        }
      }
      return {
        mainImage: [{
          required: true,
          message: '请上传图片'
        }],
        title: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 10,
          message: '长度在 1 到 10个字符',
          trigger: 'blur'
        }, {
          validator: validateInput,
          trigger: 'blur'
        }
        ],
        waredesc: [{
          required: false,
          message: '请输入商品描述',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 100,
          message: '长度在 1 到 100个字符',
          trigger: 'blur'
        }
        ],
        categoryId: [{
          required: true,
          message: '请选商品分类',
          trigger: 'change'
        }],
        price: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          validator: price,
          trigger: 'blur'
        }, {
          pattern: /^\d+\.?\d{0,2}$/,
          message: '限制小数点后两位',
          trigger: 'blur'
        }],
        skuName: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 10,
          message: '长度在 1 到 10个字符',
          trigger: 'blur'
        }, {
          validator: validateInput,
          trigger: 'blur'
        }, {
          validator: ischeck,
          trigger: 'blur'
        }],
        packingFee: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          validator: price,
          trigger: 'blur'
        }, {
          pattern: /^\d+\.?\d{0,2}$/,
          message: '限制小数点后两位',
          trigger: 'blur'
        }],
        stockCurrent: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          validator: price,
          trigger: 'blur'
        }, {
          pattern: /^\d+\.?\d{0,0}$/,
          message: '只能输入整数',
          trigger: 'blur'
        }],
        stockMax: [{
          required: false,
          message: '不能为空',
          trigger: 'blur'
        }, {
          validator: stockMax,
          trigger: 'blur'
        }, {
          pattern: /^\d+\.?\d{0,0}$/,
          message: '只能输入整数',
          trigger: 'blur'
        }],
        name: [{
          required: false,
          min: 1,
          max: 8,
          message: '最多支持8位字符',
          trigger: 'blur'
        }, {
          validator: validateInput,
          trigger: 'blur'
        }],
        num: [{
          required: false,
          min: 1,
          max: 8,
          message: '最多支持8位字符',
          trigger: 'blur'

        }, {
          validator: validateInput,
          trigger: 'blur'
        }],
        sxname: [{
          required: false,
          min: 1,
          max: 8,
          message: '最多支持8位字符',
          trigger: 'blur'
        }],

        two: [{
          required: false,
          min: 1,
          max: 8,
          message: '最多支持8位字符',
          trigger: 'blur'

        }, {
          validator: validateInput,
          trigger: 'blur'
        }],

        three: [{
          required: false,
          min: 1,
          max: 8,
          message: '最多支持8位字符',
          trigger: 'blur'

        }, {
          validator: validateInput,
          trigger: 'blur'
        }],
        four: [{
          required: false,
          min: 1,
          max: 8,
          message: '最多支持8位字符',
          trigger: 'blur'

        }, {
          validator: validateInput,
          trigger: 'blur'
        }],
        five: [{
          required: false,
          min: 1,
          max: 8,
          message: '最多支持8位字符',
          trigger: 'blur'

        }, {
          validator: validateInput,
          trigger: 'blur'
        }]

      }
    }
  }
}
