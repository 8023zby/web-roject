<template>
  <el-dialog
    title="组合班管理"
    :visible.sync="visible"
    width="700px"
    height="765px"
    @close="onClose"
    :close-on-click-modal="false">
    <el-form
      :model="combinedForm"
      :rules="rules"
      ref="combinedForm"
      label-suffix=":"
      label-width="140px">
      <el-form-item label="组合班名称" prop="composeName" class="saveTool">
        <el-input
          style="width: 245px"
          v-model.trim="combinedForm.composeName"
          autocomplete="off"
          maxlength="20"
          clearable
          placeholder="请输入"/>
        <el-button v-uni="'zuhebanguanli_save'" class="save" :loading="buttonLoading" type="primary" @click="onSave">保存</el-button>
        <el-button v-uni="'zuhebanguanli_reset'" class="reset" type="text" @click="onReset">重置</el-button>
      </el-form-item>
      <el-form-item label="包含的班次" prop="composeInfo">
        <div class="shifts">
          <div class="shifts-placeholder" v-if="combinedForm.composeInfo.length == 0">
            请在下方选择相关班次
          </div>
          <div class="shifts-tags" v-else v-for="(s, index) in combinedForm.composeInfo" :key="s.shiftId">
            <span>{{s.shiftName}}</span>
            <span v-uni:[s.shiftId]="'zuhebanguanli_delete'" @click="onDeleteChanged(index)">
              <i class="el-icon-close"></i>
            </span>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="g.name" v-for="g in groupShifts" :key="g.name" class="shift">
        <div>
          <el-button v-uni:[g.shiftId]="'zuhebanguanli_add'" v-for="s in g.shifts"  :key="s.shiftId"  v-if="s.status" @click="onChangedShift(s)">{{s.shiftName}}</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="main-list">
      <el-table :data="tableData"  height="285px" style="width: 100%">
        <!-- <el-table-column  type="index" align="center" label="序号" fixed width="90"></el-table-column> -->
        <el-table-column prop="composeName" align="center" min-width="200" label="组合班名称"></el-table-column>
        <el-table-column prop="composeInfo" align="center" min-width="400" label="包含班次"  >
          <template slot-scope="scope">
            <div  v-html="formatShifts(scope.row)"></div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <el-button v-uni:[scope.row.composeId]="'zuhebanguanli_table_edit'" :key="'zuhebanguanli_table_edit' + scope.row.composeId" type="text" @click="onModify(scope.row)">编辑</el-button>
            <el-button v-uni:[scope.row.composeId]="'zuhebanguanli_table_delete'" :key="'zuhebanguanli_table_delete' + scope.row.composeId" type="textred" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { ApiNurseShift, ApiComposedShit } from '../../../api/hsms/api'

export default {
  name: 'CombinedShift',
  props: ['visible', 'shiftTypes'],
  watch: {
    visible () {
      if (this.visible) {
        this.getShifts()
        this.getData()
      }
    }
  },
  data () {
    return {
      buttonLoading: false,
      combinedForm: {
        composeId: '',
        composeName: '',
        composeInfo: [] // 包含的班次
      },
      tableData: [],
      shifts: [],
      groupShifts: {}, // 分组的班次
      rules: {
        composeName: [
          { required: true, message: '请填写组合班名称！', trigger: 'blur' },
          { message: '组合班名称长度不超过10个字符！', trigger: 'blur', pattern: /^.{1,10}$/ }
        ],
        composeInfo: [
          { required: true, message: '请选择所包含班次！' },
          {
            validator: (rule, value, callback) => {
              if (value.length < 2) {
                callback(new Error('至少包含2个班次!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    onChangedShift (s) {
      this.combinedForm.composeInfo.push({
        shiftId: s.shiftId,
        shiftName: s.shiftName
      })
    },
    onDeleteChanged (i) {
      this.combinedForm.composeInfo.splice(i, 1)
    },
    onSave () {
      this.$refs['combinedForm'].validate((valid) => {
        if (valid) {
          let combineInfo = this.combinedForm.composeInfo
          for (let i = 0; i < combineInfo.length; i++) {
            combineInfo[i].sort = i + 1
          }
          ApiComposedShit.save(this.combinedForm)
            .then(() => {
              this.$message.success('保存成功！')
              this.onReset()
              this.getData()
            })
            .catch(res => {
              this.$message.error(res.message || '保存失败！')
            })
        }
      })
    },
    onReset () {
      this.combinedForm.composeId = ''
      this.combinedForm.composeName = ''
      this.combinedForm.composeInfo = []
    },
    getShifts () {
      ApiNurseShift.select()
        .then(res => {
          let _shifts = res.data ? res.data : []
          let group = {}
          for (let x in this.shiftTypes) {
            if (!group[x]) group[x] = { name: this.shiftTypes[x], shifts: [] }
          }
          for (let i = 0; i < _shifts.length; i++) {
            let _d = _shifts[i]

            if (!group[_d['shiftType']]) {
              group[_d['shiftType']] = {}
            }

            group[_d['shiftType']]['shifts'].push({
              shiftName: _d['shiftName'],
              shiftId: _d['shiftId'],
              status: _d['status']
            })
          }
          this.groupShifts = group
        })
    },
    getData () {
      ApiComposedShit.select()
        .then(res => {
          console.log(res.length > 0)
          // 把得到的数据根据sort排序一下

          if (res.data) {
            for (let item of res.data) {
              item.composeInfo.sort(function (x, y) {
                return x['sort'] - y['sort']
              })
            }
          }

          // console.log(res.data)
          this.tableData = res.data || []
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    onModify (row) {
      Object.assign(this.combinedForm, JSON.parse(JSON.stringify(row)))
    },
    onDelete (row) {
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiComposedShit.delete({ composeId: row.composeId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message || '删除失败！')
          })
      })
    },
    formatShifts (row) {
      let composeInfo = row.composeInfo || []
      let names = []
      if (composeInfo == []) {
        return
      }
      for (let i = 0; i < composeInfo.length; i++) {
        let item = composeInfo[i]
        if (item.status == 0) {
          names.push('<span style="text-decoration: line-through;">' + item.shiftName + '</span>')
        } else {
          names.push('<span>' + item.shiftName + '</span>')
        }
      }
      return names.join('/')
    },
    onClose () {
      this.onReset()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/hsms/css/self_common";

  /deep/ .el-dialog__body {
    padding-right: 0;
    padding-left: 0;
  }

  /deep/ .el-form-item {
    margin-bottom: 20px !important;
  }

  .saveTool {
    .save {
      margin-left: 38px;
      margin-right: 16px;
      font-size: 14px;
    }
    .reset {
      font-size: 14px;
    }
  }
  .shifts {
    overflow: hidden;
    width: 407px;
    min-height: 50px;
    padding-bottom: 10px;
    border: 1px solid #DFDFDF;
    border-radius: 2px;
    max-height: 148px;
    overflow-y: auto;
    .shifts-placeholder{
      color: #cccccc;
      padding-left: 15px;
    }
    .shifts-tags {
      margin: 10px 10px 0;
      float: left;
      text-align: center;
      height: 28px;
      line-height: 28px;
      background: #EEF7FE;
      border: 1px solid #D8EEFF;
      color: #1A7CEE;
      border-radius: 2px;

      span {
        display: inline-block;
        i{
          cursor: pointer;
        }
        &:first-child {
          padding: 0 5px;
          min-width: 60px;
        }
        &:last-child {
          width: 20px;
        }
      }
    }
  }
  .shift {
    /deep/ .el-form-item__label {
      line-height: 32px !important;
      height: 32px !important;
    }
    button {
      margin: 0 10px 0 0;
      color: #333333;
      font-size: 14px;
      min-width: 80px;
      padding: 7px 10px;
      &:active {
        background-color: #1A7CEE;
        border-color: #1A7CEE;
        color: #fff;
      }
    }
  }
  /deep/.el-dialog .el-input__inner {
    height: 32px !important;
    line-height: 32px !important;
  }

  /deep/.el-dialog .el-form-item__label {
    line-height: 32px !important;
    height: 32px !important;
  }
</style>
