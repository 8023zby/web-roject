<!--
  文件描述：店铺管理页面：添加页
      主样式class：edit-page-new
  创建时间：2020/4/15 10:31
  创建人：Administrator
-->
<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">店铺管理</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form ref="form" :model="form" :rules="rules" class="from">
          <input v-model="form.id" type="hidden" />
          <el-form-item label="店铺名称：" :label-width="formLabelWidth" prop="shopName">
            <el-input v-model="form.shopName" autocomplete="off" class="elinput-400" />
          </el-form-item>
          <el-form-item label="联系方式：" :label-width="formLabelWidth" prop="contactPhone">
            <el-input
              v-model="form.contactPhone"
              autocomplete="off"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              class="elinput-400"
            />
          </el-form-item>

          <el-form-item
            label="起送标准："
            :label-width="formLabelWidth"
            prop="deliveryMinCost"
            v-if="isType"
          >
            <el-input-number
              v-model="form.deliveryMinCost"
              :precision="2"
              :step="0.1"
              autocomplete="off"
              :min="0"
              :max="100000"
              size="mini"
            />
            <label>&nbsp;&nbsp;元起送</label>
          </el-form-item>

          <el-form-item label="配送费：" :label-width="formLabelWidth" prop="deliveryFee" v-if="isType">
            <el-input-number
              v-model="form.deliveryFee"
              :precision="2"
              :step="0.1"
              autocomplete="off"
              :min="0"
              :max="100000"
              size="mini"
            />
            <label>&nbsp;&nbsp;元</label>
          </el-form-item>
          <el-form-item
            label="店铺展示图："
            :label-width="formLabelWidth"
            :rules="{
              required: true,
              message: '营业时间不能为空',
              trigger: 'blur',
            }"
          >
            <v-upload-image :imageObj="imageObj" ref="imgDiv"></v-upload-image>
          </el-form-item>
          <el-form-item label="店铺描述：" :label-width="formLabelWidth" prop="brief">
            <el-input
              v-model="form.brief"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              autocomplete="off"
              size="mini"
              class="elinput-400"
            />
          </el-form-item>
          <el-row v-for="(businessHour, hourIndex) in form.businessHours" :key="hourIndex">
            <el-col :span="12">
              <el-form-item
                :key="hourIndex"
                :label="'营业时间' + (hourIndex + 1) + '：'"
                :label-width="formLabelWidth"
                :prop="'businessHours[' + hourIndex + ']'"
                :rules="{
                  required: true,
                  message: '营业时间不能为空',
                  trigger: 'blur',
                }"
                style="white-space: nowrap"
              >
                <el-time-picker
                  v-model="form.businessHours[hourIndex]"
                  value-format="HH:mm"
                  is-range
                  arrow-control
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  size="mini"
                />
                <span class="small-btn" style="margin-left: 15px">
                  <el-button
                    v-if="
                      hourIndex === form.businessHours.length - 1 &&
                      form.businessHours.length < 3
                    "
                    type="primary"
                    icon="el-icon-plus"
                    title="添加"
                    circle
                    @click="addOpenTime"
                    size="mini"
                    class="button-model-add"
                  />
                  <el-button
                    v-if="
                      hourIndex === form.businessHours.length - 1 &&
                      form.businessHours.length > 1
                    "
                    type="danger"
                    icon="el-icon-minus"
                    title="删除"
                    circle
                    @click="removeOpenTime(timeIndex)"
                    size="mini"
                    class="button-model-del"
                  />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="small-btn" style="padding-top: 8px"></el-col>
          </el-row>
          <el-form-item label="是否自动接单：" :label-width="formLabelWidth">
            <el-switch v-model="autoReceipt" active-color="#13ce66" />
          </el-form-item>
          <el-form-item label="营业状态：" :label-width="formLabelWidth">
            <el-switch v-model="isOpened" active-color="#13ce66" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="changeState()" v-if="false">取 消</el-button>
      <el-button type="primary" @click="onSubmit(form, 'add')">保 存</el-button>
    </div>
  </div>
</template>

<script>
import {
  getSmShopByIdForEdit,
  updateState,
  editBusinesses,
  editShop,
  checkout
} from '../../../api/smms/shopingMall/shop'
import vUploadImage from '../../../components/smms/CropperUploadImg.vue'
import BaseQueryPageForm from '@/views/smms/common/BaseQueryPageForm'

export default {
  name: 'shop',
  mixins: [BaseQueryPageForm],
  components: {
    vUploadImage
  },
  data () {
    const validateShopName = (rule, value, callback) => {
      const regName = /^[^ ]+$/
      if (!regName.test(value)) {
        callback(new Error('店铺名称不能包含空格'))
      } else {
        callback()
      }
    }

    var validatorPhone = function (rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    var dc_rules = {
      checkPhone: {
        reg: /^1\d{10}$/,
        msg: "请输入正确的手机号"
      }
    };    return {
      imageObj: {
        picRoute: '6',
        avatar: 'avatar',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: '',
        fileSize: true,
        fromWhere: 'apply'
      },
      landPhone: '',
      autoReceipt: false,
      value: '',
      timeIndex: 0,
      isOpened: false,
      form: {
        shopName: '',
        contactPhone: '',
        deliveryMinCost: '',
        deliveryFee: '',
        brief: '',
        autoReceipt: '',
        id: '',
        shopImage: '',
        businessHours: [['08:00', '17:00']],
        shopType: ''
      },
      formLabelWidth: '150px',
      isType: true,
      rules: {
        shopName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
          { validator: validateShopName, trigger: 'blur' }
        ],
        contactPhone: [
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
        ],
        deliveryMinCost: [
          { required: true, message: '请输入起送标准', trigger: 'blur' }
        ],
        deliveryFee: [
          { required: true, message: '请输入配送费', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入店铺描述', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          },
          { pattern: /^[a-z0-9_-]{3,16}$/ | /^[\u2E80-\u9FFF]+$/, message: '仅支持数字、字母、汉字、中英文字符' }
        ],
        picture: [
          { required: true, message: '请输入店铺描述', trigger: 'blur' }]
      },
      dialogVisible: false
    }
  },
  // 监听属性 类似于data概念
  computed: {
  },
  // 方法集合
  methods: {
    addOpenTime () {
      console.log(this.timeIndex)
      if (this.timeIndex < 2) {
        this.timeIndex += 1
        this.form.businessHours.push(['08:00', '17:00'])
      } else {
        this.$message.error('最多可以有三条数据')
      }
    },
    changeState () {
      for (const i in this.form) {
        this.form[i] = ''
      }
      this.editShop()
    },
    updateState (isOpened) {
      console.log(isOpened)
      let label = '暂时歇业成功'
      if (isOpened) label = '恢复营业成功'
      updateState(isOpened ? 1 : 0)
        .then(res => {
          this.$message({
            message: label,
            type: 'success'
          })
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
    },
    removeOpenTime (timeIndex) {
      if (timeIndex === 0) {
        this.$message({
          message: '营业时间为必填项',
          type: 'warning'
        })
      } else {
        this.timeIndex--
        this.form.businessHours.splice(timeIndex, 1)
      }
    },
    dealShop (res) {
      this.form.businessHours = JSON.parse(res.data.businessHours)
      this.form.shopName = res.data.shopName
      this.form.contactPhone = res.data.contactPhone
      this.landPhone = res.data.landPhone
      this.form.deliveryMinCost = res.data.deliveryMinCost
      this.form.deliveryFee = res.data.deliveryFee
      this.form.brief = res.data.brief
      this.form.shopType = res.data.shopType
      if (res.data.shopType === 2) {
        this.isType = false
        this.form.deliveryMinCost = 0
        this.form.deliveryFee = 0
      }
      if (res.data.autoReceipt === 1) {
        this.autoReceipt = true
      } else {
        this.autoReceipt = false
      }
      this.form.id = res.data.id
      this.isOpened = res.data.isOpened === 1
      this.form.shopImage = res.data.shopImage === null ? '' : res.data.shopImage
      this.imageObj.imageUrl = this.form.shopImage
      localStorage.setItem('shopInfo.businessHours', res.data.businessHours)
      localStorage.setItem('shopInfo.shopType', this.form.shopType)
      this.timeIndex = JSON.parse(res.data.businessHours).length - 1
      localStorage.setItem('shopInfo.brief', res.data.brief)
      localStorage.setItem('shopInfo.img', res.data.shopImage)
    },
    editShop () {
      getSmShopByIdForEdit()
        .then(res => {
          this.IsSuccess(res, () => {
            this.dealShop(res)
          }, false)
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
    },
    // 提交表单
    onSubmit (form) {
      const _this = this
      // 表单校验
      this.form.shopImage = this.imageObj.imageUrl
      this.$refs['form'].validate((valid) => {
        if (form.shopImage === '') {
          this.$message({
            message: '请上传店铺展示图',
            type: 'warning'
          })
        } else {
          if (valid) {
            if (form.businessHours[0][0] === '') {
              this.$message({
                message: '营业时间为必填项',
                type: 'warning'
              })
              return
            }
            // 修改统一平台信息
            checkout({
              id: this.form.id,
              shopName: this.form.shopName,
              shopType: this.form.shopType,
              contactPhone: this.form.contactPhone,
              auditByHospital: ''
            }).then(res => {
              _this.IsSuccess(res, () => {
                editBusinesses({
                  orgName: this.form.shopName,
                  userTelephone: this.landPhone,
                  orgId: this.form.id
                })
                  .then(res => {
                    _this.IsSuccess(res, () => {
                      editShop({
                        shopName: this.form.shopName,
                        contactPhone: this.form.contactPhone,
                        deliveryMinCost: this.form.deliveryMinCost,
                        deliveryFee: this.form.deliveryFee,
                        businessHours: JSON.stringify(this.form.businessHours),
                        brief: this.form.brief,
                        autoReceipt: this.autoReceipt ? 1 : 0, // 是否自动接单
                        id: this.form.id,
                        shopImage: this.form.shopImage,
                        isOpened: this.isOpened ? 1 : 0 // 营业状态
                      }).then(res => {
                        _this.IsSuccess(res, () => {
                          // 写入店铺图片
                          localStorage.setItem('shopInfo.img', _this.form.shopImage)
                        }, true)
                      })
                        .catch(error => {
                          console.log(error)
                          this.$message.error(JSON.stringify(error) + '编辑失败')
                        })
                    }, false)
                  })
                  .catch(error => {
                    console.log(error)
                    // this.$message.error(JSON.stringify(error) + '编辑失败')
                  })
              }, false)
            }).catch(error => {
              console.log(error)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        }
      })
    }
  },
  // 监控data中的数据变化
  watch: {
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.editShop()
  },
  beforeCreate () {
  }, // 生命周期 - 创建之前
  beforeMount () {
  }, // 生命周期 - 挂载之前
  beforeUpdate () {
  }, // 生命周期 - 更新之前
  updated () {
  }, // 生命周期 - 更新之后
  beforeDestroy () {
  }, // 生命周期 - 销毁之前
  destroyed () {
  }, // 生命周期 - 销毁完成
  activated () {
  } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style lang="scss">
//@import url(); 引入公共css类
@import '@/assets/smms/css/self_common.scss';
</style>
