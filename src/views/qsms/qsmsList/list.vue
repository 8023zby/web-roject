<!--
  文件描述：基于新UI的list页面-问卷-答卷列表
    主样式class：list-page-new
  创建时间：2020/4/23 18:29
  创建人：Administrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
  关于主体查询方法，方法名为：executeQueryPage
  表格数据变量为：pagination.list

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行

   病区：pageFrom == ''
    查询条件：统计时间
    列表：病区问卷的答卷列表页与全院问卷的答卷列表页功能一致，区别在于无护理单元筛选项以及护理单元列
    查询，需要传默认的护理单元：selectDeptInfo.deptId

   全院： pageFrom == WH
    查询条件：护理单元（自己选）、统计时间
    列表：“多选”“护理单元”“患者姓名”“责任护士”“主管医生”“提交时间”“得分”“操作”

-->
<template>
  <el-container class="list-page-new">
    <el-header height="auto" class="header-hastitle">
      <!--有标题的话，header的class = header-hastitle-->
      <div class="title">
        <slot name="title">
          答卷列表
        </slot>
      </div>
      <!--查询条件模块 === START-->
      <div class="">
        <div class="query-items-container" ref="query_form">
          <slot name="query">

          </slot>
        </div>
      </div>
      <!--查询条件模块 === END-->

      <div class="tool-container">
        <div class="left">
          <!--左边按钮-->
          <slot name="left_btn">

          </slot>
        </div>
        <div class="right">
          <!--右边按钮-->
          <slot name="right_btn">
            <el-button type="primary"  @click="pageBack" size="mini">返回</el-button>
          </slot>
        </div>
      </div>
    </el-header>
    <div style="padding: 0 20px;border-bottom: 1px solid #dbdbdb;">
      <el-form :inline="true" class="demo-form-inline query-area">
         <el-form-item label="护理单元:" v-if="pageFrom === 'WH'">
          <el-select v-model="nurseUnitId" placeholder="全部"
          >
            <el-option
              v-for="item in nurseUnitList"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            />
          </el-select>
        </el-form-item>
        <!--<el-form-item label="责任护士">
          <el-select
            v-model="search.nurseName"
            placeholder="全部"
            size="mini"
            :disabled="search.nurseUnitId.length===0"
          >
            <el-option value>全部</el-option>
            <el-option
              v-for="item in objNurse"
              :key="item.empId"
              :label="item.empName"
              :value="item.empId"
            />
          </el-select>
          &lt;!&ndash; objDoctor &ndash;&gt;
        </el-form-item>
        <el-form-item label="主管医生">
          <el-select
            size="mini"
            v-model="search.doctorName"
            placeholder="全部"
            :disabled="search.nurseUnitId.length===0"
          >
            <el-option value>全部</el-option>
            <el-option
              v-for="item in objDoctor"
              :key="item.empId"
              :label="item.empName"
              :value="item.empId"
            />
          </el-select>
        </el-form-item>-->

        <el-form-item label="统计时间:">
          <el-date-picker
            v-model="timeVal"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button
              type="primary"
              @click="queryHandler"
              class="el-button-radius"
              icon="el-icon-search"
            >搜索</el-button>
            <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item />
      </el-form>
    </div>
    <div style="padding: 10px 30px;text-align: right;">
      <el-button type="success" @click="PrintElem">打印问卷</el-button>
    </div>
    <el-main>
      <!--主体列表-->
      <slot name="main">
        <el-table
          :data="pagination.list"
          select-all
          @select="handleSelect"
          @select-all="handleALL"
          height="100%"
        >
          <el-table-column type="selection" width="105"  align="center"/>
          <el-table-column label="护理单元" prop="nurseUnitName" align="center"  v-if="pageFrom === 'WH'"/>
          <el-table-column label="患者姓名" prop="patientName" align="center" />
          <el-table-column label="责任护士" prop="nurseName" align="center" />
          <el-table-column label="主管医生" prop="doctorName" align="center" />
          <el-table-column label="提交时间" prop="createDate" align="center" />
          <el-table-column label="得分" prop="sorce" align="center" />
          <el-table-column label="操作" width="250" align="center">
            <template slot-scope="scope">
              <span class="el-button-text-color" @click="ShowData(scope.$index, scope.row)">患者信息</span>
              <span class="el-button-text-color" @click="ShowDetails(scope.$index, scope.row)">查看答卷</span>
            </template>
          </el-table-column>
        </el-table>
      </slot>
    </el-main>

    <el-footer height="auto" class="page-bar">
      <!--分页条-->
      <slot name="footer">
        <pagination
          :pagination="pagination"
          @page-size-changed="pageSizeChangeHandler"
          @page-changed="pageChangeHandler"
        />
      </slot>
    </el-footer>
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <!--打印信息-->
      <div style="display: none">
        <section ref="print" id="myHtmlElement" v-html="printHtml">

        </section>
      </div>
      <!--患者信息-->
      <el-dialog :visible.sync="dialogSortVisible" title="患者信息" width="400px">
        <el-form :model="form" class="qsmsList-patientinfo">
          <div>
            <el-form-item label="护理单元:" :label-width="formLabelWidth">
              <label>{{form.deptName || ''}}</label>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="住院号:" :label-width="formLabelWidth">
              <label>{{form.inpNo || ''}}</label>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="姓名:" :label-width="formLabelWidth">{{form.patientName || ''}}</el-form-item>
          </div>
          <div>
            <el-form-item label="性别:" :label-width="formLabelWidth">
              <label>{{form.sex || ''}}</label>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="年龄:" :label-width="formLabelWidth">
              <label>{{Number(form.patientAgeYear) === 0 ? form.patientAge :  form.patientAgeYear}}</label>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="护理级别:" :label-width="formLabelWidth">
              <label>{{form.nurseLevel || ''}}</label>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="主管医生:" :label-width="formLabelWidth">
              <label>{{form.doctorName || ''}}</label>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="责任护士:" :label-width="formLabelWidth">
              <label>{{form.nurseName || ''}}</label>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="入院时间:" :label-width="formLabelWidth">
              <label>{{form.inTime || ''}}</label>
            </el-form-item>
          </div>
        </el-form>
      </el-dialog>

      <el-dialog :visible.sync="dialogSheet" title="查看答卷" width="50%" class="clsStor">
        <el-row :gutter="20">
          <div class="divtable" v-if="askDetails !== null && askDetails.length > 0">
            <div v-for="(item, index) in askDetails" :key="index" class="g-content">
              <div class="d-info">
                <span>护理单元：</span>
                <span>{{item.nurseUnitName}}</span>
              </div>
              <div class="d-info">
                <span>床号：</span>
                <span>{{item.bedNo}}</span>
              </div>
              <div class="d-info">
                <span>住院号：</span>
                <span>{{item.hospitalizationNumber}}</span>
              </div>
              <div class="d-info">
                <span>提交时间：</span>
                <span>{{item.createDate}}</span>
              </div>
              <div class="d-info">
                <span>患者：</span>
                <span>{{item.patientName}}</span>
              </div>
              <div class="d-info">
                <span>得分/总分：</span>
                <span>{{item.sorce}}/{{item.sumSorce}}</span>
              </div>
              <div v-for="(value, key) in item.questionsDoList" :key="key" class="qsmsClass">
                <div class="qsmsNameClass">
                  {{ value.sort }} <span v-if="value.sort!==''">、</span>  {{ value.title }} {{ value.questionType === 5 || value.questionType === 2
                  ? ''
                  : `( ${value.answer || ''} )`}}
                </div>
                <!--问题类型字典： 0、单选  1、多选  2、简答  3、单选评分 4、多选评分 5、段落说明-->
                <!--简答题-->
                <section v-if="value.questionType === 2">
                  <div class="qsmsClass">{{value.answer === null?'暂无数据':value.answer}}</div>
                </section>
                <section v-else-if="value.questionType !== 5 ">
                  <div v-for="(v, i) in value.optionsDoList" :key="i" class="qsms-answer">
                    <div class="grid-content bg-purple">{{v.sortIndex}}：{{ v.content }}</div>
                  </div>
                </section>
                <!--<div class="qsmsClass" v-if="value.optionsDoList == null || value.optionsDoList.length<=0">暂无数据</div>
                <div v-for="(v, i) in value.optionsDoList" :key="i" class="qsms-answer">
                  <div class="grid-content bg-purple">{{v.sortIndex}}：{{ v.content }}</div>
                </div>-->
              </div>
            </div>
          </div>
          <div v-else class="nodata"></div>
        </el-row>
      </el-dialog>
    </slot>
  </el-container>
</template>

<script>
import { deepMerge } from '@/assets/qsms/utils'
import BaseQueryPageForm from '../common/BaseQueryPageForm'
import * as qsmsApi from '@/api/qsms/qsmsManage/qsmsList'
import Pagination from '@/components/qsms/paginations/pagination'
import { getOneDate } from '@/assets/qsms/utils/dateFormat'
import { selectDeptInfoData } from '@/assets/qsms/utils/common'
import getStorageUser from '@/assets/qsms/utils/storageUser'
import printJS from 'print-js'

export default {
  components: { Pagination },
  mixins: [BaseQueryPageForm],
  inject: ['routerTo'],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    const search = this.initQueryCriteria()
    const timeVal = getOneDate('month', this.nums)
    return {
      isRouter: false,
      printHtml: '', // 打印信息
      nurseUnitId: '',
      pageFrom: '',
      nurseUnitList: [],
      selectDeptInfo: null,
      form: {},
      timeVal: timeVal,
      Details: {},
      rowData: [],
      askDetails: [],
      dialogSortVisible: false,
      dialogSheet: false,
      formLabelWidth: '100px',
      search: search,
      objNurse: [], // 护士
      objDoctor: [] // 医生
    }
  },
  created () {
    if (!this.detail.paperId) {
      let q = this.$route.query

      this.detail.paperId = q.paperId
      this.detail.title = q.title
      this.detail.pageFrom = q.pageFrom

      this.search = this.initQueryCriteria()
      this.isRouter = true
    }
    console.log('答卷列表：', this.detail)
  },
  mounted () {
    // this.getNursesDoctors()
    if (this.detail.pageFrom) this.pageFrom = this.detail.pageFrom
    this.nurseUnitList = getStorageUser('dataDeptInfoList')

    this.selectDeptInfo = selectDeptInfoData()
    if (this.pageFrom !== 'WH') this.search.nurseUnitId = this.selectDeptInfo.deptId

    if (this.nurseUnitList === null) this.nurseUnitList = []
    this.executeQueryPage()
  },
  methods: {
    pageBack () {
      if (this.isRouter) {
        this.$router.go(-1)
      } else {
        this.$emit('option-changed', 'backQsmsList')
      }
    },
    getNursesDoctors () {
      qsmsApi.getNurses().then(res => {
        if (res.status === 200) {
          this.objNurse = res.data
        }
      })
      qsmsApi.getDoctors().then(res => {
        if (res.status === 200) {
          this.objDoctor = res.data
        }
      })
    },
    ShowDetails (index, row) {
      qsmsApi.Details(row.id).then(res => {
        if (res.status === 200) {
          for (let i = 0; i < res.data.length; i++) {
            let sort = 0
            for (let v of res.data[i].questionsDoList) {
              if (v.questionType === 5) {
                v.sort = ''
              } else {
                sort++
                v.sort = sort
              }
            }
          }
          this.askDetails = res.data
          this.dialogSheet = true
        }
      })
    },
    ShowData (index, row) {
      this.dialogSortVisible = true
      // row.patientId
      qsmsApi
        .getcardId(row)
        .then(res => {
          if (res.status === 200 && res.data !== null) {
            this.form = res.data
          }
        })
        .catch(res => {
          console.log(res.desc)
        })
    },
    // 点击打印时
    PrintElem () {
      if (this.rowData.length === 0) {
        this.$message({
          type: 'info',
          message: '请勾选打印列表'
        })
        return
      }
      qsmsApi.Details(this.rowData).then(res => {
        if (res.status === 200) {
          this.rowData = []
          for (let i = 0; i < res.data.length; i++) {
            let sort = 0
            for (let v of res.data[i].questionsDoList) {
              if (v.questionType === 5) {
                v.sort = ''
              } else {
                sort++
                v.sort = sort
              }
            }
          }
          this.tablePrint(res.data)
          this.executeQueryPage()
        }
      })
    },
    createTrContent (v) {
      const a =
        v.questionType === 5 || v.questionType === 2
          ? ''
          : `( ${v.answer || ''} )`
      return a
    },
    // 点击打印拼接
    tablePrint (T) {
      const objArr = T
      var json = ''

      json = `
        <div style=" width:100%; height:100%;">
        <div class="top" style=" width:100%;">`
      objArr.forEach((value, index) => {
        json += `<div style="text-align:center; padding: 8px">${
          this.detail.title
        }</div><div  style="text-align:left;width:100%;display: flex;justify-content: flex-start;">
            <div style="width:33.3%;">
              <p>护理单元:${value.nurseUnitName || ''}</p>
              <p>提交时间:${value.createDate || ''}</p>
            </div>
            <div style="width:33.3%;">
              <p>床号:${value.bedNo || ''}</p>
              <p> 姓名:${value.patientName || ''}</p>
            </div>
            <div style="width:33.3%;">
              <p>住院号:${value.hospitalizationNumber || ''}</p>
              <p>得分/总分:${value.sorce || ''}/${value.sumSorce || ''}</p>
            </div>

          </div>
          <div  >`
        if (value.questionsDoList !== null) {
          value.questionsDoList.forEach((v, i) => {
            // 内容体
            json += `
          <p  style="font-weight:900;">
          ${v.sort}${v.sort === '' ? '' : '、'}${v.title}
          ${this.createTrContent(v)}
          </p>`
            if (v.questionType === 2) {
              json += '<p>' + (v.answer === null ? '暂无数据' : v.answer) + '</p>'
            } else if (v.questionType !== 5) {
              if (v.optionsDoList !== null) {
                v.optionsDoList.forEach((item, key) => {
                  json += `<p>${item.sortIndex}：${item.content}</p>`
                })
              }
            }
          })
        }

        json += `</div> <div style="page-break-after: always"></div>`
      })
      json += ` </div></div>`

      this.printHtml = json

      setTimeout(() => {
        printJS({
          printable: 'myHtmlElement',
          type: 'html',
          scanStyles: false,
          // style: styleStr,
          // css: './print.css',//static 目录下
          'targetStyle': ['*']
        })
      }, 2000)
      return true
    },
    /* 全选 */
    handleALL (val) {
      this.handleSelect(val)
    },
    /*  获取当前选中的数据 */
    handleSelect (row) {
      if (row.length > 0) {
        row.forEach((value, index) => {
          this.rowData.push(value.id)
        })
      }
    },
    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        nurseData: [], // 责任护士
        nurseName: '', // 护士
        doctorName: '', // 医生
        beginTime: '', // this.timeVal[0],
        endTime: '', // this.timeVal[1],
        nurseUnitId: '',
        paperId: this.detail.paperId
      })
    },
    /* 获取列表 */
    executeQueryPage () {
      this.search.beginTime = this.timeVal[0]
      this.search.endTime = this.timeVal[1]
      if (this.pageFrom === 'WH') {
        if (this.nurseUnitId === '') {
          let n = []
          if (this.nurseUnitList.length > 0) {
            for (let v of this.nurseUnitList.values()) {
              n.push(v.deptId)
            }
          }
          this.search.nurseUnitIds = n.join(',')
          this.search.nurseUnitId = ''
        } else {
          this.search.nurseUnitIds = ''
          this.search.nurseUnitId = this.nurseUnitId
        }
      }
      qsmsApi.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = this.initQueryCriteria()
      this.nurseUnitId = ''
      this.timeVal = getOneDate('month', this.nums)
      this.queryHandler()
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>
  @import '@/assets/qsms/css/self_common.scss';
  .qsmsList-patientinfo{
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
      margin-bottom: 6px;
    }
  }
  .clsStor{
    .divtable{
      height: 100%;
      padding: 10px 16px;
      .g-content{
        .d-info{
          padding: 6px 0;
          span{
            display: inline-block;
          }
          span:nth-child(1){
            width: 100px;
            text-align: right;
            color: #646464;
          }
          span:nth-child(2){
            text-align: left;
            color: #3a3a3a;
          }
        }

        .qsmsClass{
          padding: 8px 13px;
          .qsmsNameClass{
            padding: 0 0 10px 0;
            color: #292929;
          }
          .qsms-answer{
            padding: 2px 25px;
          }
        }
      }
    }
  }
</style>
