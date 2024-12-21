<template>
  <LayoutEdit v-loading="loading">
    <div slot="title">
      批量录入
    </div>
    <div slot="main" style="height:100%;">
      <LayoutList>
        <div slot="query" class="search-items">
          <el-form :inline="true" :model="sign_form" ref="sign_form">
            <el-form-item label="日期：">
              <el-date-picker
                v-model="timeDate"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期时间"
                :clearable="false"
                @change="dateChange"
                style="width: 182px;">
              </el-date-picker>
            </el-form-item>

            <el-form-item style="margin-left: 15px;">
              <el-button type="primary" @click="addEvent">保存</el-button>
              <el-button @click="close" style="margin-left: 15px;">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div slot="main" class="main-list">
          <el-table
            ref="table"
            :data="patientList"
            highlight-current-row
            height="100%"
          >
            <!-- <el-table-column type="index" label="序号" width="120" align="center"></el-table-column> -->

            <el-table-column label="床号"
              prop="bedName"
              width="80"
              align="center"
            >
            </el-table-column>

            <el-table-column label="姓名"
              prop="patientName"
              align="center"
            >
            </el-table-column>

            <template v-for="item in sign_item">
              <el-table-column
                :key="'item'+item.signId"
                :label="item.signItemShowName"
                :prop="item.signId"
                min-width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-time-picker
                    v-if="item.type === 10"
                    v-model="patientList[scope.$index].conditionTxt[item.signId]"
                    :format="'HH:mm'"
                    value-format="HH:mm"
                    :clearable="false"
                    @change="timeHourChange"
                    placeholder="选择时间">
                  </el-time-picker>
                  <el-input
                   v-else
                    v-model="patientList[scope.$index].conditionTxt[item.signId]"
                    @keydown.native="nextFocus"
                    @input="sign_form_change" />
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </LayoutList>
    </div>
  </LayoutEdit>
</template>

<script>

import { ApiPatient, ApiNurseNotes } from '../../../../api/nrms/index'
import moment from 'moment'
import LayoutList from '../../../../components/nrms/layout/list'
import LayoutEdit from '../../../../components/nrms/layout/edit'
export default {
  name: 'batch_sign_add',
  components: { LayoutList, LayoutEdit },
  props: ['patient', 'formListObj'],
  data () {
    return {
      formId: '',
      titCurData: [],
      loading: false,
      patientList: [],
      sign_item: [],
      sign_form_change_flag: false,
      timeDate: moment().format('YYYY-MM-DD'),
      sign_form: {
        recordDate: ''
      },
      userName: ''
    }
  },
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.userName = empInfo.empId
    if (this.formListObj.length > 0) {
      this.formId = this.formListObj[0].formId
    }

    this.loading = true
    this.getData()
  },
  updated () {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    nextFocus (e) { // 回车跳到下一个可获得焦点的元素
      const keyCode = e.keyCode || e.which || e.charCode

      let curTd = null
      const classList = e.target.classList
      // 输入框或者下拉
      if (classList.contains('el-input__inner')) {
        const pClassList = e.target.parentNode.parentNode.classList
        // 下拉
        if (pClassList.contains('el-select')) {
          curTd = e.target.parentNode.parentNode.parentNode.parentNode
        } else {
          // 输入框
          curTd = e.target.parentNode.parentNode.parentNode
        }
      } else if (classList.contains('el-radio__original')) { // 单选
        curTd = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      } else if (classList.contains('el-checkbox__original')) { // 复选
        curTd = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      }
      // 当前单元格索引
      const curTdIndex = curTd.cellIndex
      // 下个焦点容器
      let focusParent = null
      // 回车 13 下 40 左 37 右 39 上 38
      if (keyCode === 13 || keyCode === 39) {
        focusParent = curTd.nextElementSibling
      } else if (keyCode === 37) { // 左
        focusParent = curTd.previousElementSibling
      } else if (keyCode === 38) { // 上
        const prevTr = curTd.parentNode.previousElementSibling
        const prevTd = prevTr.children[curTdIndex]
        focusParent = prevTd
      } else if (keyCode === 40) { // 下
        const prevTr = curTd.parentNode.nextElementSibling
        const prevTd = prevTr.children[curTdIndex]
        focusParent = prevTd
      }

      if (focusParent) {
        let focusE = null
        if (focusParent.querySelector('input')) {
          focusE = focusParent.querySelector('input')
        } else if (focusParent.querySelector('checkbox')) {
          focusE = focusParent.querySelector('checkbox')
        } else if (focusParent.querySelector('radio')) {
          focusE = focusParent.querySelector('radio')
        }

        focusE && focusE.focus()
      }
    },
    getData () { // 获取数据
      Promise.all([this.getPatientList()]).then(data => {
        this.parsePatientList(data[0])
        this.parseSignItems(JSON.parse(JSON.stringify(this.patientList)))
        this.loading = false
      })
    },
    getPatientList () {
      return ApiPatient.selectIn()
    },
    parsePatientList (res) {
      let data = (res.data && res.data.patientSelectDtos) ? res.data.patientSelectDtos : []

      for (let i = 0; i < data.length; i++) {
        this.patientList.push(data[i].patientInViewDTO)
      }
    },
    parseSignItems (patientList) {
      this.sign_item = []
      // 处理表头显示
      this.titCurData = JSON.parse(JSON.stringify(this.formListObj))
      this.titCurData.unshift({
        fieldLength: 10,
        signItemFieldName: 'timecur',
        focus: 0,
        formId: this.formId,
        signId: '5df9_161043318__01',
        item: null,
        signItemShowName: '时间',
        sort: 0,
        type: 10
      })
      for (let i = 0; i < this.titCurData.length; i++) {
        this.titCurData[i]['signItemShowName'] = this.titCurData[i]['signItemShowName']
        this.titCurData[i]['signItemFieldName'] = this.titCurData[i]['signItemFieldName']
        this.titCurData[i]['signId'] = this.titCurData[i]['signId']
        this.sign_item.push(this.titCurData[i])
      }

      // 保存数据格式
      for (let j = 0; j < patientList.length; j++) {
        let _p = patientList[j]
        _p['formId'] = this.formId
        _p['recordDate'] = ''
        _p.conditionTxt = []
        _p.extendList = []
        let _j = {}
        for (let i = 0; i < this.sign_item.length; i++) {
          let _d = this.sign_item[i]

          // _j[_d['signId']] = ''
          if (_d.type === 10) { // 时间进行初始化值
            _j[_d['signId']] = moment().format('HH:mm')
          }
        }

        _p.conditionTxt = _j
      }

      this.patientList = patientList
    },
    addEvent () {
      this.$refs.sign_form.validate((valid) => {
        if (valid) {
          this.$confirm('确认要保存数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.addEventDo()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addEventDo (type = '') {
      this.loading = true
      let list = []

      for (let i = 0; i < this.patientList.length; i++) {
        let _d = this.patientList[i]
        // 处理数据==得到recordDate
        this.sign_form.recordDate = this.timeDate + ' ' + _d.conditionTxt['5df9_161043318__01']
        delete _d['createTime']
        _d.userName = this.userName
        list.push(Object.assign(_d, this.sign_form))
      }
      // 转一下数据格式，存到extendList
      list = list.filter((v) => {
        let _flag = false
        for (let k in v.conditionTxt) {
          let _j = {}

          if (k !== '5df9_161043318__01' && v.conditionTxt[k] !== '') {
            _flag = true
          }
          _j['itemId'] = k
          _j['itemValue'] = v.conditionTxt[k]
          v['extendList'].push(_j)
        }

        if (_flag) {
          return v
        }
      })

      ApiNurseNotes.someIn(list).then((res) => {
        this.$message.success('保存成功')
        this.sign_form_change_flag = false
        this.loading = false
        if (type === 'leave') {
          this.$emit('option-changed', 'tabs')
        }
      }).catch(res => {
        this.$message.error('请填写脉氧仪测验数据！')
        this.loading = false
      })
    },
    close () {
      // 校验数据更改之后没有保存
      if (this.sign_form_change_flag) {
        this.$confirm('数据未保存，确定要离开吗?', '提示', {
          confirmButtonText: '保存并离开',
          cancelButtonText: '不保存，直接离开',
          type: 'warning'
        }).then(() => {
          this.addEventDo('leave')
        }).catch(() => {
          this.$emit('option-changed', 'tabs')
        })
      } else {
        this.$emit('option-changed', 'tabs')
      }
    },
    tabsHandleClick () {
      if (!this.sign_form_change_flag) {
        this.sign_form_change_flag = false
      } else {
        this.$confirm('是否保存当前编辑的数据?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addEvent()
          this.sign_form_change_flag = false
        }).catch(() => {
          this.sign_form_change_flag = false
        })
      }
    },
    timeHourChange () {
      this.sign_form_change_flag = true
    },
    dateChange () {
      this.tabsHandleClick()
    },
    sign_form_change () {
      this.sign_form_change_flag = true
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/nrms/css/self_common";
  /deep/ .el-main {
    padding: 0 !important;
  }
  /deep/ input[type='number'] {
    padding-right: 0;
  }
  /deep/.el-form-item__label{
    padding-right: 8px;
  }
  .search-items{
    /deep/.el-button {
      width: 70px;
      height: 40px;
      font-size: 14px;
    }
    /deep/.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
      margin-top:9px;
      margin-bottom: 9px;
      line-height: 40px;
      padding-left: 15px;
    }
    /deep/.el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{
      line-height: 40px;
    }
  }

  .el-date-editor.el-input {
    width: 100px;
  }
</style>
