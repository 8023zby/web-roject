<template>
  <div>
    <div class="bedCls-fun-main" v-show="true">
      <div id="bedCls-func-quan" @click="handleCheckAllChange1">全选</div>
      <div id="bedCls-func-fan" @click="handleCheckOtherChange">反选</div>
      <div class="clear-both"></div>
    </div>

    <div class="bedCls">
      <el-checkbox-group v-model="checkAllData" @change="handleCheckedChange">
        <el-checkbox v-for="item in srcData" :label="item.objId" style="width: 75px" :disabled="disabledStr.indexOf(item.objId)>-1" :key="item.objId">{{item.objName}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bed-list',
  props: ['srcData', 'checkData', 'disabledBedRoom'],
  data () {
    return {
      dataObj: {},
      disabledStr: '',
      checkAll: false,
      checkAllData: [],
      checkOtherAll: false,
      checkedId: []
    }
  },
  // 形成对照
  created () {
    this.disabledStr = this.disabledBedRoom || ''

    this.checkAllData = (this.checkData && this.checkData.split(',')) || []
    this.initObj()
  },
  watch: {
    disabledBedRoom: {
      handler (val) {
        this.disabledStr = val
      },
      immediate: true
    },
    checkData: {
      handler (val) {
        this.checkAllData = val ? val.split(',') : []
      },
      immediate: true
    }
  },
  methods: {
    // 选择
    handleCheckedChange (val) {
      let obj = []
      for (let i = 0; i < val.length; i++) {
        obj.push({
          objId: val[i],
          objName: this.dataObj[val[i]]
        })
      }
      this.checkedId = obj
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
    },
    handleCheckAllChange1 () {
      if (this.checkedId.length !== 0 || this.checkedId.length < this.srcData.length) {
        this.checkAll = !this.checkAll
      } else {
        this.checkAll = true
      }

      this.handleCheckAllChange(this.checkAll)
    },
    // 全选
    handleCheckAllChange (val) {
      this.checkedId = []
      this.checkOtherAll = false
      let all = this.srcData
      let t = []
      for (let i = 0; i < all.length; i++) {
        if (this.disabledStr.indexOf(all[i].objId) > -1) {
          continue
        }
        t.push(all[i].objId)
        this.checkedId.push({
          objId: all[i].objId,
          objName: all[i].objName
        })
      }
      this.checkAllData = val ? t : []
      this.checkedId = val ? this.checkedId : []
    },
    // 反选
    handleCheckOtherChange () {
      this.checkAll = false
      this.checkedId = []
      let d = this.checkAllData
      let all = this.srcData
      let t = []
      let str = ',' + d.join(',') + ','
      for (let i = 0; i < all.length; i++) {
        if (str.indexOf(',' + all[i].objId + ',') === -1) {
          if (this.disabledStr.indexOf(all[i].objId) > -1) {
            continue
          }
          t.push(all[i].objId)
          this.checkedId.push({
            objId: all[i].objId,
            objName: all[i].objName
          })
        }
      }
      this.checkAllData = t

      if (this.checkAllData.length === this.srcData.length) {
        this.checkAll = true
      }
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .clear-both {
    clear: both;
  }

  .bedCls {
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    padding: 5px;
    overflow-y: auto;
    max-height: 272px;
    /deep/.el-checkbox{
      margin-right: 5px;
     .el-checkbox__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 75%;
      vertical-align: middle;
       padding-left: 8px;
    }
    }
  }

  .bedCls-fun-main {
    margin: 10px 0 20px 0;

    #bedCls-func-quan {
      color: #1E87F0;
      width: 78px;
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
      width: 78px;
      height: 26px;
      text-align: center;
      border: 1px solid #1E87F0;
      line-height: 26px;
      border-radius: 2px;
      cursor: pointer;
      font-family: "MicrosoftYaHei";
      float: left;
      margin-left: 24px;
    }

  }

</style>
