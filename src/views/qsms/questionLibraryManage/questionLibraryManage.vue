<!--
  文件描述：基于新UI的list页面-题库管理列表
    主样式class：list-page-new
  创建时间：2020/4/24 12:49
  创建人：Administrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
  关于主体查询方法，方法名为：executeQueryPage
  表格数据变量为：pagination.list

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->

<template>
  <el-container class="list-page-new">
    <el-header height="auto">
      <!--有标题的话，header的class = header-hastitle-->
      <!--查询条件模块 === START-->
      <div class="">
        <div class="query-items-container" ref="query_form">
          <slot name="query">
            <el-form ref="search" :inline="true" :model="search" class="search">
              <el-form-item label="题目标题:" prop="title">
                <el-input v-model="search.title" placeholder="请输入题目标题" prefix-icon="el-icon-search" />
              </el-form-item>
              <el-form-item label="题目类型:" prop="questionType">
                <el-select v-model="search.questionType" placeholder="请选类型">
                  <el-option label="全部" value />
                  <el-option v-for="item in questionTypeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <!-- 查询按钮 -->
                <div class="typt-search-btn">
                  <el-button type="primary" icon="el-icon-search" class="el-button-radius" @click="query">搜索</el-button>
                  <el-button type="text" @click="handleReset('search')">重置</el-button>
                </div>
              </el-form-item>
            </el-form>
          </slot>
        </div>
      </div>
      <!--查询条件模块 === END-->
      <hr style="background-color: #e4e7ed; margin: 0; height: 1px" v-if="$slots.query && ($slots.left_btn || $slots.right_btn)" />
      <div class="tool-container">
        <div class="left">
          <!--左边按钮-->
          <slot name="left_btn">
            <el-button type="warning" size="small" icon="el-icon-plus" @click="openDialog('添加问题')">添加</el-button>
          </slot>
        </div>
        <div class="right">
          <!--右边按钮-->
          <slot name="right_btn"></slot>
        </div>
      </div>
    </el-header>
    <el-main>
      <!--主体列表-->
      <slot name="main">
        <div class="typt-list-container">
          <el-table :data="pagination.list" v-loading="yh_loading" class="table-questionLibraryMessage" height="100%" stripe>

            <!-- <el-table-column type="index"
                             label="序号"
                             width="160"
                             align="center">
              <template slot-scope="scope">
                <span>{{
                scope.$index + (pagination.page - 1) * pagination.size + 1
              }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="题目标题" prop="title" align="center" />
            <el-table-column label="题目类型" prop="questionType" width="180" align="center">
              <template slot-scope="scope">{{
              translateQuestionType(scope.row.questionType).label
            }}</template>
            </el-table-column>
            <el-table-column label="内容" prop="title" width="300" align="center">
              <template v-if="props.row.questionType !== 2" slot-scope="props">
                <div v-if="props.row.optionsDoList.length > 0">
                  <el-tooltip class="item" :placement="props.row.optionsDoList.length < 5 ?'top' : 'right'" v-if="!props.row.showAnswer" effect="dark">
                    <div slot="content">
                      <section v-for="(item, index) in props.row.optionsDoList" :key="index">
                        {{item['sortIndex']}}&nbsp;&nbsp;:&nbsp;&nbsp;{{item['content']}}<span v-if="props.row.questionType === 3||props.row.questionType === 4"> [ {{ item.score }} 分 ]</span>
                      </section>
                    </div>
                    <div class="tb-answer">
                      <i class="el-icon-arrow-down" @click="props.row.showAnswer=true"></i>
                      {{props.row.optionsDoList[0]['sortIndex']}}&nbsp;&nbsp;:&nbsp;&nbsp;{{props.row.optionsDoList[0]['content']}}<span v-if="props.row.questionType === 3||props.row.questionType === 4"> [ {{ props.row.optionsDoList[0].score }} 分 ]</span>
                    </div>
                  </el-tooltip>

                  <section v-if="props.row.showAnswer">
                    <el-tooltip class="item" placement="top" v-for="(item, index) in props.row.optionsDoList" :key="index" :content="item['content']">
                      <div class="tb-answer">
                        <i class="el-icon-arrow-up" @click="props.row.showAnswer = false" v-if="index == 0"></i>
                        <span style="display: inline-block; width: 30px">{{
                        item["sortIndex"]
                      }}</span>
                        &nbsp;&nbsp;:&nbsp;&nbsp;{{ item["content"] }}
                      </div>
                    </el-tooltip>
                  </section>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="openDialog('编辑问题', scope.row)">编辑</el-button>
                <el-button type="text" size="small" style="color: #ef9786" @click="delHandler(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </slot>
    </el-main>

    <el-footer height="auto" class="page-bar">
      <!--分页条-->
      <slot name="footer">
        <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
      </slot>
    </el-footer>
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <!-- 手动添加问题 -->
      <el-dialog :title="dialogTitle" :visible.sync="isDialogVisible" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="addQuestion">
          <el-form ref="addForm" :model="addForm" :rules="rules">
            <el-form-item label="是否必选">
              <el-radio v-model="addForm.required" :label="1">必填题</el-radio>
              <el-radio v-model="addForm.required" :label="0">选填题</el-radio>
            </el-form-item>

            <el-form-item label="题目类型">
              <el-radio v-for="item in questionTypeList" :key="item.value" v-model="addForm.questionType" :label="item.value" @change="changeQuestionType">{{ item.label }}</el-radio>
            </el-form-item>

            <el-form-item label="标题" prop="title" class="edutitle">
              <el-input v-model.trim="addForm.title" type="textarea" maxlength="64" placeholder="请输入内容" show-word-limit />
            </el-form-item>

            <div v-if="!addForm_isShortAnswer">
              <SlickList v-model="addForm.optionsDoList" axis="y" lock-axis="y" :press-delay="200" style="height:200px;overflow-y:scroll;" class="SortableList ">
                <SlickItem v-for="(item, index) in addForm.optionsDoList" :key="index" class="SortableItem" :index="index">
                  <el-row class="clear" :gutter="5" :class="addForm_isScore ? 'scoreQuestion' : ''">
                    <el-col :span="addForm_isScore ? 20 : 24">
                      <el-form-item :label="`选项 ${lowerLetter()[index]}`" :prop="'optionsDoList.' + index + '.content'" :rules="{
                          required: true,
                          message: '请输入选项',
                          trigger: 'blur',
                        }">
                        <el-input v-model.trim="addForm.optionsDoList[index].content" type="text" placeholder="必填，支持汉字、字母、数字、字符" maxlength="32" :show-word-limit="true">
                          <el-button v-if="index > 1" slot="append" icon="el-icon-delete" @click="delOption(item)" />
                        </el-input>
                      </el-form-item>
                    </el-col>

                    <el-col v-if="addForm_isScore" :span="4">
                      <el-form-item label="分值" :prop="'optionsDoList.' + index + '.score'" :rules="[
                          {
                            required: true,
                            message: '请输入分值',
                            trigger: 'blur',
                          },
                          {
                            pattern: /^[0-9]+$/,
                            message: '请输入正整数',
                            trigger: 'blur',
                          },
                        ]">
                        <el-input v-model.trim="addForm.optionsDoList[index].score" type="text" placeholder="分值" maxlength="3" :show-word-limit="true" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </SlickItem>
                <div v-show="addForm.optionsDoList.length < 99" class="add-question" @click="addOption">
                  <em class="el-icon-plus"></em>
                </div>
              </SlickList>

            </div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideDialog">取 消</el-button>
          <el-button type="primary" @click="
              dialogTitle === '编辑问题'
                ? editQuestionLibrary('addForm')
                : addQuestionLibrary('addForm')
            " :loading="yh_loading" element-loading-spinner="el-icon-loading">确 认</el-button>
        </span>
      </el-dialog>
    </slot>
  </el-container>
</template>

<script>
import "../qsmsManage/qsmsManage.scss";
import mixin from "../qsmsManage/mixin";
import { SlickList, SlickItem } from "vue-slicksort";
import Pagination from "@/components/qsms/paginations/pagination";
import BaseQueryPageForm from "../common/BaseQueryPageForm";

import {
  fetchQuestionLibrary,
  delQuestionLibrary,
} from "@/api/qsms/qsmsManage/questionLibraryManage";

export default {
  name: "QuestionBankManage",
  components: {
    SlickItem,
    SlickList,
    Pagination,
  },
  mixins: [mixin, BaseQueryPageForm],
  data() {
    return {
      yh_loading: false,
      pagesize: 10,
      currentPage: 1,
      // 按钮是否禁用
      isBtnDisabled: false,
      // 弹窗是否显示
      isDialogVisible: false,
      //
      dialogTitle: "添加问题",
      // 表格数据
      tableData_questionLibrary: {},
      // 查询参数
      search: {
        title: "",
        questionType: "",
      },
    };
  },
  watch: {
    // 监听问题选项排序后序号重置
    "addForm.optionsDoList"() {
      this.addForm.optionsDoList.forEach((val, i) => {
        val.sortIndex = this.lowerLetter(i);
      });
    },
  },
  mounted() {
    this.executeQueryPage();
  },
  methods: {
    /**
     * @获取题库列表
     * @param {Integer: page} 页面，默认为1
     * @param {Integer: size} 条数，默认为10
     * @param {String: nurseUnitId} 护理单元id(多个,逗号拼接)
     * @param {String: title} 问卷标题
     * @param {Integer: paperState} 问卷状态，0 不可用 1 可用
     * @description 获取问卷列表
     */
    executeQueryPage() {
      this.yh_loading = true;
      fetchQuestionLibrary({
        size: this.pagination.size,
        page: this.pagination.page,
        ...this.search,
      })
        .then((response) => {
          // 定义一个是否展开答案的变量
          if (
            response.data &&
            response.data.list &&
            response.data.list.length > 0
          ) {
            for (let v of response.data.list.values()) {
              v.showAnswer = false;
            }
          }

          this.queryResultHandler(response);
        })
        .finally(() => {
          this.yh_loading = false;
        });
    },
    query() {
      this.page = 1;
      this.currPage = 1;
      this.size = 10;
      this.initPagination(this.pagination);
      this.executeQueryPage(this.search);
    },
    // 打开弹窗
    openDialog(dialogTitle, scope) {
      this.isDialogVisible = true;
      this.yh_loading = false;
      this.dialogTitle = dialogTitle;
      this.$nextTick(() => {
        this.$refs["addForm"].clearValidate();
      });

      if (scope !== undefined) {
        // 回显赋值
        this.addForm = scope;
      } else {
        // 添加时清空表单
        this.addForm = {
          title: "",
          required: 0,
          questionType: 1,
          optionsDoList: [
            {
              sortIndex: "A",
              content: "",
              score: "",
            },
            {
              sortIndex: "B",
              content: "",
              score: "",
            },
          ],
        };
      }
    },
    // 关闭弹窗
    hideDialog() {
      this.isDialogVisible = false;
      this.query();
    },

    /**
     * @删除题库问题
     * @param {String: id} 问题 id，必填
     * @description
     */
    customDelHandler(row) {
      delQuestionLibrary(row.questionId).then((response) => {
        if (response.status === 200) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.executeQueryPage();
        } else {
          this.$message({
            type: "error",
            message: response.desc,
          });
        }
      });
    },
    /* 清楚查询条件 */
    handleReset(formName) {
      this.page = 1;
      this.currPage = 1;
      this.size = 10;
      this.search = {
        title: "",
        questionType: "",
      };
      this.initPagination(this.pagination);
      this.executeQueryPage(this.search);
    },
    // 类型切换后清空问题
    changeQuestionType(val) {
      if (val !== 2 || val !== 5) {
        this.addForm.optionsDoList = [
          {
            sortIndex: "A",
            content: "",
            score: "",
          },
          {
            sortIndex: "B",
            content: "",
            score: "",
          },
        ];
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/qsms/css/self_common.scss";
.edutitle {
  .el-textarea__inner {
    padding-bottom: 20px;
  }
}

.SortableItem {
  z-index: 10000;
  padding: 1em;
}
.SortableItem li,
.el-table__expanded-cell li {
  list-style-type: upper-alpha;
}

.el-table__row:hover .tb-answer i {
  display: block;
}

.tb-answer {
  width: 100%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  padding: 6px 24px;
  height: 30px;

  i {
    color: #87baf1;
    position: absolute;
    top: 20px;
    left: 15px;
    display: none;
  }
}
.table-questionLibraryMessage {
  .el-table__body-wrapper {
    overflow-y: scroll !important;
  }
}

.typt-list-container tr:hover {
  transform: translateZ(0);
  box-shadow: 0 0 6px 0 hsla(0, 0%, 48.6%, 0.3);
}
</style>
