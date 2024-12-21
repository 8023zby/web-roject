<template>
  <!--月编辑排班-->
  <div>
    <el-select
      v-if="(flag && (data.dateId1 >= firstDay && data.dateId1 <= lastDay) && tit.indexOf('month') === -1 && tit.indexOf('tit') === -1)"
      ref="select"
      v-model="value"
      clearable
      filterable
      placeholder="请选择"
      @focus="selectFocus"
      @change="dealData">
      <el-option
        v-for="item in userData"
        :key="item.value"
        :label="item.empName"
        :value="item.empId">
      </el-option>
    </el-select>
    <template v-else>
      <template v-if="empName.length > 6">
        <el-tooltip class="item"
                    effect="dark"
                    :content="empName"
                    placement="top-start">
          <span>{{filter(empName)}}</span>
        </el-tooltip>
      </template>
      <template v-else>
        <span>{{empName}}</span>
      </template>

    </template>

  </div>
</template>

<script>
export default {
  name: 'month-shift',
  props: ['data', 'flag', 'userData', 'row', 'col', 'firstDay', 'lastDay'],
  data () {
    return {
      empName: '',
      value: '',
      tit: ''
    }
  },
  created () {
    this.tit = this.data.id + ''
    this.value = this.data.name + ''
    this.empName = this.data.val + ''// this.data.name.substr(5, 9);//this.data.val + ''
    if (this.data.title) {
      this.empName = this.data.title
    }
  },
  // 数据处理
  methods: {
    filter (str) {
      return str.substring(0, 6) + '...'
    },
    blur () {
      this.$refs.select.blur()
    },
    dealData () {
      let obj = {}
      let userObj = this.userData.find((item) => {
        return item.empId === this.value
      })
      if (!userObj) userObj = {}
      obj['empId'] = this.value
      obj['empName'] = userObj.empName || ''
      this.$emit('dealSelData', obj, this.row, this.col)
    },
    selectFocus () {
      this.$emit('dealSelFocus', this.col + '-' + this.row)
    }
  }
}
</script>

<style scoped>

</style>
