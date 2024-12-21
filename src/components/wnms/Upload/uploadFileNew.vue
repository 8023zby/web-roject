<!--上传组件-异步上传-->
<template>
  <div>
    <el-upload ref="fileUpload" class="upload-demo" :data="dataFile" :action="action" :on-change="handleChange" :file-list="filelist" :accept="accept" :limit="limits" :on-remove="handleRemove" :on-success="handleSuccess" :auto-upload="false">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>

export default {
  props: {
    needMD5: {
      type: String,
      default: () => {
        return "";
      }
    },
    accept: {
      type: String,
      default: () => { }
    },
    action: {
      type: String,
      default: () => {
        return '/bmms/web-bm/file?md5=1';
      }
    },
    limits: {
      type: Number,
      default: res => { }
    },
    dataName: {
      type: String,
      default: () => { }
    },
    filelist: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dataFile: {},
      Audio: ['.mp3', '.wav', '.wma'], // 当前音频1
      video: [
        '.mp4',
        '.avi',
        '.3gp',
        '.rmvb',
        '.wmv',
        '.mkv',
        '.mov',
        '.flv',
        '.mkv',
        '.mov'
      ] // 当前视频0
    };
  },
  methods: {
    handleRemove (file, fileList) {
      this.handleAudioRemove();
      this.uploadFliedsChange(file, fileList, 'del');
    },
    // 附件改变的钩子
    uploadFliedsChange (file, fileList, type) {
      this.$emit('uploadFliedsChange', {
        name: this.dataName,
        file,
        fileList,
        type
      });
    },
    // 文件上传成功时的钩子
    handleSuccess (res) {
      const _this = this;
      console.log('文件上传成功时的钩子:\n', JSON.stringify(res));
      if (res.status === 200) {
        _this.$emit('uploadFlieds', res);
        this.handleAudioRemove();
        this.$message({
          message: '上传成功',
          type: 'success'
        });
      } else {
        this.$message.error(res.desc);
        _this.$emit('uploadFlieds', res);
      }
    },
    handleAudioRemove (file) {
      this.fileList = [];
    },
    handleChange (file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }

      this.handleAudioRemove();
      this.fileList = fileList;
      this.uploadFliedsChange(file, fileList, 'change');
    },
    submit () {
      var _this = this;

      if (!this.fileList || this.fileList.length === 0) {
        this.$emit('changeLoading');
        this.$message.warning(
          `请上传附件`
        );
      } else {
        let file = this.fileList[0];
        var filename = file.name.substring(file.name.lastIndexOf('.'));
        const accept = this.accept.split(',');
        // 传给父组件文件大小
        this.$emit('getFilePara', (file.size / 1024 / 1024).toFixed(1));
        const isLt2M = file.size / 1024 / 1024 < 100;
        if (!accept.includes(filename)) {
          // 选择的不是当前格式
          this.$message.warning(`请上传 ${this.accept} 文件!`);
          this.$parent.changeLoading();
          this.$emit('change-loading');
          this.$refs.fileUpload.clearFiles();
          this.fileList = [];
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 100M!',
            type: 'warning'
          });
          this.$emit('changeLoading');
          return false;
        }

        this.$set(this.fileList[0], 'status', 'ready');
        _this.$refs.fileUpload.submit();
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
