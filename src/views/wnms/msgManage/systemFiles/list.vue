<template>
  <div class="typt-list-container">
    <!--查询条件模块 === START-->
    <el-form ref="search" :inline="true" :model="search" class="typt-list-search">
      <el-form-item label="文件名">
        <el-input v-model="search.materialName" placeholder="请输入" maxlength="16" />
      </el-form-item>
      <el-form-item label="文件类型">
        <el-select v-model="search.materialType" placeholder="请选择" clearable="">
          <el-option label="全部" value="" />
          <el-option label="音频" value="audio" />
          <el-option label="图片" value="image" />
        </el-select>
      </el-form-item>
      <el-form-item label="应用终端">
        <el-select v-model="search.deviceType" placeholder="请选择" clearable="">
          <el-option label="全部" value="" />
          <el-option label="YH-6267i" value="YH-6267i" />
          <el-option label="YH-6297i" value="YH-6297i" />
          <el-option label="YH-A26i" value="YH-A26i" />
        </el-select>
      </el-form-item>
      <el-form-item label="应用科室：" prop="deptId" class="deptCls tdms-update">
        <treeselect style="width: 300px;" placeholder="请选择" v-model="search.deptId" noOptionsText="暂无数据" :multiple="false" :options="deptList" valueConsistsOf="ALL" noChildrenText="无子节点"/>
      </el-form-item>
      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button type="primary" icon="el-icon-search" size="small" @click="onSearch">搜索</el-button>
          <el-button type="text" @click="onReset">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
		<hr />
		<!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button type="warning" size="small" icon="el-icon-plus" @click="$emit('option-changed', 'add')">添加</el-button>
      <span class="disk-space">磁盘空间{{parserUnit(diskSpace.total)}}M，当前可用{{parserUnit(diskSpace.surplus)}}M</span>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <el-table
      v-loading="yh_loading"
      :data="pagination.list"
      :header-cell-style="{'background': '#f9f9f9'}"
      select-all
      height="100%"
      stripe
    >
      <el-table-column label="文件名" prop="materialName" align="center" show-overflow-tooltip/>
      <el-table-column label="文件类型" prop="materialType" align="center">
        <template slot-scope="scope">
          {{EMaterialType[scope.row.materialType]}}
        </template>
      </el-table-column>
      <el-table-column label="大小" align="center">
        <template slot-scope="scope">
          {{scope.row.materialSize + 'KB'}}
        </template>
      </el-table-column>
      <el-table-column label="应用终端" align="center">
        <template slot-scope="scope">
          {{getDevicesTypes(scope.row.deviceTypes)}}
        </template>
      </el-table-column>
      <el-table-column label="应用科室" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{getDevicesDepts(scope.row.deptIds)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="edit(scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.isEdit == 0"
            :style="scope.row.isEdit == 0 ? null : `color: #F56C6C`"
            @click="del(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
	</div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import Pagination from '@/components/wnms/paginations/pagination'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import * as API from "@/api/wnms/msgManage/systemConfig";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  mixins: [BaseQueryPageForm],
  components: { 
    Pagination,
    Treeselect
  },
	data() {
		return {
			search: {
        materialName: '',
        materialType: '',
        deviceType: '',
        deptId: null
      },
      yh_loading: false,
      EMaterialType: {
        'audio': '音频',
        'image': '图片'
      },
      flattenDeptList: [],
      deptList: [],
      diskSpace: {
        total: '0',
        surplus: '0',
      },
		}
	},
	mounted() {
    this.executeQueryPage()
    this.getDepts()
    this.getDeptList()
    this.getMaterialManageDiskSpace()
	},
	methods: {
		onSearch() {
      this.pagination.page = 1
      this.executeQueryPage()
    },
		onReset() {
      this.pagination.page = 1
      this.pagination.size = 10
      this.search = {
        materialName: '',
        materialType: '',
        deviceType: '',
        deptId: null
      }
      this.executeQueryPage()
    },
    executeQueryPage () {
      this.yh_loading = true
      API.getMaterialManage({
        size: this.pagination.size,
        page: this.pagination.page,
        ...this.search
      }).then(response => {
        this.queryResultHandler(response)
      }).finally(() => {
        this.yh_loading = false
      })
    },
    edit(row) {
      this.$emit('option-changed', 'edit', {row: row, type: 'edit'})
    },
    del(row) {
      this.$confirm('删除文件后会影响终端的功能，确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.yh_loading = true;
        API.delMaterialManage(row.materialId).then(res => {
          if (res.status == 200) {
            this.$message.success("删除成功");
            this.executeQueryPage();
            this.getMaterialManageDiskSpace()
          } else {
            this.$message.error("删除失败");
          }
        }).catch(err => {
        }).finally(() => {
          this.yh_loading = false;
        });
      }).catch(err => {
      })
    },
    getDevicesTypes(devicesTypes) {
      return devicesTypes.join(',')
    },
    getDevicesDepts(deptIds) {
      return deptIds.map(deptId => this.flattenDeptList.find(v => v.deptId === deptId)?  this.flattenDeptList.find(v => v.deptId === deptId).deptName : '').join(',')
    },
    getDepts() {
      API.getdepts()
        .then(res => {
          let temp = JSON.stringify(res.data.list)
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
          this.deptList = JSON.parse(temp)
        })
        .catch(err => {
        })
    },
    getDeptList() {
      let orgId = JSON.parse(localStorage.getItem('orgInfo')).orgId
      API.getDeptList(orgId)
        .then(res => {
          this.flattenDeptList = res.data || []
        })
    },
    async getMaterialManageDiskSpace () {
      API.getMaterialManageDiskSpace()
        .then(res => {
          this.diskSpace = res.data;
        });
    },
    parserUnit (num) {
      const res = parseFloat((num / 1024).toFixed(2));
      return res >= 0 ? res : 0;
    },
	}
}
</script>
<style lang="scss" scoped>
.disk-space {
  margin-left: 20px;
  color: #666;
}
</style>