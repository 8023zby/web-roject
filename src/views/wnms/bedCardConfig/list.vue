<!--
  文件描述：床头卡模板配置页面
  创建时间：2021/1/28 8:49
  创建人：PCL
  wiki:http://192.168.30.168:8090/pages/viewpage.action?pageId=44991665
-->
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form
      ref="search"
      :inline="true"
      :model="search"
      class="typt-list-search"
    >
      <el-form-item label="模板名称:">
        <el-input v-model="search.label" placeholder="请输入" size="small" />
      </el-form-item>
      <el-form-item label="模板类型:">
        <el-select v-model="search.type" size="small" placeholder="请选择">
          <el-option value label="全部"></el-option>
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.type"
            :value="item.type"
          >{{ item.type }}</el-option
          >
        </el-select>
      </el-form-item>

      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="queryHandler"
            v-uni="'chuangtoukamuban_search'"
          >搜索</el-button
          >
          <el-button type="text" @click="clsHandler" v-uni="'chuangtoukamuban_reset'">重置</el-button>
        </div>
      </el-form-item>
      <el-form-item />
    </el-form>
    <hr />
    <!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button
        type="warning"
        icon="el-icon-plus"
        size="small"
        @click="$emit('option-changed', 'addOrModify', { type: 'add' })"
        v-uni="'chuangtoukamuban_add'"
      >添加</el-button>
      <!--右侧区域按钮-->
      <div class="action_div">
      </div>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <div class="template-table">
      <el-table
        v-loading="yh_loading"
        :data="pagination.list"
        :header-cell-style="{'background': '#f9f9f9'}"
        height="100%"
        stripe
      >
        <!--<el-table-column label="序号" prop="id" type="index" width="80" align="center">
        </el-table-column>-->
        <el-table-column label="模板名称" prop="label" align="center" />
        <el-table-column label="模板类型" prop="type" align="center" >
          <template slot-scope="scope">
            <div
              style=""
            >
              {{dealType(scope.row.type)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="缩略图" align="center">
          <!--任务定时类型（IMMEDIATE：即时，ABSOLUTE：绝对定时，RELATIVE：相对定时）-->
          <template slot-scope="scope">
            <div
              style=""
            >
              <img :src="scope.row.image" style="width: 120px;" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="文件路径"
          prop="path"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="备注" align="center" width="300">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.memo" placement="top" v-if="scope.row.fileName">
              <div class="showBeyond">
                {{scope.row.memo}}
              </div>
            </el-tooltip>
            <div style="color:#C0C4CC;" v-else>默认模板不可编辑删除</div>
          </template>
        </el-table-column>
  
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.fileName"
              @click="modify(scope.row)"
              v-uni:[scope.row.id]="'chuangtoukamuban_edit'"
              :key="'edit' + scope.row.id"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              :style="scope.row.fileName?'color:#F56C6C;':''"
              :disabled="!scope.row.fileName"
              @click="deletec(scope.row)"
              v-uni:[scope.row.id]="'chuangtoukamuban_delete'"
              :key="'delete' + scope.row.id"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--表格主体 ==== END-->
    </div>

    <!--分页条-->
    <pagination
      :pagination="pagination"
      @page-size-changed="pageSizeChangeHandler"
      @page-changed="pageChangeHandler"
    />
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
    </slot>
  </div>
</template>

<script>
import * as bedCardConfigApi from '@/api/wnms/bedCardConfig/'
import BaseQueryPageForm from '../common/BaseQueryPageForm'
import Pagination from '@/components/wnms/paginations/pagination'

export default {
  components: { Pagination },
  name: 'index',
  mixins: [BaseQueryPageForm],
  // import引入的组件需要注入到对象中才能使用
  data () {
    // 这里存放数据
    return {
      typeList: [],
      search: {
        label: '',
        type: ''
      },
      yh_loading: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 方法集合
  methods: {
    dealType (t) {
      if (t === 'bedHead') return '床头'
      else if (t === 'bedSide') return '床旁'
      else return t
    },
    /* 获取列表 */
    executeQueryPage () {
      this.yh_loading = true
      bedCardConfigApi.queryList(this.createQueryParams()).then(data => {
        this.queryResultHandler(data)
      }).catch(e => {
        this.yh_loading = false
        console.log('报错了！！', e)
      })
        .finally(() => {
          this.yh_loading = false
        })
    },
    modify (row) {
      this.$emit('option-changed', 'addOrModify', {
        type: 'edit',
        row: row
      })
    },
    deletec (row) {
      console.log(row)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        bedCardConfigApi.Delete(row.id).then(response => {
          // 刷新列表
          this.executeQueryPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /* 清楚查询条件 */
    clsHandler () {
      this.search = {
        label: '',
        type: ''
      }
      this.queryHandler()
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    bedCardConfigApi.queryType().then(data => {
      console.log(data.data)
      if (data.data) this.typeList = data.data
    }).catch(e => {
      console.log('报错了！！', e)
    })
      .finally(() => {
      })
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.executeQueryPage()
  }
}
</script>

<style lang="scss">
  .showBeyond{
    width: 250px;
    max-height: 90px;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:3;
  }
  .el-tooltip__popper{max-width:50%;}
</style>
<style lang="scss" scoped>
.template-table {
  flex: 1;
  overflow: hidden;
  // overflow-y: auto;
}
.el-table__body-wrapper {
  overflow-y: auto;
  max-height: calc(100% - 49.1px);
}
</style>
