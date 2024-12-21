<template>
  <layout v-loading="loading">
    <div slot="query" class="query-items">
      <el-form :inline="true">
        <el-form-item style="float: right;">
          <el-button type="primary" @click="setColLength" v-uni="'yizhuziduan_shezhiliekuan'">设置列宽</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div slot="main" class="main-list">
      <el-table :data="label_data" row-key="field" stripe highlight-current-row height="100%">
        <el-table-column prop="fieldName" label="医疗字段名称" align="center" min-width="100"></el-table-column>

        <el-table-column label="显示状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.ifShow" :active-value="1" :inactive-value="0" @change="handlePositionSwitch($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="420">
          <template slot-scope="scope">
            <el-button type="text" @click="modData(scope.row)" v-uni:[scope.row.id]="'yizhuziduan_edit'" :key="'edit' + scope.row.id">编辑</el-button>
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'top')" v-uni:[scope.row.id]="'yizhuziduan_head'" :key="'head' + scope.row.id">置顶</el-button>
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'up')" v-uni:[scope.row.id]="'yizhuziduan_up'" :key="'up' + scope.row.id">上移</el-button>
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'down')" v-uni:[scope.row.id]="'yizhuziduan_down'" :key="'down' + scope.row.id">下移</el-button>
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'bottom')" v-uni:[scope.row.id]="'yizhuziduan_bottom'" :key="'bottom' + scope.row.id">置尾</el-button>
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'assign')" v-uni:[scope.row.id]="'yizhuziduan_setposition'" :key="'setposition' + scope.row.id">指定位置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </layout>
</template>

<script>
import { doctorFieldsSet } from '../../../api/bnms'
import { janeDoctorsAdvice } from '../../../api/dams'
import layout from '../../../components/bnms/layout/list'

export default {
  name: 'doctorFields',
  components: { layout },
  data () {
    return {
      loading: false,
      label_data: [],
      position_data: {}
    }
  },
  created () {
    this.getLabelData()
  },
  methods: {
    modData (row) {
      this.$emit('changed', 'editDoctorFields', row)
    },
    setColLength () {
      this.$emit('changed', 'setColLength')
    },
    getLabelData () {
      this.loading = true

      janeDoctorsAdvice.janeFieldsList().then(res => {
        const data = res.data || []
        this.label_data = data
        this.loading = false
      }).catch(res => {
        this.loading = false
        this.$message.error(res.message)
      })
    },
    handlePositionSwitch (val, row) { // 设置字段的显示状态
      doctorFieldsSet.update([{
        id: row.id,
        ifShow: row.ifShow
      }]).then(() => {

      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    labelSort (currentIndex, currentData, type) {
      if (type === 'up') {
        if (currentIndex === 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        let prevIndex = currentIndex - 1
        let prevData = this.label_data[prevIndex]
        // 交换序号
        prevData['sort'] = currentData['sort']
        currentData['sort'] = currentData['sort'] - 1
        // 交换位置
        this.label_data[currentIndex] = prevData
        this.label_data[prevIndex] = currentData
        this.updateSort(this.label_data)
      } else if (type === 'down') {
        if (currentIndex === this.label_data.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        let nextIndex = currentIndex + 1
        let nextData = this.label_data[nextIndex]
        // 交换序号
        nextData['sort'] = currentData['sort']
        currentData['sort'] = currentData['sort'] + 1
        // 交换位置
        this.label_data[currentIndex] = nextData
        this.label_data[nextIndex] = currentData
        this.updateSort(this.label_data)
      } else if (type === 'top') {
        if (currentIndex === 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        let currentData = this.label_data.splice(currentIndex, 1)
        this.label_data.unshift(currentData[0])
        // 重新排序
        for (let i = 0; i < this.label_data.length; i++) {
          this.label_data[i]['sort'] = i + 1
        }
        this.updateSort(this.label_data)
      } else if (type === 'bottom') {
        if (currentIndex === this.label_data.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        let currentData = this.label_data.splice(currentIndex, 1)
        this.label_data.push(currentData[0])
        // 重新排序
        for (let i = 0; i < this.label_data.length; i++) {
          this.label_data[i]['sort'] = i + 1
        }
        this.updateSort(this.label_data)
      } else if (type === 'assign') {
        this.$prompt('跳转至', '指定位置', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputPattern: /^\d+$/,
          inputErrorMessage: `请输入数字序号(1-${this.label_data.length})`,
          showClose: false
        }).then(({ value }) => {
          let currentData = this.label_data.splice(currentIndex, 1)
          this.label_data.splice(+value ? value - 1 : 0, 0, currentData[0])
          // 重新排序
          for (let i = 0; i < this.label_data.length; i++) {
            this.label_data[i]['sort'] = i + 1
          }
          this.updateSort(this.label_data)
        })
      }
    },
    // 给后台更新数据
    updateSort (labelData) {
      this.loading = true
      labelData = JSON.parse(JSON.stringify(labelData))
      let sortData = []
      labelData.forEach((v, index) => {
        sortData.push({ sort: index + 1, id: v.id })
        v.sort = index + 1
        return v
      })

      doctorFieldsSet.update(sortData).then(() => {
        this.loading = false
        this.label_data = labelData
      }).catch(res => {
        this.$message.error(res.message)
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "@/assets/bnms/css/self_common.scss";
</style>
