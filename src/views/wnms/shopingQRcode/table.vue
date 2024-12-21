
<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="typt-list-search" :inline="true">
        <!--   查询条件 -->
        <el-form-item label="科室:">
          <treeselect v-model="selectDeptId" :multiple="false" :options="dataTree" :normalizer="normalizer" @select="onSelect" :default-expand-level="2" :clearable="false" placeholder="请选择科室" />
        </el-form-item>
        <el-form-item>
          <!-- 查询按钮 -->
          <div class="typt-search-btn">
            <el-button type="primary" @click="queryHandler" class="el-button-radius" icon="el-icon-search">搜索</el-button>
          </div>
        </el-form-item>
      </el-form>
      <hr />
      <!--end-->
      <div class="typt-list-add-div">
        <!-- 添加 ,排序 按钮  -->
        <div class="action_div">
          <!-- 右侧排序  -->
          <el-button type="primary" size="small" @click="showDialog('add')">设置全院二维码</el-button>
        </div>
      </div>

      <!--列表-->
      <!-- table -->

      <el-table v-loading="yh_loading" :data="list" style="width: 100%" select-all stripe height="80%" v-if="showTableVisable">
        <el-table-column prop="bedName" label="床位号" align="center" width="400"></el-table-column>
        <el-table-column prop="roomName" label="所属房间" align="center" width="400"></el-table-column>
        <el-table-column prop="imageCounts" label="二维码数量" align="center" width="400"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showDialog( 'show', scope.row)" size="small">查看</el-button>

            <el-button type="text" @click="showDialog( 'edit', scope.row)" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--组件页码显示-->
      <!-- 分页码 -->
    </div>
    <el-dialog :title="diancanDialogTitle" :visible.sync="diancanDialog" width="35%" class="diancanDialog" :before-close="closeDialog" :close-on-click-modal="false">
      <div class="dialog-view">
        <upload ref="upload"></upload>
      </div>
      <span slot="footer" class="dialog-footer" v-if="saveFlag">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveRQcode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from "@/api/wnms/msgManage/systemConfig";
import BaseQueryPageForm from "../common/BaseQueryPageForm";
import mains from "./mains";
import Pagination from "@/components/wnms/paginations/pagination";
import { deepMerge } from "@/assets/wnms/utils";
import { Uploads, Uploads2 } from "@/api/wnms/qiniu";
import getStorageUser from "@/assets/wnms/utils/storageUser";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { debounce } from "@/assets/wnms/utils";
import Upload from "@/components/wnms/Upload/CropperMoreUploadImg.vue";
import deptMixins from "@/assets/wnms/js/deptMixins.js";

export default {
  components: {
    Pagination,
    Treeselect,
    Upload,
  },
  mixins: [BaseQueryPageForm, mains, deptMixins],
  data() {
    let search = this.initQueryCriteria();
    return {
      diancanDialogTitle: "上传二维码",
      dataTree: [],
      noneBtnImg: false,
      limitCountImg: 10, //上传图片的最大数量
      saveFlag: true,
      yh_loading: false,
      showVisible: false,
      showTableVisable: false,
      defDeptId: "",
      tabIndex: 0,
      diancanDialog: false,
      // 表格数据
      list: [],
      search: search,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      resRQlist: [],
      from: {
        bedId: "",
        orgId: getStorageUser("selectDeptInfo").orgId || "",
        type: "",
      },
    };
  },
  mounted() {
    this.getdepts();
  },
  methods: {
    onSelect(node, ins) {
      this.selectDeptId = node.deptId;
      this.search.deptId = this.selectDeptId;
    },
    normalizer(node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined,
      };
    },
    /*获取护理单元*/
    async getdepts() {
      let res = await API.getdepts();
      if (res.status === 200 && res.data !== null) {
        this.dataTree = res.data.list;
        // this.selectDeptId = this.dataTree[0].deptId;
        this.selectDeptId =
          this.getDefaultDeptInfo({ follow: true, notdefault: true }) ||
          this.dataTree[0].deptId;
        this.search.deptId = this.selectDeptId;
      }
      this.executeQueryPage();
    },
    // 二维码保存
    saveRQcode: debounce(
      function () {
        if (this.resRQlist.length < 0) {
          this.$message({
            type: "error",
            message: "暂无二维码！",
          });
          return false;
        }
        if (this.$refs.upload.list.length > 0) {
          for (let item in this.$refs.upload.list) {
            this.resRQlist.push(this.$refs.upload.list[item].imageUrl);
          }
        }
        API.addQrcode2({
          deptId: this.search.deptId,
          bedId: this.from.bedId,
          orgId: this.from.orgId,
          type: this.from.type,
          config: this.resRQlist.toLocaleString(),
        }).then((res) => {
          if (res.status === 200) {
            this.closeDialog();
            this.executeQueryPage();
            this.$message({
              message: "保存成功！",
              type: "success",
            });
          } else {
            this.$message.error("上传失败");
          }
        });
      },
      800,
      true
    ),
    beforeAvatarUpload(file) {
      const isformat = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isformat) {
        this.$message.error("图片只能是 JPG ,PNG格式!");
        return isformat;
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
        return isLt2M;
      }
    },
    closeDialog() {
      this.diancanDialog = false;
      this.resRQlist = [];
      this.$refs.upload.list = [];
    },
    editTitle(T) {
      if (this.tabIndex === 0 || this.tabIndex === "0") {
        this.diancanDialogTitle = T + "餐厅食堂二维码";
      } else if (this.tabIndex === "1") {
        this.diancanDialogTitle = T + "商超便利二维码";
      } else if (this.tabIndex === "2") {
        this.diancanDialogTitle = T + "护工中心二维码";
      }
    },

    showDialog(T, row = {}) {
      this.diancanDialog = true;
      this.saveFlag = true;
      this.noneBtnImg = false;
      if (T == "add") {
        this.from.bedId = this.from.orgId;
        this.editTitle("全院");
        let type = 0;
        if (this.tabIndex === 0 || this.tabIndex === "0") {
          type = 40;
        } else if (this.tabIndex === "1") {
          type = 41;
        } else if (this.tabIndex === "2") {
          type = 42;
        }
        this.from.type = type;
        this.getRqcode(type, T);
      } else if (T === "edit") {
        this.editTitle("编辑");
        this.from.bedId = row.bedId;
        this.from.type = this.tabIndex;
        this.getRqcode(this.tabIndex, T);
      } else if (T === "show") {
        this.editTitle("查看");
        this.from.bedId = row.bedId;
        this.noneBtnImg = true;
        this.from.type = this.tabIndex;
        this.getRqcode(this.tabIndex, T);
        this.saveFlag = false;
      }
    },

    async getRqcode(T, flag) {
      let qrcodeListRes = "",
        params = {
          bedId: this.from.bedId,
          orgId: this.from.orgId,
          type: T,
          deptId: this.search.deptId,
        },
        arr = [];
      if (flag === "show") {
        qrcodeListRes = await API.getWnBedQrcodeById(params);
      } else {
        qrcodeListRes = await API.getEditWnBedQrcode(params);
      }

      let data = qrcodeListRes.data || "";
      if (data !== "") {
        let c = data.split(",");
        for (let item in c) {
          arr.push({ imageUrl: c[item] });
        }
      }
      this.$refs.upload.list = arr;
    },

    /* 查询条件 */
    initQueryCriteria(form = {}) {
      return deepMerge(form, {
        pageHelper: 0,
        display: 3,
        bedId: "",
        orgId: getStorageUser("selectDeptInfo").orgId || "",
        deptId: "",
      });
    },

    async executeQueryPage() {
      // 功能很简单非要搞得这么复杂，shit
      // 为啥要用3个接口呢 后台一个一个的堆代码
      // 第一个接口是查询所有的床
      // 第二个接口是保存的图片的数量 合并到第一个接口上
      // 第三个接口是查询全院的数据，如果有全院那么每个床头要增加一个数量
      this.showTableVisable = true;
      let orgId = getStorageUser("selectDeptInfo").orgId || "";
      let getBedsList = await API.getBedsList(this.createQueryParams(false));
      let getQrcodeList = await API.getQrcodeList({
        type: this.tabIndex,
        orgId: orgId,
        deptId: this.search.deptId,
      });
      let type = 0;
      if (this.tabIndex === 0 || this.tabIndex === "0") {
        type = 40;
      } else if (this.tabIndex === "1") {
        type = 41;
      } else if (this.tabIndex === "2") {
        type = 42;
      }

      let getQycount = await API.getQycount({
        type: type,
        orgId: orgId,
        deptId: this.search.deptId,
      });
      let getBedsListData = getBedsList.data;
      let getQrcodeListData = getQrcodeList.data;
      let getQycountData = getQycount.data;
      for (let item in getBedsListData) {
        if (getQrcodeListData.length > 0) {
          for (let qrItem in getQrcodeListData) {
            if (
              getBedsListData[item].bedId == getQrcodeListData[qrItem].bedId
            ) {
              getBedsListData[item].imageCounts =
                getQrcodeListData[qrItem].imageCounts;
              break;
            } else {
              getBedsListData[item].imageCounts = getQycountData || 0;
            }
          }
        } else {
          for (let item in getBedsListData) {
            getBedsListData[item].imageCounts = getQycountData || 0;
          }
        }
      }
      this.list = getBedsListData;
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/wnms/css/self_common.scss";
.disUoloadSty .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
.list-page-new {
  .el-main {
    .el-table {
      height: 100% !important;
    }
  }
  @media screen and (max-height: 768px) {
    .el-main {
      .el-table {
        height: 90% !important;
      }
    }
    .el-footer {
      margin-bottom: 20px;
    }
  }
}
.businessDialog {
  .el-dialog__body {
    height: 500px;
  }
}
.diancanDialog {
  .el-dialog__body {
    min-height: 20vh;
    margin-left: 0.5vh;
  }
}

.dialog-view {
  .disabled .el-upload--picture-card {
    display: none;
  }
}
</style>
