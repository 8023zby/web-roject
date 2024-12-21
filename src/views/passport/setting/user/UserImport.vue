<template>
  <div class="typt-list-container">
    <div class="typt-tit-cls" style="position: relative">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">批量导入</div>
      <el-button @click="$emit('option-changed', 'list')" class="el-small-btn" style="position: absolute;right: 20px" type="primary">返回</el-button>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form passport-user-import" style="width: 1200px">
        <el-form ref="addForm" label-width="100px" :rules="rules" :model="form">
          <el-form-item label="模板下载：">
            <a href="/static/passport/ygdr.xls" download="模板样例.xls">模板样例</a>
          </el-form-item>
          <el-form-item label="上传文件：" prop="fileUrl">
            <el-upload
              accept="xls,xlsl"
              action="/passport/web-bm/push/importUser"
              :on-change="handleChange"
              :before-upload = "beforeUpload"
              :on-remove="handleRemove"
              :on-success = "uploadFile"
              :file-list="fileList">
              <el-button size="small" type="primary" style="height: 28px;padding:0 !important;width: 80px;border-radius: 2px !important;">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="错误数据：" style="height: 500px">
            <div>
              共读取数据:<span style="color: #1e87f0">{{allCount}}条</span>
              &emsp;成功数据:<span style="color: #14C68F">{{parseInt(allCount) - parseInt(errorCount)}}条</span>
              &emsp;错误数据:<span style="color: #f56c6c">{{errorCount}}条</span>
            </div>
            <!--列表-->
            <el-table
              :data="tableData"
              stripe
              height="400"
              style="border-left: 1px solid #EEEEEE; border-right: 1px solid #EEEEEE;"
            >
              <el-table-column
                label="序号"
                align="center"
                type="index"
                width="60">
              </el-table-column>
              <el-table-column
                align="center"
                prop="empName"
                label="姓名"
              >
              </el-table-column>
              <el-table-column
                prop="cardNo"
                label="身份证号码"
                align="center">
              </el-table-column>
              <el-table-column
                prop="sex"
                label="性别"
                align="center">
              </el-table-column>
              <el-table-column
                prop="phoneNum"
                label="手机号码"
                align="center">
              </el-table-column>
              <el-table-column
                align="center"
                prop="deptName"
                label="科室">
              </el-table-column>
              <el-table-column
                align="center"
                prop="validTime"
                label="有效时间"
              >
              </el-table-column>
              <el-table-column
                align="center"
                label="错误信息"
              >
                <template slot-scope="scope">
                  <span style="color: #f56c6c;">{{scope.row.errorMsg.toString()}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { MsgShow } from '../../../../assets/passport/js/Message'

export default {
  props: ['params'],
  data () {
    return {
      rules: {
        fileUrl: [
          { required: true, message: '还未成功上传文件', trigger: 'change' }
        ]
      },
      form: {
        fileUrl: ''
      },
      limitNum: 1,
      fileList: [],
      tableData: [],
      allCount: 0,
      errorCount: 0
    }
  },
  methods: {
    handleChange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    beforeUpload (file) {
      let arr = file.name.split('.')
      let type = arr[arr.length - 1]
      const testmsg = /^xls|xlsx$/.test(type)
      if (!testmsg) {
        this.$message.error('请上传xls或者xlsx格式文件!')
        return false
      }
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
        MsgShow('success', desc, 3000)
        this.tableData = response.data.errorData
        this.allCount = response.data.total
        this.errorCount = response.data.errorTotal
        if (this.errorCount < 1) {
          setTimeout(() => {
            this.$emit('option-changed', 'list')
          }, 4000)
        }
      } else {
        MsgShow('error', desc, 3000)
        this.tableData = response.data.errorData
        this.allCount = response.data.total
        this.errorCount = response.data.errorTotal
      }
    }
  }
}
</script>
<style lang="scss">
.passport-user-import{
  .el-upload-list{
    width: 300px;
  }

}
</style>
