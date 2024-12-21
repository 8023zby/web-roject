<template>
  <layout>
    <div slot="title">{{ form_type_text }}患者</div>
    <div slot="main"
         class="add-from">
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               label-width="100px"
               class="form-main-center"
               label-suffix=":">
        <el-form-item label="床号" prop="bedNo">
          <el-select v-model="ruleForm.bedNo"
                     placeholder="请选择"
                     @change="changePatient"
                     v-uni="'hushijiaoban_edit_changebedNo'"
                     :disabled="form_type_text === '编辑'">
            <el-option v-for="p in patients"
                       :key="p.bedNo"
                       :label="p.bedNo + '床'"
                       :value="p.bedNo"/>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名"
                      prop="patientName">
          <el-input v-model="ruleForm.patientName" disabled/>
        </el-form-item>
        <el-form-item label="交班原因"
                      prop="shiftReason">
          <el-select v-model="ruleForm.shiftReason"
                     placeholder="请选择"
                     clearable multiple>
            <el-option v-for="s in shift_reason"
                       :label="s.shiftReasonName"
                       :value="s.shiftReasonName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述"
                      prop="shiftText">
          <el-input type="textarea"
                    v-model="ruleForm.shiftText"
                    :rows="7"
                    maxlength="500"
                    show-word-limit/>
          <div class="tool-bar"
               style="padding-left: 0">
            <el-button type="primary"
                     v-uni="'hushijiaoban_edit_yyhljl'"
                       @click="nurseNotesWin">引用护理记录
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button @click="close" v-uni="'hushijiaoban_edit_cancel'">
        取消
      </el-button>
      <el-button type="primary" @click="submitForm" v-uni="'hushijiaoban_edit_save'">
        保存
      </el-button>
    </div>

    <!-- 护理记录 -->
    <el-dialog title="护理记录引用"
               :showClose="false"
               width="782px"
               :stripe="true"
               :visible.sync="nurseNotesQuoteVisible">
      <el-table default-expand-all
                ref="nurseNotesTable"
                :data="nurse_notes_data"
                @row-click="notesClick"
                @selection-change="handleNotesSelectionChange"
                @select-all="checkAll"
                :header-cell-style="headerCellStyle"
                :cell-style="cellStyle"
                :header-row-class-name="cellClassName"
                highlight-current-row
                row-key="id"
                height="290px">
        <!--el-table-column type="selection" width="50"/-->

        <!-- <el-table-column type="index"
                         align="center"
                         label="序号"
                         width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.children">
              {{calIndex(scope)}}
            </template>
          </template>
        </el-table-column> -->

        <el-table-column prop="dateTime"
                         label="记录时间"
                         align="center"
                         min-width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.children">
              <div style="float: left;width: 75%;">
                <div style="text-align: center;">{{scope.row.dateTime.split(' ')[0]}}</div>
                <div style="text-align: center;">{{scope.row.dateTime.split(' ')[1]}}</div>
              </div>
            </template>
          </template>
        </el-table-column>

        <el-table-column type="selection" width="50" style="text-overflow: clip !important;"/>

        <el-table-column prop="itemName"
                         label="项目名称"
                         show-overflow-tooltip
                         min-width="100">
          <template slot-scope="scope">
                        <span :id="'name-' + scope.row.id"
                              class="name-blue-none">{{scope.row.itemName}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="itemValue"
                         label="项目内容"
                         show-overflow-tooltip
                         align="center"
                         min-width="100">
          <template slot-scope="scope">
            {{scope.row.itemValue}}{{scope.row.itemUnit ? scope.row.itemUnit : ''}}
          </template>
        </el-table-column>

      </el-table>

      <div class="nurseNotesQuote-textarea">
        <el-input type="textarea"
                  :rows="5"
                  v-model="notes_quote_text"
                  placeholder="请选择"/>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'hushijiaoban_edit_record_cancel'" @click="nurseNotesQuoteVisible = false">取消</el-button>
        <el-button  v-uni="'hushijiaoban_edit_record_save'" type="primary"
                   @click="addNurseNotesToDesc">确认
        </el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import layout from '../../../components/bnms/layout/edit'
import { shift_reason } from './config'
import { ApiNurseShift, ApiNurseNotes, ApiAutoForm } from '../../../api/bnms/index'
import moment from 'moment'
import { ApiShiftReason } from '../../../api/nrms'

export default {
  name: 'nurse_shift_patient_add',
  components: { layout },
  data () {
    return {
      form_type_text: '',
      shift_reason: [],
      ruleForm: {
        recordId: '',
        userId: '',
        bedNo: '',
        patientId: '',
        patientName: '',
        shiftReason: [],
        shiftText: '',
        sort: null,
        shiftReasonOld: []
      },
      rules: {
        bedNo: [
          { required: true, message: '请选择床号！', trigger: 'change' }
        ],
        patientName: [
          { required: true, message: '该床位没有患者！', trigger: 'blur,change' }
        ],
        shiftReason: [
          { required: true, message: '请选择交班原因！', trigger: 'change' }
        ],
        shiftText: [
          { required: true, message: '请填写详细描述！', trigger: 'blur' },
          { min: 1, max: 500, message: '最多500个字符！', trigger: 'blur' }
        ]
      },
      nurseNotesQuoteVisible: false,
      nurse_notes_data: [],
      notes_multiple_selection: [],
      patients: [],
      deptInfo: {},
      orgInfo: {},
      demoList: [
        {
          'itemName': '病情',
          'itemValue': '的方式',
          'dateTime': '2020-05-11 08:09:00',
          'children': [
            {
              'itemName': null,
              'itemValue': null,
              'itemUnit': null,
              'dateTime': '2020-05-11 08:09:00'
            },
            {
              'itemName': '神志',
              'itemValue': '',
              'itemUnit': null,
              'dateTime': '2020-05-11 08:09:00'
            }
          ]
        },
        {
          'itemName': '病情',
          'itemValue': '',
          'dateTime': '2020-05-11 08:14:00',
          'children': [
            {
              'itemName': '出量项目性质',
              'itemValue': '',
              'itemUnit': null,
              'dateTime': '2020-05-11 08:14:00'
            }
          ]
        }
      ]
    }
  },
  props: ['shift', 'shiftPatient'],
  computed: {
    notes_quote_text () {
      // console.log(this.notes_multiple_selection);
      let obj = {}
      for (let i = 0; i < this.notes_multiple_selection.length; i++) {
        let _d = this.notes_multiple_selection[i]
        // console.log(_d);
        if (this.notes_multiple_selection[i].itemName === null || this.notes_multiple_selection[i].itemName === undefined) {
          this.notes_multiple_selection[i].itemName = ''
          _d.itemName = ''
        }

        if (this.notes_multiple_selection[i].itemValue === null || this.notes_multiple_selection[i].itemValue === undefined) {
          this.notes_multiple_selection[i].itemValue = ''
          _d.itemValue = ''
        }

        if (this.notes_multiple_selection[i].itemUnit === null || this.notes_multiple_selection[i].itemUnit === undefined) {
          this.notes_multiple_selection[i].itemUnit = ''
          _d.itemUnit = ''
        }

        if (!obj[_d['dateTime']]) obj[_d['dateTime']] = []
        obj[_d['dateTime']].push(_d['itemName'] + (_d['itemValue'] ? (':' + _d['itemValue']) : '') + (_d['itemUnit'] ? ('' + _d['itemUnit']) : ''))
      }
      let quote = ''
      for (let p in obj) {
        if (obj[p].length === 0) continue
        quote += p + ':' + obj[p].join(';') + ';'
      }
      return quote
    }
  },
  watch: {
    'ruleForm.bedNo' () {
      this.$refs.ruleForm.clearValidate('patientName')
    }
  },
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
    this.ruleForm.userId = empInfo.empId || ''
    this.ruleForm.shiftRecordId = this.shift.shiftRecordId
    this.form_type_text = this.shiftPatient['shiftRecordId'] ? '编辑' : '添加'
    if (this.shiftPatient['shiftRecordId']) {
      Object.assign(this.ruleForm, this.shiftPatient)
      if (this.ruleForm.shiftReason === null || this.ruleForm.shiftReason === '' ||
          this.ruleForm.shiftReason === undefined) {
      } else {
        this.ruleForm.shiftReason = this.ruleForm.shiftReason.split(',')
      }
      this.ruleForm.sort = this.shift.sort
      // 先缓存历史交班原因
      this.ruleForm.shiftReasonOld = this.ruleForm.shiftReason || []
    }
    this.getPatients()
    this.getShiftReason()
  },
  methods: {
    /* 获取交班原因 */
    async getShiftReason () {
      try {
        let res = await ApiAutoForm.getFormDictByType({ formType: '12' })
        if (!res.data) {
          return this.$message.error('请先配置交班报告表单')
        }
        let res2 = await ApiShiftReason.get({ formId: res.data.formId })
        if (!res2.data || !res2.data.length) {
          return this.$message.error('请先配置交班原因')
        }
        this.shift_reason = res2.data
      } catch (error) {
      }
    },
    calIndex (scope) {
      let row = scope.row
      let id = row.id
      let idArr = id.split('-')
      return parseInt(idArr[1]) + 1
    },
    headerCellStyle ({ row, column, rowIndex, columnIndex }) {
      return 'background: #F8F8F8;color: #333333;font-size: 16px;font-weight: 300;height: 48px;border-bottom: none;'
    },
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let name = ''
      if (columnIndex === 2) {
        name = 'checkbox-special'
      }
      return name
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      let select = ''
      let textOverflow = ''
      if (columnIndex === 2) {
        // select = 'padding: 0 0 0 22px;'
      }
      if (columnIndex === 2) {
        textOverflow = 'text-overflow: clip !important;'
      }
      let id = row.id
      let type = id.split('-')[3]
      let comm = 'color: #666666;font-size: 14px;'
      if (type === 'child') {
        return comm + 'border: none;' + select + textOverflow
      } else {
        return comm + 'border-bottom: none;border-top: 1px solid #EBEEF5;' + select + textOverflow
      }
    },
    getPatients () {
      ApiNurseShift.selectPatient({ deptId: this.deptInfo.deptId }).then(res => {
        this.patients = res.data || []
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    changePatient (val) {
      for (let i = 0; i < this.patients.length; i++) {
        let _d = this.patients[i]
        if (val === _d['bedNo']) {
          this.ruleForm.patientId = _d['patientId']
          this.ruleForm.patientName = _d['patientName']
          this.ruleForm.shiftText = _d['diagnosis']
          break
        }
      }
    },
    // 获取护理记录
    nurseNotesWin () {
      let time = this.shift.dutyTime.split(' - ')
      let date = this.shift.shiftTime
      let beginTime = date + ' ' + time[0] + ':00'
      let endTime = date + ' ' + time[1] + ':00'
      let _beginTime = new Date(beginTime).getTime()
      let _endTime = new Date(endTime).getTime()
      // 跨天的情况
      if (_endTime < _beginTime) {
        let __endTime = moment(_endTime).subtract(-1, 'days').format('YYYY-MM-DD')
        endTime = __endTime + ' ' + time[1] + ':00'
      }
      let formData = {
        orgId: this.orgInfo.orgId,
        deptId: this.deptInfo.deptId,
        patientId: this.ruleForm.patientId,
        beginTime: beginTime,
        endTime: endTime
      }
      this.nurse_notes_data = []
      ApiNurseNotes.select(formData)
        .then(res => {
          let demoList =
              [
                {
                  'itemName': '病情1',
                  'itemValue': 'value1',
                  'dateTime': '2020-05-11 08:09:00',
                  'children': [
                    {
                      'itemName': '1-1',
                      'itemValue': '1-1',
                      'itemUnit': '1-1',
                      'dateTime': '2020-05-11 08:09:00'
                    },
                    {
                      'itemName': '1-2',
                      'itemValue': '1-2',
                      'itemUnit': '1-2',
                      'dateTime': '2020-05-11 08:09:00'
                    }
                  ]
                },
                {
                  'itemName': '病情2',
                  'itemValue': 'value2',
                  'dateTime': '2020-05-11 08:14:00',
                  'children': [
                    {
                      'itemName': '2-2',
                      'itemValue': '2-2',
                      'itemUnit': '2-2',
                      'dateTime': '2020-05-11 08:14:00'
                    }
                  ]
                }
              ]
          let list = res.data || []
          let conn = 100000
          if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              list[i].id = 'r-' + i + '-' + Math.round(Math.random() * conn) + '-parent'
              let itemValueFather = list[i].itemValue
              if (itemValueFather === undefined || itemValueFather === null || itemValueFather === '') {

              } else {
                if (typeof itemValueFather === 'object') {
                  let str = ''
                  for (let content in itemValueFather) {
                    str += itemValueFather[content] + ','
                  }
                  list[i].itemValue = str.substring(0, str.length - 1)
                }
              }
              if (list[i].children === undefined || list[i].children === null || list[i].children === '') {

              } else {
                for (let j = 0; j < list[i].children.length; j++) {
                  let itemValueChild = list[i].children[j].itemValue
                  if (itemValueChild === undefined || itemValueChild === null || itemValueChild === '') {

                  } else {
                    if (typeof itemValueChild === 'object') {
                      let str = ''
                      for (let content in itemValueChild) {
                        str += itemValueChild[content] + ','
                      }
                      list[i].children[j].itemValue = str.substring(0, str.length - 1)
                    }
                  }
                  list[i].children[j].id = 'r-' + j + '-' + Math.round(Math.random() * conn) + '-child'
                }
              }
              this.nurse_notes_data.push(list[i])
            }
            this.nurseNotesQuoteVisible = true
          } else {
            this.$message.warning('该患者没有护理记录信息！')
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    notesClick (row) {
      this.$refs.nurseNotesTable.toggleRowSelection(row)
    },
    // 单独选择
    handleNotesSelectionChange (val) {
      $('.name-blue').removeClass('name-blue')
      this.notes_multiple_selection = val
      for (let i = 0; i < val.length; i++) {
        let item = val[i]
        let id = item.id
        let nameId = 'name-' + id
        $('#' + nameId).addClass('name-blue')
      }
    },
    // 全选
    checkAll (selection) {
      let arr = []
      let childArr = []
      for (let i = 0; i < this.nurse_notes_data.length; i++) {
        let item = this.nurse_notes_data[i]
        if (item.children) {
          arr.push(item)
          for (let j = 0; j < item.children.length; j++) {
            let itemChildren = item.children[j]
            arr.push(itemChildren)
            childArr.push(itemChildren)
          }
        } else {
          arr.push(item)
        }
      }
      let dataLength = arr.length// 数据总长度
      let childLength = childArr.length// 孩子长度
      console.log(selection)
      let rows = this.$refs.nurseNotesTable.selection// 获取表格中所有选中的数据
      console.log(rows)
      // if(rows.length==0) rows = this.nurse_notes_data;
      console.log('notes_multiple_selection:' + this.notes_multiple_selection.length)
      console.log('rowsLength:' + rows.length)
      console.log('dataLength:' + dataLength)
      console.log('childLength:' + childLength)
      if (this.notes_multiple_selection.length !== (dataLength - childLength)) {
        console.log('-- -- clear')
        for (let row of rows) {
          this.$refs.nurseNotesTable.clearSelection()
          // for (let row of rows) {
          //   if (row.children && row.children.length > 0) {
          //     this.clearRow(row.children);
          //   }
          // }
          this.notes_multiple_selection = []
        }
      } else {
        console.log('-- -- all')
        for (let row of rows) {
          if (row.children && row.children.length > 0) {
            this.checkRow(row.children)
          }
        }
        this.notes_multiple_selection = JSON.parse(JSON.stringify(arr))
      }
    },
    clearRow (data) {
      Array.from(data).forEach(row => {
        row.isCheck = false// 给这行数据设置一个选中字段为false
        this.$refs.nurseNotesTable.toggleRowSelection(row, false)
        if (row.children) { // 有子集就递归  没子集了就不循环了
          this.clearRow(row.children)
        }
      })
    },
    //
    checkRow (data) {
      Array.from(data).forEach(row => {
        row.isCheck = true// 选中是字段值为true
        this.$refs.nurseNotesTable.toggleRowSelection(row, true)
        if (row.children) {
          this.checkRow(row.children)
        }
      })
    },
    addNurseNotesToDesc () {
      if (this.ruleForm.shiftText === ' ' ||
          this.ruleForm.shiftText === null ||
          this.ruleForm.shiftText === undefined) {
        this.ruleForm.shiftText = ''
      }
      this.nurseNotesQuoteVisible = false
      // this.ruleForm.shiftText = this.notes_quote_text
      this.ruleForm.shiftText = this.ruleForm.shiftText + this.notes_quote_text
      this.notes_multiple_selection = []
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let formData = JSON.parse(JSON.stringify(this.ruleForm))
          formData.shiftReason = formData.shiftReason.join(',')
          // 比较新旧交班
          let oldR = formData.shiftReasonOld
          let newR = formData.shiftReason
          let ban = []
          for (let i = 0; i < oldR.length; i++) {
            if (!newR.includes(oldR[i])) {
              ban.push(oldR[i])
            }
          }
          formData.remarks = ban.join(',')
          formData.deptId = this.deptInfo.deptId
          if (this.form_type_text === '添加') {
            formData.sort = this.shift.sort
          }
          ApiNurseShift.saveChild(formData)
            .then(() => {
              this.$message.success('保存正确！')
              this.close()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close () {
      this.$emit('option-changed', 'list', this.shift)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";

  /deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
  }

  /deep/ .el-tag--mini {
    height: 28px;
    padding: 0 10px;
    line-height: 28px;
  }

  /deep/ .el-icon-close {

  }

  /deep/ .el-dialog__wrapper .el-dialog__body {
    padding: 0;
  }

  .nurseNotesQuote-textarea {
    padding: 30px 12px 25px 12px;

    /deep/ textarea {
      border-radius: 2px;
      border: 1px solid #EBEEF5;
    }
  }

  /deep/ .el-icon-arrow-right:hover, .el-icon-arrow-right:active {
    color: #1E87F0;
  }

  /deep/ .el-icon-arrow-right:before {
    content: '\E6E1';
  }

  /deep/ .el-table__expand-icon--expanded {
    transform: rotate(180deg);
  }

  /deep/ .el-table__expand-icon {
    float: left;
    top: 12px;
    left: -12px;
  }

  /deep/ .gutter {
    background: rgb(248, 248, 248);
  }

  /deep/ .el-dialog__header {
    border-bottom: 1px solid #EBEEF5;
  }

  .name-blue {
    color: #1e87f0 !important;
  }

  .name-blue-none {
    color: #666666;
  }
</style>
