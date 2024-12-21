<template>
<div>
  <template v-for="item in data">
    <loop-table
      :key="item.key"
      v-if="item.type == 'table_column_loop'"
      :element="item"
      :data="data"
      :valueData="valueData"
      :assId="assId"
      @colValueChange="colValueChange"
      @changeLoopValueData="changeLoopValueData"
			@tableLoading="tableLoading"
      :firstLineAssTime="firstLineAssTime"
      :loopUpdate="loopUpdate"
      :patient="patient"
    >
     </loop-table>
    <form-common
      v-else
      :key="item.key"
      :element="item"
      :valueData="valueData"
      :data="data"
      :isEdit="isEdit"
      :father="father"
      :patient="patient"
      :tempList="tempList"
    ></form-common>
  </template>
</div>
</template>
<script>
import { ApiAssManage } from '../../../api/nrms/index'
export default {
  props: ['valueData', 'data', 'father', 'isEdit', 'assId', 'firstLineAssTime','patient','tempList'],
  data () {
    return {
      loopUpdate: true
    }
  },
  components: {
    FormCommon: () => import('./FormCommon'),
    LoopTable: () => import('./loopTable')
  },
  methods: {
    colValueChange (e) {
      this.$emit('colValueChange', e)
    },
    // 压疮循环数据处理
    async changeLoopValueData (index) {
      if (this.valueData.length > 0 && index > 0) {
        let valueData = JSON.parse(JSON.stringify(this.valueData))
        // this.valueData.splice(index, 1, valueData[index * 1 - 1 < 0 ? 0 : index * 1 - 1])
        let lastValueData = valueData[index * 1 - 1 < 0 ? 0 : index * 1 - 1]
        this.valueData[index].map((item, i) => {
          if (item.type == 'date') {
            return
          }
          item.value = lastValueData[i].value
          item.score = lastValueData[i].score
        })
      } else {
        try {
          let patientId = localStorage.getItem('formPatientId')
          let res = await ApiAssManage.getQueryLoop({
            assId: this.assId,
            patientId: patientId,
            assTimes: this.firstLineAssTime - 1
          })
          let lastValueData = res.data.assenssmentRecords[res.data.assenssmentRecords.length - 1].moduleValue
          this.valueData[index].map((item, i) => {
            if (item.type == 'date') {
              return
            }
            item.value = lastValueData[i].value
            item.score = lastValueData[i].score
          })
        } catch (error) {
          console.log(error)
        }
      }
      this.loopUpdate = false
      this.$nextTick(() => {
        this.loopUpdate = true
      })
    },
    tableLoading () {
      this.$emit('tableLoadingFun')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
