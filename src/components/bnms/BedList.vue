<template>
  <div>
    <div v-show="true" class="bedCls-fun-main">
      <div id="bedCls-func-quan" class="noSelect" @click="handleCheckAllChange1">全选</div>
      <div id="bedCls-func-fan" class="noSelect" @click="handleCheckOtherChange1">反选</div>
      <div class="clear-both" />
    </div>

    <div class="bedCls">
      <div style="margin: 15px 0;" />
      <el-checkbox-group v-model="checkAllData" @change="handleCheckedChange">
        <el-checkbox
          v-for="item in srcData"
          :key="item.objId"
          :label="item.objId"
          style="width: 90px"
          :disabled="disabledBed.indexOf(','+item.objId+',')>-1"
        >{{ item.objName }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BedList',
  props: {
    srcData: {
      type: Array,
      default () {
        return []
      }
    },
    checkData: {
      type: Array,
      default () {
        return []
      }
    },
    disabledBed: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      dataObj: {},
      checkAll: false,
      checkAllData: [],
      checkedId: []
    }
  },
  watch: {
    checkData () {
      this.initObj()
    }
  },
  // 形成对照
  created () {
    this.initObj()
  },
  methods: {
    // 选择
    handleCheckedChange (val) {
      const obj = []
      for (let i = 0; i < val.length; i++) {
        obj.push({
          objId: val[i],
          objName: this.dataObj[val[i]]
        })
      }
      this.checkedId = obj
      this.putVal()
    },
    // 给父组件赋值
    putVal () {
      this.$emit('getBedOrRoomVal', this.checkedId)
    },
    // 增加对照
    initObj () {
      // 根据sort排序
      this.srcData.sort(function (a, b) {
        if (a.sort < b.sort) {
          return -1
        } else if (a.sort === b.sort) {
          return 0
        } else {
          return 1
        }
      })
      const all = this.srcData

      const temp = {}
      const checkedTemp = []
      const checkedData = this.checkData
      for (let i = 0; i < all.length; i++) {
        temp[all[i].objId] = all[i].objName
      }
      if (checkedData.length > 0) {
        for (let i = 0; i < checkedData.length; i++) {
          checkedTemp.push(checkedData[i].objId)
        }
      }
      this.dataObj = temp
      this.checkAllData = checkedTemp
    },
    handleCheckAllChange1 () {
      if (this.checkedId.length !== 0 || this.checkedId.length < this.srcData.length) {
        this.checkAll = !this.checkAll
      } else {
        this.checkAll = true
      }

      this.handleCheckAllChange(this.checkAll)
    },
    handleCheckOtherChange1 () {
      this.handleCheckOtherChange()
    },
    // 全选
    handleCheckAllChange (val) {
      this.checkedId = []
      const all = this.srcData
      const t = []
      const _disabledData = []
      const _checkedData = []
      for (let i = 0; i < all.length; i++) {
        if (this.disabledBed.indexOf(',' + all[i].objId + ',') > -1) {
          _disabledData.push(all[i].objId)
          _checkedData.push({
            objId: all[i].objId,
            objName: all[i].objName
          })
          continue
        }
        // 把不能操作的选项，重新付给 选中状态
        t.push(all[i].objId)
        this.checkedId.push({
          objId: all[i].objId,
          objName: all[i].objName
        })
      }
      this.checkAllData = val ? t.concat(_disabledData) : _disabledData

      this.checkedId = val ? this.checkedId.concat(_checkedData) : _checkedData
      this.putVal()
    },
    // 反选
    handleCheckOtherChange () {
      this.checkAll = false
      this.checkedId = []
      const d = this.checkAllData
      const all = this.srcData
      const t = []
      const str = ',' + d.join(',') + ','

      const _disabledData = []
      const _checkedData = []

      for (let i = 0; i < all.length; i++) {
        if (str.indexOf(',' + all[i].objId + ',') === -1) { // 已选中的跳过
          if (this.disabledBed.indexOf(',' + all[i].objId + ',') > -1) { // 不允许修改的跳过
            continue
          }
          t.push(all[i].objId)

          this.checkedId.push({
            objId: all[i].objId,
            objName: all[i].objName
          })
        }
      }

      // 还原之前选中的那部分数据
      for (let i = 0; i < all.length; i++) {
        if (this.disabledBed.indexOf(',' + all[i].objId + ',') > -1) {
          _disabledData.push(all[i].objId)
          _checkedData.push({
            objId: all[i].objId,
            objName: all[i].objName
          })
          continue
        }
      }

      this.checkAllData = t.concat(_disabledData)
      this.checkedId = this.checkedId.concat(_checkedData)

      this.putVal()
    }
  }
}
</script>

<style lang="scss" scoped>
  .clear-both {
    clear: both;
  }

  .bedCls {
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    padding: 0 5px 15px 25px;
  }

  .bedCls-fun-main {
    width: 170px;
    margin: 0 0 20px 0;

    #bedCls-func-quan {
      color: #1E87F0;
      width: 68px;
      height: 26px;
      text-align: center;
      border: 1px solid #1E87F0;
      line-height: 26px;
      border-radius: 2px;
      cursor: pointer;
      font-family: "MicrosoftYaHei";
      float: left;
    }

    #bedCls-func-fan {
      color: #1E87F0;
      width: 68px;
      height: 26px;
      text-align: center;
      border: 1px solid #1E87F0;
      line-height: 26px;
      border-radius: 2px;
      cursor: pointer;
      font-family: "MicrosoftYaHei";
      float: right;
    }

  }

  /deep/ .el-checkbox__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    vertical-align: middle;
  }

</style>
