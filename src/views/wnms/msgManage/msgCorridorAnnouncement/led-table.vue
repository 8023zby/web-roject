<!--LED显示屏公告-->
<template>
  <div class="typt-list-container">
    <!-- 查询条件 -->
    <div>
      <hr />
      <div class="typt-list-add-div">
        <el-button type="warning" @click="$emit('transfer','ledAddorEdit',{type:'add',selectDeptId})">发布公告</el-button>
        <div class="action_div">
          <el-button type="primary" :disabled="pagination.list.length <=0" @click="toSort()">公告排序</el-button>
          <el-button type="primary" :disabled="pagination.list.length <=0" @click="updateCorridor()">更新走廊屏</el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="pagination.list" style="width: 100%" height="80%" select-all stripe>
      <el-table-column prop="sortIndex" align="center" label="序号" width="150">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告名称" prop="materialName" align="center" />
      <el-table-column label="公告类型" prop="materialType" :formatter="formatter" align="center" />

      <el-table-column label="播放方式" prop="isLoop" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isLoop===1">轮播</div>
          <div v-else>定时播放</div>
        </template>
      </el-table-column>
      <el-table-column label="是否播放" prop="playType" align="center">
        <template slot-scope="scope">
          <el-switch :active-value="1" :inactive-value="0" @change="changeSwitch(scope.row)" v-model="scope.row.playType "></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="定时播放时间" prop="playTime" align="center">
        <template slot-scope="pyScope">
          <span v-if="pyScope.row.isLoop===0">{{pyScope.row.playTime===null?'': pyScope.row.playTime.map(item => item.playTime).toString()}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="el-button-text-color" @click="showImage(scope.row)">预览</span>
          <span class="el-button-text-color" @click="$emit('transfer','ledAddorEdit',{type:'edit',row:scope.row,selectDeptId})">编辑</span>
          <span class="el-text-danger" @click="delHandler(scope.$index, scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationDiv">
      <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    </div>
    <!--排序对话框-->
    <el-dialog :visible.sync="dialogSortVisible" width="800px" class="clsStor" :close-on-click-modal="false" :close-on-press-escape="false">
      <div slot="title" class="header-title">
        <!-- <span style="color:red">操作方式：鼠标拖拽所需项至相应位置以完成排序</span>-->
      </div>
      <el-table ref="dragTable" :data="tableSortData" style="width: 100%;" row-key="screenId" border fit highlight-current-row max-height="500">
        <el-table-column label="序号" type="index" width="150" />
        <el-table-column label="名称" prop="materialName" />
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button type="text" @click="moveUp(scope.$index, scope.row)">上移</el-button>
            <el-button type="text" @click="moveDown(scope.$index, scope.row)" style="color:#f56f6c">下移</el-button>
            <el-button type="text" @click="moveTop(scope.$index, scope.row)">置顶</el-button>
            <el-button type="text" @click="moveBottom(scope.$index, scope.row)" style="color:#f56f6c">置底</el-button>
            <el-button type="text" @click="customDo(scope.$index, scope.row)">指定位置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSortVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSortSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogShowVisible" width="100%">
      <div style="height:550px">
        <tempNumView :previewData="previewData"></tempNumView>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepMerge } from "@/assets/wnms/utils";
import BaseQueryPageForm from "../../common/BaseQueryPageForm";
import mixin from "./mixin";
import * as csmsManageApi from "@/api/wnms/msgManage/csmsManage";
import Pagination from "@/components/wnms/paginations/pagination";
import { formatter } from "../../../../assets/wnms/utils/common";
import tempNumView from "@/views/wnms/x28s/Manage/template/tempNumView";
import { selectDeptInfo, selectDeptInfoData } from "@/assets/wnms/utils/common";

export default {
  components: { Pagination, tempNumView },
  mixins: [BaseQueryPageForm, mixin],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data() {
    const search = this.initQueryCriteria();
    return {
      tableSortData: [],
      dialogSortVisible: false,
      search: search,
      Category: [],
      ft: [{ value: 0, name: "图文" }, { value: 1, name: "视频" }],
      dialogShowVisible: false,
      previewData: {},
      DeptInfo: {}, //护理单元信息
      selectDeptId: selectDeptInfo() // 当前护理单元
    };
  },
  mounted() {
    this.executeQueryPage();
  },
  methods: {
    /* 预览 */
    showImage(row) {
      csmsManageApi
        .getDetails({
          screenId: row.screenId
        })
        .then(res => {
          this.dialogShowVisible = true;
          if (res.status === 200) {
            // this.previewData = res.data
            // 跳转是那个模板
            let temp = row.materialType === 0 ? "tempNumView" : "tempNumVideo";
            this.$emit("transfer", temp, {
              previewData: res.data,
              showBackBtn: true
            });
          }
        });
    },
    /* 更新轮播状态 */
    changeSwitch(row) {
      // 是否轮播 0 不 1 是
      csmsManageApi
        .UpdatePlayType({ screenId: row.screenId, playType: row.playType })
        .then(res => {
          if (res.status === 200) {
            this.executeQueryPage();
            this.$message({
              type: "success",
              message: "设置成功"
            });
          }
        });
    },
    /* 查询条件 */
    initQueryCriteria(form = {}) {
      return deepMerge(form, {
        deptId: selectDeptInfo()
      });
    },

    /* 列表类型对照 */
    formatter(v) {
      return formatter(this.ft, v.materialType, {
        value: "value",
        label: "name"
      });
    },

    /* 获取列表 */
    executeQueryPage() {
      csmsManageApi.getInfo(this.createQueryParams()).then(data => {
        this.queryResultHandler(data);
      });
    },

    /* 列表删除 */
    customDelHandler(index, row) {
      csmsManageApi.Delete(row.screenId).then(res => {
        this.IsSuccess(res);
        this.executeQueryPage();
      });
    },
    /* 排序 */
    onSortSubmit() {
      let list = [];
      let newList = [];
      this.tableSortData.forEach((value, index) => {
        list.push(index + 1);
        newList.push(value.screenId);
      });
      csmsManageApi.Sort({ ids: newList, sortIndexs: list }).then(res => {
        this.IsSuccess(res);
        this.dialogSortVisible = false;
      });
    },
    updateCorridor() {
      let selectData = selectDeptInfoData();
      csmsManageApi.updateLed({ deptId: selectData.deptId }).then(res => {
        this.IsSuccess(res, () => {});
      });
    },
    /* 排序 */
    toSort() {
      csmsManageApi
        .getInfo({ pageHelp: 1, deptId: this.selectDeptId })
        .then(res => {
          if (res.status === 200) {
            this.tableSortData = res.data;
            this.dialogSortVisible = true;
          } else {
            this.$message("获取数据失败");
          }
        });
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.btn-area {
  padding: 20px 0px 10px 0px;
}
.query-area > div {
  margin-right: 50px;
}

.addbtn {
  float: right;
}
.clsStor {
  height: 85%;
}
.storTitle {
  color: red;
  font-size: 1em;
}
</style>
