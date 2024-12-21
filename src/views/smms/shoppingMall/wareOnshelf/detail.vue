<!--
  文件描述：上架审核-查看详情
    主样式class：list-page-new
  创建时间：2020/4/16 18:19
  创建人：Administrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
  关于主体查询方法，方法名为：executeQueryPage
  表格数据变量为：pagination.list

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->
<template>
  <el-container class="list-page-new">
    <el-header height="auto" class="header-hastitle" style="margin-bottom: 6px;">
      <!--有标题的话，header的class = header-hastitle-->
      <div class="title">
        <slot name="title">
          商品详情
        </slot>
      </div>
      <!--查询条件模块 === START-->
      <!--<div class="query-items-container" ref="query_form">
        <slot name="query">
          &lt;!&ndash;&ndash;&gt;
        </slot>
      </div>-->
      <!--查询条件模块 === END-->
      <hr style="background-color: #E4E7ED; margin: 0; height: 1px;" v-if="$slots.query && ($slots.left_btn || $slots.right_btn)"/>
      <div class="tool-container">
        <div class="left">
          <!--左边按钮-->
          <slot name="left_btn">

          </slot>
        </div>
        <div class="right">
          <!--右边按钮-->
          <slot name="right_btn">
            <el-button
                       round
                       type="primary"
                       size="mini"
                       @click="backHandler">返回</el-button>
          </slot>
        </div>
      </div>
    </el-header>
    <el-main class="main-detail">
      <!--主体列表-->
      <slot name="main">
        <el-form :model="form">
          <el-form-item label="商品名称：">{{ form.title }}</el-form-item>
          <el-form-item label="商品分类：">{{ form.categoryName }}</el-form-item>
          <el-form-item label="商品图片：" style="height:auto">
            <img :src="form.mainImage" style="width: 80px">
          </el-form-item>
          <el-form-item label="商品描述：">{{ form.waredesc }}</el-form-item>
          <el-form-item label="商品规格：">
            <div class="detail-skuDtoList">
              <span class="babel">{{wareInfo.specification===0?'单规格：':'多规格：'}}</span>
              <div class="sku-content" v-for="(item,index) in wareInfo.skuDtoList" :key="index">
                <span class="l" v-if="wareInfo.specification!==0">规格名称：</span>
                <span v-if="wareInfo.specification!==0">{{item.skuName}}</span>
                <span class="l">价格：</span>
                <span>{{item.price}}元</span>
                <span class="l">包装费</span>
                <span>{{item.packingFee}}元</span>
                <span class="l">库存</span>
                <span>{{item.stockCurrent}}/{{item.stockMax}}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="商品属性：">
            <div v-if="wareInfo.attributeDtoList&&wareInfo.attributeDtoList.length>0" class="detail-skuDtoList">
              <div class="sku-content" v-for="(item,index) in wareInfo.attributeDtoList" :key="index">
                <span class="l">属性名称：</span>
                <span>{{item.name}}</span>
                <span class="l">属性细分：</span>
                <span>{{dealattribute(item.valueList)}}</span>
              </div>
            </div>
            <div v-else class="detail-skuDtoList detail-empty">
            </div>
          </el-form-item>
          <!--          <el-form-item label="立即上架">{{ form.shelfState }}</el-form-item>-->
        </el-form>
      </slot>
    </el-main>

    <el-footer height="auto" class="page-bar">
      <!--分页条-->
      <slot name="footer">

      </slot>
    </el-footer>
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>

    </slot>
  </el-container>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import {
  showWare
} from '../../../../api/smms/shopingMall/wareOnshelfList'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'

export default {
  name: 'wareOnshelfListLog',
  // import引入的组件需要注入到对象中才能使用
  mixins: [BaseQueryPageForm],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    // 这里存放数据
    return {
      wareId: '',
      form: {
        title: '',
        categoryName: '',
        mainImage: '',
        waredesc: '',
        showGG: '',
        showSX: '',
        shelfState: '',
        remark: '',
        ids: '',
        state: ''
      },
      wareInfo: {}
    }
  },
  // 监听属性 类似于data概念
  mounted () {
    this.executeQueryPage()
  },
  computed: {},
  // 方法集合
  methods: {
    dealattribute (v) {
      let v2 = []
      let v3 = v.split(',')
      for (let i = 0; i < v3.length; i++) {
        if (v3[i] !== '')v2.push(v3[i])
      }
      return v2.join(',')
    },
    backHandler (data) {
      this.$emit('option-changed', 'wareOnshelfList')
    },
    executeQueryPage () {
      showWare(this.detail.row.id)
        .then(res => {
          this.wareInfo = res.data

          this.form.title = res.data.title
          this.form.categoryName = res.data.categoryName
          this.form.mainImage = res.data.mainImage
          this.form.waredesc = res.data.waredesc
          this.form.shelfState = res.data.shelfState === 0 ? '未上架' : '已上架'
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
    }
  }
}
</script>

<style lang='scss'>
  @import '@/assets/smms/css/self_common.scss';
  .main-detail{
    padding: 20px 30px !important;
    overflow-y: scroll !important;
    .el-form{
      .el-form-item{
        .detail-skuDtoList{
          width: 60%;
          border: 1px solid #f0f2f6;
          border-radius: 6px;
          padding: 5px;
          margin-top: 40px;
          .babel{
            padding: 3px 6px;
            background-color: #e5f2fe;
            border-radius: 16px;
          }
          .sku-content{
            span{
              margin: 5px;
            }
            .l{
              color: #454545;
            }
          }
        }
      }
    }

  }
  .detail-empty{
    height: 34px;
  }
</style>
