<template>
  <div>
    <div class="bedCls-fun-main" v-show="true">
      <div v-uni="'chuangweiliebiao_quanxuan'" class="bedCls-func-quan" @click="handleCheckAllChange1">全选</div>
      <div v-uni="'chuangweiliebiao_fanxuan'" class="bedCls-func-fan" @click="handleCheckOtherChange1">反选</div>
      <div class="clear-both"></div>
    </div>

    <div class="bedCls" :class="emptyCheck ? 'red-border' : ''">
      <!--el-checkbox v-show="false" id="checkAll" class="bedCls-checkAll" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox v-show="false" id="checkOtherAll" class="bedCls-checkOtherAll" v-model="checkOtherAll" @change="handleCheckOtherChange">反选</el-checkbox-->

      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkAllData" v-uni="'chuangweiliebiao_change'" @change="handleCheckedChange">
        <el-checkbox v-for="item in srcData" :label="item.objId"
                     style="width: 90px"
                     v-bind:disabled="disabledStr.indexOf(','+item.objId+',')>-1" :key="item.objId">{{item.objName}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bed-list',
  props: ['srcData', 'checkData', 'disabledBed', 'type', 'emptyCheck'],
  data () {
    return {
      dataObj: {},
      disabledStr: '',
      checkAll: false,
      checkAllData: [],
      checkOtherAll: false,
      checkedId: []
      // isFirst: false,
    }
  },
  watch: {
    disabledBed () {
      this.disabledStr = this.disabledBed || ''
      this.initObj()
    }
  },
  // 形成对照
  created () {
    // console.log(this.disabledBed)
    this.disabledStr = this.disabledBed || ''
    this.initObj()
    // console.log(this.type);
    // // 先床后房
    // if(this.type[0] === true){// 管床
    //   this.isFirst = true;
    // }else{// 管房
    //   this.isFirst = false;
    // }
  },
  methods: {
    // 选择
    handleCheckedChange (val) {
      let obj = []
      for (let i = 0; i < val.length; i++) {
        obj.push({
          objId: val[i],
          nurseMode: this.type,
          objName: this.dataObj[val[i]]
        })
      }
      this.checkedId = obj
      this.putVal()
    },
    // 给父组件赋值
    putVal () {
      this.$emit('getBedOrRoomVal', this.checkedId, this.type)
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
      let all = this.srcData
      // console.log(all)
      let temp = {}
      let checkedTemp = []
      let checkedData = this.checkData
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
      // console.log(this.srcData);
      // console.log(this.checkedId);
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
      // console.log(val);
      this.checkedId = []
      this.checkOtherAll = false
      let all = this.srcData
      let t = []
      for (let i = 0; i < all.length; i++) {
        if (this.disabledStr.indexOf(',' + all[i].objId + ',') > -1) {
          continue
        }
        t.push(all[i].objId)
        this.checkedId.push({
          objId: all[i].objId,
          objName: all[i].objName,
          nurseMode: this.type
        })
      }
      this.checkAllData = val ? t : []
      this.checkedId = val ? this.checkedId : []
      this.putVal()
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
          if (this.disabledStr.indexOf(',' + all[i].objId + ',') > -1) {
            continue
          }
          t.push(all[i].objId)
          this.checkedId.push({
            objId: all[i].objId,
            objName: all[i].objName,
            nurseMode: this.type
          })
        }
      }
      this.checkAllData = t
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
  .red-border{
    border: 1px solid #F56C6C;
  }

  .bedCls-fun-main {
    width: 170px;
    margin: 0 0 20px 0;

    .bedCls-func-quan {
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

    .bedCls-func-fan {
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
    #div_chuangweiliebiaofanxuan,#div_chuangweiliebiaoquanxuan{
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
    #div_chuangweiliebiaoquanxuan{
      float: left;
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
