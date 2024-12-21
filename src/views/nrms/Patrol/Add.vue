<template>
  <layout v-loading="loading">
    <div slot="title">
      编辑医护巡视
    </div>
    <div slot="main"
         class="add-from">
      <el-form :model="patrolObj"
               class="alignCenter"
               :rules="rules"
               ref="ruleForm">
        <el-form-item label="巡视内容："
                      label-width="100px"
                      prop="patrolContent">
          <el-button type="primary"
                     @click="showDialog=true"
          style="display: block">
            选择模板
          </el-button>
          <el-input type="textarea"
                    :autosize="{ minRows: 15, maxRows: 15}"
                    maxlength="3000"
                    style="width:700px;margin-top: 12px;"
                    v-model="patrolObj.patrolContent"
                    placeholder="请选择巡视内容" clearable
                    show-word-limit
          ></el-input>

        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button size="small" @click="close">
        取消
      </el-button>
      <el-button type="primary" size="small" @click="submitForm">
        保存
      </el-button>
    </div>
    <!--此处弹框样式选取UI规范中的780px，内补丁50px-->
    <el-dialog title="选择巡视模板"
               :visible.sync="showDialog"
               width="780px"
               custom-class="bodyDialogCss"
               :show-close="false"
               :close-on-click-modal="false">

      <div class="alert_content">
        <el-checkbox-group v-model="chkPCList">
          <el-checkbox v-for="pcList in patrolContentList"
                       style="display:block;"
                       :key="pcList.key"
                       :label="pcList"
                       >{{pcList.value}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDialog">取消</el-button>
        <el-button type="primary" @click="setContant">确认</el-button>
      </div>
    </el-dialog>

  </layout>
</template>

<script>
import layout from '../../../components/nrms/layout/edit'
import { ApiPatrol } from '../../../api/nrms'

export default {
  name: 'patrolAdd',
  components: { layout },
  data () {
    return {
      loading: false,
      params: {},
      patrolObj: {
        recordId: '',
        patrolContent: ''
      },
      patrolContentList: [],
      chkPCList: [],
      showDialog: false,
      rules: {
        patrolContent: [
          { required: true, message: '巡视内容为空', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['detail'],
  created () {
    this.init()
  },
  activated () {
    this.init()
  },
  methods: {
    init () {
      this.params = this.detail || {}
      console.log('params')
      console.log(this.params)
      this.patrolObj.recordId = this.params.recordId || ''
      this.patrolObj.patrolContent = this.params.patrolContent || ''

      this.getPatrolContents()
    },
    getPatrolContents () {
      let _this = this
      console.log('getPatrolContents')

      let getPara = {
        patrolType: this.params.patrolType
      }
      ApiPatrol.getData(getPara, 'getPatrolContentList')
        .then(res => {
          console.log('patrolContent_getData:')
          console.log(res)
          _this.basePatrolObj = res.data || []
          this.patrolContentList = []
          this.patrolContentList = JSON.parse(res.data[0].patrolContent)

          if (_this.basePatrolObj.length === 0) {
            this.$message.error('请先对巡视内容设置进行初始化操作')
          }
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    resetDialog () {
      this.showDialog = false
    },
    setContant () {
      let tmpContent=[];
      for(let i=0;i<this.chkPCList.length;i++){
        let v = this.chkPCList[i].value;
        if(v && v!='') tmpContent.push(v)
      }
      this.patrolObj.patrolContent = tmpContent.join('\r\n').substr(0, 2009);
      this.chkPCList = []
      this.showDialog = false
    },
    submitForm () {
      let _this = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log('subForm')
          let putPara = {
            patrolRecord: _this.patrolObj
          }
          ApiPatrol.putData(_this.patrolObj, 'putPatrolData')
            .then(res => {
              console.log('patrolContent_getData:')
              console.log(res)
              if (res.status == '200') {
                _this.$message.success('保存正确！')
                _this.close()
              }
            })
            .catch(res => {
              this.loading = false
              this.$message.error(res.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单 & 关闭窗体
    close () {
      this.patrolObj = {
        recordId: '',
        patrolContent: ''
      }
      this.$emit('changed', 'list')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .alignCenter {
    width: 500px;
    margin: 0px auto;
    /deep/.el-form-item:last-child{
      margin-bottom: 10px;
    }
    /*根据UI禅道提出的bug修改*/
    /deep/ .el-textarea{
      margin-top: 12px;
      .el-textarea__inner{
        min-height: 144px !important;
      }
    }
  }

  /deep/ .el-textarea__inner {
    border-radius: 2px
  }

  /deep/ .el-button--small {
    border-radius: 2px !important;
  }
  /deep/ .el-button--mini, .el-button--small {
    font-size: 14px;
  }
</style>
<style lang="scss" type="text/scss">
  .bodyDialogCss{
    .alert_content{
      padding:0 30px;
      .el-checkbox{
        padding: 10px 0;
        display: block;
        //复选框内容超出后换行展示
          .el-checkbox__label{
            display: inline-grid;
            white-space: pre-line;
            word-wrap: break-word;
            overflow: hidden;
            line-height: 20px;
          }
      }
    }
    .el-dialog__footer{
      padding: 25px 20px 20px 20px;
    }
  }
</style>
