<template>
  <listLayout v-loading="loading">
    <div slot="main" class="main-list table" style="margin-top:20px">
      <!-- 表格 -->
      <el-table
              :data="contents_data"
              style="width: 100%"
              height="100%"
      >
        <el-table-column
                align="center"
                width="50"
        ></el-table-column>
        <!-- <el-table-column type="index" align="center" label="序号" width="80"></el-table-column> -->
        <el-table-column
                prop="patrolType"
                label="巡视类型"
                min-width="80"
                align="center"
        ></el-table-column>
        <el-table-column
                prop="patrolContent"
                label="巡视内容"
                min-width="160"
        >
          <template slot-scope="scope">
            <ul class="patrolContent">
              <li v-for="(item,index) in (JSON.parse(scope.row.patrolContent))" :key="index">{{item.value}}</li>
            </ul>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150"  align="center">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" v-uni:[scope.$index]="'xunshineirong_setting_edit'"
            >编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--新增、编辑对话框-->
    <el-dialog title="编辑"
               :visible.sync="showDialog"
               width="780px"
               :show-close="false"
               top="10vh"
               :close-on-click-modal="false">
      <el-form :model="patrolContentsObj" class="add-from" :rules="rules" ref="addForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="巡视类型:"  label-width="100px"  prop="patrolType">
              <el-input v-uni="'xunshineirong_setting_xunshileixing'"  v-model.trim="patrolContentsObj.patrolType" disabled placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>

        </el-row>
        <!--
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="巡视内容:"  label-width="150px" prop="patrolTimeSpace">
                      <el-input v-model="patrolContentsObj.patrolContent" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
        -->
        <el-row :gutter="20">
          <el-col :span="24">
            <label class="el-form-item__label" style="width: 100px;">巡视内容:</label>
            <div style="margin-left:100px;" class="el-form-item__content">
              <el-form-item
                      v-for="(item, index) in patrolContentsObj.patrolContent"
                      :key="item.key"
              >
                <el-input type="textarea" v-uni="'xunshineirong_setting_xunshineirong'" maxlength="200" style="width: 80%" v-model="item.value" placeholder="请输入巡视内容" clearable show-word-limit :rows="4"></el-input>
                <i @click.prevent="addItem()" class="el-icon-circle-plus-outline iconAddCls"></i>
                <i v-if="index!==0" @click.prevent="removeItem(item)" class="el-icon-remove-outline iconDelCls"></i>
              </el-form-item>
            </div>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDialog" v-uni="'xunshineirong_setting_cancel'">取消</el-button>
        <el-button type="primary" @click="onSubmit" v-uni="'xunshineirong_setting_confirm'">确认</el-button>
      </div>
    </el-dialog>

  </listLayout>

</template>

<script>
import { ApiPatrol, ApiDept } from '../../../api/nrms/index'
import listLayout from '../../../components/nrms/layout/list'

export default {
  name: 'Contents',
  data () {
    return {

      contents_data: [],
      test: [{ label: 'C1', value: '1' }],
      loading: false,
      // 添加、编辑相关
      showDialog: false,
      baseObj: [
        { patrolType: '护理巡视', patrolContent: '[]' },
        { patrolType: '医生巡视', patrolContent: '[]' }
      ],
      patrolContentsObj: {
        patrolType: '',
        patrolContent: [{ key: `content_${Date.now()}`, value: '' }]
      },
      rules: {
      }
    }
  },
  components: {
    listLayout
  },
  created () {
    // 获取护理级别
    this.getData()
  },
  activated () {
    // 获取数据
    // this.getSignItemData();
  },
  methods: {
    addItem () {
      let _this = this
      console.log(_this.patrolContentsObj.patrolContent.length)
      if (_this.patrolContentsObj.patrolContent.length < 10) {
        console.log(_this.patrolContentsObj.patrolContent)
        _this.patrolContentsObj.patrolContent.push({ key: Date.now(), value: '' })
        // this.contentNum.basis++
      } else {
        this.$message.error('最多添加十条巡视内容组合')
        // MsgShow('warning', '最多添加十个焦点内容（依据D）！')
      }
    },
    // 删除多个
    removeItem (item) {
      let index
      index = this.patrolContentsObj.patrolContent.indexOf(item)
      if (index !== -1) {
        this.patrolContentsObj.patrolContent.splice(index, 1)
      }
      // this.contentNum.patrolContent--
    },

    onSubmit () {
      let _this = this
      console.log(this.patrolContentsObj)
      _this.$refs['addForm'].validate((valid) => {
        if (valid) {
          _this.loading = true
          console.log('修改巡视内容,共：' + _this.patrolContentsObj.patrolContent.length + '条')
          for (let i = 0; i < _this.patrolContentsObj.patrolContent.length; i++) {
            let o = _this.patrolContentsObj.patrolContent[i]
            if (o.value == '' || o.value == ' ') _this.patrolContentsObj.patrolContent.splice(i, 1)
          }
          console.log('去“空”后修改巡视内容,共：' + _this.patrolContentsObj.patrolContent.length + '条')
          let submitObj = {
            patrolContentId: _this.patrolContentsObj.patrolContentId,
            patrolType: _this.patrolContentsObj.patrolType,
            patrolContent: JSON.stringify(_this.patrolContentsObj.patrolContent)
          }

          ApiPatrol.putData(submitObj, 'patrolContent')
            .then(res => {
              console.log(res)
              this.showDialog = false
              this.getData()
              this.$message.success('修改巡视内容成功')
              this.patrolContentsObj = {
                patrolType: '',
                patrolContent: [{ key: `content_${Date.now()}`, value: '' }]
              }
              this.resetDialog()
              this.loading = false
            })
            .catch(res => {
              this.loading = false
              this.resetDialog()
              this.$message.error(res.message)
            })
        }
      })
    },
    getData () {
      this.loading = true
      ApiPatrol.getData(null, 'patrolContent')
        .then(res => {
          console.log('patrolContent_getData:')
          console.log(res)
          this.contents_data = res.data || []
          if (this.baseObj.length != this.contents_data.length) this.formatPatrolList()
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    edit (row) {
      let _this = this
      _this.showDialog = true

      _this.patrolContentsObj.patrolContentId = row.patrolContentId
      _this.patrolContentsObj.patrolType = row.patrolType
      if (row.patrolContent != '[]' && row.patrolContent != null && row.patrolContent != '') {
        _this.patrolContentsObj.patrolContent = JSON.parse(row.patrolContent)
      }
      _this.showDialog = true
    },
    resetDialog () {
      this.patrolContentsObj = {
        patrolType: '',
        patrolContent: [{ key: `content_${Date.now()}`, value: '' }]
      }
      this.$refs['addForm'].resetFields()
      this.showDialog = false
    },
    formatPatrolList () {
      let _this = this
      let chkArr = []
      let tid = null
      if (_this.contents_data.length > 0) {
        for (let item of _this.contents_data) {
          chkArr.push(item.patrolType)
        }
        for (let item of _this.baseObj) {
          if (chkArr.indexOf(item.patrolType) == -1) {
            tid && clearTimeout(tid)
            // 定时器执行
            tid = setTimeout(_this.addContent(item), 1000)
          }
        }
      } else {
        for (let item of _this.baseObj) {
          tid && clearTimeout(tid)
          // 定时器执行
          tid = setTimeout(_this.addContent(item), 1000)
        }
      }
    },
    addContent (obj) {
      console.log('添加巡视内容' + obj.patrolType)

      ApiPatrol.addData(obj, 'patrolContent')
        .then(res => {
          console.log(res)
          this.getData()
          this.$message.success('初始化' + obj.patrolType + '成功')
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    formatterPatrolContent (row) {
      if (row.patrolContent === null || row.patrolContent === '' || row.patrolContent === '[]') {
        return ''
      }
      let patrolContentTmp = JSON.parse(row.patrolContent)
      let contentStr = ''
      patrolContentTmp.forEach((item, index) => {
        if (item.value === '') return
        contentStr += item.value + ';'
      })
      return `${contentStr.substr(0, contentStr.length - 1)}`
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
  }
  .toolbar {
    padding: 10px 20px 10px;
    .operation {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        justify-content: flex-start;
      }

      .right {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .table {
    flex: 1;
    height: 0;
    overflow: hidden;
  }
  .iconAddCls{
    font-size: 24px;
    color: #409EFF;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
    margin-bottom:55px;
  }
  .iconDelCls{
    font-size: 24px;
    color: #F56C6C;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
    margin-bottom:55px;
  }
  .el-table .cell{ white-space:pre-wrap;}
  .patrolContent li{ list-style: disc inside; margin-bottom:10px;}
  /deep/ .typt-add-dialog{
    height:580px;
    width:95%;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom:20px;
  }
  /deep/ .typt-add-dialog .el-textarea .el-input__count{
    border-radius: 2px;
/*    color: #909399;
    background:transparent;
    position: absolute;
    font-size: 12px;
    bottom: -28px;
    right: 10px;*/
  }
</style>
