<template>
    <el-upload
        class="avatar-uploader"
        action=""
        drag
        list-type="picture"
        :on-change="getFile"
        :show-file-list="false"
        :auto-upload="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <img v-if="pic" :src="pic" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div class="el-upload__tip" slot="tip">拖拽/点击上传，只能上传 jpg/png 文件，且不超过 2MB</div>
    </el-upload>
</template>
<script>
export default {
  name: 'upload',
  props: [ 'data' ],
  data () {
    return {
      pic: ''
    }
  },
  watch: {
    data: {
      handler (newValue, oldValue) {
        // console.log(newValue);
        this.pic = newValue
      },
      deep: true
    }
  },
  methods: {
    // 上传成功的钩子
    handleSuccess (res, file) {
      // alert('上传成功的钩子')
      // this.pic = URL.createObjectURL(file.raw);
    },
    // 上传前的钩子
    beforeUpload (file) {
      // alert('上传前的钩子')
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 状态改变时的钩子
    getFile (file, fileList) {
      // alert('状态改变时的钩子')

      if (this.beforeUpload(file.raw)) {
        this.getBase64(file.raw).then(res => {
          // console.log(res)
          this.pic = res
          this.$emit('childValue', this.pic)
        })
      }
    },
    // 文件 转 base64
    getBase64 (file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        let imgResult = ''

        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    }
  }
}
</script>
<style lang="scss">
    .el-upload-dragger {
        width: 146px;
        height: 146px;
        border: none;
    }
</style>
