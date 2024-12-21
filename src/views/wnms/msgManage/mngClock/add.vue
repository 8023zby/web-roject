<!--
  文件描述：闹钟类型添加组件
  创建时间：2020/4/21 13:38
  创建人：Administrator
-->
<template>
  <el-dialog
    :visible.sync="dialogSortVisible"
    :title="detail.type === 'edit'?'编辑':'添加'"
    :close-on-click-modal=false
    :close-on-press-escape=false
    :show-close="false"
    width="500px">
    <el-container>
      <el-main class="dialog-from-main mngClock-main-dialog typt-add-dialog"
               >
        <el-form ref="formContent"
                 :model="formContent"
                 :rules="rules"
                 label-width="95px">
          <el-form-item label="类型名称："
                        placeholder="选输入"
                        prop="toneName">
            <el-input v-model.trim="formContent.toneName"
                      type="text"
                      maxlength="8" />
          </el-form-item>
          <el-form-item label="选择铃声："
                        prop="audioFileId">
            <el-select v-model="formContent.audioFileId"
                       placeholder="请选择"
                       style="width: 100%"
                       :disabled="formContent.deptId?false:true">
              <el-option v-for="item in audioList"
                         :key="item.id"
                         :label="item.audioName"
                         :value="item.id">{{ item.audioName }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时长：" prop="timing">
            <el-time-picker placeholder="选择时长"
                            style="width: 100%"
                            v-model="formContent.timing"
                            format='HH:mm:ss'
                            value-format="HH:mm:ss"

            ></el-time-picker>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <div slot="footer" class="dialog-footer">

      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary"
                 @click="detail.type === 'edit' ? editHandler(detail.row.id) : addHandler()">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import './mngClock.scss'
import mixin from './mixin'
import BaseQueryPageForm from '../../common/BaseQueryPageForm'
import {
  addApi,
  editApi
} from '@/api/wnms//msgManage/mngClock'

export default {
  name: 'add',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
  },
  mixins: [mixin, BaseQueryPageForm],
  data () {
    return {
      dialogSortVisible: false,
      detail: {
        type: 'add'
      },
      defaultTiming: '',
      // 验证方法
      rules: {
        'deptId': [{
          required: true,
          message: '请选择护理单元',
          trigger: 'change'
        }],
        'timing': [
          {
            required: true,
            message: '请输入时长',
            trigger: 'blur'
          }
        ],
        'toneName': [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 8,
          message: '请输入8位以内',
          trigger: 'blur'
        }
        ],
        'audioFileId': [{
          required: true,
          message: '请选择音频',
          trigger: 'change'
        }]
      },
      // 类型
      audioType: 'alarm',
      // 表单内容
      formContent: {
        deptId: this.selectDeptInfo(),
        toneName: '',
        audioFileId: '',
        timing: '' // 时长
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 方法集合
  methods: {
    closeDialog () {
      this.$emit('closeAdd')
    },
    init () {
      this.dialogSortVisible = true
      this.formContent.toneName = ''

      this.formContent.timing = '00:10:00'
      // 获取音频列表
      let deptIds = this.selectDeptInfo()
      // deptIds = '650bd66be0894a2ea339c6fda2351063'
      this.queryAudioListHandler({
        isPage: 0,
        deptIds: deptIds + ',0',
        audioType: this.audioType
      })

      // 编辑时回显数据
      if (this.detail.row) {
        this.formContent.deptId = this.detail.row.deptId
        this.formContent.toneName = this.detail.row.toneName
        this.formContent.audioFileId = this.detail.row.audioFileId
        this.formContent.timing = this.detail.row.timing
      }
    },
    /**
     * @添加闹钟类型
     */
    addHandler () {
      this.$refs['formContent'].validateField('timing')

      this.$refs['formContent'].validate(valid => {
        if (valid) {
          let V = this.formContent.timing.split(':')

          if (V[0] == '00' && V[1] == '00') {
            this.$message.error('时长最小值为1分钟！')
            return
          }
          addApi(this.formContent).then(response => {
            // 返回闹钟类型列表
            this.IsSuccess(response, () => {
              this.$emit('closeAdd', 'refresh')
            })
          })
        } else {
          return false
        }
      })
    },

    /**
     * @编辑钟类型
     */
    editHandler (param) {
      let V = this.formContent.timing.split(':')

      if (V[0] == '00' && V[1] == '00') {
        this.$message.error('时长最小值为1分钟！')
        return
      }
      this.$refs['formContent'].validate(valid => {
        if (valid) {
          editApi({
            id: param,
            ...this.formContent
          }).then(response => {
            // 返回音频列表
            this.IsSuccess(response, () => {
              this.$emit('closeAdd', 'refresh')
            })
          })
        } else {
          return false
        }
      })
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () {
  }, // 生命周期 - 创建之前
  beforeMount () {
  }, // 生命周期 - 挂载之前
  beforeUpdate () {
  }, // 生命周期 - 更新之前
  updated () {
  }, // 生命周期 - 更新之后
  beforeDestroy () {
  }, // 生命周期 - 销毁之前
  destroyed () {
  }, // 生命周期 - 销毁完成
  activated () {
  } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style lang="scss" scoped>
    //@import url(); 引入公共css类
  .mngClock-main-dialog{
    width: 500px;
    height:300px !important;
    overflow: hidden !important;
    padding: 15px 20px !important;
    .el-form{
      .el-form-item{
        margin-bottom: 30px !important;
        width: 90%;
      }
    }
  }
</style>
