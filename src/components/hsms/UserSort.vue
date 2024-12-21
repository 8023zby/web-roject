<template>
  <!--医护排班-排班流水-用户排序-->
  <div class="typt-list-container"
       style="height: 480px;">
    <!--列表-->
    <el-table
      :data="tableData"
      :stripe="true"
      v-loading="loading"
      height="500"
    >
      <el-table-column
        label="序号"
        align="center"
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        prop="empName"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="400">
        <template slot-scope="scope">
          <el-button type="text" @click="topDo(scope.row, scope.$index)">置顶</el-button>
          <el-button type="text" @click="upDo(scope.row, scope.$index)">上移</el-button>
          <el-button type="text" @click="downDo(scope.row, scope.$index)">下移</el-button><!--#F56C6C-->
          <el-button type="text" @click="btmDo(scope.row, scope.$index)">置底</el-button><!--#F56C6C-->
          <el-button type="text" @click="customDo(scope.row, scope.$index)">指定位置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="true"
         slot="footer" style="margin: 25px 0;"></div>
  </div>
</template>

<script>
  import { ResultMsg } from '../../assets/hsms/js/Message'
  import { AxiosJsonApi, GetNurseUser } from '../../api/hsms'

  export default {
    name: 'user-sort',
    props: ['typeStr'],
    data () {
      return {
        loading: false,
        tableData: []
      }
    },
    // 初始化
    created () {
      this.getUser()
    },
    methods: {
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
        this.saveData()
      },
      // 保存数据
      saveData () {
        let saveData = []
        this.tableData.forEach((item, index) => {
          saveData.push({
            empName: item.empName,
            empId: item.empId,
            sort: index + 1
          })
        })
        AxiosJsonApi('/ifms/web-org/emp/sort', saveData, 'PUT', {}, 'ifms').then(res => {
          ResultMsg(res, '排序', this.getUser)
        })
      },
      // 获取用户
      getUser () {
        GetNurseUser(this.typeStr).then(res => {
          this.tableData = res
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-message-box__wrapper .el-message-box .el-message-box__btns .el-button--default,
  .el-message-box__wrapper .el-message-box .el-message-box__btns .el-button--primary {
    padding: 12px 20px !important;
    border-radius: 0 !important;
  }
</style>
