<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo" />
      <div class="typt-tit-content">商品添加</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width:98rem">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="商品名称" prop="title">
            <el-input v-model.trim="form.title" style="width:55%" />
          </el-form-item>
          <el-form-item label="商品分类" prop="categoryId" label-width="120px">
            <el-select v-model="form.categoryId" placeholder="请选择" style="width:55%">
              <el-option
                v-for="item in detail.wareType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="mainImage" label="商品展示图">
            <template>
              <App-cropper
                :width="178"
                :height="178"
                :fixed-number="[1,1]"
                v-model="form.mainImage"
                @subUploadSucceed="handleUploadSucceed"
              />
            </template>
          </el-form-item>
          <el-form-item label="商品描述" prop="waredesc">
            <el-input
              v-model.trim="form.waredesc"
              type="textarea"
              placeholder="不超过100个字符"
              :rows="4"
              style="width:50rem;"
            />
          </el-form-item>
          <el-form-item label="商品规格">
            <el-radio-group v-model="form.specification" @change="specificationAdd">
              <el-radio :label="0">单规格</el-radio>
              <el-radio :label="1">多规格</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 商品规格 -->
          <el-form-item prop="ep_name">
            <template v-for="(sku,index) in form.skuDtoList">
              <el-row :key="'sku-'+index">
                <el-col v-if="form.specification==1" :span="4">
                  <el-form-item
                    label-width="85px"
                    label="规格名称"
                    :prop="'skuDtoList.' + index + '.skuName'"
                    :rules="rules.skuName"
                  >
                    <el-input v-model.trim="sku.skuName" class="item" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label-width="80px"
                    label="价格"
                    :prop="'skuDtoList.' + index + '.price'"
                    :rules="rules.price"
                  >
                    <el-input v-model="sku.price" type="text" class="item" />
                  </el-form-item>
                </el-col>
                <el-col :span="4" v-if="shopStatas.shopType !=='2'">
                  <el-form-item
                    label="包装费"
                    label-width="80px"
                    :prop="'skuDtoList.' + index + '.packingFee'"
                    :rules="rules.packingFee"
                  >
                    <el-input v-model="sku.packingFee" class="item" type="text" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label="库存"
                    label-width="60px"
                    :prop="'skuDtoList.' + index + '.stockCurrent'"
                    :rules="rules.stockCurrent"
                  >
                    <el-input v-model="sku.stockCurrent" class="item" type="text" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label="/"
                    label-width="20px"
                    :prop="'skuDtoList.' + index + '.stockMax'"
                    :rules="rules.stockMax"
                  >
                    <el-input v-model="sku.stockMax" type="text" class="item" />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <div v-show="form.specification==1">
                    <el-button
                      v-if="index==1 && form.specification===1"
                      type="primary"
                      icon="el-icon-plus"
                      title="添加"
                      circle
                      @click="specAdd"
                    />
                    <el-button
                      v-if="index>1"
                      type="danger"
                      icon="el-icon-minus"
                      title="删除"
                      circle
                      @click="specDel(sku)"
                    />
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-form-item>
          <!-- 商品属性 -->
          <el-form-item label="商品属性">
            <template v-for="(wareItem,index) in form.wareItem">
              <el-row :key="'wareItem-'+index">
                <el-col :span="4">
                  <el-form-item
                    label="属性名称"
                    label-width="80px"
                    :prop="'wareItem.' + index + '.name'"
                    :rules="rules.name"
                  >
                    <el-input v-model.trim="wareItem.name" class="item" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label="属性细分"
                    label-width="85px"
                    :prop="'wareItem.' + index + '.num'"
                    :rules="rules.num"
                  >
                    <el-input v-model.trim="wareItem.num" class="item" />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :prop="'wareItem.' + index + '.two'"
                    label-width="20px"
                    :rules="rules.two"
                  >
                    <el-input v-model.trim="wareItem.two" class="item" />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :prop="'wareItem.' + index + '.three'"
                    label-width="15px"
                    :rules="rules.three"
                  >
                    <el-input v-model.trim="wareItem.three" class="item" />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :prop="'wareItem.' + index + '.four'"
                    label-width="15px"
                    :rules="rules.four"
                  >
                    <el-input v-model.trim="wareItem.four" class="item" />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :prop="'wareItem.' + index + '.five'"
                    label-width="15px"
                    :rules="rules.five"
                  >
                    <el-input v-model.trim="wareItem.five" class="item" />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item>
                    <el-button
                      v-if="index==0"
                      type="primary"
                      icon="el-icon-plus"
                      title="添加"
                      circle
                      @click="wareItemAdd"
                    />
                    <el-button
                      v-else
                      type="danger"
                      icon="el-icon-minus"
                      title="删除"
                      circle
                      @click="wareItemDel(wareItem)"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-form-item>
          <el-form-item label="立即上架">
            <el-switch v-model="form.shelfState" :inactive-value="0" :active-value="1" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="backHandler">取消</el-button>
      <el-button type="primary" @click="submitClick('form')">保存</el-button>
    </div>
  </div>
</template>

<script>
import BaseEditForm from '../../common/BaseEditForm'
import { deepMergeLeft } from '@/assets/smms/utils'
import * as wareManageApi from '@/api/smms/shopingMall/wareManage'
import mains from './mains'
import AppCropper from '@/components/smms/Upload/Upload'

export default {
  components: {
    AppCropper
  },
  mixins: [BaseEditForm, mains],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    const form = this.initForm()
    const rules = this.initRules()
    const shopStatas = this.initStates()
    return {
      show: false,
      imgDataUrl: '',
      form: form,
      rules: rules,
      dialogFormVisible: false, // 添加商品属性开关
      shopStatas: shopStatas
    }
  },
  mounted () {
    deepMergeLeft(this.form, this.initForm())
    this.$nextTick(() => {
      this.$refs['form'].clearValidate()
    })
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
    submitClick (form) {
      const arr = []
      this.form.wareItem.forEach((value, index) => {
        // 当设计单规格 那么属性名称是没有的 这个地方可以置空
        if (value.name !== '' || value.num !== '') {
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

      this.form.attributeDtoList = arr
      this.submitHandler(form)
    },
    customSubmitHandler () {
      wareManageApi.Add(this.form).then(data => {
        this.submitSuccessHandler(data)
      })
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
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style  scoped>
.btn-area {
  padding: 20px 0px 10px 0px;
}
.query-area > div {
  margin-right: 50px;
}

.addbtn {
  float: right;
}

.waretype {
  width: 10rem;
  display: inline-table;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.item {
  width: 12em;
}
.add {
  border: 1px solid;
  width: 178px;
  height: 178px;
  color: #ccc;
  transition: color 0.25s;
  position: relative;
}

.add::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 80px;
  margin-left: -40px;
  margin-top: -5px;
  border-top: 10px solid;
}
.add::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  height: 80px;
  margin-left: -5px;
  margin-top: -40px;
  border-left: 10px solid;
}

.add:hover {
  color: #1890ff;
}

.upImages {
  width: 178px;
  height: 178px;
  border: 1 slateblue solid;
}

.el-col,
.el-col-4 {
  height: 3.5rem;
}
</style>
