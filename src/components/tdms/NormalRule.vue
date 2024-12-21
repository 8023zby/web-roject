<template>
  <div class="typt-list-container">
    <div style="padding-bottom: 10px; height: 40px">
      <el-button size="small" style="float: right;margin-left: 10px;" type="danger"  @click="removeItem">删除</el-button>
      <el-button size="small" style="float: right" type="primary"  @click="addItem">添加</el-button>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      @selection-change="handleSelectionChange"
      height="400"
      style="border: 1px solid #e6e6e6;border-bottom: none;"
    >
      <el-table-column
        type="selection"
        align="center"
        width="40">
      </el-table-column>
      <el-table-column label="序号" width="55" type="index" align="center"></el-table-column>
      <el-table-column prop="startTime" label="开机时间" align="center">
        <template slot-scope="scope">
          <el-time-picker
            v-model="scope.row.startTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
          >
          </el-time-picker>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="关机时间" align="center">
        <template slot-scope="scope">
          <el-time-picker
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            v-model="scope.row.endTime"
          >
          </el-time-picker>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { MsgShow } from '../../assets/tdms/js/Message'
export default {
  name: 'normal-rule',
  props: {
    onOffRule: {
      type: Array,
      require: true
    }
  },
  data () {
    return {
      multipleSelection: [],
      tableData: []
    }
  },
  created () {
    this.onOffRule.forEach((item) => {
      if (item.type === '1') {
        this.tableData = item.rules
      }
    })
  },
  methods: {
    // 添加多个
    addItem () {
      this.tableData.push({
        startTime: '',
        endTime: ''
      })
    },
    // 删除多个
    removeItem () {
      if (this.multipleSelection.length < 1) {
        MsgShow('warning', '请选择至少一条规则！')
        return false
      }
      this.multipleSelection.forEach((item) => {
        let index = this.tableData.indexOf(item)
        if (index !== -1) {
          this.tableData.splice(index, 1)
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
  .btnDiv{
    margin-top: 30px;
    text-align: right;
  }
</style>
