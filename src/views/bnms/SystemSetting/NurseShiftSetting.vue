<template>
  <layout class="container" v-loading="loading">
    <div slot="title">
      其他设置
    </div>
    <div slot="main">
      <div style="position: relative">
        <div class="top-title">
          <span class="top-line"></span>
          <span>腕带设置</span>
        </div>
        <div class="bnms_add_form top-content">
          <wristband-setting ref="wristband"></wristband-setting>
        </div>
      </div>
      <div style="position: relative;">
        <div class="top-title">
          <span class="top-line"></span>
          <span>临床报告</span>
        </div>
        <div class="top-content" style="height: 60px;vertical-align: middle;line-height: 60px;">
          <span style="padding-left: 16px;">默认患者可以查看:</span>
          <el-switch style="padding-left: 16px;" v-model="switchSetting" :active-value="1" :inactive-value="0">
          </el-switch>
          <span style="padding-left: 16px;">检查报告数据格式:</span>
          <el-select v-model="ruleForm.reportType" placeholder="请选择">
            <el-option label="pdf" value="pdf"></el-option>
            <el-option label="html" value="html"></el-option>
            <el-option label="图片" value="images"></el-option>
            <el-option label="text" value="text"></el-option>
            <!--<el-option label="xml" value="xml"></el-option>-->
          </el-select>
          <span style="padding-left: 16px;">检查报告图像数据格式:</span>
          <el-select v-model="ruleForm.reportImageType" placeholder="请选择">
            <el-option label="阅片" value="slice"></el-option>
            <el-option label="pdf" value="pdf"></el-option>
            <el-option label="html" value="html"></el-option>
            <el-option label="图片" value="images"></el-option>
            <el-option label="text" value="text"></el-option>
            <!--<el-option label="xml" value="xml"></el-option>-->
          </el-select>
        </div>
      </div>
      <div style="position: relative;">
        <div class="top-title">
          <span class="top-line"></span>
          <span>病历病程</span>
        </div>
        <div class="top-content" style="height: 60px;vertical-align: middle;line-height: 60px;">
          <span style="padding-left: 16px;">病历病程报告数据格式:</span>
          <el-select v-model="ruleForm.caseHistoryType" placeholder="请选择">
            <el-option label="pdf" value="pdf"></el-option>
            <el-option label="html" value="html"></el-option>
            <el-option label="图片" value="images"></el-option>
            <el-option label="text" value="text"></el-option>
            <!--<el-option label="xml" value="xml"></el-option>-->
          </el-select>
        </div>
      </div>
      <div style="position: relative;">
        <div class="top-title">
          <span class="top-line"></span>
          <span>表单logo</span>
        </div>
        <div class="top-content" style="vertical-align: middle;padding: 0 0 0 10px;">
          <div style="padding: 20px 0">
            <span>表单logo:</span>
            <el-input v-model="thumbnailUrl" disabled></el-input>
          </div>
          <div>
            <!--上传图片组件-->
            <el-upload class="avatar-uploader" action="nsms/web-nr/form-dict/logo" ref="upload" :data="params" :show-file-list="false" :on-change="uploadChange" :on-success="uploadImage" :before-upload="beforeAvatarUpload" :auto-upload="false" accept="image/jpeg,image/jpg,image/png,image/x-icon">
              <template v-if="imageObj.imageUrl">
                <div @mouseenter="seen = true" @mouseleave="seen = false" class="avatar_menu">
                  <img @error="imgError" :src="imageObj.imageUrl" class="showImg">
                  <div class="showBtn" v-show="seen">
                    <div class="img-cz">
                      <p style="border-right: 1px solid rgba(255,255,255,0.5)" class="ImgBtn" @click.stop="dialogVisible = true">
                        <i class="el-icon-search" style="color: rgba(255,255,255,1); font-size: 18px;"></i>
                      </p>
                      <p class="ImgBtn" @click.stop="delImage">
                        <i class="el-icon-delete" style="color: rgba(255,255,255,1); font-size: 18px;"></i>
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </template>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" class="passport-imgDialog" :modal="false" title="原图">
              <img :src="imageObj.imageUrl" style="max-width: 100%;max-height: 100%">
            </el-dialog>
          </div>
        </div>
      </div>
      <!-- 护理分组数据来源设置 -->
      <div style="position: relative;">
        <div class="top-title">
          <span class="top-line"></span>
          <span>护理分组数据来源设置</span>
        </div>
        <div class="top-content" style="height: 60px;vertical-align: middle;display: flex; align-items: center">
          <div style="width: 300px; display: flex;align-items: center">
            <div>科室：</div>
            <TreeSelect style="width: 250px" placeholder="请选择" v-model="switchHlfzDeptId" :multiple="false" :options="tree_nurse_data" :defaultExpandLevel="9" appendToBody
                        noOptionsText="无可选项"
                        noChildrenText="无子节点"
                        noResultsText="无匹配结果"/>
          </div>
          <div style="flex: 1">
            <span style="padding-left: 16px;">是否从排班同步数据:</span>
            <el-switch style="padding-left: 16px;" v-model="switchHlfzSetting" :active-value="1" :inactive-value="0" />

            <span style="padding-left: 16px;">若开启，则护理分组的数据从排班根据班次时间进行同步。若不开启，则护理分组的数据手动维护。</span>
          </div>
        </div>
      </div>

      <!-- 责任护士、管房护士数据来源设置 -->
      <div style="position: relative">
        <div class="top-title">
          <span class="top-line"></span>
          <span>责任护士、管房护士数据来源设置</span>
        </div>
        <div class="bnms_add_form top-content">
          <el-row>
            <el-col :span="15">
              <el-form ref="ruleNurseForm" :model="ruleForm" label-width="200px" label-suffix="：">
                <el-form-item label="责任护士数据来源" style="color: #666666;" label-width="154px">
                  <el-checkbox-group v-model="ruleForm.nurse">
                    <el-checkbox v-for="item of nurseSource" :key="item.value" :true-label="item.trueLabel" :false-label="item.falseLabel">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item label-width="152px" style="color: #999999;">{{ruleForm.remark}}</el-form-item>

                <el-form-item label="管房护士数据来源" style="color: #666666;" label-width="154px">
                  <el-checkbox-group v-model="ruleForm.roomNurse">
                    <el-checkbox v-for="item of nurseSource" :key="item.value" :true-label="item.trueLabel" :false-label="item.falseLabel">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div slot="footer_btn">
      <el-button type="primary" @click="onSubmit" class="btn" v-uni="'qitashezhi_save'">保存</el-button>
    </div>
  </layout>
</template>

<script>
import layout from '../../../components/bnms/layout/edit'
import { ApiDept, ApiNurseShiftSetting, ApiSwitchSetting, ApiNurseUploadLogo, ApiReportCaseHistoryType, ApiHlfzSetting } from '../../../api/bnms'
import WristbandSetting from '@/views/bnms/SystemSetting/WristbandSetting'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'nurseShiftSetting',
  components: { WristbandSetting, layout, TreeSelect },
  async created () {
    const deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo') || '{}')
    this.switchHlfzDeptId = deptInfo['deptId']
    await this.getDeptData()
    this.getData()
  },
  data () {
    return {
      hlfzId: '', // 护理分组id
      zrhsId: '', // 责任护士id
      gfhsId: '', // 管房护士id
      nurseSource: [
        {
          trueLabel: 2,
          falseLabel: 0,
          label: '护理分组'
        },
        {
          trueLabel: 1,
          falseLabel: 0,
          label: '护士排班'
        }
      ],
      switchHlfzDeptId: null,
      switchHlfzSetting: 0, // 护理分组设置
      oldswitchHlfzSetting: '', // 用于比较值是否变化
      loading: false,
      isFirst: true,
      // 排班设置
      ruleForm: {
        configId: '',
        remark: '若责任护士数据不来源于his系统，且都不勾选，则责任护士将为空。',
        // 检查报告图像数据格式
        reportImageType: '',
        // 检查报告数据格式
        reportType: '',
        // 病历病程
        caseHistoryType: '',
        nurse: 0,
        roomNurse: 0
      },
      rules: {},
      // 临床报告
      switchSetting: 1,
      // 腕带设置
      wristbandSetting: {},
      // 缩略图
      thumbnailUrl: '',
      imageObj: {
        avatar: 'avatar_menu',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: ''
      },
      imgSize: 512,
      params: {},
      seen: false,
      dialogVisible: false,
      logId: '',
      tree_nurse_data: []
    }
  },
  watch: {
    switchHlfzDeptId: 'getHlfz'
  },
  methods: {
    onSubmit () {
      this.uploadFormLogo()
      Promise.all([this.updatePatientSetting(), this.shiftSetting(), this.$refs.wristband.onSubmit(), this.reportSetting(), this.updateUlfz()])
        .then(() => {
          this.getData()
          this.$message.success('设置成功！')
        })
    },
    async updateUlfz () { // 护理分组数据来源设置==更新
      // 只有在值变化的时候请求接口，因为请求接口会覆盖护理分组设置数据
      if (this.oldswitchHlfzSetting !== this.switchHlfzSetting) {
        await ApiHlfzSetting.update({ deptId: this.switchHlfzDeptId, type: 1, value: this.switchHlfzSetting, configId: this.hlfzId }).then(res => {

        }).catch(() => {
          this.$message.error('护理分组数据来源设置异常！')
        })
      }
    },
    // 检查报告||病历病程数据格式设置
    async reportSetting () {
      await ApiReportCaseHistoryType.update({
        inspectionReportFile: this.ruleForm.reportType,
        inspectionImageFile: this.ruleForm.reportImageType,
        caseFile: this.ruleForm.caseHistoryType
      }).then(res => {
        // this.switchSetting = res.data
      }).catch(() => {
        this.$message.error('临床报告设置异常！')
      })
    },
    async updatePatientSetting () {
      await ApiSwitchSetting.update({ switchSetting: this.switchSetting }).then(res => {
        this.switchSetting = res.data
      }).catch(() => {
        this.$message.error('临床报告设置异常！')
      })
    },
    async shiftSetting () {
      let param = {
        nurse: this.ruleForm.nurse || 0,
        roomNurse: this.ruleForm.roomNurse || 0,
        doctor: 0
      }
      if (this.isFirst) {
        await ApiNurseShiftSetting.add(param)
          .then(() => {
            // this.$message.success('添加成功！')
            this.isFirst = false
          })
          .catch(res => {
            this.$message.error('排班设置设置异常！')
            this.isFirst = true
          })
      } else {
        param.configId = this.ruleForm.configId
        await ApiNurseShiftSetting.update(param)
          .then(() => {
            // this.$message.success('保存成功！')
          })
          .catch(() => {
            this.$message.error('排班设置设置异常！')
          })
      }
    },
    async getDeptData () {
      await ApiDept.select().then(res => {
        const list = res.data.list || []
        let temp = JSON.stringify(list)
        temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label')
          .replace(/,"children":null/g, '')
          .replace(/,"children":\[\]/g, '')
        this.tree_nurse_data = JSON.parse(temp)
        if (!this.switchHlfzDeptId) {
          this.switchHlfzDeptId = list[0] ? list[0].deptId : ''
        }
      })
    },
    async getData () {
      this.loading = true
      await ApiNurseShiftSetting.select()
        .then(res => {
          let data = res.data
          if (data === null || data === '' || data === undefined) {
            this.isFirst = true
            this.ruleForm.nurse = 0
            this.ruleForm.configId = ''
          } else {
            this.isFirst = false
            this.ruleForm.nurse = res.data.nurse || 0
            this.ruleForm.roomNurse = res.data.roomNurse || 0
            this.ruleForm.configId = data.configId
          }
        })
        .catch(res => {
          this.$message.error(res.message)
          this.isFirst = true
          this.ruleForm.value = []
          this.ruleForm.configId = ''
        })
      await ApiSwitchSetting.select().then(res => {
        this.switchSetting = res.data
        if (this.switchSetting == null) {
          this.switchSetting = 1
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
      await ApiNurseUploadLogo.getLogoUrl()
        .then((res) => {
          if (res && res.data) {
            this.logId = res.data.logoId
            this.thumbnailUrl = res.data.logoUrl
            this.imageObj.imageUrl = res.data.logoUrl
          }
        })
        .catch((error) => {
          console.log('获取失败', error)
        })
      await ApiReportCaseHistoryType.select()
        .then(res => {
          const { inspectionReportFile = '', inspectionImageFile = '', caseFile = '' } = res.data || {}
          this.ruleForm.reportType = inspectionReportFile
          this.ruleForm.reportImageType = inspectionImageFile
          this.ruleForm.caseHistoryType = caseFile
        })
      await this.getHlfz()
      this.loading = false
    },
    async getHlfz () {
      // 护理分组数据来源设置==查询
      await ApiHlfzSetting.select({ type: 1, deptId: this.switchHlfzDeptId }).then(res => {
        const { value = 0, configId = '' } = res.data || {}
        this.hlfzId = configId
        this.switchHlfzSetting = value || 0
        this.oldswitchHlfzSetting = value || 0
      })
    },
    beforeAvatarUpload (file) {
      this.params.logoFile = file
      this.params.logId = this.logId || ''

      let size = ''
      if (this.imgSize < 0.1) { // 如果小于0.1KB转化成B
        size = this.imgSize + 'B'
      } else if (this.imgSize < 0.1 * 1024) { // 如果小于0.1MB转化成KB
        size = this.imgSize + 'KB'
      } else if (this.imgSize < 0.1 * 1024 * 1024) { // 如果小于0.1GB转化成MB
        size = this.imgSize / (1024) + 'MB'
      } else { // 其他转化成GB
        size = this.imgSize / (1024 * 1024) + 'GB'
      }

      // 图片不能大于500k
      const isLt500K = file.size / 1024 < this.imgSize
      const testmsg = /^image\/(jpeg|png|jpg|x-icon)$/.test(file.type)
      if (!testmsg) {
        this.$message.error('请上传文件jpeg、jpg、png、ico格式!')
        return false
      }
      if (!isLt500K) {
        this.$message.error('上传图片大小不能超过' + size)
      }
    },
    // 上传成功后
    uploadImage (response, file) {
      let status = response.status

      if (status === 200) {
        this.imageObj.imageUrl = ''
        this.imageObj.imageUrl = response.data + '?timestamp=' + new Date().getTime()
        this.thumbnailUrl = this.imageObj.imageUrl

        // 表单只能有一个logo 上传完之后先去查询logid多次上传存储
        ApiNurseUploadLogo.getLogoUrl()
          .then((res) => {
            this.logId = res.data ? res.data.logoId : ''
          })
          .catch((error) => {
            console.log('获取失败', error)
          })
      } else {
        this.$message.error('上传失败！')
      }
    },
    delImage () {
      if (this.thumbnailUrl.indexOf('blob') > -1) {
        this.imageObj.imageUrl = ''
        this.thumbnailUrl = ''
        // 之前服务器有表单logo 选择本地图片之后服务器的不会删除 所以删除本地上传的之后显示服务器的
        this.selecFormLogo()
      } else {
        let param = {
          logoId: this.logId
        }
        ApiNurseUploadLogo.deleteLogo(param)
          .then((res) => {
            this.imageObj.imageUrl = ''
            this.thumbnailUrl = ''
          })
          .catch((error) => {
            console.log(error, '删除失败')
          })
      }
    },
    imgError () {
      this.imageObj.imageUrl = ''
      this.thumbnailUrl = ''
      this.logId = ''
    },
    uploadChange (file) {
      this.imageObj.imageUrl = URL.createObjectURL(file.raw)
      this.thumbnailUrl = URL.createObjectURL(file.raw)
    },
    uploadFormLogo () {
      this.$refs.upload.submit()
    },
    selecFormLogo () {
      ApiNurseUploadLogo.getLogoUrl()
        .then((res) => {
          this.logId = res.data ? res.data.logoId : ''
          this.thumbnailUrl = res.data.logoUrl
          this.imageObj.imageUrl = res.data.logoUrl
        })
        .catch((error) => {
          console.log('获取失败', error)
        })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/bnms/css/self_common";

.el-col {
  margin-top: 20px;
}

.btn {
  display: block;
  margin: 0 auto;
}

.top-title {
  margin-top: 20px;
  margin-left: 16px;
  font-weight: 400;
  font-size: 14px;
}

.top-line {
  background-color: #15c690;
  width: 4px;
  height: 15px;
  margin-right: 12px;
  display: inline-block;
  border-radius: 2px;
  vertical-align: middle;
}

.top-text {
  vertical-align: middle;
}

.top-content {
  background: #fafafa;
  margin: 16px 16px 0;
}

/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #cdd0d5;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: #cdd0d5;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
  color: #409eff !important;
}

.avatar-uploader-icon {
  font-size: 24px;
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
}

.avatar {
  width: 110px;
  height: 110px;
  display: block;
}

.avatar_menu {
  width: 110px;
  height: 110px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar_menu .showImg {
  width: auto;
  border-radius: 2px;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 2px;
}

.imgContent,
.imgContent .showImg,
.avatar,
.avatar .showImg {
  width: 110px;
  height: 110px;
  border-radius: 2px;
}

.showBtn {
  position: absolute;
  height: 100%;
  background: rgba(51, 51, 51, 0.3);
  border-radius: 2px;
  top: 0;
  width: 100%;
}

.img-cz {
  position: absolute;
  height: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  width: 100%;
  bottom: 0;
  display: flex;
}

.ImgBtn {
  float: left;
  width: 50%;
  line-height: 36px;
}

.closeBtn {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
}

.passport-imgDialog {
  .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
