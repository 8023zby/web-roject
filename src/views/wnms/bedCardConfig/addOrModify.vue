<!--
  文件描述： 模板添加、编辑页面
  创建时间：2021/9/1 10:26
  创建人：PCL
-->
<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">
        {{detail.type==='add'?'添加床头卡模板':'编辑床头卡模板'}}
      </div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form passport-user-modify" style="width: 600px">
        <el-form ref="formContent" :model="form" label-width="130px" :rules="rules">
          <el-form-item label="模板文件:" prop="fileName">
            <el-upload
              v-if="detail.type === 'add'"
              ref = "ref_upload"
              class="upload-demo"
              action="/wnms/web-wn/bedHeadConfig/upload"
              :file-list="fileLists"
              :on-change="handleChange"
              :on-remove="beforeRemove"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-exceed="handleExceed"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              accept=".zip"
              :http-request="uploadFile"
            >
              <div class="upload-panel">
                <div class="uploadIcon-panel">
                  <img :src="uploadIcon">
                </div>
                <div>请选择上传文件</div>
              </div>
            </el-upload>
            <section v-else>{{form.fileName}}</section>
          </el-form-item>
          <el-form-item label="模板名称:" prop="label">
            <el-input v-model="form.label" class="elinput-300" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="模板类型:" prop="type">
            <el-input v-model="form.type" class="elinput-300" disabled/>
          </el-form-item>
          <el-form-item label="应用终端:" v-if="form.type">
            <el-radio-group v-model="form.device" @change="changeDeviceType">
              <el-radio label="床头分机">床头分机</el-radio>
              <el-radio label="床旁分机">床旁分机</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文件路径:" prop="path">
            <el-input v-model="form.path" class="elinput-300" disabled/>
          </el-form-item>
          <el-form-item label="缩略图:" prop="image" style="height:auto;">
            <img v-if="form.image" :src="form.image" class="cardfrom-image-avatar">
          </el-form-item>
          <el-form-item label="备注:" prop="memo">
            <el-input v-model="form.memo" maxlength="100" show-word-limit class="elinput-300" placeholder="请输入"
                      type="textarea"
                      :rows="7"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="backHandler" v-uni="'chuangtoukamuban_cancel'">取消</el-button>
      <el-button type="primary" @click="submit" v-uni="'chuangtoukamuban_save'">保存</el-button>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 例如：import uploadFile from '@/components/uploadFile/uploadFile'
import { deepMergeLeft, deepClone } from '@/assets/wnms/utils'
import * as bedCardConfigApi from '@/api/wnms/bedCardConfig/'
import BaseQueryPageForm from '../common/BaseQueryPageForm'
export default {
  name: 'addOrModify',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  mixins: [BaseQueryPageForm],
  data () {
    const form = this.initForm()
    const rules = this.initRules()
    // 这里存放数据
    return {
      fileLists: [],
      uploadIcon: require('@/assets/wnms/img/uploadIcon.png'),
      rules: rules,
      form: form
    }
  },
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 方法集合
  methods: {
    changeDeviceType (v) {
      console.log(v)
      this.form.type = v + '-' + this.form.type.split('-')[1]
    },
    submit () {
      this.$refs['formContent'].validate(valid => {
        if (valid) {
          console.log('this.form----', this.form, this.detail.type)
          // ID 为空的话 那么就是修改
          if (this.detail.type !== 'add') {
            bedCardConfigApi.Edit(this.form).then(response => {
              // 返回闹钟类型列表
              this.IsSuccess(response, () => {
                this.$emit('option-changed', 'list')
              })
            }).catch(e => {
              this.$message.warning(
                `失败:${e}`
              )
            })
          } else {
            bedCardConfigApi.Add(this.form).then(response => {
              this.IsSuccess(response, () => {
                this.$emit('option-changed', 'list')
              })
            }).catch(e => {
              this.$message.warning(
                `失败:${e}`
              )
            })
          }
        } else {
          return false
        }
      })
    },

    initForm () {
      return {
        label: '',
        type: '',
        path: '',
        image: '',
        memo: '',
        fileName: '',
        fileUrl: '',
        device: '床头分机'
      }
    },
    initRules () {
      return {
        label: [{
          required: true,
          message: '模板名称不能为空',
          trigger: 'change'
        }, {
          min: 1,
          max: 32,
          message: '模板名称长度限制为32个字符'
        }],
        fileName: [{
          required: true,
          message: '请上传附件',
          trigger: 'change'
        }],
        memo: [
          {
            min: 0,
            max: 100,
            message: '备注长度限制为100个字符'
          }
        ]
      }
    },
    /* 上传附件回调 */
    handleChange (F1, F2) {
      console.log('handleChange', F1, F2)
    },
    beforeRemove (F1, F2) {
      console.log('beforeRemove', F1, F2, JSON.stringify(this.form))
      if (this.form.fileName) {
        this.deleteFiles(() => {
          const self = this
          self.form.label = ''
          self.form.type = ''
          self.form.fileName = ''
          self.form.path = ''
          self.form.image = ''
          self.form.fileUrl = ''
          self.form.device = ''
        })
      }
    },
    handleSuccess (F1, F2) {
      console.log('handleSuccess', F1, F2)
      if (F1.status === 200) {

      } else {
        this.$message.warning(
          `上传失败${F1.desc}`
        )
        this.$refs.ref_upload.clearFiles()
      }
    },
    handleError (F1, F2) {
      console.log('handleError', F1, F2)
    },
    handleExceed (files, fileList) {
      // 超出数量提示
      this.$message.warning(
        `当前限制选择1 个文件，已超出个数限制!`
      )
    },
    beforeAvatarUpload (file, F2) {
      console.log('beforeAvatarUpload---', JSON.stringify(file), F2)
      var filename = file.name.substring(file.name.lastIndexOf('.'))
      const accept = '.zip'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!accept.includes(filename)) {
        // 选择的不是当前格式
        this.$message.warning(`请上传 .zip 文件!`)
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10 M!',
          type: 'warning'
        })
        return false
      }
    },
    // 重写上传
    uploadFile (param) {
      const self = this

      // FormData 对象
      let form = new FormData()

      // form.append('file', new Blob([JSON.stringify(param.file)], { type: "multipart/form-data" }))
      form.append('file', param.file)

      var xhr = new XMLHttpRequest()
      xhr.open('post', param.action, true)
      // xhr.setRequestHeader('Content-Type', 'multipart/form-data')
      xhr.onload = function (res) {
        if (res.target && res.target.response) {
          let R = JSON.parse(res.target.response)
          console.log('上传返回------', R)
          if (R.status === 200) {
            self.$message({
              message: R.desc,
              type: 'success'
            })
            self.form.label = R.data.tempName
            self.form.type = R.data.type
            if (R.data.type) self.form.device = R.data.type.split('-')[0]
            self.form.fileName = R.data.fileName
            self.form.path = '/resource' + R.data.url + '/index.html'
            self.form.image = '/resource' + R.data.url + '/index.png'
            self.form.fileUrl = '/resource' + R.data.url
          } else {
            self.$message({
              message: R.desc,
              type: 'warning'
            })
            self.$refs.ref_upload.clearFiles()
          }
        }
      }
      xhr.send(form)
    },
    // 删除附件
    deleteFiles (callBack) {
      bedCardConfigApi.deleteFile({ fileName: this.form.fileUrl }).then(res => {
        if (res.status === 200) {
          if (callBack)callBack()
        } else {
          this.$message.warning(
            `失败:${res.desc}`
          )
        }
      }).catch(e => {
        this.$message.warning(
          `失败:${e}`
        )
      })
    },
    backHandler (data) {
      if (this.detail.type === 'add' && this.form.fileName) {
        this.deleteFiles(() => {
          this.$emit('option-changed', 'list')
        })
      } else {
        this.$emit('option-changed', 'list')
      }
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    if (this.detail.type !== 'add') {
      this.form.id = this.detail.row.id
      bedCardConfigApi.getDetail(this.detail.row.id).then(res => {
        if (res.status === 200) {
          deepMergeLeft(this.form, res.data)
          if (this.form.type) this.form.device = this.form.type.split('-')[0]
        } else {
          this.$message.warning(
            `失败:${res.desc}`
          )
        }
      }).catch(e => {
        this.$message.warning(
          `失败:${e}`
        )
      })
    } else {
      deepMergeLeft(this.form, this.initForm())
    }
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

<style lang="scss">
  //@import url(); 引入公共css类
  .cardfrom-image-avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .uploadIcon-panel {
    width: 20px;
    height:18px;
    margin-right:10px ;
    position: relative;
    img{
      position: absolute;
      left: 2px;
    }
  }
  .upload-panel{
    display: flex;
    height: 40px;
    padding: 0 10px;
    align-items: center;
    border: 1px dashed #DCDFE6;
  }
  .upload-demo{
    .el-upload-list{
      width: 50%;
    }
  }

</style>
