<template>
  <div class="typt-list-main">
    <div class="typt-add-container" id="addForm">
      <div class="typt-add-form passport-add-system">
        <el-form :rules="rules" ref="addFormData" class="from" label-width="150px" :model="addFormData">
          <div class="passport-tit-content" style="margin-top: 0">机构显示</div>
          <div class="passport-add-content">
            <el-form-item label="机构编号：" prop="orgCode">
              {{addFormData.orgCode}}
            </el-form-item>
            <el-form-item label="机构名称：" prop="orgName">
              <el-input v-uni="actFormKey + 'jigoumingcheng'" v-model="addFormData.orgName" clearable></el-input>
            </el-form-item>
            <el-form-item label="组织机构编码：" prop="zzjgdm">
              {{addFormData.zzjgdm}}
            </el-form-item>
            <el-form-item label="机构logo：" prop="icon">
              <!--上传图片组件-->
              <cropper-upload-img v-uni="actKey + 'upload_logo'" :imageObj="imageObjLogo" ref="imgDivLogo" />
            </el-form-item>
            <div style="height: 5px"></div>
          </div>
          <div class="passport-tit-content">系统显示</div>
          <div class="passport-add-content">
            <!--<el-form-item label="系统主题：" prop="systemThemeColor">
              <el-radio-group v-model="addFormData.systemThemeColor">
                <el-radio label="#1E87F0">宝石蓝</el-radio>
                <el-radio label="#FF9D11">清香橙</el-radio>
                <el-radio label="#009995">荷叶绿</el-radio>
                <el-radio label="#743B8F">紫罗兰</el-radio>
                <el-radio label="#E0241B">烈焰红</el-radio>
              </el-radio-group>
              <div :class="{
            'color-div': true,
            'color-blue': addFormData.systemThemeColor === '#1E87F0',
            'color-orange': addFormData.systemThemeColor === '#FF9D11',
            'color-green': addFormData.systemThemeColor === '#009995',
            'color-purple': addFormData.systemThemeColor === '#743B8F',
            'color-red': addFormData.systemThemeColor === '#E0241B'
            }">
                <div class="item-color-div" :style="'background-color:' + addFormData.systemThemeColor"></div>
                <div class="item-color-text">
                  <span style="color: #CCCECE;">#</span>
                  <span style="color: #333333;margin-left: 5px;">{{addFormData.systemThemeColor.replace('#', '')}}</span></div>
              </div>
            </el-form-item>-->
            <el-form-item label="浏览器标签：" prop="windowName" style="position: relative">
              <!--上传图片组件-->
              <v-upload-image v-uni="actKey + 'upload_label'" :imageObj="imageObj" ref="imgDiv"></v-upload-image>
              <el-tooltip style="position: absolute;top:0;left: 120px;z-index: 999;cursor: pointer" class="item" effect="dark" content="浏览器标签图标大小为16*16,为了达到最佳效果，请上传比例为16/16的图标" placement="bottom">
                <img ref="statusImg" @mouseenter="changeImgEnter('statusImg')" @mouseleave="changeImgLeave('statusImg')" class="img-cls" src="/static/passport/img/icon_explain_default.png"/>
              </el-tooltip>
              <el-input v-uni="actFormKey + 'biaoqianmingcheng'" style="margin-top: 30px;" v-model="addFormData.windowName" clearable></el-input>
            </el-form-item>
            <el-form-item label="系统内页：" prop="systemName">
              <el-tooltip style="position: absolute;top:0;left: 120px;z-index: 999;cursor: pointer" class="item" effect="dark" content="系统内页图标大小为56*15,为了达到最佳效果，请上传比例为56/15的图标" placement="bottom">
                <img ref="systemImg" @mouseenter="changeImgEnter('systemImg')" @mouseleave="changeImgLeave('systemImg')" class="img-cls" src="/static/passport/img/icon_explain_default.png"/>
              </el-tooltip>
              <!--上传图片组件-->
              <v-upload-image v-uni="actKey + 'upload_main'" :imageObj="imageObj1" ref="imgDiv1"></v-upload-image>
              <el-input v-uni="actFormKey + 'xitongneiyemingcheng'" style="margin-top: 30px" v-model="addFormData.systemName" clearable></el-input>
            </el-form-item>
            <el-form-item label="是否显示备案号：" prop="recordNum">
              <el-radio-group v-uni="actFormKey + 'shifouxianshibeianhao'" v-model="addFormData.recordNum" @change="recordNumChange">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1" style="margin-left: 30px">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="addFormData.recordNum == 1" prop="recordNumDesc">
              <el-input v-uni="actFormKey + 'beianhao'" placeholder="请输入备案号信息，将会显示在系统中" v-model="addFormData.recordNumDesc" clearable></el-input>
            </el-form-item>
            <!--<el-form-item label="登录页logo：" prop="loginIconFlag">
              &lt;!&ndash;上传图片组件&ndash;&gt;
              <v-upload-image :imageObj="imageObjLogin" ref="imageLogin"></v-upload-image>
              <el-input style="margin-top: 30px" v-model="addFormData.loginIconName" clearable></el-input>
            </el-form-item>
            <el-form-item label="登录页背景图：" prop="loginBackgroundFlag">
              &lt;!&ndash;上传图片组件&ndash;&gt;
              <v-upload-image :imageObj="imageObjBg" ref="imgDivBg"></v-upload-image>
            </el-form-item>-->
            <div style="height: 5px;"></div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button v-uni="actKey + 'save'" type="primary" @click="onSubmit()" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http'
import { MsgShow, ResultMsg } from '../../../assets/passport/js/Message'
import vUploadImage from '../../../components/passport/UploadImage.vue'
import CropperUploadImg from '../../../components/passport/CropperUploadImg.vue'
export default {
  components: {
    vUploadImage, CropperUploadImg
  },
  // inject:['changeTheme'],
  data () {
    return {
      imageObj: {
        avatar: 'avatar',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: '',
        imgTypeStr: ''
      },
      imageObjLogo: {
        avatar: 'avatar',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: '',
        fromWhere: 'apply',
        isCut: 'yes'
      },
      /* imageObjBg: {
        avatar: 'avatar',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: ''
      },
      imageObjLogin: {
        avatar: 'avatar',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: ''
      }, */
      imageObj1: {
        avatar: 'avatar_menu',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: ''
      },
      loading: false,
      addVis: false,
      addFormData: {
        windowIcon: '/static/passport/img/favicon.ico',
        windowName: '山东亚华电子股份有限公司',
        systemName: '山东亚华电子股份有限公司',
        systemIcon: '/static/passport/img/yarward.png',
        orgName: '',
        orgIcon: '',
        zzjgdm: '',
        icon: '1',
        loginIcon: '/static/passport/img/tit_yarward.png',
        recordNum: 1,
        // loginBackground: '/static/passport/img/leftImgNew.jpg',
        // loginBackgroundFlag: '1',
        // loginIconFlag: '1',
        // loginIconName: '',
        recordNumDesc: '版权所有 © 2019 YARWARD 备案号：鲁ICP备17056434号',
        orgCode: ''
        // systemThemeColor: '#1E87F0'
      },
      modelName: '显示设置',
      colorObj: {
        '#1E87F0': 'data-theme-blue',
        '#FF9D11': 'data-theme-orange',
        '#009995': 'data-theme-green',
        '#743B8F': 'data-theme-purple',
        '#E0241B': 'data-theme-red'
      },
      rules: {
        windowName: [
          { required: true, message: '请输入浏览器标签名称', trigger: 'blur' },
          { max: 30, message: '浏览器标签名称长度不能超过30位', trigger: 'blur' }
        ],
        systemName: [
          { required: true, message: '请输入系统内页名称', trigger: 'blur' },
          { max: 30, message: '系统内页名称长度不能超过30位', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { max: 10, message: '机构名称长度不能超过10位', trigger: 'blur' }
        ],
        loginIconName: [
          { required: true, message: '请输入登录页系统名称', trigger: 'blur' },
          { max: 20, message: '登录页系统名称长度不能超过20位', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '请输入机构编号', trigger: 'blur' }
        ],
        /* loginIconFlag: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        loginBackgroundFlag: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ], */
        recordNumDesc: [
          { required: true, message: '请输入备案号', trigger: 'blur' }
        ],
        recordNum: [
          { required: true, message: '请选择是否显示备案号', trigger: 'change' }
        ]/*,
        systemThemeColor: [
          { required: true, message: '请选择系统主题', trigger: 'change' }
        ] */
      },
      url: '/passport/web-rbac/iconConfig',
      actFormKey:  'xianshishezhi__',
      actKey: 'xianshishezhi_'
    }
  },
  mounted () {
    // this.addFormData.loginIconName = window.GLOBAL_CONFIG.SYSTEM_NAME || '亚华智慧医院系统'
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.addFormData.orgCode = orgInfo.orgCode
    this.getSetData()
  },
  methods: {
    // 是否显示备案号
    recordNumChange () {
      if (this.addFormData.recordNum === 0) {
        this.addFormData.recordNumDesc = '版权所有 © 2019 YARWARD 备案号：鲁ICP备17056434号'
      }
      this.$nextTick(() => {
        var container = this.$el.querySelector('#addForm')
        container.scrollTop = container.scrollHeight
      })
    },
    // 切换图片
    changeImgLeave (ref) {
      this.$refs[ref].src = '/static/passport/img/icon_explain_default.png'
    },
    // 切换图片
    changeImgEnter (ref) {
      this.$refs[ref].src = '/static/passport/img/icon_explain_slip.png'
    },
    // 保存设置
    onSubmit () {
      this.$refs['addFormData'].validate((valid) => {
        if (valid) {
          let img1 = this.$refs.imgDiv.imageObj.imageUrl
          let img2 = this.$refs.imgDiv1.imageObj.imageUrl
          let imgLogo = this.$refs.imgDivLogo.imageObj.imageUrl
          /* let imageLogin = this.$refs.imageLogin.imageObj.imageUrl
          let imgDivBg = this.$refs.imgDivBg.imageObj.imageUrl */

          this.addFormData.windowIcon = img1
          this.addFormData.systemIcon = img2
          this.addFormData.orgIcon = imgLogo
          /* this.addFormData.loginIcon = imageLogin
          this.addFormData.loginBackground = imgDivBg */
          if (!img1) {
            MsgShow('warning', '请上传浏览器标签图标', 3000)
            return false
          }
          if (!img2) {
            MsgShow('warning', '请上传系统内页图标', 3000)
            return false
          }
          if (!imgLogo) {
            MsgShow('warning', '请上传机构logo', 3000)
            return false
          }
          /* if (!imageLogin) {
            MsgShow('warning', '请上传登录页logo', 3000)
            return false
          }
          if (!imgDivBg) {
            MsgShow('warning', '请上传登录页背景图', 3000)
            return false
          } */
          this.addVis = true
          AxiosJsonApi(this.url, this.addFormData, 'PUT').then(res => {
            ResultMsg(res, '保存', () => {
              // this.changeTheme(this.colorObj[this.addFormData.systemThemeColor])
              this.addVis = false
              this.getSetData()
            })
            if (res.status !== 200) {
              this.addVis = false
            }
          })
        }
      })
    },
    // 获取数据
    getSetData () {
      AxiosApi(this.url, {}, 'GET').then(res => {
        if (res.status === 200) {
          let data = res.data
          this.addFormData = { ...this.addFormData, ...data }
          if (this.addFormData.recordNum === null || this.addFormData.recordNum === '') {
            this.addFormData.recordNum = 1
          }
          /* if (this.addFormData.systemThemeColor === null || this.addFormData.systemThemeColor === '') {
            this.addFormData.systemThemeColor = '#1E87F0'
          } */
          if (this.addFormData.windowName === null || this.addFormData.windowName === '') {
            this.addFormData.windowName = '山东亚华电子股份有限公司'
          }
          if (this.addFormData.systemName === null || this.addFormData.systemName === '') {
            this.addFormData.systemName = '山东亚华电子股份有限公司'
          }
          if (this.addFormData.recordNumDesc === null || this.addFormData.recordNumDesc === '') {
            this.addFormData.recordNumDesc = '版权所有 © 2019 YARWARD 备案号：鲁ICP备17056434号'
          }
          if (this.addFormData.loginIconName === null || this.addFormData.loginIconName === '') {
            this.addFormData.loginIconName = window.GLOBAL_CONFIG.SYSTEM_NAME || '亚华智慧医院系统'
          }
          if (this.addFormData.windowIcon === null || this.addFormData.windowIcon === '') {
            this.$refs.imgDiv.imageObj.imageUrl = '/static/passport/img/favicon.ico'
          } else {
            this.$refs.imgDiv.imageObj.imageUrl = this.addFormData.windowIcon
          }
          if (this.addFormData.systemIcon === null || this.addFormData.systemIcon === '') {
            this.$refs.imgDiv1.imageObj.imageUrl = '/static/passport/img/yarward.png'
          } else {
            this.$refs.imgDiv1.imageObj.imageUrl = this.addFormData.systemIcon
          }
          /* // 登录页logo
          if (this.addFormData.loginIcon === null || this.addFormData.loginIcon === '') {
            this.$refs.imageLogin.imageObj.imageUrl = '/static/passport/img/tit_yarward.png'
          } else {
            this.$refs.imageLogin.imageObj.imageUrl = this.addFormData.loginIcon
          }
          // 登录页背景图
          if (this.addFormData.loginBackground === null || this.addFormData.loginBackground === '') {
            this.$refs.imgDivBg.imageObj.imageUrl = '/static/passport/img/leftImgNew.jpg'
          } else {
            this.$refs.imgDivBg.imageObj.imageUrl = this.addFormData.loginBackground
          } */
          this.$refs.imgDivLogo.imageObj.imageUrl = this.addFormData.orgIcon
        } else {
          this.$refs.imgDiv.imageObj.imageUrl = this.addFormData.windowIcon
          this.$refs.imgDiv1.imageObj.imageUrl = this.addFormData.systemIcon
          /* this.$refs.imgDivBg.imageObj.imageUrl = this.addFormData.loginBackground
          this.$refs.imageLogin.imageObj.imageUrl = this.addFormData.loginIcon */
        }
      })
    }
  }
}
</script>
<style scoped>
  .passport-add-system{
    width: 100%;
    padding-top: 33px;
    padding-left: 22px;
    padding-right: 22px;
  }
  .passport-tit-content{
    font-size: 20px;
    color: #333333;
    padding-left: 5px;
    margin-top: 36px;
  }
  .passport-add-content{
    margin-top: 18px;
    min-height: 158px;
    padding-top: 32px;
    background-color: #FAFAFA;
    box-sizing: border-box;
  }
  .color-div{
    width: 450px;
    height: 47px;
    background: #EEEEEE;
    position: relative;
    margin-top: 10px;
  }
  .color-div::before{
    content:"";
    position: absolute;
    top: -8px;
    width: 0;
    height: 0;
    border-left: 26px solid transparent;
    border-right: 26px solid transparent;
    border-bottom: 26px solid #EEEEEE;
  }
  .color-blue::before{
    left:5px;
  }
  .color-orange::before{
    left:100px;
  }
  .color-green::before{
    left:197px;
  }
  .color-purple::before{
    left:293px;
  }
  .color-red::before{
    left:388px;
  }
  .item-color-div{
    position: absolute;
    left: 13px;
    width: 60px;
    height: 26px;
    margin-top: 10px;
    border-radius: 2px;
    border: 1px solid #DFDFDF;
  }
  .item-color-text{
    position: absolute;
    left: 93px;
    width: 108px;
    height: 26px;
    background: #FFFFFF;
    border-radius: 2px;
    margin-top: 10px;
    border: 1px solid #DFDFDF;
    line-height: 26px;
    padding-left: 10px;
  }
</style>
<style lang="scss">
  .passport-add-system{
    .el-upload{
      background-color: #ffffff;
    }
  }
</style>
