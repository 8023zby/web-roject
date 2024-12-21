<template>
  <layout-list v-loading="loading">
    <div slot="left_btn" class="tool-bar" v-if="!isPreview">
      <el-button type="warning" icon="el-icon-plus" @click="addNote" size="small"
                 :disabled="btn_disable"
                 v-uni="'hulijilu_add'"
      >添加
      </el-button>
    </div>
    <div slot="right_btn" class="tool-bar" v-if="!isPreview">
      <el-button type="primary" v-uni="'hulijilu_xiaojie'" @click="showSummary('small')" size="small" :disabled="btn_disable || no_data_disable" v-if="smallSummaryFlag">
        小结
      </el-button>
      <el-button type="primary" v-uni="'hulijilu_zongjie'" @click="showSummary('big')" size="small" :disabled="btn_disable || no_data_disable" v-if="allSummaryFlag">
        总结
      </el-button>
      <el-button type="primary" v-uni="'hulijilu_shenyue'" @click="reviewShowWin" size="small" :disabled="btn_disable || no_data_disable" v-if="checkFlag">
        审阅
      </el-button>

      <el-button type="primary" v-uni="'hulijilu_shenqian'" @click="signingShowWin" size="small" :disabled="btn_disable || no_data_disable" v-if="signFlag">
        审签
      </el-button>
      <el-button type="success" v-uni="'hulijilu_print'" @click="printPreview" size="small">
        打印
      </el-button>
    </div>
    <div slot="main" class="main-list">
      <!-- 表头 -->
      <formHeader :autoHead="autoHead" v-if="showHead"></formHeader>
      <div class="table">
        <el-table
          ref="table"
          stripe
          highlight-current-row
          :row-key="getRowKeys"
          @selection-change="handleSelectionChange"
          :data="plist"
          border
          style="width: 100%;"
          height="100%"
        >
          <el-table-column
            type="selection"
            reserve-selection
            width="60"
            align="center"
            :selectable="selecTable"
          >
          </el-table-column>
          <!-- <el-table-column type="index" label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>
                {{(search_from.page - 1) * search_from.size + scope.$index + 1}}
              </span>
            </template>
          </el-table-column> -->

          <el-table-column
            width="100"
            align="center"
            label="日期"
            v-if="formCode === 'H-000010-WHJ-0021' || formCode === 'H-000010-WHJ-0024'"
          >
            <template slot-scope="scope">
              <span v-html="formatRecordDate(scope.row.recordDate,'day')" v-if="scope.row.recordType === 2" style="color:#F56C6C"></span>
              <span v-html="formatRecordDate(scope.row.recordDate,'day')" v-else></span>
            </template>
          </el-table-column>

          <el-table-column
            width="100"
            align="center"
            label="时间"
            v-if="formCode === 'H-000010-WHJ-0021' || formCode === 'H-000010-WHJ-0024'"
          >
            <template slot-scope="scope">
              <span v-html="formatRecordDate(scope.row.recordDate,'hour')" v-if="scope.row.recordType === 2" style="color:#F56C6C"></span>
              <span v-html="formatRecordDate(scope.row.recordDate,'hour')" v-else></span>
            </template>
          </el-table-column>

          <el-table-column
            width="100"
            align="center"
            label="时间"
            v-else
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.shiboExtend" v-html="formatRecordDate(scope.row.recordDate,'time')"></span>
            </template>
          </el-table-column>

          <!-- 递归列 -->
          <template v-for="item in fixed_item">
            <column :signItem="item" :formCode="formCode" :key="item.id"></column>
          </template>

          <!--循环表单配置项-->
          <el-table-column
              show-overflow-tooltip
              min-width="200"
              v-for="(item,index) in conditionItems"
              :key="index"
            >
            <template slot="header">
              <div style="text-align: center; display: block">{{item.projectName}}</div>
            </template>
            <template slot-scope="scope">
              {{scope.row.conditionTxt?scope.row.conditionTxt[item.id] : ''}}
            </template>
          </el-table-column>

          <el-table-column label="护士签名"
            prop="patientName"
            width="116"
            align="center"
            class-name="autograph"
          >
            <template slot-scope="scope">
              <span class="sign_name" v-if="scope.row.nursingAutograph">
                <span class="text">
                  <template v-if="scope.row.nursingAutographImage">
                    <span><img :src="scope.row.nursingAutographImage"
                               style="width: 100%; height: 100%"></span>
                  </template>
                  <template v-else>
                    <span style="text-align: left; padding-left: 2px">{{scope.row.nursingAutograph}}</span>
                  </template>

                  <template v-if="scope.row.userNameImage">
                    <span><img :src="scope.row.userNameImage" style="width: 100%; height: 100%"></span>
                  </template>
                  <template v-else>
                    <span style="text-align: right; padding-right: 2px">{{scope.row.userName}}</span>
                  </template>
                </span>
                <img class="line" src="../../../assets/nrms/images/line.png">
              </span>
              <span v-else>
                <template v-if="scope.row.userNameImage">
                  <img :src="scope.row.userNameImage" style="width: 100%; height: 30px">
                </template>
                <template v-else>
                  {{scope.row.userName}}
                </template>
              </span>
            </template>
          </el-table-column>
          <!-- 省立内科护理单，不需要护士长签名 -->
          <el-table-column label="护士长签名"
            prop="leaderAutograph"
            width="120"
            align="center"
            class-name="autograph"
            v-if="signFlag && formCode !== 'H-000010-WHJ-0021' && formCode !== 'H-000010-WHJ-0022' && formCode !== 'H-000010-WHJ-0024'"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.leaderAutographImage">
                <img :src="scope.row.leaderAutographImage"
                     style="width: 100%; height: 30px">
              </template>
              <template v-else>
                {{scope.row.leaderAutograph}}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <template v-if="!scope.row.shiboExtend">
                <template v-if="scope.row.recordType">
                  <el-button v-uni:[scope.$index]="'hulijilu_xiaojiezongjie_edit'" @click="showSummary(scope.row.recordType === 1 ? 'small' : 'big', scope.row)" type="text"
                             :disabled="btn_disable"
                  >编辑
                  </el-button>
                </template>
                <template v-else>
                  <el-button v-uni:[scope.$index]="'hulijilu_edit'" @click="editNote(scope.row)" type="text"
                             :disabled="btn_disable"
                  >编辑
                  </el-button>
                </template>
                <el-button
                  v-uni:[scope.$index]="'hulijilu_delete'"
                  type="textred"
                  @click="deleteNote(scope.row)"
                  :disabled="btn_disable"
                >删除
                </el-button>
                 <el-tooltip class="item" v-if="scope.row.skipPage" effect="dark" content="换页" placement="bottom">
                  <span class="isPage" ></span>
                </el-tooltip>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页 -->
    <div slot="footer" class="page-bar" v-if="!isPreview">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="search_from.page"
        :page-size="search_from.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
        v-uni="'hulijilu_pagination'"
      >
      </el-pagination>
    </div>

    <!-- 打印组件 此处样式不能用display:none，因为none的话 在打印界面通过ref获取不到表头的高度，无法计算每页显示打印行数 hanzhe-->
    <div style="position: fixed;top: 10000px;z-index: -1000;">
      <print-page ref="print" v-if="patient.patientId" :patient="patient" :formId="formId" :formCode="formCode" :signFlag="signFlag"></print-page>
    </div>

    <!-- 小结/总结 -->
    <Summary
      :visible.sync="summaryVisible"
      v-if="summaryVisible"
      :type="summaryType" :patientId="patient.patientId" :formId="formId" :ruSignItem="ruSignItem"
      :formCode="formCode"
      :chuSignItem="chuSignItem"
      :detail="summaryData"
      @callBack="getData"
    ></Summary>

    <template slot> <!-- 审签/审阅 输入密码框 -->
      <el-dialog
        class="trial_window"
        :title="trialType==='shenyue'?'审阅':'审签'"
        :close-on-click-modal="false"
        :visible.sync="trialDialogVisible"
        :show-close="false"
        custom-class="classifyDialogStyle"
        width="490px">
        <span>
          <el-form ref="trial_form" label-width="110px" label-suffix=":">
            <el-form-item label="用户名" prop="account">
              <el-input
                v-model="current_account.account"
                disabled
                placeholder=""
                v-uni="'hulijilu_shenyueshenqian_yonghuming'"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
              <el-input
                type="password"
                v-model="current_account.password"
                placeholder="请输入"
                autocapitalize="off"
                required
                v-uni="'hulijilu_shenyueshenqian_yonghumima'"
              ></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'hulijilu_shenyueshenqian_cancel'" @click="trialDialogVisible = false">取消</el-button>
          <el-button v-uni="'hulijilu_shenyueshenqian_confirm'" type="primary" @click="changeTrial">确认</el-button>
        </span>
      </el-dialog>
    </template>
  </layout-list>
</template>

<script>
import moment from 'moment'
import column from './column'
import printPage from './Print'
import Summary from './Summary'
import layoutList from '../../../components/nrms/layout/list'
import formHeader from '../../../components/nrms/autoForm/header'
import { ApiNurseNotes, ApiUser, ApiAutoForm } from '../../../api/nrms'

export default {
  name: 'nurse_notes_list',
  props: ['patient', 'formId', 'formCode', 'remarks', 'isPreview'],
  inject: ['checkAuthority'],
  data () {
    return {
      name: true,
      loading: false,
      table_height: '500px',
      table_index: 0,
      page_total: 0,
      plist: [],
      multipleSelection: [],
      trialDialogVisible: false,
      trialType: '',
      // 当前登录用户信息
      current_account: {
        id: '',
        account: '',
        empName: '',
        deptName: '',
        password: ''
      },
      fixed_item: {},
      // 查询表单
      search_from: {
        deptId: '',
        patientId: '',
        formId: '',
        size: 10,
        page: 1
      },
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      showHead: false,
      formListObj: {}, // 查询表头存放数据
      conditionItems: [], // 配置项存放字段,
      checkFlag: true, // 审阅按钮权限
      signFlag: true, // 审签按钮权限
      smallSummaryFlag: false, // 小结按钮权限
      allSummaryFlag: false, // 总结按钮权限
      // 2020-12-25 世博医院 formCode:H-000010-WHJ-0005: 脉搏/心率。 储存signId
      maiboXinlvItemId: '999999999',
      xinlvSignId: '',
      maiboSignId: '',
      xueyaSignId: '',
      summaryVisible: false,
      summaryType: 'small',
      summaryData: {},
      // 小结/总结使用
      ruSignItem: {},
      // 小结/总结使用
      chuSignItem: {},
      notice: ''
    }
  },
  computed: {
    btn_disable: function () {
      // 出院&&非出院召回 || 转科
      if ((this.patient.patientType === 2 && this.patient.outHospitalFlag !== 1) || this.patient.patientType === 1) {
        return true
      }
      return false
    },
    no_data_disable: function () {
      if (this.plist.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    // 初始化
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    let userId = localStorage.getItem('userId') || ''
    this.search_from.deptId = deptInfo.deptId
    this.search_from.formId = this.formCode // 此处传参title是formId  实际内容是formCode的内容
    this.search_from.patientId = this.patient.patientId || ''
    this.current_account.id = empInfo.empId
    this.current_account.account = userId
    this.current_account.empName = empInfo.empName
    this.current_account.deptName = deptInfo.deptName
    this.checkBtnAuthority() // 获取审阅审签按钮权限

    // this.search_from.patientId && this.getData()
  },
  activated () {
    this.reLayout()

    this.search_from.patientId && this.getData()
  },
  updated () {
    this.reLayout()
  },
  methods: {
    selecTable (row, index) {
      if (row.shiboExtend) {
        return false
      } else {
        return true
      }
    },
    reLayout () {
      this.$nextTick(function () {
        this.$refs.table.doLayout()
      })
    },
    // 处理权限
    checkBtnAuthority () {
      this.checkFlag = this.checkAuthority('Review')
      this.signFlag = this.checkAuthority('examine')
      // 2020-12-25 世博医院-危重护理记录单formCode:H-000010-WHJ-0005
      // 2021-04-12 中心医院通过危急值订单定制护理记录单，增加remarks中的属性来控制小结、总结的显示
      // 显示小结/总结按钮
      if (this.formCode === 'H-000010-WHJ-0005' || this.formCode === 'H-000010-WHJ-0024') {
        if (this.remarks) { // 存在备注信息
          const { smallSummaryFlag, allSummaryFlag } = this.remarks || {}
          this.smallSummaryFlag = smallSummaryFlag || false
          this.allSummaryFlag = allSummaryFlag || false
        } else {
          this.smallSummaryFlag = true
          this.allSummaryFlag = true
        }
      } else if (this.remarks) { // 存在备注信息
        const { smallSummaryFlag, allSummaryFlag } = this.remarks || {}
        this.smallSummaryFlag = smallSummaryFlag || false
        this.allSummaryFlag = allSummaryFlag || false
      }
    },
    getFormInfo () {
      ApiAutoForm.getFormDict({ formId: this.formId }).then((res) => {
        if (res.data == null || res.data.length === 0) {
          this.$message.error('请先配置表单样式')
        } else {
          let data = res.data || {}
          this.formListObj = data
          this.conditionItems = data.formDictExtendDoList ? data.formDictExtendDoList : []

          this.autoHead.tplData = this.patient || null
          this.autoHead.tplId = res.data.formCode || ''
          this.autoHead.formName = res.data.formName || ''
          this.autoHead.tplHtml = res.data.formStyle || ''
          this.showHead = true
        }
      })
    },
    getFixedItem () {
      ApiNurseNotes.getFixedListItem({ formId: this.formId }).then(res => {
        let items = res.data
        // 2020-12-25 世博医院 危重护理记录单 formCode:H-000010-WHJ-0005
        // 心率和脉搏在一列显示
        // 首先要保证心率和脉搏体征项没有上级，本身就是顶级
        let index = null
        let index2 = null
        // if (this.formCode === 'H-000010-WHJ-0005') {
        for (let i = 0; i < items.length; i++) {
          items[i]['hidden'] = 0
          // 存储血压的signId
          if (items[i]['signItemFieldName'] === 'xueya') {
            this.xueyaSignId = items[i]['signId']
          }

          if (this.formCode === 'H-000010-WHJ-0005' || this.formCode === 'H-000010-WHJ-0024') {
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
              } else {
                index2 = i
              }
            }
            // 入量
            if (items[i]['signItemFieldName'] === 'ruliang') {
              let _j = JSON.parse(JSON.stringify(items[i]))
              // 省立去掉 实入交接时间的统计
              _j.childrenSignItem = _j.childrenSignItem.filter((v) => {
                if (v.signItemFieldName !== 'shirujiaojieshijian') {
                  return v
                }
              })
              this.ruSignItem = _j
            }
            // 出量
            if (items[i]['signItemFieldName'] === 'shiruliangfuqin') {
              this.chuSignItem = items[i]
            }
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
          newItem['signItemShowName'] = name.join('/')
          newItem['signItemFieldName'] = field.join('/')
          let insertIndex = index > index2 ? index : index2
          items.splice(insertIndex, 0, newItem)
        }
        // }

        this.fixed_item = items

        this.search_from.patientId && this.getData()
      })
    },
    getData () {
      this.loading = true
      ApiNurseNotes.select(this.search_from).then((res) => {
        let list = res.data.list || []
        let newList = []
        // 2020-12-25 世博医院 危重护理记录单 formCode:H-000010-WHJ-0005
        // 入量可以保存多条情况 itemValue都以数组形式返回
        // 需要解析 数组length>1的情况
        list.forEach((v, index) => {
          let ob = {}

          // 2020-12-25 世博医院 危重护理记录单 formCode:H-000010-WHJ-0005
          // 合并心率和脉搏的值
          let maxLen = 1
          let isArrItem = {}
          let xinlv = null
          let maibo = null
          let xueya = []
          v.extendList.forEach(e => {
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

          v.extendList = ob
          newList.push(v)

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
                newList.push({
                  recordId: v.recordId + i,
                  shiboExtend: true,
                  extendList: extendList
                })
              }
            }
          }
        })
        this.plist = newList

        this.page_total = res.data.total
        this.loading = false
      })
    },
    addNote () {
      if (!this.patient.patientId) {
        this.$message.warning('请先选择患者！')
        return false
      }

      this.$emit('option-changed', 'add', this.patient, {}, this.formListObj)
    },
    editNote (data) {
      // 编辑的时候，处理掉添加 的血压数据
      let _data = JSON.parse(JSON.stringify(data))

      for (let k in _data.extendList) {
        if (k === this.xueyaSignId) {
          delete _data.extendList[k]
        }
      }

      this.$emit('option-changed', 'add', this.patient, _data, this.formListObj)
    },
    deleteNote (row) {
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiNurseNotes.delete({ recordId: row.recordId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    // 显示小结总结
    showSummary (type, data) {
      this.summaryType = type
      this.summaryVisible = true
      this.summaryData = data || {}
    },
    // 审阅
    reviewShowWin () {
      if (!this.patient.patientName) {
        this.$message.warning('请先从患者一览选择患者！')
        return false
      }
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选护理记录！')
        return false
      }
      this.trialDialogVisible = true
      this.trialType = 'shenyue'
    },
    // 审签
    signingShowWin () {
      if (!this.patient.patientName) {
        this.$message.warning('请先从患者一览选择患者！')
        return false
      }
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选护理记录！')
        return false
      }
      this.trialDialogVisible = true
      this.trialType = 'shenqian'
    },
    // 审阅/ 审签操作
    changeTrial () {
      // 1。验证用户名密码正确
      ApiUser.verify_password({
        loginName: this.current_account.account,
        loginPassword: this.current_account.password
      }).then(res => {
        if (res.data) {
          // 2。组织数据
          let noteIds = []
          this.multipleSelection.forEach(v => {
            let note = {
              'recordId': v.recordId
            }
            // 审签
            if (this.trialType === 'shenqian') {
              note['leaderAutograph'] = this.current_account.id
              note['leaderId'] = this.current_account.id
            }
            // 审阅
            if (this.trialType === 'shenyue') {
              note['nurseId'] = this.current_account.id
              note['nursingAutograph'] = this.current_account.id
            }
            noteIds.push(note)
          })
          ApiNurseNotes.reviewAndSigning({ data: noteIds }).then(() => {
            this.$message.success('操作成功！')
            this.trialDialogVisible = false
            this.trialType = ''
            this.getData()
          }).catch(res => {
            this.$message.error(res.message)
          })
        } else {
          this.$message.warning('密码错误！')
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 打印
    printPreview () {
      if (!this.patient.patientName) {
        this.$message.warning('请先从患者一览选择患者！')
        return false
      }

      this.$refs.print.showPrintPreview()
    },
    handleSizeChange (val) {
      this.search_from.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.search_from.page = val
      this.getData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getRowKeys (row) {
      return row.recordId
    },
    formatRecordDate (val, type) {
      let date = moment(val).format('YYYY-MM-DD HH:mm')
      let _time = ''
      if (type === 'time') {
        date = moment(val).format('YYYY-MM-DD HH:mm')
        _time = date.split(' ')[0] + '<br/>' + date.split(' ')[1]
      } else if (type === 'day') {
        date = moment(val).format('YYYY-MM-DD')
        _time = date
      } else {
        date = moment(val).format('HH:mm')
        _time = date
      }
      return _time
    }
  },
  components: {
    layoutList, formHeader, column, printPage, Summary
  },
  watch: {
    'formCode': {
      handler: function (val) {
        this.search_from.formId = val
        this.getFormInfo()
        this.getFixedItem()
      },
      immediate: true
    },
    'patient' (val) {
      this.autoHead.tplData = val
      this.search_from.patientId = val.patientId || ''
      this.search_from.page = 1
      this.getData()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  /deep/ .main-list {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
    .table {
      flex: 1;
      height: 0;
      overflow: hidden;
      td{
        position: relative !important;
      }
    }
  }

  .isPage {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border: 10px solid #409EFF;
    border-bottom-color: transparent;
    border-left-color: transparent;
    color: #fff;
  }

  .header {
    text-align: center;
    font-size: 14px;
    line-height: 2;
  }

  .hospital, .title {
    font-size: 18px;
  }

  .patient_basic {
    display: flex;
    justify-content: space-around;
    align-items: center;

    > div {
      display: inline-block;
    }
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
      stroke: #EBEEF5;
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

  /* 日期表头 */
  .date_title {
    height: 80px;
    width: 90px;

    .text {
      span:first-child {
        top: 20px;
        left: 10px;
      }

      span:last-child {
        bottom: 20px;
        right: 10px;
      }
    }
  }

  //签名列
  /deep/ td.autograph {
    padding: 0;

    div {
      display: flex;
      align-items: center;
      text-align: center;
      height: 100%;
      justify-content: center;
    }

    .sign_name {
      display: block;
      position: relative;
      height: 100%;
      width: 100%;
      /*margin-left: -10px;*/
      .text {
        span:first-child {
          top: 2px;
          left: 1px;
          height: 20px;
          width: 65%;
        }

        span:last-child {
          bottom: 2px;
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
  }
</style>
<style lang="scss" type="text/scss">
  .classifyDialogStyle{
    /**, ::after, ::before {*/
      /*box-sizing: inherit;*/
    /*}*/
    .el-dialog__header {
      box-sizing: border-box;
    }
    .el-input,.el-input__inner {
      width: 300px !important;
    }
    .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
      content: '';
    }
    .el-form-item__label{
      padding-right: 5px !important;
    }
  }
</style>
