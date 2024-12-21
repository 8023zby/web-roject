<template>
  <el-dialog
    title="应用"
    :visible="visible"
    :close-on-click-modal="false"
    width="490px"
    @close="resetCloseForm"
  >
    <div class="tree-container">
      <el-checkbox v-model="checkedAll" @change="handleCheckAllChange"
        >全选/取消全选
      </el-checkbox>
      <!--<div style="margin: 15px 0;"></div>-->
      <!--<el-checkbox-group v-model="checked" @change="handleCheckedChange">-->
      <!--<div v-for="item in nurse_data" :key="item.deptId">-->
      <!--<el-checkbox :label="item.deptId" :value="item.deptId"-->
      <!--&gt;{{ item.deptName }}-->
      <!--</el-checkbox>-->
      <!--</div>-->
      <!--</el-checkbox-group>-->
      <el-tree
        ref="tree"
        node-key="deptId"
        show-checkbox
        default-expand-all
        :expand-on-click-node="false"
        :default-checked-keys="deptIds"
        check-on-click-node
        check-strictly
        :data="nurse_data"
        :props="defaultProps"
        @check="handleNodeCheck"
      ></el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm()" size="small" v-uni="'hulijibie_using_save'">保存</el-button>
      <el-button @click="resetCloseForm()" size="small" v-uni="'hulijibie_using_cancel'">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ApiNurseLevel2Dept } from '../../../api/bnms'

export default {
  name: 'label2nurse',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    init_checked: {
      type: Array,
      default: function () {
        return []
      }
    },
    nurse_level_id: {
      type: String
    },
    nurse_data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      checkedAll: false,
      deptIds: [],
      defaultProps: {
        label: 'deptName'
      }
    }
  },
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.userId = empInfo.empId || ''
  },
  methods: {
    handleCheckAllChange (val) {
      if (val) {
        let arr = (this.deptIds = this.getNurseDataDeptId(this.nurse_data))
        this.$refs.tree.setCheckedKeys(arr)
      } else {
        this.deptIds = []
        this.$refs.tree.setCheckedKeys([])
      }
    },
    getNurseDataDeptId (data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].deptId)
        if (data[i].children) {
          let a = this.getNurseDataDeptId(data[i].children)
          arr.push(...a)
        }
      }
      return arr
    },
    handleNodeCheck () {
      this.deptIds = this.$refs.tree.getCheckedKeys()
    },
    submitForm () {
      // 取得未选中的
      let ban = []
      this.init_checked.forEach(v => {
        if (this.deptIds.indexOf(v) == -1) {
          ban.push(v)
        }
      })
      ApiNurseLevel2Dept.one({
        nurseLevelId: this.nurse_level_id,
        pickDeptId: this.deptIds.join(','),
        banDeptId: ban.join(','),
        userId: this.userId
      })
        .then(() => {
          this.$message.success('应用成功！')
          this.resetCloseForm()
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 重置表单 & 关闭窗体
    resetCloseForm () {
      this.checkedAll = false
      this.$emit('update:visible', false)
    }
  },
  watch: {
    init_checked (data) {
      data = data || []
      this.deptIds = data
      this.$nextTick(function () {
        this.$refs.tree.setCheckedKeys(data)
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  /deep/ .el-dialog__body{
    text-align: center;
  }
  /deep/ .tree-container {
    max-width: 100%;
    display: inline-block;
    text-align: left;
  }
</style>
