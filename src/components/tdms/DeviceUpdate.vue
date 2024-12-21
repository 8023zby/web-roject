<template>
  <div>
    <el-form ref="deviceForm" label-width="110px" class="typt-add-dialog" style="width: 100%;" :rules="rules" :model="form">
      <el-form-item label="科室：" prop="deptId" class="deptCls tdms-update">
        <treeselect style="width: 300px;" :flat="true" placeholder="请选择" v-model="form.deptId" noOptionsText="暂无数据" :multiple="true" :options="deptList" valueConsistsOf="ALL" noChildrenText="无子节点" />
      </el-form-item>
      <el-form-item label="终端类型：" prop="deviceModel">
        <el-select style="width: 300px" v-model="form.deviceModel" placeholder="请选择" disabled>
          <el-option v-for="item in deviceModelData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="升级包：" prop="fileUrl">
          <el-upload
            class="upload-demo"
            :limit="limitNum"
            accept="zip"
            :action="baseUrl+'/web-td/file/'"
            :data = "params"
            :before-upload = "beforeUpload"
            :on-remove="handleRemove"
            :on-success = "uploadFile"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>-->
      <el-form-item label="升级时间：" prop="updateTime">
        <el-date-picker style="width: 300px" v-model="form.updateTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择升级包：" prop="zipUrl" style="width: 98%;height: 300px">
        <zip-manage ref="zipManage"></zip-manage>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-tdms-footer">
      <el-button @click="cancelDeviceUpdate">取 消</el-button>
      <el-button type="primary" @click="deviceUpdate">确 认</el-button>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import ZipManage from './Zip'
import { MsgShow } from '../../assets/tdms/js/Message'
export default {
  name: 'device-update',
  components: {
    ZipManage,
    Treeselect
  },
  props: {
    deptList: {
      type: Array,
      require: true
    },
    deviceModel: {
      type: String,
      require: true
    },
    deptId: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      rules: {
        zipUrl: [
          { required: true, message: '请选择升级包', trigger: 'change' }
        ],
        deptId: [{ required: true, message: '请选择科室', trigger: 'change' }],
        deviceModel: [
          { required: true, message: '请选择终端类型', trigger: 'change' }
        ],
        fileUrl: [
          { required: true, message: '还未成功上传升级包', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择升级时间', trigger: 'blur' }
        ]
      },
      baseUrl: '',
      limitNum: 1,
      params: {
        fileName: ''
      },
      form: {
        deptId: null,
        deviceModel: '',
        fileUrl: '',
        updateTime: '',
        deviceType: '',
        zipUrl: '1'
      },
      deviceModelData: [
        {
          id: 'wnBedHeadExtension',
          name: '床头分机'
        },
        {
          id: 'wnBedSideExtension',
          name: '床旁分机'
        },
        {
          id: 'wnToiletExtension',
          name: '卫生间分机'
        },
        {
          id: 'wnMedicalMainframe',
          name: '医护主机'
        },
        {
          id: 'wnDutyMainframe',
          name: '值班室分机'
        },
        {
          id: 'wnEntranceGuard',
          name: '病区门禁'
        },
        {
          id: 'wnCorridorScreen',
          name: 'LCD走廊显示屏'
        },
        {
          id: 'wnDoorWayExtension',
          name: '门口分机'
        },
        {
          id: 'bnNursingTV',
          name: '护理智能看板'
        },
        {
          id: 'wnVoiceGateway',
          name: '语音网关'
        },
        {
          id: 'bnPDA',
          name: 'PDA'
        },
        {
          id: 'bnPAD',
          name: 'PAD'
        },
        {
          id: 'irWardTV',
          name: '病房电视'
        },
        {
          id: 'irScreen',
          name: '发布显示屏'
        },
        {
          id: 'qcCallApp',
          name: '叫号器(软件)'
        },
        {
          id: 'qcCallDevice',
          name: '叫号器(硬件)'
        },
        {
          id: 'qcReportDevice',
          name: '报道机'
        },
        {
          id: 'qcOneScreen',
          name: '一级分诊屏'
        },
        {
          id: 'qcTwoScreen',
          name: '二级分诊屏'
        },
        {
          id: 'ecCallExtension',
          name: '呼叫分机'
        },
        {
          id: 'qcTriageApp',
          name: '分诊台(软件)'
        },
        {
          id: 'ecCallDutyMainframe',
          name: '值班室主机'
        },
        {
          id: 'wnMedicalAudioAssistant',
          name: '医声助手'
        },
        {
          id: 'wnCorridorLatticeScreen',
          name: '走廊点阵显示屏'
        },
        {
          id: 'ecSystemMainframe',
          name: '系统主机'
        },
        {
          id: 'piBedSideExtension',
          name: '床旁分机'
        },
        {
          id: 'piMedicalMainframe',
          name: '医护主机'
        },
        {
          id: 'rvVisitExtension',
          name: '床旁探视分机'
        },
        {
          id: 'rvMobileVisitExtension',
          name: '移动探视分机'
        },
        {
          id: 'rvVisitMainframe',
          name: '医护探视主机'
        },
        {
          id: 'rvKinVisitExtension',
          name: '亲属探视分机'
        }
      ],
      fileList: []
    }
  },
  created () {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'debug'
    ) {
      this.baseUrl = '/api'
    } else if (process.env.NODE_ENV === 'production') {
      this.baseUrl = '/tdms'
    }
    this.form.deviceModel = this.deviceModel
    this.form.deptId = [this.deptId]
  },
  methods: {
    cancelDeviceUpdate () {
      this.$emit('cancelDeviceUpdate')
    },
    deviceUpdate () {
      this.$refs['deviceForm'].validate((valid) => {
        if (valid) {
          let zipInfo = this.$refs.zipManage.currentRow
          this.form.fileUrl = zipInfo.packageUrl || ''
          if (this.form.fileUrl === '') {
            MsgShow('warning', '请选择升级包', 3000)
            return false
          }
          this.$emit('deviceUpdate')
        }
      })
    },
    beforeUpload (file) {
      let arr = file.name.split('.')
      let type = arr[arr.length - 1]
      const testmsg = /^zip$/.test(type)
      if (!testmsg) {
        this.$message.error('请上传文件zip格式!')
        return false
      }
      this.params.fileName = file.name
    },
    handleRemove (file, fileList) {
      this.fileList = []
      this.form.fileUrl = ''
    },
    // 上传成功之后
    uploadFile (response, file) {
      let status = response.status
      let desc = response.desc
      if (status === 200) {
        this.form.fileUrl = response.data
      } else {
        this.$message.error(desc)
      }
    }
  }
}
</script>
<style lang="scss">
.tdms-update {
  .vue-treeselect__multi-value {
    line-height: 30px;
  }
}
</style>
<style scoped>
.btnDiv {
  margin-top: 30px;
  text-align: right;
}
</style>
