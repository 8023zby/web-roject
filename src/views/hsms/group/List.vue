<template>
  <!--护士排班-护士分组-->
  <div class="typt-list-container">
    <div class="typt-list-add-div">
      <el-button type="warning" size="small"
                 style="padding: 6px 16px;border-radius: 2px;"
                 @click="$emit('option-changed', 'add', { businessType: formSearchData.businessType, tableData: tableData })"
                 icon="el-icon-plus">添加
      </el-button>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      :stripe="CONFIG.table.stripe"
      v-loading="loading"
      height="80%"
    >
      <el-table-column
        prop="accountName"
        align="center"
        :label="name+'姓名'">
      </el-table-column>
      <el-table-column
        prop="objList"
        align="center"
        label="分管床位"
        :formatter="formatBed"
      >
      </el-table-column>
      <el-table-column
        prop="objList"
        align="center"
        label="分管房间"
        :formatter="formatRoom"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="$emit('option-changed', 'add', { businessType: formSearchData.businessType, tableData: tableData }, scope.row)">
            编辑
          </el-button>
          <el-button type="text" @click="del(scope.row)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
  </div>
</template>

<script>
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import { GetModelType, GetRoom, GetBed } from '../../../api/hsms'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseGroup',
  props: ['params'],
  mixins: [BaseManage, config],
  data () {
    return {
      isPage: false,
      name: '护士',
      bedObj: {},
      BedObj: {},
      roomObj: {},
      RoomObj: {},
      modelName: '分组',
      modelType: 'BED',
      modelTypeName: '床位',
      formSearchData: {
        shiftName: '',
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/nursing-group'
    }
  },
  created () {
    this.formSearchData.businessType = this.params.businessType
    if (this.params.businessType === 'DOCTOR') {
      this.name = '医生'
    }
    this.getRoom()
    // this.getModelType()
  },
  methods: {
    // 格式化床位
    formatBed (d) {
      let objList = d.objList
      let _objList = []
      let data = objList.split(',')
      let str = ''
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.BedObj.length; j++) {
            if (data[i] === this.BedObj[j].bedId) {
              _objList.push(this.BedObj[j])
            }
          }
        }
        _objList.sort(function (a, b) {
          if (a.sort === null || b.sort === null) {
            return false
          } else {
            if (a.sort < b.sort) {
              return -1
            } else if (a.sort === b.sort) {
              return 0
            } else {
              return 1
            }
          }
        })
        for (let m = 0; m < _objList.length; m++) {
          str += _objList[m].bedName + ','
        }
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    // 格式化房间
    formatRoom (d) {
      let roomList = d.roomList
      let _roomList = []
      let data = roomList.split(',')
      let str = ''
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.RoomObj.length; j++) {
            if (data[i] === this.RoomObj[j].roomId) {
              _roomList.push(this.RoomObj[j])
            }
          }
        }
        _roomList.sort(function (a, b) {
          if (a.sort === null || b.sort === null) {
            return false
          } else {
            if (a.sort < b.sort) {
              return -1
            } else if (a.sort === b.sort) {
              return 0
            } else {
              return 1
            }
          }
        })
        for (let m = 0; m < _roomList.length; m++) {
          str += _roomList[m].roomName + ','
        }
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    // 获取模式
    // getModelType () {
    //   GetModelType(this.formSearchData.businessType).then(res => {
    //     if (res !== null) {
    //       this.modelType = res.nurseMode || 'BED'
    //       if (res.nurseMode === 'ROOM') {
    //         this.modelTypeName = '房间'
    //       }
    //     }
    //   })
    // },
    // 获取床位
    getBed () {
      GetBed().then(res => {
        res.forEach((item, index) => {
          this.bedObj[item.bedId] = item.bedName
        })
        this.BedObj = res
        this.onSearchSubmit()
      })
    },
    // 获取房间
    getRoom () {
      GetRoom().then(res => {
        res.forEach((item, index) => {
          this.roomObj[item.roomId] = item.roomName
        })
        this.RoomObj = res
        this.getBed()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/hsms/css/self_common";

  .el-button--small {
    padding: 6px 16px !important;
    border-radius: 2px !important;
  }
</style>
