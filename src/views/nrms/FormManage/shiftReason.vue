<template>
  <layoutEdit>
    <div slot="title">交班原因配置</div>
    <div slot="right_btn">
      <el-button type="primary" @click="() => { $emit('changed', 'list') }">返回</el-button>
    </div>
    <layout slot="main">
      <!-- 搜索条件 -->
      <div slot="left_btn" class="tool-bar">
          <el-button
            type="warning"
            icon="el-icon-plus"
            @click="add"
            size="small"
            >添加
          </el-button>
      </div>
      <!-- 表格 -->
      <div slot="main" class="main-list">
        <el-table
          :data="table_data"
          row-key="itemId"
          stripe
          highlight-current-row
          height="100%"
        >
          <el-table-column prop="shiftReasonName" label="交班原因名称" align="center"></el-table-column>
          <el-table-column align="center" label="排序" >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'top')"
              >置顶
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'up')"
              >上移
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'down')"
              >下移
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'bottom')"
              >置尾
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'assign')"
              >指定位置
              </el-button>
              <el-button
                type="text"
                @click="edit(scope.row)"
              >编辑
              </el-button>
              <el-button
                type="textred"
                @click="del(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </layout>
    <el-dialog
      :title="addForm.shiftReasonId ? '编辑' : '添加' + '交班原因'"
      :visible="reasonVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="580px"
      class="import-item-dialog"
    >
      <el-form :inline="true" :rules="addRules" :model="addForm" ref="add_form" label-suffix="：">
        <el-form-item prop="shiftReasonName" label="交班原因名称">
          <el-input
            v-model="addForm.shiftReasonName"
            placeholder="请输入"
            autocomplete="off"
            clearable
            maxlength="20"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="执行SQL配置" style="margin-left: 13px">
          <el-input
            v-model="addForm.shiftReasonSql"
            placeholder="请输入"
            autocomplete="off"
            clearable
            style="width: 300px"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close" size="small">取消</el-button>
        <el-button type="primary" @click="confirmReason()" size="small">
          确认
        </el-button>
      </div>
    </el-dialog>

  </layoutEdit>
</template>
<script>
import { ApiShiftReason } from '../../../api/nrms'
import layoutEdit from '../../../components/nrms/layout/edit'
import layout from '../../../components/nrms/layout/list'
export default {
  components: { layout, layoutEdit },
  props: ['detail'],
  data () {
    return {
      table_data: [],
      /**
      * ------------------------------------------------------------------
      * 添加和编辑交班原因
      * ------------------------------------------------------------------
      */
      reasonVisible: false,
      addForm: {
        shiftReasonName: '', // 交班原因名称
        shiftReasonSql: '' // 交班原因sql
      },
      addRules: {
        shiftReasonName: [
          { required: true, message: '请输入交班原因名称！', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    /**
    * ------------------------------------------------------------------
    * 初始化
    * ------------------------------------------------------------------
    */
    async getData () {
      try {
        const res = await ApiShiftReason.get({ formId: this.detail.formId })
        this.table_data = res.data
      } catch (error) {
      }
    },
    /**
    * ------------------------------------------------------------------
    * 排序
    * ------------------------------------------------------------------
    */
    itemSort (currentIndex, currentData, type) {
      console.log(currentIndex)
      let _itemData = this.table_data
      if (type === 'up') {
        if (currentIndex === 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        let prevIndex = currentIndex - 1
        let prevData = _itemData[prevIndex]
        // 交换序号
        prevData['sort'] = currentData['sort']
        currentData['sort'] = currentData['sort'] - 1
        // 交换位置
        _itemData[currentIndex] = prevData
        _itemData[prevIndex] = currentData
        this.updateSort(_itemData)
      } else if (type === 'down') {
        if (currentIndex === _itemData.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        let nextIndex = currentIndex + 1
        let nextData = _itemData[nextIndex]
        // 交换序号
        nextData['sort'] = currentData['sort']
        currentData['sort'] = currentData['sort'] + 1
        // 交换位置
        _itemData[currentIndex] = nextData
        _itemData[nextIndex] = currentData
        this.updateSort(_itemData)
      } else if (type === 'top') {
        if (currentIndex === 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        let currentData = _itemData.splice(currentIndex, 1)
        _itemData.unshift(currentData[0])
        // 重新排序
        for (let i = 0; i < _itemData.length; i++) {
          _itemData[i]['sort'] = i + 1
        }
        this.updateSort(_itemData)
      } else if (type === 'bottom') {
        if (currentIndex === _itemData.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        let currentData = _itemData.splice(currentIndex, 1)
        _itemData.push(currentData[0])
        // 重新排序
        for (let i = 0; i < _itemData.length; i++) {
          _itemData[i]['sort'] = i + 1
        }
        this.updateSort(_itemData)
      } else if (type === 'assign') {
        this.$prompt('跳转至', '指定位置', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputPattern: /^\d+$/,
          inputErrorMessage: `请输入数字序号(1-${_itemData.length})`,
          showClose: false
        }).then(({ value }) => {
          let currentData = _itemData.splice(currentIndex, 1)
          _itemData.splice(+value ? value - 1 : 0, 0, currentData[0])
          // 重新排序
          for (let i = 0; i < _itemData.length; i++) {
            _itemData[i]['sort'] = i + 1
          }
          this.updateSort(_itemData)
        })
      }
    },
    // 给后台更新数据
    updateSort (tableData) {
      let sortData = []
      tableData.forEach(v => {
        sortData.push(v.shiftReasonId)
      })
      ApiShiftReason.sort(sortData)
        .then(() => {
          this.table_data = JSON.parse(JSON.stringify(tableData))
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    /**
    * ------------------------------------------------------------------
    * 添加原因
    * ------------------------------------------------------------------
    */
    add () {
      this.addForm = {
        shiftReasonName: '',
        shiftReasonSql: ''
      }
      this.reasonVisible = true
    },
    // 确认添加原因
    async confirmReason () {
      this.addForm.formId = this.detail.formId
      this.$refs.add_form.validate(async (valid) => {
        if (valid) {
          try {
            if (this.addForm.shiftReasonId) {
              await ApiShiftReason.edit(this.addForm)
              this.$message.success('编辑成功')
            } else {
              await ApiShiftReason.add(this.addForm)
              this.$message.success('添加成功')
            }
            this.reasonVisible = false
            await this.getData()
          } catch (error) {
            this.$message.error(error.message)
          }
        } else {
          return false
        }
      })
    },
    /**
    * ------------------------------------------------------------------
    * 编辑
    * ------------------------------------------------------------------
    */
    edit (row) {
      this.addForm = {
        ...row
      }
      this.reasonVisible = true
    },
    /**
    * ------------------------------------------------------------------
    * 删除
    * ------------------------------------------------------------------
    */
    del (row) {
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(async () => {
        try {
          await ApiShiftReason.delete({ shiftReasonId: row.shiftReasonId })
          await this.getData()
        } catch (error) {
          this.$message.error(error.message)
        }
      })
    },
    close () {
      this.$refs['add_form'].resetFields()
      this.reasonVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/nrms/css/self_common";
/deep/ .el-main {
  height: 100%;
  >div {
    height: 100%;
  }
}
/deep/ .footer-btn {
  display: none;
}
</style>
