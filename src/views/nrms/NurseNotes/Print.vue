<template comments>
  <div style="position: relative;">
    <!-- 此处单独将thead拿出来隐藏，是为了ref计算thead高度,不用受到allNote获取之后才能计算的限制  hanzhe  -->
    <table border="0" class="print-table" style="position: fixed; top: -1000px;">
      <thead :ref="'autoFormHeaderRef'+formId">
      <tr>
        <td :colspan="table_column.length" class="border_none">
          <formHeader :autoHead="autoHead" v-if="showAutoHead"></formHeader>
        </td>
      </tr>
      <template v-for="(tr, index) in table_header">
        <tr class="header" :key="index">
          <template v-for="(td,index) in tr">
            <td :rowspan="td.row" :colspan="td.col || 1" :style="{width: td.width || ''}" :key="index">
              {{td.signItemShowName}} <br /> {{td.signItemUnit}}
            </td>
          </template>
        </tr>
      </template>
      </thead>
    </table>
    <div class="nurse_note_print_container" :id="'nurse_note_print_container'+formId" v-loading="loading">
      <template v-for="pageArr in allNote">
        <template v-for="(_pageArr, index) in pageArr">
          <table border="0" class="print-table" :key="index">
            <thead>
            <tr>
              <td :colspan="table_column.length" class="border_none">
                <formHeader :autoHead="autoHead" v-if="showAutoHead"></formHeader>
              </td>
            </tr>
            <template v-for="(tr, index) in table_header">
              <tr class="header" :key="index">
                <template v-for="(td,index) in tr">
                  <td :rowspan="td.row" :colspan="td.col || 1" :style="{width: td.width || ''}" :key="index">
                    {{td.signItemShowName}} <br /> {{td.signItemUnit}}
                  </td>
                </template>
              </tr>
            </template>
            </thead>
            <tbody>
            <template v-for="(note,index) in _pageArr">
              <tr v-if="note.isEmpty" class="line_table" :key="index">
                <template v-for="(column,index) in table_column">
                  <td class="fixed_item empty"
                      :class="{text_line_height: column['signItemFieldName']==='conditionJson'}" :key="index">
                    &nbsp;
                  </td>
                </template>
              </tr>
              <tr v-else class="line_table" :key="index" :style="formCode === 'H-000010-WHJ-0024' && (note.recordType === 1 || note.recordType === 2) ? 'border-top: 3px solid blue' : ''">
                <template v-for="(column,index_1 ) in table_column">
                  <td class="fixed_item" :class="{text_line_height: column['signItemFieldName']==='conditionJson'}" :key="index_1">
                    <span v-if="column.signItemFieldName === 'recordDate'"
                          v-html="parseDateTime(note[column['signItemFieldName']],'time')">
                    </span>
                    <span v-else-if="column.signItemFieldName === 'recordDateDay'"
                          v-html="parseDateTime(note['recordDate'],'day')">
                    </span>
                    <span v-else-if="column.signItemFieldName === 'recordDateTime'"
                          v-html="parseDateTime(note['recordDate'],'hour')">
                    </span>
                    <span v-else-if="column.signItemFieldName === 'nursingAutograph'"
                            style="display: block; height: 40px; width: 100%">
                      <span class="sign_name" v-if="note.nursingAutograph">
                        <span class="text">
                          <template v-if="note.nursingAutographImage">
                            <span><img :src="note.nursingAutographImage" style="width: 100%; height: 100%"></span>
                          </template>
                          <template v-else>
                            <span style="text-align: left; padding-left: 2px">{{note.nursingAutograph}}</span>
                          </template>
                          <template v-if="note.userNameImage">
                            <span><img :src="note.userNameImage" style="width: 100%; height: 100%"></span>
                          </template>
                          <template v-else>
                            <span style="text-align: right; padding-right: 2px">{{note.userName}}</span>
                          </template>
                        </span>
                        <img class="line" src="../../../assets/nrms/images/line.png">
                      </span>
                      <span v-else style="line-height: 40px;">
                        <template v-if="note.userNameImage">
                          <img :src="note.userNameImage" style="width: 100%; height: 30px">
                        </template>
                        <template v-else>
                          {{note.userName}}
                        </template>
                      </span>
                    </span>
                    <span
                        v-else-if="column.signItemFieldName === 'conditionJson'">
                          {{note[column.signItemFieldName]?note[column.signItemFieldName][column.itemId] : ' '}}
                    </span>
                    <span
                        v-else-if="column.signItemFieldName === 'leaderAutograph'">
                      <template v-if="note.leaderAutographImage">
                        <img :src="note.leaderAutographImage" style="width: 100%; height: 30px">
                      </template>
                      <template v-else>
                        {{note.leaderAutograph}}
                      </template>
                    </span>
                    <span v-else-if="column.signItemFieldName === 'handAutograph'">
                    </span>
                    <span v-else-if="note.recordType === 1 && formCode !== 'H-000010-WHJ-0024'" :class="{'double-line': column.signItemUnit}">
                      <!-- 小结 -->
                      {{note.extendList[column.signId] ? note.extendList[column.signId]["itemValue"] : ""}}
                    </span>

                    <span v-else-if="note.recordType === 1 && formCode === 'H-000010-WHJ-0024'">
                      <!-- 小结 -->
                      {{note.extendList[column.signId] ? note.extendList[column.signId]["itemValue"] : ""}}
                    </span>

                    <span v-else-if="note.recordType === 2 && formCode !== 'H-000010-WHJ-0024'" style="color: red" :class="{'double-line': column.signItemUnit}">
                      <!-- 总结 -->
                      {{note.extendList[column.signId] ? note.extendList[column.signId]["itemValue"] : ""}}
                    </span>

                    <span v-else-if="note.recordType === 2 && formCode === 'H-000010-WHJ-0024'">
                      <!-- 总结 -->
                      {{note.extendList[column.signId] ? note.extendList[column.signId]["itemValue"] : ""}}
                    </span>

                    <span v-else>
                      {{note.extendList && note.extendList[column['signId']] ? note.extendList[column['signId']]['itemValue'] : '&nbsp;'}}
                    </span>
                  </td>
                </template>
              </tr>
            </template>
              <!-- 省立内科单，打印的备注 -->
              <tr class="page" v-if="formCode === 'H-000010-WHJ-0021'" style="font-size:14px;">
                <td colspan="24" style="text-align: left;">
                  <div>
                    备注:1.神志:①清醒 ②嗜睡 ③昏睡 ④昏迷 ⑤意识模糊 ⑥谵妄
                  </div>
                  <div style="margin-left: 36px;">
                    2.管道护理:①宣教 ②评估患者依从性 ③有效固定 ④保持畅通 ⑤观察引流液 ⑥观察敷料 ⑦标识 ⑧压力调节 ⑨肢体约束
                  </div>
                  <div style="margin-left: 36px;">
                    3.皮肤:（1）皮肤良好 ①完好 ②伤口有渗液 ③伤口无渗液 ④湿疹 ⑤压疮
                  </div>
                  <div style="margin-left: 81px;">
                    （2）皮肤护理 ①使用气垫床 ②定时翻身（1/h） ③定时翻身（2/h） ④减压措施 ⑤伤口换药
                  </div>
                  <div style="margin-left: 36px;">
                    4.在相应项目空格内填写数值、序号或打“√”。
                  </div>
                  <div style="margin-left: 36px;">
                    5.单位:体温℃、脉搏 次/分、呼吸 次/分、血压 mmHg、血氧饱和度 %、出入量 ml、氧疗 升/分
                  </div>
                  <div style="margin-left: 36px;">
                    6.关注患者饮食、睡眠及心理状态等情况，有异常时，随后记录于“病情记录栏”。
                  </div>
                </td>
              </tr>

              <tr class="page" v-if="formCode === 'H-000010-WHJ-0021' || formCode === 'H-000010-WHJ-0024'">
                <td colspan="24" style="text-align: right;">
                  <span :style="formCode === 'H-000010-WHJ-0024' ? 'margin-top: 35px;display: inline-block;' : ''">护士长签字:<span style="width: 130px;display: inline-block;border-bottom: 1px solid #666666;text-align: center;">{{ nurseHeadName }}</span></span>
                  <span style="margin-left: 36px;" v-if="formCode === 'H-000010-WHJ-0021'">日期:<span style="width: 130px;display: inline-block;border-bottom: 1px solid #666666;text-align: center;"> </span></span>
                </td>
              </tr>

              <tr class="page" v-if="formCode !== 'H-000010-WHJ-0021' && formCode !== 'H-000010-WHJ-0024'">
                <td colspan="21">第{{index + 1}}页</td>
              </tr>

              <tr class="page" v-else>
                <td colspan="24" style="text-align: center;">第{{index + 1}}页/共{{ allNote[0].length }}页</td>
              </tr>
            </tbody>
          </table>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import formHeader from '../../../components/nrms/autoForm/header'
import { ApiNurseNotes, ApiAutoForm, GetNurseUserLeader } from '../../../api/nrms'
import printJS from 'print-js'

export default {
  name: 'nurse_notes_print',
  components: { formHeader },
  props: ['patient', 'formId', 'formCode', 'signFlag'],
  data () {
    return {
      loading: false,
      note_data: [],
      fixed_item: [],
      // 查询表单
      search_from: {
        deptId: '',
        patientId: '',
        formId: '',
        width: ''
      },
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      showAutoHead: false,

      table_header_level: 1,
      table_header: [],
      table_header_name: [],
      table_column: [],
      table_column_name: [],

      allNote: [],
      printSet: '', // 打印样式 横版或者竖版,
      formListObj: {},
      activeTabName: '',
      theadHeight: 0, // 表头高度
      // 2020-12-25 世博医院 formCode:H-000010-WHJ-0005: 脉搏/心率合并。 储存signId
      maiboXinlvItemId: '999999999',
      xinlvSignId: '',
      maiboSignId: '',
      xueyaSignId: '',
      nurseHeadName: ''
    }
  },
  created () {
    // 初始化
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.search_from.deptId = deptInfo.deptId
    this.search_from.deptName = deptInfo.deptName
    this.search_from.empName = empInfo.empName
    this.getUser()
  },
  methods: {
    // 获取护士长信息
    getUser () {
      let userType = 'nurseHead'

      GetNurseUserLeader(userType).then(res => {
        if (res && res[0]) {
          this.nurseHeadName = res[0].empName
        }
      })
    },
    getFormInfo () {
      ApiAutoForm.getFormDict({ formId: this.formId }).then((res) => {
        if (res.data === null) {
          this.$message.error('请先配置表单样式')
        } else {
          this.formListObj = res.data

          this.autoHead.tplData = this.patient || null
          this.autoHead.tplId = res.data.formCode || ''
          this.autoHead.formName = res.data.formName || ''
          this.autoHead.tplHtml = res.data.formStyle || ''
          this.autoHead.hospitalLogo = res.data.logoUrl || '/static/nams/unit_logo/logo.png'
          this.showAutoHead = true
          this.printSet = this.formatPrintSet(this.formListObj.printSet ? this.formListObj.printSet : 1)// 默认纵向打印
          this.getFixedItem()
        }
      })
    },
    // 获取表头thead的高度
    getAutoFormHeaderHeight () {
      this.$nextTick(() => {
        let height = this.$refs['autoFormHeaderRef' + this.formId].getBoundingClientRect().height
        height > 0 ? this.theadHeight = height : this.theadHeight = 0
      })
    },
    getFixedItem () {
      this.table_header_level = 1
      this.table_header = []
      this.table_header_name = []
      this.table_column = []
      this.table_column_name = []
      ApiNurseNotes.getFixedListItem({ formId: this.formId })
        .then(res => {
          let items = res.data || []

          // 首先处理层级关系，获取最大层级
          for (let i = 0; i < items.length; i++) {
            items[i].level = 1
            this.parseLevel(items[i])
          }

          this.table_header.push([])
          this.table_header_name.push([])

          // 2020-12-25 世博医院 危重记录单 formCode:H-000010-WHJ-0005
          // 如果心率和脉搏同时存在，则合并为一列显示， 心率和脉搏如果有子类忽略
          let index = null
          let index2 = null
          let insertIndex = null
          // 解析父类占列
          for (let i = 0; i < items.length; i++) {
            // 存储血压的signId
            if (items[i]['signItemFieldName'] === 'xueya') {
              this.xueyaSignId = items[i]['signId']
            }
            if ((items[i]['signItemFieldName'] === 'xinlv' || items[i]['signItemFieldName'] === 'maibo') && this.formCode === 'H-000010-WHJ-0005') {
              // 暂存心率和脉搏signId
              if (items[i]['signItemFieldName'] === 'xinlv') {
                this.xinlvSignId = items[i]['signId']
              }
              if (items[i]['signItemFieldName'] === 'maibo') {
                this.maiboSignId = items[i]['signId']
              }
              if (!index) {
                index = i
                insertIndex = this.table_column.length
              } else {
                index2 = i
              }
            } else if (items[i]['signItemFieldName'] === 'tiwen' || items[i]['signItemFieldName'] === 'tengtongdengji' || items[i]['signItemFieldName'] === 'xuetang' || items[i]['signItemFieldName'] === 'xueya') {
              // 带复测的、血糖不用处理子集

              items[i]['row'] = this.table_header_level - items[i]['level'] + 1
              this.table_column.push(items[i])
              this.table_column_name.push(items[i].signItemShowName)

              this.table_header[0].push(items[i])
              this.table_header_name[0].push(items[i].signItemShowName)
            } else {
              if (items[i].childrenSignItem && items[i].childrenSignItem.length > 0) {
                items[i]['col'] = 0
                items[i]['row'] = 1
                this.parseCol(items[i], 1)
              } else {
                items[i]['row'] = this.table_header_level - items[i]['level'] + 1
                this.table_column.push(items[i])
                this.table_column_name.push(items[i].signItemShowName)
              }

              this.table_header[0].push(items[i])
              this.table_header_name[0].push(items[i].signItemShowName)
            }
          }

          // 心率和脉搏同时存在时创建一个新的体征项（心率脉搏合并的）
          if (index && index2) {
            let id = []
            let signId = []
            let name = []
            let field = []
            let newItem = null
            if (items[index]) {
              // 原来的不显示在列表中
              items[index]['hidden'] = 1
              newItem = JSON.parse(JSON.stringify(items[index]))

              id.push(items[index]['id'])
              signId.push(items[index]['signId'])
              name.push(items[index]['signItemShowName'])
              field.push(items[index]['signItemFieldName'])
            }
            if (items[index2]) {
              items[index2]['hidden'] = 1
              if (!newItem) newItem = JSON.parse(JSON.stringify(items[index]))

              id.push(items[index]['id'])
              signId.push(items[index]['signId'])
              name.push(items[index2]['signItemShowName'])
              field.push(items[index]['signItemFieldName'])
            }
            newItem['hidden'] = 0
            newItem['id'] = id.join('/')
            newItem['signId'] = this.maiboXinlvItemId
            newItem['row'] = this.table_header_level - items[index]['level'] + 1
            newItem['signItemShowName'] = name.join('/')
            newItem['signItemFieldName'] = field.join('/')

            // 插入新的合并体征项
            this.table_column.splice(insertIndex, 0, newItem)
            this.table_column_name.splice(insertIndex, 0, newItem.signItemShowName)

            this.table_header[0].splice(insertIndex, 0, newItem)
            this.table_header_name[0].splice(insertIndex, 0, newItem.signItemShowName)
          }

          this.mergeItem()
          this.getAutoFormHeaderHeight()
          this.getNoteData()
        }).catch(err => {
          this.$message.error(err.message)
        })
    },
    parseLevel (parent) {
      if (parent.childrenSignItem.length > 0) {
        for (let i = 0; i < parent.childrenSignItem.length; i++) {
          let item = parent.childrenSignItem[i]
          item.level = parent.level + 1
          // 最深的一层子类的级别就是表头总行数
          this.table_header_level = parent.level + 1
          this.parseLevel(item)
        }
      }
    },
    parseCol (items, index) {
      if (!this.table_header[index]) this.table_header[index] = []
      if (!this.table_header_name[index]) this.table_header_name[index] = []

      for (let i = 0; i < items.childrenSignItem.length; i++) {
        let _item = items.childrenSignItem[i]
        _item['col'] = 0
        if (_item.childrenSignItem && _item.childrenSignItem.length > 0) {
          _item['row'] = 1

          this.parseCol(_item, index + 1)
        } else {
          _item['row'] = this.table_header_level - _item['level'] + 1

          this.table_column.push(_item)
          this.table_column_name.push(_item.signItemShowName)
        }

        items['col'] = items['col'] + (_item['col'] ? _item['col'] - 1 : 0) + 1
        this.table_header[index].push(items.childrenSignItem[i])
        this.table_header_name[index].push(items.childrenSignItem[i].signItemShowName)
      }
      return items.childrenSignItem.length
    },
    mergeItem () {
      let left = []
      if (this.formCode === 'H-000010-WHJ-0021') {
        left = [{
          fixed: true,
          signItemFieldName: 'recordDateDay',
          signItemShowName: '日期',
          width: '80px',
          row: this.table_header_level
        },
        {
          fixed: true,
          signItemFieldName: 'recordDateTime',
          signItemShowName: '时间',
          width: '80px',
          row: this.table_header_level
        }]
      } else {
        left = [{
          fixed: true,
          signItemFieldName: 'recordDate',
          signItemShowName: '时间',
          width: '80px',
          row: this.table_header_level
        }]
      }

      let extendDoList = this.formListObj.formDictExtendDoList || []
      let _width = this.formListObj.formWidth ? this.formListObj.formWidth + 'px' : 'auto'
      let conditionArr = []
      extendDoList.forEach(v => {
        conditionArr.push({
          fixed: true,
          signItemFieldName: 'conditionJson',
          itemId: v.id,
          signItemShowName: v.projectName,
          width: _width,
          row: this.table_header_level
        })
      })
      let right = []
      // 审签按钮开启状态显示护士签名和护士长签名，未开启状态显示护士签名和手签
      if (this.signFlag) {
        if (this.formCode === 'H-000010-WHJ-0021' || this.formCode === 'H-000010-WHJ-0022' || this.formCode === 'H-000010-WHJ-0024') {
          right = [{
            fixed: true,
            signItemFieldName: 'nursingAutograph',
            signItemShowName: '护士签名',
            width: '75px',
            row: this.table_header_level
          }]
        } else {
          right = [{
            fixed: true,
            signItemFieldName: 'nursingAutograph',
            signItemShowName: '护士签名',
            width: '75px',
            row: this.table_header_level
          }, {
            fixed: true,
            signItemFieldName: 'leaderAutograph',
            signItemShowName: '护士长签名',
            width: '75px',
            row: this.table_header_level
          }]
        }
      } else {
        if (this.formCode === 'H-000010-WHJ-0021' || this.formCode === 'H-000010-WHJ-0022' || this.formCode === 'H-000010-WHJ-0024') {
          right = [{
            fixed: true,
            signItemFieldName: 'nursingAutograph',
            signItemShowName: '护士签名',
            width: '75px',
            row: this.table_header_level
          }]
        } else {
          right = [{
            fixed: true,
            signItemFieldName: 'nursingAutograph',
            signItemShowName: '护士签名',
            width: '75px',
            row: this.table_header_level
          }, {
            fixed: true,
            signItemFieldName: 'handAutograph',
            signItemShowName: '手签',
            width: '75px',
            row: this.table_header_level
          }]
        }
      }

      // fixedTableHeader字段用于临时存储查询的体征项
      let fixedTableHeader = this.table_header[0]

      this.table_header[0] = [...left, ...this.table_header[0], ...conditionArr, ...right]

      this.table_column = [...left, ...this.table_column, ...conditionArr, ...right]

      // 此处逻辑为:如果应用了体征项，那么打印的时候除了体征项之外condition的那些列的宽度采用数据库设置的formWidth的值
      if (conditionArr.length === 0) {
        return false
      } else {
        //  -----+ 820需要处理   减去几个配置项*6padding
        let noSignWidth = parseInt((820 - (6 * conditionArr.length)) / conditionArr.length)
        // 防止出现没有应用配置项，宽度为0-6 出现负数情况
        let signWidth = parseInt(_width.substring(0, _width.length - 2) - 6) >= 0 ? parseInt(_width.substring(0, _width.length - 2) - 6) : 0// 设置的宽度减去padding6px
        let printWidth = fixedTableHeader.length === 0 ? noSignWidth : signWidth

        this.search_from.width = printWidth
      }
    },
    getNoteData () {
      this.note_data = []
      ApiNurseNotes.selectAll(this.search_from).then((res) => {
        if (!res.data || res.data.length <= 0) {
          this.$message.error('该患者没有数据可以打印！')
          return false
        }
        this.note_data = this.parseNoteData2(res.data)

        this.$nextTick(function () {
          this.printPreview()
        })
      })
    },
    parseNoteData2 (noteList) {
      let _p = 1
      // 省立==内科护理单因为有备注，所以每页显示的数据少
      if (this.formCode === 'H-000010-WHJ-0021') {
        _p = 4
      }
      const pageSize = Math.floor((648 - 55 - this.theadHeight) / 30) - _p // (A4横向总高-40margin - header高) / 30 - 1 (分页行)
      let allNote = []
      let pageNote = []
      let curPage = []

      // 2020-12-25 世博医院 formCode:H-000010-WHJ-0005
      // 兼容出入量可以添加多条，先解析处理然后分页 length > 1的作为新的行插入table
      let newNoteList = []
      for (let i = 0; i < noteList.length; i++) {
        let note = noteList[i]

        if (note.extendList) {
          let ob = {}
          let maxLen = 1
          let isArrItem = {}
          let xinlv = null
          let maibo = null
          let xueya = []
          note.extendList.forEach(e => {
            if (e.itemValueArr) e.itemValue = e.itemValueArr[0]
            if (e.itemId === this.xinlvSignId) {
              xinlv = e
            }
            if (e.itemId === this.maiboSignId) {
              maibo = e
            }
            // 处理血压显示（收缩压/舒张压）
            if (e.parentId === this.xueyaSignId) {
              xueya.push(e)
            }
            ob[e.itemId] = e
            if (e.itemValueArr && e.itemValueArr.length > 1) {
              if (e.itemValueArr.length > maxLen) maxLen = e.itemValueArr.length
              isArrItem[e.itemId] = e
            }
          })
          if (xinlv && maibo) {
            let value = []
            xinlv.itemValue && value.push(xinlv.itemValue)
            maibo.itemValue && value.push(maibo.itemValue)
            ob[this.maiboXinlvItemId] = {
              itemId: this.maiboXinlvItemId,
              itemValue: value.join('/')
            }
          }

          // 处理血压显示（收缩压/舒张压）
          let value = ''
          if (xueya.length === 1) {
            if (xueya[0].itemName.indexOf('收') > -1) {
              value = xueya[0].itemValue + '/'
            } else {
              value = '/' + xueya[0].itemValue
            }
          } else if (xueya.length === 2) {
            if (xueya[0].itemName.indexOf('收') > -1) {
              value = xueya[0].itemValue + '/' + xueya[1].itemValue
            } else if (xueya[1].itemName.indexOf('收') > -1) {
              value = xueya[1].itemValue + '/' + xueya[0].itemValue
            }
          }

          ob[this.xueyaSignId] = {
            itemId: this.xueyaSignId,
            itemValue: value
          }

          note.extendList = ob
          newNoteList.push(note)

          // 2020-12-25 世博医院 formCode:H-000010-WHJ-0005
          // length > 1的作为新的行插入table
          if (maxLen > 1) {
            for (let i = 1; i < maxLen; i++) {
              let extendList = {}
              for (let p in isArrItem) {
                if (isArrItem[p]['itemValueArr'] && isArrItem[p]['itemValueArr'][i]) {
                  extendList[p] = {
                    itemName: isArrItem[p]['itemName'],
                    itemValue: isArrItem[p]['itemValueArr'][i]
                  }
                }
              }

              if (JSON.stringify(extendList) !== '{}') {
                newNoteList.push({
                  recordId: note.recordId + i,
                  shiboExtend: true,
                  extendList: extendList
                })
              }
            }
          }
        } else {
          newNoteList.push(note)
        }
      }

      // 分页处理
      for (let i = 0; i < newNoteList.length; i++) {
        let note = newNoteList[i]
        // 防止文字溢出单元格，护士姓名简单过滤（超过六个字的直接抛弃其他文字）
        note.nursingAutograph = note.nursingAutograph ? note.nursingAutograph.substring(0, 6) : ''
        note.userName = note.userName ? note.userName.substring(0, 6) : ''
        note.leaderAutograph = note.leaderAutograph ? note.leaderAutograph.substring(0, 6) : ''
        note.conditionJson = note.conditionJson ? JSON.parse(note.conditionJson) : {}

        // 处理生key-value形式  列表循环好处比对
        // 有世博的上边的逻辑，这里就暂时不用了
        // if (note.extendList) {
        //   let ob = {}
        //   note.extendList.forEach(e => {
        //     ob[e.itemId] = e
        //   })
        //   note.extendList = ob
        // }

        // 换页
        if (i !== 0 && note.skipPage) {
          if (curPage.length > 0) {
            pageNote.push(this.fillBlankLine(pageSize, curPage))
          }
          allNote.push(pageNote)
          curPage = []
          pageNote = []
        }

        curPage.push(note)

        // 满一页
        if (curPage.length % pageSize === 0) {
          pageNote.push(curPage)
          curPage = []
        }
      }
      // 最后一页未达条件的
      if (curPage.length > 0) {
        pageNote.push(this.fillBlankLine(pageSize, curPage))
      }
      if (pageNote.length > 0) {
        allNote.push(pageNote)
      }

      this.allNote = allNote
    },
    fillBlankLine (size, data) {
      let len = size - data.length
      for (let i = 0; i < len; i++) {
        data.push({ isEmpty: true })
      }
      return data
    },
    showPrintPreview () {
      this.search_from.patientId = this.patient.patientId
      this.search_from.formId = this.formCode // 此处定为传formCode查询，还是用formId的title
      this.getFormInfo()
    },
    // 格式化打印方式
    formatPrintSet (_printSet) {
      switch (_printSet) {
        case 1:
          return 'portrait'
        case 2:
          return 'landscape'
        default:
          return 'portrait'
      }
    },
    printPreview () {
      const style =
          `@charset "UTF-8";
          @media print {
            .page + tr td {
              border-top: none;
            }
          }
          @page { size: ${this.printSet}; margin:0 auto;}
          table {
            width: 100%;
            text-align: center;
            border-collapse: collapse;
            border: none;
          }
          table td {
            padding: 0;
            margin: 0;
            border: 0;
            box-sizing: border-box;
            word-break: break-all;
          }
          table thead .header td {
            border: 1px solid #525252;
            padding: 5px 0;
          }
          table thead td.border_none {
            border: none;
          }

          .nurse_note_print_container {
            line-height: 1;
            width: 1070px;
            font-size: 12px;
            margin: 20px auto;
            color: #333;
          }

          .patient_basic {
            display: flex;
            justify-content: space-around;
            align-items: center;
          }

          /* 斜线svg */
          .date_title, .sign_name {
            display: block;
            position: relative;
          }
          .date_title svg, .sign_name svg {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
          .date_title line, .sign_name line {
            stroke: #525252;
            stroke-width: 1;
          }
          .date_title .text, .sign_name .text {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .date_title .text span:first-child, .sign_name .text span:first-child {
            position: absolute;
          }
          .date_title .text span:last-child, .sign_name .text span:last-child {
            position: absolute;
          }

          .page {
            border: 0;
          }

          .print-table {page-break-after: always;margin-top: 20px;}
          .page td {
            text-align: right;
            //padding: 5px;
            height: 38px;
          }

          /* 日期表头 */
          .date_title {
            height: 51px;
            width: 80px;
          }
          .date_title .text span:first-child {
            top: 5px;
            left: 5px;
          }
          .date_title .text span:last-child {
            bottom: 5px;
            right: 5px;
          }

          .sign_name {
            display: block;
            position: relative;
            height: 100%;
            width: 100%;
          }
          .sign_name .text span:first-child {
            top: 2px;
            left: 1px;
            height: 20px;
            width: 65%;
          }
          .sign_name .text span:last-child {
            bottom: 2px;
            right: 1px;
            height: 20px;
            width: 65%;
          }
          .sign_name .line {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }

          .line_table td {
            vertical-align: middle;
            box-sizing: border-box;
            border: 1px solid #525252;
          }
          .line_table .text_line_height {
            padding: 0 3px;
            line-height: 40px;
            text-align: left;
          }
          .line_table .empty {
            line-height: 40px;
          }
          .double-line {
            position: relative;
            padding-bottom: 3px;
            display: inline-block;
          }
          .double-line:before {
            content: " ";
            position: absolute;
            width: 100%;
            height: 0;
            border-bottom: 1px solid;
            left: 0;
            bottom: 2px;
          }
          .double-line:after {
            content: " ";
            position: absolute;
            width: 100%;
            height: 0;
            border-bottom: 1px solid;
            left: 0;
            bottom: 0;
          }`

      printJS({
        printable: 'nurse_note_print_container' + this.formId,
        type: 'html',
        style: style,
        scanStyles: false
      })
    },
    parseDateTime (val, type) {
      if (val) {
        let _time = ''
        if (type === 'time') {
          _time = val.split(' ')[0] + '<br/>' + val.split(' ')[1]
        } else if (type === 'day') {
          _time = val.split(' ')[0]
        } else {
          _time = val.split(' ')[1]
        }
        return _time
      }
      return '&nbsp;'
    }
  },

  watch: {
    // 'formId': {
    //   handler: function (val) {
    //   alert(val)
    //     this.search_from.formId = val
    //     this.getFormInfo()
    //     this.getFixedItem()
    //     this.getNoteData()
    //   },
    //   immediate: true
    // },
    'patient' (val) {
      this.autoHead.tplData = val || null
      this.search_from.patientId = val.patientId
    }
  }

}
</script>

<style lang="scss" type="text/scss" scoped>
  $border-color: #525252;
  $text-color: #333;
  table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    border: none;

    td {
      padding: 0;
      margin: 0;
      border: 0;
      box-sizing: border-box;
      word-break: break-all;
    }

    thead {
      .header td {
        border: 1px solid $border-color;
        padding: 3px 0;
      }

      td.border_none {
        border: none
      }
    }
  }

  .nurse_note_print_container {
    line-height: 1;
    width: 1070px;
    font-size: 12px;
    margin: 20px auto;
    color: $text-color;
  }

  .patient_basic {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  /* 斜线svg */
  .date_title, .sign_name {
    display: block;
    position: relative;

    svg {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    line {
      stroke: $border-color;
      stroke-width: 1
    }

    .text {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      span:first-child {
        position: absolute;
      }

      span:last-child {
        position: absolute;
      }
    }
  }

  .page {
    border: 0;

    td {
      text-align: right;
      height: 35px;
    }
  }

  /* 日期表头 */
  .date_title {
    height: 51px;
    width: 80px;

    .text {
      span:first-child {
        top: 5px;
        left: 5px;
      }

      span:last-child {
        bottom: 5px;
        right: 5px;
      }
    }
  }

  //签名列
  .sign_name {
    display: block;
    position: relative;
    height: 100%;
    width: 100%;

    .text {
      span:first-child {
        top: 0;
        left: 1px;
        height: 20px;
        line-height: 20px;
        width: 65%;
      }

      span:last-child {
        line-height: 20px;
        bottom: 0;
        right: 1px;
        height: 20px;
        width: 65%;
      }
    }

    .line {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  .line_table {
    td {
      vertical-align: middle;
      box-sizing: border-box;
      border: 1px solid $border-color;
    }

    .text_line_height {
      padding: 0 3px;
      line-height: 40px;
      text-align: left;
    }

    .empty {
      line-height: 40px;
    }
  }

  .double-line {
    position: relative;
    padding-bottom: 3px;
    display: inline-block;

    &:before {
      content: " ";
      position: absolute;
      width: 100%;
      height: 0;
      border-bottom: 1px solid;
      left: 0;
      bottom: 2px;
    }

    &:after {
      content: " ";
      position: absolute;
      width: 100%;
      height: 0;
      border-bottom: 1px solid;
      left: 0;
      bottom: 0;
    }
  }
</style>
