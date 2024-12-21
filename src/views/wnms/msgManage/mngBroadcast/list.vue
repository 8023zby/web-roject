<!--
  文件描述：基于新UI的list页面-音频管理-播出单列表
    主样式class：typt-list-container
    使用的中台统一样式
  创建时间：2020/4/22 08:19
  更改时间：2020-10-13
  创建人：Administrator

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->
<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form ref="search" :inline="true" :model="search" :rules="rules" class="typt-list-search">
      <el-form-item label="播出单名称">
        <el-input v-model="search.broadcaseName" placeholder="请输入播出单名称" prefix-icon="el-icon-search" maxlength="16" />
      </el-form-item>
      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button type="primary" icon="el-icon-search" size="small" @click="serachHandler">搜索</el-button>
          <el-button type="text" @click="resetHandler">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!--查询条件模块 === END-->
    <hr />

    <!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button type="warning" size="small" icon="el-icon-plus" @click="$emit('option-changed', 'add')">添加</el-button>
      <!--右侧区域按钮-->
      <div class="action_div">
        <el-button type="primary" size="small" @click="
            $emit('option-changed', 'AudioManagementList', {
              audioType: 'broadcast',
            })
          ">{{ isAudioType }}管理</el-button>
      </div>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <el-table v-loading="yh_loading" :data="pagination.list" :header-cell-style="{ background: '#f9f9f9' }" select-all height="100%" stripe>
      <!-- <el-table-column type="index" label="序号" width="160" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.$index + (pagination.page - 1) * pagination.size + 1
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="播出单名称" prop="broadcaseName" align="center" />
      <el-table-column label="包含音频" prop="audioFilesDoList" align="center">
        <template slot-scope="scope">
          <div class="div-word-ellipsis" style="-webkit-line-clamp: 1; text-align: left">
            <span v-for="(item, index) in scope.row.audioFilesDoList" :key="item.id">{{ item.audioName
              }}{{
                `${scope.row.audioFilesDoList.length != index + 1 ? "、" : ""}`
              }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="定时播放时间" prop="playTimeList" align="center" :formatter="formatter"></el-table-column>
      <el-table-column label="操作" fixed="right" width="220" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" :disabled="scope.row.state === 1 ? true : false" @click="isEdit(scope.row)" style="color: #1e87f0">编辑</el-button>
          <el-button type="text" size="small" :disabled="scope.row.state === 1 ? true : false" @click="delHandler(scope.row)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--表格主体 ==== END-->

    <!--分页条-->
    <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot> </slot>
  </div>
</template>

<script>
import "./mngBroadcast.scss";
import mixin from "../mngClock/mixin";
import Pagination from "@/components/wnms/paginations/pagination";
import BaseQueryPageForm from "../../common/BaseQueryPageForm";
import * as API from "@/api/wnms/msgManage/systemConfig";
import { selectDeptInfo } from "@/assets/wnms/utils/common";
import getStorageUser from "@/assets/wnms/utils/storageUser";

import {
  queryListApi,
  delApi,
  getState,
  delManifest
} from "@/api/wnms//msgManage/mngBroadcast";

export default {
  name: "MngBroadcast",
  mixins: [mixin, BaseQueryPageForm],
  components: { Pagination },
  data() {
    return {
      broadcastLoading: false, // 加密传输加载状态
      // 配置内容
      configContent: {
        broadcastEncryption: false
      },
      yh_loading: false,
      detail: {
        audioType: "broadcast"
      },
      // 表格数据
      tableData: {},
      // 查询参数
      search: {
        deptIds: this.selectDeptInfo(),
        broadcaseName: ""
      },
      selectDeptInfol: null
    };
  },
  mounted() {
    // this.search.deptIds = '6ffe27da1d7a4865998e8b03cc85b520'
    // 获取广播列表
    this.executeQueryPage();
    try {
      this.selectDeptInfol = JSON.parse(localStorage.getItem("selectDeptInfo"));
    } catch (e) {
      console.log("获取localstrage有问题");
    }

    // 护理单元 ID
    let _nurseUnitId = this.selectDeptInfo();
    // 设备ID
    let _deviceId = localStorage.getItem("deviceId");
    // 机构ID
    let _orgId = getStorageUser("selectDeptInfo").orgId;

    // 请求数据
    API.fetchSystemConfigDetails("whole", {
      orgId: _orgId, // 机构ID
      // nurseUnitId: _nurseUnitId, // 护理单元ID
      deviceId: _deviceId //  设备ID
    }).then(response => {
      if (response.status == 200) {
        this.configContent = response.data;
      }
    });
  },
  methods: {
    // 加密传输状态改变

    /**
     * @获取广播列表
     */
    executeQueryPage() {
      this.yh_loading = true;
      queryListApi({
        size: this.pagination.size,
        page: this.pagination.page,
        ...this.search
      })
        .then(response => {
          this.queryResultHandler(response);
        })
        .finally(() => {
          this.yh_loading = false;
        });
    },
    /**
     * @是否可编辑
     * @param {String: id} 问题 id，必填
     * @description
     */
    isEdit(row) {
      getState(row.id).then(response => {
        if (response.status === 200) {
          // 路由转跳编辑页面
          this.$emit("option-changed", "add", { type: "edit", row });
        } else {
          this.$message({
            type: "error",
            message: response.desc
          });
        }
      });
    },
    /**
     * @删除广播
     */
    delHandler(param) {
      let deptId = this.selectDeptInfol.deptId;

      console.log(param, deptId);
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delManifest({
            manifest_name: param.broadcaseName + "#*yh*#" + deptId
          }).then(res => {
            console.log("音视频删除播放单返回参数：", res);
            if (res.status === 200) {
              delApi(param.id).then(response => {
                // 刷新列表
                this.IsSuccess(response, () => {
                  this.executeQueryPage();
                });
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 搜索
    serachHandler() {
      this.page = 1;
      this.currPage = 1;
      this.initPagination(this.pagination);
      this.executeQueryPage();
    },

    // 清楚查询条件
    resetHandler() {
      this.page = 1;
      this.size = 10;
      this.currPage = 1;
      this.search.broadcaseName = "";

      this.initPagination(this.pagination);
      this.executeQueryPage();
    },

    // 格式化播放时间
    formatter(row, column) {
      // 数组字符串对象转数组对象
      const playTimeList = new Function("return " + row.playTimeList)();
      // console.log(playTimeList[0])

      if (
        playTimeList !== undefined &&
        playTimeList[0] !== null &&
        playTimeList[0].length !== 0
      ) {
        let playTime = "";

        playTimeList.forEach((item, i) => {
          if (item[0] !== "" && item[0] !== null) {
            let t = item[0].split(":");
            let t2 = "";
            if (item[1].indexOf(":") > 0) t2 = item[1].split(":");
            playTime += `${t[0] +
              ":" +
              t[1] +
              " - " +
              (t2 === "" ? item[1] : t2[0] + ":" + t2[1]) +
              (i + 1 != playTimeList.length ? "," : "")}`;
          }
        });

        return playTime;
      }
    }
  }
};
</script>
