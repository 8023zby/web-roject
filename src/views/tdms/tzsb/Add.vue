<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 600px">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="180px">
          <!--运维端-->
          <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptAddCls" prop="deptId">
            <treeselect v-uni="actFormKey + 'keshi'" placeholder="请选择" v-model="addForm.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptData" noChildrenText="无子节点"/>
          </el-form-item>
          <el-form-item label="终端型号：" prop="deviceModel">
            <el-select v-uni="actFormKey + 'zhongduanxinghao'" style="width: 300px" placeholder="请选择" v-model="addForm.deviceModel" clearable>
              <el-option v-for="item in typeObj" :label="item.label" :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="蓝牙MAC地址/序列号：" prop="macAddress">
            <el-input v-uni="actFormKey + 'mac'" v-model="addForm.macAddress" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="卡号：" prop="icCardNum">
            <el-input v-uni="actFormKey + 'kahao'" placeholder="请输入" v-model="addForm.icCardNum" clearable></el-input>
            &emsp;<el-button v-uni="actKey + 'read'" style="height: 28px;padding:0 !important;width: 80px;border-radius: 2px !important;" type="primary" @click="readCard">读取</el-button><br /><span style="color:#f56c6c">先将卡放在读卡器上，然后点击读取</span>
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
import VueJsonp from 'vue-jsonp'
import Vue from 'vue'
import BaseManage from '../../../assets/tdms/mixins/BaseManage'
import { AxiosApi } from '../../../api/tdms/http'
import { TzsbDictionary } from '../../../assets/tdms/js/TzsbDictionary'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

Vue.use(VueJsonp)
export default {
  components: {
    Treeselect
  },
  name: 'UpdateBedHead',
  props: ['modifyData', 'params'],
  mixins: [BaseManage],
  data () {
    return {
      addForm: {
        macAddress: '',
        deptId: null,
        icCardNum: '',
        deviceModel: '',
        deviceType: ''
      },
      deviceType: '',
      typeObj: {},
      actFlag: 'add',
      titMsg: '添加',
      modelName: '体征设备',
      url: '/tdms/web-td/device/sign',
      rules: {
        deptId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        deviceModel: [
          { required: true, message: '请选择终端型号', trigger: 'change' }
        ],
        macAddress: [
          { required: true, message: '请输入蓝牙MAC地址/序列号', trigger: 'blur' },
          { min: 0, max: 100, message: '蓝牙MAC地址/序列号长度不能超过100', trigger: 'blur' }
        ],
        icCardNum: [
          { min: 0, max: 100, message: '卡号长度不能超过100', trigger: 'blur' }
        ]
      },
      actKey: 'tizhengshebeitianjia_',
      actFormKey: 'tizhengshebeitianjia__'
    }
  },
  created () {
    this.deviceType = this.params.deviceType
    this.addForm.deviceType = this.params.deviceType
    this.typeObj = TzsbDictionary[this.deviceType]
    this.addForm.deviceModel = this.typeObj && this.typeObj[0] ? this.typeObj[0].id : ''
    this.addForm.deviceId = this.modifyData.deviceId
    if (this.addForm.deviceId) {
      this.url = `${this.url + '/' + this.modifyData.deviceId}`
      this.titMsg = '编辑'
      this.actFlag = 'modify'
      this.actKey = 'tizhengshebeibianji_'
      this.actFormKey = 'tizhengshebeibianji__'
      this.getDetailData()
    }
    // 判断登录端
    this.getLandingEndCode()
    this.getDeptList()
  },
  mounted () {
    /*setTimeout(() => {
      let box = document.getElementsByClassName('vue-treeselect__single-value')
      let text = box[0].innerText
      box[0].innerText = text.replace('(unknown)', '')
    }, 200)*/
  },
  methods: {
    // 读卡
    readCard () {
      this.$jsonp(
        'http://127.0.0.1:3586/readcode',
        {
          callbackName: 'successCallback'
        }
      ).then(res => {
        this.addForm.icCardNum = res.Result.replace(/\s/g, '')
      }).catch(() => {
        this.$confirm(`读卡服务异常，请确定读卡器服务已经开启,如果未下载读卡器服务启动包，请点击确定下载！`, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = '/static/passport/readCard.zip'
          link.setAttribute('download', '读卡服务器.zip')
          document.body.appendChild(link)
          link.click()
        })
      })
    },
    // 查询部门
    getDeptList () {
      if (this.landingEndCode === 'OPEX') {
        AxiosApi(
          '/ifms/web-org/depts',
          {},
          'GET'
        ).then(res => {
          if (res.status === 200) {
            let t = res.data.list || []
            let temp = JSON.stringify(t)
            temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
            this.deptData = JSON.parse(temp)
          }
        })
      }
    },
    // 请求数据
    getDetailData () {
      AxiosApi(this.url, {}, 'GET').then(res => {
        this.initModifyData(res.data)
      })
    },
    // 编辑修改信息
    initModifyData (data) {
      Object.assign(this.addForm, data)
    },
    // 提交修改
    submitForm () {
      this.$refs['addForm'].validate((valid) => {
        let obj = { ...this.addForm }
        // 卡号去空格
        obj.icCardNum = obj.icCardNum === null ? '' : obj.icCardNum.replace(/\s/g, '')
        if (valid) {
          this.saveDataDo(obj, this.actFlag)
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
</style>
