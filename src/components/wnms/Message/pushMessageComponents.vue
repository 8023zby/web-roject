<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo" />
      <div class="typt-tit-content">推送消息</div>
    </div>

    <el-main>
      <el-form ref="formData" :model="formData" :rules="rules">
        <el-form-item label="患者提醒方式：" label-width="180px">
          <el-radio-group v-model="formData.reminMode" @change="changeViewType">
            <el-radio :label="1">强提醒</el-radio>
            <el-radio :label="2">免打扰提醒</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="内容方式：" label-width="180px">
          <el-radio-group v-model="formData.viewTypeMode" @change="changeModel">
            <el-radio :label="EMessageViewType.text">文字</el-radio>
            <el-radio :label="EMessageViewType.audio">音频</el-radio>
            <el-radio :label="EMessageViewType.video">视频</el-radio>
          </el-radio-group>
          <template v-if="!isMediaType(formData.viewTypeMode)">
            <el-button style="margin-left: 40px" type="primary" @click="pushTemplateDialog=true">选择消息模板</el-button>
          </template>
        </el-form-item>

        <template v-if="chooseTemplateObj.templateId">
          <el-form-item label="已选模板：" label-width="180px">
            <el-tag size="small">{{this.chooseTemplateObj.templateName}}</el-tag>
          </el-form-item>
        </template>

        <el-form-item :style="`display:${displayContent}`" prop="pushContent" v-if="formData.viewTypeMode === EMessageViewType.text" label-width="180px" label="输入文字：">
          <el-input v-model="formData.pushContent" type="textarea" :rows="6" maxlength="200" show-word-limit>
          </el-input>
        </el-form-item>

        <el-form-item :label="EMessageViewTypeText[formData.viewTypeMode] + '文件:'" label-width="180px" v-else-if="isMediaType(formData.viewTypeMode)" prop="fileUrl2">
          <upload-flied ref="uploadVideoFile" :data-name="getMediaInfo({ messageType: formData.viewTypeMode }).dataName" :accept="getMediaInfo({ messageType: formData.viewTypeMode }).accept" :limit="1" :filelist="getMediaInfo({ messageType: formData.viewTypeMode }).filelist" :Iscallback="getMediaInfo({ messageType: formData.viewTypeMode }).Iscallback" @uploadFlieds="uploadFlieds" @uploadFliedsChange="uploadFliedsChange" />
          <el-link type="info" disabled>
            <span>{{EMessageViewTypeText[formData.viewTypeMode]}}支持格式:{{getMediaInfo({ messageType: formData.viewTypeMode }).accept}}</span>
            <span v-if="formData.viewTypeMode == EMessageViewType.video">，须注意：6297i床头分机不支持视频消息。</span>
            <span v-if="formData.viewTypeMode == EMessageViewType.audio">，须注意：6297i床头分机仅支持10M以内的mp3格式。</span>
          </el-link>
        </el-form-item>

        <el-form-item label="接收患者：" label-width="180px">
          <el-button type="primary" @click="checkAllBed">全选</el-button>
          <el-button type="primary" @click="unCheckAllBed">反选</el-button>
        </el-form-item>

        <el-form-item label-width="180px" prop="checkedBedList">
          <el-checkbox-group v-model="formData.checkedBedList">
            <el-checkbox v-for="(item,index) in formData.targetBedList" :label="item.bedId" :value="item.bedId" :key="item.bedId" @change="checkedBed">{{item.bedName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label-width="180px" label="推送方式" prop="pushDate">
          <el-radio-group v-model="formData.pushModel" @change="changePushModel">
            <el-radio :label="0">立即推送</el-radio>
            <el-radio :label="1">定时推送</el-radio>
          </el-radio-group>
          <el-date-picker :disabled="formData.pushModel==0? true:false" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.pushDate" style="margin-left: 40px"></el-date-picker>
        </el-form-item>
      </el-form>
    </el-main>
    <div class="typt-add-footer">
      <el-button @click="goBack()">取消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
    <el-dialog @open="openPushTemplateDiaglog" @close="pushTemplateDialog=false" :visible="pushTemplateDialog" title="选择消息模板" width="80%">
      <span>

        <el-table :data="pagination.list" height="600px" stripe highlight-current-row v-loading="yh_loading">
          <el-table-column align="center" type="index" width="100" label="序号">
          </el-table-column>
          <el-table-column label="模板名称" prop="templateName" align="center">
          </el-table-column>

          <el-table-column label="模板内容" :show-overflow-tooltip="true" prop="templateContent" align="center">
            <template slot-scope="scope">
              <span v-if="isMediaType(scope.row.type)">
                {{!scope.row.templateContent?'':JSON.parse(scope.row.templateContent).name}}
              </span>
              <span v-else>{{scope.row.templateContent}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="chooseTemplate(scope.$index, scope.row)" size="mini">选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />

      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pushTemplateDialog = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment';
import { deepMerge } from '@/assets/wnms/utils';
import { getDeptInfo, selectDeptInfo, getUser } from '@/assets/wnms/utils/common';
import BaseQueryPageForm from '@/views/wnms/common/BaseQueryPageForm';
import uploadFlied from '@/components/wnms/Upload/uploadFileNew';
import Pagination from '@/components/wnms/paginations/pagination';
import { bedListApi } from '@/api/wnms/msgManage/patientMsg';
import * as msgTemplateApi from '@/api/wnms//msgManage/msgTemplate';
import { getMsgInfoByMessageID, pushMsgApi, editMsgApi } from '@/api/wnms/msgManage/patientMsg';
import { EMessageViewType, EMessageViewTypeText } from '@/assets/wnms/utils/enums';

export default {
  name: "pushMessage",
  components: { uploadFlied, Pagination },
  mixins: [BaseQueryPageForm],
  computed: {
    EMessageViewType () {
      return EMessageViewType;
    },
    EMessageViewTypeText () {
      return EMessageViewTypeText;
    }
  },
  // 传参
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      displayContent: 'block',
      yh_loading: false,
      pushTemplateDialog: false,
      formData: {
        reminMode: 1,
        viewTypeMode: 0,
        pushContent: "",
        pushModel: 0,
        pushDate: '',
        targetBedList: {},
        templateName: '', // 模板名称
        templateContent: '', // 模板内容
        type: 0, //0 文字 1 音视频
        fileUrl2: '',
        templateId: '', // 主键ID
        checkedBedList: [],
      },
      rules: (() => {
        const fileUrl2Required = (rule, value, callback) => {
          let fileList = this.getMediaInfo({ messageType: this.formData.type }).fileList;
          if (value || (fileList && fileList.length)) {
            callback();
          } else {
            callback(new Error('请上传视音频'));
          }
        };
        return {
          pushContent: [{ required: true, message: '请输入推送内容', trigger: 'blur' },
          { max: 200, message: "推送内容不能超过200个字符" }],
          checkedBedList: [{ type: 'array', required: true, message: '请选择床位', trigger: 'change' }],
          pushDate: [{ required: true, message: '请选择推送日期', trigger: 'blur' }],
          fileUrl2: [{
            validator: fileUrl2Required,
            trigger: 'blur'
          }]
        };
      })(),
      chooseTemplateObj: {},
      pushTempReqForm: {
        deptId: selectDeptInfo(), // 护理单元ID
        templateName: '',
        total: 0,
        size: 10,
        page: 1
      },
      getMediaInfo: this.getMedia(),
      gDeptId: '',
      gOrgId: '',
      uploadInfo: {},
      gEditObj: {},
      gUploadFileInfo: {},
      isFileChange: false,
      gType: 'add',
    };
  },
  created () {
    this.gType = this.$route.query.type;
    this.gDeptId = selectDeptInfo();
    this.gOrgId = getDeptInfo().orgId;
    this.initPushDate();
  },
  mounted () {
    this.getBedList();
    if (this.detail && this.detail.row) {
      this.chooseTemplate(0, this.detail.row);
    }
    else {
      if (this.gType == 'edit') {
        let messageId = this.$route.query.msgObj.messageId;
        this.initMsgInfo(messageId);
        if (this.isMediaType(this.gEditObj.viewType)) {
          this.getMediaInfo({ filelist: [JSON.parse(this.gEditObj.content)] });
        }
      }
    }
  },
  methods: {
    getBedList () {
      bedListApi({ "orgId": this.gOrgId, "deptId": this.gDeptId }).then(res => {
        if (res.status == 200) {

          // res.data.push({
          //   "bedId": "2db93f743a874a40862dd4117b4ca306",
          //   "bedName": "2",
          //   "deviceId": "36b9d9b3deb449258a97b9168ed58922",
          //   "patientId": "002982",
          //   "deviceType": "wnBedHeadExtension"
          // }, {
          //   "bedId": "3db93f743a874a40862dd4117b4ca306",
          //   "bedName": "3",
          //   "deviceId": "36b9d9b3deb449258a97b9168ed58922",
          //   "patientId": "002983",
          //   "deviceType": "wnBedHeadExtension"
          // }, {
          //   "bedId": "4db93f743a874a40862dd4117b4ca306",
          //   "bedName": "4",
          //   "deviceId": "36b9d9b3deb449258a97b9168ed58922",
          //   "patientId": "002984",
          //   "deviceType": "wnBedHeadExtension"
          // });

          this.formData.targetBedList = res.data;
        } else {
        }
      }).catch(err => {
        console.log(err);
      });
    },
    initMsgInfo (messageId) {
      getMsgInfoByMessageID(messageId).then(res => {
        if (res.status == 200) {
          let dataInfo = res.data;
          this.formData.viewTypeMode = dataInfo.viewType;
          this.formData.pushContent = dataInfo.content;
          this.formData.pushModel = dataInfo.pushType;
          this.formData.pushDate = dataInfo.pushTime;
          this.formData.reminMode = dataInfo.msgResource == "MANUAL-DEPT-NOTICE" ? 2 : 1;
          this.formData.fileUrl2 = '1';

          for (let i = 0; i < dataInfo.bedDevices.length; i++) {
            this.formData.checkedBedList.push(dataInfo.bedDevices[i].bedId);
          }

          if (this.isMediaType(dataInfo.viewType)) {
            this.getMediaInfo({ filelist: [JSON.parse(dataInfo.content)] });
            this.uploadInfo = JSON.parse(dataInfo.content);
            this.uploadInfo.urlPath = this.uploadInfo.url;
            this.uploadInfo.sourceFileName = this.uploadInfo.name;
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    chooseTemplate (index, row) {
      if (row) {
        this.chooseTemplateObj = row;
        this.pushTemplateDialog = false;
        let templateType = this.chooseTemplateObj.type;
        this.formData.pushContent = this.chooseTemplateObj.templateContent;
        this.displayContent = 'none';
        if (this.isMediaType(templateType)) {
          this.getMediaInfo({ filelist: [JSON.parse(this.chooseTemplateObj.templateContent)] });
          this.uploadInfo = JSON.parse(this.chooseTemplateObj.templateContent);
          this.uploadInfo.urlPath = this.uploadInfo.url;
          this.uploadInfo.sourceFileName = this.uploadInfo.name;
          this.formData.viewTypeMode = templateType;
          this.formData.fileUrl2 = '1';
          console.log(this.uploadInfo);
        }
        else {
          this.displayContent = 'block';
        }
      }
    },
    openPushTemplateDiaglog () {
      this.pushTemplateList();
    },
    pushTemplateList () {
      msgTemplateApi.getInfo(this.pushTempReqForm).then(res => {
        this.queryResultHandler(res);
        console.log(res);
      }).catch(err => {
      });
    },
    pageSizeChangeHandler (pageSize) {
      this.pagination.size = pageSize;
      this.pagination.page = 1;
      this.pushTemplateList();
    },
    pageChangeHandler (page) {
      this.pushTempReqForm.page = page;
      this.pushTemplateList();
    },

    uploadFliedsChange (res) {
      const _this = this;
      _this.isFileChange = true;
      if (res.type === 'del') {
        _this.formData.templateContent = '';
        _this.formData.fileUrl2 = '';
      } else if (res.type === 'change') {
        // 清除上传组件验证结果
        _this.$refs['formData'].clearValidate(['fileUrl2']);
        _this.formData.fileUrl2 = '1';
      }
    },
    // 文件上传
    uploadFlieds (res) {
      if (res.status !== 200) {
        return;
      }
      let _this = this;
      if (res.data === '') {
        _this.formData.templateContent = '';
      } else {
        this.uploadInfo = res.data;
        this.gUploadFileInfo = {
          "name": this.uploadInfo.sourceFileName,
          "url": this.uploadInfo.urlPath,
          "secondDuration": this.uploadInfo.secondDuration,
          "formatDuration": this.uploadInfo.formatDuration,
          "fileSizeB": this.uploadInfo.fileSizeB,
        };

        let updateBedList = this.megerCheckBedList(this.formData.checkedBedList, this.formData.targetBedList);
        console.log(updateBedList);
        let para = {
          "bedDevices": updateBedList,
          "content": JSON.stringify(this.gUploadFileInfo),  //– 具体内容
          "deptId": this.gDeptId,//--部门id
          "isGenerateAudio": 0,//-- 是否转换成音频 0 不转换 1 转换
          "msgResource": this.formData.reminMode == 1 ? "MANUAL-DEPT-MSG" : "MANUAL-DEPT-NOTICE", //--消息类型 是否强制推送  MANUAL-DEPT-MSG 强制提醒  MANUAL-DEPT-NOTICE 非强制提醒
          "orgId": this.gOrgId,// --机构id
          "pushType": this.formData.pushModel, //--是否是立即提醒，0 是 1 不是，如果类型是1 需要传入pushTime 推送时间
          "pushTime": this.formData.pushModel == 0 ? '' : this.formData.pushDate,
          "receiveDevice": "BEDDEVICE", //--推送设备类型，此处固定为该类型
          "viewType": this.formData.viewTypeMode,// --0-文字 1-音频、视频
          "secondsDuration": this.uploadInfo.secondDuration, //--音视频长度
          "secondsDurationFormat": this.uploadInfo.formatDuration  //--音视频长度
        };

        _this.formData.templateContent = JSON.stringify(this.uploadInfo);
        this.pushMsg(para);
      }
    },

    goBack () {
      if (this.detail && this.detail.backType === 'list') {
        this.$emit('option-changed', 'list', this.detail);
      } else {
        this.$router.go(-1);
      }
    },
    save () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          let updateBedList = this.megerCheckBedList(this.formData.checkedBedList, this.formData.targetBedList);
          console.log(updateBedList);
          let para =
          {
            "bedDevices": updateBedList,
            "content": this.formData.pushContent,  //– 具体内容
            "deptId": this.gDeptId,//--部门id
            "isGenerateAudio": 0,//-- 是否转换成音频 0 不转换 1 转换
            "msgResource": this.formData.reminMode == 1 ? "MANUAL-DEPT-MSG" : "MANUAL-DEPT-NOTICE", //--消息类型 是否强制推送  MANUAL-DEPT-MSG 强制提醒  MANUAL-DEPT-NOTICE 非强制提醒
            "orgId": this.gOrgId,// --机构id
            "pushType": this.formData.pushModel, //--是否是立即提醒，0 是 1 不是，如果类型是1 需要传入pushTime 推送时间
            "pushTime": this.formData.pushModel == 0 ? '' : this.formData.pushDate,
            "receiveDevice": "BEDDEVICE", //--推送设备类型，此处固定为该类型
            "viewType": this.formData.viewTypeMode,// --0-文字 1-音频、视频
            "secondsDuration": this.uploadInfo.secondDuration, //--音视频长度
            "secondsDurationFormat": this.uploadInfo.formatDuration  //--音视频长度
          };
          if (!this.isMediaType(this.formData.viewTypeMode)) {
            this.pushMsg(para);
          } else {
            //上传文件 +保存
            if (!this.isFileChange) {
              this.pushMsg(para);
            } else {
              this.$refs.uploadVideoFile.submit();
            }
          }
        }
      });
    },

    pushMsg (para) {
      if (this.gType === 'edit') {
        para.messageId = this.$route.query.msgObj.messageId;
        editMsgApi(para).then(res => {
          if (res.status == 200) {
            this.$confirm('消息已推送', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              center: true,
              type: 'success',
              showClose: false
            }).then(() => {
              this.goBack();
            });
          }
          else {
            this.$message("消息推送失败！");
          }
        }).catch(err => {
          console.log(err);
        });
      }
      else {
        pushMsgApi(para).then(res => {
          if (res.status == 200) {
            this.$confirm('消息已推送', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              center: true,
              type: 'success',
              showClose: false
            }).then(() => {
              this.goBack();
            });
          }
          else {
            this.$message("消息推送失败！");
          }
        }).catch(err => {
          console.log(err);
        });
      }
      console.log(para);
    },
    checkedBed (val) {
      console.log(this.formData.checkedBedList);
    },
    checkAllBed () {
      this.formData.checkedBedList = [];
      this.formData.targetBedList.forEach(item => {
        if (!this.formData.checkedBedList.includes(item.bedId)) {
          this.formData.checkedBedList.push(item.bedId);
        }
      });
    },
    unCheckAllBed () {
      console.log(this.formData.checkedBedList);
      this.formData.targetBedList.forEach(tItem => {
        if (this.formData.checkedBedList.includes(tItem.bedId)) {
          this.formData.checkedBedList.splice(tItem.bedId, 1);
        } else {
          this.formData.checkedBedList.push(tItem.bedId);
        }
      });
    },
    changePushModel (val) {
      if (val) {
        this.formData.pushDate = moment().add(5, 'm').format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.formData.pushDate = moment().format('YYYY-MM-DD HH:mm:ss');
      }
    },
    changeModel (val) {
      if (this.isMediaType(val)) {
        this.chooseTemplateObj = {};
      }
      this.chooseTemplateObj.templateId = '';
      this.displayContent = 'block';
      this.formData.templateContent = '';
      this.formData.pushContent = '';
      this.formData.fileUrl2 = '';
      this.getMediaInfo({ filelist: [] });
      this.$refs['formData'].clearValidate(['fileUrl2', 'templateContent']);
      this.$forceUpdate();
    },
    changeViewType (val) {
      console.log(val);
    },
    megerCheckBedList (checked, allbed) {
      let newBedList = [];
      allbed.forEach(allBedItem => {
        checked.forEach(checkedItem => {
          if (checkedItem == allBedItem.bedId) {
            newBedList.push(allBedItem);
          }
        });
      });
      return newBedList;
    },
    initPushDate () {
      let date = new Date();
      date.setMinutes(date.getMinutes() + 5);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      //new Date().setMinutes((new Date().getMinutes() + 5)

      let hours = date.getHours().toString().padStart(2, '0');
      let minutes = date.getMinutes().toString().padStart(2, '0');

      let seconds = date.getSeconds().toString().padStart(2, '0');

      this.formData.pushDate = `${y}-${m}-${d} ${hours}:${minutes}:${seconds}`;//  y + '-' + m + '-' + d + " 00:00:00";
    },
    // 判断是否是媒体文件
    isMediaType (type) {
      return type === EMessageViewType.audio || type === EMessageViewType.video;
    },
    getMedia () {
      const mediaInfo = {
        param: {
          isFile: true, // 是否显示文件,
          name: ''// 文件名字
        },
        limit: 1,
        Iscallback: true,
        filelist: [],
        video_flag: false,
        autoUpload: true
      };
      return function getMediaInfo ({ filelist, messageType = EMessageViewType.audio }) {
        switch (messageType) {
          case EMessageViewType.video:
            mediaInfo.accept = '.mp4,.avi,.3gp,.rmvb,.wmv,.mkv,.mov,.flv';
            mediaInfo.dataName = 'video';
            break;
          case EMessageViewType.audio:
            mediaInfo.accept = '.mp3,.wav,.wma';
            mediaInfo.dataName = 'audio';
            break;
          default:
            break;
        }
        if (filelist !== undefined) {
          mediaInfo.filelist = filelist;
        }
        return mediaInfo;
      };
    },
  }

}
</script>

<style scoped>

</style>
