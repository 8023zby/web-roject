<template>
  <!--周月编辑排班-->
  <div style="position: relative">
    <!-- 编辑排班 -->
    <div v-if="flag" class="shift-item" ref="shiftItem" :class="{'not-allow-edit': isNotAllowEdit}">
      <div class="ul-hide-i" v-if="shiftList && shiftList.length">
        <ul @click="openDeptDutyDialog" :class="{active: dutyDialogVisible}">
          <li class="shift-item-duty" v-for="(item,index) in shiftList" :key="index"
              :style="{'background-color': item.shiftDetail.backgroundColor, 'color': item.shiftDetail.foregroundColor}">
            <span class="vacation-time"
                  v-if="item.shiftDetail.vacationTime"
                  :style="{'background-color': item.shiftDetail.extraType == 1?'#13CE66' : '#F56C6C'}">
              <span v-if="item.shiftDetail.extraType == 1">+</span>
              <span v-if="item.shiftDetail.extraType == 2">-</span>
              {{item.shiftDetail.vacationTime}}
            </span>
            <i v-if="item.shiftDetail.shiftImg"
               class="iconfont-hsms"
               :class="iconContrast[item.shiftDetail.shiftImg].id"></i>
            <span class="shift-item-name del-box" v-else>
                            {{item.shiftDetail.shiftName}}
                        </span>

          </li>
        </ul>
        <i class="el-icon-error del-i" @click="delAll"></i>
      </div>
      <div :class="{active: dutyDialogVisible}" @click="openDeptDutyDialog" v-else
           class="shift-item-duty please-select">请选择
      </div>
    </div>
    <!-- 编辑排班结束 -->
    <!-- 展示排班 -->
    <div v-else class="shift-item">
      <div v-if="shiftList && shiftList.length">
        <ul>
          <li class="shift-item-duty" v-for="(item,index) in shiftList" :key="index"
              :style="{'background-color': item.shiftDetail.backgroundColor, 'color': item.shiftDetail.foregroundColor}">
                        <span class="vacation-time" v-if="item.shiftDetail.vacationTime"
                              :style="{'background-color': item.shiftDetail.extraType == 1?'#13CE66' : '#F56C6C'}">
                          <span v-if="item.shiftDetail.extraType == 1">+</span>
                          <span v-if="item.shiftDetail.extraType == 2">-</span>
                          {{item.shiftDetail.vacationTime}}
                        </span>
            <i v-if="item.shiftDetail.shiftImg" class="iconfont-hsms"
               :class="iconContrast[item.shiftDetail.shiftImg].id"/>
            <span class="shift-item-name" v-else>{{item.shiftDetail.shiftName}}</span>
          </li>
        </ul>
      </div>
      <div v-else class="shift-item-duty"></div>
    </div>
    <!-- 展示排班结束 -->
    <!-------- 班次设置dialog start -------->
    <div v-if="dutyDialogVisible" class="duty-dialog"
         :style="{top: shiftList && shiftList.length? shiftList.length * 36 + 6 + 'px': '42px'}">
      <div class="dialog-box">
        <div>
          <h6>班次</h6>
          <ul class="usually">
            <li v-for="item in dutyData" :key="item.shiftType" v-if="item.shiftType != 'compose'" class="usually-item">
              <template v-if="item.list && item.list.length">
                <p>{{item.shiftTypeName}}</p>
                <el-checkbox-group v-model="item.checked" @change="changeDutyData">
                  <el-checkbox v-for="(v,i) in item.list" :key="i" :label="v.shiftId">{{v.shiftName}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </li>
          </ul>
        </div>
        <div style="margin-top: 29px" v-if="isShowCompose">
          <h6>组合班次</h6>
          <ul class="compose">
            <li v-for="item in dutyData" :key="item.shiftType" v-if="item.shiftType == 'compose'">
              <template v-if="item.list && item.list.length">
                <el-checkbox-group v-model="item.checked" @change="changeComposeDutyData">
                  <el-checkbox v-for="(v,i) in item.list" :key="i" :label="v.composeId">
                    <div v-html="getComposeDesc(v)"></div>
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </li>
          </ul>
        </div>
      </div>
      <div class="arrow"></div>
    </div>
    <!-------- 班次设置dialog end -------->
  </div>
</template>

<script>
import iconContrast from '../../views/hsms/nurseDuty/iconContrast'

export default {
  name: 'shift-manage',
  props: {
    srcData: null,
    // 日期
    dataId: null,
    // 是否编辑模式
    flag: null,
    // 所有班次信息
    dutyData: null,
    row: null,
    col: null,
    type: null,
    color: null,
    // 所有班次字体北京颜色
    dutyColor: null,
    showDialog: null,
    // [本周排班]时使用
    isNotAllowEdit: null,
    // 不能编辑的所有日期
    notAllowEdit: null
  },
  data () {
    return {
      dutyName: '',
      value: '',
      style: {
        background: '',
        color: ''
      },
      shiftList: [],
      dutyDialogVisible: false,
      composeId: '',
      iconContrast
    }
  },
  computed: {
    // 是否显示组合班次，根据当前行数据、当前日期中的所有班次
    isShowCompose () {
      let flag = true
      this.shiftList.map((item) => {
        if (item.shiftType === 'compose') {
          if (!item.list || !item.list.length) {
            flag = false
          }
        }
      })
      return flag
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.calStyle(val)
      }
    },
    showDialog: {
      handler (val) {
        if (!val) {
          this.dutyDialogVisible = false
        }
      }
    }
  },
  created () {
    this.shiftList = this.srcData[this.dataId]
    this.value = this.srcData[this.dataId + '__shiftId']
    // 处理班次的样式
    this.calStyle(this.value)
  },
  // 数据处理
  methods: {
    // 处理组合中每个班次的样式
    getComposeDesc (row) {
      let composeInfo = row.composeInfo || []
      let names = []
      if (composeInfo === []) {
        return
      }
      for (let i = 0; i < composeInfo.length; i++) {
        let item = composeInfo[i]
        // [禁用]增加删除线
        if (item.status === 0) {
          names.push(
            '<span style="text-decoration: line-through;">' +
              item.shiftName +
              '</span>'
          )
        } else {
          names.push('<span>' + item.shiftName + '</span>')
        }
      }
      return names.join('/')
    },
    calStyle (val) {
      if (this.dutyColor) {
        if (val) {
          if (this.dutyColor[val]) {
            this.style = {
              background:
                  this.dutyColor[val].backgroundColor || '',
              color: this.dutyColor[val].foregroundColor || ''
            }
          } else {
            this.style = {
              background: '',
              color: ''
            }
          }
        } else {
          this.style = {
            background: '',
            color: ''
          }
        }
      }
      this.$forceUpdate()
      if (this.style.color) {
        this.$nextTick(function () {
          // 使文字赋值颜色
          // eslint-disable-next-line no-undef
          $(
            '#' +
              this.col +
              '-' +
              this.row +
              ' .el-select .el-input__inner'
          ).css('color', this.style.color)
        })
      }
    },
    blur () {
      this.$refs.select.blur()
    },
    dealData (val) {
      let obj = {}
      let dutyObj = this.dutyData.find((item) => {
        return item.shiftId === val
      })
      if (!dutyObj) dutyObj = {}
      if (this.type === 'rule') {
        obj['dutyWeek'] = this.dataId
      } else {
        obj['dutyDate'] = this.dataId
      }
      obj['accountName'] = this.srcData.accountName
      obj['accountId'] = this.srcData.accountId
      obj['shiftId'] = val
      obj['sort'] = this.col + 1
      obj['shiftName'] = dutyObj.shiftName || ''
      const index = parseInt(this.row) * 7 + parseInt(this.col)
      this.$emit('dealSelData', obj, index)
    },
    selectFocus () {
      this.$emit('dealSelFocus', this.col + '-' + this.row)
    },

    /**
       * ------------------------------------------------------------------
       * 打开班次设置
       * ------------------------------------------------------------------
       */
    /**
       * @description: 打开班次库设置
       * @param {*}
       * @return {*}
       */
    openDeptDutyDialog () {
      if (this.isNotAllowEdit) {
        return
      }
      this.dutyData.map((item) => {
        item.checked = []
        this.shiftList.map((v) => {
          item.list.map((shiftItem) => {
            if (v.shiftDetail.shiftId === shiftItem.shiftId) {
              item.checked.push(shiftItem.shiftId)
            }
          })
        })
      })
      this.dutyDialogVisible = !this.dutyDialogVisible
      this.$emit('clickShiftItem', {
        row: this.row,
        col: this.col
      })
    },
    /**
       * @description: 监听checkbox变化
       * @param {*}
       * @return {*}
       */
    changeDutyData () {
      // 更新界面展示
      let totalArray = []
      this.dutyData.map((item) => {
        if (item.shiftType !== 'compose') {
          totalArray = totalArray.concat(item.checked)
        }
      })

      // 过滤掉删除的选项
      this.shiftList = this.shiftList.filter(
        (item) => totalArray.indexOf(item.shiftDetail.shiftId) >= 0
      )

      // 首选把已经存在的剔除掉
      totalArray = totalArray.filter((item) => {
        let delFlag = true
        this.shiftList.map((v) => {
          if (v.shiftDetail.shiftId === item) {
            delFlag = false
          }
        })
        return delFlag
      })
      if (this.shiftList.length < 3) {
        // 增加选中的选项

        // 再把剩余的拼接上
        totalArray = totalArray.map((item) => {
          let shiftDetail = {}
          this.dutyData.map((v) => {
            v.list.map((shiftItem) => {
              if (shiftItem.shiftId === item) {
                shiftDetail = shiftItem
              }
            })
          })
          return {
            shiftSort: this.shiftList.length + 1, // 当天该用户班次排序
            shiftDetail
          }
        })
        this.shiftList = this.shiftList.concat(totalArray)
      } else {
        this.$message.error('最多只能设置三个班次')
        this.dutyData.map((item) => {
          item.checked = item.checked.filter(
            (item) => totalArray.indexOf(item) < 0
          )
        })
      }
      let shiftList = this.shiftList.map((item, index) => {
        let res = {
          accountId: this.srcData.accountId,
          accountName: this.srcData.accountName,
          shiftId: item.shiftDetail.shiftId,
          shiftName: item.shiftDetail.shiftName,
          sort: this.col + 1,
          shiftSort: item.shiftSort || index + 1
        }
        if (this.type === 'rule') {
          res['dutyWeek'] = this.dataId
          res['dutyDate'] = this.dataId
        } else {
          res['dutyDate'] = this.dataId
        }
        return res
      })
      this.$emit('dutyDataChange', shiftList, {
        accountId: this.srcData.accountId,
        sort: this.col + 1,
        dutyDate: this.dataId
      })
    },
    /**
       * @description: 点击组合班次时，需求是将后面的几天都设置上
       * @param {*}
       * @return {*}
       */
    changeComposeDutyData () {
      let composeId = ''
      this.dutyData.map((item) => {
        if (item.shiftType === 'compose') {
          if (item.checked.length >= 2) {
            item.checked = [item.checked[item.checked.length - 1]]
          }
          composeId = item.checked[0] ? item.checked[0] : ''
        }
      })
      // 如果设置别的组合班次，则先把当前班次的删掉
      if (composeId && composeId !== this.composeId) {
        this.$emit('changeCompose', '', {
          accountId: this.srcData.accountId,
          sort: this.col + 1,
          row: this.row,
          col: this.col,
          accountName: this.srcData.accountName,
          notAllowEdit: this.notAllowEdit || []
        })
      }

      this.$emit('changeCompose', composeId, {
        accountId: this.srcData.accountId,
        sort: this.col + 1,
        row: this.row,
        col: this.col,
        accountName: this.srcData.accountName,
        type: this.type,
        notAllowEdit: this.notAllowEdit || []
      })
      if (composeId) {
        this.composeId = composeId
      }
    },
    delAll () {
      const that = this
      this.$confirm('确定要删除排班吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        that.shiftList = []
        that.$emit('dutyDataChange', [], {
          accountId: this.srcData.accountId,
          sort: this.col + 1,
          dutyDate: this.dataId
        })
        // that.openDeptDutyDialog()
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../public/static/hsms/icons/iconfont.css";

  /**
  * ------------------------------------------------------------------
  * 表格样式
  * ------------------------------------------------------------------
  */
  /deep/ .el-input__inner {
    background: transparent;
  }

  .shift-item {
    position: relative;
    margin: 5px 0;
    cursor: pointer;

    .active {
      border: 1px solid #1e87f0;

      li.shift-item-duty {
        width: 100%;
      }
    }
  }

  .shift-item-duty {
    height: 36px;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .shift-item-name {
    width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .ul-hide-i {
    position: relative;
    z-index: 1;
  }

  .ul-hide-i:hover {
    .del-i {
      display: block;
    }
  }

  .del-i {
    display: none;
    font-size: 20px;
    right: -10px;
    top: -6px;
    position: absolute;
    z-index: 999;
    background-color: #fff;
    border-radius: 50%;
  }

  .please-select {
    background: #ffffff;
    border: 1px solid #e8ebf3;
    border-radius: 2px;
    color: #cccece;
    justify-content: flex-start;
    padding-left: 12px;
  }

  .vacation-time {
    height: 14px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    font-size: 12px;
  }

  .not-allow-edit {
    background-color: #b5b5b5 !important;
    border-color: #b5b5b5 !important;
    color: #fff;
  }

  /**
  * ------------------------------------------------------------------
  * 弹出框样式
  * ------------------------------------------------------------------
  */
  .arrow {
    width: 5px;
    height: 5px;
    position: absolute;
    top: -3px;
    transform: rotate(45deg);
    left: 20px;
    background: #fff;
  }

  .duty-dialog {
    position: absolute;
    top: 95px;
    left: 0;
    width: 477px;
    background: #fff;
    text-align: left;
    z-index: 999;
    border: 1px solid #dadada;
    box-shadow: 0px 0px 19px 1px rgba(102, 102, 102, 0.3);
  }

  .dialog-box {
    position: relative;
    z-index: 1;
    background: #fff;
    padding: 23px 20px 20px;

    h6 {
      margin-bottom: 10px;
    }

    ul {
      background: #fafafa;
      border: 1px solid #eef0f6;
      border-radius: 2px;
      padding: 12px 0 0 20px;

      &.usually {
        max-height: 276px;
        overflow: auto;
      }

      &.compose {
        max-height: 109px;
        overflow: auto;

        /deep/ .el-checkbox-group {
          display: flex;
          flex-direction: column;

          .el-checkbox {
            margin-bottom: 20px;

            &:last-child {
              margin-bottom: 11px;
            }
          }
        }
      }

      .usually-item {
        display: flex;

        p {
          width: 47px;
          font-weight: 400;
          color: #666666;
          min-width: 47px;
          text-align: right;
          margin-right: 10px;
        }

        /deep/ .el-checkbox__label {
          width: 4em;
          max-width: 4em;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: text-top;
        }

        /deep/ .el-checkbox {
          margin-right: 10px;
          margin-bottom: 20px;

          &:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>
