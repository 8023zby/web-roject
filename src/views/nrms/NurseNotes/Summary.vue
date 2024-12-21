<template>
  <!--
    2020-12-25
    formCode:H-000010-WHJ-0005
    山东淄博世博医院定制，只用于危重护理记录单 (如果用于其他表单需要确认)
    对于总结和小结传参和处理参数都是定制的
    入量/出量体征项只能满足两级 : 入量-名称 入量-量
  -->
  <el-dialog
    :title="type === 'big' ? '总结' : '小结'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="false"
    width="490px"
  >
    <el-form
      ref="saveForm"
      :model="saveForm"
      label-width="120px"
      label-suffix=":"
    >
      <el-form-item label="时间">
        <el-date-picker
          v-model="saveForm.recordDate"
          :clearable="false"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="结量开始时间">
        <el-date-picker
          v-model="saveForm.startDate"
          :clearable="false"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder=""
          @change="changeSummaryDataTime"
        />
      </el-form-item>
      <el-form-item label="结量结束时间">
        <el-date-picker
          v-model="saveForm.endDate"
          :clearable="false"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder=""
          @change="changeSummaryDataTime"
        />
      </el-form-item>
      <!-- 省立增加时间段下拉 -->
      <el-form-item v-if="formCode === 'H-000010-WHJ-0024'" label="时间段">
        <el-select
          v-model="saveForm.pointFlag"
          filterable
          clearable
          placeholder="请选择时间段"
        >
          <el-option
            v-for="(value,index) in timePart"
            :key="index"
            :label="value.label"
            :value="value.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="入量项目名称">
        <el-input
          v-model="saveForm.ruName"
          clearable
          maxlength="20"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="出量项目名称">
        <el-input
          v-model="saveForm.chuName"
          clearable
          maxlength="20"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>

    <el-button v-if="type === 'big'" type="warning" :loading="btnLoading" @click="insertTemp">插入体温单</el-button>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import { ApiNurseNotes } from '../../../api/nrms/index'

export default {
  name: 'Summary',
  props: {
    visible: Boolean,
    type: String,
    patientId: String,
    formId: String,
    // 入量项目
    ruSignItem: Object,
    // 出量项目
    chuSignItem: Object,
    // 详情数据
    detail: Object,
    formCode: String
  },
  data () {
    return {
      timePart: [
        {
          label: '24小时',
          value: '24小时'
        },
        {
          label: '23小时',
          value: '23小时'
        },
        {
          label: '22小时',
          value: '22小时'
        },
        {
          label: '21小时',
          value: '21小时'
        },
        {
          label: '20小时',
          value: '20小时'
        },
        {
          label: '19小时',
          value: '19小时'
        },
        {
          label: '18小时',
          value: '18小时'
        },
        {
          label: '17小时',
          value: '17小时'
        },
        {
          label: '16小时',
          value: '16小时'
        },
        {
          label: '15小时',
          value: '15小时'
        },
        {
          label: '14小时',
          value: '14小时'
        },
        {
          label: '13小时',
          value: '13小时'
        },
        {
          label: '12小时',
          value: '12小时'
        },
        {
          label: '11小时',
          value: '11小时'
        },
        {
          label: '10小时',
          value: '10小时'
        },
        {
          label: '09小时',
          value: '09小时'
        },
        {
          label: '08小时',
          value: '08小时'
        },
        {
          label: '07小时',
          value: '07小时'
        },
        {
          label: '06小时',
          value: '06小时'
        },
        {
          label: '05小时',
          value: '05小时'
        },
        {
          label: '04小时',
          value: '04小时'
        },
        {
          label: '03小时',
          value: '03小时'
        },
        {
          label: '02小时',
          value: '02小时'
        },
        {
          label: '01小时',
          value: '01小时'
        }
      ],
      btnLoading: false,
      saveForm: {
        patientId: '',
        deptId: '',
        formId: '',
        extendList: [
          { 'itemId': '8dd3439c97bd24f1df23ad96ce571809', 'itemValue': '', 'itemType': 2 },
          { 'itemId': '490547a48cb9dcd91d10b69e3d32d21c', 'itemValue': '入量小结', 'itemType': 1 },
          { 'itemId': '5e39be3f44be0ed2dacfbe8e8bb8c113', 'itemValue': '', 'itemType': 4 },
          { 'itemId': 'b3840e7eff546ff2bceeaf5e2aac6173', 'itemValue': '出量小结', 'itemType': 3 }
        ],
        startDate: '',
        endDate: '',
        recordId: '',
        recordDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        userName: '',
        chuName: (this.type === 'big' ? '总' : '小') + '结出量',
        ruName: (this.type === 'big' ? '总' : '小') + '结出量',
        // 1小结 2总结
        recordType: '',
        pointFlag: ''
      }
    }
  },
  watch: {
    type: {
      handler (val) {
        if (!this.detail.recordId) {
        }
      },
      immediate: true
    },
    detail: {
      handler (val) {
        if (val.recordId) {
          this.saveForm.extendList = {}

          Object.assign(this.saveForm, val)

          // 从详情中初始入量/出量 项目名称
          const ruItems = this.ruSignItem.childrenSignItem
          for (let i = 0; i < ruItems.length; i++) {
            const d = ruItems[i]
            if (!d['signItemUnit']) {
              const obj = this.saveForm.extendList[d['signId']]
              if (this.formCode === 'H-000010-WHJ-0024') { // 省立危重护理记录单，因为拼接上了时段，所以需要先处理掉
                this.saveForm.ruName = obj['itemValue'].substring(4, obj['itemValue'].length)
              } else {
                this.saveForm.ruName = obj['itemValue']
              }
            }
          }
          const chuItems = this.chuSignItem.childrenSignItem
          for (let i = 0; i < chuItems.length; i++) {
            const d = chuItems[i]
            if (!d['signItemUnit']) {
              const obj = this.saveForm.extendList[d['signId']]
              if (this.formCode === 'H-000010-WHJ-0024') { // 省立危重护理记录单，因为拼接上了时段，所以需要先处理掉
                this.saveForm.chuName = obj['itemValue'].substring(4, obj['itemValue'].length)
              } else {
                this.saveForm.chuName = obj['itemValue']
              }
            }
          }
        } else {
          this.saveForm.recordId = ''
          this.saveForm.chuName = (this.type === 'big' ? '总' : '小') + '结出量'
          this.saveForm.ruName = (this.type === 'big' ? '总' : '小') + '结入量'
          this.saveForm.recordType = this.type === 'big' ? '2' : '1'

          this.saveForm.recordDate = moment().format('YYYY-MM-DD HH:mm:ss')
          if (this.type === 'big') {
            this.saveForm.startDate = moment().subtract(1, 'day').format('YYYY-MM-DD') + ' 07:00:00'
            this.saveForm.endDate = moment().format('YYYY-MM-DD') + ' 07:00:00'
          } else {
            this.saveForm.startDate = moment().format('YYYY-MM-DD') + ' 07:00:00'
            this.saveForm.endDate = moment().format('YYYY-MM-DD') + ' 16:00:00'
          }
        }
      },
      immediate: true
    }
  },
  created () {
    const deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    const empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.saveForm.deptId = deptInfo.deptId || ''
    this.saveForm.userName = empInfo.empName || ''
    // 计算初始化时间间隔
    this.saveForm.pointFlag = this.calculatePointFlag(this.saveForm.startDate, this.saveForm.endDate)
  },
  methods: {
    changeSummaryDataTime () {
      this.saveForm.pointFlag = this.calculatePointFlag(this.saveForm.startDate, this.saveForm.endDate)

      this.$forceUpdate()
    },
    calculatePointFlag (startTime, endTime) {
      if (this.formCode === 'H-000010-WHJ-0024') { // 当是省立危重护理记录单的时候，才进行计算，拼接时间段
        const hours = Math.round(moment(endTime).diff(moment(startTime), 'hours', true))
        if (hours <= 0) {
          return ''
        } else if (hours >= 24) {
          return '24小时'
        } else {
          let pointFlag = ''
          this.timePart.map(item => {
            if (parseInt(item.value) === hours) {
              pointFlag = item.value
            }
          })
          return pointFlag
        }
      } else {
        return ''
      }
    },
    insertTemp () { // 插入体温单
    // 处理插入体温单的时间数据
      let _time = ''
      if (this.saveForm.pointFlag.indexOf('24小时') > -1) {
        _time = this.saveForm.pointFlag.replace('24小时', '')
      } else {
        _time = this.saveForm.pointFlag.replace('小时', 'h')
      }
      const _params = {
        'type': 3,
        'recordTime': this.saveForm.recordDate,
        'startTime': this.saveForm.startDate,
        'endTime': this.saveForm.endDate,
        'nurseName': this.saveForm.userName,
        'patientId': this.patientId,
        'pointFlag': _time,
        'deptId': this.saveForm.deptId,
        'formId': this.formId
      }
      ApiNurseNotes.insertTemp(_params).then((res) => {
        if (res.status === 200) {
          this.$message.success('保存正确！')
        } else {
          this.$message.warning(res.message)
        }
      }).catch(res => {
        this.$message.error(res.message)
      }).finally(() => {

      })
    },
    submit () {
      this.btnLoading = true

      const _saveForm = JSON.parse(JSON.stringify(this.saveForm))

      _saveForm.formId = this.formId
      _saveForm.patientId = this.patientId

      _saveForm.extendList = []
      // 处理入量/出量 只支持两级
      // itemType:1入量项目名 带单位2入量 3出量项目名 带单位4出量
      const ruItems = this.ruSignItem.childrenSignItem

      for (let i = 0; i < ruItems.length; i++) {
        const d = ruItems[i]
        const _j = {
          itemId: d['signId'],
          itemValue: d['signItemUnit'] ? '' : _saveForm.ruName,
          itemType: d['signItemUnit'] ? 2 : 1
        }
        if (this.formCode === 'H-000010-WHJ-0024') { // 省立危重护理记录单，因为拼接上了时段，所以需要先处理掉
          // 判断下如果带有 ==== 小时，先把小时处理掉
          if (_saveForm.ruName.indexOf('小时') > -1) {
            _saveForm.ruName = _saveForm.ruName.substring(4, _saveForm.ruName.length)
          }
        }
        _j.itemValue = d['signItemUnit'] ? '' : this.saveForm.pointFlag + _saveForm.ruName
        _saveForm.extendList.push(_j)
      }
      const chuItems = this.chuSignItem.childrenSignItem
      for (let i = 0; i < chuItems.length; i++) {
        const d = chuItems[i]
        const _j = {
          itemId: d['signId'],
          itemValue: d['signItemUnit'] ? '' : _saveForm.chuName,
          itemType: d['signItemUnit'] ? 4 : 3
        }
        if (this.formCode === 'H-000010-WHJ-0024') { // 省立危重护理记录单，因为拼接上了时段，所以需要先处理掉
          // 判断下如果带有 ==== 小时，先把小时处理掉
          if (_saveForm.chuName.indexOf('小时') > -1) {
            _saveForm.chuName = _saveForm.chuName.substring(4, _saveForm.chuName.length)
          }
        }

        _j.itemValue = d['signItemUnit'] ? '' : this.saveForm.pointFlag + _saveForm.chuName
        _saveForm.extendList.push(_j)
      }

      ApiNurseNotes.save(_saveForm)
        .then(() => {
          this.$message.success('保存正确！')
          this.close()
          this.$emit('callBack')
        })
        .catch(res => {
          this.$message.error(res.message)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>

</style>
