<template>
  <layout>
    <!--查询-->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="formSearchData" ref="formSearch">
        <el-form-item label="所属分类：">
          <el-select v-model="formSearchData.parentId" placeholder="请选择所属分类" clearable size="small" @change="changeSunClassify()">
            <el-option v-for="(item, index) in classifyData" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宣教分类：">
          <el-select v-model="formSearchData.typeId" placeholder="请选择宣教分类" clearable size="small">
            <el-option v-for="(item, index) in typeData" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宣教项目：">
          <el-input size="small" v-model="formSearchData.educationProject" placeholder="请输入宣教名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="宣教内容：">
          <el-input size="small" v-model="formSearchData.info" placeholder="请输入宣教内容" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" class="el-button-radius" icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
            <el-button type="text" @click="reloadList">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" size="small" @click="$emit('option-changed', 'add')" icon="el-icon-plus">添加</el-button>
    </div>
    <!--列表-->
    <div slot="main" class="main-list">
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        height="100%"
      >
        <!-- <el-table-column
          type="index"
          align="center"
          width="100"
          label="序号">
        </el-table-column> -->
        <el-table-column
          prop="parentName"
          align="center"
          :show-overflow-tooltip="true"
          label="所属分类">
        </el-table-column>
        <el-table-column
          align="center"
          prop="typeName"
          :show-overflow-tooltip="true"
          label="宣教分类"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="educationProject"
          :show-overflow-tooltip="true"
          label="宣教项目">
        </el-table-column>
        <el-table-column
          align="center"
          prop="info"
          :formatter="formatterFocusContent"
          :show-overflow-tooltip="true"
          label="宣教内容">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.deptId !== deptId" type="text" @click="$emit('option-changed', 'add', {}, scope.row)" disabled>编辑</el-button>
            <el-button v-if="scope.row.deptId !== deptId" type="text" @click="del(scope.row)" class="el-text-danger" disabled>删除</el-button>
            <el-button v-if="scope.row.deptId === deptId" type="text" @click="$emit('option-changed', 'add', {}, scope.row)">编辑</el-button>
            <el-button v-if="scope.row.deptId === deptId" type="text" @click="del(scope.row)" class="el-text-danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div slot="footer" class="page-bar">
      <!--组件页码显示-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </div>
  </layout>
</template>

<script>
  import BaseManage from '../../../assets/nrms/mixins/BaseManage';
  import { AxiosApi } from '../../../api/nrms/http/index';
  import layout from '../../../components/nrms/layout/list';

  export default {
    name: 'NurseFocus',
    components: { layout },
    mixins: [BaseManage],
    props: ['params'],
    data() {
      return {
        classifyData: [],
        typeData: [],
        deptId: '',
        modelName: '宣教',
        formSearchData: {
          parentId: '',
          typeId: '',
          educationProject: '',
          info: ''
        },
        url: '/nrms/web-nr/education'
      };
    },
    created() {
      let obj = JSON.parse(localStorage.getItem('selectDeptInfo')) || {};
      this.deptId = obj.deptId || '';
      this.getPidData();
      // this.getClassifyData();
      // this.getData();
    },
    activated (){
      this.reloadList();
    },
    methods: {
      // 重置
      reloadList() {
        this.getClassifyData();
        this.reload();
      },
      // 改变子分类
      changeSunClassify() {
        this.getClassifyData(this.formSearchData.parentId);
      },
      // 请求分类
      getClassifyData(typeId = '') {
        AxiosApi('/nrms/web-nr/education-type/query-children-list', {}, 'GET', { parentId: typeId }).then(res => {
          this.typeData = res.data || [];
        });
      },
      // 请求父类
      getPidData() {
        AxiosApi('/nrms/web-nr/education-type/query-parent', {}, 'GET').then(res => {
          this.classifyData = res.data || [];
        });
      },
      // 格式化数据
      formatterFocusContent(row) {
        let educationTextStr = '';
        if (row.educationText === null || row.educationText === '') {
          row.educationText = '[]';
        }
        let educationText = JSON.parse(row.educationText);
        educationText.forEach((item, index) => {
          if (item.value === '') return;
          educationTextStr += item.value + ',';
        });
        return `${educationTextStr.substr(0, educationTextStr.length - 1)}`;
      },
      handleCurrentChange(val) {
        this.pageInfo.currentPage = val;
        this.onSearchSubmit('page');
      },
      // 查询上一页，调用父级方法刷新列表
      handleSizeChange(val) {
        this.pageInfo.size = val;
        this.onSearchSubmit('page');
      }
    }
  };
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
</style>
