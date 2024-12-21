<template>
  <LayoutEdit v-loading="loading">
    <div slot="title">
      批量配液
    </div>
    <div slot="right_btn">
      <el-button v-uni="'peiyeguanli_piliangpeizhi_goback'" type="primary" @click="$emit('option-changed','list');">返回</el-button>
    </div>
    <div slot="main" style="height:100%;">
      <LayoutList>
        <div slot="query" class="query-items">
          <!--      查询条件-->
          <el-form :inline="true" :model="search_form" ref="search_form">
            <el-form-item label="医嘱类型:" prop="adviceType">
              <el-select v-uni="'peiyeguanli_yizhuleixing'" v-model="search_form.adviceType" placeholder="全部" clearable autocomplete="off">
                <el-option
                  v-for="(value, key) in config.doctors_advice_type"
                  :label="value"
                  :value="key"
                  :key="key"
                  v-if="key =='1' || key =='2'||key =='3' "
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间:" prop="targetDate">
              <el-date-picker
                v-uni="'peiyeguanli_date'"
                v-model="search_form.targetDate"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="条形码是否打印:" prop="printCode">
              <el-select
                v-uni="'peiyeguanli_shifoudayintiaoxingma'"
                v-model="search_form.printCode"
                placeholder="全部"
                clearable
                autocomplete="off"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="已打印" value="1"></el-option>
                <el-option label="未打印" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="配液状态:" prop="dispenseStatus">
              <el-select
                v-uni="'peiyeguanli_peiyezhuangtai'"
                v-model="search_form.dispenseStatus"
                placeholder="全部"
                clearable
                autocomplete="off"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="已配液" value="1"></el-option>
                <el-option label="未配液" value="0"></el-option>
              </el-select>
            </el-form-item>
            <div ref="patientTextDiv" :class="{patientTextDiv:isShow}" style="display: inline-block;position: relative">
              <el-form-item style="margin: 12px;">
                <div class="btn-textGrayToBlue" @click="showToggle" ref="changePatientText" v-on:mouseover="isSet&&mouseOver()" v-on:mouseout="isSet&&mouseOut()">
                  <span class="lineButton">患者选择</span>
                  <span class="el-icon-arrow-down" v-if="!isShow"></span>
                  <span class="el-icon-arrow-up" v-else></span>
                </div>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button v-uni="'peiyeguanli_search'" type="primary" @click="searchForm()" icon="el-icon-search">搜索</el-button>
              <el-button v-uni="'peiyeguanli_reset'" type="text" @click="resetForm()" style="margin-left: 0;"
              >重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--      患者列表-->
        <div ref="patientContainer" class="patientContainer" :style="h1StyleObj" v-show="isShow">
          <div class="sanjiao" :style="sanjiaoStyleObj"></div>
          <div class="flexContainer">
            <div class="btnOperation">
              <el-button v-uni="'peiyeguanli_piliangpeiye_quanxuan'" class="el-button--textblue" @click="handleCheckAllChange(patientsArr)">全选</el-button>
              <el-button v-uni="'peiyeguanli_piliangpeiye_fanxuan'" class="el-button--textblue" @click="handleCheckPartChange">反选</el-button>
              <el-button v-uni="'peiyeguanli_piliangpeiye_quanbuxuan'" class="el-button--textblue" @click="handleCheckAllChange">全不选</el-button>
            </div>
            <div class="patientList">
              <el-checkbox-group v-model="checkedPatientsIds" @change="handleCheckedPatientsChange">
                <el-checkbox v-for="patient in patientsArr" :label="patient.patientId" :key="patient.patientId">
                  <div class="nameContent">
                    <el-tooltip class="item" effect="dark" :content="patient.bedName" placement="top">
                      <span class="bedName" :title="patient.bedName + '床'">{{patient.bedName}}床</span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="patient.patientName" placement="top">
                      <span class="patientName">{{patient.patientName}}</span>
                    </el-tooltip>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div slot="right_btn" class="tool-bar">
          <el-button v-uni="'peiyeguanli_print'" type="success" @click="printAll">打印</el-button>
        </div>
        <!-- 表格 -->
        <div slot="main" class="main-list">
          <!--      表格-->
          <el-table
            class="table"
            :data="table_data"
            :row-key="getRowKeys"
            highlight-current-row
            @selection-change="handleTableSelectionChange"
            height="100%"
            stripe
          >
            <el-table-column
              fixed="left"
              type="selection"
              reserve-selection
              :selectable="handleSelectable"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column prop="bedName" fixed="left" label="床号" width="60" align="center"></el-table-column>
            <el-table-column
              prop="patientName"
              label="患者姓名"
              align="center"
              min-width="100"
            ></el-table-column>
            <el-table-column
              prop="startAdviceTime"
              label="开嘱时间"
              align="center"
              width="95"
            >
              <template slot-scope="scope">
                {{scope.row.startAdviceTime ? scope.row.startAdviceTime.split(" ")[0] : ''}}<br/>
                {{scope.row.startAdviceTime ? formatTime(scope.row.startAdviceTime) : ''}}
              </template>
            </el-table-column>
            <el-table-column
              prop="medicalItemName"
              label="医嘱名称"
              align="center"
              show-overflow-tooltip
              min-width="160"
            ></el-table-column>
            <el-table-column
              prop="dosage"
              label="剂量"
              align="center"
              min-width="60"
            ></el-table-column>
            <el-table-column
              prop="number"
              label="数量"
              align="center"
              min-width="60"
            ></el-table-column>
            <el-table-column
              prop="frequencyCode"
              label="频次"
              align="center"
              min-width="60"
            ></el-table-column>
            <el-table-column
              prop="frequencyExecuteTime"
              label="执行时间点"
              align="center"
              min-width="95"
            ></el-table-column>
            <el-table-column
              prop="purpose"
              label="用法"
              align="center"
              min-width="60"
            ></el-table-column>
            <el-table-column
              prop="printCount"
              label="打印"
              align="center"
              min-width="60"
            >
              <template slot-scope="scope">
                {{ (scope.row.printCount == 0 ? '否' : '是') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="medicalAdviceBarcode"
              label="条码号"
              align="center"
              width="100"
            ></el-table-column>
            <!--<el-table-column-->
              <!--prop="medicalOperationType"-->
              <!--label="医嘱类型"-->
              <!--align="center"-->
              <!--min-width="80"-->
            <!--&gt;-->
              <!--<template slot-scope="scope">-->
                <!--{{config.doctors_advice_type[scope.row.medicalOperationType] || ''}}-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
              prop="dispenseTime"
              label="配液时间"
              align="center"
              width="95"
            >
              <template slot-scope="scope">
                {{scope.row.dispenseTime ? scope.row.dispenseTime.split(" ")[0] : ''}}<br/>
                {{scope.row.dispenseTime ? formatTime(scope.row.dispenseTime) : ''}}
              </template>
            </el-table-column>
            <el-table-column
              prop="dispenseNurse"
              label="配液护士"
              align="center"
              min-width="100"
            >
              <template slot-scope="scope">
                {{scope.row.dispenseNurse ? user_data[scope.row.dispenseNurse] : ''}}
              </template>
            </el-table-column>
            <el-table-column
              prop="dispenseCheckTime"
              label="复核时间"
              align="center"
              width="95"
            >
              <template slot-scope="scope">
                {{scope.row.dispenseCheckTime ? scope.row.dispenseCheckTime.split(" ")[0] : ''}}<br/>
                {{scope.row.dispenseCheckTime ? formatTime(scope.row.dispenseCheckTime) : ''}}
              </template>
            </el-table-column>
            <el-table-column
              prop="dispenseCheckNurse"
              label="复核护士"
              align="center"
              min-width="100"
            >
              <template slot-scope="scope">
                {{scope.row.dispenseCheckNurse ? user_data[scope.row.dispenseCheckNurse]: ''}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.medicalAdviceId">
                  <!--            {{scope.row.dispenseCheckStatus}}-{{scope.row.dispenseStatus}}-->
                  <el-button v-uni:[scope.$index]="'peiyeguanli_peiye'" @click="dispenseOperate(scope.row)" type="text"
                             v-if="scope.row.dispenseStatus !== 1"
                  >配液
                  </el-button>
                  <el-button v-uni:[scope.$index]="'peiyeguanli_quxiao'" type="textred" @click="dispenseCancel(scope.row)" v-if="scope.row.dispenseStatus === 1&&scope.row.dispenseCheckStatus !== 1"
                  >取消配液
                  </el-button>
                  <el-button v-uni:[scope.$index]="'peiyeguanli_peiyefuhe'" @click="openCheckDialog(scope.row)" type="text"
                             v-if="(scope.row.dispenseCheckStatus!==1 && scope.row.dispenseStatus === 1)"
                  >配液复核
                    <!--                  (scope.row.dispenseCheckStatus===0 &&scope.row.dispenseStatus === 1)||(scope.row.dispenseCheckStatus===null&&scope.row.dispenseStatus === 1)-->
                  </el-button>
                  <el-button v-uni:[scope.$index]="'peiyeguanli_quxiaofuhe'" type="textred" @click="recoveryCancel(scope.row)" v-if="scope.row.dispenseCheckStatus===1"
                  >取消复核
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div slot="footer" class="page-bar">
          <!-- 分页 -->
          <div class="paginationDiv">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page_current"
              :page-sizes="[10, 30, 50, 100]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page_total"
            >
            </el-pagination>
          </div>
        </div>
        <template slot>
          <!--    复核-->
          <el-dialog title="复核人"
                     :visible.sync="dialogFormVisible"
                     :close-on-click-modal="false"
                     :show-close="false"
                     width="490px"
                     custom-class="checkDialogStyle"
          >
            <el-form :model="dispense_check_form" class="ifms-add-dialog">
              <el-form-item label="账户：" :label-width="formLabelWidth">
                <el-input v-uni="'peiyeguanli_fuheren_zhanghu'" v-model="dispense_check_form.account" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码：" :label-width="formLabelWidth">
                <el-input v-uni="'peiyeguanli_fuheren_password'" v-model="dispense_check_form.password" autocomplete="off" show-password></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button v-uni="'peiyeguanli_fuheren_cancel'" @click="dialogFormVisible = false">取消</el-button>
              <el-button v-uni="'peiyeguanli_fuheren_confirm'" type="primary" @click="dialogFormConfirm">确认</el-button>
            </div>
          </el-dialog>
        </template>
      </LayoutList>
    </div>
  </LayoutEdit>

</template>

<script>
import LayoutList from '../../../components/dams/layout/list'
import LayoutEdit from '../../../components/dams/layout/edit'
import { doctors_advice_type } from '../../../assets/dams/js/item_config'
import { ApiDoctorsAdviceDispense, ApiPatient, ApiUser } from '../../../api/dams/index'
import moment from 'moment'

export default {
  name: 'batchDispense',
  components: { LayoutList, LayoutEdit },
  data () {
    return {
      loading: false,
      isShow: false,
      isSet: true, // 患者选择 展开与不展开时是否执行鼠标放上与移开事件
      h1StyleObj: { left: '', right: '', top: '' }, // 患者选择列表动态定位值
      sanjiaoStyleObj: { left: '' },
      user_data: [], // 用户信息
      dialogFormVisible: false, // 二期复核验证对话框
      dispense_check_form: {
        account: '',
        password: ''
      },
      formLabelWidth: '100px',
      // 患者列表信息 begin
      checkedPatientsIds: [],
      patientsArr: [],
      // 患者列表信息 end
      config: { doctors_advice_type },
      page_current: 1,
      page_total: 1,
      search_form: {
        patientIds: '',
        adviceType: '1',
        printCode: '',
        targetDate: moment().format('YYYY-MM-DD'),
        dispenseStatus: '',
        page: 1,
        size: 10
      },
      table_data: [],
      // table多选结果
      multipleSelection: []
    }
  },
  mounted () {
    // this.getPatientTextPosition() // 获取患者选择文本坐标
  },
  created () {
    this.selectPatientData()
    this.getUserData() // 获取用户信息  用于根据id显示姓名的对比
  },
  methods: {
    getPatientTextPosition () {
      let leftWidth = document.body.clientWidth - 230
      let textLeft = this.$refs.patientTextDiv.getBoundingClientRect().left
      let textTop = this.$refs.patientTextDiv.getBoundingClientRect().top
      this.h1StyleObj.top = (textTop + 50) + 'px'
      let leftInnerWidth = textLeft - 230 // 患者选择距离本页面边框距离  230为同一平台左侧菜单距离
      leftInnerWidth > leftWidth / 2 ? this.h1StyleObj.right = '42px' : this.h1StyleObj.left = '230px' // 大于50％靠右 小于就左
      this.$nextTick(function () {
        let conLeftInnerWidth = this.$refs.patientContainer.getBoundingClientRect().left
        // 三角
        this.sanjiaoStyleObj.left = (textLeft - conLeftInnerWidth + 20) + 'px'
      })
    },
    getUserData () {
      ApiUser.nurse().then(res => {
        const data = res.data || []
        for (let i = 0; i < data.length; i++) {
          this.user_data[data[i]['empId']] = data[i]['empName']
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    searchForm () {
      this.isShow = false
      this.handleCurrentChange(1)
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    showToggle () {
      this.isShow = !this.isShow
      this.getPatientTextPosition()
      if (this.isShow) {
        this.$refs.changePatientText.style.color = '#1e87f0'
        this.isSet = false
      } else {
        this.$refs.changePatientText.style.color = '#666666'
        this.isSet = true
      }
    },
    // 鼠标放上事件
    mouseOver () {
      this.$refs.changePatientText.style.color = '#1e87f0'
    },
    // 鼠标移开事件
    mouseOut () {
      this.$refs.changePatientText.style.color = '#666'
    },
    selectPatientData () {
      ApiPatient.selectIn().then(res => {
        let list = (res.data && res.data.patientSelectDtos) ? res.data.patientSelectDtos : []
        for (let i = 0; i < list.length; i++) {
          let listIn = {}
          listIn['patientId'] = list[i].patientInViewDTO.patientId || ''
          listIn['bedName'] = list[i].patientInViewDTO.bedName || ''
          listIn['patientName'] = list[i].patientInViewDTO.patientName || ''
          listIn['sex'] = list[i].patientInViewDTO.sex || ''
          listIn['patientAge'] = list[i].patientInViewDTO.patientAge || ''
          listIn['inpNo'] = list[i].patientInViewDTO.inpNo || ''
          this.patientsArr.push(listIn)
        }
        this.handleCheckAllChange(this.patientsArr)
        this.getDispenseData()
      })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 选择患者
    handleCheckedPatientsChange (value) {
      console.log('vaule', value)
      this.search_form.patientIds = value.join(',')
    },
    // 全选与全不选
    handleCheckAllChange (val) {
      if (val) {
        this.checkedPatientsIds = this.getPatientDataDeptId(val)
        this.search_form.patientIds = this.checkedPatientsIds.join(',')
      } else {
        this.search_form.patientIds = ''
        this.checkedPatientsIds = []
      }
    },
    // 反选
    handleCheckPartChange () {
      let tempArr = this.getPatientDataDeptId(this.patientsArr) // 全部患者id集合
      let tempArr1 = []
      let tempArr2 = []
      if (this.checkedPatientsIds.length === 0) {
        this.checkedPatientsIds = tempArr
        this.search_form.patientIds = tempArr.join(',')
      } else if (this.checkedPatientsIds.length === tempArr.length) {
        this.checkedPatientsIds = []
        this.search_form.patientIds = ''
      } else {
        for (let i = 0; i < this.checkedPatientsIds.length; i++) {
          tempArr1[this.checkedPatientsIds[i]] = true // 将数checkedPatientsIds中的元素值作为tempArr1中的键，值为true
        }
        for (let j = 0; j < tempArr.length; j++) {
          if (!tempArr1[tempArr[j]]) {
            tempArr2.push(tempArr[j]) // 过滤相同的元素
          }
        }
        this.checkedPatientsIds = tempArr2
        this.search_form.patientIds = this.checkedPatientsIds.join(',')
      }
    },
    getPatientDataDeptId (data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].patientId)
      }
      return arr
    },
    getDispenseData () {
      this.loading = true
      ApiDoctorsAdviceDispense.selectAll(this.search_form)
        .then(res => {
          // console.log(res)
          let list = res.data.list
          this.table_data = []
          // 组装数据 一项大医嘱根据执行时间点的数量来显示条数
          for (let i = 0; i < list.length; i++) { // 循环最外层
            let item = list[i]
            for (let k = 0; k < list[i].dispenseList.length; k++) { // 循环配液时间点
              let dispenseListItem = list[i].dispenseList[k]
              let kItem = {}
              let dispenseListItemArr = []
              kItem = { ...item }
              dispenseListItemArr.push(dispenseListItem)
              kItem['dispenseList'] = dispenseListItemArr
              // kItem['dispenseCheckStatus'] = dispenseListItem['dispenseCheckStatus']
              // kItem['dispenseStatus'] = dispenseListItem['dispenseStatus']
              // // kItem['frequencyExecuteTime'] = dispenseListItem['frequencyExecuteTime']
              // kItem['extendId'] = dispenseListItem['extendId']
              for (let j = 0; j < list[i].itemList.length; j++) { // 循环医嘱项
                let nItem = {}
                let _k = list[i].itemList[j]
                if (j === 0) {
                  nItem = { ...kItem }
                  nItem['main'] = true // 医嘱第一条复选框可勾选
                  nItem['medicalItemName'] = _k['medicalItemName']
                  nItem['dosage'] = _k['dosage']
                  nItem['number'] = _k['number']
                  nItem['purpose'] = _k['purpose']
                  nItem['printCount'] = dispenseListItem['printCount']
                  nItem['frequencyExecuteTime'] = dispenseListItem['frequencyExecuteTime']
                  nItem['dispenseTime'] = dispenseListItem['dispenseTime']
                  nItem['dispenseNurse'] = dispenseListItem['dispenseNurse']
                  nItem['dispenseCheckTime'] = dispenseListItem['dispenseCheckTime']
                  nItem['dispenseCheckNurse'] = dispenseListItem['dispenseCheckNurse']
                  nItem['dispenseStatus'] = dispenseListItem['dispenseStatus']
                  nItem['dispenseCheckStatus'] = dispenseListItem['dispenseCheckStatus']
                } else {
                  nItem['startAdviceTime'] = item['startAdviceTime']
                  nItem['medicalItemName'] = _k['medicalItemName']
                  nItem['dosage'] = _k['dosage']
                  nItem['number'] = _k['number']
                  nItem['purpose'] = _k['purpose']
                  nItem['frequencyCode'] = item['frequencyCode']
                  nItem['medicalAdviceBarcode'] = item['medicalAdviceBarcode']
                  nItem['printCount'] = dispenseListItem['printCount']
                  nItem['frequencyExecuteTime'] = dispenseListItem['frequencyExecuteTime']
                  nItem['dispenseTime'] = dispenseListItem['dispenseTime']
                  nItem['dispenseNurse'] = dispenseListItem['dispenseNurse']
                  nItem['dispenseCheckTime'] = dispenseListItem['dispenseCheckTime']
                  nItem['dispenseCheckNurse'] = dispenseListItem['dispenseCheckNurse']
                  nItem['dispenseStatus'] = dispenseListItem['dispenseStatus']
                  nItem['dispenseCheckStatus'] = dispenseListItem['dispenseCheckStatus']
                }
                this.table_data.push(nItem)
              }
            }
          }
          console.log('table_data:', this.table_data)
          this.page_total = res.data.total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 配液
    dispenseOperate (row) {
      let _row = JSON.parse(JSON.stringify(row))
      // _row.dispenseList[0]['dispenseStatus'] = 1 // 配液状态
      // let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
      // _row.dispenseList[0]['dispenseNurse'] = empInfo.empId // 登录用户护士ID
      let data = {
        adviceId:_row.medicalAdviceId,
        pointId: _row.dispenseList[0]['extendId'],
        targetDate: this.search_form.targetDate // 查询时间
      }
      // console.log(data.entities)
      ApiDoctorsAdviceDispense.dispense(data)
        .then(() => {
          this.$message.success('配液成功')
          this.getDispenseData()
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 取消配液
    dispenseCancel (row) {
      this.$confirm('确认取消该医嘱配液？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          let _row = JSON.parse(JSON.stringify(row))
          ApiDoctorsAdviceDispense.dispenseCancel({'dispenseId': _row.dispenseList[0]['dispenseId']})
            .then(() => {
              this.$message.success('取消配液成功')
              this.getDispenseData()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        })
    },
    // 取消复核
    recoveryCancel (row) {
      this.$confirm('确认取消复核该条医嘱？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          let _row = JSON.parse(JSON.stringify(row))
          ApiDoctorsAdviceDispense.recoveryCancel({'dispenseId': _row.dispenseList[0]['dispenseId']})
            .then(() => {
              this.$message.success('取消复核成功')
              this.getDispenseData()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        })
    },
    // 打开复核对话框  二期
    openCheckDialog (row) {
      let data = JSON.parse(JSON.stringify(row))
      // data.dispenseCheckStatus = 1 // 复核状态
      // data.dispenseList[0]['dispenseCheckStatus'] = 1 // 复核状态
      Object.assign(this.dispense_check_form, data)
      this.dialogFormVisible = true
    },
    // 验证登录账户
    dialogFormConfirm () {
      ApiUser.verify_password({
        loginName: this.dispense_check_form.account,
        loginPassword: this.dispense_check_form.password
      })
        .then(res => {
          if (res.data) {
            if (this.dispense_check_form.dispenseList[0]['dispenseNurse'] && this.dispense_check_form.dispenseList[0]['dispenseNurse'] === res.data) {
              this.$message.error('复核人员与配液人员为同一人')
            } else {
              this.dispense_check_form.dispenseList[0]['dispenseCheckNurse'] = res.data // 复核人员
              this.dispenseRecovery(this.dispense_check_form)
            }
          } else {
            this.$message.error('账户名或者密码错误')
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
      this.dialogFormVisible = false
    },
    // 复核
    dispenseRecovery (row) {
      let data = {
        dispenseId: row.dispenseList[0]['dispenseId'],
        nurseId: row.dispenseList[0]['dispenseCheckNurse']
      }
      ApiDoctorsAdviceDispense.recovery(data)
        .then(() => {
          this.$message.success('复核成功')
          this.getDispenseData()
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    getRowKeys (row) {
      return row.executeId
    },
    handleSelectable (row) {
      return row.main
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getDispenseData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getDispenseData()
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
    },
    // 打印全部或选中的
    printAll () {
      if (!this.hasPatient()) {
        return false
      }
      this.$emit('option-changed', 'batchPrint', this.multipleSelection.length > 0 ? this.multipleSelection : null, this.patientsArr)
    },
    hasPatient () {
      if (this.checkedPatientsIds.length === 0) {
        this.$message.warning('请先选择患者！')
        return false
      }
      return true
    },
    formatTime (value) {
      return moment(value).format('HH:mm')
    },
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";

  /deep/ .el-main {
    padding: 0 !important;
  }

  /deep/ .query-terms > div.query-container {
    z-index: 1000 !important;
  }

  .lineButton {
    /*color: none;*/
    text-decoration: underline;
    padding-right: 5px !important;
  }

  .btn-textGrayToBlue {
    position: relative;
    color: #666;
  }

  .patientContainer {
    .sanjiao {
      position: absolute;
      top: -20px;

      &:before, &:after {
        position: absolute;
        content: '';
        border-top: 10px transparent dashed;
        border-left: 10px transparent dashed;
        border-right: 10px transparent dashed;
        border-bottom: 10px #fff solid;
      }

      &:before {
        border-bottom: 10px #e4e7eb solid;
      }

      &:after {
        top: 1px;
        border-bottom: 10px #fff solid;
      }
    }
  }

  .btn-textGrayToBlue .el-icon-arrow-down, .btn-textGrayToBlue .el-icon-arrow-up {
    color: none;
    font-weight: bold;
  }

  @media screen and (max-width: 1680px) {
    .patientContainer {
      width: 880px;
    }
  }

  @media screen and (min-width: 1680px) {
    .patientContainer {
      width: 1060px;
    }
  }

  .patientContainer {
    border: 1px solid #e4e7eb;
    box-shadow:0px 0px 5px 0px rgba(200,200,200,0.59);
    /*width: 1060px;*/
    height: 214px;
    position: fixed;
    top: 36px; //left定位为js动态设置
    z-index: 1001;
    background-color: #FFFFFF;
    border-radius:2px;
    .flexContainer {
      display: flex;
      flex-direction: column;
      height: 100%;
      .btnOperation {
        margin: 8px 22px 0;
        border-bottom: 1px solid #efefef;
        height: 44px;
      }

      .patientList {
        margin: 14px 22px;
        flex: 1;
        overflow: auto;

        .bedName {
          padding-right: 10px;
        }
      }
    }
  }

  /deep/ .el-checkbox {
    height: 24px;
    line-height: 24px;
    display: inline-flex;
    align-items: center;
    margin-right: 0;
  }

  /deep/ .el-checkbox__input {
    width: 14px;
  }

  /deep/ .el-checkbox .el-checkbox__label {
    flex: 1;
    width: 140px;
    overflow: hidden;

    .nameContent {
      width: 100%;
      display: inline-flex;

      .bedName {
        flex: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .patientName {
        width: 76px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }

  }

  .table {
    flex: 1;
    height: 0;
    overflow: hidden;
  }

  /deep/ .el-dialog__wrapper .el-dialog {
    width: 22%;
  }

  /*蓝色文字按钮*/
  .el-button--text, .el-button--textblue.is-disabled, .el-button--textblue.is-disabled:focus, .el-button--textblue.is-disabled:hover, .el-button--textblue:active {
    border-color: transparent
  }

  .el-button--textblue {
    width: 70px;
    border-radius: 2px !important;
    color: #1e87f0;
    margin-right: 10px;
    background-color: transparent;
    border-color: #1e87f0;
  }

  .el-button--textblue:hover, .el-button--textblue:active {
    color: #FFFFFF;
    border-color: transparent;
    background-color: #1e87f0;
  }
</style>
<style lang="scss" type="text/scss">
  .checkDialogStyle{
    .el-dialog__body{
      .el-input{
        width: 300px;
      }
    }
    .el-dialog__footer{
      padding-top: 5px;
    }
  }
</style>