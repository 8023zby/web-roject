<template>
  <el-dialog
    title="批量配液"
    :visible="visible"
    :close-on-click-modal="false"
    width="250px"
    @close="resetCloseForm"
  >
    <el-checkbox
      v-model="checkedAll"
      @change="handleCheckAllChange"
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
      :data="patientData"
      node-key="patientId"
      show-checkbox
      default-expand-all
      :expand-on-click-node="false"
      check-on-click-node
      check-strictly
      :props="defaultProps"
    ></el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm()" size="small"
      >保存
      </el-button
      >
      <el-button @click="resetCloseForm()" size="small">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ApiPatient } from '../../../api/dams'
export default {
  name: 'batchDispense',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    medical_ids: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      checkedAll: false,
      defaultProps: {
        label: 'patientName'
      },
      patientIds: [],
      patientData: []
    }
  },
  created () {
    this.selectPatientData()
  },
  methods: {
    selectPatientData () {
      let list = [
        {
          patientInViewDTO: {
            patientId: 'PATIENT-ID1',
            bedName: '0001',
            patientName: '姓名1',
            sex: '女',
            patientAge: 26,
            inpNo: '45454545'
          }
        },
        {
          patientInViewDTO: {
            patientId: 'PATIENT-ID2',
            bedName: '0001',
            patientName: '姓名2',
            sex: '女',
            patientAge: 26,
            inpNo: '45454546'
          }
        }
      ]
      for (let i = 0; i < list.length; i++) {
        let listIn = {}
        listIn['patientId'] = list[i].patientInViewDTO.patientId
        listIn['bedName'] = list[i].patientInViewDTO.bedName
        listIn['patientName'] = list[i].patientInViewDTO.patientName
        listIn['sex'] = list[i].patientInViewDTO.sex
        listIn['patientAge'] = list[i].patientInViewDTO.patientAge
        listIn['inpNo'] = list[i].patientInViewDTO.inpNo
        this.patientData.push(listIn)
      }
      // ApiPatient.selectIn().then(res => {
      //   console.log(res)
      // this.inList = (res.data && res.data.patientSelectDtos) ? res.data.patientSelectDtos : [];
      // this.$nextTick(function () {
      //   if(this.$refs.inTable && this.initRowType === 'in' && this.inList[this.initRowIndex]) {
      //     this.activeName = "in";
      //     this.$refs.inTable.setCurrentRow(this.inList[this.initRowIndex])
      //     this.getInPatientInfo(this.inList[this.initRowIndex])
      //   }
      // })
      // })
    },
    // 全选与反选
    handleCheckAllChange (val) {
      if (val) {
        let arr = this.patientIds = this.getPatientDataDeptId(this.patientData)
        this.$refs.tree.setCheckedKeys(arr)
      } else {
        this.patientIds = []
        this.$refs.tree.setCheckedKeys([])
      }
    },
    getPatientDataDeptId (data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].patientId)
        if (data[i].children) {
          let a = this.getPatientDataDeptId(data[i].children)
          arr.push(...a)
        }
      }
      return arr
    },
    submitForm () {
      let http = null
      // 批量应用
      // if (this.patientIds.length > 1) {
      //   http = ApiLabel2Nurse.multi({
      //     labelIdList: this.label_ids.join(','),
      //     pickDeptIdList: this.deptIds.join(',')
      //   })
      // }
      // // 单个应用
      // else {
      //   // 取得未选中的
      //   let ban = []
      //   this.init_checked.forEach(v => {
      //     if (this.deptIds.indexOf(v) == -1) {
      //       ban.push(v)
      //     }
      //   })
      http = ApiLabel2Nurse.one({
        labelId: this.label_ids[0],
        pickDeptIdList: this.deptIds.join(','),
        banDeptIdList: ban.join(',')
      })
      // }
      http
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
      this.$parent.batchDispense_visible = false
    }
  }
}
</script>

<style scoped>

</style>
