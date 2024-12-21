<template>
  <layout v-loading="loading">
      <!-- 操作按钮 -->
      <div slot="left_btn" class="tool-bar">
        <el-button type="warning" icon="el-icon-plus" @click="labelAdd(null)" v-uni="'hulijibie_add'" v-checkAuth="'addNurseLevel'">添加</el-button>
      </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        :data="nurse_level_data"
        stripe
        highlight-current-row
        height="100%"
      >
        <!-- <el-table-column type="index" label="序号" width="120" align="center"></el-table-column> -->
        <el-table-column
          prop="nurseLevelName"
          label="护理级别"
          align="center"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="nurseLevelShort"
          label="级别简称"
          min-width="100"
          align="center"
        ></el-table-column>
        <el-table-column prop="fontColor" align="center" label="字体颜色" min-width="130">
          <template slot-scope="scope">
            <span v-html="scope.row.fontColorShow"></span>
            <span>{{scope.row.fontColor}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="backgroundColor" align="center" label="背景颜色" min-width="130">
          <template slot-scope="scope">
            <span v-html="scope.row.backgroundColorShow"></span>
            <span>{{scope.row.backgroundColor}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" header-align="center" width="200" v-if="checkAuth('editNurseLevel,deleteNurseLevel')">
          <template slot-scope="scope">
            <el-button @click="labelUse(scope.row)" type="text" size="small"
                       v-checkAuth="'usedNurseLevel'"
                       v-uni:[scope.row.nurseLevelId]="'hulijibie_using'" :key="'using' + scope.row.nurseLevelId"
            >应用
            </el-button
            >
            <el-button @click="labelAdd(scope.row)" type="text" size="small"
            v-uni:[scope.row.nurseLevelId]="'hulijibie_edit'" :key="'edit' + scope.row.nurseLevelId"
                       v-checkAuth="'editNurseLevel'"
            >编辑
            </el-button
            >
            <el-button
              type="textred"
              size="small"
              @click="labelDelete(scope.row)"
              v-if="scope.row.canDelete"
              v-checkAuth="'deleteNurseLevel'"
              v-uni:[scope.row.nurseLevelId]="'hulijibie_delete'" :key="'delete' + scope.row.nurseLevelId"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template slot>
    <!-- 标签应用到科室 -->
      <NurseLevel2Dept
      ref="NurseLevel2Dept"
      :visible.sync="label2nurse_visible"
      :init_checked="label2nurse_data"
      :nurse_data="nurse_data"
      :nurse_level_id="current_nurse_level_id"
    ></NurseLevel2Dept>
    </template>
  </layout>
</template>

<script>
import moduleMixin from '../../../assets/bnms/mixins/moduleMixin'
import NurseLevel2Dept from './NurseLevel2Dept'
import { ApiNurseLevel, ApiDept } from '../../../api/bnms'
import layout from '../../../components/bnms/layout/list'
export default {
  name: 'nurse_level_list',
  components: { layout, NurseLevel2Dept },
  mixins: [moduleMixin],
  data () {
    return {
      loading: false,
      nurse_level_data: [],
      // 标签应用
      label2nurse_visible: false,
      label2nurse_data: [],
      current_nurse_level_id: '',
      nurse_data: []
    }
  },
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('deptInfo')) || {}
    this.deptId = deptInfo.deptId || ''
    // 1 获取护理单元
    // this.getDeptData()
    // 2 获取标签
    // this.getNurseLevelData()
  },
  activated () {
    // 1 获取护理单元
    this.getDeptData()
    // 2 获取标签
    this.getNurseLevelData()
  },
  methods: {
    getNurseLevelData () {
      this.loading = true
      ApiNurseLevel.selectAll()
        .then(res => {
          res.data = res.data || []
          this.nurse_level_data = res.data.map(v => {
            v.backgroundColorShow =
                '<span style="background-color: ' +
                v.backgroundColor +
                '; width: 16px; height: 16px; border-radius: 2px; display: inline-block; vertical-align: middle; margin-right: 12px"></span>'
            v.fontColorShow =
                '<span style="background-color: ' +
                v.fontColor +
                '; width: 16px; height: 16px; border-radius: 2px; display: inline-block; vertical-align: middle; margin-right: 12px"></span>'
            return v
          })
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    getDeptData () {
      ApiDept.select().then(res => {
        this.nurse_data = res.data.list
      })
    },
    searchForm () {
      this.getNurseLevelData()
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.getNurseLevelData()
    },
    labelUse (row) {
      ApiNurseLevel.selectApplyDept({ nurseLevelId: row.nurseLevelId }).then(
        res => {
          this.label2nurse_data = res.data.map(v => {
            return v.deptId
          })
          this.current_nurse_level_id = row.nurseLevelId
          this.label2nurse_visible = true
        }
      )
    },
    labelAdd (row) {
      this.$emit('changed', 'add', row)
    },
    labelDelete (row) {
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiNurseLevel.delete({ nurseLevelId: row.nurseLevelId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getNurseLevelData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
</style>
