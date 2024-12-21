<template>
  <layout v-loading="loading" style="height: 500px;padding: 35px 50px;">
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        :data="classify_data"
        row-key="classId"
        stripe
        highlight-current-row
        height="100%"
        v-uni="'tongjibiaoqianpaixuliebiao'"
      >
        <el-table-column prop="sort" label="序号" align="center" width="120"></el-table-column>
        <el-table-column prop="className" label="分类名称" min-width="100" align="center"></el-table-column>
        <el-table-column align="center" label="排序" min-width="300">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="classifySort(scope.$index, scope.row, 'top')"
              v-uni:[scope.row.classId]="'tongjibiaoqianbiaoqianfenleisort_head'"
              :key="'head' + scope.row.classId"
            >置顶
            </el-button>
            <el-button
              type="text"
              @click="classifySort(scope.$index, scope.row, 'up')"
              v-uni:[scope.row.classId]="'tongjibiaoqianbiaoqianfenleisort_up'"
              :key="'up' + scope.row.classId"
            >上移
            </el-button>
            <el-button
              type="text"
              @click="classifySort(scope.$index, scope.row, 'down')"
              v-uni:[scope.row.classId]="'tongjibiaoqianbiaoqianfenleisort_down'"
              :key="'down' + scope.row.classId"
            >下移
            </el-button>
            <el-button
              type="text"
              @click="classifySort(scope.$index, scope.row, 'bottom')"
              v-uni:[scope.row.classId]="'tongjibiaoqianbiaoqianfenleisort_bottom'"
              :key="'bottom' + scope.row.classId"
            >置尾
            </el-button>
            <el-button
              type="text"
              @click="classifySort(scope.$index, scope.row, 'assign')"
              v-uni:[scope.row.classId]="'tongjibiaoqianbiaoqianfenleisort_setposition'"
              :key="'setposition' + scope.row.classId"
            >指定位置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </layout>
</template>

<script>
import { ApiClassifyManage } from '../../../../api/bnms'
import layout from '../../../../components/bnms/layout/list'

export default {
  name: 'nurse_classify',
  components: { layout },
  data () {
    return {
      loading: false,
      classify_data: [],
      // 搜索表单
      search_status: false,
      search_from: {
        labelType: '101',
        deptId: ''
      }
    }
  },
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.search_from.deptId = deptInfo.deptId || ''
    this.getClassifyData()
  },
  activated () {
    // this.getClassifyData();
  },
  methods: {
    getClassifyData () {
      this.loading = true
      ApiClassifyManage.select(this.search_from)
        .then(res => {
          this.classify_data = res.data || []
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 编辑
    classifyAdd (data) {
      let opts = {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入',
        inputValidator: function (value) {
          if (!value || value === '') {
            return '分类名称不能为空！'
          }
          if (value.length > 20) {
            return '最多20个字符!'
          }
        },
        showClose: false
      }
      let title = '添加'
      let _data = {
        labelType: this.search_from.labelType,
        className: ''
      }
      if (data) {
        title = '编辑'
        opts['inputValue'] = '' + data.className
        Object.assign(_data, data)
      }

      this.$prompt('分类名称:', title, opts).then(({ value }) => {
        _data.className = value
        ApiClassifyManage.save(_data)
          .then(() => {
            this.getClassifyData()
            this.$message.success('添加成功！')
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    classifyDelete (row) {
      this.$confirm(' 确认要删除该数据？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiClassifyManage.delete({ classId: row.classId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getClassifyData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    classifySort (current_index, current_data, type) {
      if (this.search_status) {
        this.search_status = false
        this.resetForm()
        return false
      }
      let _classify_data = this.classify_data
      if (type === 'up') {
        if (current_index == 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        let prev_index = current_index - 1
        let prev_data = _classify_data[prev_index]
        // 交换序号
        prev_data['sort'] = current_data['sort']
        current_data['sort'] = current_data['sort'] - 1
        // 交换位置
        _classify_data[current_index] = prev_data
        _classify_data[prev_index] = current_data
        this.updateSort(_classify_data)
      } else if (type === 'down') {
        if (current_index == _classify_data.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        let next_index = current_index + 1
        let next_data = _classify_data[next_index]
        // 交换序号
        next_data['sort'] = current_data['sort']
        current_data['sort'] = current_data['sort'] + 1
        // 交换位置
        _classify_data[current_index] = next_data
        _classify_data[next_index] = current_data
        this.updateSort(_classify_data)
      } else if (type === 'top') {
        if (current_index == 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        let current_data = _classify_data.splice(current_index, 1)
        _classify_data.unshift(current_data[0])
        // 重新排序
        for (let i = 0; i < _classify_data.length; i++) {
          _classify_data[i]['sort'] = i + 1
        }
        this.updateSort(_classify_data)
      } else if (type === 'bottom') {
        if (current_index == _classify_data.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        let current_data = _classify_data.splice(current_index, 1)
        _classify_data.push(current_data[0])
        // 重新排序
        for (let i = 0; i < _classify_data.length; i++) {
          _classify_data[i]['sort'] = i + 1
        }
        this.updateSort(_classify_data)
      } else if (type === 'assign') {
        this.$prompt('跳转至:', '指定位置', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputPattern: /^\d+$/,
          inputErrorMessage: `请输入数字序号(1-${_classify_data.length})`,
          showClose: false
        }).then(({ value }) => {
          let current_data = _classify_data.splice(current_index, 1)
          _classify_data.splice(+value ? value - 1 : 0, 0, current_data[0])
          // 重新排序
          for (let i = 0; i < _classify_data.length; i++) {
            _classify_data[i]['sort'] = i + 1
          }
          this.updateSort(_classify_data)
        })
      }
    },
    // 给后台更新数据
    updateSort (classify_data) {
      let sort_data = []
      classify_data.forEach(v => {
        sort_data.push({ classId: v.classId, sort: v.sort })
      })
      ApiClassifyManage.sort(sort_data)
        .then(() => {
          this.classify_data = classify_data
          this.$emit('sortCallBack', true)
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/bnms/css/self_common";
</style>
