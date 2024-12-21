<template>
  <div class="typt-list-main">
    <div class="typt-add-container">
      <div class="typt-add-form passport-add-system">
        <el-form :rules="rules" ref="addFormData" class="from" label-width="150px" :model="addFormData">
          <div class="passport-tit-content">系统显示</div>
          <div class="passport-add-content">
            <el-form-item label="系统主题：" prop="systemThemeColor">
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
            </el-form-item>
            <el-form-item label="系统内页：" prop="systemName">
              <el-tooltip style="position: absolute;top:0;left: 120px;z-index: 999;cursor: pointer" class="item" effect="dark" content="系统内页图标大小为56*15,为了达到最佳效果，请上传比例为56/15的图标" placement="bottom">
                <img ref="systemImg" @mouseenter="changeImgEnter('systemImg')" @mouseleave="changeImgLeave('systemImg')" class="img-cls" src="/static/passport/img/icon_explain_default.png"/>
              </el-tooltip>
              <!--上传图片组件-->
              <v-upload-image :imageObj="imageObj1" ref="imgDiv1"></v-upload-image>
              <el-input style="margin-top: 30px" v-model="addFormData.systemName" clearable></el-input>
            </el-form-item>
            <div style="height: 5px;"></div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button type="primary" @click="onSubmit()" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http'
import { MsgShow, ResultMsg } from '../../../assets/passport/js/Message'
import vUploadImage from '../../../components/passport/UploadImage.vue'
export default {
  components: {
    vUploadImage
  },
  inject: ['changeTheme'],
  data () {
    return {
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
        systemName: '山东亚华电子股份有限公司',
        systemIcon: '/static/passport/img/yarward.png',
        systemThemeColor: '#1E87F0'
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
        systemName: [
          { required: true, message: '请输入系统内页名称', trigger: 'blur' },
          { max: 30, message: '系统内页名称长度不能超过30位', trigger: 'blur' }
        ],
        systemThemeColor: [
          { required: true, message: '请选择系统主题', trigger: 'change' }
        ]
      },
      url: '/passport/web-rbac/iconConfig'
    }
  },
  mounted () {
    this.getSetData()
  },
  methods: {
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
          let img2 = this.$refs.imgDiv1.imageObj.imageUrl
          this.addFormData.systemIcon = img2
          if (!img2) {
            MsgShow('warning', '请上传系统内页图标', 3000)
            return false
          }
          this.addVis = true
          AxiosJsonApi(this.url, this.addFormData, 'PUT').then(res => {
            ResultMsg(res, '保存', () => {
              this.changeTheme(this.colorObj[this.addFormData.systemThemeColor])
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
          if (this.addFormData.systemThemeColor === null || this.addFormData.systemThemeColor === '') {
            this.addFormData.systemThemeColor = '#1E87F0'
          }
          if (this.addFormData.systemName === null || this.addFormData.systemName === '') {
            this.addFormData.systemName = '山东亚华电子股份有限公司'
          }
          if (this.addFormData.systemIcon === null || this.addFormData.systemIcon === '') {
            this.$refs.imgDiv1.imageObj.imageUrl = '/static/passport/img/yarward.png'
          } else {
            this.$refs.imgDiv1.imageObj.imageUrl = this.addFormData.systemIcon
          }
        } else {
          this.$refs.imgDiv1.imageObj.imageUrl = this.addFormData.systemIcon
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
