<!--
  文件描述：添加页--问卷
      主样式class：edit-page-new
  创建时间：2020/4/23 17:31
  创建人：Administrator
-->
<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{ detail.type === 'edit'?'编辑':'添加' }}问卷</div>
      <div class="btnClass">
        <div class="typt-right-btn" style="position: relative;left: calc(100% - 320px);">
          <el-button type="primary" @click="importList">引用问卷</el-button>
          <el-button type="primary" @click="openDialog('add')">手动添加问题</el-button>
          <el-button type="primary" @click="drawerTable = true">添加题库问题</el-button>
        </div>
      </div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width:100%;">
        <el-form ref="formContent"
                 :model="formContent"
                 :rules="rules"
                 label-width="100px">
          <!--<el-form-item label="护理单元"
                        prop="nurseUnitIds">
            <el-select v-model="formContent.nurseUnitIds"
                       multiple
                       placeholder="请选择"
                       size="mini"
                       class="elinput-300"
                       @change="changeNurseUnit">
              <el-option v-for="item in nurseUnitList"
                         :key="item.deptId"
                         :label="item.deptName"
                         :value="item.deptId">{{ item.deptName }}</el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="问卷标题："
                        prop="title">
            <el-input v-model.trim="formContent.title"
                      type="text"
                      maxlength="32"
                      class="elinput-300"
                      :show-word-limit="true" />
          </el-form-item>
          <el-form-item label="问卷说明：">
            <el-input v-model="formContent.remark"
                      type="textarea"
                      maxlength="200"
                      style="width: 700px;height:144px;"
                      :rows="7"
                      :show-word-limit="true" />
          </el-form-item>
          <el-form-item label="手机答题：">
            <el-switch v-model="formContent.answerOnPhone"
                       :inactive-value="0"
                       :active-value="1" />
            （仅支持外网扫码时可用）
          </el-form-item>

        </el-form>

        <!-- 题目列表 -->
        <el-row>
          <div class="questionsDoList">
            <SlickList v-if="formContent.questionsDoList!==null && formContent.questionsDoList.length > 0"
                       v-model="formContent.questionsDoList"
                       axis="y"
                       lock-axis="y"
                       :press-delay="200"
                       class="SortableList quest-list">
              <SlickItem v-for="(item, index) in formContent.questionsDoList"
                         :key="index"
                         class="SortableItem"
                         :index="index">
                  <span>
                    <h5>
                      {{item.sort}} <span v-if="item.sort!==''">、</span>{{item.title}}
                      <!-- {{ item.questionType === 5 ? item.title : (index + 1) + '、' + item.title }} -->
                      <small>[ {{ translateQuestionType(item.questionType).label }} ]</small>
                      <el-button-group class="SortableItem-action">
                        <el-button icon="el-icon-plus"
                                   @click="openDialog('add', {index, item})" />
                        <el-button icon="el-icon-edit-outline"
                                   @click="openDialog('edit', {index, item})" />
                        <el-button v-if="index !== 0"
                                   icon="el-icon-set-up"
                                   @click="openLogicDialog(index, item)" />
                        <el-button icon="el-icon-delete"
                                   @click="delQuestion(index,item)" />
                      </el-button-group>
                    </h5>
                    <ul v-if="!formContent_isShortAnswer(item.questionType)">
                      <li v-for="(subitem, i) in item.optionsDoList"
                          :key="i">
                        {{subitem.sortIndex}}.
                        {{ subitem.content }}
                        <em v-if="item.questionType === 3||item.questionType === 4">[ {{ subitem.score }} 分 ]</em>
                      </li>
                    </ul>
                  </span>
              </SlickItem>
              <div v-if="formContent.questionsDoList.length > 1"
                   style="color: #7a7a7a;font-size: 12px;padding: 10px;">
                问题排序时，请拖拽问题至相应位置以完成问题排序
              </div>
            </SlickList>
          </div>
        </el-row>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="$emit('option-changed', 'list')">取 消</el-button>
      <el-button type="primary"
                 :loading="yh_loading"
                 element-loading-spinner="el-icon-loading"
                 @click="detail.type === 'edit' ? editData('formContent') : saveData('formContent')">保 存</el-button>
    </div>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>

      <!-- 手动添加问题 -->
      <el-dialog :title="dialogTile"
                 :visible.sync="isDialogVisible"
                 :close-on-click-modal=false
                 :close-on-press-escape=false
                 width="880px"
                 @close="clearDialog">
        <div class="addQuestion">
          <el-form ref="addForm"
                   :model="addForm"
                   :rules="rules">

            <el-form-item label="是否必选:"
                          :rules="[{ required: true}]"
                          label-width="100px">
              <el-radio v-model="addForm.required"
                        :label="1">必填题</el-radio>
              <el-radio v-model="addForm.required"
                        :label="0">选填题</el-radio>
            </el-form-item>

            <el-form-item label="题目类型:"
                          :rules="[{ required: true}]"
                          label-width="100px">
              <el-radio v-for="item in questionTypeList"
                        :key="item.value"
                        v-model="addForm.questionType"
                        :label="item.value"
                        @change="changeQuestionType">{{ item.label }}</el-radio>
            </el-form-item>

            <el-form-item :label="addForm.questionType !== 5 ?'标题:':'段落说明:'"
                          label-width="100px"
                          prop="title"
                          :rules="[
                          {
                              required: true,
                              message: '请输入标题',
                              trigger: 'blur'
                            },
                            {
                              min: 1,
                              max: 64,
                              message: `请输入64位以内`,
                              trigger: 'blur'
                            }
                          ]">
              <el-input v-model.trim="addForm.title"
                        type="text"
                        style="width: 92%;"
                        :maxlength="64"
                        :show-word-limit="true" />
            </el-form-item>

            <div v-if="!addForm_isShortAnswer">
              <SlickList v-model="addForm.optionsDoList"
                         axis="y"
                         lock-axis="y"
                         :press-delay="200"
                         :use-window-as-scroll-container="true"
                         class="SortableList">
                <SlickItem v-for="(item, index) in addForm.optionsDoList"
                           :key="index"
                           class="SortableItem"
                           :class="addQsTypeClass"
                           :index="index">
                  <el-row class="clear"
                          :gutter="5"
                          :class="addForm_isScore ? 'scoreQuestion':''">
                    <el-col :span="addForm_isScore ? 20 : 24">
                      <el-form-item :label="`选项 ${lowerLetter()[index]}:`"
                                    :prop="'optionsDoList.' + index + '.content'"
                                    :rules="{
                          required: true,
                          message: '请输入选项',
                          trigger: 'blur'
                        }">
                        <el-input v-model.trim="addForm.optionsDoList[index].content"
                                  type="text"
                                  placeholder="必填，支持汉字、字母、数字、字符"
                                  maxlength="32"
                                  :show-word-limit="true">
                          <el-button v-if="index > 1"
                                     slot="append"
                                     icon="el-icon-delete"
                                     @click="delOption(item)" />
                        </el-input>
                      </el-form-item>
                    </el-col>

                    <el-col v-if="addForm_isScore"
                            :span="4">
                      <el-form-item label="分值"
                                    :prop="'optionsDoList.' + index + '.score'"
                                    :rules="[
                                    {
                                      required: true,
                                      message: '请输入分值',
                                      trigger: 'blur'
                                    },
                                    {
                                      pattern: /^[0-9]+$/,
                                      message: '请输入正整数',
                                      trigger: 'blur'
                                    }]">
                        <el-input v-model.trim="addForm.optionsDoList[index].score"
                                  type="text"
                                  placeholder="分值"
                                  maxlength="3"
                                  :show-word-limit="true" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </SlickItem>
              </SlickList>

              <!-- <el-form-item v-for="(item, index) in addForm.optionsDoList"
                            :key="item.key"
                            :label="`选项 ${item.sortIndex}`"
                            :prop="'optionsDoList.' + index + '.content'"
                            :rules="{
                  required: true,
                  message: '请输入选项',
                  trigger: 'blur'
                }">
                <el-row class="clear"
                        :gutter="5">
                  <el-col :span="addForm_isScore ? 20 : 24">
                    <el-input v-model.trim="addForm.optionsDoList[index].content"
                              type="text"
                              placeholder="必填，支持汉字、字母、数字、字符"
                              maxlength="16"
                              :show-word-limit="true">
                      <el-button v-if="index > 1"
                                 slot="append"
                                 icon="el-icon-delete"
                                 @click="delOption(item)" />
                    </el-input>
                  </el-col>
                  <el-col v-if="addForm_isScore"
                          :span="4">
                    <el-input v-model.trim="addForm.optionsDoList[index].score"
                              type="number"
                              placeholder="分值" />
                  </el-col>
                </el-row>
              </el-form-item> -->
       <div
                         style="font-size: 12px;color: #999999;margin-left: 68px;">选项排序时，请拖拽选项名至相应位置以完成选项排序</div>
              <div v-if="addForm.optionsDoList.length < 99"
                   class="add-question"
                   :class="addQuestionClass"
                   @click="addOption">
                <em class="el-icon-plus"></em>
              </div>
            </div>
          </el-form>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="hideDialog">取 消</el-button>
          <el-button type="primary"
                     @click="questionDialogType === 'edit' ? editQuestion('addForm'):addQuestion('addForm')">确 认</el-button>
        </span>
      </el-dialog>

      <!-- 题库 -->
      <el-dialog title="添加题库问题"
                 :visible.sync="drawerTable"
                 :close-on-click-modal=false
                 :close-on-press-escape=false
                 width="800px"
                 @close="clearDialog">
        <!-- 自定义 弹窗 -->
        <div class="dc-drawer" style="overflow:auto;height:60vh;">
          <div class="drawer-body">
            <el-form ref="search"
                     :inline="true"
                     :model="search"
                     class="search">
              <!-- 标题 -->
              <el-form-item prop="title"
                            label="题目标题:">
                <el-input v-model="search.title"
                          placeholder="请输入"
                          size="mini"
                          prefix-icon="el-icon-search" />
              </el-form-item>
              <!-- 类型 -->
              <el-form-item prop="questionType"
                            label="题目类型:">
                <el-select v-model="search.questionType"
                           size="mini"
                           placeholder="请选类型">
                  <el-option label="全部"
                             value="" />
                  <el-option v-for="(item) in questionTypeList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <!-- 按钮 -->
                <el-button type="primary"
                           icon="el-icon-search"
                           class="el-button-radius"
                           size="mini"
                           @click="query">搜索</el-button>
                <el-button type="text"
                           size="mini"
                           @click="handleReset()">重置</el-button>
              </el-form-item>
            </el-form>

            <!-- 表格 -->
            <el-table :data="tableData_questionLibrary.list"
                      :header-cell-style="{'background': '#f9f9f9'}"
                      stripe>
              <!-- 序号 -->
              <!-- <el-table-column type="index"
                               label="序号"
                               width="60"
                               align="center">
                <template slot-scope="scope">
                  <span>{{ (tableData_questionLibrary.pageNum - 1) * tableData_questionLibrary.pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column> -->

              <!-- 展开行 -->
              <!--<el-table-column type="expand">
                <template v-if="props.row.questionType !== 2||props.row.questionType !== 5"
                          slot-scope="props">
                  <ul>
                    <li v-for="(item, index) in props.row.optionsDoList"
                        :key="index"
                        type="A">{{ item.content }}<em v-if="props.row.questionType === 3||props.row.questionType === 4"> [ {{ item.score }} 分 ]</em></li>
                  </ul>
                </template>
              </el-table-column>-->

              <!-- 标题 -->
              <el-table-column label="题目标题"
                               prop="title"
                               align="center" />

              <!-- 类型 -->
              <el-table-column label="题目类型"
                               prop="questionType"
                               align="center">
                <template slot-scope="scope">{{ translateQuestionType(scope.row.questionType).label }}
                </template>
              </el-table-column>
              <!-- 内容 -->
              <el-table-column label="内容"
                               width="300"
                               align="center">
                <template v-if="props.row.questionType !== 2"
                          slot-scope="props">
                  <div v-if="props.row.optionsDoList.length > 0">
                    <el-tooltip class="item"
                                :placement="props.row.optionsDoList.length < 5 ?'top' : 'right'"
                                v-if="!props.row.showAnswer"
                                effect="dark">
                      <div slot="content">
                        <section
                          v-for="(item, index) in props.row.optionsDoList"
                          :key="index"
                        >
                          {{item['sortIndex']}}&nbsp;&nbsp;:&nbsp;&nbsp;{{item['content']}}<span v-if="props.row.questionType === 3||props.row.questionType === 4"> [ {{ item.score }} 分 ]</span>
                        </section>
                      </div>
                      <div class="tb-answer">
                        <i class="el-icon-arrow-down"
                           @click="props.row.showAnswer=true"></i>
                        {{props.row.optionsDoList[0]['sortIndex']}}&nbsp;&nbsp;:&nbsp;&nbsp;{{props.row.optionsDoList[0]['content']}}<span v-if="props.row.questionType === 3||props.row.questionType === 4"> [ {{ props.row.optionsDoList[0].score }} 分 ]</span>
                      </div>
                    </el-tooltip>

                    <section v-if="props.row.showAnswer">
                      <el-tooltip class="item"
                                  placement="top"
                                  v-for="(item, index) in props.row.optionsDoList"
                                  :key="index"
                                  :content="item['content']"
                                  effect="dark">
                        <div class="tb-answer">
                          <i class="el-icon-arrow-up"
                             @click="props.row.showAnswer=false"
                             v-if="index==0"></i>
                          {{item['sortIndex']}}&nbsp;&nbsp;:&nbsp;&nbsp;{{item['content']}}<span v-if="props.row.questionType === 3||props.row.questionType === 4"> [ {{ item.score }} 分 ]</span>
                        </div>
                      </el-tooltip>
                    </section>
                  </div>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column label="操作"
                               fixed="right"
                               width="80"
                               align="center">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click="joinQuestionList(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="paginationDiv">
              <el-pagination :total="tableData_questionLibrary.total"
                             :page-size="size"
                             :page-sizes="[10, 20, 30, 50, 100]"
                             layout="total, sizes, prev, pager, next, jumper"
                             :current-page="page"
                             background
                             @size-change="handleSizeChange"
                             @current-change="handleCurrentChange" />
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- 添加逻辑 -->
      <el-dialog title="显示逻辑"
                 :visible.sync="displayLogicShow"
                 :close-on-click-modal=false
                 :close-on-press-escape=false
                 width="800px"
                 @close="closeDisplayLogicDialog">
        <section class="display-logic-content">
          <span class="count">共 {{selectLogicData.options ? selectLogicData.options.length : 1}} 条显示逻辑</span>
          <div class="condition">符合以下
            <el-select v-model="selectLogicData.condition"
                       placeholder="请选择"
                       style="width:100px">
              <el-option label="全部"
                         value="1"></el-option>
              <el-option label="任一"
                         value="2"></el-option>
            </el-select>
            条件时显示此问题：
          </div>
          <div v-if="selectLogicData.options && selectLogicData.options.length > 0">
            <div class="options"
                 v-for="(item, i) in selectLogicData.options"
                 :key="i">
              <el-select v-model="item.question"
                         class="options-first"
                         @change="logicQuestionChange(item, i)"
                         placeholder="请选择题目">
                <el-option v-for="item1 in displayLogicQuestion"
                           :key="item1.logicId"
                           :label="item1.title"
                           :value="item1.logicId"></el-option>
              </el-select>
              <el-select v-model="item.condition"
                         class="options-second"
                         :disabled="!item.question"
                         placeholder="请选择条件">
                <el-option v-for="item1 in item.conditionList"
                           :key="item1.value"
                           :label="item1.label"
                           :value="item1.value"></el-option>
              </el-select>
              <el-select v-model="item.option"
                         class="options-third"
                         :disabled="!item.question"
                         v-show="item.condition !== '1'"
                         placeholder="请选择选项">
                <el-option v-for="item1 in item.optionList"
                           :key="item1.optionId"
                           :label="item1.content"
                           :value="item1.sortIndex"></el-option>
                <el-option value="any"
                           label="任意选项"></el-option>
              </el-select>
              <i class="el-icon-remove-outline el-icon"
                 @click="deleteDisplayLogicItem(i)"></i>
              <i class="el-icon-circle-plus-outline el-icon"
                 @click="addDisplayLogicItem"></i>
            </div>
          </div>
          <div v-else>
            <el-button type="primary"
                       icon="el-icon-plus"
                       @click="addDisplayLogicItem">新增逻辑</el-button>
          </div>
        </section>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="closeDisplayLogicDialog">取 消</el-button>
          <el-button type="primary"
                     @click="saveDisplayLogic()">确 认</el-button>
        </span>
      </el-dialog>

      <!-- 引用问卷--列表 -->
      <useQuestion v-if="importDialog"
                   ref="ref_useQuestion"
                   :nurseUnitId="formContent.nurseUnitId"
                   @toUse = "toUse"></useQuestion>
    </slot>
  </div>
</template>

<script>
import './qsmsManage.scss'
import mixin from './mixin'
import useQuestion from './useQuestion'
import BaseQueryPageForm from '../common/BaseQueryPageForm'
import { SlickList, SlickItem } from 'vue-slicksort'
import { fetchQsmsDetails } from '@/api/qsms/qsmsManage/qsmsManage'
import getStorageUser from '@/assets/qsms/utils/storageUser'

export default {
  components: {
    SlickItem,
    SlickList,
    useQuestion
  },
  mixins: [mixin, BaseQueryPageForm],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      importDialog: false,
      reDataJson: [],
      yh_loading: false,
      addQsTypeClass: 'addQsTypeClass-nosort', // 根据题目类型显示不同的样式
      addQuestionClass: 'addQuestion-ow',
      addIndex: '',
      orderNum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      // 抽屉
      drawerTable: false,
      // 弹窗名称
      dialogTile: '',
      //
      questionDialogType: '',
      // 表单内容
      formContent: {
        answerOnPhone: 0,
        nurseUnitId: '',
        nurseUnitName: '',
        title: '',
        roomModel: '0',
        remark: '',
        // 问题列表
        questionsDoList: [
          // {
          //   title: '您对我院的服务态度是否满意1',
          //   required: '0',
          //   questionType: 3,
          //   optionsDoList: [
          //     {
          //       sortIndex: 'A',
          //       content: '非常满意',
          //       score: 10,
          //     },
          //     {
          //       sortIndex: 'B',
          //       content: '一般满意',
          //       score: 5,
          //     },
          //     {
          //       sortIndex: 'C',
          //       content: '不满意',
          //       score: 0,
          //     }
          //   ]
          // }
        ]
      },
      // 手动添加表单
      addForm: {
        title: '',
        required: 0,
        questionType: 0,
        optionsDoList: [{
          sortIndex: 'A',
          content: '',
          score: ''
        },
        {
          sortIndex: 'B',
          content: '',
          score: ''
        }
        ]
      },
      // 题库弹窗 字段
      pagesize: 10,
      currentPage: 1,
      // 查询字段
      search: {
        title: '',
        questionType: ''
      },
      // 表格数据
      tableData_questionLibrary: {},
      displayLogicShow: false, // 显示逻辑dialog显示
      displayLogicData: {
      }, // 显示逻辑数据
      selectLogicQid: '', // 当前显示逻辑选项ID
      selectLogicData: {}, // 当前打开逻辑显示选项数据
      displayLogicQuestion: [] // 逻辑显示选项选择题目
    }
  },
  watch: {
    // 监听题库窗口现实时，重新请求数据
    drawerTable (val) {
      if (val) {
        this.getData_questionLibrary()
      }
    },

    // 监听问题选项排序后序号重置
    'addForm.optionsDoList' () {
      this.addForm.optionsDoList.forEach((val, i) => {
        val.sortIndex = this.lowerLetter(i)
      })
    },
    // 监听问题选项排序后序号重置
    'formContent.questionsDoList' () {
      this.dealQueSort()
    }

  },
  mounted () {
    // 编辑时请求当前问卷的数据
    this.dealDeptId()
    if (this.detail.type === 'edit') {
      fetchQsmsDetails(this.detail.row.paperId).then(response => {
        this.formContent = response.data
        this.formContent.nurseUnitIds = response.data.nurseUnitIdArrays
        this.formContent.nurseUnitNames = response.data.nurseUnitNameArrays
        this.formContent.title = response.data.title
        this.formContent.roomModel = response.data.roomModel
        this.formContent.remark = response.data.remark
        if (response.data.questionsDoList !== null) this.formContent.questionsDoList = response.data.questionsDoList
        this.formContent.questionsDoList.forEach(ele => {
          // 为题目添加逻辑id
          if (!ele.logicId) {
            ele.logicId = this.GenNonDuplicateID()
          }
          // 显示逻辑赋值
          if (ele.displayLogicDoList && ele.displayLogicDoList.length > 0) {
            let options = []
            let condition = ele.displayLogicDoList[0].conditionType
            ele.displayLogicDoList.forEach(val => {
              options.push({
                condition: val.conditionSelect, // 条件关系
                option: val.conditionSortIndex, // 条件选项
                question: val.conditionLogicId // 条件题目logicid
              })
            })
            this.displayLogicData[ele.logicId] = {
              condition,
              options
            }
          }
        })
        console.log('===题目数据===', this.formContent.questionsDoList)
        this.dealQueSort()
      })
    }
  },
  methods: {
    dealDeptId () {
      if (this.detail.pageFrom === 'HW') {
        this.formContent.nurseUnitId = 0
        this.formContent.nurseUnitName = 0
      } else {
        this.nurseUnitList = getStorageUser('selectDeptInfo')
        if (this.nurseUnitList !== null && this.nurseUnitList !== '') {
          this.formContent.nurseUnitId = this.nurseUnitList['deptId']
          this.formContent.nurseUnitName = this.nurseUnitList['deptName']
        }
      }
    },
    // 引用问卷
    toUse (importData, importIs) {
      let oldPageId = this.formContent.paperId
      fetchQsmsDetails(importData.paperId).then(response => {
        this.formContent = response.data
        this.formContent.nurseUnitIds = response.data.nurseUnitIdArrays
        this.formContent.nurseUnitNames = response.data.nurseUnitNameArrays
        this.dealDeptId()
        if (!importIs) {
          this.formContent.title = response.data.title
          this.formContent.roomModel = response.data.roomModel
          this.formContent.remark = response.data.remark
        } else {
          if (this.detail.type !== 'edit') {
            delete this.formContent.paperId
            delete this.formContent.createTime
            delete this.formContent.createUser
            delete this.formContent.updateTime
            delete this.formContent.updateUser
          } else {
            this.formContent.paperId = oldPageId
          }
          this.ifImport = importIs
        }

        // this.imageObjLogo.imageUrl = this.formContent.imageUrl

        this.formContent.questionsDoList = JSON.parse(JSON.stringify(response.data.questionsDoList))

        this.formContent.questionsDoList.forEach(ele => {
          // 为题目添加逻辑id
          if (!ele.logicId) {
            ele.logicId = this.GenNonDuplicateID()
          }

          // 处理logicId 和 conditionLogicId，处理关联关系ID
          if (importIs) {
            delete ele.paperId
            delete ele.createTime
            delete ele.createUser
            delete ele.updateTime
            delete ele.updateUser
            // 重新生成一个ID，用于替换之前的
            let newLogicId = this.GenNonDuplicateID()
            this.reDataJson.push({
              old: ele.logicId,
              new: newLogicId
            })
          }

          // 显示逻辑赋值
          if (ele.displayLogicDoList && ele.displayLogicDoList.length > 0) {
            let options = []
            let condition = ele.displayLogicDoList[0].conditionType
            ele.displayLogicDoList.forEach(val => {
              delete val.paperId

              options.push({
                condition: val.conditionSelect, // 条件关系
                option: val.conditionSortIndex, // 条件选项
                question: val.conditionLogicId // 条件题目logicid
              })
            })
            this.displayLogicData[ele.logicId] = {
              condition,
              options
            }
          }
        })

        console.log('===题目数据===', this.formContent.questionsDoList)
        this.dealQueSort()
      })
    },
    importList () {
      // 校验是否继续引入
      this.$confirm(`引用的问卷将会覆盖当前页的所有内容，确定引用?`, '确认', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        // 获取列表数据
        this.importDialog = true
        this.$nextTick(() => {
          this.$refs.ref_useQuestion.init()
        })
      }).catch(() => {})
    },
    // 检验题目列表中题目类型
    formContent_isShortAnswer (e) {
      return e === 2 || e === 5
    },

    /**
     * @切换护理单元
     * @description 切换护理单元获取 label 值
     */
    changeNurseUnit (val) {
      this.formContent.nurseUnitNames = [] // 清空护理单元名字
      for (let i = 0; i < this.formContent.nurseUnitIds.length; i++) {
        this.nurseUnitList.map(item => {
          if (item.deptId === this.formContent.nurseUnitIds[i]) {
            this.formContent.nurseUnitNames.push(item.deptName)
          }
        })
      }
    },

    // 题库查询
    query () {
      this.page = 1
      this.currPage = 1
      this.size = 10
      this.getData_questionLibrary(this.search)
    },
    /* 清除查询条件 */
    handleReset (formName) {
      this.page = 1
      this.currPage = 1
      this.size = 10
      this.search = {
        title: '',
        questionType: ''
      }
      this.getData_questionLibrary(this.search)
    },
    // 从题库加入问卷
    joinQuestionList (e) {
      let ee = this.deepClone(e)
      ee.sort = ''
      // 题库加入问卷时添加逻辑ID
      ee.logicId = this.GenNonDuplicateID()
      this.formContent.questionsDoList.push(ee)
      this.dealQueSort()
      this.$message('已加入题目列表！')
    },
    // 分页查询
    handleSizeChange (val) {
      this.size = val
      this.getData_questionLibrary({
        page: this.page,
        size: this.size,
        title: this.search.title,
        questionType: this.search.questionType
      })
    },
    // 分页查询
    handleCurrentChange (val) {
      this.page = val
      this.getData_questionLibrary({
        page: this.page,
        size: this.size,
        title: this.search.title,
        questionType: this.search.questionType
      })
    },
    // 类型切换后清空问题
    changeQuestionType (val) {
      if (val === 0 || val === 1) {
        this.addQsTypeClass = 'addQsTypeClass-nosort'
        this.addQuestionClass = 'addQuestion-ow'
      } else if (val === 3 || val === 4) {
        this.addQsTypeClass = 'addQsTypeClass-hassort'
        this.addQuestionClass = ''
      } else {
        this.addQsTypeClass = ''
      }
      if (val !== 2 || val !== 5) {
        this.addForm.optionsDoList = [
          {
            sortIndex: 'A',
            content: '',
            score: ''
          },
          {
            sortIndex: 'B',
            content: '',
            score: ''
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
@import '@/assets/qsms/css/self_common.scss';
.quest-list {
  overflow-y: scroll;
  height: 300px;
}
.SortableItem li {
  list-style-type: none !important;
}
ul {
  padding: 0 2.5em;
}
.display-logic-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .count {
    color: #aaaaaa;
  }
  .condition {
    margin: 0.6rem 0;
  }
  .options {
    margin: 0.6rem 0;
    display: flex;
    align-items: center;
    .options-first {
      width: 12rem;
    }
    .options-second {
      width: 8rem;
      margin: 0 0.6rem;
    }
    .options-third {
      width: 12rem;
    }
    .el-icon {
      font-size: 1.6rem;
      margin-left: 0.6rem;
      color: #acacac;
      cursor: pointer;
    }
    .el-icon-remove-outline:hover {
      color: #de7865;
    }
    .el-icon-circle-plus-outline:hover {
      color: #2270fe;
    }
  }
}

.btnClass {
  width: calc(100% - 100px);
}
</style>
