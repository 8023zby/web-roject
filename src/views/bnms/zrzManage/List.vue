<template>
  <!--护士排班-护士分组-->
  <div class="typt-list-container">
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="组名:">
        <el-input v-model="formSearchData.groupName" placeholder="请输入" clearable />
      </el-form-item>

      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" icon="el-icon-search" size="small" @click="onSearchSubmit" v-uni="'zerenzuguanliliebiao_search'">搜索</el-button>
          <el-button type="text" @click="reload" v-uni="'zerenzuguanliliebiao_reset'">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <hr />
    <div class="typt-list-add-div">
      <el-form>
        <el-row>
          <el-col :span="14">
            <el-button type="warning" size="small" style="padding: 6px 16px; border-radius: 2px" icon="el-icon-plus" v-uni="'zerenzuguanliliebiao_add'" @click="
                $emit('option-changed', 'add', {
                  tableData: tableData,
                  deptData: deptData,
                })
              ">添加
            </el-button>
          </el-col>
          <el-col :span="10" style="text-align: right">
            <el-select v-model="formSearchData.sortValue" clearable placeholder="请选择" @change="onSearchSubmit" style="margin-right: 20px">
              <el-option v-for="(item, index) in orderData" :key="index" :label="item.sort" :value="item.id" />
            </el-select>
            <!-- <el-button
              type="primary"
              size="small"
              style="padding: 6px 16px;border-radius: 2px;margin-right: 20px;margin-left: 20px;"
              v-uni="'zerenzuguanliliebiao_sort'"
              @click="onSearchSubmit"
            >排序
            </el-button> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--列表-->
    <el-table v-loading="loading" :data="tableData" :stripe="true" height="80%">
      <el-table-column prop="groupName" align="center" :label="'组名'" />
      <el-table-column prop="deptName" align="center" :label="'部门'" />
      <el-table-column prop="userString" align="center" :label="'组员姓名'" min-width="120">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.empDoList" :key="index">
            <span>{{ `${item.userName}(${item.empName})` }}
              {{ index + 1 == scope.row.empDoList.length ? "" : "," }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bedString" align="center" :label="'责任床位'" min-width="120" />
      <el-table-column prop="updateTime" align="center" :label="'创建时间'" min-width="120" />
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="
              $emit(
                'option-changed',
                'add',
                { tableData: tableData, deptData: deptData },
                scope.row
              )
            " v-uni:[scope.row.id]="'zerenzuguanliliebiao_edit'" :key="'edit' + scope.row.id">
            编辑
          </el-button>
          <el-button type="text" style="color: #f56c6c" @click="del(url + '/' + scope.row.id)" v-uni:[scope.row.id]="'zerenzuguanliliebiao_delete'" :key="'delete' + scope.row.id">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <page-info :page-info="pageInfo" />
  </div>
</template>

<script>
import BaseManage from "../../../assets/bnms/mixins/BaseManage";
import { AxiosApi } from "../../../api/bnms/http";
import PageInfo from "../../../components/bnms/PageInfo";

export default {
  name: "ZrzList",
  components: {
    PageInfo,
  },
  mixins: [BaseManage],
  props: ["params"],
  data() {
    return {
      modelName: "责任组",
      isPage: false,
      formSearchData: {
        groupName: "",
        sortValue: "updateTime desc",
      },
      url: "/wnms/web-wn/responsibilityGroup",
      deptData: [],
      orderData: [
        {
          id: "groupName asc",
          sort: "组名",
        },
        {
          id: "updateTime desc",
          sort: "创建时间",
        },
      ],
    };
  },
  created() {
    this.onSearchSubmit();
    this.getDeptList();
  },
  methods: {
    getDeptList() {
      // 查询部门
      AxiosApi("/ifms/web-org/depts", {}, "GET").then((res) => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list);
          temp = temp
            .replace(/deptId/g, "id")
            .replace(/deptName/g, "label")
            .replace(/,"children":null/g, "")
            .replace(/,"children":\[\]/g, "");
          this.deptData = JSON.parse(temp);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-button--small {
  padding: 6px 16px !important;
  border-radius: 2px !important;
}
</style>
