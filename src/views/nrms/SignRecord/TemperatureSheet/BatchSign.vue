<template>
  <!--
    说明，为了增加键盘事件两处特别处理
    1、下拉不可手输的select都改为下拉可手输
    2、只能输入数字的，去掉type="number"属性，改用正则修正
    3、下拉的
  -->
  <LayoutEdit v-loading="loading">
    <div slot="title">
      批量录入
    </div>
    <div slot="main" style="height:100%;">
      <LayoutList>
        <div slot="query" class="search-items">
          <el-form :inline="true" :model="sign_form" :rules="sign_form_rules" ref="sign_form">
            <el-form-item label="日期：" prop="recordDate">
              <el-date-picker
                v-model="sign_form.recordDate"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期时间"
                :clearable="false"
                @change="dateChange"
                style="width: 182px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="itemHour" label="时刻：">
              <el-radio-group v-model="sign_form.itemHour" @change="tabsHandleClick">
                <el-radio :label="h.measuringTime" v-for="h in hours" :key="h.id">
                  {{h.measuringTime}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item style="margin-left: 15px;">
              <el-button type="primary" @click="addEvent">保存</el-button>
              <el-button @click="close" style="margin-left: 15px;">取消</el-button>
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
              <el-table-column
                label="床号"
                prop="bedName"
                width="80"
                fixed
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="姓名"
                prop="patientName"
                width="100"
                fixed
                align="center"
              >
              </el-table-column>

              <!-- 渲染 体征项 -->
              <template v-for="(item, index) in sign_item">
                <template v-if="item.signItemFieldName === 'tiwen'">
                  <el-table-column
                    :key="'item'+item.signId"
                    :label="item.signItemShowName"
                    :prop="item.signId"
                    min-width="100"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-if="item.signItemSvgSetting"
                        v-model="patientList[scope.$index].extendList[index]['signValue']"
                        @change="sign_form_change"
                        @keydown.native="nextFocus"
                        clearable
                        allow-create
                        filterable
                        default-first-option
                        placeholder="">
                        <el-option
                          v-for="(option,key) in item.signItemSvgSetting"
                          :key="'svg'+key"
                          :value="option.settingItem"
                          :label="option.settingItem"
                        >
                        </el-option>
                      </el-select>
                      <el-input
                        clearable
                        v-else v-model="patientList[scope.$index].extendList[index]['signValue']"
                        @keydown.native="nextFocus"
                        @input="sign_form_change"/>
                    </template>
                  </el-table-column>
                  <template v-for="(child, key1) in item.childrenSignItem">
                    <el-table-column
                      :key="'clfs'+child.signId"
                      :label="child.signItemShowName"
                      v-if="child.signItemFieldName === 'tiwenceliangfangshi'"
                      min-width="120"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-select
                          v-model="patientList[scope.$index].extendList[index].itemValueType"
                          @change="sign_form_change"
                          @keydown.native="nextFocus"
                          clearable
                          allow-create
                          filterable
                          default-first-option
                          placeholder="">
                          <el-option
                            v-for="(option,index) in child.signItemSvgSetting"
                            :key="index"
                            :value="option.settingItem"
                            :label="option.settingItem"
                          >
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="child.signItemFieldName === 'fucetiwen'"
                      :key="'fctw' + key1 + item.signId"
                      :label="child.signItemShowName"
                      min-width="100"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-input
                          clearable
                          v-model="patientList[scope.$index].extendList[index].phValue"
                          @input="sign_form_change"
                          @keydown.native="nextFocus"
                          :disabled="
                            patientList[scope.$index].extendList[index]['signValue']=='拒测' ||
                            patientList[scope.$index].extendList[index]['signValue']=='外出' ||
                            patientList[scope.$index].extendList[index]['signValue']=='不升' ||
                            patientList[scope.$index].extendList[index]['signValue']=='请假'"
                        />
                      </template>
                    </el-table-column>
                  </template>
                </template>
                <template v-else-if="item.signItemFieldName === 'xuetang'">
                  <el-table-column
                    :key="'item'+item.signId"
                    :label="item.signItemShowName"
                    min-width="100"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-input
                        clearable
                        v-model="patientList[scope.$index].extendList[index]['signValue']"
                        @keydown.native="nextFocus"
                        @input="sign_form_change"
                      />
                    </template>
                  </el-table-column>
                  <template v-for="(child, key1) in item.childrenSignItem">
                    <el-table-column
                      :key="'clsk' + key1 + child.signId"
                      :label="child.signItemShowName"
                      v-if="child.signItemFieldName === 'celiangshike'"
                      min-width="100"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-select
                          v-model="patientList[scope.$index].extendList[index].itemValueType"
                          @change="sign_form_change"
                          @keydown.native="nextFocus"
                          clearable
                          allow-create
                          filterable
                          default-first-option
                          placeholder="">
                          <el-option
                            v-for="(option,index) in child.signItemSvgSetting"
                            :key="index"
                            :value="option.settingItem"
                            :label="option.settingItem"
                          >
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                  </template>
                </template>
                <template v-else-if="item.signItemFieldName === 'tengtongdengji'">
                  <el-table-column
                    :key="'item'+item.signId"
                    :label="item.signItemShowName"
                    min-width="100"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-if="item.signItemSvgSetting"
                        v-model="patientList[scope.$index].extendList[index]['signValue']"
                        @change="sign_form_change"
                        @keydown.native="nextFocus"
                        clearable
                        allow-create
                        filterable
                        default-first-option
                        placeholder="">
                        <el-option
                          v-for="(option,key) in item.signItemSvgSetting"
                          :key="'svg'+key"
                          :value="option.settingItem"
                          :label="option.settingItem"
                        >
                        </el-option>
                      </el-select>
                      <el-input v-else
                                clearable v-model="patientList[scope.$index].extendList[index]['signValue']"
                                @input="sign_form_change"/>
                    </template>
                  </el-table-column>
                  <template v-for="(child, key1) in item.childrenSignItem">
                    <el-table-column
                      v-if="child.signItemFieldName === 'fucetengtong'"
                      :key="'fctt' + key1 + item.signItemShowName"
                      :label="child.signItemShowName"
                      min-width="100"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-select
                          v-model="patientList[scope.$index].extendList[index].phValue"
                          @change="sign_form_change"
                          @keydown.native="nextFocus"
                          clearable
                          allow-create
                          filterable
                          default-first-option
                          placeholder="">
                          <el-option
                            v-for="(option,index) in child.signItemSvgSetting"
                            :key="index"
                            :value="option.settingItem"
                            :label="option.settingItem"
                          >
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                  </template>
                </template>
                <template v-else>
                  <el-table-column
                    :key="item.signId"
                    :label="item.newSignItemShowName"
                    min-width="100"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span v-if="item.signSummaryType&&item.signSummaryType !== 0">{{patientList[scope.$index].extendList[index]['signValue']}}</span>
                      <template v-else>
                        <el-select
                          v-if="item.signItemFieldType==='4'||item.signItemFieldType==='3'"
                          v-model="patientList[scope.$index].extendList[index]['signValue']"
                          @change="sign_form_change"
                          @keydown.native="nextFocus"
                          clearable
                          allow-create
                          filterable
                          default-first-option
                          placeholder="">
                          <el-option
                            v-for="(option,key) in item.signItemSvgSetting"
                            :key="key"
                            :value="option.settingItem"
                            :label="option.settingItem"
                          >
                          </el-option>
                        </el-select>
                        <el-select
                          v-else-if="item.signItemFieldType==='6' || item.signItemFieldType==='7'"
                          v-model="patientList[scope.$index].extendList[index]['signValue']"
                          clearable
                          filterable
                          allow-create
                          default-first-option
                          @change="sign_form_change"
                          @keydown.native="nextFocus"
                          placeholder="">
                          <el-option
                            v-for="(option,key) in item.signItemSvgSetting"
                            :key="key"
                            :value="option.settingItem"
                            :label="option.settingItem"
                          >
                          </el-option>
                        </el-select>
                        <el-input
                          clearable
                          v-else-if="item.signItemFieldType==='2'" type='text'
                          v-model="patientList[scope.$index].extendList[index]['signValue']"
                          @keydown.native="nextFocus"
                          @input="sign_form_change"></el-input>
                        <el-input
                          clearable
                          v-else v-model="patientList[scope.$index].extendList[index]['signValue']"
                          @keydown.native="nextFocus"
                          @input="sign_form_change"></el-input>
                      </template>
                    </template>
                  </el-table-column>
                </template>
              </template>
            </el-table>
        </div>
      </LayoutList>
    </div>
  </LayoutEdit>
</template>

<script>
import { ApiTemperatureSheet, ApiSignItemSetting, ApiPatient, ApiAutoForm } from '../../../../api/nrms/index'
import moment from 'moment'
import LayoutList from '../../../../components/nrms/layout/list'
import LayoutEdit from '../../../../components/nrms/layout/edit'
export default {
  name: '',
  components: { LayoutList, LayoutEdit },
  props: ['patient'],
  data () {
    return {
      loading: false,
      patientList: [],
      sign_item: [],
      firstSvgObj: {}, // 所有类型为单选的体征项中svg字段的 signId+第一个配置项值 的对象
      sign_form_change_flag: false,
      sign_form: {
        recordDate: moment().format('YYYY-MM-DD'),
        itemHour: 0,
        itemType: ''
      },
      sign_form_rules: {
        // recordDate: [
        //   { required: true, message: '请选择日期时间', trigger: 'blur' }
        // ],
        // itemHour: [
        //   { required: true, message: '请选择时刻', trigger: 'blur' }
        // ]
      },
      hours: []
    }
  },
  created () {
    // this.hidePatient()
    this.loading = true
    this.getHours()
  },
  updated () {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 回车跳到下一个可获得焦点的元素
    nextFocus (e) {
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
        console.log('curTd.nextElementSibling  ---- ', curTd.nextElementSibling)
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

        console.log('focusParent -- ', focusParent, focusE)

        focusE && focusE.focus()
      }
    },
    getHours () {
      ApiAutoForm.getFormDictByType({ formType: 2 })
        .then(res => {
          let hours = res.data && res.data.temperatureTimeDos ? res.data.temperatureTimeDos : []
          let formId = res.data && res.data.formId ? res.data.formId : ''
          this.sign_form.itemHour = hours.length > 0 ? hours[0].measuringTime : ''
          this.sign_form.itemType = hours.length > 0 ? hours[0].type : ''
          this.hours = hours

          Promise.all([this.getPatientList(), this.getSignItemData(formId)]).then(data => {
            this.parsePatientList(data[0])
            this.parseSignItems(data[1].data, JSON.parse(JSON.stringify(this.patientList)))
            this.loading = false
            this.changeHour()
          })
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
    getSignItemData (formId) {
      return ApiSignItemSetting.selectItem({ formId: formId })
    },
    parseSignItems (items, patientList) {
      let data = items || []
      this.sign_item = []
      for (let i = 0; i < data.length; i++) {
        let sign_field_name = data[i]['signItemFieldName']
        if (sign_field_name === 'xuetang') { // 血糖和体温单独处理
          data[i]['newSignItemShowName'] = data[i]['signItemShowName']
          this.sign_item.push(data[i])
        } else if (sign_field_name === 'tiwen') {
          data[i]['newSignItemShowName'] = data[i]['signItemShowName']
          this.sign_item.push(data[i])
        } else if (sign_field_name === 'tengtongdengji') {
          data[i]['newSignItemShowName'] = data[i]['signItemShowName']
          this.sign_item.push(data[i])
        } else {
          let str = data[i]['signItemShowName']
          this.getNewSignItemShowName(data[i], str)// 递归获取子元素中的signItemShowName值
        }
      }
      console.log('this.sign_item', this.sign_item)
      // 保存数据格式
      for (let j = 0; j < patientList.length; j++) {
        let _p = patientList[j]
        _p.extendList = []
        for (let i = 0; i < this.sign_item.length; i++) {
          let _d = this.sign_item[i]
          _p.extendList.push({
            signSummaryType: _d['signSummaryType'],
            signId: _d['signId'],
            signValue: '',
            phValue: '',
            itemValueType: '',
            itemCode: _d['signItemFieldName']
          })
        }
      }
      this.patientList = patientList
      console.log('this.patientList', this.patientList)
    },
    getNewSignItemShowName (data, strItem) {
      let item = data['childrenSignItem']
      if (item.length === 0) { // 没有子项的时候 取当前这个list放进sign_item中，重新组合
        let smallChildItem = JSON.parse(JSON.stringify(data))
        if (smallChildItem['signItemFieldName'] === 'shousuoya' || smallChildItem['signItemFieldName'] === 'shuzhangya' || smallChildItem['signItemFieldName'] === 'celiangweizhi') {
          smallChildItem['newSignItemShowName'] = data['signItemShowName'] // 舒张压收缩压不需要展示血压-收缩压
        } else {
          smallChildItem['newSignItemShowName'] = strItem // 总尿量-大便次数-尿量-水-排泄 格式
        }
        this.sign_item.push(smallChildItem)
      } else {
        for (let j = 0; j < item.length; j++) {
          let str2 = strItem + '-' + item[j]['signItemShowName']
          this.getNewSignItemShowName(item[j], str2)
        }
      }
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
    addEventDo () {
      this.loading = true
      let list = []
      console.log('save.patientList', this.patientList)
      for (let i = 0; i < this.patientList.length; i++) {
        let _d = this.patientList[i]
        this.sign_form.recordDate = this.sign_form.recordDate + ' 00:00:00'
        list.push(Object.assign(_d, this.sign_form))
      }
      ApiTemperatureSheet.saveList({ data: list }).then(() => {
        this.$message.success('保存成功')
        this.sign_form_change_flag = false
        this.loading = false
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    close () {
      this.$emit('main-option-changed', 'main_list')
    },
    tabsHandleClick () {
      if (!this.sign_form_change_flag) {
        this.changeHour()
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
          this.changeHour()
          this.sign_form_change_flag = false
        })
      }
    },
    // 按时刻+日期查询
    changeHour () {
      this.getFirstSvgOption()// 获取体征项中svg字典中的第一个选项，并放入对象中
      ApiTemperatureSheet.selectByHour({
        recordDate: this.sign_form.recordDate + ' 00:00:00',
        itemHour: this.sign_form.itemHour,
        itemType: this.sign_form.itemType
      })
        .then((res) => {
          for (let x = 0; x < this.patientList.length; x++) {
            let p = this.patientList[x]
            // 先清空数据
            for (let y = 0; y < p.extendList.length; y++) {
              let eitem = p.extendList[y]
              if (eitem.itemCode === 'tiwen' || eitem.itemCode === 'tengtongdengji' || eitem.itemCode === 'xuetang') {
                eitem.signValue = ''
                eitem.phValue = ''
                eitem.itemValueType = this.firstSvgObj[eitem.signId]
              } else {
                eitem.signValue = this.firstSvgObj[eitem.signId]
                eitem.phValue = ''
                eitem.itemValueType = ''
              }
            }

            for (let z = 0; z < res.data.length; z++) {
              let pd = res.data[z]
              if (p.patientId === pd.keyString) {
                for (let y = 0; y < p.extendList.length; y++) {
                  let eitem = p.extendList[y]

                  for (let a = 0; a < pd.data.length; a++) {
                    let ritem = pd.data[a]
                    if (eitem.signId === ritem.signId) {
                      eitem.signValue = ritem.signValue
                      eitem.phValue = ritem.phValue
                      eitem.itemValueType = ritem.itemValueType
                    }
                  }
                }
              }
            }
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    getFirstSvgOption () {
      this.firstSvgObj = {}
      console.log('this.sign_item', this.sign_item)
      for (let i = 0; i < this.sign_item.length; i++) {
        let item = this.sign_item[i]
        let child = this.sign_item[i]['childrenSignItem']
        if (item['signItemFieldName'] === 'tiwen') {
          let signId = item['signId']
          for (let j = 0; j < child.length; j++) {
            if (child[j]['signItemFieldName'] === 'tiwenceliangfangshi' && child[j]['signItemFieldType'] === '3') {
              let filedSvgSetting = child[j]['signItemSvgSetting']
              this.firstSvgObj[signId] = filedSvgSetting[0]['settingItem']
            }
          }
        } else if (item['signItemFieldName'] === 'xuetang') {
          let signId = item['signId']
          for (let j = 0; j < child.length; j++) {
            if (child[j]['signItemFieldName'] === 'celiangweizhi' && child[j]['signItemFieldType'] === '3') {
              let filedSvgSetting = child[j]['signItemSvgSetting']
              this.firstSvgObj[signId] = filedSvgSetting[0]['settingItem']
            }
          }
        } else if (item['signItemFieldName'] === 'tengtongdengji') {
          let signId = item['signId']
          for (let j = 0; j < child.length; j++) {
            if (child[j]['signItemFieldName'] === 'fucetengtong' && child[j]['signItemFieldType'] === '3') {
              let filedSvgSetting = child[j]['signItemSvgSetting']
              this.firstSvgObj[signId] = filedSvgSetting[0]['settingItem']
            }
          }
        } else {
          // 获取单选按钮类型的体征项的id与第一个默认值
          this.getFirstSvgObj(this.sign_item[i])
        }
      }
      console.log('firstSvgObj', this.firstSvgObj)
    },
    getFirstSvgObj (childItem) {
      let filedType = childItem.signItemFieldType
      let filedSvgSetting = childItem.signItemSvgSetting
      if (filedType === '3') {
        this.firstSvgObj[childItem.signId] = filedSvgSetting[0]['settingItem']
      }
    },
    dateChange () {
      this.tabsHandleClick()
    },
    sign_form_change () {
      this.sign_form_change_flag = true
    }
  },
  watch: {
    'sign_form.itemHour' (val) {
      for (let i = 0; i < this.hours.length; i++) {
        let _d = this.hours[i]
        if (_d.measuringTime === +val) {
          this.sign_form.itemType = _d.type
          break
        }
      }
    }
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
</style>
