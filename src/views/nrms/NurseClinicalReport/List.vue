<template>
  <layout_aside v-loading="loading">
    <div slot="aside">
      <patient-list init-row-type="in" init-row-index="0" @initPatient="initPatient" />
    </div>
    <div slot="main" class="right note_list">
      <el-tabs v-model="tabActiveName" value="first" type="card" style="height: 100%;z-index: 1 ">
        <!-- ***********************************************************检查报告 -->
        <el-tab-pane label="检查报告" name="first">
          <layout_list>
            <div slot="query" class="query-items">
              <el-form class="demo-form-inline" :inline="true" :model="inspection_search_from">
                <el-form-item label="开始日期:">
                  <el-date-picker
                    v-model="inspection_search_from.fromDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束日期:">
                  <el-date-picker
                    v-model="inspection_search_from.endDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="检查项目:">
                  <el-input
                    v-model="inspection_search_from.itemContent"
                    size="small"
                    maxlength="32"
                    clearable
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    class="el-button-radius btn-position"
                    icon="el-icon-search"
                    size="small"
                    @click="getData()"
                  >搜索
                  </el-button>

                  <el-button type="text" @click="inspectionReset">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div slot="main" class="main-list">
              <el-table
                highlight-current-row
                :data="inspectionList"
                height="100%"
                :row-style="{height:'44px'}"
                stripe
              >
                <!-- <el-table-column type="index" label="序号" align="center" width="100">
                  <template slot-scope="scope">
                    {{ (inspection_search_from.page - 1) * inspection_search_from.size +
                      scope.$index + 1 }}
                  </template>
                </el-table-column> -->
                <el-table-column align="center">
                  <template slot="header">开嘱时间</template>
                  <template slot-scope="scope">
                    {{ scope.row.doctorAdviceTime|formatDateTimeYMD }}<br>
                    {{ scope.row.doctorAdviceTime|formatDateTimeHMS }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">检查项目</template>
                  <template slot-scope="scope">
                    <span class="multiline-ellipsis">
                      {{ scope.row.inspectionContent }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">申请医生</template>
                  <template slot-scope="scope">
                    {{ scope.row.applyDoctorName }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">检查科室</template>
                  <template slot-scope="scope">
                    {{ scope.row.checkDeptName }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">检查单号</template>
                  <template slot-scope="scope">
                    <span class="multiline-ellipsis">
                      {{ scope.row.inspectionId }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">报告时间</template>
                  <template slot-scope="scope">
                    {{ scope.row.reportTime |formatDateTimeYMD }}<br>
                    {{ scope.row.reportTime |formatDateTimeHMS }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">患者查看</template>
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.switchSetting"
                      :disabled="scope.row.reportStatus!='1'"
                      :active-value="1"
                      :inactive-value="0"
                      @change="inspectionSwitchChange(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">报告状态</template>
                  <template slot-scope="scope">
                    <span v-if="scope.row.reportStatus!=null&&scope.row.reportStatus=='1' && reportType === 'images'">
                      <el-image
                        :ref="'preview' + scope.row.inspectionId"
                        :src="url"
                        style="width: 0px; height: 0px"
                        :preview-src-list="images"
                      />
                      <el-button type="text" @click="showDetail(scope.row)">已出</el-button>
                    </span>
                    <span v-else-if="scope.row.reportStatus!=null&&scope.row.reportStatus=='1'">
                      <el-button type="text" @click="showDetail(scope.row)">已出</el-button>
                    </span>
                    <span v-else style="color: #999;">未出</span>
                  </template>
                </el-table-column>
                <el-table-column label="图像浏览" width="120" align="center">
                  <template slot-scope="scope">
                    <span v-if="isShow(scope.row)">
                      <span v-if="scope.row.imageUrls!==null && scope.row.imageUrls!=='' && scope.row.imageUrls.length !== 0 && imageType === 'images'">
                      <el-image
                        :ref="'previewImg' + scope.row.inspectionId"
                        :src="url"
                        style="width: 0px; height: 0px"
                        :preview-src-list="imageImages"
                      />
                      <el-button type="text" @click.stop="showImages(scope.row)">图像</el-button>
                    </span>
                    <span v-else-if="scope.row.imgUrl!==null && scope.row.imgUrl!=='' && imageType !== 'images'">
                      <el-button type="text" @click.stop="showImages(scope.row)">图像</el-button>
                    </span>
                    </span>
                    <span v-else style="color: #999;">图像</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div slot="footer" class="page-bar">
              <el-pagination
                :current-page.sync="inspection_search_from.page"
                :page-size="inspection_search_from.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="inspection_page_total"
                @size-change="handleSizeChange_inspection"
                @current-change="handleCurrentChange_inspection"
              />
            </div>
          </layout_list>
        </el-tab-pane>
        <!-- ***********************************************************检验结果 -->
        <el-tab-pane label="检验结果" name="second">
          <layout_list>
            <div slot="query" class="query-items">
              <el-form class="demo-form-inline" :inline="true" :model="examine_search_from">
                <el-form-item label="开始日期:">
                  <el-date-picker
                    v-model="examine_search_from.fromDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="结束日期:">
                  <el-date-picker
                    v-model="examine_search_from.endDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="检验项目:">
                  <el-input
                    v-model="examine_search_from.itemContent"
                    size="small"
                    maxlength="32"
                    clearable
                  />
                </el-form-item>
                <el-form-item>
                  <div class="typt-search-btn">
                    <el-button
                      type="primary"
                      class="el-button-radius"
                      icon="el-icon-search"
                      size="small"
                      @click="getData()"
                    >搜索
                    </el-button>

                    <el-button type="text" @click="examineReset">重置</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div slot="main" class="main-list">
              <el-table
                highlight-current-row
                :data="examineList"
                height="100%"
                :row-style="{height:'44px'}"
                stripe
              >
                <!-- <el-table-column type="index" label="序号" width="60" align="center">
                  <template slot-scope="scope">
                    {{ (examine_search_from.page - 1) * examine_search_from.size +
                      scope.$index + 1 }}
                  </template>
                </el-table-column> -->

                <el-table-column align="center">
                  <template slot="header">开嘱时间</template>
                  <template slot-scope="scope">
                    {{ scope.row.doctorAdviceTime|formatDateTimeYMD }}<br>
                    {{ scope.row.doctorAdviceTime|formatDateTimeHMS }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">检验项目</template>
                  <template slot-scope="scope">
                    <span class="multiline-ellipsis">
                      {{ scope.row.examineContent }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">申请医生</template>
                  <template slot-scope="scope">
                    {{ scope.row.applyDoctorName }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">检验科室</template>
                  <template slot-scope="scope">
                    {{ scope.row.checkDeptName }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">检验单号</template>
                  <template slot-scope="scope">
                    <span class="multiline-ellipsis">
                      {{ scope.row.examineId }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">标本类型</template>
                  <template slot-scope="scope">
                    {{ scope.row.sampleType }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">采集时间</template>
                  <template slot-scope="scope">
                    {{ scope.row.sampleGetTime |formatDateTimeYMD }}<br>
                    {{ scope.row.sampleGetTime |formatDateTimeHMS }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">采集者</template>
                  <template slot-scope="scope">
                    {{ scope.row.sampleGathererName }}
                  </template>
                </el-table-column>

                <el-table-column align="center">
                  <template slot="header">接收时间</template>
                  <template slot-scope="scope">
                    {{ scope.row.sampleReceiveTime|formatDateTimeYMD }}<br>
                    {{ scope.row.sampleReceiveTime|formatDateTimeHMS }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">送检者</template>
                  <template slot-scope="scope">
                    {{ scope.row.sampleSenderName }}
                  </template>
                </el-table-column>

                <el-table-column align="center">
                  <template slot="header">报告时间</template>
                  <template slot-scope="scope">
                    {{ scope.row.reportTime |formatDateTimeYMD }}<br>
                    {{ scope.row.reportTime |formatDateTimeHMS }}
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">患者查看</template>
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.switchSetting"
                      :disabled="scope.row.reportStatus!='1'"
                      :active-value="1"
                      :inactive-value="0"
                      @change="examineSwitchChange(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header">报告状态</template>
                  <template slot-scope="scope">
                    <span v-if="scope.row.reportStatus!=null&&scope.row.reportStatus=='1'">
                      <router-link
                        :to="{name:examineDetailsPath,query:{examineItem:scope.row,patientId:examine_search_from.patientId}}"
                      >
                        <el-button type="text">已出</el-button>
                      </router-link>
                    </span>
                    <span v-else style="color: #999;">未出</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div slot="footer" class="page-bar">
              <el-pagination
                :current-page.sync="examine_search_from.page"
                :page-size="examine_search_from.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="examine_page_total"
                @size-change="handleSizeChange_examine"
                @current-change="handleCurrentChange_examine"
              />
            </div>
          </layout_list>
        </el-tab-pane>
      </el-tabs>
      <router-view />
    </div>
  </layout_aside>
</template>

<script>
import layout_aside from '../../../components/nrms/layout/aside'
import layout_list from '../../../components/nrms/layout/list'
import PatientList from '../../../components/nrms/PatientList'
import { ApiClinicalReport } from '../../../api/nrms'
import moment from 'moment'
import BaseManage from '../../../assets/nrms/mixins/BaseManage'

export default {
  name: 'NurseNotesClinicalReport',
  filters: {
    formatDateTime (time) {
      if (time == null) {
        return
      }
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatDateTimeYMD (time) {
      if (time == null) {
        return
      }
      return moment(time).format('YYYY-MM-DD')
    },
    formatDateTimeHMS (time) {
      if (time == null) {
        return
      }
      return moment(time).format('HH:mm:ss')
    }
  },
  components: {
    PatientList, layout_aside, layout_list
  },
  mixins: [BaseManage],
  data () {
    return {
      images: [],
      imageImages: [],
      url: '',
      loading: false,
      inspection_page_total: 0,
      examine_page_total: 0,
      examine_items_page_total: 0,
      inspectionList: [],
      examineList: [],
      examineItemsList: [],
      // 患者信息
      patient: {},
      // 查询表单
      inspection_search_from: {
        patientId: '',
        fromDate: null,
        endDate: null,
        itemContent: '',
        size: 10,
        page: 1
      },
      examine_search_from: {
        patientId: '',
        fromDate: null,
        endDate: null,
        itemContent: '',
        size: 10,
        page: 1
      },
      tabActiveName: 'first',
      examineDetailsPath: 'clinical-report-examine-details',
      inspectionDetailsPath: 'inspection-details',
      imagePathName: 'inspection-image',
      reportType: '',
      imageType: ''
    }
  },
  watch: {
    tabActiveName (newValue) {
      this.getData()
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    getReportType () { // 获取报告类型
      ApiClinicalReport.getReportType().then(res => {
        const { inspectionReportFile = 'pdf', inspectionImageFile = 'slice' } = res.data || {}
        this.reportType = inspectionReportFile // 报告格式类型
        this.imageType = inspectionImageFile // 影像格式类型
      }).catch(err => {
        this.$toast(err.message)
      })
    },
    isNotNull (row) {
      let f = false
      const type = this.reportType
      switch (type) {
        case 'html':
        case 'text':
        case 'pdf':
          f = row.pdfPath !== null && row.pdfPath !== ''
          break
        case 'images':
          f = row.reportUrl !== null && row.reportUrl !== ''
          break
      }
      return f
    },
    // 图像预览-是否能够查看
    isShow (row) {
      let f = false
      let type = this.imageType
      switch (type) {
        case 'slice':
        case 'html':
        case 'text':
        case 'pdf':
          f = row.imgUrl !== null && row.imgUrl !== ''
          break
        case 'images':
          f = row.imageUrls !== null && row.imageUrls !== '' && row.imageUrls.length > 0
          break
      }
      return f
    },
    showDetail (row) {
      if (row.reportStatus != null && row.reportStatus === '1') {
        if (!this.isNotNull(row)) {
          this.$message.warning('没有报告内容！')
          return false
        }
        const type = this.reportType
        let name = ''
        let query = null
        switch (type) {
          case 'html':
          case 'text':
            name = 'inspection-html'
            query = { html: row.pdfPath || '', title: '检查报告详情' }
            break
          case 'pdf':
            name = 'inspection-details'
            query = { pdfPath: row.pdfPath, title: '检查报告详情' }
            break
          case 'images':
            this.images = row.reportUrl ? [row.reportUrl] : []
            this.$refs['preview' + row.inspectionId].showViewer = true
            break
        }

        if (type !== 'images') {
          this.$router.push({
            name: name,
            query: query
          })
        }
      }
    },
    showImages (row) {
      const type = this.imageType
      console.log(type)
      let name = ''
      let query = null
      switch (type) {
        case 'html':
        case 'text':
          name = 'inspection-html'
          query = { html: row.imgUrl || '' }
          break
        case 'pdf':
          name = 'inspection-details'
          query = { pdfPath: row.imgUrl }
          break
        case 'images':
          this.imageImages = row.imageUrls || []
          this.$refs['previewImg' + row.inspectionId].showViewer = true
          break
        case 'slice':
          name = 'inspection-dicom'
          query = { path: row.imgUrl }
          break
      }

      if (type !== 'images') {
        this.$router.push({
        // 默认走切片
          name: name,
          query: query
        })
      }
    },
    initPatient (patient) {
      this.patient = patient
      this.inspection_search_from.patientId = patient.patientId || ''
      this.examine_search_from.patientId = patient.patientId || ''
      if (this.$route.path.includes(this.examineDetailsPath) || this.$route.path.includes(this.inspectionDetailsPath)) {
        this.backRouter()
      }
      this.getData()
      this.getReportType()
    },
    backRouter () {
      this.$router.back()
    },
    getData () {
      if (this.inspection_search_from.patientId) {
        if (this.tabActiveName === 'first') {
          if (this.inspection_search_from.fromDate > this.inspection_search_from.endDate) {
            this.$message.warning('开始时间不能大于结束时间！')
            return false
          }
          this.loading = true
          ApiClinicalReport.selectInspection(this.inspection_search_from).then((res) => {
            this.inspectionList = res.data.list
            this.inspection_page_total = res.data.total
            this.loading = false
          }).catch((err) => {
            this.$message.error('服务器调用失败了，请联系管理员！' + err)
            this.inspectionList = []
            this.inspection_page_total = 0
            this.loading = false
          })
        } else if (this.tabActiveName === 'second') {
          if (this.examine_search_from.fromDate > this.examine_search_from.endDate) {
            this.$message.warning('开始时间不能大于结束时间！')
            return false
          }
          this.loading = true
          ApiClinicalReport.selectExamine(this.examine_search_from).then((res) => {
            this.examineList = res.data.list
            this.examine_page_total = res.data.total
            this.loading = false
          }).catch((err) => {
            this.$message.error('请求接口异常了！' + err)
            this.examineList = []
            this.examine_page_total = 0
            this.loading = false
          })
        }
      } else {
        // this.$message.warning('请先从患者一览选择患者！')
        return false
      }
    },
    handleSizeChange_inspection (val) {
      this.inspection_search_from.size = val
      this.getData()
    },
    handleCurrentChange_inspection (val) {
      this.inspection_search_from.page = val
      this.getData()
    },
    handleSizeChange_examine (val) {
      this.examine_search_from.size = val
      this.getData()
    },
    handleCurrentChange_examine (val) {
      this.examine_search_from.page = val
      this.getData()
    },
    inspectionReset () {
      this.inspection_search_from = {
        patientId: this.inspection_search_from.patientId,
        fromDate: null,
        endDate: null,
        doctorAdviceName: '',
        page: this.inspection_search_from.page,
        size: this.inspection_search_from.size
      }
      this.getData()
    },
    examineReset () {
      this.examine_search_from = {
        patientId: this.examine_search_from.patientId,
        fromDate: null,
        endDate: null,
        doctorAdviceName: '',
        page: this.examine_search_from.page,
        size: this.examine_search_from.size
      }
      this.getData()
    },
    examineSwitchChange (row) {
      ApiClinicalReport.updateExamineSwitch({ reportId: row.examineId, switchSetting: row.switchSetting }).then((res) => {
        // this.getData();
      }).catch((err) => {
        this.$message.error('请求接口异常了！' + err)
      })
    },
    inspectionSwitchChange (row) {
      ApiClinicalReport.updateInspectionSwitch({ reportId: row.inspectionId, switchSetting: row.switchSetting }).then((res) => {
        // this.getData();
      }).catch((err) => {
        this.$message.error('请求接口异常了！' + err)
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .right {
    position: relative;
  }

  .right /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }

  .right /deep/ .el-tabs__content {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    bottom: 0;

    > div {
      height: 100%
    }

    /deep/ .el-icon-date:before {
      content: "\E71F";
    }

    /deep/ .el-table--small td {
      padding: 0
    }
  }

  .report_detail {
    height: 100%;

    ul {
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      list-style: none;

      li {
        margin: 10px;
      }
    }
  }

  .multiline-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal !important;
    word-wrap: break-word;
  }

</style>
