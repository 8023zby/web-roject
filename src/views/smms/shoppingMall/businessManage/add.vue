<template>
  <el-container class="edit-page-new">
    <el-header :height="'48px'">
      <div class="title">
        <slot name="title">
          新建商家
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
          <el-form-item label="商家用户名：" prop="businesses.userName">
            <el-input
              v-model="form.businesses.userName"
              class="inputwidth"
              size="small"
            />
          </el-form-item>
          <el-form-item label="商家名称：" prop="shop.shopName">
            <el-input
              v-model="form.shop.shopName"
              class="inputwidth"
              size="small"
            />
          </el-form-item>
          <el-form-item label="手机号：" prop="shop.contactPhone">
            <el-input
              v-model="form.shop.contactPhone"
              class="inputwidth"
              size="small"
            />
          </el-form-item>
          <el-form-item label="商家类型：">
            <el-select
              v-model="form.shop.shopType"
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
          <el-form-item label="商品上架审核：">
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
        <el-button type="primary" @click="submitHandlera('form')" size="small"
        >保存</el-button
        >
      </slot>
    </div>
  </el-container>
</template>

<script>
import BaseEditForm from '../../common/BaseEditForm'
import { deepMergeLeft } from '../../../../assets/smms/utils'
import * as businessManageApi from '../../../../api/smms/shopingMall/businessManage'
import mains from './mains'
import BaseQueryPageForm from '@/views/smms/common/BaseQueryPageForm'

export default {
  mixins: [BaseEditForm, mains, BaseQueryPageForm],
  activated () {
    deepMergeLeft(this.form, this.initForm())
    this.$nextTick(() => {
      this.$refs['form'].clearValidate()
    })
  },
  methods: {
    backHandlers (data) {
      this.$emit('option-changed', 'list')
    },
    submitHandlera (form) {
      this.$refs[form].validate((valid) => {
        if (!valid) return false
        this.$confirm('保存完成后，商家类型无法修改，请确认填写信息正确。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.customSubmitHandler()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      })
    },
    customSubmitHandler () {
      /*
      * 调用3个接口
      * 1.判断是否可以保存
      * 2.保存到中台
      * 3.保存到A10
      *
      * */
      businessManageApi.checkout(this.form.shop).then(res1 => {
        this.IsSuccess(res1, () => {
          businessManageApi.AddBase(this.form.businesses).then(res2 => {
            this.IsSuccess(res2, () => {
              this.form.shop.id = res2.data
              this.form.shop.landPhone = this.form.shop.contactPhone
              businessManageApi.Add(this.form.shop).then(res3 => {
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
