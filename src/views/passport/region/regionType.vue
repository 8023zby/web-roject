<template>
  <div class="typt-list-container">
    <div class="typt-list-add-div" v-if="authorityObj['regionType_add']" >
      <el-button v-uni="actKey + 'add'" type="warning" size="small" icon="el-icon-plus" @click="addLevelLocation('add')">添加</el-button>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      height="80%"
      :default-sort="{prop: 'roomName', order: 'descending'}"
      :header-cell-style="{background:'#F7F7F7',color:'#333333',fontSize:'16px'}">
      <el-table-column label="区域类型层级" prop="level" align="center"></el-table-column>
      <el-table-column label="区域类型名称" prop="locationName" align="center"></el-table-column>
      <el-table-column v-if="authorityObj['delRegionType'] || authorityObj['qylxpx']" label="操作" align="center" width="450">
        <template slot-scope="scope">
          <el-button v-uni="actKey + 'delete-' + scope.row.levelId" v-if="authorityObj['delRegionType']" type="text" @click="handleDelete(scope.$index)" style="color:#f56f6c">删除</el-button>
          <el-button v-uni="actKey + 'up-' + scope.row.levelId" v-if="authorityObj['qylxpx']" type="text" @click="moveUp(scope.$index, scope.row)">上移</el-button>
          <el-button v-uni="actKey + 'down-' + scope.row.levelId" v-if="authorityObj['qylxpx']" type="text" @click="moveDown(scope.$index, scope.row)" style="color:#f56f6c">下移</el-button>
          <el-button v-uni="actKey + 'head-' + scope.row.levelId" v-if="authorityObj['qylxpx']" type="text" @click="moveTop(scope.$index, scope.row)">置顶</el-button>
          <el-button v-uni="actKey + 'bottom-' + scope.row.levelId" v-if="authorityObj['qylxpx']" type="text" @click="moveBottom(scope.$index, scope.row)" style="color:#f56f6c">置底</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <div class="paginationDiv" style="display: none">
      <!--组件页码显示-->
      <page-info :pageInfo="pageInfo"></page-info>
    </div>
    <!--end-->
    <!--新增区域对话框-->
    <el-dialog title="新增区域类型" :visible.sync="dialogFormVisible" width="500px" @close="closeDialog()">
      <el-form :model="form" class="typt-add-dialog" :rules="rules" ref="addForm">
        <el-form-item label="类型名称：" label-width="100px" prop="locationType">
          <el-select v-model="form.locationType" placeholder="请选择" v-uni="actAddFormKey + 'leixingmingcheng'">
            <el-option label="区域" value="location"></el-option>
            <el-option label="栋" value="building"></el-option>
            <el-option label="单元" value="unit"></el-option>
            <el-option label="楼层" value="floor"></el-option>
            <el-option label="室" value="house"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-uni="actAddKey + 'cancel'" @click="closeDialog">取 消</el-button>
        <el-button v-uni="actAddKey + 'save'" type="primary" @click="onSubmit(form)" :loading="addVis">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseManage from '../../../assets/passport/mixins/BaseManageIfms'
import PageInfo from '../../../components/passport/PageInfo'
export default {
  name: 'regionType',
  components: {
    PageInfo
  },
  inject: ['checkMoreAuthority'],
  mixins: [BaseManage],
  data () {
    return {
      dialogFormVisible: false,
      modelName: '区域类型',
      form: {
        locationType: ''
      },
      formSearchDataStatic: {
        pageHelper: '1'
      },
      formSearchData: {},
      levelChangeName: {
        location: '区域',
        building: '栋',
        unit: '单元',
        floor: '楼层',
        house: '室'
      },
      sortData: {
        'orgLocationLevelDoList': []
      },
      url: '/ifms/web-org/locationLevels',
      rules: {
        locationType: [
          { required: true, message: '请选择类型名称', trigger: 'change' }
        ]
      },
      authorityArr: ['regionType_add', 'delRegionType', 'qylxpx'],
      actKey: 'quyuleixing_',
      actAddFormKey: 'quyuleixingtianjia__',
      actAddKey: 'quyuleixingtianjia_'
    }
  },
  mounted: function () {
    // 判断是否有动作权限
    this.getListAuthority()
    this.pageInfo.size = 9999
    this.onSearchSubmit()
  },
  methods: {
    // 关闭添加
    closeDialog () {
      this.dialogFormVisible = false
      this.addVis = false
      this.$refs['addForm'].resetFields()
    },
    // 新增区域
    addLevelLocation () {
      this.form.locationType = ''
      this.dialogFormVisible = true
    },
    // 重新设置数据
    updateData (item, oldVal, newVal) {
      let tempData = [...this.tableData]
      tempData.splice(oldVal, 1)
      tempData.splice(newVal, 0, item)
      this.levelSort(tempData)
    },
    // 上移
    moveUp (index, row) {
      let num = index - 1
      if (Number(row.level) === 1) {
        this.$message({
          message: '该区域类型层级已经位于最顶层',
          type: 'warning'
        })
      } else {
        this.updateData(row, index, num)
      }
    },
    // 下移
    moveDown (index, row) {
      let num = index + 1
      if (Number(row.level) === this.tableData.length) {
        this.$message({
          message: '该区域类型层级已经位于最底层',
          type: 'warning'
        })
      } else {
        this.updateData(row, index, num)
      }
    },
    // 置顶
    moveTop (index, row) {
      if (Number(row.level) === 1) {
        this.$message({
          message: '该区域类型层级已经位于最顶层',
          type: 'warning'
        })
      } else {
        this.updateData(row, index, 0)
      }
    },
    // 置底
    moveBottom (index, row) {
      if (Number(row.level) === this.tableData.length) {
        this.$message({
          message: '该区域类型层级已经位于最底层',
          type: 'warning'
        })
      } else {
        this.updateData(row, index, this.tableData.length - 1)
      }
    },
    // 排序接口
    levelSort (data, act = 'sort') {
      data.forEach((item, index) => {
        let temp = { ...item }
        temp['level'] = index + 1
        data[index] = temp
      })
      let newSortData = { orgLocationLevelDoList: data }
      this.saveDataDo(newSortData, act, {}, false)
    },
    // 删除岗位
    handleDelete (index) {
      let tempData = [...this.tableData]
      tempData.splice(index, 1)
      this.levelSort(tempData, 'sortDelete')
    },
    // 提交表单
    onSubmit () {
      let _this = this
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (_this.tableData.some((item) => {
            return item['locationType'] === _this.form.locationType
          })) {
            this.$message({
              message: '该区域类型已添加',
              type: 'warning'
            })
          } else {
            this.saveDataDo(
              {
                orgLocationLevelDoList: [
                  {
                    level: _this.tableData.length + 1,
                    locationType: _this.form.locationType,
                    locationName: _this.levelChangeName['' + _this.form.locationType]
                  }
                ]
              }, 'add', {}, false
            )
          }
        }
      })
    }
  }
}
</script>
