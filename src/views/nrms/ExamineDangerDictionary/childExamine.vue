<template>
  <div class="main-list" style="height: 300px">
    <el-table ref="table" highlight-current-row :data="tableData" height="100%"
              :row-style="{height:'44px'}" stripe>
      <!-- <el-table-column type="index" label="序号" align="center" width="120">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="crisisClassId" label="检验类型" min-width="200px">
      </el-table-column>
      <el-table-column align="center" prop="crisisChildName" label="项目名称" min-width="200px">
      </el-table-column>
      <el-table-column align="center" prop="crisisChildEnName" label="英文缩写" min-width="200px">
      </el-table-column>
      <el-table-column align="center" prop="crisisChildShowName" label="显示名称" min-width="200px">
      </el-table-column>
      <el-table-column align="center" prop="crisisChildUnit" label="单位" min-width="200px">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" align="center" v-if="checkAuth('editDangerDict,deleteDangerDict')">
        <template slot-scope="scope">
          <el-button
                  v-uni:[scope.row.crisisChildDictId]="'jianyanxiangmu_childdelete'"
                  type="textred"
                  @click="itemDelete(scope.row)"
                  v-checkAuth="'deleteDangerDict'"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moduleMixin from '../../../assets/nrms/mixins/moduleMixin'
import { ApiDangerDictionary } from '../../../api/nrms'

export default {
  name: 'List',
  mixins: [moduleMixin],
  props: {
    crisisChildData: {
      type: Array,
      default: []
    }
  },
  computed: {
    // 计算属性的 getter
    tableData: function () {
      // `this` 指向 vm 实例
      return this.crisisChildData
    }
  },
  data () {
    return {
      loading: false,

    }
  },
  created () {
  },
  methods: {
    // 删除项目
    itemDelete (row) {
      let _row = JSON.parse(JSON.stringify(row))
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false
      }).then(() => {
        let deleteId = _row.crisisChildDictId
        this.$emit('reload',deleteId)
        // this.$parent.ruleForm.crisisChildDictIds.split(deleteId).join(',')
        // console.log('this.$parent.ruleForm.crisisChildDictIds',this.$parent.ruleForm.crisisChildDictIds)
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
</style>
