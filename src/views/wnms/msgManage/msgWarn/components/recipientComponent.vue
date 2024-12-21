<!--
  文件描述：接收者组件
  创建时间：2021/6/21 9:48
  创建人：PCL
-->
<template>
    <section class="">
      <div class="border-dom viewType-dom"
           style="padding-bottom: 0;"
           v-for="(item,index) in msgPushInfoArray"
           :key="index"
      >
        <div class="recipientName">
          {{getrecipientName(item.id)}}
        </div>
        <el-form-item label="展现形式:" >
          <el-radio-group v-model="item.viewType">
            <el-radio  label="TEXT">文字</el-radio>
            <el-radio  label="IMAGE">图片</el-radio>
            <el-radio  label="AUDIO">音频</el-radio>
            <el-radio  label="VIDEO">视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--展项形式=======START-->
        <section v-if="item.viewType === 'TEXT'">
          <el-form-item label="文字内容:">
            <el-row>
              <el-col :span="20">
                <el-input type="textarea" v-model="item.TEXT" placeholder="请输入不超过200个字符" maxlength="200" style="width:97%;" :rows="3" :id="`textarea${index}`" @input="textChange"/>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="insertAtCursor('{医嘱关键词}',index)" size="mini" style="margin-top: 2px;margin-left: -10px;">插入替换字段</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </section>
        <section v-if="item.viewType === 'IMAGE'">
          <el-form-item label="图片:">
            <el-row>
              <el-col :span="5">
                <upload-flied ref="uploadImageFile"
                              btnName="上传"
                              v-model="item.ImageFile"
                              :data-name="item.uploadImageOption.dataName"
                              :accept="item.uploadImageOption.accept"
                              :limits="item.uploadImageOption.limits"
                              :filelist="item.uploadImageOption.fileList"
                              :before-upload="beforeUpload"
                              :handle-exceed="handleExceed"
                              :changeData="`${index},IMAGE`"
                              :showFileView="false"
                              :showFileList="true"
                              showFileType="IMAGE"
                              :fileSize=20
                              :filePath="item.IMAGE"
                              :fileName="item.fileName"
                              @uploadFlieds="uploadFlieds" />
              </el-col>
            </el-row>

          </el-form-item>
        </section>
        <section v-if="item.viewType === 'AUDIO'">
          <el-form-item label="音频:">
            <el-row>
              <el-col :span="5">
                <upload-flied ref="uploadAudioFile"
                              v-model="item.AudioFile"
                              :data-name="item.uploadAudioOption.dataName"
                              :accept="item.uploadAudioOption.accept"
                              :limits="item.uploadAudioOption.limits"
                              :filelist="item.uploadAudioOption.fileList"
                              :before-upload="beforeUpload"
                              :handle-exceed="handleExceed"
                              :changeData="`${index},AUDIO`"
                              btnName="上传"
                              :showFileView="false"
                              :showFileList="true"
                              showFileType="AUDIO"
                              :fileSize=1024
                              :filePath="item.AUDIO"
                              :fileName="item.fileName"
                              @uploadFlieds="uploadFlieds" />
              </el-col>
            </el-row>

          </el-form-item>
        </section>
        <section v-if="item.viewType === 'VIDEO'">
          <el-form-item label="视频:">
            <el-row>
              <el-col :span="5">
                <upload-flied ref="uploadAudioFile"
                              v-model="item.AudioFile"
                              :data-name="item.uploadVideoOption.dataName"
                              :accept="item.uploadVideoOption.accept"
                              :limits="item.uploadVideoOption.limits"
                              :filelist="item.uploadVideoOption.fileList"
                              :before-upload="beforeUpload"
                              :handle-exceed="handleExceed"
                              :changeData="`${index},VIDEO`"
                              btnName="上传"
                              :showFileView="false"
                              :showFileList="true"
                              showFileType="VIDEO"
                              :fileSize=1024
                              :filePath="item.VIDEO"
                              :fileName="item.fileName"
                              @uploadFlieds="uploadFlieds" />
              </el-col>
            </el-row>

          </el-form-item>
        </section>
        <!--展项形式=======END-->
        <!--接收终端====START-->
        <!--<h3>接收终端数据（item.resourceInfo）：</h3><div style="border:1px solid #48ff89;">{{item.resourceInfo}}</div>-->
        <el-form-item label="接收终端:" :style="item.id !== 'PATIENT'?'display:none':''">
          <section v-for="(item3,index3) in item.resourceInfo" :key="index3" class="demo-device">
            <el-row v-if="item3.permissions.indexOf(item.id)>-1">
              <el-col :span="2">
                <el-checkbox :label="item3.id" v-model="item3.isCheckbox">{{item3.deviceName}}</el-checkbox>
              </el-col>
              <el-col :span="20" v-if="item.viewType === 'TEXT' && (item3.id==='wnBedHeadExtension' || item3.id==='wnBedSideExtension')">
                <el-form-item label="跳转链接:">
                  <el-input v-model.trim="item3.url" placeholder="请输入可跳转路由" :disabled="!item3.isCheckbox"/>
                  <section v-if="item.id === 'PATIENT' && item3.isCheckbox">
                    <el-button type="primary" @click="choiceQuestionnaire(index,index3)" size="mini">选择问卷</el-button>
                    <el-button type="primary" @click="choiceEducation(index,index3)" size="mini">选择宣教</el-button>
                    <span v-if="item3.id==='wnBedHeadExtension' && item3.url.includes('/questionnaireDetails?') && Number(msgType) === 9">
                      是否强制跳转<el-switch
                      v-model="item3.forceJump"
                      active-color="#13ce66"
                    />
                    </span>
                  </section>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-form-item>
        <!--接收终端====END-->

      </div>
      <slot>
        <dialog-selectInsertField v-if="showSelectInsertField" ref="ref_selectInsertField" @callBack="selectInsertFieldBack"></dialog-selectInsertField>

        <dialog-choiceQuestionnaire v-if="showChoiceQuestionnaire" ref="ref_choiceQuestionnaire" @callBack="choiceQuestionnaireBack"></dialog-choiceQuestionnaire>
        <dialog-choiceEducation v-if="showChoiceEducation" ref="ref_choiceEducation" @callBack="choiceEducationBack"></dialog-choiceEducation>
      </slot>
    </section>
</template>

<script>
    // 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
    // 例如：import 《组件名称》 from '《组件路径》';
    // 例如：import uploadFile from '@/components/uploadFile/uploadFile'
    import dialogSelectInsertField from './selectInsertField'
    import uploadFlied from '../uploadFlied-new'
    import dialogChoiceQuestionnaire from '@/components/wnms/Message/dialog-choiceQuestionnaire'
    import dialogChoiceEducation from '@/components/wnms/Message/dialog-choiceEducation'
    export default {
        name: 'recipientComponent',
        // import引入的组件需要注入到对象中才能使用
        components: { uploadFlied, dialogSelectInsertField, dialogChoiceQuestionnaire, dialogChoiceEducation },
        props: {
          recipientDic: {
            type: Array,
            default() {
              return [
                { id: 'PATIENT', name: '患者' },
                { id: 'NURSE', name: '护士' },
                { id: 'NURSE_HEAD', name: '护士长' },
                { id: 'DOCTOR', name: '医生' }
              ]
            }
          },
          detail: {
            required: false,
            type: Object,
            default: () => {}
          },
          pageFrom: {
            type: String,
            default: () => {
              return 'msgWarn'
            }
          }
        },
        data() {
            // 这里存放数据
            return {
              msgType: 0,
              listTableFields: null,
              itemId: '', //选择的表
              tableList: [], //选择表字典
              showChoiceQuestionnaire: false, // 显示选择问卷的组件
              showChoiceEducation: false, // 显示选择宣教的组件
              eduorqusChoice: {}, // 选择问卷、宣教的时候，暂存数据
              showSelectInsertField: false, // 显示选择插入字段的组件
              // 接收者选择后配置项的变量
              msgPushInfoArray: [],
              // 设备字典
              recipientInitDic: '{"id":"","content":"","resourceInfo":[{"id":"wnBedSideExtension","deviceName":"床旁分机","permissions":"PATIENT,NURSE,NURSE_HEAD,DOCTOR","isCheckbox":true,"url":""},{"id":"wnBedHeadExtension","deviceName":"床头分机","permissions":"PATIENT","isCheckbox":true,"url":""},{"id":"bnPDA","deviceName":"PDA","permissions":"NURSE,NURSE_HEAD","isCheckbox":true,"url":""},{"id":"wnMedicalAudioAssistant","deviceName":"W101","permissions":"NURSE,NURSE_HEAD,DOCTOR","isCheckbox":true,"url":""}],"uploadImageOption":{"fileSizeUnit":"","dataName":"","accept":".png,.jpg,bmp","limits":1,"fileList":[]},"uploadAudioOption":{"fileSizeUnit":"","dataName":"","accept":".mp3","limits":1,"fileList":[]},"uploadVideoOption":{"fileSizeUnit":"","dataName":"","accept":".mp4","limits":1,"fileList":[]},"viewType":"","sort":0,"TEXT":""}',
              // Icon上传设置
              uploadOption: {
                fileSize: 10,
                fileSizeUnit: '',
                dataName: '',
                accept: '.png,.jpg,bmp',
                limits: 1,
                fileList: []
              }
            }
        },
        // 监听属性 类似于data概念
        computed: {},
        // 方法集合
        methods: {
          // 消息类型修改，只有手术安排的时候，菜显示强制跳转
          msgTypeChange(v){
            this.msgType = v
          },
          // 选择插入字段-组件回调
          selectInsertFieldBack(myValue, textIndex) {
            this.insertAtCursort(myValue, textIndex)
          },
          async insertAtCursort(myValue, index) {
            let id = '#textarea' + index
            const myField = document.querySelector(id)
            if (myField.selectionStart || myField.selectionStart === 0) {
              var startPos = myField.selectionStart
              var endPos = myField.selectionEnd
              this.msgPushInfoArray[index]['TEXT'] =
                myField.value.substring(0, startPos) +
                myValue +
                myField.value.substring(endPos, myField.value.length)
              await this.$nextTick() // 这句是重点, 圈起来
              myField.focus()
              myField.setSelectionRange(
                endPos + myValue.length,
                endPos + myValue.length
              )
            } else {
              this.msgPushInfoArray[index]['TEXT'] += myValue
            }
          },
          // 获取接收者名称
          getrecipientName (t) {
            return this.recipientDic.find((v, i) => {
              return v.id === t
            }).name
          },
          // 接收者更改触发
          changeRecipient(Obj) {
            const _this = this
            let newVal = JSON.parse(Obj.newVal)
            let oldVal = JSON.parse(Obj.oldVal)

            let j = JSON.parse(_this.recipientInitDic)

            //PATIENT -患者--新增、删除
            if (newVal.indexOf('PATIENT') > -1 && oldVal.indexOf('PATIENT') < 0) {
              j.id = 'PATIENT'
              j.sort = 0
              _this.msgPushInfoArray.push(j)
            } else if (newVal.indexOf('PATIENT') < 0 && oldVal.indexOf('PATIENT') > -1) {
              let i = _this.msgPushInfoArray.findIndex((v, i) => {
                return v.id === 'PATIENT'
              })
              _this.msgPushInfoArray.splice(i, 1)
            }
            //NURSE -护士--新增、删除
            if (newVal.indexOf('NURSE') > -1 && oldVal.indexOf('NURSE') < 0) {
              j.id = 'NURSE'
              j.sort = 1
              _this.msgPushInfoArray.push(j)
            } else if (newVal.indexOf('NURSE') < 0 && oldVal.indexOf('NURSE') > -1) {
              let i = _this.msgPushInfoArray.findIndex((v, i) => {
                return v.id === 'NURSE'
              })
              _this.msgPushInfoArray.splice(i, 1)
            }
            //NURSE_HEAD -护士长--新增、删除
            if (newVal.indexOf('NURSE_HEAD') > -1 && oldVal.indexOf('NURSE_HEAD') < 0) {
              j.id = 'NURSE_HEAD'
              j.sort = 2
              _this.msgPushInfoArray.push(j)
            } else if (newVal.indexOf('NURSE_HEAD') < 0 && oldVal.indexOf('NURSE_HEAD') > -1) {
              let i = _this.msgPushInfoArray.findIndex((v, i) => {
                return v.id === 'NURSE_HEAD'
              })
              _this.msgPushInfoArray.splice(i, 1)
            }
            //DOCTOR -医生--新增、删除
            if (newVal.indexOf('DOCTOR') > -1 && oldVal.indexOf('DOCTOR') < 0) {
              j.id = 'DOCTOR'
              j.sort = 3
              _this.msgPushInfoArray.push(j)
            } else if (newVal.indexOf('DOCTOR') < 0 && oldVal.indexOf('DOCTOR') > -1) {
              let i = _this.msgPushInfoArray.findIndex((v, i) => {
                return v.id === 'DOCTOR'
              })
              _this.msgPushInfoArray.splice(i, 1)
            }
            console.log('changeRecipient:',_this.msgPushInfoArray)

            _this.msgPushInfoArray.sort(_this.compareMsg("sort"));
          },
          // 排序：
          compareMsg(property) {
            return function (a, b) {
              var v1 = a[property];
              var v2 = b[property];
              return v1 - v2;
            }
          },
          textChange() {
            this.$forceUpdate()
          },
          async insertAtCursor (myValue, index) {
            let t = this.tableList.find((v, i) => {
              return v.itemId === this.itemId
            })
            if (!t) {
              this.$message.warning('请先选择表！')
              return
            }

            this.textIndex = index
            this.textTable = t.tableName

            this.showSelectInsertField = true
            this.$nextTick(() => {
              this.$refs.ref_selectInsertField.init({ textTable: this.textTable, textIndex: this.textIndex, listTableFields: JSON.stringify(this.listTableFields) })
            })
          },
          // 文件上超出个数的钩子
          handleExceed (files, fileList) {
            this.$message.warning(`当前限制选择 ${this.uploadOption.limits} 个文件，本次选择了 ${files.length} 个文件，已超出个数限制!`)
          },

          // 接收上传组件得返回结果
          uploadFlieds (res, changeData, fileStatus) {
            console.log('上传附件成功后、删除附件回调：\n', res, changeData, fileStatus)
            // 附件上傳在準備階段，不處理任何數據
            if (fileStatus === 'ready') {
              return
            }

            if (res.data !== 'remove') {
              let j = changeData.split(",")
              if (res === 'clear') {
                this.msgPushInfoArray[j[0]][j[1]] = ''
              } else {
                let data = JSON.parse(res.data)
                this.msgPushInfoArray[j[0]][j[1]] = data.url
                this.msgPushInfoArray[j[0]]['secondsDuration'] = data.secondsDuration // 时长
                this.msgPushInfoArray[j[0]]['secondsDurationFormat'] = data.secondsDurationFormat //音频时长(hh:mm:ss)
                this.msgPushInfoArray[j[0]]['fileName'] = data.name // 附件名
              }
            } else {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              let j = changeData.split(",")
              this.msgPushInfoArray[j[0]][j[1]] = ''
              this.msgPushInfoArray[j[0]]['secondsDuration'] = '' //音频时长(hh:mm:ss)
              this.msgPushInfoArray[j[0]]['secondsDurationFormat'] = '' // 时长
              this.msgPushInfoArray[j[0]]['fileName'] = '' // 附件名
            }
          },

          // 文件上传前的钩子
          beforeUpload (file) {
            const isLt2M = file.size / 1024 / 1024 < this.uploadOption.fileSize
            if (!isLt2M) {
              this.$message.error(`上传文件大小不能超过 ${this.uploadOption.fileSize + (this.uploadOption.fileSizeUnit || 'MB')}!`)
            }

            // 设置上传文件名
            // this.uploadOption.dataName = this.formContent.audioName

            return isLt2M
          },
          // 20210508 自动提醒-选择问卷宣教
          choiceQuestionnaire(i1, i2) {
            this.eduorqusChoice.i1 = i1
            this.eduorqusChoice.i2 = i2
            let nurseUnitId = 0
            if (this.detail.selectDeptId && this.pageFrom === 'msgWarnUse')nurseUnitId += ',' + this.detail.selectDeptId
            let choiceID = this.msgPushInfoArray[i1]['resourceInfo'][i2]['choiceID']
            if (!choiceID) this.msgPushInfoArray[i1]['resourceInfo'][i2]['choiceID'] = ''
            this.showChoiceQuestionnaire = true
            this.$nextTick(() => {
              this.$refs.ref_choiceQuestionnaire.init({ SingleChoice: true, check: choiceID, nurseUnitId: nurseUnitId })
            })
          },
          choiceQuestionnaireBack(treeCheckedArray) {
            let arr = JSON.parse(treeCheckedArray)
            console.log('选择完问卷后的返回：', treeCheckedArray)
            this.msgPushInfoArray[this.eduorqusChoice.i1]['resourceInfo'][this.eduorqusChoice.i2]['choiceID'] = arr[0]['paperId']
            this.msgPushInfoArray[this.eduorqusChoice.i1]['resourceInfo'][this.eduorqusChoice.i2]['url'] = '/questionnaireDetails?paperId=' + arr[0]['paperId']
            this.msgPushInfoArray[this.eduorqusChoice.i1]['resourceInfo'][this.eduorqusChoice.i2]['type'] = '问卷调查'
          },
          choiceEducation(i1, i2) {
            this.eduorqusChoice.i1 = i1
            this.eduorqusChoice.i2 = i2
            let nurseUnitId = 0
            // if (!nurseUnitId)nurseUnitId = 1
            if (this.detail.selectDeptId && this.pageFrom === 'msgWarnUse')nurseUnitId += ',' + this.detail.selectDeptId
            let choiceID = this.msgPushInfoArray[i1]['resourceInfo'][i2]['choiceID']
            if (!choiceID) this.msgPushInfoArray[i1]['resourceInfo'][i2]['choiceID'] = ''
            this.showChoiceEducation = true
            this.$nextTick(() => {
              this.$refs.ref_choiceEducation.init({ SingleChoice: true, check: choiceID, nurseUnitId: nurseUnitId })
            })
          },
          choiceEducationBack(treeCheckedArray) {
            let arr = JSON.parse(treeCheckedArray)
            console.log('选择完宣教后的返回：', treeCheckedArray)
            this.msgPushInfoArray[this.eduorqusChoice.i1]['resourceInfo'][this.eduorqusChoice.i2]['choiceID'] = arr[0]['eduid']
            if (this.msgPushInfoArray[this.eduorqusChoice.i1]['resourceInfo'][this.eduorqusChoice.i2]['id'] === 'wnBedSideExtension') this.msgPushInfoArray[this.eduorqusChoice.i1]['resourceInfo'][this.eduorqusChoice.i2]['url'] = '/edugrid/details?type=myEdu&index=1&eduID=' + arr[0]['eduid'] + '&readState=未阅读'
            else this.msgPushInfoArray[this.eduorqusChoice.i1]['resourceInfo'][this.eduorqusChoice.i2]['url'] = '/details?type=myEdu&index=1&eduID=' + arr[0]['eduid'] + '&readState=未阅读'
            this.msgPushInfoArray[this.eduorqusChoice.i1]['resourceInfo'][this.eduorqusChoice.i2]['type'] = '宣教'
          },
          // 编辑回显
          editInit(Obj) {
            const _this = this
            _this.msgType = Obj.msgType
            let pushMsgInfo = eval('(' + Obj.pushMsgInfo + ')')
            _this.msgPushInfoArray = []
            for (let k in pushMsgInfo) {
              let sort = 0
              if (k === 'NURSE') {
                sort = 1
              } else if (k === 'NURSE_HEAD') {
                sort = 2
              } else if (k === 'DOCTOR') {
                sort = 3
              }
              let j = JSON.parse(_this.recipientInitDic)
              j.id = k
              j.viewType = pushMsgInfo[k]['viewType']
              j.sort = sort
              j.secondsDuration = pushMsgInfo[k]['secondsDuration']
              j.secondsDurationFormat = pushMsgInfo[k]['secondsDurationFormat']
              j.fileName = pushMsgInfo[k]['fileName']
              j[pushMsgInfo[k]['viewType']] = pushMsgInfo[k]['content']

              let resourceInfo = pushMsgInfo[k]['resourceInfo']

              for (let v of resourceInfo.values()) {
                let indexR = j.resourceInfo.findIndex((val, index) => {
                  return val.id === v.deviceName
                })
                j.resourceInfo[indexR]['isCheckbox'] = true
                j.resourceInfo[indexR]['url'] = v.url
                if (v.choiceID)j.resourceInfo[indexR]['choiceID'] = v.choiceID
                if (v.type)j.resourceInfo[indexR]['type'] = v.type
                if (v.forceJump)j.resourceInfo[indexR]['forceJump'] = v.forceJump
              }
              _this.msgPushInfoArray.push(j)
              console.log(j)
            }
            _this.msgPushInfoArray.sort(_this.compareMsg("sort"))
          },
          // 保存数据
          formSave() {
            const _this = this
            let msgPushInfo = {}
            let eduOrPaperId = {}
            for (let v of _this.msgPushInfoArray.values()) {
              msgPushInfo[v.id] = {
                secondsDuration: v.secondsDuration,
                secondsDurationFormat: v.secondsDurationFormat, //音频时长(hh:mm:ss)
                fileName: v.fileName,
                viewType: v.viewType,
                content: v[v.viewType],
                resourceInfo: ''
              }
              let resourceInfo = []
              for (let v2 of v.resourceInfo.values()) {
                if (v2.isCheckbox) {
                  let rObj = {
                    deviceName: v2.id,
                    url: v2.url
                  }
                  // 患者-可以选择问卷或者宣教
                  if (v.id === 'PATIENT' && v2.url.includes(v2.choiceID)) {
                    rObj.choiceID = v2.choiceID
                    rObj.type = v2.type
                    rObj.forceJump = v2.forceJump
                    if (v2.deviceName === '床旁分机') eduOrPaperId.sideEduOrPaperId = v2.choiceID
                    if (v2.deviceName === '床头分机') eduOrPaperId.headEduOrPaperId = v2.choiceID
                  }
                  resourceInfo.push(rObj)
                }
              }
              msgPushInfo[v.id].resourceInfo = resourceInfo
            }
            return { msgPushInfo: JSON.stringify(msgPushInfo), sideEduOrPaperId: eduOrPaperId.sideEduOrPaperId || '', headEduOrPaperId: eduOrPaperId.headEduOrPaperId || '' }
          }
        },
        // 监控data中的数据变化
        watch: {}
    }
</script>

<style scoped lang="scss">
    //@import url(); 引入公共css类
</style>