<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls" style="position: relative">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{params.type===1?'批量添加人脸':'批量添加签名'}}</div>
      <el-button v-uni="actKey + 'cancel'" @click="$emit('option-changed', 'list')" class="el-small-btn" style="position: absolute;right: 20px" type="primary">返回</el-button>
    </div>
    <div class="typt-add-container">
        <div class="typt-add-form" style="width: 600px">
            <el-form ref="addFormData" label-width="130px">
              <el-form-item label="上传图片：">
                <el-upload
                  v-uni="actKey + 'upload'"
                  class="upload-demo"
                  action="/bmms/web-bm/file"
                  :on-success="handleSuccess"
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :auto-upload = "true"
                  :limit="100"
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload"
                  ref="upload"
                  accept="image/jpeg,image/jpg,image/png"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="passport-upload__tip">只可上传格式为jpg、jpeg和png的照片，大小限制为2m以内；照片名称必须为用户名，否则批量上传时无法正确保存到相应的用户信息中；每次批量上传照片只可以为用户增加一张照片。</div>
                </el-upload>
              </el-form-item>
            </el-form>
        </div>
    </div>
    <div class="typt-add-footer">
      <el-button v-uni="actKey + 'save'" type="primary" @click="submitFile" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import { AxiosJsonApi } from '../../../../api/passport/http'
import { ResultMsg, MsgShow } from '../../../../assets/passport/js/Message'

export default {
  props: ['params'],
  data () {
    return {
      fileList: [],
      addVis: false,
      numObj: {},
      successNum: 0,
      failNum: 0,
      fileLen: 0,
      actKey: 'shengwushibieshangchuan_'
    }
  },
  methods: {
    handleSuccess (response, file) {
      let status = response.status
      if (status === 200) {
        this.numObj[response.data.urlPath] = response.data
        this.successNum++
      } else {
        this.addVis = false
        MsgShow('error', '上传失败！')
        this.failNum++
      }
    },
    beforeAvatarUpload (file) {
      // 图片不能大于500k
      const isLt500K = file.size / 1024 / 1024 < 2
      let arr = file.name.split('.')
      let type = arr[arr.length - 1]
      const testmsg = /^(jpeg|png|jpg)$/.test(type)
      if (!testmsg) {
        this.addVis = false
        MsgShow('error', '请上传jpeg、jpg、png格式的图片!', 3000)
      }
      if (!isLt500K) {
        this.addVis = false
        MsgShow('error', '上传图片大小不能超过2MB!', 3000)
      }
      return testmsg && isLt500K
    },
    handleChange (file, fileList) {
      this.fileLen = fileList.length
    },
    handleRemove (file, fileList) {
      if (file && file.status === 'success') {
        if (file.response && file.response.status === 200) {
          this.successNum--
          delete this.numObj[file.response.data.urlPath]
        } else {
          this.failNum--
        }
        this.fileLen = fileList.length
      }
    },
    handleExceed (files, fileList) {
      this.addVis = false
      MsgShow('warning', `当前限制选择 100 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`, 5000)
    },
    beforeRemove (file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm(`确定移除 ${file.name}？`, '提示', {
          confirmButtonText: '确 认',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning'
        }).then(() => {

        })
      }
    },
    // 提交上传
    submitFile () {
      if (this.successNum + this.failNum === this.fileLen) {
        this.addVis = true
        this.saveData()
      } else {
        MsgShow('warning', `请全部上传完图片再提交！`, 3000)
      }
    },
    // 获取保存数据
    getUpData () {
      let temp = []
      for (let p in this.numObj) {
        temp.push(this.numObj[p])
      }
      return temp
    },
    // 保存数据
    saveData () {
      let dataList = this.getUpData()
      if (dataList.length === 0) {
        this.addVis = false
        MsgShow('warning', `请至少上传一张图片！`, 3000)
        return false
      }
      /* console.log(JSON.stringify({
        type: 1,
        batchDtoList: dataList
      })) */
      AxiosJsonApi(
        '/passport/web-rbac/biometric/batch',
        {
          type: this.params.type,
          batchDtoList: dataList
        }).then(res => {
        if (res.status === 200) {
          /* if (this.failNum > 0) {
            MsgShow('warning', `共批量上传${this.fileLen}张照片，匹配成功${this.successNum}张，匹配失败${this.failNum}张`, 3000)
          } else {
            ResultMsg(res, '上传', () => {
              this.$emit('main-reload')
            })
          } */
          let data = res.data
          if (data.fail.length > 0) {
            this.$alert(`共批量上传${data.count}张照片，匹配成功${data.success.length}张，匹配失败${data.fail.length}张。`, '提示', {
              confirmButtonText: '确 认',
              showClose: false
            })
          } else {
            ResultMsg(res, '上传', () => {
              this.$emit('main-reload')
            })
          }
          this.addVis = false
        } else {
          MsgShow('error', res.desc, 3000)
          this.addVis = false
        }
      })
    }
  }
}
</script>
<style scoped>
  .passport-upload__tip{
    color: #cccccc;
    line-height: 20px;
    padding-top: 10px;
  }
</style>
