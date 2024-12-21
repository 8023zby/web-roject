<template>
  <el-container class="edit-page-new">
    <el-header :height="'48px'">
      <div class="title">
        <slot name="title">
          编辑商家
        </slot>
      </div>
      <div class="right-btn">
        <slot name="right_btn"> </slot>
      </div>
    </el-header>

    <el-main>
      <slot name="main">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="from"
          label-width="110px"
        >
          <el-form-item label="商家用户名" prop="businesses.userName">
            <el-input
              v-model="form.businesses.userName"
              disabled
              class="inputwidth"
              size="small"
            />
          </el-form-item>
          <el-form-item label="商家名称" prop="shop.shopName">
            <el-input
              v-model="form.shop.shopName"
              class="inputwidth"
              size="small"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="shop.contactPhone">
            <el-input
              v-model="form.shop.contactPhone"
              class="inputwidth"
              size="small"
            />
          </el-form-item>

          <el-form-item label="商家类型">
            <el-select
              v-model="form.shop.shopType"
              disabled
              class="inputwidth"
              size="small"
            >
              <el-option
                v-for="item in shopType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品上架审核">
            <el-switch
              v-model="form.shop.auditByHospital"
              :active-value="1"
              :inactive-value="0"
              :active-color="activeColor"
            />
          </el-form-item>
        </el-form>
      </slot>
    </el-main>

    <div class="footer-btn typt-add-footer" style="margin-top: 15px">
      <slot name="footer_btn">
        <el-button @click="backHandlers" size="small">取消</el-button>
        <el-button type="primary" @click="submitHandler('form')" size="small"
        >保存</el-button
        >
      </slot>
    </div>
  </el-container>
</template>

<script>
import BaseEditForm from '../../common/BaseEditForm'
import * as businessManageApi from '../../../../api/smms/shopingMall/businessManage'
import mains from './mains'
import BaseQueryPageForm from '@/views/smms/common/BaseQueryPageForm'

export default {
  mixins: [BaseEditForm, mains, BaseQueryPageForm],
  props: {
    detail: {
      // required: false,
      type: Object,
      default: () => { }
    }
  },
  mounted () {
    const _this = this

    businessManageApi.DetailBase(this.detail.id).then(res => {
      _this.IsSuccess(res, () => {
        this.form.businesses.userName = res.data.userName
        this.form.shop.contactPhone = res.data.userTelephone
      }, false)
    })
    businessManageApi.Detail(this.detail.id).then(res => {
      this.form.shop.id = res.data.id
      this.form.shop.shopName = res.data.shopName
      // this.form.shop.contactPhone = res.data.contactPhone
      this.form.shop.shopType = res.data.shopType
      this.form.shop.auditByHospital = res.data.auditByHospital
      this.form.businesses.orgId = res.data.id
      this.form.businesses.orgName = res.data.shopName
    })
  },
  methods: {
    backHandlers (data) {
      this.$emit('option-changed', 'list')
    },
    customSubmitHandler () {
      /*
      * 调用3个接口
      * 1.判断是否可以保存
      * 2.保存到中台
      * 3.保存到A10
      *
      * */
      console.log(this.form.shop, this.form.businesses)

      this.form.shop.contactPhone = this.form.businesses.userTelephone
      this.form.shop.landPhone = this.form.businesses.userTelephone
      businessManageApi.checkout(this.form.shop).then(res1 => {
        this.IsSuccess(res1, () => {
          businessManageApi.EditBase(this.form.businesses).then(res2 => {
            this.IsSuccess(res2, () => {
              delete this.form.shop.contactPhone
              businessManageApi.Edit(this.form.shop).then(res3 => {
                this.IsSuccess(res3, () => {
                  this.submitSuccessHandler(res3)
                }, false)
              })
            }, false)
          })
        }, false)
      })
    }
  }
}
</script>
<style lang='scss'>
  @import '@/assets/smms/css/self_common.scss';
</style>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.inputwidth {
  width: 30rem;
}
</style>
