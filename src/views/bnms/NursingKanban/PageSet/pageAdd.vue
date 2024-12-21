<template>
  <layout v-loading="loading">
    <div slot="title">{{ form_type_text }}页面设置</div>

    <div slot="main" class="add-from">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="form-main-center"
        label-suffix=":"
      >
        <el-form-item label="页面名称" prop="pageName">
          <el-input
            v-model.trim="ruleForm.pageName"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item label="页面类型" prop="pageType">
          <el-radio v-model="ruleForm.pageType" :label="0">通用</el-radio>
          <el-radio v-model="ruleForm.pageType" :label="1">触屏版</el-radio>
          <el-radio v-model="ruleForm.pageType" :label="2">遥控器版</el-radio>
        </el-form-item>

        <el-form-item label="链接内容" prop="contentType">
          <el-radio v-model="ruleForm.contentType" :label="1" @change="initError">内部链接</el-radio>
          <el-radio v-model="ruleForm.contentType" :label="2" @change="initError">链接图片</el-radio>
          <el-radio v-model="ruleForm.contentType" :label="3" @change="initError">外部链接</el-radio>
        </el-form-item>

        <el-form-item v-if="ruleForm.contentType === 1 || ruleForm.contentType === 3" label="URL地址" prop="content">
          <el-input
            v-model.trim="ruleForm.content"
            type="textarea"
            placeholder="请输入"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item v-if="ruleForm.contentType === 1 || ruleForm.contentType === 3" label="支持背景开关" prop="backgroundImageShow">
          <el-switch
            v-model="ruleForm.backgroundImageShow"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

        <el-form-item v-if="ruleForm.contentType === 1 || ruleForm.contentType === 3" label="缩略图" prop="noRequiredUrl">
          <el-input
            v-model="ruleForm.thumbnailUrl"
            disabled
          />
        </el-form-item>

        <el-form-item v-if="ruleForm.contentType === 1 || ruleForm.contentType === 3">
          <!--上传图片组件-->
          <v-upload-image ref="imgDiv" :image-obj="ruleForm.imageObj" :img-size="1024" @callBackInfo="callBackInfo" @delImage="delImage" />
          <el-tooltip style="position: absolute;top:0;left: 120px;z-index: 999;cursor: pointer" class="item" effect="dark" content="浏览器标签图标大小为62*35,为了达到最佳效果，请上传比例为62/35的图标" placement="bottom">
            <img ref="statusImg" class="img-cls" src="/static/passport/img/icon_explain_default.png" @mouseenter="changeImgEnter('statusImg')" @mouseleave="changeImgLeave('statusImg')">
          </el-tooltip>
        </el-form-item>

        <!-- 链接图片展示内容 -->
        <el-form-item v-if="ruleForm.contentType === 2" label="链接图片" prop="thumbnailUrl">
          <el-input
            v-model="ruleForm.thumbnailUrl"
            disabled
          />
        </el-form-item>

        <el-form-item v-if="ruleForm.contentType === 2">
          <!--上传图片组件-->
          <v-upload-image ref="imgDiv" :image-obj="ruleForm.imageObj" :img-size="1024" @callBackInfo="callBackInfo" @delImage="delImage" />
          <el-tooltip style="position: absolute;top:0;left: 120px;z-index: 999;cursor: pointer" class="item" effect="dark" content="浏览器标签图标大小为62*35,为了达到最佳效果，请上传比例为62/62的图标" placement="bottom">
            <img ref="statusImg" class="img-cls" src="/static/passport/img/icon_explain_default.png" @mouseenter="changeImgEnter('statusImg')" @mouseleave="changeImgLeave('statusImg')">
          </el-tooltip>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入" maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer_btn" class="btnStyle">
      <el-button size="small" @click="close()" v-uni="'yemianshezhi_save'">取消 </el-button>
      <el-button type="primary" size="small" @click="submitForm" v-uni="'yemianshezhi_cancel'">保存</el-button>
    </div>
  </layout>
</template>

<script>

import layout from '../../../../components/bnms/layout/edit'
import vUploadImage from '../../../../components/bnms/UploadImage.vue'
import { PageSetApi, LayoutApi } from '../../../../api/bnms/index'

export default {
  name: 'PageAdd',
  components: {
    layout,
    vUploadImage
  },
  props: ['curRow'],
  data () {
    return {
      pageTitle: '添加',
      relese_page_visible: false,
      loading: false,
      form_type_text: '',
      pageForm: {
        menuName: '',
        chosePage: ''
      },
      ruleForm: {
        content: '',
        thumbnailUrl: '',
        imageObj: {
          avatar: 'avatar_menu',
          widthSmall: 'widthSmall',
          imgType: 'oldman',
          imageBase64: '',
          imageUrl: ''
        },
        remark: '',
        contentType: 1,
        pageType: 0,
        pageName: '',
        backgroundImageShow: 0
      },
      rules: {
        pageName: [
          { required: true, message: '请输入页面名称！', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符！',
            trigger: 'blur'
          }
        ],
        pageType: [
          { required: true, message: '请选择页面类型！', trigger: 'change' }
        ],
        contentType: [
          { required: true, message: '请选择链接内容！', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请填写URL地址！', trigger: 'blur' }
        ],
        thumbnailUrl: [
          { required: true, message: '请上传图片！', trigger: 'change' }
        ],
        backgroundImageShow: [
          { required: true }
        ]
      },
      pagerules: {
        menuName: [
          { required: true, message: '请输入菜单名称！', trigger: 'blur,change' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符！',
            trigger: 'blur'
          }
        ],
        chosePage: [
          { required: true, message: '请选择页面！', trigger: 'change' }
        ]
      }
    }
  },
  watch: {

  },
  created () {
    const params = this.curRow || {}

    this.form_type_text = Object.keys(params).length !== 0 ? '编辑' : '添加'

    Object.assign(this.ruleForm, params)

    this.ruleForm.imageObj.imageUrl = this.ruleForm.thumbnailUrl
  },
  methods: {
    initError () { // 重置错误信息
      this.$refs.ruleForm.clearValidate()
      this.ruleForm.content = ''
      this.ruleForm.thumbnailUrl = ''
      this.ruleForm.imageObj.imageUrl = ''
    },
    callBackInfo () { // 图片上传完成之后的回调
      this.ruleForm.thumbnailUrl = this.ruleForm.imageObj.imageUrl
    },
    delImage () {
      this.ruleForm.thumbnailUrl = this.ruleForm.imageObj.imageUrl
    },
    // 切换图片
    changeImgLeave (ref) {
      this.$refs[ref].src = '/static/passport/img/icon_explain_default.png'
    },
    // 切换图片
    changeImgEnter (ref) {
      this.$refs[ref].src = '/static/passport/img/icon_explain_slip.png'
    },
    pageDelete () { // 关联页面删除
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {

      }).catch(action => {

      })
    },
    submitForm () { // 添加页面设置的保存
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 当链接内容为外部链接的时候，需要对url地址进行加密
          if (this.ruleForm.contentType === 3) {
            this.ruleForm.content = '/common/url/' + Buffer.from(this.ruleForm.content, 'utf-8').toString('base64')
          } else if (this.ruleForm.contentType === 2) { // 对链接图片的地址进行base64加密
            this.ruleForm.content = '/common/image/' + Buffer.from(this.ruleForm.thumbnailUrl, 'utf-8').toString('base64')
          }

          PageSetApi.save(this.ruleForm).then((res) => {
            this.$message.success('保存成功！')
            this.close()

            // 初始化首页的页面默认布局
            // 判断url 地址为 /theme0/home 或者 /theme1/home的，先插入一条默认布局信息，再设置选中
            if (!this.ruleForm.pageId) {
              if ((this.ruleForm.contentType === 1 || this.ruleForm.contentType === 3) && this.ruleForm.content === '/theme0/home') {
                const _json = {
                  layoutName: '默认布局',
                  layoutStr: '{"position_1":{"classId":"5e7a9da32ba711eb91f80894efa56a0a","className":"统计信息","sort":4,"labelType":201,"createTime":null,"updateTime":null,"updateUser":null,"isDelete":0,"checked":true,"position":"position_1"},"position_2":{"classId":"5e6891272ba711eb91f80894efa56a0a","className":"病区概况","sort":1,"labelType":201,"createTime":null,"updateTime":null,"updateUser":null,"isDelete":0,"checked":true,"position":"position_2"},"position_3":{"classId":"tcxx_12315","className":"调床信息","labelType":"changeBed","checked":true,"position":"position_3"},"position_4":{"classId":"hjxx_12315","className":"呼叫信息","labelType":"calling","checked":true,"position":"position_4"},"position_5":{"classId":"5e7052c82ba711eb91f80894efa56a0a","className":"护理信息","sort":5,"labelType":201,"createTime":null,"updateTime":null,"updateUser":null,"isDelete":0,"checked":true,"position":"position_5"},"position_6":{"classId":"5e6026552ba711eb91f80894efa56a0a","className":"高危管理","sort":6,"labelType":201,"createTime":null,"updateTime":null,"updateUser":null,"isDelete":0,"checked":true,"position":"position_6"}}',
                  pageId: res.data,
                  remark: '系统默认布局'
                }

                LayoutApi.saveLayout(_json).then((resLayout) => {
                  if (res.status !== 200) {
                    this.$message.warning('添加默认布局失败！')
                  } else {
                    const _arr = [{ id: resLayout.data, pageId: res.data, checked: 1 }]
                    LayoutApi.updatePageLayout(_arr).then(() => {

                    }).catch((res) => {
                      this.$message.error('初始化默认布局失败')
                    })
                  }
                }).catch((res) => {
                  this.$message.warning('添加默认布局失败！')
                })
              } else if ((this.ruleForm.contentType === 1 || this.ruleForm.contentType === 3) && this.ruleForm.content === '/theme1/home') {
                const _json = {
                  layoutName: '默认布局',
                  layoutStr: '{"position_1":{"classId":"5e7a9da32ba711eb91f80894efa56a0a","className":"统计信息","sort":4,"labelType":201,"createTime":null,"updateTime":null,"updateUser":null,"isDelete":0,"checked":true,"position":"position_1"},"position_2":{"classId":"5e6891272ba711eb91f80894efa56a0a","className":"病区概况","sort":1,"labelType":201,"updateUser":null,"isDelete":0,"checked":true,"position":"position_2"},"position_3":{"classId":"tcxx_12315","className":"调床信息","labelType":"changeBed","checked":true,"position":"position_3"},"position_4":{"classId":"hjxx_12315","className":"呼叫信息","labelType":"calling","checked":true,"position":"position_4"},"position_5":{"classId":"5e7052c82ba711eb91f80894efa56a0a","className":"护理信息","sort":5,"labelType":201,"updateUser":null,"isDelete":0,"checked":true,"position":"position_5"},"position_6":{"classId":"5e6026552ba711eb91f80894efa56a0a","className":"高危管理","sort":6,"labelType":201,"createTime":null,"createUser":null,"updateTime":null,"updateUser":null,"isDelete":0,"checked":true,"position":"position_6"},"position_7":{"classId":"hzxx_12315","className":"患者信息","labelType":"warning","checked":true,"position":"position_7"}}',
                  pageId: res.data,
                  remark: '系统默认布局'
                }

                LayoutApi.saveLayout(_json).then((resLayout) => {
                  if (res.status !== 200) {
                    this.$message.warning('添加默认布局失败！')
                  } else {
                    const _arr = [{ id: resLayout.data, pageId: res.data, checked: 1 }]
                    LayoutApi.updatePageLayout(_arr).then(() => {

                    }).catch((res) => {
                      this.$message.error('初始化默认布局失败')
                    })
                  }
                }).catch((res) => {
                  this.$message.warning('添加默认布局失败！')
                })
              }
            }
          }).catch((res) => {
            // 失败之后，对加密的数据进行解密
            if (this.ruleForm.contentType === 3) {
              this.ruleForm.content = this.ruleForm.content.replace('/common/url/', '')
              this.ruleForm.content = Buffer.from(this.ruleForm.content, 'base64').toString('utf-8')
            } else if (this.ruleForm.contentType === 2) {
              this.ruleForm.content = this.ruleForm.content.replace('/common/url/', '')
              this.ruleForm.content = Buffer.from(this.ruleForm.content, 'base64').toString('utf-8')
            }

            this.$message.error(res.message)
          })
        }
      })
    },
    // 返回
    close () {
      this.$emit('closeDrawer')
      // this.$refs.ruleForm.resetFields()
    },
    addPage (data) {
      if (data) {
        this.pageTitle = '编辑'
        this.pageForm.pageName = data.pageName
        this.pageForm.smallPic = data.smallPic
        this.pageForm.menuName = data.menuName
      }
      this.relese_page_visible = true
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";

.btnStyle{
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: 0px;
  background: #FFFFFF;
  box-shadow: 0px 0px 6px 0px rgba(113, 113, 113, 0.3);
  height: 56px;
  line-height: 56px;
}

.add-from {
  height: calc(100% - 195px);
  overflow-y: auto;
}
</style>
