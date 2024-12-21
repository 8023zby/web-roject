<template>
  <el-dialog
    title="应用"
    :visible="visible"
    :close-on-click-modal="false"
    :show-close="false"
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
      <el-button @click="resetCloseForm()" v-uni="'huanzhebiaoqianyingyong_cancel'" size="small">取消</el-button>
      <loading-button v-uni="'huanzhebiaoqianyingyong_save'" @click="submitForm">
        确认
      </loading-button>
    </div>
  </el-dialog>
</template>

<script>
import { ApiLabel2Nurse } from '../../../api/bnms'
import LoadingButton from '../../../components/bnms/LoadingButton'
export default {
  name: 'label2nurse',
  components: { LoadingButton },
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
    label_ids: {
      type: Array,
      default: function () {
        return []
      }
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
      let _depts = this.getNurseDataDeptId(this.nurse_data)
      if (this.deptIds.length === _depts.length) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
    },
    submitForm (done) {
      let http = null
      // 批量应用
      if (this.label_ids.length > 1) {
        http = ApiLabel2Nurse.multi({
          labelIdList: this.label_ids.join(','),
          pickDeptIdList: this.deptIds.join(',')
        })
      }
      // 单个应用
      else {
        // 取得未选中的
        let ban = []
        this.init_checked.forEach(v => {
          if (this.deptIds.indexOf(v) == -1) {
            ban.push(v)
          }
        })
        http = ApiLabel2Nurse.one({
          labelId: this.label_ids[0],
          pickDeptIdList: this.deptIds.join(','),
          banDeptIdList: ban.join(',')
        })
      }
      http
        .then(() => {
          this.$message.success('应用成功！')
          this.resetCloseForm()
        })
        .catch(res => {
          this.$message.error(res.message)
        })
        .finally(() => {
          done()
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
      let _depts = this.getNurseDataDeptId(this.nurse_data)
      if (this.init_checked.length === _depts.length) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
      data = data || []
      this.deptIds = data
      this.$nextTick(function () {
        this.$refs.tree && this.$refs.tree.setCheckedKeys(data)
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
