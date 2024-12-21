<template>
  <layout>
    <div slot="title">排序</div>
    <div slot="main" class="main-list">
      <div>
        <el-form
          label-width="72px"
        >
          <el-form-item label="手术日期:" prop="operationDate">
            <el-date-picker
              v-model="operationDate"
              type="date"
              placeholder="请选择"
              :clearable="false"
              @change="getList"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table :data="tableData" ref="table" stripe v-loading="loading">
          <!-- <el-table-column
            type="index"
            align="center"
            label="序号"
            width="60"
          ></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="手术日期"
            width="100"
            prop="operationDate"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="类型"
            prop="operationType"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="床位"
            prop="bedNo"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="住院号"
            width="90"
            prop="patientHospitalNo"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="姓名"
            prop="patientName"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="性别"
            prop="patientSex"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="年龄"
            prop="patientAge"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="病变/处理血管"
            width="270"
            prop="operationHandle"
          ></el-table-column>
          <el-table-column label="操作" width="350" align="center">
            <template slot-scope="scope">
              <template>
                <el-button type="text" @click="topDo(scope.row, scope.$index)">置顶</el-button>
                <el-button type="text" @click="upDo(scope.row, scope.$index)">上移</el-button>
                <el-button type="text" @click="downDo(scope.row, scope.$index)">下移</el-button><!--#F56C6C-->
                <el-button type="text" @click="btmDo(scope.row, scope.$index)">置底</el-button><!--#F56C6C-->
                <el-button type="text" @click="customDo(scope.row, scope.$index)">指定位置</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer_btn">
      <el-button @click="cancel"> 取消 </el-button>
      <el-button type="primary" @click="submitForm"> 保存 </el-button>
    </div>
  </layout>
</template>
<script>
import layout from '../../../components/bnms/layout/edit'
import { ArrangeApi } from '../../../api/bnms/index'
const moment = require('moment')
export default {
  components: { layout },
  data () {
    return {
      tableData: [],
      operationDate: moment().format('YYYY-MM-DD'),
      loading: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    /**
    * ------------------------------------------------------------------
    * 获取列表
    * ------------------------------------------------------------------
    */
    async getList () {
      this.loading = true
      try {
        let res = await ArrangeApi.list({
          beginTime: moment(this.operationDate).format('YYYY-MM-DD'),
          endTime: moment(this.operationDate).format('YYYY-MM-DD'),
          typeStr: '',
          inpNo: ''
        })
        this.tableData = res.data
      } catch (error) {
      }
      this.loading = false
    },
    /**
    * ------------------------------------------------------------------
    * 排序操作
    * ------------------------------------------------------------------
    */
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
        showClose: false,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: `请填写正确的位置(1-${this.tableData.length})`
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
    },
    /**
    * ------------------------------------------------------------------
    * 取消和保存
    * ------------------------------------------------------------------
    */
    // 取消
    cancel () {
      this.$emit('option-changed', 'list')
    },
    // 确认
    async submitForm () {
      let entities = []
      entities = this.tableData.map((item, index) => {
        return {
          itemId: item.operationId,
          itemSort: index
        }
      })
      try {
        await ArrangeApi.sort(entities)
        this.$emit('main-reload')
        this.$emit('option-changed', 'list')
      } catch (error) {
        this.$message.error(error.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/bnms/css/self_common";
.main-list {
  padding: 48px 60px 10px;
}
/deep/ .el-table--fit {
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
}
</style>
