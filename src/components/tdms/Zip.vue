<template>
  <div class="typt-list-container" style="height: 300px">
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="border-left: 1px solid #e6e6e6;border-right: 1px solid #e6e6e6;"
      height="300"
    >
      <el-table-column prop="radio" label="" align="center" width="30">
        <template slot-scope="scope">
          <div style="margin-left: 5px">
            <el-radio v-model="radioId" :label="scope.row.packageId">&nbsp;</el-radio>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="packageName" label="安装包名称" width="120" align="center">
      </el-table-column>
      <el-table-column prop="packageSize" label="安装包大小" width="100" align="center" :formatter="dealData">
      </el-table-column>
      <el-table-column prop="deviceType" label="终端类型" align="center" :formatter="dealDataType">
      </el-table-column>
      <el-table-column prop="deviceModel" label="终端型号" align="center">
      </el-table-column>
      <el-table-column prop="packageVersion" label="版本号" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime === null"></span>
          <span v-else>
            {{scope.row.createTime.substr(0,10)}}
            <br/>
            {{scope.row.createTime.substr(10,scope.row.createTime.length - 1)}}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import BaseManage from '../../assets/tdms/mixins/BaseManage'
import { PatientDictionary } from '../../assets/tdms/js/DictionaryA10'
export default {
  name: 'zip-manage',
  mixins: [BaseManage],
  data () {
    return {
      url: '/tdms/web-td/device/package',
      currentRow: {},
      radioId: ''
    }
  },
  created () {
    this.pageInfo.size = 1000
    this.getData()
  },
  methods: {
    handleCurrentChange (val) {
      this.radioId = val.packageId
      this.currentRow = val
    },
    // 格式化终端类型
    dealDataType (row) {
      return PatientDictionary[row.deviceType] || row.deviceType
    },
    // 大小格式化
    dealData (row) {
      return this.renderSize(row.packageSize)
    },
    // 格式化文件大小
    renderSize (value) {
      if (value == null || value === '') {
        return '0 Bytes'
      }
      let unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = 0
      let srcsize = parseFloat(value)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      let size = srcsize / Math.pow(1024, index)
      //  保留的小数位数
      size = size.toFixed(2)
      return size + unitArr[index]
    }
  }
}
</script>
