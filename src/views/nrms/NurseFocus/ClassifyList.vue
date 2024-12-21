<template>
  <layout v-loading="loading">
    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <el-button v-uni="'jiaodianmuban_classify_add'" type="warning" @click="add()" icon="el-icon-plus" v-if="addFormData.parentId!==''">添加</el-button>
    </div>
    <!-- 操作按钮 -->
    <div slot="right_btn" class="tool-bar">
      <el-button v-uni="'jiaodianmuban_classify_edit'" type="primary" @click="parentFormVisible = true">所属分类名称编辑</el-button>
      <!--<el-button type="primary" size="small" @click="$emit('option-changed', 'list')">返回</el-button>-->
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        :data="tableData"
        stripe
        highlight-current-row
        v-loading="loading"
        height = "100%"
       >
        <!-- <el-table-column
          label="序号"
          align="center"
          type="index"
          width="120">
          <template scope="scope">
            <span>{{(pageInfo.currentPage - 1) * pageInfo.size + (scope.$index + 1)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          align="center"
          prop="typeName"
          min-width="100"
          label="分类名称"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="排序"
          min-width="500">
          <template slot-scope="scope">
            <el-button v-uni:[scope.$index]="'jiaodianmuban_classify_head'" type="text" @click="topDo(scope.row, scope.$index)">置顶</el-button>
            <el-button v-uni:[scope.$index]="'jiaodianmuban_classify_up'" type="text" @click="upDo(scope.row, scope.$index)">上移</el-button>
            <el-button v-uni:[scope.$index]="'jiaodianmuban_classify_down'" type="text" @click="downDo(scope.row, scope.$index)">下移</el-button>
            <el-button v-uni:[scope.$index]="'jiaodianmuban_classify_bottom'" type="text" @click="btmDo(scope.row, scope.$index)">置尾</el-button>
            <el-button v-uni:[scope.$index]="'jiaodianmuban_classify_setposition'" type="text" @click="customDo(scope.row, scope.$index)">指定位置</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          min-width="150">
          <template slot-scope="scope">
            <el-button type="text" v-uni:[scope.$index]="'jiaodianmuban_classify_edit'" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" v-uni:[scope.$index]="'jiaodianmuban_classify_delete'" @click="del(scope.row)" style="color: #F56C6C">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template slot>
      <!--添加-->
      <el-dialog title="添加分类" :visible.sync="setFormVisible" width="500px" :show-close="false" :close-on-click-modal="false">
        <el-form :rules="rules" :model="addFormData" ref="addForm" label-width="100px" class="typt-add-dialog">
          <el-form-item label="分类名称：" prop="typeName">
            <el-input v-uni="'jiaodianmuban_classify_tianjiafenlei_feileimingcheng'" v-model="addFormData.typeName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-uni="'jiaodianmuban_classify_tianjiafenlei_cancel'" @click="setFormVisible = false">取消</el-button>
          <el-button v-uni="'jiaodianmuban_classify_tianjiafenlei_confirm'" type="primary" @click="saveData">确认</el-button>
        </div>
      </el-dialog>
      <!--end-->
      <!--添加-->
      <el-dialog title="所属分类" :visible.sync="parentFormVisible" width="500px" :show-close="false" :close-on-click-modal="false">
        <el-form :rules="rules" :model="saveNewData" ref="addParentForm" label-width="130px" class="typt-add-dialog">
          <el-form-item label="所属分类名称：" prop="typeName">
            <el-input v-uni="'jiaodianmuban_classify_suoshufeilei_suoshufenleimingcheng'" v-model="saveNewData.typeName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-uni="'jiaodianmuban_classify_suoshufenlei_cancel'" @click="parentFormVisible = false">取消</el-button>
          <el-button v-uni="'jiaodianmuban_classify_suoshufenlei_confirm'" type="primary" @click="saveParentData" :loading="parentFormLoading">确认</el-button>
        </div>
      </el-dialog>
      <!--end-->
    </template>
  </layout>
</template>

<script>
import layout from '../../../components/nrms/layout/list'
import BaseManage from '../../../assets/nrms/mixins/BaseManage'
import { MsgShow } from '../../../assets/nrms/js/Message'
import { AxiosJsonApi, AxiosApi } from '../../../api/nrms/http/index'
export default {
  name: 'NurseFocusClassify',
  mixins: [BaseManage],
  components: { layout },
  data () {
    return {
      setFormVisible: false,
      parentFormVisible: false,
      parentFormLoading: false,
      actFlag: 'add',
      parentData: {
        typeName: '',
        typeId: '',
        parentId: '',
        deptId: ''
      },
      saveNewData: {
        typeName: '',
        typeId: '',
        parentId: '',
        deptId: ''
      },
      addFormData: {
        typeName: '',
        typeId: '',
        parentId: '',
        deptId: ''
      },
      url: '/nrms/web-nr/focus-type',
      modelName: '分类',
      rules: {
        typeName: [
          { required: true, message: '请输入分类名称！' },
          { message: '分类名称长度不超过20个字符！', trigger: 'blur', pattern: /^.{1,20}$/ }
        ]
      }
    }
  },
  // 初始化
  created () {
    let obj = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.addFormData.deptId = obj.deptId || ''
    this.parentData.deptId = obj.deptId || ''
    this.saveNewData.deptId = obj.deptId || ''
    this.getPidData()
    this.getData()
  },
  methods: {
    // 请求父类
    getPidData () {
      AxiosApi('/nrms/web-nr/focus-type/get-type-list', {}, 'GET', { deptId: this.addFormData.deptId }).then(res => {
        if (res.data.length > 0) {
          this.addFormData.parentId = res.data[0].typeId
          this.parentData.typeId = res.data[0].typeId
          this.parentData.typeName = res.data[0].typeName
          this.saveNewData = { ...this.parentData }
        }
      })
    },
    // 请求列表
    getData () {
      this.loading = true
      AxiosApi('/nrms/web-nr/focus-type', {}, 'GET', { deptId: this.addFormData.deptId }).then(res => {
        this.loading = false
        this.tableData = res.data === null ? [] : res.data
      })
    },
    // 添加操作
    add () {
      this.addFormData.typeId = ''
      this.addFormData.typeName = ''
      this.setFormVisible = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    // 保存数据
    saveData () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.saveDataDo(this.addFormData, this.actFlag, {}, false)
        }
      })
    },
    // 刷新页面
    reloadMain () {
      this.setFormVisible = false
      this.parentFormVisible = false
      this.getPidData()
      this.getData()
      this.parentFormLoading = false
    },
    saveParentData () {
      this.parentFormLoading = true
      this.$refs['addParentForm'].validate((valid) => {
        if (valid) {
          let act = 'add'
          if (this.saveNewData.typeId !== '') {
            act = 'modify'
          }
          this.saveDataDo(this.saveNewData, act, {}, false)
        } else {
          this.parentFormLoading = false
        }
      })
    },
    // 修改操作
    edit (data) {
      let d = { ...data }
      this.actFlag = 'modify'
      this.addFormData = d
      this.setFormVisible = true
    },
    // 上移
    upDo (item, index) {
      let num = index - 1
      if (num < 0) {
        this.$message.warning('已经是第一位了！')
        return
      }
      this.updateData(item, index, num)
    },
    // 下移
    downDo (item, index) {
      let num = index + 1
      if (num >= this.tableData.length) {
        this.$message.warning('已经是最后一位了！')
        return
      }
      this.updateData(item, index, num)
    },
    // 置顶
    topDo (item, index) {
      if (index === 0) {
        this.$message.warning('已经是第一位了！')
        return
      }
      this.updateData(item, index, 0)
    },
    // 置尾
    btmDo (item, index) {
      if (index === this.tableData.length - 1) {
        this.$message.warning('已经是最后一位了！')
        return
      }
      this.updateData(item, index, this.tableData.length - 1)
    },
    // 指定
    customDo (item, index) {
      this.$prompt('跳转至：', '指定位置', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: `请填写正确的位置(1-${this.tableData.length})`,
        showClose: false
      }).then(({ value }) => {
        if (parseInt(value) > this.tableData.length) {
          value = this.tableData.length
        }
        this.updateData(item, index, value - 1)
      })
    },
    // 重新设置数据
    updateData (item, oldVal, newVal) {
      this.tableData.splice(oldVal, 1)
      this.tableData.splice(newVal, 0, item)
      this.saveSortData()
    },
    // 保存数据
    saveSortData () {
      let saveData = []
      this.tableData.forEach((item, index) => {
        saveData.push({
          typeId: item.typeId,
          sort: index + 1
        })
      })
      AxiosJsonApi(`${this.url}/update-sort`, saveData, 'PUT').then(res => {
        let status = res.status
        let desc = res.data || ''
        if (status !== 200) {
          if (desc !== '') {
            MsgShow('error', desc)
            setTimeout(() => {
              this.getData()
            }, 1200)
            return false
          } else {
            MsgShow('error', `排序失败！`)
            setTimeout(() => {
              this.getData()
            }, 1200)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
</style>
