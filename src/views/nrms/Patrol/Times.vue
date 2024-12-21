<template>
  <listLayout v-loading="loading">
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" v-uni="'xunshishijian_setting_add'" icon="el-icon-plus" @click="add(null)"
      >添加
      </el-button>
    </div>

    <div slot="main" class="main-list table">
      <!-- 表格 -->
      <el-table
              :data="times_data"
              style="width: 100%"
              stripe
              ref="table"
              height="100%"
      >

        <!-- <el-table-column type="index" align="center" label="序号" width="80"></el-table-column> -->
        <el-table-column
                prop="nurseLevelName"
                label="护理级别"
                min-width="80"
                align="center"
        ></el-table-column>
        <el-table-column
                prop="patrolTimeSpace"
                label="巡视间隔时间(分钟)"
                min-width="80"
                align="center"
        ></el-table-column>
        <el-table-column
                prop="patrolWarn"
                label="是否开启提醒"
                align="center"
                min-width="80"
        >
          <template slot-scope="scope">
            {{scope.row.patrolWarn=='1'?'是':'否'}}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" v-uni:[scope.$index]="'xunshishijian_setting_edit'"
            >编辑
            </el-button>
            <el-button type="textred" @click="del(scope.row)" v-uni:[scope.$index]="'xunshishijian_setting_delete'"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--新增、编辑对话框-->
    <el-dialog :title="form.optType" :visible.sync="showDialog" width="500px" :show-close="false" :close-on-click-modal="false">
      <el-form :model="patrolTimeObj" class="typt-add-dialog" :rules="rules" ref="addForm">
        <el-row :gutter="20">
          <el-col :span="24">

            <el-form-item label="护理级别:"  label-width="150px"  prop="nurseLevelName">
              <el-select v-uni="'xunshishijian_setting_hulijiebiexuanze'" v-model="patrolTimeObj.nurseLevelName" clearable :disabled="form.nurseLevelNameDis" placeholder="请选择">
                <el-option
                        v-for="item in levelArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="巡视间隔时间"  label-width="150px" prop="patrolTimeSpace">
              <el-input v-uni="'xunshishijian_setting_jiangexunshishijian'" v-model="patrolTimeObj.patrolTimeSpace" maxlength="5" @keyup.native="checkInt" placeholder="请输入">

              </el-input>
              <span class="slotSpan">分</span>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="是否开启巡视提醒:"  label-width="150px" prop="patrolWarn">
              <el-radio-group v-model="patrolTimeObj.patrolWarn" v-uni="'xunshishijian_setting_xunshitixing'">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exitDialog" v-uni="'xunshishijian_setting_cancel'">取消</el-button>
        <el-button type="primary" @click="onSubmit" v-uni="'xunshishijian_setting_confirm'">确认</el-button>
      </div>
    </el-dialog>

  </listLayout>

</template>

<script>
import { ApiPatrol, ApiDept } from '../../../api/nrms/index'
import listLayout from '../../../components/nrms/layout/list'

export default {
  name: 'Times',
  data () {
    return {
      times_data: [],
      loading: false,
      // 添加、编辑相关
      showDialog: false,
      optType: '',
      patrolTimeObj: {},
      form: {
        optType: '',
        nurseLevelNameDis: false
      },
      rules: {
        nurseLevelName: [
          { required: true, message: '请选择护理级别', trigger: 'change' }
        ],
        patrolTimeSpace: [
          { required: true, message: '请输入巡视间隔时间', trigger: 'blur' },
          { pattern: /^[1-9][0-9]*$/, message: '请输入正整数！', trigger: 'blur' }
        ],
        patrolWarn: [
          { required: true, message: '请选择是否开启提醒', trigger: 'change' }
        ]
      },
      levelArr: []
      // getNurseLevel
    }
  },
  components: {
    listLayout
  },

  created () {
    // 获取护理级别
    this.getNurseLevel()
    this.getData()
  },
  activated () {
    // 获取数据
    // this.getSignItemData();
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    onSubmit () {
      let _this = this
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (_this.form.optType == '修改') {
            console.log('修改巡视时间')
            ApiPatrol.putData(this.patrolTimeObj, 'patrolTime')
              .then(res => {
                console.log(res)
                this.showDialog = false
                this.resetObj()
                this.getData()
                this.$message.success('修改巡视时间成功')
                this.loading = false
              })
              .catch(res => {
                this.loading = false
                this.$message.error(res.message)
              })
          } else if (_this.form.optType == '添加') {
            console.log('添加巡视时间')
            ApiPatrol.addData(this.patrolTimeObj, 'patrolTime')
              .then(res => {
                console.log(res)

                this.showDialog = false
                this.resetObj()
                this.getData()
                this.$message.success('添加巡视时间成功')
                this.loading = false
              })
              .catch(res => {
                this.loading = false
                this.$message.error(res.message)
              })
          }
        }
      })
    },
    // 保存数据
    getNurseLevel () {
      ApiPatrol.getNurseLevel(null)
        .then(res => {
          let levelData = res.data || []
          if (levelData.length > 0) {
            for (let o of levelData) {
              this.levelArr.push({ value: o.nurseLevelName, label: o.nurseLevelName })
            }
          }
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    getData () {
      console.log(this.levelArr)
      this.loading = true
      ApiPatrol.getData(null, 'patrolTime')
        .then(res => {
          console.log('apiPatrol:')
          console.log(res)
          this.times_data = res.data || []
          this.formatLevel()
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    add () {
      this.resetObj()
      this.showDialog = true

      // this.$emit("option-changed", "add", row);
    },
    edit (row) {
      console.log(row)
      let _this = this
      _this.form.optType = '修改'
      _this.form.nurseLevelNameDis = true
      _this.patrolTimeObj = {
        patrolTimeId: row.patrolTimeId,
        nurseLevelName: row.nurseLevelName,
        patrolTimeSpace: row.patrolTimeSpace,
        patrolWarn: row.patrolWarn + ''
      }
      _this.showDialog = true
    },
    del (row) {
      console.log(row)
      this.$confirm('确认要删除“' + row.nurseLevelName + '”的巡视时间设置项吗?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        ApiPatrol.delData({ patrolTimeId: row.patrolTimeId }, 'patrolTime')
          .then(res => {
            console.log(res)
            this.getData()
            this.$message.success('删除“' + row.nurseLevelName + '”的巡视时间设置项成功')
            this.loading = false
          })
          .catch(res => {
            this.loading = false
            this.$message.error(res.message)
          })
      })
    },
    exitDialog () {
      this.$refs['addForm'].resetFields()
      this.showDialog = false

      this.resetObj()
    },
    formatLevel () {
      let _this = this
      console.log(_this.levelArr)
      let chkArr = []
      if (_this.levelArr.length == 0) return
      if (_this.times_data.length > 0) {
        for (let item of _this.times_data) {
          chkArr.push(item.nurseLevelName)
        }
        for (let item of _this.levelArr) {
          if (chkArr.indexOf(item.value) != -1) {
            _this.$set(item, 'disabled', true)
          } else {
            _this.$set(item, 'disabled', false)
          }
        }
      }
      console.log('----------formatLevel:')
      console.log(_this.levelArr)
    },
    resetObj () {
      this.form.optType = '添加'
      this.form.nurseLevelNameDis = false
      this.patrolTimeObj = {
        patrolTimeId: 'add',
        nurseLevelName: '',
        patrolTimeSpace: '',
        patrolWarn: '1'
      }
    },
    checkInt () {
      this.patrolTimeObj.patrolTimeSpace
      this.patrolTimeObj.patrolTimeSpace = this.patrolTimeObj.patrolTimeSpace.replace(/[^\.\d]/g, '')
      this.patrolTimeObj.patrolTimeSpace = this.patrolTimeObj.patrolTimeSpace.replace('.', '')
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
  .flexStype {
    position: absolute;
    top: 51px;
    left: 0;
    right: 0;
    bottom: 42px;
    height:100%
  }
  /deep/ .slotSpan{position: absolute; top: 6%; right: -20px; display: table-cell;white-space: nowrap; padding: 0}
</style>
