<!--
  文件描述：新ui设计的添加\编辑页面
    主样式class：edit-page-new
  创建时间：2020/4/8 13:39
  创建人：Adsmallstrator
-->

<template>
  <el-container class="edit-page-new">
    <el-header :height="'48px'">
      <div class="title">
        <slot name="title">
          {{ shopTypeName }}{{ isEdit ? '编辑' : '添加' }}
        </slot>
      </div>
      <div class="right-btn">
        <slot name="right_btn"> </slot>
      </div>
    </el-header>
    <el-main>
      <slot name="main">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item :label="`${shopTypeName}名称：`" prop="title">
            <el-input
              v-model.trim="form.title"
              style="width: 35%"
              size="small"
            />
          </el-form-item>
          <el-form-item
            :label="`${shopTypeName}分类：`"
            prop="categoryId"
            label-width="120px"
          >
            <el-select
              v-model="form.categoryId"
              placeholder="请选择"
              style="width: 35%"
              size="small"
            >
              <el-option
                v-for="item in detail.wareType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="mainImage" :label="`${shopTypeName}展示图：`">
            <v-upload-image :imageObj="imageObj" ref="imgDiv"></v-upload-image>
          </el-form-item>
          <el-form-item :label="`${shopTypeName}描述：`" prop="waredesc">
            <el-input
              v-model.trim="form.waredesc"
              type="textarea"
              placeholder="不超过100个字符"
              :rows="4"
              style="width: 50rem"
              size="small"
            />
          </el-form-item>
          <el-form-item :label="`${shopTypeName}规格：`">
            <el-radio-group
              v-model="form.specification"
              @change="specificationAdd"
            >
              <el-radio :label="0">单规格</el-radio>
              <el-radio :label="1">多规格</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 商品规格 -->
          <div class="label-border">
            <template v-for="(sku, index) in form.skuDtoList">
              <el-row :key="'sku-' + index">
                <el-col v-if="form.specification == 1" :span="4">
                  <el-form-item
                    label-width="85px"
                    label="规格名称："
                    :prop="'skuDtoList.' + index + '.skuName'"
                    :rules="rules.skuName"
                  >
                    <el-input
                      v-model.trim="sku.skuName"
                      class="item"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label-width="90px"
                    label="价格："
                    :prop="'skuDtoList.' + index + '.price'"
                    :rules="rules.price"
                  >
                    <el-input
                      v-model="sku.price"
                      type="text"
                      class="item"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4" v-if="shopStatas.shopType !== '2'">
                  <el-form-item
                    label="包装费："
                    label-width="80px"
                    :prop="'skuDtoList.' + index + '.packingFee'"
                    :rules="rules.packingFee"
                  >
                    <el-input
                      v-model="sku.packingFee"
                      class="item"
                      type="text"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label="库存："
                    label-width="80px"
                    :prop="'skuDtoList.' + index + '.stockCurrent'"
                    :rules="rules.stockCurrent"
                  >
                    <el-input
                      v-model="sku.stockCurrent"
                      class="item"
                      type="text"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label="/"
                    label-width="20px"
                    :prop="'skuDtoList.' + index + '.stockMax'"
                    :rules="rules.stockMax"
                  >
                    <el-input
                      v-model="sku.stockMax"
                      type="text"
                      class="item"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="small-btn">
                  <div v-show="form.specification == 1">
                    <el-button
                      v-if="index > 1"
                      type="danger"
                      icon="el-icon-minus"
                      title="删除"
                      circle
                      @click="specDel(sku)"
                      size="small"
                      class="button-model-del"
                    />
                    <el-button
                      v-if="index == 1 && form.specification === 1"
                      type="primary"
                      icon="el-icon-plus"
                      title="添加"
                      circle
                      @click="specAdd"
                      size="small"
                      class="button-model-add"
                    />
                  </div>
                </el-col>
              </el-row>
            </template>
          </div>
          <div style="display: none">
            <h2>商品属性：form.wareItem----</h2>
            {{ form.wareItem }}
          </div>
          <!-- 商品属性 -->
          <el-form-item :label="`${shopTypeName}属性：`"></el-form-item>
          <div class="label-border">
            <template v-for="(wareItem, index) in form.wareItem">
              <el-row :key="'wareItem-' + index">
                <el-col :span="4">
                  <el-form-item
                    label="属性名称："
                    label-width="90px"
                    :prop="'wareItem.' + index + '.name'"
                    :rules="rules.sxname"
                  >
                    <el-input
                      v-model.trim="wareItem.name"
                      class="item"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label="属性细分："
                    label-width="85px"
                    :prop="'wareItem.' + index + '.num'"
                    :rules="rules.sxname"
                  >
                    <el-input
                      v-model.trim="wareItem.num"
                      class="item"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :prop="'wareItem.' + index + '.two'"
                    label-width="20px"
                    :rules="rules.sxname"
                  >
                    <el-input
                      v-model.trim="wareItem.two"
                      class="item"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :prop="'wareItem.' + index + '.three'"
                    label-width="15px"
                    :rules="rules.sxname"
                  >
                    <el-input
                      v-model.trim="wareItem.three"
                      class="item"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :prop="'wareItem.' + index + '.four'"
                    label-width="15px"
                    :rules="rules.sxname"
                  >
                    <el-input
                      v-model.trim="wareItem.four"
                      class="item"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :prop="'wareItem.' + index + '.five'"
                    label-width="15px"
                    :rules="rules.sxname"
                  >
                    <el-input
                      v-model.trim="wareItem.five"
                      class="item"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3" class="small-btn">
                  <el-button
                    v-if="index == 0"
                    type="primary"
                    icon="el-icon-plus"
                    title="添加"
                    circle
                    @click="wareItemAdd"
                    size="small"
                    class="button-model-add"
                  />
                  <el-button
                    v-else
                    type="danger"
                    icon="el-icon-minus"
                    title="删除"
                    circle
                    @click="wareItemDel(wareItem)"
                    size="small"
                    class="button-model-del"
                  />
                </el-col>
              </el-row>
            </template>
          </div>
          <el-form-item
            v-if="!isEdit"
            label="创建后立即上架："
            style="white-space: nowrap"
          >
            <el-switch
              v-model="form.shelfState"
              :inactive-value="0"
              :active-value="1"
              active-color="#13ce66"
              @change="changeshelfState"
            />
          </el-form-item>
        </el-form>
      </slot>
      <div class="footer-btn typt-add-footer" style="margin-top: 15px">
        <slot name="footer_btn">
          <el-button @click="backHandler" size="small">取消</el-button>
          <el-button type="primary" @click="submitClick('form')" size="small"
            >保存</el-button
          >
        </slot>
      </div>
    </el-main>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot></slot>
  </el-container>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import BaseEditForm from '../../common/BaseEditForm'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import { deepMergeLeft } from '@/assets/smms/utils'
import * as wareManageApi from '@/api/smms/shopingMall/wareManage'
import mains from './mains'
import vUploadImage from '../../../../components/smms/CropperUploadImg.vue'

export default {
  name: 'edit2',
  // import引入的组件需要注入到对象中才能使用
  components: {
    vUploadImage
  },
  mixins: [BaseEditForm, mains, BaseQueryPageForm],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  data () {
    const form = this.initForm()
    const rules = this.initRules()
    const shopStatas = this.initStates()
    return {
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
      shopTypeName: '商品', // 店铺类型
      isEdit: false,
      show: false,
      form: form,
      rules: rules,
      dialogFormVisible: false, // 添加商品属性开关
      shopStatas: shopStatas
    }
  },
  mounted () {
    let shopType = JSON.parse(localStorage.getItem('shopInfo.shopType'))
    if (Number(shopType) === 2) this.shopTypeName = '服务'

    deepMergeLeft(this.form, this.initForm())

    this.$nextTick(() => {
      this.$refs['form'].clearValidate()
    })

    if (this.detail.row && this.detail.row.id !== '') {
      this.isEdit = true
      wareManageApi.Detail(this.detail.row.id).then(res => {
        const obj = []
        this.IsSuccess(res, () => {
          this.imageObj.imageUrl = res.data.mainImage || ''
          //  特殊处理一下 其他项目可不用这个
          if (res.data.attributeDtoList.length === 0) {
            res.data.wareItem = this.form.wareItem
          } else {
            res.data.attributeDtoList.forEach((value, index) => {
              var val = value.valueList.split(',')
              // 当设计单规格 那么属性名称是没有的 这个地方可以置空
              obj.push({
                name: value.name,
                num: val[0] || '',
                two: val[1] || '',
                three: val[2] || '',
                four: val[3] || '',
                five: val[4] || ''
              })
            })
            res.data.wareItem = obj
          }
          deepMergeLeft(this.form, res.data)
          this.$nextTick(() => {
            this.$refs['form'].clearValidate()
            // this.form.shelfState = 0
          })
        }, false)
      })
    }
  },
  methods: {
    // 文章展示图上传成功后的地址
    handleUploadSucceed (data) {
      //  data.name  //图片名称
      //  data.url  //图片地址
      this.form.mainImage = data.url
      this.$refs.form.clearValidate('mainImage')
    },
    toggleShow () {
      this.show = !this.show
    },
    changeshelfState () {
      if (this.form.shelfState === 0) {
        this.form.auditState = -1
      } else {
        this.form.auditState = 0
      }
    },
    submitClick (form) {
      const arr = []
      let arrName = []
      this.form.mainImage = this.imageObj.imageUrl
      this.form.wareItem.forEach((value, index) => {
        // 当设计单规格 那么属性名称是没有的 这个地方可以置空
        if (value.name !== '' || value.num !== '') {
          arrName.push(value.name)
          arr.push({
            name: value.name,
            valueList: [
              value.num,
              value.two,
              value.three,
              value.four,
              value.five
            ].toString()
          })
        }
      })
      if (this.isRepeat(arrName.join(','))) {
        this.$message({
          type: 'warning',
          message: '属性名称不能重复！'
        })
        return
      }
      for (let v of arr) {
        let valueList = v.valueList
        console.log(JSON.stringify(v))

        if (this.isRepeat(valueList)) {
          this.$message({
            type: 'warning',
            message: '属性细分中不能有重复项！'
          })
          return
        }
      }

      this.form.attributeDtoList = arr
      this.submitHandler(form)
    },
    isRepeat (arr) {
      let a = arr.split(',')
      var hash = {}
      for (var i in a) {
        if (hash[a[i]] && a[i] !== '') {
          return true
        }
        hash[a[i]] = true
      }
      return false
    },
    // 保存
    customSubmitHandler () {
      if (this.isEdit) {
        wareManageApi.Edit(this.form).then(data => {
          // this.submitSuccessHandler(data)
          this.IsSuccess(data, () => {
            this.backHandler()
          }, true)
        })
      } else {
        wareManageApi.Add(this.form).then(data => {
          // this.submitSuccessHandler(data)
          this.IsSuccess(data, () => {
            this.backHandler()
          }, true)
        })
      }
    },
    // 商品规格添加
    specAdd () {
      if (this.form.skuDtoList.length < 8) {
        this.form.skuDtoList.push({
          skuName: '', // sku名称
          price: '', // 价格
          packingFee: '', // 包装费
          stockCurrent: '', // 当前库存
          stockMax: '' // 库存最大值
        })
      } else {
        this.$message('亲.最大只能添加8条！')
      }
    },
    // 商品规格删除
    specDel (item) {
      if (this.form.skuDtoList.length <= 2 && this.form.specification === 1) {
        this.$message({
          type: 'error',
          message: '多规格时至少有两项'
        })
        return false
      }

      var index = this.form.skuDtoList.indexOf(item)
      if (index !== -1) {
        this.form.skuDtoList.splice(index, 1)
      }
    },
    // 商品属性添加
    wareItemAdd () {
      if (this.form.wareItem.length < 5) {
        this.form.wareItem.push({
          name: '',
          num: '',
          two: '',
          three: '',
          four: '',
          five: ''
        })
      } else {
        this.$message('亲.最大只能添加5条！')
      }
    },
    // 商品属性删除
    wareItemDel (item) {
      var index = this.form.wareItem.indexOf(item)
      if (index !== -1) {
        this.form.wareItem.splice(index, 1)
      }
    }
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
<style lang='scss'>
.edit-page-new {
  .el-input__inner {
    height: 34px;
  }
}
@import '@/assets/smms/css/self_common.scss';
</style>
