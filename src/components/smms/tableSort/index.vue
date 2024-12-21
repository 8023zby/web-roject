<template>
  <div class="typt-list-container">
    <!--列表-->
    <el-table :data="tableData" stripe v-loading="loading" height="500">
      <el-table-column label="序号" align="center" type="index" width="100">
      </el-table-column>
      <el-table-column align="center" :prop="filedName" :label="tit">
      </el-table-column>
      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="text" @click="upDo(scope.row, scope.$index)"
            >上移</el-button
          >
          <el-button
            type="text"
            @click="downDo(scope.row, scope.$index)"
            style="color: #f56c6c"
            >下移</el-button
          >
          <el-button type="text" @click="topDo(scope.row, scope.$index)"
            >置顶</el-button
          >
          <el-button
            type="text"
            @click="btmDo(scope.row, scope.$index)"
            style="color: #f56c6c"
            >置尾</el-button
          >
          <el-button type="text" @click="customDo(scope.row, scope.$index)"
            >指定位置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import * as wareManageApi from '@/api/smms/shopingMall/wareManage'

import { getWareCategory, getSort } from '@/api/smms/shopingMall/wareCategory'
import * as businessManageApi from '@/api/smms/shopingMall/businessManage'

export default {
  name: 'sort',
  props: {
    'filedName': String,
    'tit': String,
    'T': String,
    'tabIndex': {
      type: String,
      default: () => {
        return '0'
      }
    }
  },
  data () {
    return {
      loading: false,
      tableData: []
    }
  },

  created () {
    this.getData()
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
      this.$prompt('位置序号：', '指定位置', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        customClass: 'ifms-confirm',
        inputErrorMessage: `请填写正确的位置(1-${this.tableData.length})`,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let value = instance.inputValue
            if (parseInt(value) > this.tableData.length) {
              this.$message.warning(`指定位置不能超过${this.tableData.length}！`)
            } else {
              this.updateData(item, index, value - 1)
              done()
            }
          } else {
            done()
          }
        }
      }).then(({ value }) => { })
    },
    // 重新设置数据
    updateData (item, oldVal, newVal) {
      this.tableData.splice(oldVal, 1)
      this.tableData.splice(newVal, 0, item)
      this.saveData()
    },

    // 成功 T  ture 赋值，false 不赋值 表示需要赋值给当前列表吗
    success (res, T = true) {
      if (res.status === 200) {
        if (T) {
          this.tableData = [...res.data]
          this.loading = false
        } else {
          console.log(res.desc)
        }
      } else {
        this.$message({
          type: 'error',
          message: res.data.desc
        })
      }
    },
    // 获取数据
    getData () {
      this.loading = true
      switch (this.T) {
        case 'shopping':
          wareManageApi.getInfo({ roleType: 1 }).then(res => {
            this.success(res)
          })
          break
        case 'shopingT':
          getWareCategory().then(res => {
            this.success(res)
          })
          break
        case 'business':
          businessManageApi.getInfo({
            shopType: (this.tabIndex === '' ? '0' : this.tabIndex)
          }).then(res => {
            this.success(res)
          })
          break
      }
    },
    // 保存数据
    saveData () {
      this.oldList = this.tableData.map(v => v.id)
      this.newList = this.oldList.slice()
      var list = []
      this.newList.forEach((value, index) => {
        list.push(index + 1)
      })

      switch (this.T) {
        case 'shopping':
          wareManageApi.Sort({
            ids: this.newList,
            sortIndexs: list
          }).then(res => {
            this.success(res, false)
          })
          break
        case 'shopingT':
          getSort({
            ids: this.newList,
            sortIndexs: list
          }).then(res => {
            this.success(res, false)
          })
          break
        case 'business':
          businessManageApi
            .Sort({ ids: this.newList, sortIndexs: list })
            .then(res => {
              this.success(res, false)
            })
          break
      }
    }

  }
}
</script>
<style lang="scss">
.ifms-confirm {
  .el-message-box__container {
    margin-right: 12px;
  }
  .el-message-box__message {
    width: 100%;
    p {
      width: 100%;
      text-align: right;
    }
  }
}
</style>
