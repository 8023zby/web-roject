<template>
  <el-dialog title="应用"
             :visible="visible"
             :close-on-click-modal="false"
             width="780px"
             height="430px"
             @close="resetCloseForm"
             :showClose="false"><!--width="490px"-->
    <el-form ref="ruleForm"
             :model="ruleForm"
             style="text-align: left;">
      <el-form-item label="名称:"
                    prop="shiftMainId"
                    min-width="50"
                    :rules="{required: true, message: '请选择！', trigger: 'change'}">
        <el-select v-model="ruleForm.shiftMainId"
                   ref="select"
                   placeholder="请选择"
                   @change="handleChange"
                   style="width: 360px;height: 46px;">
          <el-option v-for="item in shifts"
                     :key="item.shiftMainId"
                     :label="item.shiftMainName"
                     :value="item.shiftMainId"/>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="dept-container">
      <div class="dept-all">
        <el-checkbox v-model="checkedAll"
                     @change="handleCheckAllChange1">
          全选/取消全选
        </el-checkbox>
      </div>

      <el-checkbox-group v-model="deptRes"
                         @change="deptResChange">
        <div class="dept-item"
             v-for="item in allDepts1"
             :key="item.deptId">
          <template v-if="item.deptName.length > 6">
            <el-tooltip class="item"
                        effect="dark"
                        :content="item.deptName"
                        placement="top">
              <el-checkbox :label="item.deptId"
                           :disabled="item.isDisabled === true"
                           :key="item.deptId">{{item.deptName}}
              </el-checkbox>
            </el-tooltip>
          </template>
          <template v-if="item.deptName.length <= 6">
            <el-checkbox :label="item.deptId"
                         :disabled="item.isDisabled === true"
                         :key="item.deptId">{{item.deptName}}
            </el-checkbox>
          </template>
        </div>
      </el-checkbox-group>
    </div>

    <div class="tree-container" v-show="false">
      <el-checkbox v-model="checkedAll"
                   @change="handleCheckAllChange">
        全选/取消全选
      </el-checkbox>

      <el-tree v-loading="loading"
               ref="tree"
               node-key="deptId"
               show-checkbox
               :expand-on-click-node="false"
               :default-checked-keys="curCheckedDeptIds"
               check-on-click-node
               check-strictly
               :data="allDepts"
               :props="defaultProps"
               @check="handleNodeCheck"/>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="resetCloseForm()"
                 size="small"
                 style="border-radius: 2px !important;">取消
      </el-button>
      <el-button type="primary"
                 @click="submitForm1()"
                 size="small"
                 style="border-radius: 2px !important;">确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ApiShifts2Dept, ApiDept, ApiShifts } from '../../../api/bnms/index'

export default {
  name: 'shift2nurse',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    shifts: {
      type: Array,
      default: function () {
        return null
      }
    }
  },
  watch: {
    visible (newVal, oldVal) {
      if (newVal) {
        this.resetFields()
      }
    },
    'ruleForm.shiftMainId': {
      handler (val) {
        if (val === '') {
          for (let j = 0; j < this.allDepts1.length; j++) {
            this.allDepts1[j].isDisabled = false
          }
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      loading: false,
      checkedAll: false,
      curCheckedDeptIds: [],
      defaultProps: {
        label: 'deptName'
      },
      oldCheckedDeptIds: [],
      allDepts_cache: [],
      allDepts: [],
      allDepts1: [],
      deptRes: [],
      ruleForm: {
        shiftMainId: ''
      },
      orgInfo: {}
    }
  },
  mounted () {
    // console.log('mounted')
  },
  updated () {
    // console.log('updated')
  },
  created () {
    this.orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.getAllDept()
  },
  methods: {
    resetFields () {
      this.$nextTick(function () {
        this.$refs.tree.setCheckedKeys([])
        this.$refs.ruleForm.resetFields()
      })
    },
    // 获取所有科室
    getAllDept () {
      this.loading = true
      ApiDept.select().then(res => {
        this.loading = false
        if (res.data) {
          this.allDepts = this.allDepts_cache = res.data.list || []
        } else {
          this.allDepts = this.allDepts_cache = []
        }
        for (let i = 0; i < this.allDepts.length; i++) {
          let item = this.allDepts[i]
          this.allDepts1.push(item)
          this.forChild(item)
        }

        for (let j = 0; j < this.allDepts1.length; j++) {
          this.allDepts1[j].isDisabled = false
        }
      })
    },
    forChild (item) {
      if (item.children === undefined || item.children === '' || item.children === null || item.children.length === 0) {

      } else {
        for (let i = 0; i < item.children.length; i++) {
          this.allDepts1.push(item.children[i])
          let _item = item.children[i]
          if (_item.children === undefined || _item.children === '' || _item.children === null || _item.children.length === 0) {

          } else {
            this.forChild(_item)
          }
        }
      }
    },
    deptResChange (value) {
    },
    // 获取已应用的科室
    handleChange (val) {
      this.loading = true
      // 先还原
      this.allDepts = JSON.parse(JSON.stringify(this.allDepts_cache))
      this.deptRes = []
      this.checkedAll = false
      for (let j = 0; j < this.allDepts1.length; j++) {
        this.allDepts1[j].isDisabled = false
      }
      Promise.all([this.getUsedDeptList(), this.getSelfUsedDept(val)])
        .then(res => {
          const otherDept = res[0].data || []
          const selfDept = res[1].data || []

          for (let i = 0; i < selfDept.length; i++) {
            this.deptRes.push(selfDept[i])
          }

          for (let j = 0; j < this.allDepts1.length; j++) {
            let _d = this.allDepts1[j]
            if (otherDept.includes(_d['deptId']) && !selfDept.includes(_d['deptId'])) {
              this.allDepts1[j].isDisabled = true
            }
          }
          // 禁用
          this.allDepts = this.disabledDept(this.allDepts, selfDept, otherDept)
          //
          this.oldCheckedDeptIds = selfDept
          this.$nextTick(function () {
            this.$refs.tree.setCheckedKeys(selfDept)
          })
          this.loading = false
        }).catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    getSelfUsedDept (val) {
      // /nsms/web-bn/shift/used-dept
      // 已经应用的科室
      return ApiShifts2Dept.select({ shiftMainId: val })
    },
    // 已有应用的科室
    getUsedDeptList () {
      // /nsms/web-bn/shift/dept-list
      // 查询机构中所有应用过班次的科室
      return ApiShifts.deptList({ orgId: this.orgInfo.orgId })
    },
    disabledDept (depts, selfDept, otherDept) {
      for (let i = 0; i < depts.length; i++) {
        let _d = depts[i]
        if (otherDept.includes(_d['deptId']) && !selfDept.includes(_d['deptId'])) {
          this.$set(_d, 'disabled', true)
        }
        if (_d['children'] && _d['children'].length > 0) this.disabledDept(_d['children'], selfDept, otherDept)
      }
      return depts
    },
    // 全选
    handleCheckAllChange (val) {
      if (val) {
        let arr = (this.curCheckedDeptIds = this.getNurseDataDeptId(this.allDepts))
        this.$refs.tree.setCheckedKeys(arr)
      } else {
        this.curCheckedDeptIds = []
        this.$refs.tree.setCheckedKeys([])
      }
    },
    handleCheckAllChange1 (val) {
      this.deptRes = []
      if (val) {
        for (let i = 0; i < this.allDepts1.length; i++) {
          let item = this.allDepts1[i]
          if (item.isDisabled === false) {
            this.deptRes.push(item.deptId)
          }
        }
      } else {

      }
    },
    // 格式化科室ids
    getNurseDataDeptId (data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i].disabled) arr.push(data[i].deptId)
        if (data[i].children) {
          let a = this.getNurseDataDeptId(data[i].children)
          arr.push(...a)
        }
      }
      return arr
    },
    handleNodeCheck () {
      this.curCheckedDeptIds = this.$refs.tree.getCheckedKeys()
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 取得未选中的
          let ban = []
          this.oldCheckedDeptIds.forEach(v => {
            if (this.curCheckedDeptIds.indexOf(v) == -1) {
              ban.push(v)
            }
          })
          ApiShifts2Dept.apply({
            shiftMainId: this.ruleForm.shiftMainId,
            pickDeptIdList: this.curCheckedDeptIds.join(','),
            banDeptIdList: ban.join(',')
          })
            .then(() => {
              this.$message.success('应用成功！')
              this.resetCloseForm()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm1 () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 取得未选中的
          let ban = []
          this.oldCheckedDeptIds.forEach(v => {
            if (this.deptRes.indexOf(v) == -1) {
              ban.push(v)
            }
          })
          ApiShifts2Dept.apply({
            shiftMainId: this.ruleForm.shiftMainId,
            pickDeptIdList: this.deptRes.join(','),
            banDeptIdList: ban.join(',')
          })
            .then(() => {
              this.$message.success('应用成功！')
              this.resetCloseForm()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单 & 关闭窗体
    resetCloseForm () {
      this.checkedAll = false
      this.ruleForm.shiftMainId = ''
      this.deptRes = []
      this.$refs.tree.setCheckedKeys([])
      this.allDepts = JSON.parse(JSON.stringify(this.allDepts_cache))
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  /deep/ .el-dialog__body {
    text-align: center;
    padding: 30px 30px 0 30px;
  }

  /deep/ .tree-container {
    max-width: 100%;
    display: inline-block;
    text-align: left;
  }

  /deep/ .el-tree-node__expand-icon {
    font-size: 16px;
    color: #2D2D2D;
  }

  /deep/ .el-tree-node__expand-icon.is-leaf {
    color: transparent;
  }

  /deep/ .el-tree-node__content {
    align-items: baseline;

    .el-tree-node__label {
      color: #5B5B5B
    }

    .el-tree-node__expand-icon:not(.is-leaf) ~ .el-tree-node__label {
      color: #2D2D2D;
    }

    .el-tree-node__label {
      height: auto;
    }
  }

  /deep/ .el-button {
    width: 70px;
    height: 40px;
  }

  /deep/ .el-button--primary, .el-button--default {
    border-radius: 0 !important;
  }

  .dept-container {
    height: 320px;
    overflow: scroll;

    .dept-all {
      width: 100%;
      text-align: left;
      height: 30px;
      line-height: 30px;
    }

    .dept-item {
      width: 140px;
      /*width: 320px;*/
      float: left;
      height: 30px;
      line-height: 30px;
      text-align: left;
      /*超出文字隐藏*/
      overflow: hidden;
      /*当文本溢出，省略号代替*/
      text-overflow: ellipsis;
      /*文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。*/
      white-space: nowrap;
    }
  }

  /deep/ .el-form-item__error {
    left: 55px;
  }

  /deep/ .el-form-item__label {
    color: #666666;
  }

  /deep/ .el-checkbox__label {
    width: 110px;
    /*border: 1px solid red;*/
    /*超出文字隐藏*/
    overflow: hidden;
    /*当文本溢出，省略号代替*/
    text-overflow: ellipsis;
    /*文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。*/
    white-space: nowrap;
  }

  /deep/ .el-checkbox__input {
    top: -3px;
  }
</style>
