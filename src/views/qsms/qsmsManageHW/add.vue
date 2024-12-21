<!--全院问卷-添加-->
<template>
  <el-container>
    <el-header class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{ detail.type === 'edit'?'编辑':'新建' }}问卷</div>
    </el-header>

    <el-main>
      <div class="typt-add-container"
           style="margin-top: 30px; max-height: inherit">
        <div class="typt-add-form"
             style="width: 100%">
          <el-form ref="formContent"
                   :model="formContent"
                   :rules="rules"
                   label-width="100px">
            <el-form-item label="问卷标题"
                          prop="title">
              <el-input v-model.trim="formContent.title"
                        type="text"
                        maxlength="16"
                        :show-word-limit="true" />
            </el-form-item>
            <el-form-item label="问卷说明">
              <el-input v-model="formContent.remark"
                        type="textarea"
                        maxlength="200"
                        :show-word-limit="true" />
            </el-form-item>
          </el-form>

          <!-- 题目列表 -->
          <el-row>
            <div class="questionsDoList">
              <SlickList v-model="formContent.questionsDoList"
                         axis="y"
                         lock-axis="y"
                         :press-delay="200"
                         :use-window-as-scroll-container="true"
                         class="SortableList">
                <SlickItem v-for="(item, index) in questionsDoList_worker"
                           :key="index"
                           class="SortableItem"
                           :index="index">
                  <span>
                    <h5>
                      {{item.orderNum!==undefined?item.orderNum + '、':''}} {{item.title}}
                      <small>[ {{ translateQuestionType(item.questionType).label }} ]</small>
                      <el-button-group>
                        <el-button size="mini"
                                   icon="el-icon-edit"
                                   @click="openDialog('edit', {index, item})" />
                        <el-button size="mini"
                                   icon="el-icon-delete"
                                   @click="delQuestion(formContent.questionsDoList[index])" />
                      </el-button-group>
                    </h5>
                    <ul v-if="!formContent_isShortAnswer(item.questionType)">
                      <li v-for="(subitem, i) in item.optionsDoList"
                          :key="i"
                          type="A">
                        {{ subitem.content }}
                        <em v-if="item.questionType === 3||item.questionType === 4">[ {{ subitem.score }} 分 ]</em>
                      </li>
                    </ul>
                  </span>
                </SlickItem>
              </SlickList>
            </div>
          </el-row>
        </div>
      </div>

      <div class="typt-add-footer">
        <el-row>
          <el-button type="success"
                     @click="openDialog('add')">手动添加问题</el-button>
          <el-button type="info"
                     @click="drawerTable = true">添加题库问题</el-button>

          <el-button @click="$emit('option-changed', 'list')">取 消</el-button>
          <el-button type="primary"
                     @click="detail.type === 'edit' ? editData('formContent') : saveData('formContent')">保 存</el-button>
        </el-row>
      </div>

      <!-- 手动添加问题 -->
      <el-dialog :title="dialogTile"
                 :visible.sync="isDialogVisible"
                 :close-on-click-modal=false
                 :close-on-press-escape=false
                 width="600px"
                 @close="clearDialog">
        <div class="addQuestion">
          <el-form ref="addForm"
                   :model="addForm"
                   :rules="rules">

            <el-form-item label="是否必选"
                          prop="required">
              <el-radio v-model="addForm.required"
                        :label="1">必填题</el-radio>
              <el-radio v-model="addForm.required"
                        :label="0">选填题</el-radio>
            </el-form-item>

            <el-form-item label="题目类型">
              <el-radio v-for="item in questionTypeList"
                        :key="item.value"
                        v-model="addForm.questionType"
                        :label="item.value"
                        @change="changeQuestionType">{{ item.label }}</el-radio>
            </el-form-item>

            <el-form-item label="标题"
                          prop="title"
                          :rules="[
                          {
                              required: true,
                              message: '请输入标题',
                              trigger: 'blur'
                            },
                            {
                              min: 1,
                              max: addForm.questionType === 5?64:32,
                              message: `请输入${addForm.questionType === 5?64:32}位以内`,
                              trigger: 'blur'
                            }
                          ]">
              <el-input v-model.trim="addForm.title"
                        type="text"
                        :maxlength="addForm.questionType === 5?64:32"
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
                           :index="index">
                  <el-row class="clear"
                          :gutter="5"
                          :class="addForm_isScore ? 'scoreQuestion':''">
                    <el-col :span="addForm_isScore ? 20 : 24">
                      <el-form-item :label="`选项 ${lowerLetter()[index]}`"
                                    :prop="'optionsDoList.' + index + '.content'"
                                    :rules="{
                          required: true,
                          message: '请输入选项',
                          trigger: 'blur'
                        }">
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

              <div v-if="addForm.optionsDoList.length < 99"
                   class="add-question"
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
      <el-drawer title="题库"
                 :visible.sync="drawerTable"
                 direction="rtl"
                 size="50%"
                 @close="closeDrawer">

        <!-- 自定义 抽屉 -->
        <div class="dc-drawer">
          <div class="drawer-body">
            <el-form ref="search"
                     :inline="true"
                     :model="search"
                     class="search">
              <!-- 标题 -->
              <el-form-item prop="title">
                <el-input v-model="search.title"
                          placeholder="请输入题目标题"
                          prefix-icon="el-icon-search" />
              </el-form-item>
              <!-- 类型 -->
              <el-form-item prop="questionType">
                <el-select v-model="search.questionType"
                           placeholder="请选类型"
                           style="width: 120px">
                  <el-option label="全部"
                             value="" />
                  <el-option v-for="(item) in questionTypeList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <!-- 按钮 -->
              <el-button type="primary"
                         icon="el-icon-search"
                         class="el-button-radius"
                         @click="query">搜索</el-button>
              <el-button type="text"
                         @click="handleReset()">重置</el-button>
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
              <el-table-column type="expand">
                <template v-if="props.row.questionType !== 2||props.row.questionType !== 5"
                          slot-scope="props">
                  <ul>
                    <li v-for="(item, index) in props.row.optionsDoList"
                        :key="index"
                        type="A">{{ item.content }}<em v-if="props.row.questionType === 3||props.row.questionType === 4"> [ {{ item.score }} 分 ]</em></li>
                  </ul>
                </template>
              </el-table-column>

              <!-- 标题 -->
              <el-table-column label="标题"
                               prop="title"
                               align="center" />

              <!-- 类型 -->
              <el-table-column label="类型"
                               prop="questionType"
                               width="100"
                               align="center">
                <template slot-scope="scope">{{ translateQuestionType(scope.row.questionType).label }}
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
                             background
                             @size-change="handleSizeChange"
                             @current-change="handleCurrentChange" />
            </div>
          </div>
        </div>
      </el-drawer>
    </el-main>
  </el-container>
</template>

<script>
import './qsmsManageHW.scss'
import mixin from './mixin'
import { SlickList, SlickItem } from 'vue-slicksort'
import { fetchQsmsDetails } from '@/api/qsms/qsmsManage/qsmsManage'

export default {
  components: {
    SlickItem,
    SlickList
  },
  mixins: [mixin],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      // 临时排序
      questionsDoList_worker: [],
      // 抽屉
      drawerTable: false,
      // 弹窗名称
      dialogTile: '',
      //
      questionDialogType: '',
      // 表单内容
      formContent: {
        nurseUnitId: 0, // 全院护理单元为 0
        nurseUnitName: '全院',
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
        required: null,
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
      tableData_questionLibrary: {}
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

    // 格式化新建问卷表单，增加序号
    'formContent.questionsDoList' (val) {
      let num = 1

      this.questionsDoList_worker = this.deepClone(val).map(item => {
        if (item.questionType !== 5) {
          item.orderNum = num
          num++
        }
        return item
      })
    }
  },
  mounted () {
    // 表单中添加护理单元
    this.formContent.nurseUnitName = this.nurseUnitName
    // 编辑时请求当前问卷的数据
    if (this.detail.type === 'edit') {
      fetchQsmsDetails(this.detail.row.paperId).then(response => {
        this.formContent = response.data
        this.formContent.title = response.data.title
        this.formContent.roomModel = response.data.roomModel
        this.formContent.remark = response.data.remark
        this.formContent.questionsDoList = response.data.questionsDoList
      })
    }
  },
  methods: {
    // 检验题目列表中题目类型
    formContent_isShortAnswer (e) {
      return e === 2 || e === 5
    },

    // 深拷贝方法
    deepClone (obj) {
      const _obj = JSON.stringify(obj)
      const objClone = JSON.parse(_obj)
      return objClone
    },

    // 题库查询
    query () {
      this.page = 1
      this.currPage = 1
      this.size = 10
      this.getData_questionLibrary(this.search)
    },
    /* 清楚查询条件 */
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
      this.formContent.questionsDoList.push(e)
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
    },
    // 抽屉关闭回调
    closeDrawer () {
      this.search.title = ''
      this.search.questionType = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.SortableItem {
  z-index: 10000;
  padding: 1em;
}
.SortableItem li {
  list-style-type: upper-alpha;
}
ul {
  padding: 0 2.5em;
}
.dc-drawer {
  padding: 1em;
}
</style>
