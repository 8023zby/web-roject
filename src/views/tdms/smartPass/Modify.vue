<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">编辑</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form tdms-input-item">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="130px">
          <el-form-item label="护理单元：" prop="deptId" class="deptCls">
            <treeselect style="width: 300px" placeholder="请选择" v-model="deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptList" noChildrenText="无子节点"/>
          </el-form-item>
          <el-form-item label="终端id：">
            <el-input v-model="addForm.deviceAppId" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端型号：">
            <el-input v-model="addForm.deviceModel" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端IP：">
            <el-input v-model="addForm.ip" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端号：">
            <el-input v-model="addForm.deviceNum"></el-input>
          </el-form-item>
          <el-form-item label="终端名称：" prop="deviceName">
            <el-input v-model="addForm.deviceName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="安装位置：" prop="positionStr" class="deptCls">
            <treeselect style="width: 300px" :disable-branch-nodes="true" :default-expand-level="10" placeholder="请选择" v-model="addForm.positionStr" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="positionList" noChildrenText="无子节点">
              <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
            </treeselect>
          </el-form-item>
          <el-form-item label="备注信息：" prop="remark">
            <el-input style="width: 300px" maxlength="100" show-word-limit placeholder="请输入" type="textarea" :rows="4" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="reloadUrl">取 消</el-button>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </div>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { $getDepartTree, $getLocationsTree } from '../../../api/tdms/departmentApi'
import BaseManage from '../../../assets/tdms/mixins/BaseManage'
import { AxiosApi } from '../../../api/tdms/http'
export default {
  props: ['modifyData', 'params'],
  mixins: [BaseManage],
  components: {
    Treeselect
  },
  watch: {
    deptId (val) {
      this.addForm.deptId = val
    }
  },
  data () {
    return {
      deptId: null,
      deptObj: {},
      addForm: {
        deviceAppId: '',
        roomId: '',
        bedId: '',
        deviceNum: '',
        onOffRule: [],
        deptId: null,
        ip: '',
        broadcast: 0,
        deviceModel: '',
        deviceId: '',
        deviceName: '',
        positionStr: null,
        positions: {
          positionStr: null,
          bedId: '',
          roomId: ''
        },
        params: {
          resolution: null,
          volume: null,
          brighter: null,
          rotate: ''
        },
        remark: ''
      },
      positionObj: {},
      deviceType: '',
      positionList: [],
      deptList: [],
      modelName: '终端',
      url: '/tdms/web-td/device/',
      rules: {
        deptId: [
          { required: true, message: '请选择护理单元', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请填写终端名称', trigger: 'blur' },
          { min: 1, max: 20, message: '终端名称长度不超过20位', trigger: 'blur' }
        ],
        positionStr: [
          { required: true, message: '请选择安装位置', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.deviceType = this.params.deviceType
    this.url = `${this.url + this.modifyData.deviceId}`
    this.deptId = this.modifyData.deptId
    this.queryDeptList()
    this.queryPositionList()
  },
  methods: {
    // 请求数据
    getDetailData () {
      AxiosApi('/tdms/web-td/device/' + this.modifyData.deviceId, {}, 'GET').then(res => {
        this.initModifyData(res.data)
      })
    },
    // 获取部门
    queryDeptList () {
      $getDepartTree({
        size: '999999',
        page: '1'
      }).then(res => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list || [])
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
          this.deptList = JSON.parse(temp)
          this.getDeptChild(this.deptList)
        }
      })
    },
    // 查找子集
    getDeptChild (data) {
      data.forEach((item) => {
        this.deptObj[item.id] = item.label
        if (item.children && item.children.length > 0) {
          this.getDeptChild(item.children)
        }
      })
    },
    // 获取位置
    queryPositionList () {
      $getLocationsTree({}).then(res => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list || [])
          temp = temp.replace(/locationId/g, 'id').replace(/locationName/g, 'label').replace(/,"children":null/g, '')
          this.positionList = JSON.parse(temp)
          this.getChild(this.positionList)
          this.getDetailData()
        }
      })
    },
    // 查找子集
    getChild (data, name = '') {
      data.forEach((item) => {
        item.allName = name + item.label
        this.positionObj[item.id] = item.allName
        if (item.children && item.children.length > 0) {
          this.getChild(item.children, item.allName)
        }
      })
    },
    // 编辑修改信息
    initModifyData (data) {
      let obj = { ...data }
      let positions = obj.positions === null ? '{}' : obj.positions
      if (positions !== '') {
        obj.positions = JSON.parse(positions)
        if (!obj.positions.positionStr) {
          obj.positions.positionStr = null
        }
        obj.positionStr = obj.positions.positionStr
        if (!obj.positions.bedId) {
          obj.positions.bedId = ''
          obj.positions.bedName = ''
        }
        if (!obj.positions.roomId) {
          obj.positions.roomId = ''
          obj.positions.roomName = ''
        }
      }
      obj.roomId = obj.positions.roomId
      obj.bedId = obj.positions.bedId
      this.addForm = obj
    },
    // 提交修改
    submitForm () {
      this.$refs['addForm'].validate((valid) => {
        let obj = { ...this.addForm }
        obj.deptName = this.deptObj[obj.deptId]
        obj.positions.positionStr = obj.positionStr
        obj.positions = JSON.stringify(obj.positions)
        if (valid) {
          this.saveDataDo(obj, 'modify')
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .vue-treeselect__menu-container{
    z-index: 999999 !important;
  }
  .tdms-input-item{
    padding-top: 40px !important;
    .el-input{
      width: 300px !important;
    }
    .el-form-item__label{
      padding-right: 12px !important;
    }
  }
</style>
