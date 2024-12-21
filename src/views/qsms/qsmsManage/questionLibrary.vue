<template>
  <!-- 自定义 抽屉 -->
  <div class="dc-drawer"
       :class="drawerVisible?'show':'hide'">
    <div class="drawer-header">
      题库
    </div>
    <div class="drawer-body">
      <el-form ref="search"
               :inline="true"
               :model="search"
               class="search">
        <el-form-item prop="title">
          <el-input v-model="search.title"
                    placeholder="请输入题目标题"
                    prefix-icon="el-icon-search" />
        </el-form-item>
        <el-form-item prop="questionType">
          <el-select v-model="search.questionType"
                     placeholder="请选类型">
            <el-option label="全部"
                       value />
            <el-option v-for="(item) in questionTypeList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   class="el-button-radius"
                   @click="query">搜索</el-button>
        <el-button type="text"
                   @click="handleReset('search')">重置</el-button>
      </el-form>
      <el-table :data="tableData_questionLibrary.list"
                :header-cell-style="{'background': '#f9f9f9'}"
                stripe>
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
        <el-table-column label="标题"
                         prop="title"
                         align="center" />
        <el-table-column label="类型"
                         prop="questionType"
                         width="100"
                         align="center">
          <template slot-scope="scope">{{ translateQuestionType(scope.row.questionType).label }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="内容"
                         prop="optionList"
                         width="200"
                         align="center">
          <template>
            <ul>
              <li type="A"
                  v-for="(item,index) in tableData_questionLibrary.list[0].optionList"
                  :key="index">{{ item.content }}</li>
            </ul>
          </template>
        </el-table-column> -->
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
      <div class="paginationDiv">
        <el-pagination :total="tableData_questionLibrary.total"
                       :page-size="size"
                       :current-page.sync="currPage"
                       :page-sizes="[10, 20, 30, 50]"
                       layout="total, sizes, prev, pager, next, jumper"
                       background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" />
      </div>
    </div>
    <span slot="footer"
          class="drawer-footer">
      <el-button @click="hidePanel">取消</el-button>
    </span>
  </div>
</template>

<script>
import './qsmsManage.scss'
import mixin from './mixin'
export default {
  mixins: [mixin],
  props: {
    drawerVisible: {
      type: Boolean
    }
  },
  data () {
    return {
      pagesize: 10,
      currentPage: 1,
      // 查询字段
      search: {
        title: '',
        questionType: ''
      },
      // 表单内容
      formContent: {
        nurseUnit: '',
        title: '在这里添加标题哦~',
        roomModel: '0',
        desc: '在这里添加描述哦~'
      },
      // 表格数据
      tableData_questionLibrary: {}
    }
  },
  watch: {
    // 监听题库窗口现实时，重新请求数据
    drawerVisible (val) {
      if (val) {
        this.getData_questionLibrary()
      }
    }
  },
  mounted () {
    // 初始化题库数据
    this.getData_questionLibrary()
  },
  methods: {
    // 题库查询
    query () {
      alert(555)
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
    // 从题库加入问卷（数据传给父组件）
    joinQuestionList (e) {
      this.$emit('listenToChildEvent', {
        title: e.title,
        required: e.required,
        questionType: e.questionType,
        optionsDoList: e.optionsDoList
      })
      this.$message('已加入题目列表！')
    },
    // 隐藏抽屉
    hidePanel () {
      this.$emit('update:drawerVisible', false)
    },
    // 分页查询
    handleSizeChange (val) {
      this.size = val
      this.getData_questionLibrary({
        page: this.page,
        size: this.size,
        title: this.search.title,
        questionType: this.search.questionType,
      })
    },
    // 分页查询
    handleCurrentChange (val) {
      this.page = val
      this.getData_questionLibrary({
        page: this.page,
        size: this.size,
        title: this.search.title,
        questionType: this.search.questionType,
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dc-drawer {
  // 抽屉宽度
  $drawer-width: 40%;

  width: $drawer-width;
  position: fixed;
  top: 50px;
  right: -$drawer-width - 10;
  bottom: -50px;
  z-index: 5;
  padding: 1em;
  background: #fff;
  // border-left: 1px solid #ddd;
  transition: all 0.35s ease-in-out;
  -webkit-box-shadow: -1px 0 4px rgba(0, 21, 41, 0.08);
  box-shadow: -1px 0 4px rgba(0, 21, 41, 0.08);
  overflow-y: auto;

  &.show {
    right: 0;
  }
  &.hide {
    right: -$drawer-width - 10;
  }
  .drawer-header {
    padding: 1em;
    text-align: center;
    font-weight: bold;
  }
  .drawer-footer {
    display: block;
    margin-top: 2em;
    text-align: right;
  }
}

.el-pagination {
  margin-top: 1em;
}
</style>

