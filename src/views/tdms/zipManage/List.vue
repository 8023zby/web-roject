<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="安装包名称：">
        <el-input v-uni="actFormKey + 'anzhuangbaomingcheng'" v-model="formSearchData.packageName" placeholder="请输入" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="终端类型：">
        <el-select v-uni="actFormKey + 'zhongduanleixing'" v-model="formSearchData.deviceType" placeholder="请选择" filterable>
          <el-option v-for="(item,index) in deviceTypeData" :label="item.name" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端型号：">
        <el-input v-uni="actFormKey + 'zhongduanxinghao'" v-model="formSearchData.deviceModel" placeholder="请输入" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="上传时间：" class="tdms-time-search">
        <el-date-picker
          v-uni="actFormKey + 'shangchuanshijian'"
          @change="changeDate"
          v-model="searchTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="请选择"
          end-placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="版本号：" class="tdms-version-cls">
        <el-input v-uni="actFormKey + 'banbenhao'" v-model="formSearchData.packageVersion" placeholder="请输入" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button v-uni="actKey + 'search'" type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
          <el-button v-uni="actKey + 'reset'" type="text" @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--end-->
    <hr />
    <div class="typt-list-add-div">
      <el-button v-uni="actKey + 'add'" v-if="authorityObj['addZip']" type="warning" size="small" @click="handleAdd" icon="el-icon-plus">添加</el-button>
      <span class="tdms-zip-size">（磁盘内存5G，当前使用<span style="color: #333333">{{currentSize}}</span>）</span>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="80%"
      ref="multipleTable"
      >
      <el-table-column prop="packageName" label="安装包名称" align="center">
      </el-table-column>
      <el-table-column prop="packageSize" label="安装包大小" align="center" :formatter="dealData">
      </el-table-column>
      <el-table-column prop="deviceType" label="终端类型" align="center" :formatter="dealDataType">
      </el-table-column>
      <el-table-column prop="deviceModel" label="终端型号" align="center">
      </el-table-column>
      <el-table-column prop="packageVersion" label="版本号" align="center">
      </el-table-column>
      <el-table-column prop="packageDesc" label="说明" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" align="center">
      </el-table-column>
      <el-table-column v-if="authorityObj['updateZip'] || authorityObj['delZip']" label="操作" width="260" align="center">
        <template slot-scope="scope">
          <el-button v-uni="actKey + 'edit-' + scope.row.packageId" v-if="authorityObj['updateZip']"  type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-uni="actKey + 'delete-' + scope.row.packageId" v-if="authorityObj['delZip']"  type="text" @click="handleDelete(scope.row)" style="color: #f56c6c">删除</el-button>
          <el-button v-uni="actKey + 'down-' + scope.row.packageId" v-if="authorityObj['updateZip']"  type="text" @click="handleDownLoad(scope.row)">下载安装包</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <page-info :pageInfo="pageInfo"></page-info>
    <!--end-->
  </div>
</template>

<script>
import PageInfo from '../../../components/tdms/PageInfo'
import BaseManage from '../../../assets/tdms/mixins/BaseManage'
import { AxiosApi } from '../../../api/tdms/http'
import { ResultMsg } from '../../../assets/tdms/js/Message'
import { PatientDictionaryArr } from '../../../assets/tdms/js/DictionaryA10';
export default {
  components: {
    PageInfo
  },
  inject: ['checkMoreAuthority'],
  mixins: [BaseManage],
  data () {
    return {
      currentSize: '',
      searchTime: '',
      modelName: '安装包',
      formSearchData: {
        packageName: '',
        deviceType: '',
        deviceModel: '',
        startTime: '',
        endTime: '',
        packageVersion: ''
      },
      deviceModelData: [],
      deviceTypeData: [],
      url: '/tdms/web-td/device/package',
      authorityArr: ['addZip', 'updateZip', 'delZip'],
      typeObj: {},
      actKey: 'anzhuangbaoguanli_',
      actFormKey: 'anzhuangbaoguanli__'
    }
  },
  activated () {
    this.deviceTypeData = PatientDictionaryArr
    // this.getDeviceModel()
    this.getDeviceType()
    // 判断是否有动作权限
    this.getListAuthority()
    this.getCurrentSize()
    this.onSearchSubmit('page')
  },
  methods: {
    // 查询终端类型
    getDeviceType () {
      AxiosApi(
        `/tdms/web-td/device/list/getDeviceType`,
        {},
        'GET'
      ).then(res => {
        if (res.status === 200) {
          let temp = []
          res.data.forEach(item => {
            temp.push({
              id: item.deviceType,
              name: item.deviceTypeName
            })
            this.typeObj[item.deviceType] = item.deviceTypeName
          })
          this.deviceTypeData = temp
        }
      })
    },
    // 查询当前使用大小
    getCurrentSize () {
      AxiosApi('/tdms/web-td/device/package/sumSize', {}, 'GET').then(res => {
        if (res.status === 200) {
          this.currentSize = this.renderSize(res.data)
        }
      })
    },
    // 刷新页面
    reload () {
      this.searchTime = ''
      this.pageInfo.currentPage = 1
      this.formSearchData = this.clearObj(this.formSearchData)
      this.getData()
    },
    // 清空值
    clearObj (data) {
      let temp = {}
      for (let p in data) {
        temp[p] = ''
      }
      return temp
    },
    // 获取终端型号
    getDeviceModel () {
      AxiosApi('/tdms/web-td/device/deviceModel', {}, 'GET', {
        deviceType: this.deviceModel
      }).then(res => {
        if (res.status === 200) {
          this.deviceModelData = res.data
        }
      })
    },
    // 修改安装包
    handleEdit (row) {
      this.$emit('option-changed', 'add', { id: row.packageId })
    },
    // 添加安装包
    handleAdd () {
      this.$emit('option-changed', 'add')
    },
    // 下载安装包
    handleDownLoad (row) {
      let a = document.createElement('a')
      let path = row.packageUrl
      let fileName = path.substring(path.lastIndexOf('/') + 1, path.length)
      a.style.display = 'none'
      a.href = path
      a.setAttribute('download', fileName)
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    // 删除安装包
    handleDelete (row) {
      this.del(`${this.url}/${row.packageId}`, { packageUrl: row.packageUrl })
    },
    // 删除
    del (url = this.url, data) {
      this.$confirm(`确定要删除此${this.modelName}?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        AxiosApi(url, {}, 'DELETE', data).then(res => {
          ResultMsg(res, `删除${this.modelName}`, () => {
            this.reloadDel()
            this.getCurrentSize()
          })
        })
      }).catch(() =>{})
    },
    // 改变时间
    changeDate () {
      if (this.searchTime === null) {
        this.formSearchData.startTime = ''
        this.formSearchData.endTime = ''
      } else {
        this.formSearchData.startTime = this.searchTime[0]
        this.formSearchData.endTime = this.searchTime[1]
      }
    },
    // 大小格式化
    dealData (row) {
      return this.renderSize(row.packageSize)
    },
    // 格式化终端类型
    dealDataType (row) {
      return this.typeObj[row.deviceType] || row.deviceType
    },
    // 格式化文件大小
    renderSize (bytes) {
      if (bytes == null || bytes === '' || bytes === 0 || bytes === '0') {
        return '0M'
      }
      let k = 1024
      let sizes = ['B', 'KB', 'M', 'G', 'T', 'PB', 'EB', 'ZB', 'YB']
      let i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
    }
  }
}
</script>
<style lang="scss" scoped>
  @media screen and (width: 1920px) {
    .tdms-time-search{
      margin-right: 100px;
    }
    .tdms-version-cls{
      margin-left:28px;
    }
  }
  .tdms-zip-size{
    margin-left: 14px;
    font-size: 14px;
    color: #999999;
  }
</style>
