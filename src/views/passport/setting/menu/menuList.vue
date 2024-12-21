<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="菜单名称">
        <el-input v-model="formSearchData.name" placeholder="请输入菜单名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单状态">
        <el-select v-model="formSearchData.status" placeholder="请选择" clearable>
          <el-option v-for="item in MenuOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
        </div>
        <!--<el-button icon="el-icon-search" @click="reload">重置</el-button>-->
      </el-form-item>
    </el-form>
    <!--end-->
    <hr />
    <div class="typt-list-add-div">
      <el-button type="warning" size="small" @click="handleAdd" icon="el-icon-plus">添加</el-button>
      <div class="action_div">
        <!--<el-button type="danger" size="small" >批量删除</el-button>-->
        <el-button type="primary" @click="backList" v-show="cuid!=1?true:false" size="small">返回</el-button>
      </div>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="80%"
      >
      <el-table-column prop="name" label="菜单名称" align="center">
      </el-table-column>
      <el-table-column prop="authorityType" align="center" :formatter="formatType" label="类型">
      </el-table-column>
      <el-table-column prop="remark" label="请求地址" align="center" :formatter="formatUrl">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" :formatter="formatState">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column  align="center" label="操作" width="260">
        <template slot-scope="scope">
          <el-button v-show="cuid==4?false:true && scope.row.authorityType!='authority'"  type="text" @click="handleDown(scope.row)">向下查看</el-button>
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <div class="paginationDiv">
      <!--组件页码显示-->
      <page-info :pageInfo="pageInfo"></page-info>
    </div>
    <!--end-->
  </div>
</template>

<script>
import PageInfo from '../../../../components/passport/PageInfo'
import BaseManage from '../../../../assets/passport/mixins/BaseManage'

export default {
  props: ['params'],
  mixins: [BaseManage],
  components: {
    PageInfo
  },
  data () {
    return {
      formSearchData: {
        name: '',
        status: ''
      },
      formSearchDataStatic: {
        parentId: '',
        authorityType: ''
      },
      MenuOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '显示'
        },
        {
          value: '2',
          label: '隐藏'
        }
      ],
      clickData: [], // 点击当前ID和点击后的ID
      cuid: 1,
      modelName: '菜单',
      url: '/passport/web-rbac/authoritys'
    }
  },
  created () {
    this.onSearchSubmit()
  },
  mounted () {
    // cid 这个是编辑返回时候传过的值
    let params = this.params || {}
    let cid = params.cuid || 1
    this.cuid = cid// 编辑回传的值
    let _this = this

    let CuData = JSON.parse(localStorage.getItem('cuData')) || []
    CuData.forEach((value, index) => {
      if ((parseInt(value.cuid) + 1) === cid) {
        _this.formSearchDataStatic.parentId = value.authorityId
        _this.formSearchDataStatic.authorityType = value.authorityType
        _this.onSearchSubmit()
      }
    })
  },
  watch: {
    cuid () {
      this.onSearchSubmit()
    }
  },
  methods: {
    // 状态转换
    formatState (row, column) {
      return row.status === 2 ? '隐藏' : '显示'
    },
    // 列表上的类型转换
    formatType (row, column) {
      let Ctype = { 'system': '一级菜单', 'model': { '2': '二级菜单', '3': '三级菜单' }, 'authority': '按钮' }
      if (row.authorityType === 'model') {
        return Ctype[row.authorityType][this.cuid] || ''
      } else {
        return Ctype[row.authorityType] || ''
      }
    },
    // 列表上的类型转换
    formatUrl (row, column) {
      if (row.authorityType === 'authority') {
        return row.url === null ? '' : row.url
      } else {
        return row.remark === null ? '' : row.remark
      }
    },
    // 点击返回按钮
    backList () {
      this.cuid = parseInt(this.cuid) - parseInt(1)
      let CuData = JSON.parse(localStorage.getItem('cuData')) || []
      CuData.forEach((value, index) => {
        if (parseInt(value.cuid) === this.cuid) {
          /* 数组中的数据如果是空那么赋值的话也是空 */
          this.formSearchDataStatic.parentId = value.parentId
          if (value.parentId === '') {
            this.formSearchDataStatic.authorityType = 'system'
          } else {
            this.formSearchDataStatic.authorityType = 'model'
          }
          this.pageInfo = value.pageInfo
        }
      })
    },
    // 向下查看
    handleDown (row) {
      this.cuid = this.cuid + 1
      this.formSearchDataStatic.parentId = row.authorityId
      if (this.cuid >= 4) {
        this.formSearchDataStatic.authorityType = 'authority'
      } else {
        this.formSearchDataStatic.authorityType = 'model'
      }

      /*  初始化 */
      this.pageInfo = {
        currentPage: 1,
        total: 0,
        size: 10
      }
      /*
        返回上级菜单id
        注意：此值应该在二级或者三级中有 其余级中没有
     */
      if (this.cuid === 2) {
        localStorage.removeItem('cuData')
      }

      let CuData = JSON.parse(localStorage.getItem('cuData')) || []
      CuData.push({
        authorityId: row.authorityId, // 当前的ID
        authorityType: this.formSearchDataStatic.authorityType,
        cuid: this.cuid - 1,
        parentId: row.parentId || '', // 点击下一层的ID
        pageInfo: this.pageInfo
      })
      localStorage.setItem('cuData', JSON.stringify(CuData))
    },
    // 修改菜单
    handleEdit (row) {
      let addSate = false
      /* 如果当前编辑的数据是菜单那么就需要把 type类型传给编辑框中 */
      if (row.authorityType === 'authority') {
        addSate = true
      }
      this.$emit('option-changed', 'add', {
        cuid: this.cuid,
        authorityId: row.authorityId,
        addSate: addSate
      })
    },
    // 添加菜单
    handleAdd () {
      this.$emit('option-changed', 'add', { cuid: this.cuid })
    },
    // 删除菜单
    handleDelete (row) {
      this.formSearchDataStatic.authorityType = row.authorityType
      this.formSearchDataStatic.authorityIds = row.authorityId
      this.del(this.url, this.formSearchDataStatic)
    }
  }
}
</script>
