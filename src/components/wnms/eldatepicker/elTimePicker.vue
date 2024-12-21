<template>
  <div class="casual_paicker_main">

    <div v-for="(item, index) in timeValue"
         :key="index">
      <el-form-item :key="index"
                    :label="'探视时间' + (index + 1)"
                    label-width="150px">
        <!-- 任意时间段 -->
        <el-time-picker v-model="timeValue[index].start"
                        class="casual_paicker_statr"
                        value-format="HH:mm:ss"
                        placeholder="开始时间">
        </el-time-picker>
        <span>至</span>
        <el-time-picker v-model="
                      timeValue[index].end"
                        class="casual_paicker_end"
                        value-format="HH:mm:ss"
                        placeholder="结束时间">
        </el-time-picker>
        <div class="item-title"
             style="display: inline-block"
             @click="addOpenTime">
          &nbsp;
          <i class="el-icon-circle-plus-outline"
             style="cursor: pointer" />
        </div>
        <div class="item-title"
             style="display: inline-block">
          &nbsp;
          <i class="el-icon-remove-outline"
             style="cursor: pointer"
             @click="deleteTime(item,index,$event)" />
        </div>
      </el-form-item>
    </div>

  </div>

</template>
<script>
export default {
  data () {
    return {

    }
  },
  props: {
    //类型
    timeType: {
      type: String,
      require: true,
      default: () => {
        return 'casual' // 随意
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    timeValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  mounted () { },
  methods: {
    deleteTime (item, index, event) {
      console.log(item, index, event)
      if (this.value.length == 1) return this.$message("保留一条数据！")
      this.value.splice(index, 1)
    },
    // 添加
    addOpenTime () {
      if (this.value.length < 3) {
        this.value.push({
          start: '',
          end: ''
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.casual_paicker_main {
  span {
    font-size: 14px;
    color: #606266;
    margin-right: 1rem;
  }
}
</style>
