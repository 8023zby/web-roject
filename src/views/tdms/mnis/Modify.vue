<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">编辑设备</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="130px">
          <el-form-item label="终端型号：" prop="deviceModel">
            <el-input v-uni="actFormKey + 'zhongduanxinghao'" v-model="addForm.deviceModel" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备id：">
            <el-input v-uni="actFormKey + 'shebeiid'" v-model="addForm.deviceAppId" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备号：" prop="deviceNum">
            <el-input v-uni="actFormKey + 'shebeihao'" v-model="addForm.deviceNum"></el-input>
          </el-form-item>
          <el-form-item label="终端IP：" prop="ip">
            <el-input v-uni="actFormKey + 'zhongduanip'" v-model="addForm.ip" disabled></el-input>
          </el-form-item>
          <el-form-item label="分辨率：" prop="resolution">
            <el-input v-uni="actFormKey + 'fenbianlv'" v-model="addForm.params.resolution" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端名称：" prop="deviceName">
            <el-input v-uni="actFormKey + 'zhongduanmingcheng'" v-model="addForm.deviceName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="护理单元：" prop="deptId" class="deptCls">
            <treeselect v-uni="actFormKey + 'hulidanyuan'" placeholder="请选择" v-model="deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptList" noChildrenText="无子节点"/>
          </el-form-item>
          <el-form-item label="位置：" prop="positionStr" class="deptCls">
            <treeselect v-uni="actFormKey + 'weizhi'" :disable-branch-nodes="true" :default-expand-level="10" placeholder="请选择" v-model="addForm.positions.positionStr" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="positionList" noChildrenText="无子节点">
              <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
            </treeselect>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-uni="actFormKey + 'beizhu'" maxlength="100" show-word-limit placeholder="请输入" type="textarea" :rows="12" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button v-uni="actKey + 'cancel'" @click="reloadUrl">取 消</el-button>
      <el-button v-uni="actKey + 'save'" type="primary" @click="submitForm">保 存</el-button>
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
  name: 'UpdateBedHead',
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
      logFormVisible: false,
      deptId: null,
      deptObj: {},
      addForm: {
        deviceNum: '',
        deviceAppId: '',
        deptId: null,
        ip: '',
        deviceModel: '',
        deviceId: '',
        deviceName: '',
        resolution: '',
        positions: {
          positionStr: null
        },
        params: {
          resolution: null
        },
        remark: ''
      },
      positionObj: {},
      deviceType: '',
      positionList: [],
      deptList: [],
      modelName: '设备',
      url: '/tdms/web-td/device/',
      rules: {
        deviceModel: [
          { required: true, message: '请输入终端型号', trigger: 'blur' }
        ],
        deviceNum: [
          { required: true, message: '请输入设备号', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入终端IP', trigger: 'blur' }
        ],
        resolution: [
          { required: true, message: '请输入分辨率', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择护理单元', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请填写终端名称', trigger: 'blur' }
        ]
      },
      actKey: 'zhongduanguanlibianji_',
      actFormKey: 'zhongduanguanlibianji__'
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
    // 取消弹窗
    cancelDialog () {
      this.logFormVisible = false
    },
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
      let params = obj.params === null ? '{}' : obj.params
      if (positions !== '') {
        obj.positions = JSON.parse(positions)
        if (!obj.positions.positionStr) {
          obj.positions.positionStr = null
        }
      }
      if (params !== '') {
        obj.params = JSON.parse(params)
        obj.resolution = obj.params.resolution || ''
      }
      this.addForm = obj
    },
    // 提交修改
    submitForm () {
      this.$refs['addForm'].validate((valid) => {
        let obj = { ...this.addForm }
        obj.deptName = this.deptObj[obj.deptId]
        obj.positions = JSON.stringify(obj.positions)
        obj.params = JSON.stringify(obj.params)
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
<style>
  .vue-treeselect__menu-container{
    z-index: 999999 !important;
  }
</style>
