<template>
  <layout v-loading="loading">
    <!--查询-->
    <div slot="query" class="query-items">
      <el-form ref="formSearch" class="demo-form-inline" :inline="true" :model="searchObj">
        <el-form-item v-if="formPara.formType != 12&&formPara.formType != 13" label="科室:" prop="deptId">
          <TreeSelect
            v-model="searchObj.deptId"
            placeholder="请选择"
            :multiple="false"
            :options="tree_nurse_data"
            :default-expand-level="9"
            append-to-body
            no-children-text="无子节点"
            v-uni="'biaodanshezhi_list_treeSelect'"
          />
        </el-form-item>
        <el-form-item :label="formPara.formTitle+'编号:'">
          <el-input v-uni="'biaodanshezhi_list_bianhao'" v-model.trim="searchObj.formCode" clearable placeholder="请输入" />
        </el-form-item>
        &nbsp;&nbsp;
        <el-form-item :label="formPara.formTitle+'名称:'">
          <el-input v-uni="'biaodanshezhi_list_mingcheng'" v-model.trim="searchObj.formName" clearable placeholder="请输入" />
        </el-form-item>
        &nbsp;&nbsp;
        <el-form-item>
          <div class="typt-search-btn">
            <el-button
              type="primary"
              class="el-button-radius"
              icon="el-icon-search"
              size="small"
              @click="handleCurrentChange(1)"
              v-uni="'biaodanshezhi_list_search'"
            >搜索
            </el-button>
            <el-button type="text" v-uni="'biaodanshezhi_list_reset'" @click="resetSearchObj">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--end-->
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" v-uni="'biaodanshezhi_list_add'" size="small" icon="el-icon-plus" @click="$emit('changed', 'add')">添加</el-button>
    </div>
    <!--列表-->
    <div slot="main" class="main-list">
      <el-table
        ref="table"
        :data="dataList"
        stripe
        height="100%"
      >
        <el-table-column
          align="center"
          width="50"
        />
        <!-- <el-table-column type="index" align="center" label="序号" width="60">
          <template slot-scope="scope">
            {{ (searchObj.page - 1) * searchObj.size +
            (scope.$index + 1) }}
          </template>
        </el-table-column> -->

        <el-table-column
          prop="formCode"
          :label="formPara.formTitle+'编号'"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="formName"
          :label="formPara.formTitle+'名称'"
          min-width="100"
          align="center"
        />
        <!--血糖单样式列-->
        <el-table-column
                v-if="formPara.formType == 3"
                :label="formPara.formTitle+'样式'"
                min-width="100"
                align="center"
        >
          <template slot-scope="scope">
           {{EBloodSugarRelationStyleText[scope.row.formRelationStyle]||''}}
          </template>
        </el-table-column>
        <!-- 体温单设置 -->
        <el-table-column
                v-if="formPara.formType == 2"
                :label="formPara.formTitle+'样式'"
                min-width="100"
                align="center"
        >
          <template slot-scope="scope">
            {{temperatureName[scope.row.formRelationStyle]||''}}
          </template>
        </el-table-column>

        <el-table-column
          v-if="formPara.formType == 2"
          label="测量时间配置"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_celiangshijianpeizhi'" type="text" @click="showTimeSetting(scope.row)">测量时间配置</el-button>
          </template>
        </el-table-column>

        <!-- 体温单使用 -->
        <el-table-column
          v-if="formPara.formType == 2"
          prop="formName"
          label="临床事件配置"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_linchuangshijianpeizhi'" type="text" @click="eventSetting(scope.row)">临床事件配置</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="formPara.formType == 4"
          prop="formName"
          label="出入量表单样式"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ getFormRelationStyle(scope.row.formRelationStyle) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="formSynopsis"
          :label="formPara.formTitle+'简介'"
          min-width="120"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.formSynopsis }}
          </template>
        </el-table-column>
        <!-- 体征项配置 护理记录单/体温单/体围单/出入量 -->
        <el-table-column
          v-if="formPara.formType == EFormType.temperature || formPara.formType == EFormType.bodyCondition || formPara.formType == EFormType.nurseNote || formPara.formType == EFormType.inOut"
          prop="formName"
          :label="formPara.formType == EFormType.inOut? '出入项配置' : '体征项配置'"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_churuxiang_tizhengxiang_peizhi'" type="text" @click="showItemSetting(scope.row)">{{ formPara.formType == EFormType.inOut ? '出入项配置' : '体征项配置' }}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          v-if="formPara.formType == EFormType.inspectNotice"
          prop="formName"
          min-width="100"
          label="检查通知单内容"
          align="center"
        >
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_jianchatongzhidan'" type="text" @click="showInspectSetting(scope.row)">检查通知单内容</el-button>
          </template>
        </el-table-column>

        <el-table-column
          v-if="formPara.formType == EFormType.shiftReport"
          prop="formName"
          label="交班原因"
          min-width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_jiaobanyuanyinpeizhi'" type="text" @click="showShiftReason(scope.row)">交班原因配置</el-button>
          </template>
        </el-table-column>
        <el-table-column
                v-if="formPara.formType == EFormType.shiftReport"
                prop="formName"
                label="交班记录"
                min-width="150"
                align="center"
        >
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_jiaobanjilupeizhi'" type="text" @click="showShiftSetting(scope.row)">交班记录配置</el-button>
          </template>
        </el-table-column>
        <!-- 风险级别配置 -->
        <el-table-column
          v-if="formPara.formType == EFormType.riskAssessment"
          prop="formName"
          label="风险级别配置"
          min-width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_fengxianjibiepeizhi'" type="text" @click="showLevelSet(scope.row)">风险级别配置</el-button>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_using'" v-if="formPara.formType !== EFormType.shiftRecord" type="text" @click="handleDeptUsed(scope)">
              应用
            </el-button>
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_preview'" type="text" @click="handleViewHead(scope)">
              预览
            </el-button>
            <el-button v-uni:[scope.row.formId]="'biaodanshezhi_list_edit'" type="text" @click="handleEdit(scope)">
              编辑
            </el-button>
            <!--交班记录删除-->
            <el-button
                    v-if="formPara.formType == EFormType.shiftRecord"
                    type="text"
                    :class="scope.row.ifConfigure==true?'':'textred'"
                    :disabled="scope.row.ifConfigure"
                    @click="delRecord(scope.row)"
                    v-uni:[scope.row.formId]="'biaodanshezhi_list_delete'"
            >
              删除
            </el-button>
            <!--其余删除是通过是否应用到表单ifused判断-->
            <el-button
                    v-else
              type="text"
              :class="scope.row.ifUsed==true?'':'textred'"
              :disabled="(scope.row.ifUsed==true && formType != EFormType.bodyCondition && formType != EFormType.inspectNotice && formType != EFormType.intoAssess)?true:false"
              @click="delRecord(scope.row)"
              v-uni:[scope.row.formId]="'biaodanshezhi_list_delete'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div slot="footer" class="page-bar">
      <!--组件页码显示-->
      <el-pagination
        :current-page="pageInfo.currentPage"
        :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-uni="'biaodanshezhi_list_pagination'"
      />
    </div>
    <!--应用-->
    <template slot>
      <!-- 标签应用到科室 -->
      <form2Dept
        v-if="form2Dept_visible"
        ref="form2Dept"
        :visible.sync="form2Dept_visible"
        :dept-form-obj="deptFormObj"
        :check-form-id="checkFormId"
        :dept-list="deptList"
        :form-type="formType"
        :form-relation-style="formRelationStyle"
        @reDataList="getData"
      />
    </template>
    <el-dialog
      :title="autoHead.formName+':'+' 表单效果预览:'"
      :visible.sync="viewHeadFlag"
      width="1200px"
      height="800px"
      class="dialog"
      :class="formType == EFormType.temperature&&formHeader.formRelationStyle == 2?'shiboDialog':''"
      :close-on-click-modal="false"
    >
      <div class="pcListContainer">
        <!--<formHeader v-if="viewHeadFlag" :autoHead="autoHead"></formHeader>-->
        <template v-if="formType == EFormType.temperature && viewHeadFlag">
          <div style="min-width: 750px; margin: 0 auto;height: 100%;">
            <TemperatureSheetSixShibo
              v-if="formHeader.formRelationStyle == 2"
              ref="temperatureSheet"
              :patient="patient"
              :hours="hours"
              :cur-week-date="curWeekDate"
              :cur-week-in="[]"
              :cur-week-days="{ allSsDays: [], chDays: [], ssDays: [] }"
              :sign-item="sign_item_init"
              :sheet-data="[]"
              :form-header="formHeader"
              :cur-week-index="0"
            />
            <TemperatureSheetFour
              v-else-if="formHeader.formRelationStyle == 3"
              ref="temperatureSheet"
              :relation-type="formHeader.formRelationStyle"
              :patient="patient"
              :hours="hours"
              :cur-week-date="curWeekDate"
              :cur-week-in="[]"
              :cur-week-days="{ allSsDays: [], chDays: [], ssDays: [] }"
              :sign-item="sign_item_init"
              :sheet-data="[]"
              :form-header="formHeader"
              :cur-week-index="0"
            />
            <TemperatureSheetSix
              v-else
              ref="temperatureSheet"
              :relation-type="formHeader.formRelationStyle"
              :patient="patient"
              :hours="hours"
              :cur-week-date="curWeekDate"
              :cur-week-in="[]"
              :cur-week-days="{ allSsDays: [], chDays: [], ssDays: [] }"
              :sign-item="sign_item_init"
              :sheet-data="[]"
              :form-header="formHeader"
              :cur-week-index="0"
            />
          </div>
        </template>
        <template v-else-if="formType == EFormType.nurseNote">
          <MaiyangList v-if="showPrevCompt && previewItem.formCode === 'H-000010-WHJ-0022'" style="height: 604px" :formId="previewItem.formId" :formCode="previewItem.formCode" :patient="{}" :isPreview="true"></MaiyangList>
          <NurseNoteForm v-if="showPrevCompt && previewItem.formCode !== 'H-000010-WHJ-0022'" style="height: 604px" :formId="previewItem.formId" :formCode="previewItem.formCode" :remarks="previewItem.remarks" :patient="{}" :isPreview="true"></NurseNoteForm>
        </template>
        <!-- 血糖单出入量单体围单 -->
        <template v-else-if="formType == EFormType.bloodSugar || formType == EFormType.inOut || formType == EFormType.bodyCondition">
          <div class="xuetangdan_churuliang">
            <!-- 世博血糖单样式 -->
            <blood-sugar style="height: 604px" v-if="formType == 3 && (previewItem.formRelationStyle == '1' || !previewItem.formRelationStyle)" :formObj="previewItem" :patient="{}" :isPreview="true"/>
            <!-- 省立血糖单样式 -->
            <blood-sugar2 style="height: 604px" class="shenglixuetang" v-if="formType == 3 && previewItem.formRelationStyle == '2'" :formObj="previewItem" :patient="{}" :isPreview="true"/>
            <!-- 世博血糖单样式---新 -->
            <blood-sugar-shi-bo style="height: 604px" v-if="formType == 3 && previewItem.formRelationStyle == '3'" :formObj="previewItem" :patient="{}" :isPreview="true"/>
            <!-- 中心医院血糖单样式 -->
            <blood-sugar-zhongxinyiyuan style="height: 604px" v-if="formType == 3 && previewItem.formRelationStyle == '4'" :formObj="previewItem" :patient="{}" :isPreview="true"/>
            <!-- 通用出入量 -->
            <in-out style="height: 604px" v-if="formType == 4 && (previewItem.formRelationStyle == '1' || !previewItem.formRelationStyle)" :formObj="previewItem" :patient="{}" :isPreview="true"/>
            <!-- 省立出入量 -->
            <in-out2 style="height: 604px" v-if="formType == 4 && previewItem.formRelationStyle == '2'"  :formObj="previewItem" :patient="{}" :isPreview="true"/>
            <!-- 体围记录单 -->
            <body-condition style="height: 604px" v-if="formType == 9" :patient="{}"  :isPreview="true"/>
          </div>
        </template>
        <!-- 观察记录单 -->
        <template v-else-if="formType == EFormType.observe">
          <!-- 管道记录单 -->
          <pop-check class="guandaojiludan" style="height: 604px" v-if="previewItem.moduleId == '10022'" :patient="{}" :formStyle="previewItem.assStyle" :formName="previewItem.assName" :formCode="previewItem.assCode" :isPreview="true"/>
          <!-- 压疮观察记录单 -->
          <pressure-score style="height: 604px" v-if="previewItem.moduleId == '10016'" :patient="{}"  :formStyle="previewItem.assStyle" :formName="previewItem.assName" :formCode="previewItem.assCode" :isPreview="true"></pressure-score>
          <!-- 深静脉观察记录单 -->
          <deep-vein class="shenjingmai" style="height: 604px" v-if="previewItem.moduleId == '10017'" :patient="{}"  :patientType="''" :printSet="previewItem.printType"  :formStyle="previewItem.assStyle" :formName="previewItem.assName" :formCode="previewItem.assCode" :isPreview="true"></deep-vein>
          <!-- 疼痛观察单 -->
          <pain style="height: 604px" v-if="previewItem.moduleId == '10021'" :patient="{}"  :formStyle="previewItem.assStyle" :formName="previewItem.assName" :formCode="previewItem.assCode" :params="previewItem" :isPreview="true"></pain>
          <!-- 输血护理记录单 -->
          <blood-transfusion style="height: 604px" v-if="previewItem.moduleId == '10023'" :patient="{}"  :formStyle="previewItem.assStyle" :formName="previewItem.assName" :formCode="previewItem.assCode" :isPreview="true"></blood-transfusion>
          <!-- 中心医院压疮风险患者观察记录单  中心医院失禁性皮炎评估观察记录单-->
          <zhongxin style="height: 604px" v-if="previewItem.moduleId == '10035' || previewItem.moduleId == '10036'" :patient="{}" :formStyle="previewItem.assStyle" :formName="previewItem.assName" :formCode="previewItem.assCode" :isPreview="true"></zhongxin>
        </template>
        <!-- 手术评估单 -->
        <template v-else-if="formType == EFormType.operation">
          <Opertion style="height: 604px" v-if="showPrevCompt" class="shoushupinggu_dialog"
          :params="{}" :previewItem="previewItem" :isPreview="true" />
        </template>
        <!-- 交接记录 -->
        <template v-else-if="formType == EFormType.handover">
          <HandoverRecord style="height: 604px" class="HandoverRecord_dialog" v-if="showPrevCompt"
          :params="{}" :previewItem="previewItem" :isPreview="true" />
        </template>
        <!-- 转入评估单 -->
        <template v-else-if="formType == EFormType.intoAssess">
          <IntoAssess style="height: 604px" class="HandoverRecord_dialog" v-if="showPrevCompt"
          :params="{}" :previewItem="previewItem" :isPreview="true" />
        </template>
        <!-- 交班报告 -->
        <template v-else-if="formType == EFormType.shiftReport">
          <Print style="height: 604px" class="HandoverRecord_dialog" v-if="showPrevCompt"
          :params="{}" :previewItem="previewItem" :isPreview="true" />
        </template>
        <!-- 交班记录 -->
        <template v-else-if="formType == EFormType.shiftRecord">
          <Record style="height: 604px" class="jiaobanjilu_dialog" v-if="showPrevCompt"
          :params="{}" :previewItem="previewItem" :isPreview="true" />
        </template>
        <!-- 入院评估 -->
        <template v-else-if="formType == EFormType.admissionAssess">
          <AdmissionAssess style="height: 604px" class="HandoverRecord_dialog ruyuanpinggu_dialog" v-if="showPrevCompt"
           :previewItem="previewItem" :isPreview="true" />
        </template>
        <!-- 风险评估 -->
        <template v-else-if="formType == EFormType.riskAssessment">
          <RiskAssessment style="height: 604px" class="HandoverRecord_dialog fengxianpinggu_dialog" v-if="showPrevCompt"
           :params="{}" :previewItem="previewItem" :isPreview="true" />
        </template>
        <template v-else>
          <formHeader v-if="viewHeadFlag" :auto-head="autoHead" />
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'biaodanshezhi_list_preview_print'" v-if="formType == EFormType.temperature" type="primary" @click="printView">打印</el-button>
        <el-button v-uni="'biaodanshezhi_list_preview_cancel'" @click="viewHeadFlag=false">取消</el-button>
      </div>
    </el-dialog>
    <!--交班记录配置弹窗-->
    <el-dialog
            title="交班记录配置"
            :visible.sync="shiftSettingDialog"
            width="580px"
            height="400px"
            :show-close="false"
            :close-on-click-modal="false"
    >
      <div class="shitContainer">
        <el-radio-group v-model="radioForm.relationship">
          <template v-for="(item,index) in shiftSettingList">
            <el-radio v-uni:[index]="'biaodanshezhi_list_jiaoban_'+item.relationship" :label="item.relationship" :key="index">
              <div class="name">{{item.formName || ''}}</div>
              <div class="remark">{{item.formSynopsis || ''}}</div>
            </el-radio>
          </template>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="'biaodanshezhi_list_cancel'" @click="cancel">取消</el-button>
        <el-button v-uni="'biaodanshezhi_list_confirm'" type="primary" @click="shiftSettingConform">确认</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import moment from 'moment'
import TemperatureSheetSix from '../../../components/nrms/TemperatureSheetSix'
import TemperatureSheetFour from '../../../components/nrms/TemperatureSheetFour'
import TemperatureSheetSixShibo from '../../../components/nrms/TemperatureSheetSixShibo'
import { ApiDept, ApiAutoForm, ApiSignItemSetting, ApiFormMange, ApiAssManage } from '../../../api/nrms/index'
import layout from '../../../components/nrms/layout/list'
import form2Dept from './form2Dept'
import formHeader from '../../../components/nrms/autoForm/header'
import printJS from 'print-js'
import printStyle from '../SignRecord/TemperatureSheet/printStyle'
import { AutoFormType, FormTypeMap, inOutRelationStyle, temperatureName } from './temperatureConfig'
import { EFormType, EFormTypeText, EBloodSugarRelationStyleText, FormApplyOneToMore } from '../../../assets/nrms/enum/formManage'
import NurseNoteForm from '@/views/nrms/NurseNotes/List.vue'
import MaiyangList from '@/views/nrms/NurseNotes/MaiyangList/List.vue'

import BloodSugar from '@/views/nrms/SignRecord/BloodSugar/BloodSugar.vue'
import BloodSugar2 from '@/views/nrms/SignRecord/BloodSugar2/BloodSugar.vue'
import BloodSugarShiBo from '@/views/nrms/SignRecord/BloodSugarShiBo/List.vue'
import BloodSugarZhongxinyiyuan from '@/views/nrms/SignRecord/BloodSugarZhongxinyiyuan/BloodSugar.vue'
import InOut from '@/views/nrms/SignRecord/InOut/InOut.vue'
import InOut2 from '@/views/nrms/SignRecord/InOut2/InOut.vue'
import BodyCondition from '@/views/nrms/SignRecord/BodyCondition/List.vue'
import PopCheck from '@/views/nrms/Observe/PopCheck.vue'
import PressureScore from '@/views/nrms/Observe/PressureScore.vue'
import DeepVein from '@/views/nrms/Observe/DeepVein.vue'
import Pain from '@/views/nrms/Observe/Pain-add.vue'
import BloodTransfusion from '@/views/nrms/Observe/BloodTransfusion.vue'
import Zhongxin from '@/views/nrms/Observe/Zhongxin.vue'
import Opertion from '@/views/nrms/Operation/Add.vue'
import HandoverRecord from '@/views/nrms/HandoverRecord/Add.vue'
import IntoAssess from '@/views/nrms/IntoAssess/Add.vue'
import AdmissionAssess from '@/views/nrms/AdmissionAssess/List.vue'
import Record from '@/views/nrms/FormManage/Record.vue'
import RiskAssessment from '@/views/nrms/RiskAssessment/Add.vue'
import Print from '@/views/nrms/FormManage/Print.vue'

export default {
  name: 'FormManage',
  components: {
    TreeSelect,
    layout,
    form2Dept,
    formHeader,
    TemperatureSheetSixShibo,
    TemperatureSheetFour,
    TemperatureSheetSix,
    NurseNoteForm,
    MaiyangList,
    BloodSugar,
    BloodSugar2,
    BloodSugarShiBo,
    BloodSugarZhongxinyiyuan,
    InOut,
    InOut2,
    BodyCondition,
    PopCheck,
    PressureScore,
    DeepVein,
    Pain,
    BloodTransfusion,
    Zhongxin,
    Opertion,
    HandoverRecord,
    IntoAssess,
    AdmissionAssess,
    Record,
    RiskAssessment,
    Print
  },
  props: ['detail', 'formPara', 'tabFormType', 'isTabType'],
  data () {
    return {
      loading: false,
      // 分页需要参数
      pageInfo: {
        currentPage: 1,
        size: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50]
      },
      // 修改、添加相关
      showDialog: false,
      viewHeadFlag: false,
      form2Dept_visible: false,
      dataList: [],
      ifAllFormatDL: [],
      searchObj: {
        deptId: null,
        formCode: '',
        formName: '',
        formType: '',
        size: 10,
        page: 1
      },
      tree_nurse_data: [],
      deptList: [],
      deptFormObj: {},
      formUsedObj: {},
      checkFormId: '',
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '',
        tplData: {}
      },
      formHeader: {
        formCode: '',
        formName: '',
        formStyle: ''
      },
      formInfo: {},
      formType: '',
      formRelationStyle: '',
      // 体温单预览-患者数据
      patient: {
        patientName: '魏小然',
        sex: '女',
        patientAge: '22岁',
        nurseLevel: '特级',
        deptName: '妇科',
        bedName: '05床',
        inNo: '123456789',
        inTime: '2020-08-10 12:54:43',
        outHospitalTime: '2020-08-17 12:54:43'
      },
      hours: [],
      curWeekDate: [],
      sign_item_init: [], // 使用
      deptIds: '', // 自动表单
      EFormType,
      temperatureName,
      EBloodSugarRelationStyleText,
      flatDept: [], // 将部门扁平化
      shiftSettingDialog: false,
      radioForm: {
        formId: '',
        formName: '',
        relationship: ''
      }, // 交班报告交班记录配置
      shiftSettingList: [], // 交班记录列表
      previewItem: {},
      showPrevCompt: false
    }
  },
  computed: {
    // formtype对应的参数字段
    formTypeMap () {
      return FormTypeMap.get(this.formPara.formType)
    },
    // 是否是自动表单出来的
    isAutoForm () {
      return AutoFormType.indexOf(this.formPara.formType) >= 0
    }
  },
  watch: {
    formPara: {
      handler (val) {
        // 初始化
        this.searchObj.page = 1
        this.formTitle = val.formTitle
        this.searchObj.formType = val.formType
        this.formType = val.formType
        // tab类型 只有点击当前tab才会调用当前tab接口
        if (this.isTabType) {
          this.tabFormType === this.formType && this.getData()
        } else {
          this.getData()
        }
        // 仅在交班报告管理页面获取交班记录数据
        if (val.formType == 12 && this.tabFormType != 13) {
          this.getShiftRecordData()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    // 交班管理中的交班报告表单和交班记录表单在watch中已调用
    if (this.formPara.formType != 12 && this.formPara.formType != 13) {
      this.getData()
    }
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 结束
    showTimeSetting (row) {
      this.$emit('changed', 'timeSetting', '', row)
    },
    showItemSetting (row) {
      this.$emit('changed', 'itemSetting', '', row)
    },
    showInspectSetting (row) {
      this.$emit('changed', 'inspect', '', row)
    },
    showShiftReason (row) {
      this.$emit('changed', 'shiftReason', '', row)
    },
    // 交班记录配置
    async showShiftSetting (row) {
      if (this.shiftSettingList.length === 0) {
        this.$message.error('请先添加交班记录')
        return
      }
      this.radioForm.formId = row.formId
      this.radioForm.formName = row.formName
      this.radioForm.relationship = row.relationship
      this.shiftSettingDialog = true
    },
    shiftSettingConform () {
      if (this.radioForm.relationship === '') {
        this.$message.error('请至少选择一条交班记录')
        return
      }
      ApiFormMange.confirm(this.radioForm)
        .then(() => {
          this.$message.success('保存正确！')
          this.shiftSettingDialog = false
          this.getData()
        })
        .catch((res) => {
          this.$message.error(res.message)
        })
    },
    cancel () {
      this.radioForm.formId = ''
      this.radioForm.relationship = ''
      this.shiftSettingDialog = false
    },
    // 风险评估配置
    showLevelSet (row) {
      this.$emit('changed', 'riskLevel', '', row)
    },
    eventSetting (row) {
      this.$emit('changed', 'eventSetting', '', row)
    },
    getFormRelationStyle (formRelationStyleId) {
      let name = ''
      switch (this.formPara.formType) {
        case EFormType.temperature:
          inOutRelationStyle.map(item => {
            if (formRelationStyleId == item.id) {
              name = item.name
            }
          })
          break
        default:
          break
      }
      return name
    },
    async getData () {
      if (!this.loading) this.loading = true
      if (this.isAutoForm) {
        const res = await ApiFormMange.list({
          deptId: this.searchObj.deptId,
          assType: this.formTypeMap.assType,
          assCode: this.searchObj.formCode,
          assName: this.searchObj.formName,
          page: this.searchObj.page,
          size: this.searchObj.size
        })
        const list = res.data.list.map(item => {
          item = {
            ...item,
            formName: item.assName,
            formType: item.assType,
            formCode: item.assCode,
            formId: item.assId,
            formStyle: item.assStyle,
            formSynopsis: item.remark,
            formRelationStyle: item.moduleId,
            printSet: item.printType
          }
          return item
        })
        // 后台分页机制：当前页删除最后一条数据后会返回前一页的所有记录，
        // 因此前端在列表查询接口拿到数据后需要将pageNum重新赋值给page 2021-08-03 hz
        this.searchObj.page = res.data.pageNum
        this.pageInfo.currentPage = res.data.pageNum
        this.ifAllFormatDL = list
        this.pageInfo.total = res.data.total
        this.getDeptData()
        return
      }
      ApiAutoForm.getList(this.searchObj).then(res => {
        // 后台分页机制：当前页删除最后一条数据后会返回前一页的所有记录，
        // 因此前端在列表查询接口拿到数据后需要将pageNum重新赋值给page 2021-08-03 hz
        this.searchObj.page = res.data.pageNum
        this.pageInfo.currentPage = res.data.pageNum
        this.ifAllFormatDL = res.data.list
        this.pageInfo.total = res.data.total
        this.getDeptData()
      })
    },
    // 获取交班记录数据
    getShiftRecordData () {
      this.shiftSettingList = []
      ApiAutoForm.getList({ formType: '13' }).then(res => {
        // 交班记录管理表单数据
        let data = res.data || []
        data.forEach(v => {
          let item = {}
          item['formId'] = v.formId
          item['relationship'] = v.formCode
          item['formName'] = v.formName
          item['formSynopsis'] = v.formSynopsis
          this.shiftSettingList.push(item)
        })
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    handleEdit (row) {
      this.$emit('changed', 'add', 'edit', row.row)
    },
    async handleViewHead (row) {
      this.previewItem = {
        ...row.row
      }
      console.log(this.previewItem, this.previewItem.moduleId, 'pppppp')
      this.showPrevCompt = false
      this.$nextTick(() => {
        this.showPrevCompt = true
      })
      if (this.formType == EFormType.temperature) {
        this.formHeader = {
          formCode: row.row.formCode,
          formName: row.row.formName,
          formStyle: row.row.formStyle,
          printSet: row.row.printSet,
          formRelationStyle: row.row.formRelationStyle
        }
        this.curWeekDate = []
        const startDay = moment().subtract(7, 'days').format('YYYY-MM-DD')
        for (let i = 1; i <= 7; i++) {
          this.curWeekDate.push(moment(startDay).add(i, 'days').format('YYYY-MM-DD'))
        }

        this.autoHead.formName = row.row.formName
      } else {
        this.autoHead.tplId = row.row.formCode
        this.autoHead.tplHtml = row.row.formStyle
        this.autoHead.formName = row.row.formName
        this.autoHead.tplData = this.patient
      }
      await this.getHours(row)
      await this.getSignItemData(row)
      this.viewHeadFlag = true
    },
    async getHours (row) {
      ApiSignItemSetting.temperatureMeasureTime({ formId: row.row.formId })
        .then(res => {
          this.hours = res.data || []
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    async getSignItemData (row) {
      ApiSignItemSetting.selectItem({ formId: row.row.formId })
        .then(res => {
          const data = res.data || []
          this.sign_item_init = data
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    delRecord (row) {
      if (this.formType == EFormType.bodyCondition || this.formType == EFormType.inspectNotice || this.formType == EFormType.intoAssess) { // 体围单，删除逻辑单独处理
        this.deleteBefore(row)
      } else {
        this.delDo(row)
      }
    },
    deleteBefore (row) { // 体围单删除的校验
      if (this.isAutoForm) {
        if (!row.deptId) {
          this.delDo(row)
          return
        }
        const deptIds = row.deptId.split(',')
        const deptNames = deptIds.map(item => {
          let name = ''
          this.flatDept.map(v => {
            if (item == v.deptId) {
              name = v.label
            }
          })
          return name
        })
        if (!deptNames || !deptNames.length) {
          this.delDo(row)
          return
        }
        let _html = ''

        _html = '<div style="text-align: left;"><strong>该表单已应用到以下科室，无法进行删除。</strong><br />'
        for (let index = 0; index < deptNames.length; index++) {
          const name = deptNames[index]
          _html += '<span style="margin-left: 25px;">' + name + '</span><br />'
          if (index >= 2) {
            _html += '<span style="margin-left: 25px;">......</span><br />'
            break
          }
        }
        _html += '</div>'

        this.$alert(_html + '请先取消表单在科室应用，再进行删除操作。', '提示', {
          customClass: 'alertStyle',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭'
        }).catch(() => {

        })
        return
      }
      ApiAutoForm.delBeforeCheck({ formId: row.formId })
        .then((res) => {
          if (res.data && res.data.length > 0) { // 已经应用到科室，进行科室的展示
            let _html = ''

            _html = '<div style="text-align: left;"><strong>该表单已应用到以下科室，无法进行删除。</strong><br />'
            for (const [index, one] of new Map(res.data.map((item, i) => [i, item]))) {
              _html += '<span style="margin-left: 25px;">' + one.deptName + '</span><br />'

              if (index >= 2) {
                _html += '<span style="margin-left: 25px;">......</span><br />'
                break
              }
            }

            _html += '</div>'

            this.$alert(_html + '请先取消表单在科室应用，再进行删除操作。', '提示', {
              customClass: 'alertStyle',
              dangerouslyUseHTMLString: true,
              confirmButtonText: '关闭'
            }).catch(() => {

            })
          } else { // 直接进行删除
            this.delDo(row)
          }
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    delDo (row) { // 删除操作
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(async () => {
        if (this.isAutoForm) {
          try {
            // 自动表单的删除
            await ApiFormMange.delete(row.assId)
            this.$message.success('删除成功！')
            this.getData()
          } catch (error) {
            this.$message.error(error.message)
          }
        } else {
          // 自动表头的删除
          ApiAutoForm.delForm({ formId: row.formId })
            .then(() => {
              this.$message.success('删除成功！')
              this.getData()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        }
      }).catch(() => {

      })
    },
    handleSizeChange (val) {
      this.searchObj.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.searchObj.page = val
      this.pageInfo.currentPage = val
      this.getData()
    },
    resetSearchObj () {
      this.searchObj.deptId = null
      this.searchObj.formCode = ''
      this.searchObj.formName = ''
      this.handleCurrentChange(1)
    },
    // 应用相关
    getDeptData () {
      this.deptList = []
      ApiDept.select().then(res => {
        this.deptList = res.data.list
        const dept = res.data.list
        this.deptList = dept// this.getNurseDataDept(dept);
        let temp = JSON.stringify(res.data.list)
        temp = temp.replace(/deptName/g, 'label').replace(/,"children":null/g, '')
        this.deptList = JSON.parse(temp)
        let temp2 = JSON.stringify(res.data.list)
        temp2 = temp2.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '')
        this.tree_nurse_data = JSON.parse(temp2)

        this.getDeptFormInfo()
        if (this.isAutoForm) {
          this.flatDeptFn(this.deptList)
        }
      })
    },
    getDeptFormInfo () {
      const _this = this
      _this.deptFormObj = {}
      _this.formUsedObj = {}
      if (!this.isAutoForm) {
        ApiAutoForm.select({ formType: _this.formPara.formType }).then(res => {
          for (const item of res.data) {
            this.$set(this.deptFormObj, item.deptId, item.formId)
            // 生成以formId为下标的对象 ，用于前置判断是否可删除。
            if (this.formUsedObj[item.formId] === undefined) {
              this.$set(this.formUsedObj, item.formId, [item.deptId])
            } else {
              this.formUsedObj[item.formId].push(item.deptId)
            }
          }
          this.formatDelPower()
        })
      } else {
        ApiFormMange.list({
          assType: this.formTypeMap.assType
        }).then(res => {
          res.data.forEach(item => {
            if (!item.deptId) {
              return
            }
            const deptIds = item.deptId.split(',')
            deptIds.forEach(deptId => {
              this.$set(this.deptFormObj, deptId, item.assId)
              // 生成以formId为下标的对象 ，用于前置判断是否可删除。
              if (this.formUsedObj[item.assId] === undefined) {
                this.$set(this.formUsedObj, item.assId, [deptId])
              } else {
                this.formUsedObj[item.assId].push(deptId)
              }
            })
          })
          this.formatDelPower()
        })
      }
    },
    formatDelPower () {
      // if (this.formPara.formType == '1') return
      for (const item of this.ifAllFormatDL) {
        this.formUsedObj[item.formId] ? this.$set(item, 'ifUsed', true) : this.$set(item, 'ifUsed', false)
      }
      this.dataList = this.ifAllFormatDL
      this.loading = false
    },
    handleDeptUsed (data) {
      this.formRelationStyle = data.row.formRelationStyle
      this.checkFormId = data.row.formId
      if (this.isAutoForm) {
        this.checkFormId = data.row.assId
      }

      // 一个表单可以应用多个科室
      if (FormApplyOneToMore.indexOf(this.formPara.formType) > -1) {
        this.deptFormObj = {}
        if (this.isAutoForm) {
          ApiFormMange.list({
            assType: this.formTypeMap.assType
          }).then(res => {
            res.data.forEach(item => {
              if (!item.deptId) {
                return
              }
              if (item.assId === this.checkFormId) {
                const deptIds = item.deptId.split(',')
                deptIds.forEach(deptId => {
                  this.$set(this.deptFormObj, deptId, item.assId)
                })
              }
              // const deptIds = item.deptId.split(',')
              // deptIds.forEach(deptId => {
              //   if (item.assId === this.checkFormId) {
              //     this.$set(this.deptFormObj, deptId, item.assId)
              //   }
              // })
            })
            this.form2Dept_visible = true
          })
        } else {
          ApiAutoForm.select({ formType: this.formPara.formType }).then(res => {
            for (const item of res.data) {
              const formId = item['formId'] || ''
              if (formId && formId === this.checkFormId) {
                this.$set(this.deptFormObj, item.deptId, item.formId)
              }
            }

            this.form2Dept_visible = true
          })
        }
      } else {
        this.form2Dept_visible = true
      }
    },
    resetDialog () {
      /*
              this.showDialog=false;
              this.$refs.addForm.resetFields();
              this.basePatrolContents=[];
              this.patrolObj.recordId='add';
              this.patrolObj.patrolType='';
              this.patrolObj.patrolContent='';
              this.patrolObj.patrolRemark='';
              this.patrolObj.optType='添加巡视记录';
      */
    },
    printView () {
      const printSet = this.formHeader.printSet
      let _printStyle = ''
      switch (printSet) {
        case 1:
          _printStyle = printStyle.toString().replace('#portrait#', 'portrait')
          break
        case 2:
          _printStyle = printStyle.toString().replace('#portrait#', ' landscape')
          break
        default:
          _printStyle = printStyle.replace('#portrait#', 'portrait')
          break
      }
      printJS({
        printable: 'temperature_sheet_print_container',
        type: 'html',
        style: _printStyle,
        scanStyles: false
      })
    },
    /**
     * @description: 扁平化部门,自动表单需要自己对应部门
     * @param {*}
     * @return {*}
     */
    flatDeptFn (deptDeepList) {
      const flatDept = []
      const recursion = (deptList) => {
        if (!deptList || !deptList.length) {
          return
        }
        deptList.map(v => {
          flatDept.push(v)
          recursion(v.children)
        })
      }
      recursion(deptDeepList)
      this.flatDept = flatDept
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  /deep/ .tl {
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /deep/ .textred {
    color: #f33;
  }
  .shitContainer{
    width: 510px;
    max-height: 200px;
    margin-bottom: 10px;
    padding-left: 30px;
    overflow-x: hidden;
    overflow-y: auto;
    /deep/.el-radio-group{
      display: flex;
      flex-direction: column;
      .el-radio{
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 20px;
        margin-right: 0;
        .el-radio__label{
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          flex: 1;
          width: 0;
          .name{
            width: 100%;
            color: #333;
            white-space: normal;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
          }
          .remark{
            width: 100%;
            color: #666;
            white-space: normal;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
          }
        }
        .el-radio__input{
          width: 15px;
        }
      }
    }
  }
  /*世博体温单预览单独样式修改*/
  /deep/.shiboDialog{
    .el-dialog{
      height: 100%;
      .el-dialog__body{
        overflow-y:hidden ;
      }
    }
  }
  .pcListContainer {
    width: 100%;
    height: 100%;
  }
</style>

<style lang="scss" type="text/scss">
// 预览表单修改样式
  .HandoverRecord_dialog .typt-add-container{
    max-height: 100% ;
  }
  .HandoverRecord_dialog .el-main{
    box-shadow: none;
  }
  .HandoverRecord_dialog .intoAssess-add-content{
    height: 100% !important;
  }
  .ruyuanpinggu_dialog .typt-add-container{
    height: 100% !important;
  }
  .fengxianpinggu_dialog .operation-add-content{
    height: 100% !important;
  }
  .shoushupinggu_dialog .operation-add-content{
    height: 100% !important;
  }
  .jiaobanjilu_dialog .bnms_sbar_shift_container{
    padding: 0px;
  }
  .xuetangdan_churuliang{
    .el-input {
      width: 235px !important;
    }
  }
  .guandaojiludan{
    .el-input {
      width: 180px !important;
    }
  }
  .shenjingmai{
    .el-input__inner {
      height: 30px !important;
    }
  }

  .el-message-box__wrapper .alertStyle .el-message-box__header {
    line-height: 0px;
  }

  .el-message-box__wrapper .alertStyle .el-message-box__header .el-message-box__headerbtn {
    top: 15px;
  }
</style>
