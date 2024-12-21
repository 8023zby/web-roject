<!--+
  逻辑描述：https://www.cnblogs.com/pangchunlei/p/14754314.html
  文件描述：自动提醒\提醒应用-添加/修改页
    根据pageFrom这个参数判断：msgWarnUse 是提醒应用，msgWarn是自动提醒
      主样式class：edit-page-new
  创建时间：2020/5/09 14:31
  创建人：Administrator

  自动提醒，公式选择逻辑：
  字段：expressType
  0 比较运算 ：需要选择比较字段，输入比较值
  1 关键正则 ：关键字匹配，需要选择匹配字段，输入匹配值
  2 新增即提醒 ：只需选择公式，不需要选字段，输入内容
  3 修改即提醒 ：只需选择公式，不需要选字段，输入内容
  4 删除即提醒 ：只需选择公式，不需要选字段，输入内容
  5 时间运算：触发时刻，相对时间时，选择用的公式
  6 监听值提醒
-->
<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{detail.type==='add'?'添加消息':'修改消息'}}</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 100%;">
        <el-form ref="formMsg" :model="formMsg" :rules="rules" label-width="130px">
          <el-form-item label="消息类型:" prop="msgType">
            <el-select v-model="formMsg.msgType"
                       class="elinput-300"
                       @change="msgTypeChange"
                       :disabled="pageFrom!=='msgWarn'"
                       placeholder="请选择">
              <el-option v-for="item in eventTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">{{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息名称:" :prop="pageFrom==='msgWarn'?'msgName':''">
            <el-input v-model="formMsg.msgName" class="elinput-300" placeholder="请输入" :disabled="pageFrom!=='msgWarn'"/>
          </el-form-item>
          <el-form-item label="消息描述:">
            <el-input
              :disabled="pageFrom!=='msgWarn'"
              placeholder="请输入"
              v-model="formMsg.msgDesc"
              class="elinput-300"
              type="textarea"
              :rows="7"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="选择表:" prop="itemId" >
            <el-select v-model="formMsg.itemId"
                       :disabled="pageFrom!=='msgWarn'"
                       class="elinput-300"
                       @change="changeItemId"
                       placeholder="请选择">
              <el-option v-for="item in tableList"
                         :key="item.itemId"
                         :label="item.tableNameExplain"
                         :value="item.itemId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="患者id字段:" prop="patientIdField" v-if="formMsg.itemId!==''">
            <el-select v-model="formMsg.patientIdField"
                       class="elinput-300"
                       :disabled="pageFrom!=='msgWarn'"
                       placeholder="请选择">
              <section v-for="item3 in listTableFields" :key="item3.key">
                <el-option
                  v-if="item3.tableFrom !== '关联表'"
                  :label="item3.keyName"
                  :value="item3.key">
                </el-option>
              </section>

            </el-select>
          </el-form-item>
          <!--关联表 ==== START-->
          <section v-if="formMsg.itemId!==''">
            <el-form-item label="选择关联表" :class="{'remind-rules':unionRules.length > 0}">
              <el-button
                v-if="pageFrom==='msgWarn'"
                type="primary"
                icon="el-icon-plus"
                title="添加"
                circle
                @click="RelatedTableAdd"
                size="mini"
                class="button-model-add"
              />
            </el-form-item>
            <div class="border-dom" v-if="unionRules.length > 0">
              <el-row v-for="(item,index) in unionRules" :key="index">
                <el-col :span="7">
                  <el-form-item label="关联表："  class="form-required">
                    <el-select v-model="item.sqlId"
                               :disabled="pageFrom!=='msgWarn'"
                               style="width:90%;"
                               @change="changeRelated(index)"
                               placeholder="请选择">
                      <el-option v-for="item2 in RelatedtableList"
                                 :label="item2.name"
                                 :value="item2.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="small-btn">
                  <el-button
                    v-if="pageFrom==='msgWarn'"
                    type="danger"
                    icon="el-icon-minus"
                    title="删除"
                    circle
                    @click="RelatedTableDel(index)"
                    size="mini"
                    class="button-model-del"
                  />
                </el-col>
                <el-col :span="5" v-for="(item2,index2) in item.gl" :key="index2">
                  <el-form-item :label="`${item2.keyName}:`"  class="form-required">
                    <el-select v-model="item2.mainTableField"
                               :disabled="pageFrom!=='msgWarn'"
                               style="width:90%;"
                               @change="$forceUpdate()"
                               placeholder="请选择">
                      <section v-for="item3 in listTableFields" :key="item3.key">
                        <el-option
                          v-if="item3.tableFrom !== '关联表'"
                          :key="item3.key"
                          :label="item3.keyName"
                          :value="item3.key">
                        </el-option>
                      </section>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </section>
          <!--关联表 ==== END-->
          <el-form-item label="提醒规则:" prop="eventType">
            <el-checkbox-group v-model="formMsg.eventType" :disabled="pageFrom!=='msgWarn'">
              <el-checkbox label="INSERT" :disabled="formMsg.itemId===''">新增</el-checkbox>
              <el-checkbox label="UPDATE" :disabled="formMsg.itemId===''">修改</el-checkbox>
              <el-checkbox label="DELETE" :disabled="formMsg.itemId===''">删除</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <ruleConfiguration v-if="formMsg.itemId" ref="ref_ruleConfiguration" :pageFrom="pageFrom"></ruleConfiguration>
          <el-form-item label="显示图标:" >
            <div style="float: left;margin-right: 15px;">
              <el-switch
                :disabled="pageFrom!=='msgWarn'"
                v-model="formMsg.icon">
              </el-switch>
            </div>
            <div style="float: left;" v-if="formMsg.icon && pageFrom==='msgWarn'">
              <upload-flied ref="uploadIconFile"
                            v-model="formMsg.iconUrl"
                            :data-name="uploadOption.dataName"
                            :accept="uploadOption.accept"
                            :limits="uploadOption.limits"
                            :filelist="uploadOption.fileList"
                            :handle-exceed="handleExceed"
                            btnName="上传"
                            :fileSize=1
                            changeData="icon"
                            :showFileView="false"
                            :showFileList="true"
                            showFileType="icon"
                            @uploadFlieds="uploadFlieds" />
            </div>
            <div v-else-if="pageFrom!=='msgWarn'&&formMsg.iconName!==''">
              <img :src="formMsg.iconUrl" alt="" width="100px">
            </div>

          </el-form-item>

          <el-form-item label="触发时刻:" prop="timeType">
            <el-checkbox-group v-model="formMsg.timeType">
              <el-checkbox label="IMMEDIATE">实时提醒</el-checkbox>
              <el-checkbox label="ABSOLUTE">绝对时间</el-checkbox>
              <el-checkbox label="RELATIVE" :disabled="formMsg.itemId==='' || pageFrom!=='msgWarn'">相对时间</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!--触发时刻-->
          <ruleTriggerPoint ref="ref_ruleTriggerPoint" :pageFrom="pageFrom"></ruleTriggerPoint>

          <el-form-item label="接收者:" prop="recipient">
            <el-checkbox-group v-model="formMsg.recipient">
              <el-checkbox v-for="(item,index) in recipientDic" :key="index" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!--接收者组件加载-->
          <recipient-component ref="ref_RecipientComponent" :recipientDic="recipientDic" :detail="detail" :pageFrom="pageFrom"></recipient-component>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="backHandler">取消</el-button>
      <el-button type="primary" @click="msgSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
  import BaseEditForm from '../../common/BaseEditForm'
  import { deepMergeLeft, deepClone } from '@/assets/wnms/utils'
  import * as msgWarnApi from '@/api/wnms//msgManage/msgWarn'
  import mains from './mixins'
  import uploadFlied from './uploadFlied-new'
  import ruleConfiguration from './components/ruleConfiguration'
  import recipientComponent from './components/recipientComponent'
  import ruleTriggerPoint from './components/ruleTriggerPoint'

  export default {
    components: { uploadFlied, ruleConfiguration, recipientComponent, ruleTriggerPoint },
    mixins: [BaseEditForm, mains],
    props: {
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
    data () {
      const form = this.initForm()
      const rules = this.initRules()
      return {
        // 关联表
        RelatedTable: {
          sqlId: ''
        },
        RelatedtableList: [],
        unionRules: [], //关联表保存字段
        DeptInfo: {}, //护理单元信息
        detailData: {},
        iscanWatch: true, //是否可以进行监听的参数
        // 接收者选择插入字段的时候，选择字段
        dialogVisible: false,
        textTable: '', //替换的表名
        textIndex: '',
        // 表达式字典
        expressionList: [],
        // 选择的表的字段
        listTableFields: [],
        listTableFieldsString: '',
        //接收者字典
        recipientDic: [
          { id: 'PATIENT', name: '患者' },
          { id: 'NURSE', name: '护士' },
          { id: 'NURSE_HEAD', name: '护士长' },
          { id: 'DOCTOR', name: '医生' }
        ],
        eventTypeList: [], //消息类型字典
        tableList: [], //选择表字典
        // Icon上传设置
        uploadOption: {
          fileSize: 10,
          fileSizeUnit: '',
          dataName: '',
          accept: '.png,.jpg,bmp',
          limits: 1,
          fileList: []
        },
        form: form,
        formMsg: {
          // 接收者选择后配置项的变量
          msgPushInfoArray: [],
          // 规则配置存储变量
          focusRulesArray: null,
          itemId: '', //侦听项id
          id: '',
          msgType: '', // 消息类型
          msgName: '', // 消息名称
          msgDesc: '', // 消息描述
          eventType: [], // 提醒规则
          focusRules: {
            UPDATE: [],
            INSERT: [],
            DELETE: []
          },
          icon: false, // 显示图标
          iconUrl: '', //图标路径
          timeType: [], //触发时刻
          //触发时刻-配置项
          timeConfig: {
            ABSOLUTE: [], //绝对时间
            RELATIVE: [] //相对时间
          },
          recipient: [], //接收者
          //接收者-配置项
          msgPushInfo: {},
          patientIdField: ''//患者id字段
        },
        rules: rules
      }
    },
    mounted () {
      this.DeptInfo = JSON.parse(localStorage.getItem("selectDeptInfo"))
      // 获取表
      msgWarnApi.getlistTables().then(res => {
        if (res.status === 200 && res.data) {
          this.tableList = res.data
          this.$refs.ref_RecipientComponent.tableList = res.data
        } else {
          console.log('获取表失败')
        }
      }).catch(e => {
        console.log(e, '获取表失败')
      })

      msgWarnApi.getlistRelatedTables().then(res => {
        if (res.status === 200 && res.data) {
          this.RelatedtableList = res.data
        } else {
          console.log('获取关联表失败')
        }
      }).catch(e => {
        console.log(e, '获取关联表失败')
      })
      // 获取消息类型
      msgWarnApi.getConfigType().then(res => {
        if (res.status === 200 && res.data) {
          this.eventTypeList = res.data
          // console.log('消息类型:', JSON.stringify(this.eventTypeList))
        } else {
          console.log('获取消息类型失败')
        }
      }).catch(e => {
        console.log(e, '获取消息类型失败')
      })
      // 获取公式
      msgWarnApi.getExpressionList({ itemId: this.formMsg.itemId }).then(res => {
        // 获取选择表的公式
        if (res.status === 200 && res.data) {
          for (let v of res.data.values()) {
            if (v.functionArgs) {
              v.functionArgs = JSON.parse(v.functionArgs)
            }
          }
          this.expressionList = res.data
          console.log('获取的公式', JSON.stringify(this.expressionList))
        } else {
          console.log('获取公式失败')
        }
      }).catch(e => {
        console.log(e, '获取公式失败')
      })

      // type !== add 为空的话 那么就是修改
      if (this.detail.type !== 'add') {
        this.iscanWatch = false
        msgWarnApi.Details(this.detail.row.eventId).then(res => {
          this.form.eventId = this.detail.row.eventId
          if (res.status === 200) {
            this.dealDetail(res.data)
          }
        })
      } else {
        // type == add 的话 那么就是添加
        deepMergeLeft(this.form, this.initForm())
      }

      // 校验
      this.$nextTick(() => {
        this.$refs['formMsg'].clearValidate()
      })
    },
    watch: {
      // 触发时刻联动监听
      'formMsg.timeType': {
        handler(newVal, oldVal) {
          if (!this.iscanWatch) return
          const _this = this
          console.log('触发时刻联动监听', '新值：' + JSON.stringify(newVal), '旧值：' + JSON.stringify(oldVal))

          _this.$refs.ref_ruleTriggerPoint.init({
            newVal: JSON.stringify(newVal),
            oldVal: JSON.stringify(oldVal),
            expressionList: JSON.stringify(_this.expressionList)
          })
        },
        immediate: false,
        deep: true
      },
      // 监听提醒规则的变化
      'formMsg.eventType': {
        handler(newVal, oldVal) {
          if (!this.iscanWatch) return
          const _this = this
          let n = []
          if(newVal.includes('INSERT'))n.push('INSERT')
          if(newVal.includes('UPDATE'))n.push('UPDATE')
          if(newVal.includes('DELETE'))n.push('DELETE')
          console.log('监听提醒规则的变化', JSON.stringify(newVal), JSON.stringify(oldVal))
          _this.$refs.ref_ruleConfiguration.init({
            newVal: JSON.stringify(n),
            oldVal: JSON.stringify(oldVal),
            expressionList: JSON.stringify(_this.expressionList)
          })
        },
        immediate: false,
        deep: true
      },
      // 监听接收者
      'formMsg.recipient': {
        handler(newVal, oldVal) {
          if (!this.iscanWatch) return
          const _this = this
          _this.$refs.ref_RecipientComponent.changeRecipient(
            {
              newVal: JSON.stringify(newVal),
              oldVal: JSON.stringify(oldVal)
            }
          )
          _this.msgTypeChange()
        },
        immediate: false,
        deep: false
      }
    },
    methods: {
      // formMsg.msgType: 消息类型更改触发：
      // 31986 【消息中心】：配置的手术状态推送规则中，打开强制跳转开关，接收到的消息没有强制跳转到配置的宣教或问卷页面
      // 选择手术安排后formMsg.msgType===9，才能显示强制跳转
      msgTypeChange() {
        this.$refs.ref_RecipientComponent.msgTypeChange(this.formMsg.msgType)
      },
      /**
       * 关联表处理
       * */
      // 添加关联表
      RelatedTableAdd() {
        for (let v of this.unionRules.values()) {
          if (v.sqlId === '') {
            this.$message({
              type: 'warning',
              message: '请先完善当前关联表信息!'
            })
            return
          }
        }
        let t = { sqlId: '', inConfig: {} }
        this.unionRules.push(t)
      },
      // 删除关联表
      RelatedTableDel(index) {
        this.listTableFields = JSON.parse(this.listTableFieldsString)
        this.unionRules.splice(index, 1)
        for (let v of this.unionRules.values()) {
          let rt = this.RelatedtableList.find((vt, it) => {
            return v.sqlId === vt.id
          })
          if (rt) this.listTableFields = [...this.listTableFields, ...JSON.parse(rt.outFieldInfo)]
        }
        this.$refs.ref_ruleConfiguration.listTableFields = this.listTableFields
        this.$refs.ref_ruleTriggerPoint.listTableFields = this.listTableFields
        this.$refs.ref_RecipientComponent.listTableFields = this.listTableFields
      },
      // 更改关联表
      changeRelated(index) {
        let sqlId = this.unionRules[index]['sqlId']
        let table = this.RelatedtableList.find((v, i) => {
          return v.id === sqlId
        })
        // 判断是否选了这个关联表,关联表只能选择一次 === START
        let cftable = 0
        for (let v of this.unionRules.values()) {
          if (v.sqlId === sqlId)cftable++
        }

        if (cftable === 2) {
          this.$message({
            type: 'warning',
            message: '关联表不能重复!'
          })
          this.unionRules[index]['sqlId'] = ''
          this.unionRules[index]['gl'] = []
          return
        }
        // 判断是否选了这个关联表,关联表只能选择一次 === END
        if (table.inFieldInfo && table.inFieldInfo !== null && table.inFieldInfo !== '') {
          this.unionRules[index]['gl'] = []
          let inFieldInfo = JSON.parse(table.inFieldInfo)
          for (let [i, v] of inFieldInfo.entries()) {
            this.unionRules[index]['gl'].push(Object.assign(v, { mainTableField: '' }))
          }
        }

        // 将选择的关联表的出参，并到全部字段中供选择
        this.listTableFields = JSON.parse(this.listTableFieldsString)
        for (let v of this.unionRules.values()) {
          let rt = this.RelatedtableList.find((vt, it) => {
            return v.sqlId === vt.id
          })
          if (rt) this.listTableFields = [...this.listTableFields, ...JSON.parse(rt.outFieldInfo)]
        }
        this.$refs.ref_ruleConfiguration.listTableFields = this.listTableFields
        this.$refs.ref_ruleTriggerPoint.listTableFields = this.listTableFields
        this.$refs.ref_RecipientComponent.listTableFields = this.listTableFields

        console.log('更改关联表,处理关联表入参匹配主表字段\n当前选择的表：', table, '\n关联表数据：', this.unionRules, index)
      },
      // 编辑回显关联表
      showRelatedTable() {
        const _this = this
        try {
          let unionRules = _this.detailData.unionRules
          unionRules = JSON.parse(unionRules)
          for (let v of unionRules) {
            let Obj = {
              sqlId: v.sqlId,
              gl: []
            }

            let inFieldInfo = JSON.parse((_this.RelatedtableList.find((v2) => v2.id === v.sqlId)).inFieldInfo)
            let outFieldInfo = JSON.parse((_this.RelatedtableList.find((v2) => v2.id === v.sqlId)).outFieldInfo)
            for (let [ii, vv] of Object.entries(v.inConfig)) {
              let ru = inFieldInfo.find((vvv) => vvv.key === ii)
              Obj.gl.push(Object.assign(ru, { mainTableField: vv.match(/\[\$(\S*)\]/)[1] }))
            }
            _this.unionRules.push(Obj)
            // 初始化字段
            this.listTableFields = [...this.listTableFields, ...outFieldInfo]
            this.$refs.ref_ruleConfiguration.listTableFields = this.listTableFields
            this.$refs.ref_ruleTriggerPoint.listTableFields = this.listTableFields
            this.$refs.ref_RecipientComponent.listTableFields = this.listTableFields
          }
        } catch (e) {
          console.log('编辑回显关联表出错！！！！！！！！！！！！！！')
        }
      },
      // 处理详情信息==编辑 == 回显基本项
      dealDetail(data) {
        const _this = this
        _this.detailData = data
        //消息类型
        _this.formMsg.msgType = data.msgType
        //消息名称
        _this.formMsg.msgName = data.msgName
        //消息描述
        _this.formMsg.msgDesc = data.msgDesc
        //选择表（侦听项id）
        _this.formMsg.itemId = data.itemId
        //患者id字段

        _this.formMsg.patientIdField = data.patientIdField
        //提醒规则
        if (data.eventType && _this.formMsg.eventType)_this.formMsg.eventType = data.eventType.split(',')
        // 显示图标
        _this.formMsg.iconUrl = data.icon === '' ? '' : data.icon
        _this.formMsg.iconName = data.iconName === '' ? '' : data.iconName
        _this.formMsg.icon = data.icon !== ''
        _this.uploadOption.fileList = [
          {
            name: _this.formMsg.iconName,
            url: _this.formMsg.iconUrl
          }
        ]
        //触发时刻
        if (_this.formMsg.timeType)_this.formMsg.timeType = data.timeType.split(',')
        //接收者
        if (_this.formMsg.recipient)_this.formMsg.recipient = data.recipient.split(',')

        //_this.iscanWatch=true
        _this.changeItemId('editContinue') //更新字段和公式
        if (_this.pageFrom === 'msgWarn' && data.deptIds) {
          const h = this.$createElement;
          this.$msgbox({
            title: '提示',
            message: h('p', null, [
              h('span', null, '系统数据显示，该条提醒已应用到护理单元，若是修改，需重新应用到对应护理单元，且会覆盖各护理单元的改动。请谨慎修改！')
            ]),
            showCancelButton: false,
            confirmButtonText: '关闭',
            showClose: false
          }).then(action => {

          });
        }
      },
      dealDetailJson() {
        const _this = this
        let data = _this.detailData

        // 编辑回显：处理提醒规则 ===== START
        this.$refs.ref_ruleConfiguration.editInit({
            eventType: JSON.stringify(_this.formMsg.eventType),
            focusRules: data.focusRules,
            expressionList: JSON.stringify(_this.expressionList)
          })
        // 编辑回显：处理提醒规则 ===== END

        // 编辑回显：处理触发时刻 =========START
        if (_this.formMsg.timeType) this.$refs.ref_ruleTriggerPoint.editInit({
            timeType: JSON.stringify(_this.formMsg.timeType),
            timeConfig: data.timeConfig,
            expressionList: JSON.stringify(_this.expressionList)
          })
        // 编辑回显：处理触发时刻 =========END
        // 编辑回显：处理接收者相关配置 =========START
        if (_this.formMsg.recipient) _this.$refs.ref_RecipientComponent.editInit({pushMsgInfo: data.pushMsgInfo, msgType: _this.formMsg.msgType})
        // 编辑回显：处理接收者相关配置 =========END
        _this.$nextTick(() => {
          _this.iscanWatch = true
        })
      },
      //手动表单验证
      ruleEventType(array, type, index, val) {
        try {
          if (type === 'nonee') {
            let v = this.formMsg[array][index][val]
            if (v === '' || !v) {
              this.$message.warning('必填项不能为空！')
            }
          } else {
            let v = this.formMsg[array][type][index][val]
            let isVariable = this.formMsg[array][type][index]['functionArgs'][val]['isVariable']
            console.log('手动表单验证:', array, type, index, val, v, 'isVariable:' + isVariable)

            if (v === '' || !v) {
              if (isVariable) this.$message.warning('必填项不能为空！')
            }
          }
        } catch (e) {
          console.log('手动表单验证代码出错------------')
        }
      },
      changeItemId(type) {
        this.$refs.ref_RecipientComponent.itemId = this.formMsg.itemId
        // 获取选择表的字段
        msgWarnApi.getlistTableFields({ table: this.formMsg.itemId }).then(res => {
          if (res.status === 200) {
            if (res.data !== null) {
              this.listTableFields = JSON.parse(res.data[0].fieldInfo)
              this.$refs.ref_ruleConfiguration.listTableFields = this.listTableFields
              this.$refs.ref_ruleTriggerPoint.listTableFields = this.listTableFields
              this.$refs.ref_RecipientComponent.listTableFields = this.listTableFields
              this.listTableFieldsString = res.data[0].fieldInfo
              console.log('获取选择表的字段:', JSON.stringify(this.listTableFields))
              // 2021-04-22 选择完表之后不在查询公式了，直接走逻辑
              if (type && type === 'editContinue') {
                // 回显关联表
                this.showRelatedTable()
                this.dealDetailJson()
              } else {
                // 清空患者id
                this.formMsg.patientIdField = ''

                // 清空规则
                this.formMsg.eventType = []

                // 清空触发时刻
                this.formMsg.timeType = []
                this.formMsg.timeConfig = {
                  ABSOLUTE: [], //绝对时间
                  RELATIVE: [] //相对时间
                }

                // 清空关联表
                this.unionRules = []

                setTimeout(() => {
                  this.$refs.formMsg.clearValidate()
                }, 10)
              }
            }
          }
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
          if (changeData === 'icon') {
            if (res === 'clear') {
              this.formMsg.iconUrl = ''
            } else {
              let data = JSON.parse(res.data)
              this.formMsg.iconUrl = data.url
              this.formMsg.iconName = data.name
            }
          } else {
            let j = changeData.split(",")
            if (res === 'clear') {
              this.formMsg.msgPushInfoArray[j[0]][j[1]] = ''
            } else {
              let data = JSON.parse(res.data)
              this.formMsg.msgPushInfoArray[j[0]][j[1]] = data.url
              this.formMsg.msgPushInfoArray[j[0]]['secondsDuration'] = data.secondsDuration // 时长
              this.formMsg.msgPushInfoArray[j[0]]['secondsDurationFormat'] = data.secondsDurationFormat //音频时长(hh:mm:ss)
              this.formMsg.msgPushInfoArray[j[0]]['fileName'] = data.name // 附件名
            }
          }
        } else {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (changeData === 'icon') {
            this.formMsg.iconUrl = ''
            this.formMsg.iconName = ''
          } else {
            let j = changeData.split(",")
            this.formMsg.msgPushInfoArray[j[0]][j[1]] = ''
            this.formMsg.msgPushInfoArray[j[0]]['secondsDuration'] = '' //音频时长(hh:mm:ss)
            this.formMsg.msgPushInfoArray[j[0]]['secondsDurationFormat'] = '' // 时长
            this.formMsg.msgPushInfoArray[j[0]]['fileName'] = '' // 附件名
          }
        }

        console.log(this.formMsg.msgPushInfoArray)
      },
      // 清除表单验证
      clearValidate (refs) {
        this.$nextTick(() => {
          this.$refs[refs].clearValidate()
        })
      },
      // 点击保存按钮，处理提交数据
      msgSubmit() {
        const _this = this

        // 手写表单验证模块 ===== START
        // 图标
        if (_this.formMsg.icon && _this.formMsg.iconUrl === '') {
          this.$message.warning('请上传图标！')
          return
        }
        // 提醒规则
        try {
          if (_this.formMsg.eventType.length === 0){
            this.$message.warning('请选择提醒规则！')
            return
          }
          _this.formMsg.focusRulesArray = this.$refs.ref_ruleConfiguration.focusRulesArray
          for (let i = 0; i < _this.formMsg.eventType.length; i++) {
            let ety = _this.formMsg.eventType[i]
            for (let v of _this.formMsg.focusRulesArray[ety].values()) {
              if (!v.eid || v.eid === '') {
                this.$message.warning('提醒规则请选择公式！')
                return
              }
              if (v.expressType === 0) {
                if (v.A === '' || (v.B === '' && v.functionArgs['B']['isVariable'])) {
                  this.$message.warning('提醒规则选择后，请选择字段或输入参数！')
                  return
                }
              } else if (v.expressType === 1) {
                if (v.keywordField === '' || v.keywordValue === '' || !v.keywordField || !v.keywordValue) {
                  this.$message.warning('提醒规则选择后，请选择字段或输入参数！')
                  return
                }
              }
            }
          }
        } catch (e) {
          console.log(e, '验证提醒规则中有错误！！')
          this.$message.warning('验证提醒规则中有错误！')
          return
        }

        // 触发时刻
        _this.formMsg.timeConfig = this.$refs.ref_ruleTriggerPoint.timeConfig
        for (let i = 0; i < _this.formMsg.timeType.length; i++) {
          let ety = _this.formMsg.timeType[i]

          if (_this.formMsg.timeConfig[ety]) {
            for (let v of _this.formMsg.timeConfig[ety].values()) {
              if (ety === 'ABSOLUTE') {
                if (v.frequency === undefined || v.frequency === '') {
                  this.$message.warning('触发时刻选择绝对时间后，请选择频率！')
                  return
                }
                if (!v.absoluteTime || v.absoluteTime === '') {
                  this.$message.warning('触发时刻选择绝对时间后，请选择时间！')
                  return
                }
                if (v.executeCount) {
                  // 次数”输入框限制输入1000以内的正整数
                  let re = /^\d+$|^\d*\.\d+$/g
                  if (!re.test(v.executeCount)) {
                    this.$message.warning('触发时刻选择绝对时间后，输入次数限制为不大于1000的正整数！')
                    return
                  } else {
                    if (v.executeCount > 1000) {
                      this.$message.warning('触发时刻选择绝对时间后，输入次数限制为不大于1000的正整数！')
                      return
                    } else if (v.executeCount < 1) {
                      this.$message.warning('触发时刻选择绝对时间后，输入次数限制为不大于1000的正整数！')
                      return
                    }
                  }
                }
              } else if (ety === 'RELATIVE') {
                if (!v.A) {
                  this.$message.warning('触发时刻选择相对时间后，请选择对比字段！')
                  return
                }
                if (!v.B) {
                  this.$message.warning('触发时刻选择相对时间后，请输入时间常量！')
                  return
                } else {
                  let VB = v.B
                  if (VB < 0)VB *= -1
                  if (Number(VB).toString() === 'NaN') {
                    this.$message.warning('触发时刻选择相对时间后，输入的比较时间为数字！')
                    return
                  }
                }
              }
            }
          }
        }

        // 接收者
        _this.formMsg.msgPushInfoArray = _this.$refs.ref_RecipientComponent.msgPushInfoArray
        for (let v of _this.formMsg.msgPushInfoArray.values()) {
          let isChr = v.resourceInfo.findIndex((rval, rindex) => {
            return rval.permissions.includes(v.id) && rval.isCheckbox
          })
          if (isChr === -1) {
            this.$message.warning('接收者选择后，请选择接收终端！')
            return
          }

          if (v.viewType === '') {
            this.$message.warning('接收者选择后，请选择展现形式！')
            return
          }
          if (!v[v.viewType] || v[v.viewType] === '') {
            this.$message.warning('接收者选择后，输入文字或者上传附件！')
            return
          }
          if (v.viewType === 'TEXT') {
            v.AUDIO = ''
            v.fileName = ''
            v.secondsDurationFormat = ''
            v.secondsDuration = ''
          } else {
            v.TEXT = ''
            for (let v2 of v.resourceInfo) {
              v2.url = ''
            }
          }
          for (let v2 of v.resourceInfo.values()) {
            if (v2.isCheckbox && v2.url !== '') {
              let u = v2.url.split('/')
              if (v2.url.indexOf('/') !== 0) {
                this.$message.warning('接收终端跳转URL不符合规范，请检查！')
                return
              }
            }
          }
        }

        // 手写表单验证模块 ===== END

        this.$refs.formMsg.validate((valid) => {
          if (!valid) return false
          this.$confirm('确定要保存吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          }).then(() => {
            try {
              //消息类型
              _this.form.msgType = _this.formMsg.msgType
              //消息名称
              _this.form.msgName = _this.formMsg.msgName
              //消息描述
              _this.form.msgDesc = _this.formMsg.msgDesc
              //选择表（侦听项id）
              _this.form.itemId = _this.formMsg.itemId
              //患者id字段
              _this.form.patientIdField = _this.formMsg.patientIdField
              // 关联表信息
              _this.form.unionRules = []
              for (let v of _this.unionRules) {
                let Obj = {
                  sqlId: v.sqlId,
                  inConfig: {}
                }
                for (let v2 of v.gl) {
                  Obj.inConfig[v2.key] = `[$${v2.mainTableField}]`
                }
                _this.form.unionRules.push(Obj)
              }
              _this.form.unionRules = JSON.stringify(_this.form.unionRules)
              //提醒规则
              _this.form.eventType = _this.formMsg.eventType.join(',')
              // 显示图标
              _this.form.icon = _this.formMsg.icon ? _this.formMsg.iconUrl : ''
              _this.form.iconName = _this.formMsg.iconName ? _this.formMsg.iconName : ''
              //触发时刻
              _this.form.timeType = _this.formMsg.timeType.join(',')
              //接收者
              _this.form.recipient = _this.formMsg.recipient.join(',')

              // 保存时，处理提醒规则 ===== START
              _this.form.focusRules = this.$refs.ref_ruleConfiguration.dealFocusRules()
              // 保存时，处理提醒规则 ===== END
              // 保存时，处理触发时刻 =========START
              _this.form.timeConfig = this.$refs.ref_ruleTriggerPoint.dealFocusRules()
              // 保存时，处理触发时刻 =========END
              // 保存时，处理接收者相关配置 =========START
              let repInfo = _this.$refs.ref_RecipientComponent.formSave()
              _this.form.pushMsgInfo = repInfo.msgPushInfo
              if (repInfo.sideEduOrPaperId) _this.form.sideEduOrPaperId = repInfo.sideEduOrPaperId
              if (repInfo.headEduOrPaperId) _this.form.headEduOrPaperId = repInfo.headEduOrPaperId

              if (_this.pageFrom === 'msgWarnUse') {
                _this.form.deptIds = this.detail.selectDeptId
              }
              // 保存时，处理接收者相关配置 =========END
              console.log('保存表单：', JSON.stringify(_this.form))
              _this.customSubmitHandler()
            } catch (e) {
              console.log(e, '处理保存数据的form时有错误！！')
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        })
      },
      // 保存数据
      customSubmitHandler () {
        // ID 为空的话 那么就是修改
        if (this.detail.type !== 'add') {
          if (this.pageFrom === 'msgWarnUse') {
            // 护理单元进来修改的时候，请求另一个接口
            msgWarnApi.EditUse(this.form).then(data => {
              this.submitSuccessHandler(data)
            })
          } else {
            msgWarnApi.Edit(this.form).then(data => {
              this.submitSuccessHandler(data)
            })
          }
        } else {
          // ID 为空的话 那么就是添加
          msgWarnApi.Add(this.form).then(data => {
            this.submitSuccessHandler(data)
          })
        }
      },
      backHandler (data) {
        console.log('这是添加页的放回', this.detail)
        this.$emit('option-changed', 'list', { search: this.detail.search, selectDeptId: this.detail.selectDeptId })
      }
    }
  }
</script>
<style lang="scss">
  //@import url(); 引入公共css类
  .htmlinfo{
    display: none;
  }
  // 提醒规则样式
  .remind-rules{
    margin: 15px 0 6px 0 !important;
    .el-form-item__label{
      text-align: center !important;
    }
  }
  .border-dom{
    min-height: 30px;
    border:1px solid #EBEEF5;
    width: 97%;
    margin: 0 auto;
    padding: 0 0 20px 0;
    margin-bottom: 20px;
    .el-row{
      margin-top: 20px;
      .small-btn{
        .el-button{
          position: absolute;
          top: 5px;
          margin-left: -16px;
        }
      }
      .el-col{
        .el-form-item{
          margin-bottom: 0;
          .el-form-item__label{
            width: 100px !important;
          }
          .el-form-item__content{
            margin-left: 100px !important;
          }
          .el-input--small,
          .el-textarea{
            width: 100% !important;
          }
        }
      }
    }
  }
  .viewType-dom{
    .el-form-item{
      .demo-device{
        margin-top: 12px;
      }
      .demo-device:first-child{
        margin-top: 0;
      }

      .el-form-item__label{
        width: 100px !important;
      }
      .el-form-item__content{
        margin-left: 100px !important;
        .el-row:first-child{
          margin-top: 0;
        }
      }
    }
    .recipientName{
      width: 80px;
      text-align: center;
      padding: 10px 0;
    }
  }
  .form-required:before{
    content: '*';
    color: #F56C6C;
    position: absolute;
    top: 8px;
    left: 10px;
  }
  .dialog-textc{
    width: 80%;
    text-align: center;
    margin: 0 auto;

    >div{
      margin: 20px 0;
      >span{
        display: inline-block;
        width: 100px;
        text-align: right;
      }
      .el-select{
        .el-popper{
          width: 300px;
          ul{
            li{
              text-align: left;
            }
          }
        }
      }
    }
  }
</style>
